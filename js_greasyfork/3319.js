// ==UserScript==
// @name       LinkedIn CC to PC
// @namespace  https://greasyfork.org/scripts/3319-linkedin-cc-to-pc
// @version    1.0
// @description  Mturk Crowdsource LinkedIn past worker count.
// @match      https://www.linkedin.com/vsearch/p?f_CC=*
// @copyright  2014+, Brian Wade
// @downloadURL https://update.greasyfork.org/scripts/3319/LinkedIn%20CC%20to%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/3319/LinkedIn%20CC%20to%20PC.meta.js
// ==/UserScript==

var url = document.location.href;
url = url.replace("CC", "PC");
window.location.href = url;
