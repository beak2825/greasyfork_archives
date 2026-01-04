// ==UserScript==
// @name         Idle notify moooo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sound when idle
// @author       You
// @match        *://*.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449319/Idle%20notify%20moooo.user.js
// @updateURL https://update.greasyfork.org/scripts/449319/Idle%20notify%20moooo.meta.js
// ==/UserScript==

let beat = new Audio("https://freesound.org/data/previews/416/416529_5121236-lq.mp3")
beat.volume = 0.05
let resetPlay = true
function soundplay(){
    if( document.title.includes("Idle") ){
        if( resetPlay ){
            beat.play();
            resetPlay = false
        }
    } else {
        beat.load()
        resetPlay = true
    }
}
let soundInterval = setInterval(soundplay, 10*1000)