// ==UserScript==
// @license MIT
// @name         F**kReminder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击深信服的代理检测的“我已知悉”按钮，并刷新界面
// @author       Yancy
// @match        http://1.1.1.3/proxytool/remind.htm?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/455204/F%2A%2AkReminder.user.js
// @updateURL https://update.greasyfork.org/scripts/455204/F%2A%2AkReminder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
    document.querySelector("#btn_ok_close").click();
    }, 50);//50代表50ms，这个时间可以根据自己浏览器，电脑运行速度来调
})();