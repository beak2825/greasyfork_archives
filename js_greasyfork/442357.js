// ==UserScript==
// @name         RGB Idle Hacks
// @namespace    http://tampermonkey.net/
// @version      1
// @description  RGB Idle Infinite Money
// @author       JUJUJUJ
// @match        https://ikerstreamer.github.io/RGB-Idle/*
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @license                  MIT
// @compatible               chrome
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/442357/RGB%20Idle%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/442357/RGB%20Idle%20Hacks.meta.js
// ==/UserScript==
    setInterval(
    function () {
let n = 999999999999999999999999999999999999999999999999
let m = 999999999999999999999999999999999999999999999999
let j = n*m
let b = j*j
let pov = b*b
    setInterval(
    function () {  
    var getR = Math.floor(player.money.red)      
    var getG = Math.floor(player.money.green)  
    var getB = Math.floor(player.money.blue)
    var getS = Math.floor(player.spectrum.val)
    if (getR < 999999999999999999999999999999999999999999999) { 	
    player.money.red = pov;
    }
    if (getG < 999999999999999999999999999999999999999999999) { 	
    player.money.green = pov;
    }
    if (getB < 999999999999999999999999999999999999999999999) { 	
    player.money.blue = pov;
    }
    if (getS < 999999999999999999999999999999999999999999999) { 	
    player.spectrum.val = pov;
    }
                })
    }, 50);
    