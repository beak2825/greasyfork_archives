// ==UserScript==
// @name         Enable Attack Button on Torn Profile Page
// @namespace    https://lordrhino.co.uk/
// @version      1.2
// @description  Enables the disabled button on Torn profile page when a player is in hospital and redirects to the attack page when the button is clicked
// @match        https://www.torn.com/profiles.php?XID=*
// @downloadURL https://update.greasyfork.org/scripts/470916/Enable%20Attack%20Button%20on%20Torn%20Profile%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/470916/Enable%20Attack%20Button%20on%20Torn%20Profile%20Page.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getProfileID() {
    const url = new URL(location.href);
    const xid = url.searchParams.get('XID');
    if (xid && /^\d+$/.test(xid)) return xid;
    const m = location.href.match(/[?&]XID=(\d+)/i);
    return m ? m[1] : '';
  }
  const PROFILE_ID = getProfileID();

  function enableButton(button) {
    if (!button) return;
    if (button.classList.contains('disabled') || button.hasAttribute('disabled')) {
      button.classList.remove('disabled');
      button.classList.add('active');
      button.removeAttribute('aria-disabled');
      button.removeAttribute('disabled');
      button.removeAttribute('href');
      button.addEventListener('click', handleButtonClick);
      const svg = button.querySelector('svg');
      if (svg) {
        svg.removeAttribute('fill');
        svg.setAttribute('fill', 'url(#linear-gradient-dark-mode)');
      }
      button.style.border = '1px solid red';
      button.style.pointerEvents = 'auto';
      button.style.cursor = 'pointer';
      button.style.opacity = '1';
      button.style.filter = 'none';
    } else {
      button.addEventListener('click', handleButtonClick);
    }
  }

  function handleButtonClick(event) {
    event.preventDefault();
    if (!PROFILE_ID) {
      console.warn('Could not read XID from URL.');
      return;
    }
    window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${PROFILE_ID}`;
  }

  const check = setInterval(() => {
    const buttons = document.querySelectorAll('[id^="button0-profile-"]');
    if (buttons.length) {
      clearInterval(check);
      buttons.forEach(enableButton);
    }
  }, 250);
})();

