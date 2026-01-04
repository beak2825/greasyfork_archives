// ==UserScript==
// @name         Insert true new line/line break/blank line in an old interface Reddit post by Shift + Enter
// @author       NWP
// @description  Inserts a true new line/line break/blank line when pressing Shift + Enter in an old interface Reddit textarea. Check out this post to learn more: https://old.reddit.com/r/help/comments/1vjfm9/how_do_i_insert_a_blank_line_between_2_lines_of/
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        *://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500260/Insert%20true%20new%20lineline%20breakblank%20line%20in%20an%20old%20interface%20Reddit%20post%20by%20Shift%20%2B%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/500260/Insert%20true%20new%20lineline%20breakblank%20line%20in%20an%20old%20interface%20Reddit%20post%20by%20Shift%20%2B%20Enter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adjustScroll(activeElement) {
        let lineHeight = parseFloat(window.getComputedStyle(activeElement).lineHeight);
        activeElement.scrollTop += lineHeight * 4;
    }

    document.addEventListener('keydown', function(event) {
        let activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'TEXTAREA') {
            if (event.shiftKey && event.key === 'Enter') {
                event.preventDefault();
                let cursorPos = activeElement.selectionStart;

                document.execCommand('insertText', false, "\n\n&nbsp;\n\n");

                activeElement.selectionEnd = cursorPos + 10;

                adjustScroll(activeElement);
            } else if ((event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'Z')) {
                setTimeout(() => adjustScroll(activeElement), 0);
            } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || event.key === 'Y')) {
                setTimeout(() => adjustScroll(activeElement), 0);
            }
        }
    });
})();