// ==UserScript==
// @name         Bonk UI Rehaul
// @version      0.2
// @author       Salama
// @description  Makes the game ui a lot cooler! -iNeonz
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/457477/Bonk%20UI%20Rehaul.user.js
// @updateURL https://update.greasyfork.org/scripts/457477/Bonk%20UI%20Rehaul.meta.js
// ==/UserScript==

function editDynamicUi(){
//RoomList
let lpbox = document.getElementById('newbonklobby_playerbox');
let tlock = document.getElementById('newbonklobby_teamlockbutton');
let sbox = document.getElementById('newbonklobby_specbox');
let cbox = document.getElementById('newbonklobby_settingsbox');
let tbox = document.getElementById('newbonklobby_chatbox');
let lcbox = document.getElementById('newbonklobby_chat_lowerline')
let ingcbox = document.getElementById('ingamechatcontent')
let nbmt = document.getElementById('newbonklobby_mapauthortext');
let nmt = document.getElementById('newbonklobby_maptext');
let rri = document.getElementById('newbonklobby_roundsinput')
rri.style.color = 'white';
nbmt.style.color = 'white';
nmt.style.color = 'white';
ingcbox.style.backgroundColor = '#322a32';
ingcbox.style.opacity = '0.55';
ingcbox.style.borderRadius = '24px';
lcbox.style.backgroundColor = '#a5acb0';
lpbox.style.backgroundColor = '#322a32';
lpbox.style.opacity = '0.55';
sbox.style.backgroundColor = '#322a32';
sbox.style.opacity = '0.55';
cbox.style.backgroundColor = '#322a32';
cbox.style.opacity = '0.55';
tbox.style.backgroundColor = '#322a32';
tbox.style.opacity = '0.55';
let txtmsglist = document.getElementsByClassName("newbonklobby_chat_msg_txt");
let txtmsglist2 = document.getElementsByClassName("ingamechatmessage");
let nammsglist = document.getElementsByClassName("newbonklobby_chat_msg_name");
let nammsglist2 = document.getElementsByClassName("ingamechatname");
for (let msg of txtmsglist){
msg.style.backgroundColor = '#ebd2e7';
msg.style.borderRadius = '12px';
}
for (let msg of txtmsglist2){
msg.style.color = 'black';
msg.style.backgroundColor = '#ebd2e7';
msg.style.borderRadius = '12px';
}
for (let msg of nammsglist){
msg.style.backgroundColor = '#8460be';
msg.style.borderRadius = '12px';
}
for (let msg of nammsglist2){
msg.style.color = 'black';
msg.style.backgroundColor = '#8460be';
msg.style.borderRadius = '12px';
}
let userlist = document.getElementsByClassName("newbonklobby_playerentry");
let namelist = document.getElementsByClassName("newbonklobby_playerentry_name");
for (let plr of userlist){
plr.style.borderLeft = 'none';
plr.style.borderRight = 'none';
plr.style.borderTop = 'none';
plr.style.backgroundColor = 'black';
plr.style.color = 'white';
plr.style.opacity = '0.75';
plr.style.borderRadius = '24px';
}
let pool = [];
for (let plr of namelist){
if (!pool[plr.textContent]){
plr.style.borderRadius = '12px';
plr.style.backgroundColor = 'white';
    pool[plr.textContent] = true;
}
}
let ControlIndicator = document.getElementsByClassName("control_indicator")
for (let ci of ControlIndicator){
ci.style.background = "#7664c8";
ci.style.borderRadius = "50%";
}
let bb = document.getElementsByClassName("brownButton")
let mbb = document.getElementsByClassName("classic_mid_buttons")
let cgh = document.getElementsByClassName('HOVERUNSELECTED UNSELECTED')
let nbt = document.getElementsByClassName('newbonklobby_boxtop');
let wtb = document.getElementsByClassName('windowTopBar');
for (let b of nbt){
b.style.backgroundColor = '#2b1747';
b.classList.remove('newbonklobby_boxtop_classic');
}
for (let b of wtb){
b.style.backgroundColor = '#2b1747';
b.classList.remove('windowTopBar_classic');
}
let i = 0;
for (let b of cgh){
    if (i % 2 == 0){
b.style.backgroundColor = '#322a32'
    }else{
b.style.backgroundColor = '#4a384b';
    }
    if(b.style.color !== "white"){
     b.style.color = 'white';
    }
    i += 1;
}
for (let b of mbb){
b.classList.remove("classic_mid_buttons")
b.style.height = "50px";
b.style.textAlign = "center";
}
for (let b of bb){
b.classList.remove("buttonShadow")
b.style.overflow = 'visible';
if (b.textContent == "Join Blue"){
b.style.background = "#243046"
}else if(b.textContent == "Join Red"){
b.style.backgroundColor = "#3d2d58"
}else if(b.textContent == "Join Yellow"){
b.style.backgroundColor = "#5d2a49"
}else if(b.textContent == "Join Green"){
b.style.backgroundColor = "#314b63"
}else{
b.style.backgroundColor = "#2b1747";
}
}
let bonkMode = document.getElementById("newbonklobby_modebutton")
if (bonkMode){
bonkMode.style.background = "#2b1747";
}
}

function injector(bonkSrc){
    console.log("Start editing the UI...");
    //RoomList
    let roomListTopBar = document.getElementById("roomlisttopbar");
    let customGame = document.getElementById("classic_mid_customgame")
    customGame.style.backgroundImage = 'url(../graphics/cog.png)';
    customGame.style.backgroundRepeat = 'no-repeat';
    customGame.style.position = "absolute";
    customGame.style.left = "0%";
    customGame.style.height = "50px";
    customGame.style.width = "50px";
    customGame.style.fontSize = '15px';
    customGame.textContent = 'Custom';
    customGame.style.backgroundPosition = 'center top';
    customGame.style.backgroundSize = '50%';
    customGame.style.top = "-20%";
    let quickPlay = document.getElementById("classic_mid_quickplay")
    let rlthc = document.getElementById('roomlisttableheadercontainer')
    rlthc.style.color = 'white';
    rlthc.style.backgroundColor = 'black';
    quickPlay.style.position = "absolute";
    quickPlay.style.left = "30%";
    quickPlay.style.height = "50px";
    quickPlay.style.width = "120px";
    quickPlay.style.top = "-20%";
    let menu = document.getElementById("classicmenu")
    menu.style.left = "70%";
    menu.style.position = 'absolute';
    menu.style.top = "60%";
    roomListTopBar.classList.remove("classicTopBar");
    roomListTopBar.style.backgroundColor = "#2b1747";
    let roomlistcreatewindowtoptext = document.getElementById("roomlistcreatewindowtoptext");
    let roomlistbg = document.getElementById("roomlist");
    roomlistcreatewindowtoptext.style.backgroundColor = "#2b1747";
    roomlistbg.classList.remove("roomlist_classic")
    roomlistbg.style.backgroundColor = "#b8a8ff";
    setInterval(editDynamicUi,5);
    return bonkSrc;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(errorMsg);
        throw error;
    }
});