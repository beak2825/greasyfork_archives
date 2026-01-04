// ==UserScript==
// @name         Nova Castelijns Hasta Tespit Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Mekandaki hastaları tespit eden gelişmiş sistem
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale/CharactersPresent*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/529806/Nova%20Castelijns%20Hasta%20Tespit%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/529806/Nova%20Castelijns%20Hasta%20Tespit%20Scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class PatientDetector {
        constructor() {
            this.sickPattern = /Kendimi iyi hissetmiyorum\. Sanırım hastalanıyorum\./i;
            this.healPattern = /beni iyileştirdi/i;

            this.isScanning = false;
            this.processedCount = 0;
            this.totalCharacters = 0;
            this.debugMode = true;
        }

        log(message) {
            if (this.debugMode) {
                console.log(`[Hasta Tespit ${new Date().toLocaleTimeString()}]: ${message}`);
            }
        }

        createUI() {
            const panel = document.createElement('div');
            panel.id = 'patientDetectorPanel';
            panel.innerHTML = `
                <div class="control-panel">
                    <button id="startScanBtn">Hastaları Tara</button>
                    <div id="scanProgress" style="display: none;">
                        <div class="progress-text">Taranan: <span id="scannedCount">0</span>/<span id="totalCount">0</span></div>
                        <div class="found-patients">Bulunan Hastalar: <span id="patientCount">0</span></div>
                        <div id="lastChecked" class="last-checked"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);

            document.getElementById('startScanBtn').addEventListener('click', () => this.startScan());
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #patientDetectorPanel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 9999;
                }
                .control-panel button {
                    padding: 8px 16px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .progress-text {
                    margin-top: 10px;
                    font-size: 14px;
                }
                .found-patients {
                    margin-top: 5px;
                    font-size: 14px;
                    color: #ff4444;
                }
                .last-checked {
                    margin-top: 5px;
                    font-size: 12px;
                    color: #666;
                }
                .patient-marker {
                    background: #ffebee !important;
                    color: #d32f2f !important;
                    font-weight: bold !important;
                    text-decoration: none;
                    padding: 2px 5px;
                    border-radius: 3px;
                }
                .patient-label {
                    background: #d32f2f;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    margin-left: 5px;
                    font-size: 12px;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }

        updateProgress() {
            document.getElementById('scannedCount').textContent = this.processedCount;
            document.getElementById('totalCount').textContent = this.totalCharacters;
            document.getElementById('patientCount').textContent = document.querySelectorAll('.patient-marker').length;
        }

        markPatient(characterLink) {
            if (!characterLink.classList.contains('patient-marker')) {
                characterLink.classList.add('patient-marker');
                const label = document.createElement('span');
                label.className = 'patient-label';
                label.textContent = 'HASTA';
                characterLink.parentNode.appendChild(label);
                this.log(`${characterLink.textContent} hasta olarak işaretlendi`);
            }
        }

        async checkDiary(url, characterLink) {
            return new Promise((resolve) => {
                this.log(`Günlük kontrol ediliyor: ${characterLink.textContent}`);
                document.getElementById('lastChecked').textContent = `Son kontrol: ${characterLink.textContent}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        let entries = Array.from(doc.querySelectorAll('.diaryEntry, .diary-entry, .entry, [class*="diary"]'));
                        this.log(`${entries.length} günlük girişi bulundu`);

                        let latestSickIndex = -1;
                        let latestHealIndex = -1;

                        entries.forEach((entry, index) => {
                            const text = entry.textContent;

                            if (this.sickPattern.test(text)) {
                                latestSickIndex = index;
                                this.log(`Hasta girişi bulundu, index: ${index}`);
                            }

                            if (this.healPattern.test(text)) {
                                latestHealIndex = index;
                                this.log(`İyileşme girişi bulundu, index: ${index}`);
                            }
                        });

                        if (latestSickIndex !== -1) {
                            if (latestHealIndex === -1 || latestSickIndex > latestHealIndex) {
                                this.log(`${characterLink.textContent} hasta olarak işaretlendi (Hasta: ${latestSickIndex}, İyileşme: ${latestHealIndex})`);
                                this.markPatient(characterLink);
                            }
                        }

                        this.processedCount++;
                        this.updateProgress();
                        resolve(true);
                    },
                    onerror: (error) => {
                        this.log(`Hata: ${characterLink.textContent} için günlük kontrol edilemedi`);
                        this.processedCount++;
                        this.updateProgress();
                        resolve(false);
                    }
                });
            });
        }

        async startScan() {
            if (this.isScanning) return;
            this.isScanning = true;
            this.log('Tarama başlatılıyor...');

            const characterLinks = Array.from(document.querySelectorAll('a'))
                .filter(link => link.href.includes('/World/Popmundo.aspx/Character/') &&
                              !link.href.includes('/Diary/'));

            this.processedCount = 0;
            this.totalCharacters = characterLinks.length;
            document.getElementById('scanProgress').style.display = 'block';
            this.updateProgress();

            for (const link of characterLinks) {
                const diaryUrl = link.href.replace('/Character/', '/Character/Diary/');
                await this.checkDiary(diaryUrl, link);

                // Rastgele bekleme süresi (1.5 - 2.5 saniye arası)
                const delay = 1500 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            this.isScanning = false;
            this.log('Tarama tamamlandı');
            alert('Tarama tamamlandı!');
        }

        init() {
            this.createUI();
            this.addStyles();
            this.log('Sistem başlatıldı');
        }
    }

    // Script'i başlat
    const detector = new PatientDetector();
    detector.init();
})();
