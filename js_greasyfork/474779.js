   // ==UserScript==
   // @name         Request help | Religious Extremists 2023 Elimination
   // @namespace    http://tampermonkey.net/
   // @version      0.13
   // @description  Request for help during a fight 
   // @author       Belkas
   // @match        https://www.torn.com/loader.php?sid=attack*
   // @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
   // @grant        GM_addStyle
   // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474779/Request%20help%20%7C%20Religious%20Extremists%202023%20Elimination.user.js
// @updateURL https://update.greasyfork.org/scripts/474779/Request%20help%20%7C%20Religious%20Extremists%202023%20Elimination.meta.js
   // ==/UserScript==

   (function() {
    'use strict';
    let informationField;

    GM_addStyle('.help-input-container{ display: flex; justify-content: space-between;} .attack-help-input { flex: 0 0 33%; } .btn {margin-top:16px; width:100%; text-align:center;} .alert {  position: relative;  padding: .75rem 1.25rem;  margin-bottom: 1rem;  border: 1px solid transparent;  border-radius: .25rem;}.alert-danger {  color: #721c24;  background-color: var(--default-bg-panel-color);  border-color: #f5c6cb;}.alert-success {  color: #20a63e;  background-color: var(--default-bg-panel-color);  border-color: #c3e6cb;}');

       function insertAfter(newNode, existingNode) {
       existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    function showAlert(text, alertType){
        informationField.style.display = "block";
        informationField.innerText= text;
        informationField.classList.add(alertType)

        setTimeout(function() {
            informationField.style.display = "none";
            informationField.classList.remove(alertType)
        }, 5_000);
    }
    function sendData(body){
       fetch("https://tornium.com/api/religious/assist", {
               method: "POST",
               body: JSON.stringify(body),
               headers: {
                   "Content-type": "application/json; charset=UTF-8"
               }
           })
                .then(response => {
                    informationField.style.display = "block";
                    if(!response.ok){
                        showAlert(response.statusText, 'alert-danger');
                        return;
                    }

                    showAlert("Help request sent", 'alert-success');
                })
                .catch(error => {
                    showAlert(error, 'alert-danger');

                })
    }

    function createInputs(inputNameList) {
       var divWrap = document.createElement("div");
        divWrap.classList.add('help-input-container');
       inputNameList.forEach((name) => {
           divWrap.appendChild(createInputField(name));
       });

       return divWrap;
    }

    var createInputField = function(placeholder){
        var divWrap = document.createElement("div");
        divWrap.classList.add('input-wrap');
        divWrap.classList.add('profile-buttons');
        divWrap.classList.add('attack-help-input');

        var input = document.createElement("input");

        input.setAttribute("type", "text");

        input.classList.add('input-text');
        input.setAttribute("placeholder", placeholder);
        input.setAttribute("id", placeholder);
        divWrap.appendChild(input)

        return divWrap;
    }

    var createButton = function(message){
        var divWrap = document.createElement("div");
        divWrap.classList.add('btn');

        var button = document.createElement("INPUT");
        button.setAttribute("type", "submit");
        button.setAttribute("value", message);
        button.classList.add('form-submit-send');
        button.classList.add('torn-btn');

        divWrap.appendChild(button)

        return divWrap;
    }

    var getTargetId = function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('user2ID');
    }

    var createContainer = function() {
        const smokeGas = "Smoke gas";
        const tearGas = "Tear gas";
        const heavyHitters = "Heavy hitters";
        const inputNames = [smokeGas, tearGas, heavyHitters]

        var div = document.createElement("div")
        div.classList.add('profile-container');
        div.style.marginBottom = '10px';
        div.style.padding="4px";

        informationField = document.createElement("p");
        informationField.classList.add("alert");
        informationField.style.display = "none";

        div.appendChild(informationField);
        div.appendChild(createInputs(inputNames));

        var buttondiv = createButton("Send request");
        buttondiv.onclick = function sendRequest() {

            let smokes = document.getElementById(smokeGas).value;
            let tears = document.getElementById(tearGas).value;
            let heavies = document.getElementById(heavyHitters).value;
            const body = {
                   user_tid: document.querySelector(".settings-menu .link a").href.split("=").slice(-1)[0],
                   target_tid: getTargetId(),
            };

            if(smokes) body.smokes = smokes;
            if(tears) body.tears = tears;
            if(heavies) body.heavies = heavies;

            let button = buttondiv.childNodes[0];
            button.disabled = true;
            setTimeout(function() {
                button.disabled = false;
            }, 20_000);

            sendData(body)
        };

        div.appendChild(buttondiv);
        return div;
    }

    var getProfileDescription = function() {
        var container = document.querySelectorAll('[class^="appHeaderWrapper_"]')[0];
        var divContainer = createContainer();
        insertAfter(divContainer, container);
    }

    getProfileDescription();
})();
