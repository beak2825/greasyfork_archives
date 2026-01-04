// ==UserScript==
// @name         Descargar Código Web ZIP
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Guarda el código fuente de cualquier página web en un archivo ZIP manteniendo su estructura de carpetas.
// @author       TuNombre
// @match        *://*/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @locale       es
// @downloadURL https://update.greasyfork.org/scripts/527311/Descargar%20C%C3%B3digo%20Web%20ZIP.user.js
// @updateURL https://update.greasyfork.org/scripts/527311/Descargar%20C%C3%B3digo%20Web%20ZIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchResource(url) {
        try {
            let response = await fetch(url);
            if (!response.ok) throw new Error(`Error al obtener ${url}`);
            return await response.text();
        } catch (error) {
            console.error(error);
            return `// No se pudo obtener: ${url}`;
        }
    }

    function getRelativePath(url) {
        let urlObj = new URL(url, window.location.origin);
        return urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
    }

    async function downloadPageAsZip() {
        let zip = new JSZip();
        let hostname = window.location.hostname;

        // Obtener HTML principal
        let htmlContent = document.documentElement.outerHTML;
        zip.file("index.html", htmlContent);

        // Obtener archivos CSS y JS externos
        let resources = [...document.querySelectorAll('link[rel="stylesheet"], script[src]')];
        for (let res of resources) {
            let url = res.href || res.src;
            let relativePath = getRelativePath(url);
            let content = await fetchResource(url);
            zip.file(relativePath, content);
        }

        // Generar y descargar el ZIP
        zip.generateAsync({ type: "blob" }).then(function(content) {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = `${hostname}_code.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Crear botón en la interfaz
    let button = document.createElement("button");
    button.innerText = "Descargar Código ZIP";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
    
    button.addEventListener("click", downloadPageAsZip);
})();