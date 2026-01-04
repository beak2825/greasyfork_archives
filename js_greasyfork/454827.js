// ==UserScript==
// @name         ShowArtstationMatureContent
// @version      0.2
// @description  to show mature-content in artstation
// @author       miccall
// @match        https://www.artstation.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artstation.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @namespace Artstation
// @downloadURL https://update.greasyfork.org/scripts/454827/ShowArtstationMatureContent.user.js
// @updateURL https://update.greasyfork.org/scripts/454827/ShowArtstationMatureContent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divs;
    var contentDiv;
    var matureContentDiv;
    var matureContentBlurDiv;

    var WhenLoadNew = function()
    {
        divs =document.getElementsByClassName("img-blur");
        divs=Array.from(divs);
        contentDiv = document.getElementsByClassName("mature-content-label");
        contentDiv = Array.from(contentDiv);
        matureContentDiv = document.getElementsByClassName("matureContent");
        matureContentDiv = Array.from(matureContentDiv);
        matureContentBlurDiv = document.getElementsByClassName("matureContent-blur")
        matureContentBlurDiv = Array.from(matureContentBlurDiv);
        divs.forEach(function(div){
            // remove blur image
            div.classList.remove('img-blur');
        });
        contentDiv.forEach(function(div){
            // remove mature content label
            div.remove();
        });
        matureContentDiv.forEach(function(div){
            // remove blur image
            div.classList.remove('matureContent');
        });
        matureContentBlurDiv.forEach(function(div){
            // remove blur image
            div.classList.remove("matureContent-blur");
        }
        );
    }

    window.addEventListener('load', function() {
        window.addEventListener('scroll', WhenLoadNew);
    }, false);

    // Your code here...
})();