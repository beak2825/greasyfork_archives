// ==UserScript==
// @name         Auto select all right answer
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @run-at document-start
// @match    https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/478899/Auto%20select%20all%20right%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/478899/Auto%20select%20all%20right%20answer.meta.js
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    //RANDOME BOXES END
    function htmlToNode(htmlString) {
        // Crea un oggetto Range
        var range = document.createRange();

        // Crea un nodo DocumentFragment utilizzando createContextualFragment
        var fragment = range.createContextualFragment(htmlString);

        // Restituisci il primo nodo del DocumentFragment
        return fragment.firstChild;
    }
    var htmlString = "<button id='selectAllrights' class='scriptBtn'>FILL RIGHT ANSWER</button>";
    var nodoDOM = htmlToNode(htmlString);
    if(document.querySelector('.button-container')) {


        // Esempio di utilizzo
        buttonContainer = document.querySelector('.button-container');

        buttonContainer.appendChild(nodoDOM)
        // Aggiunta del pulsante al div
    } else {

        // Creazione di un nuovo elemento div
        var buttonContainer = document.createElement("div");

        // Assegnazione della classe "colore" al nuovo div
        buttonContainer.classList.add("button-container");
        // Aggiunta del div al body (puoi aggiungerlo dove preferisci)
        var navbarPegaso = document.querySelector('.navbar-pegaso');
        //navbarPegaso.append(buttonContainer);
        navbarPegaso.parentNode.insertBefore(buttonContainer, navbarPegaso.nextSibling);

        buttonContainer.appendChild(nodoDOM)

    }
$('.btn-submit').on('click', function() {
        $(document).ready(function() {
        // Conta gli elementi tr con la classe "success"
        var countSuccess = $("tr.success").length;

        // Scrivi il totale in un paragrafo
        alert("Risposte esatte: " + countSuccess + " /10");
    });
})

    $('#selectAllrights').on('click',function (){
        async function runFirst(){
            var rightAns = [];
            var scriptTags = document.getElementsByTagName('script');

            for (var i = 0; i < scriptTags.length; i++) {
                var script = scriptTags[i];
                var scriptText = script.innerHTML;

                if (scriptText.includes("this.rightAns")) {
                    var rightAnsString = scriptText.match(/this.rightAns\[(.*?)\]="(.*?)";/g);

                    for (var j = 0; j < rightAnsString.length; j++) {
                        var match = rightAnsString[j].match(/this.rightAns\[(.*?)\]="(.*?)";/);
                        var index = parseInt(match[1]);
                        var value = match[2];
                        rightAns[index] = value;
                    }
                }
            }

            for (var i = 1; i <= rightAns.length; i++) {
                var valueToSelect = rightAns[i];
                var selector = '.a-' + i + '[value="' + valueToSelect + '"]';
                var radioButton = document.querySelector(selector);

                if (radioButton) {
                    radioButton.checked = true;
                }
            }

            await submitTest();
        }
        runFirst();
    });
})();
const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

injectCSS(`
     .btn-success,  .btn-warning {
    position: fixed;
    top: 100px;
    width: 100px;
    border-radius: 50%;
    height: 100px;
    right: 0;
    bottom: 0;
    z-index: 1;
     }
     .button-container {
    z-index: 1;
    right: 0;
    position: fixed;
    top: 35%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    }

  `);
