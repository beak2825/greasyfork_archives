// ==UserScript==
// @name         Redirect RuneScape Wikia pages to the new wiki
// @namespace    https://tomputtemans.com/
// @version      0.1
// @description  Forward any Wikia page directly to runescape.wiki
// @author       Glodenox
// @match        http://runescape.wikia.com/wiki/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373065/Redirect%20RuneScape%20Wikia%20pages%20to%20the%20new%20wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/373065/Redirect%20RuneScape%20Wikia%20pages%20to%20the%20new%20wiki.meta.js
// ==/UserScript==

window.location.replace(window.location.href.replace('http://runescape.wikia.com/wiki', 'https://runescape.wiki/w'));