// ==UserScript==
// @name         KoL beach combing twinkly sand
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes twinkly sand more visible by inverting color
// @author       PeKaJe
// @include      http://127.0.0.1:60080/choice.php
// @include      http://localhost:60080/choice.php
// @include      https://*.kingdomeofloathing.com/choice.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424353/KoL%20beach%20combing%20twinkly%20sand.user.js
// @updateURL https://update.greasyfork.org/scripts/424353/KoL%20beach%20combing%20twinkly%20sand.meta.js
// ==/UserScript==

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

(function() {
    'use strict';

    var result = xpath('//img[@title="rough sand with a twinkle" and contains(@src,"tsand")]');
    for(var i = 0; i < result.snapshotLength; i++)
    {
        var img = result.snapshotItem(i);
        img.style.filter = "invert(100%)";
    }
})();

