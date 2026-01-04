// ==UserScript==
// @name         🌕 Moon Visuals 🌕 [New Visuals!]
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Visuals created by me using the CSS of moomoo.io offcial, give me ideas!
// @author       DaRK :)
// @match        *://*.moomoo.io/*
// @icon         https://cdn.discordapp.com/attachments/1129277020661100605/1182191381809205268/john-wagner-bloodmoon.png?ex=6583cc85&is=65715785&hm=adb74fe6d62f3c27077b2f36e6febdf74d3280e2d303283cdb550e08c990aba9&
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481692/%F0%9F%8C%95%20Moon%20Visuals%20%F0%9F%8C%95%20%5BNew%20Visuals%21%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/481692/%F0%9F%8C%95%20Moon%20Visuals%20%F0%9F%8C%95%20%5BNew%20Visuals%21%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const originalDrawImage = ctx.drawImage;

        ctx.drawImage = function () {
            this.shadowColor = "rgba(50, 50, 50, 0.5)";
            this.shadowBlur = 10;

            originalDrawImage.apply(this, arguments);

            this.shadowColor = "transparent";
            this.shadowBlur = 0;
        };
    });

    document.getElementById('loadingText').innerHTML = 'Moon Visuals Loading...';
    document.getElementById('loadingText').style.color = "b32821";
    document.getElementById("nameInput").style.backgroundColor = "black";
    document.getElementById("nameInput").style.color = "b32821";
    document.getElementById("enterGame").style.backgroundColor = "Black";
    document.getElementById("enterGame").style.color = "b32821";
    document.getElementById("mainMenu").style.backgroundImage = "url('https://memeguy.com/photos/images/i-drew-this-pixel-art-animation-using-colors-and-called-it-moonset--522728.gif')";
    document.getElementById("mainMenu").style.backgroundRepeat = "no-repeat";
    document.getElementById("mainMenu").style.backgroundSize = "cover";
    document.getElementById('enterGame').innerHTML ='🎮Enter Game!🎮';
    document.getElementById('enterGame').style.color = 'text-shadow: red 1px 1px 40px;';
    document.getElementById('nameInput').placeholder = "Ur Name Here xD";
    document.getElementById('diedText').innerHTML = '💥Why moon died?💥';
    document.getElementById('gameName').innerHTML = '🌕 Moon Visuals 🌕!';
    document.getElementById('gameName').style.color = "ffff66";
    document.getElementById("leaderboard").append ('🌕M̵͚͕͓͗ô̵̖͈͔̏̓ō̸͕̓͝ͅņ̵̬͈̐̄̎🌕');
    document.getElementById("leaderboard").style.color = "text-shadow: green 2px 2px 40px;";
    document.getElementById("leaderboard").style.border = "2px solid yellow";

    let ageBar = document.getElementById("ageBar");
    let hueAgeBar = 0;

    function updateAgeBarColor() {
        ageBar.style.backgroundColor = `hsl(${hueAgeBar}, 100%, 50%)`;
        hueAgeBar = (hueAgeBar + 1) % 360;
    }

    let intervalAgeBarId = setInterval(updateAgeBarColor, 50);

    let leaderboard = document.getElementById("leaderboard");
    let hueLeaderboard = 0;

    function updateLeaderboardColor() {
        leaderboard.style.borderColor = `hsl(${hueLeaderboard}, 100%, 50%)`;
        hueLeaderboard = (hueLeaderboard + 1) % 360;
    }

    let intervalLeaderboardId = setInterval(updateLeaderboardColor, 50);

    let foodDisplay = document.getElementById("foodDisplay");
    let woodDisplay = document.getElementById("woodDisplay");
    let stoneDisplay = document.getElementById("stoneDisplay");
    let scoreDisplay = document.getElementById("scoreDisplay");

    let hueText = 0;

    function updateTextColors() {
        foodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        woodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        stoneDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        scoreDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;

        hueText = (hueText + 1) % 360;
    }

    let intervalTextId = setInterval(updateTextColors, 50);

    let mapDisplay = document.getElementById("mapDisplay");


    mapDisplay.style.backgroundImage = "url('https://i.imgur.com/fgFsQJp.png')";
    mapDisplay.style.backgroundRepeat = "no-repeat";
    mapDisplay.style.backgroundSize = "cover";

})();
