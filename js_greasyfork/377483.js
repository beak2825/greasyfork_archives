// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Phil Ruppert
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377483/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/377483/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("LS HUI 2");
})();

function vehicleMarkerAdd(e)
{
    console.log("VEHICLEMADD");
    console.log(e);
}

addJS_Node(vehicleMarkerAdd);

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