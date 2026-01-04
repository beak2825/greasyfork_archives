// ==UserScript==
// @name         GeneralJuanInjector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept API request and modify response to include CombatGeneral unit type named General Juan
// @author       shaman@poczta.onet.pl
// @match        https://www.settlerscombatsimulator.com/*
// @grant        none
// @run-at       document-start
// @connect      www.settlerscombatsimulator.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499066/GeneralJuanInjector.user.js
// @updateURL https://update.greasyfork.org/scripts/499066/GeneralJuanInjector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const READY_STATE_UNSEND = 0;
    const READY_STATE_OPENED = 1;
    const READY_STATE_HEADERS_RECEIVED = 2;
    const READY_STATE_LOADING = 3;
    const READY_STATE_DONE = 4;

    function createGeneralJuan() {
        return {
            "id": "GeneralJuan",
            "name": "General Juan",
            "shortName": "",
            "description": "General Juan added by TamperMonkey script",
            "priority": 935,
            "hitPoints": 500,
            "hitDamage": 800,
            "missDamage": 700,
            "accuracy": 0.8,
            "experience": 0,
            "icon": "borisgeneral_resource_friendly.png",
            "value": 0,
            "isWeak": false,
            "isElite": false,
            "isGeneral": true,
            "isPlayer": true,
            "timeBonus": 200,
            "maxUnits": 180,
            "sortIndex": 1,
            "strike": 1,
            "combatantType": "CombatGeneral",
            "isBoss": false,
            "combatModifier": [
                {
                    "item": "RecoverLostTroops",
                    "channel": "specialist",
                    "name": "Player",
                    "chance": 1,
                    "multiplier": 0.2,
                    "adder": 0,
                    "type": ""
                },
                {
                    "item": "CombatXP",
                    "channel": "specialist",
                    "name": "Player",
                    "chance": 1,
                    "multiplier": 2,
                    "adder": 0,
                    "type": "CombatGeneral"
                }
            ],
            "skillSplashDamage": true,
            "skillAttackWeakestFirst": true,
            "skillIgnoreAC": false,
            "skillName": "Trait_CombatGeneral",
            "modifierCombatXPMultiplier": 1.2
        };
    };

    const originalXMLHttpRequest = window.XMLHttpRequest;

    function modifyResponse(originalResponse) {
        try {
            let resp = JSON.parse(originalResponse);
            resp.data[0].units.push(createGeneralJuan());
            return JSON.stringify(resp);
        } catch (error) {
            console.error("Error modifying response:", error);
            return originalResponse;
        }
    }

    window.XMLHttpRequest = function() {
        const xhr = new originalXMLHttpRequest();
        const send = xhr.send;
        xhr.send = function() {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === READY_STATE_DONE && this.responseURL.includes("/api/init")) {
                    const originalResponse = this.responseText;
                    Object.defineProperty(this, 'responseText', {
                        get: () => modifyResponse(originalResponse)
                    });
                    Object.defineProperty(this, 'response', {
                        get: () => modifyResponse(originalResponse)
                    });
                }
            }, false);
            return send.apply(this, arguments);
        };
        return xhr;
    };
})();