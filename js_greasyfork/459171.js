// ==UserScript==
// @name        POEWIKI Redirector
// @match       https://pathofexile.fandom.com/wiki/*
// @grant       none
// @version     1.0
// @author      KeldonSlayer
// @run-at      document-start
// @license     CC0
// @description Redirects pathofexile.fandom.com links to poewiki.net
// @namespace https://greasyfork.org/users/1019268
// @downloadURL https://update.greasyfork.org/scripts/459171/POEWIKI%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/459171/POEWIKI%20Redirector.meta.js
// ==/UserScript==

location = Object.assign(new URL(location), { protocol: 'https:', host: 'poewiki.net/wiki/' });