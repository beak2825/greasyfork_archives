// ==UserScript==
// @name         Mute Your Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Masque les mots sensibles sur x.com avec des emojis
// @author       Votre Nom
// @match        *://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512965/Mute%20Your%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/512965/Mute%20Your%20Words.meta.js
// ==/UserScript==
// Utility function to normalize a string by removing accents and converting to lowercase
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Lists of sensitive words by theme with their associated emojis
const themes = {
    sensitivity: {
        mots: [
            "pédophile",
            "violence",
            "sexe",
            "fdp",
            "freakoutparty",
            "xxx",
            "adult",
            "Puff Daddy",
            "Puffy",
            "Diddy",
            "P. Diddy",
            "Sean Combs",
            "agression",
            "intimidation",
            "discrimination"
        ],
        emoji: "💩💩💩" // Emoji for sensitive words (inverted)
    },
    vulgarity: {
        mots: [
            "agression sexuelle",
            "pornographie",
            "porn",
            "nude",
            "érotique",
            "adultes",
            "débauche",
            "viol",
            "exploitation",
            "harcèlement",
            "trafic d'êtres humains",
            "contenu explicite",
            "fantasme",
            "insulte",
            "profanité",
            "grossièreté"
        ],
        emoji: "🌸🌸🌸" // Emoji for vulgar words (inverted)
    },
    violence: {
        mots: [
            "meurtre",
            "assassinat",
            "torture",
            "massacre",
            "guerre",
            "attaque",
            "crime",
            "terrorisme",
            "violence physique",
            "bombe",
            "conflit"
        ],
        emoji: "🍉🍉🍉" // Emoji for violent words (inverted)
    },
    insult: {
        mots: [
            "idiot",
            "imbécile",
            "con",
            "salaud",
            "fou",
            "nul",
            "bâtard",
            "goujat",
            "malpoli",
            "abruti"
        ],
        emoji: "❤️❤️❤️" // Emoji for insults (inverted)
    }
};

// Function to check if a phrase contains a sensitive word and return the corresponding emoji
function contientMotSensible(phrase) {
    const normalizedPhrase = normalizeString(phrase); // Normalize the phrase
    for (let theme in themes) {
        const { mots, emoji } = themes[theme];
        const normalizedMots = mots.map(normalizeString); // Normalize the sensitive words
        const regex = new RegExp(`(${normalizedMots.join("|")})`, "gi");
        if (regex.test(normalizedPhrase)) {
            return emoji; // Return the corresponding emoji for the theme
        }
    }
    return null; // No match found
}

// Function to replace the entire phrase with emojis if a sensitive word is detected
function masquerPhrase(content) {
    const phrases = content.split(/(\.|\?|!)/).map(phrase => phrase.trim());
    return phrases.map(phrase => {
        const emoji = contientMotSensible(phrase);
        return emoji ? emoji : phrase;
    }).join(' ');
}

// Function to process the text of a DOM node
function traiterNoeudTexte(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = masquerPhrase(node.textContent);
    }
}

// Function to traverse the DOM and process text nodes
function parcourirDOM(node) {
    traiterNoeudTexte(node);
    for (let i = 0; i < node.childNodes.length; i++) {
        parcourirDOM(node.childNodes[i]);
    }
}

// Observer for changes in the DOM to mask new content
const observer = new MutationObserver(() => {
    parcourirDOM(document.body);
});

// Configure the observer to monitor changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });

// Mask sensitive words on initial page load
parcourirDOM(document.body);