// ==UserScript==
// @name         Repo tree: inline images
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Show PNG, GIF, JPG and SVG images inline on the GitHub's file list
// @author       Marcin Warpechowski
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396357/Repo%20tree%3A%20inline%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/396357/Repo%20tree%3A%20inline%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pluginName = 'processed-by-warpech-inline-png-images';

    let scheduledTimeout;

    function findAndApplyChanges() {
        console.log('Running... Repo tree: inline PNG images');
        Array.from(document.querySelectorAll(`.repository-content .js-navigation-container a.js-navigation-open:not([${pluginName}])`)).forEach((elem) => {
            elem.setAttribute(pluginName, '');
            if (elem.href.endsWith(".svg") || elem.href.endsWith(".png") || elem.href.endsWith(".gif") || elem.href.endsWith(".jpg") || elem.href.endsWith(".jpeg")) {
                const img = document.createElement('img');
                let imgUrl = elem.href + '?raw=true';
                img.setAttribute("src", imgUrl);
                img.style.maxWidth = '100%';

                const imgLink = document.createElement('a');
                imgLink.href = imgUrl;
                imgLink.appendChild(img);
                imgLink.style.display = 'block';
                imgLink.style.padding = '20px';
                img.style.minHeight = '1px';

                const div = document.createElement('div');
                div.appendChild(imgLink);
                div.style.background = '#eee';

                const box = elem.closest('.Box-row');
                box.parentNode.insertBefore(div, box.nextSibling)
            }
        });
    }

    console.log('Postponing... Repo tree: inline PNG images');
    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);

    const targetNode = document.querySelector("div.application-main");
    const observerOptions = {
        childList: true,
        subtree: true
    }

    const mutationCallback = (mutationList, observer) => {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    console.log('Postponing... Repo tree: inline PNG images');
                    clearTimeout(scheduledTimeout);
                    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);
                    break;
            }
        });
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, observerOptions);
})();