// ==UserScript==
// @name         LINDA AUTO LINK OPEN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.mturkcontent.com/dynamic/hit?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376463/LINDA%20AUTO%20LINK%20OPEN.user.js
// @updateURL https://update.greasyfork.org/scripts/376463/LINDA%20AUTO%20LINK%20OPEN.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.innerHTML = document.body.innerHTML.replace('class="dont-break-out"', 'class="dont-break-out" id="visit"');
        	window.setTimeout(function(){
        var urllink = document.getElementById("visit").innerHTML;
                //var urllink = document.getElementById("visit").getAttribute('src');

        var newTab = window.open(urllink, '_blank');
                //var newTab = window.open('https://href.li/?'+ urllink, '_blank');
                //https://url.rw/? http://nullrefer.com/?
    }, 200);
document.getElementById("email").focus();
    // Your code here...
})();