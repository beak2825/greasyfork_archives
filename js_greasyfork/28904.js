
// ==UserScript==
// @name           Gain X with IMVU
// @description    Gain X with IMVU in the review product session
// @include        http://*imvu.com/*
// @version 0.0.1.20140905195116
// @namespace https://greasyfork.org/users/5055
// @downloadURL https://update.greasyfork.org/scripts/28904/Gain%20X%20with%20IMVU.user.js
// @updateURL https://update.greasyfork.org/scripts/28904/Gain%20X%20with%20IMVU.meta.js
// ==/UserScript==

window.setTimeout("document.getElementById('view_in_3d').click()", 5000);
window.setTimeout("document.getElementById('yui-main').getElementsByTagName('form')[0].submit();", 25000);