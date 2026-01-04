// ==UserScript==
// @name         Lichess - Interactive Studies
// @namespace    lichess
// @version      0.2
// @description  Enhanced interactive studies in Lichess.
// @author       flusflas
// @match        https://lichess.org/study/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/473070/Lichess%20-%20Interactive%20Studies.user.js
// @updateURL https://update.greasyfork.org/scripts/473070/Lichess%20-%20Interactive%20Studies.meta.js
// ==/UserScript==

/* globals $ */

let studyDropdownCss = [
    '#custom-app {' +
    '    overflow: hidden;' +
    '    width: 20rem;' +
    '    max-width: 100vw;' +
    '    right: 0;' +
    '    border-radius: 3px 0 0 3px;' +
    '}',
    '.custom-dropdown-item-label {' +
    '    padding: 2rem;' +
    '}',
    '.custom-label-span {' +
    '    padding: 1rem .5rem;' +
    '}'
];

const studyDropdownHtml = '' +
      '<button id="custom-toggle" class="toggle link">' +
      '    <span title="Notifications: 0" aria-label="Notifications: 0"' +
      '          class="data-count" data-count="0" data-icon="" "=""></span>' +
      '</button>' +
      '<div id="custom-app" class="dropdown">' +
      '    <div class="notifications">' +
      '        <label class="site_notification" for="cb-force-preview">' +
      '            <input type="checkbox" id="cb-force-preview" name="cb-force-preview" value="Force Preview"">' +
      '            <span class="custom-label-span">Force Preview mode</span>' +
      '        </label>' +
      '        <label class="site_notification" for="cb-random-chapters">' +
      '            <input type="checkbox" id="cb-random-chapters" name="cb-random-chapters" value="Preview Random">' +
      '            <span class="custom-label-span">Show chapters in random order</span>' +
      '        </label>' +
      '    </div>' +
      '</div>';


const forcePreviewValueKey = "lichess_study_force_preview";
const randomChaptersValueKey = "lichess_study_random_chapters";

var forcePreview = GM.getValue(forcePreviewValueKey, false);
var randomChapters = GM.getValue(randomChaptersValueKey, false);


let customMenuController = null;
let previewModeController = null;
let randomChaptersController = null;


/**
 * Creates and handles the custom dropdown menu added to the top bar.
 */
class CustomMenuController {
    constructor() {
        let self = this;

        const observer = new MutationObserver((mutationsList, observer) => {
            if (document.querySelector('.site-buttons') !== null) {
                observer.disconnect();
                customMenuController.#loadMenu();
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }

    #loadMenu() {
        // Loads the custom styles
        var styleSheet = document.createElement("style");
        styleSheet.innerText = studyDropdownCss.join(' ');
        document.head.appendChild(styleSheet);
        this.#ensureMenuStyles();

        // Creates and insert the custom menu
        const studyDropdown = document.createElement('div');
        studyDropdown.innerHTML = studyDropdownHtml;

        const siteButtons = document.querySelector('.site-buttons');
        document.querySelector('.site-buttons').insertBefore(studyDropdown, siteButtons.firstChild);

        $('#cb-force-preview').prop('checked', forcePreview);
        $('#cb-force-preview').change(function() {
            forcePreview = this.checked;
            GM.setValue(forcePreviewValueKey, this.checked);
            randomChaptersController.resetChapterList();
            if (this.checked) previewModeController.enterPreviewMode();
        });

        $('#cb-random-chapters').prop('checked', randomChapters);
        $('#cb-random-chapters').change(function() {
            randomChapters = this.checked;
            GM.setValue(randomChaptersValueKey, this.checked);
            if (this.checked) randomChaptersController.randomizeChapers(true);
        });
    }

    /**
     * Hacky workaround to ensure the styles of the custom menu are applied
     * by just sending mouseover events to the notify toggle button (the custom
     * menu uses some notification classes for styling, and for some reason
     * an interaction with the notify button is needed).
     */
    #ensureMenuStyles() {
        var refreshIntervalId = setInterval(fname, 100);
        function fname() {
            const notifyButton = document.querySelector('#notify-toggle');
            notifyButton.dispatchEvent(new MouseEvent('mouseover'));
        }

        setTimeout(() => clearInterval(refreshIntervalId), 3000);
    }
}


/**
 * Handles the behavior of the "Force Preview mode" option, entering
 * automatically in Preview mode every time a chapter is selected if
 * the option is enabled.
 */
class PreviewModeController {
    constructor() {
        let self = this;

        $(document).ready(function() {
            const analysisPanel = document.querySelector(".analyse__underboard");

            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (const addedNode of mutation.addedNodes) {
                            if (addedNode.classList.contains('gamebook-buttons') || addedNode.classList.contains('study__buttons')) {
                                const previewButton = analysisPanel.querySelector(".preview");
                                self.#onPreviewModeChange(previewButton.classList.contains("active"));
                            }
                        }
                    }
                }
            });

            observer.observe(analysisPanel, {childList: true, subtree: true});

            if (forcePreview) {
                previewModeController.enterPreviewMode();
            }
        });
    }

    #onPreviewModeChange(previewMode) {
        const previewButton = document.querySelector(".analyse__underboard .preview");

        if (previewButton.classList.contains('active')) {
            previewButton.addEventListener('click', function() {
                forcePreview = false;
                GM_setValue(forcePreviewValueKey, false);
                $('#cb-force-preview').prop('checked', false);
            });
        } else {
            if (forcePreview) {
                this.enterPreviewMode();
            }
        }
    }

    isInPreviewMode() {
        return document.querySelector(".analyse__underboard .preview").classList.contains("active");
    }

    enterPreviewMode() {
        var previewButton = document.querySelector(".preview:not(.active)");
        if (randomChapters) {
            if (randomChaptersController.nextChapterList.length === 0) {
                randomChaptersController.randomizeChapers(true);
            }
        }
        if (previewButton !== null) previewButton.click();
    }

    exitPreviewMode() {
        var previewButton = document.querySelector(".preview.active");
        if (previewButton !== null) previewButton.click();
    }
}


/**
 * Handles the behavior of the "Show chapters in random order" option.
 * If it is enabled, chapters are loaded in random order (without repetition)
 * when the user finishes an interactive chapter and clicks the "Next chapter"
 * button.
 */
class RandomChaptersController {
    nextChapterList = [];
    #index = -1;

    constructor() {
        const self = this;

        $(document).ready(function() {
            // Creates an observer to know when the chapter is complete (the retry button appears)
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (const addedNode of mutation.addedNodes) {
                            if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('feedback')) {
                                const retryButton = document.querySelector(".gamebook .floor .retry");
                                if (retryButton !== null) {
                                    self.#onChapterCompleted();
                                }
                            }
                        }
                    }
                }
            });

            observer.observe(document, {childList: true, subtree: true});

            if (randomChapters) self.randomizeChapers(true);
        });
    }

    #onChapterCompleted() {
        if (!randomChapters) return;

        let self = this;

        let nextButtonHtml = '<button id="next-button" class="next text" data-icon="" type="button">Next chapter</button>';
        let nextShuffleHtml = '<button id="next-button" class="next text" data-icon="" type="button">Repeat</button>';

        let feedbackPanel = document.querySelector(".feedback.end");
        let nextButton = document.querySelector(".feedback.end .next");
        if (!this.hasNext()) {
            if (nextButton !== null) nextButton.style.display = "none";
            feedbackPanel.insertAdjacentHTML("afterbegin", nextShuffleHtml);
            $("#next-button").click(function() {
                self.randomizeChapers(false);
                self.next();
            });
        } else {
            if (nextButton !== null) nextButton.style.display = "none";
            feedbackPanel.insertAdjacentHTML("afterbegin", nextButtonHtml);
            $("#next-button").click(function() {
                self.next();
            });
        }
    }

    resetChapterList() {
        this.nextChapterList = [];
        this.#index = -1;
    }

    randomizeChapers(excludeActive) {
        if (excludeActive) {
            this.nextChapterList = Array.from(document.querySelectorAll(".study__chapters .draggable:not(.active)"));
        } else {
            this.nextChapterList = Array.from(document.querySelectorAll(".study__chapters .draggable"));
        }
        this.shuffleArray(this.nextChapterList);
        this.#index = -1
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    hasNext() {
        return this.#index < this.nextChapterList.length - 1;
    }

    next() {
        if (this.nextChapterList.length === 0) {
            this.randomizeChapers();
        }

        if (this.nextChapterList.length === 0 || !this.hasNext()) {
            return null
        }

        this.#index++;

        if (this.nextChapterList[this.#index].classList.contains("active")) {
            // Retry the active chapter
            document.querySelector(".gamebook .floor .retry").click();
        } else {
            this.nextChapterList[this.#index].click();
        }
    }

    handleFeedback() {
        if (!randomChapters) return;

        let retryButton = document.querySelector(".feedback.end .retry");
        let nextButton = document.querySelector(".feedback.end .next");

        if (this.hasNext() && nextButton === null) {
            // Add next button
        }
    }
}


(function() {
    'use strict';

    customMenuController = new CustomMenuController();
    previewModeController = new PreviewModeController();
    randomChaptersController = new RandomChaptersController();
})();
