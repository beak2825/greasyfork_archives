// ==UserScript==
// @name            Testing outside scripts
// @description     Test them scripts, boi
// @version         1.0.3
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           *://*/*
// @run-at          document-end
// @compatible      safari
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/540974/Testing%20outside%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/540974/Testing%20outside%20scripts.meta.js
// ==/UserScript==

const COMPANY_NAME = "david-star";
const FIRST_NAME = "Oliver";
const LAST_NAME = "Porat";

// SYSTEM VARS
const CDN_URL = 'https://construction-js-injections.pages.dev';

// PERSONAL VARS
const salesperson = {
	firstName: FIRST_NAME,
	lastName: LAST_NAME,
	get fullName() {
		return this.firstName + " " + this.lastName;
	},
	get key() {
		return this.firstName.toLowerCase() + '-' + this.lastName.toLowerCase();
	},
};

// QUERY STRING
const currentSiteUrl = encodeURIComponent(window.location.href);
const params = {
	data: JSON.stringify({ currentSiteUrl, salesperson }),
};
const urlSearchParams = new URLSearchParams(params).toString();

(function() {
  'use strict';
  
  const url = `${CDN_URL}/${COMPANY_NAME}?${urlSearchParams}`;

  // Fetch and inject
  fetch(url)
    .then(res => res.text())
    .then(code => {
      const script = document.createElement('script');
      script.textContent = code;
      document.head.appendChild(script);
    })
    .catch(err => console.error('Failed loading dynamic script:', err));
})();