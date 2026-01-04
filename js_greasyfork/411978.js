// ==UserScript==
// @name         Block That Shite
// @namespace    SPENGLER Scripts
// @version      0.2
// @description  Blocks low-ball websites
// @author       SPENGLER
// @match        *://*.blockthatshite.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js#sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411978/Block%20That%20Shite.user.js
// @updateURL https://update.greasyfork.org/scripts/411978/Block%20That%20Shite.meta.js
// ==/UserScript==

// global variables/functions

var newHTML = ''+
    '<html><body><h1 style="text-align: center;"><strong>This page has been crowd-blocked by "Block That Shite".</strong></h1>'+
    '<p>&nbsp;</p>'+
    '<p>Click <span style="color: #3366ff;"><strong>HERE</strong></span> to permanently approve it for yourself.</p>'+
    '<p>&nbsp;</p>'+
    '<p>Click <span style="color: #339966;"><strong>HERE</strong></span> to contribute to the blocker algorithm.</p></body></html>';


// read this article for loading script BEFORE page loads:
// https://stackoverflow.com/questions/13270290/how-to-execute-code-before-window-load-and-after-dom-has-been-loaded


$( document ).ready(function() {
  console.log('here');
  document.write(newHTML);
  // $('body').html('denied');
});
