// ==UserScript==
// @name         SCRIPT ADS KILLER
// @namespace    faucetadskiller
// @version      0.1
// @description  limpar todos os anúncios de faucets
// @author       Frohike


// @match        https://claimlitoshi.top/*
// @match        https://satoshifaucet.io/*
// @match        https://cryptofy.club/*
// @match        https://coinszon.com/*
// @match        https://cryptoearns.com/*



// @icon         https://cdn-icons-png.flaticon.com/512/1183/1183791.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547185/SCRIPT%20ADS%20KILLER.user.js
// @updateURL https://update.greasyfork.org/scripts/547185/SCRIPT%20ADS%20KILLER.meta.js
// ==/UserScript==

function excluirDiv(id) {
    var elemento = document.getElementById(id);
    if (elemento) {
        elemento.parentNode.removeChild(elemento);
    }
}
var elementosIns = document.getElementsByTagName('ins');

var noAds = setInterval(function(){
elementosIns = Array.from(elementosIns);
elementosIns.forEach(function(elemento) {
    if(elemento.parentNode){
    elemento.parentNode.removeChild(elemento);
    }
});


var elementosIframe = document.getElementsByTagName('iframe');
for (var i = 0; i < elementosIframe.length; i++) {
    var iframe = elementosIframe[i];

if (iframe.src && iframe.src.indexOf("captcha") === -1) {
    var largura = iframe.offsetWidth;
    var altura = iframe.offsetHeight;
    if (largura > 303 || altura > 79) {
        var htmlPersonalizado = '<!DOCTYPE html><html><head></head><body><p style="color:red;font-weight: bold;text-align: center;">[BLOCKED AD!]</p></body></html>';
        var dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlPersonalizado);
        iframe.src = dataUrl;
    }
}
}
excluirDiv("gpt-leaderboard-1");
excluirDiv("gpt-leaderboard-2");
excluirDiv("gpt-leaderboard-3");
excluirDiv("gpt-tall-1");
excluirDiv("gpt-tall-2");
excluirDiv("gpt-tall-3");
excluirDiv("gpt-square-1");
excluirDiv("gpt-square-2");
excluirDiv("gpt-square-3");
excluirDiv("gpt-square-4");
excluirDiv("gpt-tall-3");
excluirDiv("gpt-tall-3");
excluirDiv("gpt-tall-3");
excluirDiv("gpt-tall-3");
excluirDiv("AdTrackGenericStickyClassic");
excluirDiv("wtgSticky");
excluirDiv("admania-flvedsavealert");
excluirDiv("box1");
excluirDiv("box2");
excluirDiv("box3");
excluirDiv("widescreen1");
excluirDiv("box4");
excluirDiv("box5");
excluirDiv("box6");
excluirDiv("widescreen2");
excluirDiv("box7");
excluirDiv("box8");
excluirDiv("box9");
excluirDiv("widescreen3");
excluirDiv("box7");
excluirDiv("box7");
excluirDiv("box7");
excluirDiv("box7");
excluirDiv("box7");
excluirDiv("box7");
excluirDiv("top_adspace");
excluirDiv("cryptocoinsad");
    excluirDiv("ccnsad-pop");


console.log("[BLOCKED AD] Limpando excesso de ads...");
},800);