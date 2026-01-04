// ==UserScript==
// @name         Chat UI Ctrl+Enter Sender
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Send with Ctrl+Enter in ChatGPT, Claude, Gemini, Perplexity, Copilot, DuckDuckGo AI, and others.
// @author       Chippppp
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&pattern=chatgpt.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/499288/Chat%20UI%20Ctrl%2BEnter%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/499288/Chat%20UI%20Ctrl%2BEnter%20Sender.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const defaultPatterns = [
        "https://chatgpt.com/*",
        "https://claude.ai/*",
        "https://gemini.google.com/*",
        "https://www.perplexity.ai/*",
        "https://www.bing.com/chat*",
        "https://duckduckgo.com/*ia=chat*"
    ];

    let patterns = GM_getValue("patterns", defaultPatterns.slice());

    GM_registerMenuCommand("Manage URL patterns", () => {
        showPatternSettingsUI(patterns);
    });

    function showPatternSettingsUI(patterns) {
        const dialog = document.createElement("dialog");
        dialog.style.width = "400px";
        dialog.style.height = "500px";
        dialog.style.overflowY = "auto";
        dialog.innerHTML = `
            <form method="dialog" style="display: flex; flex-direction: column; height: 100%; padding: 10px;">
                <h2 style="margin: 0 0 10px 0;">URL Pattern Settings</h2>
                <div id="pattern-list" style="margin-bottom: 10px; flex-grow: 1; overflow-y: auto; border: 1px solid #ccc; padding: 10px;"></div>
                <div style="margin-bottom: 10px; display: flex;">
                    <input id="new-pattern-input" type="text" value="${location.origin}/*" style="flex-grow: 1; margin-right: 5px; padding: 5px; color: black; background-color: white; border: 1px solid #ccc;">
                    <button id="add-pattern" type="button" style="padding: 5px;">Add URL pattern</button>
                </div>
                <div style="margin-bottom: 10px;">
                    <button id="reset-patterns" type="button" style="padding: 5px;">Reset to default</button>
                </div>
                <div style="text-align: right;">
                    <button id="close-dialog" type="submit" value="close" style="padding: 5px;">Close</button>
                </div>
            </form>
        `;

        document.body.appendChild(dialog);
        dialog.showModal();

        dialog.querySelector("#add-pattern").addEventListener("click", () => {
            const newPatternInput = dialog.querySelector("#new-pattern-input").value;
            if (!newPatternInput) {
                alert("Invalid input")
            } else if (!patterns.includes(newPatternInput)) {
                patterns.push(newPatternInput);
                GM_setValue("patterns", patterns);
                alert(`URL pattern added: ${newPatternInput}`);
                updatePatternList(dialog, patterns);
                dialog.querySelector("#new-pattern-input").value = location.origin + "/*";
            } else {
                alert(`URL pattern already exists: ${newPatternInput}`);
            }
        });

        dialog.querySelector("#reset-patterns").addEventListener("click", () => {
            if (confirm("Are you sure you want to reset URL patterns to default?")) {
                patterns = defaultPatterns.slice();
                GM_setValue("patterns", patterns);
                alert("URL patterns have been reset to default.");
                updatePatternList(dialog, patterns);
                dialog.querySelector("#new-pattern-input").value = location.origin + "/*";
            }
        });

        dialog.addEventListener("close", () => {
            dialog.remove();
        });

        updatePatternList(dialog, patterns);
    }

    function createPatternItemHTML(pattern) {
        return `
            <div class="pattern-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span>${pattern}</span>
                <div>
                    <button class="edit-pattern" data-pattern="${pattern}" style="margin-right: 5px;">Edit</button>
                    <button class="remove-pattern" data-pattern="${pattern}">Remove</button>
                </div>
            </div>
        `;
    }

    function updatePatternList(dialog, patterns) {
        const patternList = dialog.querySelector("#pattern-list");
        patternList.innerHTML = patterns.map(pattern => createPatternItemHTML(pattern)).join("");

        patternList.querySelectorAll(".remove-pattern").forEach(button => {
            button.addEventListener("click", (event) => {
                const patternToRemove = event.target.getAttribute("data-pattern");
                if (confirm(`Are you sure you want to remove ${patternToRemove}?`)) {
                    const index = patterns.indexOf(patternToRemove);
                    if (index !== -1) {
                        patterns.splice(index, 1);
                        GM_setValue("patterns", patterns);
                        alert(`URL pattern removed: ${patternToRemove}`);
                    } else {
                        alert(`URL pattern not found: ${patternToRemove}`);
                    }
                }
                updatePatternList(dialog, patterns);
            });
        });

        patternList.querySelectorAll(".edit-pattern").forEach(button => {
            button.addEventListener("click", (event) => {
                const patternToEdit = event.target.getAttribute("data-pattern");
                const newPatternName = prompt(`Edit URL pattern: ${patternToEdit}`, patternToEdit);
                if (newPatternName === null) {
                    updatePatternList(dialog, patterns);
                    return;
                }
                if (!newPatternName) {
                    alert("Invalid input");
                } else if (!patterns.includes(newPatternName)) {
                    const index = patterns.indexOf(patternToEdit);
                    if (index !== -1) {
                        patterns[index] = newPatternName;
                        GM_setValue("patterns", patterns);
                        alert(`URL pattern edited: ${patternToEdit} to ${newPatternName}`);
                    } else {
                        alert(`URL pattern not found: ${patternToEdit}`);
                    }
                } else {
                    alert(`URL pattern already exists: ${newPatternName}`);
                }
                updatePatternList(dialog, patterns);
            });
        });
    }

    function matchPattern(url, pattern) {
        let regexPattern = pattern
            .replace(/[.+^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*")
            .replace(/\?/g, ".")
            .replace(/\|/g, "|");

        return new RegExp(`^${regexPattern}$`).test(url);
    }

    if (!patterns.some(pattern => matchPattern(location.href, pattern))) return;

    console.log("Chat UI Ctrl+Enter Sender Enabled");

    window.addEventListener("keydown", e => {
        if (e.key !== "Enter" || e.ctrlKey || e.shiftKey) return;
        let target = e.composedPath ? e.composedPath()[0] || e.target : e.target;
        if (/INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) || target.getAttribute && target.getAttribute("contenteditable") === "true") {
            e.stopPropagation();
        }
    }, true);

    window.addEventListener("keypress", e => {
        if (e.key !== "Enter" || e.ctrlKey || e.shiftKey) return;
        let target = e.composedPath ? e.composedPath()[0] || e.target : e.target;
        if (/INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) || target.getAttribute && target.getAttribute("contenteditable") === "true") {
            e.stopPropagation();
        }
    }, true);
})();