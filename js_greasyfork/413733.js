// ==UserScript==
// @name         Hospitalrecords volume slider
// @namespace    https://github.com/billygachi/hospitalrecords-volume-slider
// @version      1.0
// @description  inserts volume slider for the webplayer
// @author       billy#0182
// @match        https://www.hospitalrecords.com/shop/release/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/413733/Hospitalrecords%20volume%20slider.user.js
// @updateURL https://update.greasyfork.org/scripts/413733/Hospitalrecords%20volume%20slider.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function run() {
    var customVolume = 25 //default 25
    let destination = document.getElementsByClassName("p-controls")[0]
    let slider = document.createElement("input")
    slider.style.marginTop = "9px"
    slider.setAttribute("type", "range")
    slider.setAttribute("min", "0")
    slider.setAttribute("max", "100")
    slider.setAttribute("value", customVolume)

    let oldWidth = window.getComputedStyle(document.getElementsByClassName('player-container')[0]).getPropertyValue('width')
    let newWidth = parseInt(oldWidth, 10) + 180 + "px"
    GM_addStyle(`.player-container {
        width:`+ newWidth +` !important;
    }`)

    slider.oninput = function() {
        customVolume = this.value
        soundMngr.setVolume(this.value)
    } 

    destination.appendChild(slider)

    //detour
    let soundMngr = unsafeWindow.soundManager
    let original = soundMngr.createSound
    soundMngr.createSound = function (tbl) {
        tbl.volume = customVolume
        return original(tbl)
    }
}

(function() {
    'use strict'
    run()
})()