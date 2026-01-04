// ==UserScript==
// @name         Asta copier
// @namespace    https://violentmonkey.github.io/
// @version      1.9
// @description  Adds copy button and double-click functionality to extract formatted text from asta.allen.ai
// @author       Bui Quoc Dung
// @match        *://asta.allen.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530077/Asta%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/530077/Asta%20copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ACCORDION_SUMMARY_SELECTOR    = '.MuiAccordionSummary-root';
    const ACCORDION_ROOT_SELECTOR       = '.MuiAccordion-root';
    const ACCORDION_HEADING_SELECTOR    = 'h5';
    const ACCORDION_BODY_SELECTOR       = 'h3 p';
    const PARAGRAPH_SELECTOR            = '.MuiAccordionDetails-root';
    const COPY_BUTTON_CLASS             = 'MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall';


    function findDisclaimerButton() {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            if (button.textContent.includes('Disclaimer')) {
                return button;
            }
        }
        return null;
    }

    function expandSections() {
        console.log("Expanding all sections...");
        document.querySelectorAll(ACCORDION_SUMMARY_SELECTOR).forEach(btn => btn.click());
    }

    function copyToClipboard(text) {
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = text;
        document.body.appendChild(tempContainer);
        let range = document.createRange();
        range.selectNode(tempContainer);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            console.log("Copied formatted text.");
        } catch (err) {
            console.error("Copy failed", err);
        }

        selection.removeAllRanges();
        document.body.removeChild(tempContainer);
    }

    function processText(paragraphElement, includeHeading = true) {
        let tempDiv = paragraphElement.cloneNode(true);

        let paragraphText = tempDiv.innerHTML;

        paragraphText = paragraphText.replace(/<div[^>]*>/g, ' ')
                                     .replace(/<\/div>/g, '')
                                     .replace(/\s+/g, ' ');

        paragraphText = paragraphText
                        .replace(/Is this section helpful\? /g, "")
                        .replace(/Is this table helpful\? /g, "");

        if (includeHeading) {
            let headingText = "";
            let intermediateText = "";

            let accordion = paragraphElement.closest(ACCORDION_ROOT_SELECTOR);
            if (accordion) {
                let headingElement = accordion.querySelector(ACCORDION_HEADING_SELECTOR);
                if (headingElement) {
                    headingText = `<strong><u>${headingElement.innerText.trim()}</u></strong>`.trim();
                }

                let intermediateElement = accordion.querySelector(ACCORDION_BODY_SELECTOR);
                if (intermediateElement) {
                    intermediateText = intermediateElement.innerText.trim();
                }

                if (headingText) {
                    let prefix = headingText + ':\n';
                    if (intermediateText) {
                        prefix += intermediateText + '\n';
                    }
                    paragraphText = prefix + paragraphText;
                }
            }
        }

        return paragraphText;
    }

    function closeMenuIfOpen() {
        const collapseBtn = document.querySelector('button[data-track-name="thread_bar__collapse_btn"]');
        if (!collapseBtn) return;

        const closeIcon = collapseBtn.querySelector('svg[data-testid="CloseIcon"]');
        if (closeIcon) {
            collapseBtn.click();
            console.log("Closed menu panel before copying.");
        } else {
            console.log("Menu panel already closed.");
        }
    }

    function addCopyButton() {
        let targetButton = document.querySelector('[data-track-name="corpus_qa__download_report_btn"]');
        if (!targetButton) return;
        if (document.querySelector('#custom-copy-button')) return;
        let copyButton = document.createElement('button');
        copyButton.id = 'custom-copy-button';
        copyButton.className = COPY_BUTTON_CLASS;
        copyButton.style.marginTop = '6px';
        copyButton.style.display = "block";
        copyButton.style.color = 'black';
        copyButton.textContent = "Copy";
        copyButton.title = "Copy Text";

        targetButton.insertAdjacentElement("afterend", copyButton);

        copyButton.addEventListener('click', () => {
            console.log("Copy button clicked!");
            copyButton.textContent = "Coping";
            closeMenuIfOpen();
            expandSections();
            setTimeout(() => {
                let copiedText = extractAllText();
                copyToClipboard(copiedText);
                copyButton.textContent = "Copy";
            }, 1500);
        });
    }

    function extractAllText() {
        let paragraphs = document.querySelectorAll(PARAGRAPH_SELECTOR);
        let copiedText = "";

        paragraphs = Array.from(paragraphs).slice(0, -1);

        paragraphs.forEach(paragraph => {
            let processedText = processText(paragraph, true);
            copiedText += processedText + '\n\n';
        });

        return copiedText;
    }

    function handleDoubleClick(event) {
        const targetDiv = event.target.closest(PARAGRAPH_SELECTOR);
        if (!targetDiv) return;

        closeMenuIfOpen();

        let accordion = targetDiv.closest(ACCORDION_ROOT_SELECTOR);
        if (accordion) {
            let button = accordion.querySelector(ACCORDION_SUMMARY_SELECTOR);
            if (button) {
                button.click();
            }
        }

        setTimeout(() => {
            let textContent = processText(targetDiv, true);
            copyToClipboard(textContent);
        }, 500);
    }

    function initialize() {
        const observer = new MutationObserver(() => {
            addCopyButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.body.addEventListener('dblclick', handleDoubleClick);

        setTimeout(addCopyButton, 2000);
    }

    initialize();
})();
