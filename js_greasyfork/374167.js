// ==UserScript==
// @name         Medium cleanup
// @namespace    https://avaglir.com
// @version      0.1
// @description  Cut out obnoxious Medium UI
// @author       Nathan Perry <avaglir@gmail.com>
// @match        https://medium.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374167/Medium%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/374167/Medium%20cleanup.meta.js
// ==/UserScript==

/** Copyright 2018 Nathan Perry.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    const hideElems = (selector) => {
        const elems = Array.from(document.querySelectorAll(selector));
        elems.forEach(elem => elem.style.display = 'none');
    };

    const nthParent = (elt, n) => {
        if (n === 0) return elt;
        return nthParent(elt.parentElement, n - 1);
    };

    const removeAll = () => {
        hideElems('.u-fixed.js-stickyFooter');  // footer
        hideElems('.js-postShareWidget');  // socials sidebar

        // login/follow buttons
        hideElems('[data-action="sign-in-prompt"]');
        hideElems('[data-action="sign-up-prompt"]');

        // reading time and divider
        hideElems('.readingTime');
        hideElems('.middotDivider.u-fontSize12');

        // all the garbage at the bottom of the page (suggested articles, comments, share bar)
        hideElems('.js-postFooterPlacements');
        hideElems('.js-responsesWrapper');
        hideElems('footer');

        // search icon in top bar
        const searchIcon = document.querySelector('.svgIcon--search');
        if (searchIcon) {
            nthParent(searchIcon, 3).style.setProperty('display', 'none', 'important');
        }
    };

    document.addEventListener('ready', removeAll);
    setInterval(removeAll, 50);
})();
