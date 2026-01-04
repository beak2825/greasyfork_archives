// ==UserScript==
// @name         Dueling Nexus Anime Cards Extension
// @namespace    https://duelingnexus.com/
// @description  Reskins the existing Dueling Nexus cards with Anime versions.
// @author       Yasuo Tornado#9575
// @version      0.3
// @match        https://duelingnexus.com/game*
// @match        https://duelingnexus.com/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426527/Dueling%20Nexus%20Anime%20Cards%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/426527/Dueling%20Nexus%20Anime%20Cards%20Extension.meta.js
// ==/UserScript==

(function() {
    window.usingAnimeCards = 1;

    //https://cdn.jsdelivr.net/gh/ElvinaOlacarynWorld/OlacarynWorld@d079300/18743376.jpg
    // const githubRepository = "UnendingLegacy";
    const githubRepository = "DictionaryPie";
    const animeBase = "https://raw.githubusercontent.com/LimitlessSocks/" + githubRepository + "/master/small/";
    const cardsleeve = "https://th.bing.com/th/id/Rd98cf453f8697fca6e0329bd53e1aa80?rik=0Fv4drz2MjFLHw&pid=ImgRaw";
    const betterart = "https://storage.googleapis.com/ygoprodeck.com/pics/"
    const getAnimeAsset = (id) => animeBase + id + ".jpg";
    const getBetterAsset = (id) => betterart + id + ".jpg";
    const getSleeves = (id) => cardsleeve;
    let oldGetPicture = Engine.getCardPicturePath;

    Engine.getCardPicturePath = function (id, usingAnime = window.usingAnimeCards) {
        if(id === 0) {
            return getSleeves(id);
        }
        if(usingAnime == 1&& id !== 0) {
            return getAnimeAsset(id);
        }
        if(usingAnime == 2&& id !== 0) {
            return getBetterAsset(id);
        }
        else {
            return oldGetPicture(id);
        }
    }

    let oldSetCardImage = Engine.setCardImageElement;

    Engine.setCardImageElement = function (a, b, useAnime = window.usingAnimeCards) {
        a.on("error");
        a.attr("src", Engine.getCardPicturePath(b, useAnime));
        if (0 < b) a.one("error", function() {
            if(useAnime) {
                Engine.setCardImageElement(a, b, false);
            }
            else {
                //a.attr("src", Engine.getCardPicturePath(b, 2));
                Engine.setCardImageElement(a, b, 2);
            }

        })
    };
})();