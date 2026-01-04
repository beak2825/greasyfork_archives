// ==UserScript==
// @name         Trigger
// @namespace    http://tampermonkey.net/
// @version      0.8.9
// @description  Trigger SB
// @author       Nanoray / Halcyon
// @match        https://starblast.io/
// @run-at       document-start
// @icon         https://i.ibb.co/7RGPxhp/icon.png
// @license      Copyright © 2024 halcyonXT All Rights Reserved. Reproduction, modification and reposting of the contents of this script is strictly prohibited
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514077/Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/514077/Trigger.meta.js
// ==/UserScript==

// why is the code messy? i never expected the client to get even a fraction of this size


const __DOC_DEF = `<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Liter&display=swap');*{user-select:none;-webkit-user-drag:none;-moz-user-select:none}:root{--bt-wd:33rem}body{height:100dvh;width:100vw;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#000}.hdr{width:max-content;font-family:Garamond,serif;color:#000;font-size:5rem;margin:0;padding:0;text-shadow:#fff 1px 0 0,#fff 0 1px 0,#fff 1px 1px 0,#fff -1px 0 0,#fff -1px -1px 0,#fff 1px -1px 0,#fff -1px 1px 0,#fff 0 -1px 0}.sib{width:var(--bt-wd);height:.5rem;box-sizing:border-box;border:1px solid #fff;border-radius:.2rem;margin-top:-.5rem;background:repeating-linear-gradient(-45deg,#000 0 15px,#fff 0 20px) left/200% 100%;animation:l3 6s infinite linear}.p-head{display:none;color:#fff;box-sizing:content-box;min-width:var(--bt-wd);max-width:var(--bt-wd);text-align:center;font-size:2rem;font-family:'Bebas Neue',sans-serif;margin:0;padding:.7rem 0 0 0;border-top:1px solid #fff;text-transform:uppercase}.p-sub{display:none;color:rgba(255,255,255,.5);max-width:var(--bt-wd);text-align:center;font-size:1rem;font-family:'Bebas Neue',sans-serif;margin:.25rem 0 0 0;padding:0;text-transform:uppercase}@keyframes l3{100%{background-position:right}}</style><title>TRIGGER</title></head><body><h1 class="hdr">TRIGGER</h1><div class="sib"></div><p class="p-head"></p><p class="p-sub"></p></body></html>`;
const log = (type="no-type", message) => {
    let color = "#ffffff", header = "Unspecified";
    switch(type) {
        case "no-type":
            header = "No type";
            color = "#cccccc";
            break;
        case "debug":
            header = "Debug";
            color = "#c91cbb";
            break;
        case "info":
            header = "Info";
            color = "#1e99d6";
            break;
        case "warn":
            header = "Warn";
            color = "#e3dc12";
            break;
        case "error":
        case "err":
            header = "Error";
            color = "#ff0000";
            break;
        case "severe":
            color = "#990000";
            header = "Severe";
            break;
    }
    //console.log(color);
    return console.log(`%c[TRIGGER](${header}) ${message}`, "color: " + color + "; font-weight: bold; font-size: 1.2rem; font-family: var(--def-font); font-weight: bold;");
}
const DEBUG_MODE = true;

document.open();
document.write(__DOC_DEF);
document.close();

window.deleteThis = null;

const loadJobs = {
    current: null,
    completed: [],
}
const announceLoadJob = async (text) => {}
//     let phead = document.querySelector(".p-head");
//     let psub = document.querySelector(".p-sub");
//     if (!phead || !psub) return DEBUG_MODE ? log("debug", "Failed to announce load job: " + text) : null;
//     if (loadJobs.current) {
//         loadJobs.completed.push(loadJobs.current);
//     } else {
//         phead.style.display = "block";
//         phead.marginTop = "20px";
//         psub.style.display = "block";
//     }
//     loadJobs.current = text;
//     phead.innerText = text;
//     psub.innerText = loadJobs.completed.join("\n");
//     //return await new Promise(r => setTimeout(r, 2000));
// }
const LS_PREFIX = "TRIGGER_";
// const LocalStorage = {
//     items: {},

//     _load: function() {
//         keys: [
//             LS_PREFIX + ""
//         ]
//     },

//     get: function(marker) {
//         if (this.items.hasOwnProperty(marker)) {
//             return this.items[marker];
//         }
//         let item = localStorage.getItem(marker);
//         this.items[marker] = item;
//         return item;
//     },

//     set: function(marker, value) {
//         this.items[marker] = value;

//     }
// }

window.pointLightSettings = {
    requiresShutdown: false,
    updateRate: 30, // per second - the lower the better obv
    updateTime: null,
    updateTimestamp: null,
    maxIntensity: 1.8,
    maxDamageIntensityMult: 150,
    distance: 18,
    intensityEpsilon: 0.32 // .45
}
window.offsetcoord = 55;
window.offsetnumX = 0;
window.offsetnumY = 0;
window.mousemovePollingRate = 2000; // per second
window.pointLightSettings.updateTime = 1000 / window.pointLightSettings.updateRate;
window.pointLightSettings.updateTimestamp = window.pointLightSettings.updateTime;
window.pointLights = {
    // ...
}
window._envMaps = {
    requiresUpdate: true,
    // ...
};
window._videoBadgeInfo = {
    timerSet: false,
    "_vid_example": {
        steps: 3
    },
    players: {
        //...
    }
}
window._player = {
    data: {},
    ping: 0
}
window._angleRefreshRate = 240;
window._angleRefreshTime = 1000 / window._angleRefreshRate;
window._angleTimestamp = 0;
window._lastLine = null;
window._lastMaterial = null;
window._scoreboardUpdater = {
    timer: null,
    latest: null,
    interval: 50
};
window._crashCount = 0;
window._crashLimit = 3;
window.deathScene = {
    follow: false,
    id: null
}
window._tr_textures = {
    compiled: {},
    "ping_warning": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_warning.png`,
    "ping_ping": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping.png`,
    "ping_push": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_push.png`,
    "ping_attack": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_attack.png`,
    "ping_defend": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_defend.png`,
}
window._tr_audio = {
    compiled: {},
    notification:        `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/notification.mp3`,
    hit:                 `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/Low%20Metal%20Impact%20(Hit)%20-%20Sound%20Effect.mp3`,
    kill:                `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/kill-sfx.mp3`,
    death:               `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/death-sfx.mp3`,
    "ping_warning":      `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_warning.mp3`,
    "ping_ping":      `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_ping.mp3`,
    "ping_attack":      `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_attack.mp3`,
    "ping_defend":      `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_defend.mp3`,
    "ping_push":      `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_push.mp3`,
    "soundboard_kys":    `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_kys.mp3`,
    "soundboard_wtsgm":  `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_wtsgm.mp3`,
    "soundboard_longf":  `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_longf.mp3`,
    "soundboard_wait":   `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_wait.mp3`,
    "soundboard_rawr":   `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_rawr.mp3`,
    "soundboard_stroke": `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_stroke.mp3`,
    "soundboard_calf":   `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_calf.mp3`,
    "soundboard_help":   `https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/soundboard_help.mp3`,
}
window.soundboard = {
    table: {
        "I": "soundboard_kys",
        "L": "soundboard_wtsgm",
        "B": "soundboard_longf",
        "T": "soundboard_wait",
        "K": "soundboard_rawr",
        "X": "soundboard_stroke",
        "Q": "soundboard_calf",
        "H": "soundboard_help",
        // ...
    },
    usage: {
        "self": {
            muted: false,
            allowed: true,
            rendered: false,
            timers: {},
            renderUntil: 0,
        },
        // ...
    }
}
window._allMessages = [];
window._currentMessages = [];
window._positions = {
    player: {x: null, y: null},
    camera: {x: null, y: null}
}
window.addMessage = (target, msg, type = "normal") => {
    let obj = {target: target, message: msg, type: type};
    window._allMessages.push(obj);
    window._currentMessages.push(obj);
    setTimeout(() => {
        window._currentMessages.shift();
    }, 10000)
}
window.messageStreamConfig = {
    // dont put below 250
    interval: 250
}
window.isMessageFocused = false;
window._fonts = [
    ["Pixelify Sans","Retro 1"],
    ["VT323","Retro 2"],
    ["Geo","Retro 3"],
    ["Play","Default"],
    ["Afacad Flux","Modern"],
    ["Space Mono","Modern Mono"],
    ["DM Serif Text","Modern Serif"],
    ["Lexend Deca","Calm"],
    ["Delius","Cute 1"],
    ["DynaPuff","Cute 2"],
    ["Teko","Futuristic Condensed"],
    ["Share Tech Mono","Futuristic Mono"],
    ["Turret Road","Futuristic 1"],
    ["Iceberg","Futuristic 2"],
    ["Shadows Into Light","Playful"]
]
window.MESSAGE_STREAM_SYMBOLS = {
    beginStream: "ZZZ0",
    endStream: "0ZZZ",

    beginPing: "Z0Z0",
    endPing: "0Z0Z",
}
window.hasExecutedLastPing = true;
window.executePing = (x, y, type = 1, target = null) => {
    //console.log(target);
    //if (!window.hasExecutedLastPing) return;
    type = Number(type);
    if (type < 0 || type > 4) {
        return log("error", "Type not within range 0 to 4. Type: " + type);
    }

    let typeTable = {
        0: {
            name: "ping_ping",
            color: 0x00ffff,
            colorHex: "#00ffff",
            message: "."
        },
        1: {
            name: "ping_warning",
            color: 0xffff00,
            colorHex: "#ffff00",
            message: " to be cautious."
        },
        2: {
            name: "ping_attack",
            colorHex: "#ff0000",
            color: 0xff0000,
            message: " to attack."
        },
        3: {
            name: "ping_push",
            colorHex: "#ff00ff",
            color: 0xff00ff,
            message: " to push."
        },
        4: {
            name: "ping_defend",
            colorHex: "#5555ff",
            color: 0x5555ff,
            message: " to defend."
        }
    }

    let chain = "has", exportMessage = {hue: typeTable[+type]?.colorHex, name: target?.name};
    if (!target) {
        exportMessage.name = "You";
        chain = "have";
    }

    window.addMessage(exportMessage, chain + " signaled" + typeTable[type].message, "system");

    function cloneAndPlay(audio) {
        const clone = new Audio(audio.src);
        clone.play();
    }
    function popIn(sprite, duration = 300) {
        const targetScale = new THREE.Vector3(7, 7, 0);
        sprite.scale.set(0, 0, 0);
        sprite.material.transparent = true;
        sprite.material.opacity = 0;

        const start = performance.now();

        function animate(time) {
            const t = Math.min((time - start) / duration, 1);
            const ease = t * t * (3 - 2 * t); // smoothstep easing

            sprite.scale.set(
            targetScale.x * ease,
            targetScale.y * ease,
            targetScale.z * ease
            );
            sprite.material.opacity = ease;

            if (t < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    function popOut(sprite, duration = 300, onDone = null) {
        const startScale = sprite.scale.clone();
        const startOpacity = sprite.material.opacity;

        const start = performance.now();

        function animate(time) {
            const t = Math.min((time - start) / duration, 1);
            const ease = 1 - (t * t * (3 - 2 * t)); // reversed smoothstep

            sprite.scale.set(
            startScale.x * ease,
            startScale.y * ease,
            startScale.z * ease
            );
            sprite.material.opacity = startOpacity * ease;

            if (t < 1) {
            requestAnimationFrame(animate);
            } else if (onDone) {
            onDone();
            }
        }

        requestAnimationFrame(animate);
    }
    cloneAndPlay(window._tr_audio.compiled[typeTable[type].name]);
    const spriteMaterial = new refThree.SpriteMaterial({ map: window._tr_textures.compiled[typeTable[type].name], transparent: true });
    const sprite = new refThree.Sprite(spriteMaterial);

    let ringsTimer = null;
    let iconY = y + 4;

    sprite.scale.set(7, 7, 1); // adjust size as needed
    sprite.position.set(x, iconY, 0);
    sprite.renderOrder = 9999;
    sprite.material.depthTest = false;
    sprite.material.depthWrite = false;

    window.gameScene.add(sprite);
    popIn(sprite);

    ringsTimer = setInterval(() => {
        let THREE = window.refThree;
        const innerRadius = 0.9;
        const outerRadius = 1;
        const segments = 64;

        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
        const material = new THREE.MeshBasicMaterial({
        color: typeTable[type].color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
        });

        const ring = new THREE.Mesh(geometry, material);
        //ring.rotation.x = -Math.PI / 2;
        ring.scale.set(0.2, 0.2, 1);
        ring.position.set(x, y, 0);
        ring.renderOrder = 9998;
        ring.material.depthTest = false;
        ring.material.depthWrite = false;
        window.gameScene.add(ring);

        // Custom Lerp function
        const lerp = (start, end, t) => start + (end - start) * t;

        // Animation parameters
        const clock = new THREE.Clock();
        let animationTime = 0;
        let animating = true;

        function animateRing(delta) {
            const totalDuration = 0.5; // total time (seconds)
            const fadeDuration = 0.25; // fade in and out duration
            animationTime += delta;

            // Fade in (0 to 0.25s)
            if (animationTime < fadeDuration) {
                const t = animationTime / fadeDuration;
                ring.material.opacity = t;
                const scale = lerp(0.2, 1.6, t);
                ring.scale.set(scale, scale, 1);
            }
            // Fade out (0.25s to 0.5s)
            else if (animationTime < totalDuration) {
                const t = (animationTime - fadeDuration) / fadeDuration;
                ring.material.opacity = 1 - t;
                const scale = lerp(1.6, 3.2, t);
                ring.scale.set(scale, scale, 1);
            }
            // End
            else {
                ring.material.opacity = 0;
                window.gameScene.remove(ring);
                ring.geometry.dispose();
                ring.material.dispose();
                animating = false;
            }
        }


        // Main render loop
        function animate() {
            const delta = clock.getDelta();

            if (animating) {
                requestAnimationFrame(animate);
                animateRing(delta);
            }
        }

        animate();
    }, 350)

    setTimeout(() => {
        popOut(sprite, 300, () => {
            window.gameScene.remove(sprite);
            clearInterval(ringsTimer);
            ringsTimer = null;
        });
    }, 3500)
}
window.executeMessageStream = (message = "def", type = "message") => {
    if (!window._tr_conn) return log("error", "No _tr_conn for message stream");

    let denoters = null;
    switch (type) {
        case "ping":
            window.hasExecutedLastPing = false;
            denoters = {begin: window.MESSAGE_STREAM_SYMBOLS.beginPing, end: window.MESSAGE_STREAM_SYMBOLS.endPing};
            break;
        default:
            denoters = {begin: window.MESSAGE_STREAM_SYMBOLS.beginStream, end: window.MESSAGE_STREAM_SYMBOLS.endStream};
            break;

    }

    function encodeToNumbers(str) {
        return str;
        return str.split('').map(char => char.charCodeAt(0)).join(' ');
    }

    function sanitize(str) {
        let outp = str;
        for (let key of Object.keys(window.MESSAGE_STREAM_SYMBOLS)) {
            outp = outp.replaceAll(window.MESSAGE_STREAM_SYMBOLS[key], "");
        }
        return outp;
    }

    function splitStringIntoChunks(str, chunkSize = 5) {
        let result = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            result.push(str.slice(i, i + chunkSize));
        }
        return result;
    }

    let item = encodeToNumbers(message);
    let chunks = splitStringIntoChunks(sanitize(item));
    // console.log(chunks);
    // console.log(item);
    chunks.unshift(denoters.begin);
    chunks.push(denoters.end);
    // console.log(chunks)
    //chunks.push("");
    let i = 0;
    //console.log(chunks);

    let timedSender = setInterval(() => {
        if (i > chunks.length) {
            if (type === "message") {
                window.addMessage({hue: "white", name: "You"}, message);
            } else if (type === "ping") {
                setTimeout(() => {
                    window.hasExecutedLastPing = true;
                }, 200);
            }
            window._tr_conn.send(JSON.stringify({name:"say",data:" "}));
            clearInterval(timedSender);
            timedSender = null;
            return;
        }
        let data = chunks[i];
        i++
        return window._tr_conn.send(JSON.stringify({name:"say",data:data}));
    }, window.messageStreamConfig.interval)
}
window.messageStreams = {
    // ...
}
window._tr_sendMessage = null;
window.full_bright_light = null;
window.toggleAmbientLight = (active = false) => {
    if (!active) {
        if (!window.full_bright_light) return;
        window.gameScene.remove(window.full_bright_light);
        window.full_bright_light = null;
        return;
    }
    if (!window.refThree) return log("warn", "No 'three' reference in toggleAmbientLight. Skipped execution");
    if (!window.gameScene) return log("warn", "No game scene reference in toggleAmbientLight. Skipped execution");
    let light = new window.refThree.AmbientLight(0xffffff, 0.5);
    window.full_bright_light = light;
    window.gameScene.add(light);
}
const gameStartupJobs = [
    () => {
        toggleAmbientLight(window.full_bright);
    },
]
window._tr_conn = null;
window.initConn = (conn) => {
    window._tr_conn = conn;
    setTimeout(() => {
        let errors = 0, done = 0;
        for (let job of gameStartupJobs) {
            try {
                job();
                done++;
            } catch (ex) {
                console.warn(ex);
                errors++
            };
        }
        log("debug", `Finished ${done} game startup jobs. Error count: ${errors}`);
    }, 5000)
}
window.gameCamera = null;
window.gameScene = null;
window.lastMappedMousePosition = {x: 0, y: 0};

const referenceJobs = [
    (three = null) => {
        if (!three) return log("warn", "No 'three' reference in a post-reference job. Skipped execution");
        for (let key of Object.keys(window._tr_textures)) {
            if (key === "compiled") continue;
            let loader = new three.TextureLoader();
            loader.setCrossOrigin('anonymous');
            window._tr_textures.compiled[key] = loader.load(window._tr_textures[key]);
        }
    },
]
window.refThree = null;
window.initializeRefThree = (three) => {
    window.refThree = three;
    let errors = 0, done = 0;
    for (let job of referenceJobs) {
        try {
            job(three);
            done++;
        } catch(ex) {errors++};
    }
    log("debug", "Finished " + done + " post-reference jobs. Error count: " + errors);
}

let _soundboardTimer = null;
window.chatBubbleToSoundboard = (target, string) => {
    target = String(target);
    try {

        let playback = 0.4 + (Math.random() * 1.45);
        let playbackMult = 2 - playback;
        function cloneAndPlay(audio) {
            const clone = new Audio(audio.src);
            clone.playbackRate = playback;
            clone.play();
        }

        if ((typeof target !== "string") && target !== "self") {
            return log("warn", "Soundboard failure: Invalid target");
        }

        let sb = window.soundboard;
        if (target in sb.usage) {
            // change to `!sb.usage[target].allowed || sb.usage[target].muted` if you want to remove spam
            if (!sb.usage[target].allowed || sb.usage[target].muted) return 1;

        } else {
            //console.log("trigger allowed")
            sb.usage[target] = {allowed: true, muted: false, timers: {}, rendered: false, renderUntil: 0};
        }

        let validKeys = Object.keys(sb.table);

        if (typeof string !== "string") {
            return log("debug", "Soundboard: No string input");
        }
        let input = string.slice(-1);
        if (!validKeys.includes(input)) return 1;

        let audio = window._tr_audio.compiled[sb.table[input]];
        if (!audio) {
            return log("warn", "Soundboard failure: Audio not found");
        }

        const timeAllow = ~~((((+audio.duration) * 1000) / 3) / playback);
        const timeRender = ~~((((+audio.duration) * 1000)) / playback);
        const timeRenderUntil = performance.now() + timeRender;

        sb.usage[target].allowed = false;
        clearTimeout(sb.usage[target].timers["allowed"]);
        sb.usage[target].timers["allowed"] = null;
        sb.usage[target].timers["allowed"] = setTimeout(() => {
            sb.usage[target].allowed = true;
        }, timeAllow);


        if (sb.usage[target].hasOwnProperty("renderUntil") && (timeRenderUntil > sb.usage[target].renderUntil)) {
            sb.usage[target].rendered = true;
            sb.usage[target].renderUntil = timeRenderUntil;
            clearTimeout(sb.usage[target].timers["rendered"]);
            sb.usage[target].timers["rendered"] = null;
            sb.usage[target].timers["rendered"] = setTimeout(() => {
                sb.usage[target].rendered = false;
                sb.usage[target].renderUntil = 0;
            }, timeRender);
        }

        cloneAndPlay(audio);
    } catch (ex) {
        log("error", "Soundboard failure: " + ex);
        console.warn(ex);
    }
}
window.getComplementaryHue = function(hue) {
    if (typeof hue !== 'number' || hue < 0 || hue >= 360) {
        console.log("getComplementaryHue error. Hue value:");
        console.log(hue);
        hue = Number(hue);
    }
    return (hue + 0.5) % 1;
}

window._ships = [];
// window._ships.get = (id) => {
//     return
// };
window.ecpRenderer = null;

function sanitizeHTML(str) {
    if (!str || !(typeof str === "string")) return "";
    return str.replace(/[&<>"']/g, function(match) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[match];
    });
}

const Profile = {
    key: "__trigger_profile__",
    __separator: "␠",
    __data_key: "laser",
    __acknowledge_string: "␆",
    __pos_keys: {
        0: null, // gets reset to __data_key
        1: null, // gets reset to "acknowledge"
        2: "name",
        3: "profilePicture",
        4: "banner",
        5: "outline",
        6: "text",
        7: "textFillType", // 0 - solid color, 1 - gradient left to right, 2 - gradient top to bottom
        8: "textFillColor1",
        9: "textFillColor2",
        10: "font"
    },
    __pos_keys_checks: {
        0: null,
        1: null,
        2: {
            default: "Anonymous",
            check: function(str) {
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                return str.slice(0, 18);
            },
        },
        3: {
            default: function() {return Profile.assets.profilePictures["default"]},
            check: function(str) {
                // if (typeof str !== "string") return this.default();
                if (str === "default") return this.default();
                if (!str) return this.default();
                let target = Profile.assets.profilePictures[str];
                if (target) return target;
                try {
                    new URL(str);
                    return str;
                } catch (_) {
                    return this.default();
                }
            }
        },
        4: {
            default: function() {return Profile.assets.banners["default"]},
            check: function(str) {
                // if (typeof str !== "string") return this.default();
                if (str === "default") return this.default();
                if (!str) return this.default();
                let target = Profile.assets.banners[str];
                if (target) return target;
                try {
                    new URL(str);
                    return str;
                } catch (_) {
                    return this.default();
                }
                // try {
                //     const response = await fetch(str, { method: 'HEAD' });
                //     if (!response.ok) return this.default;
                //     const contentType = response.headers.get("content-type");
                //     if (contentType && contentType.startsWith("image/")) {
                //         return str;
                //     } else return this.default;
                // } catch (error) {
                //     return this.default;
                // }
            }
        },
        5: {
            default: "#BBBBBB",
            check: function(str) {
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                let tester = str.startsWith("#") ? str : ("#" + str);
                if (/^#[0-9A-Fa-f]{6}$/.test(str)) {
                    return tester;
                } else return str;
            }
        },
        6: {
            default: "A trigger user",
            check: function(str) {
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                let outp = sanitizeHTML(str);
                return outp.slice(0, 50);
            }
        },
        7: {
            default: "0",
            check: function(str) {
                let valid = "012".split('');
                if (valid.includes(str)) return str;
                return this.default;
            }
        },
        8: {
            default: "#FFFFFF",
            check: function(str) {
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                let tester = str.startsWith("#") ? str : ("#" + str);
                if (/^#[0-9A-Fa-f]{6}$/.test(str)) {
                    return tester;
                } else return str;
            }
        },
        9: {
            default: "#CCCCCC",
            check: function(str) {
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                let tester = str.startsWith("#") ? str : ("#" + str);
                if (/^#[0-9A-Fa-f]{6}$/.test(str)) {
                    return tester;
                } else return str;
            }
        },
        10: {
            default: "Play",
            check: function(str) {
                if (!str) return this.default;
                if (typeof str !== "string") return this.default;
                if (str === "default") return this.default;
                let valid = window._fonts.map(i => i[0]);
                // console.log(valid);
                // console.log("LPT RMEOVAL")
                if (valid.includes(str)) return str;
                return this.default;
            }
        }
    },

    dataToAssets: function(data) {
        let copy = {...data};
        let checks = this.__pos_keys_checks;
        for (let key of Object.keys(checks)) {
            try {
                if (!checks[key]) continue;
                copy[this.__pos_keys[key]] = checks[key].check(data[this.__pos_keys[key]]);
            } catch (ex) {
                log("error", "dataToAssets exception: " + ex);
                console.warn(ex);
            }
        }
        return copy;
    },
    modal: {
        _getIDs: function(prefix) {
            return {
                wrapper: `${prefix}_profile_wrapper`,
                picture: `${prefix}_profile_picture`,
                bannerWrapper: `${prefix}_profile_banner_wrapper`,
                banner: `${prefix}_profile_banner`,
                ecp: `${prefix}_profile_ecp`
            }
        },

        destroy: function(prefix = "default") {
            let ids = this._getIDs(prefix);

            for (let value of Object.values(ids)) {
                let target = document.querySelector("#" + value);
                if (target) {
                    target.remove();
                    //console.log("removed target")
                }
            }
        },

        get: function(data, prefix = "default") {
            let profile = Profile.dataToAssets(data);
            //console.log(window._ships);
            // console.log("DATA TO ASSETS:");
            // console.log(profile);
            // console.log(data);

            //lI100.III0O("sera","2","ashen",48,0);
            let raw = profile?.raw?.data?.custom;
            let framerate = 1000 / window._scoreboardUpdater.interval;
            let ecp = null;
            if (raw) {
                ecp = window.ecpRenderer(raw.badge, raw.laser, raw.finish, 48, 0, 1, false);
            }

            if (raw?.finish?.startsWith("_vid_")) {
                let hasStarted = false;
                let max = window._videoBadgeInfo[raw.finish].steps;
                let i = 1;

                const next = () => ((i + 1) > max) ? i=1 : (++i);

                let privateTimer = setInterval(function animateECP() {
                    let el = document.querySelector(`#${prefix}_profile_ecp`);
                    if (el) {
                        hasStarted = true;
                        let newECP = window.ecpRenderer(raw.badge, raw.laser, raw.finish, 48, 0, next(), false);
                        //console.log(i);
                        el.style.backgroundImage = `url('${newECP.src}')`;
                    }
                    if (!el && hasStarted) {
                        //console.log("cleared timer");
                        clearInterval(privateTimer);
                        privateTimer = null;
                    }
                }, framerate)
            }
            // console.log(ecp);

            let textEffects = null;
            switch (profile.textFillType) {
                case "0":
                    textEffects = `
                        color: ${profile.textFillColor1};
                    `
                    break;
                case "1":
                    textEffects = `
                        background-clip: text;
                        color: transparent;
                        background: linear-gradient(to right, ${profile.textFillColor1}, ${profile.textFillColor2});
                    `
                    break;
                case "2":
                    textEffects = `
                        background-clip: text;
                        color: transparent;
                        background: linear-gradient(to bottom, ${profile.textFillColor1}, ${profile.textFillColor2});
                    `
                    break;
            }
            /**
             * mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
                            -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
             */
            //<div id="${prefix}_profile_picture" style="aspect-ratio:1/1;height:100%;outline:5px solid white;background-size:cover;background-image:url('${profile.profilePicture}')"></div>;
            let div = `
                <div id="${prefix}_profile_wrapper" style="position:absolute;width:max-content;height:15vh;display:flex; pointer-events:none;
                align-items:center;justify-content:center; box-shadow: rgba(0,0,0,0.1) 0px 0px 15px; backdrop-filter:blur(4px);
                left: 50%;transform: translateX(-50%);box-sizing:content-box; padding: 0%;">

                    <div style="display:flex; left:0; margin-left: 1.25vw; position: absolute; z-index:1; flex-direction:column; height:75%; align-items: center; justify-content: center;">
                        <div id="${prefix}_profile_picture" style="aspect-ratio:1/1; outline: 3px solid ${profile.outline};height: 84%; background-size: cover; background-image:url('${profile.profilePicture}')"></div>
                        ${
                            ecp
                            ?
                            `<div id="${prefix}_profile_ecp" style="margin-top: -16px; aspect-ratio: 2/1;
                            filter: drop-shadow(${profile.outline} 1px 0px 0px) drop-shadow(${profile.outline} -1px 0px 0px) drop-shadow(${profile.outline} 0px 1px 0px) drop-shadow(${profile.outline} 0px -1px 0px);
                            width: 100%; background-size: contain; background-image:url('${ecp.src}')"></div>`
                            :
                            ``
                        }
                    </div>

                    <div id="${prefix}_profile_banner_wrapper" style="position:relative;aspect-ratio:21/6; opacity: 1;
                        height:100%; display: flex;
                        box-sizing:border-box;
                        padding: 1vh 1vw 1vh 1vw;
                        outline: 3px solid ${profile.outline};
                        border:3px solid transparent;
                        font-size:calc(.94vh + .95vw);font-family:var(--def-font);color:white;">

                        <div style="height:90%;aspect-ratio:1/1;"></div>
                        <div style="line-height: 1 !important; text-shadow: ${profile.outline} 1px 0px 0px, ${profile.outline} -1px 0px 0px, ${profile.outline} 0px 1px 0px, ${profile.outline} 0px -1px 0px">
                            <small style="font-size:calc(0.65vh + 0.65vw); color:black; margin-top: -4%">You got killed by</small><br/>
                            <span style="font-family: '${profile.font}', sans-serif; ${textEffects}">${sanitizeHTML(profile.name)}</span>
                        </div>
                        <img id="${prefix}_profile_banner" src="${profile.banner}" style="
                            object-fit:cover; object-position: center;
                            height: 100%; width: 100%;
                            ${""
                            //     mask-image: linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.9), transparent);
                            // -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.9), transparent);
                            }

                            position:absolute; top: 0; left: 0; opacity: 1; z-index:-1"></img>

                    </div>
                </div>
            `;
            return {
                ids: this._getIDs(prefix),
                html: div
            }
        }
    },

    assets: {
        profilePictures: {
            "default": "https://i.ibb.co/nNYnf0RQ/default-pfp.png",
            1: "https://i.ibb.co/5WpQsfzf/157435f94d7b6b876bdf05d4296240ed.jpg",
            2: "https://i.pinimg.com/736x/4d/99/9d/4d999d63f723c4cb7ec7f2430f86e34c.jpg"
        },
        banners: {
            "default": "https://i.ibb.co/j9JbqfNw/default-banner.png",
            1:"https://i.ibb.co/Q7t7mVPh/1.png",
            2:"https://i.ibb.co/chGb3nfn/2.png",
            3:"https://i.ibb.co/N27Xvc2Z/3.png",
            4:"https://i.ibb.co/F4KTkVwN/4.png",
            5:"https://i.ibb.co/KzLTRLzV/5.png",
            6:"https://i.ibb.co/bRbf4fLL/6.png",
            7:"https://i.ibb.co/Skh9c8G/7.png",
            8:"https://i.ibb.co/0RJGxQB6/8.png",
            9:"https://i.ibb.co/xtyFx7Z0/9.png",
            10:"https://i.ibb.co/fd8GDY2w/10.png",
            11:"https://i.ibb.co/nNqct0tN/11.png",
            12:"https://i.ibb.co/RT5Lbs0c/12.png",
            13:"https://i.ibb.co/1t4MfDCT/13.png",
            14:"https://i.ibb.co/6ccBf54G/14.png",
            15:"https://i.ibb.co/VW5nhNLN/15.png",
            16:"https://i.ibb.co/xqsVRmZk/16.png",
            17:"https://i.ibb.co/9HNzb41Z/17.png",
            18:"https://i.ibb.co/DgVFbSL6/18.png",
            19:"https://i.ibb.co/Fk7w7kS2/8cedb998be5cdb519d5ae07220027b1d.jpg",
            20:"https://i.ibb.co/8n1TFcdV/gettyimages-1402175361-640x640.jpg",
        }
    },

    personal: {
        name: "Nanoray",
        profilePicture: 1,
        banner: 17,
        outline: "#B7FFFA",
        text: "Default text",
        "textFillType": "1",
        "textFillColor1": "#4f6cff",
        "textFillColor2": "#8000ff",
        font: "DynaPuff",
        uid: "p" + [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    },

    all: {},

    get: function(id, getDefault = false) {
        let newID = +id; //raw
        let profile = this.all[newID];
        // console.log(profile);
        // console.log(this.all);
        if (!profile) {
            if (!getDefault) return ;
        }
        return profile;
    },

    sanitize: function(string) {
        let outp = string;
        outp = outp.replaceAll(this.__separator, "");
        outp = outp.replaceAll('"', "");
        return outp;
    },

    buildPersonal: function() {
        let outp = this.__separator + this.__acknowledge_string;

        for (let i = 2; i < (Object.keys(this.__pos_keys)).length; i++) {
            let push = this.personal[this.__pos_keys[i]];
            if (typeof push === "string") push = this.sanitize(push);
            outp += this.__separator + push;
        }

        return outp;
    },

    // this function assumes you have a valid data array
    getObjectFromData: function(array) {
        let outp = {};
        let dontAssign = [this.__data_key, "acknowledge"];
        for (let key of Object.keys(this.__pos_keys)) {
            let assignTo = this.__pos_keys[key];
            if (dontAssign.includes(assignTo)) continue;
            outp[assignTo] = array[+key];
        }
        return outp;
    },

    process: function(object, add = true) {
        let container = object?.data?.custom;
        const hex = "p" + [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (!container || typeof container !== "object") {
            let copy = {...object};
            for (let key of Object.values(this.__pos_keys)) {
                copy[key] = "default";
            }
            copy.isTriggerUser = false;
            copy.uid = hex;
            copy.raw = {...copy};
            copy.name = copy?.data?.player_name;
            if (add) this.all[copy?.data?.id] = {...copy};
            if (add) {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Allow CORS
                img.src = "https://i.ibb.co/j9JbqfNw/default-banner.png"; // Replace index with profilePicture number

                img.onload = () => {
                    // console.log("successfully loaded image")
                    this.all[object?.data?.id].pfp = {
                        valid: true,
                        image: img
                    };
                };

                img.onerror = () => {
                    // console.log("failed loading image" + "def")
                    this.all[copy?.data?.id].pfp = {
                        valid: false,
                        image: img
                    };
                };
            }
            return copy;
        }
        let rawData = container[this.__data_key];
        let data = rawData.split(this.__separator);
        let dataLength = (Object.keys(this.__pos_keys)).length;


        if ((data.length !== dataLength) || (data[1] !== this.__acknowledge_string)) {
            let copy = {...object};
            for (let key of Object.values(this.__pos_keys)) {
                copy[key] = "default";
            }
            copy.isTriggerUser = false;
            copy.uid = hex;
            copy.raw = {...copy};
            copy.name = copy?.data?.player_name;
            if (add) this.all[copy?.data?.id] = {...copy};
            if (add) {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Allow CORS
                img.src = "https://i.ibb.co/j9JbqfNw/default-banner.png"; // Replace index with profilePicture number

                img.onload = () => {
                    // console.log("successfully loaded image")
                    this.all[object?.data?.id].pfp = {
                        valid: true,
                        image: img
                    };
                };

                img.onerror = () => {
                    // console.log("failed loading image" + "def")
                    this.all[copy?.data?.id].pfp = {
                        valid: false,
                        image: img
                    };
                };
            }
            //console.log("gotten full profile");
            return copy;
        }

        let copy = {...object};
        object.data.custom[this.__data_key] = +data[0];

        copy.data.player_name = "🗲 " + copy.data.player_name;
        let processedData = this.getObjectFromData(data);
        processedData.raw = {...object};
        processedData.uid = hex;


        processedData.isTriggerUser = true;

        copy[this.key] = processedData;

        if (add) this.all[object?.data?.id] = processedData;
        if (add) {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Allow CORS
            img.src = this.assets.banners[data[4]]; // Replace index with banner number

            img.onload = () => {
                // console.log("successfully loaded image")
                this.all[object?.data?.id].pfp = {
                    valid: true,
                    image: img
                };
            };

            img.onerror = () => {
                // console.log("failed loading image " + data[4])
                this.all[object?.data?.id].pfp = {
                    valid: false,
                    image: img
                };
            };
        }
        return copy;
    }
}
window.processProfile = Profile.process.bind(Profile);
window.getProfile = Profile.get.bind(Profile);
Profile.__pos_keys[0] = Profile.__data_key;
Profile.__pos_keys[1] = "acknowledge";
// Profile.process({})


let url = "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/3ger.js";
//let url = "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/3ger1.html";
let xhr = new XMLHttpRequest();

const __META__ = {
    versionName: "Lithium",
    versionStage: "beta",
    version: "0.8.9",
    prev: ["0.8.3", "0.8.8"]
}
//1:Math.sqrt(2)



function main(_hasCrashed = false) {
    const CSS = ".icon1,.wheel{position:absolute;opacity:0.7}.icon1,.icon2,.icon3,.icon4{filter:drop-shadow(black 0px 0px 5px) saturate(.4)}.bl1,.bl2,.bl3,.bl4,.blcenter{opacity:.9}.wheel{width:200px;height:200px;display:flex;align-items:center;justify-content:center}.icon1{z-index:999;width:35px;height:35px;bottom:40px;right:40px;transition-duration:70ms;background-repeat:no-repeat;background-size:contain}.bl1,.sq1{right:0;bottom:0;position:absolute}.q1{position:absolute;width:600px;height:600px;transform:translateX(calc(-50% + 3px)) translateY(calc(-50% + 3px))}.q1:hover .bl1,.q2:hover .bl2,.q3:hover .bl3,.q4:hover .bl4{background:rgba(0,0,0,0);z-index:9999}.blcenter:hover+.iconcenter,.q1:hover .icon1,.q2:hover .icon2,.q3:hover .icon3,.q4:hover .icon4{filter:drop-shadow(black 0px 0px 5px) saturate(1)}.bl1{background:#000;width:100px;height:100px;z-index:10;border-top-left-radius:999px;transition-duration:150ms;border:6px double #000}.sq1{width:101px;height:101px;background:radial-gradient(circle at bottom right,#ff0,orange);background-repeat:no-repeat;background-size:cover;border-top-left-radius:999px;transition-duration:.1s;border:6px solid #000}.icon2{position:absolute;z-index:999;width:35px;height:35px;bottom:40px;left:40px;transition-duration:70ms;background-repeat:no-repeat;background-size:contain}.bl2,.sq2{bottom:0;position:absolute}.q2{position:absolute;width:600px;height:600px;transform:translateX(calc(50% - 3px)) translateY(calc(-50% + 3px))}.bl2{background:#000;left:0;width:100px;height:100px;z-index:10;border-top-right-radius:999px;transition-duration:150ms;border:6px double #000;border-top:6px double #000;border-right:6px double #000}.sq2{right:left;width:101px;height:101px;background:radial-gradient(circle at bottom left,red,rgba(50,0,0));background-repeat:no-repeat;background-size:cover;border-top-right-radius:999px;transition-duration:.1s;border:6px solid #000}.icon3{position:absolute;z-index:999;width:35px;height:35px;top:40px;right:40px;transition-duration:70ms;background-repeat:no-repeat;background-size:contain}.bl3,.sq3{right:0;top:0;position:absolute}.q3{position:absolute;width:600px;height:600px;transform:translateX(calc(-50% + 3px)) translateY(calc(50% - 3px))}.bl3{background:#000;width:100px;height:100px;z-index:10;border-bottom-left-radius:999px;transition-duration:150ms;border:6px double #000;border-bottom:6px double #000;border-left:6px double #000}.sq3{width:101px;height:101px;background:radial-gradient(circle at top right,#ff00ff,purple);background-repeat:no-repeat;background-size:cover;border-bottom-left-radius:999px;transition-duration:.1s;border:6px solid #000}.icon4{position:absolute;z-index:999;width:35px;height:35px;top:40px;left:40px;transition-duration:70ms;background-repeat:no-repeat;background-size:contain}.bl4,.sq4{left:0;top:0;position:absolute}.q4{position:absolute;width:600px;height:600px;transform:translateX(calc(50% - 3px)) translateY(calc(50% - 3px))}.bl4{background:#000;width:100px;height:100px;z-index:10;border-bottom-right-radius:999px;transition-duration:150ms;border:6px solid #000;border-right:6px double;border-bottom:6px double}.sq4{width:101px;height:101px;background:radial-gradient(circle at top left,#4169e1,#00f);background-repeat:no-repeat;background-size:cover;border-bottom-right-radius:999px;transition-duration:.1s;border:6px solid #000}.iconcenter{position:absolute;z-index:999;width:60px;height:60px;pointer-events:none;transition-duration:70ms;background-repeat:no-repeat;background-size:contain;filter:drop-shadow(black 0px 0px 8px) saturate(.4)}.blcenter,.wcenter{position:absolute;width:100px;height:100px}.blcenter:hover{background:rgba(0,0,0,0)}.blcenter{background:#000;z-index:10;border-radius:999px;transition-duration:150ms;border:6px double #000}.wcenter{background:radial-gradient(circle at center,rgba(0,140,255),#0ff);background-repeat:no-repeat;background-size:cover;border-radius:999px;transition-duration:.1s;border:6px solid #000}";

    const profileModal = `
    <div id="PROF_M" style="pointer-events:none;position:absolute;left:0;top:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;">
        <div style="pointer-events:all; position: absolute; z-index:500; margin: auto auto auto auto; width: 950px; height: 90%; max-width: 90%; backdrop-filter: blur(18px) brightness(.75); background: var(--def-bg);animation: appear .2s linear 0s 1 normal forwards;
        display: flex; flex-direction: column; align-items: center; padding: 15px 25px 15px 25px; background: rgba(255,255,255,0.1)">
            <div style="font-family: var(--def-font); color: var(--def-bg-fullcolor);font-weight: bold; font-size: 1.5em; line-height:1; display: flex; justify-content: space-between; width: 100%; height: 5%; align-items:center;border-bottom: 1px solid rgba(255,255,255,.25);">
                <span style="display: flex">Trigger settings&nbsp;&nbsp;&nbsp;<span style="font-size:.7em; font-family: var(--def-font); color: white; padding: 3px; border-radius: 7px; border: 1px solid rgba(180,180,180,.4);background: rgba(0,0,0,.4); line-height: 1; font-weight: 300;">ALT</span>&nbsp;+&nbsp;<span style="font-size:.7em; font-family: var(--def-font); color: white; padding: 5px; border-radius: 7px; border: 1px solid rgba(180,180,180,.4);background: rgba(0,0,0,.4); line-height: 1; font-weight: 300;">X</span></span>
                <div style="font-size:1.5em; text-shadow: rgba(255,255,255,.35) 0px 0px 10px; cursor: pointer;" onclick="clickSettings()">⨯</div>
            </div>
            <div style="width: 100%; min-height: 1.8rem; height: 1.8rem; max-height: 1.8rem !important; overflow: hidden; color: var(--def-bg-fullcolor); font-family: var(--def-font); display: flex; justify-content: space-evenly; font-size: 1.15em; align-items: center;padding: 12px 0 12px 0;">
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_graphics" onclick="changeSection('graphics')">
                    <span id="text_graphics" style="flex:1;text-align:center;height:1.6rem">GRAPHICS</span>
                    <div id="notch_graphics_right" style="width: 0px;height: 0px;border-style: solid;border-width: 1.6rem 1.6rem 0 0;border-color: transparent transparent transparent transparent;"></div>
                </div>
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_sound" onclick="changeSection('sound')">
                    <div id="notch_sound_left" style="width: 0px;height: 0px;border-style: solid;border-width: 0 0 1.6rem 1.6rem;border-color: transparent transparent transparent transparent;"></div>
                    <span id="text_sound" style="flex:1;text-align:center;height:1.6rem">SOUND</span>
                    <div id="notch_sound_right" style="width: 0px;height: 0px;border-style: solid;border-width: 1.6rem 1.6rem 0 0;border-color: transparent transparent transparent transparent;"></div>
                </div>
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_filters" onclick="changeSection('filters')">
                    <div id="notch_filters_left" style="width: 0px;height: 0px;border-style: solid;border-width: 0 0 1.6rem 1.6rem;border-color: transparent transparent transparent transparent;"></div>
                    <span id="text_filters" style="flex:1;text-align:center;height:1.6rem">FILTERS</span>
                </div>
            </div>
            <div style="margin: 0px 0px 10px 0px; width: 100%; display: flex; align-items: center; box-sizing: border-box; justify-content: flex-start; height: 1.75rem; padding: 5px 9px 5px 9px; background: rgba(0,0,0,.25); min-height: 1.75rem; overflow: hidden; border-radius: .3rem; border: 1px solid rgba(180,180,180,.4);">
                <svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" fill="#ffffff"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                <input type="text" placeholder="WIP search bar..." style="margin-left: 5px; text-shadow: 0; flex: 1; font-size: 1.15rem; color: var(--def-bg-fullcolor); font-family: var(--def-font); background: transparent; border: 0; outline: 0;"></input>
            </div>
            <div id="warning_restart" style="width:100%; height: calc(5% - 10px); padding: 0px 0 10px 0; background: rgba(255,0,0,0.15); font-family: var(--def-font); color: rgba(255,255,255,.8);display:grid;place-items:center;opacity:0;position: absolute; bottom: 0; left: 0;">
                <b>WARNING: Some settings will require a reload to apply</b>
            </div>
            <div id="section_replacer" style="border-radius:5px;box-sizing:border-box; padding: 10px 0 20px 0;background:rgba(0,0,0,.3); color: var(--def-bg-fullcolor); font-family: var(--def-font); width: 100%; height: calc(85% - 1.75rem - 10px); display: flex; flex-direction: column; gap: 25px; overflow-y: auto; overflow-x: hidden; font-size: 1.24em; align-items: center;">
                <div class="slidecontainer">
                    <input type="range" min="1" max="100" value="50" class="slider1" id="myRange">
                </div>
            </div>
        </div>
    </div>
    `

    const triggerModal = `
    <div id="TRIG_M" style="pointer-events:none;position:absolute;left:0;top:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;">
        <div style="pointer-events:all; position: absolute; z-index:500; margin: auto auto auto auto; width: 950px; height: 90%; max-width: 90%; backdrop-filter: blur(18px) brightness(.75); background: var(--def-bg);animation: appear .2s linear 0s 1 normal forwards;
        display: flex; flex-direction: column; align-items: center; padding: 15px 25px 15px 25px; background: rgba(255,255,255,0.1)">
            <div style="font-family: var(--def-font); color: var(--def-bg-fullcolor);font-weight: bold; font-size: 1.5em; line-height:1; display: flex; justify-content: space-between; width: 100%; height: 5%; align-items:center;border-bottom: 1px solid rgba(255,255,255,.25);">
                <span style="display: flex">Trigger settings&nbsp;&nbsp;&nbsp;<span style="font-size:.7em; font-family: var(--def-font); color: white; padding: 3px; border-radius: 7px; border: 1px solid rgba(180,180,180,.4);background: rgba(0,0,0,.4); line-height: 1; font-weight: 300;">ALT</span>&nbsp;+&nbsp;<span style="font-size:.7em; font-family: var(--def-font); color: white; padding: 5px; border-radius: 7px; border: 1px solid rgba(180,180,180,.4);background: rgba(0,0,0,.4); line-height: 1; font-weight: 300;">X</span></span>
                <div style="font-size:1.5em; text-shadow: rgba(255,255,255,.35) 0px 0px 10px; cursor: pointer;" onclick="clickSettings()">⨯</div>
            </div>
            <div style="width: 100%; min-height: 1.8rem; height: 1.8rem; max-height: 1.8rem !important; overflow: hidden; color: var(--def-bg-fullcolor); font-family: var(--def-font); display: flex; justify-content: space-evenly; font-size: 1.15em; align-items: center;padding: 12px 0 12px 0;">
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_graphics" onclick="changeSection('graphics')">
                    <span id="text_graphics" style="flex:1;text-align:center;height:1.6rem">GRAPHICS</span>
                    <div id="notch_graphics_right" style="width: 0px;height: 0px;border-style: solid;border-width: 1.6rem 1.6rem 0 0;border-color: transparent transparent transparent transparent;"></div>
                </div>
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_sound" onclick="changeSection('sound')">
                    <div id="notch_sound_left" style="width: 0px;height: 0px;border-style: solid;border-width: 0 0 1.6rem 1.6rem;border-color: transparent transparent transparent transparent;"></div>
                    <span id="text_sound" style="flex:1;text-align:center;height:1.6rem">SOUND</span>
                    <div id="notch_sound_right" style="width: 0px;height: 0px;border-style: solid;border-width: 1.6rem 1.6rem 0 0;border-color: transparent transparent transparent transparent;"></div>
                </div>
                <div style="cursor:pointer;flex:1;display:flex;align-items:center;height:1.6rem" id="section_filters" onclick="changeSection('filters')">
                    <div id="notch_filters_left" style="width: 0px;height: 0px;border-style: solid;border-width: 0 0 1.6rem 1.6rem;border-color: transparent transparent transparent transparent;"></div>
                    <span id="text_filters" style="flex:1;text-align:center;height:1.6rem">FILTERS</span>
                </div>
            </div>
            <div style="margin: 0px 0px 10px 0px; width: 100%; display: flex; align-items: center; box-sizing: border-box; justify-content: flex-start; height: 1.75rem; padding: 5px 9px 5px 9px; background: rgba(0,0,0,.25); min-height: 1.75rem; overflow: hidden; border-radius: .3rem; border: 1px solid rgba(180,180,180,.4);">
                <svg xmlns="http://www.w3.org/2000/svg" height="1.1rem" viewBox="0 -960 960 960" width="1.1rem" fill="#ffffff"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                <input type="text" placeholder="WIP search bar..." style="margin-left: 5px; flex: 1; font-size: 1.15rem; color: var(--def-bg-fullcolor); font-family: var(--def-font); background: transparent; border: 0; outline: 0;"></input>
            </div>
            <div id="warning_restart" style="width:100%; height: calc(5% - 10px); padding: 0px 0 10px 0; background: rgba(255,0,0,0.15); font-family: var(--def-font); color: rgba(255,255,255,.8);display:grid;place-items:center;opacity:0;position: absolute; bottom: 0; left: 0;">
                <b>WARNING: Some settings will require a reload to apply</b>
            </div>
            <div id="section_replacer" style="border-radius:5px;box-sizing:border-box; padding: 10px 0 20px 0;background:rgba(0,0,0,.3); color: var(--def-bg-fullcolor); font-family: var(--def-font); width: 100%; height: calc(85% - 1.75rem - 10px); display: flex; flex-direction: column; gap: 25px; overflow-y: auto; overflow-x: hidden; font-size: 1.24em; align-items: center;">
                <div class="slidecontainer">
                    <input type="range" min="1" max="100" value="50" class="slider1" id="myRange">
                </div>
            </div>
        </div>
    </div>
    `;


    const abortAndReport = (message, sub) => {
            document.open();
            document.write(__DOC_DEF);
            document.close();
            let head = document.querySelector('.p-head');
            head.innerHTML = message;
            head.style.display = 'block';
            if (sub) {
                let subp = document.querySelector('.p-sub');
                subp.innerHTML = sub;
                subp.style.display = 'block';
            }
            document.querySelector('.sib').remove();

            let circheck = document.querySelectorAll('canvas');

            if (circheck.length > 0) {
                document.documentElement.remove();
            }
    };

    if (window._crashCount >= window._crashLimit) {
        abortAndReport("CRASH LIMIT EXCEEDED", "TRY RELOADING OR CONTACT ME ON DISCORD: h.alcyon");
    }

    let loggedIn = true, passedFirstLoad = false, port = "8080";

    const sendRequest = (target, obj) => {
        fetch("http://localhost:" + port + "/" + target, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Private-Network": "true" // Request permission for private network access
            },
            credentials: "include", // Ensures cookies and credentials are sent
            body: JSON.stringify(obj),
        })
            .then(response => response.json()) // Assuming the server responds with JSON
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                log("debug", "Failed to send request:");
                console.warn(error);
            });
    }

    const Authentication = {
        login: {
            closeJobs: [

            ],
            close: function() {
                for (let job of this.closeJobs) {
                    try {
                        job();
                    } catch(ex) {
                        log("debug", "Failed cleanup job: ");
                        console.warn(ex);
                    }
                }
            },
            load: function() {
                if (passedFirstLoad) {
                    passedFirstLoad = false;
                    let head = document.querySelector('.p-head');

                    let animation = head.animate([
                        {transform: "scale(1)", opacity: 1},
                        {transform: "scale(0.8)", opacity: 1}
                    ], {
                        duration: 500,
                        fill: 'forwards'
                    })

                    return animation.finished.then(() => {
                        Authentication.login.load();
                    });
                }

                passedFirstLoad = true;


                const loginStyles = {
                    input: `font-family: 'Liter', sans-serif;
                            padding: 5px 15px 5px 15px;
                            box-sizing:content-box;
                            height: max-content;
                            width: 300px;
                            border: 2px solid white;
                            color: white;
                            font-size: 1.15rem;
                            background: black;
                            outline: 0;`,

                    button: `font-family: 'Bebas Neue', sans-serif;
                            padding: 5px 15px 5px 15px;
                            box-sizing: content-box;
                            font-size: 1.5rem;
                            background: white;
                            color: black;
                            margin-top:10px;
                            outline: 0; border: 0;
                            cursor: pointer;
                    `,

                    smallText: `
                        font-size: 1rem;
                        opacity: 0.75;
                        font-family: 'Bebas Neue', sans-serif;
                    `

                }

                loginStyles.button2 = loginStyles.button + `color: white; background: black; font-size: 1.15rem; margin: 0; padding: 0; text-decoration: underline;`

                document.open();
                document.write(__DOC_DEF);
                document.close();

                let head = document.querySelector('.p-head');
                head.innerHTML = `
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;margin-top: 10px;">
                        <input type="text" style="${loginStyles.input}" placeholder="Username" id="input_username"></input>
                        <input type="password" style="${loginStyles.input}" placeholder="Password" id="input_password"></input>
                        <button id="button_login" style="${loginStyles.button}">LOGIN</button>
                        <div style="display:flex; gap: 8px; align-items: center; justify-content: center; opacity: 1; height: max-content; margin-top: 35px;">
                            <div style="${loginStyles.smallText}">Don't have an account?</div>
                            <button id="refer_register_button" style="${loginStyles.button2}">REGISTER</div>
                        </div>
                    </div>
                `;
                head.style.display = 'block';

                const loadListener = (element, e, func) => {
                    element.addEventListener(e, func);
                    this.closeJobs.push(() => element.removeEventListener(e, func));
                }

                loadListener(document.querySelector("#refer_register_button"), "click", ()=>{
                    this.close();
                    Authentication.register.load();
                })

                loadListener(document.querySelector("#button_login"), "click", () => {
                    sendRequest("register", {hello: "lol"});
                })

                let sib = document.querySelector('.sib');
                if (sib) sib.remove();
            }
        },
        register: {
            closeJobs: [

            ],
            close: function() {
                for (let job of this.closeJobs) {
                    try {
                        job();
                    } catch(ex) {
                        log("debug", "Failed cleanup job: ");
                        console.warn(ex);
                    }
                }
            },
            load: function() {
                if (passedFirstLoad) {
                    passedFirstLoad = false;
                    let head = document.querySelector('.p-head');
                    let animation = head.animate([
                        {transform: "scale(1)", opacity: 1},
                        {transform: "scale(0.8)", opacity: 1}
                    ], {
                        duration: 500,
                        fill: 'forwards'
                    })
                    return animation.finished.then(() => {
                        Authentication.register.load();
                    });
                }
                passedFirstLoad = true;


                const registerStyles = {
                    input: `font-family: 'Liter', sans-serif;
                            padding: 5px 15px 5px 15px;
                            box-sizing:content-box;
                            height: max-content;
                            width: 300px;
                            border: 2px solid white;
                            color: white;
                            font-size: 1.15rem;
                            background: black;
                            outline: 0;`,

                    button: `font-family: 'Bebas Neue', sans-serif;
                            padding: 5px 15px 5px 15px;
                            box-sizing: content-box;
                            font-size: 1.5rem;
                            background: white;
                            color: black;
                            margin-top:10px;
                            outline: 0; border: 0;
                            cursor: pointer;
                    `,

                    smallText: `
                        font-size: 1rem;
                        opacity: 0.75;
                        font-family: 'Bebas Neue', sans-serif;
                    `

                }

                registerStyles.button2 = registerStyles.button + `color: white; background: black; font-size: 1.15rem; margin: 0; padding: 0; text-decoration: underline;`

                document.open();
                document.write(__DOC_DEF);
                document.close();

                let head = document.querySelector('.p-head');
                head.innerHTML = `
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;margin-top: 10px;">
                        <input type="text" style="${registerStyles.input}" placeholder="Username" id="input_username"></input>
                        <input type="password" style="${registerStyles.input}" placeholder="Password" id="input_password"></input>
                        <button id="button_login" style="${registerStyles.button}">REGISTER</button>
                        <div style="display:flex; gap: 8px; align-items: center; justify-content: center; opacity: 1; height: max-content; margin-top: 35px;">
                            <div style="${registerStyles.smallText}">Already have an account?</div>
                            <button id="refer_login_button" style="${registerStyles.button2}">LOGIN</div>
                        </div>
                    </div>
                `;
                head.style.display = 'block';

                const loadListener = (element, e, func) => {
                    element.addEventListener(e, func);
                    this.closeJobs.push(() => element.removeEventListener(e, func));
                }

                loadListener(document.querySelector("#refer_login_button"), "click", ()=>{
                    this.close();
                    Authentication.login.load();
                })


                let sib = document.querySelector('.sib');
                if (sib) sib.remove();
            }
        }
    }

    if (!loggedIn) {
        let m = LocalStorage.getItem(LS_PREFIX + "MACHINE_REGISTERED");
        if (m) return Authentication.login.load();

        localStorage.setItem(LS_PREFIX + "MACHINE_REGISTERED", "1");
        return Authentication.register.load();
    }

    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let starSRC = xhr.responseText;
            let srcnew = starSRC;
            let modalToggled = false;
            let MODAL_TIMER = null;
            let _modalSection = "graphics";

            let shouldPerformReplacements;
            if (!localStorage.getItem(LS_PREFIX + "PENDING_SETTINGS")) {
                localStorage.setItem(LS_PREFIX + "PENDING_SETTINGS", "0");
                shouldPerformReplacements = true;
            } else {
                shouldPerformReplacements = localStorage.getItem(LS_PREFIX + "PENDING_SETTINGS") === "1";
            }

            window.cleanHUD = () => {
                let social = document.querySelectorAll('.sbg');
                let logo = document.querySelector('#logo');
                if (social) {
                    for (let el of social) {el.remove()};
                };
                // console.log(social);
                if (logo) logo.remove();
            }

            let temporaryWrapper = null;
            window.startDeathScene = (id) => {
                // console.log(id);
                if (!id || !window.deathScene.follow) return;
                window.deathScene = {follow: window.deathScene.follow, id: id};
                let data = Profile.get(id);
                let modalData = Profile.modal.get(data, data.uid);

                let div = document.createElement('div');
                div.innerHTML = modalData.html;
                document.querySelector("body").appendChild(div.children[0]);
                document.querySelector(".stats").style.display = "none";
                let respawnActions = document.querySelector("#respawn_actions");
                respawnActions.style.position = "absolute";
                respawnActions.style.bottom = "-49vh";
                respawnActions.style.left = "50%";
                respawnActions.style.height = "15vh";
                respawnActions.style.aspectRatio = "21/6";
                respawnActions.style.transform = "translateX(-50%)";
                respawnActions.style.fontSize = "calc(0.8vh + 0.8vw) !important";
                let wrapper = document.querySelector("#" + modalData.ids.wrapper);
                wrapper.style.bottom = "7vh"
                wrapper.animate([
                    {opacity: 0, transform: "scale(1.4) translateX(-50%) translateY(-50%)", filter: "blur(16px)"},
                    {opacity: 1, transform: "scale(1) translateX(-50%) translateY(-50%)", filter: "blur(0px)"},
                ], {
                    easing: "ease-out",
                    duration: 1250,
                    fill: "forwards"
                })
                temporaryWrapper = "#" + modalData.ids.wrapper;

                let canvas = document.querySelector('canvas');
                //canvas.style.filter = 'grayscale(1)';
                canvas.style.transformOrigin = "center center";
                /**
                 * mask: linear-gradient(black, black, transparent);
backdrop-filter: blur(8px);
                 */
                // canvas.style.mask = "radial-gradient(black, black, transparent)";
                // canvas.style.webkitMask = "radial-gradient(black, black, transparent)";
                canvas.animate([
                    {transform: "scale(1)", filter: "grayscale(0)", backdropFilter: "blur(0px)"},
                    {transform: "scale(1.15)", filter: "grayscale(.9)", backdropFilter: "blur(10px)"}
                ], {
                    easing: "ease-out",
                    duration: 1250,
                    fill: "forwards"
                })
                //console.log("Started death scene");
            }

            window.endDeathScene = () => {
                let profile = Profile.get(window?.deathScene?.id);
                if (!profile) {
                    window.deathScene = {follow: false, id: null};
                    return;
                }
                window.deathScene = {follow: false, id: null};

                document.querySelector(temporaryWrapper).animate([
                    {opacity: 1, transform: "scale(1) translateX(-50%) translateY(-50%)", filter: "blur(0px)"},
                    {opacity: 0, transform: "scale(1.4) translateX(-50%) translateY(-50%)", filter: "blur(16px)"},
                ], {
                    easing: "ease-out",
                    duration: 1250,
                    fill: "forwards"
                })

                let canvas = document.querySelector('canvas');
                setTimeout(() => {
                    Profile.modal.destroy(profile.uid);
                    document.querySelector('canvas').style.mask = "none";
                }, 1250)

                //canvas.style.filter = '';
                canvas.animate([
                    {transform: "scale(1.15)", filter: "grayscale(.9)", backdropFilter: "blur(10px)"},
                    {transform: "scale(1)", filter: "grayscale(0)", backdropFilter: "blur(0px)"}
                ], {
                    easing: "ease-out",
                    duration: 1250,
                    fill: "forwards"
                })
                //console.log("Ended death scene");
            }

            let PROFILE_TIMER = null;
            let _triggeredModal = null;
            window.clickProfile = (e) => {
                if (PROFILE_TIMER) return;
                modalToggled = !modalToggled;
                // if (_triggeredModal === "settings") {
                //     window.clickSettings();
                //     _triggeredModal = "profile";
                // } else {
                //     if (modalToggled) {
                //         _triggeredModal = "profile";
                //     } else _triggeredModal = null;
                // }
                if (modalToggled) {
                    let add = document.createElement("div");
                    document.body.appendChild(add);
                    add.outerHTML = profileModal;
                    //window.changeSection("graphics");
                } else {
                    let els = ["#PROF_M", "#TRIG_M"];
                    for (let el of els) {
                        let html = document.querySelector(el);
                        if (html) {
                            html.animate([
                                {transform: "scale(1)", opacity: 1},
                                {transform: "scale(.8)", opacity: 0}
                            ], {
                                duration: 250,
                                fill: "forwards"
                            })
                            PROFILE_TIMER = setTimeout(() => {
                                html?.remove();
                                PROFILE_TIMER = null;
                                _modalSection = "graphics";
                            }, 250)
                        }
                    }

                }
                // initScanlinesOpacity();
                // handleStarsInterface();
            }

            window.clickSettings = (e) => {
                if (MODAL_TIMER) return;
                _triggeredModal = "settings";
                modalToggled = !modalToggled;
                // if (_triggeredModal === "profile") {
                //     window.clickProfile();
                //     _triggeredModal = "settings";
                // } else {
                //     if (modalToggled) {
                //         _triggeredModal = "settings";
                //     } else _triggeredModal = null;
                // }
                if (modalToggled) {
                    let add = document.createElement("div");
                    document.body.appendChild(add);
                    add.outerHTML = triggerModal;
                    window.changeSection("graphics");
                } else {
                    let els = ["#PROF_M", "#TRIG_M"];
                    for (let el of els) {
                        let html = document.querySelector(el);
                        if (html) {
                            html.animate([
                                {transform: "scale(1)", opacity: 1},
                                {transform: "scale(.8)", opacity: 0}
                            ], {
                                duration: 250,
                                fill: "forwards"
                            })
                            PROFILE_TIMER = setTimeout(() => {
                                html?.remove();
                                PROFILE_TIMER = null;
                                _modalSection = "graphics";
                            }, 250)
                        }
                    }
                }
                initScanlinesOpacity();
                handleStarsInterface();
            }

            window.changeSection = (to) => {
                _modalSection = to;
                document.querySelector("#section_replacer").innerHTML = SECTIONS[_modalSection]();
                const applyIfPresent = (elem, key, value) => {
                    if (elem) {
                        try {
                            elem.style[key] = value;
                        } catch (ex) {console.warn(ex)};
                    }
                }
                for (let modal in SECTIONS) {
                    //document.querySelector("#section_" + modal).style.textDecoration = "none";
                    applyIfPresent(document.querySelector("#notch_" + modal + "_right"), "borderColor", "rgba(0,0,0,0.5) transparent transparent transparent");
                    applyIfPresent(document.querySelector("#notch_" + modal + "_left"), "borderColor", "transparent transparent rgba(0,0,0,0.5) transparent");
                    document.querySelector("#text_" + modal).style.background = "rgba(0,0,0,0.5)";
                    document.querySelector("#text_" + modal).style.color = "white";
                    document.querySelector("#text_" + modal).style.fontWeight = "400";
                }
                //document.querySelector("#section_" + to).style.textDecoration = "underline";
                applyIfPresent(document.querySelector("#notch_" + to + "_right"), "borderColor", "white transparent transparent transparent");
                applyIfPresent(document.querySelector("#notch_" + to + "_left"), "borderColor", "transparent transparent white transparent");
                document.querySelector("#text_" + to).style.background = "white";
                document.querySelector("#text_" + to).style.color = "black";
                document.querySelector("#text_" + to).style.fontWeight = "bold";
                if (to === "graphics") {
                    document.querySelector("#ui_font").value = SETTINGS.graphics.ui_font;
                    document.querySelector("#ing_font").value = SETTINGS.graphics.ing_font;
                    document.querySelector("#ing_font").style.fontFamily = SETTINGS.graphics.ing_font;
                    document.querySelector("#scanlines").checked = !!(Number(SETTINGS.graphics.scanlines));
                    document.querySelector("#noise").checked = !!(Number(SETTINGS.graphics.noise));
                    document.querySelector("#angle_indicator").checked = !!(Number(SETTINGS.graphics.angle_indicator));
                    document.querySelector("#full_bright").checked = !!(Number(SETTINGS.graphics.full_bright));
                    document.querySelector("#_3dmode").checked = !!(Number(SETTINGS.graphics._3dmode));
                    document.querySelector("#laser_lights").checked = !!(Number(SETTINGS.graphics.laser_lights));
                    document.querySelector("#high_perf_lasers").checked = !!(Number(SETTINGS.graphics.high_perf_lasers));
                    document.querySelector("#t_high_contrast").checked = !!(Number(SETTINGS.graphics.t_high_contrast));
                    document.querySelector("#centered_camera").checked = !!(Number(SETTINGS.graphics.centered_camera));
                    document.querySelector("#display_ecp_count").checked = !!(Number(SETTINGS.graphics.display_ecp_count));
                    document.querySelector("#quality").value = SETTINGS.graphics.quality;
                    document.querySelector("#lowpoly_asteroids").value = SETTINGS.graphics.low_poly.asteroids;
                    document.querySelector("#lowpoly_mines").checked = !!(Number(SETTINGS.graphics.low_poly.mines));
                    document.querySelector("#disable_stars").checked = !!(Number(SETTINGS.graphics.disable_stars));
                    document.querySelector("#disable_suns").checked = !!(Number(SETTINGS.graphics.disable_suns));
                    document.querySelector("#disable_explosions").checked = !!(Number(SETTINGS.graphics.disable_explosions));
                    document.querySelector("#change_star_colors").checked = !!(Number(SETTINGS.graphics.change_star_color));
                    document.querySelector("#change_star_colors_input").value = SETTINGS.graphics.change_star_color_value;
                    handleStarsInterface();
                } else if (to === "filters") {
                    document.querySelector("#active_filter").checked = !!(Number(SETTINGS.filters.active));
                }
            }

            window.changeSetting = (e) => {
                switch (_modalSection) {
                    case "graphics":
                        let graphics_id = e.target.id;
                        switch (graphics_id) {
                            case "disable_suns":
                            case "disable_explosions":
                                const dse_arg = graphics_id.split("_")[1];
                                const dse_value = String(+e.target.checked);
                                SETTINGS.graphics["disable_" + dse_arg] = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "disable_" + dse_arg, dse_value);
                                warnAboutPendingSettings();
                                break
                            case "change_star_colors_input":
                                const csc_value = e.target.value;
                                SETTINGS.graphics.change_star_color_value = csc_value;
                                localStorage.setItem(LS_PREFIX + "change_star_colors_value", csc_value);
                                warnAboutPendingSettings();
                                break
                            case "change_star_colors":
                                const cs_value = +e.target.checked + "";
                                SETTINGS.graphics.change_star_color = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "change_star_color", cs_value);
                                warnAboutPendingSettings();
                                handleStarsInterface();
                                break
                            case "disable_stars":
                                const ds_value = +e.target.checked + "";
                                SETTINGS.graphics.disable_stars = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "disable_stars", ds_value);
                                warnAboutPendingSettings();
                                handleStarsInterface();
                                break
                            case "high_perf_lasers":
                                const hpl = +e.target.checked + "";
                                SETTINGS.graphics.high_perf_lasers = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "high_perf_lasers", hpl);
                                warnAboutPendingSettings();
                                break
                            case "t_high_contrast":
                                const thc = +e.target.checked + "";
                                SETTINGS.graphics.t_high_contrast = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "t_high_contrast", thc);
                                warnAboutPendingSettings();
                                break
                            case "lowpoly_asteroids":
                                let lpa = e.target.value;
                                SETTINGS.graphics.quality = lpa;
                                SETTINGS.graphics.low_poly.asteroids = lpa;
                                localStorage.setItem(LS_PREFIX + "lowpoly_asteroids", lpa);
                                warnAboutPendingSettings();
                                break
                            case "lowpoly_mines":
                                const lowpoly_arg = e.target.id.split("_")[1];
                                const lp_value = String(+(e.target.checked));
                                SETTINGS.graphics.low_poly[lowpoly_arg] = lp_value;
                                localStorage.setItem(LS_PREFIX + "lowpoly_" + lowpoly_arg, lp_value);
                                //console.log(LS_PREFIX + "lowpoly_" + lowpoly_arg);
                                warnAboutPendingSettings();
                                break
                            case "quality":
                                let quality = e.target.value;
                                SETTINGS.graphics.quality = quality;
                                localStorage.setItem(LS_PREFIX + "graphics_quality", quality);
                                warnAboutPendingSettings();
                                break
                            case "scanlines_range":
                                let sr_val = e.target.value;
                                SETTINGS.graphics.scanlines_opacity = sr_val;
                                localStorage.setItem(LS_PREFIX + "graphics_scanlines_opacity", sr_val);
                                document.querySelector("#scanlines_opacity").innerText = sr_val;
                                document.querySelector(".scanline").style.opacity = +(sr_val) / 100;
                                initScanlinesOpacity();
                                break
                            case "scanlines":
                                let sl = String(+e.target.checked);
                                SETTINGS.graphics.scanlines = sl;
                                localStorage.setItem(LS_PREFIX + "graphics_scanlines", sl);
                                initScanlines();
                                initScanlinesOpacity();
                                break
                            case "laser_lights":
                                let ll = String(+e.target.checked);
                                SETTINGS.graphics.laser_lights = e.target.checked;
                                window.laser_lights = e.target.checked;
                                if (!e.target.checked) window.pointLightSettings.requiresShutdown = true;
                                localStorage.setItem(LS_PREFIX + "laser_lights", ll);
                                //warnAboutPendingSettings();
                                break;
                            case "angle_indicator":
                                let ai = String(+e.target.checked);
                                SETTINGS.graphics.angle_indicator = e.target.checked;
                                window.render_indicator = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "angle_indicator", ai);
                                //warnAboutPendingSettings();
                                break;
                            case "full_bright":
                                let fbri = String(+e.target.checked);
                                SETTINGS.graphics.full_bright = e.target.checked;
                                window.full_bright = e.target.checked;
                                toggleAmbientLight(window.full_bright);
                                localStorage.setItem(LS_PREFIX + "full_bright", fbri);
                                //warnAboutPendingSettings();
                                break;
                            case "_3dmode":
                                let td = String(+e.target.checked);
                                SETTINGS.graphics._3dmode = e.target.checked;
                                window._3dmode = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "_3dmode", td);
                                //warnAboutPendingSettings();
                                break;
                            case "centered_camera":
                                let cc = String(+e.target.checked);
                                SETTINGS.graphics.centered_camera = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "centered_camera", cc);
                                window.centered_camera = e.target.checked;
                                break;
                            case "display_ecp_count":
                                let decp = String(+e.target.checked);
                                SETTINGS.graphics.display_ecp_count = e.target.checked;
                                localStorage.setItem(LS_PREFIX + "display_ecp_count", decp);
                                window.display_ecp_count = e.target.checked;
                                break;
                            case "noise":
                                let no = String(+e.target.checked);
                                SETTINGS.graphics.noise = no;
                                localStorage.setItem(LS_PREFIX + "graphics_noise", no);
                                initNoise();
                                break
                            case "ui_font":
                                SETTINGS.graphics.ui_font = e.target.value;
                                applyCurrentUIFont();
                                break
                            case "ing_font":
                                SETTINGS.graphics.ing_font = e.target.value;
                                localStorage.setItem(LS_PREFIX + "graphics_ing_font", e.target.value);
                                document.querySelector("#ing_font").style.fontFamily = SETTINGS.graphics.ing_font;
                                warnAboutPendingSettings();
                                break
                        }
                        break
                    case "filters":
                        let arg = String(e.target.value);
                        let type = e.target.id.split("_")[0];
                        if (type === "active") {
                            SETTINGS.filters.active = !!e.target.checked;
                            localStorage.setItem(LS_PREFIX + "FILTERS_ACTIVE", String(+e.target.checked));
                            initFilters();
                            return;
                        }
                        SETTINGS.filters[type].cur = arg;
                        localStorage.setItem(LS_PREFIX + "filter_" + type, arg);
                        document.querySelector("#" + type + "_slider").textContent = arg;
                        applyAllFilters();
                        break
                }
            };

            const handleStarsInterface = () => {
                let input_div = document.querySelector("#change_star_colors_input_div");
                let color_div = document.querySelector("#change_star_colors_div");
                if (color_div) {
                    if (!SETTINGS.graphics.disable_stars) {
                        color_div.style.display = "block";
                        color_div.style.opacity = "1";
                        color_div.style.pointerEvents = "all";
                    } else {
                        color_div.style.opacity = "0.65";
                        color_div.style.pointerEvents = "none";
                        //color_div.style.display = "none";
                    }
                }
                if (input_div) {
                    if (SETTINGS.graphics.change_star_color) {
                        input_div.style.display = "flex";
                        document.querySelector("#change_star_colors_input").value = SETTINGS.graphics.change_star_color_value;
                    } else {
                        input_div.style.display = "none";
                    }
                }
            }

            const warnAboutPendingSettings = () => {
                localStorage.setItem(LS_PREFIX + "PENDING_SETTINGS", "1");
                document.querySelector("#warning_restart").style.opacity = 1;
            }

            const applyCurrentUIFont = () => {
                let arg = SETTINGS.graphics.ui_font;
                localStorage.setItem(LS_PREFIX + "graphics_ui_font", arg);
                document.documentElement.style.setProperty('--def-font', `"${arg}", "Play", sans-serif`);
            }

            const applyAllFilters = () => {
                if (!SETTINGS.filters.active) return;

                let applyBackdrops = "";

                for (let key of Object.keys(SETTINGS.filters)) {
                    if (key.length > 3) continue;

                    let ref = SETTINGS.filters[key];
                    if (ref.def === ref.cur) continue;

                    let unit = ref.unit ? ref.unit : "%";

                    applyBackdrops += (ref.setting + "(" + ref.cur + unit + ") ");
                }

                document.querySelector(".filters").style.backdropFilter = applyBackdrops;
            }

            const initFilters = () => {
                if (!SETTINGS.filters.active) {
                    const filters = document.querySelector(".filters");
                    if (filters) filters.remove();
                    return;
                }
                const filters = document.createElement('div');
                filters.className = 'filters';

                document.body.appendChild(filters);
                filters.style.zIndex = "999999";

                applyAllFilters();
            }

            //await announceLoadJob("Initializing settings...");
            let SETTINGS = {
                graphics: {
                    quality: localStorage.getItem(LS_PREFIX + "graphics_quality") ?? "normal",
                    ui_font: localStorage.getItem(LS_PREFIX + "graphics_ui_font") ?? "Pixelify Sans",
                    ing_font: localStorage.getItem(LS_PREFIX + "graphics_ing_font") ?? "Pixelify Sans",
                    display_ecp_count: localStorage.getItem(LS_PREFIX + "display_ecp_count") ? (localStorage.getItem(LS_PREFIX + "display_ecp_count") === "1") : true,
                    scanlines: localStorage.getItem(LS_PREFIX + "graphics_scanlines") ?? "1",
                    scanlines_opacity: localStorage.getItem(LS_PREFIX + "graphics_scanlines_opacity") ?? "35",
                    disable_stars: localStorage.getItem(LS_PREFIX + "disable_stars") ? (localStorage.getItem(LS_PREFIX + "disable_stars") === "1") : true,
                    change_star_color: localStorage.getItem(LS_PREFIX + "change_star_color") ? (localStorage.getItem(LS_PREFIX + "change_star_color") === "1") : true,
                    change_star_color_value: localStorage.getItem(LS_PREFIX + "change_star_colors_value") ?? "FFFFFF",
                    disable_suns: localStorage.getItem(LS_PREFIX + "disable_suns") ? (localStorage.getItem(LS_PREFIX + "disable_suns") === "1") : true,
                    disable_explosions: localStorage.getItem(LS_PREFIX + "disable_explosions") ? (localStorage.getItem(LS_PREFIX + "disable_explosions") === "1") : false,
                    angle_indicator: localStorage.getItem(LS_PREFIX + "angle_indicator") ? (localStorage.getItem(LS_PREFIX + "angle_indicator") === "1") : false,
                    full_bright: localStorage.getItem(LS_PREFIX + "full_bright") ? (localStorage.getItem(LS_PREFIX + "full_bright") === "1") : false,
                    _3dmode: localStorage.getItem(LS_PREFIX + "_3dmode") ? (localStorage.getItem(LS_PREFIX + "_3dmode") === "1") : false,
                    laser_lights: localStorage.getItem(LS_PREFIX + "laser_lights") ? (localStorage.getItem(LS_PREFIX + "laser_lights") === "1") : false,
                    high_perf_lasers: localStorage.getItem(LS_PREFIX + "high_perf_lasers") ? (localStorage.getItem(LS_PREFIX + "high_perf_lasers") === "1") : false,
                    t_high_contrast: localStorage.getItem(LS_PREFIX + "t_high_contrast") ? (localStorage.getItem(LS_PREFIX + "t_high_contrast") === "1") : false,
                    centered_camera: localStorage.getItem(LS_PREFIX + "centered_camera") ? (localStorage.getItem(LS_PREFIX + "centered_camera") === "1") : false,
                    noise: localStorage.getItem(LS_PREFIX + "graphics_noise") ?? "1",
                    low_poly: {
                        asteroids: localStorage.getItem(LS_PREFIX + "lowpoly_asteroids") ?? "normal",
                        mines:  localStorage.getItem(LS_PREFIX + "lowpoly_mines") ? (localStorage.getItem(LS_PREFIX + "lowpoly_mines") === "1") : false
                    }
                },
                filters: {
                    active: localStorage.getItem(LS_PREFIX + "FILTERS_ACTIVE") ? (localStorage.getItem(LS_PREFIX + "FILTERS_ACTIVE") === "1") : true,
                    sat: {
                        def: "100",
                        cur: localStorage.getItem(LS_PREFIX + "filter_sat") ?? "125",
                        setting: "saturate"
                    },
                    inv: {
                        def: "0",
                        cur: localStorage.getItem(LS_PREFIX + "filter_inv") ??  "0",
                        setting: "invert"
                    },
                    bri: {
                        def: "100",
                        cur: localStorage.getItem(LS_PREFIX + "filter_bri") ??  "105",
                        setting: "brightness"
                    },
                    con: {
                        def: "100",
                        cur: localStorage.getItem(LS_PREFIX + "filter_con") ??  "105",
                        setting: "contrast"
                    },
                    hue: {
                        def: "0",
                        cur: localStorage.getItem(LS_PREFIX + "filter_hue") ??  "0",
                        setting: "hue-rotate",
                        unit: "deg"
                    },
                    sep: {
                        def: "0",
                        cur: localStorage.getItem(LS_PREFIX + "filter_sep") ??  "0",
                        setting: "sepia"
                    },
                    gra: {
                        def: "0",
                        cur: localStorage.getItem(LS_PREFIX + "filter_gra") ??  "0",
                        setting: "grayscale"
                    }
                }
            }
            window.centered_camera = SETTINGS.graphics.centered_camera;
            window.display_ecp_count = SETTINGS.graphics.display_ecp_count;
            window.render_indicator = SETTINGS.graphics.angle_indicator;
            window.full_bright = SETTINGS.graphics.full_bright;
            window._3dmode = SETTINGS.graphics._3dmode;
            window.laser_lights = SETTINGS.graphics.laser_lights;

            const initScanlinesOpacity = () => {
                let item = document.querySelector("#scanlines_opacity_div");
                if (SETTINGS.graphics.scanlines === "1") {
                    if (item) {
                        item.style.display = "block";
                    }
                } else {
                    if (item) {
                        item.style.display = "none";
                    }
                }
            }

            const initScanlines = () => {
                if (SETTINGS.graphics.scanlines === "1") {
                    const scanlineDiv = document.createElement('div');
                    scanlineDiv.className = 'scanline';
                    document.body.appendChild(scanlineDiv);
                    scanlineDiv.style.opacity = +(SETTINGS.graphics.scanlines_opacity) / 100;
                } else {
                    const scanlineDiv = document.querySelector(".scanline");
                    if (scanlineDiv) scanlineDiv.remove();
                }
            }

            const initNoise = () => {
                if (SETTINGS.graphics.noise === "1") {
                    const nbg = document.createElement('div');
                    nbg.className = 'nbg';
                    document.body.appendChild(nbg);
                } else {
                    const nbg = document.querySelector(".nbg");
                    if (nbg) nbg.remove();
                }
            }



            if (!starSRC) {
                return abortAndReport("NO SOURCE FOUND", "CHECK YOUR INTERNET CONNECTION");
            }

            const performReplacements = () => {
                // ! Function for skipping replacements moved below textureInsert for assignment

                //await announceLoadJob("Initializing badges...");
                const badgeInsert = {
                    "fox": {
                        name: "Fox",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/Fox.jpg"
                    },
                    "hostile": {
                        name: "Hostile",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/unidentified.png"
                    },
                    "vdw": {
                        name: "Verdant Dawn",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/lilas.png"
                    },
                    "cbvng": {
                        name: "Celestial Biovanguard",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/space%20marines.png"
                    },
                    "ukf": {
                        name: "A. Ironclad's Group",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/ironclad.png"
                    },
                    "rord": {
                        name: "Ruggül Order",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/legion.png"
                    },
                    "sera": {
                        name: "Steel Seraphim",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/seraphim.png"
                    },
                    "aaf": {
                        name: "Allied Airforce",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/allied%20airforces.png"
                    },
                    "biomorph": {
                        name: "Biomorph Cult",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/biomorph.png"
                    },
                    "https://starblast.io/ecp/iridium_ore.jpg": {
                        name: "Nanoray",
                        URL: "https://starblast.io/ecp/iridium_ore.jpg"
                    },
                    "sarepta": {
                        name: "Sarepta Restorationists",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/sarepta.png"
                    },
                    "jonkler": {
                        name: "Jonkler",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/jonkler.png"
                    },
                    "urahara": {
                        name: "Kisuke Urahara",
                        URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/urahara%203.png"
                    },
                    // "tester": {
                    //     name: "Tester",
                    //     URL: "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/200w.gif"
                    // }
                }

                //await announceLoadJob("Initializing textures...");
                const textureInsert = {
                    "fullcolor": {
                        name: "Fullcolor",
                        funcName: "buildFullColorMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(0,100%,50%)"),s.addColorStop(.5,"hsl(0,100%,80%)"),s.addColorStop(.5,"hsl(10,100%,30%)"),s.addColorStop(1,"hsl(0,100%,50%)");`,
                        func: null
                    },
                    "x27": {
                        name: "X-27",
                        funcName: "buildX27Material",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(180,100%,50%)"),s.addColorStop(.5,"hsl(180,100%,80%)"),s.addColorStop(.5,"hsl(190,100%,30%)"),s.addColorStop(1,"hsl(180,100%,50%)");`,
                        func: null
                    },
                    "magnesium": {
                        name: "Magnesium",
                        funcName: "buildMagnesiumMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(180,100%,100%)"),s.addColorStop(.5,"hsl(180,100%,100%)"),s.addColorStop(.5,"hsl(190,100%,100%)"),s.addColorStop(1,"hsl(180,100%,100%)");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular:0xDDDDDD,
                                    shininess:5,
                                    bumpScale:.1,
                                    color:0xCCCCCC,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,.75,1),
                                    emissiveMap:l0I1I
                                }
                            )
                        `
                    },
                    "contrastMaterial": {
                        name: "contrastMaterial",
                        choosable: false,
                        funcName: "buildContrastMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(180,100%,100%)"),s.addColorStop(.5,"hsl(180,100%,100%)"),s.addColorStop(.5,"hsl(190,100%,100%)"),s.addColorStop(1,"hsl(180,100%,100%)");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular:6316128,
                                    shininess:0,
                                    bumpScale:.1,
                                    color:l0Il1.hsvToRgbHex(this.hue,.85,1),
                                    emissive:l0Il1.hsvToRgbHex(this.hue,.85,1),
                                    emissiveMap:OOlO0
                                }
                            )
                        `
                    },
                    /**
                     * return this.material=new THREE.MeshPhongMaterial
                     * {map:llIl1,
                     * bumpMap:llIl1,
                     * specularMap:llIl1,
                     * specular:6316128,
                     * shininess:20,
                     * bumpScale:.1,
                     * color:6316128,
                     * emissive:l0Il1.hsvToRgbHex(this.hue,.5,1),
                     * emissiveMap:OOlO0})
                     */
                    "_vid_borderlands": {
                        name: "Borderlands",
                        ignore: false,
                        funcName: "buildTrenchMaterial",
                        video: {
                            thumbnail: `s=t.createLinearGradient(0,0,i * 2,0),s.addColorStop(0,"black"),s.addColorStop(.5,"black"),s.addColorStop(.5,"white");`,
                            steps: [
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9999999999999999,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9999999999999999,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.025,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.025,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9749999999999999,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9749999999999999,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.05,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.05,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9499999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9499999999999998,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.07500000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.07500000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9249999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.9249999999999998,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.1,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.1,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8999999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8999999999999998,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.125,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.125,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8749999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8749999999999998,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.15,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.15,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8499999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8499999999999998,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.175,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.175,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8249999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.8249999999999997,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.19999999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.19999999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7999999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7999999999999997,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.22499999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.22499999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7749999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7749999999999997,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.24999999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.24999999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7499999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7499999999999997,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.27499999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.27499999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7249999999999996,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.7249999999999996,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.3,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.3,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6999999999999996,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6999999999999996,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.325,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.325,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6749999999999996,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6749999999999996,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.35000000000000003,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.35000000000000003,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6499999999999996,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6499999999999996,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.37500000000000006,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.37500000000000006,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6249999999999996,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.6249999999999996,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4000000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4000000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5999999999999995,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5999999999999995,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4250000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4250000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5749999999999995,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5749999999999995,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4500000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.4500000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5499999999999995,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5499999999999995,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.47500000000000014,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.47500000000000014,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5249999999999995,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.5249999999999995,\"hsl(0,0%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,100%)\");",

                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9999999999999999,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9999999999999999,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.025,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.025,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9749999999999999,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9749999999999999,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.05,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.05,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9499999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9499999999999998,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.07500000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.07500000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9249999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.9249999999999998,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.1,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.1,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8999999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8999999999999998,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.125,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.125,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8749999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8749999999999998,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.15,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.15,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8499999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8499999999999998,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.175,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.175,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8249999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.8249999999999997,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.19999999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.19999999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7999999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7999999999999997,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.22499999999999998,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.22499999999999998,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7749999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7749999999999997,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.24999999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.24999999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7499999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7499999999999997,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.27499999999999997,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.27499999999999997,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7249999999999996,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.7249999999999996,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.3,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.3,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6999999999999996,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6999999999999996,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.325,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.325,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6749999999999996,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6749999999999996,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.35000000000000003,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.35000000000000003,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6499999999999996,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6499999999999996,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.37500000000000006,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.37500000000000006,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6249999999999996,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.6249999999999996,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4000000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4000000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5999999999999995,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5999999999999995,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4250000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4250000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5749999999999995,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5749999999999995,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4500000000000001,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.4500000000000001,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5499999999999995,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5499999999999995,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.47500000000000014,\"hsl(0,100%,0%)\"),\ns.addColorStop(0.47500000000000014,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5249999999999995,\"hsl(0,100%,100%)\"),\ns.addColorStop(0.5249999999999995,\"hsl(0,0%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",
                                "s=t.createLinearGradient(0,0,i*2,0),\ns.addColorStop(0,\"hsl(0,100%,0%)\");",

                            ]
                        },
                        material: `s=t.createLinearGradient(0,0,i * 2,0),s.addColorStop(0,"black"),s.addColorStop(.5,"black"),s.addColorStop(.5,"white");`,
                        func: `

                            // this.O0OOO.castShadow = false;
                            // this.O0OOO.receiveShadow = false;
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular:0x999999,
                                    shininess:0,
                                    bumpScale:100,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,1,.5),
                                    emissiveMap:l0I1I
                                }
                            )
                        `
                    },
                    // "valor": {
                    //     name: "Valor",
                    //     funcName: "buildValorMaterial",
                    //     material: `s=t.createLinearGradient(0,0,i * 2,0),s.addColorStop(0,"white"),s.addColorStop(.5,"red"),s.addColorStop(.99,"white");`,
                    //     func: `
                    //         return this.material=new THREE.MeshPhongMaterial(
                    //             {
                    //                 map:llIl1,
                    //                 bumpMap:llIl1,
                    //                 shininess:0,
                    //                 bumpScale:1,
                    //                 color:l0Il1.hsvToRgbHex(this.hue,.6,.6),
                    //                 emissive:0x000000,

                    //             }
                    //         )
                    //     `
                    // },
                    "skeleton": {
                        name: "Skeleton",
                        funcName: "buildSkeletonMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0, "white"),s.addColorStop(.2, "hsl(0,0%,10%)"),s.addColorStop(.2, "white"),s.addColorStop(.4, "hsl(0,0%,10%)"),s.addColorStop(.4, "white"),s.addColorStop(.6, "hsl(0,0%,10%)"),s.addColorStop(0.6, "white"),s.addColorStop(0.8, "hsl(0,0%,10%)"),s.addColorStop(0.8, "white"),s.addColorStop(1, "hsl(0,0%,10%)");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular:0xCCCCCC,
                                    wireframe: true,
                                    shininess:5,
                                    bumpScale:-10,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,1,.5),
                                    emissiveMap:OOlO0
                                }
                            )
                        `
                    },
                    "_vid_noir": {
                        name: "Noir",
                        funcName: "buildNoirMaterial",
                        video: {
                            thumbnail: 1,
                            steps: [
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0, \"yellow\"),\n                        s.addColorStop(0.1, \"yellow\"),\n                        s.addColorStop(0.1, \"black\"),\n                        s.addColorStop(0.2, \"black\"),\n                        s.addColorStop(0.2, \"yellow\"),\n                        s.addColorStop(0.3, \"yellow\"),\n                        s.addColorStop(0.3, \"black\"),\n                        s.addColorStop(0.4, \"black\"),\n                        s.addColorStop(0.4, \"yellow\"),\n                        s.addColorStop(0.5, \"yellow\"),\n                        s.addColorStop(0.5, \"black\"),\n                        s.addColorStop(0.6, \"black\"),\n                        s.addColorStop(0.6, \"yellow\"),\n                        s.addColorStop(0.7, \"yellow\"),\n                        s.addColorStop(0.7, \"black\"),\n                        s.addColorStop(0.8, \"black\"),\n                        s.addColorStop(0.8, \"yellow\"),\n                        s.addColorStop(0.9, \"yellow\"),\n                        s.addColorStop(0.9, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.00625, \"yellow\"),\n                        s.addColorStop(0.10625000000000001, \"yellow\"),\n                        s.addColorStop(0.10625000000000001, \"black\"),\n                        s.addColorStop(0.20625000000000002, \"black\"),\n                        s.addColorStop(0.20625000000000002, \"yellow\"),\n                        s.addColorStop(0.30624999999999997, \"yellow\"),\n                        s.addColorStop(0.30624999999999997, \"black\"),\n                        s.addColorStop(0.40625, \"black\"),\n                        s.addColorStop(0.40625, \"yellow\"),\n                        s.addColorStop(0.50625, \"yellow\"),\n                        s.addColorStop(0.50625, \"black\"),\n                        s.addColorStop(0.60625, \"black\"),\n                        s.addColorStop(0.60625, \"yellow\"),\n                        s.addColorStop(0.7062499999999999, \"yellow\"),\n                        s.addColorStop(0.7062499999999999, \"black\"),\n                        s.addColorStop(0.80625, \"black\"),\n                        s.addColorStop(0.80625, \"yellow\"),\n                        s.addColorStop(0.90625, \"yellow\"),\n                        s.addColorStop(0.90625, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.0125, \"yellow\"),\n                        s.addColorStop(0.1125, \"yellow\"),\n                        s.addColorStop(0.1125, \"black\"),\n                        s.addColorStop(0.21250000000000002, \"black\"),\n                        s.addColorStop(0.21250000000000002, \"yellow\"),\n                        s.addColorStop(0.3125, \"yellow\"),\n                        s.addColorStop(0.3125, \"black\"),\n                        s.addColorStop(0.41250000000000003, \"black\"),\n                        s.addColorStop(0.41250000000000003, \"yellow\"),\n                        s.addColorStop(0.5125, \"yellow\"),\n                        s.addColorStop(0.5125, \"black\"),\n                        s.addColorStop(0.6124999999999999, \"black\"),\n                        s.addColorStop(0.6124999999999999, \"yellow\"),\n                        s.addColorStop(0.7124999999999999, \"yellow\"),\n                        s.addColorStop(0.7124999999999999, \"black\"),\n                        s.addColorStop(0.8125, \"black\"),\n                        s.addColorStop(0.8125, \"yellow\"),\n                        s.addColorStop(0.9125, \"yellow\"),\n                        s.addColorStop(0.9125, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.018750000000000003, \"yellow\"),\n                        s.addColorStop(0.11875000000000001, \"yellow\"),\n                        s.addColorStop(0.11875000000000001, \"black\"),\n                        s.addColorStop(0.21875, \"black\"),\n                        s.addColorStop(0.21875, \"yellow\"),\n                        s.addColorStop(0.31875, \"yellow\"),\n                        s.addColorStop(0.31875, \"black\"),\n                        s.addColorStop(0.41875, \"black\"),\n                        s.addColorStop(0.41875, \"yellow\"),\n                        s.addColorStop(0.51875, \"yellow\"),\n                        s.addColorStop(0.51875, \"black\"),\n                        s.addColorStop(0.61875, \"black\"),\n                        s.addColorStop(0.61875, \"yellow\"),\n                        s.addColorStop(0.71875, \"yellow\"),\n                        s.addColorStop(0.71875, \"black\"),\n                        s.addColorStop(0.8187500000000001, \"black\"),\n                        s.addColorStop(0.8187500000000001, \"yellow\"),\n                        s.addColorStop(0.9187500000000001, \"yellow\"),\n                        s.addColorStop(0.9187500000000001, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.025, \"yellow\"),\n                        s.addColorStop(0.125, \"yellow\"),\n                        s.addColorStop(0.125, \"black\"),\n                        s.addColorStop(0.225, \"black\"),\n                        s.addColorStop(0.225, \"yellow\"),\n                        s.addColorStop(0.325, \"yellow\"),\n                        s.addColorStop(0.325, \"black\"),\n                        s.addColorStop(0.42500000000000004, \"black\"),\n                        s.addColorStop(0.42500000000000004, \"yellow\"),\n                        s.addColorStop(0.525, \"yellow\"),\n                        s.addColorStop(0.525, \"black\"),\n                        s.addColorStop(0.625, \"black\"),\n                        s.addColorStop(0.625, \"yellow\"),\n                        s.addColorStop(0.725, \"yellow\"),\n                        s.addColorStop(0.725, \"black\"),\n                        s.addColorStop(0.8250000000000001, \"black\"),\n                        s.addColorStop(0.8250000000000001, \"yellow\"),\n                        s.addColorStop(0.925, \"yellow\"),\n                        s.addColorStop(0.925, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.03125, \"yellow\"),\n                        s.addColorStop(0.13125, \"yellow\"),\n                        s.addColorStop(0.13125, \"black\"),\n                        s.addColorStop(0.23125, \"black\"),\n                        s.addColorStop(0.23125, \"yellow\"),\n                        s.addColorStop(0.33125, \"yellow\"),\n                        s.addColorStop(0.33125, \"black\"),\n                        s.addColorStop(0.43125, \"black\"),\n                        s.addColorStop(0.43125, \"yellow\"),\n                        s.addColorStop(0.53125, \"yellow\"),\n                        s.addColorStop(0.53125, \"black\"),\n                        s.addColorStop(0.63125, \"black\"),\n                        s.addColorStop(0.63125, \"yellow\"),\n                        s.addColorStop(0.73125, \"yellow\"),\n                        s.addColorStop(0.73125, \"black\"),\n                        s.addColorStop(0.83125, \"black\"),\n                        s.addColorStop(0.83125, \"yellow\"),\n                        s.addColorStop(0.93125, \"yellow\"),\n                        s.addColorStop(0.93125, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.0375, \"yellow\"),\n                        s.addColorStop(0.1375, \"yellow\"),\n                        s.addColorStop(0.1375, \"black\"),\n                        s.addColorStop(0.23750000000000002, \"black\"),\n                        s.addColorStop(0.23750000000000002, \"yellow\"),\n                        s.addColorStop(0.33749999999999997, \"yellow\"),\n                        s.addColorStop(0.33749999999999997, \"black\"),\n                        s.addColorStop(0.4375, \"black\"),\n                        s.addColorStop(0.4375, \"yellow\"),\n                        s.addColorStop(0.5375, \"yellow\"),\n                        s.addColorStop(0.5375, \"black\"),\n                        s.addColorStop(0.6375, \"black\"),\n                        s.addColorStop(0.6375, \"yellow\"),\n                        s.addColorStop(0.7374999999999999, \"yellow\"),\n                        s.addColorStop(0.7374999999999999, \"black\"),\n                        s.addColorStop(0.8375, \"black\"),\n                        s.addColorStop(0.8375, \"yellow\"),\n                        s.addColorStop(0.9375, \"yellow\"),\n                        s.addColorStop(0.9375, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.04375, \"yellow\"),\n                        s.addColorStop(0.14375, \"yellow\"),\n                        s.addColorStop(0.14375, \"black\"),\n                        s.addColorStop(0.24375000000000002, \"black\"),\n                        s.addColorStop(0.24375000000000002, \"yellow\"),\n                        s.addColorStop(0.34375, \"yellow\"),\n                        s.addColorStop(0.34375, \"black\"),\n                        s.addColorStop(0.44375000000000003, \"black\"),\n                        s.addColorStop(0.44375000000000003, \"yellow\"),\n                        s.addColorStop(0.54375, \"yellow\"),\n                        s.addColorStop(0.54375, \"black\"),\n                        s.addColorStop(0.6437499999999999, \"black\"),\n                        s.addColorStop(0.6437499999999999, \"yellow\"),\n                        s.addColorStop(0.7437499999999999, \"yellow\"),\n                        s.addColorStop(0.7437499999999999, \"black\"),\n                        s.addColorStop(0.84375, \"black\"),\n                        s.addColorStop(0.84375, \"yellow\"),\n                        s.addColorStop(0.94375, \"yellow\"),\n                        s.addColorStop(0.94375, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.049999999999999996, \"yellow\"),\n                        s.addColorStop(0.15, \"yellow\"),\n                        s.addColorStop(0.15, \"black\"),\n                        s.addColorStop(0.25, \"black\"),\n                        s.addColorStop(0.25, \"yellow\"),\n                        s.addColorStop(0.35, \"yellow\"),\n                        s.addColorStop(0.35, \"black\"),\n                        s.addColorStop(0.45, \"black\"),\n                        s.addColorStop(0.45, \"yellow\"),\n                        s.addColorStop(0.55, \"yellow\"),\n                        s.addColorStop(0.55, \"black\"),\n                        s.addColorStop(0.65, \"black\"),\n                        s.addColorStop(0.65, \"yellow\"),\n                        s.addColorStop(0.75, \"yellow\"),\n                        s.addColorStop(0.75, \"black\"),\n                        s.addColorStop(0.8500000000000001, \"black\"),\n                        s.addColorStop(0.8500000000000001, \"yellow\"),\n                        s.addColorStop(0.9500000000000001, \"yellow\"),\n                        s.addColorStop(0.9500000000000001, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.056249999999999994, \"yellow\"),\n                        s.addColorStop(0.15625, \"yellow\"),\n                        s.addColorStop(0.15625, \"black\"),\n                        s.addColorStop(0.25625, \"black\"),\n                        s.addColorStop(0.25625, \"yellow\"),\n                        s.addColorStop(0.35624999999999996, \"yellow\"),\n                        s.addColorStop(0.35624999999999996, \"black\"),\n                        s.addColorStop(0.45625000000000004, \"black\"),\n                        s.addColorStop(0.45625000000000004, \"yellow\"),\n                        s.addColorStop(0.55625, \"yellow\"),\n                        s.addColorStop(0.55625, \"black\"),\n                        s.addColorStop(0.65625, \"black\"),\n                        s.addColorStop(0.65625, \"yellow\"),\n                        s.addColorStop(0.75625, \"yellow\"),\n                        s.addColorStop(0.75625, \"black\"),\n                        s.addColorStop(0.8562500000000001, \"black\"),\n                        s.addColorStop(0.8562500000000001, \"yellow\"),\n                        s.addColorStop(0.95625, \"yellow\"),\n                        s.addColorStop(0.95625, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.06249999999999999, \"yellow\"),\n                        s.addColorStop(0.1625, \"yellow\"),\n                        s.addColorStop(0.1625, \"black\"),\n                        s.addColorStop(0.2625, \"black\"),\n                        s.addColorStop(0.2625, \"yellow\"),\n                        s.addColorStop(0.3625, \"yellow\"),\n                        s.addColorStop(0.3625, \"black\"),\n                        s.addColorStop(0.4625, \"black\"),\n                        s.addColorStop(0.4625, \"yellow\"),\n                        s.addColorStop(0.5625, \"yellow\"),\n                        s.addColorStop(0.5625, \"black\"),\n                        s.addColorStop(0.6625, \"black\"),\n                        s.addColorStop(0.6625, \"yellow\"),\n                        s.addColorStop(0.7625, \"yellow\"),\n                        s.addColorStop(0.7625, \"black\"),\n                        s.addColorStop(0.8625, \"black\"),\n                        s.addColorStop(0.8625, \"yellow\"),\n                        s.addColorStop(0.9625, \"yellow\"),\n                        s.addColorStop(0.9625, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.06874999999999999, \"yellow\"),\n                        s.addColorStop(0.16875, \"yellow\"),\n                        s.addColorStop(0.16875, \"black\"),\n                        s.addColorStop(0.26875, \"black\"),\n                        s.addColorStop(0.26875, \"yellow\"),\n                        s.addColorStop(0.36874999999999997, \"yellow\"),\n                        s.addColorStop(0.36874999999999997, \"black\"),\n                        s.addColorStop(0.46875, \"black\"),\n                        s.addColorStop(0.46875, \"yellow\"),\n                        s.addColorStop(0.56875, \"yellow\"),\n                        s.addColorStop(0.56875, \"black\"),\n                        s.addColorStop(0.66875, \"black\"),\n                        s.addColorStop(0.66875, \"yellow\"),\n                        s.addColorStop(0.7687499999999999, \"yellow\"),\n                        s.addColorStop(0.7687499999999999, \"black\"),\n                        s.addColorStop(0.86875, \"black\"),\n                        s.addColorStop(0.86875, \"yellow\"),\n                        s.addColorStop(0.96875, \"yellow\"),\n                        s.addColorStop(0.96875, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.075, \"yellow\"),\n                        s.addColorStop(0.175, \"yellow\"),\n                        s.addColorStop(0.175, \"black\"),\n                        s.addColorStop(0.275, \"black\"),\n                        s.addColorStop(0.275, \"yellow\"),\n                        s.addColorStop(0.375, \"yellow\"),\n                        s.addColorStop(0.375, \"black\"),\n                        s.addColorStop(0.47500000000000003, \"black\"),\n                        s.addColorStop(0.47500000000000003, \"yellow\"),\n                        s.addColorStop(0.575, \"yellow\"),\n                        s.addColorStop(0.575, \"black\"),\n                        s.addColorStop(0.6749999999999999, \"black\"),\n                        s.addColorStop(0.6749999999999999, \"yellow\"),\n                        s.addColorStop(0.7749999999999999, \"yellow\"),\n                        s.addColorStop(0.7749999999999999, \"black\"),\n                        s.addColorStop(0.875, \"black\"),\n                        s.addColorStop(0.875, \"yellow\"),\n                        s.addColorStop(0.975, \"yellow\"),\n                        s.addColorStop(0.975, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.08125, \"yellow\"),\n                        s.addColorStop(0.18125000000000002, \"yellow\"),\n                        s.addColorStop(0.18125000000000002, \"black\"),\n                        s.addColorStop(0.28125, \"black\"),\n                        s.addColorStop(0.28125, \"yellow\"),\n                        s.addColorStop(0.38125, \"yellow\"),\n                        s.addColorStop(0.38125, \"black\"),\n                        s.addColorStop(0.48125, \"black\"),\n                        s.addColorStop(0.48125, \"yellow\"),\n                        s.addColorStop(0.58125, \"yellow\"),\n                        s.addColorStop(0.58125, \"black\"),\n                        s.addColorStop(0.68125, \"black\"),\n                        s.addColorStop(0.68125, \"yellow\"),\n                        s.addColorStop(0.78125, \"yellow\"),\n                        s.addColorStop(0.78125, \"black\"),\n                        s.addColorStop(0.8812500000000001, \"black\"),\n                        s.addColorStop(0.8812500000000001, \"yellow\"),\n                        s.addColorStop(0.9812500000000001, \"yellow\"),\n                        s.addColorStop(0.9812500000000001, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.08750000000000001, \"yellow\"),\n                        s.addColorStop(0.1875, \"yellow\"),\n                        s.addColorStop(0.1875, \"black\"),\n                        s.addColorStop(0.28750000000000003, \"black\"),\n                        s.addColorStop(0.28750000000000003, \"yellow\"),\n                        s.addColorStop(0.3875, \"yellow\"),\n                        s.addColorStop(0.3875, \"black\"),\n                        s.addColorStop(0.48750000000000004, \"black\"),\n                        s.addColorStop(0.48750000000000004, \"yellow\"),\n                        s.addColorStop(0.5875, \"yellow\"),\n                        s.addColorStop(0.5875, \"black\"),\n                        s.addColorStop(0.6875, \"black\"),\n                        s.addColorStop(0.6875, \"yellow\"),\n                        s.addColorStop(0.7875, \"yellow\"),\n                        s.addColorStop(0.7875, \"black\"),\n                        s.addColorStop(0.8875000000000001, \"black\"),\n                        s.addColorStop(0.8875000000000001, \"yellow\"),\n                        s.addColorStop(0.9875, \"yellow\"),\n                        s.addColorStop(0.9875, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.09375000000000001, \"yellow\"),\n                        s.addColorStop(0.19375000000000003, \"yellow\"),\n                        s.addColorStop(0.19375000000000003, \"black\"),\n                        s.addColorStop(0.29375, \"black\"),\n                        s.addColorStop(0.29375, \"yellow\"),\n                        s.addColorStop(0.39375, \"yellow\"),\n                        s.addColorStop(0.39375, \"black\"),\n                        s.addColorStop(0.49375, \"black\"),\n                        s.addColorStop(0.49375, \"yellow\"),\n                        s.addColorStop(0.59375, \"yellow\"),\n                        s.addColorStop(0.59375, \"black\"),\n                        s.addColorStop(0.69375, \"black\"),\n                        s.addColorStop(0.69375, \"yellow\"),\n                        s.addColorStop(0.79375, \"yellow\"),\n                        s.addColorStop(0.79375, \"black\"),\n                        s.addColorStop(0.89375, \"black\"),\n                        s.addColorStop(0.89375, \"yellow\"),\n                        s.addColorStop(0.99375, \"yellow\"),\n                        s.addColorStop(0.99375, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.10000000000000002, \"yellow\"),\n                        s.addColorStop(0.2, \"yellow\"),\n                        s.addColorStop(0.2, \"black\"),\n                        s.addColorStop(0.30000000000000004, \"black\"),\n                        s.addColorStop(0.30000000000000004, \"yellow\"),\n                        s.addColorStop(0.4, \"yellow\"),\n                        s.addColorStop(0.4, \"black\"),\n                        s.addColorStop(0.5, \"black\"),\n                        s.addColorStop(0.5, \"yellow\"),\n                        s.addColorStop(0.6, \"yellow\"),\n                        s.addColorStop(0.6, \"black\"),\n                        s.addColorStop(0.7, \"black\"),\n                        s.addColorStop(0.7, \"yellow\"),\n                        s.addColorStop(0.7999999999999999, \"yellow\"),\n                        s.addColorStop(0.7999999999999999, \"black\"),\n                        s.addColorStop(0.9, \"black\"),\n                        s.addColorStop(0.9, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.10625000000000002, \"yellow\"),\n                        s.addColorStop(0.20625000000000004, \"yellow\"),\n                        s.addColorStop(0.20625000000000004, \"black\"),\n                        s.addColorStop(0.30625, \"black\"),\n                        s.addColorStop(0.30625, \"yellow\"),\n                        s.addColorStop(0.40625, \"yellow\"),\n                        s.addColorStop(0.40625, \"black\"),\n                        s.addColorStop(0.5062500000000001, \"black\"),\n                        s.addColorStop(0.5062500000000001, \"yellow\"),\n                        s.addColorStop(0.6062500000000001, \"yellow\"),\n                        s.addColorStop(0.6062500000000001, \"black\"),\n                        s.addColorStop(0.70625, \"black\"),\n                        s.addColorStop(0.70625, \"yellow\"),\n                        s.addColorStop(0.80625, \"yellow\"),\n                        s.addColorStop(0.80625, \"black\"),\n                        s.addColorStop(0.9062500000000001, \"black\"),\n                        s.addColorStop(0.9062500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.11250000000000003, \"yellow\"),\n                        s.addColorStop(0.21250000000000002, \"yellow\"),\n                        s.addColorStop(0.21250000000000002, \"black\"),\n                        s.addColorStop(0.31250000000000006, \"black\"),\n                        s.addColorStop(0.31250000000000006, \"yellow\"),\n                        s.addColorStop(0.41250000000000003, \"yellow\"),\n                        s.addColorStop(0.41250000000000003, \"black\"),\n                        s.addColorStop(0.5125000000000001, \"black\"),\n                        s.addColorStop(0.5125000000000001, \"yellow\"),\n                        s.addColorStop(0.6125, \"yellow\"),\n                        s.addColorStop(0.6125, \"black\"),\n                        s.addColorStop(0.7125, \"black\"),\n                        s.addColorStop(0.7125, \"yellow\"),\n                        s.addColorStop(0.8125, \"yellow\"),\n                        s.addColorStop(0.8125, \"black\"),\n                        s.addColorStop(0.9125000000000001, \"black\"),\n                        s.addColorStop(0.9125000000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.11875000000000004, \"yellow\"),\n                        s.addColorStop(0.21875000000000006, \"yellow\"),\n                        s.addColorStop(0.21875000000000006, \"black\"),\n                        s.addColorStop(0.31875000000000003, \"black\"),\n                        s.addColorStop(0.31875000000000003, \"yellow\"),\n                        s.addColorStop(0.41875, \"yellow\"),\n                        s.addColorStop(0.41875, \"black\"),\n                        s.addColorStop(0.51875, \"black\"),\n                        s.addColorStop(0.51875, \"yellow\"),\n                        s.addColorStop(0.61875, \"yellow\"),\n                        s.addColorStop(0.61875, \"black\"),\n                        s.addColorStop(0.71875, \"black\"),\n                        s.addColorStop(0.71875, \"yellow\"),\n                        s.addColorStop(0.81875, \"yellow\"),\n                        s.addColorStop(0.81875, \"black\"),\n                        s.addColorStop(0.9187500000000001, \"black\"),\n                        s.addColorStop(0.9187500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.12500000000000003, \"yellow\"),\n                        s.addColorStop(0.22500000000000003, \"yellow\"),\n                        s.addColorStop(0.22500000000000003, \"black\"),\n                        s.addColorStop(0.32500000000000007, \"black\"),\n                        s.addColorStop(0.32500000000000007, \"yellow\"),\n                        s.addColorStop(0.42500000000000004, \"yellow\"),\n                        s.addColorStop(0.42500000000000004, \"black\"),\n                        s.addColorStop(0.525, \"black\"),\n                        s.addColorStop(0.525, \"yellow\"),\n                        s.addColorStop(0.625, \"yellow\"),\n                        s.addColorStop(0.625, \"black\"),\n                        s.addColorStop(0.725, \"black\"),\n                        s.addColorStop(0.725, \"yellow\"),\n                        s.addColorStop(0.825, \"yellow\"),\n                        s.addColorStop(0.825, \"black\"),\n                        s.addColorStop(0.925, \"black\"),\n                        s.addColorStop(0.925, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.13125000000000003, \"yellow\"),\n                        s.addColorStop(0.23125000000000004, \"yellow\"),\n                        s.addColorStop(0.23125000000000004, \"black\"),\n                        s.addColorStop(0.33125000000000004, \"black\"),\n                        s.addColorStop(0.33125000000000004, \"yellow\"),\n                        s.addColorStop(0.43125, \"yellow\"),\n                        s.addColorStop(0.43125, \"black\"),\n                        s.addColorStop(0.53125, \"black\"),\n                        s.addColorStop(0.53125, \"yellow\"),\n                        s.addColorStop(0.6312500000000001, \"yellow\"),\n                        s.addColorStop(0.6312500000000001, \"black\"),\n                        s.addColorStop(0.73125, \"black\"),\n                        s.addColorStop(0.73125, \"yellow\"),\n                        s.addColorStop(0.83125, \"yellow\"),\n                        s.addColorStop(0.83125, \"black\"),\n                        s.addColorStop(0.9312500000000001, \"black\"),\n                        s.addColorStop(0.9312500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.13750000000000004, \"yellow\"),\n                        s.addColorStop(0.23750000000000004, \"yellow\"),\n                        s.addColorStop(0.23750000000000004, \"black\"),\n                        s.addColorStop(0.3375, \"black\"),\n                        s.addColorStop(0.3375, \"yellow\"),\n                        s.addColorStop(0.4375, \"yellow\"),\n                        s.addColorStop(0.4375, \"black\"),\n                        s.addColorStop(0.5375000000000001, \"black\"),\n                        s.addColorStop(0.5375000000000001, \"yellow\"),\n                        s.addColorStop(0.6375000000000001, \"yellow\"),\n                        s.addColorStop(0.6375000000000001, \"black\"),\n                        s.addColorStop(0.7375, \"black\"),\n                        s.addColorStop(0.7375, \"yellow\"),\n                        s.addColorStop(0.8375, \"yellow\"),\n                        s.addColorStop(0.8375, \"black\"),\n                        s.addColorStop(0.9375000000000001, \"black\"),\n                        s.addColorStop(0.9375000000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.14375000000000004, \"yellow\"),\n                        s.addColorStop(0.24375000000000005, \"yellow\"),\n                        s.addColorStop(0.24375000000000005, \"black\"),\n                        s.addColorStop(0.34375000000000006, \"black\"),\n                        s.addColorStop(0.34375000000000006, \"yellow\"),\n                        s.addColorStop(0.44375000000000003, \"yellow\"),\n                        s.addColorStop(0.44375000000000003, \"black\"),\n                        s.addColorStop(0.5437500000000001, \"black\"),\n                        s.addColorStop(0.5437500000000001, \"yellow\"),\n                        s.addColorStop(0.64375, \"yellow\"),\n                        s.addColorStop(0.64375, \"black\"),\n                        s.addColorStop(0.74375, \"black\"),\n                        s.addColorStop(0.74375, \"yellow\"),\n                        s.addColorStop(0.84375, \"yellow\"),\n                        s.addColorStop(0.84375, \"black\"),\n                        s.addColorStop(0.9437500000000001, \"black\"),\n                        s.addColorStop(0.9437500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.15000000000000005, \"yellow\"),\n                        s.addColorStop(0.25000000000000006, \"yellow\"),\n                        s.addColorStop(0.25000000000000006, \"black\"),\n                        s.addColorStop(0.3500000000000001, \"black\"),\n                        s.addColorStop(0.3500000000000001, \"yellow\"),\n                        s.addColorStop(0.45000000000000007, \"yellow\"),\n                        s.addColorStop(0.45000000000000007, \"black\"),\n                        s.addColorStop(0.55, \"black\"),\n                        s.addColorStop(0.55, \"yellow\"),\n                        s.addColorStop(0.65, \"yellow\"),\n                        s.addColorStop(0.65, \"black\"),\n                        s.addColorStop(0.75, \"black\"),\n                        s.addColorStop(0.75, \"yellow\"),\n                        s.addColorStop(0.85, \"yellow\"),\n                        s.addColorStop(0.85, \"black\"),\n                        s.addColorStop(0.9500000000000001, \"black\"),\n                        s.addColorStop(0.9500000000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.15625000000000006, \"yellow\"),\n                        s.addColorStop(0.2562500000000001, \"yellow\"),\n                        s.addColorStop(0.2562500000000001, \"black\"),\n                        s.addColorStop(0.35625000000000007, \"black\"),\n                        s.addColorStop(0.35625000000000007, \"yellow\"),\n                        s.addColorStop(0.45625000000000004, \"yellow\"),\n                        s.addColorStop(0.45625000000000004, \"black\"),\n                        s.addColorStop(0.5562500000000001, \"black\"),\n                        s.addColorStop(0.5562500000000001, \"yellow\"),\n                        s.addColorStop(0.65625, \"yellow\"),\n                        s.addColorStop(0.65625, \"black\"),\n                        s.addColorStop(0.7562500000000001, \"black\"),\n                        s.addColorStop(0.7562500000000001, \"yellow\"),\n                        s.addColorStop(0.85625, \"yellow\"),\n                        s.addColorStop(0.85625, \"black\"),\n                        s.addColorStop(0.95625, \"black\"),\n                        s.addColorStop(0.95625, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.16250000000000006, \"yellow\"),\n                        s.addColorStop(0.26250000000000007, \"yellow\"),\n                        s.addColorStop(0.26250000000000007, \"black\"),\n                        s.addColorStop(0.36250000000000004, \"black\"),\n                        s.addColorStop(0.36250000000000004, \"yellow\"),\n                        s.addColorStop(0.4625, \"yellow\"),\n                        s.addColorStop(0.4625, \"black\"),\n                        s.addColorStop(0.5625000000000001, \"black\"),\n                        s.addColorStop(0.5625000000000001, \"yellow\"),\n                        s.addColorStop(0.6625000000000001, \"yellow\"),\n                        s.addColorStop(0.6625000000000001, \"black\"),\n                        s.addColorStop(0.7625000000000001, \"black\"),\n                        s.addColorStop(0.7625000000000001, \"yellow\"),\n                        s.addColorStop(0.8625, \"yellow\"),\n                        s.addColorStop(0.8625, \"black\"),\n                        s.addColorStop(0.9625000000000001, \"black\"),\n                        s.addColorStop(0.9625000000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.16875000000000007, \"yellow\"),\n                        s.addColorStop(0.26875000000000004, \"yellow\"),\n                        s.addColorStop(0.26875000000000004, \"black\"),\n                        s.addColorStop(0.3687500000000001, \"black\"),\n                        s.addColorStop(0.3687500000000001, \"yellow\"),\n                        s.addColorStop(0.46875000000000006, \"yellow\"),\n                        s.addColorStop(0.46875000000000006, \"black\"),\n                        s.addColorStop(0.5687500000000001, \"black\"),\n                        s.addColorStop(0.5687500000000001, \"yellow\"),\n                        s.addColorStop(0.6687500000000001, \"yellow\"),\n                        s.addColorStop(0.6687500000000001, \"black\"),\n                        s.addColorStop(0.76875, \"black\"),\n                        s.addColorStop(0.76875, \"yellow\"),\n                        s.addColorStop(0.86875, \"yellow\"),\n                        s.addColorStop(0.86875, \"black\"),\n                        s.addColorStop(0.9687500000000001, \"black\"),\n                        s.addColorStop(0.9687500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.17500000000000007, \"yellow\"),\n                        s.addColorStop(0.2750000000000001, \"yellow\"),\n                        s.addColorStop(0.2750000000000001, \"black\"),\n                        s.addColorStop(0.3750000000000001, \"black\"),\n                        s.addColorStop(0.3750000000000001, \"yellow\"),\n                        s.addColorStop(0.4750000000000001, \"yellow\"),\n                        s.addColorStop(0.4750000000000001, \"black\"),\n                        s.addColorStop(0.5750000000000001, \"black\"),\n                        s.addColorStop(0.5750000000000001, \"yellow\"),\n                        s.addColorStop(0.675, \"yellow\"),\n                        s.addColorStop(0.675, \"black\"),\n                        s.addColorStop(0.775, \"black\"),\n                        s.addColorStop(0.775, \"yellow\"),\n                        s.addColorStop(0.875, \"yellow\"),\n                        s.addColorStop(0.875, \"black\"),\n                        s.addColorStop(0.9750000000000001, \"black\"),\n                        s.addColorStop(0.9750000000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.18125000000000008, \"yellow\"),\n                        s.addColorStop(0.2812500000000001, \"yellow\"),\n                        s.addColorStop(0.2812500000000001, \"black\"),\n                        s.addColorStop(0.3812500000000001, \"black\"),\n                        s.addColorStop(0.3812500000000001, \"yellow\"),\n                        s.addColorStop(0.48125000000000007, \"yellow\"),\n                        s.addColorStop(0.48125000000000007, \"black\"),\n                        s.addColorStop(0.58125, \"black\"),\n                        s.addColorStop(0.58125, \"yellow\"),\n                        s.addColorStop(0.6812500000000001, \"yellow\"),\n                        s.addColorStop(0.6812500000000001, \"black\"),\n                        s.addColorStop(0.78125, \"black\"),\n                        s.addColorStop(0.78125, \"yellow\"),\n                        s.addColorStop(0.8812500000000001, \"yellow\"),\n                        s.addColorStop(0.8812500000000001, \"black\"),\n                        s.addColorStop(0.9812500000000002, \"black\"),\n                        s.addColorStop(0.9812500000000002, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.18750000000000008, \"yellow\"),\n                        s.addColorStop(0.2875000000000001, \"yellow\"),\n                        s.addColorStop(0.2875000000000001, \"black\"),\n                        s.addColorStop(0.38750000000000007, \"black\"),\n                        s.addColorStop(0.38750000000000007, \"yellow\"),\n                        s.addColorStop(0.48750000000000004, \"yellow\"),\n                        s.addColorStop(0.48750000000000004, \"black\"),\n                        s.addColorStop(0.5875000000000001, \"black\"),\n                        s.addColorStop(0.5875000000000001, \"yellow\"),\n                        s.addColorStop(0.6875000000000001, \"yellow\"),\n                        s.addColorStop(0.6875000000000001, \"black\"),\n                        s.addColorStop(0.7875000000000001, \"black\"),\n                        s.addColorStop(0.7875000000000001, \"yellow\"),\n                        s.addColorStop(0.8875000000000001, \"yellow\"),\n                        s.addColorStop(0.8875000000000001, \"black\"),\n                        s.addColorStop(0.9875000000000002, \"black\"),\n                        s.addColorStop(0.9875000000000002, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        ",
                                "\n                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),\n                        s.addColorStop(0, \"black\"),\n                        s.addColorStop(0.1937500000000001, \"yellow\"),\n                        s.addColorStop(0.29375000000000007, \"yellow\"),\n                        s.addColorStop(0.29375000000000007, \"black\"),\n                        s.addColorStop(0.3937500000000001, \"black\"),\n                        s.addColorStop(0.3937500000000001, \"yellow\"),\n                        s.addColorStop(0.4937500000000001, \"yellow\"),\n                        s.addColorStop(0.4937500000000001, \"black\"),\n                        s.addColorStop(0.5937500000000001, \"black\"),\n                        s.addColorStop(0.5937500000000001, \"yellow\"),\n                        s.addColorStop(0.6937500000000001, \"yellow\"),\n                        s.addColorStop(0.6937500000000001, \"black\"),\n                        s.addColorStop(0.7937500000000001, \"black\"),\n                        s.addColorStop(0.7937500000000001, \"yellow\"),\n                        s.addColorStop(0.89375, \"yellow\"),\n                        s.addColorStop(0.89375, \"black\"),\n                        s.addColorStop(0.9937500000000001, \"black\"),\n                        s.addColorStop(0.9937500000000001, \"yellow\"),\n                        s.addColorStop(1, \"yellow\"),\n                        s.addColorStop(1, \"black\");\n                        "
                            ]
                        },
                        material: `
                        s=t.createLinearGradient(0,0,i*1.5,i*1.5),
                        s.addColorStop(0, "yellow"),
                        s.addColorStop(0.1, "yellow"),
                        s.addColorStop(0.1, "black"),
                        s.addColorStop(0.2, "black");
                        s.addColorStop(0.2, "yellow");
                        s.addColorStop(0.3, "yellow");
                        s.addColorStop(0.3, "black");
                        s.addColorStop(0.4, "black");
                        s.addColorStop(0.4, "yellow");
                        s.addColorStop(0.5, "yellow");
                        s.addColorStop(0.5, "black");
                        s.addColorStop(0.6, "black");
                        s.addColorStop(0.6, "yellow");
                        s.addColorStop(0.7, "yellow");
                        s.addColorStop(0.7, "black");
                        s.addColorStop(0.8, "black");
                        s.addColorStop(0.8, "yellow");
                        s.addColorStop(0.9, "yellow");
                        s.addColorStop(0.9, "black");
                        `,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular:l0Il1.hsvToRgbHex(this.hue,1,.8),
                                    wireframe: false,
                                    shininess:10,
                                    bumpScale:2,
                                    color: 0x000000,
                                    emissive:0xFFFFFF,
                                    emissiveMap:OOlO0
                                }
                            )
                        `
                    },
                    "hologram": {
                        name: "Hologram",
                        funcName: "buildHoloMaterial",
                        material: `s=t.createLinearGradient(0,0,i*2,0),s.addColorStop(0,"hsl(0,100%,50%)"),s.addColorStop(.25,"hsl(0,100%,100%)"),s.addColorStop(.75,"hsl(0,100%,100%)"),s.addColorStop(1,"hsl(0,100%,50%)");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    //specular:0xFFFFFF,
                                    shininess:0,
                                    specular: 0xFFFFFF,
                                    bumpScale:2,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,.75,.75),
                                    side: THREE.DoubleSide,
                                }
                            )
                        `
                    },
                    "_vid_fennec": {
                        name: "Fennec",
                        ignore: false,
                        funcName: "buildReapMaterial",
                        material: `s=t.createLinearGradient(0,0,i*2,0),s.addColorStop(0,"hsl(0,100%,0%)"),s.addColorStop(.23,"hsl(0,100%,0%)"),s.addColorStop(.23,"hsl(0,0%,20%)"),s.addColorStop(.5,"hsl(0,100%,100%)"),s.addColorStop(.77,"hsl(0,0%,20%)"),s.addColorStop(.77,"hsl(0,100%,0%)");`,
                        video: {
                            thumbnail: "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC400\");\n            s.addColorStop(0.3,\"#FFC400\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC400\");\n            s.addColorStop(0.8,\"#FFC400\");\n            s.addColorStop(0.8,\"black\");",
                            steps: [
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC400\");\n            s.addColorStop(0.3,\"#FFC400\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFEEB5\");\n            s.addColorStop(0.8,\"#FFEEB5\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC505\");\n            s.addColorStop(0.3,\"#FFC505\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFEDB0\");\n            s.addColorStop(0.8,\"#FFEDB0\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC609\");\n            s.addColorStop(0.3,\"#FFC609\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFECAC\");\n            s.addColorStop(0.8,\"#FFECAC\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC70E\");\n            s.addColorStop(0.3,\"#FFC70E\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFEBA7\");\n            s.addColorStop(0.8,\"#FFEBA7\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC812\");\n            s.addColorStop(0.3,\"#FFC812\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFEAA3\");\n            s.addColorStop(0.8,\"#FFEAA3\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC917\");\n            s.addColorStop(0.3,\"#FFC917\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE99E\");\n            s.addColorStop(0.8,\"#FFE99E\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCA1B\");\n            s.addColorStop(0.3,\"#FFCA1B\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE89A\");\n            s.addColorStop(0.8,\"#FFE89A\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCB20\");\n            s.addColorStop(0.3,\"#FFCB20\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE795\");\n            s.addColorStop(0.8,\"#FFE795\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCC24\");\n            s.addColorStop(0.3,\"#FFCC24\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE691\");\n            s.addColorStop(0.8,\"#FFE691\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCD29\");\n            s.addColorStop(0.3,\"#FFCD29\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE58C\");\n            s.addColorStop(0.8,\"#FFE58C\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCF2D\");\n            s.addColorStop(0.3,\"#FFCF2D\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE488\");\n            s.addColorStop(0.8,\"#FFE488\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD032\");\n            s.addColorStop(0.3,\"#FFD032\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE283\");\n            s.addColorStop(0.8,\"#FFE283\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD136\");\n            s.addColorStop(0.3,\"#FFD136\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE17F\");\n            s.addColorStop(0.8,\"#FFE17F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD23B\");\n            s.addColorStop(0.3,\"#FFD23B\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFE07A\");\n            s.addColorStop(0.8,\"#FFE07A\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD33F\");\n            s.addColorStop(0.3,\"#FFD33F\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDF76\");\n            s.addColorStop(0.8,\"#FFDF76\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD444\");\n            s.addColorStop(0.3,\"#FFD444\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDE71\");\n            s.addColorStop(0.8,\"#FFDE71\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD548\");\n            s.addColorStop(0.3,\"#FFD548\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDD6D\");\n            s.addColorStop(0.8,\"#FFDD6D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD64D\");\n            s.addColorStop(0.3,\"#FFD64D\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDC68\");\n            s.addColorStop(0.8,\"#FFDC68\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD751\");\n            s.addColorStop(0.3,\"#FFD751\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDB64\");\n            s.addColorStop(0.8,\"#FFDB64\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD856\");\n            s.addColorStop(0.3,\"#FFD856\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFDA5F\");\n            s.addColorStop(0.8,\"#FFDA5F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD95B\");\n            s.addColorStop(0.3,\"#FFD95B\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD95A\");\n            s.addColorStop(0.8,\"#FFD95A\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDA5F\");\n            s.addColorStop(0.3,\"#FFDA5F\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD856\");\n            s.addColorStop(0.8,\"#FFD856\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDB64\");\n            s.addColorStop(0.3,\"#FFDB64\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD751\");\n            s.addColorStop(0.8,\"#FFD751\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDC68\");\n            s.addColorStop(0.3,\"#FFDC68\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD64D\");\n            s.addColorStop(0.8,\"#FFD64D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDD6D\");\n            s.addColorStop(0.3,\"#FFDD6D\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD548\");\n            s.addColorStop(0.8,\"#FFD548\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDE71\");\n            s.addColorStop(0.3,\"#FFDE71\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD444\");\n            s.addColorStop(0.8,\"#FFD444\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDF76\");\n            s.addColorStop(0.3,\"#FFDF76\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD33F\");\n            s.addColorStop(0.8,\"#FFD33F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE07A\");\n            s.addColorStop(0.3,\"#FFE07A\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD23B\");\n            s.addColorStop(0.8,\"#FFD23B\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE17F\");\n            s.addColorStop(0.3,\"#FFE17F\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD136\");\n            s.addColorStop(0.8,\"#FFD136\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE283\");\n            s.addColorStop(0.3,\"#FFE283\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFD032\");\n            s.addColorStop(0.8,\"#FFD032\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE488\");\n            s.addColorStop(0.3,\"#FFE488\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFCF2D\");\n            s.addColorStop(0.8,\"#FFCF2D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE58C\");\n            s.addColorStop(0.3,\"#FFE58C\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFCD29\");\n            s.addColorStop(0.8,\"#FFCD29\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE691\");\n            s.addColorStop(0.3,\"#FFE691\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFCC24\");\n            s.addColorStop(0.8,\"#FFCC24\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE795\");\n            s.addColorStop(0.3,\"#FFE795\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFCB20\");\n            s.addColorStop(0.8,\"#FFCB20\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE89A\");\n            s.addColorStop(0.3,\"#FFE89A\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFCA1B\");\n            s.addColorStop(0.8,\"#FFCA1B\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE99E\");\n            s.addColorStop(0.3,\"#FFE99E\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC917\");\n            s.addColorStop(0.8,\"#FFC917\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEAA3\");\n            s.addColorStop(0.3,\"#FFEAA3\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC812\");\n            s.addColorStop(0.8,\"#FFC812\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEBA7\");\n            s.addColorStop(0.3,\"#FFEBA7\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC70E\");\n            s.addColorStop(0.8,\"#FFC70E\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFECAC\");\n            s.addColorStop(0.3,\"#FFECAC\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC609\");\n            s.addColorStop(0.8,\"#FFC609\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEDB0\");\n            s.addColorStop(0.3,\"#FFEDB0\");\n            s.addColorStop(0.3,\"black\");\n            s.addColorStop(0.7,\"black\");\n            s.addColorStop(0.7,\"#FFC505\");\n            s.addColorStop(0.8,\"#FFC505\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEEB5\");\n            s.addColorStop(0.27,\"#FFEEB5\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC400\");\n            s.addColorStop(0.8,\"#FFC400\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEDB0\");\n            s.addColorStop(0.27,\"#FFEDB0\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC505\");\n            s.addColorStop(0.8,\"#FFC505\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFECAC\");\n            s.addColorStop(0.27,\"#FFECAC\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC609\");\n            s.addColorStop(0.8,\"#FFC609\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEBA7\");\n            s.addColorStop(0.27,\"#FFEBA7\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC70E\");\n            s.addColorStop(0.8,\"#FFC70E\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFEAA3\");\n            s.addColorStop(0.27,\"#FFEAA3\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC812\");\n            s.addColorStop(0.8,\"#FFC812\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE99E\");\n            s.addColorStop(0.27,\"#FFE99E\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFC917\");\n            s.addColorStop(0.8,\"#FFC917\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE89A\");\n            s.addColorStop(0.27,\"#FFE89A\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFCA1B\");\n            s.addColorStop(0.8,\"#FFCA1B\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE795\");\n            s.addColorStop(0.27,\"#FFE795\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFCB20\");\n            s.addColorStop(0.8,\"#FFCB20\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE691\");\n            s.addColorStop(0.27,\"#FFE691\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFCC24\");\n            s.addColorStop(0.8,\"#FFCC24\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE58C\");\n            s.addColorStop(0.27,\"#FFE58C\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFCD29\");\n            s.addColorStop(0.8,\"#FFCD29\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE488\");\n            s.addColorStop(0.27,\"#FFE488\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFCF2D\");\n            s.addColorStop(0.8,\"#FFCF2D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE283\");\n            s.addColorStop(0.27,\"#FFE283\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD032\");\n            s.addColorStop(0.8,\"#FFD032\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE17F\");\n            s.addColorStop(0.27,\"#FFE17F\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD136\");\n            s.addColorStop(0.8,\"#FFD136\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFE07A\");\n            s.addColorStop(0.27,\"#FFE07A\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD23B\");\n            s.addColorStop(0.8,\"#FFD23B\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDF76\");\n            s.addColorStop(0.27,\"#FFDF76\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD33F\");\n            s.addColorStop(0.8,\"#FFD33F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDE71\");\n            s.addColorStop(0.27,\"#FFDE71\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD444\");\n            s.addColorStop(0.8,\"#FFD444\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDD6D\");\n            s.addColorStop(0.27,\"#FFDD6D\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD548\");\n            s.addColorStop(0.8,\"#FFD548\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDC68\");\n            s.addColorStop(0.27,\"#FFDC68\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD64D\");\n            s.addColorStop(0.8,\"#FFD64D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDB64\");\n            s.addColorStop(0.27,\"#FFDB64\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD751\");\n            s.addColorStop(0.8,\"#FFD751\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFDA5F\");\n            s.addColorStop(0.27,\"#FFDA5F\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD856\");\n            s.addColorStop(0.8,\"#FFD856\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD95A\");\n            s.addColorStop(0.27,\"#FFD95A\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFD95B\");\n            s.addColorStop(0.8,\"#FFD95B\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD856\");\n            s.addColorStop(0.27,\"#FFD856\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDA5F\");\n            s.addColorStop(0.8,\"#FFDA5F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD751\");\n            s.addColorStop(0.27,\"#FFD751\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDB64\");\n            s.addColorStop(0.8,\"#FFDB64\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD64D\");\n            s.addColorStop(0.27,\"#FFD64D\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDC68\");\n            s.addColorStop(0.8,\"#FFDC68\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD548\");\n            s.addColorStop(0.27,\"#FFD548\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDD6D\");\n            s.addColorStop(0.8,\"#FFDD6D\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD444\");\n            s.addColorStop(0.27,\"#FFD444\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDE71\");\n            s.addColorStop(0.8,\"#FFDE71\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD33F\");\n            s.addColorStop(0.27,\"#FFD33F\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFDF76\");\n            s.addColorStop(0.8,\"#FFDF76\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD23B\");\n            s.addColorStop(0.27,\"#FFD23B\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE07A\");\n            s.addColorStop(0.8,\"#FFE07A\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD136\");\n            s.addColorStop(0.27,\"#FFD136\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE17F\");\n            s.addColorStop(0.8,\"#FFE17F\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFD032\");\n            s.addColorStop(0.27,\"#FFD032\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE283\");\n            s.addColorStop(0.8,\"#FFE283\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCE2D\");\n            s.addColorStop(0.27,\"#FFCE2D\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE488\");\n            s.addColorStop(0.8,\"#FFE488\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCD29\");\n            s.addColorStop(0.27,\"#FFCD29\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE58C\");\n            s.addColorStop(0.8,\"#FFE58C\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCC24\");\n            s.addColorStop(0.27,\"#FFCC24\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE691\");\n            s.addColorStop(0.8,\"#FFE691\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCB20\");\n            s.addColorStop(0.27,\"#FFCB20\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE795\");\n            s.addColorStop(0.8,\"#FFE795\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFCA1B\");\n            s.addColorStop(0.27,\"#FFCA1B\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE89A\");\n            s.addColorStop(0.8,\"#FFE89A\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC917\");\n            s.addColorStop(0.27,\"#FFC917\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFE99E\");\n            s.addColorStop(0.8,\"#FFE99E\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC812\");\n            s.addColorStop(0.27,\"#FFC812\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFEAA3\");\n            s.addColorStop(0.8,\"#FFEAA3\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC70E\");\n            s.addColorStop(0.27,\"#FFC70E\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFEBA7\");\n            s.addColorStop(0.8,\"#FFEBA7\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC609\");\n            s.addColorStop(0.27,\"#FFC609\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFECAC\");\n            s.addColorStop(0.8,\"#FFECAC\");\n            s.addColorStop(0.8,\"black\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"black\");\n            s.addColorStop(0.2,\"black\");\n            s.addColorStop(0.2,\"#FFC505\");\n            s.addColorStop(0.27,\"#FFC505\");\n            s.addColorStop(0.27,\"black\");\n            s.addColorStop(0.73,\"black\");\n            s.addColorStop(0.73,\"#FFEDB0\");\n            s.addColorStop(0.8,\"#FFEDB0\");\n            s.addColorStop(0.8,\"black\");\n        "
                            ]
                            // old animation
                            // [
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(0, 100%, 50%)\");s.addColorStop(0.6,\"hsl(18, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(18, 100%, 50%)\");s.addColorStop(0.6,\"hsl(36, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(36, 100%, 50%)\");s.addColorStop(0.6,\"hsl(54, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(54, 100%, 50%)\");s.addColorStop(0.6,\"hsl(72, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(72, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(90, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(90, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(108, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(108, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(126, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(126, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(144, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(144, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(162, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(162, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(180, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(180, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(198, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(198, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(216, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(216, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(234, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(234, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(252, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(252, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(270, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(270, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(288, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(288, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(306, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(306, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(324, 100%, 50%)\");s.addColorStop(0.7, 'black');",
                            //     "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'black'),                                s.addColorStop(0.4,\"hsl(324, 100%, 50%)\"); s.addColorStop(0.6,\"hsl(0, 100%, 50%)\");s.addColorStop(0.7, 'black');"
                            // ]
                        },
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    //specular:0x000000,
                                    shininess:100,
                                    specular: l0Il1.hsvToRgbHex(this.hue,1,.7),
                                    bumpScale:2,
                                    color: 0x080808,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,.7,.4),
                                    emissiveMap:l0I1I,
                                    side: THREE.DoubleSide,
                                }
                            )
                        `
                    },
                    "ashen": {
                        name: "Ashen",
                        funcName: "buildAshenMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"black"),s.addColorStop(0.5, "darkred"), s.addColorStop(0.5, "black");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular: l0Il1.hsvToRgbHex(this.hue, 1, 1),
                                    shininess: 100,
                                    bumpScale: .1,
                                    color: l0Il1.hsvToRgbHex(this.hue, .5, .05),
                                    emissive: l0Il1.hsvToRgbHex(this.hue + 180, 1, .1),
                                }
                            )
                        `
                    },
                    "amphibian": {
                        name: "Amphibian",
                        funcName: "buildAmphibianMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"cyan"),s.addColorStop(0.5, "blue"), s.addColorStop(0.5, "orange"),s.addColorStop(0.9, "yellow");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular: l0Il1.hsvToRgbHex(window.getComplementaryHue(this.hue), 1, 1),
                                    shininess: 100,
                                    bumpScale: .1,
                                    color: l0Il1.hsvToRgbHex(this.hue, 1, .7),
                                    emissive: l0Il1.hsvToRgbHex(this.hue, 1, 1),
                                    emissiveIntensity: 1,
                                    emissiveMap:OOlO0,
                                }
                            )
                        `
                    },
                    "_vid_crystal": {
                        name: "Crystal",
                        funcName: "buildCrystalMaterial",
                        ignore: false,
                        video: {
                            thumbnail: 60,
                            steps: [
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFF2F2\");\n            s.addColorStop(0.75,\"#FFF2F2\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFE6E6\");\n            s.addColorStop(0.75,\"#FFE6E6\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFD9D9\");\n            s.addColorStop(0.75,\"#FFD9D9\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFCCCC\");\n            s.addColorStop(0.75,\"#FFCCCC\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFBFBF\");\n            s.addColorStop(0.75,\"#FFBFBF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFB3B3\");\n            s.addColorStop(0.75,\"#FFB3B3\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFA6A6\");\n            s.addColorStop(0.75,\"#FFA6A6\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFF2F2\");\n            s.addColorStop(0.5,\"#FFF2F2\");\n            s.addColorStop(0.5,\"#FF9999\");\n            s.addColorStop(0.75,\"#FF9999\");\n            s.addColorStop(0.75,\"#FFF2F2\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFE6E6\");\n            s.addColorStop(0.5,\"#FFE6E6\");\n            s.addColorStop(0.5,\"#FF8C8C\");\n            s.addColorStop(0.75,\"#FF8C8C\");\n            s.addColorStop(0.75,\"#FFE6E6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFD9D9\");\n            s.addColorStop(0.5,\"#FFD9D9\");\n            s.addColorStop(0.5,\"#FF8080\");\n            s.addColorStop(0.75,\"#FF8080\");\n            s.addColorStop(0.75,\"#FFD9D9\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFCCCC\");\n            s.addColorStop(0.5,\"#FFCCCC\");\n            s.addColorStop(0.5,\"#FF7373\");\n            s.addColorStop(0.75,\"#FF7373\");\n            s.addColorStop(0.75,\"#FFCCCC\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFBFBF\");\n            s.addColorStop(0.5,\"#FFBFBF\");\n            s.addColorStop(0.5,\"#FF6666\");\n            s.addColorStop(0.75,\"#FF6666\");\n            s.addColorStop(0.75,\"#FFBFBF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFB3B3\");\n            s.addColorStop(0.5,\"#FFB3B3\");\n            s.addColorStop(0.5,\"#FF5959\");\n            s.addColorStop(0.75,\"#FF5959\");\n            s.addColorStop(0.75,\"#FFB3B3\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFA6A6\");\n            s.addColorStop(0.5,\"#FFA6A6\");\n            s.addColorStop(0.5,\"#FF4C4C\");\n            s.addColorStop(0.75,\"#FF4C4C\");\n            s.addColorStop(0.75,\"#FFA6A6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFF2F2\");\n            s.addColorStop(0.25,\"#FFF2F2\");\n            s.addColorStop(0.25,\"#FF9999\");\n            s.addColorStop(0.5,\"#FF9999\");\n            s.addColorStop(0.5,\"#FF4040\");\n            s.addColorStop(0.75,\"#FF4040\");\n            s.addColorStop(0.75,\"#FF9999\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFE5E5\");\n            s.addColorStop(0.25,\"#FFE5E5\");\n            s.addColorStop(0.25,\"#FF8C8C\");\n            s.addColorStop(0.5,\"#FF8C8C\");\n            s.addColorStop(0.5,\"#FF3333\");\n            s.addColorStop(0.75,\"#FF3333\");\n            s.addColorStop(0.75,\"#FF8C8C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFD9D9\");\n            s.addColorStop(0.25,\"#FFD9D9\");\n            s.addColorStop(0.25,\"#FF7F7F\");\n            s.addColorStop(0.5,\"#FF7F7F\");\n            s.addColorStop(0.5,\"#FF2626\");\n            s.addColorStop(0.75,\"#FF2626\");\n            s.addColorStop(0.75,\"#FF7F7F\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFCCCC\");\n            s.addColorStop(0.25,\"#FFCCCC\");\n            s.addColorStop(0.25,\"#FF7373\");\n            s.addColorStop(0.5,\"#FF7373\");\n            s.addColorStop(0.5,\"#FF1919\");\n            s.addColorStop(0.75,\"#FF1919\");\n            s.addColorStop(0.75,\"#FF7373\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFBFBF\");\n            s.addColorStop(0.25,\"#FFBFBF\");\n            s.addColorStop(0.25,\"#FF6666\");\n            s.addColorStop(0.5,\"#FF6666\");\n            s.addColorStop(0.5,\"#FF0D0D\");\n            s.addColorStop(0.75,\"#FF0D0D\");\n            s.addColorStop(0.75,\"#FF6666\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFB2B2\");\n            s.addColorStop(0.25,\"#FFB2B2\");\n            s.addColorStop(0.25,\"#FF5959\");\n            s.addColorStop(0.5,\"#FF5959\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF5959\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFA6A6\");\n            s.addColorStop(0.25,\"#FFA6A6\");\n            s.addColorStop(0.25,\"#FF4C4C\");\n            s.addColorStop(0.5,\"#FF4C4C\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF4C4C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF9999\");\n            s.addColorStop(0.25,\"#FF9999\");\n            s.addColorStop(0.25,\"#FF4040\");\n            s.addColorStop(0.5,\"#FF4040\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF4040\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF8C8C\");\n            s.addColorStop(0.25,\"#FF8C8C\");\n            s.addColorStop(0.25,\"#FF3333\");\n            s.addColorStop(0.5,\"#FF3333\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF3333\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF7F7F\");\n            s.addColorStop(0.25,\"#FF7F7F\");\n            s.addColorStop(0.25,\"#FF2626\");\n            s.addColorStop(0.5,\"#FF2626\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF2626\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF7373\");\n            s.addColorStop(0.25,\"#FF7373\");\n            s.addColorStop(0.25,\"#FF1919\");\n            s.addColorStop(0.5,\"#FF1919\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF1919\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF6666\");\n            s.addColorStop(0.25,\"#FF6666\");\n            s.addColorStop(0.25,\"#FF0D0D\");\n            s.addColorStop(0.5,\"#FF0D0D\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0D0D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF5959\");\n            s.addColorStop(0.25,\"#FF5959\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4C4C\");\n            s.addColorStop(0.25,\"#FF4C4C\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4040\");\n            s.addColorStop(0.25,\"#FF4040\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF3333\");\n            s.addColorStop(0.25,\"#FF3333\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF2626\");\n            s.addColorStop(0.25,\"#FF2626\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF1919\");\n            s.addColorStop(0.25,\"#FF1919\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0D0D\");\n            s.addColorStop(0.25,\"#FF0D0D\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0D0D\");\n            s.addColorStop(0.75,\"#FF0D0D\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF1A1A\");\n            s.addColorStop(0.75,\"#FF1A1A\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF2626\");\n            s.addColorStop(0.75,\"#FF2626\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF3333\");\n            s.addColorStop(0.75,\"#FF3333\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF4040\");\n            s.addColorStop(0.75,\"#FF4040\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF4D4D\");\n            s.addColorStop(0.75,\"#FF4D4D\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF0000\");\n            s.addColorStop(0.5,\"#FF5959\");\n            s.addColorStop(0.75,\"#FF5959\");\n            s.addColorStop(0.75,\"#FF0000\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0D0D\");\n            s.addColorStop(0.5,\"#FF0D0D\");\n            s.addColorStop(0.5,\"#FF6666\");\n            s.addColorStop(0.75,\"#FF6666\");\n            s.addColorStop(0.75,\"#FF0D0D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF1A1A\");\n            s.addColorStop(0.5,\"#FF1A1A\");\n            s.addColorStop(0.5,\"#FF7373\");\n            s.addColorStop(0.75,\"#FF7373\");\n            s.addColorStop(0.75,\"#FF1A1A\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF2626\");\n            s.addColorStop(0.5,\"#FF2626\");\n            s.addColorStop(0.5,\"#FF8080\");\n            s.addColorStop(0.75,\"#FF8080\");\n            s.addColorStop(0.75,\"#FF2626\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF3333\");\n            s.addColorStop(0.5,\"#FF3333\");\n            s.addColorStop(0.5,\"#FF8C8C\");\n            s.addColorStop(0.75,\"#FF8C8C\");\n            s.addColorStop(0.75,\"#FF3333\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF4040\");\n            s.addColorStop(0.5,\"#FF4040\");\n            s.addColorStop(0.5,\"#FF9999\");\n            s.addColorStop(0.75,\"#FF9999\");\n            s.addColorStop(0.75,\"#FF4040\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF4D4D\");\n            s.addColorStop(0.5,\"#FF4D4D\");\n            s.addColorStop(0.5,\"#FFA6A6\");\n            s.addColorStop(0.75,\"#FFA6A6\");\n            s.addColorStop(0.75,\"#FF4D4D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF0000\");\n            s.addColorStop(0.25,\"#FF5959\");\n            s.addColorStop(0.5,\"#FF5959\");\n            s.addColorStop(0.5,\"#FFB3B3\");\n            s.addColorStop(0.75,\"#FFB3B3\");\n            s.addColorStop(0.75,\"#FF5959\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0D0D\");\n            s.addColorStop(0.25,\"#FF0D0D\");\n            s.addColorStop(0.25,\"#FF6666\");\n            s.addColorStop(0.5,\"#FF6666\");\n            s.addColorStop(0.5,\"#FFBFBF\");\n            s.addColorStop(0.75,\"#FFBFBF\");\n            s.addColorStop(0.75,\"#FF6666\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF1A1A\");\n            s.addColorStop(0.25,\"#FF1A1A\");\n            s.addColorStop(0.25,\"#FF7373\");\n            s.addColorStop(0.5,\"#FF7373\");\n            s.addColorStop(0.5,\"#FFCCCC\");\n            s.addColorStop(0.75,\"#FFCCCC\");\n            s.addColorStop(0.75,\"#FF7373\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF2626\");\n            s.addColorStop(0.25,\"#FF2626\");\n            s.addColorStop(0.25,\"#FF8080\");\n            s.addColorStop(0.5,\"#FF8080\");\n            s.addColorStop(0.5,\"#FFD9D9\");\n            s.addColorStop(0.75,\"#FFD9D9\");\n            s.addColorStop(0.75,\"#FF8080\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF3333\");\n            s.addColorStop(0.25,\"#FF3333\");\n            s.addColorStop(0.25,\"#FF8C8C\");\n            s.addColorStop(0.5,\"#FF8C8C\");\n            s.addColorStop(0.5,\"#FFE6E6\");\n            s.addColorStop(0.75,\"#FFE6E6\");\n            s.addColorStop(0.75,\"#FF8C8C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4040\");\n            s.addColorStop(0.25,\"#FF4040\");\n            s.addColorStop(0.25,\"#FF9999\");\n            s.addColorStop(0.5,\"#FF9999\");\n            s.addColorStop(0.5,\"#FFF2F2\");\n            s.addColorStop(0.75,\"#FFF2F2\");\n            s.addColorStop(0.75,\"#FF9999\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4D4D\");\n            s.addColorStop(0.25,\"#FF4D4D\");\n            s.addColorStop(0.25,\"#FFA6A6\");\n            s.addColorStop(0.5,\"#FFA6A6\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFA6A6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF5959\");\n            s.addColorStop(0.25,\"#FF5959\");\n            s.addColorStop(0.25,\"#FFB3B3\");\n            s.addColorStop(0.5,\"#FFB3B3\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFB3B3\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF6666\");\n            s.addColorStop(0.25,\"#FF6666\");\n            s.addColorStop(0.25,\"#FFBFBF\");\n            s.addColorStop(0.5,\"#FFBFBF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFBFBF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF7373\");\n            s.addColorStop(0.25,\"#FF7373\");\n            s.addColorStop(0.25,\"#FFCCCC\");\n            s.addColorStop(0.5,\"#FFCCCC\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFCCCC\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF8080\");\n            s.addColorStop(0.25,\"#FF8080\");\n            s.addColorStop(0.25,\"#FFD9D9\");\n            s.addColorStop(0.5,\"#FFD9D9\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFD9D9\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF8C8C\");\n            s.addColorStop(0.25,\"#FF8C8C\");\n            s.addColorStop(0.25,\"#FFE6E6\");\n            s.addColorStop(0.5,\"#FFE6E6\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFE6E6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF9999\");\n            s.addColorStop(0.25,\"#FF9999\");\n            s.addColorStop(0.25,\"#FFF2F2\");\n            s.addColorStop(0.5,\"#FFF2F2\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFF2F2\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFA6A6\");\n            s.addColorStop(0.25,\"#FFA6A6\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFB3B3\");\n            s.addColorStop(0.25,\"#FFB3B3\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFBFBF\");\n            s.addColorStop(0.25,\"#FFBFBF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFCCCC\");\n            s.addColorStop(0.25,\"#FFCCCC\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFD9D9\");\n            s.addColorStop(0.25,\"#FFD9D9\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFE6E6\");\n            s.addColorStop(0.25,\"#FFE6E6\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFF2F2\");\n            s.addColorStop(0.25,\"#FFF2F2\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#F2FFF2\");\n            s.addColorStop(0.75,\"#F2FFF2\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#E6FFE6\");\n            s.addColorStop(0.75,\"#E6FFE6\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#D9FFD9\");\n            s.addColorStop(0.75,\"#D9FFD9\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#CCFFCC\");\n            s.addColorStop(0.75,\"#CCFFCC\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#BFFFBF\");\n            s.addColorStop(0.75,\"#BFFFBF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#B3FFB3\");\n            s.addColorStop(0.75,\"#B3FFB3\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#A6FFA6\");\n            s.addColorStop(0.75,\"#A6FFA6\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#F2FFF2\");\n            s.addColorStop(0.5,\"#F2FFF2\");\n            s.addColorStop(0.5,\"#99FF99\");\n            s.addColorStop(0.75,\"#99FF99\");\n            s.addColorStop(0.75,\"#F2FFF2\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#E6FFE6\");\n            s.addColorStop(0.5,\"#E6FFE6\");\n            s.addColorStop(0.5,\"#8CFF8C\");\n            s.addColorStop(0.75,\"#8CFF8C\");\n            s.addColorStop(0.75,\"#E6FFE6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#D9FFD9\");\n            s.addColorStop(0.5,\"#D9FFD9\");\n            s.addColorStop(0.5,\"#80FF80\");\n            s.addColorStop(0.75,\"#80FF80\");\n            s.addColorStop(0.75,\"#D9FFD9\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#CCFFCC\");\n            s.addColorStop(0.5,\"#CCFFCC\");\n            s.addColorStop(0.5,\"#73FF73\");\n            s.addColorStop(0.75,\"#73FF73\");\n            s.addColorStop(0.75,\"#CCFFCC\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#BFFFBF\");\n            s.addColorStop(0.5,\"#BFFFBF\");\n            s.addColorStop(0.5,\"#66FF66\");\n            s.addColorStop(0.75,\"#66FF66\");\n            s.addColorStop(0.75,\"#BFFFBF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#B3FFB3\");\n            s.addColorStop(0.5,\"#B3FFB3\");\n            s.addColorStop(0.5,\"#59FF59\");\n            s.addColorStop(0.75,\"#59FF59\");\n            s.addColorStop(0.75,\"#B3FFB3\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#A6FFA6\");\n            s.addColorStop(0.5,\"#A6FFA6\");\n            s.addColorStop(0.5,\"#4CFF4C\");\n            s.addColorStop(0.75,\"#4CFF4C\");\n            s.addColorStop(0.75,\"#A6FFA6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#F2FFF2\");\n            s.addColorStop(0.25,\"#F2FFF2\");\n            s.addColorStop(0.25,\"#99FF99\");\n            s.addColorStop(0.5,\"#99FF99\");\n            s.addColorStop(0.5,\"#40FF40\");\n            s.addColorStop(0.75,\"#40FF40\");\n            s.addColorStop(0.75,\"#99FF99\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#E5FFE5\");\n            s.addColorStop(0.25,\"#E5FFE5\");\n            s.addColorStop(0.25,\"#8CFF8C\");\n            s.addColorStop(0.5,\"#8CFF8C\");\n            s.addColorStop(0.5,\"#33FF33\");\n            s.addColorStop(0.75,\"#33FF33\");\n            s.addColorStop(0.75,\"#8CFF8C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#D9FFD9\");\n            s.addColorStop(0.25,\"#D9FFD9\");\n            s.addColorStop(0.25,\"#7FFF7F\");\n            s.addColorStop(0.5,\"#7FFF7F\");\n            s.addColorStop(0.5,\"#26FF26\");\n            s.addColorStop(0.75,\"#26FF26\");\n            s.addColorStop(0.75,\"#7FFF7F\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#CCFFCC\");\n            s.addColorStop(0.25,\"#CCFFCC\");\n            s.addColorStop(0.25,\"#73FF73\");\n            s.addColorStop(0.5,\"#73FF73\");\n            s.addColorStop(0.5,\"#19FF19\");\n            s.addColorStop(0.75,\"#19FF19\");\n            s.addColorStop(0.75,\"#73FF73\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#BFFFBF\");\n            s.addColorStop(0.25,\"#BFFFBF\");\n            s.addColorStop(0.25,\"#66FF66\");\n            s.addColorStop(0.5,\"#66FF66\");\n            s.addColorStop(0.5,\"#0DFF0D\");\n            s.addColorStop(0.75,\"#0DFF0D\");\n            s.addColorStop(0.75,\"#66FF66\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#B2FFB2\");\n            s.addColorStop(0.25,\"#B2FFB2\");\n            s.addColorStop(0.25,\"#59FF59\");\n            s.addColorStop(0.5,\"#59FF59\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#59FF59\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#A6FFA6\");\n            s.addColorStop(0.25,\"#A6FFA6\");\n            s.addColorStop(0.25,\"#4CFF4C\");\n            s.addColorStop(0.5,\"#4CFF4C\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#4CFF4C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#99FF99\");\n            s.addColorStop(0.25,\"#99FF99\");\n            s.addColorStop(0.25,\"#40FF40\");\n            s.addColorStop(0.5,\"#40FF40\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#40FF40\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#8CFF8C\");\n            s.addColorStop(0.25,\"#8CFF8C\");\n            s.addColorStop(0.25,\"#33FF33\");\n            s.addColorStop(0.5,\"#33FF33\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#33FF33\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#7FFF7F\");\n            s.addColorStop(0.25,\"#7FFF7F\");\n            s.addColorStop(0.25,\"#26FF26\");\n            s.addColorStop(0.5,\"#26FF26\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#26FF26\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#73FF73\");\n            s.addColorStop(0.25,\"#73FF73\");\n            s.addColorStop(0.25,\"#19FF19\");\n            s.addColorStop(0.5,\"#19FF19\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#19FF19\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#66FF66\");\n            s.addColorStop(0.25,\"#66FF66\");\n            s.addColorStop(0.25,\"#0DFF0D\");\n            s.addColorStop(0.5,\"#0DFF0D\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#0DFF0D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#59FF59\");\n            s.addColorStop(0.25,\"#59FF59\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4CFF4C\");\n            s.addColorStop(0.25,\"#4CFF4C\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#40FF40\");\n            s.addColorStop(0.25,\"#40FF40\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#33FF33\");\n            s.addColorStop(0.25,\"#33FF33\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#26FF26\");\n            s.addColorStop(0.25,\"#26FF26\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#19FF19\");\n            s.addColorStop(0.25,\"#19FF19\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#0DFF0D\");\n            s.addColorStop(0.25,\"#0DFF0D\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#0DFF0D\");\n            s.addColorStop(0.75,\"#0DFF0D\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#1AFF1A\");\n            s.addColorStop(0.75,\"#1AFF1A\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#26FF26\");\n            s.addColorStop(0.75,\"#26FF26\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#33FF33\");\n            s.addColorStop(0.75,\"#33FF33\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#40FF40\");\n            s.addColorStop(0.75,\"#40FF40\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#4DFF4D\");\n            s.addColorStop(0.75,\"#4DFF4D\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.5,\"#00FF00\");\n            s.addColorStop(0.5,\"#59FF59\");\n            s.addColorStop(0.75,\"#59FF59\");\n            s.addColorStop(0.75,\"#00FF00\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#0DFF0D\");\n            s.addColorStop(0.5,\"#0DFF0D\");\n            s.addColorStop(0.5,\"#66FF66\");\n            s.addColorStop(0.75,\"#66FF66\");\n            s.addColorStop(0.75,\"#0DFF0D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#1AFF1A\");\n            s.addColorStop(0.5,\"#1AFF1A\");\n            s.addColorStop(0.5,\"#73FF73\");\n            s.addColorStop(0.75,\"#73FF73\");\n            s.addColorStop(0.75,\"#1AFF1A\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#26FF26\");\n            s.addColorStop(0.5,\"#26FF26\");\n            s.addColorStop(0.5,\"#80FF80\");\n            s.addColorStop(0.75,\"#80FF80\");\n            s.addColorStop(0.75,\"#26FF26\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#33FF33\");\n            s.addColorStop(0.5,\"#33FF33\");\n            s.addColorStop(0.5,\"#8CFF8C\");\n            s.addColorStop(0.75,\"#8CFF8C\");\n            s.addColorStop(0.75,\"#33FF33\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#40FF40\");\n            s.addColorStop(0.5,\"#40FF40\");\n            s.addColorStop(0.5,\"#99FF99\");\n            s.addColorStop(0.75,\"#99FF99\");\n            s.addColorStop(0.75,\"#40FF40\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#4DFF4D\");\n            s.addColorStop(0.5,\"#4DFF4D\");\n            s.addColorStop(0.5,\"#A6FFA6\");\n            s.addColorStop(0.75,\"#A6FFA6\");\n            s.addColorStop(0.75,\"#4DFF4D\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#00FF00\");\n            s.addColorStop(0.25,\"#00FF00\");\n            s.addColorStop(0.25,\"#59FF59\");\n            s.addColorStop(0.5,\"#59FF59\");\n            s.addColorStop(0.5,\"#B3FFB3\");\n            s.addColorStop(0.75,\"#B3FFB3\");\n            s.addColorStop(0.75,\"#59FF59\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#0DFF0D\");\n            s.addColorStop(0.25,\"#0DFF0D\");\n            s.addColorStop(0.25,\"#66FF66\");\n            s.addColorStop(0.5,\"#66FF66\");\n            s.addColorStop(0.5,\"#BFFFBF\");\n            s.addColorStop(0.75,\"#BFFFBF\");\n            s.addColorStop(0.75,\"#66FF66\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1AFF1A\");\n            s.addColorStop(0.25,\"#1AFF1A\");\n            s.addColorStop(0.25,\"#73FF73\");\n            s.addColorStop(0.5,\"#73FF73\");\n            s.addColorStop(0.5,\"#CCFFCC\");\n            s.addColorStop(0.75,\"#CCFFCC\");\n            s.addColorStop(0.75,\"#73FF73\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#26FF26\");\n            s.addColorStop(0.25,\"#26FF26\");\n            s.addColorStop(0.25,\"#80FF80\");\n            s.addColorStop(0.5,\"#80FF80\");\n            s.addColorStop(0.5,\"#D9FFD9\");\n            s.addColorStop(0.75,\"#D9FFD9\");\n            s.addColorStop(0.75,\"#80FF80\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#33FF33\");\n            s.addColorStop(0.25,\"#33FF33\");\n            s.addColorStop(0.25,\"#8CFF8C\");\n            s.addColorStop(0.5,\"#8CFF8C\");\n            s.addColorStop(0.5,\"#E6FFE6\");\n            s.addColorStop(0.75,\"#E6FFE6\");\n            s.addColorStop(0.75,\"#8CFF8C\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#40FF40\");\n            s.addColorStop(0.25,\"#40FF40\");\n            s.addColorStop(0.25,\"#99FF99\");\n            s.addColorStop(0.5,\"#99FF99\");\n            s.addColorStop(0.5,\"#F2FFF2\");\n            s.addColorStop(0.75,\"#F2FFF2\");\n            s.addColorStop(0.75,\"#99FF99\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4DFF4D\");\n            s.addColorStop(0.25,\"#4DFF4D\");\n            s.addColorStop(0.25,\"#A6FFA6\");\n            s.addColorStop(0.5,\"#A6FFA6\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#A6FFA6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#59FF59\");\n            s.addColorStop(0.25,\"#59FF59\");\n            s.addColorStop(0.25,\"#B3FFB3\");\n            s.addColorStop(0.5,\"#B3FFB3\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#B3FFB3\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#66FF66\");\n            s.addColorStop(0.25,\"#66FF66\");\n            s.addColorStop(0.25,\"#BFFFBF\");\n            s.addColorStop(0.5,\"#BFFFBF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#BFFFBF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#73FF73\");\n            s.addColorStop(0.25,\"#73FF73\");\n            s.addColorStop(0.25,\"#CCFFCC\");\n            s.addColorStop(0.5,\"#CCFFCC\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#CCFFCC\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#80FF80\");\n            s.addColorStop(0.25,\"#80FF80\");\n            s.addColorStop(0.25,\"#D9FFD9\");\n            s.addColorStop(0.5,\"#D9FFD9\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#D9FFD9\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#8CFF8C\");\n            s.addColorStop(0.25,\"#8CFF8C\");\n            s.addColorStop(0.25,\"#E6FFE6\");\n            s.addColorStop(0.5,\"#E6FFE6\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#E6FFE6\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#99FF99\");\n            s.addColorStop(0.25,\"#99FF99\");\n            s.addColorStop(0.25,\"#F2FFF2\");\n            s.addColorStop(0.5,\"#F2FFF2\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#F2FFF2\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#A6FFA6\");\n            s.addColorStop(0.25,\"#A6FFA6\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#B3FFB3\");\n            s.addColorStop(0.25,\"#B3FFB3\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#BFFFBF\");\n            s.addColorStop(0.25,\"#BFFFBF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#CCFFCC\");\n            s.addColorStop(0.25,\"#CCFFCC\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#D9FFD9\");\n            s.addColorStop(0.25,\"#D9FFD9\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#E6FFE6\");\n            s.addColorStop(0.25,\"#E6FFE6\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#F2FFF2\");\n            s.addColorStop(0.25,\"#F2FFF2\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#F3F3FF\");\n            s.addColorStop(0.75,\"#F3F3FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#E7E7FF\");\n            s.addColorStop(0.75,\"#E7E7FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#DBDBFF\");\n            s.addColorStop(0.75,\"#DBDBFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#CFCFFF\");\n            s.addColorStop(0.75,\"#CFCFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#C4C4FF\");\n            s.addColorStop(0.75,\"#C4C4FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#B8B8FF\");\n            s.addColorStop(0.75,\"#B8B8FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#ACACFF\");\n            s.addColorStop(0.75,\"#ACACFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#F3F3FF\");\n            s.addColorStop(0.5,\"#F3F3FF\");\n            s.addColorStop(0.5,\"#A0A0FF\");\n            s.addColorStop(0.75,\"#A0A0FF\");\n            s.addColorStop(0.75,\"#F3F3FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#E7E7FF\");\n            s.addColorStop(0.5,\"#E7E7FF\");\n            s.addColorStop(0.5,\"#9494FF\");\n            s.addColorStop(0.75,\"#9494FF\");\n            s.addColorStop(0.75,\"#E7E7FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#DBDBFF\");\n            s.addColorStop(0.5,\"#DBDBFF\");\n            s.addColorStop(0.5,\"#8888FF\");\n            s.addColorStop(0.75,\"#8888FF\");\n            s.addColorStop(0.75,\"#DBDBFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#CFCFFF\");\n            s.addColorStop(0.5,\"#CFCFFF\");\n            s.addColorStop(0.5,\"#7C7CFF\");\n            s.addColorStop(0.75,\"#7C7CFF\");\n            s.addColorStop(0.75,\"#CFCFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#C4C4FF\");\n            s.addColorStop(0.5,\"#C4C4FF\");\n            s.addColorStop(0.5,\"#7070FF\");\n            s.addColorStop(0.75,\"#7070FF\");\n            s.addColorStop(0.75,\"#C4C4FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#B8B8FF\");\n            s.addColorStop(0.5,\"#B8B8FF\");\n            s.addColorStop(0.5,\"#6464FF\");\n            s.addColorStop(0.75,\"#6464FF\");\n            s.addColorStop(0.75,\"#B8B8FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#ACACFF\");\n            s.addColorStop(0.5,\"#ACACFF\");\n            s.addColorStop(0.5,\"#5858FF\");\n            s.addColorStop(0.75,\"#5858FF\");\n            s.addColorStop(0.75,\"#ACACFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#F3F3FF\");\n            s.addColorStop(0.25,\"#F3F3FF\");\n            s.addColorStop(0.25,\"#A0A0FF\");\n            s.addColorStop(0.5,\"#A0A0FF\");\n            s.addColorStop(0.5,\"#4C4CFF\");\n            s.addColorStop(0.75,\"#4C4CFF\");\n            s.addColorStop(0.75,\"#A0A0FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#E7E7FF\");\n            s.addColorStop(0.25,\"#E7E7FF\");\n            s.addColorStop(0.25,\"#9494FF\");\n            s.addColorStop(0.5,\"#9494FF\");\n            s.addColorStop(0.5,\"#4141FF\");\n            s.addColorStop(0.75,\"#4141FF\");\n            s.addColorStop(0.75,\"#9494FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#DBDBFF\");\n            s.addColorStop(0.25,\"#DBDBFF\");\n            s.addColorStop(0.25,\"#8888FF\");\n            s.addColorStop(0.5,\"#8888FF\");\n            s.addColorStop(0.5,\"#3535FF\");\n            s.addColorStop(0.75,\"#3535FF\");\n            s.addColorStop(0.75,\"#8888FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#CFCFFF\");\n            s.addColorStop(0.25,\"#CFCFFF\");\n            s.addColorStop(0.25,\"#7C7CFF\");\n            s.addColorStop(0.5,\"#7C7CFF\");\n            s.addColorStop(0.5,\"#2929FF\");\n            s.addColorStop(0.75,\"#2929FF\");\n            s.addColorStop(0.75,\"#7C7CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#C3C3FF\");\n            s.addColorStop(0.25,\"#C3C3FF\");\n            s.addColorStop(0.25,\"#7070FF\");\n            s.addColorStop(0.5,\"#7070FF\");\n            s.addColorStop(0.5,\"#1D1DFF\");\n            s.addColorStop(0.75,\"#1D1DFF\");\n            s.addColorStop(0.75,\"#7070FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#B8B8FF\");\n            s.addColorStop(0.25,\"#B8B8FF\");\n            s.addColorStop(0.25,\"#6464FF\");\n            s.addColorStop(0.5,\"#6464FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#6464FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#ACACFF\");\n            s.addColorStop(0.25,\"#ACACFF\");\n            s.addColorStop(0.25,\"#5858FF\");\n            s.addColorStop(0.5,\"#5858FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#5858FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#A0A0FF\");\n            s.addColorStop(0.25,\"#A0A0FF\");\n            s.addColorStop(0.25,\"#4C4CFF\");\n            s.addColorStop(0.5,\"#4C4CFF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#4C4CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#9494FF\");\n            s.addColorStop(0.25,\"#9494FF\");\n            s.addColorStop(0.25,\"#4141FF\");\n            s.addColorStop(0.5,\"#4141FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#4141FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#8888FF\");\n            s.addColorStop(0.25,\"#8888FF\");\n            s.addColorStop(0.25,\"#3535FF\");\n            s.addColorStop(0.5,\"#3535FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#3535FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#7C7CFF\");\n            s.addColorStop(0.25,\"#7C7CFF\");\n            s.addColorStop(0.25,\"#2929FF\");\n            s.addColorStop(0.5,\"#2929FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#2929FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#7070FF\");\n            s.addColorStop(0.25,\"#7070FF\");\n            s.addColorStop(0.25,\"#1D1DFF\");\n            s.addColorStop(0.5,\"#1D1DFF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1D1DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#6464FF\");\n            s.addColorStop(0.25,\"#6464FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#5858FF\");\n            s.addColorStop(0.25,\"#5858FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4C4CFF\");\n            s.addColorStop(0.25,\"#4C4CFF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4141FF\");\n            s.addColorStop(0.25,\"#4141FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#3535FF\");\n            s.addColorStop(0.25,\"#3535FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#2929FF\");\n            s.addColorStop(0.25,\"#2929FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1D1DFF\");\n            s.addColorStop(0.25,\"#1D1DFF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#1D1DFF\");\n            s.addColorStop(0.75,\"#1D1DFF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#2929FF\");\n            s.addColorStop(0.75,\"#2929FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#3535FF\");\n            s.addColorStop(0.75,\"#3535FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#4141FF\");\n            s.addColorStop(0.75,\"#4141FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#4D4DFF\");\n            s.addColorStop(0.75,\"#4D4DFF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#5858FF\");\n            s.addColorStop(0.75,\"#5858FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.5,\"#1111FF\");\n            s.addColorStop(0.5,\"#6464FF\");\n            s.addColorStop(0.75,\"#6464FF\");\n            s.addColorStop(0.75,\"#1111FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#1D1DFF\");\n            s.addColorStop(0.5,\"#1D1DFF\");\n            s.addColorStop(0.5,\"#7070FF\");\n            s.addColorStop(0.75,\"#7070FF\");\n            s.addColorStop(0.75,\"#1D1DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#2929FF\");\n            s.addColorStop(0.5,\"#2929FF\");\n            s.addColorStop(0.5,\"#7C7CFF\");\n            s.addColorStop(0.75,\"#7C7CFF\");\n            s.addColorStop(0.75,\"#2929FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#3535FF\");\n            s.addColorStop(0.5,\"#3535FF\");\n            s.addColorStop(0.5,\"#8888FF\");\n            s.addColorStop(0.75,\"#8888FF\");\n            s.addColorStop(0.75,\"#3535FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#4141FF\");\n            s.addColorStop(0.5,\"#4141FF\");\n            s.addColorStop(0.5,\"#9494FF\");\n            s.addColorStop(0.75,\"#9494FF\");\n            s.addColorStop(0.75,\"#4141FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#4D4DFF\");\n            s.addColorStop(0.5,\"#4D4DFF\");\n            s.addColorStop(0.5,\"#A0A0FF\");\n            s.addColorStop(0.75,\"#A0A0FF\");\n            s.addColorStop(0.75,\"#4D4DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#5858FF\");\n            s.addColorStop(0.5,\"#5858FF\");\n            s.addColorStop(0.5,\"#ACACFF\");\n            s.addColorStop(0.75,\"#ACACFF\");\n            s.addColorStop(0.75,\"#5858FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1111FF\");\n            s.addColorStop(0.25,\"#1111FF\");\n            s.addColorStop(0.25,\"#6464FF\");\n            s.addColorStop(0.5,\"#6464FF\");\n            s.addColorStop(0.5,\"#B8B8FF\");\n            s.addColorStop(0.75,\"#B8B8FF\");\n            s.addColorStop(0.75,\"#6464FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#1D1DFF\");\n            s.addColorStop(0.25,\"#1D1DFF\");\n            s.addColorStop(0.25,\"#7070FF\");\n            s.addColorStop(0.5,\"#7070FF\");\n            s.addColorStop(0.5,\"#C4C4FF\");\n            s.addColorStop(0.75,\"#C4C4FF\");\n            s.addColorStop(0.75,\"#7070FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#2929FF\");\n            s.addColorStop(0.25,\"#2929FF\");\n            s.addColorStop(0.25,\"#7C7CFF\");\n            s.addColorStop(0.5,\"#7C7CFF\");\n            s.addColorStop(0.5,\"#CFCFFF\");\n            s.addColorStop(0.75,\"#CFCFFF\");\n            s.addColorStop(0.75,\"#7C7CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#3535FF\");\n            s.addColorStop(0.25,\"#3535FF\");\n            s.addColorStop(0.25,\"#8888FF\");\n            s.addColorStop(0.5,\"#8888FF\");\n            s.addColorStop(0.5,\"#DBDBFF\");\n            s.addColorStop(0.75,\"#DBDBFF\");\n            s.addColorStop(0.75,\"#8888FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4141FF\");\n            s.addColorStop(0.25,\"#4141FF\");\n            s.addColorStop(0.25,\"#9494FF\");\n            s.addColorStop(0.5,\"#9494FF\");\n            s.addColorStop(0.5,\"#E7E7FF\");\n            s.addColorStop(0.75,\"#E7E7FF\");\n            s.addColorStop(0.75,\"#9494FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#4D4DFF\");\n            s.addColorStop(0.25,\"#4D4DFF\");\n            s.addColorStop(0.25,\"#A0A0FF\");\n            s.addColorStop(0.5,\"#A0A0FF\");\n            s.addColorStop(0.5,\"#F3F3FF\");\n            s.addColorStop(0.75,\"#F3F3FF\");\n            s.addColorStop(0.75,\"#A0A0FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#5858FF\");\n            s.addColorStop(0.25,\"#5858FF\");\n            s.addColorStop(0.25,\"#ACACFF\");\n            s.addColorStop(0.5,\"#ACACFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#ACACFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#6464FF\");\n            s.addColorStop(0.25,\"#6464FF\");\n            s.addColorStop(0.25,\"#B8B8FF\");\n            s.addColorStop(0.5,\"#B8B8FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#B8B8FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#7070FF\");\n            s.addColorStop(0.25,\"#7070FF\");\n            s.addColorStop(0.25,\"#C4C4FF\");\n            s.addColorStop(0.5,\"#C4C4FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#C4C4FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#7C7CFF\");\n            s.addColorStop(0.25,\"#7C7CFF\");\n            s.addColorStop(0.25,\"#CFCFFF\");\n            s.addColorStop(0.5,\"#CFCFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#CFCFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#8888FF\");\n            s.addColorStop(0.25,\"#8888FF\");\n            s.addColorStop(0.25,\"#DBDBFF\");\n            s.addColorStop(0.5,\"#DBDBFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#DBDBFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#9494FF\");\n            s.addColorStop(0.25,\"#9494FF\");\n            s.addColorStop(0.25,\"#E7E7FF\");\n            s.addColorStop(0.5,\"#E7E7FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#E7E7FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#A0A0FF\");\n            s.addColorStop(0.25,\"#A0A0FF\");\n            s.addColorStop(0.25,\"#F3F3FF\");\n            s.addColorStop(0.5,\"#F3F3FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#F3F3FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#ACACFF\");\n            s.addColorStop(0.25,\"#ACACFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#B8B8FF\");\n            s.addColorStop(0.25,\"#B8B8FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#C4C4FF\");\n            s.addColorStop(0.25,\"#C4C4FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#CFCFFF\");\n            s.addColorStop(0.25,\"#CFCFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#DBDBFF\");\n            s.addColorStop(0.25,\"#DBDBFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#E7E7FF\");\n            s.addColorStop(0.25,\"#E7E7FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#F3F3FF\");\n            s.addColorStop(0.25,\"#F3F3FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFF2FF\");\n            s.addColorStop(0.75,\"#FFF2FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFE6FF\");\n            s.addColorStop(0.75,\"#FFE6FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFD9FF\");\n            s.addColorStop(0.75,\"#FFD9FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFCCFF\");\n            s.addColorStop(0.75,\"#FFCCFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFBFFF\");\n            s.addColorStop(0.75,\"#FFBFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFB3FF\");\n            s.addColorStop(0.75,\"#FFB3FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFA6FF\");\n            s.addColorStop(0.75,\"#FFA6FF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFF2FF\");\n            s.addColorStop(0.5,\"#FFF2FF\");\n            s.addColorStop(0.5,\"#FF99FF\");\n            s.addColorStop(0.75,\"#FF99FF\");\n            s.addColorStop(0.75,\"#FFF2FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFE6FF\");\n            s.addColorStop(0.5,\"#FFE6FF\");\n            s.addColorStop(0.5,\"#FF8CFF\");\n            s.addColorStop(0.75,\"#FF8CFF\");\n            s.addColorStop(0.75,\"#FFE6FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFD9FF\");\n            s.addColorStop(0.5,\"#FFD9FF\");\n            s.addColorStop(0.5,\"#FF80FF\");\n            s.addColorStop(0.75,\"#FF80FF\");\n            s.addColorStop(0.75,\"#FFD9FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFCCFF\");\n            s.addColorStop(0.5,\"#FFCCFF\");\n            s.addColorStop(0.5,\"#FF73FF\");\n            s.addColorStop(0.75,\"#FF73FF\");\n            s.addColorStop(0.75,\"#FFCCFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFBFFF\");\n            s.addColorStop(0.5,\"#FFBFFF\");\n            s.addColorStop(0.5,\"#FF66FF\");\n            s.addColorStop(0.75,\"#FF66FF\");\n            s.addColorStop(0.75,\"#FFBFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFB3FF\");\n            s.addColorStop(0.5,\"#FFB3FF\");\n            s.addColorStop(0.5,\"#FF59FF\");\n            s.addColorStop(0.75,\"#FF59FF\");\n            s.addColorStop(0.75,\"#FFB3FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFA6FF\");\n            s.addColorStop(0.5,\"#FFA6FF\");\n            s.addColorStop(0.5,\"#FF4CFF\");\n            s.addColorStop(0.75,\"#FF4CFF\");\n            s.addColorStop(0.75,\"#FFA6FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFF2FF\");\n            s.addColorStop(0.25,\"#FFF2FF\");\n            s.addColorStop(0.25,\"#FF99FF\");\n            s.addColorStop(0.5,\"#FF99FF\");\n            s.addColorStop(0.5,\"#FF40FF\");\n            s.addColorStop(0.75,\"#FF40FF\");\n            s.addColorStop(0.75,\"#FF99FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFE5FF\");\n            s.addColorStop(0.25,\"#FFE5FF\");\n            s.addColorStop(0.25,\"#FF8CFF\");\n            s.addColorStop(0.5,\"#FF8CFF\");\n            s.addColorStop(0.5,\"#FF33FF\");\n            s.addColorStop(0.75,\"#FF33FF\");\n            s.addColorStop(0.75,\"#FF8CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFD9FF\");\n            s.addColorStop(0.25,\"#FFD9FF\");\n            s.addColorStop(0.25,\"#FF7FFF\");\n            s.addColorStop(0.5,\"#FF7FFF\");\n            s.addColorStop(0.5,\"#FF26FF\");\n            s.addColorStop(0.75,\"#FF26FF\");\n            s.addColorStop(0.75,\"#FF7FFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFCCFF\");\n            s.addColorStop(0.25,\"#FFCCFF\");\n            s.addColorStop(0.25,\"#FF73FF\");\n            s.addColorStop(0.5,\"#FF73FF\");\n            s.addColorStop(0.5,\"#FF19FF\");\n            s.addColorStop(0.75,\"#FF19FF\");\n            s.addColorStop(0.75,\"#FF73FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFBFFF\");\n            s.addColorStop(0.25,\"#FFBFFF\");\n            s.addColorStop(0.25,\"#FF66FF\");\n            s.addColorStop(0.5,\"#FF66FF\");\n            s.addColorStop(0.5,\"#FF0DFF\");\n            s.addColorStop(0.75,\"#FF0DFF\");\n            s.addColorStop(0.75,\"#FF66FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFB2FF\");\n            s.addColorStop(0.25,\"#FFB2FF\");\n            s.addColorStop(0.25,\"#FF59FF\");\n            s.addColorStop(0.5,\"#FF59FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF59FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFA6FF\");\n            s.addColorStop(0.25,\"#FFA6FF\");\n            s.addColorStop(0.25,\"#FF4CFF\");\n            s.addColorStop(0.5,\"#FF4CFF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF4CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF99FF\");\n            s.addColorStop(0.25,\"#FF99FF\");\n            s.addColorStop(0.25,\"#FF40FF\");\n            s.addColorStop(0.5,\"#FF40FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF40FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF8CFF\");\n            s.addColorStop(0.25,\"#FF8CFF\");\n            s.addColorStop(0.25,\"#FF33FF\");\n            s.addColorStop(0.5,\"#FF33FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF33FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF7FFF\");\n            s.addColorStop(0.25,\"#FF7FFF\");\n            s.addColorStop(0.25,\"#FF26FF\");\n            s.addColorStop(0.5,\"#FF26FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF26FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF73FF\");\n            s.addColorStop(0.25,\"#FF73FF\");\n            s.addColorStop(0.25,\"#FF19FF\");\n            s.addColorStop(0.5,\"#FF19FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF19FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF66FF\");\n            s.addColorStop(0.25,\"#FF66FF\");\n            s.addColorStop(0.25,\"#FF0DFF\");\n            s.addColorStop(0.5,\"#FF0DFF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF0DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF59FF\");\n            s.addColorStop(0.25,\"#FF59FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4CFF\");\n            s.addColorStop(0.25,\"#FF4CFF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF40FF\");\n            s.addColorStop(0.25,\"#FF40FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF33FF\");\n            s.addColorStop(0.25,\"#FF33FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF26FF\");\n            s.addColorStop(0.25,\"#FF26FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF19FF\");\n            s.addColorStop(0.25,\"#FF19FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0DFF\");\n            s.addColorStop(0.25,\"#FF0DFF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF0DFF\");\n            s.addColorStop(0.75,\"#FF0DFF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF1AFF\");\n            s.addColorStop(0.75,\"#FF1AFF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF26FF\");\n            s.addColorStop(0.75,\"#FF26FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF33FF\");\n            s.addColorStop(0.75,\"#FF33FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF40FF\");\n            s.addColorStop(0.75,\"#FF40FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF4DFF\");\n            s.addColorStop(0.75,\"#FF4DFF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF00FF\");\n            s.addColorStop(0.5,\"#FF59FF\");\n            s.addColorStop(0.75,\"#FF59FF\");\n            s.addColorStop(0.75,\"#FF00FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF0DFF\");\n            s.addColorStop(0.5,\"#FF0DFF\");\n            s.addColorStop(0.5,\"#FF66FF\");\n            s.addColorStop(0.75,\"#FF66FF\");\n            s.addColorStop(0.75,\"#FF0DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF1AFF\");\n            s.addColorStop(0.5,\"#FF1AFF\");\n            s.addColorStop(0.5,\"#FF73FF\");\n            s.addColorStop(0.75,\"#FF73FF\");\n            s.addColorStop(0.75,\"#FF1AFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF26FF\");\n            s.addColorStop(0.5,\"#FF26FF\");\n            s.addColorStop(0.5,\"#FF80FF\");\n            s.addColorStop(0.75,\"#FF80FF\");\n            s.addColorStop(0.75,\"#FF26FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF33FF\");\n            s.addColorStop(0.5,\"#FF33FF\");\n            s.addColorStop(0.5,\"#FF8CFF\");\n            s.addColorStop(0.75,\"#FF8CFF\");\n            s.addColorStop(0.75,\"#FF33FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF40FF\");\n            s.addColorStop(0.5,\"#FF40FF\");\n            s.addColorStop(0.5,\"#FF99FF\");\n            s.addColorStop(0.75,\"#FF99FF\");\n            s.addColorStop(0.75,\"#FF40FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF4DFF\");\n            s.addColorStop(0.5,\"#FF4DFF\");\n            s.addColorStop(0.5,\"#FFA6FF\");\n            s.addColorStop(0.75,\"#FFA6FF\");\n            s.addColorStop(0.75,\"#FF4DFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF00FF\");\n            s.addColorStop(0.25,\"#FF59FF\");\n            s.addColorStop(0.5,\"#FF59FF\");\n            s.addColorStop(0.5,\"#FFB3FF\");\n            s.addColorStop(0.75,\"#FFB3FF\");\n            s.addColorStop(0.75,\"#FF59FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF0DFF\");\n            s.addColorStop(0.25,\"#FF0DFF\");\n            s.addColorStop(0.25,\"#FF66FF\");\n            s.addColorStop(0.5,\"#FF66FF\");\n            s.addColorStop(0.5,\"#FFBFFF\");\n            s.addColorStop(0.75,\"#FFBFFF\");\n            s.addColorStop(0.75,\"#FF66FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF1AFF\");\n            s.addColorStop(0.25,\"#FF1AFF\");\n            s.addColorStop(0.25,\"#FF73FF\");\n            s.addColorStop(0.5,\"#FF73FF\");\n            s.addColorStop(0.5,\"#FFCCFF\");\n            s.addColorStop(0.75,\"#FFCCFF\");\n            s.addColorStop(0.75,\"#FF73FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF26FF\");\n            s.addColorStop(0.25,\"#FF26FF\");\n            s.addColorStop(0.25,\"#FF80FF\");\n            s.addColorStop(0.5,\"#FF80FF\");\n            s.addColorStop(0.5,\"#FFD9FF\");\n            s.addColorStop(0.75,\"#FFD9FF\");\n            s.addColorStop(0.75,\"#FF80FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF33FF\");\n            s.addColorStop(0.25,\"#FF33FF\");\n            s.addColorStop(0.25,\"#FF8CFF\");\n            s.addColorStop(0.5,\"#FF8CFF\");\n            s.addColorStop(0.5,\"#FFE6FF\");\n            s.addColorStop(0.75,\"#FFE6FF\");\n            s.addColorStop(0.75,\"#FF8CFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF40FF\");\n            s.addColorStop(0.25,\"#FF40FF\");\n            s.addColorStop(0.25,\"#FF99FF\");\n            s.addColorStop(0.5,\"#FF99FF\");\n            s.addColorStop(0.5,\"#FFF2FF\");\n            s.addColorStop(0.75,\"#FFF2FF\");\n            s.addColorStop(0.75,\"#FF99FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF4DFF\");\n            s.addColorStop(0.25,\"#FF4DFF\");\n            s.addColorStop(0.25,\"#FFA6FF\");\n            s.addColorStop(0.5,\"#FFA6FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFA6FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF59FF\");\n            s.addColorStop(0.25,\"#FF59FF\");\n            s.addColorStop(0.25,\"#FFB3FF\");\n            s.addColorStop(0.5,\"#FFB3FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFB3FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF66FF\");\n            s.addColorStop(0.25,\"#FF66FF\");\n            s.addColorStop(0.25,\"#FFBFFF\");\n            s.addColorStop(0.5,\"#FFBFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFBFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF73FF\");\n            s.addColorStop(0.25,\"#FF73FF\");\n            s.addColorStop(0.25,\"#FFCCFF\");\n            s.addColorStop(0.5,\"#FFCCFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFCCFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF80FF\");\n            s.addColorStop(0.25,\"#FF80FF\");\n            s.addColorStop(0.25,\"#FFD9FF\");\n            s.addColorStop(0.5,\"#FFD9FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFD9FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF8CFF\");\n            s.addColorStop(0.25,\"#FF8CFF\");\n            s.addColorStop(0.25,\"#FFE6FF\");\n            s.addColorStop(0.5,\"#FFE6FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFE6FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FF99FF\");\n            s.addColorStop(0.25,\"#FF99FF\");\n            s.addColorStop(0.25,\"#FFF2FF\");\n            s.addColorStop(0.5,\"#FFF2FF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFF2FF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFA6FF\");\n            s.addColorStop(0.25,\"#FFA6FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFB3FF\");\n            s.addColorStop(0.25,\"#FFB3FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFBFFF\");\n            s.addColorStop(0.25,\"#FFBFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFCCFF\");\n            s.addColorStop(0.25,\"#FFCCFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFD9FF\");\n            s.addColorStop(0.25,\"#FFD9FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFE6FF\");\n            s.addColorStop(0.25,\"#FFE6FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFF2FF\");\n            s.addColorStop(0.25,\"#FFF2FF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        ",
                                "\n            s=t.createLinearGradient(0,0,0,i);\n            s.addColorStop(0,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.25,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.5,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n            s.addColorStop(0.75,\"#FFFFFF\");\n        "
                            ]
                        },
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"darkblue"),s.addColorStop(0.1,"darkblue"),s.addColorStop(0.3,"#08B7FC"), s.addColorStop(0.3,"#03FFEE"), s.addColorStop(0.4,"#A8FFF9"), s.addColorStop(0.5,"white"), s.addColorStop(0.6,"#A8FFF9"), s.addColorStop(0.7,"#03FFEE"), s.addColorStop(0.7,"#08B7FC"),s.addColorStop(0.9,"darkblue");`,
                        envMap: `
                            const loader = new THREE.CubeTextureLoader();
                            loader.setCrossOrigin('anonymous');

                            const URL = "https://i.ibb.co/QMKPt5j/wavesbaw.png";

                            const urls = [
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                            ];

                            const envMap = loader.load(urls);
                            envMap.mapping = THREE.CubeReflectionMapping;

                            window._envMaps["crys"] = envMap;
                        `,
                        func: `

                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    //map:llIl1,
                                    //bumpMap:llIl1,
                                    //specular:0x999999,
                                    shininess:0,
                                    bumpScale:1,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,1,1),
                                    envMap: window._envMaps["crys"],
                                    metalness: 1,
                                    roughness: 0.1,
                                    flatShading: false,
                                    //emissiveMap:l0I1I,
                                }
                            )
                        `
                    },
                    "void": {
                        name: "Void",
                        ignore: true,
                        funcName: "buildCVrysdfstalMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"darkblue"),s.addColorStop(0.1,"darkblue"),s.addColorStop(0.3,"#08B7FC"), s.addColorStop(0.3,"#03FFEE"), s.addColorStop(0.4,"#A8FFF9"), s.addColorStop(0.5,"white"), s.addColorStop(0.6,"#A8FFF9"), s.addColorStop(0.7,"#03FFEE"), s.addColorStop(0.7,"#08B7FC"),s.addColorStop(0.9,"darkblue");`,
                        envMap: `
                            const loader = new THREE.CubeTextureLoader();
                            loader.setCrossOrigin('anonymous');

                            const URL = "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/noise.png";

                            const urls = [
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                            ];

                            const envMap = loader.load(urls);
                            envMap.mapping = THREE.CubeRefractionMapping;

                            window._envMaps["vd"] = envMap;
                        `,
                        func: `

                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    //map:llIl1,
                                    //bumpMap:llIl1,
                                    //specular:0x999999,
                                    shininess:0,
                                    bumpScale:1,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,1,1),
                                    envMap: window._envMaps["vd"],
                                    metalness: 1,
                                    roughness: 0.1,
                                    refractionRatio: 0.98,
                                    flatShading: false,
                                    //emissiveMap:l0I1I,
                                }
                            )
                        `
                    },
                    // "goldv2": {
                    //     name: "Gold V2",
                    //     funcName: "buildGoldV2Material",
                    //     material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"white"),s.addColorStop(0.5, "gold"), s.addColorStop(1, "orange");`,
                    //     envMap: `
                    //         const loader = new THREE.CubeTextureLoader();
                    //         loader.setCrossOrigin('anonymous');

                    //         const URL = "https://i.ibb.co/8gF85x6/gold.png";

                    //         const urls = [URL, URL, URL, URL, URL, URL];

                    //         const envMap = loader.load(urls);
                    //         envMap.mapping = THREE.CubeReflectionMapping;

                    //         window._envMaps["goldv2"] = envMap;
                    //     `,
                    //     func: `

                    //         return this.material=new THREE.MeshPhongMaterial(
                    //             {
                    //                 map:llIl1,
                    //                 bumpMap:llIl1,
                    //                 //specular:0x999999,
                    //                 color: 0xFFFFFF,
                    //                 shininess:0,
                    //                 bumpScale:1,
                    //                 emissive:l0Il1.hsvToRgbHex(this.hue,1,1),
                    //                 envMap: window._envMaps["goldv2"],
                    //                 reflectivity: .5,
                    //                 combine: THREE.MixOperation,
                    //                 metalness: 1,
                    //                 roughness: 0.1,
                    //                 flatShading: false,
                    //                 emissiveMap:l0I1I,
                    //             }
                    //         )
                    //     `
                    // },
                    "_vid_valor": {
                        name: "Valor",
                        ignore: false,
                        funcName: "buildValorMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#fdc838"),s.addColorStop(1, "#d42b74");`,
                        video: {
                            thumbnail: 1,
                            steps: [
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(0, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(18, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(36, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(54, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(72, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(90, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(108, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(126, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(144, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(162, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(180, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(198, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(216, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(234, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(252, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(270, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(288, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(306, 100%, 50%)\");s.addColorStop(0.7, 'white');",
                                "s=t.createLinearGradient(0,0,0,i),s.addColorStop(0.3, 'white'),                                s.addColorStop(0.5,\"hsl(324, 100%, 50%)\");s.addColorStop(0.7, 'white');"
                            ]
                        },
                        envMap: `
                            const loader = new THREE.CubeTextureLoader();
                            loader.setCrossOrigin('anonymous');

                            const URL = "https://i.ibb.co/JvBWkYd/rainbow.png";

                            const urls = [
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                                URL,
                            ];

                            const envMap = loader.load(urls);
                            envMap.mapping = THREE.CubeReflectionMapping;

                            window._envMaps["valor"] = envMap;
                        `,
                        func: `

                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    //map:llIl1,
                                    //bumpMap:llIl1,
                                    //specular:0x999999,
                                    shininess:0,
                                    bumpScale:1,
                                    emissive:l0Il1.hsvToRgbHex(this.hue,1,1),
                                    envMap: window._envMaps["valor"],
                                    metalness: 1,
                                    roughness: 0.1,
                                    flatShading: false,
                                    //emissiveMap:l0I1I,
                                }
                            )
                        `
                    },
                    "urahara": {
                        name: "Urahara",
                        funcName: "buildUraharaMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),
                        s.addColorStop(0,"white"),
                        s.addColorStop(.1, "white"),
                        s.addColorStop(.1,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.2, "hsl(94, 16%, 52%)"),
                        s.addColorStop(.2,"white"),
                        s.addColorStop(.3, "white"),
                        s.addColorStop(.3,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.4, "hsl(94, 16%, 52%)"),
                        s.addColorStop(.4,"white"),
                        s.addColorStop(.5,"white"),
                        s.addColorStop(.5,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.6,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.6,"white"),
                        s.addColorStop(.7,"white"),
                        s.addColorStop(.7,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.8,"hsl(94, 16%, 52%)"),
                        s.addColorStop(.8,"white"),
                        s.addColorStop(.9,"white"),
                        s.addColorStop(.9,"hsl(94, 16%, 52%)");`,
                        func: `
                            var t;
                            return this.material=new THREE.MeshPhongMaterial({map:llIl1,bumpMap:llIl1,specularMap:llIl1,specular:4243711,shininess:30,bumpScale:.1,color:0xABE494,emissive:l0Il1.hsvToRgbHex(this.hue,.5,1),emissiveMap:OOlO0})
                        `
                    },
                    // "camo": {
                    //     name: "Camo",
                    //     funcName: "buildCamoMaterial",
                    //     material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"blue"),s.addColorStop(0.5, "darkred"), s.addColorStop(0.5, "orange"), s.addColorStop(1.0, "#8FF500");`,
                    //     envMap: `
                    //         const loader = new THREE.CubeTextureLoader();
                    //         loader.setCrossOrigin('anonymous');

                    //         const URL = "https://i.ibb.co/L8vcv2T/camo1.png";

                    //         const urls = [
                    //             URL,
                    //             URL,
                    //             URL,
                    //             URL,
                    //             URL,
                    //             URL,
                    //         ];

                    //         const envMap = loader.load(urls);
                    //         envMap.mapping = THREE.CubeReflectionMapping;

                    //         window._envMaps["camo"] = envMap;
                    //     `,
                    //     func: `

                    //         return this.material=new THREE.MeshPhongMaterial(
                    //             {
                    //                 map:llIl1,
                    //                 bumpMap:llIl1,
                    //                 //specular:0x999999,
                    //                 shininess:0,
                    //                 bumpScale:.1,
                    //                 emissive:l0Il1.hsvToRgbHex(this.hue,1,1),
                    //                 envMap: window._envMaps["camo"],
                    //                 flatShading: false,
                    //                 emissiveMap:l0I1I,
                    //             }
                    //         )
                    //     `
                    // },
                    "light": {
                        name: "Light Yagami",
                        ignore: true,
                        funcName: "buildLightMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"yellow"),s.addColorStop(0.5, "white"), s.addColorStop(0.5, "yellow");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular: 0xFFFFFF,
                                    shininess: 100,
                                    bumpScale: .1,
                                    color: 0xFFFFFF,
                                    emissive: 0xFFFFFF,
                                }
                            )
                        `
                    },
                    "neon": {
                        name: "Neon",
                        funcName: "buildNeonMaterial",
                        material: `s=t.createLinearGradient(0,0,i*2,0),s.addColorStop(0,"black"),s.addColorStop(0.25,"black"),s.addColorStop(0.25, "#ff00ff"),s.addColorStop(0.5,"white"),s.addColorStop(0.75,"cyan"),s.addColorStop(0.75,"black");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                                {
                                    map:llIl1,
                                    bumpMap:llIl1,
                                    specular: l0Il1.hsvToRgbHex(this.hue, 1, 1),
                                    shininess: 100,
                                    bumpScale: .1,
                                    wireframe: true,
                                    color: l0Il1.hsvToRgbHex(this.hue, 1, 1),
                                    emissive: l0Il1.hsvToRgbHex(this.hue, 1, 1),
                                }
                            )
                        `
                    },
                    "invert": {
                        name: "Invert",
                        funcName: "buildInvertMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"white"), s.addColorStop(0.5, "black"), s.addColorStop(0.5, "white");`,
                        func: `
                            return this.material=new THREE.MeshPhongMaterial(
                            {map:llIl1,
                            bumpMap:llIl1,
                            specularMap:llIl1,
                            specular:8413264,
                            shininess:30,
                            bumpScale:.1,
                            color:10531008,
                            emissive:l0Il1.hsvToRgbHex(this.hue,.5,1),
                            emissiveMap:OOlO0,
                            side: THREE.BackSide,
                            }
                            )
                        `
                    },
                    "_vid_halo": {
                        name: "Halow",
                        ignore: true,
                        funcName: "buildHaloMaterial",
                        material: `s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"white"), s.addColorStop(0.5, "black"), s.addColorStop(0.5, "white");`,
                        video: {
                            steps: [
                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(0, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(18, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(36, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(54, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(72, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(90, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(108, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(126, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(144, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(162, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(180, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(198, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(216, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(234, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(252, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(270, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(288, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(306, 100%, 50%)");`,

                                `s=t.createLinearGradient(0,0,0,i),
                                s.addColorStop(0,"hsl(324, 100%, 50%)");`,
                            ]
                        },
                        func:
                        `
                            return this.material=new THREE.MeshPhongMaterial(
                            {map:llIl1,
                            bumpMap:llIl1,
                            specularMap:llIl1,
                            specular:8413264,
                            shininess:30,
                            bumpScale:.1,
                            color:10531008,
                            emissive:l0Il1.hsvToRgbHex(this.hue,.5,1),
                            emissiveMap:OOlO0,
                            side: THREE.BackSide,
                            }
                            )
                        `
                    },
                }

                if (!shouldPerformReplacements) {
                    const LS_CODE = localStorage.getItem(LS_PREFIX + "CACHED_CODE");
                    if (LS_CODE && !DEBUG_MODE) {
                        //await announceLoadJob("Loading cached code...");
                        srcnew = LS_CODE;
                        for (let insert of Object.keys(textureInsert)) {
                            let st = textureInsert[insert]?.video?.steps?.length;
                            window._videoBadgeInfo[insert] = {steps: st ? st : 4};
                        }
                        return log("info", "Skipped replacements");
                    }
                };


                //await announceLoadJob("Initializing replacements...");
                const REPLACEMENTS = {
                    DIFF_CHECK: DEBUG_MODE,
                    reg: [
                        //[`this.geometry.addAttribute("opac",new THREE.BufferAttribute(this.opac,1))`, `this.geometry.addAttribute("opac",new THREE.BufferAttribute(this.opac,1))`],
                        //["this.number_of_suns=1", "this.number_of_suns=0"],
                        //[`rgba(255,255,255,.7)":"rgba(255,255,255,.3)"`, `rgba(255,0,0,.7)":"rgba(255,0,0,.3)"`],
                        //[`this.refresh_time=e+1e3,`, `this.refresh_time=e+1e3,console.log(this.refresh_time),`],
                        [`<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min.js"></script>`,`
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min.js"></script>
                        `],

                        [/<style[\s\S]*?>[\s\S]*?<\/style>/, `
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ndfsaaa/3gr@main/css.css">
                                <style>` + CSS + "</style>"],

                                [`>110`,
                                    `>2000`],
                        //[".01+.015*(a+1)", ".01+.015*(a+1)"],
                        [`"blank"!==this.custom.badge`, `"asdgfftbtry"!==this.custom.badge`], // show blank badge
                        [`case"nwac":this.icon="https://starblast.io/ecp/nwac.png";break;`,
                            `case"nwac":this.icon="https://starblast.io/ecp/nwac.png";break;case"blank":this.icon="https://i.ibb.co/gVKRrVY/blank.png";break;`], // show blank badge
                        ["this.phrase.length>=4", "this.phrase.length>=5"], // 5 emojis
                        ["I010l:91", "I010l:92"], // switch to new protocol
                        // ["t.prototype.needsUpdate=function(){return this.II00l||null==this.image||this.rendered_width!==this.I1111||this.rendered_height!==this.I10lI}",
                        //     `t.prototype.needsUpdate=function(){
                        //         let w = window._animationsRequireUpdate;
                        //         if (w) {
                        //             console.log("Windowed update");
                        //             window._animationsRequireUpdate = false;
                        //         }
                        //         return w||this.II00l||null==this.image||this.rendered_width!==this.I1111||this.rendered_height!==this.I10lI
                        //     }`],
                        // [`if(I=Math.round(i/2.2),null!=this.icon&&this.icon.startsWith("http")){if(this.icon=this.icon.replace("http:","https:"),null==this.icon_src&&(this.icon_src=new Image,this.icon_src.crossOrigin="Anonymous",this.icon_src.src=this.icon,this.icon_src.onload=function(t){return function(){return t.lI0l1(),t.updateImage()}}(this)),this.icon_src.complete)try{s=document.createElement("canvas"),s.width=i,s.height=i,l=s.getContext("2d"),l.fillStyle="#FFF",l.beginPath(),l.arc(i/2,i/2,.45*i,0,180*THREE.Math.DEG2RAD*2,!0),l.fill(),l.globalCompositeOperation="source-in",l.drawImage(this.icon_src,.05*i,.05*i,.9*i,.9*i),t.drawImage(s,e/2-.5*i,i/2-.5*i,i,i)}catch(t){t}}else{switch(t.font=I+"pt SBGlyphs",t.textBaseline="middle",t.textAlign="center",this.icon){case"reddit":t.fillStyle="#246";break`,
                        //     `if(I=Math.round(i/2.2),null!=this.icon&&this.icon.startsWith("http")){
                        //         if(this.icon=this.icon.replace("http:","https:"),

                        //             if (this.icon_src == null) {
                        //                 (this.icon_src=new Image,this.icon_src.crossOrigin="Anonymous",this.icon_src.src=this.icon,this.icon_src.onload=function(t){return function(){return t.lI0l1(),t.updateImage()}}(this)),this.icon_src.complete)try{s=document.createElement("canvas"),s.width=i,s.height=i,l=s.getContext("2d"),l.fillStyle="#FFF",l.beginPath(),l.arc(i/2,i/2,.45*i,0,180*THREE.Math.DEG2RAD*2,!0),l.fill(),l.globalCompositeOperation="source-in",l.drawImage(this.icon_src,.05*i,.05*i,.9*i,.9*i),t.drawImage(s,e/2-.5*i,i/2-.5*i,i,i)}catch(t){t}}else{switch(t.font=I+"pt SBGlyphs",t.textBaseline="middle",t.textAlign="center",this.icon){case"reddit":t.fillStyle="#246";break
                        //             }
                        //     `],

                        // ["t.prototype.updateImage=function(){if(null!=this.image)return this.image.src=this.canvas.toDataURL()},",
                        //     `t.prototype.updateImage=function(){if(null!=this.image)return this.image.src=this.canvas.toDataURL()},
                        //     t.prototype.updateVideo=function(){

                        //         if (this.icon_src instanceof HTMLVideoElement) {
                        //             this.texture = new THREE.VideoTexture(this.icon_src);
                        //             this.texture.needsUpdate = true;
                        //             this.texture.minFilter = THREE.LinearFilter;
                        //             this.texture.magFilter = THREE.LinearFilter;
                        //             this.texture.format = THREE.RGBAFormat;
                        //             this.material.map = this.texture;
                        //             this.material.needsUpdate = true;
                        //         }
                        //     },`],
                        //[`i.font="38pt SBGlyphs"`, `i.font='34pt SBGlyphs'`],

                        // [`this.element.addEventListener("mousemove",function(t){return function(e){return t.Il1II(e)}}(this))`,
                        //     `setInterval(() => {
                        //         t.Il1II(e)
                        //     }, 1000 / window.fmousemovePollingRate)
                        //     this.element.addEventListener("mousemove",function(t){return function(e){return t.Il1II(e)}}(this))'`],
                        // [`case 101:g=ut.getUint16(2,!0),It=ut.getFloat32(4,!0),`, `case 101:console.log("case 101");g=ut.getUint16(2,!0),It=ut.getFloat32(4,!0),`],
                        // [`case 110:if(It`, `case 110:console.log("case 110");if(It`],
                        // [`1OI=function(){function t(t){var e,i,s,l;for(this.lOlII=t,this.l1I10=new THREE.Group,this.scale=10,this.number=20,this.O0I1l=new l1llI(4e3),this.seed=-1,this.models=[],i=0;i<=19;i+=1)this.models.push(new I1l`,
                        //      `1OI=function(){function t(t){var e,i,s,l;for(this.lOlII=t,console.log(t),this.l1I10=new THREE.Group,this.scale=10,this.number=20,this.O0I1l=new l1llI(4e3),this.seed=-1,this.models=[],i=0;i<=19;i+=1)this.models.push(new I1l`],
                        //[`THREE.MeshLambertMaterial({color:16777215,vertexColors:THREE.VertexColors}),this`, `THREE.MeshLambertMaterial({color:0xFFFF00,vertexColors:THREE.VertexColors}),this`], // asteroid color
                        //[`e.r=.8*e.r+.2*i`, `e.r=1*e.r`],
                        // [`e.prototype.IlOIO=function(t){if(this.socket.send(t),this.status_sent_count++,(t&=20991)!==this.last_status_sent&&(this.last_status_sent=t,!this.use_status_ping))return this.use_status_ping=!0,this.ping_status=t,this.status_ping_time=Date.now()},`,
                        //     `e.prototype.IlOIO=function(t){
                        //     if (window._meteredConnection.active) {
                        //         window._meteredConnection.offload.push(() => {
                        //             console.log("offload performed");
                        //             this.socket.send(t),this.status_sent_count++,(t&=20991)!==this.last_status_sent&&(this.last_status_sent=t,!this.use_status_ping)
                        //         })
                        //         return this.use_status_ping=!0,this.ping_status=t,this.status_ping_time=Date.now()
                        //     }
                        //     if(this.socket.send(t),this.status_sent_count++,(t&=20991)!==this.last_status_sent&&(this.last_status_sent=t,!this.use_status_ping)) {
                        //         if (!window._meteredConnection.active) {
                        //             return this.use_status_ping=!0,this.ping_status=t,this.status_ping_time=Date.now()
                        //         }
                        //     }
                        //     },
                        // `
                        // ],
                        // [`e.prototype.IlOIO=function(t){if(this.socket.send(t),this.status_sent_count++,(t&=20991)!==this.last_status_sent&&(this.last_status_sent=t,!this.use_status_ping))`,
                        //     `e.prototype.IlOIO=function(t){
                        //     window._TSP += 1;
                        //     setTimeout(() => {window._TSP -= 1}, 1000);

                        //     console.log("Sent update status. Packets sent in the last second: " + window._TSP);

                        //     if(this.socket.send(t),this.status_sent_count++,(t&=20991)!==this.last_status_sent&&(this.last_status_sent=t,!this.use_status_ping))`],
                        // [`It,dt,ct;switch(ut=new DataView(e),r=ut.getUint8(0)`, `It,dt,ct;
                        //     let pfm = performance.now();
                        //     //console.log("Recieved data. Time since last reception: " + (pfm - window._LPT));
                        //     window._LPT = pfm;

                        //     window._TRD += 1;
                        //     setTimeout(() => {window._TRD -= 1}, 1000);

                        //     //console.log("Packets recieved in the last second: " + window._TRD);

                        //     switch(ut=new DataView(e),r=ut.getUint8(0)`], // remove later
                        [`,this.material.emissive.set(l0Il1.hsvToRgbHex(this.hue,.5,1))`, ``],
                        // [`createRadialGradient(0,0,0,0,0,1),i.addColorStop(0,"rgba(255,255,255,.2)"),i.addColorStop(1,"rgba(0,0,0,.2)"),e.fillStyle=i,e.fillRect(-1,-1,2,2),e.restore(),e.globalCompositeOperation="source-over",i=e.createRadialGradient(l/2-.25*s,s/2-.25*s,0,l/2,s/2,.45*s),i.addColorStop(0,"rgba(0,0,0,0)"),i.addColorStop(.5,"rgba(0,0,0,0)"),i.addColorStop(1,"rgba(0,0,0,.5)"),e.fillStyle=i,e.beginPath(),e.arc(l/2,s/2,.45*s,0,180*THREE.Math.DEG2RAD*2,!0),e.fill(),e.globalCompositeOperation="destination-over",e.translate(l/2,s/2),e.scale(l/2,s/2),i=e.createRadialGradient(0,0,0,0,0,1),i.addColorStop(.7,"rgba(0,0,0,1)"),i.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=i,e.fillRect(-1,-1,2,2),this.resize?(t=document.createElement("canvas"),t.width=this.size,t.height=this.size/2,t`,
                        //     `createRadialGradient(0,0,0,0,0,1),i.addColorStop(0,"rgba(255,255,255,.2)"),i.addColorStop(1,"rgba(0,0,0,.2)"),e.fillStyle=i,e.fillRect(-1,-1,2,2),e.restore(),e.globalCompositeOperation="source-over",i=e.createRadialGradient(l/2-.25*s,s/2-.25*s,0,l/2,s/2,.45*s),i.addColorStop(0,"rgba(0,0,0,0)"),i.addColorStop(.5,"rgba(0,0,0,0)"),i.addColorStop(1,"rgba(0,0,0,.5)"),e.fillStyle=i,e.beginPath(),e.arc(l/2,s/2,.45*s,0,180*THREE.Math.DEG2RAD*2,!0),e.fill(),e.globalCompositeOperation="destination-over",e.translate(l/2,s/2),e.scale(l/2,s/2),i=e.createRadialGradient(0,0,0,0,0,1),i.addColorStop(.7,false ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)"),i.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=i,e.fillRect(-1,-1,2,2),this.resize?(t=document.createElement("canvas"),t.width=this.size,t.height=this.size/2,t`],
                        //! MIGHT WANT TO DELETE THE THING ABOVE ################################################### removes shadow on ecps
                        [`,this.lOlII.mode.updateScore(ut),`, `,`], // remove packet-based scoreboard update and add 100ms polling updater below
                        [`case 201:for(this`,
                        `case 201:
                            window._scoreboardUpdater.latest = ut;
                            if (!window._scoreboardUpdater.timer) {
                                window._scoreboardUpdater.timer = setInterval(() => {
                                    this.lOlII.mode.updateScore(window._scoreboardUpdater.latest);
                                }, ${window._scoreboardUpdater.interval});
                            };
                            for(this`],

                        // [`t.prototype.lI0l1=function(){var t,e,i`,
                        //     `t.prototype.lI0l1=function(_step = 1){var t,e,i`],
                        // [`(),this.drawMaterial(e,l,s),t`,
                        //     `(),this.drawMaterial(e,l,s,_step),t`],
                        [`ha=1,null==r.custom||this.start||(O=lI100.III0O(r.custom.badge,r.custom.laser,r.custom.finish,48,r.custom.hue),e.drawImage(O,n,c+a*E,2*E,E)),e.`,
                            `ha=1,null==r.custom||this.start||(
                                (() => {
                                    if (r.custom.finish.startsWith("_vid_")) {
                                        if (!window._videoBadgeInfo.timerSet) {
                                            window._videoBadgeInfo.timerSet = setInterval(() => {
                                                this.l0I0I(e);
                                            }, 100);
                                        }
                                        let _step = 1;
                                        let m = window._videoBadgeInfo[r.custom.finish]?.steps;
                                        if (!m) return;
                                        if (window._videoBadgeInfo.players[r.id]) {
                                            let pot = window._videoBadgeInfo.players[r.id].step;
                                            _step = ((pot+1) > m) ? 1 : (pot + 1);
                                            window._videoBadgeInfo.players[r.id].step = _step;
                                        } else {
                                            window._videoBadgeInfo.players[r.id] = {};
                                            window._videoBadgeInfo.players[r.id].step = 1;
                                            window._videoBadgeInfo.players[r.id].timer = null;
                                        }

                                        O=lI100.III0O(r.custom.badge,r.custom.laser,r.custom.finish,48,r.custom.hue, _step);
                                        //console.log("THE STEP IS: " + _step);
                                        e.drawImage(O,n,c+a*E,2*E,E);

                                        //setTimeout(() => {this.l0I0I(e)}, 100);
                                        // if (!window._videoBadgeInfo.players[r.id].timer) {
                                        //     console.log("SETTING INTERVAL");
                                        //     window._videoBadgeInfo.players[r.id].timer = setInterval(() => {
                                        //         //O=lI100.III0O(r.custom.badge,r.custom.laser,r.custom.finish,48,r.custom.hue, 2);
                                        //         //e.clearRect(n,c+a*E,2*E,E);
                                        //         //e.drawImage(O,n,c+a*E,2*E,E);
                                        //         //this.l0I0I(e);
                                        //     }, 5)
                                        // }
                                    } else {
                                        O=lI100.III0O(r.custom.badge,r.custom.laser,r.custom.finish,48,r.custom.hue);
                                        e.drawImage(O,n,c+a*E,2*E,E);
                                    }
                                })()
                            ),e.`],
                        [`function t(t,e){this.size=null!=t?t:128,this.custom=null!=e?e:{},this.icon=this.custom.badge||"pirate",this.laser=this.custom.laser||"simple",this.finish=this.custom.finish||"gold",this.hue=this.custom.hue||0,this.lI0l1()`,
                            `function t(t,e){this.size=null!=t?t:128,this.custom=null!=e?e:{},this.icon=this.custom.badge||"pirate",this._tstep=this.custom.step,this.laser=this.custom.laser||"simple",this.finish=this.custom.finish||"gold",this.hue=this.custom.hue||0,this.lI0l1()`],
                        [`t.III0O=function(e,i,s,l,n){var a,o;return null==n&&(n=0),o=e+i+s+l+n,t.table[o]||(a=new t(l,{badge:e,laser:i,finish:s,hue:n}).toImage(),t.table[o]=a),t.table[o]},`,
                            `t.III0O=function(e,i,s,l,n,_step = 1,castShadow=true){var a,o;return null==n&&(n=0),o=e+i+s+l+n+_step,t.table[o]||(a=new t(l,{badge:e,laser:i,finish:s,hue:n,step:_step}).toImage(),t.table[o]=a),t.table[o]},`],
                        [`t.prototype.drawMaterial=function(t,e,i){var s,l,n,a,o,r,h,u,I,d;switch(this.finish){case"alloy":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#68A"),s.addColorStop(.5,"#FFF"),s.addColorStop(.5,"#765"),s.addColorStop(1,"#CCC");break;case"titanium":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#444"),s.addColorStop(.5,"#AAA"),s.addColorStop(.5,"#444"),s.addColorStop(1,"#111");break;case"gold":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(40,100%,50%)"),s.addColorStop(.5,"hsl(40,100%,80%)"),s.addColorStop(.5,"hsl(20,100%,30%)"),s.addColorStop(1,"hsl(40,100%,50%)");break;case"carbon":for(s=t.createLinearGradient(0,0,0,i),h=Math.min(10,this.size/10),n=a=0,u=h-1;a<=u;n=a+=1)s.addColorStop(n/h,"#000"),s.addColorStop((n+1)/h,"#888");for(l=t.createLinearGradient(0,0,0,i),l.addColorStop(0,"#333"),l.addColorStop(.1,"#888"),n=o=0,I=h-1;o<=I;n=o+=1)l.addColorStop((n+.5)/h,"#000"),l.addColorStop(Math.min(1,(n+1.5)/h),"#888");break;default:s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#EEE"),s.addColorStop(1,"#666")}if(t.globalCompositeOperation="source-atop",t.fillStyle=s,"carbon"===this.finish){for(n=r=0,d=4*h-1;r<=d;n=r+=1)t.fillStyle=n%2==0?s:l,t.fillRect(n*e/(4*h),0,e/(4*h),i);s=t.createLinearGradient(0,0,0,i),s.addColorStop(.3,"rgba(0,0,0,.5)"),s.addColorStop(.5,"rgba(0,0,0,0)"),s.addColorStop(.7,"rgba(0,0,0,.5)"),t.fillStyle=s,t.fillRect(0,0,e,i)}else t.fillStyle=s,t.fillRect(0,0,e,i);return t.globalCompositeOperation="source-over"}`,
                            `t.prototype.drawMaterial=function(t,e,i,_step = 1){
                            var s,l,n,a,o,r,h,u,I,d;
                            switch(this.finish) {
                                // rest of the switch statement must remain untouched for further changes
                                case"alloy":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#68A"),s.addColorStop(.5,"#FFF"),s.addColorStop(.5,"#765"),s.addColorStop(1,"#CCC");break;case"titanium":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#444"),s.addColorStop(.5,"#AAA"),s.addColorStop(.5,"#444"),s.addColorStop(1,"#111");break;case"gold":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(40,100%,50%)"),s.addColorStop(.5,"hsl(40,100%,80%)"),s.addColorStop(.5,"hsl(20,100%,30%)"),s.addColorStop(1,"hsl(40,100%,50%)");break;case"carbon":for(s=t.createLinearGradient(0,0,0,i),h=Math.min(10,this.size/10),n=a=0,u=h-1;a<=u;n=a+=1)s.addColorStop(n/h,"#000"),s.addColorStop((n+1)/h,"#888");for(l=t.createLinearGradient(0,0,0,i),l.addColorStop(0,"#333"),l.addColorStop(.1,"#888"),n=o=0,I=h-1;o<=I;n=o+=1)l.addColorStop((n+.5)/h,"#000"),l.addColorStop(Math.min(1,(n+1.5)/h),"#888");break;
                                default:
                                    if (this.finish?.startsWith("_vid_")) {
                                        let realstep = this._tstep ? this._tstep : "thumbnail";
                                        switch (this.finish) {
                                            case "_video_marker":break;

                                                // setTimeout(() => {
                                                //     let m = window._videoBadgeInfo["_vid_halo"].steps;
                                                //     let next = _step === m ? 1 : (_step + 1);
                                                //     if (this.drawMaterial) {
                                                //         this.lI0l1(next);
                                                //         // s=t.createLinearGradient(0,0,0,i),
                                                //         // s.addColorStop(0,"blue"),
                                                //         // s.addColorStop(0.5, "black"),
                                                //         // s.addColorStop(0.5, "yellow");
                                                //         // t.save();
                                                //     } else {console.warn("No this.drawMaterial")}
                                                //     //console.log(this.custom);
                                                // }, 1000);
                                                break;
                                        }
                                    } else {
                                        s=t.createLinearGradient(0,0,0,i),
                                        s.addColorStop(0,"#EEE"),
                                        s.addColorStop(1,"#666")
                                    }
                            }
                            if(t.globalCompositeOperation="source-atop",t.fillStyle=s,"carbon"===this.finish){for(n=r=0,d=4*h-1;r<=d;n=r+=1)t.fillStyle=n%2==0?s:l,t.fillRect(n*e/(4*h),0,e/(4*h),i);s=t.createLinearGradient(0,0,0,i),s.addColorStop(.3,"rgba(0,0,0,.5)"),s.addColorStop(.5,"rgba(0,0,0,0)"),s.addColorStop(.7,"rgba(0,0,0,.5)"),t.fillStyle=s,t.fillRect(0,0,e,i)}else t.fillStyle=s,t.fillRect(0,0,e,i);return t.globalCompositeOperation="source-over"}`],


                        [`s.lOlII.display.height,this.IIOII=new THREE.PerspectiveCamera(45,this.width/this.height,1,1e3),this.IIOII.position.z=70,this.welcome))re`,
                            `s.lOlII.display.height,this.IIOII=new THREE.PerspectiveCamera(45,this.width/this.height,1,1e3),window.t_camera = this.IIOII,this.IIOII.position.z=70,this.welcome))re`],
                        //[`10526880`, `0x00FF00`], // deep space color
                        [",m,f,g,y,v;for(g=null!=this", `,m,f,g,y,v;(() => {
                            window._ships = this.ships;
                            //console.log(this.OOIIO);
                            let laserSpeed = 1;
                            if (this?.OOIIO?.instance?.lasers) {
                                laserSpeed = this?.OOIIO?.instance?.lasers[0]?.speed; // will take first laser only
                            } else {
                                console.warn("no laser speed");
                            }
                            window._player.data = this.OOIIO;
                            window._positions.camera = this.IIOII;
                            window._positions.player = {x: this.OOIIO.status.x, y: this.OOIIO.status.y};
function willHitTarget(obj1, obj2, mapWidth, mapHeight, projectileSpeed, pingMs, errorMargin = 0.1) {
    // Extract object properties
    const { x: x1, y: y1, r: r1, vx: vx1, vy: vy1 } = obj1;
    const { x: x2, y: y2, vx: vx2, vy: vy2 } = obj2;

    // Convert ping time (ms) to seconds
    const pingSec = pingMs / 1000;

    // Compute projectile velocity components
    const vpx = projectileSpeed * Math.cos(r1);
    const vpy = projectileSpeed * Math.sin(r1);

    // Compute relative velocity (target's motion relative to shooter)
    const vrelX = vx2 - vx1;
    const vrelY = vy2 - vy1;

    // Adjust target position for the ping delay
    const x2_adj = (x2 + vrelX * pingSec + mapWidth) % mapWidth;
    const y2_adj = (y2 + vrelY * pingSec + mapHeight) % mapHeight;

    // Compute toroidal shortest distances
    const dx = Math.min(Math.abs(x2_adj - x1), mapWidth - Math.abs(x2_adj - x1));
    const dy = Math.min(Math.abs(y2_adj - y1), mapHeight - Math.abs(y2_adj - y1));

    // Compute time to impact in both x and y directions
    const tX = dx / (vpx - vrelX);
    const tY = dy / (vpy - vrelY);

    // Check if a valid common time exists with a larger error margin
    if (tX > 0 && tY > 0 && Math.abs(tX - tY) < errorMargin) {
        return { hit: true, time: tX + pingSec };
    }
    return { hit: false, time: null };
}

// Example usage
const obj1 = { x: 2, y: 3, r: Math.PI / 4, vx: 0, vy: 0 }; // Shooter
const obj2 = { x: 8, y: 9, vx: 1, vy: -1 }; // Target
if (window._tr_conn) {
    for (let i = 0, accessKey = null, len = this.ships.length; i < len; i++) {
        break;
        let ship = this.ships[i]
        if (!accessKey) {
            let keys = Object.keys(ship);
            for (let key of keys) {
                if ((typeof ship[key] === "object") && ship[key]["status"]) {
                    accessKey = key;
                    break;
                }
            }
        }
        let target = ship[accessKey]["status"];
        const result = willHitTarget({...this.OOIIO.status, vx: 0, vy: 0}, {...target, vx: 0, vy: 0}, 800, 800, laserSpeed, 70); // 200ms ping
        if (result.hit) {
            let rand = (Math.random() * 10) >> 0;
            console.log(rand + " WILL HIT A TARGET WITH TIME " + result.hit.time);
        }
    }
}


                            let me = this.IIOII;
                            window.gameCamera = me;
                            window.gameScene = this.l1I10;
                            if (!window.gggg) {
                                window.gggg = true;
                                window.initializeRefThree(THREE);

                                window.ecpRenderer = lI100.III0O.bind(lI100);
                                // generates an ecp image
                                // let h = lI100.III0O("sera","2","ashen",48,0);
                                // document.querySelector("body").appendChild(h);
                                // console.log(h);
                            }
                            if (window.deathScene?.follow) {
                                let target = {x: 0, y: 0};
                                outer: for (let ship of this.ships) {
                                    //console.log(ship); // LPT - REMOVAL
                                    let keys = Object.keys(ship);
                                    for (let key of keys) {
                                        if (typeof ship[key] !== "object") continue;
                                        let shipid = ship[key]["shipid"];
                                        if (shipid === window.deathScene.id) {
                                            for (let key of keys) {
                                                if ((typeof ship[key] === "object") && ship[key]["status"]) {
                                                    target = ship[key]["status"];
                                                    break;
                                                }
                                            }
                                            me.x = target.x;
                                            me.y = target.y;
                                            break outer;
                                        }
                                    }
                                }
                            }
                            //return;
                            // temporary
                            //let them = this.ships[0]?.lI00I?.status;
                            //console.log(this.lasers);
                            //console.log(window.centered_camera);
                            if (window._envMaps.requiresUpdate) {
                                window._envMaps.requiresUpdate = false;
                                let _envmapsmarker;
                            }
                            if (window.centered_camera) {
                                me.II0I0 = 0;
                                me.l0l11 = 0;
                                me.x = this.OOIIO.status.x;
                                me.y = this.OOIIO.status.y;
                            }
                            if (!window.render_indicator) { //
                                if (window._lastLine) {
                                    //console.log(me);
                                    this.l1I10.remove(window._lastLine);
                                    window._lastLine.geometry.dispose();
                                    window._lastLine.material.dispose();
                                    window._lastLine = null;
                                }
                            };
                            let now = performance.now();
                            if (now > window._angleTimestamp) {
                                window._angleTimestamp = now + window._angleRefreshTime;
                            } else return;
                            if (window.t_camera && window._3dmode) {
                                if (!window.gggg) {
                                    window.gggg = true;
                                    window.cor = 270;
                                }
                                if (!window.ashg) {
                                    //window.ashg = true;
                                    window.t_camera.rotation.x = 90 * (Math.PI / 180);
                                    window.t_camera.position.z = 15;
                                    window.t_camera.rotation.z = 0;
                                    //console.log(this.OOIIO.status.r)
                                }
                                let corrected = this.OOIIO.status.r;
                                corrected *= (180 / Math.PI);
                                corrected += window.cor;
                                corrected *= (Math.PI / 180);
                                window.t_camera.rotation.y = corrected;
                                window.offsetnumX = Math.cos(this.OOIIO.status.r) * window.offsetcoord;
                                window.offsetnumY = Math.sin(this.OOIIO.status.r) * window.offsetcoord;
                                me.II0I0 = 0;
                                me.l0l11 = 0;
                                // me.x = this.OOIIO.status.x ;
                                // me.y = this.OOIIO.status.y -
                                // window.t_camera.rotation.y = .6;
                                // window.t_camera.rotation.x += .012;
                                // console.log(window.t_camera.rotation.y);
                            }
                            try {
                                if (window.laser_lights && now > window.pointLightSettings.updateTimestamp) {
                                    const settings = window.pointLightSettings;
                                    settings.updateTimestamp = now + settings.updateTime;

                                    const calculateNewPosition = (x, y, angle, speed) => ({
                                        x: x + Math.cos(angle) * speed,
                                        y: y + Math.sin(angle) * speed,
                                    });

                                    const hslToRgb = (h, s, l) => {
                                        const a = s * Math.min(l, 1 - l);
                                        const f = n => {
                                            const k = (n + h * 12) % 12;
                                            return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
                                        };
                                        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
                                    };

                                    const hueToHex = h => {
                                        const [r, g, b] = hslToRgb(h / 360, 1, 0.5);
                                        return (r << 16) + (g << 8) + b;
                                    };

                                    for (const key in window.pointLights) {
                                        window.pointLights[key]._keepAlive = false;
                                    }

                                    for (const laser of this.lasers) {
                                        const light = window.pointLights[laser.id];
                                        const speedFactor = laser.speed / settings.updateRate;

                                        if (light) {

                                            const newPos = calculateNewPosition(light.position.x, light.position.y, laser.angle, speedFactor);
                                            light.position.set(newPos.x, newPos.y, light.position.z); // Z remains constant
                                            light._keepAlive = true;
                                        } else {

                                            const intensity = Math.min(
                                                Math.min(laser.damage / settings.maxDamageIntensityMult, settings.maxIntensity) * settings.maxIntensity,
                                                settings.maxIntensity
                                            );

                                            if (intensity < settings.intensityEpsilon) continue; // Skip weak lights

                                            const color = hueToHex(laser.hue);
                                            const pointLight = new THREE.PointLight(color, intensity, settings.distance);

                                            pointLight.castShadow = false;
                                            pointLight.position.set(laser.x, laser.y, laser.z);

                                            window.pointLights[laser.id] = pointLight;
                                            pointLight._keepAlive = true;

                                            this.l1I10.add(pointLight);
                                        }
                                    }


                                    for (const key in window.pointLights) {
                                        if (!window.pointLights[key]._keepAlive) {
                                            this.l1I10.remove(window.pointLights[key]);
                                            delete window.pointLights[key];
                                        }
                                    }
                                } else if (window.pointLightSettings.requiresShutdown) {

                                    window.pointLightSettings.requiresShutdown = false;
                                    for (const key in window.pointLights) {
                                        this.l1I10.remove(window.pointLights[key]);
                                        delete window.pointLights[key];
                                    }
                                }

                                if (!window.render_indicator) return;

                                const offset = 40;
                                const oppositeAngle = angle => (angle + Math.PI) % (2 * Math.PI);

                                function getNewPosition(x, y, r) {
                                    const offsetX = offset * Math.cos(r);
                                    const offsetY = offset * Math.sin(r);

                                    const newX = x + offsetX;
                                    const newY = y + offsetY;

                                    return { x: newX, y: newY };
                                }

                                if (window._lastLine) {
                                    //console.log(me);
                                    this.l1I10.remove(window._lastLine);
                                    window._lastLine.geometry.dispose();
                                    window._lastLine.material.dispose();
                                }

                                // if (!window._testRender) {

                                //     window._testRender = setTimeout(() => {
                                //         //console.log("test render");
                                //         const testMaterial = new THREE.MeshBasicMaterial({ envMap: window._QMAT });
                                //         const testMesh = new THREE.SphereGeometry(1, 32, 32);
                                //         const mesh = new THREE.Mesh(testMesh, testMaterial);
                                //         this.l1I10.add(mesh);
                                //         mesh.position.set(this.OOIIO.status.x, this.OOIIO.status.y, 0);
                                //         window._testRender = null;
                                //     }, 1000)
                                // }
                                //let maxDist = 70;


                                const numOfTicks = 60;

                                let realX = this.OOIIO.status.x;
                                let realY = this.OOIIO.status.y;


                                let oppPos = getNewPosition(realX, realY, oppositeAngle(this.OOIIO.status.r));
                                let endPos = getNewPosition(realX, realY, this.OOIIO.status.r);


                                const pointY = new THREE.Vector3(endPos.x, endPos.y, 0);
                                const pointO = new THREE.Vector3(oppPos.x, oppPos.y, 0);

                                const vertices = new Float32Array([
                                    pointO.x, pointO.y, pointO.z,
                                    pointY.x, pointY.y, pointY.z
                                ]);


                                const geometry = new THREE.BufferGeometry();
                                geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 3 items per vertex (x, y, z)
                                //const geometryO = new THREE.BufferGeometry();
                                //geometryO.addAttribute('position', new THREE.BufferAttribute(verticesO, 3)); // 3 items per vertex (x, y, z)

                                let material;

                                if (window._lastMaterial) {
                                    material = window._lastMaterial;
                                } else {
                                    material = new THREE.LineBasicMaterial({ color: 0xffffff });
                                }

                                const line = new THREE.Line(geometry, material);

                                this.l1I10.add(line);
                                window._lastLine = line;
                            } catch (ex) {
                                console.log(ex);
                            }


                        })();for(g=null!=this`],
                        // [`,this.IIOII.position.x=this.l1IlO.IIOII.x,this.IIOII.position.y=this.l1IlO.IIOII.y,`,
                        //     `,`], // reset camera position behind for 3dblast xD

                        // ************* PROBABLY USELESS CHUNKS OF CODE, SINCE THIS IS SOMEHOW NOT THE MAIN WAY THE GAME GETS MOUSE INFO
                        // [`s)),this.element.addEventListener("mousemove",function(t){return function(e){return t.Il1II(e)}}(this)),documen`,
                        //     `this.element.addEventListener("mousemove",function(t){
                        //            window.deleteThis += 1;
                                    //setTimeout(() => {window.deleteThis -= 1}, 1000);
                                    //console.log(deleteThis);
                        //          return function(e){return t.Il1II(e)}}(this)),documen`], //LAPF
                        // [`s)),this.element.addEventListener("mousemove",function(t){return function(e){return t.Il1II(e)}}(this)),documen`,
                        //     `s)),(() => {try{
                        //         this.element.addEventListener("pointerrawupdate",function(t){
                        //             return function(e){return t.Il1II(e)}}(this))
                        //     } catch(ex) {console.log("TRIGGER: Failed to load pointerrawupdate"); console.warn(ex)}})(),documen`],
                        // ************************************************************************************************************

                        // [`t.prototype.mouseMove=function(t,e,i){if(!(Date.now()<this.last_keyboard_action+1e3||Date.now()<this.last_gamepad_action+1e3||(this.lOlII.display.screen.l1lOl.cursor.set(t,e),null!=this.navigation_listener&&this.navigation_listener.block_ship_control))){for(t-=this.lOlII.display.width/2,e-=this.lOlII.display.height/2,this.angle=-Math.atan2(e,t),this.angle=Math.round(this.angle/(180*THREE.Math.DEG2RAD)*180);this.angle<0;)this.angle+=360;return this.angle!==this.ship.OlI0l.angle&&(this.lOlII.using_keyboard*=.9,this.ship.OlI0l.angle=this.angle,this.ship.IlOIO()),!0}},`,
                        //     `t.prototype.mouseMove=function(t,e,i){if(!(Date.now()<this.last_keyboard_action+1e3||Date.now()<this.last_gamepad_action+1e3||(this.lOlII.display.screen.l1lOl.cursor.set(t,e),null!=this.navigation_listener&&this.navigation_listener.block_ship_control))){for(t-=this.lOlII.display.width/2,e-=this.lOlII.display.height/2,this.angle=-Math.atan2(e,t),(() => {
                        //             window.deleteThis += 1;
                        //             setTimeout(() => {window.deleteThis -= 1}, 1000);
                        //             console.log(window.deleteThis);
                        //         })(),this.angle=Math.round(this.angle/(180*THREE.Math.DEG2RAD)*180);this.angle<0;)this.angle+=360;return this.angle!==this.ship.OlI0l.angle&&(this.lOlII.using_keyboard*=.9,this.ship.OlI0l.angle=this.angle,this.ship.IlOIO()),!0}},`],
                        [`,{text:"Wait",icon:"H",key:"T"},`, `
                            ,
                            {text:"Wait",icon:"H",key:"T"}
                            ,
                            {text:"Nerd",icon:"🤓",key:"L"}
                            ,
                            {text:"Discord",icon:"🌐",key:"J"}
                            ,
                            {text:"Retreat",icon:"🡸",key:"W"}
                            ,
                            {text:"Help",icon:"🆘",key:"H"}
                            ,
                            {text:"KILL YOURSELF",icon:"👨🏿",key:"I"},`
                        ],
                        // [`[[[1.4,-.6],[1.1,-.6],[1.1,.6],[1.4,.6]],[[.55,-.6],[.25,-.6],[.25,.6],[.55,.6]],[[-.55,-.6],[-.25,-.6],[-.25,.6],[-.55,.6]],[[-1.4,-.6],[-1.1,-.6],[-1.1,.6],[-1.4,.6]]]`,
                        //     `[[[0, 1], [0.5, 0.5], [0.2, 0.5], [0.2, -0.5], [0.5, -0.5],[0, -1], [-0.5, -0.5], [-0.2, -0.5], [-0.2, 0.5], [-0.5, 0.5], [0, 1]]]`],
                        //[`this.IIOII.zoom=.995*this.IIOII.zoom+.005*a`, `this.IIOII.zoom=2.35`], //zom
                        // [`case"gold":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(40,100%,50%)"),s.addColorStop(.5,"hsl(40,100%,80%)"),s.addColorStop(.5,"hsl(20,100%,30%)"),s.addColorStop(1,"hsl(40,100%,50%)");break;`,
                        //     `case"x27":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(180,100%,50%)"),s.addColorStop(.5,"hsl(180,100%,80%)"),s.addColorStop(.5,"hsl(190,100%,30%)"),s.addColorStop(1,"hsl(180,100%,50%)");break;case"fullcolor":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(0,100%,50%)"),s.addColorStop(.5,"hsl(0,100%,80%)"),s.addColorStop(.5,"hsl(10,100%,30%)"),s.addColorStop(1,"hsl(0,100%,50%)");break;case"gold":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(40,100%,50%)"),s.addColorStop(.5,"hsl(40,100%,80%)"),s.addColorStop(.5,"hsl(20,100%,30%)"),s.addColorStop(1,"hsl(40,100%,50%)");break;`],
                        // [`alloy:"Alloy",`, `alloy:"Alloy",x27:"X-27",fullcolor:"Fullcolor",`],
                        // [`case"titanium":this.buildTitaniumMaterial();break;case"carbon":this.buildCarbonMaterial();break;default:this.buildDefaultMaterial()`,
                        //     `case"titanium":
                        //         this.buildTitaniumMaterial();
                        //         break;
                        //     case"fullcolor":
                        //         this.buildFullColorMaterial();
                        //         break;
                        //     case"x27":
                        //         this.buildX27Material();
                        //         break;
                        //     case"carbon":this.buildCarbonMaterial();break;default:this.buildDefaultMaterial()`],

                        // ! IMPORTANT FOR 3D MODE
                        ["this.number=20","this.number=20"],

                        // stars glow
                        ["t.prototype.drawStarGlow=function(t){var e;retu",
                            "t.prototype.drawStarGlow=function(t){return;var e;retu"],
                        ["t.prototype.drawStarBody=function(t,e){var i;",
                            "t.prototype.drawStarBody=function(t,e){var i;"],
                        ["StarLine=function(t){var e;ret",
                            "StarLine=function(t){return;var e;ret"],

                        // controls stars sparsity, the higher the denser
                        ["or(this.size=null!=t?t:500,th",
                            "or(this.size=500,th"],

                        // stars size
                        [",this.amplitude[l]=.2*Math.pow(Math.random(),1)",
                            ",this.amplitude[l]=.2*Math.pow(Math.random(),1)"],

                        // enables rendering 15 players on teamboard
                        ["a>=10","a>=15"],


                        // Gives trigger users stroke on name teamBoard
                        [",e.fillText(r.player_name.toUpperCase(),D,c+(a+.5)*E),",
                            `,(() => {
                                let profile = window.getProfile(p);
                                //console.log(profile)
                                if (profile?.isTriggerUser) {
                                      //console.log("gave stroke")
                                      e.font=K+"pt "+profile.font;
                                    e.lineWidth = 3;
                                    e.globalAlpha = 1;
                                    e.strokeStyle = "#000000FF";
                                    //e.fillStyle = "#000";
                                    e.strokeText(r.player_name.toUpperCase(),D,c+(a+.5)*E);
                                    e.lineWidth = 0;

                                    let gradient;
                                    //console.log(e.measureText(r.player_name.toUpperCase()))
                                    switch(profile.textFillType) {
                                        case "1":
                                            gradient = e.createLinearGradient(D, 0, D + e.measureText(r.player_name.toUpperCase()).width, 0);
                                            break;
                                        case "2":
                                            gradient = e.createLinearGradient(0, c+(a+.5)*E, 0, 6 + (c+(a+.5)*E));
                                            break;
                                        default:
                                            gradient = e.createLinearGradient(0, 0, 0, 0);
                                            break;
                                    }

                                    gradient.addColorStop(0, profile.textFillColor1);
                                    gradient.addColorStop(1, profile.textFillColor2);

                                    e.fillStyle = profile.textFillType == "0" ? (profile.textFillColor1 === "inherit" ? this.color : profile.textFillColor1) : gradient;
                                }
                            })(),e.fillText(r.player_name.toUpperCase(),D,c+(a+.5)*E),e.fillStyle = this.color,e.font=K+"pt Play",e.lineWidth = 0,e.globalAlpha = 0.75,`],

                        // currently only changes numer of players
                        ["this.TeamBoard=function(e){function i(t,e,s){this.team=t,this.mode=e,this.lOlII=s,i.O101I.constructor.call(this,{pressed:function(t){return function(){return t.teamSelected(),!0}}(this)}),this.start=!0,this.displayed=!0,this.enabled=this.start&&this.team.open,this.force_ratio=this.start?.5:.6,this.blending=THREE.AdditiveBlending,this.num_players=10,this.warning_count=0,this.warning_blink=!1"
                            ,"this.TeamBoard=function(e){function i(t,e,s){this.team=t,this.mode=e,this.lOlII=s,i.O101I.constructor.call(this,{pressed:function(t){return function(){return t.teamSelected(),!0}}(this)}),this.start=!0,this.displayed=!0,this.enabled=this.start&&this.team.open,this.force_ratio=this.start?.5:.6,this.blending=THREE.AdditiveBlending,this.num_players=15,this.warning_count=0,this.warning_blink=!1"],


                        // hopefully displays image in teamboard
                            [
                                `,p===this.lOlII.OlII0.OOIIO.status.id?e.fillStyle="rgba(255,255,255,.1)":e.fillStyle="#000",e.fillRect(n,c+a*E+n,this.I1111-2*n,E-2*n)`,
                                `,(() => {
                                    let profile = window.getProfile(p);
                                    if (profile?.isTriggerUser && profile.pfp.valid) {
                                        e.save();
                                        //const pattern = e.createPattern(profile.pfp.image, "repeat");
                                        let img = profile.pfp.image;

                                        // Draw the image covering the entire canvas
                                        e.globalAlpha = .7;
                                        const imageWidth = this.I1111 - 2 * n;  // The width you already have
                                        const imageHeight = imageWidth * (2 / 7);  // Height calculated based on the aspect ratio
                                        e.beginPath();
                                        e.rect(n, c + a * E + n, this.I1111 - 2 * n, E - 2 * n);
                                        e.clip();  // Apply the clipping region
                                        let offset = (imageHeight - (E - 2 * n)) / 2;
                                        e.drawImage(profile.pfp.image,n,c+a*E+n-(offset),imageWidth,imageHeight);
                                        e.globalAlpha = 0.75;
                                        e.restore();

                                        e.fillStyle = p===this.lOlII.OlII0.OOIIO.status.id ? "rgba(255,255,255,.05)" : "#00000020";
                                    } else {
                                        e.fillStyle = p===this.lOlII.OlII0.OOIIO.status.id ? "rgba(255,255,255,.05)" : "#000";
                                    }
                                })(),e.fillRect(n,c+a*E+n,this.I1111-2*n,E-2*n)`
                            ],
                        // display ecp on team selection
                            [
                                "||this.start||",
                                "||"
                            ],
                        // make team selection taller
                            [
                                "this.mode.teamboards.push(l),this.add(l,[.5-h/2*I+a*I+.01,.2,I-.02,.7]),",
                                "this.mode.teamboards.push(l),this.add(l,[.5-h/2*I+a*I+.01,.11,I-.02,.8]),"
                            ],

                        // HUD REDUCTION
                            [
                                `,e.num_players=8,`,
                                ",e.num_players=11,"
                            ],

                        // Move player down 2 spaces because num_players is 11 now
                            [
                                `7===a`,
                                "10===a"
                            ],

                        // Expand TeamBoard
                            [
                                `t.lOlII.display.screen.l1lOl.add(e,[.8,0,.2,.52]),e.num_player`,
                                "t.lOlII.display.screen.l1lOl.add(e,[.8,0,.2,.58]),e.num_player"
                            ],

                        // Remove useless Navbar for radar
                            [
                                `tion(t,e){var i,s,l,n,a,o,r,h,u,I,d,c,p;for`,
                                `tion(t,e){var i,s,l,n,a,o,r,h,u,I,d,c,p;return;for`
                            ],

                        // Generate another variable for ECP counting right below
                            [
                                `i.prototype.l0I0I=function(e){var i,s,l,n,a,o,r,h,u,I,d,c,p,O,m,f,g,y,v,b,w,x,k,E,_,`,
                                `i.prototype.l0I0I=function(e){var i,s,l,n,a,o,r,h,u,I,d,c,p,O,m,f,g,y,v,b,w,x,k,E,_,ecps,current,`
                            ],
                        // Render ECP count on TeamBoard
                            [
                                `U=O0I00.getShipIcon(101),q=0,null!=U&&null!=this.scoredata){for(C=this.scoredata.getUint8(1),g=2,y=0,j=C-1;y<=j;y+=1)p=this.scoredata.getUint8(g),r=this.lOlII.names.getData(p),g+=8,null!=r&&r.friendly===this.team.id&&q++;e.globalAlpha=.75,e.drawImage(U,this.I1111-E+n,.25*this.I1111-E/2+n,E-2*n,E-2*n),e.fillStyle="#FFF",e.textAlign="right",e.fillText(q,this.I1111-E+n,.25*this.I1111),e.globalAlpha=1}if(this.start&&(c-=2*E,e.font=2*K+"pt FontAwesome",e.textAlign="center",this.team.open?(e.fillStyle=this.color,e.fillRect(0,this.I10lI-2*E,this.I1111,2*E),e.fillStyle="#000",`,
                                `U=O0I00.getShipIcon(101),q=0,ecps=0,current=null,null!=U&&null!=this.scoredata){for(C=this.scoredata.getUint8(1),g=2,y=0,j=C-1;y<=j;y+=1)p=this.scoredata.getUint8(g),r=this.lOlII.names.getData(p),(() => {if (null!=r&&r.friendly===this.team.id&&!(r.custom == null)) {ecps++;}})(),g+=8,null!=r&&r.friendly===this.team.id&&q++;e.globalAlpha=.75,e.drawImage(U,this.I1111-E+n,.25*this.I1111-E/2+n,E-2*n,E-2*n),e.fillStyle="#FFF",e.textAlign="right",e.fillText(q,this.I1111-E+n,.25*this.I1111),(() => { if (window.display_ecp_count) {e.fillText(ecps + " ✪ ",this.I1111+n,.32*this.I1111)} })(),e.globalAlpha=1}if(this.start&&(c-=2*E,e.font=2*K+"pt FontAwesome",e.textAlign="center",this.team.open?(e.fillStyle=this.color,e.fillRect(0,this.I10lI-2*E,this.I1111,2*E),e.fillStyle="#000",`
                            ],

                        // TURNS ASTEROIDS INTO CRYSTAL
                        // [",this.lOO10=new THREE.MeshLambertMaterial({color:16777215,vertexColors:THREE.VertexColors}),",
                        //     `,(() => {
                        //                                                         const loader = new THREE.CubeTextureLoader();
                        //     loader.setCrossOrigin('anonymous');

                        //     const URL = "https://i.ibb.co/QMKPt5j/wavesbaw.png";

                        //     const urls = [
                        //         URL,
                        //         URL,
                        //         URL,
                        //         URL,
                        //         URL,
                        //         URL,
                        //     ];

                        //     const envMap = loader.load(urls);
                        //     envMap.mapping = THREE.CubeReflectionMapping;

                        //     window._envMaps["crys"] = envMap;
                        //     return this.lOO10=new THREE.MeshPhongMaterial(
                        //         {
                        //             //map:llIl1,
                        //             //bumpMap:llIl1,
                        //             //specular:0x999999,
                        //             shininess:0,
                        //             bumpScale:1,
                        //             color: 0x999999,
                        //             emissive:0x999999,
                        //             envMap: window._envMaps["crys"],
                        //             metalness: 1,
                        //             roughness: 0.1,
                        //             flatShading: false,
                        //             //emissiveMap:l0I1I,
                        //         }
                        //     )
                        //         //=new THREE.MeshLambertMaterial({color:16711680,vertexColors:THREE.VertexColors, flatShading: false})

                        //     })(),`],

                        [`e.addColorStop(0,"rgba(47,89,158,1)"),e.addColorStop(.75,"rgba(47,89,158,0)"),`,
                            `e.addColorStop(0,"rgb(107, 107, 107)"),e.addColorStop(.75,"rgba(62, 62, 62, 0)"),`
                        ],

                        ['this.ping+" ms"',`(() => {
                            window._player.ping = this.ping;
                            return ("" + this.ping+" ms")
                        })()`], // ! IMPORTANT FOR 3D MODE
                        [
                            `)},e.prototype.I0010=function(t){return this.lOlII.names.set(t.data.id,t.data.player_name,t.data)},e.prototype.pushType=function(t){return`,
                            `)},e.prototype.I0010=function(t){
                                // console.log("ON PLAYER NAME");
                                // console.log(t);
                                let processed = window.processProfile(t);
                                //console.log(processed);
                                t = processed;
                                //console.log(t);
                                return this.lOlII.names.set(t.data.id,t.data.player_name,t.data)},e.prototype.pushType=function(t){return`
                        ],
                        [
                            `if(t.socket.send(JSON.stringify({name:Il10I.O0l1l,data:{mode:t.lOlII.mode_id,mod_id:t.lOlII.mode.mod_id,spectate:t.lOlII.mode.spectate,spectate_ship:t.lOlII.mode.spectate_ship,player_name:(new II101).ll000(t.lOlII.player_name),hue:t.hue,preferred:null!=t.lOlII.preferred&&t.lOlII.preferred,bonus:i,ecp_key:n,steamid:o,ecp_custom:t.lOlII.Ol1OI.custom,create:l,client_ship_id:t.lOlII.getClientShipID(),client_tr:t.lOlII.IIll0()}})),t.lOlI`
                            ,
                            `let ch = {...t.lOlII.Ol1OI.custom};
                            let personal = "${Profile.buildPersonal()}";
                            ch["${Profile.__data_key}"] = ch["${Profile.__data_key}"] + personal;
                            //console.log(ch);
                            if(t.socket.send(JSON.stringify({name:Il10I.O0l1l,data:{mode:t.lOlII.mode_id,mod_id:t.lOlII.mode.mod_id,spectate:t.lOlII.mode.spectate,spectate_ship:t.lOlII.mode.spectate_ship,player_name:(new II101).ll000(t.lOlII.player_name),hue:t.hue,preferred:null!=t.lOlII.preferred&&t.lOlII.preferred,bonus:i,ecp_key:n,steamid:o,ecp_custom:ch,create:l,client_ship_id:t.lOlII.getClientShipID(),client_tr:t.lOlII.IIll0()}})),t.lOlI`
                        ],
                        // [
                        //     `DEFENCE_POD_MODEL={name:"Defence Pod",level:1,model:1,size:1.05,specs:{shield:{capacity:[75,100],reload:[2,3]},generator:{capacity:[40,60],reload:[10,15]},ship:{mass:60,speed:[125,145],rotation:[110,130],acceleration:[100,120]}},bodies:{main:{section_segments:[35,55,125,145,215,235,305,325,395],offset:{x:0,y:0,z:0},position:{x:[0,0,0,0,0],y:[0,25,50,40],z:[0,0,0,0,0]},width:[50,50,20,0],height:[15,10,10,0],propeller:!1,texture:[3,3,17]},cannon:{section_segments:6,offset:{x:40,y:0,z:0},position:{x:[0,0,0,0,0,0,0],y:[-25,-20,0,0,20,30,35],z:[0,0,0,0,0,0,0,0,0]},width:[0,10,15,10,7,6,0],height:[0,10,15,18,15,10,0],propeller:!1,texture:[4,63,1,1,1,4]}},wings:{I0111:{length:[60,20],width:[40,35,25],angle:[0,0,0],position:[0,10,20],doubleside:!0,offset:{x:0,y:0,z:0},bump:{position:0,size:80},texture:[1,63]}}}`,
                        //     `{"name":"Defence Pod","level":1,"model":1,"size":1.05,"specs":{"shield":{"capacity":[75,100],"reload":[2,3]},"generator":{"capacity":[1e-30,1e-30],"reload":[2,3]},"ship":{"mass":1e-30,"speed":[1e-30,1e-30],"rotation":[1e-30,1e-30],"acceleration":[1e+30,1e+30]}},"bodies":{"10":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-50,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":0},"11":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.33004980553223,-54.33004980553223,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":60},"12":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.33028143331113,-54.33028143331113,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":120},"13":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50.0004632679483,-50.0004632679483,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":180},"14":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.32981814058119,-54.32981814058119,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":240},"15":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.33051302391593,-54.33051302391593,-10],"z":[-5,-5,0,0,0,0,0,0,0]},"width":[0,5,8],"height":[0,2,5],"texture":4,"angle":300},"20":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-35,-35,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":0},"21":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-39.33004980553223,-39.33004980553223,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":60},"22":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-39.33028143331113,-39.33028143331113,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":120},"23":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-35.0004632679483,-35.0004632679483,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":180},"24":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-39.32981814058119,-39.32981814058119,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":240},"25":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-39.33051302391593,-39.33051302391593,-10],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[0,4,6],"height":[0,2,5],"texture":[17],"angle":300},"30":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":30},"31":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":90},"32":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":150},"33":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":210},"34":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":270},"35":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-32,-30,-10,0],"z":[-3,-3,0,0,0,0,0,0,0]},"width":[5,8,10,0],"height":[0,4,13,0],"texture":[1,9.93,11],"angle":330},"400":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":0},"401":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27,-26,-21,-20],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":0},"402":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-35,-34,-29,-28],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":0},"403":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-43,-42,-37,-36],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":0},"404":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-51,-50,-45,-44],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":0},"405":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-59,-58,-53,-52],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":0},"410":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":60},"411":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27.866009961106442,-26.866009961106442,-21.866009961106442,-20.866009961106442],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":60},"412":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-36.732019922212885,-35.732019922212885,-30.732019922212885,-29.732019922212885],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":60},"413":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45.598029883319334,-44.598029883319334,-39.598029883319334,-38.598029883319334],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":60},"414":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.46403984442578,-53.46403984442578,-48.46403984442578,-47.46403984442578],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":60},"415":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-63.33004980553222,-62.33004980553222,-57.33004980553222,-56.33004980553222],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":60},"420":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":120},"421":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27.86605628666223,-26.86605628666223,-21.86605628666223,-20.86605628666223],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":120},"422":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-36.73211257332446,-35.73211257332446,-30.732112573324457,-29.732112573324457],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":120},"423":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45.59816885998668,-44.59816885998668,-39.59816885998668,-38.59816885998668],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":120},"424":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.46422514664891,-53.46422514664891,-48.46422514664891,-47.46422514664891],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":120},"425":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-63.330281433311136,-62.330281433311136,-57.330281433311136,-56.330281433311136],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":120},"430":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":180},"431":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27.00009265358966,-26.00009265358966,-21.00009265358966,-20.00009265358966],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":180},"432":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-35.00018530717932,-34.00018530717932,-29.000185307179322,-28.000185307179322],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":180},"433":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-43.000277960768976,-42.000277960768976,-37.000277960768976,-36.000277960768976],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":180},"434":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-51.00037061435864,-50.00037061435864,-45.00037061435864,-44.00037061435864],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":180},"435":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-59.0004632679483,-58.0004632679483,-53.0004632679483,-52.0004632679483],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":180},"440":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":240},"441":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27.86596362811624,-26.86596362811624,-21.86596362811624,-20.86596362811624],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":240},"442":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-36.73192725623248,-35.73192725623248,-30.73192725623248,-29.73192725623248],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":240},"443":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45.597890884348715,-44.597890884348715,-39.597890884348715,-38.597890884348715],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":240},"444":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.463854512464955,-53.463854512464955,-48.463854512464955,-47.463854512464955],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":240},"445":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-63.329818140581196,-62.329818140581196,-57.329818140581196,-56.329818140581196],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":240},"450":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-19,-18,-13,-12],"z":[-3,0,0,0,0,0,0,0]},"width":[7,7,8,8],"height":[0,12,13,0],"texture":[17,8.15,17],"angle":300},"451":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-27.866102604783187,-26.866102604783187,-21.866102604783187,-20.866102604783187],"z":[-3,0,0,0,0,0,0,0]},"width":[6.5,6.5,7.5,7.5],"height":[0,10.7,11.7,0],"texture":[17,8.15,17],"angle":300},"452":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-36.732205209566374,-35.732205209566374,-30.732205209566374,-29.732205209566374],"z":[-3,0,0,0,0,0,0,0]},"width":[6,6,7,7],"height":[0,9.4,10.4,0],"texture":[17,8.15,17],"angle":300},"453":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45.59830781434955,-44.59830781434955,-39.59830781434955,-38.59830781434955],"z":[-3,0,0,0,0,0,0,0]},"width":[5.5,5.5,6.5,6.5],"height":[0,8.1,9.1,0],"texture":[17,8.15,17],"angle":300},"454":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-54.46441041913274,-53.46441041913274,-48.46441041913274,-47.46441041913274],"z":[-3,0,0,0,0,0,0,0]},"width":[5,5,6,6],"height":[0,6.8,7.8,0],"texture":[17,8.15,17],"angle":300},"455":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-6},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-63.33051302391593,-62.33051302391593,-57.33051302391593,-56.33051302391593],"z":[-3,0,0,0,0,0,0,0]},"width":[4.5,4.5,5.5,5.5],"height":[0,5.5,6.5,0],"texture":[17,8.15,17],"angle":300},"506":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":10},"516":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":70},"526":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":130},"536":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":190},"546":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":250},"556":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":310},"606":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":30},"616":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":90},"626":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":150},"636":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":210},"646":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":270},"656":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[17,18,23,24],"z":[1.2,0,-1.5,-2,0,0,0,0]},"width":[10,10,9,9],"height":[11,11,10,10],"texture":[17,13,17],"angle":330},"706":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":0},"716":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":60},"726":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":120},"736":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":180},"746":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":240},"756":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-45,-40,-20,-10],"z":[0,0,0,-9,0]},"width":[7,8,10,10],"height":[0,10,15,0],"texture":[4,13,4],"angle":300},"5106":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":-10},"5116":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":50},"5126":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":110},"5136":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":170},"5146":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":230},"5156":{"section_segments":16,"vertical":true,"offset":{"x":0,"y":0,"z":-8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[15,40,39,35],"z":[4,0,0,0]},"width":[6.4,8,7.2,0],"height":[12.8,8,7.2,0],"texture":[11,17,16],"angle":290},"maintop":{"section_segments":16,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,25,24,20],"z":[0,0,0,0]},"width":[14,10,9,0],"height":[14,10,9,0],"texture":[13,63,17],"propeller":true},"00":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-60,-60,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":0},"01":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-64.33004980553223,-64.33004980553223,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":60},"02":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-64.33028143331113,-64.33028143331113,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":120},"03":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-60.0004632679483,-60.0004632679483,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":180},"04":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-64.3298181405812,-64.3298181405812,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":240},"05":{"section_segments":[35,55,125,145,215,235,305,325,395],"vertical":true,"offset":{"x":0,"y":0,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-64.33051302391593,-64.33051302391593,-20,-20,-5],"z":[-6,-6,-5,-10,-15,0,0,0,0]},"width":[0,5,13,14.2,8],"height":[0,2,8,8,8],"texture":[63,63,18,12],"angle":300}},"typespec":{"name":"Defense Pod","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[75,100],"reload":[2,3]},"generator":{"capacity":[1e-30,1e-30],"reload":[2,3]},"ship":{"mass":1e-30,"speed":[1e-30,1e-30],"rotation":[1e-30,1e-30],"acceleration":[1e+30,1e+30]}},"shape":[0.266,0.27,0.279,0.293,0.314,0.34,0.352,0.371,0.419,0.455,0.521,0.592,0.957,1.223,1.225,1.003,0.873,0.821,0.726,0.661,0.607,0.551,0.565,0.552,0.534,0.526,0.534,0.552,0.565,0.551,0.607,0.661,0.726,0.821,0.873,1.003,1.225,1.223,0.957,0.592,0.521,0.455,0.419,0.371,0.352,0.34,0.314,0.293,0.279,0.27],"lasers":[],"radius":1.225}}`
                        // ],
                        // disable from shooting and other stuff if typing
                        [",document.onkeydown=function(t){return function(e){var i,s,l;i",
                            ",document.onkeydown=function(t){return function(e){if(window.isMessageFocused){return;} var i,s,l;i"],
                        // take socket into tr_conn
                        [`_count=0,this.accepted=!1,this.socket=WSS.create(this.address),this.socket.onmessage=func`,
                            `_count=0,this.accepted=!1,this.socket=WSS.create(this.address),window.initConn(this.socket),this.socket.onmessage=func`],
                        [`say=function(t){return this.socket.send(JSON.stringify({name:"say",data:t}))},e`,
                            `say=function(t,type="message"){
                                //window._tr_sendMessage =
                                if (window.isMessageFocused) return;
                                window.chatBubbleToSoundboard("self", e);
                                return this.socket.send(JSON.stringify({name:"say",data:t}));

                            },e`], // message sender
                        ["y,function(t){return function(e){return t.typed(e)}}(this))),this.lOlII.vocabulary[l.key]={icon:l.icon,text:t(l.text)};0===this.lOlII.mode.vocabulary.length&&(this.open_button.visible=!1,this.open_button.enabled=!1)}for(I=",
                            `y,function(t){return function(e){
                                window.chatBubbleToSoundboard("self", e);
                            ;return t.typed(e)}}(this))),this.lOlII.vocabulary[l.key]={icon:l.icon,text:t(l.text)};0===this.lOlII.mode.vocabulary.length&&(this.open_button.visible=!1,this.open_button.enabled=!1)}for(I=`], // soundboard implementation hopefully
                        ["t.prototype.shipSays=function(t,e){var i,s;if(null!=(s=this.OI111[t])&&this.lOlII.mode.acceptChat(s,e))return null==s.chatbubble?(i=s.lI00I.status.hue,this.lOlII.mode.anonymous_ships&&(i=(this.lOlII.hue+180)%360),s.chatbubble",
                            `t.prototype.shipSays=function(t,e){var i,s;if(null!=(s=this.OI111[t])&&this.lOlII.mode.acceptChat(s,e)&&(() => {
                                //console.log(t);console.log(e);//str
                                const isStreamPart = (t) => {
                                    return window.messageStreams[t].length > 0
                                }
                                function decodeFromNumbers(numStr) {
                                    numStr = numStr.slice(4);
                                    return numStr;
                                    //return numStr.split(' ').map(code => String.fromCharCode(Number(code))).join('');
                                }
                                if (!(t in window.messageStreams)) window.messageStreams[t] = "";
                                if (e === "ZZZ0") {
                                    // "ZZZ0" is used by trigger to denote the start of a message
                                    window.messageStreams[t] += "ZZZ0";
                                } else if (e === "Z0Z0") {
                                    console.log("recieving ping");
                                    window.messageStreams[t] += "Z0Z0";
                                }
                                if (isStreamPart(t) && (e !== "0ZZZ") && (e !== "ZZZ0") && (e !== "0Z0Z") && (e !== "Z0Z0")) {
                                    // "0ZZZ" is used by trigger to denote the end of a message
                                    console.log("recieving part");
                                    window.messageStreams[t] += e;
                                }
                                if (e === "0Z0Z") {
                                    let x = 0, y = 0, type = 1;
                                    console.log("ending ping");
                                    let parts = window.messageStreams[t].split("|");
                                    console.log(window.messageStreams);
                                    console.log(parts);

                                    x = Number(parts[0].slice(4));

                                    y = Number(parts[1]);

                                    let target = null;
                                    searchID: for (let ship of window._ships) {
                                        let shipKeys = Object.keys(ship);
                                        for (let shipKey of shipKeys) {
                                            if (!("shipid" in ship[shipKey])) continue;
                                            if (ship[shipKey].shipid == t) {
                                                target = ship[shipKey];
                                                break searchID;
                                            }
                                        }
                                    }

                                    window.executePing(x, y, parts[2], target);

                                    window.messageStreams[t] = "";
                                }
                                if (e === "0ZZZ") {
                                    //console.log(window.messageStreams[t]);
                                    //console.log("Someone has said: " + decodeFromNumbers(window.messageStreams[t]));
                                    let mess = decodeFromNumbers(window.messageStreams[t]);
                                    let target = null;
                                    searchID: for (let ship of window._ships) {
                                        let shipKeys = Object.keys(ship);
                                        for (let shipKey of shipKeys) {
                                            if (!("shipid" in ship[shipKey])) continue;
                                            if (ship[shipKey].shipid == t) {
                                                target = ship[shipKey];
                                                break searchID;
                                            }
                                        }
                                    }
                                    window.addMessage(target, mess);
                                    window._tr_audio.compiled.notification.play();
                                    window.messageStreams[t] = "";
                                }
                                let profile = window.getProfile(t);
                                if (profile?.isTriggerUser) {
                                    window.chatBubbleToSoundboard(t, e);
                                }
                                return true;
                            })
                            ())return null==s.chatbubble?(i=s.lI00I.status.hue,this.lOlII.mode.anonymous_ships&&(i=(this.lOlII.hue+180)%360),s.chatbubble`], // soundboard implementation hopefully
                        ["t.lOlII.using_keyboard=.2+.8*t.lOlII.using_keyboard","t.lOlII.using_keyboard=.05+.8*t.lOlII.using_keyboard"], // render more asteroids
                        [",this.IIOII.position.x=this.l1IlO.IIOII.x,this.IIOII.position.y=this.l1IlO.IIOII.y,"
                            ,","],
                        ["this.IIOII.position.x=this.lOlII.OlII0.l1IlO.IIOII.x+this.lOlII.OlII0.shake.x,this.IIOII.position.y=this.lOlII.OlII0.l1IlO.IIOII.y+this.lOlII.OlII0.shake.y,"
                            ,"this.IIOII.position.x=(this.lOlII.OlII0.l1IlO.IIOII.x+this.lOlII.OlII0.shake.x) - (window.offsetnumX * window._3dmode),this.IIOII.position.y=(this.lOlII.OlII0.l1IlO.IIOII.y+this.lOlII.OlII0.shake.y) - (window.offsetnumY * window._3dmode),"],
                        ["this.IIOII.position.x=this.l1IlO.IIOII.x+this.shake.x,this.IIOII.position.y=this.l1IlO.IIOII.y+this.shake.y,"
                            ,"this.IIOII.position.x=(this.l1IlO.IIOII.x+this.shake.x) - (window.offsetnumX * window._3dmode),this.IIOII.position.y=(this.l1IlO.IIOII.y+this.shake.y) - (window.offsetnumY * window._3dmode),"],
                        [`,i.translate(1024,0)`,
                            `,i.translate(1024,0)`
                         ],


                         // conditions for rendering ship tag - trying to render self-ship tag
                        [
                            `this.options.OlO10&&"undefined"!=typeof Ol1I1&&null!==Ol1I1&&(this.OlO10=new Ol1I1(Math.floor(360*this.hue)))`,
                            `(this.OlO10=new Ol1I1(Math.floor(360*this.hue)))`
                        ],
                         // ! CHANGES TEXTURES TO DEBUG COLORS
                        // [`o=["#FFF","#CCC","#999","#666","#333","#000","#FDA","#456"]`,
                        //     `o=["#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FFFFFF","#000000"]`],

                        // [`o=["#FFF","#CCC","#999","#666","#333","#000","#FDA","#456"]`,
                        //     `o=["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"]`],
                        // [`for(I=["7","D","(","%","+","a"],i.font="38pt SBGlyphs",l=a=0,u=I.length-1;0<=u?a<=u:a>=u;l=0<=u?++a:--a)l===I.le`,
                        //     `for(I=["7","D","(","%","+","a"],i.font="38pt SBGlyphs",l=a=0,u=I.length-1;0<=u?a<=u:a>=u;l=0<=u?++a:--a)continue;l===I.le`
                        //  ],
                        // [`exture=function(){var e,i,s,l,n,a,o,r,h,u,I`,
                        //     `exture=function(){return; var e,i,s,l,n,a,o,r,h,u,I`
                        //  ],

                        // glow
                        // [`i.shadowBlur=2,`,
                        //     `i.shadowBlur=0,`
                        //  ],

                        // // gradient for bars (shield, energy, gems)
                        // [`,s.addColorStop(0,"#FFF"),s.addColorStop(.6,"#FFF"),s.addColorStop(.6,"#CCC"),`,
                        //     `,s.addColorStop(0,"#888888"),s.addColorStop(0.5, "#FFF"),s.addColorStop(1,"#888888"),`
                        //  ],

                        //  // changing the position of the bars
                        // [`i.prototype.initBar=function(t,e,i,s,l,n){var a,o,r,h,u;for(a=0,r=h=t,u=t+this.display_size-1;h<=u;r=h+=1)this.vertices[3*r]=.01+.015*(a+1),this.vertices[3*r+1]=e,this.vertices[3*r+2]=0,this.figure[r]=0,this.color[3*r]=i,this.color[3*r+1]=s,this.color[3*r+2]=l,this.time[r]=0,this.IlIlI[r]=.015,this.opac[r]=1,this.fill[r]=1,this.speed[r]=0,0===a?this.figure[r]=n:a<=this.bar_size?this.figure[r]=16:(o=a-this.bar_`,
                        //     `i.prototype.initBar=function(t,e,i,s,l,n){var a,o,r,h,u;for(a=0,r=h=t,u=t+this.display_size-1;h<=u;r=h+=1)this.vertices[3*r]=.01+.015*(a+1),this.vertices[3*r+1]=e-.065,this.vertices[3*r+2]=0,this.figure[r]=0,this.color[3*r]=i,this.color[3*r+1]=s,this.color[3*r+2]=l,this.time[r]=0,this.IlIlI[r]=.015,this.opac[r]=1,this.fill[r]=1,this.speed[r]=0,0===a?this.figure[r]=n:a<=this.bar_size?this.figure[r]=16:(o=a-this.bar_`
                        //  ],

                        // changing the style of the bars
                        [`i.moveTo(2,2),i.lineTo(12,2),i.lineTo(12,12),i.lineTo(18,22),i.lineTo(18,62),i.lineTo(8,62),i.lineTo(8,52),i.lineTo(2,42)`,
                            `i.moveTo(0,0),i.lineTo(64/6,0),i.lineTo(64/3,64),i.lineTo(64/6,64),i.lineTo(0,0)`], // turns bullet hud into rectangle

                        // // changing the position of the bars
                        // [`,this.vertices[3*s]=.02,this.vertices[3*s+1]=.05,this.vertices[3*s+2]=this.livesblink?1e3:0,`,
                        //     `,this.vertices[3*s]=.043,this.vertices[3*s+1]=.19,this.vertices[3*s+2]=this.livesblink?1e3:0,`], // move lives down for reduced hud version

                        // // making the letters invisible on RCS (check hsla part)
                        // [`e.prototype.l0I0I=function(t){var e,i;return null!=this.material&&(this.material.depthTest=!0,this.material.depthWrite=!1),this.lOlII.is_mobile_app?this.drawComponentMobile(t):(this.status?t.globalAlpha=1:t.globalAlpha=.5,this.background="hsla("+this.hue+",70%,30%,.15)",this.medium="hsla("+this.hue+",50%,40%,.5)",this.color="hsla("+this.hue+",70%,80%,1)",t.save(),t.translate(this.px,this.O0l0O),t.clearRect(0,0,this.I1111,this.I10lI),t.textAlign="left",t.textBaseline="middle",e=Math.round(this.I10lI/3),t.font=e+"pt FontAwesome",i=this.I10lI/4,t.fillStyle=this.medium,t.beginPath(),t.moveTo(0,0),t.lineTo(this.I1111-i,0),t.lineTo(this.I1111,i),t.lineTo(this.I1111,this.I10lI),t.lineTo(i,this.I10lI),t.lineTo(0,this.I10lI-i),t.closePath(),t.fill(),t.fillStyle=this.color,t.globalAlpha=1,this.status?t.drawImage(this.shipicon,this.I1111/2,0,this.I10lI,this.I10lI):t.drawImage(this.rcsimage,this.I1111/2-.5*this.I10lI,0,2*this.I10lI,this.I10lI),t.globalAlpha=this.status?1:.5,t.font=e+"pt Play",this.status?t.fillText("RCS: ON",.25*this.I10lI,this.I10lI/2):t.fillText("RCS: OFF",.25*this.I10lI,this.I10lI/2),this.using_gamepad?Gamepad.drawButton("LT",t,this.I1111-this.I10lI/4-.4*this.I10lI,this.I10lI/2,.6*e,this.hue):(t.textAlign="center",t.font=Math.round(.6*e)+"pt Play",t.fillText("CTRL",this.I1111-this.I10lI/4-.4*this.I10lI,this.I10lI/2),t.strokeStyle=this.color,t.strokeRect(this.I1111-this.I10lI/4-.8*this.I10lI,.3*this.I10lI,.8*this.I10lI,.4*this.I10lI)),t.restore())},e.prototype.drawComponentMobile=function(t){var e;return this.color="hsla("+this.hue+",70%,80%,1)",t.save(),t.translate(this.px,this.O0l0O),t.textAlign="center",t.textBaseline="middle",e=Math.round(.75*Math.min(this.I1111,this.I10lI)),t.font=e+"pt SBGlyphs",t.fillStyle=this.color,t.shadowBlur=e/20,t.shadowOpacity=1,t.shadowColor=this.color,t.fillText(this.status?"w":"v",.5*this.I1111,.5*this.I10lI),t.restore()},e.prototype.IIlO0=function(){return this.lOlII.is_mobile_app?(this.lOlII.OlII0.OOIIO.OlI0l.glide=!this.lOlII.OlII0.OOIIO.OlI0l.glide,this.lOlII.OlII0.OOIIO.IlOIO()):!this.lOlII.settings.check("buttons_disabled")&&(document.onkeydown({keyCode:17}),!0)},e.prototype.IlllI=function(){return this.lOlII.is_mobile_app||(this.lOlII.OlII0.control.control`,
                        //     `e.prototype.l0I0I=function(t){var e,i;return null!=this.material&&(this.material.depthTest=!0,this.material.depthWrite=!1),this.lOlII.is_mobile_app?this.drawComponentMobile(t):(this.status?t.globalAlpha=1:t.globalAlpha=.5,this.background="hsla("+this.hue+",70%,30%,.0)",this.medium="hsla("+this.hue+",50%,40%,.0)",this.color="hsla("+this.hue+",70%,80%,0)",t.save(),t.translate(this.px,this.O0l0O),t.clearRect(0,0,this.I1111,this.I10lI),t.textAlign="left",t.textBaseline="middle",e=Math.round(this.I10lI/3),t.font=e+"pt FontAwesome",i=this.I10lI/4,t.fillStyle=this.medium,t.beginPath(),t.moveTo(0,0),t.lineTo(this.I1111-i,0),t.lineTo(this.I1111,i),t.lineTo(this.I1111,this.I10lI),t.lineTo(i,this.I10lI),t.lineTo(0,this.I10lI-i),t.closePath(),t.fill(),t.fillStyle=this.color,t.globalAlpha=1,this.status?t.drawImage(this.shipicon,this.I1111/2,0,this.I10lI,this.I10lI):t.drawImage(this.rcsimage,this.I1111/2-.5*this.I10lI,0,2*this.I10lI,this.I10lI),t.globalAlpha=this.status?1:.5,t.font=e+"pt Play",this.status?t.fillText("RCS: ON",.25*this.I10lI,this.I10lI/2):t.fillText("RCS: OFF",.25*this.I10lI,this.I10lI/2),this.using_gamepad?Gamepad.drawButton("LT",t,this.I1111-this.I10lI/4-.4*this.I10lI,this.I10lI/2,.6*e,this.hue):(t.textAlign="center",t.font=Math.round(.6*e)+"pt Play",t.fillText("CTRL",this.I1111-this.I10lI/4-.4*this.I10lI,this.I10lI/2),t.strokeStyle=this.color,t.strokeRect(this.I1111-this.I10lI/4-.8*this.I10lI,.3*this.I10lI,.8*this.I10lI,.4*this.I10lI)),t.restore())},e.prototype.drawComponentMobile=function(t){var e;return this.color="hsla("+this.hue+",70%,80%,1)",t.save(),t.translate(this.px,this.O0l0O),t.textAlign="center",t.textBaseline="middle",e=Math.round(.75*Math.min(this.I1111,this.I10lI)),t.font=e+"pt SBGlyphs",t.fillStyle=this.color,t.shadowBlur=e/20,t.shadowOpacity=1,t.shadowColor=this.color,t.fillText(this.status?"w":"v",.5*this.I1111,.5*this.I10lI),t.restore()},e.prototype.IIlO0=function(){return this.lOlII.is_mobile_app?(this.lOlII.OlII0.OOIIO.OlI0l.glide=!this.lOlII.OlII0.OOIIO.OlI0l.glide,this.lOlII.OlII0.OOIIO.IlOIO()):!this.lOlII.settings.check("buttons_disabled")&&(document.onkeydown({keyCode:17}),!0)},e.prototype.IlllI=function(){return this.lOlII.is_mobile_app||(this.lOlII.OlII0.control.control`],

                        // // changing the position of RCS
                        // [`this.lOlII.is_mobile_app?this.lOlII.is_tablet?this.add(this.rcs,[.02,.5,.08,.12]):this.add(this.rcs,[.02,.34,.08,.12]):this.add(this.rcs,[0,.23,.2,.05])),this.survival!==this`,
                        //     `this.lOlII.is_mobile_app?this.lOlII.is_tablet?this.add(this.rcs,[.02,.5,.08,.12]):this.add(this.rcs,[.02,.34,.08,.12]):this.add(this.rcs,[0,.17,.145,.043])),this.survival!==this`],

                        // // disabling the bar icons from rendering
                        // [`I=["7","D","(","%","+","a"]`,
                        //     `I=["","","","","",""]`],

                        // // making the numbers invisible
                        // [`)n=t+1+this.bar_size+l,this.figure[n]=Math.floor(e/Math.pow(10,h-1-l))%10,t`,
                        //     `)n=t+1+this.bar_size+l,this.opac[n]=0,this.figure[n]=Math.floor(e/Math.pow(10,h-1-l))%10,t`],

                        // // making the numbers invisible
                        // [`for(l=r=h;r<=2;l=r+=1)n=t+1+this.bar_size+l,this.vertices[3*n+2]=1e3;`,
                        //     `for(l=r=h;r<=2;l=r+=1)n=t+1+this.bar_size+l,this.opac[n]=0,this.vertices[3*n+2]=1e3;`],

                        // // making the numbers invisible
                        // [`for(Math.abs(this.score-this.score_target)<1?this.score=this.score_target:this.score=.98*this.score+.02*this.score_target,I=Math.round(this.score),h=1,l=n=0;n<=9;l=n+=1)0===l||I>=Math.pow(10,l)?(this.vertices[3*l+2]=0,this.figure[l]=Math.floor(I/Math.pow(10,l))%10,this.fill[l]=1,h=l+1):l<6?(this.vertices[3*l+2]=0,this.figure[l]=0,this.fill[l]=0):this.vertices[3*l+2]=1e3;for(h=Math.max(6,h),s=.02*h,l=a=0,u=h-1;a<=u;l=a+=1)this.vertices[3*l]=.02*(9-l)+s-.15;`,
                        //     `for(Math.abs(this.score-this.score_target)<1?this.score=this.score_target:this.score=.98*this.score+.02*this.score_target,I=Math.round(this.score),h=1,l=n=0;n<=9;l=n+=1)0===l||I>=Math.pow(10,l)?(this.vertices[3*l+2]=0,this.opac[l]=0,this.figure[l]=Math.floor(I/Math.pow(10,l))%10,this.fill[l]=1,h=l+1):l<6?(this.vertices[3*l+2]=0,this.figure[l]=0,this.opac[l]=0,this.fill[l]=0):this.vertices[3*l+2]=1e3;for(h=Math.max(6,h),s=.02*h,l=a=0,u=h-1;a<=u;l=a+=1)this.vertices[3*l]=.02*(9-l)+s-.15;`],

                        // // making the level thing invisible
                        // [`i.prototype.updateLevel=function(){var t;return t=this.level_index,this.vertices[3*t]=.185,this.vertices[3*t+1]=.05,this.vertices[3*t+2]=0,this.IlIlI[t]=.02,this.figure[t]=17,this.fill[t]=1,this.opac[t]=1,t=this.level_index+1,this.vertices[3*t]=.2,this.vertices[3*t+1]=.05,this.vertices[3*t+2]=0,this.IlIlI[t]=.014,this.figure[t]=this.lvl,this.fill[t]=1,this.opac[t]=1,this.geometry.getAttribute("figure").needsUpdate=!0}`,
                        //     `i.prototype.updateLevel=function(){var t;return t=this.level_index,this.vertices[3*t]=.185,this.vertices[3*t+1]=.05,this.vertices[3*t+2]=0,this.IlIlI[t]=.02,this.figure[t]=17,this.fill[t]=1,this.opac[t]=0,t=this.level_index+1,this.vertices[3*t]=.2,this.vertices[3*t+1]=.05,this.vertices[3*t+2]=0,this.IlIlI[t]=.014,this.figure[t]=this.lvl,this.fill[t]=1,this.opac[t]=0,this.geometry.getAttribute("figure").needsUpdate=!0}`],

                        [
                            `.status.deaths++,this.lOlII.OOIIO.status.alive=!1,this.lOlII.OlII0.OIOOl.explode(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,null,Math.max(5,this.lOlII.OOIIO.type.radius)),this.lOlII.ll11I.OlI0I(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,4,.25),this.lOlII.OlII0.shakeCamera(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,20),l=this.lOlII.names.get(e),`,
                            `.status.deaths++,window._tr_audio.compiled.death.play(),this.lOlII.OOIIO.status.alive=!1,this.lOlII.OlII0.OIOOl.explode(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,null,Math.max(5,this.lOlII.OOIIO.type.radius)),this.lOlII.ll11I.OlI0I(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,4,.25),this.lOlII.OlII0.shakeCamera(this.lOlII.OOIIO.status.x,this.lOlII.OOIIO.status.y,20),window.startDeathScene(e),window.cleanHUD(),l=this.lOlII.names.get(e),`
                        ],

                        [
                            `(this.lOlII.message(t("You killed %s!").replace("%s",S),"#F88"),0!=(2147483648&ut.getUint32(8,!0))&&setTimeout(function(e){return function(){return e.lOlII.message(t("Revenge kill bonus +%s points").replace("%s",Math.round(H/2)))}}(this),500)),this.lOlII.OOIIO.status.score=2147483647&ut.getUint32(8,!0),setTimeout(function(t){return function(){return t.lOlII.display.screen.l1lOl.figures.bonus(H,q.lI00I.status.x,q.lI00I.status.y,16777215,10,2)}}(this),1e3),this.lOlII.takeScreenshot("frag",Date.now()+200,this.lOlII.OOIIO.type.level+q.lI00I.type.level)),this.lOlII.OlII0.l1IlO.isShipVisible(U)&&(this.lOlII.OlII0.l1IlO.showRipPlate(q.lI00I),this.lOl`,
                            `(this.lOlII.message(t("You killed %s!").replace("%s",S),"#F88"),window._tr_audio.compiled.kill.play(),0!=(2147483648&ut.getUint32(8,!0))&&setTimeout(function(e){return function(){return e.lOlII.message(t("Revenge kill bonus +%s points").replace("%s",Math.round(H/2)))}}(this),500)),this.lOlII.OOIIO.status.score=2147483647&ut.getUint32(8,!0),setTimeout(function(t){return function(){return t.lOlII.display.screen.l1lOl.figures.bonus(H,q.lI00I.status.x,q.lI00I.status.y,16777215,10,2)}}(this),1e3),this.lOlII.takeScreenshot("frag",Date.now()+200,this.lOlII.OOIIO.type.level+q.lI00I.type.level)),this.lOlII.OlII0.l1IlO.isShipVisible(U)&&(this.lOlII.OlII0.l1IlO.showRipPlate(q.lI00I),this.lOl`
                        ],

                        // disable camera follow on respawn
                        [
                            `t.lOlII.sendGAEvent("respawn_evt"),`,
                            `t.lOlII.sendGAEvent("respawn_evt"),window.endDeathScene(),`
                        ],

                        // log the screen coordinates of mouse move
                        // [
                        //     `e.prototype.mouseMove=function(t,e,i){var s,l,n,a;for(a=this.I1IlI(t,e),l=0,n=a.length;l<n;l++)if(s=a[l],s.mouseMove(t+this.IOOOI,e+this.II01I,i))return!0;return!1}`,
                        //     `e.prototype.mouseMove=function(t,e,i){var s,l,n,a;console.log(t);console.log(e);console.log("second");console.log(t+this.IOOOI);console.log(e+this.II01I);console.log(i);for(a=this.I1IlI(t,e),l=0,n=a.length;l<n;l++)if(s=a[l],s.mouseMove(t+this.IOOOI,e+this.II01I,i))return!0;return!1}`
                        // ],

                        // finds the map coordinates of the latest user click
                        // [
                        //     `,s=(t.clientY-this.element.offsetTop)*this.OOO0I,e=!`,
                        //     `,s=(t.clientY-this.element.offsetTop)*this.OOO0I,console.log(i),console.log(s),console.log(window.gameCamera),(() => {
                        //         let angle = -Math.atan2(i, s);
                        //         angle = Math.round(angle / (180 * THREE.Math.DEG2RAD) * 180);
                        //         for (;angle < 0;) {
                        //             angle += 360;
                        //         }
                        //         console.log("angle: " + angle);
                        //     })(),e=!`
                        // ],

                        // finds the map coordinates of the latest user click
                        ["e.mouseMove=function(t,e,i){if(!(Date.now()<", `e.mouseMove=function(t,e,i){let copyT = t, copyE = e;if(!(Date.now()<`], // just get initial copy
                        [
                            `;)this.angle+=360;return this`,
                            `;)this.angle+=360;(() => {
                                function getPointerWorldPosition(mouseX, mouseY, canvasWidth, canvasHeight, cameraX, cameraY, zoom = 1.0, baseVisibleHeight = 30) {
                                    // 1. Convert to screen-centered coordinates (0,0 at center)
                                    const dx = mouseX - canvasWidth / 2;
                                    const dy = mouseY - canvasHeight / 2;

                                    // 2. Aspect ratio
                                    const aspect = canvasWidth / canvasHeight;

                                    // 3. World visible size at current zoom
                                    const visibleHeight = baseVisibleHeight * zoom;
                                    const visibleWidth = visibleHeight * aspect;

                                    // 4. Convert pixel offset to normalized offset (-1 to 1)
                                    const normX = dx / (canvasWidth / 2);
                                    const normY = -dy / (canvasHeight / 2); // Y is flipped (top is 0 in screen coords)

                                    // 5. Convert normalized offset to world units
                                    const worldOffsetX = normX * (visibleWidth / 2);
                                    const worldOffsetY = normY * (visibleHeight / 2);

                                    // 6. Final world position relative to camera center
                                    return {
                                        x: cameraX + worldOffsetX,
                                        y: cameraY + worldOffsetY
                                    };
                                }
                                let radians = this.angle * (Math.PI / 180);
                                let mousepos = getPointerWorldPosition(copyT, copyE, this.lOlII.display.width, this.lOlII.display.height, window.gameCamera.x, window.gameCamera.y, window.gameCamera.zoom, 56);
                                window.lastMappedMousePosition = mousepos;

                                //console.log(window.gameCamera);
                                //console.log("mousepos: ");
                                //console.log(mousepos);


                                // const spriteMaterial = new THREE.SpriteMaterial({ map: window._tr_textures.compiled.warning, transparent: true });
                                // const sprite = new THREE.Sprite(spriteMaterial);

                                // sprite.scale.set(5, 5, 1); // adjust size as needed
                                // sprite.position.set(mousepos.x, mousepos.y, 0);

                                // window.gameScene.add(sprite);


                                        //const testMesh = new THREE.SphereGeometry(1, 32, 32);
                                        //const mesh = new THREE.Mesh(testMesh, testMaterial);
                                        //window.gameScene.add(mesh);
                                        //mesh.position.set(mousepos.x, mousepos.y, 0);
                                        //window._testRender = null;
                            })();return this`
                        ],
                        // BAR SKINS:
                        // BOLT    - i.moveTo(0,0),i.lineTo(0,32),i.lineTo(64/3,64),i.lineTo(64/3,32),i.lineTo(0,0)
                        // CHEVRON - i.moveTo(0,0),i.lineTo(64/6,0),i.lineTo(64/3,64),i.lineTo(64/6,64),i.lineTo(0,0)
                        // BARS    - i.moveTo(0,0),i.lineTo(64/3+0.1,0), i.lineTo(64/3+0.1, 64), i.lineTo(0, 64), i.lineTo(0,0)
                        // DEFAULT - i.moveTo(2,2),i.lineTo(12,2),i.lineTo(12,12),i.lineTo(18,22),i.lineTo(18,62),i.lineTo(8,62),i.lineTo(8,52),i.lineTo(2,42)
                        // ROCKY nw- i.moveTo(0,0),i.lineTo(64/3,0),i.moveTo(64/3,(64 - 8) / 3),i.moveTo(0,(64 - 8) / 3),i.moveTo(0,0),i.moveTo(0, (64 - 8) / 3 + (8 / 2)),i.moveTo(64/3, (64 - 8) / 3 + (8 / 2)),i.moveTo(64/3, ((64 - 8) / 3) * 2 + (8 / 2)), i.moveTo(0, (64 - 8) / 3 + (8 / 2)), i.moveTo(0, ((64 - 8) / 3) * 2 + 8), i.moveTo(64/3, ((64 - 8) / 3) * 2 + 8), i.moveTo(64 / 3, 64), i.moveTo(0, 64), i.moveTo(0, ((64 - 8) / 3) * 2 + 8)

                        //[`this.IIOII.rotation.z=180*THREE.Math.DEG2RAD*2,this.IIOII`, `this.IIOII`],  //useless - unless u want drunk mode lol
                        // ["this.bar_size=9", "this.bar_size=18"], // changes the entire size of the shield,energy and gem bars
                    ],
                    all: [
                        //['+=.02*e',`+=.03*e`], // fast camera
                        //['16777215',`0xff0000`],
                        // [`16711680`, `65280`], // change color of gems
                        // [`hsla("+a+",80%,90%,1)",e.textAlign="left"`, `hsla("+a+",20%,40%,.8)",e.textAlign="right"`], // changes ship uphrade opacity
                        //['",70%,30%,.15)",this.medium="hsla("+this.hue+",70%,40%,.25)"',`",70%,30%,.07)",this.medium="hsla("+this.hue+",70%,40%,.12)"`], // changes ingame ui opacity
                        //['*=.7,this.shake',`*=1,this.shake`],
                        //["this.respawn_delay=","this.respawn_delay=0*"],
                        [".toUpperCase()",""],

                        // i completely forgot what this does
                        ["c>10","c>6"],


                        // ["THREE.LinearFilter","THREE.LinearMipmapLinearFilter"],
                        //["this.ship.l1I10.rotation.z=this.OOIIO.OlI0l.r+180*THREE.Math.DEG2RAD,this.ship.l1I10.p","this.ship.l1I10.p"], //useless
                        //["this.opac[this.core_index]=.1,","this.opac[this.core_index]=1,"],

                        //["this.radar_shows_leader=!1","this.radar_shows_leader=!0"], // force show leader on radar

                        //["this.custom_color=!1","this.custom_color=!0"],
                        ["this.material.emissive.set(l0Il1.hsvToRgbHex(this.hue,.5,1)),",""],
                        ["this.material.emissive.setHex(l0Il1.hsvToRgbHex(this.hue,.5,.5)),",""],
                        //["MeshPhongMaterial","MeshStandardMaterial"],
                        //["new THREE.OrthographicCamera(0,this.width,0,this.height,.1,1e4)","new THREE.OrthographicCamera(0,this.width,0,this.height,.1,2e4)"],
                        //["new THREE.WebGLRenderer({antialias:!0,alpha:!0})",`getTriggerRenderer({antialias:!0,alpha:!0})`],
                        //[`t<=10`, `t<=4`], // space mines
                        ["pt Play","pt " + (localStorage.getItem(LS_PREFIX + "graphics_ing_font") ?? "Play")],
                        // ["figure[r]=0", "figure[r]=1"]
                    ]
                }

                announceLoadJob("Inserting badges...");
                ;(function insertBadges() {
                    let insertURL = `case"nwac":this.icon="https://starblast.io/ecp/nwac.png";break;`;
                    let insertURLOutp = insertURL;
                    for (let insert of Object.keys(badgeInsert)) {
                        insertURLOutp += `case"${insert}":this.icon="${badgeInsert[insert].URL}";break;`
                    }
                    REPLACEMENTS.reg.push([insertURL, insertURLOutp]);
                    //console.log(insertURLOutp)

                    let insertOption = `blank:"Blank",`;
                    let insertOptionOutp = insertOption;
                    for (let insert of Object.keys(badgeInsert)) {
                        insertOptionOutp += `"${insert}":"${badgeInsert[insert].name}",`
                    }
                    REPLACEMENTS.reg.push([insertOption, insertOptionOutp]);
                })();

                //await announceLoadJob("Inserting textures...");
                ;(function injectTextures() {

                    let insertSwitch = `case"gold":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(40,100%,50%)"),s.addColorStop(.5,"hsl(40,100%,80%)"),s.addColorStop(.5,"hsl(20,100%,30%)"),s.addColorStop(1,"hsl(40,100%,50%)");break;`;
                    let insertSwitchOutp = insertSwitch + "";
                    for (let insert of Object.keys(textureInsert)) {
                        // video badges dont need this parser
                        if (insert.startsWith("_vid_")) continue;
                        insertSwitchOutp += `case"${insert}":` + textureInsert[insert].material + "break;"
                    }
                    REPLACEMENTS.reg.push([insertSwitch, insertSwitchOutp]);

                    let insertEnvmaps = `let _envmapsmarker;`
                    let insertEnvmapsOutp = "";
                    for (let insert of Object.keys(textureInsert)) {
                        if (textureInsert[insert].ignore) continue;
                        if (textureInsert[insert].envMap) {
                            insertEnvmapsOutp += `
                                ;(() => {
                                    ${textureInsert[insert].envMap}
                                })();
                            `
                        }
                    }
                    REPLACEMENTS.reg.push([insertEnvmaps, insertEnvmapsOutp]);

                    let insertObject = `alloy:"Alloy",`;
                    let insertObjectOutp = insertObject + "";
                    for (let insert of Object.keys(textureInsert)) {
                        if (textureInsert[insert].ignore) continue;
                        if (textureInsert[insert].hasOwnProperty("choosable") && !textureInsert[insert].choosable) continue;
                        insertObjectOutp += `${insert}:"${textureInsert[insert].name}",`
                    }
                    REPLACEMENTS.reg.push([insertObject, insertObjectOutp]);

                    let insertBuild = `case"titanium":this.buildTitaniumMaterial();break;case"carbon":this.buildCarbonMaterial();break;`
                    let insertBuildOutp = insertBuild + "";
                    for (let insert of Object.keys(textureInsert)) {
                        if (textureInsert[insert].ignore) continue;
                        insertBuildOutp += `case"${insert}":this.${textureInsert[insert].funcName}();break;`;

                    }
                    REPLACEMENTS.reg.push([insertBuild, insertBuildOutp]);

                    let functionInsert = `t.prototype.buildAlloyMaterial=function(){return this.material=new THREE.MeshPhongMaterial({map:llIl1,bumpMap:llIl1,specularMap:llIl1,specular:8413264,shininess:30,bumpScale:.1,color:10531008,emissive:l0Il1.hsvToRgbHex(this.hue,.5,1),emissiveMap:OOlO0})},`;
                    let functionInsertOutp = functionInsert + "";
                    for (let insert of Object.keys(textureInsert)) {
                        if (textureInsert[insert].ignore) continue;
                        if (textureInsert[insert].func) {
                            functionInsertOutp += `t.prototype.${textureInsert[insert].funcName}=function(){${textureInsert[insert].func}},`
                        }
                    }
                    REPLACEMENTS.reg.push([functionInsert, functionInsertOutp]);

                    let insertAnimationParser = `case "_video_marker":break;`;
                    let insertAnimationParserOutp = insertAnimationParser;
                    for (let insert of Object.keys(textureInsert)) {
                        let st = textureInsert[insert]?.video?.steps?.length;
                        window._videoBadgeInfo[insert] = {steps: st ? st : 4};
                        if (textureInsert[insert].ignore) continue;
                        if(!textureInsert[insert].video) continue;
                        insertAnimationParserOutp += `case "${insert}":
                                                        switch (realstep) {`
                        for (let step = 0; step < textureInsert[insert].video.steps.length; step++) {
                            // step + 1 because steps start off at 1, and +step because step is for some reason a string
                            // let caseName = ;
                            // let body = textureInsert[insert].video.steps[step];
                            //if (isNaN(caseName)) continue;
                            //console.log(caseName);
                            insertAnimationParserOutp += `case ${+step+1}:
                                                            ${textureInsert[insert].video.steps[step]}
                                                            break;`;
                        }
                        if (textureInsert[insert].video.thumbnail) {
                            let thumbnail = typeof textureInsert[insert].video.thumbnail === "number"
                                ? textureInsert[insert].video.steps[textureInsert[insert].video.thumbnail]
                                : textureInsert[insert].video.thumbnail;
                            insertAnimationParserOutp += `case "thumbnail":
                                                            ${thumbnail}
                                                            ;break;`;
                        }
                        insertAnimationParserOutp += `};
                                                    break;`
                    }
                    //console.log(insertAnimationParserOutp);
                    REPLACEMENTS.reg.push([insertAnimationParser, insertAnimationParserOutp]);

                    if (SETTINGS.graphics.t_high_contrast) {
                        //await announceLoadJob("Initializing high contrast mode...");
                        //let buildContrast = "this.buildFullColorMaterial()";
                        let buildContrast = "contrastMaterial";
                        REPLACEMENTS.reg.push([
                            `switch(null==t&&(t=10),this.built_material=this.finish,this.finish)`,
                            `switch(null==t&&(t=10),this.built_material=this.finish,"${buildContrast}")`
                        ])
                        return;
                    };
                })();

                let starsColor = {r: "0", g: "0", b: "0"};

                function hexToRgb(hex) {
                    const validHex = /^#?([a-fA-F0-9]{6})$/;
                    const match = hex.match(validHex);
                    if (!match) {
                        return { r: 255, g: 255, b: 255 };
                    }
                    hex = match[1];
                    const r = parseInt(hex.slice(0, 2), 16);
                    const g = parseInt(hex.slice(2, 4), 16);
                    const b = parseInt(hex.slice(4, 6), 16);
                    return { r, g, b };
                }

                //await announceLoadJob("Realizing settings...");

                if (SETTINGS.graphics.disable_stars) {
                    REPLACEMENTS.reg.unshift(["this.vcolor[3*l]=(i>>16&255)/255,this.vcolor[3*l+1]=(i>>8&255)/255,this.vcolor[3*l+2]=(255&i)/255", `this.vcolor[3*l]=${starsColor.r},this.vcolor[3*l+1]=${starsColor.g},this.vcolor[3*l+2]=${starsColor.b}`]);
                } else {
                    if (SETTINGS.graphics.change_star_color) {
                        starsColor = hexToRgb(SETTINGS.graphics.change_star_color_value);
                        REPLACEMENTS.reg.unshift(["this.vcolor[3*l]=(i>>16&255)/255,this.vcolor[3*l+1]=(i>>8&255)/255,this.vcolor[3*l+2]=(255&i)/255", `this.vcolor[3*l]=${starsColor.r},this.vcolor[3*l+1]=${starsColor.g},this.vcolor[3*l+2]=${starsColor.b}`]);
                    }
                }

                const qualityTable = {
                    vhigh: "0.35",
                    high: "0.6",
                    normal: "1",
                    native: "" + window.devicePixelRatio,
                    low: "1.5",
                    vlow: "2.1",
                    elow: "3",
                    part: "5",
                }
                REPLACEMENTS.reg.push([
                    `this.OOI01=this.lOlII.settings.check("fullres")?1:Math.sqrt(2)`,
                    `this.OOI01=${qualityTable[SETTINGS.graphics.quality]}`
                ]);


                if (SETTINGS.graphics.high_perf_lasers) {
                    REPLACEMENTS.reg.push(["this.trail_size=this.size-this.core_size", "this.trail_size=Math.max(1, Math.min(this.size-this.core_size,5))"]);
                    REPLACEMENTS.reg.push(["this.OlII0=t,this.size=null!=e?e:2e3,", "this.OlII0=t,this.size=null!=e?e:1e3,"])
                }


                const asteroidTable = {
                    elox: "0",
                    vlow: "1",
                    low: "2",
                    normal: "3",
                    high: "4",
                    vhigh: "5",
                    ehigh: "6"
                }
                if (SETTINGS.graphics.low_poly.asteroids) {
                    REPLACEMENTS.all.push(["THREE.IcosahedronGeometry(1,3)", "THREE.IcosahedronGeometry(1," + asteroidTable[SETTINGS.graphics.low_poly.asteroids] + ")"]);
                }

                if (SETTINGS.graphics.low_poly.mines) {
                    REPLACEMENTS.reg.push([`WeaponModel.MINE_MODEL=MINE_MODEL,WeaponModel.MINE2_MODEL=MINE2_MODEL`
                        , `WeaponModel.MINE_MODEL={"name":"Space Mine","level":1,"model":1,"size":0.7,"specs":{"shield":{"capacity":[30,30],"reload":[1e-30,1e-30]},
                        "generator":{"capacity":[1e-30,1e-30],"reload":[1e-30,1e-30]},"ship":{"mass":100,"speed":[1e-30,1e-30],"rotation":[200,200],"acceleration":[1e+30,1e+30]}},"bodies":{"main":{"section_segments":4,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-75,-30,30,75],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,70,70,0],"height":[0,70,70,0],"propeller":false,"texture":[63,2,63]},"peak0":{"angle":30,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,18,18,10,10,0],"height":[0,10,10,18,18,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"peak1":{"angle":90,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,18,18,10,10,0],"height":[0,10,10,18,18,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"peak2":{"angle":150,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,18,18,10,10,0],"height":[0,10,10,18,18,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"vert0":{"vertical":true,"angle":-30,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"vert1":{"vertical":true,"angle":30,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]}},"typespec":{"name":"Space Mine","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[30,30],"reload":[1e-30,1e-30]},"generator":{"capacity":[1e-30,1e-30],"reload":[1e-30,1e-30]},"ship":{"mass":100,"speed":[1e-30,1e-30],"rotation":[200,200],"acceleration":[1e+30,1e+30]}},"shape":[1.05,1.008,1.031,1.447,1.545,1.545,1.279,0.947,1,1.066,1.053,1.279,1.545,1.545,1.279,1.053,1.066,1,0.947,1.279,1.545,1.545,1.447,1.031,1.008,1.05,1.008,1.031,1.447,1.545,1.545,1.279,0.947,1,1.066,1.053,1.279,1.545,1.545,1.279,1.053,1.066,1,0.947,1.279,1.545,1.545,1.447,1.031,1.008],"lasers":[],"radius":1.545}},
                        WeaponModel.MINE2_MODEL={"name":"Heavy Mine","level":1,"model":1,"size":1.05,"specs":{"shield":{"capacity":[100,100],"reload":[1e-30,1e-30]},"generator":{"capacity":[1e-30,1e-30],"reload":[1e-30,1e-30]},"ship":{"mass":200,"speed":[1e-30,1e-30],"rotation":[150,150],"acceleration":[1e+30,1e+30]}},"bodies":{"main":{"section_segments":4,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-80,-40,0,40,80],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,60,80,60,0],"height":[0,60,80,60,0],"propeller":false,"texture":[63,2,2,63]},"peak0":{"angle":0,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"peak1":{"angle":45,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"peak2":{"angle":90,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"peak3":{"angle":135,"section_segments":3,"offset":{"x":0,"y":0,"z":0},
                        "position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"vert-1":{"vertical":true,"angle":-45,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"vert0":{"vertical":true,"angle":0,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]},"vert1":{"vertical":true,"angle":45,"section_segments":3,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-110,-110,-90,-90,90,90,110,110],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,10,10,20,20,10,10,0],"height":[0,10,10,20,20,10,10,0],"propeller":false,"texture":[4,1,17,4,17,1,4]}},"typespec":{"name":"Heavy Mine","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[100,100],"reload":[1e-30,1e-30]},"generator":{"capacity":[1e-30,1e-30],"reload":[1e-30,1e-30]},"ship":{"mass":200,"speed":[1e-30,1e-30],"rotation":[150,150],"acceleration":[1e+30,1e+30]}},"shape":[2.314,2.317,1.925,1.45,1.666,1.932,2.317,2.317,1.925,1.508,1.536,1.925,2.317,2.317,1.925,1.536,1.508,1.925,2.317,2.317,1.932,1.666,1.45,1.925,2.317,2.314,2.317,1.925,1.45,1.666,1.932,2.317,2.317,1.925,1.508,1.536,1.925,2.317,2.317,1.925,1.536,1.508,1.925,2.317,2.317,1.932,1.666,1.45,1.925,2.317],"lasers":[],"radius":2.317}}`])
                }

                if (SETTINGS.graphics.disable_suns) {
                    REPLACEMENTS.reg.push([",s.O0OOO.scale.set(i,i,i),", ",s.O0OOO.scale.set(0.001,0.001,0.001),"]);
                }

                if (SETTINGS.graphics.disable_explosions) {
                    REPLACEMENTS.reg.push(["explode=function(t,e,i,s,l){","explode=function(t,e,i,s,l){return;"]);
                }

                // if (SETTINGS.graphics.angle_indicator) {
                //     REPLACEMENTS.reg.push()
                // }



                // let renderer = new THREE.WebGLRenderer();
                //             let composer = new THREE.EffectComposer(renderer);

                //             const renderPass = new THREE.RenderPass(scene, camera);
                //             composer.addPass(renderPass);
                //             const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
                //             composer.addPass(bloomPass);

                //             const originalRender = renderer.render;

                //             renderer.render = function(scene, camera) {

                //                 composer.passes[0].scene = scene;
                //                 composer.passes[0].camera = camera;

                //                 composer.render();
                //             };
                //await announceLoadJob("Replacing (reg)...");
                for (let [from, to] of REPLACEMENTS.reg) {
                    //continue;
                    let diff = srcnew.replace(from, to);

                    if (REPLACEMENTS.DIFF_CHECK) {
                        if (diff == srcnew) {
                            log("debug", "Failed to replace from rep.reg: " + from);
                        } else {
                            log("info", "rep.reg Success");
                        }
                    }

                    srcnew = diff;
                }

                //await announceLoadJob("Replacing (all)...");
                for (let [from, to] of REPLACEMENTS.all) {
                    //continue;
                    let diff = srcnew.replaceAll(from, to);

                    if (REPLACEMENTS.DIFF_CHECK) {
                        if (diff == srcnew) {
                            log("debug", "Failed to replace from rep.all: " + from);
                        } else {
                            log("info", "rep.all Success");
                        }
                    }

                    srcnew = diff;
                }

                localStorage.setItem(LS_PREFIX + "CACHED_CODE", srcnew);
            }

            const activateNewSource = async (_callCount = 0) => {
                try {
                    performReplacements();
                    document.open();
                    document.write(srcnew);
                } catch (ex) {
                    log("severe", "Could not activate source. Retrying in 3 seconds. " + _callCount + " retries so far.");
                    srcnew = starSRC;
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(activateNewSource(_callCount + 1));
                            console.log(ex);
                        }, 3000)
                    })
                }
            }
            activateNewSource();

            let domclCallCount = 1;

            const DOMCL = () => {
                try {

                    document.querySelector("#logo > img").src = "https://raw.githubusercontent.com/ndfsaaa/3gr/refs/heads/main/logo%20png.png";
                    // Create a new div element
                    let y_offset = 20;
                    if (localStorage.getItem(LS_PREFIX + "PENDING_SETTINGS") == "1") {
                        let psa = document.createElement('div');
                        document.body.appendChild(psa);
                        psa.outerHTML = `<div id="PS_APPLIED" style="pointer-events: none;position:absolute; left: 20px; top: ${y_offset}px; font-family: var(--def-font); background: rgba(40, 255, 40, .3); color: var(--def-bg-fullcolor); padding: 10px 20px 10px 20px; opacity: 0">
                        All pending settings should now be applied
                        </div>`
                        y_offset += 50;
                        document.querySelector("#PS_APPLIED").animate([
                            {opacity: 0},
                            {opacity: 1}
                        ], {
                            duration: 500,
                            fill: "forwards"
                        })
                        setTimeout(() => {
                            document.querySelector("#PS_APPLIED").animate([
                                {opacity: 1},
                                {opacity: 0}
                            ], {
                                duration: 500,
                                fill: "forwards"
                            })
                        }, 5500);

                        localStorage.setItem(LS_PREFIX + "PENDING_SETTINGS", "0")
                    }

                    if (_hasCrashed) {
                        let psa = document.createElement('div');
                        document.body.appendChild(psa);
                        psa.outerHTML = `<div id="PS_APPLIED2" style="pointer-events: none;position:absolute; left: 20px; top: ${y_offset}px; font-family: var(--def-font); background: rgba(255, 51, 40, 0.3); color: var(--def-bg-fullcolor); padding: 10px 20px 10px 20px; opacity: 0">
                            Client crashed and restarted. Check terminal for more details
                        </div>`
                        document.querySelector("#PS_APPLIED2").animate([
                            {opacity: 0},
                            {opacity: 1}
                        ], {
                            duration: 500,
                            fill: "forwards"
                        })
                        setTimeout(() => {
                            document.querySelector("#PS_APPLIED2").animate([
                                {opacity: 1},
                                {opacity: 0}
                            ], {
                                duration: 500,
                                fill: "forwards"
                            })
                        }, 5500);

                        localStorage.setItem(LS_PREFIX + "PENDING_SETTINGS", "0")
                    }

                    initScanlines();
                    initNoise();
                    initFilters();
                    applyCurrentUIFont();

                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=DM+Serif+Text:ital@0;1&family=Delius&family=DynaPuff:wght@400..700&family=Geo:ital@0;1&family=Iceberg&family=Lexend+Deca:wght@100..900&family=Turret+Road:wght@200;300;400;500;700;800&family=Pixelify+Sans:wght@400..700&family=Shadows+Into+Light&family=Teko:wght@300..700&family=Share+Tech+Mono&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=VT323&display=swap';
                    document.head.appendChild(link);


                    const triggerSettings = document.createElement("i");
                    triggerSettings.className = "sbg";
                    triggerSettings.textContent = "🗲";
                    document.querySelector(".social").appendChild(triggerSettings);

                    const profileSettings = document.createElement('i');
                    profileSettings.className = 'sbg';
                    profileSettings.textContent = `🖻`;
                    document.querySelector(".social").appendChild(profileSettings);


                    triggerSettings.addEventListener("click", clickSettings);
                    profileSettings.addEventListener("click", clickProfile);
                    document.addEventListener("keydown", (e) => {
                        if (e.key === "x" && e.altKey) {
                            window.clickSettings(e);
                        }
                        if (e.key === "c" && e.altKey) {
                            let el = document.querySelector("#overlay > div.social > i.sbg.sbg-gears");
                            if (!el) return log("error", "No sb-gears element");
                            const event = new MouseEvent("click", { bubbles: true, cancelable: true });
                            el.dispatchEvent(event);
                        }
                    })
                } catch (ex) {
                    setTimeout(DOMCL, 500);
                    domclCallCount++;
                    if (domclCallCount > 3) {
                        abortAndReport("Error limit exceeded", "Try reloading and checking your internet connection. If the issue persists, contact me on discord: h.alcyon");
                        setTimeout(() => {
                            location.reload();
                        }, 3000)
                    }
                }

            }

            document.addEventListener("DOMContentLoaded", () => {
                setTimeout(DOMCL, 500);
            })



            document.close();

            function stringToHexColor(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash); // Generate hash
                }
                let color = "#";
                for (let i = 0; i < 3; i++) { // Convert to hex (RGB)
                    let value = (hash >> (i * 8)) & 0xFF;
                    color += ("00" + value.toString(16)).slice(-2);
                }
                return color;
            }

            function hueToHex(hue) {
                hue = hue % 360; // Ensure hue is within 0-360 range
                const f = (n) => {
                    const k = (n + hue / 60) % 6;
                    const value = Math.round(255 * (1 - Math.max(0, Math.min(k, 4 - k, 1))));
                    return value.toString(16).padStart(2, "0"); // Convert to hex
                };
                return `#${f(5)}${f(3)}${f(1)}`; // RGB order
            }

            ;(function initSoundPanel(rt = 5000) {
                let mult = 1.5;
                try {
                    const parent = document.querySelector("body");
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <div style="pointer-events:none;top:0;left:0;position:absolute;width:100vw;height:100dvh;overflow:hidden;display:flex;justify-content:center;align-items:center;">
                        <div style="position:absolute;top:0;left:auto;min-height:100dvh;max-height:100dvh;height:100dvh;aspect-ratio:16/9;max-width:100vw !important;z-index:32523;background:rgba(255,0,0,0.0);">
                            <div id="trigger_messages_panel" style="display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;overflow:visible;gap:10px;font-family:var(--def-font);position:absolute;top:2%;left:24%;height:25%;width:23%;background:rgba(255,255,255,0.0);z-index:2;">
                            </div>
                            <div id="trigger_coords_panel" style="position:absolute;left:3%;top:30%;width:20%;height:5%;display:flex;font-family:var(--def-font);"></div>
                            <input id="trigger_message_input" style="pointer-events:none;position:absolute;top:40%;line-height:1;text-align:center;height:5%;width:100%;font-size:1.15rem;left:0%;font-family:var(--def-font);color:rgba(255,255,255,.8);outline:0;border:0;background:transparent;"></input>
                            <div id="trigger_message_approx" style="pointer-events:none;position:absolute;top:44%;line-height:1;text-align:center;height:5%;width:100%;font-size:0.9rem;left:0%;font-family:var(--def-font);color:rgba(255,255,255,.3);outline:0;border:0;background:transparent;"></div>
                            <div id="trigger_sound_panel" style="position:absolute;display:flex;flex-direction:column;gap:10px;align-items:flex-end;justify-content:flex-start;font-family:var(--def-font);color:white;background:rgba(255,255,255,0.0);top:1.5%;right:21%;width:10%;height:15%;z-index:99;"></div>
                        </div>
                        </div>
                    `
                    parent.appendChild(el.children[0]);

                    const soundPanel = document.querySelector("#trigger_sound_panel");

                    // TODO: polling -> dynamic
                    setInterval(() => {
                        if (window._ships) {
                            //console.log(window._ships)
                        }
                        let messages = window._currentMessages;
                        let parent = document.querySelector("#trigger_messages_panel");
                        if (!parent) return;
                        let els = [];
                        for (let message of messages) {
                            let col = message.target.hue === "white" ? "#FFFFFF" : (typeof message?.target?.hue === "string" ? message.target.hue : hueToHex(message?.target?.hue));
                            let element = null;
                            if (!message.message) {
                                col = "#FF3333"
                                // distance prevented correct display
                                els.push(`
                                <div style="width: 100%; box-sizing:border-box; font-size:1.1rem; font-family: var(--def-font); color: rgba(255,255,255,1); padding: 3px 8px 3px 8px;
                                background-image: linear-gradient(to right, ${col}88, ${col}00)">
                                    <b>User ${sanitizeHTML(message.target.name)}'s message couldn't be delivered due to distance.</b>
                                </div>
                                `)
                            } else {
                                let chunks = message.message.split(window.MESSAGE_STREAM_SYMBOLS.beginStream);
                                if (chunks.length > 1) {
                                    col = "#FF3333"
                                    els.push(`
                                        <div style="width: 100%; box-sizing:border-box; font-size:1.1rem; font-family: var(--def-font); color: rgba(255,255,255,1); padding: 3px 8px 3px 8px;
                                        background-image: linear-gradient(to right, ${col}88, ${col}00)">
                                            User ${sanitizeHTML(message.target.name)}'s message(s) couldn't be delivered due to message overlap
                                        </div>
                                    `)
                                }
                                let msg = chunks[chunks.length - 1];
                                els.push(`
                                    <div style="width: 100%; box-sizing:border-box; font-size:1.1rem; font-family: var(--def-font); color: rgba(255,255,255,1); padding: 3px 8px 3px 8px; background-image: linear-gradient(to right, ${col}22, ${col}00)">
                                        <b style="color:${col}AA">${sanitizeHTML(message.target.name)}${message.type === "system" ? "" : ":"}</b>&nbsp;${sanitizeHTML(msg)}
                                    </div>
                                `)
                            }

                        }
                        parent.innerHTML = els.join('');
                    }, 750);

                    // TODO: polling -> dynamic
                    // setInterval(() => {
                    //     if (window._positions.player.x == 0 && window._positions.player.y == -60) return;
                    //     if (window._positions.player.x == 0 && window._positions.player.y == 0) return;
                    //     if (!window._tr_conn) return;
                    //     let el = document.querySelector(`#trigger_coords_panel`);
                    //     el.innerHTML = `<b style="color:#F9665E">X: ${Math.round(window._positions.player.x)}</b>&nbsp;&nbsp;<b style="color:#799FCB">Y: ${Math.round(window._positions.player.y)}</b>`
                    // }, 1000);

                    setInterval(() => {
                        let sb = window.soundboard;
                        let keys = Object.keys(sb.usage);
                        let els = [];
                        // TODO: rewrite, hella hard to read
                        for (let key of keys) {
                            let target = null, ref = null;
                            if (sb.usage[key]?.rendered) {
                                if (key === "self") {
                                    target = "You";
                                } else {
                                    shipsLoop: for (let ship of window._ships) {
                                        let shipKeys = Object.keys(ship);
                                        for (let shipKey of shipKeys) {
                                            if (!("shipid" in ship[shipKey])) continue;
                                            if (ship[shipKey].shipid == key) {
                                                ref = ship[shipKey];
                                                target = ship[shipKey].name;
                                                break shipsLoop;
                                            }
                                        }
                                    }
                                }
                            }
                            if (!target) continue;
                            let col = key === "self" ? "#FFFFFF" : hueToHex(ref.hue);
                            els.push(`
                                <div style="width:max-content;font-size:1.15rem;line-height:1;padding:3px 10px 3px 10px;background-image:linear-gradient(to right, ${col}00, ${col}33);color:${col}88;">🕬&nbsp;&nbsp;&nbsp;${sanitizeHTML(target)}</div>
                            `)
                        }
                        let monstrosity = els.join('');
                        soundPanel.innerHTML = monstrosity;
                        //console.log(window._ships);
                    }, 750);

                } catch (ex) {
                    log("error", "Failed to set up sound panel, retrying in " + (rt / 1000));
                    console.warn(ex);
                    setTimeout(() => {
                        initSoundPanel(rt * mult);
                    }, rt);
                }
            })();

            ;(function initialize() {
                let lastHoveredPing = "0";
                let hasBegunPingSequence = false;
                document.addEventListener('mouseup', (event) => {
                    if (window._tr_conn && window.hasExecutedLastPing && hasBegunPingSequence && event.button === 1) {
                        let els = document.querySelectorAll('.wheel');
                        for (let el of els) {
                            el.remove();
                        }

                        const lmmp = window.lastMappedMousePosition;
                        let xtype = lmmp.x < 0 ? "-" : "", ytype = lmmp.y < 0 ? "-" : "";
                        let x = Math.round(lmmp.x), y = Math.round(lmmp.y);
                        let message = `${x}|${y}|${lastHoveredPing}`
                        window.executeMessageStream(message, "ping");
                        window.executePing(lmmp.x, lmmp.y, lastHoveredPing);
                        hasBegunPingSequence = false;
                    }
                })
                document.addEventListener('mousedown', (event) => {
                    if (window._tr_conn && window.hasExecutedLastPing && event.button === 1) {
                        // send ping
                        hasBegunPingSequence = true;
                        let insert = document.createElement('div');
                        insert.innerHTML = `<div class="wheel">
                            <div class="q1">
                                <img src="https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_warning.png" class="icon1"></img>
                                <div class="bl1"></div>
                                <div class="sq1"></div>
                            </div>
                            <div class="q2">
                                <img src="https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_attack.png" class="icon2"></img>
                                <div class="bl2"></div>
                                <div class="sq2"></div>
                            </div>
                            <div class="q3">
                                <img src="https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_push.png" class="icon3"></img>
                                <div class="bl3"></div>
                                <div class="sq3"></div>
                            </div>
                            <div class="q4">
                                <img src="https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping_defend.png" class="icon4"></img>
                                <div class="bl4"></div>
                                <div class="sq4"></div>
                            </div>
                            <img src="https://raw.githubusercontent.com/halcyonXT/project-storage/refs/heads/main/ping.png" class="iconcenter"></img>
                            <div class="blcenter"></div>
                            <div class="wcenter"></div>
                        </div>`;


                        insert.children[0].style.top = `calc(${Math.round(event.clientY)}px - 100px)`;
                        insert.children[0].style.left = `calc(${Math.round(event.clientX)}px - 100px)`;

                        document.body.appendChild(insert.children[0]);
                        document.querySelector(".q1").addEventListener("mouseenter", () => {
                            lastHoveredPing = "1";
                        })
                        document.querySelector(".q2").addEventListener("mouseenter", () => {
                            lastHoveredPing = "2";
                        })
                        document.querySelector(".q3").addEventListener("mouseenter", () => {
                            lastHoveredPing = "3";
                        })
                        document.querySelector(".q4").addEventListener("mouseenter", () => {
                            lastHoveredPing = "4";
                        })
                        document.querySelector(".blcenter").addEventListener("mouseenter", (event) => {
                            //event.stopPropagation();
                            lastHoveredPing = "0";
                        })
                    }
                });
                document.addEventListener("keydown", function(event) {
                    if (event.repeat) return;
                    if (window.isMessageFocused && !(event.key === "Enter")) {
                        // console.log(event);
                        let el = document.querySelector("#trigger_message_input");
                        let approx = document.querySelector("#trigger_message_approx");
                        // if (event.key === "Backspace") {
                        //     el.value = el.value.slice(0, -1);
                        // } else {
                        //     let key = event.key;
                        //     if (key.length > 1) return;
                        //     el.value = el.value + key;
                        // }
                        approx.innerText = "Time to send message: " + ((el.value.length * window.messageStreamConfig.interval) / 1000).toFixed(1) + "s"
                    }
                    // window._tr_conn check checks if the socket connection exists, aka if a game has been started
                    if (event.key === "Enter" && window._tr_conn) {
                        if (!window.isMessageFocused) {
                            document.querySelector("#trigger_message_input").focus();
                            window.isMessageFocused = true;
                        } else {
                            let el = document.querySelector("#trigger_message_input");
                            if (!el) return;
                            let processedValue = sanitizeHTML(el.value);
                            let approx = document.querySelector("#trigger_message_approx");
                            processedValue = processedValue.trim();
                            el.value = "";
                            el.blur();
                            approx.innerText = "";
                            if (processedValue.length > 1) {
                                window.executeMessageStream(processedValue);
                            }
                            window.isMessageFocused = false;
                        }
                    }
                });
            })();

            const __div = document.createElement("div"); // Create a new div
            __div.innerHTML = `<div id="auto_remove" style="display:flex;flex-direction:column;position:absolute;text-wrap: nowrap;width:max-content;top:10px;right:10px;padding:10px;font-family:var(--def-font);background:var(--def-bg);backdrop-filter:var(--def-backdrop);font-size:1rem;color:white;z-index:9999;"><div>Creator: <b>Nanoray</b></div><div style="display:flex">Version:&nbsp;<div style="color:${stringToHexColor(__META__.versionName)}"><b>${__META__.versionName}</b></div><small style="opacity:0.65;font-size:.6rem">(${__META__.versionStage} ${__META__.version})</small></div></div>`
            document.body.appendChild(__div.children[0]); // Add it to the page
            document.querySelector("#auto_remove").animate([
                {opacity: 1},
                {opacity: 0}
            ], {
                duration: 1000,
                fill: 'forwards',
                delay: 10000
            })

            let __firstClick = false;
            document.addEventListener("click", function compileAudios() {
                if (__firstClick) {
                    document.removeEventListener("click", compileAudios);
                    return;
                };
                __firstClick = true;
                for (let key of Object.keys(window._tr_audio)) {
                    if (typeof window._tr_audio[key] === "object") continue;
                    fetch(window._tr_audio[key])
                        .then(response => response.blob())
                        .then(blob => {
                            const url = URL.createObjectURL(blob);
                            const audio = new Audio(url);
                            window._tr_audio.compiled[key] = audio;
                        })
                }
            })
// play - default
// afacad - modern
// dm - modern serif
// vt323 - retro
// Geo - retro
// Pixelify Sans - retro
// Lexend Deca - calm
// Delius - cute
// DynaPuff - cute
// Teko - futuristic condensed
// Orbitron - futuristic expanded
// Iceberg - futuristic
// Shadows Into Light - playful
            const STYLES = {
                settingWrapper: "width: 100%; background: rgba(0,0,0,0.3); box-sizing: border-box; padding: 8px 10px 8px 10px;",
                readMore: {
                    wrapper: "height: max-content; margin-top: 6px; width: 100%; cursor: pointer;",
                    summary: "color: var(--def-bg-fullcolor); font-family: var(--def-font); font-size: .75rem; font-weight: 500; opacity: .7",
                    p: "color: var(--def-bg-fullcolor); font-family: var(--def-font); font-size: .7rem; font-weight: 400; opacity: .8; margin: 0; padding: 0; margin-top: 5px;"
                }
            }
            const SECTIONS = {
                "graphics": () => `
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-size: .65em; font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span>
                        <span style="width:100%;display:flex;justify-content: space-between;">
                            <span>Quality:&nbsp;</span>
                            <select id="quality" style="font-family: var(--def-font); background: rgba(255,255,255,.8); color: black; border: 0; outline: 0;" onchange="changeSetting(event)">
                                <option value="vhigh">Very high</option>
                                <option value="high">High</option>
                                <option value="normal">Normal</option>
                                <option value="native">Native</option>
                                <option value="low">Low</option>
                                <option value="vlow">Very low</option>
                                <option value="elow">Extremely low</option>
                                <option value="part">Pixel art</option>
                            </select>
                        </span>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Modifies the pixel density of display to allow higher/lower quality of display
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(160,0,0,.7)">Very high</b>;&nbsp;&nbsp;<b style="background-clip:text !important;background-image:repeating-linear-gradient(35deg, yellow 0px, yellow 5px, gray 5px, gray 10px); color: transparent;">Experimental</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Individual laser lights</span>
                            <div class="checkbox-wrapper-1">
                                <input id="laser_lights" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="laser_lights"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Creates a dynamic light effect for each laser fired. Weaker lasers are excluded to conserve resources. It's recommended to enable this feature only if you have a high-performance computer capable of handling the additional load.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,0,.7)">Low</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Real angle indicator</span>
                            <div class="checkbox-wrapper-1">
                                <input id="angle_indicator" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="angle_indicator"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Creates an indicator that shows you your true angle, as opposed to what the model of your ship is showing.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Full-bright</span>
                            <div class="checkbox-wrapper-1">
                                <input id="full_bright" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="full_bright"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Creates an ambient light in the game in order to remove shadows and other shrouded areas caused by the central point light.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,0,.7)">Low</b>;&nbsp;&nbsp;<b style="background-clip:text !important;background-image:repeating-linear-gradient(35deg, yellow 0px, yellow 5px, gray 5px, gray 10px); color: transparent;">Experimental</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>3D Mode</span>
                            <div class="checkbox-wrapper-1">
                                <input id="_3dmode" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="_3dmode"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Activates the experimental 3D mode of Trigger. Recommended to play using arrow keys. If you disable this mode and it seems like you're stuck on 3D, press F11 twice.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,0,.7)">Low</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Noise overlay</span>
                            <div class="checkbox-wrapper-1">
                                <input id="noise" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="noise"></label>
                            </div>
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Display ECP count</span>
                            <div class="checkbox-wrapper-1">
                                <input id="display_ecp_count" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="display_ecp_count"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Render ECP count in a team mode game, right below player count, denoted by ✪
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,0,.7)">Low</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Ship-centered camera</span>
                            <div class="checkbox-wrapper-1">
                                <input id="centered_camera" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="centered_camera"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Locks the camera exactly onto your ship. Regularly camera's position changes smoothly so it drags behind where you ship is, which this option aims to eliminate.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,0,.7)">Low</b></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Scanlines overlay</span>
                            <div class="checkbox-wrapper-1">
                                <input id="scanlines" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="scanlines"></label>
                            </div>
                        </div>
                        <div style="width: 100%; margin-top: 5px" id="scanlines_opacity_div">
                            <span style="width:100%;display:flex;gap:15px;">
                                <span><b>⤷</b>Scanlines opacity:&nbsp;</span>
                                <span id="scanlines_opacity"><b>${SETTINGS.graphics.scanlines_opacity}</b></span>
                            </span>
                            <div class="slidecontainer">
                                <input oninput="changeSetting(event)" type="range" min="0" max="100" value="${SETTINGS.graphics.scanlines_opacity}" class="slider1" id="scanlines_range">
                            </div>
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b></span>
                        <span style="width:100%;display:flex;justify-content: space-between;">
                            <span>UI font:&nbsp;</span>
                            <select id="ui_font" style="font-family: var(--def-font); background: rgba(255,255,255,.8); color: black; border: 0; outline: 0;" onchange="changeSetting(event)">
                                <option value="Pixelify Sans">Retro 1</option>
                                <option value="VT323">Retro 2</option>
                                <option value="Geo">Retro 3</option>
                                <option value="Play">Default</option>
                                <option value="Afacad Flux">Modern</option>
                                <option value="Space Mono">Modern Mono</option>
                                <option value="DM Serif Text">Modern Serif</option>
                                <option value="Lexend Deca">Calm</option>
                                <option value="Delius">Cute 1</option>
                                <option value="DynaPuff">Cute 2</option>
                                <option value="Teko">Futuristic Condensed</option>
                                <option value="Share Tech Mono">Futuristic Mono</option>
                                <option value="Turret Road">Futuristic 1</option>
                                <option value="Iceberg">Futuristic 2</option>
                                <option value="Shadows Into Light">Playful</option>
                            </select>
                        </span>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                    <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <span style="width:100%;display:flex;justify-content: space-between;">
                            <span>In-game font:&nbsp;</span>
                            <select id="ing_font" style="font-family: var(--def-font); background: rgba(255,255,255,.8); color: black; border: 0; outline: 0;" onchange="changeSetting(event)">
                                <option value="Pixelify Sans">Retro 1</option>
                                <option value="VT323">Retro 2</option>
                                <option value="Geo">Retro 3</option>
                                <option value="Play">Default</option>
                                <option value="Afacad Flux">Modern</option>
                                <option value="Space Mono">Modern Mono</option>
                                <option value="DM Serif Text">Modern Serif</option>
                                <option value="Lexend Deca">Calm</option>
                                <option value="Delius">Cute 1</option>
                                <option value="DynaPuff">Cute 2</option>
                                <option value="Teko">Futuristic Condensed</option>
                                <option value="Share Tech Mono">Futuristic Mono</option>
                                <option value="Turret Road">Futuristic 1</option>
                                <option value="Iceberg">Futuristic 2</option>
                                <option value="Shadows Into Light">Playful</option>
                            </select>
                        </span>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Changes the font used in-game
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Disable stars</span>
                            <div class="checkbox-wrapper-1">
                                <input id="disable_stars" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="disable_stars"></label>
                            </div>
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}" id="change_star_colors_div">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Change star colors</span>
                            <div class="checkbox-wrapper-1">
                                <input id="change_star_colors" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="change_star_colors"></label>
                            </div>
                        </div>
                        <div id="change_star_colors_input_div" style="display: flex; justify-content: space-between; width: 100%; margin-top: 5px">
                            <span><b>⤷</b> Star color hex</span>
                            <input id="change_star_colors_input" oninput="changeSetting(event)" placeholder="FFFFFF" maxlength="6" style="background:var(--def-bg); outline: 0; border: 0; font-family: var(--def-font); color: var(--def-bg-fullcolor)"></input>
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(0,255,255,.7)">None</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>True high contrast</span>
                            <div class="checkbox-wrapper-1">
                                <input id="t_high_contrast" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="t_high_contrast"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Makes all ships materials fullcolor so you can easily discern enemies from allies peripherally.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(255,0,255,.7)">Performace booster</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>High-performance lasers</span>
                            <div class="checkbox-wrapper-1">
                                <input id="high_perf_lasers" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="high_perf_lasers"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Lowers the trail of lasers rendered, lowers the amount of particles on laser impact.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(255,0,255,.7)">Performace booster</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Disable all explosions</span>
                            <div class="checkbox-wrapper-1">
                                <input id="disable_explosions" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="disable_explosions"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Disables every explosion in the game, which includes destroying asteroids, laser impact, ship impact etc.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(255,0,255,.7)">Performace booster</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Disable suns</span>
                            <div class="checkbox-wrapper-1">
                                <input id="disable_suns" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="disable_suns"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Disables the sun that renders in the center of the map.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(255,0,255,.7)">Performace booster</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Asteroid quality</span>
                            <select id="lowpoly_asteroids" style="font-family: var(--def-font); background: rgba(255,255,255,.8); color: black; border: 0; outline: 0;" onchange="changeSetting(event)">
                                <option value="ehigh">Extremely high</option>
                                <option value="vhigh">Very high</option>
                                <option value="high">High</option>
                                <option value="normal">Normal</option>
                                <option value="low">Low</option>
                                <option value="vlow">Very low</option>
                                <option value="elow">Extremely low</option>
                            </select>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Controls the number of vertices required to load an asteroid.
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance: <b style="color: rgba(255,0,255,.7)">Performace booster</b>;&nbsp;&nbsp;<span style="font-family:var(--def-font); color: rgba(255, 140, 140, .6);">Requires a reload</span></span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Low poly mines</span>
                            <div class="checkbox-wrapper-1">
                                <input id="lowpoly_mines" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="lowpoly_mines"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Significantly lowers the amount of faces on heavy and light mines, preventing lag from mine spam.
                            </p>
                        </details>
                    </div>
                `,
                "sound": () => `
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance:&nbsp;<b style="color: rgba(255,255,0,.7)">Moderate</b>&nbsp;</span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Activate filters&nbsp;</span>
                            <div class="checkbox-wrapper-1">
                                <input id="active_filter" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="active_filter"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Activates filters that apply to the entire canvas. Setting filters to their defaults will disable them from rendering, improving the performance of this option. Defaults:<br/>
                                Saturation: 100<br/>
                                Invert: 0<br/>
                                Brightness: 100<br/>
                                Contrast: 100<br/>
                                Hue rotate: 0<br/>
                                Sepia: 0<br/>
                                Grayscale: 0<br/>
                            </p>
                        </details>
                    </div>
                `,
                "filters": () => `
                    <div style="${STYLES.settingWrapper}">
                        <span style="font-family:var(--def-font); color: var(--def-bg-fullcolor); font-size: .65em;">Impact on performance:&nbsp;<b style="color: rgba(255,255,0,.7)">Moderate</b>&nbsp;</span>
                        <div style="display: flex; justify-content: space-between; width: 100%">
                            <span>Activate filters&nbsp;</span>
                            <div class="checkbox-wrapper-1">
                                <input id="active_filter" oninput="changeSetting(event)" class="substituted" type="checkbox" aria-hidden="true" />
                                <label for="active_filter"></label>
                            </div>
                        </div>
                        <details style="${STYLES.readMore.wrapper}">
                            <summary style="${STYLES.readMore.summary}">Read more</summary>
                            <p style="${STYLES.readMore.p}">
                                Activates filters that apply to the entire canvas. Setting filters to their defaults will disable them from rendering, improving the performance of this option. Defaults:<br/>
                                Saturation: 100<br/>
                                Invert: 0<br/>
                                Brightness: 100<br/>
                                Contrast: 100<br/>
                                Hue rotate: 0<br/>
                                Sepia: 0<br/>
                                Grayscale: 0<br/>
                            </p>
                        </details>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Saturation:&nbsp;</span>
                            <span id="sat_slider"><b>${SETTINGS.filters.sat.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="500" value="${SETTINGS.filters.sat.cur}" class="slider1" id="sat_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Invert:&nbsp;</span>
                            <span id="inv_slider"><b>${SETTINGS.filters.inv.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="100" value="${SETTINGS.filters.inv.cur}" class="slider1" id="inv_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Brightness:&nbsp;</span>
                            <span id="bri_slider"><b>${SETTINGS.filters.bri.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="500" value="${SETTINGS.filters.bri.cur}" class="slider1" id="bri_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Contrast:&nbsp;</span>
                            <span id="con_slider"><b>${SETTINGS.filters.con.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="1" max="500" value="${SETTINGS.filters.con.cur}" class="slider1" id="con_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Hue rotate:&nbsp;</span>
                            <span id="hue_slider"><b>${SETTINGS.filters.hue.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="360" value="${SETTINGS.filters.hue.cur}" class="slider1" id="hue_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Sepia:&nbsp;</span>
                            <span id="sep_slider"><b>${SETTINGS.filters.sep.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="100" value="${SETTINGS.filters.sep.cur}" class="slider1" id="sep_range">
                        </div>
                    </div>
                    <div style="${STYLES.settingWrapper}">
                        <span style="width:100%;display:flex;gap:15px;">
                            <span>Grayscale:&nbsp;</span>
                            <span id="gra_slider"><b>${SETTINGS.filters.gra.cur}</b></span>
                        </span>
                        <div class="slidecontainer">
                            <input oninput="changeSetting(event)" type="range" min="0" max="100" value="${SETTINGS.filters.gra.cur}" class="slider1" id="gra_range">
                        </div>
                    </div>
                `
            }
        }
    }

//
    xhr.send();
};
try {
    main();
} catch (ex) {
    if (window._crashCount < window._crashLimit) {
        let t = window._crashCount > 1 ? " times" : " time";
        log("severe", "Crashed " + window._crashCount + t);
        document.open();
        document.write(__DOC_DEF);
        document.close();
        main(true);
    }
    window._crashCount++;
}
