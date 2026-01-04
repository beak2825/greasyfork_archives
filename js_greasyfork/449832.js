// ==UserScript==
// @name         电脑模式模拟
// @version      1
// @description  尝试让网页进入电脑模式
// @author       大萌主
// @match        *://www.huya.com/*
// @match        *://pan.baidu.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/449832/%E7%94%B5%E8%84%91%E6%A8%A1%E5%BC%8F%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/449832/%E7%94%B5%E8%84%91%E6%A8%A1%E5%BC%8F%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==
!(function() {
document.querySelector('meta[name=viewport]').setAttribute('content','width=device-width,initial-scale=0.33,maximum-scale=10.0,user-scalable=1');
})();