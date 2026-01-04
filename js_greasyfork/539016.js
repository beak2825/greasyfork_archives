// ==UserScript==
// @name         Pikabu убрать эмоции
// @name:en      Pikabu no emoji
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Скрывает элементы с классом "comment__emotions" и кнопки с классом "story__emotions emotions" на пикабу
// @description:en  Hides elements with the "comment__emotions" class and buttons with the "story__emotions emotions" class on Pikabu
// @author       Xelavek
// @match        https://pikabu.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539016/Pikabu%20%D1%83%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%8D%D0%BC%D0%BE%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/539016/Pikabu%20%D1%83%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%8D%D0%BC%D0%BE%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function hideEmotions() {

        var commentEmotions = document.querySelectorAll('.comment__emotions');
        commentEmotions.forEach(function(element) {
            element.style.display = 'none';
        });


        var storyEmotions = document.querySelectorAll('.story__emotions.emotions');
        storyEmotions.forEach(function(element) {
            element.style.display = 'none';
        });

              var storyEmotions = document.querySelectorAll('.story__emotions');
        storyEmotions.forEach(function(element) {
            element.style.display = 'none';
        });
    }

    hideEmotions();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideEmotions();
            }
        });
    });


    var config = {
        childList: true,
        subtree: true
    };


    observer.observe(document.body, config);
})();


