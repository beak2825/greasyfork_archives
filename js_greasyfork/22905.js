// ==UserScript==
// @name     Override styles for Toolbox
// @description:en  Override style for Toolbox
// @include  *
// @grant    GM_addStyle
// @version 0.0.1.20160904123528
// @namespace https://greasyfork.org/users/3920
// @description Override style for Toolbox
// @downloadURL https://update.greasyfork.org/scripts/22905/Override%20styles%20for%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/22905/Override%20styles%20for%20Toolbox.meta.js
// ==/UserScript==

var overrideStyle = "";
function includeGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function addGlobalStyle(css)
{
    overrideStyle += css + "\n";
}

addGlobalStyle("body{margin:0;padding:0}input[type='text']{background-color:#fff;border:1px solid #bcbcbc;box-sizing:border-box;outline:none;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;-webkit-transition:all ease-in-out .15s;-o-transition:all ease-in-out .15s;transition:all ease-in-out .15s}input[type='text']:focus{outline:none;border-color:#77c059;box-shadow:0 0 10px #77c059}input[type='submit']{height:45px;border-radius:5px;border:1px solid #77c059;color:#77c059;display:table;margin-top:4px;display:inline-block;background-color:#fff;outline:none;padding:10px 20px;-webkit-transition:color .3s linear,background-color .3s linear;transition:color .3s linear,background-color .3s linear}input[type='submit']:hover{background-color:#77c059;color:#fff}.frame700{max-width:668px}textarea{margin:10px 0 4px}textarea:focus{outline:none;border-color:#77c059;box-shadow:0 0 10px #77c059}");

includeGlobalStyle(overrideStyle);