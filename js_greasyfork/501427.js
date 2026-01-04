// ==UserScript==
// @name        Fix friend requests "Ignore" link
// @match       https://interpals.net/app/friends*
// @grant       none
// @version     1.0
// @author      Joey
// @license     MIT
// @description Un-break the ability to ignore friends requests.
// @namespace https://greasyfork.org/users/1337890
// @downloadURL https://update.greasyfork.org/scripts/501427/Fix%20friend%20requests%20%22Ignore%22%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/501427/Fix%20friend%20requests%20%22Ignore%22%20link.meta.js
// ==/UserScript==

const ignoreLinks = document.querySelectorAll('form[method="post"][action="/app/friends/ignore"] a[href="javascript:"]')

for (let element of ignoreLinks) element.removeAttribute('href')
