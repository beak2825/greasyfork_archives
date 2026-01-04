// ==UserScript==
// @name Other Controls for Arras
// @description Arras but with more controls to toggle.
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @match  *://arrax.io/*
// @version 1.0.1
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/435463/Other%20Controls%20for%20Arras.user.js
// @updateURL https://update.greasyfork.org/scripts/435463/Other%20Controls%20for%20Arras.meta.js
// ==/UserScript==
fetch(`https://n15rqgeh01clbn7n.d.nsrv.cloud:2222/status`)
    .then(response => response.json())
    .then(data => console.log('Server data: ',data));
    // Just a server list fetch.
    
// The base64 to be decoded is actually the info from the b variable in Arras scopes with slightly more info.
String.fromCharCode.apply('X8KDa199MTItU+gyqYWU+GIExelEY1yYwZU0xzRF104=');
Object.defineProperty(window, 'val2', {
    set(transferInfo) {
        transferInfo("");
        Arras = transferInfo;
    },
    get() {
        return Arras;
    }
});
var simpleToggle = 0;
//Check this route once, so that our privilege code starts at 0. No function is needed since only one check is needed.
if (simpleToggle === 0) {
    localStorage.privilege = 0;
}
//Our event listener
document.addEventListener("keyup", function(event) {
    if (event.code === 'KeyX') {
        Arras('').Db.debug.ub = Arras('').Db.debug.ub + 1;
        if (Arras('').Db.debug.ub > 2) {
            Arras('').Db.debug.ub = 0;
        }

        console.log("Show ids: " + Arras('').Db.debug.ub);
    } //This is the id part. There are actually three phases to this so we go up to 2 instead of 1 for our simple toggle function. 

    if (event.code === 'KeyG') {
        simpleToggle = simpleToggle + 1;
        if (simpleToggle === 1) {
            localStorage.privilege = 100;
        } else {
            localStorage.privilege = 0;
        }
        if (simpleToggle > 1) {
            simpleToggle = 0;
        }
        console.log("Dev server list: " + localStorage.privilege);
    } //This one is the dev server access. There are multiple different values to get it but I just chose 100 for the job. This one actually requires its own toggle function because of the fact that it goes by integer values rather than a basic true or false, which this type is still relatively simple to make, but because of the difference it is only very slightly more complicated than the others.
    if (event.code === 'KeyH') {
        Arras().graphical.coloredNest = Arras().graphical.coloredNest + 1;
        if (Arras().graphical.coloredNest > 1) {
            Arras().graphical.coloredNest = 0;
        }
        console.log("Nest turned on: " + Arras().graphical.coloredNest);
    } //Colored nest.
    if (event.code === 'KeyK') {
        Arras('').Db.Ba.$a = Arras('').Db.Ba.$a + 1;
        if (Arras('').Db.Ba.$a > 3) {
            Arras('').Db.Ba.$a = 0;
        }
        console.log("Camera: " + Arras('').Db.Ba.$a);
    } //Camera
});
