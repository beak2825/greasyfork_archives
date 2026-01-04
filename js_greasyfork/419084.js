// ==UserScript==
// @name         Crunchyroll Player Wide
// @namespace    https://greasyfork.org/users/715485
// @version      0.3
// @description  Coloca todos os players do crunchroll no formato wide (Modo Teatro)
// @author       luiz-lp
// @match        *://www.crunchyroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419084/Crunchyroll%20Player%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/419084/Crunchyroll%20Player%20Wide.meta.js
// ==/UserScript==

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        if(document.querySelector("#showmedia_video_box") != null){
            document.querySelector("#showmedia_video_box").setAttribute("id", "showmedia_video_box_wide");
        }
        if(document.querySelector("#showmedia_video_box_wide") != null){
            document.querySelector("#showmedia_video_box_wide").setAttribute("class", "wide-player-container wide-player-container-16-9");
        }
        if(document.querySelector("#main_content") != null){
            document.querySelector("#main_content").setAttribute("class", "left");
        }
        var divPlayer = document.getElementById('showmedia_video');
        var divTarget = document.querySelector(".showmedia-trail.cf");
        insertAfter(divTarget, divPlayer);
    }
});