// ==UserScript==
// @name          Commie Scum
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @license     MIT
// @description  Detects names of virulent communist figures.
// @author       Chadbertarian
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467662/Commie%20Scum.user.js
// @updateURL https://update.greasyfork.org/scripts/467662/Commie%20Scum.meta.js
// ==/UserScript==

fetch('https://api.jsonbin.io/v3/b/64790b608e4aa6225ea7d02e')
    .then(response => response.json())
    .then(data => {
        const jsonFile = data.record;
        const revolutionaries = jsonFile.revolutionaries;

        const revolutionary = revolutionaries.map(revolutionary => { return revolutionary.name });
        const regex = new RegExp(revolutionary.join('|', 'gi'));
        document.body.innerHTML = document.body.innerHTML.replace(regex, 'Commie Scum $&');
    })
    .catch(err => {
        console.log(err);
    });