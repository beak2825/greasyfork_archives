// ==UserScript==
// @name         jira-impl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove banner in impl-jira
// @author       You
// @license MIT
// @match        https://jira-implementation-modeling.app.imubit.in/*
// @icon         https://www.google.com/s2/favicons?domain=imubit.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436616/jira-impl.user.js
// @updateURL https://update.greasyfork.org/scripts/436616/jira-impl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    window.addEventListener('load', function() {
        let button = document.getElementsByClassName("aui-close-button")[0]
        if (button !== undefined) {
            triggerMouseEvent(button, "click")
        }
    }, false);
})();