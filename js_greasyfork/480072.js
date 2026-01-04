// ==UserScript==
// @name         Friendlier ChatGPT Prompt Box
// @description  Allows you to just start typing with unfocused prompt box, scroll the conversation from the prompt box, quote pasted text, and more. Adds free space at the end of the conversation, so you can prescroll before text generation. Configurable via userscript storage.
//
// @namespace    http://tampermonkey.net/
// @version      2023.11.16
//
// @author       Henrik Hank
// @license      MIT (https://opensource.org/license/mit/)
//
// @match        *://chat.openai.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480072/Friendlier%20ChatGPT%20Prompt%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/480072/Friendlier%20ChatGPT%20Prompt%20Box.meta.js
// ==/UserScript==

void function userscript() {
    "use strict";

    let scrollAmountPx;  // In px.
    let scrollAmountMultiplicator;
    let scrollContainerEndSpaceVH;  // In `vh` CSS units.
    let scrollContainerEndSpaceHexColor;
    let lastPrompt = "";
    let hasJustPressedCtrlV = false;
    let lastSelectionStart = 0;

    const SCROLL_CONTAINER_CSS_SELECTOR = "main > [role='presentation'] > .overflow-hidden > .h-full > [class^='react-scroll-to-bottom--']";
    const PROMPT_BOX_ID = "prompt-textarea";


    void function main() {
        // Retrieve user settings.
        scrollAmountPx = GM_getValue("scrollAmountCSSPx");
        if (! Number.isSafeInteger(scrollAmountPx)) {
            scrollAmountPx = 90;
        }

        scrollAmountMultiplicator = GM_getValue("scrollAmountMultiplicator");
        if (! Number.isFinite(scrollAmountMultiplicator)) {
            scrollAmountMultiplicator = 4;
        }

        scrollContainerEndSpaceVH = GM_getValue("conversationExtraEndSpaceViewportPct");
        if (! Number.isSafeInteger(scrollContainerEndSpaceVH) || scrollContainerEndSpaceVH < 0 || scrollContainerEndSpaceVH > 100) {
            scrollContainerEndSpaceVH = 65;
        }

        scrollContainerEndSpaceHexColor = GM_getValue("conversationExtraEndSpaceRGBOrRGBAHexColor");
        const match = (scrollContainerEndSpaceHexColor ?? "").toString().match(/^#?([0-9a-f]{6})([0-9a-f]{2})?$/i);
        if (match != null) {
            scrollContainerEndSpaceHexColor = `#${match[1]}${match[2] ?? "ff"}`;
        } else {
            scrollContainerEndSpaceHexColor = "#80800011";
        }

        // Make settings available for editing by persisting them.
        GM_setValue("scrollAmountCSSPx", scrollAmountPx);
        GM_setValue("scrollAmountMultiplicator", scrollAmountMultiplicator);
        GM_setValue("conversationExtraEndSpaceViewportPct", scrollContainerEndSpaceVH);
        GM_setValue("conversationExtraEndSpaceRGBOrRGBAHexColor", scrollContainerEndSpaceHexColor);

        // CSS.
        GM_addStyle(`
            ${SCROLL_CONTAINER_CSS_SELECTOR} > div::after {
                content: "";
                height: ${scrollContainerEndSpaceVH}vh;
                background-color: ${scrollContainerEndSpaceHexColor};
            }
        `);

        // Event handlers (on body, because DOM will be patched).
        document.body.addEventListener("keydown", onBodyKeyDown);
        document.body.addEventListener("input", onBodyInput);
        GM_registerMenuCommand("Copy Last Prompt (Empty After Reload)", onCopyLastPromptCommand);
    }.call();


    function onBodyKeyDown(event) {
        // Reject events purely about modifier keys.
        if (event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT || event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
            return;
        }

        // Normalize modifiers.
        let modifiers = "";
        if (event.shiftKey) {
            modifiers += "Shift";
        }
        if (event.ctrlKey) {
            modifiers += "Ctrl";
        }
        if (event.altKey) {
            modifiers += "Alt";
        }
        if (event.metaKey) {
            modifiers += "Meta";
        }

        const keyCombo = `${modifiers}+${event.key}`;

        // With focused prompt box.
        if (document.activeElement.id === PROMPT_BOX_ID) {
            const promptBox = document.activeElement;

            // Edit selection, just pasted text or current line.
            if (keyCombo === "Ctrl+q" || keyCombo === "Ctrl+b") {
                const origCursorIndex = promptBox.selectionDirection === "backward" ? promptBox.selectionStart : promptBox.selectionEnd;

                const hasSelection = promptBox.selectionStart !== promptBox.selectionEnd;
                if (! hasSelection) {
                    if (hasJustPressedCtrlV) {
                        // Select pasted text.
                        promptBox.setSelectionRange(lastSelectionStart, promptBox.selectionStart);
                    }
                }

                // Extend selection to full start and end line.
                let selectionStart = promptBox.selectionStart;
                while (selectionStart > 0 && promptBox.value[selectionStart - 1] !== "\n") {
                    selectionStart--;
                }

                let selectionEnd = promptBox.selectionEnd;
                while (selectionEnd < promptBox.value.length - 1 && promptBox.value[selectionEnd - 1] !== "\n") {
                    selectionEnd++;
                }

                promptBox.setSelectionRange(selectionStart, selectionEnd);

                // Quote.
                if (keyCombo === "Ctrl+q") {
                    editSelection(promptBox, origCursorIndex, { forLine: (line) => {
                        if (line.length === 0) {
                            // Save AI tokens.
                            return [ ">", 1 ];
                        } else {
                            return [ "> " + line, 2 ];
                        }
                    } });
                }

                // Make code block.
                else if (keyCombo === "Ctrl+b") {
                    editSelection(promptBox, origCursorIndex, { forSelection: (selection) => {
                        return [ "```\n" + selection.replace(/(?=\n$|$)/, "\n```"), 4 ];
                    } });
                }

                notifyAboutInput(promptBox);
                event.preventDefault();
            }

            // Scroll with focused prompt box.
            else {
                if (
                    (promptBox.value === "" || event.ctrlKey) &&
                    (event.key === "ArrowUp" || event.key === "ArrowDown")
                ) {
                    const scrollContainer = document.querySelector(SCROLL_CONTAINER_CSS_SELECTOR);

                    const amount = scrollAmountPx * (event.shiftKey ? scrollAmountMultiplicator : 1);
                    scrollContainer?.scrollBy({
                        left: 0,
                        top: event.key === "ArrowUp" ? -amount : amount,
                        behavior: "smooth",
                    });

                    event.preventDefault();
                }
            }

            //
            hasJustPressedCtrlV = keyCombo === "Ctrl+v";
            lastSelectionStart = promptBox.selectionStart;
        }

        // With unfocused prompt box.
        else {
            // Focus prompt box.
            if (keyCombo === "Ctrl+p") {
                document.getElementById(PROMPT_BOX_ID)?.focus();
                event.preventDefault();
            }

            // Start typing into prompt box while still unfocused.
            else {
                const hasDialog = document.querySelector("[role='dialog'][data-state='open']") != null;
                const otherTextboxFocused = [ "INPUT" /*renaming convo*/, "TEXTAREA" /*editing prev. msg.*/ ].includes(document.activeElement.tagName);
                const hasOnlyAllowedModifiers = modifiers === "" || modifiers === "Shift";

                if (! hasDialog && ! otherTextboxFocused && hasOnlyAllowedModifiers) {
                    const promptBox = document.getElementById(PROMPT_BOX_ID);
                    let acted = false;

                    if (
                        /^[ \p{Letter}\p{Number}\p{Punctuation}\p{Symbol}]$/ui.test(event.key) &&
                        ! (event.key === " " && document.activeElement.tagName === "BUTTON")
                    ) {
                        promptBox.setRangeText(event.key, promptBox.selectionStart, promptBox.selectionEnd, "end");
                        acted = true;
                    } else if (event.key === "Backspace") {
                        if (promptBox.selectionStart === promptBox.selectionEnd) {
                            const start = Math.max(promptBox.selectionStart - 1, 0);
                            promptBox.setRangeText("", start, promptBox.selectionEnd, "end");
                        } else {
                            promptBox.setRangeText("", promptBox.selectionStart, promptBox.selectionEnd, "end");
                        }
                        acted = true;
                    }

                    if (acted) {
                        promptBox.focus();
                        notifyAboutInput(promptBox);
                        event.preventDefault();
                    }
                }
            }

            //
            hasJustPressedCtrlV = false;
        }
    }


    function onBodyInput(event) {
        if (event.target.id === PROMPT_BOX_ID) {
            lastPrompt = event.target.value;
        }
    }


    function onCopyLastPromptCommand() {
        GM_setClipboard(lastPrompt, "text");
    }


    function editSelection(textarea, cursorIndex, { forLine, forSelection }) {
        const origSelectionStart = textarea.selectionStart;
        const origSelectionEnd = textarea.selectionEnd;
        let selection = textarea.value.substring(origSelectionStart, origSelectionEnd);
        const isCursorAtEnd = cursorIndex === origSelectionEnd;
        let cursorAdvancement;

        if (forLine != null) {
            const lines = selection.split("\n");

            const origCursorIndex = cursorIndex;
            let origLineStartIndex = origSelectionStart;

            const numLines = lines.at(-1) === "" ? lines.length - 1 : lines.length;
            for (let i = 0; i < numLines; i++) {
                const origLine = lines[i];
                [lines[i], cursorAdvancement] = forLine(origLine);
                if (origCursorIndex > origLineStartIndex) {
                    cursorIndex += cursorAdvancement;
                }
                origLineStartIndex += origLine.length + 1;
            }

            selection = lines.join("\n");
        }

        if (forSelection != null) {
            [selection, cursorAdvancement] = forSelection(selection);
            cursorIndex += cursorAdvancement;
        }

        textarea.setRangeText(selection, origSelectionStart, origSelectionEnd);

        if (isCursorAtEnd) {
            cursorIndex = origSelectionStart + selection.length;
        }
        textarea.setSelectionRange(cursorIndex, cursorIndex);
    }


    /**
     * Make official ChatGPT code save the current prompt box contents. Otherwise, the change will be undone when unfocusing the prompt box.
     */
    function notifyAboutInput(textarea) {
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
}.call();
