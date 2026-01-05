// ==UserScript==
// @name         Etarg ad remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes etarg and traforet ad banners (use with Ublock Origin or Adblock Plus)
// @author       hant0508
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21178/Etarg%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/21178/Etarg%20ad%20remover.meta.js
// ==/UserScript==

var snapResults;
var tries = 0;

function rem()
{
    for (var i = snapResults1.snapshotLength - 1; i >= 0; i--)
    {
        var elm = snapResults1.snapshotItem(i);
        elm.parentNode.removeChild(elm);
    }

    for (var i = snapResults2.snapshotLength - 1; i >= 0; i--)
    {
        var elm = snapResults2.snapshotItem(i);
        elm.parentNode.removeChild(elm);
    }
}

function xpath()
{
    var regex1 = "/html/body//div[@onclick and ./table/tr/td/a[contains(@href, 'et-code.ru')]]";
    var regex2 = "/html/body//div[a[@class=\"traforet-br-logo\" and contains(@href, 'traforet.com')]]";
    snapResults1 = document.evaluate(regex1, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    snapResults2 = document.evaluate(regex2, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (tries <= 20)
    {
        window.setTimeout(xpath,100);
        if (snapResults1.snapshotLength || snapResults2.snapshotLength) tries = 0;
        tries++;
    }

    rem();
}

xpath();
