// ==UserScript==
// @name         尚景400删除特效
// @namespace    caca
// @version      0.1
// @description  尚景400号码删除特效
// @author       caca
// @match        http://www.400cx.com/agent/userOccupy.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373776/%E5%B0%9A%E6%99%AF400%E5%88%A0%E9%99%A4%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/373776/%E5%B0%9A%E6%99%AF400%E5%88%A0%E9%99%A4%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $("div .liebiao2").each(function(i){

        $(this).removeAttr("onmouseover").removeAttr("onmouseout");

    });

})();