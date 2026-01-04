// ==UserScript==
// @name         MZ Script
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Snay.io with lots of features to come!
// @author       Moka X Zaro
// @match        https://www.snay.io/
// @icon         https://i.postimg.cc/sD65X7t3/black-calathea-lutea-patterned-background-53876-144275-2.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515292/MZ%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/515292/MZ%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('MZ Script is succesfully running.');
GM_addStyle (`

#ReplaySaveBtn {
  z-index: 19;
  top: 15.5vw;
  width: 5vw;
  height: 5vw;
  border-style: none;
  background: url(https://i.postimg.cc/9XBTszJL/chat-btn-1.png);
  background-size: 5vw 5vw;
  background-repeat: no-repeat;
  position: fixed;
  right: 6vw;
  opacity: 1;
}

.window-body {
    padding: 0 0 4vw 0;
    margin: 0;
    padding-left: 0px;
    padding-top: 1vw;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    scrollbar-width: thin;
    width: 100%;
    background-color: transparent;
    scrollbar-color: #ffffff var(--scrollbar-track-color);
}

#modmenubtn {
  z-index: 19;
  top: 15.5vw;
  width: 5vw;
  height: 5vw;
  border-style: none;

  background: url(https://i.postimg.cc/Vvt6FGGG/modmenu-btn.png);
  background-size: 5vw 5vw;
  background-repeat: no-repeat;
  position: fixed;
  right: 0.5vw;
  opacity: 1;
}
#modmenuclosebtn {
    top: 15vw;
    right: 2vw;
}

#modmenu {
    top: 15vw;
    border: 2px;
    border-radius: 9px;
    border-style: solid;
    border-color: white;
    background-color: rgba(0,0,0,.7);
    position: absolute;
    right: 1vw
}

modmenutitle {
    margin-left: 38px;
}

modmenu input {
    height: 0.6vw;
}

#badge-gallery-header {
    background-color: #000;
}
#gallery-content {
    background: black;
}

#season-gallery-header {
    background: black;
}

#settings-subtitle {
    color: white;
}

#window-header {
    background-color: black;
}

.swal-modal {
    background-color: black;
    border: 3px solid white;
}
.swal-title {
    color: white;
}
.swal-text {
    color: white;
}

#players-header {
    background-color: black;
}

#quests-body {
    background: linear-gradient(90deg, red, #101010);
}

#quests-header {
    background: black;
}

.window-header {
    background: black;
}

#replays-header {
    background: black;
}

#overlays,#connecting {
    background-image: url("https://i.postimg.cc/mZPXK8zv/google-pixel-8-dark-3840x2160-14308.jpg");
}

#leaderboards-header {
    background: black;
}

.free-rewards .reward-tag {
    background: #000;
    border-radius: 0 0 5vh 5vh;
}
.vip-rewards .reward-tag {
    background: #000;
    border-radius: 5vh 5vh 0 0;
}


#login-content {
    background: #000;
}
#login form span {
    background-color: #ffffff;
    border-radius: 10px 0px 0px 10px;
}
#login form input[type=email],input[type=password],input[type=text] {
    background-color: #ffffff;
    border-radius: 0 10px 10px 0;
    margin-bottom: 1.3em;
    padding: 0 18px;
}

#login form input[type=submit]:hover {
    background-color: #ff4949
}

#login form input[type=submit] {
    background-color: #e91111;
    border: 2px white solid;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 25px;
    color: #eee;
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: uppercase;
    width: 200px;
    margin-left: 40px;
}

#replays-content {
    background: #000;
}

#chatBtn {
  opacity: 1;
  background: url(https://i.postimg.cc/G90Rhbjz/chat-btn.png);
  width: 5vw;
  height: 5vw;
  background-size: 100% 100%;
  border-style: none;
}

#ShowSpectPlayersBtn {
  opacity: 1;
  color: white;
  background: url(https://i.postimg.cc/T3CstRWS/Ingame-Spectate-Players-Btn-1.png);
  width: 5vw;
  height: 5vw;
  background-size: 100% 100%;
  border-style: none;
}
#leaveBtn {
  opacity: 1;
  left: 1vw;
  background: url('https://i.postimg.cc/6Q68Nhqq/leave-btn.png');
}

#lead-btn {
    background: url(https://i.postimg.cc/FKj1cn6T/leaderboard1.png);
    right: 1vw;
}

#ClipBtn {
  position: absolute;
  width: 6vw;
  height: 6vw;
  top: 1.5vw;
  left: 9vw;
  opacity: 1;
  z-index: 99;
  background: url(https://i.postimg.cc/MKQwvfND/chat-btn-2.png);
  background-size: 100% 100%;
  border-style: none;
}

#treasure-btn {
  background-image: url(https://i.postimg.cc/FzcJWsCQ/leaderboard1-2.png);
}

#badges-btn {
  background-image: url(https://i.postimg.cc/fb9Z0tVZ/2583264-1.png);
}

#xp-btn {
  background-image: url(https://i.postimg.cc/YqzTZNWh/8349941-1-2.png);
}

#mass-btn {
  background-image: url(https://i.postimg.cc/hGvF9Jhh/8349941-2.png);
}

#play-btn {
  background-image: url(https://i.postimg.cc/0NYp0Tbs/Untitled-2.png);
}
#spectate-btn {
  background-image: url(https://i.postimg.cc/mkyFWZCf/Untitled.png);
}

#settings-btn {
  background-image: url(https://i.postimg.cc/brVptKjS/Untitled-1.png);
}

#leaveBtn,
#pause-btn,
#lead-btn {
  top: 1vw;
  width: 8vw;
  height: 8vw;
  background-size: 100% 100%;
  border-style: none;
}

#profile-btn {
  background-image: url(https://i.postimg.cc/tC39QfsC/Profile-1.png);
}

#emojiBtn {
  opacity: 1;
  color: white;
  background: url(https://i.postimg.cc/ZqYByvFm/modmenu-btn-1.png);
  width: 5vw;
  height: 5vw;
  background-size: 100% 100%;
  border-style: none;
}

#seasons-btn {
  background-image: url(https://i.postimg.cc/RVyKyWnz/seasons-btn-2.png);
}

#shop-btn {
  background-image: url(https://i.postimg.cc/RCPc1sSh/support-btn-2.png);
}

#support-btn {
  background-image: url(https://i.postimg.cc/vBh5NX5P/support-btn-1.png);
}

#signout-btn {
  background-image: url(https://i.postimg.cc/7PpSQCzr/Signout-1.png);
  background-color: rgba(0, 0, 0, 0);
  background-size: 110% 110%;
  background-position: 50% 50%;
  overflow: hidden;

}

#signin-btn {
  background-image: url(https://i.postimg.cc/XYWd4Tx2/Untitled.png);
}

#discord-btn {
  background-image: url(https://i.postimg.cc/DyPmdmdg/Main-Button-Discord-1-2.png);
}

#leaderboards-btn {
  background-image: url(https://i.postimg.cc/8kr6W10K/Main-Button-Top-Players-1.png);
}

#players-btn {
  background-image: url(https://i.postimg.cc/xCL9fF6R/Main-Button-Discord-3.png);
}


#fullScreenBtn {
  position: absolute;
  width: 5vw;
  height: 5vw;
  top: 2.2vw;
  left: 3vw;
  opacity: 1;
  z-index: 99;
  background: url(https://i.postimg.cc/prjBrcKy/54431-1.png);
  background-size: 100% 100%;
  border-style: none;
}

#leaderboard {
    padding-left: 3vmin;
    padding-right: 3vmin;
    padding-bottom: 3vmin;
    width: 25vmin;
    height: 30vmin;
    margin: 0;
    overflow: hidden;
    font-family: sans-serif;
    font-weight: bold;
    position: absolute;
    top: 1vh;
    right: 1vmin;
    z-index: 1;
    color: #eee;
    background-image: url(https://i.postimg.cc/0NDfgfcp/Leaderboard-bg-1.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.container {
    margin: 0 auto;
    max-width: 300px;
    width: 100%;
}
.container {
    display: flex;
    justify-content: center;
}

#community-content {
    background: linear-gradient(135deg,#000000,#000000);
    border-radius: 2vw;
    max-width: 80%;
    padding: 1vw
}

#leaderboards {
    background-image: none !important;
}


#community {
    background-image: none !important;
}

#tiles-gallery {
    background-image: none !important;
}

#seasons {
    background-image: none !important;
}

#store {
    background-image: none !important;
}

#settings {
    background-image: none !important;
}

#spinner {
    background-image: none !important;
}

#servers {
    background-image: none !important;
}

#emoji-gallery {
    background-image: none !important;
}

#gallery {
    background-image: none !important;
}

#replays {
    background-image: none !important;
}

#players {
    background-image: none !important;
}

#badge-gallery {
    background-image: none !important;
}

#account {
    background-image: none !important;
}

.selectedSkin {
border-color: #4CAF50;
}

.squareBadge:hover {
    border-color: #1a411c;
}
`)

/* Keybinds */
document.addEventListener("keydown", function(event) {
    if (event.key === "m" || event.key === "M") {
        const modMenuBtn = document.getElementById("modmenubtn");
        if (modMenuBtn) {
            modMenuBtn.click();
        }
    }
    if (event.key === "l" || event.key === "L") {
        const leaderboard = document.getElementById("leaderboard");
        if (leaderboard) {
            leaderboard.click();
        }
    }
    if (event.key === "l" || event.key === "L") {
        const leaderboard = document.getElementById("lead-btn");
        if (leaderboard) {
            leaderboard.click();
        }
    }
    if (event.key === "o" || event.key === "O") {
        const leaderboard = document.getElementById("emojiBtn");
        if (leaderboard) {
            leaderboard.click();
        }
    }

});

/* ~~~~~~~~~~~~~~~SCRIPT CREDITS~~~~~~~~~~~~~~~~ */
window.onload = function() {
    // CSS styles
    const style = document.createElement("style");
    style.textContent = `
        .settings-subtitle {
            margin: 1em;
            padding: 0px;
            font-size: 2em;
        }
        .custom-hr {
            color: rgb(99, 99, 99);
            height: 0.1vw;
            background-color: rgb(99, 99, 99);
            width: 58em;
            margin-bottom: 1vw;
            margin-left: 2em;
        }
        .custom-li {
            margin-right: 0.5em;
            margin-left: 0.5em;
            margin-bottom: 0.5em;
            padding: 0px;
            color: rgb(99, 99, 99);
            background-color: rgb(242, 242, 242);
            border: 0.05em solid rgb(211, 211, 211);
            border-radius: 0.5em;
            display: flex;
            align-items: center;
            width: 30em;
            height: 3em;
            font-size: 2em;
        }
        .custom-li img {
            border-radius: 100%;
            margin-right: 0.5em;
            margin-left: 0.5em;
            width: 2.5em;
            height: 2.5em;
        }
        .custom-li span {
            width: 14em;
        }
    `;
    document.head.appendChild(style);
    const container = document.querySelector("#MoreButtons");

    if (container) {
        const scriptCreditsH3 = document.createElement("h3");
        scriptCreditsH3.className = "settings-subtitle";
        scriptCreditsH3.textContent = "Script Credits 📄";

        const scriptCreditsHr = document.createElement("hr");
        scriptCreditsHr.className = "custom-hr";

        container.insertBefore(scriptCreditsHr, container.firstChild);
        container.insertBefore(scriptCreditsH3, container.firstChild);

        const listItem1 = document.createElement("li");
        listItem1.className = "custom-li";
        listItem1.innerHTML = `
            <img src="https://i.postimg.cc/yxJGhQGY/57c111110da958bc45adac69d64b43a1.webp">
            <span>Moka</span>
            <img src="/assets/img/DiscordIcone.png">
            <span>moka.io</span>
        `;

        const listItem2 = document.createElement("li");
        listItem2.className = "custom-li";
        listItem2.innerHTML = `
            <img src="https://i.postimg.cc/zDM6DNLL/dde6ddb2bb5b306570523fa27dcbac21.webp">
            <span>Zo</span>
            <img src="/assets/img/DiscordIcone.png">
            <span>_z0oz</span>
        `;

        container.insertBefore(listItem2, scriptCreditsHr.nextSibling);
        container.insertBefore(listItem1, listItem2);
    } else {
        console.error("Container #MoreButtons not found in the DOM.");
    }
};


/* ~~~~~~~~~~~~~~~~~~~~~REMOVE 'Privacy settings'~~~~~~~~~~~~~~~~~~~~~~ */
document.querySelectorAll('a').forEach(link => {
  if (link.textContent.includes('Privacy settings')) {
    link.remove();
  }
});

/* ~~~~~~~~~~~~~~~~~~~~~DISCORD INV~~~~~~~~~~~~~~~~~~~~~~ */
var Discord = document.createElement("div");
	Discord.style = "height: 40px; width: 88px; position: absolute; top: 25px; right: 5px; border: 2px solid #ffffff; border-radius: 25px; background: 0% 0% / 100% 100% no-repeat #5757c7; text-align: center; color: black; cursor: pointer;";
	Discord.innerText = "Discord";
	document.querySelector("#main-menu").append(Discord);
	Discord.onclick = () => {
		window.open("https://discord.gg/S8nJv8fkkw");
	}
	Discord.style.cursor = "pointer";
	Discord.style.backgroundSize = "100% 100%";
	Discord.style.backgroundRepeat = "no-repeat";

/* ~~~~~~~~~~~~~~~~~~~~~MENU TITLE~~~~~~~~~~~~~~~~~~~~~~ */
const menuTitle = document.querySelector("#title");
menuTitle.src = "https://i.postimg.cc/t4ZhDMsT/1325119-3.png";
Object.assign(menuTitle.style, { position: "absolute", top: "-5%", zIndex: "7" });

/* ~~~~~~~~~~~~~~~~~~~~~WINDOWS~~~~~~~~~~~~~~~~~~~~~~ */
const settingsContent = document.querySelector("#settings-content");
settingsContent.style.backgroundColor = "black";
const playersContent = document.querySelector("#players-content");
playersContent.style.backgroundColor = "black";
const leaderboardsContent = document.querySelector("#leaderboards-content");
leaderboardsContent.style.backgroundColor = "black";
const storeContent = document.querySelector("#store-content");
storeContent.style.backgroundColor = "black";
const seasonsContent = document.querySelector("#seasons-content");
seasonsContent.style.backgroundImage = "linear-gradient(90deg, red, #101010)";
const accountContent = document.querySelector("#account-content");
accountContent.style.backgroundColor = "black";
const badgeGalleryContent = document.querySelector("#badge-gallery-content");
badgeGalleryContent.style.backgroundColor = "black";
const tilesGalleryContent = document.querySelector("#tiles-gallery-content");
tilesGalleryContent.style.backgroundColor = "black";
const serversContent = document.querySelector("#servers-content");
serversContent.style.backgroundColor = "black";
const emojiGalleryContent = document.querySelector("#emoji-gallery-content");
emojiGalleryContent.style.backgroundColor = "black";
const replaysContent = document.querySelector("#replays-content");
replaysContent.style.backgroundColor = "#000";
const spinnerContent = document.querySelector("#spinner-content");
spinnerContent.style.backgroundImage = "linear-gradient(90deg, red, #101010)";
const vipContent = document.querySelector("#vip-content");
vipContent.style.backgroundImage = "linear-gradient(90deg, red, #101010)";
const communityContent = document.querySelector("#community-content");
communityContent.style.backgroundColor = "black";
document.addEventListener('DOMContentLoaded', function () {
    const profileElement = document.getElementById('Profile');

    if (profileElement) {
        profileElement.style.backgroundColor = '#ff0000';
    } else {
        console.error('Profile element not found');
    }
});

/* ~~~~~~~~~~~~~~~~~~~~~TIME SURVIVAL COUNTER~~~~~~~~~~~~~~~~~~~~~~ */
const playButton = document.getElementById('play-btn');
const leaveButton = document.querySelector('.swal-button.swal-button--confirm.fs40.swal-button--danger');

const gameDiv = document.createElement('div');
gameDiv.id = 'game';
gameDiv.textContent = 'Time Elapsed: 0 seconds';
document.body.appendChild(gameDiv);


gameDiv.style.position = 'absolute';
gameDiv.style.top = '22vw';
gameDiv.style.right = '10px';
gameDiv.style.color = 'white';
gameDiv.style.fontSize = '16px';
gameDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
gameDiv.style.padding = '10px';
gameDiv.style.borderRadius = '5px';


let startTime;
let timerInterval;


playButton.addEventListener('click', () => {
    startCounter();
});

leaveButton.addEventListener('click', () => {
    stopCounter();
});

function startCounter() {
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateCounter, 1000);
}

function stopCounter() {
    clearInterval(timerInterval);
}

function updateCounter() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);

    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime % 60;

    if (elapsedTime < 60) {
        gameDiv.textContent = `Time Elapsed: ${elapsedTime}s`;
    } else {
        gameDiv.textContent = `Time Elapsed: ${minutes}m and ${seconds}s`;
    }
}
})();