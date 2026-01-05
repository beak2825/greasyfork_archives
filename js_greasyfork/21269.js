// ==UserScript==
// @name         CodeSchool Keyboard Shortcuts
// @namespace    http://jonas.ninja
// @version      1.1.0
// @description  Adds much-needed and much-requested keyboard shortcuts to go to the next section in a course.
// @author       @_jnblog
// @match        http*://campus.codeschool.com/courses/*/level/*/section/*
// @match        http*://campus.codeschool.com/courses/*/level/*/wrap-up
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21269/CodeSchool%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/21269/CodeSchool%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    document.body.onkeyup = function(e) {
        if (e.altKey && e.key === 'Enter') {
            var button = getContinueButton();

            if (button) {
                click(button);
            }
        }
    };

    function getContinueButton() {
        /// identify the continue button. If it cannot be identified, returns undefined.

        var buttons = document.getElementsByClassName('btn--continue');
        // on the wrap-up screen, there's a single 'btn--next' but no 'btn--continue's, so use that.
        if (buttons.length === 0) {
            buttons = document.getElementsByClassName('btn--next');
        }
        if (getTheVisibleButtons(buttons).length === 1) {
            return buttons[0];
        }
        return undefined;
    }

    function getTheVisibleButtons(list) {
        list = [].slice.call(list); // convert the 'HtmlCollection' to a list
        return list.filter(function(el) {
            return isVisible(el);
        });
    }

    function isVisible(el) {
        return (el.offsetHeight > 0 && el.offsetWidth > 0);
    }

    function click(el) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true);
        (el).dispatchEvent(evt);
    }
})();