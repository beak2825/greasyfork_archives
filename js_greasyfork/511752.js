// ==UserScript==
// @name         隐藏b站推荐视频
// @namespace    http://tampermonkey.net/
// @version      2024.10.12.1
// @description  try it!
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511752/%E9%9A%90%E8%97%8Fb%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/511752/%E9%9A%90%E8%97%8Fb%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

window.$ = Document.prototype.$ = Element.prototype.$ = $;
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;

(function() {
    $$('.pop-live-small-mode.part-1')
    Obs(document.body, (mrs) => {
        const live_ad = $('.pop-live-small-mode.part-1')
        live_ad && (live_ad.style.height = 0)
        live_ad && (live_ad.style.overflow = 'hidden')

        $('.bpx-player-ending-related', (el) => (el.style.height = 0))

        $$('.ad-report')
        .filter(el => (!el.style.height))
        .forEach(ad => {
            ad.style.height = 0
            ad.style.minHeight = 0
            ad.style.overflow = 'hidden'
        })

        mrs.forEach(mr => {
            [...mr.addedNodes].forEach(an => {
                // console.log(mr)
                let reco_list = $('#reco_list') || $('.recommend-list-v1')
                if(reco_list && !reco_list.isInit) {
                    // debugger
                    console.log(mrs)
                    console.log(mr);
                    reco_list.style.height = 0
                    reco_list.style.overflow = 'hidden'

                    const btn_dispayRecoList = createEl('div', {
                        className: 'btn_dispayRecoList',
                        innerHTML: `
                            <style>
                                .btn_dispayRecoList:hover {
                                    background: #f1f2f3;
                                    opacity: 1 !important;
                                }
                            </style>
                            Display-Reco
                        `,
                        onclick: function() {
                            const curHeight = reco_list.style.height
                            const curOverflow = reco_list.style.overflow
                            reco_list.style.height = curHeight == '0px' ? null : 0
                            reco_list.style.overflow = curOverflow == 'hidden' ? null : 'hidden'
                        },
                        style: {
                            padding: '10px 0',
                            textAlign: 'center',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            opacity: 0,
                            transition: 'all .5s',
                            userSelect: 'none',
                        }
                    })
                    setTimeout(() => {
                        reco_list.insertAdjacentElement('beforebegin', btn_dispayRecoList)
                    }, 5000)


                    reco_list.isInit = true
                }
            })

        })
    })
})();

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

function log(info) {
    console.log(info)
}

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('目标不存在')

    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
}

function $(selector, func) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    const sel = String(selector).trim();

    const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]

    const el = (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
    el && func && func(el)

    return el
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

/**
2024/10/2：
- 实现推荐视频的隐藏

2024/10/12
- 修复：类名修改导致的隐藏失效
*/