// ==UserScript==
// @name            XVIDEOS Blacklister
// @version         0.9
// @description     Delete unwanted xvideos.com videos with a list of blacklisted keywords (see code for the list)
// @description:de  Unerwünschte Videos mit einer Blacklist von xvideos.com entfernen (siehe Code für die Liste)
// @description:fr  Supprimer les vidéos indésirables de xvideos.com avec une liste noire (voir le code pour la liste)
// @description:it  Rimuovere i video indesiderati da xvideos.com con una lista nera (vedi codice per la lista)
// @author          J.H
// @include         *xvideos.com*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @grant           none
// @license         MIT
// @run-at          document-end
// @namespace       https://greasyfork.org/users/448067
// @downloadURL https://update.greasyfork.org/scripts/445565/XVIDEOS%20Blacklister.user.js
// @updateURL https://update.greasyfork.org/scripts/445565/XVIDEOS%20Blacklister.meta.js
// ==/UserScript==

// SETTINGS
const debug_info = true; // show debug info in console (blacklisted videos, blacklisted words in the video title)
// Default blacklisted keywords (can be changed in the code)
// for some words add space after/before the word, to avoid false positives (e.g. "mother " will not match "motherfucker")
const blackList = [
    // incest
    "stepbro", "stepsis", "step bro", "step sis", "step sis", "step-bro", "step-sis", "stepdad",
    "step dad", "step-dad", "stepsib", "step sib", "step-sib", "stepmom", "step mom",
    "step-mom", "stepson", "step son", "step-son","stepaunt", "step aunt", "step-aunt",
    "stepuncle", "step uncle", "step-uncle", "stepcousin", "step cousin", "step-cousin",
    "sister's", "father ", "mother ", "daughter", "daddy", "sister ", "brother", "stepfather",
    "mommy", "granny", "family", " sister", "sis ", "bro ", "step-father", "step father",
    "step-mother", "step mother", "stepmother", "grandma", "mom ", "moms ",
    "soeur", "sœur", "papa", "maman", "fils", "frère", "frere", "frangine", "cousine", // in french
    "famille", "mère", "familiale", "dad ", "niece",
    // no straight safe
    "trap ", "futa", "trans ", "transgender", "shemale", "trann", "cuck", "fatboy",
    "sissy", "femboy", "femboi", "tgirl ", "travest", "crossdresser", "pegging",
    "t-girl", "ladyboy", " tgirl", "transgirl", "tbabe ", "ts ", "tgirls ", " tgirls",
    "prostate",
    // for woman
    "fpov", "female pov", "female point of view", "female perspective", "girlsrimming",
    "pov femme", "femme pov", "point de vue féminin", "point de vue femme", // in french
    // violence/extreme/..
    "rape ", "pee", "piss ", "femdom",
    "pipi", // in french
    // other
    "babysitter", "baby sitter", "baby-sitter", "doll ", "escort ", "feet", "foot ",
    "ado ", "married", "mature ", "strapon", "cougar", "bbw",
    "poupée", "poupee", "escorte ", // in french
];
// END OF SETTINGS

const colorPrint = function (videoTitle, ...args) { // debug info printing function
    args = args.filter(arg => arg !== 0); // remove arguments that contain 0
    console.log('%c[XVIDEOS Blacklister]:%c ' + videoTitle + ' %c[removed]', clr_s[2], clr_s[1], ...args, clr_s[3]);
}, clr_s = ["color: red", "color: white", "color: #f90", "color: green"]; // color settings (for debug info)

const divs = document.querySelectorAll(".thumb-block");
divs.forEach((div) => { // loop through all elements from the divs and find the title
    // shitty way to get the video title because the data-title attribute is not available on mobile
    let videoTitle = div.querySelector(".thumb-under a").getAttribute("title");
    if (videoTitle) { // if the video title is found
        blackList.forEach((blackWord) => { // loop through all blacklisted words
            if (videoTitle.toLowerCase().includes(blackWord)) { // if videoTitle contains blacklisted word
                const start = videoTitle.toLowerCase().indexOf(blackWord), end = start + blackWord.length;
                if (blackWord[blackWord.length - 1] == " ") { // check if the blacklisted word finish with a space, if it does, check if it's a word
                    const beforeAndAfter = videoTitle.toLowerCase().substring(start - 1, end + 1); // get the character before and after the blacklisted word
                    if (beforeAndAfter[0] != " " && beforeAndAfter.startsWith(blackWord) == false) {
                        return;
                    }
                }
                div.remove(); // remove the video element
                if (debug_info) { // allow printing of debug info
                    // add %c before/after every blacklisted word in the video title
                    videoTitle = videoTitle.substring(0, start) + "%c" + videoTitle.substring(start, end) + "%c" + videoTitle.substring(end);
                }
            }
        });
        if (debug_info) { // allow printing of debug info
            const count = (videoTitle.match(/%c/g) || []).length / 2; // count how many blacklisted words in the video title
            if (count > 0) { // if count is greater than 0, print debug info
                colorPrint(videoTitle, // little hack to print debug info in the console with red color for the blacklisted words
                    count > 0 ? clr_s[0] : 0, count > 0 ? clr_s[1] : 0, count > 1 ? clr_s[0] : 0, count > 1 ? clr_s[1] : 0, count > 2 ? clr_s[0] : 0, count > 2 ? clr_s[1] : 0,
                    count > 3 ? clr_s[0] : 0, count > 3 ? clr_s[1] : 0, count > 4 ? clr_s[0] : 0, count > 4 ? clr_s[1] : 0, count > 5 ? clr_s[0] : 0, count > 5 ? clr_s[1] : 0
                );
            }
        }
    }
});