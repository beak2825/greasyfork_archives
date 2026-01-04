// ==UserScript==
// @name         combat notification sound
// @namespace    FileFace
// @version      0.2.1
// @description  lol5
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407766/combat%20notification%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/407766/combat%20notification%20sound.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */


(function() {
    'use strict';
    //const notifArea = document.getElementById('notification-area')
    const combatNotif = document.getElementById('notification-heroReadyNotification')
    const audio = new Audio('./sounds/success.wav')
    audio.volume = 0.1
    var audioPlayed = false
    var justLoggedIn
    function linkuStarto(){
        if (window.var_username){
            justLoggedIn = window.var_heroCooldown == 0 ? true : false
            audioPlayed = justLoggedIn === true ? true : false
            notifObserver()
        }else{
            setTimeout(linkuStarto, 1000)
        }
    }
    linkuStarto()
    function notifObserver(){
        const observer = new MutationObserver(mutation => {
            if (window.var_teleportCooldown < 890){
                if (combatNotif.style.display === '' && audioPlayed === false && justLoggedIn === false){
                    audio.play()
                }
                audioPlayed = !audioPlayed
                justLoggedIn = false
            }
        })
        const config = { attributes: true, childList: true, characterData: true }
        observer.observe(combatNotif, config)
    }
})();