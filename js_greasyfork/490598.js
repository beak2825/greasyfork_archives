// ==UserScript==
// @name         Script AD Bypasser For for ShellShockers.io, Krunker.io, ev.io, and digdig.io for Zertalious Scripts
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description  Automated bypasser quickly completes verifications for ShellShockers.io, Krunker.io, ev.io, and digdig.io, streamlining access.
// @author       DOGEWARE
// @match        *://www.zertalious.xyz/*
// @match        *://digworm.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490598/Script%20AD%20Bypasser%20For%20for%20ShellShockersio%2C%20Krunkerio%2C%20evio%2C%20and%20digdigio%20for%20Zertalious%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/490598/Script%20AD%20Bypasser%20For%20for%20ShellShockersio%2C%20Krunkerio%2C%20evio%2C%20and%20digdigio%20for%20Zertalious%20Scripts.meta.js
// ==/UserScript==


if(location.host === 'digworm.io'){
    try{
        setInterval(function(){
            document.querySelectorAll('span')[0].click()
            document.querySelectorAll('img').forEach(e=>e.remove())


            document.getElementById('preroll').style.opacity = 0
        },1000)
    }catch{}
}else{

    setInterval(function(){
        try{
            try{
                document.querySelectorAll('.my-fieldset')[0].getElementsByTagName('button')[0].click()
            }catch{}
        }catch {}
    })
}