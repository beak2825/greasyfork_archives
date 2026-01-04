// ==UserScript==
// @name         Avito Scraping Assistant
// @namespace    https://danielfragomeli.com/
// @version      1.2
// @description  Assistente per navigare e scaricare dati da Avito con gestione manuale dei CAPTCHA e supporto corretto per caratteri cirillici
// @author       dan098
// @match        *://*.avito.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js
// @downloadURL https://update.greasyfork.org/scripts/529487/Avito%20Scraping%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/529487/Avito%20Scraping%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stili CSS per l'interfaccia
    const css = `
        #avito-scraper-panel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #fff;
            border: 2px solid #0078d7;
            border-radius: 5px;
            padding: 10px;
            width: 400px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        #avito-scraper-panel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #0078d7;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        #avito-urls {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
            resize: vertical;
        }
        #avito-status {
            margin: 10px 0;
            padding: 5px;
            border-radius: 3px;
            background-color: #f0f0f0;
        }
        .avito-button {
            background-color: #0078d7;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px 5px 5px 0;
            border-radius: 3px;
            cursor: pointer;
        }
        .avito-button:hover {
            background-color: #005a9e;
        }
        .avito-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .progress-bar {
            height: 15px;
            background-color: #e0e0e0;
            border-radius: 5px;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background-color: #0078d7;
            border-radius: 5px;
            width: 0%;
            transition: width 0.3s;
        }
        .captcha-alert {
            color: #d61e00;
            font-weight: bold;
            margin-top: 5px;
            display: none;
        }
        .controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .pause-button {
            background-color: #ff9800;
        }
        .pause-button:hover {
            background-color: #e68a00;
        }
        .loading-indicator {
            color: blue;
            font-style: italic;
        }
        #current-url-container {
            margin: 10px 0;
            border: 1px solid #ddd;
            padding: 5px;
            border-radius: 3px;
            word-break: break-all;
            font-size: 12px;
        }
        #extracted-preview {
            margin: 10px 0;
            max-height: 100px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 5px;
            font-size: 12px;
            background-color: #f9f9f9;
        }
    `;

    // Aggiungi stili alla pagina
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Crea e aggiungi il pannello di controllo alla pagina
    const panel = document.createElement('div');
    panel.id = 'avito-scraper-panel';
    panel.innerHTML = `
        <h3>Avito Scraping Assistant</h3>
        <div>
            <textarea id="avito-urls" placeholder="Inserisci gli URL da visitare, uno per riga"></textarea>
            <div class="controls-row">
                <button id="load-urls" class="avito-button">Carica URLs</button>
                <button id="load-file" class="avito-button">Carica da File</button>
                <input type="file" id="url-file" style="display: none;" accept=".txt,.csv">
            </div>
        </div>
        <div id="current-url-container" style="display: none;">
            <strong>URL Corrente:</strong> <span id="current-url"></span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div id="avito-status">Stato: Pronto</div>
        <div class="captcha-alert" id="captcha-alert">⚠️ CAPTCHA rilevato! Risolvilo manualmente, poi clicca "Continua"</div>
        <div class="loading-indicator" id="loading-indicator" style="display: none;">Caricamento pagina in corso...</div>
        <div id="extracted-preview" style="display: none;"></div>
        <div>
            <button id="start-scraping" class="avito-button" disabled>Inizia</button>
            <button id="extract-data" class="avito-button" disabled>Estrai Dati</button>
            <button id="next-url" class="avito-button" disabled>Prossimo</button>
            <button id="pause-resume" class="avito-button pause-button" disabled>Pausa</button>
        </div>
        <div>
            <button id="export-csv" class="avito-button" disabled>Esporta CSV</button>
            <button id="clear-data" class="avito-button" disabled>Cancella Dati</button>
            <button id="view-data" class="avito-button" disabled>Visualizza Dati</button>
        </div>
    `;

    document.body.appendChild(panel);

    // Funzioni helper per gestire lo stato dello scraping
    class ScrapingState {
        constructor() {
            this.urls = [];
            this.currentIndex = 0;
            this.extractedData = [];
            this.isPaused = false;
            this.isLoading = false;
            this.loadState();
        }

        loadState() {
            const savedUrls = GM_getValue('avitoUrls', null);
            const savedIndex = GM_getValue('avitoCurrentIndex', 0);
            const savedData = GM_getValue('avitoExtractedData', null);
            
            if (savedUrls) {
                this.urls = JSON.parse(savedUrls);
                document.getElementById('avito-urls').value = this.urls.join('\n');
            }
            
            this.currentIndex = savedIndex;
            
            if (savedData) {
                this.extractedData = JSON.parse(savedData);
            }
            
            this.updateButtonStates();
            this.updateProgress();
            
            if (this.urls.length > 0) {
                document.getElementById('start-scraping').disabled = false;
                
                if (this.extractedData.length > 0) {
                    document.getElementById('export-csv').disabled = false;
                    document.getElementById('clear-data').disabled = false;
                    document.getElementById('view-data').disabled = false;
                }
            }
        }

        saveState() {
            GM_setValue('avitoUrls', JSON.stringify(this.urls));
            GM_setValue('avitoCurrentIndex', this.currentIndex);
            GM_setValue('avitoExtractedData', JSON.stringify(this.extractedData));
        }

        setUrls(urlArray) {
            this.urls = urlArray.filter(url => url.trim() !== '');
            this.saveState();
            this.updateButtonStates();
            this.updateProgress();
        }

        getCurrentUrl() {
            if (this.currentIndex < this.urls.length) {
                return this.urls[this.currentIndex];
            }
            return null;
        }

        moveToNext() {
            if (this.currentIndex < this.urls.length - 1) {
                this.currentIndex++;
                this.saveState();
                this.updateProgress();
                return true;
            }
            return false;
        }

        addExtractedData(data) {
            this.extractedData.push(data);
            this.saveState();
            document.getElementById('export-csv').disabled = false;
            document.getElementById('clear-data').disabled = false;
            document.getElementById('view-data').disabled = false;
            
            // Mostra un'anteprima dei dati estratti
            this.showDataPreview(data);
        }

        showDataPreview(data) {
            const previewEl = document.getElementById('extracted-preview');
            previewEl.style.display = 'block';
            
            // Seleziona alcuni campi chiave da mostrare
            const preview = `
                <strong>Dati estratti:</strong><br>
                Venditore: ${data['seller name']}<br>
                Città: ${data['Seller City']}<br>
                Prezzo: ${data.Price}<br>
                <small>(Dati salvati correttamente)</small>
            `;
            
            previewEl.innerHTML = preview;
        }

        updateProgress() {
            const progressElement = document.getElementById('progress-fill');
            const percent = this.urls.length > 0 ? (this.currentIndex / this.urls.length) * 100 : 0;
            progressElement.style.width = `${percent}%`;
            
            const statusElement = document.getElementById('avito-status');
            statusElement.textContent = `Stato: ${this.currentIndex}/${this.urls.length} URL processati`;
            
            const currentUrlContainer = document.getElementById('current-url-container');
            const currentUrlSpan = document.getElementById('current-url');
            
            if (this.getCurrentUrl()) {
                currentUrlContainer.style.display = 'block';
                currentUrlSpan.textContent = this.getCurrentUrl();
            } else {
                currentUrlContainer.style.display = 'none';
            }
        }

        updateButtonStates() {
            const startButton = document.getElementById('start-scraping');
            const extractButton = document.getElementById('extract-data');
            const nextButton = document.getElementById('next-url');
            const pauseButton = document.getElementById('pause-resume');
            const viewDataButton = document.getElementById('view-data');
            
            startButton.disabled = this.urls.length === 0;
            
            const isCurrentPage = window.location.href.includes(this.getCurrentUrl());
            extractButton.disabled = !isCurrentPage || this.isLoading;
            nextButton.disabled = this.currentIndex >= this.urls.length - 1 || this.isLoading;
            pauseButton.disabled = this.urls.length === 0;
            viewDataButton.disabled = this.extractedData.length === 0;
        }

        setLoading(isLoading) {
            this.isLoading = isLoading;
            const loadingIndicator = document.getElementById('loading-indicator');
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
            this.updateButtonStates();
        }

        clearData() {
            this.extractedData = [];
            this.saveState();
            document.getElementById('export-csv').disabled = true;
            document.getElementById('clear-data').disabled = true;
            document.getElementById('view-data').disabled = true;
            document.getElementById('extracted-preview').style.display = 'none';
        }
    }

    // Istanza dello stato dello scraping
    const state = new ScrapingState();

    // Funzione per estrarre i dati dalla pagina attuale
    function extractDataFromPage() {
        const data = {
            link: window.location.href,
            'seller name': 'N/A',
            'shop link': 'N/A',
            marketplace: 'Avito',
            product: 'Jewelry',
            image: 'N/A',
            description: 'N/A',
            'Seller City': 'N/A',
            Price: 'N/A',
            'Data scaricamento': new Date().toISOString().split('T')[0],
            month: '2025-03',
            Brand: 'Roberto Coin',
            Country: 'Russia',
            'Type of platform': 'Marketplace'
        };

        // Gli XPath forniti
        const xpaths = {
            'seller name': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[2]/div/div/div/div[3]/div[2]/div/div/div/div[1]/div/div[1]/div/div[1]/div/div/div/h3/a",
            'shop link': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[2]/div/div/div/div[3]/div[2]/div/div/div/div[1]/div/div[1]/div/div[1]/div/div/div/h3/a",
            'image': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[1]/div[2]/div[1]/div[1]/div/div/div/div/div[3]/img",
            'description': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[1]/div[2]/div[2]/div/div/div/p[1]",
            'Seller City': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[1]/div[2]/div[1]/div[2]/div/div/div[1]/div[1]/div/p[1]/span",
            'Price': "/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[3]/div/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/span/span/span[1]"
        };

        // Estrai i dati utilizzando gli XPath
        for (const [field, xpath] of Object.entries(xpaths)) {
            try {
                const element = document.evaluate(
                    xpath, 
                    document, 
                    null, 
                    XPathResult.FIRST_ORDERED_NODE_TYPE, 
                    null
                ).singleNodeValue;

                if (element) {
                    if (field === 'shop link') {
                        data[field] = element.getAttribute('href') || 'N/A';
                        // Aggiunge dominio se il link è relativo
                        if (data[field] && !data[field].startsWith('http')) {
                            data[field] = `https://www.avito.ru${data[field]}`;
                        }
                    } else if (field === 'image') {
                        data[field] = element.getAttribute('src') || 'N/A';
                    } else {
                        data[field] = element.textContent.trim() || 'N/A';
                    }
                }
            } catch (e) {
                console.error(`Errore nell'estrazione di ${field}:`, e);
            }
        }

        state.addExtractedData(data);
        
        // Aggiorna lo stato e mostra un messaggio di successo
        const statusElement = document.getElementById('avito-status');
        statusElement.textContent = `Stato: Dati estratti da ${state.currentIndex + 1}/${state.urls.length} URL`;
        
        // Abilita il pulsante "Next" se ci sono ancora URL da processare
        document.getElementById('next-url').disabled = state.currentIndex >= state.urls.length - 1;
        
        return data;
    }

    // Funzione per rilevare CAPTCHA
    function detectCaptcha() {
        // Questa è una semplificazione: adatta i selettori in base al reale CAPTCHA di Avito
        const captchaSelectors = [
            'iframe[src*="captcha"]',
            'div[class*="captcha"]',
            'div[id*="captcha"]',
            'input[name*="captcha"]',
            'img[src*="captcha"]',
            'form[action*="captcha"]',
            'div.firewall-container'  // Aggiunto per il firewall di Avito
        ];
        
        for (const selector of captchaSelectors) {
            if (document.querySelector(selector)) {
                return true;
            }
        }
        
        // Cerca anche per testo di CAPTCHA o blocco
        const bodyText = document.body.innerText.toLowerCase();
        const captchaTexts = ['captcha', 'проверка', 'безопасность', 'подтвердите', 'robot', 'человек'];
        for (const text of captchaTexts) {
            if (bodyText.includes(text)) {
                return true;
            }
        }
        
        return false;
    }

    // Gestori degli eventi per i pulsanti
    document.getElementById('load-urls').addEventListener('click', () => {
        const urlText = document.getElementById('avito-urls').value;
        const urlArray = urlText.split('\n').map(url => url.trim()).filter(url => url !== '');
        state.setUrls(urlArray);
        document.getElementById('start-scraping').disabled = urlArray.length === 0;
    });

    document.getElementById('load-file').addEventListener('click', () => {
        document.getElementById('url-file').click();
    });

    document.getElementById('url-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                document.getElementById('avito-urls').value = content;
                const urlArray = content.split('\n').map(url => url.trim()).filter(url => url !== '');
                state.setUrls(urlArray);
                document.getElementById('start-scraping').disabled = urlArray.length === 0;
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('start-scraping').addEventListener('click', () => {
        const currentUrl = state.getCurrentUrl();
        if (currentUrl) {
            state.setLoading(true);
            window.location.href = currentUrl;
        }
    });

    document.getElementById('extract-data').addEventListener('click', () => {
        const data = extractDataFromPage();
        const previewEl = document.getElementById('extracted-preview');
        previewEl.style.display = 'block';
    });

    document.getElementById('next-url').addEventListener('click', () => {
        if (state.moveToNext()) {
            const nextUrl = state.getCurrentUrl();
            if (nextUrl) {
                state.setLoading(true);
                window.location.href = nextUrl;
            }
        } else {
            alert('Hai completato tutti gli URL!');
        }
    });

    document.getElementById('pause-resume').addEventListener('click', () => {
        state.isPaused = !state.isPaused;
        const pauseButton = document.getElementById('pause-resume');
        pauseButton.textContent = state.isPaused ? 'Riprendi' : 'Pausa';
    });

    // Funzione per gestire correttamente l'encoding del CSV
    function exportCSV() {
        if (state.extractedData.length === 0) {
            alert('Nessun dato da esportare.');
            return;
        }
        
        // Utilizza PapaParse con configurazione per UTF-8
        const csvConfig = {
            quotes: true,  // Usa sempre le virgolette per proteggere i valori con caratteri speciali
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: false
        };
        
        const csv = Papa.unparse(state.extractedData, csvConfig);
        
        // Aggiunge BOM (Byte Order Mark) per far riconoscere correttamente UTF-8 a Excel e altri programmi
        const BOM = "\uFEFF";
        const csvWithBOM = BOM + csv;
        
        // Crea un blob con encoding esplicito UTF-8
        const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Crea un link per il download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `avito_data_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('export-csv').addEventListener('click', exportCSV);

    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Sei sicuro di voler cancellare tutti i dati estratti?')) {
            state.clearData();
            const statusElement = document.getElementById('avito-status');
            statusElement.textContent = 'Stato: Dati cancellati';
        }
    });

    document.getElementById('view-data').addEventListener('click', () => {
        if (state.extractedData.length === 0) {
            alert('Nessun dato da visualizzare.');
            return;
        }
        
        // Crea una nuova finestra per visualizzare i dati
        const dataWindow = window.open('', 'Dati Estratti', 'width=800,height=600');
        dataWindow.document.write(`
            <html>
            <head>
                <title>Dati Estratti da Avito</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .container { max-width: 100%; overflow-x: auto; }
                </style>
            </head>
            <body>
                <h2>Dati Estratti da Avito (${state.extractedData.length} record)</h2>
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(state.extractedData[0]).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${state.extractedData.map(record => `
                                <tr>
                                    ${Object.values(record).map(value => `<td>${value}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `);
    });

    // Controllo periodico di CAPTCHA e caricamento pagina
    function checkPageStatus() {
        const captchaAlert = document.getElementById('captcha-alert');
        
        if (detectCaptcha()) {
            captchaAlert.style.display = 'block';
            state.setLoading(false);
        } else {
            captchaAlert.style.display = 'none';
            
            // Controlla se la pagina è completamente caricata
            if (document.readyState === 'complete') {
                state.setLoading(false);
                
                // Se l'URL corrente corrisponde all'URL che stiamo processando, abilita il pulsante di estrazione
                const currentUrl = state.getCurrentUrl();
                if (currentUrl && window.location.href.includes(currentUrl)) {
                    document.getElementById('extract-data').disabled = false;
                }
            }
        }
    }

    // Controlla lo stato della pagina ogni secondo
    setInterval(checkPageStatus, 1000);

    // Evento quando la pagina è completamente caricata
    window.addEventListener('load', () => {
        // Aggiungiamo un piccolo ritardo per assicurarci che tutti gli elementi siano caricati
        setTimeout(() => {
            state.setLoading(false);
            state.updateButtonStates();
            
            // Verifica se l'URL corrente corrisponde a uno degli URL nella lista
            const currentUrl = state.getCurrentUrl();
            if (currentUrl && window.location.href.includes(currentUrl)) {
                document.getElementById('extract-data').disabled = false;
            }
        }, 1500);
    });

    console.log('Avito Scraping Assistant avviato con supporto UTF-8');
})();