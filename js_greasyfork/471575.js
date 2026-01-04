// ==UserScript==
// @name         YTM Add to playlist shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a shortcut to the P button to add the current song to a playlist
// @author       Radulfus
// @match        *://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/471575/YTM%20Add%20to%20playlist%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/471575/YTM%20Add%20to%20playlist%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("keydown",function(event) {

        console.log("keycode? " + event.keyCode);
        if(event.keyCode === 80) {
            console.log("i'm in");
            Array.from(document.getElementsByTagName("ytmusic-menu-renderer")).filter(ele=>ele.classList=="menu style-scope ytmusic-player-bar")[0].children[2].dispatchEvent(new Event("click"));
            Array.from(document.getElementsByTagName("ytmusic-menu-renderer")).filter(ele=>ele.classList=="menu style-scope ytmusic-player-bar")[0].children[2].dispatchEvent(new Event("click"));
            setTimeout(function(){
                var playlistButtonElements = document.querySelectorAll('[d="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"].style-scope.yt-icon');
                const elementsWithParentNode = Array.from(playlistButtonElements).filter(element =>
                                                                                         element.parentElement &&
                                                                                         element.parentElement.parentElement &&
                                                                                         element.parentElement.parentElement.parentElement &&
                                                                                         element.parentElement.parentElement.parentElement.parentElement &&
                                                                                         element.parentElement.parentElement.parentElement.parentElement.matches('#navigation-endpoint')
                                                                                        );
                console.log("Count: "+ elementsWithParentNode.length);
                console.log(elementsWithParentNode[0].parentElement.parentElement.parentElement.parentElement);
                elementsWithParentNode[0].parentElement.parentElement.parentElement.parentElement.dispatchEvent(new Event("click"));
            }, 100);
        }
    }, false)
})();