// ==UserScript==
// @name         pz3D
// @namespace    http://tampermonkey.net/
// @version      2024.12.18.4
// @description  try it
// @author       You
// @match        http://139.224.232.214/labeltools/?type=BATCHWORK&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506727/pz3D.user.js
// @updateURL https://update.greasyfork.org/scripts/506727/pz3D.meta.js
// ==/UserScript==

const _ds = {
    isHighlight: false,
    isSetOutside: false,
    isSetHidden: false,
}
window._ds = _ds;

(async function() {
    window.$ = Document.prototype.$ = Element.prototype.$ = $
    window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$

    if(await awaitLoad()) showMessage('脚本生效中...', {type: 'success'})


    document.addEventListener('keydown', (e) => {
        // console.log(e.keyCode, e)
        if(['input[type="text"]', 'input[type=""]', 'textarea'].find(lab => document.activeElement?.matches(lab))) return

        const is_inTracking = $('.index_container__v2bdb:not(.hidden)')

        //【4】或【5】
        if(e.keyCode == 52 || e.keyCode == 53) {
            $$('.index_TopBar__atir2 .anticon').find(item => {
                const use = item.$('use')
                return use.getAttribute('xlink:href') == '#navbar-icon-setting'
            }).click();
            e.keyCode == 52 ? (_ds.isSetOutside = true) : (_ds.isSetHidden = true)
        }

        //【Tab】
        if(e.keyCode == 9) {
            e.preventDefault()

            const images_2d = [...$('.index_control__C8NVb .index_footer__9yCgR').children].filter(item => item.textContent !== 'M')
            let curSelIdx = images_2d.findIndex(img => img.matches('.index_selected__cO5nI'))
            if(e.shiftKey) curSelIdx = images_2d.length-1 - curSelIdx
            let imagesList = !e.shiftKey ? images_2d : images_2d.toReversed()
            const nextImg = imagesList.find((img, idx) => idx > curSelIdx && img.$('.index_exhibition-wrap__Su7aO'))?.$('.index_posBtName__MUO2p')
            if(nextImg) {
                nextImg.click()
            } else {
                imagesList.find((img, idx) => idx >= 0 && img.$('.index_exhibition-wrap__Su7aO'))?.$('.index_posBtName__MUO2p').click()
            }
        }

        //【B】
        if(e.keyCode == 66 ) {
            _ds.isHighlight = !_ds.isHighlight;

            [
                ...$$('.index_flexGrowView__IV3Bl canvas'),
                $('.index_container__v2bdb .index_container__63WZq'),
                $('.index_main__dnpUj .index_container__63WZq'),
                ...$$('.index_container__0mnyY'),
                $('.index_container__fp054'),
                $('.index_container__fp054 .index_container__63WZq'),
            ].forEach((item) => {
                if(!item) return

                item.style.transition = '.5s all'
                item.style.filter = _ds.isHighlight ? 'brightness(2)' : null
            })
        }

        //【Q】
        if(e.keyCode == 81 && is_inTracking) {
            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "r",
                keyCode: 82,
                code: "KeyR",
                bubbles: true,
                cancelable: true
            }));
        }

        //【E】
        if(e.keyCode == 69 && is_inTracking) {
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

        //【Esc】
        if(e.keyCode == 68 && e.ctrlKey) {
            e.preventDefault()

            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "Backspace",
                keyCode: 8,
                code: "Backspace",
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            }))
            showMessage('删除当前对象')
        }

        //【Z】
        if(e.keyCode == 90 && $('.index_left__UteiD')) {
            if(!e.shiftKey) {
                document.body.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "+",
                    keyCode: 187,
                    code: "Equal",
                    shiftKey: true,
                    bubbles: true,
                }))
                showMessage('复制到下一帧', {showTime: 1500})
            } else {
               document.body.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "_",
                    keyCode: 189,
                    code: "Minus",
                    shiftKey: true,
                    bubbles: true,
                }))
                showMessage('复制到上一帧', {showTime: 1500})
            }

        }
    });

    document.addEventListener('mousedown', (e) => {
        if(e.button == 1) {
            e.preventDefault()
            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: "e",
                keyCode: 69,
                code: "KeyE",
                altKey: true,
                bubbles: true,
                cancelable: true
            }))
        }
    })
})();


function awaitLoad() {
    let isLoading = false
    let isObsToolBar = false

    return new Promise((res, rej) => {
        let mX = 0
        let mY = 0
        const groups_turnLight = [
            ['左转向灯亮', '左转向灯熄灭', '左转向灯不确定', '左转向灯不可见'],
            ['右转向灯亮', '右转向灯熄灭', '右转向灯不确定', '右转向灯不可见'],
        ]
        const groups_carDoor = [
            ['左边门开', '左边门关', '左门无法判断'],
            ['右边门开', '右边门关', '右门无法判断'],
            ['后备箱门开', '后备箱门关', '后备箱门无法判断'],
        ]

        Obs(document, (mrs) => {
            //过滤尺寸参数更新的记录
            if(!mrs.every(mr => mr.target?.matches?.('.index_cube-info__wYdK3') || mr.target?.matches?.('.index_cube-info__wYdK3 span'))) console.log(mrs)

            mrs.some((mr) => {
                [...mr.addedNodes].some((an) => {
                    // an.nodeName !== '#text' && console.log(an)

                    if(!isLoading && an?.nodeName === 'DIV' && $('.index_container__v2bdb')) res(true)

                    if(an?.nodeName === 'DIV' && an.className == '' && an.textContent.startsWith('显示配置')) {
                        Obs(an, (mrs) => {
                            mrs.forEach(mr => {
                                if(mr.type == 'attributes' && mr.target.matches('.ant-modal-wrap')) {
                                    if(_ds.isSetHidden && mr.target.style.display !== 'none') {
                                        func()
                                    }
                                }
                            })
                            // console.log(mrs)
                        }, {childList: true, subtree: true, attributes: true, attributeOldValue: true})
                        func()
                        function func() {
                            const settingPanel = $('.ant-modal.index_TheStopModal__RTmQK')
                            const li_obj = settingPanel.$$('li').find(item => item.textContent.startsWith('标注对象'))
                            const li_common = settingPanel.$$('li').find(item => { //通用功能
                                return item.textContent.startsWith('通用功能') && item.parentElement.parentElement.textContent.startsWith('标注对象')
                            })
                            const targetBtn = settingPanel.$$('.DP-row').find(item => item.textContent.includes('选中不隐藏其他对象'))?.$('button')
                            if(targetBtn) {
                                targetBtn.click()
                                settingPanel.$$('.DP-bottom button').find(btn => btn.textContent == '应 用')?.click()
                                settingPanel.$('.ant-modal-close')?.click()
                                _ds.isSetHidden = false
                            } else if(li_common){
                                li_common.click()
                            } else {
                                li_obj.children[0].click()
                            }
                        }
                    }
                    if(_ds.isSetHidden && an.matches?.('.ant-menu.ant-menu-sub') && an.textContent.startsWith('通用功能快捷属性')) {
                        const lis = $$('.ant-modal.index_TheStopModal__RTmQK li')
                        lis.find(item => {
                            return item.textContent.startsWith('通用功能') && item.parentElement.parentElement.textContent.startsWith('标注对象')
                        })?.click()
                    }
                    if(_ds.isSetHidden && an.matches?.('.DP-view') && an.textContent.includes('选中不隐藏其他对象')) {
                        const settingPanel = $('.ant-modal.index_TheStopModal__RTmQK')
                        const targetBtn = settingPanel.$$('.DP-row').find(item => item.textContent.includes('选中不隐藏其他对象'))?.$('button')
                        targetBtn.click()
                        settingPanel.$$('.DP-bottom button').find(btn => btn.textContent == '应 用')?.click()
                        settingPanel.$('.ant-modal-close')?.click()
                        _ds.isSetHidden = false
                    }


                    if(an?.matches?.('.ant-modal-root') && an.textContent.startsWith('多矩形框 对象属性')) {
                        
                        setTimeout(() => $$('.index_title__KB3CQ')[1].scrollIntoView({block: "start"}), 300)

                        const li_turnLight = an.$$('.index_MatchInput__ZcwID').find(item => item.$('.index_title__Fzt5I').textContent.startsWith('* 转向灯'))
                        const li_carDoor = an.$$('.index_MatchInput__ZcwID').find(item => {
                            const header = item.$('.index_title__Fzt5I')
                            const res = header.textContent.startsWith('* 开车门')
                            if(res && !$('.travel-btn')) header.append(createBtn())
                            return res
                        })
                        ObsAttr(li_turnLight, groups_turnLight)
                        ObsAttr(li_carDoor, groups_carDoor)
                    }

                    if(an.matches?.('.index_MatchInput__ZcwID') && an.textContent.startsWith('* 转向灯')) {
                        ObsAttr(an, groups_turnLight)
                    }
                    if(an.matches?.('.index_MatchInput__ZcwID') && an.textContent.startsWith('* 开车门')) {
                        if(!$('.travel-btn')) an.$('.index_title__Fzt5I').append(createBtn())

                        ObsAttr(an, groups_carDoor)
                    }

                    function createBtn() {
                        return createEl('div', {
                            className: 'travel-btn',
                            innerText: '行驶',
                            style: {
                                padding: '0px 5px',
                                height: '20px',
                                lineHeight: '20px',
                                margin: '0 0 0 5px',
                                backgroundColor: 'rgb(136, 136, 136)',
                                color: 'rgb(255, 255, 255)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                borderRadius: '5px',
                            },
                            onclick: function() {
                                const selList = ['左边门关', '右边门关', '后备箱门关']
                                const targetItem = $$('.index_MatchInput__ZcwID').find(item => item.textContent.startsWith('* 开车门'))
                                targetItem.$$('label').forEach(label => {
                                    const matchRes = selList.some(content => label.textContent.includes(content))
                                    if(matchRes) {
                                        if(!label.matches('.ant-checkbox-wrapper-checked')) label.click()
                                    } else if(label.matches('.ant-checkbox-wrapper-checked')) {
                                        label.click()
                                    }
                                })
                            }
                        })
                    }
                    function ObsAttr(obsTarget, groups) {
                        Obs(obsTarget, mrs => {
                            mrs.forEach(mr => {
                                const target = mr.target
                                if(mr.attributeName == 'class' && target.matches('.ant-checkbox-wrapper.ant-checkbox-wrapper-checked')) {
                                    const labels = obsTarget.$$('label')
                                    groups.forEach(group => {
                                        const findRes = group.find(option => option == target.textContent)
                                        if(!findRes) return

                                        group.some(option => {
                                            if(option == target.textContent) return

                                            const optionLabel = labels.find(label => label.textContent.includes(option))
                                            if(optionLabel && optionLabel.matches('.ant-checkbox-wrapper-checked')) optionLabel.click()
                                        })
                                        const label_notAno = labels.find(label => label.textContent.includes('无需标注'))
                                        if(label_notAno && label_notAno.matches('.ant-checkbox-wrapper-checked')) label_notAno.click()
                                    })

                                    if(target.textContent === '无需标注') {
                                        labels.forEach(label => {
                                            if(label.textContent !== '无需标注' && label.matches('.ant-checkbox-wrapper-checked')) label.click()
                                        })
                                    }
                                }
                            })
                        }, {childList: true, subtree: true, attributes: true})
                    }
                    if(an?.nodeName === 'DIV' && an.className == '' && an.textContent.startsWith('显示配置')) {
                        Obs(an, (mrs) => {
                            mrs.forEach(mr => {
                                if(mr.type == 'attributes' && mr.target.matches('.ant-modal-wrap')) {
                                    if(_ds.isSetOutside && mr.target.style.display !== 'none') {
                                        func()
                                    }
                                }
                            })
                            // console.log(mrs)
                        }, {childList: true, subtree: true, attributes: true, attributeOldValue: true})
                        func()
                        function func() {
                            const settingPanel = $('.ant-modal.index_TheStopModal__RTmQK')
                            const li_obj = settingPanel.$$('li').find(item => item.textContent.startsWith('标注对象'))
                            const li_imgObj = settingPanel.$$('li').find(item => { //图像对象
                                return item.textContent.startsWith('图像对象') && item.parentElement.parentElement.textContent.startsWith('标注对象')
                            })
                            const targetBtn = settingPanel.$$('.DP-row').find(item => item.textContent.includes('允许绘制到图像外'))?.$('button')
                            if(targetBtn) {
                                targetBtn.click()
                                settingPanel.$$('.DP-bottom button').find(btn => btn.textContent == '应 用')?.click()
                                settingPanel.$('.ant-modal-close')?.click()
                                _ds.isSetOutside = false
                            } else if(li_imgObj){
                                li_imgObj.click()
                            } else {
                                li_obj.children[0].click()
                            }
                        }
                    }

                    if(_ds.isSetOutside && an.matches?.('.ant-menu.ant-menu-sub') && an.textContent.startsWith('通用功能快捷属性')) {
                        const lis = $$('.ant-modal.index_TheStopModal__RTmQK li')
                        lis.find(item => {
                            return item.textContent.startsWith('图像对象') && item.parentElement.parentElement.textContent.startsWith('标注对象')
                        })?.click()
                    }

                    if(_ds.isSetOutside && an.matches?.('.DP-view') && an.textContent.includes('允许绘制到图像外')) {
                        const settingPanel = $('.ant-modal.index_TheStopModal__RTmQK')
                        const targetBtn = settingPanel.$$('.DP-row').find(item => item.textContent.includes('允许绘制到图像外'))?.$('button')
                        targetBtn.click()
                        settingPanel.$$('.DP-bottom button').find(btn => btn.textContent == '应 用')?.click()
                        settingPanel.$('.ant-modal-close')?.click()
                        _ds.isSetOutside = false
                    }

                    if(an?.matches?.('.index_tracking-view__6ChPR')) {
                        const indicator = [...an.children].find(item => item.classList.contains('index_view-instance__0KM+j'))
                        indicator.style.zIndex = 9999
                        indicator.style.bottom = '-10px'
                    }

                    if(an?.classList?.contains('index_main__L+qBm')) {
                         const btn_scale = $('.index_cube-scale-translation-tracking__2BRIw')
                         const btn_scale_value = btn_scale.$$('span')[1].firstChild
                        btn_scale_value.nodeValue == '缩放' && lockTranslation()

                        Object.defineProperty(btn_scale_value, 'nodeValue', {
                            get: function() {
                                return this.textContent;
                            },
                            set: function(newValue) {
                                if(newValue == '缩放') setTimeout(() => lockTranslation())
                                this.textContent = newValue;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        function lockTranslation() {
                            const btn_scale_btn = btn_scale.$('button')
                            if(btn_scale_btn.textContent == '缩放') {
                                btn_scale_btn.click()
                                setTimeout(() => lockTranslation())
                            }
                        }
                    }

//                     if(an?.matches?.('.index_body-shape-tracking__NGXB3 .ant-btn-primary')) {
//                         const btn_shape_value = an.$('span').firstChild
//                         btn_shape_value.nodeValue == '变形刚体' && lockStabilize()

//                         Object.defineProperty(btn_shape_value, 'nodeValue', {
//                             get: function() {
//                                 return this.textContent;
//                             },
//                             set: function(newValue) {
//                                 if(newValue == '变形刚体') setTimeout(() => lockStabilize())
//                                 this.textContent = newValue;
//                             },
//                             enumerable: true,
//                             configurable: true
//                         });
//                     }

                    if(an?.matches?.('.ant-modal-root') && an.textContent.startsWith('多矩形框 对象属性')) {
                        const mask = an.$('.ant-modal-mask')
                        mask.style.background = 'transparent'

                        const dialogWrap = an.$('.ant-modal')
                        setStyle(dialogWrap, {
                            transition: '.2s all',
                            position: 'absolute',
                            top: `calc(50% - 362px + ${mY}px)`,
                            left: `calc(70% + ${mX}px)`,
                        })

                        let isdrag = false


                        dialogWrap.$('.ant-modal-header').addEventListener('mousedown', (e)=> {
                            isdrag = true
                        })
                        document.body.addEventListener('mousemove', (e)=> {
                            if(!isdrag) return

                            setStyle(dialogWrap, {
                                top: `calc(50% - 362px + ${mY += e.movementY}px)`,
                                left: `calc(70% + ${mX += e.movementX}px)`,
                            })
                        }, true)
                        dialogWrap.$('.ant-modal-header').addEventListener('mouseup', (e)=> {
                            isdrag = false
                        })
                    }


                    if(_ds.isHighlight
                       && ( (['.index_flexGrowView__IV3Bl','.index_container__63WZq','.index_control__C8NVb', '.index_container__fp054', '.index_main__dnpUj'].some(sel => an?.matches?.(sel)))
                           || an?.firstChild?.matches?.('.index_container__0mnyY')
                           || an?.classList?.contains('index_container__+Ha-u') )
                      ) {
                        const image2D = an.matches('canvas') ? [an] : an.$$('canvas')

                        image2D.forEach(item => {
                            setTimeout(() => {
                                item.style.transition = '.5s all'
                                item.style.filter = 'brightness(2)'
                            })

                        })

                    }

                    if(an?.matches?.('.index_mask__uUfCW')) {
                        const isTarget = ['放大', 'edit2d tracking编辑'].every((findTit) => {
                            return an.$$('.ant-menu-title-content').find(tit => tit.textContent == findTit)
                        })

                        if(isTarget) an.$$('.ant-menu-item').find(item => item.textContent === '放大').click()

                    }


                    if(an?.matches?.('.index_control__C8NVb')) {
                        an.$$('.index_posBtName__MUO2p')
                        .filter(item => item.textContent !== 'M')
                        .forEach(indicator => {
                            indicator.addEventListener('click', () => {
                                image2D_Zoom()
                            })
                        })

                        an.$('.index_channel-view__VH8ql').addEventListener('dblclick', () => {
                            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                                key: "'",
                                keyCode: 222,
                                code: "Quote",
                                bubbles: true,
                            }))
                        })
                    }

                    if(an?.matches?.('.index_exhibition-wrap__Su7aO')) image2D_Zoom()

                    if(an?.matches?.('.index_question__4Tm9w') || an?.matches?.('.index_QuestionTabs__kk6nt') && an.parentElement?.className !== 'index_trackingEditWrap__c2kEj') { //ctrl E 的面板不监视
                        (function resetTrasitionPattern() {
                            let btn = $('.index_cube-scale-translation-tracking__2BRIw > button:first-child')
                            if(btn && !btn.className.includes('index_translation-btn__+VcaE')) btn.click()
                        })()



                        if(an?.matches?.('.index_question__4Tm9w')) an = an.$('.index_QuestionTabs__kk6nt')

                        an.style.border = '2px solid red'

                        hiddenAttrTit()

                        Obs(an, (mrs) => {
                            mrs.some((mr) => {
                                if(mr.type === 'attributes' && mr.target.matches('.ant-radio-wrapper-checked') && mr.oldValue === 'ant-radio-wrapper') {
                                    // console.log('new select')
                                    $('.index_question__4Tm9w .ant-btn').click()
                                }
                            })
                        }, { childList: true, subtree: true, attributes: true, attributeOldValue: true})

                    }

                    if(!isObsToolBar) {
                        let toolBar = [...document.querySelectorAll('.toolBar_toolBar__q14CL')].find(item => item.innerHTML.includes('快捷属性') );
                        if(toolBar) {
                            ['展示映射'].some((title, i) => toolBar.$(`button[title="${title}"]`).click())

                            Obs(toolBar, (mrs) => {
                                // console.log(123, mrs)
                                if(mrs.find((mr) => mr.removedNodes[0]?.innerHTML.includes('自动外扩'))) return

                                ['显示其他框', '十字参考线', '展示映射'].some((title, i) => {
                                    let btn = $(`button[title="${title}"]`)
                                    setTimeout(() => { !btn?.className.includes('toolBar_active__PfJFI') ? btn?.click() : void 0 })
                                })


                            }, { childList: true, subtree: true})

                            isObsToolBar = true
                        }
                    }


                    if(an?.matches?.('.ant-message-notice') && an.innerText === '只允许切换锚点类型') an.remove()

                })
            })
        }, { childList: true, subtree: true})
    })


    function image2D_Zoom() {
        setTimeout(() => {
            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                key: ";",
                keyCode: 186,
                code: "Semicolon",
                bubbles: true,
                cancelable: true
            }))
        }, 500)
    }

    function lockStabilize() {
        const btn_shape = $('.index_body-shape-tracking__NGXB3 button')
        if(btn_shape.textContent == '变形刚体') {
            btn_shape.click()
            setTimeout(() => lockStabilize())
        }
    }
}

function hiddenAttrTit() {
    const attrPanel = getAttrPanel()

    attrPanel.$$('.index_title__KB3CQ').forEach(titleWrap => titleWrap.remove())

    const tit_secondLevel = ['物体形态', '对象类型', '物体运动状态']
    attrPanel.$$('.index_title__Fzt5I')
    .filter(titleWrap => tit_secondLevel.find(tit => titleWrap.textContent.includes(tit)))
    .forEach(titleWrap => titleWrap.remove())
}

function getAttrPanel() {
    return $('.index_container__v2bdb .index_QuestionTabs__kk6nt')
}


function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('目标不存在')

    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
}

function $(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    const sel = String(selector).trim();

    const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
    return (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
}

function $$(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    return Array.from(_this.querySelectorAll(selector))
}

function setStyle() {
    [[Map, ()=> {
        const styleMap = arguments[0]
        for (const [el, styleObj] of styleMap) {
            !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
        }
    }], [Element, () => {
        const [el, styleObj] = arguments
        setStyleObj(el, styleObj)
    }], [Array, () => {
        const [els, styleObj] = arguments
        els.forEach((el) => setStyleObj(el, styleObj))
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

function createEl(elName, options) {
    const el = document.createElement(elName)
    for(let opt in options) {
        if(opt !== 'style') {
            el[opt] = options[opt]
        } else {
            let styles = options[opt]
            setStyle(el, styles)
        }
    }
    return el
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
    setStyle(MessageWrap, {
        position: 'absolute',
        zIndex: '9999'
    })

    let MessageBox = document.createElement('div')
    MessageBox.innerText = message

    let closeBtn = document.createElement('div')
    closeBtn.textContent = '×'
    closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

    setStyle(MessageBox, {
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

    setStyle(closeBtn, {
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
        case 'top': setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'top left': setStyle(MessageWrap, {top: '1%', left: '.5%'}); break;
        case 'left': setStyle(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
        case 'top right': setStyle(MessageWrap, {top: '1%', right: '.5%', }); break;
        case 'right': setStyle(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
        case 'bottom': setStyle(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'bottom left': setStyle(MessageWrap, {bottom: '1%'}); break;
        case 'bottom right': setStyle(MessageWrap, {bottom: '1%', right: '.5%'}); break;
        default: setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
    }

    switch(config?.type) {
        case 'success': setStyle(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
        case 'warning': setStyle(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
        case 'error': setStyle(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
        default: setStyle(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
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
2024/9/4
- 新增：【`】后退一帧（选中对象时默认切换关联帧）/一组缩略帧
- 新增：【空格】 或 【1】前进一帧（选中对象时默认切换关联帧）/一组缩略帧
- 新增：【鼠标中键】进入/退出 三视图编辑模式
- 新增：【Alt + `】后退一帧
- 新增：【Alt + 1】前进一帧
- 新增：【Q】逆时针旋转航向角
- 新增：【E】顺时针旋转航向角
- 新增：【Esc】删除对象
- 新增：【Z】取消选中当前对象
- 新增：个体属性面板自动保存
- 新增：首次进入数据包，勾选必要的工具栏选项
- 新增：进入三视图编辑模式，勾选必要的工具栏选项
- 新增：三视图编辑模式默认平移调整

2024/9/8
- 调整：删除对象快捷键由【Esc】改为【Ctrl + D】
- 优化：简化个体属性面板内容
- 新增：自动放大展示映射（在进入三视图编辑模式、切帧 时触发）
- 新增：双击映射图还原缩放比
- 新增：锁定稳定刚体
- 新增：点云全景模式下，右键映射图放大
- 新增：【B】映射图亮度增强

2024/9/13
- 调整：匹配平台最新链接

2024/9/14
- 新增：2D属性面板可拖动

2024/12/5
- 调整：目标切换置顶（审核便利）
- 调整：鼠标中键进入2D图通道模式
- 新增：【Tab】向后切换关联映射图
- 新增：【Shift Tab】向前切换关联映射图

2024/12/11
- 新增：行驶状态下，特殊属性的勾选方案
- 新增：【4】开关设置项[允许绘制到图像外]
- 新增：特殊属性中各种同类型属性的单选方案

2024/12/12
- 新增：通道模式下【Z】复制到下一帧，【Shift Z】复制到上一帧
- 适配：新规则，车灯属性调整

2024/12/18
- 调整：取消稳定刚体的锁定
- 新增：【5】开关设置项[选中不隐藏其他对象]
- 新增：2D属性面板默认下滑至私有属性区域
**/