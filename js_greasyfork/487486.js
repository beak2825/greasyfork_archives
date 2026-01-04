// ==UserScript==
// @name         Decepticon
// @namespace    Decepticon
// @version      0.1.2
// @description  Es un bot malvado
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://i.imgur.com/8njJj1U.png
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/487486/Decepticon.user.js
// @updateURL https://update.greasyfork.org/scripts/487486/Decepticon.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const parametroP = urlParams.get('p');;
    const userAgent = navigator.userAgent;

    var hashGlobal;
    var townId;
    var horaSolicitud = 0;
    // Obtener la URL de la ventana actual
    const currentURL = window.location.href;

    // Encuentra el substring que coincide con dos letras seguidas de números después de // y antes de un punto
    const match = currentURL.match(/\/\/([a-z]{2}\d+)\./i);


    const serverId = match[1]; // El primer grupo capturado contendrá el ID del servidor


    function cambiarIcono() {
        // Obtener el elemento de icono
        var icono = document.getElementById('decepticon_icon');
        // Cambiar la fuente de la imagen
        icono.src = 'https://i.imgur.com/EMv1FOy.png';
    }


    function crearBotonLog(){
        var menuContainer = document.querySelector('.nui_main_menu .content > ul');

        // Verifica si el contenedor existe
        if (menuContainer) {
            // Define el HTML para la nueva entrada de menú
            var nuevaEntradaHTML = `
                <li class="decepticon_log main_menu_item last">
                    <span class="content_wrapper">
                        <span class="button_wrapper">
                            <span class="button">
                                <span class="icon" style="margin-left: -2px;">
                                <img src="https://i.imgur.com/mWhMwyA.png" alt="Icono" id="decepticon_icon">
                                </span>
                            </span>
                        </span>
                        <span class="name_wrapper">
                            <span class="name">Decepticon</span>
                        </span>
                    </span>
                </li>
            `;

            // Inserta la nueva entrada de menú en el contenedor
            for (let i = 0; i < menuContainer.children.length; i++) {
                let child = menuContainer.children[i];
                if (child.classList.contains("last")) {
                    child.classList.remove("last");
                }
                if (child.classList.contains("gd-team-ops-cp")){
                    var wrapper = child.children[0].children[0].children[0];
                    wrapper.style ="right: -12px; top: 0 !important;"

                }

            }
            menuContainer.insertAdjacentHTML('beforeend', nuevaEntradaHTML);
            var botonDecepticon = menuContainer.querySelector('.decepticon_log');
            botonDecepticon.addEventListener('click', function() {
                crearVentanaLog();
            });
        }
    }

    function crearVentanaLog() {
        // Buscar todos los elementos que podrían contener el título
        var titulos = document.querySelectorAll('.ui-dialog-title');
        var existeVentana = false;

        if (!titulos) {
            existeVentana = false;
        } else {
            for (var i = 0; i < titulos.length; i++) {
                if (titulos[i].textContent.trim() === "Log Decepticon") {
                    existeVentana = true;
                    break;
                }
            }
        }

        if (!existeVentana) {
            var ventana = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "Log Decepticon", { width: 250, height: 125 });

            titulos = document.querySelectorAll('.ui-dialog-title');
            var contenedorDelTituloLog;

            for (i = 0; i < titulos.length; i++) {
                if (titulos[i].textContent.trim() === "Log Decepticon") {
                    contenedorDelTituloLog = titulos[i].closest('.ui-dialog');
                    console.log(contenedorDelTituloLog)
                    break;
                }
            }

            var contenedorLog = contenedorDelTituloLog.querySelector(".gpwindow_content");

            if (horaSolicitud == 0) {
                horaSolicitud = 'Inactivo';
            }

            if (horaSolicitud != 0) {
                var divHoraSolicitud = document.createElement('div');
                divHoraSolicitud.innerHTML = `<p>${horaSolicitud}</p>`;
                contenedorLog.appendChild(divHoraSolicitud);

                // Crear un botón
                var boton = document.createElement('button');
                boton.textContent = 'Recolectar'; // Texto del botón
                boton.classList.add('mi-clase'); // Agregar clase si es necesario

                // Agregar el botón al contenedor
                contenedorLog.appendChild(boton);

                // Agregar un event listener al botón si deseas manejar eventos
                boton.addEventListener("click", async function() {
                    cambiarIcono();
                    contenedorDelTituloLog.children[0].children[1].click();
                    var responseData = await makeRequest();
                    var toidArray = construirLista(responseData);
                    claimLoadsMultiple(toidArray);


                });
            }
        }
    }


    function obtenerHash() {
        // Interceptar las solicitudes XMLHttpRequest para capturar el valor del hash
        var open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function() {
            // Capturar el método y la URL de la solicitud
            var method = arguments[0];
            var url = arguments[1];

            // Agregar un listener para cuando la solicitud sea enviada
            this.addEventListener('load', function() {
                // Si es una solicitud POST y la URL contiene el parámetro 'h', capturar y almacenar el valor del hash
                if (method.toUpperCase() === 'POST' && url.includes('h=')) {
                    var params = new URLSearchParams(url.split('?')[1]);
                    hashGlobal = params.get('h');
                    townId = params.get('town_id');
                }
            });

            // Llamar a la función open original para iniciar la solicitud
            return open.apply(this, arguments);
        };
    }

//     async function crearBoton(arrayFarms, townData) {

//         var boton_dio = document.getElementById('dio_BTN_HK');

//         if (boton_dio) {
//             boton_dio.style.display = 'none';
//         }

//         var botonera = document.querySelector('div.tb_activities');
//         var derecha = botonera.querySelector('div.right')

//         var boton = document.createElement('button');
//         boton.innerHTML = '<img src="https://dio-david1327.github.io/img/dio/btn/hotkeys.png" style="float:left; border-width: 0px">';
//         boton.style.background = "none";
//         boton.style.border = "none";
//         derecha.appendChild(boton);
//         var count = 0;
//         boton.addEventListener("click", async function() {

//             var responseData = await makeRequest();
//             var toidArray = construirLista(responseData);
//             claimLoadsMultiple(toidArray);

//         });
//     }


    async function makeRequest() {
        try {
            const response = await fetch("https://" + serverId + ".grepolis.com/game/farm_town_overviews?town_id=" + townId + "&action=index&h=" + hashGlobal + "json=%7B%22town_id%22%3A%2C%22nl_init%22%3Atrue%7D&_=", {
                credentials: "include",
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "text/plain, */*; q=0.01",
                    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                referrer: "https://" + serverId + ".grepolis.com/game/index?login=1&p=" + parametroP + "&ts=",
                method: "GET",
                mode: "cors"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error:', error);
        }
    }


    function construirLista(response) {
        var towns = response.json.towns;
        var toidArray = [];

        for (var i = 0; i < towns.length; i++) {
            var town = towns[i];
            var toid = town.id;
            var resources = town.resources;
            var wood = resources.wood;
            var stone = resources.stone;
            var iron = resources.iron;
            var storage_volume = town.storage_volume;

            if (wood < storage_volume || stone < storage_volume || iron < storage_volume) {
                // Si los recursos no están llenos, agregar la ciudad y sus datos a los arrays
                toidArray.push(toid);
            }
        }

        return toidArray;

    }


    async function claimLoadsMultiple(toidArray) {
        try {
            const response = await fetch("https://" + serverId + ".grepolis.com/game/farm_town_overviews?town_id=" + townId + "&action=claim_loads_multiple&h=" + hashGlobal, {
                method: "POST",
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "text/plain, */*; q=0.01",
                    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Origin": "https://" + serverId + ".grepolis.com",
                    "Referer": "https://" + serverId + ".grepolis.com/game/index?login=1&p=" + parametroP + "&ts=",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                body: "json=%7B%22towns%22%3A%5B" + toidArray + "%5D%2C%22time_option_base%22%3A300%2C%22time_option_booty%22%3A600%2C%22claim_factor%22%3A%22normal%22%2C%22town_id%22%3A" + townId + "%2C%22nl_init%22%3Atrue%7D"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

        } catch (error) {
            console.error('Error:', error);
        }

        var randomTime = calcularIntervalo();

        realizarPrints(randomTime);


        setTimeout(async function() {

            var responseData = await makeRequest();
            var toidArray = construirLista(responseData);
            claimLoadsMultiple(toidArray);

        }, randomTime);
    }


    function obtenerHoraFormateada(fecha) {
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }


    function calcularIntervalo(){// Calcular el rango en milisegundos
        const minTime = (10 * 60 * 1000) + (15 * 1000); // 10 minutos y 15 segundos en milisegundos
        const maxTime = 11 * 60 * 1000; // 11 minutos en milisegundos

        // Generar un número aleatorio dentro del rango
        const randomTime = Math.random() * (maxTime - minTime) + minTime;

        return randomTime;
    }


    function realizarPrints(randomTime){
        const fecha = new Date();
        console.log("%cSolicitud efectuada: " + obtenerHoraFormateada(fecha), 'font-weight: bold; font-size: 18px;');

        const proximaSolicitud = new Date(fecha.getTime() + randomTime);
        // console.log("%cSiguiente solicitud: " + obtenerHoraFormateada(proximaSolicitud), 'font-weight: bold; font-size: 18px;');
        horaSolicitud = "Próxima solicitud: " + obtenerHoraFormateada(proximaSolicitud);

    }


    hashGlobal = obtenerHash();
    setTimeout(crearBotonLog, 5000);

})();