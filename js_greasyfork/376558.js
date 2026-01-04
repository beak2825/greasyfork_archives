// ==UserScript==
// @name         Bomball Aim Helper
// @description  Draws a Line and a Blob
// @author       Ko
// @version      1.1
// @match        *://playbomball.com/*
// @namespace    Ko
// @downloadURL https://update.greasyfork.org/scripts/376558/Bomball%20Aim%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376558/Bomball%20Aim%20Helper.meta.js
// ==/UserScript==


document.body.style.cursor = 'none'


var line = document.createElement('div')
document.body.appendChild(line)
line.style.background = 'white'
line.style.height = '3px'
line.style.width = '2000px'
line.style.position = 'fixed'
line.style.pointerEvents = 'none'


var blob = document.createElement('div')
document.body.appendChild(blob)
blob.style.background = 'white'
blob.style.height = blob.style.width = '32px'
blob.style.borderRadius = '16px'
blob.style.position = 'fixed'
blob.style.pointerEvents = 'none'


document.addEventListener('mousemove', function(mm){

    var midx = window.innerWidth / 2,
        midy = window.innerHeight / 2,
        rotation = Math.atan2(mm.y - midy, mm.x - midx)

    line.style.left = midx + 'px'
    line.style.top = midy + 'px'

    line.style.transform = 'translateX(-50%)rotate('+rotation+'rad)translateX(50%)'

    blob.style.left = mm.x - 16 + 'px'
    blob.style.top = mm.y - 16 + 'px'
})