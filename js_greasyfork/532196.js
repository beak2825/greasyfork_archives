// ==UserScript==
// @name         Mocoapp Textarea Fix
// @namespace    http://tampermonkey.net/
// @version      2025-04-08-03
// @description  Allows to add line breaks in the description textarea of the Moco booking tool
// @author       opctim
// @license      MIT
// @match        https://*.mocoapp.com/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI3LjguMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxvZ29fUkdCIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qxe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzM4QjVFQjt9Cgkuc3Qye2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO30KCS5zdDN7ZmlsbDpub25lO30KPC9zdHlsZT4KPGc+Cgk8Zz4KCQk8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIxNiIgY3k9IjE2IiByPSIxMS44Ii8+CgkJPGc+CgkJCTxnPgoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2LjEsOS45Yy0yLDAtMy45LDAuOC01LjMsMi4xYzAuMy0wLjEsMC42LTAuMSwwLjktMC4xYzEuNiwwLDMsMS4zLDMsM2MwLDEuNi0xLjMsMy0zLDMKCQkJCQljLTEuNSwwLTIuNy0xLjEtMi45LTIuNmMtMC4yLDAuNy0wLjQsMS41LTAuNCwyLjNjMCw0LjIsMy40LDcuNyw3LjcsNy43YzQuMiwwLDcuNy0zLjQsNy43LTcuN0MyMy44LDEzLjQsMjAuNCw5LjksMTYuMSw5Ljl6IgoJCQkJCS8+CgkJCQk8Zz4KCQkJCQk8Zz4KCQkJCQkJPHBhdGggZD0iTTE2LDMxLjljLTIuMiwwLTQuMy0wLjQtNi4yLTEuM2MtMS45LTAuOC0zLjYtMi01LTMuNGMtMS40LTEuNC0yLjYtMy4xLTMuNC01Yy0wLjgtMS45LTEuMy00LTEuMy02LjIKCQkJCQkJCWMwLTIuMiwwLjQtNC4zLDEuMy02LjJjMC44LTEuOSwyLTMuNiwzLjQtNWMxLjQtMS40LDMuMS0yLjYsNS0zLjRjMS45LTAuOCw0LTEuMyw2LjItMS4zYzIuMiwwLDQuMywwLjQsNi4yLDEuMwoJCQkJCQkJYzEuOSwwLjgsMy42LDIsNSwzLjRjMS40LDEuNCwyLjYsMy4xLDMuNCw1YzAuOCwxLjksMS4zLDQsMS4zLDYuMmMwLDIuMi0wLjQsNC4zLTEuMyw2LjJjLTAuOCwxLjktMiwzLjYtMy40LDUKCQkJCQkJCWMtMS40LDEuNC0zLjEsMi42LTUsMy40QzIwLjMsMzEuNSwxOC4yLDMxLjksMTYsMzEuOXogTTE2LDQuNmMtMS42LDAtMy4xLDAuMy00LjUsMC45Yy0xLjQsMC42LTIuNiwxLjQtMy42LDIuNAoJCQkJCQkJYy0xLDEtMS45LDIuMi0yLjUsMy42QzQuOCwxMyw0LjUsMTQuNCw0LjUsMTZjMCwxLjYsMC4zLDMuMSwwLjksNC41YzAuNiwxLjQsMS40LDIuNiwyLjUsMy42YzEsMSwyLjMsMS45LDMuNiwyLjQKCQkJCQkJCWMxLjQsMC42LDIuOSwwLjksNC41LDAuOWMxLjYsMCwzLTAuMyw0LjQtMC45YzEuNC0wLjYsMi42LTEuNCwzLjYtMi40YzEtMSwxLjgtMi4zLDIuNC0zLjZjMC42LTEuNCwwLjktMi45LDAuOS00LjUKCQkJCQkJCWMwLTEuNi0wLjMtMy0wLjktNC40Yy0wLjYtMS40LTEuNC0yLjYtMi40LTMuNmMtMS0xLTIuMi0xLjgtMy42LTIuNEMxOSw0LjksMTcuNiw0LjYsMTYsNC42eiIvPgoJCQkJCTwvZz4KCQkJCTwvZz4KCQkJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNi4xLDEyLjljLTAuNywwLTEuMywwLjEtMS45LDAuNGMwLjMsMC41LDAuNSwxLDAuNSwxLjZjMCwxLjYtMS4zLDMtMywzYy0wLjEsMC0wLjIsMC0wLjMsMAoJCQkJCWMwLjEsMi41LDIuMiw0LjUsNC43LDQuNWMyLjYsMCw0LjctMi4xLDQuNy00LjdTMTguNywxMi45LDE2LjEsMTIuOXoiLz4KCQkJPC9nPgoJCTwvZz4KCTwvZz4KCTxyZWN0IGNsYXNzPSJzdDMiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIvPgo8L2c+Cjwvc3ZnPgo=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532196/Mocoapp%20Textarea%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/532196/Mocoapp%20Textarea%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        const style = document.createElement('style');
        style.innerHTML = '.activity-row .third > .flex > div, .tst-timesheet-activity span[title] { white-space: pre-wrap }';
        document.head.appendChild(style);

        const attachListener = (textarea) => {
            // Avoid attaching the listener multiple times
            if (textarea._shiftEnterHandled) return;
            textarea._shiftEnterHandled = true;

            textarea.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' && event.shiftKey) {
                    event.stopPropagation();
                    console.log('Shift + Enter stopped on:', textarea);
                }
            });
        };

        // Attach to existing elements
        document.querySelectorAll('textarea[name="description"]').forEach(attachListener);

        // Observe DOM changes to catch newly added textareas
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    if (node.matches?.('textarea[name="description"]')) {
                        attachListener(node);
                    }

                    node.querySelectorAll?.('textarea[name="description"]').forEach(attachListener);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();