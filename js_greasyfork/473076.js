// ==UserScript==
// @name         Export Claude.Ai
// @description  Download the conversation with Claude
// @version      1.3
// @namespace    https://github.com/TheAlanK
// @grant        none
// @match        *://claude.ai/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473076/Export%20ClaudeAi.user.js
// @updateURL https://update.greasyfork.org/scripts/473076/Export%20ClaudeAi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTextByClass(className) {
        const elements = document.getElementsByClassName(className);
        const result = [];

        Array.from(elements).forEach(el => {
            console.log(elements);
            const clone = el.cloneNode(true);
            const unwantedElements = clone.querySelectorAll('svg, button');
            unwantedElements.forEach(unwantedEl => {
                unwantedEl.remove();
            });
            result.push(clone.innerText.trim());
        });

        return result.join("\n");
    }

    function addButton() {
        const inputFile = document.querySelector('[data-testid="file-upload"]');
        if (!inputFile) return;

        const container = inputFile.closest('div');
        if (!container) return;

        if (document.getElementById('customExportButton')) return;

        const button = document.createElement("button");
        button.id = 'customExportButton';
        button.setAttribute("title", "Download Chat");
        const svgIcon = `
          <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M23 22C23 22.5523 22.5523 23 22 23H2C1.44772 23 1 22.5523 1 22C1 21.4477 1.44772 21 2 21H22C22.5523 21 23 21.4477 23 22Z" fill="#0F0F0F"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3099 18.6881C12.5581 19.3396 11.4419 19.3396 10.6901 18.6881L5.87088 14.5114C4.47179 13.2988 5.32933 11 7.18074 11L9.00001 11V3C9.00001 1.89543 9.89544 1 11 1L13 1C14.1046 1 15 1.89543 15 3L15 11H16.8193C18.6707 11 19.5282 13.2988 18.1291 14.5114L13.3099 18.6881ZM11.3451 16.6091C11.7209 16.9348 12.2791 16.9348 12.6549 16.6091L16.8193 13H14.5C13.6716 13 13 12.3284 13 11.5V3L11 3V11.5C11 12.3284 10.3284 13 9.50001 13L7.18074 13L11.3451 16.6091Z" fill="#0F0F0F"/>
          </svg>
        `;

        button.innerHTML = svgIcon;

        button.style.cssText = `
            -webkit-text-size-adjust: 100%;
            tab-size: 4;
            -webkit-font-smoothing: antialiased;
            border: 0 solid #e5e7eb;
            box-sizing: border-box;
            font-family: inherit;
            font-size: 100%;
            line-height: inherit;
            margin: 0;
            text-transform: none;
            -webkit-appearance: button;
            background-image: none;
            cursor: pointer;
            display: inline-flex;
            aspect-ratio: 1/1;
            align-items: center;
            justify-content: center;
            gap: .25rem;
            border-radius: .75rem;
            background-color: hsl(var(--color-uivory-300)/var(--tw-bg-opacity));
            color: rgb(255 255 255);
            transition-property: background-color, color, border-color, text-decoration-color, fill, stroke;
            transition-timing-function: cubic-bezier(.4,0,.2,1);
            transition-duration: .15s;
            font-weight: 500;
        `;

        button.onmouseover = function() {
            this.style.backgroundColor = 'hsl(37, 26%, 78%)';
        }

        button.onmouseout = function() {
            this.style.backgroundColor = 'hsl(var(--color-uivory-300)/var(--tw-bg-opacity))';
        }

        button.addEventListener("click", function() {
            const text = getTextByClass('font-claude-message');
            const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.download = 'extracted.txt';
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
        });

        container.appendChild(button);
    }

    const observer = new MutationObserver(addButton);

    observer.observe(document.body, {childList: true, subtree: true});

    addButton();

})();