// ==UserScript==
// @name         Top Cut Calculator - Limitless TCG
// @name:pt-BR   Calculadora de Top Cut - Limitless TCG
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Calculate tournament top cuts on Limitless TCG
// @description:pt-BR  Calculadora de top cut para torneios no Limitless TCG
// @author       Marcsx (https://github.com/Marcsx)
// @match        https://play.limitlesstcg.com/tournament/*
// @include      https://play.limitlesstcg.com/tournament/*
// @include      https://play.limitlesstcg.com/tournaments
// @exclude      https://play.limitlesstcg.com/tournament/*/match/*
// @exclude      https://play.limitlesstcg.com/tournament/*/round/*
// @grant        none
// @source       https://github.com/Marcsx/limitless-topcut-calculator
// @supportURL   https://github.com/Marcsx/limitless-topcut-calculator/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523058/Top%20Cut%20Calculator%20-%20Limitless%20TCG.user.js
// @updateURL https://update.greasyfork.org/scripts/523058/Top%20Cut%20Calculator%20-%20Limitless%20TCG.meta.js
// ==/UserScript==

/*
This is a Tampermonkey adaptation of the Chrome extension created by Marcsx
Original repository: https://github.com/Marcsx/limitless-topcut-calculator
*/

(function() {
    'use strict';

    const translations = {
        en: {
            title: "Top Cut Calculator",
            players: "Players",
            rounds: "Rounds",
            topCut: "Top Cut",
            records: "Records",
            calculate: "Calculate",
            noTopCut: "No Top Cut"
        },
        pt: {
            title: "Calculadora de Top Cut",
            players: "Jogadores",
            rounds: "Rodadas",
            topCut: "Top Cut",
            records: "Recordes",
            calculate: "Calcular",
            noTopCut: "Sem Top Cut"
        }
    };

    class I18n {
        constructor() {
            this.currentLocale = navigator.language.startsWith('pt') ? 'pt' : 'en';
        }

        t(key) {
            return translations[this.currentLocale][key] || translations['en'][key];
        }
    }

    class TopCutCalculator {
        constructor() {
            this.i18n = new I18n();
            this.defaultTopCutRules = [
                { maxPlayers: 8, rounds: 3, topCut: 0 },
                { maxPlayers: 16, rounds: 4, topCut: 4 },
                { maxPlayers: 32, rounds: 6, topCut: 8 },
                { maxPlayers: 64, rounds: 7, topCut: 8 },
                { maxPlayers: 128, rounds: 6, topCut: 16 },
                { maxPlayers: 256, rounds: 7, topCut: 16 },
                { maxPlayers: 512, rounds: 8, topCut: 16 },
                { maxPlayers: 1024, rounds: 9, topCut: 32 },
                { maxPlayers: 2048, rounds: 10, topCut: 32 },
                { maxPlayers: Infinity, rounds: 10, topCut: 64 }
            ];
            this.createStyles();
            this.createElements();
            this.attachEventListeners();
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --primary-color: #121212;
                    --text-color: #ffffff;
                    --surface-color: #1e1e1e;
                    --accent-color: #bb86fc;
                }

                #topcut-fab {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background-color: var(--accent-color);
                    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    border: none;
                }

                #topcut-fab:hover {
                    background-color: #9965db;
                }

                #topcut-modal {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 320px;
                    max-width: 90vw;
                    background-color: var(--surface-color);
                    border-radius: 8px;
                    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
                    padding: 16px;
                    color: var(--text-color);
                    z-index: 999;
                    display: none;
                }

                .modal-header {
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 16px;
                }

                .input-group {
                    margin-bottom: 16px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: rgba(255, 255, 255, 0.87);
                }

                .input-group input, .input-group select {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background-color: var(--primary-color);
                    color: var(--text-color);
                }

                .button {
                    background-color: var(--accent-color);
                    color: var(--primary-color);
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                }

                .button:hover {
                    background-color: #9965db;
                }

                .results {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255,255,255,0.12);
                }
            `;
            document.head.appendChild(style);
        }

        createElements() {
            const fab = document.createElement('button');
            fab.id = 'topcut-fab';
            fab.innerHTML = '📊';
            document.body.appendChild(fab);

            const modal = document.createElement('div');
            modal.id = 'topcut-modal';
            modal.innerHTML = `
                <div class="modal-header">
                    ${this.i18n.t('title')}
                </div>
                <div class="input-group">
                    <label>${this.i18n.t('players')}</label>
                    <input type="number" id="players-input" placeholder="Auto-detect">
                </div>
                <div class="input-group">
                    <label>${this.i18n.t('rounds')}</label>
                    <input type="number" id="rounds-input" placeholder="Auto-detect">
                </div>
                <div class="input-group">
                    <label>${this.i18n.t('topCut')}</label>
                    <select id="topcut-input">
                        <option value="auto">Auto</option>
                        <option value="0">${this.i18n.t('noTopCut')}</option>
                        <option value="4">Top 4</option>
                        <option value="8">Top 8</option>
                        <option value="16">Top 16</option>
                        <option value="32">Top 32</option>
                        <option value="64">Top 64</option>
                        <option value="128">Top 128</option>
                    </select>
                </div>
                <button class="button" id="calculate-button">${this.i18n.t('calculate')}</button>
                <div class="results" id="results"></div>
            `;
            document.body.appendChild(modal);
        }

        attachEventListeners() {
            const fab = document.getElementById('topcut-fab');
            const modal = document.getElementById('topcut-modal');
            const calculateButton = document.getElementById('calculate-button');
            const playersInput = document.getElementById('players-input');

            fab.addEventListener('click', () => {
                const isVisible = modal.style.display === 'block';
                modal.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    this.autoDetectValues();
                }
            });

            calculateButton.addEventListener('click', () => {
                this.calculateTopCut();
            });

            playersInput.addEventListener('change', () => {
                const topCutSelect = document.getElementById('topcut-input');
                if (topCutSelect.value === 'auto') {
                    const players = parseInt(playersInput.value);
                    const suggestedTopCut = this.determineTopCutSize(players);
                    this.updateTopCutSuggestion(suggestedTopCut);
                }
            });
        }

        async autoDetectValues() {
            const url = window.location.href;
            const tournamentId = url.match(/tournament\/(.*?)(\/|$)/)?.[1];

            if (!tournamentId) return;

            try {
                const standingsResponse = await fetch(`https://play.limitlesstcg.com/tournament/${tournamentId}/standings`);
                const standingsText = await standingsResponse.text();
                const playersCount = this.extractPlayersCount(standingsText);

                if (playersCount) {
                    document.getElementById('players-input').value = playersCount;
                    const rule = this.defaultTopCutRules.find(r => playersCount <= r.maxPlayers);

                    if (rule) {
                        document.getElementById('rounds-input').value = rule.rounds;
                        document.getElementById('topcut-input').value = rule.topCut;
                        this.calculateTopCut();
                    }
                }
            } catch (error) {
                console.error('Error auto-detecting values:', error);
            }
        }

        extractPlayersCount(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tbody tr');
            return rows.length > 0 ? rows.length - 1 : 0;
        }

        determineTopCutSize(players) {
            const rule = this.defaultTopCutRules.find(r => players <= r.maxPlayers);
            return rule ? rule.topCut : 64;
        }

        calculateTopCut() {
            const playersCount = parseInt(document.getElementById('players-input').value);
            const roundsCount = parseInt(document.getElementById('rounds-input').value);
            const topCutSelect = document.getElementById('topcut-input');

            if (!playersCount || !roundsCount) {
                document.getElementById('results').innerHTML =
                    '<span style="color: rgba(255, 255, 255, 0.87)">Please enter all values.</span>';
                return;
            }

            let topCutSize = topCutSelect.value === 'auto'
                ? this.determineTopCutSize(playersCount)
                : parseInt(topCutSelect.value);

            const results = this.calculatePossibleRecords(roundsCount, topCutSize);
            const topCutPercentage = topCutSize > 0
                ? Math.round((topCutSize/playersCount) * 100)
                : 0;

            document.getElementById('results').innerHTML = `
                <div style="color: rgba(255, 255, 255, 0.87)">
                    <div style="margin-bottom: 2px">${this.i18n.t('topCut')}: ${topCutSize === 0 ? this.i18n.t('noTopCut') : `Top ${topCutSize} (${topCutPercentage}%)`}</div>
                    <div style="white-space: nowrap">${this.i18n.t('records')}: ${results}</div>
                </div>
            `;
        }

        calculatePossibleRecords(rounds, topCutSize) {
            const possibleRecords = [];
            const totalPlayers = parseInt(document.getElementById('players-input').value);
            let remainingSpots = topCutSize;

            for (let wins = rounds; wins >= 0; wins--) {
                const losses = rounds - wins;

                const playersWithThisRecord = Math.round(
                    totalPlayers *
                    this.binomialCoefficient(rounds, wins) *
                    Math.pow(0.5, rounds)
                );

                if (remainingSpots > 0) {
                    const playersAdvancing = Math.min(remainingSpots, playersWithThisRecord);
                    const percentageAdvancing = Math.round((playersAdvancing / playersWithThisRecord) * 100);

                    if (percentageAdvancing > 0) {
                        possibleRecords.push({
                            record: `${wins}-${losses}`,
                            percentage: percentageAdvancing
                        });

                        remainingSpots -= playersAdvancing;
                    }
                }
            }

            return possibleRecords
                .map(r => `${r.record} (${r.percentage}%)`)
                .join(' | ');
        }

        binomialCoefficient(n, k) {
            let result = 1;
            for (let i = 1; i <= k; i++) {
                result *= (n + 1 - i);
                result /= i;
            }
            return result;
        }

        updateTopCutSuggestion(topCut) {
            const results = document.getElementById('results');
            results.innerHTML = topCut === 0
                ? this.i18n.t('noTopCut')
                : `Top ${topCut}`;
        }
    }

    // Initialize the calculator
    new TopCutCalculator();
})();