// ==UserScript==
// @name         Copy Code in Code Block Footer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Duplicate the header of code blocks as a footer to give a second copy code button
// @author       Gavin Trutzenbach / @gaveroid
// @match        https://chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/476719/Copy%20Code%20in%20Code%20Block%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/476719/Copy%20Code%20in%20Code%20Block%20Footer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to copy text to clipboard
    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    // Function to process code blocks
    function processCodeBlocks() {
        var codeBlocks = document.querySelectorAll('div[class^="bg-black"]');
        codeBlocks.forEach(function(codeBlock) {
            var headerDiv = codeBlock.querySelector('div[class^="flex items-center"]');
            if (headerDiv && !codeBlock.querySelector('.duplicated-footer')) {
                var footerDiv = headerDiv.cloneNode(true);
                footerDiv.classList.add('duplicated-footer');
                codeBlock.appendChild(footerDiv);

                // Update copy button function
                var updateCopyButtonFunction = function(button) {
                    var originalInnerHTML = button.innerHTML;  // Store the original inner HTML
                    var copyFunction = function() {
                        var codeText = codeBlock.querySelector('code').innerText;
                        copyToClipboard(codeText);
                        this.innerHTML = '&#10004; Copied!';  // ASCII icon for checkmark
                        var btn = this;
                        setTimeout(function() {
                            btn.innerHTML = originalInnerHTML;  // Revert to original inner HTML
                        }, 3000);  // Revert back after 3 seconds
                    };
                    button.removeEventListener('click', copyFunction);  // Remove old event listener
                    button.addEventListener('click', copyFunction);  // Add new event listener
                };

                // Update copy buttons in header and footer
                var copyButtonHeader = headerDiv.querySelector('button');
                var copyButtonFooter = footerDiv.querySelector('button');
                updateCopyButtonFunction(copyButtonHeader);
                updateCopyButtonFunction(copyButtonFooter);
            }
        });
    }

    // Create a MutationObserver to monitor the DOM for changes
    var observer = new MutationObserver(function(mutationsList, observer) {
        processCodeBlocks();
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
})();
