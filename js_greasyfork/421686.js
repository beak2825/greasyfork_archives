// ==UserScript==
// @name         Kahoot scoreboard skip
// @version      1.1.2.1
// @description  Skip the kahoot scoreboard
// @author       codingMASTER398
// @match        https://play.kahoot.it/v2*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/682906
// @downloadURL https://update.greasyfork.org/scripts/421686/Kahoot%20scoreboard%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/421686/Kahoot%20scoreboard%20skip.meta.js
// ==/UserScript==
window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    console.log("[SCOREBOARD SKIP] running")
    setTimeout(() => {
        if(window.toInsert){
            window.toInsert.innerHTML = window.toInsert.innerHTML + ", scoreboard skip";
        }else{
            window.toInsert = document.createElement("div");
            window.toInsert.innerHTML = "scoreboard skip";
            window.toInsert.style.color = 'white'
            window.toInsert.style.position = "absolute";
            window.toInsert.style.bottom = "0px";
            window.toInsert.style.textAlign = "left";
            window.toInsert.style.width = "100%";
            window.toInsert.style.color = "black"
            document.body.appendChild(window.toInsert);
        }
    }, 800);
    
    setInterval(function() {
        if(document.getElementsByClassName('kFPtaw animated-scoreboard__Button-sc-16j1vhw-9')[0]){
            document.getElementsByClassName('kFPtaw animated-scoreboard__Button-sc-16j1vhw-9')[0].click();
        }
    },1)
})