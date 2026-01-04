// ==UserScript==
// @version        20181225
// @name           WEXNET_AutoLogin
// @namespace     WEXNET_AutoLogin
// @author	      fengguan.ld@gmail.com
// @description    WEXNET AutoLogin
// @include        https://wexnet.wwex.com/pls/apex/f?p=104:101:*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/376304/WEXNET_AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/376304/WEXNET_AutoLogin.meta.js
// ==/UserScript==
// 
$(window).load(function()
{
$("#P101_PASSWORD").val("Telamon2017*");
$("#P101_USERNAME").val("Tracking2_107");
});
