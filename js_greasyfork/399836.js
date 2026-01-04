// ==UserScript==
// @name         ClanSkladUID
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  adds uid column
// @author       You
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/sklad_info.+\&cat=(0|1|2|6)/
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/399836/ClanSkladUID.user.js
// @updateURL https://update.greasyfork.org/scripts/399836/ClanSkladUID.meta.js
// ==/UserScript==

(function(window, undefined) {
    'use strict';

    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let isItemTbody = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody") === null;
    if (!isItemTbody) {
        let items = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody").querySelectorAll("tr");
        for (let i = 0; i < items.length; i++) {
           if (i == 0) {
               addUIDHeader(items[i])
           } else {
               addUID(items[i]);
           }
        }
    }

    function addUIDHeader(trs) {
        let itemName = trs.querySelector("td:nth-child(1)");
        let uid = document.createElement("TD");
        uid.innerHTML = `<font style="font-size:9px">uid</font>`;
        itemName.insertAdjacentElement("afterend", uid);
    }

    function addUID(trs) {
        let itemName = trs.querySelector("td:nth-child(2)");
        let uid = document.createElement("TD");
        uid.innerHTML = `<font style="font-size:9px">${getUID(trs)}</font>`;
        itemName.insertAdjacentElement("afterend", uid);
    }

    function getUID(trs) {
        let isExistForm = trs.querySelector("input:nth-child(8)") === null;
        if (!isExistForm) {
            return trs.querySelector("input:nth-child(8)").getAttribute("value");
        } else {
            return trs.querySelector("td:nth-child(5) > div").getAttribute("id").replace("pr", "");
        }
    }

})();