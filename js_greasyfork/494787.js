// ==UserScript==
// @name         Return YouTube Favorites
// @name:ru      Return YouTube Favorites
// @namespace    https://t.me/johannmosin
// @version      0.4
// @description  Returns Favorites to its rightful place on the left menu
// @description:ru  Возвращает Избранное на своё законное место в левом меню
// @author       Johann Mosin
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494787/Return%20YouTube%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/494787/Return%20YouTube%20Favorites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = '' // <------------------------------------------------- YOUR LINK TO FAVORITES PLAYLIST GOES HERE

    var oldTitle="Your videos" // <------------------------------------ CHANGE THOUSE IF YOUR LANGUAGE
    var newTitle="Favorites" // <-------------------------------------- ISN'T SUPPORTED BY THE LIST BELOW

    var langObj = {
        'en': ["Your videos", "Favorites"],
        'en-GB': ["Your videos", "Favourites"],
        'ru-RU': ["Ваши видео", "Избранное"],
        'de-DE': ["Meine Videos", "Favoriten"],
        'es-ES': ["Mis videos","Favoritos"],
        'es-419': ["Tus videos","Favoritos"],
        'es-US': ["Tus videos","Favoritos"],
        'fr-CA': ["Vos vidéos","Favoris"],
        'fr-FR': ["Vos vidéos", "Favoris"]
    }

    const langMap = new Map(Object.entries(langObj));

    function defineLanguage() {
        const htmlLang = document.querySelector('html').lang;
        const langTitles = langMap.get(htmlLang);
        if (langTitles) {
            oldTitle = langTitles[0];
            newTitle = langTitles[1];
        }
    }

    function changeLinkAndText() {
        const element = document.querySelector(`a[title="${oldTitle}"]`);
        if (!element) return;

        element.href = link;
        const textElement = element.querySelector('.title.style-scope.ytd-guide-entry-renderer');
        if (textElement) {
            textElement.textContent = newTitle;
        }

        element.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = link;
        }, true);
    }

    function createObserver(targetNode) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (targetNode.querySelector(`a[title="${oldTitle}"]`)) {
                        changeLinkAndText();
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 2000);
    }

    window.addEventListener('load', function() {
        defineLanguage();
        changeLinkAndText();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.querySelector(`a[title="${oldTitle}"]`)) {
                                changeLinkAndText();
                            } else {
                                createObserver(node);
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();