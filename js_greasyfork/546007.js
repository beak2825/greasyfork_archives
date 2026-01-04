// ==UserScript==
// @name         MZ - Cambiar imagen de estadio (Mestalla robusto)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Reemplaza la imagen del estadio en ManagerZone solo si es "Estadi de Mestalla"
// @author       Oz
// @license      MIT
// @match        https://www.managerzone.com/?p=team
// @match        https://www.managerzone.com/?p=stadium
// @match        https://www.managerzone.com/?p=match&sub=result&mid=*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546007/MZ%20-%20Cambiar%20imagen%20de%20estadio%20%28Mestalla%20robusto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546007/MZ%20-%20Cambiar%20imagen%20de%20estadio%20%28Mestalla%20robusto%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ➜ Cambia esta URL si quieres probar otro host
  const nuevaImagen = "https://estadiosfc.com/wp-content/uploads/2020/09/valencia-mestalla.jpg";

  const normalizar = (t) => (t || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const url = location.href;

  function esResultadosMestalla() {
    if (!url.includes("?p=match&sub=result&mid=")) return false;
    // Busca “mestalla” en todo el texto (más tolerante que un selector concreto)
    const texto = normalizar(document.body.innerText) + " " + normalizar(document.title);
    return texto.includes("mestalla");
  }

  function reemplazarIMG(img) {
    try {
      img.removeAttribute("srcset");
      img.removeAttribute("data-src");
      img.removeAttribute("data-lazy");
      img.loading = "eager";
      img.src = nuevaImagen;
    } catch {}
  }

  function esImgEstadio(img) {
    const src = (img.currentSrc || img.src || "").toLowerCase();
    return img.classList.contains("stadium-image") || /stadium|arena|ground/.test(src);
  }

  function esFondoEstadio(el) {
    const cs = getComputedStyle(el);
    const bg = (cs.backgroundImage || "").toLowerCase();
    return bg.includes("url(") && /stadium|arena|ground/.test(bg);
  }

  function reemplazarFondosYImgs(root = document) {
    // <img> de estadio (por clase o por patrón en la URL)
    root.querySelectorAll("img").forEach((img) => {
      if (esImgEstadio(img)) reemplazarIMG(img);
    });

    // Fondos CSS que parezcan de estadio
    root.querySelectorAll("div,section,figure,header,article,aside").forEach((el) => {
      if (esFondoEstadio(el)) {
        el.style.setProperty("background-image", `url("${nuevaImagen}")`, "important");
        el.style.setProperty("background-size", "cover", "important");
        el.style.setProperty("background-position", "center", "important");
      }
    });
  }

  function aplicar() {
    if (url.includes("?p=team") || url.includes("?p=stadium")) {
      // En estas páginas reemplazamos sin condición por nombre
      reemplazarFondosYImgs();
    } else if (esResultadosMestalla()) {
      // En resultados solo si detectamos “Mestalla” en la página
      reemplazarFondosYImgs();
    }
  }

  // Comprobar si la imagen carga (por si hay CSP/hotlink)
  (function testImagen() {
    const t = new Image();
    t.onload = () => console.debug("[MZ estadio] Imagen personalizada accesible.");
    t.onerror = () => console.warn("[MZ estadio] La imagen NO carga (CSP/hotlink/URL inválida). Prueba otra URL o usa data URI.");
    t.src = nuevaImagen + (nuevaImagen.includes("?") ? "&" : "?") + "t=" + Date.now();
  })();

  aplicar();

  // Reaplicar ante cambios de DOM o atributos (SPA/reactividad)
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) { aplicar(); break; }
      if (m.type === "attributes" && (m.attributeName === "src" || m.attributeName === "style" || m.attributeName === "class")) { aplicar(); break; }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "style", "class"] });

})();
