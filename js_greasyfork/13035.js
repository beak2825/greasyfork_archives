// ==UserScript==
// @name         UseClix viewer
// @namespace    jorgequintt
// @version      1.3.1
// @description  UseClix automatic views
// @author       Jorge Quintero
// @match        *://*.useclix.com/*
// @grant UnsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13035/UseClix%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/13035/UseClix%20viewer.meta.js
// ==/UserScript==

var algo = "nada";

var username = ""; // TU USERNAME, ENTRE LAS COMILLAS
var password = ""; // TU PASSWORD, ENTRE LAS COMILLAS

//visor de Ads normales
if (window.location.href.indexOf("ads.php")==19){ 
    var ads = document.getElementsByClassName("surf");

    var onAds = [];

    for (var i=(ads.length-1);i>=0;i--){
        if(ads[i].className!=="surf image2"){
            if(ads[i].className!=="surf image3"){
                onAds.push(ads[i]);
            }
        }
    }

    function seeAd(n){
        setTimeout(function() {onAds[n].getElementsByTagName("A")[0].click()},1000);
        setTimeout(function() {onAds[n].getElementsByTagName("A")[1].click();},2000);
    }
document.title="("+onAds.length+" ads restantes)";
    if(onAds.length==0){
        window.location = "http://useclix.com/adgrid.php";
    }else{
        seeAd(0);
    }
}
if (window.location.href.indexOf("login.php")!=-1){
    setTimeout(function() {document.getElementById("login_username").value=username;},5000);
    setTimeout(function() {document.getElementById("pwd").value=password;},6000);
    setTimeout(function() {document.getElementsByClassName("ka_button small_button small_royalblue")[0].click();},7000);
    }
if (window.location.href.indexOf("acc.php")!=-1){
    setTimeout(function() {window.location="http://useclix.com/ads.php";},30000);
    }
//visor de Grids
if (window.location.href.indexOf("adgrid.php")==19){ 
    var chances=document.getElementsByTagName("P")[1].innerText.replace("You have ","").replace(" chances out of 20 today.","");
    var grids = document.getElementsByTagName("table")[0].getElementsByTagName("td");

    var avGrids = [];

    for (var i=(grids.length-1);i>=0;i--){
        if(grids[i].className!=="usegrid_clicked"){
            avGrids.push(grids[i]);
        }
    }

    function seeGrid(n){
        setTimeout(function() {avGrids[n].click()},1500);
    }

    var randomFromAv=Math.floor(Math.random() * avGrids.length);
    document.title="("+chances+" grids restantes)";
    if(chances!=="0"){seeGrid(randomFromAv);}
}

//controlador de Ads (?)
if (window.location.href.indexOf("cks.php?")==19 || window.location.href.indexOf("cksag.php?")==19){
    unsafeWindow.document.hasFocus = function () {return true;};
    function verifyToClose(){
        if(document.getElementsByClassName("success")[0].style.display=="block"){
            unsafeWindow.document.hasFocus = function () {return true;};
            setTimeout(function(){document.getElementsByClassName("success")[0].getElementsByTagName("A")[0].click();},700);
        }
    }
    setInterval(verifyToClose,1000)
}