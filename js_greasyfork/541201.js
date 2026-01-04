// ==UserScript==
// @name         Recorder
// @version      0.1
// @description  Record up to 10 seconds of gameplay
// @author       _VicKy_
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @namespace https://greasyfork.org/users/805514
// @downloadURL https://update.greasyfork.org/scripts/541201/Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/541201/Recorder.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let bufferRecorder;
    let manualRecorder;
    let recording = false;
    let recordedChunks = [];
    let recordingAnimation;
    const maxBufferDuration = 10000; // 10 seconds in milliseconds

    // Generate random 8-character filename
    function generateFilename() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let filename = "";
        for (let i = 0; i < 8; i++) {
            filename += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return filename + ".webm";
    }

    // Create record button with animation capabilities
    const recordButton = document.createElement("div");
    recordButton.id = "recordButton";
    recordButton.className = "uiElement gameButton";
    recordButton.innerHTML = `<i class="material-icons" style="font-size:40px;vertical-align:middle;">play_arrow</i>`;
    recordButton.style.position = "absolute";
    recordButton.style.right = "450px";
    recordButton.style.transition = "background-color 0.5s ease";
    document.getElementById("gameUI").appendChild(recordButton);
    let canvas = document.getElementById("gameCanvas");

    // Start/stop recording animation
    function toggleRecordingAnimation(on) {
        if (on) {
            // Create white square (same size as play icon)
            recordButton.innerHTML = `
                <div style="
                    width: 40px;
                    height: 40px;
                    background-color: white;
                    margin: 0 auto;
                    transition: background-color 0.5s ease, box-shadow 0.5s ease;
                    border-radius: 4px;
                "></div>
            `;
            const square = recordButton.firstChild;
            
            // Start pulsing animation
            recordingAnimation = setInterval(() => {
                const isRed = square.style.backgroundColor === "rgb(255, 0, 0)";
                square.style.backgroundColor = isRed ? "white" : "red";
                square.style.boxShadow = isRed ? "none" : "0 0 10px red";
            }, 500);
        } else {
            if (recordingAnimation) {
                clearInterval(recordingAnimation);
                recordingAnimation = null;
            }
            // Restore play icon
            recordButton.innerHTML = `<i class="material-icons" style="font-size:40px;vertical-align:middle;">play_arrow</i>`;
        }
    }

    // Start continuous buffering (stores last 10 seconds)
    function startBufferRecording(canvas) {
        try {
            const stream = canvas.captureStream(30);
            bufferRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm"
            });
            
            bufferRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                    // Remove old chunks to keep approximately 10 seconds
                    while (recordedChunks.length > 1 && 
                           recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0) > 5000000) { // ~10s estimate
                        recordedChunks.shift();
                    }
                }
            };
            bufferRecorder.start(1000); // Request data every second
        } catch (e) {
            console.error("Error starting buffer recording:", e);
        }
    }

    // Start a standard 10-second recording
    function startManualRecording(canvas) {
        try {
            // Stop the buffer recorder while manual recording is active
            if (bufferRecorder && bufferRecorder.state !== 'inactive') {
                bufferRecorder.stop();
            }

            const stream = canvas.captureStream(30);
            manualRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm"
            });
            
            // Use fresh chunks array for manual recording
            let manualChunks = [];
            manualRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    manualChunks.push(event.data);
                }
            };
            
            manualRecorder.onstop = () => {
                saveRecording(manualChunks);
                // Restart buffer recording after manual recording is done
                startBufferRecording(canvas);
                toggleRecordingAnimation(false);
            };
            
            manualRecorder.start();
            recording = true;
            toggleRecordingAnimation(true);

            // Auto-stop after 10 seconds
            setTimeout(() => {
                if (recording && manualRecorder && manualRecorder.state === 'recording') {
                    stopRecording();
                }
            }, maxBufferDuration);
        } catch (e) {
            console.error("Error starting manual recording:", e);
            toggleRecordingAnimation(false);
        }
    }

    // Stop manual recording
    function stopRecording() {
        if (manualRecorder && manualRecorder.state === 'recording') {
            manualRecorder.stop();
            recording = false;
        }
    }

    // Save the recording
    function saveRecording(chunks) {
        if (!chunks || chunks.length === 0) return;
        
        try {
            const filename = generateFilename();
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (e) {
            console.error("Error saving recording:", e);
        }
    }

    // Start buffer recording when page loads
    if (canvas) {
        startBufferRecording(canvas);
    } else {
        // Wait for canvas to be available
        const observer = new MutationObserver(() => {
            const gameCanvas = document.getElementById("gameCanvas");
            if (gameCanvas) {
                observer.disconnect();
                startBufferRecording(gameCanvas);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Button click handler
    recordButton.addEventListener("click", function() {
        if (!canvas) canvas = document.getElementById("gameCanvas");
        if (!canvas) return;
        
        if (recording) {
            stopRecording();
        } else {
            startManualRecording(canvas);
        }
    });
})();