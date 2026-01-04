// ==UserScript==
// @name         Whatsapp contact search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @include      https://web.whatsapp.com/?*
// @author       Jop van Dijk
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/392101/Whatsapp%20contact%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/392101/Whatsapp%20contact%20search.meta.js
// ==/UserScript==

function waitasec(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function findContacts() {
    'use strict'
    await waitasec()
    var check = findHim()
    while (check == 0) {
        await waitasec(1000)
        check = findHim()
    }
    if (check == 1) {
        return
    }
    document.getElementById("pane-side").onscroll = function() {findHim()}
    while (check == 2){
        await waitasec(0)
        document.getElementById("pane-side").scrollBy(0,1440);
        check = findHim()
    }
}

function findHim() {
    var name = window.location.href.substr(26,1000).toLowerCase().replace(/\+/g," ")
    console.log(name)
    var found = 0
//     var aantal = document.querySelectorAll("._3H4MS").length
    for (var i=0;document.querySelectorAll("._3H4MS")[i];i=i){
        if (found==0) {found = 2;}
        if (document.querySelectorAll("._3H4MS")[i].innerHTML.toLowerCase().includes(name)) {
            document.querySelectorAll("._3H4MS")[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "block"
            document.querySelectorAll("._3H4MS")[i].parentNode.parentNode.parentNode.parentNode.parentNode.scrollIntoView()
//             await waitasec(300)
            document.querySelectorAll("._3H4MS")[i].parentNode.parentNode.parentNode.parentNode.parentNode.click()
            console.log('found him: ',i)
            found = 1
            i++
            continue
        }else{
            document.querySelectorAll("._3H4MS")[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none"
            i++
//             document.querySelectorAll("._3H4MS")[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove()
            continue
        }
    }
    return found
}

findContacts()