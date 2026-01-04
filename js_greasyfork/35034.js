// ==UserScript==
// @name           Disable single key keyboard shortcuts
// @description    Stop websites from hijacking Firefox quick search key "/", and Escape key
//
// @run-at         document-start
// @include        *
// @grant          none
// @inject-into    auto
// @version        2019.12.31.1600
// @namespace      https://greasyfork.org/users/30
// @downloadURL https://update.greasyfork.org/scripts/35034/Disable%20single%20key%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/35034/Disable%20single%20key%20keyboard%20shortcuts.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

//https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
const keyValues = new Set(['/','Escape']); // Check on https://keycode.info/

const preventKey = function(e){
    if (keyValues.has(e.key)){
        e.stopImmediatePropagation();
    }
    //console.log('Event: type: %s, key: %s, has: %s', e.type, e.key, keyValues.has(e.key));
};

// Slash search on https://github.com/
document.addEventListener('keydown', preventKey, {passive: false, capture: true});
// Slash search on https://forum.manjaro.org/
// `capture` for Slash search on https://phabricator.services.mozilla.com/
document.addEventListener('keypress', preventKey, {passive: false, capture: true});
// I need to find test case
//document.addEventListener('keyup', preventKey);
