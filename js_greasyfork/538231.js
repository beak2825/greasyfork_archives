// ==UserScript==
// @name         Extractor de productos SHEIN ver1.3
// @version      1.3
// @description  Extrae productos de SHEIN y convertir datos a XLSX
// @author       Agustin Tottil
// @match        https://arg.shein.com/user/orders/detail/*
// @grant        none
// @namespace https://greasyfork.org/users/1478506
// @downloadURL https://update.greasyfork.org/scripts/538231/Extractor%20de%20productos%20SHEIN%20ver13.user.js
// @updateURL https://update.greasyfork.org/scripts/538231/Extractor%20de%20productos%20SHEIN%20ver13.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';
    document.head.appendChild(script);

    script.onload = function () {
        console.log('xlsx-js-style CDN ok 200');
        function procesarString(texto) {
            let partes = texto.split('/');
            let color = partes[0].trim();
            let tamaño = partes.slice(1).join('/').trim();
            return [color, tamaño];
        }
        function esperarElemento(selector, callback) {
            const elemento = document.querySelector(selector);
            if (elemento) {
                callback(elemento);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const encontrado = document.querySelector(selector);
                if (encontrado) {
                    obs.disconnect();
                    callback(encontrado);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function parsearPrecio(precioStr) {
            if (!precioStr) return 0;
            let limpio = precioStr.replace(/\$/g, '').trim();
            limpio = limpio.replace(/\./g, '').replace(',', '.');
            const valor = parseFloat(limpio);
            return isNaN(valor) ? 0 : valor;
        }

        const downloadButton = document.createElement('button');
        downloadButton.id = 'descargar-stock-btn';
        downloadButton.textContent = 'DESCARGAR XLSX';
        downloadButton.style.cssText = 'background-color: rgb(193 255 196); border-radius: 0px; border: 1px solid black; color: black; padding: 5px 10px; cursor: pointer; font-size: 16px;';

        esperarElemento('.page-main-title', (menu) => {
            if (document.querySelector('#descargar-stock-btn')) return;
            menu.appendChild(downloadButton);
        });

        downloadButton.addEventListener('click', function () {
            console.log('intentando extraer productos');

            const order_element = document.querySelector('div.order-detail-box');
            if (!order_element) {
                console.warn('no se encuentra el elemento con clase order-detail-box');
                return;
            }

            const url = window.location.href;
            const match = url.match(/\/detail\/([^\/]+)/);
            const codigoOrden = match ? match[1] : 'orden';

            const sku_elements = order_element.querySelectorAll('td[aria-label^="SKU"]');
            const cantidad_elements = order_element.querySelectorAll('td[aria-label^="Cantidad"]');
            const nombre_tienda_elements = order_element.querySelectorAll(".store-info");
            const tbodys_elements = order_element.querySelectorAll("tbody");
            const preciofull_elements = order_element.querySelectorAll('del');
            const preciopromo_elements = order_element.querySelectorAll('td:not([aria-label]) > div > span');
            const linkynombre_elements = order_element.querySelectorAll(".ga-order-goods");
            const tamanio_color_elements = order_element.querySelectorAll(".size-info");
            const imagen_elements = order_element.querySelectorAll(".crop-image-container__img");

            let listaFinal = [];
            tbodys_elements.forEach((tbody, index) => {
                const nombreTienda = nombre_tienda_elements[index]?.innerText.trim() || `Tienda ${index + 1}`;
                const cantidadTr = tbody.querySelectorAll("tr").length;
                for (let i = 0; i < cantidadTr; i++) {
                    listaFinal.push(nombreTienda);
                }
            });

            const productos = Array.from(sku_elements).map((_, index) => {
                const sku = sku_elements[index]?.innerText.trim() || '';
                const cantidad = cantidad_elements[index]?.innerText.trim() || '';
                const tienda = listaFinal[index] || '';
                const precio_original = preciofull_elements[index]?.innerText.trim() || '';
                const precio_promocional = preciopromo_elements[index]?.innerText.trim() || '';
                const link_element = linkynombre_elements[index];
                const link = link_element ? link_element.href : '';
                const nombre_producto = link_element ? link_element.innerText.trim() : '';
                const [color, tamanio] = procesarString(tamanio_color_elements[index]?.innerText.trim() || '');
                const imagen_url = imagen_elements[index]?.src || '';

                return {
                    Nº: index + 1,
                    TITULO: nombre_producto,
                    FOTOS: imagen_url,
                    CODIGO_SKU: sku.slice(4).replace(/ /g, ""),
                    Link_SHEIN: link,
                    CANTIDAD: parseInt(cantidad),
                    PRECIO: parsearPrecio(precio_promocional),
                    PRECIO_REAL_SHEIN: parsearPrecio(precio_original),
                    COLOR: color,
                    TAMAÑO: tamanio,
                    TIENDA: tienda,
                };
            });

            console.log('lista de productos extraídos:', productos);

            // crear hoja xlsx
            const ws = XLSX.utils.json_to_sheet(productos);
            const range = XLSX.utils.decode_range(ws['!ref']);

            ws['M1'] = { v: 'Link de la Orden' };
            ws['M2'] = { v: url };

            const newRange = {
                s: { r: range.s.r, c: range.s.c },
                e: { r: Math.max(range.e.r, 1), c: 12 }
            };
            ws['!ref'] = XLSX.utils.encode_range(newRange);

            Object.keys(ws).forEach(cell => {
                if (/^[A-Z]+1$/.test(cell)) {
                    const col = cell.replace('1', '');
                    if (col !== 'A' && typeof ws[cell].v === 'string') {
                        ws[cell].v = ws[cell].v.replace(/_/g, ' ');
                    }
                }
            });

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!ws[cell_address]) continue;

                    let fillColor = null;
                    if (R === 0 || C === 0) {
                        fillColor = "B6D7A8"; // verde para título o primera columna
                    }

                    ws[cell_address].s = {
                        font: {
                            name: "Calibri",
                            sz: 12,
                            color: { rgb: "000000" },
                            bold: R === 0 // negrita solo en la cabecera
                        },
                        fill: fillColor
                            ? { patternType: "solid", fgColor: { rgb: fillColor } }
                            : undefined,
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                            wrapText: true
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } }
                        }
                    };
                    
                    if (R >= 1 && (C === 6 || C === 7)) {
                        ws[cell_address].z = '"$"#,##0.00';
                    }
                }
            }

            // anchos de columna
            ws['!cols'] = [
                { wch: 5 },   // Nº
                { wch: 30 },  // TITULO
                { wch: 15 },  // FOTOS
                { wch: 22 },  // CODIGO_SKU
                { wch: 30 },  // Link_SHEIN
                { wch: 10 },  // CANTIDAD
                { wch: 12 },  // PRECIO
                { wch: 12 },  // PRECIO_REAL_SHEIN
                { wch: 20 },  // COLOR
                { wch: 20 },  // TAMAÑO
                { wch: 20 },  // TIENDA
                { wch: 5 },   // ESPACIO EN BLANCO
                { wch: 30 }   // ORDEN
            ];
            ws['M1'] = { v: 'Link de la Orden' };
            ws['M2'] = { v: url };
            ws['!rows'] = [];
            for (let i = 0; i <= range.e.r; i++) {
                ws['!rows'][i] = { hpt: 45 }; // altura de las filas en puntos
            }
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Productos');

            XLSX.writeFile(wb, `Stock_Orden_${codigoOrden}.xlsx`);
            console.log(`archivo Stock_Orden_${codigoOrden}.xlsx descargado`);
        });
    }
})();