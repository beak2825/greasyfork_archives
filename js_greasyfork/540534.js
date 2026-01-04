// ==UserScript==
// @name         Bilibili 直播自动隐藏礼物栏
// @namespace    delton.me
// @version      2025-06-23
// @description  进入直播间自动隐藏礼物栏，按 Shift+G 恢复。
// @author       dsh0416
// @homepage     https://github.com/dsh0416
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540534/Bilibili%20%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540534/Bilibili%20%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let showing = true;

    function trigger() {
        if (showing) {
            hide();
        } else {
            recover();
        }
    }

    function hide() {
        showing = false;
        const style = document.createElement('style');
        style.textContent = ".gift-panel { visibility: hidden; }";

        document.head.append(style);
        console.log("Gift hidden injected");
    }

    function recover() {
        showing = true;
        const style = document.createElement('style');
        style.textContent = ".gift-panel { visibility: visible; }";

        document.head.append(style);
        console.log("Gift hidden recovered");
    }
    
    (() => {
        hide();

        window.onkeyup = function(e){
            if (e.shiftKey && e.key === "G") {
                trigger();
            }
        };
    })();
})();

