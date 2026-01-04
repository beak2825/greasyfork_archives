// ==UserScript==
// @name         OregonH
// @namespace    http://tampermonkey.net/
// @version      13.00
// @description  Oficinas OK
// @author       Jorge
// @match        https://www.oregoncomercial.es/AddVentaAutoCop.vbhtml
// @match        https://oregoncomercial.es/AddVentaAutoCop.vbhtml
// @match        https://www.oregoncomercial.es/AddVentaInmobAC.vbhtml
// @match        https://oregoncomercial.es/AddVentaInmobAC.vbhtml
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488425/OregonH.user.js
// @updateURL https://update.greasyfork.org/scripts/488425/OregonH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtener selectOptions del almacenamiento local o establecer un valor predeterminado
    var selectOptions = localStorage.getItem('selectOptions');
    if (!selectOptions) {
        selectOptions = ['RL1', 'RL2', 'RL3'];
        localStorage.setItem('selectOptions', JSON.stringify(selectOptions));
    } else {
        selectOptions = JSON.parse(selectOptions);
    }

// Crear contenedor 1 para el botón Copiar y inputDato
var copyContainer = document.createElement('div');
copyContainer.style.position = 'fixed';
copyContainer.style.top = '20px';
copyContainer.style.right = '20px';
copyContainer.style.zIndex = '9999';
document.body.appendChild(copyContainer);

// Crear contenedor 1 para el botón Copiar y inputDato
var pasteContainer = document.createElement('div');
pasteContainer.style.position = 'fixed';
pasteContainer.style.top = '60px';
pasteContainer.style.right = '20px';
pasteContainer.style.zIndex = '9999';
document.body.appendChild(pasteContainer);

    // Crear un cuadro de entrada de datos
    var inputData = document.createElement('input');
    inputData.type = 'text';
    inputData.placeholder = 'CUPS GAS';
    inputData.id = 'inputDato';
    inputData.style.marginRight = '146px';
    inputData.style.borderRadius = '5px';
    inputData.style.border = '1px solid #ccc';
    inputData.style.height = '31px';
    inputData.style.fontSize = '17px';
    inputData.style.width = '200px';
    copyContainer.appendChild(inputData);

    // Crear un select con opciones RL1, RL2, RL3
    var selectElement = document.createElement('select');
    selectElement.id = 'selectOpciones';
    selectOptions.forEach(function(option) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
    pasteContainer.appendChild(selectElement);

    // Estilos para el select
    selectElement.style.padding = '5px'; // Ajusta el relleno del select
    selectElement.style.fontSize = '16px'; // Ajusta el tamaño de fuente del select
    selectElement.style.marginRight = '145px';
    selectElement.style.backgroundColor = '#007bff';
    selectElement.style.color = '#fff';
    selectElement.style.height = '35px';
    selectElement.style.border = '1px solid #ccc'; // Ajusta el borde del select
    selectElement.style.borderRadius = '5px'; // Ajusta el radio del borde del select
    selectElement.style.backgroundColor = '#fff'; // Ajusta el color de fondo del select
    selectElement.style.color = '#333'; // Ajusta el color del texto del select

    // Define los pares de campos de entrada: origen y destino
    var camposACopiar = [
        { origen: 'DniCliente', destino: 'DniCliente' },
        { origen: 'NomCliente', destino: 'NomCliente' },
        { origen: 'ApeCliente', destino: 'ApeCliente' },
        { origen: 'DirSuministro', destino: 'DirSuministro' },
        { origen: 'EmailCliente', destino: 'EmailCliente' },
        { origen: 'TelfCliente', destino: 'TelfCliente' },
        { origen: 'NumDirSuministro', destino: 'NumDirSuministro' },
        { origen: 'PisoDirSuministro', destino: 'PisoDirSuministro' },
        { origen: 'LetraDirSuministro', destino: 'LetraDirSuministro' },
        { origen: 'FechaNacimiento', destino: 'FechaNacimiento' },
        { origen: 'CuentaIBAN', destino: 'CuentaIBAN' },
        { origen: 'Observaciones', destino: 'Observaciones' },
        { origen: 'DniFirmante', destino: 'DniFirmante' },
        { origen: 'NomFirmante', destino: 'NomFirmante' },
        { origen: 'ApeFirmante', destino: 'ApeFirmante' },
        { origen: 'Cnae', destino: 'Cnae' },
        { origen: 'MotivoCTOtros', destino: 'MotivoCTOtros' },
        { origen: 'inputDato', destino: 'CUPS0' },
        // Agrega más pares de campos según sea necesario
    ];

    // Crea un botón para copiar
    var botonCopiar = document.createElement('button');
    botonCopiar.id = 'copiarBoton';
    botonCopiar.textContent = 'Copiar Venta';
    botonCopiar.style.position = 'fixed';
    botonCopiar.style.top = '20px';
    botonCopiar.style.right = '20px';
    botonCopiar.style.backgroundColor = '#007bff';
    botonCopiar.style.color = '#fff';
    botonCopiar.style.padding = '10px 20px';
    botonCopiar.style.border = 'none';
    botonCopiar.style.borderRadius = '5px';
    botonCopiar.style.cursor = 'pointer';
    botonCopiar.style.zIndex = '9999';
    botonCopiar.style.width = '140px';
    botonCopiar.textContent = 'Copiar';
    copyContainer.appendChild(botonCopiar);

// Evento click para el botón de copiar
botonCopiar.addEventListener('click', function() {
    var textoACopiar = '';

    // Itera sobre los pares de selectores y copia el valor del selector de origen
    selectACopiar.forEach(function(parSelect) {
        var selectOrigen = document.getElementById(parSelect.origen);

        if (selectOrigen) {
            textoACopiar += selectOrigen.value + '\n';
        } else {
            console.error('No se encontró el selector de origen: ' + parSelect.origen);
        }
    });

    // Itera sobre los pares de campos de entrada y copia su valor
    camposACopiar.forEach(function(parCampo) {
        var campoOrigen = document.getElementById(parCampo.origen);

        if (campoOrigen) {
            textoACopiar += campoOrigen.value + '\n';
        } else {
            console.error('No se encontró el campo de origen: ' + parCampo.origen);
        }
    });

    // Copia el texto al portapapeles
    GM_setClipboard(textoACopiar, 'text');
});


    // Define los pares de campos select: origen y destino
    var selectACopiar = [
        { origen: 'TipoDocIdent', destino: 'TipoDocIdent' },
        { origen: 'Poblacion', destino: 'Poblacion' },
        { origen: 'TipoDocFirmante', destino: 'TipoDocFirmante' },
        { origen: 'PaisCliente', destino: 'PaisCliente' },
        { origen: 'TipoVia', destino: 'TipoVia' },
        { origen: 'CambioTitularidad', destino: 'CambioTitularidad' },
        { origen: 'ComercializadoraAnt', destino: 'ComercializadoraAnt' },
        { origen: 'TratCliente', destino: 'TratCliente' },
        // Agrega más pares de selectores según sea necesario
    ];

    // Crea un botón para pegar
    var botonPegar = document.createElement('button');
    botonPegar.id = 'pegarBoton';
    botonPegar.textContent = 'Pegar Venta';
    botonPegar.style.position = 'fixed';
    botonPegar.style.top = '60px';
    botonPegar.style.right = '20px';
    botonPegar.style.backgroundColor = '#007bff';
    botonPegar.style.color = '#fff';
    botonPegar.style.padding = '10px 20px';
    botonPegar.style.border = 'none';
    botonPegar.style.borderRadius = '5px';
    botonPegar.style.cursor = 'pointer';
    botonPegar.style.zIndex = '9999';
    botonPegar.style.width = '140px';
    botonPegar.textContent = 'Pegar';
    pasteContainer.appendChild(botonPegar);





// Evento click para el botón de pegar
botonPegar.addEventListener('click', function() {
    navigator.clipboard.readText().then(function(text) {
        var lineas = text.split('\n');
        var totalCampos = selectACopiar.length + camposACopiar.length;
        var campoIndex = 0;

        // Obtener la opción seleccionada en selectOptions
        var selectedOptionValue = document.getElementById('selectOpciones').value;

        // Itera sobre las líneas del texto y pega en los selectores de destino y campos de entrada
        lineas.forEach(function(linea, index) {
            if (campoIndex < totalCampos) {
                if (campoIndex < selectACopiar.length) {
                    var selectDestino = document.getElementById(selectACopiar[campoIndex].destino);
                    if (selectDestino) {
                        selectDestino.value = linea;
                    } else {
                        console.error('No se encontró el selector de destino: ' + selectACopiar[campoIndex].destino);
                    }
                } else {
                    var campoDestino = document.getElementById(camposACopiar[campoIndex - selectACopiar.length].destino);
                    if (campoDestino) {
                        campoDestino.value = linea;
                    } else {
                        console.error('No se encontró el campo de destino: ' + camposACopiar[campoIndex - selectACopiar.length].destino);
                    }
                }
                campoIndex++;
            }
        });

        // Modificar los select del formulario según la opción seleccionada en selectOptions
        switch (selectedOptionValue) {
            case 'RL1':
                modificarSelect('Producto0', '(108)');
                modificarSelect('TarifaGas0', 'RL.1');
                break;
            case 'RL2':
                modificarSelect('Producto0', '(109)');
                modificarSelect('TarifaGas0', 'RL.2');
                break;
            case 'RL3':
                modificarSelect('Producto0', '(110)');
                modificarSelect('TarifaGas0', 'RL.3');
                break;
            default:
                console.error('Opción no reconocida: ' + selectedOptionValue);
        }

        // Rellenar Potencia0 y Potencia20 con "0001"
        var potencia0 = document.getElementById('Potencia0');
        var potencia20 = document.getElementById('Potencia20');
        if (potencia0 && potencia20) {
            potencia0.value = '0001';
            potencia20.value = '0001';
        } else {
            console.error('No se encontraron los campos de potencia.');
        }

        // Alerta al usuario después de pegar
        alert('¡Recuerda cambiar los SERVICIOS!!!!');
    }).catch(function(err) {
        console.error('Error al leer el portapapeles: ', err);
        alert('Error al leer el portapapeles. Por favor, intenta de nuevo.');
    });
});



    // Función para modificar los campos select
    function modificarSelect(selectId, valor) {
        var selectElement = document.getElementById(selectId);
        if (selectElement) {
            selectElement.value = valor;
        } else {
            console.error('No se encontró el campo select con ID: ' + selectId);
        }
    }

    // Evento de cambio para el select de opciones
    selectElement.addEventListener('change', function() {
        // Obtener el valor seleccionado del select
        var selectedOption = selectElement.value;
        // Actualizar selectOptions en el almacenamiento local
        localStorage.setItem('selectOptions', JSON.stringify(selectOptions));
    });
    // Función para modificar los campos select
    function modificarSelect2(selectId, valor) {
        var selectElement = document.getElementById(selectId);
        if (selectElement) {
            selectElement.value = valor;
        } else {
            console.error('No se encontró el campo select con ID: ' + selectId);
        }
    }

    // Espera a que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        // Selecciona el elemento <select>
        var selectElement = document.getElementById('CambioTitularidad');

        // Selecciona el checkbox
        var checkboxElement = document.getElementById('Servicios0');

        // Añade un evento al cambiar el valor del select
        selectElement.addEventListener('change', function() {
            // Marca o desmarca el checkbox basado en la selección
            if (selectElement.value === "") {
                checkboxElement.checked = false;
            } else {
                checkboxElement.checked = true;
            }
        });
    }, false);

    // Función para añadir el nuevo desplegable
    function addDropdownAndButton() {
        // Selecciona el contenedor donde añadir el nuevo desplegable
        var targetContainer = document.querySelector('tr:last-child td:last-child');

        if (targetContainer) {
            // Crea una nueva fila para el desplegable
            var newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="formulario" style="width: 100px; text-align: left; vertical-align: top">
                    <label for="ClienteRepsol">Cliente Repsol:</label>
                </td>
                <td>
                    <select name="ClienteRepsol" id="ClienteRepsol" style="width: 200px">
                        <option value="No" selected="">No</option>
                        <option value="Opcion1">CAMBIO DE TITULAR YA CLIENTE REPSOL</option>
                        <option value="Opcion2">CAMBIO DE PRODUCTO YA CLIENTE REPSOL</option>
                        <option value="Opcion3">CAMBIO DE POTENCIA YA CLIENTE REPSOL</option>
                    </select>
                    <button id="emailButton" style="display: none; margin-left: 10px;">Enviar Email</button>
                </td>
            `;

            // Inserta la nueva fila antes de la fila de observaciones
            var textareaRow = document.querySelector('textarea[name="Observaciones"]').closest('tr');
            textareaRow.parentNode.insertBefore(newRow, textareaRow);
        }
    }

    // Función para validar el formato del CUPS
    function isValidCUPS(cups) {
        const cupsRegex = /^ES\d{16}[A-Z]{2}$/;
        return cupsRegex.test(cups);
    }

    // Función para generar el correo electrónico
    function generateEmail(event) {
        event.preventDefault();

        var repsolDropdown = document.getElementById('ClienteRepsol');
        var selectedText = repsolDropdown.options[repsolDropdown.selectedIndex].text;
        var cupsText = document.getElementById('CUPS0').value;

        if (!isValidCUPS(cupsText)) {
            alert('No has introducido un CUPS o no es correcto.');
            return;
        }

        var subject = cupsText;
        var body = `Hola!\n\nNotifico ${selectedText} del CUPS ${cupsText}`;

        window.location.href = `mailto:soportepuntos@oregoncomercial.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Espera a que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        // Selecciona el elemento <select> y el checkbox
        var selectElement = document.getElementById('CambioTitularidad');
        var checkboxElement = document.getElementById('Servicios0');

        // Añade un evento al cambiar el valor del select
        selectElement.addEventListener('change', function() {
            // Marca o desmarca el checkbox basado en la selección
            if (selectElement.value === "") {
                checkboxElement.checked = false;
            } else {
                checkboxElement.checked = true;
            }
        });

        // Añade el nuevo desplegable y botón
        addDropdownAndButton();

        // Selecciona el nuevo desplegable, el botón de email y el área de texto de observaciones
        var repsolDropdown = document.getElementById('ClienteRepsol');
        var emailButton = document.getElementById('emailButton');
        var observacionesTextarea = document.getElementById('Observaciones');

        // Define un mapa de opciones y textos correspondientes
        var textMap = {
            "Opcion1": "** CAMBIO DE TITULAR YA CLIENTE REPSOL **",
            "Opcion2": "** CAMBIO DE PRODUCTO YA CLIENTE REPSOL **",
            "Opcion3": "** CAMBIO DE POTENCIA YA CLIENTE REPSOL **"
        };

        // Añade un evento al cambiar el valor del desplegable de Cliente Repsol
        repsolDropdown.addEventListener('change', function() {
            // Limpia todos los textos del mapa de observaciones
            Object.values(textMap).forEach(function(text) {
                observacionesTextarea.value = observacionesTextarea.value.replace(text, "");
            });

            // Añade el texto correspondiente a la opción seleccionada
            var selectedText = textMap[repsolDropdown.value];
            if (selectedText) {
                observacionesTextarea.value += selectedText;
            }

            // Muestra u oculta el botón de email según la selección
            if (repsolDropdown.value === "No") {
                emailButton.style.display = "none";
            } else {
                emailButton.style.display = "inline";
            }
        });

        // Añade un evento al botón de email para generar el correo
        emailButton.addEventListener('click', generateEmail);
    }, false);

    // Espera a que el DOM esté completamente cargado
    window.addEventListener('load', function() {
        // Selecciona el desplegable
        var dropdown = document.getElementById('Oferta0');

        // Mapa de opciones que deshabilitan ciertos checkboxes
        var disableMap = {
            "37": ["(103)", "(109)", "(108)"],
            "48": ["(103)", "(107)", "(108)"],
            "38": ["(103)", "(107)", "(108)"],
            // Añadir más mappings según sea necesario
        };

        // Lista de checkboxes que deben estar deshabilitados si no hay ninguna opción seleccionada
        var defaultDisabledCheckboxes = ["(107)", "(109)", "(108)"]; // Añadir los valores de checkboxes que deben estar deshabilitados por defecto

        // Función para habilitar todos los checkboxes
        function enableAllCheckboxes() {
            var checkboxes = document.querySelectorAll('input[type="checkbox"][name="Servicios0"]');
            checkboxes.forEach(function(checkbox) {
                checkbox.disabled = false;
                checkbox.parentNode.style.color = ""; // Restablece el color del texto
            });
        }

        // Función para deshabilitar y deseleccionar los checkboxes correspondientes
        function disableAndDeselectCheckboxes(values) {
            values.forEach(function(checkboxValue) {
                var checkbox = document.querySelector('input[type="checkbox"][name="Servicios0"][value="' + checkboxValue + '"]');
                if (checkbox) {
                    checkbox.disabled = true;
                    checkbox.checked = false;
                }
            });
        }

        // Función para resaltar los checkboxes habilitados
        function highlightEnabledCheckboxes() {
            var checkboxes = document.querySelectorAll('input[type="checkbox"][name="Servicios0"]');
            checkboxes.forEach(function(checkbox) {
                if (!checkbox.disabled) {
                    checkbox.parentNode.style.color = "green"; // Cambia el color del texto para indicar que está habilitado
                }
            });
        }

        // Añadir evento de cambio al desplegable
        dropdown.addEventListener('change', function() {
            // Habilitar todos los checkboxes al cambiar la selección
            enableAllCheckboxes();

            // Obtener el valor seleccionado
            var selectedValue = dropdown.value;

            // Deshabilitar y deseleccionar los checkboxes correspondientes si hay una opción seleccionada
            if (selectedValue !== "0" && disableMap[selectedValue]) {
                disableAndDeselectCheckboxes(disableMap[selectedValue]);
            } else if (selectedValue === "0") {
                // Deshabilitar y deseleccionar los checkboxes predeterminados si no hay ninguna opción seleccionada
                disableAndDeselectCheckboxes(defaultDisabledCheckboxes);
            }
        });

        // Inicializa el estado de los checkboxes según el valor seleccionado al cargar la página
        var initialValue = dropdown.value;
        if (initialValue !== "0" && disableMap[initialValue]) {
            disableAndDeselectCheckboxes(disableMap[initialValue]);
        } else if (initialValue === "0") {
            disableAndDeselectCheckboxes(defaultDisabledCheckboxes);
        }
    }, false);
})();