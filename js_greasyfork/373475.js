// ==UserScript==
// @name         Reddit Spoiler Hightlight
// @namespace    https://github.com/Elypha/Reddit-Spoiler-Hightlight
// @version      0.3
// @description  Hightlight the spoiler marked title with a much ugly color so you won't miss it.
// @author       u/Elypha
// @date         21/10/2018
// @modified     15/4/2019
// @supportURL   https://github.com/Elypha/Reddit-Spoiler-Hightlight/issues
// @match        https://www.reddit.com/*
// @grant        none
// @license      GUN 3.0
// @downloadURL https://update.greasyfork.org/scripts/373475/Reddit%20Spoiler%20Hightlight.user.js
// @updateURL https://update.greasyfork.org/scripts/373475/Reddit%20Spoiler%20Hightlight.meta.js
// ==/UserScript==

spoiler_mark()
var height_read = document.documentElement.scrollHeight;
window.addEventListener('scroll', async () => {
    clearTimeout()
    setTimeout(1000)
    var height_read_new = document.documentElement.scrollHeight;
    if(height_read_new - height_read > 0){
        spoiler_mark();
        height_read = height_read_new;
    }
})

function spoiler_mark(){
    var spoiler = document.querySelectorAll("span");
    console.log(spoiler)
    var length = spoiler.length;
    var i;
    for(i=0;i<length;i++){
        if(spoiler[i].innerHTML=="spoiler"){
        var spoiler_parents = spoiler[i].parentNode.parentNode.parentNode;

        //Background Color of the spoiler marked titles:
        spoiler_parents.style.backgroundColor="#fd63635c";

        //Text Color of the spoiler mark:
        spoiler[i].style.color="#0062ff";

        //Border Color of the spoiler mark:
        spoiler[i].style.borderColor="#668c8f";
            }
    }
}