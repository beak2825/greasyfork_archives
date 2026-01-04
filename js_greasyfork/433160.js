// ==UserScript==
// @name         Quizlet Learn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight the correct answer
// @author       pigPen6969
// @match        *quizlet.com/*/learn
// @icon         https://www.google.com/s2/favicons?domain=quizlet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433160/Quizlet%20Learn.user.js
// @updateURL https://update.greasyfork.org/scripts/433160/Quizlet%20Learn.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var trms = []
    let i=0
    for (let o of Quizlet.assistantModeData.studiableData.studiableMediaConnections){
        if (i%2 == 0){
            trms.push([o.text.plainText])
        }else{
            trms[trms.length-1].push(o.text.plainText)
        }
        i++
    }
    setInterval(function(){
        try{
            let d = document.querySelector("div.FormattedText.notranslate")
            if (d != null){
                let t = d.getAttribute("aria-label");
                let ret = "";
                for (let tmr of trms){
                if (tmr[0]==t){
                 ret = tmr[1];}
                if (tmr[1] == t){
                ret = tmr[0];}
                for (let tmr of document.querySelectorAll(".wbkjose")){
                    if (tmr.children[1].textContent == ret){
                    tmr.style.backgroundColor = "blue"
                    }
                }
                }

            }
        }catch(e){}
    }, 100);
})();