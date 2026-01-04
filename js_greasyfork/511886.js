// ==UserScript==
// @name         Captura P0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ayuda P0
// @match        https://oregoncomercial.es/AddVentaAutoCop.vbhtml
// @match        https://oregoncomercial.es/ModVentaAdmin.vbhtml/*
// @match        https://validadorcups.repsolluzygas.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/511886/Captura%20P0.user.js
// @updateURL https://update.greasyfork.org/scripts/511886/Captura%20P0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Verificar si estamos en alguna de las dos URLs de Oregon Comercial
    if (window.location.href.includes('https://oregoncomercial.es/AddVentaAutoCop.vbhtml') ||
        window.location.href.includes('https://oregoncomercial.es/ModVentaAdmin.vbhtml')) {

        window.addEventListener('load', function() {

            // Seleccionar los elementos CUPS y DNI en función de la URL
            var dniCliente = document.getElementById('DniCliente') || document.getElementById('CCBB');
            var cups = document.getElementById('CUPS') || document.getElementById('CUPS0'); // CUPS cambia de ID según la página

            // Obtener los elementos
            var emailInput = document.getElementById('EmailCliente');
            var checkboxServicios = Array.from(document.querySelectorAll('input[type="checkbox"][name="Servicios0"]'))
            .find(cb => cb.value === '(102)');

            // Función para actualizar el estado del checkbox
            function actualizarCheckboxServicios() {
                if (emailInput && checkboxServicios) {
                    if (emailInput.value.trim() === '') {
                        checkboxServicios.checked = false; // Desmarcar si está vacío
                    } else {
                        checkboxServicios.checked = true; // Marcar si hay contenido
                    }
                }
            }

            // Ejecutar una vez al cargar
            actualizarCheckboxServicios();

            // Escuchar cambios en el campo de email
            if (emailInput) {
                emailInput.addEventListener('input', actualizarCheckboxServicios);
            }

            if (cups) {
                // Crear el botón "P0"
                var botonP0 = document.createElement('button');
                botonP0.innerHTML = 'P0';
                botonP0.style.marginLeft = '10px'; // Espacio entre el campo y el botón

                // Añadir el botón después del campo CUPS
                cups.parentNode.insertBefore(botonP0, cups.nextSibling);

                // Evitar que el botón envíe el formulario
                botonP0.addEventListener('click', function(event) {
                    event.preventDefault(); // Evitar el envío del formulario

                    var dniValue = dniCliente ? dniCliente.value : '';
                    var cupsValue = cups ? cups.value : '';

                    // Combinar los valores
                    var textoCopiado = 'DNI: ' + dniValue + ', CUPS: ' + cupsValue;

                    // Crear un campo temporal para copiar al portapapeles
                    var campoTemporal = document.createElement('textarea');
                    campoTemporal.value = textoCopiado;
                    document.body.appendChild(campoTemporal);
                    campoTemporal.select();
                    document.execCommand('copy');
                    document.body.removeChild(campoTemporal);

                    // Abrir una nueva pestaña con la página de Repsol
                    window.open('https://validadorcups.repsolluzygas.com/solicitud', '_blank');
                });
            }

            // Mapeo entre el value del <option> seleccionado y el value del checkbox a activar
            const productoToCheckboxMap = {
                '(138)': '(103)',
                '(171)': '(103)',
                '(161)': '(103)',
                '(153)': '(104)',
                '(154)': '(104)',
                '(155)': '(104)',
                // Agrega aquí más relaciones
            };

            const selectProducto = document.getElementById('Producto0');

            if (selectProducto) {
                const checkboxes = document.querySelectorAll('input[type="checkbox"][name="Servicios0"]');

                function sincronizarCheckboxConProducto() {
                    const selectedValue = selectProducto.value;
                    const checkboxValueToMark = productoToCheckboxMap[selectedValue];

                    // Siempre desmarcar todos los checkboxes mapeados
                    Object.values(productoToCheckboxMap).forEach(value => {
                        const cb = Array.from(checkboxes).find(el => el.value === value);
                        if (cb) cb.checked = false;
                    });

                    // Solo marcar el nuevo si está mapeado
                    if (checkboxValueToMark) {
                        const checkboxToActivate = Array.from(checkboxes).find(cb => cb.value === checkboxValueToMark);
                        if (checkboxToActivate) {
                            checkboxToActivate.checked = true;
                        }
                    }
                }

                selectProducto.addEventListener('change', sincronizarCheckboxConProducto);
                sincronizarCheckboxConProducto(); // Ejecutar al cargar
            }

            const productoConfig = {
                '(153)': {
                    select: 'RL.1',
                    campo1: '0001',
                    campo2: '0001'
                },
                '(108)': {
                    select: 'RL.1',
                    campo1: '0001',
                    campo2: '0001'
                },
                '(154)': {
                    select: 'RL.2',
                    campo1: '0001',
                    campo2: '0001'
                },
                '(109)': {
                    select: 'RL.2',
                    campo1: '0001',
                    campo2: '0001'
                },
                '(155)': {
                    select: 'RL.3',
                    campo1: '0001',
                    campo2: '0001'
                },
                '(110)': {
                    select: 'RL.3',
                    campo1: '0001',
                    campo2: '0001'
                }
                // Agrega más relaciones aquí
            };

            const selectProductos = document.getElementById('Producto0');
            const otroSelect = document.getElementById('TarifaGas0'); // Reemplaza con el ID real
            const input1 = document.getElementById('Potencia0'); // Reemplaza con el ID real
            const input2 = document.getElementById('Potencia20'); // Reemplaza con el ID real
            const checkboxes = document.querySelectorAll('input[type="checkbox"][name="Servicios0"]');

            function sincronizarConProducto() {
                const selectedValue = selectProductos.value;
                const config = productoConfig[selectedValue];

                // Limpiar solo checkboxes definidos en el mapeo
                Object.values(productoConfig).forEach(conf => {
                    const cb = Array.from(checkboxes).find(el => el.value === conf.checkbox);
                    if (cb) cb.checked = false;
                });

                if (!config) return;

                // Activar checkbox
                const checkboxToActivate = Array.from(checkboxes).find(cb => cb.value === config.checkbox);
                if (checkboxToActivate) checkboxToActivate.checked = true;

                // Cambiar valor del otro select (TarifaGas0)
                if (otroSelect && config.select) {
                    const optionToSelect = Array.from(otroSelect.options).find(opt => opt.value === config.select);
                    if (optionToSelect) {
                        otroSelect.value = config.select;
                        otroSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Rellenar inputs
                if (input1 && config.campo1) input1.value = config.campo1;
                if (input2 && config.campo2) input2.value = config.campo2;
            }

            if (selectProducto) {
                selectProducto.addEventListener('change', sincronizarConProducto);
                sincronizarConProducto(); // Ejecutar al cargar
            }



        });
    }

// Verificar si estamos en la página de Repsol
if (window.location.href.includes('https://validadorcups.repsolluzygas.com/solicitud')) {

    // Función para capturar y descargar la pantalla
function capturarPantallaYDescargar() {
    let tdElement = document.querySelector('td.ng-star-inserted');
    let nombreArchivo = 'captura';

    if (tdElement) {
        let contenidoTd = tdElement.textContent.trim();
        nombreArchivo = 'P0_' + contenidoTd;
    }

    botonCaptura.style.display = 'none';

    html2canvas(document.body).then(canvas => {
        canvas.toBlob(function(blob) {
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = nombreArchivo + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            botonCaptura.style.display = 'block';

            // Cerrar la pestaña después de descargar
            window.close();
        });
    });
}


    let botonCaptura = document.createElement('button');
    botonCaptura.innerHTML = 'Capturar Pantalla';
    botonCaptura.style.position = 'fixed';
    botonCaptura.style.bottom = '10px';
    botonCaptura.style.right = '10px';
    botonCaptura.style.zIndex = '9999';
    botonCaptura.style.padding = '10px 20px';
    botonCaptura.style.backgroundColor = '#007bff';
    botonCaptura.style.color = '#fff';
    botonCaptura.style.border = 'none';
    botonCaptura.style.borderRadius = '5px';
    botonCaptura.style.cursor = 'pointer';

    document.body.appendChild(botonCaptura);
    botonCaptura.addEventListener('click', capturarPantallaYDescargar);

window.addEventListener('load', async function() {
    try {
        if (!navigator.clipboard) {
            alert('Tu navegador no soporta el acceso al portapapeles.');
            return;
        }

        const textoCopiado = await navigator.clipboard.readText();

        if (!textoCopiado) {
            alert('No se encontraron datos en el portapapeles.');
            return;
        }

        const [dniValue, cupsValue] = textoCopiado.split(',').map(text => text.split(': ')[1]);

        var dniField = document.querySelector('input[formcontrolname="document"]');
        var cupsField = document.querySelector('input[formcontrolname="cups"]');

        if (dniField && dniValue) {
            dniField.value = dniValue;
            dniField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (cupsField && cupsValue) {
            cupsField.value = cupsValue;
            cupsField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Esperar a que el formulario se envíe y cargue el resultado
        setTimeout(() => {
            let botonEnvio = Array.from(document.querySelectorAll('button, span')).find(el =>
                el.classList.contains('mdc-button__label') &&
                el.textContent.trim().toLowerCase().includes('consultar')
            );

            if (botonEnvio) {
                if (botonEnvio.tagName.toLowerCase() === 'span') {
                    botonEnvio = botonEnvio.closest('button');
                }

                if (botonEnvio) {
                    botonEnvio.click();
                }
            }
        }, 1000);

        // Capturar pantalla automáticamente tras otro retraso (por si hay que esperar resultados)
        setTimeout(() => {
            capturarPantallaYDescargar();
        }, 5000); // Puedes ajustar este tiempo según lo que tarde la web en mostrar resultados

    } catch (error) {
        console.error('Error al rellenar, enviar o capturar:', error);
    }
});

}

})();