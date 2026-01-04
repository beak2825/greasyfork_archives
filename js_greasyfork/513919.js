// ==UserScript==
// @name         NetflixNoGames
// @namespace    http://wimgodden.be/
// @version      1.5
// @description  Removes Game billboard at the top
// @author       Wim Godden <wim@cu.be>
// @match        https://netflix.com/*
// @match        https://www.netflix.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513919/NetflixNoGames.user.js
// @updateURL https://update.greasyfork.org/scripts/513919/NetflixNoGames.meta.js
// ==/UserScript==



function removeGameBillBoard() {
    $("div.billboard-row-games").parent().hide();
    $("div.mobile-games-row").hide();
}

function removeGameBillBoardTimer($) {
    setTimeout(function() {
        removeGameBillBoard();
    }, 2000); //Two seconds will elapse and Code will execute.
    setTimeout(function() {
        removeGameBillBoard();
    }, 500); //Two seconds will elapse and Code will execute.
}

if (typeof jQuery === "function") {
    $(function() {
        removeGameBillBoardTimer(jQuery);
    });
}
else {
    add_jQuery (removeSponsoredTimer, "1.7.2");
}

function add_jQuery (callbackFn, jqVersion) {
    var jqVersion   = jqVersion || "1.7.2";
    var D           = document;
    var targ        = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode  = D.createElement ('script');
    scriptNode.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode          = D.createElement ("script");
        scriptNode.textContent  =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}
