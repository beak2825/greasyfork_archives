// ==UserScript==
// @id             Scribd.com Unblur
// @name           Scribd.com Unblur
// @namespace      com.scribd.unblurer
// @version        1.0
// @author         DeathBlack
// @description    Unblur Scribd.com document pages
// @include        http*://*.scribd.com/*
// @run-at         document-end
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @iconURL        http://www.scribd.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/401490/Scribdcom%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/401490/Scribdcom%20Unblur.meta.js
// ==/UserScript==
setInterval(function() {
    $('.promo').remove();
    $('.page-blur-promo-overlay').remove();
    $('.page_missing_explanation_inner').remove();
    $('.autogen_class_views_read2_page_blur_promo').remove();
    $('.outer_page only_ie6_border blurred_page').remove();
    $('.page-blur-promo').removeClass('page-blur-promo');
    $('.page_blur_promo').remove();
    $('.absimg').css('opacity', '1.0');
    $('.text_layer').css('color', '#000');
    $('.text_layer').css('text-shadow', '0px 0px 0px #000');
    $('.autogen_class_views_pdfs_page_blur_promo').css('display','none');
}, 1000);