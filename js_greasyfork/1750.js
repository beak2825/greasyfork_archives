// ==UserScript==
// @name        Bugzilla: Highlight Private Bugs
// @namespace   t7ko
// @description Highlight private bugs in Bugzilla based on hard-coded group id.
// @include     https://dev.cardaccess-inc.com/bugzilla/*
// @version     2
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/1750/Bugzilla%3A%20Highlight%20Private%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/1750/Bugzilla%3A%20Highlight%20Private%20Bugs.meta.js
// ==/UserScript==

var const_color_internal = '#C2DCF2';
var const_color_external = '#FFCBBA';

if (0 == document.URL.indexOf('https://dev.cardaccess-inc.com/bugzilla/show_bug.cgi')) {
    // Highlight public bugs with pinkish color.
    var color = ( document.getElementById("group_17").checked
                ? const_color_internal
                : const_color_external );
    document.body.style.background = color;
    document.getElementById("group_17").nextElementSibling.style.background = color;
} else if (0 == document.URL.indexOf('https://dev.cardaccess-inc.com/bugzilla/buglist.cgi')) {
    GM_registerMenuCommand("Highlight public vs private bugs", highlight);
}

function highlight(e) {
    var ids = document.getElementsByClassName('bz_id_column');
    var id_idx;
    for (id_idx=0; id_idx<ids.length; id_idx++) {
        var id = ids[id_idx];
        var bug_id = id.firstElementChild.firstChild.nodeValue;
        var url = 'https://dev.cardaccess-inc.com/bugzilla/show_bug.cgi?ctype=xml&id=' + bug_id;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseXML;
        var groups = xmlDoc.getElementsByTagName('group');
        var i;
        var internal = false;
        for (i=0; i<groups.length; i++) {
            if (groups[i].id == 17) {
                internal = true;
            }
        }
        id.firstElementChild.style.background = ( internal
                                                 ? const_color_internal
                                                 : const_color_external );
    }
}