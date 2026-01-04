// ==UserScript==
// @name         NickName For Non-Steam friend
// @namespace    https://greasyfork.org/fr/users/191481-zeper
// @version      0.0.1
// @description  Allow you to rename steam user that are NOT in your steam friends!
// @author       Zeper
// @match        *://steamcommunity.com/profiles/*
// @match        *://steamcommunity.com/id/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537030/NickName%20For%20Non-Steam%20friend.user.js
// @updateURL https://update.greasyfork.org/scripts/537030/NickName%20For%20Non-Steam%20friend.meta.js
// ==/UserScript==


function NickNameOnClick(event) {
    if (event.button == 1){
        event.preventDefault();
        event.stopPropagation();
        ShowNicknameModal();
    }
}

window.NickNameOnClick = NickNameOnClick;
document.getElementsByClassName("actual_persona_name")[0].setAttribute("onmousedown", "NickNameOnClick(event)");
