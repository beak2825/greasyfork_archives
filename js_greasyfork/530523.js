// ==UserScript==
// @name         Hide "For You" feed
// @name:ja      おすすめ非表示
// @description         Hides "For You" feed
// @description:ja      トップページに出る"おすすめ"を非表示にします
// @version      1.0.1
// @match        *://www.threads.net/
// @match        *://threads.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        none
// @license      Public Domain
// @namespace https://greasyfork.org/users/1448850
// @downloadURL https://update.greasyfork.org/scripts/530523/Hide%20%22For%20You%22%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/530523/Hide%20%22For%20You%22%20feed.meta.js
// ==/UserScript==

(() => {
'use strict';
let s = document.createElement('style');
s.textContent = `
div:has(> * > * > * > * > a[href="/for_you"][aria-label]) { display: none }
`;
document.head.appendChild(s);
})();