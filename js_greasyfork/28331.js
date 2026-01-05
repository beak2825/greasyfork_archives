// ==UserScript==
// @name     Remove annoying boxes from Sci-Hub
// @description:en Remove annoying boxes when reading PDFs from Sci-Hub
// @include  https://*sci-hub.tw/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version 0.6
// @namespace https://greasyfork.org/users/82772
// @description Remove annoying boxes when reading PDFs from Sci-Hub
// @downloadURL https://update.greasyfork.org/scripts/28331/Remove%20annoying%20boxes%20from%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/28331/Remove%20annoying%20boxes%20from%20Sci-Hub.meta.js
// ==/UserScript==



/*--- Use the jQuery contains selector to find content to remove.
    Beware that not all whitespace is as it appears.
*/

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var badDivs = $( "#menu");

addGlobalStyle('#pdf { top: 0px !important; } #main_content { margin-left: 0px !important; } #article { margin-left: 0 !important; }');

badDivs.remove ();

//-- Or use badDivs.hide(); to just hide the content.