// ==UserScript==
// @name         Amplificateur de volume Twitch
// @namespace    https://linktr.ee/yakenofficielle
// @version      5.4
// @description  Amplifie le volume Twitch en combinant volume natif et gain WebAudio, avec UI native améliorée.
// @author       NatioLaurin
// @match        https://www.twitch.tv/*
// @grant        none
// @license      Yaken
// @downloadURL https://update.greasyfork.org/scripts/544247/Amplificateur%20de%20volume%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/544247/Amplificateur%20de%20volume%20Twitch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let audioCtx = null;
    let gainNode = null;
    let sourceNode = null;
    let video = null;
    let lastVideoSrc = null;

    let amplificationGain = 1; // amplification multipliée au volume natif
    let nativeVolume = 1; // volume natif (slider Twitch)

    // Slider amplification custom (petit et discret)
    let ampSliderContainer = null;
    let ampSlider = null;
    let dragHandle = null;
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    function createAmplificationSlider() {
        if (ampSliderContainer) return;

        ampSliderContainer = document.createElement("div");
        Object.assign(ampSliderContainer.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "140px",
            backgroundColor: "rgba(24, 24, 27, 0.90)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: "99999",
            userSelect: "none",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
        });

        const label = document.createElement("div");
        label.textContent = "🔊Amplification";
        label.style.marginBottom = "6px";
        label.style.fontWeight = "600";
        label.style.paddingRight = "18px";
        ampSliderContainer.appendChild(label);

        ampSlider = document.createElement("input");
        ampSlider.type = "range";
        ampSlider.min = "1";
        ampSlider.max = "5";
        ampSlider.step = "0.1";
        ampSlider.value = amplificationGain.toString();
        Object.assign(ampSlider.style, {
            width: "100%",
            cursor: "pointer",
            accentColor: "#9147FF",
        });
        ampSliderContainer.appendChild(ampSlider);

        dragHandle = document.createElement("div");
        Object.assign(dragHandle.style, {
            width: "16px",
            height: "16px",
            backgroundColor: "#9147FF",
            borderRadius: "4px",
            cursor: "grab",
            position: "absolute",
            top: "8px",
            right: "8px",
            marginTop: "0",
            alignSelf: "auto",
        });
        dragHandle.title = "Déplacer";
        ampSliderContainer.appendChild(dragHandle);

        document.body.appendChild(ampSliderContainer);

        dragHandle.addEventListener("mousedown", e => {
            isDragging = true;
            const rect = ampSliderContainer.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            e.preventDefault();
        });
        document.addEventListener("mousemove", e => {
            if (isDragging) {
                ampSliderContainer.style.left = `${e.clientX - offset.x}px`;
                ampSliderContainer.style.top = `${e.clientY - offset.y}px`;
                ampSliderContainer.style.right = "auto";
                ampSliderContainer.style.bottom = "auto";
            }
        });
        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        ampSlider.addEventListener("input", () => {
            amplificationGain = parseFloat(ampSlider.value);
            updateGain();
            console.log(`[Booster] Amplification réglée sur ${amplificationGain}x`);
        });
    }

    function updateGain() {
        if (gainNode) {
            let newGain = nativeVolume * amplificationGain;
            if (newGain > 10) newGain = 10;
            gainNode.gain.value = newGain;
        }
    }

    async function attachToVideo() {
        const candidate = document.querySelector('video');
        if (!candidate || candidate.readyState < 1) return;

        if (candidate.src === lastVideoSrc && audioCtx) {
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
                console.log("[Booster] AudioContext repris");
            }
            return;
        }

        if (audioCtx) {
            try {
                await audioCtx.close();
                console.log("[Booster] AudioContext fermé");
            } catch (e) {
                console.warn("[Booster] Erreur en fermant AudioContext", e);
            }
            audioCtx = null;
            gainNode = null;
            sourceNode = null;
        }

        try {
            video = candidate;
            lastVideoSrc = video.src;

            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            gainNode.gain.value = nativeVolume * amplificationGain;

            sourceNode.connect(gainNode).connect(audioCtx.destination);

            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
                console.log("[Booster] AudioContext démarré");
            }

            console.log("[Booster] Audio connecté à la vidéo Twitch.");

            watchNativeVolumeSlider();

        } catch (err) {
            console.error("[Booster] Impossible de connecter l'audio :", err);
        }
    }

    function watchNativeVolumeSlider() {
        const nativeSlider = document.querySelector('input[data-test-selector="volume-slider"]');
        if (!nativeSlider) return;

        nativeVolume = parseFloat(nativeSlider.value) || 1;

        nativeSlider.oninput = () => {
            nativeVolume = parseFloat(nativeSlider.value);
            updateGain();
            console.log(`[Booster] Volume natif réglé sur ${nativeVolume}`);
        };
    }

    setInterval(() => {
        createAmplificationSlider();
        attachToVideo();
    }, 1000);
})();