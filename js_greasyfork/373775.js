// ==UserScript==
// @name         尚景400分页
// @namespace    caca
// @version      0.11
// @description  尚景400号码分页
// @author       caca
// @match        http://www.400cx.com/agent/userOccupy.do*
// @downloadURL https://update.greasyfork.org/scripts/373775/%E5%B0%9A%E6%99%AF400%E5%88%86%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/373775/%E5%B0%9A%E6%99%AF400%E5%88%86%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#pagesize").html("");
    $("#pagesize").append(new Option("[=================]", 1000));

    for(var i=0;i<5;i++){
        $("#pagesize").append(new Option("["+(i+1)*1000+"条记录]", (i+1)*1000));
    }


})();