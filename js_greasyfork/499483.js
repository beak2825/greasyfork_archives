// ==UserScript==
// @name         Porcentaje tropas
// @namespace    Porcentaje tropas
// @version      2024-06-27
// @description  Muestra el porcentaje de off y deff
// @author       You
// @match        https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499483/Porcentaje%20tropas.user.js
// @updateURL https://update.greasyfork.org/scripts/499483/Porcentaje%20tropas.meta.js
// ==/UserScript==
setInterval(function(){
    var elemento = document.querySelector('.units_land');
    var contenedor = elemento.children[1].children[2];
    if (contenedor) {
        if (!document.getElementById('div-porcentaje')) {
            var div = document.createElement('div');
            div.id = 'div-porcentaje';
            div.className = 'nav';

            var span = document.createElement('span');
            span.className = 'text_shadow';
            span.style.fontWeight = '300';
            span.style.textAlign = "center";
            div.style.paddingTop = '5px';
            div.style.marginTop = '-2px';

            var texto = calcularPorcentajes();
            span.textContent = texto;

            div.appendChild(span);
            div.title = 'Porcentaje de tropas ofensivas y defensivas';

            contenedor.insertBefore(div, contenedor.firstChild);
        }
    }
}, 1000);
function calcularPorcentajes(){
    var units = MM.getModels().Units
    var listaCiudades = []
    var total = 0;
    var sumaOff = 0;
    var sumaDeff = 0;
    var totalUnidades = {
        off: {
            catapult: 0,
            centaur: 0,
            fury: 0,
            griffin: 0,
            harpy: 0,
            manticore: 0,
            rider: 0,
            slinger: 0,
            ladon: 0,
            siren: 0,
            spartoi: 0,

        },
        deff: {
            archer: 0,
            bireme: 0,
            cerberus: 0,
            calydonian_boar: 0,
            chariot: 0,
            demolition_ship: 0,
            hoplite: 0,
            medusa: 0,
            minotaur: 0,
            pegasus: 0,
            satyr: 0,
            sea_monster: 0,
            sword: 0,
            trireme: 0,
            zyklop: 0

        }
    };


    for (var ciudad in ITowns.towns){
        listaCiudades.push(ciudad);
        // console.log(ciudad);
    }
    console.log(listaCiudades);
    for (var i in units) {
        var unit = units[i];
        if (listaCiudades.contains(unit.attributes.home_town_id) && listaCiudades.contains(unit.attributes.current_town_id) && unit.attributes.home_town_id == unit.attributes.current_town_id){
            for (var key in totalUnidades.off){
                totalUnidades.off[key] += (unit.attributes[key] * GameData.units[key].population);
                total += unit.attributes[key] * GameData.units[key].population;
                sumaOff += unit.attributes[key] * GameData.units[key].population;

            }
            for (key in totalUnidades.deff){
                totalUnidades.deff[key] += (unit.attributes[key] * GameData.units[key].population);
                total += unit.attributes[key] * GameData.units[key].population;
                sumaDeff += unit.attributes[key] * GameData.units[key].population;
            }
        }
    }

    var percDeff = Math.round((sumaDeff * 100) / total)
    var percOff = Math.round((sumaOff * 100) / total)
    var string = '⚔️ ' + percOff + '% | ' + percDeff + '% 🛡️';

    return string
}
