// ==UserScript==
// @name         Lichess study comment keybind
// @namespace    http://github.com/flugsio
// @version      0.2
// @description  Press the 'a' key to show comment field in study
// @author       flugsio
// @include        /\.lichess\.org\/study\/\w{8}$/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/21946/Lichess%20study%20comment%20keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/21946/Lichess%20study%20comment%20keybind.meta.js
// ==/UserScript==
// This script is in the public domain / CCO or whatever lol

// You can easily change this keybind,
// here is documentation for special keys and combos:
// https://craig.is/killing/mice
Mousetrap.bind('a', function() {
    var textarea = $('.study_comment_form textarea');
    if (0 < textarea.length) {
        textarea.focus();
    } else {
        window.jQuery('.study_buttons .comment').click();
    }
}, 'keyup');
// note that it triggers on keyup, so key is not added in the comment
// could also return false; but.. not sure if the best