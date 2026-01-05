// ==UserScript==
// @name         Auto Reload and close when finished
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.1
// @description  enter something useful
// @author       ikarma
// @include      https://www.mturk.com/mturk/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/11942/Auto%20Reload%20and%20close%20when%20finished.user.js
// @updateURL https://update.greasyfork.org/scripts/11942/Auto%20Reload%20and%20close%20when%20finished.meta.js
// ==/UserScript==


if ( $("td:contains('You have exceeded')").length ) {
    setTimeout(function () {
        location.reload();
    }, 1000);
}

if ( $("td:contains('Timer')").length ) {
    setTimeout(function () {
        location.reload();
    }, 1000);
}

if ( $("h6:contains('You have accepted the maximum number of HITs allowed.')").length ) {
    window.close();
}

if ( $("h6:contains('There are no more available HITs in this group. See more HITs available to you below.')").length ) {
    window.close();
}
