// ==UserScript==
// @name         MinerHub
// @namespace    example.com
// @version      1.1
// @description  you know
// @author       Austen and Crazy Dave
// @license      MIT
// @match        https://minerlink.mst.edu/*
// @icon         https://i.imgur.com/PNZPjCi.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443708/MinerHub.user.js
// @updateURL https://update.greasyfork.org/scripts/443708/MinerHub.meta.js
// ==/UserScript==

// MinerHub Logo
var newLogo = "https://i.imgur.com/V30dXmN.png"
function changeLogos(){
    try{
        document.getElementsByClassName('hidden-xs hidden-sm hidden-md')[0].src = newLogo;
        document.getElementsByClassName('img-responsive mx-auto')[0].src = newLogo;
        document.getElementsByClassName('hidden-lg')[0].src = newLogo;
    } catch(error){};
    try{
        document.getElementsByClassName('topbar__icon-small')[0].src = newLogo;
        document.getElementsByClassName('topbar__icon-large')[0].src = newLogo;
        document.getElementsByClassName('topbar__icon-small')[0].style = "max-height: 74px; max-width: 90px; margin: 5px -20px;";
    } catch(error){};
}
// This allows the script to change logos which appear after the page has loaded.
setInterval(changeLogos, 200);

// Dark mode
GM_addStyle("body.body-background {	background: #262626;}body{color: #ffff;}.side-menu {background: #606060;}.active {background-color: #3b6d46;}body.left.side-menu.side-menu-event {background: #3b3b3b;}/* .topbar.topbar-app.topbar--has-toggle.topbar--light.topbar--reverse{background: #6a6a6a;} */.topbar {background: #6a6a6a;}.card {background-color: #000;}.card-block {color: white;}.nav-third-level.nav {color: black;}")