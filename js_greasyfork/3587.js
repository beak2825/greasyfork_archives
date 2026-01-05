// ==UserScript==
// @name        Reload on 502 or 504
// @description Wait 15 seconds and automatically reload the page in the event of a 502 or 504 timeout.
// @namespace   http://bibilotik.org/502/
// @include     http://bibliotik.org/*
// @include     https://bibliotik.org/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/3587/Reload%20on%20502%20or%20504.user.js
// @updateURL https://update.greasyfork.org/scripts/3587/Reload%20on%20502%20or%20504.meta.js
// ==/UserScript==

if (document.title=="502 Bad Gateway" || document.title=="504 Gateway Time-out") setTimeout("location.reload(true)", 15000);