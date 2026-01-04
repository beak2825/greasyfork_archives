// ==UserScript==
// @name         Fix redirect links in 5ch
// @namespace    https://greasyfork.org/users/57176
// @match        https://*.5ch.net/*/read.cgi/**
// @icon         https://egg.5ch.net/favicon.ico
// @grant        none
// @version      1.0.0
// @author       peng-devs
// @description  Fix links in 5ch thread page so it will directly jump to the target page
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468636/Fix%20redirect%20links%20in%205ch.user.js
// @updateURL https://update.greasyfork.org/scripts/468636/Fix%20redirect%20links%20in%205ch.meta.js
// ==/UserScript==

(function() {
  'strict';

  const NAME = 'fix-5ch-redirect-links';

  function main() {
    console.log(`[${NAME}] initializing...`);

    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      const url = new URL(a.href);
      if (url.host !== 'jump.5ch.net') return;

      a.href = a.href.split('?')[1];
    });

    console.log(`[${NAME}] loaded`);
  }

  main();
}());