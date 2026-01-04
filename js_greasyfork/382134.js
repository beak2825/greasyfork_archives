// ==UserScript==
// @name         Kibana Dark Log Theme
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       Carlos Izquierdo
// @match        *://*/app/kibana*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/382134/Kibana%20Dark%20Log%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/382134/Kibana%20Dark%20Log%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.kbn-table {background-color: #000;}');
    GM_addStyle('.kbn-table th{color: #aaa;border-top: 0 !important;padding: 2px 8px !important;white-space: nowrap !important;}');
    GM_addStyle('.kbnDocTable__row td {color: #aaa;border-top: 0 !important;padding: 2px 8px !important;white-space: nowrap !important;}');
    GM_addStyle('.kbnDocTable__row td {color: #aaa;border-top: 0 !important;padding: 2px 8px !important;white-space: nowrap !important;}');
    GM_addStyle('.kbnDocTable__row td {font-size: 13px !important;}');
})();