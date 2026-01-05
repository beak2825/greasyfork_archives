// ==UserScript==
// @name         Bible.com Headers Toggle
// @namespace    bibleHeaderToggle
// @include      https://www.bible.com/bible/*
// @author       Montana Selman
// @description  Removes headers from Bible.com
// @version      0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25500/Biblecom%20Headers%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/25500/Biblecom%20Headers%20Toggle.meta.js
// ==/UserScript==

function sectionsToggle(jNode){
    jNode.before('<div><input id="reader_toggle_headers" type="checkbox" class="ng-pristine ng-untouched ng-valid" tabindex="0" aria-checked="false" aria-invalid="false"><label for="reader_toggle_headers"> Hide Section Headers</label></div>');
    var headerToggle = $('input#reader_toggle_headers');
    headerToggle.change(function(){$(".s1").toggle();});
}
waitForKeyElements('div.font-extras div:last-child', sectionsToggle);
