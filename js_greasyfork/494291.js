// ==UserScript==
// @name         Chunumero
// @name:en      Chunumero
// @namespace    https://qmainconts.dev/
// @version      1.0.0
// @description  CHUNITHM-NET上のレコードページの楽曲ブロックに、楽曲の表示順を表示します。
// @description:en Displays the order of songs in the music block on the record page of CHUNITHM-NET.
// @author       Kjuman Enobikto
// @match        https://new.chunithm-net.com/chuni-mobile/html/mobile/record/music*
// @match        https://new.chunithm-net.com/chuni-mobile/html/mobile/record/worldsEndList/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494291/Chunumero.user.js
// @updateURL https://update.greasyfork.org/scripts/494291/Chunumero.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let musicBlocks = document.querySelectorAll(".box05.w400");
    if (musicBlocks.length === 0) {
        musicBlocks = document.querySelectorAll(".box01.w420");
    }
    for (let i = 0; i < musicBlocks.length; i++) {
        const musics = musicBlocks[i].querySelectorAll(".w388.musiclist_box");
        const musicCount = musics.length;
        if (musicCount === 0) continue;
        for (let j = 0; j < musicCount; j++) {
            const music = musics[j];
            music.style.position = "relative";
            const musicNumber = document.createElement("div");
            musicNumber.className = "musiclist_number";
            musicNumber.innerText = `${j + 1} / ${musicCount}`;
            musicNumber.style.position = "absolute";
            musicNumber.style.top = "-5px";
            musicNumber.style.right = "-5px";
            musicNumber.style.color = "black";
            musicNumber.style.backgroundColor = "white";
            musicNumber.style.padding = "5px";
            musicNumber.style.borderRadius = "5px";
            musicNumber.style.fontSize = "0.9rem";
            musicNumber.style.border = "1px solid black";
            musicNumber.style.opacity = "0.8";
            musicNumber.style.zIndex = "100";

            music.appendChild(musicNumber);
        }
    }
})();