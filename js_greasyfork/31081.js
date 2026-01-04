// ==UserScript==
// @name         shink?????
// @version      0.2
// @description  test
// @match        http://shink.in/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/15413
// @downloadURL https://update.greasyfork.org/scripts/31081/shink.user.js
// @updateURL https://update.greasyfork.org/scripts/31081/shink.meta.js
// ==/UserScript==

verifyCallback = function(e) {
    document.cookie = "csrf_sci=" + document.getElementsByName("csrf_ac")[0].value + "; path=/; domain=.shink.in";
    document.cookie = "ch=1; path=/; domain=.shink.in";
    document.getElementById("skip").submit();
};

if (~location.href.indexOf("shink.in/go/")) {
    var submit = function() {
        document.cookie = "csrf_sci=" + document.getElementsByName("csrf_ac")[0].value + "; path=/; domain=.shink.in";
        document.cookie = "ch=2; path=/; domain=.shink.in";
        document.getElementById("skip").submit();
    };
    setTimeout(submit, 1000);
}