// ==UserScript==
// @name         Fast Skin Download For NameMC
// @namespace    aramgan.cf
// @version      1.0.1
// @description  -Fast Skin Download For NameMC
// @author       Armağan#2448
// @match        *.namemc.com/minecraft-skins/*
// @match        *.namemc.com/minecraft-skins/tag/*
// @match        namemc.com/minecraft-skins/*
// @match        namemc.com/minecraft-skins/tag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383273/Fast%20Skin%20Download%20For%20NameMC.user.js
// @updateURL https://update.greasyfork.org/scripts/383273/Fast%20Skin%20Download%20For%20NameMC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getRandomInt(min, max) {
        return Math.random() * (max - min) + min;
    }
    var cards = Array.from(document.getElementsByClassName("card"));
    Array.from(document.getElementsByClassName("card")).forEach((item, index, array)=>{
        var card = array[index];
        var a = array[index].getElementsByTagName("a")[0];
        var id = array[index].getElementsByTagName("a")[0].href.match(/(skin\/)([a-z0-9]+)/)[2];
        var url = "https://tr.namemc.com/texture/"+id+".png";
        var downLink = document.createElement("a");
		var playerName = a.getElementsByTagName("div")[0].innerText;
        downLink.href = url;
        downLink.download = playerName+"_"+getRandomInt(100000,999999)+".png";
        downLink.innerText = "[Download]"
        card.appendChild(downLink);
    })

})();