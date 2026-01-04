// ==UserScript==
// @name         Hide kahoot quiz name
// @version      1.2.0.3
// @description  Hide the kahoot quiz name
// @author       codingMASTER398
// @match        https://play.kahoot.it/v2*
// @namespace https://greasyfork.org/users/682906
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421687/Hide%20kahoot%20quiz%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/421687/Hide%20kahoot%20quiz%20name.meta.js
// ==/UserScript==

window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    setTimeout(() => {
        if(window.toInsert){
            window.toInsert.innerHTML = window.toInsert.innerHTML + ", hide kahoot name";
            window.toInsert.style.color = "black"
        }else{
            window.toInsert = document.createElement("div");
            window.toInsert.innerHTML = "hide kahoot name";
            window.toInsert.style.color = 'white'
            window.toInsert.style.position = "absolute";
            window.toInsert.style.bottom = "0px";
            window.toInsert.style.textAlign = "left";
            window.toInsert.style.width = "100%";
            window.toInsert.style.color = "black"
            document.body.appendChild(window.toInsert);
        }
    }, 600);
    console.log("[HIDE KAHOOT NAME] running")
    setInterval(function(){
        for (let i = 0; i < document.getElementsByClassName("quiz-info__Name-sc-1mlvsrh-1").length; i++) {
            txt = document.getElementsByClassName("quiz-info__Name-sc-1mlvsrh-1")[i].textContent
            if(txt == "" || txt == "Your kahoot is now loading…"){}else{
                quizname = txt
                console.log("[HIDE KAHOOT NAME] found original quiz name - "+quizname)
            }
            if(txt == "Your kahoot is now loading…"){}else{
                document.getElementsByClassName("quiz-info__Name-sc-1mlvsrh-1")[i].textContent = ""
            }
        }
        if(document.getElementsByClassName('jPGick')[0]){
            document.getElementsByClassName('jPGick')[0].innerHTML = ""
        }
        if(document.getElementsByClassName('block-title__Wrapper-z5fhf1-1')[0]){
            if(!document.getElementsByTagName("tspan")[0]){
                document.getElementsByClassName('block-title__Wrapper-z5fhf1-1')[0].innerHTML = ""
            }
        }
        if(quizname){
            var h1s = document.getElementsByTagName("h1");
            for (var i = 0; i < h1s.length; i++) {
                var h1 = h1s[i];
                if(h1.innerText==quizname){
                    h1.innerText=""
                }
            }
        }
    },100)
});