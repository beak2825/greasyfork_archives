// ==UserScript==
// @name         Set Pipedrive minimum stage width + RTL
// @namespace    http://www.sumit.co.il/
// @version      0.4
// @description  Set minimum pipedrive stage width to 200px (default is 0px), and RTLs all deals.
// @author       Effy Teva
// @include      https://*.pipedrive.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448043/Set%20Pipedrive%20minimum%20stage%20width%20%2B%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/448043/Set%20Pipedrive%20minimum%20stage%20width%20%2B%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AddGlobalStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    AddGlobalStyle(`
    * {
        font-family: Tahoma !important;
    }

    #pipeline-view-board-container > div > div {
        min-width:200px !important;
        direction: rtl !important;
    }

    .descriptionHead {
        direction: rtl !important;
        text-align: left !important;
    }

    input[name=title],
    .bodyEditor,
    .labelWrap,
    .valueWrap input,
    .valueWrap textarea,
    .cui5-modal__content input,
    .contactName {
        direction: rtl !important;
    }

    .activityWrapper {
        display: inline-block !important;
        direction: rtl !important;
    }

    .foldableText,
    .activity h3 {
        direction: rtl !important;
        text-align: right !important;
    }
    `);
})();