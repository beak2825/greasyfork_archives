// ==UserScript==
// @name         8chan Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  Changes the color scheme to be darker and easier on the eyes. Does not currently support catalog view and the home page.
// @author       Ale$tar
// @include      http://8ch.net*
// @include      https://8ch.net*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21394/8chan%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/21394/8chan%20Dark%20Mode.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body { background:#161616 !important; color:#eee !important; }');
addGlobalStyle('a { color:#cbcbcb !important; }');
addGlobalStyle('.reply, .reply .body, .reply .body-line, .reply .intro, .reply label { background:#323232 !important; color:#d5d5d5 !important;}');
addGlobalStyle('.reply { border-width:0 !important; }');
addGlobalStyle('.subject { color:#36c !important; }');
addGlobalStyle('.boardlist { background:#222 !important; }');
addGlobalStyle('form table tr th {  background:#533 !important; color:#ddd !important; }');
addGlobalStyle('.pages  {  background:#222 !important; color:#ddd !important; }');
addGlobalStyle('.description, .box  {  background:#444 !important; color:#dadada !important; padding:2px 12px; }');
addGlobalStyle('.box-title  {  background:#333 !important; color:#fafafa !important;}');
addGlobalStyle('table tbody tr:nth-of-type( even ) {  background:#222 !important; color:#fafafa !important;}');
addGlobalStyle('.tag-link {background:#333 !important; color:#eee !important;}');
addGlobalStyle('.thread:hover {background:#252525!important; color:#eee !important;}');

