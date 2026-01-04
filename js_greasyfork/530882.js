// ==UserScript==
// @name         Koopa plugin
// @namespace    http://tampermonkey.net/
// @version      2025-03-26
// @description  okay this is crazy
// @author       You
// @match        https://www.bopimo.com/users/koopa
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bopimo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530882/Koopa%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/530882/Koopa%20plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delay = 150; // 0.15 seconds

    // Set a timeout to delay the execution
    setTimeout(changeImage, delay);

    function changeImage()
    {
        const widths = Array.from(
            document.getElementsByClassName("w100")
        );

        let len = widths.length;
        for (let i=0 ; i < len; i++) {
            if (widths[i].nodeName == "IMG")
            {
                widths[i].src = "https://cdn.discordapp.com/attachments/711008358815236147/1354297004263735406/Pi7kcun.png?ex=67e4c6df&is=67e3755f&hm=c1b8db62ba30f71dec6a67dc2bdcb7d9fb330be31af86d92c128cdd330b5e380&";
            }
        }
    }
})();