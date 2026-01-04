// ==UserScript==
// @name         Kahoot Antisettings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide some kahoot settings for streams, to make it look less crowded and bloated.
// @author       codingMASTER398
// @run-at       document-start
// @match        *://play.kahoot.it/v2*
// @icon         https://www.google.com/s2/favicons?domain=kahoot.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424891/Kahoot%20Antisettings.user.js
// @updateURL https://update.greasyfork.org/scripts/424891/Kahoot%20Antisettings.meta.js
// ==/UserScript==

window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    window.toInsert = document.createElement("div");
    window.toInsert.innerHTML = "Antisettings enabled"; //PLEASE DONT CHANGE, THIS IS MY ONLY FORM OF CREDIT ):
    window.toInsert.style.color = 'white'
    window.toInsert.style.position = "absolute";
    window.toInsert.style.top = "0px";
    window.toInsert.style.textAlign = "center";
    window.toInsert.style.width = "100%";
    document.body.appendChild(window.toInsert);

    console.log("[HIDE KAHOOT SETTINGS] running")
    var toremove = ["eIeXcV","kouOMd","cuthTl"/* Pre-intermission settings */,"kyCxrl","juDgty","dFwDYV","dJJRyE"/* Intermission settings + Kahoot logo */,"bqJUnj","korJUI","hmxNjP"/* Settings on question */]
    setInterval(function(){
        for (i = 0; i < toremove.length; i++) {
            if(document.getElementsByClassName(toremove[i])[0]){
                document.getElementsByClassName(toremove[i])[0].innerHTML = ""
            }
        }
    },500)

})