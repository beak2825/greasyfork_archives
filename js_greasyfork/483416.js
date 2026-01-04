// ==UserScript==
// @name         Ремувлям
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ну просто тильт
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483416/%D0%A0%D0%B5%D0%BC%D1%83%D0%B2%D0%BB%D1%8F%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/483416/%D0%A0%D0%B5%D0%BC%D1%83%D0%B2%D0%BB%D1%8F%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function removeThreadById(threadId) {
        var threadElement = document.getElementById(threadId);
        if (threadElement) {
            threadElement.remove();
            console.log('Thread with ID ' + threadId + ' has been removed');
        }
    }


    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (!mutation.addedNodes) return;

            removeThreadById('thread-6342290');
        });
    });


    var config = { childList: true, subtree: true };


    observer.observe(document.body, config);
})();