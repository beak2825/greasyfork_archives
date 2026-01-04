// ==UserScript==
// @name         Anna’s Archive Auto Download
// @namespace    https://greasyfork.org/users/768814
// @license      GPLv3
// @version      0.1
// @description  Wait on a slow download page for Anna's Archive and auto click the Download button once it is ready (forked from heartnn)
// @author       Arg Anon
// @origAuthor   heartnn
// @match        https://*annas-archive.org/slow_download/*
// @match        https://*annas-archive.li/slow_download/*
// @match        https://*annas-archive.se/slow_download/*
// @icon         https://annas-archive.org/apple-touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544441/Anna%E2%80%99s%20Archive%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/544441/Anna%E2%80%99s%20Archive%20Auto%20Download.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const ms = 1000;

  setTimeout(() => {
    const downloadAnchor = document.querySelector("main.main p.text-xl.font-bold a");
    if(downloadAnchor)
      downloadAnchor.click();
  }, ms);
})();
