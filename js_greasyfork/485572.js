// ==UserScript==
// @name         fuck blank
// @namespace    http://www.fangzengye.com/
// @version      V1.2.0
// @description  阻止所有链接在新窗口打开.
// @description  我苦点击链接新窗口打开久已,遂自己开发一个所有链接当前窗口打开的脚本,这大大减少垃圾窗口的出现.
// @description  Block all links from opening in new windows.
// @description  I hate clicking all links and they all open in new windows, 
// @description  so I developed a script to open all links in the current window, 
// @description  which greatly reduces the appearance of junk windows.

// @author       Leolucky
// @match        *://*.com/*
// @match        *://*.gov/*
// @match        *://*.org/*
// @match        *://*.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485572/fuck%20blank.user.js
// @updateURL https://update.greasyfork.org/scripts/485572/fuck%20blank.meta.js
// ==/UserScript==

(function() {
    var _self = document.querySelectorAll("a");
    var i;
    for (i = 0; i < _self.length; i++) {
        _self[i].target = "_self";
    }
})();