// ==UserScript==
// @name        UFindTitleFixer
// @namespace   uftf
// @description Displays name of lecture/whatever in the title
// @include     https://ufind.univie.ac.at/*/course.html*
// @include     https://ufind.univie.ac.at/*/person.html*
// @include     https://ufind.univie.ac.at/*/pvz_sub.html*  
// @include     https://ufind.univie.ac.at/*/vvz_sub.html*  
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @author      oerpli
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23439/UFindTitleFixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23439/UFindTitleFixer.meta.js
// ==/UserScript==

waitForKeyElements(".when", setTitleSubject);
waitForKeyElements(".name.full", function(){setTitle(".name.full");});
waitForKeyElements(".usse-id-pvz h1.name span.label", function(){setTitle(".usse-id-pvz h1.name span.label");});
waitForKeyElements(".usse-id-vvz h1",function(){setTitle(".usse-id-vvz h1");});

function setTitleSubject() {
    var year = $(".when").eq(0).html();
    var name = $(".what").eq(0).html();
    var type = $(".type").eq(0).html();
    $(document).prop("title", type + " " + name + " (" + year + ")");
}

function setTitle(sel) {
    var name = $(sel).eq(0).html();
    $(document).prop("title",name);
}

