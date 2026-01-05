// ==UserScript==
// @name           KodieFiles Image Redirect
// @namespace      https://greasyfork.org/users/4390-seriousm
// @description    Links from a KodieFiles.nl gallery page directly to images.
// @match          http://www.kodiefiles.nl/*
// @version        0.4
// @downloadURL https://update.greasyfork.org/scripts/4047/KodieFiles%20Image%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/4047/KodieFiles%20Image%20Redirect.meta.js
// ==/UserScript==

// collect all links
var allLinks = document.getElementsByTagName('a')

// walk through the array

for(var i=0; i < allLinks.length; i++) {
if (allLinks[i].href.indexOf('images.kodiefiles.nl') > 0){
        allLinks[i].href = allLinks[i].href.replace('www.kodiefiles.nl','images.kodiefiles.nl');
	allLinks[i].href = allLinks[i].href.substr(0, allLinks[i].href.lastIndexOf('/') +1) + 'full' + allLinks[i].href.substr(allLinks[i].href.lastIndexOf('/'));
        allLinks[i].href = allLinks[i].href.replace('.html','.jpg');}
}

// that's it!