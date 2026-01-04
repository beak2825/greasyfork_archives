// ==UserScript==
// @name         Plantilleador
// @namespace    Plantillas
// @version      1.0
// @description  Genera plantillas
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com

// @downloadURL https://update.greasyfork.org/scripts/494603/Plantilleador.user.js
// @updateURL https://update.greasyfork.org/scripts/494603/Plantilleador.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var townBbcodeLink
    var commandContainer
    var reportContainer

    // Función para agregar un botón al contenedor del elemento town_bbcode_link
    function escanearVentanas(townBbcodeLink) {

        // Encuentra el elemento town_bbcode_link
        townBbcodeLink = document.getElementById('town_bbcode_link');
        commandContainer = document.querySelector('.command_info_container');
        reportContainer = document.querySelector('#report_report');

        var botonPerfil = document.querySelector('#plantilla_perfil');
        var botonCommand = document.querySelector('#boton_ataque_recibido');
        var botonInforme = document.querySelector('#boton_informe');



        // Si el elemento existe
        if (townBbcodeLink && !botonPerfil) {
            plantillaCiudad(townBbcodeLink)
        }else if (reportContainer && !botonInforme){
            plantillaReport(reportContainer)
        }

    }

    function plantillaCiudad(townBbcodeLink){


        var contenedor = townBbcodeLink.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

        var contenedorDatos = townBbcodeLink.parentElement.parentElement.parentElement
        var townBBCode = contenedorDatos.querySelector('.town_bbcode_id').value;
        var townName = contenedor.parentElement.parentElement.children[0].children[0].innerText;
        var playerName = contenedorDatos.querySelectorAll('.gp_player_link')[0].text;
        var playerBBCode = '[player]' + playerName + '[/player]'
        var aliName = contenedorDatos.children[4].children[1].innerText
        if (aliName != 'Reservar' && aliName && aliName != '<empty string>'){
            var aliBBCode = '[ally]' + aliName + '[/ally]';
        }


        var marTexto = contenedorDatos.children[2].innerText
        try{
            var reserva = contenedorDatos.querySelectorAll('.gp_player_link')[1].text}catch{}
        if (reserva != '<empty string>' && reserva && reserva != 'undefined' && reserva != 'Reservar'){
            var conquistador = '[player]' + reserva + '[/player]'
            }

        var regex = /(\d+)/;
        var resultado = regex.exec(marTexto);
        var numeroMar = resultado[1];
        var mar = 'M' + numeroMar

        var contenidoPost = mar + ' // ' + townName + ' // ESPIA' +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Ciudad Objetivo:[/b] '+ townBBCode +
            '\n[b]Jugador Objetivo:[/b] '+ playerBBCode +
            '\n[b]Alianza Objetivo:[/b] '+ (aliBBCode || '') +
            '\n[b]Conquistador:[/b] '+ (conquistador || '') +
            '\n[b]Hora de Inicio de Revuelta:[/b] '+
            '\n[b]Hora de Llegada del Colono:[/b] '+
            '\n'+
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Apoyo Necesario:[/b] '+
            '\n'+
            '\n═════════════════════════════════════════════════════════'+
            '\n[spoiler=Informes(ataque de revuelta, espionaje, etc)]'+
            '\n'+
            '\n[/spoiler]';
        // var ciudad = contenedor.querySelector(
        var boton = document.createElement('button');
        boton.id = 'plantilla_perfil';
        boton.innerHTML = 'Generar Plantilla';

        boton.addEventListener('click', function() {
            // Copiar el contenido de contenidoPost al portapapeles
            navigator.clipboard.writeText(contenidoPost)
                .then(function() {
                // Aquí puedes agregar una retroalimentación adicional si lo deseas
            })
                .catch(function(err) {
                console.error('Error al copiar al portapapeles: ', err);
                // Manejar errores si es necesario
            });
        });

        contenedor.appendChild(boton);
        var botonCerrar = contenedor.parentElement.parentElement.children[0].children[1]
        botonCerrar.addEventListener('click', function(){
            setTimeout(function(){
                escanearVentanas(false);
                }, 1000);

        });
    }

    function plantillaReport(reportContainer){
        var dict = {}
        dict.Attacker = {};
        dict.Deffender = {};

        var hora_regex = /\d{2}:\d{2}:\d{2}/;
        var horaAtaque = reportContainer.children[0].children[10].children[0].innerText.match(hora_regex)[0];
        var conquestTime = Game.constants.game_config.conquest_time_hours;

        // Crear un objeto de fecha
        var fecha = new Date("2000-01-01 " + horaAtaque); // Usamos una fecha cualquiera ya que solo nos interesa la hora

        // Sumar 8 horas
        fecha.setHours(fecha.getHours() + conquestTime);

        // Obtener la nueva hora
        var horaPR = fecha.toLocaleTimeString('en-US', {hour12: false}); // Convertir la hora a una cadena en formato de 24 horas

        var dataContainer = reportContainer.children[0].children[9].children[0];

        var attacker = dataContainer.children[0].children[1];
        var deffender = dataContainer.children[2].children[1];
        // Expresión regular para extraer el texto entre comillas simples
        var texto_regex = /'([^']*)'/;
        var attackerTown = JSON.parse(atob(attacker.children[0].children[0].attributes.href.value.slice(1)));
        var deffenderTown = JSON.parse(atob(deffender.children[0].children[0].attributes.href.value.slice(1)));

        dict.Attacker.Town = '[town]' + attackerTown.id + '[/town]';
        dict.Attacker.Player = '[player]' + attacker.children[1].innerText + '[/player]';
        dict.Attacker.Ally = '[ally]' + attacker.children[2].innerHTML.match(texto_regex)[1] + '[/ally]';
        dict.Attacker.Sea = attackerTown.ix.toString().charAt(0) + attackerTown.iy.toString().charAt(0);
        dict.Attacker.TownID = attackerTown.id;

        dict.Deffender.Town = '[town]' + deffenderTown.id + '[/town]';
        dict.Deffender.Player = '[player]' + deffender.children[1].innerText + '[/player]';
        try{
            dict.Deffender.Ally = '[ally]' + deffender.children[2].innerHTML.match(texto_regex)[1] + '[/ally]';
        }catch{}
        dict.Deffender.Sea = deffenderTown.ix.toString().charAt(0) + deffenderTown.iy.toString().charAt(0);
        dict.Deffender.TownID = deffenderTown.id

        dict.Deffender.Wall = MM.getModels().Buildings[deffenderTown.id].attributes.wall
        dict.Deffender.Tower = MM.getModels().Buildings[deffenderTown.id].attributes.tower == 0 ? 'NO' : 'SÍ';
        dict.Deffender.Ram = MM.getModels().Researches[deffenderTown.id].attributes.ram ? 'SÍ' : 'NO';
        dict.Deffender.Phalanx = MM.getModels().Researches[deffenderTown.id].attributes.phalanx ? 'SÍ' : 'NO';
        dict.Deffender.DivineSelection = MM.getModels().Researches[deffenderTown.id].attributes.divine_selection ? 'SÍ' : 'NO';

        dict.Deffender.Hero = ITowns.getHeroDIO()[dict.Deffender.TownID] ? ITowns.getHeroDIO()[dict.Deffender.TownID].hero_name + ' al nivel ' + ITowns.getHeroDIO()[dict.Deffender.TownID].hero_level : 'ninguno';
        dict.Deffender.God = MM.getModels().Town[dict.Deffender.TownID].attributes.god ? MM.getModels().Town[deffenderTown.id].attributes.god : 'ninguno';
        dict.Deffender.IronInHide = MM.getModels().Town[dict.Deffender.TownID].attributes.espionage_storage

        var contenidoPost = 'M'+dict.Deffender.Sea+' // ' + deffender.children[0].innerText + ' // PR ' + horaPR +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Ciudad Atacada:[/b] '+ dict.Deffender.Town +
            '\n[b]Jugador Atacado:[/b] '+ dict.Deffender.Player +
            '\n'+
            '\n[b]Hora de Inicio de Revuelta:[/b] '+ horaPR +
            '\n[b]Hora de Llegada del Colono:[/b] '+
            '\n'+
            '\n[b]Jugador Atacante:[/b] '+ dict.Attacker.Player +
            '\n[b]Alianza Atacante:[/b] '+ (dict.Attacker.Ally || '') +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Muro:[/b] '+ dict.Deffender.Wall +
            '\n[b]Torre:[/b] '+ dict.Deffender.Tower +
            '\n[b]Espolón:[/b] '+ dict.Deffender.Ram +
            '\n[b]Falange:[/b] '+ dict.Deffender.Phalanx +
            '\n[b]Selección divina:[/b] '+ dict.Deffender.DivineSelection +
            '\n[b]Héroe:[/b] '+ dict.Deffender.Hero +
            '\n[b]Dios:[/b] '+ dict.Deffender.God +
            '\n[b]Plata en la cueva:[/b] '+ dict.Deffender.IronInHide +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Apoyo Necesario:[/b] '+
            '\n'+
            '\n═════════════════════════════════════════════════════════'+
            '\n[spoiler=Revuelta]';

        var contenedorBBCode

        setInterval(function(){

            if (contenedorBBCode && !document.querySelector('#boton_informe')){
                contenidoPost += contenedorBBCode.children[1].attributes[2].nodeValue + '[/spoiler]';
                var boton = document.createElement('button');
                boton.id = 'boton_informe';
                boton.innerHTML = 'Generar Plantilla';
                boton.addEventListener('click', function() {
                    // Copiar el contenido de contenidoPost al portapapeles
                    navigator.clipboard.writeText(contenidoPost)
                        .then(function() {
                        HumanMessage.success(_('Plantilla copiada al portapapeles'))
                        // Aquí puedes agregar una retroalimentación adicional si lo deseas
                    })
                        .catch(function(err) {
                        console.error('Error al copiar al portapapeles: ', err);
                        // Manejar errores si es necesario
                    });
                });
                contenedorBBCode.parentElement.appendChild(boton);
            }else if (!contenedorBBCode)
            {contenedorBBCode = document.querySelector('.publish_report_public_id_wrap');}
        }, 1000);

    }
    // Intervalo para buscar el elemento town_bbcode_link
    setInterval(escanearVentanas, 1000);

})();