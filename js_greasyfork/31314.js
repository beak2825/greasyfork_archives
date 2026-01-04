// ==UserScript==
// @name         Script by DD !
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Moj Skrypt :)
// @author       DD
// @match        http://bubble.am/*
// @match        *bubble.am/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31314/Script%20by%20DD%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/31314/Script%20by%20DD%20%21.meta.js
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

alert("Witaj! Skrypt został zrobiony by DD!");

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b>Script by DD<b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Skrypt bedzie ulepszany!</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b>Script by DD<b></span></span></center>";
$("#overlays").after("<div style='z-index: 10000000; border-radius: 30px;position: fixed; top: 70px; left: 3px; text-align: center; width: 250px; background-color: #0e73f9; opacity: 0.7; padding: 7px;'> <div style='border-radius: 50px; text-indent:0; border:3px solid #f9ca0e;  display:inline-block; color:#000; font-family:arial; font-size:18px; font-weight:bold; font-style:normal; height:30px; -webkit-box-shadow: 0px 0px 55px -7px rgba(46,204,113,1); -moz-box-shadow: 0px 0px 52px -7px rgba(46,204,113,1); box-shadow: 0px 0px 52px -7px rgb(202,202,202); line-height:1.5em; text-decoration:none; text-align:center; width: 195px; color: #f9ca0e;'> Script by DD </div><br><br> <a style='color: #f9ca0e; font-family: arial; font-size: 17px;'>Skrypt ze strony DD7.PL! :)</a><a style='color: #fff; font-family: arial;'></a><br> <a><br> <a style='color: #aff9ff; font-family: arial; font-size: 17px;'>Strona: "+ UrlOfPage +"</a><a style='color: #aff9ff; font-family: arial;'><br><br><a style='color: #aff9ff; font-family: arial; font-size: 17px;'>Wersja: 1.0.0</a><br><a style='color: #aff9ff; font-family: arial; font-size: 17px;'>Pozycja gracza: (BUDOWA)</a><br> <a style='color: #aff9ff; font-family: arial; font-size: 17px;'>UUID: "+ client_uuid +"</a><br><br> <a style='color: #aff9ff; font-family: arial; font-size: 17px;'></a><br> <a style='color: #f9ca0e; font-family: arial; font-size: 17px;'>UPDATY JUŻ NIEDŁUGO! :) </a></div>");
$("#overlays").after("<div style='z-index: 10000000; border-radius: 30px;position: fixed; top: 750px; right: 3px; text-align: center; width: 250px; background-color: #0e73f9; opacity: 0.5; padding: 7px;'> <div style='border-radius: 50px; text-indent:0; border:3px solid #f9ca0e;  display:inline-block; color:#000; font-family:arial; font-size:18px; font-weight:bold; font-style:normal; height:30px; -webkit-box-shadow: 0px 0px 55px -7px rgba(46,204,113,1); -moz-box-shadow: 0px 0px 52px -7px rgba(46,204,113,1); box-shadow: 0px 0px 52px -7px rgb(202,202,202); line-height:1.5em; text-decoration:none; text-align:center; width: 195px; color: #f9ca0e;'> Minimapa by DD (BUDOWA) </div><br><br><br><br><br><br><br><br></div>");
$('#instructions').after('<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">UUID</span><input type="text" value="' + client_uuid + '" readonly class="form-control"</div>');
$("title").replaceWith("<title>Script by DD</title>");
$('#playBtn').css({'background-color': '#49c5ff', 'color': '#fff'});
$('#formStd').css({'background-color': '#FFF', 'color': '#49c5ff'});
$('#region').css({'color': '#49c5ff'});
$('#chatlog').css({'background-color': 'transparent', 'color': '#fff'});
$('#gamemode').css({'color': '#49c5ff'});
$('body').css({'color': '#49c5ff'});
$('text').css({'color': '#49c5ff'});
$('.form-control').css({'border': '#49c5ff'});
$('.form-control').css({'color': '#49c5ff'});
$('.text-muted').css({'color': '#49c5ff'});
$('#helloContainer').css({'top': '37%'});
$('#playBtn').css({'border-color': '#0062ff'});
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
    if(event.keyCode == 49){ //Jeden Split [OneSplit]
        ScriptOne();
        setTimeout(ScriptOne, Split2);
    }
    if(event.keyCode == 50){ //Podwójny Split [DoubleSplit]
        ScriptOne();
        setTimeout(ScriptOne, Split);
        setTimeout(ScriptOne, Split*2);
        setTimeout(ScriptOne, Split*3);
    }
    if(event.keyCode == 51){ //Potrojny Split [ThreeSplit]
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

    } 
    if(event.keyCode == 52){ //Poczworny Split [FourSplit]
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
    } 
    if(event.keyCode == 53){ //MegaSplit [MegaSplit]
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
    }
    if(event.keyCode == 54){ //Szybkie Splity [FastSplits]
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
    }
    if(event.keyCode == 55){ //Ultra Szybkie Splity (UltraFastSplits]
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
    }
    if(event.keyCode == 82){ //PopSplit [PopSplit]
    setTimeout(ScriptOne, PopSplit);
    }
    if(event.keyCode == 67){ //PopSplit 2 [PopSplit 2]
    setTimeout(ScriptOne, PopSplit);
    } //Rozne funkcje
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
     //if (event.keyCode == ) {
     //}
     if (event.keyCode == 88) {
     }
     if (client_uuid === null) {
    client_uuid = "";
    var RandomString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var ii=0; ii<15; ii++) client_uuid += RandomString.charAt(Math.floor(Math.random() * RandomString.length));
    localStorage.setItem('client_uuid', client_uuid);
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