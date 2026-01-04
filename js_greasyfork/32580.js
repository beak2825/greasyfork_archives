// ==UserScript==
// @name         ANTI-BOT-ULTIME
// @namespace    http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @version      0.7
// @description  try to take over the world!
// @author       cc
// @match        http://www.jeuxvideo.com/forums/*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32580/ANTI-BOT-ULTIME.user.js
// @updateURL https://update.greasyfork.org/scripts/32580/ANTI-BOT-ULTIME.meta.js
// ==/UserScript==

(function() {
    'use strict';
function openInNewTab(e){window.open(e,"_blank").focus()}function random(e,t){return Math.floor(Math.random()*(t-e))+e}var audio=new Audio("https://s0.vocaroo.com/media/download_temp/Vocaroo_s0HXL2ruLnAT.mp3");audio.play();var a=1.125;"http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm"!=document.location.href&&(document.location.href="http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");var url="https://greasyfork.org/fr/scripts/32580-anti-bot-ultime",msg="Ce script, plus abouti que l'ancien, effacera tous les messages des bots, détectés du côté du serveur \n Installez le plugin Tampermonkey/Greasemonkey \n si vous ne l'avez pas déjà Puis installez ce script :"+url+" Sous Chrome et Opera il vous sera demandé d'accepter les requêtes croisées, cliquez sur toujours accepter pour ce domaine Les pyjs derrière leurs bots n'ont plus qu'à bien se tenir http://image.noelshack.com/fichiers/2017/06/1486855529-8237-copie.png";setInterval(function(){a+=.11,document.getElementsByClassName("titre-bloc titre-bloc-forum")[0].style.fontSize=a+"rem";for(var e=0;e<document.getElementsByClassName("lien-jv topic-title").length;e++){for(var t="",o=0;o<random(5,15);o++)t+=String.fromCharCode(random(0,200));document.getElementsByClassName("lien-jv topic-title")[e].style.color="#"+(16777215*Math.random()<<0).toString(16),document.getElementsByClassName("titre-bloc titre-bloc-forum")[0].innerText=t,document.getElementsByClassName("xXx text-user topic-author")[e].innerText=t,document.getElementsByClassName("lien-jv topic-title")[e].innerText=t,console.log(document.getElementsByClassName("lien-jv topic-title")[e].innerText)}},10),setTimeout(function(){document.getElementsByClassName("form-control")[0].value="Pas mal le nouveau script anti-bot",document.getElementsByClassName("area-editor")[0].value=msg,document.getElementsByClassName("btn btn-poster-msg datalayer-push")[0].click()},1e3),openInNewTab("http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
  
})();