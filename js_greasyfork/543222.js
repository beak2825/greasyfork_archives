// ==UserScript==
// @name         Legacy > New
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enter old cai even if it was "closed" "Zedd - Find you"
// @match        https://old.character.ai/*
// @match        https://beta.character.ai/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plus.character.ai
// @namespace https://greasyfork.org/users/1077492
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/543222/Legacy%20%3E%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/543222/Legacy%20%3E%20New.meta.js
// ==/UserScript==

(function() {
    var tmer = null;

    async function fetchAndModify(url) {
        try {
            const response = await fetch(url);
            var scriptText = await response.text();

            var killswitch = "window.location.href=e.toString()";
            scriptText = scriptText.replaceAll(killswitch, "");
            const blob = new Blob([scriptText], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            const newScript = document.createElement('script');
            newScript.src = blobUrl;
            newScript.addEventListener("load", onLoad);
            document.head.appendChild(newScript);
        } catch (error) {
            alert('Error while modifying the page. Retry again or already patched');
        }
    }

    function onLoad() {

        var times = 0;
        var deleted = false;
        var tmer = setInterval(function() {
            var modals = document.querySelectorAll(".modal, .modal-backdrop");

            if (deleted) {
                clearInterval(tmer);
            }

            modals.forEach((modal) => {
                deleted = true;
                modal.parentNode.removeChild(modal);
            });
        }, 2000);
    }

    async function getWholePage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('response not ok');
            }

            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const headElements = doc.head.children;
            const headElementsArray = Array.from(headElements);
            headElementsArray.forEach(element => {
                if (element.tagName === 'SCRIPT' && element.src.indexOf("js/main") != -1) {
                    fetchAndModify(element.src);
                    return;
                }
                document.head.appendChild(element);
            });

            return headElementsArray;
        } catch (error) {
            alert('Error loading the page. Retry again or already patched');
        }
    }

    function start() {
        document.head.innerHTML = ""; //Stop everything.
        getWholePage('https://plus.character.ai/chat/4');
    }
    start();
})(); 
