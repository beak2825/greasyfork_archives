// ==UserScript==
// @name           custom Blogspot content warning auto-skip
// @include        http*.blogspot.*/*
// @include        *blogger.com/blogin.g?blogspotURL=*
// @description    Automatically skip Blogspot / Blogger content warning disclaimer
// @version        1.2
// @namespace https://greasyfork.org/users/8629
// @downloadURL https://update.greasyfork.org/scripts/15159/custom%20Blogspot%20content%20warning%20auto-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/15159/custom%20Blogspot%20content%20warning%20auto-skip.meta.js
// ==/UserScript==

// original code by https://greasyfork.org/en/users/8629-klein-m
//window.location.replace(document.getElementsByClassName('maia-button maia-button-primary')[0].href);


//my custom code

//<a class="maia-button maia-button-primary" href="http://slavemaker3.blogspot.de/?guestAuth=APpfv7eXKHT_c1foXDT4w7biMaP0qJ5rcRWNFrDrVv_Zq7Vqxdf5PuYX79nS8jTE6H8CEqd98pyl-GsxzKW1PXFoEMzU" target="_parent">I UNDERSTAND AND I WISH TO CONTINUE</a>

// you can use either of these includes
// include        /^https?://(.*\.)?blogspot\..*/.*$/
// include        http*.blogspot.*/*
// *blogger.com/blogin.g?blogspotURL=* is where you are prompted to click the content warning buttons. it's the originating url that does the content warning check
// in actuality, you don't need to include "http*.blogspot.*/*", but the original author added in blogspot anyways


// for this website, you do not need to wait until the page finishes loading to actually click the button
// blogspot does not use IDs, only classes
document.getElementsByClassName('maia-button maia-button-primary')[0].click();
// this works

//document.getElementsByClassName('maia-button maia-button-primary').click();
// this does not work


/*
javascript auto click button on page load
http://stackoverflow.com/questions/902713/how-do-i-automatically-click-a-link-with-javascript
http://stackoverflow.com/questions/21418915/click-a-button-element-on-page-load
*/