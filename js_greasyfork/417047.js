// ==UserScript==
// @name        KoL Trick-or-Fight
// @description Identify "fight" houses when Trick-or-Treating
// @namespace   http://pekaje.mooo.com
// @include     http://127.0.0.1:60080/choice.php?forceoption=0
// @include     http://localhost:60080/choice.php?forceoption=0
// @include     https://*.kingdomeofloathing.com/choice.php?forceoption=0
// @include     http://127.0.0.1:60080/choice.php?*whichhouse*
// @include     http://localhost:60080/choice.php?*whichhouse*
// @include     https://*.kingdomeofloathing.com/choice.php?*whichhouse*
// @grant       None
// @version 0.0.1.20201129132313
// @downloadURL https://update.greasyfork.org/scripts/417047/KoL%20Trick-or-Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/417047/KoL%20Trick-or-Fight.meta.js
// ==/UserScript==

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

var result = xpath('//img[@title="A House" and contains(@src,"_d")]');
for(var i = 0; i < result.snapshotLength; i++)
{
        var img = result.snapshotItem(i);
//        img.width = 102;
//        img.height = 102;
        img.border = 1;
        img.parentNode.parentNode.style.zIndex = "1";
}
