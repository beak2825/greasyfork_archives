// ==UserScript==
// @name         Bitbucket check draft box
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  automatically checks the bitbucket on-premise pull-request overview draft checkbox.
// @author       bashbers
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        *://yourbitbucketurlhere/*/pull-requests
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500950/Bitbucket%20check%20draft%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/500950/Bitbucket%20check%20draft%20box.meta.js
// ==/UserScript==

window.onload = onPageLoad();

function onPageLoad() {
  setTimeout(() => { document.querySelector('#pr-draft-filter.checkbox').click()}, 250)
}