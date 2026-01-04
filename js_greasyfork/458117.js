// ==UserScript==
// @name         auto 50 channel point
// @namespace    http://ereynier.me/
// @version      0.1
// @description  collect the 50 channel points bonus chest
// @icon         https://cdn-icons-png.flaticon.com/512/3068/3068997.png
// @author       ereynier
// @match        https://www.twitch.tv/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458117/auto%2050%20channel%20point.user.js
// @updateURL https://update.greasyfork.org/scripts/458117/auto%2050%20channel%20point.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        if (document.getElementsByClassName("ScCoreButton-sc-1qn4ixc-0 ScCoreButtonSuccess-sc-1qn4ixc-5 ffyxRu gjXDMG")[0])
        {
            document.getElementsByClassName("ScCoreButton-sc-1qn4ixc-0 ScCoreButtonSuccess-sc-1qn4ixc-5 ffyxRu gjXDMG")[0].click();
        }
        if (document.getElementsByClassName("ScCoreButton-sc-1qn4ixc-0 ScCoreButtonDestructive-sc-1qn4ixc-4 CkJuM glsDmY")[0])
        {
            document.getElementsByClassName("ScCoreButton-sc-1qn4ixc-0 ScCoreButtonDestructive-sc-1qn4ixc-4 CkJuM glsDmY")[0].click();
        }
    }, 60000);
})();