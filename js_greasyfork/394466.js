// ==UserScript==
// @name         Replace Bright Blue Font on D365FO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace Bright Blue Font on Dynamics 365 for Finance and Operations
// @author       TerenceCK
// @include      https://*.operations.dynamics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394466/Replace%20Bright%20Blue%20Font%20on%20D365FO.user.js
// @updateURL https://update.greasyfork.org/scripts/394466/Replace%20Bright%20Blue%20Font%20on%20D365FO.meta.js
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
                                                                                                     //change to below color
addGlobalStyle(' .listCell.supportsNavigation input{                                                 color:#00009f                !important;}');
addGlobalStyle(' .hidden{right:-1px;left:0}body{overflow:hidden;background-color:#f3f2f1}a{          color:#00009f                ; text-decoration:none}a:hover{color:#005362}a:active{color:#005362}.iOSApp); }');
addGlobalStyle(' .modulesFlyout-tile.tile[data-dyn-button-display=BackgroundImage].tile>.tile-text{  color:#00009f                !important;}');
addGlobalStyle(' .link-content-validLink{                                                            color:#00009f                !important;}');
addGlobalStyle(' .anchorButton{display:-webkit-flex;display:flex}.anchorButton{                      color:#00009f                }');
