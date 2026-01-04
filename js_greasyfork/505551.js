// ==UserScript==
// @name        Hide ads-shit-brands news and reviews on notebookcheck
// @namespace   shitkiller
// @match       https://www.notebookcheck.net/*
// @match       https://www.notebookcheck.com/*
// @description Hide Garmin, Anker, Philips and other ads-shit-brands on notebookcheck
// @grant       none
// @version     1.0
// @author      shit-killer
// @downloadURL https://update.greasyfork.org/scripts/505551/Hide%20ads-shit-brands%20news%20and%20reviews%20on%20notebookcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/505551/Hide%20ads-shit-brands%20news%20and%20reviews%20on%20notebookcheck.meta.js
// ==/UserScript==

shitBrands = ['garmin', 'anker', 'philips hue'];

for (const container of [...document.querySelectorAll('a.introa_review'), ...document.querySelectorAll('a.introa_news')]) {
  title = container.querySelector('.introa_title')?.innerText;

  if (!title) {
    continue
  }

  const titleLower = title.toLowerCase();

  if (shitBrands.some(str => titleLower.includes(str))) {
    container.innerHTML = `SPAM: ${title}`;
    container.style.color = '#bbb';
    container.style.margin = '0';
  }
}
