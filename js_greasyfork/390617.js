// ==UserScript==
// @name amazon smile
// @description changes amazon to always use smile
// @namespace Azzurite
// @include https://www.amazon.de*
// @version 1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/390617/amazon%20smile.user.js
// @updateURL https://update.greasyfork.org/scripts/390617/amazon%20smile.meta.js
// ==/UserScript==

if (location.hostname !== 'smile.amazon.de') {
location.hostname = 'smile.amazon.de';
}