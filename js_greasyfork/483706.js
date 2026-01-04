// ==UserScript==
// @name        BSI Translate
// @namespace   Violentmonkey Scripts
// @match       file:///home/lumi/Downloads/BSI%20CRM%20-%20dupl010.html*
// @match       http://127.0.0.1:8081/BSI%20CRM%20-%20dupl010.html*
// @match       https://prd.bsicrm.arvato-scs.com/bsicrm/*
// @grant       none
// @version     1.0
// @author      Jakub Duplaga
// @description 1/2/2024, 12:09:20 PM
// @run-at     document-idle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://translate.google.com/translate_a/element.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483706/BSI%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/483706/BSI%20Translate.meta.js
// ==/UserScript==

// Translate only the iframe
document.getElementsByTagName( 'html' )[0].setAttribute( 'class', 'notranslate' );
$("iframe[class='iframe field alternative']").addClass("translate");

// Create a translate button
$("div[class='menu-item unfocusable ellipsis overflow-tab-item has-text hidden']").after('<button id="but" type="button", class="tab-item marked active title", style="padding:4px;padding-bottom:4px;border:none;background:none;">Translate</button>');

// Create the languege change div
$('#but').after('<div id="google_translate_element" class="tab-item"></div>');

// Handle the translate button
$('#but').click(function(){
  new google.translate.TranslateElement({pageLanguage: 'auto', layout: google.translate.TranslateElement.InlineLayout.SIMPLE,  includedLanguages: 'en,pl,de',}, 'google_translate_element');
});
