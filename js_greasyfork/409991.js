// ==UserScript==
// @name         DH3 Brighter Kills
// @namespace    com.anwinity.dh3
// @version      1.0.1
// @description  Just makes the "xx kills" text in monster log actually legible.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409991/DH3%20Brighter%20Kills.user.js
// @updateURL https://update.greasyfork.org/scripts/409991/DH3%20Brighter%20Kills.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        const originalClicksItem = window.clicksItem;
        window.clicksItem = function(a) {
            originalClicksItem.apply(this, arguments);
            if(a=="combatLog") {
                let calls = 40;
                function waitUntilVisible() {
                    calls--;
                    let spans = $("#combat-combatLog-section table > tbody > tr:first-child > td:first-child span");
                    if(spans.length>0) {
                        spans.css("color", "silver");
                        setTimeout(()=>$("#combat-combatLog-section table > tbody > tr:first-child > td:first-child span").css("color", "silver"), 200);
                        setTimeout(()=>$("#combat-combatLog-section table > tbody > tr:first-child > td:first-child span").css("color", "silver"), 500);
                        setTimeout(()=>$("#combat-combatLog-section table > tbody > tr:first-child > td:first-child span").css("color", "silver"), 1000);
                    }
                    else {
                        if(calls>0) {
                            setTimeout(waitUntilVisible, 50);
                        }
                    }
                }
                waitUntilVisible();
            }
        }
    });
})();