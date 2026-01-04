// ==UserScript==
// @name         RandomSeedChanger["stake.com"]
// @description  Change SeedPair with a customizable-random Interval on Stake.com
// @match        https://stake.com/*
// @author       Rain_Bot | rainbot.ch
// @namespace    https://greasyfork.org/users/710212
// @version      5.2rev7
// @license      Open Source
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435748/RandomSeedChanger%5B%22stakecom%22%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/435748/RandomSeedChanger%5B%22stakecom%22%5D.meta.js
// ==/UserScript==

var minInterval = prompt("Set Your minimum interval in Minutes", 10); //set your minimum interval in minutes
var maxInterval = prompt("Set Your maximum interval in Minutes", 30); //set your maximum interval in minutes

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function rotateSeedPair() {
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function generateSeed(length) {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const expectedPackages = new Uint32Array(length);
        window.crypto.getRandomValues(expectedPackages);
        for (const expectedPackage of expectedPackages) {
            result += characters.charAt(expectedPackage % characters.length);
        }
        return result;
    }
    fetch("https://api.stake.com/graphql", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-access-token": getCookie("session")
        },
        "body": "{\"query\":\"mutation RotateSeedPair($seed: String!) {\\n  rotateSeedPair(seed: $seed) {\\n    clientSeed {\\n      user {\\n        id\\n        activeClientSeed {\\n          id\\n          seed\\n          __typename\\n        }\\n        activeServerSeed {\\n          id\\n          nonce\\n          seedHash\\n          nextSeedHash\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\",\"variables\":{\"seed\":\"" + generateSeed(32) + "\"},\"operationName\":\"RotateSeedPair\"}"
    }).then((FieldOperation) => {
        return FieldOperation.json();
    }).then((data) => {
        console.log("Active Client Seed\n" + data.data.rotateSeedPair.clientSeed.user.activeClientSeed.seed);
        console.log("Active Server Seed (Hashed)\n" + data.data.rotateSeedPair.clientSeed.user.activeServerSeed.seedHash);
        console.log(data);
    });
}

function init() {
    var interval = Math.floor(getRandom(minInterval * 6e1 * 1e3, maxInterval * 6e1 * 1e3));
    console.log("\n\n\nSeed Change @ " + new Date().toLocaleTimeString());
    rotateSeedPair();
    setTimeout(() => {console.log("Next Swap in " + (interval / 1e3 / 6e1).toFixed(2) + " minutes");}, 1337);
    setTimeout(() => {init();}, interval);
}

window.onload = function loadpage() {
    if (document.readyState === 'complete') {
        console.clear();
        console.log('Pageload:\t' + '%c' + document.readyState.toUpperCase(), 'color:green');
        init();
    }
};