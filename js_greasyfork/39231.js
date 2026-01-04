// ==UserScript==
// @name                          anti168block
// @description:zh-TW  解168 IP封鎖
// @match                         http://no1.168abc.net*
// @run-at                         document-start
// @grant                           none
//@version        2    
// @version 0.0.1.20180306085950
// @namespace https://greasyfork.org/users/173570
// @description tw
// @downloadURL https://update.greasyfork.org/scripts/39231/anti168block.user.js
// @updateURL https://update.greasyfork.org/scripts/39231/anti168block.meta.js
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

// ==window.alert = function ( text ) { console.log( 'tried to alert:'+text); return true;}; 