// ==UserScript==
// @name         Water|Client
// @author       Azi Acosta
// @description  next time dont use Hack!,,,,, Credits to essa & Smiley
// @version      v1
// @match        *://*.moomoo.io/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1160549
// @downloadURL https://update.greasyfork.org/scripts/474004/Water%7CClient.user.js
// @updateURL https://update.greasyfork.org/scripts/474004/Water%7CClient.meta.js
// ==/UserScript==
document.getElementById("pingDisplay").style.color = "FFC0CB"
document.getElementById("killCounter").style.color = "FFC0CB"
document.getElementById("killCounter").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("scoreDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("foodDisplay").style.color = "FFC0CB"
document.getElementById("foodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("woodDisplay").style.color = "FFC0CB"
document.getElementById("woodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("stoneDisplay").style.color = "FFC0CB"
document.getElementById("stoneDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("leaderboard").style.color = "FFC0CB"
document.getElementById("leaderboard").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById('chatBox').style.color = "FFC0CB"
document.getElementById('chatBox').style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("ageText").style.color = "FFC0CB"
document.getElementById('chatButton').style.color = "FFC0CB"
document.getElementById("chatButton").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("ageBar").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("ageBarBody").style.backgroundColor = "FFC0CB"
document.getElementById("mapDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("allianceButton").style.color = "FFC0CB"
document.getElementById("allianceButton").style.backgroundColor = "rgba(0, 0, 0, 0.20)"
document.getElementById("storeButton").style.color = "FFC0CB"
document.getElementById("storeButton").style.backgroundColor = "rgba(0, 0, 0, 0.20)"

let connectBotts = true;
let proeMan = true;

Math.florr = Math.floor;

function setLoop(action, loop) {
    for (let i = 0; i < loop; i++) {
        action();
    }
}

const song1 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2meta.com%20-%20DJ%20Junggle%20Dutch%20Akbar%20Harjasaputra%20(128%20kbps).mp3");
const song2 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2meta.com%20-%20SOUND%20JJ%20KECE%20(128%20kbps).mp3");
const song3 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2meta.com%20-%20DJ%20Enakeun%20V9%20(%20Slowed%20%26%20Reverb%20)%20%F0%9F%8E%A7%20(128%20kbps).mp3");
const song4 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20sahara%20x%20rave%20%20hensonn%20x%20rave%20%E3%83%80%E3%83%BC%E3%82%AF%20edit%20audio.mp3");
const song5 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20DJ%20We%20Make%20It%20Bounce%20X%20Just%20Like%20The%20Day%20%20Two%20Versions%20%20Reverb%20%20.mp3");
const song6 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20DJ%20PaijoZaskia%20Gotik%20%20GAMELAN%20MUMET%20%20SOUND%20EDIT%20%20FULL%20VIRAL%20CR%20YT%20YANZ%202022%20.mp3");
const song7 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20DJ%20ON%20THE%20FLOUR%20X%20PAPA%20PILIH%20MANTANKU%20TERBARU%202023%20MENGKANE%20FYP%20TIK%20TOK.mp3");
const song8 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20Sound%20Jedag%20Jedug%20Zersofboy%20%20Slow%20%20Reverb%20%20Mengkane%20Full%20Bass.mp3");
const song9 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20DJ%20TANGKIS%20DANG%20X%20EMISAWELOW%20JEDAG%20JEDUG%20SLOW%20BEAT%20MENGKANE%20VIRAL%20FYP%20TIKTOK.mp3")
const song10 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20Jantung%20Bergoyang%20V2.mp3")
const song11 = new Audio("https://github.com/EssaProgrammer/audioupload/raw/main/y2mate.com%20-%20DJ%20Ganteng%20%20Cantik%20Viral%20Tiktok%20%20Slowed%20%20Reverb%20%20.mp3")
const stopsong = new Audio("https://ve59.aadika.xyz/download/jL7HcpzNcv4/mp3/128/1689832207/7ada895a3116251822a5c810b43bf4e2429724f4824e02659129bb7dd1853c6e/1?f=X2Download.app")



function getEl(id) {
    return document.getElementById(id);
}
let firstConfig = [];
let streamerMode = false;
const HTML = {
    newLine: function(amount) {
        let text = ``;
        for (let i = 0; i < amount; i++) {
            text += `<br>`;
        }
        return text;
    },
    line: function() {
        return `<hr>`;
    },
    text: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = "${value}" maxlength = ${length} style = "border-radius: 5px;">`;
    },
    checkBox: function(id, name, checked, rl) {
        return `${rl ? name + ` ` : ``}<input type = "checkbox" ${checked ? `checked` : ``} id = ${id}>${rl ? `` : ` ` + name}`;
    },
    button: function(id, name, onclick, classs) {
        return `<button class = ${classs} id = ${id} onclick = ${onclick}>${name}</button>`;
    },
    select: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value} ${e.selected ? ` selected` : ``}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select>`;
            }
        }
                       );
        return text;
    },
    modChange: function(id, selects) {
        console.log("test");
    },
    mod: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value + "C"}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select> `;
            }
            if (i == 0) {
                firstConfig.push(e.value + "C");
            }
        }
                       );
        selects.forEach((e,i)=>{
            text += `<input type = "checkbox"  ${e.checked ? `checked` : ``} id = ${e.value} style = "${i == 0 ? "display: inline-block;" : "display: none;"}">`;
        }
                       );
        return text;
    },
    hotkey: function(id, value, size, length) {
        return `<input style = "border-radius: 5px;" type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}><input type = "checkbox" checked id = ${id + "k"}>`;
    },
};

function getTabId(el) {
    return el.id == "tHome" ? "homeTab" : el.id == "t1" ? "miscTab" : el.id == "t2" ? "configTab" : el.id == "t3" ? "combatTab" : "homeTab";
}

function changer() {
    getEl("homeTab").style.display = "none";
    getEl("miscTab").style.display = "none";
    getEl("configTab").style.display = "none";
    getEl("combatTab").style.display = "none";
    getEl("tHome").style.border = "2px solid transparent";
    getEl("tHome").style.color = "#000000";
    getEl("tHome").style.backgroundColor = "#fff";
    for (let i = 1; i <= 3; i++) {
        getEl("t" + i).style.border = "2px solid transparent";
        getEl("t" + i).style.color = "#000000";
        getEl("t" + i).style.backgroundColor = "#fff";
    }
}

function changeDisp(el) {
    changer();
    getEl(el.id).style.color = "#000";
    getEl(el.id).style.backgroundColor = "#fff";
    getEl(el.id).style.border = "2px solid #000";
    getEl(getTabId(el)).style.display = "block";
}
let updateLogs = `
Toggle:${HTML.newLine(1)}
${HTML.checkBox("ranName", "randomName", false)}${HTML.newLine(1)}
`;
let Wut = "Select";
// menu html
let modMenus = document.createElement("div");
modMenus.id = "modMenus";
document.body.append(modMenus);
modMenus.style = `
display: block;
padding: 10px;
background-color: rgba(0, 0, 0, 0);
border-radius: 10px;
position: absolute;
left: 20px;
top: 20px;
width: 250px;
height: 2000;
transition: 1s;
border-style: solid;
border-width: 2px;
border-color: #ffffff;
`;
let canmove = true;

function updateInnerHTML() {
    modMenus.innerHTML = `
    <style>
    .tabchange {
    color: #fff;
    background-color: #000;
    border: 2px solid transparent;
    border-radius: 4px;
    text-align: center;
    height: 25px;
    }
    .menuTabs {
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    }
    .holder {
    padding-left: 1em;
    }
    .nothing {
    }
    </style>
    <script>
    function test() {
    console.log("call");
    }
    </script>
    <div id = "headline" style = "font-size: 30px; color: rgb(255, 255, 255);">
    <div style = "font-size: 30px" >Water Client V1</div>
    <div class = "menuTabs">
    ${HTML.button("tHome", "Home", "", "tabchange")}
    ${HTML.button("t1", "page 1", "", "tabchange")}
    ${HTML.button("t2", "page 2", "", "tabchange")}
    ${HTML.button("t3", "page 3", "", "tabchange")}
    </div>
    <div style = "font-size: 12px; overflow-y: scroll; max-height: 320px;" max-width: 150px;>
    <div id = "homeTab" style = "display: block">
    <div id = "priXP">Primary XP: 0 / not found</div>
    <div id = "secXP">Seconadry XP: 0 / not found</div>
    <div id = "healer">Healer: High Ping</div>
    </div>
    <div id = "miscTab" style = "display: none">
    Create clan: ${HTML.text("ccv", "ü", "20", "7")}${HTML.newLine(1)}
    ${HTML.button("ccf", "Create clan", `document.createAlliance(document.getElementById("ccv").value)`, "nothing")}${HTML.newLine(1)}
    ${HTML.select("autoupgrade", [{
        name: "Autoupgrade to DH",
        value: "dh",
    }, {
        name: "Autoupgrade to KH",
        value: "kh",
    }, {
        name: "Autoupgrade to SM",
        value: "sm",
    }, ])}${HTML.newLine(1)}
    7-Slot: ${HTML.select("7slot", [{
        name: "Teleporter",
        value: "38",
    }, {
        name: "Turret",
        value: "33",
    }, ])}${HTML.newLine(1)}
    </div>
    <div id = "configTab" style = "display: none">
    ${HTML.mod("configs", [{
        name: "AddAdditionalRangeOnLag",
        value: "addictdist",
        checked: true
    }, {
        name: "doAntiKickAtPacketLimit",
        value: "ak",
        checked: true
    }, {
        name: "doRenderKMTexture",
        value: "kmtexture",
    }, {
        name: "doAutoBullTick",
        value: "bulltick",
    }, {
        name: "doAutoQOnSync",
        value: "antisync",
        checked: true
    }, {
        name: "doAutoQOnHighPing",
        value: "autoq",
        checked: true
    }, {
        name: "doSimpleAntiInsta",
        value: "simpleheal",
        checked: true
    }, {
        name: "doTickBasedHealing",
        value: "tickheal",
        checked: true
    }, {
        name: "doTeamSyncWithChat",
        value: "teamsync",
    }, {
        name: "doAutoSpikeTickOnReplaced",
        value: "spiketick",
        checked: true
    }, {
        name: "doUseTurretOnCounter",
        value: "countertur",
        checked: true
    }, {
        name: "doUseSecondaryOnCounter",
        value: "countersec",
    }, {
        name: "doClickCombat",
        value: "clicktype",
    }, {
        name: "doAutoSpinning",
        value: "spin",
    }, {
        name: "doBuildingHealth",
        value: "bh",
        checked: true
    }, {
        name: "doRenderDark",
        value: "darkmode",
        checked: true
    }, {
        name: "doRenderShadow (CANT TURN OFF)",
        value: "shadowss",
    }, {
        name: "doShowStackedAnimtext",
        value: "stacktext",
    }, {
        name: "doDisableAnimtext",
        value: "hidetext",
    }, {
        name: "doUpperCaseChatting",
        value: "chatc",
    }, {
        name: "doTryHardMode",
        value: "tryhard",
    }, {
        name: "doAlwaysRevInsta",
        value: "alwaysrev",
        checked: true
    }, {
        name: "doAlwaysSyncRevInsta",
        value: "alwayssyncrev",
    }, {
        name: "doAlwaysSpikeInstaTurnOn",
        value: "alwayspikess",
    }, {
        name: "doCommandChat",
        value: "comchatss",
    }, {
        name: "doShowClanOnLeaderboard",
        value: "clanleaderbo",
    }, {
        name: "doAlwaysAutoAimIfClick",
        value: "autoaimclick",
    }, {
        name: "doAutoChangeWeapons",
        value: "weaponsautoch",
        checked: true
    }, {
        name: "doRevTurretGearInsta",
        value: "revturretins",
        checked: true
    }, {
        name: "doPlaceSpikeBoost",
        value: "placeboostss",
    }, {
        name: "DoLineTracer",
        value: "linetracer",
        checked: true
    }, {
        name: "DoSmoothCamera",
        value: "stmooshcamera",
    }, ])}${HTML.newLine(1)}
    <div id = "freeCam">Freecam: none</div>
    <div id = "boosttrue">Spike boost: false</div>
    <div id = "instaspiketrue">Spike insta: false</div>
    Freecam hotkey: ${HTML.hotkey("freecumLOL", "/", "2", "1")}${HTML.newLine(1)}
    4 placer hotkey: ${HTML.hotkey("stonespawn", "[", "2", "1")}${HTML.newLine(1)}
    Bow Insta hotkey: ${HTML.hotkey("bowinstakey", "g", "2", "1")}${HTML.newLine(1)}
    One Tick hotkey: ${HTML.hotkey("zeroframe", "t", "2", "1")}${HTML.newLine(1)}
    Insta by essa hotkey: ${HTML.hotkey("essainsta", "m", "2", "1")}${HTML.newLine(1)}
    New insta sword hotkey: ${HTML.hotkey("newinstaspike", "y", "2", "1")}${HTML.newLine(1)}
    Toggle insta spike hotkey: ${HTML.hotkey("instawithspike", "F", "2", "1")}${HTML.newLine(1)}
    Age 2 insta hotkey: ${HTML.hotkey("ageinstass", "i", "2", "1")}${HTML.newLine(1)}
    Team Sync shot hotkey: ${HTML.hotkey("synckey", "b", "2", "1")}${HTML.newLine(1)}
    Team Sync primary hotkey: ${HTML.hotkey("syncprikey", ".", "2", "1")}${HTML.newLine(1)}
    Team Sync insta hotkey: ${HTML.hotkey("syncinstakey", "u", "2", "1")}${HTML.newLine(1)}
    Debug hotkey: ${HTML.hotkey("debugkey", "Z", "2", "1")}${HTML.newLine(1)}
    chatshortcut hotkey: ${HTML.hotkey("chatskey", "j", "2", "1")}${HTML.newLine(1)}
    Spike hotkey: ${HTML.hotkey("spikekey", "v", "2", "1")}${HTML.newLine(1)}
    Trap/Boost hotkey: ${HTML.hotkey("trapkey", "f", "2", "1")}${HTML.newLine(1)}
    Walls hotkey (bug): ${HTML.hotkey("wallsskeyss", "B", "2", "1")}${HTML.newLine(1)}
    Turret/Teleport hotkey: ${HTML.hotkey("turretkey", "h", "2", "1")}${HTML.newLine(1)}
    Automill hotkey: ${HTML.hotkey("millkey", "z", "2", "1")}${HTML.newLine(1)}
    Toggle boost spike hotkey: ${HTML.hotkey("boostsspikes", ",", "2", "1")}${HTML.newLine(1)}
    Toggle chat mod hotkey: ${HTML.hotkey("chatmod", "n", "2", "1")}${HTML.newLine(1)}
    Connectbot hotkey: ${HTML.hotkey("botkey", "G", "2", "1")}${HTML.newLine(1)}
    Zoom hotkey: ${HTML.hotkey("zoomkey", "-", "2", "1")}${HTML.newLine(1)}
    Zoom reset key: ${HTML.hotkey("zoomresetkey", "=", "2", "1")}${HTML.newLine(1)}
    Song hotkey: ${HTML.hotkey("songkey", "C", "2", "1")}${HTML.newLine(1)}
    Song: ${HTML.select("songs", [{
        name: "DJ Junggle Dutch",
        value: "1",
    }, {
        name: "sound jedag jedug kece",
        value: "2",
    }, {
        name: "DJ Enakeun V9",
        value: "3",
    }, {
        name: "hensonn sahara x dxrk rave",
        value: "4",
         selected: true
    }, {
        name: "we make it bounce jedag jedug",
        value: "5",
    }, {
        name: "dj paijo mumet ndase",
        value: "6",
    }, {
        name: "dj on the floor x gak tau",
        value: "7",
    }, {
        name: "dj zerz softboy jedag jedug",
        value: "8",
    }, {
        name: "dj tangkis dang",
        value: "9",
    }, {
        name: "jantung bergoyang v2",
        value: "10",
    }, {
        name: "DJ Ganteng / Cantik",
        value: "11",
    }, {
        name: "stop song",
        value: "12",
    }, ])}${HTML.newLine(1)}
    AutoGG: ${HTML.select("autogg", [{
        name: "kills",
        value: "1",
    }, {
        name: "why die so ass",
        value: "2",
    }, {
        name: "ez lol",
        value: "3",
    }, {
        name: "AutoGG Water|Client",
        value: "4",
        selected: true
    }, {
        name: "AutoGG Water|Client",
        value: "5",
    }, {
        name: "write below",
        value: "6",
    }, {
        name: "your name + kills",
        value: "7",
    }, {
        name: "write + kills",
        value: "8",
    }, {
        name: "Kid Dieds: kills",
        value: "9",
    }, ])}${HTML.newLine(1)}
    Write: ${HTML.text("killschats", "AutoGG | Tick | Race Master", "15", "30")}${HTML.newLine(1)}
    ${HTML.checkBox("secondkillschat", "Second AutoGG", true, true)}${HTML.text("killchatse", "Im Better", "6", "30")}${HTML.newLine(1)}
    ${HTML.checkBox("thkillshat", "Third AutoGG", true, true)}${HTML.text("killchattee", "Why Die Too Noob", "6", "30")}${HTML.newLine(1)}
    Bow insta mode: ${HTML.select("modebow", [{
        name: "bow + crossbow + musket",
        value: "1",
        selected: true
    }, {
        name: "bow + crossbow + repeater",
        value: "2",
    }, ])}${HTML.newLine(1)}
    spike insta mode: ${HTML.select("modeinspi", [{
        name: "1 spike",
        value: "1",
    }, {
        name: "2 spike",
        value: "2",
        selected: true
    }, {
        name: "trap + spike",
        value: "3",
    }, ])}${HTML.newLine(1)}
    4 placer mode: ${HTML.select("modestone", [{
        name: "Walls",
        value: "1",
    }, {
        name: "Spikes",
        value: "2",
    }, {
        name: "Windmills",
        value: "3",
    }, {
        name: "Trap/Boosts",
        value: "4",
    }, {
        name: "Teleport/Turrets/mine",
        value: "5",
        selected: true,
    }, ]
    )}${HTML.newLine(1)}
    one tick mode: ${HTML.select("modezerotick", [{
        name: "One tick v1",
        value: "1",
        selected: true
    }, {
        name: "One tick v2",
        value: "2",
    }, {
        name: "Polearm and Hammer",
        value: "3",
    }, {
        name: "Katana tick",
        value: "4",
    }, ])}${HTML.newLine(1)}
    insta mode: ${HTML.select("instamode", [{
        name: "v1",
        value: "1",
        selected: true
    }, {
        name: "v2",
        value: "2",
    }, ])}${HTML.newLine(1)}
      ${HTML.checkBox("showch", "sendChatPacket", true, true)}${HTML.newLine(1)}
    Ratio hotkey: ${HTML.hotkey("ezkey", "p", "2", "1")}${HTML.newLine(1)}
    Vision: ${HTML.select("vision", [{
        name: "1",
        value: "1",
    }, {
        name: "1.1",
        value: "1.1",
    }, {
        name: "1.2",
        value: "1.2",
    }, {
        name: "1.3",
        value: "1.3",
    }, {
        name: "1.4",
        value: "1.4",
    }, {
        name: "1.5",
        value: "1.5",
        selected: true
    }, ])}${HTML.newLine(1)}
    ExtraCombat(Beta): ${HTML.select("combat", [{
        name: "Default",
        value: "0",
    }, {
        name: "Gehro",
        value: "hans",
        selected: true,
    }, {
        name: "Spyder",
        value: "spyder",
    }, {
        name: "L._.re",
        value: "lore",
    }, {
        name: "Celestial",
        value: "cele",
    }, {
        name: "zeph",
        value: "zeph",
    }, {
        name: "Ae86",
        value: "ae",
    }, {
        name: "FlareZ",
        value: "fz",
    }, {
        name: "Zyenith",
        value: "zyenith",
    }, {
        name: "Ueheua",
        value: "me",
    }, ])} - <div id = "crp" style = "display: inline-block;">lol ur bad</div>${HTML.newLine(1)}
    ExtraVisual: ${HTML.select("visual", [{
        name: "Default",
        value: "0",
    }, {
        name: "essa",
        value: "hans",
        selected: true,
    }, {
        name: "Spyder",
        value: "spyder",
    }, {
        name: "L._.re",
        value: "lore",
    }, {
        name: "Celestial",
        value: "cele",
    }, {
        name: "Zeph",
        value: "zeph",
    }, {
        name: "Ae86",
        value: "ae",
    }, {
        name: "FlareZ",
        value: "fz",
    }, {
        name: "Zyenith",
        value: "zyenith",
    }, {
        name: "Ueheua",
        value: "me",
    }, ])} - <div id = "vrp" style = "display: inline-block;">lol ur b a d</div>${HTML.newLine(1)}
    </div>
    <div id = "combatTab" style = "display: none">
    (region locked) ${HTML.button("serverwarper", "Warp to Active Server", `document.warpServer()`, "nothing")}${HTML.newLine(2)}
    Object for the placer: ${HTML.select("placeconfig", [{
        name: "Walls",
        value: "1",
    }, {
        name: "Spikes",
        value: "2",
    }, {
        name: "Windmills",
        value: "3",
        selected: true,
    }, {
        name: "Trap/Boosts",
        value: "4",
    }, {
        name: "Teleport/Turrets",
        value: "5",
    }, ])}${HTML.newLine(2)}
    One-way: ${HTML.button("streamer", "Streamer Mode", "", "nothing")}${HTML.newLine(2)}
    farm
    <div class = "holder">
    ${HTML.checkBox("grind", "autoRuby", false)}${HTML.newLine(1)}
    ${HTML.checkBox("grindsec", "autoRubySec", true)}${HTML.newLine(1)}
    </div>
    anti
    <div class = "holder">
    ${HTML.checkBox("soldieranti", "soldierAntiInsta", true)}${HTML.newLine(1)}
    ${HTML.checkBox("soldierempanti", "soldierEmpAntiInsta", true)}${HTML.newLine(1)}
    ${HTML.checkBox("antitick", "anti0Tick", true)}${HTML.newLine(1)}
    ${HTML.checkBox("antirange", "antiRangedInsta", true)}${HTML.newLine(1)}
    </div>
    autoBreak
    <div class = "holder">
    ${HTML.checkBox("earlyab", "early", true)}${HTML.newLine(1)}
    earlyWaitTime ${HTML.newLine(1)}
    ${HTML.text("earlytime", "10", "6", "5")}${HTML.newLine(1)}
    ${HTML.checkBox("abactive", "activate", true)}${HTML.newLine(1)}
    ${HTML.checkBox("ab360hit", "breakitems(Patched)", false)}${HTML.newLine(1)}
    ${HTML.checkBox("abplace", "tryPlacementEveryTick", false)}${HTML.newLine(1)}
    </div>
    music
    <div class = "holder">
    ${HTML.checkBox("msync", "sync", true)}${HTML.newLine(1)}
    </div>
    autoTrigger
    <div class = "holder">
    ${HTML.checkBox("sync", "syncShots (no chat)", false)}${HTML.newLine(1)}
    ${HTML.checkBox("syncsss", "syncShots (with chat)", false)}${HTML.newLine(1)}
    ${HTML.checkBox("syncpole", "syncPolearm (no chat)", false)}${HTML.newLine(1)}
    ${HTML.checkBox("syncpri", "syncPrimary (with chat)", false)}${HTML.newLine(1)}
    ${HTML.checkBox("syncinsta", "syncInsta", false)}${HTML.newLine(1)}
    syncThrottle: ${HTML.text("synccount", "1", "6", "2")}${HTML.newLine(1)}
    sync shot chat: ${HTML.text("syncschats", "Pew", "6", "20")}${HTML.newLine(1)}
    sync primary chat: ${HTML.text("syncschatpri", "Piw", "6", "20")}${HTML.newLine(1)}
    sync insta chat: ${HTML.text("syncschatinsta", "Paw", "6", "20")}${HTML.newLine(1)}
    </div>
    mouse
    <div class = "holder">
    ${HTML.checkBox("clicksync", "mclickSync", false)}${HTML.newLine(1)}
    </div>
    autoQ
    <div class = "holder">
    ${HTML.checkBox("evautoq", "alwaysOn", false)}${HTML.newLine(1)}
    </div>
    placement
    <div class = "holder">
    ${HTML.checkBox("replc", "autoreplace", true)}${HTML.newLine(1)}
    ${HTML.checkBox("autoplc", "placeEveryTick", true)}${HTML.newLine(1)}
    </div>
    messages
    <div class = "holder">
    ${HTML.checkBox("eautochat", "autoChat", false)}${HTML.newLine(1)}
    ${HTML.checkBox("esyncteams", "teamSyncChat", false)}${HTML.newLine(1)}
    ${HTML.checkBox("chatshort", "chatShortcut", false)}${HTML.text("chatshorttext", "hi", "6", "25")}${HTML.newLine(1)}
    ${HTML.checkBox("chattypingsss", "chatTyping", false)}${HTML.text("chattypingtext", "Typing", "6", "25")}${HTML.newLine(1)}
    Typing type: ${HTML.select("typengtypi", [{
        name: "...",
        value: "1",
        selected: true,
    }, {
        name: ".-+_",
        value: "2",
    }, {
        name: "ABCD",
        value: "3",
    }, ])}${HTML.newLine(1)}
    </div>
    autoUpgrade
    <div class = "holder">
    ${HTML.checkBox("aaauaua", "activate", false)}${HTML.newLine(1)}
    </div>
    </div>
    </div>
    `;
}

let isDragging = false;
let offset = { x: 0, y: 0 };

modMenus.addEventListener('mousedown', (event) => {
  isDragging = true;
  offset.x = event.clientX - modMenus.offsetLeft;
  offset.y = event.clientY - modMenus.offsetTop;

  modMenus.style.transition = 'none';
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const left = event.clientX - offset.x;
    const top = event.clientY - offset.y;
    modMenus.style.left = `${left}px`;
    modMenus.style.top = `${top}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;

  modMenus.style.transition = '';
});

updateInnerHTML();
changeDisp(getEl("tHome"));
getEl("tHome").onclick = function() {
    changeDisp(this);
}
;
getEl("t1").onclick = function() {
    changeDisp(this);
}
;
getEl("t2").onclick = function() {
    changeDisp(this);
}
;
getEl("t3").onclick = function() {
    changeDisp(this);
}
;
getEl("streamer").onclick = function() {
    streamerMode = !streamerMode;
}
;
getEl("ccv").onfocus = function() {
    canmove = false;
};
getEl("ccv").onblur = function() {
    canmove = true;
};
let oldSelect = firstConfig[0];
let newSelect = firstConfig[0];
getEl("configs").onchange = function() {
    let value = getEl("configs").value;
    let sliced = function(val) {
        return val.slice(0, val.length - 1);
    };
    oldSelect = newSelect;
    newSelect = value;
    getEl(sliced(oldSelect)).style.display = "none";
    getEl(sliced(newSelect)).style.display = "inline-block";
}
;
function checkCheckChickenModV69(a) {
    let aw = a == "0" ? "Legit" : a == "spyder" ? "Quasar Beta v0.83" : a == "lore" ? "L._.re FZ Lover" : a == "zeph" ? "J Mod" : a == "cele" ? "Goofy Ahh Mod" : a == "ae" ? "Alpine A110" : a == "fz" ? "RV2" : a == "zyenith" ? "RV3" : a == "me" ? "Pre Client V69420" : a == "hans" ? "Water Client" : "U r bad";
    return aw;
}

getEl("crp").innerHTML = checkCheckChickenModV69(getEl("combat").value);
getEl("vrp").innerHTML = checkCheckChickenModV69(getEl("visual").value);

document.gototouchgrass = function() {
    window.onbeforeunload = undefined;
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
}

let urGameRegion = "";
let botSockets = [];
let firstMan = true;
let manClan = undefined;
let healLag = 100;
var secPacket = 0;
var minPacket = 0;
var secMax = 110;
var minMax = 5100;
var secTime = 1000;
var minTime = 60000;
var firstSend = {
    sec: false,
    min: false,
};
let tmpAddress;
let wsconnected = 0;
let doMouseMove = false;
let myConfig = {
    x: 0,
    y: 0,
    sync: false,
};
let myNearAim = undefined;
let doEnemyMove = false;

function bConnect(token) {
    let o = token && new WebSocket(tmpAddress + "&token=" + encodeURIComponent(token));
    o.binaryType = "arraybuffer";
    o.firstMan = firstMan ? true : false;
    firstMan = false;
    if (o.firstMan) {
        o.allianceNotifications = [];
        o.tickC = 0;
    }

    function wsSend(ms) {
        o.send(new Uint8Array(Array.from(window.msgpack.encode(ms))));
    }

    function botSpawn() {
        wsSend(["sp", [{
            name: "essa-PrO fan",
            moofoll: 1,
            skin: 6,
        }]]);
    }
    o.onopen = function() {
        wsconnected++;
        botSpawn();
        botSockets.push(o);
    };
    o.onclose = function() {
        if (o.firstMan) {
            firstMan = true;
        }
    };
}


/******/
(function(modules) {
    // webpackBootstrap
    /******/
    // The module cache
    /******/
    var installedModules = {};
    /******/
    /******/
    // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/
        // Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/
        // Create a new module (and put it into the cache)
        /******/
        var module = (installedModules[moduleId] = {
            /******/
            i: moduleId,
            /******/
            l: false,
            /******/
            exports: {},
            /******/
        });
        /******/
        /******/
        // Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/
        // Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/
        // Return the exports of the module
        /******/
        return module.exports;
        /******/
    }
    /******/
    /******/
    /******/
    // expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/
    // expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/
    // define getter function for harmony exports
    /******/
    __webpack_require__.d = function(exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter,
            });
            /******/
        }
        /******/
    }
    ;
    /******/
    /******/
    // define __esModule on exports
    /******/
    __webpack_require__.r = function(exports) {
        /******/
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            /******/
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module",
            });
            /******/
        }
        /******/
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        /******/
    }
    ;
    /******/
    /******/
    // create a fake namespace object
    /******/
    // mode & 1: value is a module id, require it
    /******/
    // mode & 2: merge all properties of value into the ns
    /******/
    // mode & 4: return value when already ns object
    /******/
    // mode & 8|1: behave like require
    /******/
    __webpack_require__.t = function(value, mode) {
        /******/
        if (mode & 1)
            value = __webpack_require__(value);
        /******/
        if (mode & 8)
            return value;
        /******/
        if (mode & 4 && typeof value === "object" && value && value.__esModule)
            return value;
        /******/
        var ns = Object.create(null);
        /******/
        __webpack_require__.r(ns);
        /******/
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value,
        });
        /******/
        if (mode & 2 && typeof value != "string")
            for (var key in value)
                __webpack_require__.d(ns, key, function(key) {
                    return value[key];
                }
                                      .bind(null, key));
        /******/
        return ns;
        /******/
    }
    ;
    /******/
    /******/
    // getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function(module) {
        /******/
        var getter = module && module.__esModule ? /******/
            function getDefault() {
                return module["default"];
            }
        : /******/
        function getModuleExports() {
            return module;
        }
        ;
        /******/
        __webpack_require__.d(getter, "a", getter);
        /******/
        return getter;
        /******/
    }
    ;
    /******/
    /******/
    // Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }
    ;
    /******/
    /******/
    // __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/
    /******/
    // Load entry module and return exports
    /******/
    return __webpack_require__((__webpack_require__.s = "./src/js/app.js"));
    /******/
}
)(/************************************************************************/
    /******/
    {
        /***/
        "./node_modules/bad-words/lib/badwords.js": /*!************************************************!*\
  !*** ./node_modules/bad-words/lib/badwords.js ***!
  \************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            const localList = __webpack_require__(/*! ./lang.json */
                "./node_modules/bad-words/lib/lang.json").words;
            const baseList = __webpack_require__(/*! badwords-list */
                "./node_modules/badwords-list/lib/index.js").array;
            class Filter {
                /**
                     * Filter constructor.
                     * @constructor
                     * @param {object} options - Filter instance options
                     * @param {boolean} options.emptyList - Instantiate filter with no blacklist
                     * @param {array} options.list - Instantiate filter with custom list
                     * @param {string} options.placeHolder - Character used to replace profane words.
                     * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
                     * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
                     */
                constructor(options={}) {
                    Object.assign(this, {
                        list: (options.emptyList && []) || Array.prototype.concat.apply(localList, [baseList, options.list || [], ]),
                        exclude: options.exclude || [],
                        placeHolder: options.placeHolder || "*",
                        regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                        replaceRegex: options.replaceRegex || /\w/g,
                    });
                }
                /**
                     * Determine if a string contains profane language.
                     * @param {string} string - String to evaluate for profanity.
                     */
                isProfane(string) {
                    return (this.list.filter((word)=>{
                        const wordExp = new RegExp(`\\b ${word.replace(/(\W)/g, "\\$1")}\\b`,"gi");
                        return (!this.exclude.includes(word.toLowerCase()) && wordExp.test(string));
                    }
                                            ).length > 0 || false);
                }
                /**
                     * Replace a word with placeHolder characters;
                     * @param {string} string - String to replace.
                     */
                replaceWord(string) {
                    return string.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
                }
                /**
                     * Evaluate a string for profanity and return an edited version.
                     * @param {string} string - Sentence to filter.
                     */
                clean(string) {
                    return string.split(/\b/).map((word)=>{
                        return this.isProfane(word) ? this.replaceWord(word) : word;
                    }
                                                 ).join("");
                }
                /**
                     * Add word(s) to blacklist filter / remove words from whitelist filter
                     * @param {...string} word - Word(s) to add to blacklist
                     */
                addWords() {
                    let words = Array.from(arguments);
                    this.list.push(...words);
                    words.map((word)=>word.toLowerCase()).forEach((word)=>{
                        if (this.exclude.includes(word)) {
                            this.exclude.splice(this.exclude.indexOf(word), 1);
                        }
                    }
                                                                 );
                }
                /**
                     * Add words to whitelist filter
                     * @param {...string} word - Word(s) to add to whitelist.
                     */
                removeWords() {
                    this.exclude.push(...Array.from(arguments).map((word)=>word.toLowerCase()));
                }
            }
            module.exports = Filter;
            /***/
        },
        /***/
        "./node_modules/bad-words/lib/lang.json": /*!**********************************************!*\
  !*** ./node_modules/bad-words/lib/lang.json ***!
  \**********************************************/
        /*! exports provided: words, default */
        /***/
        function(module) {
            module.exports = {
                words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah", ],
            };
            /***/
        },
        /***/
        "./node_modules/badwords-list/lib/array.js": /*!*************************************************!*\
  !*** ./node_modules/badwords-list/lib/array.js ***!
  \*************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", ];
            /***/
        },
        /***/
        "./node_modules/badwords-list/lib/index.js": /*!*************************************************!*\
  !*** ./node_modules/badwords-list/lib/index.js ***!
  \*************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            module.exports = {
                object: __webpack_require__(/*! ./object */
                    "./node_modules/badwords-list/lib/object.js"),
                array: __webpack_require__(/*! ./array */
                    "./node_modules/badwords-list/lib/array.js"),
                regex: __webpack_require__(/*! ./regexp */
                    "./node_modules/badwords-list/lib/regexp.js"),
            };
            /***/
        },
        /***/
        "./node_modules/badwords-list/lib/object.js": /*!**************************************************!*\
  !*** ./node_modules/badwords-list/lib/object.js ***!
  \**************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = {
                "4r5e": 1,
                "5h1t": 1,
                "5hit": 1,
                a55: 1,
                anal: 1,
                anus: 1,
                ar5e: 1,
                arrse: 1,
                arse: 1,
                ass: 1,
                "ass-fucker": 1,
                asses: 1,
                assfucker: 1,
                assfukka: 1,
                asshole: 1,
                assholes: 1,
                asswhole: 1,
                a_s_s: 1,
                "b!tch": 1,
                b00bs: 1,
                b17ch: 1,
                b1tch: 1,
                ballbag: 1,
                balls: 1,
                ballsack: 1,
                bastard: 1,
                beastial: 1,
                beastiality: 1,
                bellend: 1,
                bestial: 1,
                bestiality: 1,
                "bi+ch": 1,
                biatch: 1,
                bitch: 1,
                bitcher: 1,
                bitchers: 1,
                bitches: 1,
                bitchin: 1,
                bitching: 1,
                bloody: 1,
                "blow job": 1,
                blowjob: 1,
                blowjobs: 1,
                boiolas: 1,
                bollock: 1,
                bollok: 1,
                boner: 1,
                boob: 1,
                boobs: 1,
                booobs: 1,
                boooobs: 1,
                booooobs: 1,
                booooooobs: 1,
                breasts: 1,
                buceta: 1,
                bugger: 1,
                bum: 1,
                "bunny fucker": 1,
                butt: 1,
                butthole: 1,
                buttmuch: 1,
                buttplug: 1,
                c0ck: 1,
                c0cksucker: 1,
                "carpet muncher": 1,
                cawk: 1,
                chink: 1,
                cipa: 1,
                cl1t: 1,
                clit: 1,
                clitoris: 1,
                clits: 1,
                cnut: 1,
                cock: 1,
                "cock-sucker": 1,
                cockface: 1,
                cockhead: 1,
                cockmunch: 1,
                cockmuncher: 1,
                cocks: 1,
                cocksuck: 1,
                cocksucked: 1,
                cocksucker: 1,
                cocksucking: 1,
                cocksucks: 1,
                cocksuka: 1,
                cocksukka: 1,
                cok: 1,
                cokmuncher: 1,
                coksucka: 1,
                coon: 1,
                cox: 1,
                crap: 1,
                cum: 1,
                cummer: 1,
                cumming: 1,
                cums: 1,
                cumshot: 1,
                cunilingus: 1,
                cunillingus: 1,
                cunnilingus: 1,
                cunt: 1,
                cuntlick: 1,
                cuntlicker: 1,
                cuntlicking: 1,
                cunts: 1,
                cyalis: 1,
                cyberfuc: 1,
                cyberfuck: 1,
                cyberfucked: 1,
                cyberfucker: 1,
                cyberfuckers: 1,
                cyberfucking: 1,
                d1ck: 1,
                damn: 1,
                dick: 1,
                dickhead: 1,
                dildo: 1,
                dildos: 1,
                dink: 1,
                dinks: 1,
                dirsa: 1,
                dlck: 1,
                "dog-fucker": 1,
                doggin: 1,
                dogging: 1,
                donkeyribber: 1,
                doosh: 1,
                duche: 1,
                dyke: 1,
                ejaculate: 1,
                ejaculated: 1,
                ejaculates: 1,
                ejaculating: 1,
                ejaculatings: 1,
                ejaculation: 1,
                ejakulate: 1,
                "f u c k": 1,
                "f u c k e r": 1,
                f4nny: 1,
                fag: 1,
                fagging: 1,
                faggitt: 1,
                faggot: 1,
                faggs: 1,
                fagot: 1,
                fagots: 1,
                fags: 1,
                fanny: 1,
                fannyflaps: 1,
                fannyfucker: 1,
                fanyy: 1,
                fatass: 1,
                fcuk: 1,
                fcuker: 1,
                fcuking: 1,
                feck: 1,
                fecker: 1,
                felching: 1,
                fellate: 1,
                fellatio: 1,
                fingerfuck: 1,
                fingerfucked: 1,
                fingerfucker: 1,
                fingerfuckers: 1,
                fingerfucking: 1,
                fingerfucks: 1,
                fistfuck: 1,
                fistfucked: 1,
                fistfucker: 1,
                fistfuckers: 1,
                fistfucking: 1,
                fistfuckings: 1,
                fistfucks: 1,
                flange: 1,
                fook: 1,
                fooker: 1,
                fuck: 1,
                fucka: 1,
                fucked: 1,
                fucker: 1,
                fuckers: 1,
                fuckhead: 1,
                fuckheads: 1,
                fuckin: 1,
                fucking: 1,
                fuckings: 1,
                fuckingshitmotherfucker: 1,
                fuckme: 1,
                fucks: 1,
                fuckwhit: 1,
                fuckwit: 1,
                "fudge packer": 1,
                fudgepacker: 1,
                fuk: 1,
                fuker: 1,
                fukker: 1,
                fukkin: 1,
                fuks: 1,
                fukwhit: 1,
                fukwit: 1,
                fux: 1,
                fux0r: 1,
                f_u_c_k: 1,
                gangbang: 1,
                gangbanged: 1,
                gangbangs: 1,
                gaylord: 1,
                gaysex: 1,
                goatse: 1,
                God: 1,
                "god-dam": 1,
                "god-damned": 1,
                goddamn: 1,
                goddamned: 1,
                hardcoresex: 1,
                hell: 1,
                heshe: 1,
                hoar: 1,
                hoare: 1,
                hoer: 1,
                homo: 1,
                hore: 1,
                horniest: 1,
                horny: 1,
                hotsex: 1,
                "jack-off": 1,
                jackoff: 1,
                jap: 1,
                "jerk-off": 1,
                jism: 1,
                jiz: 1,
                jizm: 1,
                jizz: 1,
                kawk: 1,
                knob: 1,
                knobead: 1,
                knobed: 1,
                knobend: 1,
                knobhead: 1,
                knobjocky: 1,
                knobjokey: 1,
                kock: 1,
                kondum: 1,
                kondums: 1,
                kum: 1,
                kummer: 1,
                kumming: 1,
                kums: 1,
                kunilingus: 1,
                "l3i+ch": 1,
                l3itch: 1,
                labia: 1,
                lust: 1,
                lusting: 1,
                m0f0: 1,
                m0fo: 1,
                m45terbate: 1,
                ma5terb8: 1,
                ma5terbate: 1,
                masochist: 1,
                "master-bate": 1,
                masterb8: 1,
                "masterbat*": 1,
                masterbat3: 1,
                masterbate: 1,
                masterbation: 1,
                masterbations: 1,
                masturbate: 1,
                "mo-fo": 1,
                mof0: 1,
                mofo: 1,
                mothafuck: 1,
                mothafucka: 1,
                mothafuckas: 1,
                mothafuckaz: 1,
                mothafucked: 1,
                mothafucker: 1,
                mothafuckers: 1,
                mothafuckin: 1,
                mothafucking: 1,
                mothafuckings: 1,
                mothafucks: 1,
                "mother fucker": 1,
                motherfuck: 1,
                motherfucked: 1,
                motherfucker: 1,
                motherfuckers: 1,
                motherfuckin: 1,
                motherfucking: 1,
                motherfuckings: 1,
                motherfuckka: 1,
                motherfucks: 1,
                muff: 1,
                mutha: 1,
                muthafecker: 1,
                muthafuckker: 1,
                muther: 1,
                mutherfucker: 1,
                n1gga: 1,
                n1gger: 1,
                nazi: 1,
                nigg3r: 1,
                nigg4h: 1,
                nigga: 1,
                niggah: 1,
                niggas: 1,
                niggaz: 1,
                nigger: 1,
                niggers: 1,
                nob: 1,
                "nob jokey": 1,
                nobhead: 1,
                nobjocky: 1,
                nobjokey: 1,
                numbnuts: 1,
                nutsack: 1,
                orgasim: 1,
                orgasims: 1,
                orgasm: 1,
                orgasms: 1,
                p0rn: 1,
                pawn: 1,
                pecker: 1,
                penis: 1,
                penisfucker: 1,
                phonesex: 1,
                phuck: 1,
                phuk: 1,
                phuked: 1,
                phuking: 1,
                phukked: 1,
                phukking: 1,
                phuks: 1,
                phuq: 1,
                pigfucker: 1,
                pimpis: 1,
                piss: 1,
                pissed: 1,
                pisser: 1,
                pissers: 1,
                pisses: 1,
                pissflaps: 1,
                pissin: 1,
                pissing: 1,
                pissoff: 1,
                poop: 1,
                porn: 1,
                porno: 1,
                pornography: 1,
                pornos: 1,
                prick: 1,
                pricks: 1,
                pron: 1,
                pube: 1,
                pusse: 1,
                pussi: 1,
                pussies: 1,
                pussy: 1,
                pussys: 1,
                rectum: 1,
                retard: 1,
                rimjaw: 1,
                rimming: 1,
                "s hit": 1,
                "s.o.b.": 1,
                sadist: 1,
                schlong: 1,
                screwing: 1,
                scroat: 1,
                scrote: 1,
                scrotum: 1,
                semen: 1,
                sex: 1,
                "sh!+": 1,
                "sh!t": 1,
                sh1t: 1,
                shag: 1,
                shagger: 1,
                shaggin: 1,
                shagging: 1,
                shemale: 1,
                "shi+": 1,
                shit: 1,
                shitdick: 1,
                shite: 1,
                shited: 1,
                shitey: 1,
                shitfuck: 1,
                shitfull: 1,
                shithead: 1,
                shiting: 1,
                shitings: 1,
                shits: 1,
                shitted: 1,
                shitter: 1,
                shitters: 1,
                shitting: 1,
                shittings: 1,
                shitty: 1,
                skank: 1,
                slut: 1,
                sluts: 1,
                smegma: 1,
                smut: 1,
                snatch: 1,
                "son-of-a-bitch": 1,
                spac: 1,
                spunk: 1,
                s_h_i_t: 1,
                t1tt1e5: 1,
                t1tties: 1,
                teets: 1,
                teez: 1,
                testical: 1,
                testicle: 1,
                tit: 1,
                titfuck: 1,
                tits: 1,
                titt: 1,
                tittie5: 1,
                tittiefucker: 1,
                titties: 1,
                tittyfuck: 1,
                tittywank: 1,
                titwank: 1,
                tosser: 1,
                turd: 1,
                tw4t: 1,
                twat: 1,
                twathead: 1,
                twatty: 1,
                twunt: 1,
                twunter: 1,
                v14gra: 1,
                v1gra: 1,
                vagina: 1,
                viagra: 1,
                vulva: 1,
                w00se: 1,
                wang: 1,
                wank: 1,
                wanker: 1,
                wanky: 1,
                whoar: 1,
                whore: 1,
                willies: 1,
                willy: 1,
                xrated: 1,
                xxx: 1,
            };
            /***/
        },
        /***/
        "./node_modules/badwords-list/lib/regexp.js": /*!**************************************************!*\
  !*** ./node_modules/badwords-list/lib/regexp.js ***!
  \**************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
            /***/
        },
        /***/
        "./node_modules/base64-js/index.js": /*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            exports.byteLength = byteLength;
            exports.toByteArray = toByteArray;
            exports.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
            }
            // Support decoding URL-safe base64 strings, as Node.js does.
            // See: https://en.wikipedia.org/wiki/Base64#URL_applications
            revLookup["-".charCodeAt(0)] = 62;
            revLookup["_".charCodeAt(0)] = 63;

            function getLens(b64) {
                var len = b64.length;
                if (len % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                // Trim off extra bytes after placeholder bytes are found
                // See: https://github.com/beatgammit/base64-js/issues/42
                var validLen = b64.indexOf("=");
                if (validLen === -1)
                    validLen = len;
                var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
                return [validLen, placeHoldersLen];
            }
            // base64 is 4/3 + up to two characters of the original data
            function byteLength(b64) {
                var lens = getLens(b64);
                var validLen = lens[0];
                var placeHoldersLen = lens[1];
                return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
            }

            function _byteLength(b64, validLen, placeHoldersLen) {
                return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
            }

            function toByteArray(b64) {
                var tmp;
                var lens = getLens(b64);
                var validLen = lens[0];
                var placeHoldersLen = lens[1];
                var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
                var curByte = 0;
                // if there are placeholders, only get up to the last complete 4 chars
                var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
                var i;
                for (i = 0; i < len; i += 4) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
                    arr[curByte++] = (tmp >> 16) & 0xff;
                    arr[curByte++] = (tmp >> 8) & 0xff;
                    arr[curByte++] = tmp & 0xff;
                }
                if (placeHoldersLen === 2) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
                    arr[curByte++] = tmp & 0xff;
                }
                if (placeHoldersLen === 1) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
                    arr[curByte++] = (tmp >> 8) & 0xff;
                    arr[curByte++] = tmp & 0xff;
                }
                return arr;
            }

            function tripletToBase64(num) {
                return (lookup[(num >> 18) & 0x3f] + lookup[(num >> 12) & 0x3f] + lookup[(num >> 6) & 0x3f] + lookup[num & 0x3f]);
            }

            function encodeChunk(uint8, start, end) {
                var tmp;
                var output = [];
                for (var i = start; i < end; i += 3) {
                    tmp = ((uint8[i] << 16) & 0xff0000) + ((uint8[i + 1] << 8) & 0xff00) + (uint8[i + 2] & 0xff);
                    output.push(tripletToBase64(tmp));
                }
                return output.join("");
            }

            function fromByteArray(uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3;
                // if we have 1 byte left, pad 2 bytes
                var parts = [];
                var maxChunkLength = 16383;
                // must be multiple of 3
                // go through the array every three bytes, we'll deal with trailing stuff later
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                }
                // pad the end with zeros, but make sure to not forget the extra bytes
                if (extraBytes === 1) {
                    tmp = uint8[len - 1];
                    parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + "==");
                } else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                    parts.push(lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3f] + lookup[(tmp << 2) & 0x3f] + "=");
                }
                return parts.join("");
            }
            /***/
        },
        /***/
        "./node_modules/buffer/index.js": /*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            /* WEBPACK VAR INJECTION */
            (function(global) {
                /*!
                     * The buffer module from node.js, for the browser.
                     *
                     * @author   Feross Aboukhadijeh <http://feross.org>
                     * @license  MIT
                     */
                /* eslint-disable no-proto */
                var base64 = __webpack_require__(/*! base64-js */
                    "./node_modules/base64-js/index.js");
                var ieee754 = __webpack_require__(/*! ieee754 */
                    "./node_modules/ieee754/index.js");
                var isArray = __webpack_require__(/*! isarray */
                    "./node_modules/buffer/node_modules/isarray/index.js");
                exports.Buffer = Buffer;
                exports.SlowBuffer = SlowBuffer;
                exports.INSPECT_MAX_BYTES = 50;
                /**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
                Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
                /*
                     * Export kMaxLength after typed array support is determined.
                     */
                exports.kMaxLength = kMaxLength();

                function typedArraySupport() {
                    try {
                        var arr = new Uint8Array(1);
                        arr.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function() {
                                return 42;
                            },
                        };
                        return (arr.foo() === 42 && // typed array instances can be augmented
                                typeof arr.subarray === "function" && // chrome 9-10 lack `subarray`
                                arr.subarray(1, 1).byteLength === 0);
                        // ie10 has broken `subarray`
                    } catch (e) {
                        return false;
                    }
                }

                function kMaxLength() {
                    return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
                }

                function createBuffer(that, length) {
                    if (kMaxLength() < length) {
                        throw new RangeError("Invalid typed array length");
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        // Return an augmented `Uint8Array` instance, for best performance
                        that = new Uint8Array(length);
                        that.__proto__ = Buffer.prototype;
                    } else {
                        // Fallback: Return an object instance of the Buffer class
                        if (that === null) {
                            that = new Buffer(length);
                        }
                        that.length = length;
                    }
                    return that;
                }
                /**
                     * The Buffer constructor returns instances of `Uint8Array` that have their
                     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
                     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
                     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
                     * returns a single octet.
                     *
                     * The `Uint8Array` prototype remains unmodified.
                     */
                function Buffer(arg, encodingOrOffset, length) {
                    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                        return new Buffer(arg,encodingOrOffset,length);
                    }
                    // Common case.
                    if (typeof arg === "number") {
                        if (typeof encodingOrOffset === "string") {
                            throw new Error("If encoding is specified then the first argument must be a string");
                        }
                        return allocUnsafe(this, arg);
                    }
                    return from(this, arg, encodingOrOffset, length);
                }
                Buffer.poolSize = 8192;
                // not used by this implementation
                // TODO: Legacy, not needed anymore. Remove in next major version.
                Buffer._augment = function(arr) {
                    arr.__proto__ = Buffer.prototype;
                    return arr;
                }
                ;

                function from(that, value, encodingOrOffset, length) {
                    if (typeof value === "number") {
                        throw new TypeError('"value" argument must not be a number');
                    }
                    if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
                        return fromArrayBuffer(that, value, encodingOrOffset, length);
                    }
                    if (typeof value === "string") {
                        return fromString(that, value, encodingOrOffset);
                    }
                    return fromObject(that, value);
                }
                /**
                     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
                     * if value is a number.
                     * Buffer.from(str[, encoding])
                     * Buffer.from(array)
                     * Buffer.from(buffer)
                     * Buffer.from(arrayBuffer[, byteOffset[, length]])
                     **/
                Buffer.from = function(value, encodingOrOffset, length) {
                    return from(null, value, encodingOrOffset, length);
                }
                ;
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    Buffer.prototype.__proto__ = Uint8Array.prototype;
                    Buffer.__proto__ = Uint8Array;
                    if (typeof Symbol !== "undefined" && Symbol.species && Buffer[Symbol.species] === Buffer) {
                        // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                        Object.defineProperty(Buffer, Symbol.species, {
                            value: null,
                            configurable: true,
                        });
                    }
                }

                function assertSize(size) {
                    if (typeof size !== "number") {
                        throw new TypeError('"size" argument must be a number');
                    } else if (size < 0) {
                        throw new RangeError('"size" argument must not be negative');
                    }
                }

                function alloc(that, size, fill, encoding) {
                    assertSize(size);
                    if (size <= 0) {
                        return createBuffer(that, size);
                    }
                    if (fill !== undefined) {
                        // Only pay attention to encoding if it's a string. This
                        // prevents accidentally sending in a number that would
                        // be interpretted as a start offset.
                        return typeof encoding === "string" ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
                    }
                    return createBuffer(that, size);
                }
                /**
                     * Creates a new filled Buffer instance.
                     * alloc(size[, fill[, encoding]])
                     **/
                Buffer.alloc = function(size, fill, encoding) {
                    return alloc(null, size, fill, encoding);
                }
                ;

                function allocUnsafe(that, size) {
                    assertSize(size);
                    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        for (var i = 0; i < size; ++i) {
                            that[i] = 0;
                        }
                    }
                    return that;
                }
                /**
                     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
                     * */
                Buffer.allocUnsafe = function(size) {
                    return allocUnsafe(null, size);
                }
                ;
                /**
                     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
                     */
                Buffer.allocUnsafeSlow = function(size) {
                    return allocUnsafe(null, size);
                }
                ;

                function fromString(that, string, encoding) {
                    if (typeof encoding !== "string" || encoding === "") {
                        encoding = "utf8";
                    }
                    if (!Buffer.isEncoding(encoding)) {
                        throw new TypeError('"encoding" must be a valid string encoding');
                    }
                    var length = byteLength(string, encoding) | 0;
                    that = createBuffer(that, length);
                    var actual = that.write(string, encoding);
                    if (actual !== length) {
                        // Writing a hex string, for example, that contains invalid characters will
                        // cause everything after the first invalid character to be ignored. (e.g.
                        // 'abxxcd' will be treated as 'ab')
                        that = that.slice(0, actual);
                    }
                    return that;
                }

                function fromArrayLike(that, array) {
                    var length = array.length < 0 ? 0 : checked(array.length) | 0;
                    that = createBuffer(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255;
                    }
                    return that;
                }

                function fromArrayBuffer(that, array, byteOffset, length) {
                    array.byteLength;
                    // this throws if `array` is not a valid ArrayBuffer
                    if (byteOffset < 0 || array.byteLength < byteOffset) {
                        throw new RangeError("'offset' is out of bounds");
                    }
                    if (array.byteLength < byteOffset + (length || 0)) {
                        throw new RangeError("'length' is out of bounds");
                    }
                    if (byteOffset === undefined && length === undefined) {
                        array = new Uint8Array(array);
                    } else if (length === undefined) {
                        array = new Uint8Array(array,byteOffset);
                    } else {
                        array = new Uint8Array(array,byteOffset,length);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        // Return an augmented `Uint8Array` instance, for best performance
                        that = array;
                        that.__proto__ = Buffer.prototype;
                    } else {
                        // Fallback: Return an object instance of the Buffer class
                        that = fromArrayLike(that, array);
                    }
                    return that;
                }

                function fromObject(that, obj) {
                    if (Buffer.isBuffer(obj)) {
                        var len = checked(obj.length) | 0;
                        that = createBuffer(that, len);
                        if (that.length === 0) {
                            return that;
                        }
                        obj.copy(that, 0, 0, len);
                        return that;
                    }
                    if (obj) {
                        if ((typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer) || "length"in obj) {
                            if (typeof obj.length !== "number" || isnan(obj.length)) {
                                return createBuffer(that, 0);
                            }
                            return fromArrayLike(that, obj);
                        }
                        if (obj.type === "Buffer" && isArray(obj.data)) {
                            return fromArrayLike(that, obj.data);
                        }
                    }
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
                }

                function checked(length) {
                    // Note: cannot use `length < kMaxLength()` here because that fails when
                    // length is NaN (which is otherwise coerced to zero.)
                    if (length >= kMaxLength()) {
                        throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + kMaxLength().toString(16) + " bytes");
                    }
                    return length | 0;
                }

                function SlowBuffer(length) {
                    if (+length != length) {
                        // eslint-disable-line eqeqeq
                        length = 0;
                    }
                    return Buffer.alloc(+length);
                }
                Buffer.isBuffer = function isBuffer(b) {
                    return !!(b != null && b._isBuffer);
                }
                ;
                Buffer.compare = function compare(a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError("Arguments must be Buffers");
                    }
                    if (a === b)
                        return 0;
                    var x = a.length;
                    var y = b.length;
                    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                        if (a[i] !== b[i]) {
                            x = a[i];
                            y = b[i];
                            break;
                        }
                    }
                    if (x < y)
                        return -1;
                    if (y < x)
                        return 1;
                    return 0;
                }
                ;
                Buffer.isEncoding = function isEncoding(encoding) {
                    switch (String(encoding).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return true;
                        default:
                            return false;
                    }
                }
                ;
                Buffer.concat = function concat(list, length) {
                    if (!isArray(list)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    if (list.length === 0) {
                        return Buffer.alloc(0);
                    }
                    var i;
                    if (length === undefined) {
                        length = 0;
                        for (i = 0; i < list.length; ++i) {
                            length += list[i].length;
                        }
                    }
                    var buffer = Buffer.allocUnsafe(length);
                    var pos = 0;
                    for (i = 0; i < list.length; ++i) {
                        var buf = list[i];
                        if (!Buffer.isBuffer(buf)) {
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        }
                        buf.copy(buffer, pos);
                        pos += buf.length;
                    }
                    return buffer;
                }
                ;

                function byteLength(string, encoding) {
                    if (Buffer.isBuffer(string)) {
                        return string.length;
                    }
                    if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                        return string.byteLength;
                    }
                    if (typeof string !== "string") {
                        string = "" + string;
                    }
                    var len = string.length;
                    if (len === 0)
                        return 0;
                    // Use a for loop to avoid recursion
                    var loweredCase = false;
                    for (; ; ) {
                        switch (encoding) {
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return len;
                            case "utf8":
                            case "utf-8":
                            case undefined:
                                return utf8ToBytes(string).length;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return len * 2;
                            case "hex":
                                return len >>> 1;
                            case "base64":
                                return base64ToBytes(string).length;
                            default:
                                if (loweredCase)
                                    return utf8ToBytes(string).length;
                                // assume utf8
                                encoding = ("" + encoding).toLowerCase();
                                loweredCase = true;
                        }
                    }
                }
                Buffer.byteLength = byteLength;

                function slowToString(encoding, start, end) {
                    var loweredCase = false;
                    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                    // property of a typed array.
                    // This behaves neither like String nor Uint8Array in that we set start/end
                    // to their upper/lower bounds if the value passed is out of range.
                    // undefined is handled specially as per ECMA-262 6th Edition,
                    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                    if (start === undefined || start < 0) {
                        start = 0;
                    }
                    // Return early if start > this.length. Done here to prevent potential uint32
                    // coercion fail below.
                    if (start > this.length) {
                        return "";
                    }
                    if (end === undefined || end > this.length) {
                        end = this.length;
                    }
                    if (end <= 0) {
                        return "";
                    }
                    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                    end >>>= 0;
                    start >>>= 0;
                    if (end <= start) {
                        return "";
                    }
                    if (!encoding)
                        encoding = "utf8";
                    while (true) {
                        switch (encoding) {
                            case "hex":
                                return hexSlice(this, start, end);
                            case "utf8":
                            case "utf-8":
                                return utf8Slice(this, start, end);
                            case "ascii":
                                return asciiSlice(this, start, end);
                            case "latin1":
                            case "binary":
                                return latin1Slice(this, start, end);
                            case "base64":
                                return base64Slice(this, start, end);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return utf16leSlice(this, start, end);
                            default:
                                if (loweredCase)
                                    throw new TypeError("Unknown encoding: " + encoding);
                                encoding = (encoding + "").toLowerCase();
                                loweredCase = true;
                        }
                    }
                }
                // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
                // Buffer instances.
                Buffer.prototype._isBuffer = true;

                function swap(b, n, m) {
                    var i = b[n];
                    b[n] = b[m];
                    b[m] = i;
                }
                Buffer.prototype.swap16 = function swap16() {
                    var len = this.length;
                    if (len % 2 !== 0) {
                        throw new RangeError("Buffer size must be a multiple of 16-bits");
                    }
                    for (var i = 0; i < len; i += 2) {
                        swap(this, i, i + 1);
                    }
                    return this;
                }
                ;
                Buffer.prototype.swap32 = function swap32() {
                    var len = this.length;
                    if (len % 4 !== 0) {
                        throw new RangeError("Buffer size must be a multiple of 32-bits");
                    }
                    for (var i = 0; i < len; i += 4) {
                        swap(this, i, i + 3);
                        swap(this, i + 1, i + 2);
                    }
                    return this;
                }
                ;
                Buffer.prototype.swap64 = function swap64() {
                    var len = this.length;
                    if (len % 8 !== 0) {
                        throw new RangeError("Buffer size must be a multiple of 64-bits");
                    }
                    for (var i = 0; i < len; i += 8) {
                        swap(this, i, i + 7);
                        swap(this, i + 1, i + 6);
                        swap(this, i + 2, i + 5);
                        swap(this, i + 3, i + 4);
                    }
                    return this;
                }
                ;
                Buffer.prototype.toString = function toString() {
                    var length = this.length | 0;
                    if (length === 0)
                        return "";
                    if (arguments.length === 0)
                        return utf8Slice(this, 0, length);
                    return slowToString.apply(this, arguments);
                }
                ;
                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b))
                        throw new TypeError("Argument must be a Buffer");
                    if (this === b)
                        return true;
                    return Buffer.compare(this, b) === 0;
                }
                ;
                Buffer.prototype.inspect = function inspect() {
                    var str = "";
                    var max = exports.INSPECT_MAX_BYTES;
                    if (this.length > 0) {
                        str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
                        if (this.length > max)
                            str += " ... ";
                    }
                    return "<Buffer " + str + ">";
                }
                ;
                Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                    if (!Buffer.isBuffer(target)) {
                        throw new TypeError("Argument must be a Buffer");
                    }
                    if (start === undefined) {
                        start = 0;
                    }
                    if (end === undefined) {
                        end = target ? target.length : 0;
                    }
                    if (thisStart === undefined) {
                        thisStart = 0;
                    }
                    if (thisEnd === undefined) {
                        thisEnd = this.length;
                    }
                    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                        throw new RangeError("out of range index");
                    }
                    if (thisStart >= thisEnd && start >= end) {
                        return 0;
                    }
                    if (thisStart >= thisEnd) {
                        return -1;
                    }
                    if (start >= end) {
                        return 1;
                    }
                    start >>>= 0;
                    end >>>= 0;
                    thisStart >>>= 0;
                    thisEnd >>>= 0;
                    if (this === target)
                        return 0;
                    var x = thisEnd - thisStart;
                    var y = end - start;
                    var len = Math.min(x, y);
                    var thisCopy = this.slice(thisStart, thisEnd);
                    var targetCopy = target.slice(start, end);
                    for (var i = 0; i < len; ++i) {
                        if (thisCopy[i] !== targetCopy[i]) {
                            x = thisCopy[i];
                            y = targetCopy[i];
                            break;
                        }
                    }
                    if (x < y)
                        return -1;
                    if (y < x)
                        return 1;
                    return 0;
                }
                ;
                // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
                // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
                //
                // Arguments:
                // - buffer - a Buffer to search
                // - val - a string, Buffer, or number
                // - byteOffset - an index into `buffer`; will be clamped to an int32
                // - encoding - an optional encoding, relevant is val is a string
                // - dir - true for indexOf, false for lastIndexOf
                function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                    // Empty buffer means no match
                    if (buffer.length === 0)
                        return -1;
                    // Normalize byteOffset
                    if (typeof byteOffset === "string") {
                        encoding = byteOffset;
                        byteOffset = 0;
                    } else if (byteOffset > 0x7fffffff) {
                        byteOffset = 0x7fffffff;
                    } else if (byteOffset < -0x80000000) {
                        byteOffset = -0x80000000;
                    }
                    byteOffset = +byteOffset;
                    // Coerce to Number.
                    if (isNaN(byteOffset)) {
                        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                        byteOffset = dir ? 0 : buffer.length - 1;
                    }
                    // Normalize byteOffset: negative offsets start from the end of the buffer
                    if (byteOffset < 0)
                        byteOffset = buffer.length + byteOffset;
                    if (byteOffset >= buffer.length) {
                        if (dir)
                            return -1;
                        else
                            byteOffset = buffer.length - 1;
                    } else if (byteOffset < 0) {
                        if (dir)
                            byteOffset = 0;
                        else
                            return -1;
                    }
                    // Normalize val
                    if (typeof val === "string") {
                        val = Buffer.from(val, encoding);
                    }
                    // Finally, search either indexOf (if dir is true) or lastIndexOf
                    if (Buffer.isBuffer(val)) {
                        // Special case: looking for empty string/buffer always fails
                        if (val.length === 0) {
                            return -1;
                        }
                        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                    } else if (typeof val === "number") {
                        val = val & 0xff;
                        // Search for a byte value [0-255]
                        if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
                            if (dir) {
                                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                            } else {
                                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                            }
                        }
                        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
                    }
                    throw new TypeError("val must be string, number or Buffer");
                }

                function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                    var indexSize = 1;
                    var arrLength = arr.length;
                    var valLength = val.length;
                    if (encoding !== undefined) {
                        encoding = String(encoding).toLowerCase();
                        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
                            if (arr.length < 2 || val.length < 2) {
                                return -1;
                            }
                            indexSize = 2;
                            arrLength /= 2;
                            valLength /= 2;
                            byteOffset /= 2;
                        }
                    }

                    function read(buf, i) {
                        if (indexSize === 1) {
                            return buf[i];
                        } else {
                            return buf.readUInt16BE(i * indexSize);
                        }
                    }
                    var i;
                    if (dir) {
                        var foundIndex = -1;
                        for (i = byteOffset; i < arrLength; i++) {
                            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                                if (foundIndex === -1)
                                    foundIndex = i;
                                if (i - foundIndex + 1 === valLength)
                                    return foundIndex * indexSize;
                            } else {
                                if (foundIndex !== -1)
                                    i -= i - foundIndex;
                                foundIndex = -1;
                            }
                        }
                    } else {
                        if (byteOffset + valLength > arrLength)
                            byteOffset = arrLength - valLength;
                        for (i = byteOffset; i >= 0; i--) {
                            var found = true;
                            for (var j = 0; j < valLength; j++) {
                                if (read(arr, i + j) !== read(val, j)) {
                                    found = false;
                                    break;
                                }
                            }
                            if (found)
                                return i;
                        }
                    }
                    return -1;
                }
                Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                    return this.indexOf(val, byteOffset, encoding) !== -1;
                }
                ;
                Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
                }
                ;
                Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
                }
                ;

                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0;
                    var remaining = buf.length - offset;
                    if (!length) {
                        length = remaining;
                    } else {
                        length = Number(length);
                        if (length > remaining) {
                            length = remaining;
                        }
                    }
                    // must be an even number of digits
                    var strLen = string.length;
                    if (strLen % 2 !== 0)
                        throw new TypeError("Invalid hex string");
                    if (length > strLen / 2) {
                        length = strLen / 2;
                    }
                    for (var i = 0; i < length; ++i) {
                        var parsed = parseInt(string.substr(i * 2, 2), 16);
                        if (isNaN(parsed))
                            return i;
                        buf[offset + i] = parsed;
                    }
                    return i;
                }

                function utf8Write(buf, string, offset, length) {
                    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
                }

                function asciiWrite(buf, string, offset, length) {
                    return blitBuffer(asciiToBytes(string), buf, offset, length);
                }

                function latin1Write(buf, string, offset, length) {
                    return asciiWrite(buf, string, offset, length);
                }

                function base64Write(buf, string, offset, length) {
                    return blitBuffer(base64ToBytes(string), buf, offset, length);
                }

                function ucs2Write(buf, string, offset, length) {
                    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
                }
                Buffer.prototype.write = function write(string, offset, length, encoding) {
                    // Buffer#write(string)
                    if (offset === undefined) {
                        encoding = "utf8";
                        length = this.length;
                        offset = 0;
                        // Buffer#write(string, encoding)
                    } else if (length === undefined && typeof offset === "string") {
                        encoding = offset;
                        length = this.length;
                        offset = 0;
                        // Buffer#write(string, offset[, length][, encoding])
                    } else if (isFinite(offset)) {
                        offset = offset | 0;
                        if (isFinite(length)) {
                            length = length | 0;
                            if (encoding === undefined)
                                encoding = "utf8";
                        } else {
                            encoding = length;
                            length = undefined;
                        }
                        // legacy write(string, encoding, offset, length) - remove in v0.13
                    } else {
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    }
                    var remaining = this.length - offset;
                    if (length === undefined || length > remaining)
                        length = remaining;
                    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                        throw new RangeError("Attempt to write outside buffer bounds");
                    }
                    if (!encoding)
                        encoding = "utf8";
                    var loweredCase = false;
                    for (; ; ) {
                        switch (encoding) {
                            case "hex":
                                return hexWrite(this, string, offset, length);
                            case "utf8":
                            case "utf-8":
                                return utf8Write(this, string, offset, length);
                            case "ascii":
                                return asciiWrite(this, string, offset, length);
                            case "latin1":
                            case "binary":
                                return latin1Write(this, string, offset, length);
                            case "base64":
                                // Warning: maxLength not taken into account in base64Write
                                return base64Write(this, string, offset, length);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return ucs2Write(this, string, offset, length);
                            default:
                                if (loweredCase)
                                    throw new TypeError("Unknown encoding: " + encoding);
                                encoding = ("" + encoding).toLowerCase();
                                loweredCase = true;
                        }
                    }
                }
                ;
                Buffer.prototype.toJSON = function toJSON() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0),
                    };
                }
                ;

                function base64Slice(buf, start, end) {
                    if (start === 0 && end === buf.length) {
                        return base64.fromByteArray(buf);
                    } else {
                        return base64.fromByteArray(buf.slice(start, end));
                    }
                }

                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end);
                    var res = [];
                    var i = start;
                    while (i < end) {
                        var firstByte = buf[i];
                        var codePoint = null;
                        var bytesPerSequence = firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;
                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint;
                            switch (bytesPerSequence) {
                                case 1:
                                    if (firstByte < 0x80) {
                                        codePoint = firstByte;
                                    }
                                    break;
                                case 2:
                                    secondByte = buf[i + 1];
                                    if ((secondByte & 0xc0) === 0x80) {
                                        tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);
                                        if (tempCodePoint > 0x7f) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                                    break;
                                case 3:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
                                        tempCodePoint = ((firstByte & 0xf) << 0xc) | ((secondByte & 0x3f) << 0x6) | (thirdByte & 0x3f);
                                        if (tempCodePoint > 0x7ff && (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                                    break;
                                case 4:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    fourthByte = buf[i + 3];
                                    if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80 && (fourthByte & 0xc0) === 0x80) {
                                        tempCodePoint = ((firstByte & 0xf) << 0x12) | ((secondByte & 0x3f) << 0xc) | ((thirdByte & 0x3f) << 0x6) | (fourthByte & 0x3f);
                                        if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                            }
                        }
                        if (codePoint === null) {
                            // we did not generate a valid codePoint so insert a
                            // replacement char (U+FFFD) and advance only 1 byte
                            codePoint = 0xfffd;
                            bytesPerSequence = 1;
                        } else if (codePoint > 0xffff) {
                            // encode to utf16 (surrogate pair dance)
                            codePoint -= 0x10000;
                            res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
                            codePoint = 0xdc00 | (codePoint & 0x3ff);
                        }
                        res.push(codePoint);
                        i += bytesPerSequence;
                    }
                    return decodeCodePointsArray(res);
                }
                // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                // the lowest limit is Chrome, with 0x10000 args.
                // We go 1 magnitude less, for safety
                var MAX_ARGUMENTS_LENGTH = 0x1000;

                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length;
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints);
                        // avoid extra slice()
                    }
                    // Decode in chunks to avoid "call stack size exceeded".
                    var res = "";
                    var i = 0;
                    while (i < len) {
                        res += String.fromCharCode.apply(String, codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH)));
                    }
                    return res;
                }

                function asciiSlice(buf, start, end) {
                    var ret = "";
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; ++i) {
                        ret += String.fromCharCode(buf[i] & 0x7f);
                    }
                    return ret;
                }

                function latin1Slice(buf, start, end) {
                    var ret = "";
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; ++i) {
                        ret += String.fromCharCode(buf[i]);
                    }
                    return ret;
                }

                function hexSlice(buf, start, end) {
                    var len = buf.length;
                    if (!start || start < 0)
                        start = 0;
                    if (!end || end < 0 || end > len)
                        end = len;
                    var out = "";
                    for (var i = start; i < end; ++i) {
                        out += toHex(buf[i]);
                    }
                    return out;
                }

                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end);
                    var res = "";
                    for (var i = 0; i < bytes.length; i += 2) {
                        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
                    }
                    return res;
                }
                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length;
                    start = ~~start;
                    end = end === undefined ? len : ~~end;
                    if (start < 0) {
                        start += len;
                        if (start < 0)
                            start = 0;
                    } else if (start > len) {
                        start = len;
                    }
                    if (end < 0) {
                        end += len;
                        if (end < 0)
                            end = 0;
                    } else if (end > len) {
                        end = len;
                    }
                    if (end < start)
                        end = start;
                    var newBuf;
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        newBuf = this.subarray(start, end);
                        newBuf.__proto__ = Buffer.prototype;
                    } else {
                        var sliceLen = end - start;
                        newBuf = new Buffer(sliceLen,undefined);
                        for (var i = 0; i < sliceLen; ++i) {
                            newBuf[i] = this[i + start];
                        }
                    }
                    return newBuf;
                }
                ;
                /*
                     * Need to make sure that buffer isn't trying to write out of bounds.
                     */
                function checkOffset(offset, ext, length) {
                    if (offset % 1 !== 0 || offset < 0)
                        throw new RangeError("offset is not uint");
                    if (offset + ext > length)
                        throw new RangeError("Trying to access beyond buffer length");
                }
                Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert)
                        checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul;
                    }
                    return val;
                }
                ;
                Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length);
                    }
                    var val = this[offset + --byteLength];
                    var mul = 1;
                    while (byteLength > 0 && (mul *= 0x100)) {
                        val += this[offset + --byteLength] * mul;
                    }
                    return val;
                }
                ;
                Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 1, this.length);
                    return this[offset];
                }
                ;
                Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 2, this.length);
                    return this[offset] | (this[offset + 1] << 8);
                }
                ;
                Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 2, this.length);
                    return (this[offset] << 8) | this[offset + 1];
                }
                ;
                Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return ((this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) + this[offset + 3] * 0x1000000);
                }
                ;
                Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return (this[offset] * 0x1000000 + ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3]));
                }
                ;
                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert)
                        checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul;
                    }
                    mul *= 0x80;
                    if (val >= mul)
                        val -= Math.pow(2, 8 * byteLength);
                    return val;
                }
                ;
                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert)
                        checkOffset(offset, byteLength, this.length);
                    var i = byteLength;
                    var mul = 1;
                    var val = this[offset + --i];
                    while (i > 0 && (mul *= 0x100)) {
                        val += this[offset + --i] * mul;
                    }
                    mul *= 0x80;
                    if (val >= mul)
                        val -= Math.pow(2, 8 * byteLength);
                    return val;
                }
                ;
                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 1, this.length);
                    if (!(this[offset] & 0x80))
                        return this[offset];
                    return (0xff - this[offset] + 1) * -1;
                }
                ;
                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 2, this.length);
                    var val = this[offset] | (this[offset + 1] << 8);
                    return val & 0x8000 ? val | 0xffff0000 : val;
                }
                ;
                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 2, this.length);
                    var val = this[offset + 1] | (this[offset] << 8);
                    return val & 0x8000 ? val | 0xffff0000 : val;
                }
                ;
                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16) | (this[offset + 3] << 24));
                }
                ;
                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return ((this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3]);
                }
                ;
                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return ieee754.read(this, offset, true, 23, 4);
                }
                ;
                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 4, this.length);
                    return ieee754.read(this, offset, false, 23, 4);
                }
                ;
                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 8, this.length);
                    return ieee754.read(this, offset, true, 52, 8);
                }
                ;
                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    if (!noAssert)
                        checkOffset(offset, 8, this.length);
                    return ieee754.read(this, offset, false, 52, 8);
                }
                ;

                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf))
                        throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (value > max || value < min)
                        throw new RangeError('"value" argument is out of bounds');
                    if (offset + ext > buf.length)
                        throw new RangeError("Index out of range");
                }
                Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0);
                    }
                    var mul = 1;
                    var i = 0;
                    this[offset] = value & 0xff;
                    while (++i < byteLength && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xff;
                    }
                    return offset + byteLength;
                }
                ;
                Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    this[offset + i] = value & 0xff;
                    while (--i >= 0 && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xff;
                    }
                    return offset + byteLength;
                }
                ;
                Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 1, 0xff, 0);
                    if (!Buffer.TYPED_ARRAY_SUPPORT)
                        value = Math.floor(value);
                    this[offset] = value & 0xff;
                    return offset + 1;
                }
                ;

                function objectWriteUInt16(buf, value, offset, littleEndian) {
                    if (value < 0)
                        value = 0xffff + value + 1;
                    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
                        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>> ((littleEndian ? i : 1 - i) * 8);
                    }
                }
                Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 2, 0xffff, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                    } else {
                        objectWriteUInt16(this, value, offset, true);
                    }
                    return offset + 2;
                }
                ;
                Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 2, 0xffff, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 0xff;
                    } else {
                        objectWriteUInt16(this, value, offset, false);
                    }
                    return offset + 2;
                }
                ;

                function objectWriteUInt32(buf, value, offset, littleEndian) {
                    if (value < 0)
                        value = 0xffffffff + value + 1;
                    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
                        buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xff;
                    }
                }
                Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 4, 0xffffffff, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset + 3] = value >>> 24;
                        this[offset + 2] = value >>> 16;
                        this[offset + 1] = value >>> 8;
                        this[offset] = value & 0xff;
                    } else {
                        objectWriteUInt32(this, value, offset, true);
                    }
                    return offset + 4;
                }
                ;
                Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 4, 0xffffffff, 0);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 0xff;
                    } else {
                        objectWriteUInt32(this, value, offset, false);
                    }
                    return offset + 4;
                }
                ;
                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = 0;
                    var mul = 1;
                    var sub = 0;
                    this[offset] = value & 0xff;
                    while (++i < byteLength && (mul *= 0x100)) {
                        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                            sub = 1;
                        }
                        this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
                    }
                    return offset + byteLength;
                }
                ;
                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    var sub = 0;
                    this[offset + i] = value & 0xff;
                    while (--i >= 0 && (mul *= 0x100)) {
                        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                            sub = 1;
                        }
                        this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
                    }
                    return offset + byteLength;
                }
                ;
                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 1, 0x7f, -0x80);
                    if (!Buffer.TYPED_ARRAY_SUPPORT)
                        value = Math.floor(value);
                    if (value < 0)
                        value = 0xff + value + 1;
                    this[offset] = value & 0xff;
                    return offset + 1;
                }
                ;
                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                    } else {
                        objectWriteUInt16(this, value, offset, true);
                    }
                    return offset + 2;
                }
                ;
                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 0xff;
                    } else {
                        objectWriteUInt16(this, value, offset, false);
                    }
                    return offset + 2;
                }
                ;
                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                        this[offset + 2] = value >>> 16;
                        this[offset + 3] = value >>> 24;
                    } else {
                        objectWriteUInt32(this, value, offset, true);
                    }
                    return offset + 4;
                }
                ;
                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert)
                        checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
                    if (value < 0)
                        value = 0xffffffff + value + 1;
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 0xff;
                    } else {
                        objectWriteUInt32(this, value, offset, false);
                    }
                    return offset + 4;
                }
                ;

                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (offset + ext > buf.length)
                        throw new RangeError("Index out of range");
                    if (offset < 0)
                        throw new RangeError("Index out of range");
                }

                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                    }
                    ieee754.write(buf, value, offset, littleEndian, 23, 4);
                    return offset + 4;
                }
                Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, true, noAssert);
                }
                ;
                Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, false, noAssert);
                }
                ;

                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                    }
                    ieee754.write(buf, value, offset, littleEndian, 52, 8);
                    return offset + 8;
                }
                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert);
                }
                ;
                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert);
                }
                ;
                // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!start)
                        start = 0;
                    if (!end && end !== 0)
                        end = this.length;
                    if (targetStart >= target.length)
                        targetStart = target.length;
                    if (!targetStart)
                        targetStart = 0;
                    if (end > 0 && end < start)
                        end = start;
                    // Copy 0 bytes; we're done
                    if (end === start)
                        return 0;
                    if (target.length === 0 || this.length === 0)
                        return 0;
                    // Fatal error conditions
                    if (targetStart < 0) {
                        throw new RangeError("targetStart out of bounds");
                    }
                    if (start < 0 || start >= this.length)
                        throw new RangeError("sourceStart out of bounds");
                    if (end < 0)
                        throw new RangeError("sourceEnd out of bounds");
                    // Are we oob?
                    if (end > this.length)
                        end = this.length;
                    if (target.length - targetStart < end - start) {
                        end = target.length - targetStart + start;
                    }
                    var len = end - start;
                    var i;
                    if (this === target && start < targetStart && targetStart < end) {
                        // descending copy from end
                        for (i = len - 1; i >= 0; --i) {
                            target[i + targetStart] = this[i + start];
                        }
                    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                        // ascending copy from start
                        for (i = 0; i < len; ++i) {
                            target[i + targetStart] = this[i + start];
                        }
                    } else {
                        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
                    }
                    return len;
                }
                ;
                // Usage:
                //    buffer.fill(number[, offset[, end]])
                //    buffer.fill(buffer[, offset[, end]])
                //    buffer.fill(string[, offset[, end]][, encoding])
                Buffer.prototype.fill = function fill(val, start, end, encoding) {
                    // Handle string cases:
                    if (typeof val === "string") {
                        if (typeof start === "string") {
                            encoding = start;
                            start = 0;
                            end = this.length;
                        } else if (typeof end === "string") {
                            encoding = end;
                            end = this.length;
                        }
                        if (val.length === 1) {
                            var code = val.charCodeAt(0);
                            if (code < 256) {
                                val = code;
                            }
                        }
                        if (encoding !== undefined && typeof encoding !== "string") {
                            throw new TypeError("encoding must be a string");
                        }
                        if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
                            throw new TypeError("Unknown encoding: " + encoding);
                        }
                    } else if (typeof val === "number") {
                        val = val & 255;
                    }
                    // Invalid ranges are not set to a default, so can range check early.
                    if (start < 0 || this.length < start || this.length < end) {
                        throw new RangeError("Out of range index");
                    }
                    if (end <= start) {
                        return this;
                    }
                    start = start >>> 0;
                    end = end === undefined ? this.length : end >>> 0;
                    if (!val)
                        val = 0;
                    var i;
                    if (typeof val === "number") {
                        for (i = start; i < end; ++i) {
                            this[i] = val;
                        }
                    } else {
                        var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val,encoding).toString());
                        var len = bytes.length;
                        for (i = 0; i < end - start; ++i) {
                            this[i + start] = bytes[i % len];
                        }
                    }
                    return this;
                }
                ;
                // HELPER FUNCTIONS
                // ================
                var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

                function base64clean(str) {
                    // Node strips out invalid characters like \n and \t from the string, base64-js does not
                    str = stringtrim(str).replace(INVALID_BASE64_RE, "");
                    // Node converts strings with length < 2 to ''
                    if (str.length < 2)
                        return "";
                    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                    while (str.length % 4 !== 0) {
                        str = str + "=";
                    }
                    return str;
                }

                function stringtrim(str) {
                    if (str.trim)
                        return str.trim();
                    return str.replace(/^\s+|\s+$/g, "");
                }

                function toHex(n) {
                    if (n < 16)
                        return "0" + n.toString(16);
                    return n.toString(16);
                }

                function utf8ToBytes(string, units) {
                    units = units || Infinity;
                    var codePoint;
                    var length = string.length;
                    var leadSurrogate = null;
                    var bytes = [];
                    for (var i = 0; i < length; ++i) {
                        codePoint = string.charCodeAt(i);
                        // is surrogate component
                        if (codePoint > 0xd7ff && codePoint < 0xe000) {
                            // last char was a lead
                            if (!leadSurrogate) {
                                // no lead yet
                                if (codePoint > 0xdbff) {
                                    // unexpected trail
                                    if ((units -= 3) > -1)
                                        bytes.push(0xef, 0xbf, 0xbd);
                                    continue;
                                } else if (i + 1 === length) {
                                    // unpaired lead
                                    if ((units -= 3) > -1)
                                        bytes.push(0xef, 0xbf, 0xbd);
                                    continue;
                                }
                                // valid lead
                                leadSurrogate = codePoint;
                                continue;
                            }
                            // 2 leads in a row
                            if (codePoint < 0xdc00) {
                                if ((units -= 3) > -1)
                                    bytes.push(0xef, 0xbf, 0xbd);
                                leadSurrogate = codePoint;
                                continue;
                            }
                            // valid surrogate pair
                            codePoint = (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000;
                        } else if (leadSurrogate) {
                            // valid bmp char, but last char was a lead
                            if ((units -= 3) > -1)
                                bytes.push(0xef, 0xbf, 0xbd);
                        }
                        leadSurrogate = null;
                        // encode utf8
                        if (codePoint < 0x80) {
                            if ((units -= 1) < 0)
                                break;
                            bytes.push(codePoint);
                        } else if (codePoint < 0x800) {
                            if ((units -= 2) < 0)
                                break;
                            bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
                        } else if (codePoint < 0x10000) {
                            if ((units -= 3) < 0)
                                break;
                            bytes.push((codePoint >> 0xc) | 0xe0, ((codePoint >> 0x6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
                        } else if (codePoint < 0x110000) {
                            if ((units -= 4) < 0)
                                break;
                            bytes.push((codePoint >> 0x12) | 0xf0, ((codePoint >> 0xc) & 0x3f) | 0x80, ((codePoint >> 0x6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
                        } else {
                            throw new Error("Invalid code point");
                        }
                    }
                    return bytes;
                }

                function asciiToBytes(str) {
                    var byteArray = [];
                    for (var i = 0; i < str.length; ++i) {
                        // Node's code seems to be doing this and not & 0x7F..
                        byteArray.push(str.charCodeAt(i) & 0xff);
                    }
                    return byteArray;
                }

                function utf16leToBytes(str, units) {
                    var c, hi, lo;
                    var byteArray = [];
                    for (var i = 0; i < str.length; ++i) {
                        if ((units -= 2) < 0)
                            break;
                        c = str.charCodeAt(i);
                        hi = c >> 8;
                        lo = c % 256;
                        byteArray.push(lo);
                        byteArray.push(hi);
                    }
                    return byteArray;
                }

                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str));
                }

                function blitBuffer(src, dst, offset, length) {
                    for (var i = 0; i < length; ++i) {
                        if (i + offset >= dst.length || i >= src.length)
                            break;
                        dst[i + offset] = src[i];
                    }
                    return i;
                }

                function isnan(val) {
                    return val !== val;
                    // eslint-disable-line no-self-compare
                }
                /* WEBPACK VAR INJECTION */
            }
            ).call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */
                "./node_modules/webpack/buildin/global.js"));
            /***/
        },
        /***/
        "./node_modules/buffer/node_modules/isarray/index.js": /*!***********************************************************!*\
  !*** ./node_modules/buffer/node_modules/isarray/index.js ***!
  \***********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var toString = {}.toString;
            module.exports = Array.isArray || function(arr) {
                return toString.call(arr) == "[object Array]";
            }
            ;
            /***/
        },
        /***/
        "./node_modules/charenc/charenc.js": /*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var charenc = {
                // UTF-8 encoding
                utf8: {
                    // Convert a string to a byte array
                    stringToBytes: function(str) {
                        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
                    },
                    // Convert a byte array to a string
                    bytesToString: function(bytes) {
                        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
                    },
                },
                // Binary encoding
                bin: {
                    // Convert a string to a byte array
                    stringToBytes: function(str) {
                        for (var bytes = [], i = 0; i < str.length; i++)
                            bytes.push(str.charCodeAt(i) & 0xff);
                        return bytes;
                    },
                    // Convert a byte array to a string
                    bytesToString: function(bytes) {
                        for (var str = [], i = 0; i < bytes.length; i++)
                            str.push(String.fromCharCode(bytes[i]));
                        return str.join("");
                    },
                },
            };
            module.exports = charenc;
            /***/
        },
        /***/
        "./node_modules/crypt/crypt.js": /*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            (function() {
                var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                , crypt = {
                    // Bit-wise rotation left
                    rotl: function(n, b) {
                        return (n << b) | (n >>> (32 - b));
                    },
                    // Bit-wise rotation right
                    rotr: function(n, b) {
                        return (n << (32 - b)) | (n >>> b);
                    },
                    // Swap big-endian to little-endian and vice versa
                    endian: function(n) {
                        // If number given, swap endian
                        if (n.constructor == Number) {
                            return ((crypt.rotl(n, 8) & 0x00ff00ff) | (crypt.rotl(n, 24) & 0xff00ff00));
                        }
                        // Else, assume array and swap all items
                        for (var i = 0; i < n.length; i++)
                            n[i] = crypt.endian(n[i]);
                        return n;
                    },
                    // Generate an array of any length of random bytes
                    randomBytes: function(n) {
                        for (var bytes = []; n > 0; n--)
                            bytes.push(Math.floor(Math.random() * 256));
                        return bytes;
                    },
                    // Convert a byte array to big-endian 32-bit words
                    bytesToWords: function(bytes) {
                        for (var words = [], i = 0, b = 0; i < bytes.length; i++,
                             b += 8)
                            words[b >>> 5] |= bytes[i] << (24 - (b % 32));
                        return words;
                    },
                    // Convert big-endian 32-bit words to a byte array
                    wordsToBytes: function(words) {
                        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
                            bytes.push((words[b >>> 5] >>> (24 - (b % 32))) & 0xff);
                        return bytes;
                    },
                    // Convert a byte array to a hex string
                    bytesToHex: function(bytes) {
                        for (var hex = [], i = 0; i < bytes.length; i++) {
                            hex.push((bytes[i] >>> 4).toString(16));
                            hex.push((bytes[i] & 0xf).toString(16));
                        }
                        return hex.join("");
                    },
                    // Convert a hex string to a byte array
                    hexToBytes: function(hex) {
                        for (var bytes = [], c = 0; c < hex.length; c += 2)
                            bytes.push(parseInt(hex.substr(c, 2), 16));
                        return bytes;
                    },
                    // Convert a byte array to a base-64 string
                    bytesToBase64: function(bytes) {
                        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
                            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                            for (var j = 0; j < 4; j++)
                                if (i * 8 + j * 6 <= bytes.length * 8)
                                    base64.push(base64map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                                else
                                    base64.push("=");
                        }
                        return base64.join("");
                    },
                    // Convert a base-64 string to a byte array
                    base64ToBytes: function(base64) {
                        // Remove non-base-64 characters
                        base64 = base64.replace(/[^A-Z0-9+\/]/gi, "");
                        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
                            if (imod4 == 0)
                                continue;
                            bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
                        }
                        return bytes;
                    },
                };
                module.exports = crypt;
            }
            )();
            /***/
        },
        /***/
        "./node_modules/event-lite/event-lite.js": /*!***********************************************!*\
  !*** ./node_modules/event-lite/event-lite.js ***!
  \***********************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            /**
                 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
                 *
                 * @copyright Yusuke Kawasaki
                 * @license MIT
                 * @constructor
                 * @see https://github.com/kawanet/event-lite
                 * @see http://kawanet.github.io/event-lite/EventLite.html
                 * @example
                 * var EventLite = require("event-lite");
                 *
                 * function MyClass() {...}             // your class
                 *
                 * EventLite.mixin(MyClass.prototype);  // import event methods
                 *
                 * var obj = new MyClass();
                 * obj.on("foo", function() {...});     // add event listener
                 * obj.once("bar", function() {...});   // add one-time event listener
                 * obj.emit("foo");                     // dispatch event
                 * obj.emit("bar");                     // dispatch another event
                 * obj.off("foo");                      // remove event listener
                 */
            function EventLite() {
                if (!(this instanceof EventLite))
                    return new EventLite();
            }
            (function(EventLite) {
                // export the class for node.js
                if (true)
                    module.exports = EventLite;
                // property name to hold listeners
                var LISTENERS = "listeners";
                // methods to export
                var methods = {
                    on: on,
                    once: once,
                    off: off,
                    emit: emit,
                };
                // mixin to self
                mixin(EventLite.prototype);
                // export mixin function
                EventLite.mixin = mixin;
                /**
                     * Import on(), once(), off() and emit() methods into target object.
                     *
                     * @function EventLite.mixin
                     * @param target {Prototype}
                     */
                function mixin(target) {
                    for (var key in methods) {
                        target[key] = methods[key];
                    }
                    return target;
                }
                /**
                     * Add an event listener.
                     *
                     * @function EventLite.prototype.on
                     * @param type {string}
                     * @param func {Function}
                     * @returns {EventLite} Self for method chaining
                     */
                function on(type, func) {
                    getListeners(this, type).push(func);
                    return this;
                }
                /**
                     * Add one-time event listener.
                     *
                     * @function EventLite.prototype.once
                     * @param type {string}
                     * @param func {Function}
                     * @returns {EventLite} Self for method chaining
                     */
                function once(type, func) {
                    var that = this;
                    wrap.originalListener = func;
                    getListeners(that, type).push(wrap);
                    return that;

                    function wrap() {
                        off.call(that, type, wrap);
                        func.apply(this, arguments);
                    }
                }
                /**
                     * Remove an event listener.
                     *
                     * @function EventLite.prototype.off
                     * @param [type] {string}
                     * @param [func] {Function}
                     * @returns {EventLite} Self for method chaining
                     */
                function off(type, func) {
                    var that = this;
                    var listners;
                    if (!arguments.length) {
                        delete that[LISTENERS];
                    } else if (!func) {
                        listners = that[LISTENERS];
                        if (listners) {
                            delete listners[type];
                            if (!Object.keys(listners).length)
                                return off.call(that);
                        }
                    } else {
                        listners = getListeners(that, type, true);
                        if (listners) {
                            listners = listners.filter(ne);
                            if (!listners.length)
                                return off.call(that, type);
                            that[LISTENERS][type] = listners;
                        }
                    }
                    return that;

                    function ne(test) {
                        return test !== func && test.originalListener !== func;
                    }
                }
                /**
                     * Dispatch (trigger) an event.
                     *
                     * @function EventLite.prototype.emit
                     * @param type {string}
                     * @param [value] {*}
                     * @returns {boolean} True when a listener received the event
                     */
                function emit(type, value) {
                    var that = this;
                    var listeners = getListeners(that, type, true);
                    if (!listeners)
                        return false;
                    var arglen = arguments.length;
                    if (arglen === 1) {
                        listeners.forEach(zeroarg);
                    } else if (arglen === 2) {
                        listeners.forEach(onearg);
                    } else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        listeners.forEach(moreargs);
                    }
                    return !!listeners.length;

                    function zeroarg(func) {
                        func.call(that);
                    }

                    function onearg(func) {
                        func.call(that, value);
                    }

                    function moreargs(func) {
                        func.apply(that, args);
                    }
                }
                /**
                     * @ignore
                     */
                function getListeners(that, type, readonly) {
                    if (readonly && !that[LISTENERS])
                        return;
                    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
                    return listeners[type] || (listeners[type] = []);
                }
            }
            )(EventLite);
            /***/
        },
        /***/
        "./node_modules/ieee754/index.js": /*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            exports.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var nBits = -7;
                var i = isLE ? nBytes - 1 : 0;
                var d = isLE ? -1 : 1;
                var s = buffer[offset + i];
                i += d;
                e = s & ((1 << -nBits) - 1);
                s >>= -nBits;
                nBits += eLen;
                for (; nBits > 0; e = e * 256 + buffer[offset + i],
                     i += d,
                     nBits -= 8) {}
                m = e & ((1 << -nBits) - 1);
                e >>= -nBits;
                nBits += mLen;
                for (; nBits > 0; m = m * 256 + buffer[offset + i],
                     i += d,
                     nBits -= 8) {}
                if (e === 0) {
                    e = 1 - eBias;
                } else if (e === eMax) {
                    return m ? NaN : (s ? -1 : 1) * Infinity;
                } else {
                    m = m + Math.pow(2, mLen);
                    e = e - eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            }
            ;
            exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) {
                        value += rt / c;
                    } else {
                        value += rt * Math.pow(2, 1 - eBias);
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e = e + eBias;
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0;
                    }
                }
                for (; mLen >= 8; buffer[offset + i] = m & 0xff,
                     i += d,
                     m /= 256,
                     mLen -= 8) {}
                e = (e << mLen) | m;
                eLen += mLen;
                for (; eLen > 0; buffer[offset + i] = e & 0xff,
                     i += d,
                     e /= 256,
                     eLen -= 8) {}
                buffer[offset + i - d] |= s * 128;
            }
            ;
            /***/
        },
        /***/
        "./node_modules/int64-buffer/int64-buffer.js": /*!***************************************************!*\
  !*** ./node_modules/int64-buffer/int64-buffer.js ***!
  \***************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            /* WEBPACK VAR INJECTION */
            (function(Buffer) {
                // int64-buffer.js
                /*jshint -W018 */
                // Confusing use of '!'.
                /*jshint -W030 */
                // Expected an assignment or function call and instead saw an expression.
                /*jshint -W093 */
                // Did you mean to return a conditional instead of an assignment?
                var Uint64BE, Int64BE, Uint64LE, Int64LE;
                !(function(exports) {
                    // constants
                    var UNDEFINED = "undefined";
                    var BUFFER = UNDEFINED !== typeof Buffer && Buffer;
                    var UINT8ARRAY = UNDEFINED !== typeof Uint8Array && Uint8Array;
                    var ARRAYBUFFER = UNDEFINED !== typeof ArrayBuffer && ArrayBuffer;
                    var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
                    var isArray = Array.isArray || _isArray;
                    var BIT32 = 4294967296;
                    var BIT24 = 16777216;
                    // storage class
                    var storage;
                    // Array;
                    // generate classes
                    Uint64BE = factory("Uint64BE", true, true);
                    Int64BE = factory("Int64BE", true, false);
                    Uint64LE = factory("Uint64LE", false, true);
                    Int64LE = factory("Int64LE", false, false);
                    // class factory
                    function factory(name, bigendian, unsigned) {
                        var posH = bigendian ? 0 : 4;
                        var posL = bigendian ? 4 : 0;
                        var pos0 = bigendian ? 0 : 3;
                        var pos1 = bigendian ? 1 : 2;
                        var pos2 = bigendian ? 2 : 1;
                        var pos3 = bigendian ? 3 : 0;
                        var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
                        var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
                        var proto = Int64.prototype;
                        var isName = "is" + name;
                        var _isInt64 = "_" + isName;
                        // properties
                        proto.buffer = void 0;
                        proto.offset = 0;
                        proto[_isInt64] = true;
                        // methods
                        proto.toNumber = toNumber;
                        proto.toString = toString;
                        proto.toJSON = toNumber;
                        proto.toArray = toArray;
                        // add .toBuffer() method only when Buffer available
                        if (BUFFER)
                            proto.toBuffer = toBuffer;
                        // add .toArrayBuffer() method only when Uint8Array available
                        if (UINT8ARRAY)
                            proto.toArrayBuffer = toArrayBuffer;
                        // isUint64BE, isInt64BE
                        Int64[isName] = isInt64;
                        // CommonJS
                        exports[name] = Int64;
                        return Int64;
                        // constructor
                        function Int64(buffer, offset, value, raddix) {
                            if (!(this instanceof Int64))
                                return new Int64(buffer,offset,value,raddix);
                            return init(this, buffer, offset, value, raddix);
                        }
                        // isUint64BE, isInt64BE
                        function isInt64(b) {
                            return !!(b && b[_isInt64]);
                        }
                        // initializer
                        function init(that, buffer, offset, value, raddix) {
                            if (UINT8ARRAY && ARRAYBUFFER) {
                                if (buffer instanceof ARRAYBUFFER)
                                    buffer = new UINT8ARRAY(buffer);
                                if (value instanceof ARRAYBUFFER)
                                    value = new UINT8ARRAY(value);
                            }
                            // Int64BE() style
                            if (!buffer && !offset && !value && !storage) {
                                // shortcut to initialize with zero
                                that.buffer = newArray(ZERO, 0);
                                return;
                            }
                            // Int64BE(value, raddix) style
                            if (!isValidBuffer(buffer, offset)) {
                                var _storage = storage || Array;
                                raddix = offset;
                                value = buffer;
                                offset = 0;
                                buffer = new _storage(8);
                            }
                            that.buffer = buffer;
                            that.offset = offset |= 0;
                            // Int64BE(buffer, offset) style
                            if (UNDEFINED === typeof value)
                                return;
                            // Int64BE(buffer, offset, value, raddix) style
                            if ("string" === typeof value) {
                                fromString(buffer, offset, value, raddix || 10);
                            } else if (isValidBuffer(value, raddix)) {
                                fromArray(buffer, offset, value, raddix);
                            } else if ("number" === typeof raddix) {
                                writeInt32(buffer, offset + posH, value);
                                // high
                                writeInt32(buffer, offset + posL, raddix);
                                // low
                            } else if (value > 0) {
                                fromPositive(buffer, offset, value);
                                // positive
                            } else if (value < 0) {
                                fromNegative(buffer, offset, value);
                                // negative
                            } else {
                                fromArray(buffer, offset, ZERO, 0);
                                // zero, NaN and others
                            }
                        }

                        function fromString(buffer, offset, str, raddix) {
                            var pos = 0;
                            var len = str.length;
                            var high = 0;
                            var low = 0;
                            if (str[0] === "-")
                                pos++;
                            var sign = pos;
                            while (pos < len) {
                                var chr = parseInt(str[pos++], raddix);
                                if (!(chr >= 0))
                                    break;
                                // NaN
                                low = low * raddix + chr;
                                high = high * raddix + Math.floor(low / BIT32);
                                low %= BIT32;
                            }
                            if (sign) {
                                high = ~high;
                                if (low) {
                                    low = BIT32 - low;
                                } else {
                                    high++;
                                }
                            }
                            writeInt32(buffer, offset + posH, high);
                            writeInt32(buffer, offset + posL, low);
                        }

                        function toNumber() {
                            var buffer = this.buffer;
                            var offset = this.offset;
                            var high = readInt32(buffer, offset + posH);
                            var low = readInt32(buffer, offset + posL);
                            if (!unsigned)
                                high |= 0;
                            // a trick to get signed
                            return high ? high * BIT32 + low : low;
                        }

                        function toString(radix) {
                            var buffer = this.buffer;
                            var offset = this.offset;
                            var high = readInt32(buffer, offset + posH);
                            var low = readInt32(buffer, offset + posL);
                            var str = "";
                            var sign = !unsigned && high & 0x80000000;
                            if (sign) {
                                high = ~high;
                                low = BIT32 - low;
                            }
                            radix = radix || 10;
                            while (1) {
                                var mod = (high % radix) * BIT32 + low;
                                high = Math.floor(high / radix);
                                low = Math.floor(mod / radix);
                                str = (mod % radix).toString(radix) + str;
                                if (!high && !low)
                                    break;
                            }
                            if (sign) {
                                str = "-" + str;
                            }
                            return str;
                        }

                        function writeInt32(buffer, offset, value) {
                            buffer[offset + pos3] = value & 255;
                            value = value >> 8;
                            buffer[offset + pos2] = value & 255;
                            value = value >> 8;
                            buffer[offset + pos1] = value & 255;
                            value = value >> 8;
                            buffer[offset + pos0] = value & 255;
                        }

                        function readInt32(buffer, offset) {
                            return (buffer[offset + pos0] * BIT24 + (buffer[offset + pos1] << 16) + (buffer[offset + pos2] << 8) + buffer[offset + pos3]);
                        }
                    }

                    function toArray(raw) {
                        var buffer = this.buffer;
                        var offset = this.offset;
                        storage = null;
                        // Array
                        if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer))
                            return buffer;
                        return newArray(buffer, offset);
                    }

                    function toBuffer(raw) {
                        var buffer = this.buffer;
                        var offset = this.offset;
                        storage = BUFFER;
                        if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer))
                            return buffer;
                        var dest = new BUFFER(8);
                        fromArray(dest, 0, buffer, offset);
                        return dest;
                    }

                    function toArrayBuffer(raw) {
                        var buffer = this.buffer;
                        var offset = this.offset;
                        var arrbuf = buffer.buffer;
                        storage = UINT8ARRAY;
                        if (raw !== false && offset === 0 && arrbuf instanceof ARRAYBUFFER && arrbuf.byteLength === 8)
                            return arrbuf;
                        var dest = new UINT8ARRAY(8);
                        fromArray(dest, 0, buffer, offset);
                        return dest.buffer;
                    }

                    function isValidBuffer(buffer, offset) {
                        var len = buffer && buffer.length;
                        offset |= 0;
                        return (len && offset + 8 <= len && "string" !== typeof buffer[offset]);
                    }

                    function fromArray(destbuf, destoff, srcbuf, srcoff) {
                        destoff |= 0;
                        srcoff |= 0;
                        for (var i = 0; i < 8; i++) {
                            destbuf[destoff++] = srcbuf[srcoff++] & 255;
                        }
                    }

                    function newArray(buffer, offset) {
                        return Array.prototype.slice.call(buffer, offset, offset + 8);
                    }

                    function fromPositiveBE(buffer, offset, value) {
                        var pos = offset + 8;
                        while (pos > offset) {
                            buffer[--pos] = value & 255;
                            value /= 256;
                        }
                    }

                    function fromNegativeBE(buffer, offset, value) {
                        var pos = offset + 8;
                        value++;
                        while (pos > offset) {
                            buffer[--pos] = (-value & 255) ^ 255;
                            value /= 256;
                        }
                    }

                    function fromPositiveLE(buffer, offset, value) {
                        var end = offset + 8;
                        while (offset < end) {
                            buffer[offset++] = value & 255;
                            value /= 256;
                        }
                    }

                    function fromNegativeLE(buffer, offset, value) {
                        var end = offset + 8;
                        value++;
                        while (offset < end) {
                            buffer[offset++] = (-value & 255) ^ 255;
                            value /= 256;
                        }
                    }
                    // https://github.com/retrofox/is-array
                    function _isArray(val) {
                        return (!!val && "[object Array]" == Object.prototype.toString.call(val));
                    }
                }
                 )(true && typeof exports.nodeName !== "string" ? exports : this || {});
                /* WEBPACK VAR INJECTION */
            }
            ).call(this, __webpack_require__(/*! ./../buffer/index.js */
                "./node_modules/buffer/index.js").Buffer);
            /***/
        },
        /***/
        "./node_modules/is-buffer/index.js": /*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            /*!
                 * Determine if an object is a Buffer
                 *
                 * @author   Feross Aboukhadijeh <https://feross.org>
                 * @license  MIT
                 */
            // The _isBuffer check is for Safari 5-7 support, because it's missing
            // Object.prototype.constructor. Remove this eventually
            module.exports = function(obj) {
                return (obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer));
            }
            ;

            function isBuffer(obj) {
                return (!!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj));
            }
            // For Node v0.10 support. Remove this eventually.
            function isSlowBuffer(obj) {
                return (typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0)));
            }
            /***/
        },
        /***/
        "./node_modules/md5/md5.js": /*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            (function() {
                var crypt = __webpack_require__(/*! crypt */
                    "./node_modules/crypt/crypt.js")
                , utf8 = __webpack_require__(/*! charenc */
                    "./node_modules/charenc/charenc.js").utf8
                , isBuffer = __webpack_require__(/*! is-buffer */
                    "./node_modules/is-buffer/index.js")
                , bin = __webpack_require__(/*! charenc */
                    "./node_modules/charenc/charenc.js").bin
                , // The core
                    md5 = function(message, options) {
                        // Convert to byte array
                        if (message.constructor == String)
                            if (options && options.encoding === "binary")
                                message = bin.stringToBytes(message);
                            else
                                message = utf8.stringToBytes(message);
                        else if (isBuffer(message))
                            message = Array.prototype.slice.call(message, 0);
                        else if (!Array.isArray(message))
                            message = message.toString();
                        // else, assume byte array already
                        var m = crypt.bytesToWords(message)
                        , l = message.length * 8
                        , a = 1732584193
                        , b = -271733879
                        , c = -1732584194
                        , d = 271733878;
                        // Swap endian
                        for (var i = 0; i < m.length; i++) {
                            m[i] = (((m[i] << 8) | (m[i] >>> 24)) & 0x00ff00ff) | (((m[i] << 24) | (m[i] >>> 8)) & 0xff00ff00);
                        }
                        // Padding
                        m[l >>> 5] |= 0x80 << l % 32;
                        m[(((l + 64) >>> 9) << 4) + 14] = l;
                        // Method shortcuts
                        var FF = md5._ff
                        , GG = md5._gg
                        , HH = md5._hh
                        , II = md5._ii;
                        for (var i = 0; i < m.length; i += 16) {
                            var aa = a
                            , bb = b
                            , cc = c
                            , dd = d;
                            a = FF(a, b, c, d, m[i + 0], 7, -680876936);
                            d = FF(d, a, b, c, m[i + 1], 12, -389564586);
                            c = FF(c, d, a, b, m[i + 2], 17, 606105819);
                            b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
                            a = FF(a, b, c, d, m[i + 4], 7, -176418897);
                            d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
                            c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
                            b = FF(b, c, d, a, m[i + 7], 22, -45705983);
                            a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
                            d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
                            c = FF(c, d, a, b, m[i + 10], 17, -42063);
                            b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
                            a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
                            d = FF(d, a, b, c, m[i + 13], 12, -40341101);
                            c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
                            b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
                            a = GG(a, b, c, d, m[i + 1], 5, -165796510);
                            d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
                            c = GG(c, d, a, b, m[i + 11], 14, 643717713);
                            b = GG(b, c, d, a, m[i + 0], 20, -373897302);
                            a = GG(a, b, c, d, m[i + 5], 5, -701558691);
                            d = GG(d, a, b, c, m[i + 10], 9, 38016083);
                            c = GG(c, d, a, b, m[i + 15], 14, -660478335);
                            b = GG(b, c, d, a, m[i + 4], 20, -405537848);
                            a = GG(a, b, c, d, m[i + 9], 5, 568446438);
                            d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
                            c = GG(c, d, a, b, m[i + 3], 14, -187363961);
                            b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
                            a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
                            d = GG(d, a, b, c, m[i + 2], 9, -51403784);
                            c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
                            b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
                            a = HH(a, b, c, d, m[i + 5], 4, -378558);
                            d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
                            c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
                            b = HH(b, c, d, a, m[i + 14], 23, -35309556);
                            a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
                            d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
                            c = HH(c, d, a, b, m[i + 7], 16, -155497632);
                            b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
                            a = HH(a, b, c, d, m[i + 13], 4, 681279174);
                            d = HH(d, a, b, c, m[i + 0], 11, -358537222);
                            c = HH(c, d, a, b, m[i + 3], 16, -722521979);
                            b = HH(b, c, d, a, m[i + 6], 23, 76029189);
                            a = HH(a, b, c, d, m[i + 9], 4, -640364487);
                            d = HH(d, a, b, c, m[i + 12], 11, -421815835);
                            c = HH(c, d, a, b, m[i + 15], 16, 530742520);
                            b = HH(b, c, d, a, m[i + 2], 23, -995338651);
                            a = II(a, b, c, d, m[i + 0], 6, -198630844);
                            d = II(d, a, b, c, m[i + 7], 10, 1126891415);
                            c = II(c, d, a, b, m[i + 14], 15, -1416354905);
                            b = II(b, c, d, a, m[i + 5], 21, -57434055);
                            a = II(a, b, c, d, m[i + 12], 6, 1700485571);
                            d = II(d, a, b, c, m[i + 3], 10, -1894986606);
                            c = II(c, d, a, b, m[i + 10], 15, -1051523);
                            b = II(b, c, d, a, m[i + 1], 21, -2054922799);
                            a = II(a, b, c, d, m[i + 8], 6, 1873313359);
                            d = II(d, a, b, c, m[i + 15], 10, -30611744);
                            c = II(c, d, a, b, m[i + 6], 15, -1560198380);
                            b = II(b, c, d, a, m[i + 13], 21, 1309151649);
                            a = II(a, b, c, d, m[i + 4], 6, -145523070);
                            d = II(d, a, b, c, m[i + 11], 10, -1120210379);
                            c = II(c, d, a, b, m[i + 2], 15, 718787259);
                            b = II(b, c, d, a, m[i + 9], 21, -343485551);
                            a = (a + aa) >>> 0;
                            b = (b + bb) >>> 0;
                            c = (c + cc) >>> 0;
                            d = (d + dd) >>> 0;
                        }
                        return crypt.endian([a, b, c, d]);
                    };
                // Auxiliary functions
                md5._ff = function(a, b, c, d, x, s, t) {
                    var n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }
                ;
                md5._gg = function(a, b, c, d, x, s, t) {
                    var n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }
                ;
                md5._hh = function(a, b, c, d, x, s, t) {
                    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }
                ;
                md5._ii = function(a, b, c, d, x, s, t) {
                    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }
                ;
                // Package private blocksize
                md5._blocksize = 16;
                md5._digestsize = 16;
                module.exports = function(message, options) {
                    if (message === undefined || message === null)
                        throw new Error("Illegal argument " + message);
                    var digestbytes = crypt.wordsToBytes(md5(message, options));
                    return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
                }
                ;
            }
            )();
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/browser.js": /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/browser.js ***!
  \**************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // browser.js
            exports.encode = __webpack_require__(/*! ./encode */
                "./node_modules/msgpack-lite/lib/encode.js").encode;
            exports.decode = __webpack_require__(/*! ./decode */
                "./node_modules/msgpack-lite/lib/decode.js").decode;
            exports.Encoder = __webpack_require__(/*! ./encoder */
                "./node_modules/msgpack-lite/lib/encoder.js").Encoder;
            exports.Decoder = __webpack_require__(/*! ./decoder */
                "./node_modules/msgpack-lite/lib/decoder.js").Decoder;
            exports.createCodec = __webpack_require__(/*! ./ext */
                "./node_modules/msgpack-lite/lib/ext.js").createCodec;
            exports.codec = __webpack_require__(/*! ./codec */
                "./node_modules/msgpack-lite/lib/codec.js").codec;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/buffer-global.js": /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-global.js ***!
  \********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            /* WEBPACK VAR INJECTION */
            (function(Buffer) {
                /* globals Buffer */
                module.exports = c("undefined" !== typeof Buffer && Buffer) || c(this.Buffer) || c("undefined" !== typeof window && window.Buffer) || this.Buffer;

                function c(B) {
                    return B && B.isBuffer && B;
                }
                /* WEBPACK VAR INJECTION */
            }
            ).call(this, __webpack_require__(/*! ./../../buffer/index.js */
                "./node_modules/buffer/index.js").Buffer);
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/buffer-lite.js": /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-lite.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // buffer-lite.js
            var MAXBUFLEN = 8192;
            exports.copy = copy;
            exports.toString = toString;
            exports.write = write;
            /**
                 * Buffer.prototype.write()
                 *
                 * @param string {String}
                 * @param [offset] {Number}
                 * @returns {Number}
                 */
            function write(string, offset) {
                var buffer = this;
                var index = offset || (offset |= 0);
                var length = string.length;
                var chr = 0;
                var i = 0;
                while (i < length) {
                    chr = string.charCodeAt(i++);
                    if (chr < 128) {
                        buffer[index++] = chr;
                    } else if (chr < 0x800) {
                        // 2 bytes
                        buffer[index++] = 0xc0 | (chr >>> 6);
                        buffer[index++] = 0x80 | (chr & 0x3f);
                    } else if (chr < 0xd800 || chr > 0xdfff) {
                        // 3 bytes
                        buffer[index++] = 0xe0 | (chr >>> 12);
                        buffer[index++] = 0x80 | ((chr >>> 6) & 0x3f);
                        buffer[index++] = 0x80 | (chr & 0x3f);
                    } else {
                        // 4 bytes - surrogate pair
                        chr = (((chr - 0xd800) << 10) | (string.charCodeAt(i++) - 0xdc00)) + 0x10000;
                        buffer[index++] = 0xf0 | (chr >>> 18);
                        buffer[index++] = 0x80 | ((chr >>> 12) & 0x3f);
                        buffer[index++] = 0x80 | ((chr >>> 6) & 0x3f);
                        buffer[index++] = 0x80 | (chr & 0x3f);
                    }
                }
                return index - offset;
            }
            /**
                 * Buffer.prototype.toString()
                 *
                 * @param [encoding] {String} ignored
                 * @param [start] {Number}
                 * @param [end] {Number}
                 * @returns {String}
                 */
            function toString(encoding, start, end) {
                var buffer = this;
                var index = start | 0;
                if (!end)
                    end = buffer.length;
                var string = "";
                var chr = 0;
                while (index < end) {
                    chr = buffer[index++];
                    if (chr < 128) {
                        string += String.fromCharCode(chr);
                        continue;
                    }
                    if ((chr & 0xe0) === 0xc0) {
                        // 2 bytes
                        chr = ((chr & 0x1f) << 6) | (buffer[index++] & 0x3f);
                    } else if ((chr & 0xf0) === 0xe0) {
                        // 3 bytes
                        chr = ((chr & 0x0f) << 12) | ((buffer[index++] & 0x3f) << 6) | (buffer[index++] & 0x3f);
                    } else if ((chr & 0xf8) === 0xf0) {
                        // 4 bytes
                        chr = ((chr & 0x07) << 18) | ((buffer[index++] & 0x3f) << 12) | ((buffer[index++] & 0x3f) << 6) | (buffer[index++] & 0x3f);
                    }
                    if (chr >= 0x010000) {
                        // A surrogate pair
                        chr -= 0x010000;
                        string += String.fromCharCode((chr >>> 10) + 0xd800, (chr & 0x3ff) + 0xdc00);
                    } else {
                        string += String.fromCharCode(chr);
                    }
                }
                return string;
            }
            /**
                 * Buffer.prototype.copy()
                 *
                 * @param target {Buffer}
                 * @param [targetStart] {Number}
                 * @param [start] {Number}
                 * @param [end] {Number}
                 * @returns {number}
                 */
            function copy(target, targetStart, start, end) {
                var i;
                if (!start)
                    start = 0;
                if (!end && end !== 0)
                    end = this.length;
                if (!targetStart)
                    targetStart = 0;
                var len = end - start;
                if (target === this && start < targetStart && targetStart < end) {
                    // descending
                    for (i = len - 1; i >= 0; i--) {
                        target[i + targetStart] = this[i + start];
                    }
                } else {
                    // ascending
                    for (i = 0; i < len; i++) {
                        target[i + targetStart] = this[i + start];
                    }
                }
                return len;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/bufferish-array.js": /*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-array.js ***!
  \**********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // bufferish-array.js
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var exports = (module.exports = alloc(0));
            exports.alloc = alloc;
            exports.concat = Bufferish.concat;
            exports.from = from;
            /**
                 * @param size {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function alloc(size) {
                return new Array(size);
            }
            /**
                 * @param value {Array|ArrayBuffer|Buffer|String}
                 * @returns {Array}
                 */
            function from(value) {
                if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
                    // TypedArray to Uint8Array
                    value = Bufferish.Uint8Array.from(value);
                } else if (Bufferish.isArrayBuffer(value)) {
                    // ArrayBuffer to Uint8Array
                    value = new Uint8Array(value);
                } else if (typeof value === "string") {
                    // String to Array
                    return Bufferish.from.call(exports, value);
                } else if (typeof value === "number") {
                    throw new TypeError('"value" argument must not be a number');
                }
                // Array-like to Array
                return Array.prototype.slice.call(value);
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/bufferish-buffer.js": /*!***********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-buffer.js ***!
  \***********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // bufferish-buffer.js
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var Buffer = Bufferish.global;
            var exports = (module.exports = Bufferish.hasBuffer ? alloc(0) : []);
            exports.alloc = (Bufferish.hasBuffer && Buffer.alloc) || alloc;
            exports.concat = Bufferish.concat;
            exports.from = from;
            /**
                 * @param size {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function alloc(size) {
                return new Buffer(size);
            }
            /**
                 * @param value {Array|ArrayBuffer|Buffer|String}
                 * @returns {Buffer}
                 */
            function from(value) {
                if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
                    // TypedArray to Uint8Array
                    value = Bufferish.Uint8Array.from(value);
                } else if (Bufferish.isArrayBuffer(value)) {
                    // ArrayBuffer to Uint8Array
                    value = new Uint8Array(value);
                } else if (typeof value === "string") {
                    // String to Buffer
                    return Bufferish.from.call(exports, value);
                } else if (typeof value === "number") {
                    throw new TypeError('"value" argument must not be a number');
                }
                // Array-like to Buffer
                if (Buffer.from && Buffer.from.length !== 1) {
                    return Buffer.from(value);
                    // node v6+
                } else {
                    return new Buffer(value);
                    // node v4
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/bufferish-proto.js": /*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-proto.js ***!
  \**********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // bufferish-proto.js
            /* jshint eqnull:true */
            var BufferLite = __webpack_require__(/*! ./buffer-lite */
                "./node_modules/msgpack-lite/lib/buffer-lite.js");
            exports.copy = copy;
            exports.slice = slice;
            exports.toString = toString;
            exports.write = gen("write");
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var Buffer = Bufferish.global;
            var isBufferShim = Bufferish.hasBuffer && "TYPED_ARRAY_SUPPORT"in Buffer;
            var brokenTypedArray = isBufferShim && !Buffer.TYPED_ARRAY_SUPPORT;
            /**
                 * @param target {Buffer|Uint8Array|Array}
                 * @param [targetStart] {Number}
                 * @param [start] {Number}
                 * @param [end] {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function copy(target, targetStart, start, end) {
                var thisIsBuffer = Bufferish.isBuffer(this);
                var targetIsBuffer = Bufferish.isBuffer(target);
                if (thisIsBuffer && targetIsBuffer) {
                    // Buffer to Buffer
                    return this.copy(target, targetStart, start, end);
                } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer && Bufferish.isView(this) && Bufferish.isView(target)) {
                    // Uint8Array to Uint8Array (except for minor some browsers)
                    var buffer = start || end != null ? slice.call(this, start, end) : this;
                    target.set(buffer, targetStart);
                    return buffer.length;
                } else {
                    // other cases
                    return BufferLite.copy.call(this, target, targetStart, start, end);
                }
            }
            /**
                 * @param [start] {Number}
                 * @param [end] {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function slice(start, end) {
                // for Buffer, Uint8Array (except for minor some browsers) and Array
                var f = this.slice || (!brokenTypedArray && this.subarray);
                if (f)
                    return f.call(this, start, end);
                // Uint8Array (for minor some browsers)
                var target = Bufferish.alloc.call(this, end - start);
                copy.call(this, target, 0, start, end);
                return target;
            }
            /**
                 * Buffer.prototype.toString()
                 *
                 * @param [encoding] {String} ignored
                 * @param [start] {Number}
                 * @param [end] {Number}
                 * @returns {String}
                 */
            function toString(encoding, start, end) {
                var f = !isBufferShim && Bufferish.isBuffer(this) ? this.toString : BufferLite.toString;
                return f.apply(this, arguments);
            }
            /**
                 * @private
                 */
            function gen(method) {
                return wrap;

                function wrap() {
                    var f = this[method] || BufferLite[method];
                    return f.apply(this, arguments);
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/bufferish-uint8array.js": /*!***************************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-uint8array.js ***!
  \***************************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // bufferish-uint8array.js
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var exports = (module.exports = Bufferish.hasArrayBuffer ? alloc(0) : []);
            exports.alloc = alloc;
            exports.concat = Bufferish.concat;
            exports.from = from;
            /**
                 * @param size {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function alloc(size) {
                return new Uint8Array(size);
            }
            /**
                 * @param value {Array|ArrayBuffer|Buffer|String}
                 * @returns {Uint8Array}
                 */
            function from(value) {
                if (Bufferish.isView(value)) {
                    // TypedArray to ArrayBuffer
                    var byteOffset = value.byteOffset;
                    var byteLength = value.byteLength;
                    value = value.buffer;
                    if (value.byteLength !== byteLength) {
                        if (value.slice) {
                            value = value.slice(byteOffset, byteOffset + byteLength);
                        } else {
                            // Android 4.1 does not have ArrayBuffer.prototype.slice
                            value = new Uint8Array(value);
                            if (value.byteLength !== byteLength) {
                                // TypedArray to ArrayBuffer to Uint8Array to Array
                                value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
                            }
                        }
                    }
                } else if (typeof value === "string") {
                    // String to Uint8Array
                    return Bufferish.from.call(exports, value);
                } else if (typeof value === "number") {
                    throw new TypeError('"value" argument must not be a number');
                }
                return new Uint8Array(value);
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/bufferish.js": /*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish.js ***!
  \****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // bufferish.js
            var Buffer = (exports.global = __webpack_require__(/*! ./buffer-global */
                "./node_modules/msgpack-lite/lib/buffer-global.js"));
            var hasBuffer = (exports.hasBuffer = Buffer && !!Buffer.isBuffer);
            var hasArrayBuffer = (exports.hasArrayBuffer = "undefined" !== typeof ArrayBuffer);
            var isArray = (exports.isArray = __webpack_require__(/*! isarray */
                "./node_modules/msgpack-lite/node_modules/isarray/index.js"));
            exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
            var isBuffer = (exports.isBuffer = hasBuffer ? Buffer.isBuffer : _false);
            var isView = (exports.isView = hasArrayBuffer ? ArrayBuffer.isView || _is("ArrayBuffer", "buffer") : _false);
            exports.alloc = alloc;
            exports.concat = concat;
            exports.from = from;
            var BufferArray = (exports.Array = __webpack_require__(/*! ./bufferish-array */
                "./node_modules/msgpack-lite/lib/bufferish-array.js"));
            var BufferBuffer = (exports.Buffer = __webpack_require__(/*! ./bufferish-buffer */
                "./node_modules/msgpack-lite/lib/bufferish-buffer.js"));
            var BufferUint8Array = (exports.Uint8Array = __webpack_require__(/*! ./bufferish-uint8array */
                "./node_modules/msgpack-lite/lib/bufferish-uint8array.js"));
            var BufferProto = (exports.prototype = __webpack_require__(/*! ./bufferish-proto */
                "./node_modules/msgpack-lite/lib/bufferish-proto.js"));
            /**
                 * @param value {Array|ArrayBuffer|Buffer|String}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function from(value) {
                if (typeof value === "string") {
                    return fromString.call(this, value);
                } else {
                    return auto(this).from(value);
                }
            }
            /**
                 * @param size {Number}
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function alloc(size) {
                return auto(this).alloc(size);
            }
            /**
                 * @param list {Array} array of (Buffer|Uint8Array|Array)s
                 * @param [length]
                 * @returns {Buffer|Uint8Array|Array}
                 */
            function concat(list, length) {
                if (!length) {
                    length = 0;
                    Array.prototype.forEach.call(list, dryrun);
                }
                var ref = (this !== exports && this) || list[0];
                var result = alloc.call(ref, length);
                var offset = 0;
                Array.prototype.forEach.call(list, append);
                return result;

                function dryrun(buffer) {
                    length += buffer.length;
                }

                function append(buffer) {
                    offset += BufferProto.copy.call(buffer, result, offset);
                }
            }
            var _isArrayBuffer = _is("ArrayBuffer");

            function isArrayBuffer(value) {
                return value instanceof ArrayBuffer || _isArrayBuffer(value);
            }
            /**
                 * @private
                 */
            function fromString(value) {
                var expected = value.length * 3;
                var that = alloc.call(this, expected);
                var actual = BufferProto.write.call(that, value);
                if (expected !== actual) {
                    that = BufferProto.slice.call(that, 0, actual);
                }
                return that;
            }

            function auto(that) {
                return isBuffer(that) ? BufferBuffer : isView(that) ? BufferUint8Array : isArray(that) ? BufferArray : hasBuffer ? BufferBuffer : hasArrayBuffer ? BufferUint8Array : BufferArray;
            }

            function _false() {
                return false;
            }

            function _is(name, key) {
                /* jshint eqnull:true */
                name = "[object " + name + "]";
                return function(value) {
                    return (value != null && {}.toString.call(key ? value[key] : value) === name);
                }
                ;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/codec-base.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec-base.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // codec-base.js
            var IS_ARRAY = __webpack_require__(/*! isarray */
                "./node_modules/msgpack-lite/node_modules/isarray/index.js");
            exports.createCodec = createCodec;
            exports.install = install;
            exports.filter = filter;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");

            function Codec(options) {
                if (!(this instanceof Codec))
                    return new Codec(options);
                this.options = options;
                this.init();
            }
            Codec.prototype.init = function() {
                var options = this.options;
                if (options && options.uint8array) {
                    this.bufferish = Bufferish.Uint8Array;
                }
                return this;
            }
            ;

            function install(props) {
                for (var key in props) {
                    Codec.prototype[key] = add(Codec.prototype[key], props[key]);
                }
            }

            function add(a, b) {
                return a && b ? ab : a || b;

                function ab() {
                    a.apply(this, arguments);
                    return b.apply(this, arguments);
                }
            }

            function join(filters) {
                filters = filters.slice();
                return function(value) {
                    return filters.reduce(iterator, value);
                }
                ;

                function iterator(value, filter) {
                    return filter(value);
                }
            }

            function filter(filter) {
                return IS_ARRAY(filter) ? join(filter) : filter;
            }
            // @public
            // msgpack.createCodec()
            function createCodec(options) {
                return new Codec(options);
            }
            // default shared codec
            exports.preset = createCodec({
                preset: true
            });
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/codec.js": /*!************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec.js ***!
  \************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // codec.js
            // load both interfaces
            __webpack_require__(/*! ./read-core */
                "./node_modules/msgpack-lite/lib/read-core.js");
            __webpack_require__(/*! ./write-core */
                "./node_modules/msgpack-lite/lib/write-core.js");
            // @public
            // msgpack.codec.preset
            exports.codec = {
                preset: __webpack_require__(/*! ./codec-base */
                    "./node_modules/msgpack-lite/lib/codec-base.js").preset,
            };
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/decode-buffer.js": /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode-buffer.js ***!
  \********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // decode-buffer.js
            exports.DecodeBuffer = DecodeBuffer;
            var preset = __webpack_require__(/*! ./read-core */
                "./node_modules/msgpack-lite/lib/read-core.js").preset;
            var FlexDecoder = __webpack_require__(/*! ./flex-buffer */
                "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder;
            FlexDecoder.mixin(DecodeBuffer.prototype);

            function DecodeBuffer(options) {
                if (!(this instanceof DecodeBuffer))
                    return new DecodeBuffer(options);
                if (options) {
                    this.options = options;
                    if (options.codec) {
                        var codec = (this.codec = options.codec);
                        if (codec.bufferish)
                            this.bufferish = codec.bufferish;
                    }
                }
            }
            DecodeBuffer.prototype.codec = preset;
            DecodeBuffer.prototype.fetch = function() {
                return this.codec.decode(this);
            }
            ;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/decode.js": /*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode.js ***!
  \*************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // decode.js
            exports.decode = decode;
            var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */
                "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

            function decode(input, options) {
                var decoder = new DecodeBuffer(options);
                decoder.write(input);
                return decoder.read();
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/decoder.js": /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decoder.js ***!
  \**************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // decoder.js
            exports.Decoder = Decoder;
            var EventLite = __webpack_require__(/*! event-lite */
                "./node_modules/event-lite/event-lite.js");
            var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */
                "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

            function Decoder(options) {
                if (!(this instanceof Decoder))
                    return new Decoder(options);
                DecodeBuffer.call(this, options);
            }
            Decoder.prototype = new DecodeBuffer();
            EventLite.mixin(Decoder.prototype);
            Decoder.prototype.decode = function(chunk) {
                if (arguments.length)
                    this.write(chunk);
                this.flush();
            }
            ;
            Decoder.prototype.push = function(chunk) {
                this.emit("data", chunk);
            }
            ;
            Decoder.prototype.end = function(chunk) {
                this.decode(chunk);
                this.emit("end");
            }
            ;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/encode-buffer.js": /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode-buffer.js ***!
  \********************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // encode-buffer.js
            exports.EncodeBuffer = EncodeBuffer;
            var preset = __webpack_require__(/*! ./write-core */
                "./node_modules/msgpack-lite/lib/write-core.js").preset;
            var FlexEncoder = __webpack_require__(/*! ./flex-buffer */
                "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder;
            FlexEncoder.mixin(EncodeBuffer.prototype);

            function EncodeBuffer(options) {
                if (!(this instanceof EncodeBuffer))
                    return new EncodeBuffer(options);
                if (options) {
                    this.options = options;
                    if (options.codec) {
                        var codec = (this.codec = options.codec);
                        if (codec.bufferish)
                            this.bufferish = codec.bufferish;
                    }
                }
            }
            EncodeBuffer.prototype.codec = preset;
            EncodeBuffer.prototype.write = function(input) {
                this.codec.encode(this, input);
            }
            ;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/encode.js": /*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode.js ***!
  \*************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // encode.js
            exports.encode = encode;
            var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */
                "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

            function encode(input, options) {
                var encoder = new EncodeBuffer(options);
                encoder.write(input);
                return encoder.read();
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/encoder.js": /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encoder.js ***!
  \**************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // encoder.js
            exports.Encoder = Encoder;
            var EventLite = __webpack_require__(/*! event-lite */
                "./node_modules/event-lite/event-lite.js");
            var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */
                "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

            function Encoder(options) {
                if (!(this instanceof Encoder))
                    return new Encoder(options);
                EncodeBuffer.call(this, options);
            }
            Encoder.prototype = new EncodeBuffer();
            EventLite.mixin(Encoder.prototype);
            Encoder.prototype.encode = function(chunk) {
                this.write(chunk);
                this.emit("data", this.read());
            }
            ;
            Encoder.prototype.end = function(chunk) {
                if (arguments.length)
                    this.encode(chunk);
                this.flush();
                this.emit("end");
            }
            ;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/ext-buffer.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-buffer.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // ext-buffer.js
            exports.ExtBuffer = ExtBuffer;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");

            function ExtBuffer(buffer, type) {
                if (!(this instanceof ExtBuffer))
                    return new ExtBuffer(buffer,type);
                this.buffer = Bufferish.from(buffer);
                this.type = type;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/ext-packer.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-packer.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // ext-packer.js
            exports.setExtPackers = setExtPackers;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var Buffer = Bufferish.global;
            var packTypedArray = Bufferish.Uint8Array.from;
            var _encode;
            var ERROR_COLUMNS = {
                name: 1,
                message: 1,
                stack: 1,
                columnNumber: 1,
                fileName: 1,
                lineNumber: 1,
            };

            function setExtPackers(codec) {
                codec.addExtPacker(0x0e, Error, [packError, encode]);
                codec.addExtPacker(0x01, EvalError, [packError, encode]);
                codec.addExtPacker(0x02, RangeError, [packError, encode]);
                codec.addExtPacker(0x03, ReferenceError, [packError, encode]);
                codec.addExtPacker(0x04, SyntaxError, [packError, encode]);
                codec.addExtPacker(0x05, TypeError, [packError, encode]);
                codec.addExtPacker(0x06, URIError, [packError, encode]);
                codec.addExtPacker(0x0a, RegExp, [packRegExp, encode]);
                codec.addExtPacker(0x0b, Boolean, [packValueOf, encode]);
                codec.addExtPacker(0x0c, String, [packValueOf, encode]);
                codec.addExtPacker(0x0d, Date, [Number, encode]);
                codec.addExtPacker(0x0f, Number, [packValueOf, encode]);
                if ("undefined" !== typeof Uint8Array) {
                    codec.addExtPacker(0x11, Int8Array, packTypedArray);
                    codec.addExtPacker(0x12, Uint8Array, packTypedArray);
                    codec.addExtPacker(0x13, Int16Array, packTypedArray);
                    codec.addExtPacker(0x14, Uint16Array, packTypedArray);
                    codec.addExtPacker(0x15, Int32Array, packTypedArray);
                    codec.addExtPacker(0x16, Uint32Array, packTypedArray);
                    codec.addExtPacker(0x17, Float32Array, packTypedArray);
                    // PhantomJS/1.9.7 doesn't have Float64Array
                    if ("undefined" !== typeof Float64Array) {
                        codec.addExtPacker(0x18, Float64Array, packTypedArray);
                    }
                    // IE10 doesn't have Uint8ClampedArray
                    if ("undefined" !== typeof Uint8ClampedArray) {
                        codec.addExtPacker(0x19, Uint8ClampedArray, packTypedArray);
                    }
                    codec.addExtPacker(0x1a, ArrayBuffer, packTypedArray);
                    codec.addExtPacker(0x1d, DataView, packTypedArray);
                }
                if (Bufferish.hasBuffer) {
                    codec.addExtPacker(0x1b, Buffer, Bufferish.from);
                }
            }

            function encode(input) {
                if (!_encode)
                    _encode = __webpack_require__(/*! ./encode */
                        "./node_modules/msgpack-lite/lib/encode.js").encode;
                // lazy load
                return _encode(input);
            }

            function packValueOf(value) {
                return value.valueOf();
            }

            function packRegExp(value) {
                value = RegExp.prototype.toString.call(value).split("/");
                value.shift();
                var out = [value.pop()];
                out.unshift(value.join("/"));
                return out;
            }

            function packError(value) {
                var out = {};
                for (var key in ERROR_COLUMNS) {
                    out[key] = value[key];
                }
                return out;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/ext-unpacker.js": /*!*******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-unpacker.js ***!
  \*******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // ext-unpacker.js
            exports.setExtUnpackers = setExtUnpackers;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var Buffer = Bufferish.global;
            var _decode;
            var ERROR_COLUMNS = {
                name: 1,
                message: 1,
                stack: 1,
                columnNumber: 1,
                fileName: 1,
                lineNumber: 1,
            };

            function setExtUnpackers(codec) {
                codec.addExtUnpacker(0x0e, [decode, unpackError(Error)]);
                codec.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
                codec.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
                codec.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
                codec.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
                codec.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
                codec.addExtUnpacker(0x06, [decode, unpackError(URIError)]);
                codec.addExtUnpacker(0x0a, [decode, unpackRegExp]);
                codec.addExtUnpacker(0x0b, [decode, unpackClass(Boolean)]);
                codec.addExtUnpacker(0x0c, [decode, unpackClass(String)]);
                codec.addExtUnpacker(0x0d, [decode, unpackClass(Date)]);
                codec.addExtUnpacker(0x0f, [decode, unpackClass(Number)]);
                if ("undefined" !== typeof Uint8Array) {
                    codec.addExtUnpacker(0x11, unpackClass(Int8Array));
                    codec.addExtUnpacker(0x12, unpackClass(Uint8Array));
                    codec.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array), ]);
                    codec.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array), ]);
                    codec.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array), ]);
                    codec.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array), ]);
                    codec.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array), ]);
                    // PhantomJS/1.9.7 doesn't have Float64Array
                    if ("undefined" !== typeof Float64Array) {
                        codec.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array), ]);
                    }
                    // IE10 doesn't have Uint8ClampedArray
                    if ("undefined" !== typeof Uint8ClampedArray) {
                        codec.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
                    }
                    codec.addExtUnpacker(0x1a, unpackArrayBuffer);
                    codec.addExtUnpacker(0x1d, [unpackArrayBuffer, unpackClass(DataView), ]);
                }
                if (Bufferish.hasBuffer) {
                    codec.addExtUnpacker(0x1b, unpackClass(Buffer));
                }
            }

            function decode(input) {
                if (!_decode)
                    _decode = __webpack_require__(/*! ./decode */
                        "./node_modules/msgpack-lite/lib/decode.js").decode;
                // lazy load
                return _decode(input);
            }

            function unpackRegExp(value) {
                return RegExp.apply(null, value);
            }

            function unpackError(Class) {
                return function(value) {
                    var out = new Class();
                    for (var key in ERROR_COLUMNS) {
                        out[key] = value[key];
                    }
                    return out;
                }
                ;
            }

            function unpackClass(Class) {
                return function(value) {
                    return new Class(value);
                }
                ;
            }

            function unpackArrayBuffer(value) {
                return new Uint8Array(value).buffer;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/ext.js": /*!**********************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext.js ***!
  \**********************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // ext.js
            // load both interfaces
            __webpack_require__(/*! ./read-core */
                "./node_modules/msgpack-lite/lib/read-core.js");
            __webpack_require__(/*! ./write-core */
                "./node_modules/msgpack-lite/lib/write-core.js");
            exports.createCodec = __webpack_require__(/*! ./codec-base */
                "./node_modules/msgpack-lite/lib/codec-base.js").createCodec;
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/flex-buffer.js": /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/flex-buffer.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // flex-buffer.js
            exports.FlexDecoder = FlexDecoder;
            exports.FlexEncoder = FlexEncoder;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var MIN_BUFFER_SIZE = 2048;
            var MAX_BUFFER_SIZE = 65536;
            var BUFFER_SHORTAGE = "BUFFER_SHORTAGE";

            function FlexDecoder() {
                if (!(this instanceof FlexDecoder))
                    return new FlexDecoder();
            }

            function FlexEncoder() {
                if (!(this instanceof FlexEncoder))
                    return new FlexEncoder();
            }
            FlexDecoder.mixin = mixinFactory(getDecoderMethods());
            FlexDecoder.mixin(FlexDecoder.prototype);
            FlexEncoder.mixin = mixinFactory(getEncoderMethods());
            FlexEncoder.mixin(FlexEncoder.prototype);

            function getDecoderMethods() {
                return {
                    bufferish: Bufferish,
                    write: write,
                    fetch: fetch,
                    flush: flush,
                    push: push,
                    pull: pull,
                    read: read,
                    reserve: reserve,
                    offset: 0,
                };

                function write(chunk) {
                    var prev = this.offset ? Bufferish.prototype.slice.call(this.buffer, this.offset) : this.buffer;
                    this.buffer = prev ? chunk ? this.bufferish.concat([prev, chunk]) : prev : chunk;
                    this.offset = 0;
                }

                function flush() {
                    while (this.offset < this.buffer.length) {
                        var start = this.offset;
                        var value;
                        try {
                            value = this.fetch();
                        } catch (e) {
                            if (e && e.message != BUFFER_SHORTAGE)
                                throw e;
                            // rollback
                            this.offset = start;
                            break;
                        }
                        this.push(value);
                    }
                }

                function reserve(length) {
                    var start = this.offset;
                    var end = start + length;
                    if (end > this.buffer.length)
                        throw new Error(BUFFER_SHORTAGE);
                    this.offset = end;
                    return start;
                }
            }

            function getEncoderMethods() {
                return {
                    bufferish: Bufferish,
                    write: write,
                    fetch: fetch,
                    flush: flush,
                    push: push,
                    pull: pull,
                    read: read,
                    reserve: reserve,
                    send: send,
                    maxBufferSize: MAX_BUFFER_SIZE,
                    minBufferSize: MIN_BUFFER_SIZE,
                    offset: 0,
                    start: 0,
                };

                function fetch() {
                    var start = this.start;
                    if (start < this.offset) {
                        var end = (this.start = this.offset);
                        return Bufferish.prototype.slice.call(this.buffer, start, end);
                    }
                }

                function flush() {
                    while (this.start < this.offset) {
                        var value = this.fetch();
                        if (value)
                            this.push(value);
                    }
                }

                function pull() {
                    var buffers = this.buffers || (this.buffers = []);
                    var chunk = buffers.length > 1 ? this.bufferish.concat(buffers) : buffers[0];
                    buffers.length = 0;
                    // buffer exhausted
                    return chunk;
                }

                function reserve(length) {
                    var req = length | 0;
                    if (this.buffer) {
                        var size = this.buffer.length;
                        var start = this.offset | 0;
                        var end = start + req;
                        // is it long enough?
                        if (end < size) {
                            this.offset = end;
                            return start;
                        }
                        // flush current buffer
                        this.flush();
                        // resize it to 2x current length
                        length = Math.max(length, Math.min(size * 2, this.maxBufferSize));
                    }
                    // minimum buffer size
                    length = Math.max(length, this.minBufferSize);
                    // allocate new buffer
                    this.buffer = this.bufferish.alloc(length);
                    this.start = 0;
                    this.offset = req;
                    return 0;
                }

                function send(buffer) {
                    var length = buffer.length;
                    if (length > this.minBufferSize) {
                        this.flush();
                        this.push(buffer);
                    } else {
                        var offset = this.reserve(length);
                        Bufferish.prototype.copy.call(buffer, this.buffer, offset);
                    }
                }
            }
            // common methods
            function write() {
                throw new Error("method not implemented: write()");
            }

            function fetch() {
                throw new Error("method not implemented: fetch()");
            }

            function read() {
                var length = this.buffers && this.buffers.length;
                // fetch the first result
                if (!length)
                    return this.fetch();
                // flush current buffer
                this.flush();
                // read from the results
                return this.pull();
            }

            function push(chunk) {
                var buffers = this.buffers || (this.buffers = []);
                buffers.push(chunk);
            }

            function pull() {
                var buffers = this.buffers || (this.buffers = []);
                return buffers.shift();
            }

            function mixinFactory(source) {
                return mixin;

                function mixin(target) {
                    for (var key in source) {
                        target[key] = source[key];
                    }
                    return target;
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/read-core.js": /*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-core.js ***!
  \****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // read-core.js
            var ExtBuffer = __webpack_require__(/*! ./ext-buffer */
                "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
            var ExtUnpacker = __webpack_require__(/*! ./ext-unpacker */
                "./node_modules/msgpack-lite/lib/ext-unpacker.js");
            var readUint8 = __webpack_require__(/*! ./read-format */
                "./node_modules/msgpack-lite/lib/read-format.js").readUint8;
            var ReadToken = __webpack_require__(/*! ./read-token */
                "./node_modules/msgpack-lite/lib/read-token.js");
            var CodecBase = __webpack_require__(/*! ./codec-base */
                "./node_modules/msgpack-lite/lib/codec-base.js");
            CodecBase.install({
                addExtUnpacker: addExtUnpacker,
                getExtUnpacker: getExtUnpacker,
                init: init,
            });
            exports.preset = init.call(CodecBase.preset);

            function getDecoder(options) {
                var readToken = ReadToken.getReadToken(options);
                return decode;

                function decode(decoder) {
                    var type = readUint8(decoder);
                    var func = readToken[type];
                    if (!func)
                        throw new Error("Invalid type: " + (type ? "0x" + type.toString(16) : type));
                    return func(decoder);
                }
            }

            function init() {
                var options = this.options;
                this.decode = getDecoder(options);
                if (options && options.preset) {
                    ExtUnpacker.setExtUnpackers(this);
                }
                return this;
            }

            function addExtUnpacker(etype, unpacker) {
                var unpackers = this.extUnpackers || (this.extUnpackers = []);
                unpackers[etype] = CodecBase.filter(unpacker);
            }

            function getExtUnpacker(type) {
                var unpackers = this.extUnpackers || (this.extUnpackers = []);
                return unpackers[type] || extUnpacker;

                function extUnpacker(buffer) {
                    return new ExtBuffer(buffer,type);
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/read-format.js": /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-format.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // read-format.js
            var ieee754 = __webpack_require__(/*! ieee754 */
                "./node_modules/ieee754/index.js");
            var Int64Buffer = __webpack_require__(/*! int64-buffer */
                "./node_modules/int64-buffer/int64-buffer.js");
            var Uint64BE = Int64Buffer.Uint64BE;
            var Int64BE = Int64Buffer.Int64BE;
            exports.getReadFormat = getReadFormat;
            exports.readUint8 = uint8;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var BufferProto = __webpack_require__(/*! ./bufferish-proto */
                "./node_modules/msgpack-lite/lib/bufferish-proto.js");
            var HAS_MAP = "undefined" !== typeof Map;
            var NO_ASSERT = true;

            function getReadFormat(options) {
                var binarraybuffer = Bufferish.hasArrayBuffer && options && options.binarraybuffer;
                var int64 = options && options.int64;
                var usemap = HAS_MAP && options && options.usemap;
                var readFormat = {
                    map: usemap ? map_to_map : map_to_obj,
                    array: array,
                    str: str,
                    bin: binarraybuffer ? bin_arraybuffer : bin_buffer,
                    ext: ext,
                    uint8: uint8,
                    uint16: uint16,
                    uint32: uint32,
                    uint64: read(8, int64 ? readUInt64BE_int64 : readUInt64BE),
                    int8: int8,
                    int16: int16,
                    int32: int32,
                    int64: read(8, int64 ? readInt64BE_int64 : readInt64BE),
                    float32: read(4, readFloatBE),
                    float64: read(8, readDoubleBE),
                };
                return readFormat;
            }

            function map_to_obj(decoder, len) {
                var value = {};
                var i;
                var k = new Array(len);
                var v = new Array(len);
                var decode = decoder.codec.decode;
                for (i = 0; i < len; i++) {
                    k[i] = decode(decoder);
                    v[i] = decode(decoder);
                }
                for (i = 0; i < len; i++) {
                    value[k[i]] = v[i];
                }
                return value;
            }

            function map_to_map(decoder, len) {
                var value = new Map();
                var i;
                var k = new Array(len);
                var v = new Array(len);
                var decode = decoder.codec.decode;
                for (i = 0; i < len; i++) {
                    k[i] = decode(decoder);
                    v[i] = decode(decoder);
                }
                for (i = 0; i < len; i++) {
                    value.set(k[i], v[i]);
                }
                return value;
            }

            function array(decoder, len) {
                var value = new Array(len);
                var decode = decoder.codec.decode;
                for (var i = 0; i < len; i++) {
                    value[i] = decode(decoder);
                }
                return value;
            }

            function str(decoder, len) {
                var start = decoder.reserve(len);
                var end = start + len;
                return BufferProto.toString.call(decoder.buffer, "utf-8", start, end);
            }

            function bin_buffer(decoder, len) {
                var start = decoder.reserve(len);
                var end = start + len;
                var buf = BufferProto.slice.call(decoder.buffer, start, end);
                return Bufferish.from(buf);
            }

            function bin_arraybuffer(decoder, len) {
                var start = decoder.reserve(len);
                var end = start + len;
                var buf = BufferProto.slice.call(decoder.buffer, start, end);
                return Bufferish.Uint8Array.from(buf).buffer;
            }

            function ext(decoder, len) {
                var start = decoder.reserve(len + 1);
                var type = decoder.buffer[start++];
                var end = start + len;
                var unpack = decoder.codec.getExtUnpacker(type);
                if (!unpack)
                    throw new Error("Invalid ext type: " + (type ? "0x" + type.toString(16) : type));
                var buf = BufferProto.slice.call(decoder.buffer, start, end);
                return unpack(buf);
            }

            function uint8(decoder) {
                var start = decoder.reserve(1);
                return decoder.buffer[start];
            }

            function int8(decoder) {
                var start = decoder.reserve(1);
                var value = decoder.buffer[start];
                return value & 0x80 ? value - 0x100 : value;
            }

            function uint16(decoder) {
                var start = decoder.reserve(2);
                var buffer = decoder.buffer;
                return (buffer[start++] << 8) | buffer[start];
            }

            function int16(decoder) {
                var start = decoder.reserve(2);
                var buffer = decoder.buffer;
                var value = (buffer[start++] << 8) | buffer[start];
                return value & 0x8000 ? value - 0x10000 : value;
            }

            function uint32(decoder) {
                var start = decoder.reserve(4);
                var buffer = decoder.buffer;
                return (buffer[start++] * 16777216 + (buffer[start++] << 16) + (buffer[start++] << 8) + buffer[start]);
            }

            function int32(decoder) {
                var start = decoder.reserve(4);
                var buffer = decoder.buffer;
                return ((buffer[start++] << 24) | (buffer[start++] << 16) | (buffer[start++] << 8) | buffer[start]);
            }

            function read(len, method) {
                return function(decoder) {
                    var start = decoder.reserve(len);
                    return method.call(decoder.buffer, start, NO_ASSERT);
                }
                ;
            }

            function readUInt64BE(start) {
                return new Uint64BE(this,start).toNumber();
            }

            function readInt64BE(start) {
                return new Int64BE(this,start).toNumber();
            }

            function readUInt64BE_int64(start) {
                return new Uint64BE(this,start);
            }

            function readInt64BE_int64(start) {
                return new Int64BE(this,start);
            }

            function readFloatBE(start) {
                return ieee754.read(this, start, false, 23, 4);
            }

            function readDoubleBE(start) {
                return ieee754.read(this, start, false, 52, 8);
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/read-token.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-token.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // read-token.js
            var ReadFormat = __webpack_require__(/*! ./read-format */
                "./node_modules/msgpack-lite/lib/read-format.js");
            exports.getReadToken = getReadToken;

            function getReadToken(options) {
                var format = ReadFormat.getReadFormat(options);
                if (options && options.useraw) {
                    return init_useraw(format);
                } else {
                    return init_token(format);
                }
            }

            function init_token(format) {
                var i;
                var token = new Array(256);
                // positive fixint -- 0x00 - 0x7f
                for (i = 0x00; i <= 0x7f; i++) {
                    token[i] = constant(i);
                }
                // fixmap -- 0x80 - 0x8f
                for (i = 0x80; i <= 0x8f; i++) {
                    token[i] = fix(i - 0x80, format.map);
                }
                // fixarray -- 0x90 - 0x9f
                for (i = 0x90; i <= 0x9f; i++) {
                    token[i] = fix(i - 0x90, format.array);
                }
                // fixstr -- 0xa0 - 0xbf
                for (i = 0xa0; i <= 0xbf; i++) {
                    token[i] = fix(i - 0xa0, format.str);
                }
                // nil -- 0xc0
                token[0xc0] = constant(null);
                // (never used) -- 0xc1
                token[0xc1] = null;
                // false -- 0xc2
                // true -- 0xc3
                token[0xc2] = constant(false);
                token[0xc3] = constant(true);
                // bin 8 -- 0xc4
                // bin 16 -- 0xc5
                // bin 32 -- 0xc6
                token[0xc4] = flex(format.uint8, format.bin);
                token[0xc5] = flex(format.uint16, format.bin);
                token[0xc6] = flex(format.uint32, format.bin);
                // ext 8 -- 0xc7
                // ext 16 -- 0xc8
                // ext 32 -- 0xc9
                token[0xc7] = flex(format.uint8, format.ext);
                token[0xc8] = flex(format.uint16, format.ext);
                token[0xc9] = flex(format.uint32, format.ext);
                // float 32 -- 0xca
                // float 64 -- 0xcb
                token[0xca] = format.float32;
                token[0xcb] = format.float64;
                // uint 8 -- 0xcc
                // uint 16 -- 0xcd
                // uint 32 -- 0xce
                // uint 64 -- 0xcf
                token[0xcc] = format.uint8;
                token[0xcd] = format.uint16;
                token[0xce] = format.uint32;
                token[0xcf] = format.uint64;
                // int 8 -- 0xd0
                // int 16 -- 0xd1
                // int 32 -- 0xd2
                // int 64 -- 0xd3
                token[0xd0] = format.int8;
                token[0xd1] = format.int16;
                token[0xd2] = format.int32;
                token[0xd3] = format.int64;
                // fixext 1 -- 0xd4
                // fixext 2 -- 0xd5
                // fixext 4 -- 0xd6
                // fixext 8 -- 0xd7
                // fixext 16 -- 0xd8
                token[0xd4] = fix(1, format.ext);
                token[0xd5] = fix(2, format.ext);
                token[0xd6] = fix(4, format.ext);
                token[0xd7] = fix(8, format.ext);
                token[0xd8] = fix(16, format.ext);
                // str 8 -- 0xd9
                // str 16 -- 0xda
                // str 32 -- 0xdb
                token[0xd9] = flex(format.uint8, format.str);
                token[0xda] = flex(format.uint16, format.str);
                token[0xdb] = flex(format.uint32, format.str);
                // array 16 -- 0xdc
                // array 32 -- 0xdd
                token[0xdc] = flex(format.uint16, format.array);
                token[0xdd] = flex(format.uint32, format.array);
                // map 16 -- 0xde
                // map 32 -- 0xdf
                token[0xde] = flex(format.uint16, format.map);
                token[0xdf] = flex(format.uint32, format.map);
                // negative fixint -- 0xe0 - 0xff
                for (i = 0xe0; i <= 0xff; i++) {
                    token[i] = constant(i - 0x100);
                }
                return token;
            }

            function init_useraw(format) {
                var i;
                var token = init_token(format).slice();
                // raw 8 -- 0xd9
                // raw 16 -- 0xda
                // raw 32 -- 0xdb
                token[0xd9] = token[0xc4];
                token[0xda] = token[0xc5];
                token[0xdb] = token[0xc6];
                // fixraw -- 0xa0 - 0xbf
                for (i = 0xa0; i <= 0xbf; i++) {
                    token[i] = fix(i - 0xa0, format.bin);
                }
                return token;
            }

            function constant(value) {
                return function() {
                    return value;
                }
                ;
            }

            function flex(lenFunc, decodeFunc) {
                return function(decoder) {
                    var len = lenFunc(decoder);
                    return decodeFunc(decoder, len);
                }
                ;
            }

            function fix(len, method) {
                return function(decoder) {
                    return method(decoder, len);
                }
                ;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/write-core.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-core.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // write-core.js
            var ExtBuffer = __webpack_require__(/*! ./ext-buffer */
                "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
            var ExtPacker = __webpack_require__(/*! ./ext-packer */
                "./node_modules/msgpack-lite/lib/ext-packer.js");
            var WriteType = __webpack_require__(/*! ./write-type */
                "./node_modules/msgpack-lite/lib/write-type.js");
            var CodecBase = __webpack_require__(/*! ./codec-base */
                "./node_modules/msgpack-lite/lib/codec-base.js");
            CodecBase.install({
                addExtPacker: addExtPacker,
                getExtPacker: getExtPacker,
                init: init,
            });
            exports.preset = init.call(CodecBase.preset);

            function getEncoder(options) {
                var writeType = WriteType.getWriteType(options);
                return encode;

                function encode(encoder, value) {
                    var func = writeType[typeof value];
                    if (!func)
                        throw new Error('Unsupported type "' + typeof value + '": ' + value);
                    func(encoder, value);
                }
            }

            function init() {
                var options = this.options;
                this.encode = getEncoder(options);
                if (options && options.preset) {
                    ExtPacker.setExtPackers(this);
                }
                return this;
            }

            function addExtPacker(etype, Class, packer) {
                packer = CodecBase.filter(packer);
                var name = Class.name;
                if (name && name !== "Object") {
                    var packers = this.extPackers || (this.extPackers = {});
                    packers[name] = extPacker;
                } else {
                    // fallback for IE
                    var list = this.extEncoderList || (this.extEncoderList = []);
                    list.unshift([Class, extPacker]);
                }

                function extPacker(value) {
                    if (packer)
                        value = packer(value);
                    return new ExtBuffer(value,etype);
                }
            }

            function getExtPacker(value) {
                var packers = this.extPackers || (this.extPackers = {});
                var c = value.constructor;
                var e = c && c.name && packers[c.name];
                if (e)
                    return e;
                // fallback for IE
                var list = this.extEncoderList || (this.extEncoderList = []);
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    var pair = list[i];
                    if (c === pair[0])
                        return pair[1];
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/write-token.js": /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-token.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // write-token.js
            var ieee754 = __webpack_require__(/*! ieee754 */
                "./node_modules/ieee754/index.js");
            var Int64Buffer = __webpack_require__(/*! int64-buffer */
                "./node_modules/int64-buffer/int64-buffer.js");
            var Uint64BE = Int64Buffer.Uint64BE;
            var Int64BE = Int64Buffer.Int64BE;
            var uint8 = __webpack_require__(/*! ./write-uint8 */
                "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var Buffer = Bufferish.global;
            var IS_BUFFER_SHIM = Bufferish.hasBuffer && "TYPED_ARRAY_SUPPORT"in Buffer;
            var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
            var Buffer_prototype = (Bufferish.hasBuffer && Buffer.prototype) || {};
            exports.getWriteToken = getWriteToken;

            function getWriteToken(options) {
                if (options && options.uint8array) {
                    return init_uint8array();
                } else if (NO_TYPED_ARRAY || (Bufferish.hasBuffer && options && options.safe)) {
                    return init_safe();
                } else {
                    return init_token();
                }
            }

            function init_uint8array() {
                var token = init_token();
                // float 32 -- 0xca
                // float 64 -- 0xcb
                token[0xca] = writeN(0xca, 4, writeFloatBE);
                token[0xcb] = writeN(0xcb, 8, writeDoubleBE);
                return token;
            }
            // Node.js and browsers with TypedArray
            function init_token() {
                // (immediate values)
                // positive fixint -- 0x00 - 0x7f
                // nil -- 0xc0
                // false -- 0xc2
                // true -- 0xc3
                // negative fixint -- 0xe0 - 0xff
                var token = uint8.slice();
                // bin 8 -- 0xc4
                // bin 16 -- 0xc5
                // bin 32 -- 0xc6
                token[0xc4] = write1(0xc4);
                token[0xc5] = write2(0xc5);
                token[0xc6] = write4(0xc6);
                // ext 8 -- 0xc7
                // ext 16 -- 0xc8
                // ext 32 -- 0xc9
                token[0xc7] = write1(0xc7);
                token[0xc8] = write2(0xc8);
                token[0xc9] = write4(0xc9);
                // float 32 -- 0xca
                // float 64 -- 0xcb
                token[0xca] = writeN(0xca, 4, Buffer_prototype.writeFloatBE || writeFloatBE, true);
                token[0xcb] = writeN(0xcb, 8, Buffer_prototype.writeDoubleBE || writeDoubleBE, true);
                // uint 8 -- 0xcc
                // uint 16 -- 0xcd
                // uint 32 -- 0xce
                // uint 64 -- 0xcf
                token[0xcc] = write1(0xcc);
                token[0xcd] = write2(0xcd);
                token[0xce] = write4(0xce);
                token[0xcf] = writeN(0xcf, 8, writeUInt64BE);
                // int 8 -- 0xd0
                // int 16 -- 0xd1
                // int 32 -- 0xd2
                // int 64 -- 0xd3
                token[0xd0] = write1(0xd0);
                token[0xd1] = write2(0xd1);
                token[0xd2] = write4(0xd2);
                token[0xd3] = writeN(0xd3, 8, writeInt64BE);
                // str 8 -- 0xd9
                // str 16 -- 0xda
                // str 32 -- 0xdb
                token[0xd9] = write1(0xd9);
                token[0xda] = write2(0xda);
                token[0xdb] = write4(0xdb);
                // array 16 -- 0xdc
                // array 32 -- 0xdd
                token[0xdc] = write2(0xdc);
                token[0xdd] = write4(0xdd);
                // map 16 -- 0xde
                // map 32 -- 0xdf
                token[0xde] = write2(0xde);
                token[0xdf] = write4(0xdf);
                return token;
            }
            // safe mode: for old browsers and who needs asserts
            function init_safe() {
                // (immediate values)
                // positive fixint -- 0x00 - 0x7f
                // nil -- 0xc0
                // false -- 0xc2
                // true -- 0xc3
                // negative fixint -- 0xe0 - 0xff
                var token = uint8.slice();
                // bin 8 -- 0xc4
                // bin 16 -- 0xc5
                // bin 32 -- 0xc6
                token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
                token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
                token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);
                // ext 8 -- 0xc7
                // ext 16 -- 0xc8
                // ext 32 -- 0xc9
                token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
                token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
                token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);
                // float 32 -- 0xca
                // float 64 -- 0xcb
                token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
                token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);
                // uint 8 -- 0xcc
                // uint 16 -- 0xcd
                // uint 32 -- 0xce
                // uint 64 -- 0xcf
                token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
                token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
                token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
                token[0xcf] = writeN(0xcf, 8, writeUInt64BE);
                // int 8 -- 0xd0
                // int 16 -- 0xd1
                // int 32 -- 0xd2
                // int 64 -- 0xd3
                token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
                token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
                token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
                token[0xd3] = writeN(0xd3, 8, writeInt64BE);
                // str 8 -- 0xd9
                // str 16 -- 0xda
                // str 32 -- 0xdb
                token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
                token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
                token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);
                // array 16 -- 0xdc
                // array 32 -- 0xdd
                token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
                token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);
                // map 16 -- 0xde
                // map 32 -- 0xdf
                token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
                token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);
                return token;
            }

            function write1(type) {
                return function(encoder, value) {
                    var offset = encoder.reserve(2);
                    var buffer = encoder.buffer;
                    buffer[offset++] = type;
                    buffer[offset] = value;
                }
                ;
            }

            function write2(type) {
                return function(encoder, value) {
                    var offset = encoder.reserve(3);
                    var buffer = encoder.buffer;
                    buffer[offset++] = type;
                    buffer[offset++] = value >>> 8;
                    buffer[offset] = value;
                }
                ;
            }

            function write4(type) {
                return function(encoder, value) {
                    var offset = encoder.reserve(5);
                    var buffer = encoder.buffer;
                    buffer[offset++] = type;
                    buffer[offset++] = value >>> 24;
                    buffer[offset++] = value >>> 16;
                    buffer[offset++] = value >>> 8;
                    buffer[offset] = value;
                }
                ;
            }

            function writeN(type, len, method, noAssert) {
                return function(encoder, value) {
                    var offset = encoder.reserve(len + 1);
                    encoder.buffer[offset++] = type;
                    method.call(encoder.buffer, value, offset, noAssert);
                }
                ;
            }

            function writeUInt64BE(value, offset) {
                new Uint64BE(this,offset,value);
            }

            function writeInt64BE(value, offset) {
                new Int64BE(this,offset,value);
            }

            function writeFloatBE(value, offset) {
                ieee754.write(this, value, offset, false, 23, 4);
            }

            function writeDoubleBE(value, offset) {
                ieee754.write(this, value, offset, false, 52, 8);
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/write-type.js": /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-type.js ***!
  \*****************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            // write-type.js
            var IS_ARRAY = __webpack_require__(/*! isarray */
                "./node_modules/msgpack-lite/node_modules/isarray/index.js");
            var Int64Buffer = __webpack_require__(/*! int64-buffer */
                "./node_modules/int64-buffer/int64-buffer.js");
            var Uint64BE = Int64Buffer.Uint64BE;
            var Int64BE = Int64Buffer.Int64BE;
            var Bufferish = __webpack_require__(/*! ./bufferish */
                "./node_modules/msgpack-lite/lib/bufferish.js");
            var BufferProto = __webpack_require__(/*! ./bufferish-proto */
                "./node_modules/msgpack-lite/lib/bufferish-proto.js");
            var WriteToken = __webpack_require__(/*! ./write-token */
                "./node_modules/msgpack-lite/lib/write-token.js");
            var uint8 = __webpack_require__(/*! ./write-uint8 */
                "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
            var ExtBuffer = __webpack_require__(/*! ./ext-buffer */
                "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
            var HAS_UINT8ARRAY = "undefined" !== typeof Uint8Array;
            var HAS_MAP = "undefined" !== typeof Map;
            var extmap = [];
            extmap[1] = 0xd4;
            extmap[2] = 0xd5;
            extmap[4] = 0xd6;
            extmap[8] = 0xd7;
            extmap[16] = 0xd8;
            exports.getWriteType = getWriteType;

            function getWriteType(options) {
                var token = WriteToken.getWriteToken(options);
                var useraw = options && options.useraw;
                var binarraybuffer = HAS_UINT8ARRAY && options && options.binarraybuffer;
                var isBuffer = binarraybuffer ? Bufferish.isArrayBuffer : Bufferish.isBuffer;
                var bin = binarraybuffer ? bin_arraybuffer : bin_buffer;
                var usemap = HAS_MAP && options && options.usemap;
                var map = usemap ? map_to_map : obj_to_map;
                var writeType = {
                    boolean: bool,
                    function: nil,
                    number: number,
                    object: useraw ? object_raw : object,
                    string: _string(useraw ? raw_head_size : str_head_size),
                    symbol: nil,
                    undefined: nil,
                };
                return writeType;
                // false -- 0xc2
                // true -- 0xc3
                function bool(encoder, value) {
                    var type = value ? 0xc3 : 0xc2;
                    token[type](encoder, value);
                }

                function number(encoder, value) {
                    var ivalue = value | 0;
                    var type;
                    if (value !== ivalue) {
                        // float 64 -- 0xcb
                        type = 0xcb;
                        token[type](encoder, value);
                        return;
                    } else if (-0x20 <= ivalue && ivalue <= 0x7f) {
                        // positive fixint -- 0x00 - 0x7f
                        // negative fixint -- 0xe0 - 0xff
                        type = ivalue & 0xff;
                    } else if (0 <= ivalue) {
                        // uint 8 -- 0xcc
                        // uint 16 -- 0xcd
                        // uint 32 -- 0xce
                        type = ivalue <= 0xff ? 0xcc : ivalue <= 0xffff ? 0xcd : 0xce;
                    } else {
                        // int 8 -- 0xd0
                        // int 16 -- 0xd1
                        // int 32 -- 0xd2
                        type = -0x80 <= ivalue ? 0xd0 : -0x8000 <= ivalue ? 0xd1 : 0xd2;
                    }
                    token[type](encoder, ivalue);
                }
                // uint 64 -- 0xcf
                function uint64(encoder, value) {
                    var type = 0xcf;
                    token[type](encoder, value.toArray());
                }
                // int 64 -- 0xd3
                function int64(encoder, value) {
                    var type = 0xd3;
                    token[type](encoder, value.toArray());
                }
                // str 8 -- 0xd9
                // str 16 -- 0xda
                // str 32 -- 0xdb
                // fixstr -- 0xa0 - 0xbf
                function str_head_size(length) {
                    return length < 32 ? 1 : length <= 0xff ? 2 : length <= 0xffff ? 3 : 5;
                }
                // raw 16 -- 0xda
                // raw 32 -- 0xdb
                // fixraw -- 0xa0 - 0xbf
                function raw_head_size(length) {
                    return length < 32 ? 1 : length <= 0xffff ? 3 : 5;
                }

                function _string(head_size) {
                    return string;

                    function string(encoder, value) {
                        // prepare buffer
                        var length = value.length;
                        var maxsize = 5 + length * 3;
                        encoder.offset = encoder.reserve(maxsize);
                        var buffer = encoder.buffer;
                        // expected header size
                        var expected = head_size(length);
                        // expected start point
                        var start = encoder.offset + expected;
                        // write string
                        length = BufferProto.write.call(buffer, value, start);
                        // actual header size
                        var actual = head_size(length);
                        // move content when needed
                        if (expected !== actual) {
                            var targetStart = start + actual - expected;
                            var end = start + length;
                            BufferProto.copy.call(buffer, buffer, targetStart, start, end);
                        }
                        // write header
                        var type = actual === 1 ? 0xa0 + length : actual <= 3 ? 0xd7 + actual : 0xdb;
                        token[type](encoder, length);
                        // move cursor
                        encoder.offset += length;
                    }
                }

                function object(encoder, value) {
                    // null
                    if (value === null)
                        return nil(encoder, value);
                    // Buffer
                    if (isBuffer(value))
                        return bin(encoder, value);
                    // Array
                    if (IS_ARRAY(value))
                        return array(encoder, value);
                    // int64-buffer objects
                    if (Uint64BE.isUint64BE(value))
                        return uint64(encoder, value);
                    if (Int64BE.isInt64BE(value))
                        return int64(encoder, value);
                    // ext formats
                    var packer = encoder.codec.getExtPacker(value);
                    if (packer)
                        value = packer(value);
                    if (value instanceof ExtBuffer)
                        return ext(encoder, value);
                    // plain old Objects or Map
                    map(encoder, value);
                }

                function object_raw(encoder, value) {
                    // Buffer
                    if (isBuffer(value))
                        return raw(encoder, value);
                    // others
                    object(encoder, value);
                }
                // nil -- 0xc0
                function nil(encoder, value) {
                    var type = 0xc0;
                    token[type](encoder, value);
                }
                // fixarray -- 0x90 - 0x9f
                // array 16 -- 0xdc
                // array 32 -- 0xdd
                function array(encoder, value) {
                    var length = value.length;
                    var type = length < 16 ? 0x90 + length : length <= 0xffff ? 0xdc : 0xdd;
                    token[type](encoder, length);
                    var encode = encoder.codec.encode;
                    for (var i = 0; i < length; i++) {
                        encode(encoder, value[i]);
                    }
                }
                // bin 8 -- 0xc4
                // bin 16 -- 0xc5
                // bin 32 -- 0xc6
                function bin_buffer(encoder, value) {
                    var length = value.length;
                    var type = length < 0xff ? 0xc4 : length <= 0xffff ? 0xc5 : 0xc6;
                    token[type](encoder, length);
                    encoder.send(value);
                }

                function bin_arraybuffer(encoder, value) {
                    bin_buffer(encoder, new Uint8Array(value));
                }
                // fixext 1 -- 0xd4
                // fixext 2 -- 0xd5
                // fixext 4 -- 0xd6
                // fixext 8 -- 0xd7
                // fixext 16 -- 0xd8
                // ext 8 -- 0xc7
                // ext 16 -- 0xc8
                // ext 32 -- 0xc9
                function ext(encoder, value) {
                    var buffer = value.buffer;
                    var length = buffer.length;
                    var type = extmap[length] || (length < 0xff ? 0xc7 : length <= 0xffff ? 0xc8 : 0xc9);
                    token[type](encoder, length);
                    uint8[value.type](encoder);
                    encoder.send(buffer);
                }
                // fixmap -- 0x80 - 0x8f
                // map 16 -- 0xde
                // map 32 -- 0xdf
                function obj_to_map(encoder, value) {
                    var keys = Object.keys(value);
                    var length = keys.length;
                    var type = length < 16 ? 0x80 + length : length <= 0xffff ? 0xde : 0xdf;
                    token[type](encoder, length);
                    var encode = encoder.codec.encode;
                    keys.forEach(function(key) {
                        encode(encoder, key);
                        encode(encoder, value[key]);
                    });
                }
                // fixmap -- 0x80 - 0x8f
                // map 16 -- 0xde
                // map 32 -- 0xdf
                function map_to_map(encoder, value) {
                    if (!(value instanceof Map))
                        return obj_to_map(encoder, value);
                    var length = value.size;
                    var type = length < 16 ? 0x80 + length : length <= 0xffff ? 0xde : 0xdf;
                    token[type](encoder, length);
                    var encode = encoder.codec.encode;
                    value.forEach(function(val, key, m) {
                        encode(encoder, key);
                        encode(encoder, val);
                    });
                }
                // raw 16 -- 0xda
                // raw 32 -- 0xdb
                // fixraw -- 0xa0 - 0xbf
                function raw(encoder, value) {
                    var length = value.length;
                    var type = length < 32 ? 0xa0 + length : length <= 0xffff ? 0xda : 0xdb;
                    token[type](encoder, length);
                    encoder.send(value);
                }
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/lib/write-uint8.js": /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-uint8.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // write-unit8.js
            var constant = (exports.uint8 = new Array(256));
            for (var i = 0x00; i <= 0xff; i++) {
                constant[i] = write0(i);
            }

            function write0(type) {
                return function(encoder) {
                    var offset = encoder.reserve(1);
                    encoder.buffer[offset] = type;
                }
                ;
            }
            /***/
        },
        /***/
        "./node_modules/msgpack-lite/node_modules/isarray/index.js": /*!*****************************************************************!*\
  !*** ./node_modules/msgpack-lite/node_modules/isarray/index.js ***!
  \*****************************************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var toString = {}.toString;
            module.exports = Array.isArray || function(arr) {
                return toString.call(arr) == "[object Array]";
            }
            ;
            /***/
        },
        /***/
        "./node_modules/process/browser.js": /*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // shim for using process in browser
            var process = (module.exports = {});
            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.
            var cachedSetTimeout;
            var cachedClearTimeout;

            function defaultSetTimout() {
                throw new Error("setTimeout has not been defined");
            }

            function defaultClearTimeout() {
                throw new Error("clearTimeout has not been defined");
            }
            (function() {
                try {
                    if (typeof setTimeout === "function") {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === "function") {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }
            )();

            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }
            }

            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }
            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }
            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun,args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            }
            ;
            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            }
            ;
            process.title = "browser";
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = "";
            // empty string to avoid regexp issues
            process.versions = {};

            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;
            process.listeners = function(name) {
                return [];
            }
            ;
            process.binding = function(name) {
                throw new Error("process.binding is not supported");
            }
            ;
            process.cwd = function() {
                return "/";
            }
            ;
            process.chdir = function(dir) {
                throw new Error("process.chdir is not supported");
            }
            ;
            process.umask = function() {
                return 0;
            }
            ;
            /***/
        },
        /***/
        "./node_modules/punycode/punycode.js": /*!*******************************************!*\
  !*** ./node_modules/punycode/punycode.js ***!
  \*******************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            /* WEBPACK VAR INJECTION */
            (function(module, global) {
                var __WEBPACK_AMD_DEFINE_RESULT__;
                /*! https://mths.be/punycode v1.4.1 by @mathias */
                (function(root) {
                    /** Detect free variables */
                    var freeExports = true && exports && !exports.nodeType && exports;
                    var freeModule = true && module && !module.nodeType && module;
                    var freeGlobal = typeof global == "object" && global;
                    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
                        root = freeGlobal;
                    }
                    /**
                         * The `punycode` object.
                         * @name punycode
                         * @type Object
                         */
                    var punycode, /** Highest positive signed 32-bit float value */
                        maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
                        /** Bootstring parameters */
                        base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, // 0x80
                        delimiter = "-", // '\x2D'
                        /** Regular expressions */
                        regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
                        regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
                        /** Error messages */
                        errors = {
                            overflow: "Overflow: input needs wider integers to process",
                            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                            "invalid-input": "Invalid input",
                        }, /** Convenience shortcuts */
                        baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, /** Temporary variable */
                        key;
                    /*--------------------------------------------------------------------------*/
                    /**
                         * A generic error utility function.
                         * @private
                         * @param {String} type The error type.
                         * @returns {Error} Throws a `RangeError` with the applicable error message.
                         */
                    function error(type) {
                        throw new RangeError(errors[type]);
                    }
                    /**
                         * A generic `Array#map` utility function.
                         * @private
                         * @param {Array} array The array to iterate over.
                         * @param {Function} callback The function that gets called for every array
                         * item.
                         * @returns {Array} A new array of values returned by the callback function.
                         */
                    function map(array, fn) {
                        var length = array.length;
                        var result = [];
                        while (length--) {
                            result[length] = fn(array[length]);
                        }
                        return result;
                    }
                    /**
                         * A simple `Array#map`-like wrapper to work with domain name strings or email
                         * addresses.
                         * @private
                         * @param {String} domain The domain name or email address.
                         * @param {Function} callback The function that gets called for every
                         * character.
                         * @returns {Array} A new string of characters returned by the callback
                         * function.
                         */
                    function mapDomain(string, fn) {
                        var parts = string.split("@");
                        var result = "";
                        if (parts.length > 1) {
                            // In email addresses, only the domain name should be punycoded. Leave
                            // the local part (i.e. everything up to `@`) intact.
                            result = parts[0] + "@";
                            string = parts[1];
                        }
                        // Avoid `split(regex)` for IE8 compatibility. See #17.
                        string = string.replace(regexSeparators, ".");
                        var labels = string.split(".");
                        var encoded = map(labels, fn).join(".");
                        return result + encoded;
                    }
                    /**
                         * Creates an array containing the numeric code points of each Unicode
                         * character in the string. While JavaScript uses UCS-2 internally,
                         * this function will convert a pair of surrogate halves (each of which
                         * UCS-2 exposes as separate characters) into a single code point,
                         * matching UTF-16.
                         * @see `punycode.ucs2.encode`
                         * @see <https://mathiasbynens.be/notes/javascript-encoding>
                         * @memberOf punycode.ucs2
                         * @name decode
                         * @param {String} string The Unicode input string (UCS-2).
                         * @returns {Array} The new array of code points.
                         */
                    function ucs2decode(string) {
                        var output = [], counter = 0, length = string.length, value, extra;
                        while (counter < length) {
                            value = string.charCodeAt(counter++);
                            if (value >= 0xd800 && value <= 0xdbff && counter < length) {
                                // high surrogate, and there is a next character
                                extra = string.charCodeAt(counter++);
                                if ((extra & 0xfc00) == 0xdc00) {
                                    // low surrogate
                                    output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
                                } else {
                                    // unmatched surrogate; only append this code unit, in case the next
                                    // code unit is the high surrogate of a surrogate pair
                                    output.push(value);
                                    counter--;
                                }
                            } else {
                                output.push(value);
                            }
                        }
                        return output;
                    }
                    /**
                         * Creates a string based on an array of numeric code points.
                         * @see `punycode.ucs2.decode`
                         * @memberOf punycode.ucs2
                         * @name encode
                         * @param {Array} codePoints The array of numeric code points.
                         * @returns {String} The new Unicode string (UCS-2).
                         */
                    function ucs2encode(array) {
                        return map(array, function(value) {
                            var output = "";
                            if (value > 0xffff) {
                                value -= 0x10000;
                                output += stringFromCharCode(((value >>> 10) & 0x3ff) | 0xd800);
                                value = 0xdc00 | (value & 0x3ff);
                            }
                            output += stringFromCharCode(value);
                            return output;
                        }).join("");
                    }
                    /**
                         * Converts a basic code point into a digit/integer.
                         * @see `digitToBasic()`
                         * @private
                         * @param {Number} codePoint The basic numeric code point value.
                         * @returns {Number} The numeric value of a basic code point (for use in
                         * representing integers) in the range `0` to `base - 1`, or `base` if
                         * the code point does not represent a value.
                         */
                    function basicToDigit(codePoint) {
                        if (codePoint - 48 < 10) {
                            return codePoint - 22;
                        }
                        if (codePoint - 65 < 26) {
                            return codePoint - 65;
                        }
                        if (codePoint - 97 < 26) {
                            return codePoint - 97;
                        }
                        return base;
                    }
                    /**
                         * Converts a digit/integer into a basic code point.
                         * @see `basicToDigit()`
                         * @private
                         * @param {Number} digit The numeric value of a basic code point.
                         * @returns {Number} The basic code point whose value (when used for
                         * representing integers) is `digit`, which needs to be in the range
                         * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
                         * used; else, the lowercase form is used. The behavior is undefined
                         * if `flag` is non-zero and `digit` has no uppercase form.
                         */
                    function digitToBasic(digit, flag) {
                        //  0..25 map to ASCII a..z or A..Z
                        // 26..35 map to ASCII 0..9
                        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                    }
                    /**
                         * Bias adaptation function as per section 3.4 of RFC 3492.
                         * https://tools.ietf.org/html/rfc3492#section-3.4
                         * @private
                         */
                    function adapt(delta, numPoints, firstTime) {
                        var k = 0;
                        delta = firstTime ? floor(delta / damp) : delta >> 1;
                        delta += floor(delta / numPoints);
                        for (; /* no initialization */
                             delta > (baseMinusTMin * tMax) >> 1; k += base) {
                            delta = floor(delta / baseMinusTMin);
                        }
                        return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
                    }
                    /**
                         * Converts a Punycode string of ASCII-only symbols to a string of Unicode
                         * symbols.
                         * @memberOf punycode
                         * @param {String} input The Punycode string of ASCII-only symbols.
                         * @returns {String} The resulting string of Unicode symbols.
                         */
                    function decode(input) {
                        // Don't use UCS-2
                        var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, /** Cached calculation results */
                            baseMinusT;
                        // Handle the basic code points: let `basic` be the number of input code
                        // points before the last delimiter, or `0` if there is none, then copy
                        // the first basic code points to the output.
                        basic = input.lastIndexOf(delimiter);
                        if (basic < 0) {
                            basic = 0;
                        }
                        for (j = 0; j < basic; ++j) {
                            // if it's not a basic code point
                            if (input.charCodeAt(j) >= 0x80) {
                                error("not-basic");
                            }
                            output.push(input.charCodeAt(j));
                        }
                        // Main decoding loop: start just after the last delimiter if any basic code
                        // points were copied; start at the beginning otherwise.
                        for (index = basic > 0 ? basic + 1 : 0; index < inputLength /* no final expression */
                             ; ) {
                            // `index` is the index of the next character to be consumed.
                            // Decode a generalized variable-length integer into `delta`,
                            // which gets added to `i`. The overflow checking is easier
                            // if we increase `i` as we go, then subtract off its starting
                            // value at the end to obtain `delta`.
                            for (oldi = i,
                                 w = 1,
                                 k = base /* no condition */
                                 ; ; k += base) {
                                if (index >= inputLength) {
                                    error("invalid-input");
                                }
                                digit = basicToDigit(input.charCodeAt(index++));
                                if (digit >= base || digit > floor((maxInt - i) / w)) {
                                    error("overflow");
                                }
                                i += digit * w;
                                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                                if (digit < t) {
                                    break;
                                }
                                baseMinusT = base - t;
                                if (w > floor(maxInt / baseMinusT)) {
                                    error("overflow");
                                }
                                w *= baseMinusT;
                            }
                            out = output.length + 1;
                            bias = adapt(i - oldi, out, oldi == 0);
                            // `i` was supposed to wrap around from `out` to `0`,
                            // incrementing `n` each time, so we'll fix that now:
                            if (floor(i / out) > maxInt - n) {
                                error("overflow");
                            }
                            n += floor(i / out);
                            i %= out;
                            // Insert `n` at position `i` of the output
                            output.splice(i++, 0, n);
                        }
                        return ucs2encode(output);
                    }
                    /**
                         * Converts a string of Unicode symbols (e.g. a domain name label) to a
                         * Punycode string of ASCII-only symbols.
                         * @memberOf punycode
                         * @param {String} input The string of Unicode symbols.
                         * @returns {String} The resulting Punycode string of ASCII-only symbols.
                         */
                    function encode(input) {
                        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], /** `inputLength` will hold the number of code points in `input`. */
                            inputLength, /** Cached calculation results */
                            handledCPCountPlusOne, baseMinusT, qMinusT;
                        // Convert the input in UCS-2 to Unicode
                        input = ucs2decode(input);
                        // Cache the length
                        inputLength = input.length;
                        // Initialize the state
                        n = initialN;
                        delta = 0;
                        bias = initialBias;
                        // Handle the basic code points
                        for (j = 0; j < inputLength; ++j) {
                            currentValue = input[j];
                            if (currentValue < 0x80) {
                                output.push(stringFromCharCode(currentValue));
                            }
                        }
                        handledCPCount = basicLength = output.length;
                        // `handledCPCount` is the number of code points that have been handled;
                        // `basicLength` is the number of basic code points.
                        // Finish the basic string - if it is not empty - with a delimiter
                        if (basicLength) {
                            output.push(delimiter);
                        }
                        // Main encoding loop:
                        while (handledCPCount < inputLength) {
                            // All non-basic code points < n have been handled already. Find the next
                            // larger one:
                            for (m = maxInt,
                                 j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue >= n && currentValue < m) {
                                    m = currentValue;
                                }
                            }
                            // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                            // but guard against overflow
                            handledCPCountPlusOne = handledCPCount + 1;
                            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                error("overflow");
                            }
                            delta += (m - n) * handledCPCountPlusOne;
                            n = m;
                            for (j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue < n && ++delta > maxInt) {
                                    error("overflow");
                                }
                                if (currentValue == n) {
                                    // Represent delta as a generalized variable-length integer
                                    for (q = delta,
                                         k = base /* no condition */
                                         ; ; k += base) {
                                        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                                        if (q < t) {
                                            break;
                                        }
                                        qMinusT = q - t;
                                        baseMinusT = base - t;
                                        output.push(stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0)));
                                        q = floor(qMinusT / baseMinusT);
                                    }
                                    output.push(stringFromCharCode(digitToBasic(q, 0)));
                                    bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                    delta = 0;
                                    ++handledCPCount;
                                }
                            }
                            ++delta;
                            ++n;
                        }
                        return output.join("");
                    }
                    /**
                         * Converts a Punycode string representing a domain name or an email address
                         * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
                         * it doesn't matter if you call it on a string that has already been
                         * converted to Unicode.
                         * @memberOf punycode
                         * @param {String} input The Punycoded domain name or email address to
                         * convert to Unicode.
                         * @returns {String} The Unicode representation of the given Punycode
                         * string.
                         */
                    function toUnicode(input) {
                        return mapDomain(input, function(string) {
                            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
                        });
                    }
                    /**
                         * Converts a Unicode string representing a domain name or an email address to
                         * Punycode. Only the non-ASCII parts of the domain name will be converted,
                         * i.e. it doesn't matter if you call it with a domain that's already in
                         * ASCII.
                         * @memberOf punycode
                         * @param {String} input The domain name or email address to convert, as a
                         * Unicode string.
                         * @returns {String} The Punycode representation of the given domain name or
                         * email address.
                         */
                    function toASCII(input) {
                        return mapDomain(input, function(string) {
                            return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
                        });
                    }
                    /*--------------------------------------------------------------------------*/
                    /** Define the public API */
                    punycode = {
                        /**
                             * A string representing the current Punycode.js version number.
                             * @memberOf punycode
                             * @type String
                             */
                        version: "1.4.1",
                        /**
                             * An object of methods to convert from JavaScript's internal character
                             * representation (UCS-2) to Unicode code points, and back.
                             * @see <https://mathiasbynens.be/notes/javascript-encoding>
                             * @memberOf punycode
                             * @type Object
                             */
                        ucs2: {
                            decode: ucs2decode,
                            encode: ucs2encode,
                        },
                        decode: decode,
                        encode: encode,
                        toASCII: toASCII,
                        toUnicode: toUnicode,
                    };
                    /** Expose `punycode` */
                    // Some AMD build optimizers, like r.js, check for specific condition patterns
                    // like the following:
                    if (true) {
                        !((__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                            return punycode;
                        }
                           .call(exports, __webpack_require__, exports, module)),
                          __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                    } else {}
                }
                )(this);
                /* WEBPACK VAR INJECTION */
            }
            ).call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */
                "./node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../webpack/buildin/global.js */
                "./node_modules/webpack/buildin/global.js"));
            /***/
        },
        /***/
        "./node_modules/querystring-es3/decode.js": /*!************************************************!*\
  !*** ./node_modules/querystring-es3/decode.js ***!
  \************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.
            // If obj.hasOwnProperty has been overridden, then calling
            // obj.hasOwnProperty(prop) will break.
            // See: https://github.com/joyent/node/issues/1707
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
            module.exports = function(qs, sep, eq, options) {
                sep = sep || "&";
                eq = eq || "=";
                var obj = {};
                if (typeof qs !== "string" || qs.length === 0) {
                    return obj;
                }
                var regexp = /\+/g;
                qs = qs.split(sep);
                var maxKeys = 1000;
                if (options && typeof options.maxKeys === "number") {
                    maxKeys = options.maxKeys;
                }
                var len = qs.length;
                // maxKeys <= 0 means that we should not limit keys count
                if (maxKeys > 0 && len > maxKeys) {
                    len = maxKeys;
                }
                for (var i = 0; i < len; ++i) {
                    var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
                    if (idx >= 0) {
                        kstr = x.substr(0, idx);
                        vstr = x.substr(idx + 1);
                    } else {
                        kstr = x;
                        vstr = "";
                    }
                    k = decodeURIComponent(kstr);
                    v = decodeURIComponent(vstr);
                    if (!hasOwnProperty(obj, k)) {
                        obj[k] = v;
                    } else if (isArray(obj[k])) {
                        obj[k].push(v);
                    } else {
                        obj[k] = [obj[k], v];
                    }
                }
                return obj;
            }
            ;
            var isArray = Array.isArray || function(xs) {
                return Object.prototype.toString.call(xs) === "[object Array]";
            }
            ;
            /***/
        },
        /***/
        "./node_modules/querystring-es3/encode.js": /*!************************************************!*\
  !*** ./node_modules/querystring-es3/encode.js ***!
  \************************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.
            var stringifyPrimitive = function(v) {
                switch (typeof v) {
                    case "string":
                        return v;
                    case "boolean":
                        return v ? "true" : "false";
                    case "number":
                        return isFinite(v) ? v : "";
                    default:
                        return "";
                }
            };
            module.exports = function(obj, sep, eq, name) {
                sep = sep || "&";
                eq = eq || "=";
                if (obj === null) {
                    obj = undefined;
                }
                if (typeof obj === "object") {
                    return map(objectKeys(obj), function(k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (isArray(obj[k])) {
                            return map(obj[k], function(v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        } else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);
                }
                if (!name)
                    return "";
                return (encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj)));
            }
            ;
            var isArray = Array.isArray || function(xs) {
                return Object.prototype.toString.call(xs) === "[object Array]";
            }
            ;

            function map(xs, f) {
                if (xs.map)
                    return xs.map(f);
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    res.push(f(xs[i], i));
                }
                return res;
            }
            var objectKeys = Object.keys || function(obj) {
                var res = [];
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key))
                        res.push(key);
                }
                return res;
            }
            ;
            /***/
        },
        /***/
        "./node_modules/querystring-es3/index.js": /*!***********************************************!*\
  !*** ./node_modules/querystring-es3/index.js ***!
  \***********************************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            exports.decode = exports.parse = __webpack_require__(/*! ./decode */
                "./node_modules/querystring-es3/decode.js");
            exports.encode = exports.stringify = __webpack_require__(/*! ./encode */
                "./node_modules/querystring-es3/encode.js");
            /***/
        },
        /***/
        "./node_modules/url/url.js": /*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.
            var punycode = __webpack_require__(/*! punycode */
                "./node_modules/punycode/punycode.js");
            var util = __webpack_require__(/*! ./util */
                "./node_modules/url/util.js");
            exports.parse = urlParse;
            exports.resolve = urlResolve;
            exports.resolveObject = urlResolveObject;
            exports.format = urlFormat;
            exports.Url = Url;

            function Url() {
                this.protocol = null;
                this.slashes = null;
                this.auth = null;
                this.host = null;
                this.port = null;
                this.hostname = null;
                this.hash = null;
                this.search = null;
                this.query = null;
                this.pathname = null;
                this.path = null;
                this.href = null;
            }
            // Reference: RFC 3986, RFC 1808, RFC 2396
            // define these here so at least they only have to be
            // compiled once on the first module load.
            var protocolPattern = /^([a-z0-9.+-]+:)/i
            , portPattern = /:[0-9]*$/
            , // Special case for a simple path URL
                simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/
            , // RFC 2396: characters reserved for delimiting URLs.
                // We actually just auto-escape these.
                delims = ["<", ">", '"', "`", " ", "\r", "\n", "\t"]
            , // RFC 2396: characters not allowed for various reasons.
                unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims)
            , // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
                autoEscape = ["'"].concat(unwise)
            , // Characters that are never ever allowed in a hostname.
                // Note that any invalid chars are also handled, but these
                // are the ones that are *expected* to be seen, so we fast-path
                // them.
                nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape)
            , hostEndingChars = ["/", "?", "#"]
            , hostnameMaxLen = 255
            , hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/
            , hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/
            , // protocols that can allow "unsafe" and "unwise" chars.
                unsafeProtocol = {
                    javascript: true,
                    "javascript:": true,
                }
            , // protocols that never have a hostname.
                hostlessProtocol = {
                    javascript: true,
                    "javascript:": true,
                }
            , // protocols that always contain a // bit.
                slashedProtocol = {
                    http: true,
                    https: true,
                    ftp: true,
                    gopher: true,
                    file: true,
                    "http:": true,
                    "https:": true,
                    "ftp:": true,
                    "gopher:": true,
                    "file:": true,
                }
            , querystring = __webpack_require__(/*! querystring */
                "./node_modules/querystring-es3/index.js");

            function urlParse(url, parseQueryString, slashesDenoteHost) {
                if (url && util.isObject(url) && url instanceof Url)
                    return url;
                var u = new Url();
                u.parse(url, parseQueryString, slashesDenoteHost);
                return u;
            }
            Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
                if (!util.isString(url)) {
                    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
                }
                // Copy chrome, IE, opera backslash-handling behavior.
                // Back slashes before the query string get converted to forward slashes
                // See: https://code.google.com/p/chromium/issues/detail?id=25916
                var queryIndex = url.indexOf("?")
                , splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#"
                , uSplit = url.split(splitter)
                , slashRegex = /\\/g;
                uSplit[0] = uSplit[0].replace(slashRegex, "/");
                url = uSplit.join(splitter);
                var rest = url;
                // trim before proceeding.
                // This is to support parse stuff like "  http://foo.com  \n"
                rest = rest.trim();
                if (!slashesDenoteHost && url.split("#").length === 1) {
                    // Try fast path regexp
                    var simplePath = simplePathPattern.exec(rest);
                    if (simplePath) {
                        this.path = rest;
                        this.href = rest;
                        this.pathname = simplePath[1];
                        if (simplePath[2]) {
                            this.search = simplePath[2];
                            if (parseQueryString) {
                                this.query = querystring.parse(this.search.substr(1));
                            } else {
                                this.query = this.search.substr(1);
                            }
                        } else if (parseQueryString) {
                            this.search = "";
                            this.query = {};
                        }
                        return this;
                    }
                }
                var proto = protocolPattern.exec(rest);
                if (proto) {
                    proto = proto[0];
                    var lowerProto = proto.toLowerCase();
                    this.protocol = lowerProto;
                    rest = rest.substr(proto.length);
                }
                // figure out if it's got a host
                // user@server is *always* interpreted as a hostname, and url
                // resolution will treat //foo/bar as host=foo,path=bar because that's
                // how the browser resolves relative URLs.
                if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var slashes = rest.substr(0, 2) === "//";
                    if (slashes && !(proto && hostlessProtocol[proto])) {
                        rest = rest.substr(2);
                        this.slashes = true;
                    }
                }
                if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {
                    // there's a hostname.
                    // the first instance of /, ?, ;, or # ends the host.
                    //
                    // If there is an @ in the hostname, then non-host chars *are* allowed
                    // to the left of the last @ sign, unless some host-ending character
                    // comes *before* the @-sign.
                    // URLs are obnoxious.
                    //
                    // ex:
                    // http://a@b@c/ => user:a@b host:c
                    // http://a@b?@c => user:a host:c path:/?@c
                    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                    // Review our test case against browsers more comprehensively.
                    // find the first instance of any hostEndingChars
                    var hostEnd = -1;
                    for (var i = 0; i < hostEndingChars.length; i++) {
                        var hec = rest.indexOf(hostEndingChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }
                    // at this point, either we have an explicit point where the
                    // auth portion cannot go past, or the last @ char is the decider.
                    var auth, atSign;
                    if (hostEnd === -1) {
                        // atSign can be anywhere.
                        atSign = rest.lastIndexOf("@");
                    } else {
                        // atSign must be in auth portion.
                        // http://a@b/c@d => host:b auth:a path:/c@d
                        atSign = rest.lastIndexOf("@", hostEnd);
                    }
                    // Now we have a portion which is definitely the auth.
                    // Pull that off.
                    if (atSign !== -1) {
                        auth = rest.slice(0, atSign);
                        rest = rest.slice(atSign + 1);
                        this.auth = decodeURIComponent(auth);
                    }
                    // the host is the remaining to the left of the first non-host char
                    hostEnd = -1;
                    for (var i = 0; i < nonHostChars.length; i++) {
                        var hec = rest.indexOf(nonHostChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }
                    // if we still have not hit it, then the entire thing is a host.
                    if (hostEnd === -1)
                        hostEnd = rest.length;
                    this.host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);
                    // pull out port.
                    this.parseHost();
                    // we've indicated that there is a hostname,
                    // so even if it's empty, it has to be present.
                    this.hostname = this.hostname || "";
                    // if hostname begins with [ and ends with ]
                    // assume that it's an IPv6 address.
                    var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
                    // validate a little.
                    if (!ipv6Hostname) {
                        var hostparts = this.hostname.split(/\./);
                        for (var i = 0, l = hostparts.length; i < l; i++) {
                            var part = hostparts[i];
                            if (!part)
                                continue;
                            if (!part.match(hostnamePartPattern)) {
                                var newpart = "";
                                for (var j = 0, k = part.length; j < k; j++) {
                                    if (part.charCodeAt(j) > 127) {
                                        // we replace non-ASCII char with a temporary placeholder
                                        // we need this to make sure size of hostname is not
                                        // broken by replacing non-ASCII by nothing
                                        newpart += "x";
                                    } else {
                                        newpart += part[j];
                                    }
                                }
                                // we test again with ASCII char only
                                if (!newpart.match(hostnamePartPattern)) {
                                    var validParts = hostparts.slice(0, i);
                                    var notHost = hostparts.slice(i + 1);
                                    var bit = part.match(hostnamePartStart);
                                    if (bit) {
                                        validParts.push(bit[1]);
                                        notHost.unshift(bit[2]);
                                    }
                                    if (notHost.length) {
                                        rest = "/" + notHost.join(".") + rest;
                                    }
                                    this.hostname = validParts.join(".");
                                    break;
                                }
                            }
                        }
                    }
                    if (this.hostname.length > hostnameMaxLen) {
                        this.hostname = "";
                    } else {
                        // hostnames are always lower case.
                        this.hostname = this.hostname.toLowerCase();
                    }
                    if (!ipv6Hostname) {
                        // IDNA Support: Returns a punycoded representation of "domain".
                        // It only converts parts of the domain name that
                        // have non-ASCII characters, i.e. it doesn't matter if
                        // you call it with a domain that already is ASCII-only.
                        this.hostname = punycode.toASCII(this.hostname);
                    }
                    var p = this.port ? ":" + this.port : "";
                    var h = this.hostname || "";
                    this.host = h + p;
                    this.href += this.host;
                    // strip [ and ] from the hostname
                    // the host field still retains them, though
                    if (ipv6Hostname) {
                        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                        if (rest[0] !== "/") {
                            rest = "/" + rest;
                        }
                    }
                }
                // now rest is set to the post-host stuff.
                // chop off any delim chars.
                if (!unsafeProtocol[lowerProto]) {
                    // First, make 100% sure that any "autoEscape" chars get
                    // escaped, even if encodeURIComponent doesn't think they
                    // need to be.
                    for (var i = 0, l = autoEscape.length; i < l; i++) {
                        var ae = autoEscape[i];
                        if (rest.indexOf(ae) === -1)
                            continue;
                        var esc = encodeURIComponent(ae);
                        if (esc === ae) {
                            esc = escape(ae);
                        }
                        rest = rest.split(ae).join(esc);
                    }
                }
                // chop off from the tail first.
                var hash = rest.indexOf("#");
                if (hash !== -1) {
                    // got a fragment string.
                    this.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }
                var qm = rest.indexOf("?");
                if (qm !== -1) {
                    this.search = rest.substr(qm);
                    this.query = rest.substr(qm + 1);
                    if (parseQueryString) {
                        this.query = querystring.parse(this.query);
                    }
                    rest = rest.slice(0, qm);
                } else if (parseQueryString) {
                    // no query string, but parseQueryString still requested
                    this.search = "";
                    this.query = {};
                }
                if (rest)
                    this.pathname = rest;
                if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
                    this.pathname = "/";
                }
                //to support http.request
                if (this.pathname || this.search) {
                    var p = this.pathname || "";
                    var s = this.search || "";
                    this.path = p + s;
                }
                // finally, reconstruct the href based on what has been validated.
                this.href = this.format();
                return this;
            }
            ;
            // format a parsed object into a url string
            function urlFormat(obj) {
                // ensure it's an object, and not a string url.
                // If it's an obj, this is a no-op.
                // this way, you can call url_format() on strings
                // to clean up potentially wonky urls.
                if (util.isString(obj))
                    obj = urlParse(obj);
                if (!(obj instanceof Url))
                    return Url.prototype.format.call(obj);
                return obj.format();
            }
            Url.prototype.format = function() {
                var auth = this.auth || "";
                if (auth) {
                    auth = encodeURIComponent(auth);
                    auth = auth.replace(/%3A/i, ":");
                    auth += "@";
                }
                var protocol = this.protocol || ""
                , pathname = this.pathname || ""
                , hash = this.hash || ""
                , host = false
                , query = "";
                if (this.host) {
                    host = auth + this.host;
                } else if (this.hostname) {
                    host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
                    if (this.port) {
                        host += ":" + this.port;
                    }
                }
                if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
                    query = querystring.stringify(this.query);
                }
                var search = this.search || (query && "?" + query) || "";
                if (protocol && protocol.substr(-1) !== ":")
                    protocol += ":";
                // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
                // unless they had them to begin with.
                if (this.slashes || ((!protocol || slashedProtocol[protocol]) && host !== false)) {
                    host = "//" + (host || "");
                    if (pathname && pathname.charAt(0) !== "/")
                        pathname = "/" + pathname;
                } else if (!host) {
                    host = "";
                }
                if (hash && hash.charAt(0) !== "#")
                    hash = "#" + hash;
                if (search && search.charAt(0) !== "?")
                    search = "?" + search;
                pathname = pathname.replace(/[?#]/g, function(match) {
                    return encodeURIComponent(match);
                });
                search = search.replace("#", "%23");
                return protocol + host + pathname + search + hash;
            }
            ;

            function urlResolve(source, relative) {
                return urlParse(source, false, true).resolve(relative);
            }
            Url.prototype.resolve = function(relative) {
                return this.resolveObject(urlParse(relative, false, true)).format();
            }
            ;

            function urlResolveObject(source, relative) {
                if (!source)
                    return relative;
                return urlParse(source, false, true).resolveObject(relative);
            }
            Url.prototype.resolveObject = function(relative) {
                if (util.isString(relative)) {
                    var rel = new Url();
                    rel.parse(relative, false, true);
                    relative = rel;
                }
                var result = new Url();
                var tkeys = Object.keys(this);
                for (var tk = 0; tk < tkeys.length; tk++) {
                    var tkey = tkeys[tk];
                    result[tkey] = this[tkey];
                }
                // hash is always overridden, no matter what.
                // even href="" will remove it.
                result.hash = relative.hash;
                // if the relative url is empty, then there's nothing left to do here.
                if (relative.href === "") {
                    result.href = result.format();
                    return result;
                }
                // hrefs like //foo/bar always cut to the protocol.
                if (relative.slashes && !relative.protocol) {
                    // take everything except the protocol from relative
                    var rkeys = Object.keys(relative);
                    for (var rk = 0; rk < rkeys.length; rk++) {
                        var rkey = rkeys[rk];
                        if (rkey !== "protocol")
                            result[rkey] = relative[rkey];
                    }
                    //urlParse appends trailing / to urls like http://www.example.com
                    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
                        result.path = result.pathname = "/";
                    }
                    result.href = result.format();
                    return result;
                }
                if (relative.protocol && relative.protocol !== result.protocol) {
                    // if it's a known url protocol, then changing
                    // the protocol does weird things
                    // first, if it's not file:, then we MUST have a host,
                    // and if there was a path
                    // to begin with, then we MUST have a path.
                    // if it is file:, then the host is dropped,
                    // because that's known to be hostless.
                    // anything else is assumed to be absolute.
                    if (!slashedProtocol[relative.protocol]) {
                        var keys = Object.keys(relative);
                        for (var v = 0; v < keys.length; v++) {
                            var k = keys[v];
                            result[k] = relative[k];
                        }
                        result.href = result.format();
                        return result;
                    }
                    result.protocol = relative.protocol;
                    if (!relative.host && !hostlessProtocol[relative.protocol]) {
                        var relPath = (relative.pathname || "").split("/");
                        while (relPath.length && !(relative.host = relPath.shift()))
                            ;
                        if (!relative.host)
                            relative.host = "";
                        if (!relative.hostname)
                            relative.hostname = "";
                        if (relPath[0] !== "")
                            relPath.unshift("");
                        if (relPath.length < 2)
                            relPath.unshift("");
                        result.pathname = relPath.join("/");
                    } else {
                        result.pathname = relative.pathname;
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    result.host = relative.host || "";
                    result.auth = relative.auth;
                    result.hostname = relative.hostname || relative.host;
                    result.port = relative.port;
                    // to support http.request
                    if (result.pathname || result.search) {
                        var p = result.pathname || "";
                        var s = result.search || "";
                        result.path = p + s;
                    }
                    result.slashes = result.slashes || relative.slashes;
                    result.href = result.format();
                    return result;
                }
                var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/"
                , isRelAbs = relative.host || (relative.pathname && relative.pathname.charAt(0) === "/")
                , mustEndAbs = isRelAbs || isSourceAbs || (result.host && relative.pathname)
                , removeAllDots = mustEndAbs
                , srcPath = (result.pathname && result.pathname.split("/")) || []
                , relPath = (relative.pathname && relative.pathname.split("/")) || []
                , psychotic = result.protocol && !slashedProtocol[result.protocol];
                // if the url is a non-slashed url, then relative
                // links like ../.. should be able
                // to crawl up to the hostname, as well.  This is strange.
                // result.protocol has already been set by now.
                // Later on, put the first path part into the host field.
                if (psychotic) {
                    result.hostname = "";
                    result.port = null;
                    if (result.host) {
                        if (srcPath[0] === "")
                            srcPath[0] = result.host;
                        else
                            srcPath.unshift(result.host);
                    }
                    result.host = "";
                    if (relative.protocol) {
                        relative.hostname = null;
                        relative.port = null;
                        if (relative.host) {
                            if (relPath[0] === "")
                                relPath[0] = relative.host;
                            else
                                relPath.unshift(relative.host);
                        }
                        relative.host = null;
                    }
                    mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
                }
                if (isRelAbs) {
                    // it's absolute.
                    result.host = relative.host || relative.host === "" ? relative.host : result.host;
                    result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
                    result.search = relative.search;
                    result.query = relative.query;
                    srcPath = relPath;
                    // fall through to the dot-handling below.
                } else if (relPath.length) {
                    // it's relative
                    // throw away the existing file, and take the new path instead.
                    if (!srcPath)
                        srcPath = [];
                    srcPath.pop();
                    srcPath = srcPath.concat(relPath);
                    result.search = relative.search;
                    result.query = relative.query;
                } else if (!util.isNullOrUndefined(relative.search)) {
                    // just pull out the search.
                    // like href='?foo'.
                    // Put this after the other two cases because it simplifies the booleans
                    if (psychotic) {
                        result.hostname = result.host = srcPath.shift();
                        //occationaly the auth can get stuck only in host
                        //this especially happens in cases like
                        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
                        if (authInHost) {
                            result.auth = authInHost.shift();
                            result.host = result.hostname = authInHost.shift();
                        }
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    //to support http.request
                    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
                    }
                    result.href = result.format();
                    return result;
                }
                if (!srcPath.length) {
                    // no path at all.  easy.
                    // we've already handled the other stuff above.
                    result.pathname = null;
                    //to support http.request
                    if (result.search) {
                        result.path = "/" + result.search;
                    } else {
                        result.path = null;
                    }
                    result.href = result.format();
                    return result;
                }
                // if a url ENDs in . or .., then it must get a trailing slash.
                // however, if it ends in anything else non-slashy,
                // then it must NOT get a trailing slash.
                var last = srcPath.slice(-1)[0];
                var hasTrailingSlash = ((result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..")) || last === "";
                // strip single dots, resolve double dots to parent dir
                // if the path tries to go above the root, `up` ends up > 0
                var up = 0;
                for (var i = srcPath.length; i >= 0; i--) {
                    last = srcPath[i];
                    if (last === ".") {
                        srcPath.splice(i, 1);
                    } else if (last === "..") {
                        srcPath.splice(i, 1);
                        up++;
                    } else if (up) {
                        srcPath.splice(i, 1);
                        up--;
                    }
                }
                // if the path is allowed to go above the root, restore leading ..s
                if (!mustEndAbs && !removeAllDots) {
                    for (; up--; up) {
                        srcPath.unshift("..");
                    }
                }
                if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
                    srcPath.unshift("");
                }
                if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
                    srcPath.push("");
                }
                var isAbsolute = srcPath[0] === "" || (srcPath[0] && srcPath[0].charAt(0) === "/");
                // put the host back
                if (psychotic) {
                    result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
                    //occationaly the auth can get stuck only in host
                    //this especially happens in cases like
                    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
                    if (authInHost) {
                        result.auth = authInHost.shift();
                        result.host = result.hostname = authInHost.shift();
                    }
                }
                mustEndAbs = mustEndAbs || (result.host && srcPath.length);
                if (mustEndAbs && !isAbsolute) {
                    srcPath.unshift("");
                }
                if (!srcPath.length) {
                    result.pathname = null;
                    result.path = null;
                } else {
                    result.pathname = srcPath.join("/");
                }
                //to support request.http
                if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                    result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
                }
                result.auth = relative.auth || result.auth;
                result.slashes = result.slashes || relative.slashes;
                result.href = result.format();
                return result;
            }
            ;
            Url.prototype.parseHost = function() {
                var host = this.host;
                var port = portPattern.exec(host);
                if (port) {
                    port = port[0];
                    if (port !== ":") {
                        this.port = port.substr(1);
                    }
                    host = host.substr(0, host.length - port.length);
                }
                if (host)
                    this.hostname = host;
            }
            ;
            /***/
        },
        /***/
        "./node_modules/url/util.js": /*!**********************************!*\
  !*** ./node_modules/url/util.js ***!
  \**********************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            module.exports = {
                isString: function(arg) {
                    return typeof arg === "string";
                },
                isObject: function(arg) {
                    return typeof arg === "object" && arg !== null;
                },
                isNull: function(arg) {
                    return arg === null;
                },
                isNullOrUndefined: function(arg) {
                    return arg == null;
                },
            };
            /***/
        },
        /***/
        "./node_modules/webpack/buildin/global.js": /*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var g;
            // This works in non-strict mode
            g = (function() {
                return this;
            }
                )();
            try {
                // This works if eval is allowed (see CSP)
                g = g || new Function("return this")();
            } catch (e) {
                // This works if the window reference is available
                if (typeof window === "object")
                    g = window;
            }
            // g can still be undefined, but nothing to do about it...
            // We return undefined, instead of nothing here, so it's
            // easier to handle this case. if(!global) { ...}
            module.exports = g;
            /***/
        },
        /***/
        "./node_modules/webpack/buildin/module.js": /*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = function(module) {
                if (!module.webpackPolyfill) {
                    module.deprecate = function() {}
                    ;
                    module.paths = [];
                    // module.parent = undefined by default
                    if (!module.children)
                        module.children = [];
                    Object.defineProperty(module, "loaded", {
                        enumerable: true,
                        get: function() {
                            return module.l;
                        },
                    });
                    Object.defineProperty(module, "id", {
                        enumerable: true,
                        get: function() {
                            return module.i;
                        },
                    });
                    module.webpackPolyfill = 1;
                }
                return module;
            }
            ;
            /***/
        },
        /***/
        "./src/js/app.js": /*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            "use strict";
            window.loadedScript = true;
            // ENV:
            var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
            // IMPORTS:
            __webpack_require__(/*! ./libs/modernizr.js */
                "./src/js/libs/modernizr.js");
            var io = __webpack_require__(/*! ./libs/io-client.js */
                "./src/js/libs/io-client.js");
            var UTILS = __webpack_require__(/*! ./libs/utils.js */
                "./src/js/libs/utils.js");
            var animText = __webpack_require__(/*! ./libs/animText.js */
                "./src/js/libs/animText.js");
            var config = __webpack_require__(/*! ./config.js */
                "./src/js/config.js");
            var GameObject = __webpack_require__(/*! ./data/gameObject.js */
                "./src/js/data/gameObject.js");
            var items = __webpack_require__(/*! ./data/items.js */
                "./src/js/data/items.js");
            var MapManager = __webpack_require__(/*! ./data/mapManager.js */
                "./src/js/data/mapManager.js");
            var ObjectManager = __webpack_require__(/*! ./data/objectManager.js */
                "./src/js/data/objectManager.js");
            var Player = __webpack_require__(/*! ./data/player.js */
                "./src/js/data/player.js");
            var store = __webpack_require__(/*! ./data/store.js */
                "./src/js/data/store.js");
            var Projectile = __webpack_require__(/*! ./data/projectile.js */
                "./src/js/data/projectile.js");
            var ProjectileManager = __webpack_require__(/*! ./data/projectileManager.js */
                "./src/js/data/projectileManager.js");
            var SoundManager = __webpack_require__(/*! ./libs/soundManager.js */
                "./src/js/libs/soundManager.js").obj;
            var textManager = new animText.TextManager();
            // VULTR:
            var VultrClient = __webpack_require__(/*! ../../vultr/VultrClient.js */
                "./vultr/VultrClient.js");
            var vultrClient = new VultrClient("moomoo.io",3000,config.maxPlayers,5);
            vultrClient.debugLog = false;
            // URL PARAMS:
            function getParameterByName(name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
                , results = regex.exec(url);
                if (!results)
                    return null;
                if (!results[2])
                    return "";
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            function connectBots() {
                if (!connectBotts) {
                    return;
                }
                for (let i = 0; i < (wsconnected < 3 ? 3 : 4); i++) {
                    if (isProd && tmpAddress) {
                        window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                            action: "homepage",
                        }).then(function(token) {
                            // CONNECT SOCKET:
                            bConnect(token, i);
                        });
                    } else {
                        // CONNECT SOCKET:
                        bConnect(null, i);
                    }
                }
            }
            // SOCKET & CONNECTION:
            var connected = false;
            var startedConnecting = false;

            function connectSocketIfReady() {
                // MAKE SURE IT'S READY:
                if (!didLoad || !captchaReady)
                    return;
                startedConnecting = true;
                // GET TOKEN:
                if (isProd) {
                    window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                        action: "homepage",
                    }).then(function(token) {
                        // CONNECT SOCKET:
                        connectSocket(token);
                    });
                } else {
                    // CONNECT SOCKET:
                    connectSocket(null);
                }
            }

            function connectSocket(token) {
                // CONNECT SOCKET:
                vultrClient.start(function(address, port, gameIndex) {
                    // CREATE ADDRESS:
                    var protocol = isProd ? "wss" : "ws";
                    var wsAddress = protocol + "://" + address + ":" + 8008 + "/?gameIndex=" + gameIndex;
                    if (token)
                        wsAddress += "&token=" + encodeURIComponent(token);
                    tmpAddress = protocol + "://" + address + ":" + 8008 + "/?gameIndex=" + gameIndex;
                    // CONNECT:
                    io.connect(wsAddress, function(error) {
                        /*setInterval(() => {
                                  minPacket = Math.max(0, minPacket - minMax);
                              }, minTime);
                              setInterval(() => {
                                  secPacket = Math.max(0, secPacket - secMax);
                              }, secTime);*/
                        pingSocket();
                        setInterval(()=>pingSocket(), 1000);
                        if (error) {
                            disconnect(error);
                        } else {
                            connected = true;
                            startGame();
                        }
                    }, {
                        //
                        id: setInitData,
                        d: disconnect,
                        1: setupGame,
                        2: addPlayer,
                        4: removePlayer,
                        33: Ti,
                        5: updateLeaderboard,
                        6: loadGameObject,
                        a: loadAI,
                        aa: animateAI,
                        7: gatherAnimation,
                        8: wiggleGameObject,
                        sp: shootTurret,
                        9: updatePlayerValue,
                        h: Si,
                        11: killPlayer,
                        12: killObject,
                        13: killObjects,
                        14: updateItemCounts,
                        15: updateAge,
                        16: updateUpgrades,
                        17: updateItems,
                        18: addProjectile,
                        19: remProjectile,
                        20: serverShutdownNotice,
                        ac: addAlliance,
                        ad: deleteAlliance,
                        an: allianceNotification,
                        st: setPlayerTeam,
                        sa: setAlliancePlayers,
                        us: updateStoreItems,
                        ch: receiveChat,
                        mm: updateMinimap,
                        t: showText,
                        p: pingMap,
                        pp: pingSocketResponse,
                    });
                    // SERVER LIST:
                    setupServerStatus();
                    // CHECK AGAIN AFTER DELAY:
                    setTimeout(()=>updateServerList(), 3 * 1000);
                }, function(error) {
                    console.error("Vultr error:", error);
                    disconnect("disconnected");
                });
            }

            function socketReady() {
                return io.connected;
            }

            function joinParty() {
                var currentKey = serverBrowser.value;
                var key = prompt("party key", currentKey);
                if (key) {
                    window.onbeforeunload = undefined;
                    // Don't ask to leave
                    window.location.href = "/?server=" + key;
                }
            }
            /**/
            // SOUND:
            var Sound = new SoundManager(config,UTILS);

            function toggleSound(active) {
                if (active == undefined)
                    active = !Sound.active;
                Sound.active = active;
                //Sound.toggleMute("menu", !active);
                saveVal("moo_moosic", active ? 1 : 0);
            }
            // MATHS:
            var mathPI = Math.PI;
            var mathPI2 = mathPI * 2;
            var mathPI3 = mathPI * 3;
            Math.lerpAngle = function(value1, value2, amount) {
                var difference = Math.abs(value2 - value1);
                if (difference > mathPI) {
                    if (value1 > value2) {
                        value2 += mathPI2;
                    } else {
                        value1 += mathPI2;
                    }
                }
                var value = value2 + (value1 - value2) * amount;
                if (value >= 0 && value <= mathPI2)
                    return value;
                return value % mathPI2;
            }
            ;
            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r)
                    r = w / 2;
                if (h < 2 * r)
                    r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            }
            ;
            // STORAGE:
            var canStore;
            if (typeof Storage !== "undefined") {
                canStore = true;
            }

            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }

            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }

            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }
            // GLOBAL VALUES:
            var moofoll = getSavedVal("moofoll");

            function follmoo() {
                if (!moofoll) {
                    moofoll = true;
                    saveVal("moofoll", 1);
                }
            }
            var useNativeResolution;
            var showPing;
            var playSound;
            var pixelDensity = 1;
            var delta, now, lastSent;
            var lastUpdate = Date.now();
            var keys, attackState;
            var ais = [];
            var players = [];
            var alliances = [];
            var gameObjects = [];
            var projectiles = [];
            var projectileManager = new ProjectileManager(Projectile,projectiles,players,ais,objectManager,items,config,UTILS);
            var AiManager = __webpack_require__(/*! ./data/aiManager.js */
                "./src/js/data/aiManager.js");
            var AI = __webpack_require__(/*! ./data/ai.js */
                "./src/js/data/ai.js");
            var aiManager = new AiManager(ais,AI,players,items,null,config,UTILS);
            var player, playerSID, tmpObj;
            var waterMult = 1;
            var waterPlus = 0;
            var mouseX = 0;
            var mouseY = 0;
            var controllingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
            };
            var attackingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
            };
            var camX, camY;
            var tmpDir;
            var skinColor = 6;
            var selectColorIndex = 6;
            var maxScreenWidth = config.maxScreenWidth * parseFloat(getEl("vision").value);
            var maxScreenHeight = config.maxScreenHeight * parseFloat(getEl("vision").value);
            function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * 1.5 || maxScreenHeight != config.maxScreenHeight * 1.5) {
                    maxScreenWidth = config.maxScreenWidth * 1.5;
                    maxScreenHeight = config.maxScreenHeight * 1.5;
                    resize();
                }
            }
            function resetZoom() {
                if (maxScreenWidth != config.maxScreenWidth * parseFloat(getEl("vision").value) || maxScreenHeight != config.maxScreenHeight * parseFloat(getEl("vision").value)) {
                    maxScreenWidth = config.maxScreenWidth * parseFloat(getEl("vision").value);
                    maxScreenHeight = config.maxScreenHeight * parseFloat(getEl("vision").value);
                    resize();
                }
            }
            getEl("vision").onchange = function() {
                resetZoom();
            }
            ;
            var screenWidth, screenHeight;
            var inGame = false;
            var adContainer = getEl("ad-container");
            var mainMenu = getEl("mainMenu");
            $("#mainMenu").css({
                "background-color": "rgba(0, 0, 0, 0.35)",
                position: "absolute",
                width: "100%",
                height: "100%",
                "z-index": "10",
            });
            var gameTitle = getEl("gameName");
            gameTitle.innerText = "Water Client ";
            var enterGameButton = getEl("enterGame");
            var promoImageButton = getEl("promoImg");
            promoImageButton.remove();
            var promoImageHolder = getEl("promoImgHolder");
            $("#promoImgHolder").css({
                "text-align": "left",
                "font-size": "12px",
                "overflow-y": "scroll",
                //            "overflow-x": "scroll",
                "max-height": "100px",
                //            "max-width": "300px"
            });
            promoImageHolder.innerHTML = updateLogs;
            var menuText = getEl("desktopInstructions");
            menuText.innerHTML = `
        Toggle Menu: ESC<br>
        Keys: Q, F, V, H - Macro,<br>
              R - InstaKill<br>
              <br>
        Left/Middle/Right: Bull/Range/Tank<br>
		`;
            var partyButton = getEl("partyButton");
            var joinPartyButton = getEl("joinPartyButton");
            var settingsButton = getEl("settingsButton");
            var settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
            var allianceButton = getEl("allianceButton");
            var storeButton = getEl("storeButton");
            var chatButton = getEl("chatButton");
            var gameCanvas = getEl("gameCanvas");
            var mainContext = gameCanvas.getContext("2d");
            var serverBrowser = getEl("serverBrowser");
            var nativeResolutionCheckbox = getEl("nativeResolution");
            var showPingCheckbox = getEl("showPing");
            var playMusicCheckbox = getEl("playMusic");
            var pingDisplay = getEl("pingDisplay");
            var shutdownDisplay = getEl("shutdownDisplay");
            var setupCard = getEl("setupCard");
            var passWord = document.createElement("div");
            passWord.id = "modPass";
            setupCard.appendChild(passWord);
            passWord.innerHTML = `<br><input type = "password" id = "password" placeholder = "Enter Pass" maxlength = "30">`;
            var passWordInput = getEl("password");
            passWordInput.style = `
        text-align: center;
        font-size: 26px;
        padding: 6px;
        border: none;
        outline: none;
        box-sizing: border-box;
        color: #4A4A4A;
        background-color: #e5e3e3;
        width: 100%;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        `;
            var compasswo = document.createElement("div");
            compasswo.id = "commandPass";
            setupCard.appendChild(compasswo);
            compasswo.innerHTML = `<br><input type = "password" id = "passwordcom" placeholder = "Enter Command Pass" maxlength = "30">`;
            var commandPass = getEl("passwordcom");
            commandPass.style = `
        text-align: center;
        font-size: 26px;
        margin-bottom: 16px;
        padding: 6px;
        border: none;
        outline: none;
        box-sizing: border-box;
        color: #4A4A4A;
        background-color: #e5e3e3;
        width: 100%;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        `;
            let menuContainer = getEl("menuContainer");
            var menuCardHolder = getEl("menuCardHolder");
            var guideCard = getEl("guideCard");
            var loadingText = getEl("loadingText");
            var gameUI = getEl("gameUI");
            var actionBar = getEl("actionBar");
            var resourceDisplay = document.getElementById("resDisplay");
            var scoreDisplay = getEl("scoreDisplay");
            var foodDisplay = getEl("foodDisplay");
            var woodDisplay = getEl("woodDisplay");
            var stoneDisplay = getEl("stoneDisplay");
            var killCounter = getEl("killCounter");
            var topinfoHolder = getEl("topInfoHolder");
            var leaderboard = getEl("leaderboard");
            const itemforleaderboard = document.createElement("p")
            itemforleaderboard.textContent = "Water Client V3"
            itemforleaderboard.style.fontSize = "20px"
            var adCard = getEl("adCard");
            adCard.remove();
            var leaderboardData = getEl("leaderboardData");
            leaderboard.append(itemforleaderboard)
            var nameInput = getEl("nameInput");
            var itemInfoHolder = getEl("itemInfoHolder");
            var ageText = getEl("ageText");
            var ageBarBody = getEl("ageBarBody");
            var upgradeHolder = getEl("upgradeHolder");
            var upgradeCounter = getEl("upgradeCounter");
            var allianceMenu = getEl("allianceMenu");
            var allianceHolder = getEl("allianceHolder");
            var allianceManager = getEl("allianceManager");
            var mapDisplay = getEl("mapDisplay");
            var diedText = getEl("diedText");
            var skinColorHolder = getEl("skinColorHolder");
            var mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            var storeMenu = getEl("storeMenu");
            storeMenu.style.height = "600px"
            var storeHolder = getEl("storeHolder");
            storeHolder.style.height = "400px"
            var noticationDisplay = getEl("noticationDisplay");
            var hats = store.hats;
            var accessories = store.accessories;
            var objectManager = new ObjectManager(GameObject,gameObjects,UTILS,config);
            var outlineColor = "#525252";
            var darkOutlineColor = "#3d3f42";
            var outlineWidth = 5.5;
            let playernamess;
            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }
            // YOUTUBERS:
            var featuredYoutuber = getEl("featuredYoutube");
            var youtuberList = [{
                name: "essa-PrO",
                link: "https://www.youtube.com/channel/UC3HBoei3t78yJBQIJxYxifg",
            }];
            var tmpYoutuber = youtuberList[UTILS.randInt(0, youtuberList.length - 1)];
            featuredYoutuber.innerHTML = "<a target='_blank' class='ytLink' href='" + tmpYoutuber.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + tmpYoutuber.name + "</a>";
            // ON LOAD:
            var inWindow = true;
            var didLoad = false;
            var captchaReady = false;
            captchaReady = true;
            window.onblur = function() {
                inWindow = false;
            }
            ;
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    resetMoveDir();
                }
            }
            ;
            window.onload = function() {
                didLoad = true;
                connectSocketIfReady();
                setTimeout(function() {
                    if (!startedConnecting) {
                        window.location.reload();
                    }
                }, 20 * 1000);
            }
            ;
            /*window.recaptchaCallback = function() {
                    console.log("a")
                    captchaReady = true;
                    connectSocketIfReady();
                };*/
            gameCanvas.oncontextmenu = function() {
                return false;
            }
            ;

            function disconnect(reason) {
                connected = false;
                io.close();
                project.close();
                showLoadingText(noob ? "Wrong Password" : reason);
            }

            function showLoadingText(text) {
                mainMenu.style.display = "block";
                gameUI.style.display = "none";
                menuCardHolder.style.display = "none";
                diedText.style.display = "none";
                loadingText.style.display = "block";
                loadingText.innerHTML = text + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>";
            }

            // BUTTON EVENTS:
            function bindEvents() {
                enterGameButton.onclick = UTILS.checkTrusted(function() {
                    // START GAME:
                    doEnterGame();
                });
                UTILS.hookTouchEvents(enterGameButton);
                joinPartyButton.onclick = UTILS.checkTrusted(function() {
                    setTimeout(function() {
                        joinParty();
                    }, 10);
                });
                UTILS.hookTouchEvents(joinPartyButton);
                settingsButton.onclick = UTILS.checkTrusted(function() {
                    toggleSettings();
                });
                UTILS.hookTouchEvents(settingsButton);
                allianceButton.onclick = UTILS.checkTrusted(function() {
                    toggleAllianceMenu();
                });
                UTILS.hookTouchEvents(allianceButton);
                storeButton.onclick = UTILS.checkTrusted(function() {
                    toggleStoreMenu();
                });
                UTILS.hookTouchEvents(storeButton);
                chatButton.onclick = UTILS.checkTrusted(function() {
                    toggleChat()
                });
                UTILS.hookTouchEvents(chatButton);
                mapDisplay.onclick = UTILS.checkTrusted(function() {
                    sendMapPing();
                });
                UTILS.hookTouchEvents(mapDisplay);
            }
            // SETUP SERVER SELECTOR:
            var gamesPerServer = 1;
            var serverPlayerCounts = [];

            function setupServerStatus() {
                var tmpHTML = "";
                // ADD SERVER SELECTOR:
                var overallTotal = 0;
                var regionCounter = 0;
                serverPlayerCounts = [];
                for (var region in vultrClient.servers) {
                    var serverList = vultrClient.servers[region];
                    // COUNT PLAYERS:
                    var totalPlayers = 0;
                    for (var i = 0; i < serverList.length; i++) {
                        for (var j = 0; j < serverList[i].games.length; j++) {
                            totalPlayers += serverList[i].games[j].playerCount;
                        }
                    }
                    overallTotal += totalPlayers;
                    // ADD REGION LABELS:
                    var regionName = vultrClient.regionInfo[region].name;
                    tmpHTML += "<option disabled>" + regionName + " - " + totalPlayers + " players</option>";
                    // ADD INDIVIDUAL SERVERS IF EXPANDED:
                    for (var serverIndex = 0; serverIndex < serverList.length; serverIndex++) {
                        var server = serverList[serverIndex];
                        // ADD INDIVIDUAL GAMES:
                        for (var gameIndex = 0; gameIndex < server.games.length; gameIndex++) {
                            var game = server.games[gameIndex];
                            var adjustedIndex = server.index * gamesPerServer + gameIndex + 1;
                            var isSelected = vultrClient.server && vultrClient.server.region === server.region && vultrClient.server.index === server.index && vultrClient.gameIndex == gameIndex;
                            var serverLabel = regionName + " " + adjustedIndex + " [" + Math.min(game.playerCount, config.maxPlayers) + "/" + config.maxPlayers + "]";
                            // var itemClass = "menuSelector" + (isSelected ? " selectedMenuSelector" : "") + (game.isPrivate ? " privateMenuSelector" : "");
                            // var onClick = game.isPrivate ? "" : "switchServer(" + region + "," + serverIndex + "," + gameIndex + ")";
                            let serverID = vultrClient.stripRegion(region) + ":" + serverIndex + ":" + gameIndex;
                            if (isSelected)
                                partyButton.getElementsByTagName("span")[0].innerText = serverID;
                            let selected = isSelected ? "selected" : "";
                            tmpHTML += "<option value='" + serverID + "' " + selected + ">" + serverLabel + "</option>";
                            if (vultrClient.stripRegion(region) == urGameRegion) {
                                serverPlayerCounts.push({
                                    id: serverID,
                                    count: game.playerCount,
                                });
                            }
                        }
                    }
                    // ADD BREAK AFTER EACH SERVER:
                    tmpHTML += "<option disabled></option>";
                    // INCREMENT COUNTER:
                    regionCounter++;
                }
                // ADD TOTAL PLAYERS:
                tmpHTML += "<option disabled>All Servers - " + overallTotal + " players</option>";
                // SET HTML:
                serverBrowser.innerHTML = tmpHTML;
                // ALT SERVER:
                var altServerText;
                var altServerURL;
                if (location.hostname == "sandbox.moomoo.io") {
                    altServerText = "Back to MooMoo";
                    altServerURL = "//moomoo.io/";
                } else {
                    altServerText = "Try the sandbox";
                    altServerURL = "//sandbox.moomoo.io/";
                }
                getEl("altServer").innerHTML = "<a href='" + altServerURL + "'>" + altServerText + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
            }

            function updateServerList() {
                var xmlhttp = new XMLHttpRequest();
                var url = "/serverData";
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            // Parse the text and set it to Vultr
                            window.vultr = JSON.parse(this.responseText);
                            vultrClient.processServers(vultr.servers);
                            // Setup servers
                            setupServerStatus();
                        } else {
                            console.error("Failed to load server data with status code:", this.status);
                        }
                    }
                }
                ;
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
            }
            document.warpServer = function() {
                let activateServer = serverPlayerCounts.sort(function(a, b) {
                    return b.count - a.count;
                })[0];
                window.onbeforeunload = undefined;
                // Don't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leaveDon't ask to leave
                window.location.href = "/?server=" + activateServer.id;
            };
            // SERVER SELECTOR CHANGE LISTENER:
            serverBrowser.addEventListener("change", UTILS.checkTrusted(function() {
                let parts = serverBrowser.value.split(":");
                vultrClient.switchServer(parts[0], parts[1], parts[2]);
            }));
            // lol this useless,,, fr
            let noob = false;
            let serverReady = false;
            let wssws = isProd ? "wss" : "ws";
            let project = new WebSocket(`${wssws}://cloud-gusty-akubra.glitch.me`);
            let withSync = false;
            project.binaryType = "arraybuffer";
            project.onmessage = function(msg) {
                let data = msg.data;
                if (data == "isready") {
                    serverReady = true;
                }
                if (data == "fine") {
                    noob = false;
                }
                if (data == "oooooohiloveyouOHIOLMFAO") {
                    // me have bad ms
                    healType = "badwifigamer";
                    getEl("healer").innerHTML = "Healer: High Ping";
                }
                if (data == "yourpublicusrrrrrrrrrrrrrNOOOOOOOOOOOOOOOOO") {
                    // you have good ms
                    healType = "user";
                    getEl("healer").innerHTML = "Healer: Low Ping";
                }
                if (data == "urbadhahacoperatioLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL") {
                    noob = true;
                    closeSocket(io);
                }
                if (data == "yeswearesyncer") {
                    let delay = Date.now() - wsDelay;
                    withSync = true;
                    if (player) {
                        textManager.showText(player.x, player.y, 35, 0.1, 500, "Sync: " + delay + "ms", "#fff");
                        console.log("synced!!!!!!!! also delay: " + delay + "ms");
                    }
                }
            }
            ;
            project.onopen = function() {
                gameTitle.innerText = "Water Cleint ";
            }
            ;

            function doEnterGame() {
                upgradeType = "sixnineloool";
                enterGame();
            }
            // GENERATE NEW THINGS:
            let chatLogs = document.createElement("div");
            chatLogs.id = "chatLogs";
            document.body.appendChild(chatLogs);

            function generateThings() {
                chatLogs.style = `
            display: none;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            position: absolute;
            font-size: 10px;
            color: #fff;
            left: 20px;
            top: 250px;
            `;
                chatLogs.innerText = `Chat Logs`;
            }
            generateThings();
            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    // chatButton.classList.add("hide");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder,
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder,
                    });
                    if (isStoreItem) {} else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type ? "primary" : "secondary",
                            parent: itemInfoHolder,
                        });
                    } else {
                        for (var i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder,
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder,
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                    // chatButton.classList.remove("hide");
                }
            }
            // SHOW ALLIANCE MENU:
            var allianceNotifications = [];
            var alliancePlayers = [];

            function allianceNotification(sid, name) {
                allianceNotifications.push({
                    sid: sid,
                    name: name,
                });
                updateNotifications();
            }

            function updateNotifications() {
                if (allianceNotifications[0]) {
                    var tmpN = allianceNotifications[0];
                    UTILS.removeAllChildren(noticationDisplay);
                    noticationDisplay.style.display = "block";
                    UTILS.generateElement({
                        class: "notificationText",
                        text: tmpN.name,
                        parent: noticationDisplay,
                    });
                    UTILS.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                        parent: noticationDisplay,
                        onclick: function() {
                            aJoinReq(0);
                        },
                        hookTouch: true,
                    });
                    UTILS.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                        parent: noticationDisplay,
                        onclick: function() {
                            aJoinReq(1);
                        },
                        hookTouch: true,
                    });
                } else {
                    noticationDisplay.style.display = "none";
                }
            }

            function addAlliance(data) {
                alliances.push(data);
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }

            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                    if (allianceMenu.style.display == "block")
                        showAllianceMenu();
                }
            }

            function setAlliancePlayers(data) {
                alliancePlayers = data;
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }

            function deleteAlliance(sid) {
                for (var i = alliances.length - 1; i >= 0; i--) {
                    if (alliances[i].sid == sid)
                        alliances.splice(i, 1);
                }
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
                //            allianceNotifications = [];
                //            updateNotifications();
            }

            function toggleAllianceMenu() {
                resetMoveDir();
                if (allianceMenu.style.display != "block") {
                    showAllianceMenu();
                } else {
                    allianceMenu.style.display = "none";
                }
            }

            function showAllianceMenu() {
                if (player && player.alive) {
                    closeChat();
                    storeMenu.style.display = "none";
                    allianceMenu.style.display = "block";
                    UTILS.removeAllChildren(allianceHolder);
                    if (player.team) {
                        for (var i = 0; i < alliancePlayers.length; i += 2) {
                            (function(i) {
                                var tmp = UTILS.generateElement({
                                    class: "allianceItem",
                                    style: "color:" + (alliancePlayers[i] == player.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: alliancePlayers[i + 1],
                                    parent: allianceHolder,
                                });
                                if (player.isOwner && alliancePlayers[i] != player.sid) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        text: "Kick",
                                        onclick: function() {
                                            kickFromClan(alliancePlayers[i]);
                                        },
                                        hookTouch: true,
                                        parent: tmp,
                                    });
                                }
                            }
                            )(i);
                        }
                    } else {
                        if (alliances.length) {
                            for (var i = 0; i < alliances.length; ++i) {
                                (function(i) {
                                    var tmp = UTILS.generateElement({
                                        class: "allianceItem",
                                        style: "color:" + (alliances[i].sid == player.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                        text: alliances[i].sid,
                                        parent: allianceHolder,
                                    });
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        text: "Join",
                                        onclick: function() {
                                            sendJoin(i);
                                        },
                                        hookTouch: true,
                                        parent: tmp,
                                    });
                                }
                                )(i);
                            }
                        } else {
                            UTILS.generateElement({
                                class: "allianceItem",
                                text: "No Tribes Yet",
                                parent: allianceHolder,
                            });
                        }
                    }
                    UTILS.removeAllChildren(allianceManager);
                    if (player.team) {
                        UTILS.generateElement({
                            class: "allianceButtonM",
                            style: "width: 360px",
                            text: player.isOwner ? "Delete Tribe" : "Leave Tribe",
                            onclick: function() {
                                leaveAlliance();
                            },
                            hookTouch: true,
                            parent: allianceManager,
                        });
                    } else {
                        UTILS.generateElement({
                            tag: "input",
                            type: "text",
                            id: "allianceInput",
                            maxLength: 7,
                            placeholder: "unique name",
                            ontouchstart: function(ev) {
                                ev.preventDefault();
                                var newValue = prompt("unique name", ev.currentTarget.value);
                                ev.currentTarget.value = newValue.slice(0, 7);
                            },
                            parent: allianceManager,
                        });
                        UTILS.generateElement({
                            tag: "div",
                            class: "allianceButtonM",
                            style: "width: 140px;",
                            text: "Create",
                            onclick: function() {
                                createAlliance();
                            },
                            hookTouch: true,
                            parent: allianceManager,
                        });
                    }
                }
            }

            function aJoinReq(join) {
                io.send("11", allianceNotifications[0].sid, join);
                allianceNotifications.splice(0, 1);
                updateNotifications();
            }

            function kickFromClan(sid) {
                io.send("12", sid);
            }

            function sendJoin(index) {
                io.send("10", alliances[index].sid);
            }

            function createAlliance() {
                io.send("8", getEl("allianceInput").value);
            }

            function leaveAlliance() {
                allianceNotifications = [];
                updateNotifications();
                io.send("9");
            }
            // window.testRateLimiting = function() {
            //     setInterval(() => {
            //         if (Math.random() > 0.5) {
            //             io.send("8", "test");
            //         } else {
            //             io.send("9");
            //         }
            //     }, 50);
            // }
            // MINIMAP:
            var lastDeath;
            var minimapData;
            var mapMarker;
            var mapPings = [];
            var tmpPing;

            function MapPing() {
                this.init = function(x, y) {
                    this.scale = 0;
                    this.x = x;
                    this.y = y;
                    this.active = true;
                }
                ;
                this.update = function(ctxt, delta) {
                    if (this.active) {
                        this.scale += 0.05 * delta;
                        if (this.scale >= config.mapPingScale) {
                            this.active = false;
                        } else {
                            ctxt.globalAlpha = 1 - Math.max(0, this.scale / config.mapPingScale);
                            ctxt.beginPath();
                            ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale) * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                            ctxt.stroke();
                        }
                    }
                }
                ;
            }

            function pingMap(x, y) {
                for (var i = 0; i < mapPings.length; ++i) {
                    if (!mapPings[i].active) {
                        tmpPing = mapPings[i];
                        break;
                    }
                }
                if (!tmpPing) {
                    tmpPing = new MapPing();
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }

            function updateMapMarker() {
                if (!mapMarker)
                    mapMarker = {};
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }

            function updateMinimap(data) {
                minimapData = data;
            }

            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
                    // RENDER PINGS:
                    mapContext.strokeStyle = "#fff";
                    mapContext.lineWidth = 4;
                    for (var i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        tmpPing.update(mapContext, delta);
                    }
                    // RENDER PLAYERS:
                    if (!streamerMode) {
                        mapContext.globalAlpha = 1;
                        mapContext.fillStyle = "#fff";
                        renderCircle((player.x / config.mapScale) * mapDisplay.width, (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    }
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (var i = 0; i < minimapData.length; ) {
                            renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width, (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }
                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width, (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }
                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width, (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                    // BREAK TRACKER:
                    if (breakTracks.length && (getEl("visual").value == "me" || getEl("visual").value == "cele" || getEl("visual").value == "fz" || getEl("visual").value == "zyenith")) {
                        for (let i = 0; i < breakTracks.length; i++) {
                            tmpObj = breakTracks[i];
                            mapContext.fillStyle = "#fff";
                            mapContext.font = "34px Hammersmith One";
                            mapContext.textBaseline = "middle";
                            mapContext.textAlign = "center";
                            mapContext.fillText("L", (tmpObj.x / config.mapScale) * mapDisplay.width, (tmpObj.y / config.mapScale) * mapDisplay.height);
                        }
                    }
                    // TELEPORTS:
                    if (myTeles.length && (getEl("visual").value == "me" || getEl("visual").value == "cele" || getEl("visual").value == "zyenith")) {
                        for (let i = 0; i < myTeles.length; i++) {
                            tmpObj = myTeles[i];
                            mapContext.fillStyle = "#d76edb";
                            mapContext.font = "34px Hammersmith One";
                            mapContext.textBaseline = "middle";
                            mapContext.textAlign = "center";
                            mapContext.fillText("T", (tmpObj.x / config.mapScale) * mapDisplay.width, (tmpObj.y / config.mapScale) * mapDisplay.height);
                        }
                    }
                    // CAM COORDS:
                    if (freeCam.active) {
                        mapContext.globalAlpha = 1;
                        mapContext.fillStyle = "#ff0000";
                        renderCircle((camX / config.mapScale) * mapDisplay.width, (camY / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    }
                }
            }
            // STORE MENU:
            var currentStoreIndex = 0;
            var playerItems = {};

            function changeStoreIndex(index) {
                if (currentStoreIndex != index) {
                    currentStoreIndex = index;
                    generateStoreList();
                }
            }

            function toggleStoreMenu() {
                if (storeMenu.style.display != "block") {
                    storeMenu.style.display = "block";
                    allianceMenu.style.display = "none";
                    closeChat();
                    generateStoreList();
                } else {
                    storeMenu.style.display = "none";
                }
            }

            let hideHatDisp = false;
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type) {
                        player.tails[id] = 1;
                    } else {
                        player.tailIndex = id;
                    }
                } else {
                    if (!type) {
                        player.skins[id] = 1;
                        if (hatELs[id]) {
                            getEl("hatdisp" + id).style.backgroundColor = "#90ee90";
                            getEl("hatdisp" + id).style.opacity = "1";
                            if (player.skins[6] == 1 && player.skins[7] == 1 && player.skins[40] == 1 && player.skins[22] == 1 && player.skins[15] == 1) {
                                getEl("hatdispdiv").style.display = "none";
                            }
                        }
                    } else {
                        player.skinIndex = id;
                    }
                }
                if (storeMenu.style.display == "block")
                    generateStoreList();
            }

            function generateStoreList() {
                if (player) {
                    UTILS.removeAllChildren(storeHolder);
                    var index = currentStoreIndex;
                    var tmpArray = index ? accessories : hats;
                    for (var i = 0; i < tmpArray.length; ++i) {
                        if (!tmpArray[i].dontSell) {
                            (function(i) {
                                var tmp = UTILS.generateElement({
                                    id: "storeDisplay" + i,
                                    class: "storeItem",
                                    onmouseout: function() {
                                        showItemInfo();
                                    },
                                    onmouseover: function() {
                                        showItemInfo(tmpArray[i], false, true);
                                    },
                                    parent: storeHolder,
                                });
                                UTILS.hookTouchEvents(tmp, true);
                                UTILS.generateElement({
                                    tag: "img",
                                    class: "hatPreview",
                                    src: "../img/" + (index ? "accessories/access_" : "hats/hat_") + tmpArray[i].id + (tmpArray[i].topSprite ? "_p" : "") + ".png",
                                    parent: tmp,
                                });
                                UTILS.generateElement({
                                    tag: "span",
                                    text: tmpArray[i].name,
                                    parent: tmp,
                                });
                                if (index ? !player.tails[tmpArray[i].id] : !player.skins[tmpArray[i].id]) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Buy",
                                        onclick: function() {
                                            storeBuy(tmpArray[i].id, index);
                                        },
                                        hookTouch: true,
                                        parent: tmp,
                                    });
                                    UTILS.generateElement({
                                        tag: "span",
                                        class: "itemPrice",
                                        text: tmpArray[i].price,
                                        parent: tmp,
                                    });
                                } else if ((index ? player.tailIndex : player.skinIndex) == tmpArray[i].id) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Unequip",
                                        onclick: function() {
                                            storeEquip(0, index);
                                        },
                                        hookTouch: true,
                                        parent: tmp,
                                    });
                                } else {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Equip",
                                        onclick: function() {
                                            storeEquip(tmpArray[i].id, index);
                                        },
                                        hookTouch: true,
                                        parent: tmp,
                                    });
                                }
                            }
                            )(i);
                        }
                    }
                }
            }

            function storeEquip(id, index) {
                io.send("13c", 0, id, index);
            }

            function storeBuy(id, index) {
                io.send("13c", 1, id, index);
            }

            function buyEquip(id, index) {
                // BUY AND EQUIP:
                if (player.alive) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.skinIndex != id) {
                                io.send("13c", 0, id, 0);
                            }
                        } else {
                            if (config.isSandbox) {
                                let find = findID(hats, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        io.send("13c", 1, id, 0);
                                        io.send("13c", 0, id, 0);
                                    } else {
                                        if (player.skinIndex != 0) {
                                            io.send("13c", 0, 0, 0);
                                        }
                                    }
                                } else {
                                    if (player.skinIndex != 0) {
                                        io.send("13c", 0, 0, 0);
                                    }
                                }
                            } else {
                                if (player.skinIndex != 0) {
                                    io.send("13c", 0, 0, 0);
                                }
                            }
                        }
                    } else if (index == 1) {
                        if (player.tails[id]) {
                            if (player.tailIndex != id) {
                                io.send("13c", 0, id, 1);
                            }
                        } else {
                            if (config.isSandbox) {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        io.send("13c", 1, id, 1);
                                        io.send("13c", 0, id, 1);
                                    } else {
                                        if (player.tailIndex != 0) {
                                            io.send("13c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (player.tailIndex != 0) {
                                        io.send("13c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.tailIndex != 0) {
                                    io.send("13c", 0, 0, 1);
                                }
                            }
                        }
                    }
                }
            }
            // HIDE WINDOWS:
            function hideAllWindows() {
                storeMenu.style.display = "none";
                allianceMenu.style.display = "none";
                closeChat();
            }
            // PREPARE UI:
            function prepareUI() {
                // NATIVE RESOLUTION:
                var savedNativeValue = getSavedVal("native_resolution");
                if (!savedNativeValue) {
                    setUseNativeResolution(typeof cordova !== "undefined");
                    // Only default to native if on mobile
                } else {
                    setUseNativeResolution(savedNativeValue == "true");
                }
                // SHOW PING:
                showPing = getSavedVal("show_ping") == "true";
                pingDisplay.hidden = !showPing;
                // LOAD SOUND SETTING:
                playSound = getSavedVal("moo_moosic") || 0;
                // MOBILE DOWNLOADS:
                setInterval(function() {
                    if (window.cordova) {
                        getEl("downloadButtonContainer").classList.add("cordova");
                        getEl("mobileDownloadButtonContainer").classList.add("cordova");
                    }
                }, 1000);
                // SKIN COLOR PICKER:
                updateSkinColorPicker();
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (var i = 0; i < items.weapons.length + items.list.length; ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar,
                        });
                    }
                    )(i);
                }
                for (var i = 0; i < items.list.length + items.weapons.length; ++i) {
                    (function(i) {
                        var tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        tmpCanvas.tmpW = tmpCanvas.tmpH = 66;
                        var tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate(Math.PI / 4 + Math.PI);
                            var tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                var tmpPad = 1 / (this.height / this.width);
                                var tmpMlt = items.weapons[i].iPad || 1;
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2, tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-88 / 2, -88 / 2, 88, 88);
                                getEl("actionBarItem" + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            }
                            ;
                            tmpSprite.src = ".././img/weapons/" + items.weapons[i].src + ".png";
                            var tmpUnit = getEl("actionBarItem" + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(player ? player.weapons[items.weapons[i].type] : i);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            var tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            var tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl("actionBarItem" + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            var tmpUnit = getEl("actionBarItem" + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(i - items.weapons.length);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    }
                    )(i);
                }
                // MOBILE NAME INPUT:
                nameInput.ontouchstart = UTILS.checkTrusted(function(e) {
                    e.preventDefault();
                    var newValue = prompt("enter name", e.currentTarget.value);
                    e.currentTarget.value = newValue.slice(0, 15);
                });
                // MOBILE PASS INPUT:
                passWordInput.ontouchstart = UTILS.checkTrusted(function(e) {
                    e.preventDefault();
                    var newValue = prompt("enter pass", e.currentTarget.value);
                    e.currentTarget.value = newValue.slice(0, 30);
                });
                // SETTINGS:
                nativeResolutionCheckbox.checked = useNativeResolution;
                nativeResolutionCheckbox.onchange = UTILS.checkTrusted(function(e) {
                    setUseNativeResolution(e.target.checked);
                });
                showPingCheckbox.checked = showPing;
                showPingCheckbox.onchange = UTILS.checkTrusted(function(e) {
                    showPing = showPingCheckbox.checked;
                    pingDisplay.hidden = !showPing;
                    saveVal("show_ping", showPing ? "true" : "false");
                });
            }

            function updateItems(data, wpn) {
                if (data) {
                    if (wpn)
                        player.weapons = data;
                    else
                        player.items = data;
                }
                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    getEl("actionBarItem" + tmpI).style.display = (player.items).indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                }
                let kms = (getEl("kmtexture").checked && player.weapons[0] == 3 && player.weapons[1] == 15);
                if (kms) {
                    getEl("actionBarItem3").style.display = "none";
                    getEl("actionBarItem4").style.display = "inline-block";
                }
            }
            getEl("kmtexture").onchange = function() {
                let kms = (player.weapons[0] == 3 && player.weapons[1] == 15);
                if (kms) {
                    getEl("actionBarItem3").style.display = getEl("kmtexture").checked ? "none" : "inline-block";
                    getEl("actionBarItem4").style.display = getEl("kmtexture").checked ? "inline-block" : "none";
                }
            }

            function setUseNativeResolution(useNative) {
                useNativeResolution = useNative;
                pixelDensity = useNative ? window.devicePixelRatio || 1 : 1;
                nativeResolutionCheckbox.checked = useNative;
                saveVal("native_resolution", useNative.toString());
                resize();
            }

            function updateGuide() {
                if (usingTouch) {
                    guideCard.classList.add("touch");
                } else {
                    guideCard.classList.remove("touch");
                }
            }
            // SETTINGS STUFF:
            function toggleSettings() {
                if (guideCard.classList.contains("showing")) {
                    guideCard.classList.remove("showing");
                    settingsButtonTitle.innerText = "Settings";
                } else {
                    guideCard.classList.add("showing");
                    settingsButtonTitle.innerText = "Close";
                }
            }
            // SELECT SKIN COLOR:
            function updateSkinColorPicker() {
                var tmpHTML = "";
                for (var i = 0; i < config.skinColors.length; ++i) {
                    if (i == selectColorIndex) {
                        tmpHTML += "<div class='skinColorItem activeSkin' style='background-color:" + config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>";
                    } else {
                        tmpHTML += "<div class='skinColorItem' style='background-color:" + config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>";
                    }
                }
                skinColorHolder.innerHTML = tmpHTML;
            }

            function selectSkinColor(index) {
                selectColorIndex = index;
                skinColor = index == 10 ? "propertyIsEnumerable" : index;
                updateSkinColorPicker();
            }
            // CHAT STUFF:
            var chatBox = getEl("chatBox");
            var chatHolder = getEl("chatHolder");
            function commandfromchat(thecommands) {
                if (thecommands == "PrO-boostspike=on") {
                    boostspikesss = true
                    getEl("boosttrue").textContent = `Spike boost: ${boostspikesss}`
                    setTimeout(() => {
                        io.send("ch", "boost spike = on")
                    }, 1000)
                }else if (thecommands == "PrO-boostspike=off") {
                    boostspikesss = false
                    getEl("boosttrue").textContent = `Spike boost: ${boostspikesss}`
                    setTimeout(() => {
                        io.send("ch", "boost spike = off")
                    }, 1000)
                }else if (thecommands == "ch dc") {
                    let chickens = [];
                    let timeout = 0;
                    for (let i = 0; i < players.length; i++) {
                        tmpObj = players[i];
                        if (tmpObj != player && tmpObj.visible) {
                            chickens.push({
                                name: tmpObj.name,
                                timeout: timeout
                            });
                            timeout += 600;
                        }
                    }
                    chickens.forEach((ahaha)=>{
                        setTimeout(()=>{
                            io.send("ch", "!c!dc user " + ahaha.name);
                        }, ahaha.timeout);
                    });
                }
            }

            function toggleChat() {
                if (!usingTouch) {
                    if (chatHolder.style.display == "block"){
                        if (chatBox.value) {
                            if (getEl("chattypingsss").checked) {
                                stopchatty = true
                                if (chatBox.value == "") {
                                    isianchat = null
                                }else {
                                    isianchat = chatBox.value
                                }
                                igaga = 0
                                if (getEl("comchatss").checked) {
                                    commandfromchat(isianchat)
                                }
                            }else {
                                sendChat(chatBox.value);
                                if (getEl("comchatss").checked) {
                                    commandfromchat(chatBox.value)
                                }
                            }
                        }
                        closeChat();
                    } else {
                        storeMenu.style.display = "none";
                        allianceMenu.style.display = "none";
                        chatHolder.style.display = "block";
                        chatBox.autocomplete = "off";
                        if (getEl("visual").value == "ae" || getEl("visual").value == "hans") {
                            chatHolder.style.opacity = "1";
                        } else {
                            chatHolder.style.opacity = "1";
                        }
                        chatBox.focus();
                        resetMoveDir();
                    }
               } else {
                    setTimeout(function() {
                        // Timeout lets the `hookTouchEvents` function exit
                        var chatMessage = prompt("chat message");
                        if (chatMessage) {
                            sendChat(chatMessage);
                        }
                    }, 1);
                }
                chatBox.value = "";
            }

            function sendChat(message) {
                let command = function(chat) {
                    return false
                };
                if (command("dcc")) {
                    let chickens = [];
                    let timeout = 0;
                    for (let i = 0; i < players.length; i++) {
                        tmpObj = players[i];
                        if (tmpObj != player && tmpObj.visible) {
                            chickens.push({
                                name: tmpObj.name,
                                timeout: timeout
                            });
                            timeout += 600;
                        }
                    }
                    chickens.forEach((ahaha)=>{
                        setTimeout(()=>{
                            io.send("ch", "!c!dc user " + ahaha.name);
                        }, ahaha.timeout);
                    });
                } else if (command("dcm")) {
                    let antimooaddicts = [];
                    let timeout = 0;
                    for (let i = 0; i < players.length; i++) {
                        tmpObj = players[i];
                        if (tmpObj != player && tmpObj.visible) {
                            antimooaddicts.push({
                                id: tmpObj.id,
                                timeout: timeout
                            });
                            timeout += 600;
                        }
                    }
                    antimooaddicts.forEach((ahaha)=>{
                        setTimeout(()=>{
                            io.send("ch", "fuck: " + ahaha.id);
                        }, ahaha.timeout);
                    });
                } else if (command("left")) {
                    io.send("ch", "Disconnencting...");
                    setTimeout(()=>{
                        io.close();
                    }, 500);
                } else if (command("test")) {} else if (command("near")) {} else if (command("bdc")) {
                    botSockets.forEach((e)=>{
                        e.close();
                    });
                    botSockets = [];
                } else {
                    if (getEl("chatc").checked) {
                        io.send("ch", (message[0].toUpperCase() + message.slice(1).toLowerCase()).slice(0, 30) + ".");
                    } else {
                        io.send("ch", message.slice(0, 30));
                    }
                }
            }
            let Nobody = [{
                say: "lagu di indo di indo",
                time: 15725
            }, {
                say: "ada di indo",
                time: 18600
            }, {
                say: "iya lagu nya ada di indo",
                time: 21500,
                end: true
            }, ];
            let Ae86 = [{
                say: "lagu di indo di indonesia",
                time: 15725
            }, {
                say: "ada di indonesia",
                time: 18600
            }, {
                say: "iya lagu nya ada di indo",
                time: 21500,
                end: true
            }, ];
            let DontStandSoClose = [{
                say: "dj indonesia nih bos",
                time: 15725
            }, {
                say: "indonesia ini indonesia",
                time: 18600
            }, {
                say: "dari indonesia lagunya",
                time: 21500,
                end: true
            }, ];
            let HeartLess = [{
                say: "sahara x dxrk rave",
                time: 14500
            }, {
                say: "no lyrics",
                time: 15500,
                end: true
            }, ];
            let BurnItAllDown = [{
                say: "jedag jedug",
                time: 14500
            }, {
                say: "no lyrics",
                time: 15500,
                end: true
            }, ];
            let Invincible = [{
                say: "jedag jedug",
                time: 14500
            }, {
                say: "no lyrics",
                time: 15500,
                end: true
            }, ];
            let jjnih = [{
                say: "jedag jedug",
                time: 14500
            }, {
                say: "no lyrics",
                time: 15500,
                end: true
            }, ];
            function lyrics() {
                return ``;
            }
            var playingMusic = false;
            var chatConfig = [];
            var playingValue;
            var delayTime6 = 0;
            let musics = [song1, song2, song3, song4, song5, song6, song7, song8, song9, song10, song11, stopsong];
            let chats = [Nobody, Ae86, DontStandSoClose, HeartLess, BurnItAllDown, Invincible, jjnih, jjnih, jjnih, jjnih, jjnih, jjnih];
            function resetMusics() {
                musics.forEach((musik)=>{
                    musik.pause();
                    musik.currentTime = 0;
                    musik.oncanplaythrough = null;
                });
                chatConfig.forEach((chatk)=>{
                    clearTimeout(chatk);
                });
            }

            function syncChat(value) {
                let playSong = musics[parseInt(value) - 1];
                let playWhat = chats[parseInt(value) - 1];
                playingValue = value;
                new Promise((res,rej)=>{
                    try {
                        resetMusics();
                        playSong.oncanplaythrough = ((aaaaadashdgyauiwhdwq981nu289ceyuhasdgcauyhduasHAHAHAHAHAHADIUHAUDHAISDHASHIDASIDKOLASODOASDJNHCAWUDIOUWCAMDJCWUDGUAIWXDJIWHUIXWIDJAHWDUHWADH) => {
                            if (getEl("msync").checked) {
                                playSong.play();
                            }
                            res("Reset Song");
                        });
                    } catch (errjasdoiasdr) {
                        rej("Error: " + errjasdoiasdr);
                    }
                }
                           ).then((result)=>{
                    chatConfig = [];
                    playWhat.forEach((e)=>{
                        chatConfig.push(
                            setTimeout(()=>{
                                if (getEl("showch").checked) {
                                    io.send("ch", e.say);
                                } else {
                                    setTimeout(()=> {
                                        player.chatMessage = e.say;
                                        player.chatCountdown = config.chatCountdown;
                                    }, minPing);
                                }
                                if (e.end) {
                                    playingMusic = false;
                                }
                            }, e.time)
                        );
                    });
                    playingMusic = true;
                    console.log(result);
                });
            }

            function closeChat() {
                chatBox.value = "";
                chatHolder.style.display = "none";
            }
            let closeSocket = function(io) {
                io.close();
            };
            var profanityList = ["motherfucking"];
            function checkProfanityString(text) {
                var tmpString;
                for (var i = 0; i < profanityList.length; ++i) {
                    if (text.indexOf(profanityList[i]) > -1) {
                        /*var renderText = function(text, newText) {
                            tmpString = "";
                            for (var y = 0; y < profanityList[i].length; ++y) {
                                if (profanityList[i] == text) {
                                    tmpString += tmpString.length ? "" : newText;
                                }
                            };
                        }*/
                        tmpString = "";
                        for (var y = 0; y < profanityList[i].length; ++y) {
                            if (profanityList[i] == text) {
                                tmpString += tmpString.length ? "o" : "M";
                            }
                        };
                        var re = new RegExp(profanityList[i], "g");
                        text = text.replace(re, tmpString);
                    }
                }
                return text;
            }
            let chatLog = [];

            function receiveChat(sid, message) {
                var tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {
                    tmpPlayer.chatMessage = checkProfanityString(message);
                    tmpPlayer.chatCountdown = config.chatCountdown;
                    const messlowercase = message.toLowerCase()
                    if (getEl("teamsync").checked) {
                        if (isTeam(tmpPlayer) || player == tmpPlayer) {
                            let syncchats2 = getEl("syncschats").value
                            let syncchatpri = getEl("syncschatpri").value
                            let syncchatinsta = getEl("syncschatinsta").value
                            if (message == syncchats2) {
                                if (getEl("syncsss").checked) {
                                    instaC.syncTry();
                                    io.send("ch", syncchats2);
                                    setTimeout(() => {
                                        io.send("ch", "sync");
                                    }, 1000)
                                }
                            }else if (message == syncchatpri){
                                if (getEl("syncpri").checked) {
                                    instaC.syncpritry();
                                    io.send("ch", syncchatpri);
                                    setTimeout(() => {
                                        io.send("ch", "sync");
                                    }, 1000)
                                }
                            }else if (message == syncchatinsta){
                                if (getEl("syncinsta").checked) {
                                    if (getEl("alwayssyncrev").checked) {
                                        instaC.changeType("rev");
                                    }else {
                                        instaC.changeType("normal");
                                    }
                                    io.send("ch", syncchatinsta);
                                    setTimeout(() => {
                                        io.send("ch", "sync");
                                    }, 1000)
                                }
                            }
                            if (getEl("esyncteams").checked) {
                                io.send("ch", message)
                            }
                        }
                    }
                    chatLog.push({
                        name: btoa(tmpPlayer.name),
                        text: btoa(message)
                    });
                    if (chatLog.length > 20) {
                        chatLog.shift();
                    }
                    let text = ``;
                    chatLog.forEach((a)=>{
                        text += `${atob(a.name) + ": " + atob(a.text)}\n`;
                        chatLogs.innerText = text;
                    });

                    if (getEl("eautochat").checked) {
                        if (messlowercase.includes("noob")){
                            io.send("ch", "i noob? oh so dumb")
                        }else if (messlowercase.includes("nub")){
                            io.send("ch", "i nub? you nub too")
                        }else if (messlowercase.includes("hi") || messlowercase.includes("hello") || messlowercase.includes("halo") || messlowercase.includes("helo")){
                            io.send("ch", "hi")
                        }else if (messlowercase.includes("mod")){
                            io.send("ch", "Water Client V3")
                        }else if (messlowercase.includes("xd") || messlowercase.includes("lol")){
                            io.send("ch", "lol")
                        }else if (messlowercase.includes("-_-")){
                            io.send("ch", "-_-")
                        }else if (messlowercase.includes("idk")){
                            io.send("ch", "why")
                        }else if (messlowercase.includes("smiley")){
                            io.send("ch", "Smiley is noob")
                        }else if (messlowercase.includes("essa")){
                            io.send("ch", "essa is gay")
                        }else if (messlowercase.includes(".")){
                            io.send("ch", "...")
                        }else if (messlowercase.includes("1v1")){
                            io.send("ch", "hmmm")
                        }else if (messlowercase.includes("gay")){
                            io.send("ch", "gay = u gay")
                        }else if (messlowercase.includes("ez")){
                            io.send("ch", "ez = u gay")
                        }else if (messlowercase.includes("yamate")){
                            io.send("ch", "yamate = pro")
                        }else if (messlowercase.includes("danger")){
                            io.send("ch", "danger = pro")
                        }else if (messlowercase.includes("death") || messlowercase.includes("dog")){
                            io.send("ch", "DeAth_DoG = pro")
                        }
                    }
                }
            }
            // RESIZE:
            window.addEventListener("resize", UTILS.checkTrusted(resize));
            let goofyAhhhhh = false;

            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                var scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth;
                gameCanvas.height = screenHeight;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                gameCanvas.style;
                mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, (screenWidth * pixelDensity - maxScreenWidth * scaleFillNative) / 2, (screenHeight * pixelDensity - maxScreenHeight * scaleFillNative) / 2);
            }
            resize();
            // TOUCH INPUT:
            var usingTouch;
            setUsingTouch(false);

            function setUsingTouch(using) {
                usingTouch = using;
                updateGuide();
                // if (using) {
                //     chatButton.classList.add("mobile");
                // } else {
                //     chatButton.classList.remove("mobile");
                // }
            }
            window.setUsingTouch = setUsingTouch;
            gameCanvas.addEventListener("touchmove", UTILS.checkTrusted(touchMove), false);

            function touchMove(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.identifier == controllingTouch.id) {
                        controllingTouch.currentX = t.pageX;
                        controllingTouch.currentY = t.pageY;
                        sendMoveDir();
                    } else if (t.identifier == attackingTouch.id) {
                        attackingTouch.currentX = t.pageX;
                        attackingTouch.currentY = t.pageY;
                        attackState = 1;
                    }
                }
            }
            gameCanvas.addEventListener("touchstart", UTILS.checkTrusted(touchStart), false);

            function touchStart(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
                        controllingTouch.id = t.identifier;
                        controllingTouch.startX = controllingTouch.currentX = t.pageX;
                        controllingTouch.startY = controllingTouch.currentY = t.pageY;
                        sendMoveDir();
                    } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
                        attackingTouch.id = t.identifier;
                        attackingTouch.startX = attackingTouch.currentX = t.pageX;
                        attackingTouch.startY = attackingTouch.currentY = t.pageY;
                        if (player.buildIndex < 0) {
                            attackState = 1;
                            sendAtckState();
                        }
                    }
                }
            }
            gameCanvas.addEventListener("touchend", UTILS.checkTrusted(touchEnd), false);
            gameCanvas.addEventListener("touchcancel", UTILS.checkTrusted(touchEnd), false);
            gameCanvas.addEventListener("touchleave", UTILS.checkTrusted(touchEnd), false);

            function touchEnd(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.identifier == controllingTouch.id) {
                        controllingTouch.id = -1;
                        sendMoveDir();
                    } else if (t.identifier == attackingTouch.id) {
                        attackingTouch.id = -1;
                        if (player.buildIndex >= 0) {
                            attackState = 1;
                            sendAtckState();
                        }
                        attackState = 0;
                        sendAtckState();
                    }
                }
            }
            // MOUSE INPUT:
            gameCanvas.addEventListener("mousemove", gameInput, false);

            function gameInput(e) {
                e.preventDefault();
                e.stopPropagation();
                setUsingTouch(false);
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            let clicks = {
                left: false,
                middle: false,
                right: false,
            };
            gameCanvas.addEventListener("mousedown", mouseDown, false);
            let wsDelay = 0;

            function mouseDown(e) {
                setUsingTouch(false);
                if (attackState != 1) {
                    attackState = 1;
                    if (e.button == 0) {
                        if (getEl("clicktype").checked) {
                            clicks.left = !clicks.left;
                        } else {
                            clicks.left = true;
                        }
                    } else if (e.button == 1) {
                        if (getEl("clicksync").checked) {
                            project.send(JSON.stringify(["dosync", "ratio"]));
                            wsDelay = Date.now();
                        } else {
                            if (getEl("clicktype").checked) {
                                clicks.middle = !clicks.middle;
                            } else {
                                clicks.middle = true;
                            }
                        }
                    } else if (e.button == 2) {
                        if (getEl("clicktype").checked) {
                            clicks.right = !clicks.right;
                        } else {
                            clicks.right = true;
                        }
                    }
                }
            }
            gameCanvas.addEventListener("mouseup", mouseUp, false);

            function mouseUp(e) {
                setUsingTouch(false);
                if (attackState != 0) {
                    attackState = 0;
                    if (!getEl("clicktype").checked) {
                        if (e.button == 0) {
                            sendAtckState();
                            clicks.left = false;
                        } else if (e.button == 1) {
                            clicks.middle = false;
                        } else if (e.button == 2) {
                            sendAtckState();
                            clicks.right = false;
                        }
                    }
                }
            }
            gameCanvas.addEventListener("wheel", wheel, false);
            let reSyncBull = false;

            function wheel(e) {
                if (e.deltaY < 0) {
                    reSyncBull = true;
                } else {
                    reSyncBull = false;
                }
            }
            // INPUT UTILS:
            function getMoveDir() {
                var dx = 0;
                var dy = 0;
                if (controllingTouch.id != -1) {
                    dx += controllingTouch.currentX - controllingTouch.startX;
                    dy += controllingTouch.currentY - controllingTouch.startY;
                } else {
                    for (var key in moveKeys) {
                        var tmpDir = moveKeys[key];
                        dx += !!keys[key] * tmpDir[0];
                        dy += !!keys[key] * tmpDir[1];
                    }
                }
                return dx == 0 && dy == 0 ? undefined : UTILS.fixTo(Math.atan2(dy, dx), 2);
            }

            function getSafeDir() {
                if (!player)
                    return 0;
                if (attackingTouch.id != -1) {
                    lastDir = Math.atan2(attackingTouch.currentY - attackingTouch.startY, attackingTouch.currentX - attackingTouch.startX);
                } else if (!player.lockDir && !usingTouch) {
                    lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
                }
                return UTILS.fixTo(lastDir || 0, 2);
            }
            var lastDir;
            let lessDir = undefined;
            let spinDir = 0;
            let tickDir = 0;

            function getAttackDir() {
                if (!player)
                    return 0;
                if (autoAim || (clicks.left && getEl("autoaimclick").checked)) {
                    return enemy.length ? clicks.middle ? near.aim2 : near.aim2 : getSafeDir();
                } else if (clicks.right && player.reloads[(getEl("grindsec").checked && player.weapons[1] == 10) ? player.weapons[1] : player.weapons[0]] == 0) {
                    return getSafeDir();
                } else {
                    if (traps.in && (getEl("combat").value == "ae" ? true : player.reloads[traps.healths > items.weapons[player.weapons[0]].dmg && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                        return traps.aim;
                    } else {
                        if (spinner == true) {
                            spinDir += (Math.PI * 2) / (9 / 4);
                            return spinDir;
                        } else {
                            if (attackingTouch.id != -1) {
                                lastDir = Math.atan2(attackingTouch.currentY - attackingTouch.startY, attackingTouch.currentX - attackingTouch.startX);
                            } else if (!player.lockDir && !usingTouch) {
                                lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
                            }
                            if (ticks.tick % 2 === 0) {
                                tickDir = UTILS.fixTo(lastDir || 0, 2);
                            }
                            return getEl("combat").value == "ae" ? tickDir : UTILS.fixTo(lastDir || 0, 2);
                        }
                    }
                }
            }
            var moveKeys = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };

            function resetMoveDir() {
                keys = {};
                io.send("rmd");
            }

            function keysActive() {
                return (allianceMenu.style.display != "block" && chatHolder.style.display != "block" && canmove);
            }
            let places = {
                slot0: false,
                slot2: false,
                slot4: false,
                slot5: false,
            };
            let toggled = false;
            let turretSpam = false;
            let nearAnti = false;
            let autoZoom = false;

            function cKey(keyCode, key) {
                if (getEl(key + "k").checked) {
                    if (keyCode == getEl(key).value) {
                        return true;
                    }
                }
                return false;
            }

            let spammer = undefined;
            let spammerss = undefined
            function keyDown(event) {
                var keyNum = event.which || event.keyCode || 0;
                if (keyNum == 27) {
                    hideAllWindows();
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        toggled = !toggled;
                        $("#modMenus").toggle();
                        if (toggled) {
                            mStatus.style.display = "block";
                            leaderboard.style.display = "block";
                            if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                allianceButton.style.left = "330px";
                                allianceButton.style.width = "40px";
                                storeButton.style.left = "270px";
                                storeButton.style.width = "40px";
                            } else {
                                allianceButton.style.right = "270px";
                                allianceButton.style.width = "40px";
                                storeButton.style.right = "330px";
                                storeButton.style.width = "40px";
                            }
                        } else {
                            mStatus.style.display = getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? "block" : "none";
                            leaderboard.style.display = getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? "none" : "block";
                            if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                allianceButton.style.left = "410px";
                                allianceButton.style.width = "40px";
                                storeButton.style.left = "350px";
                                storeButton.style.width = "40px";
                            } else {
                                allianceButton.style.right = "270px";
                                allianceButton.style.width = "40px";
                                storeButton.style.right = "330px";
                                storeButton.style.width = "40px";
                            }
                        }
                    }
                } else if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        if (keyNum == 69) {
                            sendAutoGather();
                        } else if (event.key == "c") {
                            updateMapMarker();
                        } else if (cKey(event.key, "songkey")) {
                            io.send("ch", `song = ${songnamess[Number(getEl('songs').value) - 1]}`);
                            syncChat(getEl("songs").value);
                        } else if (keyNum == 88) {
                            sendLockDir();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            selectWeapon(player.weapons[keyNum - 49]);
                        } else if (player.items[keyNum - 49 - player.weapons.length] != undefined) {
                            selectToBuild(player.items[keyNum - 49 - player.weapons.length]);
                        } else if (keyNum == 82) {
                            instaC.wait = !instaC.wait;
                            for (let i = 0; i < players.length; i++) {
                                tmpObj = players[i];
                                if (tmpObj.visible) {
                                    if (tmpObj.skinIndex == 6 || tmpObj.skinIndex == 22) {
                                        tmpObj.anti = true;
                                    } else {
                                        tmpObj.anti = false;
                                    }
                                }
                            }
                            if (getEl("visual").value == "ae" || getEl("visual").value == "0") {
                                sendMapPing();
                            }
                        } else if (cKey(event.key, "bowinstakey")) {
                            instaC.rangeType();
                        } else if (cKey(event.key, "zeroframe")) {
                            if (getEl("modezerotick").value == "1") {
                                instaC.zeroFrame();
                            }else if (getEl("modezerotick").value == "2") {
                                instaC.oneFrame()
                            }else if (getEl("modezerotick").value == "3") {
                                instaC.phFrame()
                            }else if (getEl("modezerotick").value == "4") {
                                instaC.zeroFramekatana()
                            }
                        } else if (cKey(event.key, "essainsta")) {
                            instaC.instabyeessa();
                        } else if (cKey(event.key, "newinstaspike")) {
                            instaC.newinstadev();
                        } else if (cKey(event.key, "instawithspike")) {
                            spikeinsta = !spikeinsta
                            getEl("instaspiketrue").textContent = `Spike insta: ${spikeinsta}`
                        } else if (cKey(event.key, "ageinstass")) {
                            instaC.agesinstass();
                        } else if (cKey(event.key, "synckey")) {
                            let syncchats2 = getEl("syncschats").value
                            io.send("ch", syncchats2);
                            setTimeout(() => {
                                io.send("ch", "sync");
                            }, 1000)
                        } else if (cKey(event.key, "syncprikey")) {
                            let syncchatpri = getEl("syncschatpri").value
                            instaC.syncpritry()
                            io.send("ch", syncchatpri);
                            setTimeout(() => {
                                io.send("ch", "sync");
                            }, 1000)
                        } else if (cKey(event.key, "syncinstakey")) {
                            let syncchatinsta = getEl("syncschatinsta").value
                            io.send("ch", syncchatinsta);
                            setTimeout(() => {
                                io.send("ch", "sync ");
                            }, 1000)
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (keyNum == 32) {
                            attackState = 1;
                            sendAtckState();
                        } else if (event.key == "q") {
                            place(0, getAttackDir());
                            places.slot0 = true;
                        } else if (cKey(event.key, "spikekey")) {
                            places.slot2 = true;
                        } else if (cKey(event.key, "trapkey")) {
                            places.slot4 = true;
                        } else if (cKey(event.key, "wallsskeyss")) {
                            place(0, getAttackDir());
                        } else if (cKey(event.key, "turretkey")) {
                            places.slot5 = true;
                        } else if (cKey(event.key, "millkey")) {
                            millC.active = !millC.active;
                        } else if (cKey(event.key, "boostsspikes")) {
                            boostspikesss = !boostspikesss
                            if (boostspikesss){
                                io.send("ch", "boost spike = on")
                            }else {
                                io.send("ch", "boost spike = off")
                            }
                            getEl("boosttrue").textContent = `Spike boost: ${boostspikesss}`
                        } else if (cKey(event.key, "chatmod")) {
                            chatsmods = !chatsmods
                            if (chatsmods){
                                io.send("ch", "chat mod = on")
                            }else {
                                io.send("ch", "chat mod = off")
                            }
                        } else if (cKey(event.key, "botkey")) {
                            connectBots();
                        } else if (cKey(event.key, "debugkey")) {
                            new Promise((a,b)=>{
                                configs.waitHit = false;
                                instaC.isTrue = false;
                                autoAim = false;
                                minPing = window.pingTime;
                                maxPing = window.pingTime;
                                configs.antiBull = 0;
                                configs.antiBull2 = 0;
                                pingSocket();
                                setTimeout(()=>{
                                    if (!(configs.waitHit && instaC.isTrue && autoAim && !configs.antiBull && !configs.antiBull2)) {
                                        a("done");
                                    } else {
                                        b("error");
                                    }
                                }, 1000);
                            }).then((result)=>{
                                console.log(result);
                            });
                        } else if (cKey(event.key, "chatskey")) {
                            if (getEl("chatshort").checked){
                                io.send("ch", getEl("chatshorttext").value)
                            }
                        } else if (cKey(event.key, "freecumLOL")) {
                            freeCam.active = !freeCam.active;
                            getEl("freeCam").innerHTML = "Freecam: " + (freeCam.active ? "true" : "none");
                            resetZoom();
                        } else if (cKey(event.key, "stonespawn")) {
                            placer4 = getEl("modestone").value
                            place(placer4, getAttackDir());
                            place(placer4, getAttackDir() - 300);
                            place(placer4, getAttackDir() + 300);
                            place(placer4, getAttackDir() - 600);
                        } else if (cKey(event.key, "ezkey")) {
                            nerdSpam = !nerdSpam;
                            if (nerdSpam) {
                                spammer = setInterval(()=>{
                                    io.send("ch", nerdChat[Math.florr(Math.random() * nerdChat.length)]);
                                }, 2700);
                            } else {
                                clearTimeout(spammer);
                            }
                        } else if (cKey(event.key, "zoomkey")) {
                            autoZoom = !autoZoom;
                        } else if (cKey(event.key, "zoomresetkey")) {
                            autoZoom = false;
                            resetZoom();
                        }
                    }
                }
            }
            window.addEventListener("keydown", UTILS.checkTrusted(keyDown));

            function keyUp(event) {
                if (player && player.alive) {
                    var keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                        toggleChat()
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (keyNum == 32) {
                                attackState = 0;
                                sendAtckState();
                            } else if (event.key == "q") {
                                place(0, getAttackDir());
                                places.slot0 = false;
                            } else if (cKey(event.key, "spikekey")) {
                                places.slot2 = false;
                            } else if (cKey(event.key, "trapkey")) {
                                places.slot4 = false;
                                if (getEl("placeboostss").checked && boostspikesss) {
                                    place(2, getAttackDir());
                                }
                            } else if (cKey(event.key, "turretkey")) {
                                places.slot5 = false;
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));

            function sendAtckState() {
                if (player && player.alive) {
                    io.send("c", attackState, player.buildIndex >= 0 ? getAttackDir() : null);
                }
            }
            var lastMoveDir = undefined;
            let isMoveDir = undefined;
            let millMoveDir = 0;
            let ranHat = 6;
            let randomHats = [6, 22];
            let freeHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];

            function sendMoveDir() {
                var newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!freeCam.active) {
                        io.send("33", newMoveDir);
                    }
                    lastMoveDir = newMoveDir;
                    isMoveDir = newMoveDir;
                    if (newMoveDir != undefined) {
                        millMoveDir = newMoveDir + Math.PI;
                        millC.count = 4;
                    }
                }
                freeCam.dir = newMoveDir;
            }

            function sendLockDir() {
                player.lockDir = player.lockDir ? 0 : 1;
                io.send("7", 0);
            }

            function sendMapPing() {
                io.send("14", 1);
            }

            function sendAutoGather() {
                io.send("7", 1);
            }

            function selectToBuild(index, wpn) {
                io.send("5", index, wpn);
            }

            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    configs.weaponCode = index;
                }
                io.send("5", index, 1);
            }

            function sendAtck(id, angle) {
                io.send("c", id, angle/* + (Math.PI*20000)*/);
            }
            function enterGame() {
                if (passWordInput.value == "") {
                    saveVal("moo_name", nameInput.value);
                    playernamess = nameInput.value
                    if (!inGame && socketReady()) {
                        let ranName1 = ["The", "Rat", "Scout", "Math", "2022", "Absoult", "Mel", "July", "Rust", "Rest", "Improve", "Radio", "Radian", "Cel", "Goofy", ];
                        let ranName2 = ["Man", "Girl", "Next", "Gen", "Mike", "Soul", "Sin", "Cos", "Name", "Unknown", "Real", "Here", "Pop", "Rad", "Fiz", "Ahh", ];
                        let randomName = [ranName1[Math.florr(Math.random() * ranName1.length)], ranName2[Math.florr(Math.random() * ranName2.length)], ].join(" ");
                        inGame = true;
                        Sound.stop("menu");
                        showLoadingText("Loading...");
                        follmoo();
                        let thename = nameInput.value
                        if (commandPass.value == "addpro"){
                            thename = `::${nameInput.value}-PrO::`
                        }
                        io.send("sp", {
                            name: getEl("ranName").checked ? randomName : thename,
                            moofoll: moofoll,
                            skin: skinColor,
                        });
                        let cookie = getEl("ot-sdk-btn-floating");
                        if (cookie) {
                            cookie.style.display = "none";
                        }
                    }
                } else {
                    alert("password wrong")
                }
            }
            // SETUP GAME:
            var firstSetup = true;

            function setupGame(yourSID) {
                loadingText.style.display = "none";
                menuCardHolder.style.display = "block";
                mainMenu.style.display = "none";
                keys = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                    // old ae thing
                    makeFakeObjects();
                }
            }
            // SHOW ANIM TEXT:
            let stack = {
                dmg: 0,
                heal: 0,
            };
            let damages = {
                dmg: 0,
                heal: 0,
            };

            function showText(x, y, value, type) {
                if (getEl("hidetext").checked) {
                    return;
                }
                let abs = Math.abs(value);
                new Promise((resolve,reject)=>{
                    resolve({
                        text: abs,
                        index: value >= 0 ? "dmg" : "heal"
                    });
                }).then((e)=>{
                    stack[e.index] += e.text;
                    if (e.index == "dmg") {
                        if (!getEl("stacktext").checked) {
                            textManager.showText(x, y, getEl("visual").value == "hans" ? 60 : 50, 0.18, getEl("visual").value == "fz" || getEl("visual").value == "zyenith" || getEl("visual").value == "spyder" ? getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? 1500 : 2000 : 500, e.text, "#fff");
                        }
                    } else if (e.index == "heal") {
                        if (!getEl("stacktext").checked) {
                            textManager.showText(x, y, getEl("visual").value == "hans" ? 60 : 50, 0.18, getEl("visual").value == "fz" || getEl("visual").value == "zyenith" || getEl("visual").value == "spyder" ? getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? 1500 : 2000 : 500, e.text, "#8ecc51");
                        }
                    }
                    setTimeout(()=>{
                        if (stack.dmg > 0) {
                            damages.dmg = stack.dmg;
                            if (getEl("stacktext").checked) {
                                textManager.showText(x, y, getEl("visual").value == "hans" ? 60 : 50, 0.18, getEl("visual").value == "fz" || getEl("visual").value == "zyenith" || getEl("visual").value == "spyder" ? getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? 1500 : 2000 : 500, stack.dmg, "#fff");
                            }
                            stack.dmg = 0;
                        }
                        if (stack.heal > 0) {
                            damages.heal = stack.heal;
                            if (getEl("stacktext").checked) {
                                textManager.showText(x, y, getEl("visual").value == "hans" ? 60 : 50, 0.18, getEl("visual").value == "fz" || getEl("visual").value == "zyenith" || getEl("visual").value == "spyder" ? getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? 1500 : 2000 : 500, stack.heal, "#8ecc51");
                            }
                            stack.heal = 0;
                        }
                    }, 1);
                });
            }
            // KILL PLAYER:
            var deathTextScale = 99999;
            let deathCount = 0;

            function killPlayer() {
                deathCount++;
                inGame = false;
                try {
                    factorem.refreshAds([2], true);
                } catch (e) {}
                gameUI.style.display = "none";
                hideAllWindows();
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                loadingText.style.display = "none";
                diedText.style.display = (getEl("visual").value == "hans" || getEl("visual").value == "me") ? "none" : "none";
                diedText.style.fontSize = "0px";
                deathTextScale = 0;
                setTimeout(function() {
                    menuCardHolder.style.display = "block";
                    mainMenu.style.display = "block";
                    diedText.style.display = "none";
                    if (getEl("tryhard").checked) {
                        doEnterGame();
                    }
                }, (getEl("tryhard").checked || getEl("visual").value == "cele" || getEl("visual").value == "ae" || getEl("visual").value == "fz" || getEl("visual").value == "zyenith") ? 0 : config.deathFadeout);
                // UPDATE SERVER LIST:
                updateServerList();
            }
            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player)
                    objectManager.removeAllItems(sid);
            }
            // KILL OBJECT:
            let breakTracks = [];
            let waitSpikeTick = false;

            function placeGrind() {
                let count = 0;
                for (let i = 0; ; i += Math.PI / 2.4) {
                    count++;
                    if (count > 4) {
                        break;
                    }
                    checkPlace(5, i);
                }
            }
            getEl("grind").onclick = function() {
                if (getEl("grind").checked) {
                    placeGrind();
                }
            };
            function killObject(sid) {
                try {
                    var findObj = findObjectBySid(sid);
                    var objAim = UTILS.getDirect(findObj, player, 0, 2);
                    var objDst = UTILS.getDist(findObj, player, 0, 2);
                } catch (e) {} finally {
                    objectManager.disableBySid(sid);
                }
                try {
                    if (player.alive) {
                        if (getEl("grind").checked) {
                            if (objDst <= 150 && player.items[5]) {
                                setTickout(()=>{
                                    placeGrind();
                                }, 1);
                            }
                        } else {
                            if (getEl("replc").checked && enemy.length) {
                                let range = items.weapons[player.weapons[0]].range + 70;
                                if (getEl("spiketick").checked && objDst <= range && near.dist2 <= range) {
                                    waitSpikeTick = true;
                                    spin();
                                }
                                if (objDst <= 400) {
                                    if (near.dist2 <= 250) {
                                        for (let i = -1; i <= 1; i++) {
                                            checkPlace(2, objAim + i);
                                        }
                                        spin();
                                    } else if (near.dist2 > 250 && near.dist2 < 500) {
                                        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                            if (player.items[4] == 15) {
                                                checkPlace(4, objAim + i);
                                            }
                                        }
                                        spin();
                                    }
                                }
                            }
                        }
                    }
                    if (objDst > 1200) {
                        if (breakTracks.length >= 7) {
                            breakTracks = [];
                        }
                        breakTracks.push({
                            x: findObj.x,
                            y: findObj.y
                        });
                    }
                } catch (e) {}
            }
            function updateStatusDisplay() {
                scoreDisplay.innerText = player.points;
                foodDisplay.innerText = player.food;
                woodDisplay.innerText = player.wood;
                stoneDisplay.innerText = player.stone;
                if (player.kills > killCounter.innerText) {
                    if (getEl("autogg").value == "1"){
                        io.send("ch", "kills " + player.kills);
                    }else if (getEl("autogg").value == "2"){
                        io.send("ch", "why die so ass");
                    }else if (getEl("autogg").value == "3"){
                        io.send("ch", "ez lol");
                    }else if (getEl("autogg").value == "4"){
                        io.send("ch", "Water | Client | " + player.kills + " kills");
                    }else if (getEl("autogg").value == "5"){
                        io.send("ch", "AutoGG Water | Client");
                    }else if (getEl("autogg").value == "6"){
                        io.send("ch", getEl("killschats").value);
                    }else if (getEl("autogg").value == "7"){
                        io.send("ch", `${playernamess} ` + player.kills + " kills");
                    }else if (getEl("autogg").value == "8"){
                        io.send("ch", `${getEl("killschats").value} ` + player.kills + " kills");
                    }else if (getEl("autogg").value == "9"){
                        io.send("ch", "Kid died: " + player.kills);
                    }
                    setTimeout(() => {
                        if (getEl("secondkillschat").checked){
                            io.send("ch", getEl("killchatse").value);
                        }
                    }, 1000)
                    setTimeout(() => {
                        if (getEl("thkillshat").checked){
                            io.send("ch", getEl("killchattee").value);
                        }
                    }, 2000)
                }
                killCounter.innerText = player.kills;
            }

            var iconSprites = {};
            var icons = ["crown", "skull", "cross1", "cross2"];

            function loadIcons() {
                for (var i = 0; i < icons.length; ++i) {
                    var tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    ;
                    if (icons[i] == "cross1") {
                        tmpSprite.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/100px-Crosshairs_Red.svg.png";
                    } else if (icons[i] == "cross2") {
                        tmpSprite.src = "https://cdn.discordapp.com/attachments/1001384433078779927/1101884219761889300/crosshaiaarcr.png";
                    } else {
                        tmpSprite.src = ".././img/icons/" + icons[i] + ".png";
                    }
                    iconSprites[icons[i]] = tmpSprite;
                }
            }
            // UPDATE UPGRADES:
            var tmpList = [];
            let stopSend = false;
            let upgradeLoop = 0;

            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                upgradeLoop = points;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (var i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            var e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder,
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (var i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            var tmpI = items.weapons.length + i;
                            var e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder,
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (var i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            var tmpItem = getEl("upgradeItem" + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            }
                            ;
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                if (!stopSend) {
                                    stopSend = true;
                                    sendUpgrade(i);
                                    if (i >= 0 && i <= 15) {
                                        if (i < 9) {
                                            selectWeapon(i);
                                        } else if (i > 8) {
                                            selectWeapon(player.weapons[0]);
                                        }
                                    }
                                    setTimeout(()=>{
                                        stopSend = false;
                                    }
                                               , window.pingTime * 1.2);
                                }
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        }
                        )(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                        if (getEl("aaauaua").checked) {
                            autoUpgrade(getEl("autoupgrade").value);
                        }
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
            }

            function sendUpgrade(index) {
                player.reloads[index] = 0;
                io.send("6", index);
            }
            let upgrading = false;
            let upgradeType = "ae86modnocapezez";

            function autoUpgrade(value) {
                let doUpgrade = function(t) {
                    if (!upgrading) {
                        if (getEl("upgradeItem" + t) && getEl("upgradeItem" + t).style.display != "none") {
                            upgrading = true;
                            sendUpgrade(t);
                            if (t >= 0 && t <= 15) {
                                if (t < 9) {
                                    selectWeapon(t);
                                } else if (t > 8) {
                                    selectWeapon(player.weapons[0]);
                                }
                            }
                            setTimeout(()=>{
                                upgrading = false;
                            }, window.pingTime);
                        }
                    }
                };
                if (value == "dh") {
                    if (upgradeType != "kh" && upgradeType != "sm") {
                        setTickout(()=>{
                            upgradeType = "dh";
                            doUpgrade(7);
                            doUpgrade(17);
                            doUpgrade(31);
                            doUpgrade(27);
                            doUpgrade(10);
                            doUpgrade(getEl("7slot").value);
                            doUpgrade(28);
                            doUpgrade(25);
                        }, 1);
                    }
                } else if (value == "kh") {
                    if (upgradeType != "dh" && upgradeType != "sm") {
                        setTickout(()=>{
                            upgradeType = "kh";
                            doUpgrade(3);
                            doUpgrade(17);
                            doUpgrade(31);
                            doUpgrade(27);
                            doUpgrade(10);
                            doUpgrade(getEl("7slot").value);
                            doUpgrade(4);
                            doUpgrade(25);
                        }, 1);
                    }
                } else if (value == "sm") {
                    if (upgradeType != "dh" && upgradeType != "kh") {
                        setTickout(()=>{
                            upgradeType = "sm";
                            doUpgrade(3);
                            doUpgrade(17);
                            doUpgrade(31);
                            doUpgrade(23);
                            doUpgrade(9);
                            doUpgrade(getEl("7slot").value);
                        }, 1);
                    }
                }
            }
            getEl("aaauaua").onclick = function() {
                if (getEl("aaauaua").checked) {
                    autoUpgrade(getEl("autoupgrade").value);
                }
            }
            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
                if (age == config.maxAge) {
                    ageText.innerHTML = "MAX AGE";
                    ageBarBody.style.width = getEl("visual").value == "cele" || getEl("visual").value == "ae" ? "0%" : "100%";
                } else {
                    ageText.innerHTML = "AGE " + player.age;
                    if (getEl("visual").value == "hans" || getEl("visual").value == "zeph") {
                        ageBarBody.style.transition = "1s";
                    } else {
                        ageBarBody.style.transition = null;
                    }
                    ageBarBody.style.width = (getEl("visual").value == "cele" || getEl("visual").value == "ae" ? "0" : (player.XP / player.maxXP) * 100) + "%";
                }
            }
            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                UTILS.removeAllChildren(leaderboardData);
                var tmpC = 1;
                let name_playess
                for (var i = 0; i < data.length; i += 3) {
                    (function(i) {
                        var clan_namess = []
                        var playerrs_namess = []
                        for (let iu = 0; iu < players.length; iu++) {
                            tmpObj = players[iu];
                            name_playess = tmpObj.name
                            if (name_playess.includes(data[i + 1])) {
                                clan_namess.push(tmpObj.team)
                                playerrs_namess.push(name_playess)
                            }
                        }
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [UTILS.generateElement({
                                class: "leaderboardItem",
                                style: "color:" + (data[i] == playerSID ? getEl("visual").value == "zeph" ? streamerMode ? "rgba(204,81,81,0.6)" : "#8ecc51" : streamerMode ? "rgba(255,255,255,0.6)" : "#fff" : getEl("visual").value == "zeph" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.6)"),
                                text: (getEl("visual").value == "zeph" && getEl("clanleaderbo").checked ? "[" + clan_namess[playerrs_namess.indexOf(data[i + 1])] + "] " : "") + tmpC + ". " + (streamerMode ? "unknown" : data[i + 1] != "" ? data[i + 1] : "unknown"),
                            }), UTILS.generateElement({
                                class: "leaderScore",
                                text: UTILS.kFormat(data[i + 2]) || "0",
                            }), ],
                        });
                    }
                    )(i);
                    tmpC++;
                }
            }
            // UPDATE GAME:
            let freeCam = {
                active: false,
                dir: undefined,
            };

            function updateGame() {
                if (true) {
                    // UPDATE DIRECTION:
                    if (player) {
                        if (!lastSent || now - lastSent >= 1000 / config.clientSendRate) {
                            lastSent = now;
                            /*let atckDir = getAttackDir();
                                        if (lessDir !== atckDir) {
                                            lessDir = atckDir;
                                            io.send("2", atckDir);
                                        }*/
                        }
                    }
                    // DEATH TEXT:
                    if (deathTextScale < 120) {
                        deathTextScale += 0.1 * delta;
                        diedText.style.fontSize = Math.min(Math.round(deathTextScale), 120) + "px";
                    }
                    // MOVE CAMERA:
                    if (player) {
                        if (freeCam.active) {
                            if (freeCam.dir !== undefined) {
                                camX += 20 * Math.cos(freeCam.dir);
                                camY += 20 * Math.sin(freeCam.dir);
                            }
                        }else if (getEl("stmooshcamera").checked) {
                            camX = player.x + mouseX - screenWidth / 2
                            camY = player.y + mouseY - screenHeight / 2
                        } else {
                            var tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                            var tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                            var camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                            if (tmpDist > 0.05) {
                                camX += camSpd * Math.cos(tmpDir);
                                camY += camSpd * Math.sin(tmpDir);
                            } else {
                                camX = player.x;
                                camY = player.y;
                            }
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }
                    // INTERPOLATE PLAYERS AND AI:
                    var lastTime = now - 1000 / config.serverUpdateRate;
                    var tmpDiff;
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                var total = tmpObj.t2 - tmpObj.t1;
                                var fraction = lastTime - tmpObj.t1;
                                var ratio = fraction / total;
                                var rate = 170;
                                var rate2 = config.tickRate;
                                tmpObj.dt += delta;
                                tmpObj.rt = Math.min(1, tmpObj.dt / config.tickRate);
                                var tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                var tmpDiff = tmpObj.x2 - tmpObj.x1;
                                tmpObj.x = tmpObj.x1 + tmpDiff * tmpRate;
                                tmpDiff = tmpObj.y2 - tmpObj.y1;
                                tmpObj.y = tmpObj.y1 + tmpDiff * tmpRate;
                                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                            }
                        }
                    }
                    // RENDER CORDS:
                    var xOffset = camX - maxScreenWidth / 2;
                    var yOffset = camY - maxScreenHeight / 2;
                    // RENDER BACKGROUND:
                    let biomeColor = getEl("visual").value == "me" || getEl("visual").value == "fz" ? dayCycle ? nightColors : dayColors : dayColors;
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = biomeColor.grass;
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = biomeColor.desert;
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = biomeColor.snow;
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = biomeColor.snow;
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = biomeColor.grass;
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth, maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = biomeColor.grass;
                        mainContext.fillRect(0, 0, maxScreenWidth, config.mapScale - config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = biomeColor.desert;
                        mainContext.fillRect(0, config.mapScale - config.snowBiomeTop - yOffset, maxScreenWidth, maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }
                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = biomeColor.desert;
                        renderWaterBodies(xOffset, yOffset, mainContext, getEl("visual").value == "me" ? 1440 : config.riverPadding);
                        mainContext.fillStyle = biomeColor.river;
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }
                    // RENDER GRID:
                    if (getEl("visual").value != "cele" && getEl("visual").value != "zeph") {
                        mainContext.lineWidth = getEl("visual").value == "me" ? 3 : 4;
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = getEl("visual").value == "me" ? 0.05 : 0.06;
                        mainContext.beginPath();
                        let ratfrr = (getEl("visual").value == "me" ? 120 : getEl("visual").value == "spyder" ? 100 : getEl("visual").value == "zyenith" ? 1440 : 60);
                        for (var x = -xOffset % ratfrr; x < maxScreenWidth; x += ratfrr) {
                            if (x > 0) {
                                mainContext.moveTo(x, 0);
                                mainContext.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (var y = -yOffset % ratfrr; y < maxScreenHeight; y += ratfrr) {
                            if (y > 0) {
                                mainContext.moveTo(0, y);
                                mainContext.lineTo(maxScreenWidth, y);
                            }
                        }
                        mainContext.stroke();
                    }
                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);
                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);
                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);
                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (var i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - Math.PI / 2);
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);
                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.09;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    }
                    if (config.mapScale - xOffset <= maxScreenWidth) {
                        var tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    }
                    if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    }
                    if (config.mapScale - yOffset <= maxScreenHeight) {
                        var tmpX = Math.max(0, -xOffset);
                        var tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset, maxScreenWidth - tmpX - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    // RENDER DAY/NIGHT TIME:
                    mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    // RENDER PLAYER AND AI UI / PLAYERINFOS:
                    mainContext.strokeStyle = darkOutlineColor;
                    players.forEach((tmp)=>{
                        tmpObj = tmp;
                        if (tmpObj.visible) {
                            var xOffset = camX - maxScreenWidth / 2;
                            var yOffset = camY - maxScreenHeight / 2;
                            if (getEl("linetracer").checked) {
                                if(getEl("visual").value == "hans") {
                                    let dist = UTILS.getDist(tmpObj, player, 0, 0);
                                    if(player) {
                                        if ((getEl("visual").value == "hans" ? (dist > 230 && dist < 6000) : dist > 0)) {
                                            mainContext.font = "23px Hammersmith One";
                                            mainContext.lineWidth = getEl("visual").value == "hans" ? 2 : 1;
                                            mainContext.strokeStyle = getEl("visual").value == "hans" ? isTeam(tmpObj) ? "#56b064" : "#cc5151" : "#cc5151";
                                            mainContext.beginPath();
                                            mainContext.moveTo(player.x-xOffset, player.y-yOffset);
                                            mainContext.lineTo(tmpObj.x-xOffset, tmpObj.y-yOffset);
                                            mainContext.stroke();
                                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                                            mainContext.lineTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                            mainContext.stroke();
                                            mainContext.lineWidth = 1;
                                            mainContext.fillStyle = "#000";
                                            mainContext.beginPath();
                                            mainContext.strokeText(tmpObj.name, (tmpObj.x - xOffset + player.x - xOffset) / 2, (tmpObj.y - yOffset + player.y - yOffset) / 2)
                                            mainContext.fillText(tmpObj.name, (tmpObj.x - xOffset + player.x - xOffset) / 2, (tmpObj.y - yOffset + player.y - yOffset) / 2, player.isAI)
                                            mainContext.closePath();
                                            mainContext.fill();
                                            mainContext.stroke();
                                            mainContext.lineWidth = 2;
                                            mainContext.strokeStyle = "#000";
                                            mainContext.beginPath();
                                            mainContext.stroke();
                                            mainContext.lineWidth = 1;
                                            mainContext.strokeStyle = getEl("visual").value == "hans" ? isTeam(tmpObj) ? "#000000" : "#000000" : "#000000";
                                        }
                                    }
                                }
                            }
                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) {
                                mainContext.strokeStyle = darkOutlineColor;
                                mainContext.globalAlpha = 1;
                                let checkName = streamerMode ? tmpObj == player ? "unknown" : tmpObj.name : tmpObj.name;
                                var tmpText = getEl("visual").value == "me" ? (tmpObj.team ? "[" + tmpObj.team + "] " : "") + ("[" + tmpObj.sid + "] ") + (checkName || "") : getEl("visual").value == "spyder" ? (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (" [" + Math.floor(tmpObj.health) + "/100] {" + tmpObj.sid + "} ") + (checkName || "") + (" <" + tmpObj.shameCount + ">") : getEl("visual").value == "lore" ? (tmpObj.team ? "[" + tmpObj.team + "] " : "") + ("{" + tmpObj.sid + "} ") + (checkName || "") : getEl("visual").value == "cele" ? (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (checkName || "") + (" {" + tmpObj.shameCount + "}") : getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj != player ? "[" + tmpObj.primaryIndex + "/" + tmpObj.secondaryIndex + "/" + tmpObj.healSid + "] " : "") + (checkName || "") : (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (checkName || "");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - tmpS / 2 - mainContext.measureText(tmpText).width / 2 - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY - tmpS / 2 - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY - tmpS / 2 - 5, tmpS, tmpS);
                                    }
                                    if (instaC.wait && near.sid == tmpObj.sid && iconSprites["cross" + (tmpObj.anti ? "1" : "2")].isLoaded && getEl("visual").value != "0" && getEl("visual").value != "ae" && enemy.length) {
                                        var tmpS = near.scale * 2.2;
                                        mainContext.drawImage(iconSprites["cross" + (tmpObj.anti ? "1" : "2")], near.x - xOffset - tmpS / 2, near.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                }
                                if ((getEl("visual").value == "ae" ? tmpObj == player ? true : tmpObj.hitted : true) && tmpObj.health > 0) {
                                    // HEALTH HOLDER:
                                    var tmpWidth = config.healthBarWidth;
                                    mainContext.fillStyle = darkOutlineColor;
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                                    mainContext.fill();
                                    // HEALTH BAR:
                                    mainContext.fillStyle = isTeam(tmpObj) ? "#8ecc51" : "#cc5151";
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                                    mainContext.fill();
                                }
                                //wasd
                                if (getEl("visual").value != "0" && getEl("visual").value != "ae") {
                                    if (getEl("visual").value != "zeph" && !getEl("visual").value != "hans") {
                                        mainContext.font = "20px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? tmpObj.scale / 10 : tmpObj.nameScale ? 11 : 8;
                                        mainContext.lineJoin = "round";
                                        if (tmpObj == player) {
                                            if (getEl("visual").value == "me") {
                                                mainContext.strokeText("[" + [tmpObj.projDist, tmpObj.turretReloaded].join("/") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                                mainContext.fillText("[" + [tmpObj.projDist, tmpObj.turretReloaded].join("/") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                            } else if (getEl("visual").value == "fz") {
                                                let statusss = !isNaN(maxPing) ? [maxPing, window.pingTime, minPing] : ["n", "a"];
                                                mainContext.strokeText("[" + tmpObj.turretReloaded + "," + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                                mainContext.fillText("[" + tmpObj.turretReloaded + "," + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                            } else if (getEl("visual").value == "zyenith") {
                                                let statusss = [`${antiSync ? "true" : "false"}`, maxPing, minPing];
                                                mainContext.strokeText("[" + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 3);
                                                mainContext.fillText("[" + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 3);
                                            }
                                        } else {
                                            if (getEl("visual").value == "me") {
                                                mainContext.strokeText("[" + [tmpObj.healSid, tmpObj.instaThreat].join("/") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                                mainContext.fillText("[" + [tmpObj.healSid, tmpObj.instaThreat].join("/") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                            } else if (getEl("visual").value == "zyenith") {
                                                // @zyenith !send method 40 Wealthy 69
                                                let statusss = [tmpObj.maxShame, 0, 0];
                                                mainContext.strokeText("[" + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                                mainContext.fillText("[" + statusss.join(",") + "]", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13.5 * 2);
                                            }
                                        }
                                    }
                                    if (getEl("visual").value == "spyder") {
                                        mainContext.strokeText(tmpObj.reloads[53] == 0 ? "true" : "false", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 30);
                                        mainContext.fillText(tmpObj.reloads[53] == 0 ? "true" : "false", tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 30);
                                    } else if (getEl("visual").value == "lore") {
                                        mainContext.strokeText(tmpObj.shameCount, tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 30);
                                        mainContext.fillText(tmpObj.shameCount, tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 30);
                                    }
                                    if (getEl("visual").value != "0" && getEl("visual").value != "zeph") {
                                        if (getEl("visual").value == "me" || getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                            mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                            mainContext.fillStyle = getEl("visual").value == "fz" || getEl("visual").value == "zyenith" ? "#ff0000" : tmpObj.shameCount < tmpObj.dangerShame ? "#e6e6fa" : "#cc5151";
                                            mainContext.textBaseline = "middle";
                                            mainContext.textAlign = "center";
                                            mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                            mainContext.lineJoin = "round";
                                            var tmpS = config.crownIconScale;
                                            var tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? (tmpObj.nameScale || 30) * 2.75 : tmpObj.nameScale || 30);
                                            mainContext.strokeText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                            mainContext.fillText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        }
                                        if (getEl("visual").value == "hans" ? tmpObj == player : true) {
                                            let PAD = getEl("visual").value == "hans" ? 2.75 : 0;
                                            let tmpX = getEl("visual").value == "hans" ? -1 : 0;
                                            let BAR = config.healthBarWidth - PAD;
                                            let tmpReloads = {
                                                primary: getEl("visual").value == "spyder" || getEl("visual").value == "hans" ? tmpObj.oldReloads[tmpObj.primaryIndex] - (tmpObj.oldReloads[tmpObj.primaryIndex] - tmpObj.reloads[tmpObj.primaryIndex]) * tmpObj.rt : tmpObj.reloads[tmpObj.primaryIndex],
                                                secondary: getEl("visual").value == "spyder" || getEl("visual").value == "hans" ? tmpObj.oldReloads[tmpObj.secondaryIndex] - (tmpObj.oldReloads[tmpObj.secondaryIndex] - tmpObj.reloads[tmpObj.secondaryIndex]) * tmpObj.rt : tmpObj.reloads[tmpObj.secondaryIndex],
                                            };
                                            if (tmpObj == player && getEl("visual").value == "hans") {
                                                // TURRET RELOAD HOLDER:
                                                var tmpWidth = config.healthBarWidth;
                                                mainContext.fillStyle = darkOutlineColor;
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                                                mainContext.fill();
                                                // TURRET RELOAD BAR:
                                                mainContext.fillStyle = "#96963c";
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13 + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.reloads[53] == undefined ? 1 : (2500 - tmpObj.reloads[53]) / 2500), 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }
                                            // SECONDARY RELOAD HOLDER:
                                            var tmpWidth = config.healthBarWidth;
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad + 50 + PAD, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + tmpX, BAR + config.healthBarPad * 2, 17, 8);
                                            mainContext.fill();
                                            // SECONDARY RELOAD BAR:
                                            if (getEl("visual").value == "spyder") {
                                                mainContext.fillStyle = tmpObj.secondaryIndex == undefined || tmpObj.reloads[tmpObj.secondaryIndex] == 0 ? "#cba24f" : "#f4d393";
                                            } else if (getEl("visual").value == "lore") {
                                                mainContext.fillStyle = "#fff066";
                                            } else if (getEl("visual").value == "me") {
                                                mainContext.fillStyle = isTeam(tmpObj) ? tmpObj.secondaryIndex == undefined || tmpObj.reloads[tmpObj.secondaryIndex] == 0 ? "#8ecc51" : `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.secondaryIndex] / 100)}, 50%, 60%)` : "#cc5151";
                                            } else if (getEl("visual").value == "cele") {
                                                mainContext.fillStyle = "#b0c4de";
                                            } else if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                                mainContext.fillStyle = tmpObj.secondaryIndex == undefined || tmpObj.reloads[tmpObj.secondaryIndex] == 0 ? "#ffff00" : `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.secondaryIndex] / 100)}, 50%, 60%)`;
                                            } else if (getEl("visual").value == "hans") {
                                                mainContext.fillStyle = tmpObj.secondaryIndex == undefined || tmpObj.reloads[tmpObj.secondaryIndex] == 0 ? "#8f8366" : `hsl(90, 55%, 56%)`;
                                            }
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth + 50 + PAD, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad + tmpX, BAR * (tmpObj.reloads[tmpObj.secondaryIndex] == undefined ? 1 : (items.weapons[tmpObj.secondaryIndex].speed - tmpReloads.secondary) / items.weapons[tmpObj.secondaryIndex].speed), (getEl("visual").value == "spyder" ? 16 : 17) - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                            // PRIMARY RELOAD HOLDER:
                                            var tmpWidth = config.healthBarWidth;
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + tmpX, BAR + config.healthBarPad * 2, 17, 8);
                                            mainContext.fill();
                                            // PRIMARY RELOAD BAR:
                                            if (getEl("visual").value == "spyder") {
                                                mainContext.fillStyle = tmpObj.primaryIndex == undefined || tmpObj.reloads[tmpObj.primaryIndex] == 0 ? "#cba24f" : "#f4d393";
                                            } else if (getEl("visual").value == "lore") {
                                                mainContext.fillStyle = "#fff066";
                                            } else if (getEl("visual").value == "me") {
                                                mainContext.fillStyle = isTeam(tmpObj) ? tmpObj.primaryIndex == undefined || tmpObj.reloads[tmpObj.primaryIndex] == 0 ? "#8ecc51" : `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.primaryIndex] / 100)}, 50%, 60%)` : "#cc5151";
                                            } else if (getEl("visual").value == "cele") {
                                                mainContext.fillStyle = "#b0c4de";
                                            } else if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                                mainContext.fillStyle = tmpObj.primaryIndex == undefined || tmpObj.reloads[tmpObj.primaryIndex] == 0 ? "#ffff00" : `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.primaryIndex] / 100)}, 50%, 60%)`;
                                            } else if (getEl("visual").value == "hans") {
                                                mainContext.fillStyle = tmpObj.primaryIndex == undefined || tmpObj.reloads[tmpObj.primaryIndex] == 0 ? "#8f8366" : `hsl(90, 55%, 56%)`;
                                            }
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad + tmpX, BAR * (tmpObj.reloads[tmpObj.primaryIndex] == undefined ? 1 : (items.weapons[tmpObj.primaryIndex].speed - tmpReloads.primary) / items.weapons[tmpObj.primaryIndex].speed), (getEl("visual").value == "spyder" ? 16 : 17) - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        }
                                    }
                                }
                            }
                        } else {}
                        if (player) {
                            if (getEl("visual").value == "me" && !isTeam(tmpObj)) {
                                let dist = UTILS.getDist(tmpObj, player, 0, 0);
                                if (dist > 600) {
                                    if (!tmpObj.notHere) {
                                        let tracerSize = tmpObj.scale * 2;
                                        let maxmin = function(fr, XorY) {
                                            return Math.max(-(fr - tracerSize), Math.min(fr - tracerSize, XorY));
                                        };
                                        let fixXY = {
                                            x: player.x - xOffset + maxmin(maxScreenWidth / 2, tmpObj.x - xOffset - (player.x - xOffset)),
                                            y: player.y - yOffset + maxmin(maxScreenHeight / 2, tmpObj.y - yOffset - (player.y - yOffset)),
                                        };
                                        let rad = UTILS.getDirect(tmpObj, player, 0, 0);
                                        mainContext.save();
                                        mainContext.translate(fixXY.x, fixXY.y);
                                        mainContext.rotate(rad + Math.PI / 2);
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.globalAlpha = 0.6;
                                        renderTriangle2(tracerSize, mainContext);
                                        mainContext.restore();
                                    }
                                } else {
                                    if (!tmpObj.visible) {
                                        tmpObj.notHere = true;
                                    } else {
                                        tmpObj.notHere = false;
                                    }
                                }
                            }
                        }
                    }
                                   );
                    ais.forEach((tmp)=>{
                        tmpObj = tmp;
                        if (tmpObj.visible) {
                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) {
                                mainContext.strokeStyle = darkOutlineColor;
                                mainContext.globalAlpha = 1;
                                var tmpText = getEl("visual").value == "me" ? "[TeamAnimal] " + (tmpObj.name || "") : getEl("visual").value == "spyder" ? tmpObj.name || "" : getEl("visual").value == "lore" ? "{" + tmpObj.sid + "} " + (tmpObj.name || "") : getEl("visual").value == "cele" ? tmpObj.name || "" : tmpObj.name || "";
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    if (getEl("visual").value == "me" && (tmpObj.name == "MOOSTAFA" || tmpObj.name == "MOOFIE") && iconSprites[tmpObj.name == "MOOFIE" ? "skull" : "crown"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - tmpS / 2 - mainContext.measureText(tmpText).width / 2 - config.crownPad;
                                        mainContext.drawImage(iconSprites[tmpObj.name == "MOOFIE" ? "skull" : "crown"], tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY - tmpS / 2 - 5, tmpS, tmpS);
                                    }
                                }
                                if (tmpObj.health > 0) {
                                    // HEALTH HOLDER:
                                    var tmpWidth = config.healthBarWidth;
                                    mainContext.fillStyle = darkOutlineColor;
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                                    mainContext.fill();
                                    // HEALTH BAR:
                                    mainContext.fillStyle = "#cc5151";
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                                    mainContext.fill();

                                    mainContext.font = "20px 'Hammersmith One'";
                                    mainContext.fillStyle = "#990000";
                                    mainContext.textAlign = "center";
                                    let ysss = tmpObj.y - yOffset + tmpObj.scale + config.nameY + 8;
                                    ysss += 25;
                                    mainContext.fillText(tmpObj.health + "/" + tmpObj.maxHealth, tmpObj.x - xOffset, ysss);

                                    if (tmpObj.name == "MOOSTAFA") {
                                        // MOOSTAFA RELOAD HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                        mainContext.fill();
                                        // MOOSTAFA RELOAD BAR:
                                        mainContext.fillStyle = outlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad, config.healthBarWidth * ((600 - tmpObj.weaponReload) / 600), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }
                                }
                            }
                        }
                    }
                               );
                    // RENDER OBJECT HEALTH:
                    if (getEl("bh").checked) {
                        gameObjects.forEach((tmp)=>{
                            tmpObj = tmp;
                            if (tmpObj.active && tmpObj.buildHealth) {
                                if (player) {
                                    if (UTILS.getDist(tmpObj, player, 0, 0) <= 2000) {
                                        if (tmpObj.doUpdate) {
                                            // HEALTH HOLDER:
                                            var tmpWidth = config.healthBarWidth;
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2 - config.healthBarPad, tmpObj.y - yOffset - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                            mainContext.fill();
                                            // HEALTH BAR:
                                            mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#56b064";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2, tmpObj.y - yOffset, config.healthBarWidth * (tmpObj.buildHealth / tmpObj.health), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        }else {
                                            // HEALTH HOLDER:
                                            var tmpWidth = config.healthBarWidth;
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2 - config.healthBarPad, tmpObj.y + 10 - yOffset - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                            mainContext.fill();
                                            // HEALTH BAR:
                                            mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#56b064";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2, tmpObj.y + 10 - yOffset, config.healthBarWidth * (tmpObj.buildHealth / tmpObj.health), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        }
                                        if (tmpObj.doUpdate) {
                                            mainContext.font = "17px Arial";
                                            mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#f4cccc" : "#98f6f9";
                                            mainContext.textAlign = "center";
                                            let buildinghealthValue = Number.isInteger(tmpObj.buildHealth) ? tmpObj.buildHealth : tmpObj.buildHealth.toFixed(2);
                                            mainContext.fillText(buildinghealthValue, tmpObj.x - xOffset, tmpObj.y - yOffset + 14 + 5 + 13);
                                        }else {
                                            mainContext.font = "17px Arial";
                                            mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#f4cccc" : "#98f6f9";
                                            mainContext.textAlign = "center";
                                            let buildinghealthValue = Number.isInteger(tmpObj.buildHealth) ? tmpObj.buildHealth : tmpObj.buildHealth.toFixed(2);
                                            mainContext.fillText(buildinghealthValue, tmpObj.x - xOffset, tmpObj.y - yOffset + 14 + 15);
                                        }
                                    }
                                    if (UTILS.getDist(tmpObj, player, 0, 0) <= 2000 && tmpObj.doUpdate) {
                                        // RELOAD HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2 - config.healthBarPad, tmpObj.y - yOffset - config.healthBarPad + 13, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                        mainContext.fill();
                                        // RELOAD BAR:
                                        mainContext.fillStyle = "#a5974c";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth / 2, tmpObj.y + 10 - yOffset, config.healthBarWidth * ((2200 - tmpObj.shootReload) / 2200), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }
                                }
                            }
                        }
                                           );
                    }

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);
                    // RENDER CHAT MESSAGES:
                    players.forEach((tmp)=>{
                        tmpObj = tmp;
                        if (tmpObj.visible && tmpObj.chatCountdown > 0) {
                            tmpObj.chatCountdown = Math.max(0, (tmpObj.chatCountdown -= delta));
                            mainContext.font = "32px Hammersmith One";
                            var tmpSize = mainContext.measureText(tmpObj.chatMessage);
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            var tmpX = tmpObj.x - xOffset;
                            var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                            var tmpH = 47;
                            var tmpW = tmpSize.width + 17;
                            mainContext.fillStyle = "rgba(0,0,0,0.2)";
                            mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                            mainContext.fill();
                            mainContext.fillStyle = "#fff";
                            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                        }
                    }
                                   );
                }
                // RENDER MINIMAP:
                renderMinimap(delta);
                // RENDER CONTROLS:
                if (controllingTouch.id !== -1) {
                    renderControl(controllingTouch.startX, controllingTouch.startY, controllingTouch.currentX, controllingTouch.currentY);
                }
                if (attackingTouch.id !== -1) {
                    renderControl(attackingTouch.startX, attackingTouch.startY, attackingTouch.currentX, attackingTouch.currentY);
                }
                if (mainContext && (getEl("darkmode").checked)) {
                    mainContext.beginPath();
                    let screenW = maxScreenWidth / 2;
                    let screenH = maxScreenHeight / 2;
                    let gradient = mainContext.createRadialGradient(screenW, screenH, 0, screenW, screenH, getEl("visual").value == "hans" ? maxScreenWidth : maxScreenHeight);
                    for (let i = 0; i <= 1; i++) {
                        gradient.addColorStop(i, "rgba(0, 0, 0, 0.1)");
                    }
                    mainContext.fillStyle = gradient;
                    mainContext.rect(0, 0, maxScreenWidth, maxScreenHeight);
                    mainContext.fill();
                }
            }
            // RENDER CONTROL:
            function renderControl(startX, startY, currentX, currentY) {
                mainContext.save();
                mainContext.setTransform(1, 0, 0, 1, 0, 0);
                // mainContext.resetTransform();
                mainContext.scale(pixelDensity, pixelDensity);
                var controlRadius = 50;
                mainContext.beginPath();
                mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
                mainContext.closePath();
                mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
                mainContext.fill();
                var controlRadius = 50;
                var offsetX = currentX - startX;
                var offsetY = currentY - startY;
                var mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
                var divisor = mag > controlRadius ? mag / controlRadius : 1;
                offsetX /= divisor;
                offsetY /= divisor;
                mainContext.beginPath();
                mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
                mainContext.closePath();
                mainContext.fillStyle = "white";
                mainContext.fill();
                mainContext.restore();
            }
            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for (var i = 0; i < projectiles.length; ++i) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                }
            }
            // RENDER PROJECTILE:
            var projectileSprites = {};

            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    var tmpSrc = items.projectiles[obj.indx].src;
                    var tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        ;
                        tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - obj.scale / 2, y - obj.scale / 2, obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }
            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
                // MIDDLE RIVER:
                var tmpW = config.riverWidth + padding;
                var tmpY = config.mapScale / 2 - yOffset - tmpW / 2;
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }
            // RENDER GAME OBJECTS:
            function renderGameObjects(layer, xOffset, yOffset) {
                var tmpSprite, tmpX, tmpY;
                gameObjects.forEach((tmp)=>{
                    tmpObj = tmp;
                    if (tmpObj.active) {
                        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                        if (layer == 0) {
                            tmpObj.update(delta);
                            if (getEl("darkmode").checked && getEl("shadowss").checked) {
                                mainContext.shadowColor = "rgba(0, 0, 0, 0.35)";
                                mainContext.shadowOffsetX = 8;
                                mainContext.shadowOffsetY = 8;
                                mainContext.shadowBlur = 7.5;
                                }
                        }
                        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                            mainContext.globalAlpha = tmpObj.hideFromEnemy ? 0.6 : 1;
                            if (tmpObj.isItem) {
                                if ((tmpObj.dmg || tmpObj.trap) && getEl("visual").value != "0" && getEl("visual").value != "ae" && player && player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid)) {
                                    tmpSprite = getObjSprite(tmpObj);
                                } else {
                                    tmpSprite = getItemSprite(tmpObj);
                                }
                                mainContext.save();
                                mainContext.translate(tmpX, tmpY);
                                if ((getEl("visual").value != "cele" && getEl("visual").value != "ae") || tmpObj.doUpdate) {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                                if (tmpObj.blocker) {
                                    mainContext.strokeStyle = "#db6e6e";
                                    mainContext.globalAlpha = 0.3;
                                    mainContext.lineWidth = 6;
                                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                }
                                mainContext.restore();
                            } else {
                                tmpSprite = getResSprite(tmpObj);
                                mainContext.drawImage(tmpSprite, tmpX - tmpSprite.width / 2, tmpY - tmpSprite.height / 2);
                            }
                        }
                    }
                }
                                   );
            }
            // GATHER ANIMATION:
            let hittedObj = [];
            let hittedObj2 = [];

            function objHitC(dmg, index) {
                return new Promise((resolve,reject)=>{
                    resolve({
                        dmg: dmg,
                        index: index
                    });
                }
                                  );
            }

            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if (didHit) {
                        tmpObj.doTickUpdate = true;
                        let camper = tmpObj;
                        let lolnoob = hittedObj;
                        hittedObj = [];
                        doNextTick(()=>{
                            let cope = items.weapons[index];
                            let getgood = config.weaponVariants[camper.primaryVariant == undefined ? 0 : camper.primaryVariant].val;
                            let ratio = cope.sDmg || 1;
                            let damagedHeart = cope.dmg * getgood * ratio * (camper.skinIndex == 40 ? 3.3 : 1);
                            lolnoob.forEach((urbad)=>{
                                urbad.buildHealth -= damagedHeart;
                            }
                                           );
                        }
                                  );
                    }
                }
            }
            // RENDER PLAYERS:
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += 0.002 * delta;
                            tmpDir = (tmpObj == player && !(getEl("visual").value == "me" || getEl("visual").value == "spyder" || getEl("visual").value == "ae") ? getEl("visual").value == "lore" || getEl("visual").value == "zeph" || getEl("visual").value == "fz" ? getAttackDir() : getSafeDir() : tmpObj.dir) + tmpObj.dirPlus;
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            // RENDER PLAYER:
                            mainContext.rotate(tmpDir);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                            /*if (tmpObj) {

                                            mainContext.rotate(0);
                                            let X = {
                                                one: tmpObj.x - 12,
                                                two: tmpObj.x + 12
                                            }
                                            let Y = tmpObj.y - 3.5;

                                            // EYE:
                                            mainContext.save();
                                            mainContext.fillStyle = "#000";
                                            renderCircle2(X.one - xOffset, Y - yOffset, 8, mainContext, true, false);
                                            renderCircle2(X.two - xOffset, Y - yOffset, 8, mainContext, true, false);

                                            mainContext.fillStyle = "#fff";
                                            let maxmin = function(fr, XorY) {
                                                return Math.max(-(fr - 4), Math.min((fr - 4), XorY));
                                            }
                                            renderCircle2(X.one - xOffset, Y - yOffset, 4, mainContext, true, false);
                                            renderCircle2(X.two - xOffset, Y - yOffset, 4, mainContext, true, false);
                                            mainContext.restore();

                                        }*/
                        }
                    }
                }
            }
            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                var handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                var oHandAngle = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndS || 1 : 1;
                var oHandDist = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndD || 1 : 1;
                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }
                if (getEl("darkmode").checked && getEl("shadowss").checked) {
                    mainContext.shadowColor = "rgba(0, 0, 0, 0.35)";
                    mainContext.shadowOffsetX = 8;
                    mainContext.shadowOffsetY = 8;
                    mainContext.shadowBlur = 7.5;
                }
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[(getEl("kmtexture").checked && obj.weaponIndex == 3 && obj.secondaryIndex == 15) ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14);
                renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14);
                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }
                //if (getEl("darkmode").checked) {
                    //mainContext.shadowColor = "rgba(0, 0, 0, 0.35)";
                    //mainContext.shadowOffsetX = 10;
                    //mainContext.shadowOffsetY = 10;
                    //mainContext.shadowBlur = 7.5;
                //}
                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);
                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }
            // RENDER SKINS:
            var skinSprites = {};
            var skinPointers = {};
            var tmpSkin;

            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    }
                    ;
                    tmpImage.src = ".././img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = parentSkin || skinPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }
            // RENDER TAIL:
            var accessSprites = {};
            var accessPointers = {};

            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    }
                    ;
                    tmpImage.src = ".././img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin) ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }
            // RENDER TOOL:
            var toolSprites = {};

            function renderTool(obj, variant, x, y, ctxt) {
                var tmpSrc = obj.src + (variant || "");
                var tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    ;
                    tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2, obj.length, obj.width);
            }
            // RENDER GAME OBJECTS:
            var gameObjectSprites = {};

            function getResSprite(obj) {
                var biomeID = obj.y >= config.mapScale - config.snowBiomeTop ? 2 : obj.y <= config.snowBiomeTop ? 1 : 0;
                var tmpIndex = obj.type + "_" + obj.scale + "_" + biomeID;
                var tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.1 + outlineWidth;
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    let colors = [["#b1d959", "#95b946"], ["#bade6e", "#aac76b"], ["#a7d544", "#86a63f"], ["#b4db62", "#9ebf57"], ];
                    let select = colors[Math.floor(Math.random() * colors.length)];
                    if (obj.type == 0) {
                        var tmpScale;
                        for (var i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? !i ? select[1] : select[0] : !i ? "#e3f1f4" : "#fff";
                            tmpContext.fill();
                            if (!i)
                                tmpContext.stroke();
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                            var tmpRange;
                            var berries = 4;
                            var rotVal = mathPI2 / berries;
                            for (var i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#938d77" : "#939393" : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }
            // GET ITEM SPRITE:
            var itemSprites = [];

            function getItemSprite(obj, asIcon) {
                var tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0);
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(asIcon ? 0 : Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth * (asIcon ? tmpCanvas.width / 81 : 1);
                    if (obj.name == "apple") {
                        tmpContext.fillStyle = "#c15555";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#89a54c";
                        var leafDir = -(Math.PI / 2);
                        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, tmpContext);
                    } else if (obj.name == "cookie") {
                        tmpContext.fillStyle = "#cca861";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#937c4b";
                        var chips = 4;
                        var rotVal = mathPI2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "cheese") {
                        tmpContext.fillStyle = "#f4f3ac";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c3c28b";
                        var chips = 4;
                        var rotVal = mathPI2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                        tmpContext.fillStyle = obj.name == "castle wall" ? "#83898e" : obj.name == "wood wall" ? "#a5974c" : "#939393";
                        var sides = obj.name == "castle wall" ? 4 : 3;
                        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = obj.name == "castle wall" ? "#9da4aa" : obj.name == "wood wall" ? "#c9b758" : "#bcbcbc";
                        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        var tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale * 0.5, tmpContext);
                    } else if (obj.name == "mine") {
                        tmpContext.fillStyle = "#939393";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#bcbcbc";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "sapling") {
                        for (var i = 0; i < 2; ++i) {
                            var tmpScale = obj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !i ? "#9ebf57" : "#b4db62";
                            tmpContext.fill();
                            if (!i)
                                tmpContext.stroke();
                        }
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = outlineColor;
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "boost pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#dbd97d";
                        renderTriangle(obj.scale * 1, tmpContext);
                    } else if (obj.name == "turret") {
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#939393";
                        var tmpLen = 50;
                        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                    } else if (obj.name == "platform") {
                        tmpContext.fillStyle = "#cebd5f";
                        var tmpCount = 4;
                        var tmpS = obj.scale * 2;
                        var tmpW = tmpS / tmpCount;
                        var tmpX = -(obj.scale / 2);
                        for (var i = 0; i < tmpCount; ++i) {
                            renderRect(tmpX - tmpW / 2, 0, tmpW, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpX += tmpS / tmpCount;
                        }
                    } else if (obj.name == "healing pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#db6e6e";
                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                    } else if (obj.name == "spawn pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#71aad6";
                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    } else if (obj.name == "blocker") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.rotate(Math.PI / 4);
                        tmpContext.fillStyle = "#db6e6e";
                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                    } else if (obj.name == "teleporter") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.rotate(Math.PI / 4);
                        tmpContext.fillStyle = "#d76edb";
                        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            var objSprites = [];

            function getObjSprite(obj) {
                var tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0);
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        var tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                var endX = x + l * Math.cos(r);
                var endY = y + l * Math.sin(r);
                var width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo((x + endX) / 2 + width * Math.cos(r + Math.PI / 2), (y + endY) / 2 + width * Math.sin(r + Math.PI / 2), endX, endY);
                ctxt.quadraticCurveTo((x + endX) / 2 - width * Math.cos(r + Math.PI / 2), (y + endY) / 2 - width * Math.sin(r + Math.PI / 2), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }
            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill)
                    tmpContext.fill();
                if (!dontStroke)
                    tmpContext.stroke();
            }

            function renderCircle2(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.ellipse(x, y, scale * 1.5, scale, Math.PI / 2, 0, Math.PI * 2);
                if (!dontFill)
                    tmpContext.fill();
                if (!dontStroke)
                    (tmpContext.lineWidth = 3.5),
                        tmpContext.stroke();
            }
            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                var rot = (Math.PI / 2) * 3;
                var x, y;
                var step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (var i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, stroke) {
                ctxt.fillRect(x - w / 2, y - h / 2, w, h);
                if (!stroke)
                    ctxt.strokeRect(x - w / 2, y - h / 2, w, h);
            }
            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (var i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, stroke);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }
            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                var rot = (Math.PI / 2) * 3;
                var x, y;
                var step = Math.PI / spikes;
                var tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (var i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter, Math.cos(rot + step * 2) * inner, Math.sin(rot + step * 2) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }
            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                var h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }

            function renderTriangle2(s, ctx) {
                ctx = ctx || mainContext;
                var h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 3.5);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 3.5);
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            }

            function renderTriangle3(s, ctx) {
                ctx = ctx || mainContext;
                var h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 1.5, h / 1.5);
                ctx.lineTo(s / 1.5, h / 1.5);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }

            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
            // CREATE FAKE OBJECTS:
            function makeFakeObjects() {
                return;
                for (let i = 0; i < 500; i++) {
                    let randomXY = {
                        x: Math.floor(Math.random() * 14400),
                        y: Math.floor(Math.random() * 14400),
                    };
                    let rT = Math.floor(Math.random() * 4);
                    objectManager.add(i, randomXY.x, randomXY.y, 0, (rT == 0 ? config.treeScales : rT == 1 ? config.bushScales : rT >= 2 && config.rockScales)[Math.florr(Math.random() * (rT == 0 ? 4 : 3))], rT);
                }
            }
            // ANTI TRAP:
            let earlyAutoBreak = {
                start: false
            };

            function antiTrap(aim) {
                if (near.dist2 <= 250) {
                    for (let i = -45; i <= 45; i += 90) {
                        checkPlace(2, aim + UTILS.toRad(i) + Math.PI);
                    }
                } else if (near.dist2 <= 600) {
                    for (let i = -45; i <= 45; i += 90) {
                        if (enemy.length) {
                            checkPlace(4, aim + UTILS.toRad(i) + Math.PI);
                        }
                    }
                }
            }
            // LOAD GAME OBJECT:
            let myTeles = [];

            function loadGameObject(data) {
                for (var i = 0; i < data.length; ) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], items.list[data[i + 6]], true, data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null);
                    let XY = {
                        x: data[i + 1],
                        y: data[i + 2],
                    };
                    let dist = UTILS.getDist(XY, player, 0, 2);
                    let aim = UTILS.getDirect(XY, player, 0, 2);
                    if (data[i + 6] == 22 && player.sid == data[i + 7]) {
                        myTeles.push({
                            x: data[i + 1],
                            y: data[i + 2]
                        });
                        setTimeout(()=>{
                            myTeles.shift();
                        }
                                   , 30000);
                    }
                    if (getEl("earlyab").checked) {
                        if (data[i + 6] == 15 && dist <= 100 && player.sid != data[i + 7] && !findAllianceBySid(data[i + 7])) {
                            setTimeout(()=>{
                                dist = UTILS.getDist(XY, player, 0, 2);
                                aim = UTILS.getDirect(XY, player, 0, 2);
                                traps.in = true;
                                traps.aim = aim;
                                if (!earlyAutoBreak.start) {
                                    earlyAutoBreak.start = true;
                                    earlyAutoBreak.hit = 0;
                                    earlyAutoBreak.miss = 0;
                                }
                                if (dist <= 75) {
                                    earlyAutoBreak.hit++;
                                } else {
                                    earlyAutoBreak.miss++;
                                }
                            }
                                       , parseInt(getEl("earlytime").value));
                        }
                    }
                    setTickout(()=>{
                        dist = UTILS.getDist(XY, player, 0, 2);
                        aim = UTILS.getDirect(XY, player, 0, 2);
                        if (data[i + 6] == 15 && dist <= 100 && player.sid != data[i + 7] && !findAllianceBySid(data[i + 7])) {
                            antiTrap(aim);
                        }
                    }
                               , 1);
                    i += 8;
                }
            }
            // WIGGLE GAME OBJECT:
            let ticktickticky = [];

            function antiSyncHealing(timearg) {
                antiSync = true;
                let healAnti = setInterval(()=>{
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }
                                           , 75);
                setTimeout(()=>{
                    clearInterval(healAnti);
                    setTimeout(()=>{
                        antiSync = false;
                    }, config.tickRate);
                }
                           , config.tickRate * timearg);
            }
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.buildHealth) {
                        hittedObj.push(tmpObj);
                        //                    hittedObj2.push(tmpObj);
                    }
                }
            }
            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.dir = dir;
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                    tmpObj.shootted = 1;
                }
            }
            // ADD PROJECTILE:
            let doSync = false;
            let dosyncpole = false
            let antiSync = false;
            let runAtNextTick = [];
            let rangeBackup = [];
            let middleclicck = false

            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                if (inWindow) {
                    projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer).sid = sid;
                }
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }

            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let fixXY = function(tmpObj) {
                    return {
                        x2: UTILS.fixTo(tmpObj.x2, 2),
                        y2: UTILS.fixTo(tmpObj.y2, 2),
                    };
                };
                let nearPlayer = players.filter((e)=>e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
                    return (UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2));
                })[0];
                if (nearPlayer) {
                    nearPlayer.projDist = UTILS.getDist(projXY, nearPlayer, 0, 2);
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiBulletSupportmentsEasyGamer69Proe(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
            }
            let projectileCount = 0;

            function antiBulletSupportmentsEasyGamer69Proe(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!isTeam(tmpObj)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(()=>{
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            if (getEl("antirange").checked && !antiSync) {
                                anti0Tick = 4;
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                anti0Tick = 4;
                                if (getEl("antisync").checked && !antiSync) {
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (var i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = hittedObj;
                        let aaaaaaaaaaaaaa = projectiles[i].dmg;
                        hittedObj = [];
                        doNextTick(()=>{
                            tmpObjects.forEach((tmp)=>{
                                if (tmp.projDmg) {
                                    tmp.buildHealth -= aaaaaaaaaaaaaa;
                                }
                            }
                                              );
                        }
                                  );
                    }
                }
            }
            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim();
                    tmpObj.weaponHitted = 1;
                    tmpObj.doTickUpdate = true;
                    let tmpObjects = hittedObj;
                    hittedObj = [];
                    doNextTick(()=>{
                        tmpObjects.forEach((tmp)=>{
                            tmp.buildHealth -= 232;
                        }
                                          );
                    }
                              );
                }
            }
            // ADD AI:
            function loadAI(data) {
                for (var i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    var tmpTime = Date.now();
                    for (var i = 0; i < data.length; ) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = tmpObj.t2 === undefined ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = tmpObj.d2 === undefined ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                            if (tmpObj.name == "MOOSTAFA") {
                                if (tmpObj.doTickUpdate) {
                                    tmpObj.doTickUpdate = false;
                                }
                                if (tmpObj.weaponHitted) {
                                    tmpObj.weaponHitted = false;
                                    tmpObj.weaponReload = 600;
                                } else {
                                    tmpObj.weaponReload = Math.max(0, tmpObj.weaponReload - config.tickRate);
                                }
                            }
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }
            // RENDER AI:
            var aiSprites = {};

            function renderAI(obj, ctxt) {
                var tmpIndx = obj.index;
                var tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    var tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    }
                    ;
                    tmpImg.src = ".././img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    var tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }
            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            // FUNCTIONS:
            let configs = {
                weaponCode: 0,
                antiBull: 0,
                antiBull2: 0,
                waitHit: false,
            };

            function place(id, radian) {
                try {
                    var item = items.list[player.items[id]];
                    if (player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, radian);
                        selectWeapon(configs.weaponCode, true);
                    }
                } catch (e) {}
            }

            function checkPlace(id, radian) {
                try {
                    var item = items.list[player.items[id]];
                    var tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    var tmpX = player.x2 + tmpS * Math.cos(radian);
                    var tmpY = player.y2 + tmpS * Math.sin(radian);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        if (player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                            selectToBuild(player.items[id]);
                            sendAtck(1, radian);
                            selectWeapon(configs.weaponCode, true);
                        }
                    }
                } catch (e) {}
            }
            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                var tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0],data[1],config,UTILS,projectileManager,objectManager,players,ais,items,hats,accessories);
                    players.push(tmpPlayer);
                }
                tmpPlayer.spawn(isYou ? moofoll : null);
                tmpPlayer.visible = false;
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    updateItems();
                    updateStatusDisplay();
                    updateAge();
                    updateUpgrades(0);
                    gameUI.style.display = "block";
                    updateItemCountHTML();
                    if (getEl("tryhard").checked) {
                        textManager.showText(player.x, player.y, 50, 0.5, 500, "Ping: " + window.pingTime, "#fff");
                    }
                    getEl("priXP").innerHTML = "Primary XP: 0 / not found";
                    getEl("secXP").innerHTML = "Secondary XP: 0 / not found";
                    setTimeout(()=>{
                        for (let i = 0; i < healthBased(); i++) {
                            place(0, getAttackDir());
                        }
                    }, 200);
                }
            }
            // REMOVE PLAYER:
            function removePlayer(id) {
                for (var i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        if (getEl("enemyradar" + players[i].sid)) {
                            getEl("enemyradar" + players[i].sid).remove();
                        }
                        players.splice(i, 1);
                        break;
                    }
                }
            }
            // UPDATE PLAYER ITEM VALUES:
            let isItemSetted = [];

            function updateItemCountHTML(index=undefined) {
                for (let i = 0; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                    display: block;
                    position: absolute;
                    padding-left: 5px;
                    font-size: 2em;
                    color: #fff;
                    `;
                        if (i < 3) {
                            isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                        } else {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                        }
                    } else {
                        if (index == id) {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                        }
                        if (index == undefined) {
                            if (i < 3) {
                                isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                            }
                        }
                    }
                    if (getEl("visual").value == "0" || getEl("visual").value == "ae") {
                        if (isItemSetted[tmpI].style.display == "block") {
                            isItemSetted[tmpI].style.display = "none";
                        }
                    } else {
                        if (isItemSetted[tmpI].style.display == "none") {
                            isItemSetted[tmpI].style.display = "block";
                        }
                    }
                }
            }

            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountHTML(index);
                }
            }
            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;
                    if (index == "food") {
                        for (let i = 0; i < 3; i++) {
                            let tmpI = items.weapons.length + i;
                            getEl("itemCount" + tmpI).innerHTML = Math.floor(player.food / items.list[i].req[1]);
                        }
                    }
                    if (index == "food" || index == "wood" || index == "stone") {
                        let XP = value - parseFloat(getEl(index + "Display").innerText);
                        if (XP > 0) {
                            doNextTick(()=>{
                                player.addWeaponXP(XP);
                            }
                                      );
                        }
                    }
                    if (updateView)
                        updateStatusDisplay();
                }
            }
            // ADVANCED:
            function applCxC(value) {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function healthBased() {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }

            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            // LATER:
            function predictHeal() {}
            // UPDATE HEALTH:
            let healType = undefined;
            let guessEmpAnti = false;
            let doEmpAntiInsta = false;
            let judgeAtNextTick = false;
            let nearSpike = [];

            function Si(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    let tmpHealth = tmpObj.health;
                    tmpObj.health = value;
                    if (tmpHealth < tmpObj.health) {
                        if (tmpObj.hitTime) {
                            let timeSinceHit = Date.now() - tmpObj.hitTime;
                            let tmpShame = tmpObj.shameCount;
                            let tickiy = ticks.time.filter(e => e == "lag");
                            let pingSince = Math.max(120, window.pingTime);
                            tmpObj.hitTime = 0;
                            if (timeSinceHit <= (tickiy.length >= 2 ? 120 : 120)) {
                                tmpObj.shameCount += 1;
                                if (instaC.isTrue) {
                                    tmpObj.healSid = Math.min(3, tmpObj.healSid + 1);
                                }
                                if (tmpObj.shameCount > tmpObj.maxShame) {
                                    tmpObj.maxShame = tmpObj.shameCount;
                                }
                            } else {
                                tmpObj.shameCount = Math.max(0, tmpObj.shameCount - 2);
                                if (instaC.isTrue) {
                                    tmpObj.healSid = Math.max(-1, tmpObj.healSid - 1);
                                }
                            }
                            if (tmpObj != player) {
                                if (tmpShame < tmpObj.shameCount) {//                                tmpObj.dangerShame = tmpObj.shameCount;
                                }
                            } else {
                                healLag = timeSinceHit - window.pingTime;
                            }
                        }
                    } else if (tmpHealth > tmpObj.health) {
                        tmpObj.hitTime = Date.now();
                        tmpObj.hitted = true;
                        tmpObj.damaged = true;
                        let damage = tmpHealth - tmpObj.health;
                        if (tmpObj.skinIndex == 7 && (damage == 5 || (tmpObj.tailIndex == 13 && damage == 2))) {
                            tmpObj.bTick = ticks.tick;
                            if (tmpObj == player) {
                                reSyncBull = false;
                            }
                        }
                        //                               console.log(damage);
                        if (tmpObj == player) {
                            if (getEl("simpleheal").checked) {
                                simpleAutoHealer(tmpObj, damage);
                            } else {
                                autoHealer(tmpObj, damage);
                            }
                        }
                    }
                }
            }

            let stopHealing = false;
            function healIntrap(tmpObj, value) {
                let pingHeal = function() {
                    return Math.max(0, 180 - window.pingTime);
                };
                let normalMS = 70;
                let goodMS = 125;
                if (true) {
                    /*if (!stopHealing) {
                    stopHealing = true;
                    setTimeout(()=> {
                        stopHealing = false;
                    }, config.tickRate * 1.5);
                    for (let i = 0; i < healthBased(); i++) {
                        place(0, getAttackDir());
                    }
                }*/
                    (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                        for (let i = 0; i < applCxC(value); i++) {
                            place(0, getAttackDir());
                        }
                    }
                                                                          , getEl("tickheal").checked ? 2 : pingHeal());
                } else {
                    (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                        for (let i = 0; i < applCxC(value); i++) {
                            place(0, getAttackDir());
                        }
                    }
                                                                          , getEl("tickheal").checked ? 2 : pingHeal());
                }
            }
            let backupAnti = [];
            let hittedTime = Date.now();

            function autoHealer(tmpObj, value) {
                let pingHeal = function() {
                    return Math.max(0, 180 - window.pingTime);
                };
                let normalMS = 70;
                let goodMS = 125;
                let antiInsta = false;
                let findAttacker = undefined;
                if (true) {
                    if (near.dist2 <= 300) {
                        if (value >= 20 && (Date.now() - hittedTime >= 180 || Date.now() - hittedTime <= 60)) {
                            if (tmpObj.shameCount < tmpObj.dangerShame) {
                                for (let i = 0; i < applCxC(value); i++) {
                                    place(0, getAttackDir());
                                }
                            } else {
                                (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                                    for (let i = 0; i < applCxC(value); i++) {
                                        place(0, getAttackDir());
                                    }
                                }
                                                                                      , getEl("tickheal").checked ? 2 : pingHeal());
                            }
                        } else {
                            if (traps.in) {
                                healIntrap(tmpObj, value);
                            } else {
                                (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                                    for (let i = 0; i < applCxC(value); i++) {
                                        place(0, getAttackDir());
                                    }
                                }
                                                                                      , getEl("tickheal").checked ? 2 : pingHeal());
                            }
                        }
                        if (player.skinIndex == 11) {
                            if (value >= 30) {
                                instaC.isCounter = true;
                            }
                        }
                        if (value >= 20) {
                            hittedTime = Date.now();
                            judgeAtNextTick = true;
                        }
                    } else {
                        if (traps.in) {
                            healIntrap(tmpObj, value);
                        } else {
                            (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                                for (let i = 0; i < applCxC(value); i++) {
                                    place(0, getAttackDir());
                                }
                            }
                                                                                  , getEl("tickheal").checked ? 2 : pingHeal());
                        }
                    }
                }
            }

            function simpleAutoHealer(tmpObj, value) {
                let pingHeal = function() {
                    return Math.max(0, 170 - window.pingTime);
                };
                let normalMS = 70;
                let goodMS = 125;
                let antiInsta = false;
                if (true) {
                    if (nears.length) {
                        if (value >= 20) {
                            judgeAtNextTick = true;
                        }
                        for (let i = 0; i < nears.length; i++) {
                            let nearEnemy = nears[i];
                            let findAttacker = [];
                            let checkAnti = value >= (tmpObj.skinIndex == 6 ? 25 : 10) && (nearEnemy.secondaryIndex == undefined || nearEnemy.primaryIndex == undefined ? true : nearEnemy.reloads[nearEnemy.primaryIndex] == 0);
                            if (checkAnti) {
                                antiInsta = true;
                            }
                        }
                        if (antiInsta) {
                            if (tmpObj.shameCount < tmpObj.dangerShame) {
                                for (let i = 0; i < applCxC(value); i++) {
                                    place(0, getAttackDir());
                                }
                            } else {
                                (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                                    for (let i = 0; i < applCxC(value); i++) {
                                        place(0, getAttackDir());
                                    }
                                }
                                                                                      , getEl("tickheal").checked ? 2 : pingHeal());
                            }
                        } else {
                            (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                                for (let i = 0; i < applCxC(value); i++) {
                                    place(0, getAttackDir());
                                }
                            }
                                                                                  , getEl("tickheal").checked ? 2 : pingHeal());
                        }
                        if (player.skinIndex == 11) {
                            if (value >= 30) {
                                instaC.isCounter = true;
                            }
                        }
                    } else {
                        (getEl("tickheal").checked ? setTickout : setTimeout)(()=>{
                            for (let i = 0; i < applCxC(value); i++) {
                                place(0, getAttackDir());
                            }
                        }
                                                                              , getEl("tickheal").checked ? 2 : pingHeal());
                    }
                }
            }
            // CALC DAMAGE:
            function checkCanInsta(nobull) {
                let totally = 0;
                if (player.alive) {
                    let primary = {
                        weapon: player.weapons[0],
                        variant: player.primaryVariant,
                        dmg: player.weapons[0] == undefined ? 0 : items.weapons[player.weapons[0]].dmg,
                    };
                    let secondary = {
                        weapon: player.weapons[1],
                        variant: player.secondaryVariant,
                        dmg: player.weapons[1] == undefined ? 0 : items.weapons[player.weapons[1]].Pdmg,
                    };
                    let bull = player.skins[7] && !nobull ? 1.5 : 1;
                    let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                    if (primary.weapon != undefined && player.reloads[primary.weapon] == 0) {
                        totally += primary.dmg * pV * bull;
                    }
                    if (secondary.weapon != undefined && player.reloads[secondary.weapon] == 0) {
                        totally += secondary.dmg;
                    }
                    if (player.skins[53] && player.reloads[53] == 0 && near.skinIndex != 22) {
                        totally += 25;
                    }
                    totally *= near.skinIndex == 6 ? 0.75 : 1;
                    return totally;
                }
                return 0;
            }

            function getDamageThreat(tmpObj) {
                tmpObj.instaThreat = 0;
                if (isTeam(tmpObj)) {
                    let primary = {
                        weapon: tmpObj.primaryIndex,
                        variant: tmpObj.primaryVariant,
                        dmg: tmpObj.primaryIndex == undefined ? 45 : items.weapons[tmpObj.primaryIndex].dmg,
                    };
                    let secondary = {
                        weapon: tmpObj.secondaryIndex,
                        variant: tmpObj.secondaryVariant,
                        dmg: tmpObj.secondaryIndex == undefined ? 50 : items.weapons[tmpObj.secondaryIndex].Pdmg,
                    };
                    let bull = tmpObj.skinIndex == 7 ? 1.5 : 1;
                    let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                    if (primary.weapon != undefined && tmpObj.reloads[primary.weapon] == 0) {
                        tmpObj.instaThreat += primary.dmg * pV * bull;
                    }
                    if (secondary.weapon != undefined && tmpObj.reloads[secondary.weapon] == 0) {
                        tmpObj.instaThreat += secondary.dmg;
                    }
                    if (tmpObj.reloads[53] === 0) {
                        tmpObj.instaThreat += 25;
                    }
                    tmpObj.instaThreat *= player.skinIndex == 6 ? 0.75 : 1;
                }
            }
            let predictDamage = 0;

            function guessDamagePrediction() {
                predictDamage = 0;
                if (enemy.length) {
                    if (near.dist2 <= 300) {
                        if (configs.antiBull2 > 0 && near.skinIndex == 11) {
                            predictDamage += items.weapons[player.weapons[0]].dmg * 0.45;
                        }
                        if (configs.antiBull2 > 0 && near.tailIndex == 21) {
                            predictDamage += items.weapons[player.weapons[0]].dmg * 0.25;
                        }
                        predictDamage *= player.skinIndex == 6 ? 0.75 : 1;
                        if ((ticks.tick - player.bTick) % config.serverUpdateRate === 0 && player.shameCount > 0) {
                            predictDamage += 5;
                            if (player.tailIndex == 13) {
                                predictDamage -= 3;
                            }
                        }
                    }
                }
            }
            // RENDER TRACER / CREDIT TO NEKOSAN:
            function addUser(tmpObj) {
                let center = {
                    x: screenWidth / 2,
                    y: screenHeight / 2,
                };
                let rad = UTILS.getDirect(tmpObj, player, 2, 2)
                let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x2 - tmpObj.x2, (player.y2 - tmpObj.y2) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                let dist = center.y * alpha;
                let tmpX = center.x + dist * Math.cos(rad) - 20 / 2;
                let tmpY = center.y + dist * Math.sin(rad) - 20 / 2;
                if (!getEl("enemyradar" + tmpObj.sid)) {
                    let addRadar = document.createElement("div");
                    addRadar.id = "enemyradar" + tmpObj.sid;
                    document.body.append(addRadar);
                    addRadar.style = `
                display: none;
                position: absolute;
                left: 0;
                top: 0;
                color: #fff;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px 0 10px 20px;
                border-color: #eb4034;
                `;
                }
                if (getEl("enemyradar" + tmpObj.sid)) {
                    getEl("enemyradar" + tmpObj.sid).style.left = tmpX + "px";
                    getEl("enemyradar" + tmpObj.sid).style.top = tmpY + "px";
                    getEl("enemyradar" + tmpObj.sid).style.display = !isTeam(tmpObj) ? "block" : "none";
                    getEl("enemyradar" + tmpObj.sid).style.opacity = alpha;
                    getEl("enemyradar" + tmpObj.sid).style.transform = "rotate(" + UTILS.toAng(rad) + "deg)";
                }
            }
            let enemy = [];
            let nears = [];
            let near = [];
            let millC = {
                x: undefined,
                y: undefined,
                size: function(size) {
                    return size * 1.45;
                },
                dist: function(size) {
                    return size * 1.8;
                },
                active: config.isSandbox ? true : false,
                count: 0,
            };
            let boostspikesss = false
            let placer4
            let songnamess = ["DJ Junggle Dutch","sound jedag jedug kece","DJ Enakeun V9","hensonn sahara x dxrk rave","we make it bounce jedag jedug","dj paijo mumet ndase","dj on the floor x gak tau","dj zerz softboy jedag jedug","dj tangkis dang","jantung bergoyang v2","DJ Ganteng / Cantik"]
            let chatsmods = false
            let spikeinsta = false
            let stopchatty = false
            let isianchat
            function spin() {
                let random = [2, 3, 4, 5];
                setTickout(() => {
                    spinner = true;
                    setTickout(() => {
                        spinner = false;
                    }, random[Math.floor(Math.random() * (random.length + 1))]);
                }, 1);
            }
            let stopMusket = 0;
            let doAgeInsta = false;
            let instaC = {
                wait: false,
                can: false,
                isTrue: false,
                nobull: false,
                isCounter: false,
                abCount: 0,
                changeType: function(type) {
                    instaC.wait = false;
                    instaC.isTrue = true;
                    if (type == "rev") {
                        autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 21, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    } else if (type == "nobull") {
                        autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(getEl("combat").value == "fz" ? 11 : 6, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    } else if (type == "normal") {
                        autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    } else if (type == "ph") {
                        autoAim = true;
                        buyEquip(53, 0);
                        buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                        setTickout(()=>{
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                            sendAutoGather();
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    } else if (type == "pm") {
                        autoAim = true;
                        buyEquip(53, 0);
                        buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                        setTickout(()=>{
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                            sendAutoGather();
                            setTickout(()=>{
                                selectWeapon(player.weapons[1]);
                                setTickout(()=>{
                                    sendAutoGather();
                                    instaC.isTrue = false;
                                    autoAim = false;
                                }, 1);
                            }, 1);
                        }, 1);
                    } else if (type == "onetick") {
                        if ([4, 5].includes(player.weapons[0]) && [9, 12, 13].includes(player.weapons[1])) {
                            instaC.isTrue = true;
                            autoAim = true;
                            setTickout(() => {
                                buyEquip(53, 0);
                                buyEquip(0, 1);
                                selectWeapon(player.weapons[1]);
                                sendAutoGather();
                                io.send("33", near.aim2);
                                setTickout(() => {
                                    buyEquip(7, 0);
                                    buyEquip(21 || 0, 1);
                                    selectWeapon(player.weapons[0]);
                                    io.send("33", near.aim2);
                                    setTickout(() => {
                                        instaC.isTrue = false;
                                        autoAim = false;
                                        io.send("33", null);
                                        io.send("33", isMoveDir);
                                        sendAutoGather();
                                        spin();
                                    }, 1);
                                }, 1);
                            }, 1);
                        }
                    } else if (type == "sm") {
                        autoAim = true;
                        buyEquip(53, 0);
                        buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            selectWeapon(player.weapons[1]);
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    } else {
                        setTimeout(()=>{
                            instaC.isTrue = false;
                            autoAim = false;
                        }, 50);
                    }
                },
                syncTry: function() {
                    if (player.weapons[1] == 15) {
                        instaC.isTrue = true;
                        io.send("2", near.aim2);
                        autoAim = true;
                        rangeBackup.push(near.dist2);
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(0, 1);
                        sendAutoGather();
                        setTickout(() => {
                            autoAim = false;
                            instaC.isTrue = false;
                            sendAutoGather();
                        }, 2);
                    }
                },

                syncpritry: function() {
                    autoAim = true;
                    instaC.isTrue = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                    sendAutoGather();
                    setTickout(()=>{
                        sendAutoGather();
                        instaC.isTrue = false;
                        autoAim = false;
                    }, 1);
                },

                zeroFrame: function() {
                    if ([4, 5].includes(player.weapons[0]) && [9, 12, 13].includes(player.weapons[1])) {
                        io.send("ch", "V 1");
                        instaC.isTrue = true;
                        autoAim = true;
                        place(4, near.aim2);
                        setTickout(() => {
                            buyEquip(53, 0);
                            buyEquip(0, 1);
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            io.send("33", near.aim2);
                            setTickout(() => {
                                buyEquip(7, 0);
                                buyEquip(21 || 0, 1);
                                selectWeapon(player.weapons[0]);
                                io.send("33", near.aim2);
                                setTickout(() => {
                                    instaC.isTrue = false;
                                    autoAim = true;
                                    io.send("33", null);
                                    io.send("33", isMoveDir);
                                    sendAutoGather();
                                    spin();
                                }, 1);
                            }, 1);
                        }, 1);
                    }
                },
                oneFrame: function() {
                    if ([4, 5].includes(player.weapons[0]) && [9, 12, 13].includes(player.weapons[1])) {
                        io.send("ch", "");
                        instaC.isTrue = true;
                        autoAim = true;
                        buyEquip(53, 0);
                        buyEquip(0, 1);
                        selectWeapon(player.weapons[1]);
                        sendAutoGather();
                        io.send("33", near.aim2);
                        setTickout(() => {
                            place(4, near.aim2);
                            setTickout(() => {
                                buyEquip(7, 0);
                                buyEquip(21 || 0, 1);
                                selectWeapon(player.weapons[0]);
                                io.send("33", near.aim2);
                                setTickout(() => {
                                    io.send("33", null);
                                    io.send("33", isMoveDir);
                                    sendAutoGather();
                                    instaC.isTrue = false;
                                    autoAim = false;
                                    spin();
                                }, 1);
                            }, 1);
                        }, 1);
                    }
                },

                phFrame: function() {
                    if (player.weapons[0] == 5 && player.weapons[1] == 10) {
                        io.send("ch", "");
                        instaC.isTrue = true;
                        autoAim = true;
                        buyEquip(53, 0);
                        buyEquip(0, 1);
                        selectWeapon(player.weapons[1]);
                        sendAutoGather();
                        io.send("33", near.aim2);
                        place(4, near.aim2);
                        setTickout(() => {
                            buyEquip(7, 0);
                            buyEquip(21 || 0, 1);
                            selectWeapon(player.weapons[0]);
                            io.send("33", near.aim2);
                            setTickout(() => {
                                instaC.isTrue = false;
                                autoAim = false;
                                io.send("33", null);
                                io.send("33", isMoveDir);
                                sendAutoGather();
                            }, 1);
                        }, 1);
                    }
                },

                zeroFramekatana: function() {
                    if (player.weapons[0] == 4 && player.weapons[1] == 9) {
                        io.send("ch", "");
                        instaC.isTrue = true;
                        autoAim = true;
                        place(4, near.aim2);
                        setTickout(() => {
                            buyEquip(53, 0);
                            buyEquip(0, 1);
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            io.send("33", near.aim2);
                            setTickout(() => {
                                buyEquip(7, 0);
                                buyEquip(21 || 0, 1);
                                selectWeapon(player.weapons[0]);
                                io.send("33", near.aim2);
                                setTickout(() => {
                                    place(2, near.aim2);
                                    instaC.isTrue = false;
                                    autoAim = false;
                                    io.send("33", null);
                                    io.send("33", isMoveDir);
                                    sendAutoGather();
                                    spin();
                                }, 1);
                            }, 1);
                        }, 1);
                    }
                },

                newinstadev: function() {
                    io.send("ch", "");
                    instaC.isTrue = true;
                    autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                    sendAutoGather();
                    setTickout(()=>{
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                        setTickout(()=>{
                            sendAutoGather();
                            place(2)
                            instaC.isTrue = false;
                            autoAim = false;
                            spin();
                        }, 1);
                    }, 1);
                },

                agesinstass: function() {
                    if (player.weapons[0] == 0 && player.age > 1) {
                        instaC.isTrue = true;
                        autoAim = true;
                        io.send("ch", "")
                        doAgeInsta = true;
                        buyEquip(7, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                        selectWeapon(player.weapons[0]);
                        sendAutoGather();
                        setTickout(()=>{
                            sendUpgrade(5);
                            buyEquip(7, 0);
                            buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                            selectWeapon(player.weapons[0]);
                            setTickout(()=>{
                                doAgeInsta = false;
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                            }, 1);
                        }, 1);
                    }
                },

                instabyeessa: function() {
                    io.send("ch", "insta by essa = on")
                    instaC.isTrue = true;
                    autoAim = true;
                    if (player.weapons[1] == 9 && player.age > 8) {
                        rangeBackup.push(near.dist2);
                        doAgeInsta = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        sendAutoGather();
                        setTickout(()=>{
                            sendUpgrade(12);
                            selectWeapon(player.weapons[1]);
                            setTickout(()=>{
                                sendUpgrade(15);
                                selectWeapon(player.weapons[1]);
                                setTickout(()=>{
                                    doAgeInsta = false;
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                        }, 1);
                    } else {
                        selectWeapon(player.weapons[1]);
                        if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                            buyEquip(53, 0);
                        } else {
                            buyEquip(20, 0);
                        }
                        buyEquip(11, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            sendAutoGather();
                        }, 2);
                    }
                    setTickout(()=>{
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 18, 1);
                        setTickout(()=>{
                            sendAutoGather();
                            instaC.isTrue = false;
                            autoAim = false;
                            spin();
                        }, 1);
                    }, 1);
                    instaC.isTrue = false;
                    autoAim = false;
                },

                counterType: function() {
                    instaC.isTrue = true;
                    autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 0 : 21, 1);
                    sendAutoGather();
                    setTickout(()=>{
                        if ((getEl("countertur").checked && player.reloads[53] == 0 && player.skins[53]) || (getEl("countersec").checked && player.reloads[player.weapons[1]] == 0 && player.weapons[1])) {
                            if (getEl("countersec").checked && player.reloads[player.weapons[1]] == 0 && player.weapons[1]) {
                                selectWeapon(player.weapons[1]);
                            }
                            if (getEl("countertur").checked && player.reloads[53] == 0 && player.skins[53]) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(6, 0);
                            }
                            buyEquip(getEl("combat").value == "ae" ? 11 : getEl("combat").value == "hans" ? 0 : 21, 1);
                            setTickout(()=>{
                                sendAutoGather();
                                instaC.isTrue = false;
                                autoAim = false;
                                spin();
                            }, 1);
                        } else {
                            sendAutoGather();
                            instaC.isTrue = false;
                            autoAim = false;
                        }
                    }, 1);
                },
                spikeTickType: function() {
                    instaC.isTrue = true;
                    autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(getEl("combat").value == "ae" ? 0 : getEl("combat").value == "hans" ? 21 : 18, 1);
                    sendAutoGather();
                    setTickout(()=>{
                        sendAutoGather();
                        instaC.isTrue = false;
                        autoAim = false;
                    }, 1);
                },
                rangeType: function() {
                    instaC.isTrue = true;
                    io.send("2", near.aim2);
                    autoAim = true;
                    if (player.weapons[1] == 9 && !middleclicck && player.age > 8) {
                        rangeBackup.push(near.dist2);
                        doAgeInsta = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        sendAutoGather();
                        setTickout(()=>{
                            sendUpgrade(12);
                            selectWeapon(player.weapons[1]);
                            setTickout(()=>{
                                if (getEl("modebow").value == "2"){
                                    sendUpgrade(13);
                                }else {
                                    sendUpgrade(15);
                                }
                                selectWeapon(player.weapons[1]);
                                setTickout(()=>{
                                    doAgeInsta = false;
                                    sendAutoGather();
                                    instaC.isTrue = false;
                                    autoAim = false;
                                }, 1);
                            }, 1);
                        }, 1);
                    } else {
                        selectWeapon(player.weapons[1]);
                        if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                            buyEquip(53, 0);
                        } else {
                            buyEquip(20, 0);
                        }
                        buyEquip(11, 1);
                        sendAutoGather();
                        setTickout(()=>{
                            sendAutoGather();
                            instaC.isTrue = false;
                            autoAim = false;
                            middleclicck = false
                        }, 2);
                    }
                },
            };
            let autoAim = false;
            let autos = {
                reloaded: false,
            };
            let traps = {
                in: false,
                aim: Number.MAX_VALUE,
                healths: 69,
            };
            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };

            function checkTestCoord(tmpObj) {
                let x = tmpObj.x2 - tmpObj.x1;
                let y = tmpObj.y2 - tmpObj.y1;
                tmpObj.x3 = tmpObj.x2 + x;
                tmpObj.y3 = tmpObj.y2 + y;
            }
            let oldXY = {
                x: undefined,
                y: undefined,
            };
            let autoQ = false;

            function isTeam(tmpObj) {
                return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
            }
            let turretEmp = 0;
            let waitTicks = [];
            let anti0Tick = 0;
            let syncCount = 0;
            let syncCountpole = 0;
            let nerdChat = ["Don't care", "didin't ask", "cry about it", "stay mad", "get real", "L", "mad seethe cope harder", "hoes mad", "basic", "skill issue", "ratio", "you fell off", "the audacity", "triggered", "any askers", "replled", "get a life", "ok and?", "cringe", "touch grass", "donowalled", "not based", "not funny didn’t laugh", "*you're", "grammar issues", "go outside", "get good", "reported", "ad hominem", "GG!", "ask deez", "ez clap", "straight cash", "ratio again", "final ratio", "problematic", "furry lover", "retard", "bad", "cry", "ez", "easy", "basic", "need hard", "so bad", "cringe", "get teacher"];
            let nerdSpam = false;
            let opebchat = false
            let hitCount = 0;
            let spinner = false;
            function combatType(type) {
                return getEl("combat").value == type;
            }
            function tmpObjDist(a, b) {
                return Math.hypot(a.y2-b.y2, a.x2-b.x2);
            }
            function Ti(data) {
                enemy = [];
                nears = [];
                near = [];
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                }
                if (ticks.tick % 300 === 0) {
                    if (getEl("visual").value == "fz") {
                        maxPing = window.pingTime;
                        minPing = window.pingTime;
                    }
                }
                ticks.delay = Date.now();
                var tmpTime = Date.now();
                for (let i = 0; i < players.length; ++i) {
                    players[i].forcePos = !players[i].visible;
                    players[i].visible = false;
                    if (getEl("enemyradar" + players[i].sid)) {
                        getEl("enemyradar" + players[i].sid).style.display = "none";
                    }
                }
                for (let i = 0; i < data.length; ) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = tmpObj.t2 === undefined ? tmpTime : tmpObj.t2;
                        tmpObj.t2 = tmpTime;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        checkTestCoord(tmpObj);
                        tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
                        tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
                        tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
                        tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
                        tmpObj.d1 = tmpObj.d2 === undefined ? data[i + 3] : tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.rt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        if (tmpObj == player) {
                            tmpObj.syncThreats = 0;
                            tmpObj.primaryIndex = tmpObj.weapons[0];
                            tmpObj.secondaryIndex = tmpObj.weapons[1];
                            (!millC.x || !oldXY.x) && (millC.x = oldXY.x = tmpObj.x2);
                            (!millC.y || !oldXY.y) && (millC.y = oldXY.y = tmpObj.y2);
                        }
                        if (tmpObj.weaponIndex < 9) {
                            if (tmpObj != player) {
                                tmpObj.primaryIndex = tmpObj.weaponIndex;
                            }
                            tmpObj.primaryVariant = tmpObj.weaponVariant;
                        } else if (tmpObj.weaponIndex > 8) {
                            if (tmpObj != player) {
                                tmpObj.secondaryIndex = tmpObj.weaponIndex;
                            }
                            tmpObj.secondaryVariant = tmpObj.weaponVariant;
                        }
                    }
                    i += 13;
                }
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj)=>{
                        ajaj();
                    });
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp)=>{
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                syncCount = 0;
                syncCountpole = 0;
                for (let i = 0; i < data.length; ) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (tmpObj.doTickUpdate) {
                            tmpObj.doTickUpdate = false;
                        }
                        if (!isTeam(tmpObj)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= (items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 3)) + (getEl("addictdist").checked && window.pingTime >= 90 ? (window.pingTime / 3) : 0)) {
                                nears.push(tmpObj);
                            }
                            if (getEl("visual").value == "cele" || getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                                addUser(tmpObj);
                            }
                        }
                        if (tmpObj.pCount > -1) {
                            if ((ticks.tick - tmpObj.bTick) % config.serverUpdateRate === 0) {
                                tmpObj.pCount--;
                            }
                        }
                        tmpObj.oldReloads[53] = tmpObj.reloads[53];
                        if (tmpObj.shooting[53]) {
                            tmpObj.shooting[53] = 0;
                            tmpObj.reloads[53] = 2500 - config.tickRate;
                            tmpObj.oldReloads[53] = tmpObj.reloads[53];
                            if (getEl("antitick").checked && !isTeam(tmpObj)) {
                                if (tmpObj.primaryIndex == 5 && tmpObj.primaryVariant >= 2 && tmpObj.dist2 >= 175 && tmpObj.dist2 <= 275) {
                                    anti0Tick = 2;
                                }
                            }
                        } else {
                            if (tmpObj.reloads[53] > 0) {
                                tmpObj.reloads[53] = Math.max(0, tmpObj.reloads[53] - config.tickRate);
                                if (tmpObj.reloads[53] <= 0) {
                                    let tmp = tmpObj;
                                    tmp.turretReloaded = true;
                                    setTickout(()=>{
                                        tmp.turretReloaded = false;
                                    }, 1);
                                }
                            }
                        }
                        tmpObj.oldReloads[tmpObj.primaryIndex == undefined ? tmpObj.weaponIndex : tmpObj.primaryIndex] = tmpObj.reloads[tmpObj.primaryIndex == undefined ? tmpObj.weaponIndex : tmpObj.primaryIndex];
                        tmpObj.oldReloads[tmpObj.secondaryIndex == undefined ? tmpObj.weaponIndex : tmpObj.secondaryIndex] = tmpObj.reloads[tmpObj.secondaryIndex == undefined ? tmpObj.weaponIndex : tmpObj.secondaryIndex];
                        if (tmpObj.gathering || tmpObj.shooting[1]) {
                            if (tmpObj.gathering) {
                                tmpObj.gathering = 0;
                                tmpObj.reloads[tmpObj.gatherIndex] = items.weapons[tmpObj.gatherIndex].speed * (tmpObj.skinIndex == 20 ? 0.78 : 1);
                                tmpObj.oldReloads[tmpObj.gatherIndex] = tmpObj.reloads[tmpObj.gatherIndex];
                                if (tmpObj != player && player.team && tmpObj.team == player.team && player.weapons[0] == 5 && tmpObj.gatherIndex == 5) {
                                    syncCountpole++;
                                }
                            }
                            if (tmpObj.shooting[1]) {
                                tmpObj.shooting[1] = 0;
                                tmpObj.reloads[tmpObj.shootIndex] = items.weapons[tmpObj.shootIndex].speed * (tmpObj.skinIndex == 20 ? 0.78 : 1);
                                tmpObj.oldReloads[tmpObj.shootIndex] = tmpObj.reloads[tmpObj.shootIndex];
                                if (tmpObj != player && player.team && tmpObj.team == player.team && player.weapons[1] == 15 && tmpObj.shootIndex == 15) {
                                    syncCount++;
                                }
                            }
                        } else {
                            if (tmpObj.buildIndex < 0) {
                                if (tmpObj.reloads[tmpObj.weaponIndex] > 0) {
                                    tmpObj.reloads[tmpObj.weaponIndex] = Math.max(0, tmpObj.reloads[tmpObj.weaponIndex] - config.tickRate);
                                    if (tmpObj.weaponIndex == tmpObj.primaryIndex) {
                                        if (tmpObj.reloads[tmpObj.primaryIndex] <= 0) {
                                            if (tmpObj == player) {
                                                configs.antiBull2++;
                                                setTickout(()=>{
                                                    configs.antiBull2--;
                                                }, 1);
                                            } else {
                                                if (!isTeam(tmpObj) && tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex ? tmpObj.primaryIndex : 5].range + player.scale * 1.8 + window.pingTime / 2) {
                                                    configs.antiBull++;
                                                    setTickout(()=>{
                                                        configs.antiBull--;
                                                    }, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        getDamageThreat(tmpObj);
                    }
                    i += 13;
                }
                myConfig.x = player.x2;
                myConfig.y = player.y2;
                if (ticks.tick % 24 === 0) {
                    myConfig.sync = true;
                } else {
                    myConfig.sync = false;
                }
                if (enemy.length) {
                    near = enemy.sort(function(tmp1, tmp2) {
                        return (UTILS.getDist(tmp1, player, 2, 2) - UTILS.getDist(tmp2, player, 2, 2));
                    })[0];
                    myNearAim = function(o) {
                        return UTILS.getDirect(near, o, 2, 0);
                    };
                } else {
                    myNearAim = function(nothing) {
                        return undefined;
                    };
                }
                try {
                    if (getEl("spin").checked) {
                        spinner = true;
                    } else spinner = false;
                    nears.forEach((e)=>{
                        if (e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0 && e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0) {
                            player.syncThreats++;
                        }
                    });
                    turretEmp = 0;
                    gameObjects.filter((e)=>e.active && e.doUpdate).forEach((tmp)=>{
                        if (tmp.shootted) {
                            tmp.shootted = 0;
                            tmp.shootReload = 2200 - config.tickRate;
                        } else {
                            if (tmp.shootReload > 0) {
                                tmp.shootReload = Math.max(0, tmp.shootReload - config.tickRate);
                                if (tmp.shootReload <= 0) {
                                    tmp.shootReload = 2200;
                                    if (player.sid != tmp.owner.sid && !findAllianceBySid(tmp.owner.sid) && UTILS.getDist(tmp, player, 0, 2) <= 735) {
                                        turretEmp++;
                                    }
                                }
                            }
                        }
                    }
                                                                           );
                    if ((checkCanInsta(true) >= 100 ? checkCanInsta(true) : checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100) && near.dist2 <= items.weapons[player.weapons[1] == 10 && player.weapons[0] == 5 ? player.weapons[0]: player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && instaC.wait && !instaC.isTrue && !configs.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && player.reloads[53] == 0) {
                        if (checkCanInsta(true) >= 100) {
                            instaC.nobull = true;
                        } else {
                            instaC.nobull = false;
                        }
                        instaC.can = true;
                    } else {
                        instaC.can = false;
                    }
                    guessDamagePrediction();
                    if (ticks.manage[ticks.tick]) {
                        ticks.manage[ticks.tick].forEach((doit)=>{
                            doit();
                        });
                    }
                    if (player.alive) {
                        if (player.syncThreats >= 2 && getEl("antisync").checked && !antiSync) {
                            antiSyncHealing(3);
                        }
                        if (judgeAtNextTick) {
                            judgeAtNextTick = false;
                            if (getEl("soldierempanti").checked && enemy.length && near.reloads[53] <= config.tickRate && (near.secondaryIndex != 10 && near.secondaryIndex != 11 && near.secondaryIndex != 14)) {
                                doEmpAntiInsta = true;
                            }
                        }
                        if (getEl("autoq").checked && (doAutoQ || getEl("evautoq").checked)) {
                            getEl("healer").innerHTML = "Healer: autoQ";
                            if (player.shameCount < 4 && near.dist2 <= 300 && near.reloads[near.primaryIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                                autoQ = true;
                                place(0, getAttackDir());
                            } else {
                                if (autoQ) {
                                    place(0, getAttackDir());
                                }
                                autoQ = false;
                            }
                        } else {
                            autoQ = false;
                            if (nears.length >= 2) {
                                getEl("healer").innerHTML = "Healer: " + nears.length + "v1";
                            } else {
                                getEl("healer").innerHTML = "Healer: " + (window.pingTime <= 80 ? "Low Ping" : "High Ping");
                            }
                        }
                        if (syncCount >= parseInt(getEl("synccount").value)) {
                            if (getEl("sync").checked) {
                                doSync = true;
                            }
                        }
                        if (syncCountpole >= parseInt(getEl("synccount").value)) {
                            if (getEl("syncpole").checked) {
                                dosyncpole = true;
                            }
                        }
                        if (clicks.middle || doSync || withSync) {
                            if (doSync) {
                                instaC.syncTry()
                                doSync = false;
                            }
                            if (withSync) {
                                withSync = false;
                            }
                            if (!instaC.isTrue && !instaC.can && player.reloads[player.weapons[1]] == 0) {
                                middleclicck = true
                                instaC.rangeType();
                            }
                        }
                        if (dosyncpole){
                            instaC.syncpritry();
                            dosyncpole = false;
                        }
                        if (instaC.can) {
                            instaC.changeType(getEl("instamode").value == "2" ? "onetick": player.weapons[1] == 10 && player.weapons[0] == 5 ? "ph" : getEl("revturretins").checked && player.weapons[1] == 15 ? "pm" : getEl("alwaysrev").checked ? "rev": player.weapons[1] == 10 ? "rev" : instaC.nobull ? "nobull" : "normal");
                            if (getEl("instamode").value == "2") {
                                io.send("ch", "insta mode v2")
                            }else {
                                io.send("ch", "insta mode v1")
                            }
                        }
                        if (instaC.isCounter) {
                            instaC.isCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.counterType();
                            }
                        }
                        if (waitSpikeTick) {
                            waitSpikeTick = false;
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0) {
                                instaC.spikeTickType();
                            }
                        }
                        // MOUSE EVENT:
                        if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue && !instaC.can) {
                            if (player.weaponIndex != (clicks.right && getEl("grindsec").checked && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) {
                                if (getEl("weaponsautoch").checked) {
                                    selectWeapon(clicks.right && getEl("grindsec").checked && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                }
                            }
                            if (player.reloads[clicks.right && getEl("grindsec").checked && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                io.send("7", 1);
                                setTickout(()=>{
                                    io.send("7", 1);
                                }, 1);
                            }
                        }
                        if (gameObjects.length) {
                            nearSpike = [];
                            nearSpike = gameObjects.filter((tmp)=>tmp.dmg && player.sid != tmp.owner.sid && !findAllianceBySid(tmp.owner.sid) && tmp.active && UTILS.getDist(tmp, player, 0, 2) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return (UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2));
                            })[0];
                            let trap1 = gameObjects.filter((e)=>e.trap && e.active).sort(function(a, b) {
                                return (UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2));
                            })[0];
                            if (trap1) {
                                traps.aim = UTILS.getDirect(trap1, player, 0, 2);
                                if (player.sid != trap1.owner.sid && !findAllianceBySid(trap1.owner.sid) && Math.hypot(trap1.y - player.y2, trap1.x - player.x2) <= 50 && getEl("abactive").checked) {
                                    traps.in = true;
                                    traps.healths = trap1.buildHealth;
                                    if (!instaC.isTrue && !clicks.middle && !clicks.left && !clicks.right) {
                                        if (player.weaponIndex != player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) {
                                            selectWeapon(trap1.buildHealth > items.weapons[player.weapons[0]].dmg && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                        }
                                        if (player.reloads[trap1.buildHealth > items.weapons[player.weapons[0]].dmg && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && (trap1.buildHealth > items.weapons[player.weapons[0]].dmg && player.weapons[1] == 10 ? true : !configs.waitHit)) {
                                            configs.waitHit = true;
                                            io.send("7", 1);
                                            setTickout(()=>{
                                                io.send("7", 1);
                                                configs.waitHit = false;
                                            }, 1);
                                        }
                                    }
                                } else {
                                    traps.in = false;
                                }
                            } else {
                                traps.in = false;
                            }
                        } else {
                            traps.in = false;
                        }
                        // RELOADS:
                        if (!instaC.isTrue && player.weapons[1] && !clicks.left && !clicks.right && !traps.in && getEl("weaponsautoch").checked) {
                            if ((player.weapons[0] == 3 || player.weapons[0] == 4 || player.weapons[0] == 5) && (player.weapons[1] == 10 || player.weapons[1] == 14)) {
                                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                    if (!autos.reloaded) {
                                        autos.reloaded = true;
                                        if (player.weaponIndex != player.weapons[1]) {
                                            selectWeapon(player.weapons[1]);
                                        }
                                    }
                                } else {
                                    autos.reloaded = false;
                                    if (player.reloads[player.weapons[0]] > 0) {
                                        if (player.weaponIndex != player.weapons[0]) {
                                            selectWeapon(player.weapons[0]);
                                        }
                                    } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                        if (player.weaponIndex != player.weapons[1]) {
                                            selectWeapon(player.weapons[1]);
                                        }
                                    }
                                }
                            } else {
                                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                    if (!autos.reloaded) {
                                        autos.reloaded = true;
                                        if (player.weaponIndex != player.weapons[0]) {
                                            selectWeapon(player.weapons[0]);
                                        }
                                    }
                                } else {
                                    autos.reloaded = false;
                                    if (player.reloads[player.weapons[1]] > 0) {
                                        if (player.weaponIndex != player.weapons[1]) {
                                            selectWeapon(player.weapons[1]);
                                        }
                                    } else if (player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] > 0) {
                                        if (player.weaponIndex != player.weapons[0]) {
                                            selectWeapon(player.weapons[0]);
                                        }
                                    }
                                }
                            }
                        }
                        // PLACES:
                        if (places.slot0 && !autoQ) {
                            place(0, getAttackDir());
                        } else if (places.slot2) {
                            place(2, getAttackDir());
                        } else if (places.slot4) {
                            place(4, getAttackDir());
                            if (boostspikesss){
                                place(2, getAttackDir() + 300)
                                place(2, getAttackDir() - 300)
                            }
                        } else if (places.slot5) {
                            place(5, getAttackDir());
                        }
                        if (!instaC.isTrue && (getEl("abplace").checked ? true : !traps.in)) {
                            autoPlace();
                        }
                        try {
                            let parsed
                            parsed = parseFloat(getEl("placeconfig").value);
                            let objectSize = millC.size(items.list[player.items[parsed]].scale);
                            let objectDist = millC.dist(items.list[player.items[parsed]].scale);
                            if (UTILS.getDist(millC, player, 0, 2) > objectDist + items.list[player.items[parsed]].placeOffset) {
                                if (millC.active) {
                                    let millDir = UTILS.getDirect(millC, player, 0, 2);
                                    let plusXY = {
                                        x: millC.x,
                                        y: millC.y
                                    };
                                    let Boom = UTILS.getDirect(plusXY, player, 0, 2);
                                    checkPlace(parsed, Boom + UTILS.toRad(objectSize));
                                    checkPlace(parsed, Boom - UTILS.toRad(objectSize));
                                    checkPlace(parsed, Boom);
                                    millC.count = Math.max(0, millC.count - 1);
                                }
                                millC.x = player.x2;
                                millC.y = player.y2;
                            }
                        } catch (e) {}
                        // EXTRA:
                        if (storeMenu.style.display != "block" && !instaC.isTrue) {
                            // Wow This Is Real Left Right:
                            if (clicks.left || clicks.right) {
                                changeHat("click");
                                changeAcc("click");
                            } else {
                                if (traps.in) {
                                    changeHat("trap");
                                    changeAcc("trap");
                                } else {
                                    changeHat("normal");
                                    changeAcc("normal");
                                }
                            }
                        }
                        // SEND DIR:
                        if (!places.slot0 && !places.slot2 && !places.slot4 && !places.slot5 && !autoQ) {
                            let atckDir = getAttackDir();
                            if (player.dir !== atckDir) {
                                lessDir = atckDir;
                                io.send("2", atckDir);
                            }
                        }
                        if (doEmpAntiInsta) {
                            doEmpAntiInsta = false;
                        }
                        if (anti0Tick > 0) {
                            anti0Tick--;
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
                if (autoZoom) {
                    if (near.dist2 <= 1000) {
                        resetZoom();
                    } else {
                        zoomVision();
                    }
                } else {
                    resetZoom();
                }
            }
            function setTickout(doo, timeout) {
                if (!ticks.manage[ticks.tick + timeout]) {
                    ticks.manage[ticks.tick + timeout] = [doo];
                } else {
                    ticks.manage[ticks.tick + timeout].push(doo);
                }
            }

            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            // AUTO PLACE:
            function autoPlace() {
                let nearObj = [];
                let randomDir = Math.random() * Math.PI * 2;
                if (gameObjects.length && enemy.length && getEl("autoplc").checked) {
                    let nearsa = {
                        inTrap: false,
                    };
                    nearObj = gameObjects.filter((e)=>e.trap).sort(function(a, b) {
                        return (UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                    })[0];
                    if (nearObj) {
                        if (!(player.sid != nearObj.owner.sid && !findAllianceBySid(nearObj.owner.sid)) && UTILS.getDist(nearObj, near, 0, 2) <= 70 && nearObj.active) {
                            nearsa.inTrap = true;
                        } else {
                            nearsa.inTrap = false;
                        }
                        if (near.dist2 <= 300) {
                            if (nearsa.inTrap || near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8) {
                                if (near.dist2 <= 225) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                                        checkPlace(2, near.aim2 + i);
                                    }
                                } else {
                                    for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                        checkPlace(2, near.aim2 + i);
                                    }
                                }
                            } else {
                                if (player.items[4] == 15) {
                                    if (UTILS.getDist(oldXY, player, 0, 2) >= 125) {
                                        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                            checkPlace(4, randomDir + i);
                                        }
                                        oldXY.x = player.x2;
                                        oldXY.y = player.y2;
                                    }
                                }
                            }
                        }
                    } else {
                        if (near.dist2 <= 400) {
                            if (player.items[4] == 15) {
                                checkPlace(4, near.aim2);
                            }
                        }
                    }
                }
            }
            // EQUIP HATS:
            function biomeGear() {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    buyEquip(31, 0);
                } else {
                    if (isMoveDir == undefined && (getEl("combat").value == "zyenith" || getEl("combat").value == "hans" || getEl("combat").value == "me")) {
                        buyEquip(6, 0);
                    } else {
                        if (player.y2 <= config.snowBiomeTop) {
                            buyEquip(15, 0);
                        } else {
                            buyEquip(12, 0);
                        }
                    }
                }
            }

            function safeWeapon1() {
                return (near.primaryIndex == 0 || near.primaryIndex == 6 || near.primaryIndex == 7 || near.primaryIndex == 8);
            }
            function safeWeapon2() {
                return (near.secondaryIndex == 9 || near.secondaryIndex == 10 || near.secondaryIndex == 11 || near.secondaryIndex == 14);
            }
            function changeHat(value) {
                if (value == "normal") {
                    if (anti0Tick > 0) {
                        buyEquip(6, 0);
                    } else {
                        if ((getEl("bulltick").checked && player.shameCount > 0 && (ticks.tick - player.bTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || reSyncBull) {
                            buyEquip(7, 0);
                        } else {
                            if (getEl("combat").value == "ae") {
                                buyEquip(6, 0);
                            } else if (getEl("combat").value == "fz") {
                                if (turretEmp > 0 || doEmpAntiInsta) {
                                    buyEquip(22, 0);
                                } else {
                                    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                        buyEquip(31, 0);
                                    } else {
                                        if (enemy.length) {
                                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                if (near.primaryIndex != undefined && near.reloads[near.primaryIndex] == 0 && near.secondaryIndex != undefined && near.reloads[near.secondaryIndex] == 0 && player.reloads[player.weapons[0]] <= config.tickRate && player.reloads[player.weapons[1]] == 0 && player.weapons[0] != 7 && player.weapons[0] != 8 && near.primaryIndex != 7 && near.primaryIndex != 8) {
                                                    buyEquip(11, 0);
                                                } else {
                                                    if (safeWeapon1() && safeWeapon2()) {
                                                        buyEquip(26, 0);
                                                    } else {
                                                        buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                    }
                                                }
                                            } else {
                                                biomeGear();
                                            }
                                        } else {
                                            biomeGear();
                                        }
                                    }
                                }
                            } else if (getEl("combat").value == "me") {
                                if (turretEmp > 0 || doEmpAntiInsta) {
                                    buyEquip(22, 0);
                                } else {
                                    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                        buyEquip(31, 0);
                                    } else {
                                        if (enemy.length) {
                                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                if (configs.antiBull > 0 && player.weapons[0] != 7) {
                                                    buyEquip(11, 0);
                                                } else {
                                                    buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                }
                                            } else {
                                                biomeGear();
                                            }
                                        } else {
                                            biomeGear();
                                        }
                                    }
                                }
                            } else {
                                if (turretEmp > 0 || doEmpAntiInsta) {
                                    buyEquip(22, 0);
                                } else {
                                    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                        buyEquip(31, 0);
                                    } else {
                                        if (enemy.length) {
                                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                if (configs.antiBull > 0 && player.weapons[0] != 7) {
                                                    buyEquip(11, 0);
                                                } else {
                                                    buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                }
                                            } else {
                                                biomeGear();
                                            }
                                        } else {
                                            biomeGear();
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (value == "click") {
                    if (anti0Tick > 0) {
                        buyEquip(6, 0);
                    } else {
                        if ((getEl("bulltick").checked && player.shameCount > 0 && (ticks.tick - player.bTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || reSyncBull) {
                            buyEquip(7, 0);
                        } else {
                            if (clicks.left && player.reloads[player.weapons[0]] == 0) {
                                buyEquip(7, 0);
                            } else if (clicks.right && player.reloads[(getEl("grindsec").checked && player.weapons[1] == 10) ? player.weapons[1] : player.weapons[0]] == 0) {
                                buyEquip(40, 0);
                            } else {
                                if (getEl("combat").value == "ae") {
                                    buyEquip(6, 0);
                                } else if (getEl("combat").value == "fz") {
                                    if (turretEmp > 0 || doEmpAntiInsta) {
                                        buyEquip(22, 0);
                                    } else {
                                        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                            buyEquip(31, 0);
                                        } else {
                                            if (near.dist2 <= 500) {
                                                if (safeWeapon1() && safeWeapon2()) {
                                                    buyEquip(26, 0);
                                                } else {
                                                    buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                }
                                            } else {
                                                biomeGear();
                                            }
                                        }
                                    }
                                } else if (getEl("combat").value == "me") {
                                    if (turretEmp > 0 || doEmpAntiInsta) {
                                        buyEquip(22, 0);
                                    } else {
                                        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                            buyEquip(31, 0);
                                        } else {
                                            if (clicks.left && configs.antiBull > 0 && player.weapons[0] != 7) {
                                                buyEquip(11, 0);
                                            } else {
                                                buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                            }
                                        }
                                    }
                                } else {
                                    if (turretEmp > 0 || doEmpAntiInsta) {
                                        buyEquip(22, 0);
                                    } else {
                                        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                            buyEquip(31, 0);
                                        } else {
                                            if (clicks.left && configs.antiBull > 0 && player.weapons[0] != 7) {
                                                buyEquip(11, 0);
                                            } else {
                                                buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (value == "trap") {
                    if (anti0Tick > 0) {
                        buyEquip(6, 0);
                    } else {
                        if ((getEl("bulltick").checked && player.shameCount > 0 && (ticks.tick - player.bTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || reSyncBull) {
                            buyEquip(7, 0);
                        } else {
                            if (traps.healths > items.weapons[player.weapons[0]].dmg && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                buyEquip(40, 0);
                            } else {
                                if (getEl("combat").value == "fz") {
                                    if (turretEmp > 0 || doEmpAntiInsta) {
                                        buyEquip(22, 0);
                                    } else {
                                        if (near.dist2 <= 300) {
                                            if ((safeWeapon1() && safeWeapon2()) || (near.primaryIndex == 5 && near.dist2 >= 175)) {
                                                buyEquip(26, 0);
                                            } else {
                                                buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                            }
                                        } else {
                                            biomeGear();
                                        }
                                    }
                                } else if (getEl("combat").value == "hans") {
                                    if (turretEmp > 0 || doEmpAntiInsta || near.secondaryIndex == 10) {
                                        buyEquip(22, 0);
                                    } else {
                                        buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                    }
                                } else {
                                    if (turretEmp > 0 || doEmpAntiInsta || near.dist2 > 300) {
                                        buyEquip(22, 0);
                                    } else {
                                        buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function changeAcc(value) {
                if (value == "normal") {
                    if (getEl("combat").value == "ae") {
                        buyEquip(11, 1);
                    } else {
                        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                            buyEquip(11, 1);
                        } else {
                            if (enemy.length) {
                                if (getEl("combat").value == "fz") {
                                    if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                        if (near.primaryIndex != undefined && near.reloads[near.primaryIndex] == 0 && near.secondaryIndex != undefined && near.reloads[near.secondaryIndex] == 0 && player.reloads[player.weapons[0]] <= config.tickRate && player.reloads[player.weapons[1]] == 0 && player.weapons[0] != 7 && player.weapons[0] != 8 && near.primaryIndex != 7 && near.primaryIndex != 8) {
                                            buyEquip(21, 1);
                                        } else {
                                            if (configs.antiBull > 0) {
                                                buyEquip(21, 1);
                                            } else {
                                                if ((ticks.tick - player.bTick) % config.serverUpdateRate === 0) {
                                                    buyEquip(13, 1);
                                                } else {
                                                    buyEquip(11, 1);
                                                }
                                            }
                                        }
                                    } else {
                                        buyEquip(11, 1);
                                    }
                                } else {
                                    if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                        if (configs.antiBull > 0) {
                                            buyEquip(21, 1);
                                        } else {
                                            buyEquip(11, 1);
                                        }
                                    } else {
                                        buyEquip(11, 1);
                                    }
                                }
                            } else {
                                buyEquip(11, 1);
                            }
                        }
                    }
                } else if (value == "click") {
                    if (getEl("combat").value == "ae") {
                        if (clicks.left) {
                            buyEquip(0, 1);
                        } else if (clicks.right) {
                            buyEquip(11, 1);
                        }
                    } else if (getEl("combat").value == "fz") {
                        if (configs.antiBull > 0) {
                            buyEquip(21, 1);
                        } else {
                            if (clicks.left && player.reloads[player.weapons[0]] == 0) {
                                buyEquip(near.dist2 <= 300 ? 18 : 0, 1);
                            } else if (clicks.right && player.reloads[(getEl("grindsec").checked && player.weapons[1] == 10) ? player.weapons[1] : player.weapons[0]] == 0) {
                                buyEquip(near.dist2 <= 300 ? 18 : 11, 1);
                            } else {
                                if ((ticks.tick - player.bTick) % config.serverUpdateRate === 0) {
                                    buyEquip(near.dist2 <= 500 ? 13 : 11, 1);
                                } else {
                                    buyEquip(11, 1);
                                }
                            }
                        }
                    } else {
                        buyEquip(21, 1);
                    }
                    if (spikeinsta){
                        if (getEl("modeinspi").value == 1) {
                            place(2, getAttackDir())
                        }else if (getEl("modeinspi").value == 2) {
                            place(2, getAttackDir() + 150)
                            place(2, getAttackDir() - 150)
                        }else if (getEl("modeinspi").value == 3) {
                            place(4, getAttackDir() + 150)
                            place(2, getAttackDir() - 150)
                        }
                        if (!getEl("alwayspikess").checked) {
                            spikeinsta = false
                        }
                        getEl("instaspiketrue").textContent = `Spike insta: ${spikeinsta}`
                    }
                } else if (value == "trap") {
                    if (getEl("combat").value == "ae") {
                        buyEquip(0, 1);
                    } else if (getEl("combat").value == "hans") {
                        buyEquip(0, 1);
                    } else if (getEl("combat").value == "fz") {
                        if (configs.antiBull > 0) {
                            buyEquip(21, 1);
                        } else {
                            if (traps.healths > items.weapons[player.weapons[0]].dmg && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                buyEquip(near.dist2 <= 275 ? 18 : 11, 1);
                            } else {
                                if (near.dist2 <= 300) {
                                    if (instaC.wait) {
                                        buyEquip(21, 1);
                                    } else {
                                        if ((ticks.tick - player.bTick) % config.serverUpdateRate === 0) {
                                            buyEquip(13, 1);
                                        } else {
                                            buyEquip(11, 1);
                                        }
                                    }
                                } else {
                                    buyEquip(11, 1);
                                }
                            }
                        }
                    } else {
                        if (configs.antiBull > 0) {
                            buyEquip(21, 1);
                        } else {
                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                buyEquip(21, 1);
                            } else {
                                buyEquip(11, 1);
                            }
                        }
                    }
                }
            }
            // FIND OBJECTS BY ID/SID:
            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS)=>THIS.id === tmp);
            }

            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS)=>THIS.sid === tmp);
            }

            function findPlayerByID(id) {
                return findID(players, id);
            }

            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }

            function findAIBySID(sid) {
                return findSID(ais, sid);
            }

            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }

            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS)=>THIS === sid) : null;
            }
            // PING:
            var lastPing = -1;
            var maxPing = NaN;
            var minPing = NaN;
            var pingCount = 0;
            var doAutoQ = false;
            let wkwkwkwk = 0
            let asdasd = ["PrO-Client-_", "rO-Client-_-", "O-Client-_-P", "-Client-_-Pr", "Client-_-PrO", "lient-_-PrO-", "ient-_-PrO-C", "ent-_-PrO-Cl", "nt-_-PrO-Cli", "t-_-PrO-Clie", "-_-PrO-Clien", "_-PrO-Client", "-PrO-Client-"]
            let haghaghag = [".", "..", "..."]
            let cihuycom = [".","-","+","_"]
            let wakwakwak = ["A", "B", "C", "D"]
            let igaga = 0
            let modetyping

            function pingSocketResponse() {
                modetyping = getEl("typengtypi").value
                if (getEl("chattypingsss").checked && chatHolder.style.display == "block") {
                    if (!stopchatty) {
                        if (igaga == 3 && modetyping == "1") {
                            igaga = 0
                        }else if (igaga == 4 && modetyping == "2"){
                            igaga = 0
                        }else if (igaga == 4 && modetyping == "3"){
                            igaga = 0
                        }
                        if (modetyping == "1"){
                            io.send("ch", getEl("chattypingtext").value + haghaghag[igaga])
                        }else if (modetyping == "2"){
                            io.send("ch", getEl("chattypingtext").value + " " + cihuycom[igaga])
                        }else if (modetyping == "3"){
                            io.send("ch", getEl("chattypingtext").value + "-" + wakwakwak[igaga])
                        }
                        igaga ++
                    }
                }
                if (chatsmods) {
                    if (wkwkwkwk == 13) {
                        wkwkwkwk = 0
                    }
                    io.send("ch", asdasd[wkwkwkwk])
                    wkwkwkwk ++
                }
                if (stopchatty && chatHolder.style.display == "none") {
                    if (isianchat == null){
                        io.send("ch", "[canceled]")
                    }else {
                        sendChat(isianchat);
                    }
                    stopchatty = false
                }
                var pingTime = Date.now() - lastPing;
                window.pingTime = pingTime;
                pingCount++;
                if (pingTime > maxPing || isNaN(maxPing)) {
                    maxPing = pingTime;
                }
                if (pingTime < minPing || isNaN(minPing)) {
                    minPing = pingTime;
                }
                if (getEl("visual").value == "zeph") {
                    pingDisplay.innerText = "Ping: " + pingTime + " ms | FPS: " + currentFPS + " frames";
                } else if (getEl("visual").value == "hans") {
                    pingDisplay.innerText = "Ping: " + pingTime + " ms | FPS: " + currentFPS + " frames";
                } else {
                    pingDisplay.innerText = "Ping: " + pingTime + " ms";
                }
                if (pingTime >= 90) {
                    doAutoQ = true;
                } else {
                    doAutoQ = false;
                }
            }
            pingDisplay.style.display = "none";
            document.body.appendChild(pingDisplay);

            function pingSocket() {
                lastPing = Date.now();
                io.send("pp");
            }
            // SERVER SHUTDOWN NOTICE:
            function serverShutdownNotice(countdown) {
                if (countdown < 0)
                    return;
                var minutes = Math.floor(countdown / 60);
                var seconds = countdown % 60;
                seconds = ("0" + seconds).slice(-2);
                shutdownDisplay.innerText = "Server restarting in " + minutes + ":" + seconds;
                shutdownDisplay.hidden = false;
            }
            // UPDATE & ANIMATE:
            window.requestAnimFrame = (function() {
                return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
                       );
            }
                                      )();
            // DAY CYCLE MANAGER:
            let dayCycle = false;
            let dayColors = {
                snow: "#fff",
                river: "#91b2db",
                grass: "#b6db66",
                desert: "#dbc666",
            };
            let nightColors = {
                snow: "#e6e6e6",
                river: "#78a1d3",
                grass: "#8dba2c",
                desert: "#d3b945",
            };
            setInterval(()=>{
                dayCycle = !dayCycle;
            }
                        , 39000 * 2);
            // LMFAO:
            var mStatus = document.createElement("div");
            mStatus.id = "status";
            mStatus.style.position = "absolute";
            mStatus.style.color = "#e6e6fa";
            mStatus.style.font = "15px Hammersmith One";
            mStatus.style.top = "40px";
            mStatus.style.left = "40px";
            mStatus.style.display = "none";
            mStatus.textAlign = "right";
            document.body.appendChild(mStatus);
            let currentFPS = 0;
            let FPSTimer = 0;
            let runAtFirst = true;
            let autoMusic = false;
            let hatELs = {
                6: true,
                7: true,
                40: true,
                22: true,
                15: true
            };
            mStatus.innerHTML = `
                <style>
                .sizing {
                    font-size: 15px;
                }
                .mod {
                    font-size: 15px;
                    display: inline-block;
                }
                .augh {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-size: cover;
                    background-color: #fff;
                    margin-right: -2.5px;
                    opacity: 0.4;
                }
                </style>
                <div id = "uehmod" class = "sizing" style = "display: block;">
                Ping: <div id = "pingFps" class = "mod">0</div></br>
                InstaStatus: [<div id = "instaStatus" class = "mod">0</div>]</br>
                Ticks | Lags: [<div id = "tickLag" class = "mod">0</div>]</br>
                Packet: <div id = "packetStatus" class = "mod">0</div></br>
                <div id = "nearEnemys" class = "mod">0</div></br>
                </div><div id = "fzmod" class = "sizing" style = "display: none;">
                Auto-Insta: <div id = "autoInsta1" class = "mod">0</div></br>
                Damage Prediction: <div id = "dmgPredict" class = "mod">0</div></br>
                Turrets that can hit you: <div id = "turCanHit" class = "mod">0</div></br>
                </div><div id = "zyenithmod" class = "sizing" style = "display: none;">

                </div><div id = "celemod" class = "sizing" style = "display: none;">
                Auto-Insta: <div id = "autoInsta2" class = "mod">0</div></br>
                EAB: {<div id = "eabStatus" class = "mod">0</div>}</br>
                Music: <div id = "musicStatus" class = "mod">0</div></br>
                AdvPlacer: <div id = "millStatus" class = "mod">0</div></br>
                </div>
                `;
            function doUpdate() {
                now = Date.now();
                delta = now - lastUpdate;
                lastUpdate = now;
                FPSTimer++;
                if (runAtFirst) {
                    runAtFirst = false;
                    setInterval(()=>{
                        currentFPS = FPSTimer;
                        FPSTimer = 0;
                    }
                                , 1000);
                }
                updateGame();
                requestAnimFrame(doUpdate);
                if (player) {
                    if (getEl("visual").value == "me") {
                        getEl("instaStatus").innerHTML = [instaC.wait, instaC.isTrue, UTILS.fixTo(checkCanInsta(false), 2)].join(", ");
                        getEl("pingFps").innerHTML = `${window.pingTime}ms | Fps: ${currentFPS}`;
                        getEl("tickLag").innerHTML = ticks.time;
                        getEl("packetStatus").innerHTML = secPacket;
                        getEl("nearEnemys").innerHTML = nears.length ? "cEnemy: " + nears.length : "";
                    } else if (getEl("visual").value == "fz") {
                        getEl("autoInsta1").innerHTML = (instaC.wait ? "on" : "off").toUpperCase();
                        getEl("dmgPredict").innerHTML = predictDamage;
                        getEl("turCanHit").innerHTML = turretEmp;
                    } else if (getEl("visual").value == "zyenith") {
                        getEl("autoInsta2").innerHTML = (instaC.wait ? "on" : "off").toUpperCase();
                        getEl("eabStatus").innerHTML = earlyAutoBreak.start ? [`hit:${earlyAutoBreak.hit}`, `miss:${earlyAutoBreak.miss}`, ].join(",") : "";
                        getEl("musicStatus").innerHTML = (autoMusic ? "on" : "off").toUpperCase();
                        getEl("millStatus").innerHTML = (millC.active ? "on" : "off").toUpperCase();
                    }
                }
            }
            // START GAME:
            function startGame() {
                bindEvents();
                loadIcons();
                loadingText.style.display = "none";
                menuCardHolder.style.display = "block";
                nameInput.value = getSavedVal("moo_name") || "";
                prepareUI();
            }
            prepareMenuBackground();
            doUpdate();
            // OPEN LINK:
            function openLink(link) {
                window.open(link, "_blank");
            }
            // EXPORT VALUES:
            window.openLink = openLink;
            window.aJoinReq = aJoinReq;
            window.follmoo = follmoo;
            window.kickFromClan = kickFromClan;
            window.sendJoin = sendJoin;
            window.leaveAlliance = leaveAlliance;
            window.createAlliance = createAlliance;
            window.storeBuy = storeBuy;
            window.storeEquip = storeEquip;
            window.showItemInfo = showItemInfo;
            window.selectSkinColor = selectSkinColor;
            window.changeStoreIndex = changeStoreIndex;
            window.config = config;
            window.FRVR = [18731283, 30192, 12893, 12398123, 192381290, 1290381920, 3, 12893, 1283, 123, 1293, 9012, "real", "please", "help", "scare", "jumpscare", "homo", ];
            document.createAlliance = function(value) {
                if (player.team) {
                    io.send("9", undefined);
                    setTimeout(()=>{//                    io.send("8", value == "" ? String.fromCharCode(0) + " ".repeat(6) : value);
                    }
                               , 1000);
                } else {
                    io.send("8", value == "" ? String.fromCharCode(0) + " ".repeat(6) : value);
                }
            }
            ;
            // FUNCTIONS:
            let mapDisp = getEl("mapDisplay");
            mapDisp.style.backgroundImage = "";
            mapDisp.style.backgroundSize = "130px";
            let pingDisp = getEl("pingDisplay");
            function changeStatusDiv(id) {
                getEl("uehmod").style.display = "none";
                getEl("fzmod").style.display = "none";
                getEl("zyenithmod").style.display = "none";
                let haha = id == "me" ? "uehmod" : id == "fz" ? "fzmod" : id == "zyenith" ? "zyenithmod" : undefined;
                if (haha != undefined) {
                    getEl(haha).style.display = "block";
                }
            }
            getEl("combat").onchange = function() {
                getEl("crp").innerHTML = checkCheckChickenModV69(getEl("combat").value);
                this.blur();
            }
            function watafak(ahaha) {
                //            console.log("call");
                getEl("vrp").innerHTML = checkCheckChickenModV69(getEl("visual").value);
                changeStatusDiv(getEl("visual").value);
                if (ahaha) {
                    updateItemCountHTML();
                }
                pingDisp.style.display = "none";
                pingDisp.innerText = "Ping: " + window.pingTime + " ms";
                pingDisp.style.left = null;
                mapDisp.style.backgroundImage = "";
                mapDisp.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
                foodDisplay.style.display = "block";
                woodDisplay.style.display = "block";
                stoneDisplay.style.display = "block";
                scoreDisplay.style.bottom = "160px";
                scoreDisplay.style.right = "inherit";
                scoreDisplay.style.left = "20px";
                scoreDisplay.style.backgroundPosition = "left 6px center";
                scoreDisplay.style.paddingLeft = "40px";
                scoreDisplay.style.paddingRight = "10px";
                if (getEl("visual").value == "0") {} else if (getEl("visual").value == "me") {
                    mStatus.style.color = "#e6e6fa";
                    mStatus.style.top = "40px";
                    mStatus.style.left = "40px";
                    mStatus.style.right = null;
                } else if (getEl("visual").value == "spyder") {
                    mapDisp.style.backgroundImage = "url(https://i.imgur.com/S1ogeNC.gif)";
                    pingDisp.style.display = "block";
                } else if (getEl("visual").value == "lore") {
                    mapDisp.style.backgroundImage = "url(https://ksw2-center.glitch.me/users/fzb/map.png)";
                } else if (getEl("visual").value == "cele") {} else if (getEl("visual").value == "zeph") {
                    pingDisp.style.display = "block";
                    pingDisplay.innerText = "Ping: " + window.pingTime + " ms | FPS: " + currentFPS + " frames";
                } else if (getEl("visual").value == "zeph") {} else if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                    mapDisp.style.backgroundImage = "url(https://ksw2-center.glitch.me/users/fzb/map.png)";
                } else if (getEl("visual").value == "hans") {
                    pingDisp.style.display = "block";
                    pingDisplay.innerText = "Ping: " + window.pingTime + " ms / © King Hans";
                    mapDisp.style.backgroundImage = "url(https://ksw2-center.glitch.me/users/fzb/map.png)";
                } else {}
                if (getEl("visual").value == "fz" || getEl("visual").value == "zyenith") {
                    mStatus.style.color = "#fff";
                    mStatus.style.top = "40px";
                    mStatus.style.left = null;
                    if (getEl("visual").value == "zyenith") {
                        mStatus.style.right = "40px";
                    } else {
                        mStatus.style.right = "20px";
                    }
                    mStatus.style.display = "block";
                    leaderboard.style.position = "fixed";
                    leaderboard.style.left = "20px";
                    leaderboard.style.right = null;
                    leaderboard.style.display = "none";
                    allianceButton.style.left = "410px";
                    allianceButton.style.right = null;
                    allianceButton.style.width = "40px";
                    storeButton.style.left = "350px";
                    storeButton.style.right = null;
                    storeButton.style.width = "40px";
                    chatButton.style.display = "none";
                    try {} catch (e) {}
                    resourceDisplay.appendChild(killCounter);
                    if (getEl("visual").value == "fz") {
                        killCounter.style.bottom = "185px";
                        killCounter.style.right = "20px";
                        scoreDisplay.style.bottom = "240px";
                        scoreDisplay.style.right = "20px";
                        scoreDisplay.style.left = "inherit";
                        scoreDisplay.style.backgroundPosition = "right 6px center";
                        scoreDisplay.style.paddingLeft = "10px";
                        scoreDisplay.style.paddingRight = "40px";
                    } else {
                        foodDisplay.style.display = "none";
                        woodDisplay.style.display = "none";
                        stoneDisplay.style.display = "none";
                        killCounter.style.bottom = "20px";
                        killCounter.style.right = "20px";
                    }
                } else {
                    leaderboard.style.position = null;
                    leaderboard.style.left = null;
                    leaderboard.style.right = null;
                    leaderboard.style.display = "block";
                    allianceButton.style.left = null;
                    allianceButton.style.right = "270px";
                    allianceButton.style.width = "40px";
                    storeButton.style.left = null;
                    storeButton.style.right = "330px";
                    storeButton.style.width = "40px";
                    chatButton.style.display = "block";
                    topinfoHolder.appendChild(killCounter);
                    killCounter.style.bottom = null;
                    killCounter.style.right = null;
                    mStatus.style.display = "none";
                }
                if (player) {
                    ageBarBody.style.width = (getEl("visual").value == "cele" || getEl("visual").value == "ae" ? "0" : (player.XP / player.maxXP) * 100) + "%";
                    for (var i = 0; i < items.list.length; ++i) {
                        var tmpI = items.weapons.length + i;
                        getEl("actionBarItem" + tmpI).style.display = (getEl("visual").value == "cele" || getEl("visual").value == "ae" || getEl("visual").value == "hans" ? player.firstItems : player.items).indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                    }
                }
                //            Wut = getEl("visual").description;
            }
            watafak();
            getEl("visual").onchange = function() {
                watafak(true);
                this.blur();
            }
            ;
            /***/
        },
        /***/
        "./src/js/config.js": /*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            /* WEBPACK VAR INJECTION */
            (function(process) {
                // RENDER:
                module.exports.maxScreenWidth = 1920;
                module.exports.maxScreenHeight = 1080;
                // SERVER:
                module.exports.serverUpdateRate = 9;
                module.exports.tickRate = 1000 / module.exports.serverUpdateRate;
                module.exports.maxPlayers = process && process.argv.indexOf("--largeserver") != -1 ? 80 : 50;
                module.exports.maxPlayersHard = module.exports.maxPlayers + 10;
                module.exports.collisionDepth = 6;
                module.exports.minimapRate = 3000;
                // COLLISIONS:
                module.exports.colGrid = 10;
                // CLIENT:
                module.exports.clientSendRate = 5;
                // UI:
                module.exports.healthBarWidth = 50;
                module.exports.healthBarPad = 4.5;
                module.exports.iconPadding = 15;
                module.exports.iconPad = 0.9;
                module.exports.deathFadeout = 3000;
                module.exports.crownIconScale = 60;
                module.exports.crownPad = 35;
                // CHAT:
                module.exports.chatCountdown = 3000;
                module.exports.chatCooldown = 500;
                // SANDBOX:
                module.exports.inSandbox = process && process.env.VULTR_SCHEME === "mm_exp";
                module.exports.isSandbox = window.location.hostname == "sandbox.moomoo.io";
                // PLAYER:
                module.exports.maxAge = 100;
                module.exports.gatherAngle = Math.PI / 2.6;
                module.exports.gatherWiggle = 10;
                module.exports.hitReturnRatio = 0.25;
                module.exports.hitAngle = Math.PI / 2;
                module.exports.playerScale = 35;
                module.exports.playerSpeed = 0.0016;
                module.exports.playerDecel = 0.993;
                module.exports.nameY = 34;
                // CUSTOMIZATION:
                module.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db", ];
                // ANIMALS:
                module.exports.animalCount = 7;
                module.exports.aiTurnRandom = 0.06;
                module.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky", ];
                // WEAPONS:
                module.exports.shieldAngle = Math.PI / 3;
                module.exports.weaponVariants = [{
                    id: 0,
                    src: "",
                    xp: 0,
                    val: 1,
                }, {
                    id: 1,
                    src: "_g",
                    xp: 3000,
                    val: 1.1,
                }, {
                    id: 2,
                    src: "_d",
                    xp: 7000,
                    val: 1.18,
                }, {
                    id: 3,
                    src: "_r",
                    poison: true,
                    xp: 12000,
                    val: 1.18,
                }, ];
                module.exports.weaponXPs = [{
                    id: 0,
                    xp: 3000,
                }, {
                    id: 1,
                    xp: 7000,
                }, {
                    id: 2,
                    xp: 12000,
                }, {
                    id: 3,
                    xp: 1 / 0,
                }, ];
                module.exports.fetchVariant = function(player) {
                    var tmpXP = player.weaponXP[player.weaponIndex] || 0;
                    for (var i = module.exports.weaponVariants.length - 1; i >= 0; --i) {
                        if (tmpXP >= module.exports.weaponVariants[i].xp)
                            return module.exports.weaponVariants[i];
                    }
                }
                ;
                // NATURE:
                module.exports.resourceTypes = ["wood", "food", "stone", "points"];
                module.exports.areaCount = 7;
                module.exports.treesPerArea = 9;
                module.exports.bushesPerArea = 3;
                module.exports.totalRocks = 32;
                module.exports.goldOres = 7;
                module.exports.riverWidth = 724;
                module.exports.riverPadding = 114;
                module.exports.waterCurrent = 0.0011;
                module.exports.waveSpeed = 0.0001;
                module.exports.waveMax = 1.3;
                module.exports.treeScales = [150, 160, 165, 175];
                module.exports.bushScales = [80, 85, 95];
                module.exports.rockScales = [80, 85, 90];
                // BIOME DATA:
                module.exports.snowBiomeTop = 2400;
                module.exports.snowSpeed = 0.75;
                // DATA:
                module.exports.maxNameLength = 15;
                // MAP:
                module.exports.mapScale = 14400;
                module.exports.mapPingScale = 40;
                module.exports.mapPingTime = 2200;
                /* WEBPACK VAR INJECTION */
            }
            ).call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */
                "./node_modules/process/browser.js"));
            /***/
        },
        /***/
        "./src/js/data/ai.js": /*!***************************!*\
  !*** ./src/js/data/ai.js ***!
  \***************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var PI2 = Math.PI * 2;
            module.exports = function(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                this.sid = sid;
                this.isAI = true;
                this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
                // INIT:
                this.init = function(x, y, dir, index, data) {
                    this.x = x;
                    this.y = y;
                    this.startX = data.fixedSpawn ? x : null;
                    this.startY = data.fixedSpawn ? y : null;
                    this.xVel = 0;
                    this.yVel = 0;
                    this.zIndex = 0;
                    this.dir = dir;
                    this.dirPlus = 0;
                    this.index = index;
                    this.src = data.src;
                    if (data.name)
                        this.name = data.name;
                    this.weightM = data.weightM;
                    this.speed = data.speed;
                    this.killScore = data.killScore;
                    this.turnSpeed = data.turnSpeed;
                    this.scale = data.scale;
                    this.maxHealth = data.health;
                    this.leapForce = data.leapForce;
                    this.health = this.maxHealth;
                    this.chargePlayer = data.chargePlayer;
                    this.viewRange = data.viewRange;
                    this.drop = data.drop;
                    this.dmg = data.dmg;
                    this.hostile = data.hostile;
                    this.dontRun = data.dontRun;
                    this.hitRange = data.hitRange;
                    this.hitDelay = data.hitDelay;
                    this.hitScare = data.hitScare;
                    this.spriteMlt = data.spriteMlt;
                    this.nameScale = data.nameScale;
                    this.colDmg = data.colDmg;
                    this.noTrap = data.noTrap;
                    this.spawnDelay = data.spawnDelay;
                    this.hitWait = 0;
                    this.waitCount = 1000;
                    this.moveCount = 0;
                    this.weaponReload = 0;
                    this.weaponHitted = 0;
                    this.targetDir = 0;
                    this.active = true;
                    this.alive = true;
                    this.runFrom = null;
                    this.chargeTarget = null;
                    this.dmgOverTime = {};
                    this.doTickUpdate = false;
                }
                ;
                // UPDATE:
                var timerCount = 0;
                this.update = function(delta) {
                    if (this.active) {
                        // SPAWN DELAY:
                        if (this.spawnCounter) {
                            this.spawnCounter -= delta;
                            if (this.spawnCounter <= 0) {
                                this.spawnCounter = 0;
                                this.x = this.startX || UTILS.randInt(0, config.mapScale);
                                this.y = this.startY || UTILS.randInt(0, config.mapScale);
                            }
                            return;
                        }
                        // REGENS AND AUTO:
                        timerCount -= delta;
                        if (timerCount <= 0) {
                            if (this.dmgOverTime.dmg) {
                                this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                                this.dmgOverTime.time -= 1;
                                if (this.dmgOverTime.time <= 0)
                                    this.dmgOverTime.dmg = 0;
                            }
                            timerCount = 1000;
                        }
                        // BEHAVIOUR:
                        var charging = false;
                        var slowMlt = 1;
                        if (!this.zIndex && !this.lockMove && this.y >= config.mapScale / 2 - config.riverWidth / 2 && this.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            slowMlt = 0.33;
                            this.xVel += config.waterCurrent * delta;
                        }
                        if (this.lockMove) {
                            this.xVel = 0;
                            this.yVel = 0;
                        } else if (this.waitCount > 0) {
                            this.waitCount -= delta;
                            if (this.waitCount <= 0) {
                                if (this.chargePlayer) {
                                    var tmpPlayer, bestDst, tmpDist;
                                    for (var i = 0; i < players.length; ++i) {
                                        if (players[i].alive && !(players[i].skin && players[i].skin.bullRepel)) {
                                            tmpDist = UTILS.getDistance(this.x, this.y, players[i].x, players[i].y);
                                            if (tmpDist <= this.viewRange && (!tmpPlayer || tmpDist < bestDst)) {
                                                bestDst = tmpDist;
                                                tmpPlayer = players[i];
                                            }
                                        }
                                    }
                                    if (tmpPlayer) {
                                        this.chargeTarget = tmpPlayer;
                                        this.moveCount = UTILS.randInt(8000, 12000);
                                    } else {
                                        this.moveCount = UTILS.randInt(1000, 2000);
                                        this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                                    }
                                } else {
                                    this.moveCount = UTILS.randInt(4000, 10000);
                                    this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                                }
                            }
                        } else if (this.moveCount > 0) {
                            var tmpSpd = this.speed * slowMlt;
                            if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive)) {
                                this.targetDir = UTILS.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y);
                                tmpSpd *= 1.42;
                            } else if (this.chargeTarget && this.chargeTarget.alive) {
                                this.targetDir = UTILS.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y);
                                tmpSpd *= 1.75;
                                charging = true;
                            }
                            if (this.hitWait) {
                                tmpSpd *= 0.3;
                            }
                            if (this.dir != this.targetDir) {
                                this.dir %= PI2;
                                var netAngle = (this.dir - this.targetDir + PI2) % PI2;
                                var amnt = Math.min(Math.abs(netAngle - PI2), netAngle, this.turnSpeed * delta);
                                var sign = netAngle - Math.PI >= 0 ? 1 : -1;
                                this.dir += sign * amnt + PI2;
                            }
                            this.dir %= PI2;
                            this.xVel += tmpSpd * delta * Math.cos(this.dir);
                            this.yVel += tmpSpd * delta * Math.sin(this.dir);
                            this.moveCount -= delta;
                            if (this.moveCount <= 0) {
                                this.runFrom = null;
                                this.chargeTarget = null;
                                this.waitCount = this.hostile ? 1500 : UTILS.randInt(1500, 6000);
                            }
                        }
                        // OBJECT COLL:
                        this.zIndex = 0;
                        this.lockMove = false;
                        var tmpList;
                        var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                        var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                        var tMlt = 1 / depth;
                        for (var i = 0; i < depth; ++i) {
                            if (this.xVel)
                                this.x += this.xVel * delta * tMlt;
                            if (this.yVel)
                                this.y += this.yVel * delta * tMlt;
                            tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                            for (var x = 0; x < tmpList.length; ++x) {
                                for (var y = 0; y < tmpList[x].length; ++y) {
                                    if (tmpList[x][y].active)
                                        objectManager.checkCollision(this, tmpList[x][y], tMlt);
                                }
                            }
                        }
                        // HITTING:
                        var hitting = false;
                        if (this.hitWait > 0) {
                            this.hitWait -= delta;
                            if (this.hitWait <= 0) {
                                hitting = true;
                                this.hitWait = 0;
                                if (this.leapForce && !UTILS.randInt(0, 2)) {
                                    this.xVel += this.leapForce * Math.cos(this.dir);
                                    this.yVel += this.leapForce * Math.sin(this.dir);
                                }
                                var tmpList = objectManager.getGridArrays(this.x, this.y, this.hitRange);
                                var tmpObj, tmpDst;
                                for (var t = 0; t < tmpList.length; ++t) {
                                    for (var x = 0; x < tmpList[t].length; ++x) {
                                        tmpObj = tmpList[t][x];
                                        if (tmpObj.health) {
                                            tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                            if (tmpDst < tmpObj.scale + this.hitRange) {
                                                if (tmpObj.changeHealth(-this.dmg * 5))
                                                    objectManager.disableObj(tmpObj);
                                                objectManager.hitObj(tmpObj, UTILS.getDirection(this.x, this.y, tmpObj.x, tmpObj.y));
                                            }
                                        }
                                    }
                                }
                                for (var x = 0; x < players.length; ++x) {
                                    if (players[x].canSee(this)) {
                                        server.send(players[x].id, "aa", this.sid);
                                    }
                                }
                            }
                        }
                        // PLAYER COLLISIONS:
                        if (charging || hitting) {
                            var tmpObj, tmpDst, tmpDir;
                            for (var i = 0; i < players.length; ++i) {
                                tmpObj = players[i];
                                if (tmpObj && tmpObj.alive) {
                                    tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                    if (this.hitRange) {
                                        if (!this.hitWait && tmpDst <= this.hitRange + tmpObj.scale) {
                                            if (hitting) {
                                                tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                                tmpObj.changeHealth(-this.dmg);
                                                tmpObj.xVel += 0.6 * Math.cos(tmpDir);
                                                tmpObj.yVel += 0.6 * Math.sin(tmpDir);
                                                this.runFrom = null;
                                                this.chargeTarget = null;
                                                this.waitCount = 3000;
                                                this.hitWait = !UTILS.randInt(0, 2) ? 600 : 0;
                                            } else
                                                this.hitWait = this.hitDelay;
                                        }
                                    } else if (tmpDst <= this.scale + tmpObj.scale) {
                                        tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                        tmpObj.changeHealth(-this.dmg);
                                        tmpObj.xVel += 0.55 * Math.cos(tmpDir);
                                        tmpObj.yVel += 0.55 * Math.sin(tmpDir);
                                    }
                                }
                            }
                        }
                        // DECEL:
                        if (this.xVel)
                            this.xVel *= Math.pow(config.playerDecel, delta);
                        if (this.yVel)
                            this.yVel *= Math.pow(config.playerDecel, delta);
                        // MAP BOUNDARIES:
                        var tmpScale = this.scale;
                        if (this.x - tmpScale < 0) {
                            this.x = tmpScale;
                            this.xVel = 0;
                        } else if (this.x + tmpScale > config.mapScale) {
                            this.x = config.mapScale - tmpScale;
                            this.xVel = 0;
                        }
                        if (this.y - tmpScale < 0) {
                            this.y = tmpScale;
                            this.yVel = 0;
                        } else if (this.y + tmpScale > config.mapScale) {
                            this.y = config.mapScale - tmpScale;
                            this.yVel = 0;
                        }
                    }
                }
                ;
                // CAN SEE:
                this.canSee = function(other) {
                    if (!other)
                        return false;
                    if (other.skin && other.skin.invisTimer && other.noMovTimer >= other.skin.invisTimer)
                        return false;
                    var dx = Math.abs(other.x - this.x) - other.scale;
                    var dy = Math.abs(other.y - this.y) - other.scale;
                    return (dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3);
                }
                ;
                var tmpRatio = 0;
                var animIndex = 0;
                this.animate = function(delta) {
                    if (this.animTime > 0) {
                        this.animTime -= delta;
                        if (this.animTime <= 0) {
                            this.animTime = 0;
                            this.dirPlus = 0;
                            tmpRatio = 0;
                            animIndex = 0;
                        } else {
                            if (animIndex == 0) {
                                tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                if (tmpRatio >= 1) {
                                    tmpRatio = 1;
                                    animIndex = 1;
                                }
                            } else {
                                tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                            }
                        }
                    }
                }
                ;
                // ANIMATION:
                this.startAnim = function() {
                    this.animTime = this.animSpeed = 600;
                    this.targetAngle = Math.PI * 0.8;
                    tmpRatio = 0;
                    animIndex = 0;
                }
                ;
                // CHANGE HEALTH:
                this.changeHealth = function(val, doer, runFrom) {
                    if (this.active) {
                        this.health += val;
                        if (runFrom) {
                            if (this.hitScare && !UTILS.randInt(0, this.hitScare)) {
                                this.runFrom = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 2000;
                            } else if (this.hostile && this.chargePlayer && runFrom.isPlayer) {
                                this.chargeTarget = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 8000;
                            } else if (!this.dontRun) {
                                this.runFrom = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 2000;
                            }
                        }
                        if (val < 0 && this.hitRange && UTILS.randInt(0, 1))
                            this.hitWait = 500;
                        if (doer && doer.canSee(this) && val < 0) {
                            server.send(doer.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-val), 1);
                        }
                        if (this.health <= 0) {
                            if (this.spawnDelay) {
                                this.spawnCounter = this.spawnDelay;
                                this.x = -1000000;
                                this.y = -1000000;
                            } else {
                                this.x = this.startX || UTILS.randInt(0, config.mapScale);
                                this.y = this.startY || UTILS.randInt(0, config.mapScale);
                            }
                            this.health = this.maxHealth;
                            this.runFrom = null;
                            if (doer) {
                                scoreCallback(doer, this.killScore);
                                if (this.drop) {
                                    for (var i = 0; i < this.drop.length; ) {
                                        doer.addResource(config.resourceTypes.indexOf(this.drop[i]), this.drop[i + 1]);
                                        i += 2;
                                    }
                                }
                            }
                        }
                    }
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/aiManager.js": /*!**********************************!*\
  !*** ./src/js/data/aiManager.js ***!
  \**********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // AI MANAGER:
            module.exports = function(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
                // AI TYPES:
                this.aiTypes = [{
                    id: 0,
                    src: "cow_1",
                    killScore: 150,
                    health: 500,
                    weightM: 0.8,
                    speed: 0.00095,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 50],
                }, {
                    id: 1,
                    src: "pig_1",
                    killScore: 200,
                    health: 800,
                    weightM: 0.6,
                    speed: 0.00085,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 80],
                }, {
                    id: 2,
                    name: "Bull",
                    src: "bull_2",
                    hostile: true,
                    dmg: 20,
                    killScore: 1000,
                    health: 1800,
                    weightM: 0.5,
                    speed: 0.00094,
                    turnSpeed: 0.00074,
                    scale: 78,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 100],
                }, {
                    id: 3,
                    name: "Bully",
                    src: "bull_1",
                    hostile: true,
                    dmg: 20,
                    killScore: 2000,
                    health: 2800,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.0008,
                    scale: 90,
                    viewRange: 900,
                    chargePlayer: true,
                    drop: ["food", 400],
                }, {
                    id: 4,
                    name: "Wolf",
                    src: "wolf_1",
                    hostile: true,
                    dmg: 8,
                    killScore: 500,
                    health: 300,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.002,
                    scale: 84,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 200],
                }, {
                    id: 5,
                    name: "Quack",
                    src: "chicken_1",
                    dmg: 8,
                    killScore: 2000,
                    noTrap: true,
                    health: 300,
                    weightM: 0.2,
                    speed: 0.0018,
                    turnSpeed: 0.006,
                    scale: 70,
                    drop: ["food", 100],
                }, {
                    id: 6,
                    name: "MOOSTAFA",
                    nameScale: 50,
                    src: "enemy",
                    hostile: true,
                    dontRun: true,
                    fixedSpawn: true,
                    spawnDelay: 60000,
                    noTrap: true,
                    colDmg: 100,
                    dmg: 40,
                    killScore: 8000,
                    health: 18000,
                    weightM: 0.4,
                    speed: 0.0007,
                    turnSpeed: 0.01,
                    scale: 80,
                    spriteMlt: 1.8,
                    leapForce: 0.9,
                    viewRange: 1000,
                    hitRange: 210,
                    hitDelay: 1000,
                    chargePlayer: true,
                    drop: ["food", 100],
                }, {
                    id: 7,
                    name: "Treasure",
                    hostile: true,
                    nameScale: 35,
                    src: "crate_1",
                    fixedSpawn: true,
                    spawnDelay: 120000,
                    colDmg: 200,
                    killScore: 5000,
                    health: 20000,
                    weightM: 0.1,
                    speed: 0.0,
                    turnSpeed: 0.0,
                    scale: 70,
                    spriteMlt: 1.0,
                }, {
                    id: 8,
                    name: "MOOFIE",
                    src: "wolf_2",
                    hostile: true,
                    fixedSpawn: true,
                    dontRun: true,
                    hitScare: 4,
                    spawnDelay: 30000,
                    noTrap: true,
                    nameScale: 35,
                    dmg: 10,
                    colDmg: 100,
                    killScore: 3000,
                    health: 7000,
                    weightM: 0.45,
                    speed: 0.0015,
                    turnSpeed: 0.002,
                    scale: 90,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 1000],
                }, ];
                // SPAWN AI:
                this.spawn = function(x, y, dir, index) {
                    var tmpObj;
                    for (var i = 0; i < ais.length; ++i) {
                        if (!ais[i].active) {
                            tmpObj = ais[i];
                            break;
                        }
                    }
                    if (!tmpObj) {
                        tmpObj = new AI(ais.length,objectManager,players,items,UTILS,config,scoreCallback,server);
                        ais.push(tmpObj);
                    }
                    tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                    return tmpObj;
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/gameObject.js": /*!***********************************!*\
  !*** ./src/js/data/gameObject.js ***!
  \***********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = function(sid) {
                this.sid = sid;
                // INIT:
                this.init = function(x, y, dir, scale, type, data, owner) {
                    data = data || {};
                    this.sentTo = {};
                    this.gridLocations = [];
                    this.active = true;
                    this.doUpdate = data.doUpdate;
                    this.shootReload = 2200 - (1000 / 9) * 2;
                    this.shootted = 0;
                    this.x = x;
                    this.y = y;
                    this.dir = dir;
                    this.xWiggle = 0;
                    this.yWiggle = 0;
                    this.scale = scale;
                    this.type = type;
                    this.id = data.id;
                    this.owner = owner;
                    this.name = data.name;
                    this.isItem = this.id != undefined;
                    this.group = data.group;
                    this.health = data.health;
                    this.buildHealth = data.health;
                    this.layer = 2;
                    if (this.group != undefined) {
                        this.layer = this.group.layer;
                    } else if (this.type == 0) {
                        this.layer = 3;
                    } else if (this.type == 2) {
                        this.layer = 0;
                    } else if (this.type == 4) {
                        this.layer = -1;
                    }
                    this.colDiv = data.colDiv || 1;
                    this.blocker = data.blocker;
                    this.ignoreCollision = data.ignoreCollision;
                    this.dontGather = data.dontGather;
                    this.hideFromEnemy = data.hideFromEnemy;
                    this.friction = data.friction;
                    this.projDmg = data.projDmg;
                    this.dmg = data.dmg;
                    this.pDmg = data.pDmg;
                    this.pps = data.pps;
                    this.zIndex = data.zIndex || 0;
                    this.turnSpeed = data.turnSpeed;
                    this.req = data.req;
                    this.trap = data.trap;
                    this.healCol = data.healCol;
                    this.teleport = data.teleport;
                    this.boostSpeed = data.boostSpeed;
                    this.projectile = data.projectile;
                    this.shootRange = data.shootRange;
                    this.shootRate = data.shootRate;
                    this.shootCount = this.shootRate;
                    this.spawnPoint = data.spawnPoint;
                }
                ;
                // GET HIT:
                this.changeHealth = function(amount, doer) {
                    this.health += amount;
                    return this.health <= 0;
                }
                ;
                // GET SCALE:
                this.getScale = function(sM, ig) {
                    sM = sM || 1;
                    return (this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : 0.6 * sM) * (ig ? 1 : this.colDiv));
                }
                ;
                // VISIBLE TO PLAYER:
                this.visibleToPlayer = function(player) {
                    return (!this.hideFromEnemy || (this.owner && (this.owner == player || (this.owner.team && player.team == this.owner.team))));
                }
                ;
                // UPDATE:
                this.update = function(delta) {
                    if (this.active) {
                        if (this.xWiggle) {
                            this.xWiggle *= Math.pow(0.99, delta);
                        }
                        if (this.yWiggle) {
                            this.yWiggle *= Math.pow(0.99, delta);
                        }
                        if (getEl("visual").value != "zyenith" && this.turnSpeed && (getEl("visual").value == "0" ? true : !this.pps)) {
                            this.dir += this.turnSpeed * delta;
                        }
                    }
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/items.js": /*!******************************!*\
  !*** ./src/js/data/items.js ***!
  \******************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // ITEM GROUPS:
            module.exports.groups = [{
                id: 0,
                name: "food",
                layer: 0,
            }, {
                id: 1,
                name: "walls",
                place: true,
                limit: 30,
                layer: 0,
            }, {
                id: 2,
                name: "spikes",
                place: true,
                limit: 15,
                layer: 0,
            }, {
                id: 3,
                name: "mill",
                place: true,
                limit: 7,
                layer: 1,
            }, {
                id: 4,
                name: "mine",
                place: true,
                limit: 1,
                layer: 0,
            }, {
                id: 5,
                name: "trap",
                place: true,
                limit: 6,
                layer: -1,
            }, {
                id: 6,
                name: "booster",
                place: true,
                limit: 12,
                layer: -1,
            }, {
                id: 7,
                name: "turret",
                place: true,
                limit: 2,
                layer: 1,
            }, {
                id: 8,
                name: "watchtower",
                place: true,
                limit: 12,
                layer: 1,
            }, {
                id: 9,
                name: "buff",
                place: true,
                limit: 4,
                layer: -1,
            }, {
                id: 10,
                name: "spawn",
                place: true,
                limit: 1,
                layer: -1,
            }, {
                id: 11,
                name: "sapling",
                place: true,
                limit: 2,
                layer: 0,
            }, {
                id: 12,
                name: "blocker",
                place: true,
                limit: 3,
                layer: -1,
            }, {
                id: 13,
                name: "teleporter",
                place: true,
                limit: 2,
                layer: -1,
            }, ];
            // PROJECTILES:
            exports.projectiles = [{
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 25,
                speed: 1.6,
                scale: 103,
                range: 1000,
            }, {
                indx: 1,
                layer: 1,
                dmg: 25,
                scale: 20,
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 35,
                speed: 2.5,
                scale: 103,
                range: 1200,
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 30,
                speed: 2,
                scale: 103,
                range: 1200,
            }, {
                indx: 1,
                layer: 1,
                dmg: 16,
                scale: 20,
            }, {
                indx: 0,
                layer: 0,
                src: "bullet_1",
                dmg: 50,
                speed: 3.6,
                scale: 160,
                range: 1400,
            }, ];
            // WEAPONS:
            exports.weapons = [{
                id: 0,
                type: 0,
                name: "tool hammer",
                desc: "tool for gathering all resources",
                src: "hammer_1",
                length: 140,
                width: 140,
                xOff: -3,
                yOff: 18,
                dmg: 25,
                dmg2: 25,
                range: 65,
                gather: 1,
                speed: 300,
            }, {
                id: 1,
                type: 0,
                age: 2,
                name: "hand axe",
                desc: "gathers resources at a higher rate",
                src: "axe_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 30,
                dmg2: 30,
                spdMult: 1,
                range: 70,
                gather: 2,
                speed: 400,
            }, {
                id: 2,
                type: 0,
                age: 8,
                pre: 1,
                name: "great axe",
                desc: "deal more damage and gather more resources",
                src: "great_axe_1",
                length: 140,
                width: 140,
                xOff: -8,
                yOff: 25,
                dmg: 35,
                dmg2: 35,
                spdMult: 1,
                range: 75,
                gather: 4,
                speed: 400,
            }, {
                id: 3,
                type: 0,
                age: 2,
                name: "short sword",
                desc: "increased attack power but slower move speed",
                src: "sword_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 46,
                dmg: 35,
                dmg2: 35,
                spdMult: 0.85,
                range: 110,
                gather: 1,
                speed: 300,
            }, {
                id: 4,
                type: 0,
                age: 8,
                pre: 3,
                name: "katana",
                desc: "greater range and damage",
                src: "samurai_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 59,
                dmg: 40,
                dmg2: 40,
                spdMult: 0.8,
                range: 118,
                gather: 1,
                speed: 300,
            }, {
                id: 5,
                type: 0,
                age: 2,
                name: "polearm",
                desc: "long range melee weapon",
                src: "spear_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 45,
                dmg2: 45,
                knock: 0.2,
                spdMult: 0.82,
                range: 142,
                gather: 1,
                speed: 700,
            }, {
                id: 6,
                type: 0,
                age: 2,
                name: "bat",
                desc: "fast long range melee weapon",
                src: "bat_1",
                iPad: 1.3,
                length: 110,
                width: 180,
                xOff: -8,
                yOff: 53,
                dmg: 20,
                dmg2: 20,
                knock: 0.7,
                range: 110,
                gather: 1,
                speed: 300,
            }, {
                id: 7,
                type: 0,
                age: 2,
                name: "daggers",
                desc: "really fast short range weapon",
                src: "dagger_1",
                iPad: 0.8,
                length: 110,
                width: 110,
                xOff: 18,
                yOff: 0,
                dmg: 20,
                dmg2: 20,
                knock: 0.1,
                range: 65,
                gather: 1,
                hitSlow: 0.1,
                spdMult: 1.13,
                speed: 100,
            }, {
                id: 8,
                type: 0,
                age: 2,
                name: "stick",
                desc: "great for gathering but very weak",
                src: "stick_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 1,
                dmg2: 1,
                spdMult: 1,
                range: 70,
                gather: 7,
                speed: 400,
            }, {
                id: 9,
                type: 1,
                age: 6,
                name: "hunting bow",
                desc: "bow used for ranged combat and hunting",
                src: "bow_1",
                req: ["wood", 4],
                length: 120,
                width: 120,
                xOff: -6,
                yOff: 0,
                Pdmg: 25,
                projectile: 0,
                spdMult: 0.75,
                speed: 600,
            }, {
                id: 10,
                type: 1,
                age: 6,
                name: "great hammer",
                desc: "hammer used for destroying structures",
                src: "great_hammer_1",
                length: 140,
                width: 140,
                xOff: -9,
                yOff: 25,
                dmg: 10,
                Pdmg: 10,
                spdMult: 0.88,
                range: 75,
                sDmg: 7.5,
                gather: 1,
                speed: 400,
            }, {
                id: 11,
                type: 1,
                age: 6,
                name: "wooden shield",
                desc: "blocks projectiles and reduces melee damage",
                src: "shield_1",
                length: 120,
                width: 120,
                shield: 0.2,
                xOff: 6,
                yOff: 0,
                Pdmg: 0,
                spdMult: 0.7,
            }, {
                id: 12,
                type: 1,
                age: 8,
                pre: 9,
                name: "crossbow",
                desc: "deals more damage and has greater range",
                src: "crossbow_1",
                req: ["wood", 5],
                aboveHand: true,
                armS: 0.75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                Pdmg: 35,
                projectile: 2,
                spdMult: 0.7,
                speed: 700,
            }, {
                id: 13,
                type: 1,
                age: 9,
                pre: 12,
                name: "repeater crossbow",
                desc: "high firerate crossbow with reduced damage",
                src: "crossbow_2",
                req: ["wood", 10],
                aboveHand: true,
                armS: 0.75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                Pdmg: 30,
                projectile: 3,
                spdMult: 0.7,
                speed: 230,
            }, {
                id: 14,
                type: 1,
                age: 6,
                name: "mc grabby",
                desc: "steals resources from enemies",
                src: "grab_1",
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 0,
                Pdmg: 0,
                steal: 250,
                knock: 0.2,
                spdMult: 1.05,
                range: 125,
                gather: 0,
                speed: 700,
            }, {
                id: 15,
                type: 1,
                age: 9,
                pre: 12,
                name: "musket",
                desc: "slow firerate but high damage and range",
                src: "musket_1",
                req: ["stone", 10],
                aboveHand: true,
                rec: 0.35,
                armS: 0.6,
                hndS: 0.3,
                hndD: 1.6,
                length: 205,
                width: 205,
                xOff: 25,
                yOff: 0,
                Pdmg: 50,
                projectile: 5,
                hideProjectile: true,
                spdMult: 0.6,
                speed: 1500,
            }, ];
            // ITEMS:
            module.exports.list = [{
                group: module.exports.groups[0],
                name: "apple",
                desc: "restores 20 health when consumed",
                req: ["food", 10],
                consume: function(doer) {
                    return doer.changeHealth(20, doer);
                },
                scale: 22,
                holdOffset: 15,
                healing: 20,
            }, {
                age: 3,
                group: module.exports.groups[0],
                name: "cookie",
                desc: "restores 40 health when consumed",
                req: ["food", 15],
                consume: function(doer) {
                    return doer.changeHealth(40, doer);
                },
                scale: 27,
                holdOffset: 15,
                healing: 40,
            }, {
                age: 7,
                group: module.exports.groups[0],
                name: "cheese",
                desc: "restores 30 health and another 50 over 5 seconds",
                req: ["food", 25],
                consume: function(doer) {
                    if (doer.changeHealth(30, doer) || doer.health < 100) {
                        doer.dmgOverTime.dmg = -10;
                        doer.dmgOverTime.doer = doer;
                        doer.dmgOverTime.time = 5;
                        return true;
                    }
                    return false;
                },
                scale: 27,
                holdOffset: 15,
                healing: 30,
            }, {
                group: module.exports.groups[1],
                name: "wood wall",
                desc: "provides protection for your village",
                req: ["wood", 10],
                projDmg: true,
                health: 380,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 3,
                group: module.exports.groups[1],
                name: "stone wall",
                desc: "provides improved protection for your village",
                req: ["stone", 25],
                health: 900,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[1],
                name: "castle wall",
                desc: "provides powerful protection for your village",
                req: ["stone", 35],
                health: 1500,
                scale: 52,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                group: module.exports.groups[2],
                name: "spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 20, "stone", 5],
                health: 400,
                dmg: 20,
                scale: 49,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5,
            }, {
                age: 5,
                group: module.exports.groups[2],
                name: "greater spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 10],
                health: 500,
                dmg: 35,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5,
            }, {
                age: 9,
                group: module.exports.groups[2],
                name: "poison spikes",
                desc: "poisons enemies when they touch them",
                req: ["wood", 35, "stone", 15],
                health: 600,
                dmg: 30,
                pDmg: 5,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5,
            }, {
                age: 9,
                group: module.exports.groups[2],
                name: "spinning spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 20],
                health: 500,
                dmg: 45,
                turnSpeed: 0.003,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5,
            }, {
                group: module.exports.groups[3],
                name: "windmill",
                desc: "generates gold over time",
                req: ["wood", 50, "stone", 10],
                health: 400,
                pps: 1,
                turnSpeed: 0.0016,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 45,
                holdOffset: 20,
                placeOffset: 5,
            }, {
                age: 5,
                group: module.exports.groups[3],
                name: "faster windmill",
                desc: "generates more gold over time",
                req: ["wood", 60, "stone", 20],
                health: 500,
                pps: 1.5,
                turnSpeed: 0.0025,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5,
            }, {
                age: 8,
                group: module.exports.groups[3],
                name: "power mill",
                desc: "generates more gold over time",
                req: ["wood", 100, "stone", 50],
                health: 800,
                pps: 2,
                turnSpeed: 0.005,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5,
            }, {
                age: 5,
                group: module.exports.groups[4],
                type: 2,
                name: "mine",
                desc: "allows you to mine stone",
                req: ["wood", 20, "stone", 100],
                iconLineMult: 12,
                scale: 65,
                holdOffset: 20,
                placeOffset: 0,
            }, {
                age: 5,
                group: module.exports.groups[11],
                type: 0,
                name: "sapling",
                desc: "allows you to farm wood",
                req: ["wood", 150],
                iconLineMult: 12,
                colDiv: 0.5,
                scale: 110,
                holdOffset: 50,
                placeOffset: -15,
            }, {
                age: 4,
                group: module.exports.groups[5],
                name: "pit trap",
                desc: "pit that traps enemies if they walk over it",
                req: ["wood", 30, "stone", 30],
                trap: true,
                ignoreCollision: true,
                hideFromEnemy: true,
                health: 500,
                colDiv: 0.2,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 4,
                group: module.exports.groups[6],
                name: "boost pad",
                desc: "provides boost when stepped on",
                req: ["stone", 20, "wood", 5],
                ignoreCollision: true,
                boostSpeed: 1.5,
                health: 150,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[7],
                doUpdate: true,
                name: "turret",
                desc: "defensive structure that shoots at enemies",
                req: ["wood", 200, "stone", 150],
                health: 800,
                projectile: 1,
                shootRange: 700,
                shootRate: 2200,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[8],
                name: "platform",
                desc: "platform to shoot over walls and cross over water",
                req: ["wood", 20],
                ignoreCollision: true,
                zIndex: 1,
                health: 300,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[9],
                name: "healing pad",
                desc: "standing on it will slowly heal you",
                req: ["wood", 30, "food", 10],
                ignoreCollision: true,
                healCol: 15,
                health: 400,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 9,
                group: module.exports.groups[10],
                name: "spawn pad",
                desc: "you will spawn here when you die but it will dissapear",
                req: ["wood", 100, "stone", 100],
                health: 400,
                ignoreCollision: true,
                spawnPoint: true,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[12],
                name: "blocker",
                desc: "blocks building in radius",
                req: ["wood", 30, "stone", 25],
                ignoreCollision: true,
                blocker: 300,
                health: 400,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5,
            }, {
                age: 7,
                group: module.exports.groups[13],
                name: "teleporter",
                desc: "teleports you to a random point on the map",
                req: ["wood", 60, "stone", 60],
                ignoreCollision: true,
                teleport: true,
                health: 200,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5,
            }, ];
            // ASSIGN IDS:
            for (var i = 0; i < module.exports.list.length; ++i) {
                module.exports.list[i].id = i;
                if (module.exports.list[i].pre)
                    module.exports.list[i].pre = i - module.exports.list[i].pre;
            }
            // TROLOLOLOL:
            if (typeof window !== "undefined") {
                function shuffle(a) {
                    for (let i = a.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [a[i],a[j]] = [a[j], a[i]];
                    }
                    return a;
                }
            }
            /***/
        },
        /***/
        "./src/js/data/mapManager.js": /*!***********************************!*\
  !*** ./src/js/data/mapManager.js ***!
  \***********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // GLOBAL MAPMANAGER:
            module.exports = {};
            /***/
        },
        /***/
        "./src/js/data/objectManager.js": /*!**************************************!*\
  !*** ./src/js/data/objectManager.js ***!
  \**************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            var mathFloor = Math.floor;
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            module.exports = function(GameObject, gameObjects, UTILS, config, players, server) {
                this.objects = gameObjects;
                this.grids = {};
                this.updateObjects = [];
                // SET OBJECT GRIDS:
                var tmpX, tmpY;
                var tmpS = config.mapScale / config.colGrid;
                this.setObjectGrids = function(obj) {
                    var objX = Math.min(config.mapScale, Math.max(0, obj.x));
                    var objY = Math.min(config.mapScale, Math.max(0, obj.y));
                    for (var x = 0; x < config.colGrid; ++x) {
                        tmpX = x * tmpS;
                        for (var y = 0; y < config.colGrid; ++y) {
                            tmpY = y * tmpS;
                            if (objX + obj.scale >= tmpX && objX - obj.scale <= tmpX + tmpS && objY + obj.scale >= tmpY && objY - obj.scale <= tmpY + tmpS) {
                                if (!this.grids[x + "_" + y])
                                    this.grids[x + "_" + y] = [];
                                this.grids[x + "_" + y].push(obj);
                                obj.gridLocations.push(x + "_" + y);
                            }
                        }
                    }
                }
                ;
                // REMOVE OBJECT FROM GRID:
                this.removeObjGrid = function(obj) {
                    var tmpIndx;
                    for (var i = 0; i < obj.gridLocations.length; ++i) {
                        tmpIndx = this.grids[obj.gridLocations[i]].indexOf(obj);
                        if (tmpIndx >= 0) {
                            this.grids[obj.gridLocations[i]].splice(tmpIndx, 1);
                        }
                    }
                }
                ;
                // DISABLE OBJ:
                this.disableObj = function(obj) {
                    obj.active = false;
                    if (server) {
                        if (obj.owner && obj.pps)
                            obj.owner.pps -= obj.pps;
                        this.removeObjGrid(obj);
                        var tmpIndx = this.updateObjects.indexOf(obj);
                        if (tmpIndx >= 0) {
                            this.updateObjects.splice(tmpIndx, 1);
                        }
                    }
                }
                ;
                // HIT OBJECT:
                this.hitObj = function(tmpObj, tmpDir) {
                    for (var p = 0; p < players.length; ++p) {
                        if (players[p].active) {
                            if (tmpObj.sentTo[players[p].id]) {
                                if (!tmpObj.active)
                                    server.send(players[p].id, "12", tmpObj.sid);
                                else if (players[p].canSee(tmpObj))
                                    server.send(players[p].id, "8", UTILS.fixTo(tmpDir, 1), tmpObj.sid);
                            }
                            if (!tmpObj.active && tmpObj.owner == players[p])
                                players[p].changeItemCount(tmpObj.group.id, -1);
                        }
                    }
                }
                ;
                // GET GRID ARRAY:
                var tmpArray = [];
                var tmpGrid;
                this.getGridArrays = function(xPos, yPos, s) {
                    tmpX = mathFloor(xPos / tmpS);
                    tmpY = mathFloor(yPos / tmpS);
                    tmpArray.length = 0;
                    try {
                        if (this.grids[tmpX + "_" + tmpY])
                            tmpArray.push(this.grids[tmpX + "_" + tmpY]);
                        if (xPos + s >= (tmpX + 1) * tmpS) {
                            // RIGHT
                            tmpGrid = this.grids[tmpX + 1 + "_" + tmpY];
                            if (tmpGrid)
                                tmpArray.push(tmpGrid);
                            if (tmpY && yPos - s <= tmpY * tmpS) {
                                // TOP RIGHT
                                tmpGrid = this.grids[tmpX + 1 + "_" + (tmpY - 1)];
                                if (tmpGrid)
                                    tmpArray.push(tmpGrid);
                            } else if (yPos + s >= (tmpY + 1) * tmpS) {
                                // BOTTOM RIGHT
                                tmpGrid = this.grids[tmpX + 1 + "_" + (tmpY + 1)];
                                if (tmpGrid)
                                    tmpArray.push(tmpGrid);
                            }
                        }
                        if (tmpX && xPos - s <= tmpX * tmpS) {
                            // LEFT
                            tmpGrid = this.grids[tmpX - 1 + "_" + tmpY];
                            if (tmpGrid)
                                tmpArray.push(tmpGrid);
                            if (tmpY && yPos - s <= tmpY * tmpS) {
                                // TOP LEFT
                                tmpGrid = this.grids[tmpX - 1 + "_" + (tmpY - 1)];
                                if (tmpGrid)
                                    tmpArray.push(tmpGrid);
                            } else if (yPos + s >= (tmpY + 1) * tmpS) {
                                // BOTTOM LEFT
                                tmpGrid = this.grids[tmpX - 1 + "_" + (tmpY + 1)];
                                if (tmpGrid)
                                    tmpArray.push(tmpGrid);
                            }
                        }
                        if (yPos + s >= (tmpY + 1) * tmpS) {
                            // BOTTOM
                            tmpGrid = this.grids[tmpX + "_" + (tmpY + 1)];
                            if (tmpGrid)
                                tmpArray.push(tmpGrid);
                        }
                        if (tmpY && yPos - s <= tmpY * tmpS) {
                            // TOP
                            tmpGrid = this.grids[tmpX + "_" + (tmpY - 1)];
                            if (tmpGrid)
                                tmpArray.push(tmpGrid);
                        }
                    } catch (e) {}
                    return tmpArray;
                }
                ;
                // ADD NEW:
                var tmpObj;
                this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                    tmpObj = gameObjects.find((tmp)=>tmp.sid == sid);
                    if (!tmpObj) {
                        tmpObj = gameObjects.find((tmp)=>!tmp.active);
                        if (!tmpObj) {
                            tmpObj = new GameObject(sid);
                            gameObjects.push(tmpObj);
                        }
                    }
                    if (setSID)
                        tmpObj.sid = sid;
                    tmpObj.init(x, y, dir, s, type, data, owner);
                    if (server) {
                        this.setObjectGrids(tmpObj);
                        if (tmpObj.doUpdate)
                            this.updateObjects.push(tmpObj);
                    }
                }
                ;
                // DISABLE BY SID:
                this.disableBySid = function(sid) {
                    let find = gameObjects.find((tmp)=>tmp.sid == sid);
                    if (find) {
                        this.disableObj(find);
                    }
                }
                ;
                // REMOVE ALL FROM PLAYER:
                this.removeAllItems = function(sid, server) {
                    gameObjects.filter((tmp)=>tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp)=>this.disableObj(tmp));
                    if (server) {
                        server.broadcast("13", sid);
                    }
                }
                ;
                // FETCH SPAWN OBJECT:
                this.fetchSpawnObj = function(sid) {
                    var tmpLoc = null;
                    for (var i = 0; i < gameObjects.length; ++i) {
                        tmpObj = gameObjects[i];
                        if (tmpObj.active && tmpObj.owner && tmpObj.owner.sid == sid && tmpObj.spawnPoint) {
                            tmpLoc = [tmpObj.x, tmpObj.y];
                            this.disableObj(tmpObj);
                            server.broadcast("12", tmpObj.sid);
                            if (tmpObj.owner) {
                                tmpObj.owner.changeItemCount(tmpObj.group.id, -1);
                            }
                            break;
                        }
                    }
                    return tmpLoc;
                }
                ;
                // CHECK IF PLACABLE:
                this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                    let cantPlace = gameObjects.find((tmp)=>tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                    if (cantPlace) {
                        return false;
                    }
                    if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) {
                        return false;
                    }
                    return true;
                }
                ;
                // ADD PROJECTILE:
                this.addProjectile = function(x, y, dir, range, indx) {
                    var tmpData = items.projectiles[indx];
                    var tmpProj = projectiles.find((tmp)=>!tmp.active);
                    if (!tmpProj) {
                        tmpProj = new Projectile(players,UTILS);
                        projectiles.push(tmpProj);
                    }
                    tmpProj.init(indx, x, y, dir, tmpData.speed, range, tmpData.scale);
                }
                ;
                // CHECK PLAYER COLLISION:
                this.checkCollision = function(player, other, delta) {
                    delta = delta || 1;
                    var dx = player.x - other.x;
                    var dy = player.y - other.y;
                    var tmpLen = player.scale + other.scale;
                    if (mathABS(dx) <= tmpLen || mathABS(dy) <= tmpLen) {
                        tmpLen = player.scale + (other.getScale ? other.getScale() : other.scale);
                        var tmpInt = mathSQRT(dx * dx + dy * dy) - tmpLen;
                        if (tmpInt <= 0) {
                            if (!other.ignoreCollision) {
                                var tmpDir = UTILS.getDirection(player.x, player.y, other.x, other.y);
                                var tmpDist = UTILS.getDistance(player.x, player.y, other.x, other.y);
                                if (other.isPlayer) {
                                    tmpInt = (tmpInt * -1) / 2;
                                    player.x += tmpInt * mathCOS(tmpDir);
                                    player.y += tmpInt * mathSIN(tmpDir);
                                    other.x -= tmpInt * mathCOS(tmpDir);
                                    other.y -= tmpInt * mathSIN(tmpDir);
                                } else {
                                    player.x = other.x + tmpLen * mathCOS(tmpDir);
                                    player.y = other.y + tmpLen * mathSIN(tmpDir);
                                    player.xVel *= 0.75;
                                    player.yVel *= 0.75;
                                }
                                if (other.dmg && other.owner != player && !(other.owner && other.owner.team && other.owner.team == player.team)) {
                                    player.changeHealth(-other.dmg, other.owner, other);
                                    var tmpSpd = 1.5 * (other.weightM || 1);
                                    player.xVel += tmpSpd * mathCOS(tmpDir);
                                    player.yVel += tmpSpd * mathSIN(tmpDir);
                                    if (other.pDmg && !(player.skin && player.skin.poisonRes)) {
                                        player.dmgOverTime.dmg = other.pDmg;
                                        player.dmgOverTime.time = 5;
                                        player.dmgOverTime.doer = other.owner;
                                    }
                                    if (player.colDmg && other.health) {
                                        if (other.changeHealth(-player.colDmg))
                                            this.disableObj(other);
                                        this.hitObj(other, UTILS.getDirection(player.x, player.y, other.x, other.y));
                                    }
                                }
                            } else if (other.trap && !player.noTrap && other.owner != player && !(other.owner && other.owner.team && other.owner.team == player.team)) {
                                player.lockMove = true;
                                other.hideFromEnemy = false;
                            } else if (other.boostSpeed) {
                                player.xVel += delta * other.boostSpeed * (other.weightM || 1) * mathCOS(other.dir);
                                player.yVel += delta * other.boostSpeed * (other.weightM || 1) * mathSIN(other.dir);
                            } else if (other.healCol) {
                                player.healCol = other.healCol;
                            } else if (other.teleport) {
                                player.x = UTILS.randInt(0, config.mapScale);
                                player.y = UTILS.randInt(0, config.mapScale);
                            }
                            if (other.zIndex > player.zIndex)
                                player.zIndex = other.zIndex;
                            return true;
                        }
                    }
                    return false;
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/player.js": /*!*******************************!*\
  !*** ./src/js/data/player.js ***!
  \*******************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            var LangFilter = __webpack_require__(/*! bad-words */
                "./node_modules/bad-words/lib/badwords.js");
            var langFilter = new LangFilter();
            var newProfane = ["jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa", ];
            langFilter.addWords(...newProfane);
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            module.exports = function(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                this.id = id;
                this.sid = sid;
                this.tmpScore = 0;
                this.team = null;
                this.skinIndex = 0;
                this.tailIndex = 0;
                this.hitTime = 0;
                this.tails = {};
                for (var i = 0; i < accessories.length; ++i) {
                    if (accessories[i].price <= 0)
                        this.tails[accessories[i].id] = 1;
                }
                this.skins = {};
                for (var i = 0; i < hats.length; ++i) {
                    if (hats[i].price <= 0)
                        this.skins[hats[i].id] = 1;
                }
                this.points = 0;
                this.dt = 0;
                this.rt = 0;
                this.hidden = false;
                this.itemCounts = {};
                this.isPlayer = true;
                this.pps = 0;
                this.moveDir = undefined;
                this.skinRot = 0;
                this.lastPing = 0;
                this.iconIndex = 0;
                this.skinColor = 0;
                this.dangerShame = 5;
                this.projDist = 0;
                // SPAWN:
                this.spawn = function(moofoll) {
                    // ADDED MODULES:
                    this.finded = 0;
                    this.syncThreats = 0;
                    this.primaryIndex = undefined;
                    this.secondaryIndex = undefined;
                    this.primaryVariant = undefined;
                    this.secondaryVariant = undefined;
                    this.gatherIndex = undefined;
                    this.shootIndex = undefined;
                    this.bowThreat = {
                        9: 0,
                        12: 0,
                        13: 0,
                        15: 0,
                    };
                    this.aim2 = 0;
                    this.dist2 = 0;
                    this.aim3 = 0;
                    this.dist3 = 0;
                    this.notHere = false;
                    this.bTick = 0;
                    this.pCount = 0;
                    this.hitted = false;
                    this.anti = false;
                    this.healSid = -1;
                    this.damaged = false;
                    this.active = true;
                    this.alive = true;
                    this.lockMove = false;
                    this.lockDir = false;
                    this.minimapCounter = 0;
                    this.chatCountdown = 0;
                    this.shameCount = 0;
                    this.shameTimer = 0;
                    this.antiClown = 4;
                    this.maxShame = 7;
                    this.sentTo = {};
                    this.gathering = 0;
                    this.shooting = {};
                    this.autoGather = 0;
                    this.animTime = 0;
                    this.animSpeed = 0;
                    this.mouseState = 0;
                    this.buildIndex = -1;
                    this.weaponIndex = 0;
                    this.dmgOverTime = {};
                    this.noMovTimer = 0;
                    this.maxXP = 300;
                    this.XP = 0;
                    this.age = 1;
                    this.kills = 0;
                    this.upgrAge = 2;
                    this.upgradePoints = 0;
                    this.x = 0;
                    this.y = 0;
                    this.zIndex = 0;
                    this.xVel = 0;
                    this.yVel = 0;
                    this.slowMult = 1;
                    this.dir = 0;
                    this.dirPlus = 0;
                    this.targetDir = 0;
                    this.targetAngle = 0;
                    this.maxHealth = 100;
                    this.health = this.maxHealth;
                    this.scale = config.playerScale;
                    this.speed = config.playerSpeed;
                    this.resetMoveDir();
                    this.resetResources(moofoll);
                    this.firstItems = [0, 3, 6, 10];
                    this.items = [0, 3, 6, 10];
                    this.weapons = [0];
                    this.shootCount = 0;
                    this.weaponXP = [];
                    this.reloads = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                        12: 0,
                        13: 0,
                        14: 0,
                        15: 0,
                        53: 0,
                    };
                    this.oldReloads = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                        12: 0,
                        13: 0,
                        14: 0,
                        15: 0,
                        53: 0,
                    };
                    this.turretReloaded = false;
                    this.doTickUpdate = false;
                    this.instaThreat = 0;
                }
                ;
                // RESET MOVE DIR:
                this.resetMoveDir = function() {
                    this.moveDir = undefined;
                }
                ;
                // RESET RESOURCES:
                this.resetResources = function(moofoll) {
                    for (var i = 0; i < config.resourceTypes.length; ++i) {
                        this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                    }
                }
                ;
                // ADD ITEM:
                this.addItem = function(id) {
                    var tmpItem = items.list[id];
                    if (tmpItem) {
                        for (var i = 0; i < this.items.length; ++i) {
                            if (items.list[this.items[i]].group == tmpItem.group) {
                                if (this.buildIndex == this.items[i])
                                    this.buildIndex = id;
                                this.items[i] = id;
                                return true;
                            }
                        }
                        this.items.push(id);
                        return true;
                    }
                    return false;
                }
                ;
                // SET USER DATA:
                this.setUserData = function(data) {
                    if (data) {
                        // SET INITIAL NAME:
                        this.name = "unknown";
                        // VALIDATE NAME:
                        var name = data.name + "";
                        name = name.slice(0, config.maxNameLength);
                        name = name.replace(/[^\w:\(\)\/? -]+/gim, " ");
                        // USE SPACE SO WE CAN CHECK PROFANITY
                        name = name.replace(/[^\x00-\x7F]/g, " ");
                        name = name.trim();
                        // CHECK IF IS PROFANE:
                        var isProfane = false;
                        var convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                        for (var word of langFilter.list) {
                            if (convertedName.indexOf(word) != -1) {
                                isProfane = true;
                                break;
                            }
                        }
                        if (name.length > 0 && !isProfane) {
                            this.name = name;
                        }
                        // SKIN:
                        this.skinColor = 0;
                        if (config.skinColors[data.skin])
                            this.skinColor = data.skin;
                    }
                }
                ;
                // GET DATA TO SEND:
                this.getData = function() {
                    return [this.id, this.sid, this.name, UTILS.fixTo(this.x, 2), UTILS.fixTo(this.y, 2), UTILS.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor, ];
                }
                ;
                // SET DATA:
                this.setData = function(data) {
                    this.id = data[0];
                    this.sid = data[1];
                    this.name = data[2];
                    this.x = data[3];
                    this.y = data[4];
                    this.dir = data[5];
                    this.health = data[6];
                    this.maxHealth = data[7];
                    this.scale = data[8];
                    this.skinColor = data[9];
                }
                ;
                // UPDATE:
                var timerCount = 0;
                this.update = function(delta) {
                    if (!this.alive)
                        return;
                    // SHAME SHAME SHAME:
                    if (this.shameTimer > 0) {
                        this.shameTimer -= delta;
                        if (this.shameTimer <= 0) {
                            this.shameTimer = 0;
                            this.shameCount = 0;
                        }
                    }
                    // REGENS AND AUTO:
                    timerCount -= delta;
                    if (timerCount <= 0) {
                        var regenAmount = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
                        if (regenAmount) {
                            this.changeHealth(regenAmount, this);
                        }
                        if (this.dmgOverTime.dmg) {
                            this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                            this.dmgOverTime.time -= 1;
                            if (this.dmgOverTime.time <= 0)
                                this.dmgOverTime.dmg = 0;
                        }
                        if (this.healCol) {
                            this.changeHealth(this.healCol, this);
                        }
                        timerCount = 1000;
                    }
                    // CHECK KILL:
                    if (!this.alive)
                        return;
                    // SLOWER:
                    if (this.slowMult < 1) {
                        this.slowMult += 0.0008 * delta;
                        if (this.slowMult > 1)
                            this.slowMult = 1;
                    }
                    // MOVE:
                    this.noMovTimer += delta;
                    if (this.xVel || this.yVel)
                        this.noMovTimer = 0;
                    if (this.lockMove) {
                        this.xVel = 0;
                        this.yVel = 0;
                    } else {
                        var spdMult = (this.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (this.skin ? this.skin.spdMult || 1 : 1) * (this.tail ? this.tail.spdMult || 1 : 1) * (this.y <= config.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : config.snowSpeed : 1) * this.slowMult;
                        if (!this.zIndex && this.y >= config.mapScale / 2 - config.riverWidth / 2 && this.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            if (this.skin && this.skin.watrImm) {
                                spdMult *= 0.75;
                                this.xVel += config.waterCurrent * 0.4 * delta;
                            } else {
                                spdMult *= 0.33;
                                this.xVel += config.waterCurrent * delta;
                            }
                        }
                        var xVel = this.moveDir != undefined ? mathCOS(this.moveDir) : 0;
                        var yVel = this.moveDir != undefined ? mathSIN(this.moveDir) : 0;
                        var length = mathSQRT(xVel * xVel + yVel * yVel);
                        if (length != 0) {
                            xVel /= length;
                            yVel /= length;
                        }
                        if (xVel)
                            this.xVel += xVel * this.speed * spdMult * delta;
                        if (yVel)
                            this.yVel += yVel * this.speed * spdMult * delta;
                    }
                    // OBJECT COLL:
                    this.zIndex = 0;
                    this.lockMove = false;
                    this.healCol = 0;
                    var tmpList;
                    var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                    var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                    var tMlt = 1 / depth;
                    for (var i = 0; i < depth; ++i) {
                        if (this.xVel)
                            this.x += this.xVel * delta * tMlt;
                        if (this.yVel)
                            this.y += this.yVel * delta * tMlt;
                        tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active)
                                    objectManager.checkCollision(this, tmpList[x][y], tMlt);
                            }
                        }
                    }
                    // PLAYER COLLISIONS:
                    var tmpIndx = players.indexOf(this);
                    for (var i = tmpIndx + 1; i < players.length; ++i) {
                        if (players[i] != this && players[i].alive)
                            objectManager.checkCollision(this, players[i]);
                    }
                    // DECEL:
                    if (this.xVel) {
                        this.xVel *= mathPOW(config.playerDecel, delta);
                        if (this.xVel <= 0.01 && this.xVel >= -0.01)
                            this.xVel = 0;
                    }
                    if (this.yVel) {
                        this.yVel *= mathPOW(config.playerDecel, delta);
                        if (this.yVel <= 0.01 && this.yVel >= -0.01)
                            this.yVel = 0;
                    }
                    // MAP BOUNDARIES:
                    if (this.x - this.scale < 0) {
                        this.x = this.scale;
                    } else if (this.x + this.scale > config.mapScale) {
                        this.x = config.mapScale - this.scale;
                    }
                    if (this.y - this.scale < 0) {
                        this.y = this.scale;
                    } else if (this.y + this.scale > config.mapScale) {
                        this.y = config.mapScale - this.scale;
                    }
                    // USE WEAPON OR TOOL:
                    if (this.buildIndex < 0) {
                        if (this.reloads[this.weaponIndex] > 0) {
                            this.reloads[this.weaponIndex] -= delta;
                            this.gathering = this.mouseState;
                        } else if (this.gathering || this.autoGather) {
                            var worked = true;
                            if (items.weapons[this.weaponIndex].gather != undefined) {
                                this.gather(players);
                            } else if (items.weapons[this.weaponIndex].projectile != undefined && this.hasRes(items.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                                this.useRes(items.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0);
                                this.noMovTimer = 0;
                                var tmpIndx = items.weapons[this.weaponIndex].projectile;
                                var projOffset = this.scale * 2;
                                var aMlt = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                                if (items.weapons[this.weaponIndex].rec) {
                                    this.xVel -= items.weapons[this.weaponIndex].rec * mathCOS(this.dir);
                                    this.yVel -= items.weapons[this.weaponIndex].rec * mathSIN(this.dir);
                                }
                                projectileManager.addProjectile(this.x + projOffset * mathCOS(this.dir), this.y + projOffset * mathSIN(this.dir), this.dir, items.projectiles[tmpIndx].range * aMlt, items.projectiles[tmpIndx].speed * aMlt, tmpIndx, this, null, this.zIndex);
                            } else {
                                worked = false;
                            }
                            this.gathering = this.mouseState;
                            if (worked) {
                                this.reloads[this.weaponIndex] = items.weapons[this.weaponIndex].speed * (this.skin ? this.skin.atkSpd || 1 : 1);
                            }
                        }
                    }
                }
                ;
                // ADD WEAPON XP:
                this.addWeaponXP = function(amnt) {
                    if (!this.weaponXP[this.weaponIndex])
                        this.weaponXP[this.weaponIndex] = 0;
                    this.weaponXP[this.weaponIndex] += amnt;
                    if (this.weaponIndex == this.weapons[0]) {
                        getEl("priXP").innerHTML = "Primary XP: " + this.weaponXP[this.weapons[0]] + " / " + config.weaponXPs[this.weaponVariant].xp;
                    } else if (this.weaponIndex == this.weapons[1]) {
                        getEl("secXP").innerHTML = "Secondary XP: " + this.weaponXP[this.weapons[1]] + " / " + config.weaponXPs[this.weaponVariant].xp;
                    }
                }
                ;
                // EARN XP:
                this.earnXP = function(amount) {
                    if (this.age < config.maxAge) {
                        this.XP += amount;
                        if (this.XP >= this.maxXP) {
                            if (this.age < config.maxAge) {
                                this.age++;
                                this.XP = 0;
                                this.maxXP *= 1.2;
                            } else {
                                this.XP = this.maxXP;
                            }
                            this.upgradePoints++;
                            server.send(this.id, "16", this.upgradePoints, this.upgrAge);
                            server.send(this.id, "15", this.XP, UTILS.fixTo(this.maxXP, 1), this.age);
                        } else {
                            server.send(this.id, "15", this.XP);
                        }
                    }
                }
                ;
                // CHANGE HEALTH:
                this.changeHealth = function(amount, doer) {
                    if (amount > 0 && this.health >= this.maxHealth)
                        return false;
                    if (amount < 0 && this.skin)
                        amount *= this.skin.dmgMult || 1;
                    if (amount < 0 && this.tail)
                        amount *= this.tail.dmgMult || 1;
                    if (amount < 0)
                        this.hitTime = Date.now();
                    this.health += amount;
                    if (this.health > this.maxHealth) {
                        amount -= this.health - this.maxHealth;
                        this.health = this.maxHealth;
                    }
                    if (this.health <= 0)
                        this.kill(doer);
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id])
                            server.send(players[i].id, "h", this.sid, Math.round(this.health));
                    }
                    if (doer && doer.canSee(this) && !(doer == this && amount < 0)) {
                        server.send(doer.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-amount), 1);
                    }
                    return true;
                }
                ;
                // KILL:
                this.kill = function(doer) {
                    if (doer && doer.alive) {
                        doer.kills++;
                        if (doer.skin && doer.skin.goldSteal)
                            scoreCallback(doer, Math.round(this.points / 2));
                        else
                            scoreCallback(doer, Math.round(this.age * 100 * (doer.skin && doer.skin.kScrM ? doer.skin.kScrM : 1)));
                        server.send(doer.id, "9", "kills", doer.kills, 1);
                    }
                    this.alive = false;
                    server.send(this.id, "11");
                    iconCallback();
                }
                ;
                // ADD RESOURCE:
                this.addResource = function(type, amount, auto) {
                    if (!auto && amount > 0)
                        this.addWeaponXP(amount);
                    if (type == 3) {
                        scoreCallback(this, amount, true);
                    } else {
                        this[config.resourceTypes[type]] += amount;
                        server.send(this.id, "9", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
                    }
                }
                ;
                // CHANGE ITEM COUNT:
                this.changeItemCount = function(index, value) {
                    this.itemCounts[index] = this.itemCounts[index] || 0;
                    this.itemCounts[index] += value;
                    server.send(this.id, "14", index, this.itemCounts[index]);
                }
                ;
                // BUILD:
                this.buildItem = function(item) {
                    var tmpS = this.scale + item.scale + (item.placeOffset || 0);
                    var tmpX = this.x + tmpS * mathCOS(this.dir);
                    var tmpY = this.y + tmpS * mathSIN(this.dir);
                    if (this.canBuild(item) && !(item.consume && this.skin && this.skin.noEat) && (item.consume || objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, this))) {
                        var worked = false;
                        if (item.consume) {
                            if (this.hitTime) {
                                var timeSinceHit = Date.now() - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit <= 120) {
                                    this.shameCount++;
                                    if (this.shameCount >= 8) {
                                        this.shameTimer = 30000;
                                        this.shameCount = 0;
                                    }
                                } else {
                                    this.shameCount -= 2;
                                    if (this.shameCount <= 0) {
                                        this.shameCount = 0;
                                    }
                                }
                            }
                            if (this.shameTimer <= 0)
                                worked = item.consume(this);
                        } else {
                            worked = true;
                            if (item.group.limit) {
                                this.changeItemCount(item.group.id, 1);
                            }
                            if (item.pps)
                                this.pps += item.pps;
                            objectManager.add(objectManager.objects.length, tmpX, tmpY, this.dir, item.scale, item.type, item, false, this);
                        }
                        if (worked) {
                            this.useRes(item);
                            this.buildIndex = -1;
                        }
                    }
                }
                ;
                // HAS RESOURCES:
                this.hasRes = function(item, mult) {
                    for (var i = 0; i < item.req.length; ) {
                        if (this[item.req[i]] < Math.round(item.req[i + 1] * (mult || 1)))
                            return false;
                        i += 2;
                    }
                    return true;
                }
                ;
                // USE RESOURCES:
                this.useRes = function(item, mult) {
                    if (config.inSandbox)
                        return;
                    for (var i = 0; i < item.req.length; ) {
                        this.addResource(config.resourceTypes.indexOf(item.req[i]), -Math.round(item.req[i + 1] * (mult || 1)));
                        i += 2;
                    }
                }
                ;
                // CAN BUILD:
                this.canBuild = function(item) {
                    if (config.inSandbox)
                        return true;
                    if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
                        return false;
                    return this.hasRes(item);
                }
                ;
                // GATHER:
                this.gather = function() {
                    // SHOW:
                    this.noMovTimer = 0;
                    // SLOW MOVEMENT:
                    this.slowMult -= items.weapons[this.weaponIndex].hitSlow || 0.3;
                    if (this.slowMult < 0)
                        this.slowMult = 0;
                    // VARIANT DMG:
                    var tmpVariant = config.fetchVariant(this);
                    var applyPoison = tmpVariant.poison;
                    var variantDmg = tmpVariant.val;
                    // CHECK IF HIT GAME OBJECT:
                    var hitObjs = {};
                    var tmpDist, tmpDir, tmpObj, hitSomething;
                    var tmpList = objectManager.getGridArrays(this.x, this.y, items.weapons[this.weaponIndex].range);
                    for (var t = 0; t < tmpList.length; ++t) {
                        for (var i = 0; i < tmpList[t].length; ++i) {
                            tmpObj = tmpList[t][i];
                            if (tmpObj.active && !tmpObj.dontGather && !hitObjs[tmpObj.sid] && tmpObj.visibleToPlayer(this)) {
                                tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - tmpObj.scale;
                                if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                    tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                    if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {
                                        hitObjs[tmpObj.sid] = 1;
                                        if (tmpObj.health) {
                                            if (tmpObj.changeHealth(-items.weapons[this.weaponIndex].dmg * variantDmg * (items.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                                                for (var x = 0; x < tmpObj.req.length; ) {
                                                    this.addResource(config.resourceTypes.indexOf(tmpObj.req[x]), tmpObj.req[x + 1]);
                                                    x += 2;
                                                }
                                                objectManager.disableObj(tmpObj);
                                            }
                                        } else {
                                            this.earnXP(4 * items.weapons[this.weaponIndex].gather);
                                            var count = items.weapons[this.weaponIndex].gather + (tmpObj.type == 3 ? 4 : 0);
                                            if (this.skin && this.skin.extraGold) {
                                                this.addResource(3, 1);
                                            }
                                            this.addResource(tmpObj.type, count);
                                        }
                                        hitSomething = true;
                                        objectManager.hitObj(tmpObj, tmpDir);
                                    }
                                }
                            }
                        }
                    }
                    // CHECK IF HIT PLAYER:
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj != this && tmpObj.alive && !(tmpObj.team && tmpObj.team == this.team)) {
                            tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - tmpObj.scale * 1.8;
                            if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {
                                    // STEAL RESOURCES:
                                    var stealCount = items.weapons[this.weaponIndex].steal;
                                    if (stealCount && tmpObj.addResource) {
                                        stealCount = Math.min(tmpObj.points || 0, stealCount);
                                        this.addResource(3, stealCount);
                                        tmpObj.addResource(3, -stealCount);
                                    }
                                    // MELEE HIT PLAYER:
                                    var dmgMlt = variantDmg;
                                    if (tmpObj.weaponIndex != undefined && items.weapons[tmpObj.weaponIndex].shield && UTILS.getAngleDist(tmpDir + Math.PI, tmpObj.dir) <= config.shieldAngle) {
                                        dmgMlt = items.weapons[tmpObj.weaponIndex].shield;
                                    }
                                    var dmgVal = items.weapons[this.weaponIndex].dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1);
                                    var tmpSpd = 0.3 * (tmpObj.weightM || 1) + (items.weapons[this.weaponIndex].knock || 0);
                                    tmpObj.xVel += tmpSpd * mathCOS(tmpDir);
                                    tmpObj.yVel += tmpSpd * mathSIN(tmpDir);
                                    if (this.skin && this.skin.healD)
                                        this.changeHealth(dmgVal * dmgMlt * this.skin.healD, this);
                                    if (this.tail && this.tail.healD)
                                        this.changeHealth(dmgVal * dmgMlt * this.tail.healD, this);
                                    if (tmpObj.skin && tmpObj.skin.dmg && dmgMlt == 1)
                                        this.changeHealth(-dmgVal * tmpObj.skin.dmg, tmpObj);
                                    if (tmpObj.tail && tmpObj.tail.dmg && dmgMlt == 1)
                                        this.changeHealth(-dmgVal * tmpObj.tail.dmg, tmpObj);
                                    if (tmpObj.dmgOverTime && this.skin && this.skin.poisonDmg && !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = this.skin.poisonDmg;
                                        tmpObj.dmgOverTime.time = this.skin.poisonTime || 1;
                                        tmpObj.dmgOverTime.doer = this;
                                    }
                                    if (tmpObj.dmgOverTime && applyPoison && !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = 5;
                                        tmpObj.dmgOverTime.time = 5;
                                        tmpObj.dmgOverTime.doer = this;
                                    }
                                    if (tmpObj.skin && tmpObj.skin.dmgK) {
                                        this.xVel -= tmpObj.skin.dmgK * mathCOS(tmpDir);
                                        this.yVel -= tmpObj.skin.dmgK * mathSIN(tmpDir);
                                    }
                                    tmpObj.changeHealth(-dmgVal * dmgMlt, this, this);
                                }
                            }
                        }
                    }
                    // SEND FOR ANIMATION:
                    this.sendAnimation(hitSomething ? 1 : 0);
                }
                ;
                // SEND ANIMATION:
                this.sendAnimation = function(hit) {
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id] && this.canSee(players[i])) {
                            server.send(players[i].id, "7", this.sid, hit ? 1 : 0, this.weaponIndex);
                        }
                    }
                }
                ;
                // ANIMATE:
                var tmpRatio = 0;
                var animIndex = 0;
                this.animate = function(delta) {
                    if (this.animTime > 0) {
                        this.animTime -= delta;
                        if (this.animTime <= 0) {
                            this.animTime = 0;
                            this.dirPlus = 0;
                            tmpRatio = 0;
                            animIndex = 0;
                        } else {
                            if (animIndex == 0) {
                                tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                if (tmpRatio >= 1) {
                                    tmpRatio = 1;
                                    animIndex = 1;
                                }
                            } else {
                                tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                            }
                        }
                    }
                }
                ;
                // GATHER ANIMATION:
                this.startAnim = function(didHit, index) {
                    this.animTime = this.animSpeed = items.weapons[index].speed;
                    this.targetAngle = didHit ? -config.hitAngle : -Math.PI;
                    tmpRatio = 0;
                    animIndex = 0;
                }
                ;
                // CAN SEE:
                this.canSee = function(other) {
                    if (!other)
                        return false;
                    if (other.skin && other.skin.invisTimer && other.noMovTimer >= other.skin.invisTimer)
                        return false;
                    var dx = mathABS(other.x - this.x) - other.scale;
                    var dy = mathABS(other.y - this.y) - other.scale;
                    return (dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3);
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/projectile.js": /*!***********************************!*\
  !*** ./src/js/data/projectile.js ***!
  \***********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = function(players, ais, objectManager, items, config, UTILS, server) {
                // INIT:
                this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                    this.active = true;
                    this.indx = indx;
                    this.x = x;
                    this.y = y;
                    this.dir = dir;
                    this.skipMov = true;
                    this.speed = spd;
                    this.dmg = dmg;
                    this.scale = scl;
                    this.range = rng;
                    this.owner = owner;
                    if (server)
                        this.sentTo = {};
                }
                ;
                // UPDATE:
                var objectsHit = [];
                var tmpObj;
                this.update = function(delta) {
                    if (this.active) {
                        var tmpSpeed = this.speed * delta;
                        var tmpScale;
                        if (!this.skipMov) {
                            this.x += tmpSpeed * Math.cos(this.dir);
                            this.y += tmpSpeed * Math.sin(this.dir);
                            this.range -= tmpSpeed;
                            if (this.range <= 0) {
                                this.x += this.range * Math.cos(this.dir);
                                this.y += this.range * Math.sin(this.dir);
                                tmpSpeed = 1;
                                this.range = 0;
                                this.active = false;
                            }
                        } else {
                            this.skipMov = false;
                        }
                        if (server) {
                            for (var i = 0; i < players.length; ++i) {
                                if (!this.sentTo[players[i].id] && players[i].canSee(this)) {
                                    this.sentTo[players[i].id] = 1;
                                    server.send(players[i].id, "18", UTILS.fixTo(this.x, 1), UTILS.fixTo(this.y, 1), UTILS.fixTo(this.dir, 2), UTILS.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid);
                                }
                            }
                            objectsHit.length = 0;
                            for (var i = 0; i < players.length + ais.length; ++i) {
                                tmpObj = players[i] || ais[i - players.length];
                                if (tmpObj.alive && tmpObj != this.owner && !(this.owner.team && tmpObj.team == this.owner.team)) {
                                    if (UTILS.lineInRect(tmpObj.x - tmpObj.scale, tmpObj.y - tmpObj.scale, tmpObj.x + tmpObj.scale, tmpObj.y + tmpObj.scale, this.x, this.y, this.x + tmpSpeed * Math.cos(this.dir), this.y + tmpSpeed * Math.sin(this.dir))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }
                            var tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                            for (var x = 0; x < tmpList.length; ++x) {
                                for (var y = 0; y < tmpList[x].length; ++y) {
                                    tmpObj = tmpList[x][y];
                                    tmpScale = tmpObj.getScale();
                                    if (tmpObj.active && !(this.ignoreObj == tmpObj.sid) && this.layer <= tmpObj.layer && objectsHit.indexOf(tmpObj) < 0 && !tmpObj.ignoreCollision && UTILS.lineInRect(tmpObj.x - tmpScale, tmpObj.y - tmpScale, tmpObj.x + tmpScale, tmpObj.y + tmpScale, this.x, this.y, this.x + tmpSpeed * Math.cos(this.dir), this.y + tmpSpeed * Math.sin(this.dir))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }
                            // HIT OBJECTS:
                            if (objectsHit.length > 0) {
                                var hitObj = null;
                                var shortDist = null;
                                var tmpDist = null;
                                for (var i = 0; i < objectsHit.length; ++i) {
                                    tmpDist = UTILS.getDistance(this.x, this.y, objectsHit[i].x, objectsHit[i].y);
                                    if (shortDist == null || tmpDist < shortDist) {
                                        shortDist = tmpDist;
                                        hitObj = objectsHit[i];
                                    }
                                }
                                if (hitObj.isPlayer || hitObj.isAI) {
                                    var tmpSd = 0.3 * (hitObj.weightM || 1);
                                    hitObj.xVel += tmpSd * Math.cos(this.dir);
                                    hitObj.yVel += tmpSd * Math.sin(this.dir);
                                    if (hitObj.weaponIndex == undefined || !(items.weapons[hitObj.weaponIndex].shield && UTILS.getAngleDist(this.dir + Math.PI, hitObj.dir) <= config.shieldAngle)) {
                                        hitObj.changeHealth(-this.dmg, this.owner, this.owner);
                                    }
                                } else {
                                    if (hitObj.projDmg && hitObj.health && hitObj.changeHealth(-this.dmg)) {
                                        objectManager.disableObj(hitObj);
                                    }
                                    for (var i = 0; i < players.length; ++i) {
                                        if (players[i].active) {
                                            if (hitObj.sentTo[players[i].id]) {
                                                if (hitObj.active) {
                                                    if (players[i].canSee(hitObj))
                                                        server.send(players[i].id, "8", UTILS.fixTo(this.dir, 2), hitObj.sid);
                                                } else {
                                                    server.send(players[i].id, "12", hitObj.sid);
                                                }
                                            }
                                            if (!hitObj.active && hitObj.owner == players[i])
                                                players[i].changeItemCount(hitObj.group.id, -1);
                                        }
                                    }
                                }
                                this.active = false;
                                for (var i = 0; i < players.length; ++i) {
                                    if (this.sentTo[players[i].id])
                                        server.send(players[i].id, "19", this.sid, UTILS.fixTo(shortDist, 1));
                                }
                            }
                        }
                    }
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/projectileManager.js": /*!******************************************!*\
  !*** ./src/js/data/projectileManager.js ***!
  \******************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            module.exports = function(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
                    var tmpData = items.projectiles[indx];
                    var tmpProj = projectiles.find((tmp)=>!tmp.active);
                    if (!tmpProj) {
                        tmpProj = new Projectile(players,ais,objectManager,items,config,UTILS,server);
                        tmpProj.sid = projectiles.length;
                        projectiles.push(tmpProj);
                    }
                    tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                    tmpProj.ignoreObj = ignoreObj;
                    tmpProj.layer = layer || tmpData.layer;
                    tmpProj.src = tmpData.src;
                    return tmpProj;
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/data/store.js": /*!******************************!*\
  !*** ./src/js/data/store.js ***!
  \******************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // STORE HATS:
            module.exports.hats = [{
                id: 45,
                name: "Shame!",
                dontSell: true,
                price: 0,
                scale: 120,
                desc: "hacks are for losers",
            }, {
                id: 51,
                name: "Moo Cap",
                price: 0,
                scale: 120,
                desc: "coolest mooer around",
            }, {
                id: 50,
                name: "Apple Cap",
                price: 0,
                scale: 120,
                desc: "apple farms remembers",
            }, {
                id: 28,
                name: "Moo Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 29,
                name: "Pig Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 30,
                name: "Fluff Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 36,
                name: "Pandou Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 37,
                name: "Bear Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 38,
                name: "Monkey Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 44,
                name: "Polar Head",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 35,
                name: "Fez Hat",
                price: 0,
                scale: 120,
                desc: "no effect",
            }, {
                id: 42,
                name: "Enigma Hat",
                price: 0,
                scale: 120,
                desc: "join the enigma army",
            }, {
                id: 43,
                name: "Blitz Hat",
                price: 0,
                scale: 120,
                desc: "hey everybody i'm blitz",
            }, {
                id: 49,
                name: "Bob XIII Hat",
                price: 0,
                scale: 120,
                desc: "like and subscribe",
            }, {
                id: 57,
                name: "Pumpkin",
                price: 50,
                scale: 120,
                desc: "Spooooky",
            }, {
                id: 8,
                name: "Bummle Hat",
                price: 100,
                scale: 120,
                desc: "no effect",
            }, {
                id: 2,
                name: "Straw Hat",
                price: 500,
                scale: 120,
                desc: "no effect",
            }, {
                id: 15,
                name: "Winter Cap",
                price: 600,
                scale: 120,
                desc: "allows you to move at normal speed in snow",
                coldM: 1,
            }, {
                id: 5,
                name: "Cowboy Hat",
                price: 1000,
                scale: 120,
                desc: "no effect",
            }, {
                id: 4,
                name: "Ranger Hat",
                price: 2000,
                scale: 120,
                desc: "no effect",
            }, {
                id: 18,
                name: "Explorer Hat",
                price: 2000,
                scale: 120,
                desc: "no effect",
            }, {
                id: 31,
                name: "Flipper Hat",
                price: 2500,
                scale: 120,
                desc: "have more control while in water",
                watrImm: true,
            }, {
                id: 1,
                name: "Marksman Cap",
                price: 3000,
                scale: 120,
                desc: "increases arrow speed and range",
                aMlt: 1.3,
            }, {
                id: 10,
                name: "Bush Gear",
                price: 3000,
                scale: 160,
                desc: "allows you to disguise yourself as a bush",
            }, {
                id: 48,
                name: "Halo",
                price: 3000,
                scale: 120,
                desc: "no effect",
            }, {
                id: 6,
                name: "Soldier Helmet",
                price: 4000,
                scale: 120,
                desc: "reduces damage taken but slows movement",
                spdMult: 0.94,
                dmgMult: 0.75,
            }, {
                id: 23,
                name: "Anti Venom Gear",
                price: 4000,
                scale: 120,
                desc: "makes you immune to poison",
                poisonRes: 1,
            }, {
                id: 13,
                name: "Medic Gear",
                price: 5000,
                scale: 110,
                desc: "slowly regenerates health over time",
                healthRegen: 3,
            }, {
                id: 9,
                name: "Miners Helmet",
                price: 5000,
                scale: 120,
                desc: "earn 1 extra gold per resource",
                extraGold: 1,
            }, {
                id: 32,
                name: "Musketeer Hat",
                price: 5000,
                scale: 120,
                desc: "reduces cost of projectiles",
                projCost: 0.5,
            }, {
                id: 7,
                name: "Bull Helmet",
                price: 6000,
                scale: 120,
                desc: "increases damage done but drains health",
                healthRegen: -5,
                dmgMultO: 1.5,
                spdMult: 0.96,
            }, {
                id: 22,
                name: "Emp Helmet",
                price: 6000,
                scale: 120,
                desc: "turrets won't attack but you move slower",
                antiTurret: 1,
                spdMult: 0.7,
            }, {
                id: 12,
                name: "Booster Hat",
                price: 6000,
                scale: 120,
                desc: "increases your movement speed",
                spdMult: 1.16,
            }, {
                id: 26,
                name: "Barbarian Armor",
                price: 8000,
                scale: 120,
                desc: "knocks back enemies that attack you",
                dmgK: 0.6,
            }, {
                id: 21,
                name: "Plague Mask",
                price: 10000,
                scale: 120,
                desc: "melee attacks deal poison damage",
                poisonDmg: 5,
                poisonTime: 6,
            }, {
                id: 46,
                name: "Bull Mask",
                price: 10000,
                scale: 120,
                desc: "bulls won't target you unless you attack them",
                bullRepel: 1,
            }, {
                id: 14,
                name: "Windmill Hat",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "generates points while worn",
                pps: 1.5,
            }, {
                id: 11,
                name: "Spike Gear",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "deal damage to players that damage you",
                dmg: 0.45,
            }, {
                id: 53,
                name: "Turret Gear",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "you become a walking turret",
                turret: {
                    proj: 1,
                    range: 700,
                    rate: 2500,
                },
                spdMult: 0.7,
            }, {
                id: 20,
                name: "Samurai Armor",
                price: 12000,
                scale: 120,
                desc: "increased attack speed and fire rate",
                atkSpd: 0.78,
            }, {
                id: 58,
                name: "Dark Knight",
                price: 12000,
                scale: 120,
                desc: "restores health when you deal damage",
                healD: 0.4,
            }, {
                id: 27,
                name: "Scavenger Gear",
                price: 15000,
                scale: 120,
                desc: "earn double points for each kill",
                kScrM: 2,
            }, {
                id: 40,
                name: "Tank Gear",
                price: 15000,
                scale: 120,
                desc: "increased damage to buildings but slower movement",
                spdMult: 0.3,
                bDmg: 3.3,
            }, {
                id: 52,
                name: "Thief Gear",
                price: 15000,
                scale: 120,
                desc: "steal half of a players gold when you kill them",
                goldSteal: 0.5,
            }, {
                id: 55,
                name: "Bloodthirster",
                price: 20000,
                scale: 120,
                desc: "Restore Health when dealing damage. And increased damage",
                healD: 0.25,
                dmgMultO: 1.2,
            }, {
                id: 56,
                name: "Assassin Gear",
                price: 20000,
                scale: 120,
                desc: "Go invisible when not moving. Can't eat. Increased speed",
                noEat: true,
                spdMult: 1.1,
                invisTimer: 1000,
            }, ];
            // STORE ACCESSORIES:
            module.exports.accessories = [{
                id: 12,
                name: "Snowball",
                price: 1000,
                scale: 105,
                xOff: 18,
                desc: "no effect",
            }, {
                id: 9,
                name: "Tree Cape",
                price: 1000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 10,
                name: "Stone Cape",
                price: 1000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 3,
                name: "Cookie Cape",
                price: 1500,
                scale: 90,
                desc: "no effect",
            }, {
                id: 8,
                name: "Cow Cape",
                price: 2000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 11,
                name: "Monkey Tail",
                price: 2000,
                scale: 97,
                xOff: 25,
                desc: "Super speed but reduced damage",
                spdMult: 1.35,
                dmgMultO: 0.2,
            }, {
                id: 17,
                name: "Apple Basket",
                price: 3000,
                scale: 80,
                xOff: 12,
                desc: "slowly regenerates health over time",
                healthRegen: 1,
            }, {
                id: 6,
                name: "Winter Cape",
                price: 3000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 4,
                name: "Skull Cape",
                price: 4000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 5,
                name: "Dash Cape",
                price: 5000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 2,
                name: "Dragon Cape",
                price: 6000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 1,
                name: "Super Cape",
                price: 8000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 7,
                name: "Troll Cape",
                price: 8000,
                scale: 90,
                desc: "no effect",
            }, {
                id: 14,
                name: "Thorns",
                price: 10000,
                scale: 115,
                xOff: 20,
                desc: "no effect",
            }, {
                id: 15,
                name: "Blockades",
                price: 10000,
                scale: 95,
                xOff: 15,
                desc: "no effect",
            }, {
                id: 20,
                name: "Devils Tail",
                price: 10000,
                scale: 95,
                xOff: 20,
                desc: "no effect",
            }, {
                id: 16,
                name: "Sawblade",
                price: 12000,
                scale: 90,
                spin: true,
                xOff: 0,
                desc: "deal damage to players that damage you",
                dmg: 0.15,
            }, {
                id: 13,
                name: "Angel Wings",
                price: 15000,
                scale: 138,
                xOff: 22,
                desc: "slowly regenerates health over time",
                healthRegen: 3,
            }, {
                id: 19,
                name: "Shadow Wings",
                price: 15000,
                scale: 138,
                xOff: 22,
                desc: "increased movement speed",
                spdMult: 1.1,
            }, {
                id: 18,
                name: "Blood Wings",
                price: 20000,
                scale: 178,
                xOff: 26,
                desc: "restores health when you deal damage",
                healD: 0.2,
            }, {
                id: 21,
                name: "Corrupt X Wings",
                price: 20000,
                scale: 178,
                xOff: 26,
                desc: "deal damage to players that damage you",
                dmg: 0.25,
            }, ];
            /***/
        },
        /***/
        "./src/js/libs/animText.js": /*!*********************************!*\
  !*** ./src/js/libs/animText.js ***!
  \*********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // ANIMATED TEXT:
            module.exports.AnimText = function() {
                // INIT:
                this.init = function(x, y, scale, speed, life, text, color) {
                    this.x = x;
                    this.y = y;
                    this.randomX = Math.floor(Math.random() * 2);
                    this.randomSpeed = Math.floor(Math.random() * 5);
                    this.moveSpeed = 10;
                    this.color = color;
                    this.scale = scale;
                    this.startScale = this.scale;
                    this.maxScale = scale * 1.5;
                    this.scaleSpeed = getEl("visual").value == "hans" ? 0.35 : 0.7;
                    this.speed = speed;
                    this.life = life;
                    this.life2 = this.life;
                    this.startLife = this.life;
                    this.text = text;
                    this.animation = 0;
                    this.maxAnim = 100;
                    this.acc = 1;
                    this.acc2 = 1;
                }
                ;
                // UPDATE:
                this.update = function(delta) {
                    if (this.life) {
                        this.life -= delta;
                        this.animation += 6;
                        if (getEl("visual").value == "me") {
                            if (this.animation < this.maxAnim) {
                                this.acc -= 0.1;
                                this.y -= this.speed * this.acc * delta;
                            } else {
                                this.life2 -= delta * 1.75;
                                this.acc += 0.15;
                                this.y += this.speed * this.acc * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                        } else if (getEl("visual").value == "hans") {
                            if (this.animation < this.maxAnim) {
                                this.acc -= 0.05;
                                this.y -= this.speed * this.acc * delta;
                            } else {
                                this.life2 -= delta * 1.9;
                                this.acc += 0.05;
                                this.y += this.speed * this.acc * delta;
                            }
                            if (this.randomX == 1) {
                                this.x += this.moveSpeed;
                            } else if (this.randomX == 0) {
                                this.x -= this.moveSpeed;
                            }
                            this.moveSpeed = Math.max(0, this.moveSpeed - 1);
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scaleSpeed = 0;
                                this.scale -= 0.1;
                            }
                        } else {
                            this.y -= this.speed * delta;
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                        }
                        if (this.life <= 0) {
                            this.life = 0;
                        }
                    }
                }
                ;
                // RENDER:
                this.render = function(ctxt, xOff, yOff) {
                    if (getEl("visual").value == "me" || getEl("visual").value == "hans") {
                        ctxt.globalAlpha = Math.min(1, this.life2 / this.startLife);
                    }
                    ctxt.fillStyle = this.color;
                    ctxt.font = this.scale + "px Hammersmith One";
                    if (getEl("visual").value == "cele" || getEl("visual").value == "zeph") {
                        ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                    }
                    ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                    ctxt.globalAlpha = 1;
                }
                ;
            }
            ;
            // TEXT MANAGER:
            module.exports.TextManager = function() {
                this.texts = [];
                // UPDATE:
                this.update = function(delta, ctxt, xOff, yOff) {
                    ctxt.textBaseline = "middle";
                    ctxt.textAlign = "center";
                    for (var i = 0; i < this.texts.length; ++i) {
                        if (this.texts[i].life) {
                            this.texts[i].update(delta);
                            this.texts[i].render(ctxt, xOff, yOff);
                        }
                    }
                }
                ;
                // SHOW TEXT:
                this.showText = function(x, y, scale, speed, life, text, color) {
                    var tmpText;
                    for (var i = 0; i < this.texts.length; ++i) {
                        if (!this.texts[i].life) {
                            tmpText = this.texts[i];
                            break;
                        }
                    }
                    if (!tmpText) {
                        tmpText = new module.exports.AnimText();
                        this.texts.push(tmpText);
                    }
                    tmpText.init(x, y, scale, speed, life, text, color);
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/libs/io-client.js": /*!**********************************!*\
  !*** ./src/js/libs/io-client.js ***!
  \**********************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            var msgpack = __webpack_require__(/*! msgpack-lite */
                "./node_modules/msgpack-lite/lib/browser.js");
            var config = __webpack_require__(/*! ../config */
                "./src/js/config.js");
            module.exports = {
                socket: null,
                connected: false,
                socketId: -1,
                connect: function(address, callback, events) {
                    if (this.socket)
                        return;
                    // CREATE SOCKET:
                    var _this = this;
                    try {
                        var socketError = false;
                        var socketAddress = address;
                        this.socket = new WebSocket(socketAddress);
                        this.socket.binaryType = "arraybuffer";
                        this.socket.onmessage = function(message) {
                            // PARSE MESSAGE:
                            var data = new Uint8Array(message.data);
                            var parsed = msgpack.decode(data);
                            var type = parsed[0];
                            var data = parsed[1];
                            // CALL EVENT:
                            if (type == "io-init") {
                                _this.socketId = data[0];
                            } else {
                                events[type].apply(undefined, data);
                            }
                        }
                        ;
                        this.socket.onopen = function() {
                            _this.connected = true;
                            callback();
                        }
                        ;
                        this.socket.onclose = function(event) {
                            _this.connected = false;
                            if (event.code == 4001) {
                                callback("Invalid Connection");
                            } else if (!socketError) {
                                callback("disconnected");
                            }
                        }
                        ;
                        this.socket.onerror = function(error) {
                            if (this.socket && this.socket.readyState != WebSocket.OPEN) {
                                socketError = true;
                                console.error("Socket error", arguments);
                                callback("Socket error");
                            }
                        }
                        ;
                    } catch (e) {
                        console.warn("Socket connection error:", e);
                        callback(e);
                    }
                },
                send: function(type) {
                    if (!this.connected)
                        return;
                    if (!firstSend.min) {
                        firstSend.min = true;
                        setTimeout(()=>{
                            firstSend.min = false;
                            minPacket = 0;
                        }
                                   , minTime);
                    }
                    if (!firstSend.sec) {
                        firstSend.sec = true;
                        setTimeout(()=>{
                            firstSend.sec = false;
                            secPacket = 0;
                        }
                                   , secTime);
                    }
                    if ((getEl("ak").checked && secPacket < secMax && minPacket < minMax) || !getEl("ak").checked) {
                        // EXTRACT DATA ARRAY:
                        let data = Array.prototype.slice.call(arguments, 1);
                        // SEND MESSAGE:
                        if (type == "ch") {
                            // ANTI PROFANITY:
                            let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", ];
                            let tmpString;
                            profanity.forEach((profany)=>{
                                if (data[0].indexOf(profany) > -1) {
                                    tmpString = "";
                                    for (let i = 0; i < profany.length; ++i) {
                                        if (i == 1) {
                                            tmpString += String.fromCharCode(0);
                                        }
                                        tmpString += profany[i];
                                    }
                                    let re = new RegExp(profany,"g");
                                    data[0] = data[0].replace(re, tmpString);
                                }
                            });
                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        } else if (type == "8") {
                            // MAKE SAME CLAN:
                            data[0] = data[0] + String.fromCharCode(0);
                            data[0] = data[0].slice(0, 7);
                        }
                        let binary = msgpack.encode([type, data]);
                        this.socket.send(binary);
                        minPacket++;
                        secPacket++;
                    }
                },
                socketReady: function() {
                    return this.socket && this.connected;
                },
                close: function() {
                    this.socket && this.socket.close();
                },
            };
            /***/
        },
        /***/
        "./src/js/libs/modernizr.js": /*!**********************************!*\
  !*** ./src/js/libs/modernizr.js ***!
  \**********************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            !(function(e, n, s) {
                function o(e, n) {
                    return typeof e === n;
                }

                function a() {
                    var e, n, s, a, t, f, l;
                    for (var c in r)
                        if (r.hasOwnProperty(c)) {
                            if (((e = []),
                                 (n = r[c]),
                                 n.name && (e.push(n.name.toLowerCase()),
                                            n.options && n.options.aliases && n.options.aliases.length)))
                                for (s = 0; s < n.options.aliases.length; s++)
                                    e.push(n.options.aliases[s].toLowerCase());
                            for (a = o(n.fn, "function") ? n.fn() : n.fn,
                                 t = 0; t < e.length; t++)
                                (f = e[t]),
                                    (l = f.split(".")),
                                    1 === l.length ? (Modernizr[l[0]] = a) : (!Modernizr[l[0]] || Modernizr[l[0]]instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])),
                                                                              (Modernizr[l[0]][l[1]] = a)),
                                    i.push((a ? "" : "no-") + l.join("-"));
                        }
                }

                function t(e) {
                    var n = l.className
                    , s = Modernizr._config.classPrefix || "";
                    if ((c && (n = n.baseVal),
                         Modernizr._config.enableJSClass)) {
                        var o = new RegExp("(^|\\s)" + s + "no-js(\\s|$)");
                        n = n.replace(o, "$1" + s + "js$2");
                    }
                    Modernizr._config.enableClasses && ((n += " " + s + e.join(" " + s)),
                                                        c ? (l.className.baseVal = n) : (l.className = n));
                }
                var i = []
                , r = []
                , f = {
                    _version: "3.5.0",
                    _config: {
                        classPrefix: "",
                        enableClasses: !0,
                        enableJSClass: !0,
                        usePrefixes: !0,
                    },
                    _q: [],
                    on: function(e, n) {
                        var s = this;
                        setTimeout(function() {
                            n(s[e]);
                        }, 0);
                    },
                    addTest: function(e, n, s) {
                        r.push({
                            name: e,
                            fn: n,
                            options: s
                        });
                    },
                    addAsyncTest: function(e) {
                        r.push({
                            name: null,
                            fn: e
                        });
                    },
                }
                , Modernizr = function() {};
                (Modernizr.prototype = f),
                    (Modernizr = new Modernizr());
                var l = n.documentElement
                , c = "svg" === l.nodeName.toLowerCase();
                Modernizr.addTest("passiveeventlisteners", function() {
                    var n = !1;
                    try {
                        var s = Object.defineProperty({}, "passive", {
                            get: function() {
                                n = !0;
                            },
                        });
                        e.addEventListener("test", null, s);
                    } catch (o) {}
                    return n;
                }),
                    a(),
                    t(i),
                    delete f.addTest,
                    delete f.addAsyncTest;
                for (var u = 0; u < Modernizr._q.length; u++)
                    Modernizr._q[u]();
                e.Modernizr = Modernizr;
            }
             )(window, document);
            /***/
        },
        /***/
        "./src/js/libs/soundManager.js": /*!*************************************!*\
  !*** ./src/js/libs/soundManager.js ***!
  \*************************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // PLAYER MANAGER:
            module.exports.obj = function(config, UTILS) {
                // INIT:
                var tmpSound;
                this.sounds = [];
                this.active = true;
                // PLAY SOUND:
                this.play = function(id, volume, loop) {
                    if (!volume || !this.active)
                        return;
                    tmpSound = this.sounds[id];
                    if (!tmpSound) {
                        tmpSound = new Howl({
                            src: ".././sound/" + id + ".mp3",
                        });
                        this.sounds[id] = tmpSound;
                    }
                    if (!loop || !tmpSound.isPlaying) {
                        tmpSound.isPlaying = true;
                        tmpSound.play();
                        tmpSound.volume((volume || 1) * config.volumeMult);
                        tmpSound.loop(loop);
                    }
                }
                ;
                // TOGGLE MUTE:
                this.toggleMute = function(id, mute) {
                    tmpSound = this.sounds[id];
                    if (tmpSound)
                        tmpSound.mute(mute);
                }
                ;
                // STOP SOUND:
                this.stop = function(id) {
                    tmpSound = this.sounds[id];
                    if (tmpSound) {
                        tmpSound.stop();
                        tmpSound.isPlaying = false;
                    }
                }
                ;
            }
            ;
            /***/
        },
        /***/
        "./src/js/libs/utils.js": /*!******************************!*\
  !*** ./src/js/libs/utils.js ***!
  \******************************/
        /*! no static exports found */
        /***/
        function(module, exports) {
            // MATH UTILS:
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            var mathATAN2 = Math.atan2;
            var mathPI = Math.PI;
            // GLOBAL UTILS:
            module.exports.loop = function(action, loop) {
                for (let i = 0; i < loop; i++) {
                    action();
                }
            }
            ;
            module.exports.toRad = function(angle) {
                return angle * (Math.PI / 180);
            }
            ;
            module.exports.toAng = function(radian) {
                return radian / (Math.PI / 180);
            }
            ;
            module.exports.randInt = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            ;
            module.exports.randFloat = function(min, max) {
                return Math.random() * (max - min + 1) + min;
            }
            ;
            module.exports.lerp = function(value1, value2, amount) {
                return value1 + (value2 - value1) * amount;
            }
            ;
            module.exports.decel = function(val, cel) {
                if (val > 0)
                    val = Math.max(0, val - cel);
                else if (val < 0)
                    val = Math.min(0, val + cel);
                return val;
            }
            ;
            module.exports.getDistance = function(x1, y1, x2, y2) {
                return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
            }
            ;
            module.exports.getDist = function(tmp1, tmp2, type1, type2) {
                let tmpXY1 = {
                    x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                    y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                };
                let tmpXY2 = {
                    x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                    y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                };
                return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
            }
            ;
            module.exports.getDirection = function(x1, y1, x2, y2) {
                return mathATAN2(y1 - y2, x1 - x2);
            }
            ;
            module.exports.getDirect = function(tmp1, tmp2, type1, type2) {
                let tmpXY1 = {
                    x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                    y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                };
                let tmpXY2 = {
                    x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                    y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                };
                return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
            }
            ;
            module.exports.getAngleDist = function(a, b) {
                var p = mathABS(b - a) % (mathPI * 2);
                return p > mathPI ? mathPI * 2 - p : p;
            }
            ;
            module.exports.isNumber = function(n) {
                return typeof n == "number" && !isNaN(n) && isFinite(n);
            }
            ;
            module.exports.isString = function(s) {
                return s && typeof s == "string";
            }
            ;
            module.exports.kFormat = function(num) {
                return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
            }
            ;
            module.exports.capitalizeFirst = function(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            ;
            module.exports.fixTo = function(n, v) {
                return parseFloat(n.toFixed(v));
            }
            ;
            module.exports.sortByPoints = function(a, b) {
                return parseFloat(b.points) - parseFloat(a.points);
            }
            ;
            module.exports.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
                var minX = x1;
                var maxX = x2;
                if (x1 > x2) {
                    minX = x2;
                    maxX = x1;
                }
                if (maxX > recX2)
                    maxX = recX2;
                if (minX < recX)
                    minX = recX;
                if (minX > maxX)
                    return false;
                var minY = y1;
                var maxY = y2;
                var dx = x2 - x1;
                if (Math.abs(dx) > 0.0000001) {
                    var a = (y2 - y1) / dx;
                    var b = y1 - a * x1;
                    minY = a * minX + b;
                    maxY = a * maxX + b;
                }
                if (minY > maxY) {
                    var tmp = maxY;
                    maxY = minY;
                    minY = tmp;
                }
                if (maxY > recY2)
                    maxY = recY2;
                if (minY < recY)
                    minY = recY;
                if (minY > maxY)
                    return false;
                return true;
            }
            ;
            module.exports.containsPoint = function(element, x, y) {
                var bounds = element.getBoundingClientRect();
                var left = bounds.left + window.scrollX;
                var top = bounds.top + window.scrollY;
                var width = bounds.width;
                var height = bounds.height;
                var insideHorizontal = x > left && x < left + width;
                var insideVertical = y > top && y < top + height;
                return insideHorizontal && insideVertical;
            }
            ;
            module.exports.mousifyTouchEvent = function(event) {
                var touch = event.changedTouches[0];
                event.screenX = touch.screenX;
                event.screenY = touch.screenY;
                event.clientX = touch.clientX;
                event.clientY = touch.clientY;
                event.pageX = touch.pageX;
                event.pageY = touch.pageY;
            }
            ;
            module.exports.hookTouchEvents = function(element, skipPrevent) {
                var preventDefault = !skipPrevent;
                var isHovering = false;
                // var passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                var passive = false;
                element.addEventListener("touchstart", module.exports.checkTrusted(touchStart), passive);
                element.addEventListener("touchmove", module.exports.checkTrusted(touchMove), passive);
                element.addEventListener("touchend", module.exports.checkTrusted(touchEnd), passive);
                element.addEventListener("touchcancel", module.exports.checkTrusted(touchEnd), passive);
                element.addEventListener("touchleave", module.exports.checkTrusted(touchEnd), passive);

                function touchStart(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (element.onmouseover)
                        element.onmouseover(e);
                    isHovering = true;
                }

                function touchMove(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (module.exports.containsPoint(element, e.pageX, e.pageY)) {
                        if (!isHovering) {
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                    } else {
                        if (isHovering) {
                            if (element.onmouseout)
                                element.onmouseout(e);
                            isHovering = false;
                        }
                    }
                }

                function touchEnd(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (isHovering) {
                        if (element.onclick)
                            element.onclick(e);
                        if (element.onmouseout)
                            element.onmouseout(e);
                        isHovering = false;
                    }
                }
            }
            ;
            module.exports.removeAllChildren = function(element) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            ;
            module.exports.generateElement = function(config) {
                var element = document.createElement(config.tag || "div");

                function bind(configValue, elementValue) {
                    if (config[configValue])
                        element[elementValue] = config[configValue];
                }
                bind("text", "textContent");
                bind("html", "innerHTML");
                bind("class", "className");
                for (var key in config) {
                    switch (key) {
                        case "tag":
                        case "text":
                        case "html":
                        case "class":
                        case "style":
                        case "hookTouch":
                        case "parent":
                        case "children":
                            continue;
                        default:
                            break;
                    }
                    element[key] = config[key];
                }
                if (element.onclick)
                    element.onclick = module.exports.checkTrusted(element.onclick);
                if (element.onmouseover)
                    element.onmouseover = module.exports.checkTrusted(element.onmouseover);
                if (element.onmouseout)
                    element.onmouseout = module.exports.checkTrusted(element.onmouseout);
                if (config.style) {
                    element.style.cssText = config.style;
                }
                if (config.hookTouch) {
                    module.exports.hookTouchEvents(element);
                }
                if (config.parent) {
                    config.parent.appendChild(element);
                }
                if (config.children) {
                    for (var i = 0; i < config.children.length; i++) {
                        element.appendChild(config.children[i]);
                    }
                }
                return element;
            }
            ;
            module.exports.eventIsTrusted = function(ev) {
                if (ev && typeof ev.isTrusted == "boolean") {
                    return ev.isTrusted;
                } else {
                    return true;
                }
            }
            ;
            module.exports.checkTrusted = function(callback) {
                return function(ev) {
                    if (ev && ev instanceof Event && module.exports.eventIsTrusted(ev)) {
                        callback(ev);
                    } else {//console.error("Event is not trusted.", ev);
                    }
                }
                ;
            }
            ;
            module.exports.randomString = function(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
            ;
            module.exports.countInArray = function(array, val) {
                var count = 0;
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === val)
                        count++;
                }
                return count;
            }
            ;
            /***/
        },
        /***/
        "./vultr/VultrClient.js": /*!******************************!*\
  !*** ./vultr/VultrClient.js ***!
  \******************************/
        /*! no static exports found */
        /***/
        function(module, exports, __webpack_require__) {
            var url = __webpack_require__(/*! url */
                "./node_modules/url/url.js");
            var md5 = __webpack_require__(/*! md5 */
                "./node_modules/md5/md5.js");

            function VultrClient(baseUrl, devPort, lobbySize, lobbySpread, rawIPs) {
                // Redirect from "localhost" to "127.0.0.1" if needed; this is because the server
                // manager uses "127.0.0.1" as the home
                if (location.hostname == "localhost") {
                    window.location.hostname = "127.0.0.1";
                }
                // Don't log anything
                this.debugLog = false;
                // Save the base data
                this.baseUrl = baseUrl;
                this.lobbySize = lobbySize;
                this.devPort = devPort;
                this.lobbySpread = lobbySpread;
                this.rawIPs = !!rawIPs;
                // Default data
                this.server = undefined;
                this.gameIndex = undefined;
                // Callback for the client
                this.callback = undefined;
                this.errorCallback = undefined;
                // Process the servers
                this.processServers(vultr.servers);
            }
            VultrClient.prototype.regionInfo = {
                0: {
                    name: "Local",
                    latitude: 0,
                    longitude: 0
                },
                "vultr:1": {
                    name: "New Jersey",
                    latitude: 40.1393329,
                    longitude: -75.8521818,
                },
                "vultr:2": {
                    name: "Chicago",
                    latitude: 41.8339037,
                    longitude: -87.872238,
                },
                "vultr:3": {
                    name: "Dallas",
                    latitude: 32.8208751,
                    longitude: -96.8714229,
                },
                "vultr:4": {
                    name: "Seattle",
                    latitude: 47.6149942,
                    longitude: -122.4759879,
                },
                "vultr:5": {
                    name: "Los Angeles",
                    latitude: 34.0207504,
                    longitude: -118.691914,
                },
                "vultr:6": {
                    name: "Atlanta",
                    latitude: 33.7676334,
                    longitude: -84.5610332,
                },
                "vultr:7": {
                    name: "Amsterdam",
                    latitude: 52.3745287,
                    longitude: 4.7581878,
                },
                "vultr:8": {
                    name: "London",
                    latitude: 51.5283063,
                    longitude: -0.382486,
                },
                "vultr:9": {
                    name: "Frankfurt",
                    latitude: 50.1211273,
                    longitude: 8.496137,
                },
                "vultr:12": {
                    name: "Silicon Valley",
                    latitude: 37.4024714,
                    longitude: -122.3219752,
                },
                "vultr:19": {
                    name: "Sydney",
                    latitude: -33.8479715,
                    longitude: 150.651084,
                },
                "vultr:24": {
                    name: "Paris",
                    latitude: 48.8588376,
                    longitude: 2.2773454,
                },
                "vultr:25": {
                    name: "Tokyo",
                    latitude: 35.6732615,
                    longitude: 139.569959,
                },
                "vultr:39": {
                    name: "Miami",
                    latitude: 25.7823071,
                    longitude: -80.3012156,
                },
                "vultr:40": {
                    name: "Singapore",
                    latitude: 1.3147268,
                    longitude: 103.7065876,
                },
            };
            VultrClient.prototype.start = function(callback, errorCallback) {
                // Set the callback
                this.callback = callback;
                this.errorCallback = errorCallback;
                // Parse the query for a server; if doesn't exist, ping the servers to find
                // the right one
                var query = this.parseServerQuery();
                if (query) {
                    this.log("Found server in query.");
                    this.password = query[3];
                    this.connect(query[0], query[1], query[2]);
                } else {
                    this.log("Pinging servers...");
                    this.pingServers();
                }
            }
            ;
            VultrClient.prototype.parseServerQuery = function() {
                // Get the server from the query
                var parsed = url.parse(location.href, true);
                var serverRaw = parsed.query.server;
                if (typeof serverRaw != "string") {
                    return;
                }
                // Parse the server string
                var split = serverRaw.split(":");
                if (split.length != 3) {
                    this.errorCallback("Invalid number of server parameters in " + serverRaw);
                    return;
                }
                var region = split[0];
                var index = parseInt(split[1]);
                var gameIndex = parseInt(split[2]);
                if (region != "0" && !region.startsWith("vultr:")) {
                    region = "vultr:" + region;
                }
                return [region, index, gameIndex, parsed.query.password];
            }
            ;
            VultrClient.prototype.findServer = function(region, index) {
                // Find the list of servers for the region
                var serverList = this.servers[region];
                if (!Array.isArray(serverList)) {
                    this.errorCallback("No server list for region " + region);
                    return;
                }
                // Find the server matching the index
                for (var i = 0; i < serverList.length; i++) {
                    var server = serverList[i];
                    if (server.index == index) {
                        return server;
                    }
                }
                // Otherwise, return nothing
                console.warn("Could not find server in region " + region + " with index " + index + ".");
                return;
            }
            ;
            VultrClient.prototype.pingServers = function() {
                var _this = this;
                // Ping random servers from each region
                var requests = [];
                for (var region in this.servers) {
                    // Find the server to ping
                    if (!this.servers.hasOwnProperty(region))
                        continue;
                    var serverList = this.servers[region];
                    var targetServer = serverList[Math.floor(Math.random() * serverList.length)];
                    // Handle no server
                    if (targetServer == undefined) {
                        console.log("No target server for region " + region);
                        continue;
                    }
                    // Ping the server
                    (function(serverList, targetServer) {
                        var request = new XMLHttpRequest();
                        request.onreadystatechange = function(requestEvent) {
                            var request = requestEvent.target;
                            // Ensure that the request finished
                            if (request.readyState != 4)
                                return;
                            if (request.status == 200) {
                                // Stop all other ping requests
                                for (var i = 0; i < requests.length; i++) {
                                    requests[i].abort();
                                }
                                _this.log("Connecting to region", targetServer.region);
                                // Seek the appropriate server
                                var targetGame = _this.seekServer(targetServer.region);
                                _this.connect(targetGame[0], targetGame[1], targetGame[2]);
                            } else {
                                console.warn("Error pinging " + targetServer.ip + " in region " + region);
                            }
                        }
                        ;
                        var targetAddress = "//" + _this.serverAddress(targetServer.ip, true) + ":" + _this.serverPort(targetServer) + "/ping";
                        request.open("GET", targetAddress, true);
                        request.send(null);
                        _this.log("Pinging", targetAddress);
                        // Save the request
                        requests.push(request);
                    }
                    )(serverList, targetServer);
                }
            }
            ;
            /// Finds a new server; region is the index of the region to look in; game mode is the mode to search for;
            /// reload is wether a connection should be created or the page should be redirected
            VultrClient.prototype.seekServer = function(region, isPrivate, gameMode) {
                if (gameMode == undefined) {
                    gameMode = "random";
                }
                if (isPrivate == undefined) {
                    isPrivate = false;
                }
                // Define configuration
                const gameModeList = ["random"];
                var lobbySize = this.lobbySize;
                var lobbySpread = this.lobbySpread;
                // Sort the servers by player count then filter by available servers
                var servers = this.servers[region].flatMap(function(s) {
                    // Map the servers to { region, index, gameIndex, gameCount, playerCount, isPrivate } where index is from 0 to (total servers * games per server)
                    // This way, we can decompose the index again later to find the server amd game index
                    var gameIndex = 0;
                    return s.games.map(function(g) {
                        var currentGameIndex = gameIndex++;
                        return {
                            region: s.region,
                            index: s.index * s.games.length + currentGameIndex,
                            gameIndex: currentGameIndex,
                            gameCount: s.games.length,
                            playerCount: g.playerCount,
                            isPrivate: g.isPrivate,
                        };
                    });
                }).filter(function(s) {
                    // Remove private games
                    return !s.isPrivate;
                }).filter(function(s) {
                    // If private, only find rooms that are empty and have a large enough index
                    if (isPrivate) {
                        return s.playerCount == 0 && s.gameIndex >= s.gameCount / 2;
                    } else {
                        return true;
                    }
                }).filter(function(s) {
                    // If not a random game mode, filter them to the proper mode
                    if (gameMode == "random") {
                        return true;
                    } else {
                        return (gameModeList[s.index % gameModeList.length].key == gameMode);
                    }
                }).sort(function(a, b) {
                    return b.playerCount - a.playerCount;
                }).filter(function(s) {
                    return s.playerCount < lobbySize;
                });
                // Reverse the server list so private servers are at the end of the list
                if (isPrivate) {
                    servers.reverse();
                }
                // Handle no available servers
                if (servers.length == 0) {
                    this.errorCallback("No open servers.");
                    return;
                }
                // Pick a random server; `lobbySpread` defines how many top lobbies to spread the players
                // over
                var randomSpread = Math.min(lobbySpread, servers.length);
                var serverIndex = Math.floor(Math.random() * randomSpread);
                serverIndex = Math.min(serverIndex, servers.length - 1);
                var rawServer = servers[serverIndex];
                // Extract the information from the raw server
                var serverRegion = rawServer.region;
                var serverIndex = Math.floor(rawServer.index / rawServer.gameCount);
                var gameIndex = rawServer.index % rawServer.gameCount;
                this.log("Found server.");
                // Determine what to do with the information
                return [serverRegion, serverIndex, gameIndex];
            }
            ;
            VultrClient.prototype.connect = function(region, index, game) {
                // Make sure not connected already
                if (this.connected) {
                    return;
                }
                // Find the server with the given data
                var server = this.findServer(region, index);
                if (server == undefined) {
                    this.errorCallback("Failed to find server for region " + region + " and index " + index);
                    return;
                }
                this.log("Connecting to server", server, "with game index", game);
                // Check if the server is full
                if (server.games[game].playerCount >= this.lobbySize) {
                    this.errorCallback("Server is already full.");
                    return;
                }
                // Replace the URL
                window.history.replaceState(document.title, document.title, this.generateHref(region, index, game, this.password));
                // Save the server
                this.server = server;
                this.gameIndex = game;
                // Return the address and port
                this.log("Calling callback with address", this.serverAddress(server.ip), "on port", this.serverPort(server), "with game index", game);
                this.callback(this.serverAddress(server.ip), this.serverPort(server), game);
            }
            ;
            VultrClient.prototype.switchServer = function(region, index, game, password) {
                // Save switching
                this.switchingServers = true;
                // Navigate to the server
                window.location.href = this.generateHref(region, index, game, password);
            }
            ;
            VultrClient.prototype.generateHref = function(region, index, game, password) {
                region = this.stripRegion(region);
                // Generate HREF
                var href;
                href = "/?server=" + (region + ":" + index + ":" + game);
                urGameRegion = region;
                if (password) {
                    href += "&password=" + encodeURIComponent(password);
                }
                return href;
            }
            ;
            /// Returns the server address for an IP using reverse DNS lookup; turn `forceSecure`
            /// on in order to force the server address to go through Cloudflare
            VultrClient.prototype.serverAddress = function(ip, forceSecure) {
                // Determine the domain to connect to; this way it connects directly to localhost if needed
                // "903d62ef5d1c2fecdcaeb5e7dd485eff" is the md5 hash for "127.0.0.1"
                if (ip == "127.0.0.1" || ip == "7f000001" || ip == "903d62ef5d1c2fecdcaeb5e7dd485eff") {
                    // return "127.0.0.1";
                    return window.location.hostname;
                    // This allows for connection over local IP networks
                } else if (this.rawIPs) {
                    if (forceSecure) {
                        return "ip_" + this.hashIP(ip) + "." + this.baseUrl;
                    } else {
                        return ip;
                    }
                } else {
                    return "ip_" + ip + "." + this.baseUrl;
                }
            }
            ;
            /// Returns the port to connect to
            VultrClient.prototype.serverPort = function(server) {
                // Return dev port if development server
                // console.log(server.region);
                if (server.region == 0) {
                    return this.devPort;
                }
                // Otherwise return the port depending on the protocol
                return location.protocol.startsWith("https") ? 443 : 80;
            }
            ;
            VultrClient.prototype.processServers = function(serverList) {
                // Group the servers by region
                var servers = {};
                for (var i = 0; i < serverList.length; i++) {
                    var server = serverList[i];
                    // Get or create the list
                    var list = servers[server.region];
                    if (list == undefined) {
                        list = [];
                        servers[server.region] = list;
                    }
                    // Add the server
                    list.push(server);
                }
                // Sort the servers
                for (var region in servers) {
                    // Sort the servers
                    servers[region] = servers[region].sort(function(a, b) {
                        return a.index - b.index;
                    });
                }
                // Save the servers
                this.servers = servers;
            }
            ;
            // TODO: Merge into VultrManager
            /// Converts an IP to a hex string
            VultrClient.prototype.ipToHex = function(ip) {
                const encoded = ip.split(".")// Split by components
                .map((component)=>("00" + parseInt(component).toString(16))// Parses the component then converts it to a hex
                     .substr(-2)// Ensures there's 2 characters
                    ).join("")// Join the string
                .toLowerCase();
                // Make sure it's lowercase
                return encoded;
            }
            ;
            // TODO: Merge into VultrManager
            /// Hashes an IP to a cryptographically secure string; it does this by converting
            /// the ip to a hex string then doing an md5 hash on the string; e.g. "102.168.1.128" ->
            /// "c0a80180" -> "f8177f9878f2d00df00e51d786d97c0a"
            VultrClient.prototype.hashIP = function(ip) {
                return md5(this.ipToHex(ip));
            }
            ;
            /// Logs debug information
            VultrClient.prototype.log = function() {
                if (this.debugLog) {
                    return console.log.apply(undefined, arguments);
                } else if (console.verbose) {
                    return console.verbose.apply(undefined, arguments);
                }
            }
            ;
            VultrClient.prototype.stripRegion = function(region) {
                if (region.startsWith("vultr:")) {
                    region = region.slice(6);
                } else if (region.startsWith("do:")) {
                    region = region.slice(3);
                }
                return region;
            }
            ;
            window.testVultrClient = function() {
                var assertIndex = 1;

                function assert(actual, expected) {
                    actual = `${actual}`;
                    expected = `${expected}`;
                    if (actual == expected) {
                        console.log(`Assert ${assertIndex} passed.`);
                    } else {
                        console.warn(`Assert ${assertIndex} failed. Expected ${expected}, got ${actual}.`);
                    }
                    assertIndex++;
                }

                function generateServerList(regions) {
                    var servers = [];
                    for (var region in regions) {
                        var regionServers = regions[region];
                        for (var i = 0; i < regionServers.length; i++) {
                            servers.push({
                                ip: region + ":" + i,
                                scheme: "testing",
                                region: region,
                                index: i,
                                games: regionServers[i].map((p)=>{
                                    return {
                                        playerCount: p,
                                        isPrivate: false
                                    };
                                }
                                                           ),
                            });
                        }
                    }
                    return servers;
                }
                // Test 1
                var maxPlayers = 5;
                var client1 = new VultrClient("test.io",-1,maxPlayers,1,false);
                var lastError = undefined;
                client1.errorCallback = function(error) {
                    lastError = error;
                }
                ;
                client1.processServers(generateServerList({
                    1: [[0, 0, 0, 0], [0, 0, 0, 0], ],
                    2: [[maxPlayers, 1, 0, 0], [0, 0, 0, 0], ],
                    3: [[maxPlayers, 0, 1, maxPlayers], [0, 0, 0, 0], ],
                    4: [[maxPlayers, 1, 1, maxPlayers], [1, 0, 0, 0], ],
                    5: [[maxPlayers, 1, 1, maxPlayers], [1, 0, maxPlayers - 1, 0], ],
                    6: [[maxPlayers, maxPlayers, maxPlayers, maxPlayers], [2, 3, 1, 4], ],
                    7: [[maxPlayers, maxPlayers, maxPlayers, maxPlayers], [maxPlayers, maxPlayers, maxPlayers, maxPlayers], ],
                }));
                assert(client1.seekServer(1, false), [1, 0, 0]);
                assert(client1.seekServer(1, true), [1, 1, 3]);
                assert(client1.seekServer(2, false), [2, 0, 1]);
                assert(client1.seekServer(2, true), [2, 1, 3]);
                assert(client1.seekServer(3, false), [3, 0, 2]);
                assert(client1.seekServer(3, true), [3, 1, 3]);
                assert(client1.seekServer(4, false), [4, 0, 1]);
                assert(client1.seekServer(4, true), [4, 1, 3]);
                assert(client1.seekServer(5, false), [5, 1, 2]);
                assert(client1.seekServer(5, true), [5, 1, 3]);
                assert(client1.seekServer(6, false), [6, 1, 3]);
                assert(client1.seekServer(6, true), undefined);
                assert(client1.seekServer(7, false), undefined);
                assert(client1.seekServer(7, true), undefined);
                console.log("Tests passed.");
            }
            ;
            // FLATMAP:
            var concat = function(x, y) {
                return x.concat(y);
            };
            var flatMap = function(f, xs) {
                return xs.map(f).reduce(concat, []);
            };
            Array.prototype.flatMap = function(f) {
                return flatMap(f, this);
            }
            ;
            module.exports = VultrClient;
            /***/
        },
        /******/
    });
//# sourceMappingURL=bundle.js.map