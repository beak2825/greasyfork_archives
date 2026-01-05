
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
// ==UserScript==
// @name         W macro FEED Agario
// @namespace    FEED
// @version      0.02
// @description  W FEED
// @author       ww
// @license      MIT
// @match        http://http://www.blobs.co.il/#tab2
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/21382/W%20macro%20FEED%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/21382/W%20macro%20FEED%20Agario.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 81) { // KEY_W
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();