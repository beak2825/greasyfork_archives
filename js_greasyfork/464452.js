// ==UserScript==
// @name         WME - UR Manager
// @namespace    http://waze.com/
// @version      2025.04.17.15
// @description  Gestión de URs 
// @author       Crotalo
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/464452/WME%20-%20UR%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/464452/WME%20-%20UR%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MENSAJE_RESPUESTA: "¡Hola, Wazer! Gracias por tu reporte. Para resolverlo de forma efectiva, necesitamos un poco más de detalle sobre lo sucedido. Quedamos atentos a tu respuesta.",
        MENSAJE_CIERRE: "¡¡Hola Wazer! Buen día, Lamentablemente no pudimos solucionar el error en esta ocasión. Por favor, déjanos más datos la próxima vez. Gracias por reportar. ",
        MENSAJE_RESUELTA: "¡Hola Wazer! Buen día, el problema fue solucionado y se verá reflejado en la aplicación en la próxima actualización del mapa, esta tomará entre 3 y 5 días. ¡Gracias por reportar!!",
        DEBUG: true,
        BOTON_ID: 'urna-btn-fecha-exacta',
        PANEL_ID: 'urna-panel-fecha-exacta',
        INTERVALO_VERIFICACION: 5000,
        UMBRAL_VIEJO: 7,
        UMBRAL_RECIENTE: 3,
        RETRASO_ENTRE_ACCIONES: 800
    };

    GM_addStyle(`
        #${CONFIG.BOTON_ID} {
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            z-index: 99999 !important;
            padding: 10px 15px !important;
            background: #3498db !important;
            color: white !important;
            font-weight: bold !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-family: Arial, sans-serif !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
        }
        #${CONFIG.PANEL_ID} {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 500px;
            max-height: 70vh;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            background: white;
            border: 2px solid #999;
            z-index: 99998;
            font-family: Arial, sans-serif;
            font-size: 13px;
            box-shadow: 2px 2px 15px rgba(0,0,0,0.3);
            border-radius: 5px;
            display: none;
        }
        #${CONFIG.PANEL_ID} .panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            max-height: calc(70vh - 60px);
        }
        #${CONFIG.PANEL_ID} table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        #${CONFIG.PANEL_ID} th {
            position: sticky;
            top: 0;
            background-color: #f2f2f2;
            z-index: 10;
        }
        #${CONFIG.PANEL_ID} th, #${CONFIG.PANEL_ID} td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        .ur-old { color: #d9534f; font-weight: bold; }
        .ur-recent { color: #5bc0de; }
        .ur-new { color: #5cb85c; }
        .ur-visitada { background-color: #fdf5d4 !important; }
        .ur-no-fecha { color: #777; font-style: italic; }
        .ur-cerrada { text-decoration: line-through; opacity: 0.6; }
        .btn-centrar {
            padding: 4px 8px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .panel-footer {
            padding: 10px 15px;
            background: #f8f8f8;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: center;
            gap: 10px;
            position: sticky;
            bottom: 0;
            z-index: 20;
            height: 60px;
        }
        .btn-global {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            white-space: nowrap;
        }
        .btn-responder {
            background: #f0ad4e;
            color: white;
        }
        .btn-cerrar {
            background: #5cb85c;
            color: white;
        }
        .btn-resuelta {
            background: #5bc0de;
            color: white;
        }
    `);

    let estado = {
        URsActuales: [],
        panelVisible: false,
        botonUR: null,
        intervaloVerificacion: null,
        timeouts: [],
        accionEnProgreso: false
    };

    function debugLog(message) {
        if (CONFIG.DEBUG) console.log('[UR Script] ' + message);
    }

    function limpiarTimeouts() {
        estado.timeouts.forEach(timeout => clearTimeout(timeout));
        estado.timeouts = [];
    }

    function agregarTimeout(callback, delay) {
        const timeoutId = setTimeout(() => {
            callback();
            estado.timeouts = estado.timeouts.filter(id => id !== timeoutId);
        }, delay);
        estado.timeouts.push(timeoutId);
        return timeoutId;
    }

    function togglePanelURs() {
        if (estado.panelVisible) {
            $(`#${CONFIG.PANEL_ID}`).fadeOut(300, function() {
                $(this).remove();
            });
            estado.panelVisible = false;
            limpiarTimeouts();
        } else {
            mostrarPanelURs();
        }
    }

    function crearBoton() {
        if ($(`#${CONFIG.BOTON_ID}`).length > 0) return;

        debugLog('Creando botón...');
        estado.botonUR = $(`<button id="${CONFIG.BOTON_ID}">📝 UR Manager</button>`)
            .appendTo('body')
            .on('click', togglePanelURs);

        debugLog('Botón creado exitosamente');
    }

    function parsearFecha(valor) {
        if (!valor) return null;

        if (typeof valor === 'object' && '_seconds' in valor) {
            try {
                return new Date(valor._seconds * 1000 + (valor._nanoseconds / 1000000));
            } catch (e) {
                debugLog(`Error parseando Firebase Timestamp: ${JSON.stringify(valor)}`);
            }
        }

        if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            try {
                return new Date(valor);
            } catch (e) {
                debugLog(`Error parseando fecha ISO: ${valor}`);
            }
        }

        if (/^\d+$/.test(valor)) {
            try {
                const num = parseInt(valor);
                return new Date(num > 1000000000000 ? num : num * 1000);
            } catch (e) {
                debugLog(`Error parseando timestamp numérico: ${valor}`);
            }
        }

        return null;
    }

    function obtenerFechaCreacionExacta(ur) {
        try {
            if (ur.attributes.driveDate) {
                const fecha = parsearFecha(ur.attributes.driveDate);
                if (fecha) return fecha;
            }
            return null;
        } catch (e) {
            debugLog(`Error obteniendo fecha: ${e}`);
            return null;
        }
    }

    function clasificarUR(fecha) {
        if (!fecha) return { estado: "Sin fecha", clase: "ur-no-fecha" };

        const hoy = new Date();
        const diff = hoy - fecha;
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (dias > CONFIG.UMBRAL_VIEJO) return { estado: `Antigua (${dias}d)`, clase: "ur-old" };
        if (dias > CONFIG.UMBRAL_RECIENTE) return { estado: `Reciente (${dias}d)`, clase: "ur-recent" };
        return { estado: `Nueva (${dias}d)`, clase: "ur-new" };
    }

    function mostrarPanelURs() {
        estado.panelVisible = true;
        limpiarTimeouts();
        $(`#${CONFIG.PANEL_ID}`).remove();

        const panel = $(`<div id="${CONFIG.PANEL_ID}">`);
        const panelContent = $('<div class="panel-content">');
        const panelFooter = $(`
            <div class="panel-footer">
                <button class="btn-global btn-responder" id="responder-todas">Preguntar</button>
                <button class="btn-global btn-resuelta" id="resolver-todas">Resuelta</button>
                <button class="btn-global btn-cerrar" id="cerrar-todas">No Identificada</button>
            </div>
        `);

        estado.URsActuales = obtenerURsSinAtender();

        if (estado.URsActuales.length === 0) {
            panelContent.html('<div style="padding:15px;text-align:center;"><b>No hay URs sin atender visibles</b></div>');
        } else {
            let tablaHTML = `
                <h3 style="margin-top:0;">URs Activas: ${estado.URsActuales.length}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Fecha Creación</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>`;

            estado.URsActuales.forEach(ur => {
                const id = ur.attributes.id;
                const tipo = ur.attributes.type || 'Desconocido';
                const fecha = obtenerFechaCreacionExacta(ur);
                const clasificacion = clasificarUR(fecha);

                let fechaStr = 'No disponible';
                if (fecha) {
                    fechaStr = fecha.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }

                tablaHTML += `
                    <tr id="fila-ur-${id}">
                        <td>${id}</td>
                        <td>${tipo}</td>
                        <td>${fechaStr}</td>
                        <td class="${clasificacion.clase}">${clasificacion.estado}</td>
                        <td><button class="btn-centrar" data-id="${id}">🗺️ Centrar</button></td>
                    </tr>`;
            });

            panelContent.html(`
                ${tablaHTML}
                    </tbody>
                </table>
            `);

            panelContent.on('click', '.btn-centrar', function() {
                if (estado.accionEnProgreso) return;
                const id = $(this).data('id');
                centrarYMostrarUR(id);
                $(`#fila-ur-${id}`).addClass('ur-visitada');
            });
        }

        panelFooter.on('click', '#responder-todas', function() {
            if (estado.accionEnProgreso) return;
            estado.URsActuales.forEach((ur, index) => {
                agregarTimeout(() => responderUR(ur.attributes.id), index * CONFIG.RETRASO_ENTRE_ACCIONES);
            });
        });

        panelFooter.on('click', '#resolver-todas', function() {
            if (estado.accionEnProgreso) return;
            estado.URsActuales.forEach((ur, index) => {
                agregarTimeout(() => resolverUR(ur.attributes.id), index * CONFIG.RETRASO_ENTRE_ACCIONES);
            });
        });

        panelFooter.on('click', '#cerrar-todas', function() {
            if (estado.accionEnProgreso) return;
            estado.URsActuales.forEach((ur, index) => {
                agregarTimeout(() => cerrarUR(ur.attributes.id), index * CONFIG.RETRASO_ENTRE_ACCIONES);
            });
        });

        panel.append(panelContent);
        panel.append(panelFooter);
        panel.appendTo('body').fadeIn(300);
    }

    function obtenerURsSinAtender() {
        try {
            if (!W.model?.mapUpdateRequests?.objects) return [];

            const bounds = W.map.getExtent();
            return Object.values(W.model.mapUpdateRequests.objects)
                .filter(ur => {
                    const geom = ur.getOLGeometry?.();
                    if (!geom) return false;

                    const center = geom.getBounds().getCenterLonLat();
                    if (!bounds.containsLonLat(center)) return false;

                    if (ur.attributes.resolved) return false;

                    const comentarios = ur.attributes.comments || [];
                    return !comentarios.some(c => c.type === 'user' && c.text?.trim().length > 0);
                });
        } catch (e) {
            debugLog('Error obteniendo URs: ' + e);
            return [];
        }
    }

    function centrarYMostrarUR(id) {
        if (estado.accionEnProgreso) return;
        estado.accionEnProgreso = true;

        limpiarTimeouts();

        const ur = W.model.mapUpdateRequests.getObjectById(Number(id));
        if (!ur) {
            debugLog(`UR ${id} no encontrada`);
            estado.accionEnProgreso = false;
            return;
        }

        if (ur.attributes.resolved) {
            debugLog(`UR ${id} ya está resuelta`);
            $(`#fila-ur-${id}`).addClass('ur-cerrada').find('.btn-centrar').prop('disabled', true);
            estado.accionEnProgreso = false;
            return;
        }

        const geom = ur.getOLGeometry?.();
        if (geom) {
            const center = geom.getBounds().getCenterLonLat();
            W.map.setCenter(center, 17);

            agregarTimeout(() => {
                try {
                    if (W.control?.MapUpdateRequest?.show) {
                        W.control.MapUpdateRequest.show(ur);
                    } else if (W.control?.MapProblem?.show) {
                        W.control.MapProblem.show(ur);
                    } else if (W.control?.UR?.show) {
                        W.control.UR.show(ur);
                    } else if (W.selectionManager) {
                        W.selectionManager.select([ur]);
                    }
                    $(`#fila-ur-${id}`).addClass('ur-visitada');
                } catch (e) {
                    debugLog(`Error al mostrar UR ${id}: ${e}`);
                } finally {
                    estado.accionEnProgreso = false;
                }
            }, 300);
        } else {
            debugLog(`No se pudo obtener geometría para UR ${id}`);
            estado.accionEnProgreso = false;
        }
    }

    function responderUR(id) {
        if (estado.accionEnProgreso) return;
        estado.accionEnProgreso = true;

        limpiarTimeouts();
        const ur = W.model.mapUpdateRequests.getObjectById(Number(id));
        if (!ur) {
            estado.accionEnProgreso = false;
            return;
        }

        centrarYMostrarUR(id);

        agregarTimeout(() => {
            const commentField = $('.new-comment-text');
            if (commentField.length) {
                commentField.val(CONFIG.MENSAJE_RESPUESTA);
                const sendButton = $('.send-button');
                if (sendButton.length) {
                    sendButton.click();
                }
            }
            estado.accionEnProgreso = false;
        }, 1500);
    }

    function resolverUR(id) {
        if (estado.accionEnProgreso) return;
        estado.accionEnProgreso = true;

        limpiarTimeouts();
        const ur = W.model.mapUpdateRequests.getObjectById(Number(id));
        if (!ur) {
            estado.accionEnProgreso = false;
            return;
        }

        centrarYMostrarUR(id);

        agregarTimeout(() => {
            const commentField = $('.new-comment-text');
            if (commentField.length) {
                commentField.val(CONFIG.MENSAJE_RESUELTA);

                const resueltaButton = $('label[for="state-solved"]');
                if (resueltaButton.length) {
                    resueltaButton.click();

                    agregarTimeout(() => {
                        const sendButton = $('.send-button');
                        if (sendButton.length) {
                            sendButton.click();
                        }
                        const noIssueButton = document.querySelector('[data-status="NO_ISSUE"]');
                        if (noIssueButton) noIssueButton.click();

                        const okButton = Array.from(document.querySelectorAll('button')).find(btn =>
                            btn.textContent.trim().includes('OK') || btn.textContent.trim().includes('Aplicar')
                        );
                        if (okButton) okButton.click();

                        agregarTimeout(() => {
                            $(`#fila-ur-${id}`).addClass('ur-cerrada').find('.btn-centrar').prop('disabled', true);
                            estado.accionEnProgreso = false;
                        }, 500);
                    }, 300);
                } else {
                    estado.accionEnProgreso = false;
                }
            } else {
                estado.accionEnProgreso = false;
            }
        }, 1500);
    }

    function cerrarUR(id) {
        if (estado.accionEnProgreso) return;
        estado.accionEnProgreso = true;

        limpiarTimeouts();
        const ur = W.model.mapUpdateRequests.getObjectById(Number(id));
        if (!ur) {
            estado.accionEnProgreso = false;
            return;
        }

        centrarYMostrarUR(id);

        agregarTimeout(() => {
            const commentField = $('.new-comment-text');
            if (commentField.length) {
                commentField.val(CONFIG.MENSAJE_CIERRE);
                const sendButton = $('.send-button');
                if (sendButton.length) {
                    sendButton.click();

                    agregarTimeout(() => {
                        const niButton = $('label[for="state-not-identified"]');
                        if (niButton.length) {
                            niButton.click();

                            agregarTimeout(() => {
                                $(`#fila-ur-${id}`).addClass('ur-cerrada').find('.btn-centrar').prop('disabled', true);
                                estado.accionEnProgreso = false;
                            }, 500);
                        } else {
                            estado.accionEnProgreso = false;
                        }
                    }, 300);
                } else {
                    estado.accionEnProgreso = false;
                }
            } else {
                estado.accionEnProgreso = false;
            }
        }, 1500);
        estado.accionEnProgreso = false;
    }

    function inicializarScript() {
        debugLog('Inicializando script...');
        window.togglePanelURs = togglePanelURs;
        crearBoton();

        estado.intervaloVerificacion = setInterval(() => {
            if ($(`#${CONFIG.BOTON_ID}`).length === 0) {
                debugLog('Botón no encontrado, recreando...');
                crearBoton();
            }
        }, CONFIG.INTERVALO_VERIFICACION);

        debugLog('Script inicializado correctamente');
    }

    function esperarWME() {
        if (typeof W === 'undefined' || !W.loginManager || !W.model || !W.map) {
            debugLog('WME no está completamente cargado, reintentando...');
            setTimeout(esperarWME, 1000);
            return;
        }

        if (!W.model.mapUpdateRequests) {
            debugLog('Módulo mapUpdateRequests no está disponible, reintentando...');
            setTimeout(esperarWME, 1000);
            return;
        }

        setTimeout(inicializarScript, 2000);
    }

    debugLog('Script cargado, esperando WME...');
    esperarWME();
})();