// ==UserScript==
// @name         Show Python 3 documentation by default
// @namespace    http://jeremejevs.com/
// @author       Olegs Jeremejevs
// @description  Automatically redirects Python 2 docs to Python 3.
// @match        *://docs.python.org/2*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/3400/Show%20Python%203%20documentation%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/3400/Show%20Python%203%20documentation%20by%20default.meta.js
// ==/UserScript==

var tmp = document.location.pathname.split('/');
tmp[1] = '3';
document.location.replace(document.location.protocol + '//' + document.location.host + tmp.join('/'));
