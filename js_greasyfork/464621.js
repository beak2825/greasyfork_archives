// ==UserScript==
// @name         Website Customizer
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Customize website font size, background color, and text color
// @author       Wrldz
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464621/Website%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/464621/Website%20Customizer.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Define the customization controls
    const customizer = `
        <div style="position: fixed; bottom: 20px; right: 20px; padding: 10px; background-color: white; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Website Customizer</h3>
                <button id="closeButton" style="background-color: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">X</button>
            </div>
            <div id="controls" style="display: block;">
                <label style="vertical-align: middle;">Font Size: <input type="range" min="12" max="24" value="16" style="margin-left: 5px; vertical-align: middle;" oninput="document.body.style.fontSize = this.value + 'px';"></label>
                <label style="vertical-align: middle;">Background Color: <input type="color" value="#ffffff" style="margin-left: 5px; vertical-align: middle;" oninput="document.body.style.backgroundColor = this.value;"></label>
                <label style="vertical-align: middle;">Text Color: <input type="color" value="#000000" style="margin-left: 5px; vertical-align: middle;" oninput="document.body.style.color = this.value;"></label>
            </div>
            <div id="openButtonContainer" style="display: none; margin-top: 10px;">
                <button id="openButton" style="background-color: green; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">Open</button>
            </div>
        </div>
    `;

    // Add the customizer to the document body
    document.body.insertAdjacentHTML('beforeend', customizer);

    // Add event listener to the close button
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        document.getElementById('controls').style.display = 'none';
        document.getElementById('openButtonContainer').style.display = 'block';
    });

    // Add event listener to the open button
    const openButton = document.getElementById('openButton');
    openButton.addEventListener('click', () => {
        document.getElementById('openButtonContainer').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    });
})();