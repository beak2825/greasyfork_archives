// ==UserScript==
// @name         ChatGPT Sidebar Toggle
// @name:es      Alternar Barra Lateral de ChatGPT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This userscript adds a little button to ChatGPT's Sidebar so that you can hide it.
// @description:es  Este usescript agrega un pequeño botón a la barra lateral de ChatGPT para que la puedas esconder.
// @author       CFUEN (https://github.com/cfuendev)
// @match        https://chat.openai.com/*
// @match        https://chat.openai.com/c/*
// @icon         https://chat.openai.com/favicon-16x16.png
// @license      MIT
// @grant        none
// @run-at
// @downloadURL https://update.greasyfork.org/scripts/466457/ChatGPT%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/466457/ChatGPT%20Sidebar%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sidebarElm;
    let sidebarHidden = false;
    const hideSidebarButtonElm = document.createElement('button');
    hideSidebarButtonElm.style = "padding: 3px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; background-color: #202123; border-top: 1px solid rgba(255, 255, 255, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2); position: absolute; left: 100%; top:30px;";
    hideSidebarButtonElm.innerHTML = '<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M3.636 11.293a1 1 0 0 0 0 1.414l5.657 5.657a1 1 0 0 0 1.414-1.414L6.757 13H20a1 1 0 1 0 0-2H6.757l3.95-3.95a1 1 0 0 0-1.414-1.414l-5.657 5.657Z"/></g></svg>'
    const scriptInterval = setInterval(() => {
        sidebarElm = document.querySelector('html body div#__next div.overflow-hidden.w-full.h-full.relative.flex.z-0 div.flex-shrink-0.overflow-x-hidden.bg-gray-900');
        if (sidebarElm) {
            clearInterval(scriptInterval);
            sidebarElm.id = "Sidebar";
            const hideSidebarButtonElm = document.createElement('button');
            hideSidebarButtonElm.style = "padding: 3px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; background-color: #202123; border-top: 1px solid rgba(255, 255, 255, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2); position: absolute; left: 100%; top:30px;";
            hideSidebarButtonElm.innerHTML = '<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M3.636 11.293a1 1 0 0 0 0 1.414l5.657 5.657a1 1 0 0 0 1.414-1.414L6.757 13H20a1 1 0 1 0 0-2H6.757l3.95-3.95a1 1 0 0 0-1.414-1.414l-5.657 5.657Z"/></g></svg>'
            hideSidebarButtonElm.addEventListener('click', (e) => {
                if (sidebarHidden) {
                    sidebarElm.style.transform = '';
                    sidebarElm.style.position = 'relative';
                    hideSidebarButtonElm.querySelector('svg').style.transform = "rotateY(0deg)";
                    sidebarHidden = false;
                } else {
                    sidebarElm.style.transform = 'translateX(-100%)';
                    sidebarElm.style.position = 'absolute';
                    hideSidebarButtonElm.querySelector('svg').style.transform= "rotateY(180deg)";
                    sidebarHidden = true;
                }
            })
            sidebarElm.style.position = 'relative'; sidebarElm.style.overflowX = 'visible'; sidebarElm.style.zIndex = '2'; sidebarElm.style.borderRight = '1px solid rgba(255, 255, 255, 0.2)'
            sidebarElm.append(hideSidebarButtonElm);
        }
    }, 5)

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("__next");

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: false };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Handle changes to the targetNode here
        const scriptInterval = setInterval(() => {
            sidebarElm = document.querySelector('html body div#__next div.overflow-hidden.w-full.h-full.relative.flex.z-0 div.flex-shrink-0.overflow-x-hidden.bg-gray-900');
            if (sidebarElm) {
                clearInterval(scriptInterval);
                sidebarElm.id = "Sidebar";
                hideSidebarButtonElm.addEventListener('click', (e) => {
                    if (sidebarHidden) {
                        sidebarElm.style.transform = '';
                        sidebarElm.style.position = 'relative';
                        hideSidebarButtonElm.querySelector('svg').style.transform = "rotateY(0deg)";
                        sidebarHidden = false;
                    } else {
                        sidebarElm.style.transform = 'translateX(-100%)';
                        sidebarElm.style.position = 'absolute';
                        hideSidebarButtonElm.querySelector('svg').style.transform= "rotateY(180deg)";
                        sidebarHidden = true;
                    }
                })
                sidebarElm.style.position = 'relative'; sidebarElm.style.overflowX = 'visible'; sidebarElm.style.zIndex = '2'; sidebarElm.style.borderRight = '1px solid rgba(255, 255, 255, 0.2)'
                sidebarElm.append(hideSidebarButtonElm);
            }
        }, 5)
        };

    // Create a new observer instance
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    // sidebarElm.style.display = 'block';
})();