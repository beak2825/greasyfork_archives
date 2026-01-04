// ==UserScript==
// @name         Enable_2dfan_copy_function_2
// @namespace    https://www.2dfan.com/
// @version      2.0
// @description  Enable_2dfan_copy_function, available in April 2019
// @author       rkzrdm
// @match        https://www.2dfan.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382807/Enable_2dfan_copy_function_2.user.js
// @updateURL https://update.greasyfork.org/scripts/382807/Enable_2dfan_copy_function_2.meta.js
// ==/UserScript==

(function() {
  $(window).on("DOMContentLoaded", function() {
    $("div").unbind("copy");
    $("div").unbind("cut");
  });
})();
