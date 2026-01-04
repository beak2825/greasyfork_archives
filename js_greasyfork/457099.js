// ==UserScript==
// @name         4chan Humbug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove santa hat and snow
// @author       You
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant    GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/457099/4chan%20Humbug.user.js
// @updateURL https://update.greasyfork.org/scripts/457099/4chan%20Humbug.meta.js
// ==/UserScript==

GM_addStyle (`
#js-snowfield {
  display: none
}

.party-hat {
  display: none;
}
`);