// ==UserScript==
// @name         R7 Video Load
// @namespace    https://greasyfork.org/users/715485
// @version      0.1
// @description  Assistir video do r7 sem desativar AdBlocker
// @author       luiz-lp
// @match        http*://r7.com/*
// @match        http*://*.r7.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418710/R7%20Video%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/418710/R7%20Video%20Load.meta.js
// ==/UserScript==

function RemoveAntiAdBlocker(){
    if(document.querySelector(".vjs-modal-dialog.vjs-r7-block-msg") != null){
        document.querySelector(".vjs-modal-dialog.vjs-r7-block-msg").remove();
    }
    if(document.querySelector("#r7-player") != null){
        document.querySelector("#r7-player").setAttribute("class", "r7-player video-js vjs-fluid r7-player-dimensions vjs-workinghover vjs-v7 vjs-layout-medium vjs-r7-skin vjs-errors vjs-hls-quality-selector vjs-sprite-thumbnails vjs-seek-buttons vjs-logo vjs-share vjs-videojs-share vjs-has-started vjs-paused vjs-user-inactive");
    }
};

document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "complete") {
        RemoveAntiAdBlocker();
    }

});