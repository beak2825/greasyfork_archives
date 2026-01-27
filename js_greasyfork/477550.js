// ==UserScript==
// @name        Udemy Course Creation Date
// @namespace   Violentmonkey Scripts
// @match       https://www.udemy.com/course/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      ad3m
// @description This script adds udemy course creation date of course to last updated panel.
// @downloadURL https://update.greasyfork.org/scripts/477550/Udemy%20Course%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/477550/Udemy%20Course%20Creation%20Date.meta.js
// ==/UserScript==

(async () => {
  const updated = document.querySelector('div[class^="last-updated-module-scss-module__"] span');
  if (!updated) return;
  const slug = location.pathname.split('/')[2];
  const res = await fetch(`https://www.udemy.com/api-2.0/courses/${slug}/?fields[course]=created`);
  const data = await res.json();
  updated.textContent = `Created ${new Date(data.created).toLocaleDateString()} - ${updated.textContent}`;
})();