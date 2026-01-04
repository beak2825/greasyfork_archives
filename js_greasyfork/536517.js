// ==UserScript==
// @name         Waze Discourse - Exportar Todos los Enlaces (Scroll y Popups)
// @namespace    http://tampermonkey.net/
// @version      0.7.6
// @description  Exporta todos los enlaces de los posts, haciendo scroll para cargar todos los temas y extrayendo de popups de categorías en Waze Discourse, con barra de progreso y sin alert final.
// @author       Annthizze
// @license      MIT
// @match        https://www.waze.com/discuss/*
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536517/Waze%20Discourse%20-%20Exportar%20Todos%20los%20Enlaces%20%28Scroll%20y%20Popups%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536517/Waze%20Discourse%20-%20Exportar%20Todos%20los%20Enlaces%20%28Scroll%20y%20Popups%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constantes para el scroll de la página principal
    const MAIN_PAGE_SCROLL_INTERVAL = 2500;
    const MAIN_PAGE_MAX_SCROLLS = 50;

    // Constantes para el cálculo de progreso (total 100)
    const PROGRESS_WEIGHT_POPUPS = 25;
    const PROGRESS_WEIGHT_SCROLL = 65;
    const PROGRESS_WEIGHT_FINISHING = 10;

    let enlacesEncontrados = new Set();
    let botonExportar;
    let cargando = false;
    let scrollCount = 0;

    let progressBarContainer = null;
    let progressBarElement = null;
    let progressTextElement = null;
    let currentProgress = 0;

    GM_addStyle(`
        #export-links-li {
            display: flex;
            align-items: center;
        }
        #exportar-waze-discourse.btn.icon svg {
            width: 18px;
            height: 18px;
            vertical-align: middle;
        }
        #exportar-waze-discourse:disabled {
            cursor: not-allowed !important;
            opacity: 0.5 !important;
        }
        #exportar-waze-discourse:disabled svg {
            opacity: 0.5;
        }
        #export-progress-bar-container {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 700px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
            z-index: 10001;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            display: none;
            font-family: Arial, sans-serif;
        }
        #export-progress-bar-inner-container {
            width: 100%;
            background-color: #e9ecef;
            border-radius: 4px;
            height: 24px;
            overflow: hidden;
        }
        #export-progress-bar {
            width: 0%;
            height: 100%;
            background-color: #007bff;
            border-radius: 4px;
            transition: width 0.25s ease-out;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
        }
        #export-progress-text {
            text-align: center;
            font-size: 0.9em;
            color: #495057;
            margin-top: 6px;
            padding: 0 5px;
        }
    `);

    function crearOReiniciarBarraDeProgreso() {
        if (!progressBarContainer) {
            progressBarContainer = document.createElement('div');
            progressBarContainer.id = 'export-progress-bar-container';
            const innerContainer = document.createElement('div');
            innerContainer.id = 'export-progress-bar-inner-container';
            progressBarElement = document.createElement('div');
            progressBarElement.id = 'export-progress-bar';
            progressTextElement = document.createElement('div');
            progressTextElement.id = 'export-progress-text';
            innerContainer.appendChild(progressBarElement);
            progressBarContainer.appendChild(innerContainer);
            progressBarContainer.appendChild(progressTextElement);
            document.body.appendChild(progressBarContainer);
        }
        progressBarContainer.style.display = 'block';
        currentProgress = 0;
        actualizarBarraDeProgreso(0, "Iniciando...");
    }

    function actualizarBarraDeProgreso(porcentaje, texto) {
        if (!progressBarContainer || progressBarContainer.style.display === 'none') return;
        currentProgress = Math.min(100, Math.max(0, Math.round(porcentaje)));
        progressBarElement.style.width = currentProgress + '%';
        progressBarElement.textContent = currentProgress + '%';
        progressTextElement.textContent = texto;
    }

    function ocultarBarraDeProgreso(delay = 0) {
        if (progressBarContainer) {
            setTimeout(() => {
                progressBarContainer.style.display = 'none';
            }, delay);
        }
    }

    function extraerEnlacesDeElementos(selector) {
        const elementos = document.querySelectorAll(selector);
        elementos.forEach(elemento => {
            const href = elemento.getAttribute('href');
            if (href) { try { const u = new URL(href, window.location.origin).href; if (!enlacesEncontrados.has(u)) enlacesEncontrados.add(u); } catch (e) { console.warn(`Enlace inválido: ${href}`, e); } }
            else if (elemento.tagName === 'A') { const pHref = elemento.getAttribute('data-url'); if (pHref) { try { const u = new URL(pHref, window.location.origin).href; if (!enlacesEncontrados.has(u)) enlacesEncontrados.add(u); } catch (e) { console.warn(`Enlace data-url inválido: ${pHref}`, e); } } }
        });
    }

    function extraerEnlacesDePopups() {
        const popupEnlaces = document.querySelectorAll('.waze-semi-category-dialog-content-category a');
        popupEnlaces.forEach(enlace => {
            const href = enlace.getAttribute('href');
            if (href) { try { const u = new URL(href, window.location.origin).href; if (!enlacesEncontrados.has(u)) enlacesEncontrados.add(u); } catch (e) { console.warn(`Enlace popup inválido: ${href}`, e); } }
        });
    }

    function generarDocumento(enlaces) {
        return Array.from(enlaces).sort().join("\n");
    }

    function descargarDocumento(contenido) {
        let nombreArchivoDeterminado;
        const urlActual = window.location.href;
        const prefijoARemover = "https://www.waze.com/discuss/c/wazeopedia/";
        let nombreBaseDesdeUrl = "";

        if (urlActual.startsWith(prefijoARemover)) {
            nombreBaseDesdeUrl = urlActual.substring(prefijoARemover.length);
            if (nombreBaseDesdeUrl.endsWith('/')) nombreBaseDesdeUrl = nombreBaseDesdeUrl.slice(0, -1);
            nombreBaseDesdeUrl = nombreBaseDesdeUrl.replace(/\//g, ' ').trim();
        }

        nombreArchivoDeterminado = (nombreBaseDesdeUrl && nombreBaseDesdeUrl !== "") ? `${nombreBaseDesdeUrl}.txt` : `waze_discourse_enlaces_all_popups_${new Date().toISOString().slice(0, 10)}.txt`;
        
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivoDeterminado;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // alert(`Se han exportado ${enlacesEncontrados.size} enlaces al archivo ${nombreArchivoDeterminado}`); // <-- LÍNEA ELIMINADA
        // Guardamos el nombre del archivo para usarlo en el mensaje final de la barra de progreso
        sessionStorage.setItem('lastExportedFileNameForProgress', nombreArchivoDeterminado); 
    }

    function finalizarExtraccionCompleta() {
        actualizarBarraDeProgreso(100 - PROGRESS_WEIGHT_FINISHING, `Generando documento (${enlacesEncontrados.size} enlaces)...`);
        extraerEnlacesDeElementos('span.link-top-line[role="heading"][aria-level="2"] > a.title.raw-link.raw-topic-link');
        extraerEnlacesDeElementos('a[class*="category-box"]');

        console.log(`Extracción finalizada. Total enlaces encontrados: ${enlacesEncontrados.size}`);
        const documento = generarDocumento(enlacesEncontrados);
        
        // Antes de descargar, preparamos el mensaje final.
        // La descarga ya no bloqueará la actualización de la barra.
        const nombreArchivoDescargado = (sessionStorage.getItem('lastExportedFileNameForProgress') || "archivo") + ""; // Obtenerlo antes de que descargarDocumento lo establezca si es necesario, aunque ahora lo establecemos dentro.

        descargarDocumento(documento); // Ahora no tiene alert

        const nombreFinalArchivo = sessionStorage.getItem('lastExportedFileNameForProgress') || "tu archivo";

        actualizarBarraDeProgreso(100, `¡Exportado! ${enlacesEncontrados.size} enlaces en ${nombreFinalArchivo}.`);
        ocultarBarraDeProgreso(5000); // Ocultar después de 5 segundos para dar tiempo a leer

        if (botonExportar) {
            botonExportar.innerHTML = `<svg class="fa d-icon d-icon-download svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M14 11v2H2v-2H0v2c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-2h-2zM8 9L4 5h2.5V0h3v5H12L8 9z"/></svg>`;
            botonExportar.title = `Exportar ${enlacesEncontrados.size} Enlaces`;
            botonExportar.disabled = false;
            cargando = false;
        }
        sessionStorage.removeItem('lastExportedFileNameForProgress'); // Limpiar
    }

    function hacerScrollYExtraerContenidoPrincipal() {
        let scrollProgress = Math.min(PROGRESS_WEIGHT_SCROLL, Math.round((scrollCount / MAIN_PAGE_MAX_SCROLLS) * PROGRESS_WEIGHT_SCROLL));
        actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS + scrollProgress, `Scroll (${scrollCount + 1}/${MAIN_PAGE_MAX_SCROLLS}), Enlaces: ${enlacesEncontrados.size}`);
        
        if (botonExportar) botonExportar.title = `Scroll (${scrollCount + 1}/${MAIN_PAGE_MAX_SCROLLS}), Enlaces: ${enlacesEncontrados.size}`;
        console.log(`Intento de scroll ${scrollCount + 1}/${MAIN_PAGE_MAX_SCROLLS}`);
        extraerEnlacesDeElementos('span.link-top-line[role="heading"][aria-level="2"] > a.title.raw-link.raw-topic-link');

        const noMasTemasHeading = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.includes('No hay más temas de la categoría'));

        if (noMasTemasHeading && noMasTemasHeading.offsetParent !== null) {
            console.log("Elemento 'No hay más temas' encontrado. Finalizando scroll.");
            actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS + PROGRESS_WEIGHT_SCROLL, "Final de temas encontrado.");
            finalizarExtraccionCompleta();
            return;
        }

        if (scrollCount >= MAIN_PAGE_MAX_SCROLLS) {
            console.log(`Límite de ${MAIN_PAGE_MAX_SCROLLS} scrolls. Finalizando.`);
            actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS + PROGRESS_WEIGHT_SCROLL, "Límite de scrolls alcanzado.");
            finalizarExtraccionCompleta();
            return;
        }

        const previousHeight = document.body.scrollHeight;
        window.scrollTo(0, previousHeight);
        scrollCount++;

        setTimeout(() => {
            if (document.body.scrollHeight <= previousHeight && scrollCount > 3) {
                 const noMasTemasReconfirm = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.includes('No hay más temas de la categoría') && h3.offsetParent !== null );
                if(!noMasTemasReconfirm) {
                    console.log("Altura no cambió o final no visible. Puede ser el final.");
                } else {
                     console.log("Elemento 'No hay más temas' reconfirmado tras no cambio de altura.");
                     actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS + PROGRESS_WEIGHT_SCROLL, "Final de página detectado.");
                     finalizarExtraccionCompleta();
                     return;
                }
            }
            hacerScrollYExtraerContenidoPrincipal();
        }, MAIN_PAGE_SCROLL_INTERVAL);
    }

    function procesarPopups(callbackAlFinalizarPopups) {
        const semiCategoryDivs = document.querySelectorAll('.waze-semi-category');
        let index = 0;
        const totalPopups = semiCategoryDivs.length;

        function clickSiguientePopup() {
            if (index < totalPopups) {
                const div = semiCategoryDivs[index];
                let popupProgress = Math.round(((index + 1) / totalPopups) * PROGRESS_WEIGHT_POPUPS);
                actualizarBarraDeProgreso(popupProgress, `Procesando popup ${index + 1}/${totalPopups}...`);
                if (botonExportar) botonExportar.title = `Procesando Popup ${index + 1}/${totalPopups}`;
                
                console.log(`Procesando popup ${index + 1}/${totalPopups}: ${div.textContent ? div.textContent.trim().substring(0,30) : 'Popup sin texto'}...`);
                div.click();

                setTimeout(() => {
                    extraerEnlacesDePopups();
                    const closeButton = document.querySelector('.dialog-close');
                    if (closeButton) closeButton.click();
                    index++;
                    setTimeout(clickSiguientePopup, 700);
                }, 1800);
            } else {
                console.log("Procesamiento de popups finalizado.");
                actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS, "Popups listos. Iniciando scroll...");
                if (callbackAlFinalizarPopups) callbackAlFinalizarPopups();
            }
        }

        if (totalPopups > 0) {
            console.log(`Encontrados ${totalPopups} popups para procesar.`);
            actualizarBarraDeProgreso(1, `Iniciando procesamiento de ${totalPopups} popups...`);
            clickSiguientePopup();
        } else {
            console.log("No se encontraron popups de semi-categoría.");
            actualizarBarraDeProgreso(PROGRESS_WEIGHT_POPUPS, "Sin popups. Iniciando scroll...");
            if (callbackAlFinalizarPopups) callbackAlFinalizarPopups();
        }
    }

    function inicializarBotonEnBarra() {
        const panelIconos = document.querySelector('div.panel[role="navigation"] ul.icons.d-header-icons');
        if (panelIconos && !document.getElementById('exportar-waze-discourse')) {
            const listItem = document.createElement('li');
            listItem.id = 'export-links-li';
            botonExportar = document.createElement('button');
            botonExportar.id = 'exportar-waze-discourse';
            botonExportar.className = 'btn no-text btn-icon icon btn-flat';
            botonExportar.title = 'Iniciar Exploración y Exportación de Enlaces';
            botonExportar.innerHTML = `<svg class="fa d-icon d-icon-download svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M14 11v2H2v-2H0v2c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-2h-2zM8 9L4 5h2.5V0h3v5H12L8 9z"/></svg>`;
            listItem.appendChild(botonExportar);
            panelIconos.prepend(listItem); 
            botonExportar.addEventListener('click', () => {
                if (!cargando) {
                    cargando = true;
                    enlacesEncontrados.clear();
                    scrollCount = 0;            
                    crearOReiniciarBarraDeProgreso();
                    botonExportar.disabled = true;
                    botonExportar.title = 'Procesando...';
                    procesarPopups(() => {
                        botonExportar.title = 'Haciendo Scroll...';
                        hacerScrollYExtraerContenidoPrincipal();
                    });
                }
            });
            console.log("Botón de exportar añadido a la barra de navegación.");
            return true;
        }
        return false;
    }

    const initInterval = setInterval(() => { if (inicializarBotonEnBarra()) clearInterval(initInterval); }, 1000);

})();