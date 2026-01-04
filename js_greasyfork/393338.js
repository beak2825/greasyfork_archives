// ==UserScript==
// @name         dn.se Paywall Removed
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Paywall removed and articles at full width!
// @author       Json
// @match        https://www.dn.se/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393338/dnse%20Paywall%20Removed.user.js
// @updateURL https://update.greasyfork.org/scripts/393338/dnse%20Paywall%20Removed.meta.js
// ==/UserScript==
/* global $ */

$("pwOveraly").hide();

GM_addStyle(' .page { max-width: 100% !important; } ');
GM_addStyle(' .article__lead { max-width: 100% !important; }');
GM_addStyle(' .author-box { max-width: 100% !important; }');
GM_addStyle(' .author { max-width: 100% !important; }');
GM_addStyle(' .article__tools { max-width: 100% !important; }');
GM_addStyle(' .article__body * { max-width: 100% !important; } ');
GM_addStyle(' .article__footer { max-width: 100% !important; } ');