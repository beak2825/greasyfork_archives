// ==UserScript==
// @name         Concierge QR Code Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to LiveSwitch Concierge to generate a QR code
// @author       You
// @match        https://app.concierge.liveswitch.com/website
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473532/Concierge%20QR%20Code%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/473532/Concierge%20QR%20Code%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let id = 'qr-code-injected'
    function openQrPage(){
        let s = document.getElementsByTagName('textarea')[0].value
        let m = s.match(/{id: "(.+?)"/)
        let websiteCode = m[1]
        window.open('https://concierge-qr-5976489fd10a.herokuapp.com/qr/index.html?websiteCode=' + websiteCode)
    }

    function addButton(row){
        if(document.getElementById(id)){
            return
        }
        console.log('adding')
        let button = row.querySelector('button')

        let d = document.createElement('div')
        d.innerHTML = button.outerHTML
        let newButton = d.firstChild
        newButton.id = id
        button.parentElement.prepend(newButton)
        newButton.querySelector('.v-btn__content').innerText = 'QR Code'
        newButton.style.marginRight = '16px'
        newButton.onclick = function(){
            openQrPage()
        }
    }

    function watch(){
        let row = document.querySelectorAll('main > .v-container > .v-row:nth-of-type(2) > .v-col > .v-row > .v-col > .v-sheet > .v-container > .v-row')[2]
        if(!row){
            console.log('no row')
            setTimeout(watch, 100)
            return
        }
        addButton(row)
        setTimeout(watch, 1000)
    }

    watch()
})();