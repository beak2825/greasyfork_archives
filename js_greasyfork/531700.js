// ==UserScript==
// @name         Plantillas
// @namespace    Plantillas
// @version      2025-04-03
// @description  Hace plantillas para rev
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531700/Plantillas.user.js
// @updateURL https://update.greasyfork.org/scripts/531700/Plantillas.meta.js
// ==/UserScript==

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
    var conquestTime = Game.constants.game_config.revolt_delay_seconds / 3600;

    // Crear un objeto de fecha
    var fecha = new Date("2000-01-01 " + horaAtaque); // Usamos una fecha cualquiera ya que solo nos interesa la hora

    // Sumar n horas
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
    dict.Attacker.ID = JSON.parse(atob(attacker.children[1].children[0].attributes.href.value.slice(1))).id;

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
    dict.Deffender.Hero = '';
    var HEROES = require('enums/heroes');
    for (var heroe in HEROES){
        if (ITowns.getTown(deffenderTown.id).hasHero(HEROES[heroe])) {
            dict.Deffender.HeroLevel = ITowns.getTown(deffenderTown.id).getHero(HEROES[heroe]).attributes.level;
            dict.Deffender.Hero = traducir(HEROES[heroe]);
            break;
        }else{
            dict.Deffender.HeroLevel = "Ninguno";
            dict.Deffender.Hero = "";
        }
    }
    dict.Deffender.God = traducir(MM.getModels().Town[dict.Deffender.TownID].attributes.god) ? traducir(MM.getModels().Town[deffenderTown.id].attributes.god) : 'ninguno';
    dict.Deffender.IronInHide = MM.getModels().Town[dict.Deffender.TownID].attributes.espionage_storage;
    // Llamada a la función
    (async () => {
        dict.Deffender.HoraColono = await obtenerDistancia(dict);

        var contenidoPost = 'M'+dict.Deffender.Sea+' // ' + deffender.children[0].innerText + ' // PR ' + horaPR +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Ciudad Atacada:[/b] '+ dict.Deffender.Town +
            '\n[b]Jugador Atacado:[/b] '+ dict.Deffender.Player +
            '\n'+
            '\n[b]Hora de Inicio de Revuelta:[/b] '+ horaPR +
            '\n[b]Colono más cercano: ~[/b] '+ dict.Deffender.HoraColono +
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
            '\n[b]Héroe:[/b] '+ ((dict.Deffender.Hero + ' ' + dict.Deffender.HeroLevel) || 'ninguno')+
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
                        return
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
    })();

}


async function obtenerDistancia(dict) {
    function fetchNearbyCities(worldId, townId, margin) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: RepConv.grcrt_domain + "json_rpc.php", // Reemplaza con la URL correcta
                data: {
                    method: "getTown4Radar",
                    world: worldId,
                    town_id: townId,
                    margin: margin
                },
                dataType: "json",
                success: function(response) {
                    if (response && response.towns) {
                        resolve(response.towns);
                    } else {
                        reject(new Error('Unexpected response structure'));
                    }
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    }

    function calculateDistance(city1, city2) {
        return $.toe.calc.getDistance({ x: city1.abs_x, y: city1.abs_y }, { x: city2.abs_x, y: city2.abs_y });
    }

    function calculateTime(distance, gameSpeed) {
        var c = 900 / gameSpeed;
        var h = 9; // Speed of troops
        return Math.round(50 * distance / h + c);
    }

    function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function sortCitiesByDistance(referenceCity, cities, gameSpeed) {
        return cities.map(city => {
            var distance = calculateDistance(referenceCity, city);
            var travelTime = calculateTime(distance, gameSpeed);
            return {
                city: city,
                distance: distance,
                travelTime: formatTime(travelTime)
            };
        }).sort((a, b) => a.distance - b.distance);
    }

    async function getNearbyCitiesSortedByDistance(worldId, townId, margin, gameSpeed, playerId) {
        try {
            const cities = await fetchNearbyCities(worldId, townId, margin);
            if (!cities) {
                console.error('No cities data received');
                return [];
            }

            // Extraer la ciudad de referencia antes del filtrado
            var referenceCity = cities.find(city => city.id === townId);
            if (!referenceCity) {
                console.error('Reference city not found in cities');
                return [];
            }

            var filteredCities = cities.filter(city => city.player_id == playerId);

            if (filteredCities.length > 0) {
                return sortCitiesByDistance(referenceCity, filteredCities, gameSpeed);
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching or processing cities:", error);
            return [];
        }
    }

    var worldId = Game.world_id;
    var townId = dict.Deffender.TownID;
    var margin = 600;
    var gameSpeed = Game.game_speed;
    var playerId = dict.Attacker.ID;

    const sortedCities = await getNearbyCitiesSortedByDistance(worldId, townId, margin, gameSpeed, playerId);
    if (sortedCities.length > 0) {
        const travelTime = sortedCities[0].travelTime;
        return travelTime;
    } else {
        return "No se encontraron ciudades";
    }
}


function traducir(selectedUnit){
    var translatedUnit
    switch (selectedUnit) {
        case 'sword':
            translatedUnit = 'infantes';
            break;
        case 'archer':
            translatedUnit = 'arqueros';
            break;
        case 'hoplite':
            translatedUnit = 'hoplitas';
            break;
        case 'slinger':
            translatedUnit = 'honderos';
            break;
        case 'rider':
            translatedUnit = 'caballeros';
            break;
        case 'chariot':
            translatedUnit = 'carros';
            break;
        case 'catapult':
            translatedUnit = 'catapultas';
            break;
        case 'godsent':
            translatedUnit = 'divinos';
            break;
        case 'manticore':
            translatedUnit = 'mantícoras';
            break;
        case 'harpy':
            translatedUnit = 'arpías';
            break;
        case 'pegasus':
            translatedUnit = 'pegasos';
            break;
        case 'griffin':
            translatedUnit = 'grifos';
            break;
        case 'cerberus':
            translatedUnit = 'cerberos';
            break;
        case 'minotaur':
            translatedUnit = 'minotauros';
            break;
        case 'medusa':
            translatedUnit = 'medusas';
            break;
        case 'zyklop':
            translatedUnit = 'cíclopes';
            break;
        case 'centaur':
            translatedUnit = 'centauros';
            break;
        case 'calydonian_boar':
            translatedUnit = 'jabalís';
            break;
        case 'fury':
            translatedUnit = 'erinias';
            break;
        case 'sea_monster':
            translatedUnit = 'hidras';
            break;
        case 'spartoi':
            translatedUnit = 'espartos';
            break;
        case 'ladon':
            translatedUnit = 'ladones';
            break;
        case 'satyr':
            translatedUnit = 'sátiros';
            break;
        case 'siren':
            translatedUnit = 'sirenas';
            break;
        case 'small_transporter':
            translatedUnit = 'botes rápidos';
            break;
        case 'big_transporter':
            translatedUnit = 'botes lentos';
            break;
        case 'bireme':
            translatedUnit = 'birremes';
            break;
        case 'attack_ship':
            translatedUnit = 'mechas';
            break;
        case 'trireme':
            translatedUnit = 'trirremes';
            break;
        case 'demolition_ship':
            translatedUnit = 'brulotes';
            break;
        case 'colonize_ship':
            translatedUnit = 'colonos';
            break;
        case 'hera':
            translatedUnit = 'Hera';
            break;
        case 'athena':
            translatedUnit = 'Atenea';
            break;
        case 'artemis':
            translatedUnit = 'Artemisa';
            break;
        case 'ares':
            translatedUnit = 'Ares';
            break;
        case 'aphrodite':
            translatedUnit = 'Afrodita';
            break;
        case 'hades':
            translatedUnit = 'Hades';
            break;
        case 'poseidon':
            translatedUnit = 'Poseidón';
            break;
        case 'zeus':
            translatedUnit = 'Zeus';
            break;
        case 'apheledes':
            translatedUnit = 'Afeledes';
            break;
        case 'agamemnon':
            translatedUnit = 'Agamenón';
            break;
        case 'ajax':
            translatedUnit = 'Ajax';
            break;
        case 'alexandrios':
            translatedUnit = 'Alexandrios';
            break;
        case 'andromeda':
            translatedUnit = 'Andrómeda';
            break;
        case 'anysia':
            translatedUnit = 'Anysia';
            break;
        case 'argus':
            translatedUnit = 'Argos';
            break;
        case 'aristotle':
            translatedUnit = 'Aristóteles';
            break;
        case 'atalanta':
            translatedUnit = 'Atalanta';
            break;
        case 'christopholus':
            translatedUnit = 'Cristopholus';
            break;
        case 'daidalos':
            translatedUnit = 'Daidalos';
            break;
        case 'deimos':
            translatedUnit = 'Deimos';
            break;
        case 'democritus':
            translatedUnit = 'Demócrito';
            break;
        case 'eurybia':
            translatedUnit = 'Euribia';
            break;
        case 'ferkyon':
            translatedUnit = 'Ferquión';
            break;
        case 'philoctetes':
            translatedUnit = 'Filoctetes';
            break;
        case 'iason':
            translatedUnit = 'Jasón';
            break;
        case 'leonidas':
            translatedUnit = 'Leónidas';
            break;
        case 'lysippe':
            translatedUnit = 'Lysippe';
            break;
        case 'medea':
            translatedUnit = 'Medea';
            break;
        case 'melousa':
            translatedUnit = 'Melousa';
            break;
        case 'mihalis':
            translatedUnit = 'Mihalis';
            break
        case 'odysseus':
            translatedUnit = 'Odiseo';
            break;
        case 'orpheus':
            translatedUnit = 'Orfeo';
            break;
        case 'pariphaistes':
            translatedUnit = 'Pariphaistes';
            break;
        case 'pelops':
            translatedUnit = 'Pélope';
            break;
        case 'perseus':
            translatedUnit = 'Perseo';
            break;
        case 'cheiron':
            translatedUnit = 'Quirón';
            break;
        case 'rekonos':
            translatedUnit = 'Rekonos';
            break;
        case 'telemachos':
            translatedUnit = 'Telemaco';
            break;
        case 'themistokles':
            translatedUnit = 'Temístocles';
            break;
        case 'terylea':
            translatedUnit = 'Terilea';
            break;
        case 'urephon':
            translatedUnit = 'Uréfon';
            break;
        case 'ylestres':
            translatedUnit = 'Ylestres';
            break;
        case 'hector':
            translatedUnit = 'Héctor';
            break;
        case 'helen':
            translatedUnit = 'Helena';
            break;
        case 'hercules':
            translatedUnit = 'Hércules';
            break;
        case 'zuretha':
            translatedUnit = 'Zureta';
            break;
        default:
            translatedUnit = 'unidad desconocida';
    }
    return translatedUnit
}
// Intervalo para buscar el elemento town_bbcode_link
setInterval(escanearVentanas, 1000);
