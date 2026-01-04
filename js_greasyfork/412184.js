
// ==UserScript==
// @name         Free Spanish Press
// @name:es      Anti-adblocker prensa Española
// @name:en      Free Spanish Press
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Eliminar los mensajes molestos que tienes adblocker, auto-aceptar cookies y desactivar ciertos bloqueos de lectura
// @description:en  Remove adBlockers detector for spanish press
// @author       ALeX Molero
// @match        *://*.elmundo.es/*
// @match        *://*.abc.es/*
// @match        *://*.20minutos.es/*
// @match        *://*.elpais.com/*
// @match        *://*.marca.com/*
// @match        *://*.lavanguardia.com/*
// @match        *://*.lne.es/*
// @match        *://*.diariovasco.com/*
// @match        *://*.lavozdegalicia.es/*
// @match        *://*.as.com/*
// @match        *://*.larazon.es/*
// @match        *://*.libertaddigital.com/*
// @match        *://*.elespanol.com/*
// @match        *://*.elconfidencial.com/*
// @match        *://*.okdiario.com/*
// @match        *://*.mundodeportivo.com/*
// @match        *://*.sport.es/*
// @match        *://*.eldiario.es/*
// @match        *://*.elperiodico.com/*
// @match        *://*.expansion.com/*
// @match        *://*.telva.com/*
// @match        *://*.informacion.es/*
// @match        *://*.lasprovincias.es/*
// @match        *://*.elnortedecastilla.es/*
// @match        *://*.burgosconecta.es/*
// @match        *://*.eldiariomontanes.es/*
// @match        *://*.hoy.es/*
// @match        *://*.elcomercio.es/*
// @match        *://*.lavozdigital.es/*
// @match        *://*.larioja.com/*
// @match        *://*.diariosur.es/*
// @match        *://*.leonoticias.com/*
// @match        *://*.laverdad.es/*
// @match        *://*.ideal.es/*
// @match        *://*.elcorreo.com/*
// @grant        GM_webRequest
// @webRequest {"selector":"*squido.js*","action":"cancel"}
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @downloadURL https://update.greasyfork.org/scripts/412184/Free%20Spanish%20Press.user.js
// @updateURL https://update.greasyfork.org/scripts/412184/Free%20Spanish%20Press.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = jQuery || window.$;
    const divElement = '.fc-ab-root';
    const timeOut = 500;
    const hostName = window.location.hostname;
    const retries = 30;
    const domainName = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);

    const adblockerDetection = (selector, callback, retry, timeOutRetry = timeOut) => {
        if (jQuery(selector).length) {
            callback();
            return;
        }

        if(retry <= retries) {
            setTimeout(() => {
                adblockerDetection(selector, callback, retry+1);
            }, timeOutRetry);
        }
    };

    const enableOverFlow = () => {
        $(document.body, document.body.parentNode).css("overflow", "auto");
    }

    const removeScrollBlockers = (element) => {
        $(element).css({
            position: '',
            top: '',
            width: '',
            height: '',
            overflow: ''
        });
    };

    const acceptCookies = () => {
        const CookiesButton = '#didomi-notice-agree-button';
        adblockerDetection(CookiesButton, () => {
            $(CookiesButton).trigger('click');
        }, 0);
    }

    const scroll = (element, removeScrollBlocker = false) => {
        setTimeout(() => {
            adblockerDetection(element, () => {
                $(element).remove();
                setTimeout(() => {
                    if(removeScrollBlocker) {
                        removeScrollBlockers(document.body);
                        removeScrollBlockers(document.body.parentNode);
                        enableOverFlow();
                    }
                }, 100);
            }, 5);
            disableScroll();
            scroll(element, removeScrollBlocker);
        }, 2000);
    }

    const disableScroll = () => {
        window.removeEventListener('scroll', scroll, false);
    }

    const enableScroll = (element, removeScrollBlocker=false) => {
        window.addEventListener('scroll', scroll(element, removeScrollBlocker), true);
    }


    $( document ).ready(() => {

    adblockerDetection(divElement, () => {
        $(divElement).remove();
        enableOverFlow();
    }, 0);
        acceptCookies();
    });

    setTimeout(() => {
        const GTMAlert = $("div:contains('You are seeing this message because ad or script blocking software is interfering with this page.')");

        adblockerDetection(GTMAlert, () => {
            $(GTMAlert).remove();
        }, 5);
    }, 1500);

    const vocentoShowImages = () => {
        $("img[data-original]").each((index, item) => {
            $(item).attr("src", $(item).data("original"));
        });
    }

    const removeAddsUnidadEditorial = () => {
        const divModal = '.tp-modal';
        const backdrop = '.tp-backdrop';
        $('#banda_suscripcion').remove();
        adblockerDetection(divModal, () => {
            $(divModal).remove();
        }, 15);
        adblockerDetection(backdrop, () => {
            $(backdrop).remove();
        }, 15);
        enableOverFlow();
        enableScroll('.ue-cintillo-premium-scroll', true);
        enableScroll('.ue-c-article__premium-icon-badge', true);
    }

    const removeAddsElPais = () => {
        const headerAddBlock = '.ad.ad-giga.ad-giga-1';
        adblockerDetection('#sfcampaign', () => {
            $('#sfcampaign').remove();
        }, 0);
        adblockerDetection(headerAddBlock, () => {
            $(headerAddBlock).remove();
        }, 10);
    }

    const removeAddsAbc = () => {
        $('.cintillo-dinamico.premium').remove();
        const removeItem = '#engagement-top';
        const removeTopBanner = '.mega-superior';
        const removeBottomBanner = '.voc-animated-modal-bottom';
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
            enableOverFlow();
        }, 0);
        adblockerDetection(removeTopBanner, () => {
            $(removeTopBanner).remove();
        }, 0);
        adblockerDetection(removeBottomBanner, () => {
            $(removeBottomBanner).remove();
        }, 0);
    }

    const removeAddsElEspanol = () => {
        const removeItem = '.tp-container-inner, .tp-modal';
        const removeFooter = '.msg-footer';
        const removeBanner = '#megasuperior';
        const suscriptor = '.full-suscriptor-container';
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 0);
        adblockerDetection(removeFooter, () => {
            $(removeFooter).remove();
        }, 10);
        adblockerDetection(removeBanner, () => {
            $(removeBanner).remove();
        }, 10);
        adblockerDetection(suscriptor, () => {
            $(suscriptor).remove();
        }, 10);
    }

    const removeAddsLavanguardia = () => {
        acceptCookies();
        const removeItem = ".info-drtp-wrapper";
        const removeModal = ".ev-open-modal-paywall-ADB_DETECTION";
        const removePopup = "#gg-alert";
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 3);
        adblockerDetection(removePopup, () => {
            $(removePopup).remove();
        }, 5);
        adblockerDetection(removeModal, () => {
            $(removeModal).remove();
        }, 10);
    }

    const removeAddsOkDiario = () => {
        acceptCookies();
        const removeItem = "#okd_top1_original";
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 3);
    };

    const removeAddsLaRazon = () => {
        acceptCookies();
        const removeItem = ".content__ad";
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 3);
    };

    const removeAddsExpansion = () => {
        acceptCookies();
        const removeItem = ".fc-ab-root";
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 3);
        enableOverFlow();
    };

    const removeAddsElDiario = () => {
        acceptCookies();
        enableScroll('.adblock-banner');
    };

    const removeAddsElPeriodico = () => {
        acceptCookies();
    };

    const removeAddLaNuevaEspana = () => {
        acceptCookies();
        const noBaldomero = '.no-baldomero';
        const bodyTruncate = '.article-body--truncated';

        const removeItem = ".paywall";
        adblockerDetection(removeItem, () => {
            $(removeItem).remove();
        }, 10);

        adblockerDetection(noBaldomero, () => {
            $(noBaldomero).removeClass('no-baldomero');
        }, 10);
        adblockerDetection(bodyTruncate, () => {
            $(bodyTruncate).removeClass('article-body--truncated');
        }, 10);
    };

    const removeAddMundodeportivo = () => {
        acceptCookies();
    };

    const removeAddSport = () => {
        acceptCookies();
    };

    switch(domainName) {
        case 'abc.es': removeAddsAbc(); break;
        case 'lavozdigital.es':
        case 'diariovasco.com':
        case 'larioja.com':
        case 'laverdad.es':
        case 'diariosur.es':
        case 'ideal.es':
        case 'hoy.es':
        case 'elcomercio.es':
        case 'lasprovincias.es':
        case 'burgosconecta.es':
        case 'eldiariomontanes.es':
        case 'elcorreo.com':
        case 'elnortedecastilla.es':
        case 'leonoticias.com':removeAddsAbc(); vocentoShowImages(); break;
        case 'elmundo.es':
        case 'telva.com':
        case 'marca.com': removeAddsUnidadEditorial(); break;
        case 'elpais.com': removeAddsElPais(); break;
        case 'elespanol.com': removeAddsElEspanol(); break;
        case 'okdiario.com': removeAddsOkDiario(); break;
        case 'lavanguardia.com': removeAddsLavanguardia(); break;
        case 'lavozdegalicia.es': acceptCookies(); break;
        case 'lne.es': removeAddLaNuevaEspana(); break;
        case 'informacion.es': removeAddLaNuevaEspana(); break;
        case 'mundodeportivo.com': removeAddMundodeportivo(); break;
        case 'sport.es': removeAddSport(); break;
        case 'eldiario.es': removeAddsElDiario(); break;
        case 'elperiodico.com': removeAddsElPeriodico(); break;
        case 'larazon.es': removeAddsLaRazon(); break;
        case 'expansion.com': removeAddsExpansion(); break;

        default: return false;
    }
})();