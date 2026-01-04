// ==UserScript==
// @name        moca-news Image
// @author      AnnAngela
// @description Remove the restriction from saving the image
// @version     1.0.3
// @namespace   https://greasyfork.org/users/129402
// @supportURL  https://greasyfork.org/scripts/397327-moca-news-image/feedback
// @license     GNU General Public License v3.0 or later
// @compatible  chrome
// @compatible  firefox
// @compatible  opera
// @compatible  safari
// @match       https://moca-news.net/article/*/*/image*.html
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/397327/moca-news%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/397327/moca-news%20Image.meta.js
// ==/UserScript==
setInterval(() => {
    unsafeWindow.document.querySelectorAll("#image_cvs, #image_cvs_cover").forEach(e => {
        for (let i in e) {
            if (i.startsWith("on")) {
                e.removeAttribute(i);
            }
        }
    })
}, 100)
const s = unsafeWindow.document.createElement("style");
s.innerText = "#image_cvs_cover { display: none !important; pointer-events: none !important; } #cvs_wrap_1 { opacity: 1 !important; }";
unsafeWindow.document.head.append(s);