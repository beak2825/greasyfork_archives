// ==UserScript==
// @name         Mastoshare Replacer
// @namespace    https://mizle.net/
// @version      1.0.1
// @description  Replace Mastoshare Links to Your Instance Share Form.
// @author       Eai
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370990/Mastoshare%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/370990/Mastoshare%20Replacer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const instance = "mstdn.maud.io";
    const regex = /https:\/\/mastoshare\.net\/post\.php\?text=(.*)/g;

    let mastoshareLinks = document.querySelectorAll("a[href^=\"https://mastoshare.net/post.php?text=\"]");

    mastoshareLinks.forEach(function (link) {
        let tootText = regex.exec(link.href)[1];
        if (tootText == "") {
            link.href = `https://${instance}/share?text=${encodeURIComponent(document.title)} ${encodeURIComponent(document.location)}`;
        } else {
            link.href = `https://${instance}/share?text=${tootText}${encodeURIComponent(document.location)}`;
        }
    });
})();
