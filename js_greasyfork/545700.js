// ==UserScript==
// @name         CellCraft/Agma Voice Chat P2P
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Voice chat for CellCraft or Agma with friends (P2P via WebRTC + public signaling)
// @author       S E N S E
// @license      MIT
// @match        https://cellcraft.io/
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545700/CellCraftAgma%20Voice%20Chat%20P2P.user.js
// @updateURL https://update.greasyfork.org/scripts/545700/CellCraftAgma%20Voice%20Chat%20P2P.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- Floating mic button ---
    const micButton = document.createElement('button');
    micButton.innerText = '🎤';
    micButton.style.position = 'fixed';
    micButton.style.bottom = '20px';
    micButton.style.right = '20px';
    micButton.style.zIndex = '9999';
    micButton.style.fontSize = '24px';
    micButton.style.padding = '10px';
    micButton.style.borderRadius = '50%';
    micButton.style.backgroundColor = 'red';
    micButton.style.color = 'white';
    micButton.style.border = 'none';
    micButton.style.cursor = 'pointer';
    document.body.appendChild(micButton);

    // --- Variables ---
    let localStream = null;
    let micOn = false;
    const peers = {}; // store RTCPeerConnections keyed by friend ID
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    // --- Signaling server ---
    const ws = new WebSocket('wss://demo-signaling-server.herokuapp.com');

    ws.onopen = () => console.log('Connected to signaling server');

    ws.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        const { from, type, sdp, candidate } = data;

        if (type === 'offer') {
            const pc = new RTCPeerConnection(configuration);
            peers[from] = pc;

            if (localStream) localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

            pc.ontrack = (event) => {
                let audioEl = document.getElementById('audio-' + from);
                if (!audioEl) {
                    audioEl = document.createElement('audio');
                    audioEl.id = 'audio-' + from;
                    audioEl.srcObject = event.streams[0];
                    audioEl.autoplay = true;
                    document.body.appendChild(audioEl);
                }
            };

            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(JSON.stringify({ to: from, type: 'answer', sdp: answer }));
        }

        if (type === 'answer' && peers[from]) {
            await peers[from].setRemoteDescription(new RTCSessionDescription(sdp));
        }

        if (type === 'candidate' && peers[from]) {
            await peers[from].addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    // --- Mic toggle ---
    micButton.addEventListener('click', async () => {
        if (!micOn) {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

                localStream.getTracks().forEach(track => {
                    for (const id in peers) {
                        peers[id].addTrack(track, localStream);
                    }
                });

                micButton.style.backgroundColor = 'green';
                micOn = true;
                console.log('Mic ON');

                ws.send(JSON.stringify({ type: 'join' }));
            } catch (err) {
                console.error('Microphone error:', err);
            }
        } else {
            localStream.getTracks().forEach(track => track.stop());
            micButton.style.backgroundColor = 'red';
            micOn = false;
            console.log('Mic OFF');

            for (const id in peers) peers[id].close();
        }
    });

    function setupPeerIce(pc, friendId) {
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({ to: friendId, type: 'candidate', candidate: event.candidate }));
            }
        };
    }

})();