// ==UserScript==
// @namespace   https://openuserjs.org/users/MilionMax
// @name        Office365 font change
// @description Change the look of office 365
// @match       https://outlook.office.com/*
// @include     https://teams.microsoft.com/*
// @include     https://*.sharepoint.com/*
// @grant       GM_addStyle
// @run-at      document-load 
// @version     0.0.3
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437118/Office365%20font%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/437118/Office365%20font%20change.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var msiconclass = "";
var counter;
var seperator = ',';
  for (counter = 40; counter < 257; counter++) {
    msiconclass += '.css-' + counter + seperator;

  };

var fontIcon = ' { font-family: FabricMDL2Icons, controlIcons!important; }';
var fontText = ' { font-family: Manrope!important; }';
var selectIcon = 'ms-Icon, div#headerButtonsRegionId span';
var selectText = 'body, h1, h2, h3, span, .app-small-font, .ms-DetailsRow-cell, .ms-DetailsRow-cell .root-73';
var styleIcon = msiconclass + selectIcon + fontIcon ;
var styleText = selectText + fontText ;
    
/* text rule */
GM_addStyle('@import url(https://fonts.googleapis.com/css?family=Roboto|Nunito|Rubik|DM+Sans|Manrope&display=swap);');
addGlobalStyle(styleText);

/* icons rule */
addGlobalStyle(styleIcon);
