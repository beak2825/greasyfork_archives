// ==UserScript==
// @name         NS Watcher theme
// @namespace    tembrawar.nsWatcherSpies
// @version      0.3
// @description  dark theme on ns-watcher
// @match        https://whackamole.thatastronautguy.space/factionmembers
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/492970/NS%20Watcher%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/492970/NS%20Watcher%20theme.meta.js
// ==/UserScript==


    document.head.insertAdjacentHTML(
        "beforeend",
        `<style>
       body {
           background-color: #222;
           color: #BBB;
           font-size: 12px;
           font-weight: 700;
       }
       a {
           color: #FFF
        }
        </style>`
    );