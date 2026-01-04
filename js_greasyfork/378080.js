// ==UserScript==
// @name         ChangeAndaLocationHref
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://wx.dechtec.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378080/ChangeAndaLocationHref.user.js
// @updateURL https://update.greasyfork.org/scripts/378080/ChangeAndaLocationHref.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ele=document.getElementById('btnmap');
    ele.setAttribute("href","https://apis.map.qq.com/tools/locpicker?search=1&amp;type=1&amp;mapdraggable=1&amp;total=5&amp;key=VFOBZ-EFLR5-LUMIC-QSTBU-4J7ZO-CIFP4&amp;referer=WeiXinSignIn");
})();