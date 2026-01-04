// ==UserScript==
// @name         PVPRP Skip download steps / DL
// @namespace    https://snehajeez.xyz
// @version      1.0
// @description  Skips over the 'subscribe to unlock' stuff on PVPRP.com resource packs and makes download button available directly.
// @author       Shehajeez
// @match        https://pvprp.com/pack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541559/PVPRP%20Skip%20download%20steps%20%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/541559/PVPRP%20Skip%20download%20steps%20%20DL.meta.js
// ==/UserScript==

(function () {
    var i = setInterval(() => {
        var l = document.querySelector('.load');
        var d = document.querySelector('#update-download');
        var s = document.querySelector('.self-end');

        if (l && l.style.display === 'none' && d && s) {
            clearInterval(i);
            document.querySelectorAll('script').forEach(sc => {
                var m = sc.textContent.match(/\(document\)\.on\('click', "\.dowbt", function\(\) \{\s*if\(\$\(this\)\.attr\("href"\) == "([^"]+)"\)/);
                if (m) {
                    d.href = encodeURI(m[1]);
                    d.className = 'button-shared button-main';
                    s.remove();
                    var b = document.querySelector('.important-box');
                    if (b) b.remove();
                }
            });
        }
    }, 100);
})();
