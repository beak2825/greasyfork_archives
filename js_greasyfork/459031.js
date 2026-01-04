// ==UserScript==
// @name         FixMavanimesImages
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Corrige l'erreur de chargement des images sur mavanimes.co
// @author       SioGabx / yoyo9
// @license MIT
// @match        https://www.mavanimes.co/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mavanimes.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459031/FixMavanimesImages.user.js
// @updateURL https://update.greasyfork.org/scripts/459031/FixMavanimesImages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const images = document.getElementsByTagName("img");
    for (const image of images) {
        image.src = image.src.replace("http://", "https://");
        image.srcset = image.srcset.replace("http://", "https://");
    }
})();