// ==UserScript==
// @name         Menu Flotante con Guías Interactivas
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Crear un menú flotante con guías paso a paso, manteniendo interactividad
// @author       Tu Nombre
// @match        https://viesgo.lightning.force.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527182/Menu%20Flotante%20con%20Gu%C3%ADas%20Interactivas.user.js
// @updateURL https://update.greasyfork.org/scripts/527182/Menu%20Flotante%20con%20Gu%C3%ADas%20Interactivas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos para el menú flotante, el ícono, los pasos y la flecha
    const styles = `
        .floating-menu {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: none; /* Oculto por defecto */
            font-family: Arial, sans-serif;
        }
        .floating-menu button {
            display: block;
            margin-bottom: 10px;
            padding: 10px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            text-align: center;
            font-size: 14px;
        }
        .floating-menu button:hover {
            background: #0056b3;
        }

        .tour-highlight {
            position: absolute;
            border: 3px solid #ff5722;
            border-radius: 5px;
            z-index: 9999;
            pointer-events: none;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        .tour-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 300px;
            line-height: 1.5;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        .tour-popup h3 {
            margin: 0 0 10px;
            font-size: 18px;
            color: #333;
        }
        .tour-popup p {
            margin: 0 0 15px;
            color: #555;
        }
        .tour-popup button {
            margin-right: 5px;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
        .tour-popup button:hover {
            background: #0056b3;
        }
        .help-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
        }
        .help-icon:hover {
            background: #0056b3;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Crear ícono de ayuda
    const helpIcon = document.createElement('div');
    helpIcon.className = 'help-icon';
    helpIcon.textContent = '?';
    document.body.appendChild(helpIcon);

    // Crear menú flotante
    const menu = document.createElement('div');
    menu.className = 'floating-menu';
    menu.innerHTML = `
        <button data-guide="cambio-titular">Cambio Titularidad</button>
        <button data-guide="cambiar-numero-cuenta">Cambiar Número de Cuenta</button>
        <button data-guide="precio-actual">Precio Actual</button>
        <button data-guide="crear-solicitud">Crear Solicitud</button>
        <button data-guide="baja-definitiva">Cerrar</button>
    `;
    document.body.appendChild(menu);

    // Mostrar u ocultar el menú al hacer clic en el ícono
    helpIcon.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Pasos de la guía
    const guides = {
        'cambio-titular': [
            {
                title: 'Paso 1: Página inicial',
                text: 'Haz clic en este botón para comenzar el proceso.<p><img src="https://i.ibb.co/HfthDsLk/01.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
                element: '.slds-context-bar__label-action.slds-p-left--xx-small',
            },
            {
                title: 'Paso 2: Crear Cliente',
                text: 'Haz clic en "Nuevo" para añadir un nuevo cliente. <p><p>En caso de que el cliente este creado, puedes ir al paso 6 <p><img src="https://i.ibb.co/mCBztQSH/02.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
                element: '[data-target-selection-name="sfdc:StandardButton.Account.New"]',
            },
            {
                title: 'Paso 3: Selección Tipo Cliente',
                text: 'Selecciona el tipo de cliente, si es un particular sería Persona.',
            },
            {
                title: 'Paso 4: Completar datos',
                text: 'Rellena todos los datos necesarios en el formulario para continuar. Si al guardar da error, mostrara lo que tienes que rellenar o este mal. Recuerda introducir "Estado o Provincia" manualmente.',
            },
            {
                title: 'Paso 5: Cliente Creado!',
                text: 'Ya tenemos la ficha base del cliente.',
            },
            {
                title: 'Paso 6: Acuerdo Comercial y Datos de Pago',
                text: 'Vamos a añadir el numero de cuenta. <p>Pulsa en Datos de Pago</p> <img src="https://i.ibb.co/MDcRgLfz/03.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 7: Nuevo Datos de Pago',
                text: 'Pulsamos en Nuevo <p> <img src="https://i.ibb.co/mCBztQSH/02.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 8: Añadimos los datos',
                text: 'Recuerda<p><p>- IBAN (Manual): Cuenta completa<p>- Cuenta Bancaria: Los ultimos 10 Digitos del IBAN<p>- Digito de control: Los dos anteriores a Cuenta Bancaria<p>- Codigo IBAN: El tipico ESXX<p>- IBAN (Automatico): Volvemos a poner el IBAN completo)',
            },
            {
                title: 'Paso 9: Volvemos al cliente para crear el Acuerdo Comercial',
                text: 'Volvemos al cliente <p>',
            },
            {
                title: 'Paso 10: Acuerdo Comercial',
                text: 'Vamos a crear un acuerdo comercial para recibir el contrato del anterior titular. <p>Pulsa en Acuerdos Comerciales</p><p><img src="https://i.ibb.co/pjR7sXNt/05.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 11: Nuevo Acuerdo',
                text: 'Haz clic en "Nuevo" para añadir un nuevo Acuerdo Comercial. <p><img src="https://i.ibb.co/mCBztQSH/02.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 12: Tipo de Energia',
                text: 'Selecciona o Electricidad o Gas',
            },
            {
                title: 'Paso 13: Rellenar datos',
                text: 'Tener en cuenta lo siguiente : <p></p><p>- La dirección ya deberia estar creada (rellena el nombre y saldra para seleccionar), si no es la misma que la vivienda, la creamos</p><p>- Clase de Pago, no se toca</p><p>- Datos de Pago y Datos de Cobro: Seleccionamos debajo la cuenta ya creada.<p>- Condiciones de Pago: Ponemos ZV09<p>- Formulario de Facturacion: En Papel o Electronica<p>- Guardar',
            },
            {
                title: 'Paso 14: Apuntatelo!',
                text: 'Guarda el Numero del acuerdo comercial, lo necesitaremos luego, por ejemplo:<p><p>- Luz: XXXXXXXX<p>- Gas: XXXXXXX',
            },
            {
                title: 'Paso 15: Si es Luz y Gas',
                text: 'Seguimos los pasos para crear el acuerdo comercial que nos falte.',
            },
            {
                title: 'Paso 16: Vamos a la ficha del anterior titular.',
                text: 'Entramos en Contratos Utilities <p><img src="https://i.ibb.co/5Wkxq7pr/06.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 17: Entramos en el contrato que queremos cambiar.',
                text: 'Entramos en el Contrato',
            },
            {
                title: 'Paso 18: Cambio Titular',
                text: 'En el menu inferior<p><p>- Gestiones Contractuales<p>- Cambio de Titular <p> <img src="https://i.ibb.co/23ntj51m/07.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 19: Cambio Titular',
                text: 'En el desplegable pulsamos Cambio de titularidad',
            },
            {
                title: 'Paso 20: Cambio Titular',
                text: 'Seguir los pasos<p><p>- Pulsamos: Busqueda de Acuerdos.<p>- Detail<p>- Ponemos el DNI del NUEVO titular.<p>- Pulsamos: Buscar Accounts<p>- Pulsamos: Buscar Acuerdos y ponemos el que copiamos.',
            },
            {
                title: 'Paso 21: Cambio Titular',
                text: 'En CANALES<p><p>- Subcanal: Seleccionamos Oficinas.',
            },
             {
                title: 'Paso 22: Cambio Titular',
                text: 'Pulsamos en Adjuntar documentos y aceptar<p><p>- Despues nos aparecera una ventana, donde tenemos que adjuntar la documentación, contrato firmado en Oregon, DNI, etc...',
            },
            {
                title: 'Paso 23: Cambio Titular',
                text: 'Repetimos la Operacion con la otra energia.',
            },
            {
                title: 'Paso 24: Finalizado!',
                text: 'Confirmamos que en el nuevo titular, tiene que salir en Contratos Utilites un contrato nuevo en estado "En Solicitud"',
            },
        ],
        'cambiar-numero-cuenta': [
            {
                title: 'Paso 1: Cliente',
                text: 'Desde el cliente vamos a Datos de Pago <p><img src="https://i.ibb.co/MDcRgLfz/03.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 2: Crear Numero de cuenta',
                text: 'Haz clic en "Nuevo" para añadir un nuevo numero de cuenta.<p><img src="https://i.ibb.co/mCBztQSH/02.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 3: Introduccion de Datos',
                text: 'Recuerda<p><p>- IBAN (Manual): Cuenta completa<p>- Cuenta Bancaria: Los ultimos 10 Digitos del IBAN<p>- Digito de control: Los dos anteriores a Cuenta Bancaria<p>- Codigo IBAN: El tipico ESXX<p>- IBAN (Automatico): Volvemos a poner el IBAN completo)',
            },
            {
                title: 'Paso 4: Cambiar la domiciliación',
                text: 'Ahora vamos a Contratos utilites para mirar de que contrato debemos cambiar el numero de cuenta y entramos en el acuerdo comercial de ese contrato.<p><img src="https://i.ibb.co/k2bqt7pH/08.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 5: Seleccionar numero de cuenta',
                text: 'Dentro del acuerdo comercial, seleccionamos en ambos casos la nueva cuenta.<p><img src="https://i.ibb.co/Q3tY57ft/09.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 6: Guardamos y finalizamos',
                text: 'Le damos al boton de la parte inferior "Guardar" y ya estaría.',
            },
        ],
        'precio-actual': [
            {
                title: 'Paso 1: Contratos utilities',
                text: 'Desde el cliente vamos a Contratos utilities <p><img src="https://i.ibb.co/5Wkxq7pr/06.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 2: Entramos en el contrato',
                text: 'Entramos en el contrato que queremos ver el precio',
            },
            {
                title: 'Paso 3: Versiones del contrato',
                text: 'Ahora entramos en versiones del contrato <p><img src="https://i.ibb.co/1tH8mj5r/10.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 4: Version activa',
                text: 'Tenemos que entrar en la versión activa, estara con el estado: Activo',
            },
            {
                title: 'Paso 5: Precios',
                text: 'En la parte superior derecha, podremos ver los precios actuales del cliente. <p><img src="https://i.ibb.co/jkXcJPMq/11.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
        ],
        'crear-solicitud': [
            {
                title: 'Paso 1: Solicitudes',
                text: 'Desde el cliente vamos al Contratos donde poner la solicitud, si no es a ningun contrato en concreto, desde la pagina principal del cliente vamos a <p><img src="https://i.ibb.co/0RnX4Wcc/12.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 2: Nueva Solicitud',
                text: 'Haz clic en "Nuevo" para añadir una nueva solicitud<p><img src="https://i.ibb.co/mCBztQSH/02.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 3: Rellenamos la Solicitud',
                text: 'Asunto - Ponemos el titulo de la solicitud<p>Descripción - Rellenamos lo que sucede, explicandolo lo mejor posible<p>Tipo de Solicitud - De que tipo será la solicitud<p>Categoría - Selecciona la correcta<p>Tipificación - Selecciona la que más se aproxime al problema.<p><p>Le damos a Crear'
            },
            {
                title: 'Paso 4: Escalar Solicitud',
                text: 'Ahora tenemos que escalar la solicitud, en la solicitud bajamos un poco y encontaremos "Equipo de Tratamiento" <p><img src="https://i.ibb.co/gZrPxvwQ/13.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 5: Asignar Cola',
                text: 'Cambiamos la cola para que puedan gestionar correctamente la solicitud, seleccionamos la COLA - ATC-SOPORTE PREMIUM y le damos a Guardar" <p><img src="https://i.ibb.co/jk6ftx94/14.png" alt="Imagen de referencia" style="max-width: 100%; height: auto; border-radius: 5px;">',
            },
            {
                title: 'Paso 6: Solicitud Creada',
                text: 'Listo, la solicitud esta creada.',
            },
        ],
        'baja-definitiva': [
            // Pasos para baja definitiva
        ],
    };

    // Función para iniciar una guía
    function startGuide(guideName) {
        const steps = guides[guideName];
        if (!steps) return;

        let currentStep = 0;
        let currentURL = window.location.href;

        const highlight = document.createElement('div');
        highlight.className = 'tour-highlight';

        const popup = document.createElement('div');
        popup.className = 'tour-popup';

        // Ocultar el menú al iniciar la guía
        menu.style.display = 'none';

        // Función para mostrar un paso
        function showStep(stepIndex) {
            if (stepIndex >= steps.length) {
                endGuide();
                return;
            }

            const step = steps[stepIndex];

            // Actualizar contenido del popup
            popup.innerHTML = `
                <h3>${step.title}</h3>
                <p>${step.text}</p>
                <button class="back">Atrás</button>
                <button class="next">Siguiente</button>
                <button class="skip">Salir</button>
            `;

            // Resaltar elemento, si existe
            if (step.element) {
                const target = document.querySelector(step.element);
                if (target) {
                    const rect = target.getBoundingClientRect();
                    highlight.style.top = `${rect.top + window.scrollY}px`;
                    highlight.style.left = `${rect.left + window.scrollX}px`;
                    highlight.style.width = `${rect.width}px`;
                    highlight.style.height = `${rect.height}px`;
                    document.body.appendChild(highlight);
                }
            } else if (step.highlightElements) {
                step.highlightElements.forEach(highlightElement => {
                    const target = document.querySelector(highlightElement.selector);
                    if (target) {
                        const rect = target.getBoundingClientRect();
                        highlight.style.top = `${rect.top + window.scrollY}px`;
                        highlight.style.left = `${rect.left + window.scrollX}px`;
                        highlight.style.width = `${rect.width}px`;
                        highlight.style.height = `${rect.height}px`;
                        document.body.appendChild(highlight);
                    }
                });
            } else {
                highlight.remove();
            }

            // Manejo especial para pasos que esperan cambio de URL
            if (step.waitForURLChange) {
                const observer = setInterval(() => {
                    if (window.location.href !== currentURL) {
                        clearInterval(observer);
                        currentURL = window.location.href;
                        showStep(stepIndex + 1); // Avanzar al siguiente paso
                    }
                }, 100);
            }

            popup.querySelector('.back').onclick = () => {
                if (stepIndex > 0) showStep(stepIndex - 1);
            };
            popup.querySelector('.next').onclick = () => showStep(stepIndex + 1);
            popup.querySelector('.skip').onclick = endGuide;

            document.body.appendChild(popup);
        }

        function endGuide() {
            highlight.remove();
            popup.remove();
            // No mostrar el menú al finalizar la guía
        }

        showStep(currentStep);
    }

    // Event listeners para los botones del menú
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const guideName = e.target.getAttribute('data-guide');
            startGuide(guideName);
        }
    });
})();