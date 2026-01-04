// ==UserScript==
// @name         Danbooru Tag Selector & Exporter
// @name:en      Danbooru Tag Selector & Exporter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds checkboxes to tags on Danbooru post pages and search result pages. UI in English. Copy button transforms to checkmark on success.
// @description:en Adds checkboxes to tags on Danbooru post pages and search result pages. UI in English. Copy button transforms to checkmark on success.
// @author       Your Name
// @match        https://danbooru.donmai.us/posts*
// @match        https://danbooru.donmai.us/
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-idl
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/536119/Danbooru%20Tag%20Selector%20%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/536119/Danbooru%20Tag%20Selector%20%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const EXPORT_SEPARATOR = ', '; // Separator for formatted tags
    const INITIAL_DELAY_MS = 300;
    const BUTTON_ANIMATION_DURATION_MS = 300; // Duration of text/checkmark fade animations
    const CHECKMARK_STAY_DURATION_MS = 1200;  // How long the checkmark stays fully visible
    const SUCCESS_BG_COLOR = '#3e8e41'; // Slightly darker green for success feedback on button
    // --- End Configuration ---

    let uiContainer = null;
    let outputTextarea = null;
    let tagObserver = null;

    function addStyles() {
        GM_addStyle(`
            #tag-exporter-ui {
                background-color: #282a2e;
                color: #c8c8c8;
                padding: 10px;
                margin: 15px 0;
                border: 1px solid #444;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                position: relative;
            }
            #tag-exporter-ui h3 {
                margin-top: 0;
                margin-bottom: 8px;
                color: #fff;
                border-bottom: 1px solid #555;
                padding-bottom: 5px;
                font-size: 1.05em;
            }
            #tag-exporter-ui button {
                background-color: #4CAF50; /* Default green */
                color: white;
                border: none;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 12px;
                margin: 3px 2px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color ${BUTTON_ANIMATION_DURATION_MS / 1000}s ease-out;
                vertical-align: middle;
                position: relative; /* For positioning child spans */
                overflow: hidden; /* Hide overflowing content during transitions if any */
            }
            #tag-exporter-ui button:hover {
                background-color: #45a049;
            }
            #tag-exporter-ui button.secondary {
                background-color: #555;
            }
            #tag-exporter-ui button.secondary:hover {
                background-color: #666;
            }

            /* Styles for the copy button with feedback */
            #tag-exporter-ui button.copy-feedback-button .button-original-text,
            #tag-exporter-ui button.copy-feedback-button .button-checkmark-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity ${BUTTON_ANIMATION_DURATION_MS / 1000}s ease-out;
                width: 100%;
                height: 100%;
            }
            #tag-exporter-ui button.copy-feedback-button .button-checkmark-icon {
                opacity: 0;
                font-size: 1.2em; /* Checkmark slightly larger */
                color: white;
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none; /* So it doesn't interfere with button clicks */
            }

            /* Success state for the copy button */
            #tag-exporter-ui button.copy-feedback-button.copy-button-success {
                background-color: ${SUCCESS_BG_COLOR} !important;
            }
            #tag-exporter-ui button.copy-feedback-button.copy-button-success .button-original-text {
                opacity: 0;
            }
            #tag-exporter-ui button.copy-feedback-button.copy-button-success .button-checkmark-icon {
                opacity: 1;
            }

            .tag-checkbox-item {
                margin-right: 7px !important;
                vertical-align: middle;
                flex-shrink: 0;
                transform: scale(1.0);
            }
            #exported-tags-output {
                width: 100%;
                min-height: 35px;
                margin-top: 6px;
                padding: 4px;
                background-color: #1e1f22;
                color: #c8c8c8;
                border: 1px solid #444;
                border-radius: 3px;
                font-family: monospace;
                font-size: 0.85em;
                box-sizing: border-box;
            }
            section#tag-list ul li[data-tag-name],
            section#tag-box ul.search-tag-list li[data-tag-name] {
                margin-bottom: 1px !important;
            }
        `);
    }

    function getSelectedRawTags() {
        const selectedCheckboxes = document.querySelectorAll('.tag-checkbox-item:checked');
        const tags = [];
        selectedCheckboxes.forEach(checkbox => {
            if (checkbox.dataset.tagName) {
                tags.push(checkbox.dataset.tagName);
            }
        });
        return tags;
    }

    function getFormattedTagString(rawTagsArray) {
        if (!rawTagsArray || rawTagsArray.length === 0) {
            return "";
        }
        const processedTags = rawTagsArray.map(tag => tag.replace(/_/g, ' '));
        return processedTags.join(EXPORT_SEPARATOR);
    }

    function updateOutputTextarea() {
        if (outputTextarea) {
            const rawTags = getSelectedRawTags();
            outputTextarea.value = getFormattedTagString(rawTags);
        }
    }

    function copyToClipboard() {
        const button = this; // 'this' refers to the clicked button

        if (button.classList.contains('copy-in-progress')) {
            return; // Prevent multiple clicks during animation
        }

        const rawTags = getSelectedRawTags();
        if (rawTags.length === 0) {
            console.log('Danbooru Tag Exporter: No tags selected to copy.');
            // Optionally: add a brief failure animation (e.g., button shake)
            return;
        }

        button.classList.add('copy-in-progress');
        const originalMinHeight = button.style.minHeight;
        const originalMinWidth = button.style.minWidth;
        button.style.minHeight = button.offsetHeight + 'px'; // Maintain size during content change
        button.style.minWidth = button.offsetWidth + 'px';


        const formattedTagString = getFormattedTagString(rawTags);
        GM_setClipboard(formattedTagString);
        if(outputTextarea) outputTextarea.value = formattedTagString;
        console.log(`Danbooru Tag Exporter: Copied ${rawTags.length} tag${rawTags.length === 1 ? "" : "s"} to clipboard.`);

        // Add success class to trigger animations (text fade out, checkmark fade in, bg change)
        button.classList.add('copy-button-success');

        // After checkmark is visible for a duration, revert to original state
        setTimeout(() => {
            button.classList.remove('copy-button-success'); // Triggers animations back
        }, BUTTON_ANIMATION_DURATION_MS + CHECKMARK_STAY_DURATION_MS); // Time for fade-in + stay

        // After all animations are complete, remove the progress lock and reset min-size
        setTimeout(() => {
            button.classList.remove('copy-in-progress');
            button.style.minHeight = originalMinHeight;
            button.style.minWidth = originalMinWidth;
        }, BUTTON_ANIMATION_DURATION_MS + CHECKMARK_STAY_DURATION_MS + BUTTON_ANIMATION_DURATION_MS); // Total animation cycle time
    }

    function selectAllTags(select) {
        const allCheckboxes = document.querySelectorAll('.tag-checkbox-item');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = select;
        });
        updateOutputTextarea();
    }

    function insertCheckbox(listItem, tagName) {
        if (listItem.querySelector(':scope > .tag-checkbox-item')) {
            return;
        }
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tag-checkbox-item';
        checkbox.dataset.tagName = tagName;
        checkbox.addEventListener('change', updateOutputTextarea);
        listItem.insertBefore(checkbox, listItem.firstChild);
    }

    function processTagsInList(containerElement, isDirectUlContainer = false) {
        let tagListItems;
        if (isDirectUlContainer) {
            tagListItems = containerElement.querySelectorAll(':scope > li[data-tag-name]');
        } else {
            tagListItems = containerElement.querySelectorAll('ul > li[data-tag-name]');
        }

        if (tagListItems.length === 0) return false;
        let FPU_checkboxAdded = false;
        tagListItems.forEach(li => {
            if (li.querySelector(':scope > .tag-checkbox-item')) {
                FPU_checkboxAdded = true; return;
            }
            const tagName = li.dataset.tagName;
            if (tagName) {
                insertCheckbox(li, tagName);
                FPU_checkboxAdded = true;
            }
        });
        if (FPU_checkboxAdded) updateOutputTextarea();
        return FPU_checkboxAdded;
    }

    function addCheckboxesToTags() {
        let tagsFoundAndProcessed = false;
        const singlePostTagListSection = document.querySelector('section#tag-list');
        if (singlePostTagListSection) {
            const categorizedTagListDiv = singlePostTagListSection.querySelector('div.tag-list.categorized-tag-list');
            if (processTagsInList(categorizedTagListDiv || singlePostTagListSection, !categorizedTagListDiv)) {
                tagsFoundAndProcessed = true;
            }
        }
        const searchPageTagUl = document.querySelector('aside#sidebar section#tag-box ul.search-tag-list');
        if (searchPageTagUl && processTagsInList(searchPageTagUl, true)) {
            tagsFoundAndProcessed = true;
        }
        return tagsFoundAndProcessed;
    }

    function createExportUI() {
        if (document.getElementById('tag-exporter-ui')) {
            if (addCheckboxesToTags()) updateOutputTextarea();
            return;
        }

        uiContainer = document.createElement('div');
        uiContainer.id = 'tag-exporter-ui';

        const title = document.createElement('h3');
        title.textContent = 'Tag Selector & Exporter';
        uiContainer.appendChild(title);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-feedback-button'; // Class for special styling & JS targeting
        copyButton.innerHTML = `<span class="button-original-text">Copy Selected</span><span class="button-checkmark-icon">√</span>`;
        copyButton.title = `Formats tags (e.g., 'tag_name' to 'tag name') and copies them, separated by '${EXPORT_SEPARATOR.trim()}'.`;
        copyButton.addEventListener('click', copyToClipboard);
        uiContainer.appendChild(copyButton);

        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = 'Select All';
        selectAllButton.className = 'secondary';
        selectAllButton.addEventListener('click', () => selectAllTags(true));
        uiContainer.appendChild(selectAllButton);

        const deselectAllButton = document.createElement('button');
        deselectAllButton.textContent = 'Deselect All';
        deselectAllButton.className = 'secondary';
        deselectAllButton.addEventListener('click', () => selectAllTags(false));
        uiContainer.appendChild(deselectAllButton);

        outputTextarea = document.createElement('textarea');
        outputTextarea.id = 'exported-tags-output';
        outputTextarea.readOnly = true;
        outputTextarea.placeholder = 'Selected tags will appear here...';
        uiContainer.appendChild(outputTextarea);

        const singlePostTagListArea = document.querySelector('section#tag-list');
        const sidebarArea = document.getElementById('sidebar');
        if (singlePostTagListArea) {
            singlePostTagListArea.parentNode.insertBefore(uiContainer, singlePostTagListArea);
        } else if (sidebarArea) {
            sidebarArea.insertBefore(uiContainer, sidebarArea.firstChild);
        } else {
            document.body.insertBefore(uiContainer, document.body.firstChild);
        }
        if (addCheckboxesToTags()) updateOutputTextarea();
    }

    function startTagObserver() {
        let observerTarget = null;
        const singlePostPrimaryTarget = document.querySelector('section#tag-list div.tag-list.categorized-tag-list');
        const singlePostFallbackTarget = document.querySelector('section#tag-list');
        const searchPageTarget = document.querySelector('aside#sidebar section#tag-box ul.search-tag-list');

        if (singlePostPrimaryTarget) observerTarget = singlePostPrimaryTarget;
        else if (singlePostFallbackTarget) observerTarget = singlePostFallbackTarget;
        else if (searchPageTarget) observerTarget = searchPageTarget;
        if (!observerTarget) return;
        if (tagObserver) tagObserver.disconnect();

        tagObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    addCheckboxesToTags(); break;
                }
            }
        });
        tagObserver.observe(observerTarget, { childList: true, subtree: true });
    }

    function mainInit() {
        addStyles();
        createExportUI();
        if (addCheckboxesToTags()) updateOutputTextarea();
        startTagObserver();
    }

    document.addEventListener('turbo:load', () => setTimeout(mainInit, INITIAL_DELAY_MS));
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(mainInit, INITIAL_DELAY_MS);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(mainInit, INITIAL_DELAY_MS));
    }
})();