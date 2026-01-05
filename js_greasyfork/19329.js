// ==UserScript==
// @name MFT Widescreen
// @namespace https://www.mftservice.com
// @description Opens page to your browser's full width
// @include https://www.mftservice.com/*
// @exclude https://www.mftservice.com/courier/web/1000@/*
// @icon https://www.mftservice.com/courier/themes/templates/1000/nbaSqIEUHtappgKhp/files/images/publicis-mft-white_small.jpg
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/19329/MFT%20Widescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/19329/MFT%20Widescreen.meta.js
// ==/UserScript==   

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// removes hard coded width
addGlobalStyle('#page {width: 100% !important; padding: 0 !important; }');

//widens the left workspace a little
//second line is a workaround to prevent the right view from going to the bottom
addGlobalStyle('#cabinets {width: 250px}');
addGlobalStyle('.wsview {margin: 0 -15px 0 -7px}');

//optional code to remove much of the footer information
addGlobalStyle('#main {margin-bottom: 0px !important; }');
addGlobalStyle('#footer {padding: 0 !important;}');
addGlobalStyle('#securedlogo {height: 0px !important;}');