// ==UserScript==
// @name         1 апреля на лзт
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ПОЛНАЯ ЕБАЛА!!!!!!!!!!!!!
// @author       Здравствуйте
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469992/1%20%D0%B0%D0%BF%D1%80%D0%B5%D0%BB%D1%8F%20%D0%BD%D0%B0%20%D0%BB%D0%B7%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/469992/1%20%D0%B0%D0%BF%D1%80%D0%B5%D0%BB%D1%8F%20%D0%BD%D0%B0%20%D0%BB%D0%B7%D1%82.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function rotateElements() {
        const elements = document.querySelectorAll('img, gif, svg, video');
        elements.forEach(element => {
            element.style.transform = 'rotate(180deg)';
        });
    }

    rotateElements();
})();

(function() {
    'use strict';
    function rotateText(element) {
        element.style.transform = "rotate(1deg)";
    }

    var elementsWithText = document.querySelectorAll("div");
    for (var i = 0; i < elementsWithText.length; i++) {
        rotateText(elementsWithText[i]);
    }
})();