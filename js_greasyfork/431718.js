// ==UserScript==
// @name            Nukoi Mod
// @namespace       http://tampermonkey.net/
// @version         1
// @description     Save Zombs frm 𝚝𝚘𝚡𝚒𝚌𝚒𝚝𝚢
// @author          Nukoi
// @match           http://zombs.io/
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/431718/Nukoi%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/431718/Nukoi%20Mod.meta.js
// ==/UserScript==

document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "margin-bottom: 12.75px; width: auto; height: auto; padding: 25px;");
document.getElementsByClassName("hud-menu-party")[0].setAttribute("style", "width: 610px; height: 465px;");
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.getElementsByClassName("hud-intro-play")[0].classList.add("btn-purple");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<h1>ℤ𝕠𝕞𝕓𝕤.𝕚𝕠<h1>`;
document.getElementsByClassName("hud-intro-footer")[0].innerHTML = `<h3><font size="36">𝚆𝙷𝚘𝚣𝙽𝚞𝚔𝚘𝚒 𝚟𝟸</font></h3>`;
document.getElementsByClassName("hud-intro-youtuber")[0].innerHTML = `<h3>Featured YouTuber:</h3><a href="https://www.youtube.com/channel/UCfmI3I08wnqGGhcnIzEMXBA" target="_blank">WhozNukoi_</a>`;
document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-guide, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

let change = document.createElement("BUTTON");
change.className = "btn btn-purple";
change.id = "change";
change.style = "width: 100%; height: 50px; margin-top: 3%;";
change.innerHTML = "𝚢𝚘𝚞𝚝𝚞𝚋𝚎 𝚌𝚑𝚊𝚗𝚗𝚎𝚕";
document.getElementsByClassName("hud-intro-form")[0].insertBefore(change, document.getElementsByClassName("hud-intro-error")[0]);
document.getElementById("change").onclick = () => {
    window.open('https://www.youtube.com/channel/UCfmI3I08wnqGGhcnIzEMXBA');
}

var entities = Game.currentGame.world.entities;
var Style2 = document.querySelectorAll('.hud-map, .hud-party-link, .hud-menu-party, .hud-resources, .hud-menu, .hud-menu-icon, .hud-intro-left, .hud-menu-shop, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-settings-grid, .hud-party-grid, .hud-party-members, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-chat-input');
for (let i = 0; i < Style2.length; i++) {
    Style2[i].style.borderRadius = '2em'; // standard
    Style2[i].style.MozBorderRadius = '2em'; // Mozilla
    Style2[i].style.WebkitBorderRadius = '2em'; // WebKitww
    Style2[i].style.border = "0.22em solid #9933CC";
    Style2[i].style.outline = "none";
}

let style = document.createTextNode(`
.hud-intro::before {
    background-image: url('https://i.pinimg.com/originals/bd/a9/df/bda9dfd72e4a3e9a9c41c64a08a3a362.gif'); background-size-1920x1080: cover; }';
    background-size: cover;
}
.hud-menu-shop {
    width: 625px;
    height: 465px;
    margin: -270px 0 0 -312.2em;
    padding: 20px;
}
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 2em;
	background-color: #9933CC;
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 2em;
	background-color: #9933CC;
}
::-webkit-scrollbar-thumb {
	border-radius: 2em;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background: linear-gradient(to bottom right, #9933CC, #9933CC 80%);
}
.btn-#9933CC {
    background: linear-gradient(to top right, #9933CC, #9933CC 80%);
    color: white;
    border-radius: 2em;
    margin: 0px 2.2em 2em 0px;
    font-size: 18px;
    outline: none;
    text-shadow: 1px 1px 1px #black;
}
.btn-#9933CC:hover {
    background: linear-gradient(to top right, #9933CC, #9933CC 100%);
}`);
let styles = document.createElement("style");
styles.type = "text/css";
styles.appendChild(style);
document.body.appendChild(styles);

const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = `People in game: ${JSON.parse(request.responseText).players}/${JSON.parse(request.responseText).capacity} [${(JSON.parse(request.responseText).players / JSON.parse(request.responseText).capacity * 100).toFixed(2)}%]`;
    }
};
