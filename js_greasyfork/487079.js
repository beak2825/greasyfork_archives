// ==UserScript==
// @name         Desactiva los Dominios molestos de Para TMO
// @namespace    TUMANGAONLINE
// @version      3.8
// @description  Un script que elimina las redireciones te tumanga online y agrega atajos de teclado!
// @homepageURL  https://greasyfork.org/es/users/1211940-mao-oaks
// @icon         https://visortmo.com/favicon/android-chrome-192x192.png
// @author       mao_oaks
// @connect      *
// @license      Copyright MIT
// @match        *://*lectortmo.com/*
// @match        *://*zonatmo.com/*
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487079/Desactiva%20los%20Dominios%20molestos%20de%20Para%20TMO.user.js
// @updateURL https://update.greasyfork.org/scripts/487079/Desactiva%20los%20Dominios%20molestos%20de%20Para%20TMO.meta.js
// ==/UserScript==
(function () {
    const CASCADE = true;
    const paginado = CASCADE ? "cascade" : "paginated";

    // Directorio de páginas permitidas
    const paginas = {
        visortmo: null,
        zonatmo: null,
    };

    // Definir expresiones regulares para verificar las URLs
    const regex = /uniqid:\s*'([^']+)'/;
    const superregex = /\w+\/\w+\/[0-9a-f]{12,32}\/(null|cascade(\d{0,3})|paginated(\d{0,3})(?:\/\d{0,3})?)$/gm;
    const regexbasico = /\w+\/\w+\/[0-9a-f]{32}\/(null|cascade(\d{0,3})|paginated(\d{0,3})(?:\/\d{0,3})?)$/gm;


    if (window.location.href.match("view_uploads/")) {
        var uniqidValue = document.documentElement.innerHTML.match(regex)[1] || false;
        uniqidValue ? window.location.replace("https://zonatmo.com/viewer/" + uniqidValue + "/cascade"): false;
    }
    else {
        console.log('No se pudo hacer la redireccion directa.');

        // Limpiar la URL si coincide con el patrón básico
        var urlLimpia = regexbasico.test(window.location.href)
            ? location.href.replace(/\w+\.\w+\/\w{4,8}\//gm, "zonatmo.com/viewer/") : false;

        // Obtener el hostname actual para comprobar si está en el diccionario
        const href_mask = window.location.hostname.replace(".com", "");
        var href_aReal;

        if (!urlLimpia) {
            document.addEventListener("DOMContentLoaded", () => {

                const publicidad = document.querySelector('script[src="/adbd.js"]');
                publicidad ? publicidad.parentNode.removeChild(publicidad) : "";

                if (superregex.test(window.location.href)) {
                    // Obtener el hostname actual para comprobar si está en el diccionario
                    href_aReal = document.querySelector(".navbar-brand")?.getAttribute("href").match(/\w+\./gm)[0].replace(".", "");
                    // Obtener el valor de los parámetros del enlace del botón de Telegram
                    var BuscarElement = href_aReal in paginas ? document.querySelector(".btn-telegram")?.getAttribute("href") || "" : "";
                    var urlParams = new URLSearchParams(BuscarElement.split('?')[1]);
                    urlLimpia = decodeURIComponent(urlParams.get('url')); // Obtener la URL decodificada
                    console.log(urlLimpia);
                }
            });
        }

        // Si el dominio actual no está en el diccionario de páginas permitidas
        if ((!(href_mask in paginas) && urlLimpia) || urlLimpia && !(urlLimpia == urlLimpia.replace(/null|paginated\d*/g, paginado))) {
            // Redirigir a la URL limpia con el formato deseado
            location.href = urlLimpia.replace(/cascade\d*|null|paginated\d*/g, paginado);

        } else if (urlLimpia) {
            // Si el dominio está permitido, agregar eventos de navegación con teclas
            document.addEventListener("keydown", logKey);
            function logKey(e) {
                if (e.code === "ArrowUp") {
                    goNextPage();
                } else if (e.code === "ArrowDown") {
                    goPrevPage();
                } else if (e.code === "ArrowRight") {
                    location = document.querySelector(".chapter-next a")?.href || location;
                } else if (e.code === "ArrowLeft") {
                    location = document.querySelector(".chapter-prev a")?.href || location;
                }
            }
        }
    }
})();