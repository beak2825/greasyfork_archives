// ==UserScript==
// @name         B站合集列表增加长度
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.1.2
// @description   右侧合集列表长度等同左侧播放器高度
// @author       hatn
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467296/B%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E9%95%BF%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/467296/B%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E9%95%BF%E5%BA%A6.meta.js
// ==/UserScript==

const style_dom = document.createElement('style');
style_dom.innerHTML = `.video-sections-content-list, .cur-list { max-height: 676px !important; height: 476px !important }
.video-pod .video-pod__body {max-height: none !important}
.video-container-v1 .right-container .video-pod {min-height: 550px !important}`;
document.body.insertBefore(style_dom, document.body.firstChild);