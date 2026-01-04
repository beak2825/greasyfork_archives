// ==UserScript==
// @name         Verified Badges for Everyone!
// @namespace    http://twitter.com
// @version      0.1
// @description  Everyone on Twitter gets a verified badge!
// @author       ChlodAlejandro
// @match        *://twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39348/Verified%20Badges%20for%20Everyone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/39348/Verified%20Badges%20for%20Everyone%21.meta.js
// ==/UserScript==

function testSet() {
    'use strict';
    console.log("func call");
    var profileNames = document.getElementsByClassName("UserBadges");
    console.log("detected badges");
    for (var i = 0; i < profileNames.length; ++i) {
        var badgesElement = profileNames[i];
        console.log("trying change of " + i);
        console.log("may have changed");
        badgesElement.innerHTML = "<span class=\"Icon Icon--verified\"><span class=\"u-hiddenVisually\">Verified account</span></span>";
    }
}

(function() {
    'use strict';
    window.setInterval(function continuousSet() {
    console.log("cont call");
    var profileNames = document.getElementsByClassName("UserBadges");
    console.log("detected badges");
    for (var i = 0; i < profileNames.length; ++i) {
        var badgesElement = profileNames[i];
        console.log("trying change of " + i);
        console.log("may have changed");
        badgesElement.innerHTML = "<span class=\"Icon Icon--verified\"><span class=\"u-hiddenVisually\">Verified account</span></span>";
    }
}, 5000);
    console.log("TM init");
    var profileNames = document.getElementsByClassName("UserBadges");
    console.log("detected badges");
    for (var i = 0; i < profileNames.length; ++i) {
        var badgesElement = profileNames[i];
        console.log("trying change of " + i);
        console.log("may have changed");
        badgesElement.innerHTML = "<span class=\"Icon Icon--verified\"><span class=\"u-hiddenVisually\">Verified account</span></span>";
    }
})();

