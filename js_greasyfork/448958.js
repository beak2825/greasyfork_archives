// ==UserScript==
// @name         ZOMBS.io Hack Fireball Mod X
// @namespace    -
// @version      BETA
// @description  Best Script Ever Working 2022
// @author       DarkResurgence
// @match        zombs.io
// @icon         https://cdn.discordapp.com/channel-icons/855622511553937429/c4ae7994d1bf46c69d63bd08ff302745.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448958/ZOMBSio%20Hack%20Fireball%20Mod%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/448958/ZOMBSio%20Hack%20Fireball%20Mod%20X.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color:#ffff00;
}
.btn-blue:hover .btn-blue:active {
background-color: #ffff00;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background:#ffff00;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp2 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: hsl(0, 100%, 30%)
color: #ffff00;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp2 h3 {
display: block;
margin: 0;
line-height: 30px;
}
.hud-menu-zipp2 .hud-zipp-grid2 {
background-color: rgba(28, 92, 65, 0.55); border: 5px solid white; overflow: scroll; display: block;"
display: block;
height: 440px;
padding: 15px;
margin-top: 20px;
 background: rgba(0, 0, 0, 0.6);
  color: #eee;
  border-radius: 4px;
  z-index: 15;
  overflow-y: auto;
  opacity: 0.75;
  background-size: cover;
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity2"]::before {
background-image: url("https://media.discordapp.net/attachments/838437616566796288/904966032425365514/sirromedit-removebg-preview.png");
}
.hud-menu-zipp2 .hud-the-tab {
position: relative;
height: 80px;
line-height: 80px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp2 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 15px;
background: rgba(81, 123, 91, 1);
color: rgba(81, 123, 91, 1);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp2 .hud-the-tab:hover {
background: rgba(81, 123, 91, 1)
color: #ffff00;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

// class changing
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity2");
spell.classList.add("hud-zipp2-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp2">
<br />
<div class="hud-zipp-grid2">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp2")[0];

//Onclick
document.getElementsByClassName("hud-zipp2-icon")[0].addEventListener("click", function() {
  if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
        _menu[0],
        _menu[1],
        _menu[2],
  _spell[0],
  _spell[1]
];

allIcon.forEach(function(elem) {
        elem.addEventListener("click", function() {
                if(zipz123.style.display == "block") {
                        zipz123.style.display = "none";
                };
        });
});


function disconnectPartyMembers(member = 1) {
    // tada
    if (game.ui.playerPartyMembers[1] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 15000);
    }
}

game.network.addRpcHandler("ReceiveChatMessage", e => {
   if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!dc party") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!dc") {
            game.network.socket.send([]);
        }
    }
})

localStorage.wsEnv = "wss://idealglisteningprocessors.thethe4.repl.co/";
localStorage.isxyzAllowed = "1";
localStorage.haspassword = "?1>system..error?<.><..>";
localStorage.hasAccess = "1";

window.hasAccessToLkey = true;
window._hasacctolkey = true;

/*** DEATHRAIN ***/
document.querySelectorAll('.ad-unit, .hud-intro-wrapper > h2, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 24px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;" /><Custom><b><font size="36">ReIgnited</Custom>`;
let igText = document.getElementsByTagName("font")[0];
igText.style.textTransform = "none";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-red hud-intro-play");
var Style1 = document.querySelectorAll('.hud-intro-name, .hud-intro-mai, .hud-intro-server, .hud-intro-play');for (let i = 0; i < Style1.length; i++) {
    Style1[i].style.border = "3px solid #66e8ff";
}
// Camenu Map
{var mapcontainer = document.createElement('div');
mapcontainer.id = "hud-mapcontainer";
document.querySelector('.hud-bottom-left')
    .append(mapcontainer);
document.querySelector("#hud-mapcontainer")
    .appendChild(document.querySelector("#hud-map"));
var mapcontainercss = document.querySelector("#hud-mapcontainer")
.style;
mapcontainercss.position = "relative";
mapcontainercss.top = "17px";
mapcontainercss.right = "17px";
mapcontainercss.margin = "0px";
mapcontainercss.width = "140px";
mapcontainercss.zIndex = "30";

document.querySelector(".hud-map")
    .style.border = "3px solid black";

var huddaynighttickerstyle = document.querySelector(".hud-day-night-ticker")
.style;
huddaynighttickerstyle.position = "relative";
huddaynighttickerstyle.top = "17px";
huddaynighttickerstyle.right = "20px";
huddaynighttickerstyle.margin = "3px";}
///=======================================/=======================================>

/*** EH ***/

window.lm = "Off";
window.alttype = "WebSocket";
window.follow = { toggle: false };
window.gopt = {};

let blueShadowCSS = `
.hud-menu-icons .hud-menu-icon::before {
    filter: drop-shadow(2px 2px 0px #FF4500) drop-shadow(-2px 2px 0px #FF4500) drop-shadow(2px -2px 0px #FF4500) drop-shadow(-2px -2px 0px #FF4500)
}`;
let blueShadowStyle = document.createElement('style');
blueShadowStyle.innerHTML = blueShadowCSS;
document.body.append(blueShadowStyle);

/*
const blurCanvas = () => {
    document.querySelector('canvas').style.filter = "blur(1.5px)";
};

const focusCanvas = () => {
    document.querySelector('canvas').style.filter = "none";
};

let menuOpen = false;

document.getElementsByClassName("hud-menu-icon")[2].addEventListener('click', function() {
    menuOpen = !menuOpen;
    if(menuOpen) {
        blurCanvas();
    } else {
        focusCanvas();
    };
});
*/

// sirr0m why do i have to comment the "blur game when you open the menu" code out it isn't very bad its only 1 and a half pixels of blur :(

(function(t, e) {
    let script = document.createElement("script")
    script.src = t
    document.body.appendChild(script)

    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = e
    document.head.appendChild(link) // append script tags to use noty
})("https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js", "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css")

let newYoutubers = [{
    name: "Xtreme", // retard raider
    channel: "https://www.youtube.com/channel/UCKS2BQZkU3mB0JvxQIVRlyA"
}, {
    name: "deathrain", // retard raider
    channel: "https://www.youtube.com/channel/UC4Wl5kskE-fXku2pynDEjXQ"
}, {
    name: "Apex", // retard raider
    channel: "https://www.youtube.com/channel/UCrVyJ-ivzuBDETc7y0MZf9A"
}, {
    name: "KG FALLEN", // kage
    channel: "https://www.youtube.com/channel/UCCKIceY9pJfr2vBw9f7IT1A"
}, {
    name: "ehScripts", // hackerman #1
    channel: "https://www.youtube.com/channel/UCICBX1kWvJUwxt_MlHZzdOA"
}, {
    name: "Sirr0m", // epic cat guy
    channel: "https://www.youtube.com/channel/UCo2tH8aOC_cLgxChDBtZdmA"
}, {
    name: "Peepo", // peepo!
    channel: "https://cdn.discordapp.com/emojis/801475958883614811.png?v=1"
}, {
    name: "The Trollers", // hackerman #2
    channel: "https://www.youtube.com/channel/UCiiwV0WmsCqF8sGHxfoGsfA"
}];

let youtuber = newYoutubers[Math.floor(Math.random() * newYoutubers.length)];
document.getElementsByClassName("hud-intro-youtuber")[0].innerHTML = `<h3>Featured YouTuber:</h3><a href="${youtuber.channel}" target="_blank">${youtuber.name}</a>`;

window.altNames = "";

let sm = document.querySelector("#hud-menu-settings");

sm.innerHTML = `
<style>
.hud-intro::before {
    background-image: url('https://cdnb.artstation.com/p/assets/images/images/019/342/177/large/kalina-stoicheva-8.jpg?1563060368');
    background-size: cover;
}
.hud-intro-name, .hud-intro-server {
  border: 3px solid rgba(255, 136, 0, 0.8);
}
.btn-red, .btn-red {
    margin-top: 3px;
    margin-left: 3px;
}
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(255, 30, 0, 0.8);
	border-radius: 10px;
	background-color: rgba(255, 136, 0, 0.8);
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: rgba(255, 136, 0, 0.8);
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(255, 30, 0, 0.8);
	background-color: rgba(255, 136, 0, 0.8);
}
.tab {
    border-top-left-radius: 35%;
    border-top-right-radius: 35%;
    background-color: rgba(255, 136, 0, 0.8);
    background-image: linear-gradient(to bottom right, rgba(255, 30, 0, 0.8), rgba(242, 47, 82, 0.8));
    width: 150px;
    height: 50px;
    border: 4px solid rgba(255, 136, 0, 0.8);
    display: inline-block;
    text-align: center;
    color: black;
}
#addtab {
    background-color: ;
    margin-left: 175px;
    margin-top: -40px;
}
.rmtab {
    background-color: rgba(255, 136, 0, 0.8);
    background-image: linear-gradient(to bottom right, rgba(255, 30, 0, 0.8), rgba(242, 47, 82, 0.8));
    border-color: rgba(0,0,0);
    background-image: linear-gradient(to bottom right, rgba(255, 30, 0, 0.8), rgba(242, 47, 82, 0.8));
    font-weight: bold;
}
.btn-fixed {
    display: inline-block;
    height: 25px;
    line-height: 25px;
    padding: 0 12px;
    background: rgba(255, 136, 0, 0.8);
    color: rgba(255, 136, 0, 0.8);
    border: 0;
    font-size: 14px;
    vertical-align: top;
    text-align: center;
    text-decoration: none;
    text-shadow: 0 1px 0 rgba(255, 30, 0, 0.8);
    box-shadow: 0 2px 10px rgba(255, 30, 0, 0.8);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
}
.search-bar {
	background-color: rgba(255, 136, 0, 0.8);
	background-image: linear-gradient(to bottom right, rgba(255, 30, 0, 0.8), rgba(242, 47, 82, 0.8));
    outline: none;
    border: 2px solid rgba(255, 136, 0, 0.8);
    border-radius: 5px;
    color: white;
    text-shadow: 1.5px 1.5px 1px rgba(255, 136, 0, 0.8);
    font-size: 16px;
    vertical-align: middle;
}
::placeholder {
  color: white;
  text-shadow: 1.5px 1.5px 1px rgba(255, 136, 0, 0.8);
}
* {
   font-family: Hammersmith One;
}
#searchpgs {
    width: 80%;
    height: 25px;
}
.btn-curve-right {
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
}
.btn-curve-left {
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
}
</style>
<style>
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
  background-color: rgba(255, 136, 0, 0.8);
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
  background-color: rgba(255, 136, 0, 0.8);
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgba(0,0,0);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgba(255, 136, 0, 0.8);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
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
</div>
`;

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
    <a href="https://discord.gg/q3J2Y7fbR2" target="_blank" style="float: right;"><button class="btn btn-facebook"><i class="fab fa-discord fa-lg"></i></button></a>
    <button class="btn btn-gold" style="float:right;" onclick="window.redirectTab('Accounts', 'acc')"><i class="fa fa-user fa-lg"></i></button>
    <h1>ReIgnited</h1>
    <p>Developer: <strong>ehScripts#8517</strong></p>
    <p>Co-Developer: <strong>The Trollers</strong></p>
    <hr />
    <h2>Categories</h3>
    <button class="btn btn-red" onclick="window.redirectTab('Score', 'score')">Score</button>
    <button class="btn btn-red" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    <button class="btn btn-red" onclick="window.redirectTab('Raid', 'raid')">Raid</button>
    <button class="btn btn-red" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    <button class="btn btn-red" onclick="window.redirectTab('Shortcuts', 'shortcuts')">Shortcuts</button>
    <button class="btn btn-red" onclick="window.redirectTab('Miscellaneous', 'misc')">Misc.</button>
    `,
    keywords: [],
    visited: 0
}, {
    type: "score",
    html: `
    <h1>Score</h1>
    <hr />
    <button class="btn btn-grey" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Stats', 'sts')">Stats</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Auto Revive', 'arp')">Auto Revive</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Pet Heal', 'petheal')">Pet Heal</button>
    <button class="btn btn-grey" onclick="window.redirectTab('AFS', 'afs')">AFS</button>
    `,
    keywords: ["score", "wr", "4player", "4p", "trick", "base"],
    name: "Score",
    category: true,
    visited: 0
}, {
    type: "alts",
    html: `
    <h1>Alts</h1>
    <div id="alttype" style="display:inline-block;"></div><button class="btn btn-grey" onclick="window.sendWs();" style="display:inline-block;margin-top: 4px;margin-left:10px;">Send Alt</button>
    <br /><br />
    <input type="text" maxlength="29" placeholder="Alt Name" id="BotName" class="btn-fixed search-bar" style="height: 35px;" />
    <select id="slctbnv">
    </select>
    <button class="btn btn-grey" id="ALTname">Set Name</button>
    <h1 id="nfnlt"># of alts: //nlt, current alt ID: //si</h1>
    <label>Remove Alt: </label><input type="text" id="inprm" class="btn-fixed search-bar" placeholder="Alt ID" style="height: 40px;" />
    <button id="rmaltbtn" class="btn btn-grey">Remove Alt</button>
    <br />
    <strong style="color: red; display: none;" id="noiderr"><i class="fa fa-times-circle"></i> Sorry, there is no alt with that ID.</strong>
    <br />
    <button class="btn btn-red" onclick="window.rmw();"><i class="fa fa-trash"></i> Remove WebSockets</button>
    <button class="btn btn-red" onclick="window.rmi();"><i class="fa fa-trash"></i> Remove iFrames</button>
    <button class="btn btn-red" onclick="window.rma();"><i class="fa fa-trash"></i> Remove All</button>
    <hr />
    <button class="btn btn-grey" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button><button class="btn btn-grey" onclick="window.redirectTab('L Key', 'lkey')">L Key</button><button class="btn btn-grey" onclick="window.redirectTab('AITO', 'aito')">AITO</button>
    `,
    keywords: ["alt", "bot", "4p", "trick", "fill", "clone"],
    name: "Alts",
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
    game.options.nickname = bnv;
    window.altNames += '<br><option value="' + bnv + '">' + bnv + '</option>';
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt, si: window.si });
};
let inprm = document.getElementById("inprm");
let rmaltbtn = document.getElementById("rmaltbtn");
rmaltbtn.onclick = () => {
    window.rmAlt(parseInt(inprm.value) - 1);
};
window.ats = new window.BS([{
    name: "WebSocket",
    color: "grey",
    onselect: () => { window.alttype = "WebSocket"; }
}, {
    name: "iFrame",
    color: "red",
    onselect: () => { window.alttype = "iFrame"; }
}]);
window.ats.select(window.alttype);
document.getElementById("alttype").append(ats.elem);
    `,
    visited: 0
}, {
    type: "raid",
    html: `
    <h1>Raid</h1>
    <hr />
    <button class="btn btn-grey" onclick="window.redirectTab('L Key', 'lkey')">L Key</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Entity Follower', 'ef')">Entity Follower</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Auto Respawn', 're')">Auto Respawn</button>
    `,
    keywords: ["raid", "kill", "offense", "offend", "destroy", "destruct", "lkey", "l key"],
    name: "Raid",
    category: true,
    visited: 0
}, {
    type: "waves",
    html: `
    <h1>Waves</h1>
    <hr />
    <button class="btn btn-grey" onclick="window.redirectTab('AITO', 'aito')">AITO</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Auto ReBuilder', 'rebuilder')">Auto ReBuilder</button>
    <button class="btn btn-grey" onclick="window.redirectTab('3x3 Walls', 'x3w')">3x3 Walls</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Alarms', 'alarms')">Alarms</button>
    `,
    keywords: ["defense", "defend", "anti", "rebuild", "re build", "auto rebuild", "autorebuild", "auto", "shield", "fixed shield", "fixedshield", "afs", "arp", "revive", "pet", "protec", "wave"],
    name: "Waves",
    category: true,
    visited: 0
}, {
    type: "playertrick",
    html: `
    <h1>Player Trick</h2>
    <button class="btn" id="tglpt"></button>
    <p><strong><i class="fa fa-info-circle"></i> Will apply to the current alts, not send them</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-grey" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    <button class="btn btn-red" onclick="window.redirectTab('Score', 'score')">Score</button>
    `,
    script: `
    let tglpt = document.getElementById("tglpt");

    if(window.playerTrickToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "Disable Player Trick"
    } else {
        tglpt.classList.add("btn-grey");
        tglpt.innerText = "Enable Player Trick"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-grey")) {
            this.classList.replace("btn-grey", "btn-red");
            this.innerText = "Disable Player Trick";
        } else {
            this.classList.replace("btn-red", "btn-grey");
            this.innerText = "Enable Player Trick";
        };
        window.togglePlayerTrick();
    });
    `,
    keywords: ["4p", "4player", "trick", "score", "wr", "bot", "alt", "4 player"],
    name: "Player Trick",
    category: false,
    visited: 0
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
    <button class="btn btn-red" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    script: `
    let tglpt = document.getElementById("afstgl");

    if(window.afsToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "Disable AFS"
    } else {
        tglpt.classList.add("btn-grey");
        tglpt.innerText = "Enable AFS"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-grey")) {
            this.classList.replace("btn-grey", "btn-red");
            this.innerText = "Disable AFS";
        } else {
            this.classList.replace("btn-red", "btn-grey");
            this.innerText = "Enable AFS";
        };
        window.toggleAFS();
    });
    `,
    keywords: ["afs", "defense", "shield", "fix", "protec", "wave"],
    name: "AFS",
    category: false,
    visited: 0
}, {
    type: "arp",
    html: `
    <h1>Auto Revive</h1>
    <button id="arptgl" class="btn"></button>
    <p><strong><i class="fa fa-exclamation-circle"></i> May create lag</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-grey" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    script: `
    let arptgl = document.getElementById("arptgl");

    if(window.autoRevivePets) {
        arptgl.classList.add("btn-red");
        arptgl.innerText = "Disable Revive"
    } else {
        arptgl.classList.add("btn-grey");
        arptgl.innerText = "Enable Revive"
    };

    arptgl.addEventListener("click", function() {
        if(this.classList.contains("btn-grey")) {
            this.classList.replace("btn-grey", "btn-red");
            this.innerText = "Disable Revive";
        } else {
            this.classList.replace("btn-red", "btn-grey");
            this.innerText = "Enable Revive";
        };
        window.toggleARP();
    });
    `,
    name: "Auto Revive",
    keywords: ["arp", "revive", "pet", "defense", "protec", "wave", "score"],
    category: false,
    visited: 0
}, {
    type: "misc",
    html: `
    <h1>Miscellaneous</h1>
    <hr />
    <button class="btn btn-grey" onclick="window.redirectTab('Markers', 'markers')">Markers</button>
    <button class="btn btn-grey" onclick="window.redirectTab('Game Options', 'gopt')">Game Options</button>
    <button class="btn btn-grey" onclick="window.redirectTab('AHRC', 'ahrc')">AHRC</button>
    `,
    name: "Miscellaneous",
    keywords: ["misc", "zoom", "marker", "game", "option", "ahrc", "harvest", "auto", "collect", "farm", "mats", "resources"],
    category: true,
    visited: 0
}, {
    type: "sts",
    html: `
    <h1>Stats</h1>
    <h2><i class="fa fa-chart-bar"></i> Score</h2>
    <p id="aspw"></p>
    <div id="scoreGraph">
    </div>
    <br />
    <button class="btn btn-grey" onclick="window.refreshStats();">Refresh</button>
    `,
    name: "Stats",
    keywords: ["score", "stat", "analytic"],
    script: `
    let aspw = document.getElementById("aspw");
    aspw.innerText = 'Average SPW: ' + window.avgspw;
    document.getElementById("scoreGraph").append(window.ScoreStats.dom);
    `,
    category: false,
    visited: 0
}, {
    type: "aito",
    html: `
    <h1>AITO</h1>
    <p><i class="fa fa-info-circle"></i><strong> Will create a new alt for timeouting, not apply on the current alts.</strong></p>
    <button class="btn" id="aitotgl"></button>
    <p><strong><i class="fa fa-keyboard"></i> Keybind: SHIFT + ]</strong></p>
    <p><strong><i class="fa fa-code"></i> Command to toggle: !aito</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-grey" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    name: "AITO",
    script: `
    let aitotgl = document.getElementById("aitotgl");
    const toggleAito = (ed = false) => {
        if(ed) { window.startaito = !window.startaito; window.sendAitoAlt(); };
        if(window.startaito) { aitotgl.classList.remove("btn-grey"); aitotgl.classList.add("btn-red");  aitotgl.innerText = "Disable AITO"; } else { aitotgl.classList.add("btn-grey"); aitotgl.classList.remove("btn-red"); aitotgl.innerText = "Enable AITO"; };
    };
    toggleAito();
    aitotgl.addEventListener("click", function() {
        toggleAito(true);
    });
    addEventListener('toggleAitoFromChatCommand', function() {
        toggleAito();
    });
    addEventListener('aitoToggleFromKeybind', function() {
        toggleAito();
    });
    `,
    keywords: ["aito", "defense", "defend", "timeout", "infinit", "wave"],
    category: false,
    visited: 0
}, {
    type: "lkey",
    html: `
    <h1>L Key</h1>
    <p><i class="fa fa-info-circle"></i><strong> Will create a 2 new alts for raiding, not apply on the current alts.</strong></p>
    <button id="ltgl" class="btn"></button>
    <div>
    <h2 style="display:inline-block;">Automatic Swings:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.lksa = !window.lksa;">
        <span class="slider round"></span>
    </label>
    </h2>
    </div>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-grey" onclick="window.redirectTab('Raid', 'raid')">Raid</button>
    `,
    name: "L Key",
    script: `
    let ltgl = document.getElementById("ltgl");
    const toggleL = (ed = false) => {
        if((typeof ed === "boolean") && ed) { window.FKey = !window.FKey; window.LKeyWithTimeouts(); };
        if(window.FKey) { ltgl.classList.remove("btn-grey"); ltgl.classList.add("btn-red"); ltgl.innerText = "Disable L Key"; } else { ltgl.classList.add("btn-grey"); ltgl.classList.remove("btn-red"); ltgl.innerText = "Enable L Key"; };
    };
    toggleL();
    ltgl.addEventListener('click', function() {
        toggleL(true);
    });
    addEventListener('LKeyToggleFromChatCommand', toggleL);
    `,
    keywords: ["l key", "lkey", "raid", "offense", "offend", "destroy", "destruct"],
    category: false,
    visited: 0
}, {
    type: "rebuilder",
    html: `
    <h1>Auto ReBuilder</h1>
    <p><strong><i class="fa fa-info-circle"></i> Enabling Auto ReBuilder will save the base and also enable automatic upgrades, so that every tower is upgraded to the maximum tier</strong></p>
    <button class="btn" id="rebuildertgl"></button>
    <p><strong><i class="fa fa-keyboard"></i> Keybind: SHIFT + \x5c</strong></p>
    <p><strong><i class="fa fa-code"></i> Command: !rb</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-grey" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    name: "Auto ReBuilder",
    script: `
    let rebuildertgl = document.getElementById("rebuildertgl");
    let chk = () => {
        if(window.getRebuilderToggle()) {
            rebuildertgl.classList.remove("btn-grey");
            rebuildertgl.classList.add("btn-red");
            rebuildertgl.innerText = "Disable ReBuilder";
        } else {
            rebuildertgl.classList.remove("btn-red");
            rebuildertgl.classList.add("btn-grey");
            rebuildertgl.innerText = "Enable ReBuilder";
        };
    };
    chk();
    addEventListener("rebuilderToggleFromKeybind", function(e) {
        chk();
    });
    addEventListener("rebuilderToggleFromChatCommand", function(e) {
        chk();
    });
    rebuildertgl.addEventListener('click', function() {
        window.toggleRebuilder();
        chk();
    });
    `,
    keywords: ["defense", "defend", "build", "base", "repair", "antiraid", "anti raid", "wave"],
    visited: 0
}, {
    type: "shortcuts",
    html: `
    <h1>Shortcuts</h1>
    <h2><i class="fa fa-code"></i> Commands</h2>
    <p><i class="fa fa-info-circle"></i><strong> These commands are case-sensitive.</strong></p>
    <ul>
    <li><strong>( !aito )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('AITO', 'aito')">AITO</a></li>
    <li><strong>( !L )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('L Key', 'lkey')">L Key</a></li>
    <li><strong>( !rb )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Auto ReBuilder', 'rebuilder')">Auto ReBuilder</a></li>
    <li><strong>( !mark )</strong> - Adds <a href="javascript:void(0)" onclick="window.redirectTab('Markers', 'markers')">Markers</a></li>
    </ul>
    <hr />
    <h2><i class="fa fa-keyboard"></i> Keybinds</h2>
    <ul>
    <li><strong>( SHIFT + \x5c )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Auto ReBuilder', 'rebuilder')">Auto ReBuilder</a></li>
    <li><strong>( SHIFT + } )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('AITO', 'aito')">AITO</a></li>
    <li><strong>( SHIFT + F )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Pet Heal', 'aito')">Pet Heal</a></li>
    <li><strong>( SHIFT + \` )</strong> - Adds a <a href="javascript:void(0)" onclick="window.redirectTab('Markers', 'markers')">Marker</a></li>
    <li><strong>( Z )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('3x3 Walls', 'x3w')">3x3 Walls</a></li>
    <li><strong>( X )</strong> - Toggles 5x5 Walls</li>
    <li><strong>( C )</strong> - Toggles 7x7 Walls</li>
    <li><strong>( - )</strong> - Toggles RSS Above Head</li>
    <li><strong>( SHIFT + P )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Entity Follower', 'ef')">Nearest Player Follower</a></li>
    </ul>
    `,
    name: "Shortcuts",
    keywords: ["cmd", "command", "key", "bind", "short"],
    category: true,
    visited: 0
}, {
    type: "markers",
    html: `
    <h1>Markers</h1>
    <p><i class="fa fa-info-circle"></i><strong> Adds a small marker on the minimap that you can use to save different locations in-game.</strong></p>
    <p><strong><i class="fa fa-code"></i> Command: !mark</strong></p>
    <p><strong><i class="fa fa-keyboard"></i> Keybind: SHIFT + \`</strong></p>
    <button class="btn btn-grey" onclick="window.addMarker();">Add Marker</button>
    <br />
    <label>Remove Marker: </label><input type="text" id="inmrk" class="btn-fixed search-bar" placeholder="Marker #" style="height: 40px;" />
    <button id="rmmrkbtn" class="btn btn-grey">Remove Marker</button>
    <br />
    <strong style="color: red; display: none;" id="nomrkerr"><i class="fa fa-times-circle"></i> Sorry, that marker does not exist.</strong>
    <hr />
    <button class="btn btn-red" onclick="window.rmAllMarkers();"><i class="fa fa-trash"></i> Remove All</button>
    `,
    name: "Markers",
    script: `
    document.getElementById("rmmrkbtn").addEventListener('click', function() {
        window.rmMarker(document.getElementById("inmrk").value);
    });
    `,
    keywords: ["mark", "location", "save", "indicat", "map"],
    category: false,
    visited: 0
}, {
    type: "gopt",
    html: `
    <h1>Game Options</h1>
    <div>
    <h2 style="display:inline-block;">Debug:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="this.checked && game.debug.show(); !this.checked && game.debug.hide(); window.gopt.dbg = this.checked;" id="dbg">
        <span class="slider round"></span>
    </label>
    </h2>
    <br />
    <h2 style="display:inline-block;">Screenshot Mode:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.ssMode(); window.gopt.ssm = this.checked;" id="ssm">
        <span class="slider round"></span>
    </label>
    </h2>
    <br />
    <h2 style="display:inline-block;">Zoom on Scroll:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.toggleZoS(); window.gopt.zos = this.checked;" id="zos">
        <span class="slider round"></span>
    </label>
    </h2>
    <br />
    <h2 style="display:inline-block;">Your Name Color:</h2>
    <input type="color" id="ync" onchange="window.customColor(); window.gopt.ync = this.value;" />
    <br />
    <h2 style="display:inline-block;">Always Day Brightness:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.toggleAllDay(); window.gopt.tad = this.value;" id="tad">
        <span class="slider round"></span>
    </label>
    </h2>
    <br />
    <h2 style="display:inline-block;">Exact Resource Counter:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.frss = !window.frss; window.gopt.frss = this.value;" id="frc">
        <span class="slider round"></span>
    </label>
    </h2>
    <br />
    <h2 style="display:inline-block;">Disable Chat:
    <label class="switch" class="display:inline-block;">
        <input type="checkbox" style="margin-bottom:25px;" onchange="window.toggleChat(); window.gopt.cdt = this.value;" id="cdt">
        <span class="slider round"></span>
    </label>
    </h2>
    </div>
    `,
    name: "Game Options",
    script: `
    document.getElementById("dbg").checked = !!game.debug.visible;
    document.getElementById("ssm").checked = !!window.ssModeToggle;
    document.getElementById("zos").checked = !!window.zoomonscroll;
    window.yncv ? document.getElementById("ync").value = window.yncv : false;
    let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
    document.getElementById("tad").checked = (hno.style.display === "none");
    document.getElementById("frc").checked = !!window.frss;
    document.getElementById("cdt").checked = !!window.chatDisabled;

    `,
    keywords: ["option", "game"],
    category: false,
    visited: 0
}, {
    type: "x3w",
    html: `
    <h1>3x3 Walls</h1>
    <button id="xtgl" class="btn"></button>
    `,
    name: "3x3 Walls",
    script: `
    let xtgl = document.getElementById("xtgl");
    const toggle3x3Walls = (ed = false) => {
        if(ed) { window.x3builds = !window.x3builds };
        if(window.x3builds) { xtgl.classList.add("btn-red"); xtgl.classList.remove("btn-grey"); xtgl.innerText = "Disable 3x3 Walls" } else { xtgl.classList.add("btn-grey"); xtgl.classList.remove("btn-red"); xtgl.innerText = "Enable 3x3 Walls"; };
    };
    toggle3x3Walls();
    xtgl.addEventListener("click", function() {
        toggle3x3Walls(true);
        window.noty3x();
    });
    `,
    keywords: ["3x", "wall", "3 x", "three", "tri", "wave", "base", "build", "protec", "defend", "defense"],
    category: false,
    visited: 0
}, {
    type: "ahrc",
    html: `
    <h1>AHRC</h1>
    <button id="atgl" class="btn"></button>
    `,
    name: "AHRC",
    script: `
    let atgl = document.getElementById("atgl");
    const toggleAHRC = (ed = false) => {
        if(ed) { window.AHRC = !window.AHRC };
        if(window.AHRC) { atgl.classList.add("btn-red"); atgl.classList.remove("btn-grey"); atgl.innerText = "Disable AHRC" } else { atgl.classList.add("btn-grey"); atgl.classList.remove("btn-red"); atgl.innerText = "Enable AHRC"; };
    };
    toggleAHRC();
    atgl.addEventListener("click", function() {
        toggleAHRC(true);
    });
    `,
    keywords: ["ahrc", "collect", "farm", "mats", "resources", "harvest", "auto"],
    category: false,
    visited: 0
}, {
    type: "petheal",
    html: `
    <h1>Pet Heal</h1>
    <button id="phtgl" class="btn"></button>
    `,
    name: "Pet Heal",
    script: `
    let phtgl = document.getElementById("phtgl");
    const togglePH = (ed = false) => {
        if(ed) { window.petheal = !window.petheal; };
        if(window.petheal) { phtgl.classList.add("btn-red"); phtgl.classList.remove("btn-grey"); phtgl.innerText = "Disable Pet Heal" } else { phtgl.classList.add("btn-grey"); phtgl.classList.remove("btn-red"); phtgl.innerText = "Enable Pet Heal"; };
    };
    togglePH();
    phtgl.addEventListener("click", function() {
        togglePH(true);
    });
    `,
    keywords: ["auto", "defense", "pet", "heal", "score", "defend", "waves", "score"],
    category: false,
    visited: 0
}, {
    type: "alarms",
    html: `
    <h1>Alarms</h1>
<button class="btn btn-grey alarm" onclick="alarm();">Enable Tower Destroy Alarm</button>
<br>
<button class="btn btn-grey stashHitAlarm" onclick="stashHitAlarm();">Enable Stash Damage Alarm</button>
<br>
<button class="btn btn-grey deadAlarm" onclick="deadAlarm();">Enable Player Death Alarm</button>
<br>
<button class="btn btn-grey disconnectAlarm" onclick="disconnectAlarm();">Enable Disconnect Alarm</button>
<br>
<button class="btn btn-grey health65pAlarm" onclick="health65pAlarm();">Enable 65% Player Health Alarm</button>
<br>
<button class="btn btn-grey pingAlarm" onclick="pingAlarm();">Enable >2k Ping Alarm</button>
<br>
<button class="btn btn-grey tower65pAlarm" onclick="tower65pAlarm();">Enable <65% Tower Health Alarm</button>
    `,
    name: "Alarms",
    script: `
    let normAlarm = document.getElementsByClassName("alarm")[0];
    if(isOnOrNot) { normAlarm.classList.replace("btn-grey", "btn-red"); normAlarm.innerText = "Disable Tower Destroy Alarm" };
    let shAlarm = document.getElementsByClassName("stashHitAlarm")[0];
    if(stashhitalarm) { shAlarm.classList.replace("btn-grey", "btn-red"); shAlarm.innerText = "Disable Stash Damage Alarm" };
    let deadAlarm = document.getElementsByClassName("deadAlarm")[0];
    if(deadalarm) { deadAlarm.classList.replace("btn-grey", "btn-red"); deadAlarm.innerText = "Disable Player Death Alarm" };
    let disconnectAlarm = document.getElementsByClassName("disconnectAlarm")[0];
    if(disconnectalarm) { disconnectAlarm.classList.replace("btn-grey", "btn-red"); disconnectAlarm.innerText = "Disable Disconnect Alarm" };
    let health65pAlarm = document.getElementsByClassName("health65pAlarm")[0];
    if(health65palarm) { health65pAlarm.classList.replace("btn-grey", "btn-red"); health65pAlarm.innerText = "Disable 65% Player Health Alarm" };
    let pAlarm = document.getElementsByClassName("pingAlarm")[0];
    if(pingalarm) { pAlarm.classList.replace("btn-grey", "btn-red"); pAlarm.innerText = "Disable >2k Ping Alarm" };
    let t65pAlarm = document.getElementsByClassName("tower65pAlarm")[0];
    if(tower65palarm) { t65pAlarm.classList.replace("btn-grey", "btn-red"); t65pAlarm.innerText = "Disable <65% Tower Health Alarm" };
    `,
    keywords: ["alarm", "defense", "wake", "score", "defend", "waves", "base"],
    category: false,
    visited: 0
}, {
    type: "acc",
    html: `
    <h1>Accounts</h1>
    <div id="bfl">
    <div id="snr">
    <h2>Sign In</h2>
    <label>Username: </label><input type="text" class="search-bar" id="usrn" />
    <br />
    <label>Password: </label><input type="password" class="search-bar" id="pswd" />
    <br />
    <button onclick="window.siGN(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-grey">Submit</button>
    </div>
    <hr />
    <button id="rlins" class="btn">Register instead?</button>
    </div>
    <div id="act" style="display: none;">
    <button class="btn btn-gold" style="float: right;" onclick="window.sgNO();"><i class="fa fa-sign-out-alt fa-lg"></i></button>
    <h2 id="hiu">Hello, user</h2>
    <hr />
    <button class="btn btn-red" onclick="window.redirectTab('Users', 'users')">Users</button>
    <hr />
    <button class="btn btn-grey" onclick="window.saveGopt(window.username);">Save Game Options</button>
    <button class="btn btn-gold" onclick="window.loadGoptReq(window.username);">Load Game Options</button>
    </div>
    `,
    name: "Accounts",
    script: `
    let snr = document.getElementById("snr");
    let rlins = document.getElementById("rlins");
    rlins.onclick = () => {
        dispatchEvent(new CustomEvent('regins'));
    };
    addEventListener('regins', function() {
        snr.innerHTML = \`
        <h2>Register</h2>
        <label>Username: </label><input type="text" class="search-bar" id="usrn" />
        <br />
        <label>Password: </label><input type="password" class="search-bar" id="pswd" />
        <br />
        <button onclick="window.reGS(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-grey">Submit</button>
        \`;
        rlins.onclick = () => {
            dispatchEvent(new CustomEvent("logins"));
        };
        rlins.innerHTML = "Sign in instead?";
    });
    addEventListener('logins', function() {
        snr.innerHTML = \`
        <h2>Sign In</h2>
        <label>Username: </label><input type="text" class="search-bar" id="usrn" />
        <br />
        <label>Password: </label><input type="password" class="search-bar" id="pswd" />
        <br />
        <button onclick="window.siGN(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-grey">Submit</button>
        \`;
        rlins.onclick = () => {
            dispatchEvent(new CustomEvent("regins"));
        };
        rlins.innerHTML = "Register instead?";
    });
    let auth = localStorage.ig_auth;
    if(auth) {
        auth = JSON.parse(auth);
        window.siGN(auth.username, auth.password, false);
    };
    `,
    keywords: ["acc", "save"],
    category: false,
    visited: 0
}, {
    type: "ef",
    html: `
    <h1>Entity Follower</h1>
    <p><strong><i class="fa fa-info-circle"></i> Toggling this feature via keyboard will enable/disable the nearest player mode, not the one you selected.</strong></p>
    <div id="efm">
    <h2>Mode</h2>
    </div>
    <br />
    <div id="eulm" style="display: none;">
        <label>Entity UID: </label>
        <input type="text" onchange="window.ulmv = this.value;" class="search-bar" />
    </div>
    `,
    name: "Entity Follower",
    script: `
    let mode = new window.BS([{
        name: "Off",
        color: "red",
        onselect: () => {
            window.lm = "Off";
            document.getElementById("eulm").style.display = "none";
            window.follow = { toggle: false };
            clearInterval(window.ulm);
        }
    }, {
        name: "Nearest Player",
        color: "red",
        onselect: () => {
            window.lm = "Nearest Player";
            document.getElementById("eulm").style.display = "none";
            window.follow = { toggle: true, np: true };
            document
            clearInterval(window.ulm);
        }
    }, {
        name: "Set UID",
        color: "grey",
        onselect: () => {
            window.lm = "Set UID";
            document.getElementById("eulm").style.display = "block";
            window.ulm = setInterval(() => {
                window.follow = { toggle: true, uid: window.ulmv };
            }, 250);
        }
    }]);
    mode.select(window.lm);
    document.getElementById("efm").append(mode.elem);
    addEventListener('efToggleByKeybind', function() {
        mode.select(window.lm);
    });
    `,
    keywords: ["raid", "offense", "offend", "attack", "follow", "ppl", "people", "move"],
    category: false,
    visited: 0
}, {
    type: "users",
    html: `
    <h1>Users</h1>
    <div id="users">
    </div>
    `,
    name: "Users",
    script: `
    let users = document.getElementById("users");
    let k = window.httpGet("https://readypoisedlegacy.nathaniel009.repl.co/users");
    for(let i of JSON.parse(k)) {
        users.innerHTML += \`<button class="btn btn-gold" onclick="window.userPg('\${i}')">\${i}</button><br />\`;
    };
    `,
    keywords: [],
    category: true,
    visited: 0
}, {
    type: "userpg",
    html: `
    <h1 id="username">User</h1>
    <div id="userInfo">
    </div>
    `,
    name: "User",
    keywords: [],
    category: false,
    visited: 0
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
window.si = 0;

//pageDisp.style.overflow = "scroll";
sm.style.overflow = "scroll";

addTab.style.transition = "margin-left 135ms";

const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

window.getTabDataByType = type => tabsData.find(i => i.type === type);

const getTabById = id => currentTabs.find(i => i.id === id);

// window.avgspw

let scr = [];

game.network.addRpcHandler("DayCycle", e => {
    scr.push(game.ui.playerTick.score);
    window.avgspw = arrAvg(scr);
    window.ScoreStats.update(game.ui.playerTick.score, Math.max.apply(null, scr));
});

window.refreshStats = () => {
    scr.push(game.ui.playerTick.score);
    window.avgspw = arrAvg(scr);
    let curr = getTabById(window.focusedTab);
    window.ScoreStats.update(game.ui.playerTick.score, Math.max.apply(null, scr));
    window.focusTab(window.focusedTab, {}); // no loading details for stats (yet)
};

pageDisp.innerHTML = window.getTabDataByType("mainMenu").html;

const hint = (txt, time) => {
    game.ui.components.PopupOverlay.showHint(txt, time);
};

const getTabByElem = elem => currentTabs.find(i => i.elem === elem);

window.getMostVisitedTabs = () => {
    return tabsData.sort((a, b) => b.visited - a.visited);
};

const addRmTabFunctionality = (element, ird) => {
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
            let curr = getTabById(ctlid);
            window.focusTab(ctlid, { nlt: window.nlt, si: window.si, rsl: curr.rsl, sqt: curr.sqt });
        };

        currentTabs.splice(currentTabs.indexOf(getTabById(ird)), 1);

        for(let itc in currentTabs) {
            currentTabs[itc].ict = itc;
            currentTabs[itc].elem.dataset.ict = itc;
        };

        if(tabsAmt === 0) {
            pageDisp.innerHTML = ``;
        };
    });
};

const addTabFocusOnClickFunctionality = (element, ird) => {
    element.addEventListener("click", function(e) {
        for(let itc in currentTabs) {
            currentTabs[itc].ict = itc;
            currentTabs[itc].elem.dataset.ict = itc;
        };
        let irddt = {};
        let curr = getTabByElem(this);
        try {
            irddt = window.getTabDataByType(curr.type);
        } catch {};
        window.focusTab(ird, { sqt: curr.sqt, rsl: curr.rsl, pche: irddt.cache || "", nlt: window.nlt, si: window.si });
        console.log(ird);
    });
};

addRmTabFunctionality(document.getElementById("rmtab1"), 1);
addTabFocusOnClickFunctionality(document.getElementById("tab1"), 1);

window.focusTab = (id, data) => {
    window.focusedTab = id;
    for(let i of currentTabs) {
        if(i.id !== id) {
            i.elem.style.backgroundColor = "#FF8800CC";
        } else if(i.id === id) {
            i.elem.style.backgroundColor = "#242526";
            let tdt = window.getTabDataByType(i.type);
            let vtdth = tdt.html;

            for(let iokvtd in data) {
                vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
            };

            pageDisp.innerHTML = vtdth;
            if(tdt.script) {
                eval(tdt.script);
            };
            if(i.type === "userpg") {
                window.rlUD();
                document.getElementById("username").innerHTML =
                    `${i.ud.username} ${i.ud.admin ? '<i class="fa fa-shield fa-xs" aria-hidden="true"></i>' : ''} ${i.ud.verified ? '<i class="fa fa-check-circle fa-xs" aria-hidden="true"></i>' : ''}`;
                let friendsHTML = `<br />This user has no friends :(<br />`;
                if(i.ud.friends.length > 0) {
                    friendsHTML = `<br /><strong>Friends: ${i.ud.friends.length}</strong><ul>`;
                    for(let f of i.ud.friends) {
                        friendsHTML += `<li>${f}</li>`;
                    };
                    friendsHTML += "</ul>";
                };
                document.getElementById("userInfo").innerHTML = `
                <strong>Joined ${i.ud.joinDate}</strong>
                ${friendsHTML}
                <button class="btn btn-red" onclick="window.rfUpg();">Refresh</button>
                <hr />
                ${window.username === i.ud.username ? '' : `<button class="btn btn-${window.ud.friends.includes(i.ud.username) ? "red" : "grey"}" onclick="window.${window.ud.friends.includes(i.ud.username) ? "r" : ""}freq('${i.ud.username}'); window.rfUpg();">${window.ud.friends.includes(i.ud.username) ? "Remove Friend" : "Add Friend"}</button>`}
                `;
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

    let ict = currentTabs.length - 1;

    tab.dataset.ict = ict;
    console.log(tab.id);
    tabs.append(tab);

    let elem = document.getElementById(`tab${tabId}`);
    let ctobj = { elem: elem, type: type, id: tabId, sqt: null, rsl: null };

    ctobj.ict = ict;

    currentTabs.push(ctobj);

    for(let itc in currentTabs) {
        currentTabs[itc].ict = itc;
        currentTabs[itc].elem.dataset.ict = itc;
    };

    console.log(currentTabs);

    let tdt = window.getTabDataByType(type);

    tdt.visited++;

    addTab.style.marginLeft = `${addTabRightEffect += 150}px`;

    console.log(`${tabsAmt} tabsAmt`);

    let oldTabId = tabId;
    tabId++;

    window.focusTab(oldTabId, { pche: tdt.cache || "", si: window.si, nlt: window.nlt });


    if(tabsAmt === 3) {
        addTab.style.display = "none";
    };

    if(tabsAmt >= 1) {
        addTab.style.marginTop = "-40px";
    };

    let currentRmTab = document.getElementById(`rmtab${oldTabId}`);
    addRmTabFunctionality(currentRmTab, oldTabId);
    addTabFocusOnClickFunctionality(document.getElementById(`tab${oldTabId}`), oldTabId);

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

    bfTabs.push({ title: text, script: tdt.script, html: tdt.html, type: type, sqt: gd.sqt, rsl: gd.rsl });

    bfIndex++;
    if(tdt.script) {
        eval(tdt.script);
    };
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gd.id);
    addTabFocusOnClickFunctionality(gid, gd.id);
    tabsData[tabsData.indexOf(tdt)].visited++;

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(getTabById(idrtd).type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt, si: window.si, rsl: gd.rsl, sqt: gd.sqt });
};

window.redirectTab2 = function(text, type, rsl, sqt) {
    let gd = getTabById(window.focusedTab);
    if(!gd) { return; };
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
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gd.id);
    addTabFocusOnClickFunctionality(gid, gd.id);
    tabsData[tabsData.indexOf(tdt)].visited++;

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(getTabById(idrtd).type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt, si: window.si, rsl: rsl, sqt: sqt });
};

window.bfRedirect = index => {
    let bfri = bfTabs[index];
    window.redirectTab2(bfri.title, bfri.type, bfri.rsl, bfri.sqt);
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
    return (qry.length > 2) ? `${qry.slice(0, 2)}...` : qry;
};

const qryify2 = qry => {
    return (qry.length > 6) ? `${qry.slice(0, 6)}...` : qry;
}; // for user pages

window.searchTab = function(query) {
    if(tabsAmt > 0) {
        let gd = getTabById(window.focusedTab);
        let gid = gd.elem;

        let rsl = ``;

        for(let itd of tabsData) {
            for(let itkd of itd.keywords) {
                if(query.toLowerCase().includes(itkd) && !rsl.includes(itd.name)) {
                    rsl += `<button onclick="window.redirectTab('${itd.name}', '${itd.type}')" class="btn btn-${itd.category ? "red" : "grey"}">${itd.name}</button><br />`;
                };
            };
        };

        if(rsl.length === 0) { rsl = `No results for ${query}`; };

        let sqt = `Results for: ${query}`;

        let data = {
            sqt: sqt,
            rsl: rsl
        };

        let gdi = window.focusedTab;

        let sqry = `Search - ${qryify(query)}`;

        getTabById(gdi).rsl = rsl;
        getTabById(gdi).sqt = sqt;

        let tdt = window.getTabDataByType("search");

        let vtdth = tdt.html;

        for(let iokvtd in data) {
            vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
        };

        bfTabs.push({ title: sqry, html: vtdth, type: "search", sqt: sqt, rsl: rsl });
        gd.type = "search";

        gid.innerHTML = `
    <p>
        ${sqry}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;

        pageDisp.innerHTML = vtdth;

        if(tdt.script) {
            eval(tdt.script);
        };
        addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gd.id);
        addTabFocusOnClickFunctionality(gid, gd.id);
    } else {
        window.makeTab("Main Menu", "mainMenu");
        window.searchTab(query);
    };
};

addTab.addEventListener("click", function() {
    window.makeTab("Main Menu", "mainMenu");
});


let hello = [];
window.sendWs = () => {
    let hc = `
    <div class="pches" id="rmalt${window.nlt}">
        <br />
        <button class="btn btn-red" onclick="window.rmAlt(${window.nlt});" id="rmaltbtn${window.nlt}"><i class="fa fa-trash"></i> Remove Alt #${window.nlt}</button>
    </div>
    `;
    let altcount = 0
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
    let si = hello.length;
    ifde.rmh = hc;
    ifde.si = si;
    ifde.nli = window.nlt;
    hello.push(ifde);

    window.getTabDataByType("alts").cache += hc;
    window.focusTab(window.focusedTab, { nlt: window.nlt, pche: window.getTabDataByType("alts").cache });
};

window.rmAlt = num => {
    let sck = hello[num-1];
    window.nlt--;
    console.log(num);
    sck.remove();

    console.log(sck.nli);
};

game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!resetalt" && e.uid == game.world.myUid) {
        hello.forEach(socket => { console.log(socket); socket.contentWindow.eval(`game.network.disconnect();`);});}
})

const kickAll = () => {
    hello.forEach(socket => {
        console.log(socket);
        socket.contentWindow.eval(`
            game.network.sendRpc({
			    name: "LeaveParty"});
        `);
    });
};



const joinAll = () => {
    hello.forEach(socket => {
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
let numOfAlts = 0
let aitoid = 0
let shouldAITO = false

game.network.addRpcHandler("DayCycle", () => {
    if (shouldAITO) {
        aitoid += 1
        console.log("aito" + aitoid)
        let NewAITO = document.createElement('Iframe');
        NewAITO.id = "aito" + aitoid;
        NewAITO.className = "AitoAlts"
        NewAITO.src = `http://zombs.io/#/${game.options.serverId}/badhack`;
        NewAITO.addEventListener('load', function() {
            NewAITO.contentWindow.eval(`
            document.getElementsByClassName("hud-intro-play")[0].click()
            game.network.addEntityUpdateHandler(() => {
                if (game.world.inWorld && game.network.connected) {
                    if (game.ui.getPlayerPartyShareKey() == window.parent.game.ui.getPlayerPartyShareKey() && game.ui.playerTick.gold >= 10000) {
                         console.log("buy timeout")
                         game.network.sendRpc({
                             name: "BuyItem",
                             itemName: "Pause",
                             tier: 1
                         });
                             window.parent.deleteAitoAlt();
                     } else if (game.ui.getPlayerPartyShareKey() != window.parent.game.ui.getPlayerPartyShareKey()){
                         game.network.sendRpc({
                             name: "JoinPartyByShareKey",
                             partyShareKey: window.parent.game.ui.getPlayerPartyShareKey()
                         });
                     }
                 }
            })
        `)
    })
        NewAITO.style.display = "none"
        document.body.append(NewAITO)
    }
})


window.deleteAitoAlt = () => {
    let AitoAltsdeleteAltLoop = setInterval(function() {
        if (document.getElementsByClassName('AitoAlts').length > 0) {
            for(let iframe of document.getElementsByClassName('AitoAlts')){
                iframe.remove();
            }
        }
        else{
            clearInterval(AitoAltsdeleteAltLoop);
        }
    })
}
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!sendalt" && e.uid == game.world.myUid) {
        window.sendWs();
    }
})
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!4ppl" && e.uid == game.world.myUid) {
        window.togglePlayerTrick();
        game.ui.components.PopupOverlay.showHint(`4 player trick toggle is now ${window.playerTrickToggle}`);

    }
})
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!AITO" && e.uid == game.world.myUid) {
        shouldAITO = ! shouldAITO
        game.ui.components.PopupOverlay.showHint(`AITO trick toggle is now ${shouldAITO}`);

    }
})
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!delaito" && e.uid == game.world.myUid) {
        window.deleteAitoAlt();
    }
})

window.addName = name => {
    let id = `u${Math.floor(Math.random() * 9999)}`;
    localStorage.names = `${localStorage.names || ""}<div id="${id}"><button onclick="document.querySelector('.hud-intro-name').value = \`${name.replaceAll('`', '\`')}\`" class="btn btn-red">${name}</button>`;
};

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


window.toggleARP = function() {
    window.autoRevivePets = !window.autoRevivePets;
};

(window.refreshNS = () => {
    let guide = document.getElementsByClassName("hud-intro-guide")[0];
    guide.innerHTML = `
<center><h1 style="text-transform: none;">Name Saver</h1>
<hr></center>
<div>
${localStorage.names || "<h2>No names have been saved here yet...<h2>"}
</div>
<hr />
<input type="text" class="search-bar" style="width:135px;" id="inpn" /><button class="btn-fixed btn-grey" onclick="window.addName(document.getElementById('inpn').value); window.refreshNS();">Add name</button>
`;
})(); // will make localStorage.names an object, maybe in early to mid beta

// ==UserScript==
// @name         AITO FIXED
// @namespace    -
// @version      0.1
// @description  say !aito to enable/disable aito
// @author       ehScripts
// @match        zombs.io
// @grant        none
// ==/UserScript==

window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
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
            if (new Uint8Array(msg.data)[0] == 5) {
                let data = codec.decode(msg.data);
                if (data.opcode === 5) {
                    ws.network.sendPacket(4, { displayName: localStorage.name, extra: data.extra });
                }
                return;
            }
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!window.startaito && !ws.isclosed) {
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
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };
        };
    };
};


/*
'use strict';
window.toggleRebuilder = () => {
    for(let i of atids) {
        clearInterval(window[`attempts${i}`]);
    };
    return (toggle = !toggle);
};

window.getRebuilderToggle = () => {
    return toggle;
};
*/

addEventListener('keydown', function(e) {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if(e.key === "|") {
            window.toggleRebuilder();
            let tglrb = window.getRebuilderToggle();
            new Noty({
                type: 'success',
                text: `ReBuilder toggle is now ${tglrb}`,
                timeout: 2000
            }).show();
            dispatchEvent(new CustomEvent("rebuilderToggleFromKeybind"));
        };
        if(e.key === "~") {
            window.addMarker();
            new Noty({
                type: 'success',
                text: `Added marker`,
                timeout: 2000
            }).show();
        };
        if(e.key === "}") {
            window.startaito = !window.startaito;
            window.sendAitoAlt();
            new Noty({
                type: 'success',
                text: `AITO toggle is now ${window.startaito}`,
                timeout: 2000
            }).show();
            dispatchEvent(new CustomEvent("aitoToggleFromKeybind"));
        };
    };
});

game.network.addRpcHandler("ReceiveChatMessage", e => {
    if(e.uid !== game.world.myUid) { return };
    if (e.message == "!rb") {
        window.toggleRebuilder();
        let tglrb = window.getRebuilderToggle();
        new Noty({
            type: 'success',
            text: `ReBuilder toggle is now ${tglrb}`,
            timeout: 2000
        }).show();
        dispatchEvent(new CustomEvent("rebuilderToggleFromChatCommand"));
    };
    if(e.message == "!mark") {
        window.addMarker();
        new Noty({
            type: 'success',
            text: `Added marker`,
            timeout: 2000
        }).show();
    };
});


window.noty3x = function() {
    new Noty({
        type: 'success',
        text: `3x3 Walls toggle is now ${window.x3builds}`,
        timeout: 2000
    }).show();
};

// game.network.addRpcHandler("Failure", onFailure);

/*** REBUILDER ***/

// Original code by eh, a part of it was fixed by trollers
// August 16th, 2021: New system, requested by Sirr0m

const getIsBuilding = (entity) => {
    return [
        "MeleeTower",
        "BombTower",
        "ArrowTower",
        "CannonTower",
        "Harvester",
        "Wall",
        "Door",
        "SlowTrap",
        "MagicTower",
        "GoldMine"
    ].includes(entity.model);
};

if(!window.baseSave) {
    window.baseSave = "[]";
};

const getGoldStash = () => {
    let entities = game.ui.buildings;
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        };
        let obj = entities[uid];
        if (obj.type == "GoldStash") {
            return obj;
        };
    };
};

window.saveBase = () => {
    let stash = getGoldStash();
    if (stash == undefined) return;
    let stashPosition = {
        x: stash.x,
        y: stash.y
    };
    let parsedSavedStorage = [];
    for(let i in game.world.entities) {
        let entity = game.world.entities[i];
        if(getIsBuilding(entity.fromTick)) {
            parsedSavedStorage.push({
                buildingType: entity.fromTick.model,
                stashOffsetX: stash.x - entity.targetTick.position.x,
                stashOffsetY: stash.y - entity.targetTick.position.y
            });
        };
    };
    window.baseSave = JSON.stringify(parsedSavedStorage);
};

window.buildBase = () => {
    let stash = getGoldStash();
    if (stash == undefined) return;
    let stashPosition = {
        x: stash.x,
        y: stash.y
    };
    let parsedSavedStorage = window.baseSave;
    if(parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);
        for(let i of parsedSavedStorage) {
            game.network.sendRpc2({
                name: "MakeBuilding",
                type: i.buildingType,
                x: Math.round(parseInt(stash.x) - i.stashOffsetX),
                y: Math.round(parseInt(stash.y) - i.stashOffsetY),
                yaw: 0
            });
        };
    };
};

window.toggleRebuilder = () => {
    let parsedSavedStorage = window.baseSave;
    if(parsedSavedStorage) {
        parsedSavedStorage = JSON.parse(window.baseSave);
        if(!window.rebuilderInterval) {
            window.saveBase();
            window.rebuilderInterval = setInterval(() => {
                window.buildBase();
                for(let i in game.world.entities) {
                    let entity = game.world.entities[i];
                    if(getIsBuilding(entity.fromTick)) {
                        game.network.sendRpc2({ name: "UpgradeBuilding", uid: parseInt(i) });
                    };
                };
            }, 333);
        } else {
            window.rebuilderInterval = clearInterval(window.rebuilderInterval);
        };
    } else {
        new Noty({
            type: "error",
            layout: "topRight",
            text: "You do not have a base saved.",
            timeout: 2000
        });
    };
};

game.ui.components.PopupOverlay.showHint2 = game.ui.components.PopupOverlay.showHint;
game.ui.components.PopupOverlay.showHint = (a, b) => {
    if(a.includes("can't") && window.getRebuilderToggle()) { return; };
    game.ui.components.PopupOverlay.showHint2(a, b);
};

window.getRebuilderToggle = () => !!window.rebuilderInterval;

/*

let attemptedTowers = [];
let successfulAttemptedTowers = [];
let atids = [];
let rebuiltData = [];
let toggle;
let rebuildData = [];
let rebuiltTowers = [];
let waitRebuildData = [];

let antiAnnoyingAutobuildBreakerKasap = {};
let deadbuildings = {};

setInterval(() => {
    for (let i in deadbuildings) {
        game.network.sendRpc({name: "MakeBuilding", x: deadbuildings[i].x, y: deadbuildings[i].y, type: deadbuildings[i].type, yaw: 0});
    }
}, 350)
game.network.addRpcHandler("LocalBuilding", (data) => {
    if(!toggle) { return; };
    for(let e of data) {
        if (antiAnnoyingAutobuildBreakerKasap[e.uid]) {
            return;
        }
        if (e.dead && !antiAnnoyingAutobuildBreakerKasap[e.uid]) {
            antiAnnoyingAutobuildBreakerKasap[e.uid] = 1;
            setTimeout(() => {
                delete antiAnnoyingAutobuildBreakerKasap[e.uid];
            }, 500)
        }
        if (!e.dead) {
            if (deadbuildings[`${e.x} - ${e.y} - ${e.tier}`]) {
                delete deadbuildings[`${e.x} - ${e.y} - ${e.tier}`];
            }
        }
        if(!!e.dead) {
            deadbuildings[`${e.x} - ${e.y} - ${e.tier}`] = e;
            rebuildData.push(`${e.x} - ${e.y} - ${e.tier}`);
            let snb = e;
            snb.name = "MakeBuilding";
            snb.yaw = e.yaw || 0;
            game.network.sendRpc(snb);
            setTimeout(() => {
                if(!rebuiltData.includes(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw || 0} - ${e.type}`)) {
                    let id = Math.floor(Math.random() * 999999).toString(25);
                    console.log(`rb set atid ${id}`);
                    window[`attempts${id}`] = setInterval(() => {
                        let comb = `${e.x} - ${e.y} - ${e.tier} - ${e.type}`;
                        if(successfulAttemptedTowers.includes(comb)) {
                            setTimeout(() => {
                                for(let i = 1; i < e.tier; i++) {
                                    game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                                };
                                rebuiltTowers.push(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw} - ${e.type} - ${e.uid}`);
                                rebuiltData.push(`${e.x} - ${e.y} - ${e.tier} - ${e.yaw} - ${e.type}`);
                            }, game.world.replicator.msPerTick);
                            console.log(`rb clear atid ${id}`);
                            clearInterval(window[`attempts${id}`]);
                        };
                    }, game.world.replicator.msPerTick);
                };
            }, game.world.replicator.msPerTick * 3);
            continue;
        };
        if(!rebuildData.includes(`${e.x} - ${e.y} - ${e.tier}`)) { continue; };
        let args = rebuildData[rebuildData.indexOf(`${e.x} - ${e.y} - ${e.tier}`)].split(" - ").map(i => parseInt(i));
        if(!e.dead) {
            if(attemptedTowers.includes(`${e.x} - ${e.y} - ${args[2]} - ${e.type}`)) {
                successfulAttemptedTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.type}`);
                setTimeout(() => {
                    for(let i = 1; i < args[2]; i++) {
                        game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                    };
                    rebuiltTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type} - ${e.uid}`);
                    rebuiltData.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type}`);
                }, game.world.replicator.msPerTick);
            };
            if(e.x == args[0] && e.y == args[1]) {
                setTimeout(() => {
                    if(game.world.entities[e.uid]) {
                        for(let i = 1; i < args[2]; i++) {
                            game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                        };
                        rebuiltTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type} - ${e.uid}`);
                        rebuiltData.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type}`);
                    };
                }, game.world.replicator.msPerTick);
            };
        };
    };
});
*/

window.mapElem = document.getElementById("hud-map");
let markerId = 1;

window.addMarker = () => {
    window.mapElem.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left) - 4}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top) - 12}%; position: absolute;" class='map-display' id="marker${markerId}"><i class='fa fa-map-marker'>${markerId++}</i></div>`)
};

// ==UserScript==
// @name         L Key Fixed w/ Automatic Hits
// @namespace    -
// @version      0.1
// @description  say "!L" to enable/disable the L key.
// @author       Trollers, eh
// @match        zombs.io
// @grant        none
// ==/UserScript==
let id = 1;
let cloneTimeout = false;
let socket = [];
function ltab() {
    let thisServer = Game.currentGame.options.servers[Game.currentGame.options.serverId];
    let ws = new WebSocket(`ws://${thisServer.hostname}:${8000}`);
    ws.binaryType = "arraybuffer";
    ws.id = id++;
    socket.push(ws);
    ws.onopen = () => {
        ws.network = new Game.currentGame.networkType();
        ws.network.sendPacket = (e, t) => {
            if (!ws.isclosed) {
                ws.send(ws.network.codec.encode(e, t));
            }
        };
        ws.onEnterWorld = (e) => {
            ws.inWorld = true;
        };
        ws.onclose = () => {
            if (!ws.isclosed) {
                ws.isclosed = true;
                ltab();
            }
        };
        ws.onmessage = (msg) => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.opcode === 5) {
                ws.network.sendPacket(4, { displayName: "asdf", extra: ws.data.extra });
            }
            if (ws.data.opcode == 4) ws.onEnterWorld(ws.data);
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
                ws.network.sendPacket(3, { up: 1, down: 0 });
                ws.wready = true;
            }
            if (ws.data.name == "PartyInfo") {
                ws.partyInfo = ws.data.response;
                setTimeout(() => {
                    for (let i in ws.partyInfo) {
                        if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                            ws.network.sendRpc({ name: "SetPartyMemberCanSell", uid: game.world.myUid, canSell: 1 });
                            ws.network.sendRpc({ name: "SetOpenParty", isOpen: 1 });
                            setTimeout(() => {
                                ws.network.sendRpc({ name: "SetPartyName", partyName: ws.id + "" });
                            }, 1000);
                        }
                    }
                }, 1750);
            }
            if (ws.data.name == "PartyApplicant") {
                ws.partyApplicant = ws.data.response;
                if (ws.partyApplicant.applicantUid == game.world.myUid) {
                    ws.network.sendRpc({ name: "PartyApplicantDecide", applicantUid: game.world.myUid, accepted: 1 });
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data.response.partyShareKey;
                if (window.FKey && cloneTimeout) {
                    if (socket[1].psk !== socket[0].psk) {
                        game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id2.psk });
                    }
                }
            }
        };
    };
}

window.LKeyWithTimeouts = function () {
    new Noty({
        type: 'success',
        text: `L Key toggle is now ${window.FKey}`,
        timeout: 2000
    }).show();
    cloneTimeout = false;
    if (window.FKey) {
        window.reduceWS2();
        window.waitUntilReady = setInterval(() => {
            if(socket[0].wready && socket[1].wready) {
                window.playerIds = {
                    id1: socket[0],
                    id2: socket[1],
                };
                console.log(`WREADY 1: ${socket[0].readyState === WebSocket.OPEN}, 2: ${socket[1].readyState === WebSocket.OPEN}`);
                game.network.sendRpc({ name: "KickParty", uid: window.playerIds.id1.uid });
                game.network.sendRpc({ name: "KickParty", uid: window.playerIds.id2.uid });
                window.FKeyOn = setInterval(() => {
                    cloneTimeout = true;
                    window.playerIds.id2.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id1.psk });
                    setTimeout(() => {
                        window.playerIds.id1.network.sendRpc({ name: "KickParty", uid: window.playerIds.id2.uid });
                        setTimeout(() => {
                            window.playerIds.id2.network.sendRpc({ name: "KickParty", uid: game.world.myUid });
                        }, 7400);
                        if(window.lksa) {
                            setTimeout(() => {
                                game.network.sendInput({ space: 1 });
                                game.network.sendInput({ space: 0 });
                                setTimeout(() => {
                                    game.network.sendInput({ space: 1 });
                                    game.network.sendInput({ space: 0 });
                                }, 250);
                            }, 7150);
                        };
                    }, 350);
                    if(window.lksa) {
                        setTimeout(() => {
                            game.network.sendInput({ space: 1 });
                            game.network.sendInput({ space: 0 });
                            setTimeout(() => {
                                game.network.sendInput({ space: 1 });
                                game.network.sendInput({ space: 0 });
                            }, 250);
                        }, 50);
                    };
                }, 15500);
                if(window.lksa) {
                    setTimeout(() => {
                        game.network.sendInput({ space: 1 });
                        game.network.sendInput({ space: 0 });
                        setTimeout(() => {
                            game.network.sendInput({ space: 1 });
                            game.network.sendInput({ space: 0 });
                        }, 250);
                    }, 15250);
                };
                console.log("readyboth");
                clearInterval(window.waitUntilReady);
            };
        }, 75);
    } else {
        clearInterval(window.FKeyOn);
        window.FKeyOn = null;
        window.playerIds.id1.isclosed = true;
        window.playerIds.id1.close();
        window.playerIds.id2.isclosed = true;
        window.playerIds.id2.close();
        clearInterval(window.aitUntilReady);
        socket = [];
    }
};

let aud = new Audio("https://cdn.discordapp.com/attachments/855622511553937429/865666768009166858/bmmph.mp3");

game.network.addRpcHandler("ReceiveChatMessage", (e) => {
    if (e.message == "!L" && e.uid == game.world.myUid) {
        window.FKey = !window.FKey;
        window.LKeyWithTimeouts();
        dispatchEvent(new CustomEvent("LKeyToggleFromChatCommand"));
    }
    if(!window.sfxc) return;
    aud.play();
});
window.oldWs2 = false;
window.reduceWS2 = () => {
    //if (!window.oldWs2) {
    //  window.oldWs2 = true;
    for (let i = 0; i < 2; i++) {
        ltab();
    }
    //}
};

// game.network.addEnterWorldHandler(window.reduceWS2);

window.ssMode = () => {
    window.ssModeToggle = !window.ssModeToggle;
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-top-right"]);
    for(let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        } else {
            mb.style.display = "none";
        }
    };
    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-health-bar"));
    document.querySelector(".hud-bottom-right").insertAdjacentElement("afterbegin", document.querySelector("#hud-party-icons"));
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-day-night-ticker"));
    // original screenshot mode code by deathrain, modified by eh
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

window.Stats = function () {

    var mode = 0;

    var container = document.createElement( 'div' );
    container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    container.addEventListener( 'click', function ( event ) {

        event.preventDefault();
        showPanel( ++ mode % container.children.length );

    }, false );

    //

    function addPanel( panel ) {

        container.appendChild( panel.dom );
        return panel;

    }

    function showPanel( id ) {

        for ( var i = 0; i < container.children.length; i ++ ) {

            container.children[ i ].style.display = i === id ? 'block' : 'none';

        }

        mode = id;

    }

    //

    var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

    var fpsPanel = addPanel( new window.Stats.Panel( 'FPS', '#0ff', '#002' ) );
    var msPanel = addPanel( new window.Stats.Panel( 'MS', '#0f0', '#020' ) );

    if ( self.performance && self.performance.memory ) {

        var memPanel = addPanel( new window.Stats.Panel( 'MB', '#f08', '#201' ) );

    }

    showPanel( 0 );

    return {

        REVISION: 16,

        dom: container,

        addPanel: addPanel,
        showPanel: showPanel,

        begin: function () {

            beginTime = ( performance || Date ).now();

        },

        end: function () {

            frames ++;

            var time = ( performance || Date ).now();

            msPanel.update( time - beginTime, 200 );

            if ( time >= prevTime + 1000 ) {

                fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

                prevTime = time;
                frames = 0;

                if ( memPanel ) {

                    var memory = performance.memory;
                    memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

                }

            }

            return time;

        },

        update: function () {

            beginTime = this.end();

        },

        // Backwards Compatibility

        domElement: container,
        setMode: showPanel

    };

};

window.Stats.Panel = function ( name, fg, bg ) {

    var min = Infinity, max = 0, round = Math.round;
    var PR = round( window.devicePixelRatio || 1 );

    var WIDTH = 175 * PR, HEIGHT = 48 * PR,
        TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
        GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
        GRAPH_WIDTH = 171 * PR, GRAPH_HEIGHT = 30 * PR;

    var canvas = document.createElement( 'canvas' );
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';

    var context = canvas.getContext( '2d' );
    context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect( 0, 0, WIDTH, HEIGHT );

    context.fillStyle = fg;
    context.fillText( name, TEXT_X, TEXT_Y );
    context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

    return {

        dom: canvas,

        update: function ( value, maxValue ) {

            min = Math.min( min, value );
            max = Math.max( max, value );

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect( 0, 0, WIDTH, GRAPH_Y );
            context.fillStyle = fg;
            context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

            context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

        }

    };

};

window.ScoreStats = window.Stats.Panel("SPW", "rgb(0, 255, 255)", "rgb(0, 0, 34)");
window.ScoreStats.dom.style.width = "175px";
window.ScoreStats.dom.style.cssText = "width:175px;height:48px;";

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
    if(data.name === "MakeBuilding" && data.type === "Wall" && window.x5builds) {
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
    if(data.name === "MakeBuilding" && data.type === "Wall" && window.x7builds) {
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
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

window.customColor = function() {
    let yncv = document.getElementById("ync").value;
    let hr = hexToRgb(yncv);
    game.world.localPlayer.entity.currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
    window.yncv = yncv;
};

game.network.addPacketHandler(0, () => {
    let entities = game.world.entities;
    if(window.AHRC) {
        if (!window.AHRC1) {
            window.AHRC1 = true;
            setTimeout(() => { window.AHRC1 = false; }, 75);
            for(let uid in entities) {
                if(!entities.hasOwnProperty(uid)) continue;
                let obj = entities[uid];
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.07
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.11
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.17
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.22
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.25
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.28
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.42
                    });
                };
                if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                    Game.currentGame.network.sendRpc({
                        name: "AddDepositToHarvester",
                        uid: obj.fromTick.uid,
                        deposit: 0.65
                    });
                };
            };
        };
    };
});

window.toggleAllDay = () => {
    let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
    if(hno.style.display === "block" || hno.style.display === "") {
        hno.style.display = "none";
    } else {
        hno.style.display = "block";
    };
};

window.moveTowards = pos => {
    if (game.ui.playerTick.position.y-pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({down: 0})
    } else {
        game.network.sendInput({down: 1})
    }
    if (-game.ui.playerTick.position.y+pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({up: 0})
    } else {
        game.network.sendInput({up: 1})
    }
    if (-game.ui.playerTick.position.x+pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({left: 0})
    } else {
        game.network.sendInput({left: 1})
    }
    if (game.ui.playerTick.position.x-pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({right: 0})
    } else {
        game.network.sendInput({right: 1})
    }
};

window.moveAwayFrom = pos => {
    if (game.ui.playerTick.position.y-pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({down: 1})
    } else {
        game.network.sendInput({down: 0})
    }
    if (-game.ui.playerTick.position.y+pos.y > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({up: 1})
    } else {
        game.network.sendInput({up: 0})
    }
    if (-game.ui.playerTick.position.x+pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({left: 1})
    } else {
        game.network.sendInput({left: 0})
    }
    if (game.ui.playerTick.position.x-pos.x > 100 || Math.sqrt(Math.pow((game.ui.playerTick.position.y-pos.y), 2) + Math.pow((game.ui.playerTick.position.x-pos.x), 2)) < 100) {
        game.network.sendInput({right: 1})
    } else {
        game.network.sendInput({right: 0})
    }
};


const dist = (a, b) => {
    return Math.sqrt( Math.pow((b.y-a.y), 2) + Math.pow((b.x-a.x), 2) );
};

window.nearestPlayer = () => {
    let playerPos = game.ui.playerTick.position;
    let ewoalp = [];
    for(let e of Object.entries(game.world.entities)){ if((e[0] != game.world.myUid) && e[1].entityClass === "PlayerEntity") { ewoalp.push(e[1]); }; };
    return ewoalp.map(e => { return { x: e.getPositionX(), y: e.getPositionY(), uid: e.uid } }).sort((a, b) => dist(a, playerPos) - dist(b, playerPos))[0];
};

game.network.addEntityUpdateHandler(() => {
    if(window.follow && window.follow.toggle) {
        if(window.follow.np) {
            let np = window.nearestPlayer();
            if(!np) { return; };
            window.moveTowards(np);
        } else if(window.follow.uid) {
            let entity = game.world.entities[window.follow.uid];
            if(!entity) { return; };
            window.moveTowards(entity.targetTick.position);
        };
    };
    if(!window.zoomonscroll) {
        window.zoom(document.getElementById("zoomSlider").value);
    }
});

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);


/*
game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (opcode, data) => {
    window.ptOpc = opcode;
    window.ptData = data;
    dispatchEvent(new CustomEvent("sendPacket"));
    game.network.sendPacket2(opcode, data);
};
*/

/*** TROLLERS ***/

// server scanner (serverObj has the data)

wss = null;
codec = new BinCodec();
serverObj = {};
let leaderboardLoaded;

function myWS() {
    if (!localStorage.isxyzAllowed) return;
    wss = new WebSocket(localStorage.wsEnv);
    wss.binaryType = "arraybuffer";
    wss.onopen = () => {
        if (localStorage.haspassword) thisNetwork.sendMessage(localStorage.haspassword);
    }
    wss.onmessage = (e) => {
        let data = codec.decode(e.data);
        let response = data.response;
        let parsedResponse;
        if (response.data) {
            parsedResponse = JSON.parse(response.data);
            if (parsedResponse) {
                if (parsedResponse.id) {
                    thisInfo.id = parsedResponse.id;
                }
            }
            if (parsedResponse.m) {
                serverObj = parsedResponse.m;
                if (!leaderboardLoaded) {
                    leaderboardLoaded = true;
                    game.ui.components.Leaderboard.leaderboardData = serverObj[document.getElementsByClassName("hud-intro-server")[0].value].leaderboardDataObj;
                    game.ui.components.Leaderboard.update();
                }
                for (let i = 0; i < document.getElementsByClassName("hud-intro-server")[0].length; i++) {
                    let id = document.getElementsByClassName("hud-intro-server")[0][i].value;
                    let target = serverObj[id].leaderboardDataObj.sort((a, b) => b.wave - a.wave)[0];
                    document.getElementsByClassName("hud-intro-server")[0][i].innerText = `${game.options.servers[id].name}, ppl: ${serverObj[id].population}, ${target.wave} <= ${target.name}`
                }
            }
        } else {
            if (!response.msg.includes(`{"tk":"`) && !response.msg.includes(`, [`)) {
                console.log(response);
            }
        }
    }
}
thisNetwork = {
    codec: codec,
    sendMessage(message) {
        wss.send(codec.encode(9, {name: "message", msg: message}));
    },
    getdisconnected() {
        return wss.readyState == wss.CLOSED;
    },
    disconnect() {
        wss.close();
    },
    reconnect() {
        myWS();
    }
}
thisInfo = {
    id: null,
    name: null,
    uid: null,
    host: null,
    active: false
}
find_1 = (targetName = "Player", findAll = false) => {
    let targets = {};
    let results = 0;
    Object.values(serverObj).forEach(server => {
        if (!server.leaderboardDataObj) return;
        server.leaderboardDataObj.forEach(result => {
            if (result.name.toLowerCase().includes(targetName.toLowerCase()) && !findAll) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
            if (findAll) {
                targets[result.uid] = {server: server.id, name: result.name, wave: result.wave, score: result.score, uid: result.uid};
                results++;
            }
        })
    })
    let sortedTargets = Object.values(targets).sort((a, b) => b.wave - a.wave);
    return [`All the results that includes ${targetName}, ${results}`, sortedTargets]
}

game.network.addEnterWorldHandler(e => {
    thisInfo.uid = e.uid;
    thisInfo.name = e.effectiveDisplayName;
    thisInfo.host = game.network.socket.url;
    thisInfo.active = true;
    console.log("hi");
})
myWS();
setInterval(() => {
    if (localStorage.isxyzAllowed && thisNetwork.getdisconnected()) {
        thisNetwork.reconnect();
    }
}, 5000);

// great auto pet heal

let petTokens = {
    1: 100,
    2: 100,
    3: 100,
    4: 100,
    5: 200,
    6: 200,
    7: 300,
    8: Infinity
}
let myPet = {};
window.petheal = false;
window.autoRevivePets = false; // set this to true if u want Auto Revive pet.
let heallevel = 70;
let entitiesHealth = {};
game.network.addEntityUpdateHandler((data) => {
    if (game.ui.playerTick.petUid) {
        window.activated = true;
        if (data.entities[game.ui.playerTick.petUid]) {
            if (data.entities[game.ui.playerTick.petUid].uid) {
                myPet = game.world.entities[game.ui.playerTick.petUid].fromTick;
                if (game.world.entities[game.ui.playerTick.petUid]) {
                    let isTokenHealing = false;
                    if (myPet.model == window.model && myPet.tier == window.tier && (myPet.health/myPet.maxHealth)*100 <= 95 && (myPet.health/myPet.maxHealth)*100 > 0 && game.ui.playerTick.token >= petTokens[myPet.tier] && game.ui.playerTick.petUid) {
                        game.network.sendRpc({name: "BuyItem", itemName: myPet.model, tier: myPet.tier + 1});
                        isTokenHealing = true;
                    }
                    if (window.petheal && !isTokenHealing) {
                        if ((myPet.health/myPet.maxHealth) * 100 < heallevel && (myPet.health/myPet.maxHealth) * 100 > 0) {
                            if (!window.healPet) {
                                game.network.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                                game.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                                window.healPet = true;
                                setTimeout(() => {
                                    window.healPet = false;
                                }, 300);
                            }
                        }
                    }
                    if (window.model !== myPet.model) window.model = myPet.model;
                    if (window.tier !== myPet.tier) window.tier = myPet.tier;
                }
            }
        }
    }
    if (window.autoRevivePets && window.activated) {
        game.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1});
        game.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1});
    }
})

// player info + attempt to make it possible not laggy like before's

let getRss = false;
let allowed1 = true;

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

game.network.addEntityUpdateHandler(() => {
    if (getRss) {
        !allowed1 && (allowed1 = true);
    }
    if (getRss || allowed1) {
        for (let i in game.world.entities) {
            if (game.world.entities[i].fromTick.name) {
                let player = game.world.entities[i];
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                if (getRss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `${player.targetTick.oldName}, UID: ${player.targetTick.uid}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}, partyId: ${Math.round(player.targetTick.partyId)};
score: ${player.targetTick.score}, timeDead: ${msToTime(player.targetTick.timeDead)};

`;
                    player.targetTick.name = game.world.entities[i].targetTick.info;
                }
                if (!getRss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.world.entities[i].targetTick.info;
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
                        player.targetTick.info = `${player.targetTick.oldName}, UID: ${player.targetTick.uid}, W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1};\nx: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}, partyId: ${Math.round(player.targetTick.partyId)};
score: ${player.targetTick.score}, timeDead: ${msToTime(player.targetTick.timeDead)};

`;
                        player.targetTick.name = game.world.entities[i].targetTick.info;
                    }
                }
            }
        }
    }
    if (!getRss) {
        allowed1 = false;
    }
})

function counter(e = 0) {
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
}

/*** EH ***/
document.addEventListener("keydown", e => {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) { // key -
            getRss = !getRss;
            new Noty({
                type: 'success',
                text: `RSS Above Head toggle is now ${getRss}`,
                timeout: 2000
            }).show();
        }
        if (e.key.toLowerCase() == "f" && e.shiftKey) {
            window.petheal = !window.petheal;
            new Noty({
                type: 'success',
                text: `Pet Heal toggle is now ${window.petheal}`,
                timeout: 2000
            }).show();
        };
        if (e.key.toLowerCase() == "p" && e.shiftKey) {
            if(window.follow.toggle) {
                window.follow = { toggle: false };
            } else {
                window.follow = { toggle: true, np: true };
            };
            window.lm = window.follow.toggle ? "Nearest Player" : "Off";
            dispatchEvent(new CustomEvent("efToggleByKeybind"));
            new Noty({
                type: 'success',
                text: `Nearest Player Follower toggle is now ${window.follow.toggle}`,
                timeout: 2000
            }).show();
        };
        if(e.key === "z") {
            window.x3builds = !window.x3builds;
            new Noty({
                type: 'success',
                text: `3x3 Walls toggle is now ${window.x3builds}`,
                timeout: 2000
            }).show();
        };
        if(e.key === "x") {
            window.x5builds = !window.x5builds;
            new Noty({
                type: 'success',
                text: `5x5 Walls toggle is now ${window.x5builds}`,
                timeout: 2000
            }).show();
        };
        if(e.key === "c") {
            window.x7builds = !window.x7builds;
            new Noty({
                type: 'success',
                text: `7x7 Walls toggle is now ${window.x7builds}`,
                timeout: 2000
            }).show();
        };
    };
});
document.addEventListener('keyup', function(e) {
    if (e.key.toLowerCase() == "p" && e.shiftKey) {
        document.getElementsByClassName("hud-menu-party")[0].style.display = "none";
    };
});

window.stashspawn = psk => {
    let socketIndex = 0;

    let nextSocket = () => {
        if(socketIndex < (sockets.length - 1)) {
            return sockets[socketIndex+++1];
        };
    };

    let currentSocket = sockets[0];

    let action = () => {
        if(currentSocket.dead) {
            currentSocket.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: psk });
            currentSocket.addOnPsk(() => {
                if(socketIndex === (sockets.length - 1)) { return; };
                currentSocket.network.sendInput({ respawn: 1 });
                currentSocket.network.sendRpc({ name: "LeaveParty" });
                currentSocket = nextSocket();
                action();
            });
        };
    };

    action();
};

(function() { // modified private parties tab code, except the new tab in the party menu is used differently (not private parties)
    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }


    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";

    let privateTab = document.createElement("a");
    privateTab.className = "hud-party-tabs-link";
    privateTab.id = "privateTab";
    privateTab.innerHTML = "Party Tools";

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
  <h1>Party Tools</h1>
  <input id="psk" placeholder="Party share key..." value="abcdefghijklmnopqr" class="btn" /><button class="btn btn-grey" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Join Party by Share Key (1)</button>
  <input id="psk2" placeholder="Party share key (2)..." value="qwertyuiopasdfghjk" class="btn" /><button class="btn btn-grey" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk2').value })">Join Party by Share Key (2)</button>
  <input id="psk3" placeholder="Party share key (3)..." value="klzxcvbnmlkjhgfdsa" class="btn" /><button class="btn btn-grey" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk3').value })">Join Party by Share Key (3)</button>
  <br />
  <button class="btn btn-red" onclick="game.network.sendRpc({ name: 'LeaveParty' })">Leave Current Party</button>
  `;

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
  <h1>Share Keys</h1>
  `;
    game.network.addRpcHandler("PartyShareKey", function(e) {
        let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
        let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
        let psk = e.partyShareKey;
        let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
        getId("privateHud2").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk} <a href="${lnk}" target="_blank" color="red">[Link]</a></p></div><button class="btn btn-red" id="${cpKeyId}" style="display:inline-block;" onclick="window.copyText('${psk}');">Copy Key</button><button class="btn btn-red" id="${cpLnkId}" style="display:inline-block;" onclick="window.copyText('${lnk}');">Copy Link</button><br />`;
    });

    // ^ share keys feature originally from 444x3

    document.getElementsByClassName('hud-party-tabs-link')[0].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };
    document.getElementsByClassName('hud-party-tabs-link')[1].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };
})();

// Button selector UI with curves, by ehScripts

window.BS = class BS {
    constructor(options) {
        let _this = this;
        this.elem = document.createElement("div");
        this.buttons = [];
        this.getButtonByName = name => _this.buttons.find(btn => btn.data.name === name);
        this.select = name => {
            let btn = _this.getButtonByName(name);
            _this.selected = name;
            btn.elem.innerText = `> ${btn.data.name}`;
            for(let b of _this.buttons) {
                if(b.data.name !== btn.data.name) {
                    b.elem.innerText = b.data.name;
                };
            };
        };
        let PRIVATE = {
            addSelectorFunctionality: (elem, data) => {
                elem.addEventListener("click", function() {
                    _this.select(data.name);
                    if(data.onselect) { data.onselect(); };
                });
                _this.buttons.push({
                    elem: elem,
                    data: data
                });
            },
            addLeftButton: data => {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add(`btn-${data.color}`);
                btn.classList.add("btn-curve-left");
                btn.innerText = data.name;
                PRIVATE.addSelectorFunctionality(btn, data);
                _this.elem.append(btn);
            },
            addRightButton: data => {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add(`btn-${data.color}`);
                btn.classList.add("btn-curve-right");
                btn.style.marginTop = "3px";
                btn.style.marginLeft = "3px";
                btn.innerText = data.name;
                PRIVATE.addSelectorFunctionality(btn, data);
                _this.elem.append(btn);
            },
            addButton: data => {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add(`btn-${data.color}`);
                btn.innerText = data.name;
                PRIVATE.addSelectorFunctionality(btn, data);
                _this.elem.append(btn);
            },
            addDoubleSidedButton: data => {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add(`btn-${data.color}`);
                btn.classList.add("btn-curve-right");
                btn.classList.add("btn-curve-left");
                btn.innerText = data.name;
                PRIVATE.addSelectorFunctionality(btn, data);
                _this.elem.append(btn);
            }
        };
        if(options.length === 1) { PRIVATE.addDoubleSidedButton(options[0]); } else {
            for(let o in options) {
                let opt = options[o];
                console.log(opt);
                if(o == 0) { PRIVATE.addLeftButton(opt); }
                else if(o == (options.length - 1)) { PRIVATE.addRightButton(opt); }
                else { PRIVATE.addButton(opt); };
            };
        };
    };
};

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

/*** TROLLERS ***/

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
    let gl = GetGoldStash();
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
    a.src = "https://cdn.discordapp.com/attachments/870020008128958525/871587235324117052/Canadian_EAS_Alarm_EXTREME_LOUD.mp3"
    a.volume = 1;
    a.play();
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Stop Alert?", 10000, function() {
        a.pause();
    })
    setTimeout(() => {
        a.pause();
    }, 30000);
}

alarm = () => {
    isOnOrNot = !isOnOrNot;

    document.getElementsByClassName("alarm")[0].innerText = document.getElementsByClassName("alarm")[0].innerText.replace(isOnOrNot ? "Enable" : "Disable", isOnOrNot ? "Disable" : "Enable");

    document.getElementsByClassName("alarm")[0].className = document.getElementsByClassName("alarm")[0].className.replace(isOnOrNot ? "grey" : "red", isOnOrNot ? "red" : "grey");

}

stashHitAlarm = () => {
    stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("stashHitAlarm")[0].innerText = document.getElementsByClassName("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("stashHitAlarm")[0].className = document.getElementsByClassName("stashHitAlarm")[0].className.replace(stashhitalarm ? "grey" : "red", stashhitalarm ? "red" : "grey");

}

deadAlarm = () => {
    deadalarm = !deadalarm;

    document.getElementsByClassName("deadAlarm")[0].innerText = document.getElementsByClassName("deadAlarm")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("deadAlarm")[0].className = document.getElementsByClassName("deadAlarm")[0].className.replace(deadalarm ? "grey" : "red", deadalarm ? "red" : "grey");

}

disconnectAlarm = () => {
    disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("disconnectAlarm")[0].innerText = document.getElementsByClassName("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("disconnectAlarm")[0].className = document.getElementsByClassName("disconnectAlarm")[0].className.replace(disconnectalarm ? "grey" : "red", disconnectalarm ? "red" : "grey");

}

health65pAlarm = () => {
    health65palarm = !health65palarm;

    document.getElementsByClassName("health65pAlarm")[0].innerText = document.getElementsByClassName("health65pAlarm")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("health65pAlarm")[0].className = document.getElementsByClassName("health65pAlarm")[0].className.replace(health65palarm ? "grey" : "red", health65palarm ? "red" : "grey");

}

pingAlarm = () => {
    pingalarm = !pingalarm;

    document.getElementsByClassName("pingAlarm")[0].innerText = document.getElementsByClassName("pingAlarm")[0].innerText.replace(pingalarm ? "Enable" : "Disable", pingalarm ? "Disable" : "Enable");

    document.getElementsByClassName("pingAlarm")[0].className = document.getElementsByClassName("pingAlarm")[0].className.replace(pingalarm ? "grey" : "red", pingalarm ? "red" : "grey");

}

tower65pAlarm = () => {
    tower65palarm = !tower65palarm;

    document.getElementsByClassName("tower65pAlarm")[0].innerText = document.getElementsByClassName("tower65pAlarm")[0].innerText.replace(tower65palarm ? "Enable" : "Disable", tower65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("tower65pAlarm")[0].className = document.getElementsByClassName("tower65pAlarm")[0].className.replace(tower65palarm ? "grey" : "red", tower65palarm ? "red" : "grey");

}

GetGoldStash = () => {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}

let blockedNames = [];

window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
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

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    if(blockedNames.includes(msg.displayName) || window.chatDisabled) { return; };
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, ''),
        d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${msg.displayName}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

window.toggleChat = () => {
    window.chatDisabled = !window.chatDisabled;
    let hcm = document.getElementsByClassName("hud-chat-messages")[0];
    if(window.chatDisabled) {
        window.oldChatHTML = hcm.innerHTML;
        hcm.innerHTML = "<h1>Disabled Chat</h1>";
    } else {
        hcm.innerHTML = window.oldChatHTML;
    };
};

const shouldKeep = uid => {
    let entity = game.world.entities[uid];
    if(["Tree", "Stone"].includes(entity.fromTick.model)) { return true; };
    return false;
};

game.world.removeEntity2 = game.world.removeEntity;
game.world.removeEntity = (uid) => {
    if (shouldKeep(uid)) return;
    game.world.removeEntity2(uid);
};

window.httpGet = url => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
};

window.reGS = (username, password) => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    if(k.startsWith("ERROR: ")) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        new Noty({
            type: "success",
            layout: "topRight",
            text: k,
            timeout: 2000
        }).show();
        document.getElementById("bfl").style.display = "none";
        let act = document.getElementById("act");
        act.style.display = "block";
        document.getElementById("hiu").innerHTML = `Hello, ${username}`;
        window.username = username;
        localStorage.ig_auth = JSON.stringify({ username: username, password: password });
    };
};

window.siGN = (username, password, al = true) => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    if(k.startsWith("ERROR: ") && al) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        if(al) {
            new Noty({
                type: "success",
                layout: "topRight",
                text: k,
                timeout: 2000
            }).show();
        };
        document.getElementById("bfl").style.display = "none";
        let act = document.getElementById("act");
        act.style.display = "block";
        document.getElementById("hiu").innerHTML = `Hello, ${username}`;
        window.username = username;
        localStorage.ig_auth = JSON.stringify({ username: username, password: password });
        window.ud = JSON.parse(window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/user?username=${encodeURIComponent(username)}`));
    };
};
window.toggleZoS = () => {
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
};
window.resetZoom = () => {
    document.getElementById("zoomSlider").value = 1;
};
window.sgNO = () => {
    document.getElementById("act").style.display = "none";
    document.getElementById("bfl").style.display = "block";
    localStorage.ig_auth = undefined;
};

window.loadGopt = json => {
    json.dbg ? game.debug.show() : game.debug.hide();
    if(json.ssm) {
        if(!window.ssModeToggle) {
            window.ssMode();
        };
    } else if(window.ssModeToggle) {
        window.ssMode();
    };
    if(json.zos) {
        if(!window.zoomonscroll) {
            window.toggleZoS();
        };
    } else if(window.zoomonscroll) {
        window.toggleZoS();
    };
    if(json.ync) {
        let hr = hexToRgb(json.ync);
        game.world.localPlayer.entity.currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
        window.yncv = json.ync;
    };
    let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
    if(json.tad) {
        if(hno.style.display !== "none") {
            hno.style.display = "none";
        };
    } else if(hno.style.display === "none") {
        hno.style.display = "block";
    };
    window.frss = !!json.frss;
    if(json.cdt) {
        if(!window.chatDisabled) {
            window.toggleChat();
        };
    } else if(window.chatDisabled) {
        window.toggleChat();
    };
};

window.saveGopt = username => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/gopt/save?username=${encodeURIComponent(username)}&gopt=${encodeURIComponent(JSON.stringify(window.gopt))}`);
    if(k.startsWith("ERROR: ")) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        new Noty({
            type: "success",
            layout: "topRight",
            text: k,
            timeout: 2000
        }).show();
    };
};
window.loadGoptReq = username => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/gopt/load?username=${encodeURIComponent(username)}`);
    if(k.startsWith("ERROR: ")) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        new Noty({
            type: "success",
            layout: "topRight",
            text: "Successfully loaded Game Options from your account.",
            timeout: 2000
        }).show();
        window.loadGopt(JSON.parse(k));
    };
};

window.rmw = () => {
    for(let sck of sockets) {
        if(!sck.iframe && !sck.closed) {
            sck.close();
            sck.closed = true;
            window.nlt--;
        };
    };
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt, si: window.si });
    new Noty({
        type: "success",
        layout: "topRight",
        text: "Successfully removed all WebSockets",
        timeout: 2000
    }).show();
};
window.rmi = () => {
    for(let sck of sockets) {
        if(sck.iframe && !sck.closed) {
            sck.close();
            sck.closed = true;
            window.nlt--;
        };
    };
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt, si: window.si });
    new Noty({
        type: "success",
        layout: "topRight",
        text: "Successfully removed all iFrames",
        timeout: 2000
    }).show();
};
window.rma = () => {
    for(let sck of sockets) {
        if(sck.closed) { continue; };
        sck.close();
        sck.closed = true;
        window.nlt--;
    };
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt, si: window.si });
    new Noty({
        type: "success",
        layout: "topRight",
        text: "Successfully removed all WebSockets",
        timeout: 2000
    }).show();
};

var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

// return the angle of the vector in radians
Vector.prototype.getDirection = function() {
    return Math.atan2(this.y, this.x);
};

// set the direction of the vector in radians
Vector.prototype.setDirection = function(direction) {
    var magnitude = this.getMagnitude();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
};

// get the magnitude of the vector
Vector.prototype.getMagnitude = function() {
    // use pythagoras theorem to work out the magnitude of the vector
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

// set the magnitude of the vector
Vector.prototype.setMagnitude = function(magnitude) {
    var direction = this.getDirection();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
};

// add two vectors together and return a new one
Vector.prototype.add = function(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
};

// add a vector to this one
Vector.prototype.addTo = function(v2) {
    this.x += v2.x;
    this.y += v2.y;
};

// subtract two vectors and reutn a new one
Vector.prototype.subtract = function(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
};

// subtract a vector from this one
Vector.prototype.subtractFrom = function(v2) {
    this.x -= v2.x;
    this.y -= v2.y;
};

// multiply this vector by a scalar and return a new one
Vector.prototype.multiply = function(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
};

// multiply this vector by the scalar
Vector.prototype.multiplyBy = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
};

// scale this vector by scalar and return a new vector
Vector.prototype.divide = function(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
};

// scale this vector by scalar
Vector.prototype.divideBy = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
};

// Aliases
Vector.prototype.getLength = Vector.prototype.getMagnitude;
Vector.prototype.setLength = Vector.prototype.setMagnitude;

Vector.prototype.getAngle = Vector.prototype.getDirection;
Vector.prototype.setAngle = Vector.prototype.setDirection;

// Utilities
Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
};

Vector.prototype.toString = function() {
    return 'x: ' + this.x + ', y: ' + this.y;
};

Vector.prototype.toArray = function() {
    return [this.x, this.y];
};

Vector.prototype.toObject = function() {
    return {x: this.x, y: this.y};
};

const angleConverter = { radiansToDegrees: e => e * 180 / Math.PI, degreesToRadians: e => e / 180 * Math.PI };

window.freq = username => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/friends/add?username=${encodeURIComponent(window.username)}&username2=${encodeURIComponent(username)}`);
    if(k.startsWith("ERROR: ")) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        new Noty({
            type: "success",
            layout: "topRight",
            text: k,
            timeout: 2000
        }).show();
    };
};

window.rfUpg = () => {
    let tab = getTabById(window.focusedTab);
    window.userPg(tab.ud.username);
};

window.rlUD = () => {
    window.ud = JSON.parse(window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/user?username=${encodeURIComponent(username)}`));
};

window.rfreq = username => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/friends/remove?username=${encodeURIComponent(window.username)}&username2=${encodeURIComponent(username)}`);
    if(k.startsWith("ERROR: ")) {
        new Noty({
            type: "error",
            layout: "topRight",
            text: k.replace("ERROR: ", ""),
            timeout: 2000
        }).show();
    } else {
        new Noty({
            type: "success",
            layout: "topRight",
            text: k,
            timeout: 2000
        }).show();
    };
};



window.sck = (hostname, cb) => {
    const ws = new WebSocket(`ws://${hostname}:80`);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        ws.network = new game.networkType();
        ws.network.sendRpc = (e) => { ws.send(ws.network.codec.encode(9, e)) };
        ws.network.sendInput = (e) => { ws.send(ws.network.codec.encode(3, e)) };
        ws.onmessage = msg => {
            const data = ws.network.codec.decode(msg.data)
            switch (data.opcode) {
                case 4:
                    ws.send(ws.network.codec.encode(3, { up: 1 }));
                    ws.send(ws.network.codec.encode(3, { left: 1 }));
                    ws.uid = data.uid;
                    ws.position = { x: null, y: null };
                    window.findTC[ws.name] = ws;
                    cb(ws);
                    break;
                case 5:
                    game.network.connectionOptions.hostname = hostname;
                    game.network.connected = true;
                    var dn = `${Math.floor(Math.random() * 9999)}`;
                    ws.send(ws.network.codec.encode(4, { displayName: dn, extra: data.extra }));
                    ws.name = dn;
                    window.findTC[dn] = ws;
                    break;
            };
            if(data.entities) {
                if(data.entities[ws.uid] && data.entities[ws.uid] !== true) {
                    if(data.entities[ws.uid].position) {
                        let pos = { x: data.entities[ws.uid].position.x || ws.position.x, y: data.entities[ws.uid].position.y || ws.position.y };
                        ws.position = pos;
                        window.findTC[ws.name].position = pos;
                    };
                };
            };
        };
    };
};

window.findTC = () => {
    let v1 = find_1("ƬƇ")[1];
    let v2 = find_1("TC")[1];
    let v3 = find_1("TƇ")[1];
    let v4 = find_1("ƬC")[1];
    let all = [...v1, ...v2, ...v3, ...v4];
    for(let item in all) {
        all[item].server = game.options.servers[all[item].server];
        delete all[item].selected;
        // sendMessage(`\`\`\`JSON\n${JSON.stringify(all[item], null, 2)}\`\`\``);
        window.sck(all[item].server.hostname, e => {
            all[item].ws = e;
            console.log("done");
            window.coverMap(e);
            e.addEventListener('message', msg => {
                if(all[item].found) { return };
                const data = e.network.codec.decode(msg.data);
                if(data.entities) {
                    for(let i in data.entities) {
                        if(data.entities[i].name) {
                            if(data.entities[i].name == all[item].name) {
                                if(data.entities[i].position) {
                                    alert(JSON.stringify(data.entities[i].position));
                                    all[item].found = true;
                                    clearInterval(all[item].mvInterval);
                                };
                            };
                        };
                    };
                };
            });
        });
    };
    return all;
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
let hil = document.getElementsByClassName("hud-intro-left")[0];
hil.innerHTML = widget;
hil.style.marginTop = "30px";

window.copyText = t => {
    const elem = document.createElement('textarea');
    elem.value = t;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    new Noty({
        type: 'success',
        text: `Copied to clipboard`,
        timeout: 2000
    }).show();
};

window.coverMap = ws => {
    let max = 23973;
    let min = 27;
    let time = 0;

    ws.network.sendInput({ up: 0, down: 0, left: 0, right: 0 });

    let _moveTowards = pos => {
        if (ws.position.y-pos.y > 100 || Math.sqrt(Math.pow((ws.position.y-pos.y), 2) + Math.pow((ws.position.x-pos.x), 2)) < 100) {
            ws.network.sendInput({down: 0})
        } else {
            ws.network.sendInput({down: 1})
        }
        if (-ws.position.y+pos.y > 100 || Math.sqrt(Math.pow((ws.position.y-pos.y), 2) + Math.pow((ws.position.x-pos.x), 2)) < 100) {
            ws.network.sendInput({up: 0})
        } else {
            ws.network.sendInput({up: 1})
        }
        if (-ws.position.x+pos.x > 100 || Math.sqrt(Math.pow((ws.position.y-pos.y), 2) + Math.pow((ws.position.x-pos.x), 2)) < 100) {
            ws.network.sendInput({left: 0})
        } else {
            ws.network.sendInput({left: 1})
        }
        if (ws.position.x-pos.x > 100 || Math.sqrt(Math.pow((ws.position.y-pos.y), 2) + Math.pow((ws.position.x-pos.x), 2)) < 100) {
            ws.network.sendInput({right: 0})
        } else {
            ws.network.sendInput({right: 1})
        }
    };

    let mv = (x, y, cb) => {
        ws.mvInterval = setInterval(() => {
            let pos = ws.position;
            if(((pos.x + 144) > x) && ((pos.y + 144) > y) && ((pos.x - 144) < x) && ((pos.y - 144) < y)) { cb(pos.x, pos.y); clearInterval(interval); };
            time += 250;
            _moveTowards({ x: x, y: y });
        }, 250);
    };
    let start = (x, y) => {
        mv(max, y + 1200, end);
    };
    let end = (x, y) => {
        let pos = ws.position;
        if(((pos.y + 144) > max) && ((pos.x + 144) > max) && ((pos.x - 144) < max) && ((pos.y - 144) < max)) {
            return;
        };
        mv(min, y + 1200, start);
    };
    mv(min, min, start);
};

document.getElementsByClassName("hud-intro-form")[0].insertAdjacentHTML("beforeend", `<button class="btn btn-red hud-intro-play" style="border: 3px solid #66e8ff;" onclick="window.ssfi();">Scan</button>`);

window.ssfi = () => {
    let ssrs = document.getElementById("ssrs");
    ssrs.innerHTML = `<strong>Loading...</strong>`;
    let selected = document.getElementsByClassName("hud-intro-server")[0].value;
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
                if(ws.b4) { window.appSsrs({ population: ws.pop, leaderboard: data.response, parties: ws.parties }); ws.close(); return; };
                loadLbPacket();
                ws.b4 = true;
            };
        };
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch(data.opcode) {
                case 5:
                    ws.network.sendPacket(4, { displayName: `LB-${Math.floor(Math.random() * 99999)}`, extra: data.extra });
                    break;
                case 4:
                    ws.network.sendPacket(3, { left: 1, up: 1 });
                    ws.pop = data.players - 1;
                    break;
                case 9:
                    ws.onRpc(data);
                    break;
            };
        };
    };
};

window.appSsrs = res => {

    console.log(res);

    let ssrs = document.getElementById("ssrs");
    ssrs.style.overflow = "scroll";
    ssrs.style.height = "175px";
    ssrs.innerHTML = `
    <p>Population: ${res.population}</p>
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
    }).join("<hr />")}
    </div>
    <hr />
    <h1>Parties</h1>
    ${res.parties.map(p => {
        return `
        <p>Name: ${p.partyName},
        ID: ${p.partyId},
        Members: ${p.memberCount},
        Public: ${p.isOpen}</p>
        `;
    }).join("<hr />")}
    <div>
    </div>
    `;
};

    document.getElementsByClassName("hud-menu-icons")[0].insertAdjacentHTML("beforeend", `<div class="" data-type="More" onclick="window.moreMenu();"></div>`);

    document.body.insertAdjacentHTML('beforeend', `
<div class="hud-menu hud-menu-settings hud-menu-more" style="text-align: center;">
<h1>Extras</h1>
<hr />
<h2>Sell</h2>
<button class="btn btn-grey 1i" style="width: 45%;">Sell All!</button>

<button class="btn btn-grey 2i" style="width: 45%;">Sell Walls!</button>

<button class="btn btn-grey 4i" style="width: 45%;">Sell Cannons!</button>

<button class="btn btn-grey 3i" style="width: 45%;">Sell Melees!</button>

<button class="btn btn-grey 5i" style="width: 45%;">Sell Bombs!</button>

<button class="btn btn-grey 6i" style="width: 45%;">Sell Doors!</button>

<button class="btn btn-grey 7i" style="width: 45%;">Sell Traps!</button>

<button class="btn btn-grey 21i" style="width: 45%;">Sell Arrows!</button>

<button class="btn btn-grey 20i" style="width: 45%;">Sell Mages!</button>
</div>
`);

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

    let hasBeenInWorld = false;
    game.network.addEnterWorldHandler(() => {
        if(hasBeenInWorld) { return };
        hasBeenInWorld = true;
        for(let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
            console.log(i.dataset.type);
            if(i.dataset.type !== "More") {
                i.addEventListener('click', function() {
                    document.getElementsByClassName("hud-menu-more")[0].style.display = "none";
                });
            };
        };
        /*
        let newCanvas = document.createElement("canvas");
        newCanvas.style.position = "absolute";
        newCanvas.style.top = "0";
        newCanvas.style.left = "0";
        newCanvas.width = document.querySelector('canvas').width;
        newCanvas.height = document.querySelector('canvas').height;
        newCanvas.style.zIndex = 4;
        document.body.append(newCanvas);

        window.newCtx = newCanvas.getContext("2d");
        */
    });

    window.Find = {
        Instance: class {
            constructor(rank) {
                this.target = rank;
                let  _this = this;
                let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80/`);
                ws.binaryType = "arraybuffer";
                ws.onopen = () => {
                    ws.network = new game.networkType();
                    ws.network.sendPacket = (e, t) => { ws.send(ws.network.codec.encode(e, t)); };
                    ws.tryEnterWorld = data => {
                        ws.network.sendPacket(4, { displayName: `FIND-${Math.floor(Math.random() * 99999)}`, extra: data.extra });
                        setTimeout(() => {
                            if(!ws.uid && ws.readyState === 1) {
                                ws.tryEnterWorld(data);
                            };
                        }, 4000);
                    };
                };
                ws.onmessage = msg => {
                    const data = ws.network.codec.decode(msg.data);
                    let uid = game.ui.components.Leaderboard.leaderboardData[rank - 1].uid;
                    if(data.entities) {
                        if(uid in data.entities) {
                            _this.found = { pos: data.entities[i].position, done: true };
                        };
                        window.findPlayer(rank, _this.found);
                        // window.mapElem.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${(data.entities[ws.uid].position.x / 240) - 4}%; top: ${(data.entities[ws.uid].position.y / 240) - 12}%; position: absolute;" class='map-display'><i class='fa fa-map-marker'>${markerId++}</i></div>`)
                        ws.close();
                    };
                    switch(data.opcode) {
                        case 5:
                            ws.tryEnterWorld(data);
                            console.log("e");
                            break;
                        case 4:
                            ws.network.sendPacket(3, { left: 1, up: 1 });
                            ws.uid = data.uid;
                            console.log("e2");
                            break;
                    };
                };
            };
        }
    };

    window.findPlayer = (rank, data) => {
        if(data) {
            alert(`Successfully found #${rank} on the leaderboard: ${JSON.stringify(data)}`);
        } else {
            setTimeout(() => {
                new window.Find.Instance(rank);
            }, 1750);
        };
    };

    document.getElementsByClassName("1i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    document.getElementsByClassName("2i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type == "Wall") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    document.getElementsByClassName("3i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type == "Door") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    document.getElementsByClassName("4i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type == "SlowTrap") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    document.getElementsByClassName("5i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type == "ArrowTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    document.getElementsByClassName("6i")[0].addEventListener('click', function() {
        for(let uid in game.ui.buildings) {
            if(game.ui.buildings[uid].type == "MagicTower") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: game.ui.buildings[uid].uid
                });
            }
        }
    })

    window.spamParty = (id, amount) => {
        let spammers = [];
        let startSpam = () => {
            for(let ws of spammers) {
                ws.network.sendPacket(9, { name: "JoinParty", partyId: id });
            };
        };
        let addSpammer = () => {
            let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80/`);
            spammers.push(ws);
            ws.binaryType = "arraybuffer";
            ws.onopen = () => {
                ws.network = new game.networkType();
                ws.network.sendPacket = (e, t) => { ws.send(ws.network.codec.encode(e, t)); };
                ws.sendEnterWorld = d => {
                    ws.network.sendPacket(4, { displayName: `SPAM-${Math.floor(Math.random() * 99999)}`, extra: d.extra });
                };
                ws.onEnterWorld = () => {
                    if(spammers.length >= amount) {
                        startSpam();
                    } else {
                        addSpammer();
                    };
                };
                ws.onmessage = msg => {
                    const data = ws.network.codec.decode(msg.data);
                    switch(data.opcode) {
                        case 5:
                            ws.sendEnterWorld(data);
                            break;
                        case 4:
                            ws.onEnterWorld();
                            break;
                    };
                };
            };
        };

        addSpammer();
    };

    window.noob = () => {
        let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80/`);
        ws.binaryType = "arraybuffer";
        ws.onopen = () => {
            ws.network = new game.networkType();
            ws.network.sendPacket = (e, t) => { ws.send(ws.network.codec.encode(e, t)); };
            ws.sendEnterWorld = d => {
                ws.network.sendPacket(4, { displayName: `NOOB-${Math.floor(Math.random() * 99)}`, extra: d.extra });
            };
            ws.onEnterWorld = data => {
                ws.uid = data.uid;
                ws.close();
            };
            ws.onmessage = msg => {
                const data = ws.network.codec.decode(msg.data);
                switch(data.opcode) {
                    case 5:
                        ws.sendEnterWorld(data);
                        break;
                    case 4:
                        ws.onEnterWorld(data);
                        break;
                };
            };
        };
    };

    window.rmMarker = id => {
        let rmmrkbtn = document.getElementById("rmmrkbtn");
        let nomrkerr = document.getElementById("nomrkerr");
        nomrkerr.style.display = "none";
        let marker = document.getElementById(`marker${id}`);
        if(marker) {
            marker.remove();
        } else {
            nomrkerr.style.display = "block";
        };
    };

    window.rmAllMarkers = () => {
        for(let i = 1; i <= markerId; i++) {
            document.getElementById(`marker${i}`).remove();
        };
        new Noty({
            type: 'success',
            text: `Removed all markers`,
            timeout: 2000
        }).show();
    };

window.httpGet("https://PoorNavyLead.asdfqwerty2.repl.co/r");

let scorelog = document.createElement('div');
scorelog.innerHTML = "Score Logger: 0";
document.getElementsByClassName('hud-top-center')[0].appendChild(scorelog);
let oldScore= Game.currentGame.ui.playerTick.score,
      newScore = 0;
Game.currentGame.network.addRpcHandler("DayCycle", ()  => {
    if (Game.currentGame.ui.components.DayNightTicker.tickData.isDay == 0) {
        newScore = Game.currentGame.ui.playerTick.score;
        scorelog.innerHTML = `Score Logger:${(newScore - oldScore).toLocaleString("en")}`;
        oldScore = Game.currentGame.ui.playerTick.score;
    }
})
