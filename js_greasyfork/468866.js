// ==UserScript==
// @name         Glomdalen
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automaticky přesměruje na správnou live url bez potřeby překliku a přidává tlačítka pro generování live URL k zápasům.
// @author       Martin Kaprál
// @match        https://www.glomdalen.no/fotball/live/match/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glomdalen.no
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468866/Glomdalen.user.js
// @updateURL https://update.greasyfork.org/scripts/468866/Glomdalen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = `
        .button-link {
            display: inline-block;
            padding: 6px 12px;
            background-color: #D5D5D5;
            color: #343434;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            margin-top: 4px;
        }`;

    document.head.appendChild(style);

    function generateLiveUrl() {
        let existingLinks = document.querySelectorAll('.Module__Body .button-link');
        if (existingLinks) {
            existingLinks.forEach(link => link.remove());
        }

        let matchList = document.querySelectorAll('.Module__Body * [data-matchid]');

        matchList.forEach(function(element) {
            let id = element.getAttribute('data-matchid');
            let comp = element.parentElement.parentElement.getAttribute('id');
            let link = document.createElement('a');
            link.href = 'https://www.glomdalen.no/fotball/live/match/1/' + comp + '/' + id + '/';
            link.textContent = 'Match Detail';
            link.classList.add('button-link');
            element.appendChild(link);
        })
    }

    setInterval(function() {
        let a = document.evaluate(`//*[(text()="Direktelenke")]/../td[2]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
        if (a == window.location.href) {} else {
            window.location.replace(a);
        }
    }, 1000);

    setTimeout(() => {
        const header = document.querySelector('.Navigation__Header > .Logo');
        const generate = document.createElement("button");
        header.append(generate);
        generate.append("VYGENERUJ LIVE URL K ZÁPASŮM");
        generate.onclick = function(){generateLiveUrl()};
        generate.classList.add('button-link');
        generate.style.fontSize = '20px';
    } , 1000);
})();