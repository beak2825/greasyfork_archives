// ==UserScript==
// @name            OnitIframe
// @name:it         OnitIframe
// @description     iFrame customization products
// @description:it  iFrame customization products
// @match           http://192.168.29.111/OnPlant.WMS/Mes/MonitorLinea/MonitorLinea*
// @match           http://192.168.29.112/OnPlant.WMS/Mes/MonitorLinea/MonitorLinea*
// @version         1.0.1
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @resource        fancyboxCSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css
// @require         https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @author          Riccardo Piras
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @connect         192.168.29.111
// @connect         192.168.29.112
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @namespace https://greasyfork.org/users/1257674
// @downloadURL https://update.greasyfork.org/scripts/486777/OnitIframe.user.js
// @updateURL https://update.greasyfork.org/scripts/486777/OnitIframe.meta.js
// ==/UserScript==

var fancyboxCSS = GM_getResourceText ("fancyboxCSS");
GM_addStyle (fancyboxCSS);
GM_addStyle (`
    .fancybox-container {
        top: 100px !important;
        height: calc(100% - 100px) !important;
        z-index: 999 !important;
    }
`);

$(document).ready(function(){
    var src_iframe = '',
        modal_open = false;

    var intervalCheck = setInterval(function() {
        if ($('#modalConfermaComponentePrincipale').is(':visible') && modal_open == false) {
            modal_open = true;
            src_iframe = $('#modalConfermaComponentePrincipale').find('img').eq(0).attr("src");
            src_iframe = src_iframe.replace(".jpg","");
            localStorage.setItem('order_pressa',src_iframe);
            clearInterval(intervalCheck);
        } else if (localStorage.getItem('order_pressa') != undefined) {

            if ($('#tab-ingressi').length == 0) {

                localStorage.removeItem('order_pressa');

            } else {

                src_iframe = localStorage.getItem('order_pressa');

                $('#onit-navbar-page-on-top').find('.onit-navbar-page-buttons').append(`
                    <button class="btn btn-default" id="btn-preview-pressa"><i class="fa fa-fw fa-eye"></i>Anteprima</button>
                `);
                $.fancybox.open({
                    type: "iframe",
                    src  : src_iframe,
                    clickSlide: false,
                    clickOutside: true
                });
                $("body").on("click","#btn-preview-pressa", function() {
                    $.fancybox.open({
                        type: "iframe",
                        src  : src_iframe,
                        clickSlide: false,
                        clickOutside: true
                    });
                });

            }
            clearInterval(intervalCheck);

        }
    }, 1000);
});