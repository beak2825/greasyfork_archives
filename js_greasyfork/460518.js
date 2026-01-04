// ==UserScript==
// @name         Türk Mod - 6.9
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  Türkler için yazılmış, tamamen türkçe kodlardan oluşuyor.
// @icon         https://cdn.discordapp.com/emojis/1063882527527424062.webp?size=80&quality=high
// @author       Kurt, Serplent
// @match        https://zombs.io/
// @require      https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/460518/T%C3%BCrk%20Mod%20-%2069.user.js
// @updateURL https://update.greasyfork.org/scripts/460518/T%C3%BCrk%20Mod%20-%2069.meta.js
// ==/UserScript==

// Mod ismi
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = "Zᴏᴍʙs Türk Mod<small>.</small>"
document.querySelector("#hud-intro > div.hud-intro-wrapper > h1").style.color = "#a4a4a4"

// Discord
getElem('hud-intro-more-games')[0].innerHTML = `
<a href = "https://discord.gg/5hKqrKdSR7"><i class="fab fa-discord"> </i> TC Team Discord Sunucusu</a>
`

// Ayarlar Menü
let Settings = ''
Settings += `
       <button class="border-white 1i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/wall/wall-t8-base.svg" style="width: 40px;"></button>
       <button class="border-white 2i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/door/door-t8-base.svg" style="width: 40px;"></button>
       <button class="border-white 3i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/slow-trap/slow-trap-t8-base.svg" style="width: 40px;"></button>
       <br />
       <button class="border-white 4i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t8-head.svg" style="width: 55px;position: relative;transform: translate(-10%, -100%);"></button>
       <button class="border-white 5i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t8-head.svg" style="width: 60px;position: relative;transform: translate(-10%, -95%);"></button>
       <button class="border-white 6i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/melee-tower/melee-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/melee-tower/melee-tower-t8-middle.svg" style="width: 40px;position: relative;transform: translate(30%, -130%);"><img src="/asset/image/entity/melee-tower/melee-tower-t8-head.svg" style="width: 35px;position: relative;transform: translate(-5%, -207.5%);"></button>
       <br />
       <button class="border-white 7i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/bomb-tower/bomb-tower-t8-base.svg" style="width: 48px;"></button>
       <button class="border-white 8i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/mage-tower/mage-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/mage-tower/mage-tower-t8-head.svg" style="width: 25px;position: relative;transform: translate(-0%, -160%);"></button>
       <button class="border-white 9i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-mine/gold-mine-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/gold-mine/gold-mine-t8-head.svg" style="width: 45px;position: relative;transform: translate(-0%, -110%);"></button>
       <br />
       <button class="border-white 10i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/harvester/harvester-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/harvester/harvester-t8-head.svg" style="width: 50px;position: relative;transform: translate(-5%, -125%);"></button>
       <button class="border-white 11i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/pet-ghost/pet-ghost-t1-base.svg" style="width: 39.5px;"></button>
       <button class="border-white 12i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-stash/gold-stash-t8-base.svg" style="width: 48px;"></button>
       <br />
`;

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings

// Yapımcı Etiketi
var IntroCornertopleft = '';
IntroCornertopleft += "<legend>Serplent - © 2023 ZOMBS.io - Kurt</legend>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroCornertopleft;

// Oyuncu ve pet görünümü
let imageArray1 = [`<img src="https://media.discordapp.net/attachments/1076065634099662918/1076608413687103518/Adsz_400_400_piksel_1.png?width=320&height=320" style="margin: 0 0 -180px -300px;width: 256px;">`,]

let imageArray2 = [`<img src="https://media.discordapp.net/attachments/1076065634099662918/1076608660626735184/Adsz_400_400_piksel_3.png?width=320&height=320" style="margin: 0 0 -180px -300px;width: 256px;">`,]

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
};

// Reklamlardan & boş yazılardan arınma
document.querySelectorAll('.ad-unit, .hud-intro-wrapper > h2, .hud-intro-stone, .hud-intro-corner-bottom-left, .hud-intro-canvas, .hud-intro-tree, .hud-intro-error, .hud-intro-form > label > span, .hud-intro-footer > a, .hud-intro-social, .hud-intro-guide, .hud-intro-left, .hud-intro-youtuber, .hud-respawn-corner-bottom-left, .hud-respawn-twitter-btn, .hud-respawn-facebook-btn').forEach(el => el.remove());
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

// Menü renk ayarı "let renk = 'rgb(91 300 157 / 95%)';"
let renk = 'rgb(0 / 95%)'; // Siyah olması için 0'a çekildi.

// Sunucu ID
var srvr = -1;
for (let i in game.options.servers) {
    srvr += 1;
    document.getElementsByClassName("hud-intro-server")[0][srvr].innerHTML += ", Sunucu ID: " + game.options.servers[i].id;
}
if (localStorage.timesEhacked == undefined) {
    localStorage.timesEhacked = 1;
} else {
    localStorage.timesEhacked++;
}
document.title = "Türk Mod Yapılan Girişler: " + localStorage.timesEhacked

// Giriş ekranı arka plan, giriş butonu tasarımı, ekran tasarımları vs.
let css2 = `
.hud-intro::before {
    background-image: url('https://www.wallpapertip.com/wmimgs/48-483858_team-secret-wallpaper-hd.jpg');
    background-size: cover;
}
.hud-intro .hud-intro-form .hud-intro-play {
    width: 150px;
    height: 150px;
    transform: rotate(45deg);
    border: 3px solid white;
    margin: -150px 0 0 500px;
    background-image: url(https://www.wallpapertip.com/wmimgs/48-483858_team-secret-wallpaper-hd.jpg);
    background-size: 145%;
    padding: 0 0 0 0;
    background-position-y: center;
    background-position-x: center;
    transition: all 0.15s ease-in-out;
}
.hud-intro .hud-intro-form .hud-intro-play:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://www.wallpapertip.com/wmimgs/48-483858_team-secret-wallpaper-hd.jpg);
}
.hud-intro .hud-intro-form .hud-intro-name {
    line-height: none;
    margin: 0 0 -80px 170px;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://i.pinimg.com/564x/c6/c8/61/c6c861cfa46d064c3f9249c07a41892b.jpg);
    background-position-x: 130px;
}
.hud-intro .hud-intro-form .hud-intro-server {
    display: block;
    line-height: unset;
    margin: 130px 0 0 170px;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://i.pinimg.com/564x/c6/c8/61/c6c861cfa46d064c3f9249c07a41892b.jpg);
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
  background-color: green;
}

input:focus + .slider {
  box-shadow: 0 0 1px green;
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
.btn-blue:hover {
cursor: pointer;
}
.btn-red:hover {
cursor: pointer;
}
.btn-green:hover {
cursor: pointer;
}
.btn-purple:hover {
cursor: pointer;
}
.btn-blue {
background-color: #002f6d;
}
.btn-blue:hover .btn-blue:active {
background-color: #002f6d;
}
.btn-red {
background-color: #2e0000;
}
.btn-red:hover .btn-red:active {
background-color: #2e0000;
}
.btn-green {
background-color: #003f05;
}
.btn-green:hover .btn-green:active {
background-color: #003f05;
}
.btn-purple {
background-color: #320031;
}
.btn-purple:hover .btn-purple:active {
background-color: #320031;
}
.btn-gold {
background-color: #435000;
}
.btn-gold:hover .btn-gold:active {
background-color: #435000;
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
    width: 610px;
    height: 480px;
    background-color: ${renk};
}
#hud-menu-shop {
    top: 54.5%;
    left: 50.5%;
    width: 690px;
    height: 500px;
    background-color: ${renk};
    margin: -350px 0 0 -350px;
    padding: 20px 20px 20px 20px;
    z-index: 20;
}
#hud-menu-settings {
    background-color: ${renk};
}
#hud-building-overlay {
    background-color: ${renk};
}
.hud-building-overlay .hud-tooltip-health .hud-tooltip-health-bar {
    background: #29000c;
}
.hud-building-overlay .hud-building-upgrade.is-disabled {
    background: green !important;
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
    top: 54.5%;
    left: 50.5%;
    width: 700px;
    height: 500px;
    margin: -350px 0 0 -350px;
    padding: 20px;
    background-color: rgb(0 0 0 / 55%);
    color: #eee;
    border-radius: 4px;
    z-index: 20;
}
.hud-menu-zipp3 h3 {
    display: block;
    margin: 0;
    line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
    display: block;
    height: 390px;
    padding: 10px;
    margin-top: 18px;
    background: rgba(0, 0, 0, 0.2);
    overflow-x: auto;
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
    background-image: url("https://media.discordapp.net/attachments/1073023239430877185/1075451859013206066/Adsz_tasarm_4.png?width=400&height=400");
}
* {
   font-family: Hammersmith One;
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
.border-red {
    border: 3px solid orangered;
    border-radius: 4px;
    background: none;
    transition: all 0.15s ease-in-out;
}
.border-red:hover {
    cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";

function getElem(DOMClass) {
    return document.getElementsByClassName(DOMClass);
}


function getId(Element) {
    return document.getElementById(Element);
}

function getId2(DOMId) {
    return document.getElementById(DOMId);
}

function getElement(Element) {
        return document.getElementsByClassName(Element);
    }

getElem("hud-intro-play")[0].innerText = "";

getElem("hud-intro-play")[0].addEventListener("click", () => {
    getId2('playspan').style.display = "none";
})

getElem("hud-intro-form")[0].insertAdjacentHTML("beforeend", `
<span id="playspan" style="position: absolute;margin: -130px 0 0 405px;font-weight: 900;font-size: xx-large;text-shadow: 0px 0px 10px black;cursor: pointer;font-family: 'Open Sans';pointer-events: none;">Oyna</span>
`);

getElem('hud-intro-main')[0].insertAdjacentHTML("beforeend", `
<img src="" style="cursor: pointer;width: 120px;margin: -40px 0 0 -160px;" onclick="window.ssfi();" />
`); // Resim ekleme kodu: <img src="Resim" style="display: block;position: absolute;margin: 200px 0 0 220px;" />
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
bossAlert.innerHTML = `<i class="fa fa-exclamation-triangle"></i> Boss dalgası geliyor`;
bossAlert.style.display = "none";
bossAlert.style.color = "red";
bossAlert.style.opacity = '0.5';
getElem('hud-top-center')[0].appendChild(bossAlert);
Game.currentGame.network.addRpcHandler("DayCycle", function(e) {
    if (game.ui.playerTick && e.isDay) getactiveCommingbosswaves2() ? bossAlert.style.display = "block" : bossAlert.style.display = "none";
});
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
let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<div class="hud-zipz-tabs">
<a class="BD hud-zipz123-link-tab" style="width: 14%;border-radius: 3px 0 0 0;">Menü</a>
<a class="PL hud-zipz123-link-tab" style="width: 14%">Oyuncu</a>
<a class="OT hud-zipz123-link-tab" style="width: 14%">Mimari</a>
<a class="AL hud-zipz123-link-tab" style="width: 14%">Defans</a>
<a class="SE hud-zipz123-link-tab" style="width: 14%">Deneysel</a>
<a class="WE hud-zipz123-link-tab" style="width: 14%">Klon</a>
<a class="FE hud-zipz123-link-tab" style="width: 14%;border-radius: 0 3px 0 0;">FPS</a>
</div>
<div class="hud-zipp-grid3">
</div>
</div>
`;

document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = getElem("hud-menu-zipp3")[0];
let zipz1234 = getElem("hud-zipp-grid3")[0];
zipz1234.style.overflow = "auto";

getElem("hud-zipp3-icon")[0].addEventListener("click", function() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        getId2("hud-menu-shop").style.display = "none";
        getId2("hud-menu-party").style.display = "none";
        getId2("hud-menu-settings").style.display = "none";
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
    _spell[1],
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
        for (let i = 0; i < 50; i++) {
            if (getElem(i + identifier)[0]) {
                getElem(i + identifier)[0].style.display = "";
            }
        }
    })
}

quickcast("BD", "i");
quickcast("PL", "i2");
quickcast("OT", "i3");
quickcast("AL", "i4");
quickcast("WE", "i5");
quickcast("SE", "i6");
quickcast("FE", "i7");

function displayAllToNone() {
    getElem("BD")[0].classList.remove("zipz123-is-active");
    getElem("PL")[0].classList.remove("zipz123-is-active");
    getElem("OT")[0].classList.remove("zipz123-is-active");
    getElem("AL")[0].classList.remove("zipz123-is-active");
    getElem("WE")[0].classList.remove("zipz123-is-active");
    getElem("SE")[0].classList.remove("zipz123-is-active");
    getElem("FE")[0].classList.remove("zipz123-is-active");
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i")[0]) {
            getElem(i + "i")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i2")[0]) {
            getElem(i + "i2")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i3")[0]) {
            getElem(i + "i3")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i4")[0]) {
            getElem(i + "i4")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i5")[0]) {
            getElem(i + "i5")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i6")[0]) {
            getElem(i + "i6")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (getElem(i + "i7")[0]) {
            getElem(i + "i7")[0].style.display = "none";
        }
    }
};

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 220:
            /* ANAHTAR \ */
            document.getElementsByClassName("hud-zipp3-icon")[0].click();
    }
});

// Kod ana menüsü
getElem("hud-zipp-grid3")[0].innerHTML = `
<div class="0i">
    <hr>
       <h3>Menü<h3>
    <hr>
    <div style="text-align:left">
<button class="border-white 1i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/wall/wall-t8-base.svg" style="width: 40px;"></button>
       <button class="border-white 2i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/door/door-t8-base.svg" style="width: 40px;"></button>
       <button class="border-white 3i" style="margin: 1px;padding: 7px;width: 60px;height: 60px;"><img src="/asset/image/entity/slow-trap/slow-trap-t8-base.svg" style="width: 40px;"></button>
       <br />
       <button class="border-white 4i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/arrow-tower/arrow-tower-t8-head.svg" style="width: 55px;position: relative;transform: translate(-10%, -100%);"></button>
       <button class="border-white 5i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/cannon-tower/cannon-tower-t8-head.svg" style="width: 60px;position: relative;transform: translate(-10%, -95%);"></button>
       <button class="border-white 6i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/melee-tower/melee-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/melee-tower/melee-tower-t8-middle.svg" style="width: 40px;position: relative;transform: translate(30%, -130%);"><img src="/asset/image/entity/melee-tower/melee-tower-t8-head.svg" style="width: 35px;position: relative;transform: translate(-5%, -207.5%);"></button>
       <br />
       <button class="border-white 7i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/bomb-tower/bomb-tower-t8-base.svg" style="width: 48px;"></button>
       <button class="border-white 8i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/mage-tower/mage-tower-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/mage-tower/mage-tower-t8-head.svg" style="width: 25px;position: relative;transform: translate(-0%, -160%);"></button>
       <button class="border-white 9i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-mine/gold-mine-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/gold-mine/gold-mine-t8-head.svg" style="width: 45px;position: relative;transform: translate(-0%, -110%);"></button>
       <br />
       <button class="border-white 10i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/harvester/harvester-t8-base.svg" style="width: 48px;"><img src="/asset/image/entity/harvester/harvester-t8-head.svg" style="width: 50px;position: relative;transform: translate(-5%, -125%);"></button>
       <button class="border-white 11i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/pet-ghost/pet-ghost-t1-base.svg" style="width: 39.5px;"></button>
       <button class="border-white 12i" style="margin: 1px;padding: 3px;width: 60px;height: 60px;"><img src="/asset/image/entity/gold-stash/gold-stash-t8-base.svg" style="width: 48px;"></button>
       <br />
    </div>
    <div style="text-align:right;margin: -250px 0 0 0;padding: 0 0 0 120px;">
        <button class="btn btn-blue 5x5wall" style="width: 31%;">5x5 Duvarlar -</button>
        <button class="btn btn-blue AHRC" style="width: 31%;">Otomatik Kazıcı -</button>
        <br>
        <button class="btn btn-purple upall" style="width: 63%;">Herşeyi Yükselt</button>
        <br>
        <button id="AIM" style="width: 31%" class="btn btn-green">Otomatik Aim -</button>
        <select style="width: 31%" id="aimOptions" class="btn"><option value="pl" selected>Oyuncular</option><option value="zo">Zombiler</option></select>
        <br>
        <button id="BASE" class="btn btn-blue 55i" style="width: 31%">Şarkı Spam!</button>
        <select id="songOptions" style="width: 31%" class="btn"><option value="rr">Rick Roll</option><option value="mp" selected>Paraları Katla</option><option value="rp">İstanbul Flow</option></select>
        <br>
        <button class ="btn btn-green 17i8" style="width: 31%" id="togglespmch">Sohbet Spam -</button>
        <input class="btn" height:30px style="width: 31%" type="text" id="spammsg" placeholder="Mesaj. . .">
        <br>
        <button class ="btn btn-green 17i8" style="width: 63%" id="laggspam">Lagg Spam -</button>
    </div>
</div>
<div class="0i2">
${getRandomItem(imageArray1)}
<div style="display: flex;flex-direction: column;align-content: stretch;align-items: flex-end;margin: -40px 0 100px 0;">
    <button class="btn btn-green" style="width: 49%" id="HEALPLAYER">Otomatik Can -</button>
    <button class="btn btn-green" style="width: 49%" id="HEALPET">Otomatik Pet Can'ı -</button>
    <button class="btn btn-green" style="width: 49%" id="PETREVIVE">Otomatik Pet Canlandırma -</button>
    <button class="btn btn-blue automove" style="width: 49%;">Otomatik Takip -</button>
</div>
    <hr>
       <h3>Saldırı<h3>
    <hr>
    <button class="btn btn-red" style="width: 49%" id="AUTOBOMB">Otomatik Bomba -</button>
    <button class="btn btn-red" style="width: 49%" id="AUTOSPEAR">Otomatik Kılıç -</button>
    <button class="btn btn-red" style="width: 49%" id="SPACE">Otomatik Saldırı -</button>
    <button class="btn btn-red" style="width: 49%" id="AUTOBOW">Otomatik Ok Vuruşu -</button>
    <button class="btn btn-green" style="width: 99%" id="RESPAWN">Otomatik Yeniden Doğma -</button>
    <button id="changecolors" class="btn btn-blue" style="width: 49%">Rengi Ayarla</button>
    <input type="color" style="width: 49%; height: 40px;" id="ync">
</div>
<div class="0i3">
    <hr>
       <h3>Mimari<h3>
    <hr>
    <button id="TABAN" class="btn btn-green" style="width: 49%">Otomatik Taban Kurucu -</button>
    <select id="tabanAyarlari" style="width: 49%" class="btn">
    <option value="pp" selected>-</option>
    <option value="co">CORNER</option>
    <option value="sm">SMALL</option>
    <option value="bg">BIG</option>
    <option value="bg2">Updated BIG</option>
    <option value="sc">Score</option>
    </select>
    <hr>
       <h3>Taban Kaydedici<h3>
    <hr>
    <button class="btn btn-green savebase" style="width: 29%">Taban'ı Kaydet!</button>
    <button class="btn btn-green buildbase" style="width: 29%">Taban'ı Yap!</button>
    <button class="btn btn-red deletebase" style="width: 39%">Taban'ı Sil!</button>
    <hr>
       <h3>Taban Kodu Alıcı<h3>
    <hr>
    <button class="btn btn-blue basecode2" style="width: 99%">Taban Kodun'u Al!</button>
    <input type="text" class="btn tabankodu" placeholder="Taban Bilgileri. . ." style="width: 99%">
</div>
<div class="0i4">
    <hr>
       <h3>Defans<h3>
    <hr>
    <button id="aito" class="btn btn-blue" style="width: 99%">Dalga Dondurucu -</button>
    <button id="tekraryapici" class="btn btn-blue" style="width: 99%">Tekrar Yapıcı -</button>
    <hr>
       <h3>Alarmlar<h3>
    <hr>
    <button class="btn btn-green alarm" onclick="alarm();" style="width: 49%">Kule Yıkılış Alarmı -</button>
    <button class="btn btn-green stashHitAlarm" onclick="stashHitAlarm();" style="width: 49%">Yumurta Hasar Alarmı -</button>
    <button class="btn btn-green deadAlarm" onclick="deadAlarm();" style="width: 49%">Ölüm Alarmı -</button>
    <button class="btn btn-green disconnectAlarm" onclick="disconnectAlarm();" style="width: 49%">Bağlantı Hatası Alarmı -</button>
    <button class="btn btn-green health65pAlarm" onclick="health65pAlarm();" style="width: 49%">%65 Can Alarmı -</button>
    <button class="btn btn-green pingAlarm" onclick="pingAlarm();" style="width: 49%">Ping Alarmı -</button>
    <button class="btn btn-green tower65pAlarm" onclick="tower65pAlarm();" style="width: 99%">%65 Kule Can'ı Alarmı -</button>
</div>
<div class="0i5">
${getRandomItem(imageArray2)}

<div style="display: flex;flex-direction: column;align-content: stretch;align-items: flex-end;margin: -40px 0 100px 0;">
   <button id="sendalt" class="btn btn-green" style="width: 30%">Klon Gönder</button>
   <button id="delallalt" class="btn btn-red" style="width: 30%">Tüm Klonları Sil!</button>
</div>
<br>
    <hr>
       <h3>Klon Yönetimi<h3>
    <hr>
   <button id="autofarm" class="btn btn-green" style="width: 39%">Otomatik Altın Kasma -</button>
   <input  id="altinsayisi" class="btn" style="width: 29%" placeholder="Altın Sayısı">
   <button id="mousemove" class="btn btn-green" style="width: 29%">Fare Takip'i -</button>
   <button id="joinRandomAlt" class="btn btn-blue" style="width: 31%">Rastgele Klon'a Katıl -</button>
   <button id="spamTextAlts" class="btn btn-green" style="width: 27%">Klon Spam'ı -</button>
   <button id="autoSpearUpgrade" class="btn btn-purple" style="width: 39%">Otomatik Kılıç Yükselt -</button>
   <button id="finder" class="btn btn-green" style="width: 69%">Base Bulucu -</button>
   <button id="delfinder" class="btn btn-red delfinder" style="width: 29%">Bulunan Baseleri Sil</button>
</div>
<div class="0i6">
   <hr>
       <h3>Kule İyileştirici<h3>
   <hr>
   <input  id="dondurucuklankodu" class="btn" style="width: 39%" placeholder="Dondurulacak Parti Anahtarı. . .">
   <button id="kodukullan" class="btn btn-green" style="width: 29%">Kodu Kaydet!</button>
   <button id="dondurucu" class="btn btn-green" style="width: 29%">Kule Dondurucu -</button>
   <button id="towerheal" class="btn btn-green" style="width: 99%">Kule İyileştirici -</button>
   <hr>
       <h3>Konum Belirteçleri<h3>
   <hr>
   <button id="marker" class="btn btn-blue" style="width: 49%">Konum Berlirteçi Oluştur</button>
   <button id="delmarker" class="btn btn-red" style="width: 49%">Konum Berlirteçlerini Sil</button>
   <hr>
      <h3>Skor<h3>
   <hr>
   <button id="logger" class="btn btn-green" style="width: 99%">Skor Kaydedici -</button>
</div>
<div class="0i7">
   <hr>
      <h3>FPS<h3>
   <hr>
   <button id="6i3" class="btn btn-purple" style="width: 49%">Arka Planı Gizle</button>
   <button id="7i3" class="btn btn-purple" style="width: 49%">İnsanlarları Gizle</button>
   <button id="8i3" class="btn btn-purple" style="width: 49%">Ağaçları, Taşları Gizle</button>
   <button id="9i3" class="btn btn-purple" style="width: 49%">Vuruşları Gizle</button>
   <button id="10i3" class="btn btn-purple" style="width: 49%">Herşeyi Gizle</button>
   <button id="11i3" class="btn btn-purple" style="width: 49%">Oyunu Durdur</button>
   <hr>
      <h3>Ek FPS Ayarları<h3>
   <hr>
   <button class="btn btn-green 1i20" style="width: 99%">Sadece Gün Işığı -</button>
   <button class="btn btn-red 2i20" style="width: 49%">Sıralamayı Sakla</button>
   <button class="btn btn-red 3i20" style="width: 49%">Sistem Mesajlarını Sakla</button>
   <button class="btn btn-red 5i20" style="width: 49%">Haritayı Sakla</button>
   <button class="btn btn-red 6i20" style="width: 49%">Envanteri Sakla</button>
   <button class="btn btn-red 7i20" style="width: 49%">Can Göstergesini Sakla</button>
   <button class="btn btn-red 8i20" style="width: 49%">Eşyaları Sakla</button>
</div>
`;
displayAllToNone();
getElem('BD')[0].click();
let allowed1 = true;
let getRss = false;
//#Buton değişimi
getId('changecolors').addEventListener('click', function () {
    window.customColor();
})
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
document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) { // key -
            getRss = !getRss;
        };
    }
})
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
window.customColor = function() {
    let yncv = document.getElementById("ync").value;
    let hr = hexToRgb(yncv);
    game.world.localPlayer.entity.currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
    window.yncv = yncv;
};
window.HL = () => {
    let lb = document.getElementsByClassName("hud-top-right")[0];
    if(lb.style.display === "block" || lb.style.display === "" ) {
        document.getElementsByClassName("2i20")[0].className = "btn btn-green 2i20";
        document.getElementsByClassName("2i20")[0].innerText = "Sıralamayı Göster";
        lb.style.display = "none";
    } else {
        document.getElementsByClassName("2i20")[0].className = "btn btn-red 2i20" ;
        document.getElementsByClassName("2i20")[0].innerText = "Sıralamayı Sakla";
        lb.style.display = "block";
    };
};
window.ADB = () => {
    let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
    if(hno.style.display === "block" || hno.style.display === "" ) {
        document.getElementsByClassName("1i20")[0].className = "btn btn-red 1i20";
        document.getElementsByClassName("1i20")[0].innerText = "Sadece Gün Işığı +";
        hno.style.display = "none";
    } else {
        document.getElementsByClassName("1i20")[0].className = "btn btn-green 1i20" ;
        document.getElementsByClassName("1i20")[0].innerText = "Sadece Gün Işığı -";
        hno.style.display = "block";
    };
};
window.SUS = () => {
    let kamehameha = document.getElementsByClassName("hud-popup-overlay")[0];
    if(kamehameha.style.display === "block" || kamehameha.style.display === "" ) {
        document.getElementsByClassName("3i20")[0].className = "btn btn-green 3i20";
        document.getElementsByClassName("3i20")[0].innerText = "Sistem Mesajlarını Göster";
        kamehameha.style.display = "none";
    } else {
        document.getElementsByClassName("3i20")[0].className = "btn btn-red 3i20" ;
        document.getElementsByClassName("3i20")[0].innerText = "Sistem Mesajlarını Sakla";
        kamehameha.style.display = "block";
    };
};
window.WEEB = () => {
    let VEGITO = document.getElementsByClassName("hud-map")[0];
    if(VEGITO.style.display === "block" || VEGITO.style.display === "" ) {
        document.getElementsByClassName("5i20")[0].className = "btn btn-green 5i20";
        document.getElementsByClassName("5i20")[0].innerText = "Haritayı Göster";
        VEGITO.style.display = "none";
    } else {
        document.getElementsByClassName("5i20")[0].className = "btn btn-red 5i20" ;
        document.getElementsByClassName("5i20")[0].innerText = "Haritayı Sakla";
        VEGITO.style.display = "block";
    };
};
window.trollge = () => {
    let trollers = document.getElementsByClassName("hud-toolbar")[0];
    if(trollers.style.display === "block" || trollers.style.display === "" ) {
        document.getElementsByClassName("6i20")[0].className = "btn btn-green 6i20";
        document.getElementsByClassName("6i20")[0].innerText = "Envanteri Göster";
        trollers.style.display = "none";
    } else {
        document.getElementsByClassName("6i20")[0].className = "btn btn-red 6i20" ;
        document.getElementsByClassName("6i20")[0].innerText = "Envanteri Sakla";
        trollers.style.display = "block";
    };
};
window.healthbar = () => {
    let times10 = document.getElementsByClassName("hud-health-bar")[0];
    if(times10.style.display === "block" || times10.style.display === "" ) {
        document.getElementsByClassName("7i20")[0].className = "btn btn-green 7i20";
        document.getElementsByClassName("7i20")[0].innerText = "Can Göstergesini Göster";
        times10.style.display = "none";
    } else {
        document.getElementsByClassName("7i20")[0].className = "btn btn-red 7i20" ;
        document.getElementsByClassName("7i20")[0].innerText = "Can Göstergesini Sakla";
        times10.style.display = "block";
    };
};
window.resource = () => {
    let times20 = document.getElementsByClassName("hud-resources")[0];
    if(times20.style.display === "block" || times20.style.display === "" ) {
        document.getElementsByClassName("8i20")[0].className = "btn btn-green 8i20";
        document.getElementsByClassName("8i20")[0].innerText = "Eşyaları Göster";
        times20.style.display = "none";
    } else {
        document.getElementsByClassName("8i20")[0].className = "btn btn-red 8i20" ;
        document.getElementsByClassName("8i20")[0].innerText = "Eşyaları Sakla";
        times20.style.display = "block";
    };
};
getElem('1i20')[0].addEventListener('click', function () {
    window.ADB();
})
getElem('2i20')[0].addEventListener('click', function () {
    window.HL();
})
getElem('3i20')[0].addEventListener('click', function () {
    window.SUS();
})
getElem('5i20')[0].addEventListener('click', function () {
    window.WEEB();
})
getElem('6i20')[0].addEventListener('click', function () {
    window.trollge();
})
getElem('7i20')[0].addEventListener('click', function () {
    window.healthbar();
})
getElem('8i20')[0].addEventListener('click', function () {
    window.resource();
})
getElem('savebase')[0].addEventListener('click', function () {
    window.recordBase(1);
})
getElem('buildbase')[0].addEventListener('click', function () {
    window.buildRecordedBase(1);
})
getElem('deletebase')[0].addEventListener('click', function () {
    window.deleteRecordedBase(1);
})
getId2("logger").addEventListener('click', function() {
    window.logger = !window.logger;
    this.innerText = window.logger ? "Skor Kaydedici +" : "Skor Kaydedici -"
    this.className = window.logger ? "btn btn-red" : "btn btn-green"
})
getId2("towerheal").addEventListener('click', function() {
    window.towerheal = !window.towerheal;
    this.innerText = window.towerheal ? "Kule İyileştirici +" : "Kule İyileştirici -"
    this.className = window.towerheal ? "btn btn-red" : "btn btn-green"
})
getId('kodukullan').addEventListener('click', function () {
    window.dondurucukod = getId('dondurucuklankodu').value;
})
getId("dondurucu").addEventListener('click', function() {
    getId("dondurucu").className = "btn btn-red";
    if (TowerFreeze) {
        getId("dondurucu").className = "btn btn-green";
    }
})
getId("finder").addEventListener('click', function() {
    window.basefind = !window.basefind;
    getId("finder").innerText = "Base Bulucu -";
    getId("finder").className = "btn btn-green";
    if (window.basefind) {
        window.baseFinder();
        getId("finder").innerText = "Base Bulucu +";
        getId("finder").className = "btn btn-red";
    } else {
        window.basefind = false;
    };
});

getId("delfinder").addEventListener('click', function() {
    for (let obj in document.getElementsByClassName('scanned-building')) {
        document.getElementsByClassName('scanned-building')[obj].remove();
    };
});
//#Komutlar
game.network.addRpcHandler('ReceiveChatMessage', function(e) {
    if(e.uid == game.world.myUid) {
        if(e.message == "!boss") {
            setTimeout(() => {
                game.network.sendRpc({
                    name: "SendChatMessage",
                    message: "9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121",
                    channel: "Local"
                });
            }, 1000)
        }
        if(e.message == "!ahrc") {
            game.network.sendRpc({name: "SendChatMessage",message: `Otomatik Kazıcı: ${window.ahrc}`,channel: "Local"});
            window.ahrc = !window.ahrc;
        }
        if(e.message == "!space") {
            game.network.sendRpc({name: "SendChatMessage",message: `Otomatik Vuruş: ${window.space}`,channel: "Local"});
            window.space = !window.space;
        }
        if(e.message == "!autobomb") {
            game.network.sendRpc({name: "SendChatMessage",message: `Otomatik Bomba: ${window.autobomb}`,channel: "Local"});
            window.autobomb = !window.autobomb;
        }
        if(e.message == "!autospear") {
            game.network.sendRpc({name: "SendChatMessage",message: `Otomatik Bomba: ${window.autospear}`,channel: "Local"});
            window.autospear = !window.autospear;
        }
    }
})
getId("marker").addEventListener('click', function() {
    window.addMarker();
})
var map = document.getElementById("hud-map");
let markerId = 1;

window.addMarker = () => {
    map.insertAdjacentHTML("beforeend", `
    <div style="display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='map-display hud-map-player'>
    </div>`)
};
getElem("automove")[0].addEventListener('click', function() {
    window.move = !window.move;
    getElem("automove")[0].className = "btn btn-blue automove";
    document.getElementsByClassName("automove")[0].innerText = "Otomatik Takip -";
    if (window.move) {
        document.getElementsByClassName("automove")[0].className = "btn btn-red automove";
        document.getElementsByClassName("automove")[0].innerText = "Otomatik Takip +";
    }
})
getId2("spamTextAlts").addEventListener('click', function() {
    window.spamTextAlts = !window.spamTextAlts;
    this.innerText = window.spamTextAlts ? "Klon Spam'ı +" : "Klon Spam'ı -"
    this.className = window.spamTextAlts ? "btn btn-red" : "btn btn-green"
})
getId2("autoSpearUpgrade").addEventListener('click', function() {
    window.autoSpearUpgrade = !window.autoSpearUpgrade;
    this.innerText = window.autoSpearUpgrade ? "Otomatik Kılıç Yükselt +" : "Otomatik Kılıç Yükselt -"
    this.className = window.autoSpearUpgrade ? "btn btn-red" : "btn btn-purple"
})
getId2("delmarker").addEventListener('click', function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Tüm Kaydedilen Konumları Silmek İstermisiniz?", 1e4, function() {
        while (document.getElementsByClassName('map-display').length > 0) {
             document.getElementsByClassName('map-display')[0].remove();
        };
    })
})
getId2("TABAN").addEventListener('click', function() {
    window.autobase = !window.autobase;
    this.innerText = window.autobase ? "Otomatik Taban Kurucu +" : "Otomatik Taban Kurucu -"
    this.className = window.autobase ? "btn btn-red" : "btn btn-green"
})
getId2("joinRandomAlt").addEventListener('click', function() {
    window.joinRandomAlt = !window.joinRandomAlt;
    this.innerText = window.joinRandomAlt ? "Rastgele Klon'a Katıl +" : "Rastgele Klon'a Katıl -"
    this.className = window.joinRandomAlt ? "btn btn-red" : "btn btn-blue"
})
getId2("tekraryapici").addEventListener('click', function() {
    window.rebuild = !window.rebuild;
    getId2("tekraryapici").className = "btn btn-blue";
    getId2("tekraryapici").innerText = "Tekrar Yapıcı -";
    if (window.rebuild) {
        getId2("tekraryapici").className = "btn btn-red";
        getId2("tekraryapici").innerText = "Tekrar Yapıcı +";
    }
})
getId2("aito").addEventListener('click', function() {
    window.startaito = !window.startaito;
    getId2("aito").className = "btn btn-blue";
    getId2("aito").innerText = "Dalga Dondurucu -";
    if (window.startaito) {
        window.sendAitoAlt();
        getId2("aito").className = "btn btn-red";
        getId2("aito").innerText = "Dalga Dondurucu +";
    };
});
let autoBuildTimeout = false;
setInterval(() => {
    if (window.rebuild && deadTowers.length > 0 && !autoBuildTimeout) {
        console.log('rebuild')
        autoBuildTimeout = true
        for (let i of deadTowers) {
            game.network.sendRpc({
                name: "MakeBuilding",
                type: i[0],
                x: i[1],
                y: i[2],
                yaw: i[3],
            });
        };
        setTimeout(() => {
            autoBuildTimeout = false;
        }, 1000)
    }
})
let deadTowers = []
game.network.addRpcHandler("LocalBuilding", (data) => {
    if (window.rebuild) {
        for (let e of data) {
            if (!!e.dead) {
                let yaw = 0;
                if (["Harvester", "MeleeTower"].includes(e.type)) {
                    if (game.world.entities[e.uid] !== undefined) yaw = game.world.entities[e.uid].targetTick.yaw;
                }
                deadTowers.push([e.type, e.x, e.y, yaw, e.tier])
            };
            for (let i of deadTowers) {
                if (e.type == i[0] && e.x == i[1] && e.y == i[2] && e.dead == 0) {
                    deadTowers.splice(deadTowers.indexOf(i, 0), 1)
                }
            };
            if (e.type == "GoldStash") deadTowers = []
        }
    };
});
window.baseFinder = () => {
    if (window.basefind) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
            ws.binaryType = "arraybuffer";
            let finder = setInterval(() => {
                setTimeout(() => {
                    ws.close();

                    window.baseFinder();
                }, 30000);

                ws.close();
            }, 30000);

            ws.onclose = () => {
                ws.isclosed = true;
            };

            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);

                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };

                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };

                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(ws.network.codec.encode(e, t));
                    };
                };

                ws.network.sendPacket(4, {
                    displayName: 'ø',
                    extra: decoded.extra
                });;
            };

            ws.onEnterWorld = (data) => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));

                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    ws.network = new game.networkType();

                    let data = game.network.codec.decode(msg.data);

                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                ws.network.sendInput({
                    up: 1
                });

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendInput({
                        respawn: 1
                    });
                };

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                };

                ws.onTowerFound = data => {
                    let res = JSON.stringify(data);
                    let res2 = JSON.parse(res);

                    let Schema = Object.keys(game.ui.buildingSchema).filter(building => building !== 'Harvester');

                    for (let i in Schema) {
                        for (let entity in ws.data.entities) {
                            if (res.includes(Schema[i])) {
                                for (let e in res2.entities) {
                                    let xPos = Math.round(res2.entities[e].position.x / game.world.getHeight() * 100);
                                    let yPos = Math.round(res2.entities[e].position.y / game.world.getWidth() * 100);

                                    let building = document.createElement('div');
                                    building.classList.add('hud-map-building');
                                    building.classList.add('scanned-building');
                                    building.style.left = xPos + '%';
                                    building.style.top = yPos + '%';

                                    document.getElementsByClassName('hud-map')[0].appendChild(building);

                                    ws.close();
                                };
                            };
                        };
                    };
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld();

                        ws.network.sendPacket(9, {
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });

                        break;
                    case 0:
                        ws.onTowerFound(ws.data);

                        break;
                };
            };
        });
    };
};

game.network.addEntityUpdateHandler(() => {
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
${player.targetTick.oldName}
Altın: ${gold_1}                                     Kırmızı Taş: ${token_1}
Parti ID: ${Math.round(player.targetTick.partyId)}                           Skor: ${player.targetTick.score.toLocaleString()}
Odun: ${wood_1}                                    Taş: ${stone_1}
Oyuncu ID: ${player.targetTick.uid}                Pozisyon X: ${Math.round(player.targetTick.position.x)}, Pozisyon Y: ${Math.round(player.targetTick.position.y)}
\n
\n
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
${player.targetTick.oldName}
Altın: ${gold_1}                                     Kırmızı Taş: ${token_1}
Parti ID: ${Math.round(player.targetTick.partyId)}                           Skor: ${player.targetTick.score.toLocaleString()}
Odun: ${wood_1}                                    Taş: ${stone_1}
Oyuncu ID: ${player.targetTick.uid}                Pozisyon X: ${Math.round(player.targetTick.position.x)}, Pozisyon Y: ${Math.round(player.targetTick.position.y)}
\n
\n
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
})
window.sendAitoAlt = () => {
    if (window.startaito) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);
        let iframeWindow = iframe.contentWindow;
        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;
            let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
            ws.binaryType = "arraybuffer";
            ws.onclose = () => {
                ws.isclosed = true;
            }
            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);
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
                ws.network.sendPacket(4, {
                    displayName: "|_| Dalga Dondurucu |_|",
                    extra: decoded.extra
                });
            };

            ws.onEnterWorld = () => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));
                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;
                    ws.network = new game.networkType();
                    let data = game.network.codec.decode(msg.data);
                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                if (ws.data.name) {
                    ws.dataType = ws.data;
                };

                if (!window.startaito && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                };

                if (ws.verified) {
                    if (!ws.isDay && !ws.isclosed) {
                        ws.isclosed = true;
                        ws.close();

                        window.sendAitoAlt();
                    };
                };

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;

                    if (ws.isDay) {
                        ws.verified = true;
                    };
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendRpc({
                        respawn: 1
                    });

                };

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
                        };
                    };
                };

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld(ws.data);
                        break;
                };
            };
        });
    };
};
setInterval(() => {
    if(window.towerheal) {
        Game.currentGame.network.sendRpc({
            name: "CastSpell",
            spell : "HealTowersSpell",
            x: Math.round(Game.currentGame.ui.playerTick.position.x),
            y: Math.round(Game.currentGame.ui.playerTick.position.y),
            tier: 1
        })
    }
})
document.getElementById("6i3").addEventListener('click', function() {
    window.ground();
    this.innerText = "Arka Planı Gizle"
    this.className = "btn btn-purple";
    if (window.groundtoggle) {
        this.innerText = "Arka Planı Göster"
        this.className = "btn btn-red";
    }
})
document.getElementById("7i3").addEventListener('click', function() {
    window.npc();
    this.innerText = "İnsanları Gizle"
    this.className = "btn btn-purple";
    if (window.npctoggle) {
        this.innerText = "İnsanları Göster"
        this.className = "btn btn-red";
    }
})
document.getElementById("8i3").addEventListener('click', function() {
    window.env();
    this.innerText = "Ağaçları, Taşları Gizle"
    this.className = "btn btn-purple";
    if (window.envtoggle) {
        this.innerText = "Ağaçları, Taşları Göster"
        this.className = "btn btn-red";
    }
})
document.getElementById("9i3").addEventListener('click', function() {
    window.pjt();
    this.innerText = "Vuruşları Gizle"
    this.className = "btn btn-purple";
    if (window.pjttoggle) {
        this.innerText = "Vuruşları Göster"
        this.className = "btn btn-red";
    }
})
document.getElementById("10i3").addEventListener('click', function() {
    window.everything();
    this.innerText = "Herşeyi Gizle"
    this.className = "btn btn-purple";
    if (window.everythingtoggle) {
        this.innerText = "Herşeyi Göster"
        this.className = "btn btn-red";
    }
})
document.getElementById("11i3").addEventListener('click', function() {
    window.rndr();
    this.innerText = "Oyunu Durdur"
    this.className = "btn btn-purple";
    if (window.rndrtoggle) {
        this.innerText = "Oyunu Başlat"
        this.className = "btn btn-red";
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
game.network.addEnterWorldHandler(function () {
    setTimeout(() => {
        var skor = 0;
        var eSkor = Game.currentGame.ui.playerTick.score,
            ySkor = 0;
        Game.currentGame.network.addRpcHandler("DayCycle", () => {
            if (Game.currentGame.ui.components.DayNightTicker.tickData.isDay == 1 && window.logger){
                ySkor = Game.currentGame.ui.playerTick.score;
                skor = ((ySkor - eSkor).toLocaleString("en"));
                game.ui.components.Chat.onMessageReceived({ displayName: "Skor Kaydedici", message: `Dalga: ${game.ui.playerTick.wave}, Son dalga'da gelen skor: ${skor}` })
                eSkor = Game.currentGame.ui.playerTick.score;
            }
        });
    }, 500)
})
const webSockets = {};
let wsId = -1;
window.sendWs = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);
    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
        ws.binaryType = 'arraybuffer';
        ws.onopen = (data) => {
            ws.network = new game.networkType();
            wsId++;
            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };
            ws.playerTick = {};
            ws.inventory = {};
            ws.onRpc = (data) => {
                switch(data.name){
                    case 'Dead':
                        ws.network.sendPacket(3, { respawn: 1 });
                        break;
                    case 'PartyShareKey':
                        ws.psk = ws.data;
                        break;
                    case 'SetItem':
                        ws.inventory[ws.data.response.itemName] = ws.data.response;
                        if (!ws.inventory[ws.data.response.itemName].stacks) {
                            delete ws.inventory[ws.data.response.itemName];
                        }
                        break;
                    case 'PartyApplicant':
                        ws.network.sendRpc({name: "PartyApplicantDecide", applicantUid: game.world.myUid, accepted: 1})
                        ws.network.sendRpc({name: "SetPartyMemberCanSell", uid: game.world.myUid, canSell: 1});
                        break;
                    case 'ReceiveChatMessage':
                        if(data.response.uid == game.world.myUid) {
                            if(data.response.message.toLowerCase() == `!${ws.wsId}`) {
                                ws.hit = 0;
                            };
                            if(data.response.message.toLowerCase() == `${ws.wsId}`) {
                                ws.space = 0;
                            };
                            if(data.response.message.toLowerCase() == `!j${ws.wsId}`) {
                                ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: parent.game.ui.playerPartyShareKey});
                            };
                            if (data.response.message.toLowerCase() == `!l${ws.wsId}`) {
                                ws.network.sendRpc({ name: 'LeaveParty' })
                            };
                            if (data.response.message.toLowerCase() == `!s`) {
                                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `Altın: ${ws.playerTick.gold}, Dalga: ${ws.playerTick.wave}, Klon id'si: ${ws.wsId}`});
                            };
                            if (data.response.message.toLowerCase() == `!join`) {
                                ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: parent.game.ui.playerPartyShareKey});
                            };
                            if (data.response.message.toLowerCase() == `!leave`) {
                                ws.network.sendRpc({ name: 'LeaveParty' })
                            };
                            if (data.response.message.toLowerCase() == `s+`) {
                                ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: 1});
                            };
                            if (data.response.message.toLowerCase() == `+s`) {
                                ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier});
                                ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier+1});
                            }
                            if (data.response.message.toLowerCase() == `+ht`) {
                                ws.network.sendRpc({name:"CastSpell",spell:"HealTowersSpell",x: Math.round(Game.currentGame.ui.playerTick.position.x),y: Math.round(Game.currentGame.ui.playerTick.position.y), tier: 1})
                            };
                            if (data.response.message.toLowerCase() == `+htp`) {
                                ws.network.sendRpc({name:"CastSpell",spell:"HealTowersSpell",x: Math.round(ws.playerTick.position.x),y: Math.round(ws.playerTick.position.y), tier: 1})
                            };
                        };
                        break;
                };
            };
            ws.gameUpdate = () => {
                ws.network.sendRpc({name: "SetOpenParty", isOpen: 1})
                ws.network.sendRpc({name: "SetPartyName", partyName: ws.wsId + ''})
                if(ws.hit < 12) {
                    ws.hit++;
                };
                if([3, 9].includes(ws.hit)) {
                    ws.network.sendPacket(3, { space: 1 });
                } else if([6, 12].includes(ws.hit)) {
                    ws.network.sendPacket(3, { space: 0 });
                };
                if(ws.space < 6) {
                    ws.space++;
                };
                if(ws.space == 3) {
                    ws.network.sendPacket(3, { space: 1 });
                };
                if(ws.space == 6) {
                    ws.network.sendPacket(3, { space: 0 });
                };
                let myPlayer = game.ui.playerTick;
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x,game.ui.mousePosition.y);
                ws.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-ws.playerTick.position.x + mouseToWorld.x)*100, (-ws.playerTick.position.y + mouseToWorld.y)*100)})
                ws.moveToward = (position) => {
                    let x = Math.round(position.x);
                    let y = Math.round(position.y);

                    let myX = Math.round(ws.playerTick.position.x);
                    let myY = Math.round(ws.playerTick.position.y);

                    let offset = 1;

                    if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                    if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                    if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                    if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                };
                if(window.mousemove) {
                    ws.moveToward(game.renderer.screenToWorld(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y));
                }
                if(window.spamTextAlts) {
                    ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "Serplent uğradı, yatın aşşağı orospu evlatları!"});
                }
                if(window.autoSpearUpgrade) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier});
                    ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier+1});
                }
                if (window.autofarm) {
                    if (ws.playerTick.gold > Math.floor(document.getElementById("altinsayisi").value)) {
                        ws.network.sendRpc({name: 'LeaveParty'});
                    } else {
                        ws.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: game.ui.getPlayerPartyShareKey() + ""});
                    };
                };
                if (window.joinRandomAlt) {
                    if (Object.keys(game.ui.buildings).length > 1) {
                        let randomAlt = Math.floor(Math.random() * Object.keys(webSockets).length);
                        game.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: webSockets[randomAlt].psk.response.partyShareKey});
                    }
                };
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5){
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;
                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));
                    ws.send(ws.network.codec.encode(4, { displayName: wsId + "", extra: data.extra}));
                    ws.network.sendPacket(3, game.network.lastPacketInput);
                    return;
                };
                ws.data = ws.network.codec.decode(msg.data);
                switch(ws.data.opcode) {
                    case 0:
                        for(let i in ws.data.entities[ws.playerTick.uid]) {
                            ws.playerTick[i] = ws.data.entities[ws.playerTick.uid][i];
                        };
                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();
                        ws.playerTick.uid = ws.data.uid;
                        webSockets[wsId] = ws;
                        ws.wsId = wsId;
                        if (ws.psk) {
                            ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                        } else {
                            setTimeout(() => {
                                if (ws.psk) {
                                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                                }
                            }, 250)
                        }
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }
            ws.onclose = e => {
                iframe.remove();
                delete webSockets[ws.wsId];
            };
        };
    });
};

window.rmAllWS = () => {
    for(let id in webSockets) {
        webSockets[id].close();
    };
};

let wsPosElems = {};

game.network.addEntityUpdateHandler(() => {
    for(let id in wsPosElems) {
        const ws = webSockets[id];
        if(!ws) {
            wsPosElems[id].remove();
            delete wsPosElems[id];
            continue;
        };
        wsPosElems[id].style.top = `${((ws.playerTick.position.y / game.world.height) * 100) - 20}%`;
        wsPosElems[id].style.left = `${((ws.playerTick.position.x / game.world.width) * 100) - 2}%`;
    };
    for(let id in webSockets) {
        if(wsPosElems[id]) { continue; };
        const ws = webSockets[id];
        const newPosElem = document.createElement("p");
        newPosElem.style.top = `${((ws.playerTick.position.y / game.world.height) * 100) - 20}%`
        newPosElem.style.left = `${((ws.playerTick.position.x / game.world.width) * 100) - 2}%`
        newPosElem.style.color = "white";
        newPosElem.style.position = "absolute";
        newPosElem.style.zIndex = "9"
        newPosElem.innerText = "•";
        document.getElementsByClassName("hud-map")[0].appendChild(newPosElem);
        wsPosElems[id] = newPosElem;
        console.log(`new #${id}`);
    };
});
game.network.oldSendInput = game.network.sendInput;
game.network.sendInput = m => {
    for(let id in webSockets) {
        const ws = webSockets[id];
        ws.network.sendPacket(3, m);
    };
    game.network.oldSendInput(m);
};
game.network.oldSendRpc = game.network.sendRpc;
game.network.sendRpc = m => {
    if(m.name == "EquipItem") {
        for(let id in webSockets) {
            const ws = webSockets[id];
            ws.network.sendPacket(9, { name: "BuyItem", itemName: m.itemName, tier: m.tier });
            ws.network.sendPacket(9, m);
        };
    };
    game.network.oldSendRpc(m);
}
// Parti İsim Değiştirme
(function() {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.all.min.js";
    document.getElementsByTagName('head')[0].appendChild(js);
    var css = document.createElement('script');
    css.type = 'text/css';
    css.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.min.css";
    document.getElementsByTagName('head')[0].appendChild(css);
    var intervalId = setInterval(function() {
        if(Game.currentGame.world.inWorld === true) {
            clearInterval(intervalId);
            var my_elem = document.getElementsByClassName('hud-party-actions')[0];
            var div = document.createElement('div');
            var btncustom = "<style type=\"text/css\">.custom_input { width: 100px; height: 35px; font-size: 15px; padding: 5px 10px; color: #555; border-radius: 5px; border: 1px solid #bbb; outline: none;}a.button1{ display:inline-block; padding:0.35em 1.2em; border:0.1em solid #FFFFFF; margin:0 0.3em 0.3em 0; border-radius:0.12em; box-sizing: border-box; text-decoration:none; font-family:'Roboto',sans-serif; font-weight:300; color:#FFFFFF; text-align:center; transition: all 0.2s;}a.button1:hover{ color:#000000; background-color:#FFFFFF;}@media all and (max-width:30em){ a.button1{ display:block; margin:0.4em auto; }}</style>";
            document.body.insertAdjacentHTML("beforeend", btncustom);
            div.innerHTML = "<div style=\"display: inline-block; margin-left: 15px; margin-right: 10px;\"> Parti İsim: </div><a class=\"button1\">Aktif Et</a><a class=\"button1\" style=\"margin-left:10px\">Kapat</a><small style=\"margin-left: 5px; margin-right: 5px;\"> Hız: </small><input class=\"custom_input\" type=\"number\" value=\"100\" min=\"0\" max=\"10000\" />";
            my_elem.parentNode.insertBefore(div, my_elem);
            document.getElementById('hud-menu-party').style.height = "480px";
            let maxlength = setInterval(function() {
                if(document.getElementsByClassName('swal2-input')[0]) {
                    clearInterval(maxlength);
                    var i;
                    for(i = 0; i < document.getElementsByClassName('swal2-input').length; i++) {
                        document.getElementsByClassName('swal2-input')[i].maxLength = 49;
                    }
                }
            }, 100);
            var start = document.getElementsByClassName('button1')[0];
            start.style.marginBottom = "20px";
            var id = null;
            let interval = setInterval(function() {
                if(start) {
                    clearInterval(interval);
                    var speed = document.querySelector('input[class="custom_input"]');
                    start.onclick = function() {
                        swal.mixin({
                            input: 'text',
                            confirmButtonText: 'Devam',
                            showİşlemiSonlandırButton: true,
                            progressSteps: ['1', '2', '3'],
                        }).queue([{
                            title: '• Kurt & Serplent',
                            text: 'Parti İsmi Tekrarlayıcı 1'
                        }, {
                            title: '• Kurt & Serplent',
                            text: 'Parti İsmi Tekrarlayıcı 2'
                        }, {
                            title: '• Kurt & Serplent',
                            text: 'Parti İsmi Tekrarlayıcı 3'
                        }]).then((result) => {
                            if(result.value) {
                                swal({
                                    title: 'Başardın',
                                    html: 'Parti İsimlerin <pre><code>' + JSON.stringify(result.value) + '</code></pre>',
                                    confirmButtonText: 'Güzel',
                                    onClose: () => {
                                        function countInArray(array, what) {
                                            var count = 0;
                                            for(var i = 0; i < array.length; i++) {
                                                if(array[i] === what) {
                                                    count++;
                                                }
                                            }
                                            return count;
                                        }
                                        var i;
                                        for(i = 0; i < result.value.length; i++) {
                                            if(result.value[i] == "") {
                                                var parties = countInArray(result.value, "");
                                                if(parties == 0) {
                                                    result.value.length = 3;
                                                } else if(parties == 1) {
                                                    result.value.length = 2;
                                                } else if(parties == 2) {
                                                    result.value.length = 1;
                                                } else if(parties == 3) {
                                                    result.value.length = 0;
                                                    result.value == undefined;
                                                    swal("Hata!", "Parti İsmin Girilemedi!", "error")
                                                }
                                            }
                                        }
                                        document.getElementsByClassName('hud-menu-icon')[1].click();
                                        var partyTag = document.getElementsByClassName('hud-party-tag')[0];
                                        var space = new Event("keyup");
                                        var delay;
                                        id = setInterval(function() {
                                            partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                            space.keyCode = 32;
                                            partyTag.dispatchEvent(space);
                                        }, delay);
                                        speed.addEventListener("input", function() {
                                            clearInterval(id);
                                            delay = speed.value;
                                            id = setInterval(function() {
                                                partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                                space.keyCode = 32;
                                                partyTag.dispatchEvent(space);
                                            }, delay)
                                        });
                                        var stop = document.getElementsByClassName('button1')[1];
                                        stop.onclick = function() {
                                            result.value = null;
                                            clearInterval(id);
                                            id = null;
                                            var i;
                                            for(i = 0; i < 10000; i++) {
                                                clearInterval(i);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }, 1000)
            }
    }, 250)
    })();

    // ^ paylaşım anahtarları özelliği orijinal olarak 444x3'ten

    document.getElementsByClassName('hud-party-tabs-link')[0].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };
    document.getElementsByClassName('hud-party-tabs-link')[1].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };

// Parti malzemeleri
    game.ui.components.PlacementOverlay.oldStartPlacing = game.ui.components.PlacementOverlay.startPlacing;
    game.ui.components.PlacementOverlay.startPlacing = function(e) {
        game.ui.components.PlacementOverlay.oldStartPlacing(e);
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = 2;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(180);
        }
    }

    game.ui.components.PlacementOverlay.cycleDirection = function() {
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = (game.ui.components.PlacementOverlay.direction + 1) % 4;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(game.ui.components.PlacementOverlay.direction * 90);
        }
    };


    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";

    let privateTab = document.createElement("a");
    privateTab.className = "hud-party-tabs-link";
    privateTab.id = "privateTab";
    privateTab.innerHTML = "Parti Ayraçları";

    let privateHud = document.createElement("div");
    privateHud.className = "hud-private hud-party-grid";
    privateHud.id = "privateHud";
    privateHud.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);

    getId("privateTab").onclick = e => {
        getId("privateHud2").style.display = "none";
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
    }

    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
    }

    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
    }
    getId("privateHud").innerHTML = `
  <hr />
  <h1>Parti Anahtarları</h1>
  <hr />
  <button class="btn btn-red" onclick="game.network.sendRpc({ name: 'LeaveParty' })">Partiden Ayrıl</button>
  <button id="Spammer2" class="btn btn-gold 9z" style="width: 50%;">Parti Spam'ini Etkinleştir</button>
  <br><hr />
  <input id="psk" placeholder="Parti paylaşım anahtarı (1)..." value="-" class="btn" /><button class="btn btn-purple" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Partiye Katıl (1)...</button>
  <input id="psk2" placeholder="Parti paylaşım anahtarı (2)..." value="-" class="btn" /><button class="btn btn-purple" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk2').value })">Partiye Katıl (2)...</button>
  <input id="psk3" placeholder="Parti paylaşım anahtarı (3)..." value="-" class="btn" /><button class="btn btn-purple" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk3').value })">Partiye Katıl (3)...</button>
  <br><hr />
  <button class="btn btn-green 7xXg">Parti doldur</button>
  <button class="btn btn-red 8xXg">Klonları sil</button>
  <br />
  `;

    let privateTab2 = document.createElement("a");
    privateTab2.className = "hud-party-tabs-link";
    privateTab2.id = "privateTab2";
    privateTab2.innerHTML = "Kayıtlı Anahtarlar";

    let privateHud2 = document.createElement("div");
    privateHud2.className = "hud-private hud-party-grid";
    privateHud2.id = "privateHud2";
    privateHud2.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab2);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud2, getElement("hud-party-actions")[0]);

    getId("privateTab2").onclick = e => {
        getId("privateHud").style.display = "none";
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
  <hr />
  <h1>Kayıtlı Anahtarlar</h1>
  <hr />
  `;
    game.network.addRpcHandler("PartyShareKey", function(e) {
        let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
        let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
        let psk = e.partyShareKey;
        let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
        getId("privateHud2").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk} <a href="${lnk}" target="_blank" color="blue">[Aç]</a></p></div><button class="btn btn-purple" id="${cpKeyId}" style="display:inline-block;">Anahtarı Kopyala</button><button class="btn btn-s" id="${cpLnkId}" style="display:inline-block;">Linki Kopyala</button><br />`
            document.getElementById(cpKeyId).addEventListener('click', function(e) {
                const elem = document.createElement('textarea');
                elem.value = psk;
                document.body.appendChild(elem);
                elem.select();
                document.execCommand('copy');
                document.body.removeChild(elem);
                new Noty({
                    type: 'success',
                    text: `Copied to clipboard`,
                    timeout: 2000
                }).show();
            });
        document.getElementById(cpLnkId).addEventListener('click', function(e) {
            const elem = document.createElement('textarea');
            elem.value = lnk;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            new Noty({
                type: 'success',
                text: `Copied to clipboard`,
                timeout: 2000
            }).show();
        });
    });

// Parti doldur
window.partyfiller = () => {
    let iframe = document.createElement("iframe")
    iframe.className = "PartyAlts";
    iframe.src = `https://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/`;
    iframe.addEventListener('load', function() {
        iframe.contentWindow.eval(`
        game.renderer.scene.setVisible(false);
        document.getElementsByClassName("hud-intro-play")[0].click();
        game.network.addEntityUpdateHandler(() => {
          game.network.sendPacket(3, { left: 1, up: 1 });
        })
        `);
    })
    iframe.style.display = 'none';
    document.body.append(iframe);
}

window.deleteAllParty = () => {
    let deleteAltLoop = setInterval(function() {
        if (document.getElementsByClassName('PartyAlts').length > 0) {
            for(let iframe of document.getElementsByClassName('PartyAlts')){
                iframe.remove();
            }
        }
        else{
            clearInterval(deleteAltLoop);
        }
    })
}
window.fillParty = () => {
    if (game.ui.playerPartyMembers.length == 1) {
        window.partyfiller();
        window.partyfiller();
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 2) {
        window.partyfiller();
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 3) {
        window.partyfiller();
    };
    if (game.ui.playerPartyMembers.length == 4) {
        game.ui.components.PopupOverlay.showHint("Partiniz dolu!");
    };
};
document.getElementsByClassName("7xXg")[0].addEventListener('click', function() {
    window.fillParty();
})
document.getElementsByClassName("8xXg")[0].addEventListener('click', function() {
    window.deleteAllParty();
})

// Parti spam
function partydiv() {
    var newNode = document.createElement('div');
    newNode.className = 'tagzspam';
    newNode.style = 'text-align:center';
    document.getElementsByClassName('hud-party-actions')[0].appendChild(newNode);
}


document.getElementsByClassName("hud-menu-party")[0].setAttribute("style", "width: 610px; height: 510px;");
var Spammer = document.getElementById("Spammer2");
Spammer.addEventListener("click", spampartys);
Spammer.addEventListener("click", spampartys2);
var partyspam = false;
function spampartys() {
    clearInterval(partyspam);
    if (partyspam !== null) {
        partyspam = null;
    } else {
        partyspam = setInterval(function() {
            let partys = document.getElementsByClassName('hud-party-link');
            for (var i = 0; i < partys.length; i++) {
                var link = partys[i];
                link.click();
            }
        }
                               )}}
function spampartys2() {
    var change6 = document.getElementById("sap");
}
document.getElementsByClassName("9z")[0].addEventListener('click', function() {
    spampartys2 = !spampartys2;
    document.getElementsByClassName("9z")[0].className = "btn btn-gold 9z";
    document.getElementsByClassName("9z")[0].innerText = "Parti Spam'ini Etkinleştir";
    if (spampartys2) {
        document.getElementsByClassName("9z")[0].className = "btn btn-red 9z";
        document.getElementsByClassName("9z")[0].innerText = "Parti Spam'ini Devre dışı bırak";
    }
})
// Özel parti gösterisi
window.showpriv = true
if (game.world.inWorld === false) {
    game.network.addPreEnterWorldHandler(() => {
        setInterval(() => {
            document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

            function checkStatus(party) {
                if (window.showpriv == true) {
                    if(party.isOpen == 1) {
                        return '<a style = "color: #00e700;opacity: 0.8;">[Katıl]<a/>';
                    } else if(!party.isOpen == 1) {
                        return '<a style = "color:red;opacity: 0.8;">[Özel]<a/>';
                    }
                } else {
                    return '';
                }
            };


            let all_parties = game.ui.parties;

            for(let i in all_parties) {
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
                <small>ID: ${parties.partyId}</small> <span>${parties.memberCount}/4<span/>
            `;

                if(parties.memberCount == 4) {
                    tab.classList.add('is-disabled');
                } else {
                    tab.style.display = 'block';
                }
                if(parties.partyName == document.getElementsByClassName('hud-party-tag')[0].value) {
                    tab.classList.add('is-active');
                }
                if (parties.isOpen !== 1 && window.showpriv == false) {
                    tab.style.display = 'none';
                }

                // İstek için işlev
                tab.addEventListener('click', function() {
                    let isJoining = true;
                    if(tab.isPublic == 1 && tab.members < 4) {
                        isJoining = true;
                        game.network.sendRpc({
                            name: 'JoinParty',
                            partyId: Math.floor(tab.id)
                        });
                    } else if(!tab.isPublic == 1) {
                        isJoining = false;
                        game.ui.components.PopupOverlay.showHint("Özel partiye istek talebi yapamazsınız!");
                    }
                });
                document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
            };
        },5000);
    });
}

var isSpamming = 0;
function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e !== "") {
            window.spammer = setInterval(() => {
                game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: e});
            }, 100);
        } else {
            game.ui.components.PopupOverlay.showHint(`Mesajını Yaz!`);
        };
    } else if (isSpamming) {
        clearInterval(window.spammer);
    };
    isSpamming = !isSpamming;
};
document.querySelector('#togglespmch').addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spammsg').value)
    let spamtoggle = document.querySelector('#spamtoggle')
    this.innerText = isSpamming ? "Sohbet Spam +" : "Sohbet Spam -"
    if (isSpamming) {
        this.classList.add("btn-red"); this.classList.remove("btn-green");
    } else {
        this.classList.add("btn-green"); this.classList.remove("btn-red");
    };
});

function getGoldStash() {
    return Object.values(Game.currentGame.ui.buildings).find(building => building.type == "GoldStash");
}
isOnOrNot = false;
stashhitalarm = false;
deadalarm = false;
disconnectalarm = false;
health65palarm = false;
onlyOpenOnceOnTimeout = false;
pingalarm = false;
tower65palarm = false;

game.network.addRpcHandler("LocalBuilding", e => {
    for (let i in e) {
        if (e[i].dead) {
            if (e[i].type !== "Wall" && e[i].type !== "Door") {
                if (isOnOrNot) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
                }
            }
        }
    }
})

game.network.addEntityUpdateHandler((e) => {
    let gl = GetGoldStash2();
    if (gl) {
        if (e.entities[gl.uid]) {
            if (e.entities[gl.uid].health !== e.entities[gl.uid].maxHealth) {
                if (stashhitalarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 24000))
                }
            }
        }
    }
    if (e.entities[game.world.myUid]) {
        if (e.entities[game.world.myUid].health) {
            if ((e.entities[game.world.myUid].health / 500) * 100 < 65) {
                if (health65palarm) {
                    !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 24000));
                }
            }
        }
    }
    if((game.network.ping > 2000) && pingalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    };
    for (let i in e.entities) {
        if (e.entities[i].partyId == game.ui.playerTick.partyId) {
            if (e.entities[i].model == "Harvester" || e.entities[i].model == "ArrowTower" || e.entities[i].model == "CannonTower" || e.entities[i].model == "BombTower" || e.entities[i].model == "MagicTower" || e.entities[i].model == "MeleeTower") {
                entitiesHealth[e.entities[i].uid] = {uid: e.entities[i].uid, health: e.entities[i].health, maxHealth: e.entities[i].maxHealth}
            }
        }
        if (entitiesHealth[i]) {
            e.entities[i].health && (entitiesHealth[i].health = e.entities[i].health);
            e.entities[i].maxHealth && (entitiesHealth[i].maxHealth = e.entities[i].maxHealth);
        }
    }
    for (let i in entitiesHealth) {
        if ((entitiesHealth[i].health / entitiesHealth[i].maxHealth) * 100 < 65) {
            if (tower65palarm) {
                !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 30000))
            }
        }
        if (!e.entities[i]) {
            delete entitiesHealth[i];
        }
    }
})

game.network.addRpcHandler("Dead", () => {
    if (deadalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

game.network.addCloseHandler(() => {
    if (disconnectalarm) {
        !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
    }
})

videoalert = () => {
    let a = new Audio();
    a.src = "https://cdn.discordapp.com/attachments/1073961157888577607/1075675672892149841/siren.mp3"
    a.volume = 1;
    a.play();
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Alarmı durdurmak istermisiniz?", 10000, function() {
        a.pause();
    })
    setTimeout(() => {
        a.pause();
    }, 30000);
}

alarm = () => {
    window.isOnOrNot = !isOnOrNot;
    getElem("alarm")[0].innerText = getElem("alarm")[0].innerText.replace(isOnOrNot ? "Kule Yıkılış Alarmı -" : "Kule Yıkılış Alarmı +", isOnOrNot ? "Kule Yıkılış Alarmı +" : "Kule Yıkılış Alarmı -");
    getElem("alarm")[0].className = getElem("alarm")[0].className.replace(isOnOrNot ? "green" : "red", isOnOrNot ? "red" : "green");

}

stashHitAlarm = () => {
    window.stashhitalarm = !stashhitalarm;
    getElem("stashHitAlarm")[0].innerText = getElem("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Yumurta Hasar Alarmı -" : "Yumurta Hasar Alarmı +", stashhitalarm ? "Yumurta Hasar Alarmı +" : "Yumurta Hasar Alarmı -");
    getElem("stashHitAlarm")[0].className = getElem("stashHitAlarm")[0].className.replace(stashhitalarm ? "green" : "red", stashhitalarm ? "red" : "green");

}

deadAlarm = () => {
    window.deadalarm = !deadalarm;
    getElem("deadAlarm")[0].innerText = getElem("deadAlarm")[0].innerText.replace(deadalarm ? "Ölüm Alarmı -" : "Ölüm Alarmı +", deadalarm ? "Ölüm Alarmı +" : "Ölüm Alarmı -");
    getElem("deadAlarm")[0].className = getElem("deadAlarm")[0].className.replace(deadalarm ? "green" : "red", deadalarm ? "red" : "green");
}

disconnectAlarm = () => {
    window.disconnectalarm = !disconnectalarm;
    getElem("disconnectAlarm")[0].innerText = getElem("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Bağlantı Hatası Alarmı -" : "Bağlantı Hatası Alarmı +", disconnectalarm ? "Bağlantı Hatası Alarmı +" : "Bağlantı Hatası Alarmı -");
    getElem("disconnectAlarm")[0].className = getElem("disconnectAlarm")[0].className.replace(disconnectalarm ? "green" : "red", disconnectalarm ? "red" : "green");

}

health65pAlarm = () => {
    window.health65palarm = !health65palarm;
    getElem("health65pAlarm")[0].innerText = getElem("health65pAlarm")[0].innerText.replace(health65palarm ? "%65 Can Alarmı -" : "%65 Can Alarmı +", health65palarm ? "%65 Can Alarmı +" : "%65 Can Alarmı -");
    getElem("health65pAlarm")[0].className = getElem("health65pAlarm")[0].className.replace(health65palarm ? "green" : "red", health65palarm ? "red" : "green");
}

pingAlarm = () => {
    window.pingalarm = !pingalarm;
    getElem("pingAlarm")[0].innerText = getElem("pingAlarm")[0].innerText.replace(pingalarm ? "Ping Alarmı -" : "Ping Alarmı +", pingalarm ? "Ping Alarmı +" : "Ping Alarmı -");
    getElem("pingAlarm")[0].className = getElem("pingAlarm")[0].className.replace(pingalarm ? "green" : "red", pingalarm ? "red" : "green");
}

tower65pAlarm = () => {
    window.tower65palarm = !tower65palarm;
    getElem("tower65pAlarm")[0].innerText = getElem("tower65pAlarm")[0].innerText.replace(tower65palarm ? "%65 Kule Can'ı Alarmı -" : "%65 Kule Can'ı Alarmı +", tower65palarm ? "%65 Kule Can'ı Alarmı +" : "%65 Kule Can'ı Alarmı -");
    getElem("tower65pAlarm")[0].className = getElem("tower65pAlarm")[0].className.replace(tower65palarm ? "green" : "red", tower65palarm ? "red" : "green");
}

let GetGoldStash2 = () => {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}
   let availableCharacters = ""
   let textLength = 70;
   fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')
      .then(response => response.text())
      .then(data => {
         availableCharacters = data;
      });

   var chatSpam = null;

   function lagSpam() {
      clearInterval(chatSpam);
      if (chatSpam !== null) {
         chatSpam = null;
      } else {
         chatSpam = setInterval(function () {
            let text = ""
            for (let i = 0; i < textLength; i++) text += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
            game.network.sendRpc({
               name: "SendChatMessage",
               channel: "Local",
               message: text
            });
         }, 1050);
      };
   };
getId2("AIM").addEventListener('click', function() {
    window.aim = !window.aim;
    this.innerText = window.aim ? "Otomatik Aim +" : "Otomatik Aim -"
    this.className = window.aim ? "btn btn-red" : "btn btn-green"
})
function lagSpambtn() {
    if (document.getElementById("laggspam").innerHTML == "Lagg Spam +") {
        document.getElementById("laggspam").innerHTML = "Lagg Spam -";
        document.getElementById("laggspam").className = "btn btn-green"
    } else {
        document.getElementById("laggspam").innerHTML = "Lagg Spam +";
        document.getElementById("laggspam").className = "btn btn-red"
    }
}
document.getElementById('laggspam').addEventListener('click', lagSpam)
document.getElementById('laggspam').addEventListener('click', lagSpambtn)
//#Rick Roll
const messages = [
    //Satır 1
    "We're no strangers to love",
    "You know the rules and so do I",
    "A full commitment's what I'm thinking of",
    "You wouldn't get this from any other guy",
    "I just wanna tell you how I'm feeling",
    //Satır 2
    "Gotta make you understand",
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    //Satır 3
    "We've known each other for so long",
    "Your heart's been aching, but",
    "You're too shy to say it",
    "Inside, we both know what's been going on",
    "We know the game and we're gonna play it",
    "And if you ask me how I'm feeling",
    "Don't tell me you're too blind to see",
    //Satır 4
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    //Satır 5
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    //Satır 6
    "(Ooh, give you up)",
    "(Ooh, give you up)",
    "Never gonna give, never gonna give",
    "(Give you up)",
    "Never gonna give, never gonna give",
    "(Give you up)",
    "We've known each other for so long",
    //Satır 7
    "Your heart's been aching, but",
    "You're too shy to say it",
    "Inside, we both know what's been going on",
    "We know the game and we're gonna play it",
    "I just wanna tell you how I'm feeling",
    "Gotta make you understand",
    //Satır 8
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    //Satır 9
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    //Satır 10
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you"
]
//#Paraları Katla
const messages2 = [
    //Satır 1
    "Ya, woah","Ah, ah, ah, ya",
    "Prr, ey, ah",
    "(Slaughter on the track, yeah)",
    "Ya-a-a-a-ah",
    //Satır 2
    "Patla, patla, makinayı patlat",
    "Vitesi atmadan motoru da patlat",
    "Katla, katla, paraları katla",
    "Deha'yla CC paraları katla",
    //Satır 3
    "Yasla, yasla, manitaya yasla",
    "Kendini kaybet başla dansa",
    "Hotbox, motbox, hepsini tat lan",
    "Lemon haze, purple haze, farklı tatlar",
    //Satır 4
    "Lemon haze, purple haze, farklı tatlar",
    "Altımdaki Hellcat ayrı bi' yanda",
    "Double cup, triple cup, Deha bi' Drip God",
    //Satır 5
    "Model üç sıfırdan altmışa Mars'a",
    "Yeterli gelir bana Dreyko ve Tesla",
    "Üstüne atladım olduk manita",
    "Kaltak dedi bana, hapları arama",
    //Satır 6
    "Gold digger hoe'ya dedim, bi' daha arama",
    "Dedim, bi' daha arama lan",
    "Telefon çalıyo', ring, ring, ah",
    "Sürtüğün götü Big Bang",
    //Satır 7
    "Opps'lar kapıda, bang, bang, uh",
    "Polisler geldi, yat, yat, yat, diyo'",
    "Yatamam üstüm Chanel ve Dior",
    "Yatlar, katlar bunlarda, diyo'",
    //Satır 8
    "Paranın kaynağı belli diyo'",
    "Perros, ilk gece geldik evine",
    "Blancos, üstü kan içinde",
    "Trippin' so hard, kafalar gene high",
    //Satır 9
    "Uçuyorum, sanki Miles & Smiles",
    "Patla, patla, makinayı patlat",
    "Vitesi atmadan motoru da patlat",
    "Katla, katla, paraları katla",
    "Deha'yla CC paraları katla",
    //Satır 10
    "Yasla, yasla, manitaya yasla",
    "Kendini kaybet başla dansa",
    "Hotbox, motbox, hepsini tat lan",
    "Lemon haze, purple haze, farklı tatlar",
    //Satır 11
    "Mayday, mayday, uçuyorum tut beni",
    "Pilotum sanki 9/11 gibi",
    "Suicide bomber Osama Bin Ladin",
    "Hostes sexy, kabine gel, dedim",
    "Üstüm drippy, parasını vermedim",
    //Satır 12
    "Iced out chain'im parlıyo' sanki",
    "Chanel harici giydim Nike",
    "Çakalsa durmadan yardırır Rari",
    //Satır 13
    "Patla, patla, makinayı patlat",
    "Vitesi atmadan motoru da patlat",
    "Katla, katla, paraları katla",
    "Deha'yla CC paraları katla",
    //Satır 14
    "Yasla, yasla, manitaya yasla",
    "Kendini kaybet başla dansa",
    "Hotbox, motbox, hepsini tat lan",
    "Lemon haze, purple haze, farklı tatlar",
]
//#İstanbul Flow
const messages3 = [
    //Satır 1
    "Reyhanlı flow gençler heyecanlı cano",
    "Bilirsin bizi ister misin bi' daha",
    "İstanbul city herkes tanıyor bizi",
    "İstanbul flow kimse görmedi böylesini",
    //Satır 2
    "Sabah akşam Fifa Maşallah dostlar LaLiga",
    "Yaşadım on sekiz sene ödemedim kira",
    "Çalışmadım body falan yeter bana 70 kilo",
    "Hatunun üstünde dribbling Messi Argentino",
    //Satır 3
    "Pr-Prada Valentino Espana trankilo",
    "Sen iste yeter cano sotede kilo kilo",
    "Valla kuzen bi içtik herkes pilot",
    "İşin yok yanımda eğer değilsen Banker Bilo",
    //Satır 4
    "Yes click no criminal sorun burda minimimal",
    "Escano es protokol mevsim yine tropikal",
    "Corona Escobar yapıyon anca tantana",
    "Sana ne lan sen işine baksana dallama",
    //Satır 5
    "La vida loca erkek adam takar mı toka",
    "İstanbul flow harbi yetmişlik blaka",
    "Bizde her şey gerçekten vallahi yok şaka",
    "Shawty arasa bi saat dostum arasa beş dakika",
    //Satır 6
    "Takım Barcelona taktik tiki taka",
    "Antakyalı rapçileri kim sike takar",
    "Şekiller Afrika her yer on iki dakika",
    "Reyhanlı gangbay city orijinal tarikat",
    //Satır 7
    "Hatun Rus döktüm tuz",
    "Üstüne tekila",
    "Şampiyonlar ligi İnter",
    "İtalya seri A",
    "Sizi artık kim siker",
    "Amentu var ya",
    "Vallaha Bayıldım bay ben",
    "Ben bu karıya",
    //Satır 8
    "Reyhanlı flow gençler heyecanlı cano",
    "Bilirsin bizi ister misin bi' daha",
    "İstanbul city herkes tanıyor bizi",
    "İstanbul flow kimse görmedi böylesini",
    //Satır 9
    "Selam söyle canolara ben yaparken slalom",
    "Fenerbahçe forma al altına final on",
    "On sekiz yaşımda milyon ben bu işi biliyom",
    "Kapadım göz yalanlara çünkü güzel yalıyon",
    //Satır 10
    "Appareil photo machine de cent mégapixels nikon",
    "ازاكان بي احسن منن عرطون بنيكون",
    "Hala Madrid yalla Habib Bella Hadid",
    "مبين شكلك تقيل اما انتي خفيف",
    //Satır 11
    "Yes click no criminal sorun burda minimimal",
    "Escano es protokol mevsim yine tropikal",
    "Corona Escobar yapıyon anca tantana",
    "Takma ya kafana cano, bak dalgana",
    "İstanbul flow kimse görmedi böylesini",
]
getElem("55i")[0].addEventListener('click', function() {
    let start = 0;
    const spam = setInterval(() => {
        if(getId2('songOptions').value == 'rr') {
            game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: messages[start] })
            start++
        }
        if(getId2('songOptions').value == 'mp') {
            game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: messages2[start] })
            start++
        }
        if(getId2('songOptions').value == 'rp') {
            game.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: messages3[start] })
            start++
        }
    }, 1500)
    if(getId2('songOptions').value == 'rr') {
        setTimeout(() => {
            clearInterval(spam)
        }, 1500 * 62)
    }
    if(getId2('songOptions').value == 'mp') {
        setTimeout(() => {
            clearInterval(spam)
        }, 1500 * 57)
    }
    if(getId2('songOptions').value == 'rp') {
        setTimeout(() => {
            clearInterval(spam)
        }, 1500 * 49)
    }
})
getId2('delallalt').addEventListener('click', function () {
    window.rmAllWS();
})
getId2('sendalt').addEventListener('click', function () {
    window.sendWs();
})
getId2("mousemove").addEventListener('click', function() {
    window.mousemove = !window.mousemove;
    this.innerText = window.mousemove ? "Fare Takip'i +" : "Fare Takip'i -"
    this.className = window.mousemove ? "btn btn-red" : "btn btn-green"
})
getId2("autofarm").addEventListener('click', function() {
    window.autofarm = !window.autofarm;
    this.innerText = window.autofarm ? "Otomatik Altın Kasma +" : "Otomatik Altın Kasma -"
    this.className = window.autofarm ? "btn btn-red" : "btn btn-green"
})
getId2("HEALPLAYER").addEventListener('click', function() {
    window.playerheal = !window.playerheal;
    this.innerText = window.playerheal ? "Otomatik Can +" : "Otomatik Can -"
    this.className = window.playerheal ? "btn btn-red" : "btn btn-green"
})
getId2("HEALPET").addEventListener('click', function() {
    window.petheal = !window.petheal;
    this.innerText = window.petheal ? "Otomatik Pet Can'ı +" : "Otomatik Pet Can'ı -"
    this.className = window.petheal ? "btn btn-red" : "btn btn-green"
})
getId2("PETREVIVE").addEventListener('click', function() {
    window.autoRevivePets = !window.autoRevivePets;
    this.innerText = window.autoRevivePets ? "Otomatik Pet Canlandırma +" : "Otomatik Pet Canlandırma -"
    this.className = window.autoRevivePets ? "btn btn-red" : "btn btn-green"
})
getId2("AUTOBOMB").addEventListener('click', function() {
    window.autobomb = !window.autobomb;
    this.innerText = window.autobomb ? "Otomatik Bomba +" : "Otomatik Bomba -"
    this.className = window.autobomb ? "btn btn-green" : "btn btn-red"
})
getId2("AUTOSPEAR").addEventListener('click', function() {
    window.autospear = !window.autospear;
    this.innerText = window.autospear ? "Otomatik Kılıç +" : "Otomatik Kılıç -"
    this.className = window.autospear ? "btn btn-green" : "btn btn-red"
})
getId2("AUTOBOW").addEventListener('click', function() {
    window.bow = !window.bow;
    this.innerText = window.bow ? "Otomatik Ok Vuruşu +" : "Otomatik Ok Vuruşu -"
    this.className = window.bow ? "btn btn-green" : "btn btn-red"
})
getId2("SPACE").addEventListener('click', function() {
    window.space = !window.space;
    this.innerText = window.space ? "Otomatik Saldırı +" : "Otomatik Saldırı -"
    this.className = window.space ? "btn btn-green" : "btn btn-red"
})
getId2("RESPAWN").addEventListener('click', function() {
    window.respawn = !window.respawn;
    this.innerText = window.respawn ? "Otomatik Yeniden Doğma +" : "Otomatik Yeniden Doğma -"
    this.className = window.respawn ? "btn btn-red" : "btn btn-green"
})
setInterval(() => {
    if(window.autobomb){
        game.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: game.ui.components.MenuShop.shopItems.Bomb.itemTier+1});
        game.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: game.ui.components.MenuShop.shopItems.Bomb.itemTier});
        game.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: game.ui.components.MenuShop.shopItems.Bomb.itemTier});
    }
    if(window.autospear){
        game.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: game.ui.components.MenuShop.shopItems.Spear.itemTier+1});
        game.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: game.ui.components.MenuShop.shopItems.Spear.itemTier});
        game.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: game.ui.components.MenuShop.shopItems.Spear.itemTier});
    }
    if(window.space){
        game.network.sendInput({space: 0})
        game.network.sendInput({space: 1})
    }
    if(window.bow){
        game.network.sendInput({space: 0})
        game.network.sendInput({space: 1})
    }
    if(window.respawn){
        if(game.ui.playerTick.health <= 0){
            document.getElementsByClassName("hud-respawn-btn")[0].click();
        }
    }
})
//#Auto Run Stash By Serplent(Testing)
getId("dondurucu").addEventListener("click", FREEZE);
var TowerFreeze = null;
function FREEZE() {
  if (getId("dondurucu").innerText == "Base Dondurucu +") {
      getId("dondurucu").innerText = "Base Dondurucu -";
  } else {
      getId("dondurucu").innerText = "Base Dondurucu +";
  }
  if (TowerFreeze == null) {
    TowerFreeze = setInterval(function() {
      Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: window.dondurucukod
      });
      Game.currentGame.network.sendRpc({
        name: "LeaveParty"
      })
    }, 100);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}
let myPlayer = {};
let myPet = {};
window.petheal = true;
let petHealSet = 70;
let HealSet = 35;
Game.currentGame.ui._events.playerPetTickUpdate.push(pet => {
    if (window.autoRevivePets && pet.health <= 0) {
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
    if (window.petheal) {
        let petHealth = (pet.health / pet.maxHealth) * 100;
        if (petHealth <= petHealSet) {
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
});
game.ui._events.playerTickUpdate.push(player => {
    if (window.playerheal) {
        let playerHealth = (player.health / player.maxHealth) * 100;
        if (playerHealth <= HealSet) healPlayer();
    }
});
function healPlayer() {
    Game.currentGame.network.sendRpc({"name": "EquipItem", "itemName": "HealthPotion", "tier": 1})
    Game.currentGame.network.sendRpc({"name": "BuyItem", "itemName": "HealthPotion", "tier": 1})
}
game.renderer.ground.setVisible(true)
game.renderer.ground.setAlpha(0.60)
//#ZOOM Modified By Serplent
let dimension = 1;
const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}
onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}
window.recordBase = function (num) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Baseyi Kaydetmek İstediğine Eminmisin? Kayıtlı Bir Basen Varsa Silinecektir.", 1e4, function() {
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
        localStorage.setItem(num, baseStr)
    })
}

window.buildRecordedBase = function (num) {
    function BuildBase(design) {
        if (getGoldStash() === undefined) {
            game.ui.getComponent('PopupOverlay').showHint("Bunun İçin Gold Stash'a İhtiyacın Var.");
            throw new Error("Bunun İçin Gold Stash'a İhtiyacın Var.");
        }
        const towers = design.split(";");

        for (let towerStr of towers) {
            const tower = towerStr.split(",");

            if (tower[0] === "") continue;
            if (tower.length < 4) {
                throw new Error(`${JSON.stringify(tower)} bu tasarımın çoğaltılabilmesi için düzeltilmesi gereken bir sorun var.`);
                game.ui.getComponent('PopupOverlay').showHint("Kayıtlı Bir Basen Yok");
            }
            Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                type: towerCodes[parseInt(tower[0])],
                x: getGoldStash().x - parseInt(tower[1]),
                y: getGoldStash().y - parseInt(tower[2]),
                yaw: parseInt(tower[3])
            });
        }
    }
    BuildBase(localStorage.getItem(num));
}
window.deleteRecordedBase = function(num) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Baseyi Silmek İstediğine Eminmisin?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Base Başarıyla Silindi!");
        localStorage.setItem(num, null);
    })
}
//#Tekrarlanan Fonksiyonlar
Game.currentGame.network.addRpcHandler("SetPartyList", parties => {
    let serverPop = 0;
    for (let party of parties) {
        serverPop += party.memberCount;
    };
    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${serverPop}/32 <small>${game.network.connectionOptions.name}</small>`;
});
game.network.addRpcHandler("LocalBuilding", (data) => {
    for (let e of data) {
        if (!!e.dead) {
            for (let i of uniqueSellUid) {
                if (e.uid == i) {
                    uniqueSellUid.splice(uniqueSellUid.indexOf(i, 0), 1)
       }
     };
    }
  }
})

let sellUid = []
let uniqueSellUid = []
function sellAllByType(type) {
    for (let i of Object.values(game.ui.buildings)) {
        if (Object.values(i)[2] == type) {
            sellUid.push(Object.values(i)[4])
 }
}

  uniqueSellUid = [...new Set([...uniqueSellUid, ...sellUid])]
    sellUid = []
    let sellInterval = setInterval(() => {
        if (uniqueSellUid.length > 0 && game.ui.playerPartyCanSell) {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: parseInt(uniqueSellUid[Math.floor(Math.random() * uniqueSellUid.length)])
            })
        } else {
            clearInterval(sellInterval)
         }
  }, 50);
}

getElem("12i")[0].addEventListener('click', function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Tüm kuleleri silmek istediğinize emin misiniz?", 6000, function () {
        for (let i of Object.values(game.ui.buildings)) {
            if (Object.values(i)[2] != "GoldStash") {
                sellUid.push(Object.values(i)[4])
            }
        }
        uniqueSellUid = [...new Set([...uniqueSellUid, ...sellUid])]
        sellUid = []
        let sellInterval = setInterval(() => {
            if (uniqueSellUid.length > 0 && game.ui.playerPartyCanSell) {
                game.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: parseInt(uniqueSellUid[Math.floor(Math.random() * uniqueSellUid.length)])
                })
            } else {
                clearInterval(sellInterval)
            }
        });
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
window.walls = false
document.getElementsByClassName("5x5wall")[0].addEventListener('click', function() {
    window.walls = !window.walls;
    document.getElementsByClassName("5x5wall")[0].className = "btn btn-blue 5x5wall";
    document.getElementsByClassName("5x5wall")[0].innerText = "5x5 Duvarlar -";
    if (window.walls) {
        document.getElementsByClassName("5x5wall")[0].className = "btn btn-red 5x5wall";
        document.getElementsByClassName("5x5wall")[0].innerText = "5x5 Duvarlar +";
    }
})
document.getElementsByClassName("AHRC")[0].addEventListener('click', function() {
    window.ahrc = !window.ahrc;
    document.getElementsByClassName("AHRC")[0].className = "btn btn-blue AHRC";
    document.getElementsByClassName("AHRC")[0].innerText = "Otomatik Kazıcı -";
    if (window.ahrc) {
        document.getElementsByClassName("AHRC")[0].className = "btn btn-red AHRC";
        document.getElementsByClassName("AHRC")[0].innerText = "Otomatik Kazıcı +";
    }
})
document.getElementsByClassName("upall")[0].addEventListener('click', function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: obj.fromTick.uid
        })
    }
})
const dist = (a, b) => {
    return Math.sqrt( Math.pow((b.y-a.y), 2) + Math.pow((b.x-a.x), 2) );
};
window.nearestPlayer = () => {
    let playerPos = game.ui.playerTick.position;
    let ewoalp = [];
    for(let e of Object.entries(game.world.entities)){if((e[0] != game.world.myUid) && e[1].entityClass === "PlayerEntity") {ewoalp.push(e[1]);};};
    return ewoalp.map(e => {return {x: e.getPositionX(),y: e.getPositionY(),uid: e.uid }}).sort((a, b) => dist(a, playerPos) - dist(b, playerPos))[0];
};
setInterval(() => {
    if(window.move) {
        let np = window.nearestPlayer();
        window.moveTowards(np);
    };
});
window.moveTowards = pos => {
    let offset = 60;
    if (game.ui.playerTick.position.y-pos.y > offset || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < offset) {
        game.network.sendInput({down: 0})
    } else {
        game.network.sendInput({down: 1})
    }
    if (-game.ui.playerTick.position.y+pos.y > offset || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < offset) {
        game.network.sendInput({up: 0})
    } else {
        game.network.sendInput({up: 1})
    }
    if (-game.ui.playerTick.position.x+pos.x > offset || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < offset) {
        game.network.sendInput({left: 0})
    } else {
        game.network.sendInput({left: 1})
    }
    if (game.ui.playerTick.position.x-pos.x > offset || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < offset) {
        game.network.sendInput({right: 0})
    } else {
        game.network.sendInput({right: 1})
    }
};
const karışım = (obj1, obj2) => {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return Math.abs((xDif**2) + (yDif**2));
};
let harvester1 = new Set();
let harvester2 = new Set();
setInterval(() => {
    if (window.aim) {
        window.targets = [];
        let entities = game.renderer.npcs.attachments;
        for (let i in entities) {
            if (getId2('aimOptions').value == 'pl' ?
                (entities[i].fromTick.model == "GamePlayer" && entities[i].fromTick.uid !== game.ui.playerTick.uid && entities[i].targetTick.partyId !== game.ui.playerPartyId && entities[i].fromTick.dead == 0) :
                (entities[i].fromTick.model !== "GamePlayer" && entities[i].entityClass !== "Projectile" && entities[i].fromTick.model !== "NeutralTier1")) {
                window.targets.push(entities[i].fromTick);
            };
        };
        if (window.targets.length > 0) {
            const myPos = game.ui.playerTick.position;
            window.targets.sort((a, b) => {
                return karışım(myPos, a.position) - karışım(myPos, b.position);
            });
            const target = window.targets[0];
            let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
            game.inputPacketCreator.lastAnyYaw = reversedAim;
            game.network.sendPacket(3, {mouseMoved: reversedAim});
        }
    };
    if(window.ahrc) {
        for (let uid in game.world.entities) {
            const entity = game.world.entities[uid];
            if (entity.targetTick.model == "Harvester" && entity.targetTick.partyId == game.ui.playerPartyId) {
                if (harvester1.has(uid)) {
                    if (entity.fromTick.stone !== entity.targetTick.stone || entity.fromTick.wood !== entity.targetTick.wood) {
                        harvester2.add(uid);
                    };
                } else {
                    harvester1.add(uid);
                    game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: 0.69});
                };
            };
            if (harvester2.has(uid)) {
                let amount = entity.fromTick.tier * 0.05 - 0.02;
                game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: amount});
                game.network.sendRpc({name: "CollectHarvester", uid: parseInt(uid)});
            };
        };
    }
})
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
    if(data.name === "MakeBuilding" && data.type === "Wall" && window.walls) {
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
    };
    game.network.sendRpc2(data);
};
setInterval(() => {
    if (window.autobase) {
        if(getId2('tabanAyarlari').value == 'co') {
            window.cornerBase();
        }
    }
    if (window.autobase) {
        if(getId2('tabanAyarlari').value == 'sm') {
            window.smallBase();
        }
    }
    if (window.autobase) {
        if(getId2('tabanAyarlari').value == 'bg') {
            window.bigBase();
        }
    }
    if (window.autobase) {
        if(getId2('tabanAyarlari').value == 'bg2') {
            window.bigBase2();
        }
    }
    if (window.autobase) {
        if(getId2('tabanAyarlari').value == 'sc') {
            window.ScoreBase();
        }
    }
})

var towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];
getElem('basecode2')[0].addEventListener('click', function () {
    let buildings = Game.currentGame.ui.buildings;
    let base = "";
    let stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    var stashPosition = {
        x: stash.fromTick.position.x,
        y: stash.fromTick.position.y
    }
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }
        let obj = buildings[uid]
        let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
        let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
        let building = Game.currentGame.ui.buildings[obj.uid].type
        let yaw = 180;
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    }
    document.getElementsByClassName("tabankodu")[0].value = base;
})
function ggetGoldStash() {
    var entities = Game.currentGame.world.entities
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if (obj.fromTick.model == "GoldStash") {
            return obj
        }
    }
}

function PlaceBuilding(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
function deathrain(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
function Serplent(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
function GetGoldStash() {
    var entities = Game.currentGame.world.entities
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if (obj.fromTick.model == "GoldStash") {
            return obj
        }
    }
}
function small(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
window.smallBase = () => {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            small(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            small(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);
            small(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 0);
            small(stashPosition.x + -96, stashPosition.y + 96, 'GoldMine', 0);
            small(stashPosition.x + -96, stashPosition.y + 0, 'GoldMine', 0);
            small(stashPosition.x + 0, stashPosition.y + 96, 'GoldMine', 0);
            small(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 0);
            small(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            small(stashPosition.x + -96, stashPosition.y + 192, 'GoldMine', 0);
            small(stashPosition.x + 0, stashPosition.y + 192, 'BombTower', 0);
            small(stashPosition.x + 96, stashPosition.y + -96, 'BombTower', 0);
            small(stashPosition.x + -96, stashPosition.y + -96, 'BombTower', 0);
            clearInterval(waitForGoldStash)
        }
    }, 150)
}
//#CORNER BASE
let serplent = {}
serplent.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
let Auto = {}
Auto.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
Auto.PlaceBulding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
window.cornerBase = () => {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = serplent.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Serplent(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
            Serplent(stashPosition.x + 0, stashPosition.y + 96, 'ArrowTower', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 0, 'ArrowTower', 180);
            Serplent(stashPosition.x + 0, stashPosition.y + 192, 'ArrowTower', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 0, 'ArrowTower', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 192, 'GoldMine', 180);
            Serplent(stashPosition.x + 288, stashPosition.y + 288, 'GoldMine', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 288, 'GoldMine', 180);
            Serplent(stashPosition.x + 288, stashPosition.y + 192, 'GoldMine', 180);
            Serplent(stashPosition.x + 384, stashPosition.y + 384, 'GoldMine', 180);
            Serplent(stashPosition.x + 288, stashPosition.y + 0, 'CannonTower', 180);
            Serplent(stashPosition.x + 384, stashPosition.y + 0, 'CannonTower', 180);
            Serplent(stashPosition.x + 0, stashPosition.y + 288, 'CannonTower', 180);
            Serplent(stashPosition.x + 0, stashPosition.y + 384, 'CannonTower', 180);
            Serplent(stashPosition.x + 0, stashPosition.y + 480, 'MagicTower', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 576, 'MagicTower', 180);
            Serplent(stashPosition.x + 480, stashPosition.y + 0, 'MagicTower', 180);
            Serplent(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 180);
            Serplent(stashPosition.x + 576, stashPosition.y + 192, 'MagicTower', 180);
            Serplent(stashPosition.x + 384, stashPosition.y + 288, 'BombTower', 180);
            Serplent(stashPosition.x + 384, stashPosition.y + 192, 'BombTower', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 384, 'BombTower', 180);
            Serplent(stashPosition.x + 288, stashPosition.y + 384, 'BombTower', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 192, 'BombTower', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 96, 'BombTower', 180);
            Serplent(stashPosition.x + 336, stashPosition.y + 96, 'GoldMine', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 336, 'GoldMine', 180);
            Serplent(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 180);
            Serplent(stashPosition.x + 72, stashPosition.y + 264, 'Wall', 180);
            Serplent(stashPosition.x + 264, stashPosition.y + 120, 'Wall', 180);
            Serplent(stashPosition.x + 264, stashPosition.y + 72, 'Wall', 180);
            Serplent(stashPosition.x + 480, stashPosition.y + 192, 'CannonTower', 180);
            Serplent(stashPosition.x + 192, stashPosition.y + 480, 'CannonTower', 180);
            Serplent(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 180);
            Serplent(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 180);
            Serplent(stashPosition.x + 456, stashPosition.y + 264, 'Wall', 180);
            Serplent(stashPosition.x + 456, stashPosition.y + 312, 'Wall', 180);
            Serplent(stashPosition.x + 456, stashPosition.y + 360, 'Wall', 180);
            Serplent(stashPosition.x + 504, stashPosition.y + 312, 'Wall', 180);
            Serplent(stashPosition.x + 504, stashPosition.y + 264, 'Wall', 180);
            Serplent(stashPosition.x + 552, stashPosition.y + 264, 'Wall', 180);
            Serplent(stashPosition.x + 312, stashPosition.y + 456, 'Wall', 180);
            Serplent(stashPosition.x + 312, stashPosition.y + 504, 'Wall', 180);
            Serplent(stashPosition.x + 360, stashPosition.y + 456, 'Wall', 180);
            Serplent(stashPosition.x + 264, stashPosition.y + 552, 'Wall', 180);
            Serplent(stashPosition.x + 264, stashPosition.y + 504, 'Wall', 180);
            Serplent(stashPosition.x + 264, stashPosition.y + 456, 'Wall', 180);
            clearInterval(waitForGoldStash)
        }
    }, 150)
}
function GGetGoldStash() {
    var entities = Game.currentGame.world.entities
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if (obj.fromTick.model == "GoldStash") {
            return obj
        }
    }
}
function GETGOLDSTASH() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
window.bigBase2 = () => {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = GGetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -624, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -480, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            clearInterval(waitForGoldStash)
        }
    }, 150)
}
window.bigBase = () => {
        var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = ggetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -240, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            clearInterval(waitForGoldStash)
        };
    }, 100)
}
window.ScoreBase = function() {
        var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = ggetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + 48, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + 144, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + 48, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + 192, stashPosition.y + 96, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 288, stashPosition.y + 240, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 288, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 192, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 288, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 384, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 432, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 384, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 480, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 480, stashPosition.y + 432, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'BombTower', 0);
            PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 288, stashPosition.y + 336, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -576, stashPosition.y + 480, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -576, stashPosition.y + 384, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -576, stashPosition.y + 288, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -576, stashPosition.y + 192, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -672, stashPosition.y + 240, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -672, stashPosition.y + 336, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -672, stashPosition.y + 432, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -672, stashPosition.y + 528, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 96, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 96, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 672, stashPosition.y + 240, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 672, stashPosition.y + 336, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 672, stashPosition.y + 432, 'CannonTower', 0);
            PlaceBuilding(stashPosition.x + 576, stashPosition.y + 480, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -288, stashPosition.y + 528, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -384, stashPosition.y + 576, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 624, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -480, stashPosition.y + 528, 'ArrowTower', 0);
            PlaceBuilding(stashPosition.x + -576, stashPosition.y + 576, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -768, stashPosition.y + 288, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -768, stashPosition.y + 384, 'MagicTower', 0);
            PlaceBuilding(stashPosition.x + -744, stashPosition.y + 456, 'Wall', 0);
            PlaceBuilding(stashPosition.x + -744, stashPosition.y + 504, 'Wall', 0);
            PlaceBuilding(stashPosition.x + 648, stashPosition.y + 504, 'Wall', 0);
            PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Wall', 0);
            PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);
            PlaceBuilding(stashPosition.x + 744, stashPosition.y + 408, 'Door', 0);
            PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, 'Door', 0);
            PlaceBuilding(stashPosition.x + 744, stashPosition.y + 312, 'Door', 0);
            PlaceBuilding(stashPosition.x + 744, stashPosition.y + 264, 'Door', 0);
            PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Door', 0);
            PlaceBuilding(stashPosition.x + -408, stashPosition.y + 744, 'Door', 0);
            PlaceBuilding(stashPosition.x + -648, stashPosition.y + 600, 'Door', 0);
            PlaceBuilding(stashPosition.x + -600, stashPosition.y + 648, 'Door', 0);
            PlaceBuilding(stashPosition.x + -552, stashPosition.y + 696, 'Door', 0);
            PlaceBuilding(stashPosition.x + -504, stashPosition.y + 744, 'Door', 0);
            PlaceBuilding(stashPosition.x + -456, stashPosition.y + 744, 'Door', 0);
            PlaceBuilding(stashPosition.x + -456, stashPosition.y + 696, 'Door', 0);
            PlaceBuilding(stashPosition.x + -408, stashPosition.y + 696, 'Door', 0);
            PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Door', 0);
            PlaceBuilding(stashPosition.x + -504, stashPosition.y + 696, 'Door', 0);
            PlaceBuilding(stashPosition.x + -552, stashPosition.y + 648, 'Door', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 456, 'Wall', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, 'Wall', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 216, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 264, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 312, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + 24, stashPosition.y + 360, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -72, stashPosition.y + 504, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -120, stashPosition.y + 504, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -120, stashPosition.y + 552, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -168, stashPosition.y + 600, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -360, stashPosition.y + 744, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -312, stashPosition.y + 696, 'SlowTrap', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + -48, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + 96, stashPosition.y + -144, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + 240, stashPosition.y + 0, 'Harvester', 0);
            PlaceBuilding(stashPosition.x + -240, stashPosition.y + 0, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
}
var newcss = `
#newp{
color: white;
position: absolute;
font-weight: bold;
top: -20%;
left: 45%;
}
.background-bar{
width: 0%;
height: 100%;
transition: all 0.8s;
position: relative;
background-color: green;
border-radius: 6px;
z-index: -1;
bottom: 100%;
max-width: 100%;
min-width: 0%;
}
#healthanime{
animation: healthanime 0.5s ease-in-out infinite;
}
@keyframes healthanime{
 0%{
            opacity: 0.0;
         };
         5%{
           opacity: 0.1;
         };
         10%{
             opacity:  0.2;
         };
         15%{
            opacity: 0.3;
         };
         20%{
             opacity: 0.4;
         };
         25%{
             opacity: 0.5;
         };
         30%{
             opacity: 0.6;
         };
         35%{
             opacity: 0.7;
         };
         40%{
             opacity: 0.8;
         };
         45%{
             opacity: 0.9;
         };
         50%{
             opacity: 1.0;
         };
         55%{
             opacity: 0.9;
         };
         60%{
             opacity: 0.8;
         };
         65%{
             opacity: 0.7;
         };
         70%{
             opacity: 0.6;
         };
        75%{
             opacity: 0.5;
         };
         80%{
             opacity: 0.4;
         };
         85%{
             opacity: 0.3;
         };
         90%{
             opacity: 0.2;
         };
         95%{
             opacity: 0.1;
         };
         100%{
             opacity: 0.0;
         };
}
#healthanime2{
animation: healthanime 0.5s ease-in-out infinite;
}
#playerhb{
width: 70px;
height: 12px;
background-color: #2C3E50;
position: relative;
border-radius: 4px;
top: 56.8%;
left: 47.6%;
font-family:'Hammersmith One', sans-serif;
max-width: 70px;
min-width: 0px;
min-height: 0px;
max-height: 12px;
transition: all 0.4s;
}
.playersb{
 width: 70px;
height: 12px;
background-color: #2C3E50;
position: relative;
border-radius: 4px;
top: 56.8%;
left: 47.6%;
font-family:'Hammersmith One', sans-serif;
max-width: 70px;
min-width: 0px;
min-height: 0px;
max-height: 12px;
transition: all 0.4s;
transform: scale(0);
}
.playersbinner{
width: 100%;
height: 100%;
position:absolute;
font-family:'Hammersmith One', sans-serif;
border-radius: 4px;
background-color: #3498DB;
transition: all 0.2s;
z-index: 2;
max-width: 100%;
min-width:0%;
}
.playersbback{
background-color: #85C1E9;
width:0%;
height:100%;
position: absolute;
transition: all 0.6s;
z-index: 1;
border-radius: 20px;
max-width: 100%;
min-width: 0%;
}
.psbp{
font-size: 9px;
font-weight: bold;
position: absolute;
left: 29%;
top: -130%;
color: white;
z-index: 2;
}
#phbinner{
width: 0%;
height:100%;
position:absolute;
font-family:'Hammersmith One', sans-serif;
border-radius: 4px;
background-color: #2ECC71;
transition: all 0.2s;
z-index: 2;
max-width: 100%;
min-width:0%;
}
#newp2{
color: white;
font-weight: bold;
font-size: 9px;
position: absolute;
left: 53%;
top: -60%;
transform: translate(-50%,-50%);
z-index: 3;
}
#phbiback{
background-color: #82E0AA;
width:0%;
height:100%;
position: absolute;
transition: all 0.6s;
z-index: 1;
border-radius: 20px;
max-width: 100%;
min-width: 0%;
}
.phbinneranime{
animation: healthanime 0.5s ease-in-out infinite;
}
.phbibackanime{
animation: healthanime 0.5s ease-in-out infinite;
}
#pethp{
background-color: rgba(0, 0, 0, 0.4);
height: 35px;
top: 255px;
border: 4px solid rgba(0, 0, 0, 0.1);
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
position: relative;
padding: 5;
z-index: 10;
margin: none;
transition: all 0.3s;
transform: scale(0.0);
}
#petp {
font-family: 'Hammersmith One' , sans-serif;
position: absolute;
transform: translate(-50%, -50%);
top: -35%;
left: 58%;
bottom: 0%;
color: white;
font-weight: bold;
z-index: 2;
}
#pethpin {
background-color: #F39C12;
position: relative;
height: 100%;
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
transition: all 0.4s;
}
#pethp:after{
    display: block;
    content: 'PET HEALTH';
    position: absolute;
    top: 1px;
    left: 5px;
    bottom: 0px;
    line-height: 27px;
    font-size: 14px;
    color: #eee;
    text-shadow: 0 0 1px rgb(0 0 0 / 80%);
}
.expDiv{
    width: 18px;
    height: 166px;
    background-color: rgba(0,0,0,0.4);
    position: absolute;
    top: 700.4%;
    left: 98.6%;
    border: 4px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    z-index: 10;
    transition: left 0.4s, transform 0.8s,top 0.4s, height 0.4s;
}
.innerExpDiv{
    width: 100%;
    height: 100%;
    background-color: #F1C40F;
    position: absolute;
    bottom: 0%;
    border-radius: 3px;
    transition: all 0.4s;
}
.petLevel{
    position: absolute;
    top: -25.2%;
    left: 50%;
    transform: translateX(-50%);
    color: #F1C40F;
    font-size: 14px;
    z-index: 10;
    text-shadow: 0px 0px 20px #F1C40F;
    font-weight: bold;
    width: 20px;
    height: 20px;
    background-color: rgba(0,0,0,0.4);
    border-radius: 50%;
    text-align: center;
    transition: all 0.4s;
}

.bossHealthInPercent {
    position: absolute;
    top: -43%;
    left: 85.5%;
    font-family: 'Hammersmith One';
    font-size: 14px;
    font-weight: bold;
    color: white;
}
.bossHealthInNumbers {
    position: absolute;
    top: -43%;
    left: 2%;
    font-family: 'Hammersmith One';
    font-size: 14px;
    font-weight: bold;
    color: white;
 }
 .bossimagecircle {
    width: 50px;
    height: 50px;
    border: 3px dashed #ad0727;
    border-radius: 50%;
    transition: all 0.3s;
    background: rgba(0,0,0,0.8);
    position: absolute;
    top: 50%;
    left: -10.9%;
    transform: translateY(-50%) rotateZ(0deg);
    z-index: 10;
    animation: spinBorder 1s linear infinite;
}
@keyframes spinBorder {
    100% {
    transform: translateY(-50%) rotateZ(360deg)};
}
@keyframes spinOpposite {
    100% {
    transform: rotateZ(-360deg);
}
  }
.bossTier {
   position: absolute;
    font-size: 14px;
    color: white;
    font-family: 'Hammersmith One';
    font-weight: bold;
    top: -143%;
    left: 2.5%;
}
`;
(function () {
    var healthbar = document.getElementsByClassName('hud-health-bar-inner')[0],
        hud = document.getElementsByClassName('hud')[0],
        healthvarout = document.getElementsByClassName('hud-health-bar')[0],
        backgroundbar = document.createElement('div'),
        playerhb = document.createElement('div'),
        phbinner = document.createElement('div'),
        phbiback = document.createElement('div'),
        p = document.createElement('p'),
        p2 = document.createElement('p'),
        bottomhud = document.getElementsByClassName("hud-bottom-right")[0],
        pethpbar = document.createElement("div"),
        pethpbarinner = document.createElement("div"),
        pethpp = document.createElement("p"),
        playersb = document.createElement("div"),
        playersbback = document.getElementsByClassName("playersbback")[0],
        shield = document.getElementsByClassName("hud-shield-bar")[0];
    window.expDiv = document.createElement("div");
    window.expDivInner = document.createElement("div");
    window.petLevelp = document.createElement("p");
    expDiv.append(petLevelp);
    petLevelp.className = "petLevel";
    expDivInner.className = "innerExpDiv"
    expDiv.className = "expDiv";
    hud.append(expDiv);
    expDiv.append(expDivInner);
    backgroundbar.className = 'background-bar';
    healthbar.id = 'healthbar';
    healthbar.style.maxWidth = '100%';
    healthbar.style.minWidth = '0%';
    healthbar.style.transition = 'all 0.4s';
    p.id = 'newp';
    p2.id = 'newp2';
    healthbar.appendChild(p);
    healthvarout.appendChild(backgroundbar);
    hud.append(playerhb);
    playerhb.id = 'playerhb';
    phbiback.id = 'phbiback';
    playerhb.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    playersb.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    playerhb.appendChild(phbinner);
    phbinner.id = 'phbinner';
    playerhb.appendChild(p2);
    playerhb.appendChild(phbiback);
    pethpbar.style.width = healthbar.style.with;
    pethpbar.id = "pethp";
    pethpp.id = "petp";
    pethpbarinner.id = 'pethpin';
    pethpbar.appendChild(pethpp);
    pethpbar.appendChild(pethpbarinner);
    bottomhud.appendChild(pethpbar);
    function getShield(what) {
        if (game.world.inWorld == true) {
            switch (what) {
                case "Equiped":
                    if (game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.isVisible == true) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
                case "Health":
                    return game.ui.playerTick.zombieShieldHealth
                    break;
                case "MaxHealth":
                    return game.ui.playerTick.zombieShieldMaxHealth
                    break;
                case "Tier":
                    if (game.ui.inventory.ZombieShield == undefined) {
                        return 0
                    }
                    else { return game.ui.inventory.ZombieShield.tier }
                    break;
            }
        }
    }
    function getPetHealth() {
        if (game.world.entities[game.ui.playerPetUid] !== undefined) {
            return game.world.entities[game.ui.playerPetUid].targetTick.health;
        }
        else {
            return -1;
        }

    }

    function getPetXp() {
        if (game.world.entities[game.ui.playerPetUid] !== undefined) {
            return game.world.entities[game.ui.playerPetUid].targetTick.experience;
        }
        else {
            return -1;
        }

    }
    setInterval(function () {
        if (game.world.inWorld == true) {
            var phealth = Game.currentGame.world.localPlayer.entity.targetTick.health.toFixed(1);
            var shieldPercent = 100 - (getShield("MaxHealth") - getShield("Health")) / getShield("MaxHealth") * 100;
            document.getElementsByClassName("psbp")[0].innerText = shieldPercent.toFixed(1) + "%";
            document.getElementsByClassName("playersbinner")[0].style.width = shieldPercent.toFixed(1) + "%";
            if (getShield("Equiped") == true) {
                playersb.style.transform = "scale(0,1.0)";
                playersb.style.transform = "scale(1.0,1.0)";
                expDiv.style.height = "188px";
                petLevelp.style.top = "-21.5%";
            }
            else {
                playersb.style.transform = "scale(0.0)";
                expDiv.style.height = "166px";
                petLevelp.style.top = "-25.2%";
            };
            if (game.world.entities[game.ui.playerPetUid] !== undefined) {

                expDivInner.style.height = game.world.entities[game.ui.playerPetUid].currentModel.experienceBar.percent * 100 + "%";
                petLevelp.innerText = game.world.entities[game.ui.playerPetUid].currentModel.experienceBar.level;
            }
            window.one = healthbar.style.width.replaceAll('%', '');
            var fixed = phealth / 5;
            p.innerText = fixed.toFixed(1) + '%';
            p2.innerText = fixed.toFixed(1) + '%';
            phbinner.style.width = healthbar.style.width;
            game.world.entities[game.ui.playerTick.uid].currentModel.healthBar.backgroundNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.healthBar.barNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.barNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.backgroundNode.draw.visible = false;
            document.getElementsByClassName("hud-resources")[0].style.transition = 'all 0.3s';
            document.getElementsByClassName("hud-party-icons")[0].style.transition = 'all 0.3s';
            document.getElementsByClassName("hud-party-icons")[0].style.left = '-5px';
            document.getElementsByClassName("hud-health-bar")[0].style.transition = 'all 0.3s';
            shield.style.transition = 'all 0.4s';
            shield.style.transform = "scale(0.0)";
            document.getElementsByClassName("hud-shield-bar-inner")[0].style.transition = "all 0.4s";
            document.getElementsByClassName("hud-shield-bar-inner")[0].style.backgrounColor = "#3498DB";
            if (getShield("Equiped") == true) {
                shield.style.transform = "scale(1.0)";
            }
            else {
                shield.style.transform = "scale(0.0)";
            }
            if (one <= 20) {
                healthbar.style.backgroundColor = '#E74C3C';
                backgroundbar.style.backgroundColor = '#F1948A';
                healthbar.id = 'healthanime';
                backgroundbar.id = 'healthanime2';
                phbinner.className = 'phbinneranime';
                phbiback.className = 'phbibackanime';
                phbinner.style.backgroundColor = '#E74C3C';
                phbiback.style.backgroundColor = '#F1948A';
            }
            else {
                healthbar.id = 'noanime';
                backgroundbar.id = 'noanime';
                phbinner.className = 'noanime';
                phbiback.className = 'noanime';
                if (one <= 50) {
                    healthbar.style.backgroundColor = '#F39C12';
                    backgroundbar.style.backgroundColor = '#F8C471';
                    phbinner.style.backgroundColor = '#F39C12';
                    phbiback.style.backgroundColor = '#F8C471';

                }
                else {
                    if (one <= 80) {
                        healthbar.style.backgroundColor = '#F1C40F';
                        backgroundbar.style.backgroundColor = '#F7DC6F';
                        phbinner.style.backgroundColor = '#F1C40F';
                        phbiback.style.backgroundColor = '#F7DC6F';
                    }
                    else {
                        healthbar.style.backgroundColor = '#2ECC71';
                        backgroundbar.style.backgroundColor = '#82E0AA';
                        phbinner.style.backgroundColor = '#2ECC71';
                        phbiback.style.backgroundColor = '#82E0AA';
                    }
                }
            }
        }
    }, 225);
    setInterval(function () {
        backgroundbar.style.width = healthbar.style.width;
        phbiback.style.width = healthbar.style.width;

    }, 600);
    setInterval(function () {
        if (healthbar.style.width < '0%') {
            healthbar.style.width = '0%';
        };
    }, 1)


    setInterval(function () {
        if (window.screenTop && window.screenY) {
            playerhb.style.top = '55.6%';
            playersb.style.top = "55.5%";
            if (getShield("Equiped") == false) {
                expDiv.style.top = "77.5%";
            }
            else {
                expDiv.style.top = "74.4%";
            }
        }
        else {
            playerhb.style.top = '56.8%';
            playersb.style.top = "56.8%";
            if (getShield("Equiped") == false) {
                expDiv.style.top = "73.8%";
            }
            else {
                expDiv.style.top = "70.4%";
            }
        };

        var petuid = game.ui.playerPetUid;
        var entries = game.world.entities;
        if (game.world.inWorld == true && petuid !== undefined)
            if (entries[petuid] !== undefined || getPetHealth() > 0) {
                if (entries[petuid] !== undefined) {
                    if (entries[petuid].isInViewport() == true) {
                        if (getShield("Equiped") == false) {
                            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-resources")[0].style.bottom = '15px';
                            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '5px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '80px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
                        }
                        else {
                            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-resources")[0].style.bottom = '35px';
                            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '80px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
                        }
                        pethpbar.style.transform = "scale(1.0)";
                        var pethealth = entries[petuid].targetTick.health;
                        var maxpethealth = entries[petuid].targetTick.maxHealth;
                        var pettickhealth = game.world.entities[petuid].targetTick.health;
                        if (game.ui.playerPetUid !== undefined && pethealth > 0 || getPetHealth() < 0) {
                            var topercent = (maxpethealth - pethealth) / maxpethealth * 100.0,
                                percentage = 100 - topercent,
                                petfixed = percentage.toFixed(1);
                            pethpp.innerText = petfixed + "%";
                            pethpbarinner.style.width = petfixed + "%"
                        };
                    }
                }
            }
            else {
                pethpbar.style.transform = "scale(0.0)";
                if (getShield("Equiped") == false) {
                    document.getElementsByClassName("hud-health-bar")[0].style.bottom = '5px';
                }
                else {
                    document.getElementsByClassName("hud-health-bar")[0].style.bottom = '-5px';
                }
                document.getElementsByClassName("hud-resources")[0].style.bottom = '5px';
                document.getElementsByClassName("hud-party-icons")[0].style.bottom = '0px';
                document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '50px';
                document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
            }
        if (entries[petuid] !== undefined) {
            if (getPetHealth() > 0) {
                if (getPetXp() > 0) {
                    if (entries[petuid].isInViewport() == true) {
                        if (entries[petuid].targetTick.tier < 8) {
                            expDiv.style.left = "98.6%";
                            expDiv.style.transform = "scale(1)";
                        }
                    }
                }
            }
        }
        else {
            expDiv.style.left = "100.0%";
            expDiv.style.transform = "scale(0)";
        }
    }, 100);
    var styles = document.createElement('style');
    styles.appendChild(document.createTextNode(newcss));
    document.head.appendChild(styles);
    function FixShield() {
        if (game.ui.inventory.ZombieShield !== undefined) {
            if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
                Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier });
            }
        }
    }
    Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
    playersb.className = "playersb";
    hud.appendChild(playersb);
    playersb.innerHTML = `<div class="playersbinner" ></div><p class="psbp" >100.0%</p>`
    })();
//BossHealthBar took a long time!
window.bossHealthBarContainer = document.createElement("div");
bossHealthBarContainer.className = "bossHealthBarContainer";
document.getElementsByClassName("hud")[0].append(bossHealthBarContainer);
bossHealthBarContainer.setAttribute("style", `
  width: auto;
  height: auto;
  background-color: rgba(0,0,0,0.4);
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%,-50%);
  padding: 4px;
  transition: all 0.3s;
  z-index: 9;
`)
window.bossHealthBar = document.createElement("div");
bossHealthBar.className = "bossHealthBar";
bossHealthBarContainer.append(bossHealthBar);
bossHealthBar.setAttribute("style", `
  width: 400px;
  height: 0px;
  position: relative;
  top: 0%;
  left: 0%;
  background-color: rgba(0,0,0,0.4);
  border-radius: 2px;
  transition: all 0.3s;
`);

bossHealthBar.innerHTML = `<div class="bossimagecircle">
<div style="width: 100%; height: 100%; background-color: transparent; background-image: url('https://kenh68.net/wp-content/uploads/2019/02/hinh-nen-vu-tru-galaxy-13.jpg'); background-size: 50px 40px; background-position: 50% 90%; background-repeat: no-repeat; transition: all 0.3s; animation: spinOpposite 5s linear infinite; filter: brightness(1.1);" class="bossImage">
</div>

</div>
<div style="width: 100%; height: 100%; border-radius: 2px; transition: all 0.4s; background-color: #ad0727;" class="bossHealthBarInner">
  <p class="bossHealthInPercent">100.0%</p> <p class="bossHealthInNumbers">5000000/5000000</p>
  </div>
  <div class="numberOfBosses" style="color: #ad0727; position: absolute; top: -78%; left: -2%; font-family: 'Hammersmith One'; font-weight: bold; font-size: 80%; filter: brightness(1.7); text-align: center; z-index: 1; width: 16px; height: 16px; background-color: rgba(0,0,0,0.8); border-radius: 50%;">1</div>
  <p class="bossTier">SEVİYE 13</p>
  `;
window.bossImage = bossHealthBar.getElementsByClassName("bossImage")[0];
window.bossImageCircle = bossHealthBar.getElementsByClassName("bossimagecircle")[0];
window.numberOfBosses = bossHealthBar.getElementsByClassName("numberOfBosses")[0];
window.displayAllBossHealthBars = function (time) {
    setTimeout(() => {
        let bars = document.getElementsByClassName("bossHealthBar");
        for (var i = 0; i < bars.length; i++) {
            bars[i].style.height = "24px";
        }
    }, time)
};
displayAllBossHealthBars(500);
let spinTime = 5;
window.bossesInfo = [];
function checkIncludes(array, valueTo, property) {
    let checkArray = [];
    let timesMatched = 0;
    array.forEach(info => {
        if (info[property] == valueTo) {
            checkArray.push([info[property], "yes"]);
        }
        else {
            checkArray.push([info[property], "no"]);
        }
    })
    checkArray.forEach(check => {
        if (check[1] == "yes") {
            timesMatched++;
        }
    });
    return timesMatched == 0 && timesMatched > -1 ? false : true
}
window.zombiesActive = () => {
    let getZombies = false;
    for (let i in game.world.entities) {
        if (!game.world.entities[i].fromTick.model.includes("Neutral")) {
            if (game.world.entities[i].fromTick.model.toUpperCase().includes("BOSS")) {
                getZombies = true;
            }
        }
    }
    return getZombies;
};
window.partyMembers = 99999999999999;
var getBoss = setInterval(() => {
    var numberp = document.getElementsByClassName("bossHealthInNumbers")[0];
    var percentp = document.getElementsByClassName("bossHealthInPercent")[0];
    Object.entries(game.world.entities).forEach(entity => {
        var selected = entity[1];
        if (selected.targetTick.model.toUpperCase().includes("BOSS")) {
            bossesInfo.length < 1 ? bossesInfo.push({ health: selected.targetTick.health, maxHealth: selected.targetTick.maxHealth, uid: selected.targetTick.uid }) : undefined;
            for (let i = 0; i < bossesInfo.length; i++) {
                if (game.world.entities[bossesInfo[i].uid] !== undefined) {
                    bossesInfo[i].health = game.world.entities[bossesInfo[i].uid].targetTick.health;
                }
                else {
                    bossesInfo[i].health = 0;
                }
            }
            if (checkIncludes(bossesInfo, selected.targetTick.uid, "uid") == false) {
                bossesInfo.push({ health: selected.targetTick.health, maxHealth: selected.targetTick.maxHealth, uid: selected.targetTick.uid });
            }
            if (bossesInfo.length > 0) {
                window.calculatedAllBossHealth = bossesInfo.reduce((a, b) => { return a + b["health"] }, 0);
                window.calculatedAllBossMaxHealth = bossesInfo.reduce((a, b) => { return a + b["maxHealth"] }, 0);
                numberp.innerText = calculatedAllBossHealth.toFixed(0) + "/" + calculatedAllBossMaxHealth.toFixed(0);
                percentp.innerText = (100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) + "%";
                bossesInfo.length > 4 ? numberOfBosses.innerText = 4 : numberOfBosses.innerText = bossesInfo.length;
                bossHealthBar.getElementsByClassName("bossHealthBarInner")[0].style.width = (100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) + "%";
                window.tierArray = []
                Object.entries(game.world.entities).forEach(zombie => {
                    if (zombie[1].targetTick.model.toUpperCase().includes("ZOMBIE")) {
                        tierArray.push(zombie[1].targetTick.model.match(/[0-9]+/g).join(""))
                    }
                })
                window.repeated = [];
                window.object = {};
                for (let i of tierArray) {
                    if (object[i] !== undefined) {
                        object[i]++
                    }
                    else {
                        object[i] = 1;
                    }
                };
                Object.keys(object).map(function (property) { let repeatition = { repeated: object[property] }; repeated.push([property, repeatition]) });
                var max = [];
                for (let i in repeated) {
                    max.push(repeated[i][1].repeated);
                    if (repeated[i][1].repeated == Math.max(...max)) { bossHealthBar.getElementsByClassName("bossTier")[0].innerText = "SEVİYE" + " " + repeated[i][0] }
                }
            }
            else { numberp.innerText = 0; percentp.innerText = 0; }
            // console.log(selected.targetTick.model, "Health: " + selected.targetTick.health, "Max-Health: " + selected.targetTick.maxHealth);
        }
    }
                                               )
    let spinSpeed = spinTime;
    if (window.calculatedAllBossHealth) {
        var speedToSet = (((100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) / 100) * spinTime).toFixed(1);
        if (speedToSet > 0.1) {
            spinSpeed = speedToSet;
        }
        else {
            spinSpeed = 0.1
        }
    }
    else {
        spinSpeed = spinTime;
    }
    bossImageCircle.style.animation = "spinBorder " + spinSpeed + "s linear infinite";
    bossImage.style.animation = "spinOpposite " + spinSpeed + "s linear infinite";
}, 100)
var displayHealthBar = setInterval(() => {
    if (zombiesActive() == false) {
        bossHealthBarContainer.style.opacity = "0";
    }
    else {
        bossHealthBarContainer.style.opacity = "1";
    }
}, 25);
var inGame = false;
setInterval(() => {
    if (game.world.inWorld == true && inGame == false) {
        var timeLeft = 60;
        window.oldTime = game.ui.components.DayNightTicker.tickData.isDay
        var tellDay = setInterval(() => {
            setTimeout(() => {
                window.oldTime = game.ui.components.DayNightTicker.tickData.isDay;
            }, 50)
            window.time = game.ui.components.DayNightTicker.tickData.isDay;
            if (oldTime !== time) {
                // console.log(time == 0 ? "Night" : "Day");
                timeLeft = 60
            }
        }, 50)
        var decreamentInTimeLeft = setInterval(() => {
            if (timeLeft > 0.0) { timeLeft -= 0.1 };
            if (time == 1 && timeLeft.toFixed(1) == 30) {
                window.bossesInfo = [];
                // console.log("Resetting: bossesInfo...")
            }
            // console.log(timeLeft.toFixed(1) + "s");
        }, 100);
        inGame = true;
    }
}, 100)
