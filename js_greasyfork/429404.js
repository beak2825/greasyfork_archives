// ==UserScript==
// @name         OTM Agent SQL
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.agent.ActionParameterServlet*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.agent.ActionParameterServlet*
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.agent.ActionSelectionServlet*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.agent.ActionSelectionServlet*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429404/OTM%20Agent%20SQL.user.js
// @updateURL https://update.greasyfork.org/scripts/429404/OTM%20Agent%20SQL.meta.js
// ==/UserScript==

GM_addStyle(
    '#bodyDataContDiv{overflow-y:scroll!important}'+
    'textarea[name=sqlStatement]{font-family: monospace;resize: vertical;width:100%;height:300px;padding:5px!important}'+
    'textarea[name=selectSQLForRefresh]{font-family: monospace;resize: vertical;width:100%;padding:5px!important}'+
    'input[name=sqlDescription]{font-family: monospace;width:100%;}'
);

(function() {
    'use strict';
    document.querySelector('textarea[name=sqlStatement]').setAttribute('maxlength','3000');
    stringFields[0].size = 3000;
    // Your code here...
})();