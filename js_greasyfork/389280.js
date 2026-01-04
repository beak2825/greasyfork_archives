// ==UserScript==
// @name         co.uk.planetside.was.tools
// @namespace    https://planetside.co.uk
// @version      0.2
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description  Add Google Translate dropdown
// @author       WASasquatch (Jordan Thompson)
// @match        https://planetside.co.uk/forums/*
// @exclude      https://planetside.co.uk/forums/index.php?action=post;*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389280/coukplanetsidewastools.user.js
// @updateURL https://update.greasyfork.org/scripts/389280/coukplanetsidewastools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var gtrans = document.createElement('script');
    gtrans.setAttribute('src','//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.head.appendChild(gtrans);
    $(".unread_links").css('text-align', 'right').append('<br /><span id="google_translate_element" style="margin:-15px 0 0 0;"></span>');
    setTimeout (function(){googleTranslateElementInit()}, 1500);
    function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage: 'en',layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL},'google_translate_element');}

})();