// ==UserScript==
// @name         Un evento norkoreano
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Mikelony inútil inoperante mulo del sistema
// @author       salcufo
// @match        https://www.managerzone.com/?p=event
// @icon         https://bolt-gcdn.sc-cdn.net/3/YqK30ABPM0hYYuT74QXr0?bo=EhgaABoAMgF9OgEEQgYIjr3y8AVIAlASYAE%3D&uc=18
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489656/Un%20evento%20norkoreano.user.js
// @updateURL https://update.greasyfork.org/scripts/489656/Un%20evento%20norkoreano.meta.js
// ==/UserScript==

(function() {
    'use strict';
    norkoreanizar();

    function norkoreanizar() {
        var numero = document.querySelectorAll('div.flex-grow-1.textCenter')[0].innerText;
        var escudo = document.querySelectorAll('.flex-grow-1.textLeft img')[0];
        var escudoMini = document.querySelector('.flex-grow-0.event-sticker fieldset img');
        var area = document.querySelector('div.flex-grow-1.textLeft');

        var user = getNorko(numero);
        area.insertAdjacentHTML('beforeend', '<p><strong>Partido contra ' + user.nombre +'</strong></p>');

        var interval = setInterval(function() {
            escudo.src = user.escudo;
            escudoMini.src = user.escudo;
        }, 2000);
    }

    function getNorko(id)
    {
        var norkos = [
        {
            id: 1,
            nombre: "Morghen",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=1228625&sport=soccer&location=team_main",
        },
        {
            id: 2,
            nombre: "Masters1000",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=439038&sport=soccer&location=team_main",
        },
        {
            id: 3,
            nombre: "Joelsaunier",
            escudo: "https://www.managerzone.com/dynimg/pic.php?type=profile&uid=928016",
        },
        {
            id: 4,
            nombre: "Lote",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=157092&sport=soccer",
        },
        {
            id: 5,
            nombre: "Fidel",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=1006600&sport=soccer",
        },
        {
            id: 6,
            nombre: "Gastonid",
            escudo: "hthttps://www.managerzone.com/dynimg/badge.php?team_id=475283&sport=soccer",
        },
        {
            id: 7,
            nombre: "Elcuyo",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=326254&sport=soccer",
        },
        {
            id: 8,
            nombre: "Pritito",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=171575&sport=soccer",
        },
        {
            id: 9,
            nombre: "Cas_",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=446378&sport=soccer",
        },
        {
            id: 10,
            nombre: "Loco_pol",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=1008102&sport=soccer",
        },
        {
            id: 11,
            nombre: "Jumasa",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=1003922&sport=soccer",
        },
        {
            id: 12,
            nombre: "Murder",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=183026&sport=soccer",
        },
        {
            id: 13,
            nombre: "Guille Frank",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=168061&sport=soccer",
        },
        {
            id: 14,
            nombre: "El ogro",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=469367&sport=soccer",
        },
        {
            id: 15,
            nombre: "Figu 666",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=434469&sport=soccer",
        },
        {
            id: 16,
            nombre: "El delfín",
            escudo: "https://www.managerzone.com/dynimg/badge.php?team_id=169946&sport=soccer",
        },
        {
            id: 17,
            nombre: "Fif0",
            escudo: "https://scontent.faep11-2.fna.fbcdn.net/v/t1.6435-9/118584459_10222510358166271_1010215551465820963_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=DyNX5IvneZUAX9r4IrK&_nc_ht=scontent.faep11-2.fna&oh=00_AfC0mSQqIBD-0Ab9Cr9nm_DTE8xSIijoFj8nV9PUYN-GKQ&oe=6617E8F3",
        },
        {
            id: 18,
            nombre: "Kim Il Sung",
            escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Kim_Il_Sung_Portrait-3.jpg/127px-Kim_Il_Sung_Portrait-3.jpg",
        },
        {
            id: 19,
            nombre: "La hermana del Líder",
            escudo: "https://fotografias.antena3.com/clipping/cmsimages01/2022/07/25/307C7F8E-A2A5-4C03-8875-80FE2B9DD5DA/kim-jong-hermana-kim-jong_103.jpg?crop=900,675,x248,y0&width=1200&height=900&optimize=low&format=webply",
        },
        {
            id: 20,
            nombre: "EL LÍDER",
            escudo: "https://i.pinimg.com/736x/ce/a2/f4/cea2f4f4bd7e1e8c33d2a7db7e4112bc.jpg",
        }];

        var user;
        for (var i = 0; i < norkos.length; i++) {
            if (norkos[i].id == id) {
                user = norkos[i];
                break;
            }
        }

        return user;
    }

})();