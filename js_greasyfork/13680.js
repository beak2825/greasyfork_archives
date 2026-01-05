// ==UserScript==
// @name			Archive.org Wayback Machine - First Archive Version
// @namespace		https://greasyfork.org/en/users/10118-drhouse
// @version			2.0
// @description		Adds menu button that returns the earliest capture record of the current webpage, preventing error 404, empty or false captures.
// @include			*
// @grant			GM_registerMenuCommand
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author			drhouse
// @icon			https://archive.org/images/glogo.jpg
// @downloadURL https://update.greasyfork.org/scripts/13680/Archiveorg%20Wayback%20Machine%20-%20First%20Archive%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/13680/Archiveorg%20Wayback%20Machine%20-%20First%20Archive%20Version.meta.js
// ==/UserScript==

$(document).ready(function () {
    GM_registerMenuCommand("Archive First Capture", function() {
        if (location.href.toString().indexOf("https://web.archive.org/") == -1){
            window.location.href = 'https://web.archive.org/web/1000/' + location;
        }
    });
});

