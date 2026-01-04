// ==UserScript==
// @name         Botones SII Mejorado
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Agrega botones personalizados a las páginas del SII con animaciones y estilos optimizados.
// @license      MIT
// @match        *.sii.cl/*
// @exclude      https://www4.sii.cl/rfiInternet/formCompacto?folio=*
// @exclude      https://www4.sii.cl/rfiInternet/?opcionPagina=formCompleto&folio=*
// @exclude      https://www4.sii.cl/rfiInternet/formSolemne?folio=*
// @exclude      https://zeusr.sii.cl//AUT2000/InicioAutenticacion/IngresoRutClave.html?https://misiir.sii.cl/cgi_misii/siihome.cgi*
// @exclude      https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html?*
// @exclude      https://www1.sii.cl/cgi-bin/Portal001/mipeShowPdf.cgi?CODIGO=*
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @namespace https://openuserjs.org/users/JAIRO341
// @downloadURL https://update.greasyfork.org/scripts/489815/Botones%20SII%20Mejorado.user.js
// @updateURL https://update.greasyfork.org/scripts/489815/Botones%20SII%20Mejorado.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  // Definir colores principales y de hover
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

  // CONFIGURACIÓN DE BOTONES
  const configuraciones = {
    siiButtons: {
      section: 'sii',
      botones: [
        {
          texto: 'Ingresar SII',
          url: 'https://zeusr.sii.cl/AUT2000/InicioAutenticacion/IngresoRutClave.html?https://misiir.sii.cl/cgi_misii/siihome.cgi',
          hover: 'Ingresa Nueva Empresa en otra Ventana',
          id: 'sii_btn1',
          style: { right: '10px', bottom: '260px', width: '145px' },
          newTab: true,
        },
        {
          texto: 'Declaración Jurada',
          url: 'https://www4.sii.cl/perfilamientodjui/#/declaracionJuradaRenta',
          hover: 'Declaraciones Juradas de Renta',
          id: 'sii_btn2',
          style: { right: '10px', bottom: '230px', width: '145px' },
        },
        {
          texto: 'Ver Declaración Renta',
          url: 'https://www4.sii.cl/consultaestadof22ui/',
          hover: 'Consulta de Estado de Declaración de Renta',
          id: 'sii_btn3',
          style: { right: '10px', bottom: '200px', width: '145px' },
        },
        {
          texto: 'IVA',
          url: 'https://www4.sii.cl/sifmConsultaInternet/index.html?dest=cifxx&form=29',
          hover: 'Consultar Declaración IVA (F29)',
          id: 'sii_btn4',
          style: { right: '10px', bottom: '170px', width: '145px' },
        },
        {
          texto: '<<',
          url: 'https://www4.sii.cl/propuestaf29ui/internet/',
          hover: 'Declaración del IVA (F29)',
          id: 'sii_btn5',
          style: { right: '150px', bottom: '170px', width: '35px', minWidth: '35px' },
          className: 'boton-estrecho',
        },
        {
          texto: 'B. Honorarios',
          url: 'https://loa.sii.cl/cgi_IMT/TMBCOC_MenuConsultasContribRec.cgi?dummy=1461943244650',
          hover: 'Boleta de Honorarios Recibidas',
          id: 'sii_btn6',
          style: { right: '10px', bottom: '140px', width: '145px' },
        },
        {
          texto: '<<',
          url: 'https://loa.sii.cl/cgi_IMT/TMBCOC_MenuConsultasContrib.cgi?dummy=1461943167534',
          hover: 'Boleta de Honorarios Emitidas',
          id: 'sii_btn7',
          style: { right: '150px', bottom: '140px', width: '35px', minWidth: '35px' },
          className: 'boton-estrecho',
        },
        {
          texto: 'B. Honorarios Terceros',
          url: 'https://zeus.sii.cl/cvc_cgi/bte/bte_indiv_cons?1',
          hover: 'Boletas de Honorarios Terceros Emitidas',
          id: 'sii_btn8',
          style: { right: '10px', bottom: '110px', width: '145px' },
        },
        {
          texto: '<<',
          url: 'https://zeus.sii.cl/cvc_cgi/bte/bte_indiv_cons?2',
          hover: 'Boleta de Honorarios Terceros Recibidas',
          id: 'sii_btn9',
          style: { right: '150px', bottom: '110px', width: '35px', minWidth: '35px' },
          className: 'boton-estrecho',
        },
        {
          texto: 'R. Compras y Ventas',
          url: 'https://www4.sii.cl/consdcvinternetui/#/index',
          hover: 'Registro de Compras y Ventas',
          id: 'sii_btn10',
          style: { right: '10px', bottom: '80px', width: '145px' },
        },
        {
          texto: '<<',
          url: 'https://www1.sii.cl/cgi-bin/Portal001/mipeLaunchPage.cgi?OPCION=1&TIPO=4',
          hover: 'Ver Facturas de Compras',
          id: 'sii_btn11',
          style: { right: '150px', bottom: '80px', width: '35px', minWidth: '35px' },
          className: 'boton-estrecho',
        },
      ],
      toggleKey: 'estadoBotonesSII',
      toggleTextVisible: '>>',
      toggleTextHidden: '<<',
      toggleTitleVisible: 'Ocultar Botones SII',
      toggleTitleHidden: 'Mostrar Botones SII',
      togglePosition: { right: '10px', bottom: '0px' },
    },
  };

  // ESTILOS COMUNES PARA LOS BOTONES
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
    background-color: ${colores.principal};
    color: white;
    border: 2px solid ${colores.principal}; /* Igual al background-color */
    padding: 10px;
    cursor: pointer;
    transition: transform 0.1s, right 0.5s, box-shadow 0.3s;
    outline: none;
    border-radius: 4px;
    min-width: 100px;
    box-sizing: border-box;
    user-select: none;
  }

  .boton-personalizado:hover {
    background-color: ${colores.hover};
    border-color: ${colores.hover}; /* Igual al background-color */
    transform: scale(1.1);
    z-index: 1001;
    animation: borderGlow 2s infinite;
  }

  .boton-estrecho {
    min-width: 35px !important;
    width: 35px !important;
    padding: 10px 5px !important;
  }

  .no-transition {
    transition: none !important;
  }
`;

// FUNCIÓN PARA CREAR UN BOTÓN
function crearBoton({ texto, url, hover, id, style, newTab, className }, shadowRoot, estadoInicial) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.classList.add('boton-personalizado');
  if (className) btn.classList.add(className);

  // Almacenar posiciones originales para animaciones
  ['left', 'right', 'top', 'bottom'].forEach((pos) => {
    if (style[pos]) btn.dataset[`original${pos.charAt(0).toUpperCase() + pos.slice(1)}`] = style[pos];
  });

  // Establecer estilos iniciales
  Object.assign(btn.style, style);

  // Establecer posición inicial basada en el estado almacenado
  if (estadoInicial === 'oculto') {
    btn.style.right = '-200px';
  }

  btn.textContent = texto;
  btn.title = hover;

  btn.addEventListener('click', (event) => {
    if (newTab || event.ctrlKey) {
      window.open(url, '_self');
    } else {
      window.location.href = url;
    }
  });

  shadowRoot.appendChild(btn);
  return btn;
}

// FUNCIÓN PARA CREAR UN CONJUNTO DE BOTONES
async function crearConjunto(config) {
  const contenedor = document.createElement('div');
  contenedor.className = 'contenedorBotones';
  const shadowRoot = contenedor.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = estilosComunes;
  shadowRoot.appendChild(style);

  // Obtener el estado inicial antes de crear los botones
  const estadoInicial = await GM.getValue(config.toggleKey, 'visible');

  const botones = config.botones.map((botonConfig) => crearBoton(botonConfig, shadowRoot, estadoInicial));

  const toggleButton = document.createElement('button');
  toggleButton.textContent = estadoInicial === 'oculto' ? config.toggleTextHidden : config.toggleTextVisible;
  toggleButton.title = estadoInicial === 'oculto' ? config.toggleTitleHidden : config.toggleTitleVisible;
  toggleButton.classList.add('boton-personalizado');
  Object.assign(toggleButton.style, config.togglePosition, { minWidth: 'auto' });
  shadowRoot.appendChild(toggleButton);

  async function actualizarEstado(estado, aplicarAnimacion) {
    const botonesArray = [...botones];
    if (!aplicarAnimacion) {
      botonesArray.forEach((btn) => btn.classList.add('no-transition'));
    }
    botonesArray.forEach((btn, index) => {
      const delay = aplicarAnimacion ? index * 100 : 0;
      setTimeout(() => {
        if (estado === 'oculto') {
          btn.style.right = '-200px';
        } else {
          btn.style.right = btn.dataset.originalRight || btn.style.right; // Cambiado a originalRight
        }
      }, delay);
    });
    if (!aplicarAnimacion) {
      botonesArray.forEach((btn) => btn.offsetWidth); // Forzar reflujo
      botonesArray.forEach((btn) => btn.classList.remove('no-transition'));
    }
    await GM.setValue(config.toggleKey, estado);
    toggleButton.textContent = estado === 'oculto' ? config.toggleTextHidden : config.toggleTextVisible;
    toggleButton.title = estado === 'oculto' ? config.toggleTitleHidden : config.toggleTitleVisible;
  }

  toggleButton.addEventListener('click', async () => {
    toggleButton.disabled = true;
    const estadoActual = (await GM.getValue(config.toggleKey, 'visible')) === 'oculto' ? 'visible' : 'oculto';
    await actualizarEstado(estadoActual, true);
    setTimeout(() => {
      toggleButton.disabled = false;
    }, config.botones.length * 100 + 500);
  });

  // Aplicar el estado inicial sin animación
  await actualizarEstado(estadoInicial, false);

  document.body.appendChild(contenedor);
}

// CREAR LOS CONJUNTOS DE BOTONES
for (const configKey in configuraciones) {
  crearConjunto(configuraciones[configKey]);
}

// LISTENER PARA LA TECLA ESC
let puedePresionar = true;
window.addEventListener(
  'keydown',
  (event) => {
    if ((event.key === 'Escape' || event.keyCode === 27) && puedePresionar) { // Cambiado event.keyboardEvent a event.keyCode
      event.preventDefault();
      event.stopPropagation();
      puedePresionar = false;
      const targetURL = 'https://misiir.sii.cl/cgi_misii/siihome.cgi';
      if (window.location.href !== targetURL) {
        window.location.href = targetURL;
      }
      setTimeout(() => {
        puedePresionar = true;
      }, 3000);
    }
  },
  true
);

(() => {
  const elemento = document.getElementById('myMainCorreoVigente');

  // Verifica si el elemento existe
  if (elemento) {
    // Inyectar estilos para la animación de bordes
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes borderPulse {
        0% { border-color: black; }
        50% { border-color: red; }
        100% { border-color: black; }
      }
      .animar-borde {
        animation: borderPulse 1s infinite;
      }
    `;
    document.head.appendChild(style);

      // Función para crear y configurar el botón de cerrar
      const crearBotonCerrar = () => {
          // Evita crear múltiples botones
          if (document.getElementById('botonCerrar')) return;

          const botonCerrar = document.createElement('button');
          botonCerrar.id = 'botonCerrar'; // Asigna un ID para futuras referencias
          botonCerrar.textContent = '❌';
          Object.assign(botonCerrar.style, {
              position: 'fixed',
              top: '10px',
              right: '10px',
              zIndex: '9000',
              fontFamily: 'Calibri, sans-serif',
              fontSize: '13px',
              borderRadius: '4px',
              backgroundColor: colores.botonCerrar.fondo,
              textAlign: 'center',
              color: 'white',
              border: `2px solid ${colores.botonCerrar.borde}`,
              padding: '10px',
              cursor: 'pointer',
              width: '50px',
              transition: 'border-color 0.3s, background-color 0.1s, transform 0.1s, box-shadow 0.3s',
          });

          // Evento para cerrar el modal
          botonCerrar.addEventListener('click', () => {
              elemento.remove();
              botonCerrar.style.display = 'none';
          });

          // Eventos para efectos de hover
          botonCerrar.addEventListener('mouseover', () => {
              botonCerrar.title = 'Cerrar Mensaje Emergente :)';
              botonCerrar.style.backgroundColor = colores.botonCerrar.fondoHover;
              botonCerrar.style.transform = 'scale(1.1)';
              botonCerrar.style.zIndex = '9001';
              botonCerrar.style.borderColor = colores.botonCerrar.bordeHover;
              botonCerrar.classList.add('animar-borde'); // Añade la clase de animación
          });

          botonCerrar.addEventListener('mouseout', () => {
              botonCerrar.style.backgroundColor = colores.botonCerrar.fondo;
              botonCerrar.style.transform = 'scale(1)';
              botonCerrar.style.zIndex = '9000';
              botonCerrar.style.borderColor = colores.botonCerrar.borde;
        botonCerrar.classList.remove('animar-borde'); // Remueve la clase de animación
          });

          document.body.appendChild(botonCerrar);
      };

      // Crear un observador para los cambios de estilo del elemento
      const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
              const displayStyle = window.getComputedStyle(elemento).display;
              // Si el modal está visible (display: block)
              if (displayStyle === 'block') {
                  crearBotonCerrar();
              }
        }
      });
      });

      // Configuración del observador: solo observar cambios en el atributo 'style'
      observer.observe(elemento, { attributes: true });

      // Verificar inmediatamente si el elemento ya está visible
      if (window.getComputedStyle(elemento).display === 'block') {
          crearBotonCerrar();
      }
  }

})();
})();