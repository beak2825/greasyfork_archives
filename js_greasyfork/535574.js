// ==UserScript==
// @name         GGn TheLounge User Data Enhancement
// @version      3.2.1
// @author       SleepingGiant
// @description  Append GGn class emoji to usernames with a customizable UI
// @namespace    https://greasyfork.org/users/1395131
// @include      *:9000/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @connect      gazellegames.net
// @downloadURL https://update.greasyfork.org/scripts/535574/GGn%20TheLounge%20User%20Data%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/535574/GGn%20TheLounge%20User%20Data%20Enhancement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (typeof window.requestIdleCallback !== 'function') {
        window.requestIdleCallback = function (cb) { return setTimeout(cb, 0); };
    }

    console.debug("GGn TheLounge User Data Enhancement starting...");

    const API_URL = 'https://gazellegames.net/api.php';
    const RATE_LIMIT_MS = 3000;
    const CACHE_DURATION_MS = 36 * 60 * 60 * 1000; // 1.5 days. Makes loading smoother and people's user classes don't change much.
    let lastApiCallTime = Date.now();
    const uncachedUsers = new Set();

    const defaultClassToEmoji = {
        "Amateur": "👶",
        "Gamer": "🎲",
        "Pro Gamer": "🕹️",
        "Elite Gamer": "🎮",
        "Legendary Gamer": "🌟",
        "Master Gamer": "⚡",
        "Gaming God": "🏆",
        "Staff Trainee": "🛠️",
        "Moderator": "🧹",
        "Senior Moderator": "🛡️",
        "Team Leader": "🥇",
        "Junior Developer": "💻",
        "Senior Developer": "💻",
        "SysOp": "⚙️",
        "Administrator": "👑",
        "Uploader": "📦",
        "VIP": "💎",
        "VIP+": "💎",
        "Legend": "💎",
        "Bot": "🤖",
        "undefined": "❓",

        // Below here are not actual user classes but I am too lazy to rewrite it all for this.
        "prepend_warn": "⚠️",
        "prepend_disabled": "🚫",
        "prepend_friend": "❤️",
        "low_gold": "⬇️💰",
        "negative_gold": "❗💰",
        "low_chance": "🍀",
    };

    let classToEmoji = {};

    async function loadClassMap() {
        console.debug("Loading class emoji map...");
        const saved = await GM.getValue("customClassMap");
        const savedMap = saved ? JSON.parse(saved) : {};

        // Build classToEmoji using only keys from defaultClassToEmoji. Allows for default on new keys and removing old keys naturally.
        classToEmoji = {};
        for (const key of Object.keys(defaultClassToEmoji)) {
            classToEmoji[key] = key in savedMap ? savedMap[key] : defaultClassToEmoji[key];
        }

        console.debug("Loaded classToEmoji:", classToEmoji);
    }

    const defaultEmojiVisibility = {
        class: true,
        warn: true,
        disabled: true,
        friend: true,
        lowGold: false,
        lowGoldLowClass: true,
        negativeGold: true,
        displayChanceEmoji: true,
    };
    let emojiVisibility = {};


    async function loadEmojiVisibility() {
        console.debug("Loading emoji visibility settings...");
        const saved = await GM.getValue("emojiVisibilitySettings");
        const savedMap = saved ? JSON.parse(saved) : {};

        emojiVisibility = {};
        for (const key of Object.keys(defaultEmojiVisibility)) {
            emojiVisibility[key] = key in savedMap ? savedMap[key] : defaultEmojiVisibility[key];
        }

        console.debug("Loaded emojiVisibility:", emojiVisibility);
    }



    async function saveClassMap() {
        console.debug("Saving class emoji map:", classToEmoji);
        await GM.setValue("customClassMap", JSON.stringify(classToEmoji));
    }

    async function getApiKey() {
        console.debug("Getting API key...");
        let apiKey = await GM.getValue("apiKey");
        if (!apiKey) {
            apiKey = prompt("Enter your GazelleGames API key. Required permissions: \"User\":")?.trim();
            if (apiKey) await GM.setValue("apiKey", apiKey);
        }
        return apiKey;
    }

    async function getCached(username) {
        const key = `userCache_${username}`;
        const raw = await GM.getValue(key);
        if (!raw) return null;
        const { timestamp, data } = JSON.parse(raw);
        const expired = (Date.now() - timestamp) > CACHE_DURATION_MS;
        if (!expired && data && Object.keys(data).length > 0) return data;
        console.debug(`Cache miss or expired for ${username}`);
        return null;
    }

    async function setCached(username, data) {
        console.debug(`Caching data for user: ${username}`, data);
        const key = `userCache_${username}`;
        await GM.setValue(key, JSON.stringify({ timestamp: Date.now(), data }));
    }

    async function fetchUserInfo(username) {
        console.debug(`Fetching user info for: ${username}`);
        const now = Date.now();
        if ((now - lastApiCallTime) < RATE_LIMIT_MS) {
            console.debug("Rate limit hit, skipping request");
            return null;
        }
        lastApiCallTime = now;
        const apiKey = await getApiKey();
        if (!apiKey) {
            console.debug("No API key available");
            return null;
        }

        const url = `${API_URL}?key=${encodeURIComponent(apiKey)}&request=user&name=${encodeURIComponent(username)}`;
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: 'GET',
                url,
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        console.debug("Response data:")
                        console.debug(data);
                        if (res.status !== 200 || data?.status === "failure") {
                            console.debug("API error response:", data);
                            resolve(data?.error === "no such user" ? { invalidUser: true } : null);
                        } else resolve(data);
                    } catch {
                        resolve(null);
                    }
                },
                onerror: (e) => {
                    console.debug("Request error:", e);
                    resolve(null);
                }
            });
        });
    }

    async function annotateUser(userEl) {
        const username = userEl.getAttribute('data-name');
        if (!username || userEl.dataset.emojiAppended === "true") return;
        const isBot = (username === "Vertigo" || username === "InfoBot" || username === "Antilopinae" || username === "RuleBot");

        let data = await getCached(username);
        if (!data) {
            console.debug(`User ${username} not cached, adding to queue`);
            uncachedUsers.add(username);
            return;
        }

        const personal = data?.response?.personal;
        const userClass = personal?.class;
        const isWarned = personal?.warned;
        const isDisabled = !personal?.enabled;
        const isFriend = data?.response?.isFriend;
        console.debug(username, isFriend);

        const emoji = classToEmoji[userClass];
        const warnEmoji = classToEmoji["prepend_warn"] ?? "";
        const disabledEmoji = classToEmoji["prepend_disabled"] ?? "";
        const friendEmoji = classToEmoji["prepend_friend"] ?? "";
        const lowGoldEmoji = classToEmoji["low_gold"] ?? "";
        const negativeGoldEmoji = classToEmoji["negative_gold"] ?? "";
        const lowChanceEmoji = classToEmoji["low_chance"] ?? "";

        const lowClass = ["Amateur", "Gamer", "Pro Gamer"].includes(userClass);
        const goldValue = data?.response?.stats?.gold;
        let goldEmoji = '';

        if (goldValue !== undefined && goldValue !== null) {
            const isNegative = emojiVisibility.negativeGold && goldValue < 0;
            const isLowGold =
                (emojiVisibility.lowGoldLowClass && lowClass && goldValue < 10000) ||
                (emojiVisibility.lowGold && goldValue < 10000);


            if (isNegative) {
                goldEmoji += negativeGoldEmoji;
            } else if (isLowGold) {
                goldEmoji += lowGoldEmoji;
            }
        }

        const buffChanceNumber = parseFloat(data?.response?.buffs?.Chance);

        const prependEmoji =
            (emojiVisibility.warn && isWarned ? warnEmoji : '') +
            (emojiVisibility.disabled && isDisabled ? disabledEmoji : '') +
            (emojiVisibility.friend && isFriend ? friendEmoji : '') +
            goldEmoji +
            (emojiVisibility.displayChanceEmoji && buffChanceNumber === 1 ? lowChanceEmoji : '');

        userEl.dataset.emojiAppended = "true";

        // Clear old emoji spans if re-rendering
        userEl.querySelectorAll('.inline-emoji').forEach(e => e.remove());

        // Prepend span
        if (prependEmoji.trim() && !isBot) {
            const pre = document.createElement('span');
            pre.className = 'inline-emoji';
            pre.textContent = prependEmoji;
            pre.style.marginRight = '4px';
            pre.style.pointerEvents = 'none';
            pre.style.userSelect = 'none';
            userEl.insertBefore(pre, userEl.firstChild);
        }

        if (emojiVisibility.class && emoji) {
            const post = document.createElement('span');
            post.className = 'inline-emoji';
            post.textContent = emoji;
            post.style.marginLeft = '4px';
            post.style.pointerEvents = 'none';
            post.style.userSelect = 'none';
            userEl.appendChild(post);
        }
    }



    async function scanRecentMessages() {
        console.debug("Scanning recent messages...");
        const seen = new WeakSet();
        const messages = Array.from(document.querySelectorAll('.msg[data-type="message"] .user')).reverse();
        for (const userEl of messages) {
            if (!seen.has(userEl) && userEl.dataset.emojiAppended !== "true") {
                seen.add(userEl);
                requestIdleCallback(() => annotateUser(userEl));
            }
        }
    }

    function init() {
        console.debug("Initializing message observer...");
        const msgContainer = document.querySelector('.messages');
        if (!msgContainer) {
            console.debug("No message container found.");
            return;
        }
        const style = document.createElement('style');
        document.head.insertAdjacentHTML('beforeend', `
            <style>
            .inline-emoji {
            font-size: inherit;
            vertical-align: middle;
            }
            </style>
        `);
        document.head.appendChild(style);
        new MutationObserver(scanRecentMessages).observe(msgContainer, { childList: true, subtree: true });
        injectCSS();
        scanRecentMessages();
    }

    function injectCSS() {
        const css = `
            .inline-emoji {
                font-size: 0.8em !important;
                line-height: 1em !important;
                vertical-align: middle;
                width: 1em;
                overflow: hidden;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    (async () => {
        console.debug("Running main async block");
        await loadClassMap();
        await loadEmojiVisibility();
        const appCheck = setInterval(() => {
            const app = document.getElementById('app');
            if (app) {
                clearInterval(appCheck);
                console.debug("App container found, initializing UI");
                addScriptSettingsButton();
                init();
                openUserContextMenu();
            }
        }, 100);

        // Background fetching loop. If you see 50 uncached users on first load for example, queue them up and iterate over, makes initial load easier.
        setInterval(async () => {
            const [username] = uncachedUsers;
            if (!username) return;

            const data = await fetchUserInfo(username);
            if (data) {
                await setCached(username, data);
                uncachedUsers.delete(username);   // only now!
                scanRecentMessages();             // will paint the emoji
            }
        }, RATE_LIMIT_MS);

        setInterval(async () => {
            scanRecentMessages();
        }, 60000) // Every 60 seconds do a rescan. Force pulse check (attempting to debug emojis stopping rendering. This does not need to stay)

    })();


    // ------------ Custom Emoji Edit button below (nothing to do with actual user polling) ----------
    function createSettingsUI() {
        let currentRenderFn = null;
        console.debug("Creating routed settings UI");

        const modal = document.createElement('div');
        modal.style = `
        position: fixed; top: 50%; left: 50%;
        background: #fff; color: #000;
        border: 2px solid #ccc; border-radius: 10px;
        padding: 0; z-index: 9999; width: 400px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        overflow: hidden;
        font-family: sans-serif;
        transform: translate(-50%, -50%);
    `;
        modal.setAttribute("id", "enhancementSettingsModal");

        const header = document.createElement('div');
        header.style = `
        background-color: #eee;
        padding: 10px;
        font-weight: bold;
        position: relative;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

        const titleContainer = document.createElement('div');
        titleContainer.style = 'display: flex; align-items: center; gap: 10px;';

        const backBtn = document.createElement('span');
        backBtn.innerHTML = '←';
        backBtn.style = `cursor: pointer; font-size: 18px; display: none;`;

        const title = document.createElement('span');
        title.textContent = 'Enhancement Settings';

        titleContainer.appendChild(backBtn);
        titleContainer.appendChild(title);

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = `color: red; font-size: 18px; font-weight: bold; cursor: pointer;`;
        closeBtn.onclick = () => modal.remove();

        header.appendChild(titleContainer);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.padding = '10px';

        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);

        const routeStack = [];

        function setPage(titleText, renderFn) {
            currentRenderFn = renderFn;
            title.textContent = titleText;
            content.innerHTML = '';
            renderFn(content);
            backBtn.style.display = routeStack.length > 0 ? 'inline' : 'none';
        }

        backBtn.onclick = () => {
            const prev = routeStack.pop();
            if (prev) setPage(prev.title, prev.renderFn);
        };

        function setLandingPage() {
            routeStack.length = 0;
            setPage('Enhancement Settings', (container) => {
                const options = [
                    ['Emojis on Name', () => setSubPage('Emojis on Name', renderEmojiEditor)],
                    ['Profile Visibility', () => setSubPage('Profile Visibility', renderProfileVisibilitySettingsPage)],
                    ['Cached Warnings', () => setSubPage('Users With Warnings', renderWarningList)],
                    ['Emoji Visibility', () => setSubPage('Emoji Visibility', renderEmojiVisibilityPage)],
                ];
                options.forEach(([label, onClick]) => {
                    const btn = document.createElement('button');
                    btn.textContent = label;
                    btn.style = `
                    display: block; width: 100%;
                    margin-bottom: 10px; padding: 10px;
                    font-size: 16px; border-radius: 6px;
                    cursor: pointer; border: 1px solid #ccc;
                    background: #f9f9f9;
                `;
                    btn.onclick = onClick;
                    container.appendChild(btn);
                });
            });
        }

        function setSubPage(titleText, renderFn) {
            routeStack.push({ title: title.textContent, renderFn: currentRenderFn });
            setPage(titleText, renderFn);
        }

        makeElementDraggable(modal, header);
        setLandingPage();
    }

    function renderEmojiVisibilityPage(container) {
        const form = document.createElement('form');
        form.style.maxHeight = '300px';
        form.style.overflowY = 'auto';

        const checkboxes = {};

        const fields = [
            ['class', 'Show Class Emojis'],
            ['warn', 'Show Warn Emoji'],
            ['disabled', 'Show Disabled Emoji'],
            ['friend', 'Show Friend Emoji'],
            ['lowGold', 'Show Low Gold Emoji (All)'],
            ['lowGoldLowClass', 'Show Low Gold Emoji (Power User and Below)'],
            ['negativeGold', 'Show Negative Gold Emoji'],
            ['displayChanceEmoji', 'Show 🍀 for users with 1x chance']
        ];

        fields.forEach(([key, label]) => {
            const row = document.createElement('label');
            row.style.display = 'block';
            row.style.marginBottom = '6px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = emojiVisibility[key];
            checkboxes[key] = checkbox;

            row.appendChild(checkbox);
            row.append(` ${label}`);
            form.appendChild(row);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style = `margin-top: 10px; margin-right: 10px; padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;`;
        saveBtn.onclick = async (e) => {
            e.preventDefault();
            for (const key in checkboxes) {
                emojiVisibility[key] = checkboxes[key].checked;
            }
            await GM.setValue("emojiVisibilitySettings", JSON.stringify(emojiVisibility));
            document.querySelector('#enhancementSettingsModal span').click();
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style = `margin-top: 10px; padding: 8px 12px; background-color: #f44336; color: white; border: none; border-radius: 5px;`;
        resetBtn.onclick = async (e) => {
            e.preventDefault();
            for (const key in defaultEmojiVisibility) {
                emojiVisibility[key] = defaultEmojiVisibility[key];
                checkboxes[key].checked = defaultEmojiVisibility[key];
            }
            await GM.setValue("emojiVisibilitySettings", JSON.stringify(emojiVisibility));
        };

        container.appendChild(form);
        container.appendChild(saveBtn);
        container.appendChild(resetBtn);
    }


    function makeElementDraggable(el, handle) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        handle.style.cursor = 'move';

        handle.addEventListener('mousedown', function (e) {
            isDragging = true;

            // Remove transform if still present and switch to absolute positioning. Without this on first click it'll "jump" around
            if (el.style.transform.includes('translate')) {
                const rect = el.getBoundingClientRect();
                el.style.left = `${rect.left}px`;
                el.style.top = `${rect.top}px`;
                el.style.transform = 'none';
            }

            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
            e.preventDefault();
        });

        function moveHandler(e) {
            if (!isDragging) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        }

        function upHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
    }


    function renderEmojiEditor(container) {
        const form = document.createElement('form');
        form.style.maxHeight = '300px';
        form.style.overflowY = 'auto';

        Object.entries(classToEmoji).forEach(([cls, emoji]) => {
            const row = document.createElement('div');
            row.innerHTML = `
            <label style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span>${cls}</span>
                <input type="text" value="${emoji}" data-class="${cls}" style="width: 50px; text-align:center" />
            </label>
        `;
            form.appendChild(row);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style = `margin-top: 10px; margin-right: 10px; padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;`;
        saveBtn.onclick = async (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            classToEmoji = {};
            inputs.forEach(input => {
                const cls = input.getAttribute('data-class');
                classToEmoji[cls] = input.value;
            });
            await saveClassMap();
            document.querySelector('#enhancementSettingsModal span').click();
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style = `margin-top: 10px; padding: 8px 12px; background-color: #f44336; color: white; border: none; border-radius: 5px;`;
        resetBtn.onclick = async (e) => {
            e.preventDefault();
            if (!confirm('Reset emoji mappings to default?')) return;
            classToEmoji = { ...defaultClassToEmoji };
            await saveClassMap();
            renderEmojiEditor(container);
        };

        container.appendChild(form);
        container.appendChild(saveBtn);
        container.appendChild(resetBtn);
    }

    function renderProfileVisibilitySettingsPage(container) {
        const form = document.createElement('form');
        form.style.maxHeight = '300px';
        form.style.overflowY = 'auto';

        const selected = new Set(getSelectedFields());
        const checkboxes = {};

        const fieldOptions = [
            // top-level
            ['id', 'User ID'],
            ['username', 'Username'],
            ['avatar', 'Avatar'],
            ['avatarType', 'Avatar Type'],
            ['isFriend', 'Friend'],

            // stats
            ['joinedDate', 'Joined'],
            ['lastAccess', 'Last Seen'],
            ['onIRC', 'IRC'],
            ['torrentsUploaded', 'Torrents Uploaded'],
            ['uploaded', 'Uploaded'],
            ['downloaded', 'Downloaded'],
            ['fullDownloaded', 'Full Downloaded'],
            ['purchasedDownload', 'Purchased Download'],
            ['ratio', 'Ratio'],
            ['requiredRatio', 'Required Ratio'],
            ['shareScore', 'Share Score'],
            ['gold', 'Gold'],

            // personal
            ['class', 'Class'],
            ['facilitator', 'Facilitator'],
            ['hnrs', 'HNRS'],
            ['donor', 'Donor'],
            ['warned', 'Warned'],
            ['enabled', 'Enabled'],
            ['publicKey', 'Public Key'],
            ['parked', 'Parked'],
            ['paranoiaText', 'Paranoia'],

            // community
            ['clan', 'Clan'],
            ['profileViews', 'Profile Views'],
            ['hourlyGold', 'Hourly Gold'],
            ['posts', 'Forum Posts'],
            ['actualPosts', 'Raw Forum Posts'],
            ['threads', 'Threads'],
            ['forumLikes', 'Likes'],
            ['forumDislikes', 'Dislikes'],
            ['ircLines', 'IRC Lines'],
            ['ircActualLines', 'Raw IRC Lines'],
            ['torrentComments', 'Torrent Comments'],
            ['collections', 'Collections'],
            ['requestsFilled', 'Requests Filled'],
            ['bountyEarnedUpload', 'Bounty Earned (Upload)'],
            ['bountyEarnedGold', 'Bounty Earned (Gold)'],
            ['requestsVoted', 'Requests Voted'],
            ['bountySpentUpload', 'Bounty Spent (Upload)'],
            ['bountySpentGold', 'Bounty Spent (Gold)'],
            ['reviews', 'Reviews'],
            ['seeding', 'Seeding'],
            ['leeching', 'Leeching'],
            ['snatched', 'Snatched'],
            ['uniqueSnatched', 'Unique Snatched'],
            ['seedSize', 'Seed Size'],
            ['invited', 'Invited users'],

            // buffs
            ['buffUpload', 'Buff: Upload'],
            ['buffDownload', 'Buff: Download'],
            ['buffForumPosts', 'Buff: Forum Posts'],
            ['buffIRCLines', 'Buff: IRC Lines'],
            ['buffIRCBonus', 'Buff: IRC Bonus'],
            ['buffCommunityXP', 'Buff: Community XP'],
            ['buffTorrentsXP', 'Buff: Torrents XP'],
            ['buffCommunityGold', 'Buff: Community Gold'],
            ['buffTorrentsGold', 'Buff: Torrents Gold'],
            ['buffItemCost', 'Buff: Item Cost'],
            ['buffBountyFrom', 'Buff: Bounty From'],
            ['buffBountyOn', 'Buff: Bounty On'],
            ['buffChance', 'Buff: Chance']
        ];



        fieldOptions.forEach(([key, label]) => {
            const row = document.createElement('label');
            row.style.display = 'block';
            row.style.marginBottom = '6px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = selected.has(key);
            checkboxes[key] = checkbox;

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) selected.add(key);
                else selected.delete(key);
                setSelectedFields(Array.from(selected));
            });

            row.appendChild(checkbox);
            row.append(' ' + label);
            form.appendChild(row);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style = `margin-top: 10px; margin-right: 10px; padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;`;
        saveBtn.onclick = (e) => {
            e.preventDefault();
            // just close via back button
            document.querySelector('#enhancementSettingsModal span').click();
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style = `margin-top: 10px; padding: 8px 12px; background-color: #f44336; color: white; border: none; border-radius: 5px;`;
        resetBtn.onclick = (e) => {
            e.preventDefault();
            const defaults = new Set(JSON.parse(defaultProfileVisibilitySelectedFiels));

            // Uncheck everything, then re-check only defaults
            Object.entries(checkboxes).forEach(([key, chk]) => {
                const shouldBeChecked = defaults.has(key);
                chk.checked = shouldBeChecked;

                if (shouldBeChecked) selected.add(key);
                else selected.delete(key);
            });

            setSelectedFields(Array.from(selected));
        };

        container.appendChild(form);
        container.appendChild(saveBtn);
        container.appendChild(resetBtn);
    }


    async function renderWarningList(container) {
        const form = document.createElement('form');
        const keys = await GM.listValues();
        const warningUsers = [];

        const now = Date.now();

        for (const key of keys) {
            if (key.startsWith('userCache_')) {
                const raw = await GM.getValue(key);
                if (!raw) continue;

                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch {
                    continue; // skip malformed cache
                }

                const { timestamp, data } = parsed;
                const expired = (now - timestamp) > CACHE_DURATION_MS;
                if (expired || !data?.response?.personal?.warned) continue;

                const username = key.replace('userCache_', '');
                warningUsers.push(username);
            }
        }

        if (warningUsers.length === 0) {
            container.innerHTML = `<p>No users with valid, cached warnings.</p>`;
            return;
        }

        const ul = document.createElement('ul');
        warningUsers.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            ul.appendChild(li);
        });

        ul.style.maxHeight = '300px';
        ul.style.overflowY = 'auto';
        ul.style.paddingLeft = '20px';

        container.appendChild(ul);
    }

    function addScriptSettingsButton() {
        console.debug("Attempting to add settings button");
        const footerCheck = setInterval(() => {
            const footer = document.getElementById('footer');
            if (footer) {
                clearInterval(footerCheck);
                console.debug("Footer found, adding button");
                const btn = document.createElement('button');
                btn.textContent = 'Edit Enhancer';
                btn.style = 'margin-left: 10px; padding: 4px 8px; font-size: 12px;';
                btn.onclick = createSettingsUI;
                footer.appendChild(btn);
            }
        }, 1000);
    }


    // ------------ Custom User Selection Data Enhancement below (nothing to do with actual user polling) ----------

    function openUserContextMenu() {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (
                        node.nodeType === 1 &&
                        node.id === 'context-menu-container'
                    ) {
                        const menu = node.querySelector('#context-menu');
                        const userItem = menu?.querySelector('.context-menu-user');
                        const username = userItem?.textContent?.trim();
                        if (!username) return;

                        const data = await getCached(username);
                        const hasResp = !!data?.response;

                        // Only read these when we actually have a response
                        let isFriend, id;
                        if (hasResp) {
                            ({ isFriend, id } = data.response);
                        }
                        const profileURL = hasResp && id ? `https://gazellegames.net/user.php?id=${id}` : null;

                        // Wrap existing items in a new container
                        const existingItems = Array.from(menu.children).filter(child => child.tagName === 'LI' || child.classList.contains('context-menu-divider'));
                        const leftDiv = document.createElement('div');
                        leftDiv.style.flex = '1';
                        existingItems.forEach(item => leftDiv.appendChild(item));

                        const bg = window.getComputedStyle(menu).backgroundColor;
                        const rgb = bg.match(/\d+/g).map(Number);
                        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 255000; // Normalize 0-1.

                        const textColor = brightness < 0.4 ? 'white' : 'black'; // Give slight favor to black (up to 60%)

                        const rows = [];

                        function addRow(label, value) {
                            if (value !== undefined && value !== null && !/^\s*$/.test(value)) // regex checks for only whitespace
                                rows.push(`<div><strong>${label}:</strong> ${value}</div>`);
                        }
                        const s = hasResp ? (data.response.stats || {}) : {};
                        const p = hasResp ? (data.response.personal || {}) : {};
                        const c = hasResp ? (data.response.community || {}) : {};
                        const b = hasResp ? (data.response.buffs || {}) : {};
                        const top = hasResp ? (data.response || {}) : {};
                        const selectedFields = getSelectedFields();

                        if (hasResp) {
                            if (selectedFields.includes('avatar')) {
                                const avatarItem = document.createElement('li');
                                avatarItem.className = 'context-menu-item';
                                avatarItem.role = 'menuitem';
                                avatarItem.innerHTML = `<img src="${top.avatar}" style="max-height:80px; vertical-align: middle;">`;
                                leftDiv.insertBefore(avatarItem, leftDiv.children[1]); // Insert right after the username
                            }

                            if (selectedFields.includes('id')) addRow('User ID', top.id);
                            if (selectedFields.includes('username')) addRow('Username', top.username);
                            if (selectedFields.includes('avatarType')) addRow('Avatar Type', top.avatarType);
                            if (selectedFields.includes('profile')) {
                                rows.push(`<div><a href="${profileURL}" target="_blank" style="color: #4ea1d3;">Profile</a></div>`);
                            }
                            if (selectedFields.includes('isFriend')) addRow('Friend', isFriend ? '✅' : '❌');

                            if (selectedFields.includes('joinedDate')) addRow('Joined', formatDate(s.joinedDate));
                            if (selectedFields.includes('lastAccess')) addRow('Last Seen', formatDate(s.lastAccess));
                            if (selectedFields.includes('onIRC')) addRow('IRC', s.onIRC ? '✅' : '❌');
                            if (selectedFields.includes('gold')) {
                                let gold = s.gold;
                                if (typeof gold === 'string' && gold.includes('-')) {
                                    gold = `<span style="color:red; font-weight:bold;">${gold}</span>`;
                                }
                                addRow('Gold', gold);
                            }
                            if (selectedFields.includes('torrentsUploaded')) addRow('Torrents Uploaded', c.uploaded); // it's out of place with the rest of c but seems right for actual UI.
                            if (selectedFields.includes('uploaded')) addRow('Uploaded', formatBytes(s.uploaded));
                            if (selectedFields.includes('downloaded')) addRow('Downloaded', formatBytes(s.downloaded));
                            if (selectedFields.includes('fullDownloaded')) addRow('Full Downloaded', formatBytes(s.fullDownloaded));
                            if (selectedFields.includes('purchasedDownload')) addRow('Purchased Download', formatBytes(s.purchasedDownload));
                            if (selectedFields.includes('ratio')) addRow('Ratio', s.ratio);
                            if (selectedFields.includes('requiredRatio')) addRow('Required Ratio', s.requiredRatio);
                            if (selectedFields.includes('shareScore')) addRow('Share Score', s.shareScore);

                            if (selectedFields.includes('class')) addRow('Class', p.class);
                            if (selectedFields.includes('facilitator')) addRow('Facilitator', p.facilitator ? '✅' : '❌');
                            if (selectedFields.includes('hnrs')) addRow('HNRS', p.hnrs);
                            if (selectedFields.includes('donor')) addRow('Donor', p.donor ? '✅' : '❌');
                            if (selectedFields.includes('warned')) addRow('Warned', p.warned ? '⚠️' : 'No');
                            if (selectedFields.includes('enabled')) addRow('Enabled', p.enabled ? '✅' : '❌');
                            if (selectedFields.includes('publicKey')) addRow('Public Key', p.publicKey);
                            if (selectedFields.includes('parked')) addRow('Parked', p.parked ? '✅' : '❌');
                            if (selectedFields.includes('paranoiaText')) addRow('Paranoia', p.paranoiaText);

                            if (selectedFields.includes('clan')) addRow('Clan', c.clan);
                            if (selectedFields.includes('profileViews')) addRow('Profile Views', c.profileViews);
                            if (selectedFields.includes('hourlyGold')) addRow('Hourly Gold', c.hourlyGold);
                            if (selectedFields.includes('posts')) addRow('Forum Posts', c.posts);
                            if (selectedFields.includes('actualPosts')) addRow('Raw Forum Posts', c.actualPosts);
                            if (selectedFields.includes('threads')) addRow('Threads', c.threads);
                            if (selectedFields.includes('forumLikes')) addRow('Likes', c.forumLikes);
                            if (selectedFields.includes('forumDislikes')) addRow('Dislikes', c.forumDislikes);
                            if (selectedFields.includes('ircLines')) addRow('IRC Lines', c.ircLines);
                            if (selectedFields.includes('ircActualLines')) addRow('Raw IRC Lines', c.ircActualLines);
                            if (selectedFields.includes('torrentComments')) addRow('Torrent Comments', c.torrentComments);
                            if (selectedFields.includes('collections')) addRow('Collections', c.collections);
                            if (selectedFields.includes('requestsFilled')) addRow('Requests Filled', c.requestsFilled);
                            if (selectedFields.includes('bountyEarnedUpload')) addRow('Bounty Earned (Upload)', c.bountyEarnedUpload);
                            if (selectedFields.includes('bountyEarnedGold')) addRow('Bounty Earned (Gold)', c.bountyEarnedGold);
                            if (selectedFields.includes('requestsVoted')) addRow('Requests Voted', c.requestsVoted);
                            if (selectedFields.includes('bountySpentUpload')) addRow('Bounty Spent (Upload)', c.bountySpentUpload);
                            if (selectedFields.includes('bountySpentGold')) addRow('Bounty Spent (Gold)', c.bountySpentGold);
                            if (selectedFields.includes('reviews')) addRow('Reviews', c.reviews);
                            if (selectedFields.includes('seeding')) addRow('Seeding', c.seeding);
                            if (selectedFields.includes('leeching')) addRow('Leeching', c.leeching);
                            if (selectedFields.includes('snatched')) addRow('Snatched', c.snatched);
                            if (selectedFields.includes('uniqueSnatched')) addRow('Unique Snatched', c.uniqueSnatched);
                            if (selectedFields.includes('seedSize')) addRow('Seed Size', formatBytes(c.seedSize));
                            if (selectedFields.includes('invited')) addRow('Invited Users', c.invited);

                            if (selectedFields.includes('buffUpload')) addRow('Buff: Upload', b.Upload);
                            if (selectedFields.includes('buffDownload')) addRow('Buff: Download', b.Download);
                            if (selectedFields.includes('buffForumPosts')) addRow('Buff: Forum Posts', b.ForumPosts);
                            if (selectedFields.includes('buffIRCLines')) addRow('Buff: IRC Lines', b.IRCLines);
                            if (selectedFields.includes('buffIRCBonus')) addRow('IRC Bonus', b.IRCBonus);
                            if (selectedFields.includes('buffCommunityXP')) addRow('Community XP', b.CommunityXP);
                            if (selectedFields.includes('buffTorrentsXP')) addRow('Torrents XP', b.TorrentsXP);
                            if (selectedFields.includes('buffCommunityGold')) addRow('Community Gold', b.CommunityGold);
                            if (selectedFields.includes('buffTorrentsGold')) addRow('Torrents Gold', b.TorrentsGold);
                            if (selectedFields.includes('buffItemCost')) addRow('Shop Discount', b.ItemCost);
                            if (selectedFields.includes('buffBountyFrom')) addRow('Bounty From', b.BountyFrom);
                            if (selectedFields.includes('buffBountyOn')) addRow('Bounty On', b.BountyOn);
                            if (selectedFields.includes('buffChance')) addRow('Chance', b.Chance);
                        }

                        const MAX_ROWS_PER_COLUMN = 10;

                        const rightWrapper = document.createElement('div');
                        rightWrapper.style.display = 'flex';
                        rightWrapper.style.gap = '10px';
                        rightWrapper.style.width = 'fit-content';
                        rightWrapper.style.flex = '0 0 auto';
                        rightWrapper.style.userSelect = 'text';
                        rightWrapper.style.pointerEvents = 'auto';
                        rightWrapper.style.flexWrap = 'nowrap';    // Prevent flex items from wrapping to new lines
                        rightWrapper.addEventListener('contextmenu', e => e.stopPropagation());

                        // Group rows into columns
                        for (let i = 0; i < rows.length; i += MAX_ROWS_PER_COLUMN) {
                            const col = document.createElement('div');
                            col.style.flex = '1';
                            col.style.fontSize = '0.85em';
                            col.style.whiteSpace = 'nowrap';
                            col.style.color = textColor;

                            const columnRows = rows.slice(i, i + MAX_ROWS_PER_COLUMN).join('');
                            col.innerHTML = columnRows;
                            rightWrapper.appendChild(col);
                        }

                        // --- Notes UI ---
                        const notesToggle = document.createElement('button');
                        notesToggle.type = 'button';
                        notesToggle.title = 'User Notes';
                        notesToggle.textContent = '📝';
                        notesToggle.style.cssText = `
                        margin-left: 6px; padding: 0 4px; font-size: 12px; line-height: 16px;
                        background: transparent; border: 1px solid rgba(127,127,127,0.5);
                        border-radius: 4px; cursor: pointer; color: ${textColor};
                    `;

                        // Put the toggle right under the username item (top of left column)
                        const firstLi = leftDiv.querySelector('li');
                        if (firstLi) {
                            const holder = document.createElement('div');
                            holder.style.cssText = 'display:flex; align-items:center; gap:6px; padding:4px 8px;';
                            // Move the first li's text into holder
                            holder.appendChild(firstLi.cloneNode(true));
                            leftDiv.replaceChild(holder, firstLi);
                            holder.appendChild(notesToggle);
                        } else {
                            leftDiv.appendChild(notesToggle);
                        }

                        // Sliding notes panel
                        const notesPanel = document.createElement('div');
                        notesPanel.style.cssText = `
                        display: none; flex: 0 0 260px; margin-left: 8px; padding: 8px;
                        border-left: 1px dashed rgba(127,127,127,0.5);
                        color: ${textColor};
                    `;
                        const notesTitle = document.createElement('div');
                        notesTitle.textContent = `Notes for ${username}`;
                        notesTitle.style.cssText = 'font-weight: bold; margin-bottom: 6px;';

                        const textarea = document.createElement('textarea');
                        textarea.placeholder = 'Type your notes here…';
                        textarea.style.cssText = `
                        width: 100%; height: 140px; resize: vertical;
                        background: transparent; color: ${textColor};
                        border: 1px solid rgba(127,127,127,0.5); border-radius: 6px; padding: 6px;
                    `;

                        // preload notes
                        (async () => { textarea.value = await getUserNote(username); })();

                        notesPanel.appendChild(notesTitle);
                        notesPanel.appendChild(textarea);

                        // Toggle behavior
                        let notesOpen = false;
                        notesToggle.addEventListener('click', (e) => {
                            e.stopPropagation();
                            notesOpen = !notesOpen;
                            notesPanel.style.display = notesOpen ? 'block' : 'none';
                        });

                        // Rebuild menu layout
                        menu.innerHTML = '';
                        menu.style.display = 'flex';
                        menu.style.flexDirection = 'row';
                        menu.style.minWidth = '250px';

                        menu.appendChild(leftDiv);
                        menu.appendChild(rightWrapper);
                        menu.appendChild(notesPanel);

                        // Save on menu close: observe removal of the container
                        const container = node; // #context-menu-container
                        const closeObserver = new MutationObserver(async (muts) => {
                            for (const m of muts) {
                                for (const removed of m.removedNodes) {
                                    if (removed === container) {
                                        // Persist current text (even if panel was never opened)
                                        await setUserNote(username, textarea.value);
                                        closeObserver.disconnect();
                                    }
                                }
                            }
                        });
                        closeObserver.observe(container.parentNode || document.body, { childList: true });
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function formatBytes(bytes) {

        if (bytes === null) {
            return null;
        }

        const MB = 1024 ** 2;
        const GB = 1024 ** 3;
        const TB = 1024 ** 4;
        const PB = 1024 ** 5;

        if (bytes >= PB) {
            return (bytes / PB).toFixed(3) + ' PB';
        } else if (bytes >= TB) {
            return (bytes / TB).toFixed(3) + ' TB';
        } else if (bytes >= GB) {
            return (bytes / GB).toFixed(3) + ' GB';
        } else {
            return (bytes / MB).toFixed(3) + ' MB';
        }
    }

    function formatDate(dateStr) {
        return dateStr.split(' ')[0]; // YYYY-MM-DD
    }

    const defaultProfileVisibilitySelectedFiels = `[
            "avatar",
            "isFriend",
            "gold",
            "profile",
            "joinedDate",
            "uploaded",
            "downloaded",
            "ratio",
            "shareScore",
            "class",
            "donor",
            "warned",
            "torrentsUploaded",
            "paranoia",
            "hourlyGold",
            "posts",
            "threads",
            "forumDislikes",
            "forumLikes",
            "ircLines",
            "seedSize"
        ]`;

    function getSelectedFields() {
        return JSON.parse(localStorage.getItem('selectedUserFields') || defaultProfileVisibilitySelectedFiels);
    }

    function setSelectedFields(fields) {
        try {
            localStorage.setItem('selectedUserFields', JSON.stringify(fields));
        } catch (e) {
            console.error('Failed to save selected fields:', e);
        }
    }

    // --- Notes storage helpers ---
    async function getNotesStore() {
        const raw = await GM.getValue("userNotes");
        if (!raw) return {};
        try { return JSON.parse(raw) || {}; } catch { return {}; }
    }

    async function setNotesStore(store) {
        await GM.setValue("userNotes", JSON.stringify(store || {}));
    }

    async function getUserNote(username) {
        const store = await getNotesStore();
        return store[username] || "";
    }

    async function setUserNote(username, text) {
        const store = await getNotesStore();
        if (text && text.trim().length) store[username] = text;
        else delete store[username]; // keep it tidy if emptied
        await setNotesStore(store);
    }


})();