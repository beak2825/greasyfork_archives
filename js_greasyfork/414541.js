// ==UserScript==
// @name         Pin Slack Favicon (show as no new messages)
// @namespace    https://benediktkoeppel.ch
// @version      0.1
// @author       Benedikt Köppel
// @description  Prevent Slack from changing the favicon. Always shows the favicon as if there are no unread messages.
// @match        https://app.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414541/Pin%20Slack%20Favicon%20%28show%20as%20no%20new%20messages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414541/Pin%20Slack%20Favicon%20%28show%20as%20no%20new%20messages%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const noUnreadMessagesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAzFBMVEVKFEyScpNLFU1cK16Mao1hMmOEX4WObZBWJFiQb5FZKFtNGE97VH1QHFJOGVBsQW5jNWV2TXdsQG1aKVxdLV9WI1dwRXGObI9pPGpTIFVPG1FfL2FSH1RVIld8VX1YJlpOGlBbK12RcZJMFk5iNGSBW4JmOGhgMGF3TniLaIx9Vn5lN2eFYYaNa45eLmB5UXtkN2ZUIVaGYodkNmVtQm9YJ1pRHVOHZImCXIN1THZgMWKDXoR9V392TniMaY1nOmmKZ4tpPWtXJVlvRHFqMc1IAAABCklEQVR4Xr3RxZLEIBSG0f9C3NPuPu7u/v7vNEE6dFdRM7s+i0sFvg0EO9X0/CQFeqfeCWwyh4gmCKgSwGJOlRCuWG5gMSKBrcTch03jvwD9Z9eFNcj4gcRj1EE2H5n7OaS93+lA7uXQPKo96kDt9aH4JnDUNS+xEEsLSmKCC0zFMoWY3RmUdBKSFCYDoHPmNCCCaw6DSTC2v8bnw+E9llHrCkBUHkvJbbz1hC4Tl+khWtDaHrQjGXAxH1CSEWwGzUJMH09ktKHkRPTCdBCEdfCKteItj6EDjDuHUvnBsKkO7EywIvr8+juofMNCnnTVUsCird6Gq99o80PkRFh6VcZgFafyYDDDbv0CWLgS6JWTyyIAAAAASUVORK5CYII=";

    // go through all mutations, if it is a LINK, set the href to the no-unread messages icon
    const callback = (mutationsList, observer) => {
        if (!mutationsList) { return; }

        mutationsList.forEach((mutation) => {
            if (!mutation.addedNodes) { return; }

            // each added node
            mutation.addedNodes.forEach((addedNode) => {
                if (addedNode.tagName !== "LINK") { return; }

                // overwrite href with static (no unread messages) icon
                console.log("Overwriting href of added LINK node to no-unread messages icon");
                addedNode.href = noUnreadMessagesIcon;

            });
        });
    }

    // watch head for changes
    const head = document.querySelector("head");
    const observer = new MutationObserver(callback);
    observer.observe(head, { childList: true });

})();