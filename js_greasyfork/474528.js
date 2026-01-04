// ==UserScript==
// @name         Woomy Combo Bursts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds in Osu! combo bursts into woomy, specifically from this skin: https://osu.ppy.sh/community/forums/topics/1249007
// @author       PowfuArras // Discord: @xskt
// @match        *://*.woomy.app/*
// @icon         https://xskt.glitch.me/assets/images/icon.png
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/474528/Woomy%20Combo%20Bursts.user.js
// @updateURL https://update.greasyfork.org/scripts/474528/Woomy%20Combo%20Bursts.meta.js
// ==/UserScript==

(async function() {
    "use strict";
    const canvasElement = document.createElement("canvas");
    canvasElement.style.position = "absolute";
    canvasElement.style.top = "0px";
    canvasElement.style.left = "0px";
    canvasElement.style.pointerEvents = "none";
    const ctx = canvasElement.getContext("2d");
    function resizeEvent() {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
    }
    window.addEventListener("resize", () => resizeEvent());
    resizeEvent();
    window.addEventListener("load", function () {
        document.body.appendChild(canvasElement);
    });
    function easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }
    function lerp(start, end, t) {
        return start + t * (end - start);
    }
    class Combobursts {
        static url = "https://xskt.glitch.me/assets/";
        static imagePath = "images/combobursts%id%.png";
        static soundPath = "sounds/combobursts%id%.wav";
        static soundBreakPath = "sounds/combobreak.ogg";
        static imageDeathPath = "images/death.png";
        static imageConnectingPath = "images/connecting.png";
        static imageIconPath = "images/icon.png";
        static imageSettingsPath = "images/settings.gif";
        static images = [];
        static sounds = [];
        static breakSound = null;
        static deathImage = null;
        static connectingImage = null;
        static loaded = false;
        static connected = true;
        static connectedLerp = 0;
        static dead = false;
        static deadLerped = 0;
        static currentImageIndex = 0;
        static currentSoundIndex = 0;
        static currentSide = "right";
        static bursts = [];
        static muteSounds = localStorage.getItem("Powfuarras_ComboBurstsMuted") === "true" ?? true;
        static audioTypes = new Map([
            ["mp3", "audio/mpeg"],
            ["ogg", "audio/ogg"],
            ["wav", "audio/wav"]
        ]);

        static getAudioType(file) {
            return this.audioTypes.get(file.split(".").slice(-1)) ?? "";
        }

        static async loadImage(src) {
            const imgElement = document.createElement("img");
            imgElement.src = src;
            return new Promise(resolve => void (imgElement.onload = () => resolve(imgElement)));
        }

        static doBurst() {
            this.bursts.unshift({
                side: this.currentSide,
                image: this.images[this.currentImageIndex],
                frame: 0
            });
            if (this.bursts.length > 2) this.bursts.length = 2;
            this.currentSide = this.currentSide === "left" ? "right" : "left";
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            if (!this.muteSounds) this.sounds[this.currentSoundIndex++ % this.sounds.length].play();
        }

        static drawBackground(image) {
            const scaleX = canvasElement.width / image.width;
            const scaleY = canvasElement.height / image.height;
            const scale = Math.max(scaleX, scaleY);
            const offsetX = (canvasElement.width - image.width * scale) / 2;
            const offsetY = (canvasElement.height - image.height * scale) / 2;
            ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale);
        }

        static draw() {
            requestAnimationFrame(() => this.draw());
            if (!this.loaded) {
                return;
            }
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            this.bursts.forEach((burst, i) => {
                if (burst.frame === 101) {
                    return void this.bursts.splice(i, 1);
                }
                const width = canvasElement.height / burst.image.height * burst.image.width;
                const ratio = burst.frame / 100;
                const moveRatio = Math.min(1, easeOutQuad(ratio) * 1.05);
                ctx.globalAlpha = (1 - ratio ** 3);
                if (burst.side === "left") {
                    ctx.drawImage(burst.image, -width * (1 - moveRatio), 0, width, canvasElement.height);
                } else {
                    ctx.scale(-1, 1);
                    ctx.drawImage(burst.image, -canvasElement.width -width * (1 - moveRatio), 0, width, canvasElement.height);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                burst.frame++;
            });
            this.deadLerped = lerp(this.deadLerped, +this.dead, 0.1);
            if (this.deadLerped > 0.01) {
                ctx.globalAlpha = this.deadLerped;
                this.drawBackground(this.deathImage);
            }
            this.connectedLerp = lerp(this.connectedLerp, +!this.connected, 0.1);
            if (this.connectedLerp > 0.01) {
                ctx.globalAlpha = this.connectedLerp;
                this.drawBackground(this.connectingImage);
            }
        }

        static loadAudio(src) {
            const sourceElement = document.createElement("source");
            sourceElement.src = src;
            sourceElement.type = this.getAudioType(src);
            const audioElement = document.createElement("audio");
            return new Promise(function (resolve) {
                audioElement.oncanplaythrough = () => resolve(audioElement);
                audioElement.appendChild(sourceElement);
                audioElement.volume = 0.2;
            });
        }

        static async initiate(imageAmount, soundAmount, iconElement) {
            const images = [];
            const sounds = [];
            iconElement.src = `${this.url}${this.imageIconPath}`;
            for (let i = 0; i < imageAmount; i++) {
                images.push(await this.loadImage(`${this.url}${this.imagePath}`.replace("%id%", `${i}`.padStart(2, "0"))));
            }
            for (let i = 0; i < soundAmount; i++) {
                sounds.push(await this.loadAudio(`${this.url}${this.soundPath}`.replace("%id%", `${i}`.padStart(2, "0"))));
            }
            this.breakSound = await this.loadAudio(`${this.url}${this.soundBreakPath}`);
            this.deathImage = await this.loadImage(`${this.url}${this.imageDeathPath}`);
            this.connectingImage = await this.loadImage(`${this.url}${this.imageConnectingPath}`);
            await new Promise(resolve => {
                let interval = setInterval(() => {
                    try {
                        const element = document.getElementById("settings-button");
                        element.style.backgroundImage = `url('${this.url}${this.imageSettingsPath}')`;
                        element.style.backgroundSize = "cover";
                        element.style.width = "60px";
                        element.style.height = "60px";
                        element.style.cursor = "pointer";
                        element.style.opacity = "1";
                        element.style.borderRadius = "100%";
                        clearInterval(interval);
                        resolve();
                    } catch {}
                }, 10);
            });
            this.bursts = [];
            this.images = images;
            this.sounds = sounds;
            this.loaded = true;
        }
    }
    window.addEventListener("keydown", event => event.keyCode === 13 && (Combobursts.dead = false));
    if (typeof ({}).encode === "function" && !Object.hasOwn(window, "woomyprotocol")) alert("A script is trying to hook into the protocol via an unsafe method causing a conflict. Disable disable or update conflicting scripts, please!");
    if (!Object.hasOwn(window, "woomyprotocol")) {
        class Listener {
            _listeners = new Map();
            _listenerID = 0;
            listen(callback) {
                this._listeners.set(this._listenerID++, callback);
            }

            unlisten(index) {
                this._listeners.remove(index);
            }

            _fire(data) {
                this._listeners.forEach(callback => {
                    try {
                        callback(data);
                    } catch {}
                });
            }
        }
        const module = {
            beforeEncode: new Listener(),
            beforeDecode: new Listener(),
            _encode: null,
            _decode: null
        };
        const protocol = {
            encode: function (message, callback) {
                if (message != null) module.beforeEncode._fire(message);
                return callback(message);
            },
            decode: function (data, callback) {
                const message = callback(data);
                if (message != null) module.beforeDecode._fire(message);
                return message;
            }
        };
        for (const key in protocol) {
            const callback = protocol[`${key}`];
            Object.defineProperty(Object.prototype, key, {
                get() {
                    return function (data) {
                        return callback(data, protocol[key]);
                    };
                },

                set(value) {
                    protocol[key] = value;
                    module[`_${key}`] = value;
                }
            });
        }
        window.woomyprotocol = module;
    }
    window.woomyprotocol.beforeDecode.listen(function (message) {
        if (Combobursts.loaded) {
            switch (message[0]) {
                case "AA":
                    if (message[1] === 0) Combobursts.doBurst();
                    break;
                case "F":
                    if (!Combobursts.muteSounds) Combobursts.breakSound.play();
                    Combobursts.dead = true;
                    break;
                case "R":
                case "r":
                    Combobursts.connected = true;
            }
        }
    });
    window.addEventListener("load", function () {
        Combobursts.initiate(3, 2, document.querySelectorAll(".icon")[0]);
        setTimeout(() => {
            if (Combobursts.loaded) return;
            alert("Failed to fetch required resources for combobursts, reloading!\nAlso note this can take multiple times due too an issue with tampermonkey.");
            location.reload();
        }, 6e3);
        const backgroundElement = document.getElementsByClassName("background")[0];
        let interval = setInterval(function () {
            if (!document.body.contains(backgroundElement)) {
                clearInterval(interval);
                Combobursts.connected = false;
            }
        }, 10);
    });
    requestAnimationFrame(() => Combobursts.draw());
    let interval = setInterval(function () {
        try {
            const element = document.getElementById("Woomy_mainMenuStyle").parentElement.parentElement.cloneNode(true);
            clearInterval(interval);
            element.childNodes[0].textContent = "Mute Combobursts: ";
            const container = document.querySelector(".optionsFlexHolder");
            container.insertBefore(element, document.getElementById("Woomy_mainMenuStyle").parentElement.parentElement);
            element.children[0].children[0].id = "Powfuarras_ComboBurstsMuted";
            element.children[0].children[0].checked = Combobursts.muteSounds;
            element.children[0].children[0].onchange = function () {
                const checked = element.children[0].children[0].checked;
                Combobursts.muteSounds = checked
                localStorage.setItem("Powfuarras_ComboBurstsMuted", checked);
            }
        } catch {

        }
    }, 1000);
})();