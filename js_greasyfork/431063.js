// ==UserScript==
// @name         Gamestar Nice&Clean
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove Gamestar elements
// @author       Olli
// @match        https://www.gamestar.de/*
// @icon         https://www.gamestar.de/favicon.ico
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431063/Gamestar%20NiceClean.user.js
// @updateURL https://update.greasyfork.org/scripts/431063/Gamestar%20NiceClean.meta.js
// ==/UserScript==

$(document).ready(function() {
    var plus = [
        '[data-label="button.plus"]',
        'div.plus-banner-top',
        '#section112',
        'article.plus',
        'a#plus-sp-toggle',
        'div.plus',
        '[data-nid="656"]',
    ];
    var mainpage = [
        '#footer-brand',
        '#footer-bold',
        'div.footer-banner',
        '[data-label="button.shop"]',
        '#header-trending',
        '[data-label="button.burger"]',
        '#section119',
        '#section118',
        'div.ads-container',
        'div#dfp-mtf-desktop',
        'div.dfp-btf-desktop',
        'div.jad-placeholder',
        'iframe.ur-render-target',
    ];
    var article = [
        '#socialshare',
        'div.pull-xs-right',
        'div.offerteaser-box',
        'div.kasten',
        'div.ob-smartfeed-wrapper',
    ];

    $('div.maincontent').removeClass("col-lg-8").addClass("col-lg-12");
    $.each([plus, mainpage, article], function() {
           $.each(this, function(i,e) {
               $(e).remove();
           });
    });
    $('[value="Deal"]').parent().remove();
    $('span.grn').parent().parent().remove();
    $('#body').removeAttr("style");
});