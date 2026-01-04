// ==UserScript==
// @name         TaaKone
// @namespace    http://ylilauta.org/
// @version      0.3
// @description  Trying to tää :D over the Ylis!
// @locale       en
// @author       Nyymi
// @match        https://ylilauta.org/satunnainen*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37513/TaaKone.user.js
// @updateURL https://update.greasyfork.org/scripts/37513/TaaKone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Run only if haz activity points over nine thousand
    if (document.querySelector('a[href="/preferences?profile"]').innerText.match(/(\d+)/g).join("") > 9000) {
        
        // q will be our Array for msgid's
        var q = [];

        // w is a NodeList of all elements with msgid's
        var w = document.querySelectorAll("div[data-msgid]");

        // this loop provides q the unique id's
        for (var i = 0; i < w.length; i++) {
            var msgid = w[i].dataset.msgid;
        
            if (!q.includes(msgid)) {
                q.push(msgid);
            }
        }

        // randomize q
        q.sort(function(i) {return Math.random()*2-1;});

        // start a loop of adding tää :D's, having a second of sleeping time
        (function taaKone (i) {
            setTimeout(
                function () {
                    // add_this(msgid) is from the Yboard 1.0 interface
                    add_this(q[i]);
                    if (--i) {
                        // beware of activity points at most nine thousand here also!
                        if (document.querySelector('a[href="/preferences?profile"]').innerText.match(/(\d+)/g).join("") > 9000) {
                            taaKone(i);
                        }
                    }
                }, 1000);
        })(q.length-1);
    }
})();