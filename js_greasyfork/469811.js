// ==UserScript==
// @name         fCarregador de imagem do chat
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Carrega imagens do chat automaticamente
// @author       Mikill
// @match        https://animefire.net/*
// @icon         https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469811/fCarregador%20de%20imagem%20do%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/469811/fCarregador%20de%20imagem%20do%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loadedImages = [];

    function loadImagesFromLinks() {
        var messageElements = document.querySelectorAll('h6.h6Msg.montserrant200');

        for (var i = 0; i < messageElements.length; i++) {
            var messageElement = messageElements[i];
            var linkElements = messageElement.querySelectorAll('a');

            for (var j = 0; j < linkElements.length; j++) {
                var linkElement = linkElements[j];
                var linkURL = linkElement.getAttribute('href');

                if (isImageURL(linkURL) && !loadedImages.includes(linkURL)) {
                    var imageElement = document.createElement('img');
                    imageElement.src = linkURL;
                    imageElement.className = 'loaded-image';
                    imageElement.style.display = 'block';
                    imageElement.style.maxWidth = '100%';

                    linkElement.parentNode.replaceChild(imageElement, linkElement);

                    loadedImages.push(linkURL);
                }
            }
        }
    }

    function isImageURL(url) {
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        for (var i = 0; i < imageExtensions.length; i++) {
            if (url.toLowerCase().endsWith(imageExtensions[i])) {
                return true;
            }
        }

        return false;
    }

    function verifyCacheCookies() {
        var verifyCookiesInterval = setInterval(function() {
            var hasCache1 = document.cookie.includes("cache");

            if (hasCache1) {
                clearInterval(verifyCookiesInterval);
                setInterval(loadImagesFromLinks, 2000);
            }
        }, 10000);
    }

    verifyCacheCookies();
})();