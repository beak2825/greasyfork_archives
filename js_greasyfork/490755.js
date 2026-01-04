// ==UserScript==
// @name         Enable Attack Button on Torn Profile Page
// @version      1.1
// @description  Enables a disabled button on Torn profile page and redirects to the attack page when the button is clicked
// @match        https://www.torn.com/profiles.php?XID=*
// @namespace https://greasyfork.org/users/1278787
// @downloadURL https://update.greasyfork.org/scripts/490755/Enable%20Attack%20Button%20on%20Torn%20Profile%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/490755/Enable%20Attack%20Button%20on%20Torn%20Profile%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableButton(button) {
        if (button && button.classList.contains('disabled')) {
            button.classList.remove('disabled');
            button.classList.add('active');
            button.removeAttribute('aria-disabled');
            button.removeAttribute('href');
            button.addEventListener('click', handleButtonClick);
            button.querySelector('svg').removeAttribute('fill');
            button.querySelector('svg').setAttribute('fill', 'url(#linear-gradient-dark-mode)');
            button.style.border = '1px solid red';
        }
    }

    function handleButtonClick(event) {
        event.preventDefault();
        // Get the user ID from the button's ID
        const userID = event.target.id.replace('button0-profile-', '');
        // Redirect to the attack page with the user ID
        window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
    }

    const checkButtonAvailability = setInterval(function() {
        const buttons = document.querySelectorAll('[id^="button0-profile-"]');
        if (buttons.length > 0) {
            clearInterval(checkButtonAvailability);
            buttons.forEach(enableButton);
        }
    }, 1000);
})();
