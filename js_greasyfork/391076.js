// ==UserScript==
// @name         Helixmod Custom CSS
// @namespace    Helixmod Custom CSS
// @version      1.0
// @description  Change colour of helixmod.blogspot.com
// @author       TimFx7
// @include      https://helixmod.blogspot.com/*
// @include      http://helixmod.blogspot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391076/Helixmod%20Custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/391076/Helixmod%20Custom%20CSS.meta.js
// ==/UserScript==

setInterval(function() {
    [].forEach.call(document.getElementsByTagName("*"), e => e.style.backgroundColor = "#d0cfcf");

}, 1);


function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

addNewStyle('body  {color:#000000; text-decoration: none; !important;}')
addNewStyle('.tabs-inner .widget li a  {color:#000000; !important;}')
addNewStyle('u { text-decoration: none; !important;}')
addNewStyle('span {color:#000000; !important;}')
addNewStyle('a:link {color:#0e8400;  font-weight: bold; text-shadow: 0.4px 0.5px black ; !important;}')
addNewStyle('a:visited {color:#ca1818;  font-weight: bold; text-shadow: 0.4px 0.5px black ; !important;}')


addNewStyle ('.post-body img, .post-body .tr-caption-container { padding: 0px; !important;} ')
addNewStyle ('.post-body img, .post-body .tr-caption-container, .Profile img, .Image img, .BlogList .item-thumbnail img { border: 1px solid #111d01; margin: 0px 0px 2px 0px; box-shadow: 20px 25px 40px rgb(4, 4, 4); !important;} ')






