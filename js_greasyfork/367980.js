// ==UserScript==
// @name         Editado por Yudha Pratama
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Mod Script
// @author       Yudha Pratama
// @match        http://bubble.am/*
// @match        *buble.am/*
// @match        http://agarnet.me
// @match        *agarnet.me/*
// @match        http://alis.io/*
// @match        *alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367980/Editado%20por%20Yudha%20Pratama.user.js
// @updateURL https://update.greasyfork.org/scripts/367980/Editado%20por%20Yudha%20Pratama.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var UrlOfPage = document.URL;
var client_uuid = localStorage.getItem('client_uuid');
var DawanieMasy = false;
var Funkcja1 = false;
var Split = 25;
var PodwojnySplit = 140;
var PotrojnySplit = 280;
var PoczwornySplit = 500;
var PopSplit = 50.500000;
var OsiemRazySplit = 520;
var SzesnascieRazySplit = 660;
var TrzydziesciDwaRazySplit = 800;
$("#overlays").after("<div style='z-index: 10000000; border-radius: 10px;position: fixed; top: 50px; left: 3px; text-align: center; width: 250px; background-color: #FFFFFF; opacity: 0.7; padding: 7px;'> <div style='border-radius: 50px; text-indent:0; border:2px solid #7a1818;  display:inline-block; color:#000; font-family:Comic Sans MS; font-size:18px; font-weight:bold; font-style:normal; height:30px; -webkit-box-shadow: 0px 0px 55px -7px rgba(46,204,113,1); -moz-box-shadow: 0px 0px 52px -7px rgba(46,204,113,1); box-shadow: 0px 0px 52px -7px rgb(202,202,202); line-height:1.5em; text-decoration:none; text-align:center; width: 195px; color: #7a1818;'> MACRO </div><br><br> <a style='color: #7a1818; font-family: Comic Sans MS; font-size: 17px;'>Split Time</a><a style='color: 808080; font-family: Comic Sans MS;'></a><br> <a><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>E = Fast Feed</a><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>2 = Split2x</a><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>3 = Split4x</a><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>4 = Split8x</a><br><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>Happy Fun ^_^</a><br> <a style='color: #000000; font-family: arial; font-size: 17px;'>Editado por Yudha Pratama</a></div>");

$("title").replaceWith("<title>Bubble.am</title>");
$('#playBtn').css({'background-color': '#A52A2A', 'color': '#fff'});
$('#formStd').css({'background-color': '#', 'color': '#11242e'});
$('#region').css({'color': '#11242e'});
$('#chatlog').css({'background-color': 'transparent', 'color': '#7FFFD4'});
$('#gamemode').css({'color': '#000000'});
$('body').css({'color': '#000000'});
$('text').css({'color': '#000000'});
$('.form-control').css({'border': '#11242e'});
$('.form-control').css({'color': '#11242e'});
$('.text-muted').css({'color': '#11242e'});
$('#helloContainer').css({'top': '37%'});
$('#playBtn').css({'border-color': '#5F9EAD'});
load();
    function keydown(event){
    if(event.keyCode == 87){
        DawanieMasy = true;
        setTimeout(ScriptTwo, Split);
    }
    if(event.keyCode == 50){ // Split2x
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);

    }
    if(event.keyCode == 51){ // Split4x
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);
        setTimeout(ScriptOne, Split*6);
        setTimeout(ScriptOne, Split*7);
        setTimeout(ScriptOne, Split*8);
        setTimeout(ScriptOne, Split*9);
        setTimeout(ScriptOne, Split*10);
        setTimeout(ScriptOne, Split*11);
        setTimeout(ScriptOne, Split*12);
        setTimeout(ScriptOne, Split*13);
        setTimeout(ScriptOne, Split*14);
        setTimeout(ScriptOne, Split*15);
        setTimeout(ScriptOne, Split*16);

    }
    if(event.keyCode == 52){ // Split8x
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
        setTimeout(ScriptOne, Split*4);
        setTimeout(ScriptOne, Split*5);
        setTimeout(ScriptOne, Split*6);
        setTimeout(ScriptOne, Split*7);
        setTimeout(ScriptOne, Split*8);
        setTimeout(ScriptOne, Split*9);
        setTimeout(ScriptOne, Split*10);
        setTimeout(ScriptOne, Split*11);
        setTimeout(ScriptOne, Split*12);
        setTimeout(ScriptOne, Split*13);
        setTimeout(ScriptOne, Split*14);
        setTimeout(ScriptOne, Split*15);
        setTimeout(ScriptOne, Split*16);
        setTimeout(ScriptOne, Split*17);
        setTimeout(ScriptOne, Split*18);
        setTimeout(ScriptOne, Split*19);
        setTimeout(ScriptOne, Split*20);
        setTimeout(ScriptOne, Split*21);
        setTimeout(ScriptOne, Split*22);
        setTimeout(ScriptOne, Split*23);
        setTimeout(ScriptOne, Split*24);
        setTimeout(ScriptOne, Split*25);
        setTimeout(ScriptOne, Split*26);
        setTimeout(ScriptOne, Split*27);
        setTimeout(ScriptOne, Split*28);
        setTimeout(ScriptOne, Split*29);
        setTimeout(ScriptOne, Split*30);
        setTimeout(ScriptOne, Split*31);
        setTimeout(ScriptOne, Split*32);
        setTimeout(ScriptOne, Split*33);
        setTimeout(ScriptOne, Split*34);
        setTimeout(ScriptOne, Split*35);
        setTimeout(ScriptOne, Split*36);
        setTimeout(ScriptOne, Split*37);
        setTimeout(ScriptOne, Split*38);
        setTimeout(ScriptOne, Split*39);
        setTimeout(ScriptOne, Split*40);
    } //Mod
    if(event.keyCode == 90){
        X = window.innerWidth/-1;
        Y = window.innerHeight/-1;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
    if(event.keyCode == 65){
        X = window.innerWidth/1;
        Y = window.innerHeight/1;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
    if(event.keyCode == 68){
        X = window.innerWidth/2.05;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
    if(event.keyCode == 70){
        Y = window.innerWidth/2;
        $("canvas").trigger($.Event("mousemove", {client: X, clientY: Y}));
    }
     if (event.keyCode == 86) {
        $('#winStuff').show();
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
//Script by Yudha Pratama
//Script by Yudha Pratama
//Script by Yudha Pratama
//Script by Yudha Pratama
//Script by Yudha Pratama