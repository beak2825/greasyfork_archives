// ==UserScript==
// @name         OibiousMacromus
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Oib macros and tools
// @author       Chromium
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31267/OibiousMacromus.user.js
// @updateURL https://update.greasyfork.org/scripts/31267/OibiousMacromus.meta.js
// ==/UserScript==
var rightgear = -1;
var leftgear = -1;
var upcolor = -1;
var downcolor = -1;
var dofeed = 0;
var closen = 0;
var rainbow = 100000;
var colorch = 6;
var alpha = 0;
var fsp = 0;
var onsp = 0;
var rainbowtick = setInterval(rainbowxp, 100);
var tima = setInterval(ohno, 1);
function rainbowxp(){
rainbow += 1111;
LOADER.COLOR_BAR = "#" + rainbow;
DRAW.XP_COLOR = "#" + rainbow;
DRAW.XP_REST_COLOR = "#080808";
if (rainbow >= 161616){
rainbow = 100000;
}}
function  ohno(){
S.WHITE = colorch;
    if (onsp == 1) {
        o0O11128l1I.spawn();
    }
    if (fsp == 1) {
    player.select.only_oibs();
    o0O11128l1I.split();
    o0O11128l1I.move_units(mouse.pos);
    fsp = 0;
    }
    if (alpha == 1) {
    for (var i = 0 ; i < o0O11174l1I.length ; i++){ if (o0O11174l1I[i]) o0O11174l1I[i].vuln=1;}
    }
    if (alpha === 0) {
    for (var k = 0 ; k < o0O11174l1I.length ; k++){ if (o0O11174l1I[k]) o0O11174l1I[k].vuln=0;}
    }
    if (closen == 1) {
    o0O11128l1I.lost ();
    closen = 0;
    }}
function mine() {
    player.select.only_oibs();
    o0O11128l1I.feed();
    player.select.only_queen();
    o0O11128l1I.o0O11116l1I(mouse.pos);
}
function KeyCheck(e)
{
if (e.keyCode == 54) {
            onsp += 1;
    }
        if (onsp >= 2){
            onsp = 0;
    }
if (e.keyCode == 55) {
            fsp += 1;
}
        if (fsp >= 2){
            fsp = 0;
            }
if (e.keyCode == 56) {
            alpha += 1;
    }
        if (alpha >= 2){
            alpha = 0;
    }
if (e.keyCode == 57) {
            colorch += 1;
    }
        if (colorch >= 7){
            colorch = 0;
    }
if (e.keyCode == 46) {
            closen += 1;
    }
if (e.keyCode == 80) {
            playm += 1;
    }
        if (playm >= 2){
            playm = 0;
    }
if (e.keyCode == 189) {
            volumeset -= 0.01;
    }
if (e.keyCode == 187) {
            volumeset += 0.01;
    }
if (e.keyCode == 192) {
            mine();
    }
if (e.keyCode == 97) {
            var namelist = [":The List:"];
            for (var k = 0 ; k < o0O11174l1I.length ; k++){
            if (o0O11174l1I[k])
            namelist.push(o0O11174l1I[k].nickname);
            } if (k>=32){
            alert(namelist.join(",   "));
            }
}
if (e.keyCode == 39) {
    if(rightgear == 4){
    rightgear = -1;
    }
    rightgear += 1;
    o0O11174l1I[player.id].shield = rightgear;
    }
if (e.keyCode == 38) {
    if(upcolor == 6){
    upcolor = -1;
    }
    upcolor +=1;
    o0O11174l1I[player.id].color = upcolor;
    }
if (e.keyCode == 37) {
    if(leftgear == 4){
    leftgear = -1;
    }
    leftgear += 1;
    o0O11174l1I[player.id].sword = leftgear;
    }
if (e.keyCode == 40) {
    if(downcolor == 5){
    downcolor = -1;
    }
    downcolor +=1;
    o0O11174l1I[player.id].spots = downcolor;
    }
if (e.keyCode == 18) {
            dofeed += 1;
if (dofeed >= 1){
    o0O11128l1I.spawn();
    player.select.screen();
    o0O11128l1I.split();
    player.select.screen();
    o0O11128l1I.feed();
    dofeed = 0;
}}}
var musiclink = 0;
var link = "https://www.dropbox.com/s/k57dsok4tyw7u53/Xtrullor%20-%20The%20Armor%20of%20God.mp3?raw=1";
var volumeset = 0.3;
var playm = 0;
var winterval = setInterval(play, 250);
var music = new Audio(link);
var deathsound = new Audio('https://www.dropbox.com/s/cdw1zj7sevvzyed/Sad%20-%20Violin.mp3?raw=1');
function play(){
if(playm == 1){
    music.volume = volumeset;
    music.play();
    music.loop = true;
}
if(playm === 0){
    music.pause();
}}
window.addEventListener('keydown', KeyCheck, true);
alert("Chromium Script V1.8\n\nChangelog:\nObfiscated for Lapamauve :)\nNumpad 1 list all players on the server in an alert\nUp Arrow will change your queens color\nDown Arrow will change your trail\nLeft Arrow gives you a cosmetic sword\nRight Arrow gives a cosmetic shield\n\nControls:\n6 - Autospawn oibs\n7 - Split Macro\n8 -  Alpha Trigger\n9 - Outline Color\n+ = Sound Volume up\n- = Sound Vomue down\nP =  Sound  on/off\ndel = kick yourself\n` = LANDMINE!\nAlt = Autofeed");