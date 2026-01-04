// ==UserScript==
// @name         rider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rider-page
// @license MIT
// @author       eagl
// @match        http://ops-rider.*.com/App/Builds*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438412/rider.user.js
// @updateURL https://update.greasyfork.org/scripts/438412/rider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".ant-table-tbody>tr>td {padding: 5px 8px;}");
    GM_addStyle(".ant-table-tbody>tr:nth-child(n+7){ background:#e9e9e9;}");
    console.log("dddddd");
})();

