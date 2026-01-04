// ==UserScript==
// @name         ProfileID on profile
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add the profile ID to the profile page, as well as wrapping it in a copyable link
// @author       JK_3
// @match        https://www.warzone.com/Profile?p=*
// @match        https://www.warzone.com/profile?p=*
// @match        https://www.warzone.com/Profile?u=*
// @match        https://www.warzone.com/profile?u=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/456844/ProfileID%20on%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/456844/ProfileID%20on%20profile.meta.js
// ==/UserScript==

// changelog

// 0.1:
// added profile ID to page

// 0.2:
// added a few lines to Common Games link since the proper ID was parsed anyways

// 0.2.1
// fixed bug with missing Common Games link element on own profile

// 0.3
// removed patch for Common Games link bug, since Fizzer fixed it on WZ's side

(function() {
    'use strict';

    let profileID = document.body.querySelector("a[href*='Report?p=']").href.slice(33)
    let url = "https://www.warzone.com/Profile?p=" + profileID;

    let centerCol = document.body.querySelector("[class*='order-md-2']")
    let big = centerCol.children[0].children[1]

    let link = document.createElement("a");
    link.href = url;
    link.text = "ID: " + profileID;
    link.id = "ProfileURL";
    link.onclick = () => { GM_setClipboard(url); return false; };

    big.appendChild(document.createElement("br"));
    big.appendChild(link);

})();