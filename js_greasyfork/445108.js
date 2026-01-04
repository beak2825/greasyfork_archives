// ==UserScript==
// @name         Thanos snap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://mportaal.kw1c.nl/index.html
// @icon         https://itk-assets.nyc3.cdn.digitaloceanspaces.com/2021/03/avengers-endgame-thanos-snap.jpg
// @grant        GM_addStyle
// @author       Tibo Melis
// @description  rightclick on the KW1C rooster to snap half away!
// @license      open-source
// @downloadURL https://update.greasyfork.org/scripts/445108/Thanos%20snap.user.js
// @updateURL https://update.greasyfork.org/scripts/445108/Thanos%20snap.meta.js
// ==/UserScript==

(function () {
    "use strict";

    GM_addStyle("#ctxmenu {position: fixed; top: 0px; z-index:10000;}");

    function fadehalf() {
        var blocks = [...document.querySelectorAll(".fc-event")].sort(() => 0.5 - Math.random());
        var classes = blocks.length / 2;
        for (let i = 0; i < classes; i++)
        {
            setTimeout(() => {
                blocks[i].style.transition = "2000ms linear";
                blocks[i].style.opacity = 0;
            }, 100 * i);
        }
    }

    document.oncontextmenu = (e) =>
    {
        e.preventDefault();
        let menu = document.createElement("div");
        menu.id = "ctxmenu";
        menu.onmouseleave = () => (ctxmenu.outerHTML = "");
        menu.innerHTML = "<p><img src='https://media2.giphy.com/media/LOoaJ2lbqmduxOaZpS/giphy.gif' style='height: 100vh; width: auto; opacity: 0.8;'></p>";
        document.body.appendChild(menu);
        setTimeout(() =>
        {
            menu.remove()
            fadehalf();
        }, 2000);
    };
})();
