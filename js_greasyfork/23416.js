// ==UserScript==
// @name WME - UR Manager Caballeria
// @namespace http://waze.com/
// @version 2025.10.15.1
// @description Ultimate UR Management Toolkit designed for use with the Colombian Wazeopedia
// @author Crotalo
// @match https://www.waze.com/*/editor*
// @match https://beta.waze.com/*/editor*
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/23416/WME%20-%20UR%20Manager%20Caballeria.user.js
// @updateURL https://update.greasyfork.org/scripts/23416/WME%20-%20UR%20Manager%20Caballeria.meta.js
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
        RETRASO_ESPERA_UI: 2400,
        RETRASO_ENTRE_URS: 2600,
        UMBRAL_VIEJO: 7,
        UMBRAL_RECIENTE: 3,
        UMBRAL_CIERRE_ANTIGUO: 3,
        UMBRAL_CIERRE_NO_COMENTADAS: 7
    };

    let estado = {
        URsIniciales: [],
        urVisitadas: [],
        accionEnProgreso: false,
        guardadoAutomatico: true,
        soloMisURs: false,
        columnaOrden: null,
        ordenAscendente: true
    };

    GM_addStyle(`
        #sidebar .nav-tabs a[href="#${CONFIG.PANEL_ID}"] { padding: 15px 4px; font-size: 10px; text-align: center; line-height: 1.2; }
        #${CONFIG.PANEL_ID} { padding: 0 5px; font-family: Arial, sans-serif; font-size: 10px; }
        #${CONFIG.PANEL_ID} .panel-header, #${CONFIG.PANEL_ID} .panel-footer { padding: 10px 15px; background: #f8f8f8; }
        #${CONFIG.PANEL_ID} .panel-header { border-bottom: 1px solid #eee; }
        #${CONFIG.PANEL_ID} .panel-footer { border-top: 1px solid #eee; }
        #${CONFIG.PANEL_ID} .panel-header label { font-weight: bold; margin: 0; }
        #${CONFIG.PANEL_ID} .panel-content { padding: 15px; overflow-y: auto; max-height: calc(100vh - 400px); }
        #${CONFIG.PANEL_ID} table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
        #${CONFIG.PANEL_ID} th { border: 1px solid #ddd; padding: 4px; text-align: center; white-space: normal; vertical-align: middle; line-height: 1.2; position: sticky; top: -15px; background-color: #f2f2f2; z-index: 1; cursor: pointer; }
        #${CONFIG.PANEL_ID} th .sort-icon { margin-left: 5px; }
        #${CONFIG.PANEL_ID} td { border: 1px solid #ddd; padding: 5px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
        #${CONFIG.PANEL_ID} td.uc-cell { white-space: normal; text-align: center; line-height: 1.1; }
        #${CONFIG.PANEL_ID} th:nth-child(1) { width: 25%; } #${CONFIG.PANEL_ID} th:nth-child(2) { width: 30%; } #${CONFIG.PANEL_ID} th:nth-child(3) { width: 20%; } #${CONFIG.PANEL_ID} th:nth-child(4) { width: 12%; } #${CONFIG.PANEL_ID} th:nth-child(5) { width: 13%; }
        .btn-centrar { padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px; }
        .panel-footer { display: flex; justify-content: space-around; flex-wrap: wrap; }
        .btn-global { padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; text-align: center; flex: 1 1 45%; margin: 4px; }
        .btn-global:disabled { background-color: #ccc; cursor: not-allowed; }
        .btn-responder { background: #f0ad4e; color: white; } .btn-preguntar-auto { background: #e67e22; color: white; flex: 1 1 100%; }
        .btn-resuelta { background: #5cb85c; color: white; } .btn-cerrar { background: #d9534f; color: white; }
        .btn-cerrar-antiguas { background: #c9302c; color: white; flex: 1 1 100%; }
        .btn-cerrar-no-comentadas { background: #8e44ad; color: white; flex: 1 1 100%; margin-top: 4px; }
        .btn-actualizar { background: #5bc0de; color: white; flex: 1 1 100%; }
        .ur-old { color: #d9534f; font-weight: bold; } .ur-recent { color: #5bc0de; } .ur-new { color: #5cb85c; }
        .ur-visitada { background-color: #fdf5d4 !important; } .ur-no-fecha { color: #777; font-style: italic; }
    `);

    function debugLog(message) { console.log('[UR Manager]', message); }
    function parsearFecha(valor) {
        if (!valor) return null;
        if (typeof valor === 'object' && '_seconds' in valor) { try { return new Date(valor._seconds * 1000 + (valor._nanoseconds / 1000000)); } catch (e) { debugLog(`Error parseando Firebase Timestamp: ${JSON.stringify(valor)}`); } }
        if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) { try { return new Date(valor); } catch (e) { debugLog(`Error parseando fecha ISO: ${valor}`); } }
        if (/^\d+$/.test(valor)) { try { const num = parseInt(valor); return new Date(num > 1000000000000 ? num : num * 1000); } catch (e) { debugLog(`Error parseando timestamp numérico: ${valor}`); } }
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
    function obtenerIdActualizadoPor(ur) {
        try {
            return String(ur.attributes?.updatedBy || ur.attributes?.metaData?.updatedBy || ur.updatedBy || null);
        } catch (e) {
            debugLog(`Error en obtenerIdActualizadoPor para UR ${ur.attributes?.id}: ${e}`);
            return null;
        }
    }
    function tieneComentarioEditor(ur) {
        try {
            if (ur.attributes?.comments?.length > 0) {
                return ur.attributes.comments.some(comment => {
                    const userId = String(comment?.createdBy || null);
                    return userId !== "-1" && userId !== "0" && userId !== null && userId !== 'N/A';
                });
            }
            return false;
        } catch (e) {
            debugLog(`Error en tieneComentarioEditor para UR ${ur.attributes?.id}: ${e}`);
            return false;
        }
    }
    function esEditor(ur) {
        const autor = obtenerActualizadoPor(ur);
        return autor !== 'Wazer' && autor !== 'System' && autor !== 'N/A';
    }
    function calcularDiferenciaDias(fecha) {
        if (!fecha) return null;
        const hoy = new Date(); const diffTiempo = (hoy.getTime() + 3600000) - fecha.getTime(); return Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
    }
    function clasificarUR(fecha) {
        if (!fecha) return { estado: "Sin fecha", clase: "ur-no-fecha", dias: null };
        const dias = calcularDiferenciaDias(fecha);
        if (dias === null) return { estado: "Sin fecha", clase: "ur-no-fecha", dias: null };
        if (dias > CONFIG.UMBRAL_VIEJO) return { estado: `Antigua (${dias}d)`, clase: "ur-old", dias: dias };
        if (dias > CONFIG.UMBRAL_RECIENTE) return { estado: `Reciente (${dias}d)`, clase: "ur-recent", dias: dias };
        return { estado: `Nueva (${dias}d)`, clase: "ur-new", dias: dias };
    }
    function formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    function obtenerURsVisibles() {
        if (!W.model?.mapUpdateRequests?.objects) return [];
        const bounds = W.map.getExtent().clone();
        const expandX = bounds.getWidth() * 0.30;
        const expandY = bounds.getHeight() * 0.30;
        bounds.left -= expandX; bounds.right += expandX; bounds.top += expandY; bounds.bottom -= expandY;
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
        const panelHeader = $(`
            <div class="panel-header">
                <label for="auto-save-checkbox">
                    <input type="checkbox" id="auto-save-checkbox" ${estado.guardadoAutomatico ? 'checked' : ''}> Guardado Automático
                </label>
                <label for="solo-mis-urs-checkbox" style="margin-left: 15px;">
                    <input type="checkbox" id="solo-mis-urs-checkbox" ${estado.soloMisURs ? 'checked' : ''}> Solo mis URs
                </label>
            </div>
        `);
        const panelContent = $('<div class="panel-content">');
        const panelFooter = $(`
            <div class="panel-footer">
                <button class="btn-global btn-responder" id="responder-todas">Preguntar</button>
                <button class="btn-global btn-resuelta" id="resolver-todas">Resolver</button>
                <button class="btn-global btn-cerrar" id="cerrar-todas">Cerrar UR</button>
                <button class="btn-global btn-preguntar-auto" id="preguntar-sin-comentario">Preguntar a URs sin Comentario</button>
                <button class="btn-global btn-cerrar-antiguas" id="cerrar-urs-antiguas">Cerrar Antiguas (${CONFIG.UMBRAL_CIERRE_ANTIGUO}+ días)</button>
                <button class="btn-global btn-cerrar-no-comentadas" id="cerrar-urs-no-comentadas">Cerrar No Atendidas (${CONFIG.UMBRAL_CIERRE_NO_COMENTADAS}+ días)</button>
                <button class="btn-global btn-actualizar" id="actualizar-lista">Actualizar</button>
            </div>
        `);

        panelHeader.on('change', '#auto-save-checkbox', function() { estado.guardadoAutomatico = $(this).is(':checked'); debugLog(`Guardado automático: ${estado.guardadoAutomatico ? 'activado' : 'desactivado'}`); });
        panelHeader.on('change', '#solo-mis-urs-checkbox', function() {
            estado.soloMisURs = $(this).is(':checked');
            debugLog(`Filtrar solo mis URs: ${estado.soloMisURs ? 'activado' : 'desactivado'}`);
        });

        actualizarContenidoPanel(panelContent);

        panelFooter.on('click', '#actualizar-lista', () => { W.map.getOLMap().zoomTo(CONFIG.ZOOM_INICIAL); setTimeout(() => actualizarContenidoPanel($(`#${CONFIG.PANEL_ID} .panel-content`)), 1000); });
        panelFooter.on('click', '#responder-todas', () => gestionarURs('responder'));
        panelFooter.on('click', '#resolver-todas', () => gestionarURs('resolver'));
        panelFooter.on('click', '#cerrar-todas', () => gestionarURs('cerrar'));
        panelFooter.on('click', '#preguntar-sin-comentario', procesarURsSinComentario);
        panelFooter.on('click', '#cerrar-urs-antiguas', procesarCierreURsAntiguas);
        panelFooter.on('click', '#cerrar-urs-no-comentadas', procesarCierreURsNoComentadas);

        panel.append(panelHeader, panelContent, panelFooter);
    }

    function ordenarTabla(columna, cuerpoTabla) {
        if (columna === 'accion') return;

        if (estado.columnaOrden === columna) {
            estado.ordenAscendente = !estado.ordenAscendente;
        } else {
            estado.columnaOrden = columna;
            estado.ordenAscendente = true;
        }

        const filas = cuerpoTabla.find('tr').get();

        filas.sort((a, b) => {
            const valA = obtenerValorOrden($(a).data(columna), columna);
            const valB = obtenerValorOrden($(b).data(columna), columna);

            let comparacion = 0;
            if (valA === null || valA === undefined || valA === 0) {
                comparacion = (valB === null || valB === undefined || valB === 0) ? 0 : 1;
            } else if (valB === null || valB === undefined || valB === 0) {
                comparacion = -1;
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                comparacion = valA - valB;
            } else {
                comparacion = String(valA).localeCompare(String(valB));
            }

            return estado.ordenAscendente ? comparacion : comparacion * -1;
        });

        $.each(filas, (indice, fila) => {
            cuerpoTabla.append(fila);
        });


        $(`#${CONFIG.PANEL_ID} th`).each(function() {
            const th = $(this);
            const thColumna = th.data('columna');
            let icon = th.find('.sort-icon');
            if (!icon.length) {
                icon = $('<span class="sort-icon"></span>').appendTo(th);
            }
            icon.text('');
            if (thColumna === estado.columnaOrden) {
                icon.text(estado.ordenAscendente ? ' ▲' : ' ▼');
            }
        });
    }

    function obtenerValorOrden(valor, columna) {
        if (columna === 'fecha-creacion') {
            return valor ? new Date(valor).getTime() : 0;
        } else if (columna === 'estado') {

             const match = String(valor).match(/\((\d+)d\)/);
             return match ? parseInt(match[1], 10) : 0;
        } else if (columna === 'dias-uc') {
            return valor === 'S/C' ? -1 : parseInt(valor, 10);
        } else {
            return String(valor).toLowerCase();
        }
    }


    function actualizarContenidoPanel(panelContent) {
        setTimeout(() => {
            estado.URsIniciales = obtenerURsVisibles();
            estado.urVisitadas = estado.urVisitadas.filter(id => estado.URsIniciales.some(u => u.attributes?.id == id));

            if (estado.columnaOrden === null) {
                estado.columnaOrden = 'fecha-creacion';
                estado.ordenAscendente = false;
            }

            const dataURs = estado.URsIniciales.map(ur => {
                const id = ur.attributes?.id;
                const fechaCreacion = obtenerFechaCreacionExacta(ur);
                const clasificacion = clasificarUR(fechaCreacion);
                const diasDesdeUC = calcularDiferenciaDias(obtenerFechaUC(ur));
                const actualizadoPor = obtenerActualizadoPor(ur);

                return {
                    id,
                    actualizadoPor,
                    fechaCreacion: fechaCreacion ? fechaCreacion.toISOString() : null,
                    fechaCreacionDisplay: formatearFecha(fechaCreacion),
                    clasificacionEstado: clasificacion.estado,
                    clasificacionClase: clasificacion.clase,
                    diasDesdeUC,
                    contenidoUC: diasDesdeUC !== null ? `${diasDesdeUC}` : 'S/C',
                    esVisitada: estado.urVisitadas.includes(id)
                };
            });

            dataURs.sort((a, b) => {
                const valA = obtenerValorOrden(a[estado.columnaOrden.replace(/-/g, '')], estado.columnaOrden);
                const valB = obtenerValorOrden(b[estado.columnaOrden.replace(/-/g, '')], estado.columnaOrden);

                let comparacion;
                if (typeof valA === 'number' && typeof valB === 'number') {
                    comparacion = valA - valB;
                } else {
                    comparacion = String(valA).localeCompare(String(valB));
                }

                return estado.ordenAscendente ? comparacion : comparacion * -1;
            });


            if (estado.URsIniciales.length === 0) {
                panelContent.html('<p>No se encontraron URs visibles en el área actual.</p>');
                return;
            }


            let tablaHTML = `<h3>URs Visibles: ${estado.URsIniciales.length}</h3>
                                     <table>
                                         <thead>
                                             <tr>
                                                 <th data-columna="actualizado-por">Actualizado<br>Por<span class="sort-icon"></span></th>
                                                 <th data-columna="fecha-creacion">Fecha<br>Creación<span class="sort-icon"></span></th>
                                                 <th data-columna="estado">Estado<span class="sort-icon"></span></th>
                                                 <th data-columna="dias-uc">UC<span class="sort-icon"></span></th>
                                                 <th data-columna="accion">Acción</th>
                                             </tr>
                                         </thead>
                                         <tbody>`;

            dataURs.forEach(ur => {
                const esVisitada = ur.esVisitada ? 'ur-visitada' : '';
                const diasUC_display = ur.diasDesdeUC !== null ? `${ur.diasDesdeUC}<div>días</div>` : 'S/C';


                const dataAttrs = `data-actualizado-por="${ur.actualizadoPor}"
                                        data-fecha-creacion="${ur.fechaCreacion || ''}"
                                        data-estado="${ur.clasificacionEstado}"
                                        data-dias-uc="${ur.contenidoUC}"`;

                tablaHTML += `<tr id="ur-row-${ur.id}" class="${esVisitada}" ${dataAttrs}>
                                     <td>${ur.actualizadoPor}</td>
                                     <td>${ur.fechaCreacionDisplay}</td>
                                     <td class="${ur.clasificacionClase}">${ur.clasificacionEstado}</td>
                                     <td class="uc-cell">${diasUC_display}</td>
                                     <td><button class="btn-centrar" data-id="${ur.id}">📍</button></td>
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


            panelContent.html(tablaHTML + resumenHTML);

           
            const cuerpoTabla = $(`#${CONFIG.PANEL_ID} table:first-of-type tbody`);
            $(`#${CONFIG.PANEL_ID} table:first-of-type th`).off('click').on('click', function() {
                const columna = $(this).data('columna');
                if (columna && columna !== 'accion') {
                    ordenarTabla(columna, cuerpoTabla);
                }
            });


            if (estado.columnaOrden) {

                 estado.ordenAscendente = !estado.ordenAscendente;
                 ordenarTabla(estado.columnaOrden, cuerpoTabla);
            }

            panelContent.off('click', '.btn-centrar').on('click', '.btn-centrar', function() {
                const id = $(this).data('id');
                centrarUR(id);
            });
        }, 1500);
    }

    function centrarUR(id) {
        if (estado.accionEnProgreso) return;
        const ur = estado.URsIniciales.find(u => u.attributes?.id == id);
        if (!ur) { debugLog(`UR con ID ${id} no encontrada.`); return; }
        const geom = ur.getOLGeometry();
        if (!geom) { debugLog(`Geometría no encontrada para UR ${id}.`); return; }
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

    function procesarURsSinComentario() {
        if (estado.accionEnProgreso) {
            alert("Ya hay una acción en progreso. Por favor, espera a que termine.");
            return;
        }
        const ursAProcesar = estado.URsIniciales.filter(ur => obtenerActualizadoPor(ur) === 'N/A');
        if (ursAProcesar.length === 0) {
            alert("✅ ¡Excelente! No se encontraron URs sin atender en el área visible.");
            return;
        }
        if (!confirm(`Se encontraron ${ursAProcesar.length} URs sin atender. ¿Deseas comentar en todas automáticamente?`)) {
            return;
        }
        estado.accionEnProgreso = true;
        $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', true);
        debugLog(`Iniciando proceso para ${ursAProcesar.length} URs sin atender.`);
        procesarSiguienteUR_Comentario(ursAProcesar, 0);
    }

    function procesarSiguienteUR_Comentario(listaURs, indice) {
        if (indice >= listaURs.length) {
            debugLog("Proceso de comentarios automáticos completado.");
            alert(`¡Proceso finalizado! Se han comentado ${listaURs.length} URs.`);
            estado.accionEnProgreso = false;
            $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', false);
            actualizarContenidoPanel($(`#${CONFIG.PANEL_ID} .panel-content`));
            return;
        }
        const ur = listaURs[indice];
        const urId = ur.attributes.id;
        debugLog(`Comentando UR ${indice + 1}/${listaURs.length} (ID: ${urId})`);
        centrarUR_automatico(urId, () => {
            setTimeout(() => {
                const commentField = $('.new-comment-text');
                if (!commentField.length) {
                    debugLog(`Error: Campo de comentario no encontrado para UR ${urId}. Saltando a la siguiente.`);
                    setTimeout(() => procesarSiguienteUR_Comentario(listaURs, indice + 1), CONFIG.RETRASO_ENTRE_URS);
                    return;
                }
                commentField.val(CONFIG.MENSAJE_RESPUESTA).trigger('input').trigger('change');
                setTimeout(() => {
                    const sendButton = $('.send-button:not(:disabled)');
                    if (sendButton.length > 0) {
                        sendButton.click();
                        debugLog(`Comentario enviado para UR ${urId}.`);
                        $(`#ur-row-${urId}`).addClass('ur-visitada');
                    } else {
                        debugLog(`Botón de enviar no encontrado o deshabilitado para UR ${urId}.`);
                    }
                    setTimeout(() => {
                        procesarSiguienteUR_Comentario(listaURs, indice + 1);
                    }, 500);
                }, 500);
            }, CONFIG.RETRASO_ESPERA_UI);
        });
    }

    function procesarCierreURsAntiguas() {
        if (estado.accionEnProgreso) {
            alert("Ya hay una acción en progreso. Por favor, espera a que termine.");
            return;
        }

        const miIdDeUsuarioActual = W?.loginManager?.user?.attributes?.id;
        const ursACerrar = estado.URsIniciales.filter(ur => {
            const fechaActualizacion = obtenerFechaUC(ur);
            if (!fechaActualizacion) return false;
            const diasDesdeUpdate = calcularDiferenciaDias(fechaActualizacion);
            const esAntiguo = diasDesdeUpdate >= CONFIG.UMBRAL_CIERRE_ANTIGUO;
            const fueActualizadoPorEditor = esEditor(ur);
            if (!esAntiguo || !fueActualizadoPorEditor) {
                return false;
            }
            if (estado.soloMisURs) {
                if (!miIdDeUsuarioActual) {
                    debugLog("ADVERTENCIA: Tu ID de usuario no pudo ser verificado al momento de filtrar.");
                    return false;
                }
                const idActualizadoPor = obtenerIdActualizadoPor(ur);
                return idActualizadoPor === String(miIdDeUsuarioActual);
            }
            return true;
        });

        if (ursACerrar.length === 0) {
            alert(`✅ No se encontraron URs que cumplan los criterios (antiguas (${CONFIG.UMBRAL_CIERRE_ANTIGUO}+ días) y actualizadas por un editor y/o que sean tuyas).`);
            return;
        }
        if (!confirm(`Se encontraron ${ursACerrar.length} URs para cerrar automáticamente. ¿Deseas continuar?`)) {
            return;
        }
        estado.accionEnProgreso = true;
        $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', true);
        debugLog(`Iniciando proceso de cierre para ${ursACerrar.length} URs (Antiguas Comentadas).`);
        procesarSiguienteUR_Cierre(ursACerrar, 0);
    }

    function procesarCierreURsNoComentadas() {
        if (estado.accionEnProgreso) {
            alert("Ya hay una acción en progreso. Por favor, espera a que termine.");
            return;
        }

        const ursACerrar = estado.URsIniciales.filter(ur => {
            const fechaCreacion = obtenerFechaCreacionExacta(ur);
            if (!fechaCreacion) return false;

            const diasDesdeCreacion = calcularDiferenciaDias(fechaCreacion);
            const esAntigua = diasDesdeCreacion >= CONFIG.UMBRAL_CIERRE_NO_COMENTADAS;

            
            const noComentada = obtenerActualizadoPor(ur) === 'N/A';

            return esAntigua && noComentada;
        });

        if (ursACerrar.length === 0) {
            alert(`✅ No se encontraron URs que cumplan los criterios (más de ${CONFIG.UMBRAL_CIERRE_NO_COMENTADAS} días y sin atención).`);
            return;
        }

        if (!confirm(`Se encontraron ${ursACerrar.length} URs (creadas hace ${CONFIG.UMBRAL_CIERRE_NO_COMENTADAS}+ días y sin atención) para cerrar automáticamente. ¿Deseas continuar?`)) {
            return;
        }

        estado.accionEnProgreso = true;
        $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', true);
        debugLog(`Iniciando proceso de cierre para ${ursACerrar.length} URs (Antiguas Sin Atención).`);
        procesarSiguienteUR_Cierre(ursACerrar, 0);
    }

    function procesarSiguienteUR_Cierre(listaURs, indice) {
        if (indice >= listaURs.length) {
            debugLog("Proceso de cierre automático completado.");
            if (estado.guardadoAutomatico) {
                guardarCambios();
                setTimeout(() => {
                    alert(`¡Proceso finalizado! Se han cerrado ${listaURs.length} URs.`);
                    $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', false);
                    actualizarContenidoPanel($(`#${CONFIG.PANEL_ID} .panel-content`));
                }, 2500);
            } else {
                alert("Guardado automático desactivado. Por favor, guarda los cambios manualmente.");
                estado.accionEnProgreso = false;
                $(`#${CONFIG.PANEL_ID} .btn-global`).prop('disabled', false);
                actualizarContenidoPanel($(`#${CONFIG.PANEL_ID} .panel-content`));
            }
            return;
        }
        const ur = listaURs[indice];
        const urId = ur.attributes.id;
        debugLog(`Cerrando UR ${indice + 1}/${listaURs.length} (ID: ${urId})`);
        centrarUR_automatico(urId, () => {
            setTimeout(() => {
                const commentField = $('.new-comment-text');
                if (!commentField.length) {
                    debugLog(`Error: Campo de comentario no encontrado para UR ${urId}. Saltando.`);
                    setTimeout(() => procesarSiguienteUR_Cierre(listaURs, indice + 1), CONFIG.RETRASO_ENTRE_URS);
                    return;
                }
                commentField.val(CONFIG.MENSAJE_CIERRE).trigger('input').trigger('change');
                setTimeout(() => {
                    $('.send-button:not(:disabled)').click();
                    setTimeout(() => {
                        const estadoUR = 'NOT_IDENTIFIED';
                        const statusButton = $(`[data-status="${estadoUR}"], [data-testid="${estadoUR.toLowerCase().replace('_', '-')}-button"], label[for="state-${estadoUR.toLowerCase().replace('_', '-')}"]`).first();
                        if (statusButton.length) {
                            statusButton.click();
                            $(`#ur-row-${urId}`).css('text-decoration', 'line-through');
                        } else {
                            debugLog(`Botón de estado 'No Identificada' no encontrado para UR ${urId}.`);
                        }
                        setTimeout(() => procesarSiguienteUR_Cierre(listaURs, indice + 1), CONFIG.RETRASO_ENTRE_URS);
                    }, 1900);
                }, 1800);
            }, CONFIG.RETRASO_ESPERA_UI);
        });
    }

    function centrarUR_automatico(id, callback) {
        const ur = estado.URsIniciales.find(u => u.attributes?.id == id);
        if (!ur) { debugLog(`UR con ID ${id} no encontrada.`); if (callback) callback(); return; }
        const geom = ur.getOLGeometry();
        if (!geom) { debugLog(`Geometría no encontrada para UR ${id}.`); if (callback) callback(); return; }
        const center = geom.getBounds().getCenterLonLat();
        W.map.setCenter(center);
        W.map.getOLMap().zoomTo(CONFIG.ZOOM_DETALLE);
        setTimeout(() => {
            if (W.problemsController?.showProblem) {
                W.problemsController.showProblem(ur);
                debugLog(`Abriendo panel para UR ${id} (automático)`);
            } else {
                debugLog(`Error: W.problemsController.showProblem no está disponible.`);
            }
            if (callback) callback();
        }, 500);
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
        debugLog("Inicializando panel de UR Manager.");
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