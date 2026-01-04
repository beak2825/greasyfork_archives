// ==UserScript==
// @name              WideChatGPT
// @description       Enhances the ChatGPT interface for better usability on large screens.
// @version           1.0
// @author            Modified by Christophe Gevrey
// @namespace         https://github.com/gevrey/WideChatGPT/
// @supportURL        https://github.com/gevrey/WideChatGPT/
// @license           GPL-2.0-only
// @match             *://chat.openai.com/*
// @grant             GM_addStyle
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/486577/WideChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486577/WideChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .largescreen .flex.text-base {
            max-width: unset;
        }
        @media (min-width:1024px) {
            .largescreen .flex.text-base .lg\\:w-\\[calc\\(100\\%-115px\\)\\] {
                width: calc(100% - 72px);
            }
            .largescreen form.stretch {
                max-width: 85%;
            }
        }
        .largescreen img {
            width: 653px;
        }
    `);

    const bodyClassList = document.body.classList;
    if (!bodyClassList.contains('largescreen')) {
        bodyClassList.add('largescreen');
    }
})();
