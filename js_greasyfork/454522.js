// ==UserScript==
// @name         Hacker News - Highlight comments number
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Enlarges the comments number (anchor) and in case the comment amount is bigger than 100 or 300 highlight them with some trivial CSS
// @author       Riccardo Berto
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454522/Hacker%20News%20-%20Highlight%20comments%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/454522/Hacker%20News%20-%20Highlight%20comments%20number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let COMMENTS_CONSTANT = '&nbsp;comments';
    let anchors = document.getElementsByTagName('a');

    for (let i = 0; i < anchors.length; ++i) {
        if (!anchors[i].innerHTML.includes(COMMENTS_CONSTANT)) {
            continue;
        }

        let commentCount = parseInt(anchors[i].innerHTML.replace(COMMENTS_CONSTANT));

        if (isNaN(commentCount)) {
            continue;
        }

        anchors[i].style['font-size'] = '1.5em';

        let quantity = 'lighter';

        if (commentCount > 100 && commentCount < 300) {
            quantity = 'normal';
        } else if (commentCount > 300) {
            quantity = 'bold';
        }

        anchors[i].style['font-weight'] = quantity;
    }
})();