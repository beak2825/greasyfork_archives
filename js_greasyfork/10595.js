// ==UserScript==
// @name        Google Mail SignUp AutoFill
// @namespace   http://assouan.dinari.be/userscripts
// @description Remplis automatiquement les champs du formulaire d'inscription
// @icon        https://www.google.fr/images/google_favicon_128.png
// @author      Assouan
// @version     0.1.1
//
// @igupdateURL   https://userscripts.org/scripts/source/182719.meta.js
// @igdownloadURL https://userscripts.org/scripts/source/182719.user.js
//
// @include     *://accounts.google.com/SignUp*
//
// @run-at      document-end
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant       none
//
// @history     0.1.0 Test
// @downloadURL https://update.greasyfork.org/scripts/10595/Google%20Mail%20SignUp%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/10595/Google%20Mail%20SignUp%20AutoFill.meta.js
// ==/UserScript==

// JQuery No Conflict
    this.$ = this.jQuery = jQuery.noConflict(true);
/*
 $.noConflict();
 jQuery(document).ready(function($)
 {
 // $ = JQuery Temp
 });
 */

// Document DOM Ready
$(document).ready(function(){ main(); });

// Main function
function main()
{
    console.log('ready to go');
    alert('hello');
}
