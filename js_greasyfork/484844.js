// ==UserScript==
// @name         曼孚新平台-标注工具
// @namespace    http://tampermonkey.net/
// @version      2024.1.29.1 Beta
// @description  try to
// @author       You
// @match        https://label.mindflow.com.cn/pointCloudPro?*
// @icon         https://label.mindflow.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484844/%E6%9B%BC%E5%AD%9A%E6%96%B0%E5%B9%B3%E5%8F%B0-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/484844/%E6%9B%BC%E5%AD%9A%E6%96%B0%E5%B9%B3%E5%8F%B0-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    
/**==================================

快捷键：
【B】        ==>  聚焦选中的个体
【F】        ==>  控制23D框的显隐
【Tab】      ==>  三视图被放大时，切换三视图；三视图没被放大时，调出个体属性面板
【Shift+Z】  ==>  切换点云渲染方案（高度渲染 <==> 自定义渲染）
【;】        ==>  开启/关闭 切换个体时，自动调出个体属性面板
【O】        ==>  展示/隐藏 映射图C4、C5、C6、C7
【` / Alt+`】==>  显示个体分类选择弹框（Alt+` 可以在个体属性面板显示时生效）
数字键盘     ==>  选择相机视角(8:前方  2:后方  7:左前  9:右前  1:左后  3:右后  5:复原缩放  Enter: 放大/缩小)

自动生效：
- 隐藏映射图C4、C5、C6、C7
- 贴边滚动映射图
- 鼠标右键缩放三视图
- 选中对象时自动开启关联映射，失焦时自动关闭
- 保持隐藏映射图2D框
- 增加 点云遮挡、点云截断、2D映射截断 的标签颜色反馈

==================================**/

    function awaitRunning() {
        return new Promise((res, rej) => {
            let observer = new MutationObserver((mrs) => {
            // console.log(mrs)
                mrs.some((mr) => {
                    if(mr.type == 'attributes' && mr.target.className === 'task-load-panel' && mr.target.style.display === 'none'){
                        observer.disconnect()
                        res(true)
                    }
                })
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true })
        })
    }

    if(!await awaitRunning()) return alert('工具加载失败，请刷新重试！')

    let ga = {
        isHide23D: false,
        isHide23DControllable: true,
        isAutoOpenAttrPanel: false,
        objListObserver: void 0,
        isHideMappingImg: false,
    }
    window.ga = ga;

    function MappingImgVis(visibility) {
        let allMappingImg = document.querySelectorAll('.x-image-mapping');
        [3, 4, 5, 6].forEach((item) => {
            allMappingImg[item].querySelector('.x-image-mapping__item__left__name').style.background = 'red';
            allMappingImg[item].style.display = visibility ? 'block' : 'none'
        });
        ga.isHideMappingImg = !visibility

        document.querySelector('.dragContainer.right-container').dispatchEvent(new MouseEvent('mousedown'))
        document.dispatchEvent(new MouseEvent('mouseup'))
    }
    MappingImgVis(false)

    document.querySelector('.left-wrapper').style.padding = 0;
    document.querySelector('.el-scrollbar.image-mapping-container').style.padding = '0px 5px 0px 5px';
    document.querySelector('.left-wrapper').querySelector('.el-scrollbar__wrap').style.display = 'flex'
    document.querySelector('.left-wrapper').querySelector('.el-scrollbar__wrap').style.flexDirection = 'column'


    let vps = [...document.querySelector('.viewport-bottom').querySelectorAll('.box-wrapper')];
    vps.some((vp) => {
        rightClickTrigger(vp, () => {
            vp.querySelector('.box-scale-icon').click()
        }, 5)
    });

    function rightClickTrigger(el, fn, moveThreshold = 0) {
        let moveCount = 0
        let allowTrigger = false
        let isRightdown = false

        el.addEventListener('mousedown', (e)=>{
            if(e.which !== 3) return
            moveCount = 0
            isRightdown = true
            allowTrigger = true
        })
        el.addEventListener('mousemove', (e)=>{
            if(!isRightdown || (isRightdown && ++moveCount <= moveThreshold)) return

             allowTrigger && (allowTrigger = false)
        })
        el.addEventListener('mouseup', (e)=>{
            if(e.which !== 3) return
            if (allowTrigger) fn()
            isRightdown = false
        })
    }

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


    //选中对象时自动开启关联映射，失焦时自动关闭
    let timer_closeLinkmapping
    new MutationObserver((mrs) => {
        mrs.some((mr) => {
            //至少一张存在关联关系 ==> 开启
            if(mr.target.className.includes('x-image-mapping__item__left__name') && mr.oldValue == "x-image-mapping__item__left__name el-tooltip__trigger el-tooltip__trigger") {
                return (operateLinkmappingBtn(true), true)
            }

            //无映射关联时 ==> 关闭
            if(mr.addedNodes[0]?.className?.includes('no-reference')) operateLinkmappingBtn(false)
        })
    }).observe(document.querySelector('.left-wrapper').querySelector('.el-scrollbar__view'), { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})


    //控制关联映射按钮
    function operateLinkmappingBtn(isOpen) {
        let linkMapBtn = document.querySelector('.left-header__icon')
        if(linkMapBtn.querySelector(isOpen ? '.icon-allCamera' : '.icon-mappingCamera')) linkMapBtn.click()
    }

    function wei23DVis(vis) {
        let control2D_btn = [...document.querySelectorAll('.iconfont.icon-annotation-2D-show'), ...document.querySelectorAll('.iconfont.icon-annotation-2D-hide'), ...document.querySelectorAll('.iconfont.icon-annotation-2D-show-half')].find((btn) => btn.style.display !== 'none')
        let control3D_btn = [...document.querySelectorAll('.iconfont.icon-annotation-wei3D-show'), ...document.querySelectorAll('.iconfont.icon-annotation-wei3D-hide'), ...document.querySelectorAll('.iconfont.icon-annotation-wei3D-show-half')].find((btn) => btn.style.display !== 'none')

        if(vis) {
            if(/show(?!-half)/.test(control3D_btn.className)) {
                return (ga.isHide23DControllable = true)
            } else {
                control3D_btn.click()
                setTimeout(() => {wei23DVis(true)}, 200)
            }
        } else {
            if(control2D_btn.className.includes('hide') && control3D_btn.className.includes('hide')) return (ga.isHide23DControllable = true)
            if(!control2D_btn.className.includes('hide')) control2D_btn.click()
            if(!control3D_btn.className.includes('hide')) control3D_btn.click();
            setTimeout(() => {wei23DVis(false)}, 200)
        }
    }

    new MutationObserver((mrs) => {
        mrs.some((mr) => {
            // console.log(222, mr);
            [...mr.addedNodes].some((an) => {
                if(an.className === 'attribute-container') {
                    rightClickTrigger(an, () => {
                        an.querySelector('.close').click()
                    }, Infinity)

                }
                if(an.className === 'el-tree arrtribute-tree') {
                    const attrKeyMap = {
                        '雷达属性': 'radar',
                        '车辆类型': 'type',
                        '开门属性': 'door',
                        '是否为关键障碍物': 'key',
                        '点云遮挡属性': 'pcObstruct',
                        '点云截断属性': 'pcTruncate',
                        '2D映射图截断': 'phTruncate',
                        '2D映射图遮挡': 'phObstruct',
                    }
                    const attrMap = {}
                    const allAttrItem = [...document.querySelector('.el-tree.arrtribute-tree').children].filter(item => item.className.includes('arrtribute-tree-node'))
                    allAttrItem.forEach((item) => {
                        attrMap[attrKeyMap[item.querySelector('.tooltip-wrapper').innerText]] = [item.querySelector('.label-tag-box').innerText, item.querySelector('.label-tag-box').querySelector('.item-tag')]
                    });
                    console.log(attrMap)
                    attrTip(attrMap)

                    new MutationObserver((mrs) => {
                        mrs.some((mr) => {
                            // console.log(111, mr)
                            if(mr.target.className.includes('label-tag-box')) {
                                // console.log( mr.target.parentElement)
                                let attrItem = mr.target.parentElement
                                attrMap[attrKeyMap[attrItem.querySelector('.tooltip-wrapper').innerText]] = [attrItem.querySelector('.label-tag-box').innerText, attrItem.querySelector('.label-tag-box').querySelector('.item-tag')]
                                console.log('check')
                                attrTip(attrMap)
                            }
                        })
                    }).observe(document.querySelector('.attribute-container'), {childList: true, subtree: true})
                }
            })
        })
    }).observe(document.querySelector('.main'), {childList: true, subtree: true})

    function attrTip(attrMap) {
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
                    console.log('当前处于放大', vp)
                    //收起当前视图
                    vp.querySelector('.box-scale-icon.box-blow-down').click()
                    //放大下一个视图
                    let nextVp = vpSequence[idx !== 2 ? ++idx : 0]
                    nextVp.dispatchEvent( new Event('mousedown') );
                    setTimeout(() => { nextVp.querySelector('.box-scale-icon.box-blow-up').click() })

                    return true
                }
            })

            if(!isBlow && !document.querySelector('.attribute-container')) document.querySelector('.engraving-container').querySelector('.modify-attribute').click()
        }

        //【B】
        if(e.keyCode == 66) {
            let time = 0
            let objListBtn = document.querySelector('.drawer').nextElementSibling.querySelector('.operate-item.el-tooltip__trigger')
            if(!objListBtn.className.includes('selected')) {
                objListBtn.click()
                time = 200
            }
            setTimeout(() => {
                let expandBtn = document.querySelector('.object-list').querySelector('.icon-liebiaozhankai')?.click()
                let allTypes = [...document.querySelector('.object-list').querySelector('.el-tree').children].filter(child => child.className.includes('el-tree-node'))
                allTypes.some((curType) => {
                    return [...curType.querySelector('.el-tree-node__children').children].some((item) => {
                        if(item.className.includes('is-expanded')) return (item.click(), true)
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
        if(ga.isHide23DControllable && e.keyCode == 70 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            ga.isHide23DControllable = false
            wei23DVis(ga.isHide23D)
            ga.isHide23D = !ga.isHide23D

        }


        //【;】
        if(e.keyCode == 186) {
            if(!ga.isAutoOpenAttrPanel) {
                let isRemoveObjList
                ga.objListObserver = observeObjList()
                let selectedObj = null
                let observer = new MutationObserver((mrs) => {
                    // console.log(mrs);
                    mrs.some((mr) => {
                        [...mr.removedNodes].some((rn) => {
                            if(rn.className === 'object-list') {
                                isRemoveObjList = true
                                ga.objListObserver.disconnect()
                            }
                        });

                        [...mr.addedNodes].some((an) => {
                            if(ga.isAutoOpenAttrPanel && isRemoveObjList !== false && an.className === 'object-list') {
                                ga.objListObserver = observeObjList()
                                isRemoveObjList = false
                            }
                        })
                    })

                });
                observer.observe(document.querySelector('.drawer'), {childList: true})
                ga.isAutoOpenAttrPanel = true
                showMessage('开启：个体属性面板的自动调出')

                function observeObjList() {
                    let objectList = document.querySelector('.object-list')
                    if(!objectList) return null
                    let objListObserver = new MutationObserver((mrs) => {

                        //console.log('=====', mrs)
                        mrs.some((mr) => {
                            if(mr.type !== 'attributes') return

                            if(selectedObj !== mr.target.parentNode.parentNode && mr.target.className.includes('el-icon el-tree-node__expand-icon expanded')) {
                                //刚打开对象列表的某个分类时，个体已选中，需要手动的获取一次选中个体
                                if(mr.target.nextElementSibling?.textContent?.includes('#')) {
                                    selectedObj = mr.target.parentNode.parentNode
                                    console.log('artificial select', selectedObj)
                                } else {
                                    console.log('type expanded')
                                    setTimeout(() => {
                                        selectedObj = document.querySelector('.el-tree-node.is-expanded.object-item')
                                    })

                                }

                                setTimeout(() => {
                                    console.log('show panel')
                                    if(!document.querySelector('.attribute-container')) document.querySelector('.engraving-container').querySelector('.modify-attribute').click()
                                }, 300)
                            }
                        })


                    })
                    objListObserver.observe(objectList, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
                    return objListObserver
                }
            } else {
                if(ga.objListObserver) ga.objListObserver.disconnect()
                ga.isAutoOpenAttrPanel = false
                showMessage('取消：个体属性面板的自动调出')

            }

        }


        //【O】
        if(e.keyCode == 79) {
            MappingImgVis(ga.isHideMappingImg)
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
        } else if (dataType === 'HTMLDivElement') {
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

=========
**/
})();