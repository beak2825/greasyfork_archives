// ==UserScript==
// @name Disable Page Visibility API
// @version 1.1
// @description Disable Page Visibility API Script
// @match *://*/*
// @license MIT
// @grant none
// @run-at document-start
// @namespace https://greasyfork.org/users/956726
// @downloadURL https://update.greasyfork.org/scripts/545815/Disable%20Page%20Visibility%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/545815/Disable%20Page%20Visibility%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperties(document,{ 'hidden': {value: false} });
    Object.defineProperties(document,{ 'msHidden': {value: false} });
    Object.defineProperties(document,{ 'mozHidden': {value: false} });
    Object.defineProperties(document,{ 'webkitHidden': {value: false} });
    Object.defineProperties(document,{ 'visibilityState': {value: 'visible'} });
    Object.defineProperties(document,{ 'msVisibilityState': {value: 'visible'} });
    Object.defineProperties(document,{ 'mozVisibilityState': {value: 'visible'} });
    Object.defineProperties(document,{ 'webkitVisibilityState': {value: 'visible'} });

    const evt = e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    };
    document.addEventListener('visibilitychange', evt, true);
    document.addEventListener('msvisibilitychange', evt, true);
    document.addEventListener('mozvisibilitychange', evt, true);
    document.addEventListener('webkitvisibilitychange', evt, true);
    document.hasFocus = function () { return true; };
    window.addEventListener('blur', evt, true);
    window.addEventListener('focus', evt, true);

})();