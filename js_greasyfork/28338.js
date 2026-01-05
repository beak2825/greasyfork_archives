// ==UserScript==
// @name         WME Tiles Status Alert
// @name:he      תאריך בניית מפה
// @description  Show last successful tiles update. Alert if its more than 24h
// @description:he  מראה תאריך של בנית מפה מוצלחת אחרונה. מזהיר אם לא הייתה בניית מפה.
// @namespace    https://greasyfork.org/users/gad_m/wme_tiles_status_alert
// @version      0.3.08
// @author       gad_m
// @license MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/28338/WME%20Tiles%20Status%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/28338/WME%20Tiles%20Status%20Alert.meta.js
// ==/UserScript==

(function() {
    console.error("'WME Tiles Status Alert' scirpt is deprecated.\nPlease remove it.\nUse https://greasyfork.org/en/scripts/36050-wme-status instead");
    alert("'WME Tiles Status Alert' scirpt is deprecated.\nPlease remove it.\nUse https://greasyfork.org/en/scripts/36050-wme-status instead");
    GM_openInTab ("https://greasyfork.org/en/scripts/36050-wme-status");
}.call(this));
