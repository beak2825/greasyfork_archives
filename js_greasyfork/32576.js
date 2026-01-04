// ==UserScript==
// @name         Enable_2dfan_copy_function
// @namespace    http://www.2dfan.com/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http*://*.2dfan.com/topics/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/32576/Enable_2dfan_copy_function.user.js
// @updateURL https://update.greasyfork.org/scripts/32576/Enable_2dfan_copy_function.meta.js
// ==/UserScript==

(function() {
    var html = $(".block-content").html();
    $("#topic-content").remove();
    $($(".block-content")[0]).after(html);
})();