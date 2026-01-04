    // ==UserScript==
    // @name         Auto LaTeX Renderer
    // @namespace    http://tampermonkey.net/
    // @version      1.7
    // @description  Converts LaTeX on web pages into formatted math using MathJax
    // @match        *://*/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516115/Auto%20LaTeX%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/516115/Auto%20LaTeX%20Renderer.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Set MathJax configuration to enable single dollar signs
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true, // Allows \$ to escape dollar signs
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            },
        };

        // Function to add MathJax to the page
        function addMathJax(callback) {
            if (!window.MathJax || !window.MathJax.version) {
                let script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
                script.async = true;
                script.onload = function() {
                    console.log('MathJax loaded');
                    if (callback) callback();
                };
                script.onerror = function() {
                    console.error('Failed to load MathJax. Please check your network or CDN availability.');
                    // Retry in case of failure
                    setTimeout(function(){ addMathJax(callback); }, 2000);
                };
                document.head.appendChild(script);
            } else {
                if (callback) callback();
            }
        }

        // Function to scan the document and render LaTeX
        function renderLatex(root = document.body) {
            try {
                if (window.MathJax && MathJax.typesetPromise) {
                    MathJax.typesetPromise([root]).catch(function (err) {
                        console.error('MathJax typeset failed:', err);
                    });

                    root.querySelectorAll('*').forEach(elem => {
                        if (elem.shadowRoot) {
                            renderLatex(elem.shadowRoot);
                        }
                    });
                } else {
                    console.log('MathJax not loaded yet. Retrying in 500ms...');
                    setTimeout(() => renderLatex(root), 500);
                }
            } catch (error) {
                console.error('Error during LaTeX rendering:', error);
            }
        }

        // Initial injection after page fully loads
        window.addEventListener('load', function() {
            addMathJax(function() {
                // Initial render for existing content
                renderLatex();

                // Observe the DOM for changes and render LaTeX
                const observer = new MutationObserver((mutations) => {
                    // Throttle the renderLatex calls
                    if (observer.renderTimeout) clearTimeout(observer.renderTimeout);
                    observer.renderTimeout = setTimeout(() => {
                        mutations.forEach(mutation => {
                            if (mutation.addedNodes) {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        renderLatex(node);
                                    }
                                });
                            }
                        });
                    }, 300);
                });

                observer.observe(document.body, { childList: true, subtree: true });

                document.querySelectorAll('*').forEach(elem => {
                    if (elem.shadowRoot) {
                        observer.observe(elem.shadowRoot, { childList: true, subtree: true });
                    }
                });
            });
        });

    })();
