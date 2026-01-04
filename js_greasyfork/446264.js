
// ==UserScript==
// @name         Fahx and coldness mod leaked
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  leaked ad this works
// @author       fahx and coldness
// @match        http://zombs.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446264/Fahx%20and%20coldness%20mod%20leaked.user.js
// @updateURL https://update.greasyfork.org/scripts/446264/Fahx%20and%20coldness%20mod%20leaked.meta.js
// ==/UserScript==

document.querySelectorAll('.ad-unit, .hud-intro-stone, .hud-intro-corner-bottom-left, .hud-intro-canvas, .hud-intro-tree, .hud-intro-error, .hud-intro-form > label > span, .hud-intro-footer > a, .hud-intro-more-games, .hud-intro-social, .hud-intro-guide, .hud-intro-left, .hud-respawn-corner-bottom-left, .hud-respawn-twitter-btn, .hud-respawn-facebook-btn').forEach(el => el.remove());
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

let themeColor = 'rgb(61 115 157 / 55%)';

let imageArray1 = [`<img src="https://cdn.discordapp.com/attachments/871760287760519232/914408457443094568/EohccRVVoAAMjiu.png" style="margin: 0 0 -180px -300px;width: 256px;">`,
                   `<img src="/asset/image/entity/player/player-base.svg" style="width: 75px;margin: 0 500px -100px 0;"><img src="/asset/image/entity/player/player-spear-t7.svg" style="width: 192px;margin: 0 475px -95px 0;transform: rotate(152deg);"><img src="/asset/image/entity/pet-ghost/pet-ghost-t1-base.svg" style="width: 48px;margin: 0 300px -100px 0;transform: rotate(167deg);">`]

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
};

let css2 = `
.hud-intro::before {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/924865286719557672/BG_Mirai_Light.webp');
    background-size: cover;
}

.hud-intro .hud-intro-form .hud-intro-play {
    width: 150px;
    height: 150px;
    transform: rotate(45deg);
    border: 3px solid white;
    margin: -150px 0 0 500px;
    background-image: url(https://cdn.discordapp.com/attachments/854376044522242059/925724425796616192/hmm.webp);
    background-size: 145%;
    padding: 0 0 0 0;
    background-position-y: center;
    background-position-x: center;
    transition: all 0.15s ease-in-out;
}
.hud-intro .hud-intro-form .hud-intro-play:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://cdn.discordapp.com/attachments/854376044522242059/925724425796616192/hmm.webp);
}
.hud-intro .hud-intro-form .hud-intro-name {
    line-height: none;
    margin: 0 0 -80px 170px;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://cdn.discordapp.com/attachments/854376044522242059/925743376505118720/light2.webp);
    background-position-x: 130px;
}
.hud-intro .hud-intro-form .hud-intro-server {
    display: block;
    line-height: unset;
    margin: 130px 0 0 170px;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://cdn.discordapp.com/attachments/854376044522242059/925743376505118720/light2.webp);
}
.hud-intro .hud-intro-main .hud-intro-left, .hud-intro .hud-intro-main .hud-intro-form, .hud-intro .hud-intro-main .hud-intro-guide {
    background: rgba(0, 0, 0, 0);
    margin: 0 530px 0 0;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: lightpink;
}

input:focus + .slider {
  box-shadow: 0 0 1px lightpink;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(30px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #3177b0;
}
.btn-pale {
    background-color: #ffffff;
    color: black;
    text-shadow: none;
}
.btn-blue:hover .btn-blue:active {
background-color: #4fa7ee;
}
.border-white {
    border: 3px solid white;
    border-radius: 4px;
    background: none;
    transition: all 0.15s ease-in-out;
}
.border-white:hover {
    cursor: pointer;
}
.border-red {
    border: 3px solid orangered;
    border-radius: 4px;
    background: none;
    transition: all 0.15s ease-in-out;
}
.border-red:hover {
    cursor: pointer;
}
.hud-zipz-tabs {
    position: relative;
    height: 40px;
    line-height: 40px;
    margin: 0 20px -18px 0;
}
.hud-zipz123-link-tab {
    display: block;
    float: left;
    padding: 0 14px;
    margin: 0 1px -10px 0;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.15s ease-in-out;
    line-height: 40px;
    border-width: 0;
}
.hud-zipz123-link-tab:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #eee;
}
.zipz123-is-active {
    background: rgba(0, 0, 0, 0.2);
    color: #eee;
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-image: url(https://cdn.discordapp.com/attachments/854376044522242059/924927754326142976/whiteslider.png);
}
.hud-health-bar::after {
    content: '';
}
.hud-chat .hud-chat-message {
    white-space: unset;
    word-break: break-word;
}
.hud-chat .hud-chat-messages {
    max-height: 340px;
    min-height: 35px;
}
.hud-chat {
    height: 280px;
    width: 450px;
}
.hud-leaderboard {
    word-break: break-word;
}
 #hud-menu-party {
    top: 51%;
    width: 610px;
    height: 480px;
    background-color: ${themeColor};
    border: 5px solid white;
}
 .hud-menu-party .hud-party-grid .hud-party-link.is-active {
    background: lightblue !important;
}
 .hud-menu-party .hud-party-visibility {
     margin: 10px 0 0 0;
     width: 125px;
}
 .hud-popup-overlay .hud-popup-confirmation .hud-confirmation-actions .btn.btn-green {
    background: #649db0;
}
 #hud-menu-shop {
    top: 54.5%;
    left: 50.5%;
    width: 690px;
    height: 500px;
    background-color: ${themeColor};
    border: 5px solid white;
    margin: -350px 0 0 -350px;
    padding: 20px 20px 20px 20px;
    z-index: 20;
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip {
    background: #649db0;
}
#hud-menu-settings {
    background-color: ${themeColor};
    border: 5px solid white;
}
.hud-respawn {
   opacity: 0.90
}
.hud-respawn .hud-respawn-info .hud-respawn-btn {
   background: #2ba0c2;
}
.hud-respawn .hud-respawn-info .hud-respawn-btn:hover {
   background: #4fc3e5;
}
#hud-building-overlay {
    background-color: ${themeColor};
    border: 1px solid white;
}
.btn.btn-green.hud-building-upgrade {
    background-color: #83b4c1;
}
.hud-building-overlay .hud-tooltip-health .hud-tooltip-health-bar {
    background: #a1d5e3;
}
.hud-building-overlay .hud-building-upgrade.is-disabled {
    background: lightblue !important;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
    height: 50px;
}
.hud-menu-zipp3 {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 800px;
    height: 700px;
    margin: -350px 0 0 -400px;
    padding: 20px;
    background-color: rgb(61 115 157 / 55%);
    color: #eee;
    border-radius: 4px;
    border: 5px solid white;
    z-index: 15;
}
.hud-menu-zipp3 h3 {
    display: block;
    margin: 0;
    line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
    display: block;
    height: 580px;
    padding: 10px;
    margin-top: 18px;
    background: rgba(0, 0, 0, 0.2);
    overflow-x: auto;
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
    background-image: url("https://cdn.discordapp.com/avatars/789082958287470613/e2c0a285017f3db9d25b576c04a6abd4.webp?size=1024");
}
* {
   font-family: Hammersmith One;
}
.hud-menu-zipp3 .hud-the-tab {
     position: relative;
     height: 40px;
     line-height: 40px;
     margin: 20px;
     border: 0px solid rgb(0, 0, 0, 0);
}
 .hud-menu-zipp3 .hud-the-tab {
     display: block;
     float: left;
     padding: 0 14px;
     margin: 0 1px 0 0;
     font-size: 14px;
     background: rgba(0, 0, 0, 0.4);
     color: rgba(255, 255, 255, 0.4);
     transition: all 0.15s ease-in-out;
}
 .hud-menu-zipp3 .hud-the-tab:hover {
     background: rgba(0, 0, 0, 0.2);
     color: #eee;
     cursor: pointer;
}
 * {
     font-family: Hammersmith One;
}
 #zsd {
     display: flex;
     position: absolute;
     top: -20px;
     z-index: 10;
     right: 300px;
}
 .zsd-icons {
     display: block;
     position: relative;
     width: 56px;
     height: 56px;
     margin: 0 0 1px;
     background: rgba(0, 0, 0, 0.2);
     color: rgba(255, 255, 255, 0.7);
     font-size: 12px;
     text-align: center;
     transition: all 0.15s ease-in-out;
     border: none;
}
 .zsd-icons:hover {
     color: #eee;
     cursor: pointer;
}
 .hud-e4-anchor {
     position: relative;
     display: block;
     float: left;
     width: 100%;
     height: 64px;
     margin: 0 0 10px;
     padding: 10px 10px 10px 64px;
     text-decoration: none;
     background: rgba(255, 255, 255, 0.1);
     color: #eee;
     border-radius: 3px;
     transition: all 0.15s ease-in-out;
     text-align: left;
}
 .hud-e4-anchor::after {
     content: ' ';
     display: block;
     position: absolute;
     top: 13px;
     left: 16px;
     bottom: 16px;
     width: 32px;
     height: 32px;
     background-size: contain;
     background-position: center;
     background-repeat: no-repeat;
     opacity: 0.9;
     transition: all 0.15s ease-in-out;
}
 .hud-e4-anchor[data-item=record]::after {
     background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916849867370938450/WHITE.png');
}
 .hud-e4-anchor[data-item=build]::after {
     background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916853186491469914/ALSO_WHITE.png');
}
 .hud-e4-anchor[data-item=deletebase]::after {
     background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916854543977955348/WHITE_CIRCLE.png');
}

/* snap title i copied from stackoverflow lol */

.snapItem {
  position: absolute;
}

.topItem {
  position: sticky;
  top: 0;
}

`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";

function getElem(DOMClass) {
    return document.getElementsByClassName(DOMClass);
}

function getId(DOMId) {
    return document.getElementById(DOMId);
}

getElem("hud-intro-play")[0].innerText = "";

getElem("hud-intro-form")[0].insertAdjacentHTML("beforeend", `
<span id="playspan" style="position: absolute;margin: -130px 0 0 415px;font-weight: 900;font-size: xx-large;text-shadow: 0px 0px 10px black;cursor: pointer;font-family: 'Open Sans';pointer-events: none;">Play</span>
`);

getElem('hud-intro-main')[0].insertAdjacentHTML("beforeend", `
<img src="https://cdn.discordapp.com/attachments/854376044522242059/926035565554589696/scan.webp" style="cursor: pointer;width: 120px;margin: -40px 0 0 -260px;" onclick="window.ssfi();" />
<img src="https://cdn.discordapp.com/attachments/854376044522242059/924867900655935508/download.png" style="display: block;position: absolute;margin: 200px 0 0 220px;" />
`);
getElem('hud-intro-corner-bottom-right')[0].insertAdjacentHTML("afterbegin", `
   <div id="namesaver" style="background-color: rgba(1, 1, 1, 0.2);border-radius: 4px;"></div>
`);

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
getElem("hud-spell-icons")[0].appendChild(spell);

getElem("hud-center-left")[0].style.zIndex = "19";
getElem("hud-bottom-left")[0].style.zIndex = "19";
getElem("hud-chat")[0].style.zIndex = "19";

document.addEventListener('keyup', function (e) {
    if (e.key === "Enter" && game.ui.playerTick.dead === 1) {
        game.ui.components.Chat.startTyping();
    };
});

let bossAlert = document.createElement('p');
bossAlert.innerHTML = `<i class="fa fa-exclamation-triangle"></i> Boss wave incoming`;
bossAlert.style.display = "none";
bossAlert.style.color = "white";
bossAlert.style.opacity = '0.5';
getElem('hud-top-center')[0].appendChild(bossAlert);

let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<div class="hud-zipz-tabs">
<a class="BD hud-zipz123-link-tab" style="width: 16%;border-radius: 3px 0 0 0;">Builder</a>
<a class="PL hud-zipz123-link-tab" style="width: 16%">Players</a>
<a class="OT hud-zipz123-link-tab" style="width: 16%">Miscellaneous</a>
<a class="WE hud-zipz123-link-tab" style="width: 16%;border-radius: 0 3px 0 0;">Sockets</a>
</div>
<div class="hud-zipp-grid3">
</div>
</div>
`;

document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = getElem("hud-menu-zipp3")[0];
zipz123.style.overflow = "auto";

getElem("hud-zipp3-icon")[0].addEventListener("click", function() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        getId("hud-menu-shop").style.display = "none";
        getId("hud-menu-party").style.display = "none";
        getId("hud-menu-settings").style.display = "none";
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
    };
});

let _menu = getElem("hud-menu-icon");
let _spell = getElem("hud-spell-icon");
let allIcon = [
    _menu[0],
    _menu[1],
    _menu[2],
    _spell[0],
    _spell[1]
];

for (let elem of allIcon) {
    elem.addEventListener("click", function() {
        if(zipz123.style.display == "block") {
            zipz123.style.display = "none";
        };
    });
};

getElem('hud')[0].addEventListener('mousedown', () => {
    zipz123.style.display = "none";
})

function quickcast(elem, identifier) {
    getElem(elem)[0].addEventListener("click", function() {
        displayAllToNone();
        getElem(elem)[0].classList.add("zipz123-is-active");
        getElem(identifier)[0].style.display = "block";
    })
}

quickcast("BD", "i");
quickcast("PL", "i2");
quickcast("OT", "i3");
quickcast("WE", "i4");

function displayAllToNone() {
    getElem("BD")[0].classList.remove("zipz123-is-active");
    getElem("PL")[0].classList.remove("zipz123-is-active");
    getElem("OT")[0].classList.remove("zipz123-is-active");
    getElem("WE")[0].classList.remove("zipz123-is-active");
    getElem("i")[0].style.display = "none";
    getElem("i2")[0].style.display = "none";
    getElem("i3")[0].style.display = "none";
    getElem("i4")[0].style.display = "none";
};

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 220:
            /* key \ */
            document.getElementsByClassName("hud-zipp3-icon")[0].click();
    }
});

getElem("hud-zipp-grid3")[0].innerHTML = `
<div><br>

<div class="i">

<div style="text-align: left;">
<button id="1i" class="border-white" style="margin: 4px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/wall/wall-t1-base.svg" style="width: 40px;"></button>
<button id="2i" class="border-white" style="margin: 4px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/door/door-t1-base.svg" style="width: 40px;"></button>
<button id="3i" class="border-white" style="margin: 4px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/slow-trap/slow-trap-t1-base.svg" style="width: 40px;"></button>
<br />
<button id="4i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t1-head.svg" style="width: 55px;position: relative;transform: translate(-10%, -100%);"></button>
<button id="5i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t1-head.svg" style="width: 60px;position: relative;transform: translate(-10%, -95%);"></button>
<button id="6i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/melee-tower/melee-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/melee-tower/melee-tower-t1-middle.svg" style="width: 40px;position: relative;transform: translate(30%, -141%);"><img src="/asset/image/entity/melee-tower/melee-tower-t1-head.svg" style="width: 35px;position: relative;transform: translate(-5%, -220.5%);"></button>
<br />
<button id="7i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/bomb-tower/bomb-tower-t1-base.svg" style="width: 48px;"></button>
<button id="8i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/mage-tower/mage-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/mage-tower/mage-tower-t1-head.svg" style="width: 25px;position: relative;transform: translate(-0%, -160%);"></button>
<button id="9i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-mine/gold-mine-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/gold-mine/gold-mine-t1-head.svg" style="width: 45px;position: relative;transform: translate(-0%, -110%);"></button>
<br />
<button id="10i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/harvester/harvester-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/harvester/harvester-t1-head.svg" style="width: 50px;position: relative;transform: translate(-5%, -125%);"></button>
<button id="11i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/pet-ghost/pet-ghost-t1-base.svg" style="width: 39.5px;"></button>
<button id="0i" class="border-white" style="margin: 4px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-stash/gold-stash-t1-base.svg" style="width: 48px;"></button>

</div>

<div style="text-align: right;margin: -260px 0 0 0;padding: 0 0 0 120px;">

<button id="12i" class="btn btn-blue" style="width: 30%;margin: 0 0 5px 0;">Enable Auto Upgrade</button>

<button id="13i" class="btn btn-blue" style="width: 30%;margin: 0 0 5px 0;">Enable Rebuilder</button>

<br>

<button id="14i" class="btn btn-blue" style="width: 30%;">Enable 5x5 Walls</button>

<button id="15i" class="btn btn-blue" style="width: 30%;">Enable AHRC</button>

</div>

<div style="margin: 210px 0 0 0;">

<a class="hud-e4-anchor" data-item="record">
    <strong>Record Base</strong>
    <span style="color: rgba(255, 255, 255, 0.4);font-size: 13px;display: flex;">Record your base with this button!</span>
    <button class="btn btn-blue" onclick="RecordBase('RecordBase1');" style="display: flex;position: absolute;bottom: 12px;right: 120px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">1</button>
    <button class="btn btn-blue" onclick="RecordBase('RecordBase2');" style="display: flex;position: absolute;bottom: 12px;right: 65px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">2</button>
    <button class="btn btn-blue" onclick="RecordBase('RecordBase3');" style="display: flex;position: absolute;bottom: 12px;right: 10px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">3</button>
</a>

<a class="hud-e4-anchor" data-item="build">
    <strong>Build Base</strong>
    <span style="color: rgba(255, 255, 255, 0.4);font-size: 13px;display: flex;">Build your mediocre base with this button!</span>
    <button class="btn btn-blue" onclick="buildRecordedBase('RecordBase1');" style="display: flex;position: absolute;bottom: 12px;right: 120px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">1</button>
    <button class="btn btn-blue" onclick="buildRecordedBase('RecordBase2');" style="display: flex;position: absolute;bottom: 12px;right: 65px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">2</button>
    <button class="btn btn-blue" onclick="buildRecordedBase('RecordBase3');" style="display: flex;position: absolute;bottom: 12px;right: 10px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">3</button>
</a>

<a class="hud-e4-anchor" data-item="deletebase">
    <strong>Delete Base</strong>
    <span style="color: rgba(255, 255, 255, 0.4);font-size: 13px;display: flex;">Delete your misery with this button!</span>
    <button class="btn btn-blue" onclick="DeleteRecordedBase('RecordBase1');" style="display: flex;position: absolute;bottom: 12px;right: 120px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">1</button>
    <button class="btn btn-blue" onclick="DeleteRecordedBase('RecordBase2');" style="display: flex;position: absolute;bottom: 12px;right: 65px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">2</button>
    <button class="btn btn-blue" onclick="DeleteRecordedBase('RecordBase3');" style="display: flex;position: absolute;bottom: 12px;right: 10px;font-size: 12px;line-height: 20px;flex-direction: row;align-items: center;">3</button>
</a>

</div>

</div>

<div class="i2">
${getRandomItem(imageArray1)}

<div style="display: flex;flex-direction: column;align-content: stretch;align-items: flex-end;margin: -40px 0 100px 0;">

<button id="0i2" class="btn btn-red" style="width: 40%;;margin: 0 0 5px 0;">Disable Auto Heal</button>

<button id="1i2" class="btn btn-red" style="width: 40%;;margin: 0 0 20px 0;">Disable Auto Revive</button>

<button id="2i2" class="btn btn-blue" style="width: 40%;border-bottom-right-radius: 0px;">Enable AutoAim</button>

<select id="aimOptions" class="btn" style="display:inline-block;border-top-right-radius: 0px;text-align: center;"><option value="pl" selected>Players</option><option value="zo">Zombies</option></select>

</div>

<div style="margin: -50px 0 0 0;">

<button id="3i2" class="btn btn-blue" style="width: 45%;margin: 0 0 5px 0;">Enable Chat Spam</button>

<input id="4i2" type="tel" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:45%;height:40px;margin: 0 0 5px 0;" placeholder="Your message here..." class="btn" >

<button id="5i2" class="btn btn-blue" style="width: 45%;margin: 0 0 5px 0;">Enable Auto Join</button>

<input id="6i2" type="tel" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:45%;height:40px;margin: 0 0 5px 0;" placeholder="insert PSK..." class="btn" >

<button id="7i2" class="btn btn-blue" style="width: 22%;margin: 0 0 5px 0;">Enable Navigator</button>

<select id="moveOptions" class="btn" style="width: 22.5%;margin: 0 5px 5px 0;"><option value="nn" selected>None</option><option value="ld">Last Dead</option><option value="lp">Last Found Player</option></select>

<p style="display: inline-block;">X:</p>

<input id="8i2" type="tel" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:19%;height:30px;margin: 10px 0 5px 0;" placeholder="X..." class="btn" >

<p style="display: inline-block;">Y:</p>

<input id="9i2" type="tel" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:19%;height:30px;margin: 10px 0 5px 0;" placeholder="Y..." class="btn" >

</div>

<div>

<button id="10i2" class="btn btn-green" style="width: 30%;margin: 0 0 5px 0;">Enable Recorder</button>

<button id="11i2" class="btn btn-red" style="width: 29%;margin: 0 0 5px 0;" onclick="window.clearRecord();">Clear Macro</button>

<button id="12i2" class="btn btn-blue" style="width: 30%;margin: 0 0 5px 0;">Enable Macro</button>

<br><br>

</div>

</div>

<div class="i3">

<div>

<button id="0i3" class="btn btn-green" style="width: 45%;">Give Party Sell</button>

<button id="1i3" class="btn btn-green" style="width: 45%;"">Kick All Members</button>

<button id="2i3" class="btn btn-blue" style="width: 45%;">Enable Auto Accept</button>

<button id="3i3" class="btn btn-blue" style="width: 45%;">Enable Auto Kick</button>

<button id="4i3" class="btn btn-blue" style="width: 45%;">Enable Auto Clear</button>

<button id="5i3" class="btn btn-blue" style="width: 45%;">Remove All Markers</button>

</div>

<div style="margin: 260px 0 0 0;">

<button id="6i3" class="border-white" style="width: 60px;height: 60px;margin: 3px;transform: translate(0, 2px);background-color: #698d41;"></button>

<button id="7i3" class="border-white" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/zombie-boss/zombie-boss-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/zombie-boss/zombie-boss-t1-weapon.svg" style="width: 90px;position: relative;transform: translate(-24%, -205%);"></button>

<button id="8i3" class="border-white" style="margin: 4px;padding: 1px;width: 60px;height: 60px;"><img src="/asset/image/map/map-tree.svg" style="width: 50px;"></button>

<br>

<button id="9i3" class="border-white" style="margin: 2px;padding: 1px;width: 60px;height: 60px;transform: translate(0px, -3px);"><img src="/asset/image/entity/arrow-tower/arrow-tower-projectile.svg" style="width: 23px;"></button>

<button id="10i3" class="border-white" style="margin: 2px;padding: 1px;width: 60px;height: 60px;background-color: #383838;"></button>

<button id="11i3" class="border-white" style="margin: 3px;padding: 10px;width: 60px;height: 60px;transform: translate(0px, -18px);"><i class="fa fa-ban fa-2x" style="color: white;"></i></button>

</div>

</div>

<div class="i4" style="text-align: left">
<br />
<button class="btn btn-purple" onclick="window.sendWs();">Send Alt</button>
<button class="btn btn-purple" id="sendAITO">Start Aito!</button>
<br />
<br />
<button class="btn btn-purple" id="sendFinder">Start Find Player</button>
<input id="findrank" type="number" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:20%;height:40px;" placeholder="Rank..." class="btn" >
<br />
<br />
<h2>Control</h2>
<button class="btn btn-purple emm">Enable MouseMove</button>
<button class="btn btn-purple epf">Enable Player Follower</button>
<br />
<br />
<button class="btn btn-purple ecp">Enable Click Position</button>
<br />
<br />
<button class="btn btn-purple controlon">Control</button>
<button class="btn btn-red controloff">!Control</button>
<br />
<br />
<h2>Options</h2>
<button class="btn btn-red" onclick="window.resetColor()">Reset Color</button>
<button id="coloralt" class="btn btn-purple" onclick="window.resetColor()">Set Random Color</button>
<button id="resp" class="btn btn-purple">Respawn</button>
<br />
<br />
<h2>Delete</h2>
<button class="btn btn-red" id="deleteAllAlt">Delete All Alts</button>
<br />
<br />
<input id="deletealtplaceholder" type="tel" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:220px;height:40px" placeholder="Enter Your Alt's Id">
<button class="btn btn-red" id="deleteAlt">Delete Alt</button>
<br />
<br />
<h2>Utilities</h2>
<button class="btn btn-purple tier2spear">Enable Auto Buy Spear?</button>
<input id="speartier" type="number" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:20%;height:40px;" placeholder="Tier..." class="btn" >
<br />
<button class="btn btn-purple tglpt">Enable Player Trick?</button>
<br />
<button id="changeparty" class="btn btn-purple">Constantly Change Alts' Party?</button>
<button class="btn btn-purple tglraid">Toggle Auto-raid?</button>
<br />
<button id="anticarl" class="btn btn-purple">Enable Immunity</button>
<br />
<br />
<hr>
<div id="altstate"></div>
<hr>
<div id="altrss"></div>
</div>
`;

displayAllToNone();
getElem("BD")[0].click();

window.addName = name => {
    if (name == "") return;
    let id = `u${Math.floor(Math.random() * 9999)}`;
    localStorage.names = `${localStorage.names || ""}<div id="${id}"><button onclick="document.querySelector('.hud-intro-name').value = \`${name.replaceAll('`', '\`')}\`" class="btn btn-pale" style="margin-bottom: 3px;">${name}</button></div>`;
};
(window.refreshNS = () => {
    getId("namesaver").innerHTML = `
<div style="overflow-x: auto; height: 200px;margin-bottom: 10px;display: flex;flex-direction: column-reverse;">
${localStorage.names || "<h2>It's empty...<h2>"}
</div>
<input type="text" class="search-bar" style="width: 135px;background-color: rgba(0,0,0,0);padding: 4px 5px;border-radius: 8px;color: rgba(255,255,255,0.7); border: 2px solid white;height: 30px;line-height: 30px;margin-right: 2px;" id="inpn" />
<button class="btn btn-pale" onclick="window.addName(document.getElementById('inpn').value); window.refreshNS();" style="height: 30px;line-height: 30px;">Add name</button>
`;
})();

const entirePop = getElem("hud-intro-wrapper")[0].children[1];
const popRequest = new XMLHttpRequest();
popRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(popRequest.responseText);
        entirePop.innerHTML = `People in game now: ${data.players} - ${(data.players / data.capacity * 100).toFixed(2)}% / ${data.capacity}`;
        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${data.regions[servers[i]].players}`);
        }
    }
};
popRequest.open("GET", "http://zombs.io/capacity", true);
popRequest.send();

getElem("hud-intro-play")[0].addEventListener("click", () => {
    getId('playspan').style.display = "none";
})

let zoomLevel = 1;
let dimension = 1;
let upd = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = canvasHeight / (1080 * dimension);
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
};
const onWindowResize = () => {
    if (window.zoomonscroll) {
        upd();
    }
} // Zoom by Apex, modified by eh
onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.02;
    } else if (e.deltaY < 0) {
        dimension -= 0.02;
    }
    onWindowResize();
}

window.zoom = val => {
    dimension = val;
    upd();
};

getElem('hud-top-right')[0].insertAdjacentHTML("beforeend", `
<div id="zsd">
    <a class="zsd-icons" style="z-index: 14;padding: 10px 0 0 0px;" onclick="window.zoomOut();">
        <i class="fa fa-arrow-up fa-2x" style="margin-top: 5px;border-bottom-left-radius: 4px;"></i>
    </a>
    <a class="zsd-icons" style="z-index: 14;padding: 16px 0 0 0;" onclick="window.resetZoom();">
        <i class="fa fa-undo fa-lg" style="margin-top: 5px;"></i>
    </a>
    <a class="zsd-icons" style="z-index: 14;padding: 10px 0 0 0px;border-bottom-right-radius: 4px;" onclick="window.zoomIn();">
        <i class="fa fa-arrow-down fa-2x" style="margin-top: 5px;"></i>
    </a>
</div>
`);

window.zoomOut = () => {
    zoomLevel += 1;
};
window.zoomIn = () => {
    zoomLevel -= 1;
};
window.resetZoom = () => {
    zoomLevel = 1;
};

// actual code starts here
const options = {
    AHRC: false,
    wallBlock: false,
    rebuild: false,
    autoUpgrade: false,
    autoBow: false,
    autoAim: false,
    accept: false,
    kick: false,
    spamJoin: false,
    spamChat: false,
    heal: true,
    revive: true,
    clearMsgs: false,
    recordMacro: false,
    macro: false,
    stopMacro: false,
    moving: false,

    // socket options
    autofill: false,
    aito: false,
    finder: false,
    antiAttack: false,
    randomParty: false,
    rwp: false,
    ar: false,
}

let getRss = false;
let allowed1 = true;

const petTokens = [100, 100, 100, 100, 200, 200, 300, Infinity];
const spearCostArray = [1400, 4200, 9800, 21000, 43500, 88500, 178500];

let checkedHarvesters = new Set();
let workingHarvesters = new Set();

// auto rb + auto upgrade
let buildings = {};
let savedBase = {};
let toBeReplaced = {};
let toBeUpgraded = {};
let autoUpgradeList = {};

// ws indentifiers
let altname = 1;

function randomCharacterGenerator(textLength = 29) {
    let availableCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~!@#$%^&*()_+`-=[]{};':,./<>?\|";
    let randomtext = "";
    for (let i = 0; i < textLength; i++) randomtext += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    return randomtext;
}

function garbageGenerator(garbageLength = 25) {
    let garbageCharacters = "Æ±Ù„ÙÙØ¨ÙØ§Ø¡ØªÙØ§Ø¡Ø«ÙØ§Ø¡Ø¬ÙÙŠÙ…ØÙØ§Ø¡Ø®ÙØ§Ø¡Ø¯ÙØ§Ù„Ø°ÙØ§Ù„Ø±ÙØ§Ø¡Ø²ÙØ§ÙŠØ³ÙÙŠÙ†Ø´ÙÙŠÙ†ØµÙØ§Ø¯Ø¶ÙØ§Ø¯Ø·ÙØ§Ø¡Ø¸ÙØ§Ø¡Ø¹ÙÙŠÙ’Ù†ØºÙÙŠÙ’Ù†ÙÙØ§Ø¡Ù‚ÙØ§ÙÙƒÙØ§ÙÙ„Ø§ÙÙ…Ù…ÙÙŠÙ…Ù†ÙÙˆÙ†Ù‡ÙØ§Ø¡ÙˆÙØ§ÙˆÙŠÙØ§Ø¡Ù‡ÙÙ…Ù’Ø²Ø©Ø£ÙÙ„ÙÙ Ù‡ÙÙ…Ù’Ø²Ø©ÙˆÙØ§Ùˆ Ù‡ÙÙ…Ù’Ø²Ø©ÙŠÙØ§Ø¡ Ù‡ÙÙ…Ù’Ø²Ø©Ø£ÙÙ„ÙÙ Ù…ÙØ¯ÙÙ‘Ø©	ØªØ§Ø¡ Ù…Ø±Ø¨ÙˆØ·Ø©Ø§Ù„Ù Ù…Ù‚ØµÙˆØ±Ø©Æ¾Æ´È¶ÈµÈ´Æ¿È¹Î¨Ï¥Ï È¿Ï‰ÏÏ¼Ğ–Ğ‰Î¶Æ»ÏªÏ€Ï¡Ô€ÔÔ‚ÔƒÔ„Ô…Ô†Ô‡ÔˆÔ‰ÔŠÔ‹ÔŒÔÔÔÔÔ‘Ô’Ô“Ô”Ô•Ô–Ô—Ô˜Ô™ÔšÔ›ÔœÔÔÔŸÔ Ô¡Ô¢Ô£Ô¤Ô¥Ô¦Ô§Ô¨Ô©ÔªÔ«Ô¬ÔÔ®Ô¯ÏÎ·";
    let garbage = "";
    for (let i = 0; i < garbageLength; i++) garbage += garbageCharacters[Math.floor(Math.random() * garbageCharacters.length)];
    return garbage;
};

const measureDistance = (obj1, obj2) => {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return Math.abs((xDif**2) + (yDif**2));
};

function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

function copyText(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

Game.currentGame.network.addEntityUpdateHandler(() => {
    if (game.world.inWorld) {
        if (options.AHRC) {
            for (let uid in game.world.entities) {
                const entity = game.world.entities[uid];
                if (entity.targetTick.model == "Harvester" && entity.targetTick.partyId == game.ui.playerPartyId) {
                    if (checkedHarvesters.has(uid)) {
                        if (entity.fromTick.stone !== entity.targetTick.stone || entity.fromTick.wood !== entity.targetTick.wood) {
                            workingHarvesters.add(uid);
                        };
                    } else {
                        checkedHarvesters.add(uid);
                        game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: 0.69});
                    };
                };
                if (workingHarvesters.has(uid)) {
                    let amount = entity.fromTick.tier * 0.05 - 0.02;
                    game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: amount});
                    game.network.sendRpc({name: "CollectHarvester", uid: parseInt(uid)});
                };
            };
        }
        if (options.autoBow) {
            game.network.sendInput({space: 0})
            game.network.sendInput({space: 1})
        }
        if (options.kick) {
            if (!window.kick) {
                window.kick = true;
                if (game.ui.playerPartyMembers.length > 1) {
                    Game.currentGame.network.sendRpc({name: "KickParty", uid: Game.currentGame.ui.playerPartyMembers[1].playerUid});
                };
                setTimeout(() => { window.kick = false; }, 1500);
            }
        }
        if (options.clearMsgs) {
            for (let i = 0; i < getElem('hud-chat-message').length; i++) getElem('hud-chat-message')[0].remove();
        }
        if (options.spamChat && getId('4i2').value) {
            game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${garbageGenerator()}  ${getId('4i2').value}  ${garbageGenerator()}`});
        }
        if (options.spamJoin) {
            game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: getId('6i2').value + ""});
        }
        if (options.autoAim) {
            window.targets = [];
            let entities = game.renderer.npcs.attachments;

            for (let i in entities) {
                if (getId('aimOptions').value == 'pl' ?
                    (entities[i].fromTick.model == "GamePlayer" && entities[i].fromTick.uid !== game.ui.playerTick.uid && entities[i].targetTick.partyId !== game.ui.playerPartyId && entities[i].fromTick.dead == 0) :
                    (entities[i].fromTick.model !== "GamePlayer" && entities[i].entityClass !== "Projectile" && entities[i].fromTick.model !== "NeutralTier1")) {
                    window.targets.push(entities[i].fromTick);
                };
            };
            if (window.allSockets.length) {
                for (let i of window.allSockets) {
                    let alt = window.targets.find(e => e.uid == i.uid);
                    if (!!alt) window.targets.splice(window.targets.indexOf(alt), 1);
                }
            }
            if (window.targets.length > 0) {
                const myPos = game.ui.playerTick.position;
                window.targets.sort((a, b) => {
                    return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
                });

                const target = window.targets[0];
                let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
                game.inputPacketCreator.lastAnyYaw = reversedAim;
                game.network.sendPacket(3, {mouseMoved: reversedAim});
            }
        };
    }
    if (!window.zoomonscroll) {
        window.zoom(zoomLevel);
    };
    if (getRss) {
        !allowed1 && (allowed1 = true);
    }
    if (getRss || allowed1) {
        for (let i in game.renderer.npcs.attachments) {
            if (game.renderer.npcs.attachments[i].fromTick.name) {
                let player = game.renderer.npcs.attachments[i];
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                let timeout_1 = "";
                if (getRss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                }
                if (!getRss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    player.targetTick.oldName = null;
                }
                if (getRss) {
                    if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldWood = wood_1;
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;

                        player.targetTick.info = `
                               ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
                               UID: ${player.targetTick.uid}
                               W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
                               x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
                               partyId: ${Math.round(player.targetTick.partyId)}
                               timeDead: ${msToTime(player.targetTick.timeDead)}
                               ${player.targetTick.isPaused ? "On Timeout" : ""}
                        `;

                        player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    };
                };
            };
        };
    };
    if (!getRss) {
        allowed1 = false;
    };
});

document.addEventListener("keydown", e => {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key == '-') {
            getRss = !getRss;
        }
    }
})

Game.currentGame.ui._events.playerPetTickUpdate.push(pet => {
    if (options.revive && pet.health <= 0) {
        Game.currentGame.network.sendRpc({
            name: "BuyItem",
            itemName: "PetRevive",
            tier: 1
        });
        Game.currentGame.network.sendRpc({
            name: "EquipItem",
            itemName: "PetRevive",
            tier: 1
        });
    }
    if (options.heal) {
        let petHealth = (pet.health / pet.maxHealth) * 100;
        if (petHealth <= 20) {
            game.network.sendRpc({
                name: "BuyItem",
                itemName: "PetHealthPotion",
                tier: 1
            });
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "PetHealthPotion",
                tier: 1
            });
        };
    };
    if (window.tokenHeal && pet.health < pet.maxHealth && game.ui.playerTick.token >= petTokens[pet.tier - 1]) {
        game.network.sendRpc({
            name: "BuyItem",
            itemName: pet.model,
            tier: pet.tier + 1
        });
    };
});

game.ui._events.playerTickUpdate.push(player => {
    if (options.heal) {
        let playerHealth = (player.health / player.maxHealth) * 100;
        if (playerHealth <= 20) healPlayer();
    }
});

game.network.addRpcHandler("PartyApplicant", e => {
    if (options.accept) {
        game.network.sendRpc({name: "PartyApplicantDecide", applicantUid: e.applicantUid, accepted: 1 });
    };
});

game.network.addRpcHandler("Dead", () => {
    window.deadPos = game.ui.playerTick.position;
});

function sellAllByType(type) {
    if (!game.ui.playerPartyCanSell) return;

    let sellInterval = () => {
        let target = Object.values(game.ui.buildings).find(e => e.type == type);
        if (target !== undefined) {
            Game.currentGame.network.sendRpc({ name: "DeleteBuilding", uid: target.uid });

            setTimeout(() => {
                sellInterval();
            }, 100);
        }
    }
    sellInterval();
};

const addFunctionToElem = (id, option, buttonText, colors = 'btn-red?btn-green', onCallback, offCallback) => {
    getId(id).addEventListener('click', e => {
        let toggleColor = colors.split('?');
        if (options[option] === false) {
            options[option] = true;
            e.target.classList.remove(toggleColor[1]);
            e.target.classList.add(toggleColor[0]);
            e.target.innerText = `Disable ${buttonText}`;
            onCallback?.();
        } else {
            options[option] = false;
            e.target.classList.remove(toggleColor[0]);
            e.target.classList.add(toggleColor[1]);
            e.target.innerText = `Enable ${buttonText}`;
            offCallback?.();
        }
    });
}

getId("0i").addEventListener('click', function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete all towers?", 1e4, function() {
        let sellInterval = () => {
            if (Object.keys(game.ui.buildings).length > 1 && game.ui.playerPartyCanSell) {
                Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: parseInt(Object.keys(game.ui.buildings)[1])});
                setTimeout(() => { sellInterval(); }, 100);
            }
        }
        sellInterval();
    })
})

getId("1i").addEventListener('click', () => { sellAllByType("Wall") });
getId("2i").addEventListener('click', () => { sellAllByType("Door") });
getId("3i").addEventListener('click', () => { sellAllByType("SlowTrap") });
getId("4i").addEventListener('click', () => { sellAllByType("ArrowTower") });
getId("5i").addEventListener('click', () => { sellAllByType("CannonTower") });
getId("6i").addEventListener('click', () => { sellAllByType("MeleeTower") });
getId("7i").addEventListener('click', () => { sellAllByType("BombTower") });
getId("8i").addEventListener('click', () => { sellAllByType("MagicTower") });
getId("9i").addEventListener('click', () => { sellAllByType("GoldMine") });
getId("10i").addEventListener('click', () => { sellAllByType("Harvester") });
getId("11i").addEventListener('click', () => { Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()}); });

addFunctionToElem('15i', 'AHRC', 'AHRC', 'btn-red?btn-blue');
addFunctionToElem('0i2', 'heal', 'Auto Heal');
addFunctionToElem('1i2', 'revive', 'Auto Revive');
addFunctionToElem('2i2', 'autoAim', 'AutoAim', 'btn-red?btn-blue');
addFunctionToElem('3i2', 'spamChat', 'Chat Spam', 'btn-red?btn-blue');
addFunctionToElem('5i2', 'spamJoin', 'Auto Join', 'btn-red?btn-blue');
addFunctionToElem('7i2', 'moving', 'Navigator', 'btn-red?btn-blue',
                  () => getId('moveOptions').value == 'nn' ? window.goToPos(getId('8i2').value, getId('9i2').value) : getId('moveOptions').value == 'ld' ? window.goToPos(window.deadPos.x, window.deadPos.y) : window.goToPos(window.playerX, window.playerY),
                  () => { options.moving = false; });
addFunctionToElem('10i2', 'recordMacro', 'Recorder', 'btn-red?btn-green', () => { window.macroActions.created = Date.now(); });
addFunctionToElem('12i2', 'macro', 'Macro', 'btn-red?btn-blue', () => { window.macro(); }, () => { options.stopMacro = true; });
addFunctionToElem('2i3', 'accept', 'Auto Accept', 'btn-red?btn-blue');
addFunctionToElem('3i3', 'kick', 'Auto Kick', 'btn-red?btn-blue');
addFunctionToElem('4i3', 'clearMsgs', 'Auto Clear', 'btn-red?btn-blue');

addFunctionToElem('sendFinder', 'finder', 'Find Player', 'btn-red?btn-purple', () => { window.playerFinder(); });
addFunctionToElem('sendAITO', 'aito', 'AITO', 'btn-red?btn-purple', () => window.sendAitoAlt(), () => { options.aito = false; });
addFunctionToElem('changeparty', 'randomParty', 'Random Party');
addFunctionToElem('anticarl', 'antiAttack', 'Immunity', 'btn-red?btn-purple');

getId("5i3").addEventListener('click', function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete all map markers?", 1e4, function() {
        while (document.getElementsByClassName('map-display').length > 0) {
             document.getElementsByClassName('map-display')[0].remove();
        };
    })
})

getId("deleteAlt").addEventListener('click', function() {
    let id = Math.floor(getId("deletealtplaceholder").value);

    window.allSockets[id-1].close();
})

document.getElementsByClassName("emm")[0].addEventListener('click', function() {
    window.mousemove = !window.mousemove;
    this.innerText = window.mousemove ? "Disable MouseMove" : "Enable MouseMove"
    this.className = window.mousemove ? "btn btn-red emm" : "btn btn-purple emm"
})
document.getElementsByClassName("epf")[0].addEventListener('click', function() {
    window.altFollowPlayer = !window.altFollowPlayer;
    this.innerText = window.altFollowPlayer ? "Disable Player Follower" : "Enable Player Follower"
    this.className = window.altFollowPlayer ? "btn btn-red epf" : "btn btn-purple epf"
})
document.getElementsByClassName("ecp")[0].addEventListener('click', function() {
    window.mouseclick = !window.mouseclick;
    this.innerText = window.mouseclick ? "Disable Click Position" : "Enable Click Position"
    this.className = window.mouseclick ? "btn btn-red ecp" : "btn btn-purple ecp"
})
document.getElementsByClassName("tier2spear")[0].addEventListener('click', function() {
    window.Join4Tier2Spear = !window.Join4Tier2Spear;
    this.innerText = window.Join4Tier2Spear ? "Disable Auto Buy Spear?" : "Enable Auto Buy Spear?"
    this.className = window.Join4Tier2Spear ? "btn btn-red tier2spear" : "btn btn-purple tier2pear"
})
document.getElementsByClassName("tglpt")[0].addEventListener('click', function() {
    window.shouldStartScript = !window.shouldStartScript;
    this.innerText = window.shouldStartScript ? "Disable Player Trick?" : "Enable Player Trick?"
    this.className = window.shouldStartScript ? "btn btn-red tglpt" : "btn btn-purple tglpt"
})
document.getElementsByClassName("tglraid")[0].addEventListener('click', function() {
    window.autoRaid = !window.autoRaid;
    this.className = window.autoRaid ? "btn btn-red tglraid" : "btn btn-purple tglraid"
})

document.getElementById("6i3").addEventListener('click', function() {
    window.ground();
    this.className = "border-white";
    if (window.groundtoggle) {
        this.className = "border-red";
    }
})
document.getElementById("7i3").addEventListener('click', function() {
    window.npc();
    this.className = "border-white";
    if (window.npctoggle) {
        this.className = "border-red";
    }
})
document.getElementById("8i3").addEventListener('click', function() {
    window.env();
    this.className = "border-white";
    if (window.envtoggle) {
        this.className = "border-red";
    }
})
document.getElementById("9i3").addEventListener('click', function() {
    window.pjt();
    this.className = "border-white";
    if (window.pjttoggle) {
        this.className = "border-red";
    }
})
document.getElementById("10i3").addEventListener('click', function() {
    window.everything();
    this.className = "border-white";
    if (window.everythingtoggle) {
        this.className = "border-red";
    }
})
document.getElementById("11i3").addEventListener('click', function() {
    window.rndr();
    this.className = "border-white";
    if (window.rndrtoggle) {
        this.className = "border-red";
    }
})

window.ground = () => {
    window.groundtoggle = !window.groundtoggle;
    if (window.groundtoggle) {
        game.renderer.ground.setVisible(false)
    } else {
        game.renderer.ground.setVisible(true)
    }
}
window.npc = () => {
    window.npctoggle = !window.npctoggle;
    if (window.npctoggle) {
        game.renderer.npcs.setVisible(false)
    } else {
        game.renderer.npcs.setVisible(true)
    }
}
window.env = () => {
    window.envtoggle = !window.envtoggle;
    if (window.envtoggle) {
        game.renderer.scenery.setVisible(false)
    } else {
        game.renderer.scenery.setVisible(true)
    }
}
window.pjt = () => {
    window.pjttoggle = !window.pjttoggle;
    if (window.pjttoggle) {
        game.renderer.projectiles.setVisible(false)
    } else {
        game.renderer.projectiles.setVisible(true)
    }
}
window.everything = () => {
    window.everythingtoggle = !window.everythingtoggle;
    if (window.everythingtoggle) {
        game.renderer.scene.setVisible(false)
    } else {
        game.renderer.scene.setVisible(true)
    }
}
window.rndr = () => {
    window.rndrtoggle = !window.rndrtoggle;
    if (window.rndrtoggle) {
        game.stop();
    } else {
        game.start();
    }
}

function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e/-1e23)/-10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e/-1e20)/-10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e/-1e17)/-10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e/-1e14)/-10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e/-1e11)/-10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e/-1e8)/-10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e/-1e5)/-10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e/-1e2)/-10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e/1e2)/10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e/1e5)/10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e/1e8)/10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e/1e11)/10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e/1e14)/10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e/1e17)/10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e/1e20)/10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
}

function healPlayer() {
    Game.currentGame.network.sendRpc({"name": "EquipItem", "itemName": "HealthPotion", "tier": 1})
    Game.currentGame.network.sendRpc({"name": "BuyItem", "itemName": "HealthPotion", "tier": 1})
}

var towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];

function getGoldStash() {
    return Object.values(Game.currentGame.ui.buildings).find(building => building.type == "GoldStash");
}

function BuildBase(design) {
    if (typeof design !== "string") throw new Error("Argument must be given as a string.");
    if (getGoldStash() === undefined) throw new Error("You must have a gold stash to be able to use this.");

    const towers = design.split(";");

    for (let towerStr of towers) {
        const tower = towerStr.split(",");

        if (tower[0] === "") continue;
        if (tower.length < 4) throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be replicated.`);

        Game.currentGame.network.sendRpc({
            name: "MakeBuilding",
            type: towerCodes[parseInt(tower[0])],
            x: getGoldStash().x - parseInt(tower[1]),
            y: getGoldStash().y - parseInt(tower[2]),
            yaw: parseInt(tower[3])
        });
    };
};

window.RecordBase = (storage) => {
    let baseStr = "";
    for (let i in game.ui.buildings) {
        const building = game.ui.buildings[i];
        if (towerCodes.indexOf(building.type) < 0) continue;

        let yaw = 0;

        if (["Harvester", "MeleeTower"].includes(building.type)) {x
            if (game.world.entities[building.uid] !== undefined) yaw = game.world.entities[building.uid].targetTick.yaw;
        }
        baseStr += `${towerCodes.indexOf(building.type)},${getGoldStash().x - building.x},${getGoldStash().y - building.y},${yaw};`;
    };

    localStorage[storage] = baseStr;
};

window.buildRecordedBase = (base) => {
    BuildBase(localStorage[base]);
}

window.DeleteRecordedBase = (base) => {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

        localStorage[base] = null;
    })
};

window.copyText = t => {
    const elem = document.createElement('textarea');
    elem.value = t;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
};

(function() {
    document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
      <button class="btn btn-blue" style="width: 125px;margin: 10px 0 0 0;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
      <input id="psk" style="margin: 10px 15px 0 15px; width: 260px;" placeholder="Party Share Key" value="" class="btn" />
      <button class="btn btn-blue" style="width: 125px;margin: 10px 0 0 0;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })"> Join </button>
    `);
})();

let getElement = (Element) => {
    return document.getElementsByClassName(Element);
}

getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";

// Closed Parties
let privateTab = document.createElement("a");
privateTab.className = "hud-party-tabs-link";
privateTab.id = "privateTab";
privateTab.innerHTML = "Closed Parties";

let privateHud = document.createElement("div");
privateHud.className = "hud-private hud-party-grid";
privateHud.id = "privateHud";
privateHud.style = "display: none;";
getElement("hud-party-tabs")[0].appendChild(privateTab);
getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);

// Keys

let keyTab = document.createElement("a");
keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Party Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);
let keyHud = document.createElement("div");
keyHud.className = "hud-keys hud-party-grid";
keyHud.id = "keyHud";
keyHud.style = "display: none;";
getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);

getId("privateTab").onclick = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("privateTab").className = "hud-party-tabs-link is-active";
    getId("privateHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: none;") {
        getId("privateHud").setAttribute("style", "display: block;");
    }
    if (getId("keyHud").getAttribute("style") == "display: block;") {
        getId("keyHud").setAttribute("style", "display: none;");
    }
}
getElement("hud-party-tabs-link")[0].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getElement("hud-party-tabs-link")[1].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    getId
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getId("keyTab").onmouseup = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("keyTab").className = "hud-party-tabs-link is-active";
    getId("keyHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: block;") {
        getId("privateHud").setAttribute("style", "display: none;");
    }
    if (getId("keyHud").getAttribute("style") == "display: none;") {
        getId("keyHud").setAttribute("style", "display: block;");
    }
};

getElement('hud-keys hud-party-grid')[0].innerHTML += "<h3>Party Keys</h3><br>"

game.network.addRpcHandler("PartyShareKey", function(e) {
    let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
    let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
    let psk = e.partyShareKey;
    let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
    getId("keyHud").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk}</p></div><button class="btn btn-red" id="${cpKeyId}" style="display:inline-block;" onclick="window.copyText('${psk}');">Copy Key</button>&nbsp<button class="btn btn-red" id="${cpLnkId}" style="display:inline-block;" onclick="window.copyText('${lnk}');">Copy Link</button><br />`;
});

let parties = "";
Game.currentGame.network.addRpcHandler("SetPartyList", e => {
    parties = "";
    for (let i in e) {
        if (e[i].isOpen == 0) {
            parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-enabled\"><strong>" + e[i].partyName + "</strong><span>" + e[i].memberCount + "/4<span></div>";
        }
    }
    getId("privateHud").innerHTML = parties;
});

let activerss = false;
let allow = true;

game.network.addEntityUpdateHandler(() => {
    if (activerss) {
        !allow && (allow = true);
    }
    if (activerss || allow) {
        for (let i in game.world.entities) {
            if (game.world.entities[i].fromTick.name) {
                let player = game.world.entities[i];
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                if (activerss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `${player.targetTick.oldName}, UID: ${player.targetTick.uid}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
`;
                    player.targetTick.name = game.world.entities[i].targetTick.info;
                }
                if (!activerss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.world.entities[i].targetTick.info;
                    player.targetTick.oldName = null;
                }
                if (activerss) {
                    if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldWood = wood_1;
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;
                        player.targetTick.info = `${player.targetTick.oldName}, UID: ${player.targetTick.uid}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
`;
                        player.targetTick.name = game.world.entities[i].targetTick.info;
                    }
                }
            }
        }
    }
    if (!activerss) {
        allow = false;
    }
})

document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) {
            activerss = !activerss;
        };
    };
});

Game.currentGame.network.addRpcHandler("SetPartyList", parties => {
    let serverPop = 0;
    for (let party of parties) {
        serverPop += party.memberCount;
    };

    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${serverPop}/32 <small>${game.network.connectionOptions.name}</small>`;
});

window.ssfi = () => {
    let ssrs = document.getElementById("ssrs");
    ssrs.innerHTML = `<i class="fa fa-refresh fa-spin"></i> <strong>Loading...</strong>`;
    let selected = getElem("hud-intro-server")[0].value;
    let server = game.options.servers[selected];
    let hostname = server.hostname;
    let url = `ws://${hostname}:80/`;
    game.network.connectionOptions = { hostname: hostname };
    game.network.connected = true;
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    const loadLbPacket = () => {
        for (let i = 0; i < 30; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        ws.send(new Uint8Array([7, 0]));
        ws.send(new Uint8Array([9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]));
    };
    ws.onopen = (data) => {
        ws.network = new game.networkType();
        ws.network.sendPacket = (e, t) => {
            ws.send(ws.network.codec.encode(e, t));
        };
        ws.onRpc = (data) => {
            if(data.name === "SetPartyList") {
                ws.parties = data.response;
            };
            if(data.name === "Leaderboard") {
                if(ws.b4) { window.appSsrs({ population: ws.pop, leaderboard: data.response, parties: ws.parties, server: server.name }); ws.close(); return; };
                loadLbPacket();
                ws.b4 = true;
            };
        };
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch(data.opcode) {
                case 5:
                    ws.network.sendPacket(4, { displayName: game.options.nickname, extra: data.extra });
                    break;
                case 4:
                    if (!data.allowed) {
                        ws.close();
                        ssrs.innerHTML = `<strong>Server is full (32/32).</strong>`;
                        getElem("hud-intro-server")[0].selectedOptions[0].innerText = `${server.name} [32/32]`;
                    }
                    ws.network.sendPacket(3, { left: 1, up: 1 });
                    ws.pop = data.players;
                    break;
                case 9:
                    ws.onRpc(data);
                    break;
            };
        };
    };
};

window.ssal = () => {
    let iteration = 0,
        allData = [],
        pushData = [],
        scanItem = {
            item1: [],
            item2: [],
            item3: [],
        },
        id = 0,
        ssrs = document.getElementById("ssrs");

    const weeb = ["waifu", "hentai", "bodypillow", "ahegao", "yamete", "kimochi", "weeb", "fuck trollers", "náº¯c ngu", "pee pee ppoo oo", "i watch hentai for a living"];

    ssrs.innerHTML = `<i class="fa fa-refresh fa-spin"></i> <strong>Loading...</strong>`;

    if (!localStorage.reloadCount) localStorage.reloadCount = 0;
    switch (Number(localStorage.reloadCount)) {
        case 0:
            for (let i = 1; i < 4; i++) localStorage[`results${i}`] = "";
            localStorage.results = "";
            console.log('Europe > US West > South America');
            break;
        case 1:
            id = 25;
            console.log('South America > US East > Asia');
            break;
        case 2:
            id = 50;
            console.log('Asia > Australia');
            break;
    };

    let scanInterval = () => {
        const server = game.options.servers[Object.keys(game.options.servers).sort()[id]];
        const randomtext = weeb[Math.floor(Math.random() * weeb.length)];
        const url = `ws://${server.hostname}:80/`;

        let hasSentData = false;

        if (id == 25 && localStorage.reloadCount == 0) {
            console.warn('Reached 25 alts, reloading site...');
            localStorage.reloadCount = 1;
            location.reload();
            return;
        };
        if (id == 50 && localStorage.reloadCount == 1) {
            console.warn('Reached 25 alts, reloading site...');
            localStorage.reloadCount = 2;
            location.reload();
            return;
        };
        if (id == 59) console.log('Scan will be finished after this.');

        id++;

        game.network.connectionOptions = { hostname: server.hostname };
        game.network.connected = true;
        const ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";
        const loadLbPacket = () => {
            for (let i = 0; i < 30; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
            ws.send(new Uint8Array([7, 0]));
            ws.send(new Uint8Array([9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]));
        };
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => ws.send(ws.network.codec.encode(e, t));
            ws.onRpc = (data) => {
                if (data.name === "SetPartyList") ws.parties = data.response;
                if (data.name === "Leaderboard") {
                    if (ws.b4) {
                        const response = data.response;
                        console.log(server.name,
                                    server.id,
                                    `Population: ${ws.pop}`,
                                    '\n', `#1 | name: ${response[0].name}, uid: ${response[0].uid}, score: ${response[0].score.toLocaleString()}, wave: ${response[0].wave}`,
                                    '\n', response,
                                    '\n', ws.parties
                                   );

                        window.appSsrs({server: server.name, id: server.id, population: ws.pop, leaderboard: response, parties: ws.parties});

                        scanItem[`item${Number(localStorage.reloadCount) + 1}`].push({serverInfo: server, population: ws.pop, leaderboard: response, parties: ws.parties, type: "available"});

                        localStorage.setItem(`results${Number(localStorage.reloadCount) + 1}`, JSON.stringify(scanItem[`item${Number(localStorage.reloadCount) + 1}`]));

                        hasSentData = true;

                        ws.close();

                        if (id == Object.keys(game.options.servers).length) {
                            allData.push(JSON.parse(localStorage.results1), JSON.parse(localStorage.results2), JSON.parse(localStorage.results3));
                            for (let result = 0; result < 3; result++) for (let i of allData[result]) pushData.push(i);
                            localStorage.setItem("results", JSON.stringify(pushData));
                            localStorage.reloadCount = 0;
                            console.log(JSON.parse(localStorage.results));
                            setTimeout(() => { ssrs.innerHTML = ""; }, 5000);
                        } else scanInterval();
                        return;
                    };
                    loadLbPacket();
                    ws.b4 = true;
                };
            };
            ws.onmessage = msg => {
                const data = ws.network.codec.decode(msg.data);
                switch (data.opcode) {
                    case 5:
                        ws.network.sendPacket(4, { displayName: game.options.nickname, extra: data.extra });
                        break;
                    case 4:
                        if (!data.allowed) {
                            ws.close();
                            scanInterval();

                            console.log(`${server.name} is full (32/32).`);
                            ssrs.innerHTML = `<strong>Server is full(32/32)</strong> | <strong>Server: ${server.name}, ${server.id}</strong>`;

                            scanItem[`item${Number(localStorage.reloadCount) + 1}`].push({serverInfo: server, population: 32, type: "unavailable"});
                            localStorage.setItem(`results${Number(localStorage.reloadCount) + 1}`, JSON.stringify(scanItem[`item${Number(localStorage.reloadCount) + 1}`]));
                            hasSentData = true;
                        }

                        ws.network.sendPacket(3, { left: 1, up: 1 });
                        ws.pop = data.players;
                        break;
                    case 9:
                        ws.onRpc(data);
                        break;
                };
            };
        };
        ws.onclose = () => {
            if (!hasSentData) {
                scanItem[`item${Number(localStorage.reloadCount) + 1}`].push({serverInfo: server, population: null, type: "unknown"});
                localStorage.setItem(`results${Number(localStorage.reloadCount) + 1}`, JSON.stringify(scanItem[`item${Number(localStorage.reloadCount) + 1}`]));

                console.log(`${server.name}'s condition is unknown (socket cannot access server).`);
                ssrs.innerHTML = `<strong>Server's condition is unknown.</strong> | <strong>Server: ${server.name}, ${server.id}</strong>`;
                scanInterval();
                hasSentData = true;
            }
        }
    };
    setTimeout(() => { scanInterval(); }, 5000);
};

window.appSsrs = res => {

    console.log(res);
    getElem("hud-intro-server")[0].selectedOptions[0].innerText = `${res.server} [${res.population}/32]`;

    let ssrs = document.getElementById("ssrs");
    ssrs.style.overflow = "auto";
    ssrs.style.height = "480px";
    ssrs.innerHTML = `
    <p><strong>Population: ${res.population}/32</strong></p>

    <h1>Leaderboard</h1>

    <hr />
    <div>
    ${res.leaderboard.map(lb => {
        return `
        <p>Rank: #${lb.rank + 1},
        Nickname: ${lb.name},
        Wave: ${lb.wave.toLocaleString("en")},
        Score: ${lb.score}</p>
        `;
    }).join("")}
    </div>
    <br>

    <h1>Parties</h1>

    <hr />
    ${res.parties.map(p => {
        return `
        <p>Name: ${p.partyName},
        ID: ${p.partyId},
        Members: ${p.memberCount},
        Public: ${p.isOpen}</p>
        `;
    }).join("")}
    <div>
    </div>

    <p><strong>${Date()}</strong></p>
    `;
};

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
document.body.appendChild(changeHeight)
var widget = `
<h1 style="text-transform: none;">Server Scanner</h1>
<p><i class="fa fa-info-circle"></i> Click on the <strong>Scan</strong> button to show the data of the selected server here.</p>
<div id="ssrs">
</div>
`;
let hil = getElem("hud-intro-youtuber")[0];
hil.innerHTML = widget;
hil.style.marginTop = "30px";

if (localStorage.reloadCount == 1 || localStorage.reloadCount == 2) window.ssal();

// some scan search
window.displayScanTable = () => {
    let data = [];
    for (let i of JSON.parse(localStorage.results)) data.push({serverName: i.serverInfo.name, serverId: i.serverInfo.id, population: i.population, state: i.type});
    console.table(data);
};

window.searchWithWave = (wave) => {
    let allResults = [];
    for (let i of JSON.parse(localStorage.results)) {
        for (let i2 in i.leaderboard) {
            if (i.leaderboard[i2].wave >= wave) allResults.push({player: i.leaderboard[i2].name, wave: i.leaderboard[i2].wave, server: `${i.serverInfo.id}, ${i.serverInfo.name}`});
        };
    };
    allResults.length > 0 ? console.log(allResults) : console.log('No results found!');
};

window.searchWithScore = (score) => {
    let allResults = [];
    for (let i of JSON.parse(localStorage.results)) {
        for (let i2 in i.leaderboard) {
            if (i.leaderboard[i2].score >= score) allResults.push({player: i.leaderboard[i2].name, score: i.leaderboard[i2].score, server: `${i.serverInfo.id}, ${i.serverInfo.name}`});
        };
    };
    allResults.length > 0 ? console.log(allResults) : console.log('No results found!');
};

window.searchWithName = (name) => {
    let allResults = [];
    for (let i of JSON.parse(localStorage.results)) {
        for (let i2 in i.leaderboard) {
            if (i.leaderboard[i2].name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) allResults.push({player: i.leaderboard[i2].name, wave: i.leaderboard[i2].wave, score: i.leaderboard[i2].score, server: `${i.serverInfo.id}, ${i.serverInfo.name}`});
        };
    };
    allResults.length > 0 ? console.log(allResults) : console.log('No results found!');
};

window.goToPos = (x, y) => {
    const targetX = parseInt(x),
          targetY = parseInt(y);
    if (!Number.isInteger(targetX) || !Number.isInteger(targetY)) return game.ui.components.PopupOverlay.showHint("Invalid value!");
    if (targetX > 23500 || targetX < 30 || targetY > 23500 || targetY < 30) return "cannot move to that specific position, sorry!";

    options.moving = true;

    let reachedTargetX = false;
    let reachedTargetY = false;

    let lastX = 0;
    let lastY = 0;

    let current_action = '';
    let stuckPrediction = 0;

    let timeInMs = 0;

    const interval = setInterval(() => {
        timeInMs += 100;

        if (!options.moving) return clearInterval(interval);

        if (reachedTargetX && reachedTargetY) {
            stop();
            console.log(`done moving. (x: ${targetX}, y: ${targetY}, time took: ${timeInMs}ms)`);
            getId('7i2').click();
            return clearInterval(interval);
        }

        const { x, y } = game.world.localPlayer.entity.fromTick.position;
        if (inRange(lastX, x, 5) && inRange(lastY, y, 5)) stuckPrediction++;

        if (stuckPrediction > 15) {
            console.log('looks like you got yourself in a confluffle!');
            switch(current_action) {
                case 'ne':
                    sw();
                    break;
                case 'se':
                    nw();
                    break;
                case 'nw':
                    se();
                    break;
                case 'sw':
                    ne();
                    break;
                case 'n':
                    s();
                    break;
                case 's':
                    n();
                    break;
                case 'e':
                    w();
                    break;
                case 'w':
                    e();
                    break;
            }
            if (!inRange(x, lastX, 350) && !inRange(y, lastY, 350)) stuckPrediction = 0;
            return;
        }

        lastX = x;
        lastY = y;

        if (!reachedTargetX && inRange(x, targetX, 150)) { reachedTargetX = true; return stopX(); }
        if (!reachedTargetY && inRange(y, targetY, 150)) { reachedTargetY = true; return stopY(); }

        if (targetX > x && targetY < y) { current_action = 'ne'; return ne(); }
        else if (targetX > x && targetY > y) { current_action = 'se'; return se(); }
        else if (targetX < x && targetY < y) { current_action = 'nw'; return nw(); }
        else if (targetX < x && targetY > y) { current_action = 'sw'; return sw(); }
        else if (!reachedTargetY && targetY < y) { current_action = 'n'; return n(); }
        else if (!reachedTargetX && targetX > x) { current_action = 'e'; return e(); }
        else if (!reachedTargetY && targetY > y) { current_action = 's'; return s(); }
        else if (!reachedTargetX && targetX < x) { current_action = 'w'; return w(); }
    }, 100);

    function inRange(pos, target, range) {
        return pos < target + range && pos > target - range;
    }

    function n() {
        Game.currentGame.network.sendPacket(3, { up: 1, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 0 });
    }

    function ne() {
        Game.currentGame.network.sendPacket(3, { up: 1, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 1 });
    }

    function e() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 1 });
    }

    function se() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 1 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 1 });
    }

    function s() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 1 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 0 });
    }

    function sw() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 1 });
        Game.currentGame.network.sendPacket(3, { left: 1, right: 0 });
    }

    function w() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 1, right: 0 });
    }

    function nw() {
        Game.currentGame.network.sendPacket(3, { up: 1, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 1, right: 0 });
    }

    function stop() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 0 });
        Game.currentGame.network.sendPacket(3, { left: 0, right: 0 });
    }

    function stopX() {
        Game.currentGame.network.sendPacket(3, { left: 0, right: 0 });
    }

    function stopY() {
        Game.currentGame.network.sendPacket(3, { up: 0, down: 0 });
    }
}

window.macroActions = { actions: [], created: Date.now() };

window.macro = () => {
    let macro = window.macroActions;
    if (options.stopMacro) options.stopMacro = false;
    let run = () => {
        if (options.stopMacro) return;
        for (let i in macro.actions) {
            let action = macro.actions[i];
            setTimeout(() => {
                game.network.sendPacket(action.packet.opcode, action.packet.data);
                if (i == (macro.actions.length - 1)) {
                    run(); // could replace this with run() for infinite loop
                    game.network.sendInput({ up: 0, down: 0, left: 0, right: 0 });
                };
            }, action.timeout);
        };
    };
    run();
};

window.clearRecord = () => { window.macroActions.actions = []; };

game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (e, t) => {
    game.network.sendPacket2(e, t);
    if (t.name == "Metrics") { return; };
    if (e == 7) { return; };
    if (options.recordMacro) {
        window.macroActions.actions.push({
            timeout: Date.now() - window.macroActions.created,
            packet: { opcode: e, data: t }
        });
    };
};


let blockedNames = [];

window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "blue";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => {});
};

window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if(msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};

const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";

    if(h == 2){
        h = 12;
    };

    if(h < 13) {
        session = "AM"
    };
    if(h > 12){
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

var emojiList = {
    hmm: "https://cdn.discordapp.com/emojis/724365641963929611.png?size=48",
    pog: "https://cdn.discordapp.com/emojis/721070353337811026.png?size=48",
    pepehands: "https://cdn.discordapp.com/emojis/733406770139103293.png?size=48",
    pepeEyes: "https://cdn.discordapp.com/emojis/869573233794486323.gif?size=48",
    pepeHappy: "https://cdn.discordapp.com/emojis/801475958883614811.png?size=48",
    sadge: "https://cdn.discordapp.com/emojis/826530556974989344.png?size=48",
    ha: "https://cdn.discordapp.com/emojis/782756472886525953.png?size=48",
    kekw: "https://cdn.discordapp.com/emojis/748511358076846183.png?size=48",
    pogEyes: "https://cdn.discordapp.com/emojis/786979080406564885.png?size=48",
    appalled: "https://cdn.discordapp.com/emojis/830880294881853530.png?size=48",
    pogYou: "https://cdn.discordapp.com/emojis/790293794716516430.png?size=48",
    pogChag: "https://cdn.discordapp.com/emojis/831156303497134090.png?size=48",
    pogey: "https://cdn.discordapp.com/emojis/790293759861719050.png?size=48",
    weirdChamp: "https://cdn.discordapp.com/emojis/757553915389673502.png?size=48",
    monkaS: "https://cdn.discordapp.com/emojis/757179783573405766.png?size=48",
    yep: "https://cdn.discordapp.com/emojis/758356179477987339.png?size=48",

    weirdButOkay: "https://cdn.discordapp.com/emojis/831156194247966782.gif?size=48",
    pogpogpogpog: "https://cdn.discordapp.com/emojis/869580566096379974.gif?size=48",
    wooyeah: "https://cdn.discordapp.com/emojis/791008461420888084.gif?size=48",
    idk: "https://cdn.discordapp.com/emojis/882513306164805642.gif?size=48",
}


Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1])
const onMessageReceived = e => {
    if (blockedNames.includes(e.displayName) || window.chatDisabled) { return; };
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = e.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = e.message.replace(/<(?:.|\n)*?>/gm, '')
    .replace(/(?:f|F)uck/gi, `<img src="https://cdn.discordapp.com/emojis/907625398832070667.png?size=80" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
    .replace(/n+[i1]+gg+[a@]+/i, `<img src="https://cdn.discordapp.com/emojis/902742239996936226.webp?size=80" height="16" width="17" style="margin: 1px 0 0 0;"></img>`);
    let arr = c.split(':');

    for (let i = 1; i < arr.length; i += 2) {
        // console.log(arr[i]);
        if (!emojiList[arr[i]]) {
            // console.log(arr);
            arr = [c];
        } else {
            arr[i] = `<img src="${emojiList[arr[i]]}" height="16" width="18" style="margin: 1px 0 0 0;"></img>`
        };
    }

    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${e.displayName}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> - ${getClock()}</small>: ${arr.join(" ")}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
};
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

!game.world.removeEntity2 && (game.world.removeEntity2 = game.world.removeEntity);

game.world.removeEntity = (uid) => {
     if (game.world.entities[uid].fromTick.model == "Tree" || game.world.entities[uid].fromTick.model == "Stone" || game.world.entities[uid].fromTick.model == "NeutralCamp") return;
     game.world.removeEntity2(uid);
};

addEventListener('keyup', function(e) {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
       if(e.key === "~") {
          window.addMarker();
          game.ui.components.PopupOverlay.showHint(`Added Marker #${markerId - 1}`);
       };
    }
});

var map = document.getElementById("hud-map");
let markerId = 1;

window.addMarker = () => {
    map.insertAdjacentHTML("beforeend", `
    <div style="display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='map-display hud-map-player'>
    </div>`)
};

window.ssMode = () => {
    window.ssModeToggle = !window.ssModeToggle;
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-center-right", ".hud-chat", ".hud-chat-messages", ".hud-top-right", ".refrsh"]);
    for(let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        } else {
            mb.style.display = "none";
        }
    };
    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-shield-bar"));
    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-health-bar"));
    document.querySelector(".hud-bottom-right").insertAdjacentElement("afterbegin", document.querySelector("#hud-party-icons"));
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-day-night-ticker"));
};

document.addEventListener("keydown", e => {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if(e.key === "Escape") {
            window.ssMode();
        };
    };
})

window.frss = true;

const fullRSS = () => {
    if(!window.frss) { return; };
    let resources = ["wood", "stone", "gold"];
    let pt = game.ui.playerTick;
    let rc = game.ui.components.Resources;
    for(let i = 0; i < resources.length; i++) {
        let rs = resources[i];
        rc[`${rs}Elem`].innerHTML = Math.round(pt[rs]).toLocaleString("en");
    };
    rc.tokensElem.innerHTML = Math.round(pt.token).toLocaleString("en");
};

let sipt = setInterval(() => {
    game.ui.addListener('playerTickUpdate', fullRSS);
}, 10);

setTimeout(() => { clearInterval(sipt); }, 90);

game.ui.components.Chat.sendMessage2 = game.ui.components.Chat.sendMessage;
game.ui.components.Chat.sendMessage = (msg) => {
    switch(msg) {
        case "!luid":
            for (let i of game.ui.components.Leaderboard.leaderboardData) game.ui.components.PopupOverlay.showHint("Please check console!") && console.log(`${i.rank + 1}# - ${i.name}: ${i.uid}`);
            break;
        case "!coloralt":
            document.getElementById("coloralt").click();
            break;
        case "!resetcolor":
            window.resetColor();
            break;
        case "!server":
            game.ui.components.PopupOverlay.showHint(`Server has been up since: ${new Date(Date.now() - game.world.replicator.serverTime)}`);
            break;
        case "!ar":
            options.ar = true;
            break;
        case "!dar":
            options.ar = false;
            break;
        case "!rwp":
            options.rwp = true;
            break;
        case "!drwp":
            options.rwp = false;
            break;
        default:
            game.ui.components.Chat.sendMessage2(msg);
    };
};

game.network.sendRpc2 = game.network.sendRpc;
game.network.sendRpc = (data) => {
    if(data.name === "MakeBuilding" && data.type === "Wall" && options.wallBlock) {

        let offset = 48;
        let oldOffset = 48
        let earlyOffset = 48;

        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x, y: data.y + offset, yaw: data.yaw });

        offset *= 2;

        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + oldOffset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - oldOffset, y: data.y + offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + oldOffset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - oldOffset, y: data.y - offset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y - oldOffset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y - oldOffset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x + offset, y: data.y + oldOffset, yaw: data.yaw });
        game.network.sendRpc2({ name: "MakeBuilding", type: data.type, x: data.x - offset, y: data.y + oldOffset, yaw: data.yaw });
    }; // xy
    game.network.sendRpc2(data);
};

let wallElem = document.createElement("a");
wallElem.classList.add("hud-buff-bar-item");
wallElem.setAttribute("data-building", "Wall");
document.getElementsByClassName("hud-buff-bar")[0].appendChild(wallElem);
wallElem.style.display = "none";

addFunctionToElem('14i', 'wallBlock', '5x5 Walls', 'btn-red?btn-blue');

document.addEventListener("keydown", e => {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key === "!") {
            getId('14i').click();
            if (wallElem.style.display == "none" || wallElem.style.display == "") {
                wallElem.style.display = "block";
            } else {
                wallElem.style.display = "none";
            };
        };
    };
})
/*
function appendToolTip(elem) {
    let elemBounding = elem.getBoundingClientRect();
    let toolTip = document.createElement("div");
    toolTip.classList.add(`hud-tooltip-top`);
    toolTip.style.top = `${elemBounding.top - (elemBounding.height - 10)}px`;
    toolTip.style.left = elemBounding.left + 'px';
    toolTip.style.display = 'block';
    elem.insertAdjacentElement("beforebegin", toolTip);
}
*/

let shield = document.createElement("a");
shield.classList.add("hud-toolbar-item");
shield.classList.add("hud-toolbar-item-shield");
shield.setAttribute("data-item", "ZombieShield");
shield.setAttribute("data-tier", "1");
document.getElementsByClassName("hud-toolbar-inventory")[0].appendChild(shield);
document.getElementsByClassName("hud-toolbar-item-shield")[0].addEventListener("click", function() {
    if (game.ui.inventory.ZombieShield) {
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "ZombieShield", tier: game.ui.inventory.ZombieShield.tier + 1});
    } else {
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "ZombieShield", tier: 1});
    }
});

Game.currentGame.network.addRpcHandler("DayCycle", function(e) {
    if (game.ui.inventory.ZombieShield) {
        if (game.ui.inventory.ZombieShield.tier === 10) {
            shield.style.display = "none";
        } else if (shield.style.display === "none" && game.ui.inventory.ZombieShield.tier !== 10) {
            shield.style.display = "block";
        };
    };
    if (shield.style.display === "none" && !game.ui.inventory.ZombieShield) shield.style.display = "block";
    if (game.ui.playerTick && e.isDay) getactiveCommingbosswaves2() ? bossAlert.style.display = "block" : bossAlert.style.display = "none";
});

game.network.addEnterWorldHandler((e) => {
    setTimeout(() => {
		game.world.myUid = null;
        game.world.getMyUid = () => {
            return e.uid;
        };
	}, 1000);
    if (!e.allowed) {
        getElem("hud-intro-play")[0].innerText = "";
        getId('playspan').style.margin = '-130px 0px 0px 545px';
        getId('playspan').style.display = "block";
    };
});

window.sendAitoAlt = () => {
    if (options.aito) {
        let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendInput = (t) => {
                ws.network.sendPacket(3, t);
            };
            ws.network.sendRpc = (t) => {
                ws.network.sendPacket(9, t);
            };
            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(ws.network.codec.encode(e, t));
                }
            };
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.opcode === 4) {
	        	game.network.sendPingIfNecessary = function() {
                    this.connecting = false;
                    this.connected = true;
                    var pingInProgress = (this.pingStart != null);
                    if (pingInProgress) {
                        return;
                    }
                    if (this.pingCompletion != null) {
                        var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                        if (msSinceLastPing <= 5000) {
                            return;
                        }
                    }
                    this.pingStart = new Date();
                    this.sendPing({
                        nonce: 0
                    });
                    this.sendRpc(game.metrics.metrics);
                };
            }
            if (ws.data.opcode === 5) {
/*
		        let imports = {
                    a: {
                        a: function(a) {
                            console.log(a)
                        },
                        d: function(a) {
                            console.log(a)
                        },
                        b: function(a, b, c) {
                            console.log(a, b, c)
                        },
                        g: function() {},
                        c: function(a) {
                            console.log(a)
                        },
                        f: function(a) {
                            console.log(a)
                        },
                        e: function(a) {
                            console.log(a)
                        },
                    }
                };
                (async () => {
                    await fetch('asset/zombs_wasm.wasm').then(response =>
                        response.arrayBuffer()).then(bytes =>
                        WebAssembly.instantiate(bytes, imports)).then(result => {
                        let asm = {
                            memory: result.instance.exports.h,
                            _MakeBlendField: function(a, b) {
                                return result.instance.exports.l(a, b)
                            },
                            _free: result.instance.exports.q,
                            __wasm_call_ctors: result.instance.exports.j,
                            _main: result.instance.exports.k,
                            stackSave: result.instance.exports.m,
                            stackRestore: result.instance.exports.n,
                            stackAlloc: result.instance.exports.o,
                            malloc: result.instance.exports.p
                       }
                       return asm.memory;
                    })
                })();
*/
      		    game.network.sendPingIfNecessary = function() {
                    this.connecting = false;
                    this.connected = false;
                    var pingInProgress = (this.pingStart != null);
                    if (pingInProgress) {
                        return;
                    };
                    if (this.pingCompletion != null) {
                        var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                        if (msSinceLastPing <= 5000) {
                            return;
                        }
                    };
                    this.pingStart = new Date();
                    this.sendPing({
                        nonce: 0
                    });
                    this.sendRpc(game.metrics.metrics);
                };

                game.world.myUid = null;
                ws.network.sendPacket(4, { displayName: game.options.nickname, extra: ws.data.extra });

                // failsafe
                setTimeout(() => {
                    if (ws.data.opcode === 5) {
                        game.network.sendPingIfNecessary = function() {
                            this.connecting = false;
                            this.connected = true;
                            var pingInProgress = (this.pingStart != null);
                            if (pingInProgress) {
                                return;
                            }
                            if (this.pingCompletion != null) {
                                var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                                if (msSinceLastPing <= 5000) {
                                    return;
                                }
                            }
                            this.pingStart = new Date();
                            this.sendPing({
                                nonce: 0
                            });
                            this.sendRpc(game.metrics.metrics);
                        };
                        ws.close();
                        console.log('failed decoding opcode 4, might ran out of time to decode / reached the decoding limit, watch out for disconnections');
                    }
                }, 2500);
            };
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!options.aito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            }
            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;
                if (ws.psk) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    }
                }
                ws.network.sendPing({nonce: 0});
                ws.network.sendRpc(game.metrics.metrics);
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };
        };
    };
};

let timesTried = 0;
window.playerFinder = () => {
    let rank;
    rank = (document.getElementById("findrank").value == "") ? 1 : document.getElementById("findrank").value;

    if (options.finder) {
        let ver = false;
        let playerData = game.ui.components.Leaderboard.leaderboardData[rank - 1];
        let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = (data) => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
            ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
            ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
        }
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.opcode === 4) {
	        	game.network.sendPingIfNecessary = function() {
                    this.connecting = false;
                    this.connected = true;
                    var pingInProgress = (this.pingStart != null);
                    if (pingInProgress) {
                        return;
                    }
                    if (this.pingCompletion != null) {
                        var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                        if (msSinceLastPing <= 5000) {
                            return;
                        }
                    }
                    this.pingStart = new Date();
                    this.sendPing({
                        nonce: 0
                    });
                    this.sendRpc(game.metrics.metrics);
                };
            }
            if (ws.data.opcode === 5) {
/*
		        let imports = {
                    a: {
                        a: function(a) {
                            console.log(a)
                        },
                        d: function(a) {
                            console.log(a)
                        },
                        b: function(a, b, c) {
                            console.log(a, b, c)
                        },
                        g: function() {},
                        c: function(a) {
                            console.log(a)
                        },
                        f: function(a) {
                            console.log(a)
                        },
                        e: function(a) {
                            console.log(a)
                        },
                    }
                };
                (async () => {
                    await fetch('asset/zombs_wasm.wasm').then(response =>
                        response.arrayBuffer()).then(bytes =>
                        WebAssembly.instantiate(bytes, imports)).then(result => {
                        let asm = {
                            memory: result.instance.exports.h,
                            _MakeBlendField: function(a, b) {
                                return result.instance.exports.l(a, b)
                            },
                            _free: result.instance.exports.q,
                            __wasm_call_ctors: result.instance.exports.j,
                            _main: result.instance.exports.k,
                            stackSave: result.instance.exports.m,
                            stackRestore: result.instance.exports.n,
                            stackAlloc: result.instance.exports.o,
                            malloc: result.instance.exports.p
                       }
                       return asm.memory;
                    })
                })();
*/
      		    game.network.sendPingIfNecessary = function() {
                    this.connecting = false;
                    this.connected = false;
                    var pingInProgress = (this.pingStart != null);
                    if (pingInProgress) {
                        return;
                    };
                    if (this.pingCompletion != null) {
                        var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                        if (msSinceLastPing <= 5000) {
                            return;
                        }
                    };
                    this.pingStart = new Date();
                    this.sendPing({
                        nonce: 0
                    });
                    this.sendRpc(game.metrics.metrics);
                };

                game.world.myUid = null;
                ws.network.sendPacket(4, { displayName: game.options.nickname, extra: ws.data.extra });

                // failsafe
                setTimeout(() => {
                    if (ws.data.opcode === 5) {
                        game.network.sendPingIfNecessary = function() {
                            this.connecting = false;
                            this.connected = true;
                            var pingInProgress = (this.pingStart != null);
                            if (pingInProgress) {
                                return;
                            }
                            if (this.pingCompletion != null) {
                                var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                                if (msSinceLastPing <= 5000) {
                                    return;
                                }
                            }
                            this.pingStart = new Date();
                            this.sendPing({
                                nonce: 0
                            });
                            this.sendRpc(game.metrics.metrics);
                        };
                        ws.close();
                        console.log('failed decoding opcode 4, might ran out of time to decode / reached the decoding limit, watch out for disconnections');
                    }
                }, 2500);
            };
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.entities) {
                let partyUid = [];
                for (let i2 of game.ui.playerPartyMembers) partyUid.push(i2.playerUid);
                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].uid == playerData.uid) {
                        options.finder = false;
                        window.playerX = Math.round(ws.data.entities[i].position.x);
                        window.playerY = Math.round(ws.data.entities[i].position.y);

                        document.getElementById("sendFinder").click();

                        game.ui.components.PopupOverlay.showHint(`Found player at X: ${window.playerX}, Y: ${window.playerY}.`);

                        map.insertAdjacentHTML("beforeend", `<div style="color: white; display: block; left: ${parseInt(Math.round(window.playerX / game.world.getHeight() * 100)) - 4}%; top: ${parseInt(Math.round(window.playerY / game.world.getWidth() * 100)) - 12}%; position: absolute;" class='map-display'><i class='fa fa-map-marker'></i></div>`)

                        console.log(ws.data.entities[i], timesTried);
                        timesTried = 0;
                        ws.close();
                    }
                    if (ws.data.entities[i].name) {
                        ver = true;
                        if (ws.data.entities[i].uid !== playerData.uid && ws.data.entities[i].uid !== ws.uid && partyUid.indexOf(ws.data.entities[i].uid) < 0) console.log(ws.data.entities[i]);
                    };
                    if (ws.data.entities[i].model == "GoldStash") {
                        let stashUid = ws.data.entities[i].uid;
                        map.insertAdjacentHTML("beforeend", `<div id="${stashUid}" style="color: white; display: block; left: ${parseInt(Math.round(ws.data.entities[i].position.x / game.world.getHeight() * 100)) - 4}%; top: ${parseInt(Math.round(ws.data.entities[i].position.y / game.world.getWidth() * 100)) - 12}%; position: absolute;" class='map-display'><i class='fa fa-map-marker'></i></div>`)
                        console.log(ws.data.entities[i]);
                        setTimeout(() => {
                            document.getElementById(`${stashUid}`).remove();
                        }, 240000);
                    }
                }
                ws.network.sendInput({left: 1, up: 1});
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({respawn: 1});
            }
            if (ver && !ws.isclosed) {
                ws.isclosed = true;
                if (timesTried < 24) {
                    setTimeout(() => {
                        timesTried++;
                        ws.close();
                        window.playerFinder();
                    }, 5000);
                } else {
                    setTimeout(() => {
                        ws.close();
                    }, 5000)
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
                ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});
            }
            switch(ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}

function findNearestAltToStash() {
    if (window.allSockets.length < 1) return;

    let altArray = [];
    let targetGoldStash = Object.values(Game.currentGame.world.entities).find(building => building.fromTick.model == "GoldStash");
    if (targetGoldStash.targetTick.partyId == game.ui.playerPartyId) return;

    for (let i in window.allSockets) if (!window.allSockets[i].myPlayer.dead) altArray.push(window.allSockets[i].myPlayer);
    if (altArray.length < 1) return;

    altArray.sort((a, b) => {
        return measureDistance(targetGoldStash.fromTick.position, a.position) - measureDistance(targetGoldStash.fromTick.position, b.position);
    });

    return altArray[0];
};
window.findNearestAlt = findNearestAltToStash;

function buySpear(ws, tier, startingTier) {
    let i = startingTier ? startingTier : 1;

    let buyLoop = () => {
        ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: i});

        ++i;
        if (i > Number(tier)) {
            ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory ? ws.inventory.Spear.tier : ws.ui.inventory.Spear.tier});
            return;
        }
        setTimeout(buyLoop(), 100);
    }
    buyLoop();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r, g, b];
    }
    return null;
};

let enemyStash;
window.togglexkey = () => {
    window.xkey = !window.xkey;
    enemyStash = Object.values(Game.currentGame.world.entities).find(building => building.fromTick.model == "GoldStash");
}

window.allSockets = [];
let cloneTimeout = false;
let targetPos = {x: 0, y: 0};

let inull = true;
let i1 = true;
let i2 = true;
let i3 = true;

window.sendWs = () => {
  let mousePosition3;
  let isOnControl = true;
  let isTrue = true;
  let altElem = document.createElement('div');
  let altDisplay = document.createElement("p");
  let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80`);
  ws.binaryType = "arraybuffer";
  if (!window.allSockets[window.allSockets.length]) {
      ws.cloneId = window.allSockets.length + 1;
      window.allSockets[window.allSockets.length] = ws;
  }
  ws.binaryType = "arraybuffer";
  ws.aimingYaw = 1;
  ws.onclose = () => {
      ws.isclosed = true;

      altElem.remove();
      altDisplay.innerHTML = `Socket #${ws.cloneId}, State: <strong style="color: red;">[Closed]</strong>`;
  }
  ws.onopen = () => {
    ws.network = new game.networkType;
    ws.network.sendInput = (t) => {
        ws.network.sendPacket(3, t);
    };
    ws.network.sendRpc = (t) => {
        ws.network.sendPacket(9, t);
    };
    ws.network.sendPacket = (e, t) => {
        if (!ws.isclosed) {
            ws.send(ws.network.codec.encode(e, t));
        }
    };
    ws.onEnterWorld = () => {
        altname++;
		game.network.sendPingIfNecessary = function() {
            this.connecting = false;
            this.connected = true;
            var pingInProgress = (this.pingStart != null);
            if (pingInProgress) {
                return;
            }
            if (this.pingCompletion != null) {
                var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                if (msSinceLastPing <= 5000) {
                    return;
                }
            }
            this.pingStart = new Date();
            this.sendPing({
                nonce: 0
            });
            this.sendRpc(game.metrics.metrics);
        };
    }
    ws.onmessage = msg => {
        ws.data = ws.network.codec.decode(msg.data);
        if (ws.data.opcode === 4) {
            ws.onEnterWorld();
            console.log(ws.data);
            console.log(`${ws.data.players + 1}/32 players, ${ws.cloneId} alts in`);
        }
        if (ws.data.opcode === 5) {
/*
		    let imports = {
                a: {
                    a: function(a) {
                        console.log(a)
                    },
                    d: function(a) {
                        console.log(a)
                    },
                    b: function(a, b, c) {
                        console.log(a, b, c)
                    },
                    g: function() {},
                    c: function(a) {
                        console.log(a)
                    },
                    f: function(a) {
                        console.log(a)
                    },
                    e: function(a) {
                        console.log(a)
                    },
                }
            };

            (async () => {
                await fetch('asset/zombs_wasm.wasm').then(response =>
                    response.arrayBuffer()).then(bytes =>
                    WebAssembly.instantiate(bytes, imports)).then(result => {
                    let asm = {
                        memory: result.instance.exports.h,
                        _MakeBlendField: function(a, b) {
                            return result.instance.exports.l(a, b)
                        },
                        _free: result.instance.exports.q,
                        __wasm_call_ctors: result.instance.exports.j,
                        _main: result.instance.exports.k,
                        stackSave: result.instance.exports.m,
                        stackRestore: result.instance.exports.n,
                        stackAlloc: result.instance.exports.o,
                        malloc: result.instance.exports.p
                   }
                   return asm.memory;
               })
            })();
*/
		    game.network.sendPingIfNecessary = function() {
                this.connecting = false;
                this.connected = false;
                var pingInProgress = (this.pingStart != null);
                if (pingInProgress) {
                    return;
                };
                if (this.pingCompletion != null) {
                    var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                    if (msSinceLastPing <= 5000) {
                        return;
                    }
                };
                this.pingStart = new Date();
                this.sendPing({
                    nonce: 0
                });
                this.sendRpc(game.metrics.metrics);
            };

            game.world.myUid = null;

            ws.network.sendPacket(4, {displayName: game.options.nickname, extra: ws.data.extra });

            setTimeout(() => {
                if (ws.data.opcode == 5) {
                    altDisplay.id = `alt${ws.cloneId}`;
                    altDisplay.innerHTML = `Socket #${ws.cloneId}, State: <strong style="color: red;">[Failed Opcode 4]</strong>`;
                    document.getElementById("altstate").appendChild(altDisplay);
                };
            }, 5000);
        };
/*
        if (ws.data.opcode === 9) {
            console.log(ws.data);
        };
*/
        if (isTrue) {
            isTrue = !isTrue;
            if (ws.psk) {
                ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});

                altElem.classList.add('hud-map-player');
                altElem.style.display = "block";
                document.getElementsByClassName('hud-map')[0].appendChild(altElem);

                altDisplay.id = `alt${ws.cloneId}`;
                altDisplay.innerHTML = `Socket #${ws.cloneId}, State: <strong style="color: green;">[Open]</strong>`;
                document.getElementById("altstate").appendChild(altDisplay);
            } else {
                setTimeout(() => {
                    if (ws.psk) {
                        ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});

                        altElem.classList.add('hud-map-player');
                        altElem.style.display = "block";
                        document.getElementsByClassName('hud-map')[0].appendChild(altElem);

                        altDisplay.id = `alt${ws.cloneId}`;
                        altDisplay.innerHTML = `Socket #${ws.cloneId}, State: <strong style="color: green;">[Open]</strong>`;
                        document.getElementById("altstate").appendChild(altDisplay);
                    };
                }, 1000)
            }
            ws.network.sendInput({left: 1, up: 1});
            ws.mouseUp = 1;
            ws.mouseDown = 0;
            ws.f = false;
            function mouseMoved(e, x, y, d) {
                ws.aimingYaw = e;
                if (ws.mouseDown && !ws.mouseUp) {
                    ws.network.sendInput({mouseMovedWhileDown: e, worldX: x, worldY: y, distance: d});
                }
                if (!ws.mouseDown && ws.mouseUp) {
                    ws.network.sendInput({mouseMoved: e, worldX: x, worldY: y, distance: d});
                }
            }
            document.addEventListener('mousemove', mousemove => {
                if (isOnControl) {
                    if (!ws.isclosed) {
                        mousePosition3 = game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY);
                        if (ws.myPlayer) {
                            if (ws.myPlayer.position) {
                                mouseMoved(
                                    game.inputPacketCreator.screenToYaw(
                                        (-ws.myPlayer.position.x + mousePosition3.x) * 100,
                                        (-ws.myPlayer.position.y + mousePosition3.y) * 100
                                    ),
                                    Math.floor(mousePosition3.x),
                                    Math.floor(mousePosition3.y),
                                    Math.floor(game.inputPacketCreator.distanceToCenter(
                                        (-ws.myPlayer.position.x + mousePosition3.x) * 100,
                                        (-ws.myPlayer.position.y + mousePosition3.y) * 100
                                    ) / 100)
                                );
                            }
                        }
                    }
                }
            })
            let SendRpc = ws.network.sendRpc;
            let SendInput = ws.network.sendInput;
            document.addEventListener('keydown', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (e.keyCode == 81 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            setTimeout(() => {
                                var nextWeapon = location.hostname == "zombs.io" ? 'Pickaxe' : "Crossbow";
                                var weaponOrder = location.hostname == "zombs.io" ? ['Pickaxe', 'Spear', 'Bow', 'Bomb'] : ["Crossbow", 'Pickaxe', 'Spear', 'Bow', 'Bomb'];
                                var foundCurrent = false;
                                for (let i in weaponOrder) {
                                    if (foundCurrent) {
                                        if (ws.inventory[weaponOrder[i]]) {
                                            nextWeapon = weaponOrder[i];
                                            break;
                                        }
                                    }
                                    else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                                        foundCurrent = true;
                                    }
                                }
                                ws.network.sendRpc({name: 'EquipItem', itemName: nextWeapon, tier: ws.inventory[nextWeapon].tier});
                            }, 100);
                        }
                        if (e.keyCode == 72 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            ws.network.sendRpc({name: 'LeaveParty'});
                        }
                        if (e.keyCode == 74 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey});
                        }

                        if (e.keyCode == 32 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            setTimeout(() => {
                                ws.network.sendInput({space: 0});
                                ws.network.sendInput({space: 1});
                            }, 100);
                        }
                        if (e.keyCode == 82) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                for (let i in game.ui.buildings) {
                                    if (game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                        ws.network.sendRpc({name: "UpgradeBuilding", uid: game.ui.buildings[i].uid});
                                    }
                                }
                            }
                        }
                        if (e.keyCode == 82) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingUid) {
                                    ws.network.sendRpc({name: "UpgradeBuilding", uid: game.ui.components.BuildingOverlay.buildingUid});
                                }
                            }
                        }
                        if (e.keyCode == 89) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                    ws.network.sendRpc({name: "DeleteBuilding", uid: game.ui.components.BuildingOverlay.buildingUid})
                                }
                            }
                        }
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove) {
                                if (KeyCode == 104) {
                                    ws.network.sendInput({up: 1, down: 0});
                                }
                                if (KeyCode == 102) {
                                    ws.network.sendInput({right: 1, left: 0});
                                }
                                if (KeyCode == 98) {
                                    ws.network.sendInput({down: 1, up: 0});
                                }
                                if (KeyCode == 100) {
                                    ws.network.sendInput({left: 1, right: 0});
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendInput({up: 1, down: 0});
                                }
                                if (KeyCode == 68) {
                                    SendInput({right: 1, left: 0});
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendInput({down: 1, up: 0});
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendInput({left: 1, right: 0});
                                }
                            }
                            if (e.keyCode == 82) { // key R (wtf)
                                ws.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1})
                                ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1})
                            }
                            if (KeyCode == 78) { // key N
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "PetCARL",
                                    "tier": ws.inventory.PetCARL.tier
                                })
                            }
                            if (KeyCode == 77) { // Key M
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetRevive",
                                    "tier": 1
                                })
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "PetRevive",
                                    "tier": 1
                                })
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetCARL",
                                    "tier": ws.inventory.PetCARL.tier + 1
                                })
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetMiner",
                                    "tier": ws.inventory.PetMiner.tier + 1
                                })
                            }
                            if (KeyCode == 221) { // key ]
                                game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: ws.psk.response.partyShareKey})
                            }
                        }
                    }
                }
            })
            document.addEventListener('keyup', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove) {
                                if (KeyCode == 104) {
                                    ws.network.sendInput({up: 0});
                                }
                                if (KeyCode == 102) {
                                    ws.network.sendInput({right: 0});
                                }
                                if (KeyCode == 98) {
                                    ws.network.sendInput({down: 0});
                                }
                                if (KeyCode == 100) {
                                    ws.network.sendInput({left: 0});
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendInput({up: 0});
                                }
                                if (KeyCode == 68) {
                                    ws.network.sendInput({right: 0});
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendInput({down: 0});
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendInput({left: 0});
                                }
                            }
                            if (KeyCode == 187) {
                                ws.activebow = !ws.activebow;
                                ws.playerWeapon = ws.myPlayer.weaponName;
                                if (ws.activebow) {
                                    if (ws.inventory.Bow) {
                                        ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier})
                                    } else {
                                        ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1})
                                        ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: 1})
                                    }
                                } else {
                                    ws.network.sendRpc({name: "EquipItem", itemName: ws.playerWeapon, tier: ws.inventory[ws.playerWeapon].tier})
                                }
                            }
                            if (KeyCode == 188) {
                                if (ws.myPet) {
                                    ws.network.sendRpc({name: "DeleteBuilding", uid: ws.myPet.uid});
                                }
                            }
                        }
                    }
                }
            })
            document.getElementsByClassName("hud")[0].addEventListener("mousedown", function(e) {
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x,game.ui.mousePosition.y);
                if (!ws.isclosed) {
                    if (e.which === 3 && isOnControl) {
                        if (window.mousemove) {
                            window.mousemove = false;
                            window.moveaway = true;
                            if (ws.myPlayer.position.y - mouseToWorld.y > 1) {
                                ws.network.sendInput({up: 0})
                            } else {
                                ws.network.sendInput({up: 1})
                            }
                            if (-ws.myPlayer.position.y + mouseToWorld.y > 1) {
                                ws.network.sendInput({down: 0})
                            } else {
                                ws.network.sendInput({down: 1})
                            }
                            if (-ws.myPlayer.position.x + mouseToWorld.x > 1) {
                                ws.network.sendInput({right: 0})
                            } else {
                                ws.network.sendInput({right: 1})
                            }
                            if (ws.myPlayer.position.x - mouseToWorld.x > 1) {
                                ws.network.sendInput({left: 0})
                            } else {
                                ws.network.sendInput({left: 1})
                            }
                        }
                        if (!window.mousemove) {
                            ws.automove = true;
                            if (ws.myPlayer.position.y - mouseToWorld.y > 1) {
                                ws.network.sendInput({up: 0})
                            } else {
                                ws.network.sendInput({up: 1})
                            }
                            if (-ws.myPlayer.position.y + mouseToWorld.y > 1) {
                                ws.network.sendInput({down: 0})
                            } else {
                                ws.network.sendInput({down: 1})
                            }
                            if (-ws.myPlayer.position.x + mouseToWorld.x > 1) {
                                ws.network.sendInput({right: 0})
                            } else {
                                ws.network.sendInput({right: 1})
                            }
                            if (ws.myPlayer.position.x - mouseToWorld.x > 1) {
                                ws.network.sendInput({left: 0})
                            } else {
                                ws.network.sendInput({left: 1})
                            }
                        }
                    }
                    if (isOnControl) {
                        if (!e.button) {
                            ws.mouseDown = 1;
                            ws.mouseUp = 0;
                            ws.network.sendInput({mouseDown: ws.aimingYaw, worldX: Math.floor(mousePosition3.x), worldY: Math.floor(mousePosition3.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100)/100)});
                        }
                    }
                }
            });
            document.getElementsByClassName("hud")[0].addEventListener("mouseup", function(e) {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (e.which === 3) {
                            ws.network.sendInput({up: 0})
                            ws.network.sendInput({down: 0})
                            ws.network.sendInput({right: 0})
                            ws.network.sendInput({left: 0})
                            if (!window.altFollowPlayer && window.moveaway === true) {
                                window.mousemove = true;
                                window.moveaway = false;
                            } else ws.automove = false;
                        }
                        if (!e.button) {
                            ws.mouseUp = 1;
                            ws.mouseDown = 0;
                            ws.network.sendInput({mouseUp: 1, worldX: Math.floor(mousePosition3.x), worldY: Math.floor(mousePosition3.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100)/100)});
                        }
                    }
                    if (window.mouseclick) {
                        if (e.button == 2) targetPos = game.renderer.screenToWorld(game.ui.mousePosition.x,game.ui.mousePosition.y);
                    }
                }
            });
            let t1 = location.hostname == "zombs.io" ? 0 : 1;
            document.getElementsByClassName("hud-shop-item")[t1 + 0].addEventListener('click', function() {
                if (!ws.isclosed) ws.network.sendRpc({name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier+1});
            });
            document.getElementsByClassName("hud-shop-item")[t1 + 1].addEventListener('click', function() {
                if (!ws.isclosed) {
                    if (!ws.inventory.Spear) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: 1});
                    } else {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier+1});
                    }
                }
            });
            document.getElementsByClassName("hud-shop-item")[t1 + 2].addEventListener('click', function() {
                if (!ws.isclosed) {
                    if (!ws.inventory.Bow) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1});
                    } else {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: ws.inventory.Bow.tier+1});
                    }
                }
            });
            document.getElementsByClassName("hud-shop-item")[t1 + 3].addEventListener('click', function() {
                if (!ws.isclosed) {
                    if (!ws.inventory.Bomb) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: 1});
                    } else {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier+1});
                    }
                }
            });
            document.getElementsByClassName("hud-shop-item")[t1 + 4].addEventListener('click', function() {
                if (!ws.isclosed) ws.network.sendRpc({name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1});
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 0].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 1].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 2].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 3].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 4].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 5].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 6].addEventListener("mouseup", function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "PetWhistle", tier: 1})
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[t1 + 7].addEventListener('mouseup', function(e) {
                if (!e.button && !ws.isclosed) {
                    ws.network.sendRpc({name: "BuyItem", itemName: "ZombieShield", tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1});
                };
            });
            if (window.aim) {
                ws.autoaim = true;
            }
            if (window.move) {
                ws.automove = true;
            }
            document.getElementById("deleteAllAlt").addEventListener('click', () => {
                ws.close();
                altname = ws.cloneId;
            })
            document.getElementById("resp").addEventListener('click', () => {
                ws.network.sendInput({respawn: 1});
            })
            document.getElementById("coloralt").addEventListener('click', () => {
                for (let i in game.world.entities) {
                    if (game.world.entities[i].entityClass === "PlayerEntity" && game.world.entities[i].fromTick.uid === ws.uid) {
                        var hexValue = "1234567890abcdef";
                        var hexLength = 6;
                        var hex = "";
                        for (let i = 0; i < hexLength; i++) hex += hexValue[Math.floor(Math.random() * hexValue.length)];
                        let hr = hexToRgb(hex);
                        game.world.entities[i].currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
                    };
                };
            })
            document.getElementsByClassName("controlon")[0].addEventListener('click', () => {
                isOnControl = true;
            })
            document.getElementsByClassName("controloff")[0].addEventListener('click', () => {
                isOnControl = false;
            })
            document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', () => {
                if (options.rwp) {
                    ws.network.sendInput({respawn: 1});
                }
            })
        }
        if (window.testing) {
            ws.network.sendRpc({name: "SetOpenParty", isOpen: 0})
            ws.network.sendRpc({name: "SetPartyName", partyName: ws.cloneId + ''})
        }
        if (ws.data.uid) {
            ws.uid = ws.data.uid;
            ws.dataInfo = ws.data;
            ws.players = {};
            ws.inventory = {};
            ws.buildings = {};
            ws.parties = {};
            ws.lb = {}
            ws.playerUid = game.world.getMyUid();
            ws.network.sendInput({space: 1});
            ws.network.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: 1})
            ws.network.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: 1})
        }
        if (ws.data.entities) {
            if (window.message == ws.cloneId) {
                game.world.replicator.onEntityUpdate(ws.data);
            }
            if (ws.data.entities[ws.uid].name) {
                ws.myPlayer = ws.data.entities[ws.uid];
            }
            for (let g in ws.myPlayer) {
                if (ws.myPlayer[g] !== ws.data.entities[ws.uid][g] && ws.data.entities[ws.uid][g] !== undefined) {
                    ws.myPlayer[g] = ws.data.entities[ws.uid][g];
                }
            }
            if (ws.myPlayer.petUid) {
                if (ws.data.entities[ws.myPlayer.petUid]) {
                    if (ws.data.entities[ws.myPlayer.petUid].model) {
                        ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                        // AS FAR AS I CAN TELL THE LINE BELOW IS USELESS AS FUCK
                        ws.shouldHealPet = false;
                    }
                }
                for (let g in ws.myPet) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.myPet[g] !== ws.data.entities[ws.myPlayer.petUid][g] && ws.data.entities[ws.myPlayer.petUid][g] !== undefined) {
                            ws.myPet[g] = ws.data.entities[ws.myPlayer.petUid][g]
                        }
                    }
                }
            }
            for (let i in ws.data.entities) {
                if (ws.data.entities[i].name) {
                    ws.players[i] = ws.data.entities[i];
                }
                /*
                if (ws.data.entities[i].model == "Tree" || ws.data.entities[i].model == "Stone" || ws.data.entities[i].model == "NeutralCamp") {
                    if (!entityMaps.has(i)) {
                        entityMaps.add(i);
                        game.world.createEntity(ws.data.entities[i]);
                    }
                }
                */
            }
            for (let i in ws.players) {
                if (!ws.data.entities[i]) {
                    delete ws.players[i];
                }
                for (let g in ws.players[i]) {
                    if (ws.players[i][g] !== ws.data.entities[i][g] && ws.data.entities[i][g] !== undefined) {
                        ws.players[i][g] = ws.data.entities[i][g];
                    }
                }
                ws.playerTick = ws.players[ws.playerUid];
            }
        }
        if (ws.data.name == "DayCycle") {
            ws.tickData = ws.data.response;
            ws.isDay = ws.data.response.isDay;
        }
        if (ws.data.tick) {
            var currentTick = ws.data.tick;
            var msPerTick = 50;
            var dayRatio = 0;
            var nightRatio = 0;
            var barWidth = 130;
            if (ws.tickData) {
                if (ws.tickData.dayEndTick) {
                    if (ws.tickData.dayEndTick > 0) {
                        var dayLength = ws.tickData.dayEndTick - ws.tickData.cycleStartTick;
                        var dayTicksRemaining = ws.tickData.dayEndTick - currentTick;
                        dayRatio = 1 - dayTicksRemaining / dayLength;
                    }
                }
                else if (ws.tickData.nightEndTick > 0) {
                    var nightLength = ws.tickData.nightEndTick - ws.tickData.cycleStartTick;
                    var nightTicksRemaining = ws.tickData.nightEndTick - currentTick;
                    dayRatio = 1;
                    nightRatio = 1 - nightTicksRemaining / nightLength;
                }
                var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * -barWidth;
                var offsetPosition = currentPosition + barWidth / 2;
                if (offsetPosition) {
                    ws.dayTicker = Math.round(offsetPosition);
                }
            }
        }
        if (ws.data.name == "PartyInfo") {
            ws.partyInfo = ws.data.response;
            setTimeout(() => {
                for (let i in ws.partyInfo) {
                    if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                        ws.network.sendRpc({name: "SetPartyMemberCanSell", uid: game.world.getMyUid(), canSell: 1});
                        ws.network.sendRpc({name: "SetOpenParty", isOpen: 1});
                        setTimeout(() => {
                            ws.network.sendRpc({name: "SetPartyName", partyName: ws.cloneId + ""});
                        }, 1000);
                    }
                }
                if (game.ui.playerPartyId == ws.myPlayer.partyId && game.ui.playerPartyLeader) {
                    game.network.sendRpc({name: "SetPartyMemberCanSell", uid: ws.uid, canSell: 1});
                };
            }, 1750);
        }
        if (ws.data.name == "SetItem") {
            ws.inventory[ws.data.response.itemName] = ws.data.response;
            if (!ws.inventory[ws.data.response.itemName].stacks) {
                delete ws.inventory[ws.data.response.itemName];
            }
        }
        if (ws.data.name == "PartyApplicant") {
            ws.partyApplicant = ws.data.response;
            if (ws.partyApplicant.applicantUid == game.world.getMyUid()) {
                ws.network.sendRpc({name: "PartyApplicantDecide", applicantUid: game.world.getMyUid(), accepted: 1})
            }
        }
        if (ws.data.name == "ReceiveChatMessage") {
            ws.message = ws.data;

            if (window.allSockets[ws.cloneId-1]) {
                window.allSockets[ws.cloneId-1] = ws;
            };

            if (ws.message.response.uid == game.world.getMyUid()) {
                if (ws.message.response.message == "c") isOnControl = true;
                if (ws.message.response.message == `c${ws.cloneId}`) isOnControl = true;
                if (ws.message.response.message == "u") isOnControl = false;
                if (ws.message.response.message == `u${ws.cloneId}`) isOnControl = false;
                if (ws.message.response.message == `!psk ${ws.cloneId}`) copyText(`${ws.psk.response.partyShareKey}`);
                if (ws.message.response.message == `!info ${ws.cloneId}`) game.ui.components.PopupOverlay.showHint(`${ws.uid} - ${ws.cloneId}`);
                if (ws.message.response.message == `!dc ${ws.cloneId}`) ws.close();
                if (ws.message.response.message == "!s") {
                    document.getElementById("altrss").innerHTML += `<p>${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};</p>`;
                    setTimeout(() => { document.getElementById("altrss").innerHTML = ""; }, 10000);
                }
                if (ws.message.response.message == "!h") ws.autohi = !ws.autohi;
                if (ws.message.response.message == "!ahrc") {
                    ws.ahrc = true;
                };
                if (ws.message.response.message == `!ahrc ${ws.cloneId}`) {
                    game.ui.components.PopupOverlay.showHint(`Turned on AHRC for ${ws.cloneId}`);
                    ws.ahrc = true;
                };
                if (ws.message.response.message == "!!ahrc") {
                    ws.ahrc = false;
                };
                if (ws.message.response.message == `!!ahrc ${ws.cloneId}`) {
                    game.ui.components.PopupOverlay.showHint(`Turned off AHRC for ${ws.cloneId}`);
                    ws.ahrc = false;
                }
                if (ws.message.response.message == "!space") {
                    ws.network.sendInput({space: 0});
                    ws.network.sendInput({space: 1});
                }
                if (ws.message.response.message == `${ws.cloneId}`) {
                    ws.network.sendInput({space: 0});
                    ws.network.sendInput({space: 1});
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                }
                if (ws.message.response.message == "!upgrade") for (let i in ws.buildings) ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid});
                if (ws.message.response.message == "!re") ws.network.sendInput({respawn: 1});
                if (ws.message.response.message == `!re ${ws.cloneId}`) ws.network.sendInput({respawn: 1});
                if (ws.message.response.message == "!upStash") {
                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldStash") {
                            ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid});
                            break;
                        }
                    }
                }
                if (ws.message.response.message.includes("!up") && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(Number(ws.message.response.message[3])) + 1 >= 1) {
                    const towerOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(Number(ws.message.response.message[3]));
                    const towerType = ['Harvester', 'Wall', 'Door', 'SlowTrap', 'ArrowTower', 'CannonTower', 'MeleeTower', 'BombTower', 'MagicTower', 'GoldMine'][towerOrder];
                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == towerType) {
                            ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid});
                        }
                    }
                }
            }
        }
        if (ws.autohi) {
            if (ws.data.entities) {
                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name) {
                        ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `hi ${ws.data.entities[i].name}`});
                    }
                }
            }
        }
        if (ws.data.name == "Leaderboard") {
            for (let i in ws.data.response) ws.lb[ws.data.response[i].rank + 1] = ws.data.response[i];
            if (window.autoRaid) {
                if (ws.myPlayer) {
                    if (findNearestAltToStash().uid == ws.uid) {
                        if (Object.values(game.ui.buildings).length > 0 && !ws.myPlayer.dead) {
                            ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                        } else {
                            for (let i in window.allSockets) {
                                if (Object.values(window.allSockets[i].buildings).length > 0 && !ws.myPlayer.dead) {
                                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.allSockets[i].psk.response.partyShareKey + ""});
                                };
                            }
                        }
                        ws.network.sendInput({space: 0})
                        ws.network.sendInput({space: 1})
                    }
                }
            }
            ws.network.sendPing({nonce: 0});
            ws.network.sendRpc(game.metrics.metrics);
        }
        if (ws.space) {
            ws.network.sendInput({space: 0});
            ws.network.sendInput({space: 1});
        }
        if (ws.data.name == "LocalBuilding") {
            for (let i in ws.data.response) {
                ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                if (ws.buildings[ws.data.response[i].uid].dead) {
                    delete ws.buildings[ws.data.response[i].uid];
                }
            }
        }
        if (ws.data.name == "AddParty") {
            if (ws.addparties) {
                ws.parties[ws.data.response.partyId] = ws.data.response;
            }
        }
        if (ws.data.name == "RemoveParty") {
            if (ws.addparties) {
                if (ws.parties[ws.data.response.partyId].partyId) {
                    delete ws.parties[ws.data.response.partyId];
                }
            }
        }
        if (ws.data.name == "PartyShareKey") {
            ws.psk = ws.data;
            altElem.style.display = (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) ? "none" : "block";
        }
        if (ws.data.name == "Dead") {
            if (options.ar) {
                ws.network.sendInput({respawn: 1});
            }
            if (window.autoRaid) {
                ws.network.sendRpc({name: 'LeaveParty'});
            };
            if (window.xkey) {
                ws.network.sendInput({respawn: 1});
                setTimeout(() => {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: 1});
                    ws.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: 1});
                }, 250);
            }
        }
        if(window.mousemove && !window.altFollowPlayer) {
            ws.automove = true;
            let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x,game.ui.mousePosition.y);
            if (ws.myPlayer) {
                if (ws.myPlayer.position) {
                    if (ws.myPlayer.position.y - mouseToWorld.y > 1) {
                        ws.network.sendInput({
                            down: 0
                        })
                    } else {
                        ws.network.sendInput({
                            down: 1
                        })
                    }
                    if (-ws.myPlayer.position.y + mouseToWorld.y > 1) {
                        ws.network.sendInput({
                            up: 0
                        })
                    } else {
                        ws.network.sendInput({
                            up: 1
                        })
                    }
                    if (-ws.myPlayer.position.x + mouseToWorld.x > 1) {
                        ws.network.sendInput({
                            left: 0
                        })
                    } else {
                        ws.network.sendInput({
                            left: 1
                        })
                    }
                    if (ws.myPlayer.position.x - mouseToWorld.x > 1) {
                        ws.network.sendInput({
                            right: 0
                        })
                    } else {
                        ws.network.sendInput({
                            right: 1
                        })
                    }
                }
            }
        }

        if (window.altFollowPlayer && !window.mousemove) {
            let myPos = game.ui.playerTick.position;
            if (ws.myPlayer) {
                if (ws.myPlayer.position) {
                    if (ws.myPlayer.position.y - myPos.y > 1) {
                        ws.network.sendInput({
                            down: 0
                        })
                    } else {
                        ws.network.sendInput({
                            down: 1
                        })
                    }
                    if (-ws.myPlayer.position.y + myPos.y > 1) {
                        ws.network.sendInput({
                            up: 0
                        })
                    } else {
                        ws.network.sendInput({
                            up: 1
                        })
                    }
                    if (-ws.myPlayer.position.x + myPos.x > 1) {
                        ws.network.sendInput({
                            left: 0
                        })
                    } else {
                        ws.network.sendInput({
                            left: 1
                        })
                    }
                    if (ws.myPlayer.position.x - myPos.x > 1) {
                        ws.network.sendInput({
                            right: 0
                        })
                    } else {
                        ws.network.sendInput({
                            right: 1
                        })
                    }
                }
            }
        };

        if (window.mouseclick) {
            if (window.mousemove) document.getElementsByClassName("emm")[0].click();
            if (!ws.automove) ws.automove = true;
            if (ws.myPlayer) {
                if (ws.myPlayer.position) {
                    if (1 == 1) {
                        if (ws.myPlayer.position.y - targetPos.y > 1) {
                            ws.network.sendInput({
                                down: 0
                            })
                        } else {
                            ws.network.sendInput({
                                down: 1
                            })
                        }
                        if (-ws.myPlayer.position.y + targetPos.y > 1) {
                            ws.network.sendInput({
                                up: 0
                            })
                        } else {
                            ws.network.sendInput({
                                up: 1
                            })
                        }
                        if (-ws.myPlayer.position.x + targetPos.x > 1) {
                            ws.network.sendInput({
                                left: 0
                            })
                        } else {
                            ws.network.sendInput({
                                left: 1
                            })
                        }
                        if (ws.myPlayer.position.x - targetPos.x > 1) {
                            ws.network.sendInput({
                                right: 0
                            })
                        } else {
                            ws.network.sendInput({
                                right: 1
                            })
                        }
                    }
                }
            }
        }
        if (window.xkey) {
            let myPos = enemyStash;
            if (ws.myPlayer) {
                if (ws.myPlayer.position) {
                    if (1 == 1) {
                        if (ws.myPlayer.position.y - myPos.y > 100) {
                            ws.network.sendInput({
                                down: 0
                            })
                        } else {
                            ws.network.sendInput({
                                down: 1
                            })
                        }
                        if (-ws.myPlayer.position.y + myPos.y > 100) {
                            ws.network.sendInput({
                                up: 0
                            })
                        } else {
                            ws.network.sendInput({
                                up: 1
                            })
                        }
                        if (-ws.myPlayer.position.x + myPos.x > 100) {
                            ws.network.sendInput({
                                left: 0
                            })
                        } else {
                            ws.network.sendInput({
                                left: 1
                            })
                        }
                        if (ws.myPlayer.position.x - myPos.x > 100) {
                            ws.network.sendInput({
                                right: 0
                            })
                        } else {
                            ws.network.sendInput({
                                right: 1
                            })
                        }
                    };
                };
            };
        };
        if (ws.autoaim) {
            if (ws.playerTick) {
                ws.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + ws.playerTick.position.x)*100, (-ws.myPlayer.position.y + ws.playerTick.position.y)*100)})
            }
        }
        if (window.shouldStartScript) {
            if (getbosswaves() && getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                if (inull) {
                    inull = false;
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { inull = true; }, 250);
                }
            }
            if (ws.dayTicker < -18 && ws.dayTicker >= -23 && !ws.isDay && getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                if (i1) {
                    i1 = false;
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { i1 = true; }, 250);
                }
            }
            if (!getIsZombiesActive() && game.ui.playerPartyMembers.length !== 4 && !getactiveCommingbosswaves()) {
                if (i2) {
                    i2 = false;
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                    setTimeout(() => { i2 = true; }, 250);
                }
            }
            if (ws.dayTicker > 18 && ws.dayTicker <= 23 && getIsZombiesActive() && ws.isDay && game.ui.playerPartyMembers.length !== 4) {
                if (i3) {
                    i3 = false;
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { i3 = true; }, 250)
                }
            }
        }
        if (ws.data.opcode == 0) {
            if (options.heal) {
                if (ws.myPlayer) {
                    let playerHealth = (ws.myPlayer.health/ws.myPlayer.maxHealth) * 100;
                    if (playerHealth <= 50) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1})
                        ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1})
                    }
                }
                if (ws.myPet) {
                    let petHealth = (ws.myPet.health/ws.myPet.maxHealth) * 100;
                    if (petHealth <= 70) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                        ws.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                    }
                }
            }
            if (options.spamChat) {
                if (getId('4i2').value === "") {
                    const randomSpamText = [`${garbageGenerator()} BIG RAID ${garbageGenerator()}`, `?verify`, "hi", "ez", "Super Idolçš„ç¬‘å®¹éƒ½æ²¡ä½ çš„ç”œå…«æœˆæ£åˆçš„é˜³å…‰éƒ½æ²¡ä½ è€€çœ¼çƒçˆ± 105 Â°Cçš„ä½ æ»´æ»´æ¸…çº¯çš„è’¸é¦æ°´"];
                    const randomSpam = Math.floor(Math.random() * randomSpamText.length);
                    let randomText = randomSpamText[randomSpam];
                    ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${randomText}`});
                } else {
                    ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${garbageGenerator()} ${getId('4i2').value} ${garbageGenerator()}`});
                };
            };
            if (window.Join4Tier2Spear === true) {
                if (!ws.inventory.Spear) {
                    ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey});
                    if (ws.myPlayer.gold >= spearCostArray[document.getElementById('speartier').value - 1]) {
                        buySpear(ws, document.getElementById('speartier').value);
                        ws.network.sendRpc({name: 'LeaveParty'});
                    };
                }
            };
            if (ws.ahrc) {
                for(let uid in ws.buildings) {
                    let obj = ws.buildings[uid];
                    if (obj.type == "Harvester") {
                        let amount = obj.tier * 0.05 - 0.02;
                        ws.network.sendRpc({name: "AddDepositToHarvester", uid: obj.uid, deposit: amount});
                        ws.network.sendRpc({name: "CollectHarvester", uid: obj.uid});
                    };
                };
            };
            if (window.joinRandomAlt) {
                let randomAlt = Math.floor(Math.random() * window.allSockets.length);
                ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: window.allSockets[randomAlt].psk.response.partyShareKey});
            };
            if (options.autoAim && window.targets.length > 0) {
                const myPos = ws.myPlayer.position;
                const target = window.targets[0];
                const reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
                ws.network.sendPacket(3, {mouseMoved: reversedAim});
            }
            if (options.antiAttack) {
                if (ws.myPet) {
                    for (let i in window.allSockets) {
                        if (ws.myPet.lastPetDamageTarget == window.allSockets[i].uid || ws.myPet.lastPetDamageTarget == game.world.getMyUid()) {
                            ws.network.sendRpc({name: "EquipItem", itemName: "PetWhistle", tier: 1});
                        };
                    };
                };
            };
            altElem.style.left = (Math.round(ws.myPlayer.position.x) / game.world.getHeight() * 100) + '%';
            altElem.style.top = (Math.round(ws.myPlayer.position.y) / game.world.getWidth() * 100) + '%';
        };
        if (ws.activebow) {
            ws.network.sendInput({space: 0})
            ws.network.sendInput({space: 1})
        };
    };
  };
};

var getIsZombiesActive = function () {
    let isZombiesActive = false;
    for (let i in game.world.entities) {
        if (game.world.entities[i].fromTick.model !== "NeutralTier1") {
            if (game.world.entities[i].fromTick.entityClass == "Npc") {
                isZombiesActive = true;
            }
        }
    }
    return isZombiesActive;
};

var getactiveCommingbosswaves = function () {
    let activeCommingbosswave = false;
    let aftercommingbosswaves = [48, 56, 64, 72, 80, 88, 96, 104, 120];
    for (let i = 0; i < aftercommingbosswaves.length; i++) {
        if (game.ui.playerTick.wave == aftercommingbosswaves[i]) {
            activeCommingbosswave = true;
        }
    }
    return activeCommingbosswave;
};

var getactiveCommingbosswaves2 = function () {
    let activeCommingbosswave = false;
    let aftercommingbosswaves = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 120];
    for (let i = 0; i < aftercommingbosswaves.length; i++) {
        if (game.ui.playerTick.wave == aftercommingbosswaves[i]) {
            activeCommingbosswave = true;
        }
    }
    return activeCommingbosswave;
};

var getbosswaves = function () {
    let activebosswave = false;
    let allbosswaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];
    for (let i = 0; i < allbosswaves.length; i++) {
        if (game.ui.playerTick.wave == allbosswaves[i]) {
            activebosswave = true;
        }
    }
    return activebosswave;
};

// session saver part from eh + jrcc
/*
 let sessionElem = document.createElement('optgroup');

sessionElem.innerHTML = `
<option value="ses1">Session 1</option>
<option value="ses2">Session 2</option>
<option value="ses3">Session 3</option>
<option value="ses4">Session 4</option>`;
sessionElem.label = "Sessions";

game.ui.components.Intro.serverElem.appendChild(sessionElem);

window.s = sessionElem;

let sesOn = false;
let sessionUrl = "SessionSaver.iwebbysaregod.repl.co";

JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(obj, (key, value) =>
    typeof value === "object" && value !== null ? cache.includes(value) ? undefined : cache.push(value) && value : value, indent);

    cache = null;

    return retVal;
};

game.network.connect2 = game.network.connect;
game.network.connect = options => {
    let isUsingSession = false, sessionId = null;

    for (let i of sessionElem.children) {
        if (i.selected) { isUsingSession = true; sessionId = i.value; };
    }
    if (isUsingSession) {
        let sesWs = new WebSocket(`wss://${sessionUrl}`);
        sesWs.onopen = () => {
            sesWs.send(JSON.stringify({
                sessionId: sessionId,
                type: "init", o: "get"
            }));

            let hasEnteredWorld = false;

            sesWs.onmessage = msg => {
                let data = JSON.parse(msg.data);
                if (data.type == "data") {
                    if (data.o == "get") {
                        if (!hasEnteredWorld) {
                            hasEnteredWorld = true;
                            game.world.onEnterWorld({allowed: true});
                            game.ui.components.Intro.onEnterWorld({allowed: true});
                            game.world.init();
                        };
                        data.data.entities = JSON.parse(data.data.entities);
                        game.renderer.lookAtPosition(data.data.tick.position.x, data.data.tick.position.y);
                        game.world.localPlayer = data.data.tick;
                        for (let uid in data.data.entities) {
                            if (!game.world.entities[uid]) {
                                game.world.createEntity(data.data.entities[uid])
                            };
                        }
                    };
                };
            }
            sesWs.onclose = e => {
                game.ui.components.Intro.onConnectionError();
                console.log(e.reason);

                getElem("hud-intro-play")[0].innerText = "";
                getId('playspan').style.margin = '-130px 0px 0px 545px';
                getId('playspan').style.display = "block";
            };
        };
        return;
    };
    game.network.connect2(options);
};
*/


getElem('hud-shop-item')[6].remove(); // more horns
getElem('hud-shop-item')[8].remove(); // more pet
window.altNames = "";

let sm = document.querySelector("#hud-menu-settings");

sm.style.backgroundColor = "rgba(28, 92, 65, 0.55)";
sm.style.border = "5px solid white";

sm.innerHTML = `
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
<style>
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #d3d3d3;
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #6fa890;
}
.tab {
    border-top-left-radius: 35%;
    border-top-right-radius: 35%;
    background-color: #6fa890;
    width: 150px;
    height: 50px;
    border: 4px solid white;
    display: inline-block;
    text-align: center;
    color: black;
}
#addtab {
    background-color: #35594a;
    margin-left: 175px;
    margin-top: -40px;
}
.rmtab {
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    font-weight: bold;
}
.btn-fixed {
    display: inline-block;
    height: 25px;
    line-height: 25px;
    padding: 0 12px;
    background: #444;
    color: #eee;
    border: 0;
    font-size: 14px;
    vertical-align: top;
    text-align: center;
    text-decoration: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
}
.search-bar {
	background-color: #FFF;
	background-image: linear-gradient(to bottom right, rgba(118, 168, 111, 0.85), rgba(111, 168, 158, 0.85), rgba(131, 189, 117, 0.8));
    outline: none;
    border: 2px solid white;
    border-radius: 5px;
    color: white;
    text-shadow: 1.5px 1.5px 1px #41593b;
    font-size: 16px;
    vertical-align: middle;
}
::placeholder {
  color: white;
  text-shadow: 1.5px 1.5px 1px #41593b;
}
* {
   /* font-family: Hammersmith One; */
}
#searchpgs {
    width: 80%;
    height: 25px;
}
</style>
<div id="tabs">
    <div class="tab" id="tab1">
        <p>
            Main Menu
            <button class="rmtab" id="rmtab1">x</button>
        </p>
    </div>
</div>
<button class="btn" id="addtab">+</button>
<br />
<center>
<button class="btn-fixed search-bar" onclick="window.bfb();"><i class="fa fa-angle-left"></i></button>
<button class="btn-fixed search-bar" onclick="window.bff();"><i class="fa fa-angle-right"></i></button>
<input class="btn-fixed search-bar" style="width: 70%; height: 25px; vertical-align: middle;" type="search" placeholder="Search all menu pages..." id="searchpgs" />
<button class="btn-fixed search-bar" id="srchbtn"><i class="fa fa-search"></i></button></center>
<hr />
<div id="pageDisp">
</div>
`

let searchpgs = document.getElementById("searchpgs");
let srchbtn = document.getElementById("srchbtn");

searchpgs.addEventListener("keydown", function(e) {
    if(e.keyCode === 13) {
        window.searchTab(this.value);
    };
});

srchbtn.addEventListener("click", function(e) {
    window.searchTab(searchpgs.value);
});

window.focusedTab = 1;

let tabId = 2;
let tabs = document.getElementById("tabs");
let addTab = document.getElementById("addtab");
let addTabRightEffect = 175;
let addTabDownEffect = -40;
let tabsAmt = 1;
let pageDisp = document.getElementById("pageDisp");
let tabsData = [{
    type: "mainMenu",
    html: `
    <h1>sasquatch</h1>
    <p>Developer: <strong>eh#2907</strong></p>
    <p>Co-Developer: <strong>deathrain</strong></p>
    <hr />
    <h2>Categories</h3>
    <button class="btn btn-blue" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Score', 'score')">Score</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Offense', 'offense')">Offense</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Defense', 'defense')">Defense</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Miscellaneous', 'misc')">Misc.</button>
    `,
    keywords: []
}, {
    type: "score",
    html: `
    <h1>Score</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button>
    <button class="btn btn-green" onclick="window.redirectTab('Score Stats', 'ssts')">Score Stats</button>
    `,
    keywords: ["score", "wr", "4player", "4p", "trick", "base"],
    name: "Score",
    category: true
}, {
    type: "waves",
    html: `
    <h1>Waves</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    `,
    keywords: ["wave", "wr", "base", "alt", "bot", "clone"],
    name: "Waves",
    category: true
}, {
    type: "alts",
    html: `
    <h1>Alts</h1>
    <button class="btn btn-green" onclick="window.sendWs();">Send Alt</button>
    <input type="text" maxlength="29" placeholder="Alt Name" id="BotName" class="btn btn-grey">
    <select id="slctbnv">
    </select>
    <button class="btn btn-green" id="ALTname">Set Name</button>
    <br />
    <h1 id="nfnlt"># of alts: //nlt</h1>
    <p><strong><i class="fa fa-exclamation-circle"></i> Removing alts is still a work in progress, sometimes it may not work</strong></p>
    <div id="pches">
    //pche
    </div>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button>
    `,
    keywords: ["alt", "bot", "4p", "trick", "fill", "clone"],
    name: "Alts",
    cache: ``,
    category: true,
    script: `
let slctbnv = document.getElementById("slctbnv");
slctbnv.innerHTML = window.altNames;
let bn = document.getElementById("BotName");
let an = document.getElementById("ALTname");
slctbnv.onchange = () => {
    bn.value = this.value;
};
an.onclick = () => {
    let bnv = bn.value;
    localStorage.name = bnv;
    window.altNames += '<br><option value="' + bnv + '">' + bnv + '</option>';
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt });
};
    `
}, {
    type: "offense",
    html: `
    <h1>Offense</h1>
    <hr />
    `,
    keywords: ["raid", "kill", "offense", "offend"],
    name: "Offense",
    category: true
}, {
    type: "defense",
    html: `
    <h1>Defense</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('AFS', 'afs')">AFS</button>
    <button class="btn btn-green" onclick="window.redirectTab('Auto Revive', 'arp')">Auto Revive</button>
    `,
    keywords: ["defense", "defend", "anti", "rebuild", "re build", "auto rebuild", "autorebuild", "auto", "shield", "fixed shield", "fixedshield", "afs", "arp", "revive", "pet"],
    name: "Defense",
    category: true
}, {
    type: "playertrick",
    html: `
    <h1>Player Trick</h2>
    <button class="btn" id="tglpt"></button>
    <p><strong><i class="fa fa-info-circle"></i> Will apply to the current alts, not send them</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-green" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Score', 'score')">Score</button>
    `,
    script: `
    let tglpt = document.getElementById("tglpt");

    if(window.playerTrickToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "Disable Player Trick"
    } else {
        tglpt.classList.add("btn-green");
        tglpt.innerText = "Enable Player Trick"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "Disable Player Trick";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "Enable Player Trick";
        };
        window.togglePlayerTrick();
    });
    `,
    keywords: ["4p", "4player", "trick", "score", "wr", "bot", "alt", "4 player"],
    name: "Player Trick",
    category: false
}, {
    type: "search",
    html: `
    <h1>//sqt</h1>
    <div>
    //rsl
    </div>
    `,
    keywords: []
}, {
    type: "afs",
    html: `
    <h1>Auto Fix Shield</h1>
    <button id="afstgl" class="btn"></button>
    <p><strong><i class="fa fa-question-circle"></i> Automatically tries to upgrade to the maximum tier of shield, while fixing the low shield health glitch</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-blue" onclick="window.redirectTab('Defense', 'defense')">Defense</button>
    `,
    script: `
    let tglpt = document.getElementById("afstgl");

    if(window.afsToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "Disable AFS"
    } else {
        tglpt.classList.add("btn-green");
        tglpt.innerText = "Enable AFS"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "Disable AFS";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "Enable AFS";
        };
        window.toggleAFS();
    });
    `,
    keywords: ["afs", "defense", "shield", "fix"],
    name: "AFS",
    category: false
}, {
    type: "arp",
    html: `
    <h1>Auto Revive Pets</h1>
    <button id="arptgl" class="btn"></button>
    <p><strong><i class="fa fa-exclamation-circle"></i> May create lag</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-green" onclick="window.redirectTab('Defense', 'defense')">Defense</button>
    `,
    script: `
    let arptgl = document.getElementById("arptgl");

    if(window.arpToggle) {
        arptgl.classList.add("btn-red");
        arptgl.innerText = "Disable Revive"
    } else {
        arptgl.classList.add("btn-green");
        arptgl.innerText = "Enable Revive"
    };

    arptgl.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "Disable Revive";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "Enable Revive";
        };
        window.toggleARP();
    });
    `,
    name: "Auto Revive",
    keywords: ["arp", "revive", "pet", "defense"],
    category: false
}, {
    type: "misc",
    html: `
    <h1>Miscellaneous</h1>
    `,
    name: "Miscellaneous",
    keywords: ["misc", "zoom"],
    category: true
}, {
    type: "ssts",
    html: `
    <h1>Score Stats</h1>
    <p id="aspw">Average SPW / player: N/A</p>
    `,
    name: "Score Stats",
    keywords: ["score", "stat", "analytic"],
    category: false
}];
let currentTabs = [{
    elem: document.getElementById("tab1"),
    type: "mainMenu",
    id: 1,
    ict: 0
}];
let bfTabs = [{ title: "Main Menu", type: "mainMenu", html: tabsData[0].html }];
let bfIndex = 0;

window.nlt = 0;

//pageDisp.style.overflow = "scroll";
sm.style.overflow = "scroll";

addTab.style.transition = "margin 300ms";

const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
window.scores = [];

game.network.addRpcHandler("DayCycle", () => {
    window.newScore = game.ui.playerTick.score;
    window.scores.push(window.newScore - window.oldScore)
    window.oldScore = game.ui.playerTick.score;
    let cts = currentTabs[window.focusedTab];
    if(cts) {
        if(cts.type === "ssts") { document.getElementById("aspw").innerText = `Average SPW: ${arrAvg(window.scores)}`; };
    };
});

window.getTabDataByType = type => tabsData.find(i => i.type === type);

const getTabById = id => currentTabs.find(i => i.id === id);

pageDisp.innerHTML = window.getTabDataByType("mainMenu").html;

const hint = (txt, time) => {
    game.ui.components.PopupOverlay.showHint(txt, time);
};

const addRmTabFunctionality = (element, ict) => {
    element.addEventListener("click", function(e) {
        e.stopPropagation();
        this.parentElement.parentElement.remove();
        addTab.style.marginLeft = `${addTabRightEffect -= 150}px`;
        if((tabsAmt--) <= 1) {
            addTab.style.marginTop = `0px`;
        } else {
            addTab.style.marginTop = `-40px`;
        };
        addTab.style.display = "block";

        let ct = document.getElementsByClassName("tab");
        let ctl = ct[ct.length - 1];

        if(ctl) {
            let ctlid = parseInt(ctl.id.replace("tab", ""));
            window.focusTab(ctlid, true);
        };

        currentTabs.splice(ict, 1);

        if(tabsAmt === 0) {
            pageDisp.innerHTML = ``;
        };

        for(let itc of currentTabs) {
            itc.ict = currentTabs.indexOf(itc);
        };
    });
};

const addTabFocusOnClickFunctionality = element => {
    element.addEventListener("click", function(e) {
        let irddt = {};
        let ird = parseInt(this.id.replace("tab", ""));
        try {
            irddt = window.getTabDataByType(currentTabs[ird - 1].type);
        } catch {};
        window.focusTab(ird, { pche: irddt.cache || "", nlt: window.nlt });
        console.log(ird);
    });
};

addRmTabFunctionality(document.getElementById("rmtab1"));
addTabFocusOnClickFunctionality(document.getElementById("tab1"));

window.focusTab = (id, data) => {
    window.focusedTab = id;
    for(let i of currentTabs) {
        if(i.id !== id) {
            i.elem.style.backgroundColor = "#4b806a";
        } else if(i.id === id) {
            i.elem.style.backgroundColor = "#6fa890";
            let tdt = window.getTabDataByType(i.type);

            let vtdth = tdt.html;

            for(let iokvtd in data) {
                vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
            };

            pageDisp.innerHTML = vtdth;
            if(tdt.script) {
                eval(tdt.script);
            };
        } else {
            i.elem.style.backgroundColor = "#4b806a";
        };
    };
};

window.makeTab = (text, type) => {

    if((tabsAmt + 1) > 3) {
        addTab.style.display = "none";
        return;
    } else { tabsAmt++; };

    let tab = document.createElement("div");
    tab.classList.add("tab");
    tab.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${tabId}">x</button>
    </p>
    `;
    tab.id = `tab${tabId}`;
    console.log(tab.id);
    tabs.append(tab);

    let elem = document.getElementById(`tab${tabId}`);
    let ctobj = { elem: elem, type: type, id: tabId };

    let ict = currentTabs.length - 1;

    ctobj.ict = ict;

    currentTabs.push(ctobj);

    for(let itc of currentTabs) {
        itc.ict = currentTabs.indexOf(itc);
    };

    console.log(currentTabs);

    let tdt = window.getTabDataByType(type);

    window.focusTab(tabId, { sqt: text, pche: tdt.cache || "" });

    addTab.style.marginLeft = `${addTabRightEffect += 150}px`;

    console.log(`${tabsAmt} tabsAmt`);

    let oldTabId = tabId;
    tabId++;

    if(tabsAmt === 3) {
        addTab.style.display = "none";
    };

    if(tabsAmt >= 1) {
        addTab.style.marginTop = "-40px";
    };

    let currentRmTab = document.getElementById(`rmtab${oldTabId}`);
    addRmTabFunctionality(currentRmTab, ict);
    addTabFocusOnClickFunctionality(document.getElementById(`tab${oldTabId}`));

    bfTabs.push({ title: text, script: tdt.script, html: tdt.html, type: type });

    bfIndex++;

    return ctobj;
};

window.redirectTab = function(text, type) {
    let gd = getTabById(window.focusedTab);
    let gid = gd.elem;
    gid.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
    currentTabs[gd.ict].type = type;
    let tdt = window.getTabDataByType(type);
    pageDisp.innerHTML = tdt.html;

    bfTabs.push({ title: text, script: tdt.script, html: tdt.html, type: type });

    bfIndex++;
    if(tdt.script) {
        eval(tdt.script);
    };
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(currentTabs[idrtd - 1].type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt });
};

window.redirectTab2 = function(text, type) {
    let gd = getTabById(window.focusedTab);
    let gid = gd.elem;
    gid.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
    currentTabs[gd.ict].type = type;
    let tdt = window.getTabDataByType(type);
    pageDisp.innerHTML = tdt.html;
    if(tdt.script) {
        eval(tdt.script);
    };
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(currentTabs[idrtd - 1].type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt });
};

window.bfRedirect = index => {
    let bfri = bfTabs[index];
    window.redirectTab2(bfri.title, bfri.type);
};

window.bfb = () => {
    let bfim = bfTabs[bfIndex - 1];
    if(bfim) {
        window.bfRedirect(bfIndex---1);
    };
};

window.bff = () => {
    let bfip = bfTabs[bfIndex + 1];
    if(bfip) {
        window.bfRedirect(bfIndex+++1);
    };
};

const qryify = qry => {
    return (qry.length > 2) ? `${qry.slice(0, 2)}...` : qry
};

window.searchTab = function(query) {
    if(getTabById(window.focusedTab)) {
        let gd = getTabById(window.focusedTab);
        let gid = gd.elem;

        let rsl = ``;

        for(let itd of tabsData) {
            for(let itkd of itd.keywords) {
                if(query.toLowerCase().includes(itkd) && !rsl.includes(itd.name)) {
                    rsl += `<button onclick="window.redirectTab('${itd.name}', '${itd.type}')" class="btn btn-${itd.category ? "blue" : "green"}">${itd.name}</button><br />`;
                };
            };
        };

        if(rsl.length === 0) { rsl = `No results for ${query}`; };

        let data = {
            sqt: `Results for: ${query}`,
            rsl: rsl
        };

        gid.innerHTML = `
    <p>
        Search - ${qryify(query)}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
        gid.type = "search";
        let tdt = window.getTabDataByType("search");

        let vtdth = tdt.html;

        for(let iokvtd in data) {
            vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
        };

        pageDisp.innerHTML = vtdth;

        if(tdt.script) {
            eval(tdt.script);
        };
        addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    } else {
        window.makeTab(`Search - ${qryify(query)}`, "search");
    };
};

addTab.addEventListener("click", function() {
    window.makeTab("Main Menu", "mainMenu");
});

let sockets = [];
window.sendWs = () => {
    document.getElementById("nfnlt").innerHTML = `# of alts: ${window.nlt+++1}`;

    let hc = `
    <div id="rmalt${window.nlt}">
        <br />
        <button class="btn btn-red" onclick="window.rmAlt(${window.nlt});" id="rmaltbtn${window.nlt}"><i class="fa fa-trash"></i> Remove Alt #${window.nlt}</button>
    </div>
    `;

    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}`;
    let ifd = `s${Math.floor(Math.random() * 100000)}`;
    iframe.id = ifd;
    document.body.append(iframe);

    let ifde = document.getElementById(ifd);
    ifde.addEventListener('load', function() {
        this.contentWindow.eval(`
document.querySelector(".hud-intro-play").click();
game.network.addEnterWorldHandler(() => {
    console.log("loaded alt");
    game.network.sendInput({ left: 1, up: 1 });
    game.stop();
});
`);
    });
    let si = sockets.length;
    ifde.rmh = hc;
    ifde.si = si;
    ifde.nli = window.nlt;
    sockets.push(ifde);

    window.getTabDataByType("alts").cache += hc;
    window.focusTab(window.focusedTab, { nlt: window.nlt, pche: window.getTabDataByType("alts").cache });
};

window.rmAlt = num => {
    let sck = sockets[num-1];
    window.nlt--;
    console.log(num);
    sck.remove();

    console.log(sck.nli);

    document.getElementById(`rmalt${sck.nli}`).remove();

    window.getTabDataByType("alts").cache = document.getElementById("pches").innerHTML;

    window.focusTab(window.focusedTab, { nlt: window.nlt, pche: window.window.getTabDataByType ("alts").cache });
};

const kickAll = () => {
    for (let i in game.ui.playerPartyMembers) {
        if (game.ui.playerPartyMembers[i].playerUid == game.ui.playerTick.uid) continue;
        game.network.sendRpc({
            name: "KickParty",
            uid: game.ui.playerPartyMembers[i].playerUid
        });
    };
};

const joinAll = () => {
    sockets.forEach(socket => {
        console.log(socket);
        socket.contentWindow.eval(`
            game.network.sendRpc({
			    name: "JoinPartyByShareKey",
			    partyShareKey: "${game.ui.getPlayerPartyShareKey()}"
		    });
        `);
    });
};



let isDay,
    tickStarted,
    tickToEnd,
    hasKicked = false,
    hasJoined = false;

game.network.addEntityUpdateHandler(tick => {
    if(window.playerTrickToggle) {
        if (!hasKicked) {
            if (tick.tick >= tickStarted + 18 * (1000 / game.world.replicator.msPerTick)) {
                kickAll();
                hasKicked = true;
            };
        };
        if (!hasJoined) {
            if (tick.tick >= tickStarted + 118 * (1000 / game.world.replicator.msPerTick)) {
                joinAll();
                hasJoined = true;
            };
        };
    };
});

game.network.addRpcHandler("DayCycle", e => {
    isDay = !!e.isDay;
    if (!isDay) {
        tickStarted = e.cycleStartTick;
        tickToEnd = e.nightEndTick;
        hasKicked = false;
        hasJoined = false;
    };
});

window.togglePlayerTrick = () => {
    window.playerTrickToggle = !window.playerTrickToggle;
};

let chatSocket = new WebSocket('wss://iGniTioN.eh7644.repl.co/');
const fakeMessage = (name, message) => {
    let chatUi = game.ui.getComponent("Chat");
    var messageElem = chatUi.ui.createElement(`<div class=\"hud-chat-message\"><strong style=\"color:gray;\">${name}</strong>: ${message}</div>`);
    chatUi.messagesElem.appendChild(messageElem);
    chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
};

const chatLog = msg => {
    let chatUi = game.ui.getComponent("Chat");
    var messageElem = chatUi.ui.createElement(`<div class=\"hud-chat-message\"><p style=\"color: orange\">${msg}</p></div>`);
    chatUi.messagesElem.appendChild(messageElem);
    chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
};

chatSocket.onmessage = msg => {
    let parsed = JSON.parse(msg.data);
    switch(parsed.type) {
        case "chat":
            fakeMessage(parsed.name, parsed.message);
            break;
        case "dm":
            fakeMessage(parsed.from, parsed.message);
        case "log":
            chatLog(parsed.content);
            break;
    };
};

window.sendGlobalMsg = (author, content) => {
    chatSocket.send(JSON.stringify({ type: "chat", name: author, message: content }));
};

window.sendDM = (to, content) => {
    chatSocket.send(JSON.stringify({ type: "dm", to: to, content: content }));
};

game.network.addEnterWorldHandler(() => {
    document.querySelector("#hud-chat > input").addEventListener('keypress', function(e) {
        if(e.keyCode === 13) {
            if(this.value.toLowerCase().startsWith('/chat')) {
                window.sendGlobalMsg(game.ui.playerTick.name, this.value.slice(6));
                this.value = "";
            } else if(this.value.toLowerCase().startsWith('/dm')) {
                let args = this.value.split(' ');
                window.sendDM(args[1], this.value.slice(args[1].length + 4));
                this.value = "";
            } else if(this.value.toLowerCase().startsWith('/users')) {
                chatSocket.send(JSON.stringify({ type: "getUsers" }));
                this.value = "";
            };
        };
    });

    setTimeout(() => {
        chatSocket.send(JSON.stringify({ type: "init", username: game.ui.playerTick.name }));
    }, 750);
});

// commented out because chat is disabled currently -eh

const fixShield = () => {
    if(game.world.inWorld) {
        if (game.ui.playerTick.zombieShieldHealth < 85000 && window.afsToggle) {
            game.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
        };
    };
};
game.network.addRpcHandler("DayCycle", fixShield);

window.toggleAFS = function() {
    window.afsToggle = !window.afsToggle;
};

const revive = () => {
    let rae = document.querySelector("a.hud-shop-actions-revive");
    if(rae) {
        rae.click();
    };
};

setInterval(() => {
    if(window.arpToggle) {
        revive();
    };
}, 250);


window.toggleARP = function() {
    window.arpToggle = !window.arpToggle;
};