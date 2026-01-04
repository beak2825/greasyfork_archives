// ==UserScript==
// @name           Gmail turn warning off
// @description    Gmail turn off unintended external reply warning
// @copyright      Brahim Hamdouni (c) 2017
// @author         Brahim Hamdouni (@hamdouni)
// @License        http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version 0.1
// @include https://mail.google.com/mail/*
// @run-at  document-end
// @namespace https://greasyfork.org/users/136286
// @downloadURL https://update.greasyfork.org/scripts/30959/Gmail%20turn%20warning%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/30959/Gmail%20turn%20warning%20off.meta.js
// ==/UserScript==

function startme() {
    var e = document.getElementsByName("untrusted_recipient");
    if(e.length > 0) {
        e[0].parentNode.style.display = "none";
    }
    t = setTimeout(function(){startme();}, 500);
}

(function() {
    'use strict';
    startme();
})();