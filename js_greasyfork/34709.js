// ==UserScript==
// @id              alert-killer
// @name            Alert Killer
// @description     Overwrites alert()
// @include         *
// @run-at          document-start
// @grant           unsafeWindow
// @version 0.0.1.20180313123331
// @namespace https://greasyfork.org/users/11464
// @downloadURL https://update.greasyfork.org/scripts/34709/Alert%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/34709/Alert%20Killer.meta.js
// ==/UserScript==

unsafeWindow.alert = function alert(message){console.log(message);};
window.alert = function alert(message){console.log(message);};
Window.prototype.alert = function alert(message){console.log(message);};

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
