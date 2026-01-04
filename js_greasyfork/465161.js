// ==UserScript==
// @name         ClarinNoPaywall
// @name:es      ClarinNoPaywall
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remover paywall de Clarin.com
// @description:es  Remover paywall de Clarin.com
// @author       Pechexxx
// @match        https://www.clarin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465161/ClarinNoPaywall.user.js
// @updateURL https://update.greasyfork.org/scripts/465161/ClarinNoPaywall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var qLinks = document.querySelectorAll ("a[href]");

    for (var J = qLinks.length - 1; J >= 0; --J) {
        var oldHref = qLinks[J].getAttribute ('href');

        var newHref;

        const http = oldHref.slice(0, 4);
        if(http === "http")
            newHref = "https://removepaywall.com/" + relPathToAbs(oldHref);
        else
            newHref = "https://removepaywall.com/https://www.clarin.com" + relPathToAbs(oldHref);

//        console.log (oldHref + "\n" + newHref);
        qLinks[J].setAttribute ('href', newHref);
    }
})();


function relPathToAbs (sRelPath) {
  var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
  for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
    nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
    sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
  }
  return sDir + sPath.substr(nStart);
}