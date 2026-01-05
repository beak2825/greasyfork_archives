// ==UserScript==
//
//Displayable Name of your script 
// @name           JIRA UI
//
// brief description
// @description    Updates the JIRA UI to improve its usability
//
//URI (preferably your own site, so browser can avert naming collisions
// @namespace      https://greasyfork.org/users/3766-thangtran
//
// Your name, userscript userid link (optional)   
// @author         ThangTran (https://greasyfork.org/users/3766-thangtran)
//
// If you want to license out
// @license        GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
//
//(optional) may be used by browsers to display an about link
// @homepage       https://greasyfork.org/users/3766-thangtran
//
//Version Number
// @version        1.0.1
//
// Urls process this user script on
// @include        https://*.atlassian.net/*
//
// Add any library dependencies here, so they are loaded before your script is loaded.
//
// @require        http://code.jquery.com/jquery-2.1.1.min.js
//
// @history        1.0 first version
//
// @downloadURL https://update.greasyfork.org/scripts/3498/JIRA%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/3498/JIRA%20UI.meta.js
// ==/UserScript==

// extend JavaScript
// credit: http://stackoverflow.com/questions/280634/endswith-in-javascript
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

//And of course your code!!
$(document).ready(function ()
{
    $("head").append("<style>" + 
            ".ghx-inner { height: 5em !important; line-height: 1 !important; font-size: 0.8em; word-break: break-all }" +
            ".ghx-key-link { font-size: 0.8em }" +
        "</style>");
});