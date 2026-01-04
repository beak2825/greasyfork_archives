// ==UserScript==
// @name         Quizlet Gravity
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get the answer to gravity copied to your clipboard
// @author       pigPen6969
// @match        *quizlet.com/*/gravity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433159/Quizlet%20Gravity.user.js
// @updateURL https://update.greasyfork.org/scripts/433159/Quizlet%20Gravity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        try{
            let d = document.querySelector("span.TermText")
            if (d != null){
                let t = d.textContent;
                Quizlet.gravityModeData.terms.forEach(function(term){
                    let ret = "";
                    if (term.word == t){
                        ret=term.definition;}
                    if (term.definition == t){
                        ret=term.word;}
                    if (ret != ""){
                        navigator.clipboard.writeText(ret);}

                })

            }
        }catch(e){}
    }, 100);
})();