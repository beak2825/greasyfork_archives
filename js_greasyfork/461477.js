// ==UserScript==
// @name            Disable Auto Scrolling of SE Editor
// @namespace       https://stackexchange.com/users/3071401/
// @version         20230314
// @description     Disable annoying auto-scrolling when clicking on the preview area on SE
// @author          Pumbaa
// @run-at          document-idle
// @match           *://*.stackexchange.com/*
// @match           *://*.stackoverflow.com/*
// @match           *://*.superuser.com/*
// @match           *://*.serverfault.com/*
// @match           *://*.askubuntu.com/*
// @match           *://*.stackapps.com/*
// @match           *://*.mathoverflow.net/*
// @supportURL      https://stackapps.com/q/9670/103313
// @homepageURL     https://stackapps.com/q/9670/103313
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/461477/Disable%20Auto%20Scrolling%20of%20SE%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/461477/Disable%20Auto%20Scrolling%20of%20SE%20Editor.meta.js
// ==/UserScript==

// For details, check: https://meta.stackexchange.com/q/369946/294634
(async () => {
    if (!$('#wmd-preview').length) {
        return
    }
    for (let index = 0; index < 50; index++) {
        var elem = $("#wmd-preview")[0];
        var events = jQuery._data(elem, 'events')
        if (events && events.click && events.click.length - events.click.delegateCount == 1) {
            $("#wmd-preview").off("click");
            break
        }
        await new Promise(r => setTimeout(r, 100));
    }
})();
