// ==UserScript==
// @name 				View Image Add for Google Search
// @description Adding button which directing us to image to google
// @author 			@Hozuki_Aoi edited to English
// @namespace 	https://twitter.com/Hozuki_Aoi
// @version 		1.1
// @include 		https://*.google.*/search?tbm=isch*
// @include 		https://*.google.*/search?*&tbm=isch*
// @grant				GM_openInTab
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/38716/View%20Image%20Add%20for%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/38716/View%20Image%20Add%20for%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element = document.querySelectorAll("._FKw td:nth-child(1)");
    var elementtimer = setInterval(function(){
        var element = document.querySelectorAll("._FKw td:nth-child(1)");
        if (element.length) {
            var newElement = document.createElement("td");
            var link = document.createElement("a");
            link.href = 'javascript:void function(){function isElementVisible(el){var rect=el.getBoundingClientRect(),vWidth=window.innerWidth||doc.documentElement.clientWidth,vHeight=window.innerHeight||doc.documentElement.clientHeight,efp=function(x,y){return document.elementFromPoint(x,y)};return rect.right<0||rect.bottom<0||rect.left>vWidth||rect.top>vHeight%3F!1:el.contains(efp(rect.left,rect.top))||el.contains(efp(rect.right,rect.top))||el.contains(efp(rect.right,rect.bottom))||el.contains(efp(rect.left,rect.bottom))}"undefined"==typeof window.isElementVisible;{var imgs=document.querySelectorAll(".irc_mi");imgs.forEach(function(img){isElementVisible(img)%26%26window.open(img.src)})}}();';
            var span = document.createElement("span");
            span.classList.add("_WKw");
            span.appendChild(document.createTextNode("View Image"));
            link.appendChild(span);
            newElement.appendChild(link);
            for (var i = 0; i < element.length;i++) {
                element[i].after(newElement.cloneNode(true));
            }
            clearInterval(elementtimer);
        }
    },100);
})();