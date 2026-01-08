// ==UserScript==
// @name         Multiplayer Piano Optimizations [Sounds]
// @namespace    https://tampermonkey.net/
// @version      1.7.8
// @description  Play sounds when users join, leave, or mention you in Multiplayer Piano
// @author       zackiboiz, cheezburger0, ccjit
// @match        *://*.multiplayerpiano.com/*
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
// @match        *://piano.mpp.community/*
// @match        *://mpp.7458.space/*
// @match        *://qmppv2.qwerty0301.repl.co/*
// @match        *://mpp.8448.space/*
// @match        *://mpp.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mpp.hyye.xyz/*
// @match        *://lmpp.hyye.xyz/*
// @match        *://mpp.hyye.tk/*
// @match        *://mpp.smp-meow.net/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://mpp.lapishusky.dev/*
// @match        *://staging-mpp.sad.ovh/*
// @match        *://mpp.terrium.net/*
// @match        *://mpp.yourfriend.lv/*
// @match        *://mpp.l3m0ncao.wtf/*
// @match        *://beta-mpp.csys64.com/*
// @match        *://fleetway-mpp.glitch.me/*
// @match        *://mpp.totalh.net/*
// @match        *://mpp.meowbin.com/*
// @match        *://mppfork.netlify.app/*
// @match        *://better.mppclone.me/*
// @match        *://*.openmpp.tk/*
// @match        *://*.mppkinda.com/*
// @match        *://*.augustberchelmann.com/piano/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542502/Multiplayer%20Piano%20Optimizations%20%5BSounds%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/542502/Multiplayer%20Piano%20Optimizations%20%5BSounds%5D.meta.js
// ==/UserScript==

(async () => {
    const dl = GM_info.script.downloadURL || GM_info.script.updateURL || GM_info.script.homepageURL || "";
    const match = dl.match(/greasyfork\.org\/scripts\/(\d+)/);
    if (!match) {
        console.warn("Could not find Greasy Fork script ID in downloadURL/updateURL/homepageURL:", dl);
    } else {
        const scriptId = match[1];
        const localVersion = GM_info.script.version;
        const apiUrl = `https://greasyfork.org/scripts/${scriptId}.json?_=${Date.now()}`;

        fetch(apiUrl, {
            mode: "cors",
            headers: {
                Accept: "application/json"
            }
        }).then(r => {
            if (!r.ok) throw new Error("Failed to fetch Greasy Fork data.");
            return r.json();
        }).then(data => {
            const remoteVersion = data.version;
            if (compareVersions(localVersion, remoteVersion) < 0) {
                new MPP.Notification({
                    "m": "notification",
                    "duration": 15000,
                    "title": "Update Available",
                    "html": "<p>A new version of this script is available!</p>" +
                        `<p style='margin-top: 10px;'>Script: ${GM_info.script.name}</p>` +
                        `<p>Local: v${localVersion}</p>` +
                        `<p>Latest: v${remoteVersion}</p>` +
                        `<a href='https://greasyfork.org/scripts/${scriptId}' target='_blank' style='position: absolute; right: 0;bottom: 0; margin: 10px; font-size: 0.5rem;'>Open Greasy Fork to update?</a>`
                })
            }
        }).catch(err => console.error("Update check failed:", err));
    }

    function compareVersions(a, b) {
        const pa = a.split(".").map(n => parseInt(n, 10) || 0);
        const pb = b.split(".").map(n => parseInt(n, 10) || 0);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
            if ((pa[i] || 0) < (pb[i] || 0)) return -1;
            if ((pa[i] || 0) > (pb[i] || 0)) return 1;
        }
        return 0;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(1000);

    const builtin = [
        {
            NAME: "Default",
            AUTHOR: "Zacki",
            MENTION: "https://files.catbox.moe/f5tzag.mp3",
            JOIN: "https://files.catbox.moe/t3ztlz.mp3",
            LEAVE: "https://files.catbox.moe/kmpz7e.mp3"
        },
        {
            NAME: "PRISM",
            AUTHOR: "ccjit",
            MENTION: "https://file.garden/aHFDYCLeNBLSceNi/Swoosh.wav",
            JOIN: "https://file.garden/aHFDYCLeNBLSceNi/Plug%20In.wav",
            LEAVE: "https://file.garden/aHFDYCLeNBLSceNi/Plug%20Out.wav"
        },
        {
            NAME: "Win7",
            AUTHOR: "cheezburger0",
            MENTION: "https://file.garden/ZXdl6GMYuz15ftGp/Windows%20Notify.wav",
            JOIN: "https://file.garden/ZXdl6GMYuz15ftGp/Windows%20Logon%20Sound.wav",
            LEAVE: "https://file.garden/ZXdl6GMYuz15ftGp/Windows%20Recycle.wav"
        },
        {
            NAME: "Win11",
            AUTHOR: "ccjit",
            MENTION: "https://file.garden/aHFDYCLeNBLSceNi/Win11%20Notify.wav",
            JOIN: "https://file.garden/aHFDYCLeNBLSceNi/Win11%20Plug%20In.wav",
            LEAVE: "https://file.garden/aHFDYCLeNBLSceNi/Win11%20Plug%20Out.wav"
        },
        {
            NAME: "Discord",
            AUTHOR: "ccjit",
            MENTION: "https://file.garden/aHFDYCLeNBLSceNi/Discord%20Ping.mp3",
            JOIN: "https://file.garden/aHFDYCLeNBLSceNi/Discord%20Join.mp3",
            LEAVE: "https://file.garden/aHFDYCLeNBLSceNi/Discord%20Leave.mp3"
        },
        {
            NAME: "Xylo",
            AUTHOR: "cheezburger0",
            MENTION: "https://file.garden/ZXdl6GMYuz15ftGp/mention.wav",
            JOIN: "https://file.garden/ZXdl6GMYuz15ftGp/join.wav",
            LEAVE: "https://file.garden/ZXdl6GMYuz15ftGp/leave.wav"
        },
        {
            NAME: "Skype 1",
            AUTHOR: "ccjit",
            MENTION: "https://file.garden/aHFDYCLeNBLSceNi/SKYPE_IM_ACC_MENTION.flac",
            JOIN: "https://file.garden/aHFDYCLeNBLSceNi/SKYPE_USER_ADDED.flac",
            LEAVE: "https://file.garden/aHFDYCLeNBLSceNi/SKYPE_USER_LEFT.flac"
        },
        {
            NAME: "Piano",
            AUTHOR: "cheezburger0",
            MENTION: "https://file.garden/ZXdl6GMYuz15ftGp/mention-2.wav",
            JOIN: "https://file.garden/ZXdl6GMYuz15ftGp/join-2.wav",
            LEAVE: "https://file.garden/ZXdl6GMYuz15ftGp/leave-2.wav"
        }
    ];
    const defaultName = builtin[0].NAME;

    class SoundManager {
        constructor(version) {
            this.version = version;
            this.GAP_MS = 200;
            this.soundTypes = [];
            this.volumes = {};
            this.lastPlayed = {};
            this.audioCache = {};

            this.loadSoundpacks();
            const sample = Object.values(this.soundpacks)[0] || {};
            this.soundTypes = Object.keys(sample).filter(k => !["NAME", "AUTHOR"].includes(k));
            this.savedVolumes = JSON.parse(localStorage.savedVolumes || "{}");
            this.#loadVolumesForPack();

            const stored = localStorage.currentSoundpack;
            this.currentSoundpack = (stored && this.soundpacks[stored]) ? stored : "";
            this.SOUNDS = this.soundpacks[this.currentSoundpack] || {};

            this.#loadVolumesForPack();
            this.#loadAssetsForCurrentPack();
            this.soundTypes.forEach(type => {
                const $i = $(`#vol-${type}`);
                if ($i.length) {
                    const current = Math.round(this.volumes[type] * 100);
                    $i.val(current);
                }
            });
        }

        #loadVolumesForPack() {
            const pack = localStorage.currentSoundpack;
            this.volumes = this.savedVolumes[pack] || {};
            this.soundTypes.forEach(t => {
                if (this.volumes[t] == null) this.volumes[t] = 1.0;
            });
        }

        #saveVolumesForPack() {
            const pack = localStorage.currentSoundpack;
            this.savedVolumes[pack] = this.volumes;
            localStorage.savedVolumes = JSON.stringify(this.savedVolumes);
        }

        setVolumeForType(type, volume) {
            if (!this.soundTypes.includes(type)) return;
            this.volumes[type] = volume;
            this.#saveVolumesForPack();
            const src = this.SOUNDS[type];
            if (this.audioCache[src]) this.audioCache[src].volume = volume;
        }

        loadSoundpacks() {
            let saved = {};
            let shouldReset = false;

            try {
                saved = JSON.parse(localStorage.savedSoundpacks) || {};
            } catch {
                console.warn("Invalid savedSoundpacks JSON. Resetting saved list.");
                saved = {};
                shouldReset = true;
            }
            this.soundpacks = { ...saved };

            const didInit = localStorage.initializedSoundpacks === "true";
            if ((!didInit && Object.keys(this.soundpacks).length === 0) || shouldReset) {
                builtin.forEach(sp => this.saveSoundpack(sp, true));
                localStorage.initializedSoundpacks = "true";
            }

            localStorage.savedSoundpacks = JSON.stringify(this.soundpacks);
        }

        setCurrentSoundpack(name) {
            if (name && !this.soundpacks[name]) {
                console.warn(`Soundpack "${name}" does not exist.`);
                return;
            }
            this.currentSoundpack = name;
            localStorage.currentSoundpack = name;
            this.SOUNDS = this.soundpacks[name] || {};

            this.#loadVolumesForPack();
            this.soundTypes.forEach(type => {
                const $i = $(`#vol-${type}`);
                if ($i.length) {
                    const current = Math.round(this.volumes[type] * 100);
                    $i.val(current);
                    $(`#vol-percent-${type}`).text(current);
                }
            });

            this.refreshDropdown();
            this.#loadAssetsForCurrentPack();
        }

        saveSoundpack(obj, loading = false) {
            const { NAME, AUTHOR, MENTION, JOIN, LEAVE } = obj;
            if (!NAME || !AUTHOR || !MENTION || !JOIN || !LEAVE) {
                if (!loading) alert("All fields (NAME, AUTHOR, MENTION, JOIN, LEAVE) are required.");
                return;
            }

            for (const [k, sp] of Object.entries(this.soundpacks)) {
                if (sp.MENTION === MENTION && sp.JOIN === JOIN && sp.LEAVE === LEAVE) {
                    if (!loading) alert(`Imported soundpack "${NAME}" is identical to soundpack "${k}".`);
                    return;
                }
            }

            let unique = NAME, i = 1;
            while (this.soundpacks[unique]) unique = `${NAME} (${i++})`;

            this.soundpacks[unique] = {
                NAME: unique,
                AUTHOR,
                MENTION,
                JOIN,
                LEAVE
            };
            localStorage.savedSoundpacks = JSON.stringify(this.soundpacks);
            if (!loading) alert(`Imported soundpack "${unique}".`);
            this.refreshDropdown();
        }

        deleteSoundpack(name) {
            if (!this.soundpacks[name]) return;
            const keys = Object.keys(this.soundpacks);

            if (keys.length <= 1) {
                if (!confirm("This is your last soundpack. Deleting it will leave you with no sounds at all. Are you sure?")) {
                    return;
                }
            }

            delete this.soundpacks[name];
            localStorage.savedSoundpacks = JSON.stringify(this.soundpacks);

            const remain = Object.keys(this.soundpacks);
            const next = remain.length ? remain[0] : "";
            this.setCurrentSoundpack(next);
        }

        #loadAssetsForCurrentPack() {
            this.audioCache = {};
            this.soundTypes.forEach(key => {
                const base = this.SOUNDS[key];
                if (!base) return;
                const sep = base.includes("?") ? "&" : "?";
                const busted = `${base}${sep}_=${Date.now()}`;
                const a = new Audio(busted);
                a.preload = "auto";
                a.volume = this.volumes[key] || 1.0;
                this.audioCache[base] = a;
            });
        }

        playType(type) {
            const src = this.SOUNDS[type];
            if (!src) return;
            const now = Date.now();
            if (!this.lastPlayed[src] || now - this.lastPlayed[src] >= this.GAP_MS) {
                this.lastPlayed[src] = now;
                const orig = this.audioCache[src];
                if (orig) {
                    const c = orig.cloneNode();
                    c.volume = this.volumes[type];
                    c.play().catch(() => { });
                } else {
                    new Audio(src).play().catch(() => { });
                }
            }
        }

        refreshDropdown() {
            const sel = document.querySelector("#soundpack-select");
            if (!sel) return;
            sel.innerHTML = "";

            const noneOpt = document.createElement("option");
            noneOpt.value = "";
            noneOpt.textContent = "No Sounds";
            if (!this.currentSoundpack) noneOpt.selected = true;
            sel.appendChild(noneOpt);

            for (const [k, sp] of Object.entries(this.soundpacks)) {
                const o = document.createElement("option");
                o.value = k;
                o.textContent = `${sp.NAME} [${sp.AUTHOR}]`;
                if (k === this.currentSoundpack) o.selected = true;
                sel.appendChild(o);
            }
        }
    }

    const soundManager = new SoundManager(GM_info.script.version);
    let replyTo = {}, users = {};

    function onMessage(msg) {
        const sender = msg.p ?? msg.sender;
        replyTo[msg.id] = sender._id;
        const me = MPP.client.user._id;
        const mention = msg.a.includes(`@${me}`);
        const replyMention = msg.r && replyTo[msg.r] === me;

        if (
            (mention || replyMention) &&
            (!document.hasFocus() || MPP.client.getOwnParticipant().afk) &&
            !(localStorage.chatMutes?.split(",") ?? []).includes(sender._id)
        ) {
            soundManager.playType("MENTION");
        }
    }

    MPP.client.on("a", onMessage);
    MPP.client.on("dm", onMessage);
    MPP.client.on("ch", ch => {
        users = {};
        ch.ppl.forEach(u => (users[u._id] = u));
    });
    MPP.client.on("p", p => {
        if (!users[p._id]) soundManager.playType("JOIN");
        users[p._id] = p;
    });
    MPP.client.on("bye", u => {
        soundManager.playType("LEAVE");
        delete users[u.p];
    });

    const topOff = document.getElementsByClassName("mpp-hats-button").length ? 84 : 58;
    const $btn = $(`
        <button id="soundpack-btn" class="top-button"
            style="position: fixed; right: 6px; top: ${topOff}px; z-index: 100; padding: 5px;">
            MPP Sounds
        </button>
    `);
    $("body").append($btn);

    const $modal = $(`
        <div id="soundpack-modal" class="dialog" style="height: 400px; margin-top: -200px; width: 550px; margin-left: -300px; display: none;">
            <header>
                <h3>MPP Sounds</h3>
                <hr>
            </header>
            <div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="vertical-align: top;">
                            <fieldset style="border: 1px solid #ffffff; width:270px; padding: 0.25em; margin: 0;">
                                <legend style="font-size: 18px; padding: 0 0.5em; white-space: nowrap;">Select soundpack</legend>
                                <select id="soundpack-select"></select>
                            </fieldset>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">
                            <fieldset style="border: 1px solid #ffffff; width:250px; padding: 0.25em; margin: 0;">
                                <legend style="font-size: 18px; padding: 0 0.5em; white-space: nowrap;">Import from JSON</legend>
                                <input type="file" id="soundpack-file" accept=".json" multiple>
                            </fieldset>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">
                            <fieldset style="border: 1px solid #ffffff; width:250px; padding: 0.25em; margin: 0;">
                                <legend style="font-size: 18px; padding: 0 0.5em; white-space: nowrap;">Manage soundpacks</legend>
                                <button type="button" id="delete-soundpack">Delete current soundpack</button>
                                <button type="button" id="reset-soundpacks">Reset all soundpacks</button>
                            </fieldset>
                        </td>
                    </tr>
                    <tr style="position: relative; left: 300px; top: -247px">
                        <td style="vertical-align: top;">
                            <fieldset style="border: 1px solid #ffffff; width:200px; padding: 0.25em; margin: 0;">
                                <legend style="font-size: 18px; padding: 0 0.5em; white-space: nowrap;">Preview sounds</legend>
                                <button type="button" id="preview-mention">Mention</button>
                                <button type="button" id="preview-join">Join</button>
                                <button type="button" id="preview-leave">Leave</button>
                            </fieldset>
                        </td>
                    </tr>
                    <tr style="position: relative; left: 300px; top: -247px">
                        <td style="vertical-align: top;">
                            <fieldset id="volume-sliders" style="border: 1px solid #ffffff; width:20px; padding: 0.25em; margin: 0;"></fieldset>
                        </td>
                    </tr>
                </table>
            </div>
            <p>
                <button id="soundpack-submit" class="submit">OK</button>
            </p>
            <p>
                <a href="https://github.com/ZackiBoiz/Multiplayer-Piano-Optimizations/tree/main/soundpacks" target="_blank"
                    style="position: absolute; left: 0;bottom: 0; margin: 10px; font-size: 0.5rem;">
                    Find more soundpacks
                </a>
            </p>
        </div>
    `);
    $("#modal #modals").append($modal);

    function hideAllModals() {
        $("#modal #modals > *").hide();
        $("#modal").hide();
    }
    function showModal() {
        if (MPP.chat) MPP.chat.blur();
        hideAllModals();
        soundManager.refreshDropdown();

        const $vol = $("#volume-sliders").html(`<legend style="font-size: 18px; padding: 0 0.5em; white-space: nowrap;">Adjust volume</legend>`);
        soundManager.soundTypes.forEach(type => {
            const cur = Math.round(soundManager.volumes[type] * 100);
            $vol.append(`
                <label>
                    <div class="vol-label" style="font-size: 20px;">
                        ${type}
                    </div>
                    <div class="vol-slider" style="width: 100px;">
                        <input type="range" id="vol-${type}" min="0" max="100" value="${cur}" data-type="${type}"
                            style="width: 100%; height: 100%; background: url(/volume2.png) no-repeat; background-position: 50% 50%; box-shadow: none; border: 0;"/>
                    </div>
                    <div class="vol-label" style="position: relative; right: 50px; bottom: 8px; font-size: 10px; color: #ccc; text-align: right;">
                        Volume: <span id="vol-percent-${type}">${cur}</span>%
                    </div>
                </label>
            `);
        });
        $("#modal").fadeIn(250);
        $modal.show();
    }

    $btn.on("click", showModal);

    document.getElementById("soundpack-select").addEventListener("change", (event) => {
        const sel = event.target.value;

        soundManager.setCurrentSoundpack(sel);
    });
    $(document).on("input", "#volume-sliders input[type=range]", function () {
        const type = $(this).data("type");
        const val = $(this).val();
        const vol = val / 100;
        $(`#vol-percent-${type}`).text(val);
        soundManager.setVolumeForType(type, vol);
    });
    $("#preview-mention").on("click", () => {
        soundManager.playType("MENTION");
    });
    $("#preview-join").on("click", () => {
        soundManager.playType("JOIN");
    });
    $("#preview-leave").on("click", () => {
        soundManager.playType("LEAVE");
    });
    $("#soundpack-file").on("change", function () {
        const files = Array.from(this.files);
        if (!files.length) return;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    soundManager.saveSoundpack(data);
                } catch (err) {
                    alert(`Failed to import "${file.name}".`);
                }
            };
            reader.onerror = () => {
                alert(`Failed to read file "${file.name}".`);
            };
            reader.readAsText(file);
        });

        this.value = "";
    });

    $("#soundpack-submit").on("click", () => {
        const sel = $("#soundpack-select").val();
        soundManager.setCurrentSoundpack(sel);
        hideAllModals();
    });

    $("#delete-soundpack").on("click", () => {
        if (!confirm("Are you sure you want to delete this soundpack?")) return;
        const cur = soundManager.currentSoundpack;
        if (!cur) {
            alert("No soundpack selected to delete.");
            return;
        }
        soundManager.deleteSoundpack(cur);
    });

    $("#reset-soundpacks").on("click", () => {
        if (!confirm("Are you sure you want to reset your soundpacks?")) return;
        if (!confirm("Are you absolutely sure? This will erase all your custom packs.")) return;
        if (!confirm("ARE YOU TOTALLY ABSOLUTELY 100% SURE? THIS IS NOT REVERSABLE!")) return;
        localStorage.savedSoundpacks = "{}";
        localStorage.currentSoundpack = defaultName;
        localStorage.initializedSoundpacks = "false";

        soundManager.loadSoundpacks();
        soundManager.setCurrentSoundpack(defaultName);

        alert("Successfully reset your soundpacks!");
    });
})();