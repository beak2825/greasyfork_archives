// ==UserScript==
// @name        preventDefault Patch
// @namespace   preventdefault-patch.user.js
// @match       *://*/*
// @grant       none
// @version     1.0
// @icon        https://vivaldi.com/wp-content/themes/vivaldicom-theme/img/browsers/vivaldi.webp
// @author      nafumofu
// @description Prevent the cancellation of important shortcut keys in the browser by web pages.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/507124/preventDefault%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/507124/preventDefault%20Patch.meta.js
// ==/UserScript==

const keys = [
    't',
    'n',
    'w',
    'Tab',
    'PageDown',
    'PageUp',
];

Event.prototype.preventDefault = new Proxy(Event.prototype.preventDefault, {
    apply(target, thisArg, argumentsList) {
        const event = thisArg;
        
        if (event.type === 'keydown') {
            if (keys.includes(event.key) && !event.altKey && event.ctrlKey && !event.metaKey) {
                return;
            }
            
            if (event.key === 'F4' && event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
                return;
            }
        }
        return Reflect.apply(target, thisArg, argumentsList);
    }
});
