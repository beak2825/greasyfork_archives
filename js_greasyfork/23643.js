// ==UserScript==
// @name        Block javascript alerts
// @description remove alerts
// @version     1.0
// @include http*://*
// @run-at      document-start
// @namespace https://greasyfork.org/users/10606
// @downloadURL https://update.greasyfork.org/scripts/23643/Block%20javascript%20alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/23643/Block%20javascript%20alerts.meta.js
// ==/UserScript==

addJS_Node (null, null, overrideSelectNativeJS_Functions);

function overrideSelectNativeJS_Functions () {
    window.alert = function alert (message) {
        console.log (message);
    }
}

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}