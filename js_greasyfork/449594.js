// ==UserScript==
// @name         beaconcha.in => baconcha.in
// @namespace    http://invis.cloud/
// @version      0.1
// @license      MIT
// @description  replaces beacon with bacon and adds a bacon themed bg to all pages!
// @author       Invis
// @match        https://beaconcha.in/*
// @icon         https://cdn.discordapp.com/attachments/812745786638336021/1008717523337887835/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449594/beaconchain%20%3D%3E%20baconchain.user.js
// @updateURL https://update.greasyfork.org/scripts/449594/beaconchain%20%3D%3E%20baconchain.meta.js
// ==/UserScript==
function replace(search,replacement){
    var xpathResult = document.evaluate(
        "//*/text()",
        document,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );
    var results = [];
    // We store the result in an array because if the DOM mutates
    // during iteration, the iteration becomes invalid.
    let res;
    while(res = xpathResult.iterateNext()) {
        results.push(res);
    }
    results.forEach(function(res){
        res.textContent = res.textContent.replace(search,replacement);
    });
}
(function() {
    'use strict';
    document.body.style.backgroundImage = "url('https://cdn.discordapp.com/attachments/812745786638336021/1008716823975448586/baconchain_2.png')";
    replace(/Beacon/g,'Bacon');
    replace(/beacon/g,'bacon');
})();


