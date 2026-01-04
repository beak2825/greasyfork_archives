// ==UserScript==
// @name         OGame NCM Notifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes sound notification once the new chat message came!
// @author       Alexander Bulgakov
// @match        *.ogame.gameforge.com/game/index.php?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450676/OGame%20NCM%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/450676/OGame%20NCM%20Notifier.meta.js
// ==/UserScript==

const nSound = document.createElement('audio')
nSound.src = 'https://zvukipro.com/uploads/files/2018-12/1543852602_plyus_org-z_uk-u_edomleniya-4.mp3'
nSound.volume = 0.5

setInterval(() => {
    let digitIndicator = document.querySelector('span.new_msg_count.totalChatMessages')
    if (localStorage.getItem('msgCount') == null) localStorage.setItem('msgCount', '0')
    else if (localStorage.getItem('msgCount') != digitIndicator.textContent.replace(/\s/g, '')) {
        localStorage.setItem('msgCount', digitIndicator.textContent.replace(/\s/g, ''))
        if (localStorage.getItem('msgCount') != '0') nSound.play()
    }
}, 500)