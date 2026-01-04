// ==UserScript==
// @name         Elearning 通靈小工具
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Elearning 解除考試跳出、複製限制
// @author       Ryan Lee
// @match        https://elearning.yuntech.edu.tw/learn/exam/exam_start.php*
// @icon         https://elearning.yuntech.edu.tw/base/10001/door/tpl/icon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457818/Elearning%20%E9%80%9A%E9%9D%88%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457818/Elearning%20%E9%80%9A%E9%9D%88%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    console.log("開始執行!!!")
    Window.prototype._addEventListener = Window.prototype.addEventListener;
    Window.prototype.addEventListener = function (eventName, fn, options) {
        if (eventName === 'blur' || eventName === 'pagehide') {
            console.log(`已攔截${eventName}事件!`);
            return;
        }
        console.log(`Window ${eventName}事件!`);

        this._addEventListener(eventName, fn, options);
    };
    document.body.removeAttribute("ondragstart")
    document.body.removeAttribute("oncontextmenu")
    document.body.removeAttribute("onselectstart")
})();