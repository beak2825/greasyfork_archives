// ==UserScript==
// @name         Hide old reddit sidebar when small window
// @namespace    https://greasyfork.org/en/users/12725-alistair1231
// @version      0.2
// @description  hides the old reddit sidebar when the window is small and restores it when it is large.
// @author       Alistair1231
// @match        https://old.reddit.com/r/*
// @icon         https://icons.duckduckgo.com/ip2/reddit.com.ico
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442891/Hide%20old%20reddit%20sidebar%20when%20small%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/442891/Hide%20old%20reddit%20sidebar%20when%20small%20window.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(function (event) {
    var windowWidth = jQuery(window).width();
    if (windowWidth < 700) {
        hideSide();
    }else{
        showSide();
    }
},500);

function hideSide() {
    jQuery(".side").hide()
    jQuery(".content").css("margin-right", 5)
    jQuery(".sitetable").css("margin-right", 5)
    jQuery(".commentarea").css("margin-right", 5)
    
}
function showSide() {
    jQuery(".side").show()
    jQuery(".content").css("margin-right", '')
    jQuery(".sitetable").css("margin-right", '')
    jQuery(".commentarea").css("margin-right", '')
}

})();