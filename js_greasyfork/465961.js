// ==UserScript==
// @name         Remove CSS TH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds button to allow disabling of custom styles on a per user basis, on the site toyhou.se.
// @author       https://toyhou.se/moif
// @match        https://toyhou.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyhou.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465961/Remove%20CSS%20TH.user.js
// @updateURL https://update.greasyfork.org/scripts/465961/Remove%20CSS%20TH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = document.querySelectorAll('style');
    let removedStyles = localStorage.getItem('th-style-remover');
    // Set empty array initially
    if(!removedStyles) {
        removedStyles = new Set();
        localStorage.setItem('th-style-remover', JSON.stringify([]));
    } else {
        removedStyles = new Set(JSON.parse(removedStyles));
    }
    const user = document.querySelector('.sidebar .display-user-username').textContent;

    if(styles) {
       const isAlreadyExcluded = removedStyles.has(user);
       const navbar = document.querySelector('.navbar-right');
       document.querySelector('.navbar-right').insertAdjacentHTML('beforeend', `
          <button id="remove-style" class="badge ${isAlreadyExcluded ? 'badge-success' : 'badge-danger'}" style="height: 30px; align-self: center;border: none;">
             <i class="fas fa-remove-format"></i>
          </button>
       `);
        if(isAlreadyExcluded) styles.forEach((style) => style.remove());

       const styleBtn = document.getElementById('remove-style');
       styleBtn.addEventListener('click', () => {
           if(!isAlreadyExcluded) {
               removedStyles.add(user);
               localStorage.setItem("th-style-remover", JSON.stringify(Array.from(removedStyles)));
               location.reload();
           } else {
              removedStyles.delete(user);
              localStorage.setItem("th-style-remover", JSON.stringify(Array.from(removedStyles)));
              location.reload();
           }
       });
    }
})();