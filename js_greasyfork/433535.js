// ==UserScript==
// @name         WikiHow Free Expert Answers
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Paying for wikiHow "expert answers"? No way!
// @author       ae2Q
// @match        https://www.wikihow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433535/WikiHow%20Free%20Expert%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/433535/WikiHow%20Free%20Expert%20Answers.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Variables that describe the classes that must be modified to make the code prettier and shorter.
    var sac = "qa_answer answer qa_obscured_answer qa_obscured_answer_purchase",
        oc = "qa_obscured_prompt";

    var o=document.getElementsByClassName(oc).length, // The "pls support us to unlock these expert answers" overlays.
        sa=document.getElementsByClassName(sac).length, // The amount of obscured answers.
        x=sa+o; // This is a fail-safe variable.

    if(o>0){for(;x>1;){
            x=document.getElementsByClassName(sac).length+document.getElementsByClassName(oc).length;

            for(var j=0;j<document.getElementsByClassName(sac).length;j++){ // Unblur the answers.
                document.getElementsByClassName(sac)[j].className="qa_answer answer"
            }

            for(var i=0;i<document.getElementsByClassName(oc).length;i++){ // Remove the overlays.
                document.getElementsByClassName(oc)[i].parentNode.removeChild(document.getElementsByClassName(oc)[i])
            }
        }
        // Remove the text that lets you know you can 'unlock premium answers'.
        document.getElementsByClassName("qa_obscured_cta")[0].parentNode.removeChild(document.getElementsByClassName("qa_obscured_cta")[0])

        // Let the user know that their answers have been unobscured.
        document.getElementById("qa").innerHTML=
            "<p><b>Removed "+o+" overlays and unblurred "+sa+" answers.</b></p>"+document.getElementById("qa").innerHTML;
        console.log("Removed "+o+" overlays and unblurred "+sa+" answers")
    }
})();