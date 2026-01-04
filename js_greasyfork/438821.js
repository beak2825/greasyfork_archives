// ==UserScript==
// @name         Remove Elements
// @namespace    Alex
// @version      0.1
// @description  Removes unnecessary elements from mp3 download
// @author       You
// @match        https://ytmp3x.com/*
// @icon         https://www.google.com/s2/favicons?domain=ytmp3x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438821/Remove%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/438821/Remove%20Elements.meta.js
// ==/UserScript==

setInterval(function() {
    try{document.querySelector('div.thumbnail div.share').remove()} catch(err){}
    try{document.querySelector('div.thumbnail div.foot').remove()} catch(err){}
    try{document.querySelector('div.dmca-notice').remove()} catch(err){}
    try{document.querySelector('div.header').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-32').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-64').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-128').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-192').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-320').lastElementChild.innerText = document.querySelector('div.download li.btr-256').lastElementChild.innerText;} catch(err){}
    try{document.querySelector('div.download li.btr-256').remove()} catch(err){}
    try{document.querySelector('div.download li.btr-320').dataset.mp3 = 256} catch(err){}
    try{document.querySelector('div.download li.btr-320').style.width = "100%"} catch(err){}
    try{document.querySelector('div.download li.btr-320 div.body').style.padding = "10px"} catch(err){}
    try{document.querySelector('div.download div.mp3c-init').style.fontSize = "20px"} catch(err){}
    try{document.querySelector('div.download li.btr-320 div.rate').innerText = "Download"} catch(err){}
}, 100)