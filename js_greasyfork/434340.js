// ==UserScript==
// @name         beep
// @namespace    https://greasyfork.org/en/users/827932-letsgo0
// @version      0.2
// @description  beeps when a tag's attributes changes.
// @author       Mr Chen
// @match        http://*.chinaeast2.cloudapp.chinacloudapi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434340/beep.user.js
// @updateURL https://update.greasyfork.org/scripts/434340/beep.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const div = document.createElement('div');
    div.style.cssText = 'visibility: hidden;';
    div.innerHTML = `<audio id="beep" src="https://cdn.jsdelivr.net/gh/letsgo0/shareF@main/voi.mp3">not supported!</audio>`;
    document.body.appendChild(div);

    const target = document.querySelector("#captchaWhole");
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes'){
                const target = mutation.target;
                if (target.style.cssText === ""){
                    // beep
                    // console.log('beep');
                    const beep = document.querySelector('#beep');
                    beep.play();
                }
            }
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: false, characterData: false }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    // later, you can stop observing
    // observer.disconnect();
})();