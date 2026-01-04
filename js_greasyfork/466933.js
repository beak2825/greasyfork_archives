// ==UserScript==
// @name         Meteorite CSS remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Whole site is filled with furry smut on user profiles
// @author       MojaveMF
// @match        https://mete0r.xyz/users/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466933/Meteorite%20CSS%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/466933/Meteorite%20CSS%20remover.meta.js
// ==/UserScript==

function clean(){
    let stylers = document.getElementsByTagName("style")
    for (let i = 0;i<stylers.length;i++){
        let style = stylers[i]
        if (style.getAttribute("ref") == undefined && style.getAttribute("href") == undefined){
            console.log("Cleaned");
            style.remove()
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