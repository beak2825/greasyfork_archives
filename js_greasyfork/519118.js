// ==UserScript==
// @name         pz3D_验收
// @namespace    http://tampermonkey.net/
// @version      2024.11.28.2
// @description  try it
// @author       You
// @match        http://139.224.232.214/labeltools/?type=BATCHWORK&*
// @match        https://ads.aligenie.com/labeltools?type=BATCHWORK&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519118/pz3D_%E9%AA%8C%E6%94%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/519118/pz3D_%E9%AA%8C%E6%94%B6.meta.js
// ==/UserScript==

const _ds = {
    isHighlight: false,
    isUnmodify: false,
    isComment: false,
    isLastFrame: false,
    isNextFrame: false,
    lastFrameTimer: null,
    nextFrameTimer: null,
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

        //【Tab】
        if(e.keyCode == 9) {
            $$('.index_TopBar__atir2 .anticon').find(item => {
                const use = item.$('use')
                return use.getAttribute('xlink:href') == '#navbar-icon-setting'
            }).click()
            _ds.isSetHidden = true
        }

        //【W】
        if(e.keyCode == 87) {
            _ds.isUnmodify = _ds.isComment = true
            setTimeout(() => { _ds.isUnmodify = _ds.isComment = false}, 3000)
        }

        //【E】
        if(e.keyCode == 69) {
            if(e.ctrlKey || e.shiftKey || e.altKey) return
            document.body.dispatchEvent(new KeyboardEvent("keyup", {
                key: "n",
                keyCode: 78,
                code: "KeyN",
                bubbles: true,
                cancelable: true
            }));
        }

        //【A】
        if(e.keyCode == 65) {
            _ds.isUnmodify = _ds.isLastFrame = true
            if(_ds.lastFrameTimer) clearTimeout(_ds.lastFrameTimer)
            _ds.lastFrameTimer = setTimeout(() => {
                _ds.isUnmodify = _ds.isLastFrame = false
                _ds.lastFrameTimer = null
            }, 1000)
        }

        //【S】或【D】
        if(e.keyCode == 83 || e.keyCode == 68) {
            _ds.isUnmodify = _ds.isNextFrame = true
            if(_ds.nextFrameTimer) clearTimeout(_ds.nextFrameTimer)
            _ds.nextFrameTimer = setTimeout(() => {
                _ds.isUnmodify = _ds.isNextFrame = false
                _ds.nextFrameTimer = null
            }, 1000)
        }
    });
})();


function awaitLoad() {
    let isLoading = false

    return new Promise((res, rej) => {
        Obs(document, (mrs) => {
            console.log('===')
            //过滤尺寸参数更新的记录
            // if(!mrs.every(mr => mr.target?.matches?.('.index_cube-info__wYdK3') || mr.target?.matches?.('.index_cube-info__wYdK3 span'))) console.log(mrs)

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

                    if(_ds.isUnmodify && an.matches?.('.ant-modal-root') && (an.textContent.startsWith('确认要修改该对象吗') || an.textContent.startsWith('确认要更新对象吗'))) {
                        an.style.opacity = '0'
                        setTimeout(() => (an.style.opacity = null), 1000)
                        an.$$('button').find(btn => btn.textContent === '取 消')?.click()

                        if(_ds.isComment) {
                            _ds.isComment = false
                            document.body.dispatchEvent(new KeyboardEvent("keyup", {
                                key: "b",
                                keyCode: 66,
                                code: "KeyB",
                                bubbles: true,
                                cancelable: true
                            }));
                            showMessage('批注：合格', {type: 'success', showTime: '1000'})
                        }
                        if(_ds.isLastFrame) {
                            _ds.isLastFrame = false
                            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                                key: "[",
                                keyCode: 219,
                                code: "BracketLeft",
                                bubbles: true,
                                cancelable: true
                            }));
                        }
                        if(_ds.isNextFrame) {
                            _ds.isNextFrame = false
                            document.body.dispatchEvent(new KeyboardEvent("keydown", {
                                key: "]",
                                keyCode: 221,
                                code: "BracketRight",
                                bubbles: true,
                                cancelable: true
                            }));
                        }
                        _ds.isUnmodify = false
                    }
                })
            })
        }, { childList: true, subtree: true, attributes: true, attributeOldValue: true})
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
2024/11/28
- 新增：【W】批注正确
- 新增：【E】批注错误
- 新增：【A】切换到上一个目标
- 新增：【S】【D】切换到下一个目标
- 新增：【Tab】独显

**/