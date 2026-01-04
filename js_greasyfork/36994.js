// ==UserScript==
// @name Auto post new games on all sites
// @namespace Violentmonkey Scripts
// @description Auto post new games on [discordapp and 2ch]
// @version 1.00
// @match https://discordapp.com/channels/*
// @include https://2ch.hk/brg/res/814450.html*
// @include https://2ch.hk/b/res/*
// @include https://epicmafia.com/game/*
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/36994/Auto%20post%20new%20games%20on%20all%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/36994/Auto%20post%20new%20games%20on%20all%20sites.meta.js
// ==/UserScript==

console.log("start");
//setTimeout(()=>{
if (document.getElementById("game_breadcrumb")) {
    let location = document.URL;
    GM_setValue("_oGameSrcCh", location);
    GM_setValue("_oGameSrcFirstConf", location);
    GM_setValue("_oGameSrcSecondConf", location);
    console.log(GM_getValue("_oGameSrcCh"));
} else {
    setTimeout(() => {
        console.log("start222");
        let chInput = document.getElementById("shampoo");
        let IsDiscordInput = document.querySelector("div.flex-spacer.flex-vertical > form > div > div > textarea");

        if (chInput) {
            console.log(GM_getValue("_oGameSrcCh", ""));
            chInput.addEventListener("click", () => {
                setChInput();
            });
            function setChInput() {
                let url = GM_getValue("_oGameSrcCh", "");
                if (url && !chInput.value) {
                    chInput.value = url;
                    GM_setValue("_oGameSrcCh", "");
                }
            } 
        } else if (IsDiscordInput) {
            console.log(GM_getValue("_oGameSrcFirstConf", ""));
            console.log(GM_getValue("_oGameSrcSecondConf", ""));
            let firstConfButton= document.querySelector("a[href^=\"/channels/327522669346029568\"]");
            let secondConfButton  = document.querySelector("a[href^=\"/channels/349548514461745153\"]");
            firstConfButton.addEventListener("click", () => {
                setTimeout(()=> {
                    setDiscordInput();
                    addEventListenerToDiscordInput();
                }, 500);
            });
            secondConfButton.addEventListener("click", () => {
                setTimeout(()=> {
                    setDiscordInput();
                    addEventListenerToDiscordInput();
                }, 500);
            });
            setDiscordInput();
            addEventListenerToDiscordInput();
            function addEventListenerToDiscordInput() {
                let discordInput = document.querySelector("div.flex-spacer.flex-vertical > form > div > div > textarea");
                discordInput.addEventListener("click", () => {
                    setDiscordInput();
                });
            }
            function setDiscordInput() {
                let discordInput = document.querySelector("div.flex-spacer.flex-vertical > form > div > div > textarea");
                let isFirstConf = firstConfButton.parentElement.parentElement.parentElement.classList.length === 2;
                let isSecondConf = secondConfButton.parentElement.parentElement.parentElement.classList.length === 2;
                let url1 = GM_getValue("_oGameSrcFirstConf", "");
                let url2 = GM_getValue("_oGameSrcSecondConf", "");
                console.log(url1);
                console.log(url2);
                if (!discordInput.value) {
                    if (isFirstConf && url1) {
                        discordInput.value = "@Villager @EpicMafia " + url1;
                        GM_setValue("_oGameSrcFirstConf", "");
                    } else if (isSecondConf && url2) {
                        discordInput.value = url2;
                        GM_setValue("_oGameSrcSecondConf", "");
                    }
                }
            }
        }
    }, 5000);
}
//}, 10000);