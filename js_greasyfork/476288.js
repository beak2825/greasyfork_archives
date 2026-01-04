// ==UserScript==
// @name         Bypass Close Window
// @description  A debug tool to prevent closing window
// @icon         https://www2.microstrategy.com/favicon.ico
// @version      0.0.2
// @author       foomango
// @match        https://zippy-nexus-366120.uc.r.appspot.com/index.html*
// @match        https://*.trial.cloud.microstrategy.com/console/index.html*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476288/Bypass%20Close%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/476288/Bypass%20Close%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Loading bypass-close-window.js')
    const beforeUnloadListener = (event) => {
        event.preventDefault()

        // Only prevent page redirection fired by Taotao
        removeEventListener('beforeunload', beforeUnloadListener, {capture: true})
        /*eslint-disable */
        return event.returnValue = 'Are you sure you want to exit?'
        /*eslint-enable */
    }
    addEventListener('beforeunload', beforeUnloadListener, {capture: true});

    console.log('Finish loading bypass-close-window.js')
})();