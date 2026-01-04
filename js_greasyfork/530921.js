// ==UserScript==
// @name         Qasalan Expellibox Beautifier
// @namespace    Nyu@Clraik
// @version      1.0.0
// @description  Makes the expellibox page prettier
// @author       Nyu
// @match        https://ncmall.neopets.com/games/giveaway/process_giveaway.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530921/Qasalan%20Expellibox%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/530921/Qasalan%20Expellibox%20Beautifier.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const body = document.querySelector('body')
    body.style.backgroundImage = 'url(https://images.neopets.com/themes/h5/constellations/images/pattern-footer.png)'
    const content = body.innerText
    const msg = content.match(/msg=(.*)/)[1].replace(/\+/g, ' ')
    const div = document.createElement('div')
    div.style.background = 'url(https://images.neopets.com/games/pages/icons/screenshots/905/1.jpg)'
    div.style.backgroundSize = '100% 100%'
    div.style.backgroundRepeat = 'no-repeat'
    div.style.color = 'white'
    div.style.position = 'fixed'
    div.style.top = '0'
    div.style.bottom = '0'
    div.style.left = '50%'
    div.style.transform = 'translateX(-50%)'
    div.style.padding = '20px'
    div.style.textAlign = 'center'

    const textDiv = document.createElement('div')
    textDiv.style.color = 'white'
    textDiv.style.marginTop = '50%'
    textDiv.style.marginInline = 'auto'
    textDiv.style.maxWidth = '40%'
    textDiv.style.fontSize = '1.5em'
    textDiv.innerHTML = decodeURIComponent(msg)
    body.innerText = ''
    div.appendChild(textDiv);
    document.body.appendChild(div);
})();