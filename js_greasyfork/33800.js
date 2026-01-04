// ==UserScript==
// @name         替换V2EX搜索
// @namespace    https://www.v2ex.com
// @version      0.0.1
// @description  Search V2EX by https://www.sov2ex.com
// @author       Abinnz
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33800/%E6%9B%BF%E6%8D%A2V2EX%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/33800/%E6%9B%BF%E6%8D%A2V2EX%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("form").each(function(){
        var action = $(this).attr("action");
        if(action.indexOf("google") !== -1) {
            $(this).attr("action", "https://www.sov2ex.com");
            $(this).removeAttr("onsubmit");
        }
    });

})();