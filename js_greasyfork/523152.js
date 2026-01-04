// ==UserScript==
// @name        Open All Links in New Windows
// @name:zh-CN  所有链接在新窗口打开
// @namespace   http://tampermonkey.net/
// @version     1.3
// @description Opens all links in new windows.
// @description:zh-CN 所有链接都在新窗口打开
// @author      Yun sun
// @match       *://*/*
// @grant       none
// @license     MIT
// @icon        https://img.icons8.com/?size=64&id=68406&format=png&color=000000  // Paste 64x64 icon URL here
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/523152/Open%20All%20Links%20in%20New%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/523152/Open%20All%20Links%20in%20New%20Windows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleClick(event) {
        if (event.ctrlKey || event.metaKey) return;

        const anchor = event.target.closest('a');
        if (!anchor || !anchor.href) return;

        if (anchor.getAttribute('href').startsWith('javascript:')) return;

        event.preventDefault();
        event.stopPropagation();

        window.open(anchor.href, '_blank');
    }

    document.addEventListener('click', handleClick, true);
})();