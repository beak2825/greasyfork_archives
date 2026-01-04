// ==UserScript==
// @name         AnimeFLV Expanded Player
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes some elements from the interface and adds an expand button that increase the player size
// @author       stark1600
// @match        *://animeflv.net/ver/*/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/382100/AnimeFLV%20Expanded%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/382100/AnimeFLV%20Expanded%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery('#fb-root').remove();
    jQuery('.AX.Row.AFluid .AFixed').remove();
    jQuery('.Brdcrmb.fa-home').remove();
    jQuery('.CpCnC').remove();
    jQuery('.lgtbx').remove();
    jQuery('.taboo').remove();
    jQuery('.ShrCnB').remove();

    jQuery('.Xpnd').remove();
    jQuery('.Rprt').remove();
    jQuery('.CVst').remove();
    jQuery('.Clgt').remove();
    jQuery('#taboola-below-article-thumbnails').remove();
    jQuery('#XpndCn > div.CpCnA > div:nth-child(1)').remove();
    jQuery('.CapNv').after('<span class="BtnNw Xpnd XpndCtm BxSdw AAShwHdd-lnk"><i class="fa-expand" data-toggle="tooltip" title="" data-original-title="Expandir"></i><i class="fa-compress" data-toggle="tooltip" title="" data-original-title="Comprimir"></i></span>');
    jQuery('body').after('<div class="CapiTcnXnpTop">cerrar</div>');

    jQuery('.XpndCtm').click(function(){
        jQuery('.CapiTcn').addClass('CapiTcnXnp');
        jQuery('body').addClass('fixedBody');
        jQuery('.CapiTcnXnpTop').show();
        jQuery('.Body').addClass('zindex');
    });

    jQuery('.CapiTcnXnpTop').click(function(){
        jQuery('.CapiTcn').removeClass('CapiTcnXnp');
        jQuery('body').removeClass('fixedBody');
        jQuery('.CapiTcnXnpTop').hide();
        jQuery('.Body').removeClass('zindex');
    });

    jQuery(document).keyup(function(e) {
        if (e.key === "Escape") {
            jQuery('.CapiTcn').removeClass('CapiTcnXnp');
            jQuery('body').removeClass('fixedBody');
            jQuery('.CapiTcnXnpTop').hide();
        }
    });

    GM_addStyle('.CpCn {padding-right: 0 !important;}');
    GM_addStyle('@media (min-width: 766px) {.CapiTcn:before {height: 650px;}}');
    GM_addStyle('.CapiTcnXnp{position: fixed;top: 20px;left: 0;bottom: 0;right: 0;}');
    GM_addStyle('.CapiTcnXnpTop{position: fixed;top: 0px;left: 0;right: 0;height:20px;background-color: black;color: #aaa;font-size: 10px;text-align:center;cursor:pointer;display:none;}');
    GM_addStyle('.fixedBody{position: fixed;}');
    GM_addStyle('.zindex{z-index: 999;}');
})();