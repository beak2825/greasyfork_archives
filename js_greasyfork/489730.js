// ==UserScript==
// @name         曼孚新平台-标注工具（Dev）
// @namespace    http://tampermonkey.net/
// @version      2024.3.25.1 Dev
// @description  try to
// @author       You
// @match        https://label.mindflow.com.cn/pointCloudPro?*
// @icon         https://label.mindflow.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489730/%E6%9B%BC%E5%AD%9A%E6%96%B0%E5%B9%B3%E5%8F%B0-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7%EF%BC%88Dev%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/489730/%E6%9B%BC%E5%AD%9A%E6%96%B0%E5%B9%B3%E5%8F%B0-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7%EF%BC%88Dev%EF%BC%89.meta.js
// ==/UserScript==

(async function() {
	'use strict';

/**==================================

键盘快捷键：
【B】        ==>  聚焦选中的个体
【F】        ==>  控制23D框的显隐
【Tab】      ==>  三视图被放大时，切换三视图；三视图没被放大时，调出个体属性面板
【Shift+Z】  ==>  切换点云渲染方案（高度渲染 <==> 自定义渲染）
【;】        ==>  开启/关闭 切换个体时，自动调出个体属性面板
【O】        ==>  展示/隐藏 映射图C4、C5、C6、C7
【` / Alt+`】==>  显示个体分类选择弹框（Alt+` 可以在个体属性面板显示时生效）
数字键盘     ==>  选择相机视角(8:前方  2:后方  7:左前  9:右前  1:左后  3:右后  5:缩放复原  Enter: 放大/缩小)


鼠标快捷键：
中键：
- 关闭个体属性面板（个体属性面板范围内触发）
- 删除3D框（个体属性面板范围外触发）

右键
- 拖动个体属性面板
- 缩放三视图

其他功能：
- 检查（头部栏靠右位置）：点击可以调出检查面板，自动进行车尾灯属性检查
- 个体属性面板的勾选反馈：
  - 映射图提示 3D框细分类型、是否关键
  - 三视图提示雷达属性值
  - 个体面板的点云遮挡和点云截断不为0时，蓝色高亮提醒
  - 给定速腾雷达后，点云遮挡和点云截断不为0时，红色闪烁提醒
  - 3D框处于前方80m范围内时，车尾灯属性字样用蓝色提示；前放80m范围外时，灰色提示；临界处黄色提示。同时，映射图C9、C11的相机编号标签会同步颜色提示

自动生效：
- 隐藏映射图C4、C5、C6、C7
- 贴边滚动映射图
- 鼠标右键缩放三视图
- 选中对象时自动开启关联映射，失焦时自动关闭
- 保持隐藏映射图2D框
- 增加 点云遮挡、点云截断、2D映射截断 的标签颜色反馈


审核模式：
【Tab】调出批改面板

==================================**/
	Element.prototype.$ = $
	Document.prototype.$ = $
	window.$ = $
	window.$$ = $$
	
	var ds = {
		isHide23D: false,
		isHide23DControllable: true,
		isAutoOpenAttrPanel: false,
		objListObserver: void 0,
		isHideMappingImg: false,
		isObserveDrawer: false,
		frames: [], //请求到的帧列表
		allTypeAttr: [], //请求到的所有帧个体数据
		allTarget: [], //简化后的所有帧的个体的数据
		taskId: '',
		jobId: '',
		// curTarget: null,
		// curTargetName: void 0,
	}
	
	const originalXHR = window.XMLHttpRequest;
	const baseURL = 'https://apipro.mindflow.com.cn/labelcenter/v1'
	window.XMLHttpRequest = function () {
		let xhr = new originalXHR();

		xhr.addEventListener('readystatechange', function () {
			if(xhr.readyState !== 4 || xhr.status !== 200) return
			
			let url = xhr.responseURL
			url = url.includes('?') ? /^(.*)\?/.exec(url)[1] : url
			
			const res = JSON.parse(xhr.responseText)
			if(res.code !== 200) return

			if (url === `${baseURL}/task/info`) {
				const data = res.data
				ds.taskId = data.taskId
				ds.jobId = data.jobId
				ds.frames = data.frameList.map(frame => frame.frameId)
				console.log(ds.frames)
			}
			
			if(url === `${baseURL}/config/label_schema`) {
				const attrMap = res.data.labelGroup.labelGroupList[0].labelToolList.filter(item => item.properties.length !== 0)
				ds.allTypeAttr = attrMap
				console.log(res.data)
			}

		});
		return xhr;
	};

	

	if(await init()) {
		showMessage('脚本已生效', {type: 'success'})
	} else {
		return alert('脚本加载失败，请刷新重试！')
	}
	

	let cameraAngleMap = new Map([
		[104, [8, 10]],
		[105, 9],
		[99, 2],
		[98, 0],
		[97, 1],
		[103, 7],
		[13, 'blow_up_down'],
		[101, 'refresh']
	]);

	const attrKeyMap = {
		'雷达属性': 'radar',
		'车辆类型': 'type',
        '类型': 'type',
		'开门属性': 'door',
		'是否为关键障碍物': 'key',
		'点云遮挡属性': 'pcObstruct',
		'点云截断属性': 'pcTruncate',
		'2D映射图截断': 'phTruncate',
		'2D映射图遮挡': 'phObstruct',
		'车尾灯状态': 'rearLight',
	}

	function MappingImgVis(visibility) {
		let allMappingImg = document.querySelectorAll('.x-image-mapping');
		[3, 4, 5, 6].forEach((item) => {
			allMappingImg[item].querySelector('.x-image-mapping__item__left__name').style.background = 'red';
			allMappingImg[item].style.display = visibility ? 'block' : 'none'
		});
		ds.isHideMappingImg = !visibility

		document.querySelector('.dragContainer.right-container').dispatchEvent(new MouseEvent('mousedown'))
		document.dispatchEvent(new MouseEvent('mouseup'))
	}
	MappingImgVis(false)

	//贴边滚动
	setElStyle(new Map([
		[[$('.left-wrapper'), $('.left-wrapper .el-scrollbar__wrap')], {
			padding: 0,
		}],
		[$('.el-scrollbar.image-mapping-container'), {
			padding: '0px 5px 0px 5px',
		}],
		[$('.left-wrapper .el-scrollbar__wrap'), {
			display: 'flex',
			flexDirection: 'column',
		}],
	]))
	
	let objListBtn = $('.drawer').nextElementSibling.$('.operate-item.el-tooltip__trigger')
	if(!objListBtn.className.includes('selected')) objListBtn.click()
	
	$$('.box-title').forEach(tit => (tit.style.transition = '.3s all'))
	
	//新增关键属性提示Label
	$$('.map-wrapper .el-scrollbar__view .x-image-mapping').some(mappingImg => {
		let tip_wrap = document.createElement('div')
		let tip_keyLabel = document.createElement('div')
		let tip_typeLabel = document.createElement('div')
		let tip_typeLabel_follow = document.createElement('div')
		tip_keyLabel.className = 'key-tip'
		tip_typeLabel.className = 'type-tip'
		tip_typeLabel_follow.className = 'type-tip-follow'
		
		setElStyle(new Map([
			[tip_wrap, {
				display: 'flex',
				position: 'absolute',
				right: '0px',
				bottom: '3px',
				// transition: '.3s all',
			}], [[tip_keyLabel, tip_typeLabel], {
				display: 'none',
				marginRight: '3px',
				padding: '0 4px',
				height: '18px',
				lineHeight: '18px',
				textAlign: 'center',
				color: '#fff',
				borderRadius: '5px',
			}],
		]))
		
		tip_wrap.appendChild(tip_typeLabel)
		tip_wrap.appendChild(tip_keyLabel)
		mappingImg.appendChild(tip_wrap)
		
		let isEnter = false
		let mappingImgSite
		mappingImg.addEventListener('mouseenter', (e) => {
			isEnter = true
			mappingImgSite = mappingImg.getBoundingClientRect()
			tip_wrap.style.top = 0;
			tip_wrap.style.left = 0;
			tip_wrap.style.right = null;
			tip_wrap.style.bottom = null;
		})
		mappingImg.addEventListener('mousemove', (e) => {
			if(!isEnter) return
			let {clientX: x, clientY: y} = e
			tip_wrap.style.transform = `translate(${x - mappingImgSite.x + 10}px, ${y - mappingImgSite.y + 15}px)`
			// tip_wrap.style.left = x - mappingImgSite.x + 10 + 'px';
			// tip_wrap.style.top = y - mappingImgSite.y + 15 + 'px';
		})
		mappingImg.addEventListener('mouseleave', (e) => {
			isEnter = false
			tip_wrap.style.top = null;
			tip_wrap.style.left = null;
			tip_wrap.style.right = '3px';
			tip_wrap.style.bottom = '3px';
			tip_wrap.style.transform = null
			
		})
	})
	
	

	let vps = [...document.querySelector('.viewport-bottom').querySelectorAll('.box-wrapper')];
	vps.some((vp) => {
		clickTrigger(vp, () => {
			vp.querySelector('.box-scale-icon').click()
		}, 3, 5)
	});

	//隐藏映射图2D框
	let control2dBtn = [...document.querySelectorAll('.iconfont.icon-annotation-2D-show')].find((btn) => btn.style.display !== 'none') //按钮的三种状态：全显、全隐、独显
	let control3D_btn
	if(control3D_btn = document.querySelector('.icon-annotation-wei3D-show')) {
	} else if(control3D_btn = document.querySelector('.icon-annotation-wei3D-hide')) {
	} else if(control3D_btn = document.querySelector('.icon-annotation-wei3D-show-half')) {}
	new MutationObserver((mrs) => {
		mrs.some((mr) => {
			if(!/hide/.test(mr.target.className) && !( /show-half/.test(mr.target.className) && /show-half/.test(control3D_btn.className) )) control2dBtn.click() //23D同处于独显 ==>  不切换2D状态
		})
	}).observe(control2dBtn, {childList: true, attributes: true, attributeFilter: ['class']})
	control2dBtn.click()
	
	//创建检查面板
	initCheckPanel()
	


	//选中对象时自动开启关联映射，失焦时自动关闭
	let timer_closeLinkmapping
	new MutationObserver((mrs) => {
		mrs.some((mr) => {
			// console.log(mr)
			//至少一张存在关联关系 ==> 开启
			if(mr.target.className.includes('x-image-mapping__item__left__name') && mr.oldValue == "x-image-mapping__item__left__name el-tooltip__trigger el-tooltip__trigger") {
				return (operateLinkmappingBtn(true), true)
			}

			//无映射关联时 ==> 关闭
			if(mr.addedNodes[0]?.className?.includes('no-reference')) { //暂无映射相机提示
				removeOuterTip()
				operateLinkmappingBtn(false)
			};
		})
	}).observe($('.left-wrapper .el-scrollbar__view'), { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})



    const rearLightTip_debounce = debounce(() => {
        rearLightTip()
    }, 300);
    Observe($('.mf-resize-container .container'), (mrs) => {
        if(['中型车', '大型车'].includes($('.mf-resize-container .container .tool-name').textContent)) {
            rearLightTip_debounce()
        }
    })

	//控制关联映射按钮
	function operateLinkmappingBtn(isOpen) {
		let linkMapBtn = document.querySelector('.left-header__icon')
		if(linkMapBtn.querySelector(isOpen ? '.icon-allCamera' : '.icon-mappingCamera')) linkMapBtn.click()
	}

	function wei23DVis(vis) {
		let control2D_btn = $$('.icon-annotation-2D-show, .icon-annotation-2D-hide, .icon-annotation-2D-show-half').find((btn) => btn.style.display !== 'none')
		let control3D_btn = $$('.icon-annotation-wei3D-show, .icon-annotation-wei3D-hide, .icon-annotation-wei3D-show-half').find((btn) => btn.style.display !== 'none')

		if(vis) {
			if(/show(?!-half)/.test(control3D_btn.className)) {
				return (ds.isHide23DControllable = true)
			} else {
				control3D_btn.click()
				setTimeout(() => {wei23DVis(true)}, 200)
			}
		} else {
			if(control2D_btn.className.includes('hide') && control3D_btn.className.includes('hide')) return (ds.isHide23DControllable = true)
			if(!control2D_btn.className.includes('hide')) control2D_btn.click()
			if(!control3D_btn.className.includes('hide')) control3D_btn.click();
			setTimeout(() => {wei23DVis(false)}, 200)
		}
	}

	function analyseAttr() {
		const attrMap = {}
		const allAttrItem = [...document.querySelector('.el-tree.arrtribute-tree').children].filter(item => item.className.includes('arrtribute-tree-node'))
		allAttrItem.forEach((item) => {
			attrMap[attrKeyMap[item.querySelector('.tooltip-wrapper').innerText]] = [item.querySelector('.label-tag-box').innerText, item.querySelector('.label-tag-box').querySelector('.item-tag')]
		});
		return attrMap
	}

	let left, top
	let isLock = false
	let isDown = false
	window.addEventListener('mousemove', (e) => {
		if(!isDown && e.button !== 2) return

		const attriPanel = $('.attribute-container')
		left = attriPanel.style.left = +/(.*)px/.exec(attriPanel.style.left)[1] + e.movementX + 'px'
		top = attriPanel.style.top = +/(.*)px/.exec(attriPanel.style.top)[1] + e.movementY + 'px'
		console.log('move', isDown)
	})

	new MutationObserver((mrs) => {
		mrs.some((mr) => {
			// console.log(222, mr);
			[...mr.addedNodes].some((an) => {
				// console.log(123, an)
				if(an.className === 'attribute-container') {
					an.$('.title').style.cursor = 'default'; //去除反馈
					an.style.left = left
					an.style.top = top

					an.addEventListener('mousedown', (e) => {
						if(e.button !== 2) return
						isDown = true
						isLock = true
						console.log('down', e)
					})


					an.addEventListener('mouseup', (e) => {
						if(e.button !== 2) return
						isDown = false
						console.log('up', e)
					})

					clickTrigger(an, () => {
						an.querySelector('.close').click()
					}, 2, 2)
					an.style.background = 'rgba(34, 34, 37, .9)'
					an.$('.el-tree.arrtribute-tree').style.background = 'transparent'
				}

				if(an.className === 'el-tree arrtribute-tree') {
                    // $('.attribute-container').style.display = 'none' //先隐藏
                    // let attrItems = $$('.attribute-container .el-tree > .el-tree-node')?.reverse()
                    // attrItems.some((item, idx) => {
                    //     setTimeout(() => {
                    //         item.click()
                    //         if(idx === attrItems.length-1) {
                    //             $('.attribute-container').style.display = 'block'
                    //         }
                    //     })
                    // })
                    let attrPanel = $('.attribute-container')
                    let attrItems = $$('.attribute-container .el-tree > .el-tree-node')
                    attrItems.some((item, idx) => {
                        item.addEventListener('click', () => {
                            if(!isLock) return
                            attrPanel.style.left = left
                            attrPanel.style.top = top
                        })
                    })

					let attrMap = analyseAttr()
					console.log('appear', attrMap)
					
					attrTip(attrMap, {state: 'show'})

					new MutationObserver((mrs) => {
						mrs.some((mr) => {
							if(mr.type === 'attributes' && isLock && mr.target.className === 'attribute-container') { //当点击展开/关闭个体属性项时，或选择个体属性值，或刚面板首次展示时，会还原篡改的定位值。
								mr.target.style.left = left
								mr.target.style.top = top
							}
							if(mr.target.className.includes('label-tag-box')) {
								let changeAttr = mr.target.previousSibling?.querySelector('.tooltip-wrapper').innerText
								let attrMap = analyseAttr()
								console.log('check', attrMap)
								attrTip(attrMap, { state: 'attrChange', attrChange: changeAttr })
							}
						})
					}).observe($('.attribute-container'), {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['style']}) //监控个体属性面板
				}
				
// 				if() {
					
// 				}

				if(an.className === 'hotkey-bar-wrapper' && an.innerText.includes('三视图微调')) an.$('.icon-annotation-close').click()
				if(an.className === 'hotkey-bar-wrapper' && an.innerText.includes('快速放大/缩小视角')) an.$('.icon-annotation-close').click()

				if(mr.target.classList.contains('label-container')) {
					an.children[0].style.background = '#222225'
					an.children[0].style.transition = '.3s all'
				}
			});

			[...mr.removedNodes].some((an) => {
				if(an.className === 'attribute-container' ) {
					if(!$('.object-list')) {
						removeOuterTip()
					}
					isDown = false

					// else {
					// 	setTimeout(() => {
					// 		if(!$('.object-list') && ds.curTarget) return
					// 		ds.curTarget = $$('.object-list .object-item').find(item => item.classList.contains('is-expanded'))
					// 		ds.curTargetName = /(.*)（/.exec(ds.curTarget.parentElement.previousElementSibling.$('.tool-label').textContent)[1] + ds.curTarget.$('.object-item-list').textContent
					// 		console.log(ds.curTargetName)
					// 	})
					// }
				}
			})
		})
	}).observe($('.main'), {childList: true, subtree: true})

	function attrTip(attrMap, config = {}) {
		//截断和遮挡的提示
		if(attrMap.radar[1] && attrMap.radar[0] == '速腾') {
			const kyEffect = new KeyframeEffect(null, {
				background: ['#ffffff1a', 'firebrick']
			}, {
				duration: 500,
				iterations: Infinity,
				direction: 'alternate'
			})

			if(attrMap.pcObstruct[1] && attrMap.pcObstruct[0] == '有遮挡') {
				const ky = new KeyframeEffect(kyEffect);
				ky.target = attrMap.pcObstruct[1];
				let ani = new Animation(ky);
				ani.play();
			}
			if(attrMap.pcTruncate[1] && attrMap.pcTruncate[0] == '有截断') {
				const ky = new KeyframeEffect(kyEffect);
				ky.target = attrMap.pcTruncate[1];
				let ani = new Animation(ky);
				ani.play();
			}
		} else if(attrMap.radar[0] == '华为') {
			if(attrMap.pcObstruct[1] && attrMap.pcObstruct[0] == '有遮挡') {
				console.log('pcObst', attrMap.pcObstruct[1])
				attrMap.pcObstruct[1].getAnimations().forEach(ani => ani.cancel())
				attrMap.pcObstruct[1].style.background = 'mediumblue'
			}
			if(attrMap.pcTruncate[1] && attrMap.pcTruncate[0] == '有截断') {
				attrMap.pcTruncate[1].getAnimations().forEach(ani => ani.cancel())
				attrMap.pcTruncate[1].style.background = 'mediumblue'
			}
		} else if(attrMap.radar[0] == '') {
			if(attrMap.pcObstruct[1] && attrMap.pcObstruct[0] == '有遮挡') {
				attrMap.pcObstruct[1].getAnimations().forEach(ani => ani.cancel())
				attrMap.pcObstruct[1].style.background = '#ffffff1a'
			}
			if(attrMap.pcTruncate[1] && attrMap.pcTruncate[0] == '有截断') {
				attrMap.pcTruncate[1].getAnimations().forEach(ani => ani.cancel())
				attrMap.pcTruncate[1].style.background = '#ffffff1a'
			}
		}

		if(attrMap.phTruncate[1] && attrMap.phTruncate[0] && attrMap.phTruncate[0] !== '没有截断') {
			attrMap.phTruncate[1].style.background = 'mediumblue';
		} else if(attrMap.phTruncate[1]){
			attrMap.phTruncate[1].style.background = '#ffffff1a'
		}

		// if(attrMap.radar[0] == '关键障碍物') {
		//关键属性的提示
		let keyValue = attrMap.key[0]
		let allKeyTips = Array.from(document.querySelectorAll('.key-tip'))
		allKeyTips.forEach(tip => {
			if(!keyValue) return (tip.style.display = 'none');

			tip.style.display = 'block'
			const isKey = keyValue === '关键障碍物'

			tip.textContent = isKey ? '关键' : '非关'
			tip.style.background = isKey ? '#e10000' : 'gray'

		})
		
		let typeValue = attrMap.type[0]
		let allTypeTips = Array.from(document.querySelectorAll('.type-tip'))
		allTypeTips.forEach(tip => {
			if(!typeValue) return (tip.style.display = 'none');
			
			tip.style.display = 'block';

			tip.textContent = typeValue
		})

		if((config?.state === 'show') || (config?.state === 'attrChange' && config?.attrChange === '雷达属性')) {
			// const curTarget = $$('.object-list .object-item').find(item => item.classList.contains('is-expanded'))
			// const curTargetName = /(.*)（/.exec(ds.curTarget.parentElement.previousElementSibling.$('.tool-label').textContent)[1] + ds.curTarget.$('.object-item-list').textContent
			let radarValue = attrMap.radar[0]
			//雷达属性的提示
			let allThreeViewsLabel = $$('.size-label-x>:first-child, .size-label-y>:first-child, .box-title')
			allThreeViewsLabel.forEach(label => {
				// label.getAnimations().forEach(ani => ani.cancel())

				if(['华为', '速腾'].includes(radarValue)) {
					label.style.background = radarValue === '华为' ? 'blue' : '#00BF00'
					
				} else {
					label.style.background = '#222225'
				}
			})
		}

		//rearlight tip
		let cameraLabel = $$('.x-image-mapping__item__left__name').filter(cameraLabel => ['C9', 'C11'].includes(cameraLabel.innerText))
		cameraLabel.some(label => {
			label.style.background = null
			label.style.boxShadow = null
		})
		if(attrMap?.rearLight) {
			rearLightTip()
		}
	}
    function getRadarOuterTipAni(color) {
        return new KeyframeEffect(null, {
            // background: ['transparent', color]
            background: [color]
        }, {
            duration: 300,
            iterations: 1,
            direction: 'alternate',
            fill: 'forwards',
            ease: 'ease-out',
        })
    }
	function rearLightTip() {
		let cameraLabel = $$('.x-image-mapping__item__left__name').filter(cameraLabel => ['C9', 'C11'].includes(cameraLabel.innerText))
		let geometryInfo = {}
		let rearTit = $$('.attribute-container .tooltip-wrapper').find(item => item.innerText.includes('车尾灯状态'))
		
		$$('.mf-resize-container .container .title').some(tit => {
			if(tit.textContent.includes('尺寸')) {
				const value = tit.nextElementSibling.textContent
				let {long, width} = /长：(?<long>.*)m，宽：(?<width>.*)m，高：(?<height>.*)m/.exec(value).groups
				geometryInfo.long = Number(long)
				geometryInfo.width = Number(width)
			}
			if(tit.textContent.includes('坐标')) {
				const value = tit.nextElementSibling.textContent
				let {x, y} = /X：(?<x>.*)m，Y：(?<y>.*)m，Z：(?<z>.*)m/.exec(value).groups
				geometryInfo.x = Number(x)
				geometryInfo.y = Number(y)

			}
		})
		// console.log(geometryInfo)
		cameraLabel.some(label => {
			let {x, y, long, width} = geometryInfo

			const minSide = (Math.min(long, width))/2 //最短边长
			const r = Math.sqrt((long/2)**2 + (width/2)**2)
			if((x >= 0+minSide && x <= 80+minSide) && (y >= -45-minSide && y <= 45+minSide)) {
				label.style.background = 'dodgerblue'
				rearTit && (rearTit.style.color = 'dodgerblue')
				label.style.boxShadow = '0px 0px 6px 2px #fff'
			} else if((x > 0 && x-r > 80) || (x < 0 && x+r < 0) || (y > 0 && y-r > 45) || (y < 0 && y+r < -45)) {
				label.style.background = null
				rearTit && (rearTit.style.color = 'gray')
				label.style.boxShadow = null
			} else {
				label.style.background = 'coral'
				rearTit && (rearTit.style.color = 'coral')
				label.style.boxShadow = '0px 0px 6px 2px #fff'
			}

		})
	}

	function removeOuterTip() {
		let rearTit = $$('.attribute-container .tooltip-wrapper')?.find(item => item.innerText.includes('车尾灯状态'))

		let allKeyTips = Array.from(document.querySelectorAll('.key-tip'))
		allKeyTips.some(tip => {
			tip.style.display = 'none';
		})

		let allTypeTips = Array.from(document.querySelectorAll('.type-tip'))
		allTypeTips.some(tip => {
			tip.style.display = 'none';
		})

		let allThreeViewsLabel = $$('.size-label-x :first-child, .size-label-y :first-child, .box-title')

		allThreeViewsLabel.forEach(label => {
			// label.getAnimations().forEach(ani => ani.cancel())
			label.style.background = '#222225'
			// const ky = new KeyframeEffect(null, {
			// 	background: []
			// }, {
			// 	duration: 300,
			// 	fill: 'forwards',
			// 	ease: 'ease-out',
			// })
			// ky.target = label;
			// let ani = new Animation(ky);
			// ani.play();
		})

		if($('.mf-resize-container .container').style.display === 'none') {
			let cameraLabel = $$('.x-image-mapping__item__left__name').filter(cameraLabel => ['C9', 'C11'].includes(cameraLabel.innerText))
			cameraLabel.some(label => {
				label.style.background = null
				label.style.boxShadow = null
			})
			rearTit && (rearTit.style.color = null)

		}

	}

	//监视对象列表
	Observe($('.drawer'), (mrs)=> {
		mrs.some(mr => {
			[...mr.addedNodes].some(an => {
				if(an?.classList?.contains('object-list')) {
					let objListObserver = new MutationObserver((mrs) => {
						//console.log('=====', mrs)
						mrs.some((mr) => {
							// [...mr.addedNodes].some(an => {
							// 	console.log('objList', an, an.innerHTML)
							// })
							if(mr.type !== 'attributes') return
							if(mr.target.className.includes('el-icon el-tree-node__expand-icon expanded')) {
								//刚打开对象列表的某个分类时，个体已选中，需要手动的获取一次选中个体
								// if(mr.target.nextElementSibling?.textContent?.includes('#')) {
								console.log('重新选中个体', $('.attribute-container'))
								
								let control3D_btn = $$('.icon-annotation-wei3D-show, .icon-annotation-wei3D-hide, .icon-annotation-wei3D-show-half').find((btn) => btn.style.display !== 'none')
								if(!control3D_btn.classList.contains('icon-annotation-wei3D-show')) { //复原3D框的隐藏
									window.dispatchEvent(new KeyboardEvent("keydown", {
										key: "f",
										keyCode: 70,
										code: "KeyF",
										ctrlKey: false,
										bubbles: true,
									}))
								}
								
								if($('.attribute-container')) {
									let attrMap = analyseAttr()
									attrTip(attrMap, {state: 'show'})
								} else {
									removeOuterTip()
								}
								// selectedObj = mr.target.parentNode.parentNode
								// console.log('artificial select', selectedObj)
								// 								} else {
								// 									console.log('type expanded', mr.target) //切换个体时，分类箭头会响应

								// }
							}
						})
					})
					objListObserver.observe(an, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
				}
				// console.log('add', an, mr)
			})
		})
	}, {childList: true, subtree: true})


	function initCheckPanel() {
		let isOpenCheckPanel = false
		
		const openBtn = document.createElement('div')
		const checkPanel = document.createElement('div')
		const closeBtn = document.createElement('div')
		const container = document.createElement('div')
		const checkBtn = document.createElement('div')
		const reCheckBtn = document.createElement('div')
		
		openBtn.textContent = '检查'
		closeBtn.textContent = '×'
        reCheckBtn.textContent = '重新检查'
		
		setElStyle(new Map([
			[openBtn, {
				width: '56px',
				height: '26px',
                marginRight: '10px',
				background: '#ffffff1a',
				borderRadius: '3px',
				lineHeight: '26px',
				textAlign: 'center',
				fontSize: '12px',
                cursor: 'pointer',
			}],
			[checkPanel, {
                display: 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
				width: '280px',
				height: '328px',
				padding: '35px 15px 15px',
				background: 'rgb(34, 34, 37, .8)',
				borderRadius: '5px',
                zIndex: 999,
			}],
            [reCheckBtn, {
                letterSpacing: '0.5px',
                width: '75px',
				height: '28px',
				lineHeight: '28px',
                marginRight: '10px',
				background: '#9166ff',
				borderRadius: '3px',
				textAlign: 'center',
				fontSize: '14px',
                cursor: 'pointer',
                color: '#eee',
                marginLeft: '205px',

            }],[closeBtn, {
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '25px',
                height: '25px',
                lineHeight: '25px',
                borderRadius: '5px',
                background: 'gray',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '28px',
                color: '#ccc',

            }],
            [container, {
                overflow: 'auto',
                width: '100%',
                height: '300px',
                color: '#fff',
            }]
		]))

		openBtn.onclick = ()=> {
			if(isOpenCheckPanel) return
			isOpenCheckPanel = true

			checkPanel.style.display = 'block'
            check()
		}

        reCheckBtn.onclick = ()=> { check() }

		closeBtn.onclick = () => {
			if(!isOpenCheckPanel) return
			isOpenCheckPanel = false
			checkPanel.style.display = 'none'

        }

		$('.header__right').insertAdjacentElement('afterbegin', openBtn)
		checkPanel.append(container, closeBtn, checkBtn, reCheckBtn)
		document.body.appendChild(checkPanel)


        function check() {
			let params = getParams(location.href)
			fetch(`https://apipro.mindflow.com.cn/labelcenter/v1/result/find?taskId=${ds.taskId}&jobId=${ds.jobId}`,{
				headers: {
					'Cookie': String(document.cookie),
				},
				credentials: 'include'
			}).then(res => res.json()).then(res => {
				if(res.code !== 200) return (console.log(res.msg))
				//按帧排序
				let allTarget = [];
				let allTypeId = ds.allTypeAttr.map(typeObj => typeObj.id) //3D框类型id
				ds.frames.forEach((frameId, frameIdx) => {
					console.log(res.data, res.data[frameId])
					let typeSet = res.data[frameId].LOCATE.filter(typeSet => {
						return allTypeId.includes(typeSet.labelToolId)
					})

					let typeObj = {}
					typeSet.forEach(type => {
						//加入name
						ds.allTypeAttr.some(boxType => {
							if(boxType.id === type.labelToolId) {
								type.name = boxType.name
								return true
							}
						})

						//补充帧id、帧序列、3D框类别
						for(const targetId in type.labelObjects) {
							let target = type.labelObjects[targetId]
							target.frameId = type.frameId
							target.frameIndex = frameIdx
							target.boxType = type.name
						}
						// console.log('type', type)

						//类型键值对
						typeObj[type.name] = type
					})
					allTarget.push(typeObj)

				})
				ds.allTarget = allTarget
				// console.log(allTarget)
			}).then(res => {
				let checkResult = checkRearLight()

				// console.log(checkResult)
				container.innerHTML = ''
				if(!checkResult.error.length) {
					container.textContent = '暂无错误'
				}
				checkResult.error.forEach(error => {

					//渲染
					let errorItem = document.createElement('div')
					setElStyle(errorItem, {
						marginBottom: '5px',
						cursor: 'pointer',
						transition: '.2s all'
					})
					errorItem.textContent = `第${error.frameIndex+1}帧 ${error.boxType} #${error.indexNumber} 车尾灯属性错`
					errorItem.addEventListener('click', ()=> {
						const bg = errorItem.style.color;
						errorItem.style.color = !bg ? '#1EFF00' : null
					})
					container.appendChild(errorItem);
				})
			})


		}

        function checkRearLight() {
            let rearLightIgnoreParentId = {}
            ds.allTypeAttr.forEach(typeAttr => {
                let rearProp = typeAttr.properties.find(prop => prop.name === '车尾灯状态')
                if(!rearProp) return
                let parentId = rearProp.properties[0].id
                rearLightIgnoreParentId[typeAttr.name] = parentId
            })
            rearLightIgnoreParentId

            let checkList = []
            ds.allTarget.forEach(curFrameTypeObj => {
                //只看带有车尾灯属性的框类型
                for(const curBoxType in rearLightIgnoreParentId) {
                    let parentId = rearLightIgnoreParentId[curBoxType]
                    let curTypeTargets = curFrameTypeObj[curBoxType]
                    if(!curTypeTargets) break;
                    checkList.push(curTypeTargets)
                }
            })
            console.log('checkList', checkList)
            let positionFilter = {
                inside: [],
                outside: [],
                boundary: []
            }
            //范围分类，开始检查
            checkList.forEach(curBoxType => {
                // console.log(curBoxType)
                for(const targetId in curBoxType.labelObjects ) {
                    let target = curBoxType.labelObjects[targetId]

                    //检查个体是否超出范围
                    let long = Number(target.geometry.size.x.toFixed(2))
                    let width = Number(target.geometry.size.y.toFixed(2))
                    let x = Number(target.geometry.position.x.toFixed(2))
                    let y = Number(target.geometry.position.y.toFixed(2))

                    const minSide = (Math.min(long, width))/2 //最短边长
                    const r = Math.sqrt((long/2)**2 + (width/2)**2)
                    if((x >= 0+minSide && x <= 80+minSide) && (y >= -45-minSide && y <= 45+minSide)) { //范围内
                        positionFilter.inside.push(target)
                    } else if((x > 0 && x-r > 80) || (x < 0 && x+r < 0) || (y > 0 && y-r > 45) || (y < 0 && y+r < -45)) { //范围外
                        positionFilter.outside.push(target)
                    } else { //无法判断
                        positionFilter.boundary.push(target)
                    }
                }
            })
            // console.log('result', result)

            let errorList = []
            //针对超出范围外的个体进行车尾灯检查
            positionFilter.outside.forEach(target => {
                let parentId = rearLightIgnoreParentId[target.boxType]
                const rearIgnoreProp = target.propertiesList.find(selProp => selProp.parentId === parentId)
                // console.log(rearIgnoreProp)
                if(rearIgnoreProp) return
                errorList.push(target)
            })
            // console.log('error', errorList)
            return { boundary: positionFilter.boundary, error: errorList }
        }
	}


	window.addEventListener('keydown', (e) => {
		console.log(e.keyCode, e)

		if(cameraAngleMap.has(e.keyCode)) {
			let cameraAngle = cameraAngleMap.get(e.keyCode)
			let allMappingImgWrap = [...document.querySelectorAll('.x-image-mapping')];
			let targetIdx
			if(!Array.isArray(cameraAngle) && typeof cameraAngle !== 'string') {
				targetIdx = cameraAngle
			} else if(typeof cameraAngle !== 'string'){
				targetIdx = allMappingImgWrap[cameraAngle[0]].querySelector('.icon-annotation-blow-up') ? cameraAngle[0] : cameraAngle[1]
			}

			// if(!allMappingImgWrap[targetIdx].querySelector('.x-image-mapping__item__left__name--active')) document.querySelector('.svg-icon.icon-mappingCamera')?.parentElement.click()

			if(typeof cameraAngle == 'string') {
				let target = allMappingImgWrap.find(img => img.className.includes('x-image-mapping--active'))
				switch(cameraAngle) {
					case 'blow_up_down': {
						if(e.code !== 'NumpadEnter') break;
						let btn = target?.querySelector('.icon-annotation-blow-up') || target?.querySelector('.icon-annotation-blow-down');
						btn.click()
					}; break;
					case 'refresh':
						target?.querySelector('.icon-annotation-refresh')?.click();
						document.querySelector('.image-mapping-wrapper')?.querySelector('.icon-annotation-refresh').click();
						break;
				}
				return
			}
			allMappingImgWrap[targetIdx].click()
			allMappingImgWrap[targetIdx].scrollIntoView({ behavior: "smooth", block: "center", inline: "end" })
		}

		//【Tab】
		if(e.keyCode == 9) {
			e.preventDefault();
			let [vpTop, vpFront, vpLeft] = vps;
			let vpSequence = [vpTop, vpLeft, vpFront]

			let isBlow = vpSequence.some((vp, idx) => {
				//判断是否存在三视图放大状态
				if(vp.className.includes('transform-active')) {
					// console.log('当前处于放大', vp)
					//收起当前视图
					vp.querySelector('.box-scale-icon.box-blow-down').click()
					//放大下一个视图
					let nextVp = vpSequence[idx !== 2 ? ++idx : 0]
					nextVp.dispatchEvent( new Event('mousedown') );
					setTimeout(() => { nextVp.querySelector('.box-scale-icon.box-blow-up').click() })

					return true
				}
			})

			let modeWrap = $('.annotation-mode')
			if(!isBlow ) {
				if(!$('.attribute-container') && modeWrap && ( modeWrap.textContent.includes('标注') || modeWrap.$('.el-switch').classList.contains('is-checked'))) {
					$('.engraving-container .modify-attribute').click()
				} else if(modeWrap && modeWrap.textContent.includes('审核') && !modeWrap.$('.el-switch').classList.contains('is-checked')) {
					focusTarget()
				}
			}
		}

		//【B】
		if(e.keyCode == 66) {
			focusTarget()
		}
		
		function focusTarget() {
			let time = 0
			let objListBtn = $('.drawer').nextElementSibling.$('.operate-item.el-tooltip__trigger')
			if(!objListBtn.classList.contains('selected')) {
				objListBtn.click()
				time = 200
			}
			setTimeout(() => {
				let expandBtn = $('.object-list .icon-liebiaozhankai')?.click()
				let allTypes = $$('.object-list .el-tree > *').filter(child => child.classList.contains('el-tree-node'))
				allTypes.some((curType) => {
					console.log(curType)
					return [...curType.querySelector('.el-tree-node__children').children].some((item) => {
						if(item.classList.contains('is-expanded')) {
							console.log('item', item)
							return (item.click(), true)
						} 
					})
				})
			}, time)
		}


		//【shift+Z】
		if(e.keyCode == 90 && e.shiftKey) {
			let colorSchemes = document.querySelector('.update-color-wrapper').querySelector('.menu-wrapper.three-items').querySelectorAll('.title')
			!colorSchemes[0].className.includes('active') ? colorSchemes[0].click() : colorSchemes[2].click()
			}


		//【F】
		if(ds.isHide23DControllable && e.keyCode == 70 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
			ds.isHide23DControllable = false
			wei23DVis(ds.isHide23D)
			ds.isHide23D = !ds.isHide23D

		}


		//【;】
		if(e.keyCode == 186) {
			if(!ds.isAutoOpenAttrPanel) {
				let isRemoveObjList
				ds.objListObserver = observeObjList() //尝试直接监控对象列表
				let selectedObj = null

				if(!ds.isObserveDrawer) {
					let observer = new MutationObserver((mrs) => {
						// console.log('drawer', mrs);
						mrs.some((mr) => {
							[...mr.removedNodes].some((rn) => {
								if(rn.className === 'object-list') {
									isRemoveObjList = true
									ds.objListObserver.disconnect()
								}
							});

							[...mr.addedNodes].some((an) => {
								if(ds.isAutoOpenAttrPanel && isRemoveObjList !== false && an.className === 'object-list') {
									ds.objListObserver = observeObjList()
									isRemoveObjList = false
								}
							})
						})

					});
					observer.observe(document.querySelector('.drawer'), {childList: true})
					ds.isObserveDrawer = true
				}
				ds.isAutoOpenAttrPanel = true
				showMessage('开启：个体属性面板的自动调出')

				function observeObjList() {
					let objectList = document.querySelector('.object-list')
					if(!objectList) return null
					let objListObserver = new MutationObserver((mrs) => {
						//console.log('=====', mrs)
						mrs.some((mr) => {
							if(mr.type !== 'attributes') return

							if(mr.target.className.includes('el-icon el-tree-node__expand-icon expanded')) {
								console.log('test', mr)
							}

							if(selectedObj !== mr.target.parentNode.parentNode && mr.target.className.includes('el-icon el-tree-node__expand-icon expanded')) {
								//刚打开对象列表的某个分类时，个体已选中，需要手动的获取一次选中个体
								if(mr.target.nextElementSibling?.textContent?.includes('#')) {
									selectedObj = mr.target.parentNode.parentNode
									console.log('artificial select', selectedObj)
								} else {
									console.log('type expanded', mr.target) //切换个体时，分类箭头也会响应
									setTimeout(() => {
										selectedObj = $('.el-tree-node.is-expanded.object-item')
									})

								}

								setTimeout(() => {
									console.log('show panel')
									if(!$('.attribute-container')) $('.engraving-container .modify-attribute').click()
								}, 300)
							}
						})
					})
					objListObserver.observe(objectList, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
					return objListObserver
				}
			} else {
				if(ds.objListObserver) ds.objListObserver.disconnect()
				ds.isAutoOpenAttrPanel = false
				showMessage('取消：个体属性面板的自动调出')

			}

		}


		//【O】
		if(e.keyCode == 79) {
			MappingImgVis(ds.isHideMappingImg)
		}


		//【`】alt+` 关闭个体属性面板，同时打开个体选择弹框
		if(e.keyCode === 192) {
			if(document.querySelector('.attribute-container')) {
				if(!e.altKey) return
				document.querySelector('.attribute-container').querySelector('.close').click()
				document.querySelector('.pull-frame-item.BoxGeometry').querySelector('.arrow').click()
			} else {
				document.querySelector('.pull-frame-item.BoxGeometry').querySelector('.arrow').click()
			}

		}
	})

    clickTrigger(document.body, (e) => {
        if(e.target?.className !== 'canvas-container' ) return
        let pointView = [...document.querySelectorAll('.canvas-container')].find(item => item.children[0].id === 'assistantCanvas_1')
        document.body.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Delete",
            keyCode: 46,
            code: "Delete",
            ctrlKey: false,
            bubbles: true,
        }))
    }, 2, 0)
	
	
	
	function debounce(func, delay) {
		let timer;
		return function(...args) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}
	
	/**
     * @description 展示消息框
     * @param {string} message 展示内容
     * @param {object} [config] 配置对象
     * @param {string} [config.type='default'] 内容类型（可选值：'default'、'success'、'warning'、'error'）
     * @param {number} [showTime=3000] 展示时间
     * @param {string} [direction='top]' 展示的位置（可选值：'top'、'top left'、'left'、'top right'、'right'、'bottom'、'bottom left'、'bottom right'）
     * @return {void}
     */
	function showMessage(message, config) { //type = 'default', showTime = 3000, direction
		let MessageWrap = document.createElement('div')
		MessageWrap.className = 'messageWrap'
		setElStyle(MessageWrap, {
			position: 'absolute',
			zIndex: '9999'
		})

		let MessageBox = document.createElement('div')
		MessageBox.innerText = message

		let closeBtn = document.createElement('div')
		closeBtn.textContent = '×'
		closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

		setElStyle(MessageBox, {
			position: 'relative',
			minWidth: '200px',
			marginTop: '5px',
			padding: '6px 50px',
			lineHeight: '25px',
			backgroundColor: 'pink',
			textAlign: 'center',
			fontSize: '16px',
			borderRadius: '5px',
			transition: 'all 1s'
		})

		setElStyle(closeBtn, {
			position: 'absolute',
			top: '-3px',
			right: '3px',
			width: '15px',
			height: '15px',
			zIndex: '999',
			fontWeight: '800',
			fontSize: '15px',
			borderRadius: '5px',
			cursor: 'pointer',
			userSelect: 'none'
		})
		//控制方向
		switch(config?.direction) {
			case 'top': setElStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'top left': setElStyle(MessageWrap, {top: '1%', left: '.5%'}); break;
			case 'left': setElStyle(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
			case 'top right': setElStyle(MessageWrap, {top: '1%', right: '.5%', }); break;
			case 'right': setElStyle(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
			case 'bottom': setElStyle(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'bottom left': setElStyle(MessageWrap, {bottom: '1%'}); break;
			case 'bottom right': setElStyle(MessageWrap, {bottom: '1%', right: '.5%'}); break;
			default: setElStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
		}

		switch(config?.type) {
			case 'success': setElStyle(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
			case 'warning': setElStyle(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
			case 'error': setElStyle(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
			default: setElStyle(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
		}

		MessageBox.appendChild(closeBtn)
		let oldMessageWrap = document.querySelector('.messageWrap')
		if(oldMessageWrap) {
			oldMessageWrap.appendChild(MessageBox)
		} else {
			MessageWrap.appendChild(MessageBox)
			document.body.appendChild(MessageWrap)
		}
		let ani = MessageBox.animate([
			{
				transform: "translate(0, -100%)" ,
				opacity: 0.3,
			},
			{
				transform: "translate(0, 18px)",
				opacity: 0.7,
				offset: 0.9,
			},
			{
				transform: "translate(0, 15px)",
				opacity: 1,
				offset: 1,
			},
		], {
			duration: 300,
			fill: 'forwards',
			easing: 'ease-out',
		})

		//控制消失
		let timer = setTimeout(() => {
			ani.onfinish = () => {
				MessageBox.remove()
			}
			ani.reverse()
		}, (config?.showTime || 3000))

		//鼠标悬停时不清除，离开时重新计时
		MessageBox.addEventListener('mouseenter', () => clearTimeout(timer))
		MessageBox.addEventListener('mouseleave', () => {
			timer = setTimeout(() => {
				ani.reverse()
				ani.onfinish = () => {
					MessageBox.remove()
				}
			}, (config?.showTime || 3000))
		})
	}


	function setElStyle() {
		[[Map, ()=> {
			const styleMap = arguments[0]
			for (const [el, styleObj] of styleMap) {
				!Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
			}
		}], [Element, () => {
			const [el, styleObj] = arguments
			setStyleObj(el, styleObj)
		}]].some(([O, fn]) => O.prototype.isPrototypeOf(arguments[0]) ? (fn(), true) : false)

		function setStyleObj(el, styleObj) {
			for (const attr in styleObj) {
				if (el.style[attr] !== undefined) {
					el.style[attr] = styleObj[attr]
				} else {
					//将key转为标准css属性名
					const formatAttr = attr.replace(/[A-Z]/, match => `-${match.toLowerCase()}`)
					console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
				}
			}
		}
	}

	function Observe(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
		const ob = new MutationObserver(callBack);
		ob.observe(target, options);
		return ob
	}

    function $(selector) {
        const _this = Element.prototype.isPrototypeOf(this) ? this : document
        const sel = String(selector).trim();

        const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
        return id ? _this.getElementById(id) : _this.querySelector(sel)
    }

    function $$(selector) {
        const _this = Element.prototype.isPrototypeOf(this) ? this : document
        return Array.from(_this.querySelectorAll(selector))
    }
	
	function getParams(url) {
		let params = {};
		/\?(.*)/.exec(location.href)[1].split('&').forEach(item => {
			let paramsArr = item.split('=')
			params[paramsArr[0]] = paramsArr[1]
		})
		return params
	}

	function init() {
		const initObserveList = [
			'.show-attribute-container',
		]

		return new Promise((res, rej) => {
			let observer = new MutationObserver((mrs) => {

				mrs.some((mr) => {
					if(mr.type == 'attributes' && mr.target.className === 'task-load-panel' && mr.target.style.display === 'none') res((true))

					Array.from(mr.addedNodes).some(an => {
						if(an.nodeName == '#text') return
						// console.log('an', an)
						let attrContainer = an.$ && an.$('.show-attribute-container')
						if(attrContainer) {
							attrContainer.style.maxHeight = 'none'; //内容全部展开

							console.log('Observe container', attrContainer)
							Observe(attrContainer, (mrs) => {
								console.log(mrs)

							}, { childList: true, subtree: true, attributes: true });
						}
					})
				})


			});
			observer.observe(document.body, { childList: true, subtree: true, attributes: true })
		})
	}
	
	function clickTrigger(el, fn, button, moveThreshold = 0) {
		let movement = 0
		let allowTrigger = false
		let isRightdown = false

		el.addEventListener('mousedown', (e)=>{
			e.preventDefault()
			if(e.which !== button) return
			movement = 0
			isRightdown = true
			allowTrigger = true
		})
		el.addEventListener('mousemove', (e)=>{
			if(!isRightdown || (isRightdown && (movement+=(Math.sqrt(e.movementX**2 + e.movementY**2))) <= moveThreshold)) return

			allowTrigger && (allowTrigger = false)
		})
		el.addEventListener('mouseup', (e)=>{
			if(e.which !== button) return
			if (allowTrigger) fn(e)
			isRightdown = false
		})
	}
	/**
==日志===
2024/1/13
- 新增：映射图抽屉贴边滚动

2024/1/14
- 新增：双击三视图进行缩放
- 新增：【Tab键】切换三视图（仅在三视图放大情况下）
- 新增：选中对象时自动开启关联映射，失焦时自动关闭

2024/1/15
- 修复：映射图2D框关闭后重新打开的情况
- 新增：【Shift+Z键】切换点云渲染方案（高度渲染 <==> 自定渲染）

2024/1/16
- 新增：【F键】隐藏映射图23D框
- 调整：聚焦调整为快捷键【B】触发
- 新增：【`键】调出个体属性面板

2024/1/18
- 调整：【Tab键】调出个体属性面板

2024/1/21
- 新增：【;键】开启/关闭切换个体时，自动调出个体属性面板

2024/1/24
- 新增：【O键】展示/隐藏 映射图C4、C5、C6、C7
- 修复：伪23D框频繁显隐导致的闪烁问题

2024/1/25
- 调整：代码执行时机

2024/1/27
- 调整：鼠标右键缩放三视图
- 新增：右键关闭个体属性框
- 新增：`键弹出个体选择弹出层

2024/1/28
- 新增：点云遮挡和点云截断的标签颜色反馈
- 新增：数字键盘选择相机视角

2024/1/29
- 修复：【;】键关闭后，重新打开个体列表出现重启的情况
- 修复：个体属性面板标签勾选不全导致的标签颜色无反馈的问题
- 新增：个体属性面板的2D映射截断标签新增颜色反馈

2024/3/13
- 调整：重构【B键】代码

2024/3/14
- 新增：映射图的关键障碍物属性提示

2024/3/15
- 新增：自动关闭三视图微调的消息提示
- 新增：雷达属性勾选的反馈提示

2024/3/16
- 调整：中键关闭个体属性面板
- 调整：个体属性面板透明化
- 新增：鼠标中键删除3D框

2024/3/17
- 新增：车尾灯标注提示
- 调整：关键属性提示Label的样式

2024/3/18
- 新增：映射图关键和类别提示的跟踪效果
- 调整：加大雷达的颜色提示范围，将提示效果进一步同步至三视图Label上
- 修复：失去焦点时，相机位Label样式不重置

2024/3/19
- 新增：车尾灯全帧检查功能

2024/3/21
- 调整：审核模式的悬停属性面板清楚滚动条

2024/3/22
- 新增：审核模式下，【Tab】调出批改面板

2024/3/24
- 新增：中键拖动个体属性面板

2024/3/25
- 优化：切换个体或切帧时，解除2D映射框的隐藏
=========
**/
})();