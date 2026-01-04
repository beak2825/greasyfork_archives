// ==UserScript==
// @name         Skin Nuzlocke
// @namespace    https://bonk.io/
// @version      0.1
// @description  everytime you die, your skin changes, if you run out of skins, you log out (from your account (Only for quickplay!))
// @author       iNeonz
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/469681/Skin%20Nuzlocke.user.js
// @updateURL https://update.greasyfork.org/scripts/469681/Skin%20Nuzlocke.meta.js
// ==/UserScript==
var currentSkin = 1;

setInterval(() => {
    if ((!document.getElementById("ingametextwarning_spectating") || document.getElementById("ingametextwarning_spectating").style.display == 'none' || document.getElementById("ingametextwarning_spectating").style.visibility == 'hidden') && document.getElementById("gamerenderer") && document.getElementById("gamerenderer").children[0] && document.getElementById("gamerenderer").children[0].style.visibility != 'hidden' && document.getElementById("gamerenderer").style.visibility != 'hidden' && document.getElementById("ingamewinner") && document.getElementById("ingamewinner").style.visibility != 'hidden'){
        if (document.getElementById("ingamewinner_bottom") && document.getElementById("ingamewinner_top").textContent != document.getElementById("pretty_top_name").textContent){
            document.getElementById("pretty_top_exit").click();
            setTimeout(() => {
                document.getElementById("leaveconfirmwindow_okbutton").click();
            setTimeout(() => {
                document.getElementById("classic_mid_skins").click();
                setTimeout(() => {
                currentSkin += 1;
                if (currentSkin > 5){
                    document.getElementById("skinmanager_close").click();
                    setTimeout(() => {
                    document.getElementById("pretty_top_exit").click();
                    },5);
                }else{
                document.getElementById("skinmanager_skin"+currentSkin).children[0].click();
                document.getElementById("skinmanager_setactive").click();
                document.getElementById("skinmanager_close").click();
                document.getElementById("classic_mid_quickplay").click();
                setTimeout(() => {
                    document.getElementById("quickPlayWindow_ClassicButton").children[0].click();
                },15);
                }
                },15);
            },15);
            },15);
        }
    }
},500);