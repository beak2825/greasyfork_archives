// ==UserScript==
// @name         Google images view button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       anon
// @include      https://*.google.*/*
// @grant        none
// @run-at document-idle
// @description  Re-adds the "View Image" button to Google Images result pages. The only script I found to be working. Got it off /g/ on 4chan, thank you, anon!!



// @downloadURL https://update.greasyfork.org/scripts/38611/Google%20images%20view%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/38611/Google%20images%20view%20button.meta.js
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