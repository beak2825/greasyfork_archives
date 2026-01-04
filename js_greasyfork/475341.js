// ==UserScript==
// @name         Old github dashboard
// @description  Return to the old github feed version. This scripts fetches the content of the old feed and replaces it into the new feed.
// @namespace    renanborgez
// @author       renanborgez
// @version      2.2
// @match        https://github.com/
// @match        https://github.com/dashboard-feed
// @downloadURL https://update.greasyfork.org/scripts/475341/Old%20github%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/475341/Old%20github%20dashboard.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  document.getElementById('dashboard').innerHTML = 'Loading old dashboard...';
  
  fetch('https://github.com/dashboard-feed').then(response => response.text()).then(data => {
  	const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const content = doc.getElementsByTagName('main')[0].innerHTML;
    document.getElementById('dashboard').innerHTML = content;
  }).catch(() => {
    document.getElementById('dashboard').innerHTML = 'Something wrong happended!'
  });
})();

