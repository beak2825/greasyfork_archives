// ==UserScript==
// @name         Desbloquear Webs
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  Desbloquear webs sin aceptar coookies ni suscripciones y algún contenido de pago
// @author       xero399
// @match        https://www.abc.es/*
// @match        https://www.farodevigo.es/*
// @match        https://www.elmundo.es/*
// @match        https://www.hobbyconsolas.com/*
// @match        https://cadenaser.com/*
// @match        https://www.lavozdegalicia.es/*
// @match        https://www.3djuegospc.com/*
// @match        https://www.3djuegos.com/*
// @match        https://www.genbeta.com/*
// @match        https://elpais.com/*
// @match        https://www.heraldo.es/*
// @match        https://www.elespanol.com/*
// @match        https://www.huffingtonpost.es/*
// @match        https://www.fotogramas.es/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487131/Desbloquear%20Webs.user.js
// @updateURL https://update.greasyfork.org/scripts/487131/Desbloquear%20Webs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function () {
        let url = window.location.origin;
        //Faro de Vigo
        if(url == "https://www.farodevigo.es"){
            setTimeout(() => {
                if(document.getElementsByClassName("ft-helper-closenews").length > 0){
                    document.getElementsByClassName("ft-helper-closenews")[0].classList.remove('ft-helper-closenews');
                    document.getElementById("paywall").remove();
                }
                if(document.getElementsByClassName("article-body--truncated").length > 0){
                    document.getElementsByClassName("article-body--truncated")[0].classList.remove("article-body--truncated");
                    document.getElementsByClassName("article-body--seo-closed")[0].removeAttribute('amp-access-hide');
                    document.querySelectorAll('[amp-access="NOT c.access"]')[0].remove();
                }
                if(document.getElementsByClassName("tp-backdrop tp-active").length > 0){
                    document.getElementsByClassName("tp-backdrop tp-active")[0].remove();
                    document.getElementsByClassName("tp-modal")[0].remove();
                }
                var timer = setInterval(function () {
                    let closeContentEnd = document.getElementsByClassName("closeContentEnd");
                    if(closeContentEnd.length > 0){
                        for(let i = 0; i<closeContentEnd.length; i++){
                            closeContentEnd[i].classList.remove("closeContentEnd");
                        }
                    }
                    else{
                        clearInterval(timer);
                        let closedContent = document.querySelectorAll('[data-close="closedContent"]');
                        if(closedContent.length > 0){
                            for(let i=0; i<closedContent.length; i++){
                                closedContent[i].remove();
                            }
                        }
                    }
                }, 100);
            }, 1000);
        }
        //HobbyConsolas
        if(url == "https://www.hobbyconsolas.com"){
            setTimeout(() => {
                document.getElementsByTagName("Head")[0].getElementsByTagName("style")[1].remove();
            }, 1000);
        }
        //El Mundo / Genbeta / El Heraldo / ABC
        if(url == "https://www.elmundo.es" || url == "https://www.genbeta.com" || url == "https://www.heraldo.es" || url == "https://www.abc.es"){
            setTimeout(() => {
                document.getElementById("didomi-popup").remove();
                document.body.classList.remove("didomi-popup-open");
            }, 1000);
        }
        //Cadena SER
        if(url == "https://cadenaser.com"){
            setTimeout(() => {
                document.body.style.overflow="auto";
                document.getElementsByClassName("_56nzg9")[0].remove();
                let observer = new MutationObserver(function(mutations){
                    document.body.style.overflow="auto";
                    document.getElementsByClassName("_56nzg9")[0].remove();
                });
                let target = document.body;
                observer.observe(target,{attributes:true,attributeFilter:['style']});
            }, 1000);
        }
        //La voz de Galicia / 3D Juegos PC / 3D Juegos
        if(url == "https://www.lavozdegalicia.es" || url == "https://www.3djuegospc.com" || url == "https://www.elespanol.com" || url == "https://www.3djuegos.com"){
            if(document.getElementById("didomi-popup")){
                document.getElementById("didomi-popup").remove();
                document.body.classList.remove("didomi-popup-open");
                document.body.classList.remove("blocked");
            }
            document.getElementsByTagName("html")[0].classList.remove("cookiewall_active");
        }
        //El Español
        if(url == "https://www.elespanol.com"){
            document.getElementById("nhfp_didomi_block_page").remove();
            document.body.style.overflow="auto";
        }
        //EL PAís
        if(url == "https://elpais.com"){
            document.getElementById("pmConsentWall").remove();
            document.body.style.overflow = 'auto';
        }
        //Huffingtonpost / Fotogramas
        if(url == "https://www.huffingtonpost.es" || url == "https://www.fotogramas.es"){
            setTimeout(() => {
                document.querySelectorAll('[data-nosnippet="data-nosnippet"]')[0].remove();
                document.body.style.overflow = 'auto';
            }, 2000);
        }
    });
})();