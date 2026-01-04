// ==UserScript==
// @name         Docs Redirect
// @version      0.2
// @description  Asks to switch to user 1 when using Google Docs with user 0
// @author       pooroll
// @include https://docs.google.com/document/u/*
// @namespace https://greasyfork.org/users/157849
// @downloadURL https://update.greasyfork.org/scripts/34728/Docs%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/34728/Docs%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener ("load", LocalMain, false);

function LocalMain () {
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 13);
        if (path1 === "/document/u/0"){
            //var pathle = path0.length - 1;
            //var path2 = path0.substring(15, pathle);
            //alert(path2);
            var r = confirm("Redirect to Account 2?");
            if (r === true) {
                window.location.replace("https://docs.google.com/document/u/1/");
            } else {
            }
        }
    }, 0);
}

    // Your code here...
})();