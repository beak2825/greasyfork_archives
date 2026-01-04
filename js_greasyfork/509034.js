// ==UserScript==
// @name         HideIMGs
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  hide all images with a click
// @author       whp-henry
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509034/HideIMGs.user.js
// @updateURL https://update.greasyfork.org/scripts/509034/HideIMGs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let customCSSEnabled = false;

    function addCustomCSS() {
        const css = `
            img {
                opacity: 0 !important;
                transition: opacity 1s !important;
            }
            img:hover {
                opacity: 0.3 !important;
            }
            imgswitchbtn .btninner {
                left: 10px;
                background-color: red;
            }
        `;
        const style = document.createElement('style');
        style.id = 'customCSS';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function generalCustomCSS() {
        const css = `
            img {
                transition: opacity 1s;
            }
            imgswitchbtn {
                transition: opacity 0.3s;
                opacity: 0.1;
                width: 30px;
                height: 20px;
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: #cacaca;
                border-radius: 10px;
                border: gray solid 1px;
                box-sizing: border-box;
            }
            imgswitchbtn:hover {
                opacity: 1;
            }
            imgswitchbtn .btninner {
                width: 14px;
                height: 14px;
                position: absolute;
                margin: 2px;
                left: 0px;
                background-color: blue;
                transition: 0.5s;
                border-radius: 50%;
            }
        `;
        const Cstyle = document.createElement('style');
        Cstyle.id = 'generalcustomCSS';
        Cstyle.type = 'text/css';
        Cstyle.appendChild(document.createTextNode(css));
        document.head.appendChild(Cstyle);
    }

    function removeCustomCSS() {
        const style = document.getElementById('customCSS');
        if (style) {
            console.log("remove");
            style.remove();
        }
    }

    function toggleCustomCSS() {
        if (customCSSEnabled) {
            removeCustomCSS();
        } else {
            addCustomCSS();
        }
        customCSSEnabled = !customCSSEnabled;
    }

    // Create the toggle button
    function createToggleButton() {
        const toggleButton = document.createElement('imgswitchbtn');
        toggleButton.innerHTML = '<div class="btninner"></div>';

        toggleButton.addEventListener('click', toggleCustomCSS);
        document.body.appendChild(toggleButton);
    }

    // Initialize
    function init() {
        generalCustomCSS();
        createToggleButton();
    }

    init(); // Run the script

})();
