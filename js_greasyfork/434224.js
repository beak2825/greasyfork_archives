// ==UserScript==
// @name         Mod Panel for Shell Shockers 
// @version      0.2
// @author       A3+++
// @description  Feat. RAINBOW CROSSHAIR, FOG MOD, SKIN MOD, SKY COLOR MOD
// @match        *://shellshock.io/*
// @namespace    https://greasyfork.org/users/815159
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434224/Mod%20Panel%20for%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/434224/Mod%20Panel%20for%20Shell%20Shockers.meta.js
// ==/UserScript==
(function () {
 
    const shellMod = {
        interval: null,
        gui: null,
        storedData: {
            scene: null,
            camera: null,
            reticle: null,
            rainbowCrosshairEnabled: false,
            colorDelta: 0.89,
            colorIdx: 0,
            colors: [[], [], []],
            skyColor: "#FFFFFF",
            skyBoxAlpha: 1,
            useSkyColor: false,
            fogDensity: 0.01,
            fogColor: "#FFFFFF",
        },
        replacements: {
            unlockSkins: {
                regex: /inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/,
                replace: "rep = `${match[0]}||true`"
            },
            camera: {
                regex: /.push\(([A-z]+)\),\w+.maxZ=100/,
                replace: "rep = `${match[0]},window.modHelper.camera=${match[1]}`"
            },
            scene: {
                regex: /([A-z][A-z])\.fogDensity=.01\)/,
                replace: "rep = `${match[0]};window.modHelper.scene=${match[1]}`"
            },
            crosshairs: {
                regex: /document.getElementById\("reticleDot"\)/,
                replace: "rep = `${match[0]};window.modHelper.reticle=this;${atob('ZG9jdW1lbnQudGl0bGU=')}=atob('U2hlbGwgU2hvY2tlcnMgfCBNb2RkZWQgYnkgQTMgfCBieSBCbHVlIFdpemFyZCBEaWdpdGFs');`"
            }
        },
        updateSky: function () {
            if (!this.storedData.scene) return;
            let skyMesh = this.storedData.scene.getMeshByID("skyBox");
            if (skyMesh) {
                if (!skyMesh.oldTexture) skyMesh.oldTexture = skyMesh.material.reflectionTexture;
 
                if (this.storedData.useSkyColor) {
                    skyMesh.material.emissiveColor.set(...this.hexToRgb(this.storedData.skyColor));
                    skyMesh.material.reflectionTexture = null;
                    skyMesh.material.alpha = this.storedData.skyBoxAlpha;
 
                } else {
                    skyMesh.material.emissiveColor.set(...this.hexToRgb("#000000"));
                    skyMesh.material.reflectionTexture = skyMesh.oldTexture;
                    skyMesh.material.alpha = 1;
 
                }
            }
        },
        updateFog: function () {
            if (!this.storedData.scene) return;
 
            this.storedData.scene.fogColor.set(...this.hexToRgb(this.storedData.fogColor));
            this.storedData.scene.fogDensity = this.storedData.fogDensity;
        },
        hexToRgb: function (hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [];
        },
        doHooks: function () {
            window.XMLHttpRequest = class extends window.XMLHttpRequest {
                constructor() {
                    super(...arguments);
                }
                open() {
                    if (arguments[1] && arguments[1].includes("shellshock.js")) this.scriptMatch = true;
 
                    super.open(...arguments);
                }
                get response() {
 
                    if (this.scriptMatch) {
                        let responseText = super.response;
 
 
                        let rep;
                        for (let key of Object.keys(shellMod.replacements)) {
 
                            let replacement = shellMod.replacements[key];
                            let match = responseText.match(replacement.regex);
                            if (match) responseText = responseText.replace(match[0], eval(replacement.replace));
                        }
 
                        return responseText;
                    }
                    return super.response;
                }
            };
 
        },
        createGUI: function () {
            this.gui = new guify({
                title: "<b>Mod Panel</b>",
                theme: "dark",
                align: "left",
                width: 300,
                barMode: "none",
                panelMode: "none",
                opacity: 0.90,
                root: window.container,
                open: true
            });
 
            this.gui.Register([{
                type: "folder",
                label: "Fog Controls",
                open: false
            }, {
                type: "folder",
                label: "Sky Color",
                open: false
            }, {
                type: "folder",
                label: "Rainbow Crosshair",
                open: false
            }]);
 
            this.gui.Register([{
                type: "checkbox",
                label: "Enabled",
                object: this.storedData,
                property: "useSkyColor",
                onChange: () => this.updateSky()
            }, {
                type: "color",
                label: "Sky Color:",
                format: "hexColor",
                object: this.storedData,
                property: "skyColor",
                onChange: () => this.updateSky()
            }, {
                type: "range",
                label: "Alpha:",
                min: 0, max: 1,
                object: this.storedData,
                property: "skyBoxAlpha",
                onChange: () => this.updateSky()
            }], {
                folder: "Sky Color"
            });
 
            this.gui.Register([{
                type: "range",
                label: "Fog Density:",
                min: 0, max: 1,
                object: this.storedData,
                property: "fogDensity",
                onChange: () => this.updateFog()
            }, {
                type: "color",
                label: "Fog Color:",
                format: "hexColor",
                object: this.storedData,
                property: "fogColor",
                onChange: () => this.updateFog()
            }], {
                folder: "Fog Controls"
            });
 
            this.gui.Register([{
                type: "checkbox",
                label: "Enabled:",
                object: this.storedData,
                property: "rainbowCrosshairEnabled",
            }, {
                type: "range",
                label: "Delta:",
                min: 0, max: 2.5,
                object: this.storedData,
                property: "colorDelta",
            }], {
                folder: "Rainbow Crosshair"
            });
 
            this.gui.Register({
                type: "title",
                label: "Created by A3+++"
            }).container.align = "center";
 
            this.gui.panel.menuButton.style.opacity = 0.3;
        },
        loadMod: function () {
            const addScript = function () {
                let script = document.createElement('script');
                script.onload = function () { shellMod.createGUI() };
                script.src = "https://unpkg.com/guify@0.12.0/lib/guify.min.js";
                document.body.appendChild(script);
            }
            document.body ? addScript() : document.addEventListener("DOMContentLoaded", addScript);
 
            this.doHooks();
 
            function HSVtoRGB(h, s, v) {
                var r, g, b, i, f, p, q, t;
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                }
                return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
            }
 
            for (let wl = 0; wl < 100; wl++) {
                const { r, g, b } = HSVtoRGB(wl / 100.0 * 0.85, 1.0, 1.0);
 
                this.storedData.colors[0].push(r);
                this.storedData.colors[1].push(g);
                this.storedData.colors[2].push(b);
            }
 
            if (!this.interval) {
                this.interval = setInterval(function () {
                    if (shellMod.storedData.rainbowCrosshairEnabled && typeof extern !== "undefined" && extern.inGame) {
                        for (let i = 0; i < 4; i++) {
 
                            let ch = shellMod.storedData.reticle.crosshairs[i];
                            const idx = Math.mod(Math.floor(shellMod.storedData.colorIdx + 30 * i), 100);
 
                            const rgbString = `rgb(${shellMod.storedData.colors[0][idx]}, ${shellMod.storedData.colors[1][idx]}, ${shellMod.storedData.colors[2][idx]})`;
                            ch.style.backgroundColor = rgbString;
                            ch.style.color = rgbString;
 
                        }
 
                        shellMod.storedData.colorIdx += shellMod.storedData.colorDelta;
                        if (shellMod.storedData.colorIdx >= 100) shellMod.storedData.colorIdx = 0;
                    }
                    if (typeof window?.extern?.account !== "undefined" && typeof vueApp !== "undefined") {
                        if (!vueApp.isUpgraded || !extern.account.isSubscriber) { vueApp.setAccountUpgraded(true, ""); extern.account.isSubscriber = true; }
                    }
                }, 33);
            }
        }
 
    }
 
    window.modHelper = {
        set scene(c) { shellMod.storedData.scene = c },
        set camera(c) { shellMod.storedData.camera = c },
        set reticle(c) { shellMod.storedData.reticle = c }
    }
 
    shellMod.loadMod();
}())