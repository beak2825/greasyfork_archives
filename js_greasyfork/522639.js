// ==UserScript==
// @name         Podpisy KCS
// @description  nwm co to robi hihi
// @version      1.0
// @author       Marosil
// @license      MIT
// @match        http*://*.margonem.pl/
// @exclude      http*://margonem.*/*
// @exclude      http*://www.margonem.*/*
// @exclude      http*://new.margonem.*/*
// @exclude      http*://forum.margonem.*/*
// @exclude      http*://commons.margonem.*/*
// @exclude      http*://dev-commons.margonem.*/*
// @grant        none
// @namespace https://greasyfork.org/users/867683
// @downloadURL https://update.greasyfork.org/scripts/522639/Podpisy%20KCS.user.js
// @updateURL https://update.greasyfork.org/scripts/522639/Podpisy%20KCS.meta.js
// ==/UserScript==
const Engine = new class Engine {
    constructor() {
        this.customTeleportsDescriptions =
        {
            "Sala Mroźnych Strzał": "FUR",
            "Sala Lodowej Magii": "ART",
            "Sala Mroźnych Szeptów": "ZOR",
            "Przejście Władców Mrozu": "TH",
            "Drzewo Życia p.2": "NYMF",
            "Urwisko Vapora": "TER",
            "Świątynia Hebrehotha - sala ofiary": "VERA",
            "Świątynia Hebrehotha - sala czciciela": "CHAEG",
            "Świątynia Hebrehotha - przedsionek": "PUST",
            "Grobowiec Seta": "SET",
            "Katakumby Gwałtownej Śmierci": "CHOP",
            "Wschodni Mictlan p.8": "P9",
            "Niecka Xiuh Atl": "CIUT",
            "Potępione Zamczysko - sala ofiarna": "SYBA",
            "Zachodni Mictlan p.8": "YAOTL",
            "Złota Góra p.2 sala 1": "TOLY",
            "Źródło Zakorzenionego Ludu": "DEN",
            "Jaskinia Korzennego Czaru p.1 - sala 1": "DEN",
            "Krzaczasta Grota - korytarz": "SILVA",
            "Jaszczurze Korytarze p.4 - sala 3": "PANC",
            "Arachnitopia p.5": "P5",
            "Grota Błotnej Magii": "M.MAD",
            "Sekretne Przejście Kapłanów": "BARB",
            "Teotihuacan - przedsionek": "TEZA",
            "Grota Jaszczurzych Koszmarów p.2": "MAGUA",
            "Katakumby Antycznego Gniewu - przedsionek": "279",
            "Grota Martwodrzewów - przedsionek ": "252",
            "Grota Przebiegłego Tkacza - przedsionek": "225",
            "Pajęczy Las": "225",
            "Grobowiec Przeklętego Krakania - przedsionek": "198",
            "Przepaść Zadumy - przedsionek": "171",
            "Czeluść Chimerycznej Natury - przedsionek": "144",
            "Zmarzlina Amaimona Soplorękiego - przedsionek": "117",
            "Podmokłe leże - przedsionek": "90",
        }
    }
    get interface() {
        if (typeof API != "undefined" && typeof Engine != "undefined" && typeof margoStorage == "undefined") {
            return "ni";
        } else if (typeof dbget == "undefined" && typeof proceed == "undefined") {
            return "si";
        }
    }
    get hero() {
        if (this.interface === 'ni') return window.Engine.hero.d;
        return window.hero;
    }
    get allInit() {
        if (this.interface === 'ni') return window.Engine?.allInit;
        return window.g?.init === 5;
    }
    get items() {
        if (this.interface === 'ni') return window.Engine.items;
        return window.g.item;
    }
    waitForGameInit() {
        return new Promise(resolve => {
            const wait = () => {
                if (this.allInit) {
                    resolve();
                }
                else setTimeout(wait, 20);
            }
            wait();
        })
    }
    getCustomTeleportSelector(id, loc) {
        if (this.interface === 'ni') return document.getElementsByClassName(`item-id-${id}`)[0];
        return document.querySelector(`#item${id}`);
    }
    addItemDivIfMatchedDescription(id, item) {
        for (const description of Object.keys(this.customTeleportsDescriptions)) {
            if (!item.stat.includes(description)) {
                continue;
            }

            const div = document.createElement("div");
            div.className = "amount";
            div.innerHTML = this.customTeleportsDescriptions[description];

            this.waitForGameInit().then(() => this.getCustomTeleportSelector(id, item.loc)?.append(div));

            return true;
        }
    }
}

if (Engine.interface === "ni") {
    const oldNewItem = window.Engine.items.newItem;
    function newItem(id, item) {
        oldNewItem.apply(this, arguments);
        if (!item.stat.includes("custom_teleport") || item.stat.includes("amount")) {
            return;
        }
        Engine.addItemDivIfMatchedDescription(id, item);
    }
    window.Engine.items.newItem = newItem;
}
else if (Engine.interface === "si") {
    let style = document.createElement("style");
    style.innerHTML = `
                    .amount {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        font-size: 2px;
                        color: #fff;
                        text-align: center;
                        line-height: 1.5;
                        text-shadow: 0 0 2px #000;
                        font-weight: bold;
                        text-transform: uppercase;
                        font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
                        user-select: none;
                        pointer-events: none;
                    }
                    `;
    document.head.appendChild(style);

    const oldNewItem = window.newItem;
    function newItem(items) {
        oldNewItem.apply(this, arguments);
        for (const id in items) {
            if (!window.g.item[id].stat.includes("custom_teleport") || window.g.item[id].stat.includes("amount")) {
                continue;
            }
            Engine.addItemDivIfMatchedDescription(id, window.g.item[id]);
        }
    }
    window.newItem = newItem;
}
