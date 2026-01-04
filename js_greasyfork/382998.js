// ==UserScript==
// @name         蘋果新聞免登入
// @namespace    https://github.com/it9gamelog/gcx-appledaily-esc-paywall
// @version      0.2
// @description  移植自GitHub
// @author       You
// @match        *.appledaily.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382998/%E8%98%8B%E6%9E%9C%E6%96%B0%E8%81%9E%E5%85%8D%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/382998/%E8%98%8B%E6%9E%9C%E6%96%B0%E8%81%9E%E5%85%8D%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var article = document.querySelector('.Article');
    var blocker = document.querySelector('.contentblock-block');

    if (article && blocker) {
        // 香港/北美版
        //
        // The completed article is presented to the client then hide later with JS,
        // hence the script could achive the goal by just manipulating the DOM.
        //
        // After page load, the DOM of every paragraphs, excepted the first one,
        // in an article is removed.
        // Then a paywall is shown.

        // Backup the article DOM
        var preservedArticle = article.cloneNode(true);

        // function to restore the article
        var restoreArticle = function() {
            // Remove the paywall
            var block = document.querySelector('.contentblock-block');
            if (block) block.remove();

            // Remove the gradient background and height limitation
            var style = document.createElement('style');
            style.innerHTML = `
            .LHSContent:before { background: none !important; }
            #articleContent { height: initial !important; }
        `;
            document.head.appendChild(style);

            // Restore the article
            article.replaceWith(preservedArticle);
            console.log("Esc Paywall: Completed");
        };

        // Monitor when the article children is removed, then queue the restore function
        var observer = new MutationObserver(function(mutations) {
            mutations.some(function(mutation) {
                if (!mutation.removedNodes) return false;
                observer.disconnect();
                // Queue the function to make sure the paywall script is done before restoring
                setTimeout(restoreArticle, 10);
                return true;
            })
        })
        observer.observe(article, {
            childList: true
        });
    }
})();