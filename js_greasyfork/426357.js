// ==UserScript==
// @name        Cook'd and Bomb'd Hide Tags
// @description Hides tags under topic pages
// @namespace   https://github.com/insin/greasemonkey/
// @version     1
// @match       https://www.cookdandbombd.co.uk/forums/index.php/topic*
// @downloadURL https://update.greasyfork.org/scripts/426357/Cook%27d%20and%20Bomb%27d%20Hide%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/426357/Cook%27d%20and%20Bomb%27d%20Hide%20Tags.meta.js
// ==/UserScript==

let $style = document.createElement('style')
$style.textContent = '#main_content_section .pagesection + .largepadding { display: none; }'
document.head.appendChild($style)