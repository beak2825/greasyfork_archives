// ==UserScript==
// @name         Agma.io Tools - Fast Eject, Auto Re-spawn, Re-spawn on R, Quick buy
// @namespace    http://tampermonkey.net/
// @version      2.52
// @description  Fast eject, Auto Re-spawn, Re-spawn on R, Quick buy, Freeze on F, and more
// @author       reagent
// @match        agma.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391232/Agmaio%20Tools%20-%20Fast%20Eject%2C%20Auto%20Re-spawn%2C%20Re-spawn%20on%20R%2C%20Quick%20buy.user.js
// @updateURL https://update.greasyfork.org/scripts/391232/Agmaio%20Tools%20-%20Fast%20Eject%2C%20Auto%20Re-spawn%2C%20Re-spawn%20on%20R%2C%20Quick%20buy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let features = [{
        name: "Auto re-spawn",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.playBtn = document.querySelector("#playBtn");
                this.advertContinue = document.querySelector("#advertContinue");
                this.playTimeout = null;
                this.lastClosed = 0;
                this.lastDisplay = "none";
                this.advertWatch = new MutationObserver(this.advertMutation.bind(this));
                this.overlayWatch = new MutationObserver(this.overlayMutation.bind(this));
                this.resumeGame = this.resumeGame.bind(this);
                this.clearAdvert = null;
                this.clearPlay = null;
            }
            closedByDeath() {
                return Date.now() - this.lastClosed < 300;
            }
            advertMutation(mutations) {
                for (let mutation of mutations) {
                    if (mutation.target.style.display !== this.lastDisplay) {
                        this.lastDisplay = mutation.target.style.display;

                        if (this.lastDisplay !== "none") {
                            if (this.playTimeout) window.clearTimeout(this.playTimeout);
                            this.playTimeout = window.setTimeout(this.resumeGame, 5);
                        }
                    }
                }
            }
            overlayMutation(mutations) {
                if (this.overlays.style.display === "none") {
                    this.lastClosed = Date.now();
                }
            }
            resumeGame() {
                if (this.closedByDeath() || !document.hasFocus()) return; // info window was open and closed by dying in the background
                if (!this.clearAdvert) return console.error("Advert continue function still not found");

                this.playTimeout = null;
                this.clearAdvert()
                window.closeAdvert();

                if (this.clearPlay) {
                    this.clearPlay();
                    this.playBtn.click();
                } else
                    return console.error("Play button continue function still not found");
            }

            load() {
                this.advert = document.querySelector("#advert");
                this.overlays = document.querySelector("#overlays");

                this.advertWatch.observe(this.advert, { attributes: true, attributeFilter: ["style"] });
                this.overlayWatch.observe(this.overlays, { attributes: true, attributeFilter: ["style"] });

                const playBtnSearch = globals.agma.getSearchString("#playBtn");
                const continueBtnSearch = globals.agma.getSearchString("#advertContinue");

                const removePlayListener = addTimeoutListener((fn, delay) => {
                    if (fn.toString().indexOf(playBtnSearch) !== -1 && delay > 1600) {
                        this.clearPlay = fn;
                        this.clearPlay();
                        removePlayListener();
                    }
                })

                const removeContinueListener = addTimeoutListener((fn, delay) => {
                    if (fn.toString().indexOf(continueBtnSearch) != -1 && delay > 1600) {
                        this.clearAdvert = fn;
                        removeContinueListener();
                    }
                })
            }

            unload() {
                this.advertWatch.disconnect();
                this.overlayWatch.disconnect();
            }
        }
    }, {
        name: "Uncensor input",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.forbiddenWords = ["fuck", "shit", "ass", "dick", "penis", "dick", "pussy", "fag", "bitch", "sucker", "tits", "porn", "cunt", "cock"];
                this.override = window.getEventListeners("copy")[0];
                this.chatBox = document.querySelector("#chtbox");
                this.nicknameInput = document.querySelector("#nick");
                this.listener = this.listener.bind(this);
            }

            listener(event) {
                //if(event.which !== 13) return;

                const zeroWidth = String.fromCharCode(8203);
                const input = event.currentTarget;
                const text = input.value.toLowerCase();

                for (const forbidden of this.forbiddenWords) {
                    const i = text.indexOf(forbidden);

                    if (i !== -1) {
                        const found = input.value.substr(i, forbidden.length); // retain original to keep case
                        input.value = input.value.replace(found, found.split("").join(zeroWidth))
                    }
                }
            }

            load() {
                if (this.override) {
                    const { fn, capture } = this.override;
                    window.removeEventListener("copy", fn, capture)
                    window.removeEventListener("paste", fn, capture)
                    window.removeEventListener("cut", fn, capture)
                }
                this.chatBox.addEventListener("keydown", this.listener);
                this.nicknameInput.addEventListener("keydown", this.listener);
            }

            unload() {
                if (this.override) {
                    const { fn, capture } = this.override;
                    window.addEventListener("copy", fn, capture)
                    window.addEventListener("paste", fn, capture)
                    window.addEventListener("cut", fn, capture)
                }
                this.chatBox.removeEventListener("keydown", this.listener);
                this.nicknameInput.removeEventListener("keydown", this.listener);
            }
        }
    }, {
        name: "Fast Eject",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.keyDown = false;
                this.syntheticEvent = Object.freeze({ keyCode: 87, synthetic: true });
                this.pressW = this.pressW.bind(this);
                this.downListener = this.downListener.bind(this);
                this.upListener = this.upListener.bind(this);
            }
            pressW() {
                window.onkeydown(this.syntheticEvent);
                window.onkeyup(this.syntheticEvent);
                if (this.keyDown) window.setTimeout(this.pressW, 25);
            }
            downListener(event) {
                if (event.keyCode === 87 && !event.synthetic) {
                    if (this.keyDown) return;
                    this.keyDown = true;
                    window.setTimeout(this.pressW, 25);
                    window.onkeyup(this.syntheticEvent); // complete first press
                }
            }
            upListener(event) {
                if (event.keyCode === 87 && !event.synthetic) {
                    this.keyDown = false;
                }
            }
            load() {
                window.addEventListener("keydown", this.downListener);
                window.addEventListener("keyup", this.upListener);
            }
            unload() {
                window.removeEventListener("keydown", this.downListener);
                window.removeEventListener("keyup", this.upListener);
            }
        }
    }, {
        name: "Re-spawn on R",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.nicknameInput = document.querySelector("#nick");
                this.listener = this.listener.bind(this);
            }
            listener(event) {
                if (event.keyCode === 82 && globals.isGameActive()) {
                    window.rspwn(this.nicknameInput.value);
                }
            }
            load() {
                window.addEventListener("keydown", this.listener);
            }

            unload() {
                window.removeEventListener("keydown", this.listener);
            }
        }

    }, {
        name: "New identity on N | Skin on S",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.nickInput = document.querySelector("#nick");
                this.overlays = document.querySelector("#overlays");
                this.nicks = [];
                this.skins = [];
                this.lastRespawn = 0;
                this.pendingId = false;
                this.pendingSkin = false;
                this.listener = this.listener.bind(this);
                this.hookFillText = this.hookFillText.bind(this);
                this.addNick = this.addNick.bind(this);
            }
            randNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            rankUsername(username) {
                return username
                    .split("")
                    .reduce((cur, char) => cur + (char.charCodeAt(0) > 255 ? 3 : 1), 0)
            }
            sortAndTrim(list) {
                return list
                    .map(username => [this.rankUsername(username), username])
                    .sort(([rankA], [rankB]) => rankA - rankB)
                    .slice(0, 60)
                    .map(([_, username]) => username);
            }
            addNick(name) {
                if (name.length > 3 && this.nicks.indexOf(name) === -1) {
                    this.nicks.push(name);
                    this.nicks = this.sortAndTrim(this.nicks);
                }
            }
            changeSkin() {
                if (this.pendingSkin) return Promise.reject("Skin pending");
                if (this.skins.length) {
                    this.pendingSkin = true;
                    return globals.overlay.open(true)
                        .then(() => window.toggleSkin(this.skins[this.randNum(0, this.skins.length)]))
                        .then(() => globals.overlay.close())
                        .then(() => this.pendingSkin = false)
                } else {
                    return globals.message.error("No skins available, are you logged in?");
                }
            }
            changeNick() {
                this.pendingId = true;
                return new Promise((resolve, reject) => {
                    let newNick = "";
                    for (let i = 0; i < 5; i++) {
                        newNick = this.nicks[this.randNum(0, this.nicks.length)];
                        if (newNick !== this.nickInput.value) break;
                    }
                    this.nickInput.value = newNick

                    globals.message.show("Switching to: " + newNick)
                        .then(resolve)
                        .catch(reject)
                }).then(() => this.pendingId = false)
            }
            listener(event) {
                if (!globals.isGameActive()) return;
                if (event.keyCode === 78) {
                    Promise.all([this.changeSkin(), this.changeNick()]).then(() => {
                        console.log(this.nicks);
                        window.partyDecline();
                        window.rspwn(this.nickInput.value);
                    }).catch(() => { })
                } else if (event.keyCode === 73) {
                    this.changeSkin();
                }
            }

            hookFillText() {
                const origFillText = CanvasRenderingContext2D.prototype.fillText;
                const self = this;
                CanvasRenderingContext2D.prototype.fillText = function () {
                    if (this.canvas.id === "leaderboard") {
                        const item = arguments[0];
                        const start = item.indexOf(". ");
                        if (start !== -1) {
                            const name = item.substring(start + 2);
                            self.addNick(name);
                        }
                    } else if (this.canvas.height === 23) {
                        const item = arguments[0];
                        if (typeof item === "string" && this.fillStyle !== "#f5f6ce" && item !== "Agma.io") {
                            self.addNick(item)
                        }
                    }
                    return origFillText.apply(this, arguments);
                }
                return () => CanvasRenderingContext2D.prototype.fillText = origFillText;
            }
            hookRespawn() {
                const self = this;
                const rspwn = window.rspwn;

                window.rspwn = function () {
                    if (globals.message.rejectLast) {
                        globals.message.rejectLast();
                        globals.message.rejectLast = null;
                    }
                    self.lastRespawn = Date.now();
                    rspwn.apply(this, arguments);
                }
                return () => window.rspwn = rspwn;
            }
            getSkins() {
                const pages = document.querySelectorAll("#skinsCustom [id^=publicSkinsPageContent]:not(#publicSkinsPageContentNew):not(#publicSkinsPageContentPopular)");
                if (!pages.length) return [];
                return Array.from(pages)
                    .map(el => el.textContent.match(/toggleSkin\color{#fff}{([0-9]+)}([0−9]+)/g))
                    .map(matches => matches.map(match => match.substring(11, match.length - 1)))
                    .flat();
            }
            loadSkins() {
                let tries = 0;

                globals.modals.hideAll()
                window.showSkin();

                return new Promise(resolve => {
                    const retry = () => {
                        const skins = this.getSkins();
                        if (skins.length || tries++ > 5) {
                            globals.modals.closeCurrent().then(() => globals.modals.showAll());
                            resolve(skins);
                        } else {
                            window.setTimeout(retry, 2000);
                        }
                    }
                    window.setTimeout(retry, 3000);
                })
            }
            load() {
                globals.status.onLogin(() => this.loadSkins().then(skins => {
                    this.skins = skins;
                }))
                globals.status.onLogout(() => this.skins = []);

                window.addEventListener("keydown", this.listener);
                this.unhookRespawn = this.hookRespawn();
                this.unhookFillText = this.hookFillText();
            }
            unload() {
                window.removeEventListener("keydown", this.listener);
                this.unhookFillText();
                this.unhookRespawn();
            }
        }
    }, {
        name: "Quick-buy powerups with keys 1-4", // rename later
        enabled: true,
        bootstrap: class {
            constructor() {
                this.confirmButton = null;
                this.alert = null;
                this.watcher = new MutationObserver(this.onMutations.bind(this));
                [this.buyRecombine, this.buySpeed, this.buyGrowth, this.buyPushEnemies] = document.querySelectorAll(".purchase-btn.confirmation");
                this.listener = this.listener.bind(this);
            }
            onAlertAvailable() {
                const showingNow = this.alert.classList.contains("showSweetAlert");

                if (showingNow) {
                    this.confirmButton = this.confirmButton || this.alert.querySelector("button.confirm");
                    if (!this.confirmButton) return;

                    // SweetAlert will ignore all clicks until this class is added
                    // which it waits nearly a full second to add.. annoying. Wasted a lot of time debugging this.
                    // https://github.com/lipis/bootstrap-sweetalert/blob/67fdf993b35fa0a9e2c2a34d218cc9d83a59b8bd/dev/modules/handle-click.js#L42
                    this.alert.classList.add("visible");
                    this.confirmButton.click();
                }
            }
            onMutations(mutations) {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes") {
                        if (mutation.target === this.alert) {
                            this.onAlertAvailable();
                        }
                    } else if (mutation.type === "childList") {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType !== Node.ELEMENT_NODE) continue;
                            if (node.classList.contains("sweet-alert")) {
                                this.alert = node;
                                this.onAlertAvailable();
                                this.watcher.disconnect();
                                this.watcher.observe(node, { attributes: true, attributeFilter: ["class"] })
                            }
                        }
                    }
                }
            }
            listener(event) {
                if (globals.isGameActive()) { // focus is on the game rather than chat or anything else
                    if (event.keyCode === 49 || event.keyCode === 97) {
                        this.buyRecombine.click();
                    } else if (event.keyCode === 50 || event.keyCode === 98) {
                        this.buySpeed.click();
                    } else if (event.keyCode === 51 || event.keyCode === 99) {
                        this.buyGrowth.click();
                    } else if (event.keyCode === 52 || event.keyCode === 100) {
                        this.buyPushEnemies.click();
                    }
                }
            }

            load() {
                this.watcher.observe(document.body, {
                    childList: true
                });
                window.addEventListener("keydown", this.listener);
            }
            unload() {
                this.watcher.disconnect();
                window.removeEventListener("keydown", this.listener);
            }
        }
    }, {
        name: "Freeze on F | Fixate cursor on X",
        enabled: true,
        bootstrap: class {
            constructor() {
                this.release = this.release.bind(this);
                this.listener = this.listener.bind(this);
                this.capturePos = this.capturePos.bind(this);
                this.captureInt = null;
                this.freezing = false;
                this.fixating = false;
                this.currentX = Math.floor(window.innerWidth / 2);
                this.currentY = Math.floor(window.innerHeight / 2);
                //this.overlay = this.createOverlay();
            }
            createOverlay() {
                // This overlay is redundant now that we just splice into the mousemove event
                // Still I'm leaving just in case i want to reimplement it
                const overlay = document.createElement("div");
                overlay.style.position = "fixed";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.display = "none";
                overlay.style.zIndex = "100";
                overlay.addEventListener("mousemove", event => this.capturePos(event) && event.stopPropagation());
                overlay.addEventListener("mouseenter", event => event.stopPropagation());
                overlay.addEventListener("click", this.release);

                return overlay;
            }
            freeze(delay = 5, complete = false) {
                let iterations = complete ? 30 : 0;
                this.freezing = true;

                this.captureInt = window.setInterval(() => {
                    iterations++;
                    const targetX = window.innerWidth / 2;
                    const targetY = window.innerHeight / 2;

                    document.body.dispatchEvent(new MouseEvent("mousemove", { // simulate mouse slowly moving to center
                        clientX: this.currentX + (((targetX - this.currentX) / 30) * Math.min(iterations, 30)),
                        clientY: this.currentY + (((targetY - this.currentY) / 30) * Math.min(iterations, 30)),
                        detail: 0x0a
                    }))
                    if (delay === 5 && iterations > 500) {
                        window.clearInterval(this.captureInt);
                        this.freeze(100, true); // start over with reduced frequency
                    }
                }, delay);

                //this.overlay.style.display = "block";
            }
            release() {
                window.clearInterval(this.captureInt);
                this.freezing = false;
                this.fixating = false;
                this.captureInt = null;
                //this.overlay.style.display = "none";
            }
            fixate() {
                this.fixating = true;

                const targetX = this.currentX;
                const targetY = this.currentY;

                this.captureInt = window.setInterval(() => {
                    document.body.dispatchEvent(new MouseEvent("mousemove", {
                        clientX: targetX,
                        clientY: targetY,
                        detail: 0x0a
                    }));
                }, 100);

                //this.overlay.style.display = "block";
            }
            capturePos(event) {
                this.currentX = event.clientX;
                this.currentY = event.clientY;
                return true
            }
            listener(event) {
                if (!globals.isGameActive()) return;

                if (event.keyCode === 70) {
                    if (this.freezing) {
                        this.release();
                    } else {
                        if (this.fixating) this.release();
                        this.freeze();
                        globals.message.show("Frozen at current spot. Press F to unlock");
                    }
                } else if (event.keyCode === 88) {
                    if (this.fixating) {
                        this.release();
                    } else {
                        if (this.freezing) this.release();
                        this.fixate();
                        globals.message.show("Locked at current direction. Press X to unlock");
                    }
                }
            }
            hookMouseMove() {
                let orig;
                const self = this;
                // We watch for the "mousedown" event only because we know agma immediately sets it after mousemove
                // If we try to hook into mousemove immediately, it will be undefined
                window.awaitEventListener("mousedown").then(() => {
                    orig = document.body.onmousemove;
                    document.body.onmousemove = document.body.onmouseenter = function (event) {
                        if ((!self.freezing && !self.fixating) || event.detail === 0x0a) {
                            orig.apply(this, arguments);
                        }
                    }
                })
                return () => document.body.onmousemove = document.body.onmouseenter = orig;
            }
            load() {
                window.addEventListener("keydown", this.listener);
                window.addEventListener("mousemove", this.capturePos);
                this.unhookMouseMove = this.hookMouseMove()
            }
            unload() {
                window.removeEventListener("keydown", this.listener);
                window.removeEventListener("mousemove", this.capturePos);
                this.unhookMouseMove();
            }
        }
    }, {
        enabled: true,
        name: "Remove popups",
        bootstrap: function () {
            this.load = () => {
                const popups = document.querySelectorAll("body .modal");
                for (const popup of popups) {
                    if (popup.textContent.indexOf("referral") !== -1) {
                        popup.remove();
                    }
                }
                // const minionui = document.querySelector("#minionUi");
                // minionui && minionui.remove();
                // setTimeout(() => document.querySelectorAll("iframe").forEach(iframe => iframe.remove()), 3000);
            }
            this.unload = () => {

            }
        }
    }];
    const globals = {
        Modals: class {
            constructor() {
                this.modals = document.querySelectorAll(".modal");
            }
            getCurrent() {
                const backdrop = document.querySelector(".modal-backdrop");
                const modal = backdrop.parentElement;
                return modal;
            }
            closeCurrent() {
                const modal = this.getCurrent();
                return new Promise(resolve => {
                    const onClose = () => {
                        window.$(modal).off("hidden.bs.modal", onClose);
                        resolve();
                    }
                    window.$(modal).on("hidden.bs.modal", onClose)
                    window.$(modal).modal("hide");
                })
            }
            hideAll() {
                this.modals.forEach(modal => modal.classList.add("force-hide"));
            }
            showAll() {
                this.modals.forEach(modal => modal.classList.remove("force-hide"));
            }
        },
        Overlay: class {
            constructor() {
                this.openResolvers = new Map();
                this.closeResolvers = new Map();
                this.overlayOpen = true;
                this.covert = false;
                this.playBtn = document.querySelector("#playBtn");
                this.overlays = document.querySelector("#overlays");
                this.watchOverlay();
            }
            watchOverlay() {
                const observer = new MutationObserver(mutations => {
                    if (overlays.style.display === "" || overlays.style.display === "block" && overlays.style.opacity === "") {
                        if (this.overlayOpen) return;
                        this.overlayOpen = true;
                        this.onOpen();
                    } else {
                        if (!this.overlayOpen) return;
                        this.overlayOpen = false;
                        this.onClose();
                    }
                });
                observer.observe(overlays, {
                    attributes: true,
                    attributeFilter: ["style"]
                })
            }
            onOpen() {
                for (const [fn] of this.openResolvers.entries()) {
                    fn()
                    this.openResolvers.delete(fn);
                }
            }
            onClose() {
                for (const [fn] of this.closeResolvers.entries()) {
                    fn();
                    this.closeResolvers.delete(fn);
                }

                if (this.covert) {
                    this.overlays.classList.remove("force-hide");
                    this.covert = false;
                }
            }
            open(covert) {
                return new Promise(resolve => {
                    if (this.overlayOpen) return resolve();
                    this.openResolvers.set(resolve, null);

                    if (covert) {
                        this.overlays.classList.add("force-hide");
                        this.covert = true;
                    } else {
                        this.covert = false;
                    }

                    window.azad(true);
                })
            }
            close() {
                return new Promise(resolve => {
                    if (!this.overlayOpen) return resolve();
                    this.closeResolvers.set(resolve, null);
                    this.playBtn.removeAttribute("disabled");
                    this.playBtn.click();

                    if (this.covert) {
                        this.overlays.style.display = "none";
                    }
                })
            }
        },
        Status: class {
            constructor() {
                this.loggedIn = false;
                this.loginCallbacks = [];
                this.logoutCallbacks = [];
                this.watchPanel();
            }
            watchPanel() {
                const panel = document.querySelector("#dashPanel");
                const observer = new MutationObserver(mutations => {
                    if (panel.style.display === "" || panel.style.display === "block") {
                        if (this.loggedIn) return;
                        this.loggedIn = true;
                        for (const fn of this.loginCallbacks)
                            fn()
                    } else if (panel.style.display === "none") {
                        if (!this.loggedIn) return;
                        this.loggedIn = false;
                        for (const fn of this.logoutCallbacks)
                            fn();
                    }
                });
                observer.observe(panel, {
                    attributes: true,
                    attributeFilter: ["style"]
                })
            }

            onLogin(fn) {
                this.loginCallbacks.push(fn);
                if (this.loggedIn) fn();
            }
            onLogout(fn) {
                this.logoutCallbacks.push(fn)
            }
        },
        Message: class {
            constructor() {
                this.messageBar = document.querySelector("#curser");
            }
            error(message, expires = 5000) {
                this.messageBar.style.color = "rgb(255, 0, 0);"
                return this._show(message, expires);
            }
            show(message, expires = 5000) {
                this.messageBar.style.color = "rgb(0, 192, 0);"
                return this._show(message, expires)
            }
            _show(message, expires = 5000) {
                return new Promise((resolve, reject) => {
                    this.messageBar.textContent = message;

                    if (this.rejectLast) {
                        this.rejectLast();
                    }

                    this.messageBar.style.display = "block";
                    const messageTimeout = window.setTimeout(() => {
                        this.rejectLast = null;
                        this.messageBar.style.display = "none";
                        resolve()
                    }, expires)

                    this.rejectLast = () => {
                        this.messageBar.style.display = "none";
                        window.clearInterval(messageTimeout);
                        reject();
                    }
                })
            }
        },
        Agma: class {
            constructor() {
                this.globalKey = this.getGlobalKey();
                this.setGlobals();
            }
            setGlobals() {
                window.canRunAds=true;
            }
            getGlobalKey() {
                for (let key in window) {
                    if (key.indexOf("_0x") === 0
                        && window[key] instanceof Array
                        && window[key].length > 500)
                        return key;
                }
            }
            getSearchString(str) {
                const i = window[this.globalKey].indexOf(str);
                if (i === -1) return "";
                return this.globalKey + "[" + i + "]";
            }
        },
        isGameActive: () => {
            globals.playBtn = globals.playBtn || document.querySelector("#playBtn");
            return document.activeElement === document.body || document.activeElement === globals.playBtn;
        }
    }
    const hookTimeout = (window) => {
        const originalTimeout = window.setTimeout.bind(window);
        const awaiting = [];
        const nextTimeout = (function (handler, timeout) {
            for (let listener of awaiting) {
                listener(handler, timeout);
            }
            originalTimeout(handler, timeout);
        });

        const addTimeoutListener = (listener) => {
            if (window.setTimeout !== nextTimeout) {
                window.setTimeout = nextTimeout;
            }
            awaiting.push(listener);
            return () => {
                awaiting.splice(awaiting.indexOf(listener), 1);
                if (!awaiting.length) {
                    window.setTimeout = originalTimeout;
                }
            }
        }

        return [() => window.setTimeout = originalTimeout, addTimeoutListener]
    }
    const hookEvents = (EventTarget) => {
        const originalAdd = EventTarget.prototype.addEventListener;
        const originalRemove = EventTarget.prototype.removeEventListener;

        EventTarget.prototype.addEventListener = function () {
            originalAdd.apply(this, arguments); // run first to allow native method to halt execution in case of errors
            let [name, fn, capture] = arguments;
            capture = !!capture
            if (!this.eventListeners) this.eventListeners = [];
            this.eventListeners.push({ name, fn, capture });
            if (this.awaiting) {
                const i = this.awaiting.findIndex(({ eventName }) => eventName === name);
                if (i !== -1) {
                    this.awaiting[i].resolve();
                    this.awaiting.splice(i, 1);
                }
            }
        }

        EventTarget.prototype.removeEventListener = function () {
            originalRemove.apply(this, arguments);
            let [_name, _fn, _capture] = arguments;
            _capture = !!_capture;
            this.eventListeners = this.eventListeners ? this.eventListeners.filter(({ name, fn, capture }) => !(name === _name && fn === _fn && capture === _capture)) : [];
        }

        EventTarget.prototype.getEventListeners = function (eventName) {
            return this.eventListeners ? this.eventListeners.filter(({ name }) => name === eventName) : []
        }

        EventTarget.prototype.awaitEventListener = function (eventName) {
            return new Promise(resolve => {
                const events = this.getEventListeners(eventName);
                if (events.length) {
                    resolve();
                } else {
                    if (!this.awaiting) this.awaiting = [];
                    this.awaiting.push({ eventName, resolve })
                }
            })
        }

        return () => {
            EventTarget.prototype.addEventListener = originalAdd;
            EventTarget.prototype.removeEventListener = originalRemove;
            delete EventTarget.prototype.getEventListeners;
        }
    }
    const hookStyle = () => {
        const style = document.createElement("style")
        style.appendChild(document.createTextNode(".force-hide{display: none !important;}"));

        document.documentElement.appendChild(style);
        return () => document.documentElement.removeChild(style);
    }
    const hookProtections = () => {
        const orig = Document.prototype.createElement;
        Document.prototype.createElement = function (tag) {
            if (tag.toLowerCase() === "iframe") {
                tag = "div";
            }
            return orig.call(this, tag);
        }

        // if push comes to shove, i guess we could also just modify jQuery's selector fn
        // or the underlying document function calls
        // so they return a different iframe that we control

        Object.freeze(Document.prototype);
        Object.freeze(window.EventTarget.prototype);
        Object.freeze(window.EventTarget);
        Object.freeze(window.MutationObserver.prototype);
        Object.freeze(window.MutationObserver)
    }
    const init = () => {
        for (const global in globals) {
            if (global.charAt(0).toLowerCase() !== global.charAt(0))
                globals[global.toLowerCase()] = new globals[global]();
        }
        for (const feature of features) {
            if (feature.enabled) {
                feature.instance = new feature.bootstrap();
                feature.instance.load();
            }
        }
    }

    const hookTimeouts = () => {
        // Dear Agma admin, can we stop this arms race and just let people have fun?
        const timeoutListeners = [hookTimeout(window)];
        const onIframe = (frame) => {
            if (frame.src.indexOf("agma.io") === -1 || frame.contentWindow.hooked) return;
            timeoutListeners.push(hookTimeout(frame.contentWindow))
            hookEvents(frame.contentWindow.EventTarget);
            frame.contentWindow.hooked = true;
        }

        const observer = new MutationObserver(muts =>
            muts.forEach(mut => {
                if (mut.target.nodeType === Node.ELEMENT_NODE) {
                    if (mut.target.localName === "iframe") {
                        onIframe(mut.target);
                    } else {
                        document.querySelectorAll("iframe").forEach(frame => onIframe(frame));
                    }
                }
            })
        );

        observer.observe(document.documentElement, { childList: true, subtree: true });

        const addTimeoutListener = (fn) => {
            const listeners = [];
            for (const [_, addTimeoutListener] of timeoutListeners) {
                listeners.push(addTimeoutListener(fn));
            }
            return () => listeners.forEach(remover => remover());
        }
        const unhook = () => {
            observer.disconnect();
            timeoutListeners.forEach(unhooker => unhooker());
        }

        return [addTimeoutListener, unhook]
    }

    const unhookEvents = hookEvents(window.EventTarget);
    const unhookStyle = hookStyle();
    const [addTimeoutListener, unhookTimeouts] = hookTimeouts();
    hookProtections();

    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }
})();