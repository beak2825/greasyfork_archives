// ==UserScript==
// @name         Fuck Yudao
// @namespace    none
// @version      0.2
// @license      MIT
// @description  屏蔽芋道官方文档登录校验
// @author       York Wang
// @match        https://www.iocoder.cn/*
// @match        https://doc.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481001/Fuck%20Yudao.user.js
// @updateURL https://update.greasyfork.org/scripts/481001/Fuck%20Yudao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.location.href.startsWith("https://www.iocoder.cn/")) {
        // Official Website
        unsafeWindow.isVIP = function(){return true}
        unsafeWindow.jqueryAlert = ()=>{console.log('fuck yudao');return {close:()=>{}}}
        const locker = document.querySelector("#locker")
        if(locker) {
            locker.style.display = 'none'
        }
        const content = document.querySelector("#post-body")
        if(content) {
            content.style.height = 'auto'
        }
    } else {
        // Official Documents
        let src = ''
        const scripts = document.querySelectorAll("script[src]")
        for (let i = 0; i < scripts.length; ++i) {
            if(scripts[i].src.indexOf('/assets/js/app') > -1) {
                src = scripts[i].src
            }
        }
        if(src) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: src,
                onload: res => {
                    // const a="88974ed8-6aff-48ab-a7d1-4af5ffea88bb",r="shao";function c(){return(Cookies.get(a) ...
                    const key = res.responseText.match(/const \w="([\w-]+)",\w="(\w+)";/)
                    if(key.length > 2) {
                        if(document.cookie.indexOf(key[1]) === -1) {
                            document.cookie = key[1] + '=' + key[2] + ';path=/'
                            location.reload()
                        }
                    }
                }
            })
        }
    }
})();