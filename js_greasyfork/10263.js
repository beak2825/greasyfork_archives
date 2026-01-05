// ==UserScript==
// @name        Hide 'Edit' Buttons/Labels on Wikia websites
// @namespace   https://greasyfork.org/en/users/12018-zach-d
// @description Hides The 'Edit' Buttons on any Wikia Website
// @include     http://*.wikia.com/*
// @include     https://*.wikia.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10263/Hide%20%27Edit%27%20ButtonsLabels%20on%20Wikia%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/10263/Hide%20%27Edit%27%20ButtonsLabels%20on%20Wikia%20websites.meta.js
// ==/UserScript==

for (i = 0; i < document.getElementsByClassName("editsection").length; i++) {
    document.getElementsByClassName('editsection')[i].style.visibility = 'hidden';
}