// ==UserScript==
// @name         道客巴巴复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  道客巴巴解除复制限制
// @author       T4DNA
// @match        https://www.doc88.com/p-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doc88.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481094/%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481094/%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var OriginCoptText = copyText;
    function copyText(){
        Config.logined = 1;
        Config.vip=1;
        copyText()
    }
})();