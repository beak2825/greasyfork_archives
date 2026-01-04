// ==UserScript==
// @name         Shrug Inserter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Appends the shrug emoji to the currently-focused input. No jQuery.
// @author       Cezille07
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/39072/Shrug%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/39072/Shrug%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var shrug = '¯\\_(ツ)_/¯';
    var HOSTS = {
        twitter: 'twitter.com'
    };
    function inputAppend (el) {
        el.value = el.value + shrug;

    }
    function divAppend (el) {
        if (location.host === HOSTS.twitter || location.host === 'www.' + HOSTS.twitter) {
            // Remove the weird newline at the end
            el.innerText = el.innerText.slice(0, -1);
        }
        el.innerText = el.innerText + shrug;

        // The cursor is placed at the beginning after this, so put it at the end
        if (location.host === HOSTS.twitter || location.host === 'www.' + HOSTS.twitter) {
            placeCursorAtEnd(el);
        }
    }
    function placeCursorAtEnd (el) {
        // Set cursor to end
        // Solution from https://stackoverflow.com/a/3866442/2760194
        var s, range;
        if (window.getSelection) {
            // Good browsers
            s = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            s.removeAllRanges();
            s.addRange(range);
        } else if (window.selection) {
            // IE
            range = document.body.createTextRange();
            range.moveToElementText(el);
            range.collapse(false);
            range.select();
        }
    }

    window.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which || e.key.charCodeAt(0);
        var tag = e.target.tagName;
        console.debug('Input', key, tag);
        if (key === 191 && e.ctrlKey) {
            var isContentEditable = e.target.contentEditable === 'true';
            if (tag === 'DIV' && isContentEditable) {
                // Editable divs!
                divAppend(e.target);
            } else if (['TEXTAREA', 'INPUT'].indexOf(tag) !== -1) {
                // Regular
                inputAppend(e.target);
            } else {
                // Noop
            }
        }
    });
})();