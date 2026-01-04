// ==UserScript==
// @name         PlayerCam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aktiviert die vierte Webcam, um den Spieler anzuzeigen.
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522419/PlayerCam.user.js
// @updateURL https://update.greasyfork.org/scripts/522419/PlayerCam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generiere den Button auf der Spieloberfläche
    const button = document.createElement('button');
    button.id = 'playerCam';
    button.textContent = 'PlayerCam';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    // Videoelement für die Webcam-Ansicht erstellen
    const videoElement = document.createElement('video');
    videoElement.style.position = 'fixed';
    videoElement.style.bottom = '70px';
    videoElement.style.right = '20px';
    videoElement.style.width = '320px';
    videoElement.style.height = '240px';
    videoElement.style.border = '1px solid #000';
    videoElement.style.zIndex = '1000';
    videoElement.style.display = 'none'; // Standardmäßig ausgeblendet

    document.body.appendChild(videoElement);

    // Funktion zur Webcam-Aktivierung
    async function activateWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { exact: 320 },
                    height: { exact: 240 },
                    frameRate: { max: 10 } // Minimale Datenmenge
                },
                audio: false // Kein Audio
            });

            // Stream auf das Videoelement legen
            videoElement.srcObject = stream;
            videoElement.play();
            videoElement.style.display = 'block';
        } catch (error) {
            console.error('Konnte die Webcam nicht aktivieren:', error);
            alert('Fehler beim Zugriff auf die Webcam. Bitte Berechtigungen überprüfen.');
        }
    }

    // Klick-Event für den Button
    button.addEventListener('click', () => {
        if (videoElement.style.display === 'none') {
            activateWebcam();
        } else {
            // Webcam deaktivieren
            const stream = videoElement.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            videoElement.srcObject = null;
            videoElement.style.display = 'none';
        }
    });
})();
