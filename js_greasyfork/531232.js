// ==UserScript==
// @name         PubMed Bulk PDF Downloader by Angger Wicaksana
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  Hapus duplikat, cari link PDF PubMed, lalu Lihat Daftar/Unduh Terpilih/Unduh Semua PDF (Individual).
// @author       Angger Wicaksana
// @match        https://angger.akukatiga.com/p/pubmed-downloader.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nih.gov
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @connect      pubmed.ncbi.nlm.nih.gov
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531232/PubMed%20Bulk%20PDF%20Downloader%20by%20Angger%20Wicaksana.user.js
// @updateURL https://update.greasyfork.org/scripts/531232/PubMed%20Bulk%20PDF%20Downloader%20by%20Angger%20Wicaksana.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_VERSION = "1.9.0"; // Versi diperbarui
    console.log(`%c PubMed PDF Link Finder - Adv Download (v${SCRIPT_VERSION}) Loaded `, 'background: #0062a1; color: white; font-weight: bold; padding: 2px 5px; border-radius: 3px;');

    // --- Konstanta & Konfigurasi ---
    const MAX_RETRIES_FETCH = 1;
    const DELAY_BETWEEN_ARTICLES = 2500;
    const DELAY_BEFORE_PUBLISHER = 800;
    const DELAY_BETWEEN_DOWNLOADS = 1500; // Jeda antar unduhan individual
    const FETCH_TIMEOUT = 45000;
    const MAX_FILENAME_LENGTH = 120;
    // Konstanta ZIP dihapus

    // --- Referensi Elemen DOM ---
    let urlListInput, startBtn, startLoader, stopBtn, clearBtn,
        actionButtonsContainer, listLinksBtn, downloadSelectedBtn, downloadAllBtn, // downloadZipBtn -> downloadAllBtn
        countFoundDisplaySpans, countSelectedSpan,
        statusArea, statusMessageEl, progressSummaryEl,
        countProcessedEl, countTotalEl, countFoundEl, countFailedEl,
        resultsContainer, resultsTbody, noResultsEl, scriptVersionEl,
        listLinksModal, modalCloseBtn, modalLinkListArea, modalCopyBtn,
        selectAllCheckbox;

    // --- State Lokal ---
    let state = {
        isBusy: false, // Untuk proses pencarian link
        isDownloading: false, // Untuk proses unduh (selected/all)
        stopRequested: false,
        articles: [],
        progress: {
            total: 0, processed: 0, pdfLinkFound: 0, failedOrNotFound: 0,
            downloadAttempted: 0, downloaded: 0, downloadFailed: 0 // Hanya perlu progress download ini
        },
        selectedCount: 0
    };

    // --- Fungsi Utilitas & UI ---
    // setBusy, updateStatusMessage, updateProgressSummary: tidak berubah dari v1.8.2
    function setBusy(busy = true, downloading = false) {
        state.isBusy = busy && !downloading;
        state.isDownloading = downloading;
        const anyProcessRunning = state.isBusy || state.isDownloading;

        if (startBtn) startBtn.disabled = anyProcessRunning;
        if (urlListInput) urlListInput.disabled = anyProcessRunning;
        if (clearBtn) clearBtn.disabled = anyProcessRunning;
        if (stopBtn) {
            stopBtn.classList.toggle('hidden', !anyProcessRunning);
            stopBtn.disabled = state.stopRequested && anyProcessRunning;
        }
        showLoader(startLoader, state.isBusy); // Hanya loader tombol start
        updateActionButtonsState();
    }

    function showLoader(loaderElement, show = true) {
        loaderElement?.classList.toggle('hidden', !show);
    }


    function updateStatusMessage(message, type = 'info', showProgressIndicator = false) {
        if (!statusMessageEl || !document.body.contains(statusMessageEl)) return;
        statusMessageEl.className = `pbd-status-message pbd-status-message-${type}`;
        statusMessageEl.innerHTML = '';
        if (showProgressIndicator && (state.isBusy || state.isDownloading)) {
            const loader = document.createElement('span');
            loader.className = 'pbd-loader';
            statusMessageEl.appendChild(loader);
        }
        statusMessageEl.appendChild(document.createTextNode(" " + message));
        statusMessageEl.classList.remove('hidden');
    }

    function updateProgressSummary() {
        if (!progressSummaryEl) return;
        if (countProcessedEl) countProcessedEl.textContent = state.progress.processed;
        if (countTotalEl) countTotalEl.textContent = state.progress.total;
        if (countFoundEl) countFoundEl.textContent = state.progress.pdfLinkFound;
        if (countFailedEl) countFailedEl.textContent = state.progress.failedOrNotFound;
        progressSummaryEl.classList.toggle('hidden', state.progress.total === 0);

        if (countFoundDisplaySpans) {
             countFoundDisplaySpans.forEach(span => span.textContent = state.progress.pdfLinkFound);
        }
        if (countSelectedSpan) {
             countSelectedSpan.textContent = state.selectedCount;
        }
        updateActionButtonsState();
    }

    // Memperbarui status tombol, termasuk tombol "Unduh Semua" yang baru
    function updateActionButtonsState() {
        const foundLinks = state.progress.pdfLinkFound > 0;
        const canPerformAction = !state.isBusy && !state.isDownloading;

        if (actionButtonsContainer) actionButtonsContainer.classList.toggle('hidden', state.progress.total === 0 && !foundLinks);

        if (listLinksBtn) listLinksBtn.disabled = !canPerformAction || !foundLinks;
        if (downloadSelectedBtn) downloadSelectedBtn.disabled = !canPerformAction || !foundLinks || state.selectedCount === 0;
        // Tombol Unduh Semua (Pengganti ZIP)
        if (downloadAllBtn) {
             downloadAllBtn.disabled = !canPerformAction || !foundLinks;
             if (!canPerformAction) {
                  downloadAllBtn.title = "Harap tunggu proses lain selesai.";
             } else if (!foundLinks) {
                  downloadAllBtn.title = "Tidak ada link PDF untuk diunduh.";
             } else {
                  downloadAllBtn.title = "Unduh semua link PDF yang ditemukan (satu per satu)";
             }
        }
        // Checkbox Pilih Semua
        if(selectAllCheckbox) {
             const allRows = state.articles.length;
             const checkableRows = state.articles.filter(a => a.checkboxElement && !a.checkboxElement.disabled).length;
             const allChecked = checkableRows > 0 && state.selectedCount === checkableRows;
             const someChecked = state.selectedCount > 0 && state.selectedCount < checkableRows;
             selectAllCheckbox.checked = allChecked;
             selectAllCheckbox.indeterminate = someChecked;
             selectAllCheckbox.disabled = !canPerformAction || allRows === 0 || checkableRows === 0;
        }
    }

    // resetStateAndUI: tidak berubah dari v1.8.2
    function resetStateAndUI() {
        console.log("Resetting UI and State...");
        state.isBusy = false; state.isDownloading = false; state.stopRequested = false;
        state.articles = [];
        // Hanya perlu progress download biasa
        state.progress = { total: 0, processed: 0, pdfLinkFound: 0, failedOrNotFound: 0, downloadAttempted: 0, downloaded: 0, downloadFailed: 0 };
        state.selectedCount = 0;

        if (urlListInput) urlListInput.value = GM_getValue('lastUrlList', '');
        if (resultsTbody) resultsTbody.innerHTML = '';
        if (statusMessageEl) statusMessageEl.classList.add('hidden');
        if (progressSummaryEl) progressSummaryEl.classList.add('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');
        if (actionButtonsContainer) actionButtonsContainer.classList.add('hidden');
        if (noResultsEl) { noResultsEl.classList.remove('hidden'); noResultsEl.textContent = "Siap memproses..."; }
        if (listLinksModal) listLinksModal.style.display = 'none';
        if (selectAllCheckbox) { selectAllCheckbox.checked = false; selectAllCheckbox.indeterminate = false; }

        setBusy(false, false);
        updateProgressSummary();
        console.log("Reset complete.");
    }

    async function delay(ms) { if (ms > 0) { await new Promise(resolve => setTimeout(resolve, ms)); } }

    function sanitizeFilename(name) {
         // tidak berubah dari v1.8.2
         if (!name) return "Unnamed_Article";
         let sanitized = name.replace(/<[^>]*>?/gm, '').replace(/[<>:"/\\|?*]+/g, '_').replace(/\s+/g, ' ').replace(/\.+/g, '.').replace(/[^\w\s.,()_-]/g, '').trim().substring(0, MAX_FILENAME_LENGTH);
         sanitized = sanitized.replace(/[.\s_-]+$/, '');
         return sanitized || "Downloaded_Article";
    }

    // --- Fungsi Fetch (Disederhanakan, tidak perlu handle blob lagi) ---
    function fetchPage(url, pmidForLog = 'N/A', retries = MAX_RETRIES_FETCH) {
        // Hanya perlu fetch document (text/html)
        const responseType = 'document'; // Selalu document
        return new Promise((resolve, reject) => {
            if (state.stopRequested) { reject(new Error("STOP_REQUESTED")); return; }

            console.log(`[${pmidForLog}] Fetching (${responseType}, ${retries} retries left): ${url.substring(0, 150)}...`);

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: 'text', // Selalu minta text
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
                    "Sec-Fetch-Dest": 'document',
                    "Sec-Fetch-Mode": 'navigate',
                    "Sec-Fetch-Site": "cross-site",
                    "Upgrade-Insecure-Requests": "1",
                    // Tidak perlu Referer khusus di sini
                },
                timeout: FETCH_TIMEOUT,
                onload: (response) => {
                    if (state.stopRequested) { reject(new Error("STOP_REQUESTED")); return; }

                    if (response.status >= 200 && response.status < 400) {
                        try {
                            const responseText = response.responseText;
                            if (!responseText) throw new Error("Empty response text");
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(responseText, "text/html");
                            if (!doc || doc.getElementsByTagName("parsererror").length > 0) throw new Error("DOM Parsing Error");
                            if (!doc.body) throw new Error("Missing document body");
                             // Pemeriksaan body tetap berguna
                            if (doc.body.innerHTML.trim().length < 150) {
                                 if (responseText.includes("PubMed query contained an error")) throw new Error("PubMed query error");
                                 if (doc.body.textContent.match(/article not found|cannot be displayed|error occurred|not available|no document/i)) {
                                     throw new Error("Article content unavailable");
                                 }
                                 console.warn(`[${pmidForLog}] Possible invalid/empty body content.`);
                                 throw new Error("Empty/Invalid Body");
                            }
                            if (doc.body.textContent.toLowerCase().includes('please enable javascript')) {
                                 console.warn(`[${pmidForLog}] Page may require JavaScript.`);
                            }
                            resolve({ doc: doc, finalUrl: response.finalUrl || url });
                        } catch (parseError) {
                            reject(new Error(`Parse/Body Check Failed: ${parseError.message}`));
                        }
                    } else { // HTTP Error (logic sama)
                         const errMsg = `HTTP Error ${response.status}`;
                         console.error(`[${pmidForLog}] ${errMsg} for ${url.substring(0,100)}... Final URL: ${response.finalUrl}`);
                         if (retries > 0 && (response.status >= 500 || [403, 408, 429].includes(response.status))) {
                             console.log(`[${pmidForLog}] Retrying after HTTP ${response.status} delay...`);
                             delay(3000 + Math.random() * 2000).then(() => fetchPage(url, pmidForLog, retries - 1).then(resolve).catch(reject));
                         } else {
                             let detail = '';
                             if (response.status === 404) detail = " (Not Found)";
                             else if (response.status === 403) detail = " (Forbidden/Access Denied)";
                             else if (response.status === 429) detail = " (Too Many Requests)";
                             reject(new Error(errMsg + detail));
                         }
                    }
                },
                onerror: (error) => { // Network Error (logic sama)
                    const errMsg = `Network Error: ${error.error || 'Unknown'}`;
                    console.error(`[${pmidForLog}] ${errMsg} for ${url.substring(0,100)}... Details:`, error);
                     if (retries > 0 && !state.stopRequested) {
                         console.log(`[${pmidForLog}] Retrying after network error delay...`);
                         delay(4000 + Math.random() * 1500).then(() => fetchPage(url, pmidForLog, retries - 1).then(resolve).catch(reject));
                     } else { reject(new Error(errMsg)); }
                },
                ontimeout: () => { // Timeout (logic sama)
                    const errMsg = "Request Timeout";
                    console.error(`[${pmidForLog}] ${errMsg} for ${url.substring(0,100)}...`);
                     if (retries > 0 && !state.stopRequested) {
                         console.log(`[${pmidForLog}] Retrying after timeout delay...`);
                         delay(3500 + Math.random() * 1000).then(() => fetchPage(url, pmidForLog, retries - 1).then(resolve).catch(reject));
                     } else { reject(new Error(errMsg)); }
                }
            });
        });
    }


    // --- Fungsi Parsing --- (Tidak berubah dari v1.8.2)
    function extractPmid(u){if(!u)return null;try{const o=new URL(u);if(!o.hostname.includes('pubmed.ncbi.nlm.nih.gov'))return null;const m=o.pathname.match(/^\/(\d+)\/?/);return m?m[1]:null;}catch(e){return null;}}
    function extractTitle(d){let t=d.querySelector('h1.heading-title');if(!t?.textContent.trim()){const m=d.querySelector('meta[property="og:title"]');if(m?.content)return m.content.trim();let p=d.title.replace(/ - PubMed$/i,'').trim();if(p)return p;}return t?.textContent?.trim()||'Unknown Title';}
    function findPrioritizedExternalLink(d,p){const q=d.querySelectorAll('.full-text-links-list a[href]');let c=null;const b=[];q.forEach(l=>{try{const h=l.getAttribute('href');if(!h||h.startsWith('#')||h.startsWith('javascript:'))return;const a=new URL(h,d.baseURI||`https://pubmed.ncbi.nlm.nih.gov/${p}/`).href;const n=new URL(a).hostname.toLowerCase();if(n.includes('ncbi.nlm.nih.gov')&&a.includes('/pmc/articles/')){if(!c)c={url:a,type:'pmc',text:'PMC Article'};return;}if(!n.includes('ncbi.nlm.nih.gov')&&!n.includes('doi.org')){const t=(l.textContent||'').trim().toLowerCase();const i=l.querySelector('img')?.getAttribute('alt')?.toLowerCase()||'';let y='publisher';if(t.includes('free')||t.includes('full text')||i.includes('free')||i.includes('full text'))y='publisher-free';if(!b.some(x=>x.url===a))b.push({url:a,type:y,text:l.textContent.trim()||i||n});}}catch(e){console.warn(`[${p}] Error parsing external link ${l.href}: ${e.message}`)}});if(c)return c;if(b.length>0){b.sort((a,e)=>(a.type==='publisher-free'&&e.type!=='publisher-free')?-1:(e.type==='publisher-free'&&a.type!=='publisher-free')?1:0);return b[0];}const o=d.querySelector('a.id-link[data-ga-action="DOI"], a.id-link[href^="https://doi.org/"]');if(o?.href)return{url:o.href,type:'doi',text:'DOI Link'};return null;}
    function findPdfLinkOnPage(d,u,p){const b=u;let k=[];console.log(`[${p}] Searching PDF on page: ${u.substring(0,100)}...`);const s=['meta[name="citation_pdf_url"]','a[href$=".pdf" i]','a[href*=".pdf?" i]','a[type="application/pdf" i]','a[href*="/pdf/" i]','a[href*="/pdf?id=" i]','a[href*="/epdf" i]','a[href*="format=pdf" i]','a[href*="content=pdf" i]','a[download$=".pdf" i]','a[download]','a[data-download$=".pdf" i]','a[data-track-action="Download PDF"]','a[data-testid="download-full-text-pdf"]','a[id*="pdf" i][href]','a[class*="pdf" i][href]','a[aria-label*="download pdf" i]','a[aria-label*="get pdf" i]','a[aria-label*="full text pdf" i]','a[title*="download pdf" i]','a[title*="get pdf" i]','a[title*="full text pdf" i]','button[onclick*=".pdf" i]','#sidebar a[href*="pdf"]','.download-button-pdf a','.pdf-download-link a','a.pdf-link','.buttons__download a[href*="pdf"]','a.article-pdfLink','a.galley-link.pdf','a[data-article-pdf-link]'];const t=["download pdf","full text pdf","view pdf","get pdf","article pdf","download article"];const add=(l,x,y)=>{if(!l||typeof l!=='string'||l.startsWith('#')||l.startsWith('javascript:'))return;try{const a=new URL(l,b).href;const w=a.toLowerCase();const z=w.includes('.pdf')||w.includes('/pdf')||w.includes('format=pdf')||w.includes('download')||w.includes('epdf');if(!z){const c=(x||'').toLowerCase();if(!c.includes('pdf')&&!c.includes('download')){return;}}if(a===u){return;}if(!k.some(j=>j.url===a)){k.push({url:a,text:x||'Link',priority:y});}}catch(e){console.warn(`[${p}] Error parsing potential PDF link ${l}: ${e.message}`)}};try{const m=d.querySelector(s[0]);if(m?.content){add(m.content,'citation_pdf_url',1);}}catch(e){} s.slice(1).forEach((q,i)=>{try{d.querySelectorAll(q).forEach(e=>{let h=null,z=null,r=5+i;if(e.tagName==='META'){h=e.getAttribute('content');z='meta tag';r=1;}else{h=e.getAttribute('href')||e.getAttribute('data-href');z=e.textContent||e.title||e.getAttribute('aria-label');const o=e.getAttribute('onclick');if(!h&&o&&o.includes('.pdf')){const match=o.match(/['"](https?:\/\/[^'"]+\.pdf[^'"]*)['"]/i);if(match&&match[1])h=match[1];}if(!h&&e.tagName==='A'&&e.getAttribute('download')){h=e.href;}if(e.hasAttribute('download'))r=Math.min(r,2);if(h&&(h.toLowerCase().includes('.pdf')||h.toLowerCase().includes('/pdf')))r=Math.min(r,3);if(z&&z.toLowerCase().includes('pdf'))r=Math.min(r,4);}add(h,z,r);});}catch(e){}});t.forEach((x,i)=>{try{Array.from(d.querySelectorAll('a, button')).forEach(e=>{const z=(e.textContent||e.innerText||'').trim().toLowerCase();const c=(e.title||'').toLowerCase();const v=(e.getAttribute('aria-label')||'').toLowerCase();if(z.includes(x)||c.includes(x)||v.includes(x)){let h=e.getAttribute('href')||e.getAttribute('data-href');if(!h&&e.tagName==='A')h=e.href;add(h,e.textContent||e.title,20+i);}}); }catch(e){}}); if(k.length>0){k.sort((a,e)=>a.priority-e.priority);const n=k[0];const f=k.length>1?k[1]:null;if(n.priority>5&&(n.url.toLowerCase().endsWith('.html')||n.url.toLowerCase().endsWith('/'))&&f&&!f.url.toLowerCase().endsWith('.html')&&!f.url.toLowerCase().endsWith('/')&&(f.url.toLowerCase().includes('.pdf')||f.url.toLowerCase().includes('/pdf'))&&f.priority<n.priority+5){console.log(`[${p}] Prioritizing link 2 (${f.url.substring(0,60)}...) over link 1 (${n.url.substring(0,60)}...)`); return f.url;} return n.url;} console.log(`[${p}] No suitable PDF link found on page.`); return null;}


    // --- Fungsi UI Rendering ---
    // renderInitialResultsTable, getStatusClass, updateTableCellStatus, updateTableRow
    // Tidak berubah dari v1.8.2 (sudah termasuk perbaikan checkbox)
    function renderInitialResultsTable(articlesToRender) {
        if (!resultsTbody || !resultsContainer) return;
        resultsTbody.innerHTML = ''; let hasValidRows = false;
        articlesToRender.forEach((article, index) => {
            hasValidRows = true; const row = resultsTbody.insertRow(); article.rowElement = row;
            const cellSelect = row.insertCell(); cellSelect.className = 'pbd-col-select';
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'pbd-row-select'; checkbox.dataset.articleIndex = index;
            checkbox.disabled = (article.status === 'Invalid URL'); checkbox.title = "Pilih"; cellSelect.appendChild(checkbox);
            article.checkboxElement = checkbox; article.selected = false;
            const cellPmid = row.insertCell(); cellPmid.className = 'pbd-col-pmid';
            if (article.pmid) { const link = document.createElement('a'); link.href = `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`; link.textContent = article.pmid; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'pbd-pmid-link'; cellPmid.appendChild(link); } else { cellPmid.textContent = 'N/A'; }
            const cellTitle = row.insertCell(); cellTitle.className = 'pbd-col-title'; const titleSpan = document.createElement('span'); titleSpan.className = 'pbd-title-text'; titleSpan.textContent = article.title || article.inputUrl || '...'; titleSpan.title = article.title || article.inputUrl; cellTitle.appendChild(titleSpan);
            const cellStatus = row.insertCell(); cellStatus.className = 'pbd-col-status'; updateTableCellStatus(article, article.status);
        });
        resultsContainer.classList.toggle('hidden', !hasValidRows); noResultsEl.classList.toggle('hidden', hasValidRows);
        if (!hasValidRows && !state.isBusy) { noResultsEl.textContent = "Masukkan link..."; } updateProgressSummary();
    }
     function getStatusClass(statusText = '') {
         const lowerStatus = statusText.toLowerCase();
         if (lowerStatus === 'pending') return 'pbd-status-pending';
         if (lowerStatus.includes('processing') || lowerStatus.includes('mencari') || lowerStatus.includes('memeriksa')) return 'pbd-status-processing';
         if (lowerStatus.includes('link found') || lowerStatus.includes('link ditemukan') || lowerStatus.includes('terunduh') || lowerStatus.includes('ready in zip')) return 'pbd-status-link-found'; // ready in zip tidak dipakai lagi tapi ok
         if (lowerStatus.includes('downloading') || lowerStatus.includes('mengunduh') || lowerStatus.includes('fetching')) return 'pbd-status-processing';
         if (lowerStatus.includes('not found') || lowerStatus.includes('tidak ditemukan')) return 'pbd-status-not-found';
         if (lowerStatus.includes('failed') || lowerStatus.includes('error') || lowerStatus.includes('gagal') || lowerStatus.includes('dl failed') || lowerStatus.includes('zip fetch failed') || lowerStatus.includes('invalid')) return 'pbd-status-failed'; // invalid url dianggap failed
         if (lowerStatus.includes('skipped') || lowerStatus.includes('dilewati') || lowerStatus.includes('stopped')) return 'pbd-status-skipped';
         return 'pbd-status-processing';
     }
     function updateTableCellStatus(article, statusText, pdfUrl = null) {
        if (!article || !article.rowElement || !document.body.contains(article.rowElement)) return;
        const statusCell = article.rowElement.cells[3]; if (!statusCell) return;
        const currentPdfUrl = pdfUrl || article.pdfUrl; article.status = statusText;
        const statusClass = getStatusClass(statusText); statusCell.innerHTML = '';
        const statusSpan = document.createElement('span'); statusSpan.className = statusClass; statusSpan.textContent = statusText; statusCell.appendChild(statusSpan);
        const showPdfLink = currentPdfUrl && (statusClass === 'pbd-status-link-found');
        if (showPdfLink) {
            statusCell.appendChild(document.createTextNode(' ')); const pdfLink = document.createElement('a');
            pdfLink.href = currentPdfUrl; pdfLink.target = "_blank"; pdfLink.rel = "noopener noreferrer"; pdfLink.className = 'pbd-pdf-link';
            pdfLink.title = `Buka PDF: ${currentPdfUrl}`; pdfLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm192 32v64H96V256H288z"/></svg>`;
            statusCell.appendChild(pdfLink);
        }
        if (article.checkboxElement) {
            const shouldBeDisabled = (statusClass === 'pbd-status-failed' || statusClass === 'pbd-status-skipped');
            article.checkboxElement.disabled = shouldBeDisabled;
            if (shouldBeDisabled && article.selected) {
                 article.selected = false; article.checkboxElement.checked = false;
                 state.selectedCount = state.articles.filter(a => a.selected).length; updateProgressSummary();
            }
        }
     }
     function updateTableRow(article, statusText, newTitle = null) {
         if (!article || !article.rowElement || !document.body.contains(article.rowElement)) return;
         const pmidCell = article.rowElement.cells[1]; const titleCell = article.rowElement.cells[2];
         updateTableCellStatus(article, statusText, article.pdfUrl); // Update status & checkbox
         if (newTitle && titleCell && article.title !== newTitle) {
             article.title = newTitle; const titleSpan = titleCell.querySelector('.pbd-title-text');
             if (titleSpan) { titleSpan.textContent = newTitle; titleSpan.title = newTitle; } else { titleCell.innerHTML = `<span class="pbd-title-text" title="${newTitle}">${newTitle}</span>`; }
         }
         if (pmidCell && article.pmid && !pmidCell.querySelector('a')) {
             pmidCell.innerHTML = ''; const link = document.createElement('a'); link.href = `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`; link.textContent = article.pmid; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'pbd-pmid-link'; pmidCell.appendChild(link);
         }
     }


    // --- Logika Proses Utama ---
     // processArticle tidak berubah dari v1.8.2
     async function processArticle(article) {
         if (state.stopRequested) throw new Error("STOP_REQUESTED");
         if (!article.pmid) { updateTableRow(article, 'Invalid URL'); state.progress.failedOrNotFound++; state.progress.processed++; return; }
         const pmid = article.pmid; let finalPdfUrl = null; let errorStatus = null;
         try {
             updateTableRow(article, 'Mencari link di PubMed...'); const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
             const { doc: pubmedDoc } = await fetchPage(pubmedUrl, pmid); if (state.stopRequested) throw new Error("STOP_REQUESTED");
             const title = extractTitle(pubmedDoc); updateTableRow(article, 'Mencari link eksternal...', title);
             const prioritizedLink = findPrioritizedExternalLink(pubmedDoc, pmid);
             if (!prioritizedLink) { errorStatus = 'Tidak ada link eksternal'; } else {
                 updateTableRow(article, `Memeriksa link (${prioritizedLink.type})...`); console.log(`[${pmid}] Visiting ${prioritizedLink.type}: ${prioritizedLink.url.substring(0, 100)}...`); await delay(DELAY_BEFORE_PUBLISHER);
                 try {
                     const { doc: externalDoc, finalUrl: externalFinalUrl } = await fetchPage(prioritizedLink.url, pmid); if (state.stopRequested) throw new Error("STOP_REQUESTED");
                     updateTableRow(article, `Mencari PDF di ${prioritizedLink.type}...`); finalPdfUrl = findPdfLinkOnPage(externalDoc, externalFinalUrl, pmid);
                     if (finalPdfUrl) { article.pdfUrl = finalPdfUrl; updateTableRow(article, 'Link PDF Ditemukan'); state.progress.pdfLinkFound++; console.log(`%c[${pmid}] PDF Link Found: ${finalPdfUrl.substring(0, 100)}...`, 'color: green'); } else { errorStatus = `PDF tidak ditemukan di ${prioritizedLink.type}`; }
                 } catch (fetchOrParseError) {
                     if (fetchOrParseError.message === "STOP_REQUESTED") throw fetchOrParseError; let specificError = fetchOrParseError.message;
                      if (specificError.includes("403")) errorStatus = `Gagal Akses ${prioritizedLink.type} (403)`; else if (specificError.includes("404")) errorStatus = `Link ${prioritizedLink.type} Mati (404)`; else if (specificError.includes("Timeout")) errorStatus = `Timeout Akses ${prioritizedLink.type}`; else errorStatus = `Gagal Proses ${prioritizedLink.type}`;
                     console.warn(`[${pmid}] Gagal proses ${prioritizedLink.type}: ${fetchOrParseError.message}`);
                 }
             }
         } catch (error) {
             if (error.message === "STOP_REQUESTED") { errorStatus = 'Proses Dihentikan'; } else { if (error.message.includes("Timeout")) errorStatus = 'Timeout Akses PubMed'; else if (error.message.includes("Network Error")) errorStatus = 'Error Jaringan PubMed'; else errorStatus = `Error: ${error.message.substring(0, 40)}`; }
             console.error(`[${pmid}] Error processing article:`, error);
         } finally {
             if (errorStatus && !article.pdfUrl) { updateTableRow(article, errorStatus); state.progress.failedOrNotFound++; } else if (!errorStatus && !article.pdfUrl) { updateTableRow(article, 'PDF tidak ditemukan'); state.progress.failedOrNotFound++; }
             state.progress.processed++; updateProgressSummary();
         }
     }


    // --- Handler Start, Stop, Clear ---
    // handleStartClick sudah termasuk hapus duplikat, tidak berubah dari v1.8.2
    async function handleStartClick() {
        if (state.isBusy || state.isDownloading) return;
        const urlListValue = urlListInput.value.trim(); if (!urlListValue) { alert("Masukkan URL PubMed."); urlListInput.focus(); return; }
        GM_setValue('lastUrlList', urlListValue); const urls = urlListValue.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.includes('pubmed.ncbi.nlm.nih.gov'));
        if (urls.length === 0) { alert("URL PubMed tidak valid."); return; }
        resetStateAndUI(); setBusy(true, false);
        const initialArticles = urls.map(url => { const pmid = extractPmid(url); return { inputUrl: url, pmid: pmid, title: pmid ? `PMID: ${pmid}` : url, status: pmid ? 'Pending' : 'Invalid URL', pdfUrl: null, rowElement: null, checkboxElement: null, selected: false }; });
        const seenPmids = new Set(); const uniqueArticles = []; let duplicateCount = 0;
        for (const article of initialArticles) { if (!article.pmid || !seenPmids.has(article.pmid)) { uniqueArticles.push(article); if (article.pmid) { seenPmids.add(article.pmid); } } else { duplicateCount++; } }
        state.articles = uniqueArticles; state.progress.total = state.articles.length;
        renderInitialResultsTable(state.articles); updateProgressSummary();
        let startMessage = `Memulai pencarian link untuk ${state.progress.total} artikel...`;
        if (duplicateCount > 0) { startMessage += ` (${duplicateCount} duplikat dihapus).`; console.log(`Removed ${duplicateCount} duplicate PMID entries.`); }
        updateStatusMessage(startMessage, 'info', true);
        for (const article of state.articles) {
            if (state.stopRequested) { updateStatusMessage("Pencarian link dihentikan.", "warning"); break; }
            if (state.progress.processed % 5 === 0 || state.progress.processed === 0) { updateStatusMessage(`Memproses ${article.pmid || 'artikel'} (${state.progress.processed + 1}/${state.progress.total})...`, 'info', true); }
            await processArticle(article);
            if (!state.stopRequested && state.progress.processed < state.progress.total) { await delay(DELAY_BETWEEN_ARTICLES + Math.random() * 500); }
        }
        if (!state.stopRequested) { const finalMsg = `Pencarian Selesai. ${state.progress.pdfLinkFound} link PDF ditemukan. ${state.progress.failedOrNotFound} gagal/tidak ditemukan.`; updateStatusMessage(finalMsg, state.progress.pdfLinkFound > 0 ? 'success' : 'warning'); console.log("Link finding finished."); } else { console.log("Link finding stopped."); }
        setBusy(false, false); if (stopBtn) stopBtn.disabled = false;
    }
    // handleStopClick tidak berubah dari v1.8.2
    function handleStopClick() { if (state.isBusy || state.isDownloading) { console.log("%c Stop requested.", 'background:orange; color:black;'); state.stopRequested = true; updateStatusMessage("Menghentikan proses...", "warning", false); if (stopBtn) stopBtn.disabled = true; } }
    // handleClearClick tidak berubah dari v1.8.2
    function handleClearClick() { if (state.isBusy || state.isDownloading) { alert("Hentikan proses dulu."); return; } if (confirm("Yakin bersihkan?")) { urlListInput.value = ''; GM_setValue('lastUrlList', ''); resetStateAndUI(); updateStatusMessage("Semua link telah dibersihkan.", "info"); setTimeout(() => statusMessageEl?.classList.add('hidden'), 2500); } }


    // --- Handlers Checkbox ---
    // handleSelectAllClick tidak berubah dari v1.8.2
    function handleSelectAllClick(event) {
        const isChecked = event.target.checked; state.selectedCount = 0;
        state.articles.forEach(article => { if (article.checkboxElement && !article.checkboxElement.disabled) { article.checkboxElement.checked = isChecked; article.selected = isChecked; if (isChecked) { state.selectedCount++; } } });
        updateProgressSummary();
    }
    // handleRowCheckboxClick tidak berubah dari v1.8.2
    function handleRowCheckboxClick(event) {
        if (!event.target.classList.contains('pbd-row-select')) return; const checkbox = event.target; if (checkbox.disabled) return;
        const index = parseInt(checkbox.dataset.articleIndex, 10); if (isNaN(index) || !state.articles[index]) return;
        const article = state.articles[index]; article.selected = checkbox.checked; state.selectedCount = state.articles.filter(a => a.selected).length;
        updateProgressSummary();
    }


    // --- Handlers Tombol Aksi ---
    // handleListLinksClick, closeModal, handleModalCopyClick tidak berubah
    function handleListLinksClick() { if (state.isBusy || state.isDownloading || state.progress.pdfLinkFound === 0 || !listLinksModal || !modalLinkListArea) return; const links = state.articles.filter(a => a.pdfUrl).map(a => a.pdfUrl); modalLinkListArea.value = links.join('\n'); const modalTitle = listLinksModal.querySelector('h2'); if (modalTitle) { const countSpan = modalTitle.querySelector('.pbd-count-found-display'); if (countSpan) countSpan.textContent = links.length; } listLinksModal.style.display = 'block'; }
    function closeModal() { if (listLinksModal) listLinksModal.style.display = 'none'; }
    function handleModalCopyClick() { if (modalLinkListArea) { try { modalLinkListArea.select(); navigator.clipboard.writeText(modalLinkListArea.value).then(() => { updateStatusMessage('Link dari daftar disalin!', 'success', false); setTimeout(() => { closeModal(); statusMessageEl?.classList.add('hidden'); }, 1500); }).catch(err => { console.error('Modal copy failed:', err); alert('Gagal menyalin.'); }); } catch (err) { console.error('Modal copy selection failed:', err); alert('Gagal memilih teks.'); } } }

    // triggerIndividualDownload tidak berubah
    async function triggerIndividualDownload(article, sourceAction = 'selected') {
        if (!article || !article.pdfUrl || state.stopRequested) return false;
        const pmid = article.pmid; const url = article.pdfUrl;
        const filename = `${sanitizeFilename(article.title || `PMID_${pmid}`)}.pdf`;
        // Status prefix tidak lagi relevan karena tidak ada fetch ZIP
        updateTableRow(article, 'Mengunduh...');
        console.log(`[${pmid}] Triggering Individual DL: ${url.substring(0, 80)}...`);
        state.progress.downloadAttempted++;
        return new Promise(resolve => {
            GM_download({
                url: url, name: filename, saveAs: false,
                onerror: (error) => { console.error(`[${pmid}] DL error:`, error); const msg = error?.error ? `DL Failed: ${error.error}` : `DL Failed: Unknown`; updateTableRow(article, msg); state.progress.downloadFailed++; resolve(false); },
                ontimeout: () => { console.error(`[${pmid}] DL timeout.`); updateTableRow(article, `DL Failed: Timeout`); state.progress.downloadFailed++; resolve(false); },
                onload: () => { console.log(`%c [${pmid}] DL success triggered.`, 'color: green;'); updateTableRow(article, 'Terunduh (via Browser)'); state.progress.downloaded++; resolve(true); }
            });
        });
    }

    // handleDownloadSelectedClick tidak berubah
    async function handleDownloadSelectedClick() {
         if (state.isBusy || state.isDownloading || state.selectedCount === 0) { alert("Tidak ada artikel terpilih / proses lain berjalan."); return; }
         const articlesToDownload = state.articles.filter(a => a.selected && a.pdfUrl);
         const count = articlesToDownload.length;
         if (count === 0) { alert("Tidak ada artikel terpilih dg link PDF valid."); return; }
         if (!confirm(`Mencoba mengunduh ${count} PDF terpilih?`)) return;
         setBusy(false, true); state.stopRequested = false;
         state.progress.downloadAttempted = 0; state.progress.downloaded = 0; state.progress.downloadFailed = 0;
         updateStatusMessage(`Memulai ${count} unduhan terpilih...`, 'info', true);
         for (let i = 0; i < count; i++) {
             if (state.stopRequested) { updateStatusMessage("Unduhan terpilih dihentikan.", "warning"); break; }
             const article = articlesToDownload[i];
             updateStatusMessage(`Mengunduh ${i + 1}/${count}: ${article.pmid}...`, 'info', true);
             await triggerIndividualDownload(article, 'selected');
             if (!state.stopRequested && i < count - 1) { await delay(DELAY_BETWEEN_DOWNLOADS); }
         }
         if (!state.stopRequested) { const finalMsg = `Selesai unduh terpilih. Berhasil: ${state.progress.downloaded}, Gagal: ${state.progress.downloadFailed}.`; updateStatusMessage(finalMsg, state.progress.downloadFailed === 0 ? 'success' : 'warning'); console.log("Selected download finished."); } else { console.log("Selected download stopped."); }
         setBusy(false, false); if (stopBtn) stopBtn.disabled = false;
    }

    // --- Handler Baru: Unduh Semua PDF (Individual) ---
    async function handleDownloadAllClick() {
        if (state.isBusy || state.isDownloading) { alert("Proses lain sedang berjalan."); return; }

        // Ambil SEMUA artikel yang punya pdfUrl
        const articlesToDownload = state.articles.filter(a => a.pdfUrl);
        const count = articlesToDownload.length;

        if (count === 0) { alert("Tidak ada link PDF yang ditemukan untuk diunduh."); return; }

        // Konfirmasi ke user
        if (!confirm(`Akan mencoba mengunduh ${count} PDF yang ditemukan secara individual (satu per satu). Ini mungkin akan membuka banyak dialog simpan file, tergantung pengaturan browser Anda. Lanjutkan?`)) return;

        // Mulai proses download
        setBusy(false, true); // Set state downloading
        state.stopRequested = false; // Reset flag stop
        state.progress.downloadAttempted = 0;
        state.progress.downloaded = 0;
        state.progress.downloadFailed = 0;
        updateStatusMessage(`Memulai ${count} unduhan (semua)...`, 'info', true);

        // Loop unduhan
        for (let i = 0; i < count; i++) {
            if (state.stopRequested) {
                updateStatusMessage("Unduhan (semua) dihentikan.", "warning");
                break;
            }
            const article = articlesToDownload[i];
            updateStatusMessage(`Mengunduh ${i + 1}/${count}: ${article.pmid}...`, 'info', true);
            await triggerIndividualDownload(article, 'all'); // Panggil fungsi unduh individual

            // Beri jeda antar unduhan jika belum dihentikan
            if (!state.stopRequested && i < count - 1) {
                await delay(DELAY_BETWEEN_DOWNLOADS);
            }
        }

        // Update status final
        if (!state.stopRequested) {
             const finalMsg = `Selesai mengunduh semua. Berhasil: ${state.progress.downloaded}, Gagal: ${state.progress.downloadFailed}.`;
             updateStatusMessage(finalMsg, state.progress.downloadFailed === 0 ? 'success' : 'warning');
             console.log("Bulk download all process finished.");
        } else {
             console.log("Bulk download all process stopped by user.");
        }

        setBusy(false, false); // Selesai download
        if (stopBtn) stopBtn.disabled = false; // Aktifkan lagi tombol stop
    }


    // --- Inisialisasi ---
    function initialize() {
        console.log("Initializing PBD Controller v" + SCRIPT_VERSION);

        // Get Element References (termasuk downloadAllBtn)
        urlListInput = document.getElementById('pbd-url-list');
        startBtn = document.getElementById('pbd-start-btn');
        startLoader = document.getElementById('pbd-start-loader');
        stopBtn = document.getElementById('pbd-stop-btn');
        clearBtn = document.getElementById('pbd-clear-btn');
        actionButtonsContainer = document.getElementById('pbd-action-buttons');
        listLinksBtn = document.getElementById('pbd-list-links-btn');
        downloadSelectedBtn = document.getElementById('pbd-download-selected-btn');
        downloadAllBtn = document.getElementById('pbd-download-all-btn'); // Referensi baru
        // Loader spesifik dihapus
        countFoundDisplaySpans = document.querySelectorAll('.pbd-count-found-display');
        countSelectedSpan = document.getElementById('pbd-count-selected');
        statusArea = document.getElementById('pbd-status-area');
        statusMessageEl = document.getElementById('pbd-status-message');
        progressSummaryEl = document.getElementById('pbd-progress-summary');
        countProcessedEl = document.getElementById('pbd-count-processed');
        countTotalEl = document.getElementById('pbd-count-total');
        countFoundEl = document.getElementById('pbd-count-found');
        countFailedEl = document.getElementById('pbd-count-failed');
        resultsContainer = document.getElementById('pbd-results-container');
        resultsTbody = document.getElementById('pbd-results-tbody');
        noResultsEl = document.getElementById('pbd-no-results');
        scriptVersionEl = document.getElementById('pbd-script-version');
        listLinksModal = document.getElementById('pbd-list-links-modal');
        modalCloseBtn = document.getElementById('pbd-modal-close-btn');
        modalLinkListArea = document.getElementById('pbd-modal-link-list');
        modalCopyBtn = document.getElementById('pbd-modal-copy-btn');
        selectAllCheckbox = document.getElementById('pbd-select-all-chk');

        // Validasi Elemen Penting (termasuk downloadAllBtn)
        const essentialElements = [ urlListInput, startBtn, stopBtn, clearBtn, actionButtonsContainer, listLinksBtn, downloadSelectedBtn, downloadAllBtn, countSelectedSpan, statusArea, statusMessageEl, progressSummaryEl, countProcessedEl, countTotalEl, countFoundEl, countFailedEl, resultsContainer, resultsTbody, noResultsEl, scriptVersionEl, listLinksModal, modalCloseBtn, modalLinkListArea, modalCopyBtn, selectAllCheckbox ];
        if (essentialElements.some(el => !el)) {
            const missingIds = essentialElements.map((el, i) => el ? null : ["urlListInput", "startBtn", "stopBtn", "clearBtn", "actionButtonsContainer", "listLinksBtn", "downloadSelectedBtn", "downloadAllBtn", "countSelectedSpan", "statusArea", "statusMessageEl", "progressSummaryEl", "countProcessedEl", "countTotalEl", "countFoundEl", "countFailedEl", "resultsContainer", "resultsTbody", "noResultsEl", "scriptVersionEl", "listLinksModal", "modalCloseBtn", "modalLinkListArea", "modalCopyBtn", "selectAllCheckbox"][i]).filter(Boolean);
            console.error("PBD FATAL ERROR: Missing essential UI elements. Check HTML structure and IDs for:", missingIds.join(', '));
            if(statusArea) statusArea.innerHTML = `<div class="pbd-status-message pbd-status-message-error">Error Fatal: Elemen UI penting tidak ditemukan (ID: ${missingIds.join(', ')}). Periksa HTML Anda.</div>`;
            return;
        }
        // Tidak perlu cek JSZip lagi

        if(scriptVersionEl) scriptVersionEl.textContent = `Script v${SCRIPT_VERSION}`;

        // Add Event Listeners (termasuk downloadAllBtn)
        startBtn.addEventListener('click', handleStartClick);
        stopBtn.addEventListener('click', handleStopClick);
        clearBtn.addEventListener('click', handleClearClick);
        listLinksBtn.addEventListener('click', handleListLinksClick);
        downloadSelectedBtn.addEventListener('click', handleDownloadSelectedClick);
        downloadAllBtn.addEventListener('click', handleDownloadAllClick); // Listener baru
        modalCloseBtn.addEventListener('click', closeModal);
        modalCopyBtn.addEventListener('click', handleModalCopyClick);
        listLinksModal.addEventListener('click', (e) => { if (e.target === listLinksModal) closeModal(); });
        selectAllCheckbox.addEventListener('click', handleSelectAllClick);
        resultsTbody.addEventListener('click', handleRowCheckboxClick);

        // Initial UI State Reset
        resetStateAndUI();
        console.log("PBD Controller Initialized and Ready.");
     }

    // --- Jalankan Inisialisasi ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();