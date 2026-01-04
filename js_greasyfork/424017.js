// ==UserScript==
// @name         上海大学一键教学评估
// @namespace    chinggg
// @version      0.1
// @description  自动完成上海大学教学评估，默认设置为最高值
// @author       chinggg
// @match        *://cj.shu.edu.cn/StudentPortal/Evaluate
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424017/%E4%B8%8A%E6%B5%B7%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/424017/%E4%B8%8A%E6%B5%B7%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let collection = document.getElementsByTagName('select');
    for(let item of collection) {
        item.value=25;
    }
})();