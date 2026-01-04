// ==UserScript==
// @name         ali
// @namespace    http://tampermonkey.net/
// @version      2024.3.6.2
// @description  try it
// @author       You
// @match        https://ads.aligenie.com/labeltools?type=BATCHWORK&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aligenie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486237/ali.user.js
// @updateURL https://update.greasyfork.org/scripts/486237/ali.meta.js
// ==/UserScript==

(async function() {
    'use strict';

/**==================================

快捷键：
【Q】        ==>  俯视角左调
【E】        ==>  俯视角右调
【鼠标中键】 ==>  进入/退出三视图编辑模式
【空格\1】   ==>  帧数前切（选中个体时，控制在关联帧范围；三视图总览表→批量前切）
【`】        ==>  帧数后切（选中个体时，控制在关联帧范围；三视图总览表→批量后切）
【Ctrl + Y】 ==>   开启/关闭自动删除
【P】        ==>  开启/关闭快捷键自定义面板
【ESC】      ==>  删除当前对象
【Alt + `】  ==>  向后一帧（等同 Ctrl ←）
【1】        ==>  向前一帧（等同 空格）
【Alt + 1】  ==>  向前一帧（等同 Ctrl →）
【Esc】      ==>  删除当前对象
【Z】        ==>  失焦个体

便捷交互：
- 双击右键菜单删除项 可删除整个对象串
- 点击右键菜单复制项 左区域==>向前复制  右区域==>向后复制  最两侧的空白区域复制5帧
- 三视图放大模式下双击三视图切到三视图预览表 ，再双击三视图预览区切回

按钮：
- 单页重检：一键勾选单页下的重新检查按钮
- 点数筛选：隐藏点数合格的快捷属性标签
- 锁定标签：退出三视图放大模式后不会取消快捷属性的勾选

自动生效：
- 自动勾选 展示映射、自车轨迹、行车轨迹
- 三视图放大模式下自动勾选快捷属性
- 切换个体时重置成位移模式
- 个体属性面板自动保存
- 检查快捷属性标签的点数并且给出颜色提示
- 个体属性面板生成几何信息面板，并计算距离，对当前对象的快捷属性标签加入颜色提示
- 点云小视图尺寸放大

==================================**/
    if(await awaitLoad()) showMessage('工具已启用')

    let saveRecord = []
    let isDel = false
    let isFocus = false
    let isObserveToolBar = 0
    let mouseX, mouseY
    let isDelLinkAll = false
    let isHideLabel = false
    let isAttrLabelKeep = false
    let curTarget = []
    let targetDistance = -1
    let isPointViewAdjust = true


    new MutationObserver((mrs) => {
        // if(mrs[0].addedNodes[0]?.nodeName !== '#text') console.log('=======',mrs)
        mrs.some((mr) => {
			[...mr.addedNodes].some((an) => {
				// if(mrs[0].addedNodes[0]?.nodeName !== '#text') console.log(111, an)
				if(an.nodeName == '#text') return

				if(isDelLinkAll && an.className.includes('ant-modal-root') && an.innerText.includes('确认要删除对象吗')) {
					[...an.querySelectorAll('button')].find(btn => btn.innerText === '确 定')?.click()
				}

				if(an.className.includes('index_mask__uUfCW')) {
					let menu = an.children[0]
					menu.style.transition = '.1s all'

					let menuList = [...document.querySelectorAll('.index_context__ItAcv li')]
					let menu_ul = document.querySelector('.index_context__ItAcv ul')
					let focusItem = menuList.find(item => item.textContent.includes('聚焦'))

					let copyItem = menuList.find(item => item.textContent.includes('复制创建'))
					if(copyItem) {
						menu_ul.insertBefore(copyItem, menu_ul.firstChild)
						let menuRectInfo = menu.getBoundingClientRect()
						let copyItemRectInfo = copyItem.getBoundingClientRect()

						copyItem.addEventListener('click', (e) => {
							let matchStr
							console.log(e.offsetX, copyItemRectInfo.width/2 )
							if(e.offsetX >= copyItemRectInfo.width/2) {
								matchStr = e.offsetX < copyItemRectInfo.width - 20 ? '向后1帧' : '向后5帧'
							} else {
								matchStr = e.offsetX > 20 ? '向前1帧' : '向前5帧'
							}

							let item = [...document.querySelectorAll('.ant-menu-submenu.ant-menu-submenu-popup:not(.ant-menu-submenu-hidden) li')].find(item => item.innerText.includes(matchStr)).click()
							showMessage('复制：'+ matchStr)
						})

						// console.log('menuRectInfo', menuRectInfo)
						// console.log('copyItemRectInfo', copyItemRectInfo)

						menu.style.left = `${ menuRectInfo.x - (menuRectInfo.width/2) }px`;
						menu.style.top = `${ menuRectInfo.y - (copyItemRectInfo.y - mouseY + (copyItemRectInfo.height/2)) }px`
					}

					let delItem = menuList.find(item => item.textContent.includes('删除'))
					if(delItem) {
						if(copyItem) copyItem.insertAdjacentElement('afterend', delItem) //重排
						delItem.addEventListener('dblclick', (e) => {
							let item = [...document.querySelectorAll('.ant-menu-submenu.ant-menu-submenu-popup:not(.ant-menu-submenu-hidden) li')].find(item => item.innerText.includes('全部目标关联对象')).click()
							showMessage('删除全部关联对象')
							isDelLinkAll = true
							setTimeout(() => {isDelLinkAll = false} , 3000)
						})
					}
				}

				if(an.className.includes('index_TheFoldHeadBox__GXNHj') && an.textContent.includes('对象列表') && an.textContent.includes('批量质检')) {
					let header = an.querySelector('.index_title__LoGZA')
					let btn = document.createElement('button')
					btn.textContent = '单页重检'
					setElStyle(btn, {
						background: '#eee',
						padding: '5px 8px',
						borderRadius: '3px'
					})
					btn.addEventListener('click', () => {
						let allCheckBtn = [...document.querySelectorAll('use')].filter(use => use.getAttribute('xlink:href') === '#icon-icon-zhijian' && !use.parentElement.textContent.includes('批量质检'))
						allCheckBtn.some(btn => btn.parentElement.parentElement.click())
					})
					header.append(btn)
				}

				if(an.className.includes('index_view__MhyQ9')) {
					an.addEventListener('dblclick', e => {
						if(e.shiftKey) return
						an?.querySelector('.index_tracking-close__4LOgH').click()
					})
				}
				if(an.className.includes('index_tracking-view__6ChPR')) {
					// document.querySelector('.index_tracking-close__4LOgH')
					document.querySelector('.index_main-wrap__sCQxm').addEventListener('dblclick', e => {
						if(e.shiftKey) return
						an?.querySelector('.index_tracking-ball__A7uMf')?.click()
					})
				}

				if(an?.className?.includes('index_question__4Tm9w') || an?.className?.includes('index_QuestionTabs__kk6nt') && an.parentElement?.className !== 'index_trackingEditWrap__c2kEj') { //ctrl E 的面板不监视
					if(an?.className?.includes('index_question__4Tm9w')) an = an.querySelector('.index_QuestionTabs__kk6nt')
					if(isPointViewAdjust) {
						pointViewAdjust(an)
					} else {
						$('.index_control__C8NVb').style.width = '400px'
					}
					resetTrasitionPattern()
					an.style.position = 'relative'

					an.append(createGeometryPanel())

					an.style.border = '2px solid red'
					new MutationObserver((mrs) => {
						mrs.some((mr) => {
							if(mr.type === 'attributes' && mr.target.className.includes('ant-radio-wrapper ant-radio-wrapper-checked') && mr.oldValue === 'ant-radio-wrapper') {
								console.log('new select')
								document.querySelector('.index_question__4Tm9w').querySelector('.ant-btn').click()
								let time = Date.now()
								// console.log('gen'+ time)
								saveRecord.push([time, 0])
							}
						})
					}).observe(an, { childList: true, subtree: true, attributes: true, attributeOldValue: true});
					return true;
				}
				if(an?.className?.includes('labelTex_wrap__QrqM5')) {
					setElStyle(an.children[0], {
						top: '310px',
						left: '870px',
						height: '35px',
						fontSize: '22px',
						textAlign: 'center',
						lineHeight: '30px',
					})

					let curFrameNum = document.querySelector('.index_left__ioHQp .ant-pagination-simple-pager input').value
					let curItem = curTarget.items[curFrameNum-1]
					if(!curItem) return
					let {positionX: x, positionY: y} = curItem.geometry
					console.log('add Label')

					Observe(an, (mrs) => {
						mrs.some(mr => {
							console.log(mr);
							[...mr.addedNodes].some(an => {
								if(an.parentElement.className.includes('labelTex_text__9KRjf')) {
									filterPointLabel(an.parentElement, targetDistance !== -1 ? targetDistance : void 0)
								}
							})
							if(mr.type == 'characterData') {
								console.log(mr)
								console.log(mr.target.parentElement.className)
								filterPointLabel(mr.target.parentElement, targetDistance !== -1 ? targetDistance : void 0)
							}
						})
					}, {characterData: true, childList: true, subtree: true})
				}

				if(an?.className?.includes('ant-message-notice') && an.innerText === '只允许切换锚点类型') an.remove()
				if(isDel && an?.className?.includes('ant-modal-root') && an.querySelector('.ant-modal-body').innerText === '当前组内共有1个对象，删除后不可恢复，请谨慎操作！') setTimeout(() => {an.querySelector('.ant-btn.ant-btn-primary.ant-btn-sm').click()})
				if(isDel && an?.className?.includes('ant-table-row ant-table-row-level-0 common_rowBgColor__CUySE')) {
					let tdIdx;
					[...document.querySelector('.ant-table-thead').children[0].children].find((item, idx) => {
						if(item.innerText == '对象数') tdIdx = idx
					});

					let delRow = [...document.querySelectorAll('.ant-table-row')][0];
					console.log('del '+delRow.dataset.rowKey);
					console.log([...delRow.querySelectorAll('span')].at(-1));
					[...delRow.querySelectorAll('span')].at(-1).click()

					return true
				}

				if(!isObserveToolBar) {
					let toolBar = [...document.querySelectorAll('.toolBar_toolBar__q14CL')].find(item => item.innerHTML.includes('快捷属性') );
					if(toolBar) {
						['展示映射', '自车轨迹', '行车轨迹'].some((title, i) => toolBar.querySelector(`button[title="${title}"]`).click())

						Observe(toolBar, (mrs) => {
							if(!isAttrLabelKeep && mrs.find((mr) => mr.removedNodes[0]?.innerHTML.includes('自动外扩'))) return
							let btn = document.querySelector('button[title="快捷属性"]')
							console.log(btn.className)
							setTimeout(() => { !btn.className.includes('toolBar_active__PfJFI') ? btn.click() : void 0 })
						}, { childList: true, subtree: true})

						isObserveToolBar = 1
					}
				}

			});
		})
    }).observe(document, { childList: true, subtree: true, attributes: true, attributeOldValue: true})

    //调整点云小视图尺寸
    function pointViewAdjust(an) {
        let pointViewHeight = 700
        $('.index_context__orjUS.flex-column').style.height = pointViewHeight + 'px';
        $('.index_context__orjUS.flex-column').style.position = 'relative';
        $('.index_question__4Tm9w').style.height = `calc(100% - ${pointViewHeight}px)`
        $('.index_control__C8NVb').style.width = '450px'

        $('.index_context__orjUS.flex-column').style.marginTop = 0

        let imgIndicator = [...document.querySelectorAll('.index_footer__9yCgR.flex-row')].find(item => item?.parentElement?.className.includes('index_context__orjUS flex-column'));
        setElStyle(imgIndicator, {
            position: 'absolute',
            top: `${ pointViewHeight - 40}px`,
            left: '10px',
            width: 'fit-content',
            background: '#fff',
        })


        //去除tab
        an.querySelector('.ant-tabs.ant-tabs-top').remove();

        //去除一级标题
        [...an.querySelectorAll('.index_title__KB3CQ')].some(title => title.remove())

        //去除二级标题
        let titleArr = ['物体形态', '标注类别', '残影属性', '物体运动状态?', '遮挡属性'];
        [...an.querySelectorAll('.index_title__Fzt5I')].some(title => {
            if(titleArr.find(item => title.innerText.includes(item))) title.remove()
        })

        an.querySelector('.index_line__wZq6j').remove()

        let btn = an.nextElementSibling
        if(an.nextElementSibling?.innerText == '确认保存') btn.style.display = 'none'
    }

    function resetTrasitionPattern() {
        let btn = document.querySelector('.index_cube-scale-translation-tracking__2BRIw > button:first-child')
        if(btn && !btn.className.includes('index_translation-btn__+VcaE')) btn.click()
    }

    function createGeometryPanel() {
        let curFrameNum = document.querySelector('.index_left__ioHQp .ant-pagination-simple-pager input').value

        let geometryPanel = document.createElement('div')
        geometryPanel.className = 'geometry-panel'
        setElStyle(geometryPanel, {
            position: 'absolute',
            top: '75px',
            right: '5px',
            padding: '5px 10px',
            borderRadius: '5px'
        })
        let curItem = curTarget.items[curFrameNum-1]
        let {positionX: x, positionY: y} = curItem.geometry
        targetDistance = parseInt(Math.sqrt(x**2 + y**2))
        let contentObj = {
            '帧数': curItem.frameIdex+1,
            'X': x,
            'Y': y,
            '距离': targetDistance + 'm',
        }
        for(let k in contentObj) {
            let item = document.createElement('div')
            item.textContent = `${k}: ${contentObj[k]}`
            geometryPanel.append(item)
        }
        return geometryPanel
    }



    let header = $('.index_TopBar__atir2')
    let controlBar = document.createElement('div')
    let btn_hideLabel = document.createElement('button')
    let btn_keepLabel = document.createElement('button')
    let btn_pointViewAdjust = document.createElement('button')
    btn_hideLabel.textContent = '点数筛选'
    btn_keepLabel.textContent = '锁定标签'

    let local_isPointViewAdjust = localStorage.getItem('isPointViewAdjust')
    if(local_isPointViewAdjust === null) {
        btn_pointViewAdjust.textContent = '还原视图尺寸'
        localStorage.setItem('isPointViewAdjust', isPointViewAdjust)
    } else if(local_isPointViewAdjust === 'false') {
        isPointViewAdjust = false
        btn_pointViewAdjust.textContent = '调整视图尺寸'

    } else if(local_isPointViewAdjust === 'true') {
        isPointViewAdjust = true
        btn_pointViewAdjust.textContent = '还原视图尺寸'
    }
    let btnStyle = {
        marginRight: '5px',
        padding: '2px 5px',
        background: '#888',
        borderRadius: '4px'
    }
    setElStyle(new Map([[ btn_hideLabel, btnStyle ], [ btn_keepLabel, btnStyle ], [ btn_pointViewAdjust, btnStyle ], [controlBar, {width: '600px'}]]))



    btn_hideLabel.addEventListener('click', ()=> {
        isHideLabel = !isHideLabel
        let allLabel = [...document.querySelectorAll('.cube_text__q6bGx')];
        allLabel.some(isHideLabel ? (label) => { filterPointLabel(label, -1) } : (label) => { label.style.display = 'block' })
    })
    btn_keepLabel.addEventListener('click', ()=> { isAttrLabelKeep = !isAttrLabelKeep })
    btn_pointViewAdjust.addEventListener('click', ()=> {
        isPointViewAdjust = !isPointViewAdjust
        localStorage.setItem('isPointViewAdjust', isPointViewAdjust)
    })

    controlBar.append(btn_hideLabel)
    controlBar.append(btn_keepLabel)
    //controlBar.append(btn_pointViewAdjust)
    header.children[0].insertAdjacentElement('afterend', controlBar)

    Observe(document.querySelector('.index_container__M6WXK'), (mrs) => {
        mrs.some(mr => {
            [...mr.addedNodes].some(an => {
                if(an?.className?.includes('cube_wrap__TBfjR') ) {
                    filterPointLabel(an.children[0], -1)
                } else if(an.parentElement.className.includes('cube_text__q6bGx')) {
                    filterPointLabel(an.parentElement, -1)
                }
            })
            if(mr.type == 'characterData' && mr.target.parentElement.className.includes('cube_text__q6bGx')) {
                filterPointLabel(mr.target.parentElement, -1)
            }
        })
    }, {characterData: true, childList: true, subtree: true})

    function filterPointLabel(label, distance) {
        label.style.background = '#000'
        label.style.display = 'block'

        let pointCount = parseInt(label.innerText)
        if(isNaN(pointCount)) {
            return
        }
        if(distance !== -1) {
            if((distance < 90 && pointCount < 10) || (distance > 90 && pointCount < 3)) {
                     const ky = new KeyframeEffect(null, {
                         background: ['red', '#000']
                     }, {
                         duration: 500,
                         iterations: Infinity,
                         direction: 'alternate'
                     })
                     ky.target = label;
                     let ani = new Animation(ky);
                     ani.play();
            } else {
                label.style.background = '#000'
                label.getAnimations().forEach(ani => ani.cancel())
            }
        } else {
            if(pointCount >= 3 && pointCount < 10) {
                label.style.background = 'coral'
            } else if(pointCount < 3) {
                label.style.background = 'red'
            } else if(isHideLabel) {
                label.style.display = 'none'
            }
        }
    }

    // let attrMap = {
    //     '物体形态': 'body_shape',
    //     '形变体': 'soft',
    //     '刚体': 'rigid',
    //     '标注类别': 'type',
    //     '小汽车': 'Car',
    //     '货车/卡车': 'Truck',
    //     '公交车': 'Bus',
    //     '施工车': 'Construction',
    //     '三轮车': 'Tricycle',
    //     '骑二轮车的人': 'Cyclist',
    //     '行人': 'Pedestrian',
    //     '其他车辆': 'Other',
    //     '残影属性': 'blur',
    //     '分离': 'blur',
    //     '粘连': 'sticking',
    //     '无残影': 'no',
    //     ignore: 'ignore',
    //     '鬼影': 'multi-reflection',
    // }
    let attrMap = {
        soft:'形变体',
        rigid:  '刚体',

    }
    const originalXHR = window.XMLHttpRequest;
    const base = 'https://ads.aligenie.com/api/item/ItemServiceI'
    window.XMLHttpRequest = function () {
        let xhr = new originalXHR();

        xhr.addEventListener('readystatechange', function () {
            if (xhr.responseURL === `${base}/linkageSaveItems`) {
                let saveRecordItem = null
                let findRes = saveRecord.some((item) => {
                    if(item[1] == 0) {
                        saveRecordItem = item
                        return true
                    }
                })
                if(saveRecordItem && xhr.readyState === 4 && xhr.status == 200) {
                    let {retMsg, success } = JSON.parse(xhr.responseText)
                    if(retMsg === 'success' && success === true) {
                        let res = JSON.parse(xhr.responseText)
                        let labels =JSON.parse(res.retValue.itemVO).items[0].labels
                        showMessage(`修改完成（物体形态-${attrMap[labels.body_shape]}）`, {type: 'success'})
                        saveRecordItem[1] = 1
                        saveRecord.some((item, idx) => {
                            if(item[0] === saveRecordItem[0]) {
                                saveRecord.splice(idx, 1)
                                console.log('删除'+ saveRecordItem[0])
                            }
                        })
                        console.log('请求', saveRecord)
                    }
                } else if(findRes && xhr.readyState === 4) {
                    console.log('请求响应失败')
                    showMessage('保存失败', {type: 'error'})

                    saveRecordItem[1] = 2
                }
            }


            if(xhr.responseURL === `${base}/getCruxItemInfo` && xhr.readyState === 4 && xhr.status == 200) {
                let res = JSON.parse(xhr.responseText)
                console.log(res)

                let items = JSON.parse(res.retValue.workResult).items
                curTarget = {
                    id: items[0].relations.instance.instance_id,
                    items: new Array(50)
                }

                items.some(item => {
                    let frameIdex = item.relations.instance.index_id
                    curTarget.items[frameIdex] = {
                        id: item.id,
                        frameIdex,
                        geometry: item.meta.geometry
                    }
                })
                console.log(curTarget)
            }


            if([`${base}/getCruxItemInfo`, `${base}/linkageSaveItems`].includes(xhr.responseURL) && xhr.readyState === 4 && xhr.status == 200) {
                let res = JSON.parse(xhr.responseText)
                console.log(res)

                let items = JSON.parse(res.retValue[xhr.responseURL === `${base}/getCruxItemInfo` ? 'workResult' : 'itemVO']).items
                curTarget = {
                    id: items[0].relations.instance.instance_id,
                    items: new Array(50)
                }

                items.some(item => {
                    let frameIdex = item.relations.instance.index_id
                    curTarget.items[frameIdex] = {
                        id: item.id,
                        frameIdex,
                        geometry: item.meta.geometry
                    }
                })

                let geometryPanel = document.querySelector('.geometry-panel')
                if(geometryPanel) {
                    showMessage('几何数据保存完成', {showTime: 600})
                    geometryPanel.remove();
                    [...document.querySelectorAll('.index_QuestionTabs__kk6nt')].find(attrPanel => attrPanel.parentElement.className === '').append(createGeometryPanel())
                    filterPointLabel(document.querySelector('.labelTex_text__9KRjf'), targetDistance)

                }
                console.log('modify', curTarget)
            }
            if(xhr.responseURL === `${base}/copyUuid` && xhr.readyState === 4 && xhr.status == 200) {
                // let res = JSON.parse(xhr.responseText)
                // let copyRes = JSON.parse(res.retValue.workResult)
                // // console.log(copyRes)
                // let distanceArr = copyRes.items.map(item => {
                //     let {positionX:x, positionY:y} = item.meta.geometry
                //     return parseInt(Math.sqrt(x**2 + y**2)) + 'm'
                // })
                // showMessage('距离：'+ distanceArr.join(','))

                let res = JSON.parse(xhr.responseText)
                if(!res.retValue) return
                // console.log('copy', res)
                JSON.parse(res.retValue.workResult).items.some(item => {
                    let frameIdex = item.relations.instance.index_id
                    curTarget.items[frameIdex] = {
                        id: item.id,
                        frameIdex,
                        geometry: item.meta.geometry
                    }
                })
                console.log('add item', curTarget)
            }
            if(xhr.responseURL === `${base}/deleteBatchItem` && xhr.readyState === 4 && xhr.status == 200) {
                let res = JSON.parse(xhr.responseText)
                // console.log('del', res)
                let id = res.retValue.uuid[0]

                curTarget.items.some((item, idx)=> {
                    if(item.id !== id) return

                    curTarget.items[idx] = void 0
                    return true
                })
                console.log('del item', curTarget)
            }
        });
        return xhr;
    };

    let div = document.createElement('div')
    document.body.appendChild(div)
    div.outerHTML = `
  <div class="setting">
    <div class="set-head">自定义快捷键</div>
    <div class="set-body">
      <div class="set-item">
        <div class="key">Q</div>
        <div class="effect">俯视角左调</div>
      </div>
    </div>
  </div>`

    let settingStyle = document.createElement('style')
    document.body.appendChild(settingStyle)
    settingStyle.innerHTML = `
    .setting {
      display: none;
      position: absolute;
      z-index: 999;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 100px;
      background-color: #f1f1f1;
      box-shadow: rgba(0, 0, 0, .15) 0px 0px 5px 2px;
      border-radius: 5px;
    }
    .set-head {
      letter-spacing: 0.5px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-bottom: #ccc 2px solid;
      font-size: 15px;
      user-select: none;
    }
    .set-body {
      padding: 5px 10px;
    }
    .set-item {
      display: flex;
      align-items: center;
    }
    .key {
      width: 70px;
      height: 23px;
      line-height: 23px;
      margin-right: 10px;
      background-color: #ccc;
      border-radius: 5px;
      font-size: 12px;
      text-align: center;
      color: #f5f4f4;
      transition: .1s all;
      user-select: none;
    }
    .effect {
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }`;

    let settingPanel = document.querySelector('.setting')
    let key = settingPanel.querySelector('.key')
    key.addEventListener('click', (e) => {
      isFocus = true
      key.style.boxShadow = 'rgba(0, 0, 0, .15) 0px 0px 2px 2px'
      key.innerText = '请按下键盘'
    })
    settingPanel.addEventListener('click', (e)=> {
      if(e.target !== key && isFocus) {
        isFocus = false
        key.style.boxShadow = null
        key.innerText = JSON.parse(localStorage.getItem('key')).keyName
      }
    })

    window.addEventListener('mousemove', (e) => {(mouseX = e.x, mouseY = e.y)})

    window.addEventListener('keydown', (e) => {
        // console.log(e.keyCode, e)

        let turnRightKey_local
        if(localStorage.getItem('key')) {
            turnRightKey_local = JSON.parse(localStorage.getItem('key')).keyCode
        }

        if(!isFocus && e.keyCode == 80) {
            let settingPanel = document.querySelector('.setting')
            settingPanel.style.display = settingPanel.style.display == 'none' ? 'block' : 'none'
            settingPanel.querySelector('.key').innerText = localStorage.getItem('key') ? JSON.parse(localStorage.getItem('key')).keyName : 'Q'
        } else if(isFocus && e.keyCode == 80) {
            showMessage('关闭失败', {type: 'warning'})
        }
        if(isFocus) {
            e.preventDefault()
            console.log(e)
            let keyName = e.key !== " " ? e.key.toUpperCase() : 'Space'.toUpperCase()
            key.innerText = keyName
            if(key.innerText !== '请按下键盘') localStorage.setItem('key', JSON.stringify({keyCode: e.keyCode, keyName}))
            settingPanel.click()
        }


        if(e.keyCode == 89 && e.ctrlKey) {
            isDel = !isDel
            showMessage(`${isDel ? '开启' : '关闭'}：列表自动删除`)
        }

        if((!isFocus && turnRightKey_local && e.keyCode == turnRightKey_local) || (!isFocus && !turnRightKey_local && e.keyCode == 81)) {
            if(e.keyCode == 81 && document.querySelector('.index_container__v2bdb.hidden')) return

            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "r",
                keyCode: 82,
                code: "KeyR",
                bubbles: true,
                cancelable: true
            }));
        }
        if(e.keyCode == 69) {
            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "t",
                keyCode: 84,
                code: "KeyT",
                bubbles: true,
                cancelable: true
            }));
        }

        if([32, 192, 49, 50, 51].includes(e.keyCode)) {
            let commonKey = {
                32: {
                    key: "ArrowRight",
                    keyCode: 39,
                    code: "ArrowRight",
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: true,
                    shiftKey: document.querySelector('.index_view__MhyQ9') ? true : false,
                },
                192: {
                    key: "ArrowLeft",
                    keyCode: 37,
                    code: "ArrowLeft",
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: true,
                    shiftKey: document.querySelector('.index_view__MhyQ9') ? true : false,
                },
            }
            let {32: right, 192: left} = commonKey
            let keydownMap = {
                49: right,
                32: right,
                51: right,
                192: left,
                50: left,
            }

            if(document.querySelector('.index_view__MhyQ9')) {
                document.body.dispatchEvent(new KeyboardEvent("keydown", keydownMap[e.keyCode]));
            } else if(document.querySelector('.index_container__v2bdb').children.length || document.querySelector('.index_small-container__aVxtr')){
                // if([32, 49, 192].includes(e.keyCode)) {
                //     turn( [32, 49].includes(e.keyCode) ? 'right' : 'left')
                // }
                // else if([50, 51].includes(e.keyCode)) {
                //     document.body.dispatchEvent(new KeyboardEvent("keydown", keydownMap[e.keyCode]));
                // }
                if([192, 49, 32].includes(e.keyCode) && !e.altKey) {
                    turn( [32, 49].includes(e.keyCode) ? 'right' : 'left')
                } else if([192, 49].includes(e.keyCode)) {
                    document.body.dispatchEvent(new KeyboardEvent("keydown", keydownMap[e.keyCode]));
                }


                function turn(direction) {
                    let visiblePages = [...document.querySelector('.index_trackItem__6QT87').querySelectorAll('.index_track-rect__AvEjU')];

                    if(document.querySelector('.index_absolute-center__GLVXE')) { //判断是否超出分页区
                        let curPageDom = document.querySelector('.index_absolute-center__GLVXE').parentElement
                        let curPage = document.querySelector('.index_absolute-center__GLVXE').innerText -0

                        visiblePages.some((curPage, idx) => {
                            if(curPage === curPageDom) {
                                let pages = direction === 'right' ? visiblePages.slice(idx+1) : visiblePages.slice(0, idx).reverse()
                                if(!pages.length) { //处理首页和末页
                                    let {width, left} = document.querySelector('.index_scroll-line__GHJXu').children[0].style //progress bar
                                    if((direction === 'right' && parseInt(/(.*)%/.exec(width)[1]) + parseInt(/(.*)%/.exec(left)[1]) !== 100) || (direction === 'left' && left !== '0%')) { //判断是否需要更新预览区
                                        updatePages(direction)
                                        turn(direction)
                                        return true
                                    }
                                }
                                pages.some((nextPage, nextIdx) => {
                                    if(nextPage.className.includes('index_relation__pabdZ') || nextPage.className.includes('index_key-relation__qe-c4')) {
                                        nextPage.click()
                                        return true
                                    }
                                    if(nextIdx == pages.length-1) {
                                        let {width, left} = document.querySelector('.index_scroll-line__GHJXu').children[0].style //progress bar
                                        if(parseInt(/(.*)%/.exec(width)[1]) + parseInt(/(.*)%/.exec(left)[1]) !== 100) { //判断是否需要更新预览区
                                            updatePages(direction)
                                            turn(direction)
                                            return true
                                        }
                                    }
                                })
                                return true
                            }

                            let {width, left} = document.querySelector('.index_scroll-line__GHJXu').children[0].style //progress bar
                            if(direction === 'right' && curPage === curPageDom && idx == visiblePages.length-1) { //当前页位于分页区末页
                                if(parseInt(/(.*)%/.exec(width)[1]) + parseInt(/(.*)%/.exec(left)[1]) == 100) return true

                                updatePages(direction)
                                turn(direction)
                                return true
                            } else if(direction === 'left' && curPage === curPageDom && idx == 0) { //当前页位于首页
                                if(left == '0%') return true //判断是否需要更新分页区

                                updatePages(direction)
                                turn(direction)
                                return true
                            }
                        })
                    } else {
                        let pages = direction === 'right' ? visiblePages : visiblePages.reverse()
                        // console.log('pages', pages)
                        pages.some((curPage, idx) => {
                            if(curPage.className.includes('index_relation__pabdZ') || curPage.className.includes('index_key-relation__qe-c4')) {
                                console.log(curPage)
                                curPage.click()
                                return true
                            }

                            let {width, left} = document.querySelector('.index_scroll-line__GHJXu').children[0].style //progress bar
                            if(direction === 'right' && idx == pages.length-1 && (parseInt(/(.*)%/.exec(width)[1]) + parseInt(/(.*)%/.exec(left)[1]) !== 100)) {
                                updatePages(direction)
                                turn(direction)
                                return true

                            } else if(direction === 'left' && idx == pages.length-1 && left !== '0%') { //遍历至首页 且 需要更新分页区
                                updatePages(direction)
                                turn(direction)
                                return true

                            }
                        })
                    }

                    function updatePages(direction) {
                        let viewTurnBtn = document.querySelector('.index_scroll-bar__V5IcI').querySelectorAll('.anticon')[direction === 'left' ? 0 : 1]
                        viewTurnBtn.click()
                    }
                }
            } else if(!document.querySelector('.index_container__v2bdb').children.length && !document.querySelector('.index_small-container__aVxtr')){
                document.body.dispatchEvent(new KeyboardEvent("keydown", keydownMap[e.keyCode]));
            }
        }

        if(e.keyCode == 27) {
			if(!e.isTrusted) return
			showMessage('删除当前对象')
			document.body.dispatchEvent(new KeyboardEvent("keydown", {
				key: "Backspace",
				keyCode: 8,
				code: "Backspace",
				ctrlKey: true,
				bubbles: true,
				cancelable: true
			}))
        }
		if(e.keyCode == 90) {
			document.body.dispatchEvent(new KeyboardEvent("keyup", {
				key: "Escape",
				keyCode: 27,
				code: "Escape",
				ctrlKey: false,
				bubbles: true,
				cancelable: true
			}))
		}
    });

    window.addEventListener('mousedown', (e) => {
        if(e.button == 1) {
			e.preventDefault()
            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "e",
                keyCode: 69,
                code: "KeyE",
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            }))
        }
    })


    function awaitLoad() {
        return new Promise((res, rej) => {
            let observer = new MutationObserver((mrs) => {
                // console.log(mrs)
                mrs.some((mr) => {
                    [...mr.addedNodes].some((an) => {
                        let findEl = document.querySelector('.index_container__v2bdb')
                        if(an?.nodeName === 'DIV' && findEl) {
                            // console.log(an)
                            observer.disconnect();
                            res(true)
                        }
                    })
                })
            });
            observer.observe(document, { childList: true, subtree: true})
        })
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


    /**
     * @description 修改元素的css样式
     * @param {Map} styleMap 样式表
     * @return {void}
     */
    function setElStyle(...args) {
        let dataType = /\[object (.*)\]/.exec(Object.prototype.toString.call(args[0]))[1]

        if (dataType === 'Map') {
            const styleMap = args[0]
            for (const [el, styleObj] of styleMap) {
                setStyleObj(el, styleObj)
            }
        } else if (/HTML.*Element/.test(dataType)) {
            const [el, styleObj] = args
            setStyleObj(el, styleObj)
        }

        function setStyleObj(el, styleObj) {
            for (let attr in styleObj) {
                if (el.style[attr] !== undefined) { //检查是否存在该CSS属性
                    el.style[attr] = styleObj[attr]
                } else {
                    //将key转为标准css属性名
                    let formatAttr = attr.replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`)
                    console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
                }
            }
        }
    }


    function Observe(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
        let ob = new MutationObserver(callBack);
        ob.observe(target, options);
        return ob
    }

    function $(sel) {
        return document.querySelector(sel)
    }
/**
==日志===
2024/2/1
- 新增：个体属性面板自动保存

2024/2/3
- 新增：快捷键【Q】俯视角左调
- 新增：快捷键【E】俯视角右调
- 新增：快捷键【鼠标中键】进入/退出三视图编辑模式
- 新增：快捷键【空格】帧数前切（选中个体时，控制在关联帧范围；三视图总览表→批量前切）
- 新增：快捷键【`】帧数后切（选中个体时，控制在关联帧范围；三视图总览表→批量后切）
- 新增：快捷键【Ctrl + Y】 开启/关闭自动删除

2024/2/4
- 新增：快捷键【P】开启/关闭快捷键自定义面板

2024/2/19
- 新增：首次进入时，默认选中 展示映射、自车轨迹、行车轨迹
- 新增：放大三视图时，自动显示快捷属性
- 新增：快捷键【1】前进一帧
- 新增：快捷键【2】向后一帧（Ctrl →）
- 新增：快捷键【3】向前一帧（Ctrl ←）

2024/2/20
- 新增：批量重检
- 新增：选中个体时默认平移模式
- 新增：双击调出/关闭 三视图预览表

2024/2/22
- 调整：俯视角左调设为Q时，只在三视图放大时生效，避免与聚焦功能冲突
- 调整：取消 【2】和【3】
- 新增：【Alt + `】向后一帧（Ctrl ←）
- 新增：【Alt + `】向前一帧（Ctrl →）
- 新增：【ESC】删除当前对象
- 新增：右键菜单追踪鼠标，实现快捷复制。点击复制项的左半边 向前复制1帧，点击右半边 向后复制1帧

2024/2/23
- 新增：简化点云图右键菜单项，并调整复制和删除的位置
- 修复：缩放网页大小引起的鼠标中间默认行为触发
- 新增：双击右键菜单删除项可删除全帧对象
- 新增：复制对象后的消息框反馈和距离提示

2024/2/24
- 调整：取消右键菜单的简化操作（当右键非菜单区域时，会导致平台崩溃）
- 新增：几何属性的颜色提示
- 新增：点数筛选
- 新增：快捷属性标签锁定

2024/2/25
- 新增：个体属性面板展示几何信息
- 新增：三视图放大下的点数验证，并给出颜色提示

2024/3/1
- 新增：点云小视图尺寸调整

2024/3/6
- 新增：【Z】失焦个体
- 修复：首次进入三视图放大模式，保存失效和点云图小窗调整失效
- 调整：点数Label和几何面板位置
=========
**/
})();