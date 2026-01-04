// ==UserScript==
// @name         Hide YouTube Shorts in Inoreader
// @namespace    DartVeiga
// @version      0.2
// @description  Hide Youtube Shorts in Inoreader
// @author       DartVeiga
// @match        https://www.inoreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @run-at       document-end
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/540525/Hide%20YouTube%20Shorts%20in%20Inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/540525/Hide%20YouTube%20Shorts%20in%20Inoreader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** Sobe N níveis na árvore. */
  const climb = (el, n = 0) => {
    let e = el;
    while (n-- && e) e = e.parentElement;
    return e;
  };

  /** Faz HEAD /shorts/ID p/ saber se um vídeo normal redireciona p/ Shorts. */
  const isShortsByRequest = (vid) =>
    new Promise((resolve) => {
      const url = `https://www.youtube.com/shorts/${vid}`;
      GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        onload: (e) => resolve(e.finalUrl === url),
      });
    });

  /** Extrai o ID de vídeo, seja de /shorts/ID ou watch?v=ID. */
  const getVideoId = (href) => {
    const m = href.match(/(?:\/shorts\/|v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  };

  /** Remove o cartão/artigo que contém o link. 3 níveis costuma bastar. */
  const hideEntry = (link) =>
    (link.closest('.article_item, .article, .article_row') ||
      climb(link, 3) ||
      link
    ).remove();

  /* Observa todos os links de artigos que apontam para o YouTube. */
  document.arrive(
    "a.article_title_link[href*='youtube.com']",
    async (link) => {
      const href = link.href;

      /* Caso 1 – o link já é /shorts/ → some já. */
      if (href.includes('/shorts/')) {
        hideEntry(link);
        return;
      }

      /* Caso 2 – watch?v=ID → testa se é Shorts por HEAD. */
      const vid = getVideoId(href);
      if (!vid) return; // link estranho

      if (await isShortsByRequest(vid)) {
        hideEntry(link);
      }
    }
  );
})();