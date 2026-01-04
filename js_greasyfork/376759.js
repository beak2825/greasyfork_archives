// ==UserScript==
// @name     OSRS Wiki Redirect
// @version  2
// @grant    none
// @run-at document-start
// @match http://oldschoolrunescape.fandom.com/wiki/*
// @match https://oldschoolrunescape.fandom.com/wiki/*
// @namespace https://greasyfork.org/users/239862
// @description Redirects from the old Old School Runescape Wiki to the new Old School Runescape Wiki
// @downloadURL https://update.greasyfork.org/scripts/376759/OSRS%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/376759/OSRS%20Wiki%20Redirect.meta.js
// ==/UserScript==



let oldWiki = window.location.href;
let newWiki = oldWiki.replace('oldschoolrunescape.fandom.com/wiki/', 'oldschool.runescape.wiki/w/');
window.location.replace(newWiki);