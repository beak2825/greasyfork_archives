// ==UserScript==
// @name         Woomy Mockup Browser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Does some shenanigans to recreate a class tree. SHIFT + M to open the mockup browser.
// @author       PowfuArras // Discord: @xskt
// @match        *://*.woomy.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/472521/Woomy%20Mockup%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/472521/Woomy%20Mockup%20Browser.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let socket = null;
    const postMessageToUser = (function () {
        let intervalID = null;
        function post(message) {
            socket.dispatchEvent(new MessageEvent("message", {
                data: protocol.encode(["displayText", message.length !== 0, message, "#FFFFFF"])
            }));
        }
        return function text(message) {
            clearInterval(intervalID);
            post(message);
            intervalID = setTimeout(function () {
                post("");
            }, 2500);
        };
    })();
    const mockups = {
        count: 0,
        entries: new Map(),
        getByName(name) {
            const values = [...this.entries.values()];
            return values[values.findIndex(m => m.name === name)];
        }
    };
    const natives = {
        log: console.log,
        send: WebSocket.prototype.send
    };
    WebSocket.prototype.send = function (data) {
        natives.send.call(this, data);
        WebSocket.prototype.send = natives.send;
        socket = this;
    }
    console.log = (...text) => void 0;
    const packets = {
        incoming: new Map(),
        outgoing: new Map()
    };
    function addEntryToEntryMap(map, key, value) {
        if (!map.has(key)) map.set(key, [value]);
        else map.get(key).push(value);
    }
    const protocol = {
        encode: function (message, callback) {
            addEntryToEntryMap(packets.outgoing, message[0], message);
            return callback(message);
        },
        decode: function (data, callback) {
            const message = callback(data);
            addEntryToEntryMap(packets.incoming, message[0], message);
            switch (message[0]) {
                case "da":
                    mockups.count = message[3];
                    break;
                case "mu":
                    mockups.entries.set(message[1], JSON.parse(message[2]));
                    break;
            }
            return message;
        }
    };
    for (const key in protocol) {
        const callback = protocol[key];
        Object.defineProperty(Object.prototype, key, {
            get() {
                return function (data) {
                    return callback(data, protocol[key]);
                };
            },

            set(value) {
                protocol[key] = value;
            }
        });
    }
    Object.defineProperty(Object.prototype, "statsdata", {
        get() {
            return this._statsdata;
        },
        set(value) {
            this._statsdata = value;
            natives.log(this);
            return value;
        }
    });
    async function fetchMockups(doFetch) {
        if (doFetch) {
            postMessageToUser("Preparing for mockups.");
            mockups.entries.clear();
            mockups.count = 0;
            postMessageToUser("Fetching mockup count.");
            socket.talk("da");
            await new Promise((function () {
                let intervalID = null;
                return function (resolve) {
                    intervalID = setInterval(function () {
                        if (mockups.count !== 0) {
                            clearInterval(intervalID);
                            resolve();
                        }
                    }, 10);
                }
            })());
            let requested = 0;
            const digits = (Math.log10((mockups.count ^ (mockups.countx >> 31)) - (mockups.count >> 31)) | 0) + 1;
            postMessageToUser(`Mockups to fetch: ${mockups.count}.`);
            let intervalID = setInterval(function () {
                postMessageToUser(`Fetching Mockups. Requested: (${`${requested}`.padStart(digits, "0")}/${mockups.count}) Received: (${`${mockups.entries.size}`.padStart(digits, "0")}/${mockups.count})`);
            }, 20);
            for (let i = 0, length = mockups.count; i < length; i++) {
                setTimeout(function() {
                    socket.talk("mu", i);
                    requested++;
                }, i);
            }
            await new Promise((function () {
                let intervalID = null;
                return function (resolve) {
                    intervalID = setInterval(function () {
                        if (mockups.entries.size >= mockups.count) {
                            clearInterval(intervalID);
                            resolve();
                        }
                    }, 10);
                }
            })());
            clearInterval(intervalID);
            postMessageToUser(`Mockups fetched, opening mockup browser! Total: ${mockups.count}.`);
        } else {
            postMessageToUser(`Loading mockup browser without fetching new data.`);
        }
        const holder = document.createElement("div");
        holder.style.position = "absolute";
        holder.style.width = "100vw";
        holder.style.height = "100vh";
        holder.style.backgroundColor = "#00000088";
        holder.style.top = "0";
        holder.style.display = "flex";
        holder.style.alignItems = "center";
        holder.style.justifyContent = "center";
        holder.style.zIndex = "101";
        const body = document.createElement("div");
        body.style.padding = "2vmin";
        body.style.width = "70vmin";
        body.style.height = "70vmin";
        body.style.backgroundColor = "#CCCCCC";
        body.style.borderRadius = "2vmin";
        body.style.boxShadow = "0 0 1vmin #00000066, 0 0 2vmin #00000066";
        body.style.overflowY = "scroll";
        body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 512px; width: 512px;"><g class="" transform="translate(0,0)" style=""><path d="M217 28.098v455.804l142-42.597V70.697zm159.938 26.88l.062 2.327V87h16V55zM119 55v117.27h18V73h62V55zm258 50v16h16v-16zm0 34v236h16V139zm-240 58.727V233H41v46h96v35.273L195.273 256zM244 232c6.627 0 12 10.745 12 24s-5.373 24-12 24-12-10.745-12-24 5.373-24 12-24zM137 339.73h-18V448h18zM377 393v14h16v-14zm0 32v23h16v-23zM32 471v18h167v-18zm290.652 0l-60 18H480v-18z" fill="#ff0000" fill-opacity="1"/></g></svg>`;
        const exitButton = body.childNodes[0];
        exitButton.style.width = "8vmin";
        exitButton.style.height = "8vmin";
        exitButton.style.float = "right";
        exitButton.style.filter = "drop-shadow(0 0 0.5vmin #00000066)";
        exitButton.style.cursor = "pointer";
        exitButton.onclick = function () {
            holder.remove();
            postMessageToUser("Mockup browser closed");
        };
        holder.appendChild(body);
        function buildTree(mockup, parentElement, suffix, isRoot) {
            const liElement = document.createElement("li");
            const spanElement = document.createElement("span");
            liElement.style.fontSize = spanElement.style.fontSize = "2vmin";
            spanElement.textContent = `${mockup.name} - ${mockup.index}${suffix}`;
            liElement.appendChild(spanElement);
            liElement.style.listStyle = "none";
            liElement.style.margin = "0";
            liElement.style.padding = "0";
            if (!isRoot) liElement.style.marginLeft = "2vmin";
            if (mockup.upgrades !== undefined) {
                let isHidden = true;
                spanElement.style.cursor = "pointer";
                spanElement.textContent = `◇ ${spanElement.textContent}`;
                spanElement.onclick = function () {
                    if (isHidden) {
                        spanElement.textContent = `◈ ${spanElement.textContent.slice(2)}`;
                        const ulElement = document.createElement("ul");
                        ulElement.style.margin = "0";
                        ulElement.style.padding = "0";
                        ulElement.style.marginLeft = "2vmin";
                        mockup.upgrades.forEach(function (upgrade) {
                            buildTree(mockups.entries.get(upgrade.index), ulElement, ` - tier ${upgrade.tier}`, false);
                        });
                        liElement.appendChild(ulElement);
                    } else {
                        spanElement.textContent = `◇ ${spanElement.textContent.slice(2)}`;
                        liElement.children[1].remove();
                    }
                    isHidden = !isHidden;
                };
            }
            parentElement.appendChild(liElement);
        }
        const ulElement = document.createElement("ul");
        ulElement.style.margin = "0";
        ulElement.style.padding = "0";
        buildTree(mockups.getByName("Basic"), ulElement, "", true);
        body.appendChild(ulElement);
        holder.appendChild(body);
        document.body.appendChild(holder);
        body.focus();
    };

    function doPrompt(text, options = []) {
        let choice = -1;
        const holder = document.createElement("div");
        holder.style.position = "absolute";
        holder.style.width = "100vw";
        holder.style.height = "100vh";
        holder.style.backgroundColor = "#00000088";
        holder.style.top = "0";
        holder.style.display = "flex";
        holder.style.alignItems = "center";
        holder.style.justifyContent = "center";
        holder.style.zIndex = "102";
        const body = document.createElement("div");
        body.style.padding = "2vmin";
        body.style.width = "60vmin";
        body.style.height = "25vmin";
        body.style.backgroundColor = "#CCCCCC";
        body.style.borderRadius = "2vmin";
        body.style.boxShadow = "0 0 1vmin #00000066, 0 0 2vmin #00000066";
        body.style.overflowY = "scroll";
        body.style.display = "flex";
        body.style.flexDirection = "column";
        const span = document.createElement("span");
        span.textContent = text;
        span.style.fontSize = "2vmin";
        body.appendChild(span);
        const buttonHolder = document.createElement("div");
        buttonHolder.style.marginTop = "auto";
        buttonHolder.style.display = "flex";
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const iiiiiiii = i;
            switch (option.type) {
                case "button": {
                    const button = document.createElement("div");
                    button.style.marginRight = "1vmin";
                    button.style.padding = "1vmin";
                    button.style.backgroundColor = option.color;
                    button.style.display = "flex";
                    button.style.alignItems = "center";
                    button.style.justifyContent = "center";
                    button.style.width = "fit-content";
                    button.style.height = "3vmin";
                    button.style.borderRadius = "1vmin";
                    button.style.cursor = "pointer";
                    button.style.float = "bottom";
                    const text = document.createElement("p");
                    text.textContent = option.text;
                    text.style.color = "#FFFFFF";
                    text.style.fontSize = "2vmin";
                    button.appendChild(text);
                    buttonHolder.appendChild(button);
                    button.addEventListener("click", function () {
                        choice = iiiiiiii;
                        holder.remove();
                    });
                }; break;
            }
        }
        body.appendChild(buttonHolder);
        holder.appendChild(body);
        document.body.appendChild(holder);
        body.focus();
        let intervalID = null;
        return new Promise(resolve => {
            intervalID = setInterval(function () {
                if (choice !== -1) {
                    resolve(choice);
                    clearInterval(intervalID);
                }
            }, 10);
        });
    }

    window.addEventListener("load", function () {
        let nextTime = 0;
        let hasData = false;
        document.getElementById("gameCanvas").addEventListener("keydown", async function (event) {
            if (event.shiftKey && event.keyCode === 77) {
                const now = performance.now();
                if (nextTime > now) {
                    postMessageToUser(`Please wait 20 seconds between fetching mockups! Time: (${(Math.ceil((nextTime - now) * 0.01) * 0.1) | 0}/20)`);
                    return;
                }
                nextTime = performance.now() + 20_000;
                if (hasData) {
                    const option = await doPrompt("Do you want to refetch or use cache?", [{ type: "button", color: "#00AA00", text: "Yes, refetch" }, { type: "button", color: "#AA0000", text: "No, use cache" }]);
                    fetchMockups(option === 0);
                } else {
                    fetchMockups(true);
                    hasData = true;
                }
            }
        });
    });
    window.packeteer = {
        protocol: protocol,
        packets: packets,
        natives: natives,
        mockups: mockups,
        doPrompt: doPrompt,
        get socket() {
            return socket;
        }
    };
})();