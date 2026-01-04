// ==UserScript==
// @name         Easy Garden Watering
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  This code will remove the "water plant" or "harvest plant" button once clicked.
// @author       You
// @match        https://pokefarm.com/garden
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokefarm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482147/Easy%20Garden%20Watering.user.js
// @updateURL https://update.greasyfork.org/scripts/482147/Easy%20Garden%20Watering.meta.js
// ==/UserScript==

(function() {
    "use strict";

    console.log("Easy Garden Watering Loaded");

    console.log("-- Start Variables --");

    // Variables
    let scriptToggle = false;
    console.log("scriptToggle =");
    console.log(scriptToggle);

    let toggleBtn;
    console.log("toggleBtn =");
    console.log(toggleBtn);

    let gardenUl = document.querySelectorAll("#garden_content > ul")[0];
    console.log("gardenUl =");
    console.log(gardenUl);

    let gardenUlLi = document.querySelectorAll("#garden_content > ul > li");
    console.log("gardenUlLi =");
    console.log(gardenUlLi);

    let cmdButton = document.querySelectorAll(".cmd > button");
    console.log("cmdButton =");
    console.log(cmdButton);

    let cmd = document.querySelectorAll(".cmd");
    console.log("cmd =");
    console.log(cmd);

    let divStatus = document.querySelectorAll("#garden_content > ul > li> div.status");
    console.log("divStatus =");
    console.log(divStatus);

    let UlLi = document.querySelectorAll("ul > li");
    console.log("UlLi =");
    console.log(UlLi);

    let reloadbtn = document.querySelectorAll(".reloadbtn")[0];
    console.log("reloadbtn =");
    console.log(reloadbtn);

    let reloadgarden = document.getElementById("reloadgarden");
    console.log("reloadgarden =");
    console.log(reloadgarden);

    // ---------------------------------------------------------------------------------------------------- //

    // Insert Toggle Button
    reloadbtn.insertAdjacentHTML("afterbegin", "<button id='toggleBtn'>Toggle Easy Garden Watering On/Off</button>");

    toggleBtn = document.getElementById("toggleBtn");
    console.log(toggleBtn);
    toggleBtn["style"].marginRight = "10px";

    // ---------------------------------------------------------------------------------------------------- //

    reloadgarden.addEventListener("click", function(e) {
        e.preventDefault();
        location.reload();
        return false;
    });

    // ---------------------------------------------------------------------------------------------------- //

    // Script Toggle Function
    toggleBtn.addEventListener("click", function() {
        scriptToggle = !scriptToggle;

        // Script On/Off Logic
        if (scriptToggle == true) {
            console.log(scriptToggle);

            // CSS Adjustments

            gardenUl["style"].position = "relative";
            gardenUl["style"].height = "200px";
            gardenUl["style"].margin = "10px";
            gardenUl["style"].display = "flex";
            gardenUl["style"].flexWrap = "wrap";
            gardenUl["style"].alignItems = "center";
            gardenUl["style"].justifyContent = "center";

            gardenUlLi.forEach(li => {
                li["style"].position = "absolute";
                li["style"].boxSizing = "border-box";
                li["style"].color = "transparent";
                li["style"].width = "100%";
                li["style"].height = "100%";
                li["style"].overflow = "hidden";
            });

            divStatus.forEach(div => {
                div["style"].display = "none";
            });

            cmd.forEach(div => {
                div["style"].boxSizing = "border-box";
                div["style"].height = "100%";
                div["style"].width = "100%";
                div["style"].top = "0";
                div["style"].left = "0"
            });

            cmdButton.forEach(btn => {
                btn["style"].textTransform = "capitalize";
                btn["style"].fontSize = "32pt";
                btn["style"].boxSizing = "border-box";
                btn["style"].height = "100%";
                btn["style"].width = "100%";
                btn["style"].borderRadius = "0";

                // Water Plants Button Disappear On Click
                btn.addEventListener("click", function() {
                    btn.closest("ul>li").style.display = "none";
                    btn.getAttribute("disabled", true);
                });
            });
        } else {
            console.log(scriptToggle);
            // CSS Adjustments

            gardenUl["style"].position = "";
            gardenUl["style"].height = "";
            gardenUl["style"].margin = "";
            gardenUl["style"].display = "";
            gardenUl["style"].flexWrap = "";
            gardenUl["style"].alignItems = "";
            gardenUl["style"].justifyContent = "";

            gardenUlLi.forEach(li => {
                li["style"].position = "";
                li["style"].boxSizing = "";
                li["style"].color = "";
                li["style"].width = "";
                li["style"].height = "";
                li["style"].overflow = "";
                li["style"].display = "inline-block";
            });

            divStatus.forEach(div => {
                div["style"].display = "";
            });

            cmd.forEach(div => {
                div["style"].boxSizing = "";
                div["style"].height = "";
                div["style"].width = "";
                div["style"].top = "";
                div["style"].left = "";
            });

            cmdButton.forEach(btn => {
                btn["style"].fontSize = "";
                btn["style"].boxSizing = "";
                btn["style"].height = "";
                btn["style"].width = "";
                btn["style"].borderRadius = "";
                btn["style"].borderRadius = "";

                // Water Plants Button Disappear On Click Event Listener Removal
                btn.removeEventListener("click", function() {
                    btn.closest("ul>li").style.display = "none";
                    btn.getAttribute("disabled", true);
                });
            });
        };
    });


})();