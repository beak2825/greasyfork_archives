// ==UserScript==
// @name         wiktor Decide if a Video is about a Topic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide stuff, open link in new window
// @author       pyro
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.google.com/evaluation/endor/mturk*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28703/wiktor%20Decide%20if%20a%20Video%20is%20about%20a%20Topic.user.js
// @updateURL https://update.greasyfork.org/scripts/28703/wiktor%20Decide%20if%20a%20Video%20is%20about%20a%20Topic.meta.js
// ==/UserScript==

(function() {
    'use strict';
       $('#examples').nextUntil('h3:contains("Your task")').hide();
       $('input[value="PLAYS"]').click();
       let lnk = $('a:contains(" Original page ")').attr('href');
       var tmp = window.open(lnk, 'myWindow', 'width=600, height=700');
       document.onkeydown = function (k) {
            switch (k.keyCode) {
                case 13: tmp.close();
                         break;
            }
       };
})();