// ==UserScript==
// @name         Full AOTY Scores
// @version      1.3
// @description  Shows unrounded AOTY scores on albums
// @author       Rice
// @match        https://www.albumoftheyear.org/artist/*/best-songs/
// @match        https://www.albumoftheyear.org/ratings/*
// @match        https://www.albumoftheyear.org/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @grant        none
// @namespace    https://albumoftheyear.org
// @downloadURL https://update.greasyfork.org/scripts/457078/Full%20AOTY%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/457078/Full%20AOTY%20Scores.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //Checking URL
    let url = document.URL;
    // rounding decimals
    function round(value, decimals) {
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    }
    if (url.startsWith("https://www.albumoftheyear.org/album/")) {
        if (
            document.getElementsByClassName("albumCriticScore")[0].children[0]
            .textContent !== "NR"
        ) {
            let criticscore =
                document.getElementsByClassName("albumCriticScore")[0].children[0];
            let unrounded = criticscore.children[0].getAttribute("title");
            if (round(unrounded, 1) > 100) {
                criticscore.textContent = 100;
            }
            else {
            criticscore.textContent = round(unrounded, 1);
            document.getElementsByClassName("albumCriticScore")[0].style.fontSize =
                "39px";
            }
        }
        let userscore =
            document.getElementsByClassName("albumUserScore")[0].children[0];
        let unrounded2 = userscore.getAttribute("title");
        userscore.textContent = round(unrounded2, 1);
        document.getElementsByClassName("albumUserScore")[0].style.fontSize =
            "39px";
    }
    if (url.startsWith("https://www.albumoftheyear.org/artist/")) {
        // Checking elements
        let truescore = document.getElementsByClassName("trackListTable large")[0]
            .children[0];
        for (let i = 0; i < truescore.children.length; i++) {
            let score = truescore.children[i].children[3].children[0];
            score.textContent = round(score.getAttribute("title"), 2);
            console.log(
                truescore.children[i].children[3].children[0].getAttribute("title")
            );
        }
    }
    if (url.startsWith("https://www.albumoftheyear.org/ratings/")) {
        // Checking elements
        let roundedscore = document.getElementsByClassName("scoreValue");
        let truescore = document.getElementsByClassName("scoreValueContainer");
        let check = document.getElementsByClassName("scoreHeader");

        for (let i = 0; i < truescore.length; i++) {
            if (
                check[i].textContent !== "Critic Score" &&
                check[i].textContent !== "Score"
            ) {
                roundedscore[i].textContent = round(
                    truescore[i].getAttribute("title"),
                    2
                );
                roundedscore[i].style.fontSize = "18px";
            }
        }
    }
})();