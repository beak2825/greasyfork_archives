// ==UserScript==
// @name         Amazon URL Shortener
// @namespace    http://littlefinix.net/
// @version      0.8
// @description  Adds an option for amazon to copy a shortened link to the clipboard, available under 'Share'.
// @author       Littlefinix
// @include      /^https?:\/\/(www.|smile.)?amazon.*\/[a-z]p\/.*/
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/30687/Amazon%20URL%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/30687/Amazon%20URL%20Shortener.meta.js
// ==/UserScript==

var isCopyInfoOpen = false;

(function () {
    'use strict';

    var info = document.createElement("div");
    info.innerHTML = "<span style=\"background: limegreen; color: white; padding: 0.5em;\">Copied Successfully!</span>";

    var link = document.createElement("a");
    link.innerText = "Copy URL";
    link.onclick = function (e) {
        var matches = /((?:.*)amazon(?:.\w{2,})+)\/(?:.*)?([a-z]p)\/(?:product\/)?([^\/\?&]+)(?:.*|$)/.exec(document.URL);

        if (matches === null) {
            alert("Could not copy link.\nYou may need to update the script");
            return;
        }

        var scroll = window.scrollY;

        var txt = document.createElement("textarea");
        document.body.appendChild(txt);

        txt.innerText = matches[1] + "/dp/" + matches[3];
        txt.select();

        if (!document.execCommand('copy')) {
            prompt("Could not copy to clipboard!\nPlease copy manually:", txt.innerText);
        }

        txt.parentElement.removeChild(txt);
        window.scrollTo(window.scrollX, scroll);

        //console.log(GM_setClipboard(matches[1] + "/dp/" + matches[3], "text"));

        if (isCopyInfoOpen)
            return;
        document.querySelector("#tell-a-friend").appendChild(info);

        isCopyInfoOpen = true;

        setTimeout(function () {
            isCopyInfoOpen = false;
            info.parentElement.removeChild(info);
        }, 1000);
    };

    document.querySelector("#tell-a-friend").appendChild(link);
})();
