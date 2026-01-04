// ==UserScript==
// @name         Ekin SKP Bulanan Automaton
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automasi input data CSV ke aplikasi Ekin
// @author       You
// @match        https://kinerja.bkn.go.id/skp/*/penilaian/*/rencana_aksi*
// @match        https://kinerja.bkn.go.id/skp/*/penilaian/*/eviden*
// @icon         https://kinerja.bkn.go.id/images/logo-e.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538140/Ekin%20SKP%20Bulanan%20Automaton.user.js
// @updateURL https://update.greasyfork.org/scripts/538140/Ekin%20SKP%20Bulanan%20Automaton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage keys
    const STORAGE_KEY = 'ekin_automation_data';
    const PROGRESS_KEY = 'ekin_automation_progress';

    // CSS untuk form automation
    const CSS = `
        <style>
        .automation-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 350px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        }

        .automation-panel.minimized {
            height: 50px;
            overflow: hidden;
        }

        .automation-header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 12px 15px;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .automation-body {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }

        .form-control {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 8px;
            margin-bottom: 8px;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #007bff;
            color: white;
        }

        .btn-primary:hover {
            background: #0056b3;
            transform: translateY(-1px);
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-success:hover {
            background: #1e7e34;
            transform: translateY(-1px);
        }

        .btn-warning {
            background: #ffc107;
            color: #212529;
        }

        .btn-warning:hover {
            background: #e0a800;
            transform: translateY(-1px);
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
            transform: translateY(-1px);
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
            border-radius: 10px;
        }

        .status-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .minimize-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    .btn-info {
        background: #17a2b8;
        color: white;
    }

    .btn-info:hover {
        background: #138496;
        transform: translateY(-1px);
    }

    .template-section {
        border-top: 1px solid #eee;
        margin-top: 15px;
        padding-top: 15px;
    }

    .template-section h6 {
        margin-bottom: 10px;
        color: #495057;
        font-weight: bold;
    }
        </style>
    `;

    // Inject CSS
    document.head.insertAdjacentHTML('beforeend', CSS);

    // Main automation class
    class EkinAutomation {
        constructor() {
            this.csvData = [];
            this.currentProgress = this.loadProgress();
            this.isRunning = false;
            this.isMinimized = false;
            this.createPanel();
            this.bindEvents();
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'automation-panel';
            panel.innerHTML = `
        <div class="automation-header">
            <span>🤖 Ekin Automation</span>
            <button class="minimize-btn" id="minimizeBtn">−</button>
        </div>
        <div class="automation-body">
            <div class="template-section">
                <h6>📥 Template CSV</h6>
                <button class="btn btn-info" id="downloadTemplateBtn">Download Template CSV</button>
            </div>

            <div class="form-group">
                <label class="form-label">Upload CSV File:</label>
                <input type="file" id="csvFile" class="form-control" accept=".csv">
            </div>

            <div class="form-group">
                <label class="form-label">Progress:</label>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                </div>
                <div class="status-text" id="statusText">Ready to start</div>
            </div>

            <div class="form-group">
                <button class="btn btn-primary" id="startBtn">Start Automation</button>
                <button class="btn btn-warning" id="pauseBtn" disabled>Pause</button>
                <button class="btn btn-danger" id="cancelBtn" disabled>Cancel</button>
                <button class="btn btn-success" id="continueBtn" style="display:none;">Continue</button>
            </div>

            <div class="form-group">
                <small class="status-text">
                    Current Page: <span id="currentPage">${this.getCurrentPageType()}</span><br>
                    Processed: <span id="processedCount">${this.currentProgress.processedRows}</span> /
                    <span id="totalCount">${this.currentProgress.totalRows}</span>
                </small>
            </div>
        </div>
    `;

            document.body.appendChild(panel);
            this.panel = panel;
        }

        bindEvents() {
            // File upload
            document.getElementById('csvFile').addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });

            // CSV Template download
            document.getElementById('downloadTemplateBtn').addEventListener('click', () => {
                this.downloadCSVTemplate();
            });

            // Control buttons
            document.getElementById('startBtn').addEventListener('click', () => {
                this.startAutomation();
            });

            document.getElementById('pauseBtn').addEventListener('click', () => {
                this.pauseAutomation();
            });

            document.getElementById('cancelBtn').addEventListener('click', () => {
                this.cancelAutomation();
            });

            document.getElementById('continueBtn').addEventListener('click', () => {
                this.continueAutomation();
            });

            // Minimize button
            document.getElementById('minimizeBtn').addEventListener('click', () => {
                this.toggleMinimize();
            });
        }

        downloadCSVTemplate() {
            const csvContent = `Rencana Aksi dan Pengisian Bukti Dukung;;;;;;;;
Nomor RHK;Rencana Aksi;Target;kosong;Nama Bukti Dukung;Link Bukti Dukung;Realisasi;Sumber Data
"1";"Contoh Rencana Aksi 1
Contoh Rencana Aksi 2";"Contoh Target 1
Contoh Target 2";;"Contoh Bukti Dukung 1
Contoh Bukti Dukung 2";"https://example.com/bukti1
https://example.com/bukti2";"Contoh Realisasi 1
Contoh Realisasi 2";"Contoh Sumber Data 1
Contoh Sumber Data 2"
"2";"Rencana Aksi berikutnya";"Target berikutnya";;"Bukti Dukung berikutnya";"https://example.com/bukti3";"Realisasi berikutnya";"Sumber Data berikutnya"
"3";"";"";"";"";"";"";"";""`;

            this.downloadFile(csvContent, 'ekin_template.csv', 'text/csv;charset=utf-8');
            this.updateStatus('CSV template downloaded');
        }

        downloadFile(content, filename, contentType) {
            // Add BOM untuk UTF-8 agar Excel bisa baca dengan benar
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + content], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            const minimizeBtn = document.getElementById('minimizeBtn');

            if (this.isMinimized) {
                this.panel.classList.add('minimized');
                minimizeBtn.textContent = '+';
            } else {
                this.panel.classList.remove('minimized');
                minimizeBtn.textContent = '−';
            }
        }

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                this.parseCsv(csv);
            };
            reader.readAsText(file);
        }

        parseCsv(csvText) {
            const lines = csvText.split('\n');
            const data = [];

            // Filter out empty lines
            const filteredLines = lines.filter(line => {
                const trimmed = line.trim();
                return trimmed &&
                    !trimmed.includes('Rencana Aksi dan Pengisian Bukti Dukung');
            });

            // Skip header row (row 1), start from row 2 (after column headers)
            for (let i = 1; i < filteredLines.length; i++) {
                const line = filteredLines[i].trim();
                if (!line) continue;

                const columns = this.parseCSVLine(line);
                if (columns.length >= 8) {
                    data.push({
                        nomorRHK: columns[0] || '',
                        rencanaAksi: columns[1] || '',
                        target: columns[2] || '',
                        namaBuktiDukung: columns[4] || '',
                        linkBuktiDukung: columns[5] || '',
                        realisasi: columns[6] || '',
                        sumberData: columns[7] || ''
                    });
                }
            }

            this.csvData = data;
            this.saveData();
            this.updateProgress(0, data.length);
            this.updateStatus(`CSV loaded: ${data.length} rows`);
        }

        parseCSVLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ';' && !inQuotes) { // Ubah dari ',' ke ';'
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            result.push(current.trim());
            return result;
        }

        getCurrentPageType() {
            const url = window.location.href;
            if (url.includes('rencana_aksi')) return 'Rencana Aksi';
            if (url.includes('eviden')) return 'Eviden';
            return 'Unknown';
        }

        async startAutomation() {
            if (!this.csvData.length) {
                // Try to load saved data
                const savedData = this.loadData();
                if (savedData.length > 0) {
                    this.csvData = savedData;
                    console.log('Loaded saved CSV data:', this.csvData.length, 'rows');
                } else {
                    alert('Please upload a CSV file first');
                    return;
                }
            }

            console.log('Starting automation with data:', this.csvData);

            // Check if there's a previous session to resume
            const currentPageType = this.getCurrentPageType();
            const savedProgress = this.loadProgress();

            if (savedProgress.timestamp && savedProgress.currentPage &&
                savedProgress.processedRows < savedProgress.totalRows) {

                const timeDiff = Date.now() - savedProgress.timestamp;
                const hoursDiff = timeDiff / (1000 * 60 * 60);

                if (hoursDiff < 24) { // Resume if less than 24 hours
                    const shouldResume = confirm(
                        `Found previous automation session:\n` +
                        `Page: ${savedProgress.currentPage}\n` +
                        `Progress: ${savedProgress.processedRows}/${savedProgress.totalRows}\n` +
                        `Time: ${Math.round(hoursDiff * 60)} minutes ago\n\n` +
                        `Do you want to resume from where you left off?`
                    );

                    if (shouldResume) {
                        await this.resumeAutomation(savedProgress);
                        return;
                    }
                }
            }

            // Start fresh automation
            this.currentProgress = {
                currentRow: 0,
                processedRows: 0,
                totalRows: this.csvData.length,
                currentPage: currentPageType,
                timestamp: Date.now(),
                csvDataLength: this.csvData.length
            };

            this.isRunning = true;
            this.updateButtons();

            try {
                if (currentPageType === 'Rencana Aksi') {
                    await this.processRencanaAksi();
                } else if (currentPageType === 'Eviden') {
                    await this.processEviden();
                } else {
                    throw new Error('Unknown page type');
                }
            } catch (error) {
                console.error('Automation error:', error);
                this.updateStatus(`Error: ${error.message}`);
                this.pauseAutomation();
            }
        }

        async resumeAutomation(savedProgress) {
            const currentPageType = this.getCurrentPageType();

            this.updateStatus('Resuming automation...');

            // If we're on the wrong page, navigate to the correct one
            if (currentPageType !== savedProgress.currentPage) {
                this.updateStatus(`Navigating to ${savedProgress.currentPage} page...`);

                if (savedProgress.currentPage === 'Rencana Aksi') {
                    // Navigate to rencana_aksi page
                    const currentUrl = window.location.href;
                    const rencanaAksiUrl = currentUrl.replace(/\/eviden.*/, '/rencana_aksi');
                    window.location.href = rencanaAksiUrl;
                    return; // Page will reload, automation will continue
                } else if (savedProgress.currentPage === 'Eviden') {
                    // Navigate to eviden page
                    await this.navigateToEviden();
                }
            }

            // Resume from saved progress
            this.currentProgress = savedProgress;
            this.isRunning = true;
            this.updateButtons();
            this.updateProgressBar();

            try {
                if (savedProgress.currentPage === 'Rencana Aksi') {
                    await this.processRencanaAksi();
                } else if (savedProgress.currentPage === 'Eviden') {
                    await this.processEviden();
                }
            } catch (error) {
                console.error('Resume automation error:', error);
                this.updateStatus(`Resume error: ${error.message}`);
                this.pauseAutomation();
            }
        }

        async processRencanaAksi() {
            console.log('Processing Rencana Aksi...');

            // Find target table
            let targetTable = null;
            const allTables = document.querySelectorAll('table');

            for (let i = 0; i < allTables.length; i++) {
                const table = allTables[i];
                const tableText = table.textContent;

                if (tableText.includes('RENCANA AKSI') || tableText.includes('RENCANA HASIL KERJA')) {
                    targetTable = table;
                    console.log(`Found target table at index ${i}`);
                    break;
                }
            }

            if (!targetTable) {
                this.updateStatus('Table Rencana Aksi tidak ditemukan');
                this.pauseAutomation();
                return;
            }

            const tableRows = targetTable.querySelectorAll('tbody tr');
            console.log('Found table rows in target table:', tableRows.length);

            if (tableRows.length === 0) {
                this.updateStatus('No table rows found in Rencana Aksi table');
                this.pauseAutomation();
                return;
            }

            let currentRowIndex = this.currentProgress.currentRow || 0;
            let processedAnyData = false;

            // Group CSV data by RHK number
            const groupedData = this.groupDataByRHK();
            console.log('Grouped data by RHK:', groupedData);

            for (let i = currentRowIndex; i < tableRows.length && this.isRunning; i++) {
                console.log(`\n=== Processing Table Row ${i} ===`);

                const row = tableRows[i];

                // Find add button
                let addButton = row.querySelector('button.btn-success');
                if (!addButton) {
                    addButton = Array.from(row.querySelectorAll('button')).find(btn =>
                                                                                btn.textContent.trim().includes('Tambah')
                                                                               );
                }

                if (!addButton) {
                    console.log(`Skipping - no valid add button`);
                    continue;
                }

                // Get RHK number for this table row (1-based)
                const rhkNumber = (i + 1).toString();
                console.log(`Looking for RHK number: ${rhkNumber}`);

                // Get data for this RHK number
                const rhkData = groupedData[rhkNumber] || [];
                console.log(`Found ${rhkData.length} items for RHK ${rhkNumber}`);

                if (rhkData.length === 0) {
                    console.log(`No data found for RHK ${rhkNumber}, skipping`);
                    continue;
                }

                this.updateStatus(`Processing RHK ${rhkNumber}: ${rhkData.length} items`);

                // Process each item for this RHK
                for (const item of rhkData) {
                    if (!this.isRunning) break;

                    if (item.rencanaAksi.trim()) {
                        console.log(`Processing item for RHK ${rhkNumber}:`, item);

                        try {
                            await this.addRencanaAksiItem(addButton, item.rencanaAksi, item.target);
                            await this.delay(1500);
                            processedAnyData = true;
                        } catch (error) {
                            console.error('Error in addRencanaAksiItem:', error);
                        }
                    }
                }

                this.currentProgress.currentRow = i + 1;
                this.currentProgress.processedRows++;
                this.currentProgress.currentPage = 'Rencana Aksi';
                this.saveProgress();
                this.updateProgressBar();
            }

            if (this.isRunning && processedAnyData) {
                this.updateStatus('All rencana aksi processed. Navigating to Eviden page...');
                this.currentProgress.currentPage = 'Eviden';
                this.currentProgress.currentRow = 0; // Reset for eviden processing
                this.saveProgress();
                await this.navigateToEviden();
            } else if (!processedAnyData) {
                this.updateStatus('No valid data to process in Rencana Aksi');
                this.pauseAutomation();
            }
        }

        groupDataByRHK() {
            const grouped = {};

            this.csvData.forEach(item => {
                const rhkNumber = item.nomorRHK.toString();
                if (!grouped[rhkNumber]) {
                    grouped[rhkNumber] = [];
                }
                grouped[rhkNumber].push(item);
            });

            return grouped;
        }

        getRowDataByIndex(dataRowIndex) {
            console.log(`Getting data for index ${dataRowIndex}, total CSV data:`, this.csvData.length);
            console.log('Full CSV data:', this.csvData);

            // Get data for specific row index from CSV
            if (dataRowIndex >= this.csvData.length) {
                console.log(`Index ${dataRowIndex} exceeds CSV data length`);
                return [];
            }

            const item = this.csvData[dataRowIndex];
            if (!item) {
                console.log(`No item found at index ${dataRowIndex}`);
                return [];
            }

            console.log(`Raw item data at index ${dataRowIndex}:`, item);

            const data = [];

            // Split by newlines to handle multiple entries per cell
            const rencanaAksiLines = item.rencanaAksi ? item.rencanaAksi.split('\n').filter(line => line.trim()) : [];
            const targetLines = item.target ? item.target.split('\n').filter(line => line.trim()) : [];

            console.log('Rencana Aksi lines:', rencanaAksiLines);
            console.log('Target lines:', targetLines);

            const maxLines = Math.max(rencanaAksiLines.length, targetLines.length);
            console.log('Max lines:', maxLines);

            for (let i = 0; i < maxLines; i++) {
                const processedItem = {
                    rencanaAksi: rencanaAksiLines[i] || '',
                    target: targetLines[i] || ''
                };

                console.log(`Line ${i}:`, processedItem);
                data.push(processedItem);
            }

            console.log('Final processed data:', data);
            return data;
        }

        async addRencanaAksiItem(button, deskripsi, target) {
            try {
                console.log('=== STARTING addRencanaAksiItem ===');
                console.log('Button:', button);
                console.log('Deskripsi:', deskripsi);
                console.log('Target:', target);

                this.updateStatus(`Adding: ${deskripsi.substring(0, 30)}...`);

                // Click the button
                console.log('Clicking add button...');
                button.click();
                await this.delay(2000); // Increase delay

                // Check if modal appeared
                console.log('Checking for modal...');
                const modal = document.querySelector('.modal.show');
                console.log('Modal found:', !!modal);

                if (!modal) {
                    throw new Error('Modal did not appear after clicking button');
                }

                console.log('Modal HTML:', modal.outerHTML.substring(0, 500));

                // Find inputs
                const deskripsiInput = modal.querySelector('input[name="deskripsi"]');
                const targetInput = modal.querySelector('input[name="target"]');

                console.log('Deskripsi input found:', !!deskripsiInput);
                console.log('Target input found:', !!targetInput);

                if (!deskripsiInput || !targetInput) {
                    throw new Error('Required inputs not found in modal');
                }

                // Fill inputs
                console.log('Filling deskripsi input...');
                deskripsiInput.value = deskripsi;
                deskripsiInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Deskripsi input value:', deskripsiInput.value);

                console.log('Filling target input...');
                targetInput.value = target;
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Target input value:', targetInput.value);

                await this.delay(1000);

                // Find OK button
                const okButton = modal.querySelector('.modal-footer button.btn-primary');
                console.log('OK button found:', !!okButton);

                if (!okButton) {
                    throw new Error('OK button not found in modal');
                }

                console.log('OK button text:', okButton.textContent);
                console.log('OK button disabled:', okButton.disabled);

                // Click OK button
                console.log('Clicking OK button...');
                okButton.click();

                // Wait and check if modal closed
                await this.delay(2000);

                const modalAfterClick = document.querySelector('.modal.show');
                console.log('Modal still visible after OK click:', !!modalAfterClick);

                if (modalAfterClick) {
                    console.log('Modal still open, trying alternative methods...');

                    // Try Enter key
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    okButton.dispatchEvent(enterEvent);
                    await this.delay(1000);

                    const modalAfterEnter = document.querySelector('.modal.show');
                    if (modalAfterEnter) {
                        console.log('Modal still open after Enter, forcing close...');
                        const closeBtn = modal.querySelector('.btn-close');
                        if (closeBtn) closeBtn.click();
                        throw new Error('Could not submit modal - forced close');
                    }
                }

                console.log('=== addRencanaAksiItem COMPLETED SUCCESSFULLY ===');
                this.updateStatus('Item added successfully');

            } catch (error) {
                console.error('=== ERROR in addRencanaAksiItem ===');
                console.error('Error:', error.message);
                this.updateStatus(`Error: ${error.message}`);

                // Force close any open modal
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const closeBtn = modal.querySelector('.btn-close, button[data-bs-dismiss="modal"]');
                    if (closeBtn) {
                        console.log('Force closing modal...');
                        closeBtn.click();
                    }
                }

                await this.delay(2000);
                throw error; // Re-throw to stop automation
            }
        }

        async processEviden() {
            console.log('=== PROCESSING EVIDEN ===');
            this.updateStatus('Processing Eviden page...');

            await this.delay(2000);

            const targetTable = document.querySelector('table[data-v-7cd03e53]');
            if (!targetTable) {
                throw new Error('Eviden table not found');
            }

            const tableRows = targetTable.querySelectorAll('tbody tr');
            console.log('Found eviden table rows:', tableRows.length);

            let currentRowIndex = this.currentProgress.currentRow || 0;
            let processedAnyData = false;

            // Group CSV data by RHK number
            const groupedData = this.groupDataByRHK();

            for (let i = currentRowIndex; i < tableRows.length && this.isRunning; i++) {
                const row = tableRows[i];

                // Skip header rows
                if (row.querySelector('strong')) continue;

                const buktiButton = row.querySelector('td:nth-child(8) button.btn-success');
                const realisasiButton = row.querySelector('td:nth-child(9) button.btn-success');

                if (!buktiButton && !realisasiButton) continue;

                // Get RHK number for this table row
                const rhkNumber = this.getRHKNumberFromEvidenRow(row, i);
                console.log(`Processing eviden for RHK: ${rhkNumber}`);

                const rhkData = groupedData[rhkNumber] || [];

                for (const item of rhkData) {
                    if (!this.isRunning) break;

                    if (buktiButton && item.namaBuktiDukung && item.namaBuktiDukung.trim()) {
                        await this.addBuktiDukung(buktiButton, item.namaBuktiDukung, item.linkBuktiDukung);
                        await this.delay(1500);
                        processedAnyData = true;
                    }

                    if (realisasiButton && item.realisasi && item.realisasi.trim()) {
                        await this.addRealisasi(realisasiButton, item.realisasi, item.sumberData);
                        await this.delay(1500);
                        processedAnyData = true;
                    }
                }

                this.currentProgress.currentRow = i + 1;
                this.currentProgress.processedRows++;
                this.currentProgress.currentPage = 'Eviden';
                this.saveProgress();
                this.updateProgressBar();
            }

            if (this.isRunning) {
                this.completeAutomation();
            }
        }

        getRHKNumberFromEvidenRow(row, index) {
            // Try to get number from first cell
            const firstCell = row.querySelector('td:first-child');
            if (firstCell && firstCell.textContent.trim()) {
                const number = firstCell.textContent.trim();
                if (!isNaN(number)) {
                    return number;
                }
            }

            // Fallback to index + 1
            return (index + 1).toString();
        }

        getEvidenRowData(dataRowIndex) {
            console.log(`Getting eviden data for index ${dataRowIndex}`);

            if (dataRowIndex >= this.csvData.length) {
                console.log(`Index ${dataRowIndex} exceeds CSV data length`);
                return [];
            }

            const item = this.csvData[dataRowIndex];
            if (!item) {
                console.log(`No item found at index ${dataRowIndex}`);
                return [];
            }

            console.log(`Raw eviden item data:`, item);

            const data = [];

            // Split by newlines to handle multiple entries per cell
            const buktiLines = item.namaBuktiDukung ? item.namaBuktiDukung.split('\n').filter(line => line.trim()) : [];
            const linkLines = item.linkBuktiDukung ? item.linkBuktiDukung.split('\n').filter(line => line.trim()) : [];
            const realisasiLines = item.realisasi ? item.realisasi.split('\n').filter(line => line.trim()) : [];
            const sumberLines = item.sumberData ? item.sumberData.split('\n').filter(line => line.trim()) : [];

            console.log('Bukti lines:', buktiLines);
            console.log('Link lines:', linkLines);
            console.log('Realisasi lines:', realisasiLines);
            console.log('Sumber lines:', sumberLines);

            const maxLines = Math.max(
                buktiLines.length,
                linkLines.length,
                realisasiLines.length,
                sumberLines.length
            );

            for (let i = 0; i < maxLines; i++) {
                data.push({
                    namaBuktiDukung: buktiLines[i] || '',
                    linkBuktiDukung: linkLines[i] || '',
                    realisasi: realisasiLines[i] || '',
                    sumberData: sumberLines[i] || ''
                });
            }

            console.log('Final eviden data:', data);
            return data;
        }

        getRowData(rowIndex) {
            const data = [];

            for (const item of this.csvData) {
                // Split by newlines to handle multiple entries per cell
                const rencanaAksiLines = item.rencanaAksi.split('\n').filter(line => line.trim());
                const targetLines = item.target.split('\n').filter(line => line.trim());
                const buktiLines = item.namaBuktiDukung.split('\n').filter(line => line.trim());
                const linkLines = item.linkBuktiDukung.split('\n').filter(line => line.trim());
                const realisasiLines = item.realisasi.split('\n').filter(line => line.trim());
                const sumberLines = item.sumberData.split('\n').filter(line => line.trim());

                const maxLines = Math.max(
                    rencanaAksiLines.length,
                    targetLines.length,
                    buktiLines.length,
                    linkLines.length,
                    realisasiLines.length,
                    sumberLines.length
                );

                for (let i = 0; i < maxLines; i++) {
                    data.push({
                        rencanaAksi: rencanaAksiLines[i] || '',
                        target: targetLines[i] || '',
                        namaBuktiDukung: buktiLines[i] || '',
                        linkBuktiDukung: linkLines[i] || '',
                        realisasi: realisasiLines[i] || '',
                        sumberData: sumberLines[i] || ''
                    });
                }
            }

            return data;
        }

        async addBuktiDukung(button, eviden, buktiEviden) {
            try {
                console.log('=== STARTING addBuktiDukung ===');
                console.log('Button:', button);
                console.log('Eviden:', eviden);
                console.log('Bukti Eviden:', buktiEviden);

                this.updateStatus(`Adding bukti: ${eviden.substring(0, 30)}...`);

                // Click the button
                console.log('Clicking bukti dukung button...');
                button.click();
                await this.delay(2000);

                // Check if modal appeared
                console.log('Checking for bukti dukung modal...');
                const modal = document.querySelector('.modal.show');
                console.log('Modal found:', !!modal);

                if (!modal) {
                    throw new Error('Bukti dukung modal did not appear after clicking button');
                }

                console.log('Modal HTML:', modal.outerHTML.substring(0, 500));

                // Find inputs
                const evidenInput = modal.querySelector('input[name="eviden"]');
                const buktiEvidenInput = modal.querySelector('input[name="bukti_eviden"]');

                console.log('Eviden input found:', !!evidenInput);
                console.log('Bukti eviden input found:', !!buktiEvidenInput);

                if (!evidenInput || !buktiEvidenInput) {
                    throw new Error('Required inputs not found in bukti dukung modal');
                }

                // Fill inputs
                console.log('Filling eviden input...');
                evidenInput.value = eviden;
                evidenInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Eviden input value:', evidenInput.value);

                console.log('Filling bukti eviden input...');
                buktiEvidenInput.value = buktiEviden;
                buktiEvidenInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Bukti eviden input value:', buktiEvidenInput.value);

                await this.delay(1000);

                // Find OK button
                const okButton = modal.querySelector('.modal-footer button.btn-primary');
                console.log('OK button found:', !!okButton);

                if (!okButton) {
                    throw new Error('OK button not found in bukti dukung modal');
                }

                console.log('OK button text:', okButton.textContent);
                console.log('OK button disabled:', okButton.disabled);

                // Click OK button
                console.log('Clicking OK button...');
                okButton.click();

                // Wait and check if modal closed
                await this.delay(2000);

                const modalAfterClick = document.querySelector('.modal.show');
                console.log('Modal still visible after OK click:', !!modalAfterClick);

                if (modalAfterClick) {
                    console.log('Modal still open, trying alternative methods...');

                    // Try Enter key
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    okButton.dispatchEvent(enterEvent);
                    await this.delay(1000);

                    const modalAfterEnter = document.querySelector('.modal.show');
                    if (modalAfterEnter) {
                        console.log('Modal still open after Enter, forcing close...');
                        const closeBtn = modal.querySelector('.btn-close');
                        if (closeBtn) closeBtn.click();
                        throw new Error('Could not submit bukti dukung modal - forced close');
                    }
                }

                console.log('=== addBuktiDukung COMPLETED SUCCESSFULLY ===');
                this.updateStatus('Bukti dukung added successfully');

            } catch (error) {
                console.error('=== ERROR in addBuktiDukung ===');
                console.error('Error:', error.message);
                this.updateStatus(`Bukti dukung error: ${error.message}`);

                // Force close any open modal
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const closeBtn = modal.querySelector('.btn-close, button[data-bs-dismiss="modal"]');
                    if (closeBtn) {
                        console.log('Force closing bukti dukung modal...');
                        closeBtn.click();
                    }
                }

                await this.delay(2000);
                throw error;
            }
        }

        async addRealisasi(button, realisasi, sumberData) {
            try {
                console.log('=== STARTING addRealisasi ===');
                console.log('Button:', button);
                console.log('Realisasi:', realisasi);
                console.log('Sumber Data:', sumberData);

                this.updateStatus(`Adding realisasi: ${realisasi.substring(0, 30)}...`);

                // Click the button
                console.log('Clicking realisasi button...');
                button.click();
                await this.delay(2000);

                // Check if modal appeared
                console.log('Checking for realisasi modal...');
                const modal = document.querySelector('.modal.show');
                console.log('Modal found:', !!modal);

                if (!modal) {
                    throw new Error('Realisasi modal did not appear after clicking button');
                }

                console.log('Modal HTML:', modal.outerHTML.substring(0, 500));

                // Find inputs
                const realisasiInput = modal.querySelector('input[name="realisasi"]');
                const sumberDataInput = modal.querySelector('input[name="sumber_data"]');

                console.log('Realisasi input found:', !!realisasiInput);
                console.log('Sumber data input found:', !!sumberDataInput);

                if (!realisasiInput || !sumberDataInput) {
                    throw new Error('Required inputs not found in realisasi modal');
                }

                // Fill inputs
                console.log('Filling realisasi input...');
                realisasiInput.value = realisasi;
                realisasiInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Realisasi input value:', realisasiInput.value);

                console.log('Filling sumber data input...');
                sumberDataInput.value = sumberData;
                sumberDataInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Sumber data input value:', sumberDataInput.value);

                await this.delay(1000);

                // Find OK button
                const okButton = modal.querySelector('.modal-footer button.btn-primary');
                console.log('OK button found:', !!okButton);

                if (!okButton) {
                    throw new Error('OK button not found in realisasi modal');
                }

                console.log('OK button text:', okButton.textContent);
                console.log('OK button disabled:', okButton.disabled);

                // Click OK button
                console.log('Clicking OK button...');
                okButton.click();

                // Wait and check if modal closed
                await this.delay(2000);

                const modalAfterClick = document.querySelector('.modal.show');
                console.log('Modal still visible after OK click:', !!modalAfterClick);

                if (modalAfterClick) {
                    console.log('Modal still open, trying alternative methods...');

                    // Try Enter key
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    okButton.dispatchEvent(enterEvent);
                    await this.delay(1000);

                    const modalAfterEnter = document.querySelector('.modal.show');
                    if (modalAfterEnter) {
                        console.log('Modal still open after Enter, forcing close...');
                        const closeBtn = modal.querySelector('.btn-close');
                        if (closeBtn) closeBtn.click();
                        throw new Error('Could not submit realisasi modal - forced close');
                    }
                }

                console.log('=== addRealisasi COMPLETED SUCCESSFULLY ===');
                this.updateStatus('Realisasi added successfully');

            } catch (error) {
                console.error('=== ERROR in addRealisasi ===');
                console.error('Error:', error.message);
                this.updateStatus(`Realisasi error: ${error.message}`);

                // Force close any open modal
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const closeBtn = modal.querySelector('.btn-close, button[data-bs-dismiss="modal"]');
                    if (closeBtn) {
                        console.log('Force closing realisasi modal...');
                        closeBtn.click();
                    }
                }

                await this.delay(2000);
                throw error;
            }
        }

        async navigateToEviden() {
            try {
                console.log('=== NAVIGATING TO EVIDEN ===');
                this.updateStatus('Looking for Eviden link...');

                // Look for the link with text containing "Pengisian Bukti Dukung"
                const allLinks = document.querySelectorAll('a');
                console.log('Total links found:', allLinks.length);

                let evidenLink = null;

                // Search for link by text content
                for (let i = 0; i < allLinks.length; i++) {
                    const link = allLinks[i];
                    const linkText = link.textContent.trim();
                    console.log(`Link ${i}: "${linkText}"`);

                    if (linkText.includes('Pengisian Bukti Dukung') ||
                        linkText.includes('Lihat Hasil') ||
                        linkText.includes('Eviden')) {
                        evidenLink = link;
                        console.log(`Found eviden link at index ${i}: "${linkText}"`);
                        break;
                    }
                }

                if (!evidenLink) {
                    // Try alternative search - look for href containing 'eviden'
                    evidenLink = Array.from(allLinks).find(link =>
                                                           link.href && link.href.includes('eviden')
                                                          );

                    if (evidenLink) {
                        console.log('Found eviden link by href:', evidenLink.href);
                    }
                }

                if (evidenLink) {
                    console.log('Clicking eviden link:', evidenLink.href);
                    this.updateStatus('Navigating to Eviden page...');
                    evidenLink.click();

                    // Wait for page to load
                    await this.delay(3000);

                    // Check if we're on eviden page
                    const currentUrl = window.location.href;
                    console.log('Current URL after navigation:', currentUrl);

                    if (currentUrl.includes('eviden')) {
                        console.log('Successfully navigated to eviden page');
                        this.updateStatus('On Eviden page, starting processing...');

                        // Start processing eviden
                        await this.processEviden();
                    } else {
                        throw new Error('Navigation failed - not on eviden page');
                    }
                } else {
                    console.log('Available links:');
                    allLinks.forEach((link, index) => {
                        console.log(`Link ${index}: "${link.textContent.trim()}" - ${link.href}`);
                    });
                    throw new Error('Eviden link not found');
                }
            } catch (error) {
                console.error('Error navigating to eviden:', error);
                this.updateStatus(`Navigation error: ${error.message}`);
                this.pauseAutomation();
            }
        }

        async waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const check = () => {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    } else {
                        setTimeout(check, 100);
                    }
                };

                check();
            });
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        pauseAutomation() {
            this.isRunning = false;
            this.updateButtons();
            this.updateStatus('Paused');
        }

        continueAutomation() {
            this.isRunning = true;
            this.updateButtons();
            this.startAutomation();
        }

        cancelAutomation() {
            this.isRunning = false;
            this.currentProgress = { currentRow: 0, processedRows: 0, totalRows: 0 };
            this.saveProgress();
            this.updateButtons();
            this.updateProgressBar();
            this.updateStatus('Cancelled');
        }

        completeAutomation() {
            this.isRunning = false;
            this.updateButtons();
            this.updateStatus('Completed successfully!');
            this.clearProgress();
        }

        updateButtons() {
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            const continueBtn = document.getElementById('continueBtn');

            if (this.isRunning) {
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                cancelBtn.disabled = false;
                continueBtn.style.display = 'none';
            } else {
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                cancelBtn.disabled = true;

                if (this.currentProgress.processedRows > 0 && this.currentProgress.processedRows < this.currentProgress.totalRows) {
                    continueBtn.style.display = 'inline-block';
                } else {
                    continueBtn.style.display = 'none';
                }
            }
        }

        updateProgress(processed, total) {
            this.currentProgress.processedRows = processed;
            this.currentProgress.totalRows = total;
            this.saveProgress();
            this.updateProgressBar();
        }

        updateProgressBar() {
            const progressFill = document.getElementById('progressFill');
            const processedCount = document.getElementById('processedCount');
            const totalCount = document.getElementById('totalCount');

            const percentage = this.currentProgress.totalRows > 0
                ? (this.currentProgress.processedRows / this.currentProgress.totalRows) * 100
                : 0;

            progressFill.style.width = `${percentage}%`;
            processedCount.textContent = this.currentProgress.processedRows;
            totalCount.textContent = this.currentProgress.totalRows;
        }

        updateStatus(message) {
            document.getElementById('statusText').textContent = message;
        }

        saveData() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.csvData));
        }

        loadData() {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        }

        saveProgress() {
            const progressData = {
                ...this.currentProgress,
                currentPage: this.getCurrentPageType(),
                timestamp: Date.now(),
                csvDataLength: this.csvData.length
            };
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
        }

        loadProgress() {
            const progress = localStorage.getItem(PROGRESS_KEY);
            return progress ? JSON.parse(progress) : {
                currentRow: 0,
                processedRows: 0,
                totalRows: 0,
                currentPage: null,
                timestamp: null,
                csvDataLength: 0
            };
        }

        clearProgress() {
            localStorage.removeItem(PROGRESS_KEY);
            this.currentProgress = { currentRow: 0, processedRows: 0, totalRows: 0 };
        }
    }

    // Initialize automation when page loads
    window.addEventListener('load', () => {
        new EkinAutomation();
    });

})();
