// ==UserScript==
// @name         TheWebCHanger
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Supreme// @author       TheSupremeHackerr
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525761/TheWebCHanger.user.js
// @updateURL https://update.greasyfork.org/scripts/525761/TheWebCHanger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cambiarColores() {
        const colores = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ff8800', '#00ffff', '#ff0080', '#8000ff', '#80ff00', '#ffcc00', '#ff66cc', '#66ffcc'];
        const elementos = document.querySelectorAll('*');

        setInterval(() => {
            elementos.forEach(elemento => {
                const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
                elemento.style.backgroundColor = colorAleatorio;
                elemento.style.color = '#ffffff';
            });
        }, 100);
    }

    function discoConsole() {
        let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ff8800', '#00ffff', '#ff0080', '#8000ff', '#80ff00', '#ffcc00', '#ff66cc', '#66ffcc'];
        let colorIndex = 0;

        setInterval(() => {
            console.log('%c HACKEADO!!! AJAJAJJAJAJAJAJAJAJAJAJAJAJA', `color: ${colors[colorIndex]}; font-size: 25px; font-weight: bold; background:black; padding:5px;`);
            colorIndex = (colorIndex + 1) % colors.length;
        }, 50);
    }

    function generarBSOD() {
        let bsod = document.getElementById('fake-bsod');
        if (!bsod) {
            bsod = document.createElement('div');
            bsod.id = 'fake-bsod';
            bsod.style.position = 'fixed';
            bsod.style.top = '0';
            bsod.style.left = '0';
            bsod.style.width = '100vw';
            bsod.style.height = '100vh';
            bsod.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/f/f7/Windows_10_%26_11_BSOD_%28new_version%29.png')";
            bsod.style.backgroundSize = 'cover';
            bsod.style.backgroundPosition = 'center';
            bsod.style.zIndex = '9999';
            document.body.appendChild(bsod);
            
            const audioFiles = [
                'https://www.myinstants.com/media/sounds/windows-error.mp3',
                'https://www.myinstants.com/media/sounds/screaming-goat.mp3',
                'https://www.myinstants.com/media/sounds/vine-boom.mp3'
            ];
            
            const randomAudio = new Audio(audioFiles[Math.floor(Math.random() * audioFiles.length)]);
            randomAudio.loop = false;
            randomAudio.play();
        }
        
        const bsodInterval = setInterval(() => {
            const colorAleatorio = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ff8800', '#00ffff', '#ff0080', '#8000ff', '#80ff00', '#ffcc00', '#ff66cc', '#66ffcc'][Math.floor(Math.random() * 13)];
            bsod.style.backgroundColor = colorAleatorio;
        }, 100);

        setTimeout(() => {
            clearInterval(bsodInterval);
            if (bsod) {
                bsod.remove();
            }
        }, 3000);
    }

    function generarIframes() {
        setInterval(() => {
            for (let i = 0; i < 5; i++) {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.width = '120px';
                iframe.style.height = '60px';
                iframe.style.left = `${Math.random() * window.innerWidth}px`;
                iframe.style.top = `${Math.random() * window.innerHeight}px`;
                iframe.style.border = '3px solid red';
                iframe.style.background = 'black';
                iframe.style.color = 'white';
                iframe.style.zIndex = '9999';
                iframe.srcdoc = '<body style="background:black; color:red; font-size:14px; font-weight:bold; text-align:center;">🔥HACKEADO🔥<br>JAJAJAJAJA</body>';
                
                document.body.appendChild(iframe);
                
                setTimeout(() => {
                    iframe.remove();
                }, 4000);
            }
        }, 150);
    }

    // Ejecutar todas las funciones
    discoConsole();
    cambiarColores();
    generarIframes();
    setInterval(generarBSOD, 6000);
})();
