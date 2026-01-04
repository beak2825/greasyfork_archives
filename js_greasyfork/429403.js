// ==UserScript==
// @name         Otm Saved Query SQL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Otm Saved Query
// @author       You
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.finder.WindowOpenFramesetServlet*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.finder.WindowOpenFramesetServlet*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429403/Otm%20Saved%20Query%20SQL.user.js
// @updateURL https://update.greasyfork.org/scripts/429403/Otm%20Saved%20Query%20SQL.meta.js
// ==/UserScript==

GM_addStyle(
    'textarea[name=\'saved_query/sql_check_one\']{font-family: monospace;resize: vertical;width:100%;height:300px}'+
    'textarea[name=saved_query/sql_find_all]{font-family: monospace;resize: vertical;width:100%;height:300px}' +
    '.agentActionsNodeLabelCSSclass{font-family: monospace!important;font-size: medium!important;}'
);

(function() {
    'use strict';
window.resizeTo(1000, 900);
    // Your code here...
})();