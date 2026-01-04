// ==UserScript==
// @name        Hide whitespace on GitHub
// @namespace   https://greasyfork.org/users/397149
// @match       https://github.sec.samsung.net/*
// @grant       none
// @version     0.2
// @author      Sungmin KIM
// @description Hide whitespace to GitHub
// @downloadURL https://update.greasyfork.org/scripts/522260/Hide%20whitespace%20on%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/522260/Hide%20whitespace%20on%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addWParam() {
      const url = new URL(window.location.href);
      const pathsToMatch = ['/files', '/commits', '/commit', '/compare'];
      const matches = pathsToMatch.some(path => url.pathname.includes(path));

      if (matches && !url.searchParams.has('w')) {
        url.searchParams.set('w', '1');
        window.location.replace(url.toString());
      }
    }


    addWParam();

    const observer = new MutationObserver(() => { addWParam(); });

    observer.observe(document.querySelector('title'), { childList: true });
})();
