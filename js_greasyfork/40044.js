// ==UserScript==
// @name         DH2 Calculator "Refresh" Fix
// @namespace    Konrad Stüwe
// @version      v1
// @description  Fixes the Refresh button.
// @author       k0nr4d
// @match        https://tukib.org/diamondhunt/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40044/DH2%20Calculator%20%22Refresh%22%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/40044/DH2%20Calculator%20%22Refresh%22%20Fix.meta.js
// ==/UserScript==

function getData(user) {
    var site = "https://diamondhunt.co/stats/lookup.php?user="+user;
    console.log("Retrieving data from: "+site);
    $.get('https://tukib.org/diamondhunt/proxy.php', { site:site }, function(data){
        user_data = data;
        document.getElementById("mine-current").value = getValue("mining");
        document.getElementById("craft-current").value = getValue("crafting");
        document.getElementById("farm-current").value = getValue("farming");
        document.getElementById("brew-current").value = getValue("brewing");
        document.getElementById("cook-current").value = getValue("cooking");
        update_all_values_ult();
        user_data = "";
   }, 'html');
}

addJS_Node (getData);

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