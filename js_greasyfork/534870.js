// ==UserScript==
// @name         Replace ArkhamDB scenario pack with set name
// @namespace    http://tampermonkey.net/
// @version      04.05.2025
// @description  Script that replaces scenario pack names with corresponding set names, for those that bought them in the new formula/in one go. Works on card-detail page ex: /card/06279
// @author       mscha99
// @match        https://arkhamdb.com/*
// @match        https://pl.arkhamdb.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534870/Replace%20ArkhamDB%20scenario%20pack%20with%20set%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/534870/Replace%20ArkhamDB%20scenario%20pack%20with%20set%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isPolish = location.hostname.startsWith("pl.");

    // Mapping: subset -> set name
    const subsetToSet_en = {


        // The Dunwich Legacy
        "The Dunwich Legacy": "The Dunwich Legacy",
        "The Miskatonic Museum": "The Dunwich Legacy",
        "The Essex County Express": "The Dunwich Legacy",
        "Blood on the Altar": "The Dunwich Legacy",
        "Undimensioned and Unseen": "The Dunwich Legacy",
        "Where Doom Awaits": "The Dunwich Legacy",
        "Lost in Time and Space": "The Dunwich Legacy",

        // The Path to Carcosa
        "The Path to Carcosa": "The Path to Carcosa",
        "Echoes of the Past": "The Path to Carcosa",
        "The Unspeakable Oath": "The Path to Carcosa",
        "A Phantom of Truth": "The Path to Carcosa",
        "The Pallid Mask": "The Path to Carcosa",
        "Black Stars Rise": "The Path to Carcosa",
        "Dim Carcosa": "The Path to Carcosa",

        // The Forgotten Age
        "The Forgotten Age": "The Forgotten Age",
        "Threads of Fate": "The Forgotten Age",
        "The Boundary Beyond": "The Forgotten Age",
        "Heart of the Elders": "The Forgotten Age",
        "The City of Archives": "The Forgotten Age",
        "The Depths of Yoth": "The Forgotten Age",
        "Shattered Aeons": "The Forgotten Age",

        // The Circle Undone
        "The Circle Undone": "The Circle Undone",
        "The Secret Name": "The Circle Undone",
        "The Wages of Sin": "The Circle Undone",
        "For the Greater Good": "The Circle Undone",
        "Union and Disillusion": "The Circle Undone",
        "In the Clutches of Chaos": "The Circle Undone",
        "Before the Black Throne": "The Circle Undone",

        // The Dream-Eaters
        "The Dream-Eaters": "The Dream-Eaters",
        "The Search for Kadath": "The Dream-Eaters",
        "A Thousand Shapes of Horror": "The Dream-Eaters",
        "Dark Side of the Moon": "The Dream-Eaters",
        "Point of No Return": "The Dream-Eaters",
        "Where the Gods Dwell": "The Dream-Eaters",
        "Weaver of the Cosmos": "The Dream-Eaters",

        // The Innsmouth Conspiracy
        "The Innsmouth Conspiracy": "The Innsmouth Conspiracy",
        "In Too Deep": "The Innsmouth Conspiracy",
        "Devil Reef": "The Innsmouth Conspiracy",
        "Horror in High Gear": "The Innsmouth Conspiracy",
        "A Light in the Fog": "The Innsmouth Conspiracy",
        "The Lair of Dagon": "The Innsmouth Conspiracy",
        "Into the Maelstrom": "The Innsmouth Conspiracy",



        // Investigator Starter Decks
        "Nathaniel Cho": "Nathaniel Cho Starter Decks",
        "Harvey Walters": "Harvey Walters Starter Decks",
        "Winifred Habbamock": "Winifred Habbamock Starter Decks",
        "Jacqueline Fine": "Jacqueline Fine Starter Decks",
        "Stella Clark": "Stella Clark Starter Decks",

        // Side Stories
        "Curse of the Rougarou": "Side Stories",
        "Carnevale of Horrors": "Side Stories",
        "The Labyrinths of Lunacy": "Side Stories",
        "Guardians of the Abyss": "Side Stories",
        "Murder at the Excelsior Hotel": "Side Stories",
        "The Blob That Ate Everything": "Side Stories",
        "War of the Outer Gods": "Side Stories",
        "Machinations Through Time": "Side Stories",
        "Fortune and Folly": "Side Stories",
        "The Blob That Ate Everything ELSE!": "Side Stories",
        "The Midwinter Gala": "Side Stories",

        // Promotional (Books, etc.)
        "Hour of the Huntress": "Promotional",
        "The Dirge of Reason": "Promotional",
        "Ire of the Void": "Promotional",
        "The Deep Gate": "Promotional",
        "To Fight the Black Wind": "Promotional",
        "Blood of Baalshandor": "Promotional",
        "Dark Revelations": "Promotional",
        "Promo": "Promotional",

        // Parallel/Standalone Print-and-Play
        "Read or Die": "Parallel",
        "All or Nothing": "Parallel",
        "Bad Blood": "Parallel",
        "By the Book": "Parallel",
        "Red Tide Rising": "Parallel",
        "On the Road Again": "Parallel",
        "Laid to Rest": "Parallel",
        "Path of the Righteous": "Parallel",
        "Relics of the Past": "Parallel",
        "Hunting for Answers": "Parallel",
        "Pistols and Pearls": "Parallel",
        "Aura of Faith": "Parallel",
    };

    const subsetToSet_pl = {
        // Dziedzictwo Dunwich
        "Dziedzictwo Dunwich": "Dziedzictwo Dunwich",
        "Muzeum Miskatonic": "Dziedzictwo Dunwich",
        "Essex County Express": "Dziedzictwo Dunwich",
        "Krew na ołtarzu": "Dziedzictwo Dunwich",
        "Bezwymiarowe i niewidzialne": "Dziedzictwo Dunwich",
        "Gdzie czeka zagłada": "Dziedzictwo Dunwich",
        "Zagubieni w czasie i przestrzeni": "Dziedzictwo Dunwich",

        // Szlak do Carcosy
        "Szlak do Carcosy": "Szlak do Carcosy",
        "Echa przeszłości": "Szlak do Carcosy",
        "Nieopisywalna przysięga": "Szlak do Carcosy",
        "Widmo Prawdy": "Szlak do Carcosy",
        "Blada Maska": "Szlak do Carcosy",
        "Noc czarnych gwiazd": "Szlak do Carcosy",
        "Mgły Carcosy": "Szlak do Carcosy",

        // Zapomniana era
        "Zapomniana era": "Zapomniana era",
        "Nici losu": "Zapomniana era",
        "Poza granicami czasu": "Zapomniana era",
        "Serce starszych": "Zapomniana era",
        "Miasto archiwów": "Zapomniana era",
        "Czeluście Yoth": "Zapomniana era",
        "Rozbita wieczność": "Zapomniana era",

        // Przerwany krąg
        "Przerwany krąg": "Przerwany krąg",
        "Sekretne imię": "Przerwany krąg",
        "Zapłata za grzechy": "Przerwany krąg",
        "Dla większego dobra": "Przerwany krąg",
        "Zjednoczenie i zwątpienie": "Przerwany krąg",
        "W szponach chaosu": "Przerwany krąg",
        "Przed Czarnym Tronem": "Przerwany krąg",

        // Pożeracze snów
        "Pożeracze snów": "Pożeracze snów",
        "Poszukiwania Kadath": "Pożeracze snów",
        "Koszmar tysiąca wcieleń": "Pożeracze snów",
        "Ciemna strona Księżyca": "Pożeracze snów",
        "Nie ma odwrotu": "Pożeracze snów",
        "Gdzie mieszkają bogowie": "Pożeracze snów",
        "Tkaczka kosmosu": "Pożeracze snów",

        // Zmowa nad Innsmouth
        "Zmowa nad Innsmouth": "Zmowa nad Innsmouth",
        "Zbyt głęboko": "Zmowa nad Innsmouth",
        "Diabelska rafa": "Zmowa nad Innsmouth",
        "Na wysokich obrotach": "Zmowa nad Innsmouth",
        "Światło pośród mgieł": "Zmowa nad Innsmouth",
        "Leże Dagona": "Zmowa nad Innsmouth",
        "W głąb wiru": "Zmowa nad Innsmouth",



        // Talie początkowe
        "Nathaniel Cho": "Talie początkowe badaczy Nathaniel Cho",
        "Harvey Walters": "Talie początkowe badaczy Harvey Walters",
        "Winifred Habbamock": "Talie początkowe badaczy Winifred Habbamoc",
        "Jacqueline Fine": "Talie początkowe badaczy Jacqueline Fine",
        "Stella Clark": "Talie początkowe badaczy Stella Clark",

        // Historie poboczne
        "Klątwa Rougarou": "Historie poboczne",
        "Karnawał koszmarów": "Historie poboczne",
        "Labirynty obłędu": "Historie poboczne",
        "Strażnicy Otchłani": "Historie poboczne",
        "Morderstwo w Hotelu Excelsior": "Historie poboczne",
        "Śluz, który pożarł wszystko": "Historie poboczne",
        "Wojna Zewnętrznych Bogów": "Historie poboczne",
        "Machinacje w czasie": "Historie poboczne",
        "Szczęście i szaleństwo": "Historie poboczne",



        // Badacze z równoległego świata
        "Przeczytaj lub zgiń": "Badacze z równoległego świata",
        "Wszystko albo nic": "Badacze z równoległego świata",
        "Zła krew": "Badacze z równoległego świata",
        "W majestacie prawa": "Badacze z równoległego świata",
        "Red Tide Rising": "Badacze z równoległego świata",
        "On the Road Again": "Badacze z równoległego świata",
        "Laid to Rest": "Badacze z równoległego świata",
        "Path of the Righteous": "Badacze z równoległego świata",
        "Relics of the Past": "Badacze z równoległego świata",
        "Hunting for Answers": "Badacze z równoległego świata",
        "Pistols and Pearls": "Badacze z równoległego świata",
        "Aura of Faith": "Badacze z równoległego świata"
    };

    const subsetToSet = isPolish ? subsetToSet_pl : subsetToSet_en;

    function waitForElement(selector, callback, timeout = 10000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
                console.warn("Timeout: Element not found:", selector);
            }
        }, 200);
    }

    waitForElement("ul.pager", (pager) => {
        const items = pager.querySelectorAll("li");
        if (items.length >= 2) {
            const anchor = items[1].querySelector("a");
            const subsetName = anchor?.textContent?.trim();
            const setName = subsetToSet[subsetName];
            if (setName) {
                items[1].innerHTML = `<span style="font-weight: bold; color: purple;">${setName}</span>`;
            } else {
                console.warn("No mapping found for:", subsetName);
            }
        }
    });

})();
