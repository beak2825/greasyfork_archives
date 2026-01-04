// ==UserScript==
// @name         Gitlab code review mouse shortcut
// @namespace    http://kenngsimply.com/
// @version      0.1
// @description  Add mouse shortcut to Gitlab code review (NOTE: only for settings: show one file at a time)
// @author       Ken Ng
// @match        https://gitlab.com/*/merge_requests*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443781/Gitlab%20code%20review%20mouse%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/443781/Gitlab%20code%20review%20mouse%20shortcut.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    function eventFire(el, etype='click'){
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            const evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    function debounced(func, timeout = 300){
        let timer;
        return (...args) => {
            if (!timer) {
                func.apply(this, args);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
            }, timeout);
        };
    }

    function showPrevOrNextFile(ev) {
        if(ev.altKey) {
            if(ev.wheelDelta < 0) {
                // mouse wheel rotate downwards
                const item = document.querySelector('.page-item .next-page-item')
                eventFire(item)
                return
            }

            // mouse wheel rotate upwards
            const item = document.querySelector('.page-item .prev-page-item')
            eventFire(item)
        }
    }

    document.addEventListener("wheel", debounced(showPrevOrNextFile));
})();