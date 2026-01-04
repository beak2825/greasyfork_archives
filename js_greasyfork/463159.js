// ==UserScript==
// @name         Add "MxJ" option to dropdown menu - MAL
// @namespace    https://myanimelist.net/profile/kyoyatempest
// @version      1.3
// @description  Adds "MxJ" option to MAL's dropdown menu. (for mobile and desktop)
// @author       kyoyacchi
// @match        https://myanimelist.net/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463159/Add%20%22MxJ%22%20option%20to%20dropdown%20menu%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/463159/Add%20%22MxJ%22%20option%20to%20dropdown%20menu%20-%20MAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const optionLink = document.createElement('a');
    optionLink.href = 'https://mxj.myanimelist.net/about-me/';



    const optionIcon = document.createElement('i');
    optionIcon.classList.add('fas', 'fa-table-list');
    optionIcon.setAttribute('aria-hidden', 'true');
  

    optionLink.appendChild(optionIcon);
    optionLink.innerHTML += ' MxJ Settings';

    const option = document.createElement('li');
    option.appendChild(optionLink);

    const mdropdown = document.querySelector('.menu-list');
    const ddropdown = document.querySelector('.arrow_box.header-profile-dropdown.header-menu-dropdown > ul');

    if (mdropdown) {
      option.classList.add("link");
        mdropdown.appendChild(option);
    } else if (ddropdown) {
        const bookshelf = Array.from(ddropdown.children).find((child) => child.textContent.trim() === 'Bookshelf');

        if (bookshelf) {
            ddropdown.insertBefore(option, bookshelf.nextSibling);
        }
    }
})();
