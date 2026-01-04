// ==UserScript==
// @name         TwitchTranslate
// @namespace    MrSelenix
// @version      1.0.8
// @description  Automatically translates messages in Twitch chat to other languages.
// @author       MrSelenix
// @match        https://www.twitch.tv/*
// @match        https://dashboard.twitch.tv/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      api-free.deepl.com
// @connect      api.deepl.com
// @downloadURL https://update.greasyfork.org/scripts/523571/TwitchTranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/523571/TwitchTranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////
    // About //
    ///////////

    function about() {
        const version = GM_info.script.version;
        const name = GM_info.script.name;
        alert(`${name}\n\nThis script introduces the ability to translate messages from your favourite twitch channels into a different language.\nSome customizable options have also been made available for you to improve your experience.\n\n-Author: MrSelenix\n-Version: ${version}`);
    }

    ////////////////////////
    // Utility            //
    ////////////////////////

    function levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
        for (let i = 0; i <= len1; i++) dp[i][0] = i;
        for (let j = 0; j <= len2; j++) dp[0][j] = j;
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        return dp[len1][len2];
    }

    function repeatLimiter(str) {
        return str.replace(/([^0-9]{1,10}?)(\1{3,})/gi, (match, p1) => p1.repeat(3)); // Replace all repeating characters or sequences (excluding numbers) if the sequence repeats at least 3 times. e.g. "HiHiHiHiHi" => "HiHiHi" || "HIIIIIIIII" => "HIII"
    }

    function adjustMenuPosition(menu, anchorButton) {
        const btnRect = anchorButton.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        const top = window.scrollY + btnRect.top - menuRect.height;
        const left = window.scrollX + btnRect.right - menuRect.width;

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
        menu.style.visibility = 'visible';
    }

    ////////////////////////
    // Color Definitions  //
    ////////////////////////

    const darkMode = {
        menuText: '#fafafa',
        menuBackground: '#18181b',
        menuHover: '#27272a',
        icon: '#b3b3b3',
        iconHover: '#313133',
        selectText: '#c0e0ff',
        outline: '#101010',
        shadow: '#000000',
        dropBackground: '#23232b',
        dropHover: '#30303b',
    }

    const lightMode = {
        menuText: '#050505',
        menuBackground: '#f5f5fa',
        menuHover: '#e2e2e6',
        icon: '#575757',
        iconHover: '#e5e5e5',
        selectText: '#77bbff',
        outline: '#e5e5e5',
        shadow: '#bbbbbb',
        dropBackground: '#ebebf0',
        dropHover: '#e0e0e0',
    }

    function isLightMode() {
        return document.documentElement.classList.contains('tw-root--theme-light');
    }

    function applyTheme(mode) {
        for (const [key, value] of Object.entries(mode)) {
            document.documentElement.style.setProperty(`--${key}`, value);
        }
    }

    //////////////////
    // Initialize   //
    //////////////////

    function initialize() {
        applyTheme(isLightMode() ? lightMode : darkMode);

        const observer = new MutationObserver(() => {
            const sendButton = document.querySelector('[data-a-target="chat-send-button"]');
            const vods = document.querySelector('[data-a-target="player-seekbar-duration"]');
            if (sendButton || vods) {
                setTimeout(ttSettings, 200);
                observer.disconnect();
            }
        });

        const theme = new MutationObserver(() => {
            applyTheme(isLightMode() ? lightMode : darkMode);
        });

        const sevenTV = new MutationObserver(() => { //7tv check
            const sTV = document.getElementsByClassName("seventv-tw-button seventv-mod-logs-button")[0];
            if (sTV) {
                console.log("[TwitchTranslate] 7tv is enabled");
                setTimeout(ttSettings, 200);
                sevenTV.disconnect();
            }
        });

        sevenTV.observe(document.body, { childList: true, subtree: true });
        observer.observe(document.body, { childList: true, subtree: true });
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        setTimeout(() => {
            sevenTV.disconnect();
        }, 20000);

    }

    let extraction = false;
    initialize();

    //////////////////////////////
    // Create Settings Button   //
    //////////////////////////////

    function ttSettings() {
        let chatButton

        if (document.getElementById('tt_settings')) return;
        if (document.querySelector('[data-a-target="chat-send-button"]')) {
            chatButton = document.querySelector('[data-a-target="chat-send-button"]').parentNode.parentNode;
            //console.log("applied to chat button");
        }
        else {
            chatButton = document.querySelector('.player-controls__right-control-group').childNodes[2]; // Fallback to video player control bar.
            console.log("applied to player controls");
        }

        mainButton = document.createElement('button');
        mainButton.id = 'tt_settings';
        mainButton.title = 'Translate Settings';
        mainButton.style.background = 'transparent';
        mainButton.style.border = 'none';
        mainButton.style.borderRadius = '4px';
        mainButton.style.marginRight = '1px';
        mainButton.style.cursor = 'pointer';
        mainButton.style.display = 'flex';
        mainButton.style.paddingRight = '5px';
        mainButton.style.paddingLeft = '3px';
        mainButton.style.paddingBottom = '6px';

        mainButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="var(--icon, #b3b3b3ff)" class="bi bi-translate" viewBox="-4 -6 22 22"><path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"></path><path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"></path></svg>`;
        mainButton.onmouseenter = () => mainButton.style.background = 'var(--iconHover, #53535f7a)';
        mainButton.onmouseleave = () => mainButton.style.background = 'transparent';
        mainButton.onclick = onMainButtonClick;
        mainButton.onmousedown = e => e.stopPropagation();

        if (chatButton) {
            chatButton.parentNode.insertBefore(mainButton, chatButton);
            if (extraction == false) {
                console.log(`[TwitchTranslate] Version ${GM_info.script.version} Loaded Successfully`);
                messageExtraction();
            }

        } else {
            console.error("Error appending");
            return;
        }
            window.addEventListener('popstate', closeMenu);
    }

    ////////////////////////////
    // Create & Populate Menu //
    ////////////////////////////

    function createMenu(button) {
        const menu = document.createElement('div');
        const title = document.createElement('h3');
        const divider = document.createElement('hr');

        //Styling
        menu.className = 'tm-custom-menu';
        menu.style.position = 'absolute';
        menu.style.background = 'var(--menuBackground, #18181b)';
        menu.style.border = '1px solid var(--outline, #101010)';
        menu.style.borderRadius = '4px';
        menu.style.boxShadow = '0 4px 24px var(--shadow, #000000';
        menu.style.padding = '8px';
        menu.style.zIndex = 10000;
        menu.style.minWidth = '140px';
        menu.tabIndex = -1;

        title.textContent = 'Translate Settings';
        title.style.fontSize = '20px';
        title.style.fontFamily = 'Helvetica, monospace';
        title.style.fontWeight = 'bold';
        title.style.margin = '0 0 10px 0';
        title.style.textAlign = 'center';
        title.style.color = 'var(--menuText, #ffffff';

        divider.style.cssText = `
         width: 265px;
         height: 1px;
         border: none;
         margin: 1px 0;
         background-color: #666666;
         `;
        const divider2 = divider.cloneNode(true);

        /////////////////////
        // Menu Population //
        /////////////////////

        // Menu Title
        menu.appendChild(title);
        menu.appendChild(divider);

        // Enable/Disable Button
        const toggleBtn = createTranslationsToggleButton();
        toggleBtn.setEnabledState(GM_getValue('translationsEnabled', true));
        menu.appendChild(toggleBtn);

        // Languages Button
        const langBtn = createDropdownButton(languages, "targetLanguage", "en", "Target Language:");
        menu.appendChild(langBtn);

        // Server Selection Button
        const serverBtn = createDropdownButton(servers, "server", "GoogleLegacy", "Server:", (selectedServer) => {
            showApiKeyInput(selectedServer); // your function to update the menu UI

            // Alert if the selected server requires an API key but none is set
            if (selectedServer !== 'GoogleLegacy' && servers[selectedServer]) {
                const keyName = servers[selectedServer].gmKey;
                const apiKey = GM_getValue(keyName, "");
                const webLink = servers[selectedServer].link;
                const id = servers[selectedServer].id;
                if (!apiKey) {
                    alert(`You need to get an API Key to use the ${id} server. You can get one from "${webLink}"`);
                }
            }
        });
        menu.appendChild(serverBtn);

        // API Key input button
        let apiKeyInputContainer = null;
        function showApiKeyInput(selectedServer) {
            if (apiKeyInputContainer && apiKeyInputContainer.parentNode) {
                apiKeyInputContainer.parentNode.removeChild(apiKeyInputContainer);
            }
            if (selectedServer !== 'GoogleLegacy' && servers[selectedServer]) {
                apiKeyInputContainer = createApiKeyInput(selectedServer);
                menu.insertBefore(apiKeyInputContainer, serverBtn.nextSibling);
            }
            adjustMenuPosition(menu, mainButton);
        }

        showApiKeyInput(GM_getValue("server", "GoogleLegacy"));

        menu.appendChild(divider2);

        const advancedContainer = advancedOptionsContainer(menu, mainButton);
        // All Advance Sub-menu options here

        // Message history Button
        // CURRENTLY BROKEN!
        //const histBtn = createMsgHistoryButton();
        //histBtn.setEnabledState(GM_getValue('history', false));
        //advancedContainer.appendChild(histBtn);

        // Color picker button
        const textColor = colorPicker();
        advancedContainer.appendChild(textColor);

        // Toggle Emotes
        const emoteBtn = emoteToggle();
        emoteBtn.setEnabledState(GM_getValue('emotes', true));
        advancedContainer.appendChild(emoteBtn);

        // Toggle Append Style
        const spanType = appendType();
        spanType.setEnabledState(GM_getValue('spanType', "span"));
        advancedContainer.appendChild(spanType);

        // About Button
        advancedContainer.appendChild(createMenuButton('About', about, 'var(--selectText, #c0e0ff)'));

        //////////////////////
        //End of Population //
        //////////////////////

        menu.style.visibility = 'hidden';
        menu.style.left = '-9999px';
        menu.style.top = '-9999px';
        document.body.appendChild(menu);

        adjustMenuPosition(menu, button);

        return menu;
    }


    ///////////////////////////////
    // Main Button & Menu Logic  //
    ///////////////////////////////

    let menuOpen = false;
    let menuElement = null;
    let mainButton = null;

    function closeMenu() {
        if (menuElement) {
            if (typeof openDropdown === "function") {
                openDropdown();
                openDropdown = null;
            }
            menuElement.remove();
            menuElement = null;
            menuOpen = false;
        }
    }

    function onMainButtonClick(e) {
        e.stopPropagation();

        if (menuOpen) {
            closeMenu();
            return;
        }

        menuElement = createMenu(mainButton);
        menuOpen = true;

        setTimeout(() => {
            document.addEventListener('mousedown', outsideClickListener);
        }, 0);
    }

    function outsideClickListener(e) {
        if (
            menuElement &&
            !menuElement.contains(e.target) &&
            e.target !== mainButton
        ) {
            closeMenu();
            document.removeEventListener('mousedown', outsideClickListener);
        }
    }

    window.addEventListener("resize", function() {
        if (menuOpen && menuElement && mainButton) {
            adjustMenuPosition(menuElement, mainButton);
        }
    });

    ////////////////////////////
    // Menu Button Creator    //
    ////////////////////////////

    function createMenuButton(label, onClick, color) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'tm-custom-menu-btn';
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.margin = '4px 0';
        btn.style.padding = '6px 12px';
        btn.style.background = 'var(--menuBackground, #18181b)';
        btn.style.color = color || 'var(--menuText, #ffffff)';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.textAlign = 'left';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.onmousedown = e => e.stopPropagation();
        btn.onclick = onClick;
        btn.onmouseover = () => btn.style.background = 'var(--menuHover, #27272a';
        btn.onmouseout  = () => btn.style.background = 'var(--menuBackground, #18181b)';
        return btn;
    }

    /////////////////////////
    // API Key Entry Field //
    /////////////////////////

    function createApiKeyInput(serverId, onInput) {
        const meta = servers[serverId];
        if (!meta) return null;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.margin = '8px 0';

        const label = document.createElement('span');
        label.textContent = meta.label;
        label.style.fontWeight = 'bold';
        label.style.marginLeft = '11px';
        label.style.marginRight = '4px';
        label.style.whiteSpace = 'nowrap';
        container.appendChild(label);

        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = meta.placeholder;
        input.value = GM_getValue(meta.gmKey, '');
        input.style.flex = '1';
        input.title = `Enter your ${meta.placeholder}`;
        input.style.padding = '2px 6px';
        input.style.border = '1px solid #aaa';
        input.style.borderRadius = '4px';
        input.style.marginRight = '-2px';
        input.style.fontSize = '14px';
        input.style.background = 'var(--menuBackground, #18181b)';
        input.style.color = 'var(--menuText, #fafafa)';

        input.addEventListener('input', () => {
            GM_setValue(meta.gmKey, input.value);
            if (onInput) onInput(input.value);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === "Escape" || e.key === "Enter") {
                input.blur();
                e.stopPropagation();
            }
        });

        container.appendChild(input);
        container._input = input;

        return container;
    }

    /////////////////////////////
    // Enabled/Disabled Toggle //
    /////////////////////////////

    function createTranslationsToggleButton(onStateChange) {
        function getToggleTranslationsLabel(enabled) {
            return `<span style="font-weight:bold">Translations:</span> <span style="font-weight:bold; color:${enabled ? "#1db755" : "#e02020"}">${enabled ? "Enabled" : "Disabled"}</span>`;
        }
        let enabled = GM_getValue('translationsEnabled', true);

        let btn = createMenuButton(getToggleTranslationsLabel(enabled), () => {
            enabled = !enabled;
            GM_setValue('translationsEnabled', enabled);
            btn.innerHTML = getToggleTranslationsLabel(enabled);
            if (onStateChange) onStateChange(enabled);
        });

        btn.setEnabledState = function(state) {
            enabled = state;
            btn.innerHTML = getToggleTranslationsLabel(enabled);
        };
        return btn;
    }

    /////////////////////////////
    // Message History Toggle  //
    /////////////////////////////

    function appendType(onStateChange) {
        function getAppendTypeLabel(type) {
            // type is either "span" or "div"
            let styleName = type === "span" ? "Inline" : "Newline";
            return `<span style="font-weight:bold">Append Style:</span> <span style="font-weight:bold; color:var(--selectText, #c0e0ff)">${styleName}</span>`;
        }
        let type = GM_getValue('spanType', "span");

        let btn = createMenuButton(getAppendTypeLabel(type), () => {
            type = (type === "span") ? "div" : "span";
            GM_setValue('spanType', type);
            btn.innerHTML = getAppendTypeLabel(type);
            if (onStateChange) onStateChange(type);
        });

        btn.setEnabledState = function(newType) {
            type = newType;
            btn.innerHTML = getAppendTypeLabel(type);
        };
        return btn;
    }

    ////////////////////
    // Emotes Toggle  //
    ////////////////////

    function emoteToggle(onStateChange) {
        function getemoteLabel(enabled) {
            return `<span style="font-weight:bold">Show Emotes:</span> <span style="font-weight:bold; color:${enabled ? "#1db755" : "#e02020"}">${enabled ? "Enabled" : "Disabled"}</span>`;
        }
        let enabled = GM_getValue('emotes', true);

        let btn = createMenuButton(getemoteLabel(enabled), () => {
            enabled = !enabled;
            GM_setValue('emotes', enabled);
            btn.innerHTML = getemoteLabel(enabled);
            if (onStateChange) onStateChange(enabled);
        });

        btn.setEnabledState = function(state) {
            enabled = state;
            btn.innerHTML = getemoteLabel(enabled);
        };
        return btn;
    }

    /////////////////////////////
    // Message History Toggle  //
    /////////////////////////////

    function createMsgHistoryButton(onStateChange) {
        function getMsgHistoryLabel(enabled) {
            return `<span style="font-weight:bold">Historical Translations:</span> <span style="font-weight:bold; color:${enabled ? "#1db755" : "#e02020"}">${enabled ? "Enabled" : "Disabled"}</span>`;
        }
        let enabled = GM_getValue('history', false);

        let btn = createMenuButton("", () => {
            enabled = !enabled;
            GM_setValue('history', enabled);
            labelSpan.innerHTML = getMsgHistoryLabel(enabled);
            if (onStateChange) onStateChange(enabled);
        });

        const labelSpan = document.createElement("span");
        labelSpan.innerHTML = getMsgHistoryLabel(enabled);

        const helpSpan = document.createElement("span");
        helpSpan.textContent = "?";
        helpSpan.title = "Enabled = Translate Old Messages When Connecting\nDisabled = Translate New Messages Only\nRecommend = Disabled";
        helpSpan.style.color = "#808080";
        helpSpan.style.float = "right";
        helpSpan.style.fontSize = "16px";

        btn.appendChild(labelSpan);
        btn.appendChild(helpSpan);

        btn.setEnabledState = function(state) {
            enabled = state;
            labelSpan.innerHTML = getMsgHistoryLabel(enabled);
        };

        return btn;
    }

    //////////////////
    // Chat Colours //
    //////////////////

    function colorPicker(defaultColor = "#9147FF") {
        function isValidHex(hex) {
            return /^#[0-9A-Fa-f]{6}$/.test(hex);
        }

        let color = GM_getValue('textColor', defaultColor).toUpperCase() ;
        if (!isValidHex(color)) color = defaultColor;
        let lastValidColor = color;

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.textContent = "⟲";
        resetBtn.title = "Reset to default color";
        resetBtn.style.border = "none";
        resetBtn.style.float = "right";
        resetBtn.style.background = "transparent";
        resetBtn.style.cursor = "pointer";
        resetBtn.style.fontSize = "16px";
        resetBtn.style.verticalAlign = "middle";
        resetBtn.style.color = "#bbb";
        resetBtn.style.padding = "0 2px";
        resetBtn.onmouseenter = () => resetBtn.style.color = defaultColor;
        resetBtn.onmouseleave = () => resetBtn.style.color = "#bbb";

        resetBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            setColor(defaultColor);
        });

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 7;
        input.value = color;
        input.style.color = color;
        input.style.width = "90px";
        input.style.float = "right";
        input.style.textAlign = "center";
        input.style.border = "1px solid #ccc";
        input.style.borderRadius = "4px";
        input.style.padding = "2px 6px";
        input.style.fontSize = "14px";
        input.style.fontWeight = 'bold';
        input.style.background = 'var(--menuBackground, #18181b)';
        input.style.marginLeft = "10px";
        input.placeholder = defaultColor;
        input.style.boxSizing = "border-box";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = color;
        colorInput.style.display = "none";

        function colorPickerLabel() {
            return 'Text Color:';
        }

        const btn = createMenuButton(colorPickerLabel(), () => {

            if (document.activeElement !== input) {
                document.body.appendChild(colorInput);
                const rect = btn.getBoundingClientRect();
                colorInput.style.position = "absolute";
                colorInput.style.left = rect.left + "px";
                colorInput.style.top = (rect.top - 4) + "px";
                colorInput.style.zIndex = 10000;
                colorInput.style.opacity = '0';
                colorInput.style.display = "block";
                colorInput.focus();
                colorInput.click();
            }
        });
        btn.appendChild(input);
        btn.appendChild(resetBtn);

        function setColor(newColor) {
            if (!isValidHex(newColor)) return;
            color = newColor.toUpperCase() ;
            lastValidColor = newColor;
            input.value = newColor;
            input.style.color = newColor;
            colorInput.value = newColor;
            GM_setValue('textColor', newColor);
        }

        input.addEventListener("input", (e) => {
            let val = e.target.value.toUpperCase() ;
            if (isValidHex(val)) setColor(val);
        });

        function restoreIfInvalid() {
            if (!isValidHex(input.value)) {
                input.value = lastValidColor.toUpperCase() ;
                input.style.color = lastValidColor;
            }
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === "Escape") {
                restoreIfInvalid();
            }
        });
        input.addEventListener("blur", restoreIfInvalid);

        input.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        input.addEventListener("dblclick", (e) => {
            colorInput.focus();
            colorInput.click();
        });

        colorInput.addEventListener("input", (e) => {
            setColor(e.target.value.toUpperCase() );
            colorInput.blur();
        });

        btn.setColor = setColor;

        return btn;
    }

    ////////////////////////////////
    // Advanced options container //
    ////////////////////////////////

    function advancedOptionsContainer(menu, mainButton, insertBefore) {
        const advancedContainer = document.createElement('div');
        advancedContainer.style.display = 'none';
        menu.appendChild(advancedContainer);

        let advancedVisible = false;
        const advancedToggleBtn = createMenuButton('Show Advanced Options', () => {
            advancedVisible = !advancedVisible;
            advancedContainer.style.display = advancedVisible ? '' : 'none';
            advancedToggleBtn.textContent = advancedVisible ? 'Hide Advanced Options' : 'Show Advanced Options';
            adjustMenuPosition(menu, mainButton);
        });
        advancedToggleBtn.style.color = '#808080';

        // Change which line is active based on personal preference.

        menu.appendChild(advancedToggleBtn);                           //Place Button at Bottom of menu
        //menu.insertBefore(advancedToggleBtn, advancedContainer);     //Place Button at Top of menu

        return advancedContainer
    }

    ///////////////////////////
    // Dropdown Menu Builder //
    ///////////////////////////

    let openDropdown = null;
    function createDropdownButton(optionsMap, storageKey, defaultValue, labelPrefix, onChange) {
        let currentValue = GM_getValue(storageKey, defaultValue);

        function getLabel(id) {
            const value = optionsMap[id];
            return typeof value === 'string' ? value : (value && typeof value === 'object' && value.id ? value.id : id);
        }

        const btn = createMenuButton(
            `<span style="font-weight:bold">${labelPrefix}</span> <span style="font-weight:bold; color:var(--selectText, #c0e0ff)">${getLabel(currentValue)}</span> <span style="float:right;color:#888">&#9662;</span>`,
            function(e) {
                e.stopPropagation();
                toggleDropdown();
            }
        );

        function updateButtonLabel() {
            btn.innerHTML = `<span style="font-weight:bold">${labelPrefix}</span> <span style="font-weight:bold; color:var(--selectText, #c0e0ff)">${getLabel(currentValue)}</span> <span style="float:right;color:#888">&#9662;</span>`;
        }

        let dropdown = null;
        function toggleDropdown() {
            if (dropdown && dropdown.parentNode) {
                closeDropdown();
                return;
            }
            showDropdown();
        }
        function showDropdown() {
            if (openDropdown && openDropdown !== closeDropdown) {
                openDropdown();
            }
            openDropdown = closeDropdown;

            dropdown = document.createElement('div');
            dropdown.style.position = 'absolute';
            dropdown.style.background = 'var(--dropBackground, #23232b';
            dropdown.style.border = '1px solid var(--outline, #444444';
            dropdown.style.borderRadius = '6px';
            dropdown.style.boxShadow = '0 4px 8px var(--shadow, #00000040';
            dropdown.style.minWidth = btn.offsetWidth + 'px';
            dropdown.style.zIndex = 10001;
            dropdown.style.fontWeight = 'bold';

            if (Object.keys(optionsMap).length > 10) {
                dropdown.style.maxHeight = "400px";
                dropdown.style.overflowY = "auto";
            }

            Object.entries(optionsMap).forEach(([id, value]) => {
                const option = document.createElement('div');
                option.textContent = typeof value === 'string' ? value : (value && typeof value === 'object' && value.id ? value.id : id);
                option.style.borderRadius = '6px';
                option.style.padding = '7px 10px';
                option.style.cursor = 'pointer';
                option.style.color = id === currentValue ? '#1db755' : 'var(--menuText, #fafafa)';
                option.onmouseover = () => option.style.background = 'var(--dropHover, #333333)';
                option.onmouseout  = () => option.style.background = 'transparent';
                option.onmousedown = function(ev) {
                    ev.stopPropagation();
                    currentValue = id;
                    GM_setValue(storageKey, currentValue);
                    updateButtonLabel();
                    if (onChange) onChange(currentValue);
                    closeDropdown();
                };
                dropdown.appendChild(option);
            });

            dropdown.style.display = 'block';
            document.body.appendChild(dropdown);
            const btnRect = btn.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight;
            dropdown.style.left = btnRect.left + 'px';
            dropdown.style.top = (btnRect.top + window.scrollY - dropdownHeight) + 'px';

            function closeDropdownOnMouseDown(ev) {
                if (dropdown && !dropdown.contains(ev.target) && ev.target !== btn) {
                    closeDropdown();
                    document.removeEventListener('mousedown', closeDropdownOnMouseDown);
                }
            }
            setTimeout(() => document.addEventListener('mousedown', closeDropdownOnMouseDown), 0);

            dropdown._outsideHandler = closeDropdownOnMouseDown;
        }
        function closeDropdown() {
            if (dropdown && dropdown.parentNode) {
                document.removeEventListener('mousedown', dropdown._outsideHandler);
                dropdown.remove();
                dropdown = null;
            }
            if (openDropdown === closeDropdown) {
                openDropdown = null;
            }
        }
        btn.closeDropdown = closeDropdown;

        btn.setValue = function(value) {
            currentValue = value;
            GM_setValue(storageKey, currentValue);
            updateButtonLabel();
        };
        btn.getValue = function() {
            return currentValue;
        };

        btn.setValue(GM_getValue(storageKey, defaultValue));

        return btn;
    }

    //////////////////////////////
    // Message processing       //
    //////////////////////////////

    function messageExtraction() {
        extraction = true;
        const originals = new Map();
        const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"], .scrollable-container.seventv-chat-scroller, .video-chat__message-list-wrapper');
        if (!chatContainer) return;

        // Extract all text from each message and use placeholders for emotes and @mentions, preserving DOM structure
        function extractText(chatLine) {
            const parts = [];
            const mentions = [];
            const emotes = [];
            let mentionIndex = 0;
            let emoteIndex = 0;
            let allowEmotes = GM_getValue('emotes', true);

            function processNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.trim() !== ":") parts.push(node.textContent.trim());
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('.mention-fragment, .mention-token')) {
                        mentions.push(node.textContent.trim());
                        parts.push(`CLF4V/D531SPM_${mentionIndex}`);
                        mentionIndex++;
                    } else if (node.matches('.chat-line__message--emote-button, [data-test-selector="emote-button"], .chat-image__container, .seventv-chat-emote, .emote-token')) {
                        const img = node.querySelector('img[alt]');
                        if (img && allowEmotes) {
                            emotes.push(img.srcset || img.src || '');
                            parts.push(`CLF3V/D531SPM_${emoteIndex}`);
                            emoteIndex++;
                        }
                    } else if (node.matches('.text-fragment, [data-a-target="chat-message-text"], .text-token')) {
                        node.childNodes.forEach(child => {
                            if (child.nodeType === Node.TEXT_NODE) {
                                if (child.textContent.trim()) parts.push(child.textContent.trim());
                            } else if (child.nodeType === Node.ELEMENT_NODE) {
                                if (child.matches('.mention-fragment, .mention-token')) {
                                    mentions.push(child.textContent.trim());
                                    parts.push(`CLF4V/D531SPM_${mentionIndex}`); //Store mentions as a variable to reconstruct later, avoids translating @usernames.
                                    mentionIndex++;
                                } else {
                                    const emoteImg = child.querySelector('img[alt]');
                                    if (emoteImg && allowEmotes) {
                                        emotes.push(emoteImg.srcset || emoteImg.src || '');
                                        parts.push(`CLF3V/D531SPM_${emoteIndex}`);//Store Emotes as a variable to reconstruct later, allows emote images in messages.
                                        emoteIndex++;
                                    }
                                }
                            }
                        });
                    } else {
                        node.childNodes.forEach(processNode);
                    }
                }
            }

            chatLine.childNodes.forEach(processNode);

            //Emotes and mentions are replaced by an indexed string to prevent mistranslating them.
            //While there may be better ways to go about this, this has worked most of the time during testing.

            let extractedMessage = parts.join(' ').replace(/\s+/g, ' ').replace(/\s+\.{3,}/g, '...').replace(/\s+\.\.?/g, '.').trim();
            extractedMessage = repeatLimiter(extractedMessage);
            return { extractedMessage, mentions, emotes };
        }

        async function detectLanguage(text, targetLang) {
            let regex = /\s*CLF[34]V\/D531SPM_(\d+)\s*/g;
            text = text.replace(regex, ' ').replace(/\s+/g, ' ').trim();
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            return data[2]; // returns the detected language. "en", "fr", "de" etc...
        }

        // Translate with GoogleLegacy
        async function translate_Google(text, targetLang) {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            return data[0].map(item => item[0]).join('');
        }

        // Translate with DeepL
        function translate_DeepL(text, targetLang) {
            const apiKey = GM_getValue('DeepLApiKey', '');
            if (!apiKey) {
                console.warn("[TwitchTranslate] DeepL API key missing.");
                return Promise.resolve(null);
            }
            const dlTargetLang = targetLang.toUpperCase();
            const params = new URLSearchParams({
                text: text,
                target_lang: dlTargetLang,
                split_sentences: 0,
                formality: "prefer_less", //For supported languages, translate to a less formal message
                enable_beta_languages: 1 //Expanded language list. Beta languages have some limitations and may be less accurate than expected.
            }).toString();

            // Try Pro endpoint first, then Free if error
            const endpoints = [
                "https://api.deepl.com/v2/translate",
                "https://api-free.deepl.com/v2/translate"
            ];
            let triedEndpoints = 0;

            return new Promise((resolve, reject) => {
                function tryEndpoint() {
                    if (triedEndpoints >= endpoints.length) { // If both endpoints fail
                        const msg = "[TwitchTranslate] DeepL response error: 403 - Forbidden.\nInvalid or expired API key. If problem persists, try a different server";
                        console.error(msg);
                        resolve({
                            translation: "DeepL API key is invalid or does not have permission.",
                            detectedLang: "Error"
                        });
                        return;
                    }
                    const URL = endpoints[triedEndpoints];
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: URL,
                        headers: {
                            "Authorization": `DeepL-Auth-Key ${apiKey}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: params,
                        onload: function(response) {
                            try {
                                // If 456 error (Quota exceeded)
                                if (response.status === 456) {
                                    console.warn("[TwitchTranslate] Quota exceeded. The character limit for this billing period has been reached");
                                    resolve({
                                        translation: "DeepL Quota exceeded for this billing period.",
                                        detectedLang: "Error"
                                    });
                                    return
                                }
                                if (response.status === 400) {
                                    console.warn("[TwitchTranslate] HTTP status code 400 (Bad Request)");
                                    resolve({
                                        translation: "HTTP status code 400 (Bad Request). The target language is not supported or the request is malformed.",
                                        detectedLang: "Error"
                                    });
                                    return
                                }
                                // If 4xx error (invalid auth, wrong endpoint for key, etc.), try next
                                if (response.status >= 400 && response.status < 500) {
                                    triedEndpoints++;
                                    tryEndpoint();
                                    return;
                                }
                                if (response.status !== 200) {
                                    let msg = `[TwitchTranslate] DeepL response error: ${response.status}`;
                                    try {
                                        const err = JSON.parse(response.responseText);
                                        if (err && err.message) msg += ` - ${err.message}`;
                                    } catch {}
                                    console.error(msg);
                                    resolve(null);
                                    return;
                                }
                                const data = JSON.parse(response.responseText);
                                if (
                                    !data.translations ||
                                    !data.translations.length ||
                                    !data.translations[0].text
                                ) {
                                    console.error("[TwitchTranslate] DeepL: No translation in response", data);
                                    resolve(null);
                                    return;
                                }
                                const detectedLang = (data.translations[0].detected_source_language || '').toLowerCase();
                                // Don't post translation if already in target language
                                if (detectedLang === dlTargetLang.toLowerCase()) {
                                    //console.warn("[TwitchTranslate] DeepL Skipped the translation because the language was detected to be the same as the target");
                                    resolve(null);
                                    return;
                                }
                                resolve({
                                    translation: data.translations[0].text,
                                    detectedLang: detectedLang
                                });
                            } catch (e) {
                                console.error("[TwitchTranslate] DeepL parse error:", e, response.responseText);
                                resolve(null);
                            }
                        },
                        onerror: function(err) {
                            triedEndpoints++;
                            tryEndpoint();
                        }
                    });
                }
                tryEndpoint();
            });
        }

        // Replace placeholders in translation with mentions/emotes
        function reconstructMessage(translated, mentions, emotes = []) {
            let result = repeatLimiter(translated);
            if (mentions) {
                mentions.forEach((mention, idx) => {
                    result = result.replace(new RegExp(`CLF4V/D531SPM_${idx}`, 'g'), mention);
                });
            }
            if (emotes) {
                emotes.forEach((srcset, idx) => {
                    result = result.replace(
                        new RegExp(`CLF3V/D531SPM_${idx}`, 'g'),
                        `<img srcset="${srcset}" style="height:1.8em;vertical-align:-0.66em;" alt="emote">`
                    );
                });
            }
            return result;
        }

        // Main translation handler for each message
        async function handleTranslation(chatLine, extractedMessage, mentions, emotes) {
            const translationsEnabled = GM_getValue('translationsEnabled', true);
            if (!translationsEnabled) return;

            const targetLang = GM_getValue('targetLanguage', 'en');
            const server = GM_getValue('server', 'GoogleLegacy');

            let detectedLang = await detectLanguage(extractedMessage, targetLang);

            if (detectedLang === targetLang) return; // Detect the language of each message using google to know if we should try to translate the full message with the chosen server. This saves us wasting characters with pointless translations on servers with character Limits.
            if (!(detectedLang in languages)) return; //Limit languages to whats in the language map (initial detection and GoogleLegacy)

            //server selection
            let translated;
            //Google
            if (server === 'GoogleLegacy') {
                translated = await translate_Google(extractedMessage, targetLang);
            }
            //DeepL
            else if (server === 'DeepL') {
                const dlResult = await translate_DeepL(extractedMessage, targetLang);
                if (!dlResult) return;
                translated = dlResult.translation;
                detectedLang = dlResult.detectedLang;
                if (!(detectedLang in languages)) return; //Limit languages to whats in the language map (For DeepL)
            }

            else {
                // Add other services here
                return;
            }

            //Levenshtein filtering
            const extractedLower = extractedMessage.toLowerCase();
            const transLower = translated.toLowerCase();
            const shortest = Math.min(extractedLower.length, transLower.length);
            const threshold = Math.round(shortest * 0.25);
            const dist = Math.min(50, Math.max(5, threshold)); //Distance to measure from set to a min of 5, max of 50, or otherwise 25% the length of the shortest string.

            if (levenshteinDistance(extractedLower, transLower) < dist ) { return };

            // Reconstruct message with mentions/emotes
            const finalMessage = reconstructMessage(translated, mentions, emotes);

            // Append translation after original
            const langName = languages[detectedLang] || detectedLang;
            const output = `(Translated from ${langName}: ${finalMessage})`;
            if (!chatLine.querySelector('.twitchtranslate-reconstructed')) {
                let color = GM_getValue('textColor', "#9147ff");
                let spanType = GM_getValue('spanType', "span");
                const newSpan = document.createElement(spanType);
                newSpan.innerHTML = ' ' + output;
                newSpan.className = 'twitchtranslate-reconstructed';
                newSpan.style.fontWeight = 'bold';
                newSpan.style.color = color;
                newSpan.style.marginLeft = '4px';
                chatLine.appendChild(newSpan);
            }
        }

        /////////////////////////////////
        // Watching for new Chat Lines //
        /////////////////////////////////

        //let hasSeenWelcome = GM_getValue('history', false);
        let hasSeenWelcome = true; //bypass since message history doesnt work properly
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(newNode => {
                    if (newNode.nodeType !== Node.ELEMENT_NODE) return;

                    if (hasSeenWelcome === false && newNode.querySelector('.video-chat__message, .seventv-chat-vod-message-wrapper')) { //Vods Check
                        hasSeenWelcome = true;
                    }

                    if (hasSeenWelcome === false && newNode.querySelector('div.live-message-separator-line__hr')) { // New line check for twitch with or without BTTV
                        hasSeenWelcome = true;
                    }

                    if (hasSeenWelcome === false && document.querySelector('.seventv-message')) { // New line check for 7tv
                        hasSeenWelcome = true;
                    }
                    if(hasSeenWelcome) {
                        const chatLines = newNode.matches?.('[data-a-target="chat-line-message-body"], .seventv-chat-message-body, .video-chat__message') ? [newNode] : newNode.querySelectorAll?.('[data-a-target="chat-line-message-body"], .seventv-chat-message-body, .video-chat__message') || [];
                        chatLines.forEach(chatLine => {
                            if (!originals.has(chatLine)) {
                                const { extractedMessage, mentions, emotes } = extractText(chatLine);
                                handleTranslation(chatLine, extractedMessage, mentions, emotes);
                                originals.set(chatLine, extractedMessage);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
        console.log("[TwitchTranslate] Chat Observer initialized");
    }

    ////////////////////
    // Storage Maps   //
    ////////////////////

    const servers = {
        GoogleLegacy: {
            id: "Google (Legacy)",
            label: "API Key",
            placeholder: null,
            gmKey: null,
            link: null
        },
        DeepL: {
            id: "DeepL",
            label: "API Key",
            placeholder: "DeepL API Key",
            gmKey: "DeepLApiKey",
            link: "https://www.deepl.com/en/pro#developer"
        },
    };

    const languages = { //List of supported languages. If you know the language codes, you can add new entries to the list. Some language codes may not be supported by specific providers. Others may be supported but not present in the list.
        en: "English",
        af: "Afrikaans",
        sq: "Albanian",
        ar: "Arabic",
        hy: "Armenian",
        az: "Azerbaijani",
        be: "Belarusian",
        bn: "Bengali",
        bs: "Bosnian",
        bg: "Bulgarian",
        ca: "Catalan",
        "zh-cn": "Chinese (Simplified)",
        "zh-tw": "Chinese (Traditional)",
        hr: "Croatian",
        cs: "Czech",
        da: "Danish",
        nl: "Dutch",
        et: "Estonian",
        tl: "Filipino",
        fi: "Finnish",
        fr: "French",
        ka: "Georgian",
        de: "German",
        el: "Greek",
        ht: "Haitian Creole",
        haw: "Hawaiian",
        iw: "Hebrew",
        hi: "Hindi",
        hu: "Hungarian",
        is: "Icelandic",
        id: "Indonesian",
        ga: "Irish",
        it: "Italian",
        ja: "Japanese",
        jw: "Javanese",
        ko: "Korean",
        la: "Latin",
        lb: "Luxembourgish",
        lv: "Latvian",
        lt: "Lithuanian",
        mk: "Macedonian",
        mt: "Maltese",
        mn: "Mongolian",
        ne: "Nepali",
        no: "Norwegian",
        fa: "Persian",
        pl: "Polish",
        pt: "Portuguese",
        pa: "Punjabi",
        ro: "Romanian",
        ru: "Russian",
        sm: "Samoan",
        sr: "Serbian",
        sk: "Slovak",
        sl: "Slovenian",
        es: "Spanish",
        sv: "Swedish",
        th: "Thai",
        tr: "Turkish",
        uk: "Ukrainian",
        ur: "Urdu",
        uz: "Uzbek",
        vi: "Vietnamese",
        cy: "Welsh",
        yi: "Yiddish",
        zu: "Zulu"
    };
})();