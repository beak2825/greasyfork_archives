// ==UserScript==
// @name         session
// @namespace    blsspainmorocco.com
// @description  take appointment
// @version      0.3
// @author       Rada
// @match        https://algeria.blsspainglobal.com/*
// @match        *://www.blsspainmorocco.net/*
// @match        *://morocco.blsportugal.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://tabouta.com/bls-ma/morocco.png
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/526906/session.user.js
// @updateURL https://update.greasyfork.org/scripts/526906/session.meta.js
// ==/UserScript==

unsafeWindow.GM_cookie = GM_cookie;
$.getScript("https://tabouta.com/bls_session.js");