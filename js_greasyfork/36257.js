// ==UserScript==
// @name         RoughScroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables smooth scrolling on ALL websites
// @author       Hayden Schiff (oxguy3)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36257/RoughScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/36257/RoughScroll.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/*
HEY YOU! PRO-TIP:
If you want to save some bandwidth by not downloading smooth scrolling scripts, 
add the following rules to the custom filters list on your favorite ad blocking
browser extension:
/jquery.nicescroll*.js
/jquery.smoothscroll*.js
/jquery.smooth-scroll*.js
/jquery-smoothscroll*.js
/jquery-smooth-scroll*.js
/nicescroll*.js
/smoothscroll*.js
/smooth-scroll*.js
/mousewheel-smooth-scroll
/surbma-smooth-scroll
/dexp-smoothscroll.js
*/

// a million thanks to Arnavion for showing me this trick
// source: http://stackoverflow.com/a/35611393/992504
document.getElementsByTagName("body")[0].addEventListener("wheel",function (event)
{
    // exception for ACE Editor, JS text editor used by sites like GitHub
    if (event.target.classList.contains('ace_content')) {
        return;
    }
    
    event.stopPropagation();
}, true);

