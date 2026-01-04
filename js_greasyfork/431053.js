// ==UserScript==
// @name         在线预览ppt文档
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description: zh-CN 在线预览ppt文档时，定时触发鼠标点击事件，自动翻页
// @author       姚涛
// @match        *://*.officeapps.live.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @description 哈哈哈!
// @downloadURL https://update.greasyfork.org/scripts/431053/%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88ppt%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/431053/%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88ppt%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if (window.top === window.self) { return }
    setInterval(()=>document.querySelector('#SlidePanel').click(), 2000)
    // Your code here...
})();