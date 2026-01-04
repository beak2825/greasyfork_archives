// ==UserScript==
// @name         Diep.io audio/music/sound beta
// @namespace    http://tampermonkey.net/
// @version      2.3
// @homepage     https://greasyfork.org/en/scripts/461192-diep-io-audio-music-sound-beta/code
// @description  Please sent me game music ideas in the feedback! Plays background music with custom controls for skipping tracks, adjusting volume, and playing/pausing the music.
// @author       -{Abyss⌬}-ora
// @match        https://diep.io
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461192/Diepio%20audiomusicsound%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/461192/Diepio%20audiomusicsound%20beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const audioPlayer = new Audio();
    audioPlayer.id = "audioPlayer";
    audioPlayer.controls = false;
    audioPlayer.loop = false;
    audioPlayer.autoplay = true;
    audioPlayer.volume = 0.05;

    const sources = [
        "https://github.com/Abyss-ora/dpaudio/raw/main/8-bit-arcade-138828.mp3",
        "https://github.com/Abyss-ora/dpaudio/raw/main/kim-lightyear-angel-eyes-chiptune-edit-110226.mp3",
        "https://github.com/Abyss-ora/dpaudio/raw/main/kim-lightyear-legends-109307.mp3",
        "https://github.com/Abyss-ora/dpaudio/raw/main/Cipher2.mp3"
    ];

    let currentTrack = 0;

    audioPlayer.addEventListener("ended", function() {
        currentTrack++;
        if (currentTrack >= sources.length) {
            currentTrack = 0;
        }
        audioPlayer.src = sources[currentTrack];
        audioPlayer.play();
    });

    audioPlayer.src = sources[currentTrack];
    document.body.appendChild(audioPlayer);

    const container = document.createElement("div");
    container.style.opacity = "0.5";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.left = "300px";
    container.style.backgroundImage = "url('https://media.tenor.com/images/f3f5354b7c304bc61882dbb1183885e7/tenor.gif')";
    container.style.backgroundRepeat = "repeat";
    container.style.backgroundAttachment = "fixed";
    container.style.backgroundSize = "160px 100px";
    container.style.padding = "5px";
    container.style.borderRadius = "5 5px 5px 5";
    container.style.borderStyle = "solid";
    container.style.borderWidth = "thick";
    container.style.borderTopRightRadius = "20px 50px";
    container.style.borderTopLeftRadius = "20px 50px";
    container.style.borderStyle = "double";
    container.style.borderBottomRightRadius = "20px 50px";
    container.style.borderBottomLeftRadius = "20px 50px";
    container.style.borderTopColor = "lightpink";
    container.style.borderLeftColor = "lightgray";
    container.style.borderBottomColor = "lightpink";
    container.style.borderRightColor = "lightgray";
    container.style.textAlign = "center";
    document.body.appendChild(container);

    const previousButton = document.createElement("button");
    previousButton.innerText = "⏪";
    previousButton.style.fontSize = "24px";
    previousButton.style.marginRight = "10px";
    previousButton.style.marginLeft = "10px";
    previousButton.style.borderTopColor = "lightpink";
    previousButton.style.backgroundTransparent = "0.01";
    previousButton.style.textAlign = "center";
    previousButton.style.padding = "1px 6px";
    container.appendChild(previousButton);

    const playButton = document.createElement("button");
    playButton.innerText = "▶️";
    playButton.style.fontSize = "24px";
    playButton.style.marginRight = "10px";
    playButton.style.borderTopColor = "lightpink";
    playButton.style.backgroundTransparent = "0.01";
    playButton.style.textAlign = "center";
    playButton.style.padding = "1px 6px";
    container.appendChild(playButton);

    const volumeBar = document.createElement("input");
    volumeBar.type = "range";
    volumeBar.min = "0";
    volumeBar.max = "1";
    volumeBar.step = "0.01";
    volumeBar.value = audioPlayer.volume;
    volumeBar.style.width = "100px";
    volumeBar.style.marginRight = "10px";
    volumeBar.style.backgroundTransparent = "0.01";
    volumeBar.style.textAlign = "center";
    container.appendChild(volumeBar);

    const loopButton = document.createElement("button");
    loopButton.innerText = "🔁";
    loopButton.addEventListener("click", function() {
        audioPlayer.loop = !audioPlayer.loop;
        loopButton.innerText = audioPlayer.loop ? "🛑" : "🔁";
    });
    loopButton.style.fontSize = "24px";
    loopButton.style.marginRight = "10px";
    loopButton.style.borderTopColor = "lightpink";
    loopButton.style.backgroundTransparent = "0.01";
    loopButton.style.textAlign = "center";
    loopButton.style.padding = "1px 6px";
    container.appendChild(loopButton);

    const skipButton = document.createElement("button");
    skipButton.innerText = "⏩";
    skipButton.style.fontSize = "24px";
    skipButton.style.marginRight = "10px";
    skipButton.style.borderTopColor = "lightpink";
    skipButton.style.backgroundTransparent = "0.01";
    skipButton.style.textAlign = "center";
    skipButton.style.padding = "1px 6px";
    container.appendChild(skipButton);

    function playPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.innerText = "⏸";
        } else {
            audioPlayer.pause();
            playButton.innerText = "▶️";
        }
    }

    function previousTrack() {
        currentTrack = (currentTrack - 1 + sources.length) % sources.length;
        audioPlayer.src = sources[currentTrack];
        audioPlayer.play();
        playButton.innerText = "⏸";
    }

    function skipTrack() {
        currentTrack = (currentTrack + 1) % sources.length;
        audioPlayer.src = sources[currentTrack];
        audioPlayer.play();
        playButton.innerText = "⏸";
    }

    playButton.addEventListener("click", playPause);
    previousButton.addEventListener("click", previousTrack);
    skipButton.addEventListener("click", skipTrack);
    volumeBar.addEventListener("input", function() {
        audioPlayer.volume = volumeBar.value;
    });
//------------------
    document.addEventListener("keydown", (event) => {
        if (event.key === "r" || event.key === "R") {
            container.style.display = container.style.display === "none" ? "" : "none";
        }
    });
//------------------
})();