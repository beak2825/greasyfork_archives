// ==UserScript==
// @name         Taxi Earnings Overlay
// @namespace    ZestTaxiSpyder
// @version      1.0
// @description  Displays a compact earnings summary overlay on the taxi.orangez.io dashboard.
// @author       SPYDERBIBEK
// @match        https://taxi.orangez.io/dashboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541861/Taxi%20Earnings%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/541861/Taxi%20Earnings%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function will be called as soon as the body element is available
    function onBodyReady() {

        // --- STYLES ---
        GM_addStyle(`
            #earnings-overlay {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 260px; /* Reduced width */
                background: rgba(15, 23, 42, 0.85);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 0.75rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 9999;
                color: #e2e8f0;
                font-family: 'Inter', sans-serif;
                display: flex;
                flex-direction: column;
            }

            #overlay-header {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
                padding: 0.3rem 0.5rem; /* Reduced padding */
                cursor: move;
                background: rgba(139, 92, 246, 0.2);
                border-bottom: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 0.75rem 0.75rem 0 0;
                text-align: center;
                font-weight: 600;
                font-size: 0.8rem; /* Reduced font size */
            }

            #status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #ef4444; /* Red by default */
                transition: background-color 0.5s ease;
            }

            #status-indicator.success {
                background-color: #22c55e; /* Green on success */
            }

            .header-buttons {
                margin-left: auto;
                display: flex;
                gap: 0.5rem;
            }

            .header-buttons button {
                background: none;
                border: none;
                color: #c4b5fd;
                cursor: pointer;
                font-size: 0.9rem; /* Reduced font size */
                line-height: 1;
                padding: 0.2rem;
            }
            .header-buttons button:hover {
                color: white;
            }

            #overlay-content {
                padding: 0.5rem; /* Reduced padding */
            }

            .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.3rem; /* Reduced gap */
                margin-bottom: 0.6rem; /* Reduced margin */
            }

            .summary-item {
                text-align: center;
                background: rgba(0,0,0,0.2);
                padding: 0.2rem; /* Reduced padding */
                border-radius: 0.5rem;
            }
            .summary-item p:first-child {
                color: #94a3b8;
                font-size: 0.65rem; /* Reduced font size */
                margin-bottom: 0.1rem;
            }
            .summary-item p:last-child {
                font-size: 0.9rem; /* Reduced font size */
                font-weight: 600;
            }

            .fleet-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem; /* Reduced margin */
            }

            .results-header {
                font-size: 0.9rem; /* Reduced font size */
                font-weight: 700;
                background: linear-gradient(to right, #a78bfa, #c4b5fd);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .toggle-switch {
                display: flex;
                background-color: rgba(15, 23, 42, 0.5);
                border-radius: 9999px;
                padding: 0.15rem; /* Reduced padding */
                border: 1px solid #334155;
            }
            .toggle-switch button {
                background: transparent;
                border: none;
                color: #94a3b8;
                padding: 0.15rem 0.5rem; /* Reduced padding */
                border-radius: 9999px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.6rem; /* Reduced font size */
                font-weight: 600;
            }
            .toggle-switch button.active {
                background: linear-gradient(to right, #6d28d9, #8b5cf6);
                color: white;
                box-shadow: 0 1px 5px rgba(110, 40, 217, 0.3);
            }

            .nft-card {
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5));
                border: 1px solid rgba(139, 92, 246, 0.1);
                border-radius: 0.5rem;
                padding: 0.5rem; /* Reduced padding */
                margin-bottom: 0.3rem; /* Reduced margin */
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem; /* Reduced font size */
                padding: 0.1rem 0; /* Reduced padding */
            }
            .detail-item span:first-child { color: #94a3b8; }
            .detail-item span:last-child { font-weight: 600; }
            .divider { border-top: 1px solid rgba(139, 92, 246, 0.2); margin: 0.3rem 0; }

            .pagination {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.5rem;
            }
            .pagination button {
                background: rgba(139, 92, 246, 0.2);
                border: 1px solid rgba(139, 92, 246, 0.3);
                color: #c4b5fd;
                padding: 0.2rem 0.5rem;
                border-radius: 0.3rem;
                cursor: pointer;
                font-size: 0.7rem;
            }
            .pagination button:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
            .pagination span {
                font-size: 0.75rem;
                color: #94a3b8;
            }

            .text-green { color: #4ade80; }
            .text-yellow { color: #facc15; }
            .text-purple { color: #c084fc; }
            .text-red { color: #f87171; }
        `);

        // --- UI CREATION ---
        const overlay = document.createElement('div');
        overlay.id = 'earnings-overlay';
        overlay.innerHTML = `
            <div id="overlay-header">
                <div id="status-indicator"></div>
                <span>Taxi Earnings Summary</span>
                <div class="header-buttons">
                    <button id="manual-fetch-button" title="Fetch Data Now">&#x1f50d;</button>
                    <button id="refresh-button" title="Re-process last captured data">&#x21bb;</button>
                </div>
            </div>
            <div id="overlay-content">
                <p>Waiting for data...<br><small>Click the site's 'Debug' button or the 🔍 button above.</small></p>
            </div>
        `;
        document.body.appendChild(overlay);

        // --- DRAGGABLE FUNCTIONALITY ---
        makeDraggable(overlay);

        // --- DATA INTERCEPTION & UI UPDATE ---
        let timeFrame = 'hourly';
        let currentPage = 1;
        const itemsPerPage = 4;
        let lastKnownData = null;

        // Merges data from both API endpoints for the most complete view
        function mergeApiData(pendingData, calcData) {
            const nfts = (pendingData.nft_details || []).map(pendingNft => {
                // First, try to find an exact match by token_id
                let calcNft = (calcData.nft_details || []).find(c => c.token_id === pendingNft.token_id);

                // If no exact match, try a fallback to a similar NFT (same level and speed)
                if (!calcNft) {
                    calcNft = (calcData.nft_details || []).find(c =>
                        c.level === pendingNft.level &&
                        c.speed_kmh === pendingNft.speed_kmh_number
                    );
                }

                return {
                    id: pendingNft.token_id,
                    level: pendingNft.level,
                    status: pendingNft.status,
                    pending: pendingNft.potential_earnings,
                    hourlyRate: calcNft ? calcNft.theoretical_per_hour.earnings_per_hour : null,
                    hourlyFuel: calcNft ? calcNft.theoretical_per_hour.fuel_per_hour : null,
                };
            });

            // Recalculate total hourly earnings based on the merged, more accurate data
            const totalHourly = nfts
                .filter(nft => nft.status === 'running' && nft.hourlyRate !== null)
                .reduce((sum, nft) => sum + nft.hourlyRate, 0);

            return {
                user: {
                    zest_balance: calcData.user.zest_balance,
                    zestoline_balance: calcData.user.zestoline_balance
                },
                fleet: {
                    running_count: pendingData.fleet_summary.running_count,
                    total_nfts: pendingData.fleet_summary.total_nfts
                },
                summary: {
                    totalHourly: totalHourly,
                    pendingZest: pendingData.earnings_calculation.total_pending_earnings,
                    fuelRuntime: calcData.theoretical_performance.fuel_runtime_hours
                },
                nfts: nfts
            };
        }

        // Main rendering function, accepts standardized data
        function updateOverlay(data) {
            if (!data) return;
            lastKnownData = data;
            currentPage = 1; // Reset to first page on new data
            const { user, fleet, summary } = data;

            document.getElementById('status-indicator').classList.add('success');
            const totalDailyEarnings = summary.totalHourly * 24;
            const totalMonthlyEarnings = summary.totalHourly * 24 * 30;

            const content = document.getElementById('overlay-content');
            content.innerHTML = `
                <div class="summary-grid">
                    <div class="summary-item"><p>Total Hourly</p><p class="text-green">${summary.totalHourly.toFixed(2)}</p></div>
                    <div class="summary-item"><p>Total Daily</p><p class="text-green">${totalDailyEarnings.toFixed(2)}</p></div>
                    <div class="summary-item"><p>Total Monthly</p><p class="text-green">${totalMonthlyEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p></div>
                    <div class="summary-item"><p>Pending Zest</p><p class="text-purple">${summary.pendingZest.toFixed(2)}</p></div>
                    <div class="summary-item"><p>Zest Balance</p><p class="text-yellow">${user.zest_balance.toFixed(2)}</p></div>
                    <div class="summary-item"><p>Zestoline</p><p class="text-red">${user.zestoline_balance.toFixed(2)}</p></div>
                </div>
                <div class="fleet-header">
                    <h2 class="results-header">Your Fleet (${fleet.running_count}/${fleet.total_nfts})</h2>
                    <div class="toggle-switch">
                        <button id="hourly-btn" class="${timeFrame === 'hourly' ? 'active' : ''}">Hourly</button>
                        <button id="daily-btn" class="${timeFrame === 'daily' ? 'active' : ''}">24 Hours</button>
                        <button id="monthly-btn" class="${timeFrame === 'monthly' ? 'active' : ''}">30 Days</button>
                    </div>
                </div>
                <div id="nft-list"></div>
                <div id="pagination-controls"></div>
            `;
            updateNftList();
            document.getElementById('hourly-btn').addEventListener('click', () => { timeFrame = 'hourly'; updateNftList(); });
            document.getElementById('daily-btn').addEventListener('click', () => { timeFrame = 'daily'; updateNftList(); });
            document.getElementById('monthly-btn').addEventListener('click', () => { timeFrame = 'monthly'; updateNftList(); });
        }

        function updateNftList() {
            if (!lastKnownData) return;
            const { nfts } = lastKnownData;
            const nftList = document.getElementById('nft-list');
            const paginationControls = document.getElementById('pagination-controls');
            if (!nftList || !paginationControls) return;

            document.querySelectorAll('.toggle-switch button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${timeFrame}-btn`).classList.add('active');

            const totalPages = Math.ceil(nfts.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedNfts = nfts.slice(startIndex, endIndex);

            nftList.innerHTML = paginatedNfts.map(nft => {
                let earnings, fuel, earningsLabel;
                let earningsDisplay = '<span class="text-red">N/A</span>';
                let fuelDisplay = '<span class="text-red">N/A</span>';

                if (nft.hourlyRate !== null && nft.hourlyFuel !== null) {
                    if (timeFrame === 'hourly') {
                        earnings = nft.hourlyRate; fuel = nft.hourlyFuel; earningsLabel = 'Hourly';
                    } else if (timeFrame === 'daily') {
                        earnings = nft.hourlyRate * 24; fuel = nft.hourlyFuel * 24; earningsLabel = 'Daily';
                    } else { // monthly
                        earnings = nft.hourlyRate * 24 * 30; fuel = nft.hourlyFuel * 24 * 30; earningsLabel = '30d';
                    }
                    earningsDisplay = `<span class="text-green">${earnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ZEST</span>`;
                    fuelDisplay = `<span class="text-red">${fuel.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>`;
                } else {
                     if (timeFrame === 'hourly') earningsLabel = 'Hourly';
                     else if (timeFrame === 'daily') earningsLabel = 'Daily';
                     else earningsLabel = '30d';
                }

                const statusColor = nft.status === 'running' ? 'text-green' : 'text-yellow';
                return `
                    <div class="nft-card">
                        <div class="detail-item"><span><b>#${nft.id}</b> (Lvl ${nft.level})</span><span class="${statusColor}">${nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}</span></div>
                        <div class="divider"></div>
                        <div class="detail-item"><span>Pending:</span><span class="text-yellow">${nft.pending.toFixed(2)} ZEST</span></div>
                        <div class="detail-item"><span>${earningsLabel} Rate:</span>${earningsDisplay}</div>
                        <div class="detail-item"><span>${earningsLabel} Fuel:</span>${fuelDisplay}</div>
                    </div>`;
            }).join('');

            // Update pagination controls
            if (totalPages > 1) {
                paginationControls.innerHTML = `
                    <div class="pagination">
                        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
                        <span>Page ${currentPage} of ${totalPages}</span>
                        <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                    </div>
                `;
                document.getElementById('prev-page').addEventListener('click', () => {
                    if (currentPage > 1) { currentPage--; updateNftList(); }
                });
                document.getElementById('next-page').addEventListener('click', () => {
                    if (currentPage < totalPages) { currentPage++; updateNftList(); }
                });
            } else {
                paginationControls.innerHTML = '';
            }
        }

        document.getElementById('refresh-button').addEventListener('click', () => lastKnownData ? updateOverlay(lastKnownData) : null);
        document.getElementById('manual-fetch-button').addEventListener('click', manualFetch);

        function manualFetch() {
            const walletAddress = prompt("Please enter your wallet address (e.g., 0x...):");
            if (!walletAddress || !walletAddress.trim()) return;

            const content = document.getElementById('overlay-content');
            content.innerHTML = '<p>Fetching data from 2 APIs...</p>';

            const pendingPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: "https://taxi.orangez.io/api/debug-pending-earnings",
                    data: JSON.stringify({ walletAddress: walletAddress.trim() }),
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    onload: res => resolve(JSON.parse(res.responseText)),
                    onerror: err => reject(err)
                });
            });

            const calcPromise = new Promise((resolve, reject) => {
                 GM_xmlhttpRequest({
                    method: "POST", url: "https://taxi.orangez.io/api/debug-earnings-calculation",
                    data: JSON.stringify({ walletAddress: walletAddress.trim() }),
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    onload: res => resolve(JSON.parse(res.responseText)),
                    onerror: err => reject(err)
                });
            });

            Promise.all([pendingPromise, calcPromise]).then(([pendingJson, calcJson]) => {
                if (pendingJson.success && calcJson.success) {
                    const mergedData = mergeApiData(pendingJson.debug, calcJson.debug);
                    updateOverlay(mergedData);
                } else {
                    throw new Error('One or both API calls failed.');
                }
            }).catch(err => {
                console.error('[Taxi Overlay] Manual fetch failed:', err);
                content.innerHTML = `<p>Error: ${err.message}</p>`;
            });
        }

        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = document.getElementById("overlay-header");
            if (header) header.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                if (e.target.tagName === 'BUTTON') return;
                e.preventDefault();
                pos3 = e.clientX; pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
            function closeDragElement() {
                document.onmouseup = null; document.onmousemove = null;
            }
        }

        // --- DATA INTERCEPTION (INJECTED SCRIPT) ---
        const scriptToInject = `
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const [resource] = args;
                const promise = originalFetch.apply(this, args);
                const requestUrl = resource instanceof Request ? resource.url : resource;

                if (typeof requestUrl === 'string' && (requestUrl.includes('/api/debug-pending-earnings') || requestUrl.includes('/api/debug-earnings-calculation'))) {
                    promise.then(response => {
                        if (response.ok) {
                            response.clone().json().then(json => {
                                if (json.success && json.debug) {
                                    document.dispatchEvent(new CustomEvent('taxiDataIntercepted', {
                                        detail: {
                                            source: requestUrl,
                                            data: json.debug
                                        }
                                    }));
                                }
                            });
                        }
                    });
                }
                return promise;
            };
        `;
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptToInject;
        (document.head || document.documentElement).appendChild(scriptElement);
        scriptElement.remove();

        document.addEventListener('taxiDataIntercepted', function(e) {
            console.log(`[Taxi Overlay] Data captured from ${e.detail.source}`);
            // This script now relies on manual fetch for complete data, but we can still listen.
            // For now, we only care about the auto-fetch from the calculation endpoint
            if (e.detail.source.includes('/api/debug-earnings-calculation')) {
                 // To get full data, a subsequent call would be needed, so we just indicate success
                 // and let the user do a manual fetch for the complete picture.
                 document.getElementById('status-indicator').classList.add('success');
            }
        });
    }

    if (document.body) {
        onBodyReady();
    } else {
        new MutationObserver((mutations, observer) => {
            if (document.body) {
                onBodyReady();
                observer.disconnect();
            }
        }).observe(document.documentElement, { childList: true });
    }
})();
