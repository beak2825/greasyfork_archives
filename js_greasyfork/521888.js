// ==UserScript==
// @name         math variables and notations highlighter
// @namespace    https://github.com/FreGeh
// @version      1.5
// @license      GPL-3.0-or-later
// @description  Highlights mathematical variables and notations (MathJax, Italic) with a simple blue background, so long paragraphs are easier to read. Primarily focused for usage on websites such as codeforces and project euler.
// @icon         https://cdn-icons-png.flaticon.com/128/43/43102.png
// @author       fregeh
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521888/math%20variables%20and%20notations%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/521888/math%20variables%20and%20notations%20highlighter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define a function to style elements.
    function highlightElements() {
        // Style tex-span variables.
        const texElements = document.querySelectorAll('.tex-span i');
        texElements.forEach(variable => {
            variable.style.backgroundColor = 'rgba(160, 200, 255, 0.7)'; // Less transparent blue
            variable.style.borderRadius = '3px';
            variable.style.padding = '0 2px';
        });

        // Style MathJax elements.
        const mathJaxElements = document.querySelectorAll('.MathJax');
        mathJaxElements.forEach(element => {
            element.style.backgroundColor = 'rgba(160, 200, 255, 0.7)'; // Less transparent blue
            element.style.borderRadius = '3px';
            element.style.padding = '2px 4px';
            element.style.margin = '0 2px';
            element.style.display = 'inline-block';
        });

        // Style italic and subscript variables in problem_par.
        const problemVars = document.querySelectorAll('.problem_par i, .problem_par sub');
        problemVars.forEach(variable => {
            variable.style.backgroundColor = 'rgba(160, 200, 255, 0.7)';
            variable.style.borderRadius = '3px';
            variable.style.padding = '0 2px';
        });
    }

    // Apply styling to existing elements.
    highlightElements();

    // Observe DOM changes for dynamic content.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches('.tex-span i, .MathJax, .problem_par i, .problem_par sub')) {
                        highlightElements();
                    } else {
                        node.querySelectorAll('.tex-span i, .MathJax, .problem_par i, .problem_par sub').forEach(highlightElements);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();