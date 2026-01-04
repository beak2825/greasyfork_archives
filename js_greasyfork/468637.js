// ==UserScript==
// @name         Auto loading 5ch images
// @namespace    https://greasyfork.org/users/57176
// @match        https://*.5ch.net/*/read.cgi/**
// @icon         https://egg.5ch.net/favicon.ico
// @grant        none
// @version      1.0.1
// @author       peng-devs
// @description  Automatically showing images on the 5ch thread page
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468637/Auto%20loading%205ch%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/468637/Auto%20loading%205ch%20images.meta.js
// ==/UserScript==

(function() {
  'strict';

  const NAME = '5ch-image-autoloading';

  function main() {
    console.log(`[${NAME}] initializing...`);

    document.querySelectorAll('a.image').forEach(a => {
      const url = new URL(a.text);
      if (url.host !== 'i.imgur.com' && url.host !== 'pbs.twimg.com') return;

      a.innerHTML = `
        <img src="${a.text}" style="max-width: 80%; max-height: 40rem;" />
      `;
    });

    console.log(`[${NAME}] loaded`);
  }

  main();
}());