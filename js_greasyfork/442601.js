// ==UserScript==
// @name         April Fools r/starwars_place Allies
// @namespace    http://tampermonkey.net/
// @version      2.15
// @description  Keep the canvas beautiful!
// @author       oralekin from osu! /r/osuplace
// @overlay maintainer /u/irate_kalypso /r/starwars_place
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442601/April%20Fools%20rstarwars_place%20Allies.user.js
// @updateURL https://update.greasyfork.org/scripts/442601/April%20Fools%20rstarwars_place%20Allies.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/725818023302266910/960296466847502346/hk4.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}
