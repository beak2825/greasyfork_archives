// ==UserScript==
// @name         Kahoot anti login to save results
// @namespace    http://tampermonkey.net/
// @version      0.1.
// @description  Get rid of it now!
// @run-at       document-start
// @author       You
// @match        *://play.kahoot.it/v2*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424893/Kahoot%20anti%20login%20to%20save%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/424893/Kahoot%20anti%20login%20to%20save%20results.meta.js
// ==/UserScript==
window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    console.log("[ANTI-LTSR] running")
    setInterval(function(){
        if(document.getElementsByClassName('dialog-actions__LinkItem-sc-8lq4ua-0')[0]){
            document.getElementsByClassName('dialog-actions__LinkItem-sc-8lq4ua-0')[0].click();
        }
    },500)
})

