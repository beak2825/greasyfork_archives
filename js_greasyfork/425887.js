// ==UserScript==
// @name         Substack Token Remover
// @namespace    https://garner.io
// @version      1.0
// @description  Removes everything after and including the token parameter from Substack URLs.
// @author       John Garner
// @icon         https://cdn.substack.com/icons/substack/favicon.ico
// @grant        none
// @run-at       document-start
// @include      *://*.substack.com/*?token=*
// @downloadURL https://update.greasyfork.org/scripts/425887/Substack%20Token%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/425887/Substack%20Token%20Remover.meta.js
// ==/UserScript==

var site = location.href.replace(/\?token=.*/, '');
location.replace (site);