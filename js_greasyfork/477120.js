// ==UserScript==
// @name        Torn: Unique Stars Highlighter
// @namespace   https://greasyfork.org/users/966900
// @description Highlights the content when a unique star is present in the pickpocketing section.
// @version     1.1
// @author      Lazerpent, noxwaste [1811486]
// @match       https://www.torn.com/loader.php?sid=crimes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/477120/Torn%3A%20Unique%20Stars%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/477120/Torn%3A%20Unique%20Stars%20Highlighter.meta.js
// ==/UserScript==

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
        ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth)) : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

(function() {
    'use strict';

    if (window.location.hash !== '#/pickpocketing') {
        return;
    }


    function updateBackgroundColor() {
        const stars = document.querySelectorAll('.uniqueStars___euiiR');
        let hasChildren = false;

        for (const star of stars) {
            if (star.children.length > 0 && elementIsVisibleInViewport(star, true)) {
                hasChildren = true;
                break;
            }
        }

        const targetElement = document.querySelector('.content.responsive-sidebar-container.logged-in');
        targetElement.style.backgroundColor = hasChildren ? 'red' : '';
    }

    setInterval(updateBackgroundColor, 500);

})();
