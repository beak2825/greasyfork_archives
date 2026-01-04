// ==UserScript==
// @name         Ephere performance value fix
// @namespace    https://greasyfork.org/en/users/13275
// @version      1.1
// @description  Corrige como se visualizan los valores de performance del jugador
// @author       AFX Prodigy
// @match        *://play.ephere.football/ephereal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=http://play.ephere.football
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453316/Ephere%20performance%20value%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/453316/Ephere%20performance%20value%20fix.meta.js
// ==/UserScript==

waitForElm('.css-1rzb73m').then((elm) => {
    console.log('Datos encontrados.');
    setTimeout(() => { NumFix(); }, 2000);
});


function NumFix(){
    var rws = document.querySelectorAll('[aria-colindex="16"]')
    var rwsN = rws.length

    if (rwsN == 0){
        rws = document.querySelectorAll('[aria-colindex="10"]')
        rwsN = rws.length
    }
    for (let i = 0; i < rwsN; i++) {
        const Nfix = parseFloat(rws[i].getElementsByClassName('css-1rzb73m')[0].innerText).toPrecision(2)
        rws[i].getElementsByClassName('css-1rzb73m')[0].innerText = Nfix
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}