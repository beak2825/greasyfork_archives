// ==UserScript==
// @name         Wplace chunk position
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Print selected pixel's chunk position to console
// @author       rice-cracker-dev
// @match        https://wplace.live/*
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545852/Wplace%20chunk%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/545852/Wplace%20chunk%20position.meta.js
// ==/UserScript==
(() => {
  const originalFetch = window.fetch;

  const hookedFetch = async (resource, init) => {
    const url = new URL(
      typeof resource === "string" ? resource : resource.url || "",
    );

    try {
      const res = await originalFetch(resource, init);

      const x = url.searchParams.get("x");
      const y = url.searchParams.get("y");

      if (x && y) {
        const pathnames = url.pathname.split("/");
        const chunkX = pathnames[pathnames.length - 2];
        const chunkY = pathnames[pathnames.length - 1];
        const chunkUrl = `https://backend.wplace.live/files/s0/tiles/${chunkX}/${chunkY}.png`;
        console.log(
          `You clicked on chunk ${chunkX}/${chunkY}, pixel ${x}/${y}\nChunk image: ${chunkUrl}`,
        );
      }

      return res;
    } catch (e) {
      console.error(e);
      return originalFetch(resource, init);
    }
  };

  window.fetch = hookedFetch;
  unsafeWindow.fetch = hookedFetch;
})();
