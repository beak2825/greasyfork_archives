// ==UserScript==
// @name         Likes Resurrector
// @namespace    http://www.facebook.com/Tophness
// @version      0.1
// @description  try to take over the world!
// @author       Tophness
// @match        http://www.facebook.com/*
// @match        https://www.facebook.com/*
// @exclude      https://www.facebook.com/permalink.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390845/Likes%20Resurrector.user.js
// @updateURL https://update.greasyfork.org/scripts/390845/Likes%20Resurrector.meta.js
// ==/UserScript==

function processPost() {
    let posts = document.getElementsByClassName('userContentWrapper');
    for (let i = posts.length - 1; i >= 0; i--) {
        if(typeof(posts[i].childNodes[1]) == 'undefined'){
            continue;
        }
        try{
            let likeText = posts[i].childNodes[1].childNodes[0].childNodes[4].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1];
            if(likeText.innerText.indexOf('and others') != -1){
                likeText.childNodes[1].childNodes[0].innerHTML = likeText.childNodes[1].childNodes[0].innerHTML.replace("and others","") + "and " + likeText.childNodes[0].childNodes[0].innerHTML + " others";
            }
        }
        catch(e){
        }
    }
}
window.addEventListener("DOMNodeInserted", function() { processPost(); }, false);