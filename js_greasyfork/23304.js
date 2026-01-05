// ==UserScript==
// @name          Unblur Scribd
// @namespace     io.github.lv.unblurscribd
// @version       1.0.5
// @description   Unblur any Scribd document
// @author        Luis Victoria
// @grant         none
// @icon          https://raw.githubusercontent.com/LV/UnblurScribd-Userscript/master/icon.png
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match         http://*.scribd.com/doc/*
// @match         https://*.scribd.com/doc/*
// @downloadURL https://update.greasyfork.org/scripts/23304/Unblur%20Scribd.user.js
// @updateURL https://update.greasyfork.org/scripts/23304/Unblur%20Scribd.meta.js
// ==/UserScript==

setInterval(function() {
 $('.absimg').css('opacity', '1.0');
 $('.autogen_class_views_read2_page_blur_promo').remove();
 $('.between_page_ads').remove();
 $('.outer_page only_ie6_border blurred_page').remove();
 $('.page_blur_promo').remove();
 $('.page-blur-promo-overlay').remove();
 $('.page_missing_explanation_inner').remove();
 $('.text_layer').css('color', '#000');
 $('.text_layer').css('text-shadow', '0px 0px 0px #000');
}, 1000);
