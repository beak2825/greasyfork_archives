// ==UserScript==
// @name         Coretax Layanan Mandiri
// @namespace    http://tampermonkey.net/
// @version      2025-07-25
// @description  Coretax Automaton "Layanan Mandiri"
// @author       You
// @match        https://coretaxdjp.pajak.go.id/payment-portal/id-ID/self-billing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=go.id
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535416/Coretax%20Layanan%20Mandiri.user.js
// @updateURL https://update.greasyfork.org/scripts/535416/Coretax%20Layanan%20Mandiri.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const styles = `
        <style>
.custom-select-wrapper {
    position: relative;
    z-index: 1000;
}

.automation-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 380px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    overflow: visible; /* Ubah dari hidden ke visible */
    max-height: 900px;
    height: 600px;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.automation-panel.minimized {
    max-height: 60px !important;
}

.automation-panel.minimized .automation-body {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}

        .automation-header {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 12px 12px 0 0;
            user-select: none;
        }

        .automation-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.3px;
        }

        .minimize-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 6px 8px;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .minimize-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

.automation-body {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 1;
    transform: translateY(0);
    height: 100%;
    overflow: hidden;
}

        .tab-container {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }

        .tab-button {
            flex: 1;
            padding: 12px 16px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
        }

        .tab-button.active {
            color: #007bff;
            border-bottom-color: #007bff;
            background: rgba(0,123,255,0.05);
        }

        .tab-button:hover:not(.active) {
            background: rgba(0,0,0,0.05);
            color: #495057;
        }

.tab-content {
    padding: 20px;
    overflow: visible; /* Tambahkan ini */
}

.tab-pane {
    display: none;
    overflow: visible; /* Tambahkan ini */
}

.tab-pane.active {
    display: block;
    animation: fadeInUp 0.3s ease;
    overflow: visible; /* Tambahkan ini */
}

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-group {
            margin-bottom: 16px;
        }

.tax-form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #202124;
    font-size: 14px;
    letter-spacing: -0.2px;
}

.tax-form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #f1f3f4;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: #fafbfc;
    box-sizing: border-box;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    resize: vertical;
    min-height: 44px;
}

.tax-form-input:focus {
    outline: none;
    border-color: #4285f4;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
    transform: translateY(-1px);
}

.tax-form-input:hover:not(:focus) {
    border-color: #e8eaed;
    background: #fff;
}

.tax-form-select {
    width: 100%;
    padding: 12px 40px 12px 16px; /* Tambah padding kanan untuk arrow */
    border: 2px solid #f1f3f4;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: #fafbfc;
    box-sizing: border-box;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    cursor: pointer;
}

.tax-form-select:focus {
    outline: none;
    border-color: #4285f4;
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
    transform: translateY(-1px);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234285f4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

.tax-form-select:hover:not(:focus) {
    border-color: #e8eaed;
    background-color: #fff;
}

/* Style untuk optgroup */
.tax-form-select optgroup {
    font-weight: 600;
    color: #5f6368;
    background: #f8f9fa;
}

.tax-form-select option {
    padding: 8px 12px;
    color: #202124;
    background: #fff;
}

        .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-right: 8px;
            margin-bottom: 8px;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn-primary {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, #28a745, #1e7e34);
            color: white;
        }

        .btn-actions {
            display: flex;
            gap: 8px;
            margin-top: 20px;
        }

        .btn-actions .btn {
            flex: 1;
            margin: 0;
        }

.search-box {
    position: relative;
    margin-bottom: 16px;
}

.search-box .tax-form-input {
    padding-left: 40px;
}

.search-box::before {
    content: "🔍";
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    opacity: 0.6;
    font-size: 16px;
}

.custom-select-wrapper {
    position: relative;
}

.custom-select {
    position: relative;
    padding: 0 !important;
    border: none !important;
}

.select-display {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #f1f3f4;
    border-radius: 12px;
    font-size: 14px;
    background: #fafbfc;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-sizing: border-box;
    font-weight: 400;
    color: #202124;
    appearance: none;
    /* Hapus display flex dan justify-content */
}

.select-display:hover {
    border-color: #e8eaed;
    background: #fff;
}

.select-display.open,
.select-display:focus {
    border-color: #4285f4;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
    transform: translateY(-1px);
}

.select-text {
    /* Hapus flex: 1 */
    color: #202124;
    font-weight: 400;
    width: 100%;
    pointer-events: none;
}

.select-arrow {
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-size: contain;
    transition: transform 0.2s ease;
}

.select-display.open .select-arrow {
    transform: rotate(180deg);
}

.select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 2px solid #4285f4;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 1000;
    margin-top: 16px;
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
    transition: all 0.2s ease;
}

.select-dropdown.open {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
}

.select-dropdown.closing {
    opacity: 0;
    transform: translateY(-10px);
    visibility: visible;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.select-search {
    padding: 12px;
    border-bottom: 1px solid #f1f3f4;
}

.select-search-input {
    margin: 0 !important;
    font-size: 13px !important;
}

.select-options {
    max-height: 200px;
    overflow-y: auto;
}

.option-group {
    padding: 8px 0;
}

.option-group:not(:last-child) {
    border-bottom: 1px solid #f1f3f4;
}

.option-group-label {
    padding: 8px 16px 4px;
    font-size: 12px;
    font-weight: 600;
    color: #5f6368;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.select-option {
    padding: 10px 16px;
    cursor: pointer;
    color: #202124;
    transition: background 0.2s ease;
    font-weight: 400;
}

.select-option:hover {
    background: #f8f9fa;
}

.select-option.active {
    background: rgba(66, 133, 244, 0.1);
    color: #4285f4;
    font-weight: 500;
}

.select-option.hidden {
    display: none;
}

        .history-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .history-empty {
            text-align: center;
            color: #6c757d;
            padding: 40px 20px;
            font-style: italic;
        }

        .date-header {
            background: linear-gradient(135deg, #e9ecef, #dee2e6);
            padding: 8px 16px;
            font-weight: 600;
            font-size: 12px;
            color: #495057;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #dee2e6;
        }

        .history-item {
            padding: 12px 16px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            transition: background 0.2s ease;
        }

        .history-item:hover {
            background: #f8f9fa;
        }

        .history-item:last-child {
            border-bottom: none;
        }

        .history-info {
            flex: 1;
        }

        .history-tax-type {
            font-weight: 600;
            color: #374151;
            margin-bottom: 2px;
        }

        .history-details {
            font-size: 12px;
            color: #6c757d;
        }

        .history-details strong {
    font-weight: 700;
    color: #1a73e8;
}

        .reuse-btn {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .reuse-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(40,167,69,0.3);
        }

        .progress-section {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e9ecef;
            display: none;
        }

        .progress-section.active {
            display: block;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e9ecef;
            border-radius: 3px;
            overflow: hidden;
            margin: 8px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
            border-radius: 3px;
        }

        .status-text {
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }
        </style>
    `;

    // Inject styles to head
    document.head.insertAdjacentHTML('beforeend', styles);

    // Create main panel
    const panel = document.createElement('div');
    panel.className = 'automation-panel';
    panel.innerHTML = `
        <div class="automation-header">
            <h3>🏛️ Automaton Layanan Mandiri Kode Billing</h3>
            <button class="minimize-btn" title="Minimize/Expand">▼</button>
        </div>
        <div class="automation-body">
            <div class="tab-container">
                <button class="tab-button active" data-tab="form">📝 Form</button>
                <button class="tab-button" data-tab="history">📋 Riwayat</button>
            </div>

            <div class="tab-content">
                <!-- Form Tab -->
                <div class="tab-pane active" id="form-tab">
<div class="form-group">
    <label class="tax-form-label">💰 Nominal Pajak</label>
    <input type="text" class="tax-form-input" id="tax-amount" placeholder="Contoh: 1.234.567">
</div>

<div class="form-group">
    <label class="tax-form-label">📄 Jenis Pajak</label>
    <div class="custom-select-wrapper">
        <div class="custom-select" id="custom-tax-type">
            <input type="text" class="tax-form-input select-display" readonly placeholder="Pilih jenis pajak...">
            <div class="select-dropdown">
                <div class="select-search">
                    <input type="text" class="tax-form-input select-search-input" placeholder="Cari jenis pajak...">
                </div>
                <div class="select-options">
                    <div class="option-group">
                        <div class="option-group-label">Pajak Sering</div>
                        <div class="select-option active" data-value="PPN Dalam Negeri">PPN Dalam Negeri</div>
                        <div class="select-option" data-value="PPh 21">PPh 21</div>
                        <div class="select-option" data-value="PPh 22">PPh 22</div>
                        <div class="select-option" data-value="PPh 23">PPh 23</div>
                    </div>
                    <div class="option-group">
                        <div class="option-group-label">Pajak Jarang</div>
                        <div class="select-option" data-value="PPh 26">PPh 26</div>
                    </div>
                </div>
            </div>
        </div>
        <input type="hidden" id="tax-type" value="PPN Dalam Negeri">
    </div>
</div>

<div class="form-group">
    <label class="tax-form-label">📅 Bulan Masa Pajak</label>
    <select class="tax-form-select" id="tax-month">
        <option value="">Pilih bulan...</option>
        <option value="01">Januari</option>
        <option value="02">Februari</option>
        <option value="03">Maret</option>
        <option value="04">April</option>
        <option value="05">Mei</option>
        <option value="06">Juni</option>
        <option value="07">Juli</option>
        <option value="08">Agustus</option>
        <option value="09">September</option>
        <option value="10">Oktober</option>
        <option value="11">November</option>
        <option value="12">Desember</option>
    </select>
</div>

<div class="form-group">
    <label class="tax-form-label">📆 Tahun Pajak</label>
    <select class="tax-form-select" id="tax-year">
        <option value="2024">2024</option>
        <option value="2025" selected>2025</option>
        <option value="2026">2026</option>
    </select>
</div>

<div class="form-group">
    <label class="tax-form-label">📝 Keterangan</label>
    <input type="text" class="tax-form-input" id="tax-remarks" placeholder="Masukkan keterangan pajak">
</div>

                    <div class="btn-actions">
                        <button class="btn btn-secondary" id="reset-form">🔄 Reset</button>
                        <button class="btn btn-primary" id="submit-form">🚀 Submit</button>
                    </div>

                    <div class="progress-section" id="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="status-text" id="status-text">Memulai proses...</div>
                    </div>
                </div>

                <!-- History Tab -->
                <div class="tab-pane" id="history-tab">
<div class="search-box">
    <input type="text" class="tax-form-input" id="search-history" placeholder="Cari riwayat...">
</div>

                    <div class="history-list" id="history-list">
                        <div class="history-empty">Belum ada riwayat pembayaran</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // Tab functionality
    const tabButtons = panel.querySelectorAll('.tab-button');
    const tabPanes = panel.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding pane
            const targetTab = button.dataset.tab + '-tab';
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Minimize functionality
    let isMinimized = false;
    const minimizeBtn = panel.querySelector('.minimize-btn');
    const automationBody = panel.querySelector('.automation-body');

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;

        if (isMinimized) {
            panel.classList.add('minimized');
            minimizeBtn.textContent = '▲';
            minimizeBtn.title = 'Expand';
        } else {
            panel.classList.remove('minimized');
            minimizeBtn.textContent = '▼';
            minimizeBtn.title = 'Minimize';
        }
    });

    // Header click to toggle minimize
    panel.querySelector('.automation-header').addEventListener('click', (e) => {
        if (e.target !== minimizeBtn) {
            minimizeBtn.click();
        }
    });

    // Format input untuk nominal pajak
    const taxAmountInput = document.getElementById('tax-amount');
    taxAmountInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('id-ID').replace(/,/g, '.');
        }
        this.value = value;
    });

    // Event handlers
    document.getElementById('reset-form').addEventListener('click', function() {
        document.getElementById('tax-amount').value = '';
        document.getElementById('tax-type').selectedIndex = 0;
    });

    document.getElementById('search-history').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterHistory(searchTerm);
    });

    // Progress management
    function updateProgress(percentage, message) {
        const progressSection = document.getElementById('progress-section');
        const progressFill = document.getElementById('progress-fill');
        const statusText = document.getElementById('status-text');

        progressSection.classList.add('active');
        progressFill.style.width = percentage + '%';
        statusText.textContent = message;

        if (percentage >= 100) {
            setTimeout(() => {
                progressSection.classList.remove('active');
            }, 2000);
        }
    }

    function formatIndonesianDate(timestamp) {
        const date = new Date(timestamp);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName}, ${day} ${month} ${year}`;
    }

    // History management functions
    function loadHistory() {
        const history = GM_getValue('taxHistory', []);
        renderHistory(history);
    }

    function renderHistory(historyItems) {
        const historyList = document.getElementById('history-list');

        if (historyItems.length === 0) {
            historyList.innerHTML = '<div class="history-empty">🗃️ Belum ada riwayat pembayaran</div>';
            return;
        }

        const groupedItems = {};
        historyItems.forEach(item => {
            const date = formatIndonesianDate(item.timestamp);
            if (!groupedItems[date]) {
                groupedItems[date] = [];
            }
            groupedItems[date].push(item);
        });

        historyList.innerHTML = '';

        Object.keys(groupedItems).sort((a, b) => {
            return new Date(b.split('/').reverse().join('/')) - new Date(a.split('/').reverse().join('/'));
        }).forEach(date => {
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.textContent = date;
            historyList.appendChild(dateHeader);

            groupedItems[date].sort((a, b) => b.timestamp - a.timestamp).forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.dataset.id = item.id;

                const time = new Date(item.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + ' WITA';

                historyItem.innerHTML = `
    <div class="history-info">
        <div class="history-tax-type">${item.taxType}</div>
        <div class="history-details"><strong>${formatRupiah(item.amount)}</strong> • ${time}</div>
    </div>
    <button class="reuse-btn">Gunakan</button>
`;

                historyList.appendChild(historyItem);
            });
        });

        document.querySelectorAll('.reuse-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const historyItem = this.closest('.history-item');
                const itemId = historyItem.dataset.id;
                reuseHistoryItem(itemId);
            });
        });
    }

    function filterHistory(searchTerm) {
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    }

    function formatRupiah(amount) {
        return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
    }

    function reuseHistoryItem(itemId) {
        const history = GM_getValue('taxHistory', []);
        const item = history.find(h => h.id === itemId);

        if (item) {
            document.getElementById('tax-amount').value = parseInt(item.amount).toLocaleString('id-ID').replace(/,/g, '.');

            const taxTypeSelect = document.getElementById('tax-type');
            for (let i = 0; i < taxTypeSelect.options.length; i++) {
                if (taxTypeSelect.options[i].value === item.taxType) {
                    taxTypeSelect.selectedIndex = i;
                    break;
                }
            }

            // Switch to form tab
            tabButtons[0].click();
        }
    }

    function addToHistory(taxType, amount) {
        const history = GM_getValue('taxHistory', []);
        const newItem = {
            id: Date.now().toString(),
            taxType,
            amount,
            timestamp: Date.now()
        };

        history.unshift(newItem);

        if (history.length > 100) {
            history.pop();
        }

        GM_setValue('taxHistory', history);
        renderHistory(history);
    }

    // Submit form handler
    document.getElementById('submit-form').addEventListener('click', function() {
        const taxAmount = document.getElementById('tax-amount').value;
        const taxType = document.getElementById('tax-type').value;

        if (!taxAmount) {
            alert('Silakan masukkan nominal pajak');
            return;
        }

        startAutomation(taxAmount, taxType);
    });

    // Automation functions
    function startAutomation(taxAmount, taxType) {
        console.log("Mulai otomatisasi dengan nominal:", taxAmount, "jenis pajak:", taxType);
        updateProgress(0, "Memulai proses otomatisasi...");

        const numericAmount = taxAmount.replace(/\./g, '');

        clickNextButton()
            .then(() => {
            updateProgress(10, "Mengklik tombol Lanjut...");
            return waitAndSelectTaxType();
        })
            .then(() => {
            updateProgress(20, "Memilih jenis pajak...");
            return waitAndSelectPeriod(); // TaxPeriod tetap di sini
        })
            .then(() => {
            updateProgress(30, "Memilih periode...");
            return clickNextButton();
        })
            .then(() => {
            updateProgress(40, "Melanjutkan ke halaman input...");
            return waitAndInputAmount(taxAmount);
        })
            .then(() => {
            updateProgress(50, "Mengisi nominal pajak...");
            return waitAndSelectRemarks(taxType); // Ini untuk deposit-desc
        })
            .then(() => {
            updateProgress(60, "Memilih deskripsi deposit...");
            return waitAndSelectDepositMonth(); // Dropdown deposit-month
        })
            .then(() => {
            updateProgress(70, "Memilih bulan masa pajak...");
            return waitAndSelectDepositYear(); // Dropdown deposit-year
        })
            .then(() => {
            updateProgress(80, "Memilih tahun pajak...");
            return waitAndInputRemarks(); // Input textarea keterangan
        })
            .then(() => {
            updateProgress(90, "Mengisi keterangan...");
            return clickDownloadButton();
        })
            .then(() => {
            updateProgress(100, "✅ Proses selesai!");
            addToHistory(taxType, numericAmount);
        })
            .catch(error => {
            updateProgress(0, "❌ Terjadi kesalahan: " + error);
            console.error('Terjadi kesalahan dalam otomatisasi:', error);
        });
    }

    function clickNextButton() {
        return new Promise((resolve, reject) => {
            const nextButton = document.querySelector('button#Next');
            if (nextButton) {
                console.log("Menemukan tombol Lanjut, mengklik...");
                nextButton.click();
                setTimeout(resolve, 1000);
            } else {
                console.log("Tombol Lanjut tidak ditemukan, mencoba lagi dalam 2 detik...");
                setTimeout(() => {
                    const retryButton = document.querySelector('button#Next');
                    if (retryButton) {
                        console.log("Menemukan tombol Lanjut pada percobaan kedua, mengklik...");
                        retryButton.click();
                        setTimeout(resolve, 1000);
                    } else {
                        reject('Tombol Lanjut tidak ditemukan');
                    }
                }, 2000);
            }
        });
    }

    function waitAndSelectTaxType() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown KAP-KJS...");
            waitForElement('p-dropdown[id="TaxTypeTaxPayment"]')
                .then(dropdown => {
                    console.log("Dropdown KAP-KJS ditemukan");
                    const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                    if (triggerButton) {
                        console.log("Mengklik trigger dropdown...");
                        triggerButton.click();

                        setTimeout(() => {
                            const depositOption = document.querySelector('li[aria-label="411618-100 Setoran untuk Deposit Pajak"]');

                            if (depositOption) {
                                console.log("Opsi Deposit Pajak ditemukan, memilih...");
                                depositOption.click();
                                setTimeout(resolve, 1000);
                            } else {
                                console.log("Mencari dengan cara alternatif...");
                                const items = document.querySelectorAll('.p-dropdown-item');
                                let found = false;

                                items.forEach(item => {
                                    if (item.textContent.includes('411618-100 Setoran untuk Deposit Pajak')) {
                                        console.log("Opsi ditemukan dengan pencarian teks, memilih...");
                                        item.click();
                                        found = true;
                                        setTimeout(resolve, 1000);
                                    }
                                });

                                if (!found) {
                                    reject('Opsi Setoran untuk Deposit Pajak tidak ditemukan');
                                }
                            }
                        }, 1500);
                    } else {
                        reject('Trigger dropdown tidak ditemukan');
                    }
                })
                .catch(error => {
                    reject('Dropdown jenis pajak tidak ditemukan: ' + error);
                });
        });
    }

    function waitAndSelectPeriod() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown Periode...");
            waitForElement('p-dropdown[id="TaxPeriod"]')
                .then(dropdown => {
                    console.log("Dropdown Periode ditemukan");
                    const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                    if (triggerButton) {
                        console.log("Mengklik trigger dropdown periode...");
                        triggerButton.click();

                        setTimeout(() => {
                            const periodOption = document.querySelector('li[aria-label="Januari - Desember 2025"]');

                            if (periodOption) {
                                console.log("Opsi periode ditemukan, memilih...");
                                periodOption.click();
                                setTimeout(resolve, 1000);
                            } else {
                                console.log("Mencari periode dengan cara alternatif...");
                                const items = document.querySelectorAll('.p-dropdown-item');
                                let found = false;

                                items.forEach(item => {
                                    if (item.textContent.includes('Januari - Desember 2025')) {
                                        console.log("Periode ditemukan dengan pencarian teks, memilih...");
                                        item.click();
                                        found = true;
                                        setTimeout(resolve, 1000);
                                    }
                                });

                                if (!found) {
                                    reject('Opsi periode tidak ditemukan');
                                }
                            }
                        }, 1500);
                    } else {
                        reject('Trigger dropdown periode tidak ditemukan');
                    }
                })
                .catch(error => {
                    reject('Dropdown periode tidak ditemukan: ' + error);
                });
        });
    }

    function waitAndInputAmount(amount) {
        return new Promise((resolve, reject) => {
            console.log("Menunggu input nominal pajak...");
            waitForElement('#AmountInput')
                .then(input => {
                    console.log("Input nominal pajak ditemukan");
                    const numericAmount = amount.replace(/\./g, '');
                    input.value = numericAmount;
                    console.log("Nominal diset:", numericAmount);

                    const events = ['input', 'change', 'blur'];
                    events.forEach(eventName => {
                        const event = new Event(eventName, { bubbles: true });
                        input.dispatchEvent(event);
                    });

                    setTimeout(resolve, 500);
                })
                .catch(error => {
                    reject('Input nominal tidak ditemukan: ' + error);
                });
        });
    }

    function waitAndSelectDepositDesc() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown Deposit Description...");
            waitForElement('p-dropdown[id="deposit-desc"]')
                .then(dropdown => {
                console.log("Dropdown Deposit Description ditemukan");
                const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                if (triggerButton) {
                    console.log("Mengklik trigger dropdown deposit desc...");
                    triggerButton.click();

                    setTimeout(() => {
                        const items = document.querySelectorAll('.p-dropdown-item');
                        let found = false;

                        items.forEach(item => {
                            // Pilih opsi yang sesuai dengan jenis pajak
                            const taxType = document.getElementById('tax-type').value;
                            let targetText = '';

                            switch(taxType) {
                                case 'PPN Dalam Negeri':
                                    targetText = 'PPN Dalam Negeri';
                                    break;
                                case 'PPh 21':
                                    targetText = 'PPh Pasal 21';
                                    break;
                                case 'PPh 22':
                                    targetText = 'PPh Pasal 22';
                                    break;
                                case 'PPh 23':
                                    targetText = 'PPh Pasal 23';
                                    break;
                                case 'PPh 26':
                                    targetText = 'PPh Pasal 26';
                                    break;
                                default:
                                    targetText = 'PPN Dalam Negeri';
                            }

                            if (item.textContent.includes(targetText)) {
                                console.log("Opsi deposit desc ditemukan, memilih...");
                                item.click();
                                found = true;
                                setTimeout(resolve, 1000);
                            }
                        });

                        if (!found) {
                            reject('Opsi deposit description tidak ditemukan');
                        }
                    }, 1500);
                } else {
                    reject('Trigger dropdown deposit desc tidak ditemukan');
                }
            })
                .catch(error => {
                reject('Dropdown deposit desc tidak ditemukan: ' + error);
            });
        });
    }

    function waitAndSelectDepositMonth() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown Deposit Month...");
            waitForElement('p-dropdown[id="deposit-month"]')
                .then(dropdown => {
                console.log("Dropdown Deposit Month ditemukan");
                const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                if (triggerButton) {
                    console.log("Mengklik trigger dropdown deposit month...");
                    triggerButton.click();

                    setTimeout(() => {
                        const selectedMonth = document.getElementById('tax-month').value;
                        const monthNames = {
                            '01': 'Januari', '02': 'Februari', '03': 'Maret',
                            '04': 'April', '05': 'Mei', '06': 'Juni',
                            '07': 'Juli', '08': 'Agustus', '09': 'September',
                            '10': 'Oktober', '11': 'November', '12': 'Desember'
                        };

                        const targetMonth = monthNames[selectedMonth] || getCurrentMonth();
                        const items = document.querySelectorAll('.p-dropdown-item');
                        let found = false;

                        items.forEach(item => {
                            if (item.textContent.includes(targetMonth)) {
                                console.log("Opsi bulan ditemukan, memilih...");
                                item.click();
                                found = true;
                                setTimeout(resolve, 1000);
                            }
                        });

                        if (!found) {
                            reject('Opsi bulan tidak ditemukan');
                        }
                    }, 1500);
                } else {
                    reject('Trigger dropdown deposit month tidak ditemukan');
                }
            })
                .catch(error => {
                reject('Dropdown deposit month tidak ditemukan: ' + error);
            });
        });
    }

    function waitAndSelectDepositYear() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown Deposit Year...");
            waitForElement('p-dropdown[id="deposit-year"]')
                .then(dropdown => {
                console.log("Dropdown Deposit Year ditemukan");
                const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                if (triggerButton) {
                    console.log("Mengklik trigger dropdown deposit year...");
                    triggerButton.click();

                    setTimeout(() => {
                        const selectedYear = document.getElementById('tax-year').value;
                        const items = document.querySelectorAll('.p-dropdown-item');
                        let found = false;

                        items.forEach(item => {
                            if (item.textContent.includes(selectedYear)) {
                                console.log("Opsi tahun ditemukan, memilih...");
                                item.click();
                                found = true;
                                setTimeout(resolve, 1000);
                            }
                        });

                        if (!found) {
                            reject('Opsi tahun tidak ditemukan');
                        }
                    }, 1500);
                } else {
                    reject('Trigger dropdown deposit year tidak ditemukan');
                }
            })
                .catch(error => {
                reject('Dropdown deposit year tidak ditemukan: ' + error);
            });
        });
    }

    function getCurrentMonth() {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[new Date().getMonth()];
    }

    function waitAndSelectRemarks(taxType) {
        return new Promise((resolve, reject) => {
            console.log("Menunggu dropdown Deposit Description...");
            waitForElement('p-dropdown[id="deposit-desc"]')
                .then(dropdown => {
                console.log("Dropdown Deposit Description ditemukan");
                const triggerButton = dropdown.querySelector('.p-dropdown-trigger');
                if (triggerButton) {
                    console.log("Mengklik trigger dropdown deposit desc...");
                    triggerButton.click();

                    let remarkLabel = '';
                    switch(taxType) {
                        case 'PPN Dalam Negeri':
                            remarkLabel = 'PPN Dalam Negeri';
                            break;
                        case 'PPh 21':
                            remarkLabel = 'PPh Pasal 21';
                            break;
                        case 'PPh 22':
                            remarkLabel = 'PPh Pasal 22';
                            break;
                        case 'PPh 23':
                            remarkLabel = 'PPh Pasal 23';
                            break;
                        case 'PPh 26':
                            remarkLabel = 'PPh Pasal 26';
                            break;
                        default:
                            remarkLabel = 'PPN Dalam Negeri';
                    }

                    console.log("Mencari deposit desc:", remarkLabel);

                    setTimeout(() => {
                        const items = document.querySelectorAll('.p-dropdown-item');
                        let found = false;

                        items.forEach(item => {
                            if (item.textContent.includes(remarkLabel)) {
                                console.log("Deposit desc ditemukan, memilih...");
                                item.click();
                                found = true;
                                setTimeout(resolve, 1000);
                            }
                        });

                        if (!found) {
                            reject('Opsi deposit description tidak ditemukan');
                        }
                    }, 1500);
                } else {
                    reject('Trigger dropdown deposit desc tidak ditemukan');
                }
            })
                .catch(error => {
                reject('Dropdown deposit desc tidak ditemukan: ' + error);
            });
        });
    }

    function waitAndInputRemarks() {
        return new Promise((resolve, reject) => {
            console.log("Menunggu input keterangan...");
            waitForElement('input#Remarks')
                .then(input => {
                console.log("Input keterangan ditemukan");
                const remarks = document.getElementById('tax-remarks').value || 'Pembayaran pajak';
                input.value = remarks;
                console.log("Keterangan diset:", remarks);

                const events = ['input', 'change', 'blur'];
                events.forEach(eventName => {
                    const event = new Event(eventName, { bubbles: true });
                    input.dispatchEvent(event);
                });

                setTimeout(resolve, 500);
            })
                .catch(error => {
                reject('Input keterangan tidak ditemukan: ' + error);
            });
        });
    }

    function clickDownloadButton() {
        return new Promise((resolve, reject) => {
            console.log("Mencari tombol Unduh Kode Billing...");
            const downloadButton = document.querySelector('button[id="Download Billing Code"]');
            if (downloadButton) {
                console.log("Tombol Unduh Kode Billing ditemukan, mengklik...");
                downloadButton.click();
                setTimeout(resolve, 1000);
            } else {
                console.log("Tombol Unduh Kode Billing tidak ditemukan, mencoba lagi dalam 2 detik...");
                setTimeout(() => {
                    const retryButton = document.querySelector('button[id="Download Billing Code"]');
                    if (retryButton) {
                        console.log("Tombol Unduh Kode Billing ditemukan pada percobaan kedua, mengklik...");
                        retryButton.click();
                        setTimeout(resolve, 1000);
                    } else {
                        reject('Tombol Unduh Kode Billing tidak ditemukan');
                    }
                }, 2000);
            }
        });
    }

    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            let attempts = 0;
            const maxAttempts = 30;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                    return;
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(`Elemen ${selector} tidak ditemukan setelah ${maxAttempts} percobaan`);
                }
            }, 500);
        });
    }

    // Custom Select Functionality
    const customSelect = document.getElementById('custom-tax-type');
    const selectDisplay = customSelect.querySelector('.select-display');
    const selectText = customSelect.querySelector('.select-text');
    const selectDropdown = customSelect.querySelector('.select-dropdown');
    const selectOptions = customSelect.querySelectorAll('.select-option');
    const selectSearchInput = customSelect.querySelector('.select-search-input');
    const hiddenInput = document.getElementById('tax-type');

    // Toggle dropdown
    selectDisplay.addEventListener('click', function() {
        const isOpen = selectDropdown.classList.contains('open');
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    function openDropdown() {
        selectDisplay.classList.add('open');
        selectDropdown.classList.add('open');
        selectSearchInput.focus();
    }


    function closeDropdown() {
        selectDisplay.classList.remove('open');
        selectDropdown.classList.remove('open');
        selectDropdown.classList.add('closing');

        // Hapus class closing setelah animasi selesai
        setTimeout(() => {
            selectDropdown.classList.remove('closing');
            selectSearchInput.value = '';
            filterOptions('');
        }, 200);
    }

    // Option selection
    selectOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            selectDisplay.value = value;
            hiddenInput.value = value;

            // Update active state
            selectOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            closeDropdown();
        });
    });

    // Search functionality
    selectSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterOptions(searchTerm);
    });

    function filterOptions(searchTerm) {
        selectOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.classList.remove('hidden');
            } else {
                option.classList.add('hidden');
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            closeDropdown();
        }
    });

    // Prevent dropdown close when clicking inside
    selectDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });


    // Initialize
    loadHistory();
    console.log("🎉 Script Helper Pajak berhasil dimuat!");

})();
