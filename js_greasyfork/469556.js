// ==UserScript==
// @name         Moomoo.io Music Menu
// @description  Thx to chatgpt
// @version      1.0
// @grant        none
// @match        https://moomoo.io/*
// @include      https://www.moomoo.io/*
// @namespace https://greasyfork.org/users/805514
// @downloadURL https://update.greasyfork.org/scripts/469556/Moomooio%20Music%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/469556/Moomooio%20Music%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arreglo para almacenar las canciones de música
    var musicLinks = [
        {
            url: 'https://cdn.discordapp.com/attachments/1092356876743737344/1111932900770857060/1123209657922629682.mp3',
            title: 'Balls'
        }
    ];

    // Crea el menú de música
    var musicMenu = document.createElement('div');
    musicMenu.style.position = 'absolute';
    musicMenu.style.top = '10px';
    musicMenu.style.left = '10px';
    musicMenu.style.zIndex = '9999';

    for (var i = 0; i < musicLinks.length; i++) {
        var musicButton = document.createElement('button');
        musicButton.textContent = musicLinks[i].title;
        musicButton.style.marginRight = '10px';

        // Función para reproducir la canción cuando se hace clic en el botón
        musicButton.addEventListener('click', function(index) {
            return function() {
                var audioPlayer = document.getElementById('moomoo-music-player');
                if (audioPlayer) {
                    audioPlayer.pause();
                    audioPlayer.src = musicLinks[index].url;
                    audioPlayer.play();
                }
            };
        }(i));

        musicMenu.appendChild(musicButton);
    }

    // Agrega el reproductor de música al documento
    var audioPlayer = document.createElement('audio');
    audioPlayer.id = 'moomoo-music-player';
    audioPlayer.controls = true;
    audioPlayer.style.display = 'none';
    document.body.appendChild(audioPlayer);

    // Agrega el menú de música al documento
    document.body.appendChild(musicMenu);
})();
