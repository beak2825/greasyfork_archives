// ==UserScript==
// @name         Input & Textarea Placeholder Enhancer (EN + Length Info)
// @namespace    https://ivole32.github.io/
// @version      1.1
// @description  Adds helpful placeholders (required/optional + min/max length) to input and textarea fields, including aria-required support.
// @author       Ivole32
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540144/Input%20%20Textarea%20Placeholder%20Enhancer%20%28EN%20%2B%20Length%20Info%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540144/Input%20%20Textarea%20Placeholder%20Enhancer%20%28EN%20%2B%20Length%20Info%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isRequired(el) {
        return el.required || el.getAttribute("aria-required") === "true";
    }

    function enhanceFields() {
        const fields = document.querySelectorAll("input, textarea");

        fields.forEach(field => {
            if (field.dataset.enhanced === "true") return;

            const tag = field.tagName.toLowerCase();
            const type = field.type || "text";
            const required = isRequired(field);
            const minLength = field.minLength > 0 ? field.minLength : null;
            const maxLength = field.maxLength > 0 && field.maxLength !== 2147483647 ? field.maxLength : null;

            let placeholder = "";

            if (tag === "textarea") {
                placeholder += "📝 ";
            } else {
                switch (type) {
                    case "email": placeholder += "📩 "; break;
                    case "password": placeholder += "🔒 "; break;
                    case "text": placeholder += "📝 "; break;
                    case "number": placeholder += "🔢 "; break;
                    case "tel": placeholder += "📞 "; break;
                    case "url": placeholder += "🌐 "; break;
                    default: placeholder += "🧾 "; break;
                }
            }

            placeholder += required ? "Required" : "Optional";

            if (minLength !== null || maxLength !== null) {
                const parts = [];
                if (minLength !== null) parts.push(`min. ${minLength}`);
                if (maxLength !== null) parts.push(`max. ${maxLength}`);
                placeholder += ` (${parts.join(", ")} characters)`;
            }

            if (!field.placeholder) {
                field.placeholder = placeholder;
                field.dataset.enhanced = "true";
            }
        });
    }

    window.addEventListener("DOMContentLoaded", enhanceFields);
    const observer = new MutationObserver(enhanceFields);
    observer.observe(document.body, { childList: true, subtree: true });
})();