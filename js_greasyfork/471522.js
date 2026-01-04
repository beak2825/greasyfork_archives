// ==UserScript==
// @name Hoecats Lost Merchants Sound Alert
// @version 0.3
// @author Hoecat
// @description Plays More Sounds on Merchant Spawn
// @license MIT
// @namespace https://greasyfork.org/en/scripts/471522-hoecats-lost-merchants-sound-alert/
// @homepage  https://greasyfork.org/en/users/689086-tdurdenxxx
// @match     https://lostmerchants.com
// @match     https://lostmerchants.com/*
// @icon      https://www.google.com/s2/favicons?sz=64&domain=lostmerchants.com
// @require   https://code.jquery.com/jquery-3.6.1.js
// @require   https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @resource  SongA https://raw.githubusercontent.com/Rootkit-/sounds/main/Sounds/Alert3.ogg
// @resource  SongB https://raw.githubusercontent.com/Rootkit-/sounds/main/Sounds/light.ogg
// @run-at    document-end
// @grant     unsafeWindow
// @grant     GM_addElement
// @grant     GM_addStyle
// @grant     GM_log
// @grant     GM_notification
// @grant     GM_xmlhttpRequest
// @grant     GM_getResourceText
// @grant     GM_getResourceURL
// @grant     window.onurlchange
// @grant     window.close
// @grant     window.focus
// @downloadURL https://update.greasyfork.org/scripts/471522/Hoecats%20Lost%20Merchants%20Sound%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/471522/Hoecats%20Lost%20Merchants%20Sound%20Alert.meta.js
// ==/UserScript==
waitForKeyElements ("*:not(li) > .item.rarity--Legendary:contains('Vairgrys')", RepeatLongBeep);
waitForKeyElements ("*:not(li) > .item.rarity--Legendary:contains('Balthorr')", RepeatLongBeep);
waitForKeyElements ("*:not(li) > .item.rarity--Legendary:contains('Delain Armen')", ShortBeep);
waitForKeyElements ("*:not(li) > .item.rarity--Legendary:contains('Wei')", ShortBeep);
$(document).ready(function() {
    const a = document.createElement("audio");
    a.className = 'SongA'
    a.innerHTML = '<source src="' + GM_getResourceURL('SongA') +'" type="audio/ogg">'
    document.body.appendChild(a);
    
    const b = document.createElement("audio");
    b.className = 'SongB'
    b.innerHTML = '<source src="' + GM_getResourceURL('SongB') +'" type="audio/ogg">'
    document.body.appendChild(b);
})

function RepeatLongBeep(jNode) {
    document.querySelector("body > audio.SongA").play()
 
    setTimeout(function() {
        document.querySelector("body > audio.SongA").play()
    }, 30*1000) //30seconds
 
    setTimeout(function() {
        document.querySelector("body > audio.SongA").play()
    }, 300000) //5min
}
 

function ShortBeep(jNode) {
    document.querySelector("body > audio.SongB").play()
 
    setTimeout(function() {
        document.querySelector("body > audio.SongB").play()
    }, 30*1000) //30seconds
 
    setTimeout(function() {
        document.querySelector("body > audio.SongB").play()
    }, 300000) //5min
}