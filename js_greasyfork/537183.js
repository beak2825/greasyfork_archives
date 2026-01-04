// ==UserScript==
// @name        Nitter/XCancel Search Redirect to Users
// @match        https://nitter.net/*
// @match        https://nitter.privacyredirect.com/*
// @match        https://xcancel.com/*
// @match        https://nitter.tiekoetter.com/*
// @match        https://nitter.space/*
// @description On homepage, redirect search form and icon to user search
// @version 0.0.1.20250904154315
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537183/NitterXCancel%20Search%20Redirect%20to%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/537183/NitterXCancel%20Search%20Redirect%20to%20Users.meta.js
// ==/UserScript==

(function () {
  const origin = window.location.origin;

  // Change the search icon href if present
  const searchLink = document.querySelector('a.icon-search');
  if (searchLink) {
    searchLink.href = `${origin}/search?f=users`;
  }

  // On homepage only, update form action and ensure it targets user search
  const form = document.querySelector('form[action="/search"]');
  if (form) {
    form.action = `${origin}/search`;

    // Force the hidden input "f" to be "users"
    const fInput = form.querySelector('input[name="f"]');
    if (fInput) {
      fInput.value = 'users';
    } else {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'f';
      hiddenInput.value = 'users';
      form.appendChild(hiddenInput);
    }
  }
})();
