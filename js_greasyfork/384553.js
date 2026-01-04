// ==UserScript==
// @name         友盟APP名称显示完整名称
// @namespace    https://www.qicodetech.com/
// @version      0.0.1
// @description  友盟APP名称显示完整名称，而不是只展示缩略名称
// @author       AbelHu
// @match        https://mobile.umeng.com/platform/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384553/%E5%8F%8B%E7%9B%9FAPP%E5%90%8D%E7%A7%B0%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/384553/%E5%8F%8B%E7%9B%9FAPP%E5%90%8D%E7%A7%B0%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function() {
        for (let item of document.getElementsByClassName("ant-select-selection")){
            item.style.cssText="max-width:5000px;"
        }
    }, 2 * 1000)
})();