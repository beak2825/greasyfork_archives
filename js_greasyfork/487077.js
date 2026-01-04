// ==UserScript==
// @name         1337x: iTorrents Download Fix
// @description  Fixes the itorrents.org link on 1337x.to, which gets blocked on Chrome due to the url being http instead of https (a simple fix, if anyone knows how to get in touch to let them know)
// @match        https://1337x.to/torrent/*
// @version      0.1
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487077/1337x%3A%20iTorrents%20Download%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/487077/1337x%3A%20iTorrents%20Download%20Fix.meta.js
// ==/UserScript==

const elem = document.querySelector('[aria-labelledby="dropdownMenu1"]').children[0].children[0];
const url = elem.href.replace('http', 'https');
elem.setAttribute('href', url);