// ==UserScript==
// @name         Botones SII Mejorado v3.1 (Animación JS Restaurada)
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Agrega botones al SII con animaciones suaves en cascada (JS) y protección de clics.
// @license      MIT
// @match        *.sii.cl/*
// @exclude      https://www4.sii.cl/rfiInternet/formCompacto?folio=*
// @exclude      https://www4.sii.cl/rfiInternet/?opcionPagina=formCompleto&folio=*
// @exclude      https://www4.sii.cl/rfiInternet/formSolemne?folio=*
// @exclude      https://zeusr.sii.cl//AUT2000/InicioAutenticacion/IngresoRutClave.html?https://misiir.sii.cl/cgi_misii/siihome.cgi*
// @exclude      https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html?*
// @exclude      https://www1.sii.cl/cgi-bin/Portal001/mipeShowPdf.cgi?CODIGO=*
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/489815/Botones%20SII%20Mejorado%20v31%20%28Animaci%C3%B3n%20JS%20Restaurada%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489815/Botones%20SII%20Mejorado%20v31%20%28Animaci%C3%B3n%20JS%20Restaurada%29.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        storageKey: 'estadoBotonesSII',
        staggerMs: 40, // Retraso en ms entre cada botón para la cascada (JS)
        animSpeedMs: 300 // Debe coincidir con la transición CSS (0.3s)
    };

    const BOTONES_DATA = [
        { text: 'Ingresar SII', url: 'https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html?https://misiir.sii.cl/cgi_misii/siihome.cgi', desc: 'Ingresa Nueva Empresa en otra Ventana', bottom: '260px', width: '150px', newTab: true },
        { text: 'Declaración Jurada', url: 'https://www4.sii.cl/perfilamientodjui/#/declaracionJuradaRenta', desc: 'Declaraciones Juradas de Renta', bottom: '230px', width: '150px' },
        { text: 'Declaración Renta', url: 'https://www4.sii.cl/consultaestadof22ui/', desc: 'Consulta de Estado de Declaración de Renta', bottom: '200px', width: '150px' },
        { text: 'IVA', url: 'https://www4.sii.cl/sifmConsultaInternet/index.html?dest=cifxx&form=29', desc: 'Consultar Declaración IVA (F29)', bottom: '170px', width: '150px' },
        { text: '<<', url: 'https://www4.sii.cl/propuestaf29ui/internet/', desc: 'Declaración del IVA (F29)', bottom: '170px', right: '158px', width: '35px', isSmall: true },
        { text: 'Honorarios', url: 'https://loa.sii.cl/cgi_IMT/TMBCOC_MenuConsultasContribRec.cgi?dummy=1461943244650', desc: 'Boleta de Honorarios Recibidas', bottom: '140px', width: '150px' },
        { text: '<<', url: 'https://loa.sii.cl/cgi_IMT/TMBCOC_MenuConsultasContrib.cgi?dummy=1461943167534', desc: 'Boleta de Honorarios Emitidas', bottom: '140px', right: '158px', width: '35px', isSmall: true },
        { text: 'Honorarios Terceros', url: 'https://zeus.sii.cl/cvc_cgi/bte/bte_indiv_cons?1', desc: 'Boletas de Honorarios Terceros Emitidas', bottom: '110px', width: '150px' },
        { text: '<<', url: 'https://zeus.sii.cl/cvc_cgi/bte/bte_indiv_cons?2', desc: 'Boleta de Honorarios Terceros Recibidas', bottom: '110px', right: '158px', width: '35px', isSmall: true },
        { text: 'R. Compras y Ventas', url: 'https://www4.sii.cl/consdcvinternetui/#/index', desc: 'Registro de Compras y Ventas', bottom: '80px', width: '150px' },
        { text: '<<', url: 'https://www1.sii.cl/cgi-bin/Portal001/mipeLaunchPage.cgi?OPCION=1&TIPO=4', desc: 'Ver Facturas de Compras', bottom: '80px', right: '158px', width: '35px', isSmall: true },
    ];

    // --- ESTILOS CSS ---
    const CSS_STYLES = `
        :host {
            --color-principal: #004E7C;
            --color-hover: #007AB8;
            --color-texto: #ffffff;
            /* Coincide con CONFIG.animSpeedMs */
            --anim-speed: 0.3s;
        }
        .contenedor-botones {
            position: fixed; z-index: 9999; bottom: 0; right: 0; width: 100%; height: 100%; pointer-events: none;
        }
        .sii-btn {
            position: fixed; right: 15px;
            background-color: var(--color-principal); color: var(--color-texto);
            border: 2px solid var(--color-principal); padding: 8px 10px;
            cursor: pointer; border-radius: 3px; font-family: Calibri, sans-serif;
            font-size: 14px; text-align: center; pointer-events: auto; user-select: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0);
            
            /* Animación Base */
            opacity: 1;
            transform: translateX(0);
            transition: transform 0.2s, background-color 0.2s, opacity var(--anim-speed), transform var(--anim-speed);
        }
        .sii-btn:hover {
            background-color: var(--color-hover); border-color: var(--color-hover);
            transform: scale(1.05); z-index: 10000;
        }
        /* Estado Oculto (Simplificado para JS) */
        .sii-btn.oculto {
            transform: translateX(150%);
            opacity: 0;
            pointer-events: none;
        }
        .toggle-btn { bottom: 10px; min-width: 40px; z-index: 10001; }
        .toggle-btn.disabled { cursor: wait; opacity: 0.7; }
    `;

    // --- CONSTRUCCIÓN DEL DOM ---
    const host = document.createElement('div');
    host.id = 'sii-tools-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const styleSheet = document.createElement('style');
    styleSheet.textContent = CSS_STYLES;
    shadow.appendChild(styleSheet);

    const container = document.createElement('div');
    container.className = 'contenedor-botones';
    
    const fragment = document.createDocumentFragment();
    const botonesDOM = []; // Referencia para animar

    BOTONES_DATA.forEach((data) => {
        const btn = document.createElement('button');
        btn.className = 'sii-btn';
        btn.textContent = data.text;
        btn.title = data.desc || '';
        
        btn.style.bottom = data.bottom;
        btn.style.width = data.width;
        if (data.right) btn.style.right = data.right;
        if (data.isSmall) btn.style.padding = '8px 2px';

        btn.onclick = (e) => {
            if (data.newTab || e.ctrlKey || e.metaKey) window.open(data.url, '_blank');
            else window.location.href = data.url;
        };
        botonesDOM.push(btn);
        fragment.appendChild(btn);
    });

    // Botón Toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sii-btn toggle-btn';
    fragment.appendChild(toggleBtn);
    container.appendChild(fragment);
    shadow.appendChild(container);

    // --- LÓGICA DE ANIMACIÓN JS
    let isAnimating = false;
    let isHidden = await GM.getValue(CONFIG.storageKey, false);

    // Función principal de visualización con animación JS
    const actualizarEstadoVisual = (estaOculto, animar = false) => {
        toggleBtn.textContent = estaOculto ? '<<' : '>>';
        toggleBtn.title = estaOculto ? 'Mostrar Herramientas' : 'Ocultar Herramientas';
        
        if (animar) {
            isAnimating = true;
            toggleBtn.classList.add('disabled');
        }

        botonesDOM.forEach((btn, index) => {
            // Si animamos, calculamos el delay. Si es la carga inicial, es 0.
            const delay = animar ? index * CONFIG.staggerMs : 0;

            setTimeout(() => {
                if (estaOculto) btn.classList.add('oculto');
                else btn.classList.remove('oculto');
            }, delay);
        });

        // Desbloquear al terminar todas las animaciones
        if (animar) {
            // Tiempo total = delay del último botón + tiempo de su transición CSS
            const totalTime = ((botonesDOM.length - 1) * CONFIG.staggerMs) + CONFIG.animSpeedMs + 50; // +50ms margen
            setTimeout(() => {
                isAnimating = false;
                toggleBtn.classList.remove('disabled');
            }, totalTime);
        }
    };

    // Carga inicial (sin animación)
    actualizarEstadoVisual(isHidden, false);

    toggleBtn.onclick = async () => {
        if (isAnimating) return; // Prevenir spam de clics
        isHidden = !isHidden;
        await GM.setValue(CONFIG.storageKey, isHidden);
        // Ejecutar con animación
        actualizarEstadoVisual(isHidden, true);
    };

    // --- UTILIDADES (Igual que v3.0) ---

    // 1. ESC Key Listener (Debounced)
    let escDebounce = false;
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !escDebounce) {
            const homeURL = 'https://misiir.sii.cl/cgi_misii/siihome.cgi';
            if (window.location.href !== homeURL) {
                escDebounce = true;
                window.location.href = homeURL;
                setTimeout(() => escDebounce = false, 1000);
            }
        }
    });
})();