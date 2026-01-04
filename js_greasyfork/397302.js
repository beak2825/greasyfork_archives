// ==UserScript==
// @name         MCBBS Extender —— Mobile DLC
// @namespace    https://i.zapic.cc/
// @version      beta-0.0.1
// @description  An extra script to extend extender.
// @author       Zapic
// @match        https://*.mcbbs.net/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/397302/MCBBS%20Extender%20%E2%80%94%E2%80%94%20Mobile%20DLC.user.js
// @updateURL https://update.greasyfork.org/scripts/397302/MCBBS%20Extender%20%E2%80%94%E2%80%94%20Mobile%20DLC.meta.js
// ==/UserScript==

(()=>{
    // jQuery检查
    if (typeof jQuery == "undefined") {
        return false;
    }
    //在手机页面主动禁用
    if(document.getElementsByTagName('meta').viewport){
        return false;
    }
    let evt = "onorientationchange" in window ? "orientationchange" : "resize";
	jQuery(window).on(evt,resize);
    function resize() {
        jQuery(document.getElementsByTagName('meta').viewport).remove();
        jQuery("head").append('<meta name="viewport" content="width=device-width,initial-scale='+(0.0007*window.screen.availWidth).toString()+'">');
    }
    resize(true);
    jQuery(()=>{jQuery("#myprompt,.hd_t_a a").removeAttr("href");});
})();