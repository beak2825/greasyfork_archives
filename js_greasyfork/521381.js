// ==UserScript==
// @name         Uhmegle NSFW Reporter with Auto-Skip
// @namespace    Freebee1693
// @version      1.2.2-GitHub
// @description  A script to detect and report NSFW content on Uhmegle and auto-skip users after a set time.
// @license      Apache License 2.0
// @match        https://uhmegle.com/video*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521381/Uhmegle%20NSFW%20Reporter%20with%20Auto-Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/521381/Uhmegle%20NSFW%20Reporter%20with%20Auto-Skip.meta.js
// ==/UserScript==

const SHOW_INFO = true;
const INFORM_OTHER = false;
const AUTO_SKIP = false;
const AUTO_SKIP_SECONDS = 5;
const CLASSIFY_INTERVAL = 500;

const onnxJs = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@latest/dist/ort.min.js';
const modelPath = 'https://cdn.flawcra.cc/open_nsfw.onnx';
const threshold = 0.7;

let ortSession = null;
let classifyInterval = null;
let isClassificationStarting = false; // Flag to prevent multiple starts
let modelLoaded = false;
const activeClassifications = new Map();
let messageSent = false; // Flag to track if the big message has been sent
let reported = false;
let autoSkipTimeoutId = null; // To manage the auto-skip timer

Date.prototype.addSecs = function (s) {
    this.setTime(this.getTime() + s * 1000);
    return this;
};

(async function loadNsfwReporter() {
    await loadOrt();
    await getModel();

    hookRTCPeerConnection();

    if (AUTO_SKIP) {
        setInterval(() => {
            if (!window.connected) {
                log('Reconnecting...');
                window.pressSkip(false);
            }
            window.starting = 0;
            window.blockNext = false;

            localStorage.removeItem('faceOverlay');
            localStorage.removeItem('lastImg');

            document.querySelector('#faceOverlay')?.remove();
        }, 500);
    }
})();

async function loadOrt() {
    log('Loading ONNX Runtime Web...');

    const script = document.createElement('script');
    script.src = onnxJs;
    document.head.appendChild(script);

    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
    });

    log('Loaded ONNX Runtime Web.');
}

async function getModel() {
    log('Getting NSFW Detection Model...');
    if (ortSession == null) {
        log('Loading NSFW Detection Model...');
        while (!window.hasOwnProperty('ort')) {
            log('Waiting for ONNX Runtime Web...');
            await sleep(500);
        }
        ortSession = await ort.InferenceSession.create(modelPath);
        modelLoaded = true;
        log('Loaded NSFW Detection Model.');
    }
    return ortSession;
}

function hookRTCPeerConnection() {
    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function (...args) {
        const pc = new window.oRTCPeerConnection(...args);
        pc._classifyStarted = false;

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function (iceCandidate, ...rest) {
            if (iceCandidate == null) {
                return pc.oaddIceCandidate(iceCandidate, ...rest);
            }

            if (!pc._classifyStarted) {
                pc._classifyStarted = true;
                startClassification();
                startAutoSkipTimer(); // Start the auto-skip timer
            }

            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };

        pc.addEventListener('connectionstatechange', () => {
            if (pc.connectionState === 'connected') {
                window.connected = true;
                messageSent = false; // Reset the messageSent flag
                reported = false;
                startClassification();
                startAutoSkipTimer(); // Start the auto-skip timer upon connection
            } else if (
                pc.connectionState === 'disconnected' ||
                pc.connectionState === 'failed' ||
                pc.connectionState === 'closed'
            ) {
                window.connected = false;
                stopClassification();
                clearAutoSkipTimer(); // Clear the auto-skip timer when disconnected
            }
        });

        return pc;
    };
}

function startClassification() {
    if (classifyInterval || !modelLoaded || isClassificationStarting) return;

    isClassificationStarting = true; // Prevent multiple starts

    if (window.connected) {
        classify(); // Run the first classification immediately

        classifyInterval = setInterval(() => {
            if (window.connected) {
                classify();
            } else {
                stopClassification(); // Ensure we stop the interval if disconnected
            }
        }, CLASSIFY_INTERVAL);
    }

    isClassificationStarting = false; // Reset the flag after starting
}

function stopClassification() {
    if (classifyInterval) {
        clearInterval(classifyInterval);
        classifyInterval = null;
    }
    isClassificationStarting = false; // Reset the flag
    activeClassifications.clear(); // Clear any active classifications
}

async function classify() {
    const id = window.connectionID;

    if (activeClassifications.has(id)) {
        console.log(`Classification already active for connectionID ${id}`);
        return;
    }

    activeClassifications.set(id, true);

    try {
        let imageData = await getImage();

        if (!imageData) {
            log(`No image data for connectionID ${id}. Retrying...`);
            let attempts = 0;
            const maxAttempts = 5;
            while (!imageData && attempts < maxAttempts) {
                await sleep(500);
                imageData = await getImage();
                attempts++;
            }
            if (!imageData) {
                log(`Failed to get image data after ${attempts} attempts for connectionID ${id}.`);
                return;
            }
        }

        const score = await runModel(imageData);

        if (score == null) {
            log(`Failed to get score for connectionID ${id}.`);
            return;
        }

        if (id !== window.connectionID) {
            log(`ConnectionID changed from ${id} to ${window.connectionID}. Aborting classify.`);
            return;
        }

        if (score >= threshold && !reported) {
            window.socket.send(JSON.stringify({ event: 'report', id: id }));
            log(`Reporting NSFW score of ${score}`);
            reported = true;
            // Immediately skip NSFW users
            log('NSFW content detected. Skipping user...');
            skipUser();
            return;
        }

        if (SHOW_INFO) {
            showInfo(score, threshold);
        }
    } finally {
        activeClassifications.delete(id);
    }
}

function skipUser() {
    clearAutoSkipTimer(); // Clear any existing auto-skip timer
    window.pressSkip(false);
    window.pressSkip(false);
}

function startAutoSkipTimer() {
    clearAutoSkipTimer(); // Ensure no existing timer is running
    if (AUTO_SKIP) {
        autoSkipTimeoutId = setTimeout(() => {
            if (window.connected) {
                log(`Auto-skip time (${AUTO_SKIP_SECONDS}s) reached. Skipping user...`);
                skipUser();
            }
        }, AUTO_SKIP_SECONDS * 1000);
    }
}

function clearAutoSkipTimer() {
    if (autoSkipTimeoutId) {
        clearTimeout(autoSkipTimeoutId);
        autoSkipTimeoutId = null;
    }
}

async function getImage() {
    const remoteVideo = document.querySelector('#remoteVideo');

    if (!remoteVideo) {
        log('Remote video element not found.');
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;

    const ctx = canvas.getContext('2d');

    try {
        ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
    } catch (e) {
        log('Error drawing video frame: ' + e.message);
        return null;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return imageData;
}

async function runModel(imageData) {
    try {
        const inputTensor = await preprocessImage(imageData);
        const feeds = { [ortSession.inputNames[0]]: inputTensor };

        const results = await ortSession.run(feeds);

        const output = results[ortSession.outputNames[0]];

        const nsfwScore = output.data[1];
        const score = parseFloat(nsfwScore.toFixed(4));

        return score;
    } catch (error) {
        console.error('Error running the model:', error);
        return null;
    }
}

async function preprocessImage(imageData) {
    const width = 224;
    const height = 224;
    const data = imageData.data;

    const input = new Float32Array(width * height * 3);

    for (let i = 0; i < width * height; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];

        input[i * 3] = b - 104;
        input[i * 3 + 1] = g - 117;
        input[i * 3 + 2] = r - 123;
    }

    return new ort.Tensor('float32', input, [1, 224, 224, 3]);
}

function showInfo(score, threshold) {
    const messageInput = document.querySelector('.messageInput');
    if (!messageInput) return;

    if (!messageSent) {
        const humanScore = `${(score * 100).toFixed(2)}%`;
        const humanThreshold = `${(threshold * 100).toFixed(2)}%`;

        messageSent = true;

        let msg = `User has NSFW score of ${humanScore}.`;

        if (score >= threshold) {
            msg = `${msg} Reporting...`;
        }

        log(msg);
        if(!INFORM_OTHER) return;
        const message = `Hi! 🚨 Please be aware that inappropriate content is not allowed on this platform. If detected, it may be reported.

Your content has an NSFW score of ${humanScore}. Scores above ${humanThreshold} may be reported to keep the community safe. Monitoring will continue in the background.

This is an automated message. If you believe this is a mistake, please ensure your camera is clear of any inappropriate content.${AUTO_SKIP ? "\n\nI'll be disconnecting in " + AUTO_SKIP_SECONDS + " seconds." : ""}`;

        messageInput.value = message;
        window.sendMessage();
    }
}

function log(data) {
    console.log(data);
    addMessage(data);
}

function addMessage(msg) {
    const logbox = document.querySelector('#mainMessages');
    const div = document.createElement('div');
    div.setAttribute('class', 'information');
    const p = document.createElement('p');
    p.setAttribute('class', 'statuslog');
    p.innerHTML = msg;
    div.appendChild(p);
    logbox.appendChild(div);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener('beforeunload', () => {
    stopClassification();
    clearAutoSkipTimer();
});
