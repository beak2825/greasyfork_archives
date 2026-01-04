// ==UserScript==
// @name         kotu.io Pitch Accent Replay
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add the ability to replay BOTH of the pitch accents for the word you're being tested on. Use this to get a better understanding of how the difference should sound, but please be sure to disable this before uploading screenshots of your progress.
// @author       You
// @match        https://kotu.io/tests/pitchAccent/minimalPairs
// @icon         https://www.google.com/s2/favicons?domain=kotu.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428977/kotuio%20Pitch%20Accent%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/428977/kotuio%20Pitch%20Accent%20Replay.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.rerolls = 3;

    let isNakadaka = function(pitchAccent, moraCount) {
        let stringName = 0 == pitchAccent || pitchAccent == moraCount ? "Heiban / Odaka" : 1 == pitchAccent ? "Atamadaka" : "Nakadaka";
        return stringName == "Nakadaka"; // Somewhat silly but I don't feel like untangling the ternary mess that the minified code has
    }

    let anyNakadaka = function(body) {
        let anyNakadaka = false;
        for(let i = 0; i < body.pairs.length; i++) {
            let pair = body.pairs[i];
            if(isNakadaka(pair.pitchAccent, pair.entries[0].moraCount)){
                anyNakadaka = true;
                break;
            }
        }
        return anyNakadaka
    }

    let app = document.querySelector("#app-container");
    var callback = function(mutationsList) {
        let buttons = app.querySelectorAll(".btn.btn-primary");
        if(window.lastUrls !== undefined) {
            console.log("Adding audio");
            let added = false;
            for(let i = 0; i < buttons.length; i++) {
                if(buttons[i].parentNode.children.length == 1 && window.lastUrls.length == buttons.length) {
                    let replay = document.createElement("div");
                    let baseUrl = "/api/media/nhk/audio/"
                    replay.innerHTML = "<audio controls style=\"width:100%; height:25px;\" src=\""+baseUrl + window.lastUrls[i]+"\"></audio>";
                    buttons[i].parentNode.appendChild(replay);
                    added = true;
                }
            }
            if(added) window.lastUrls = undefined;
        }
        let statisticsArr = [].slice.call(app.querySelectorAll(".text-center")).filter(x=>x.textContent.includes("Statistics"));
        if(statisticsArr.length > 0) {
            let statistics = statisticsArr[0];
            if(!statistics.textContent.includes("CHEAT MODE")) {
                statistics.innerHTML = "<div>Statistics</div><div style=\"color:red;\">CHEAT MODE ENABLED</div><div style=\"font-size:12px;\">Disable cheat mode before testing yourself and posting screenshots of this</div>";
            }
        }
    };

    var observer = new MutationObserver(callback);
    observer.observe(app, {
        characterDataOldValue: true,
        subtree: true,
        childList: true,
        characterData: true
    });

    window.lastUrls = undefined;

    const {fetch: origFetch} = window;
    window.fetch = async (...args) => {

        let rerollCount = 1;
        if(args[0] == "/api/tests/pitchAccent/minimalPairs/random") {
            rerollCount += window.rerolls;
        }

        let fetches = [];
        for(let i = 0; i < rerollCount; i++)
        {
            fetches.push(origFetch(...args));
        }
        const responses = await Promise.all(fetches);
        let response = responses[0];
        if(rerollCount > 1) {
            let jsoned = await Promise.all(responses.map(x=>x.clone().json()));
            for(let i = 0; i < jsoned.length; i++) {
                let body = jsoned[i];
                if(anyNakadaka(body)){
                    response = responses[i]; // Replace response with one that is nakadaka to favor nakadaka since it shows up less often
                    break;
                }
            }
        }
        response
            .clone()
            .json()
            .then(body => {
            if(args[0] == "/api/tests/pitchAccent/minimalPairs/random") {
                console.log("intercepted response:", body)
                window.lastUrls = body.pairs.map(x=>x.soundFile);
                callback(null);
            }
        })
            .catch(err => console.error(err));
        return response;
    };
    console.log("Added modified fetch");
})();