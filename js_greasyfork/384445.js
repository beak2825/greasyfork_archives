// ==UserScript==
// @name         友盟转化率显示完整名称
// @namespace    https://www.qicodetech.com/
// @version      0.0.2
// @description  友盟转换率显示完整名称，而不是只展示缩略名称
// @author       AbelHu
// @match        https://mobile.umeng.com/platform/*/setting/transfer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384445/%E5%8F%8B%E7%9B%9F%E8%BD%AC%E5%8C%96%E7%8E%87%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/384445/%E5%8F%8B%E7%9B%9F%E8%BD%AC%E5%8C%96%E7%8E%87%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function() {
        for (let item of document.getElementsByClassName("ant-select")){
            item.style.width="400px"
        }
    }, 2 * 1000)
})();