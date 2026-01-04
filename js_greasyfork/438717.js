// ==UserScript==
// @name         TC Meadow hack
// @namespace    -
// @version      BETA
// @description  DONT LEAK Modded also FUCK Trollers not xD Trollers tho
// @author       The Trollers Ehscripts 
// @match        zombs.io
// @match        http://meadow-rocky-lan.glitch.me/
// @icon         https://i.pinimg.com/originals/0d/f2/c4/0df2c47c6fb1f663fa8e29357c96b61d.jpg
// @grant        none
// @license      MIT
// @license      TC Meadow 
// @downloadURL https://update.greasyfork.org/scripts/438717/TC%20Meadow%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/438717/TC%20Meadow%20hack.meta.js
// ==/UserScript==

// DO NOT LEAK!!!!
//IMa leak this haha *Dark kg xD Trollers TC Meadow Sway*

/*** DEATHRAIN ***/
document.querySelectorAll('.ad-unit, .hud-intro-left, .hud-intro-wrapper > h2, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 24px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 280px; height: 280px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;" /><Custom><b><font size="36">Serplent Mod</font></b></Custom>`;
let igText = document.getElementsByTagName("font")[0];
igText.style.textTransform = "none";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");
var Style1 = document.querySelectorAll('.hud-intro-name, .hud-intro-main, .hud-intro-server, .hud-intro-play');for (let i = 0; i < Style1.length; i++) {
    Style1[i].style.border = "3px solid #66e8ff";
}
///=======================================/=======================================>

/*** EH ***/

window.lm = "Off";
window.alttype = "WebSocket";
window.follow = { toggle: false };
window.gopt = {};

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

sm.style.backgroundColor = "rgba(28, 92, 65, 0.55)";
sm.style.border = "5px solid white";

sm.innerHTML = `
<style>
Custom {
  letter-spacing: 10px;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: url('https://media.discordapp.net/attachments/855622511553937429/862917682987139102/unknown.png');
  background-size: cover;
}
.hud-intro::before {
    background-image: url('https://i.pinimg.com/originals/0d/f2/c4/0df2c47c6fb1f663fa8e29357c96b61d.jpg');
    background-size: cover;
}
.hud-intro-main {
    padding: 0px 25px 25px 25px;
    width: 580px;
    height: 335px;
    background-image: linear-gradient(to bottom right, rgba(18, 124, 166, 0.65), rgba(18, 146, 196, 0.65), rgba(18, 124, 166, 0.65))
}
.hud-intro-name, .hud-intro-server {
  border: 3px solid #66e8ff;
}
.btn-blue, .btn-red {
    margin-top: 3px;
    margin-left: 3px;
}
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
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
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
    <h1>iGniTioN</h1>
    <p>Developer: <strong>Serplent</strong></p>
    <p>Co-Developer: <strong>The Trollers</strong></p>
    <hr />
    <h2>Categories</h3>
    <button class="btn btn-blue" onclick="window.redirectTab('Score', 'score')">Score</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Raid', 'raid')">Raid</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Alts', 'alts')">Alts</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Shortcuts', 'shortcuts')">Shortcuts</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Miscellaneous', 'misc')">Misc.</button>
    `,
    keywords: [],
    visited: 0
}, {
    type: "score",
    html: `
    <h1>Score</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button>
    <button class="btn btn-green" onclick="window.redirectTab('Stats', 'sts')">Stats</button>
    <button class="btn btn-green" onclick="window.redirectTab('Auto Revive', 'arp')">Auto Revive</button>
    <button class="btn btn-green" onclick="window.redirectTab('Pet Heal', 'petheal')">Pet Heal</button>
    <button class="btn btn-green" onclick="window.redirectTab('AFS', 'afs')">AFS</button>
    `,
    keywords: ["score", "wr", "4player", "4p", "trick", "base"],
    name: "Score",
    category: true,
    visited: 0
}, {
    type: "alts",
    html: `
    <h1>Alts</h1>
    <div id="alttype" style="display:inline-block;"></div><button class="btn btn-green" onclick="window.sendWs();" style="display:inline-block;margin-top: 4px;margin-left:10px;">Send Alt</button>
    <br /><br />
    <input type="text" maxlength="29" placeholder="Alt Name" id="BotName" class="btn-fixed search-bar" style="height: 35px;" />
    <select id="slctbnv">
    </select>
    <button class="btn btn-green" id="ALTname">Set Name</button>
    <h1 id="nfnlt"># of alts: //nlt, current alt ID: //si</h1>
    <label>Remove Alt: </label><input type="text" id="inprm" class="btn-fixed search-bar" placeholder="Alt ID" style="height: 40px;" />
    <button id="rmaltbtn" class="btn btn-green">Remove Alt</button>
    <br />
    <strong style="color: red; display: none;" id="noiderr"><i class="fa fa-times-circle"></i> Sorry, there is no alt with that ID.</strong>
    <br />
    <button class="btn btn-red" onclick="window.rmw();"><i class="fa fa-trash"></i> Remove WebSockets</button>
    <button class="btn btn-red" onclick="window.rmi();"><i class="fa fa-trash"></i> Remove iFrames</button>
    <button class="btn btn-red" onclick="window.rma();"><i class="fa fa-trash"></i> Remove All</button>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Player Trick', 'playertrick')">Player Trick</button><button class="btn btn-green" onclick="window.redirectTab('L Key', 'lkey')">L Key</button><button class="btn btn-green" onclick="window.redirectTab('AITO', 'aito')">AITO</button>
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
    color: "blue",
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
    <button class="btn btn-green" onclick="window.redirectTab('L Key', 'lkey')">L Key</button>
    <button class="btn btn-green" onclick="window.redirectTab('Entity Follower', 'ef')">Entity Follower</button>
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
    <button class="btn btn-green" onclick="window.redirectTab('AITO', 'aito')">AITO</button>
    <button class="btn btn-green" onclick="window.redirectTab('Auto ReBuilder', 'rebuilder')">Auto ReBuilder</button>
    <button class="btn btn-green" onclick="window.redirectTab('3x3 Walls', 'x3w')">3x3 Walls</button>
    <button class="btn btn-green" onclick="window.redirectTab('Alarms', 'alarms')">Alarms</button>
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
    <button class="btn btn-blue" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
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
    <button class="btn btn-green" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    script: `
    let arptgl = document.getElementById("arptgl");

    if(window.autoRevivePets) {
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
    keywords: ["arp", "revive", "pet", "defense", "protec", "wave", "score"],
    category: false,
    visited: 0
}, {
    type: "misc",
    html: `
    <h1>Miscellaneous</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Markers', 'markers')">Markers</button>
    <button class="btn btn-green" onclick="window.redirectTab('Game Options', 'gopt')">Game Options</button>
    <button class="btn btn-green" onclick="window.redirectTab('AHRC', 'ahrc')">AHRC</button>
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
    <button class="btn btn-green" onclick="window.refreshStats();">Refresh</button>
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
    <button class="btn btn-green" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    name: "AITO",
    script: `
    let aitotgl = document.getElementById("aitotgl");
    const toggleAito = (ed = false) => {
        if(ed) { window.startaito = !window.startaito; window.sendAitoAlt(); };
        if(window.startaito) { aitotgl.classList.remove("btn-green"); aitotgl.classList.add("btn-red");  aitotgl.innerText = "Disable AITO"; } else { aitotgl.classList.add("btn-green"); aitotgl.classList.remove("btn-red"); aitotgl.innerText = "Enable AITO"; };
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
    <button class="btn btn-green" onclick="window.redirectTab('Raid', 'raid')">Raid</button>
    `,
    name: "L Key",
    script: `
    let ltgl = document.getElementById("ltgl");
    const toggleL = (ed = false) => {
        if((typeof ed === "boolean") && ed) { window.FKey = !window.FKey; window.LKeyWithTimeouts(); };
        if(window.FKey) { ltgl.classList.remove("btn-green"); ltgl.classList.add("btn-red"); ltgl.innerText = "Disable L Key"; } else { ltgl.classList.add("btn-green"); ltgl.classList.remove("btn-red"); ltgl.innerText = "Enable L Key"; };
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
    <p><strong><i class="fa fa-exclamation-circle"></i> Will not upgrade rebuilt towers to the original tier.</strong></p>
    <button class="btn" id="rebuildertgl"></button>
    <p><strong><i class="fa fa-keyboard"></i> Keybind: SHIFT + \x5c</strong></p>
    <p><strong><i class="fa fa-code"></i> Command: !rb</strong></p>
    <hr />
    <h2>Related Pages</h2>
    <button class="btn btn-green" onclick="window.redirectTab('Waves', 'waves')">Waves</button>
    `,
    name: "Auto ReBuilder",
    script: `
    let rebuildertgl = document.getElementById("rebuildertgl");
    let chk = () => {
        if(window.getRebuilderToggle()) {
            rebuildertgl.classList.remove("btn-green");
            rebuildertgl.classList.add("btn-red");
            rebuildertgl.innerText = "Disable ReBuilder";
        } else {
            rebuildertgl.classList.remove("btn-red");
            rebuildertgl.classList.add("btn-green");
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
    </ul>
    <hr />
    <h2><i class="fa fa-keyboard"></i> Keybinds</h2>
    <ul>
    <li><strong>( SHIFT + \x5c )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Auto ReBuilder', 'rebuilder')">Auto ReBuilder</a></li>
    <li><strong>( SHIFT + } )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('AITO', 'aito')">AITO</a></li>
    <li><strong>( SHIFT + F )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('Pet Heal', 'aito')">Pet Heal</a></li>
    <li><strong>( SHIFT + \` )</strong> - Adds <a href="javascript:void(0)" onclick="window.redirectTab('Markers', 'markers')">Markers</a></li>
    <li><strong>( SHIFT + 3 )</strong> - Toggles <a href="javascript:void(0)" onclick="window.redirectTab('3x3 Walls', 'x3w')">3x3 Walls</a></li>
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
    <p><strong><i class="fa fa-keyboard"></i> Keybind: SHIFT + \`</strong></p>
    <button class="btn btn-green" onclick="window.addMarker();">Add Marker</button>
    `,
    name: "Markers",
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
        if(window.x3builds) { xtgl.classList.add("btn-red"); xtgl.classList.remove("btn-green"); xtgl.innerText = "Disable 3x3 Walls" } else { xtgl.classList.add("btn-green"); xtgl.classList.remove("btn-red"); xtgl.innerText = "Enable 3x3 Walls"; };
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
        if(window.AHRC) { atgl.classList.add("btn-red"); atgl.classList.remove("btn-green"); atgl.innerText = "Disable AHRC" } else { atgl.classList.add("btn-green"); atgl.classList.remove("btn-red"); atgl.innerText = "Enable AHRC"; };
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
        if(window.petheal) { phtgl.classList.add("btn-red"); phtgl.classList.remove("btn-green"); phtgl.innerText = "Disable Pet Heal" } else { phtgl.classList.add("btn-green"); phtgl.classList.remove("btn-red"); phtgl.innerText = "Enable Pet Heal"; };
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
<button class="btn btn-green alarm" onclick="alarm();">Enable Tower Destroy Alarm</button>
<br>
<button class="btn btn-green stashHitAlarm" onclick="stashHitAlarm();">Enable Stash Damage Alarm</button>
<br>
<button class="btn btn-green deadAlarm" onclick="deadAlarm();">Enable Player Death Alarm</button>
<br>
<button class="btn btn-green disconnectAlarm" onclick="disconnectAlarm();">Enable Disconnect Alarm</button>
<br>
<button class="btn btn-green health65pAlarm" onclick="health65pAlarm();">Enable 65% Player Health Alarm</button>
<br>
<button class="btn btn-green pingAlarm" onclick="pingAlarm();">Enable >2k Ping Alarm</button>
<br>
<button class="btn btn-green tower65pAlarm" onclick="tower65pAlarm();">Enable <65% Tower Health Alarm</button>
    `,
    name: "Alarms",
    script: `
    let normAlarm = document.getElementsByClassName("alarm")[0];
    if(isOnOrNot) { normAlarm.classList.replace("btn-green", "btn-red"); normAlarm.innerText = "Disable Tower Destroy Alarm" };
    let shAlarm = document.getElementsByClassName("stashHitAlarm")[0];
    if(stashhitalarm) { shAlarm.classList.replace("btn-green", "btn-red"); shAlarm.innerText = "Disable Stash Damage Alarm" };
    let deadAlarm = document.getElementsByClassName("deadAlarm")[0];
    if(deadalarm) { deadAlarm.classList.replace("btn-green", "btn-red"); deadAlarm.innerText = "Disable Player Death Alarm" };
    let disconnectAlarm = document.getElementsByClassName("disconnectAlarm")[0];
    if(disconnectalarm) { disconnectAlarm.classList.replace("btn-green", "btn-red"); disconnectAlarm.innerText = "Disable Disconnect Alarm" };
    let health65pAlarm = document.getElementsByClassName("health65pAlarm")[0];
    if(health65palarm) { health65pAlarm.classList.replace("btn-green", "btn-red"); health65pAlarm.innerText = "Disable 65% Player Health Alarm" };
    let pAlarm = document.getElementsByClassName("pingAlarm")[0];
    if(pingalarm) { pAlarm.classList.replace("btn-green", "btn-red"); pAlarm.innerText = "Disable >2k Ping Alarm" };
    let t65pAlarm = document.getElementsByClassName("tower65pAlarm")[0];
    if(tower65palarm) { t65pAlarm.classList.replace("btn-green", "btn-red"); t65pAlarm.innerText = "Disable <65% Tower Health Alarm" };
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
    <button onclick="window.siGN(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-green">Submit</button>
    </div>
    <hr />
    <button id="rlins" class="btn">Register instead?</button>
    </div>
    <div id="act" style="display: none;">
    <button class="btn btn-gold" style="float: right;" onclick="window.sgNO();"><i class="fa fa-sign-out-alt fa-lg"></i></button>
    <h2 id="hiu">Hello, user!</h2>
    <hr />
    <button class="btn btn-blue" onclick="window.redirectTab('Users', 'users')">Users</button>
    <hr />
    <button class="btn btn-green" onclick="window.saveGopt(window.username);">Save Game Options</button>
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
        <button onclick="window.reGS(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-green">Submit</button>
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
        <button onclick="window.siGN(document.getElementById('usrn').value, document.getElementById('pswd').value);" class="btn btn-green">Submit</button>
        \`;
        rlins.onclick = () => {
            dispatchEvent(new CustomEvent("regins"));
        };
        rlins.innerHTML = "Register instead?";
    });
    let auth = localStorage.ig_auth;
    if(auth) {
        auth = JSON.parse(auth);
        window.siGN(auth.username, auth.password);
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
        color: "blue",
        onselect: () => {
            window.lm = "Nearest Player";
            document.getElementById("eulm").style.display = "none";
            window.follow = { toggle: true, np: true };
            document
            clearInterval(window.ulm);
        }
    }, {
        name: "Set UID",
        color: "green",
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
            if(i.type === "userpg") {
                document.getElementById("username").innerText = i.ud.username;
                document.getElementById("userInfo").innerHTML = `
                <strong>Joined ${i.ud.joinDate}</strong>
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
    pageDisp.innerHTML = tdt.html; // 1k lines, very nice!
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
                    rsl += `<button onclick="window.redirectTab('${itd.name}', '${itd.type}')" class="btn btn-${itd.category ? "blue" : "green"}">${itd.name}</button><br />`;
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

let sockets = [];
window.sendWs = () => {
    if(window.alttype === "iFrame") {
        document.getElementById("nfnlt").innerHTML = `# of alts: ${window.nlt+++1}, current alt ID: ${window.si+++1}`;

        window.focusTab(window.focusedTab, { nlt: window.nlt, si: window.si });

        let iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}/4ptrick`;
        let ifd = `s${Math.floor(Math.random() * 100000)}`;
        iframe.id = ifd;
        document.body.append(iframe);

        let ifde = document.getElementById(ifd);
        ifde.addEventListener('load', function() {
            this.contentWindow.eval(`
document.querySelector(".hud-intro-name").value = "${game.options.nickname}";
document.querySelector(".hud-intro-play").click();
game.network.addEnterWorldHandler(() => {
    console.log("loaded alt");
    game.network.sendInput({ left: 1, up: 1 });
    game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: "${game.ui.getPlayerPartyShareKey()}" });
});
`);
        });
        sockets.push({ iframe: ifde, close: () => { ifde.remove(); }, joinMainParty: () => { ifde.contentWindow.eval(`game.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: "${game.ui.getPlayerPartyShareKey()}" });`); }, closed: false });
        return;
    };
    document.getElementById("nfnlt").innerHTML = `# of alts: ${window.nlt+++1}, current alt ID: ${window.si+++1}`;

    window.focusTab(window.focusedTab, { nlt: window.nlt, si: window.si });

    const ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:80`);
    ws.binaryType = "arraybuffer";
    ws.id = sockets.length;
    ws.removed = false;
    /*
    let addMissingTickFields = function (tick, lastTick) {
        for (var fieldName in lastTick) {
            var fieldValue = lastTick[fieldName];
            tick[fieldName] = fieldValue;
        };
    }; // thanks to trollers for giving me this function :D
    */
    ws.onopen = () => {
        ws.network = new game.networkType();
        let entities = {};
        let myPlayer = {};
        ws.myPlayer = myPlayer;
        ws.entities = entities;
        ws.network.sendRpc = (e) => { ws.send(ws.network.codec.encode(9, e)) };
        ws.network.sendInput = (e) => { ws.send(ws.network.codec.encode(3, e)) };
        ws.onmessage = msg => {
            const data = ws.network.codec.decode(msg.data)
            switch (data.opcode) {
                case 4:
                    ws.send(ws.network.codec.encode(3, { up: 1 }));
                    ws.send(ws.network.codec.encode(3, { left: 1 }));
                    ws.joinMainParty();
                    break;
                case 5:
                    ws.send(ws.network.codec.encode(4, { displayName: game.options.nickname, extra: data.extra }));
                    sockets[ws.id] = ws;
                    break;
            }
            if(data.uid) {
                ws.uid = data.uid;
                myPlayer.uid = data.uid;
            };
        };

        ws.joinMainParty = () => {
            ws.send(ws.network.codec.encode(9, {
                name: "JoinPartyByShareKey",
                partyShareKey: game.ui.getPlayerPartyShareKey()
            }));
        };
        window[`socket${ws.id}`] = ws;
    }

    sockets.push(ws);
};

window.rmAlt = num => {
    let sck = sockets[num];
    let noiderr = document.getElementById("noiderr");
    if(sck && !sck.closed) {
        sck.closed = true;
        sck.close();
        noiderr.style.display = "none";
        window.focusTab(window.focusedTab, { nlt: window.nlt---1, si: window.si });
    } else {
        noiderr.style.display = "block";
    };
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
    for(let socket of sockets) {
        if(!socket.removed) {
            for (let sck of sockets) sck.joinMainParty();
        };
    };
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
    if(window.playerTrickToggle) {
        isDay = !!e.isDay;
        if (!isDay) {
            tickStarted = e.cycleStartTick;
            tickToEnd = e.nightEndTick;
            hasKicked = false;
            hasJoined = false;
        };
    };
});

window.togglePlayerTrick = () => {
    window.playerTrickToggle = !window.playerTrickToggle;
};

window.addName = name => {
    let id = `u${Math.floor(Math.random() * 9999)}`;
    localStorage.names = `${localStorage.names || ""}<div id="${id}"><button onclick="document.querySelector('.hud-intro-name').value = \`${name.replaceAll('`', '\`')}\`" class="btn btn-blue">${name}</button>`;
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
<input type="text" class="search-bar" style="width:135px;" id="inpn" /><button class="btn-fixed btn-green" onclick="window.addName(document.getElementById('inpn').value); window.refreshNS();">Add name</button>
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
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if(ws.data.opcode === 5) {
                ws.network.sendPacket(4, { displayName: localStorage.name, extra: ws.data.extra });
            };
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
            }
            switch (ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}

game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!aito" && e.uid == game.world.myUid) {
        window.startaito = !window.startaito;
        dispatchEvent(new CustomEvent("toggleAitoFromChatCommand"));
        window.sendAitoAlt();
    }
})

// ==UserScript==
// @name         Auto ReBuilder
// @namespace    -
// @version      0.1
// @description  kek, press SHIFT+\ to toggle, since its not enabled by default
// @author       ehScripts
// @match        zombs.io
// @icon         data:image/png;base64,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
// @grant        none
// ==/UserScript==

'use strict';

let toggle;
let rebuildData = [];
let rebuiltTowers = [];
let waitRebuildData = [];

window.toggleRebuilder = () => {
    return (toggle = !toggle);
};

window.getRebuilderToggle = () => {
    return toggle;
};

addEventListener('keydown', function(e) {
    if(document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if(e.key === "|") {
            let tglrb = window.toggleRebuilder();
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
    if (e.message == "!rb" && e.uid == game.world.myUid) {
        let tglrb = window.toggleRebuilder();
        new Noty({
            type: 'success',
            text: `ReBuilder toggle is now ${tglrb}`,
            timeout: 2000
        }).show();
        dispatchEvent(new CustomEvent("rebuilderToggleFromChatCommand"));
    }
})

window.noty3x = function() {
    new Noty({
        type: 'success',
        text: `3x3 Walls toggle is now ${window.x3builds}`,
        timeout: 2000
    }).show();
};

const onFailure = (data) => {
    let reason = data.reason;
    if(["ObstructonsArePresent", "PartyBuildingObstructionsArePresent"].includes(reason) && toggle) {
        // Something is blocking the building placement.... Who knows?
    };
};

game.network.addRpcHandler("Failure", onFailure);

game.network.addRpcHandler("LocalBuilding", (data) => {
    if(!toggle) { return; };
    for(let e of data) {
        if(!!e.dead) {
            rebuildData.push(`${e.x} - ${e.y} - ${e.tier}`);
            let snb = e;
            snb.name = "MakeBuilding";
            snb.yaw = e.yaw || 0;
            game.network.sendRpc(snb);
            continue;
        };
        if(!rebuildData.includes(`${e.x} - ${e.y} - ${e.tier}`)) { continue; };
        let args = rebuildData[rebuildData.indexOf(`${e.x} - ${e.y} - ${e.tier}`)].split(" - ").map(i => parseInt(i));
        if(!e.dead && e.x == args[0] && e.y == args[1]) {
            setTimeout(() => {
                for(let i = 1; i < args[2]; i++) {
                    game.network.sendRpc({ name: "UpgradeBuilding", uid: e.uid });
                };
                rebuiltTowers.push(`${e.x} - ${e.y} - ${args[2]} - ${e.yaw} - ${e.type} - ${e.uid}`);
            }, game.world.replicator.msPerTick);
        };
    };
});

var map = document.getElementById("hud-map");
let markerId = 1;

window.addMarker = () => {
    map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left) - 4}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top) - 12}%; position: absolute;" class='map-display'><i class='fa fa-map-marker'>${markerId++}</i></div>`)
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
    if (!window.oldWs2) {
        window.oldWs2 = true;
        for (let i = 0; i < 2; i++) {
            ltab();
        }
    }
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
game.network.sendRpc = (data) => {
    if(data.name === "MakeBuilding" && data.type === "Wall" && window.x3builds) {
        console.log(data);

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
        hno.style.display = "none"; // 2k lines, woo-hoo!
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
    };
});

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (opcode, data) => {
    window.ptOpc = opcode;
    window.ptData = data;
    dispatchEvent(new CustomEvent("sendPacket"));
    game.network.sendPacket2(opcode, data);
};

/*** TROLLERS ***/

// server scanner (serverObj has the data)

localStorage.wsEnv = "wss://idealglisteningprocessors.thethe4.repl.co/";
localStorage.isxyzAllowed = "1";
localStorage.haspassword = "ytrsmoon==?1.";

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
game.network.addEnterWorldHandler(e => {
    thisInfo.uid = e.uid;
    thisInfo.name = e.effectiveDisplayName;
    thisInfo.host = game.network.socket.url;
    thisInfo.active = true;
    console.log("Selam");
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

                   let playerHealth = (myPlayer.health/myPlayer.maxHealth) * 100;
                        if (playerHealth <= 10) {
                        if (!window.playerTimeout_1) {
                        window.playerTimeout_1 = true;
                        setTimeout(() => {
                            window.playerTimeout_1 = false;
                        }, 300)
                        healPlayer();
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
            window.lm = window.follow ? "Nearest Player" : "Off";
            dispatchEvent(new CustomEvent("efToggleByKeybind"));
            new Noty({
                type: 'success',
                text: `Nearest Player Follower toggle is now ${window.follow.toggle}`,
                timeout: 2000
            }).show();
        };
        if(e.key === "#") {
            window.x3builds = !window.x3builds;
            new Noty({
                type: 'success',
                text: `3x3 Walls toggle is now ${window.x3builds}`,
                timeout: 2000
            }).show();
        };
    };
})

window.stashspawn = psk => {
    for(let sck of sockets) {
        if(sck.readyState === 1) { sck.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: psk }); sck.network.sendInput({ respawn: 1 }); };
    };
};

(function() { // modified private parties tab code, except the new tab in the party menu is used differently (not private parties)
    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }

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
  <input id="psk" placeholder="Party share key..." value="abcdefghijklmnopqr" class="btn" /><button class="btn btn-green" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Join Party by Share Key (1)</button>
  <input id="psk2" placeholder="Party share key (2)..." value="qwertyuiopasdfghjk" class="btn" /><button class="btn btn-green" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk2').value })">Join Party by Share Key (2)</button>
  <input id="psk3" placeholder="Party share key (3)..." value="klzxcvbnmlkjhgfdsa" class="btn" /><button class="btn btn-green" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk3').value })">Join Party by Share Key (3)</button>
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
        getId("privateHud2").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk} <a href="${lnk}" target="_blank" color="blue">[Link]</a></p></div><button class="btn btn-blue" id="${cpKeyId}" style="display:inline-block;">Copy Key</button><button class="btn btn-blue" id="${cpLnkId}" style="display:inline-block;">Copy Link</button><br />`
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
    for(let i of Object.values(e.entities)) {
        if((i !== true) && ["CannonTower", "MeleeTower", "Harvester", "ArrowTower", "MagicTower", "GoldMine", "BombTower"].includes(i.model)) {
            if((i.health < 65) && tower65palarm) {
                !onlyOpenOnceOnTimeout && (onlyOpenOnceOnTimeout = true, videoalert(), setTimeout(() => {onlyOpenOnceOnTimeout = false}, 14000))
            };
        };
    };
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

    document.getElementsByClassName("alarm")[0].className = document.getElementsByClassName("alarm")[0].className.replace(isOnOrNot ? "green" : "red", isOnOrNot ? "red" : "green");

}

stashHitAlarm = () => {
    stashhitalarm = !stashhitalarm;

    document.getElementsByClassName("stashHitAlarm")[0].innerText = document.getElementsByClassName("stashHitAlarm")[0].innerText.replace(stashhitalarm ? "Enable" : "Disable", stashhitalarm ? "Disable" : "Enable");

    document.getElementsByClassName("stashHitAlarm")[0].className = document.getElementsByClassName("stashHitAlarm")[0].className.replace(stashhitalarm ? "green" : "red", stashhitalarm ? "red" : "green");

}

deadAlarm = () => {
    deadalarm = !deadalarm;

    document.getElementsByClassName("deadAlarm")[0].innerText = document.getElementsByClassName("deadAlarm")[0].innerText.replace(deadalarm ? "Enable" : "Disable", deadalarm ? "Disable" : "Enable");

    document.getElementsByClassName("deadAlarm")[0].className = document.getElementsByClassName("deadAlarm")[0].className.replace(deadalarm ? "green" : "red", deadalarm ? "red" : "green");

}

disconnectAlarm = () => {
    disconnectalarm = !disconnectalarm;

    document.getElementsByClassName("disconnectAlarm")[0].innerText = document.getElementsByClassName("disconnectAlarm")[0].innerText.replace(disconnectalarm ? "Enable" : "Disable", disconnectalarm ? "Disable" : "Enable");

    document.getElementsByClassName("disconnectAlarm")[0].className = document.getElementsByClassName("disconnectAlarm")[0].className.replace(disconnectalarm ? "green" : "red", disconnectalarm ? "red" : "green");

}

health65pAlarm = () => {
    health65palarm = !health65palarm;

    document.getElementsByClassName("health65pAlarm")[0].innerText = document.getElementsByClassName("health65pAlarm")[0].innerText.replace(health65palarm ? "Enable" : "Disable", health65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("health65pAlarm")[0].className = document.getElementsByClassName("health65pAlarm")[0].className.replace(health65palarm ? "green" : "red", health65palarm ? "red" : "green");

}

pingAlarm = () => {
    pingalarm = !pingalarm;

    document.getElementsByClassName("pingAlarm")[0].innerText = document.getElementsByClassName("pingAlarm")[0].innerText.replace(pingalarm ? "Enable" : "Disable", pingalarm ? "Disable" : "Enable");

    document.getElementsByClassName("pingAlarm")[0].className = document.getElementsByClassName("pingAlarm")[0].className.replace(pingalarm ? "green" : "red", pingalarm ? "red" : "green");

}

tower65pAlarm = () => {
    tower65palarm = !tower65palarm;

    document.getElementsByClassName("tower65pAlarm")[0].innerText = document.getElementsByClassName("tower65pAlarm")[0].innerText.replace(tower65palarm ? "Enable" : "Disable", tower65palarm ? "Disable" : "Enable");

    document.getElementsByClassName("tower65pAlarm")[0].className = document.getElementsByClassName("tower65pAlarm")[0].className.replace(tower65palarm ? "green" : "red", tower65palarm ? "red" : "green");

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
    var m = date.getMinutes(); // 3k lines!
    var s = date.getSeconds()
    var session = "PM";

    if(h == 2){
        h = 12;
    };


    if(h > 12){
        session = "PM";
        h -= 12;
    };
    if(h < 12) {
        session = "AM"
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
    // sjfksljdf
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
        document.getElementById("hiu").innerHTML = `Hello, ${username}!`;
        window.username = username;
        localStorage.ig_auth = JSON.stringify({ username: username, password: password });
    };
};

window.siGN = (username, password) => {
    let k = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
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
        document.getElementById("hiu").innerHTML = `Hello, ${username}!`;
        window.username = username;
        localStorage.ig_auth = JSON.stringify({ username: username, password: password });
    };
};

window.sgNO = () => {
    document.getElementById("act").style.display = "none";
    document.getElementById("bfl").style.display = "block";
    localStorage.ig_auth = undefined;
};

document.getElementsByClassName('hud-center-left')[0].insertAdjacentHTML("beforebegin", `
<div id="zsd">
    <button class="btn btn-blue" style="position: absolute; top: ${32}%; left: ${devicePixelRatio}%; position: absolute; z-index: 14;" onclick="window.zoomOut();">
        <i class="fa fa-arrow-up fa-2x" style="margin-top: 5px;"></i>
    </button>
    <input type='range' style='-webkit-appearance: slider-vertical; position: absolute; top: ${39}%; left: ${devicePixelRatio}%; position: absolute; z-index: 14;' id="zoomSlider" min=0.2 max=24 value=1 step=0.02 />
    <button class="btn btn-red" style="position: absolute; top: ${38}%; left: ${8}%; position: absolute; z-index: 14; height: ${25}%;" onclick="window.resetZoom();">
        <i class="fa fa-undo fa-2x"></i>
    </button>
    <button class="btn btn-blue" style="position: absolute; z-index: 14; top: ${59}%; left: ${devicePixelRatio}%;" onclick="window.zoomIn();">
        <i class="fa fa-arrow-down fa-2x" style="margin-top: 5px;"></i>
    </button>
</div>`);

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

window.userPg = username => {
    let ud = window.httpGet(`https://readypoisedlegacy.nathaniel009.repl.co/user?username=${encodeURIComponent(username)}`);
    ud = JSON.parse(ud);
    ud.username = username;
    currentTabs[getTabById(window.focusedTab).ict].ud = ud;
    window.redirectTab(`${qryify2(username)}`, "userpg");
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
};// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();