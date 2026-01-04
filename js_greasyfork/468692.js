// ==UserScript==
// @name        Reddit invert all colours - old school version dark mode minimal 
// @namespace   english
// @description  Reddit invert all colours -old school version dark mode minimal 
// @include     http*://*reddit.com*
// @version     1.11
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468692/Reddit%20invert%20all%20colours%20-%20old%20school%20version%20dark%20mode%20minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/468692/Reddit%20invert%20all%20colours%20-%20old%20school%20version%20dark%20mode%20minimal.meta.js
// ==/UserScript==


// HIDE INSTALL APP SPLASH
//https://greasyfork.org/en/scripts/466915-reddit-mobile-app-nag-remover
// https://greasyfork.org/en/scripts/456374-hide-reddit-install-app-notifications

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '     @media only screen and (max-width: 1500px) {   .side{display:none;} } html{ filter: invert(1)hue-rotate(180deg); } img{max-width:25px;height:auto !important ;}  .arrow.up {     background-color: #ad0a0a;  }.arrow.upmod {     background-color: #0f4627;  }.arrow.down {     background-color: #c6a180;  } html body #header-img,.TopNav__promoButton,.premium-banner-outer,#redesign-beta-optin-btn,.premium-banner-outer,#siteTable div.promoted {display:none !important ;}      ';  



document.getElementsByTagName('head')[0].appendChild(style);




