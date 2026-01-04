// ==UserScript==
// @name         Cookie Clicker Mod Menu
// @namespace    https://github.com/qba210/cookie-clicker-mod-menu
// @version      1.1
// @description  Mod menu for Cookie Clicker
// @author       qba210
// @license      MIT
// @match        *://orteil.dashnet.org/cookieclicker/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAMAAAD26OlUAAAAolBMVEU0DAIKBQhqIg8A3v9DLSpuV1URLT9FARDDkzh+ernp1nP///+QgHeMAACpdiE0FRfBqIyov5EAhZXwFwC7XzaDQBTUwbxBTn1NKiPg4OAXPiCaMxaauDTdtGaVXjnKEwr/fgAAWZ5Sb03Fh1D/ieeWABzUQQ3/zC86gSvtEG/cQWKgANXMs6z67bnhwJalQh9g/1B+WkBJDQPKa0G9jnkAAADDKDlIAAAANnRSTlP//////////////////////////////////////////////////////////////////////wChj04xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGx2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wN1QyMDo1NToxNCswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMDdUMjE6MDA6MjgrMDI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMDdUMjE6MDA6MjgrMDI6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OWRkM2RiMTEtNWViZS01MzQzLWEyOGEtYzAwZDE2MDY3MWFhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MGUxNzYxNGUtOTkxNy1hMzRmLTllYWYtYzM4ZTdlYjY2MWIwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6RjVDMTE2MERDQ0NDMTFFQzlBOThCQzEzREI1QkEzRjUiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIyIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNUMxMTYwQUNDQ0MxMUVDOUE5OEJDMTNEQjVCQTNGNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNUMxMTYwQkNDQ0MxMUVDOUE5OEJDMTNEQjVCQTNGNSIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNWRkNTg4NS1jNjA4LWEwNGEtYTYyMi04OTM4NjNlYjcwNGEiIHN0RXZ0OndoZW49IjIwMjItMDgtMDdUMjE6MDA6MjgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWRkM2RiMTEtNWViZS01MzQzLWEyOGEtYzAwZDE2MDY3MWFhIiBzdEV2dDp3aGVuPSIyMDIyLTA4LTA3VDIxOjAwOjI4KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+nkWItQAAANxJREFUOMut1MEOgjAQBFDaY016bbJfsMde+P9fk3GyLg2obHESPcgjw2LbZd0isv7MEoKq/4Qiqr2rWn16Zxbuq3EZN5aCG0ccg6wFqlWVEAGOQ6+1UtWUVB9b9vQ6dAZEiG9Cp3HIy3glPgw4fotDGwSo95TKEJbPQlB8PPegDTPCWu9AG8AWBZf0DGyNfyGTEgAfRKS1OLRFa7U+ksjJ6rkIUT4uNnmFxXHotFY8hCVnMGyXOCRtDdBKWcvNPAN5pOSMSiKOwQ09B4/Hnh+K8/CYD9U34Mnr+QafGozjyeDrtEIAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449170/Cookie%20Clicker%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/449170/Cookie%20Clicker%20Mod%20Menu.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    class Logger {
        /**
         * 
         * @param {object} msg 
         */
        static LogInfo(msg) {
            console.log("\n[Mod Menu] ", msg);
        }

        /**
         * 
         * @param {object} msg 
         */
        static LogDebug(msg) {
            Logger.LogInfo(msg);
        }
    }

    Logger.LogInfo("Waiting for Game...")
    let gamePromise =  new Promise((res) => {var int = setInterval(() => {if (Game.Achievements) {clearInterval(int); res(Game);}}, 10)});
    await gamePromise;
    Logger.LogInfo("Game loaded!")


    let cheatMenu = document.createElement("div");

    const translations = [
        {
            lang: "pl",
            langName: "Polski",
            hacks: {
                "silent-mode": {
                    name: "Tryb cichy",
                    desc: "Unika wykrycia przez grę hackowania (np. osiągnięcie 'Oszukane ciastka smakują najgorzej')"
                },
                "cookie-spam": {
                    name: "Spamowanie ciastka",
                    desc: "Po przyciśnięciu ciastka samoczynnie zaczyna na nie klikać (kończy po odciśnięciu)"
                },
                "autoclicker": {
                    name: "Autokliker",
                    desc: "Auttomatycznie klika w ciastko"
                },
                "dev-tools": {
                    name: "Menu dewelop.",
                    desc: "Otwiera menu deweloperskie"
                },
                "set-cookies": {
                    name: "Ustaw ilość ciastek",
                    desc: "Pozwala na zmianę ilości ciastek"
                },
                "delete-save": {
                    name: "Usuń zapis"
                },
                "earn-achievement": {
                    name: "Odblokuj osiągnięcie",
                    desc: "Wybierz osiągnięcie z listy i kliknij przycisk aby je zdobyć!"
                },
                "revoke-achievement": {
                    name: "Usuń osiągnięcie",
                    desc: "Wybierz osiągnięcie z listy i kliknij przycisk aby je usunąć!"
                },
                "finish-game": {
                    name: "Ukończ grę",
                    desc: "Kończy grę i odblokowywuje wszystko"
                }
            },
            strings: {
                "dev-tools-confirm": "Jesteś pewien? Tryb cichy nie uchroni Cię od hacków które włączycz w menu deweloperskim.",
                "changes-as-you-type": "Wartość zmienia się jak piszesz",
                "confirm-save-delete": "Jesteś pewien?",
                "set-object-amount": "Ustaw ilość %s"
            }
        },
        {
            lang: "en",
            langName: "English",
            hacks: {
                "silent-mode": {
                    name: "Silent mode",
                    desc: "Avoids detecting hacks by game (ex.: achievement 'Cheated cookies tastes awful')"
                },
                "cookie-spam": {
                    name: "Cookie spam",
                    desc: "After holding the cookie, starts to click it automatically (ends after releasing)"
                },
                "autoclicker": {
                    name: "Autoclicker",
                    desc: "Automatically clicks cookie"
                },
                "dev-tools": {
                    name: "Dev menu",
                    desc: "Opens developer menu"
                },
                "set-cookies": {
                    name: "Set cookie count",
                    desc: "Allows you to change cookie count"
                },
                "delete-save": {
                    name: "Delete save"
                },
                "earn-achievement": {
                    name: "Earn achievement",
                    desc: "Select achievement from list, then click button to get it!"
                },
                "revoke-achievement": {
                    name: "Remove achievement",
                    desc: "Select achievement from list, then click button to remove it!"
                },
                "finish-game": {
                    name: "Finish game",
                    desc: "Finishes game and unlocks everything"
                }
            },
            strings: {
                "dev-tools-confirm": "Are you sure? Silent mode cannot prevent detecting cheats you activate in developer menu.",
                "changes-as-you-type": "Changes as you type",
                "confirm-save-delete": "Are you sure?",
                "set-object-amount": "Set %s amount"
            }
        }
    ]

    let lang = translations.find((lng) => lng.lang === (localStorage.getItem("cheats_lang") ?? "en"));

    document.body.append(cheatMenu);

    cheatMenu.outerHTML = `
    <div id="hack-menu" style="left: 50%; top: 35px;">
        <div id="hack-popup">Hack</div>
        <br>
        <div id="hacks" style="display: none;">
            <div class="hack-list" id="main-hacks">
                <select id="hack-lang-select"></select>
                <div class="hack hack-bool" id="hack-silent-mode"></div>
                <div class="hack hack-bool" id="hack-cookie-spam"></div>
                <div class="hack hack-bool" id="hack-autoclicker"></div>
                <div class="hack hack-btn" id="hack-dev-tools"></div>
                <div class="hack hack-btn" id="hack-set-cookies"></div>
                <div class="hack hack-btn" id="hack-delete-save"></div>
                <div class="hack hack-btn" id="hack-finish-game"></div>
                <div class="hack hack-select" id="hack-earn-achievement"></div>
                <div class="hack hack-select" id="hack-revoke-achievement"></div>
            </div>
            <div class="hack-list" id="objects-hacks">
            </div>
        </div>
    </div>
    <div id="hack-tooltip" style="opacity: 0;left:0;top:0"></div>
    <div id="hack-alert-input" style="opacity: 0;display: none;">
        <div id="hack-alert-input-popup">
            <h1 id="hack-alert-input-popup-title"></h1>
            <div id="hack-alert-input-popup-desc"></div><br>
            <input type="number" id="hack-alert-input-popup-input"/><br>
            <input type="button" id="hack-alert-input-popup-ok" value="OK"/>
        </div>
    </div>
    `;
    
    let styles = document.createElement("style");
    styles.innerText = `
        #hack-menu, #hack-tooltip {
            z-index: 9000000000;
            position: absolute;
            box-sizing: border-box;
        }
        #hack-menu, #hack-menu *:not(#hacks){
            box-sizing: border-box;
        }
        #hack-menu {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: clamp(150px, 225px, 25vw);
        }
        #hacks {
            backdrop-filter: blur(5px);
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding: 10px;
            background-color: rgba(0, 0, 0, .5);
            border-radius: 13px;
            width: 200%;
            box-sizing: content-box;
        }

        .hack-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            width: 100%;
            box-sizing: content-box;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 70vh;
        }
        .hack-list::-webkit-scrollbar-thumb {
            border: 4px solid rgb(10, 87, 242);
            background-color: rgba(10, 87, 242, .2); 
            border-radius: 5px;
            backdrop-filter: blur(3px);
            box-shadow: none;
            transition: background-color .3s linear, border .3s linear
        }
        .hack-list::-webkit-scrollbar-thumb:hover {
            border: 4px solid #00a2ff;
            background-color: rgba(0, 162, 255, .4); 
        }
        .hack-list::-webkit-scrollbar-track {
            border: 4px solid black;
            background-color: transparent;
            border-radius: 5px;
        }

        #hack-popup, .hack {
            padding: 10px;
            font-size: 20px;
            background-color: #00a2ff;
            border: 7px solid black;
            text-align: center;
            width: 100%;
        }
        
        .hack {
            cursor: pointer;
        }
        .hack:active {
            filter: brightness(0.85);
        }

        .hack-bool {
            transition: background-color .3s ease-in;
            background-color: red;
        }
        .hack-bool[on] {
            background-color: green;
        }
        #hack-tooltip {
            position: absolute;
            backdrop-filter: blur(7px);
            filter: blur(0px);
            transition: all .3s ease-out, left 0s ease, top 0s ease;
            background-color: rgba(0, 0, 0, .5);
            color: white;
            transform: translate(15px, 9.5px);
            width: 200px;
            padding: 10px;
            border-radius: 13px;
            pointer-events: none;
        }
        #hack-lang-select {
            z-index: 90000000001;
            background-color: black;
            color: white;
            border-color: white;
            width: 100%
        }
        #hack-lang-select > option {
            color: white;
        }

        #hack-popup {
            transition: opacity .35s ease-out;
        }
        #hack-popup:hover, #hack-popup[open] {
            opacity: 1;
        }
        #hack-popup:not(:hover):not([open]) {
            opacity: .8;
        }

        #hack-alert-input {
            z-index: 9500000000;
            background-color: rgba(0, 0, 0, .5);
            transition: opacity .3s ease-out;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(5px);
        }
        #hack-alert-input-popup {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 50%;
            background-color: black;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-family: verdana;
            text-align: center;
            padding: 20px;
            border: 3px solid white;
            border-radius: 10px;
        }
        #hack-alert-input-popup-title {
            font-size: 2.5em;
        }
        #hack-alert-input-popup-desc {
            font-size: 1.5em;
        }
        #hack-alert-input-popup-ok {
            background-color: #00a2ff;
            border: 4px solid white;
            text-align: center;
            width: 100%;
            height: 50px;
            font-weight: bold;
            cursor: pointer;
        }
        #hack-alert-input-popup-input {
            background-color: black;
            color: white;
            border-color: white;
        }
        .select-in-hack {
            width: 100%;
            border-color: black;
            color: white;
            background-color: black;
        }

    `;
    document.head.append(styles);

    if (!localStorage.getItem("cheats_lang")) {
        localStorage.setItem("cheats_lang", "en");
    }
    
    let $hackmenu = document.getElementById("hack-menu");
    let $hacks = document.getElementById("hacks");
    let $popup = document.getElementById("hack-popup");
    let $tooltip = document.getElementById("hack-tooltip");
    /**@type {HTMLSelectElement} */
    let $langselect = document.getElementById("hack-lang-select");
    let $hack_earnachievement =  document.getElementById("hack-earn-achievement")
    let $hack_revokeachievement =  document.getElementById("hack-revoke-achievement")

    let $inputalert = {
        alert: document.getElementById("hack-alert-input"),
        popup: document.getElementById("hack-alert-input-popup"),
        title: document.getElementById("hack-alert-input-popup-title"),
        desc: document.getElementById("hack-alert-input-popup-desc"),
        input: document.getElementById("hack-alert-input-popup-input"),
        ok: document.getElementById("hack-alert-input-popup-ok")
    }

    let $objecthacks = document.getElementById("objects-hacks")

    let $cookie = document.getElementById("bigCookie");

    dragElement($hackmenu, $popup);

    //boolean hack manager
    $hacks.querySelectorAll(".hack-bool").forEach(node => {
        node.addEventListener("click", (e) => {
            if (node.hasAttribute("on")) {
                node.removeAttribute("on");
            } else {
                node.setAttribute("on", "");
            }
        }) 
    })

    //populate object hacks
    gamePromise.then(() => {
        Object.entries(Game.Objects).forEach(entry => {
            let [key, value] = entry;
            let hack = document.createElement("div");
            hack.className = "hack hack-btn";
            hack.id = `hack-object-amount-${value.bsingle}`;
            hack.setAttribute("lang-string", "set-object-amount");
            hack.setAttribute("supply-val", value.dname);
            hack.setAttribute("key", key);

            hack.onclick = (e) => {
                showInputAlert(hack.innerText, lang.strings["changes-as-you-type"], "number", value.amount, (val) => {
                    value.getFree(+val - value.amount)
                    value.free = 0;
                })
            }

            $objecthacks.append(hack);
        })
        // update language after
        reloadLangs();
    })

    reloadLangs();

    //class loop
    $hackmenu.querySelectorAll(".hack").forEach(_node => {
        /**@type {HTMLElement} */
        let node = _node;

        //tooltip
        node.addEventListener("mousemove", function (e) {
            if (e.target === this) {
                showTooltip(node.id, e.pageX, e.pageY);
            } else if (e.target instanceof HTMLSelectElement) {
                if (e.target.value && e.target.value !== "") {
                    showTooltip(Array.from(this.querySelectorAll("option")).find(opt => opt.value === e.target.value).innerHTML, e.pageX, e.pageY, false);
                }
            } else {
                hideTooltip();
            }
        })
        node.addEventListener("mouseleave", (e) => {
            hideTooltip();
        })
    })

    //menu hide/show
    $popup.addEventListener("click", (e) => {
        if ($hacks.style.display === "none") {
            $hacks.style.display = "";
            $popup.setAttribute("open", "");
        } else {
            $hacks.style.display = "none";
            $popup.removeAttribute("open");
        }
    })

    //add event listener to language select
    $langselect.addEventListener("change", (e) => {
        setLang($langselect.value);
    })

    //select language
    translations.forEach((translation) => {
        let option = document.createElement("option");
        option.value = translation.lang;
        option.innerText = translation.langName;
        $langselect.append(option);
        Logger.LogInfo(`Loaded language ${translation.lang}: ${translation.langName}`);
    })

    //set current language
    $langselect.value = lang.lang;

    // Debug menu hack
    document.getElementById("hack-dev-tools").addEventListener("click", (e) => {
        if (isSilentMode()) {
            if (confirm(lang.strings["dev-tools-confirm"])) {
                Game.OpenSesame();
            }
        } else {
            Game.OpenSesame();
        }
    })

    // Cookie spam hack
    let cookieSpamWorker;

    $cookie.addEventListener("mousedown", (e) => 
    {
        if (document.getElementById("hack-cookie-spam").hasAttribute("on"))
            cookieSpamWorker = setInterval(() => $cookie.dispatchEvent(new Event("click")));
    })

    $cookie.addEventListener("mouseup", (e) => {
        clearInterval(cookieSpamWorker);
    })

    // Autoclicker hack
    let autoclickerWorker;

    document.getElementById("hack-autoclicker").addEventListener("click", (e) => 
    {
        let cookrect = $cookie.getBoundingClientRect();
        if (document.getElementById("hack-autoclicker").hasAttribute("on"))
            autoclickerWorker = setInterval(() => $cookie.dispatchEvent(new Event("click")), 0);
        else 
            clearInterval(autoclickerWorker);
    })

    // Set cookies hack
    document.getElementById("hack-set-cookies").addEventListener("click", (e) => {
        //show input to user
        showInputAlert(lang.hacks["set-cookies"].name, lang.strings["changes-as-you-type"], "number", Game.cookies.toString(), (val) => {
            //earn mode decided by silent mode
            if (isSilentMode()) {
                Game.Earn(-Game.cookies + +val);
            } else {
                Game.cookies = +val;
            }
        })
    });

    // Delete save hack
    document.getElementById("hack-delete-save").addEventListener("click", (e) => {
        //ask user to confirm
        if (confirm(lang.strings["confirm-save-delete"])) {
            //delete save from localstorage
            localStorage.removeItem("CookieClickerGame");
            //after this reload to confirm 
            window.location.reload();
        }
    });
    
    //earn achievement hack
    $hack_earnachievement.addEventListener("click", function (e) {
        //if clicked on select dont gain achevement
        if (e.target !== this) return;
        //gain selected achievement
        Game.Win($hack_earnachievement.querySelector("select").value)
    })
    //revoke achievement hack (simillar to earn)
    $hack_revokeachievement.addEventListener("click", function (e) {
        if (e.target !== this) return;
        Game.RemoveAchiev($hack_revokeachievement.querySelector("select").value)
    })

    gamePromise.then(() => {
        document.getElementById("hack-finish-game").addEventListener("click", (e) => {
            Game.RuinTheFun(true);
        })
    })

    /**
     * @param {string} lang 
     */

    function setLang(lang) {
        localStorage.setItem("cheats_lang", lang);
        reloadLangs();
    }

    function reloadLangs() {
        lang = translations.find((lng) => lng.lang === (localStorage.getItem("cheats_lang") ?? "en"))

        //for every hack
        $hackmenu.querySelectorAll(".hack").forEach(node => {
            //add value
            /**@type {string} */
            let transval = (lang.hacks[node.id.replace("hack-", "")] ?? {name: node.id} ).name;
            if (node.hasAttribute("lang-string")) {
                transval = lang.strings[node.getAttribute("lang-string")];
            }
            if (node.hasAttribute("supply-val")) {
                transval = transval.replace("%s", node.getAttribute("supply-val"));
            }
            node.innerText = (transval ?? node.id ) ?? node.id
        })

        //support for select class
        $hackmenu.querySelectorAll(".hack-select").forEach(node => {
            let select = document.createElement("select");
            select.className = "select-in-hack";
            node.append(select);
        })

        // Earn achevement hack

        //when Game is avaible do
       gamePromise.then(() => {
            // foreach achevement ingame
            Object.entries(Game.Achievements).forEach((entry) => {
                const [key, value] = entry;
                //create option with achievement
                let option = document.createElement("option");
                option.value = key;
                option.innerHTML = value.dname;
                //add it to hack
                $hack_earnachievement.querySelector("select").append(option);
                $hack_revokeachievement.querySelector("select").append(option.cloneNode(true));
            });
        })

        //set current language
        $langselect.value = lang.lang;
    }

    function isSilentMode() {
        return document.getElementById("hack-silent-mode").hasAttribute("on");
    }


    /**
     * 
     * @param {string} id 
     * @param {number} x 
     * @param {number} y 
     */
    function showTooltip(id, x, y, translatable = true) {
        //show only if id have description
        if (translatable) {
            if (!lang.hacks[id.replace("hack-", "")]) return;
            if (!lang.hacks[id.replace("hack-", "")].desc) return;
        }

        $tooltip.innerText = translatable ? lang.hacks[id.replace("hack-", "")].desc ?? "" : id;
        $tooltip.style.left = x.toString() + "px";
        $tooltip.style.top = y.toString() + "px";
        $tooltip.style.opacity = 1;
    }

    function hideTooltip() {
        //$tooltip.innerText = ""; //its needed to be comented because transistion
        $tooltip.style.opacity = 0;
    }

    /**
     * Shows input alert.
     * 
     * @param {string} title 
     * @param {string} desc 
     * @param {string} type 
     * @param {string} value 
     * @param {(value: string) => void} setter 
     */

    function showInputAlert(title, desc, type, value, setter) {
        $inputalert.ok.onclick = () => {
            setTimeout(() => $inputalert.alert.style.display = "none", 301); 
            setter($inputalert.input.value);
            $inputalert.alert.style.opacity = "0";
        }

        $inputalert.title.innerText = title;
        $inputalert.desc.innerText = desc;

        $inputalert.input.type = type;
        $inputalert.input.value = value.toString();
        $inputalert.input.onchange = (e) => setter($inputalert.input.value);

        $inputalert.alert.style.display = "";
        $inputalert.alert.style.opacity = "1";
    }

    /**
     * 
     * @param {HTMLElement} elmnt element to drag 
     * @param {HTMLElement?} dragger element dragging elmnt
     */
    function dragElement(elmnt, dragger) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header") || dragger) {
          // if present, the header is where you move the DIV from:
          (document.getElementById(elmnt.id + "header") ?? dragger).onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
          if (document.getElementById(elmnt.id + "header") || dragger) {
            (document.getElementById(elmnt.id + "header") ?? dragger).setAttribute("dragging", "");
          }else {
            elmnt.setAttribute("dragging", "");
          }
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;

          if (document.getElementById(elmnt.id + "header") || dragger) {
            (document.getElementById(elmnt.id + "header") ?? dragger).removeAttribute("dragging");
          }else {
            elmnt.removeAttribute("dragging");
          }
        }
      }
})();