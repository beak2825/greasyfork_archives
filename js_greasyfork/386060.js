// ==UserScript==
// @name         xvideos自动选中文站
// @namespace    https://www.yge.me
// @version      0.1
// @description  x站自动选中文
// @author       Y.A.K.E
// @match        https://www.xvideos.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386060/xvideos%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/386060/xvideos%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
if($(".country-switch").attr('data-country') != 'cn'){window.location.href= 'https://www.xvideos.com/change-country/cn';}
    // Your code here...
})();