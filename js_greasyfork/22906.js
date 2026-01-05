// ==UserScript==
// @name     Override styles for Toolbox[main]
// @description:en  Override style for Toolbox[main]
// @include  *
// @grant    GM_addStyle
// @version 0.0.1.20160904124022
// @namespace https://greasyfork.org/users/3920
// @description Override style for Toolbox[main]
// @downloadURL https://update.greasyfork.org/scripts/22906/Override%20styles%20for%20Toolbox%5Bmain%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/22906/Override%20styles%20for%20Toolbox%5Bmain%5D.meta.js
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

addGlobalStyle("#draggable{width:150px;height:150px;padding:.5em}.ui-draggable,.ui-droppable{background-position:top}.layer{margin-bottom:10px;border-radius:5px;border:1px solid #a0d468!important;background-color:#fff;padding:12px 15px;box-sizing:border-box}.layer:hover{cursor:move}.menubar{display:inline-block;position:fixed;z-index:2;top:0;left:0;-webkit-border-bottom-right-radius:10px;border-right:1px solid #77c059;border-bottom:1px solid #77c059}ul{display:block;background:#f9f9f9;list-style-type:none;padding-left:0;margin:0;-webkit-margin-before:.3em;-webkit-margin-after:.5em;-webkit-margin-start:0;-webkit-margin-end:0}ul > li{color:#77c059;background-color:#fff;transition:color .3s linear,background-color .3s linear;display:list-item;text-align:-webkit-match-parent}ul > li:hover{background-color:#77c059;color:#fff}.selectbutton{padding:5px;width:100%;cursor:pointer}");

includeGlobalStyle(overrideStyle);