// ==UserScript==
// @name         Modify Stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  modify stats position
// @author       You
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406007/Modify%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/406007/Modify%20Stats.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Stats"
    btn.style = "position: absolute;right: -26px;height: 25px;width: 50px; bottom: 100px;"
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,300&display=swap');
    document.head.appendChild(link);
    let chat = document.querySelector('.chatArea')
    try { chat.appendChild(btn) }
    catch (err) { throw err }
    btn.addEventListener('click', () => {
        let PPSstyles = "position: absolute;left: -3.3em;font-size: 2em; top: -11em;"
        let APMstyles = "position: absolute;left: -3.3em;font-size: 2em;top: -13em;"
        let Winstyles = "position: relative;left: -12em;font-size: 25px;top: -1.3em;background-color: black;"

        let Stats = Array.from(document.querySelectorAll('.statLine'))
        let Wins = Array.from(document.querySelectorAll('.wins'))
        try {
            // PPS SETTINGS FOR 1ST AND 2ND PLAYER
            Stats[0].children[1].style = PPSstyles
            Stats[2].children[1].style = PPSstyles
            // APM SETTINGS FOR 1ST AND 2ND PLAYER
            Stats[1].children[1].style = APMstyles
            Stats[3].children[1].style = APMstyles
            // HIDE PPS AND APM TEXT
            Stats[0].children[0].style = 'visibility: hidden;'
            Stats[1].children[0].style = 'visibility: hidden;'
            Stats[2].children[0].style = 'visibility: hidden;'
            Stats[3].children[0].style = 'visibility: hidden;'
            // WINS SETTINGS
            Wins[0].style = Winstyles
            Wins[1].style = Winstyles
        }
        catch (e) {
            throw (e)
        }
    })
})();
