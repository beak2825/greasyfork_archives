// ==UserScript==
// @name         Failed Replay Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a little link you can click when you get failed replay upload (so like usermodes or bot games or whatever)
// @author       orz
// @match        https://jstris.jezevec10.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jezevec10.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442161/Failed%20Replay%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/442161/Failed%20Replay%20Link.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const EXPIRATION_HOURS = 6;

    const notPastExpiration = d => {
        return Date.now() - Number.parseInt(d) < EXPIRATION_HOURS * 60 * 60 * 1000;
    }

    var strings = localStorage.getItem("failedReplayStrings");
    if (!strings)
         localStorage.setItem("failedReplayStrings",'{}');

    window.addEventListener('load', function(){

    const params = new URLSearchParams(window.location.search);
    const failedReplay = params.get("failedReplay");
    const replayBox = document.getElementById("rep0");
    if (replayBox && failedReplay) {
        const strings = JSON.parse(localStorage.getItem("failedReplayStrings"));
        replayBox.innerHTML = strings[failedReplay] || "";
    }
    try {
        // rewrite the upload error function
        Replay.prototype.uploadError = function(ebrima, agnia) {
            if (this.string) {
                const newId = Date.now()
                var newStrings = {};
                // add new replay :)
                newStrings[newId] = this.string;

                const strings = JSON.parse(localStorage.getItem("failedReplayStrings"));

                // filter out old replays so localStorage doesn't get full
                for (var id in strings)
                    if (newId - Number.parseInt(id) < EXPIRATION_HOURS * 60 * 60 * 1000)
                        newStrings[id] = strings[id];
                localStorage.setItem("failedReplayStrings",JSON.stringify(newStrings));


                var alyjah = "<span class='wFirstLine'><span class='wTitle'>!" + i18n.warning2 + "!</span> <b>" + i18n.repFail + "</b> (<em>" + agnia + "</em>)</span>";

                // just adds the link at the bottom
                alyjah += "<p>" + i18n.repInChat + " " + i18n.repTxtInfo + "</p>", alyjah += '<textarea readonly cols="30" onclick="this.focus();this.select()">' + this.string + "</textarea>"
                    +"<p><a target='_blank' href='/replay?failedReplay="+newId+"'>link</a>", ebrima.chatMajorWarning(alyjah);
            }
        }
    // try catch just to remove dumb error logs
    } catch (e) { console.log(e); }
    })
})();