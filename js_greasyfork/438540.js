// ==UserScript==
// @name         online-filmek.me++
// @namespace    onlinefilmekme
// @version      0.1
// @description  rosszlányok reklám eltüntetése
// @author       Skyfighteer
// @include      https://mozinet.me/*
// @include      https://filmvilag.me/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438540/online-filmekme%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/438540/online-filmekme%2B%2B.meta.js
// ==/UserScript==

document.querySelector('[style$="margin-left: 5px;"]').remove(); // rossz lanyok mindket oldalrol remove
// -- mozinet -- //
if (window.location.href.indexOf('https://mozinet.me/') == 0) {

// mraza2dosa
try
{
document.querySelector('iframe')
console.log('removed iframe');
}
catch {
console.log('couldnt remove iframe');
}

function waitForMraza(onload, callback){
    let check = setInterval(function(){
        if (document.querySelector('a[href^="https://mraza2dosa.com"]')) {
            clearInterval(check);
            callback();
        }
    }, 2000);
}

waitForMraza('', function(){
document.querySelector('a[href^="https://mraza2dosa.com"]').parentElement.remove();
console.log('success');
})

// scripts
function waitForPrebid(onload, callback){
    let check = setInterval(function(){
        if (document.querySelector('[id="prebid"')) { // last one
            clearInterval(check);
            callback();
        }
    }, 100);
}

waitForPrebid('', function(){

let scripts = document.querySelectorAll('script'), scriptsLength = scripts.length;
for (let i = 0; i < scriptsLength; i++) {
    scripts[i].remove();
    console.log('a script removed');
    }

})

// masodik header
document.querySelectorAll('thead')[1].remove();

// elcsuszott elso ket sor
document.querySelectorAll('[id="linkek"]')[1].insertBefore(document.querySelectorAll('tbody')[0], document.querySelectorAll('tbody')[1]);

}
