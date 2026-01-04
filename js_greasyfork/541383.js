// ==UserScript==
// @name         foenemegle - uhmegle bypasses & patches
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description
// @author
// @match        https://uhmegle.com/video*
// @license      MIT
// @grant        none
// @run-at       document-start
// @description Uhmegle bypasses, uhmegle no camera, uhmegle black screen bypass, uhmegle hack
// @downloadURL https://update.greasyfork.org/scripts/541383/foenemegle%20-%20uhmegle%20bypasses%20%20patches.user.js
// @updateURL https://update.greasyfork.org/scripts/541383/foenemegle%20-%20uhmegle%20bypasses%20%20patches.meta.js
// ==/UserScript==
(() => {
    'use strict';

    const CONFIG = {
        imageURL: 'https://i.imgur.com/ghjBrek.png',
        fallbackImageURL: 'https://i.imgur.com/ghjBrek.png',
        canvasSize: {
            width: 640,
            height: 480
        },
        spoofedDevices: {
            video: {
                deviceId: "uf5_vid_" + Math.random().toString(36).substr(2, 9),
                kind: "videoinput",
                label: "HD Pro Webcam C920",
                groupId: "uf5_group_vid"
            },
            audioIn: {
                deviceId: "uf5_aud_in_" + Math.random().toString(36).substr(2, 9),
                kind: "audioinput",
                label: "Default - Microphone (Realtek Audio)",
                groupId: "uf5_group_aud"
            },
        },
        scriptVersion: "V5.7",
        debugMode: false,
        clippingEnabled: true,
        defaultClipDuration: 30,
        clipLayout: 'side-by-side',
        clipMimeType: 'video/webm; codecs=vp9,opus',
        maxHistory: 20,
    };
    let _audioconfig = {
        rawMode: true
    };

    let scriptState = {
        logs: [],
        imstore: {},
        fakeFrameCanvas: null,
        perturbedCanvas: null,
        realDevices: [],
        managementUI: null,
        originalMethods: {},
        bypassStatus: {
            deviceSpoof: false,
            cameraBypass: false,
            afkBypass: false,
            fingerprintBypass: false,
            websocketIntercept: false,
            broadcastChannel: false,
            faceDetection: false,
            varianceBypass: false
        },
        isInitialized: false,
        deviceSpoofEnabled: false,
        forceRelay: true,
        removeWatermark: true,
        clippingManager: null,
        savedConnections: [],
        currentPartnerInfo: {
            ip: null,
            type: null
        },
        csesh: null,
        resetPartnerInfo: () => {
            log('Resetting current partner info.', 'debug');
            scriptState.currentPartnerInfo = {
                ip: null,
                type: null
            };
        }
    };

    const log = (message, type = "info", context = null) => {
        if (!CONFIG.debugMode && type === "debug") return;
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message: String(message),
            type,
            context
        };
        scriptState.logs.push(logEntry);
        if (scriptState.logs.length > 200) scriptState.logs.shift();

        const prefix = `[U-Fix ${CONFIG.scriptVersion}]`;
        const style = {
            error: 'color: #F44336; font-weight: bold;',
            warn: 'color: #FF9800;',
            success: 'color: #4CAF50; font-weight: bold;',
            info: 'color: #2196F3;',
            debug: 'color: #9E9E9E; font-style: italic;'
        }[type] || '';
        console.log(`%c${prefix} ${message}`, style, context || '');
        if (scriptState.managementUI?.isVisible) scriptState.managementUI.updateLogs();
    };

    const createNativeWrapper = (originalFunc, newFunc) => {
        const wrapper = function (...args) {
            return newFunc.call(this, originalFunc, ...args);
        };
        Object.defineProperty(wrapper, 'toString', {
            value: () => Function.prototype.toString.call(originalFunc),
            enumerable: false,
            configurable: true
        });
        return wrapper;
    };

    const ICONS = {

        close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        status: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
        devices: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`,
        history: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
        power: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-3 14h3l-3 8 11-14h-5l3-8z"></path></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        logs: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        flipCam: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2.7A2 2 0 0 1 3.5 1h17a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3.5a2 2 0 0 1-2-1.3"></path><path d="M15 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path><path d="m13.3 16.5-.4-2.5h-2l-.4 2.5"></path><path d="M12 14v-2"></path><path d="M8.5 2v20"></path><path d="m16 9 3-3-3-3"></path></svg>`,
        clapper: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 6 3.8 6.8A2 2 0 0 0 2 8.75v10.5A2 2 0 0 0 3.8 21.1l16.4-.8a2 2 0 0 0 1.8-1.95V8a2 2 0 0 0-1.8-2Z"/><path d="m.9 5.2 3.2-1.6 16.5.9-3.3 1.5Z"/><path d="m8 13 4-2.5"/><path d="m12.5 16 -5-2.5"/><path d="m8 18 4-2.5"/></svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
        globe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        zap: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22"/></svg>`,
    };

    class PeerConnectionInterceptor {

        static #POLL_INTERVAL_MS = 100;
        static #POLL_TIMEOUT_MS = 5000;

        static #extractPartnerInfoFromStats(stats) {
            for (const stat of stats.values()) {
                if (stat.type === 'candidate-pair' && stat.state === 'succeeded' && stat.remoteCandidateId) {
                    const remoteCandidate = stats.get(stat.remoteCandidateId);
                    if (remoteCandidate && remoteCandidate.ip) {
                        return {
                            ip: remoteCandidate.ip,
                            type: remoteCandidate.candidateType
                        };
                    }
                }
            }
            return null;
        }

        static #waitForSessionAndAssignIP(partnerInfo) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const intervalId = setInterval(() => {
                    if (Date.now() - startTime > this.#POLL_TIMEOUT_MS) {
                        clearInterval(intervalId);
                        log(`Timed out after ${this.#POLL_TIMEOUT_MS / 1000}s waiting for session to assign IP.`, 'warn');
                        reject(new Error('Session assignment timed out.'));
                        return;
                    }

                    const currentSession = window.savedConnections?.find(s => s.connid === window.connectionID);

                    if (currentSession) {
                        clearInterval(intervalId);
                        if (!currentSession.ip) {
                            currentSession.ip = {
                                ...partnerInfo
                            };
                        }
                        log(`Assigned IP info to session: ${currentSession.connid}`, 'debug');

                        if (scriptState.managementUI?.isVisible) {
                            scriptState.managementUI.updateConnectionHistory();
                        }
                        resolve();
                    }
                }, this.#POLL_INTERVAL_MS);
            });
        }

        static initialize() {
            if (window.RTCPeerConnection.isPatchedByUFix) return;

            const OriginalRTCPeerConnection = window.RTCPeerConnection;

            window.RTCPeerConnection = function (...args) {
                const pc = new OriginalRTCPeerConnection(...args);

                pc.addEventListener('connectionstatechange', async () => {
                    if (pc.connectionState === 'connected') {
                        try {
                            const stats = await pc.getStats();
                            const partnerInfo = PeerConnectionInterceptor.#extractPartnerInfoFromStats(stats);

                            if (partnerInfo) {
                                scriptState.currentPartnerInfo = partnerInfo;
                                log(`Partner connected: IP=${partnerInfo.ip}, Type=${partnerInfo.type}`, 'success');

                                await PeerConnectionInterceptor.#waitForSessionAndAssignIP(partnerInfo);
                            }
                        } catch (e) {
                            log('Error processing partner connection info.', 'warn', e);
                        }
                    }
                });
                pc.addEventListener('track', (event) => {
                    if (event.track.kind === 'video') {
                        const remoteVideo = document.getElementById('remoteVideo');

                        if (remoteVideo.srcObject !== event.streams[0]) {
                            remoteVideo.srcObject = event.streams[0];
                            log('Remote video stream attached.', 'info');
                        }

                        remoteVideo.addEventListener('playing', () => {

                        }, {
                            once: true
                        });
                    }
                });
                return pc;
            };

            window.RTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
            window.RTCPeerConnection.isPatchedByUFix = true;
            scriptState.bypassStatus.peerConnectionIntercept = true;
            log('PeerConnection Interceptor Initialized.', 'success');
        }
    }

    class ClippingManager {
        constructor() {
            this.activeRecorder = null;
            this.activeAnimationId = null;
            this.activeAudioContext = null;
        }
        stopCurrentRecording() {

            if (this.activeRecorder?.state === 'recording') {
                log('Stopping active recording session.', 'debug');
                this.activeRecorder.stop();
            }
            if (this.activeAnimationId) cancelAnimationFrame(this.activeAnimationId);
            if (this.activeAudioContext?.state !== 'closed') this.activeAudioContext.close();
            this.activeRecorder = this.activeAnimationId = this.activeAudioContext = null;
        }
        startNewRecording(sessionId) {
            if (!CONFIG.clippingEnabled) return;
            if (this.activeRecorder) {
                this.stopCurrentRecording();
            }
            const localVideo = document.getElementById('localVideo');
            const remoteVideo = document.getElementById('remoteVideo');
            if (!localVideo?.srcObject || !remoteVideo?.srcObject) {
                log('Cannot start recording, streams not ready.', 'warn');
                return;
            }

            try {
                const canvas = document.createElement('canvas');
                canvas.width = CONFIG.clipLayout === 'remote-only' ? 640 : 1280;
                canvas.height = 480;
                const ctx = canvas.getContext('2d');

                this.activeAudioContext = new AudioContext();
                const audioDestination = this.activeAudioContext.createMediaStreamDestination();
                [localVideo, remoteVideo].forEach(v => {
                    v.srcObject.getAudioTracks().forEach(track => {
                        const source = this.activeAudioContext.createMediaStreamSource(new MediaStream([track.clone()]));
                        source.connect(audioDestination);
                    });
                });

                const canvasStream = canvas.captureStream(30);
                audioDestination.stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

                const recordedChunks = [];
                const mediaRecorder = new MediaRecorder(canvasStream, {
                    mimeType: CONFIG.clipMimeType
                });
                this.activeRecorder = mediaRecorder;

                const updateCanvasFrame = () => {
                    if (mediaRecorder.state !== 'recording') return;
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    if (CONFIG.clipLayout === 'side-by-side') {
                        if (localVideo.videoWidth > 0) ctx.drawImage(localVideo, 0, 0, canvas.width / 2, canvas.height);
                        if (remoteVideo.videoWidth > 0) ctx.drawImage(remoteVideo, canvas.width / 2, 0, canvas.width / 2, canvas.height);
                    } else {
                        if (remoteVideo.videoWidth > 0) ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
                    }
                    this.activeAnimationId = requestAnimationFrame(updateCanvasFrame);
                };

                mediaRecorder.ondataavailable = e => {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                        const maxChunks = CONFIG.defaultClipDuration + 5;
                        if (recordedChunks.length > maxChunks) recordedChunks.splice(0, recordedChunks.length - maxChunks);
                    }
                };

                mediaRecorder.onstop = () => {
                    const session = window.savedConnections.find(s => s.connid === sessionId);
                    if (!session) return;
                    if (recordedChunks.length > 0) {
                        const finalBlob = new Blob(recordedChunks, {
                            type: mediaRecorder.mimeType
                        });
                        if (session.clip.url) URL.revokeObjectURL(session.clip.url);
                        session.clip = {
                            blob: finalBlob,
                            url: URL.createObjectURL(finalBlob),
                            status: 'available',
                            timestamp: new Date()
                        };
                        log(`Clip saved for session ${session.connid}. Size: ${(finalBlob.size / 1024 / 1024).toFixed(2)} MB`, 'success');
                    } else {
                        session.clip.status = 'none';
                        log(`No data recorded for session ${sessionId}, clip discarded.`, 'warn');
                    }
                    canvasStream.getTracks().forEach(t => t.stop());
                    if (scriptState.managementUI) scriptState.managementUI.updateConnectionHistory();
                };

                mediaRecorder.start(1000);
                this.activeAnimationId = requestAnimationFrame(updateCanvasFrame);
                log(`Rolling clip buffer started for session ${sessionId}.`, 'success');
            } catch (e) {
                log('Failed to start new recording session.', 'error', e);
                this.stopCurrentRecording();
            }
        }
    }

    class SessionDataCollector {
        static initialize() {
            log('Session Data Collector starting...', 'info');
            const observer = new MutationObserver((mutations, obs) => {
                const remoteVideo = document.getElementById('remoteVideo');
                if (remoteVideo && !remoteVideo.isHookedByUFix) {
                    this.augmentMetadataHook(remoteVideo);
                    remoteVideo.isHookedByUFix = true;
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        static augmentMetadataHook(remoteVideo) {
            log('Remote video found. Augmenting onloadedmetadata.', 'debug');
            const originalOnLoadedMetadata = remoteVideo.onloadedmetadata;

            remoteVideo.onloadedmetadata = (...args) => {

                if (typeof originalOnLoadedMetadata === 'function') originalOnLoadedMetadata.apply(remoteVideo, args);

                setTimeout(() => {

                    const currentSession = window.savedConnections?.find(s => s.connid === window.connectionID);

                    if (currentSession && !currentSession.clip) {
                        log(`Augmenting new session: ${currentSession.connid}`, 'debug');
                        currentSession.timestamp = new Date();
                        currentSession.ip = {
                            ...scriptState.currentPartnerInfo
                        };
                        currentSession.clip = {
                            blob: null,
                            url: null,
                            status: 'recording'
                        };
                        scriptState.csesh = currentSession.connid
                        scriptState.clippingManager.startNewRecording(currentSession.connid);
                        if (scriptState.managementUI?.isVisible) scriptState.managementUI.updateConnectionHistory();
                    }
                }, 150);
            };
        }
    }

    class ManagementUI {
        constructor() {

            this.isVisible = false;
            this.container = null;
            this.currentTab = 'status';
            this.createUI();
        }
        createUI() {

            this.container = document.createElement('div');
            this.container.id = 'uhmegle-management-ui';
            this.createStyles();
            this.createHTML();
            document.body.appendChild(this.container);
            this.renderTabs();
            this.setupEventListeners();
            this.makeDraggable();
            this.switchTab(this.currentTab);
        }
        createStyles() {
            document.head.insertAdjacentHTML('beforeend', `<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --glass-bg: rgba(15, 17, 23, 0.85);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-highlight: rgba(255, 255, 255, 0.04);
    --primary: #00d4ff;
    --primary-hover: #00b8e6;
    --primary-glow: rgba(0, 212, 255, 0.15);
    --accent: #6c5ce7;
    --accent-hover: #5a4fcf;
    --success: #00c851;
    --success-hover: #00a043;
    --warning: #ffbb33;
    --danger: #ff4757;
    --danger-hover: #ff3742;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    --surface: rgba(30, 35, 45, 0.7);
    --surface-hover: rgba(40, 45, 55, 0.8);
    --surface-active: rgba(50, 55, 65, 0.9);
    --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.12);
    --shadow-medium: 0 8px 32px rgba(0, 0, 0, 0.18);
    --shadow-strong: 0 16px 48px rgba(0, 0, 0, 0.25);
}

#uhmegle-management-ui {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 680px;
    max-height: 88vh;
    background: var(--glass-bg);
    backdrop-filter: blur(24px) saturate(200%);
    -webkit-backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 400;
    z-index: 999999;
    box-shadow: var(--shadow-strong);
    display: none;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    opacity: 0;
    transform: scale(0.92) translateY(-10px);
    transition: opacity .3s cubic-bezier(.4, 0, .2, 1), transform .3s cubic-bezier(.4, 0, .2, 1);
}

#uhmegle-management-ui.visible {
    display: flex;
    opacity: 1;
    transform: scale(1) translateY(0);
}

.ui-header {
    background: linear-gradient(135deg, var(--surface) 0%, rgba(20, 25, 35, 0.8) 100%);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    border-bottom: 1px solid var(--glass-border);
    position: relative;
    flex-shrink: 0;
}

.ui-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary), transparent);
    opacity: .3;
}

.ui-header h3 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.ui-header h3 .version-tag {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ui-header .close-btn {
    cursor: pointer;
    color: var(--text-muted);
    transition: all .3s ease;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.ui-header .close-btn:hover {
    color: var(--text-primary);
    background: var(--glass-highlight);
    transform: rotate(90deg) scale(1.1);
}

.ui-tabs {
    background: transparent;
    display: flex;
    padding: 12px 16px 0;
    gap: 4px;
    flex-shrink: 0;
}

.tab-btn {
    flex: 1;
    padding: 12px 16px;
    background: transparent;
    color: var(--text-muted);
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 12px;
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
    position: relative;
    overflow: hidden;
}

.tab-btn::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 70%;
    height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    border-radius: 1px;
    transition: transform .3s ease;
}

.tab-btn.active {
    color: var(--text-primary);
    background: var(--glass-highlight);
    box-shadow: inset 0 1px 0 var(--glass-border);
}

.tab-btn.active::before {
    transform: translateX(-50%) scaleX(1);
}

.tab-btn:hover:not(.active) {
    color: var(--text-secondary);
    background: rgba(255, 255, 255, 0.02);
}

.tab-btn svg {
    width: 16px;
    height: 16px;
}

.ui-content {
    padding: 24px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--glass-border) transparent;
}

.ui-content::-webkit-scrollbar {
    width: 6px;
}

.ui-content::-webkit-scrollbar-track {
    background: transparent;
}

.ui-content::-webkit-scrollbar-thumb {
    background: var(--glass-border);
    border-radius: 3px;
}

.control-group {
    background: var(--surface);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-soft);
    transition: all .3s ease;
    position: relative;
    overflow: hidden;
}

.control-group:last-child {
    margin-bottom: 0;
}

.control-group h4 {
    margin: 0 0 16px;
    color: var(--primary);
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-group h4::before {
    content: '';
    width: 3px;
    height: 12px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 2px;
}

.control-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    padding: 4px 0;
}

.control-item:last-child {
    margin-bottom: 0;
}

.control-item label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-secondary);
}

.tooltip {
    position: relative;
    display: inline-flex;
    cursor: pointer;
    color: var(--text-muted);
    transition: color .2s ease;
}

.tooltip:hover {
    color: var(--text-secondary);
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 240px;
    background: rgba(10, 12, 18, 0.95);
    backdrop-filter: blur(16px);
    color: var(--text-primary);
    text-align: left;
    border-radius: 12px;
    padding: 12px 16px;
    position: absolute;
    z-index: 1;
    bottom: 140%;
    left: 50%;
    margin-left: -120px;
    opacity: 0;
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
    font-size: 12px;
    line-height: 1.4;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-medium);
    transform: translateY(4px);
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
}

.status-indicator span:last-child {
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
}

.status-indicator .active {
    color: #fff;
    background-color: var(--success);
    box-shadow: 0 2px 8px rgba(0, 200, 81, 0.3);
}

.status-indicator .inactive {
    color: #fff;
    background-color: var(--danger);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.device-list .device-item {
    padding: 16px;
    margin: 8px 0;
    background: var(--glass-highlight);
    border-radius: 12px;
    cursor: pointer;
    border-left: 3px solid var(--glass-border);
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
    font-weight: 500;
    color: var(--text-secondary);
}

.device-list .device-item:hover {
    background: var(--surface-hover);
    border-left-color: var(--text-muted);
    transform: translateX(2px);
}

.device-list .device-item.selected {
    border-left-color: var(--primary);
    background: var(--primary-glow);
    color: var(--text-primary);
}

input[type=text],
select {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text-primary);
    margin-top: 6px;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 14px;
    transition: all .3s ease;
    backdrop-filter: blur(8px);
}

input[type=text]:focus,
select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-glow);
}

select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 16px top 50%;
    background-size: 12px auto;
    padding-right: 44px;
}

.btn,
a.btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    transition: all .3s cubic-bezier(.4, 0, .2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    position: relative;
    overflow: hidden;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left .5s ease;
}

.btn:hover::before {
    left: 100%;
}

.btn:disabled {
    background: var(--surface) !important;
    color: var(--text-muted) !important;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-hover));
    color: #fff;
    box-shadow: 0 4px 16px var(--primary-glow);
}

.btn-primary:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--primary-glow);
}

.btn-secondary {
    background: var(--surface);
    color: var(--text-secondary);
    border: 1px solid var(--glass-border);
}

.btn-secondary:not(:disabled):hover {
    background: var(--surface-hover);
    color: var(--text-primary);
    border-color: var(--glass-highlight);
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
}

.btn-danger {
    background: linear-gradient(135deg, var(--danger), var(--danger-hover));
    color: #fff;
    box-shadow: 0 4px 16px rgba(255, 71, 87, 0.2);
}

.btn-danger:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 71, 87, 0.3);
}

.btn-review {
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    color: #fff;
    box-shadow: 0 4px 16px rgba(108, 92, 231, 0.2);
}

.btn-review:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(108, 92, 231, 0.3);
}

.log-container {
    background: rgba(0, 0, 0, 0.6);
    padding: 16px;
    border-radius: 12px;
    font-family: 'SF Mono', 'JetBrains Mono', 'Courier New', monospace;
    font-size: 11px;
    max-height: 320px;
    overflow-y: auto;
    border: 1px solid var(--glass-border);
    line-height: 1.6;
    color: var(--text-secondary);
    backdrop-filter: blur(8px);
}

#connection-history {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.session-history-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--surface);
    padding: 20px;
    border-radius: 16px;
    border: 1px solid var(--glass-border);
    transition: all .3s ease;
}

.session-main-content {
    display: flex;
    gap: 16px;
}

.session-history-item img {
    width: 100px;
    height: 75px;
    border-radius: 12px;
    object-fit: cover;
    border: 1px solid var(--glass-border);
    flex-shrink: 0;
    background: #000;
}

.session-history-details {
    flex: 1;
    min-width: 0;
}

.session-history-details .country {
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
}

.session-history-details .timestamp {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 6px;
}

.session-ip-info {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 8px 14px;
    margin-top: 12px;
    font-size: 11px;
    font-family: 'SF Mono', 'JetBrains Mono', 'Courier New', monospace;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid var(--glass-border);
}

.session-ip-info .conn-type {
    font-weight: 600;
}

.session-ip-info .conn-p2p {
    color: var(--danger);
}

.session-ip-info .conn-relay {
    color: var(--success);
}

.session-clip-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
}

.session-clip-controls .btn,
.session-clip-controls a.btn {
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
}

.clip-player-container {
    margin-top: 16px;
    display: none;
}

.clip-player-container video {
    width: 100%;
    border-radius: 12px;
    background: #000;
    border: 1px solid var(--glass-border);
}

.no-history-msg {
    color: var(--text-muted);
    text-align: center;
    padding: 40px 20px;
    font-style: italic;
    font-size: 15px;
}

@media (max-width:768px) {
    #uhmegle-management-ui {
        width: calc(100vw - 24px);
        left: 12px;
        top: 12px;
        max-height: calc(100vh - 24px);
    }

    .session-clip-controls {
        grid-template-columns: 1fr;
    }
}
            </style>`);
        }
        createHTML() {
            this.container.innerHTML = `
        <div class="ui-header" id="ui-header">
            <h3>${ICONS.globe} foenemegle <span class="version-tag">${CONFIG.scriptVersion}</span></h3>
            <span class="close-btn" id="ui-close">${ICONS.close}</span>
        </div>
        <div class="ui-tabs">
            ${this.createTabButton("status", "Status", ICONS.status, true)}
            ${this.createTabButton("history", "History", ICONS.history)}
            ${this.createTabButton("devices", "Devices", ICONS.devices)}
            ${this.createTabButton("power", "Power", ICONS.power)}
            ${this.createTabButton("settings", "Settings", ICONS.settings)}
            ${this.createTabButton("logs", "Logs", ICONS.logs)}
        </div>
        <div class="ui-content">
            <div id="tab-status" class="tab-content"></div>
            <div id="tab-history" class="tab-content" style="display:none"></div>
            <div id="tab-devices" class="tab-content" style="display:none"></div>
            <div id="tab-power" class="tab-content" style="display:none"></div>
            <div id="tab-settings" class="tab-content" style="display:none"></div>
            <div id="tab-logs" class="tab-content" style="display:none"></div>
        </div>
    `;
        }

        createTabButton(id, text, icon, active = false) {
            return `<button class="tab-btn ${active ? "active" : ""}" data-tab="${id}">${icon}<span>${text}</span></button>`;
        }

        renderTabs() {

            document.getElementById("tab-status").innerHTML = `
        <div class="control-group">
            <h4>Bypass Status</h4>
            <div id="status-indicators"></div>
        </div>
        <div class="control-group">
            <h4>Session Tools</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <button id="flip-camera-btn" class="btn btn-secondary">
                    ${ICONS.flipCam} Flip Camera
                </button>
                <button id="clip-now-btn" class="btn btn-primary">
                    ${ICONS.clapper} Clip Now
                </button>
            </div>
        </div>
        <div class="control-group">
            <label for="interests-input">Common Interests (comma-separated):</label>
            <input type="text" id="interests-input" placeholder="e.g. gaming, music, art">
        </div>
    `;

            document.getElementById("tab-history").innerHTML = `
        <div class="control-group">
            <h4>Connection History (Last ${CONFIG.maxHistory})</h4>
            <div id="connection-history"></div>
        </div>
    `;

            document.getElementById("tab-devices").innerHTML = `
        <div class="control-group">
            <h4>Video Devices</h4>
            <div id="video-devices-list" class="device-list">Loading...</div>
        </div>
        <div class="control-group">
            <h4>Audio Input Devices</h4>
            <div id="audio-input-devices-list" class="device-list">Loading...</div>
        </div>
    `;

            document.getElementById("tab-power").innerHTML = `
        <div class="control-group">
            <h4>Power Tools</h4>
            <div style="display:grid;grid-template-columns:1fr;gap:12px">
                <button id="force-skip-btn" class="btn btn-primary">Force New Connection</button>
                <button id="force-reconnect-btn" class="btn btn-secondary">Force Server Reconnect</button>
                <button id="safe-report-btn" class="btn btn-danger">Safely Report Last User</button>
            </div>
        </div>
    `;

            document.getElementById("tab-logs").innerHTML = `
        <div class="control-group">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <h4 style="margin:0">System Logs</h4>
                <button id="clear-logs-btn" class="btn btn-secondary" style="width:auto;padding:4px 12px;font-size:12px">Clear</button>
            </div>
            <div id="log-container" class="log-container"></div>
        </div>
    `;

            document.getElementById("tab-settings").innerHTML = `
        <div class="control-group">
            <h4>General Settings</h4>
            <div class="control-item">
                <label>
                    Device Spoofing
                    <span class="tooltip">
                        ${ICONS.info}
                        <span class="tooltiptext">Hides your real camera/mic names from the site. Recommended on.</span>
                    </span>
                </label>
                <input type="checkbox" id="device-spoof-toggle">
            </div>
            <div class="control-item">
                <label>
                    Force Relay (IP Protection)
                    <span class="tooltip">
                        ${ICONS.info}
                        <span class="tooltiptext">Forces connection through Uhmegle's servers, hiding your IP from partners. May increase lag.</span>
                    </span>
                </label>
                <input type="checkbox" id="force-relay-toggle">
            </div>
            <div class="control-item">
                <label>
                    Remove Watermark
                    <span class="tooltip">
                        ${ICONS.info}
                        <span class="tooltiptext">Hides the "uhmegle.com" watermark from the remote video feed.</span>
                    </span>
                </label>
                <input type="checkbox" id="watermark-remove-toggle">
            </div>
            <div class="control-item">
                <label>
                    Debug Logging
                    <span class="tooltip">
                        ${ICONS.info}
                        <span class="tooltiptext">Show detailed script logs in the browser console (F12).</span>
                    </span>
                </label>
                <input type="checkbox" id="debug-mode-toggle">
            </div>
        </div>
        <div class="control-group">
            <h4>Clipping Settings</h4>
            <div class="control-item">
                <label>
                    Enable Clipping
                    <span class="tooltip">
                        ${ICONS.info}
                        <span class="tooltiptext">Enables the rolling buffer to record clips of your sessions.</span>
                    </span>
                </label>
                <input type="checkbox" id="clipping-enabled-toggle">
            </div>
            <div class="control-item">
                <label for="clip-duration-select">Clip Duration</label>
                <select id="clip-duration-select">
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="45">45s</option>
                    <option value="60">60s</option>
                </select>
            </div>
            <div class="control-item">
                <label for="clip-layout-select">Clip Layout</label>
                <select id="clip-layout-select">
                    <option value="side-by-side">Side-by-Side</option>
                    <option value="remote-only">Stranger Only</option>
                </select>
            </div>
        </div>
        <div class="control-group">
           <h4>Audio Settings</h4>
           <div class="control-item">
               <label>Raw Audio Mode <span class="tooltip">Disables noise suppression</span></label>
               <input type="checkbox" id="raw-audio-toggle">
           </div>
       </div>
    `;
        }
        setupEventListeners() {
            document.getElementById("ui-close").addEventListener("click", () => this.hide()), document.querySelectorAll(".tab-btn").forEach(e => e.addEventListener("click", t => this.switchTab(t.currentTarget.dataset.tab))), document.getElementById("device-spoof-toggle").addEventListener("change", e => {
                scriptState.deviceSpoofEnabled = e.target.checked, log(`Device Spoofing ${e.target.checked ? "Enabled" : "Disabled"}.`, "info")
            }), document.getElementById("force-relay-toggle").addEventListener("change", e => {
                scriptState.forceRelay = e.target.checked, window.relay = e.target.checked, log(`Force Relay ${e.target.checked ? "Enabled" : "Disabled"}.`, "success")
            }), document.getElementById("watermark-remove-toggle").addEventListener("change", e => {
                scriptState.removeWatermark = e.target.checked;
                const t = document.querySelector(".videoContainer.remote .wmark");
                t && (t.style.opacity = scriptState.removeWatermark ? "0" : "1"), log(`Watermark removal ${scriptState.removeWatermark ? "Enabled" : "Disabled"}.`, "info")
            }), document.getElementById("debug-mode-toggle").addEventListener("change", e => {
                CONFIG.debugMode = e.target.checked, log(`Debug Mode ${e.target.checked ? "Enabled" : "Disabled"}.`, "info")
            }), document.getElementById("flip-camera-btn").addEventListener("click", () => {
                "function" == typeof window.unflipFunc && (window.unflipFunc(), log("Flipped camera.", "success"))
            }), document.getElementById("force-skip-btn").addEventListener("click", () => {
                "function" == typeof window.pressSkip && (window.pressSkip(!0), log("Forced a new connection.", "success"))
            }), document.getElementById("force-reconnect-btn").addEventListener("click", () => {
                window.socket && window.socket.close(), log("Forced server reconnection.", "info")
            }), document.getElementById("safe-report-btn").addEventListener("click", () => {
                "function" == typeof window.report && (window.action = "report", window.popupOpen(), log("Opened safe report dialog.", "info"))
            }), document.getElementById("clear-logs-btn").addEventListener("click", () => {
                scriptState.logs = [], this.updateLogs()
            });
            document.getElementById('raw-audio-toggle').addEventListener('change', (e) => {
                _audioconfig.rawMode = e.target.checked;
                log(`Raw Audio Mode: ${_audioconfig.rawMode ? 'Enabled' : 'Disabled'}. Reconnect for changes to take effect.`, 'info');

            })
            const e = document.getElementById("interests-input");
            e.value = (localStorage.getItem("interests") || "[]").replace(/[\[\]"]/g, ""), e.addEventListener("change", e => {
                const t = e.target.value.split(",").map(e => e.trim()).filter(Boolean);
                localStorage.setItem("interests", JSON.stringify(t)), log("Interests updated.", "info", t)
            }), document.getElementById("clipping-enabled-toggle").addEventListener("change", e => {
                CONFIG.clippingEnabled = e.target.checked, log(`Clipping ${CONFIG.clippingEnabled ? "Enabled" : "Disabled"}.`, "info")
            }), document.getElementById("clip-duration-select").addEventListener("change", e => {
                CONFIG.defaultClipDuration = parseInt(e.target.value, 10), log(`Clip duration set to ${CONFIG.defaultClipDuration}s.`, "info")
            }), document.getElementById("clip-layout-select").addEventListener("change", e => {
                CONFIG.clipLayout = e.target.value, log(`Clip layout set to ${CONFIG.clipLayout}.`, "info")
            }), document.getElementById("clip-now-btn").addEventListener("click", () => {
                scriptState.clippingManager && (log('"Clip Now" button pressed, finalizing current clip.', "info"), scriptState.clippingManager.stopCurrentRecording(), this.show(), this.switchTab("history"), scriptState.clippingManager.startNewRecording(scriptState.csesh))
            }), document.getElementById("device-spoof-toggle").checked = scriptState.deviceSpoofEnabled, document.getElementById("force-relay-toggle").checked = scriptState.forceRelay, document.getElementById("watermark-remove-toggle").checked = scriptState.removeWatermark, document.getElementById("debug-mode-toggle").checked = CONFIG.debugMode, document.getElementById("clipping-enabled-toggle").checked = CONFIG.clippingEnabled, document.getElementById("clip-duration-select").value = CONFIG.defaultClipDuration, document.getElementById("clip-layout-select").value = CONFIG.clipLayout, document.getElementById("connection-history").addEventListener("click", e => {
                const t = e.target.closest("button, a.btn");
                if (!t || !t.dataset.connid) return;
                e.preventDefault();
                const o = window.savedConnections.find(e => e.connid === t.dataset.connid);
                o && (t.matches(".btn-review") ? this.toggleClipReview(o) : t.matches(".btn-discard") ? this.discardClip(o) : t.matches("a.btn-primary") && window.open(t.href))
            });
        }

        toggleClipReview(session) {
            const playerContainer = document.getElementById(`player-for-${session.connid}`);
            if (!playerContainer) return;
            if (playerContainer.style.display === 'block') {
                playerContainer.style.display = 'none';
                playerContainer.innerHTML = '';
            } else if (session.clip?.url) {
                playerContainer.style.display = 'block';
                playerContainer.innerHTML = `<video src="${session.clip.url}" controls autoplay loop muted></video>`;
            }
        }

        discardClip(session) {
            if (session.clip?.url) URL.revokeObjectURL(session.clip.url);
            session.clip = {
                blob: null,
                url: null,
                status: 'none'
            };
            log(`Clip for session ${session.connid} discarded.`, 'info');

            this.updateConnectionHistory();
        }

        updateConnectionHistory() {
            const container = document.getElementById('connection-history');
            if (!container) return;
            let saved = (scriptState.savedConnections || [])
            if (saved.length === 0) {
                container.innerHTML = '<p class="no-history-msg">No recent connections to display.</p>';
                return;
            }
            if (window.savedConnections[0] !== saved[0]) {

            }
            container.innerHTML = saved.slice().reverse().map(conn => {
                if (!conn.image) {
                    if (scriptState.imstore[conn.connid]) {
                        conn.image = scriptState.imstore[conn.connid]
                    } else {
                        conn.image = captureRemoteVideoFrame()
                        scriptState.imstore[conn.connid] = conn.image
                    }
                }
                const hasIpInfo = conn.ip && conn.ip.ip;
                const ipInfoHtml = hasIpInfo ? `<div class="session-ip-info"><div>${ICONS.globe} <span>${conn.ip.ip}</span></div><div>${ICONS.zap} <span class="conn-type ${conn.ip.type === 'relay' ? 'conn-relay' : 'conn-p2p'}">${conn.ip.type === 'relay' ? 'Relay (Protected)' : 'P2P (Direct)'}</span></div></div>` : '';
                let clipControls = '';
                if (conn.clip?.status === 'available') {
                    const size = (conn.clip.blob.size / 1024 / 1024).toFixed(2);
                    const clipDate = new Date(conn.clip.timestamp).getTime();
                    clipControls = `<div class="session-clip-controls">
                        <button class="btn btn-review" data-connid="${conn.connid}">Review (${size}MB)</button>
                        <a class="btn btn-primary" data-connid="${conn.connid}" href="${conn.clip.url}" download="foenemegle-clip-${clipDate}.webm">${ICONS.download} Save</a>
                        <button class="btn btn-danger btn-discard" id="btn-discard" data-connid="${conn.connid}">${ICONS.trash} Discard</button>
                    </div>`;
                } else if (conn.clip?.status === 'recording') {
                    clipControls = `<div style="font-size:12px; color:var(--text-muted); text-align:center; padding: 16px 0;">Currently recording...</div>`;
                }
                return `<div class="session-history-item" data-connid="${conn.connid}">
                    <div class="session-main-content">
                        <img src="${conn.image || CONFIG.fallbackImageURL}" alt="Partner thumbnail">
                        <div class="session-history-details">
                            <div class="country">${conn.countryname || 'Unknown Location'} <span class="${conn.flag}"></span></div>
                            <div class="timestamp">${conn.timestamp?.toLocaleString() || "Not available"}</div>
                            ${ipInfoHtml}
                        </div>
                    </div>
                    ${clipControls}
                    <div class="clip-player-container" id="player-for-${conn.connid}"></div>
                </div>`;
            }).join('');
        }

        switchTab(tabName) {

            this.currentTab = tabName, document.querySelectorAll(".tab-btn").forEach(e => e.classList.remove("active")), document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active"), document.querySelectorAll(".tab-content").forEach(e => e.style.display = "none");
            const e = document.getElementById(`tab-${tabName}`);
            e && (e.style.display = "block"), "status" === tabName ? this.updateStatusIndicators() : "history" === tabName ? this.updateConnectionHistory() : "devices" === tabName ? this.updateDeviceInfo() : "logs" === tabName && this.updateLogs();
        }
        updateStatusIndicators() {

            const e = document.getElementById("status-indicators");
            e && (e.innerHTML = Object.entries(scriptState.bypassStatus).map(([e, t]) => {
                const o = e.replace(/([A-Z])/g, " $1").replace(/^./, e => e.toUpperCase());
                return `<div class="control-item status-indicator"><span>${o}</span><span class="${t ? "active" : "inactive"}">${t ? "Active" : "Inactive"}</span></div>`
            }).join(""));
        }
        async updateDeviceInfo() {

            try {
                const e = scriptState.deviceSpoofEnabled;
                scriptState.deviceSpoofEnabled = !1, scriptState.realDevices = await scriptState.originalMethods.enumerateDevices(), scriptState.deviceSpoofEnabled = e;
                const t = (e, t) => {
                    if (0 === e.length) return '<p style="color:var(--text-muted); text-align: center; padding: 10px;">No devices found.</p>';
                    const o = localStorage.getItem("video" === t ? "webcamDeviceId" : "micDeviceId");
                    return e.map(e => `<div class="device-item ${o === e.deviceId ? "selected" : ""}" data-device-id="${e.deviceId}" data-type="${t}">${e.label || `Unknown (${e.deviceId.slice(0, 10)}...)`}</div>`).join("")
                };
                document.getElementById("video-devices-list").innerHTML = t(scriptState.realDevices.filter(e => "videoinput" === e.kind), "video"), document.getElementById("audio-input-devices-list").innerHTML = t(scriptState.realDevices.filter(e => "audioinput" === e.kind), "audio"), document.querySelectorAll(".device-item").forEach(e => {
                    e.addEventListener("click", () => {
                        const {
                            deviceId: t,
                            type: o
                        } = e.dataset, i = "video" === o ? window.changeWebcam : window.changeMicrophone;
                        "function" == typeof i && (i(t), log(`Changed ${o} device to: ${t.substring(0, 15)}...`, "success"), this.updateDeviceInfo())
                    })
                })
            } catch (e) {
                log("Error updating device info", "error", e), document.getElementById("video-devices-list").innerHTML = '<p style="color:var(--danger);">Error loading devices.</p>', document.getElementById("audio-input-devices-list").innerHTML = '<p style="color:var(--danger);">Error loading devices.</p>';
            }
        }
        updateLogs() {

            const e = document.getElementById("log-container");
            if (!e || !this.isVisible) return;
            e.innerHTML = scriptState.logs.slice(-50).map(e => {
                const t = {
                    error: "var(--danger)",
                    warn: "var(--warning)",
                    success: "var(--success)",
                    info: "var(--primary)",
                    debug: "var(--text-muted)"
                }[e.type] || "var(--text-primary)";
                return `<div style=color:${t}><span style="color:var(--text-muted);opacity:0.6">[${e.timestamp}]</span> ${e.message}</div>`
            }).join(""), e.scrollTop = e.scrollHeight;
        }
        makeDraggable() {

            const e = document.getElementById("ui-header");
            let t = {
                x: 0,
                y: 0,
                cx: 0,
                cy: 0
            };
            const o = o => {
                if (o.target.closest(".close-btn")) return;
                o.preventDefault(), t.cx = o.clientX, t.cy = o.clientY, document.onmouseup = i, document.onmousemove = s
            },
                s = o => {
                    o.preventDefault(), t.x = t.cx - o.clientX, t.y = t.cy - o.clientY, t.cx = o.clientX, t.cy = o.clientY, this.container.style.top = `${this.container.offsetTop - t.y}px`, this.container.style.left = `${this.container.offsetLeft - t.x}px`
                },
                i = () => {
                    document.onmouseup = null, document.onmousemove = null
                };
            e.onmousedown = o;
        }
        show() {
            this.container.classList.add('visible');
            this.isVisible = true;
            this.switchTab(this.currentTab);
        }
        hide() {
            this.container.classList.remove('visible');
            this.isVisible = false;
        }
        toggle() {
            this.isVisible ? this.hide() : this.show();
        }
    }

    class VideoFrameManager {
        static async initialize() {
            try {
                scriptState.fakeFrameCanvas = await this.loadImageToCanvas(CONFIG.imageURL);
            } catch (e) {
                log(`Primary image failed: ${e.message}. Using fallback.`, 'warn');
                scriptState.fakeFrameCanvas = await this.loadImageToCanvas(CONFIG.fallbackImageURL);
            }
            scriptState.perturbedCanvas = document.createElement('canvas');
            scriptState.perturbedCanvas.width = CONFIG.canvasSize.width;
            scriptState.perturbedCanvas.height = CONFIG.canvasSize.height;
        }
        static loadImageToCanvas(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = CONFIG.canvasSize.width;
                    canvas.height = CONFIG.canvasSize.height;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas);
                };
                img.onerror = () => reject(new Error(`Image load failed: ${url}`));
                img.src = url;
            });
        }
        static getDynamicFrame() {
            if (!scriptState.fakeFrameCanvas) return null;
            const pCtx = scriptState.perturbedCanvas.getContext('2d');
            pCtx.drawImage(scriptState.fakeFrameCanvas, 0, 0);
            const r = Math.random();
            if (r < 0.3) {
                pCtx.globalAlpha = 0.98 + r * 0.04;
                pCtx.drawImage(scriptState.fakeFrameCanvas, 0, 0);
                pCtx.globalAlpha = 1.0;
            } else if (r < 0.6) {
                pCtx.drawImage(scriptState.fakeFrameCanvas, (r - 0.5), (r - 0.5));
            }
            return scriptState.perturbedCanvas;
        }
        static getDynamicFrameData() {
            return this.getDynamicFrame()?.toDataURL('image/jpeg', 0.85).split(';base64,')[1] || null;
        }
    }
    class UserPersona {
        constructor() {
            this.platform = this.getRandomElement(["Win32", "MacIntel", "Linux x86_64"]);
            this.hardwareConcurrency = this.getRandomElement([4, 8, 12, 16]);
            this.deviceMemory = this.getRandomElement([8, 16, 32]);
            this.userAgent = this.generateUserAgent();
            this.scrollLength = this.randomInRange(15000, 40000);
            this.gifTestTime = Math.random() * (150 - 50) + 50;
        }

        getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        randomInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        generateUserAgent() {
            const version = this.randomInRange(105, 115);
            if (this.platform === 'Win32') {
                return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
            } else if (this.platform === 'MacIntel') {
                return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
            } else {
                return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
            }
        }
    }
    const userPersona = new UserPersona();

    class CoreBypasses {
        static initialize() {
            this.initializeSessionHooks();
            this.initializePreConnectionBypasses();
            this.initializeCameraAndFaceBypasses();
            this.initializeVarianceBypass();
            this.initializePenaltyBypasses();
            this.initializeFingerprintBypasses();
            this.initializeBroadcastChannelBypass();
            this.initializeAFKBypass();
        }
        static initializeSessionHooks() {
            const wrap = (original, name) => function (...args) {
                log(`Session end via: ${name}. Cleaning up.`, 'info');
                if (scriptState.currentPartnerInfo.ip !== null) {
                    scriptState.resetPartnerInfo();
                    scriptState.clippingManager.stopCurrentRecording();
                }
                return typeof original === 'function' ? original.apply(this, args) : undefined;
            };

            window.onEnd = wrap(window.onEnd, 'onEnd (Disconnect)');
            window.pressSkip = wrap(window.pressSkip, 'pressSkip (Skip Button)');
            log('Hooked session end functions for robust state/clip management.', 'success');
        }
        static initializePreConnectionBypasses() {
            const secureDefine = (prop, value) => Object.defineProperty(window, prop, {
                value,
                writable: false,
                configurable: true
            });

            secureDefine('calculateScrollLength', () => userPersona.scrollLength);
            secureDefine('setGIFSelector', async () => crypto.randomUUID().replace(/-/g, ''));
            secureDefine('testGIF', async () => userPersona.gifTestTime);
            secureDefine('bypass', true);

            log('Pre-connection fingerprints hardened.', 'success');
        }
        static initializeFingerprintBypasses() {
            try {
                const spoofedProperties = {
                    webdriver: {
                        value: false
                    },
                    hardwareConcurrency: {
                        value: userPersona.hardwareConcurrency
                    },
                    deviceMemory: {
                        value: userPersona.deviceMemory
                    },
                    platform: {
                        value: userPersona.platform
                    },
                    userAgent: {
                        value: userPersona.userAgent
                    },

                    plugins: {
                        get: new Proxy(function () {
                            return []
                        }, {
                            apply: (target, thisArg, args) => Reflect.apply(target, thisArg, args),
                            get: (target, prop) => prop === 'length' ? 0 : target[prop],
                            toString: () => 'function plugins() { [native code] }',
                        })
                    }
                };

                const define = (obj, prop, descriptor) => {
                    Object.defineProperty(obj, prop, {
                        ...descriptor,
                        configurable: false,
                        enumerable: true,
                    });
                };

                for (const prop in spoofedProperties) {
                    define(navigator, prop, spoofedProperties[prop]);
                }
                scriptState.bypassStatus.fingerprintBypass = true;
                log('Advanced fingerprint bypasses initialized.', 'success');
            } catch (e) {
                log('Fingerprint bypass init failed.', 'error', e);
            }
        }
        static initializeBroadcastChannelBypass() {
            if (!window.BroadcastChannel) return;
            try {
                const originalBC = window.BroadcastChannel;
                window.BroadcastChannel = new Proxy(originalBC, {
                    construct(target, [name]) {
                        if (/^(tab|session|multitab-check)/i.test(name)) {
                            log(`Blocked multi-tab check on channel: ${name}.`, 'success');
                            return {
                                postMessage: () => { },
                                close: () => { },
                                onmessage: null,
                                onerror: null
                            };
                        }
                        return new target(name);
                    }
                });
                scriptState.bypassStatus.broadcastChannel = true;
            } catch (e) {
                log('BroadcastChannel bypass failed.', 'error', e);
            }
        }
        static initializeAFKBypass() {
            window.setAfk = () => {
                log('AFK timer check blocked.', 'debug');
                clearTimeout(window.afkTimer);
            };
            setInterval(() => {
                if (window.lastUserActivity) window.lastUserActivity = Date.now();
            }, 60000);
            scriptState.bypassStatus.afkBypass = true;
            log('AFK bypass initialized.', 'success');
        }
        static initializeCameraAndFaceBypasses() {
            window.captureFrameToBase64 = () => VideoFrameManager.getDynamicFrameData();
            window.makeLocalCanvas = () => VideoFrameManager.getDynamicFrame();
            scriptState.bypassStatus.cameraBypass = true;
            scriptState.bypassStatus.faceDetection = true;
            log('Camera & Face Detection bypasses initialized.', 'success');
        }
        static initializeVarianceBypass() {
            let noiseSeed = Math.random();
            const getNoise = () => {
                let x = Math.sin(noiseSeed) * 10000;
                noiseSeed += 0.1;
                return x - Math.floor(x);
            };

            window.calculateVariance = () => 1000 + (getNoise() * 500);
            scriptState.bypassStatus.varianceBypass = true;
            log('Variance bypass initialized.', 'success');
        }
        static initializePenaltyBypasses() {
            const penaltySetterProxy = {
                set: function (target, prop, value) {
                    if (value === true && prop.toLowerCase().includes('block')) {
                        log(`Potential face/skip penalty blocked (property: ${prop}).`, 'warn');
                        return true;
                    }
                    return Reflect.set(...arguments);
                }
            };
            window.Proxy = window.Proxy || function () { };

            const originalEval = window.eval;
            window.eval = (script) => {
                if (typeof script === 'string' && script.includes('FaceOverlay')) {
                    log('Face overlay popup execution prevented via eval interception.', 'debug');
                    return;
                }
                return originalEval(script);
            };

            log('Hooked penalty system.', 'success');
        }
    }

    function captureRemoteVideoFrame() {
        const remoteVideo = document.getElementById('remoteVideo');
        if (!remoteVideo || remoteVideo.videoWidth === 0) {
            log('Remote video not available for capture.', 'warn');
            return null;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 640;
        canvas.height = 480;

        if (!window.remoteUnflip) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        let sourceX, sourceY, sourceWidth, sourceHeight;
        const videoAspectRatio = remoteVideo.videoWidth / remoteVideo.videoHeight;
        const targetAspectRatio = 4 / 3;

        if (videoAspectRatio > targetAspectRatio) {
            sourceHeight = remoteVideo.videoHeight;
            sourceWidth = sourceHeight * targetAspectRatio;
            sourceX = (remoteVideo.videoWidth - sourceWidth) / 2;
            sourceY = 0;
        } else {
            sourceWidth = remoteVideo.videoWidth;
            sourceHeight = sourceWidth / targetAspectRatio;
            sourceX = 0;
            sourceY = (remoteVideo.videoHeight - sourceHeight) / 2;
        }

        ctx.drawImage(
            remoteVideo,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
        );

        const dataUrl = canvas.toDataURL('image/jpeg');
        return dataUrl
    }

    class ConnectionHandler {

        static #extractSrflxIP(candidates) {
            if (!candidates || candidates.length === 0) {
                return null;
            }

            const srflxCandidate = candidates.find(c => c?.candidate?.includes(' typ srflx'));

            if (srflxCandidate) {
                try {

                    const parts = srflxCandidate.candidate.split(' ');
                    if (parts.length > 4) {
                        const ip = parts[4];
                        if (ip.includes('.') || ip.includes(':')) {
                            log(`Extracted potential partner IP from srflx candidate: ${ip}`, 'debug');
                            return ip;
                        }
                    }
                } catch (e) {
                    log('Failed to parse srflx candidate string.', 'warn', e);
                    return null;
                }
            }

            return null;
        }

        static handleNewConnection(eventData) {
            if (eventData?.event !== 'conn' || !eventData.connectionID) {
                log('Received a non-connection or malformed event, ignoring.', 'debug');
                return;
            }

            const potentialIp = this.#extractSrflxIP(eventData.candidates);
            let initialIpInfo = null;
            if (potentialIp) {
                initialIpInfo = {
                    ip: potentialIp,
                    type: 'p2p (pending)'
                };
            }

            const newSession = {
                connid: eventData.connectionID,
                countryname: eventData.cName || eventData.country || 'Unknown Location',
                flag: `flag-${eventData.country?.toLowerCase()}`,
                interests: eventData.interests || [],
                timestamp: new Date(),

                ip: initialIpInfo,

                image: null,
                clip: null
            };

            log(`New connection initiated: ${newSession.connid}`, 'info');

            if (!scriptState.savedConnections) {
                scriptState.savedConnections = [];
            }

            if (scriptState.savedConnections.length >= CONFIG.maxHistory) {
                scriptState.savedConnections.shift();
            }

            scriptState.savedConnections.push(newSession);

            window.savedConnections = scriptState.savedConnections;

            if (scriptState.managementUI?.isVisible) {
                scriptState.managementUI.updateConnectionHistory();
            }
        }
    }
    class ImageCaptureHandler {

        static captureThumbnail(remoteVideoElement) {

            const currentConnId = window.connectionID;
            if (!currentConnId) {
                log('Cannot capture thumbnail, no active connectionID.', 'warn');
                return;
            }

            const session = scriptState.savedConnections.find(s => s.connid === currentConnId);

            if (!session) {
                log(`Cannot capture thumbnail, session not found for connid: ${currentConnId}`, 'warn');
                return;
            }

            try {
                const canvas = document.createElement('canvas');
                canvas.width = remoteVideoElement.videoWidth;
                canvas.height = remoteVideoElement.videoHeight;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(remoteVideoElement, 0, 0, canvas.width, canvas.height);

                const imageURL = canvas.toDataURL('image/jpeg', 0.8);

                session.image = imageURL;
                log(`Thumbnail captured for session: ${session.connid}`, 'debug');

                if (scriptState.managementUI?.isVisible) {
                    scriptState.managementUI.updateConnectionHistory();
                }

            } catch (e) {
                log('Error capturing video thumbnail.', 'error', e);
            }
        }
    }

    class WebSocketInterceptor {
        static initialize() {
            if (window.WebSocket) {
                const OrigWS = window.WebSocket;
                const Osend = OrigWS.prototype.send;
                window.WebSocket = function (...args) {
                    const sock = new OrigWS(...args);
                    sock.addEventListener('message', (e) => {
                        try {
                            if (typeof e.data !== 'string' || !e.data.startsWith('{')) return;
                            console.log(e.data)
                            const msg = JSON.parse(e.data);
                            if (msg.event === 'ban' || msg.event === 'banned' || msg.event === 'injection') {
                                log(`Server ${msg.event} event BLOCKED.`, 'error', msg);
                                e.stopImmediatePropagation();
                                if (msg.event !== 'injection' && typeof window.pressSkip === 'function') {
                                    setTimeout(() => window.pressSkip(true), 1500);
                                }
                            }
                            if (msg.event === 'conn') {
                                console.log(msg)
                                ConnectionHandler.handleNewConnection(msg);
                            }
                            if (msg.event === 'rimage') {
                                alert("You just got reported. Foenemegle saved you. Sorry king, gonna have to be redirected to prevent it.");
                                window.location = "https://uhmegle.com/video?" + Date.now()
                            }
                        } catch (err) { }
                    }, true);
                    sock.send = function (data) {
                        try {
                            if (typeof data === 'string' && data.includes('"event":"image"')) {
                                const payload = JSON.parse(data);
                                if (payload.event === 'image' && payload.image) {
                                    log('Blocking image event.', 'success');
                                    return;
                                }
                            }
                        } catch (e) {

                        }

                        return Osend.apply(this, arguments);
                    };

                    return sock;
                };
                window.WebSocket.prototype = OrigWS.prototype;
                scriptState.bypassStatus.websocketIntercept = true;
            }

        }
    }

    async function main() {
        if (scriptState.isInitialized) return;
        scriptState.isInitialized = true;
        log('DOM ready. Initializing script...');
        if (typeof window.savedConnections === 'undefined') window.savedConnections = [];

        await VideoFrameManager.initialize();
        PeerConnectionInterceptor.initialize();
        scriptState.clippingManager = new ClippingManager();
        SessionDataCollector.initialize();
        CoreBypasses.initialize();
        scriptState.managementUI = new ManagementUI();

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u') {
                e.preventDefault();
                scriptState.managementUI.toggle();
            }
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                log('Clip hotkey pressed.', 'info');
                if (scriptState.clippingManager) {
                    scriptState.clippingManager.stopCurrentRecording();
                    scriptState.managementUI.show();
                    scriptState.managementUI.switchTab('history');
                }
            }
        });

        log('foenemegle Fixes is fully operational.', 'success');
        log('Pro Tip: Press Ctrl+Alt+U for menu, Ctrl+Alt+C to save a clip.', 'info');
        scriptState.managementUI.updateStatusIndicators();
    }

    log('Script injected. Applying pre-emptive patches.');
    if (navigator.mediaDevices) {
        scriptState.originalMethods.enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
        scriptState.originalMethods.getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.enumerateDevices = createNativeWrapper(scriptState.originalMethods.enumerateDevices, (original) =>
            scriptState.deviceSpoofEnabled ? Promise.resolve([CONFIG.spoofedDevices.video, CONFIG.spoofedDevices.audioIn]) : original()
        );
        navigator.mediaDevices.getUserMedia = createNativeWrapper(scriptState.originalMethods.getUserMedia, async (original, constraints) => {
            if (constraints?.audio && _audioconfig.rawMode) {
                log('Raw Audio Mode: Forcing audio processing off.', 'debug');
                if (typeof constraints.audio !== 'object') {
                    constraints.audio = {};
                }

                constraints.audio.noiseSuppression = false;
                constraints.audio.echoCancellation = false;
                constraints.audio.autoGainControl = false;
            }

            if (scriptState.deviceSpoofEnabled && constraints?.video) {
                log('getUserMedia intercepted: Providing dynamic fake video stream.', 'debug');
                const canvas = VideoFrameManager.getDynamicFrame();
                const fakeStream = canvas.captureStream(30);
                try {
                    const audioStream = await original({
                        audio: constraints.audio || true,
                        video: false
                    });
                    audioStream.getAudioTracks().forEach(track => fakeStream.addTrack(track));
                } catch (e) {
                    log('Could not get real audio for passthrough.', 'warn');
                }
                return fakeStream;
            }
            return original(constraints);
        });
        scriptState.bypassStatus.deviceSpoof = true;
    }
    WebSocketInterceptor.initialize();

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', main);
    else main();

})();