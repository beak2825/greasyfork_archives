// ==UserScript==
// @name         Mydealz Kategorieanalyse
// @description  Analysiert die Kategorien der Deals eines Users für das Verrückter Wissenschaftler Badge
// @namespace    Tampermonkey Scripts
// @match        https://www.mydealz.de/profile/*/deals*
// @grant        GM_xmlhttpRequest
// @author       MD928835
// @license      MIT
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/538850/Mydealz%20Kategorieanalyse.user.js
// @updateURL https://update.greasyfork.org/scripts/538850/Mydealz%20Kategorieanalyse.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let kategorien = [];
    let gefundeneKategorien = new Set();
    let kategorieZaehler = new Map();
    let analyseLaeuft = false;
    let gesamtDeals = 0;
    let logData = []; // Log-Daten sammeln
    let username = ''; // Username für Dateiname

    // GraphQL Query für Thread-Daten
    const THREAD_QUERY = `query getThread($filter: IDFilter!) {
        thread(threadId: $filter) {
            title
            mainGroup {
                threadGroupId
                threadGroupName
            }
        }
    }`;

    // Popup Template mit Overlay (10% breiter: 660px statt 600px)
    const popupTemplate = `
    <div class="modal-backdrop" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 9998;"></div>

    <section role="dialog" class="popover popover--default zIndex--modal popover--layout-modal popover--visible"
             style="
             position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
             width: 660px; z-index: 9999;">
      <div class="popover-content flex--inline popover-content--expand">
        <div class="flex flex--dir-col height--min-100 width--all-12">
          <header class="popover-space flex boxAlign-ai--all-fs color--text-TranslucentPrimary">
            <strong class="size--all-l text--b">Wie verrückt bist Du?</strong>
            <button type="button" class="space--ml-a button button--shape-circle button--type-tertiary button--mode-default button--size-s button--square" id="closeBtn">
              <span class="flex--inline boxAlign-ai--all-c">
                <svg width="16" height="16" class="icon icon--cross">
                  <use xlink:href="/assets/img/ico_707ed.svg#cross"></use>
                </svg>
              </span>
            </button>
          </header>

          <div class="popover-body overflow--scrollY overscroll--containY color--text-TranslucentPrimary popover-space">
            <div id="progressContainer" style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Kategorien-Abdeckung:</span>
                <span id="progressText">0%</span>
              </div>
              <div style="width: 100%; height: 8px; background-color: #e9eaed; border-radius: 4px; overflow: hidden;">
                <div id="progressBar" style="height: 100%; background-color: #ff6900; width: 0%; transition: width 0.3s ease;"></div>
              </div>
            </div>
            <form id="categoryForm">
              <!-- Kategorien werden dynamisch eingefügt -->
            </form>
          </div>

          <footer class="popover-space flex boxAlign-jc--all-fe">
            <span id="progressInfo" style="margin-right: auto; align-self: center; color: #666;"></span>
            <button type="button" class="button button--type-primary button--mode-brand" id="downloadBtn" style="display: none;">
              Dealliste herunterladen
            </button>
          </footer>
        </div>
      </div>
    </section>`;

    // Initiales HTML fetchen
    function fetchInitialHtml(url = window.location.href) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            resolve(doc);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`HTTP Status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Seitenzahl aus Button-Text ermitteln
    function pageNum(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const m = el.textContent.match(/\d+/);
        return m ? parseInt(m[0], 10) : null;
    }

    // Username aus URL extrahieren
    function getUsernameFromUrl() {
        const match = window.location.pathname.match(/\/profile\/([^\/]+)/);
        return match ? match[1] : 'unknown_user';
    }

    // GraphQL-Anfrage für Thread-Daten
    async function fetchThreadData(threadId) {
        try {
            const response = await fetch('https://www.mydealz.de/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: THREAD_QUERY,
                    variables: { filter: { eq: threadId } }
                })
            });

            const result = await response.json();
            return result.data?.thread || null;
        } catch (error) {
            console.error(`Fehler beim Abrufen der Thread-Daten für ${threadId}:`, error);
            return null;
        }
    }

    // Log-Eintrag hinzufügen (nur sammeln, nicht herunterladen)
    function addLogEntry(entry) {
        logData.push(entry);
        console.log(entry); // Für Live-Debug in Console
    }

    // Finale Datei herunterladen
    function downloadDebugFile() {
        const logContent = logData.join('\n');
        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `deals_von_${username}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`Dealliste heruntergeladen: deals_von_${username}.txt`);
    }

    async function fetchKategorien() {
        const query = `
            query siteNavigationMenu {
                groups: groups(default: {is: true}) {
                    threadGroupId
                    threadGroupName
                    threadGroupUrlName
                }
            }`;

        try {
            const response = await fetch('https://www.mydealz.de/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            return data.data.groups.map(group => ({
                id: group.threadGroupId,
                name: group.threadGroupName,
                url: group.threadGroupUrlName
            }));
        } catch (error) {
            console.error('Fehler beim Laden der Kategorien:', error);
            return [];
        }
    }

    // Button auf der Dealübersichtsseite hinzufügen
    function addAnalyzeButton() {
        // Prüfe ob wir auf einer User-Deals-Seite sind
        if (!window.location.pathname.match(/\/profile\/[^\/]+\/deals/)) {
            return;
        }

        // Prüfe ob Button bereits existiert
        if (document.querySelector('#kategorieanalyse-btn')) {
            return;
        }

        // Finde einen geeigneten Container (z.B. oberhalb der Deal-Liste)
        const container = document.querySelector('.userProfile-deals') ||
                         document.querySelector('.thread-list') ||
                         document.querySelector('main');

        if (!container) return;

        // Erstelle Button
        const analyzeButton = document.createElement('button');
        analyzeButton.id = 'kategorieanalyse-btn';
        analyzeButton.className = 'button button--type-primary button--mode-brand';
        analyzeButton.style.cssText = `
            margin: 20px 0;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
        `;
        analyzeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
              <polyline points="9,11 12,14 15,11"/>
              <path d="M12 14V3"/>
            </svg>
            Kategorieanalyse starten
        `;

        // Event Listener
        analyzeButton.addEventListener('click', (e) => {
            e.preventDefault();
            showAnalyzeDialog();
        });

        // Button einfügen (am Anfang des Containers)
        container.insertBefore(analyzeButton, container.firstChild);
    }

    function renderCategories(categories) {
        // KORRIGIERTE Filterung: Pseudo-Kategorien (ID ≥ 800000) ausschließen
        const normalCats = categories
            .filter(cat => cat.name !== 'Freebies' &&
                          categories.indexOf(cat) < categories.findIndex(c => c.name === 'Freebies') &&
                          parseInt(cat.id) < 800000)  // Pseudo-Kategorien ausschließen
            .sort((a, b) => a.name.localeCompare(b.name));

        const half = Math.ceil(normalCats.length / 2);
        const leftColumn = normalCats.slice(0, half);
        const rightColumn = normalCats.slice(half);

        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 10px;">
                <div>${leftColumn.map(cat => renderItem(cat)).join('')}</div>
                <div>${rightColumn.map(cat => renderItem(cat)).join('')}</div>
            </div>
        `;
    }

    function renderItem(cat) {
        const isFound = gefundeneKategorien.has(parseInt(cat.id));
        const dealCount = kategorieZaehler.get(parseInt(cat.id)) || 0;
        const percentage = gesamtDeals > 0 ? Math.round((dealCount / gesamtDeals) * 100) : 0;

        const textStyle = isFound ? 'text-decoration: line-through; color: #999;' : '';
        const countText = isFound ? ` (${dealCount} | ${percentage}%)` : '';

        return `
            <div class="category-item" style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; ${textStyle}">
                    <input type="checkbox"
                           style="margin-right: 8px; width: 16px; height: 16px;"
                           name="category"
                           value="${cat.id}"
                           data-name="${cat.name}"
                           data-url="${cat.url}"
                           ${isFound ? 'checked' : ''}
                           disabled>
                    <span>${cat.name}${countText}</span>
                </label>
            </div>`;
    }

    function updateProgress() {
        const checkedCheckboxes = document.querySelectorAll('input[name="category"]:checked').length;
        const availableCheckboxes = document.querySelectorAll('input[name="category"]').length;
        const percentage = availableCheckboxes > 0 ? Math.round((checkedCheckboxes / availableCheckboxes) * 100) : 0;

        // Debug-Ausgabe für Kontrolle
        console.log(`Progress Debug: ${checkedCheckboxes}/${availableCheckboxes} Checkboxen angehakt = ${percentage}%`);
        console.log('Gefundene Kategorien (Set):', gefundeneKategorien.size);
        console.log('Angehakte Checkboxen (DOM):', checkedCheckboxes);

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if (progressBar && progressText) {
            progressBar.style.width = percentage + '%';
            progressText.textContent = `${percentage}% (${checkedCheckboxes}/${availableCheckboxes})`;

            // NUR bei echter 100%-Abdeckung UND abgeschlossener Analyse
            // WICHTIG: Prüfe die REALEN DOM-Werte, nicht die theoretischen!
            if (checkedCheckboxes >= availableCheckboxes && checkedCheckboxes > 0 && !analyseLaeuft) {
                progressText.textContent = '100% - Du bist komplett verrückt!';
                progressBar.style.backgroundColor = '#28a745';
            }
        }
    }

    function updateAnalyzeButton(currentPage, maxPage) {
        const progressInfo = document.getElementById('progressInfo');

        if (analyseLaeuft) {
            if (progressInfo) {
                progressInfo.textContent = `Analysiere Dealseite ${currentPage} / ${maxPage}`;
            }
        } else {
            if (progressInfo) {
                progressInfo.textContent = '';
            }
        }
    }

    // Nur Checkmark sofort setzen, keine komplette Neuzeichnung
    function setCheckmarkForCategory(categoryId) {
        const checkbox = document.querySelector(`input[name="category"][value="${categoryId}"]`);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.disabled = true;

            // Auch das Label visuell aktualisieren
            const label = checkbox.closest('label');
            if (label) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#999';
            }

            console.log(`Checkmark gesetzt für Kategorie ${categoryId}`);
        }
    }

    // Analysiert eine Seite per Fetch und GraphQL
    async function analyzePageByFetch(pageNum) {
        const currentUrl = new URL(window.location.href);
        const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;
        const fetchUrl = `${baseUrl}?page=${pageNum}`;

        try {
            console.log(`Lade Seite ${pageNum} per Fetch: ${fetchUrl}`);
            const doc = await fetchInitialHtml(fetchUrl);

            const threads = doc.querySelectorAll('article.thread');
            console.log(`Seite ${pageNum}: ${threads.length} Threads im initialen HTML gefunden`);

            for (let index = 0; index < threads.length; index++) {
                // Prüfe ob Analyse abgebrochen wurde
                if (!analyseLaeuft) {
                    console.log('Analyse wurde abgebrochen');
                    return;
                }

                const article = threads[index];
                const threadId = article.id; // "thread_2584326"

                if (!threadId) {
                    console.warn(`Thread #${index}: Keine ID gefunden`);
                    continue;
                }

                // WICHTIG: Nur die numerische ID extrahieren
                const numericThreadId = threadId.replace('thread_', ''); // "2584326"

                try {
                    console.log(`Thread #${index}: Lade Daten für ${numericThreadId}`);

                    // GraphQL-Anfrage mit numerischer ID
                    const threadData = await fetchThreadData(numericThreadId);

                    if (!threadData) {
                        console.warn(`Thread #${index}: Keine Daten für ${numericThreadId} erhalten`);
                        continue;
                    }

                    if (!threadData.mainGroup?.threadGroupId) {
                        console.warn(`Thread #${index}: Keine Kategorie für ${numericThreadId} gefunden`);
                        continue;
                    }

                    const groupId = parseInt(threadData.mainGroup.threadGroupId);
                    const groupName = threadData.mainGroup.threadGroupName;
                    const title = threadData.title || 'Unbekannter Titel';
                    const dealUrl = `https://www.mydealz.de/${numericThreadId}`;

                    // Log-Eintrag: CSV-Zeile mit Titel
                    const logEntry = `${groupId},"${groupName}","${dealUrl}","${title}"`;
                    addLogEntry(logEntry);

                    // Zähle Deals pro Kategorie
                    kategorieZaehler.set(groupId, (kategorieZaehler.get(groupId) || 0) + 1);
                    gesamtDeals++;

                    // Neue Kategorie gefunden
                    if (!gefundeneKategorien.has(groupId)) {
                        gefundeneKategorien.add(groupId);
                        console.log(`NEUE Kategorie gefunden: ${groupName} (ID: ${groupId})`);

                        // SOFORT Checkmark setzen
                        setCheckmarkForCategory(groupId);
                        updateProgress();
                    }

                    console.log(`Thread #${index} verarbeitet: ${title} -> ${groupName}`);

                    // Kurze Pause zwischen GraphQL-Anfragen
                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (error) {
                    console.error(`Fehler bei Thread #${index} (${numericThreadId}):`, error);
                }
            }

        } catch (error) {
            console.error(`Fehler beim Laden von Seite ${pageNum}:`, error);
        }
    }

    async function analyzeUserDeals() {
        if (analyseLaeuft) {
            // Analyse abbrechen durch Reload
            window.location.reload();
            return;
        }

        analyseLaeuft = true;

        // Username aus URL extrahieren
        username = getUsernameFromUrl();

        // Reset der Zähler
        gefundeneKategorien.clear();
        kategorieZaehler.clear();
        gesamtDeals = 0;
        logData = ['KategorieID,Kategoriename,Deal-URL,Deal-Titel']; // CSV-Header mit Titel

        const downloadBtn = document.getElementById('downloadBtn');
        const progressInfo = document.getElementById('progressInfo');

        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }

        if (progressInfo) {
            progressInfo.textContent = 'Starte Analyse...';
        }

        try {
            // Maximale Seitenzahl aus der LIVE-Seite ermitteln
            const maxPage = pageNum('button[aria-label="Letzte Seite"]') || 1;

            console.log(`Starte GraphQL-basierte Analyse von ${maxPage} Seiten für User: ${username}`);

            // ALLE Seiten analysieren - KEIN vorzeitiger Abbruch bei 100%
            for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
                // Prüfe ob Analyse abgebrochen wurde
                if (!analyseLaeuft) {
                    console.log('Analyse wurde abgebrochen');
                    return;
                }

                console.log(`Analysiere Seite ${currentPage}/${maxPage}`);

                updateAnalyzeButton(currentPage, maxPage);

                await analyzePageByFetch(currentPage);

                // Kurze Pause zwischen Seiten
                await new Promise(resolve => setTimeout(resolve, 500));
            }

        } catch (error) {
            console.error('Fehler bei der Analyse:', error);
        } finally {
            analyseLaeuft = false;

            // NUR Download-Button anzeigen
            if (downloadBtn) {
                downloadBtn.style.display = 'inline-block';
                downloadBtn.onclick = downloadDebugFile;
            }

            if (progressInfo) {
                progressInfo.textContent = 'Analyse abgeschlossen';
            }

            // Debug: Finale Ausgabe
            console.log('=== ANALYSE ABGESCHLOSSEN ===');
            console.log(`Gefundene Kategorien: ${gefundeneKategorien.size}`);
            console.log(`Gesamt Deals: ${gesamtDeals}`);
            console.log('Kategorie-Zähler:', Object.fromEntries(kategorieZaehler));

            // WICHTIG: NUR die Texte aktualisieren, NICHT das HTML überschreiben
            setTimeout(() => {
                gefundeneKategorien.forEach(categoryId => {
                    const checkbox = document.querySelector(`input[name="category"][value="${categoryId}"]`);
                    if (checkbox) {
                        // Sicherstellen, dass Checkbox gesetzt ist
                        checkbox.checked = true;
                        checkbox.disabled = true;

                        const label = checkbox.closest('label');
                        const span = label.querySelector('span');
                        const dealCount = kategorieZaehler.get(categoryId) || 0;
                        const percentage = gesamtDeals > 0 ? Math.round((dealCount / gesamtDeals) * 100) : 0;

                        // Nur den Text aktualisieren
                        const categoryName = checkbox.dataset.name;
                        span.textContent = `${categoryName} (${dealCount} | ${percentage}%)`;

                        // Formatierung explizit setzen
                        label.style.textDecoration = 'line-through';
                        label.style.color = '#999';

                        console.log(`Finale Aktualisierung für Kategorie ${categoryName}: ${dealCount} Deals (${percentage}%)`);
                    }
                });

                updateProgress(); // Finale Aktualisierung mit korrekter Zählung
            }, 100);
        }
    }

    function updateCategoryDisplay() {
        const form = document.getElementById('categoryForm');
        if (form && kategorien.length > 0) {
            form.innerHTML = renderCategories(kategorien);
            console.log(`Popup initial aktualisiert: ${kategorien.length} Kategorien geladen`);
        }
    }

    function closePopup() {
        if (analyseLaeuft) {
            // Analyse abbrechen durch Reload
            window.location.reload();
            return;
        }

        const popup = document.querySelector('.popover');
        if (popup) popup.remove();
        const overlay = document.querySelector('.modal-backdrop');
        if (overlay) overlay.remove();
        addAnalyzeButton();
    }

    function showAnalyzeDialog(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const existingPopup = document.querySelector('.popover');
        if (existingPopup) {
            existingPopup.remove();
            const existingOverlay = document.querySelector('.modal-backdrop');
            if (existingOverlay) existingOverlay.remove();
        }

        document.body.insertAdjacentHTML('beforeend', popupTemplate);
        initializePopup();
    }

    function initializePopup() {
        const form = document.getElementById('categoryForm');

        fetchKategorien().then(categories => {
            kategorien = categories;
            form.innerHTML = renderCategories(categories);
            updateProgress();
        });

        const closeBtnOld = document.getElementById('closeBtn');
        const closeBtn = closeBtnOld.cloneNode(true);
        closeBtnOld.parentNode.replaceChild(closeBtn, closeBtnOld);

        const downloadBtnOld = document.getElementById('downloadBtn');
        const downloadBtn = downloadBtnOld.cloneNode(true);
        downloadBtnOld.parentNode.replaceChild(downloadBtn, downloadBtnOld);

        closeBtn.addEventListener('click', () => closePopup());

        // Starte Analyse automatisch
        analyzeUserDeals();
    }

    function init() {
        // Button auf Deal-Übersichtsseite hinzufügen
        addAnalyzeButton();

        // Observer für dynamische Inhalte
        const observer = new MutationObserver(() => {
            addAnalyzeButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();
})();
