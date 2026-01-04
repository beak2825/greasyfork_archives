// ==UserScript==
// @name         高亮azure分支提示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://dev.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azure.com

// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @compatible   firefox
// @compatible   chrome
// @compatible   opera safari edge
// @compatible   safari
// @compatible   edge
// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @license      MIT

// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451794/%E9%AB%98%E4%BA%AEazure%E5%88%86%E6%94%AF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451794/%E9%AB%98%E4%BA%AEazure%E5%88%86%E6%94%AF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function process () {
        setTimeout(() => {
            const dom = document.querySelector('.pr-header-branches .bolt-link:nth-child(2)');

            if(dom && dom.innerText === 'master') {
                dom.style.cssText = "background: #f50; padding: 0 20px; color: #fff; font-size: 40px; transition: all 0.3;"
            }

            const dom2 = document.querySelector('.repos-pr-create-header .margin-left-8 span.text-ellipsis');

            if(dom2 && dom2.innerText === 'master') {
                dom2.style.cssText = "background: #f50; padding: 0 20px; color: #fff; font-size: 40px; transition: all 0.3;"
            }
        }, 1e3)
    }

    let utilityFunc = ()=> {
        var run = (url)=> {
            process()
        };

        var pS = window.history.pushState;
        var rS = window.history.replaceState;

        window.history.pushState = function(a, b, url) {
            run(url);
            pS.apply(this, arguments);
        };

        window.history.replaceState = function(a, b, url) {
            run(url);
            rS.apply(this, arguments);
        };
    }

    utilityFunc();
    process();
})();