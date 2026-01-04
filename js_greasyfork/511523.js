// ==UserScript==
// @name w210
// @author unknown
// @description Google the name of this mod.
// @version final
// @match *://sploop.io/*
// @run-at document-start
// @icon     https://cdn.discordapp.com/attachments/664899301247287298/878019963900817448/743a8ebae02a90a9b147c97fb03faff4.jpg
// @namespace https://greasyfork.org/users/738839
// @downloadURL https://update.greasyfork.org/scripts/511523/w210.user.js
// @updateURL https://update.greasyfork.org/scripts/511523/w210.meta.js
// ==/UserScript==
Function("(" + ((GM_info) => {
    var __webpack_modules__ = {
        147: module => {
            module.exports = {
                i8: ""
            };
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    var __webpack_exports__ = {};
    (() => {
        __webpack_require__.d(__webpack_exports__, {
            sv: () => Sploop,
            Ih: () => controller,
            vU: () => error,
            cM: () => log,
        });
        var ELayer;
        (function(ELayer) {
            ELayer[ELayer["enemy"] = -1] = "enemy;"
            ELayer[ELayer["PLAYER"] = 0] = "PLAYER";
            ELayer[ELayer["HARDSPIKE"] = 2] = "HARDSPIKE";
            ELayer[ELayer["TRAP"] = 6] = "TRAP";
            ELayer[ELayer["SPIKE"] = 7] = "SPIKE";
            ELayer[ELayer["WOODWALL"] = 8] = "WOODWALL";
            ELayer[ELayer["BOOST"] = 10] = "BOOST";
            ELayer[ELayer["PROJECTILE"] = 12] = "PROJECTILE";
            ELayer[ELayer["WINDMILL"] = 13] = "WINDMILL";
            ELayer[ELayer["SPAWN"] = 15] = "SPAWN";
            ELayer[ELayer["POWERMILL"] = 16] = "POWERMILL";
            ELayer[ELayer["WOODFARM"] = 19] = "WOODFARM";
            ELayer[ELayer["CHERRYWOODFARM"] = 20] = "CHERRYWOODFARM";

        })(ELayer || (ELayer = {}));
        const LayerDataArray = [ {
            id: ELayer.enemy,
            radius: 35,
            maxHealth: 100,
            Qa: 1
        },{
            id: ELayer.PLAYER,
            radius: 35,
            maxHealth: 100,
            Qa: 1
        }, {
            id: ELayer.STONE,
            shoot: true,
            radius: 75,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.HARDSPIKE,
            shoot: true,
            qa: 35,
            radius: 45,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.TREE,
            shoot: true,
            cannotShoot: true,
            radius: 90,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.GOLD,
            shoot: true,
            radius: 76,
            Qa: 1,
            Xa: 5
        }, {
            id: ELayer.BUSH,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 1
        }, {
            id: ELayer.TRAP,
            radius: 40,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.SPIKE,
            shoot: true,
            qa: 20,
            radius: 45,
            maxHealth: 375,
            Ia: 20,
            Qa: 1
        }, {
            id: ELayer.WOODWALL,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.PLATFORM,
            radius: 60,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.BOOST,
            radius: 40,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.LOOTBOX,
            radius: 40,
            maxHealth: 4,
            Qa: 1
        }, {
            id: ELayer.PROJECTILE,
            radius: 0,
            maxHealth: 0
        }, {
            id: ELayer.WINDMILL,
            shoot: true,
            radius: 45,
            maxHealth: 400,
            rotateSpeed: Math.PI / 4,
            Qa: 1
        }, {
            id: ELayer.COW,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.SPAWN,
            shoot: true,
            radius: 50,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.POWERMILL,
            shoot: true,
            radius: 54,
            maxHealth: 400,
            rotateSpeed: 0,
            Qa: 1
        }, {
            id: ELayer.CASTLESPIKE,
            shoot: true,
            qa: 5,
            radius: 42,
            maxHealth: 1200,
            Ia: 24,
            Qa: 1
        }, {
            id: ELayer.TURRET,
            shoot: true,
            radius: 45,
            maxHealth: 800,
            Qa: 1
        }, {
            id: ELayer.WOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.CHERRYWOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.STONEWARM,
            shoot: true,
            radius: 60,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.CASTLEWALL,
            shoot: true,
            radius: 59,
            maxHealth: 1750,
            Qa: 1
        }, {
            id: ELayer.SHARK,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.2,
            $a: 49,
            qa: 14,
            ts: 3
        }, {
            id: ELayer.WOLF,
            radius: 50,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 14,
            ts: 0
        }, {
            id: ELayer.GOLDENCOW,
            radius: 90,
            maxHealth: 1e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 19
        }, {
            id: ELayer.ROOF,
            radius: 50,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.DRAGON,
            radius: 100,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.15,
            $a: 17,
            qa: 30,
            ts: 0
        }, {
            id: ELayer.MAMMOTH,
            radius: 90,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 30,
            ts: 1
        }, {
            id: ELayer.FIREBALL,
            radius: 100,
            maxHealth: 380,
            Qa: 1,
            Ja: .4,
            $a: 1,
            qa: 15,
            ts: 0
        }, {
            id: ELayer.CHEST,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1,
            Xa: 50,
            Lr: 20
        }, {
            id: ELayer.DRAGONWALLBIG,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLMEDIUM,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLSMALL,
            shoot: true,
            radius: 58,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.MAMMOTHWALL,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.MAMMOTHWALLSMALL,
            shoot: true,
            radius: 20,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.DUCK,
            radius: 20,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.TELEPORT,
            shoot: true,
            radius: 35,
            maxHealth: 150,
            Qa: 1
        }, {
            id: ELayer.CACTUS,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 5,
            qa: 20
        }, {
            id: ELayer.TORNADO,
            radius: 220,
            rotateSpeed: Math.PI / 4,
            Qa: 0,
            Na: 5,
            qa: 1
        } ];
        const LayerData = LayerDataArray;
        const LayerObjects = LayerData.filter((layer => layer.shoot));
        const Animals = LayerData.filter((layer => layer.animal));
        var EObjects;
        (function(EObjects) {
            EObjects[EObjects["BOOST"] = 6] = "BOOST";
            EObjects[EObjects["PLATFORM"] = 8] = "PLATFORM";
            EObjects[EObjects["TRAP"] = 9] = "TRAP";
            EObjects[EObjects["WINDMILL"] = 14] = "WINDMILL";
            EObjects[EObjects["SPAWN"] = 16] = "SPAWN";
            EObjects[EObjects["POWERMILL"] = 19] = "POWERMILL";
            EObjects[EObjects["ROOF"] = 48] = "ROOF";
        })(EObjects || (EObjects = {}));
        var PlacementType;
        (function(PlacementType) {
            PlacementType[PlacementType["DEFAULT"] = 0] = "DEFAULT";
            PlacementType[PlacementType["INVISIBLE"] = 1] = "INVISIBLE";
            PlacementType[PlacementType["HOLDING"] = 2] = "HOLDING";
            PlacementType[PlacementType["MACRO"] = 3] = "MACRO"
        })(PlacementType || (PlacementType = {}));
        var EServers;
        (function(EServers) {
            EServers["SAND_EU1"] = "SFRA";
            EServers["SAND_EU2"] = "SFRA2BIS";
            EServers["SAND_USA1"] = "SCA";
            EServers["SAND_USA2"] = "SCA2";
            EServers["SAND_AS1"] = "SGP";
            EServers["SAND_AS2"] = "SGP2";
            EServers["SAND_AS3"] = "SGP3BIS";
            EServers["NORM_EU1"] = "FRA1FFA";
            EServers["NORM_USA1"] = "CA1FFA";
            EServers["NORM_AS1"] = "SGP1FFA";
            EServers["BATTLE_USA1"] = "BRSCA";
        })(EServers || (EServers = {}));
        const selectData = {
            placementType: PlacementType,
            connectTo: EServers
        };
        var TargetReload;
        (function(TargetReload) {
            TargetReload[TargetReload["TURRET"] = 3e3] = "TURRET";
            TargetReload[TargetReload["HAT"] = 1300] = "HAT";
            TargetReload[TargetReload["DRAGON"] = 3e3] = "DRAGON";
        })(TargetReload || (TargetReload = {}));
        var Hit;
        (function(Hit) {
            Hit[Hit["CANNOT"] = 0] = "CANNOT";
            Hit[Hit["CAN"] = 1] = "CAN";
            Hit[Hit["NEEDDESTROY"] = 2] = "NEEDDESTROY";
        })(Hit || (Hit = {}));
        const Reload = {
            hat: {
                current: TargetReload.HAT,
                lerp: TargetReload.HAT,
                max: TargetReload.HAT,
                color: () => Settings.hatReloadBarColor
            },
            weapon: {
                current: 0,
                lerp: 0,
                max: 0,
                color: () => Settings.weaponReloadBarColor
            },
            turret: {
                current: TargetReload.TURRET,
                lerp: TargetReload.TURRET,
                max: TargetReload.TURRET,
                color: () => Settings.turretReloadBarColor
            },
            fireball: {
                current: TargetReload.DRAGON,
                lerp: TargetReload.DRAGON,
                max: TargetReload.DRAGON,
                color: () => Settings.fireballReloadBarColor
            }
        };
        class Storage {
            static get(key) {
                const item = localStorage.getItem(key);
                return item !== null ? JSON.parse(item) : null;
            }
            static set(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            }
            static delete(key) {
                const has = localStorage.hasOwnProperty(key) && key in localStorage;
                localStorage.removeItem(key);
                return has;
            }
        }
        const defaultSettings = {
            primary: "Digit1",
            secondary: "Digit2",
            heal: "KeyQ",
            wall: "Digit4",
            spike: "KeyV",
            bockquote: "Backquote",
            windmill: "KeyN",
            trap: "KeyF",
            turret: "KeyH",
            tree: "KeyU",
            platform: "KeyT",
            spawn: "KeyJ",
            up: "KeyW",
            left: "KeyA",
            down: "KeyS",
            right: "KeyD",
            autoattack: "KeyE",
            lockRotation: "KeyX",
            invisibleHit: 2,
            openChat: "Enter",
            upgradeScythe: "KeyL",
            unequip: "KeyI",
            bush: "KeyP",
            berserker: "KeyB",
            jungle: "...",
            crystal: "KeyC",
            spikegear: "KeyG",
            immunity: 4,
            boost: "ShiftLeft",
            applehat: "...",
            scuba: "...",
            hood: "Backquote",
            demolist: "KeyZ",
            placementType: PlacementType.INVISIBLE,
            placementSpeed: 1,
            autobed: false,
            automill: true,
            antiFireball: true,
            autoheal: true,
            jungleOnClown: false,
            lastHat: true,
            autoScuba: true,
            meleeAim: false,
            bowAim: true,
            spikeInstaAim: true,
            autosync: true,
            autoboostFollow: true,
            enemyTracers: true,
            teammateTracers: true,
            animalTracers: false,
            enemyColor: "#cc5151",
            teammateColor: "#8ecc51",
            animalColor: "#518ccc",
            arrows: true,
            rainbow: false,
            drawHP: true,
            showHoods: true,
            itemCounter: true,
            visualAim: true,
            hideMessages: false,
            customSkins: false,
            skin: Storage.get("skin") || 27,
            accessory: Storage.get("accessory") || 30,
            back: Storage.get("back") || 2,
            itemMarkers: true,
            teammateMarkers: true,
            enemyMarkers: true,
            trapActivated: true,
            itemMarkersColor: "#8ecc51",
            teammateMarkersColor: "#cfbc5f",
            enemyMarkersColor: "#cc5151",
            trapActivatedColor: "#48b2b8",
            hatReloadBar: true,
            hatReloadBarColor: "#5155cc",
            fireballReloadBar: true,
            fireballReloadBarColor: "#cf7148",
            turretReloadBar: true,
            turretReloadBarColor: "#51cc80",
            weaponReloadBar: true,
            weaponReloadBarColor: "#cc8251",
            smoothReloadBar: true,
            windmillRotation: false,
            possibleShots: true,
            autochat: true,
            autochatMessages: [ "Sploop Client", "What is it?", "The most advanced hack for Sploop.io!", "Download on greasyfork" ],
            kill: true,
            killMessage: "{NAME}, you suck! {KILL}x",
            autospawn: false,
            smoothZoom: true,
            skipUpgrades: true,
            invisHitToggle: false,
            reverseZoom: false,
            autoAccept: false,
            connectTo: "SFRA",
            menuTransparency: false,
            blindUsers: [ 0, 0, 0 ]
        };
        const settings = {
            primary: "Digit1",
            secondary: "Digit2",
            heal: "KeyQ",
            wall: "Digit4",
            spike: "KeyV",
            bockquote: "Backquote",
            windmill: "KeyN",
            trap: "KeyF",
            turret: "KeyH",
            tree: "KeyU",
            platform: "KeyT",
            spawn: "KeyJ",
            up: "KeyW",
            left: "KeyA",
            down: "KeyS",
            right: "KeyD",
            autoattack: "KeyE",
            lockRotation: "KeyX",
            openChat: "Enter",
            invisibleHit: 2,
            upgradeScythe: "KeyL",
            unequip: "KeyI",
            bush: "KeyP",
            berserker: "KeyB",
            jungle: "...",
            crystal: "KeyC",
            spikegear: "KeyG",
            immunity: 4,
            boost: "ShiftLeft",
            applehat: "...",
            scuba: "...",
            hood: "Backquote",
            demolist: "KeyZ",
            placementType: PlacementType.INVISIBLE,
            placementSpeed: 1,
            autobed: false,
            automill: true,
            antiFireball: false,
            autoheal: true,
            jungleOnClown: false,
            lastHat: false,
            autoScuba: false,
            meleeAim: false,
            bowAim: false,
            spikeInstaAim: false,
            autosync: false,
            autoboostFollow: false,
            enemyTracers: true,
            teammateTracers: true,
            animalTracers: false,
            enemyColor: "#cc5151",
            teammateColor: "#8ecc51",
            animalColor: "#518ccc",
            arrows: false,
            rainbow: false,
            drawHP: false,
            showHoods: false,
            itemCounter: false,
            visualAim: false,
            hideMessages: false,
            customSkins: false,
            skin: Storage.get("skin") || 27,
            accessory: Storage.get("accessory") || 30,
            back: Storage.get("back") || 2,
            itemMarkers: false,
            teammateMarkers: false,
            enemyMarkers: false,
            trapActivated: false,
            itemMarkersColor: "#8ecc51",
            teammateMarkersColor: "#cfbc5f",
            enemyMarkersColor: "#cc5151",
            trapActivatedColor: "#48b2b8",
            hatReloadBar: false,
            hatReloadBarColor: "#5155cc",
            fireballReloadBar: false,
            fireballReloadBarColor: "#cf7148",
            turretReloadBar: false,
            turretReloadBarColor: "#51cc80",
            weaponReloadBar: false,
            weaponReloadBarColor: "#cc8251",
            smoothReloadBar: false,
            windmillRotation: false,
            possibleShots: false,
            autochat: false,
            autochatMessages: [ "Sploop Client", "What is it?", "The most advanced hack for Sploop.io!", "Download on greasyfork" ],
            kill: false,
            killMessage: "{NAME}, you suck! {KILL}x",
            autospawn: false,
            smoothZoom: true,
            skipUpgrades: true,
            invisHitToggle: false,
            reverseZoom: false,
            autoAccept: false,
            connectTo: "SFRA",
            menuTransparency: false,
            blindUsers: [ 0, 0, 0 ]
            /*...defaultSettings,
            ...Storage.get("Sploop-settings")*/
        };
        for (const key in settings) {
            if (!defaultSettings.hasOwnProperty(key)) {
                delete settings[key];
            }
        }
        Storage.set("Sploop-settings", settings);
        const Settings = settings;
        class Formatter {
            static object(target) {
                const layer = LayerData[target.type];
                return {
                    id: target[Sploop.props.id],
                    type: target.type,
                    x: target[Sploop.props.x],
                    y: target[Sploop.props.y],
                    x1: target[Sploop.props.x1],
                    y1: target[Sploop.props.y1],
                    x2: target[Sploop.props.x2],
                    y2: target[Sploop.props.y2],
                    angle: target[Sploop.props.angle],
                    angle1: target[Sploop.props.angle1],
                    angle2: target[Sploop.props.angle2],
                    ownerID: target[Sploop.props.ownerID],
                    radius: layer.radius,
                    layerData: layer,
                    target
                };
            }
            static projectile(target) {
                const object = this.object(target);
                return {
                    ...object,
                    range: target.range,
                    projectileType: target[Sploop.props.projectileType]
                };
            }
            static entity(target) {
                const object = this.object(target);
                const healthValue = target[Sploop.props.health];
                const maxHealth = object.layerData.maxHealth || 1;
                return {
                    ...object,
                    healthValue,
                    health: Math.ceil(healthValue / 257 * maxHealth),
                    maxHealth,
                    entityValue: target[Sploop.props.entityValue]
                };
            }
            static player(target) {
                const entity = this.entity(target);
                return {
                    ...entity,
                    hat: target[Sploop.props.hat],
                    isClown: entity.entityValue === 128,
                    currentItem: target[Sploop.props.currentItem]
                };
            }
        }
        const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
        const removeClass = (target, name) => {
            if (target instanceof HTMLElement) {
                target.classList.remove(name);
                return;
            }
            for (const element of target) {
                element.classList.remove(name);
            }
        };
        const removeChildren = target => {
            while (target.firstChild) {
                target.removeChild(target.firstChild);
            }
        };
        const formatCode = code => {
            code = code + "";
            if (code === "0") return "LBTN";
            if (code === "1") return "MBTN";
            if (code === "2") return "RBTN";
            if (code === "3") return "XBTN2";
            if (code === "4") return "XBTN1";
            if (code === "Escape") return "ESC";
            if (code === "BracketLeft") return "[";
            if (code === "BracketRight") return "]";
            if (code === "NumpadDivide") return "NUMDIV";
            if (code === "NumpadMultiply") return "NUMMULT";
            if (code === "NumpadSubtract") return "NUMSUB";
            if (code === "NumpadDecimal") return "NUMDEC";
            if (code === "CapsLock") return "CAPS";
            if (code === "PrintScreen") return "PRNT";
            if (code === "Backslash") return "\\";
            if (code === "Backquote") return "BQUOTE";
            if (code === "PageDown") return "PAGEDN";
            const NumpadDigitArrowKey = /^(?:Numpad|Digit|Arrow|Key)(\w+)$/;
            if (NumpadDigitArrowKey.test(code)) {
                code = code.replace(NumpadDigitArrowKey, "$1").replace(/Numpad/, "NUM");
            }
            const ExtraKeysRegex = /^(Control|Shift|Alt)(.).*/;
            if (ExtraKeysRegex.test(code)) {
                code = code.replace(ExtraKeysRegex, "$2$1").replace(/Control/, "CTRL");
            }
            return code.toUpperCase();
        };
        const contains = (target, name) => target.classList.contains(name);
        const isInput = target => {
            const element = target || document.activeElement || document.body;
            return [ "TEXTAREA", "INPUT" ].includes(element.tagName);
        };
        const random = (min, max) => {
            const isInteger = Number.isInteger(min) && Number.isInteger(max);
            if (isInteger) return Math.floor(Math.random() * (max - min + 1) + min);
            return Math.random() * (max - min) + min;
        };
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const lerp = (start, stop, amt) => amt * (stop - start) + start;
        const sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));
        const GM = (property, value) => {
            if (!Sploop.PRODUCTION) return true;
            try {
                return GM_info.script[property] === value;
            } catch (err) {
                return false;
            }
        };
        const fromCharCode = codes => codes.map((code => String.fromCharCode(code))).join("");
        const isBlind = () => !Settings.blindUsers.every((a => a === 1));
        const angle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
        const formatAge = age => Math.floor(Math.log(1 + Math.max(0, age)) ** 2.4 / 13);
        const doWhile = (condition, callback, delay) => {
            if (!condition()) return;
            const interval = setInterval((() => {
                if (condition()) {
                    callback();
                } else {
                    clearInterval(interval);
                }
            }), delay);
        };
        const Common_define = (target, key, value) => {
            Object.defineProperty(target, key, {
                get: () => value,
                configurable: true
            });
        };
        const resetSkin = () => {
            const player = Sploop.myPlayer.target;
            if (!player) return;
            delete player[Sploop.props.skin];
            delete player[Sploop.props.accessory];
            delete player[Sploop.props.back];
        };
        const updateSkin = () => {
            if (!Settings.customSkins) return resetSkin();
            const player = Sploop.myPlayer.target;
            if (!player) return;
            Common_define(player, Sploop.props.skin, Settings.skin);
            Common_define(player, Sploop.props.accessory, Settings.accessory);
            Common_define(player, Sploop.props.back, Settings.back);
        };
        const Scale = {
            Default: {
                w: 1824,
                h: 1026
            },
            lerp: {
                w: 1824,
                h: 1026
            },
            current: {
                w: 1824,
                h: 1026
            }
        };
        const getMinScale = scale => {
            let w = Scale.Default.w;
            let h = Scale.Default.h;
            while (w > scale && h > scale) {
                w -= scale;
                h -= scale;
            }
            return {
                w,
                h
            };
        };
        const zoomHandler = () => {
            let wheels = 0;
            const scaleFactor = 150;
            window.addEventListener("wheel", (event => {
                if (!(event.target instanceof HTMLCanvasElement) || event.ctrlKey || event.shiftKey || event.altKey || isInput() || !controller.inGame) return;
                const {Default, current, lerp} = Scale;
                // if (current.w === Default.w && current.h === Default.h && (wheels = (wheels + 1) % 5) !== 0) return;
                const {w, h} = getMinScale(scaleFactor);
                const zoom = !Settings.reverseZoom && event.deltaY > 0 || Settings.reverseZoom && event.deltaY < 0 ? -scaleFactor : scaleFactor;
                current.w = Math.max(w, current.w + zoom);
                current.h = Math.max(h, current.h + zoom);
                if (Settings.smoothZoom) return;
                lerp.w = current.w;
                lerp.h = current.h;
                window.dispatchEvent(new Event("resize"));
            }));
        };
        const modules_zoomHandler = zoomHandler;
        let context;
        let _clearRect;
        const toggleHook = () => {
            delete context.clearRect;
            if (!Settings.smoothZoom) return;
            context.clearRect = new Proxy(_clearRect, {
                apply(target, _this, args) {
                    target.apply(_this, args);
                    if (controller.inGame && Settings.smoothZoom) {
                        Scale.lerp.w = lerp(Scale.lerp.w, Scale.current.w, .030);
                        Scale.lerp.h = lerp(Scale.lerp.h, Scale.current.h, .030);
                        window.dispatchEvent(new Event("resize"));
                    }
                }
            });
        };
        HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
            apply(target, _this, args) {
                const ctx = target.apply(_this, args);
                if (_this.id === "game-canvas") {
                    context = ctx;
                    _clearRect = ctx.clearRect;
                    toggleHook();
                    HTMLCanvasElement.prototype.getContext = target;
                }
                return ctx;
            }
        });
        const skins = {
            skin: [ [ "Sploop Classic", 0, 0 ], [ "Yellow Classic", 1, 0 ], [ "Brown Classic", 2, 0 ], [ "Pink Classic", 3, 0 ], [ "Blue Classic", 4, 0 ], [ "Green Classic", 5, 0 ], [ "White Cat", 6, 100 ], [ "Ginger Cat", 7, 100 ], [ "Pit Bull", 8, 150 ], [ "Pig", 9, 100 ], [ "Crocodile", 10, 200 ], [ "Fox", 11, 200 ], [ "Panda", 12, 300 ], [ "Bear", 13, 300 ], [ "Penguin", 14, 300 ], [ "Cactus", 15, 400 ], [ "Strawberry", 16, 800 ], [ "Wolf", 17, 400 ], [ "Mammoth", 18, 2e3 ], [ "Golden Cow", 19, 3e3 ], [ "Shark", 20, 1e3 ], [ "Apple", 21, 200 ], [ "Stone", 22, 500 ], [ "Cave Stone", 23, 600 ], [ "Ice", 24, 700 ], [ "Gold", 25, 800 ], [ "Cow", 26, 350 ], [ "Dragon", 27, 5e3 ], [ "Black Ice", 28, 1e3 ], [ "Magma", 29, 1500 ], [ "Kawak", 30, 2500 ], [ "Snowman", 31, 400 ], [ "Elf", 32, 1e3 ], [ "Green Bauble", 33, 300 ], [ "Red Bauble", 34, 300 ], [ "Golden Bauble", 35, 800 ], [ "Duck", 36, 300 ], [ "Tornado", 37, 3e3 ], [ "Golden Beetle", 38, 1500 ] ],
            accessory: [ [ "None", 0, 0 ], [ "Mustache", 1, 100 ], [ "Sun Glasses", 2, 500 ], [ "Yellow Cap", 3, 0 ], [ "Blue Cap", 4, 0 ], [ "Purple Cap", 5, 0 ], [ "Green Cap", 6, 0 ], [ "Pink Bow", 7, 0 ], [ "3D Glasses", 8, 300 ], [ "Scar", 9, 150 ], [ "Turban", 10, 250 ], [ "Bandage", 11, 250 ], [ "Crazy Glasses", 12, 150 ], [ "Cow's Snout", 13, 300 ], [ "Carrot", 14, 150 ], [ "Horn", 15, 1e3 ], [ "Tusk", 16, 800 ], [ "Mammoth Hair", 17, 600 ], [ "Mammoth Ears", 18, 500 ], [ "Leaf", 19, 150 ], [ "Black Mustache", 20, 500 ], [ "Snowman Hat", 21, 1e3 ], [ "Blue Beanie", 22, 200 ], [ "Green Beanie", 23, 200 ], [ "Purple Beanie", 24, 200 ], [ "Orange Beanie", 25, 200 ], [ "Yellow Scarf", 26, 250 ], [ "Red Scarf", 27, 350 ], [ "Green Scarf", 28, 300 ], [ "Red Nose", 29, 400 ], [ "Mask", 30, 1e3 ], [ "Garlands", 31, 500 ] ],
            back: [ [ "None", 0, 0 ], [ "Mammoth Tail", 1, 500 ], [ "Dragon Wings", 2, 5e3 ], [ "Swords", 3, 2e3 ], [ "Blue Cape", 4, 400 ], [ "Christmas Cape", 5, 400 ], [ "Speedy Cape", 6, 400 ], [ "Garland", 7, 300 ], [ "Baby Elf", 8, 1500 ], [ "Gift", 9, 1e3 ], [ "Yellow Bag", 10, 300 ] ]
        };
        const Skins = skins;
        const createImage = src => {
            const img = new Image;
            img.src = src;
            return img;
        };
        const getURL = (type, id) => `${location.origin}/img/ui/${type}${id}.png`;
        const Images = {
            gaugeBackground: createImage("https://i.imgur.com/xincrX4.png"),
            gaugeFront: createImage("https://i.imgur.com/6AkHQM4.png"),
            discord: createImage("https://i.imgur.com/RcTl09i.png"),
            github: createImage("https://i.imgur.com/q0z20jB.png"),
            greasyfork: createImage("https://i.imgur.com/y6OYX0D.png")
        };
        const utils_Images = Images;
        const createMenu = () => {
            const IFRAME_CONTENT = `\n        <style>${styles}</style>\n        <div id="menu-container" class="open">\n            <div id="menu-wrapper">\n                ${Header}\n\n                <main>\n                    ${Navbar}\n\n                    <div id="menu-page-container">\n                        ${Keybinds}\n                        ${Combat}\n                        ${Visuals}\n                        ${Misc}\n                        ${Credits}\n                    </div>\n                </main>\n            </div>\n        </div>\n    `;
            const IFRAME_STYLE = `\n        #iframe-page-container {\n            position: absolute;\n            top: 0;\n            left: 0;\n            bottom: 0;\n            right: 0;\n            width: 100%;\n            height: 100%;\n            margin: 0;\n            padding: 0;\n            z-index: 99;\n            border: none;\n            outline: none;\n            overflow: scroll;\n            display: none;\n        }\n\n        .iframe-opened {\n            display: block!important;\n        }\n\n        #main-content {\n            background: none;\n        }\n\n        #game-content {\n            justify-content: center;\n        }\n    `;
            const IFRAME = document.createElement("iframe");
            const blob = new Blob([ IFRAME_CONTENT ], {
                type: "text/html; charset=utf-8"
            });
            IFRAME.src = URL.createObjectURL(blob);
            IFRAME.id = "iframe-page-container";
            document.body.appendChild(IFRAME);
            const style = document.createElement("style");
            style.innerHTML = IFRAME_STYLE;
            document.head.appendChild(style);
            IFRAME.onload = () => {
                const iframeWindow = IFRAME.contentWindow;
                const iframeDocument = iframeWindow.document;
                URL.revokeObjectURL(IFRAME.src);
                const menuContainer = iframeDocument.getElementById("menu-container");
                const menuWrapper = iframeDocument.getElementById("menu-wrapper");
                const openMenu = iframeDocument.querySelectorAll(".open-menu");
                const menuPage = iframeDocument.querySelectorAll(".menu-page");
                const sections = iframeDocument.querySelectorAll(".section");
                const hotkeyInputs = iframeDocument.querySelectorAll(".section-option-hotkeyInput[id]");
                const closeMenu = iframeDocument.querySelector("#close-menu");
                const checkboxs = iframeDocument.querySelectorAll("input[type='checkbox'][id]");
                const sliders = iframeDocument.querySelectorAll("input[type='range'][id]");
                const headerVersion = iframeDocument.querySelector("#version > span");
                const autochatInputs = iframeDocument.querySelectorAll(".input.autochat");
                const killMessage = iframeDocument.querySelector("#killMessage");
                const resetSettings = iframeDocument.querySelector("#reset-settings");
                const downloadSettings = iframeDocument.querySelector("#download-settings");
                const uploadSettings = iframeDocument.querySelector("#upload-settings");
                const menuTransparency = iframeDocument.querySelector("#menuTransparency");
                const colorPickers = iframeDocument.querySelectorAll("input[type='color'][id]");
                const selects = iframeDocument.querySelectorAll("select[id]");
                const buttonPopups = iframeDocument.querySelectorAll("button[data-type='popup'][data-id]");
                let popupCount = 0;
                const popups = [ {
                    index: 0,
                    title: "YouTube",
                    description: "",
                    link: "https://www.youtube.com/channel/UCtCT9P2JcUoJlF3KCr5etjA",
                    prev: "https://i.imgur.com/agwC9na.png"
                }, {
                    index: 1,
                    title: "YouTube",
                    description: "!",
                    link: "https://www.youtube.com/channel/UCtCT9P2JcUoJlF3KCr5etjA",
                    prev: "https://i.imgur.com/agwC9na.png"
                }, {
                    index: 2,
                    title: "Instagram",
                    description: "Follow!",
                    link: "https://www.instagram.com/_ma_te_x_/",
                    prev: "https://i.imgur.com/7QFa9F6.png"
                } ];
                const pickPopup = () => {
                    const pups = popups.filter(((popup, index) => Settings.blindUsers[index] === 0));
                    if (pups.length) {
                        const popup = pups[popupCount++];
                        popupCount %= pups.length;
                        return popup;
                    }
                    return null;
                };
                const fadeOut = "transition: all 150ms ease 0s; transform: scale(0); opacity: 0;";
                let popupOpened = false;
                const createPopup = () => {
                    /*
                    if (popupOpened) return;
                    const popup = pickPopup();
                    if (!popup) return;
                    popupOpened = true;
                   // const div = document.createElement("div");
                    //div.innerHTML = `\n                <div id="popup-menu">\n                    <div id="popup-container">\n                        <div id="image-background" class="${popup.title.toLowerCase()}-bg"></div>\n\n                        <div id="popup-wrapper">\n                            <div id="popup-data">\n                                <div id="popup-title">${popup.title}</div>\n                                <div id="popup-description">${popup.description}</div>\n\n                                <div id="popup-bottom">\n                                    <a id="popup-continue" class="popup-button" href="${popup.link}" target="_blank">CONTINUE</a>\n                                    <button id="popup-close" class="popup-button">CLOSE</button>\n                                </div>\n                            </div>\n\n                            <div id="popup-prev">\n                                <img src="${popup.prev}"></img>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            `;
                    //const popupMenu = div.querySelector("#popup-menu");
                    //const container = div.querySelector("#popup-container");
                    //const continuePopup = div.querySelector("#popup-continue");
                    const closePopup = div.querySelector("#popup-close");
                    continuePopup.onclick = () => {
                        popupCount -= 1;
                        Settings.blindUsers[popup.index] = 1;
                        Storage.set("Sploop-settings", Settings);
                    };
                    closePopup.onclick = () => {
                        container.style.cssText = fadeOut;
                        setTimeout((() => {
                            popupMenu.remove();
                            popupOpened = false;
                        }), 150);
                    };
                    menuWrapper.appendChild(popupMenu);
                    */
                };
                const update = () => {
                    updateSkin();
                    for (const button of buttonPopups) {
                        const type = button.getAttribute("data-id");
                        const img = button.previousElementSibling;
                        if (img) {
                            img.src = getURL(type, Settings[type]);
                        }
                        button.onclick = () => {
                            const div = document.createElement("div");
                            div.innerHTML = `\n                        <div id="popup-menu">\n                            <div id="popup-container" style="height: 70%">\n                                <svg\n                                    id="close-popup"\n                                    class="icon"\n                                    xmlns="http://www.w3.org/2000/svg"\n                                    viewBox="0 0 30 30"\n                                    width="30px" height="30px"\n                                >\n                                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>\n                                </svg>\n                                <div id="popup-wrapper">\n                                    <div id="popup-content">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    `;
                            const popupMenu = div.querySelector("#popup-menu");
                            const container = div.querySelector("#popup-container");
                            const popupContent = div.querySelector("#popup-content");
                            const closePopup = div.querySelector("#close-popup");
                            const close = () => {
                                container.style.cssText = fadeOut;
                                setTimeout((() => {
                                    popupMenu.remove();
                                }), 150);
                            };
                            for (const skin of Skins[type]) {
                                const div = document.createElement("div");
                                const url = getURL(type, skin[1]);
                                div.innerHTML = `\n                            <div class="img-prev">\n                                <img src="${url}">\n                            </div>\n                        `;
                                const setURL = () => {
                                    if (!img) return;
                                    img.src = url;
                                    Settings[type] = skin[1];
                                    Storage.set("Sploop-settings", Settings);
                                    close();
                                    updateSkin();
                                };
                                const imgPrev = div.querySelector(".img-prev");
                                imgPrev.onclick = setURL;
                                closePopup.onclick = close;
                                popupContent.appendChild(imgPrev);
                            }
                            menuWrapper.appendChild(popupMenu);
                        };
                    }
                    for (const select of selects) {
                        removeChildren(select);
                        const data = selectData[select.id];
                        for (const key in data) {
                            if (!isNaN(Number(key))) continue;
                            const keyValue = key;
                            const option = document.createElement("option");
                            option.value = data[keyValue];
                            option.textContent = keyValue;
                            if (data[keyValue] === Settings[select.id]) {
                                option.selected = true;
                                option.defaultSelected = true;
                            }
                            select.appendChild(option);
                        }
                        select.onchange = () => {
                            const dataValue = /^\d+$/.test(String(select.value)) ? Number(select.value) : select.value;
                            Settings[select.id] = dataValue;
                            if (select.id === "placementType" && dataValue === PlacementType.DEFAULT) {
                                Settings.autoheal = false;
                                Settings.autoheal2 = false;
                                Settings.autoboostFollow = false;
                                update();
                            }
                            Storage.set("Sploop-settings", Settings);
                        };
                    }
                    for (const picker of colorPickers) {
                        const resetColor = picker.previousElementSibling;
                        if (resetColor) {
                            const defaultColor = defaultSettings[picker.id];
                            resetColor.style.backgroundColor = defaultColor;
                            resetColor.onclick = () => {
                                picker.value = defaultColor;
                                Settings[picker.id] = defaultColor;
                                Storage.set("Sploop-settings", Settings);
                            };
                        }
                        picker.value = Settings[picker.id];
                        picker.onchange = () => {
                            Settings[picker.id] = picker.value;
                            Storage.set("Sploop-settings", Settings);
                            picker.blur();
                        };
                    }
                    menuContainer.classList[Settings.menuTransparency ? "add" : "remove"]("transparent");
                    killMessage.value = Settings.killMessage;
                    killMessage.onchange = () => {
                        Settings.killMessage = killMessage.value;
                        Storage.set("Sploop-settings", Settings);
                        killMessage.blur();
                    };
                    for (let i = 0; i < autochatInputs.length; i++) {
                        const input = autochatInputs[i];
                        input.value = Settings.autochatMessages[i] || "";
                        input.onchange = () => {
                            Settings.autochatMessages[i] = input.value;
                            Storage.set("Sploop-settings", Settings);
                            input.blur();
                        };
                    }
                    headerVersion.textContent = "v" + Sploop.version;
                    for (const slider of sliders) {
                        const sliderValue = slider.nextElementSibling;
                        slider.value = Settings[slider.id];
                        if (sliderValue) {
                            sliderValue.textContent = slider.value;
                        }
                        slider.oninput = () => {
                            const value = Number(slider.value) % 1;
                            slider.value -= value;
                            if (sliderValue) {
                                sliderValue.textContent = slider.value;
                            }
                            Settings[slider.id] = Number(slider.value);
                            Storage.set("Sploop-settings", Settings);
                        };
                    }
                    for (const checkbox of checkboxs) {
                        checkbox.checked = Settings[checkbox.id];
                        checkbox.onchange = () => {
                            Settings[checkbox.id] = checkbox.checked;
                            if (checkbox.id === "smoothZoom") {
                                toggleHook();
                            } else if (checkbox.id === "customSkins") {
                                if (checkbox.checked) {
                                    updateSkin();
                                } else {
                                    resetSkin();
                                }
                            }
                            Storage.set("Sploop-settings", Settings);
                            checkbox.blur();
                        };
                    }
                    let popupCount = 0;
                    Sploop.toggleMenu = () => {
                        menuContainer.classList.toggle("close");
                        if (menuContainer.classList.toggle("open") && !popupOpened) {
                            popupCount += 1;
                            if ((popupCount %= 5) === 0) {
                                createPopup();
                            }
                        }
                        setTimeout((() => {
                            IFRAME.classList.toggle("iframe-opened");
                        }), 100);
                    };
                    closeMenu.onclick = Sploop.toggleMenu;
                    for (let i = 0; i < openMenu.length; i++) {
                        openMenu[i].onclick = () => {
                            removeClass(openMenu, "active");
                            openMenu[i].classList.add("active");
                            removeClass(menuPage, "opened");
                            menuPage[i].classList.add("opened");
                        };
                    }
                    for (const section of sections) {
                        const title = section.children[0];
                        const content = section.children[1];
                        if (!title || !content) continue;
                        if (contains(section, "opened")) {
                            content.classList.add("opened");
                            continue;
                        }
                        content.style.display = "none";
                        title.onclick = () => {
                            if (!content.classList.contains("opened")) {
                                content.style.display = "grid";
                            } else {
                                setTimeout((() => {
                                    content.style.display = "none";
                                }), 100);
                            }
                            setTimeout((() => {
                                content.classList.toggle("opened");
                                title.children[1].classList.toggle("rotate");
                            }), 0);
                        };
                    }
                    for (const hotkeyInput of hotkeyInputs) {
                        try {
                            hotkeyInput.textContent = formatCode(Settings[hotkeyInput.id]);
                        } catch (err) {
                            throw new Error(hotkeyInput.id + " doesn't exist in settings");
                        }
                    }
                    checkForRepeats();
                };
                menuTransparency.addEventListener("change", (() => {
                    menuContainer.classList[menuTransparency.checked ? "add" : "remove"]("transparent");
                }));
                resetSettings.onclick = () => {
                    Object.assign(Settings, defaultSettings);
                    Storage.set("Sploop-settings", Settings);
                    update();
                };
                downloadSettings.onclick = () => {
                    download(Settings, "SploopSettings" + Sploop.version);
                };
                uploadSettings.onchange = async event => {
                    const target = event.target;
                    const parent = uploadSettings.parentElement;
                    const spanText = parent.children[1];
                    parent.classList.remove("red");
                    parent.classList.remove("green");
                    try {
                        const text = await target.files[0].text();
                        const sets = JSON.parse(text);
                        if (Object.keys(sets).every((key => defaultSettings.hasOwnProperty(key)))) {
                            Object.assign(Settings, sets);
                            Storage.set("Sploop-settings", Settings);
                            update();
                            parent.classList.add("green");
                            spanText.innerHTML = `SETTINGS LOADED SUCCESSFULLY`;
                        } else {
                            throw new Error("Invalid settings");
                        }
                    } catch (err) {
                        parent.classList.add("red");
                        spanText.innerHTML = "SETTINGS ARE NOT VALID, TRY ANOTHER";
                    }
                };
                const checkForRepeats = () => {
                    const list = new Map;
                    for (const hotkeyInput of hotkeyInputs) {
                        const value = Settings[hotkeyInput.id];
                        const [count, inputs] = list.get(value) || [ 0, [] ];
                        list.set(value, [ (count || 0) + 1, [ ...inputs, hotkeyInput ] ]);
                        hotkeyInput.classList.remove("red");
                    }
                    for (const data of list) {
                        const [number, hotkeyInputs] = data[1];
                        if (number === 1) continue;
                        for (const hotkeyInput of hotkeyInputs) {
                            hotkeyInput.classList.add("red");
                        }
                    }
                };
                Sploop.active = null;
                const applyCode = code => {
                    if (!Sploop.active) return;
                    const key = code === "Backspace" ? "..." : formatCode(code);
                    Settings[Sploop.active.id] = code === "Backspace" ? "..." : code;
                    Sploop.active.textContent = key;
                    Storage.set("Sploop-settings", Settings);
                    Sploop.active = null;
                    checkForRepeats();
                };
                menuContainer.addEventListener("keyup", (event => {
                    if (event.keyCode < 5 || !Sploop.active) return;
                    applyCode(event.code);
                }));
                menuContainer.addEventListener("mouseup", (event => {
                    const target = event.target;
                    if (Sploop.active) return applyCode(event.button);
                    if (!contains(target, "section-option-hotkeyInput") || !target.id) return;
                    target.textContent = "Wait...";
                    Sploop.active = target;
                }));
                iframeWindow.addEventListener("keydown", (event => controller.handleKeydown(event, event.code)));
                iframeWindow.addEventListener("keyup", (event => controller.handleKeyup(event, event.code)));
                const resize = () => {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    const scale = Math.min(1, Math.min(width / 1024, height / 700));
                    menuContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
                };
                resize();
                window.addEventListener("resize", resize);
                setTimeout((() => IFRAME.classList.add("iframe-opened")), 0);
                iframeWindow.addEventListener("contextmenu", (event => event.preventDefault()));
                iframeWindow.addEventListener("mousedown", (event => 1 === event.button && event.preventDefault()));
                iframeWindow.addEventListener("mouseup", (event => [ 3, 4 ].includes(event.button) && event.preventDefault()));
                window.addEventListener("mouseup", (event => [ 3, 4 ].includes(event.button) && event.preventDefault()));
                update();
            };
        };
        const modules_createMenu = createMenu;
        var Hat;
        (function(Hat) {
            Hat[Hat["UNEQUIP"] = 0] = "UNEQUIP";
            Hat[Hat["BUSH"] = 1] = "BUSH";
            Hat[Hat["BERSERKER"] = 2] = "BERSERKER";
            Hat[Hat["JUNGLE"] = 3] = "JUNGLE";
            Hat[Hat["CRYSTAL"] = 4] = "CRYSTAL";
            Hat[Hat["SPIKEGEAR"] = 5] = "SPIKEGEAR";
            Hat[Hat["IMMUNITY"] = 6] = "IMMUNITY";
            Hat[Hat["BOOST"] = 7] = "BOOST";
            Hat[Hat["APPLEHAT"] = 8] = "APPLEHAT";
            Hat[Hat["SCUBA"] = 9] = "SCUBA";
            Hat[Hat["HOOD"] = 10] = "HOOD";
            Hat[Hat["DEMOLIST"] = 11] = "DEMOLIST";
        })(Hat || (Hat = {}));
        const Hats = [ {
            bought: true,
            equipped: true,
            default: true,
            price: 0
        }, {
            image: 109,
            price: 250,
            axisY: 0,
            description: "Become a bush",
            name: "Bush Hat",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 41,
            price: 5e3,
            description: "Increased melee damage",
            axisY: 10,
            cs: 1.25,
            speed: .85,
            name: "Berserker Gear",
            bought: false,
            equipped: false
        }, {
            image: 44,
            price: 3e3,
            description: "Regenerate health",
            axisY: 13,
            hs: 25,
            name: "Jungle Gear",
            bought: false,
            equipped: false
        }, {
            image: 45,
            price: 5e3,
            description: "Receive reduced damage",
            axisY: 10,
            reduceDmg: .75,
            speed: .95,
            name: "Crystal Gear",
            bought: false,
            equipped: false
        }, {
            image: 48,
            price: 1e3,
            description: "Attacker's receive damage",
            axisY: 10,
            reflect: .45,
            name: "Spike Gear",
            bought: false,
            equipped: false
        }, {
            image: 49,
            price: 4e3,
            description: "Gain more health",
            axisY: 15,
            ls: 150,
            reduceDmg: .75,
            name: "Immunity Gear",
            bought: false,
            equipped: false
        }, {
            image: 50,
            price: 1500,
            description: "Move quicker",
            axisY: 23,
            speed: 1.23,
            name: "Boost Hat",
            bought: false,
            equipped: false
        }, {
            image: 93,
            price: 150,
            description: "Apples become more succulent",
            axisY: 5,
            speed: 1.05,
            name: "Apple hat",
            bought: false,
            equipped: false
        }, {
            image: 121,
            price: 4e3,
            description: "Move fast in ocean",
            axisY: 5,
            speed: .75,
            river: 1.5,
            name: "Scuba Gear",
            bought: false,
            equipped: false
        }, {
            image: 126,
            price: 3500,
            description: "Become invisible when still",
            axisY: 5,
            name: "Hood",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 197,
            price: 4e3,
            description: "Destroy buildings faster",
            axisY: 10,
            name: "Demolist",
            bought: false,
            equipped: false,
            speed: .3
        } ];
        var EWeapons;
        (function(EWeapons) {
            EWeapons[EWeapons["TOOL_HAMMER"] = 0] = "TOOL_HAMMER";
            EWeapons[EWeapons["STONE_SWORD"] = 1] = "STONE_SWORD";
            EWeapons[EWeapons["STONE_SPEAR"] = 2] = "STONE_SPEAR";
            EWeapons[EWeapons["STONE_AXE"] = 3] = "STONE_AXE";
            EWeapons[EWeapons["MUSKET"] = 4] = "MUSKET";
            EWeapons[EWeapons["SHIELD"] = 11] = "SHIELD";
            EWeapons[EWeapons["STICK"] = 13] = "STICK";
            EWeapons[EWeapons["HAMMER"] = 15] = "HAMMER";
            EWeapons[EWeapons["KATANA"] = 17] = "KATANA";
            EWeapons[EWeapons["BOW"] = 26] = "BOW";
            EWeapons[EWeapons["XBOW"] = 27] = "XBOW";
            EWeapons[EWeapons["NAGINATA"] = 28] = "NAGINATA";
            EWeapons[EWeapons["GREAT_AXE"] = 30] = "GREAT_AXE";
            EWeapons[EWeapons["BAT"] = 31] = "BAT";
            EWeapons[EWeapons["PEARL"] = 50] = "PEARL";
            EWeapons[EWeapons["SCYTHE"] = 57] = "SCYTHE";
        })(EWeapons || (EWeapons = {}));
        var ActionType;
        (function(ActionType) {
            ActionType[ActionType["MELEE"] = 0] = "MELEE";
            ActionType[ActionType["RANGED"] = 1] = "RANGED";
            ActionType[ActionType["PLACEABLE"] = 2] = "PLACEABLE";
            ActionType[ActionType["EATABLE"] = 3] = "EATABLE";
        })(ActionType || (ActionType = {}));
        var ItemType;
        (function(ItemType) {
            ItemType[ItemType["PRIMARY"] = 0] = "PRIMARY";
            ItemType[ItemType["SECONDARY"] = 1] = "SECONDARY";
            ItemType[ItemType["FOOD"] = 2] = "FOOD";
            ItemType[ItemType["WALL"] = 3] = "WALL";
            ItemType[ItemType["SPIKE"] = 4] = "SPIKE";
            ItemType[ItemType["WINDMILL"] = 5] = "WINDMILL";
            ItemType[ItemType["FARM"] = 6] = "FARM";
            ItemType[ItemType["TRAP"] = 7] = "TRAP";
            ItemType[ItemType["PLATFORM"] = 8] = "PLATFORM";
            ItemType[ItemType["SPAWN"] = 9] = "SPAWN";
            ItemType[ItemType["TURRET"] = 10] = "TURRET";
        })(ItemType || (ItemType = {}));
        var upgradeType;
        (function(upgradeType) {
            upgradeType[upgradeType["STONE"] = 1] = "STONE";
            upgradeType[upgradeType["GOLD"] = 2] = "GOLD";
            upgradeType[upgradeType["DIAMOND"] = 3] = "DIAMOND";
            upgradeType[upgradeType["RUBY"] = 4] = "RUBY";
        })(upgradeType || (upgradeType = {}));
        const ItemData = [ {
            id: EWeapons.TOOL_HAMMER,
            gs: 46,
            upgradeType: upgradeType.STONE,
            imageinv: 29,
            image: 25,
            name: "Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 25,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: EWeapons.STONE_SWORD,
            ks: 1,
            ys: 2,
            imageinv: 28,
            image: 24,
            name: "Stone Sword",
            description: "Sharp and pointy",
            range: 135,
            Ms: 250,
            itemType: ItemType.PRIMARY,
            damage: 35,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -8,
            os: -4
        }, {
            id: EWeapons.STONE_SPEAR,
            gs: 39,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 4,
            imageinv: 31,
            image: 26,
            name: "Stone Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 49,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: EWeapons.STONE_AXE,
            gs: 33,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 128,
            imageinv: 32,
            image: 35,
            name: "Stone Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 30,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: EWeapons.MUSKET,
            cost: {
                food: 0,
                wood: 0,
                stone: 10,
                gold: 0
            },
            ks: 16,
            xs: 2,
            ys: 8,
            imageinv: 30,
            image: 27,
            name: "Stone Musket",
            description: "Deal Long Range Damage",
            range: 1e3,
            itemType: ItemType.SECONDARY,
            damage: 49,
            reload: 1500,
            projectile: 17,
            Ls: 1500,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .63,
            As: 0,
            os: 0
        }, {
            id: 5,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            imageinv: 33,
            image: 103,
            name: "Wood Wall",
            description: "A sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.WOODWALL,
            ps: 2
        }, {
            id: 6,
            cost: {
                food: 0,
                wood: 5,
                stone: 20,
                gold: 0
            },
            ks: 1,
            ys: 512,
            imageinv: 36,
            image: 106,
            name: "Boost",
            description: "Provides a thrust",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: -5,
            As: 0,
            os: 3,
            layer: ELayer.BOOST,
            ps: 2
        }, {
            id: 7,
            cost: {
                food: 0,
                wood: 20,
                stone: 5,
                gold: 0
            },
            imageinv: 37,
            image: 104,
            name: "Spike",
            description: "Sharp defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.SPIKE,
            ps: 2
        }, {
            id: 8,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 38,
            image: 114,
            name: "Platform",
            description: "Shoot over structures",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: -2,
            As: 0,
            os: 8,
            layer: ELayer.PLATFORM,
            ps: 2
        }, {
            id: 9,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 1,
            ys: 1024,
            imageinv: 39,
            image: 107,
            name: "Trap",
            description: "Snared enemies are stuck",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 26,
            layer: ELayer.TRAP,
            ps: 2
        }, {
            id: 10,
            cost: {
                food: 10,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 43,
            image: 42,
            name: "Apple",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 20,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.SHIELD,
            ks: 1,
            ys: 256,
            imageinv: 47,
            image: 46,
            name: "Shield",
            description: "Reduces damage",
            itemType: ItemType.SECONDARY,
            actionType: ActionType.MELEE,
            Us: .7,
            shieldAngle: .75,
            range: 55,
            Ms: 350,
            damage: 15,
            _s: 40,
            reload: 500,
            As: -15,
            os: 10,
            ps: 3
        }, {
            id: 12,
            cost: {
                food: 15,
                wood: 0,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 64,
            imageinv: 52,
            image: 51,
            name: "Cookie",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 35,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.STICK,
            gs: 41,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 32,
            imageinv: 55,
            image: 54,
            name: "Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 7,
            Cs: 7,
            Bs: 7,
            zs: 4
        }, {
            id: 14,
            cost: {
                food: 0,
                wood: 50,
                stone: 10,
                gold: 0
            },
            imageinv: 57,
            image: 61,
            name: "Windmill",
            description: "Generates score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 4,
            Hs: -5,
            As: 0,
            os: 38,
            layer: ELayer.WINDMILL,
            ps: 2
        }, {
            id: EWeapons.HAMMER,
            ks: 1,
            ys: 1,
            imageinv: 63,
            image: 62,
            name: "Hammer",
            description: "Breaks structures faster",
            range: 80,
            itemType: ItemType.SECONDARY,
            damage: 12,
            _s: 76,
            Us: .89,
            Ms: 200,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 5,
            os: 2
        }, {
            id: 16,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 200,
                gold: 200
            },
            imageinv: 65,
            image: 115,
            name: "Cosy Bed",
            description: "Respawn at the bed",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 25,
            layer: ELayer.SPAWN,
            ps: 2
        }, {
            id: EWeapons.KATANA,
            gs: 37,
            upgradeType: upgradeType.STONE,
            ks: 2,
            ys: 2,
            imageinv: 68,
            image: 67,
            name: "Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 40,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 18,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 160,
            ys: 1,
            imageinv: 69,
            image: 113,
            name: "Castle Spike",
            description: "Great for bases",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            damage: {
                hit: 24,
                touch: 5
            },
            Hs: -8,
            As: 0,
            os: 14,
            layer: ELayer.CASTLESPIKE,
            ps: 2
        }, {
            id: 19,
            cost: {
                food: 0,
                wood: 100,
                stone: 50,
                gold: 0
            },
            ks: 1,
            ys: 1,
            imageinv: 57,
            image: 61,
            name: "Powermill",
            description: "Generates more score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 2,
            Hs: 5,
            As: 0,
            os: 38,
            layer: ELayer.POWERMILL,
            ps: 2
        }, {
            id: 20,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 30,
                stone: 10,
                gold: 0
            },
            imageinv: 73,
            image: 112,
            name: "Hard Spike",
            description: "Sharper defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.HARDSPIKE,
            ps: 2
        }, {
            id: 21,
            cost: {
                food: 0,
                wood: 200,
                stone: 150,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 77,
            image: 74,
            name: "Turret",
            description: "Defence for your base",
            itemType: ItemType.TURRET,
            actionType: ActionType.PLACEABLE,
            Hs: 6,
            As: 0,
            os: 25,
            layer: ELayer.TURRET,
            ps: 2
        }, {
            id: 22,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 78,
            image: 110,
            name: "Cherry wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.CHERRYWOODFARM,
            ps: 2
        }, {
            id: 23,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 80,
            image: 111,
            name: "Wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.WOODFARM,
            ps: 2
        }, {
            id: 24,
            ks: 1,
            ys: 1,
            cost: {
                food: 200,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 85,
            image: 109,
            name: "Berry farm",
            description: "Used for decoration and berries",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 17,
            layer: ELayer.BUSH,
            ps: 2
        }, {
            id: 25,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 0,
                stone: 200,
                gold: 0
            },
            imageinv: 83,
            image: 108,
            name: "Stone farm",
            description: "Used for decoration and stone",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 20,
            layer: ELayer.STONEWARM,
            ps: 2
        }, {
            id: EWeapons.BOW,
            cost: {
                food: 0,
                wood: 4,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 16,
            imageinv: 86,
            image: 87,
            name: "Bow",
            description: "Deal Long Range Damage",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 25,
            reload: 600,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .75,
            As: 0,
            os: 35
        }, {
            id: EWeapons.XBOW,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            ks: 16,
            ys: 176,
            imageinv: 90,
            image: 91,
            name: "XBow",
            description: "Rapid fire bow",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 27,
            reload: 235,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .35,
            As: 0,
            os: 30
        }, {
            id: EWeapons.NAGINATA,
            gs: 45,
            upgradeType: upgradeType.STONE,
            ks: 4,
            ys: 4,
            imageinv: 100,
            image: 99,
            name: "Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 52,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 29,
            cost: {
                food: 0,
                wood: 0,
                stone: 35,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 101,
            image: 105,
            name: "Castle Wall",
            description: "A very sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 13,
            layer: ELayer.CASTLEWALL,
            ps: 2
        }, {
            id: EWeapons.GREAT_AXE,
            gs: 35,
            upgradeType: upgradeType.STONE,
            ks: 128,
            ys: 128,
            imageinv: 117,
            image: 116,
            name: "Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 37,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: EWeapons.BAT,
            ks: 1,
            ys: 2048,
            imageinv: 128,
            image: 127,
            name: "Bat",
            description: "Hit enemies for a home run",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 870,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 2
        }, {
            id: 32,
            ks: 1,
            ys: 128,
            imageinv: 131,
            image: 130,
            name: "Diamond Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 35.5,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 33,
            gs: 32,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 128,
            imageinv: 133,
            image: 132,
            name: "Gold Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 33,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 34,
            ks: 128,
            ys: 128,
            imageinv: 135,
            image: 134,
            name: "Diamond Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 47,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 35,
            gs: 34,
            upgradeType: upgradeType.GOLD,
            ks: 128,
            ys: 128,
            imageinv: 145,
            image: 144,
            name: "Gold Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 40,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 36,
            gs: 40,
            upgradeType: upgradeType.DIAMOND,
            ks: 2,
            ys: 2,
            imageinv: 137,
            image: 136,
            name: "Diamond Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 46.5,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 37,
            gs: 36,
            upgradeType: upgradeType.GOLD,
            ks: 2,
            ys: 2,
            imageinv: 139,
            image: 138,
            name: "Gold Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 43,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 38,
            ks: 1,
            ys: 4,
            imageinv: 141,
            image: 140,
            name: "Diamond Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 53,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 39,
            gs: 38,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 4,
            imageinv: 143,
            image: 142,
            name: "Gold Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 51,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 40,
            ks: 2,
            ys: 2,
            imageinv: 147,
            image: 148,
            name: "Chillrend",
            description: "A powerful force flows through this blade.",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 48.5,
            reload: 300,
            Us: .9,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 41,
            gs: 42,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 32,
            imageinv: 150,
            image: 149,
            name: "Gold Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 8,
            Cs: 8,
            Bs: 8,
            zs: 5
        }, {
            id: 42,
            gs: 43,
            upgradeType: upgradeType.DIAMOND,
            ks: 1,
            ys: 32,
            imageinv: 167,
            image: 151,
            name: "Diamond Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 9,
            Cs: 9,
            Bs: 9,
            zs: 6
        }, {
            upgradeType: upgradeType.RUBY,
            id: 43,
            ks: 1,
            ys: 32,
            imageinv: 168,
            image: 152,
            name: "Ruby Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 10,
            Cs: 10,
            Bs: 10,
            zs: 7
        }, {
            id: 44,
            ks: 4,
            ys: 4,
            imageinv: 154,
            image: 153,
            name: "Diamond Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 56,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 45,
            gs: 44,
            upgradeType: upgradeType.GOLD,
            ks: 4,
            ys: 4,
            imageinv: 156,
            image: 155,
            name: "Gold Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 54,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 46,
            gs: 47,
            upgradeType: upgradeType.GOLD,
            imageinv: 158,
            image: 157,
            name: "Gold Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 32,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 47,
            gs: 48,
            upgradeType: upgradeType.DIAMOND,
            imageinv: 160,
            image: 159,
            name: "Diamond Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 38,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            upgradeType: upgradeType.RUBY,
            id: 48,
            imageinv: 162,
            image: 161,
            name: "Ruby Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 41,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 49,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 170,
            image: 169,
            name: "Roof",
            description: "Take cover from projectiles",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: 0,
            As: 0,
            os: 15,
            layer: ELayer.ROOF,
            ps: 2
        }, {
            id: 50,
            cost: {
                food: 80,
                wood: 80,
                stone: 80,
                gold: 80
            },
            ks: 1,
            ys: 256,
            imageinv: 182,
            image: 182,
            name: "Pearl",
            description: "Teleport on impact",
            range: 700,
            itemType: ItemType.SECONDARY,
            damage: 10,
            reload: 1e4,
            projectile: 182,
            Ls: 1e3,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .4,
            As: 0,
            os: 35
        }, {
            id: 51,
            cost: {
                food: 0,
                wood: 50,
                stone: 50,
                gold: 0
            },
            ks: 2208,
            ys: 1,
            imageinv: 183,
            image: 183,
            name: "Teleporter",
            description: "Teleports to location on map",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.TELEPORT,
            ps: 2
        }, {
            gs: 53,
            upgradeType: upgradeType.STONE,
            id: 52,
            ks: 1,
            ys: 4096,
            imageinv: 189,
            image: 193,
            name: "Stone Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 22,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 54,
            upgradeType: upgradeType.GOLD,
            id: 53,
            ks: 1,
            ys: 4096,
            imageinv: 190,
            image: 194,
            name: "Gold Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 24,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 55,
            upgradeType: upgradeType.DIAMOND,
            id: 54,
            ks: 1,
            ys: 4096,
            imageinv: 191,
            image: 195,
            name: "Diamond Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 26,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            upgradeType: upgradeType.RUBY,
            id: 55,
            ks: 1,
            ys: 4096,
            imageinv: 192,
            image: 196,
            name: "Ruby Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 29,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            id: 56,
            gs: 57,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 1,
            imageinv: 198,
            image: 198,
            name: "Secret Item",
            description: "Dont leak how to get it :)",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 1570,
            reload: 2e3,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 40,
            os: 40
        }, {
            id: 57,
            ks: 2,
            ys: 2,
            imageinv: 199,
            image: 199,
            name: "Daedric Scythe",
            description: "Whispers fill the air",
            range: 160,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 52,
            reload: 450,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -5,
            os: 20
        } ];
        const Items = ItemData;
        const ItemList = Items.filter((item => item.actionType === ActionType.PLACEABLE));
        const Shooting = Items.filter((item => item.actionType === ActionType.RANGED));
        class Vector {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            static fromAngle(angle) {
                return new Vector(Math.cos(angle), Math.sin(angle));
            }
            add(vec) {
                this.x += vec.x;
                this.y += vec.y;
                return this;
            }
            sub(vec) {
                this.x -= vec.x;
                this.y -= vec.y;
                return this;
            }
            mult(scalar) {
                this.x *= scalar;
                this.y *= scalar;
                return this;
            }
            div(scalar) {
                this.x /= scalar;
                this.y /= scalar;
                return this;
            }
            get length() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
            normalize() {
                return this.length > 0 ? this.div(this.length) : this;
            }
            setLength(value) {
                return this.normalize().mult(value);
            }
            copy() {
                return new Vector(this.x, this.y);
            }
            distance(vec) {
                return this.copy().sub(vec).length;
            }
            angle(vec) {
                const copy = vec.copy().sub(this);
                return Math.atan2(copy.y, copy.x);
            }
            dot(vec) {
                return this.x * vec.x + this.y * vec.y;
            }
            direction(angle, scalar) {
                return this.copy().add(Vector.fromAngle(angle).mult(scalar));
            }
        }
        const getAngleDist = (a, b) => {
            const p = Math.abs(b - a) % (Math.PI * 2);
            return p > Math.PI ? Math.PI * 2 - p : p;
        };
        class EntityManager {
            static isPlayer(entity) {
                return entity.type === ELayer.PLAYER;
            }
            static animals() {
                const layers = Sploop.saves.entityList();
                const animals = [];
                for (let i = 0; i < Animals.length; i++) {
                    const layer = layers[Animals[i].id];
                    const formatted = layer.map((target => Formatter.entity(target)));
                    animals.push(...formatted);
                }
                return animals;
            }
            static enemies() {
                const players = Sploop.saves.entityList()[ELayer.PLAYER];
                const enemies = [];
                for (let i = 0; i < players.length; i++) {
                    const player = Formatter.player(players[i]);
                    if (controller.isEnemy(player)) enemies.push(player);
                }
                return enemies.sort(((a, b) => this.sortDistance(a, b)));
            }
            static distance(a, b) {
                return new Vector(a.x2, a.y2).distance(new Vector(b.x2, b.y2));
            }
            static angle(a, b) {
                return new Vector(a.x2, a.y2).angle(new Vector(b.x2, b.y2));
            }
            static sortDistance(a, b, sorted) {
                const target = sorted || Sploop.myPlayer;
                return this.distance(a, target) - this.distance(b, target);
            }
            static shield(a, b, sorted) {
                const target = sorted || Sploop.myPlayer;
                const shieldA = this.lookingAt(a, target, 1.58927) && a.currentItem === EWeapons.SHIELD;
                const shieldB = this.lookingAt(b, target, 1.58927) && b.currentItem === EWeapons.SHIELD;
                return shieldA ? 1 : shieldB ? -1 : 0;
            }
            static canHitEntity(a, b, sorted) {
                const target = sorted || Sploop.myPlayer;
                const hitA = this.projectileCanHitEntity(a, target);
                const hitB = this.projectileCanHitEntity(b, target);
                return hitA === Hit.NEEDDESTROY ? 1 : hitB === Hit.NEEDDESTROY ? -1 : 0;
            }
            static lookingAt(entity, point, angle) {
                const pos1 = new Vector(entity.x2, entity.y2);
                const pos2 = new Vector(point.x2, point.y2);
                const dir = getAngleDist(pos1.angle(pos2) + Math.PI, entity.angle2);
                return dir > angle;
            }
            static entities(sorted) {
                return [ ...this.enemies().sort(((a, b) => this.sortDistance(a, b, sorted))).sort(((a, b) => this.shield(a, b, sorted))), ...this.animals().sort(((a, b) => this.sortDistance(a, b, sorted))) ];
            }
            static predict(entity) {
                const pos1 = new Vector(entity.x1, entity.y1);
                const pos2 = new Vector(entity.x2, entity.y2);
                const distance = pos1.distance(pos2) * (entity === Sploop.myPlayer ? 1 : 2.2);
                const direction = Vector.fromAngle(pos1.angle(pos2));
                return pos2.add(direction.mult(distance));
            }
            static entityIn(entity, layer, extraRadius = 0) {
                const targets = Sploop.saves.entityList()[layer];
                return targets.some((target => {
                    const object = Formatter.object(target);
                    const radius = entity.radius + object.radius + extraRadius;
                    return this.distance(entity, object) <= radius;
                }));
            }
            static intersects(pos1, pos2, pos3, r) {
                const linear = pos2.copy().sub(pos1);
                const constant = pos1.copy().sub(pos3);
                const a = linear.dot(linear);
                const b = linear.dot(constant);
                const c = constant.dot(constant) - r * r;
                return b * b >= a * c && (-b <= a || c + b + b + a <= 0) && (b <= 0 || c <= 0);
            }
            static projectileCanHitEntity(entity, sorted) {
                const target = sorted || Sploop.myPlayer;
                if (!controller.canShoot()) return Hit.CANNOT;
                const pos1 = new Vector(target.x2, target.y2);
                const pos2 = new Vector(entity.x2, entity.y2);
                const myPlayerOnPlatform = this.entityIn(target, ELayer.PLATFORM);
                const entityInRoof = this.entityIn(entity, ELayer.ROOF);
                if (myPlayerOnPlatform && entityInRoof) return Hit.CANNOT;
                const layers = Sploop.saves.entityList();
                for (const layer of LayerObjects) {
                    if (myPlayerOnPlatform && !layer.cannotShoot) continue;
                    for (const target of layers[layer.id]) {
                        const object = Formatter.object(target);
                        const pos3 = new Vector(object.x2, object.y2);
                        if (pos1.distance(pos3) > pos1.distance(pos2)) continue;
                        if (this.intersects(pos1, pos2, pos3, object.radius)) {
                            if (object.layerData.maxHealth === undefined) return Hit.CANNOT;
                            return Hit.NEEDDESTROY;
                        }
                    }
                }
                return Hit.CAN;
            }
            static inWeaponRange(entity1, entity2, weapon) {
                const range = Items[weapon].range || 10;
                return this.distance(entity1, entity2) <= range + entity2.radius;
            }
            static nearestPossible(weapon, sorted) {
                const target = sorted || Sploop.myPlayer;
                const item = Items[weapon];
                const shoot = controller.canShoot() && item.actionType === ActionType.RANGED;
                const entities = this.entities().filter((entity => shoot ? this.projectileCanHitEntity(entity, target) : this.inWeaponRange(target, entity, weapon)));
                if (shoot) {
                    entities.sort(((a, b) => this.canHitEntity(a, b, target)));
                }
                return entities.length ? entities[0] : null;
            }
            static nearestLayer(entity, layer) {
                const objects = Sploop.saves.entityList()[layer].map((target => Formatter.object(target)));
                return objects.sort(((a, b) => this.sortDistance(a, b, entity)))[0];
            }
        }
        const attackAnimation = () => {
            if (!Settings.weaponReloadBar && !Settings.autosync) return;
            const b = Sploop.saves.buffer;
            const len = Sploop.saves.byteLength;
            const players = Sploop.saves.players();
            for (let i = 1; i < len; i += 5) {
                const type = b[i];
                const id = b[i + 1] | b[i + 2] << 8;
                const weapon = b[i + 3];
                const isObject = b[i + 4];
                const target = players.get(id);
                if (type === ELayer.PLAYER && target) {
                    if (Settings.weaponReloadBar) {
                        const reload = target.weaponReload;
                        reload.current = -Sploop.step;
                        reload.lerp = 0;
                        reload.max = Items[weapon].reload || 0;
                    }
                    if (Settings.autosync && controller.canAutosync()) {
                        const player = Formatter.player(target);
                        if (controller.isTeammate(player) && controller.isPrimary(weapon)) {
                            const nearest = EntityManager.nearestPossible(weapon, player);
                            if (nearest !== null && EntityManager.inWeaponRange(Sploop.myPlayer, nearest, controller.itemBar[0])) {
                                const previousWeapon = controller.weapon;
                                controller.whichWeapon(false);
                                controller.attack(EntityManager.angle(Sploop.myPlayer, nearest));
                                controller.PacketManager.stopAttack();
                                controller.whichWeapon(previousWeapon);

                            }
                        }
                    }
                }
            }
        };
        const hooks_attackAnimation = attackAnimation;
        window.teammates = [];
        const createClan = () => {
            const b = window.Sploop.saves.buffer2();
            const len = window.Sploop.saves.byteLength2();
            teammates = [...b.slice(3, len)];
        };
        const updateClan = () => {
            const b = window.Sploop.saves.buffer2();
            const len = window.Sploop.saves.byteLength2();
            teammates = [...b.slice(2, len)];
        };
        const deleteClan = () => {
            teammates = [];
        };

        window.WebSocket = new Proxy(window.WebSocket, {
            construct(target, args) {
                const ws = new target(...args);
                ws.addEventListener("message", (event => {
                    const data = event.data;
                    if (typeof data === "string" && /^\[.+\]$/.test(data)) {
                        //
                    } else {
                        switch (window.Sploop.saves.buffer2()[0]) {
                            case 27:
                                deleteClan();
                                break;

                            case 24:
                                createClan();
                                break;

                            case 16:
                                updateClan();
                                break;
                        }
                    }
                }));
                return ws;
            }
        });
        const playerStats = () => {
            const b = window.Sploop.saves.buffer2()
            const age = formatAge(b[1] | b[2] << 8 | b[3] << 16 | b[4] << 24);
            const food = b[5] | b[6] << 8 | b[7] << 16 | b[8] << 24;
            const wood = b[9] | b[10] << 8 | b[11] << 16 | b[12] << 24;
            const stone = b[13] | b[14] << 8 | b[15] << 16 | b[16] << 24;
            const gold = b[17] | b[18] << 8 | b[19] << 16 | b[20] << 24;
            if (age !== 0) {
                controller.age = age;
            }
            controller.resources = {
                food,
                wood,
                stone,
                gold
            };
        };
        const hooks_playerStats = playerStats;
        const stringMessage = data => {
            const id = data[0];
            if (id === 35) {
                controller.myPlayerID = data[1];
                controller.reset(data[4]);
                controller.inGame = true;
                controller.automillSpawn = true;
                if (Settings.lastHat) {
                    const hat = controller.toggleJungle || controller.toggleScuba ? controller.previousHat : controller.actualHat;
                    window.equip(hat, true, true);
                }
            }
            if (id === WebsocketServer.UPGRADE) {
                const bar = data[1];
                const canAutobed = Settings.autobed && bar.includes(EObjects.SPAWN);
                controller.autobed = canAutobed;
                if (Settings.skipUpgrades && bar.length === 1 || canAutobed) {
                    controller.PacketManager.upgrade(canAutobed ? EObjects.SPAWN : bar[0]);
                }
            }
            if (id === WebsocketServer.DIED) {
                controller.myPlayerID = 0;
                controller.inGame = false;
                if (Settings.autospawn) {
                    controller.spawn();
                }
            }
            if (id === WebsocketServer.KILL_UPDATE) {
                controller.kills = data[1][0];
            }
            if (id === WebsocketServer.KILLED && Settings.kill) {
                const killMessage = Settings.killMessage.length ? Settings.killMessage : "{KILL}x";
                const name = data[1].replace(/^Killed\s/, "").trim();
                const message = killMessage.replace(/\{KILL\}/g, controller.kills + "").replace(/\{NAME\}/g, name);
                controller.PacketManager.chat(message);
            }
        };
        const hooks_stringMessage = stringMessage;
        var WebsocketServer;
        (function(WebsocketServer) {
            WebsocketServer[WebsocketServer["LEADERBOARD"] = 3] = "LEADERBOARD";
            WebsocketServer[WebsocketServer["DAMAGE"] = 6] = "DAMAGE";
            WebsocketServer[WebsocketServer["PLAYERSTATS"] = 8] = "PLAYERSTATS";
            WebsocketServer[WebsocketServer["CONNECT"] = 12] = "CONNECT";
            WebsocketServer[WebsocketServer["UPGRADE"] = 14] = "UPGRADE";
            WebsocketServer[WebsocketServer["UPDATECLAN"] = 16] = "UPDATECLAN";
            WebsocketServer[WebsocketServer["DIED"] = 19] = "DIED";
            WebsocketServer[WebsocketServer["MOVEUPDATE"] = 20] = "MOVEUPDATE";
            WebsocketServer[WebsocketServer["KILL_UPDATE"] = 22] = "KILL_UPDATE";
            WebsocketServer[WebsocketServer["JOINCREATECLAN"] = 24] = "JOINCREATECLAN";
            WebsocketServer[WebsocketServer["DELETECLAN"] = 27] = "DELETECLAN";
            WebsocketServer[WebsocketServer["KILLED"] = 28] = "KILLED";
            WebsocketServer[WebsocketServer["ATTACK_ANIMATION"] = 29] = "ATTACK_ANIMATION";
            WebsocketServer[WebsocketServer["PLAYER_SPAWNED"] = 32] = "PLAYER_SPAWNED";
            WebsocketServer[WebsocketServer["DEFAULT"] = 33] = "DEFAULT";
            WebsocketServer[WebsocketServer["SPAWN"] = 35] = "SPAWN";
        })(WebsocketServer || (WebsocketServer = {}));
        var WebsocketClient;
        (function(WebsocketClient) {
            WebsocketClient[WebsocketClient["MOVE"] = 6] = "MOVE";
            WebsocketClient[WebsocketClient["ANGLE"] = 13] = "ANGLE";
            WebsocketClient[WebsocketClient["selectByID"] = 2] = "selectByID";
            WebsocketClient[WebsocketClient["ATTACK"] = 19] = "ATTACK";
            WebsocketClient[WebsocketClient["STOPATTACK"] = 18] = "STOPATTACK";
            WebsocketClient[WebsocketClient["LOGIN"] = 10] = "LOGIN";
            WebsocketClient[WebsocketClient["SCYTHE"] = 20] = "SCYTHE";
            WebsocketClient[WebsocketClient["SELECTITEM"] = 0] = "SELECTITEM";
            WebsocketClient[WebsocketClient["HAT"] = 5] = "HAT";
            WebsocketClient[WebsocketClient["CHAT"] = 7] = "CHAT";
            WebsocketClient[WebsocketClient["UPGRADE"] = 14] = "UPGRADE";
            WebsocketClient[WebsocketClient["AUTOATTACK"] = 23] = "AUTOATTACK";
            WebsocketClient[WebsocketClient["MOVEANGLE"] = 1] = "MOVEANGLE";
            WebsocketClient[WebsocketClient["LEAVECLAN"] = 24] = "LEAVECLAN";
            WebsocketClient[WebsocketClient["JOIN"] = 21] = "JOIN";
            WebsocketClient[WebsocketClient["ACCEPTDECLINE"] = 17] = "ACCEPTDECLINE";
            WebsocketClient[WebsocketClient["KICK"] = 25] = "KICK";
            WebsocketClient[WebsocketClient["CREATECLAN"] = 22] = "CREATECLAN";
        })(WebsocketClient || (WebsocketClient = {}));
        let start = Date.now();
        window.WebSocket = new Proxy(window.WebSocket, {
            construct(target, args) {
                if (typeof args[0] === "string") {
                    if (args[0] !== Sploop.connectURL) {
                        controller.myPlayerID = 0;
                        controller.age = 0;
                        for (const hat of Hats) {
                            hat.bought = !!hat.default;
                            hat.equipped = !!hat.default;
                        }
                    }
                    Sploop.connectURL = args[0];
                }
                const ws = new target(...args);
                ws.addEventListener("message", (event => {
                    const data = event.data;
                    if (typeof data === "string" && /^\[.+\]$/.test(data)) {
                        hooks_stringMessage(JSON.parse(data));
                    } else {
                        switch (Sploop.saves.buffer[0]) {
                            case WebsocketServer.PLAYERSTATS:
                                hooks_playerStats();
                                break;

                            case WebsocketServer.DELETECLAN:
                                deleteClan();
                                break;

                            case WebsocketServer.JOINCREATECLAN:
                                createClan();
                                break;

                            case WebsocketServer.UPDATECLAN:
                                updateClan();
                                break;

                            case WebsocketServer.MOVEUPDATE:
                                {
                                    const now = Date.now();
                                    Sploop.step = now - start;
                                    start = now;
                                    break;
                                }

                            case WebsocketServer.ATTACK_ANIMATION:
                                {
                                    hooks_attackAnimation();
                                    break;
                                }
                        }
                    }
                }));
                return ws;
            }
        });
        class PacketManager {
            constructor() {
                this.encoder = new TextEncoder;
            }
            send(...args) {
                Sploop.saves.send(new Uint8Array(args));
            }
            moveByBitmask(bitmask) {
                this.send(WebsocketClient.MOVE, bitmask);
            }
            changeAngle(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.ANGLE, 255 & angle, angle >> 8 & 255);
            }
            selectByID(id) {
                this.send(WebsocketClient.selectByID, id);
            }
            attack(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.ATTACK, 255 & angle, angle >> 8 & 255);
            }
            stopAttack() {
                this.send(WebsocketClient.STOPATTACK);
            }
            upgradeScythe(goldenCowID) {
                this.send(WebsocketClient.SCYTHE, 255 & goldenCowID, goldenCowID >> 8);
            }
            selectItemByType(type) {
                this.send(WebsocketClient.SELECTITEM, type);
            }
            equip(id) {
                this.send(WebsocketClient.HAT, id);
            }
            chat(message) {
                const bytes = this.encoder.encode(message);
                this.send(WebsocketClient.CHAT, ...bytes);
            }
            upgrade(id) {
                this.send(WebsocketClient.UPGRADE, id);
                controller.upgradeItem(id);
            }
            autoattack(toggle) {
                this.send(WebsocketClient.AUTOATTACK, Number(toggle));
            }
            moveAngle(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.MOVEANGLE, angle, angle >> 8 & 255);
            }
            leaveClan() {
                this.send(WebsocketClient.LEAVECLAN);
            }
            joinClan(id) {
                this.send(WebsocketClient.JOIN, id);
            }
            accept(which) {
                this.send(WebsocketClient.ACCEPTDECLINE, which);
            }
            kick(id) {
                this.send(WebsocketClient.KICK, id);
            }
            createClan(name) {
                const bytes = this.encoder.encode(name);
                this.send(WebsocketClient.CREATECLAN, ...bytes);
            }
        }
        class TimeoutManager {
            constructor(callbacks, delay) {
                this.callbacks = callbacks;
                this.delay = delay;
                this.active = false;
                this.old = Date.now();
            }
            static waitUntil(condition, time, callback) {
                return new Promise((resolve => {
                    const start = Date.now();
                    const int = setInterval((() => {
                        if (typeof time === "number" && Number.isFinite(time) && Date.now() - start > time || condition()) {
                            clearInterval(int);
                        }
                        if (condition()) {
                            if (typeof callback === "function") return callback();
                            resolve();
                        }
                    }), 50);
                }));
            }
            start() {
                if (this.active) return;
                this.active = true;
                this.old = Date.now();
                this.callbacks[0]();
            }
            async stop() {
                if (!this.active) return;
                this.callbacks[1]();
                if (!this.delay(this.old)) await TimeoutManager.waitUntil((() => this.delay(this.old)), 3e3);
                this.callbacks[2]();
                this.active = false;
            }
            isActive() {
                return this.active;
            }
        }
        class Controller {
            constructor() {
                this.myPlayerID = 0;
                this.move = 0;
                this.playerList = [];
                this.attacking = false;
                this.autoattack = false;
                this.rotation = false;
                this.weapon = false;
                this.healing = false;
                this.attackingInvis = false;
                this.toggleInvis = false;
                this.currentItem = null;
                this.chatToggle = false;
                this.chatCount = 0;
                this.autobed = false;
                this.automill = false;
                this.automillSpawn = false;
                this.mousemove = true;
                this.kills = 0;
                this.inGame = false;
                this.itemBar = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
                this.hsl = 0;
                this.aimTarget = null;
                this.wasAutoboost = false;
                this.count = 0;
                this.toggleJungle = false;
                this.toggleScuba = false;
                this.resources = {
                    food: 200,
                    wood: 200,
                    stone: 200,
                    gold: 200
                };
                this.mouse = {
                    x: 0,
                    y: 0,
                    angle: 0
                };
                this.equipStart = Date.now();
                this.actualHat = 0;
                this.currentHat = 0;
                this.previousHat = 0;
                this.maxCount = [ 0, 0, 0, 100, 30, 8, 2, 12, 32, 1, 2 ];
                this.age = 0;
                this.hotkeys = new Map;
                this.PacketManager = new PacketManager;
                this.previousWeapon = false;
                this.fastbreak = new TimeoutManager([ () => {
                    const primary = this.itemBar[ItemType.PRIMARY];
                    const secondary = this.itemBar[ItemType.SECONDARY];
                    const pickWeapon = secondary === EWeapons.HAMMER || primary === EWeapons.STICK && secondary === EWeapons.SHIELD;
                    this.previousWeapon = this.weapon;
                    this.whichWeapon(pickWeapon);
                    window.equip(11);
                    this.attacking = true;
                    this.attack();
                }, () => {
                    this.PacketManager.stopAttack();
                    this.attacking = false;
                    this.whichWeapon(this.previousWeapon);
                }, () => {
                    if (!Sploop.myPlayer.isClown) {
                        window.equip(this.previousHat);
                    }
                } ], (start => Sploop.myPlayer.target.hatReload === TargetReload.HAT && Date.now() - start > TargetReload.HAT));
                this.attachMouse();
            }
            reset(items) {
                this.move = 0;
                this.attacking = false;
                this.autoattack = false;
                this.rotation = false;
                this.weapon = false;
                this.healing = false;
                this.attackingInvis = false;
                this.toggleInvis = false;
                this.currentItem = null;
                this.chatToggle = false;
                this.chatCount = 0;
                this.autobed = false;
                this.automill = false;
                this.automillSpawn = false;
                this.mousemove = true;
                this.kills = 0;
                this.inGame = false;
                this.itemBar = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
                this.hsl = 0;
                this.aimTarget = null;
                this.count = 0;
                const target = Sploop.myPlayer.target;
                if (target) {
                    target.hatReload = TargetReload.HAT;
                }
                for (const id of items) {
                    this.upgradeItem(id);
                }
                for (const [key] of this.hotkeys) {
                    this.hotkeys.delete(key);
                }
            }
            attachMouse() {
                window.addEventListener("mousemove", (event => {
                    this.mouse.x = event.clientX;
                    this.mouse.y = event.clientY;
                    if (!this.rotation) {
                        this.mouse.angle = angle(innerWidth / 2, innerHeight / 2, this.mouse.x, this.mouse.y);
                    }
                }));
            }

            hasItem(type) {
                return this.itemBar[type] !== -1;
            }
            hasSecondary() {
                return this.itemBar[ItemType.SECONDARY] !== -1;
            }
            updateWeapon(type) {
                const weapon = Sploop.saves.defaultData[Sploop.props.itemBar][type];
                if (this.isWeapon(weapon) && this.itemBar[type] !== weapon) {
                    this.itemBar[type] = weapon;
                }
            }
            isMyPlayer(entity) {
                return entity.id === this.myPlayerID;
            }
            isTeammate(entity) {
                return entity.id !== this.myPlayerID && teammates.includes(entity.ownerID);
            }
            isEnemy(entity) {
                return !this.isMyPlayer(entity) && !this.isTeammate(entity);
            }
            canShoot() {
                const id = this.itemBar[ItemType.SECONDARY];
                return this.hasSecondary() && Items[id].actionType === ActionType.RANGED;
            }
            isWeapon(id) {
                const type = Items[id].itemType;
                return type === ItemType.PRIMARY || type === ItemType.SECONDARY;
            }
            isPrimary(id) {
                return Items[id].itemType === ItemType.PRIMARY;
            }
            isSecondary(id) {
                return Items[id].itemType === ItemType.SECONDARY;
            }
            currentCount(type) {
                return Sploop.saves.defaultData[Sploop.props.currentCount][type];
            }
            hasCount(type) {
                return this.currentCount(type) < this.maxCount[type];
            }
            isDoingNothing() {
                return !this.healing && !this.attackingInvis && !this.toggleInvis && !this.attacking && this.currentItem === null;
            }
            canAutosync() {
                return !this.attacking && !this.attackingInvis && !this.toggleInvis && !this.autoattack;
            }
            hasResources(id) {
                const cost = Items[id].cost || {
                    food: 0,
                    wood: 0,
                    stone: 0,
                    gold: 0
                };
                const {food, wood, stone, gold} = this.resources;
                const hasFood = food >= cost.food;
                const hasWood = wood >= cost.wood;
                const hasStone = stone >= cost.stone;
                const hasGold = gold >= cost.gold;
                return hasFood && hasWood && hasStone && hasGold;
            }
            getAngleFromBitmask(bitmask, rotate) {
                const vec = {
                    x: 0,
                    y: 0
                };
                if (bitmask & 1) vec.y--;
                if (bitmask & 2) vec.y++;
                if (bitmask & 4) vec.x--;
                if (bitmask & 8) vec.x++;
                if (rotate) {
                    vec.x *= -1;
                    vec.y *= -1;
                }
                return Math.atan2(vec.y, vec.x);
            }
            upgradeItem(id) {
                const item = Items[id];
                this.itemBar[item.itemType] = id;
            }
            upgradeScythe() {
                const target = Sploop.saves.entityList()[ELayer.GOLDENCOW][0];
                if (target !== undefined) {
                    this.PacketManager.upgradeScythe(target[Sploop.props.id]);
                }
            }
            buyHat(id) {
                if (!Hats[id].bought && controller.resources.gold >= Hats[id].price) {
                    Hats[id].bought = true;
                    this.PacketManager.equip(id);
                }
                return Hats[id].bought;
            }
            hatReloaded() {
                return Sploop.myPlayer.target.hatReload.current === TargetReload.HAT;
            }
            equipHat(id, actual = true, force = false) {
                const hatID = id === Hat.UNEQUIP ? this.actualHat : id;
                if (!this.buyHat(hatID) || !this.inGame) return false;
                const now = Date.now();
                if (!Hats[id].equipped && this.hatReloaded() && now - this.equipStart >= TargetReload.HAT || force) {
                    this.equipStart = now;
                    this.PacketManager.equip(hatID);
                    for (const hat of Hats) {
                        hat.equipped = false;
                    }
                    Hats[id].equipped = true;
                    this.previousHat = this.currentHat;
                    this.currentHat = id;
                    if (actual) {
                        this.actualHat = id;
                    }
                    return true;
                }
                return false;
            }
            async autochat() {
                if (this.chatToggle) return;
                this.chatToggle = true;
                const messages = Settings.autochatMessages.filter((msg => msg.length));
                if (!messages.length) return;
                this.PacketManager.chat(messages[this.chatCount++]);
                this.chatCount %= messages.length;
                await sleep(2e3);
                this.chatToggle = false;
            }
            accept(which) {
                this.PacketManager.accept(which);
                const acceptList = Sploop.saves.clanData[Sploop.props.acceptList];
                acceptList.shift();
            }
            async spawn() {
                await sleep(100);
                const play = document.querySelector("#play");
                play.click();
            }
            whichWeapon(type) {
                if (type !== undefined) {
                    this.weapon = type;
                }
                this.PacketManager.selectByID(this.itemBar[+this.weapon]);
            }
            attack(angle) {
                const dir = angle ? angle : this.mouse.angle;
                this.PacketManager.attack(dir);
            }
            place(type, angle, placementType) {
                if (this.wasAutoboost) {
                    const nearest = EntityManager.enemies()[0];
                    if (nearest !== undefined) {
                        angle = EntityManager.angle(Sploop.myPlayer, nearest);
                        this.PacketManager.moveAngle(angle);
                    }
                }
                const placeType = placementType === undefined ? Settings.placementType : placementType;
                const isHolding = placeType === PlacementType.HOLDING;
                this.whichWeapon();
                if (isHolding && this.attacking) this.attack(angle);
                this.PacketManager.selectItemByType(type);
                this.attack(angle);
                this.PacketManager.stopAttack();
                if (!isHolding) this.whichWeapon();
                if (this.attacking) this.attack(angle);
            }
            placement() {
                if (this.currentItem === null) return;
                this.place(this.currentItem);
                this.count = (this.count + 1) % Settings.placementSpeed;
                const method = this.count === 0 ? setTimeout : queueMicrotask;
                method(this.placement.bind(this));
            }
            placementHandler(type, code) {
                if (!this.hasItem(type)) return;
                if (Settings.placementType === PlacementType.DEFAULT) {
                    this.PacketManager.selectItemByType(type);
                    return;
                }
                this.hotkeys.set(code, type);
                this.currentItem = type;
                const isBoost = type === ItemType.TRAP && this.itemBar[ItemType.TRAP] === EObjects.BOOST;
                this.wasAutoboost = Settings.autoboostFollow && isBoost;
                if (this.hotkeys.size === 1) {
                    this.placement();
                    this.placement();
                }
            }
            heal() {
                this.PacketManager.selectItemByType(ItemType.FOOD);
                this.attack();
                this.PacketManager.stopAttack();
                this.whichWeapon();
                if (this.attacking) {
                    this.attack();
                }
            }
            invisibleHit() {
                this.mousemove = true;
                this.aimTarget = null;
                if (Settings.invisHitToggle && !this.toggleInvis || !Settings.invisHitToggle && !this.attackingInvis) {
                    this.toggleInvis = false;
                    this.attackingInvis = false;
                    return;
                }
                let angle;
                const nearest = EntityManager.nearestPossible(this.itemBar[+!this.weapon]);
                const shoot = this.canShoot() && !this.weapon;
                if (nearest && (Settings.meleeAim && !shoot || Settings.bowAim && shoot)) {
                    const pos1 = EntityManager.predict(Sploop.myPlayer);
                    const pos2 = EntityManager.predict(nearest);
                    angle = pos1.angle(pos2);
                    this.mousemove = false;
                    this.aimTarget = nearest.target;
                }
                if (nearest && shoot || !shoot) {
                    this.whichWeapon(!this.weapon);
                    this.attack(angle);
                    this.PacketManager.stopAttack();
                    this.whichWeapon(!this.weapon);
                }
                setTimeout(this.invisibleHit.bind(this), 85);
            }
            spikeInsta() {
                let angle;
                if (Settings.spikeInstaAim) {
                    const nearest = EntityManager.nearestPossible(this.itemBar[0]);
                    if (nearest) {
                        angle = EntityManager.angle(Sploop.myPlayer, nearest);
                    }
                }
                const previousWeapon = this.weapon;
                this.equipHat(Hat.BERSERKER);
                this.whichWeapon(false);
                this.place(ItemType.SPIKE, angle);
                this.attack(angle);
                this.PacketManager.stopAttack();
                this.whichWeapon(previousWeapon);
            }
            handleKeydown(event, code) {
                if (code === 1) event.preventDefault();
                if (event instanceof KeyboardEvent && event.repeat) return;
                if (Sploop.active) return;
                if (code === Settings.toggleMenu && !isInput(event.target)) {
                    if (typeof Sploop.toggleMenu === "function") Sploop.toggleMenu();
                }
                if (!this.inGame) return;
                if (code === Settings.openChat) {
                    if (!isInput()) event.preventDefault();
                    Sploop.saves.toggleChat();
                }
                if (isInput(event.target)) return;
                if (code === Settings.primary) this.whichWeapon(false);
                if (code === Settings.secondary && this.hasSecondary()) this.whichWeapon(true);
                if (code === Settings.heal && !this.healing) {
                    this.healing = true;
                    if (Settings.placementType === PlacementType.DEFAULT) {
                        this.PacketManager.selectItemByType(ItemType.FOOD);
                    } else {
                        doWhile((() => this.healing), this.heal.bind(this), 0);
                    }
                }
                //var boenmytimestartkey = "Backquote"
                if (code === Settings.wall) this.placementHandler(ItemType.WALL, code);
                //if (code === boenmytimestartkey) my_time();
                if (code === Settings.spike) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.SPIKE, code);
                if (code === Settings.windmill) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.WINDMILL, code);
                if (code === Settings.trap) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.TRAP, code);
                if (code === Settings.turret) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.TURRET, code);
                if (code === Settings.tree) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.FARM, code);
                if (code === Settings.platform) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.PLATFORM, code);
                if (code === Settings.spawn) for(let i = 0; i < Settings.placementSpeed; i++) this.placementHandler(ItemType.SPAWN, code);
                if (code === Settings.unequip) window.equip(0);
                if (code === Settings.bush) window.equip(1);
                if (code === Settings.berserker) window.equip(2);
                if (code === Settings.jungle) window.equip(3);
                if (code === Settings.crystal) window.equip(4);
                if (code === Settings.spikegear) window.equip(5);
                if (code === Settings.immunity) window.equip(6);
                if (code === Settings.boost) window.equip(7);
                if (code === Settings.applehat) window.equip(8);
                if (code === Settings.scuba) window.equip(9);
                if (code === Settings.hood) window.equip(10);
                if (code === Settings.demolist) window.equip(11);
                if (code === Settings.invisibleHit && this.hasSecondary()) {
                    if (Settings.invisHitToggle) {
                        this.toggleInvis = !this.toggleInvis;
                    } else {
                        this.attackingInvis = true;
                    }
                    if (this.toggleInvis || this.attackingInvis) this.invisibleHit();
                }
                if (code === Settings.spikeInsta) this.spikeInsta();
                if (code === Settings.fastBreak && !this.fastbreak.isActive() && this.hatReloaded()) {
                    this.fastbreak.start();
                }
                const copyMove = this.move;
                if (code === Settings.up) this.move |= 1;
                if (code === Settings.left) this.move |= 4;
                if (code === Settings.down) this.move |= 2;
                if (code === Settings.right) this.move |= 8;
                if (copyMove !== this.move) this.PacketManager.moveByBitmask(this.move);
                if (event instanceof MouseEvent && code === 0) {
                    this.attacking = true;
                }
                if (code === Settings.autoattack) {
                    this.autoattack = !this.autoattack;
                    this.PacketManager.autoattack(this.autoattack);
                }
                if (code === Settings.lockRotation) {
                    this.rotation = !this.rotation;
                    Sploop.saves.toggleRotation(this.rotation);
                }
                if (code === Settings.upgradeScythe) this.upgradeScythe();
            }
            handleKeyup(event, code) {
                if (code === Settings.heal && this.healing) {
                    this.healing = false;
                }
                if (code === Settings.invisibleHit && this.attackingInvis) {
                    this.attackingInvis = false;
                }
                if (code === Settings.fastBreak && this.fastbreak.isActive()) {
                    this.fastbreak.stop();
                }
                const copyMove = this.move;
                if (code === Settings.up) this.move &= -2;
                if (code === Settings.left) this.move &= -5;
                if (code === Settings.down) this.move &= -3;
                if (code === Settings.right) this.move &= -9;
                if (copyMove !== this.move) this.PacketManager.moveByBitmask(this.move);
                if (event instanceof MouseEvent && code === 0) {
                    this.attacking = false;
                }
                if (code === Settings.trap && this.wasAutoboost) {
                    this.wasAutoboost = false;
                    this.PacketManager.moveByBitmask(this.move);
                }
                if (this.currentItem !== null && this.hotkeys.delete(code)) {
                    const entries = [ ...this.hotkeys ];
                    this.currentItem = entries.length ? entries[entries.length - 1][1] : null;
                    if (this.currentItem === null) {
                        this.whichWeapon();
                    }
                }
            }
        }
        const createEntity = target => {
            const id = target[Sploop.props.id];
            const type = target.type;
            const entities = Sploop.saves.entityList();
            if (type === ELayer.PLAYER) {
                if (id === controller.myPlayerID) {
                    Sploop.myPlayer.target = target;
                    updateSkin();
                }
                const player = Formatter.player(target);
                target.hatReload = {
                    ...Reload.hat
                };
                target.weaponReload = {
                    ...Reload.weapon
                };
                target.prevHat = player.hat;
                const weaponReload = target.weaponReload;
                if (controller.isWeapon(player.currentItem)) {
                    weaponReload.max = Items[player.currentItem].reload || 0;
                    weaponReload.current = weaponReload.max;
                    weaponReload.lerp = weaponReload.max;
                }
            } else if (type === ELayer.TURRET) {
                target.turretReload = {
                    ...Reload.turret
                };
            } else if (type === ELayer.DRAGON) {
                target.fireballReload = {
                    ...Reload.fireball
                };
            } else if (type === ELayer.PROJECTILE) {
                const projectile = Formatter.projectile(target);
                const type = projectile.projectileType;
                const isTurret = Settings.turretReloadBar && entities[ELayer.TURRET].find((target => {
                    const turret = Formatter.object(target);
                    const isOwner = turret.ownerID === projectile.ownerID;
                    const isX = turret.x2 === projectile.x2;
                    const isY = turret.y2 === projectile.y2;
                    return isOwner && isX && isY;
                }));
                const isPlayer = Settings.weaponReloadBar && entities[ELayer.PLAYER].find((target => {
                    const player = Formatter.player(target);
                    const isOwner = player.ownerID === projectile.ownerID;
                    return isOwner;
                }));
                if (isTurret) {
                    const reload = isTurret.turretReload;
                    reload.current = -Sploop.step;
                    reload.lerp = 0;
                } else if (isPlayer) {
                    const weapon = Shooting.find((weapon => weapon.projectile === type));
                    if (weapon === undefined) return;
                    let delay = weapon.reload || 0;
                    if (type === 88) {
                        const id = isPlayer.secondary === EWeapons.XBOW ? EWeapons.XBOW : EWeapons.BOW;
                        delay = Items[id].reload || 0;
                    }
                    const reload = isPlayer.weaponReload;
                    reload.current = -Sploop.step;
                    reload.lerp = 0;
                    reload.max = delay;
                }
            } else if (type === ELayer.FIREBALL && entities[ELayer.DRAGON].length && Settings.fireballReloadBar) {
                const dragon = entities[ELayer.DRAGON][0];
                const reload = dragon.fireballReload;
                reload.current = -Sploop.step;
                reload.lerp = 0;
            }
        };
        const hooks_createEntity = createEntity;
        const TextOptions = {
            font: "bold 15px Montserrat",
            textBaseline: "top"
        };
        class RenderManager {
            static marker(ctx, color) {
                /*
                ctx.strokeStyle = "#303030"; // outline color i think
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, 2 * Math.PI);
                ctx.fill();
                /*
                ctx.stroke(); // remove this = no outline
                ctx.closePath();
                */
            }
            static circle(ctx, x, y, radius, color) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 0;
                ctx.beginPath();
                ctx.arc(1, 1, radius, 0, 1 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }
            static arrow(ctx, len, x, y, angle, color) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 6);
                ctx.rotate(angle);
                ctx.globalAlpha = .36;
                ctx.strokeStyle = color;
                ctx.lineCap = "triangle";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(-len, -len);
                ctx.lineTo(len, -len);
                ctx.lineTo(len, len);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
            static lines(ctx, x1, y1, x2, y2, color) {
                ctx.save();
                ctx.globalAlpha = .50;
                ctx.strokeStyle = color;
                ctx.lineCap = "triangle";
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
            }
            static tracerColor(entity, isTeammate) {
                if (isTeammate) return Settings.teammateColor;
                if (entity.type === ELayer.PLAYER) return Settings.enemyColor;
                return Settings.animalColor;
            }
            static trapActive(trap) {
                return EntityManager.entities().some((entity => {
                    const radius = trap.radius + entity.radius;
                    return EntityManager.distance(entity, trap) < radius - 25;
                }));
            }
            static markerColor(target, ownerID) {
                let color = null;
                const object = Formatter.object(target);
                const isMyPlayer = Sploop.myPlayer.ownerID === ownerID;
                const isTeammate = teammates.includes(ownerID);
                const isTeammateTrap = object.type === ELayer.TRAP && (isMyPlayer || isTeammate);
                if (Settings.itemMarkers && isMyPlayer) {
                    color = "#4a86ff";
                } else if (Settings.teammateMarkers && isTeammate && !isMyPlayer) {
                    color = Settings.teammateMarkersColor;
                } else if (Settings.enemyMarkers && !isMyPlayer && !isTeammate) {
                    color = "#E2322F";
                }
                if (Settings.trapActivated && isTeammateTrap) {
                    if (!target.active && this.trapActive(object)) {
                        target.active = object.id;
                    }
                    if (target.active === object.id) {
                        return Settings.trapActivatedColor;
                    }
                    target.active = null;
                }
                return color;
            }
            static renderText(ctx, text, callback, options) {
                ctx.save();
                ctx.fillStyle = "#fff";
                ctx.strokeStyle = "#303030";
                ctx.lineWidth = 5;
                ctx.transparenct = .3;
                ctx.lineJoin = "round";
                Object.assign(ctx, TextOptions, options);
                const width = ctx.measureText(text).width;
                const height = parseInt((ctx.font.match(/\d+/) || [])[0]) || 1;
                const data = callback(width, height);
                ctx.strokeText(text, ...data);
                ctx.fillText(text, ...data);
                ctx.restore();
            }
            static renderHP(ctx, entity, height = 0) {
                if (!Settings.drawHP) return;
                const {x, y, health, maxHealth, radius} = entity;
                this.renderText(ctx, `${health}`, (width => [ x - width / 2, y + radius + -90 + height ]));
            }
            static drawImage(ctx, image) {
                if (!(image && image.naturalHeight !== 0)) return;
                const w = image.width;
                const h = image.height;
                const s = .5;
                ctx.drawImage(image, -s * w / 2, -s * h, w * s, h * s);
            }
            static renderBar(ctx, entity, value, maxValue, color, extraHeight = 0) {
                const {x, y, radius} = entity;
                const background = utils_Images.gaugeBackground;
                const front = utils_Images.gaugeFront;
                const scale = .5;
                const width = front.width * scale;
                const fill = value / maxValue * (width - 10);
                const h = (entity.type === ELayer.TURRET ? 25 : 50) + extraHeight;
                ctx.save();
                if (entity.type === ELayer.TURRET) {
                    ctx.rotate(Math.PI - entity.angle);
                    ctx.rotate(Math.PI);
                }
                ctx.translate(x, y + radius + h + front.height * scale);
                this.drawImage(ctx, background);
                ctx.fillStyle = color;
                ctx.fillRect(-width / 2 + 5, -scale * front.height + 5, fill, scale * front.height - 10);
                this.drawImage(ctx, front);
                ctx.restore();
                return front.height * scale;
            }
            static reloadBar(ctx, entity, reload, height) {
                const fill = clamp(reload.current, 0, reload.max);
                reload.lerp = lerp(reload.lerp, fill, .2);
                const value = Settings.smoothReloadBar ? reload.lerp : fill;
                return this.renderBar(ctx, entity, value, reload.max, reload.color(), height);
            }
            static windmillRotation(target) {
                const rotateSpeed = LayerData[target.type].rotateSpeed;
                if (rotateSpeed === undefined) return;
                const speed = Settings.windmillRotation ? rotateSpeed : 0;
                if (target[Sploop.props.rotateSpeed] !== speed) {
                    target[Sploop.props.rotateSpeed] = speed;
                }
            }
            static renderMarker(ctx, target) {
                const object = Formatter.object(target);
                if (object.ownerID === 0) return;
                if (object.type === ELayer.TURRET && Settings.turretReloadBar) {
                    this.reloadBar(ctx, {
                        ...object,
                        x: 0,
                        y: 0
                    }, target.turretReload, 0);
                }
                this.windmillRotation(target);
                const color = this.markerColor(target, object.ownerID);
                if (color === null) return;
                this.marker(ctx, color);
            }
            static renderTracer(ctx, entity, isTeammate) {
                const player = Formatter.player(Sploop.myPlayer.target);
                const color = Settings.rainbow ? `hsl(${controller.hsl}, 100%, 50%)` : this.tracerColor(entity, isTeammate);
                const pos1 = new Vector(player.x, player.y);
                const pos2 = new Vector(entity.x, entity.y);
                if (Settings.arrows) {
                    const w = 8;
                    const distance = Math.min(100 + w * 2, pos1.distance(pos2) - w * 2);
                    const angle = pos1.angle(pos2);
                    const pos = pos1.direction(angle, distance);
                    this.arrow(ctx, w, pos.x, pos.y, angle, color);
                } else {
                    this.lines(ctx, pos1.x, pos1.y, pos2.x, pos2.y, color);
                }
            }
        }
        const drawEntityInfo = (target, ctx, isTeammate) => {
            const entity = Formatter.entity(target);
            if (controller.myPlayerID === entity.id) {
                if (Settings.rainbow) {
                    Sploop.controller.hsl = (Sploop.controller.hsl + .3) % 360;
                }
                if (controller.aimTarget !== null) {
                    const aim = Formatter.entity(controller.aimTarget);
                    const dir = Settings.visualAim ? angle(entity.x, entity.y, aim.x, aim.y) : controller.mouse.angle;
                    Sploop.myPlayer.target[Sploop.props.angle] = dir;
                }
            }
            let height = 0;
            if (entity.type === ELayer.PLAYER) {
                if (Settings.hatReloadBar) {
                    height += RenderManager.reloadBar(ctx, entity, target.hatReload, height);
                }
                if (Settings.weaponReloadBar) {
                    height += RenderManager.reloadBar(ctx, entity, target.weaponReload, height);
                }
            }
            if (entity.type === ELayer.DRAGON && Settings.fireballReloadBar) {
                height += RenderManager.reloadBar(ctx, entity, target.fireballReload, height);
            }
            RenderManager.renderHP(ctx, entity, height);
            if (controller.myPlayerID === entity.id || !Sploop.myPlayer.target) return;
            if (Settings.possibleShots && !isTeammate) {
                const hit = EntityManager.projectileCanHitEntity(entity);
                if (hit === Hit.CAN) {
                    const color = Settings.rainbow ? `hsl(${controller.hsl}, 100%, 50%)` : RenderManager.tracerColor(entity, isTeammate);
                    RenderManager.circle(ctx, entity.x, entity.y, entity.radius, color);
                }
            }
            if (Settings.enemyTracers && entity.type === 0 && !isTeammate || Settings.teammateTracers && entity.type === 0 && isTeammate || Settings.animalTracers && entity.type !== 0) {
                RenderManager.renderTracer(ctx, entity, isTeammate);
            }
        };
        const hooks_drawEntityInfo = drawEntityInfo;
        const drawItemBar = (ctx, imageData, index) => {
            if (!Settings.itemCounter) return;
            const id = Sploop.saves.defaultData[Sploop.props.itemBar][index];
            const type = Items[id].itemType;
            const currentCount = Sploop.saves.defaultData[Sploop.props.currentCount][type];
            const maxCount = controller.maxCount[type];
            if (maxCount === 0) return;
            const x = imageData[Sploop.props.x] - 10;
            const y = imageData[Sploop.props.y] + 10;
            const w = imageData.width;
            RenderManager.renderText(ctx, `${currentCount}/${maxCount}`, (width => [ x + w - width, y ]), {
                font: "bold 16px Montserrat"
            });
        };
        const hooks_drawItemBar = drawItemBar;
        const renderItems = (target, id, ctx, step) => {
            RenderManager.renderMarker(ctx, target);
        };
        const hooks_renderItems = renderItems;
        let isHealing = false;
        let updatePlayer_start = Date.now();
        const healing = () => {
            const {health, maxHealth, isClown} = Sploop.myPlayer;
            if (Settings.autoheal && health < maxHealth && controller.inGame) controller.heal()
        }
        setInterval(() => { // automill | am
            const automill = controller.age < 10 && controller.hasCount(ItemType.WINDMILL);
            const automillSpawn = controller.age > 9 && controller.currentCount(ItemType.WINDMILL) === 0 && controller.automillSpawn;
            controller.automill = A_M && (automill || automillSpawn);
            if (controller.automill && controller.hasResources(controller.itemBar[ItemType.WINDMILL])) {
                const angle = controller.getAngleFromBitmask(controller.move, true);
                setTimeout(() => {
                    controller.place(ItemType.WINDMILL, angle + 0.75, PlacementType.INVISIBLE);
                }, 50);
                setTimeout(() => {
                    controller.place(ItemType.WINDMILL, angle - 0.75, PlacementType.INVISIBLE);
                }, 150);
            }
        }, 150);
        const updatePlayer = target => {
            const entity = Formatter.entity(target);
            switch (entity.type) {
                case ELayer.PLAYER:
                    {
                        const player = Formatter.player(target);
                        if (controller.isWeapon(player.currentItem)) {
                            if (controller.isSecondary(player.currentItem)) {
                                target.secondary = player.currentItem;
                            } else {
                                target.primary = player.currentItem;
                            }
                        }
                        if (player.id === controller.myPlayerID) {
                            Sploop.myPlayer = {
                                ...Sploop.myPlayer,
                                ...player
                            };
                            const {x2, y2, health, maxHealth, isClown, hat} = Sploop.myPlayer;
                            if (health < 100) {
                                setTimeout(() => {
                                    controller.heal();
                                }, Math.round(Sploop.myPlayer.health * 1.66))
                            }
                            if (controller.isDoingNothing()) {
                                if (controller.autobed && controller.hasResources(EObjects.SPAWN)) {
                                    controller.place(ItemType.SPAWN, random(-Math.PI, Math.PI));
                                }
                            }
                            break;
                        }}
                    break;
                case ELayer.TURRET:
                    {
                        if (Settings.turretReloadBar) {
                            const turretReload = target.turretReload;
                            turretReload.current = Math.min(turretReload.current + Sploop.step, turretReload.max);
                        }
                        break;
                    }

                case ELayer.DRAGON:
                    {
                        if (Settings.fireballReloadBar) {
                            const fireballReload = target.fireballReload;
                            fireballReload.current = Math.min(fireballReload.current + Sploop.step, fireballReload.max);
                        }
                        break;
                    }
            }
        };
        const hooks_updatePlayer = updatePlayer;
        const ANY_LETTER = "(?:[^\\x00-\\x7F-]|\\$|\\w)";
        const NumberSystem = [ {
            radix: 2,
            prefix: "0b0*"
        }, {
            radix: 8,
            prefix: "0+"
        }, {
            radix: 10,
            prefix: ""
        }, {
            radix: 16,
            prefix: "0x0*"
        } ];
        var Template;
        (function(Template) {
            Template[Template["APPEND"] = 0] = "APPEND";
            Template[Template["PREPEND"] = 1] = "PREPEND";
        })(Template || (Template = {}));
        class Regex {

            constructor(code, unicode) {
                this.code = code;
                this.COPY_CODE = code;
                this.unicode = unicode || false;
                this.hooks = {};
                this.totalHooks = 0;
            }
            static parseValue(value) {
                try {
                    return Function(`return (${value})`)();
                } catch (err) {
                    return null;
                }
            }
            isRegexp(value) {
                return TYPEOF(value) === "regexp";
            }
            generateNumberSystem(int) {
                const copy = [ ...NumberSystem ];
                const template = copy.map((({prefix, radix}) => prefix + int.toString(radix)));
                return `(?:${template.join("|")})`;
            }

            parseVariables(regex) {
                regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
                regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
                regex = regex.replace(/ARGS\{(\d+)\}/g, ((...args) => {
                    let count = Number(args[1]), arr = [];
                    while (count--) arr.push("\\w+");
                    return arr.join("\\s*,\\s*");
                }));
                regex = regex.replace(/NUMBER\{(\d+)\}/g, ((...args) => {
                    const int = Number(args[1]);
                    return this.generateNumberSystem(int);
                }));
                return regex;
            }
            format(name, inputRegex, flags) {
                this.totalHooks += 1;
                let regex = "";
                if (Array.isArray(inputRegex)) {
                    regex = inputRegex.map((exp => this.isRegexp(exp) ? exp.source : exp)).join("\\s*");
                } else if (this.isRegexp(inputRegex)) {
                    regex = inputRegex.source;
                }
                regex = this.parseVariables(regex);
                if (this.unicode) {
                    regex = regex.replace(/\\w/g, ANY_LETTER);
                }
                const expression = new RegExp(regex.replace(/\{INSERT\}/, ""), flags);
                const match = this.code.match(expression);
                if (match === null) error("Failed to find: " + name);
                return regex.includes("{INSERT}") ? new RegExp(regex, flags) : expression;
            }
            template(type, name, regex, substr) {
                const expression = new RegExp(`(${this.format(name, regex).source})`);
                const match = this.code.match(expression) || [];
                this.code = this.code.replace(expression, type === Template.APPEND ? "$1" + substr : substr + "$1");
                return match;
            }

            match(name, regex, flags, debug = false) {
                const expression = this.format(name, regex, flags);
                const match = this.code.match(expression) || [];
                this.hooks[name] = {
                    expression,
                    match
                };
                if (debug) log(name, this.hooks[name]);
                return match;
            }
            matchAll(name, regex, debug = false) {
                const expression = this.format(name, regex, "g");
                const matches = [ ...this.code.matchAll(expression) ];
                this.hooks[name] = {
                    expression,
                    match: matches
                };
                if (debug) log(name, this.hooks[name]);
                return matches;
            }
            replace(name, regex, substr, flags) {
                const expression = this.format(name, regex, flags);
                this.code = this.code.replace(expression, substr);
                return this.code.match(expression) || [];
            }
            append(name, regex, substr) {
                return this.template(Template.APPEND, name, regex, substr);
            }
            prepend(name, regex, substr) {
                return this.template(Template.PREPEND, name, regex, substr);
            }
            insert(name, regex, substr) {
                const {source} = this.format(name, regex);
                if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
                const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
                this.code = this.code.replace(findExpression, `$1${substr}$2`);
                return this.code.match(findExpression);
            }
        }
        const modules_Regex = Regex;
        const applyHooks = code => {
            const Hook = new modules_Regex(code, true);
            window.COPY_CODE = (Hook.COPY_CODE.match(/^\((.+)\)\(.+\);$/) || [])[1];
            Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, `EXTERNAL.__proto__.toString=()=>COPY_CODE;`);
            Hook.replace("strict", /{QUOTE}use strict{QUOTE};/, "");
            Hook.append("toggleRotation", /return (\w+)\?\w+:.+?\}/, `Sploop.saves.toggleRotation=(value)=>{$2=value};`);
            Hook.replace("buffer", /((\w+)=new \w+\(NUMBER{4096}\).+?(\w+)=.+?)function/, `$1window.Sploop.saves.buffer2=()=>$2;window.Sploop.saves.byteLength2=()=>$3;function`);
            Hook.append("upgradeItem", /\.001.+?for\(let \w+=0,.+?\w+\(new \w+\(\[.+?,(\w+)\]\)(,|;)?/, `,Sploop.controller.upgradeItem($2)$3`);
            Hook.replace("zoom", /(\w+):NUMBER{1824},(\w+):NUMBER{1026}/, "get $1(){return Sploop.scale.lerp.w},get $2(){return Sploop.scale.lerp.h}");
            Hook.insert("send", /=NUMBER{9999}.+?\(null\).+?{INSERT}function (\w+)\(\w+\)\{/, `Sploop.saves.send=$3;`);
            Hook.replace("toggleChat", /(return \(?(\w+&&\w+.+?)(?:,)?(?:\))?void.+?)function/, `$1Sploop.saves.toggleChat=()=>{$2};function`);
            Hook.replace("updatePlayer", /(\w+\(ARGS{16}\).+?(\w+)\.\w+=0[,;]?)\}function/, `$1;Sploop.hooks.updatePlayer($2)}function`);
            Hook.replace("createEntity", /(function \w+\((\w+),ARGS{16}\).+?\})(\}\w+\(\))/, `$1Sploop.hooks.createEntity($2)$3`);
            Hook.append("drawEntityInfo", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/, `Sploop.hooks.drawEntityInfo($2);Sploop.hooks.ally($2);`);
            const id = Hook.match("id", /-NUMBER{1}!==\w+\.(\w+)&&/)[1];
            Sploop.props.id = id;
            const [, x, x1, x2, y, y1, y2, angle, angle1, angle2] =
                  Hook.match("PositionFormat", [ /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/ ]);
            Sploop.props.x = x;
            Sploop.props.x1 = x1;
            Sploop.props.x2 = x2;
            Sploop.props.y = y;
            Sploop.props.y1 = y1;
            Sploop.props.y2 = y2;
            Sploop.props.angle = angle;
            Sploop.props.angle1 = angle1;
            Sploop.props.angle2 = angle2;
            const ownerID = Hook.match("ownerID", /\|\|\w+&&\w+===\w+\.(\w+)\)/)[1];
            Sploop.props.ownerID = ownerID;
            const health = Hook.match("health", /\w+\.(\w+)\/NUMBER{255}\*/)[1];
            Sploop.props.health = health;
            const name = Hook.match("name", /\w+\.(\w+),[a-z]\(\).\w{2},[a-z]\(\).\w{2},\w\(\d{3}\)/)[1];
            Sploop.props.name = name;
            const entityValue = Hook.match("entityValue", /!\(\w+\.(\w+)&/)[1];
            Sploop.props.entityValue = entityValue;
            const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
            Sploop.props.hat = hat;
            Sploop.props.currentItem = currentItem;
            const projectileType = Hook.match("projectileType", /,\w+\[\w+\]\.(\w+),/)[1];
            Sploop.props.projectileType = projectileType;
            const playerList = Hook.match('get', /const \w=\w\[\w\],\w=\w{2}.\w{2}\[\w\.\w{2}\]/)[0].slice(15, this.length - 6);
            const itemBar = Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1Sploop.saves.defaultData=$2;Sploop.controller.playerList=${playerList};function`)[3];
            Sploop.props.itemBar = itemBar;
            const currentCount = Hook.match("currentCount", /(\w+):\[ARGS{11}\],/)[1];
            Sploop.props.currentCount = currentCount;
            Hook.replace("entityList", /(\(this,.+?typeof window.+?(\w+)=\[\].+?)function/, `$1Sploop.saves.entityList=()=>$2;function`);
            const rotateSpeed = Hook.match("rotateSpeed", /\w+\(ARGS{17}\)\{.+?\/NUMBER{4}.+?\/NUMBER{4}.+?\w+\.(\w+)=/)[1];
            Sploop.props.rotateSpeed = rotateSpeed;
            Hook.replace('r_s', /AGE \D\+\w(,\d{2},\D{6})/, `"$1,"#fff"`);
            Hook.replace('r_a', /(\(\)\.\w{2}\()([a-z]\(\d{3}\))(\,\d{2})/, `$1""$3`);
            //Hook.replace('c', /"\D"+\W(\w.\w{2})\W+"\D",[a-z]\(\).\w{2},"#96C949","#404040"/, `"["+ $1 + "]", 25, "#404040","#2b2626"`);
            Hook.append("showHoods", /\w+\.\w+!==\w+\)/, `||Sploop.settings.showHoods`);
            Hook.append("itemCounter", /AGE 0.+?\[(\w+)\][,;](\w+)\.\w+\((\w+)\)([,;])/, `Sploop.hooks.drawItemBar($4,$3,$2)$5`);
            Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1Sploop.hooks.renderItems(...arguments)$2`);
            Hook.replace("mousemove", /(\+NUMBER{110}.+?)(const \w+=\w+\(\).+?\w+!==\w+.+?\w+\(\w+\))/, `$1if(Sploop.controller.mousemove){$2}`);
            Hook.replace("players", /(\)\)\(\).+?(\w+)=new.+?)function/, `$1Sploop.saves.players=()=>$2;function`);
            Hook.replace("showIDS", /===(\w+)(&&\w+\(\)&&\w+\(\).+?)return void\((\w+)=!0/, "===$1$2;if('/ids'==$1)return void($3 = !$3");
            const [skin, accessory, back] = Hook.matchAll("skins", /=\w+\.(\w+)\|\|NUMBER{0}/).map((a => a[1]));
            Sploop.props.skin = skin;
            Sploop.props.accessory = accessory;
            Sploop.props.back = back;
            log("Total hooks: " + Hook.totalHooks);
            return Hook.code;
        };
        let Allies = []
        let Enemys = []
        const modules_applyHooks = applyHooks;
        const version = __webpack_require__(147).i8;
        const log = console.log;
        const error = console.error;
        const controller = new Controller;
        window.log = log;
        window.Sploop = {
            props: {},
            hooks: {
                drawEntityInfo: hooks_drawEntityInfo,
                updatePlayer: hooks_updatePlayer,
                createEntity: hooks_createEntity,
                drawItemBar: hooks_drawItemBar,
                renderItems: hooks_renderItems,
                ally: (entity, p2, p3) => {
                    if (p3 && entity[Sploop.props.id] !== Sploop.controller.myPlayerID && entity.type === 0 && !Allies.find(A => A.id == entity[Sploop.props.id])) {
                        Allies.push({
                            x: entity[Sploop.props.x],
                            y: entity[Sploop.props.y],
                            type: entity.type,
                            hp: entity[Sploop.props.health] / 255 * 100,
                            hat: entity[Sploop.props.hat],
                            pid: entity[Sploop.props.ownerID],
                            id: entity[Sploop.props.id]
                        })
                    }
                    if (!p3 && entity[Sploop.props.id] !== Sploop.controller.myPlayerID && entity.type === 0 && !Enemys.find(A => A.id == entity[Sploop.props.id])) {
                        Enemys.push({
                            x: entity[Sploop.props.x],
                            y: entity[Sploop.props.y],
                            type: entity.type,
                            hp: entity[Sploop.props.health] / 255 * 100,
                            hat: entity[Sploop.props.hat],
                            pid: entity[Sploop.props.ownerID],
                            id: entity[Sploop.props.id]
                        })
                    }
                }
            },
            chat: () => {
                return document.getElementById('chat-wrapper').style.display == "" || document.getElementById('chat-wrapper').style.display == "none";
            },
            saves: {},
            controller,
            scale: Scale,
            settings: Settings,
            myPlayer: {},
            version,
            step: 0,
            PRODUCTION: true,
            active: null,
            connectURL: ""
        };
		// 2t
		let A_H = true;
		let A_B = true;
		let A_T = true;
		let A_P = true;
		let A_R = true;
		let A_M = true;
		let A_I = true;

		// 2f
		let A_A = false;
		let A_N = false;
		let A_F = false;
		let B_I = false;

		// 3f
		let A_GM = false;

		// 3t
		let A_BO = true;
		let A_BS = true;

		window.addEventListener("keydown", function(e) {
			if(e.code == "Enter" && window.chat && window.chat.value != '') {
				if(window.chat.value == "!md -ah") {
					if (!A_H) {
						A_H = true, setTimeout(() => { controller.PacketManager.chat("Autoheal enabled.") }, 510);
					} else {
						A_H = false, setTimeout(() => { controller.PacketManager.chat("Autoheal disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -ab") {
					if (!A_B) {
						A_B = true, setTimeout(() => { controller.PacketManager.chat("Autobreak enabled.") }, 510);
					} else {
						A_B = false, setTimeout(() => { controller.PacketManager.chat("Autobreak disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -at") {
					if (!A_T) {
						A_T = true, setTimeout(() => { controller.PacketManager.chat("AntiTrap enabled.") }, 510);
					} else {
						A_T = false, setTimeout(() => { controller.PacketManager.chat("AntiTrap disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -tr") {
					if (!Settings.enemyTracers) {
						Settings.enemyTracers = true, setTimeout(() => { controller.PacketManager.chat("Tracers enabled.") }, 510);
					} else {
						Settings.enemyTracers = false, setTimeout(() => { controller.PacketManager.chat("Tracers disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -ap") {
					if (!A_P) {
						A_P = true, setTimeout(() => { controller.PacketManager.chat("Autoplacer enabled.") }, 510);
					} else {
						A_P = false, setTimeout(() => { controller.PacketManager.chat("Autoplacer disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -aa") {
					if (!A_A) {
						A_A = true, setTimeout(() => { controller.PacketManager.chat("AutoAttack enabled.") }, 510);
					} else {
						A_A = false, setTimeout(() => { controller.PacketManager.chat("AutoAttack disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -ai") {
					if (!A_R) {
						A_R = true, setTimeout(() => { controller.PacketManager.chat("AutoInsta enabled.") }, 510);
					} else {
						A_R = false, setTimeout(() => { controller.PacketManager.chat("AutoInsta disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -am") {
					if (!A_M) {
						A_M = true, setTimeout(() => { controller.PacketManager.chat("AutoMill enabled.") }, 510);
					} else {
						A_M = false, setTimeout(() => { controller.PacketManager.chat("AutoMill disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -aai") {
					if (!A_I) {
						A_I = true, setTimeout(() => { controller.PacketManager.chat("AntiAutoInsta enabled.") }, 510);
					} else {
						A_I = false, setTimeout(() => { controller.PacketManager.chat("AntiAutoInsta disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -abo") {
					if (!A_BO) {
						A_BO = true, setTimeout(() => { controller.PacketManager.chat("AntiBoost enabled.") }, 510);
					} else {
						A_BO = false, setTimeout(() => { controller.PacketManager.chat("AntiBoost disabled.") }, 510);
					}
				}
				if(window.chat.value == "!md -abs") {
					if (!A_BS) {
						A_BS = true, setTimeout(() => { controller.PacketManager.chat("AutoBreakSpike enabled.") }, 510);
					} else {
						A_BS = false, setTimeout(() => { controller.PacketManager.chat("AutoBreakSpike disabled.") }, 510); // lmao scuffed name
					}
				}
				if(window.chat.value == "!md -bi") {
					if (!B_I) {
						B_I = true, setTimeout(() => { controller.PacketManager.chat("BuildingIndicators enabled.") }, 510);
					} else {
						B_I = false, setTimeout(() => { controller.PacketManager.chat("BuildingIndicators disabled.") }, 510); // def original name not skidded from moomoo.io
					}
				}
			}
		});
		function fgdo(a, b) {
			return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
		}
		function calcAngleDegrees(x, y) {
			return Math.atan2(y, x) * 180 / Math.PI;
		}

		let primaryWeapon = 1;
		const canvas = document.querySelector('#game-canvas');
		const placeObject = function (key, code) {
			const clickObject = {
				isTrusted: true,
				key: key,
				code: code,
				target: canvas,
				constructor: KeyboardEvent,
				preventDefault: () => {},
			};
			window.onkeydown(clickObject);
			window.onkeyup(clickObject);
		};
		const deployObject = function (key, code) {
			placeObject(key, code);
			placeObject('Space', 'Space');
			placeObject(primaryWeapon, `Digit${String(primaryWeapon)}`);
		};
		let spikey, spikeId, spikeNear = false;
		let trapy, trapId, inTrap = false;
		let enemyTrapY, enemyTrapId, enemyInTrap = false;
		let nearSY, nearSID, nearS = false;
		const toRad = t => t * Math.PI / 180
		let toDegree = function(angle) {
			return ((angle * 180) / 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679);
		}
		String.prototype.shuffle = function() {
			var a = this.split(""),
				n = a.length;

			for (var i = n - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var tmp = a[i];
				a[i] = a[j];
				a[j] = tmp;
			}
			return a.join("");
		}
		let self = {}
		let autobreak = true
		addEventListener('keydown', e => {
			if (e.code == "Digit1") {
				self.activeweapon = 0
			}
			if (e.code == "Digit2") {
				self.activeweapon = 1
			}
			if (e.code == "Period" && Sploop.chat()) {
				controller.PacketManager.chat("p")
			}
		})
		window.equip = (e) => {
			if (Sploop.myPlayer.hat !== e) {
				Sploop.controller.PacketManager.equip(e)
			}
		}
		window.e2 = (e) => {
			Sploop.controller.PacketManager.equip(e);
		}
		let nearestEnemy;
		let currentHat = 0;
		let currentWeapon = null;
		let retrapcount = 0;
		let testy = 0;
		let spinCount = 0;
		let bS = false;
		let alreadydone = false;
		/////////////////// MAIN INTERVAL START
		setInterval(() => {
			const nearest = EntityManager.enemies()[0];
			let distance = fgdo(nearest, Sploop.myPlayer);
			const nEA = EntityManager.angle(Sploop.myPlayer, nearest);
			try {
				testy += 0.10; testy > 3 && (testy = -3);
			} catch(err) {}
			// AUTOBREAK, ANTITRAP
			trapy = null
			for (let i = 0; i < Sploop.saves.entityList()[ELayer.TRAP].length; i++) {
				const trapx = Sploop.saves.entityList()[ELayer.TRAP][i];
				if (trapx && trapx[Sploop.props.ownerID] !== Sploop.myPlayer.ownerID && !teammates.includes(trapx[Sploop.props.ownerID]) && Math.hypot(trapx[Sploop.props.x] - Sploop.myPlayer.x, trapx[Sploop.props.y] - Sploop.myPlayer.y) <= 55) {
					trapy = trapx;
					if (!inTrap) {
						let trapangle = Math.atan2(trapy[Sploop.props.y] - Sploop.myPlayer.y, trapy[Sploop.props.x] - Sploop.myPlayer.x);
						inTrap = true;
						currentHat = Sploop.myPlayer.hat
						currentWeapon = Sploop.controller.weapon
						//////////////////////////////////
						// ANTITRAP
						if(A_T) {
							setTimeout(() => {
								controller.place(4, trapangle + 95 * 2);
							}, 50);
							setTimeout(() => {
								controller.place(4, trapangle + -95 * 2);
							}, 150);
							setTimeout(() => {
								controller.place(4, trapangle + 110);
							}, 250);
						}
						// ANTITRAP
						//////////////////////////////////
					} else {
						//////////////////////////////////
						// AUTOBREAK, PART OF ANTITRAP (HIT)
						if(A_B) {
							let trapangle = Math.atan2(trapy[Sploop.props.y] - Sploop.myPlayer.y, trapy[Sploop.props.x] - Sploop.myPlayer.x);
							if(A_T) {
								if(controller.itemBar[ItemType.TRAP] === EObjects.TRAP && controller.itemBar[ItemType.TRAP] !== undefined || null) {
									controller.place(7, testy);
									controller.place(4, testy);
								}
							}
							window.equip(11);
							Sploop.controller.whichWeapon(true);
							if(!bS) Sploop.controller.PacketManager.attack(trapangle);
							Sploop.controller.PacketManager.stopAttack();
						}
						// AUTOBREAK, PART OF ANTITRAP (HIT)
						//////////////////////////////////
					}
					trapId = trapy[Sploop.props.id];
					break
				}
			}
			if (!trapy && inTrap) {
				//////////////////////////////////
				// RETRAP COUNT CHAT
				setTimeout(() => {
					if(inTrap) {
						retrapcount++
						controller.PacketManager.chat(retrapcount);
					} else {
						retrapcount = 0;
					}
				}, 230);
				// RETRAP COUNT CHAT
				//////////////////////////////////
				if (Sploop.myPlayer.hat != currentHat && Sploop.myPlayer.hat == 11 && A_B) window.equip(currentHat);
				setTimeout(() => {
					if (Sploop.myPlayer.hat != currentHat && Sploop.myPlayer.hat == 11 && A_B) window.equip(currentHat);
				}, 1300);
				setTimeout(() => {
					if (Sploop.myPlayer.hat != currentHat && Sploop.myPlayer.hat == 11 && A_B) window.equip(currentHat);
				}, 900);
				self.activeweapon = currentWeapon
				Sploop.controller.whichWeapon(currentWeapon)
				currentWeapon = 0;
				currentHat = currentHat;
				trapId = null;
				inTrap = false;
			}
			// AUTOBREAK, ANTITRAP
			//////////////////////////////////
			// ENEMY INTRAP
			enemyTrapY = null
			for (let i = 0; i < Sploop.saves.entityList()[ELayer.TRAP].length; i++) {
				const enemyTrapX = Sploop.saves.entityList()[ELayer.TRAP][i];
				if (enemyTrapX && enemyTrapX[Sploop.props.ownerID] === Sploop.myPlayer.ownerID && !teammates.includes(enemyTrapX[Sploop.props.ownerID]) && Math.hypot(enemyTrapX[Sploop.props.x] - nearest.x, enemyTrapX[Sploop.props.y] - nearest.y) <= 55) {
					enemyTrapY = enemyTrapX;
					if(!enemyInTrap) {
						//controller.PacketManager.chat("in");
						enemyInTrap = true;
					}
					enemyTrapId = enemyTrapY[Sploop.props.id];
					break
				}
			}
			if (!enemyTrapY && enemyInTrap) {
				enemyTrapId = null;
				enemyInTrap = false;
			}
			// ENEMY INTRAP
			///////////////////////////////////
			// SPIKENEAR
			nearSY = null
			for (let i = 0; i < Sploop.saves.entityList()[ELayer.HARDSPIKE].length; i++) {
				const nearS2 = Sploop.saves.entityList()[ELayer.HARDSPIKE][i];
				if (nearS2 && nearS2[Sploop.props.ownerID] !== Sploop.myPlayer.ownerID && !teammates.includes(nearS2[Sploop.props.ownerID]) && Math.hypot(nearS2[Sploop.props.x] - Sploop.myPlayer.x, nearS2[Sploop.props.y] - Sploop.myPlayer.y) <= 125) {
					nearSY = nearS2;
					if(!nearS) {
						nearS = true;
					}
					if(nearS && inTrap && A_BS) {
						let spikeangle = Math.atan2(nearSY[Sploop.props.y] - Sploop.myPlayer.y, nearSY[Sploop.props.x] - Sploop.myPlayer.x);
						Sploop.controller.PacketManager.attack(spikeangle);
						bS = true;
					}
					nearSID = nearSY[Sploop.props.id];
					break
				}
			}
			if (!nearSY && nearS) {
				bS = false;
				nearSID = null;
				nearS = false;
			}
			// SPIKENEAR
			//////////////////////////////////
			// AUTOPUSH
			for (let i = 0; i < Sploop.saves.entityList()[ELayer.HARDSPIKE].length; i++) {
				const spikex = Sploop.saves.entityList()[ELayer.HARDSPIKE][i];
				if (spikex && spikex[Sploop.props.ownerID] === Sploop.myPlayer.ownerID && !teammates.includes(spikex[Sploop.props.ownerID]) && Math.hypot(spikex[Sploop.props.x] - nearest.x, spikex[Sploop.props.y] - nearest.y) <= 130) {
					//spikeNear = true;
					//const pushAngle = EntityManager.angle(nearest, spikex);
					/*
                    let pAngle = EntityManager.angle(nearest, spikex);
                    let distance = fgdo(nearest, spikex) + 70;
                    let position = { x: spikex[Sploop.props.x] + (distance * Math.cos(pAngle)), y: spikex[Sploop.props.y] + (distance * Math.sin(pAngle)) };

                    let distance2 = fgdo(position, Sploop.myPlayer);
                    let pushAngle = Math.atan2(spikex[Sploop.props.y] - nearest.y, spikex[Sploop.props.x] - nearest.x);
                    let pushAngle2 = Math.atan2(spikex[Sploop.props.y] + (distance * Math.cos(pAngle)) - Sploop.myPlayer.y, spikex[Sploop.props.x] + (distance * Math.sin(pAngle)) - Sploop.myPlayer.x); // distance2 > 40
                    let pushAngle3 = Math.atan2(Sploop.myPlayer.y - nearest.y, Sploop.myPlayer.x - nearest.x); // else

                   */
					const nEA = EntityManager.angle(Sploop.myPlayer, nearest);
					let distance3 = fgdo(nearest, Sploop.myPlayer);
					if(enemyInTrap && !inTrap && distance3 <= 250) {
						//controller.PacketManager.moveAngle(nEA + Math.atan2(nearest.y - (Sploop.myPlayer.y - spikex[Sploop.props.y]), nearest.x - (Sploop.myPlayer.x - spikex[Sploop.props.x])));
					}
				} /*else if(spikex && spikex[Sploop.props.ownerID] === Sploop.myPlayer.ownerID && !teammates.includes(spikex[Sploop.props.ownerID]) && Math.hypot(spikex[Sploop.props.x] - nearest.x, spikex[Sploop.props.y] - nearest.y) > 130) {
                    spikeNear = false; // just something
                    break
                }*/
			}
			// AUTOPUSH
			//////////////////////////////////
			// ANTIBOOST
			for (let i = 0; i < Sploop.saves.entityList()[ELayer.BOOST].length; i++) {
				const spikex = Sploop.saves.entityList()[ELayer.BOOST][i];
				if (spikex && spikex[Sploop.props.ownerID] !== Sploop.myPlayer.ownerID && !teammates.includes(spikex[Sploop.props.ownerID]) && Math.hypot(spikex[Sploop.props.x] - nearest.x, spikex[Sploop.props.y] - nearest.y) <= 55) {
					const nEA = EntityManager.angle(Sploop.myPlayer, nearest);
					let distance = fgdo(nearest, Sploop.myPlayer);
					if(!enemyInTrap && !inTrap && A_BO && distance < 333) {
						controller.PacketManager.chat(Math.atan2(spikex[Sploop.props.y] - Sploop.myPlayer.y, spikex[Sploop.props.x] - Sploop.myPlayer.x) + "a:" + nEA);
						controller.place(ItemType.TRAP, nEA, PlacementType.INVISIBLE);
					}
				}
			}
			// ANTIBOOST
			//////////////////////////////////
			// AUTOPLACE
			if(A_P) {
				if(A_P && distance > 177) {
					return
				}
				if (A_P && distance <= 160 && enemyInTrap) {
					/*
					controller.PacketManager.changeAngle(controller.mouse.angle);
					controller.place(ItemType.SPIKE, nEA + fgdo(nearest, Sploop.myPlayer) / fgdo(nearest, Sploop.myPlayer) + 0.2, PlacementType.INVISIBLE);
					controller.PacketManager.changeAngle(controller.mouse.angle);
					controller.place(ItemType.SPIKE, nEA - fgdo(nearest, Sploop.myPlayer) / fgdo(nearest, Sploop.myPlayer) + 0.2, PlacementType.INVISIBLE);
					controller.PacketManager.changeAngle(controller.mouse.angle);
					log(nEA + fgdo(nearest, Sploop.myPlayer) / fgdo(nearest, Sploop.myPlayer) + " + ");
					log(nEA - fgdo(nearest, Sploop.myPlayer) / fgdo(nearest, Sploop.myPlayer) + " - ");
					*/
					controller.PacketManager.changeAngle(controller.mouse.angle);
					controller.place(ItemType.SPIKE, nEA + random(Math.PI / 1.78, Math.PI / 6.32), PlacementType.INVISIBLE);
					controller.PacketManager.changeAngle(controller.mouse.angle);
					controller.place(ItemType.SPIKE, nEA - random(Math.PI / 1.78, Math.PI / 6.32), PlacementType.INVISIBLE);
					controller.PacketManager.changeAngle(controller.mouse.angle);
				} else {
					controller.PacketManager.changeAngle(controller.mouse.angle);
					controller.place(ItemType.TRAP, EntityManager.angle(Sploop.myPlayer, nearest), PlacementType.INVISIBLE);
					controller.PacketManager.changeAngle(controller.mouse.angle);
				}
			}
			// AUTOPLACE
			//////////////////////////////////
			// AUTOATTACK
			const previousWeapon = controller.weapon;
			if (A_A && EntityManager.inWeaponRange(Sploop.myPlayer, nearest, controller.itemBar[0]) && !inTrap) {
				window.equip(5);
				controller.whichWeapon(false);
				controller.attack(EntityManager.angle(Sploop.myPlayer, nearest));
				controller.whichWeapon(previousWeapon);
				controller.PacketManager.stopAttack();
				//controller.PacketManager.chat(`Attacking ${controller.playerList[nearest.ownerID][Sploop.props.name]}`)
				if(nearest.health <= 30) {
					window.equip(2);
					controller.whichWeapon(false);
					controller.attack(EntityManager.angle(Sploop.myPlayer, nearest));
					controller.whichWeapon(previousWeapon);
					controller.PacketManager.stopAttack();
				}
			}
			// AUTOATTACK
			//////////////////////////////////
			// AUTOINSTA
			if(A_R) {
				if(nearest.hat != 6 && nearest.hat != 4 && nearest.health <= 65 && EntityManager.inWeaponRange(Sploop.myPlayer, nearest, controller.itemBar[0]) && !inTrap && !controller.autoattack && !controller.attacking) {
					const previousWeapon = controller.weapon;
					let previousHat;
					previousHat = Sploop.myPlayer.hat
					controller.whichWeapon(false);
					window.equip(2);
					controller.attack(EntityManager.angle(Sploop.myPlayer, nearest));
					controller.PacketManager.stopAttack();
					controller.whichWeapon(previousWeapon);
					controller.PacketManager.changeAngle(controller.mouse.angle);
					if(!inTrap && !Settings.aetoggle) {
						controller.mousemove = true;
					}
					setTimeout(() => {
						if (Sploop.myPlayer.hat != previousHat && Sploop.myPlayer.hat == 2) window.equip(previousHat)
					}, 1300);
				}else if(nearest.health <= 65 && EntityManager.inWeaponRange(Sploop.myPlayer, nearest, controller.itemBar[0]) && !inTrap && !controller.autoattack && !controller.attacking){
					const previousWeapon = controller.weapon;
					controller.whichWeapon(false);
					controller.attack(EntityManager.angle(Sploop.myPlayer, nearest));
					controller.PacketManager.stopAttack();
					controller.whichWeapon(previousWeapon);
					controller.PacketManager.changeAngle(controller.mouse.angle);
				}
			};
			// AUTOINSTA
			//////////////////////////////////
		}, 40);
		/////////////////// MAIN INTERVAL END
		//----------------------------------------------------------------------//
		/////////////////// AUTOPPLAY INTERVAL START - antiinsta
		setInterval(() => {
			// ANTIINSTA
			let distance = fgdo(nearest, Sploop.myPlayer);
			const nearest = EntityManager.enemies()[0];
			if (A_I && nearest.currentItem != undefined && nearest.currentItem == 29 && Sploop.myPlayer.health === 60 && distance < 310) {
				window.equip(6);
				//controller.PacketManager.chat("anti-insta");
			}
			// ANTIINSTA
			//////////////////////////////////
			/*
            // << BOT TEST >>
            let distance = fgdo(nearest, Sploop.myPlayer);
            const nearest = EntityManager.enemies()[0];
            const nEA = EntityManager.angle(Sploop.myPlayer, nearest);
            const previousWeapon = controller.weapon;
            if(BOT) {
                controller.PacketManager.moveAngle(EntityManager.angle(Sploop.myPlayer, nearest));
            }
            */// << BOT TEST >>
		});
		/////////////////// AUTOPPLAY INTERVAL END - antiinsta
        const Sploop = window.Sploop;
        Storage["delete"]("_adIds");
        Object.freeze(Array.prototype);
        window.alert = function() {};
        Object.defineProperty(Object.prototype, "region", {
            get: () => Settings.connectTo,
            set: () => true,
            configurable: true
        });
        window.eval = new Proxy(window.eval, {
            apply(target, _this, args) {
                const code = args[0];
                if (code.length > 1e5) {
                    args[0] = modules_applyHooks(code);
                    window.eval = target;
                    target.apply(_this, args);
                    load();
                    return;
                }
                return target.apply(_this, args);
            }
        });

        const load = () => {
            const canvas = document.querySelector("#game-canvas");
            const gridToggle = document.querySelector("#grid-toggle");
            const displayPingToggle = document.querySelector("#display-ping-toggle");
            const itemMarkerToggle = document.querySelector("#native-helper-toggle");
            const hat_menu_content = document.querySelector("#hat_menu_content");
            if (gridToggle.checked) gridToggle.click();
            ///if (!displayPingToggle.checked) //displayPingToggle.click();
            ///if (itemMarkerToggle.checked) itemMarkerToggle.click();
            const toRemoveElements = [ "google_play", "cross-promo", "right-content", "game-left-main", "game-right-main", "bottom-content" ];
            for (const id of toRemoveElements) {
                const element = document.getElementById(id);
                if (element !== null) {
                    element.style.display = "none";
                }
            }
            window.onkeydown = null;
            window.onkeyup = null;
            if (canvas.onmousedown && canvas.onmouseup) {
                const mousedown = canvas.onmousedown.bind(canvas);
                const mouseup = canvas.onmouseup.bind(canvas);
                canvas.onmousedown = null;
                canvas.onmouseup = null;
                canvas.addEventListener("mousedown", (event => {
                    if (event.button !== 0) return;
                    mousedown(event);
                }));
                canvas.addEventListener("mouseup", (event => {
                    if (event.button !== 0) return;
                    mouseup(event);
                }));
            }
            new MutationObserver((mutations => {
                if (!controller.inGame || isInput()) return;
                for (let i = 0; i < mutations.length; i++) {
                    if (mutations[i].target.textContent === "UNEQUIP") {
                        controller.actualHat = i + 1;
                        break;
                    }
                }
            })).observe(hat_menu_content, {
                childList: true,
                subtree: true
            });
            window.addEventListener("keydown", (event => controller.handleKeydown(event, event.code)));
            window.addEventListener("keyup", (event => controller.handleKeyup(event, event.code)));
            canvas.addEventListener("mousedown", (event => controller.handleKeydown(event, event.button)));
            canvas.addEventListener("mouseup", (event => controller.handleKeyup(event, event.button)));
            modules_zoomHandler();

              class Weapon {
  constructor(range, xOffset, yOffset, animType) {
    this.range = range;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.animType = animType;
  }
};
const animTypes = { HIT: 0, MOVING: 1, RANGE: 2 };
const toolHammerStats = new Weapon(80, 40, 50, animTypes.HIT);
const daggerStats = new Weapon(80, 5, 40, animTypes.HIT);
const swordStats = new Weapon(135, 40, 56, animTypes.HIT);
const katanaStats = new Weapon(140, 30, 48, animTypes.HIT);
const naginataStats = new Weapon(165, 42, 47, animTypes.HIT);
const spearStats = new Weapon(160, 35, 47, animTypes.HIT);
const greatAxeStats = new Weapon(94, 32, 43, animTypes.HIT);
const axeStats = new Weapon(90, 37, 47, animTypes.HIT);
const stickStats = new Weapon(100, 40, 45, animTypes.HIT);
const batStats = new Weapon(115, 5, 37, animTypes.HIT);
const memeStats = new Weapon(115, -12, 10, animTypes.HIT);
const scytheStats = new Weapon(160, 20, 50, animTypes.HIT);
const bowStats = new Weapon(865, 23, 65, animTypes.RANGE);
const xBowStats = new Weapon(865, 18, 65, animTypes.RANGE);
const musketStats = new Weapon(1065, 27, 100, animTypes.RANGE);
const pearlStats = new Weapon(765, -7, 37, animTypes.RANGE);
const shieldStats = new Weapon(55, 24, 62, animTypes.MOVING);
const hammerStats = new Weapon(80, 33, 45, animTypes.HIT);
const weaponsList = {
  stone_toolhammer: toolHammerStats, g_toolhammer: toolHammerStats, d_toolhammer: toolHammerStats, r_toolhammer: toolHammerStats,
  s_dagger: daggerStats, g_dagger: daggerStats, d_dagger: daggerStats, r_dagger: daggerStats,
  stone_sword: swordStats, katana: katanaStats, g_katana: katanaStats, d_katana: katanaStats, c_katana: katanaStats,
  cut_spear: naginataStats, g_cutspear: naginataStats, d_cutspear: naginataStats,
  stone_spear: spearStats, g_spear: spearStats, d_spear: spearStats,
  great_axe: greatAxeStats, g_great_axe: greatAxeStats, d_great_axe: greatAxeStats,
  stone_axe: axeStats, g_axe: axeStats, d_axe: axeStats,
  stick: stickStats, g_stick: stickStats, d_stick: stickStats, r_stick: stickStats,
  bat: batStats, meme: memeStats, scythe: scytheStats,
  bow: bowStats, Xbow: xBowStats, s_musket: musketStats, pearl: pearlStats,
  shield: shieldStats, hammer: hammerStats
};

const canvasPrototype = CanvasRenderingContext2D.prototype;
canvasPrototype.drawImage = new Proxy(canvasPrototype.drawImage, {
  apply(sourceFunction, that, callingArguments) {
    const [image, x, y, width, height] = callingArguments;
    if(typeof image.src == "string") {
      const weaponName = image.src.split("/")[5].replace(/\.png.+?$/, "");
      const weapon = weaponsList[weaponName];

      if(weapon && (height != 100 || width !== 100)) {
        if(weapon.animType == animTypes.RANGE) {
          that.beginPath();
          that.strokeStyle = "#ab0000";
          that.moveTo(x + weapon.xOffset + 30, y + weapon.yOffset);
          that.lineTo(x + weapon.xOffset + weapon.range, y + weapon.yOffset);
          that.stroke();
          that.closePath();
        } else {
          that.beginPath();
          that.save();
          that.translate(x + weapon.xOffset, y + weapon.yOffset);
          that.rotate(weapon.animType == animTypes.HIT ? window.hitAngle : 0);
          that.fillStyle = "#78025e";
          that.strokeStyle = "#78025e";
          that.arc(0, 0, weapon.range, -17*Math.PI/30, 17*Math.PI/30);
          that.lineTo(30, 0);
          that.lineTo(Math.cos(17*Math.PI/30) * weapon.range, -Math.sin(17*Math.PI/30) * weapon.range);
          that.stroke();
          that.globalAlpha = 0.1;
          that.fill();
          that.globalAlpha = 0;
          that.restore();
          that.closePath();
        };
      };
    };

    return sourceFunction.apply(that, callingArguments);
  }
});

window.hitAngle = 0;
const proto = Object.prototype;
window.addEventListener("load", function() {
  proto.__defineSetter__("value", function(val) {
      return this.val = val;
  });
  proto.__defineGetter__("value", function() {
      return window.hitAngle = this.val;
  });
});

               const menuKey = 'Escape';

    const keybindsMenu = document.createElement('div');
    keybindsMenu.style.position = 'absolute';
    keybindsMenu.style.top = '50%';
    keybindsMenu.style.left = '50%';
    keybindsMenu.style.transform = 'translate(-50%, -50%)';
    keybindsMenu.style.width = '300px';
    keybindsMenu.style.height = '200px';
    keybindsMenu.style.background = '#AAE496';
    keybindsMenu.style.color = 'white';
    keybindsMenu.style.zIndex = '9999';
    keybindsMenu.style.display = 'none';
    keybindsMenu.setAttribute('id', 'keybindsMenu');

    const title = document.createElement('div');
    title.textContent = 'Commands';
    title.style.padding = '10px';
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    keybindsMenu.appendChild(title);

    const bind1 = document.createElement('div');
    bind1.textContent = '!md -am = off/on AutoMills';
    bind1.style.padding = '5px';
    bind1.style.cursor = 'pointer';
    bind1.addEventListener('click', () => {
        // Handle bind 1 action
    });
    keybindsMenu.appendChild(bind1);

    const bind2 = document.createElement('div');
    bind2.textContent = '!md -ab = off/on Autobreak';
    bind2.style.padding = '5px';
    bind2.style.cursor = 'pointer';
    bind2.addEventListener('click', () => {
        // Handle bind 2 action
    });
    keybindsMenu.appendChild(bind2);

    const bind3 = document.createElement('div');
    bind3.textContent = '!md -at = off/on AntiTrap';
    bind3.style.padding = '5px';
    bind3.style.cursor = 'pointer';
    bind3.addEventListener('click', () => {
        // Handle bind 3 action
    });
    keybindsMenu.appendChild(bind3);

    const bind4 = document.createElement('div');
    bind4.textContent = '!md -ap = off/on AutoPlacer';
    bind4.style.padding = '5px';
    bind4.style.cursor = 'pointer';
    bind4.addEventListener('click', () => {
        // Handle bind 4 action
    });
    keybindsMenu.appendChild(bind4);

    const bind5 = document.createElement('div');
    bind5.textContent = '!md -ah = off/on Autoheal';
    bind5.style.padding = '5px';
    bind5.style.cursor = 'pointer';
    bind5.addEventListener('click', () => {
        // Handle bind 5 action
    });
    keybindsMenu.appendChild(bind5);

    const bind6 = document.createElement('div');
    bind5.textContent = 'Ну короче команды сами чекните в коде мне лень писать ^_^';
    bind5.style.padding = '5px';
    bind5.style.cursor = 'pointer';
    bind5.addEventListener('click', () => {
        // Handle bind 6 action
    });
    keybindsMenu.appendChild(bind6);


    document.body.appendChild(keybindsMenu);

    document.addEventListener('keydown', (event) => {
        if (event.key === menuKey) {
            if (keybindsMenu.style.display === 'none') {
                keybindsMenu.style.display = 'block';
            } else {
                keybindsMenu.style.display = 'none';
            }
        }
    });

        };
    })();
}).toString() + `)(${JSON.stringify(GM_info)});`)();

(function() {
    'use strict'

 alert('!q  !r');
!~function(
$ = document.querySelector.bind(document),
 botID = 0,
 bots = [],
 isBot = (window.location !== window.parent.location),
 playerID, playerX, playerY,
 ownerX, ownerY,
 touchStart = {x: 0, y: 0},
 keys = {}, weaponKey = "1"
) {

    class Sploop {
        static newKeyEvent(type) {
            return function (eventObj) {
                const { key, code } = eventObj;
                window.KeyboardEvent = Object;
                window.getEvents(type)[type == "keydown" ? 1 : 0].listener({key: key, code: code, isTrusted: 1, target: document.body, preventDefault: () => null});
                window.KeyboardEvent = KeyboardEvent;
            };
        }
        static key = {
            down: this.newKeyEvent("keydown"),
            up: this.newKeyEvent("keyup"),
            press(eventObj) {
                Sploop.newKeyEvent("keydown")(eventObj);
                Sploop.newKeyEvent("keyup")(eventObj);
            }
        };
        static foodPlace() {
            //alert("QQQ")
            this.key.press({code: "KeyQ"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static spikePlace() {
            //alert("QQQ")
            this.key.press({code: "KeyR"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static trapPlace() {
            //alert("QQQ")
            this.key.press({code: "KeyF"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static newTouchEvent = function(type) {
            return function (eventObj) {
                const { x, y, id } = eventObj;
                $("#game-canvas").getEvents(type)[0].listener({changedTouches: [{identifier: id, pageX: x, pageY: y}], preventDefault: () => null, stopPropagation: () => null});
            };
        };
        static touch = {
            start: this.newTouchEvent("touchstart"),
            move: this.newTouchEvent("touchmove"),
            end: this.newTouchEvent("touchend")
        }

        static spawn(name) {
            $("#nickname").value = name;
            $("#play").getEvents("click")[0].listener();
            $("#nickname").value = localStorage.getItem("nickname")||"";
        };

        static changeServer(serverID) {
            $("#server-select").options[0].setAttribute("region", serverID)
            $("#server-select").selectedIndex = 0;
            $("#server-select").getEvents("change")[0].listener();
        };
    };
    window.Sploop = Sploop;


    window.addEventListener("load", ()=> (Object.keys(window.getEvents()).length === 0) && (window.onbeforeunload && (window.onbeforeunload = null), window.location.reload()));

    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function() {
        if(!isBot) {
            for(let bot of bots) {
                /*
				ko: 11, //somethingOnBegin
				Uo: 6, //moveByBitmask
				yo: 13, //changeAIM
				Eo: 2, //selectItemByID
				Bo: 19, //attack
				Co: 18, //stopAttack
				zo: 10, //spawn
				Do: 20, //scytheUpgrade
				xo: 0, //selectItemByType
				Lo: 5,//equipHat
				Fo: 7, //sendChat
				Oo: 14, //upgrade
				jo: 12, //noting
				So: 3, //pingStuff
				Po: 23, //autoHit
				Vo: 1, //moveToDir
				No: 15, //removeMoveDir
				Ho: 9, //touchStart
				Wo: 4, //noting
				Go: 8, //touchEnd
				Qo: 24, //leaveClan
				Yo: 21, //joinInClan
				qo: 17, //acceptDecline
				Zo: 25, //kick
				Xo: 22, //createClan
				*/
                if(![22, 25, 17, 3, 10, 11].includes(arguments[0][0])) (bot.contentWindow.ws || this)._send(...arguments);
            }
        }
        this._send(...arguments);
        if(this.HOOKED) return;
        this.HOOKED = true;
        window.ws = this;
        var botSpwned = false;
        function chat(t) {
   const packet = [7, ...new TextEncoder().encode(t)];
   window.ws.send(new Uint8Array(packet));
}

document.addEventListener('keydown', e => {
    if (e.key === 'g') {
        chat('Sub To Cubic Flex!!!')
    }
});
this.addEventListener("message", (msg)=>{
            const d = ("string" != typeof msg.data ? new Uint8Array(msg.data) : JSON.parse(msg.data))
            if(d[0] == 35) {
                if(isBot && !playerID) Sploop.touch.start({id: 1000, x: innerWidth/4, y: innerHeight/2})
                playerID = d[1];
            }
            if(d[0] == 20) {
                for(let i = 1; i < d.byteLength; i += 18) {
                    const id = d[i + 2] | d[i + 3] << 8;
                    const x = d[i + 4] | d[i + 5] << 8;
                    const y = d[i + 6] | d[i + 7] << 8;
                    if(playerID == id) {
                        playerX = x;
                        playerY = y;
                        if(!isBot) {
                            for(let bot of bots) bot.isLoaded && bot.contentWindow.updateOwnerPosition(x, y);
                        }
                    }
                }
                if(isBot) {
                    !botSpwned && (Sploop.spawn( "78498456456945697", (botSpwned=1)))
                }
            }
        });
        if(!isBot) {
            this.rg = this.url.split("//")[1].split(".sploop")[0].toLocaleUpperCase();
            for(let bot of bots) {
                bot.contentWindow.changeServer(this.rg);
            }
        }
    }

    isBot && (
        window.onload = ()=> initBot(),
        Object.defineProperty(Object.prototype, "region", {
            get: () => window.ownerServer,
            set: () => true,
            configurable: true
        })
    );
    function initBot() {

        window.changeServer = function(serverID) {
            Sploop.changeServer(serverID);
        };

        window.updateOwnerPosition = function(x, y) {
            ownerX = x;
            ownerY = y;
        }

        setInterval(()=>{
            const angle = Math.atan2(ownerY - playerY, ownerX - playerX);
            if (Math.sqrt(Math.pow(((playerX - ownerX)), 2) + Math.pow(((playerY - ownerY)), 2)) > 185) {
                Sploop.touch.start({id: 1000, x: innerWidth/4, y: innerHeight/2})
                Sploop.touch.move({id: 1000, x: innerWidth/4+50*Math.cos(angle), y: innerHeight/2+50*Math.sin(angle)});
            }else{
                Sploop.touch.end({id: 1000, x: innerWidth/4, y: innerHeight/2})
            }
        });

        const onDeathCallback = function(changedList) {
            const display = changedList[0].target.style.display;
            if(display == "flex") Sploop.spawn("75846564465654");
        };
        const deathChecker = new MutationObserver(onDeathCallback);
        deathChecker.observe($("#homepage"), {attributes: true, attributeFilter: ["style"]});
    };




    !isBot && (window.onload = ()=> initClient());
    function initClient() {

        function createBot(id) {
            const div = document.createElement("div");
            div.innerHTML = `<iframe id="bot${id}" src="https://sploop.io" width="300" height="600" frameborder="0" scrolling="no" allowfullscreen="true" style="width: 300px; height: 200px; margin: 0; padding: 0; border: 0; position: absolute; top: 0; left: 0"></iframe>`;
            const iframe = div.firstChild;
            document.body.append(iframe);
            iframe.contentWindow.ownerServer = $("#server-select").selectedOptions[0].getAttribute("region");
            iframe.onload = ()=>{iframe.isLoaded = true};
            return iframe;
        };
        let placementkeys = {
            spike: false,
            trap: false
        };
        setInterval(() => {
        if(placementkeys.spike) Sploop.spikePlace()
        if(placementkeys.trap) Sploop.trapPlace()
        }, 20);
        window.addEventListener("keydown", function(e) {
            if(e.code == "KeyV") placementkeys.spike = true;
            if(e.code == "KeyF") placementkeys.trap = true;
            if(!keys[e.keyCode]) {
                keys[e.keyCode] = 1;
                if(e.code == "Enter" && window.chat && window.chat.value != '') {
                    if(window.chat.value == "!q") bots.push(createBot(bots.length))
                    if(window.chat.value == "!r") {
                        for(let bID in bots) $(`#bot${bID}`).remove()
                        bots.length = 0
                    }
                    if(window.chat.value.split(" ")[0] == "/close") {
                        const id = window.chat.value.split(" ")[1] - 1
                        if(!bots[id]) return;
                        $(`#bot${id}`).remove()
                        for(let bID in bots) {
                            if(bID > id && bID != id) $(`#bot${bID}`).id = `bot${bID-1}`
						}
                        bots.splice(id, 1)
                    }
                }
            }
        });
        document.addEventListener("keyup", (e) => {
            if(e.code == "KeyV") placementkeys.spike = false;
            if(e.code == "KeyF") placementkeys.trap = false;
            if(keys[e.keyCode]) {
                keys[e.keyCode] = 0;
            };
        });
    };

    (function autoHeal() {
        let allies = [], hp;
        const { fillRect, clearRect } = CanvasRenderingContext2D.prototype;
        CanvasRenderingContext2D.prototype.clearRect = function () {
            if (this.canvas.id === "game-canvas") allies = [];
            return clearRect.apply(this, arguments);
        };

        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
            if(this.fillStyle == "#a4cc4f") {
                allies.push({x: x + 45, y: y - 70, hp: Math.round((width / 95) * 100)});
                if(allies.length == 1) hp = allies[0].hp;
            }
            fillRect.apply(this, arguments);
        };

        window.addEventListener("keydown", function(e) {
            if(["1", "2"].includes(e.key)) weaponKey = e.key;
        });

        function ah() {
            function getDelay(hp) {
                var delay = 200;
                if(hp < 90) delay = 130;
                if(hp < 74) delay = 60;
                if(hp < 36) delay = 45;
                return delay;
            };
            if(hp < 100) Sploop.foodPlace();
            setTimeout(()=>{ah()}, getDelay(hp));
        }
        ah();
    })();

    (function hookEvents() {
        _setTimeout = setTimeout; console._log = console.log; KeyBoardEvent = KeyboardEvent;
        EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(event, handler, c) {
            if (c==undefined) c=false;
            this._addEventListener(event,handler,c);
            if (!this.eventListenerList) this.eventListenerList = {};
            if (!this.eventListenerList[event]) this.eventListenerList[event] = [];
            this.eventListenerList[event].push({listener:handler,options:c});
        };
        EventTarget.prototype.getEvents = function(event) {
            if (!this.eventListenerList) this.eventListenerList = {};
            if (event==undefined) return this.eventListenerList;
            return this.eventListenerList[event];
        };

        let array = [HTMLElement.prototype, window, document];
        for(let obj of array) {
            for(let prop in obj) {
                if(!prop.startsWith("on")) continue;
                Object.defineProperty(obj, prop, {
                    get() {
                        return this["_" + prop];
                    },
                    set(value) {
                        this["_" + prop] = value;
                        if(prop == "onbeforeunload") return value;
                        this.addEventListener(prop.split("on")[1], value);
                    }
                });
            }
        }
    })();
}()
})();