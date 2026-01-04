// ==UserScript==
// @name         Fiction.live Word Counter
// @namespace    https://github.com/erasels
// @version      2.1
// @description  Display word count for chapters on fiction.live, counting only story posts and automatically updating.
// @author       erasels
// @match        https://fiction.live/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fiction.live
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497111/Fictionlive%20Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/497111/Fictionlive%20Word%20Counter.meta.js
// ==/UserScript==

// Due to AJAX the site doesn't trigger script loads when navigating to /stories/ from the main page, so we catch changes to the URL
(function(history) {
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        window.dispatchEvent(new CustomEvent('statepushed', {detail: state}));
        return pushState.apply(history, arguments);
    };
})(window.history);

window.addEventListener('statepushed', function(e) {
    setTimeout(() => {
        console.log('Detected navigation:', e.detail);
        checkAndActivate(); // Check URL and activate main logic if appropriate
    }, 1000);
});

function main() {
    // Helper function to count words in the specified element
    function countWords(element) {
        var text = element.innerText || element.textContent;
        return text.split(/\s+/).filter(n => n != '').length;
    }

    // Function to count words only in chapter elements
    function countChapterWords() {
        var chapters = document.querySelectorAll('#storyPosts .chapter:not(.choice, .readerPost) .chapterContent');
        return Array.from(chapters).reduce((acc, chapter) => acc + countWords(chapter), 0);
    }


    // Function to update or insert the word count display
    function updateWordCountDisplay(wordCount) {
        // Define a base function for creating the word count display
        function createWordCountDiv(count) {
            var div = document.createElement('div');
            div.setAttribute('class', 'word-count-display');
            div.setAttribute('style', 'margin-top: 5px; text-align: center; font-weight: 400; font-family: Helvetica Neue,HelveticaNeue,Helvetica,Arial,sans-serif; font-size: 2em;');
            div.innerText = 'Chapter Word Count: ' + count;
            return div;
        }

        // Remove existing word count displays if they exist
        document.querySelectorAll('.word-count-display').forEach(function(div) {
            div.remove();
        });

        var wordCountTop = createWordCountDiv(wordCount);
        var wordCountBottom = createWordCountDiv(wordCount);

        // Insert the top word count display
        var pageBody = document.querySelector('.page-body');
        if (pageBody) {
            pageBody.insertBefore(wordCountTop, pageBody.firstChild);
        }

        // Insert the bottom word count display above the Next Chapter button, if present
        var nextChapterBtn = document.querySelector('a.nextChapter');
        var insertPointForBottom = nextChapterBtn ? nextChapterBtn.parentNode : document.querySelector('.page-body');
        insertPointForBottom.insertBefore(wordCountBottom, nextChapterBtn);
    }

    // Setup MutationObserver to dynamically check for loaded content
    function setupObserver() {
        var targetNode = document.getElementById('storyPosts');

        if (targetNode) {
            console.log('Target node for story posts found. Setting up observer.');

            // Observer for updates from currently active QM
            var observer = new MutationObserver((mutationsList, observer) => {
                // Check if any mutation added nodes and update word count accordingly
                if (mutationsList.some(mutation => mutation.addedNodes.length > 0)) {
                    console.log('New chapter content detected.');
                    var wordCount = countChapterWords();
                    console.log('Updated Word Count:', wordCount);
                    updateWordCountDisplay(wordCount);
                }
            });

            observer.observe(targetNode, { childList: true, subtree: true });

            // Initial word count update
            var initialWordCount = countChapterWords();
            updateWordCountDisplay(initialWordCount);
        } else {
            console.log('Target node not found yet. Retrying...');
            setTimeout(setupObserver, 1000); // Retry after 1 second
        }
    }

    console.log('Word Counter script is active on this page.');

    setupObserver();
}

function checkAndActivate() {
    if (window.location.href.includes('/stories/')) {
        main();
    } else {
        console.log('Not a /stories/ page, script waiting...');
    }
}

// Delay execution until DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndActivate);
} else {
    checkAndActivate(); // Immediate execution if the document is already ready
}
