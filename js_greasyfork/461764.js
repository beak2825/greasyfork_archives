// ==UserScript==
// @name        Redirect flathub to flathub beta
// @namespace   https://github.com/tazihad
// @version     1.00
// @match       *://flathub.org/*
// @run-at      document-start
// @grant       none
// @description redirects flathub to flathub beta.
// @author       zihad
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/461764/Redirect%20flathub%20to%20flathub%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/461764/Redirect%20flathub%20to%20flathub%20beta.meta.js
// ==/UserScript==

var newDomain   = "beta.flathub.org";
var newURL      = location.protocol + "//"
                + newDomain                 //-- location.host
                + location.pathname
                + location.search
                + location.hash
                ;
/*-- replace() puts the good page in the history instead of the
    bad page.
*/
location.replace (newURL);