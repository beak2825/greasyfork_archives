// ==UserScript==
// @name         keepOlgaAlive
// @version      1.2
// @description  Hey the new DLC came out
// @match        https://intranet.douane/olga/*
// @run-at       document-body
// @namespace https://greasyfork.org/users/1396159
// @downloadURL https://update.greasyfork.org/scripts/517313/keepOlgaAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/517313/keepOlgaAlive.meta.js
// ==/UserScript==

(function() {
    'use strict'; //strict mode -> catch errors better + prevent script from affecting other parts of the website
    let count = 0;

    function keepOlgaAlive() {
        count ++;
        fetch("https://intranet.douane/olga/aladin/pages/rest/assistance/affiche/init", { //lgtm
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                //copied directly, what's it for? no clue. do I need it? does it look like I know? does it need more? it just works, lgtm
            },
        })
        .then(response => response.json())
        .then(data => console.log("MISSION PASSED RESPECT + (" + count*20 + " minutes)"/*, data*/))
        .catch(error => console.error("MISSION FAILED", error));
    }

    setInterval(keepOlgaAlive, 1200 * 1000); //1200 seconds -> 20 minutes (timeout is 30 minutes)
})(); //immediately call function -> pretty cool cuz everything is self-contained this way