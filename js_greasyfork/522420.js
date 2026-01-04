// ==UserScript==
// @name         Fourth Webcam Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aktiviert die vierte angeschlossene Webcam und öffnet ein eigenes Browserfenster, das das Bild der Kamera anzeigt.
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522420/Fourth%20Webcam%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/522420/Fourth%20Webcam%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedDeviceId = null;

    // Funktion zur Ermittlung der Kameras
    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices.length > 3) {
                selectedDeviceId = videoDevices[3].deviceId; // Vierte Kamera auswählen
                activateWebcam();
            } else {
                alert('Nicht genug Kameras angeschlossen.');
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Kameras:', error);
        }
    }

    // Webcam aktivieren und in eigenem Fenster anzeigen
    async function activateWebcam() {
        if (!selectedDeviceId) {
            console.log('Keine vierte Kamera verfügbar.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: selectedDeviceId },
                    width: { exact: 320 },
                    height: { exact: 240 },
                    frameRate: { max: 10 }
                },
                audio: false
            });

            // Neues Fenster öffnen und Stream anzeigen
            const cameraWindow = window.open('', '_blank', 'width=340,height=260');
            if (cameraWindow) {
                const cameraVideo = cameraWindow.document.createElement('video');
                cameraVideo.style.width = '320px';
                cameraVideo.style.height = '240px';
                cameraVideo.autoplay = true;
                cameraVideo.srcObject = stream;
                cameraWindow.document.body.appendChild(cameraVideo);

                cameraWindow.onbeforeunload = () => {
                    stream.getTracks().forEach(track => track.stop());
                };
            } else {
                alert('Pop-up Blocker deaktivieren, um das Kamerafenster zu öffnen.');
            }
        } catch (error) {
            console.error('Konnte die Webcam nicht aktivieren:', error);
        }
    }

    // Kameras ermitteln und aktivieren
    getCameras();
})();
