// ==UserScript==
// @name         WriteWise EF 3
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Spell and grammar checker with error highlighting, suggestions, correction summary popup and tooltips
// @author       hritishr
// @match        https://view.appen.io/*
// @match        https://www.charactercountonline.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526559/WriteWise%20EF%203.user.js
// @updateURL https://update.greasyfork.org/scripts/526559/WriteWise%20EF%203.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let observer = new MutationObserver(() => {
        document.querySelectorAll("textarea, input[type='text'], [contenteditable=true]").forEach(addCheckButton);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function checkText(text, lang, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:8081/v2/check",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `text=${encodeURIComponent(text)}&language=${lang}&enabledOnly=false`,
            onload: function(response) {
                if (response.status === 200) {
                    callback(JSON.parse(response.responseText));
                } else {
                    alert("Error: Could not connect to LanguageTool API.");
                }
            }
        });
    }

    function highlightErrors(matches, target) {
        let errorsList = [];
        let originalText = target.tagName === "TEXTAREA" || target.tagName === "INPUT" ? target.value : target.innerText;
        matches.reverse().forEach(match => {
            const original = match.context.text.substr(match.offset, match.length);
            const suggestion = match.replacements.length > 0 ? match.replacements[0].value : original;
            const highlight = `[${suggestion} ⚠️]`;
            originalText = originalText.substring(0, match.offset) + highlight + originalText.substring(match.offset + match.length);
            errorsList.push({ originalText: match.context.text, word: original, correction: suggestion });
        });

        target.dataset.originalText = target.tagName === "TEXTAREA" || target.tagName === "INPUT" ? target.value : target.innerText;
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
            target.value = originalText;
        } else if (target.isContentEditable) {
            target.innerText = originalText;
        }

        addActionButtons(target, errorsList);
        if (errorsList.length > 0) {
            showCorrectionPopup(errorsList);
        }
    }

    function addActionButtons(target, errorsList) {
        if (target.dataset.actionsAdded) return;
        let btnContainer = document.createElement("div");
        Object.assign(btnContainer.style, { marginTop: "5px", display: "inline-block" });

        let acceptBtn = document.createElement("button");
        acceptBtn.textContent = "Accept Changes";
        Object.assign(acceptBtn.style, buttonStyle("green"));
        acceptBtn.onclick = (e) => {
            e.preventDefault();
            acceptChanges(target, btnContainer);
            const popup = document.getElementById("correction-popup");
            if (popup) popup.remove();
        };

        let undoBtn = document.createElement("button");
        undoBtn.textContent = "Undo Changes";
        Object.assign(undoBtn.style, buttonStyle("red"));
        undoBtn.onclick = (e) => {
            e.preventDefault();
            undoChanges(target, btnContainer);
        };

        let toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Toggle Original/Corrected";
        Object.assign(toggleBtn.style, buttonStyle("blue"));
        toggleBtn.onclick = (e) => {
            e.preventDefault();
            toggleCorrection(target);
        };

        btnContainer.appendChild(acceptBtn);
        btnContainer.appendChild(undoBtn);
        btnContainer.appendChild(toggleBtn);
        target.parentNode.insertBefore(btnContainer, target.nextSibling);
        target.dataset.actionsAdded = "true";
    }

    function acceptChanges(target, btnContainer) {
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
            target.value = target.value.replace(/\[(.*?) ⚠️\]/g, "$1");
        } else if (target.isContentEditable) {
            target.innerText = target.innerText.replace(/\[(.*?) ⚠️\]/g, "$1");
        }
        cleanUp(target, btnContainer);
    }

    function undoChanges(target, btnContainer) {
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
            target.value = target.dataset.originalText || target.value;
        } else if (target.isContentEditable) {
            target.innerText = target.dataset.originalText || target.innerText;
        }
        cleanUp(target, btnContainer);
    }

    function toggleCorrection(target) {
        const current = target.tagName === "TEXTAREA" || target.tagName === "INPUT" ? target.value : target.innerText;
        const original = target.dataset.originalText;
        const isCorrected = current.includes("⚠️");
        if (!original) return;
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
            target.value = isCorrected ? original : current;
        } else if (target.isContentEditable) {
            target.innerText = isCorrected ? original : current;
        }
    }

    function cleanUp(target, btnContainer) {
        delete target.dataset.actionsAdded;
        btnContainer.remove();
    }

    function buttonStyle(color) {
        return {
            marginLeft: "5px",
            backgroundColor: color === "green" ? "#4CAF50" : color === "red" ? "#ff4d4d" : "#2196F3",
            color: "white",
            border: "none",
            padding: "5px",
            cursor: "pointer",
            borderRadius: "3px"
        };
    }

    function addCheckButton(target) {
        if (target.dataset.checked) return;
        target.dataset.checked = "true";
        const button = document.createElement("button");
        button.textContent = "Check Grammar";
        Object.assign(button.style, buttonStyle("blue"));
        button.onclick = function(e) {
            e.preventDefault();
            let text = target.tagName === "TEXTAREA" || target.tagName === "INPUT" ? target.value : target.innerText;
            checkText(text, "en-US", result => highlightErrors(result.matches, target));
        };
        target.parentNode.insertBefore(button, target.nextSibling);
    }

    function showCorrectionPopup(errors) {
        const existing = document.getElementById("correction-popup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.id = "correction-popup";
        Object.assign(popup.style, {
            position: "fixed",
            top: "40%",
            right: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "#2e2e2e",
            color: "orange",
            border: "1px solid #444",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 10000,
            maxWidth: "300px",
            maxHeight: "300px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)"
        });

        const title = document.createElement("h4");
        title.innerText = "Correction Summary";
        popup.appendChild(title);

        errors.forEach(error => {
            const item = document.createElement("p");
            item.innerHTML = `<b>Original:</b> ${error.originalText}<br><b>Incorrect:</b> ${error.word}<br><b>Corrected:</b> ${error.correction}`;
            popup.appendChild(item);
        });

        const okBtn = document.createElement("button");
        okBtn.textContent = "OK";
        Object.assign(okBtn.style, buttonStyle("blue"));
        okBtn.onclick = () => popup.remove();
        popup.appendChild(okBtn);

        document.body.appendChild(popup);
    }
})();