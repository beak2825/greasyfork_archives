// ==UserScript==
// @name         moPsEk - CSGO MTSL 2 MOD MENU
// @namespace    https://github.com/mopsfl/moPsEk
// @description  moPsEk for CSGO MTSL Version 2
// @author       mopsfl
// @version      0.0.9
// @license      MIT
// @match        *://csgo.mtsl.dk/
// @match        *://csgo.mtsl.dk/esr/
// @icon         https://github.com/mopsfl/moPsEk/raw/main/assets/bulldog--v2.png%202x.png
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/446977/moPsEk%20-%20CSGO%20MTSL%202%20MOD%20MENU.user.js
// @updateURL https://update.greasyfork.org/scripts/446977/moPsEk%20-%20CSGO%20MTSL%202%20MOD%20MENU.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let user = {
        money: 240,
        tickets: 0,
        tokens: 0,
        xp: 0,
        stats: { creation: new Date().getTime() },
        inventory: [],
        upgrades: {},
        achievements: {},
        achievements_collected: {},
        luckyWheelWins: [],
        upgrades: {
            maxClick: null,
            minClick: null,
            passiveIncome: null,
            offlineIncome: null,
            offlineBank: null,
            missionGeneration: null
        },
    },
        temp_inventory = []

    //DATA MANAGMENT
    let S = { "=": "0", "!": "1", "?": "2", $: "3", "%": "4", "&": "5", "/": "6", "\\": "7", "-": "8", "+": "9" },
        w = Object.keys(S).join(""),
        v = { 0: "=", 1: "!", 2: "?", 3: "$", 4: "%", 5: "&", 6: "/", 7: "\\", 8: "-", 9: "+" },
        achievements = {}

    function getUser() { return JSON.parse(y(localStorage.localsave)) }

    function f(e) { return decodeURIComponent(e.split("").map((function (e) { return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2) })).join("")) }

    function y(e) {
        let t = [],
            o = "";
        for (let n = 0; n < e.length; n++) {
            let i = e[n];
            i.match(/[A-Z]/) || w.includes(i) ? (o += w.includes(i) ? S[i] : i.toLowerCase(), t.push(parseInt(o, 36)), o = "") : o += i
        }
        let n, i = {},
            r = String.fromCharCode(t[0]),
            s = r,
            a = [r],
            m = 256;
        for (let e = 1; e < t.length; e++) {
            let o = t[e];
            n = o < 256 ? String.fromCharCode(t[e]) : i[o] ? i[o] : s + r, a.push(n), r = n[0], i[m] = s + r, m++, s = n
        }
        return f(a.join(""))
    }

    function m(e) { return encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, (function (e, t) { return String.fromCharCode("0x" + t) })) }

    function h(e) {
        let t, o = {},
            n = ((e = m(e)) + "").split(""),
            i = [],
            r = n[0],
            s = 256;
        for (let e = 1; e < n.length; e++) t = n[e], null != o[r + t] ? r += t : (i.push(r.length > 1 ? o[r] : r.charCodeAt(0)), o[r + t] = s, s++, r = t);
        return i.push(r.length > 1 ? o[r] : r.charCodeAt(0)), i.map((e => { let t = e.toString(36); return t.substring(0, t.length - 1) + (t[t.length - 1].match(/[0-9]/) ? v[t[t.length - 1]] : t[t.length - 1].toUpperCase()) })).join("")
    }

    function c_mmid(e) { for (var t = "", o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = o.length, i = 0; i < e; i++) t += o.charAt(Math.floor(Math.random() * n)); return t }
    let ic = 0,
        liit = 0;
    var itemNames = ["bravo", "breakout", "brokenfang", "cs20", "csgoweapon", "csgoweapon2", "csgoweapon3", "falchion", "fracture", "gamma", "horizon", "huntsman", "phoenix", "prisma", "prisma2", "spectrum", "spectrum2", "winteroffensive", "snakebite", "gamma2", "clutch", "chroma", "chroma2", "chroma3", "shadow", "collections/assault", "collections/aztec", "collections/dust", "collections/inferno", "collections/militia", "collections/nuke", "collections/office", "collections/vertigo", "vanguard", "revolver", "wildfire", "glove", "hydra", "dangerzone", "shatteredweb", "collections/risingsun", "collections/stmarc", "collections/overpass", "collections/norse", "collections/mirage", "collections/cobblestone", "collections/havoc", "collections/godsandmonsters", "collections/alpha", "collections/ancient", "collections/baggage", "collections/bank", "collections/cache", "collections/canals", "collections/chopshop", "collections/control", "collections/dust2", "collections/dust22021", "collections/inferno2018", "collections/italy", "collections/lake", "collections/mirage2021", "collections/nuke2018", "collections/safehouse", "collections/train", "collections/train2021", "collections/vertigo2021", "riptide", "doppler-phases/phases", "esports2013", "esports2013winter", "esports2014summer", "dreamsandnightmares"];

    function uuidv4() { return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (e => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16))) }
    let loadedAchievements = 0;

    //FUNCTIONS
    function getSaveDataString() {
        const a = h(JSON.stringify(user));
        return a;
    }

    function save(r) {
        localStorage['moPsEk_' + localStorage._moPsEk_uuid] = getSaveDataString();
        localStorage['moPsEk_' + localStorage._moPsEk_uuid + "_tempInv"] = JSON.stringify(temp_inventory);
        if (r) return location.reload();
    }

    function log(message, color) {
        console.info(`%c${message}`, `background-color:black;padding:5px;border-left:solid 4px ${color};color:white`);
    }

    function loadAchievements() {
        fetch("https://raw.githubusercontent.com/mopsfl/moPsEk/main/games/csgo.mtsl.dk/achievements.json").then(response => response.json())
            .then(data => {
                achievements = data;
                log(`Fetched ${Object.keys(achievements).length} achievements.`, "green");
            }).catch(error => {
                log(error);
                nf("Unable to load achievements.", "red")
            })
    }

    function dlFile(e, t, n) {
        if (!(e || t || n)) return log('Could not create file. (Missing attr)', 'red');
        var d = document.createElement('a');
        d.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(n)), d.setAttribute('download', `${e}.${t}`), d.style.display = 'none', document.body.appendChild(d), d.click(), document.body.removeChild(d);
    }

    function byteToSize(e) {
        var t = e;
        return t < 1024 ? t + 'B' : t < 1048576 ? (t / 1024).toFixed(2) + 'KB' : t < 1073741824 ? (t / 1024 * 1024).toFixed(2) + 'MB' : t < 1099511627776 ? (t / 1024 * 1024 * 1024).toFixed(2) + 'GB' : (t / 1024 * 1024 * 1024 * 1024).toFixed(2) + 'TB';
    }

    function wipeData() {
        localStorage.clear()
        return save(true)
    }

    function nf(msg, t, c) {
        if (msg == null) return;
        let notif = document.createElement("div")
        let notifs = document.querySelector(".notifications")
        if (!(notif || notifs)) return log("Unable to create notification", "red")
        notifs.classList.remove("hide")

        notif.classList.add("notification")
        notif.innerHTML = `<div class="notification-message"><span style="${c ? 'color:' + c || 'inherit' : ''}">${!t ? "moPsEk: " : ""}${msg}</span></div><div class="notification-close"></div>`

        notif.querySelector(".notification-close").onclick = () => { notif.remove() }

        notifs.appendChild(notif)
    }

    const injectCSS = css => {
        let el = document.createElement('style');
        el.type = 'text/css';
        el.innerText = css;
        document.head.appendChild(el);
        return el;
    };

    function parseNumbers(string) {
        string = string.toString()
        return string.replace(/\D/gm, "")
    }

    function setData(d) {
        if (!d || d == null) return;

        const a = {
            money: d.money,
            xp: d.xp,
            tokens: d.tokens,
            tickets: d.tickets,
            achievements: d.achievements,
            upgrades: d.upgrades,
        },
            inv = JSON.parse(localStorage['moPsEk_' + localStorage._moPsEk_uuid + "_tempInv"])

        temp_inventory = inv
        temp_inventory.forEach(item => {
            user.inventory.push(item)
        });
        localStorage['moPsEk_' + localStorage._moPsEk_uuid + "_tempInv"] = JSON.stringify([])
        temp_inventory = []

        Object.keys(a.achievements).forEach(achievement => {
            user.achievements[achievement] = true
        })

        Object.keys(a.upgrades).forEach(upgrade => {
            user.upgrades[upgrade] = a.upgrades[upgrade]
        })

        Object.keys(a).forEach(k => {
            if (!['money', 'xp', 'tokens', 'tickets'].includes(k)) return;
            user[k] = a[k]
            log(`Set ${k} to ${a[k]}`, "green")
        })

        console.log(user, a)

        /*Object.keys(a).forEach(b => {
            console.log(`${b} : ${a[b]}`)
            if(!a[b]||a[b]==null) return;
            user[b]=a[b]
            localStorage.localsave = getSaveDataString(user)
        })*/

        localStorage.localsave = getSaveDataString(user)
    }

    //MAIN

    user = getUser();
    loadAchievements()

    function initMenu() {
        const btnClone = document.querySelector('#nav>button').cloneNode(true);
        const pageClone = document.querySelector('.page').cloneNode(true);

        let n = document.createElement('span');
        n.classList.add('_tooltip')
        n.style = 'position: absolute;z-index: 9999;background-color: #333;border: 2px solid #555;min-width: 15px;padding: 4px;border-radius: 3px;max-width: 250px;word-break: break-word;font-family: "Roboto", sans-serif;'
        injectCSS(`
        .upgrade-mph:hover{transform:scale(1)}
        `)
        document.onmousemove = t => {
            n.style.left = t.clientX - n.offsetWidth + 'px'
            n.style.top = t.clientY - n.offsetHeight + 'px'
        }

        document.querySelector('#nav').style.overflow = "scroll"
        document.querySelector('#nav').style.scrollbarWidth = "none"

        pageClone.classList.add('mm');
        pageClone.innerHTML = `
        <h1><img src="https://github.com/mopsfl/moPsEk/raw/main/assets/bulldog--v2.png%202x.png" style="width: 45px;height: auto;" loading="lazy"></img> moPsEk</h1>
        <h1 style="font-size:20px;border-bottom:solid 1px gray"><img src="https://github.com/mopsfl/moPsEk/raw/main/assets/icons8-wrench-100.png" style="width: 17px;height: auto;" loading="lazy"></img> General <span style="font-size:10px; color: #888">Too high values can result in a bugged display. (But still counts)</span></h1>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Money<span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes your current money.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_sm>Set</button><input class="input" placeholder="Money" style="float: right;" data-mm_smi>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set XP<span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes your current XP.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_sxp>Set</button><input class="input" placeholder="XP" style="float: right;" data-mm_sxpi>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Tokens<span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes your current tokens.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_stks>Set</button><input class="input" placeholder="Tokens" style="float: right;" data-mm_stksi>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Tickets<span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes your tickets.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_stk>Set</button><input class="input" placeholder="Tickets" style="float: right;" data-mm_stki>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Money per Click<span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes the amount of money you get per click.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_mpc>Set</button><input class="input" placeholder="Min" style="float: right;" data-mm_mpcmi><input class="input" placeholder="Max" style="float: right;" data-mm_mpcxi>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Passive income <span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Unlocks and finishes all achievements.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_spin>Set</button><input class="input" placeholder="Passive Income" style="float: right;" data-mm_pini>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Set Offline income <span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Changes the amount of the offline income.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_soin>Set</button><input class="input" placeholder="Offline Income" style="float: right;" data-mm_oini>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Give all items<span data-info='Will refresh your page & might cause lags or slow down the page.' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Gives you every item (Knives, Skins, Cases, ...).</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_gait>Give</button>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Give all achievements <span data-info='Will refresh your page!' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Unlocks and finishes all achievements.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_gaac>Give</button>
           </div>
        </div>
        <h1 style="font-size:20px;border-bottom:solid 1px gray"><img src="https://github.com/mopsfl/moPsEk/raw/main/assets/icons8-cloud-folder-90.png" style="width: 17px;height: auto;" loading="lazy"></img> Data Managment</h1>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Export Data</div>
           <div class="upgrade-desc">Export your current client data.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_excd_en>Encoded</button>
               <button class="button" style="float: right;position: static;" data-mm_excd_rw>Raw</button>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Import Data</div>
           <div class="upgrade-desc">Import your saved client data.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_imd_en>Import</button>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Create backup</div>
           <div class="upgrade-desc">Creates a backup of your current data.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_cbup>Create</button>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Load backup</div>
           <div class="upgrade-desc">Loads your recent created backup.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button" style="float: right;position: static;" data-mm_delbup>Load</button>
           </div>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <div class="upgrade-title">Wipe Data <span data-info='Will open/close seperate tabs! Be sure popups are allowed. If it doesnt work, do it again.' style="position: absolute;height: 15px;width: 15px;background: #333;border-radius: 1ex;margin-left: 5px;padding: 1px;"><img style="width: 100%;height: auto;/*! text-align: center;" src='https://raw.githubusercontent.com/mopsfl/moPsEk/main/assets/icons8-exclamation-mark-90.png' alt='!'></img></span></div>
           <div class="upgrade-desc">Wipes all your game data.</div>
           <div style="position: absolute;top: 14px;right: 0;">
               <button class="button red" style="float: right;position: static;" data-mm_wipd>Wipe</button>
           </div>
        </div>
        <h1 style="font-size:20px;border-bottom:solid 1px gray"><img src="https://github.com/mopsfl/moPsEk/raw/main/assets/bulldog--v2.png%202x.png" style="width: 17px;height: auto;" loading="lazy"></img> moPsEk</h1>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <p class="upgrade-desc">Script Version<span style="float:right">v.${GM_info.script.version}</span></p>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <p class="upgrade-desc">Author <span style="float:right; user-select:text">${GM_info.script.author}</span></p>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <p class="upgrade-desc">Automatic Update<span style="float:right; user-select:text">${GM_info.script.options.check_for_updates == true ? "Yes" : "No"}</span></p>
        </div>
        <div class="upgrade upgrade-mph" style="width:95%; position: static; height: 25px; background: none; ">
           <p class="upgrade-desc">Client UUID <span style="float:right; user-select:text">${localStorage._moPsEk_uuid}</span></p>
        </div>
        `;

        document.querySelector('#nav').appendChild(btnClone);
        document.querySelector('#pages').appendChild(pageClone)
        btnClone.innerHTML = '<img src="https://github.com/mopsfl/moPsEk/raw/main/assets/bulldog--v2.png%202x.png"></img> moPsEk';
        btnClone.onclick = () => {
            document.querySelectorAll('.page').forEach(e => e.classList.remove('show'));
            pageClone.classList.add('show');
            document.querySelector('#pages').appendChild(pageClone)
        };

        pageClone.querySelectorAll('[data-info]').forEach(t => {
            const e = t.attributes['data-info'].nodeValue;
            t.onmouseenter = t => {
                document.body.appendChild(n)
                n.innerText = e;
            }
            t.onmouseleave = t => {
                document.body.removeChild(n)
                n.innerText = '';
            };
        });


        //OPTIONS
        const options = {
            setMoney: {
                input: document.querySelector('[data-mm_smi]'),
                btn: document.querySelector('[data-mm_sm]')
            },
            setXP: {
                input: document.querySelector('[data-mm_sxpi]'),
                btn: document.querySelector('[data-mm_sxp]')
            },
            setTokens: {
                input: document.querySelector('[data-mm_stksi]'),
                btn: document.querySelector('[data-mm_stks]')
            },
            setTickets: {
                input: document.querySelector('[data-mm_stki]'),
                btn: document.querySelector('[data-mm_stk]')
            },
            giveAllItems: {
                btn: document.querySelector('[data-mm_gait]')
            },
            exportData: {
                btn: document.querySelector('[data-mm_excd_en]'),
                btn2: document.querySelector('[data-mm_excd_rw]'),
            },
            importData: {
                btn: document.querySelector('[data-mm_imd_en]'),
            },
            wipeData: {
                btn: document.querySelector('[data-mm_wipd]'),
            },
            createBackup: {
                btn: document.querySelector('[data-mm_cbup]'),
            },
            loadBackup: {
                btn: document.querySelector('[data-mm_delbup]'),
            },
            giveAllAchievements: {
                btn: document.querySelector('[data-mm_gaac]')
            },
            setMoneyPerClick: {
                btn: document.querySelector('[data-mm_mpc]'),
                min: document.querySelector('[data-mm_mpcmi]'),
                max: document.querySelector('[data-mm_mpcxi]'),
            },
            setPassiveIncome: {
                btn: document.querySelector('[data-mm_spin]'),
                input: document.querySelector('[data-mm_pini]'),
            },
            setOfflineIncome: {
                btn: document.querySelector('[data-mm_soin]'),
                input: document.querySelector('[data-mm_oini]'),
            }
        };

        //SET MONEY
        options.setMoney.btn.onclick = () => {
            if (!isNaN(options.setMoney.input) || options.setMoney.input == '') return;
            const value = parseInt(options.setMoney.input.value) * 100;
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            user.money = value;
            log(`Set money to ${value}.`, 'green');
            return save(true);
        };

        //SET XP
        options.setXP.btn.onclick = () => {
            const value = parseInt(options.setXP.input.value.replace(/\D/g, ''));
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            user.xp = value;
            log(`Set xp to ${value}.`, 'green');
            return save(true);
        };

        //SET TOKENS
        options.setTokens.btn.onclick = () => {
            const value = parseInt(options.setTokens.input.value.replace(/\D/g, ''));
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            user.tokens = value;
            log(`Set tokens to ${value}.`, 'green');
            return save(true);
        };

        //SET TICKETS
        options.setTickets.btn.onclick = () => {
            const value = parseInt(options.setTickets.input.value.replace(/\D/g, ''));
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            user.tickets = value;
            log(`Set tickets to ${value}.`, 'green');
            return save(true);
        };

        //GIVE ALL ITEMS
        options.giveAllItems.btn.onclick = () => {
            ic = 0
            liit = 0;
            nf("Fetching all packages. This may take a few seconds. (Page will refresh after It's finished)")
            itemNames.forEach(name => {
                ++ic;
                fetch(`https://csgo.mtsl.dk/data/items/${name}.json?v=15`).then(res => res.json()).then(data => {
                    ++liit;
                    Object.keys(data).forEach(async item => {
                        await temp_inventory.push(item)
                    })
                    log(`Fetching package : '${name}'.`, "yellow")
                    if (liit == itemNames.length) {
                        log(`Successfully fetched all packages.`, "green")
                        nf("Successfully fetched all packages.")
                        save(true)
                    }
                })
            })

            log(`Fetching ${ic} packages.`, "yellow")
        };

        //EXPORT DATA
        options.exportData.btn.onclick = () => {
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to encode current client data", "red");

            return dlFile(`mtslData_${localStorage._moPsEk_uuid}.encoded`, "txt", data)
        };
        options.exportData.btn2.onclick = () => {
            const data = getUser()
            if (!data) {
                log("Unable to get current client data", "red");
                nf(`Unable to get current client data.`, null, "red")
                return
            }

            return dlFile(`mtslData_${localStorage._moPsEk_uuid}.raw`, "txt", JSON.stringify(data, null, 2))
        };

        //IMPORT DATA
        options.importData.btn.onclick = () => {
            var input = document.createElement('input');
            input.type = 'file';
            input.click();

            input.onchange = (e) => {
                var reader = new FileReader();
                var file = input.files[0]

                reader.onload = function () {
                    var text = reader.result
                    if (!text) return log(`Unable to get file text from '${file.name}'`, "red")
                    console.log(text)
                    console.log(file)
                    log(`Loaded file '${input.files[0].name}' with an size of ${byteToSize(file.size)}`, "green")

                    try {
                        let json = JSON.parse(text);
                        user = json
                        log("Imported raw data.", "green")
                        nf(`Data imported sucessfully!`)
                        save(true)
                    } catch (e) {
                        try {
                            let json = JSON.parse(y(text))
                            user = json
                            log("Imported encoded data.", "green")
                            nf(`Data imported sucessfully!`)
                            save(true)
                        } catch (e) {
                            log("Unable to decode data file.", "red")
                            nf(`Unable to decode data file!`, null, "red")
                        }
                    }
                };
                reader.readAsText(file);
            }
        };

        //WIPE DATA
        options.wipeData.btn.onclick = () => {
            window.open("/esr")
            window.close()
            GM_setValue(`moPsEk.wipeData`, true)
        }

        //CREATE BACKUP
        options.createBackup.btn.onclick = () => {
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to get current local data", "red")

            GM_setValue(`moPsEk_${localStorage._moPsEk_uuid}.backup`, data)
            nf(`Sucessfully created local backup.`)
            return log("Sucessfully created local backup.", "green")
        }

        //LOAD BACKUP
        options.loadBackup.btn.onclick = () => {
            const data = GM_getValue(`moPsEk_${localStorage._moPsEk_uuid}.backup`)
            if (!data) return log("Unable to get current backup data", "red")

            localStorage['moPsEk_' + localStorage._moPsEk_uuid] = data;

            nf(`Sucessfully loaded local backup!`)
            log("Sucessfully loaded local backup.", "green")
            return save(true)
        }

        //GIVE ALL ACHIEVMENTS
        options.giveAllAchievements.btn.onclick = () => {
            loadedAchievements = 0;
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to get current local data", "red")

            nf("Loading all achievements. (Page will refresh after It's finished)")
            log(`Loading ${Object.keys(achievements).length} achievements.`, "yellow")
            console.log(Object.keys(achievements))

            Object.keys(achievements).forEach(achievement => {
                ++loadedAchievements;
                log(achievement, "yellow")
                user.achievements[achievement] = true
                if (loadedAchievements == Object.keys(achievements).length) {
                    nf("All achievements given successfully.")
                    log("All achievements loaded successfully.", "green")
                    console.log(user)
                    save(true)
                }
            })
        }

        //MONEY PER CLICK
        options.setMoneyPerClick.btn.onclick = () => {
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to get current local data", "red")
            let min = options.setMoneyPerClick.min.value.replace(/\D/g, '')
            let max = options.setMoneyPerClick.max.value.replace(/\D/g, '')
            //const valid = parseInt(Number(min)??Number(max)) ? true : false
            const valid = (parseNumbers(min) || parseNumbers(max)) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            log(`Set clicks per second to [${min} - ${min}]`, "green")

            user.upgrades.minClick = parseInt(min) * 100
            user.upgrades.maxClick = parseInt(max) * 100
            return save(true)
        }

        //SET PASSIVE INCOME
        options.setPassiveIncome.btn.onclick = () => {
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to get current local data", "red")
            let value = options.setPassiveIncome.input.value.replace(/\D/g, '')
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for min|max", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            log(`Set passive income to [${value}]`, "green")

            user.upgrades.passiveIncome = parseInt(value) * 100
            return save(true)
        }

        //SET OFFLINE INCOME
        options.setOfflineIncome.btn.onclick = (e) => {
            const data = getSaveDataString(getUser())
            if (!data) return log("Unable to get current local data", "red")
            let value = options.setOfflineIncome.input.value.replace(/\D/g, '')
            const valid = parseNumbers(value) != '' ? true : false
            if (!valid) {
                log("Unable to parse numbers for offlineIncome", "red")
                nf("This input is invalid.", null, "red")
                return
            };
            log(`Set offline income to [${value}]`, "green")

            user.upgrades.offlineIncome = parseInt(value) * 100
            return save(true)
        }


        //

        //OTHER
        log(`moPsEk v.${GM_info.script.version} initalized sucessfully! Client UUID : ${localStorage._moPsEk_uuid}`, 'green');
        nf(`moPsEk v.${GM_info.script.version} initalized sucessfully!`, true)
    }

    if (GM_getValue(`moPsEk.wipeData`) == true) {
        localStorage.clear()
        window.open("https://csgo.mtsl.dk/")
        GM_setValue(`moPsEk.wipeData`, false)
        window.close()
    }

    //SETUP
    try {
        log(`Initalizing moPsEk v.${GM_info.script.version}`, 'yellow');
        if (!localStorage.getItem('_moPsEk_uuid')) {
            localStorage.setItem('_moPsEk_uuid', uuidv4());
            log('moPsEk client uuid created sucessfully!', 'green');
        }
        if (!localStorage.getItem('moPsEk_' + localStorage._moPsEk_uuid)) {
            localStorage.setItem('moPsEk_' + localStorage._moPsEk_uuid, getSaveDataString(getUser()));
            log('moPsEk client savedata created sucessfully!', 'green');
        }
        if (!localStorage['moPsEk_' + localStorage._moPsEk_uuid + "_tempInv"]) {
            localStorage['moPsEk_' + localStorage._moPsEk_uuid + "_tempInv"] = JSON.stringify([])
        }
        //localStorage.localsave = localStorage['moPsEk_' + localStorage._moPsEk_uuid];
        setData(JSON.parse(y(localStorage['moPsEk_' + localStorage._moPsEk_uuid])))

        window.onload = () => {
            initMenu()
            fetch("https://raw.githubusercontent.com/mopsfl/moPsEk/main/games/csgo.mtsl.dk/compatible_versions.json")
                .then(res => res.json())
                .then(data => {
                    let game_version = document.querySelector("#version-version").innerText

                    if (!data.compatible_versions.includes(game_version)) {
                        log("This game version might not be fully compatible with moPsEk.", "red")
                        alert("moPsEk Info\n\nThis game version might not be fully compatible with moPsEk.\nBe sure it's up to date!")
                    } else log(`Game Version '${game_version}' compatible!`, 'green');

                    if (GM_info.script.options.run_at != "document-start") {
                        GM_setClipboard("// @run-at       document-start")
                        alert("moPsEk Info\n\n@run-at is not set to 'document-start'\nThis might cause the mod menu to not work correctly.\n\nAdd the string in your clipboard to the script.")
                    }
                })
        };
    } catch (e) {
        log("Unable to load moPsEk", "red")
        log(e, "red")
    }
}());