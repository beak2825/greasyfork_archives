// ==UserScript==
// @name         WTL-LAB Parser
// @description  Mejoras para la legibilidad de los capítulos
// @version      2.0.14
// @copyright    2024, trystan4861 (https://openuserjs.org/users/trystan4861)
// @license      MIT
// @author       trystan4861
// @namespace    https://wtr-lab.com/
// @match        https://wtr-lab.com/es/serie-*/*
// @icon         https://wtr-lab.com/images/favicon.png
// @homepageURL  https://openuserjs.org/scripts/trystan4861/WTL-LAB_Parser
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520811/WTL-LAB%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/520811/WTL-LAB%20Parser.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       trystan4861
// ==/OpenUserJS==

/* jshint esversion: 11 */

(function () {
    'use strict';

    const config = {
        delay: 10000,
        estilos: {
            fondoResaltado: "yellow",
            fondoMarcado: "red",
            textoResaltado: "black",
            textoMarcado: "black",
        },
        filtros: {
            toHideEqual: [".", "Xinbiquge"],
            toHideIncludes: [".c0m", ".com"],
            toBreak: ["la versión web es lento", "En el vasto universo, el nacimiento"],
            toDelete: ["window._taboola", "Recordatorio: si descubre que hacer clic"],
        },
        parseW: ["a-miracle-at-the-beginning"],
    };

    const store = {
        ultimaPalabraVisible: null,
        scrollTimeout: null,
        direccionScroll: "down",
        ultimaPosicionScroll: window.scrollY,
        esPrimeraVez: true,
        mutationTimeout: null,
        ultimaPalabraMarcada: null,
        chapterTitle: "",
        sustitutes: {
            RPDC: "corte",
            Yelvzong: "Yelu Zong",
            Yeluzong: "Yelu Zong",
            Yelv: "Yelu",
            Chase: "Perseguidle",
            "【Consejo:": "【Info:",
        },
        transforms: {
            Shangshu: "Ministro",
        },
    };

    GM_addStyle(`
        .resaltado {
            background-color: ${config.estilos.fondoResaltado};
            color: ${config.estilos.textoResaltado};
        }
        .marked {
            background-color: ${config.estilos.fondoMarcado};
            color: ${config.estilos.textoMarcado};
        }
    `);

    function tipoFiltro(texto) {
        const { toBreak, toDelete } = config.filtros;
        if (toBreak.some(filtro => texto.includes(filtro))) return "break";
        return toDelete.some(filtro => texto.includes(filtro)) ? "delete" : null;
    }

    function check2Hide(span) {
        const { toHideIncludes, toHideEqual } = config.filtros;
        if (toHideIncludes.some(t => span.textContent.toLowerCase().includes(t)) ||
            toHideEqual.some(t => span.textContent.trim() === t)) {
            span.style.display = "none";
            return true;
        }
        return false;
    }

    function detectarDireccionScroll() {
        const posicionActual = window.scrollY;
        store.direccionScroll = posicionActual > store.ultimaPosicionScroll ? "down" : "up";
        store.ultimaPosicionScroll = posicionActual;
    }

    function quitarEspacioEntreNumeroYW(texto) {
        const regex = /(\d+(\,\d+)?)(\s)W(?![a-zA-Z0-9])/g;
        return texto.replace(regex, (match, p1) => p1 + "W");
    }

    const localeNumber = s => /^\d{4,}$/.test(String(s).trim()) ? String(s).trim().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : s;
    const fixNumber = s => /^\d+\.\d{2}\.000$/.test(s) ? localeNumber(Number(s.replace(/\./g, '').slice(0, -3)) * 10**2) : s;
    const parseW = palabra => palabra.replace(/([\w]+)?\*?(\d+[\.,]?\d*)[wW](?=\b|\.|$)/g, (_, str, n) => `${str}${str ? '*' : ''}${localeNumber(parseFloat(n.replace(',', '.')) * 10**4)}`);

    const parseE = palabra => palabra.replace(/(\d+([,|\.]\d+)?)[eE]/g, (_, n) => localeNumber(parseFloat(n.replace(',', '.')) * 10**8));
    const parseAll= s => localeNumber(fixNumber(parseW(parseE(s))));

    function sustituirPalabraSwap(texto) {
        const patrones = Object.keys(store.transforms).join("|");
        const regex = new RegExp(`(\\w+)\\s+(${patrones})`, "g");
        return texto.replace(regex, (_, palabra, termino) =>
            `${store.transforms[termino]} ${palabra}`
        );
    }

    function sustituirPalabra(palabra) {
        const regex = new RegExp(`^(${Object.keys(store.sustitutes).join("|")})(\\W.*)?$`);
        return palabra.replace(regex, (_, base, sufijo) =>
            (store.sustitutes[base] || base) + (sufijo || "")
        );
    }

    function getSpansFrom(parrafo) {
        parrafo.innerHTML = parrafo.textContent.trim()
            .split(" ")
            .map(palabra => `<span class="marcable">${sustituirPalabra(parseAll(palabra))} </span>`)
            .join("");
        return Array.from(parrafo.querySelectorAll("span.marcable"));
    }

    function marcarSpan(span) {
        if (store.ultimaPalabraMarcada) {
            store.ultimaPalabraMarcada.element.classList.remove("marked");
            if (store.ultimaPalabraMarcada.element === span) {
                store.ultimaPalabraMarcada = null;
                return;
            }
        }
        span.classList.add("marked");
        store.ultimaPalabraMarcada = { element: span, tiempoMarcado: Date.now() };
    }

    function main() {
        if (!store.chapterTitle) {
            store.chapterTitle = document.querySelector(".chapter-title")?.innerText;
        }
        if (!store.chapterTitle) return;

        store.esPrimeraVez = true;
        store.ultimaPalabraVisible = null;

        let hideAll = false;
        document.querySelectorAll("p").forEach(parrafo => {
            const filtro = tipoFiltro(parrafo.textContent);
            hideAll = hideAll || filtro === "break";
            if (hideAll || filtro === "delete") {
                parrafo.style.display = "none";
                return;
            }
            parrafo.textContent = sustituirPalabraSwap(parrafo.textContent.trim());
            parrafo.textContent = quitarEspacioEntreNumeroYW(parrafo.textContent);
            const spans = getSpansFrom(parrafo);
            spans.forEach(span => {
                if (check2Hide(span)) return;
                observer.observe(span);
                span.addEventListener("click", () => marcarSpan(span));
            });
        });

        if (store.ultimaPalabraMarcada && document.contains(store.ultimaPalabraMarcada.element)) {
            store.ultimaPalabraMarcada.element.classList.add("marked");
        }
    }

    const observer = new IntersectionObserver((entradas) => {
        const ultimaVisible = entradas.filter(e => e.isIntersecting).at(-1)?.target;
        if (!ultimaVisible) return;
        if (store.esPrimeraVez) {
            store.ultimaPalabraVisible?.classList.remove("resaltado");
            ultimaVisible.classList.add("resaltado");
            store.ultimaPalabraVisible = ultimaVisible;
            store.esPrimeraVez = false;
            return;
        }
        if (store.direccionScroll === "down" && ultimaVisible !== store.ultimaPalabraVisible) {
            clearTimeout(store.scrollTimeout);
            store.scrollTimeout = setTimeout(() => {
                store.ultimaPalabraVisible?.classList.remove("resaltado");
                ultimaVisible.classList.add("resaltado");
                store.ultimaPalabraVisible = ultimaVisible;
            }, config.delay);
        }
    }, { threshold: 1.0 });

    const mutationObserver = new MutationObserver(() => {
        const nuevoTitulo = document.querySelector(".chapter-title")?.innerText;
        if (nuevoTitulo !== store.chapterTitle) {
            store.chapterTitle = nuevoTitulo;
            clearTimeout(store.mutationTimeout);
            store.mutationTimeout = setTimeout(main, 100);
        }
    });

    if (document.querySelector(".chapter-title")) {
        const contenedorPrincipal = document.body;
        mutationObserver.observe(contenedorPrincipal, { childList: true, subtree: true });
        window.addEventListener("scroll", detectarDireccionScroll);
        window.addEventListener("load", main);
    }
})();
