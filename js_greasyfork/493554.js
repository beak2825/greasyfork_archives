// ==UserScript==
// @license MIT 
// @name         Don't-hot-topic
// @namespace    https://zelenka.guru/
// @version      0.2
// @description  666
// @author       You
// @include      /^https:\/\/(lolz\.guru|zelenka\.guru)/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493554/Don%27t-hot-topic.user.js
// @updateURL https://update.greasyfork.org/scripts/493554/Don%27t-hot-topic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    function replaceHotIcon() {
        var hotIcons = document.querySelectorAll('.hot.fa.fa-solid.fa-fire.Tooltip[aria-hidden="true"]');

        hotIcons.forEach(function(icon) {
            var imgElement = document.createElement('img');
            imgElement.src = 'https://nztcdn.com/files/3b866d27-77d5-4353-b241-a05bf0e72e92.webp';
            imgElement.style.maxWidth = '50px';

            replaceElement(icon, imgElement);
        });
    }

    function replaceHotIcon1() {
        var hotIcons1 = document.querySelectorAll('.titleBarIcon.hotThreadIcon.fa.fa-fire.Tooltip');

        hotIcons1.forEach(function(icon) {
            var imgElement = document.createElement('img');
            imgElement.src = 'https://nztcdn.com/files/3b866d27-77d5-4353-b241-a05bf0e72e92.webp';
            imgElement.style.maxWidth = '45px';

            replaceElement(icon, imgElement);
        });
    }

    replaceHotIcon();
    replaceHotIcon1();
})();