// ==UserScript==
// @name        Old Reddit Icon to r/all
// @description Sub icon redirects to /r/all instead of /.
// @version     1.0
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @exclude     https://old.reddit.com/r/all/
// @match       https://old.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/542857/Old%20Reddit%20Icon%20to%20rall.user.js
// @updateURL https://update.greasyfork.org/scripts/542857/Old%20Reddit%20Icon%20to%20rall.meta.js
// ==/UserScript==

document.getElementById('header-img')  ?.setAttribute('href','/r/all/')
document.getElementById('header-img-a')?.setAttribute('href','/r/all/')