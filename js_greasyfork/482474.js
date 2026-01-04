// ==UserScript==
// @name         diepio backround music
// @namespace    diep music
// @version      1.0.2
// @description  Add a music menu to diepio to play background music while playing the game.
// @author       SuDix
// @match        https://diep.io/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482474/diepio%20backround%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/482474/diepio%20backround%20music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let musicMenuVisible = true;

    // Add the music menu to the page
    const musicMenu = document.createElement("div");
    musicMenu.id = "music-menu";
    document.body.appendChild(musicMenu);

    // Add event listeners to the music buttons
    const music7Button = document.createElement("button");
    music7Button.textContent = "Script Made By SuDix Have Fun ;)";
    musicMenu.appendChild(music7Button);

    const music0Button = document.createElement("button");
    music0Button.textContent = "Roses";
    musicMenu.appendChild(music0Button);

    const music1Button = document.createElement("button");
    music1Button.textContent = "Royalty";
    musicMenu.appendChild(music1Button);

    const music2Button = document.createElement("button");
    music2Button.textContent = "Below The Surface";
    musicMenu.appendChild(music2Button);

    const music3Button = document.createElement("button");
    music3Button.textContent = "Rezz - Edge";
    musicMenu.appendChild(music3Button);

    const music4Button = document.createElement("button");
    music4Button.textContent = "𝐒𝐭𝐨𝐩-𝐌𝐮𝐬𝐢𝐜";
    musicMenu.appendChild(music4Button);

    music0Button.addEventListener("click", () => {
        playMusic("https://cdn.discordapp.com/attachments/1180833930857959454/1185848935160496239/SAINt_JHN_-_Roses_Imanbek_Remix_Official_Music_Video.mp3?ex=65911ae2&is=657ea5e2&hm=71adb76fd7bebb88af711c835318df826d3ddf96354a775ce1c0d5cf9beb5b45&");
    });

    music1Button.addEventListener("click", () => {
        playMusic("https://cdn.discordapp.com/attachments/1180833930857959454/1185849490545053756/Egzod__Maestro_Chives_-_Royalty_ft._Neoni_Wiguez__Alltair_Remix_NCS_Release.mp3?ex=65911b66&is=657ea666&hm=005d787d4c43329019fd6801a3a05d2928500e85802ccc6122a43418f721dfe2&");
    });

    music2Button.addEventListener("click", () => {
        playMusic("https://cdn.discordapp.com/attachments/1180833930857959454/1185849676700852274/Below_the_Surface_by_togeito_pitch_5.31_-_tempo_200.mp3?ex=65911b92&is=657ea692&hm=23cb4091159f5b85b871ca4a58995fb7e2a26896f22f55eeeeb05cc22e877e01&");
    });

    music3Button.addEventListener("click", () => {
        playMusic("https://cdn.discordapp.com/attachments/1016399895885795368/1087487963790843944/REZZ_-_Edge.mp3");
    });

    music4Button.addEventListener("click", () => {
        playMusic("music.mp3");
    });

    // Add event listener to toggle the music menu on and off with the "m" key
    document.addEventListener("keydown", (e) => {
        if (e.key === "b") {
            musicMenuVisible = !musicMenuVisible;
            if (musicMenuVisible) {
                musicMenu.classList.add("slide-in");
                musicMenu.classList.remove("slide-out");
            } else {
                musicMenu.classList.remove("slide-in");
                musicMenu.classList.add("slide-out");
            }
        }
    });

    // Function to play background music
    function playMusic(src) {
        // Stop any currently playing audio
        const audio = document.querySelector("#music");
        if (audio) {
            audio.pause();
            audio.remove();
        }

        // Create a new audio element and play the music
        const newAudio = document.createElement("audio");
        newAudio.id = "music";
        newAudio.src = src;
        newAudio.loop = true;
        newAudio.play();

        // Add the new audio element to the page
        document.body.appendChild(newAudio);
    }

    // Add styles for the music menu
   GM_addStyle(`
#music-menu {
position: fixed;
top: 20px;
left: 20px;
background-color: #800080;
color: #fff;
border: 2px solid #FF7F00;
padding: 20px;
display: block;
z-index: 999;
border-radius: 10px;
box-shadow: 0px 0px 20px #FF7F00;
opacity: 0;
transition: opacity 0.5s, transform 0.5s;
transform: translateY(-100%);
font-family: 'Helvetica Neue', sans-serif;
font-size: 20px;
}
           #music-menu.slide-in {
        opacity: 1;
        transform: translateY(0);
    }

    #music-menu.slide-out {
        opacity: 0;
        transform: translateY(-100%);
    }

    #music-menu h2 {
        margin: 0 0 20px;
        font-size: 24px;
        text-align: center;
        text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
    }

    #music-menu button {
        display: block;
        margin: 20px auto;
        background-color: #FF7F00;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
    }

    #music-menu button:hover {
        background-color: ##FF7F00;
    }
`);
})();