// ==UserScript==
// @name         Original Twitter Image
// @namespace    No
// @version      0.1
// @description  Opening a twitter image loads the original image. (Adding :orig to the end of the url).
// @author       You
// @match        http*://*.twimg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388371/Original%20Twitter%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/388371/Original%20Twitter%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imgs = document.querySelectorAll("img");

    console.log(imgs);
    for (var img of imgs) {
        var ending = img.src.split("&name");

        if (ending[1] && ending[1] != "=orig") {
            img.src = ending[0] + "&name=orig";
            window.location = img.src;
        }
        if (img.src.endsWith("=small")) {
            img.src = img.src.replace("=small", "=orig");
            window.location = img.src;
        }
        else if (img.src.endsWith("=small")) {
            img.src = img.src.replace("=large", "=orig");
            window.location = img.src;
        }
        else if (img.src.endsWith(":small")) {
            img.src = img.src.replace(":small", ":orig");
            window.location = img.src;
        }
        else if (img.src.endsWith(":large")) {
            img.src = img.src.replace(":large", ":orig");
            window.location = img.src;
        }
        else if (!img.src.endsWith(":orig") && !img.src.endsWith("=orig")) {
            img.src = img.src + ":orig";
            window.location = img.src;
        }
    }
})();
