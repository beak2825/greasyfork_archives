// ==UserScript==
// @name        Google Weblight
// @namespace   Google Weblight
// @description Adds a button at the top right corner to view the web pages in Google Weblight (For Faster Loading of Webpages)..
// @include     *
// @exclude     https://googleweblight.com/*
// @version     1.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33452/Google%20Weblight.user.js
// @updateURL https://update.greasyfork.org/scripts/33452/Google%20Weblight.meta.js
// ==/UserScript==


var FNode       = document.createElement ('div');
FNode.innerHTML = '<button id="myButton" type="button">'+ 'Google <br/> Weblight</button>';
FNode.setAttribute ('id', 'myContainer');

FNode.style = "top:0;right:0;position:fixed;";


document.body.appendChild (FNode);
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    window.location = "http://googleweblight.com/?lite_url=" + 
encodeURIComponent(document.URL);
    
}
