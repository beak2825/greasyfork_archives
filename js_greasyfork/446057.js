// ==UserScript==
// @name Yugioh wikia -> Yugipedia
// @version      1.0
// @description  Automatically redirects yugioh.fandom links to yugipedia ones
// @match http://yugioh.fandom.com/*
// @match https://yugioh.fandom.com/*
// @grant none
// @run-at document-start
// @author        Stewartisme
// @namespace https://greasyfork.org/en/users/6496
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/446057/Yugioh%20wikia%20-%3E%20Yugipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/446057/Yugioh%20wikia%20-%3E%20Yugipedia.meta.js
// ==/UserScript==

// get current url
var url = window.location.href;
// redirect to altered url
location.href = url.replace(/yugioh.fandom\.com/, "yugipedia.com");