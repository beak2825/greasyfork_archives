// ==UserScript==
// @name         PlayFab Switcher
// @namespace    https://greasyfork.org/en/scripts/374423-playfab-switcher
// @version      0.2
// @description  Add fixed button to switch to different PlayFab environment
// @author       You
// @include     http*://*.playfab.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://developer.playfab.com/
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374423/PlayFab%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/374423/PlayFab%20Switcher.meta.js
// ==/UserScript==

var pageurl=window.location.href;
var n = pageurl.indexOf("/en-US/");
//alert(n);

var currentID = pageurl.substr(n+11,4);
//alert(currentID);

var urlDev = pageurl.replace(currentID,"2908");
var urlStable = pageurl.replace(currentID,"65E9");
var urlLive = pageurl.replace(currentID,"EACE");
var urlProd = pageurl.replace(currentID,"7AFB");
var urlDemo = pageurl.replace(currentID,"7052");

var input1=document.createElement("button");
var a = document.createTextNode("DEV-2908");
input1.style.color ="white";
input1.style.backgroundColor ="red";
input1.appendChild(a);
input1.onclick = function(){window.open(urlDev);};

var input2=document.createElement("button");
var b = document.createTextNode("Editor-65E9");
input2.style.color ="white";
input2.style.backgroundColor ="red";
input2.appendChild(b);
input2.onclick = function(){window.open(urlStable);};

var input3=document.createElement("button");
var c1 = document.createTextNode("Staging-7AFB");
input3.style.color ="white";
input3.style.backgroundColor ="red";
input3.appendChild(c1);
input3.onclick = function(){window.open(urlProd);};

var input4=document.createElement("button");
var c2 = document.createTextNode("Live-EACE");
input4.style.color ="white";
input4.style.backgroundColor ="red";
input4.appendChild(c2);
input4.onclick = function(){window.open(urlLive);};

var input5=document.createElement("button");
var c3 = document.createTextNode("Demo-7052");
input5.style.color ="white";
input5.style.backgroundColor ="red";
input5.appendChild(c3);
input5.onclick = function(){window.open(urlDemo);};

input1.style.top = "10px";
input1.style.left = "302px";
input1.style.position = "fixed";

input2.style.top = "10px";
input2.style.left = "160px";
input2.style.position = "fixed";

input3.style.top = "10px";
input3.style.left = "430px";
input3.style.position = "fixed";

input4.style.top = "10px";
input4.style.left = "580px";
input4.style.position = "fixed";

input5.style.top = "10px";
input5.style.left = "700px";
input5.style.position = "fixed";

document.body.appendChild(input1);
document.body.appendChild(input2);
document.body.appendChild(input4);
document.body.appendChild(input3);
document.body.appendChild(input5);
