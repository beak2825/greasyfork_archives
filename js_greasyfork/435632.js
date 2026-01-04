// ==UserScript==
// @name         Xeraphinite - zombs.io
// @namespace    http://tampermonkey.net/
// @version      2.17
// @description  fontawesome icons (both svgs and converted to pngs) added.
// @author       rdm, god of simping
// @match        *://zombs.io/
// @icon         https://cdn.discordapp.com/attachments/854376044522242059/907931471518502922/flowerxeraphinite.png
// @grant        none
// @require      https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @downloadURL https://update.greasyfork.org/scripts/435632/Xeraphinite%20-%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/435632/Xeraphinite%20-%20zombsio.meta.js
// ==/UserScript==

// v0.1: basic html and css added
// v0.2: html and css done (except party hud)
// v0.3: all html and css done
// v0.4: some functions added
// v0.41: added credits
// v0.5: reworked sell menu
// v0.6: find it out yourself
// v0.61: small adjustments, almost ready for release
// v0.7: added crossbow toolbar icon and afs
// v0.8: autobow added
// v0.9: marker functions, v1.0?
// v1.0: official release, added changelog button
// v1.1: added rendering options, pretty big update imo
// v1.2: fixed score logger, added some small functions
// v1.3: ui change, added chat spammer...
// v1.4: funky button toggle in party hud, woohoo
// v1.5: HUGE ui changes and bug fixes
// v1.53: just a note, score logger will be deleted in v1.6.
// v1.55: quick feature debug, you can now resize chat.
// v1.6: score logger is gone.
// v1.7: name a useless feature
// v1.72: critical fix of not being abled to request to parties, sorry!
// v.75: quick afs update, refined some stuff
// v1.8: great new chat system by Morpheus_ !
// v1.82: updated to comply with the new patch update, smaller ahrc raw code.
// v1.9: added ignition's show rss counter.
// v1.92: last minor update of v1.0, refined functions and temporary disabled sell all functions.
// v2.0: ui themes (more coming soon), refined functions and tidied up the code.
// v2.1: 1 more themes + screenshot mode.
// v2.11: record base fix.

/* remove cringe icons & intro styles */
document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, .hud-intro-social, .hud-intro-more-games').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 24px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 400px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");

if (localStorage.themeClass == undefined) localStorage.setItem('themeClass', 'summer');

// intro screen options since people complain about me putting only two waifus to simp
let setColor = {
    themeColor: {
        summer: '#1eacbf',
        mirai: '#1eacbf',
        zettai: '#13c2b4',
        blossom: '#e492dd',
    },
    lightThemeColor: {
        summer: '#1cb2c9',
        mirai: '#1cb2c9',
        zettai: '#59d4ca',
        blossom: '#d47acd',
    },
    hoverColor: {
        summer: '#10c7e3',
        mirai: '#10c7e3',
        zettai: '#40eddf',
        blossom: '#ff7df4',
    },
    background: {
        summer: 'https://cdn.discordapp.com/attachments/854376044522242059/907880671610040330/background.jpg',
        mirai: 'https://cdn.discordapp.com/attachments/854376044522242059/924865286719557672/BG_Mirai_Light.webp',
        zettai: 'https://cdn.discordapp.com/attachments/854376044522242059/946654780367978516/BG_zettai_light.webp',
        blossom: 'https://cdn.discordapp.com/attachments/854376044522242059/897760137043902474/another_one.png',
    },
    menuBackground: {
        summer: 'rgba(28, 178, 201, 0.5)',
        mirai: 'rgba(28, 178, 201, 0.5)',
        zettai: 'rgba(60, 207, 195, 0.5)',
        blossom: 'rgba(158, 47, 142, 0.55)',
    },
};

let susArray = [`
<img src="https://cdn.discordapp.com/attachments/854376044522242059/952365789632163931/ganyu.png" style="margin: -1290px 0 0 0;width: 512px;opacity: 0.05;display: flex;" >
`, '', '', '', '']

let cssTitle = `
.hud-intro::before {
    background-image: url(${setColor.background[localStorage.themeClass]});
    background-size: cover;
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
    outline: none;
    border: 2px solid white;
    border-radius: 5px;
    color: black;
    font-size: 16px;
    vertical-align: middle;
    margin: 0 5px 0 0;
}
.btn:hover {
    cursor: pointer;
}
.border-theme {
    border: 3px solid ${setColor.themeColor[localStorage.themeClass]};
    border-radius: 4px;
    background: none;
    transition: all 0.15s ease-in-out;
}
.border-theme:hover {
    cursor: pointer;
    border-color: ${setColor.hoverColor[localStorage.themeClass]};
}
.btn-theme {
    background-color: ${setColor.themeColor[localStorage.themeClass]};
}
.btn-theme:hover {
    background-color: ${setColor.hoverColor[localStorage.themeClass]};
}
.hud-xera-anchor {
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
}
.hud-xera-anchor-no-hover {
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
}
.hud-xera-anchor::after {
    content: ' ';
    display: block;
    position: absolute;
    top: 16px;
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
.hud-xera-anchor-no-hover::after {
    content: ' ';
    display: block;
    position: absolute;
    top: 16px;
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
.hud-xera-anchor[data-item=record]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916849867370938450/WHITE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=build]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916853186491469914/ALSO_WHITE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=deletebase]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916854543977955348/WHITE_CIRCLE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=upall]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/916855487457271838/DOUBLE_WHITE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=togglechat]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/917286994667769886/THE_WHITE_TOGGLE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=ahrc]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/917623699115507752/FILL_THE_WHITE.png');
    top: 13px;
}
.hud-xera-anchor[data-item=exactrss]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/917624255104057354/EQUAL_TO_THE_WHITE.png');
    top: 13px;
}
.hud-xera-anchor-no-hover[data-item=rdmcolor]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/923866937677725737/A_WHITE_PALLETTE.png');
    top: 13px;
}
.hud-xera-anchor-no-hover[data-item=spamchat]::after {
    background-image: url('https://cdn.discordapp.com/attachments/854376044522242059/917297025970757652/A_WHITE_SPAMMER.png');
    top: 13px;
}
.hud-input-value {
    margin: 0 0 60px;
    border-radius: 4px 4px 0 0;
}
.disabled-class {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
}
.hud-xera-actions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 50px;
    margin: 0;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 0 4px 4px;
}
.hud-xera-anchor:hover {
    background: rgba(255, 255, 255, 0.2);
}
.hud-menu-settings span {
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    display: flex;
}
.hud-intro-main {
    border-radius: 5px;
    padding: 0px 25px 25px 25px;
    width: 580px;
    height: 290px;
    max-height: 400px;
    background-image: linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))
}
.hud-intro .hud-intro-form .hud-intro-play {
    background-color: ${setColor.themeColor[localStorage.themeClass]};
}
.hud-intro .hud-intro-form .hud-intro-play:hover {
    background-color: ${setColor.hoverColor[localStorage.themeClass]};
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(cssTitle));
document.head.appendChild(styles);
styles.type = "text/css";

document.getElementsByClassName('hud-intro-corner-bottom-left')[0].insertAdjacentHTML("afterbegin", `
<img src="https://cdn.discordapp.com/attachments/854376044522242059/908331735010377728/xeraedit.png" class="xera" style="opacity: 0.5;">
`);

document.getElementsByClassName('hud-intro-corner-bottom-right')[0].insertAdjacentHTML("afterbegin", `
<select id="introBackground" class="btn" style="background: white;color: black;text-shadow: none;opacity: 0.6;">
    <option value="summer" ${localStorage.themeClass == 'summer' ? 'selected' : ''}>Summer Hikari & Tairitsu</option>
    <option value="mirai" ${localStorage.themeClass == 'mirai' ? 'selected' : ''}>Light Mirai</option>
    <option value="zettai" ${localStorage.themeClass == 'zettai' ? 'selected' : ''}>Light Zettai</option>
    <option value="blossom" ${localStorage.themeClass == 'blossom' ? 'selected' : ''}>Blossom</option>
</select>
<br></br>
<span style="color: white;opacity: 0.4;">Option will save after hitting the Play button!</span>
`);
game.ui.components.Intro.submitElem.addEventListener('click', () => {
    localStorage.setItem('themeClass', document.getElementById('introBackground').value);
})

/* random character gen */
var availableCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~!@#$%^&*()_+`-=[]{};':,./<>?\|";
var textLength = 29;
var text = "";
for (let i = 0; i < textLength; i++) text += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];


/* name stuffs here */
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

let guide = document.getElementsByClassName("hud-intro-guide")[0];
guide.innerHTML = `
<center>
<h1 style="text-transform: none;">Usernames</h1>
<hr />
</center>
<br />
<button class="btn hud-intro-invisible" style = 'margin-bottom: 10px;'>Invisible username</button>
<button class="btn hud-intro-random" style = 'margin-bottom: 10px;'>Random-generated username</button>
<div class="hud-intro-name-save">
</div>
`;
guide.style.height = "260px";

function invisiblename() { document.getElementsByClassName('hud-intro-name')[0].value = "ㅤ"; };
function randomname() { document.getElementsByClassName('hud-intro-name')[0].value = `${text}`; };

document.querySelector('.hud-intro-invisible').addEventListener('click', invisiblename);
document.querySelector('.hud-intro-random').addEventListener('click', randomname);


/* ui styles */
document.getElementsByClassName('hud-top-right')[0].insertAdjacentHTML("beforeend", `
<div id="zsd">
    <button class="btn btn-theme" style="position: absolute;left: -41.5%;z-index: 14;top: 0%;width: 48px;padding: 0 0 0 0px;" onclick="window.zoomOut();">
        <i class="fa fa-arrow-up fa-2x" style="margin-top: 5px;"></i>
    </button>
    <input type='range' style='-webkit-appearance: slider-vertical;position: absolute;left: -15%;width: 5%;z-index: 14;top: -1000%;' id="zoomSlider" min=0.2 max=20 value=1 step=0.02 />
    <button class="btn btn-theme" style="position: absolute;z-index: 14;left: -60%;top: 0%;width: 45px;padding: 0 0 0 0px;" onclick="window.zoomIn();">
        <i class="fa fa-arrow-down fa-2x" style="margin-top: 5px;"></i>
    </button>
</div>`);
document.getElementsByClassName('hud-top-right')[0].insertAdjacentHTML("beforeend", `
<div class="refrsh">
    <button class="btn btn white" style="position: absolute;z-index: 14;left: -20%;top: 0%;width: 40px;height: 40px; padding: 0 0 0 0px;" onclick="window.toggleZoS();">
        <i class="fa fa-redo"></i>
    </button>
</div>
`);
document.getElementsByClassName("hud-menu-icons")[0].insertAdjacentHTML("beforeend", `<div class="hud-menu-icon" data-type="More" onclick="window.moreMenu();"></div>`);
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
};
document.getElementsByClassName('hud-respawn')[0].insertAdjacentHTML('beforeend', `${getRandomItem(susArray)}`);

document.body.insertAdjacentHTML('beforeend', `
<div class="hud-menu hud-menu-settings hud-menu-more">
<h3 style="text-align: left;">Renderer</h3>
<br />
<br />
<div style="text-align: left">
<button class="btn btn-theme 1z" style="width: 45%;margin: 1px;">Stop Rendering Ground?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> The ground will start/stop rendering.</small>
<br />
<br />
<div id="addon" style="display: none;">
<button class="btn btn-green 1z1" style="margin: 1px;">Black Ground With Grid?</button>
<br />
<br />
</div>
<button class="btn btn-theme 2z" style="width: 45%;margin: 1px;">Stop Rendering NPCs?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> All NPCs (including players, apparently) will start/stop rendering.</small>
<br />
<br />
<button class="btn btn-theme 3z" style="width: 45%;margin: 1px;">Stop Rendering Enviroment?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Trees, Stones, Crystals and Buildings will start/stop rendering. Can be a performance increase if you have travelled to too many places on the map...</small>
<br />
<br />
<button class="btn btn-theme 4z" style="width: 45%;margin: 1px;">Stop Rendering Projectiles?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Projectiles will start/stop rendering. Good for sitting in large bases!</small>
<br />
<br />
<button class="btn btn-theme 5z" style="width: 45%;margin: 1px;">Stop Rendering <strong>Everything</strong>?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i><strong> Everything.</strong></small>
<br />
<br />
<button class="btn btn-theme 6z" style="width: 45%;margin: 1px;">Stop Renderer?</button>
<br />
<br />
<small><i class="fa fa-info-circle"></i> Freezes renderer.</small>
<br />
<br />
</div>
</div>
`);
var xyshow = document.createElement("p");
xyshow.style = 'position: relative;top: 17px;right: 0px;font-weight: 900;font-family: "Hammersmith One";text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0.5px 0.5px #fff, -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff;';
xyshow.innerHTML = "loading x/y coordinate";
xyshow.className = "xyshowcoordinate";
document.querySelector(".hud-bottom-left").appendChild(xyshow);

let cssMain = `
#hud-menu-party {
    top: 51%;
    width: 610px;
    height: 480px;
    background-color: ${setColor.menuBackground[localStorage.themeClass]};
    border: 5px solid white;
}
.hud-menu-party .hud-party-tag {
    width: 120px;
}
.hud-menu-party .hud-party-share {
    width: 280px;
}
.hud-menu-party .hud-party-grid .hud-party-link.is-active {
    background: ${setColor.lightThemeColor[localStorage.themeClass]} !important;
}
.hud-menu-party .hud-party-visibility {
    background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-menu-party .hud-party-visibility:hover, .hud-menu-party .hud-party-visibility:active {
    background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-popup-overlay .hud-popup-confirmation .hud-confirmation-actions .btn.btn-green {
    background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-chat {
    resize: vertical;
    max-height: 380px;
    min-height: 75px;
    overflow-y: auto;
    border-radius: 4px 4px 4px 0;
}
.hud-chat .hud-chat-message {
    display: block;
    position: relative;
    width: 90%;
    white-space: unset;
    word-break: break-all;
    overflow: visible;
}
.hud-chat .hud-chat-message strong {
    display: inline-block;
}
.hud-chat .hud-chat-message > small {
    position: absolute;
    right: -12%;
    font-weight: bold;
    opacity: 0.4;
}
#hud-menu-shop {
    top: 54.5%;
    left: 50.5%;
    width: 690px;
    height: 500px;
    background-color: ${setColor.menuBackground[localStorage.themeClass]};
    border: 5px solid white;
    margin: -350px 0 0 -350px;
    padding: 20px 20px 20px 20px;
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip {
    background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:hover, .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:active {
    background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip.is-disabled {
    background: none;
}
.hud-menu-shop .hud-shop-grid .hud-shop-item[data-item=HatComingSoon] .hud-shop-item-coming-soon {
    background: none;
}
#hud-menu-settings {
    height: 550px;
    background-color: ${setColor.menuBackground[localStorage.themeClass]};
    border: 5px solid white;
}
.hud-menu-settings .hud-xera-grid {
    display: block;
    height: 460px;
    padding: 10px;
    margin-top: 18px;
    background: rgba(0, 0, 0, 0.2);
    overflow: auto;
}
.hud-respawn .hud-respawn-info .hud-respawn-btn {
   background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
.hud-respawn .hud-respawn-info .hud-respawn-btn:hover {
   background: ${setColor.lightThemeColor[localStorage.themeClass]};
}
#hud-building-overlay {
    background-color: ${setColor.menuBackground[localStorage.themeClass]};
    border: 1px solid white;
}
.btn.btn-green.hud-building-upgrade {
    background-color: ${setColor.themeColor[localStorage.themeClass]}
}
.hud-building-overlay .hud-building-upgrade.is-disabled {
    background: ${setColor.themeColor[localStorage.themeClass]} !important;
}
.hud-building-overlay .hud-tooltip-health .hud-tooltip-health-bar {
    background: ${setColor.lightThemeColor[localStorage.themeClass]}
}
.hud-menu-icons .hud-menu-icon[data-type=More]::before {
    background-image: url("https://media.discordapp.net/attachments/870020008128958525/876133010360107048/unknown.png");
    background-size: 30px;
}
.hud-menu-more {
    background-color: ${setColor.menuBackground[localStorage.themeClass]};
    border: 5px solid white;
}
.hud-menu-icons .hud-menu-icon::before {
    filter: drop-shadow(1px 1px 0px #000) drop-shadow(-1px 1px 0px #000) drop-shadow(1px -1px 0px #000) drop-shadow(-1px -1px 0px #000)
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
/* sliders from ignition, very beautiful and nice */

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
  background-color: #1eacbf;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1eacbf;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(30px);
}
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
`;

let stylesMain = document.createElement("style");
stylesMain.appendChild(document.createTextNode(cssMain));
document.head.appendChild(stylesMain);
stylesMain.type = "text/css";


/* main code incoming */
//
//
//
/* main css */
let menu = document.querySelector("#hud-menu-settings");
menu.style.overflow = "auto";
menu.innerHTML = `
<p class="hud-Close-icon" style="display:inline-block;margin: 0 0 0 0px;opacity: 0.3;"><strong>&#x2715</strong></p>
<br />
<div class="hud-xera-grid">
<center>
<h2 style="margin: 20px 0 0 0"> Sell </h2>
<hr />
<br />
<button class="border-theme 1i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/wall/wall-t1-base.svg" style="width: 40px;"></button>
<button class="border-theme 2i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/door/door-t1-base.svg" style="width: 40px;"></button>
<button class="border-theme 3i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/slow-trap/slow-trap-t1-base.svg" style="width: 40px;"></button>
<br />
<button class="border-theme 4i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t1-head.svg" style="width: 55px;position: relative;transform: translate(-10%, -100%);"></button>
<button class="border-theme 5i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t1-head.svg" style="width: 60px;position: relative;transform: translate(-10%, -95%);"></button>
<button class="border-theme 6i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/melee-tower/melee-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/melee-tower/melee-tower-t1-middle.svg" style="width: 40px;position: relative;transform: translate(30%, -130%);"><img src="/asset/image/entity/melee-tower/melee-tower-t1-head.svg" style="width: 35px;position: relative;transform: translate(-5%, -207.5%);"></button>
<br />
<button class="border-theme 7i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/bomb-tower/bomb-tower-t1-base.svg" style="width: 48px;"></button>
<button class="border-theme 8i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/mage-tower/mage-tower-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/mage-tower/mage-tower-t1-head.svg" style="width: 25px;position: relative;transform: translate(-0%, -160%);"></button>
<button class="border-theme 9i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-mine/gold-mine-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/gold-mine/gold-mine-t1-head.svg" style="width: 45px;position: relative;transform: translate(-0%, -110%);"></button>
<br />
<button class="border-theme 10i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/harvester/harvester-t1-base.svg" style="width: 48px;"><img src="/asset/image/entity/harvester/harvester-t1-head.svg" style="width: 50px;position: relative;transform: translate(-5%, -125%);"></button>
<button class="border-theme 11i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/pet-ghost/pet-ghost-t1-base.svg" style="width: 39.5px;"></button>
<button class="border-theme 0i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-stash/gold-stash-t1-base.svg" style="width: 48px;"></button>
<br />
<small style="opacity: 0.1">lte's sell numpad sucks lol</small>
<br />
<img src="https://cdn.discordapp.com/attachments/854376044522242059/908538354239434772/clicker.png" style="transform: translate(-180px, -270px);width: 150px;position: relative;margin: -200px;opacity: 0.5;">
<h2> Build </h2>
<hr />
<br />
</center>
<a class="hud-xera-anchor 0i2" data-item="record" onclick="RecordBase();">
    <strong>Record Base</strong>
    <span>Record your base with this button!</span>
</a>
<a class="hud-xera-anchor 1i2" data-item="build" onclick="buildRecordedBase();">
    <strong>Build Recorded Base</strong>
    <span>Build your base instantly with this button!</span>
</a>
<a class="hud-xera-anchor 2i2" data-item="deletebase" onclick="DeleteRecordedbase();">
    <strong>Delete Recorded Base!</strong>
    <span>Delete your recorded base with this button!</span>
</a>
<a class="hud-xera-anchor 3i2" data-item="upall">
     <strong>Upgrade All</strong>
     <small id="upalltoggle" style="color: red;margin: 0 0 0 320px;opacity: 0.7;font-weight: 900;">OFF</small>
     <span>Upgrade all of your towers with this toggle!</span>
</a>
<br />
<small><i class="fa fa-info-circle"></i> Base saver system made by Apex, give him some love! <a href="https://discord.gg/KuVUwpqqcK" target="_blank" style="color: lightblue">Discord server</a></small>
<br />
<h2 style="text-align: center;"> Chat </h2>
<hr />
<br />
<a id="chattoggle" class="hud-xera-anchor 0i3" data-item="togglechat" onclick="window.toggleChat();">
    <strong>Toggle Chat</strong>
    <small id="togglechattoggle" style="color: red;margin: 0 0 0 320px;opacity: 0.7;font-weight: 900;">OFF</small>
    <span>Hide your chat with this toggle!</span>
</a>
<a class="hud-xera-anchor-no-hover 1i3" data-item="spamchat">
    <strong>Spam Chat</strong>
    <span>Spam your nonsensical chat messages with this!</span>
    <span class="hud-xera-actions">
        <button class="btn btn-theme" id="togglespmch" style="height: 30px;line-height: unset;width: 230px;">Toggle Chat Spam</button>
        <input id="spmchinput" type="tel" style="background-color: rgba(0,0,0,0);padding: 4px 5px;border-radius: 8px;color: rgba(255,255,255,0.7);border: 2px solid rgba(255, 255, 255, 0.7);width: 230px;height: 30px;margin: 0 0px 5px 40px;" placeholder="Your message here..." class="btn" >
    </span>
</a>
<br />
<small style="opacity: 0">c</small>
<br />
<small style="opacity: 0">c</small>
<br />
<h2 style="text-align: center;"> Miscellaneous </h2>
<hr />
<br />
<a class="hud-xera-anchor 0i4" data-item="ahrc">
    <strong>Activate AHRC</strong>
    <small id="ahrctoggle" style="color: red;margin: 0 0 0 300px;opacity: 0.7;font-weight: 900;">OFF</small>
    <span>Automatically refills your harvesters, only 1 gold each!</span>
</a>
<a class="hud-xera-anchor 1i4" data-item="exactrss">
    <strong>Enable Exact RSS Counter</strong>
    <small id="exactrsstoggle" style="color: red;margin: 0 0 0 215px;opacity: 0.7;font-weight: 900;">OFF</small>
    <span>Gives you exact infos about your resource units!</span>
</a>
<a class="hud-xera-anchor-no-hover 2i4" data-item="rdmcolor">
    <strong>Random Color</strong>
    <span>Make names look les... more fancy!</span>
    <span class="hud-xera-actions">
        <button class="btn btn-theme" style="height: 30px;line-height: unset;width: 230px;" onclick="window.randomColor();">Randomize Color!</button>
        <button class="btn btn-theme" style="height: 30px;line-height: unset;width: 230px;margin: 0 0px 5px 40px;" onclick="window.resetColor();">Reset Color!</button>
    </span>
</a>
<br />
<small style="opacity: 0">c</small>
<br />
<small style="opacity: 0">c</small>
<br />
<h2 style="text-align: center;"> Help </h2>
<hr />
<br />
<h3><i class="fa fa-info-circle"></i> General </h3>
<p>+ Record base(s): You can save a base with the button, "Record Base!", and build the saved base with "Build Recorded Base!" button. In case you need to delete for another one, just click "Delete Recorded Base!".</P>
<p>+ Upgrade All: Automatically upgrades everything in your base to maximum tier possible.</p>
<p>+ AHRC: Stands for "Automatic Harvester Resource Collector", automatically refills your harvester(s) and collects them back to you.</p>
<p>+ Exact RSS Counter: "De-truncate" your resource stats.</p>
<p>+ Join party by PSK function: PSK stands for Party Share Key, use this to join your previous parties!</p>
<br />
<h3><i class="fa fa-keyboard"></i> Keybinds </h3>
<p> - // Enable show other players' RSS.</p>
<p> = // Toggle Exact RSS Counter.</p>
<p> ~ // Add a marker on the minimap.</p>
<p> ? // Toggles on screenshot mode.</p>
<p> X // Toggles on mod menu.</p>
<br />
<br />
<br />
<br />
<br />
<h4>Xeraphinite, v2.1</h4>
<img id="padoru" src="https://cdn.discordapp.com/attachments/871760287760519232/914408457443094568/EohccRVVoAAMjiu.png" style="width: 256px;margin: -300px 0 0 250px;opacity: 0.3;transform: scaleX(-1);">
`;
function modm() {
    if(menu.style.display == "none" || menu.style.display == "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    };
};


/* main code */
var showRSS = false;
var AHRC = false;
var upgradeAll = false;
var petTimeout = false;
var heal = true;
var autobow = false;
var getRss = false;
var allowed1 = true;

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

game.network.addEntityUpdateHandler(() => {
    if (game.network.connected) {
        if(upgradeAll) {
            let entities = game.world.entities;
            for (let uid in entities) {
                if (!entities.hasOwnProperty(uid)) continue;
                game.network.sendRpc({name: "UpgradeBuilding", uid: entities[uid].fromTick.uid});
            }
        }
        if (AHRC) {
            let entities = Game.currentGame.world.entities;
            for (let uid in entities) {
                let obj = entities[uid];
                if (obj.fromTick.model == "Harvester") {
                    let amount = obj.fromTick.tier * 0.05 - 0.02;
                    game.network.sendRpc({name: "AddDepositToHarvester", uid: obj.fromTick.uid, deposit: amount});
                    game.network.sendRpc({name: "CollectHarvester", uid: obj.fromTick.uid});
                };
            };
        };

        if (autobow) {
            game.network.sendInput({space: 0})
            game.network.sendInput({space: 1})
        }
    }
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
                    }
                }
            }
        }
    }
    if (!getRss) {
        allowed1 = false;
    }
    if(!window.zoomonscroll) {
        window.zoom(document.getElementById("zoomSlider").value);
    };
});

Game.currentGame.ui._events.playerPetTickUpdate.push(pet => {
    if (pet.health <= 0) {
        Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1});
        Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1});
    }
    if (heal) {
        let petHealth = (pet.health / pet.maxHealth) * 100;
        if (petHealth <= 50) {
            game.network.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1});
            game.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1});
        };
    };
});

game.ui._events.playerTickUpdate.push(player => {
    if (heal) {
        let playerHealth = (player.health / player.maxHealth) * 100;
        if (playerHealth <= 50) healPlayer();
    }
    xyshow.innerHTML = `X: ${Math.round(player.position.x - 13)}, Y: ${Math.round(player.position.y) - 13}`;
});

function healPlayer() {
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
}

function sellAllByType(type) {
    if (!game.ui.playerPartyCanSell) return;

    let sellInterval = () => {
        let target = Object.values(game.ui.buildings).find(e => e.type == type);
        if (target !== undefined) {
            Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: target.uid});
            setTimeout(() => { sellInterval(); }, 100);
        }
    }
    sellInterval();
};

document.getElementsByClassName("0i")[0].addEventListener('click', function() {
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

document.getElementsByClassName("1i")[0].addEventListener('click', () => { sellAllByType("Wall") });
document.getElementsByClassName("2i")[0].addEventListener('click', () => { sellAllByType("Door") });
document.getElementsByClassName("3i")[0].addEventListener('click', () => { sellAllByType("SlowTrap") });
document.getElementsByClassName("4i")[0].addEventListener('click', () => { sellAllByType("ArrowTower") });
document.getElementsByClassName("5i")[0].addEventListener('click', () => { sellAllByType("CannonTower") });
document.getElementsByClassName("6i")[0].addEventListener('click', () => { sellAllByType("MeleeTower") });
document.getElementsByClassName("7i")[0].addEventListener('click', () => { sellAllByType("BombTower") });
document.getElementsByClassName("8i")[0].addEventListener('click', () => { sellAllByType("MagicTower") });
document.getElementsByClassName("9i")[0].addEventListener('click', () => { sellAllByType("GoldMine") });
document.getElementsByClassName("10i")[0].addEventListener('click', () => { sellAllByType("Harvester") });
document.getElementsByClassName("11i")[0].addEventListener('click', () => { Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()}); });

document.getElementsByClassName("3i2")[0].addEventListener('click', function() {
    upgradeAll = !upgradeAll;
    let upalltoggle = document.getElementById('upalltoggle');
    if (upgradeAll) {
        upalltoggle.style.color = "green";
        upalltoggle.innerText = "ON";
    } else {
        upalltoggle.style.color = "red";
        upalltoggle.innerText = "OFF";
    }
})
document.getElementsByClassName("0i4")[0].addEventListener('click', function() {
    AHRC = !AHRC;
    let ahrctoggle = document.getElementById('ahrctoggle');
    if (AHRC) {
        ahrctoggle.style.color = "green";
        ahrctoggle.innerText = "ON";
    } else {
        ahrctoggle.style.color = "red";
        ahrctoggle.innerText = "OFF";
    }
})
document.getElementsByClassName("1i4")[0].addEventListener('click', function() {
    window.frss = !window.frss;
    let rsstoggle = document.getElementById('exactrsstoggle');
    if (window.frss) {
        rsstoggle.style.color = "green";
        rsstoggle.innerText = "ON";
    } else {
        rsstoggle.style.color = "red";
        rsstoggle.innerText = "OFF";
    }
})

document.getElementsByClassName("hud-Close-icon")[0].addEventListener("click", function () {
    menu.style.display = "none";
});

var towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];

function getGoldStash() {
    return Object.values(Game.currentGame.ui.buildings).find(building => building.type == "GoldStash");
}

window.RecordBase = function() {
    let baseStr = "";
    for (let i in game.ui.buildings) {
        const building = game.ui.buildings[i];
        if (towerCodes.indexOf(building.type) < 0) continue;

        let yaw = 0;

        if (["Harvester", "MeleeTower"].includes(building.type)) {
            if (game.world.entities[building.uid] !== undefined) yaw = game.world.entities[building.uid].targetTick.yaw;
        }
        baseStr += `${towerCodes.indexOf(building.type)},${getGoldStash().x - building.x},${getGoldStash().y - building.y},${yaw};`;
    }
    localStorage.savedBase = baseStr;
    console.log(baseStr);
}
window.buildRecordedBase = function() {
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
        }
    }
    BuildBase(localStorage.savedBase);
}
window.DeleteRecordedbase = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete the recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Recorded base has been successfully deleted!");
        localStorage.savedBase = null;
    })
}

game.network.sendRpc2 = game.network.sendRpc;
const placeWall = (x, y) => {
    game.network.sendRpc2({
        name: 'MakeBuilding',
        x: x,
        y: y,
        type: "Wall",
        yaw: 0
    });
};
game.network.sendRpc = (data) => {
    let gridPos = { x: data.x, y: data.y };
    if(data.name === "MakeBuilding" && data.type === "Wall" && window.x3builds) {
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
    };
    game.network.sendRpc2(data);
};

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
        console.log(dimension);
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
window.toggleZoS = () => {
    dimension -= 0.02;
    window.zoomonscroll = !window.zoomonscroll;
    let zs = document.getElementById("zsd");
    zs.style.display = zs.style.display == "none" ? "block" : "none";
};
window.zoomOut = () => {
    let zs = document.getElementById("zoomSlider");
    zs.value = parseInt(zs.value) + 1;
};
window.zoomIn = () => {
    let zs = document.getElementById("zoomSlider");
    zs.value = parseInt(zs.value) - 1;
}; // cutdown version of ignition's zoom


// Zombs.io Emoji System + Chat Blocker
// Morpheus_ , ehScripts

const blockedUids = [];

window.blockPlayer = (name, uid) => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${window.filterXSS(name)} (${uid})?`, 3500, () => {
        blockedUids.push(uid);
        for (let bl of Array.from(document.getElementsByClassName(`uid${uid}`))) {
            bl.innerHTML = "Unblock";
            bl.style.color = "blue";
            bl.onclick = () => window.unblockPlayer(name, uid);
        };
    }, () => {});
};

window.unblockPlayer = (name, uid) => {
    this.blockedUids.splice(blockedUids.indexOf(uid), 1);
    for (let bl of Array.from(document.getElementsByClassName(`uid${uid}`))) {
        bl.innerHTML = "Block";
        bl.style.color = "red";
        bl.onclick = () => window.blockPlayer(name, uid);
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
    whale: "https://media.discordapp.net/attachments/876015747204268033/950597451897770064/1f433.png?width=48&height=48",

    weirdButOkay: "https://cdn.discordapp.com/emojis/831156194247966782.gif?size=48",
    pogpogpogpog: "https://cdn.discordapp.com/emojis/869580566096379974.gif?size=48",
    wooyeah: "https://cdn.discordapp.com/emojis/791008461420888084.gif?size=48",
    idk: "https://cdn.discordapp.com/emojis/882513306164805642.gif?size=48",
    WYSI: "https://cdn.discordapp.com/emojis/816356638767972402.gif?size=48",
}


Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
const onMessageReceived = function(e) {
    if (blockedUids.includes(e.uid) || window.chatDisabled) return;
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = window.filterXSS(e.displayName),
        c = window.filterXSS(e.message)
    .replace(/(?:f|F)uck/gi, `<img src="https://cdn.discordapp.com/emojis/907625398832070667.png?size=80" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
    .replace(/s[3e]x+/gi, `<img src="https://cdn.discordapp.com/emojis/953759638350872666.gif?size=80&quality=lossless" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
    .replace(/n+[i1]+gg+[a@]+/i, `<img src="https://cdn.discordapp.com/emojis/902742239996936226.webp?size=80" height="16" width="17" style="margin: 1px 0 0 0;"></img>`);
    let arr = c.split(':');

    for (let i = 1; i < arr.length; i += 2) {
        if (!emojiList[arr[i]]) arr = [c];
        else arr[i] = `<img src="${emojiList[arr[i]]}" height="16" width="18" style="margin: 1px 0 0 0;"></img>`;
    }

    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" style="color: red;margin: 0 5px 0 0;display: inline-block;" class="uid${e.uid}">Block</a><strong> ${b}</strong>: ${arr.join(" ")}<small>${getClock()}</small></div>`);
    d.children[0].onclick = () => window.blockPlayer(b, e.uid);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
};
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

let chattoggle = document.getElementById("togglechattoggle");
window.toggleChat = () => {
    window.chatDisabled = !window.chatDisabled;
    let chat = document.getElementsByClassName("hud-chat")[0];
    if (window.chatDisabled) {
        chat.style.display = "none";
        chattoggle.style.color = "green";
        chattoggle.innerText = "ON";
    } else {
        chat.style.display = "block";
        chattoggle.style.color = "red";
        chattoggle.innerText = "OFF";
    };
}; // toggle chat, from ignition

(function() { // modified private parties tab code, except the new tab in the party menu is used differently (not private parties)
    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }
    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";
    let privateTab2 = document.createElement("a");
    privateTab2.className = "hud-party-tabs-link";
    privateTab2.id = "privateTab2";
    privateTab2.innerHTML = "Share Keys";
    let privateHud2 = document.createElement("div");
    privateHud2.className = "hud-private hud-party-grid";
    privateHud2.id = "privateHud2";
    privateHud2.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab2);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud2, getElement("hud-party-actions")[0]);
    getId("privateTab2").onclick = e => {
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("privateTab2").className = "hud-party-tabs-link is-active";
        getId("privateHud2").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud2").getAttribute("style") == "display: none;") {
            getId("privateHud2").setAttribute("style", "display: block;");
        }
    }

    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud2").setAttribute("style", "display: none;");
        if (getId("privateTab2").className == "hud-party-tabs-link is-active") {
            getId("privateTab2").className = "hud-party-tabs-link"
        }
    }

    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud2").setAttribute("style", "display: none;");
        if (getId("privateTab2").className == "hud-party-tabs-link is-active") {
            getId("privateTab2").className = "hud-party-tabs-link"
        }
    }
    getId("privateHud2").innerHTML = `
  <h1>Share Keys</h1>
  `;
    game.network.addRpcHandler("PartyShareKey", function(e) {
        let psk = e.partyShareKey;
        let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
        getId("privateHud2").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p style="user-select: text;">${psk} <a href="${lnk}" target="_blank" color="purple">[Link]</a></p></div>`
    });
    document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
  <button class="btn btn-theme" style="width: 120px;margin: 10px 0 0 0;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Join Party</button>
  <input id="psk" style="margin: 10px 15px 0 15px;width: 280px;" placeholder="Party share key... (not link!)" value="" class="btn" />
  <button class="btn btn-red" style="width: 120px;margin: 10px 0 0 0;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
`);
})(); // modified party tools from ignition

let showpriv = true;
document.getElementsByClassName('hud-party-tabs')[0].insertAdjacentHTML("beforeend", `
    <label class="switch thelabel" class="display:inline-block;" style="width: fit-content;">
        <input type="checkbox" onchange="window.showpriv = !window.showpriv">
        <span class="slider round" style="margin: 0 -70px 0 185px;"></span>
        <small style="margin: 0 0 0 100px">Only Public</small>
    </label>
`);
function checkStatus(party) {
    if (showpriv == true) {
        if(party.isOpen == 1) {
            return '<a style = "color: #00e700;opacity: 0.4;">[Open]<a/>';
        } else if(!party.isOpen == 1) {
            return '<a style = "color:red;opacity: 0.4;">[Private]<a/>';
        }
    } else {
        return '';
    }
};
//
let partyCheck = (all_parties) => {
    document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

    for (let i in all_parties) {
        let parties = all_parties[i];
        let tab = document.createElement('div');
        tab.classList.add('hud-party-link');
        tab.classList.add('custom-party');
        tab.id = parties.partyId;
        tab.isPublic = parties.isOpen;
        tab.name = parties.partyName;
        tab.members = parties.memberCount;
        tab.innerHTML = `
                <strong>${parties.partyName} ${checkStatus(parties)}<strong/>
                <small>id: ${parties.partyId}</small> <span>${parties.memberCount}/4<span/>
            `;

        if(parties.memberCount == 4) {
            tab.classList.add('is-disabled');
        } else {
            tab.style.display = 'block';
        }
        setTimeout(() => {
            if (parties.partyId == game.ui.playerPartyId) tab.classList.add('is-active');
        }, 1000);
        if (parties.isOpen !== 1 && showpriv == false) {
            tab.style.display = 'none';
        }
        tab.addEventListener('click', function() {
            let isJoining = true;
            if(tab.isPublic == 1 && tab.members < 4) {
                isJoining = true;
                game.network.sendRpc({
                    name: 'JoinParty',
                    partyId: Math.floor(tab.id)
                });
                if(isJoining == true) {
                    document.getElementsByClassName('hud-party-grid')[0].classList.add('is-disabled');
                    document.getElementsByClassName('hud-party-link')[0].classList.add('is-disabled');
                    setTimeout(() => {
                        document.getElementsByClassName('hud-party-grid')[0].classList.remove('is-disabled');
                        document.getElementsByClassName('hud-party-link')[0].classList.remove('is-disabled');
                    }, 27500);
                }
            } else if(!tab.isPublic == 1) {
                isJoining = false;
                game.ui.components.PopupOverlay.showHint("You can't request private parties!");
            }
        });
        document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
    };
};
game.network.addRpcHandler("SetPartyList", (e) => { partyCheck(e) });
//

const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(request.responseText);
        entirePop.innerHTML = `People in game now: ${data.players} - ${(data.players / data.capacity * 100).toFixed(2)}% / ${data.capacity}`;
        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${data.regions[servers[i]].players}`);
        }
    }
};
request.open("GET", "http://zombs.io/capacity", true);
request.send(); // server pop by apex

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
}, 50);
setTimeout(() => { clearInterval(sipt); }, 50); // full RSS from ignition, modified to refresh slower

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

window.randomColor = function() {
    for (let i in game.world.entities) {
        if (game.world.entities[i].entityClass === "PlayerEntity") {
            var hexValue = "1234567890abcdef";
            var hexLength = 6;
            var hex = "";
            for (let i = 0; i < hexLength; i++) hex += hexValue[Math.floor(Math.random() * hexValue.length)];
            let hr = hexToRgb(hex);
            game.world.entities[i].currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
        };
    };
};

window.resetColor = function() {
    for (let i in game.world.entities) {
        if (game.world.entities[i].entityClass === "PlayerEntity") {
            game.world.entities[i].currentModel.nameEntity.setColor(220, 220, 220);
        };
    };
};

var isSpamming = 0;
function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e !== "") {
            window.spammer = setInterval(() => {
                game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: e});
            }, 1500);
        } else {
            game.ui.components.PopupOverlay.showHint(`Please enter your message!`);
        };
    } else if (isSpamming) {
        clearInterval(window.spammer);
    };
    isSpamming = !isSpamming;
};
document.querySelector('#togglespmch').addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spmchinput').value)
    let spamtoggle = document.querySelector('#spamtoggle')
    this.innerText = isSpamming ? "Disable Spam Chat" : "Enable Spam Chat"
    if (isSpamming) {
        this.classList.add("btn-red"); this.classList.remove("btn-theme");
    } else {
        this.classList.add("btn-theme"); this.classList.remove("btn-red");
    };
});

!game.world.removeEntity2 && (game.world.removeEntity2 = game.world.removeEntity);
game.world.removeEntity = (uid) => {
    if (game.world.entities[uid].fromTick.model == "Tree" || game.world.entities[uid].fromTick.model == "Stone" || game.world.entities[uid].fromTick.model == "NeutralCamp") return;
    game.world.removeEntity2(uid);
}

var map = document.getElementById("hud-map");
let markerId = 1;
window.addMarker = () => {
    map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
    markerId++;
};

let smm = document.getElementsByClassName("hud-menu-more")[0];
smm.style.overflow = "auto";
window.moreMenu = () => {
    let mm = document.getElementsByClassName("hud-menu-more")[0];
    if(["none", ""].includes(mm.style.display)) {
        mm.style.display = "block";
        for(let i of Array.from(document.getElementsByClassName("hud-menu"))) {
            if(i.classList.contains('hud-menu-more')) { return; };
            i.style.display = "none";
        };
    } else {
        mm.style.display = "none";
    };
};

var hasBeenInWorld = false;
game.network.addEnterWorldHandler(() => {
    if(hasBeenInWorld) { return };
    hasBeenInWorld = true;
    for(let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
        if(i.dataset.type !== "More") {
            i.addEventListener('click', function() {
                document.getElementsByClassName("hud-menu-more")[0].style.display = "none";
            });
        };
    };
});

document.getElementsByClassName("1z")[0].addEventListener('click', function() {
    window.ground();
    this.className = "btn btn-theme 1z";
    this.innerText = "Stop Rendering Ground?";
    if (window.groundtoggle) {
        this.className = "btn btn-red 1z";
        this.innerText = "Start Rendering Ground?";
    }
})
document.getElementsByClassName("1z1")[0].addEventListener('click', function() {
    window.grid();
    this.className = "btn btn-green 1z1";
    this.innerText = "Black Ground With Grid?";
    if (window.gridtoggle) {
        this.className = "btn btn-red 1z1";
    }
})
document.getElementsByClassName("2z")[0].addEventListener('click', function() {
    window.npc();
    this.className = "btn btn-theme 2z";
    this.innerText = "Stop Rendering NPCs?";
    if (window.npctoggle) {
        this.className = "btn btn-red 2z";
        this.innerText = "Start Rendering NPCs?";
    }
})
document.getElementsByClassName("3z")[0].addEventListener('click', function() {
    window.env();
    this.className = "btn btn-theme 3z";
    this.innerText = "Stop Rendering Environment?";
    if (window.envtoggle) {
        this.className = "btn btn-red 3z";
        this.innerText = "Start Rendering Enviroment?";
    }
})
document.getElementsByClassName("4z")[0].addEventListener('click', function() {
    window.pjt();
    this.className = "btn btn-theme 4z";
    this.innerText = "Stop Rendering Projectiles?";
    if (window.pjttoggle) {
        this.className = "btn btn-red 4z";
        this.innerText = "Start Rendering Projectiles?";
    }
})
document.getElementsByClassName("5z")[0].addEventListener('click', function() {
    window.everything();
    this.className = "btn btn-theme 5z";
    this.innerText = `Stop Rendering Everything?`;
    if (window.everythingtoggle) {
        this.className = "btn btn-red 5z";
        this.innerText = `Start Rendering Everything?`;
    }
})
document.getElementsByClassName("6z")[0].addEventListener('click', function() {
    window.rndr();
    this.className = "btn btn-theme 6z";
    this.innerText = `Stop Renderer?`;
    if (window.rndrtoggle) {
        this.className = "btn btn-red 6z";
        this.innerText = `Start Renderer?`;
    }
})

window.ground = () => {
    window.groundtoggle = !window.groundtoggle;
    let z1 = document.getElementById('addon')
    let z1button = document.getElementsByClassName("1z1")[0]
    if (window.groundtoggle) {
        game.renderer.ground.setVisible(false)
        z1.style.display = "block";
    } else {
        game.renderer.ground.setVisible(true)
        game.renderer.ground.setAlpha(1)
        z1.style.display = "none";
    }
    if (z1button.classList.contains('btn-red') && z1.style.display === "block") {
        game.renderer.ground.setVisible(true)
        game.renderer.ground.setAlpha(0.25)
    }
}
window.grid = () => {
    window.gridtoggle = !window.gridtoggle;
    if (window.gridtoggle) {
        game.renderer.ground.setVisible(true)
        game.renderer.ground.setAlpha(0.25)
    } else {
        game.renderer.ground.setVisible(false)
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
document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (!e.button) {
        game.network.sendPacket(3, {
            mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY)
        })
    }
    smm.style.display = "none";
})

window.addName = name => {
    let id = `username${Math.floor(Math.random() * 9999)}`;
    localStorage.usernames = `${localStorage.usernames || ""}<div id="${id}"><button onclick="document.querySelector('.hud-intro-name').value = \`${name.replaceAll('`', '\`')}\`" class="btn btn-theme">${name}</button>`;
};
(window.refreshNS = () => {
    let guide2 = document.getElementsByClassName("hud-intro-name-save")[0];
    guide2.innerHTML = `
<div>
${localStorage.usernames || "<h2>No saved names... sad.<h2>"}
<br />
</div>
<hr />
<input type="text" class="search-bar" style="width:135px;" id="inpn" /><button class="btn-fixed btn-theme" onclick="window.addName(document.getElementById('inpn').value); window.refreshNS();">Add name</button>
`;
})();

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
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", xyshow);
    // original screenshot mode code by deathrain, modified by eh
};

/* keybinds */
document.addEventListener('keyup', function (e) {
    if (e.key === "Enter" && game.ui.playerTick.dead === 1) {
        game.ui.components.Chat.startTyping();
    };
    if (e.key === "`") {
        window.addMarker();
        game.ui.components.PopupOverlay.showHint(`Added Marker #${markerId-1}`);
    };
});

document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) { // key -
            getRss = !getRss;
        };
        if (e.key === "!") {
            window.x3builds = !window.x3builds;
            game.ui.components.PopupOverlay.showHint("Toggled 3x3 Block.");
        };
        if (e.key === "=") {
            document.getElementsByClassName("1i4")[0].click();
            game.ui.components.PopupOverlay.showHint("Toggled Full RSS.");
        };
        if (e.key === "g") {
            document.getElementsByClassName("0i3")[0].click();
            game.ui.components.PopupOverlay.showHint("Toggled Chat.");
        };
        if (e.key === " " && game.ui.playerTick.weaponName === 'Bow') {
            autobow = true;
        };
        if (game.ui.playerTick.weaponName !== 'Bow') {
            autobow = false;
        };
        if (e.key === "x") {
            modm();
        };
        if (e.key === "?") {
            window.ssMode();
        };
    };
});