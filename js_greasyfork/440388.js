// ==UserScript==
// @name         json.cn自动全屏去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  略
// @author       You
// @match        https://www.json.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=json.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440388/jsoncn%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/440388/jsoncn%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动全屏
    let btn = document.getElementsByClassName('fullScreen')[0]
    let event = document.createEvent("MouseEvents");
    event.initMouseEvent('click',true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
    btn.dispatchEvent(event)

    // 去广告
    btn.nextElementSibling.nextElementSibling.remove()
})();