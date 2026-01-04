// ==UserScript==
// @name         Script by DD
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Moj Skrypt v2 :)
// @author       DD
// @match        http://bubble.am/*
// @match        http://petridish.pw/en/*
// @match        http://www.gkclan.me/*
// @match        http://agariogame.club/*
// @match        http://agar.red/*
// @match        http://mgar.io/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://gaver.io/*
// @match        http://nbk.io/*
// @match        http://agar.city/*
// @match        http://agarabi.com/*
// @match        http://ogarz.ovh/*
// @match        http://agarz.com/*
// @match        http://dual-agar.online/*
// @match        http://agariohere.org/*
// @match        http://agariofun.com/*
// @match        http://agar.bz/*
// @match        http://cellcraft.io/*
// @match        http://agarhub.io/*
// @match        http://agarly.com/*
// @match        http://www.inciagario.com/*
// @match        http://agario.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31315/Script%20by%20DD.user.js
// @updateURL https://update.greasyfork.org/scripts/31315/Script%20by%20DD.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var DawanieMasy = false;
var Funkcja1 = false;
var Split = 25;

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b>Script by DD<b></span></span></center>";
load();
function load(){
    if(document.getElementById("overlays").style.display!="none"){
        document.getElementById("settings").style.display="block";
        if(document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if(document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
    }else{
        setTimeout(load, 100);
    }
}
function keydown(event){
    if(event.keyCode == 87){
        DawanieMasy = true;
        setTimeout(ScriptTwo, Split);
    }
    if(event.keyCode == 50){ 
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*4);
    }
    if(event.keyCode == 51){ 
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
    } 
    if(event.keyCode == 52){ 
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);
    }
    if(event.keyCode == 53){ 
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);
        setTimeout(ScriptOne, Split*6);
        setTimeout(ScriptOne, Split*7);
    }
    if(event.keyCode == 90){ 
        X = window.innerWidth/-100;
        Y = window.innerHeight/-100;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
    if(event.keyCode == 65){
        X = window.innerWidth/1;
        Y = window.innerHeight/1;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
    if(event.keyCode == 65){
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);
        setTimeout(ScriptOne, Split*6);
        setTimeout(ScriptOne, Split*7);
    }
    if(event.keyCode == 82){ //PopSplit [PopSplit]
        setTimeout(ScriptOne, Split*5.10000000000000);
    }
}
function keyup(event){
    if(event.keyCode == 87){
        DawanieMasy = false;
    }
    if(event.keyCode==79){
        Funkcja1 = false;
    }
}
function ScriptTwo(){
    if(DawanieMasy){
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(ScriptTwo, Split);
    }
}
function ScriptOne(){
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
//Script by DD! :D
//Script by DD! :D
//Script by DD! :D
//Script by DD! :D
//Script by DD! :D