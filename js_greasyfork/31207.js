// ==UserScript==
// @name         贴吧显示真实ID
// @version      0.18
// @namespace    https://github.com/8qwe24657913
// @description  贴吧昵称掩盖了真实ID，认不出人了？这个脚本适合你
// @author       8qwe24657913
// @match        http://tieba.baidu.com/*
// @match        https://tieba.baidu.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31207/%E8%B4%B4%E5%90%A7%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%AE%9EID.user.js
// @updateURL https://update.greasyfork.org/scripts/31207/%E8%B4%B4%E5%90%A7%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%AE%9EID.meta.js
// ==/UserScript==
/* globals GM_getValue GM_setValue GM_registerMenuCommand unsafeWindow */
// eslint-disable-next-line no-extra-semi
;(function() {
    'use strict'
    // add css
    const css = `
@keyframes showUserName {
    from {
        clip: rect(1px, auto, auto, auto);
    }
    to {
        clip: rect(0px, auto, auto, auto);
    }
}
.frs-author-name:not(.shownUN), .p_author_name:not(.shownUN), .userinfo_username:not(.shownUN), .lzl_cnt > .at:not(.shownUN), .lzl_content_main > .at:not(.shownUN), #j_u_username .u_ddl_con_top > ul:not(.shownUN) {
    animation-duration: 0.001s;
    animation-name: showUserName;
}
.card_userinfo_title .userinfo_username, .card_userinfo_title .userinfo_username:hover {
    max-width: 100%!important;
}
.userinfo_username + div[style]:not([class]):not([id]), img[src="//tb1.bdstatic.com/tb/cms/nickemoji/nickname_sign.png"], .card_userinfo_tbvip {
    display: none!important;
}
.frs-author-name > div[style*="color"], .userinfo_username > div[style*="color"] {
    color: inherit!important;
}
`
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(css))
    document.documentElement.appendChild(style)
    // add setting
    // eslint-disable-next-line no-template-curly-in-string
    const setting = GM_getValue('showUNSetting', localStorage.showUNSetting || '${un} (${nickname})')

    function changeSetting() {
        // eslint-disable-next-line no-template-curly-in-string
        const newSetting = prompt('${un}表示真实ID，${nickname}表示昵称，可使用html标签', setting)
        if (newSetting && newSetting !== setting) {
            GM_setValue('showUNSetting', newSetting)
            location.reload()
        }
    }
    GM_registerMenuCommand('设置贴吧显示真实ID格式', changeSetting)

    function closestAttr(elem, attr) {
        while (elem && !elem.hasAttribute(attr)) elem = elem.parentElement
        return elem ? elem.getAttribute(attr) : false
    }

    function decodeURL(str) {
        try {
            // decode utf-8
            return decodeURIComponent(str)
        } catch (e) {
            // decode gbk
            const decoder = new TextDecoder('gbk')
            return str.replace(/(?:%[A-Z0-9]{2})+/gi, s =>
                decoder.decode(
                    new Uint8Array(
                        s
                            .substr(1)
                            .split('%')
                            .map(c => parseInt(c, 16)),
                    ),
                ),
            )
        }
    }
    // main
    document.addEventListener(
        'animationstart',
        event => {
            // shouldn't use jQuery
            if (event.animationName !== 'showUserName') return
            const target = event.target
            target.classList.add('shownUN')
            if (target.nodeName === 'UL') {
                // 设置按钮
                target.insertAdjacentHTML('beforeend', '<li class="u_showUN"><a href="javascript:">显ID设置</a></li>')
                target.getElementsByClassName('u_showUN')[0].addEventListener('click', changeSetting, false)
                return
            }
            let un
            let nickname
            let data
            let hack = false
            let isAt = false
            // 获取 un
            if (target.hasAttribute('username') && target.getAttribute('onmouseover') === 'showattip(this)') {
                // 贴吧最近又在乱改，一会回复显示id，一会回复显示昵称，一会id不编码，一会id utf-8编码，一会id gbk编码……
                hack = true
                un = target.getAttribute('username')
                if (/%[A-Z0-9]{2}/i.test(un)) {
                    // url encoded
                    try {
                        un = decodeURL(un)
                    } catch (e) {
                        // do nothing
                    }
                }
            } else if ((data = closestAttr(target, 'data-field'))) {
                // frs & pb & card
                un = JSON.parse(data.replace(/'/g, '"')).un // 贴吧的畸形JSON用的是单引号，姑且先用replace凑合
            } else if (location.pathname.startsWith('/home/')) {
                // ihome 百度取消了真实用户名显示
                if (!un) {
                    try {
                        un = unsafeWindow.PageData.current_page_uname
                        throw new Error("can't get un from PageData")
                    } catch (e) {
                        un = new URLSearchParams(location.search).get('un')
                    }
                }
            } else if (target.href) {
                // unknown, trying to parse href
                console.warn('贴吧显示真实ID: 尝试解析未知元素', target)
                un = new URLSearchParams(target.href.split('?')[1]).get('un')
            } else {
                // can't find un
                return console.error('贴吧显示真实ID: 找不到真实ID', target)
            }
            // 获取 nickname
            if (target.classList.contains('frs-author-name')) {
                // frs 用户名可能被切掉，统一不用图片，保证格式美观
                nickname = closestAttr(target.parentElement, 'title').split(' ')[1]
                if (nickname === un) target.textContent = nickname // 用户名尽量显示完整，不用图片
            } else {
                // pb & card & ihome
                nickname = target.innerHTML
                    .replace(/^<div[^>]*>(.*)<\/div>$/, '$1')
                    .replace(/<img src="\/\/tb1\.bdstatic\.com\/tb\/cms\/nickemoji\/nickname_sign\.png"[^>]*>/, '')
            }
            nickname = nickname.trim()
            if (nickname.startsWith('@')) {
                isAt = true
                nickname = nickname.slice(1)
            }
            // 修改显示内容
            if (hack) {
                // showattip 函数写的过于制杖，不开这脚本都显示不出来……似乎还和帖子有关，测试贴 http://tieba.baidu.com/p/6051286922 感谢 @谷歌大法好 的反馈
                Object.defineProperty(target, 'textContent', {
                    get() {
                        return un
                    },
                })
            }
            if (!nickname) {
                target.textContent = un
            } else if (un && un !== 'null' && nickname !== un && nickname !== '@' + un) {
                let html = setting.replace(/\${un}/g, un).replace(/\${nickname}/g, nickname)
                if (
                    !(
                        target.classList.contains('p_author_name') ||
                        (data && target.classList.contains('userinfo_username'))
                    )
                ) {
                    html = html.replace(/<br[^>]*>/g, ' ')
                } // 仅 pb & card 适合换行，不适合的地方replace成空格
                target.innerHTML = (isAt ? '@' : '') + html
            }
        },
        false,
    )
})()
