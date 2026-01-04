// ==UserScript==
// @name         AtCoder TLE Police
// @namespace    https://fuwa.dev
// @version      0.2
// @description  TLE提出は逮捕('TLE' を 'AR'(ArRested)に置き換えます)
// @author       ibuki2003
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381104/AtCoder%20TLE%20Police.user.js
// @updateURL https://update.greasyfork.org/scripts/381104/AtCoder%20TLE%20Police.meta.js
// ==/UserScript==

function replaceTLE2AR(){
    const tips=document.getElementsByClassName('label');
    for(let e of tips){
        if(e.innerText.match(/TLE/)){
            e.innerText = e.innerText.replace(/TLE/g, 'AR');
            e.setAttribute('data-original-title','逮捕');
            e.classList.remove('label-warning');
            e.classList.add('label-danger');
        }
    }
}
(function() {
    'use strict';

    const target = document.getElementsByTagName('tbody')[0];
    const observer = new MutationObserver(function (mutations) {
        for(let i in mutations){
            replaceTLE2AR();
        }
    });

    replaceTLE2AR();

    observer.observe(target, {
        //attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    });
})();
