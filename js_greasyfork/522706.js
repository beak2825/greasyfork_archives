// ==UserScript==
// @name         SigPlus+ 🇧🇷
// @namespace    SigPlus+ 🇧🇷
// @version      1.0.28
// @author       kevinkvn_
// @description  Script for InfernoTrick by brazilians
// @license MIT
// @match        https://*.sigmally.com/*
// @icon         https://i.imgur.com/kgTrxZy.gif
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/522706/SigPlus%2B%20%F0%9F%87%A7%F0%9F%87%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522706/SigPlus%2B%20%F0%9F%87%A7%F0%9F%87%B7.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var STORAGE_KEYS = {
        double: "doubleKey",
        triple: "tripleKey",
        railgun: "railgunKey",
    };
    var DEFAULT_KEY_EVENT_PROPS = {
        key: " ",
        code: "Space",
        keyCode: 32,
        which: 32,
        cancelable: true,
        composed: true,
    };
    var tabKeyProps = {
        key: "Tab",
        code: "Tab",
    };
    var isMacroDisabled = false;
    var settings = {};
    var SELECTORS = {
        navbar: ".mod_menu_navbar",
        menuContent: ".mod_menu_content",
        chatInput: "#chatSendInput",
        nickInput: "#nick",
        tagInput: "#tag",
    };
    var ICONS = {
        brasil: "https://imgur.com/caiOSAM.png",
    };
    var storageService = {
        get: function (key) { return localStorage.getItem(key); },
        set: function (key, value) { return localStorage.setItem(key, value); },
        remove: function (key) { return localStorage.removeItem(key); },
    };
    function mapKeyToCode(key) {
        var keyLower = key === null || key === void 0 ? void 0 : key.toLowerCase();
        var keyUpper = key === null || key === void 0 ? void 0 : key.toUpperCase();
        if (/^[a-zA-Z]$/.test(key))
            return "Key".concat(keyUpper);
        if (/^\d$/.test(key))
            return "Digit".concat(key);
        if (key === " ")
            return "Space";
        var specialKeys = {
            escape: "Escape",
            esc: "Escape",
            tab: "Tab",
            enter: "Enter",
            shift: "ShiftLeft",
            ctrl: "ControlLeft",
            control: "ControlLeft",
            alt: "AltLeft",
            backspace: "Backspace",
            delete: "Delete",
            arrowup: "ArrowUp",
            arrowdown: "ArrowDown",
            arrowleft: "ArrowLeft",
            arrowright: "ArrowRight",
        };
        return specialKeys[keyLower] || keyUpper;
    }
    function loadSettings() {
        Object.values(STORAGE_KEYS).forEach(function (storageKey) {
            var _a;
            var value = storageService.get(storageKey);
            if (value) {
                settings[storageKey] = (_a = value === null || value === void 0 ? void 0 : value.toLowerCase()) !== null && _a !== void 0 ? _a : undefined;
            }
        });
    }
    function saveSettings() {
        Object.values(STORAGE_KEYS).forEach(function (storageKey) {
            if (settings[storageKey]) {
                storageService.set(storageKey, settings[storageKey]);
            }
            else {
                storageService.remove(storageKey);
            }
        });
    }
    function simulateKeyPress(eventProps) {
        window.dispatchEvent(new KeyboardEvent("keydown", eventProps));
        window.dispatchEvent(new KeyboardEvent("keyup", eventProps));
    }
    function triggerSplit(times) {
        if (times <= 0)
            return;
        simulateKeyPress(DEFAULT_KEY_EVENT_PROPS);
        triggerSplit(times - 1);
    }
    function triggerTabPress() {
        var view = sigfix.world.selected === sigfix.world.viewId.primary ? sigfix.world.viewId.secondary : sigfix.world.viewId.primary;
        sigfix.input.tab(view);
    }
    var createElement = function (tag, options) {
        if (options === void 0) { options = {}; }
        var element = document.createElement(tag);
        if (options.className)
            element.className = options.className;
        if (options.textContent)
            element.textContent = options.textContent;
        if (options.styles)
            Object.assign(element.style, options.styles);
        if (options.attributes) {
            Object.entries(options.attributes).forEach(function (_a) {
                var attr = _a[0], value = _a[1];
                element.setAttribute(attr, value);
            });
        }
        return element;
    };
    var brasilScriptsContainer = createElement("div", {
        className: "brasil-scripts-container mod_tab scroll",
        styles: { display: "none" },
    });
    function createTitle(text) {
        var title = createElement("div", { className: "text-center", textContent: text });
        brasilScriptsContainer.appendChild(title);
        return title;
    }
    function createCategory(_a) {
        var title = _a.title, emoji = _a.emoji;
        var categoryContainer = createElement("div", { styles: { display: "flex", alignItems: "center", margin: "10px 0" } });
        var emojiSpan = createElement("span", { textContent: emoji, styles: { marginRight: "8px", fontSize: "1.2em" } });
        var titleSpan = createElement("span", { textContent: title, styles: { fontWeight: "bold", marginRight: "8px" } });
        var line = createElement("div", { styles: { flexGrow: "1", height: "1px", backgroundColor: "#bfbfbf", marginLeft: "8px" } });
        categoryContainer.appendChild(emojiSpan);
        categoryContainer.appendChild(titleSpan);
        categoryContainer.appendChild(line);
        brasilScriptsContainer.appendChild(categoryContainer);
        return categoryContainer;
    }
    function createKeybindInput(_a) {
        var _b;
        var idPrefix = _a.idPrefix, property = _a.property, title = _a.title, helpText = _a.helpText, _c = _a.container, container = _c === void 0 ? brasilScriptsContainer : _c;
        var inputContainer = createElement("div", {
            className: "keybind-input-container modRowItems justify-sb",
            styles: { position: "relative", padding: "5px 10px" },
        });
        inputContainer.title = helpText;
        var label = createElement("span", { textContent: title });
        var input = createElement("input", {
            className: "keybind-input modInput",
            styles: { display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center" },
            attributes: {
                type: "text",
                id: "".concat(idPrefix, "-").concat(property),
                placeholder: "...",
            },
        });
        input.style.width = idPrefix === "sf" ? "40px" : "50px";
        input.value = ((_b = settings[property]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "";
        input.addEventListener("keydown", function (e) {
            e.preventDefault();
            var key = e.key;
            var keyLower = key.toLowerCase();
            if (key === "Escape" || key === "Backspace") {
                settings[property] = "";
                input.value = "";
                saveSettings();
                updateKeyHandlers();
                return;
            }
            var isConflict = Object.values(STORAGE_KEYS).some(function (keyItem) { var _a; return keyItem !== property && ((_a = settings[keyItem]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === keyLower; });
            if (isConflict) {
                alert("A tecla \"".concat(key, "\" j\u00E1 est\u00E1 atribu\u00EDda a outro comando."));
                return;
            }
            settings[property] = keyLower;
            input.value = key.toUpperCase();
            saveSettings();
            updateKeyHandlers();
        });
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        container.appendChild(inputContainer);
    }
    function createNavigationButton(navigationMenu, menuContent) {
        var navButton = createElement("button", { className: "brasil-nav-btn mod_nav_btn" });
        var img = createElement("img", {
            styles: {
                width: "20px",
                height: "20px",
                verticalAlign: "middle",
                borderRadius: "50%",
            },
            attributes: {
                src: ICONS.brasil,
                alt: "Ícone Brasil",
            },
        });
        var buttonText = createElement("span", { textContent: "Sig Plus+" });
        navButton.appendChild(img);
        navButton.appendChild(buttonText);
        navigationMenu.appendChild(navButton);
        navButton.addEventListener("click", function () {
            document.querySelectorAll(".mod_tab").forEach(function (tab) {
                var tabElement = tab;
                tabElement.style.opacity = "0";
                setTimeout(function () {
                    tabElement.style.display = "none";
                }, 200);
            });
            document.querySelectorAll(".mod_nav_btn").forEach(function (btn) {
                btn.classList.remove("mod_selected");
            });
            navButton.classList.add("mod_selected");
            setTimeout(function () {
                brasilScriptsContainer.style.display = "flex";
                setTimeout(function () {
                    brasilScriptsContainer.style.opacity = "1";
                }, 10);
            }, 200);
        });
    }
    function createConfigContainer() {
        var navigationMenu = document.querySelector(SELECTORS.navbar);
        var menuContent = document.querySelector(SELECTORS.menuContent);
        if (!navigationMenu || !menuContent)
            return;
        navigationMenu.style.gap = "8px";
        createNavigationButton(navigationMenu, menuContent);
        menuContent.appendChild(brasilScriptsContainer);
        createTitle("Sigmally 🇧🇷 Scripts");
        configureKeybinds(brasilScriptsContainer);
    }
    function configureKeybinds(container) {
        createCategory({ title: "InfernoSplit", emoji: "🔥" });
        createKeybindInput({
            idPrefix: "brasil",
            property: STORAGE_KEYS.double,
            title: "Double Inferno Key (2-4):",
            helpText: "Send Double InfernoSplit",
            container: container,
        });
        createKeybindInput({
            idPrefix: "brasil",
            property: STORAGE_KEYS.triple,
            title: "Triple Inferno Key (3-4):",
            helpText: "Send Triple(straight) InfernoSplit",
            container: container,
        });
        createCategory({ title: "Railgun", emoji: "☄️" });
        createKeybindInput({
            idPrefix: "brasil",
            property: STORAGE_KEYS.railgun,
            title: "Railgun Key (3):",
            helpText: "Send Triple(straight)",
            container: container,
        });
    }
    var isDisabledMove = false;
    var disableCountMove = 0;
    var originalMove;
    function temporarilyDisableMove(duration, action) {
        var _a;
        if (!isDisabledMove) {
            originalMove = (_a = sigfix === null || sigfix === void 0 ? void 0 : sigfix.net) === null || _a === void 0 ? void 0 : _a.move;
            sigfix.net.move = function () { };
            isDisabledMove = true;
        }
        disableCountMove++;
        action();
        setTimeout(function () {
            disableCountMove--;
            if (disableCountMove === 0 && originalMove) {
                sigfix.net.move = originalMove;
                isDisabledMove = false;
            }
        }, duration);
    }
    function handleDoubleHellKey(event) {
        event.preventDefault();
        temporarilyDisableMove(750, function () {
            triggerSplit(2);
            triggerTabPress();
            triggerSplit(4);
            setTimeout(function () {
                triggerTabPress();
            }, 0);
        });
    }
    function handleTripleHellKey(event) {
        event.preventDefault();
        temporarilyDisableMove(750, function () {
            triggerSplit(3);
            triggerTabPress();
            triggerSplit(4);
            setTimeout(function () {
                triggerTabPress();
            }, 0);
        });
    }
    function handleRailgunKey(event) {
        event.preventDefault();
        temporarilyDisableMove(750, function () {
            triggerSplit(3);
        });
    }
    var keyHandlers = {};
    function updateKeyHandlers() {
        var _a;
        var _b, _c, _d;
        keyHandlers = (_a = {},
            _a[(_b = settings[STORAGE_KEYS.double]) === null || _b === void 0 ? void 0 : _b.toLowerCase()] = handleDoubleHellKey,
            _a[(_c = settings[STORAGE_KEYS.triple]) === null || _c === void 0 ? void 0 : _c.toLowerCase()] = handleTripleHellKey,
            _a[(_d = settings[STORAGE_KEYS.railgun]) === null || _d === void 0 ? void 0 : _d.toLowerCase()] = handleRailgunKey,
            _a);
    }
    function initializeKeyHandlers() {
        updateKeyHandlers();
    }
    function handleGlobalKeydown(event) {
        var _a;
        if (isMacroDisabled)
            return;
        var pressedKey = (_a = event.key) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        var keyHandler = keyHandlers[pressedKey];
        if (keyHandler) {
            keyHandler(event);
        }
    }
    function waitForElements(selectors, callback, intervalTime, maxAttempts) {
        if (intervalTime === void 0) { intervalTime = 500; }
        if (maxAttempts === void 0) { maxAttempts = 20; }
        var attempts = 0;
        var interval = setInterval(function () {
            var allPresent = selectors.every(function (selector) { return document.querySelector(selector); });
            if (allPresent) {
                clearInterval(interval);
                callback();
            }
            else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.warn("waitForElements: Elementos n\u00E3o encontrados ap\u00F3s ".concat(maxAttempts, " tentativas."));
                }
            }
        }, intervalTime);
    }
    function monitorChatInput() {
        var inputSelectors = [SELECTORS.chatInput, SELECTORS.nickInput, SELECTORS.tagInput];
        var focusCount = 0;
        var createDisableIndicator = function () {
            var indicator = createElement("div", {
                styles: {
                    display: "none",
                    position: "fixed",
                    bottom: "10px",
                    right: "10px",
                    padding: "5px 10px",
                    backgroundColor: "rgba(192, 33, 33, 0.7)",
                    color: "#fff",
                    borderRadius: "5px",
                    zIndex: "1000",
                },
            });
            indicator.id = "brasil-disable-indicator";
            indicator.textContent = "Desativado durante o chat";
            document.body.appendChild(indicator);
            return indicator;
        };
        var handleInputFocus = function (_a) {
            var indicator = _a.indicator;
            focusCount++;
            if (focusCount === 1) {
                isMacroDisabled = true;
                indicator.style.display = "block";
            }
        };
        var handleInputBlur = function (_a) {
            var indicator = _a.indicator;
            focusCount--;
            if (focusCount === 0) {
                isMacroDisabled = false;
                indicator.style.display = "none";
            }
        };
        var interval = setInterval(function () {
            var inputs = inputSelectors
                .flatMap(function (selector) { return Array.from(document.querySelectorAll(selector)); })
                .filter(function (input) { return input !== null; });
            if (inputs.length > 0) {
                clearInterval(interval);
                var disableIndicator_1 = createDisableIndicator();
                inputs.forEach(function (input) {
                    input.addEventListener("focus", function () { return handleInputFocus({ indicator: disableIndicator_1 }); });
                    input.addEventListener("blur", function () { return handleInputBlur({ indicator: disableIndicator_1 }); });
                });
            }
        }, 500);
    }
    function initialize() {
        loadSettings();
        initializeKeyHandlers();
        waitForElements([SELECTORS.navbar, SELECTORS.menuContent], createConfigContainer);
        document.addEventListener("keydown", handleGlobalKeydown);
        monitorChatInput();
        console.log("BrasilScripts carregado com sucesso.");
    }
    initialize();
})();