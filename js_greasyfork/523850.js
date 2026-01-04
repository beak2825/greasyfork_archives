// ==UserScript==
// @name         Website Analyser
// @name:en      Website Analyser
// @name:ja      サイト分析
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  　Outputs capturable elements to console.log.
// @description:en Outputs capturable elements to console.log
// @description:ja キャプチャ可能な要素をconsole.logに出力する
// @author       ぐらんぴ
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523850/Website%20Analyser.user.js
// @updateURL https://update.greasyfork.org/scripts/523850/Website%20Analyser.meta.js
// ==/UserScript==

//const log = console.log;
let settings = {
    querySelector: GM_getValue('querySelector', false),
    querySelectorAll: GM_getValue('querySelectorAll', false),
    append: GM_getValue('append', false),
    appendChild: GM_getValue('appendChild', false),
    defineProperty: GM_getValue('defineProperty', false),
    event: GM_getValue('event', false),
    fetch: GM_getValue('fetch', false),
    webSocket: GM_getValue('webSocket', false),
    XMLHttpRequest: GM_getValue('XMLHttpRequest', false),
    ShadowDOM: GM_getValue('ShadowDOM', false),
    before: GM_getValue('before', false),
    after: GM_getValue('after', false),
    insertBefore: GM_getValue('insertBefore', false),
    dispatchEvent: GM_getValue('dispatchEvent', false),
    setInterval: GM_getValue('setInterval', false),
    setTimeout: GM_getValue('setTimeout', false),
    requestIdleCallback: GM_getValue('requestIdleCallback', false),
    remove: GM_getValue('remove', false),
};

const toggleSetting = (key) => {
    settings[key] = !settings[key];
    GM_setValue(key, settings[key]);
    document.getElementById(key).checked = settings[key]; // チェックボックスの状態を同期
    console.log(`${key} is now ${settings[key]}`);
};

const analyzer = () => {
    if(settings.defineProperty){
        const origObjDefineProperty = Object.defineProperty;
        Object.defineProperty = (...args)=>{
            console.log("defineProperty:", args);
            return origObjDefineProperty(...args);
        };
    }
    if(settings.fetch){
        const origFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (...args) => {
            console.log("fetch:", args);
            const res = await origFetch(...args);
            return res;
        };

    }
    if(settings.webSocket){
        const origWb = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function (...args) {
            const ws = new origWb(...args);
            ws.addEventListener("message", e => {
                const data = JSON.parse(e.data);
                console.log("webSocket:", data);
            });
            return ws;
        };
    }
    if(settings.event){
        const origAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            console.log("event:", type);
            return origAddEventListener.call(this, type, listener, options);
        };
    }
    if(settings.appendChild){
        const origAppendChild = Element.prototype.appendChild;
        Element.prototype.appendChild = function(...args) {
            console.log("appendChild:", args);
            return origAppendChild.apply(this, args);
        };
    }
    if(settings.querySelector){
        const originalQuerySelector = Document.prototype.querySelector;
        Object.defineProperty(Document.prototype, 'querySelector', {
            value: function(...args) {
                console.log("selector:", ...args);
                return originalQuerySelector.apply(this, args);
            },
            writable: true,
            configurable: true
        });
    }
    if(settings.querySelectorAll){
        const originalQuerySelectorAll = Document.prototype.querySelectorAll;
        Object.defineProperty(Document.prototype, 'querySelectorAll', {
            value: function(...args) {
                console.log("selectorAll:", ...args);
                return originalQuerySelectorAll.apply(this, args);
            },
            writable: true,
            configurable: true
        });
    }
    if(settings.XMLHttpRequest){
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._requestInfo = { method, url, async, user, password };
            console.log('XHR Request:', { method, url, async, user });
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('load', function() {
                console.log('XHR Response:', {
                    url: this._requestInfo.url,
                    status: this.status,
                    statusText: this.statusText,
                    response: this.responseText.substring(0, 200) // untill 200
                });
            });
            console.log('XHR Send:', {
                url: this._requestInfo.url,
                body: body ? body.substring(0, 200) : null
            });
            return originalSend.apply(this, arguments);
        };
    }
    if(settings.ShadowDOM){
        const originalAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(...args) {
            console.log('Shadow DOM:', this,/* 'Args:', args*/);

            const shadowRoot = originalAttachShadow.apply(this, args);

            console.log('ShadowRoot:', shadowRoot);

            return shadowRoot;
        };
    }
    if(settings.before){
        const origBefore = Element.prototype.before;
        Element.prototype.before = function(...args) {
            setTimeout(() => {
                console.log('Before:', args)
            },0)
            return origBefore.apply(this, args);
        };
    }
    if(settings.after){
        const origAfter = Element.prototype.after;
        Element.prototype.after = function(...args) {
            setTimeout(() => {
                console.log('After:', args)
            },0)
            return origAfter.apply(this, args);
        };
    }
    if(settings.insertBefore){
        const origInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function(newNode, referenceNode) {
            console.log('newNode:', newNode);
            console.log('referenceNode:', referenceNode);
            return origInsertBefore.apply(this, [newNode, referenceNode]);
        };
    }
    if(settings.dispatchEvent){
        const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
        EventTarget.prototype.dispatchEvent = function(event) {
            console.log('DispatchEvent:', {
                target: this,
                event: {
                    type: event.type,
                    eventObject: event,
                }
            });
            return originalDispatchEvent.apply(this, arguments);
        };
    }
    if(settings.remove){
        const originalRemove = Element.prototype.remove;
        Element.prototype.remove = function() {
            console.log('Removed:', this);
            return originalRemove.apply(this);
        };
    }
    if(settings.setInterval){
        const originalSetInterval = unsafeWindow.setInterval;
        unsafeWindow.setInterval = function(callback, delay, ...args) {
            if (callback.toString() !== "function () { [native code] }") {
                console.log('setInterval:', {
                    function: callback.toString(),
                    callback: callback,
                    delay: delay,
                    args: args
                });
            }
            return originalSetInterval(callback, delay, ...args);
        };
    }
    if(settings.setTimeout){
        const originalSetTimeout = unsafeWindow.setTimeout;
        unsafeWindow.setTimeout = function(callback, delay, ...args) {
            if (callback.toString() !== "function () { [native code] }") {
                console.log('setTimeout:', {
                    function: callback.toString(),
                    callback: callback,
                    delay: delay,
                    args: args
                });
            }
            return originalSetTimeout(callback, delay, ...args);
        }
    }
    if(settings.requestIdleCallback){
        const originalRequestIdleCallback = unsafeWindow.requestIdleCallback;
        unsafeWindow.requestIdleCallback = function(callback, options) {
            if (callback.toString() !== "function () { [native code] }") {
                console.log('requestIdleCallback', {
                    function: callback.toString(),
                    callback: callback,
                    options,
                });
            }
            return originalRequestIdleCallback(callback, options);
        };
    }
};
analyzer()

const createSettingsUI = () => {
    // Remove existing settings menu if it exists
    const existingMenu = document.getElementById("settingsMenu");
    if (existingMenu) {
        document.body.removeChild(existingMenu);
    }

    // 画面サイズを取得し、メニューの大きさを調整
    const screenWidth = window.innerWidth * 0.8;
    const screenHeight = window.innerHeight * 0.8;

    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.background = 'white';
    div.style.padding = '20px';
    div.style.zIndex = '10000';
    div.style.width = `${screenWidth}px`;
    div.style.height = `${screenHeight}px`;
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
    div.style.overflowY = "scroll";
    div.style.overflow = 'auto'; // はみ出し防止
    div.style.flexDirection = 'row';
    div.style.flexWrap = 'wrap';
    div.id = "settingsMenuGRMP";

    // 閉じるボタン（右上）
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '✖';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'none';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => document.body.removeChild(div);
    div.appendChild(closeBtn);

    // 設定項目を追加
    const categories = {
        "DOM": ["append", "appendChild", "before", "after", "insertBefore", "ShadowDOM", "remove", "querySelector", "querySelectorAll"],
        "Object": ["defineProperty"],
        "Event": ["event", "dispatchEvent"],
        "Network": ["fetch", "XMLHttpRequest", "webSocket"],
        "Timer": ["setInterval", "setTimeout", "requestIdleCallback"],
    };

    for (let category in categories) {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.padding = '10px';
        categoryDiv.style.overflow = 'hidden';

        // 親カテゴリーのラベル
        const categoryLabel = document.createElement('label');
        categoryLabel.style.display = 'flex';
        categoryLabel.style.alignItems = 'center';
        categoryLabel.style.fontSize = '18px';
        categoryLabel.style.marginBottom = '10px';
        categoryLabel.style.fontWeight = 'bold';

        const categoryCheckbox = document.createElement('input');
        categoryCheckbox.type = 'checkbox';
        categoryCheckbox.id = category
        categoryCheckbox.checked = settings[category] || false;
        categoryCheckbox.style.marginRight = '10px';
        categoryCheckbox.onclick = e => {
            let targetCategory = e.target.id;
            let checks;

            if (targetCategory == "DOM") checks = document.querySelectorAll(".DOM");
            if (targetCategory == "Object") checks = document.querySelectorAll(".Object");
            if (targetCategory == "Event") checks = document.querySelectorAll(".Event");
            if (targetCategory == "Network") checks = document.querySelectorAll(".Network");
            if (targetCategory == "Timer") checks = document.querySelectorAll(".Timer");

            let isChecked = categoryCheckbox.checked;

            checks.forEach(val => {
                val.checked = isChecked;
                GM_setValue(val.id, isChecked);
                console.log(`${val.id} is now ${isChecked}`);
            });
        };

        categoryLabel.appendChild(categoryCheckbox);
        categoryLabel.appendChild(document.createTextNode(category));
        categoryDiv.appendChild(categoryLabel);

        // 子要素のチェックボックス
        categories[category].forEach(key => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.fontSize = '16px';
            label.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.className = [category];
            checkbox.checked = settings[key] || false;
            checkbox.onclick = e => {
                let targetCategory = e.target.className;
                let checks;

                if(targetCategory == "DOM") checks = document.querySelectorAll(".DOM");
                if(targetCategory == "Object") checks = document.querySelectorAll(".Object");
                if(targetCategory == "Event") checks = document.querySelectorAll(".Event");
                if(targetCategory == "Network") checks = document.querySelectorAll(".Network");
                if(targetCategory == "Timer") checks = document.querySelectorAll(".Timer");

                checks.forEach(elm => {
                    if (elm.checked == false) {
                        document.querySelector("#" + elm.className).checked = false;
                    }

                    if (document.querySelectorAll('.' + elm.className + ':checked').length == checks.length){
                        document.querySelector("#" + elm.className).checked = true;
                    }
                });
                toggleSetting(key);
            }
            checkbox.style.marginRight = '10px';

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(key));
            categoryDiv.appendChild(label);
        });

        div.appendChild(categoryDiv);
    }

    document.body.appendChild(div);

    // 設定メニュー以外の要素をクリックすると閉じる
    document.addEventListener('click', e => {
        if (!div.contains(e.target)) {
            document.body.removeChild(div);
        }
    }, { once: true });
};

// メニューコマンドを登録
GM_registerMenuCommand("Open Settings", createSettingsUI);