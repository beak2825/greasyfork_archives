// ==UserScript==
// @name         Accordeur en ligne pour guitare, ukulélé et basse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Accordez votre guitare, ukulélé ou basse en ligne avec cet accordeur pratique.
// @author       YGL
// @match        *://*/*
// @grant        none
// @license       Gnu GPL 3.0.
// @downloadURL https://update.greasyfork.org/scripts/490151/Accordeur%20en%20ligne%20pour%20guitare%2C%20ukul%C3%A9l%C3%A9%20et%20basse.user.js
// @updateURL https://update.greasyfork.org/scripts/490151/Accordeur%20en%20ligne%20pour%20guitare%2C%20ukul%C3%A9l%C3%A9%20et%20basse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const guitarStringFrequencies = {
        'E': 329.6,
        'B': 246.9,
        'G': 196.0,
        'D': 146.8,
        'A': 110.0,
        'E2': 82.4
    };

    const ukuleleStringFrequencies = {
        'A': 440,
        'E': 329.6,
        'C': 261.6,
        'G': 391.995
    };

    const bassStringFrequencies = {
        'G': 98,
        'D': 73.42,
        'A': 55,
        'E': 41.203
    };

    let currentOscillator = null;
    let currentNote = null;
    let useGuitarSounds = false;

    function createButton(imageSrc, id, top, left, clickHandler) {
        const button = document.createElement('img');
        button.src = imageSrc;
        button.id = id;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.left = left;
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.zIndex = '9999';
        button.style.cursor = 'pointer';
        button.addEventListener('click', clickHandler);
        return button;
    }

    function toggleGuitarTuner() {
        const tuner = document.getElementById('guitar-tuner');
        if (tuner) {
            tuner.remove();
            stopAllOscillators();
        } else {
            openGuitarTuner();
        }
    }

    function openGuitarTuner() {
        const guitarTuner = document.createElement('div');
        guitarTuner.id = 'guitar-tuner';
        guitarTuner.style.cssText = 'position:fixed;top:25%;left:25%;width:50%;height:60%;background-color:#191970;border:2px solid #000;padding:10px;z-index:9999;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);';

        const guitarHeader = createHeader('Guitare');
        guitarTuner.appendChild(guitarHeader);
        createStrings(guitarTuner, guitarStringFrequencies);

        const ukuleleSpacer = document.createElement('div');
        ukuleleSpacer.style.height = '20px';
        guitarTuner.appendChild(ukuleleSpacer);

        const ukuleleHeader = createHeader('Ukulele');
        guitarTuner.appendChild(ukuleleHeader);
        createStrings(guitarTuner, ukuleleStringFrequencies);

        const bassSpacer = document.createElement('div');
        bassSpacer.style.height = '20px';
        guitarTuner.appendChild(bassSpacer);

        const bassHeader = createHeader('Basse');
        guitarTuner.appendChild(bassHeader);
        createStrings(guitarTuner, bassStringFrequencies);

        const switchButton = createButton('https://i.ibb.co/7zSpQkz/switch-icon.png', 'switch-button', 'calc(25% - 25px)', 'calc(50% - 25px)', toggleSoundType);
        switchButton.style.filter = 'invert(100%)';
        switchButton.addEventListener('click', function() {
            switchButton.style.backgroundColor = '#ffcc00'; // Change la couleur du bouton lorsqu'on clique dessus
            setTimeout(() => {
                switchButton.style.backgroundColor = ''; // Réinitialise la couleur après un court délai
            }, 300);
        });
        guitarTuner.appendChild(switchButton);

        document.body.appendChild(guitarTuner);
    }

    function createHeader(text) {
        const header = document.createElement('div');
        header.textContent = text;
        header.style.fontWeight = 'bold';
        header.style.fontSize = '24px';
        header.style.color = '#ffffff';
        header.style.marginBottom = '10px';
        return header;
    }

    function createStrings(container, stringFrequencies) {
        for (const [note, frequency] of Object.entries(stringFrequencies)) {
            const stringElement = createStringElement(note, frequency);
            container.appendChild(stringElement);
        }
    }

    function createStringElement(note, frequency) {
        const stringElement = document.createElement('div');
        stringElement.textContent = note;
        stringElement.style.cssText = 'padding:2px;margin-bottom:2px;border-bottom:1px solid #000;cursor:pointer;color:#ffffff';
        stringElement.addEventListener('click', function() {
            toggleStringSound(note, frequency, stringElement);
        });
        return stringElement;
    }

    function toggleStringSound(note, frequency, element) {
        if (currentOscillator && currentNote === note) {
            currentOscillator.stop();
            currentOscillator = null;
            currentNote = null;
            element.style.backgroundColor = ''; // Réinitialise la couleur de fond lorsque l'oscillateur est arrêté
        } else {
            if (currentOscillator) {
                currentOscillator.stop();
            }

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            oscillator.type = useGuitarSounds ? 'sawtooth' : 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            const gainNode = audioContext.createGain();
            let volume = 0.5;

            // Augmente le volume des notes de basse "classic" pour les rendre audibles
            volume = useGuitarSounds ? 1.0 : 1.5;
            gainNode.gain.value = volume;

            // Ajoute un peu plus de gain et de volume à la note "E" pour la distinguer un peu plus
            if (note === 'E') {
                gainNode.gain.value *= 1.5;
                volume *= 1.5;
            }

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();

            currentOscillator = oscillator;
            currentNote = note;

            element.style.backgroundColor = '#ffcc00'; // Change la couleur de fond lorsqu'on appuie sur la corde

            setTimeout(function() {
                if (currentOscillator === oscillator) {
                    oscillator.stop();
                    currentOscillator = null;
                    currentNote = null;
                    element.style.backgroundColor = ''; // Réinitialise la couleur de fond après que l'oscillateur s'arrête
                }
            }, 5000);
        }
    }

    function stopAllOscillators() {
        if (currentOscillator) {
            currentOscillator.stop();
            currentOscillator = null;
            currentNote = null;
        }
    }

    function toggleSoundType() {
        useGuitarSounds = !useGuitarSounds;
        const switchButton = document.getElementById('switch-button');
        switchButton.src = useGuitarSounds ? 'https://i.ibb.co/h2dfHFG/piano-icon.png' : 'https://i.ibb.co/7zSpQkz/switch-icon.png';
        switchButton.alt = useGuitarSounds ? 'classic' : 'electric';
    }

    document.addEventListener('DOMContentLoaded', function() {
        const guitarButton = createButton('https://i.ibb.co/9gkS98F/guitar-icon.png', 'guitar-button', '10px', '10px', toggleGuitarTuner);
        document.body.appendChild(guitarButton);
    });

})();
