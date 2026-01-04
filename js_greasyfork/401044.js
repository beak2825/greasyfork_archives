// ==UserScript==
// @name         VPS
// @namespace    VPS
// @version      0.3
// @description  VPS anhnt
// @author       You
// @include        /^https?://webtrade\.vps\.com\.vn/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401044/VPS.user.js
// @updateURL https://update.greasyfork.org/scripts/401044/VPS.meta.js
// ==/UserScript==


(function() {
    //var stype = '<style>';
    //stype += ' div#accountBar {   display: none; }  ';
    //stype += '<style>';
    //$("body").prepend(stype);

    // #tblStockList > tbody > tr:nth-child(2) > td tr

    //waitForKeyElements ( "#tblStockList > tbody > tr > td", calPercent );
    calPercent();
    //setTimeout(location.reload(), 30 * 60 * 1000);
    setTimeout(function(){ location.reload(); }, 30 * 60 * 1000);
})();

function calPercent () {
    $( "#tblStockList > tbody > tr " ).each(function( index ) {
        //$(this).css("border", "1px solid red");
        //console.log(current);
        var tc = $(this).find("td:eq(3)").text();
        var current = $(this).find("td:eq(10)").text();
        var $changeObj = $(this).find("td:eq(12)");

        if(current == "")
            current = tc;

        var changePercent = ((current - tc) / tc*100).toFixed(1);
        if(changePercent < 0.5 && changePercent > -0.5)
            changePercent = "";
        else
            changePercent = changePercent + "%"

        $changeObj.html(changePercent);


    });

    //jNode.click();
    //$("#priceBoardView > div > table > tbody > tr > td:nth-child(3) > #divStockTrans").appendTo("#priceBoardView > div > table > tbody > tr > td:nth-child(1)");

    setTimeout(calPercent, 5 * 1000);
}

// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
//function waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ) { var targetNodes, btargetsFound; if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt); else targetNodes = $(iframeSelector).contents () .find (selectorTxt); if (targetNodes && targetNodes.length > 0) { btargetsFound = true; targetNodes.each ( function () { var jThis = $(this); var alreadyFound = jThis.data ('alreadyFound') || false;  if (!alreadyFound) { var cancelFound = actionFunction (jThis); if (cancelFound) btargetsFound = false; else jThis.data ('alreadyFound', true); } } ); } else { btargetsFound = false; } var controlObj = waitForKeyElements.controlObj || {}; var controlKey = selectorTxt.replace (/[^\w]/g, "_"); var timeControl = controlObj [controlKey]; if (btargetsFound && bWaitOnce && timeControl) { clearInterval (timeControl); delete controlObj [controlKey]; } else { if ( ! timeControl) { timeControl = setInterval ( function () { waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ); }, 300 ); controlObj [controlKey] = timeControl; } } waitForKeyElements.controlObj = controlObj; }
