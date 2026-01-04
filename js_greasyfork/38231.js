// ==UserScript==
// @name         WikiaAdblockFix
// @version      0.1
// @description  Block eval to block anti-adblock on wikia
// @author       coder65535
// @run-at       document-start
// @match        http://*.wikia.com/*
// @grant        none
// @namespace https://greasyfork.org/users/4284
// @downloadURL https://update.greasyfork.org/scripts/38231/WikiaAdblockFix.user.js
// @updateURL https://update.greasyfork.org/scripts/38231/WikiaAdblockFix.meta.js
// ==/UserScript==

(function() {

eval = ()=>{
    // Do absolutely nothing. Eval's phonetic name is quite accurate.
};


addJS_Node (eval);

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
})();