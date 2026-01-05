// ==UserScript==
// @name         Redacted :: Load First Page
// @author       newstarshipsmell
// @namespace    https://greasyfork.org/en/scripts/27607-redacted-load-first-page
// @version      1.0
// @description  Reload torrent groups to the first page of comments.
// @include      https://redacted.ch/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27607/Redacted%20%3A%3A%20Load%20First%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/27607/Redacted%20%3A%3A%20Load%20First%20Page.meta.js
// ==/UserScript==

window.location.assign(window.location.href.replace(/\?id=/, '?page=1&id='));