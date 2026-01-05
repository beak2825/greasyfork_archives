// ==UserScript==
// @name        Google search history compact
// @namespace   english
// @description compact - remove massive padding mid 2016
// @include     http*://*history.google.com/history*
// @version     1.7
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19557/Google%20search%20history%20compact.user.js
// @updateURL https://update.greasyfork.org/scripts/19557/Google%20search%20history%20compact.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header


var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML =  '             /*\n*//*\n*/.history-search-result-message {/*\n*/    color: #777 !important ; /*\n*/    margin-left: 32px !important ; /*\n*/    margin-top: 10px !important ; /*\n*/}/*\n*//*\n*/.history-card-date-holder {/*\n*/    margin: 0 24px !important ; /*\n*/    margin-top: 5px !important ; /*\n*/    padding: 0 !important ; /*\n*/}/*\n*//*\n*/.history-date-cluster {/*\n*/    padding-top: 5px !important ; /*\n*/}/*\n*/.layout-padding, .layout-padding-gt-sm, .layout-padding-gt-sm>*, .layout-padding-md, .layout-padding-md>*, .layout-padding>*, .layout-padding>.flex, .layout-padding>.flex-gt-sm, .layout-padding>.flex-md {/*\n*/    padding: 5px !important ; /*\n*/}/*\n*/.history-cluster {/*\n*/    padding: 5px !important ; /*\n*/    padding-right: 16px !important ; /*\n*/}/*\n*//*\n*//*\n*//*\n*/md-card-content .history-cluster-holder:first-child .history-cluster {/*\n*/    padding-top: 5px !important ; /*\n*/}/*\n*//*\n*/md-checkbox { /*\n*/    margin-bottom: 0 !important ;  /*\n*/}/*\n*//*\n*/md-card-content .history-cluster-holder:last-child .history-cluster {/*\n*/    padding-bottom: 5px !important ; /*\n*/}/*\n*/               ';





 