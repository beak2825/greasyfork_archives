// ==UserScript==
// @name         Slack Cuddles
// @description  Why huddle when you can cuddle?
// @author       TheTridentGuy (http://thetridentguy.xyz)
// @license      GNU General Public License v3.0 or later; http://www.gnu.org/copyleft/gpl.html
// @namespace    thetridenguy.xyz
// @version      1.0
// @match        *://app.slack.com/client/*
// @match        about:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524439/Slack%20Cuddles.user.js
// @updateURL https://update.greasyfork.org/scripts/524439/Slack%20Cuddles.meta.js
// ==/UserScript==
/*
    Slack Cuddles, a userscript that replaces all instances of "huddle" with "cuddle" in Slack.
    Copyright (C) 2024 TheTridentGuy (http://thetridentguy.xyz)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
(function() {
    "use strict";
    console.log("Cuddle script injected sucessfully!");
    console.log(`Slack Cuddles Copyright (C) 2024 TheTridentGuy (http://thetridentguy.xyz)
    This program comes with ABSOLUTELY NO WARRANTY;
    This is free software, and you are welcome to redistribute it
    under certain conditions;`);
    var replacements = {
        "Huddle": "Cuddle",
        "huddle": "cuddle"
    };

    var ignore_classes = ["p-message_pane_input"];

    function has_ancestor_class(node, class_name) {
        while (node) {
            if (node.classList && node.classList.contains(class_name)) {
                return true;
            }
            node = node.parentElement;
        }
        return false;
    }

    function replace_text(node) {
        for(var class_name of ignore_classes) {
            if (has_ancestor_class(node, class_name)) {
                return;
            }
        }
        if (node.nodeType == Node.TEXT_NODE) {
            var text = node.textContent;
            for (var [target_word, replacement_word] of Object.entries(replacements)) {
                text = text.replace(target_word, replacement_word);
            }
            node.textContent = text;
        } else {
            node.childNodes.forEach(replace_text);
        }
    }
    
    var title = document.title;
    for (var [target_word, replacement_word] of Object.entries(replacements)) {
        title = title.replace(target_word, replacement_word);
    }

    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                replace_text(node);
            });
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
})();