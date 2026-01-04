// ==UserScript==
// @name         AsthmaDiary Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       khuongdv
// @match        http://demo.hospitalrun.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403712/AsthmaDiary%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/403712/AsthmaDiary%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createButton(patientId) {
        var ref = 'https://www-dev-jp.respiratory-omron.com/doctor/index.html#/patient/' + patientId;
        var tagA = document.createElement('a');
        tagA.href = ref;
        tagA.id = "my-id";
        tagA.target = "_blank";
        tagA.classList = "btn btn-sm btn-primary";
        tagA.text = "Go to AsthmaDiary Dashboard";
        return tagA;
    }


    function appendButton(){
        var patientId = getPatientId();
        var element = document.querySelector(".patient-name");
        var btnTemplate = createButton(patientId);
        if(element){
          var a = document.querySelector("#my-id");
          if(!a){
            element.appendChild(btnTemplate);
            btnTemplate.addEventListener("click", function(){
                window.open(
                  btnTemplate.href,
                  "_blank"
                )
            });
          }
        }
    }

    function getPatientId(){
        var xpath = "/html/body/div[1]/div/div[2]/div/div/div[1]/form/div[2]/div[2]/div[1]/div/div/div[2]/div[2]/div/input"
        var elements = document.evaluate(xpath, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        var userElement = elements.snapshotItem(0);
        var patient = userElement;
        if(patient){
          return patient.value
        }
        return null;
    }


    setInterval(function(){
        appendButton();
    }, 1000);

})();