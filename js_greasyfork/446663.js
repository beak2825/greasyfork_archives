// ==UserScript==
// @name         Bypass Stencil Sticker's Size Limit
// @namespace    Vholran.BypassStencilSticker'sSizeLimit
// @version      1.0.2
// @description  Make stencil stickers larger than the default size limit.
// @author       Vholran (https://greasyfork.org/en/users/841616)
// @match        https://*.drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446663/Bypass%20Stencil%20Sticker%27s%20Size%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/446663/Bypass%20Stencil%20Sticker%27s%20Size%20Limit.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {
        if ($('#main').length && LOGGEDIN) {
            const roomObserver = new MutationObserver(m => {
                if (/\Шаблоны|Plantillas|Stencils/.test(m[0].target.textContent)) {
                    new MutationObserver(m => {
                        if (m[0].target.disabled) {
                            m[0].target.removeAttribute('disabled');
                        }
                    }).observe($('.fa-parachute-box').parent()[0], { attributes: true });
                }
                roomObserver.disconnect();
            });
            roomObserver.observe($('#infotext')[0], { childList: true });
        }
    });
})(window.jQuery.noConflict(true));