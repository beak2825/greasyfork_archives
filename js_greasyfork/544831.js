// ==UserScript==
// @name         Lietučio hakai
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Lietučio hakai 😎
// @author       Jonas Petravičius
// @match        https://www.lietutis.lt/zaidimas-lietutis.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544831/Lietu%C4%8Dio%20hakai.user.js
// @updateURL https://update.greasyfork.org/scripts/544831/Lietu%C4%8Dio%20hakai.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const guiHTML = `
        <div id="score-tool-container">
            <div id="score-tool-header">
                <h3>Lietučio hakai</h3>
                <button id="score-tool-toggle-btn">-</button>
            </div>
            <div id="score-tool-body">
                <div class="input-row">
                    <label for="zaidejoVardas">Vardas:</label>
                    <input type="text" id="zaidejoVardas" value="ŽMOGUS" maxlength="25">
                </div>
                <div class="input-row">
                    <label for="rezultatas">Taškai:</label>
                    <input type="number" id="rezultatas" value="69420">
                </div>
                <hr>
                <div class="input-row">
                    <label for="laikolygis">Greitis:</label>
                    <input type="number" id="laikolygis" value="2" min="1" max="4">
                </div>
                <div class="input-row">
                    <label for="arvezlio">Vėžlio greitis:</label>
                    <input type="checkbox" id="arvezlio">
                </div>
                <div class="input-row">
                    <label for="ilgiolygis">Ilgis:</label>
                    <input type="number" id="ilgiolygis" value="1" min="1" max="4">
                </div>
                 <div class="input-row">
                    <label for="arivairus">Įvairus ilgis:</label>
                    <input type="checkbox" id="arivairus">
                </div>
                <hr>
                <div class="input-row">
                    <label for="perminute">Simboliai per minutę:</label>
                    <input type="number" id="perminute" value="69.0" step="0.1">
                </div>
                <div class="input-row">
                    <label for="sekundes">Laikas (sekundėmis):</label>
                    <input type="number" id="sekundes" value="420">
                </div>
                <div class="input-row">
                    <label for="klaidos">Klaidos:</label>
                    <input type="number" id="klaidos" value="67">
                </div>
                <hr>
                <h4>Apskaičiuoti dalykai:</h4>
                <div class="calc-row"><strong>Lyga:</strong> <span id="calc-league">A</span></div>
                <div class="calc-row"><strong>Raidės:</strong> <span id="calc-simboliai">0</span></div>
                <div class="calc-row"><strong>Tikslumas:</strong> <span id="calc-tikslumas">0.00%</span></div>
                <div class="calc-row"><strong>Anticheat'as atrodo (reztik):</strong> <span id="calc-reztik">0</span></div>
                <hr>
                <button id="score-tool-submit-btn">Pateikti</button>
                <div id="score-tool-status-log"></div>
            </div>
        </div>
        <style>
            #score-tool-container {
                position: fixed; top: 15px; right: 15px; width: 320px; background-color: #282c34;
                color: #abb2bf; border: 1px solid #4a505c; border-radius: 8px; z-index: 99999;
                font-family: sans-serif; font-size: 14px; box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            }
            #score-tool-header {
                display: flex; justify-content: space-between; align-items: center; background-color: #3c4049;
                padding: 8px 12px; border-top-left-radius: 8px; border-top-right-radius: 8px; cursor: grab;
            }
            #score-tool-header:active { cursor: grabbing; }
            #score-tool-header h3 { margin: 0; font-size: 16px; color: #e6e6e6; }
            #score-tool-toggle-btn { background: #5c6370; border: none; color: white; border-radius: 4px; cursor: pointer; font-weight: bold; }
            #score-tool-body { padding: 12px; }
            .input-row, .calc-row { display: flex; margin-right: 10px; align-items: center; margin-bottom: 8px; }
            label, .calc-row strong { color: #9da5b4; margin-right: 5px; }
            input[type="text"], input[type="number"] {
                width: 100px; background-color: #21252b; border: 1px solid #4a505c; color: #abb2bf; border-radius: 4px; padding: 4px;
            }
            input[type="checkbox"] { margin-right: auto; }
            hr { border: none; border-top: 1px solid #4a505c; margin: 12px 0; }
            #score-tool-submit-btn {
                width: 100%; padding: 8px; background-color: #61afef; border: none; color: #21252b;
                font-weight: bold; border-radius: 4px; cursor: pointer; margin-top: 8px;
            }
            #score-tool-submit-btn:hover { background-color: #79c0ff; }
            #score-tool-status-log {
                margin-top: 10px; padding: 8px; background-color: #21252b; border-radius: 4px;
                min-height: 20px; font-family: monospace; word-wrap: break-word;
            }
            #calc-league { font-weight: bold; }
        </style>
    `;

    function updateCalculations() {
        const rezultatas = parseFloat(document.getElementById('rezultatas').value) || 0;
        let laikolygis = parseInt(document.getElementById('laikolygis').value) || 0;
        let ilgiolygis = parseInt(document.getElementById('ilgiolygis').value) || 0;
        const perminute = parseFloat(document.getElementById('perminute').value) || 0;
        const sekundes = parseInt(document.getElementById('sekundes').value) || 0;
        const klaidos = parseInt(document.getElementById('klaidos').value) || 0;
        const isVezlio = document.getElementById('arvezlio').checked;
        const isIvairus = document.getElementById('arivairus').checked;

        document.getElementById('laikolygis').disabled = isVezlio;
        document.getElementById('laikolygis').style.opacity = isVezlio ? 0.5 : 1;
        document.getElementById('ilgiolygis').disabled = isIvairus;
        document.getElementById('ilgiolygis').style.opacity = isIvairus ? 0.5 : 1;

        const effectiveLaikolygis = isVezlio ? 0 : laikolygis;
        const effectiveIlgiolygis = isIvairus ? 0 : ilgiolygis;

        const leagueSpan = document.getElementById('calc-league');
        const levelSum = effectiveLaikolygis + effectiveIlgiolygis;
        if (levelSum >= 7 && !isVezlio && !isIvairus) {
            leagueSpan.textContent = 'A';
            leagueSpan.style.color = '#98c379'; // Green
        } else if (levelSum >= 5 && !isVezlio && !isIvairus) {
            leagueSpan.textContent = 'B';
            leagueSpan.style.color = '#e5c07b'; // Yellow
        } else {
            leagueSpan.textContent = 'C';
            leagueSpan.style.color = '#e06c75'; // Red
        }

        // Calculate other values
        const simboliai = perminute * (sekundes / 60);
        const tikslumas = (simboliai > 0) ? (simboliai / (simboliai + klaidos)) * 100 : 0;
        const reztik = 31 + Math.floor(rezultatas / 3.3) + (effectiveLaikolygis * effectiveIlgiolygis * 3 + effectiveLaikolygis + effectiveIlgiolygis) + sekundes + simboliai * 2;

        document.getElementById('calc-simboliai').textContent = Math.round(simboliai);
        document.getElementById('calc-tikslumas').textContent = `${tikslumas.toFixed(2)}%`;
        document.getElementById('calc-reztik').textContent = Math.round(reztik);
    }

    function submitScore() {
        const log = document.getElementById('score-tool-status-log');
        log.textContent = 'Submitting...';

        const zaidejoVardas = document.getElementById('zaidejoVardas').value.toUpperCase();
        const rezultatas = parseFloat(document.getElementById('rezultatas').value) || 0;
        let laikolygis = parseInt(document.getElementById('laikolygis').value) || 0;
        let ilgiolygis = parseInt(document.getElementById('ilgiolygis').value) || 0;
        const perminute = parseFloat(document.getElementById('perminute').value) || 0;
        const sekundes = parseInt(document.getElementById('sekundes').value) || 0;
        const klaidos = parseInt(document.getElementById('klaidos').value) || 0;

        const isVezlio = document.getElementById('arvezlio').checked;
        const isIvairus = document.getElementById('arivairus').checked;
        const arivairus = isIvairus ? 1 : 0;
        const effectiveLaikolygis = isVezlio ? 0 : laikolygis;
        const effectiveIlgiolygis = isIvairus ? 0 : ilgiolygis;

        const simboliai = Math.round(perminute * (sekundes / 60));
        const reztik = Math.round(31 + Math.floor(rezultatas / 3.3) + (effectiveLaikolygis * effectiveIlgiolygis * 3 + effectiveLaikolygis + effectiveIlgiolygis) + sekundes + simboliai * 2);

        const payload = [
            rezultatas, zaidejoVardas, effectiveLaikolygis, effectiveIlgiolygis, arivairus,
            sekundes, simboliai, klaidos, perminute, 1, reztik, 0
        ].join(',');

        fetch('https://www.lietutis.lt/rasoNew.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'inputData=' + encodeURIComponent(payload)
        })
        .then(response => response.text())
        .then(data => {
            log.innerHTML = `(Turbūt) Sėkmingai pateikta<br>Duomenys pateikti: ${data || '(empty)'}.`;
        })
        .catch(error => {
            log.textContent = `Klaida: ${error.message}`;
        });
    }

    function init() {
        if (document.getElementById('score-tool-container')) return;
        const guiElement = document.createElement('div');
        guiElement.innerHTML = guiHTML;
        document.body.appendChild(guiElement);

        const inputs = ['rezultatas', 'laikolygis', 'ilgiolygis', 'perminute', 'sekundes', 'klaidos', 'arivairus', 'arvezlio'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateCalculations);
        });
        document.getElementById('score-tool-submit-btn').addEventListener('click', submitScore);
        updateCalculations();

        const guiBody = document.getElementById('score-tool-body');
        const toggleBtn = document.getElementById('score-tool-toggle-btn');
        toggleBtn.addEventListener('click', () => {
            const isHidden = guiBody.style.display === 'none';
            guiBody.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '-' : '+';
        });
        dragElement(document.getElementById('score-tool-container'));
    }

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById('score-tool-header')) {
            document.getElementById('score-tool-header').onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

    window.addEventListener('load', init);
})();