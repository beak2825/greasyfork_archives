// ==UserScript==
// @name         Geizhals.de/.eu item property list beautifier
// @version      00010001
// @description  Beautify key value property list in Geizhals (geizhals.de/.eu) article descriptions.
// @match        https://geizhals.de/*
// @match        https://geizhals.eu/*
// @grant        none
// @namespace https://greasyfork.org/users/170996
// @downloadURL https://update.greasyfork.org/scripts/38537/Geizhalsdeeu%20item%20property%20list%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/38537/Geizhalsdeeu%20item%20property%20list%20beautifier.meta.js
// ==/UserScript==
// Inspired by https://greasyfork.org/en/scripts/28561-geizhals-de-item-property-list-beautifier
'use strict';
(function main() {
    var desc = document.getElementById('gh_proddesc');
    if (desc === null)
        return;
    desc.innerHTML = desc.innerHTML.split("<b>").join("[b]").split("</b>").join("[/b]");
    var dfc = desc.firstChild;
    var text = "";
    var items = dfc.textContent.split("•");
    for (var i in items)
    {
        items[i] = items[i].split("[b]").join("<b>").split("[/b]").join("</b>");
        var kvp = items[i].split(":", 2);
        kvp[1] = kvp[1].replace(/\s/g, "&nbsp;").split(",&nbsp;").join(", ");
        text += "<div style=\"padding-left: 10px; text-indent: -10px;\"><b>" + kvp[0] + "</b>:" + kvp[1] + "</div>";
    }

    dfc.textContent = "";
    var elChild = document.createElement('div');
    elChild.innerHTML = text;
    desc.insertBefore(elChild,desc.firstChild);
}());