// ==UserScript==
// @name            WME Version Checker
// @description     Checks for new WME versions and alerts if updated
// @namespace       vaindil
// @version         1.0.2
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/18669/WME%20Version%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/18669/WME%20Version%20Checker.meta.js
// ==/UserScript==

function check(mthd) {
    if (window.jQuery)
        readygo();
    else
        setTimeout(function() { defer(mthd); }, 50);
}

function readygo() {
    prevver = localStorage.getItem('previousWMEversion');
    if (prevver === null)
        prevver = '(first script run)';

    $.getJSON('https://www.waze.com/Descartes-live/app/info/version', function(e) {
        curver = e.version;
        console.log('prev WME version: ' + prevver);
        console.log('cur WME version: ' + curver);

        if (prevver !== curver) {
            console.log('new WME version: ' + curver);
            alert('New WME version!\nPrevious: ' + prevver + '\nNew: ' + curver);
            localStorage.setItem('previousWMEversion', curver);
        } else {
            console.log('same WME version');
        }
    });
}

check();