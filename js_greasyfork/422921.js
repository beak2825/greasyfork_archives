
// ==UserScript==
// @name        Tarball viewer
// @namespace   https://gera2ld.space/
// @description View content of tarballs without download them.
// @match       *://www.npmjs.com/package/*
// @version     0.2.0
// @author      Gerald <i@gera2ld.space>
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422921/Tarball%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/422921/Tarball%20viewer.meta.js
// ==/UserScript==

(function () {
'use strict';

async function main() {
  const matches = window.location.pathname.match(/^\/package\/(.*?)(?:\/v\/([a-z0-9.-]+))?$/);
  if (!matches) {
    VM.showToast('Package not found');
    return;
  }
  const [, pkgName, version] = matches;
  const name = [pkgName, version].filter(Boolean).join('@');
  const qs = new URLSearchParams({
    r: `npm:${name}`
  });
  GM_openInTab(`https://webfs.gera2ld.space/#${qs}`);
}
GM_registerMenuCommand('Explore tarball', main);

})();
