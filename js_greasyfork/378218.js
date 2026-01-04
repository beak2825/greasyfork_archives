// ==UserScript==
// @name         Twitch Global Shortcuts
// @version      1.0
// @description  Makes the Twitch shortcuts work even if the player is not focused.
// @author       zardo <supvit96@mail.ru>
// @license      MIT
// @run-at       document-end
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/249649
// @downloadURL https://update.greasyfork.org/scripts/378218/Twitch%20Global%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/378218/Twitch%20Global%20Shortcuts.meta.js
// ==/UserScript==

// Space = Pause/play
// F = Toggle fullscreen (not CTRL+F)
// M = Toggle mute
// ArrowUp = Volume Up
// ArrowDown = Volume Down

(function() {
    'use strict';
    /*setTimeout(function(){
        var overlay = document.querySelector(".extension-container");
        if(overlay)overlay.hidden = true;//hides overlay
    },0);*/
    var keys = ["ArrowUp", "ArrowDown", "Space"];//add new keys here (global shortcuts, work even if the player is not focused)
    window.addEventListener("keydown", function(e){
        if(e.ctrlKey || e.metaKey || ~['TEXTAREA','INPUT'].indexOf(e.srcElement.tagName))return;
        switch(e.code.toLowerCase()){
            case "keyf":
                //e.preventDefault();
                //e.stopPropagation();
                clickButton(".qa-fullscreen-button");
            break;
            case "keym":
                clickButton(".qa-control-volume");
            break;
        }
        if(document.activeElement==document.body && ~keys.indexOf(e.code)){
            e.preventDefault();
            sendKeyEvent(document.querySelector(".video-player__container.player"), e.keyCode);
        }
    });
    function clickButton(selector){
        var butt;
        if(!(butt = document.querySelector(selector)))return;
        butt.click();
    }
    function sendKeyEvent(elem, keyCode){
        elem.dispatchEvent(new KeyboardEvent("keydown", {
            bubbles : true,
            cancelable : true,
            keyCode : keyCode
        }));
    }
})();