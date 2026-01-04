// ==UserScript==
// @name         Noticer 
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @license      MIT
// @description  Detects names of common interest.
// @author       Chadbertarian
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/en/1/1d/The_Happy_Merchant.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468143/Noticer.user.js
// @updateURL https://update.greasyfork.org/scripts/468143/Noticer.meta.js
// ==/UserScript==
 
fetch('https://api.jsonbin.io/v3/b/648102608e4aa6225eaacca0')
    .then(response => response.json())
    .then(data => {
        const jsonFile = data.record;
        const people = jsonFile.people;
 
        const person = people.map(person => { return person.name });
        const regex = new RegExp(person.join('|', 'gi'));
        document.body.innerHTML = document.body.innerHTML.replace(regex, '((($&)))');
    })
    .catch(err => {
        console.log(err);
    });

document.body.innerHTML = document.body.innerHTML.replace('Israel', '(((Our Greatest Ally)))');