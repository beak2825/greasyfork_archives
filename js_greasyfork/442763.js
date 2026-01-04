// ==UserScript==
// @name         Reddit Place - VLC barre des taches
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Dessinons le logo de VLC (logiciel Français) dans la barre des taches !
// @author       TAspert
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://styles.redditmedia.com/t5_4eiiz1/styles/communityIcon_ojy24r8j90o81.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442763/Reddit%20Place%20-%20VLC%20barre%20des%20taches.user.js
// @updateURL https://update.greasyfork.org/scripts/442763/Reddit%20Place%20-%20VLC%20barre%20des%20taches.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://github.com/TAspert/rPlaceVLC/raw/main/overlay.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            document.addEventListener("keydown", function(event) {
                if(event.key == "F4"){
                    if (i.style.display === "none") {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
            });
            return i;
        })())
 
    }, false);
 
}