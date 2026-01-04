// ==UserScript==
// @name       Aliexpress Redir from best.aliexpress.com
// @namespace  https://greasyfork.org/ru/scripts/370199-aliexpress-redir-from-best-aliexpress-com
// @version    0.0.0.1
// @description  Aliexpress Redir from best.aliexpress.com to http://trade.aliexpress.com
// @include    https://best.aliexpress.com/*
// @author skirda
// @grant 	none
// @copyright  public domain
// @downloadURL https://update.greasyfork.org/scripts/370199/Aliexpress%20Redir%20from%20bestaliexpresscom.user.js
// @updateURL https://update.greasyfork.org/scripts/370199/Aliexpress%20Redir%20from%20bestaliexpresscom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.host === "best.aliexpress.com")
    {
        window.location.href="http://trade.aliexpress.com/orderList.htm";
    }
})();
