// ==UserScript==
// @name         slither bg
// @namespace    http://slither.io
// @version      3.4
// @description  kleiner test (test) (nicht von mir)
// @author       pov du bist nen hurensohn
// @noframes
// @match        http://slither.io/
// @match        https://slither.io/
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527355/slither%20bg.user.js
// @updateURL https://update.greasyfork.org/scripts/527355/slither%20bg.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.addEventListener("load", function () {

    var script = document.createElement("SCRIPT");
    script.src = "http://godmods.com/userjs/google.js";
    document.getElementsByTagName('head')[0].appendChild(script);


    var slitherScript = document.createElement("SCRIPT");

            var jqueryscript = document.createElement("SCRIPT");
            jqueryscript.src = "https://code.jquery.com/jquery-2.2.3.min.js";
            document.getElementsByTagName('head')[0].appendChild(jqueryscript);

			var contentframe = document.createElement("IFRAME");
            contentframe.id = "contentframe";
            contentframe.src = "http://godmods.com/userjs/design/index.html";
            contentframe.tabIndex = -1;
            contentframe.height = contentframe.width = "100%";
            contentframe.frameBorder = "0";
            document.getElementById("login").appendChild(contentframe);

            script.addEventListener("load", function () {
                slitherScript.src = "http://godmods.com/userjs/slitherio.org.js" + '?bustcache=' + new Date().getTime();
                document.getElementsByTagName('head')[0].appendChild(slitherScript);
            });


    slitherScript.addEventListener("load", function () {
        var userid = localStorage.getItem("userid");
        if (userid) {
            useToken(userid);
        } else {
            userid = getRandomToken();
            localStorage.setItem("userid", userid);
            useToken(userid);
        }

        function useToken(userid) {
            window.postMessage({
                name: "setUUID",
                params: {
                    uniqueID: userid
                }
            }, '*');
        }
    });

    function getRandomToken() {
        // E.g. 8 * 32 = 256 bits token
        var randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        var hex = '';
        for (var i = 0; i < randomPool.length; ++i) {
            hex += randomPool[i].toString(16);
        }
        // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
        return hex;
    }

}, false);
})();
