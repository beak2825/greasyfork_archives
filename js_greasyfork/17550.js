// ==UserScript==
// @name         NameDisable
// @version      0.4
// @description  DisableName
// @author       ShadyOrr
// @include      http://*.365planetwinall.net/Sport/PrintCoupon.aspx?IDCoupon=*
// @include      http://*.wonodds724.com/Sport/PrintCoupon.aspx?IDCoupon=*
// @include      https://*.365planetwinall.net/Sport/PrintCoupon.aspx?IDCoupon=*
// @namespace    http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/17550/NameDisable.user.js
// @updateURL https://update.greasyfork.org/scripts/17550/NameDisable.meta.js
// ==/UserScript==
$('#ctl00_PC_pnlUser').remove();
$('.PCDisclaimer').remove();
print();