// ==UserScript==
// @name        Hide fb comment blogtruyen
// @description Hide FB comments on each chapter 
// @icon            http://fs5.directupload.net/images/170509/d2i6dsu7.png

// @include     http*://blogtruyen.com/c*/*chap*
// @include     http*://blogtruyen.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @version     0.0.2.5
// @namespace https://greasyfork.org/users/112442
// @downloadURL https://update.greasyfork.org/scripts/29325/Hide%20fb%20comment%20blogtruyen.user.js
// @updateURL https://update.greasyfork.org/scripts/29325/Hide%20fb%20comment%20blogtruyen.meta.js
// ==/UserScript==

$(".fb-comments").hide();
$(".BT-Ads").hide();
$(".col-md-4").hide();
document.querySelector('h1').remove();
document.getElementById('copyright').remove();
var div = document.getElementById("sticky");
if (div) {
    div.parentNode.removeChild(div); // Removes it entirely
}
$(".qc-inner").hide();


