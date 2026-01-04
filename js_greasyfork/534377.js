// ==UserScript==
// @name         MaruMori Anki Mode (with buttons)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  In ANKI mode, review cards on marumori.io without typing: press Enter to reveal the answer, then press "o" for correct or "p" for wrong.
// @author       Matskye
// @author       MIrinkov
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/study-lists/reviews*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534377/MaruMori%20Anki%20Mode%20%28with%20buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534377/MaruMori%20Anki%20Mode%20%28with%20buttons%29.meta.js
// ==/UserScript==

/*

THIS IS JUST A COPY OF Matskye's MaruMori Anki Mode found here: https://greasyfork.org/en/scripts/525983-marumori-anki-mode
My changes are:
- add buttons at the bottom of the screen, so that this userscript can be used on mobile where an input is needed to use hotkeys
- limit the URL this script applies to to https://marumori.io/study-lists/reviews
*/

(function () {
    'use strict';
    const ANKI_EVENT = {
      SHOW_ANSWER: "SHOW_ANSWER",
      ANSWER_CORRECT: "ANSWER_CORRECT",
      ANSWER_WRONG: "ANSWER_WRONG",
    };
  
    // ── Inject CSS to Hide the Input Field and to style buttons ──
    var style = document.createElement('style');
    style.innerHTML = `
        /* Hide the input field */
        input.pan_input { position: absolute !important; left: -9999px !important; }
        /* Anki button styles */
        div.anki-buttons { position: fixed; bottom: 2rem; display: flex; width: 100%; justify-content: center; gap: 2rem; }
        div.anki-buttons button { padding: 1rem 2rem; color: white; font-weight: 700; }
        /* Picked colors by random tweaking, this is zero-effort, sorry */
        div.anki-buttons #${ANKI_EVENT.SHOW_ANSWER} { background-color: blueviolet; }
        div.anki-buttons #${ANKI_EVENT.ANSWER_CORRECT} { background-color: #5b5; }
        div.anki-buttons #${ANKI_EVENT.ANSWER_WRONG} { background-color: #b55; }
      }`;
    document.head.appendChild(style);
  
    const showAnswerBtn = document.createElement('button');
    showAnswerBtn.textContent = 'Show Answer';
    showAnswerBtn.id = ANKI_EVENT.SHOW_ANSWER;
  
    const answerCorrectBtn = document.createElement('button');
    answerCorrectBtn.textContent = 'Correct';
    answerCorrectBtn.id = ANKI_EVENT.ANSWER_CORRECT;
  
    const answerWrongBtn = document.createElement('button');
    answerWrongBtn.textContent = 'Wrong';
    answerWrongBtn.id = ANKI_EVENT.ANSWER_WRONG;
  
    const ankiButtonContainer = document.createElement('div');
    ankiButtonContainer.className = 'anki-buttons';
    ankiButtonContainer.appendChild(showAnswerBtn);
  
    document.body.appendChild(ankiButtonContainer);
  
    /**
     * Flips which ANKI buttons are visible.
     * We either show the "show answer" button,
     * or the "correct" and "wrong" buttons.
     */
    function toggleShownAnkiButtons() {
      // if we're only showing the "show answers" button, switch to rating buttons
      if (ankiButtonContainer.children.length === 1) {
        ankiButtonContainer.replaceChildren(answerWrongBtn, answerCorrectBtn);
      } else {
        ankiButtonContainer.replaceChildren(showAnswerBtn);
      }
    }
  
    // ── Configuration & Mode Detection ──
    // Always enable ANKI mode in this version.
    let ankiMode = true;
    console.log("[ANKI Mode] ANKI mode enabled (always).");
  
    // Global flag to suppress handling of synthetic events.
    let simulating = false;
  
    // ── Utility Functions ──
    function normalizeMeaning(text) {
      if (!text) return "";
      let s = text.toLowerCase().trim();
      s = s.replace(/-/g, " ");
      s = s.replace(/['’]/g, ""); // Remove both straight and typographic apostrophes
      s = s.replace(/\s+/g, " ");
      s = s.replace(/^[.,;:!?]+|[.,;:!?]+$/g, "");
      return s;
    }
    function normalizeAnswerVariants(text) {
      text = text.trim();
      let v1 = normalizeMeaning(text);
      let v2 = normalizeMeaning(text.replace(/\s*\([^)]*\)/g, ""));
      return Array.from(new Set([v1, v2]));
    }
    // Simulate an Enter key press (dispatch both keydown and keyup events)
    function simulateEnter(el) {
      simulating = true;
      let evtDown = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      let evtUp = new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      el.dispatchEvent(evtDown);
      el.dispatchEvent(evtUp);
      setTimeout(() => { simulating = false; }, 50);
    }
    // Instead of a second Enter, click the next-arrow button.
    function clickNextArrow() {
      let nextArrow = document.querySelector("button.next-arrow");
      if (nextArrow) {
        nextArrow.click();
        console.log("[ANKI Mode] Next arrow clicked.");
      } else {
        console.log("[ANKI Mode] Next arrow button not found.");
      }
    }
  
    // ── Accepted Answer Extraction ──
    function getAcceptedAnswer(fieldType) {
      let wrappers = document.querySelectorAll('.full_wrap .left_small .item_wrapper');
      if (fieldType === 'reading') {
        // Try for "reading" header first.
        for (let wrapper of wrappers) {
          let header = wrapper.querySelector('h4');
          if (!header) continue;
          if (header.textContent.trim().toLowerCase() === 'reading') {
            let span = wrapper.querySelector('span.primary') || wrapper.querySelector('span.reading');
            if (span && span.textContent.trim()) {
              console.log('[ANKI Mode] Found accepted reading (vocabulary):', span.textContent.trim());
              return span.textContent.trim();
            }
          }
        }
        // Then try "kunyomi".
        for (let wrapper of wrappers) {
          let header = wrapper.querySelector('h4');
          if (!header) continue;
          if (header.textContent.trim().toLowerCase() === 'kunyomi') {
            let span = wrapper.querySelector('span.reading');
            if (span && span.textContent.trim()) {
              console.log('[ANKI Mode] Found accepted reading (kunyomi):', span.textContent.trim());
              return span.textContent.trim();
            }
          }
        }
        // Finally, try "onyomi".
        for (let wrapper of wrappers) {
          let header = wrapper.querySelector('h4');
          if (!header) continue;
          if (header.textContent.trim().toLowerCase() === 'onyomi') {
            let span = wrapper.querySelector('span.reading');
            if (span && span.textContent.trim()) {
              console.log('[ANKI Mode] Found accepted reading (onyomi):', span.textContent.trim());
              return span.textContent.trim();
            }
          }
        }
      } else if (fieldType === 'meaning') {
        // For meaning, check for wrappers with header "meaning" or "meanings"
        for (let wrapper of wrappers) {
          let header = wrapper.querySelector('h4');
          if (!header) continue;
          let ht = header.textContent.trim().toLowerCase();
          if (ht === 'meaning' || ht === 'meanings') {
            let spans = wrapper.querySelectorAll('span.meaning');
            if (spans && spans.length > 0) {
              // Instead of joining all spans, return the first one.
              let candidate = spans[0].textContent.trim();
              console.log('[ANKI Mode] Found accepted meaning (first candidate):', candidate);
              return candidate;
            }
          }
        }
        // Fallback: try to find a paragraph with class "spoiler" in .left_small
        let p = document.querySelector('.left_small p.spoiler');
        if (p) {
          let spans = p.querySelectorAll('span.meaning');
          if (spans && spans.length > 0) {
            let candidate = spans[0].textContent.trim();
            console.log('[ANKI Mode] Found accepted meaning (fallback, first candidate):', candidate);
            return candidate;
          }
        }
      }
      console.log('[ANKI Mode] Accepted answer not found for field:', fieldType);
      return "";
    }
    function isExactMatch(submitted, accepted, fieldType) {
      if (!submitted || !accepted) return false;
      if (fieldType === 'reading') {
        let candidates = accepted.split(";").map(s => s.trim()).filter(Boolean);
        console.log('[ANKI Mode] Reading candidates:', candidates);
        return candidates.includes(submitted);
      } else if (fieldType === 'meaning') {
        let candidates = (accepted.includes(";") || accepted.includes("\n"))
          ? accepted.split(/;|\n/).map(s => s.trim()).filter(Boolean)
          : [accepted];
        console.log('[ANKI Mode] Raw meaning candidates:', candidates);
        let normSubmitted = normalizeMeaning(submitted);
        for (let candidate of candidates) {
          let variants = normalizeAnswerVariants(candidate);
          console.log('[ANKI Mode] Candidate variants for "' + candidate + '":', variants);
          if (variants.includes(normSubmitted)) return true;
        }
        return false;
      }
      return false;
    }
  
    // ── Global Variables for ANKI Mode ──
    let waitingForRating = false; // true when answer is revealed and waiting for rating ("o" or "p")
    let lastFieldType = "";       // "reading" or "meaning"
    let acceptedAnswer = "";      // the correct answer as extracted from the card
  
    /**
     * Listens for keyboard button presses.
     * Press Enter on quesion screen to show the answer.
     * Then press O for correct, P for wrong.
     */
    function originalHotkeyListener(kbEvent) {
      // not sure of the significance of this, but it was included in the original handler
      kbEvent.preventDefault();
  
      if (kbEvent.code === "KeyO") {
        return ankiEventListener(ANKI_EVENT.ANSWER_CORRECT);
      }
      if (kbEvent.code === "KeyP") {
        return ankiEventListener(ANKI_EVENT.ANSWER_WRONG);
      }
      if (kbEvent.code === "Enter") {
        return ankiEventListener(ANKI_EVENT.SHOW_ANSWER);
      }
      console.warn(`Unexpected key press: code=${kbEvent.code}`);
    }
    /**
     * Listens for button clicks.
     * Expects the anki buttons created by this script to have IDs set to ANKI_EVENT values.
     */
    function buttonClickListener(clickEvent) {
      const maybe_event = clickEvent.target.id;
      console.log('maybe_event', maybe_event);
      if (!(maybe_event in ANKI_EVENT)) {
        // some non-anki button was clicked, ignore this
        console.log('Ignoring click on non-ANKI button', clickEvent.target);
        return;
      }
      toggleShownAnkiButtons();
      return ankiEventListener(clickEvent.target.id);
    }
  
    // ── ANKI Mode Key Listener ──
    function ankiEventListener(ankiEvent) {
      if (simulating) return;
      let input = document.querySelector('input.pan_input');
      if (!input) return;
      // If not waiting for rating, pressing Enter reveals the answer.
      if (!waitingForRating && ankiEvent === ANKI_EVENT.SHOW_ANSWER) {
        if (!input.disabled) {
          input.focus();
          input.value = "nononono";  // dummy wrong answer
          simulateEnter(input);      // submit dummy answer to reveal card
          waitingForRating = true;   // now wait for rating
        }
      } else if (waitingForRating) {
        // While waiting for rating, use "o" for correct and "p" for wrong.
        if (ankiEvent === ANKI_EVENT.ANSWER_CORRECT) {
          acceptedAnswer = getAcceptedAnswer(lastFieldType);
          // Mark as correct:
          setTimeout(() => {
            input.value = ""; // clear dummy answer
            // Simulate backspace events to mimic manual clearing.
            const backspaceDown = new KeyboardEvent("keydown", {
              key: "Backspace",
              code: "Backspace",
              keyCode: 8,
              which: 8,
              bubbles: true
            });
            const backspaceUp = new KeyboardEvent("keyup", {
              key: "Backspace",
              code: "Backspace",
              keyCode: 8,
              which: 8,
              bubbles: true
            });
            input.dispatchEvent(backspaceDown);
            input.dispatchEvent(backspaceUp);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            setTimeout(() => {
              input.value = acceptedAnswer; // enter correct answer
              setTimeout(() => {
                simulateEnter(input); // first Enter to check
                setTimeout(() => {
                  // Instead of a second Enter, click the next arrow.
                  clickNextArrow();
                  console.log("[ANKI Mode] Marked as CORRECT. Submitted the correct answer.");
                }, 200);
              }, 20);
            }, 20);
          }, 20);
        } else if (ankiEvent === ANKI_EVENT.ANSWER_WRONG) {
          // Mark as wrong: after a 200ms delay, click the next arrow.
          setTimeout(() => {
            clickNextArrow();
            console.log("[ANKI Mode] Marked as WRONG.");
          }, 200);
        }
        waitingForRating = false;
      }
    }
  
    // ── Mutation Observer for ANKI Mode ──
    function ankiMutationCallback(mutations) {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "disabled") {
          let input = mutation.target;
          if (input && input.matches("input.pan_input") && input.disabled) {
            let placeholder = input.getAttribute("placeholder") || "";
            if (placeholder.includes("読み方") || placeholder.toLowerCase().includes("reading")) {
              lastFieldType = "reading";
            } else if (placeholder.toLowerCase().includes("meaning")) {
              lastFieldType = "meaning";
            } else {
              lastFieldType = "";
            }
            console.log("[ANKI Mode] Card processed. Field type:", lastFieldType);
          }
        }
      });
    }
  
    // ── Initialization for ANKI Mode ──
    function initAnkiMode() {
      console.log("[ANKI Mode] Initializing ANKI mode...");
      document.addEventListener("keydown", originalHotkeyListener, true);
      document.addEventListener("click", buttonClickListener, true);
      let observer = new MutationObserver(ankiMutationCallback);
      observer.observe(document.body, { attributes: true, subtree: true });
    }
  
    // Always enable ANKI mode.
    initAnkiMode();
    console.log("[ANKI Mode] ANKI mode is active.");
  
  })();