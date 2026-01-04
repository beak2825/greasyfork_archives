// ==UserScript==
// @name           Default troops
// @include        *://*.travian.*/build.php?*gid=16*
// @include        *://*/*.travian.*/build.php?*gid=16*
// @exclude     *://*.travian*.*/hilfe.php*
// @exclude     *://*.travian*.*/log*.php*
// @exclude     *://*.travian*.*/index.php*
// @exclude     *://*.travian*.*/anleitung.php*
// @exclude     *://*.travian*.*/impressum.php*
// @exclude     *://*.travian*.*/anmelden.php*
// @exclude     *://*.travian*.*/gutscheine.php*
// @exclude     *://*.travian*.*/spielregeln.php*
// @exclude     *://*.travian*.*/links.php*
// @exclude     *://*.travian*.*/geschichte.php*
// @exclude     *://*.travian*.*/tutorial.php*
// @exclude     *://*.travian*.*/manual.php*
// @exclude     *://*.travian*.*/ajax.php*
// @exclude     *://*.travian*.*/ad/*
// @exclude     *://*.travian*.*/chat/*
// @exclude     *://forum.travian*.*
// @exclude     *://board.travian*.*
// @exclude     *://shop.travian*.*
// @exclude     *://*.travian*.*/activate.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @exclude     *://*.answers.travian*.*
// @exclude     *.css
// @exclude     *.js
// @description set troop number to 2
// @version 0.0.1.20210322162419
// @namespace https://greasyfork.org/users/750280
// @downloadURL https://update.greasyfork.org/scripts/423781/Default%20troops.user.js
// @updateURL https://update.greasyfork.org/scripts/423781/Default%20troops.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var defaultTroopsNumber = 2; // to local storage
    var settingsWindow = document.createElement("div");
    settingsWindow.classList.add("popup");
    settingsWindow.style.width = "220px";
    settingsWindow.style.height = "120px";
    settingsWindow.style.background = "#ccc";
    settingsWindow.style.position = "absolute";
    settingsWindow.style.top = "500px";
    settingsWindow.style.left = "700px";
    settingsWindow.style.zIndex = "999";

    var heading = document.createElement("h2");
    heading.innerHTML = "количество для набегов";
    heading.style.padding = "10px 13px";
    heading.style.textAlign = "center";

    var field = document.createElement("input");
    field.setAttribute("type", "text");
    field.style.width = "35px";
    field.style.height = "25px";
    field.style.padding = "0 3px";
    field.style.marginLeft = "13px";


    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.innerHTML = "Сохранить";
    btn.style.border = "1px solid green";
    btn.style.borderRadius = "3px";
    btn.style.marginLeft = "3px";
    btn.addEventListener("mouseover", function(){
         this.style.color = "green";
    });
    btn.addEventListener("mouseout", function(){
         this.style.color = "black";
    });
    btn.addEventListener("click", function(){
      if(field.value != undefined) {
         defaultTroopsNumber = field.value;
      }
    });
    settingsWindow.appendChild(heading);
    settingsWindow.appendChild(field);
    settingsWindow.appendChild(btn);

    //document.body.appendChild(settingsWindow);

    var tds = document.querySelectorAll(".column-first");
    if(tds[0] != undefined && tds.length > 0){
        var input = tds[0].querySelector(".text");
        input.setAttribute("value", defaultTroopsNumber);
    }
})();