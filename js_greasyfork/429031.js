// ==UserScript==
// @name         新房屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try 
// @author       You
// @match        https://baidu.xyz/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429031/%E6%96%B0%E6%88%BF%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/429031/%E6%96%B0%E6%88%BF%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    $("[href='?user-1.htm']").parent().css("display", "none");
    $("[href='?user-1.htm']").parent().parent().parent(".media-body").parent().css("display", "none");

})();