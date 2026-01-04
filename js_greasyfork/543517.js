// ==UserScript==
// @name         Preguntados Auto-Respuestas
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Detecta automáticamente las respuestas correctas en Preguntados con categoría
// @author       Hann
// @match        https://preguntados.com/*
// @match        https://*.preguntados.com/*
// @match        https://api.web.triviacrack.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543517/Preguntados%20Auto-Respuestas.user.js
// @updateURL https://update.greasyfork.org/scripts/543517/Preguntados%20Auto-Respuestas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables globales
    let preguntaActual = null;
    let respuestaCorrecta = null;
    let categoriaActual = null;

    // Mapeo de categorías para mostrar nombres más claros
    const categorias = {
        'entertainment': '🎬 Entretenimiento',
        'sports': '⚽ Deportes',
        'history': '📚 Historia',
        'art': '🎨 Arte',
        'science': '🔬 Ciencia',
        'geography': '🌍 Geografía',
        'crown': '👑 Corona (Elige categoría)'
    };

    console.log('🚀 Script iniciado - interceptando todas las llamadas de red');

    // Interceptar XMLHttpRequest con manejo de arraybuffer
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(method, url, ...args) {
            this._method = method;
            this._url = url;
            console.log(`🌐 XHR ${method}: ${url}`);
            return originalOpen.apply(this, [method, url, ...args]);
        };

        xhr.send = function(...args) {
            this.addEventListener('load', function() {
                console.log(`📨 XHR Response (${this._method} ${this._url}):`, this.status, 'ResponseType:', this.responseType);

                // Interceptar todas las llamadas que contengan triviacrack
                if (this._url && this._url.includes('triviacrack')) {
                    try {
                        let responseData;

                        // Manejar diferentes tipos de respuesta
                        if (this.responseType === 'arraybuffer') {
                            // Convertir arraybuffer a texto
                            const decoder = new TextDecoder('utf-8');
                            const text = decoder.decode(this.response);
                            responseData = JSON.parse(text);
                        } else if (this.responseType === '' || this.responseType === 'text') {
                            responseData = JSON.parse(this.responseText);
                        } else if (this.responseType === 'json') {
                            responseData = this.response;
                        } else {
                            console.log('🔍 Tipo de respuesta no manejado:', this.responseType);
                            return;
                        }

                        console.log('📋 Response data:', responseData);
                        procesarRespuestaAPI(responseData, this._url);
                    } catch (e) {
                        console.log('⚠️ Error parseando respuesta:', e);
                        console.log('📄 Response type:', this.responseType);
                        console.log('📄 Response:', this.response);
                    }
                }
            });
            return originalSend.apply(this, args);
        };

        return xhr;
    };

    // Interceptar fetch con manejo mejorado
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        console.log(`🌐 FETCH: ${url}`);

        return originalFetch.apply(this, args).then(response => {
            console.log(`📨 FETCH Response (${url}):`, response.status);

            if (url.includes('triviacrack')) {
                // Clonar la respuesta y leer como texto primero
                return response.clone().text().then(text => {
                    try {
                        const data = JSON.parse(text);
                        console.log('📋 FETCH data:', data);
                        procesarRespuestaAPI(data, url);
                    } catch (e) {
                        console.log('⚠️ Error parseando respuesta FETCH:', e);
                        console.log('📄 Raw text:', text);
                    }
                    return response;
                }).catch(err => {
                    console.log('⚠️ Error clonando respuesta FETCH:', err);
                    return response;
                });
            }
            return response;
        });
    };

    // Procesar respuesta de la API con detección de categoría
    function procesarRespuestaAPI(data, url) {
        console.log(`🔍 Procesando API response de: ${url}`);
        console.log('📊 Estructura completa de datos:', data);

        // Función recursiva mejorada para buscar preguntas
        function buscarTodasLasPreguntas(obj, path = '', depth = 0) {
            if (depth > 10) return; // Evitar recursión infinita

            if (typeof obj === 'object' && obj !== null) {
                // Buscar propiedades específicas de preguntas
                if (obj.text && obj.answers && Array.isArray(obj.answers) && typeof obj.correct_answer_id !== 'undefined') {
                    console.log(`🎯 PREGUNTA ENCONTRADA en ${path}:`, obj);

                    // Buscar categoría en el objeto o en objetos padre
                    let categoria = obj.category || obj.type || null;

                    // Buscar en el contexto padre si no se encuentra categoría
                    if (!categoria && path) {
                        const pathParts = path.split('.');
                        let currentObj = data;
                        for (let i = 0; i < pathParts.length - 1; i++) {
                            currentObj = currentObj[pathParts[i]];
                            if (currentObj && (currentObj.category || currentObj.type)) {
                                categoria = currentObj.category || currentObj.type;
                                break;
                            }
                        }
                    }

                    // Detectar si es una pregunta de corona por el contexto
                    if (!categoria && (path.includes('crown') || url.includes('crown') || obj.crown)) {
                        categoria = 'crown';
                    }

                    preguntaActual = {
                        id: obj.id,
                        texto: obj.text,
                        respuestas: obj.answers,
                        correcta_id: obj.correct_answer_id,
                        categoria: categoria
                    };

                    respuestaCorrecta = obj.answers.find(a => a.id === obj.correct_answer_id);
                    categoriaActual = categoria;

                    console.log('✅ Pregunta procesada:', preguntaActual.texto);
                    console.log('✅ Categoría detectada:', categoria);
                    console.log('✅ Respuesta correcta encontrada:', respuestaCorrecta);

                    mostrarRespuesta();
                    return true;
                }

                // Continuar búsqueda recursiva
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const newPath = path ? `${path}.${key}` : key;

                        // Log de propiedades interesantes incluyendo categorías
                        if (key === 'questions' || key === 'main' || key === 'spin' || key === 'turn' || key === 'crown' || key === 'category') {
                            console.log(`🔎 Explorando ${newPath}:`, obj[key]);
                        }

                        if (buscarTodasLasPreguntas(obj[key], newPath, depth + 1)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        // Ejecutar búsqueda
        if (!buscarTodasLasPreguntas(data)) {
            console.log('❌ No se encontraron preguntas en esta respuesta');
        }
    }

    // Mostrar respuesta correcta con categoría
    function mostrarRespuesta() {
        console.log('🖥️ Intentando mostrar respuesta...');

        // Intentar crear el panel si no existe
        let panel = document.getElementById('panel-respuesta');
        if (!panel) {
            console.log('⚠️ Panel no encontrado, creando uno nuevo...');
            crearPanelRespuesta();
            panel = document.getElementById('panel-respuesta');
        }

        if (!panel) {
            console.log('❌ Error: No se pudo crear el panel');
            return;
        }

        if (respuestaCorrecta && respuestaCorrecta.text) {
            console.log('✅ Mostrando respuesta:', respuestaCorrecta.text);

            const categoriaEl = document.getElementById('categoria-texto');
            const textoEl = document.getElementById('respuesta-texto');

            if (categoriaEl && textoEl) {
                // Mostrar categoría
                const nombreCategoria = categorias[categoriaActual] || (categoriaActual ? `📂 ${categoriaActual}` : '❓ Categoría desconocida');
                categoriaEl.textContent = nombreCategoria;
                categoriaEl.style.color = categoriaActual === 'crown' ? '#ffd700' : '#00bfff';

                // Mostrar respuesta
                textoEl.textContent = respuestaCorrecta.text;
                textoEl.style.color = '#00ff00';
                textoEl.style.fontSize = '18px';
                textoEl.style.fontWeight = 'bold';

                // Hacer que parpadee para llamar la atención
                textoEl.style.animation = 'blink 1s linear infinite';

                // Si es corona, hacer que el panel parpadee también
                if (categoriaActual === 'crown') {
                    panel.style.borderColor = '#ffd700';
                    panel.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.7)';
                    panel.style.animation = 'blink 2s linear infinite';
                } else {
                    panel.style.borderColor = '#00ff00';
                    panel.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
                    panel.style.animation = 'none';
                }
            }
        } else {
            console.log('❌ No hay respuesta correcta para mostrar');
            const textoEl = document.getElementById('respuesta-texto');
            const categoriaEl = document.getElementById('categoria-texto');
            if (textoEl) {
                textoEl.textContent = 'Sin respuesta disponible';
                textoEl.style.color = '#ff0000';
            }
            if (categoriaEl) {
                categoriaEl.textContent = '';
            }
        }
    }

    // Estilos mejorados con soporte para categorías
    const estilos = `
        .respuesta-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.95);
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            z-index: 99999;
            font-weight: bold;
            min-width: 280px;
            border: 3px solid #00ff00;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        }
        .categoria-info {
            font-size: 14px;
            margin-bottom: 10px;
            padding: 5px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            text-align: center;
        }
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;

    // Crear panel mejorado con categoría
    function crearPanelRespuesta() {
        console.log('🎨 Creando panel de respuesta...');

        // Eliminar panel existente si lo hay
        const panelExistente = document.getElementById('panel-respuesta');
        if (panelExistente) {
            panelExistente.remove();
        }

        const panel = document.createElement('div');
        panel.className = 'respuesta-panel';
        panel.id = 'panel-respuesta';
        panel.innerHTML = `
            <div><strong>🎯 AUTO-RESPUESTAS</strong></div>
            <div id="categoria-texto" class="categoria-info" style="margin-top: 5px; font-size: 14px; color: #00bfff;">Esperando categoría...</div>
            <div><strong>Respuesta:</strong></div>
            <div id="respuesta-texto" style="margin-top: 10px; font-size: 18px; color: #00ff00; font-weight: bold;">Esperando pregunta...</div>
        `;

        // Asegurar que se añada al body
        if (document.body) {
            document.body.appendChild(panel);
            console.log('✅ Panel añadido al body');
        } else {
            // Si el body no está listo, esperar
            setTimeout(() => {
                if (document.body) {
                    document.body.appendChild(panel);
                    console.log('✅ Panel añadido al body (delayed)');
                }
            }, 1000);
        }
    }

    // Inicializar mejorado
    function inicializar() {
        console.log('🔧 Inicializando script...');

        // Insertar estilos
        const styleEl = document.createElement('style');
        styleEl.textContent = estilos;

        if (document.head) {
            document.head.appendChild(styleEl);
            console.log('✅ Estilos añadidos');
        }

        // Crear panel
        setTimeout(crearPanelRespuesta, 500);

        console.log('✅ Auto-Respuestas Preguntados iniciado completamente');
    }

    // Ejecutar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 1000);
    }
})();
