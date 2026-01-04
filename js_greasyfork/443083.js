// ==UserScript==
// @name         Popmundo Songtitle Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds button to generate random names for songs
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/SongCreate
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/443083/Popmundo%20Songtitle%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/443083/Popmundo%20Songtitle%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const setValue = GM_setValue || GM.setValue || null;
    const getValue = GM_getValue || GM.getValue || null;

    if (document.location.href.endsWith("Character/SongCreate")) {
        const cacheKey = "random_song_list";
        const songTitleInput = document.querySelector("#ctl00_cphLeftColumn_ctl00_txtSongName");
        if (! songTitleInput) return;

        const randomSongButton = document.createElement("button");
        randomSongButton.innerText = "Random";
        randomSongButton.classList.add("round");
        randomSongButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.disabled = true;

            let titles = GM_getValue(cacheKey, "");

            if (titles.length < 1) {
                const httpRequest = new XMLHttpRequest();

                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200) {
                            const jsonData = JSON.parse(httpRequest.responseText);
                            const titles = jsonData.data.map((entry) => { return entry.name; });
                            const title = titles.shift();
                            songTitleInput.value = title;
                            GM_setValue(cacheKey, titles.join("\n"));
                        } else {
                            songTitleInput.value = "Failed to get random song name :(";
                        }

                        setTimeout(() => {e.target.disabled = false}, 1000);
                    }
                };

                httpRequest.open("GET", "https://story-shack-cdn-v2.glitch.me/generators/song-title-generator?count=6");
                httpRequest.setRequestHeader("Referer", "https://thestoryshack.com/tools/song-title-generator/?v=1");
                httpRequest.send();
            } else {
                titles = titles.split("\n");

                const title = titles.shift();
                songTitleInput.value = title;
                GM_setValue(cacheKey, titles.join("\n"));

                setTimeout(() => {e.target.disabled = false}, 1000);
            }
        });

        songTitleInput.parentElement.style.display = "flex";
        songTitleInput.insertAdjacentElement("afterend", randomSongButton);
    }
})();