// ==UserScript==
// @name         Трофеии
// @version      0.1
// @description  Изменение трофеев
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// namespace     https://greasyfork.org/ru/users/1144029
// @license MIT
// @namespace https://greasyfork.org/users/1144029
// @downloadURL https://update.greasyfork.org/scripts/472438/%D0%A2%D1%80%D0%BE%D1%84%D0%B5%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/472438/%D0%A2%D1%80%D0%BE%D1%84%D0%B5%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Seller = 'https://i.imgur.com/KSvKLoI.png';
    var Donater = 'https://i.imgur.com/LwIWFEU.png';
    function replaceIcons() {
        var allElements = document.getElementsByTagName('*');

        for (var i = 0; i < allElements.length; i++) {
            var style = window.getComputedStyle(allElements[i]);
            var backgroundImage = style.getPropertyValue('background-image');

            if (backgroundImage.indexOf('/public/trophy_icons/truth_seller_140.png') !== -1) {
                allElements[i].style.backgroundImage = 'url(' + Seller + ')';
            }
            else if (backgroundImage.indexOf('/public/trophy_icons/donater_140.png') !== -1) {
                allElements[i].style.backgroundImage = 'url(' + Donater + ')';
            }
        }
    }
    var observer = new MutationObserver(function(mutations) {
        replaceIcons();
    });
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
    replaceIcons();
})();
