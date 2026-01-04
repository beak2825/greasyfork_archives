// ==UserScript==
// @name         Add download link to removed scores on osu.ppy.sh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a link to the error page to download the replay
// @author       InvisibleSymbol
// @match        https://osu.ppy.sh/scores/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/403865/Add%20download%20link%20to%20removed%20scores%20on%20osuppysh.user.js
// @updateURL https://update.greasyfork.org/scripts/403865/Add%20download%20link%20to%20removed%20scores%20on%20osuppysh.meta.js
// ==/UserScript==

(function() {
    var area = document.querySelector("body > div.osu-layout__section.osu-layout__section--full.js-content.error_404 > div.osu-page.osu-page--generic.text-center");
    if (!area) {
        return;
    }
    var link = document.createElement("a");
    var para = document.createElement("p");
    para.innerHTML = "Click here to download the replay";
    link.href = window.location.href;
    if (!link.href.endsWith("/download")) {
        link.href += "/download";
    }
    link.appendChild(para);
    area.prepend(link);
})();