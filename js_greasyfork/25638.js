// ==UserScript==
// @name            geniuschatremover
// @description     small script to remove chat on page load
// @description:en  small script to remove chat on page load
// @version         3
// @author          nnmrts
// @match           http://genius.com/*
// @match           https://genius.com/*
// @grant           none
// @require         http://code.jquery.com/jquery-3.1.1.min.js
// @namespace https://greasyfork.org/users/86510
// @downloadURL https://update.greasyfork.org/scripts/25638/geniuschatremover.user.js
// @updateURL https://update.greasyfork.org/scripts/25638/geniuschatremover.meta.js
// ==/UserScript==

(function(){
$( document ).ready( function () {
    if ($("chat")[0]) {
        $("chat")[0].parentNode.removeChild($("chat")[0]);
    }
    if ($("#chat")[0]) {
        $("#chat")[0].parentNode.removeChild($("#chat")[0]);
    }
    if ($(".chat")[0]) {
        $(".chat")[0].parentNode.removeChild($(".chat")[0]);
    }
});
}());