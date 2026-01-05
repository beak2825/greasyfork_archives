// ==UserScript==
// @name         Is this on endor?
// @namespace    http://kadauchi.com/
// @version      1.0
// @description  Lets you know if a HIT is on the endor domain.
// @author       Kadauchi
// @icon         http://kadauchi.com/avatar.jpg
// @include      https://www.google.com/evaluation/endor/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/17415/Is%20this%20on%20endor.user.js
// @updateURL https://update.greasyfork.org/scripts/17415/Is%20this%20on%20endor.meta.js
// ==/UserScript==

$("body").prepend('<div style="text-align: center; background-color: red;"><label style="color: black;">This is hosted on Endor. Returning may cause a lockout.</label></div>');