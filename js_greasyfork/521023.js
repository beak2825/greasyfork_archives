// ==UserScript==
// @name         Menu Co
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  B
// @author
// @license MIT
// @match        http://191.234.162.51/*
// @exclude      http://191.234.162.51/LTConsultores1.3/Login
// @exclude      http://191.234.162.51/GestionErp1.3/Login
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/521023/Menu%20Co.user.js
// @updateURL https://update.greasyfork.org/scripts/521023/Menu%20Co.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verificar si estamos en la ventana principal
    if (window.top !== window.self) {
        return; // No hacer nada si estamos en un iframe
    }

    // Crear el menú flotante
    let menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.padding = '5px';
    menu.style.backgroundColor = 'rgba(0,0,0,0.8)';
    menu.style.color = 'white';
    menu.style.zIndex = '10000';
    menu.style.borderRadius = '5px';
    menu.style.fontSize = '12px'; // Reducir tamaño de fuente
    menu.style.maxWidth = '180px'; // Hacer el menú más estrecho
    menu.style.transition = 'transform 0.3s'; // Añadir animación al minimizar/maximizar

    // Cargar posición guardada desde localStorage
    const savedPosition = JSON.parse(localStorage.getItem('menuPosition'));
    if (savedPosition) {
        menu.style.top = savedPosition.top + 'px';
        menu.style.right = savedPosition.right + 'px';
    }

    // Cargar estado de minimizado/maximizado desde localStorage
    const isMinimized = localStorage.getItem('menuMinimized') === 'true';
    let menuContent = document.createElement('div');
    menuContent.style.display = isMinimized ? 'none' : 'block'; // Mostrar u ocultar contenido basado en el estado guardado

    // Título del menú
    let menuTitle = document.createElement('strong');
    menuTitle.innerText = 'Menú de Formulario';
    menu.appendChild(menuTitle);

    // Botón para minimizar/maximizar el menú
    let toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = isMinimized ? '+' : '−'; // Símbolo para minimizar o maximizar
    toggleBtn.style.marginLeft = '5px';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.onclick = function() {
        if (menuContent.style.display === 'none') {
            menuContent.style.display = 'block'; // Mostrar contenido
            toggleBtn.innerHTML = '−'; // Cambiar a símbolo de minimizar
            localStorage.setItem('menuMinimized', 'false'); // Actualizar estado
        } else {
            menuContent.style.display = 'none'; // Ocultar contenido
            toggleBtn.innerHTML = '+'; // Cambiar a símbolo de maximizar
            localStorage.setItem('menuMinimized', 'true'); // Actualizar estado
        }
        // Guardar la posición y estado del menú
        localStorage.setItem('menuPosition', JSON.stringify({
            top: menu.offsetTop,
            right: menu.offsetRight
        }));
    };

    menu.appendChild(toggleBtn);

    // Crear campos de entrada
    function crearCampo(nombre, id) {
        let campo = document.createElement('div');
        campo.style.marginBottom = '5px';

        let label = document.createElement('label');
        label.htmlFor = id;
        label.innerText = nombre + ': ';
        label.style.fontSize = '11px'; // Reducir tamaño de fuente
        label.style.display = 'block';

        let input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.style.width = '100%';
        input.style.padding = '2px';
        input.style.fontSize = '12px';

        // Cargar datos del localStorage si existen
        input.value = localStorage.getItem(id) || '';

        // Guardar datos en localStorage al cambiar
        input.addEventListener('input', function() {
            localStorage.setItem(id, input.value);
        });

        campo.appendChild(label);
        campo.appendChild(input);
        menuContent.appendChild(campo);
    }

    // Crear campos de entrada
    crearCampo('Cuenta', 'cuentaInput');
    crearCampo('Costo', 'costoInput');
    crearCampo('Tipo Doc', 'tipoDocInput');
    crearCampo('Num Doc', 'numDocInput');
    crearCampo('Fecha', 'fechaInput');
    crearCampo('Rut', 'rutInput'); // Campo "Rut" agregado
    crearCampo('Descripción', 'glodetInput');
    crearCampo('Debe', 'debeInput');
    crearCampo('Haber', 'haberInput');

    // Función para llenar campos del formulario
    function llenarCampos() {
        let campos = {
            'cuentaInput': 'MainContent_txtCuenta',
            'costoInput': 'MainContent_txtCentro',
            'tipoDocInput': 'MainContent_txtTipoDoc',
            'numDocInput': 'MainContent_txtNumdoc',
            'fechaInput': 'ctl00_MainContent_rdpFecdoc_dateInput',
            'rutInput': 'MainContent_txtRut',
            'glodetInput': 'MainContent_txtGlodet',
            'debeInput': 'MainContent_txtDebe',
            'haberInput': 'MainContent_txtHaber'
        };

        for (let key in campos) {
            let input = document.getElementById(key);
            if (input && input.value) {
                let campoFormulario = document.getElementById(campos[key]);
                campoFormulario.value = input.value;

                // Simular eventos para que se registren las validaciones
                campoFormulario.dispatchEvent(new Event('input', { bubbles: true }));
                campoFormulario.dispatchEvent(new Event('change', { bubbles: true }));
                campoFormulario.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }

        // Ejecutar __doPostBack para activar validaciones
        if (typeof __doPostBack === 'function') {
            __doPostBack('ctl00$MainContent$txtCuenta', '');
        }
    }

    // Función para ejecutar la secuencia de clics
    function ejecutarSecuencia() {
        let botonAgregar = document.getElementById('MainContent_btnAgregar');
        if (botonAgregar) {
            botonAgregar.click(); // Hacer clic en el botón Agregar
            setTimeout(() => {
                llenarCampos(); // Llenar campos después de un pequeño retraso
                setTimeout(() => {
                    let botonDetAdd = document.getElementById('MainContent_btnDetAdd');
                    if (botonDetAdd) {
                        botonDetAdd.click(); // Hacer clic en el botón Det Add
                    } else {
                        alert('El botón Det Add no se encontró.');
                    }
                }, 100); // Retraso antes de hacer clic en Det Add
            }, 100); // Retraso para permitir que el formulario se cargue
        } else {
            alert('El botón Agregar no se encontró.');
        }
    }

    // Botón para llenar campos
    let llenarBtn = document.createElement('button');
    llenarBtn.innerHTML = 'Llenar Campos';
    llenarBtn.style.margin = '5px 0';
    llenarBtn.style.width = '100%';
    llenarBtn.onclick = llenarCampos;
    menuContent.appendChild(llenarBtn);

    // Botón para ejecutar la secuencia
    let ejecutarBtn = document.createElement('button');
    ejecutarBtn.innerHTML = 'Agregar y Enviar';
    ejecutarBtn.style.margin = '5px 0';
    ejecutarBtn.style.width = '100%';
    ejecutarBtn.onclick = ejecutarSecuencia;
    menuContent.appendChild(ejecutarBtn);

    // Añadir el contenido al menú
    menu.appendChild(menuContent);

    // Añadir el menú a la página
    document.body.appendChild(menu);
})();
