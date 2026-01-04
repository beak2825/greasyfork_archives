// ==UserScript==
// @name         Hardwax Random Button
// @namespace    http://miseryconfusion.com/
// @version      2025-01-02
// @description  Adds a button that lets you choose a random Hardwax record
// @author       @miseryconfusion
// @match        https://hardwax.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hardwax.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/522681/Hardwax%20Random%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522681/Hardwax%20Random%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function install() {
        const downloadNode = document.querySelector('a[href="/downloads/"]');

        const createLink = () => {
            const link = document.createElement('a');
            link.href = '#';
            link.classList.add('sm');
            link.addEventListener('click', function(e) {
                const number = Math.ceil(Math.random() * 100000);
                window.location = `https://hardwax.com/${number}`;
                e.preventDefault();
                return false;
            });

            const span = document.createElement('span');
            span.classList.add('so');
            span.textContent = '🔄 Random';
            link.appendChild(span)

            return link;
        }

        if (downloadNode) {
            const downloadListItem = downloadNode.parentNode;
            const newListItem = document.createElement('li');
            newListItem.classList.add('sj');
            newListItem.classList.add('sk');

            const link = createLink();

            newListItem.appendChild(link);
            downloadListItem.after(newListItem);
        } else {
            const node404 = document.querySelector('h2.fo');
            if (node404 && node404.textContent === '404 - Not Found') {
                node404.after(createLink());
            }
        }
    }

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        install();
    } else {
        install();
    }

})();