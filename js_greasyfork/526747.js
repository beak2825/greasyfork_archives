// ==UserScript==
// @name         AI Grammar Checker (Grammarly Alternative) for Violentmonkey
// @namespace    http://violentmonkey.net/
// @version      1.4
// @description  Underlines grammar errors and shows corrections on click! (Like Grammarly Premium!)
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.languagetool.org
// @downloadURL https://update.greasyfork.org/scripts/526747/AI%20Grammar%20Checker%20%28Grammarly%20Alternative%29%20for%20Violentmonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/526747/AI%20Grammar%20Checker%20%28Grammarly%20Alternative%29%20for%20Violentmonkey.meta.js
// ==/UserScript==

var GrammarChecker = {};

GrammarChecker.API_URL = "https://api.languagetool.org/v2/check";

GrammarChecker.init = function() {
    console.log("🚀 Grammar Checker Loaded for Violentmonkey!");

    // Observe text inputs and editable divs
    let observer = new MutationObserver(() => {
        document.querySelectorAll("textarea, input[type='text'], [contenteditable='true']").forEach(element => {
            if (!element.dataset.grammarChecked) {
                element.dataset.grammarChecked = "true";
                element.addEventListener("blur", () => GrammarChecker.checkGrammar(element));
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

GrammarChecker.checkGrammar = function(element) {
    let text = element.value || element.innerText;
    if (!text.trim()) return;

    console.log("📝 Checking grammar for:", text);

    GM_xmlhttpRequest({
        method: "POST",
        url: GrammarChecker.API_URL,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: `language=en-US&text=${encodeURIComponent(text)}`,
        onload: function(response) {
            if (response.status === 200) {
                let data = JSON.parse(response.responseText);
                GrammarChecker.highlightErrors(element, data);
            } else {
                console.error("❌ API Error:", response.statusText);
            }
        },
        onerror: function(error) {
            console.error("❌ Network Error:", error);
        }
    });
};

GrammarChecker.highlightErrors = function(element, data) {
    let errors = data.matches;
    if (errors.length === 0) {
        console.log("✅ No errors found.");
        return;
    }

    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
        // Simple text inputs → No rich formatting possible
        console.warn("⚠️ Underlining not possible in plain inputs!");
        return;
    }

    let html = element.innerHTML;
    errors.forEach((error, index) => {
        let errorText = error.context.text.substr(error.context.offset, error.context.length);
        let replacement = error.replacements.length > 0 ? error.replacements.map(r => r.value).join(", ") : "No suggestions";

        // Create a unique ID for each error
        let errorId = `grammar-error-${index}`;

        // Replace the error text with an underlined, clickable span
        let errorSpan = `<span id="${errorId}" class="grammar-error" data-suggestion="${replacement}">${errorText}</span>`;
        html = html.replace(errorText, errorSpan);
    });

    element.innerHTML = html;

    // Add event listeners for clicking on underlined errors
    document.querySelectorAll(".grammar-error").forEach(span => {
        span.style.textDecoration = "underline";
        span.style.textDecorationColor = "red";
        span.style.cursor = "pointer";
        span.style.color = "red";

        span.addEventListener("click", (e) => {
            GrammarChecker.showSuggestionBox(e.target, e.target.dataset.suggestion);
        });
    });
};

GrammarChecker.showSuggestionBox = function(target, suggestion) {
    // Remove existing tooltips
    document.querySelectorAll(".grammar-tooltip").forEach(e => e.remove());

    let tooltip = document.createElement("div");
    tooltip.className = "grammar-tooltip";
    tooltip.innerText = `Suggestion: ${suggestion}`;

    let applyButton = document.createElement("button");
    applyButton.innerText = "Apply";
    applyButton.style.marginLeft = "10px";
    applyButton.style.padding = "5px 10px";
    applyButton.style.background = "#27ae60";
    applyButton.style.border = "none";
    applyButton.style.cursor = "pointer";
    applyButton.style.color = "#fff";
    applyButton.style.fontWeight = "bold";

    applyButton.addEventListener("click", () => {
        target.innerText = suggestion.split(", ")[0]; // Apply first suggestion
        tooltip.remove();
    });

    tooltip.appendChild(applyButton);

    // Style the tooltip
    tooltip.style.position = "absolute";
    tooltip.style.background = "#fffa65";
    tooltip.style.color = "#333";
    tooltip.style.border = "1px solid #f39c12";
    tooltip.style.padding = "10px";
    tooltip.style.zIndex = "9999";
    tooltip.style.fontSize = "14px";
    tooltip.style.top = `${target.getBoundingClientRect().bottom + window.scrollY}px`;
    tooltip.style.left = `${target.getBoundingClientRect().left}px`;

    document.body.appendChild(tooltip);

    // Remove tooltip if clicked outside
    document.addEventListener("click", function removeTooltip(event) {
        if (!tooltip.contains(event.target) && event.target !== target) {
            tooltip.remove();
            document.removeEventListener("click", removeTooltip);
        }
    });
};

// Start the script
GrammarChecker.init();


