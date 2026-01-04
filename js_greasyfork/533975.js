// ==UserScript==
// @name         dibs chat spam
// @namespace    http://tampermonkey.net/
// @version      2025-04-25
// @description  Write to clipboard upcoming out of hosp from yata
// @author       LePluB
// @match        https://yata.yt/faction/war/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yata.yt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533975/dibs%20chat%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/533975/dibs%20chat%20spam.meta.js
// ==/UserScript==

function go() {
    document.querySelector("table.faction-targets").addEventListener("click", function (e) {

        console.log("clicky");
        const id = e.target.attributes['data-val'].value;
        const tr = document.querySelector("table.faction-targets").querySelector(`tr[data-val='${id}']`);
        const name = tr.childNodes[1].innerText.replace(/ \[\d+\]/, "");
        const stats = tr.childNodes[13].innerText;
        const link = tr.childNodes[1].childNodes[0].href;
        const time = tr.childNodes[23].innerText.replace(/.*(\d+:\d+)/,"$1");
        var text = `${name} - ${link} - ${stats} ${time} s`;
        navigator.clipboard.writeText(text);
    });
}

(function() {
    'use strict';

    const watcherInterval = setInterval(function() {

        if (document.querySelector("table.faction-targets") != null) {

            clearInterval(watcherInterval);
            go();
        }
        console.log("waiting");
    }, 500);

    // Your code here...
})();