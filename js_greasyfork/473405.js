// ==UserScript==
// @name         Krunker.io Css Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom Css Changer 
// @author       Jaguar
// @match        https://krunker.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krunker.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473405/Krunkerio%20Css%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/473405/Krunkerio%20Css%20Changer.meta.js
// ==/UserScript==
// Discord- https://discord.gg/4T6HGWTBd7
// GitHub- https://github.com/Documantation12


var CustomCssLink = "PUT_CUSTOM_CSS_HERE";

var linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = CustomCssLink;
fetch(linkElement.href)
  .then(response => response.text())
  .then(grabthecss => {
    var styleElement = document.createElement('style');
    styleElement.textContent = grabthecss;
    document.head.appendChild(linkElement);
    document.head.appendChild(styleElement);
  })

