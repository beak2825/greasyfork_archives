// ==UserScript==
// @name         Cartel Util Script - NG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to enchance CE experiance.
// @author       qez
// @match        https://cartelempire.online/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511538/Cartel%20Util%20Script%20-%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/511538/Cartel%20Util%20Script%20-%20NG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //set true to disable the training option
    const strength = false;
    const defense = true;
    const agility = true;
    const speed = false;

    function pageLoad(){
        console.log(window.location.pathname);
        if (window.location.pathname == '/Gym') {
            document.querySelector("form[action='/gym/train/strength/'] input.btn").disabled = strength;
            document.querySelector("form[action='/gym/train/defence/'] input.btn").disabled = defense;
            document.querySelector("form[action='/gym/train/agility/'] input.btn").disabled = agility;
            document.querySelector("form[action='/gym/train/accuracy/'] input.btn").disabled = speed;
        }
    }



    pageLoad();

    // Your code here...
})();