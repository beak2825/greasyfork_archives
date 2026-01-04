// ==UserScript==
// @name         Copy Path Data Only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add only copy the PathData button. And try to adjust the svg view position. For android development.
// @author       二次蓝
// @match        https://jakearchibald.github.io/svgomg/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_setClipboard
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/510526/Copy%20Path%20Data%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/510526/Copy%20Path%20Data%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const svgContainerSelector = 'div.svg-container';

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const targetElement = mutation.target;
                const transformStyle = targetElement.style.transform;

                if (transformStyle === 'translate3d(0px, 0px, 0px) scale(1)') {
                    console.log('Transform matches: translate3d(0px, 0px, 0px) scale(1)');
                    adjustSvgView();
                }
            }
        }
    });
    function waitForTarget() {
        const targetElement = document.querySelector(svgContainerSelector);
        if (targetElement) {
            observer.observe(targetElement, {
                attributes: true
            });
            console.log('Observer is now watching:', targetElement);
        } else {
            setTimeout(waitForTarget, 500);
        }
    }

    waitForTarget();


    /*const svgInput = document.querySelector('.paste-input');
    if (svgInput) {
        svgInput.addEventListener('input', () =>{
            console.log("paste " + svgInput.value);
        });
    }*/

    function adjustSvgView() {
        const svgContainer = document.querySelector(svgContainerSelector);
        const svgOutput = svgContainer.parentElement;

        const containerWidth = svgOutput.clientWidth;
        const containerHeight = svgOutput.clientHeight;
        const elementWidth = svgContainer.clientWidth;
        const elementHeight = svgContainer.clientHeight;

        const offsetX = (containerWidth / 2);
        const offsetY = (containerHeight / 2);

        svgContainer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px) scale(1)`;
        console.log("adjust position to", `translate3d(${offsetX}px, ${offsetY}px, 0px) scale(1)`);
    }

    const newButton = document.createElement('button');
    newButton.textContent = 'Copy Path';
    newButton.style.position = 'relative';
    newButton.style.zIndex = '1000';
    newButton.style.backgroundColor = '#007bff';
    newButton.style.color = '#fff';
    newButton.style.padding = '10px';
    newButton.style.border = 'none';
    newButton.style.borderRadius = '5px';
    newButton.style.cursor = 'pointer';

    const container = document.querySelector('div.minor-action-container');
    if (container) {
        container.appendChild(newButton);
    }

    const targetButton = document.querySelector('button.unbutton.floating-action-button:nth-child(2)');

    const observeDOMChanges = () => {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'PRE') {
                            console.log('Detected svg:', node.innerHTML);
                            const svg = decodeHtmlEntities(node.innerHTML);

                            setTimeout(()=>{
                                const pathMatch = svg.match(/<path[^>]*d="([^"]+)"[^>]*>/);
                                if (pathMatch && pathMatch[1]) {
                                    const dAttribute = pathMatch[1];
                                    GM_setClipboard(dAttribute);
                                    console.log('PathData:', dAttribute);
                                    return true;
                                } else {
                                    console.log('No <path> tag or d attribute found.');
                                }
                            }, 800);

                            observer.disconnect();
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return observer;
    };

    newButton.addEventListener('click', function() {
        const observer = observeDOMChanges();
        if (targetButton) {
            targetButton.click();
        } else {
            console.warn('Target button not found');
            observer.disconnect();
        }
    });

    function decodeHtmlEntities(encodedString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(encodedString, 'text/html');
        return doc.documentElement.textContent;
    }

})();
