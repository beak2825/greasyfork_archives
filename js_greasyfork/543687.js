// ==UserScript==
// @name         dragfix
// @version      1.0
// @description  Fixes the canvas being dragged sometimes when you shoot while moving your mouse
// @author       Rayan223
// @match        https://gats.io
// @icon         none
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/825882
// @downloadURL https://update.greasyfork.org/scripts/543687/dragfix.user.js
// @updateURL https://update.greasyfork.org/scripts/543687/dragfix.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('canvas').forEach(c => {
        c.style.userSelect = 'none';
        c.style.webkitUserDrag = 'none';
        c.setAttribute('draggable', 'false');
        c.addEventListener('dragstart', e => e.preventDefault());
    });
})();