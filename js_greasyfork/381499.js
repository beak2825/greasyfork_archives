// ==UserScript==
// @name     t66y
// @version  3
// @description       [去除反广告功能]
// @grant    none
// @match             *://t66y.com/*
// @match             *://www.t66y.com/*
// @namespace https://greasyfork.org/users/290148
// @downloadURL https://update.greasyfork.org/scripts/381499/t66y.user.js
// @updateURL https://update.greasyfork.org/scripts/381499/t66y.meta.js
// ==/UserScript==


function r2aeadS () {}

addJS_Node (r2aeadS);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}