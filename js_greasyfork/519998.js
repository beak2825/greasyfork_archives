// ==UserScript==
// @name            EmeraldX
// @namespace       https://greasyfork.org/
// @version         1.14
// @description     Reveal gender info, gender filter, auto rejoin, auto karma, blacklist filter, mod badge display, chat focus, and optionally remove inactive friends in EmeraldChat.
// @author          Zach
// @license         GPL-3.0
// @icon            https://emeraldchat.com/logo7.svg
// @match           https://emeraldchat.com/app
// @grant           GM_setValue
// @grant           GM_getValue
// @compatible      Firefox
// @compatible      Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/519998/EmeraldX.user.js
// @updateURL https://update.greasyfork.org/scripts/519998/EmeraldX.meta.js
// ==/UserScript==

'use strict';

// === LOAD SETTINGS FROM STORAGE ===
let uiVisible = GM_getValue('uiVisible', true);
let autoNextEnabled = GM_getValue('autoNextEnabled', false);
let autoKarmaEnabled = GM_getValue('autoKarmaEnabled', true);
let genderFilter = GM_getValue('genderFilter', 'all');
let blacklistKeywords = GM_getValue('blacklistKeywords', '');
let currentUserGender = null;
let currentUserInterests = [];

function saveSettings() {
    GM_setValue('uiVisible', uiVisible);
    GM_setValue('autoNextEnabled', autoNextEnabled);
    GM_setValue('autoKarmaEnabled', autoKarmaEnabled);
    GM_setValue('genderFilter', genderFilter);
    GM_setValue('blacklistKeywords', blacklistKeywords);
}

async function removeInactiveFriends() {
    const initial = await fetch('https://emeraldchat.com/friends_json').then(r => r.json());
    const allFriends = [...initial.friends];

    for (let offset = 8; offset < initial.count; offset += 8) {
        await new Promise(r => setTimeout(r, 150));
        const data = await fetch(`https://emeraldchat.com/load_friends_json?offset=${offset}`).then(r => r.json());
        if (!data?.length) break;
        allFriends.push(...data);
    }

    const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);
    const inactiveIds = allFriends
        .filter(f => !f.last_logged_in_at || new Date(f.last_logged_in_at).getTime() < sixMonthsAgo)
        .map(f => f.id);

    console.log(`Found ${inactiveIds.length} inactive:`, inactiveIds);

    if (inactiveIds.length && prompt(`Remove ${inactiveIds.length}? Type YES`) === 'YES') {
        for (const id of inactiveIds) {
            await new Promise(r => setTimeout(r, 200));
            await fetch(`https://emeraldchat.com/friends_destroy?id=${id}`);
        }
        console.log('Done!');
    }
}

// removeInactiveFriends();


function createSettingsButton() {
    const nav = document.querySelector(".navigation-notification-icons");
    if (!nav) return;

    nav.insertAdjacentHTML("afterbegin", `
        <span id="settings-toggle" class="material-icons navigation-notification-unit">tune</span>
        <div id="settings-menu">
            <label class="menu-btn menu-toggle">
                <span>Show Top UI</span>
                <label class="switch"><input type="checkbox" id="ui-checkbox" ${uiVisible ? 'checked' : ''}><span class="slider"></span></label>
            </label>

            <label class="menu-btn menu-toggle">
                <span>Auto Rejoin</span>
                <label class="switch"><input type="checkbox" id="auto-next-checkbox" ${autoNextEnabled ? 'checked' : ''}><span class="slider"></span></label>
            </label>

            <div class="menu-btn" id="gender-filter">
                <span>Gender Preference</span>
                <div class="segmented">
                    <label><input type="radio" name="gender" value="all" ${genderFilter === 'all' ? 'checked' : ''}><span>All</span></label>
                    <label><input type="radio" name="gender" value="men" ${genderFilter === 'men' ? 'checked' : ''}><span>Men</span></label>
                    <label><input type="radio" name="gender" value="women" ${genderFilter === 'women' ? 'checked' : ''}><span>Women</span></label>
                </div>
            </div>

            <label class="menu-btn menu-toggle">
                <span>Auto Karma</span>
                <label class="switch"><input type="checkbox" id="auto-karma-checkbox" ${autoKarmaEnabled ? 'checked' : ''}><span class="slider"></span></label>
            </label>

            <div class="menu-btn" id="blacklist-row">
                <span>Blacklist</span>
                <input id="blacklist-input" type="text" placeholder="Enter keywords..." value="${blacklistKeywords}">
            </div>
            <style>
            #settings-menu {
                position: fixed;
                display: none;
                flex-direction: column;
                gap: 0.7em;
                background: rgba(200,200,255,.12);
                border: 1px solid rgba(255,255,255,.18);
                backdrop-filter: blur(10px);
                border-radius: 0.9em;
                padding: 0.9em;
                min-width: 16em;
                color: #fff;
                font-family: "Segoe UI", Roboto, sans-serif;
                font-size: 15px;
                z-index: 1000;
                box-sizing: border-box;
                user-select: none;
            }

            .menu-btn {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: none;
                border-radius: 0.6em;
                padding: 1em 0.9em;
                line-height: 1.1;
                background: rgba(255,255,255,.1);
                color: #fff;
                cursor: pointer;
                width: 100%;
                font-size: 1em;
                -webkit-tap-highlight-color: transparent;
            }
            .menu-btn:active, .menu-btn:focus { background: rgba(255,255,255,.1); }

            #blacklist-input {
                flex: 1;
                margin-left: 0.7em;
                border: none;
                outline: none;
                border-radius: 0.6em;
                padding: 0.5em 0.8em;
                background: rgba(255,255,255,.15);
                color: #fff;
                font-size: 1em;
                font-family: inherit;
            }

            .switch {
                position: relative;
                width: 3.36em;
                height: 1.68em;
                flex-shrink: 0;
                pointer-events: none;
            }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(255,255,255,.35);
                border-radius: 2em;
                transition: .25s;
            }
            .slider:before {
                content: "";
                position: absolute;
                width: 1.2em; height: 1.2em;
                left: 0.24em; top: 0.24em;
                background: white;
                border-radius: 50%;
                transition: .25s;
            }
            input:checked + .slider { background: rgba(0,150,255,.5); }
            input:checked + .slider:before { transform: translateX(1.68em); }

            .segmented {
                display: flex;
                width: 100%;
                border-radius: 0.6em;
                overflow: hidden;
                background: rgba(255,255,255,.08);
                margin-left: 0.6em;
                border: 1px solid rgba(255,255,255,.15);
            }
            .segmented label {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                user-select: none;
                padding: 0.45em 0;
                font-size: 1em;
                border-right: 1px solid rgba(255,255,255,.15);
                transition: background .2s, font-weight .2s;
            }
            .segmented label:last-child { border-right: none; }
            .segmented input { display: none; }
            .segmented label:hover { background: rgba(255,255,255,.12); }
            .segmented label:has(input:checked) { background: rgba(0,150,255,.4); font-weight: 500; }
            </style>
        </div>
    `);

    const toggleBtn = document.getElementById("settings-toggle");
    const menu = document.getElementById("settings-menu");
    const uiCheckbox = menu.querySelector("#ui-checkbox");
    const autoNextCheckbox = menu.querySelector("#auto-next-checkbox");
    const autoKarmaCheckbox = menu.querySelector("#auto-karma-checkbox");
    const genderRadios = menu.querySelectorAll('input[name="gender"]');
    const blacklistInput = menu.querySelector("#blacklist-input");

    const positionMenu = () => {
        const r = toggleBtn.getBoundingClientRect(), w = menu.offsetWidth || 240, pad = 10;
        let l = r.left + r.width / 2 - w / 2, t = r.bottom + 6;
        l = Math.min(Math.max(pad, l), innerWidth - w - pad);
        menu.style.left = l + "px";
        menu.style.top = t + "px";
    };

    document.addEventListener("click", e => {
        if (e.target === toggleBtn) {
            const show = menu.style.display !== "flex";
            menu.style.display = show ? "flex" : "none";
            if (show) positionMenu();
        } else if (!menu.contains(e.target)) {
            menu.style.display = "none";
        }
    });

    new ResizeObserver(() => menu.style.display === "flex" && positionMenu()).observe(document.body);
    addEventListener("scroll", () => menu.style.display === "flex" && positionMenu(), true);

    // Change event listeners with persistence
    uiCheckbox.addEventListener("change", () => {
        uiVisible = uiCheckbox.checked;
        applyTopUIVisibility();
        saveSettings();
    });

    autoNextCheckbox.addEventListener("change", () => {
        autoNextEnabled = autoNextCheckbox.checked;
        saveSettings();
        if (autoNextEnabled) {
            setTimeout(() => nextChat(), 100);
        }
    });

    autoKarmaCheckbox.addEventListener("change", () => {
        autoKarmaEnabled = autoKarmaCheckbox.checked;
        saveSettings();
    });

    genderRadios.forEach(r =>
        r.addEventListener("change", () => {
            genderFilter = r.value;
            saveSettings();
            setTimeout(() => checkAndSkipIfNeeded(), 100);
        })
    );

    // Blacklist input - save on blur and Enter key
    blacklistInput.addEventListener("blur", () => {
        blacklistKeywords = blacklistInput.value.trim();
        saveSettings();
        console.log("Blacklist updated:", blacklistKeywords);
    });

    blacklistInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            blacklistKeywords = blacklistInput.value.trim();
            saveSettings();
            blacklistInput.blur();
            console.log("Blacklist updated:", blacklistKeywords);
            // Re-check current user against blacklist
            setTimeout(() => checkAndSkipIfNeeded(), 100);
        }
    });
}
createSettingsButton();

function createUI() {
    const html = `
        <div id="top-ui">
            <div id="profile-info" class="section">
                <p id="user-gender">Gender: Not Available</p>
                <p id="user-interests">Interests: None</p>
            </div>
            <style>
                #top-ui {
                    width: 100%;
                    background: rgba(200,200,255,0.1);
                    border-bottom: 1px solid rgba(255,255,255,0.15);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    font-family: "Segoe UI", Roboto, sans-serif;
                    transition: all 0.2s ease;
                }

                .hidden {
                    height: 0;
                    opacity: 0;
                    padding: 0;
                    margin: 0;
                }

                .section {
                    display: flex;
                    flex-direction: column;
                    padding: 6px 12px;
                    gap: 4px;
                }

                #user-gender, #user-interests {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255,255,255,0.2);
                    border-radius: 8px;
                    padding: 6px 10px;
                    font-size: 13px;
                    color: #fff;
                }

                #user-gender.male { background: rgba(0,120,255,0.25); }
                #user-gender.female { background: rgba(255,105,180,0.25); }
                #user-interests.blacklisted {
                    background: rgba(255,50,50,0.35);
                    border: 1px solid rgba(255,100,100,0.5);
                }

                .mod-badge {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    margin-left: auto;
                }
            </style>
        </div>
    `;

    const insertUI = () => {
        const messages = document.getElementById("messages");
        if (messages && !document.getElementById("top-ui")) {
            messages.insertAdjacentHTML("beforebegin", html);
            applyTopUIVisibility();
        }
    };

    new MutationObserver(insertUI).observe(document.body, { childList: true, subtree: true });
}
createUI();

// === CHAT BEHAVIOR ===
function focusChat() {
    const chatInput = document.getElementById("room-input");
    if (!chatInput) return;

    document.body.addEventListener(
        "keydown",
        (event) => {
            if (
                !document.querySelector("#ui-hatch > *, #ui-hatch-2 > *, #interests") &&
                event.key !== "`"
            ) {
                chatInput.focus();
            }
        },
        { once: true }
    );
}

// === FETCH USER INFO ===
let lastMatchedId = null;

function simulateProfileRequest() {
    const matchEl = document.querySelector(
        '#room .room-component-center #messages .room-component-print #matched-message[data-matched-id]'
    );
    const userId = matchEl?.dataset.matchedId;
    if (!userId || userId === lastMatchedId) return;
    lastMatchedId = userId;

    fetch(`https://emeraldchat.com/profile_json?id=${userId}`)
        .then((res) => res.json())
        .then(({ user }) => {
            const genderEl = document.getElementById("user-gender");
            const interestsEl = document.getElementById("user-interests");

            const gender = user.gender === "m" ? "Male" : "Female";
            const modBadge = user.mod ? '<span class="mod-badge">MOD</span>' : '';
            genderEl.innerHTML = `Gender: ${gender}${modBadge}`;
            genderEl.className = user.gender === "m" ? "male" : "female";

            const interests = user.interests?.map((i) => i.name).join(", ") || "None";
            interestsEl.textContent = `Interests: ${interests}`;

            currentUserGender = user.gender;
            currentUserInterests = user.interests?.map((i) => i.name.toLowerCase()) || [];

            checkAndSkipIfNeeded();
        })
        .catch((err) => console.error("Profile fetch failed:", err));
}

// === CHECK FILTERS AND SKIP ===
function checkAndSkipIfNeeded() {
    let shouldSkip = false;
    const interestsEl = document.getElementById("user-interests");

    // Check gender filter
    if (genderFilter !== "all") {
        const genderMismatch =
            (genderFilter === "men" && currentUserGender !== "m") ||
            (genderFilter === "women" && currentUserGender !== "f");

        if (genderMismatch) {
            console.log(`Skipping user - Filter: ${genderFilter}, User: ${currentUserGender}`);
            shouldSkip = true;
        }
    }

    // Check blacklist
    if (blacklistKeywords && currentUserInterests.length > 0) {
        const keywords = blacklistKeywords
            .toLowerCase()
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        const hasBlacklistedInterest = currentUserInterests.some(interest =>
            keywords.some(keyword => interest.includes(keyword))
        );

        if (hasBlacklistedInterest) {
            console.log(`Skipping user - Blacklisted interest found in: ${currentUserInterests.join(', ')}`);
            if (interestsEl) {
                interestsEl.classList.add('blacklisted');
            }
            shouldSkip = true;
        } else if (interestsEl) {
            interestsEl.classList.remove('blacklisted');
        }
    }

    if (shouldSkip) {
        skipToNextChat();
    }
}

function skipToNextChat() {
    const nextButton = document.querySelector("div.ui-button-match");
    if (nextButton) {
        // Click twice to skip to next chat
        simulateClick(nextButton);
        setTimeout(() => {
            simulateClick(nextButton);
        }, 100);
    }
}

// === SIMULATED CLICK ===
function simulateClick(el) {
    ["mousedown", "mouseup", "click"].forEach((type) => el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true })));
}

function nextChat() {
    if (!autoNextEnabled) return;
    const next = document.querySelector("div.ui-button-match-mega");
    if (next) simulateClick(next);
}

function giveKarma() {
    if (!autoKarmaEnabled) return;
    const [good, bad] = document.querySelectorAll("a.ui-button-match-mega");
    if (!good || !bad) return;

    const messages = document.querySelectorAll("#messages > .room-component-message-container").length;
    if (messages > 5) simulateClick(good);
    // else if (messages < 2) simulateClick(bad);
}

// === OBSERVER ===
function observeChanges() {
    const container = document.getElementById("container");
    if (!container) return;

    new MutationObserver(() => {
        giveKarma();
        nextChat();
        simulateProfileRequest();
        focusChat();
    }).observe(container, { childList: true, subtree: true });
}

// === HELPERS ===
function applyTopUIVisibility() {
    const ui = document.getElementById("top-ui");
    if (ui) ui.classList.toggle("hidden", !uiVisible);
}

// === INIT ===
createUI();
observeChanges();