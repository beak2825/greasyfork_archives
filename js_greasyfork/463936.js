// ==UserScript==
// @name autopress v1
// @namespace http://tampermonkey.net/
// @version 0.3
// @description press key ] или ъ
// @author You
// @match https://evades.io/
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463936/autopress%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/463936/autopress%20v1.meta.js
// ==/UserScript==
var keyZ = {
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    preventDefault: () => null,
    keyCode: 90,
}
var keyX = {
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    preventDefault: () => null,
    keyCode: 88,
}

var timeout = null;
var zStarting = false;

async function pressZ() {
    await new Promise(resolve => {
        setTimeout(() => {
            console.log('keyDown')
            window.keyDown(keyZ);
            resolve();
        }, 0)
    })
    await new Promise(resolve => {
        setTimeout(() => {
            window.keyUp(keyZ);
            console.log('keyUp')
            resolve();
        }, 10)
    })
}
function pressX() {
    window.keyDown(keyX);

    setTimeout(() => {
    window.keyUp(keyX);
    }, 500)
}

async function Echelon() {
    zStarting = true;
    await pressX();
    zStarting = false;
}

async function Brute() {
    zStarting = true;
    await pressZ();
    await pressZ();
    zStarting = false;
}

document.addEventListener('keydown',(a)=>{
    switch(a.keyCode){
        case 221:
            if(timeout === null){
                alert('start')
                switch(window._client.user.heroInfoCard.heroName) {
                        case 'Echelon':
                         timeout = setInterval(() => {
                             if(!zStarting){
                                 Echelon()
                             }
                         }, 500)
                        break;
                        case 'Brute':
                        case 'Jolt':
                        case 'Nexus':
                        default:
                         timeout = setInterval(() => {
                             if(!zStarting){
                                 Brute()
                             }
                         }, 100)
                        break;

                }
                //if( window._client.user.heroInfoCard.heroName === 'Brute') {
                ////    timeout = setInterval(() => {
                //        BruteFirstSkill();
                //    }, 100)
                //    return;
               // }


            } else {
                clearInterval(timeout);
                timeout = null;
                alert('stop')
            }

            break;
    }
});