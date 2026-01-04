// ==UserScript==
// @name         OregonH
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Cosillas
// @author       Jorge
// @match        https://www.oregoncomercial.es/AddVentaAutoCop.vbhtml
// @match        https://oregoncomercial.es/AddVentaAutoCop.vbhtml
// @match        https://www.oregoncomercial.es/AddVentaInmobAC.vbhtml
// @match        https://oregoncomercial.es/AddVentaInmobAC.vbhtml
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488688/OregonH.user.js
// @updateURL https://update.greasyfork.org/scripts/488688/OregonH.meta.js
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
})();