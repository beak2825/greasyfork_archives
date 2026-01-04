// ==UserScript==
// @name         ATLAS Learning Aid
// @namespace    http://localhost
// @version      3.0
// @description  Show answers to ATLAS multiple choice quizzes!
// @author       Jonathan von Kelaita
// @match        https://atlaslms.apple.com/learning/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/384243/ATLAS%20Learning%20Aid.user.js
// @updateURL https://update.greasyfork.org/scripts/384243/ATLAS%20Learning%20Aid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("🟢 ATLAS Learning Aid v3.0 started");

    // ────────────────────────────────────────────────────────────────────────────
    // (1) highlightAll(ctx):
    //
    //      • Finds every .quiz-section in ctx.
    //      • Appends any “feedback” text exactly once.
    //      • Finds each element with data-choice="1":
    //          – Locates the closest <label> wrapping that choice
    //          – Inlines “background-color: #00FF00 !important” onto that <label>
    //            (this ensures ATLAS’s own CSS cannot override it)
    //          – “Clicks” the <input> inside that <label> so ATLAS immediately
    //            enables the Next button
    //          – Adds .active to the surrounding .quiz-section
    function highlightAll(ctx) {
        const sections = ctx.querySelectorAll(".quiz-section");
        if (!sections || sections.length === 0) return;

        console.log(`🔧 [highlightAll] Found ${sections.length} quiz-section(s) in ${(ctx === document) ? "main document" : "nested frame"}`);

        sections.forEach((sect, idx) => {
            // — (1A) Append any <div class="feedback"> exactly once
            sect.querySelectorAll('[class^="feedback"]').forEach(fb => {
                const maybeLabel = fb.previousSibling && fb.previousSibling.previousSibling;
                if (maybeLabel && maybeLabel.innerText.indexOf(fb.innerText) < 0) {
                    maybeLabel.innerHTML += ` <em>(${fb.innerText})</em>`;
                    console.log(`   ‣ [Feedback] Appended: “${fb.innerText}”`);
                }
            });

            // — (1B) For every correct choice (data-choice="1"), style only its <label>
            sect.querySelectorAll('[data-choice="1"]').forEach(choice => {
                // (1B-i) Find the <label> that wraps this choice
                const lbl = choice.closest("label");
                if (lbl) {
                    // Force inline green background on that <label> only:
                    lbl.style.setProperty("background-color", "#00FF00", "important");
                    console.log(`   ‣ [Highlight] Styled <label> for data-choice="1"`);
                } else {
                    console.warn("⚠️ [Highlight] No <label> found for data-choice=\"1\"", choice);
                }

                // (1B-ii) “Click” the <input> inside the same <label> so ATLAS’s JS knows it’s been answered
                let inputElem = null;
                if (lbl) {
                    // Assume input[type=radio] or type=checkbox is a child of that <label>
                    inputElem = lbl.querySelector("input[type='radio'], input[type='checkbox']");
                } else {
                    // Fallback: maybe the DOM is unusual; try parent search
                    inputElem = choice.parentNode.querySelector("input[type='radio'], input[type='checkbox']");
                }
                if (inputElem) {
                    if (!inputElem.checked) {
                        inputElem.click();
                        console.log(`   ‣ [Correct] input.click() fired for data-choice="1"`);
                    } else {
                        console.log(`   ‣ [Correct] input was already checked; skipping click()`);
                    }
                }

                // (1B-iii) Mark this .quiz-section as “active” so ATLAS’s built-in logic
                //              treats it as answered
                if (!sect.classList.contains("active")) {
                    sect.classList.add("active");
                    console.log(`   ‣ [Correct] Marked section #${idx + 1} as .active`);
                }
            });
        });
    }


    // ────────────────────────────────────────────────────────────────────────────
    // (2) pollAndHighlight():
    //
    //      Every POLL_INTERVAL_MS, run highlightAll(document) for any “direct embed” quizzes,
    //      then look for #iframe_container→frame/iframe→its document and run highlightAll(innerDoc)
    //      so that “nested iframes” also get re-scanned. This handles Angular in-page quizzes
    //      as well as legacy iframe quizzes.
    const POLL_INTERVAL_MS = 750;
    let pollHandle = null;

    function pollAndHighlight() {
        // (A) Direct-embed context → main document
        highlightAll(document);

        // (B) Nested-iframe context → #iframe_container → internal <frame> or <iframe>
        const outerIframe = document.querySelector("#iframe_container");
        if (!outerIframe) return;

        const outerDoc = outerIframe.contentDocument || outerIframe.contentWindow.document;
        if (!outerDoc) return;

        // ATLAS often places a <frame> inside #iframe_container, so try that first:
        let nested = outerDoc.querySelector("frame");
        // Fallback: maybe <iframe class="quiz-container"> or any <iframe>
        if (!nested) {
            nested = outerDoc.querySelector("iframe.quiz-container, iframe");
        }
        if (!nested) return;

        const innerDoc = nested.contentDocument || nested.contentWindow.document;
        if (!innerDoc) return;

        highlightAll(innerDoc);
    }

    function startPolling() {
        if (pollHandle) return;
        pollHandle = setInterval(pollAndHighlight, POLL_INTERVAL_MS);
        console.log(`🔍 [Poll] Started ${POLL_INTERVAL_MS} ms poll (main-doc & nested-iframe)`);
    }

    function stopPolling() {
        if (pollHandle) {
            clearInterval(pollHandle);
            pollHandle = null;
            console.log("⏹ [Poll] Stopped polling");
        }
    }


    // ────────────────────────────────────────────────────────────────────────────
    // (3) watchOuterIframeReload():
    //
    //      If ATLAS does a hard-reload of <iframe id="iframe_container"> when you click “Next”,
    //      we catch that “load” event, stop & restart our poll, and within 750 ms we re-apply
    //      green+click in the newly-loaded HTML.
    function watchOuterIframeReload() {
        const outer = document.querySelector("#iframe_container");
        if (!outer) {
            // If the iframe isn’t on screen yet, retry in 500 ms
            setTimeout(watchOuterIframeReload, 500);
            return;
        }
        outer.addEventListener("load", () => {
            console.log("🔄 [Iframe] Detected reload of #iframe_container → restarting poll");
            stopPolling();
            startPolling();
        }, true);
        console.log("🔍 [watchOuterIframeReload] Listening for #iframe_container “load” events");
    }


    // ────────────────────────────────────────────────────────────────────────────
    // (4) Kick everything off:
    startPolling();
    watchOuterIframeReload();

})();