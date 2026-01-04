// ==UserScript==
// @name         Torn Elimination - Get Online Status
// @version      1.0
// @description  Show online status on elimination team pages
// @author       You
// @license      MIT
// @match        https://www.torn.com/competition.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/458220
// @downloadURL https://update.greasyfork.org/scripts/451211/Torn%20Elimination%20-%20Get%20Online%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/451211/Torn%20Elimination%20-%20Get%20Online%20Status.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector) && window.location.href.includes("p=team")) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector) && window.location.href.includes("p=team")) {
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

function showStatuses(ul) {
    console.log("inner");

    function inner() {
        for (const child of ul.children) {
            let id = child.querySelector('.name .t-hide a').href.split('XID=')[1];

            let icons = child.querySelector('li.icons #iconTray');

            let li = document.createElement('li');
            li.style.marginBottom = "0px";
            li.style.backgroundPosition = "-1494px";

            let container = document.createElement("div");
            container.classList.add("container");
            container.style.width = "45px";
            container.style.height = "25px";
            container.style.position = "relative";
            container.style.overflow = "hidden";

            let img = document.createElement("img");
            img.src = `https://www.torn.com/signature.php?id=17&user=${id}`;
            img.style.position = "absolute";
            img.style.top = 0;
            img.style.right = 0;


            container.appendChild(img);
            li.appendChild(container);
            icons.appendChild(li);
        }
    }
    setTimeout(inner, 0);
    ul.classList.toggle('flambod', true);
    waitForElm('ul.competition-list:not(.flambod)').then(elem => showStatuses(elem));
}

(function() {
    'use strict';
    console.log("Starting");
        waitForElm('ul.competition-list').then(elem => showStatuses(elem));
    console.log("Ending");
})();