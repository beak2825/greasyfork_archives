// ==UserScript==
// @name         Ogame Expeditions Return Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Plays notify sound when expedition returns
// @author       Alexander Bulgakov
// @match        *.ogame.gameforge.com/game/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453488/Ogame%20Expeditions%20Return%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/453488/Ogame%20Expeditions%20Return%20Notifier.meta.js
// ==/UserScript==

let events = document.querySelectorAll('.eventFleet[data-return-flight="true"][data-mission-type="15"]')

let flyArr = []

function playSound() {
    let audio = document.createElement('audio')
    audio.src = 'https://zvukitop.com/wp-content/uploads/2021/03/poluchil-uvedomlenie.mp3?_=27'
    audio.play()
    delete audio
}

if (events.lenght != 0) {
    for (let i of events) {
        flyArr.push({id: i.id.replace(/\D/g, ''), backTime: +i.dataset.arrivalTime})
    }
} else flyArr = []

function checkReturn() {
    for (let i in flyArr) {
        if (new Date(flyArr[i].backTime * 1000).toLocaleString() == new Date(Date.now()).toLocaleString()) {
            playSound()
            flyArr.splice(i, 1)
        }
    }
}

setInterval(checkReturn, 1000)