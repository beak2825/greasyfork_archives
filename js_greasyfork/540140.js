// ==UserScript==
// @name         Descriptive fields
// @namespace    https://github.com/lheintzmann1
// @version      1.0
// @description  Adds descriptive placeholders to input and textarea fields, including inside Shadow DOM.
// @author       lheintzmann1
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540140/Descriptive%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/540140/Descriptive%20fields.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration Section ---
    const config = {
        icons: {
            textarea: "📝",
            email: "📩",
            password: "🔒",
            text: "📝",
            number: "🔢",
            tel: "📞",
            url: "🌐",
            date: "📅",
            time: "⏰",
            color: "🎨",
            search: "🔍",
            default: "🧾",
        },
        showAriaDescribedby: true, // Set to false to disable aria-describedby for extra info
    };

    /**
     * Checks if a field is required (HTML5 or aria-required).
     * @param {HTMLElement} el
     * @returns {boolean}
     */
    function isRequired(el) {
        return el.required || el.getAttribute("aria-required") === "true";
    }

    /**
     * Returns an icon based on field type.
     * @param {HTMLInputElement|HTMLTextAreaElement} field
     * @returns {string}
     */
    function getFieldIcon(field) {
        const tag = field.tagName.toLowerCase();
        if (tag === "textarea") return config.icons.textarea;
        const type = field.type || "text";
        return config.icons[type] || config.icons.default;
    }

    /**
     * Builds a placeholder string for a field.
     * @param {HTMLInputElement|HTMLTextAreaElement} field
     * @returns {string}
     */
    function buildPlaceholder(field) {
        let placeholder = getFieldIcon(field) + " ";
        const required = isRequired(field);
        placeholder += required ? "Required" : "Optional";

        const minLength = field.minLength > 0 ? field.minLength : null;
        const maxLength = field.maxLength > 0 && field.maxLength !== 2147483647 ? field.maxLength : null;
        if (minLength !== null || maxLength !== null) {
            const parts = [];
            if (minLength !== null) parts.push(`min. ${minLength}`);
            if (maxLength !== null) parts.push(`max. ${maxLength}`);
            placeholder += ` (${parts.join(", ")} characters)`;
        }
        return placeholder;
    }

    /**
     * Adds an aria-describedby element for accessibility.
     * @param {HTMLElement} field
     * @param {string} info
     */
    function addAriaDescription(field, info) {
        if (!config.showAriaDescribedby) return;
        try {
            const descId = `placeholder-hint-${Math.random().toString(36).substr(2, 9)}`;
            let descElem = document.createElement("small");
            descElem.id = descId;
            descElem.textContent = info;
            descElem.style.display = "none"; // Hide visually, but available for screen readers
            document.body.appendChild(descElem);
            field.setAttribute("aria-describedby", descId);
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Enhances all input/textarea fields in a root (document or ShadowRoot).
     * Recursively processes Shadow DOMs.
     * @param {Document|ShadowRoot|HTMLElement} root
     */
    function enhanceFieldsIn(root) {
        // Enhance visible fields
        let fields;
        try {
            fields = root.querySelectorAll("input, textarea");
        } catch (e) {
            return;
        }
        fields.forEach(field => {
            if (field.dataset.enhanced === "true") return;
            if (typeof field.placeholder === "undefined") return;
            const placeholder = buildPlaceholder(field);
            if (!field.placeholder) {
                field.placeholder = placeholder;
                if (config.showAriaDescribedby) addAriaDescription(field, placeholder);
                field.dataset.enhanced = "true";
            }
        });
        // Recurse into shadow roots
        let allElements;
        try {
            allElements = root.querySelectorAll('*');
        } catch (e) {
            return;
        }
        allElements.forEach(el => {
            if (el.shadowRoot) {
                enhanceFieldsIn(el.shadowRoot);
            }
        });
    }

    /**
     * Handles DOM mutations and re-applies enhancement to new nodes (including Shadow DOM).
     * @param {Array} mutations
     */
    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // ELEMENT_NODE
                // If node has a shadow root, enhance inside it
                if (node.shadowRoot) enhanceFieldsIn(node.shadowRoot);
                // Enhance the node itself and its subtree
                enhanceFieldsIn(node);
            });
        });
    }

    // --- Initialization ---

    // Enhance on DOMContentLoaded
    window.addEventListener("DOMContentLoaded", () => enhanceFieldsIn(document));

    // Enhance immediately (in case DOMContentLoaded already fired)
    enhanceFieldsIn(document);

    // Observe DOM for dynamically added elements, including inside Shadow DOM
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

})();