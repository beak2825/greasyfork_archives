// ==UserScript==
// @name         Urnik Addon
// @namespace    https://feri.um.si/
// @version      0.2
// @description  automates program and course selection for FERI urnik
// @author       pajac
// @match        https://feri.um.si/urniki5/courses.php
// @downloadURL https://update.greasyfork.org/scripts/33719/Urnik%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/33719/Urnik%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('.data') === null){
        //izberemo program
        var program = 'RAČUNALNIŠTVO IN INFORMACIJSKE TEHNOLOGIJE (BM20) - 2. stopnja';
        var programElement = document.getElementById('program');
        for (var i = 0; i < programElement.options.length; i++) {
            if (programElement.options[i].text === program) {
                programElement.selectedIndex = i;
                break;
            }
        }
        programElement.onchange();
        waitForChildrenToDisplay("#courses", 1);
    }
}
)();

function waitForChildrenToDisplay(selector, time) {
    if(document.querySelector(selector).length !== 0) {
        //izberemo predmete
        var predmeti = ['EVOLUCIJSKO RAČUNANJE', 'NAPREDNA OBDELAVA SLIK', 'RAČUNALNIŠKI VID'];
        var predmetiElement = document.getElementById('courses');
        for (var ii = 0, l = predmetiElement.options.length, o; ii < l; ii++) {
            o = predmetiElement.options[ii];
            if (predmeti.indexOf(o.text) != -1) {
                o.selected = true;
            }
        }
        document.querySelector('.inputButton').click();
        return;
    } else {
        setTimeout(function() {
            waitForChildrenToDisplay(selector, time);
        }, time);
    }
}