// ==UserScript==
// @name         Unmute RedGifs
// @author       VoltronicAcid
// @namespace    https://greasyfork.org/en/users/839394-voltronicacid
// @description  Unmute content from redgifs.com
// @version      1.0.0
// @license      MIT
// @run-at       document-idle
// @match        https://www.redgifs.com/ifr/*
// @match        https://www.redgifs.com/watch/*
// @downloadURL https://update.greasyfork.org/scripts/435642/Unmute%20RedGifs.user.js
// @updateURL https://update.greasyfork.org/scripts/435642/Unmute%20RedGifs.meta.js
// ==/UserScript==

(() => {
    const unMuteGifs = localStorage.getItem('user_sound') === 'unmuted'
    
    const intrvlId = setInterval(() => {
        const buttonsContainer = document.querySelector('div.options-buttons')

        if (buttonsContainer) {
            if (unMuteGifs) {
                const unmuteBttn = buttonsContainer.querySelector('span.icon.icon-mute')
                unmuteBttn && unmuteBttn.click()
            }

            clearInterval(intrvlId)
        }
    }, 100)    
})();
