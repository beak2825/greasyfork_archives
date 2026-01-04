// ==UserScript==
// @name         Wiktionary Russian Improver
// @namespace    Violentmonkey user scripts
// @version      1.16
// @date         2025-03-08
// @license      MIT
// @description  Uses serif font for Russian text and removes exhausting and indulgent use of transliterations.
// @author       Ojisan Seiuchi
// @match        https://en.wiktionary.org/wiki/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529185/Wiktionary%20Russian%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/529185/Wiktionary%20Russian%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to apply the font styles
    function applyFontStyles() {
        // Handle main page heading
        const mainHeading = document.querySelector('#firstHeading > span');
        if (mainHeading) {
            mainHeading.style.fontFamily = 'Georgia, serif';
        }

        // Handle Russian Cyrillic headwords
        const headwords = document.querySelectorAll('strong.Cyrl.headword[lang="ru"]');
        headwords.forEach(headword => {
            headword.style.fontFamily = 'Georgia, serif';
        });

        // Handle links inside Russian Cyrillic spans
        const cyrillicLinks = document.querySelectorAll('span.Cyrl[lang="ru"] > a');
        cyrillicLinks.forEach(link => {
            link.style.fontFamily = 'Georgia, serif';
        });

        const boldCyrillicLinks = document.querySelectorAll('b.Cyrl[lang="ru"] > a');
        boldCyrillicLinks.forEach(link => {
          link.style.fontFamily = 'Georgia, serif';
        });

        document.querySelectorAll('i.Cyrl[lang="ru"] > a').forEach(link => {
           link.style.fontFamily = 'Georgia, serif';
        });

        document.querySelectorAll('span.Cyrl[lang="ru"] > strong').forEach(link => {
           link.style.fontFamily = 'Georgia, serif';
        });

        // Handle i elements with class "Cyrl mention e-example" and lang "ru"
        document.querySelectorAll('i.Cyrl.mention.e-example[lang="ru"]').forEach(elem => {
            elem.style.fontFamily = 'Georgia, serif';

            // Also style any child elements for consistency
            elem.querySelectorAll('a, b, strong').forEach(child => {
                child.style.fontFamily = 'Georgia, serif';
            });
        });
    }

    // Remove the transliteration that is provide with the Russian headword
    function removeHeadwordTransliteration() {
        document.querySelectorAll("span.headword-line > strong.Cyrl.headword[lang='ru']").forEach(strong => {
            // Get the bullet (the <a> element that follows the headword)
            const bullet = strong.nextElementSibling;
            if (bullet?.tagName !== "A" || !bullet.title?.includes("transliteration")) return;

            // Get text node with opening parenthesis
            const parenStart = bullet.nextSibling;
            if (!parenStart || parenStart.nodeType !== Node.TEXT_NODE) return;

            // Get the transliteration span
            const transSpan = parenStart.nextSibling;
            if (!transSpan || transSpan.tagName !== "SPAN" || !transSpan.classList.contains("headword-tr")) return;

            // Get text node with closing parenthesis
            const parenEnd = transSpan.nextSibling;

            // Clean up everything
            parenStart.textContent = parenStart.textContent.replace(/\(\s*/, "");
            if (parenEnd?.nodeType === Node.TEXT_NODE) {
                parenEnd.textContent = parenEnd.textContent.replace(/^\)\s*/, "");
            }

            bullet.remove();
            transSpan.remove();
        });
    }

    // Function to remove transliterations
    function removeTransliterations() {
        // First type: transliteration with i tag and dash before it
        try {
            const transliterations = document.querySelectorAll('i.e-transliteration.tr.Latn[lang="ru-Latn"]');
            transliterations.forEach(elem => {
                // Get the parent node
                const parent = elem.parentNode;

                if (parent) {
                    // Get the previous and next siblings as text nodes or elements
                    let previousTextNode = elem.previousSibling;

                    // Check if previous sibling contains a dash and remove only the first one
                    if (previousTextNode && previousTextNode.nodeType === Node.TEXT_NODE &&
                        previousTextNode.textContent.includes('―')) {
                        // Find the position of the dash
                        const dashIndex = previousTextNode.textContent.indexOf('―');

                        // Replace only the first dash
                        const beforeDash = previousTextNode.textContent.substring(0, dashIndex);
                        const afterDash = previousTextNode.textContent.substring(dashIndex + 1);
                        previousTextNode.textContent = beforeDash + afterDash;
                    }

                    // Now remove the transliteration element
                    parent.removeChild(elem);
                } else {
                    // Fallback if parent not found
                    elem.remove();
                }
            });
        } catch (e) {
            console.error('Error removing i transliterations:', e);
        }

        // Special parenthesis elements
        try {
            const parentheses = document.querySelectorAll('span.mention-gloss-paren.annotation-paren');
            parentheses.forEach(paren => {
                // Check if this parenthesis is adjacent to a transliteration span
                const nextSibling = paren.nextElementSibling;
                const prevSibling = paren.previousElementSibling;

                // Opening parenthesis followed by transliteration span
                if (paren.textContent === '(' &&
                    nextSibling &&
                    nextSibling.matches('span.tr.Latn[lang="ru-Latn"]')) {
                    paren.remove();
                }

                // Closing parenthesis preceded by transliteration span
                if (paren.textContent === ')' &&
                    prevSibling &&
                    prevSibling.matches('span.tr.Latn[lang="ru-Latn"]')) {
                    paren.remove();
                }
            });
        } catch (e) {
            console.error('Error handling parentheses:', e);
        }

        // Second type: span transliterations in declension tables with preceding <br>
        try {
            const spanTransliterations = document.querySelectorAll('span.tr.Latn[lang="ru-Latn"]');
            spanTransliterations.forEach(elem => {
                // Check for preceding <br>
                let prev = elem.previousElementSibling;
                if (prev && prev.tagName === 'BR') {
                    try {
                        prev.remove();
                    } catch (e) {
                        console.error('Error removing BR:', e);
                    }
                }

                // Remove the transliteration span
                try {
                    elem.remove();
                } catch (e) {
                    console.error('Error removing span transliteration:', e);
                }
            });
        } catch (e) {
            console.error('Error finding span transliterations:', e);
        }
    }

    // Function to find and click all relevant buttons
    function clickRussianDeclensionButtons() {
        // Find all NavHead divs that contain declension information
        const navHeads = document.querySelectorAll('.NavHead');

        navHeads.forEach(navHead => {
            // Check if this NavHead contains "Declension of"
            if (navHead.textContent.includes('Declension of')) {
                // Look for a span with lang="ru" and class="Cyrl" within this NavHead
                const russianWordElement = navHead.querySelector('b[lang="ru"].Cyrl, span[lang="ru"].Cyrl');

                if (russianWordElement) {
                    // Find the button/link element within this NavHead
                    const button = navHead.querySelector('.NavToggle a[role="button"]');

                    if (button && button.textContent.includes('show')) {
                        // Click the button to show the declension table
                        button.click();
                        console.log('Clicked declension button for:', russianWordElement.textContent.trim());
                    }
                }
            }
        });
    }

    // Apply immediately
    applyFontStyles();
    removeHeadwordTransliteration();
    removeTransliterations();
    clickRussianDeclensionButtons();

    // Watch for dynamic changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyFontStyles();
                removeHeadwordTransliteration();
                removeTransliterations();
                clickRussianDeclensionButtons();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();