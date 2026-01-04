// ==UserScript==
// @name         Auto Next
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Busca los reproductores compatibles en el listado, los selecciona y maximiza. También redirige al siguiente episodio de manera automática.
// @author       Chomusuke
// @license      MIT
// @match        https://serieskao.top/*
// @match        https://xupalace.org/*
// @match        https://hlsflast.com/*
// @match        https://vidhidefast.com/*
// @match        https://dood.work/*
// @match        https://kllamrd.org/*
// @match        https://sandratableother.com/*
// @match        https://waaw.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522184/Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/522184/Auto%20Next.meta.js
// ==/UserScript==

// REORGANIZAR A GUSTO
const reproductores = ['streamwish', 'filelions', 'doodstream', 'embedsito', 'voe', 'waaw']
// streamwish, filelions, doodstream, stape, vox, waav
const timeRemainToNext = 15 //tiempo restante del video para que inicie redirección

// USE F11 para tenerlo en pantalla completa siempre
// NO TOCAR---------------------------------------------------------------------------------
const sudomains = {
    'streamwish':'https://hlsflast.com',
    'filelions':'https://vidhidefast.com',
    'doodstream':'https://dood.work',
    'embedsito':'https://kllamrd.org',
    'voe':'https://sandratableother.com',
    'waaw':'https://waaw.to',
}
const videoListURL = 'https://xupalace.org'
const mainURL = 'https://serieskao.top'
const timeout = 5500; // Límite de tiempo en milisegundos

const waitForElements = (selector) => {
    return new Promise((resolve, reject) => {
        const timeout = 5000; // Límite de tiempo en milisegundos
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                clearInterval(interval);
                resolve(elements);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                reject(new Error(`Timeout: No se encontraron elementos para el selector "${selector}" dentro de 5 segundos.`));
            }
        }, 100);
    });
};

const waitForElement = (selector) => {
    return new Promise((resolve, reject) => {
        const timeout = 5000; // Límite de tiempo en milisegundos
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                reject(new Error(`Timeout: No se encontró el elemento para el selector "${selector}" dentro de 5 segundos.`));
            }
        }, 100);
    });
};


(function () {
    'use strict';
    //para el principal
    if (window.self !== window.top || !window.location.href.startsWith(mainURL)) return;
    const capituloSigLink = Array.from(document.querySelectorAll('a'))
    .find(link => link.textContent.includes('Capitulo Siguiente'));
    let curIndex = 0;
    let curPlayer = reproductores[curIndex];
    // Escuchar mensajes de iframes
    window.addEventListener('message', (event) => {
        // Asegúrar origen del mensaje
        console.log(event)
        if (event.origin.startsWith(sudomains[curPlayer]) || event.origin.startsWith(videoListURL)) {
            if (capituloSigLink && event.data === 'next'){
                window.location.href = capituloSigLink.href;
            }
            if (event.data === 'full-size'){
                fullscreen()
            }
            if (event.data === 'fail'){
                curIndex = curIndex < reproductores.length -1 ? curIndex +1 : -1;
                if (curIndex < 0){
                    alert("No hay reproductores disponibles")
                    return
                }
                curPlayer = reproductores[curIndex];
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    iframe.src = iframe.src; // Recarga el iframe
                }
            }
            if (event.data === 'requestCurPlayer'){
                event.source.postMessage({ curPlayer: curPlayer }, event.origin);
            }
        }
    });

    const fullscreen = () => {
        const frame = document.querySelector('iframe');
        if (!frame) return;
        if (frame.style.position ==='fixed'){
            frame.style.position = 'relative';
            frame.style.zIndex = '300';
        }else{
            frame.style.position = 'fixed';
            frame.style.zIndex = '10000';
        }
    }
    window.addEventListener('load', fullscreen);
})();

(function () {
    'use strict';
    // Verifica que se ejecute en la lista de videos
    if (window.self === window.top ||
        !window.location.href.startsWith(videoListURL)||
        !document.referrer.startsWith(mainURL)) return;
    // Solicitar la variable curSelection desde el root
    window.top.postMessage("requestCurPlayer", mainURL);
    window.addEventListener('message', (event) => {
        if (event.origin === mainURL) {
            if (event.data.curPlayer) {
                const curPlayer = event.data.curPlayer;
                const button = document.createElement('button');
                const searchAndClick = async () => {
                    try{
                        console.log(`Buscando el primer <li> con ${curPlayer}...`);
                        const liElements = await waitForElements(`li[onclick*="${curPlayer}"]`);
                        if (liElements.length > 0) {
                            const firstLi = liElements[0];
                            const onclickValue = firstLi.getAttribute('onclick');
                            const urlMatch = onclickValue.match(/'([^']+)'/);
                            // Simular el clic en el primer elemento <li>
                            firstLi.click();
                        } else {
                            console.error(`No se encontró ningún elemento <li> con "${curPlayer}" en este iframe.`);
                        }
                    }catch(error){
                        console.error('Error:',error.message);
                        window.top.postMessage("fail", mainURL);
                    }
                };
                button.addEventListener('click', searchAndClick);
                button.click()
            }
        }
    });
})();


(function () {
    'use strict';
    // Ejecutar dentro del iframe del reproductor
    if (window.self === window.top ||
        !document.referrer.startsWith(videoListURL)) return;
        // Variable global para asegurarse de que solo haya una instancia del botón
    let redirectButtonInstance = null;
    // Función que muestra el botón con la cuenta regresiva y redirige al hacer clic o cuando termina el tiempo
    function showRedirectButton() {
        // Si ya hay un botón, no hacemos nada
        if (redirectButtonInstance) return;

        // Crear el contenedor del botón
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '999999';

        // Crear el botón de "Siguiente Video"
        const button = document.createElement('button');
        button.textContent = 'Siguiente video en 5 segundos';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Crear el botón de cancelación "X"
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'X';
        cancelButton.style.padding = '10px 15px';
        cancelButton.style.backgroundColor = '#ff0000';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '50%';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.marginLeft = '10px';

        // Función que actualiza el texto de cuenta regresiva en el botón
        let countdown = 5;
        const updateButtonText = () => {
            button.textContent = `Siguiente video en ${countdown} segundos`;
            if (countdown === 0) {
                window.top.postMessage('next', mainURL);
            }
            countdown--;
        };

        // Llama a la función de actualización cada segundo
        const intervalId = setInterval(updateButtonText, 1000);

        // Función para cancelar la redirección si se hace clic en "X"
        cancelButton.addEventListener('click', () => {
            clearInterval(intervalId); // Detener la cuenta regresiva
            button.textContent = 'Redirección cancelada';
            button.disabled = true; // Deshabilitar el botón
            cancelButton.disabled = true; // Deshabilitar el botón "X"
        });

        // Función para redirigir al hacer clic en el botón
        button.addEventListener('click', () => {
            clearInterval(intervalId); // Detener la cuenta regresiva si se hace clic
            window.top.postMessage('next', mainURL);
        });

        // Agregar los botones al contenedor y el contenedor al cuerpo de la página
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(cancelButton);
        document.body.appendChild(buttonContainer);

        // Guardar la instancia para evitar que se cree otra
        redirectButtonInstance = buttonContainer;
    }
    // Función para convertir el tiempo en formato 'MM:SS' a segundos
    function timeToSeconds(timeStr) {
        const [minutes, seconds] = timeStr.split(':').map(num => parseInt(num, 10));
        return minutes * 60 + seconds;
    }
    // Función que verifica el tiempo y llama a la función si se cumple la condición
    function checkTime() {
        // Obtén el tiempo del div con clase "jw-text-elapsed"
        const elapsedElement = document.querySelector('.jw-icon.jw-icon-inline.jw-text.jw-reset.jw-text-elapsed')||
              document.querySelector('.plyr__controls__item.plyr__time--current.plyr__time');

        const elapsedTime = elapsedElement ? elapsedElement.textContent.trim() : '00:00';

        // Obtén el tiempo del div con clase "jw-text-duration"
        const durationElement = document.querySelector('.jw-icon.jw-icon-inline.jw-text.jw-reset.jw-text-duration')||
              document.querySelector('.plyr__controls__item.plyr__time--duration.plyr__time')||
              document.querySelector('.vjs-remaining-time-display');
        const durationTime = durationElement && durationElement.textContent.trim()!=='0:00' ? durationElement.textContent.trim() : '10:00';
        // Convierte ambos tiempos a segundos
        const elapsedTimeSeconds = timeToSeconds(elapsedTime);
        const durationTimeSeconds = timeToSeconds(durationTime);

        // Si el tiempo del primer div (elapsed) es igual o mayor al tiempo del segundo div (duration) menos 15 segundos
        if (elapsedTimeSeconds >= (durationTimeSeconds - 20)) {
            showRedirectButton();
        }
    }
    // Solicitar la variable curSelection desde el root
    window.top.postMessage("requestCurPlayer", mainURL);
    window.addEventListener('message', (event) => {
        if (event.origin === mainURL) {
            if (event.data.curPlayer) {
                const curPlayer = event.data.curPlayer;
                if (!window.location.href.startsWith(sudomains[curPlayer])) return;
                const button = document.createElement('button');

                const performActions = async () => {
                    try{
                        await waitForElement('video');
                        const videoElement = document.querySelector('video');
                        if (videoElement) {
                            videoElement.click();
                        } else {
                            console.warn('No se encontró el elemento <video>.');
                        }
                    }catch(error){
                        console.error('Error: ',error.message);
                        window.top.postMessage("fail", mainURL);
                    }
                };
                button.addEventListener('click', performActions);
                button.click()
                const escButton = document.createElement('button');
                escButton.style.position = 'fixed'
                escButton.style.top = '40px';
                escButton.style.right = '10px';
                escButton.style.zIndex = '999999';
                escButton.style.padding = '5px 10px';
                escButton.style.backgroundColor = 'whitesmoke';
                escButton.style.color = '#fff';
                escButton.style.border = 'none';
                escButton.style.borderRadius = '5px';
                escButton.style.cursor = 'pointer';
                escButton.textContent = '❌';
                escButton.addEventListener('click', () => {
                    window.top.postMessage('full-size', mainURL);
                });
                document.body.appendChild(escButton);
                // Llama a la función `checkTime` cada segundo para verificar el tiempo continuamente
                setInterval(checkTime, 1000);
            }
        }
    });
})();

