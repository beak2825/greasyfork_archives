// ==UserScript==
// @name        Press F to favorite - Gelbooru
// @namespace   Violentmonkey Scripts
// @match       https://gelbooru.com/*
// @grant       none
// @version     1.1
// @author      -
// @description Press F
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450947/Press%20F%20to%20favorite%20-%20Gelbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/450947/Press%20F%20to%20favorite%20-%20Gelbooru.meta.js
// ==/UserScript==

/*
                                                         /$$              
                                                        | $$              
                         /$$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$            
                        | $$__  $$ /$$__  $$ /$$__  $$|_  $$_/            
                        | $$  \ $$| $$  \ $$| $$  \ $$  | $$              
                        | $$  | $$| $$  | $$| $$  | $$  | $$ /$$          
           /$$       /$$| $$  | $$|  $$$$$$/|  $$$$$$/  |  $$$$/          
          | $$      |__/|__/  |__/ \______/  \______/    \___/            
  /$$$$$$$| $$$$$$$  /$$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
 /$$_____/| $$__  $$| $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$_____/
|  $$$$$$ | $$  \ $$| $$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$ 
 \____  $$| $$  | $$| $$| $$  | $$| $$  | $$| $$_____/| $$       \____  $$
 /$$$$$$$/| $$  | $$| $$|  $$$$$$$|  $$$$$$$|  $$$$$$$| $$       /$$$$$$$/
|_______/ |__/  |__/|__/ \____  $$ \____  $$ \_______/|__/      |_______/ 
                         /$$  \ $$ /$$  \ $$                              
                        |  $$$$$$/|  $$$$$$/                              
                         \______/  \______/                               
*/

var isKeyPressed = {
    f: false, // ASCII code for 'a'
    // ... Other keys to check for custom key combinations
};

document.body.addEventListener(
    "mousemove",
    ({ target }) => {
        if (target.parentNode.nodeName !== "A") return;
        window.lastHoveredLink = target.parentNode.href;
    },
    false
);

function getid(u) {
    const urlParams = new URLSearchParams(u);
    const postid = urlParams.get("id");
    return postid;
}

document.onkeydown = (keyDownEvent) => {
    isKeyPressed[keyDownEvent.key] = true;
    if (isKeyPressed["f"]) {
        const queryString = window.location.search;
        let postid = getid(queryString);
        if (postid == null) {
            postid = getid(window.lastHoveredLink);
        }
        addFav(postid);
    }
};
