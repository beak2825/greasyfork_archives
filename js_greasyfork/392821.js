// ==UserScript==
// @name            Hide suspended apps
// @namespace       google.com
// @version         1.0
// @description     Hide suspended  apps from Google Play dash
// @author Danny J Kendall
// @include         https://play.google.com/apps/publish/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/392821/Hide%20suspended%20apps.user.js
// @updateURL https://update.greasyfork.org/scripts/392821/Hide%20suspended%20apps.meta.js
// ==/UserScript==

function GM_main () {
setInterval(function(){ 
        $('tbody > tr > td:contains("Suspended")').parent().remove();

}, 100);
}

addJS_Node (null, null, GM_main);

//-- This is a standard-ish utility function:
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