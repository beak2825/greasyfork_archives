// ==UserScript==
// @name         Auto Down Attack
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  none
// @author       Noobius Gb (From gobattle.io)
// @match        *://gobattle.io/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/546764/Auto%20Down%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/546764/Auto%20Down%20Attack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const aerial_down_attack_button = "z";
    const attack_frequency = 100;
 
    let textfield = null;
 
    let interval_id = null;
 
    function getTextField() {
        if (!textfield) {
            textfield = document.getElementById("shinobit-textfield");
        }
        return textfield;
    }
 
    document.addEventListener("keydown", event => {
 
        const currentTextField = getTextField();
 
        if (event.key === aerial_down_attack_button && !interval_id && currentTextField !== document.activeElement){
            aerial_down_attack();
 
            interval_id = setInterval(aerial_down_attack, attack_frequency);
        }
    });
 
    document.addEventListener("keyup", event => {
 
        const currentTextField = getTextField();
 
        if (event.key === aerial_down_attack_button && currentTextField !== document.activeElement){
 
            clearInterval(interval_id);
            interval_id = null;
        }
    });
 
    function aerial_down_attack(){
 
        const eventOptions = {
            "key": "ArrowUp",
            "keyCode": 38,
            "which": 38,
            "code": "ArrowUp",
            "location": 0,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        };
 
        document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
 
        temporarily_crouched();
        temporarily_crouched();
 
        sword_attack();
 
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
 
    function jump(){
        const eventOptions = {
            "key": "ArrowUp",
            "keyCode": 38,
            "which": 38,
            "code": "ArrowUp",
            "location": 0,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        };
        document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
 
    function temporarily_crouched(){
 
        const eventOptions = {
            "key": "ArrowDown",
            "keyCode": 40,
            "which": 40,
            "code": "ArrowDown",
            "location": 0,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        };
        document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
 
    function sword_attack(){
        const eventOptions = {
            "key": "v",
            "keyCode": 86,
            "which": 86,
            "code": "KeyV",
            "location": 0,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        };
        document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
})();