// ==UserScript==
// @name         Youtube auto pause at end for playlist/watch later
// @version      0.1
// @author         Tianshen
// @description    Pause at end when playing playlist
// @include        *.youtube.*list*
// @run-at         document-idle
// @grant       GM_setValue
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/39600
// @downloadURL https://update.greasyfork.org/scripts/372199/Youtube%20auto%20pause%20at%20end%20for%20playlistwatch%20later.user.js
// @updateURL https://update.greasyfork.org/scripts/372199/Youtube%20auto%20pause%20at%20end%20for%20playlistwatch%20later.meta.js
// ==/UserScript==
var doc = document;
function injectScript(str, src) {
    var script = doc.createElement("script");
    if (str) script.textContent = str;
    if (src) script.src = src;
    doc.body.appendChild(script);
    if (!src) doc.body.removeChild(script);
}

function pauseatend() {
    injectScript("function f() {\
                        var vid = document.getElementById('c4-player') || document.getElementById('movie_player');\
                        if (vid != null){\
                            var dur = vid.getDuration();\
                            if ((dur - vid.getCurrentTime() <= 1) && dur > 0) {\
                                vid.pauseVideo();\
                            }\
                        }\
                    }\
                    window.setInterval(f, 1000);\
                ");
}
//==================================================================
//main
pauseatend();