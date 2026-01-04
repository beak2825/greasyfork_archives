// ==UserScript==
// @name         Universal Inline & Display LaTeX Renderer (KaTeX)
// @namespace    http://tampermonkey.net/
// @version      2025-07-13.5.2
// @description  Render inline and display LaTeX math on any website using KaTeX. Careful with input fields! Be sure to have rendering OFF when entering an input field, otherwise you can mess up your delimiters. I have made a fix button for this, but it might not be exactly correct.
// @match        *://*/*
// @author       ParaMigi and ChatGPT
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/81c7f261-f956-486d-b688-8737c82fe364/d89cugg-d51ff456-9ced-4b87-97ab-f6ff06bb9cf2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzgxYzdmMjYxLWY5NTYtNDg2ZC1iNjg4LTg3MzdjODJmZTM2NFwvZDg5Y3VnZy1kNTFmZjQ1Ni05Y2VkLTRiODctOTdhYi1mNmZmMDZiYjljZjIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.gdj9FL-s9pYJa6xIhrkmsn5E4vpH2-VeEZPDcqBbHSo
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542419/Universal%20Inline%20%20Display%20LaTeX%20Renderer%20%28KaTeX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542419/Universal%20Inline%20%20Display%20LaTeX%20Renderer%20%28KaTeX%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // User defined constants

    // LaTeX delimiters you want to support
    const delimiters = [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
        { left: '[;', right: ';]', display: false },
        // same but with backtick
        { left: '`$$', right: '$$`', display: true },
        { left: '`\\[', right: '\\]`', display: true },
        { left: '`\\(', right: '\\)`', display: false },
        { left: '`$', right: '$`', display: false },
        { left: '`[;', right: ';]`', display: false }
    ];

    // Color of the rendered LaTeX
    const renderedLatexTextColor = 'red'; // set to null or false if you want to keep the original color
    const renderedLatexBackgroundColor = '#ffeeee'; // set to null or false if you don't want to have a background color
    const renderedLatexBorderColor = 'red'; // set to null or false if you don't want to have a border

    // How the buttons look
    const buttonTransparentOpacity = '0.5'; // 0 is fully transparent, 1 is fully solid.

    const toggleButtonTransparentText = '✨∫ π';
    const toggleButtonActiveText = '✨∫ π✨ LaTeX rendering is currently ON';
    const toggleButtonInactiveText = '✨∫ π✨ LaTeX rendering is currently OFF';

    const fixButtonTransparentText = '🛠️';
    const fixButtonText = '🛠️ Fix Input Field';

    // Render automatically on loading the page
    const autoRender = false;




    // Inject KaTeX CSS
    const katexCSS = document.createElement('link');
    katexCSS.rel = 'stylesheet';
    katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(katexCSS);

    // Create toggle button (initially hidden)
    const toggleButton = document.createElement('button');
    toggleButton.textContent = toggleButtonTransparentText;
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '15px';
    toggleButton.style.right = '50px';
    toggleButton.style.zIndex = 9999;
    toggleButton.style.padding = '3px 10px 6px 10px';
    toggleButton.style.background = '#333';
    toggleButton.style.color = 'white';
    toggleButton.style.border = '1px solid #999';
    toggleButton.style.borderRadius = '15px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '14px';
    toggleButton.style.fontFamily = 'sans-serif';
    toggleButton.style.opacity = buttonTransparentOpacity; // Semi-transparent
    toggleButton.style.display = 'none'; // Hidden by default
    document.body.appendChild(toggleButton);

    let renderingEnabled = autoRender ? true : false;

    // Helper: strip delimiters from LaTeX string, e.g. "$...$" -> "..."
    function stripDelimiters(latex) {
        for (const d of delimiters) {
            if (latex.startsWith(d.left) && latex.endsWith(d.right)) {
                return latex.slice(d.left.length, latex.length - d.right.length);
            }
        }
        return latex;
    }

    // Render LaTeX math in the page by replacing text nodes with KaTeX-rendered spans
    function renderLatex() {
        if (!renderingEnabled) return;

        const latexPattern = new RegExp(
            delimiters
            .map(d => `(${d.left.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}[^]*?${d.right.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`)
            .join('|'),
            'g'
        );

        const forbiddenTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON', 'SELECT'];

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                const el = node.parentElement;
                if (!el) return NodeFilter.FILTER_REJECT;

                if (forbiddenTags.includes(el.tagName)) return NodeFilter.FILTER_REJECT;
                if (el.closest('.katex-rendered')) return NodeFilter.FILTER_REJECT;
                if (!latexPattern.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        });


        const nodesToReplace = [];
        let node;
        while ((node = walker.nextNode())) {
            nodesToReplace.push(node);
        }

        for (const textNode of nodesToReplace) {
            const original = textNode.nodeValue;
            const parts = original.split(latexPattern).filter(p => p != null && p !== '');

            const fragment = document.createDocumentFragment();

            for (let part of parts) {
                const matched = delimiters.find(d => part.startsWith(d.left) && part.endsWith(d.right));
                if (matched) {
                    const latex = part
                        .slice(matched.left.length, part.length - matched.right.length)
                        // The following lines are hacks to fix some formatting issues on some websites, or commands that KaTeX does not recognize
                        .replace(/\\mbox\b/g, '\\textnormal') // hack for mbox not being recognized by KaTeX
                        .replace(/\\left\{/g, '\\left\\{') // hack for when \left\{ is already being formatted into \left{ (like on reddit)
                        .replace(/\\right\}/g, '\\right\\}') // same for right
                        .replace(/\\begin\{(array|tabular|matrix)[^}]*\}([\s\S]*?)\\end\{\1\}/g, (match, env, content) => {
                            const fixedContent = content.replace(/(^|[^\\])\\\s/g, '$1\\\\ ');
                            return `\\begin{${env}}${fixedContent}\\end{${env}}`;
                        }); // hack for when \\ in an array, table, or matrix environment is being formatted to \ (like on reddit).


                    try {
                        const span = document.createElement('span');
                        const wrapper = document.createElement('div');
                        if (renderedLatexTextColor) {span.style.color = renderedLatexTextColor;};

                        wrapper.innerHTML = katex.renderToString(latex, {
                            throwOnError: false,
                            displayMode: matched.display
                        });

                        // Get the inner .katex element (but only the rendered part, not the fallback plaintext)
                        const visualKatexElement = wrapper.querySelector('.katex-mathml') || wrapper.firstChild;
                        // Set the styling as defined at the start
                        if (visualKatexElement) {
                            if (renderedLatexTextColor) {visualKatexElement.style.color = renderedLatexTextColor;};
                            if (renderedLatexBackgroundColor) {visualKatexElement.style.backgroundColor = renderedLatexBackgroundColor;};
                            if (renderedLatexBorderColor) {visualKatexElement.style.border = '1px solid '+renderedLatexBorderColor;};
                            if (renderedLatexBackgroundColor || renderedLatexBorderColor) {
                                visualKatexElement.style.padding = '4px';
                                visualKatexElement.style.borderRadius = '6px';
                                visualKatexElement.style.display = 'inline-block'; // ensure it wraps around the content properly
                            }
                        }

                        span.appendChild(visualKatexElement.cloneNode(true));
                        span.classList.add('katex-rendered');
                        span.dataset.latexSrc = part;
                        fragment.appendChild(span);
                    } catch (e) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            }

            textNode.parentElement.replaceChild(fragment, textNode);
        }
    }


    // Revert rendered math back to original LaTeX source text
    function revertLatex() {
        document.querySelectorAll('.katex-rendered').forEach(el => {
            const originalLatex = el.dataset.latexSrc || el.textContent;
            const textNode = document.createTextNode(originalLatex);
            el.parentElement.replaceChild(textNode, el);
        });
    }


    // Check if page has any LaTeX delimiters to decide if toggle button should be shown
    function pageHasLatex() {
        const bodyText = document.body.innerText;
        return delimiters.some(d => {
            const pattern = new RegExp(d.left.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
            return pattern.test(bodyText);
        });
    }

    // Show the toggle button if LaTeX is detected in the page
    function updateButtonVisibility() {
        if (pageHasLatex()) {
            toggleButton.style.display = 'block';
        }
    }

    // Toggle button click handler
    toggleButton.onclick = () => {
        renderingEnabled = !renderingEnabled;
        toggleButton.textContent = renderingEnabled ? toggleButtonActiveText : toggleButtonInactiveText;
        if (renderingEnabled) {
            renderLatex();
            revertLatex();
            renderLatex();
        } else {
            revertLatex();
        }
    };

    // Button opacity hover effect and CTRL key hiding logic
    let ctrlHeld = false;

    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.opacity = '1';
        toggleButton.textContent = renderingEnabled ? toggleButtonActiveText : toggleButtonInactiveText;
    });

    toggleButton.addEventListener('mouseout', () => {
        if (!ctrlHeld) toggleButton.style.opacity = buttonTransparentOpacity;
        toggleButton.textContent = toggleButtonTransparentText;
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            ctrlHeld = true;
            toggleButton.style.opacity = '0';
            toggleButton.style.pointerEvents = 'none';
            toggleButton.style.zIndex = 1;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (!e.ctrlKey) {
            ctrlHeld = false;
            toggleButton.style.opacity = buttonTransparentOpacity;
            toggleButton.style.pointerEvents = 'auto';
            toggleButton.style.zIndex = 9999;
        }
    });

    // Create the fix button (only shown when rendering is off but still detected)
    const fixButton = document.createElement('button');
    fixButton.textContent = fixButtonTransparentText;
    fixButton.style.position = 'fixed';
    fixButton.style.bottom = '15px';
    fixButton.style.right = '200px'; // Left of the toggle-button
    fixButton.style.zIndex = 9999;
    fixButton.style.padding = '3px 10px 6px 10px';
    fixButton.style.background = '#444';
    fixButton.style.color = 'white';
    fixButton.style.border = '1px solid #999';
    fixButton.style.borderRadius = '15px';
    fixButton.style.cursor = 'pointer';
    fixButton.style.fontSize = '14px';
    fixButton.style.fontFamily = 'sans-serif';
    fixButton.style.opacity = buttonTransparentOpacity;
    fixButton.style.display = 'none'; // hidden initially
    document.body.appendChild(fixButton);


    // Function to update the visibility of the fix button
    let fixButtonVisible = false;

    function updateFixButtonVisibility() {
        if (renderingEnabled) return;
        const hasKatexRendered = document.querySelector('.katex-rendered') !== null;
        fixButton.style.display = hasKatexRendered ? 'block' : 'none';
        fixButtonVisible = hasKatexRendered;
    }

    fixButton.addEventListener('mouseover', () => {
        fixButton.style.opacity = '1';
        fixButton.textContent = fixButtonText;
    });
    fixButton.addEventListener('mouseout', () => {
        fixButton.style.opacity = buttonTransparentOpacity;
        fixButton.textContent = fixButtonTransparentText;
    });


    // Fix button click handler
    fixButton.onclick = () => {
        const renderedSpans = Array.from(document.querySelectorAll('.katex-rendered'));
        for (const span of renderedSpans) {
            const mathml = span.querySelector('.katex-mathml');
            if (!mathml) continue;

            const text = mathml.textContent.trim();

            // Remove first "word" before first space
            const firstSpaceIndex = text.indexOf(' ');
            const latexContent = firstSpaceIndex === -1
            ? text
            : text.slice(firstSpaceIndex + 1).trim();

            // Check if the span is the only content inside a paragraph
            const parent = span.parentElement;
            let finalLatex;
            if (parent && parent.tagName === 'P') {
                // Check if the paragraph only has this span and/or whitespace text nodes
                const onlyKatex = Array.from(parent.childNodes).every(node => {
                    return node === span ||
                        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
                });

                if (onlyKatex) {
                    finalLatex = '\\[' + latexContent + '\\]';
                } else {
                    finalLatex = '[; ' + latexContent + ' ;]';
                }
            } else {
                finalLatex = '[; ' + latexContent + ' ;]';
            }

            const newNode = document.createTextNode(finalLatex);
            span.parentElement.replaceChild(newNode, span);
        }
        console.log('Fix Input Field replacement done');
    };


    // On start, check if page has LaTeX and show button if so
    setTimeout(() => {
        updateButtonVisibility();
        updateFixButtonVisibility();
        if (renderingEnabled) {
            renderLatex();
            revertLatex();
            renderLatex();
        }
    }, 500);

    setInterval(() => {
        updateButtonVisibility();
        updateFixButtonVisibility();
    }, 1000);


})();
