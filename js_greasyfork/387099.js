// ==UserScript==
// @name         cnbeta better
// @namespace    http://www.netroby.com/
// @version      0.6
// @description  make cnbeta better
// @author       www.netroby.com
// @match        https://m.cnbeta.com.tw/*
// @grant        GM_addStyle 
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/387099/cnbeta%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/387099/cnbeta%20better.meta.js
// ==/UserScript==
// 

(function() {
GM_addStyle(`
.container {margin: 0 auto; max-width:960px;  padding: 24px 48px;    background: #FCFCFC;  } 
body,html {   background-color: #345 !important; font-size:16px;  }
p,div {font-size:16px}
div.cbv,div.cbimage-fixed {display:none}
`);
})();