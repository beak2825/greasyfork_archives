// ==UserScript==
// @name         Adf.ly shit remover
// @namespace    https://wxyz.website/
// @version      1.1
// @description  Remove adf.ly links
// @author       whatever
// @match        https://wxyz.website/forum/*
// @match        https://www.wxyz.website/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387940/Adfly%20shit%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/387940/Adfly%20shit%20remover.meta.js
// ==/UserScript==

(function() {
  const links = document.querySelectorAll('a');
  for (let link of links.entries()) {
    const href = link[1].getAttribute('href') || '';
    const adflied = href.includes('adf.ly');
    if (adflied) {
      const url = href
        .split('/')
        .slice(4)
        .join('/');
      link[1].setAttribute('href', url);
    }
  }
})();
