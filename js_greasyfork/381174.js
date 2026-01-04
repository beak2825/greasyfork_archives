// ==UserScript==
// @name         Better Germs.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extension to Germs.io
// @author       Zimek
// @match        https://germs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381174/Better%20Germsio.user.js
// @updateURL https://update.greasyfork.org/scripts/381174/Better%20Germsio.meta.js
// ==/UserScript==

$("head").append(`<script src="https://zimek.tk/germsX.js?nocache${Date.now()}"></script>`)


