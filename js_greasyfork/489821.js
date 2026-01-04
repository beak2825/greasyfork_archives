// ==UserScript==
// @name         Botones LTConsultores Menu y Remuneraciones Optimizado
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Agrega botones personalizados a las páginas LTConsultores Menu y Remuneraciones, con botones más juntos y aislando estilos
// @license      MIT
// @author       Jairo Pineda
// @match        http://191.234.162.51/*
// @exclude      http://191.234.162.51/LTConsultores1.3/Login*
// @exclude      http://191.234.162.51/GestionErp1.3/Login*
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/489821/Botones%20LTConsultores%20Menu%20y%20Remuneraciones%20Optimizado.user.js
// @updateURL https://update.greasyfork.org/scripts/489821/Botones%20LTConsultores%20Menu%20y%20Remuneraciones%20Optimizado.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const colores = {
        principal: '#004E7C', // Color principal más claro
        hover: '#007AB8', // Color de hover más claro
        bordeHover: '#005F99', // Color del borde en hover
        botonCerrar: {
            fondo: '#004E7C',
            borde: 'black',
            fondoHover: '#007AB8',
            bordeHover: 'red',
        }
    };

    // Configuración de botones para cada sección y cada conjunto de botones
    const configuraciones = {
        menuLeft: {
            section: 'menu',
            urlContains: "/LTConsultores1.3/",
            botones: [
                { texto: "Egreso", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Transac/PagMasPro", hover: "Emisión Pago Masivo Proveedores", id: "menu_left_btn1", style: { left: "10px", top: "200px", width: "100px" } },
                { texto: "Ingreso", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Transac/PagMasCli", hover: "Recepción Pago Masivo Clientes", id: "menu_left_btn2", style: { left: "10px", top: "230px", width: "100px" } },
                { texto: "Comprobantes", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Transac/Comprobantes", hover: "Todos los Comprobantes Contables", id: "menu_left_btn3", style: { left: "10px", top: "260px", width: "100px" } },
                { texto: "Balance", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptBalanceGeneral", hover: "Balance General de las Cuentas", id: "menu_left_btn4", style: { left: "10px", top: "290px", width: "100px" } },
                { texto: "Análisis", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptAnalisisCuenta", hover: "Análisis de Cuentas Contables", id: "menu_left_btn5", style: { left: "10px", top: "320px", width: "100px" } },
                { texto: "Libro Diario", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptLibroDiario", hover: "Movimientos de los Meses del Año", id: "menu_left_btn6", style: { left: "10px", top: "350px", width: "100px" } },
                { texto: "Libro Mayor", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptLibroMayor", hover: "Refleja Operaciones Contables", id: "menu_left_btn7", style: { left: "10px", top: "380px", width: "100px" } },
                { texto: "Plan Cuentas", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Maestras/PlanCuentas", hover: "Agregar Plan de Cuentas Contables", id: "menu_left_btn8", style: { left: "10px", top: "410px", width: "100px" } },
                { texto: "Arregla Saldos", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Procesos/ProActualizaSaldos", hover: "Arregla Saldos de Cuentas", id: "menu_left_btn9", style: { left: "10px", top: "440px", width: "100px" } },
                { texto: "Ir Remunera.", url: "http://191.234.162.51/GestionErp1.3/Login", hover: "Ir a Remuneraciones de LT Consultores", id: "menu_left_btn10", style: { left: "10px", top: "470px", width: "100px"}, newTab: true }
            ],
            toggleKey: "estadoBotonesMenuLeft",
            toggleTextVisible: "<<",
            toggleTextHidden: ">>",
            toggleTitleVisible: "Ocultar Botones Menu Izquierdo",
            toggleTitleHidden: "Mostrar Botones Menu Izquierdo",
            togglePosition: { left: "10px", bottom: "0px" }
        },
        menuRight: {
            section: 'menu',
            urlContains: '/LTConsultores1.3/',
            botones: [
                { texto: "Correlativos", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Maestras/Correlativos", hover: "Consulta de Correlativos", id: "menu_right_btn1", style: { right: "10px", top: "200px", width: "110px" } },
                { texto: "Doc. Compras", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Transac/Compras", hover: "Documentos de las Compras", id: "menu_right_btn2", style: { right: "10px", top: "230px", width: "110px" } },
                { texto: "Doc. Ventas", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Transac/Ventas", hover: "Documentos de las Ventas", id: "menu_right_btn3", style: { right: "10px", top: "260px", width: "110px" } },
                { texto: "Doc. Honorarios", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Honorarios/Honorarios", hover: "Documentos de los Honorarios", id: "menu_right_btn4", style: { right: "10px", top: "290px", width: "110px", fontSize: "13px" } },
                { texto: "Libro Compras", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptLibroCompras", hover: "Libro de Compras", id: "menu_right_btn5", style: { right: "10px", top: "320px", width: "110px" } },
                { texto: "Libro Ventas", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Informes/RptLibroVentas", hover: "Libros de Ventas", id: "menu_right_btn6", style: { right: "10px", top: "350px", width: "110px" } },
                { texto: "Libro Honorarios", url: "http://191.234.162.51/LTConsultores1.3/Pages/Contab/Informes/Honorarios/RptLibroHonorarios", hover: "Libros de Honorarios :)", id: "menu_right_btn7", style: { right: "10px", top: "380px", width: "110px" } },
                { texto: "Cont. Compras", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Procesos/ProContabCompras", hover: "Contabilización de las Compras", id: "menu_right_btn8", style: { right: "10px", top: "410px", width: "110px", fontSize: "12.9px" } },
                { texto: "Cont. Ventas", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Procesos/ProContabVentas", hover: "Contabilización de las Ventas", id: "menu_right_btn9", style: { right: "10px", top: "440px", width: "110px" } },
                { texto: "Cont. Honorarios", url: "http://191.234.162.51/LTConsultores1.3/pages/Contab/Procesos/Honorarios/ProContabHonor", hover: "Contabilización de Honorarios", id: "menu_right_btn10", style: { right: "10px", top: "470px", width: "110px"} }
            ],
            toggleKey: "estadoBotonesMenuRight",
            toggleTextVisible: ">>",
            toggleTextHidden: "<<",
            toggleTitleVisible: "Ocultar Botones Menu Derecho",
            toggleTitleHidden: "Mostrar Botones Menu Derecho",
            togglePosition: { right: "10px", bottom: "0px" }
        },
        remuneraciones: {
            section: 'remuneraciones',
            urlContains: '/GestionErp1.3/',
            botones: [
                { texto: "Mvto. Mensuales", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Movimientos/MovimMes", hover: "Movimientos Mensuales", id: "rem_btn1", style: { left: "10px", top: "200px", width: "120px" } },
                { texto: "Ficha Trabajador", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Maestras/Trabajadores", hover: "Ficha del Trabajador", id: "rem_btn2", style: { left: "10px", top: "230px", width: "120px" } },
                { texto: "Liq. Individual", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/LiquidacionSueldo", hover: "Liquidación Individual", id: "rem_btn3", style: { left: "10px", top: "260px", width: "120px" } },
                { texto: "Liq. General", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/LiquidacionSueldoGeneral", hover: "Liquidación General", id: "rem_btn4", style: { left: "10px", top: "290px", width: "120px" } },
                { texto: "Liq. Ind Períodos", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/LiquidacionSueldoPeriodo", hover: "Liquidación Individual por Períodos", id: "rem_btn5", style: { left: "10px", top: "320px", width: "120px" } },
                { texto: "Libro Rem", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/LibroRemun", hover: "Libro de Remuneraciones", id: "rem_btn6", style: { left: "10px", top: "350px", width: "120px" } },
                { texto: "Previred", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/GenArcPagImpPrevired", hover: "Previred", id: "rem_btn7", style: { left: "10px", top: "380px", width: "120px" } },
                { texto: "Nueva Pestaña", url: "http://191.234.162.51/GestionErp1.3/Main", hover: "Agrega una Nueva Pestaña (Menu Principal)", id: "rem_btn8", style: { left: "10px", top: "410px", width: "120px" } },
                { texto: "Volver al Menu", url: "http://191.234.162.51/GestionErp1.3/Main", hover: "Ir al Menu Principal", id: "rem_btn9", style: { left: "10px", top: "440px", width: "120px" } }
            ],
            toggleKey: "estadoBotonesRemuneraciones",
            toggleTextVisible: "<<",
            toggleTextHidden: ">>",
            toggleTitleVisible: "Ocultar Botones Remuneraciones Izquierdo",
            toggleTitleHidden: "Mostrar Botones Remuneraciones Izquierdo",
            togglePosition: { left: "10px", bottom: "0px" }
        },
        remuneracionesRight: {
            section: 'remuneraciones',
            urlContains: '/GestionErp1.3/',
            botones: [
                { texto: "Par. Generales", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Maestras/ParametrosGenerales", hover: "Parámetros Generales", id: "rem_right_btn1", style: { right: "10px", top: "200px", width: "110px" } },
                { texto: "Hab. y Dcts.", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Maestras/HaberDescu", hover: "Haberes y Descuentos", id: "rem_right_btn2", style: { right: "10px", top: "230px", width: "110px" } },
                { texto: "Liq. General", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Informes/Paginas/LiquidacionSueldoGeneral", hover: "Liquidación General", id: "rem_right_btn3", style: { right: "10px", top: "260px", width: "110px" } },
                { texto: "Cont. Remun.", url: "http://191.234.162.51/GestionErp1.3/pages/Remune/Procesos/ContabRemun", hover: "Contabilización de Remuneraciones", id: "rem_right_btn4", style: { right: "10px", top: "290px", width: "110px" } },
            ],
            toggleKey: "estadoBotonesRemuneracionesRight",
            toggleTextVisible: ">>",
            toggleTextHidden: "<<",
            toggleTitleVisible: "Ocultar Botones Remuneraciones Derecho",
            toggleTitleHidden: "Mostrar Botones Remuneraciones Derecho",
            togglePosition: { right: "10px", bottom: "0px" }
        }
    };

    // Estilos comunes para los botones
    // ESTILOS COMUNES PARA LOS BOTONES
    // Estilos comunes para los botones
    const estilosComunes = `
  /* Animación de resplandor en el borde */
  @keyframes borderGlow {
    0% {
      box-shadow: 0 0 5px ${colores.principal};
    }
    50% {
      box-shadow: 0 0 15px ${colores.bordeHover};
    }
    100% {
      box-shadow: 0 0 5px ${colores.principal};
    }
  }

  .boton-personalizado {
      position: fixed;
      z-index: 1000;
      font-family: Calibri, sans-serif;
      font-size: 13px;
      background-color: #2E526D;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      transition: transform 0.1s, left 0.5s, right 0.5s;
      outline: none;
      border-radius: 4px;
      min-width: 100px;
  }

  .boton-personalizado:hover {
      background-color: ${colores.hover};
      border-color: ${colores.hover};
      transform: scale(1.1);
      z-index: 1001;
      animation: borderGlow 2s infinite;
  }

  .no-transition {
      transition: none !important;
  }
`;

    // Función para crear botones dentro del Shadow DOM
    function crearBoton({ texto, url, hover, id, style, newTab }, shadowRoot) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.classList.add("boton-personalizado");

        // Aplicar estilos inline necesarios para posición
        Object.assign(btn.style, style);
        if (style.fontSize) {
            btn.style.fontSize = style.fontSize;
        }
        btn.textContent = texto;

        // Almacenar posiciones originales para toggle
        if (style.left) {
            btn.dataset.originalLeft = style.left;
        }
        if (style.right) {
            btn.dataset.originalRight = style.right;
        }

        btn.onclick = function(event) {
            if (newTab) {
                window.open(url, '_blank');
            } else {
                if (event.ctrlKey) {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            }
        };

        btn.title = hover;

        shadowRoot.appendChild(btn);
        return btn;
    }

    // Función para crear contenedor y botones dentro del Shadow DOM
    async function crearConjunto(config) {
        // Crear contenedor para este conjunto
        const contenedor = document.createElement("div");
        contenedor.className = "contenedorBotones";

        // Crear Shadow Root
        const shadowRoot = contenedor.attachShadow({ mode: 'open' });

        // Añadir estilos al Shadow DOM
        const style = document.createElement('style');
        style.textContent = estilosComunes;
        shadowRoot.appendChild(style);

        // Crear y agregar cada botón
        config.botones.forEach(botonConfig => {
            crearBoton(botonConfig, shadowRoot);
        });

        // Crear botón de toggle
        const toggleButton = document.createElement("button");
        toggleButton.textContent = config.toggleTextVisible;
        toggleButton.title = config.toggleTitleVisible;
        toggleButton.classList.add("boton-personalizado");
        Object.assign(toggleButton.style, config.togglePosition, { minWidth: "auto" });
        shadowRoot.appendChild(toggleButton);

        // Función para actualizar el estado de visibilidad
        async function actualizarEstado(estado, aplicarAnimacion) {
            const botones = shadowRoot.querySelectorAll('button:not(:last-child)');
            if (!aplicarAnimacion) {
                // Deshabilitar transiciones temporalmente
                botones.forEach(btn => btn.classList.add('no-transition'));
            }

            botones.forEach((btn, index) => {
                if (aplicarAnimacion) {
                    setTimeout(() => {
                        if (btn.dataset.originalLeft) {
                            btn.style.left = estado === "oculto" ? "-150px" : btn.dataset.originalLeft;
                        }
                        if (btn.dataset.originalRight) {
                            btn.style.right = estado === "oculto" ? "-150px" : btn.dataset.originalRight;
                        }
                    }, index * 100);
                } else {
                    if (btn.dataset.originalLeft) {
                        btn.style.left = estado === "oculto" ? "-150px" : btn.dataset.originalLeft;
                    }
                    if (btn.dataset.originalRight) {
                        btn.style.right = estado === "oculto" ? "-150px" : btn.dataset.originalRight;
                    }
                }
            });

            if (!aplicarAnimacion) {
                // Forzar reflow para aplicar los cambios sin transición
                botones.forEach(btn => void btn.offsetWidth);
                // Remover clase 'no-transition'
                botones.forEach(btn => btn.classList.remove('no-transition'));
            }

            // Guardar estado usando Tampermonkey
            await GM.setValue(config.toggleKey, estado);

            // Actualizar botón de toggle
            toggleButton.textContent = estado === "oculto" ? config.toggleTextHidden : config.toggleTextVisible;
            toggleButton.title = estado === "oculto" ? config.toggleTitleHidden : config.toggleTitleVisible;
        }

        // Evento para toggle
        toggleButton.onclick = async function() {
            this.disabled = true;
            const estadoActual = (await GM.getValue(config.toggleKey, "visible")) === "oculto" ? "visible" : "oculto";
            await actualizarEstado(estadoActual, true);
            setTimeout(() => {
                this.disabled = false;
            }, 3000);
        };

        // Inicializar el estado al cargar
        const estadoInicial = await GM.getValue(config.toggleKey, "visible");
        await actualizarEstado(estadoInicial, false);

        // Añadir el contenedor al body
        document.body.appendChild(contenedor);
    }

    // Detectar y crear los conjuntos de botones según la URL actual
    const currentURL = window.location.href;

    for (const configKey in configuraciones) {
        const config = configuraciones[configKey];
        if (currentURL.includes(config.urlContains)) {
            crearConjunto(config);
        }
    }

    // Listener único para la tecla ESC
    let puedePresionar = true;

    window.addEventListener('keydown', function(event) {
        if ((event.key === 'Escape' || event.keyCode === 27) && puedePresionar) {
            event.preventDefault();
            event.stopPropagation();
            puedePresionar = false;

            const currentURL = window.location.href;
            let targetURL = "";

            if (currentURL.includes('/LTConsultores1.3/')) {
                targetURL = "http://191.234.162.51/LTConsultores1.3/Main";
            } else if (currentURL.includes('/GestionErp1.3/')) {
                targetURL = "http://191.234.162.51/GestionErp1.3/Main";
            }

            // Verificar si ya estamos en la página de destino
            if (targetURL && currentURL !== targetURL) {
                window.location.href = targetURL;
            }

            setTimeout(function() {
                puedePresionar = true;
            }, 3000);
        }
    }, true);

})();

//CORRECIÓN DE ERRORES

(function() {
    'use strict';
    // Verifica si la URL es la incorrecta
    if (window.location.href === "http://191.234.162.51/ltconsultores1.3/Main") {
        // Redirige a la URL correcta
        window.location.href = "http://191.234.162.51/LTConsultores1.3/Main";
    }
})();

(function() {
    'use strict';

    // Función para prevenir Enter en cualquier input de tipo texto, radio o checkbox
    function preventEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    // Delegación de eventos: escuchamos los eventos keydown en todo el documento
    document.addEventListener('keydown', function(event) {
        // Solo prevenimos el Enter en los inputs de tipo "text", "radio" y "checkbox"
        if (event.target.matches('input[type="text"], input[type="radio"], input[type="checkbox"]')) {
            preventEnter(event);
        }
    });
})();

(function() {
    'use strict';

    // Sobrescribir el comportamiento de error del PageRequestManager
    if (typeof Sys !== 'undefined' && Sys.WebForms.PageRequestManager) {
        const originalEndRequest = Sys.WebForms.PageRequestManager.getInstance()._endRequest;

        Sys.WebForms.PageRequestManager.getInstance()._endRequest = function(sender, args) {
            // Verificar si ocurrió un error
            if (args.get_error() && args.get_error().name === "Sys.WebForms.PageRequestManagerTimeoutException") {
                args.set_errorHandled(true); // Evita mostrar el error en la UI
                console.warn("Se detectó un timeout en la solicitud al servidor. Reintentando...");

                // Reintentar la solicitud automáticamente
                setTimeout(() => {
                    Sys.WebForms.PageRequestManager.getInstance()._doPostBack();
                }, 3000); // Espera 3 segundos antes de reintentar
            } else {
                // Llamar al método original
                originalEndRequest.call(this, sender, args);
            }
        };
    }
})();