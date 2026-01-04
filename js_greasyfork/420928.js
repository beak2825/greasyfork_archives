// ==UserScript==
// @name         Spanish Press anti-adblock blocker
// @run-at        document-start
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  Elimina los avisos molestos que muestran los periódicos para que desactives adblock. También permite leer artículos de manera ilimitada para algunas páginas.
// @author       Mikel Granero
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @include      https://www.elespanol.com/*
// @include      https://elpais.com/*
// @include      https://www.elcorreo.com/*
// @include      https://www.diariovasco.com/*
// @include      https://www.elmundo.es/*
// @include      https://www.telecinco.es/*
// @include      https://www.mediaset.es/*
// @include      https://www.divinity.es/*
// @include      https://www.cuatro.com/*
// @include      https://www.energytv.es/*
// @include      https://www.factoriadeficcion.com/*
// @include      https://www.libertaddigital.com/*
// @include      https://www.diariodenavarra.es/*
// @include      https://www.lasprovincias.es/*
// @include      https://www.eldigitaldealbacete.com/*
// @include      https://www.elnortedecastilla.es/*
// @include      https://www.diariosur.es/*
// @include      https://www.lavozdegalicia.es/*
// @include      https://andaluciainformacion.es/*
// @include      https://www.lavanguardia.com/*
// @include      https://www.elconfidencial.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420928/Spanish%20Press%20anti-adblock%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/420928/Spanish%20Press%20anti-adblock%20blocker.meta.js
// ==/UserScript==

// Una parte del bloqueador de El País y El Mundo son del autor "Zequi"
// https://greasyfork.org/es/scripts/393417-el-pa%C3%ADs-cleaned-page-sin-l%C3%ADmite-de-noticias

(function () {
    'use strict';
    var urlPeriodico = window.location.hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]; // Elimina http,https,wwww de la url
    var nombreFn = urlPeriodico.substring(0, urlPeriodico.lastIndexOf(".")); // Recoge el nombre del periódico en minúsculas, que es el nombre de las funciones
    switch (urlPeriodico) { // Switch case por si hay que añadir código distinto para cada periódico o hacer modificaciones específicas
        case "elespanol.com":
            runScriptForPage(nombreFn);
            break;
        case "elpais.com":
            runScriptForPage(nombreFn);
            break;
        case "elcorreo.com":
            runScriptForPage(nombreFn);
            break;
        case "diariovasco.com":
            runScriptForPage(nombreFn);
            break;
        case "elmundo.es":
            runScriptForPage(nombreFn);
            break;
        case "telecinco.es":
            runScriptForPage("mediaset");
            break;
        case "mediaset.es":
            runScriptForPage("mediaset");
            break;
        case "cuatro.com":
            runScriptForPage("mediaset");
            break;
        case "factoriadeficcion.com":
            runScriptForPage("mediaset");
            break;
        case "divinity.es":
            runScriptForPage("mediaset");
            break;
        case "energytv.es":
            runScriptForPage("mediaset");
            break;
        case "libertaddigital.com":
            runScriptForPage(nombreFn);
            break;
        case "diariodenavarra.es":
            runScriptForPage(nombreFn);
            break;
        case "lasprovincias.es":
            runScriptForPage(nombreFn);
            break;
        case "elnortedecastilla.es":
            runScriptForPage(nombreFn);
            break;
        case "diariosur.es":
            runScriptForPage(nombreFn);
            break;
        case "andaluciainformacion.es":
            runScriptForPage(nombreFn);
            break;
        case "lavanguardia.com":
            runScriptForPage(nombreFn);
            break;
        case "lavozdegalicia.es":
            runScriptForPage(nombreFn);
            break;
        case "elconfidencial.com":
            runScriptForPage(nombreFn);
            break;
        default:
    }


    function runScriptForPage(funcName) { // Ejecuta 4 veces la función para la página especificada en el parámetro.
        window.addEventListener('load', function () {
            setTimeout(eval(funcName + "()"), 200);
            setTimeout(eval(funcName + "()"), 500);
            setTimeout(eval(funcName + "()"), 900);
            setTimeout(eval(funcName + "()"), 3000);
            // 4 veces porque hay veces que los avisos salen pelín más tarde.
        }, false);
    }

    function andaluciainformacion() {
        $("#onesignal-slidedown-container").remove();
        $(".qc-cmp-ui-container").remove();
        $("body").removeClass("qc-cmp-showing");
        $("#modal-adblock").remove();
        $(".paginador").remove();
        $(".modal-overlay").remove();
        $("body").css("overflow", "visible");
    }

    function lavanguardia() {
        $(".ev-open-modal-paywall-REQUIRE_LOGIN").remove();
        $(".modal").remove();

        $(document).on('DOMNodeInserted', function(e) {
            if ( $(e.target).hasClass('ev-open-modal-paywall-ADB_DETECTION') ) {
                console.log('%c Han intentado bloquear la navegación.', 'background: green; color: white; display: block;');
                $(e.target).remove();
            }
        });
    }

    function diariosur() {
        elcorreo();
    }

    function lasprovincias() {
        // Usa la misma app que El Correo
        elcorreo();
    }

    function elnortedecastilla() {
        // Usa la misma app que El Correo
        elcorreo();
    }

    function elmundo() {
        // GRACIAS A ZEQUI https://greasyfork.org/es/users/413001-zequi
        $(".ue-c-seo-links-container").remove(); // CABECERA
        // PORTADA
        $(".ue-c-newsletter-widget").remove(); // modulo de newsletter
        $(".ue-c-cover-content__byline-name").remove();
        $(".servicios_vwo").remove(); //módulos de servicios
        $(".ue-c-cover-content__icon-premium").parent().parent().css("background-color", "#edab3b").css("opacity", "0.4"); //marca visualmente las noticias de pago
        $(".ue-c-cover-content__icon-premium").parent().parent().css("text-decoration", "line-through"); //Tacha los títulos de pago
        $(".ue-c-article__trust").remove(); // seccion TrustProject
        $(document).on('DOMNodeInserted', function(e) {
            if ( $(e.target).hasClass('tp-container-inner') ) {
                console.log('%c Han intentado bloquear la navegación.', 'background: green; color: white; display: block;');
                $(e.target).remove();
            }
        });

        $('body').css('left', '300px');
        $('html').css('left', '300px');
        /* document.documentElement.addEventListener('DOMAttrModified', function(e){
            if (e.attrName === 'style') {
              console.log('prevValue: ' + e.prevValue, 'newValue: ' + e.newValue);
            }
          }, false); */
        var body = document.getElementsByTagName('body');
        var html = document.getElementsByTagName('html');
        var observer = new MutationObserver(function(mutations) {
            $("body").attr('style','')
            $("html").attr('style','')
          });
          observer.observe(body[0], { 
            attributes: true, 
            attributeFilter: ['style'] });
          observer.observe(html[0], { 
            attributes: true, 
            attributeFilter: ['style'] });
          

    }

    function diariodenavarra() {
        // Como este periódico genera una ID única para que no pueda borrar el popup, selecciono el div que hay justo arriba con la id 'tLogo' y elimino el siguiente.
        $('#tLogo').next('div').remove();
    }

    function elespanol() {
        // Elimina modales que impiden scroll y que piden desactivar Adblock
        $(".tp-iframe-wrapper").remove();
        $(".tp-modal").remove();
        $(".tp-backdrop").remove();
        $(".md-suscription").remove();
        $("#megasuperior").remove(); // Un espacio en blanco enorme que no viene a cuento
        $("#gallerynews_footer").remove(); // Un espacio en blanco enorme que no viene a cuento
        $("#didomi-notice").remove();
        $("#sticky_container").remove();
        $(".flocktory-widget-overlay").remove(); // Un espacio en blanco enorme que no viene a cuento
        $(".main-story").removeClass("tp-modal-open");
        $(".art--closed").css("background-color", "yellow");
        //$(".art--closed h3").wrap("<s></s>")
        $(".art--closed h3").css({
            textDecoration: 'line-through'
        });
        $(".art--closed a").wrap("<s></s>")
    }

    function elcorreo() {
        var id = makeid(8);
        $(".wrapper voc-story").addClass(id); // Añade id única al wrapper
        $("." + id).removeClass("wrapper voc-story"); // Elimina la clase wrapper para confundir al script
        $("#onesignal-slidedown-container").remove(); // Elimina las notificaciones para que actives las notificaciones del navegador.
        $("#didomi-host").remove(); // Elimina la notificación de aceptar cookies en algunas páginas.
        $("#elcorreo-analitica").remove(); // Elimina la notificación de aceptar cookies en algunas páginas.
        $(".modal-dialog").remove(); // Elimina la notificación de aceptar cookies en algunas páginas.
        $(".voc-animated-modal-bottom").remove(); // Elimina la notificación de aceptar cookies en algunas páginas.
        if ($('body').css('overflow') == "hidden") {
            $('body').css('overflow', 'auto');

        }

        if ($('body').children().first().css("position") == "fixed") {
            $('body').children().first().remove();
        }

    }

    function diariovasco() {
        var id = makeid(8);
        $(".wrapper voc-story").addClass(id); // Añade id única al wrapper
        $("." + id).removeClass("wrapper voc-story"); // Elimina la clase wrapper para confundir al script
        $("#didomi-notice").remove();
        $(".voc-animated-modal-bottom").remove();
        if ($('body').children().first().css("position") == "fixed") {
            $('body').children().first().remove();
        }

        $(".sign-on2").parent().parent().css("background-color", "#ffb3b3");
        $(".sign-on2").parent().parent().css("text-decoration", "line-through");
    }

    function mediaset() {
        $("#pageMultisite").remove();
        $("#div-gpt-ad-mega-superior").remove();
        $("#MEGASUPERIOR").remove();
    }

    function libertaddigital() {
        $(".jquery-modal blocker current").remove();
        $(".portada scrolled").removeAttr("style")
    }

    function lavozdegalicia() {
        $(".cierre").parent().css("background-color", "#ff7575a3");
        $(".cierre").children(".content_wrapper").children("h2").children("a").css("text-decoration", "line-through");
    }

    function elconfidencial(){
       $("article").each(function() {
           var isExclusive = false;
        this.classList.forEach(element => {
            //this.classList.contains("--isExclusive")
            console.log(element);
           if(element.includes("--isExclusive")){
            isExclusive = true;
            console.log("Exclusive content");
           }
        });
        if (isExclusive){
            this.classList.add("prueba");
            this.style.backgroundColor = "#ff7575a3";
            this.style.textDecoration = "line-through";
            this.querySelector(".art-tit").style.textDecoration= "line-through";
        }
       });
    }


    function elpais() {
        // GRACIAS A ZEQUI https://greasyfork.org/es/users/413001-zequi
        // Trucar el número de noticias gratis por mes
        try {
           /*  var aa = JSON.parse(localStorage.getItem('ArcP'));
        aa.anonymous.rc["8"].c = -11;
        localStorage.setItem('ArcP', JSON.stringify(aa)); */
        localStorage.removeItem("ArcP"); // Resetear el contador de noticias
        } catch (error) {
            console.log(error)
        }
        // CABECERA
        $(".subscribe").remove(); // Botón Subscribirse al lado del botón login
        // PORTADA
        $(".classifieds_widget").remove(); //modulo de publicidad
        $("classifieds_widget").remove(); //modulo de servicios
        // PageNOTICIA > pre-CUERPO
        $(".f_c span.f_a").remove(); //en las imágenes, en el pie de foto se quita nombre del fotógrafo o agencia
        $(".a_tp").remove(); // seccion TrustProject
        $(".w_h_l").remove(); // en seccion comentarios, eliminar link a "normas"
        $(".divFlex").remove();
        $("#acceptationCMPWall").remove();
        $("#didomi-host").remove();
        $(".fc-ab-root").remove();
        $("body").css("overflow", "visible");
        $(".x._pr._g.x-p.x-nf").css("padding","0px");
        $(".x._pr.x-nf._g.x-p").css("border-bottom","none");
        $("#s_b_df").remove(); // Elimina el botón de suscribirse de arriba de la página
        setTimeout(function(){
            $(".me_f").find(`[data-ctn-subscription]`).parent().remove();
            $(".mldb1-wrapper").remove(); // Quitar espacio en blanco de arriba
            $(".ad.ad-giga").remove(); // Quitar espacio en blanco de arriba
            $("#counterLayerDiv").remove();
            $(".fc-ab-root").remove();
            $(".fo_su").remove();
            $("body").css("overflow", "visible");
            $(".paywallOffer ").remove();
        }, 2000);
        $("body").css("overflow", ""); // Quitar el bloqueo de la barra de navegación

        // Tachar 
        const paidArticles = $("article").find(".c_k.c_k-s").closest("article").css( {
            "background-color": "#ff7575a3",
            "text-decoration": "line-through"
        } );
        
        //$(".cierre").parent().css("background-color", "#ff7575a3");
        //$(".cierre").children(".content_wrapper").children("h2").children("a").css("text-decoration", "line-through");

    }

    // Esta función es imprescindible para páginas como el correo.
    // Crea una ID única por cada carga de una página para que las páginas no detecten este script.
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    $(document).ready(function () { //When document has loaded
        setTimeout(function () {
            var idMix = makeid(5) + makeid(5);
            addGlobalStyle(" ." + idMix + " { width:400px; height:20px; height:auto; position:absolute; left:40%; margin-left:-100px; bottom:10px; background-color: #383838; color: #F0F0F0; font-family: Calibri; font-size: 20px; padding:10px; text-align:center; border-radius: 2px; -webkit-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1); -moz-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1); box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1); position:-webkit-sticky; position:sticky; top:0; z-index:9999; }");
            $("body").append(`<div class='` + idMix + `' style='display:none'>Anti-Adblock y publicidad bloqueada 😎</div>`);
            $('.' + idMix).stop().fadeIn(400).delay(5000).fadeOut(400);
        }, 2000);
    });

})();