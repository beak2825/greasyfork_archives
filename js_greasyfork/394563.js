// ==UserScript==
// @name         Hola
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Khuongdv
// @match        http://localhost:8080/*
// @match        https://cdn-s3-dev-euwt1-cd015.zero-events.com/*
// @match        https://cdn-s3-stg-euwt1-cd015.zero-events.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394563/Hola.user.js
// @updateURL https://update.greasyfork.org/scripts/394563/Hola.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var button = document.createElement('BUTTON');
    var text = document.createTextNode("Generate Data");
    button.style.position = 'fixed'
    button.style.top = '100px'
    button.style.right = '100px'
    button.id = 'button'
    //document.body.append(button)
    button.appendChild(text);

    button.addEventListener("click", generate);
    generate()
    function generate (){
        var app = document.getElementById('q-app');
        var register = app.__vue__.$store.state.patients.register
        register.first_name = 'James'
        register.middle_name = 'N'
        register.family_name = 'Baker'
        register.phone = '0123456789'
        register.email = 'james_n_baker@gmail.com'
        register.birth_day = "10/11/1947"
        register.ethinicty = 1
        register.nhs_id = "233164822"
        register.basic_dia = 85
        register.basic_sys = 135
        var timeline = app.__vue__.$store.state.timeline;
        console.log(timeline);
        timeline["3-step-plan"]["height"] = 331;
        timeline["3-step-plan"]["isCurrent"] = true;
        // baseline
        timeline["baseline-bp"].height = 55;
        timeline["baseline-bp"].isCurrent = true;
        timeline["baseline-bp"].isComplete = true;
        // basic
        timeline["basic"].height = 20;
        timeline["basic"].isCurrent = true;
        timeline["basic"].isComplete = true;
        // current medicate
        timeline["current-medicate"].height = 95;
        timeline["current-medicate"].isCurrent = true;
        timeline["current-medicate"].isComplete = true;
        // current Time line
        timeline["currentTimeline"] = "3-step-plan"
        // medicate history
        timeline["medical-history"].height = 130;
        timeline["medical-history"].isCurrent = true;
        timeline["medical-history"].isComplete = true;
        // patient_profile
        timeline["patient_profile"].height = 0;
        timeline["patient_profile"].isCurrent = true;
        timeline["patient_profile"].isComplete = true;
        // patient_register
        timeline["patient_register"].isComplete = true;
        // percent
        timeline.percentComplete = 0;
        // policy
        timeline["policy"].height = 175;
        timeline["policy"].isCurrent = true;
        timeline["policy"].isComplete = true;
        // target blood pressure
        timeline["target-blood-pressure"].height = 275;
        timeline["target-blood-pressure"].isCurrent = true;
        timeline["target-blood-pressure"].isComplete = true;
        // treatment plan
        timeline["treatment_plan"].height = 180;
        timeline["treatment_plan"].isComplete = false;
        timeline["treatment_plan"].isCurrent = true;
    }
})();