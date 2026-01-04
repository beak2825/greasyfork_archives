// ==UserScript==
// @name        Direct Link - Fembed API
// @namespace   https://www.in4sser.com
// @match       *://tool.baoxinh.com/forex.cg*
// @grant       none
// @version     1.0
// @author      iN4sser
// @grant       GM_addStyle
// @description This script will skip the ads/countdown on tool.baoxinh.com's Fembed API
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422437/Direct%20Link%20-%20Fembed%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/422437/Direct%20Link%20-%20Fembed%20API.meta.js
// ==/UserScript==
Array.from(document.getElementsByClassName('btn bt-success hidden')).forEach(function(v){v.removeAttribute("disabled");});
setTimeout(function() {
    document.getElementById('gotolink').click();
}, 0);

GM_addStyle ( `
    .panel-heading.text-center, .col-md-12, .navbar-default, div#timer, footer.container, .filename{
    display: none !important;
}
.hidden {
    visibility: unset !important;
    height: unset !important;
    overflow: unset !important;
    display: block;
}
button[disabled], html input[disabled], button#gotolink {
    cursor: pointer;
    display: block !important;
}
button#gotolink {
    visibility: visible !important;
    text-align: center;
    margin: 0 auto;
    width: 100%;
    line-height: 5;
}
body{
  visibility: hidden !important;
}
` );