// ==UserScript==
// @name         Slop.pop
// @namespace    http://tampermonkey.net/
// @version      4.1-SE
// @description  ARE YOU TIRED of your gpop.io experience being just... a game? 😴 SLOP.POP IS HERE! 💥 It's the revolutionary upgrade that transforms your screen from bland to ✨GRAND✨! This isn't just a script; it's a full-blown sensory revolution! 🤯 Don't just play the game, ASCEND to a new level of POP! DON'T DELAY, OBLITERATE YOUR SENSES TODAY 🚀
// @author       N'wah
// @match        https://gpop.io
// @match        https://gpop.io/play/*
// @icon         https://www.google.com/s2/favicons?domain=gpop.io
// @license      MIT Apache BSD GPL LGPL MPL EPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543443/Sloppop.user.js
// @updateURL https://update.greasyfork.org/scripts/543443/Sloppop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_target_point;
        uniform float u_zoom;
        uniform vec3 u_color_speed;
        uniform float u_color_time_factor;

        vec3 mandelbrot(vec2 c) {
            vec2 z = vec2(0.0);
            float n = 0.0;
            for (int i = 0; i < 512; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                if (dot(z, z) > 4.0) {
                    break;
                }
                n += 1.0;
            }
            return n < 256.0 ? 0.5 + 0.5 * cos(3.0 + n * 0.15 + u_color_time_factor * u_color_speed) : vec3(0.0);
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
            uv /= u_zoom;
            uv += u_target_point;
            gl_FragColor = vec4(mandelbrot(uv), 1.0);
        }
    `;

    const CONFIG = {
        zoomSpeed: 1.005,
        zoomOutSpeed: 0.96,
        maxZoom: 1e4,
        minZoom: 0.8,
        colorChangeSpeed: { r: 0.9, g: 0.7, b: 1.3 },
        colorCycleTime: 3.0,
        lerpFactor: 0.04,
        panCompleteThreshold: 0.0001,
        dvdTargetSelector: '.pp-container2',
        dvdSpeed: 1.5,
        memeRain: {
            enabled: true,
            creationInterval: 250,
            size: 65,
            fallDurationMin: 5,
            fallDurationRange: 5,
            horizontalDrift: 400
        }
    };

    const VICTORY_ANIMATION_CONFIG = {
        enabled: true,
        targetSelector: '.gbutton.playpage-over-status-submit',
        newText: 'UPLOAD IP',
        speed: 3.5
    };

    function setupFractalBackground() {
        const FRACTAL_POINTS = [
            { x: -0.743643887, y: 0.131825904 },
            { x: -1.25, y: 0.0 },
            { x: -0.1528, y: 1.0397 },
            { x: -0.7269, y: 0.1889 },
            { x: -0.8, y: 0.156 },
            { x: 0.285, y: 0.01 },
            { x: -1.401155, y: 0.0 },
            { x: -0.75, y: 0.11 },
            { x: -0.16, y: 1.04 },
            { x: 0.45, y: 0.1428 },
            { x: -0.77568377, y: 0.13646737 },
            { x: -1.25066, y: 0.0 },
            { x: -0.101096, y: 0.956286 },
            { x: -1.04180, y: 0.34634 },
            { x: -0.81222, y: -0.18545 },
            { x: -0.13856, y: -0.64935 },
            { x: 0.42884, y: -0.231345},
            { x: -0.170337, y: -1.06506},
            { x: 0.0, y: 0.95},
            { x: -1.9, y: 0.0}
        ];

        const existingBg = document.querySelector('.pixiiBG');
        if (existingBg) existingBg.remove();

        document.body.style.backgroundColor = 'black';
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-1';
        document.body.prepend(canvas);

        const gl = canvas.getContext('webgl', { antialias: true });
        if (!gl) {
            return;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const timeUniformLocation = gl.getUniformLocation(program, "u_time");
        const targetPointUniformLocation = gl.getUniformLocation(program, "u_target_point");
        const zoomUniformLocation = gl.getUniformLocation(program, "u_zoom");
        const colorSpeedUniformLocation = gl.getUniformLocation(program, "u_color_speed");
        const colorTimeFactorUniformLocation = gl.getUniformLocation(program, "u_color_time_factor");

        let dvdElement = null;
        let dvdRect = { width: 0, height: 0 };
        let dvdPos = { x: 0, y: 0 };
        let dvdVel = { x: CONFIG.dvdSpeed, y: CONFIG.dvdSpeed };

        function initializeDvdAnimation() {
            if (dvdElement) return true;
            const element = document.querySelector(CONFIG.dvdTargetSelector);
            if (element) {
                dvdElement = element;
                dvdElement.style.position = 'fixed';
                dvdElement.style.zIndex = '10';
                dvdRect = dvdElement.getBoundingClientRect();
                dvdPos.x = Math.random() * (window.innerWidth - dvdRect.width);
                dvdPos.y = Math.random() * (window.innerHeight - dvdRect.height);
                return true;
            }
            return false;
        }

        const dvdInitInterval = setInterval(() => {
            if (initializeDvdAnimation()) {
                clearInterval(dvdInitInterval);
            }
        }, 1000);

        let baseTime = 0;
        let zoom = CONFIG.minZoom;
        const ANIMATION_STATE = {
            ZOOMING_IN: 0,
            ZOOMING_OUT: 1,
            PANNING: 2
        };
        let currentState = ANIMATION_STATE.ZOOMING_IN;
        let initialIndex = Math.floor(Math.random() * FRACTAL_POINTS.length);
        let currentTarget = { ...FRACTAL_POINTS[initialIndex] };
        let nextTarget = { ...FRACTAL_POINTS[initialIndex] };
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        function render() {
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                if (dvdElement) {
                    dvdRect = dvdElement.getBoundingClientRect();
                }
            }

            baseTime += 0.01;

            if (dvdElement) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                dvdPos.x += dvdVel.x;
                dvdPos.y += dvdVel.y;

                if (dvdPos.x <= 0) {
                    dvdPos.x = 0;
                    dvdVel.x *= -1;
                } else if (dvdPos.x + dvdRect.width >= viewportWidth) {
                    dvdPos.x = viewportWidth - dvdRect.width;
                    dvdVel.x *= -1;
                }

                if (dvdPos.y <= 0) {
                    dvdPos.y = 0;
                    dvdVel.y *= -1;
                } else if (dvdPos.y + dvdRect.height >= viewportHeight) {
                    dvdPos.y = viewportHeight - dvdRect.height;
                    dvdVel.y *= -1;
                }

                dvdElement.style.left = `${dvdPos.x}px`;
                dvdElement.style.top = `${dvdPos.y}px`;
            }

            switch (currentState) {
                case ANIMATION_STATE.ZOOMING_IN:
                    zoom *= CONFIG.zoomSpeed;
                    if (zoom > CONFIG.maxZoom) {
                        currentState = ANIMATION_STATE.ZOOMING_OUT;
                        nextTarget = { ...FRACTAL_POINTS[Math.floor(Math.random() * FRACTAL_POINTS.length)] };
                    }
                    break;

                case ANIMATION_STATE.ZOOMING_OUT:
                    zoom *= CONFIG.zoomOutSpeed;
                    if (zoom <= CONFIG.minZoom) {
                        zoom = CONFIG.minZoom;
                        currentState = ANIMATION_STATE.PANNING;
                    }
                    break;

                case ANIMATION_STATE.PANNING:
                    {
                    currentTarget.x += (nextTarget.x - currentTarget.x) * CONFIG.lerpFactor;
                    currentTarget.y += (nextTarget.y - currentTarget.y) * CONFIG.lerpFactor;

                    const dx = currentTarget.x - nextTarget.x;
                    const dy = currentTarget.y - nextTarget.y;
                    if (Math.sqrt(dx * dx + dy * dy) < CONFIG.panCompleteThreshold) {
                        currentTarget = { ...nextTarget };
                        currentState = ANIMATION_STATE.ZOOMING_IN;
                    }
                    break;
            }}

            gl.useProgram(program);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeUniformLocation, baseTime);
            gl.uniform2f(targetPointUniformLocation, currentTarget.x, currentTarget.y);
            gl.uniform1f(zoomUniformLocation, zoom);
            gl.uniform3f(colorSpeedUniformLocation, CONFIG.colorChangeSpeed.r, CONFIG.colorChangeSpeed.g, CONFIG.colorChangeSpeed.b);
            gl.uniform1f(colorTimeFactorUniformLocation, baseTime * CONFIG.colorCycleTime);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(render);
        }

        render();
    }

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return null;
        }
        return program;
    }

    function initMemeRain() {
        if (!CONFIG.memeRain.enabled) {
            return;
        }
        const MEME_RAIN_IMAGES = [
            'https://i.imgur.com/XILtZNr.jpg',
            'https://i.imgur.com/0VMeUcG.png',
            'https://i.imgur.com/YNAIS4T.jpeg',
            'https://i.imgur.com/YPfARuh.jpeg',
            'https://i.imgur.com/VotE20K.jpeg',
            'https://i.imgur.com/Lmgz274.jpeg',
            'https://i.imgur.com/FNgIgHp.jpeg',
            'https://i.imgur.com/ZEguo1s.jpeg',
            'https://i.imgur.com/n9t7GOW.jpg',
            'https://i.imgur.com/IkWLBuA.jpg',
            'https://i.imgur.com/XYeVh0e.png',
            'https://i.imgur.com/TyAzVRl.jpeg',
            'https://i.imgur.com/UGilaIk.jpg',
            'https://i.imgur.com/trHBYEe.jpeg',
            'https://i.imgur.com/TyAzVRl.jpeg'
        ];

        const rainContainer = document.createElement('div');
        rainContainer.style.position = 'fixed';
        rainContainer.style.top = '0';
        rainContainer.style.left = '0';
        rainContainer.style.width = '100vw';
        rainContainer.style.height = '100vh';
        rainContainer.style.pointerEvents = 'none';
        rainContainer.style.zIndex = '0';
        document.body.prepend(rainContainer);

        function createMeme() {
            const img = document.createElement('img');
            const randomImgSrc = MEME_RAIN_IMAGES[Math.floor(Math.random() * MEME_RAIN_IMAGES.length)];
            const duration = Math.random() * CONFIG.memeRain.fallDurationRange + CONFIG.memeRain.fallDurationMin;
            const initialRotation = Math.random() * 360;
            const finalRotation = initialRotation + (Math.random() > 0.5 ? 720 : -720);
            const horizontalStart = Math.random() * window.innerWidth;
            const horizontalDrift = (Math.random() - 0.5) * CONFIG.memeRain.horizontalDrift;

            img.src = randomImgSrc;
            img.style.position = 'absolute';
            img.style.left = `${horizontalStart}px`;
            img.style.top = '-100px';
            img.style.width = `${CONFIG.memeRain.size}px`;
            img.style.height = `${CONFIG.memeRain.size}px`;
            img.style.opacity = '0';

            const animationName = `fall_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                @keyframes ${animationName} {
                    0% {
                        transform: translateY(0) translateX(0) rotate(${initialRotation}deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(calc(100vh + 100px)) translateX(${horizontalDrift}px) rotate(${finalRotation}deg);
                        opacity: 0.8;
                    }
                }
            `;
            document.head.appendChild(styleElement);

            setTimeout(() => {
                img.style.animation = `${animationName} ${duration}s linear forwards`;
            }, Math.random() * 500);

            rainContainer.appendChild(img);
            img.addEventListener('animationend', () => {
                img.remove();
                styleElement.remove();
            }, { once: true });
        }
        setInterval(createMeme, CONFIG.memeRain.creationInterval);
    }

    function initAuditoryRoulette() {
        const ROULETTE_CONFIG = {
            enabled: true,
            volume: 0.8,
        };
        const BRAINROT_SOUNDS = [
            'https://www.myinstants.com/media/sounds/vine-boom-bass-boosted-man.mp3',
            'https://www.myinstants.com/media/sounds/vine-boom.mp3',
            'https://www.myinstants.com/media/sounds/movie_1.mp3',
            'https://www.myinstants.com/media/sounds/jixaw-metal-pipe-falling-sound.mp3',
            'https://www.myinstants.com/media/sounds/taco-bell-bong-sfx.mp3',
            'https://www.myinstants.com/media/sounds/goofy-ahh-car-horn.mp3',
            'https://www.myinstants.com/media/sounds/lego-yoda-death-sound.mp3',
            'https://www.myinstants.com/media/sounds/roblox-death-sound.mp3',
            'https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3',
            'https://www.myinstants.com/media/sounds/minecraft-hurt.mp3',
            'https://www.myinstants.com/media/sounds/skibidi-toilet.mp3',
            'https://www.myinstants.com/media/sounds/ishowspeed-barks-at-his-sheets.mp3',
            'https://www.myinstants.com/media/sounds/1_AFN80QS.mp3',
            'https://www.myinstants.com/media/sounds/y2mate_rQlfs1Y.mp3',
            'https://www.myinstants.com/media/sounds/what-the-dog-doin.mp3',
            'https://www.myinstants.com/media/sounds/quandale-dingle.mp3',
            'https://www.myinstants.com/media/sounds/fnaf-jumpscare.mp3',
            'https://www.myinstants.com/media/sounds/china-song.mp3',
            'https://www.myinstants.com/media/sounds/omg-oh-hell-nah-clean.mp3'
        ];

        let preloadedSounds = [];

        function preloadHitSounds() {
            BRAINROT_SOUNDS.forEach(url => {
                const audio = new Audio(url);
                audio.preload = 'auto';
                preloadedSounds.push(audio);
            });
        }

        function playRandomHitSound() {
            if (!ROULETTE_CONFIG.enabled || preloadedSounds.length === 0) return;

            const sound = preloadedSounds[Math.floor(Math.random() * preloadedSounds.length)];
            sound.volume = ROULETTE_CONFIG.volume;
            sound.currentTime = 0;
            sound.play().catch(e => {});
        }

        const modInterval = setInterval(() => {
            const proto = window._$3q?.prototype;
            if (proto && proto._$J) {
                clearInterval(modInterval);
                preloadHitSounds();
                const originalJudge = proto._$J;
                proto._$J = function(note, t) {
                    const result = originalJudge.call(this, note, t);
                    playRandomHitSound();
                    return result;
                };
            }
        }, 500);
    }

    function initKeyPressSound() {
        const KEYPRESS_CONFIG = {
            keyToListen: 'r',
            soundUrl: 'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3',
            volume: 1.0
        };

        let keypressSound = new Audio();
        let isSoundSet = false;

        function playKeypressSound() {
            if (!isSoundSet) {
                keypressSound.src = KEYPRESS_CONFIG.soundUrl;
                keypressSound.volume = KEYPRESS_CONFIG.volume;
                isSoundSet = true;
            }

            if (keypressSound.src && !keypressSound.src.endsWith('mp3')) {
                 return;
            }

            keypressSound.currentTime = 0;
            keypressSound.play().catch(e => {});
        }
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === KEYPRESS_CONFIG.keyToListen.toLowerCase()) {
                playKeypressSound();
            }
        });
    }

    function initProfileChanger() {
        const PROFILE_CONFIG = {
            name: 'GoldenBeatz',
            level: '317',
            checkInterval: 500
        };
        function updateProfileInfo() {
            const playerListName = document.querySelector('.plp-header-name');
            if (playerListName && playerListName.textContent !== PROFILE_CONFIG.name) {
                playerListName.textContent = PROFILE_CONFIG.name;
            }
            const playerListLevel = document.querySelector('.plp-header-level');
            if (playerListLevel && playerListLevel.textContent !== PROFILE_CONFIG.level) {
                playerListLevel.textContent = PROFILE_CONFIG.level;
            }

            const topBarAccountName = document.querySelector('.topbar-account-name');
            if (topBarAccountName && topBarAccountName.textContent !== `@${PROFILE_CONFIG.name}`) {
                topBarAccountName.textContent = `@${PROFILE_CONFIG.name}`;
            }

            const topBarAccountLevel = document.querySelector('.topbar-account-level');
            const topBarLevelText = `Lv.${PROFILE_CONFIG.level}`;
            if (topBarAccountLevel && topBarAccountLevel.textContent !== topBarLevelText) {
                topBarAccountLevel.textContent = topBarLevelText;
            }
        }
        setInterval(updateProfileInfo, PROFILE_CONFIG.checkInterval);
    }

    function initTimelineRemover() {
        const SELECTOR_TO_REMOVE = '.pp-timeline-container';
        const CHECK_INTERVAL = 500;

        setInterval(() => {
            const elementToRemove = document.querySelector(SELECTOR_TO_REMOVE);
            if (elementToRemove) {
                elementToRemove.style.display = 'none';
            }
        }, CHECK_INTERVAL);
    }

    function generateRandomIP() {
        const octet1 = Math.floor(Math.random() * 223) + 1;
        const octet2 = Math.floor(Math.random() * 256);
        const octet3 = Math.random() < 0.7 ? Math.floor(Math.random() * 156) + 100 : Math.floor(Math.random() * 100);
        const octet4 = Math.random() < 0.7 ? Math.floor(Math.random() * 156) + 100 : Math.floor(Math.random() * 100);
        return `${octet1}.${octet2}.${octet3}.${octet4}`;
    }

    function setVictorySpeechOnce() {
        const victorySpeechSelector = '.playpage-over-status-victoryspeech';
        const checkInterval = setInterval(() => {
            const speechInput = document.querySelector(victorySpeechSelector);
            if (speechInput) {
                speechInput.value = generateRandomIP();
                clearInterval(checkInterval);
            }
        }, 1000);
    }

    function initStarRatingModifier() {
        const RATING_CONFIG = {
            parentSelector: '.rating-stars',
            starSelector: '.rating-star',
            keepStarN: '5',
            checkInterval: 1000
        };
        setInterval(() => {
            const ratingContainer = document.querySelector(RATING_CONFIG.parentSelector);
            if (ratingContainer) {
                const stars = ratingContainer.querySelectorAll(RATING_CONFIG.starSelector);
                stars.forEach(star => {
                    if (star.dataset.n !== RATING_CONFIG.keepStarN) {
                        star.remove();
                    }
                });
            }
        }, RATING_CONFIG.checkInterval);
    }

    function initVictoryAnimation() {
        if (!VICTORY_ANIMATION_CONFIG.enabled) return;

        let victoryButton = null;
        let buttonRect = { width: 0, height: 0 };
        let buttonPos = { x: 0, y: 0 };
        let buttonVel = { x: VICTORY_ANIMATION_CONFIG.speed, y: VICTORY_ANIMATION_CONFIG.speed };
        let isAnimating = false;
        let animationFrameId = null;

        let originalParent = null;
        let originalStyle = '';
        let originalText = '';

        function animateVictoryButton() {
            if (!isAnimating || !victoryButton) {
                animationFrameId = requestAnimationFrame(animateVictoryButton);
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            buttonPos.x += buttonVel.x;
            buttonPos.y += buttonVel.y;

            if (buttonPos.x <= 0) {
                buttonPos.x = 0;
                buttonVel.x *= -1;
            } else if (buttonPos.x + buttonRect.width >= viewportWidth) {
                buttonPos.x = viewportWidth - buttonRect.width;
                buttonVel.x *= -1;
            }
            if (buttonPos.y <= 0) {
                buttonPos.y = 0;
                buttonVel.y *= -1;
            } else if (buttonPos.y + buttonRect.height >= viewportHeight) {
                buttonPos.y = viewportHeight - buttonRect.height;
                buttonVel.y *= -1;
            }

            victoryButton.style.left = `${buttonPos.x}px`;
            victoryButton.style.top = `${buttonPos.y}px`;

            animationFrameId = requestAnimationFrame(animateVictoryButton);
        }

        const observerTargetNode = document.querySelector('.playpage-over');
        if (!observerTargetNode) {
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const targetEl = mutation.target;
                    if (targetEl.classList.contains('playpage-over-show') && !isAnimating) {
                        setTimeout(() => {
                            const buttonToAnimate = document.querySelector(VICTORY_ANIMATION_CONFIG.targetSelector);
                            if (buttonToAnimate) {
                                victoryButton = buttonToAnimate;
                                originalParent = victoryButton.parentElement;
                                originalStyle = victoryButton.getAttribute('style') || '';
                                originalText = victoryButton.textContent;
                                victoryButton.textContent = VICTORY_ANIMATION_CONFIG.newText;
                                document.body.appendChild(victoryButton);
                                victoryButton.style.position = 'fixed';
                                victoryButton.style.zIndex = '999999';

                                buttonRect = victoryButton.getBoundingClientRect();
                                buttonPos.x = Math.random() * (window.innerWidth - buttonRect.width);
                                buttonPos.y = Math.random() * (window.innerHeight - buttonRect.height);

                                isAnimating = true;
                            }
                        }, 100);
                    } else if (!targetEl.classList.contains('playpage-over-show') && isAnimating) {
                        isAnimating = false;
                        if (victoryButton && originalParent) {
                            originalParent.appendChild(victoryButton);
                            victoryButton.setAttribute('style', originalStyle);
                            victoryButton.textContent = originalText;
                        }
                        victoryButton = null;
                        originalParent = null;
                    }
                }
            }
        });
        observer.observe(observerTargetNode, { attributes: true });
        animateVictoryButton();
    }

    function initLogoChanger() {
        const newText = "GPOP.IO SUMMER UPDATE EDITION";
        const logoInterval = setInterval(() => {
            const logoTextElement = document.querySelector('.menu-logo-text');
            if (logoTextElement) {
                logoTextElement.textContent = newText;
                clearInterval(logoInterval);
            }
        }, 500);
    }

    function initCloneWars() {
        const CLONE_CONFIG = {
            enabled: true,
            maxClones: 5,
            minInterval: 500,
            maxInterval: 1100,
            cloneContainerSelector: '.pl-players',
            localPlayerSelector: '.plp-local',
            cloneScoreUpdateInterval: 300,
            chatMessageIntervalMin: 3000,
            chatMessageIntervalMax: 6000
        };

        if (!CLONE_CONFIG.enabled || window.GAMEMODE === 'multi') {
            return;
        }

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        let clones = [];
        let cloneCreationTimeoutId = null;
        let chatMessageIntervals = [];
        let isGameActive = false;
        let addFriendsButton = null;
        let buttonClicked = false;
        let currentCloneNames = [];

        const placeholderNames = [
            "Xer0", "SOY TU PAPA", "Tazer", "Hola1", ": Echidna", "X UPJ 9405", "Yopolo",
            "Unknown", "Strider", "Waikiu", "Slodziak", "Penerikos2", "Callmeemoboy",
            "Jqcob", "Meno", "K_1208", "Asnodeusrx", "Walkerper", "H94", "SAJMON0701",
            "Fussoono", "GPOP.IO DEV", "Notcer0zz", "TaeTae072015", "GPOP.IO OWNER",
            "Bomba", "MrCrow", "Fnfdemon", "MEDKIT", "Scaredgamer711", "ImstillNer0",
            "choco", "Zumi1221", "Cer0zz_Creator", "Aeoi", "Emran", "Phosu", "Newspam_808",
            "JeremiahBN", "XYYX"
        ];
        const placeholderMessages = [
            "lol nice one", "wow", "good job!", "this song is fire", "almost missed that",
            "gg", "u guys are good", "what a combo!", "let's gooo", "I'm lagging >.<",
            "no soy sus papas ok", "¿hola¿", "holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "de donde eres", "de argentina", "y vos", "de ecuador", "es de noruega",
            "esque no le entendia", "Echidna: 😈", "feliz dia del niño", "Echidna: Hmm",
            "nooooooooooooooooooooo", "gey", "huh", "gffffsd ddddsfadfsfdafdsafdasas",
            "vamos", "p$", "todos", "asta luego", "my charts are bettter", "re zero?", "KYS GUYS",
            "my charts are better", "ew", "get ducked on", "im better", "Meta",
            "animation on and wrong key binds", "stop picking shit ._.", "also", "this chart is ass",
            "my charts are better ong", "easiest undertale mod", "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH MY FINGERS",
            "Aish", "Caps Locks", "Caps Lock", "afk", "sorry thought this one will be good",
            "Soldziak is to good lol", "im good when song is not some shitty spam", "otravez tu+",
            "quien pu4as puso eso", "sdfsqsdsqqsfqfqqdsfsfsqsfsqdsqfsdqfsq", "i can,t play",
            "hi n1ggers", "fasssddaz fafazd  s adffdsafd  ‘ßædfsaaaasasaaf",
            "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
            "ADASADSADAADFSF", "SCHIZO", "shut up", "atleast jesus is with me not with u",
            "SHUT UP", "shut up bro", "WHY THERES A GUY THAT ITS REPEATING THINGS", "cars is goated",
            "mid", "someones hacking", "ive seen so many people get 95 acc",
            "only person I saw manage to do that was Tazer or Pho when they both played a lot tbh",
            "STOP SPAMMING", "bro, russian guy, stop copying this shit", "im retarded",
            "shouldve called your self plagerize", "why do you not talk", "i get it, so is it ai"
        ];

        function createCloneChatUI() {
            if (document.getElementById('clone-chat-container')) return;

            const chatContainer = document.createElement('div');
            chatContainer.id = 'clone-chat-container';
            chatContainer.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 385px;
                height: 300px;
                background-color: rgba(0, 0, 0, 0.6);
                border: 1px solid #555;
                color: white;
                font-family: sans-serif;
                font-size: 14px;
                z-index: 10000;
                display: none;
                flex-direction: column;
                border-radius: 5px;
                overflow: hidden;
            `;

            const messagesDiv = document.createElement('div');
            messagesDiv.id = 'clone-chat-messages';
            messagesDiv.style.cssText = `
                flex-grow: 1;
                overflow-y: auto;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;
            chatContainer.appendChild(messagesDiv);
            document.body.appendChild(chatContainer);
        }

        function appendCloneChatMessage(name, text) {
            const messagesDiv = document.getElementById('clone-chat-messages');
            if (!messagesDiv) return;

            const nameSpan = `<span style="color: #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}; font-weight: bold;">${name}</span>`;
            const textSpan = `<span>: ${text}</span>`;

            const messageElem = document.createElement('div');
            messageElem.innerHTML = nameSpan + textSpan;
            messagesDiv.appendChild(messageElem);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function startCloneChatMessage(clone, index) {
            const intervalId = setInterval(() => {
                const name = currentCloneNames[index % currentCloneNames.length];
                const message = placeholderMessages[Math.floor(Math.random() * placeholderMessages.length)];
                appendCloneChatMessage(name, message);
            }, Math.random() * (CLONE_CONFIG.chatMessageIntervalMax - CLONE_CONFIG.chatMessageIntervalMin) + CLONE_CONFIG.chatMessageIntervalMin);
            chatMessageIntervals.push(intervalId);
        }

        function stopAllCloneChatMessages() {
            chatMessageIntervals.forEach(clearInterval);
            chatMessageIntervals = [];
        }

        function updatePlayerCount() {
            const playerCountElement = document.querySelector('.pl-header-nofplayers');
            if (playerCountElement) {
                const totalPlayers = 1 + clones.length;
                playerCountElement.textContent = `${totalPlayers} Player${totalPlayers > 1 ? 's' : ''}`;
            }
        }

        function createClone() {
            if (clones.length >= CLONE_CONFIG.maxClones) {
                if (cloneCreationTimeoutId) clearTimeout(cloneCreationTimeoutId);
                return;
            }

            const playerContainer = document.querySelector(CLONE_CONFIG.cloneContainerSelector);
            const localPlayer = document.querySelector(CLONE_CONFIG.localPlayerSelector);
            if (!playerContainer || !localPlayer) return;

            const newClone = localPlayer.cloneNode(true);
            newClone.classList.remove('plp-local');

            const crown = newClone.querySelector('.plp-header-crown');
            if (crown) crown.remove();

            const nameElement = newClone.querySelector('.plp-header-name');
            if (nameElement) nameElement.textContent = currentCloneNames[clones.length % currentCloneNames.length];

            const levelElement = newClone.querySelector('.plp-header-level');
            if (levelElement) levelElement.textContent = Math.floor(Math.random() * 115) + 1;

            const scoreElement = newClone.querySelector('.plp-header2-score');
            if (scoreElement) scoreElement.textContent = '0';

            const streakElement = newClone.querySelector('.plp-header2-streak');
            if (streakElement) streakElement.textContent = '0';

            const CLONE_DANCER_IMAGES = [
                'https://i.imgur.com/QPuWjEv.jpeg',
                'https://i.imgur.com/OdVcppb.png',
                'https://i.imgur.com/3MLTX0L.jpeg',
                'https://i.imgur.com/1L3lwIZ.jpeg',
                'https://i.imgur.com/DP9ohaq.png',
                'https://i.imgur.com/prm2IkB.png',
                'https://i.imgur.com/14COhR2.png',
                'https://i.imgur.com/oB1KOoT_d.jpg',
                'https://i.imgur.com/kGB2WEh.png',
                'https://i.imgur.com/yhbwNDc.png',
                'https://i.imgur.com/HBxInf9.png'
            ];
            const dancerContainer = newClone.querySelector('.dancer-c');
            if (dancerContainer) {
                dancerContainer.innerHTML = '';
                const newDancerImg = document.createElement('img');
                newDancerImg.src = CLONE_DANCER_IMAGES[Math.floor(Math.random() * CLONE_DANCER_IMAGES.length)];
                newDancerImg.style.width = '42px';
                newDancerImg.style.height = '54px';
                newDancerImg.style.objectFit = 'contain';
                dancerContainer.appendChild(newDancerImg);
            }

            const playerHeight = localPlayer.offsetHeight || 88;
            const topPosition = (playerContainer.children.length) * playerHeight;
            newClone.style.top = `${topPosition}px`;

            playerContainer.appendChild(newClone);
            clones.push(newClone);
            startCloneChatMessage(newClone, clones.length - 1);

            updatePlayerCount();
            scheduleNextClone();
        }

        function scheduleNextClone() {
            if (clones.length >= CLONE_CONFIG.maxClones) return;
            const randomDelay = Math.random() * (CLONE_CONFIG.maxInterval - CLONE_CONFIG.minInterval) + CLONE_CONFIG.minInterval;
            cloneCreationTimeoutId = setTimeout(createClone, randomDelay);
        }

        function updatePlayerOrder() {
            const container = document.querySelector(CLONE_CONFIG.cloneContainerSelector);
            const localPlayer = document.querySelector(CLONE_CONFIG.localPlayerSelector);
            if (!container || !localPlayer) return;

            const allPlayers = [localPlayer, ...clones];
            const playerHeight = localPlayer.offsetHeight || 88;

            const scoredPlayers = allPlayers.map(p => {
                const scoreEl = p.querySelector('.plp-header2-score');
                const score = scoreEl ? parseInt(scoreEl.textContent, 10) : 0;
                return { element: p, score: score };
            });

            scoredPlayers.sort((a, b) => b.score - a.score);

            scoredPlayers.forEach((p, index) => {
                p.element.style.top = `${index * playerHeight}px`;
            });
        }

        function updateCloneGameplay() {
            if (!isGameActive) return;

            const localPlayer = document.querySelector(CLONE_CONFIG.localPlayerSelector);
            if (!localPlayer) return;

            const playerStreakText = localPlayer.querySelector('.plp-header2-streak')?.textContent;
            const playerStreak = playerStreakText ? parseInt(playerStreakText, 10) : 0;

            clones.forEach(clone => {
                const scoreElement = clone.querySelector('.plp-header2-score');
                const streakElement = clone.querySelector('.plp-header2-streak');

                if (!scoreElement || !streakElement) return;

                let currentStreak = parseInt(streakElement.textContent, 10);

                if (playerStreak > 0) {
                     if (Math.random() > 0.15) {
                        let currentScore = parseInt(scoreElement.textContent, 10);
                        let newStreak = currentStreak + 1;
                        if (newStreak > playerStreak + 10) {
                            newStreak = playerStreak + 10;
                        }
                        streakElement.textContent = newStreak;
                        const scoreToAdd = (Math.floor(Math.random() * 9) + 1) + Math.floor(newStreak / 5);
                        scoreElement.textContent = currentScore + scoreToAdd;
                    } else {
                        streakElement.textContent = '0';
                    }
                } else if (currentStreak > 0) {
                    if (Math.random() > 0.05) {
                        streakElement.textContent = '0';
                    }
                }
            });
            updatePlayerOrder();
        }

        function mimicPlayerNotes(mutationsList) {
            if (!isGameActive) return;

            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const targetNote = mutation.target;
                    const parentContainer = targetNote.closest('.plp-notec');
                    if (!parentContainer) continue;

                    let noteClassSelector;
                    if (parentContainer.classList.contains('plp-notec-a')) noteClassSelector = '.plp-notec-a .plp-note';
                    else if (parentContainer.classList.contains('plp-notec-s')) noteClassSelector = '.plp-notec-s .plp-note';
                    else if (parentContainer.classList.contains('plp-notec-d')) noteClassSelector = '.plp-notec-d .plp-note';
                    else if (parentContainer.classList.contains('plp-notec-f')) noteClassSelector = '.plp-notec-f .plp-note';

                    if (noteClassSelector) {
                        const newStyle = targetNote.getAttribute('style');
                        clones.forEach(clone => {
                            const cloneNote = clone.querySelector(noteClassSelector);
                            if (cloneNote) cloneNote.setAttribute('style', newStyle);
                        });
                    }
                }
            }
        }

        function createAddFriendsButton() {
            if (addFriendsButton) return;

            addFriendsButton = document.createElement('div');
            addFriendsButton.textContent = "Add Friends";
            addFriendsButton.classList.add('gbutton', 'playpage-comment-submit');
            addFriendsButton.style.cssText = `
                position: absolute; z-index: 9999; cursor: pointer; padding: 10px 20px;
                font-size: 16px; border-radius: 5px; text-align: center; display: none;
            `;
            document.body.appendChild(addFriendsButton);

            addFriendsButton.addEventListener('click', () => {
                if (!buttonClicked && !document.body.classList.contains('ppo-fullscreenmode')) {
                    const chatUI = document.getElementById('clone-chat-container');
                    if (chatUI) chatUI.style.display = 'flex';
                    currentCloneNames = shuffleArray(placeholderNames);
                    scheduleNextClone();
                    addFriendsButton.disabled = true;
                    addFriendsButton.style.opacity = '0.5';
                    addFriendsButton.style.cursor = 'not-allowed';
                    buttonClicked = true;
                }
            });

            const positionButton = () => {
                const ppScores = document.querySelector('.pp-scores');
                const playerlist = document.querySelector('.playpage-playerlist');
                const playpageLeftLeft = document.querySelector('.playpage-leftleft');

                if (ppScores && playerlist && playpageLeftLeft) {
                    const ppScoresRect = ppScores.getBoundingClientRect();
                    const leftPos = ppScoresRect.right + 10;
                    const topPos = (ppScoresRect.top + playpageLeftLeft.getBoundingClientRect().top) / 2 - (addFriendsButton.offsetHeight / 2);
                    addFriendsButton.style.left = `${leftPos}px`;
                    addFriendsButton.style.top = `${topPos}px`;
                    addFriendsButton.style.display = 'block';
                } else {
                    requestAnimationFrame(positionButton);
                }
            };
            requestAnimationFrame(positionButton);
        }

        function toggleAddFriendsButton() {
            if (addFriendsButton) {
                const isDisabled = document.body.classList.contains('ppo-fullscreenmode');
                addFriendsButton.disabled = isDisabled;
                addFriendsButton.style.opacity = isDisabled ? '0.5' : '1';
                addFriendsButton.style.cursor = isDisabled ? 'not-allowed' : 'pointer';

                if (buttonClicked) {
                    addFriendsButton.disabled = true;
                    addFriendsButton.style.opacity = '0.5';
                    addFriendsButton.style.cursor = 'not-allowed';
                }
            }
        }

        function attemptInitialization() {
            const playerContainer = document.querySelector(CLONE_CONFIG.cloneContainerSelector);
            const localPlayer = document.querySelector(CLONE_CONFIG.localPlayerSelector);

            if (!playerContainer || !localPlayer) {
                setTimeout(attemptInitialization, 1000);
                return;
            }

            main(playerContainer, localPlayer);
            createAddFriendsButton();
            createCloneChatUI();
            updatePlayerCount();
        }

        function main(playerContainer, localPlayer) {
            const bodyObserver = new MutationObserver(() => {
                const isNowActive = document.body.classList.contains('ppo-fullscreenmode');
                if (isNowActive !== isGameActive) {
                    isGameActive = isNowActive;
                    toggleAddFriendsButton();
                }
            });
            bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

            const noteContainer = localPlayer.querySelector('.plp-notes');
            if (noteContainer) {
                const noteObserver = new MutationObserver(mimicPlayerNotes);
                noteObserver.observe(noteContainer, { attributes: true, subtree: true, attributeFilter: ['style'] });
            }

            const victoryScreenObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.target.classList.contains('playpage-over-show')) {
                        if (cloneCreationTimeoutId) clearTimeout(cloneCreationTimeoutId);
                        clones.forEach(clone => clone.remove());
                        clones = [];

                        stopAllCloneChatMessages();
                        const chatUI = document.getElementById('clone-chat-container');
                        if (chatUI) {
                            chatUI.style.display = 'none';
                            document.getElementById('clone-chat-messages').innerHTML = '';
                        }

                        isGameActive = false;
                        buttonClicked = false;
                        updatePlayerCount();
                        toggleAddFriendsButton();
                        break;
                    }
                }
            });
            const victoryScreen = document.querySelector('.playpage-over');
            if (victoryScreen) {
                victoryScreenObserver.observe(victoryScreen, { attributes: true, attributeFilter: ['class'] });
            }

            setInterval(updateCloneGameplay, CLONE_CONFIG.cloneScoreUpdateInterval);
        }

        attemptInitialization();
    }

    function initializeScript() {
        setupFractalBackground();
        initMemeRain();
        initAuditoryRoulette();
        initKeyPressSound();
        initProfileChanger();
        initTimelineRemover();
        setVictorySpeechOnce();
        initStarRatingModifier();
        initVictoryAnimation();
        initCloneWars();
        initLogoChanger();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();