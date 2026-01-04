// ==UserScript==
// @name        Fix wall comments "Delete" links
// @match       https://interpals.net/*
// @grant       none
// @version     1.0
// @author      Joey
// @license     MIT
// @description Un-break the ability to delete wall comments.
// @namespace https://greasyfork.org/users/1337890
// @downloadURL https://update.greasyfork.org/scripts/501428/Fix%20wall%20comments%20%22Delete%22%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/501428/Fix%20wall%20comments%20%22Delete%22%20links.meta.js
// ==/UserScript==

const deleteLinks = document.querySelectorAll('form[method="post"][action^="/app/wall/delete/"] a[href="javascript:"]')

for (const element of deleteLinks) element.removeAttribute('href')
