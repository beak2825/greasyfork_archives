// ==UserScript==
// @name         gsvi2 new sytle
// @namespace    Bee10301
// @version      1.0
// @description  gsvi2的重新佈局。
// @author       Bee10301
// @match        http://127.0.0.1:9880
// @match        http://localhost:9880
// @match        http://10.1.22.107:9880
// @homepage     https://home.gamer.com.tw/home.php?owner=bee10301
// @icon         https://home.gamer.com.tw/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/542817/gsvi2%20new%20sytle.user.js
// @updateURL https://update.greasyfork.org/scripts/542817/gsvi2%20new%20sytle.meta.js
// ==/UserScript==
// noinspection SpellCheckingInspection,JSUnresolvedReference,BadExpressionStatementJS

(async function () {
    ("use strict");
    observeDOM();
})();

function observeDOM() {
    const observer = new MutationObserver((mutations, observer) => {
        const bodyWarp = document.querySelector('.svelte-vt1mxs.gap');
        const settingArea = document.getElementById('component-76');
        const textArea = document.getElementById('component-5');
        const textInput = document.querySelector('.scroll-hide.svelte-1f354aw');

        if (bodyWarp && settingArea && textArea && textInput) {
            worker_home();
            observer.disconnect(); // 停止觀察
        }
    });

    observer.observe(document, { childList: true, subtree: true });
}

function worker_home() {
    const bodyWarp = document.querySelector('.svelte-vt1mxs.gap');
    bodyWarp.appendChild(document.getElementById('component-1'));

    const settingArea = document.getElementById('component-76');
    settingArea.appendChild(document.getElementById('component-55'));

    const textArea = document.getElementById('component-5');
    textArea.appendChild(document.getElementById('component-94'));
    document.getElementById('component-94').appendChild(document.getElementById('component-106'));


    const textInput = document.querySelector('.scroll-hide.svelte-1f354aw');
    textInput.style.height = '150px';
}