// ==UserScript==
// @name         Quizlet Live Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Do Quizlet Live For You
// @author       Mikerific
// @match        https://quizlet.com/live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39473/Quizlet%20Live%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/39473/Quizlet%20Live%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = prompt("What is the URL of the study set?");
    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'ifrm');
    ifrm.style.visibility = "hidden";
    document.body.appendChild(ifrm);
    ifrm.setAttribute('src', url);
    setTimeout(function(){
        var ifrmdoc = ifrm.contentDocument || ifrm.contentWindow.document;

        var definitions = [];
        var terms = [];

        var trms = ifrmdoc.getElementsByClassName("SetPageTerm-wordText");
        var defs = ifrmdoc.getElementsByClassName("SetPageTerm-definitionText");
        for(var i = 0; i < defs.length; i++) {
            definitions.push(defs[i].textContent.trim());
        }
        for(var i = 0; i < trms.length; i++) {
            terms.push(trms[i].textContent.trim());
        }
        if(definitions.length > 0 && terms.length == definitions.length) {
            alert("Quizlet Live Hack - Deck Succesfully Loaded!\n\nTerms:\n"+terms+"\n\nDefinitions:\n"+definitions);
        }
        setTimeout(onLive,100);
        function onLive() {
            if(definitions.length > 0 && terms.length == definitions.length) {
                alert("Quizlet Live Hack - Using Deck:\n\nTerms:\n"+terms+"\n\nDefinitions:\n"+definitions);
                setInterval(liveLoop,100);
            }
        }

        function liveLoop() {
            var i;
            var c;
            var question = document.getElementsByClassName("StudentPrompt-inner")[0].textContent.trim();
            var answer;
            var cards = [];
            var correctCardIndex;
            var correctCardElement;
            for(i = 0; i < definitions.length; i++) {
                if(question == definitions[i]) {
                    answer = terms[i];
                    break;
                }
                if(question == terms[i]) {
                    answer = definitions[i];
                    break;
                }
            }
            for(c = 0; c < document.getElementsByClassName("StudentTerm is-clickable can-beClicked").length; c++) {
                cards[c] = document.getElementsByClassName("StudentTerm is-clickable can-beClicked")[c].textContent.trim();
            }
            correctCardIndex = cards.indexOf(answer);
            correctCardElement = document.getElementsByClassName("StudentTerm is-clickable can-beClicked")[correctCardIndex];
            eventFire(correctCardElement,'click');
        }
        function eventFire(el, etype) {
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        }
    }, 2000);
})();