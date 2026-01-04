// ==UserScript==
// @name EXTREME Adult Content Keyword Blocker Safari iOS
// @match *://*/*
// @license MIT
// By @rmurr117
// @description This detects the keywords under 'const keywords' and removes them. Made for Safari iOS. This is so extreme that it removes any mention of the opposite sex LOL
// Feel free to modify the existing keywords to remove any niche categories.
// @version 0.0.1.20241231084602
// @namespace https://greasyfork.org/users/1417792
// @downloadURL https://update.greasyfork.org/scripts/522374/EXTREME%20Adult%20Content%20Keyword%20Blocker%20Safari%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/522374/EXTREME%20Adult%20Content%20Keyword%20Blocker%20Safari%20iOS.meta.js
// ==/UserScript==
(function () {
   'use strict';
const keywords = ["woman", "women", "lady", "girl", "teen", "goddess", "egirl", "daddy", "mommy", "porn", "pornhub", "onlyfans", "fansly", "hentai", "anime", "lewd", "nsfwtwt", "nsfw", "hypnotized", "lose", "loser", "losing", "succubus", "beta", "simp", "whiteboi", "nofap", "fuck", "hump", "humping", "intercourse", "grinding", "backshots", "clapping", "clap", "pegged", "peg", "pegging", "bondage", "sissy", "femdom", "findom", "pump", "worship", "fetish", "debtfetish", "catfish", "raceplay", "bnwo", "blacked", "black", "bbc", "shrimp", "bwc", "bleached", "domme", "sub", "cuck", "sexy", "sex", "sexting", "slut", "slutty", "kinky", "kink", "bdsm", "hot", "horny", "ballbusting", "paypig", "tpe", "cnc", "cbt", "masturbate", "wank", "fap", "jerk", "stroke", "stroking", "cocktribute", "cumtribute", "goon", "gooner", "gooning", "gooners", "edge", "edging", "tribute", "goonstick", "goonstick", "goonrod", "pussy", "ass", "pawg", "bum", "kitt", "rear", "behind", "vagina", "hole", "boypussy", "twink", "booty", "boobs", "breast", "breasts", "tits", "nipples", "nips", "fat", "phat", "phatty", "gyat", "gyatt", "phatty", "pussyfree", "bubble", "wataa", "chudai", "jiggle", "jiggly", "jiggling", "bouncy", "bounce", "bouncing", "riding", "sit", "bbw", "thigh", "thighjob", "assjob", "outercourse", "thighs", "legs", "blowjob", "head", "suck", "throat", "cum", "seed", "dick", "cock", "rod", "pipe", "boner", "stiffy", "relapse", "relapsing", "milk", "milking", "dry", "creampie", "filled", "ejaculate", "orgasm", "breed", "breedable", "breeding", "cream", "mistress", "slave", "bdsm", "flr", "edging", "teasing", "denial", "joi", "pov", "dominatrix", "pussyfree", "prejac", "cuckold", "pegging", "strapon", "bondage", "ruinedorgasm", "footjob", "feet", "feetjob", "herrin", "slave", "chastity", "cuckold", "humiliation", "goddess", "worship", "cumcontrol", "sloppy", "drained", "buyingcontent", "SellingContent", "prostateorgasm", "prostatemassage", "sounding", "rimjob", "rimming", "fingering", "assplay", "asslick", "besonegro", "fioterra", "sexo", "blowjob", "ebony", "ebonypyt", "cumshot", "bbc"];

function checkAndBlockContent() {
    let bodyText = document.body.innerText.toLowerCase();
    for (let keyword of keywords) {
        if (bodyText.includes(keyword.toLowerCase())) {
            document.body.innerHTML = ''; // Clear the page content
            alert("Content blocked due to prohibited keyword."); // Optional: Inform the user
            break;
        }
    }
}

// Run the function to block content containing keywords
checkAndBlockContent();
})();
