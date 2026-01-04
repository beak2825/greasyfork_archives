// ==UserScript==
// @name        CheckBoxMate Modernized
// @namespace   https://musicbrainz.org/user/chaban
// @version     1.1
// @tag         ai-created
// @description Select multiple checkboxes with ease by drawing a box around them.
// @author      scottmweaver, chaban
// @license     MIT
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/546923/CheckBoxMate%20Modernized.user.js
// @updateURL https://update.greasyfork.org/scripts/546923/CheckBoxMate%20Modernized.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*
     * This is a modernized version of the original CheckBoxMate Greasemonkey script by scottmweaver.
     * Original description: "Check multiple checkboxes with ease by drawing a box around them to
     * automatically select them all."
     * Original namespace: http://macdougalmedia.com/2010/04/07/checkboxmate-for-greasemonkey/
     * Original homepageURL: https://userscripts-mirror.org/scripts/show/73700
     */

    const DRAG_THRESHOLD = 5; // Minimum pixels to move before initiating a drag selection

    class CheckBoxMate {
        // --- Private properties ---
        #isDragging = false;
        #dragStarted = false;
        #startPos = { x: 0, y: 0 };
        #selectionBox = null;
        #checkboxes = [];
        #lastSelected = new Set();

        constructor() {
            document.addEventListener('mousedown', this.handleMouseDown, { passive: true });
        }

        /**
         * Caches the positions of all visible checkboxes on the page.
         * This is a performance optimization to avoid querying the DOM on every mouse move.
         */
        #cacheCheckboxPositions() {
            this.#checkboxes = [];
            const checkboxNodes = document.querySelectorAll('input[type="checkbox"]');

            for (const checkbox of checkboxNodes) {
                // Ignore hidden checkboxes
                if (checkbox.offsetParent !== null) {
                    this.#checkboxes.push({
                        element: checkbox,
                        rect: checkbox.getBoundingClientRect(),
                    });
                }
            }

            // Sort by vertical position for faster intersection checking
            this.#checkboxes.sort((a, b) => a.rect.top - b.rect.top);
        }

        /**
         * Creates and styles the visual selection rectangle.
         */
        #createSelectionBox() {
            if (this.#selectionBox) return;

            this.#selectionBox = document.createElement('div');
            this.#selectionBox.style.cssText = `
                position: fixed;
                border: 1px dotted #000;
                background-color: rgba(0, 100, 255, 0.1);
                z-index: 2147483647;
                pointer-events: none;
            `;
            document.body.appendChild(this.#selectionBox);
        }

        /**
         * Updates the geometry of the selection box based on mouse movement.
         * @param {MouseEvent} event - The mouse move event.
         */
        #updateSelectionBox(event) {
            if (!this.#selectionBox) return;

            const currentPos = { x: event.clientX, y: event.clientY };
            const left = Math.min(this.#startPos.x, currentPos.x);
            const top = Math.min(this.#startPos.y, currentPos.y);
            const width = Math.abs(this.#startPos.x - currentPos.x);
            const height = Math.abs(this.#startPos.y - currentPos.y);

            this.#selectionBox.style.left = `${left}px`;
            this.#selectionBox.style.top = `${top}px`;
            this.#selectionBox.style.width = `${width}px`;
            this.#selectionBox.style.height = `${height}px`;
        }

        /**
         * Checks if two rectangles are intersecting.
         * @param {DOMRect} rect1 - The first rectangle.
         * @param {DOMRect} rect2 - The second rectangle.
         * @returns {boolean} - True if they intersect.
         */
        #isIntersecting(rect1, rect2) {
            return !(
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom
            );
        }

        /**
         * Updates the selection state of checkboxes based on the current selection box.
         */
        #updateSelection() {
            if (!this.#selectionBox) return;

            const selectionRect = this.#selectionBox.getBoundingClientRect();
            const currentSelected = new Set();

            // Find all checkboxes intersecting with the selection box
            for (const item of this.#checkboxes) {
                // Optimization: stop checking once we're past the selection box vertically
                if (item.rect.top > selectionRect.bottom) {
                    break;
                }
                if (this.#isIntersecting(selectionRect, item.rect)) {
                    currentSelected.add(item.element);
                }
            }

            // Toggle checkboxes that have changed state (entered or left the selection)
            for (const checkbox of this.#lastSelected) {
                if (!currentSelected.has(checkbox)) {
                    checkbox.click();
                }
            }
            for (const checkbox of currentSelected) {
                if (!this.#lastSelected.has(checkbox)) {
                    checkbox.click();
                }
            }

            this.#lastSelected = currentSelected;
        }

        /**
         * Cleans up all resources and resets the state.
         */
        #cleanup = () => {
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);

            if (this.#selectionBox) {
                this.#selectionBox.remove();
                this.#selectionBox = null;
            }

            this.#isDragging = false;
            this.#dragStarted = false;
            this.#checkboxes = [];
            this.#lastSelected.clear();
        }

        // --- Event Handlers (as arrow functions to preserve `this` context) ---

        handleMouseDown = (event) => {
            // Only activate on left-click on a checkbox
            if (event.button !== 0 || event.target.type !== 'checkbox') {
                return;
            }

            this.#isDragging = true;
            this.#startPos = { x: event.clientX, y: event.clientY };

            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }

        handleMouseMove = (event) => {
            if (!this.#isDragging) return;

            event.preventDefault();

            if (!this.#dragStarted) {
                const movedDistance = Math.hypot(
                    event.clientX - this.#startPos.x,
                    event.clientY - this.#startPos.y
                );

                if (movedDistance > DRAG_THRESHOLD) {
                    this.#dragStarted = true;
                    this.#cacheCheckboxPositions();
                    this.#createSelectionBox();
                }
            }

            if (this.#dragStarted) {
                this.#updateSelectionBox(event);
                this.#updateSelection();
            }
        }

        handleMouseUp = () => {
            if (this.#dragStarted) {
                this.#updateSelection();
            }
            this.#cleanup();
        }
    }

    // Initialize the script
    new CheckBoxMate();
})();