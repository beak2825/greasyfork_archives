// ==UserScript==
// @name         OTM General
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=oraclecloud.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429405/OTM%20General.user.js
// @updateURL https://update.greasyfork.org/scripts/429405/OTM%20General.meta.js
// ==/UserScript==

GM_addStyle(
    '.sgScroll{padding-bottom: 15px; padding-right:10px}' +
    '.childPadding{margin-left: 26px}' +
    '.oc{text-indent: 0px !important}' +
    '.e{width: 0px !important}' +
    '.tree .node .agentActionsNodeLabelCSSclass{font-family: monospace !important;}' +
    'div .sgBodyCol,div .sgBodyCol > a{font-family:monospace!important}'
);
(function() {
    'use strict';
window.resizeTo(1000, 900);

    // Your code here...
})();