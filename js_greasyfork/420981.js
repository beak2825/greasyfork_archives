// ==UserScript==
// @name         游民星空手机版跳转PC版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Ne0
// @match        http*://wap.gamersky.com/*
// @grant        none
// @run-at  document-end
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/420981/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%ACPC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/420981/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%ACPC%E7%89%88.meta.js
// ==/UserScript==

(function(){
    'use strict';

    document.getElementsByClassName("ymw-btns ymw-btns-pc")[0].click();
    window.close();
})();