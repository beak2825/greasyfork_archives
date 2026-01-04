// ==UserScript==
// @name         Gmail Selector
// @namespace    https://github.com/uhalid/GmailSelector
// @version      3.0
// @description  Select your email with shortcuts without using your mouse
// @author       Uhalid
// @match       *://mail.google.com/*
// @grant        none
// @icon https://cdn0.iconfinder.com/data/icons/octicons/1024/mark-github-64.png
// @downloadURL https://update.greasyfork.org/scripts/414911/Gmail%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/414911/Gmail%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const datatooltipValues = {
        'it-IT': {
            "tr": "Seleziona",
            "back": "Posta in arrivo"
        },
        'en-EN': {
            "tr": "Select",
            "back": "Inbox"
        },
    }
    const backKeyCodes = {
        "it-IT": 220,
        "en-EN": 192
    }

    var map = {};
    var userLang = navigator.language || navigator.userLanguage;
    var TrdatatooltipValue = datatooltipValues[userLang].tr;
    var BackdatatooltipValue = datatooltipValues[userLang].back;
    var BackKeyCode = backKeyCodes[userLang];

    function openEMail(num) {
        num -= 1;
        var tdElement = document.querySelectorAll(`[data-tooltip="${TrdatatooltipValue}"]`);
        var trElement = tdElement[1].closest("tr");
        //In case google changes jscontroller value
        var valueAttribute = trElement.getAttribute("jscontroller");

        var emalils = document.querySelectorAll(`[jscontroller="${valueAttribute}"]`);
        emalils[num].click();
    }

    function back() {
        var goBack = document.querySelector(`[data-tooltip="${BackdatatooltipValue}"]`);

        goBack.click();
    }

    onkeydown = onkeyup = function (e) {
        e = e || event;
        map[e.keyCode] = e.type == 'keydown';

        if (map[18] && map[BackKeyCode]) { //  back to inbox ALT + key on the left of the 1
            back();
            map[BackKeyCode] = false;
        }
        if (map[18] && map[87]) { // ALT + W
            var evt = new KeyboardEvent('keydown', {'keyCode':38, 'which':38});
            document.dispatchEvent(evt);
        }
        if(map[18] && map[83]) { // ALT + S
            var evt2 = new KeyboardEvent('keydown', {'keyCode':40, 'which':40});
            document.dispatchEvent(evt2);
        }
        if(map[18] && map[65]) { // ALT + A
            document.getElementsByClassName("btb")[0].click();
        }
        if (map[18] && map[49]) { // ALT + 1
            map[49]= false;
            openEMail(1);
        }
        if (map[18] && map[50]) { // ALT + 2
            map[50] = false;
            openEMail(2);
        }
        if (map[18] && map[51]) { // ALT + 3
            map[51] = false;
            openEMail(3);
        }
        if (map[18] && map[52]) { // ALT + 4
            map[52] = false;
            openEMail(4);
        }
        if (map[18] && map[53]) { // ALT + 5
            map[53] = false;
            openEMail(5);
        }
        if (map[18] && map[54]) { // ALT + 6
            map[54] = false;
            openEMail(6);
        }
        if (map[18] && map[55]) { // ALT + 7
            map[55] = false;
            openEMail(7);
        }
        if (map[18] && map[56]) { // ALT + 8
            map[56] = false;
            openEMail(8);
        }
        if (map[18] && map[57]) {// ALT + 9
            map[57] = false;
            openEMail(9);
        }
        if (map[18] && map[48]) {// ALT + 10
            map[48] = false;
            openEMail(10);
        }
    }
})();