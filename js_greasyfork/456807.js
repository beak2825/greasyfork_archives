// ==UserScript==
// @name         Gramedia Metadata
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show metadata for easy data checking <3
// @author       Ivan Febriand Muhammad
// @match        https://www.gramedia.com/products/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://pbs.twimg.com/media/CEtdkknVAAAyd1L?format=png&name=small
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456807/Gramedia%20Metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/456807/Gramedia%20Metadata.meta.js
// ==/UserScript==
function getMetaDescr() {
    var meta = document.querySelector('meta[name=description]').content;
    var title = document.querySelector('meta[name=title]').content;
    var canon = document.head.querySelector("[rel~=canonical]").getAttribute('href');
    alert("<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3\n\nMeta Title:  " + title + "\n\nMeta Description:  " + meta + "\n\nCanonical:  " + canon + "\n\n<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3");
}
$(function(){
    $(document).keyup(function (e) {
        	if (e.keyCode == 48 && e.shiftKey && e.ctrlKey) {
                 e.preventDefault();
                getMetaDescr();
            }
        });
});
