// ==UserScript==
// @name        🔞 Uncensored JAV Titles 🔞
// @description Replace JAV Censored Words in titles by their Uncensored Version
// @version     1.0.3
// @match       *://*/*
// @namespace   https://gitlab.com/breatfr
// @homepageURL https://gitlab.com/breatfr/uncensored-jav-titles
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @icon        https://gitlab.com/uploads/-/system/project/avatar/66950562/jav.jpg
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @author      BreatFR
// @copyright   2025, BreatFR (https://breat.fr)
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/526378/%F0%9F%94%9E%20Uncensored%20JAV%20Titles%20%F0%9F%94%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/526378/%F0%9F%94%9E%20Uncensored%20JAV%20Titles%20%F0%9F%94%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dictionnaire des mots à remplacer
    const dictionary = {
        "A**e": "Abuse",
        "A***d": "Abused",
        "A****p": "Asleep",
        "A****t": "Assault",
        "A****ed": "Assaulted",
        "A****ing": "Assaulting",
        "B** Up": "Beat Up",
        "B**d": "Bled",
        "B****ing": "Bleeding",
        "B***d": "Blood",
        "B****lity": "Brutality",
        "C*****ng": "Cheating",
        "C***d": "Child",
        "C*******d": "Childhood",
        "C******n": "Children",
        "C*******ia": "Coprophilia",
        "C****l": "Cruel",
        "C****ty": "Cruelty",
        "C*****g": "Cucking",
        "C*****d": "Cuckold",
        "D*****e": "Disgrace",
        "D******d": "Disgraced",
        "D**nk": "Drink",
        "D**g": "Drug",
        "D****d": "Drugged",
        "D***ing": "Drugging",
        "D**gs": "Drugs",
        "D***k": "Drunk",
        "E******y School": "Elementary School",
        "E*****d": "Enforced",
        "F**ce": "Force",
        "F****d": "Forced",
        "F**ceful": "Forceful",
        "F***ing": "Forcing",
        "F**k": "Fuck",
        "F****d": "Fucked",
        "G**g B**": "Gang Bang",
        "G******g": "Gangbang",
        "H******d": "Humiliated",
        "H*********g": "Humiliating",
        "H**********n": "Humiliation",
        "H**po": "Hypno",
        "H*****s": "Hypnosis",
        "H******c": "Hypnotic",
        "H**********m": "Hypnotism",
        "H******e": "Hypnotize",
        "H*********d": "Hypnotized",
        "I*****l": "Illegal",
        "J****r H**h": "Junior High",
        "K*d": "Kid",
        "K**": "Kid",
        "K***p": "Kidnap",
        "K**s": "Kids",
        "K**l": "Kill",
        "K*****r": "Killer",
        "K*****g": "Killing",
        "K********n": "Kindergarten",
        "L**i": "Loli",
        "L******n": "Lolicon",
        "L****a": "Lolita",
        "M***d C**trol": "Mind Control",
        "M****t": "Molest",
        "M**********n": "Molestation",
        "M*****d": "Molested",
        "M****r": "Molester",
        "M*****g": "Molesting",
        "M*****r And S**": "Mother And Son",
        "N*****y": "Nursery",
        "P*****d O**": "Passed Out",
        "P*****g O**": "Passing Out",
        "P**p": "Poop",
        "P******l": "Preschool",
        "P***sh": "Punish",
        "P******d": "Punished",
        "P*****r": "Punisher",
        "P******g": "Punishing",
        "R*pe": "Rape",
        "R**e": "Rape",
        "R***d": "Raped",
        "R*****d": "Raped",
        "R***r": "Raper",
        "R**s": "Rapes",
        "R***g": "Raping",
        "R*****t": "Rapist",
        "R******s": "Rapists",
        "S**t": "Scat",
        "S*****gy": "Scatology",
        "S*****l G**l": "School Girl",
        "S*****l G****s": "School Girls",
        "S*****l": "Schoolgirl",
        "S**********s": "Schoolgirls",
        "S**a": "Shota",
        "S*****n": "Shotacon",
        "S***ve": "Slave",
        "S*****g": "Sleeping",
        "S******g": "Spanking",
        "S**d**t": "Student",
        "S******s": "Students",
        "S******n": "Submission",
        "T******e": "Tentacle",
        "T******s": "Tentacles",
        "T*****e": "Torture",
        "T******d": "Tortured",
        "U*****us": "Unconscious",
        "U******g": "Unwilling",
        "V****e": "Violate",
        "V*****d": "Violated",
        "V*****n": "Violation",
        "V*****e": "Violence",
        "V*****t": "Violent",
        "Y***g G**l": "Young Girl"
    };

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function matchCase(input, template) {
        if (template === template.toUpperCase()) return input.toUpperCase();
        if (template === template.toLowerCase()) return input.toLowerCase();
        if (template[0] === template[0].toUpperCase()) {
            return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        }
        return input;
    }

    function replaceWords(text) {
        for (const [key, value] of Object.entries(dictionary)) {
            const escapedKey = escapeRegex(key);
            const regex = new RegExp(escapedKey, 'gi');
            text = text.replace(regex, match => matchCase(value, match));
        }
        return text;
    }

    function replaceInElements() {
        const elements = document.querySelectorAll('a, h1, h2, h3, h4, h5, h6, .title, [class*="title"], [itemprop="name"], [title]');
        elements.forEach(element => {
            if (element.textContent) {
                const originalText = element.textContent;
                const newText = replaceWords(originalText);
                if (originalText !== newText) {
                    element.textContent = newText;
                }
            }
            if (element.hasAttribute('title')) {
                const originalTitle = element.getAttribute('title');
                const newTitle = replaceWords(originalTitle);
                if (originalTitle !== newTitle) {
                    element.setAttribute('title', newTitle);
                }
            }
        });
    }

    // Exécute au chargement du DOM
    document.addEventListener('DOMContentLoaded', replaceInElements);

    // Gère le contenu dynamique (ex: scroll infini)
    const observer = new MutationObserver(replaceInElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
