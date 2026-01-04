// ==UserScript==
// @name         贴吧自动点签到
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  批量打开贴吧，然后自动点签到
// @author       You织梦行云
// @match        https://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459565/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%82%B9%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459565/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%82%B9%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function openWindows()
    {
        let a1 = document.querySelectorAll('div#likeforumwraper a.unsign')
        let a2 = document.querySelectorAll('div#forumscontainer a.unsign')
        let a3 = [...a1, ...a2]
        let n = 1
        a3.forEach(item => {
            setTimeout(() => {
                window.open(item.href, '_blank')
            }, n)
            n += 1000
        })
    }

    document.addEventListener("keydown", function(e) {
        if(e.keyCode == 120 && e.ctrlKey) {
            openWindows();
        }
    });

     setTimeout(() => {
            let gz = document.querySelector("a#j_head_focus_btn.cancel_focus")
    if(gz)
    {
        let a = 0;
        let interval = setInterval(() => {
            let s = document.querySelector("div#signstar_wrapper > a.sign_btn_bright")
            if(!s)
            {
                clearInterval(interval)
                throw '已签到';
                return
            }
            s = s.children[0]
            s.click();
            s.click();
            a++
        }, 1000)
        setTimeout(() => {
            clearInterval(interval)
        }, 180000)
    }
        }, 1500)

    


    GM_registerMenuCommand("打开所有", openWindows, "Ctrl+F9")
})();