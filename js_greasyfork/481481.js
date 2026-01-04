// ==UserScript==
// @name         Mejoras Visuales a JkAnime.net
// @namespace    https://greasyfork.org/es/scripts/481481
// @version      1/2/2025 07:00
// @description  Fuerza el modo oscuro, personaliza el menú y ajusta estilos visuales a JkAnime.
// @author       tivp
// @license      Unlicenced
// @match        *://jkanime.net/*
// @match        *://jkanime.bz/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://jkanime.net/&size=48
// @icon64       https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://jkanime.net/&size=64
// @downloadURL https://update.greasyfork.org/scripts/481481/Mejoras%20Visuales%20a%20JkAnimenet.user.js
// @updateURL https://update.greasyfork.org/scripts/481481/Mejoras%20Visuales%20a%20JkAnimenet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para leer cookies
    const obtenerCookie = (nombre) => document.cookie.match(new RegExp(`(^| )${nombre}=([^;]+)`))?.[2] || null;

    // Función para actualizar o crear una cookie con duración
    const actualizarCookie = (nombre, valor, duracionMinutos) => {
        const fecha = new Date();
        fecha.setMinutes(fecha.getMinutes() + duracionMinutos); // Establecer la fecha de expiración
        document.cookie = `${nombre}=${valor}; path=/; expires=${fecha.toUTCString()}`;
    };

    // Función para activar el modo oscuro si no está habilitado
    const activarModoOscuro = () => {
        if (obtenerCookie("darkmode") !== "true") {
            document.cookie = "darkmode=true; path=/;";
        }
    };

    // Función para personalizar el menú
    const personalizarMenu = () => {
        // Cambiar el enlace de "Noticias"
        document.querySelectorAll('.active.hentai.tip').forEach(btn => {
            btn.innerHTML = '<a href="https://www.anmtvla.com/search/label/doblaje%20latino" target="_blank">Noticias</a>';
        });

        // Eliminar elementos sociales
        document.querySelectorAll('.active.social').forEach(btn => btn.innerHTML = '');

        // Modificar el botón de inicio de sesión y añadir el estilo si no es jkanime.bz
        const menuUsuario = document.querySelector('.usr-menu.entrar');
        if (menuUsuario && window.location.hostname !== "jkanime.bz") {
            // Añadir el estilo al atributo 'style' existente
            menuUsuario.style.right = '-90px';
        }

        // Cambiar el icono de "Mirando"
        const btnMirando = document.querySelectorAll('.btn.btn-light.btn-sm.ml-2');
        if (btnMirando.length > 1) {
            btnMirando[1].innerHTML = '<i class="fa fa-eye"></i>';
        }

        // Ajustar el estilo del campo de búsqueda
        const inputBuscar = document.querySelector('.buscanime');
        if (inputBuscar) inputBuscar.style.paddingTop = '13px';

        // Ajustar padding de los enlaces del menú
        document.querySelectorAll('.header__menu ul li a').forEach(link => {
            link.style.padding = '13px 19px';
        });

        // Alinear el menú a la izquierda
        const headerMenu = document.querySelector('.header__menu');
        if (headerMenu) headerMenu.style.textAlign = 'left';
    };

    // Función para evitar que el usuario desmarque el modo oscuro
    const evitarDesmarcarModoOscuro = () => {
        const switchBtn = document.querySelector('.switchBtn');
        if (switchBtn) {
            switchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                switchBtn.checked = true;
            });
        }
    };

    // Función para centrar el fondo de los servidores
    const centrarFondoServidores = () => {
        const bgServers = document.querySelector('.bg-servers');
        if (bgServers) {
            bgServers.style.textAlign = 'center';
        }
    };

    // Función para aplicar todas las mejoras
    const aplicarMejoras = () => {
        console.log("Página cargada completamente.");
        if (window.location.hostname === "jkanime.net" || window.location.hostname === "jkanime.bz") {
            activarModoOscuro();
            evitarDesmarcarModoOscuro();
        }

        personalizarMenu();
        centrarFondoServidores();
    };

    // Función para verificar si las mejoras ya se aplicaron
    const verificarAplicacionMejoras = () => {
        // Aplicar mejoras
        aplicarMejoras();

        // Marcar que las mejoras se aplicaron y hacer que la cookie dure 1 minuto
        if (obtenerCookie("mejoras_aplicadas") !== "true") {
            actualizarCookie("mejoras_aplicadas", "true", 1);

            // Recargar la página
            window.location.reload();
        }
    };

    // Ejecutar las mejoras al cargar la página
    window.addEventListener('load', verificarAplicacionMejoras);
})();