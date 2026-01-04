// ==UserScript==
// @name         Amazon Vine Suche
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Analysiere Amazon Vine Artikel und suche nach Namen oder ASINs
// @author       Dein Name
// @match        https://www.amazon.de/vine/vine-items?queue=encore*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499903/Amazon%20Vine%20Suche.user.js
// @updateURL https://update.greasyfork.org/scripts/499903/Amazon%20Vine%20Suche.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS-Stile für die Benutzeroberfläche und Suchergebnisse
    const styles = `
        #vineScraperUI {
            position: relative;
            z-index: 1000;
            background-color: white;
            padding: 5px;
            width: 800px;
            user-select: none;
        }
        #vineScraperHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #vineScraperContent {
            margin-top: 10px;
        }
        #analyzeButton, #searchButton {
            display: block;
            padding: 10px;
            height: 35px;
            background-color: #ffd000;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 10px;
            margin-right: 5px;
        }
        #toggleResultsButton {
            display: none; /* Standardmäßig ausblenden */
            position: absolute;
            left: 800px;
            top: 95px;
            background-color: #ffd000;
            color: black;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #searchInput {
            flex: 1;
            height: 35px;
            padding: 10px;
            border: 1px solid #ffd000;
            border-radius: 5px;
            margin-right: 5px;
        }
        #searchResults {
            height: 140px;
            overflow: auto;
            background-color: white;
            border: 1px solid #ffd000;
            border-radius: 5px;
            padding: 10px;
            margin-top: 10px;
        }
        .result-item {
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .result-item h3 {
            margin: 0 0 5px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #lastAnalyzed {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        #analyzeStatus {
            font-size: 0.9em;
            color: #0073bb;
            margin-top: 5px;
        }
        #progressContainer {
            margin-top: 10px;
        }
        #progressBar {
            width: 100%;
            background-color: #f3f3f3;
            border-radius: 5px;
            overflow: hidden;
        }
        #progress {
            height: 20px;
            background-color: #4caf50;
            width: 0%;
            text-align: center;
            line-height: 20px;
            color: white;
        }
        #totalPagesInput {
            width: 70px;
            height: 35px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px;
        }
        #saveTotalPagesButton {
            padding: 5px 10px;
            height: 35px;
            background-color: #f3f3f3;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `;

    // Standardwert für die Anzahl der Seiten
    let totalPages = localStorage.getItem('totalPages') || 250;

    // Funktion zur Erstellung der Benutzeroberfläche
    function createUI() {
        if (document.getElementById('vineScraperUI')) return;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        const uiContainer = document.createElement('div');
        uiContainer.id = 'vineScraperUI';

        const header = document.createElement('div');
        header.id = 'vineScraperHeader';

        const content = document.createElement('div');
        content.id = 'vineScraperContent';

        const searchInput = document.createElement('input');
        searchInput.id = 'searchInput';
        searchInput.placeholder = 'Artikelname oder ASIN';

        const searchButton = document.createElement('button');
        searchButton.id = 'searchButton';
        searchButton.textContent = 'Suchen';

        const analyzeButton = document.createElement('button');
        analyzeButton.id = 'analyzeButton';
        analyzeButton.textContent = 'Aktualisieren';

        const totalPagesInput = document.createElement('input');
        totalPagesInput.id = 'totalPagesInput';
        totalPagesInput.value = totalPages;
        totalPagesInput.type = 'number';
        totalPagesInput.title = 'Anzahl der Seiten für die Analyse';

        const saveTotalPagesButton = document.createElement('button');
        saveTotalPagesButton.id = 'saveTotalPagesButton';
        saveTotalPagesButton.textContent = 'Speichern';

        const lastAnalyzed = document.createElement('div');
        lastAnalyzed.id = 'lastAnalyzed';

        const analyzeStatus = document.createElement('div');
        analyzeStatus.id = 'analyzeStatus';

        const progressContainer = document.createElement('div');
        progressContainer.id = 'progressContainer';

        const progressBar = document.createElement('div');
        progressBar.id = 'progressBar';

        const progress = document.createElement('div');
        progress.id = 'progress';
        progressBar.appendChild(progress);

        progressContainer.appendChild(progressBar);

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.appendChild(searchInput);
        inputContainer.appendChild(searchButton);
        inputContainer.appendChild(analyzeButton);
        inputContainer.appendChild(totalPagesInput);
        inputContainer.appendChild(saveTotalPagesButton);

        content.appendChild(inputContainer);
        content.appendChild(lastAnalyzed);
        content.appendChild(analyzeStatus);
        content.appendChild(progressContainer);

        uiContainer.appendChild(header);
        uiContainer.appendChild(content);
        document.getElementById('vvp-items-button-container').appendChild(uiContainer);

        const toggleResultsButton = document.createElement('button');
        toggleResultsButton.id = 'toggleResultsButton';
        toggleResultsButton.textContent = '+';
        header.appendChild(toggleResultsButton);

        toggleResultsButton.addEventListener('click', () => {
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.style.display = resultsDiv.style.display === 'none' ? 'block' : 'none';
        });

        analyzeButton.addEventListener('click', async () => {
            analyzeStatus.textContent = 'Aktualisierung läuft...';
            await analyzeArticles();
            analyzeStatus.textContent = 'Analyse abgeschlossen';
            updateLastAnalyzed();
        });

        searchButton.addEventListener('click', () => {
            const query = searchInput.value;
            const results = searchArticles(query);
            let resultsDiv = document.getElementById('searchResults');

            if (!resultsDiv) {
                resultsDiv = document.createElement('div');
                resultsDiv.id = 'searchResults';
                content.appendChild(resultsDiv);
            }

            resultsDiv.innerHTML = '';

            if (results.length > 0) {
                results.forEach(article => {
                    const div = document.createElement('div');
                    div.className = 'result-item';
                    div.innerHTML = `<h4>${article.name}</h4><p>ASIN: ${article.asin}</p><p><a href="https://www.amazon.de/vine/vine-items?queue=encore&page=${article.page}" target="_blank">Seite: ${article.page}</a></p>`;
                    resultsDiv.appendChild(div);
                });
                toggleResultsButton.style.display = 'block'; // Button anzeigen, wenn Ergebnisse vorhanden sind
            } else {
                resultsDiv.textContent = 'Keine Artikel gefunden';
                toggleResultsButton.style.display = 'none'; // Button ausblenden, wenn keine Ergebnisse vorhanden sind
            }
        });

        saveTotalPagesButton.addEventListener('click', () => {
            totalPages = totalPagesInput.value;
            localStorage.setItem('totalPages', totalPages);
            alert(`Anzahl der Seiten für die Analyse auf ${totalPages} gesetzt`);
        });

        dragElement(uiContainer);
        updateLastAnalyzed();
    }

    async function analyzeArticles() {
        const articles = [];

        for (let page = 1; page <= totalPages; page++) {
            try {
                const waitTime = Math.random() * 300 + 700;
                await new Promise(resolve => setTimeout(resolve, waitTime));

                const response = await fetch(`https://www.amazon.de/vine/vine-items?queue=encore&page=${page}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                if (!response.ok) {
                    throw new Error(`Seite ${page}: ${response.statusText}`);
                }
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const items = doc.querySelectorAll('#vvp-items-grid .vvp-item-tile');
                items.forEach(item => {
                    const name = item.querySelector('.a-link-normal')?.textContent.trim();
                    const asin = item.querySelector('.a-link-normal')?.href.split('/dp/')[1]?.split('/')[0];
                    articles.push({ name, asin, page });
                });

                // Fortschritt aktualisieren
                const progressBar = document.getElementById('progress');
                const percent = Math.round((page / totalPages) * 100);
                progressBar.style.width = `${percent}%`;
                progressBar.textContent = `${percent}%`;

                console.log(`Seite ${page} verarbeitet`);
            } catch (error) {
                console.error(`Fehler auf Seite ${page}: ${error.message}`);
            }
        }

        localStorage.setItem('amazonVineArticles', JSON.stringify(articles));
    }

    function searchArticles(query) {
        const articles = JSON.parse(localStorage.getItem('amazonVineArticles') || '[]');
        const regex = new RegExp(query, 'i');
        return articles.filter(article =>
            regex.test(article.name) || regex.test(article.asin)
        );
    }

    function updateLastAnalyzed() {
        const lastAnalyzed = localStorage.getItem('lastAnalyzed');
        const lastAnalyzedDiv = document.getElementById('lastAnalyzed');
        if (lastAnalyzed) {
            const date = new Date(lastAnalyzed);
            lastAnalyzedDiv.textContent = `Zuletzt analysiert: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        } else {
            lastAnalyzedDiv.textContent = 'Noch keine Analyse durchgeführt';
        }
    }

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('vineScraperHeader');

        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            console.error('Header-Element nicht gefunden!');
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    createUI();

    const observer = new MutationObserver(createUI);
    observer.observe(document.body, { childList: true, subtree: true });
})();
