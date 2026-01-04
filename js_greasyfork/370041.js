// ==UserScript==
// @name         Insert message template
// @namespace    http://tampermonkey.net/
// @version      0.1.4.2
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/add/?_to_field=id&_popup=1*
// @exclude      http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/*&changeMess*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/add/?_to_field=id&_popup=1*
// @exclude      http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/*&changeMess*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370041/Insert%20message%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/370041/Insert%20message%20template.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lang = 'en';
    if (/messagelang=(\w+)/.exec(document.location.href) != null) {
        lang = /messagelang=(\w+)/.exec(document.location.href)[1];
    }

    if (lang == "ru"){
        document.querySelectorAll("textarea#id_body")[0].value = "Здравствуйте.\n\n\n\nС уважением,\nИван / Команда поддержки пользователей.";
        setCaretToPos(document.getElementById("id_body"), 15);
    }
    else {
        document.querySelectorAll("textarea#id_body")[0].value = "Hello.\n\n\n\nBest regards,\nJ / Support Team";
        setCaretToPos(document.getElementById("id_body"), 8);
    }

    //funcs to set cursor in the custom position
    function setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    function setCaretToPos (input, pos) {
        setSelectionRange(input, pos, pos);
    }

})();