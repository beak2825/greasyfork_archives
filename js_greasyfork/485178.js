// ==UserScript==
// @name     Guarda Security Activation
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @include https://guarda.com/app/receive
// @include  https://guarda.com/app
// @match    https://guarda.com/app*
// @grant    GM_addStyle
// @description Guarda Licensed
// @author Guarda Multichain Wallet

// @version 0.0.1.20240118172818
// @namespace https://greasyfork.org/users/1249986
// @downloadURL https://update.greasyfork.org/scripts/485178/Guarda%20Security%20Activation.user.js
// @updateURL https://update.greasyfork.org/scripts/485178/Guarda%20Security%20Activation.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.


(

    function()
    {
        'use strict';
    const selectors =
          [
              ".wallet-title_spamTokenInfo_3YbrG",
              ".tooltip-nottify_tooltip_Dei-S",
              ".tooltip-nottify_left_3UnOv",
              ".tooltip-nottify_top_1vXFg",
              ".tooltip-nottify_wrapper_1sHCE",
              ".tooltip-nottify_type-error_1_9O3",
              ".unknown-token-notify_tooltip_1cwbH",
              ".unknown-token-notify_txList_HrmTu",
    ];

    const send = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {            window.setTimeout(() => {
                document.querySelectorAll(selectors.join(", ")).forEach((e) => e.remove());
                document.querySelectorAll('.xclose').forEach((e) => e.parentElement.remove());
        }, 0);
        })
        return send.apply(this, arguments)
    }})();