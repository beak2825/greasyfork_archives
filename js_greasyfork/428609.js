// ==UserScript==
// @name         MZ ClownScript
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Convierte a tus jugadores en payasos que beben fernet y hacen asado
// @author       Murder
// @match        https://www.managerzone.com/*
// @icon         http://www.rw-designer.com/icon-view/15717.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428609/MZ%20ClownScript.user.js
// @updateURL https://update.greasyfork.org/scripts/428609/MZ%20ClownScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

var colors = ['ff0000','00ff00','0000ff','FFC300','00ffff', 'ff00CC', '9900CC'];
    var skills = ['Hacer malabares',
                  'Jugar al voley',
                  'Mear sentado',
                  'Lamer clavos',
                  'Encontrar MUs',
                  'Cosechar hortalizas',
                  'Preparar tortillas',
                  'Domador de orcas',
                  'Hacer jueguito sin usar las piernas',
                  'Lanzamiento de enanos',
                  'Asaltar carritos en la costanera',
                  'Piropear primas',
                  'Preparar tereré',
                  'Fingir faltas',
                  'Ir sin dormir al entrenamiento',
                  'Peluquería canina',
                  'No usa ropa interior',
                  'Beber sandía con vino',
                  'Cocina norkoreana',
                  'Se sabe todas las canciones de Sandro',
                  'Cocinar sin lavarse las manos',
                  'Reparación de hidrolavadores',
                  'Venderle lacteos vencidos al chino',
                  'Gatero como pocos',
                  'Manguerear coches',
                  'Cabezazo tucumano',
                  'Hacerse echar todos los partidos',
                  'Diseñar escudos',
                  'Armar muñecos con chizitos en los cumpleaños'
                  ];
    var nose = "<span style=\"color: red;position: absolute;top: 17px;left: 270px;font-size: 16px;\">●</span>"
    var noseHome = ['<span style=\"color: red;position: absolute;top: 263px;left: 55px;font-size: 16px;\">●</span>',
                    '<span style=\"color: red;position: absolute;top: 263px;left: 334px;font-size: 16px;\">●</span>']
    var noseClub = "<span style=\"color: red;position: absolute;top: 26px;left: 433px;font-size: 16px;\">●</span>";
    var noseMyClub = "<span style=\"color: red;position: absolute;top: 26px;left: 464px;font-size: 16px;\">●</span>";
    var handItems = ['<img src=\"https://i.ibb.co/MsNVrpN/sopapa.png" style="top: 96px;left: 211px;position: absolute; height: 61px;">',
                     '<img src=\"https://i.pinimg.com/originals/a1/46/9c/a1469cb37d0db1d13c92d2fcc2e72e07.png\" style="width: 30px;height: 30px;transform: rotate(270deg);top: 93px;left: 225px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/p2DSxRR/pngegg.png" style="top: 96px;left: 216px;position: absolute;">', //bolsa
                     '<img src=\"https://i.ibb.co/YNpdjcn/fernet.png" style="top: 69px;left: 225px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/R9d9dx6/asado2.png" style="top: 98px;left: 187px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/5Wq1B2N/sube.png" style="top: 98px;left: 219px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/CnrR0xk/mu-on.png" style="top: 67px;left: 229px;position: absolute;">',
                     //'<img src=\"https://i.ibb.co/mCyjjsn/droid.png" style="top: 91px;left: 213px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/mC3gNx3/inflable.png" style="top: 49px;left: 197px;position: absolute; width: 140px">',
                     '<img src=\"https://i.ibb.co/ZSnGTfW/cabra.png" style="top: 90px;left: 244px;position: absolute; width: 65px">',
                     '<img src=\"https://i.ibb.co/C00QdjZ/meo2.png" style="top: 100px;left: 237px;position: absolute; width: 80px">',
                     '<img src=\"https://i.ibb.co/KskZ7Lc/pelopincho.png" style="top: 164px;left: 231px;position: absolute; width: 97px">',
                    ]
    var handItemsHome = [
                     '<img src=\"https://i.ibb.co/YNpdjcn/fernet.png" style="top: 315px;left: 9px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/R9d9dx6/asado2.png" style="top: 346px;left: 248px;position: absolute;">'
                    ]
    var handItemsClub = [
                     '<img src=\"https://i.ibb.co/YNpdjcn/fernet.png" style="top: 82px;left: 419px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/mC3gNx3/inflable.png" style="top: 59px;left: 391px;position: absolute; width: 140px">',
                    ]
    var handItemsOtherClub = [
                     '<img src=\"https://i.ibb.co/YNpdjcn/fernet.png" style="top: 80px;left: 390px;position: absolute;">',
                     '<img src=\"https://i.ibb.co/mC3gNx3/inflable.png" style="top: 59px;left: 360px;position: absolute; width: 140px">',
                    ]
    generateClowns();
    addSkill();

    function generateClowns() {
        var players = document.getElementsByClassName('player-image');

        for (var i = 0; i < players.length; ++i) {
            var player = players[i];
            var color = colors[Math.floor(Math.random() * colors.length)];

            var hairItem = player.innerHTML.split('&amp;item_hair=')[1].split('&amp;')[0];
            player.innerHTML = player.innerHTML.replace('&amp;item_hair=' + hairItem,'&amp;item_hair=hair_169');

            var hairColor = player.innerHTML.split('&amp;hair_color=')[1].split('&amp;')[0];
            player.innerHTML = player.innerHTML.replace('&amp;hair_color=' + hairColor,'&amp;hair_color=' + color);

            var skinColor = player.innerHTML.split('&amp;skin_color=')[1].split('&amp;')[0];
            player.innerHTML = player.innerHTML.replace('&amp;skin_color=' + skinColor,'&amp;skin_color=cccccc');


            if(player.parentNode.className == 'dg_playerview') { //players
                addItemsAndNose(player);
            }
            else if (window.location.search == '?p=team') { //my club
                var handItemClub = handItemsClub[Math.floor(Math.random() * handItemsClub.length)];
                player.innerHTML = noseMyClub + player.innerHTML;
                player.innerHTML = handItemClub + player.innerHTML;
            }
            else if (window.location.search.includes('&tid=')) { //other club
                var handItemOtherClub = handItemsOtherClub[Math.floor(Math.random() * handItemsOtherClub.length)];
                player.innerHTML = noseClub + player.innerHTML;
                player.innerHTML = handItemOtherClub + player.innerHTML;
            }
            else { //home
                var handItem = handItemsHome[i];
                player.innerHTML = noseHome[i] + player.innerHTML;
                player.innerHTML = handItem + player.innerHTML;
            }

        }
    }

    function addSkill() {
        var players = document.getElementsByClassName('dg_playerview_info');

        for (var i = 0; i < players.length; ++i) {
            var skill = skills[Math.floor(Math.random() * skills.length)];

            var newNode = document.createElement('tr');
            newNode.appendChild(document.createElement('td'));
            newNode.children[0].innerHTML = 'Habilidad especial: <b>' + skill + '</b>';
            var item = players[i].children[0].children[0];
            players[i].children[0].children[0].insertBefore(newNode, item.children[4]);
        }
    }

    function addItemsAndNose(player) {
        var handItem = handItems[Math.floor(Math.random() * handItems.length)];
        player.innerHTML += nose;
        player.innerHTML += handItem;
    }

})();
