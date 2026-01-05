// ==UserScript==
// @name          BumbleBee_Kimono
// @namespace     BumbleBee
// @version       1.1.6
// @author        GuanJyunChen
// @description   Let User Easly Get Dom Path
// @include       172.16.58.7/kimono/*
// @require       http://code.jquery.com/jquery-2.2.0.min.js
// @require       https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.2/angular.min.js
// @resource      customFontCSS css/kimono-toolbar-fonts.min.css
// @resource      customCss     css/kimono-toolbar.min.css
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/16770/BumbleBee_Kimono.user.js
// @updateURL https://update.greasyfork.org/scripts/16770/BumbleBee_Kimono.meta.js
// ==/UserScript==


var newFontCSS = GM_getResourceText ("customFontCSS");
GM_addStyle (newFontCSS);

var newCSS     = GM_getResourceText ("customCss");
GM_addStyle (newCSS);

var input=document.createElement("input");
input.type="button";
input.value="GreaseMonkey Button";
input.onclick = showAlert;
document.body.appendChild(input); 
 
function showAlert()
{
    alert("Hello World");
}