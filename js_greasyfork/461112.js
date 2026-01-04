// ==UserScript==
// @name         vconsole手机调试工具(在线require)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  手机控制台（测试在线调用情况）
// @author       啦A多梦
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-body
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/461112/vconsole%E6%89%8B%E6%9C%BA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%28%E5%9C%A8%E7%BA%BFrequire%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461112/vconsole%E6%89%8B%E6%9C%BA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%28%E5%9C%A8%E7%BA%BFrequire%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (self != top) { return false };
    var script = document.createElement("script");
    var vConsole;
    script.type = "text\/javascript";
    script.src = "https://dotpic.com.cn/vconsole.min.js";
    // script.src = "https://cdn.jsdelivr.net/npm/vconsole@latest/dist/vconsole.min.js";
    document.head.appendChild(script);
    function chcss() {
        vConsole.compInstance.$$.root.lastElementChild.firstChild.innerText = "V";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.background = "gray";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.boxShadow = "0px 0px 0px 5px #e3e3e3";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.width = "40px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.height = "40px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.borderRadius = "20px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.textAlign = "center";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.padding = '0';
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.fontSize = "42px";
        vConsole.compInstance.$$.root.lastElementChild.firstChild.style.opacity = 0.5;
        document.querySelectorAll(".vc-scroller-items")[0].addEventListener("touchstart", function () {
            document.querySelectorAll(".vc-cmd-input")[0].blur();
            document.querySelectorAll(".vc-cmd-input")[1].blur();
        })
    };

    window.onload = function () {        
        setTimeout(function () {
            vConsole = new unsafeWindow.VConsole();
            setTimeout(() => {
                chcss();
            }, 100);
        }, 1000);
    }
})();