// ==UserScript==
// @name         Sploop.io Video Recorder
// @namespace    -
// @version      -
// @description  defered
// @author       vi=6
// @match        *://sploop.io/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/recordrtc@5.6.0/RecordRTC.min.js
// @downloadURL https://update.greasyfork.org/scripts/506134/Sploopio%20Video%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/506134/Sploopio%20Video%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mediaRecorder;
    let recordedChunks = [];
    let stream;
    let menuVisible = false;
    let menuDiv;

    console.log('Enjoy Recording')

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('tabRecorderSettings')) || {};
        document.getElementById('resolution').value = settings.resolution || '1920x1080';
        document.getElementById('frameRate').value = settings.frameRate || 60;
        document.getElementById('bitrate').value = settings.bitrate || 1500;
        document.getElementById('format').value = settings.format || 'mp4';
        document.getElementById('codec').value = settings.codec || 'vp8';
        document.getElementById('audio').checked = settings.audio !== undefined ? settings.audio : true;
    }

    function saveSettings() {
        const settings = {
            resolution: document.getElementById('resolution').value,
            frameRate: parseInt(document.getElementById('frameRate').value),
            bitrate: parseInt(document.getElementById('bitrate').value),
            format: document.getElementById('format').value,
            codec: document.getElementById('codec').value,
            audio: document.getElementById('audio').checked
        };
        localStorage.setItem('tabRecorderSettings', JSON.stringify(settings));
        alert('Settings applied');
    }

    function createMenu() {
        menuDiv = document.createElement('div');
        menuDiv.id = 'customization-menu';
        menuDiv.style.position = 'fixed';
        menuDiv.style.top = '10px';
        menuDiv.style.right = '10px';
        menuDiv.style.width = '400px';
        menuDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        menuDiv.style.color = 'white';
        menuDiv.style.padding = '15px';
        menuDiv.style.borderRadius = '10px';
        menuDiv.style.border = '1px solid white';
        menuDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        menuDiv.style.display = 'none';
        menuDiv.style.zIndex = '10000';
        menuDiv.style.textAlign = 'center';

        menuDiv.innerHTML = `
            <h3 style ='margin-bottom: 10px'>Video Settings -</h3>
            <label for="resolution">Resolution:</label>
            <select id="resolution">
                <option value="1920x1080">1920x1080</option>
                <option value="1280x720">1280x720</option>
                <option value="640x480">640x480</option>
            </select><br><br>

            <label for="frameRate">Frame Rate:</label>
            <input type="number" id="frameRate" min="1" max="60"><br><br>

            <label for="bitrate">Bitrate (kbps):</label>
            <input type="number" id="bitrate" min="100" max="50000"><br><br>

            <label for="format">Format:</label>
            <select id="format">
                <option value="webm">WebM</option>
                <option value="mp4">MP4</option>
            </select><br><br>

            <label for="codec">Codec:</label>
            <select id="codec">
                <option value="vp8">VP8</option>
                <option value="vp9">VP9</option>
                <option value="h264">H.264 (WebM only)</option>
            </select><br><br>

            <label for="audio">Include Audio:</label>
            <input type="checkbox" id="audio"><br><br>

            <button id="applySettings">Apply Settings</button>
            <button id="closeMenu">Close</button>
            <div style = 'font-size: 12px; margin-top: 8px;'> vi=6 </div>
        `;

        document.body.appendChild(menuDiv);

        // Load settings when menu is created
        loadSettings();

        // Add event listeners for buttons
        document.getElementById('applySettings').addEventListener('click', saveSettings);
        document.getElementById('closeMenu').addEventListener('click', toggleMenu);
    }

    function toggleMenu() {
        menuVisible = !menuVisible;
        menuDiv.style.display = menuVisible ? 'block' : 'none';
    }

    function startRecording() {
        const settings = JSON.parse(localStorage.getItem('tabRecorderSettings')) || {};
        const resolution = settings.resolution ? settings.resolution.split('x') : ['1920', '1080'];
        const width = parseInt(resolution[0]);
        const height = parseInt(resolution[1]);
        const frameRate = settings.frameRate || 60;
        const bitrate = (settings.bitrate || 1000) * 1000;
        const format = settings.format || 'mp4';
        const codec = settings.codec || 'vp8';
        const audio = settings.audio !== undefined ? settings.audio : true;

        const videoOptions = { width, height };
        const constraints = { video: videoOptions };

        if (audio) {
            constraints.audio = true;
        }

        navigator.mediaDevices.getDisplayMedia(constraints).then(s => {
            stream = s;

            const mimeType = format === 'mp4' ? `video/${format}` : `video/${format}; codecs=${codec}`;
            mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const tabTitle = document.title.replace(/[\/\\:*?"<>|]/g, '');
                a.style.display = 'none';
                a.href = url;
                a.download = `${tabTitle}.${format}`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);

                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                recordedChunks = [];
            };

            mediaRecorder.start();
            alert('Recording started');
        }).catch(err => {
            console.error('Error accessing display media.', err);
        });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            alert('Recording stopped and saved')
        } else {
            alert('No active recording to stop');
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === ']') {
            startRecording();
        }
        if (event.key === '[') {
            stopRecording();
        }
        if (event.key === 'l') {
            toggleMenu();
        }
    });

    createMenu();
})();
