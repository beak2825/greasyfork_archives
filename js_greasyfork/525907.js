// ==UserScript==
// @name         Marumori Auto-Advance on Exact Match
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  When your answer exactly matches the accepted answer on marumori.io, automatically click the "next arrow" button to advance.
// @author       Matskye
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525907/Marumori%20Auto-Advance%20on%20Exact%20Match.user.js
// @updateURL https://update.greasyfork.org/scripts/525907/Marumori%20Auto-Advance%20on%20Exact%20Match.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ── URL Scope: Only apply on the reviews and lessons pages ──
    function shouldApply() {
        return location.href.startsWith("https://marumori.io/study-lists/reviews") ||
               location.href.startsWith("https://marumori.io/study-lists/lessons");
    }

    // ── Normalization Functions ──
    // normalizeMeaning: Lowercases, trims, replaces hyphens with spaces,
    // removes both straight (') and typographic (’) apostrophes,
    // collapses multiple spaces, and removes any leading/trailing punctuation.
    function normalizeMeaning(text) {
        if (!text) return "";
        let s = text.toLowerCase().trim();
        s = s.replace(/-/g, " ");
        s = s.replace(/['’]/g, ""); // Remove both types of apostrophes
        s = s.replace(/\s+/g, " ");
        s = s.replace(/^[.,;:!?]+|[.,;:!?]+$/g, "");
        return s;
    }
    // normalizeAnswerVariants: Returns an array of normalized variants:
    // one variant is the normalized text, and one is the normalized text with any parenthesized content removed.
    function normalizeAnswerVariants(text) {
        text = text.trim();
        let v1 = normalizeMeaning(text);
        let v2 = normalizeMeaning(text.replace(/\s*\([^)]*\)/g, ""));
        return Array.from(new Set([v1, v2]));
    }

    // ── Accepted Answer Extraction ──
    // For "reading": searches wrappers with header "reading", "kunyomi", or "onyomi"
    // and collects all text from spans with class "reading" (or span.primary for vocabulary),
    // joining them with semicolons.
    // For "meaning": searches wrappers with header "meaning" or "meanings" and collects
    // all text from spans with class "meaning". (A fallback looks for a paragraph with class "spoiler" if needed.)
    function getAcceptedAnswer(fieldType) {
        let wrappers = document.querySelectorAll('.full_wrap .left_small .item_wrapper');
        if (fieldType === 'reading') {
            let readings = [];
            wrappers.forEach(wrapper => {
                let header = wrapper.querySelector('h4');
                if (!header) return;
                let headerText = header.textContent.trim().toLowerCase();
                if (headerText === 'reading') {
                    let span = wrapper.querySelector('span.primary');
                    if (span && span.textContent.trim()) {
                        readings.push(span.textContent.trim());
                    } else {
                        let spans = wrapper.querySelectorAll('span.reading');
                        spans.forEach(s => {
                            if (s.textContent.trim()) readings.push(s.textContent.trim());
                        });
                    }
                } else if (headerText === 'kunyomi' || headerText === 'onyomi') {
                    let spans = wrapper.querySelectorAll('span.reading');
                    spans.forEach(s => {
                        if (s.textContent.trim()) readings.push(s.textContent.trim());
                    });
                }
            });
            if (readings.length > 0) {
                let joined = readings.join("; ");
                console.log('[AutoAdvance] Found accepted readings:', joined);
                return joined;
            }
        } else if (fieldType === 'meaning') {
            // First, try wrappers with header "meaning" or "meanings"
            for (let wrapper of wrappers) {
                let header = wrapper.querySelector('h4');
                if (!header) continue;
                let headerText = header.textContent.trim().toLowerCase();
                if (headerText === 'meaning' || headerText === 'meanings') {
                    let meaningSpans = wrapper.querySelectorAll('span.meaning');
                    if (meaningSpans && meaningSpans.length > 0) {
                        let meanings = Array.from(meaningSpans).map(span => span.textContent.trim());
                        let joined = meanings.join("; ");
                        console.log('[AutoAdvance] Found accepted meaning (from spans):', joined);
                        return joined;
                    }
                }
            }
            // Fallback: try to find a paragraph with class "spoiler" inside .left_small
            let p = document.querySelector('.left_small p.spoiler');
            if (p) {
                let spans = p.querySelectorAll('span.meaning');
                if (spans && spans.length > 0) {
                    let meanings = Array.from(spans).map(span => span.textContent.trim());
                    let joined = meanings.join("; ");
                    console.log('[AutoAdvance] Found accepted meaning (fallback):', joined);
                    return joined;
                }
            }
        }
        console.log('[AutoAdvance] Accepted answer not found for field:', fieldType);
        return null;
    }

    // ── Exact Match Checking ──
    // For "reading": splits the accepted readings by semicolon and checks for an exact match.
    // For "meaning": if the accepted answer contains a semicolon or newline, it is split; otherwise,
    // the entire string is one candidate. Then each candidate is normalized (and variants generated)
    // and compared to the normalized submitted answer.
    function isExactMatch(submitted, accepted, fieldType) {
        if (!submitted || !accepted) return false;
        if (fieldType === 'reading') {
            let candidates = accepted.split(";").map(s => s.trim()).filter(Boolean);
            console.log('[AutoAdvance] Reading candidates:', candidates);
            return candidates.includes(submitted);
        } else if (fieldType === 'meaning') {
            let candidates = (accepted.includes(";") || accepted.includes("\n"))
                ? accepted.split(/;|\n/).map(s => s.trim()).filter(Boolean)
                : [accepted];
            console.log('[AutoAdvance] Raw meaning candidates:', candidates);
            let normSubmitted = normalizeMeaning(submitted);
            for (let candidate of candidates) {
                let variants = normalizeAnswerVariants(candidate);
                console.log('[AutoAdvance] Candidate variants for "' + candidate + '":', variants);
                if (variants.includes(normSubmitted)) return true;
            }
            return false;
        }
        return false;
    }

    // ── Global Variables ──
    let lastSubmittedAnswer = '';
    let lastFieldType = '';

    // ── Key Listener ──
    function keyListener(e) {
        if (e.key === 'Enter') {
            let target = e.target;
            if (target && target.matches('input.pan_input')) {
                if (!target.disabled) {
                    lastSubmittedAnswer = target.value.trim();
                    let placeholder = target.getAttribute('placeholder') || '';
                    if (placeholder.includes('読み方') || placeholder.toLowerCase().includes('reading')) {
                        lastFieldType = 'reading';
                    } else if (placeholder.toLowerCase().includes('meaning')) {
                        lastFieldType = 'meaning';
                    } else {
                        lastFieldType = '';
                    }
                    console.log('[AutoAdvance] Captured answer:', lastSubmittedAnswer, 'for field:', lastFieldType);
                }
            }
        }
    }

    // ── Mutation Observer Callback ──
    function mutationCallback(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                let target = mutation.target;
                if (target && target.matches('input.pan_input') && target.disabled) {
                    console.log('[AutoAdvance] Detected disabled input.');
                    setTimeout(() => {
                        let accepted = getAcceptedAnswer(lastFieldType);
                        console.log('[AutoAdvance] Submitted:', lastSubmittedAnswer, '| Accepted:', accepted);
                        if (accepted && isExactMatch(lastSubmittedAnswer, accepted, lastFieldType)) {
                            console.log('[AutoAdvance] Exact match found. Clicking next arrow...');
                            let nextArrow = document.querySelector('button.next-arrow');
                            if (nextArrow) {
                                nextArrow.click();
                                console.log('[AutoAdvance] Next arrow clicked.');
                            } else {
                                console.log('[AutoAdvance] Next arrow button not found.');
                            }
                        } else {
                            console.log('[AutoAdvance] Not an exact match or accepted answer missing.');
                        }
                        lastSubmittedAnswer = '';
                        lastFieldType = '';
                    }, 50);
                }
            }
        });
    }

    // ── Initialization and Cleanup ──
    let observer = null;
    let autoAdvanceActive = false;

    function initAutoAdvance() {
        if (autoAdvanceActive) return;
        autoAdvanceActive = true;
        document.addEventListener('keydown', keyListener, true);
        observer = new MutationObserver(mutationCallback);
        observer.observe(document.body, { attributes: true, subtree: true });
        console.log('[AutoAdvance] Auto-advance enabled on', location.href);
    }

    function cleanupAutoAdvance() {
        if (!autoAdvanceActive) return;
        autoAdvanceActive = false;
        document.removeEventListener('keydown', keyListener, true);
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        console.log('[AutoAdvance] Auto-advance disabled on', location.href);
    }

    function checkURL() {
        if (shouldApply()) {
            initAutoAdvance();
        } else {
            cleanupAutoAdvance();
        }
    }

    // ── URL Change Handling for SPA ──
    const _pushState = history.pushState;
    history.pushState = function() {
        _pushState.apply(history, arguments);
        setTimeout(checkURL, 100);
    };
    const _replaceState = history.replaceState;
    history.replaceState = function() {
        _replaceState.apply(history, arguments);
        setTimeout(checkURL, 100);
    };
    window.addEventListener('popstate', function() {
        setTimeout(checkURL, 100);
    });
    checkURL();
    setInterval(checkURL, 2000);

})();