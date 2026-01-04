// ==UserScript==
// @name         Add Images Option Back To imgur
// @version      0.0.1
// @description  Images option added to the Imgur user dropdown menu
// @author       https://imgur.com/user/Putin/about
// @match        https://*.imgur.com/*
// @namespace https://greasyfork.org/users/1481804
// @downloadURL https://update.greasyfork.org/scripts/539058/Add%20Images%20Option%20Back%20To%20imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/539058/Add%20Images%20Option%20Back%20To%20imgur.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const observer = new MutationObserver((mutations, obs) => {
        const dropdown = document.querySelector('.Dropdown-list .Dropdown-option-group');
        if (dropdown) {
            const usernameElement = document.querySelector('.NavbarUserMenuCover-user');
            if (usernameElement) {
                const username = usernameElement.textContent.trim();
                const imagesOption = document.createElement('a');
                imagesOption.className = 'Dropdown-option';
                imagesOption.href = `https://${username}.imgur.com/all/`;
                imagesOption.textContent = 'Images';
                imagesOption.setAttribute('data-discover', 'true');
                dropdown.insertBefore(imagesOption, dropdown.firstChild);
                obs.disconnect();
            }
        }
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
})();