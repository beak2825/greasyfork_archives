// ==UserScript==
// @name         ATF Theme Manager
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Change the color of your ATF Chat
// @author       GorePrince
// @match        https://chat.allthefallen.moe/*
// @icon         https://www.google.com/s2/favicons?domain=allthefallen.moe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        let
// @downloadURL https://update.greasyfork.org/scripts/428835/ATF%20Theme%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/428835/ATF%20Theme%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function (){
        var OldURL = GM_getValue("SavedURL");
        var CurrentURL = window.location.href;
        if (OldURL != CurrentURL){
            console.log("URL Changed");
            GM_setValue("SavedURL",CurrentURL);
            URLCHANGED();
        }
    }, 100);
    URLCHANGED();


})();

function URLCHANGED(){
    var waitForHeader = setInterval(function (){
        var Header = document.querySelector("#rocket-chat > div.rc-old.main-content.content-background-color > div > main > header > div > div.rcx-box.rcx-box--full.rcx-button-group--medium.rcx-button-group--align-start.rcx-button-group.rcx-css-6bg1ps");
        if (Header){
            UpdateColors();
            var oldButton = document.querySelector("#rocket-chat > div.rc-old.main-content.content-background-color > div > main > header > div > div.rcx-box.rcx-box--full.rcx-button-group--medium.rcx-button-group--align-start.rcx-button-group.rcx-css-6bg1ps > button:nth-child(8)")
            if (oldButton){
                oldButton.remove();
            }
            let Button = document.createElement("button");
            Button.innerText = "Change Background Color";
            Header.append(Button);
            Button.onclick = function(){
                var PromptResponse = prompt("Set Background Color \n Input a Hex Value");
                GM_setValue("BackgroundColor",PromptResponse);
                UpdateColors();

            }
            Button.class = "Change Theme"
            clearInterval(waitForHeader);
        } else {
            console.log("Header Not Found");
        }
    }, 100);

}

function UpdateColors(){
    var Color = GM_getValue("BackgroundColor");
    if (GM_getValue("BackgroundColor")){
        UpdateElementColorCSS(document.querySelector(":root"),"--color-darkest",hexToRgb(Color,1))
    UpdateElementColorCSS(document.querySelector(":root"),"--color-darker",hexToRgb(Color,.8))
    UpdateElementColorCSS(document.querySelector("body.dark-mode"),"--sidebar-background",hexToRgb(Color,1.3))
    UpdateElementColorCSS(document.querySelector(".rooms-list.sidebar--custom-colors"),"--rcx-sidebar-item-background-color-hover",hexToRgb(Color,.7))
    UpdateElementColorBG(document.querySelector("#rocket-chat div"), hexToRgb(Color,1.2));
    UpdateElementColorBG(document.querySelector("#dark-mode-button"),hexToRgb(Color,.5))
    UpdateElementColorBG(document.querySelector("#rocket-chat button:nth-child(2)"),hexToRgb(Color,.5))
    UpdateElementColorBG(document.querySelector("#rocket-chat button:nth-child(3)"),hexToRgb(Color,.5))
    UpdateElementColorBG(document.querySelector("#rocket-chat button:nth-child(4)"),hexToRgb(Color,.5))
    UpdateElementColorBG(document.querySelector("#rocket-chat button:nth-child(5)"),hexToRgb(Color,.5))
    UpdateElementColorBG(document.querySelector("#rocket-chat button:nth-child(6)"),hexToRgb(Color,.5))
}



}

function UpdateElementColorCSS(style,propertyname,color){
    style.style.setProperty(propertyname,color);
}
function UpdateElementColorBG(style,color){
    style.style.backgroundColor = color;
}


function hexToRgb(hex, multiplier) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return "rgb(" + (r * multiplier) + "," + (g * multiplier) + "," + (b * multiplier) + ")";
}