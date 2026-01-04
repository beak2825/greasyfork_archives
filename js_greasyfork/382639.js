// ==UserScript==
// @name          Pagerize Example
// @description   Mark up Example.com result pages with pager annotations
// @version       0.0.1
// @include       https://tlp.iasbaba.com/*
// @include       https://tlp.iasbaba.com/category/gs-1/indian-history/
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @require       https://cdn.jsdelivr.net/gh/chocolateboy/jquery-pagerizer@1.0.0/dist/pagerizer.min.js
// @namespace https://greasyfork.org/users/298468
// @downloadURL https://update.greasyfork.org/scripts/382639/Pagerize%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/382639/Pagerize%20Example.meta.js
// ==/UserScript==

$('a#btn active').addRel('prev')
$('a#btn').addRel('next')