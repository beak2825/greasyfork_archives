// ==UserScript==
// @name         unipusAutoRefresh
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  assume no liability or responsibility
// @author       SKR7lex
// @match        https://*.unipus.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494658/unipusAutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/494658/unipusAutoRefresh.meta.js
// ==/UserScript==


function myrefresh()
{
    location.reload();
}

setInterval(function(){ myrefresh() }, 600000);