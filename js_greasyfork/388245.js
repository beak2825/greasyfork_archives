// ==UserScript==
// @name         ChatInputDC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically 'closing' the following characters in the chat input area: ", *, [, (, or {.
// @author       Isilin
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.eu/Main
// @grant        none
// @licence      https://www.gnu.org/licenses/gpl-3.0.fr.html
//
//  ChatInputDC
//  Copyright (C) 2019  Isilin
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// @downloadURL https://update.greasyfork.org/scripts/388245/ChatInputDC.user.js
// @updateURL https://update.greasyfork.org/scripts/388245/ChatInputDC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */

    var chatInput = $("#chatForm .text_chat")[0];
    var reg = /["\*\[\(\{]/; // Characters to look for.
    var map = { // mapping each opening element with its associated closing element.
        '*' : '*',
        '"' : '"',
        '[' : ']',
        '(' : ')',
        '{' : '}'
    };

    chatInput.addEventListener('keydown', (event) => {
        if (event.key.search(reg) != -1) {
            var selectedText = chatInput.selectionStart == chatInput.selectionEnd ? "" : chatInput.value.substring(chatInput.selectionStart, chatInput.selectionEnd);

            // we need to save these positions, as it changes while modifying the value.
            var oldStart = chatInput.selectionStart;
            var oldEnd = chatInput.selectionEnd;
            chatInput.value = chatInput.value.substring(0, chatInput.selectionStart) + event.key + selectedText + map[event.key] + chatInput.value.substring(chatInput.selectionEnd);
            chatInput.selectionStart = oldStart + 1;
            chatInput.selectionEnd = oldEnd + 1;

            // we prevent all subsequent behaviours.
            event.preventDefault();
            event.stopPropagation();
        }
    }, false);

})();
