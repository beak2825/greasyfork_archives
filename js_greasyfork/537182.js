// ==UserScript==
// @name        nitter Change Search Icon Link
// @match        https://nitter.net/*
// @match        https://nitter.privacyredirect.com/*
// @match        https://xcancel.com/*
// @match        https://nitter.tiekoetter.com/*
// @match        https://nitter.space/*
// @description Changes the search icon href to search users on the current domain
// @version 0.0.1.20250904154255
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537182/nitter%20Change%20Search%20Icon%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/537182/nitter%20Change%20Search%20Icon%20Link.meta.js
// ==/UserScript==

(function () {
  const host = window.location.hostname;
  const searchLink = document.querySelector('a.icon-search');
  if (searchLink) {
    searchLink.href = `https://${host}/search?f=users`;
  }
})();