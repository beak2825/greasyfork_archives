// ==UserScript==
// @name         NetFunnel BomB
// @version      0.3
// @author       You
// @description  NetFunnel BomB Script
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @namespace https://greasyfork.org/users/319515
// @downloadURL https://update.greasyfork.org/scripts/427340/NetFunnel%20BomB.user.js
// @updateURL https://update.greasyfork.org/scripts/427340/NetFunnel%20BomB.meta.js
// ==/UserScript==

function funnelBomb(){
    console.log("NetFunnel BomB Running...");
    var macro = setInterval(function() {
        NetFunnel.TS_BYPASS = true;
        NetFunnel.TS_NWAIT_BYPASS = true;
        NetFunnel.TS_MAX_NWAIT_COUNT = 0;
    }, 100);
    setTimeout(function() {
        clearInterval(macro);
    }, 300000);
}

if( NetFunnel !=null ) {
    funnelBomb();
    return;
}