// ==UserScript==
// @name         Ultimate ApitoWeb Whatsapp Alterator 3000
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes links with api.whatsapp.com to web.whatsapp.com for web links if you don't have/(want to install) whatsapp desktop.
// @author       Jorge Restrepo
// @match        https://api.whatsapp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422900/Ultimate%20ApitoWeb%20Whatsapp%20Alterator%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/422900/Ultimate%20ApitoWeb%20Whatsapp%20Alterator%203000.meta.js
// ==/UserScript==

var newHost = location.host.replace ("api.", "web.");
var newURL = location.protocol + "//" + newHost + "/send/" + location.search + location.hash;
    location.replace (newURL);