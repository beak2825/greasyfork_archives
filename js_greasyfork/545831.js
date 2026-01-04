// ==UserScript==
// @name         ZedCity Pirate Immersion Mega Ultimate v6
// @namespace    http://zed.city/
// @version      6.0
// @description  Full pirate conversion: words, money, dates, times, numbers, and context-aware interjections
// @match        *://*.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545831/ZedCity%20Pirate%20Immersion%20Mega%20Ultimate%20v6.user.js
// @updateURL https://update.greasyfork.org/scripts/545831/ZedCity%20Pirate%20Immersion%20Mega%20Ultimate%20v6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Word Translations ---
    const TRANSLATIONS = [
        ["\\bhello\\b", "ahoy"],
        ["\\bhi\\b", "ahoy"],
        ["\\bhey\\b", "ahoy"],
        ["\\bmy\\b", "me"],
        ["\\byour\\b", "yer"],
        ["\\byou\\b", "ye"],
        ["\\bfriend\\b", "matey"],
        ["\\bfriends\\b", "crew"],
        ["\\bman\\b", "buccaneer"],
        ["\\bwoman\\b", "wench"],
        ["\\bboss\\b", "cap'n"],
        ["\\bmoney\\b", "booty"],
        ["\\bgold\\b", "booty"],
        ["\\btown\\b", "port"],
        ["\\bthe\\b", "th'"],
        ["\\bis\\b", "be"],
        ["\\bare\\b", "be"],
        ["\\bam\\b", "be"],
        ["\\bof\\b", "o'"],
        ["\\bfor\\b", "fer"],
        ["\\bto\\b", "t'"],
        ["\\bthis\\b", "this 'ere"],
        ["\\bthat\\b", "that 'ere"],
        ["\\bno\\b", "nay"],
        ["\\byes\\b", "aye"],
        ["\\bdrink\\b", "grog"],
        ["\\bdrinks\\b", "grog"],
        ["\\bsea\\b", "briny deep"],
        ["\\bfood\\b", "grub"],
        ["\\border\\b", "summon"],
        ["\\bkill\\b", "keelhaul"],
        ["\\bplease\\b", "be so kind, matey"],
        ["\\bking\\b", "pirate king"],
        ["\\bqueen\\b", "sea queen"],
        ["\\bcaptain\\b", "cap'n"],
        ["\\bfight\\b", "duel"],
        ["\\btreasure\\b", "booty"],
        ["\\bwork\\b", "plunder"],
        ["\\bsailor\\b", "sea dog"],
        ["\\bship\\b", "galleon"],
        ["\\bhome\\b", "harbor"]
    ];

    // --- Days & Months ---
    const PIRATE_DAYS = {
        "Monday": "Moonday",
        "Tuesday": "Twosday",
        "Wednesday": "Wodensday",
        "Thursday": "Thorsday",
        "Friday": "Fryday",
        "Saturday": "Sat’rday",
        "Sunday": "Sun’s Day"
    };
    const PIRATE_MONTHS = {
        "January": "JanuARRy",
        "February": "FebruARRy",
        "March": "Marrrch",
        "April": "ApRRil",
        "May": "May",
        "June": "June",
        "July": "July",
        "August": "AugARRst",
        "September": "SeptembARR",
        "October": "OctobARR",
        "November": "NovembARR",
        "December": "DecembARR"
    };

    const PIRATE_TIMES = [
        [/\bAM\b/g, "bells before noon"],
        [/\bPM\b/g, "bells after noon"],
        [/\bmidnight\b/gi, "the witchin’ hour"],
        [/\bnoon\b/gi, "high sun"],
        [/\byesterday\b/gi, "yestermorn"],
        [/\btomorrow\b/gi, "on the morrow"],
        [/\b(\d+)\s+hours?\b/gi, "$1 bells"],
        [/\b(\d+)\s+minutes?\b/gi, "$1 minutes"],
        [/\b(\d+)\s+seconds?\b/gi, "$1 heartbeats"],
        [/\b(\d+)\s+days?\b/gi, "$1 suns"],
        [/\bago\b/gi, "aft"]
    ];

    // --- Compile Regex ---
    const compiled = TRANSLATIONS.map(([pat, repl]) => ({
        re: new RegExp(pat, "gi"),
        repl
    }));

    // --- Case Preservation ---
    function preserveCaseReplace(original, replacement) {
        if (original === original.toUpperCase()) return replacement.toUpperCase();
        if (original[0] === original[0].toUpperCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
    }

    // --- Money, Dates, Times ---
    function pirateNumbersAndMoney(str) {
        str = str.replace(/([$£€¥]\s?\d[\d,]*(\.\d+)?)/g, (match) => {
            return match.replace(/[$£€¥]/, "").trim() + " pieces o’ eight";
        });
        str = str.replace(/\bUSD\s?(\d[\d,]*)/gi, "$1 pieces o’ eight");

        for (let day in PIRATE_DAYS) str = str.replace(new RegExp("\\b" + day + "\\b", "g"), PIRATE_DAYS[day]);
        for (let month in PIRATE_MONTHS) str = str.replace(new RegExp("\\b" + month + "\\b", "g"), PIRATE_MONTHS[month]);

        str = str.replace(/\b(\d{4})\b/g, "Year o’ our Lord $1");

        PIRATE_TIMES.forEach(([re, repl]) => str = str.replace(re, repl));

        return str;
    }

    // --- Nautical Conversions ---
    function pirateMeasurements(str) {
        // Distances
        str = str.replace(/(\d+\.?\d*)\s?m\b/g, (_, n) => ((parseFloat(n)/1.8288).toFixed(1) + " fathoms"));
        str = str.replace(/(\d+\.?\d*)\s?km\b/g, (_, n) => ((parseFloat(n)/1.852).toFixed(1) + " nautical miles"));
        // Weights
        str = str.replace(/(\d+\.?\d*)\s?kg\b/g, (_, n) => ((parseFloat(n)/159).toFixed(1) + " barrels"));
        str = str.replace(/(\d+\.?\d*)\s?t\b/g, (_, n) => (n + " burdens"));
        // Speeds
        str = str.replace(/(\d+\.?\d*)\s?m\/s\b/g, (_, n) => ((parseFloat(n)*1.944).toFixed(1) + " knots"));
        return str;
    }

    // --- Context-Aware Pirate Interjections ---
    function getContextAwareInterjection(str) {
        const moneyKeywords = /\b(booty|gold|money|treasure|coins|pieces o’ eight)\b/i;
        const timeKeywords = /\b(hour|time|minute|second|bell|day|morning|noon|midnight|tide)\b/i;
        const dangerKeywords = /\b(danger|fight|battle|attack|kill|enemy|cannon|keelhaul)\b/i;

        if (moneyKeywords.test(str)) {
            return ["Booty ahoy!", "Pieces o’ eight!", "Gold in me eyes!", "Plunder time!", "Riches for all!"][Math.floor(Math.random()*5)];
        } else if (timeKeywords.test(str)) {
            return ["Mark the bell!", "Batten down the hatches!", "High noon approaches!", "The tide waits for no one!", "Heave ho!"][Math.floor(Math.random()*5)];
        } else if (dangerKeywords.test(str)) {
            return ["Fire the cannons!", "To Davy Jones’ locker!", "Scurvy dogs ahead!", "Ready the cutlasses!", "Brace yerselves!"][Math.floor(Math.random()*5)];
        } else {
            return ["Arr!", "Yo-ho-ho!", "Shiver me timbers!", "Avast!", "Blimey!", "By Blackbeard's beard!", "Land ho!", "Splice the mainbrace!"][Math.floor(Math.random()*8)];
        }
    }

    // --- Full Translation ---
    function translateString(str) {
        let result = str;
        compiled.forEach(({ re, repl }) => result = result.replace(re, (m) => preserveCaseReplace(m, repl)));
        result = pirateNumbersAndMoney(result);
        result = pirateMeasurements(result);

        if (Math.random() < 0.10) result += " " + getContextAwareInterjection(result);

        return result;
    }

    // --- Node Translators ---
    function translateTextNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) node.nodeValue = translateString(node.nodeValue);
    }

    function translateElementAttributes(el) {
        ["title", "alt", "placeholder", "aria-label"].forEach(attr => {
            if (el.hasAttribute && el.hasAttribute(attr)) {
                const val = el.getAttribute(attr);
                if (val && val.trim()) el.setAttribute(attr, translateString(val));
            }
        });
        if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.type !== "password") {
            if (el.value && el.value.trim() && !el.matches(":focus")) el.value = translateString(el.value);
        }
    }

    function walkAndTranslate(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node.parentNode) return NodeFilter.FILTER_REJECT;
                    const style = window.getComputedStyle(node.parentNode);
                    if (style && style.display !== "none" && style.visibility !== "hidden") return NodeFilter.FILTER_ACCEPT;
                    return NodeFilter.FILTER_REJECT;
                }
            },
            false
        );
        let node;
        while ((node = walker.nextNode())) translateTextNode(node);
        root.querySelectorAll("*").forEach(translateElementAttributes);
    }

    // --- Initial Translation ---
    translateElementAttributes(document.body);
    walkAndTranslate(document.body);

    // --- Observe for Dynamic Content ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.addedNodes) m.addedNodes.forEach(n => {
                if (n.nodeType === Node.ELEMENT_NODE) {
                    translateElementAttributes(n);
                    walkAndTranslate(n);
                } else if (n.nodeType === Node.TEXT_NODE) {
                    translateTextNode(n);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
