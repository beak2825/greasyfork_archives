// ==UserScript==
// @name         Shell Shockers Party Theme 🎉
// @version      1.5
// @namescpace   
// @description  Boring shell shockers colors? Bore no more! This theme introduces a gui that gives options to change the colors. Some features like the Performance Settings are still in making. Thank you. Make sure to subscribe to my channel.
// @match        https://algebra.best/*
// @match        https://algebra.vip/*

// @match        https://biologyclass.club/*

// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*

// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*

// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*

// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*

// @match        https://new.shellshock.io/*

// @match        https://overeasy.club/*

// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://shellshock.io/*
// @match        https://scrambled.world/*
// @match        https://shellshockers.today/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.today/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*

// @match        https://urbanegger.com/*

// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*

// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*

// @match        https://zygote.cafe/*

// @license      GPL 3.0

// @grant        none
// @namespace https://greasyfork.org/users/1374094
// @downloadURL https://update.greasyfork.org/scripts/533367/Shell%20Shockers%20Party%20Theme%20%F0%9F%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533367/Shell%20Shockers%20Party%20Theme%20%F0%9F%8E%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = document.createElement('style');
    styles.innerHTML = `
        @keyframes rainbowHue {
            0%   { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        @keyframes pulseGlow {
            0%, 100% { filter: brightness(1) contrast(1) saturate(1); }
            50% { filter: brightness(1.4) contrast(1.4) saturate(2); }
        }
        @keyframes synthGlow {
            0%, 100% { filter: brightness(0.9) contrast(1.2) hue-rotate(280deg) saturate(2); }
            50% { filter: brightness(1.1) contrast(1.5) hue-rotate(320deg) saturate(3); }
        }
        @keyframes xrayFlash {
            0% { filter: grayscale(1) contrast(2) hue-rotate(0deg); }
            50% { filter: grayscale(0.5) contrast(2.5) hue-rotate(180deg); }
            100% { filter: grayscale(1) contrast(2) hue-rotate(360deg); }
        }
        @keyframes iceFade {
            0% { filter: hue-rotate(180deg) brightness(0.9); }
            50% { filter: hue-rotate(200deg) brightness(1.1); }
            100% { filter: hue-rotate(180deg) brightness(0.9); }
        }
        @keyframes flameWave {
            0% { filter: hue-rotate(10deg) brightness(1); }
            50% { filter: hue-rotate(30deg) brightness(1.2) saturate(1.5); }
            100% { filter: hue-rotate(10deg) brightness(1); }
        }

        #visual-mode-menu {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 6px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 13px;
            z-index: 99999;
            width: 220px;
            overflow-y: auto;
        }
        #visual-mode-menu summary {
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .mode-option, .slider-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .mode-option label, .slider-option label {
            flex: 1;
        }
        .mode-option input[type="checkbox"], .slider-option input[type="checkbox"] {
            margin-left: 6px;
        }
        .slider {
            width: 70%;
        }
        .slider-value {
            width: 30%;
            text-align: center;
        }
    `;
    document.head.appendChild(styles);

    const modes = {
        rainbow: { anim: 'rainbowHue 5s linear infinite', key: '1' },
        pulse: { anim: 'pulseGlow 4s ease-in-out infinite', key: '2' },
        synth: { anim: 'synthGlow 6s ease-in-out infinite', key: '3' },
        xray: { anim: 'xrayFlash 3s linear infinite', key: '4' },
        ice: { anim: 'iceFade 5s ease-in-out infinite', key: '5' },
        flame: { anim: 'flameWave 4s ease-in-out infinite', key: '6' },
        disco: { anim: 'disco', key: '7' } // handled separately
    };

    let activeMode = null;
    let settings = {
        animationSpeed: 1,  // 1 is default, can be adjusted with a slider
        animationIntensity: 1,  // 1 is default, can be adjusted with a slider
        disableEffects: [],  // stores the list of effects that are disabled
        guiSize: 220,  // default GUI size
        draggable: false  // draggable option
    };

    const container = document.body;
    const gameElements = ["body", "canvas", "#game-shell"];

    const applyMode = (mode) => {
        clearDisco();
        activeMode = mode;
        gameElements.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.animation = mode === 'disco' ? '' : modes[mode].anim;
        });

        if (mode === 'disco') {
            startDisco();
        }
    };

    const clearDisco = () => {
        clearInterval(window._discoInterval);
        container.style.filter = '';
    };

    const startDisco = () => {
        window._discoInterval = setInterval(() => {
            const deg = Math.floor(Math.random() * 360);
            container.style.filter = `hue-rotate(${deg}deg) brightness(1.2)`;
        }, 1000);
    };

    const makeGUI = () => {
        const menu = document.createElement('details');
        menu.id = 'visual-mode-menu';
        const summary = document.createElement('summary');
        summary.textContent = '🎉 Party Theme Modes';
        menu.appendChild(summary);

        Object.keys(modes).forEach(mode => {
            const option = document.createElement('div');
            option.className = 'mode-option';

            const label = document.createElement('label');
            label.textContent = `${mode.charAt(0).toUpperCase() + mode.slice(1)} [${modes[mode].key}]`;
            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.onchange = () => {
                if (toggle.checked) {
                    applyMode(mode);
                } else {
                    clearDisco();
                    activeMode = null;
                    gameElements.forEach(sel => {
                        const el = document.querySelector(sel);
                        if (el) el.style.animation = '';
                    });
                }
            };

            option.appendChild(label);
            option.appendChild(toggle);
            menu.appendChild(option);
        });

        // Performance Settings Section
        const performanceSection = document.createElement('details');
        performanceSection.innerHTML = '<summary>Performance Settings</summary>';

        const animationSpeedLabel = document.createElement('label');
        animationSpeedLabel.textContent = 'Animation Speed';
        const animationSpeedSlider = document.createElement('input');
        animationSpeedSlider.type = 'range';
        animationSpeedSlider.min = '0.1';
        animationSpeedSlider.max = '2';
        animationSpeedSlider.step = '0.1';
        animationSpeedSlider.value = settings.animationSpeed;
        animationSpeedSlider.className = 'slider';
        const animationSpeedValue = document.createElement('input');
        animationSpeedValue.type = 'number';
        animationSpeedValue.value = settings.animationSpeed;
        animationSpeedValue.className = 'slider-value';
        animationSpeedSlider.oninput = (e) => {
            settings.animationSpeed = e.target.value;
            animationSpeedValue.value = e.target.value;
            updateAnimationSpeed();
        };
        animationSpeedValue.oninput = (e) => {
            settings.animationSpeed = e.target.value;
            animationSpeedSlider.value = e.target.value;
            updateAnimationSpeed();
        };
        const speedOption = document.createElement('div');
        speedOption.className = 'slider-option';
        speedOption.appendChild(animationSpeedLabel);
        speedOption.appendChild(animationSpeedSlider);
        speedOption.appendChild(animationSpeedValue);
        performanceSection.appendChild(speedOption);

        const animationIntensityLabel = document.createElement('label');
        animationIntensityLabel.textContent = 'Animation Intensity';
        const animationIntensitySlider = document.createElement('input');
        animationIntensitySlider.type = 'range';
        animationIntensitySlider.min = '0.1';
        animationIntensitySlider.max = '2';
        animationIntensitySlider.step = '0.1';
        animationIntensitySlider.value = settings.animationIntensity;
        const animationIntensityValue = document.createElement('input');
        animationIntensityValue.type = 'number';
        animationIntensityValue.value = settings.animationIntensity;
        animationIntensityValue.className = 'slider-value';
        animationIntensitySlider.oninput = (e) => {
            settings.animationIntensity = e.target.value;
            animationIntensityValue.value = e.target.value;
            updateAnimationIntensity();
        };
        animationIntensityValue.oninput = (e) => {
            settings.animationIntensity = e.target.value;
            animationIntensitySlider.value = e.target.value;
            updateAnimationIntensity();
        };
        const intensityOption = document.createElement('div');
        intensityOption.className = 'slider-option';
        intensityOption.appendChild(animationIntensityLabel);
        intensityOption.appendChild(animationIntensitySlider);
        intensityOption.appendChild(animationIntensityValue);
        performanceSection.appendChild(intensityOption);

        const disableEffectsLabel = document.createElement('label');
        disableEffectsLabel.textContent = 'Disable Heavy Effects (Disco, X-ray)';
        const disableEffectsCheckbox = document.createElement('input');
        disableEffectsCheckbox.type = 'checkbox';
        disableEffectsCheckbox.onchange = () => {
            if (disableEffectsCheckbox.checked) {
                settings.disableEffects.push('disco', 'xray');
            } else {
                settings.disableEffects = settings.disableEffects.filter(effect => effect !== 'disco' && effect !== 'xray');
            }
        };
        performanceSection.appendChild(disableEffectsLabel);
        performanceSection.appendChild(disableEffectsCheckbox);

        // GUI Settings Section
        const guiSettingsSection = document.createElement('details');
        guiSettingsSection.innerHTML = '<summary>GUI Settings</summary>';

        const draggableLabel = document.createElement('label');
        draggableLabel.textContent = 'Enable Draggable GUI';
        const draggableCheckbox = document.createElement('input');
        draggableCheckbox.type = 'checkbox';
        draggableCheckbox.onchange = () => {
            settings.draggable = draggableCheckbox.checked;
            if (settings.draggable) makeDraggable(menu);
        };
        guiSettingsSection.appendChild(draggableLabel);
        guiSettingsSection.appendChild(draggableCheckbox);

        const guiSizeLabel = document.createElement('label');
        guiSizeLabel.textContent = 'GUI Size';
        const guiSizeSlider = document.createElement('input');
        guiSizeSlider.type = 'range';
        guiSizeSlider.min = '180';
        guiSizeSlider.max = '300';
        guiSizeSlider.step = '10';
        guiSizeSlider.value = settings.guiSize;
        guiSizeSlider.className = 'slider';
        const guiSizeValue = document.createElement('input');
        guiSizeValue.type = 'number';
        guiSizeValue.value = settings.guiSize;
        guiSizeValue.className = 'slider-value';
        guiSizeSlider.oninput = (e) => {
            settings.guiSize = e.target.value;
            guiSizeValue.value = e.target.value;
            updateGUI();
        };
        guiSizeValue.oninput = (e) => {
            settings.guiSize = e.target.value;
            guiSizeSlider.value = e.target.value;
            updateGUI();
        };
        const guiSizeOption = document.createElement('div');
        guiSizeOption.className = 'slider-option';
        guiSizeOption.appendChild(guiSizeLabel);
        guiSizeOption.appendChild(guiSizeSlider);
        guiSizeOption.appendChild(guiSizeValue);
        guiSettingsSection.appendChild(guiSizeOption);

        menu.appendChild(performanceSection);
        menu.appendChild(guiSettingsSection);

        document.body.appendChild(menu);
    };

    const updateGUI = () => {
        const menu = document.getElementById('visual-mode-menu');
        menu.style.width = `${settings.guiSize}px`;
    };

    const updateAnimationSpeed = () => {
        Object.keys(modes).forEach(mode => {
            if (!settings.disableEffects.includes(mode)) {
                const speed = settings.animationSpeed;
                modes[mode].anim = `${modes[mode].anim.split(' ')[0]} ${speed}s linear infinite`;
            }
        });
    };

    const updateAnimationIntensity = () => {
        Object.keys(modes).forEach(mode => {
            if (!settings.disableEffects.includes(mode)) {
                const intensity = settings.animationIntensity;
                // Adjust intensity in your effects here if necessary
            }
        });
    };

    const makeDraggable = (menu) => {
        let isDragging = false;
        let offsetX, offsetY;
        menu.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
        });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - offsetX}px`;
                menu.style.top = `${e.clientY - offsetY}px`;
            }
        });
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };

    makeGUI();

    const keybinds = {
        '1': 'rainbow',
        '2': 'pulse',
        '3': 'synth',
        '4': 'xray',
        '5': 'ice',
        '6': 'flame',
        '7': 'disco',
        '0': 'off'
    };

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (keybinds[key]) {
            if (keybinds[key] === 'off') {
                clearDisco();
                activeMode = null;
                gameElements.forEach(sel => {
                    const el = document.querySelector(sel);
                    if (el) el.style.animation = '';
                });
                document.querySelectorAll('.mode-option input[type="checkbox"]').forEach(cb => cb.checked = false);
            } else {
                applyMode(keybinds[key]);
                document.querySelectorAll('.mode-option input[type="checkbox"]').forEach(cb => cb.checked = false);
                const label = [...document.querySelectorAll('.mode-option label')].find(l => l.textContent.toLowerCase().startsWith(keybinds[key]));
                if (label && label.nextElementSibling) label.nextElementSibling.checked = true;
            }
        }
    });
})();
