// ==UserScript==
// @name         HYS Study Helper
// @namespace    https://yinr.cc/
// @version      0.0.1
// @description  北京市全员培训学习助手
// @author       Yinr
// @license      MIT
// @match        http*://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp*
// @match        http*://bjsqypx.haoyisheng.com/qypx/bj/dcwj.jsp*
// @match        http*://bjsqypx.haoyisheng.com/qypx/bj/zkbd.jsp*
// @icon         https://bjsqypx.haoyisheng.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @resource     globalCss https://media.haoyisheng.com/cme/qypx/bj/styles/global.css
// @resource     qypxCss https://media.haoyisheng.com/cme/qypx/bj/styles/QYPX.css
// @run-at       document-start
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537300/HYS%20Study%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/537300/HYS%20Study%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp?next=1&course_id=202501012531&cware_id=05
    document.querySelector("#ccH5jumpInto > b")

    const getPlayer = () => unsafeWindow.cc_js_Player
    const getVideo = () => document.getElementsByTagName('video')[0]
    const play = {
        next(t = 6) {
            // getVideo().currentTime += t
            if (t > 6) {
                console.warn('快进超过 6 可能导致触发异常检测')
            }
            const cc_js_Player = getPlayer()
            cc_js_Player.jumpToTime(cc_js_Player.getPosition() + t)
        },
        end() {
            const cc_js_Player = getPlayer()
            cc_js_Player.jumpToTime(cc_js_Player.getDuration())
        }
    }

    const changeRate = (rate = 1.5) => {
        const cc_js_Player = getPlayer()
        // cc_js_Player.
    }

    const readyForTest = () => {
        unsafeWindow.playEnd()
        // if (unsafeWindow.lname) {
        //     localStorage.setItem(unsafeWindow.lname, 1)
        // }
    }

    /**
     * @param {string} url 
     * @param {Function} fn 
     */
    const loadJs = (url, fn = null) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = fn
        document.head.append(script)
    }
    /**
     * @param {string[]} urls 
     * @param {Function} fn 
     */
    const loadJsQueue = (urls, fn = null) => {
        if (urls.length === 0) {
            fn()
        } else {
            loadJs(urls[0], () => {
                loadJsQueue(urls.slice(1), fn)
            })
        }
    }
    const loadJquery = () => {
        const urls = [
            'https://media.haoyisheng.com/cme/qypx/bj/javascripts/jquery-1.9.1.min.js',
            'https://bjsqypx.haoyisheng.com/signup/js/Validform_v5.3.2_min.js',
            'https://bjsqypx.haoyisheng.com/signup/js/jquery.form.min.js',
            'https://bjsqypx.haoyisheng.com/signup/js/jquery.json-2.4.js',
        ]
        const scriptTxt = Array.from(document.querySelectorAll('script')).filter(el => el.innerText.length > 0).map(i => i.innerText)
        loadJsQueue(urls, () => {
            scriptTxt.forEach(s => unsafeWindow.eval(s))
        })
    }
    const loadCss = (url) => {
        const link = document.createElement('link')
        link.href = url
        link.rel = 'stylesheet'
        link.type = 'text/css'
        document.head.append(link)
    }
    const loadBadCss = () => {
        /** @type {HTMLLinkElement[]} */
        const cssElList = Array.from(document.head.querySelectorAll('link[type="text/css"][href^="http://"]'))
        /** @type {string[]} */
        const cssList = cssElList.map(i => i.href)
        cssElList.forEach(el => el.remove())
        for (const css of cssList) {
            loadCss(css.replace(/^http:/, 'https:'))
        }
    }

    unsafeWindow.HYSHelper = {
        getPlayer,
        getVideo,
        play,
        changeRate,
        readyForTest,
        loadJquery,
    }

    loadBadCss()
    if (document.location.href.startsWith('https://bjsqypx.haoyisheng.com/qypx/bj/dcwj.jsp')) {
        // GM_addStyle(GM_getResourceText('globalCss'))
        // GM_addStyle(GM_getResourceText('qypxCss'))
        loadJquery()
    } else if (document.location.href.startsWith('https://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp')) {
        readyForTest()
        getPlayer().play()
    }
})();