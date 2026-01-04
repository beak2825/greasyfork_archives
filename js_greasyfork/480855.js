// ==UserScript==
// @name         GalaxyTool PREDATOR B.O.R.G.rasalas
// @namespace    https://greasyfork.org
// @version      1.4
// @description  Local Storage script
// @author       PREDATOR
// @match        https://rasalas.ogame.fun/game.php?page=galaxy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480855/GalaxyTool%20PREDATOR%20BORGrasalas.user.js
// @updateURL https://update.greasyfork.org/scripts/480855/GalaxyTool%20PREDATOR%20BORGrasalas.meta.js
// ==/UserScript==

var universoNombre = window.location.hostname.split('.')[0];
var galaxySelect = $("[name='galaxy']")[0];
var systemSelect = $("[name='system']")[0];
var galaxyTableRows = $("#galaxytableHead > tbody > tr");

(function () {
    console.log("Principio");

    // Verifica las condiciones para crear una nueva base de datos
    if (galaxySelect.value === "1" && systemSelect.value === "1") {
        if (confirm('¡ALERTA! Vas a generar una nueva base de datos. Este proceso puede tardar un tiempo significativo. ¿Deseas continuar?')) {
            // Código para crear una nueva base de datos o realizar otras acciones necesarias
            var request = indexedDB.open(universoNombre, 1);
            request.onupgradeneeded = function (event) {
                event.target.result.close(); // Cerrar la base de datos para poder eliminarla
                indexedDB.deleteDatabase(universoNombre);
            };
            alert('Base de datos borrada');
        } else {
            alert('Proceso cancelado. Vuelve pronto.');
        }
    }

    // Resto del código para escanear la galaxia y almacenar en localStorage
    scanGalaxyAndStoreData();

    function scanGalaxyAndStoreData() {
        // Borra datos antiguos en localStorage
        localStorage.removeItem("players");

        for (var i = 0; i < galaxyTableRows.length; i++) {
            var currentRow = galaxyTableRows[i];
            var posicion = currentRow.querySelector("td.position").innerText;
            var nombre = currentRow.children[6].innerText;
            var codigom = currentRow.children[3].childElementCount;

            // Gestión de estado del jugador
            var estado = nombre.includes("(V)") ? "Vacaciones" :
                         (nombre.includes("(i)") || nombre.includes("(i I)")) ? "Inactivo" :
                         nombre.includes("(B)") ? "Baneado" : "Activo";

            // Tiene luna?
            codigom = codigom === 0 ? "vacio" : currentRow.children[3].innerHTML
                .substring(currentRow.children[3].innerHTML.indexOf("javascript:doit"),
                    currentRow.children[3].innerHTML.indexOf(";"));

            // Inyectamos en localStorage si el registro no está vacío
            if (nombre !== "") {
                var alianza = currentRow.children[8].innerText;

                // Tiene alianza?
                alianza = alianza === "" ? "vacio" : alianza;

                var codigo = currentRow.querySelector("td.action").innerHTML
                    .substring(currentRow.querySelector("td.action").innerHTML.indexOf("javascript:doit"),
                        currentRow.querySelector("td.action").innerHTML.indexOf("{")) + ")";

                var planetaimg = currentRow.querySelector("td.microplanet1 > a").innerHTML
                    .substring(currentRow.querySelector("td.microplanet1 > a").innerHTML.indexOf("./styles/"),
                        currentRow.querySelector("td.microplanet1 > a").innerHTML.indexOf(".gif")) + ".gif";

                var playersArray = JSON.parse(localStorage.getItem("players") || "[]");

                var playerData = {
                    galaxy: galaxySelect.value,
                    system: systemSelect.value,
                    planet: posicion,
                    name: nombre,
                    codigo: codigo,
                    codigom: codigom,
                    planetimg: planetaimg,
                    alianza: alianza,
                    estado: estado
                };

                playersArray.push(playerData);
                localStorage.setItem("players", JSON.stringify(playersArray));

                console.log("Información del jugador:", playerData);
            }
        }
    }

function submit() {
    var currentGalaxy = parseInt(galaxySelect.value);
    var currentSystem = parseInt(systemSelect.value);

    if (currentSystem < 299) {
        galaxy_submit('systemRight');
    } else {
        if (currentGalaxy < 5) { // Cambiar 5 por el número máximo de galaxias
            //galaxySelect.value = (currentGalaxy + 1).toString();
            systemSelect.value = "1";
            galaxy_submit('galaxyRight');
        } else {
            alert("Proceso finalizado, todas las galaxias y sistemas solares han sido explorados.");
        }
    }
}

    var s = 1 * 150;
    setTimeout(submit, s);
})();