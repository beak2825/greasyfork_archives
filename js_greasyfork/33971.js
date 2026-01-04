// ==UserScript==
// @name         Add Link To IMDb Code
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Add Link To IMDb Code Like "tt1234567"; Better With Add IMDb Rating Script
// @author       Mumumi
// @include      *
// @exclude      *greasyfork.org*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33971/Add%20Link%20To%20IMDb%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/33971/Add%20Link%20To%20IMDb%20Code.meta.js
// ==/UserScript==

function GetByXPath(xpath){
    try {
        return document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    } catch (e) {
        console.log('ASget'+e);
    }
    return false;
}

//window.onload = function() {
    var imdbslist = ["IMDb", "IMDB", "imdb", "Imdb", "iMdb", "imDb", "imdB", "IMdb", "ImDb", "ImdB", "iMDb", "iMdB", "imDB", "IMdB", "ImDB", "iMDB"];
    for (var i in imdbslist) {
        try {
            var elem = GetByXPath('(//*[contains(.,"'+imdbslist[i]+'") and ./*[not(contains(.,"'+imdbslist[i]+'"))]])[last()]').snapshotItem(0);
            var html = elem.innerHTML;
            elem.innerHTML = html.replace(/([^/])(tt\d{7})/i,"$1<a href=\"http://www.imdb.com/title/$2/\">$2</a>");
        } catch (e) {
            console.log('ASget'+e);
        }
    }
//};