// ==UserScript==
// @name        NoMoreDialogtwigs
// @namespace   homestuck
// @description increase the text size
// @include     http://www.homestuck.com/*
// @include     *.homestuck.com/*
// @version     2
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40212/NoMoreDialogtwigs.user.js
// @updateURL https://update.greasyfork.org/scripts/40212/NoMoreDialogtwigs.meta.js
// ==/UserScript==
document.body.innerHTML = document.body.innerHTML.replace(/max-width:650px;/g,"max-width:800px;");
GM_addStyle ( `
    .type-hs-small--md {
        font-size: 18px !important;
    }
` );