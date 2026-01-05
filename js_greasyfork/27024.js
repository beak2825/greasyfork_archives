// ==UserScript==
// @name         Roll20 Character Switcher
// @namespace    de.idrinth
// @homepage     https://github.com/Idrinth/Roll20-Character-Switcher
// @version      1.2.0
// @description  Switches the chatting character to the one whose sheet or macro you clicked on
// @author       Idrinth, KingMarth
// @match        https://app.roll20.net/editor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27024/Roll20%20Character%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/27024/Roll20%20Character%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var charswitcher = function(event) {
        var e = window.event || event;
        if (e.target.tagName !== 'BUTTON') {
            return;
        }
        var id='';
        if(e.target.hasAttribute('type') && e.target.getAttribute('type') === 'roll') {
            var character = e.target;
            while (!character.hasAttribute('data-characterid')) {
                if(!character.parentNode) {
                    return;
                }
                character = character.parentNode;
            }
            id = 'character|' + character.getAttribute('data-characterid');
        } else if(e.target.hasAttribute('class') && e.target.getAttribute('class') === 'btn') {
            var macro = e.target;
            while (!macro.hasAttribute('data-macroid')) {
                if(!macro.parentNode) {
                    return;
                }
                macro = macro.parentNode;
            }
            id = 'character|' + (macro.getAttribute('data-macroid')).split('|')[0];
        }
        if(!id) {
            return;
        }
        var select = document.getElementById('speakingas');
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === id) {
                select.selectedIndex = i;
                return;
            }
        }
    };
    document.getElementsByTagName('body')[0].addEventListener('mousedown', charswitcher);
    document.getElementsByClassName('tokenactions')[0].addEventListener('mousedown', charswitcher);
})();
