// ==UserScript==
// @name         Entity Manager - Improve Merge Visibility
// @namespace    http://tampermonkey.net/
// @version      2023.07.11.1
// @description  Makes "Merge" tab more visible when merges are likely
// @author       Vance M. Allen
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/View?eduId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475059/Entity%20Manager%20-%20Improve%20Merge%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/475059/Entity%20Manager%20-%20Improve%20Merge%20Visibility.meta.js
// ==/UserScript==

(function() {
    let links = document.getElementsByClassName('k-link');
    if(links.length>8 && links.item(7).innerText === '*Merges*') {
        console.warn('Merge tab being made more visible by "Entity Manager - Improve Merge Visibility" script');
        document.getElementsByClassName('k-link').item(7).style.backgroundColor = 'yellow';
    }
})();
