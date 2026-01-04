// ==UserScript==
// @name        Scalyr bigger event dialogs
// @namespace   http://tech.picnic/gmscripts
// @version     1.0
// @description Increases the size of the scalyr event dialog
// @author      Luis Santos (luis.santos@teampicnic.com)
// @license     MIT
// @match       https://app.eu.scalyr.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/436955/Scalyr%20bigger%20event%20dialogs.user.js
// @updateURL https://update.greasyfork.org/scripts/436955/Scalyr%20bigger%20event%20dialogs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
        #scalyr .modal-content {
            max-width: 3840px;
            margin-bottom: 0px;
            max-height: 2160px
        }
        .SeeMoreDialog .Dialog__Body {
            max-height: 2160px
        }`);
})();//