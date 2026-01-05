// ==UserScript==
// @name          Disable.DoubleClick
// @namespace 	  Disabled
// @description 禁用双击事件
// @include  	    http://www.wise99.com/*
// @run-at        document-start
// @version 	    1.0
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/11178/DisableDoubleClick.user.js
// @updateURL https://update.greasyfork.org/scripts/11178/DisableDoubleClick.meta.js
// ==/UserScript==
//var objElement = document.evaluate('//a[@onclick]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
document.addEventListener('dblclick', function (event) {
  //    gBrowser.selectedTab = aTab;
  //    gBrowser.removeTab(aTab);
  event.stopPropagation();
  //    event.preventDefault();
}, true);
