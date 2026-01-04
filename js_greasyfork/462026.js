// ==UserScript==
// @name         ChatGPT Const to Var switch for Javascript snippets
// @version      1.0.4
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author       toolzmaker
// @description  ChatGPT always makes const variables in JavaScript snippets, and sometimes refuses to change it. This script solves the problem.
// @homepageURL  https://discord.gg/BJTk6get7H
// @match        *chat.openai.com/chat*
// @namespace https://greasyfork.org/en/users/971770
// @downloadURL https://update.greasyfork.org/scripts/462026/ChatGPT%20Const%20to%20Var%20switch%20for%20Javascript%20snippets.user.js
// @updateURL https://update.greasyfork.org/scripts/462026/ChatGPT%20Const%20to%20Var%20switch%20for%20Javascript%20snippets.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function updateJSCodeSnippets() {
        // Find all divs with JavaScript code
        var blackRoundedDivs = document.querySelectorAll('div.bg-black.rounded-md');
        var javascriptDivs = [];

        blackRoundedDivs.forEach(div => {
            var javascriptSpan = div.querySelector('span');
            if (javascriptSpan && javascriptSpan.textContent.includes('javascript')) {
                javascriptDivs.push(div);
            }
        });

        // Add 'Toggle const/var' button to each div with JavaScript code and attach click event
        javascriptDivs.forEach(div => {
            if (!div.classList.contains('extrabtns')) {

                var constSpans = div.querySelectorAll('span.hljs-keyword');
                constSpans.forEach(span => {
                    var variants = ['var', 'let', 'const'];
                    //if (span.textContent == 'const') {
                    if (variants.some(word => span.textContent.includes(word))) {
                        span.addEventListener('click', () => {
                            //var variants = ['var', 'let', 'const'];
                            var currentText = span.textContent;
                            var index = variants.indexOf(currentText);
                            var nextText = variants[(index + 1) % variants.length];
                            span.textContent = nextText;
                        });
                    }
                });


                var existingButton = div.querySelector('button');
                if (existingButton && existingButton.textContent === 'Copy code') {
                    var clonedButton = existingButton.cloneNode(true);
                    clonedButton.textContent = 'Const/Var';
                    existingButton.insertAdjacentElement('beforebegin', clonedButton);


                    var copyButton = existingButton.cloneNode(true);
                    copyButton.textContent = 'COPY';
                    clonedButton.insertAdjacentElement('afterend', copyButton);


                    // Attach click event to clonedButton
                    clonedButton.addEventListener('click', () => {
                        var keywordSpans = div.querySelectorAll('span.hljs-keyword');
                        keywordSpans.forEach(span => {
                            if (span.textContent === 'const') {
                                span.textContent = 'var';
                            } else if (span.textContent === 'var') {
                                span.textContent = 'const';
                            }
                        });
                    });

                    // Attach click event to copyButton
                    copyButton.addEventListener('click', () => {
                        var codeElement = div.querySelector('code');
                        if (codeElement) {
                            var codeText = codeElement.textContent;
                            var textArea = document.createElement('textarea');
                            textArea.value = codeText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);

                            // Change button text style to bold
                            copyButton.style.fontWeight = 'bold';

                            // Revert button text style to regular after a short delay
                            setTimeout(() => {
                                copyButton.style.fontWeight = 'normal';
                            }, 500);
                        }
                    });

                    // Add 'extrabtns' class to div
                    div.classList.add('extrabtns');


                }
            }

        });
    }

    setInterval(updateJSCodeSnippets, 5000);
})();