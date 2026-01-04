// ==UserScript==
// @name         Torn Faction Revive Checker
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Checks revive status for faction members, shows revivable list (excluding Fallen), and opens Messages→Compose with autofilled subject/body when you click a name.
// @author       HuzGPT
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @match        https://www.torn.com/messages.php*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/527740/Torn%20Faction%20Revive%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/527740/Torn%20Faction%20Revive%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======== EASY SETTINGS (edit these) ========
    const API_KEY = "API_KEY"; // Put your API key here
    const DEFAULT_SUBJECT = "Turn off revives";
    const DEFAULT_BODY = "Please turn off your revives for the upcoming war.";
    // ============================================

    // If we're on messages.php (compose page), handle autofill and exit.
    if (location.pathname === "/messages.php") {
        maybeAutofillCompose();
        return;
    }

    // ------------- Faction page logic -------------
    function getFactionId() {
        const match = location.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    }

    function fetchFactionMembers() {
        const factionId = getFactionId();
        if (!factionId) {
            console.error("Could not find faction ID");
            displayError("Could not find faction ID");
            return;
        }

        displayLoadingMenu();

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`,
            headers: {
                'Authorization': `ApiKey ${API_KEY}`,
                'accept': 'application/json'
            },
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("API Error:", data.error);
                        displayError(`API Error: ${data.error.error}`);
                        return;
                    }
                    processRevivableMembers(data);
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    displayError("Failed to parse API response");
                }
            },
            onerror: function (error) {
                console.error("Request Error:", error);
                displayError("Failed to connect to Torn API");
            }
        });
    }

    function displayLoadingMenu() {
        let existingMenu = document.getElementById("reviveCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();
        let title = document.createElement("div");
        title.textContent = "Revivable Players";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        let loadingMsg = document.createElement("div");
        loadingMsg.textContent = "Loading...";
        loadingMsg.style.color = "#888";
        loadingMsg.style.fontStyle = "italic";
        menu.appendChild(loadingMsg);

        document.body.appendChild(menu);
    }

    function displayError(message) {
        let existingMenu = document.getElementById("reviveCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();
        let title = document.createElement("div");
        title.textContent = "Revivable Players";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        let errorMsg = document.createElement("div");
        errorMsg.textContent = message;
        errorMsg.style.color = "#ff6666";
        errorMsg.style.fontStyle = "italic";
        menu.appendChild(errorMsg);

        document.body.appendChild(menu);
    }

    function processRevivableMembers(data) {
        const revivablePlayers = [];

        if (data.members) {
            for (const [, memberData] of Object.entries(data.members)) {
                // Only show revivable and not Fallen
                if (memberData.is_revivable && memberData.status?.state !== "Fallen") {
                    revivablePlayers.push({
                        id: memberData.id,
                        name: memberData.name
                    });
                }
            }
        }

        displayReviveList(revivablePlayers);
    }

    function createBaseMenu() {
        let menu = document.createElement("div");
        menu.id = "reviveCheckerMenu";
        menu.style.position = "fixed";
        menu.style.top = "100px";
        menu.style.right = "20px";
        menu.style.backgroundColor = "rgba(20, 20, 20, 0.95)";
        menu.style.color = "#fff";
        menu.style.padding = "15px";
        menu.style.borderRadius = "8px";
        menu.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        menu.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        menu.style.zIndex = "1000";
        menu.style.fontSize = "14px";
        menu.style.minWidth = "240px";
        menu.style.maxHeight = "300px";
        menu.style.overflowY = "auto";

        let closeButton = document.createElement("span");
        closeButton.textContent = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "8px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "#ff6666";
        closeButton.style.fontWeight = "bold";
        closeButton.style.fontSize = "16px";
        closeButton.title = "Close";
        closeButton.onclick = function () {
            menu.remove();
        };

        menu.appendChild(closeButton);
        return menu;
    }

    function displayReviveList(players) {
        let existingMenu = document.getElementById("reviveCheckerMenu");
        if (existingMenu) existingMenu.remove();

        let menu = createBaseMenu();

        let title = document.createElement("div");
        title.textContent = "Revivable Players";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.fontSize = "16px";
        menu.appendChild(title);

        if (!players || players.length === 0) {
            let noPlayersMsg = document.createElement("div");
            noPlayersMsg.textContent = "No revivable players found";
            noPlayersMsg.style.color = "#888";
            noPlayersMsg.style.fontStyle = "italic";
            menu.appendChild(noPlayersMsg);
        } else {
            let countDiv = document.createElement("div");
            countDiv.textContent = `Found ${players.length} revivable player${players.length > 1 ? 's' : ''}`;
            countDiv.style.marginBottom = "10px";
            countDiv.style.color = "#1E90FF";
            menu.appendChild(countDiv);

            players.forEach(player => {
                let playerEntry = document.createElement("div");
                playerEntry.style.marginBottom = "6px";
                // Add &autofill=1 so our messages.php handler knows to fill fields
                playerEntry.innerHTML = `<a href='/messages.php#/p=compose&XID=${player.id}&autofill=1'
                                          style='color:#fff; text-decoration:none; font-weight:bold; transition:color .2s ease;'
                                          onmouseover='this.style.color="#1E90FF"'
                                          onmouseout='this.style.color="#fff"'>
                                          ${player.name}
                                         </a>`;
                menu.appendChild(playerEntry);
            });
        }

        document.body.appendChild(menu);
    }

    function addReviveButton() {
        let linksTopWrap = document.querySelector(".links-top-wrap");
        if (!linksTopWrap) return;

        let button = document.createElement("a");
        button.className = "view-wars t-clear h c-pointer line-h24 right last";
        button.href = "#";
        button.setAttribute('aria-labelledby', 'revive-checker');

        button.innerHTML = `
            <span class="icon-wrap svg-icon-wrap">
                <span class="link-icon-svg view-wars">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" aria-hidden="true">
                        <title>revive_checker</title>
                        <g opacity="0.35">
                            <path d="M0,1A45.3,45.3,0,0,0,8.37,11.62l.13.14h0l2.39,2.41a19,19,0,0,1-2.16,1.46l1,1,2.48-2.49A13.08,13.08,0,0,1,16,18l1-1a11.76,11.76,0,0,1-3.82-3.77l2.48-2.5-1-1a12.92,12.92,0,0,1-1.42,2.2c-1.58-1.59-3.11-3.12-4.69-4.56l0,0A45.48,45.48,0,0,0,0,1Z" fill="#fff"/>
                        </g>
                        <path d="M0,0A45.3,45.3,0,0,0,8.37,10.62l.13.14h0l2.39,2.41a19,19,0,0,1-2.16,1.46l1,1,2.48-2.49A13.08,13.08,0,0,1,16,17l1-1a11.76,11.76,0,0,1-3.82-3.77l2.48-2.5-1-1a12.92,12.92,0,0,1-1.42,2.2C11.63,9.29,10.1,7.76,8.52,6.32l0,0A45.48,45.48,0,0,0,0,0Z" fill="#777"/>
                    </svg>
                </span>
            </span>
            <span id="revive-checker">Revive Checker</span>`;

        button.onclick = function (e) {
            e.preventDefault();
            fetchFactionMembers();
        };

        linksTopWrap.appendChild(button);
    }

    // DOM ready for faction page
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addReviveButton);
    } else {
        addReviveButton();
    }

    // ------------- Messages compose autofill -------------
    function maybeAutofillCompose() {
        // Only act if hash contains p=compose and autofill=1
        const params = parseHashParams(location.hash);
        if ((params.p || params.P) !== "compose" || !params.autofill) return;

        // Poll for compose fields (SPA rendering)
        const start = Date.now();
        const timeoutMs = 15000;
        const interval = setInterval(() => {
            if (Date.now() - start > timeoutMs) {
                clearInterval(interval);
                return;
            }
            const filled = tryFillCompose(DEFAULT_SUBJECT, DEFAULT_BODY);
            if (filled) clearInterval(interval);
        }, 300);

        // Also react to hash changes (user navigates inside messages)
        window.addEventListener("hashchange", () => {
            const p2 = parseHashParams(location.hash);
            if ((p2.p || p2.P) === "compose" && p2.autofill) {
                tryFillCompose(DEFAULT_SUBJECT, DEFAULT_BODY);
            }
        });
    }

    function parseHashParams(hash) {
        const h = (hash || "").replace(/^#\/?/, "");
        // Hash may look like: p=compose&XID=12345&autofill=1
        return h.split("&").reduce((acc, part) => {
            const [k, v] = part.split("=");
            if (k) acc[decodeURIComponent(k)] = v ? decodeURIComponent(v) : "";
            return acc;
        }, {});
    }

    function tryFillCompose(subjectText, bodyText) {
        // Subject selectors
        const subjectCandidates = [
            'input[name="subject"]',
            'input[name="mailSubject"]',
            'input[type="text"][placeholder*="subject" i]',
            'input[type="text"][class*="subject" i]',
            'input[type="text"][data-placeholder*="subject" i]'
        ];

        // Body selectors (TinyMCE-first)
        const bodyCandidates = [
            '.mce-content-body[contenteditable="true"]',
            '.editor-content[contenteditable="true"]',
            'textarea[name="body"]',
            'textarea[name="mailBody"]',
            'textarea[class*="message" i]',
            'textarea[placeholder*="message" i]',
            'textarea',
            '[contenteditable="true"][class*="editor" i]',
            '[contenteditable="true"]'
        ];

        const subjectInput = findFirst(subjectCandidates);
        const bodyInput = findFirst(bodyCandidates);

        let ok = false;
        if (subjectInput) {
            setInputValue(subjectInput, subjectText);
            ok = true;
        }
        if (bodyInput) {
            setInputValue(bodyInput, bodyText, /*isBody*/ true);
            ok = true;
        }

        if (ok && subjectInput) {
            subjectInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return ok;
    }

    function findFirst(selectors) {
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
        return null;
    }

    // Helper to HTML-escape plain text
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Use TinyMCE if available; else execCommand; else innerHTML
    function setInputValue(el, value, isBody = false) {
        try {
            if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
                el.focus();
                el.value = value;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
                return;
            }

            if (el.getAttribute("contenteditable") === "true") {
                const tm = (typeof unsafeWindow !== "undefined" ? unsafeWindow.tinymce : window.tinymce);

                // If TinyMCE editor is managing this element, use its API
                if (tm && tm.activeEditor && tm.activeEditor.getBody && tm.activeEditor.getBody() === el) {
                    tm.activeEditor.setContent(
                        value.split('\n').map(line => `<p>${escapeHtml(line) || '<br>'}</p>`).join('')
                    );
                    tm.activeEditor.fire('input');
                    tm.activeEditor.fire('change');
                } else {
                    // Fallback 1: execCommand to mimic user typing
                    el.focus();
                    try {
                        const sel = document.getSelection();
                        if (sel) {
                            sel.removeAllRanges();
                            const range = document.createRange();
                            range.selectNodeContents(el);
                            sel.addRange(range);
                        }
                        document.execCommand('insertText', false, value);
                    } catch (_) {}

                    // Fallback 2: direct innerHTML with paragraphs
                    const expected = value.trim();
                    if (!el.textContent || el.textContent.trim() !== expected) {
                        el.innerHTML = value
                            .split('\n')
                            .map(line => `<p>${escapeHtml(line) || '<br>'}</p>`)
                            .join('');
                    }

                    // Fire typical events the app might listen for
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("keyup", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                }
                return;
            }

            // Generic fallback
            el.textContent = value;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (e) {
            console.warn("Failed to set value for", el, e);
        }
    }
})();
