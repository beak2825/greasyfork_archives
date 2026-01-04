// ==UserScript==
// @name Word Occurrence Counter TT-Enhancer FFA
// @namespace FFA
// @author esimaren original, krcanacu & jgonzzz edit
// @description Counts occurrences of specific words within a specific div and displays counts in a popup.
// @match        http://vcc-review-caption-alpha.corp.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @version 1.0.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/515047/Word%20Occurrence%20Counter%20TT-Enhancer%20FFA.user.js
// @updateURL https://update.greasyfork.org/scripts/515047/Word%20Occurrence%20Counter%20TT-Enhancer%20FFA.meta.js
// ==/UserScript==

(function() {
    const targetWords = [
        "nigger",
        "beaner",
        "nigga",
        "coon",
        "negro",
        "dyke",
        "chink",
        "faggy",
        "chinky",
        "faggot",
        "jap",
        "fag",
        "paki",
        "retard",
        "wog",
        "queer",
        "gook",
        "kike",
        "porn",
        "ho",
        "pornography",
        "hoe",
        "porno",
        "wanker",
        "masturbate",
        "masturbation",
        "jerk off",
        "hand job",
        "whore",
        "hooker",
        "stripper",
        "prostitution",
        "prostitute",
        "sex worker",
        "brothel",
        "pimp",
        "sexual assault",
        "molest",
        "sexual abuse",
        "molested",
        "rape",
        "rapist",
        "raped",
        "molest",
        "molested",
        "LSD",
        "crack",
        "meth",
        "acid",
        "meth-head",
        "molly",
        "methamphetamine",
        "ecstacy",
        "heroin",
        "cocaine",
        "MDMA",
        "DMT",
        "fuck",
        "fucked",
        "fucker",
        "fucking",
        "fuckin",
        "orgy",
        "BDSM",
        "dildo",
        "vibrator",
        "lubricant",
        "orgasm",
        "shit",
        "ass",
        "asshole",
        "wank",
        "bitch",
        "piss",
        "bollocks",
        "shitty",
        "bullshit",
        "bastard",
        "slut",
        "harlot",
        "cocksucker",
        "penis",
        "dick",
        "tits",
        "cock",
        "clit",
        "pussy",
        "condom",
        "cum",
        "cunt",
        "balls",
        "semen",
        "twat",
        "weed",
        "opiodis",
        "marihuana",
        "opium",
        "marijuana",
        "pot",
        "cannabis",
        "mary jane",
        "opioid",
        "self-harm",
        "suicide",
        "kill myself",
        "kill herself",
        "kill himself",
        "kill yourself",
        "Morphine",
        "Strip Club",
        "Jackass",
        "Jack",
        "Fetish",
        "sexual harassment"
      ];
    const subTitleDiv = document.getElementById('full-caps');
    if (subTitleDiv) {
        const textNodes = document.createTreeWalker(subTitleDiv, NodeFilter.SHOW_TEXT, null, false);
        let wordCount = {};

        while (textNodes.nextNode()) {
            const textContent = textNodes.currentNode.textContent.toLowerCase();

            targetWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const matches = textContent.match(regex);
                if (matches && matches.length > 0) { // Check for more than 1 occurrences
                    if (!wordCount[word]) {
                        wordCount[word] = 0;
                    }
                    wordCount[word] += matches.length;
                }
            });
        }

        const popupContent = Object.keys(wordCount).map(word => `${word}: ${wordCount[word] || 0}`).join('\n');

        if (popupContent.trim() !== '') { // Display popup only if there's content to show
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '10px';
            popup.style.right = '10px';
            popup.style.backgroundColor = 'white';
            popup.style.padding = '10px';
            popup.style.border = '1px solid black';
            popup.textContent = `Word occurrences:\n${popupContent}`;

            document.body.appendChild(popup);
        }
    }
})();