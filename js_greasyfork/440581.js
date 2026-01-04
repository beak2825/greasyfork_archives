// ==UserScript==
// @name         Rainy Mood Modifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  -
// @author       You
// @match        https://rainymood.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rainymood.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440581/Rainy%20Mood%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/440581/Rainy%20Mood%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const f1 = async function () {
        const nodes = document.getElementsByClassName("center-block")[0].children;
        for(let i=0; i<5; i++){
            nodes[3].remove();
        }
        document.querySelector("body > div:nth-child(2)").remove();
        document.getElementById("rngVolume").style.transform = "scale(2, 2)";
        let btn = document.getElementById("pButton");
        btn.style.width = "300px";
        btn.style.height = "300px";
    }

    const execWorkflow = async () => {
        await f1();
    }

    window.addEventListener('load', async function () { await execWorkflow() });
})();