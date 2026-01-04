// ==UserScript==
// @name            GlobalTV: Anti-Anti-AdBlocker
// @namespace       https://github.com/Zren/
// @description     Misc
// @author          Zren
// @version         1
// @match           https://www.globaltv.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/35529/GlobalTV%3A%20Anti-Anti-AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/35529/GlobalTV%3A%20Anti-Anti-AdBlocker.meta.js
// ==/UserScript==

function waitFor(predicate, callback) {
    var tick = function(){
        var e = predicate();
        if (e) {
            callback(e);
        } else {
            setTimeout(tick, 100);
        }
    };
    tick();
}
window.waitFor = waitFor

waitFor(function(){
    return typeof videoPlayer !== "undefined" && videoPlayer
}, function(videoPlayer){
    videoPlayer.$window['abTest'] = { blockAdBlocker: false }
})
