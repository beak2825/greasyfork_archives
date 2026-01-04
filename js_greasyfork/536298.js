// ==UserScript==
// @name         Swear Word Filter For MPP Sites
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Super Swear Word Filtering For The MPP Sites
// @match        https://mpp.8448.space/*
// @match        https://multiplayerpiano.net/*
// @match        https://multiplayerpiano.com/*
// @match        https://mppclone.com/*
// @match        https://better.mppclone.com/*
// @match        https://piano.ourworldofpixels.com/*
// @match        https://mpp.lapishusky.dev/*
// @match        https://mpp.autoplayer.xyz/*
// @grant        none
// @license MIT  I don't give two craps if you post it somewhere else, and I made this myself
// @downloadURL https://update.greasyfork.org/scripts/536298/Swear%20Word%20Filter%20For%20MPP%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/536298/Swear%20Word%20Filter%20For%20MPP%20Sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bannedWords = ["shit", "fuck", "bitch", "boob", "gyat", "jackass", "nigg", "negr", "ped", "cheese pizza", "porn", "cotton", "abortion", "gay", "gae", "faggot", "crap", "damn", "transgender", "tits", "dick", "penis", "pheenis", "anus", "sexu", "explicit", "zaza", "drugs", "pred", "cock", "semen", "cum", "hitm", "homo", "retard", "retart", "club penguin", "ching", "chong", "suck", "excrement", "moist", "hotass", "touch", "rape", "threesome", "cuck", "wtf", "wth", "stfu", "kys", "kms", "monke", "isis", "suicide", "flapjack", "femboy", "imbecile", "vagina", "kill", "rapist", "nudity", "nude", "naked", "oral", "anal", "poop", "shet", "stupid", "shuck", "dicc", "o hell", "horny", "t tr", "shuk", "racist", "niger", "umbag", "breast", "freak"];

    const leetMaps = {
        standard: { "4": "a", "@": "a", "8": "b", "|3": "b", "3": "e", "€": "e", "£": "e", "0": "o", "°": "o", "()": "o",
                    "5": "s", "$": "s", "§": "s", "1": "i", "!": "i", "|": "i", "/": "v", "¥": "y", "`/": "y", "+": "t",
                    "7": "t", "†": "t", "|<": "k", "|{": "k", "|X": "k", "9": "g", "6": "g", "(_+": "g", "><": "x",
                    "%": "x", "*": "x", "|_|": "u", "µ": "u", "|\\|": "n", "^/": "n", "(": "c", "<": "c", "[": "c"},
        extreme: { "4": "A", "@": "A", "Д": "A", "8": "B", "|3": "B", "ß": "B", "3": "E", "€": "E", "Ɛ": "E", "0": "O",
                    "°": "O", "○": "O", "5": "S", "$": "S", "§": "S", "1": "I", "!": "I", "ɪ": "I", "/": "V", "√": "V",
                    "∨": "V", "+": "T", "7": "T", "†": "T", "|<": "K", "|{": "K", "Ж": "K", "9": "G", "6": "G", "₲": "G",
                    "><": "X", "%": "X", "χ": "X", "|_|": "U", "µ": "U", "∪": "U", "|\\|": "N", "И": "N", "₪": "N",
                    "(": "C", "<": "C", "Ͻ": "C"},
        phonetic: { "c": "k", "z": "s", "ph": "f", "x": "ks", "y": "i", "qu": "kw", "ck": "k", "gh": "g", "oo": "u",
                    "sh": "s", "th": "t", "v": "f", "w": "v", "d": "t", "g": "j" },
        numbers: { "1": "l", "2": "z", "3": "e", "4": "a", "5": "s", "6": "g", "7": "t", "8": "b", "9": "p", "0": "o" }
    };

    // 🔄 Normalize text using all leet speak variations
    function normalizeText(text) {
        let normalized = text.toLowerCase();
        Object.values(leetMaps).forEach(map => {
            Object.entries(map).forEach(([leetChar, normalChar]) => {
                normalized = normalized.replaceAll(leetChar, normalChar);
            });
        });
        return normalized;
    }

    function reverseWords(message) {
        return message.split(" ").map(word => word.split("").reverse().join("")).join(" ");
    }

    function removeSpaces(message) {
        return message.replace(/\s+/g, "");
    }

    function logMessageVariations(message) {
        const original = message;
        const leetNormalized = normalizeText(message);
        const reversedWords = reverseWords(leetNormalized);
        const noSpaces = removeSpaces(leetNormalized);
        const noSpacesReversed = reverseWords(noSpaces);
        const reversedNoLeet = reverseWords(message);
        const reversedNoLeetNoSpaces = removeSpaces(reversedNoLeet);
        const noSpacesNoLeet = removeSpaces(message);
    }

    function containsBadWord(message) {
        return bannedWords.some(word => message.includes(word));
    }

    function detectBadMessage(message) {
        return (
            containsBadWord(normalizeText(message)) ||
            containsBadWord(reverseWords(normalizeText(message))) ||
            containsBadWord(removeSpaces(normalizeText(message))) ||
            containsBadWord(reverseWords(removeSpaces(normalizeText(message)))) ||
            containsBadWord(reverseWords(message)) ||
            containsBadWord(removeSpaces(reverseWords(message))) ||
            containsBadWord(removeSpaces(message))
        );
    }

    let originalSendArray = MPP.client.sendArray;
    MPP.client.sendArray = function(arr) {
        for (let msg of arr) {
            if (msg.m === "a") {
                let message = msg.message;

                logMessageVariations(message);

                if (detectBadMessage(message)) {
                    document.querySelector("#chat-input").value = ""; // Clear input box

                    new MPP.Notification({
                        title: "Uh oh! Super error...",
                        text: "It looks like you used obscene or vulgar language. Please refrain from messaging inappropriate things.",
                        duration: 10000,
                        target: "#chat-input"
                    });

                    return; // Stop message from being sent
                }
            }
        }
        return originalSendArray.call(this, arr);
    };

})();
