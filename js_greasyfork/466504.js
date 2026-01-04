    // ==UserScript==
    // @name         Usuń zakapiora z zapytaj.onet.pl
    // @namespace    http://your-namespace.example.com/
    // @version      1.1
    // @description  Hide content from specific user on a website
    // @match        https://zapytaj.onet.pl/*
    // @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466504/Usu%C5%84%20zakapiora%20z%20zapytajonetpl.user.js
// @updateURL https://update.greasyfork.org/scripts/466504/Usu%C5%84%20zakapiora%20z%20zapytajonetpl.meta.js
    // ==/UserScript==

(function() {
    'use strict';

    // Function to hide specific elements
    function hideContent() {
        var userElements = document.querySelectorAll('p.person a[href="/Profile/user_4044856.html"]');
        userElements.forEach(function(element) {
            var article = element.closest('article');
            if (article) {
                var parentLi = article.closest('li[data-page]');
                if (parentLi) {
                    parentLi.style.display = 'none';
                }
            }
        });
    }

    // Call the hideContent function when the page finishes loading
    window.addEventListener('load', hideContent);

    // Monitor for new content using MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                hideContent();
            }
        });
    });

    var targetNode = document.body;
    var config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();

//end

(function() {
    'use strict';

    // Function to remove the user content
    function removeUserContent() {
        var article = document.querySelector('article.standard-grid.standard-answer.clearfix');
        if (article) {
            article.parentNode.removeChild(article);
        }
    }

    // Call the removeUserContent function as soon as possible
    removeUserContent();
})();


