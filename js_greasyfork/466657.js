// ==UserScript==
// @name         ECS ad remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I saw furry smut on the homepage
// @author       MojaveMF
// @license MIT
// @match        https://rbx.samu3l.wtf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=samu3l.wtf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466657/ECS%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/466657/ECS%20ad%20remover.meta.js
// ==/UserScript==

function clean(){
    let divs = document.getElementsByTagName("div")
    for (let i = 0;i<divs.length;i++){
        let div = divs[i]
        if (div.className.startsWith("adWrapper-")){
            console.log("Cleaned");
            div.remove()
        }
    }
}

function wait(ms){
    return new Promise((Resolve) => setTimeout(Resolve,ms))
}

(async function() {
    'use strict';

    setTimeout(async () => {
        while (true) {
            clean()
            await wait(100)
        }
    },0)
})();