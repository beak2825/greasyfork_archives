// ==UserScript==
// @name         YTFFWDTMR | Youtube Fast Forward To Most Replayed
// @namespace    None
// @version      1.0
// @description  Fast forward to the most replayed section of a youtube video by pressint ALT+R.
// @author       Christian Lemos
// @match        https://www.youtube.com/watch?v=*
// @icon         https://i.imgur.com/7LUt5IG.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455370/YTFFWDTMR%20%7C%20Youtube%20Fast%20Forward%20To%20Most%20Replayed.user.js
// @updateURL https://update.greasyfork.org/scripts/455370/YTFFWDTMR%20%7C%20Youtube%20Fast%20Forward%20To%20Most%20Replayed.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("keyup", doc_keyUp, false);
})();


function goToMostReplayedSection() {
    const classes = document.getElementsByClassName("ytp-heat-map-path");

    if (classes.length == 0){
        console.log("YTFFWDTMR: Most replayed section not found!");
        return;
    }

    console.log("YTFFWDTMR: Fast forwarding to most replayed section of video!");

    // Parse SVG path into array of tuples
    const path = classes[0].getAttribute("d").split(" ");
    var pathArr = [];
    var j = 0;
    for (let i = 0; i < path.length; i++) {
        if (path[i] === 'M' | path[i] === 'C') {
            continue;
        }

        pathArr[j] = path[i].split(",");
        pathArr[j][0] = parseFloat(pathArr[j][0]);
        pathArr[j][1] = parseFloat(pathArr[j][1]);

        j++
    }

    // Find index of most replayed peak
    const flatArray = pathArr.map((tuple) => tuple[1]);
    const min = Math.min(...flatArray);
    const vidPosIndex = flatArray.indexOf(min);
    const vidPos = pathArr[vidPosIndex][0];

    // Translate index into video time in seconds
    const mostRepTime = vidPos / 1000 * document.getElementsByTagName('video')[0].duration;
    const negOffset = document.getElementsByTagName('video')[0].duration * 0.01;

    // Fast forward video
    document.getElementsByTagName('video')[0].currentTime = mostRepTime - negOffset;
}

function doc_keyUp(e) {
    if (e.altKey && e.key === "r") {
        goToMostReplayedSection();
    }
}