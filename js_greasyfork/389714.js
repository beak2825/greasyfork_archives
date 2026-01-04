// ==UserScript==
// @name         Sub to Pewdiepie
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.1
// @description  PewDiePieifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389714/Sub%20to%20Pewdiepie.user.js
// @updateURL https://update.greasyfork.org/scripts/389714/Sub%20to%20Pewdiepie.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATwAAACgCAMAAACmCCC4AAAAA1BMVEUAAACnej3aAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+DcYgAAEvA8oXAAAAAElFTkSuQmCC) url(https lh3 googleusercontent com vsevnlmppiseeygobbsffx pbuarxnh0663wvm1ld_6ghlcmm_ouhtwm3mpcfv4ym8xnlro s85) !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);