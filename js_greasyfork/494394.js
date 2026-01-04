// ==UserScript==
// @name         BGM.TV Image Replacer
// @namespace    https://bgm.tv
// @version      1.0
// @description  Replace specific image on bgm.tv pages
// @author       Rin
// @match        https://bgm.tv/group/topic/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494394/BGMTV%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/494394/BGMTV%20Image%20Replacer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', function() {
        if (window.location.href.includes("bgm.tv/group/topic/")) {
            var images = document.querySelectorAll('img');
            images.forEach(function(image) {
                if (image.src.includes("/img/smiles/tv/102.gif")) {
                    image.src = image.src.replace("/img/smiles/tv/102.gif", "/img/smiles/tv/40.gif");
                }
            });
            var elementsWithBg = document.querySelectorAll('[style*=background-image]');
            elementsWithBg.forEach(function(element) {
                var style = window.getComputedStyle(element);
                var backgroundImage = style.backgroundImage;
                if (backgroundImage.includes("/img/smiles/tv/102.gif")) {
                    element.style.backgroundImage = backgroundImage.replace("/img/smiles/tv/102.gif", "/img/smiles/tv/40.gif");
                }
            });
        }
    });
})();