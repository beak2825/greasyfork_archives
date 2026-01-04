// ==UserScript==
// @name         RPGEN - Hide Own Avatar
// @namespace    https://tampermonkey.net/
// @version      0.2
// @description  TL;DR
// @author       https://greasyfork.org/ja/users/705684
// @match        https://rpgen.org/dq/?map=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpgen.site
// @license      MIT
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/516405/RPGEN%20-%20Hide%20Own%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/516405/RPGEN%20-%20Hide%20Own%20Avatar.meta.js
// ==/UserScript==

(() => {
    let graphicId = null;
    let isSAnim = null;
    GM.registerMenuCommand('hide/show', () => {
        const me = unsafeWindow.humans[0];
        if (graphicId === null) {
            graphicId = me.graphicId;
            isSAnim = me.isSAnim;
            me.graphicId = -45;
            me.isSAnim = false;
        } else {
            me.graphicId = graphicId;
            me.isSAnim = isSAnim;
            graphicId = null;
        }
    });
})();