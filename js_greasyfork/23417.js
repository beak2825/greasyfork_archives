// ==UserScript==
// @name         WME - UR Manager
// @namespace    http://waze.com/
// @version      2025.07.30.1
// @description  Ultimate UR Management Toolkit designed for use with the Colombian Wazeopedia
// @author       Crotalo
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/23417/WME%20-%20UR%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/23417/WME%20-%20UR%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MENSAJE_RESPUESTA: "¡Hola, Wazer! Gracias por tu reporte. Para resolverlo de forma efectiva, necesitamos un poco más de detalle sobre lo sucedido. Quedamos atentos a tu respuesta.",
        MENSAJE_CIERRE: "¡Hola Wazer! Buen día, lamentablemente no pudimos solucionar el error en esta ocasión. Por favor, déjanos más datos la próxima vez. Gracias por reportar.",
        MENSAJE_RESUELTA: "¡Hola Wazer! Buen día, el problema fue solucionado y se verá reflejado en la aplicación en la próxima actualización del mapa, esta tomará entre 3 y 5 días. ¡Gracias por reportar!",
        ZOOM_INICIAL: 13,
        ZOOM_DETALLE: 18,
        PANEL_ID: 'urna-manager-sidebar-panel',
        RETRASO_ESPERA_UI: 1500,
        UMBRAL_VIEJO: 7,
        UMBRAL_RECIENTE: 3
    };

    let estado = {
        URsIniciales: [],
        urVisitadas: [],
        accionEnProgreso: false,
        guardadoAutomatico: true
    };

    GM_addStyle(`
        #sidebar .nav-tabs a[href="#${CONFIG.PANEL_ID}"] { padding: 15px 4px; font-size: 10px; text-align: center; line-height: 1.2; }
        #${CONFIG.PANEL_ID} { padding: 0 5px; font-family: Arial, sans-serif; font-size: 10px; }
        #${CONFIG.PANEL_ID} .panel-header, #${CONFIG.PANEL_ID} .panel-footer { padding: 10px 15px; background: #f8f8f8; }
        #${CONFIG.PANEL_ID} .panel-header { border-bottom: 1px solid #eee; }
        #${CONFIG.PANEL_ID} .panel-footer { border-top: 1px solid #eee; }
        #${CONFIG.PANEL_ID} .panel-header label { font-weight: bold; margin: 0; }
        #${CONFIG.PANEL_ID} .panel-content { padding: 15px; overflow-y: auto; max-height: calc(100vh - 380px); }


        #${CONFIG.PANEL_ID} table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }


        #${CONFIG.PANEL_ID} th {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: center; /* Centramos el texto del encabezado */
            white-space: normal; /* Permitimos el salto de línea */
            vertical-align: middle;
            line-height: 1.2; /* Ajustamos el interlineado para texto en dos líneas */
            position: sticky;
            top: -15px;
            background-color: #f2f2f2;
            z-index: 1;
        }


        #${CONFIG.PANEL_ID} td {
            border: 1px solid #ddd;
            padding: 5px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
        }

        #${CONFIG.PANEL_ID} td.uc-cell {
            white-space: normal; /* Permite el salto de línea para esta celda específica */
            text-align: center;
            line-height: 1.1;
        }

        #${CONFIG.PANEL_ID} th:nth-child(1) { width: 25%; } /* Columna Actualizado Por */
        #${CONFIG.PANEL_ID} th:nth-child(2) { width: 30%; } /* Columna Fecha Creación */
        #${CONFIG.PANEL_ID} th:nth-child(3) { width: 20%; } /* Columna Estado */
        #${CONFIG.PANEL_ID} th:nth-child(4) { width: 14%; } /* UC */
        #${CONFIG.PANEL_ID} th:nth-child(5) { width: 13%; } /* Acción */

        .btn-centrar { padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px; }
        .panel-footer { display: flex; justify-content: space-around; flex-wrap: wrap; }
        .btn-global { padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; text-align: center; flex: 1 1 45%; margin: 4px; }
        .btn-responder { background: #f0ad4e; color: white; }
        .btn-resuelta { background: #5cb85c; color: white; }
        .btn-cerrar { background: #d9534f; color: white; }
        .btn-actualizar { background: #5bc0de; color: white; }
        .ur-old { color: #d9534f; font-weight: bold; }
        .ur-recent { color: #5bc0de; }
        .ur-new { color: #5cb85c; }
        .ur-visitada { background-color: #fdf5d4 !important; }
        .ur-no-fecha { color: #777; font-style: italic; }
    `);

    function debugLog(message) { console.log('[UR Manager]', message); }
    function parsearFecha(valor) {
        if (!valor) return null;
        if (typeof valor === 'object' && '_seconds' in valor) {
            try { return new Date(valor._seconds * 1000 + (valor._nanoseconds / 1000000)); } catch (e) { debugLog(`Error parseando Firebase Timestamp: ${JSON.stringify(valor)}`); }
        }
        if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            try { return new Date(valor); } catch (e) { debugLog(`Error parseando fecha ISO: ${valor}`); }
        }
        if (/^\d+$/.test(valor)) {
            try { const num = parseInt(valor); return new Date(num > 1000000000000 ? num : num * 1000); } catch (e) { debugLog(`Error parseando timestamp numérico: ${valor}`); }
        }
        return null;
    }
    function obtenerFechaCreacionExacta(ur) {
        try {
            if (ur.attributes?.driveDate) { const fecha = parsearFecha(ur.attributes.driveDate); if (fecha) return fecha; }
            if (ur.attributes?.createdOn) { const fecha = parsearFecha(ur.attributes.createdOn); if (fecha) return fecha; }
            if (ur.attributes?.comments?.[0]?.createdOn) { const fecha = parsearFecha(ur.attributes.comments[0].createdOn); if (fecha) return fecha; }
            return null;
        } catch (e) { debugLog(`Error obteniendo fecha para UR ${ur.attributes?.id}: ${e}`); return null; }
    }
    function obtenerFechaUC(ur) {
        try {
            if (ur.attributes?.updatedOn) { const fecha = parsearFecha(ur.attributes.updatedOn); if (fecha) return fecha; }
            if (ur.attributes?.comments?.length > 0) {
                const ultimoComentario = ur.attributes.comments[ur.attributes.comments.length - 1];
                if (ultimoComentario?.createdOn) return parsearFecha(ultimoComentario.createdOn);
            }
            return null;
        } catch (e) { debugLog(`Error obteniendo fecha UC para UR ${ur.attributes?.id}: ${e}`); return null; }
    }
    function obtenerActualizadoPor(ur) {
        try {
            const updatedById = String(ur.attributes?.updatedBy || ur.attributes?.metaData?.updatedBy || ur.updatedBy || 'N/A');
            if (updatedById === 'N/A') return 'N/A'; if (updatedById === "-1") return "Wazer"; if (updatedById === "0") return "System";
            const userIdNum = parseInt(updatedById, 10);
            if (W.model.users) { const user = W.model.users.getObjectById(userIdNum); if (user && user.attributes && user.attributes.userName) return user.attributes.userName; }
            return updatedById;
        } catch (e) { debugLog(`Error en obtenerActualizadoPor para UR ${ur.attributes?.id}: ${e}`); return (ur.attributes?.updatedBy || 'N/A').toString(); }
    }
    function calcularDiferenciaDias(fecha) {
        if (!fecha) return null;
        const hoy = new Date(); const diffTiempo = (hoy.getTime() + 3600000) - fecha.getTime(); return Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
    }
    function clasificarUR(fecha) {
        if (!fecha) return { estado: "Sin fecha", clase: "ur-no-fecha" };
        const dias = calcularDiferenciaDias(fecha);
        if (dias === null) return { estado: "Sin fecha", clase: "ur-no-fecha" };
        if (dias > CONFIG.UMBRAL_VIEJO) return { estado: `Antigua (${dias}d)`, clase: "ur-old" };
        if (dias > CONFIG.UMBRAL_RECIENTE) return { estado: `Reciente (${dias}d)`, clase: "ur-recent" };
        return { estado: `Nueva (${dias}d)`, clase: "ur-new" };
    }
    function formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    function obtenerURsVisibles() {
        if (!W.model?.mapUpdateRequests?.objects) return [];
        const bounds = W.map.getExtent();
        return Object.values(W.model.mapUpdateRequests.objects).filter(ur => {
            if (ur.attributes?.open === false || ur.attributes?.resolved) return false;
            const geom = ur.getOLGeometry?.();
            if (!geom) return false;
            const center = geom.getBounds().getCenterLonLat();
            return bounds.containsLonLat(center);
        });
    }
    function crearSidebarTab() {
        if ($(`#${CONFIG.PANEL_ID}`).length) return;
        const tab = $(`<li><a href="#${CONFIG.PANEL_ID}" data-toggle="tab" title="UR Manager">UR Manager</a></li>`);
        $('#sidebar .nav-tabs').append(tab);
        const tabContent = $(`<div class="tab-pane" id="${CONFIG.PANEL_ID}"></div>`);
        $('#sidebar .tab-content').append(tabContent);
        renderizarPanel();
    }
    function renderizarPanel() {
        const panel = $(`#${CONFIG.PANEL_ID}`);
        panel.empty();
        const panelHeader = $(`<div class="panel-header"><label for="auto-save-checkbox"><input type="checkbox" id="auto-save-checkbox" ${estado.guardadoAutomatico ? 'checked' : ''}> Guardado Automático</label></div>`);
        const panelContent = $('<div class="panel-content">');
        const panelFooter = $(`<div class="panel-footer"><button class="btn-global btn-responder" id="responder-todas">Preguntar</button><button class="btn-global btn-resuelta" id="resolver-todas">Resolver</button><button class="btn-global btn-cerrar" id="cerrar-todas">Cerrar UR</button><button class="btn-global btn-actualizar" id="actualizar-lista">Actualizar</button></div>`);
        panelHeader.on('change', '#auto-save-checkbox', function() { estado.guardadoAutomatico = $(this).is(':checked'); debugLog(`Guardado automático: ${estado.guardadoAutomatico ? 'activado' : 'desactivado'}`); });
        actualizarContenidoPanel(panelContent);
        panelFooter.on('click', '#actualizar-lista', () => { W.map.getOLMap().zoomTo(CONFIG.ZOOM_INICIAL); setTimeout(() => actualizarContenidoPanel($(`#${CONFIG.PANEL_ID} .panel-content`)), 1000); });
        panelFooter.on('click', '#responder-todas', () => gestionarURs('responder'));
        panelFooter.on('click', '#resolver-todas', () => gestionarURs('resolver'));
        panelFooter.on('click', '#cerrar-todas', () => gestionarURs('cerrar'));
        panel.append(panelHeader, panelContent, panelFooter);
    }

    function actualizarContenidoPanel(panelContent) {
        setTimeout(() => {
            estado.URsIniciales = obtenerURsVisibles();
            estado.urVisitadas = estado.urVisitadas.filter(id => estado.URsIniciales.some(u => u.attributes?.id == id));
            if (estado.URsIniciales.length === 0) {
                panelContent.html('<p>No se encontraron URs visibles en el área actual.</p>');
                return;
            }

            let tablaHTML = `<h3>URs Visibles: ${estado.URsIniciales.length}</h3><table><thead><tr><th>Actualizado<br>Por</th><th>Fecha<br>Creación</th><th>Estado</th><th>UC</th><th>Acción</th></tr></thead><tbody>`;

            estado.URsIniciales.forEach(ur => {
                const id = ur.attributes?.id;
                const fechaCreacion = obtenerFechaCreacionExacta(ur);
                const fechaUC = obtenerFechaUC(ur);
                const clasificacion = clasificarUR(fechaCreacion);
                const diasDesdeUC = calcularDiferenciaDias(fechaUC);
                const esVisitada = estado.urVisitadas.includes(id) ? 'ur-visitada' : '';
                const actualizadoPor = obtenerActualizadoPor(ur);
                const contenidoUC = diasDesdeUC !== null ? `${diasDesdeUC}<div>días</div>` : 'S/C';

                tablaHTML += `<tr id="ur-row-${id}" class="${esVisitada}">
                                    <td>${actualizadoPor}</td>
                                    <td>${formatearFecha(fechaCreacion)}</td>
                                    <td class="${clasificacion.clase}">${clasificacion.estado}</td>
                                    <td class="uc-cell">${contenidoUC}</td>
                                    <td><button class="btn-centrar" data-id="${id}">📍</button></td>
                                </tr>`;
            });

            tablaHTML += '</tbody></table>';

            const resumenEditores = {};
            estado.URsIniciales.forEach(ur => {
                const editor = obtenerActualizadoPor(ur);
                resumenEditores[editor] = (resumenEditores[editor] || 0) + 1;
            });

            let resumenHTML = '<h3 style="margin-top: 20px;">Resumen por Editor</h3><table><thead><tr><th>Editor</th><th style="text-align: center;">Total URs</th></tr></thead><tbody>';

            Object.keys(resumenEditores).sort().forEach(editor => {
                resumenHTML += `<tr><td>${editor}</td><td style="text-align: center;">${resumenEditores[editor]}</td></tr>`;
            });

            resumenHTML += '</tbody></table>';
            tablaHTML += resumenHTML;

            panelContent.html(tablaHTML);
            panelContent.off('click', '.btn-centrar').on('click', '.btn-centrar', function() {
                const id = $(this).data('id');
                centrarUR(id);
            });
        }, 1500);
    }

    function centrarUR(id) {
        if (estado.accionEnProgreso) return;

        const ur = estado.URsIniciales.find(u => u.attributes?.id == id);
        if (!ur) {
            debugLog(`UR con ID ${id} no encontrada.`);
            return;
        }

        const geom = ur.getOLGeometry();
        if (!geom) {
            debugLog(`Geometría no encontrada para UR ${id}.`);
            return;
        }

        const center = geom.getBounds().getCenterLonLat();
        W.map.setCenter(center);
        W.map.getOLMap().zoomTo(CONFIG.ZOOM_DETALLE);

        setTimeout(() => {
            if (W.problemsController && typeof W.problemsController.showProblem === 'function') {
                W.problemsController.showProblem(ur);
                debugLog(`Abriendo panel para UR ${id}`);
            } else {
                debugLog(`Error: W.problemsController.showProblem no está disponible.`);
            }

            if (!estado.urVisitadas.includes(id)) {
                estado.urVisitadas.push(id);
                $(`#ur-row-${id}`).addClass('ur-visitada');
            }
        }, 500);
    }

    function gestionarURs(accion) {
        if (estado.accionEnProgreso || !estado.URsIniciales.length) return;
        estado.accionEnProgreso = true;
        const ur = estado.URsIniciales[0];
        centrarUR(ur.attributes.id);
        setTimeout(() => {
            const commentField = $('.new-comment-text');
            if (!commentField.length) { estado.accionEnProgreso = false; debugLog("Campo de comentario no encontrado."); return; }
            let mensaje = '', estadoUR = '';
            switch (accion) {
                case 'responder': mensaje = CONFIG.MENSAJE_RESPUESTA; break;
                case 'resolver': mensaje = CONFIG.MENSAJE_RESUELTA; estadoUR = 'SOLVED'; break;
                case 'cerrar': mensaje = CONFIG.MENSAJE_CIERRE; estadoUR = 'NOT_IDENTIFIED'; break;
            }
            commentField.val(mensaje).trigger('input').trigger('change');
            setTimeout(() => {
                $('.send-button:not(:disabled)').click();
                if (estadoUR) {
                    setTimeout(() => {
                        const statusButton = $(`[data-status="${estadoUR}"], [data-testid="${estadoUR.toLowerCase().replace('_', '-')}-button"], label[for="state-${estadoUR.toLowerCase().replace('_', '-')}"]`).first();
                        if (statusButton.length) {
                            statusButton.click();
                            setTimeout(() => {
                                $('.button-primary, .wz-button.primary.save-button').click();
                                setTimeout(() => {
                                    if (estado.guardadoAutomatico) {
                                        guardarCambios();
                                    } else {
                                        debugLog('[UR Manager] Guardado automático desactivado.');
                                        estado.accionEnProgreso = false;
                                    }
                                }, 1000);
                            }, 500);
                        } else { estado.accionEnProgreso = false; debugLog("Botón de estado no encontrado."); }
                    }, 1000);
                } else { estado.accionEnProgreso = false; }
            }, 500);
        }, CONFIG.RETRASO_ESPERA_UI);
    }
    function guardarCambios() {
        try {
            if (W.controller?.save) {
                W.controller.save();
                debugLog('[UR Manager] Cambios guardados con W.controller.save()');
                setTimeout(() => {
                    estado.accionEnProgreso = false;
                    debugLog('[UR Manager] Operación completada');
                }, 2000);
            } else {
                debugLog('[UR Manager] No se pudo guardar automáticamente: W.controller.save() no disponible');
                estado.accionEnProgreso = false;
            }
        } catch (e) {
            debugLog('[UR Manager] Error al guardar automáticamente: ' + e.message);
            estado.accionEnProgreso = false;
        }
    }
    function inicializarScript() {
        crearSidebarTab();
    }
    function esperarWME() {
        if (typeof W === 'undefined' || !W.loginManager || !W.model || !W.map || !W.controller || !$('#sidebar .nav-tabs').length) {
            setTimeout(esperarWME, 1000);
            return;
        }
        if (!W.model.actionManager || !W.model.mapUpdateRequests) {
            setTimeout(esperarWME, 1000);
            return;
        }
        setTimeout(inicializarScript, 2000);
    }
    esperarWME();
})();