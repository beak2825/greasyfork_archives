// ==UserScript==
// @name         MuseScore Dynamic Balance 
// @namespace    MuseScoreEnhancements
// @version      2.5
// @description  Réglages pour les sons de Musescore
// @author       Yglsan
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GNU GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/489744/MuseScore%20Dynamic%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/489744/MuseScore%20Dynamic%20Balance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        mainGauche: {
            attenuation: 0.7,    // Réduction de volume (0-1)
            rangeNotes: [48, 72], // Plage MIDI pour la main gauche (C3 à C5)
            fadeFinNote: 0.15    // Derniers 15% de la note en fondu
        },
        mainDroite: {
            boost: 1.1,          // Légère amplification
            fadeFinNote: 0.05    // Derniers 5% en fondu
        },
        effetResonance: {
            attenuation: 0.85,   // Réduction des harmoniques basses
            frequenceCoupe: 250  // Hz
        }
    };

    let isActive = false;
    let originalNoteData = new WeakMap();

    class NoteProcessor {
        static process(note) {
            if (!originalNoteData.has(note)) {
                originalNoteData.set(note, {
                    velocity: note.velocity,
                    tuning: note.tuning,
                    timbre: note.timbre
                });
            }

            const isMainGauche = this.estMainGauche(note);
            this.appliquerBalance(note, isMainGauche);
            this.appliquerFondu(note, isMainGauche);
        }

        static estMainGauche(note) {
            return note.pitch >= CONFIG.mainGauche.rangeNotes[0] && 
                   note.pitch <= CONFIG.mainGauche.rangeNotes[1];
        }

        static appliquerBalance(note, isMainGauche) {
            const original = originalNoteData.get(note);
            
            if (isMainGauche) {
                // Atténuation progressive basée sur la vélocité originale
                let attenuation = CONFIG.mainGauche.attenuation;
                if (original.velocity < 64) attenuation += 0.15;
                
                note.velocity = Math.min(127, 
                    Math.round(original.velocity * attenuation));
                
                // Réduction des basses fréquences
                note.timbre = original.timbre * CONFIG.effetResonance.attenuation;
                note.tuning = original.tuning - 20; // Léger detune
            } else {
                note.velocity = Math.min(127, 
                    Math.round(original.velocity * CONFIG.mainDroite.boost));
            }
        }

        static appliquerFondu(note, isMainGauche) {
            const fadePercent = isMainGauche ? 
                CONFIG.mainGauche.fadeFinNote : 
                CONFIG.mainDroite.fadeFinNote;

            note.playbackRate = this.calculerCourbeFondu(
                note.duration, 
                fadePercent
            );
        }

        static calculerCourbeFondu(duration, fadePercent) {
            const fadeTime = duration * fadePercent;
            return [
                { time: 0, value: 1.0 },
                { time: duration - fadeTime, value: 1.0 },
                { time: duration, value: 0.3 }
            ];
        }
    }

    function toggleEnhancements() {
        isActive = !isActive;
        const score = MuseScore.getCurrentScore();
        
        score.notes.forEach(note => {
            if (isActive) {
                NoteProcessor.process(note);
            } else {
                const original = originalNoteData.get(note);
                if (original) {
                    Object.assign(note, original);
                }
            }
        });
        
        score.updatePlayback();
        updateUI();
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'ms-balance-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Arial', sans-serif;
        `;

        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0;">Balance Dynamique</h3>
            <div class="slider-container">
                <label>Atténuation main gauche: 
                    <input type="range" min="0.3" max="1.0" step="0.05" 
                        value="${CONFIG.mainGauche.attenuation}" id="attenuation">
                </label>
                <span id="attenuation-value">${CONFIG.mainGauche.attenuation}</span>
            </div>
            <div class="slider-container">
                <label>Fondu main gauche: 
                    <input type="range" min="0.05" max="0.3" step="0.01" 
                        value="${CONFIG.mainGauche.fadeFinNote}" id="fade">
                </label>
                <span id="fade-value">${CONFIG.mainGauche.fadeFinNote}</span>
            </div>
            <button id="ms-balance-toggle" style="${getButtonStyle(isActive)}">
                ${isActive ? 'Désactiver' : 'Activer'}
            </button>
        `;

        panel.querySelector('#attenuation').addEventListener('input', e => {
            CONFIG.mainGauche.attenuation = parseFloat(e.target.value);
            panel.querySelector('#attenuation-value').textContent = e.target.value;
            if (isActive) toggleEnhancements();
        });

        panel.querySelector('#fade').addEventListener('input', e => {
            CONFIG.mainGauche.fadeFinNote = parseFloat(e.target.value);
            panel.querySelector('#fade-value').textContent = e.target.value;
            if (isActive) toggleEnhancements();
        });

        panel.querySelector('#ms-balance-toggle').addEventListener('click', toggleEnhancements);
        document.body.appendChild(panel);
    }

   

    function initialize() {
        if (typeof MuseScore === 'undefined') {
            setTimeout(initialize, 500);
            return;
        }
        
        createControlPanel();
        GM_registerMenuCommand('Toggle Balance', toggleEnhancements);
    }

    GM_addStyle(`
        #ms-balance-panel .slider-container {
            margin: 10px 0;
        }
        
        #ms-balance-panel input[type="range"] {
            width: 180px;
            margin-top: 5px;
        }
    `);

    window.addEventListener('load', initialize);
})();