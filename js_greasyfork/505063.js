// ==UserScript==
// @name         Zalando
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Dodaje panel na stronie z różnymi opcjami
// @author       TomaszFromage
// @match        https://www.zalando-lounge.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505063/Zalando.user.js
// @updateURL https://update.greasyfork.org/scripts/505063/Zalando.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS do stylowania panelu
    const panelStyle = `
    #custom-panel {
        position: fixed;
        top: 2%;
        left: 1%;
        width: 30%;
        height: 95%;
        border: 2px solid deepskyblue;
        border-radius: 10px;
        padding: 10px;
        background-color: gray;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        overflow-y: auto;
        z-index: 10000 !important;
    }
    #custom-panel h3 {
        text-align: center;
        margin-bottom: 10px;
    }
    #custom-panel input, #custom-panel select {
        width: 100%;
        margin: 5px 0;
        padding: 5px;
    }
    #custom-panel button {
        width: 100%;
        padding: 10px;
        background-color: #333;
        color: white;
        border: none;
        cursor: pointer;
    }
    #top_menu {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }
    #observed_menu {
        display: block;
    }
    #search_menu {
        display: none;
    }
    #search_menu input {
        width: 100%;
    }
    #toggle_switch {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }
    .toggle_button {
        padding: 5px 10px;
        cursor: pointer;
        background-color: #333;
        color: white;
        border: none;
        flex-grow: 1;
    }
    .active_button {
        background-color: deepskyblue !important;
        color: black !important;
    }
    #status-message {
        text-align: center;
        margin-top: 10px;
    }
    .loading {
        color: yellow;
    }
    .complete {
        color: yellowgreen;
    }
    #observed_list {
        padding: 10px;
        max-height: 80%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .observed-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        position: relative;
        overflow: hidden;
    }
    .observed-image-wrapper {
        position: relative;
        width: 50px;
        height: 50px;
    }
    .observed-image {
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
.image-popup {
    display: none;
    position: absolute;
    top: 0;
    left: 60px;
    border: 2px solid #333;
    background-color: white;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    max-width: 200px;
    overflow: hidden;
    width: 200px;
}

.image-popup img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}


    .observed-info {
        flex-grow: 1;
        padding-left: 10px;
        color: white;
    }
    .observed-info strong {
        color: black;
    }
    .observed-info p {
        margin: 5px 0;
    }
    .observed-info a {
        color: lightskyblue;
        text-decoration: none;
    }
    .observed-info a:hover {
        text-decoration: underline;
    }
    .observed-item button {
        background-color: crimson !important;
        color: black !important;
        border: none;
        cursor: pointer;
        width: 20px !important;
        height: 20px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        font-size: 14px !important;
        font-weight: bold !important;
        line-height: 0 !important;
    }
    .observed-item button::before {
        color: black !important;
    }



  /* Animacja dodawania z boku */
.slide-in {
    animation: slideInAnimation 0.5s forwards;
}

@keyframes slideInAnimation {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Animacja usuwania z boku */
.slide-out {
    animation: slideOutAnimation 0.5s forwards;
}

@keyframes slideOutAnimation {
    from {
        opacity: 1;
        transform: translateX(0);
        max-height: 500px;
    }
    to {
        opacity: 0;
        transform: translateX(100%);
        max-height: 0;
    }
}

/* Dodaj styl dla komunikatu pustej listy */
.empty-message {
    text-align: center;
    color: white;
}
    `;

    // Dodanie CSS do strony
    addCSS(panelStyle);

    // Tworzenie panelu
    const panelHTML = `
    <div id="custom-panel">
        <div id="top_menu">
            <button id="hideButton">Ukryj menu</button>
        </div>
        <div id="toggle_switch">
            <button class="toggle_button" id="search_toggle">Szukaj</button>
            <button class="toggle_button active_button" id="observed_toggle">Obserwowane</button>
        </div>
        <div id="search_menu">
            <h3>KATEGORIA</h3>
            <select id="kategoria"><option value="">Wybierz kategorię</option></select>
            <input id="kategoria_tekst" type="text" placeholder="Wpisz własną kategorię (po angielsku)">
            <h3>PŁEĆ</h3>
            <select id="płeć">
                <option value="">Wybierz płeć</option>
                <option>MALE</option>
                <option>FEMALE</option>
                <option>UNISEX</option>
            </select>
            <h3>ROZMIAR</h3>
            <select id="rozmiar"><option value="">Wybierz rozmiar</option></select>
            <input id="rozmiar_tekst" type="text" placeholder="Wpisz własny rozmiar">
            <h3>MARKA</h3>
            <select id="marka"><option value="">Wybierz markę</option></select>
            <input id="marka_tekst" type="text" placeholder="Wpisz własną markę">
            <h3>KOLOR</h3>
            <select id="kolor"><option value="">Wybierz kolor</option></select>
            <input id="kolor_tekst" type="text" placeholder="Wpisz własny kolor (po polsku)">
            <h3>CENA</h3>
            <div>
                <input id="cena_min" type="text" class="half-width" placeholder="Min">
                <input id="cena_max" type="text" class="half-width" placeholder="Max">
            </div>
            <button id="szukaj">SZUKAJ</button>
            <div id="status-message" class="loading">Ładowanie... Możesz szukać, ale w niepełnych danych.</div>
            <div id="preview_panel"></div>
        </div>
        <div id="observed_menu">
            <div id="observed_list"></div>
        </div>
    </div>
    <button id="showButton" style="display:none; position: fixed; top: 10px; left: 10px; z-index:99999;">Pokaż menu</button>
    `;

    const panel = createAndAppend('div', { id: 'custom-panel-id', innerHTML: panelHTML }, document.body);

    let observedItemsMap = new Map();

    const hideButton = document.getElementById('hideButton');
    const showButton = document.getElementById('showButton');
    const customPanel = document.getElementById('custom-panel');

    hideButton.addEventListener('click', function() {
        customPanel.style.display = 'none';
        showButton.style.display = 'block';
    });

    showButton.addEventListener('click', function() {
        customPanel.style.display = 'block';
        showButton.style.display = 'none';
    });

    setupToggleButtons();

    let allData = [];

    let obserwowaneProdukty = [];

    document.getElementById("szukaj").addEventListener('click', async function() {
        if (allData.length === 0) {
            await fetchDataAndPopulateFilters();
        }
        filterData();
    });

    loadObservedProducts();

    updateObservedList();

    checkAllObservedProductsRegularly();

    function addCSS(cssText) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = cssText;
        document.head.appendChild(styleElement);
    }

    function createAndAppend(tag, attributes, parent) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        parent.appendChild(element);
        return element;
    }

    function setupToggleButtons() {
        const searchMenu = document.getElementById('search_menu');
        const observedMenu = document.getElementById('observed_menu');
        const searchToggle = document.getElementById('search_toggle');
        const observedToggle = document.getElementById('observed_toggle');

        searchToggle.addEventListener('click', function() {
            toggleDisplay(searchMenu, observedMenu);
            setActiveButton(searchToggle, observedToggle);
        });

        observedToggle.addEventListener('click', function() {
            toggleDisplay(observedMenu, searchMenu);
            setActiveButton(observedToggle, searchToggle);
            updateObservedList();
        });
    }

    function toggleDisplay(showElement, hideElement) {
        showElement.style.display = 'block';
        hideElement.style.display = 'none';
    }

    function setActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add('active_button');
        inactiveButton.classList.remove('active_button');
    }

    async function fetchDataAndPopulateFilters() {
        const baseUrl = 'https://www.zalando-lounge.pl/api/phoenix/search/articles';
        const totalPages = 55;
        let loadedPages = 0;

        const concurrencyLimit = 5;
        let page = 1;

        while (page <= totalPages) {
            const promises = [];
            for (let i = 0; i < concurrencyLimit && page <= totalPages; i++, page++) {
                const url = `${baseUrl}?page=${page}&size=100`;
                promises.push(fetchData(url));
            }
            const pageDataArray = await Promise.all(promises);

            for (const pageData of pageDataArray) {
                if (Array.isArray(pageData)) {
                    allData = allData.concat(pageData);
                    loadedPages++;
                    document.getElementById('status-message').innerText = `Ładowanie danych... Załadowano ${loadedPages} z ${totalPages} stron. Możesz szukać, ale w niepełnych danych.`;

                    populateFilters(pageData);
                } else {
                    console.log(`Brak danych na stronie`);
                }
            }
        }

        const statusMessage = document.getElementById('status-message');
        statusMessage.innerText = 'Dane zostały pobrane. Możesz teraz szukać.';
        statusMessage.classList.remove('loading');
        statusMessage.classList.add('complete');
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    function populateFilters(dataArray) {
        const categories = new Set();
        const brands = new Set();
        const sizes = new Set();
        const colors = new Set();

        dataArray.forEach(data => {
            if (data.simples && data.simples.length > 0) {
                categories.add(data.simples[0].filterName);
                data.simples.forEach(simple => sizes.add(simple.filterValue));
            }
            brands.add(data.brand);
            colors.add(data.nameColor);
        });

        const fillSelect = (elementId, values, sortFunction) => {
            const selectElement = document.getElementById(elementId);
            const selectedValue = selectElement.value;
            selectElement.innerHTML = '';
            selectElement.appendChild(new Option("Wybierz...", ""));

            const sortedValues = sortFunction ? sortFunction(Array.from(values)) : Array.from(values).sort();

            sortedValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectElement.appendChild(option);
            });

            if (selectedValue && Array.from(selectElement.options).some(option => option.value === selectedValue)) {
                selectElement.value = selectedValue;
            }
        };

        fillSelect('kategoria', categories);
        fillSelect('marka', brands);
        fillSelect('rozmiar', sizes, sortSizes);
        fillSelect('kolor', colors);
    }

    function sortSizes(sizes) {
        const numericSizes = [];
        const letterSizes = [];
        const childrenSizes = [];

        sizes.forEach(size => {
            if (/^\d+$/.test(size)) {
                numericSizes.push(parseInt(size, 10));
            } else if (/^\d+\/\d+$/.test(size)) {
                childrenSizes.push(size);
            } else {
                letterSizes.push(size);
            }
        });

        numericSizes.sort((a, b) => a - b);
        childrenSizes.sort((a, b) => parseInt(a.split('/')[0]) - parseInt(b.split('/')[0]));
        letterSizes.sort();

        return [...numericSizes, ...letterSizes, ...childrenSizes];
    }

    function getCriteria() {
        return {
            kategoria: getValue('kategoria', 'kategoria_tekst'),
            marka: getValue('marka', 'marka_tekst'),
            kolor: getValue('kolor', 'kolor_tekst'),
            rozmiar: getValue('rozmiar', 'rozmiar_tekst'),
            cena_min: getNumber('cena_min'),
            cena_max: getNumber('cena_max')
        };
    }

    function getValue(selectId, textId) {
        return document.getElementById(textId).value.trim() || document.getElementById(selectId).value.trim();
    }

    function getNumber(id) {
        const value = parseInt(document.getElementById(id).value, 10);
        return isNaN(value) ? '' : value * 100;
    }

    function matchesCriteria(article, criteria) {
        return Object.keys(criteria).every(key => {
            if (!criteria[key]) return true;

            if (key === 'cena_min') {
                return article.price >= criteria[key];
            }

            if (key === 'cena_max') {
                return article.price <= criteria[key];
            }

            if (key === 'kolor') {
                return article.nameColor.toLowerCase() === criteria[key].toLowerCase();
            }

            if (key === 'marka') {
                return article.brand.toLowerCase().includes(criteria[key].toLowerCase());
            }

            if (key === 'kategoria') {
                return article.simples && article.simples[0] && article.simples[0].filterName.toLowerCase().includes(criteria[key].toLowerCase());
            }

            if (key === 'rozmiar') {
                return article.simples && article.simples.some(simple => simple.filterValue.toLowerCase() === criteria[key].toLowerCase());
            }

            return article[key] && article[key].toString().toLowerCase().includes(criteria[key].toLowerCase());
        });
    }

    function filterData() {
        const criteria = getCriteria();
        const filteredResults = allData.filter(article => matchesCriteria(article, criteria));
        displayResults(filteredResults);
    }

    function displayResults(results) {
        const previewPanel = document.getElementById('preview_panel');
        if (results.length === 0) {
            previewPanel.innerHTML = '<p>Brak wyników spełniających kryteria.</p>';
            return;
        }

        previewPanel.innerHTML = results.map(item => `
            <div>
                <p><strong>${item.brand}</strong> - ${item.nameColor} - ${(item.price / 100).toFixed(2)} zł</p>
            </div>
        `).join('');
    }

    function addButtonToElements(imageUrl) {
        const elements = document.querySelectorAll(".ArticleSizeItemWrapper-sc-dt4c4z-3:not(.zalando_observer_added)");

        elements.forEach(element => {
            if (!element.querySelector('.zalando_observer_class')) {
                const button = document.createElement('button');
                button.className = "zalando_observer_class";
                button.style.position = 'absolute';
                button.style.top = '0px';
                button.style.right = '0px';
                button.style.border = 'none';
                button.style.background = 'none';
                button.style.cursor = 'pointer';
                button.style.width = "20%";
                button.style.height = "50%";
                button.style.zIndex = '9999';

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Button Image';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.float = 'right';
                img.style.border = '3px solid black';
                button.appendChild(img);

                button.addEventListener('click', function () {
                    const currentUrl = window.location.href;
                    const nazwaElement = document.querySelector('.StyledText-sc-1d4eckw-0');
                    const nazwa = nazwaElement ? nazwaElement.textContent : 'Brak nazwy';
                    const eventMatch = currentUrl.match(/campaigns\/([^\/]*)\/categories\//) || currentUrl.match(/campaigns\/([^\/]*)\/articles\//);
                    const event = eventMatch ? eventMatch[1] : null;

                    if (!event) {
                        console.error('Nie udało się pobrać identyfikatora eventu.');
                        return;
                    }

                    const articleMatch = currentUrl.match(/articles\/([^?]*)/);
                    const article = articleMatch ? articleMatch[1] : null;
                    const priceElement = document.querySelector('.imExVH');
                    const price = priceElement ? priceElement.children[0].textContent : 'Brak ceny';
                    const sizeElement = element.querySelector('.ArticleSizeItemTitle-sc-1n1fwgw-3');
                    const size = sizeElement ? sizeElement.textContent : 'Brak rozmiaru';
                    let status = 'Dostępne';
                    const statusElement = element.querySelector('.boKuRh.lfClPj');
                    if (statusElement) {
                        status = statusElement.textContent;
                    }

                    const obrazekElement = document.querySelector('.Container-sc-15bh1nt-0');
                    const obrazekStyle = obrazekElement && obrazekElement ? obrazekElement.style.backgroundImage : '';
                    const obrazek = obrazekStyle.replace('url("', '').replace('")', '');

                    const uniqueId = `${event}_${article}_${size}_${status}`;

                    const existingIndex = obserwowaneProdukty.findIndex(p => p.id === uniqueId);

                    if (existingIndex > -1) {
                        obserwowaneProdukty.splice(existingIndex, 1);
                        img.style.border = '3px solid black';
                    } else {
                        obserwowaneProdukty.push({ id: uniqueId, event, article, size, status, nazwa, price, obrazek });
                        img.style.border = '3px solid yellowgreen';
                    }

                    // Zapis do LocalStorage
                    saveObservedProducts();
                    updateObservedList();
                });

                element.style.position = 'relative';
                element.appendChild(button);
                element.classList.add('zalando_observer_added');
            }
        });
    }


    function updateObservedList() {
        const observedList = document.getElementById('observed_list');

        // Pobierz aktualne ID produktów
        const currentProductIds = new Set(obserwowaneProdukty.map(product => product.id));

        // Dodaj nowe elementy
        obserwowaneProdukty.forEach(product => {
            if (!observedItemsMap.has(product.id)) {
                // Nowy produkt, dodaj do listy z animacją
                let statusColor = '';

                if (product.status.toLowerCase() === 'dostępne') {
                    statusColor = 'lime';
                } else if (product.status.toLowerCase() === 'wyprzedane') {
                    statusColor = 'rgb(100,0,0)';
                } else if (product.status.toLowerCase() === 'zarezerwowane') {
                    statusColor = 'yellow';
                }

                const itemHtml = `
                <div class="observed-item">
                    <div class="observed-image-wrapper">
                        <img src="${product.obrazek}" alt="${product.nazwa}" class="observed-image">
                        <div class="image-popup">
                            <img src="${product.obrazek}" alt="${product.nazwa}">
                        </div>
                    </div>
                    <div class="observed-info">
                        <p><strong>Nazwa:</strong> <a href="${window.location.origin}/campaigns/${product.event}/articles/${product.article}" target="_blank">${product.nazwa}</a></p>
                        <p><strong>Cena:</strong> ${product.price}</p>
                        <p><strong>Rozmiar:</strong> ${product.size}</p>
                        <p><strong>Status:</strong> <span style="color: ${statusColor};">${product.status}</span></p>
                    </div>
                    <button data-id="${product.id}" class="delete-observed">✖</button>
                </div>
            `;

                const itemElement = document.createElement('div');
                itemElement.innerHTML = itemHtml;
                const observedItem = itemElement.firstElementChild;

                // Dodaj nasłuchiwanie kliknięcia na przycisk usuwania
                const deleteButton = observedItem.querySelector('.delete-observed');
                deleteButton.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const productIndex = obserwowaneProdukty.findIndex(p => p.id === productId);
                    if (productIndex > -1) {
                        obserwowaneProdukty.splice(productIndex, 1);
                        saveObservedProducts();
                        updateObservedList();
                    }
                });

                // Eventy do powiększania obrazka po najechaniu
                const wrapper = observedItem.querySelector('.observed-image-wrapper');
                const popup = wrapper.querySelector('.image-popup');
                const popupImage = popup.querySelector('img');

                wrapper.addEventListener('mouseenter', () => {
                    if (popupImage.complete) {
                        adjustPopupPosition(wrapper, popup);
                        popup.style.display = 'block';
                    } else {
                        popupImage.onload = () => {
                            adjustPopupPosition(wrapper, popup);
                            popup.style.display = 'block';
                        };
                    }
                });

                wrapper.addEventListener('mouseleave', () => {
                    popup.style.display = 'none';
                    popup.style.height = ''; // Resetuj wysokość
                });

                function adjustPopupPosition(wrapper, popup) {
                    // Tymczasowo pokaż popup, aby uzyskać wymiary
                    popup.style.visibility = 'hidden';
                    popup.style.display = 'block';

                    const wrapperRect = wrapper.getBoundingClientRect();
                    const panelRect = document.getElementById('custom-panel').getBoundingClientRect();
                    const popupHeight = popup.offsetHeight;
                    const spaceBelow = panelRect.bottom - wrapperRect.bottom;
                    const spaceAbove = wrapperRect.top - panelRect.top;

                    if (spaceBelow >= popupHeight) {
                        // Wystarczająco miejsca poniżej
                        popup.style.top = '0';
                    } else if (spaceAbove >= popupHeight) {
                        // Wystarczająco miejsca powyżej
                        popup.style.top = `-${popupHeight - wrapper.offsetHeight}px`;
                    } else {
                        // Dostosuj wysokość popupu do dostępnej przestrzeni
                        if (spaceBelow >= spaceAbove) {
                            popup.style.top = '0';
                            popup.style.height = `${spaceBelow}px`;
                        } else {
                            popup.style.top = `-${spaceAbove - wrapper.offsetHeight}px`;
                            popup.style.height = `${spaceAbove}px`;
                        }
                    }

                    // Ustaw widoczność popupu
                    popup.style.visibility = 'visible';
                }

                // Dodaj element do listy i zaaplikuj animację
                observedList.appendChild(observedItem);
                observedItem.classList.add('slide-in');

                // Dodaj do mapy elementów
                observedItemsMap.set(product.id, observedItem);
            }
        });

        // Usuń produkty, które nie są już obserwowane
        observedItemsMap.forEach((itemElement, productId) => {
            if (!currentProductIds.has(productId)) {
                // Produkt został usunięty, animuj usunięcie
                itemElement.classList.add('slide-out');
                itemElement.addEventListener('animationend', function() {
                    observedList.removeChild(itemElement);
                    observedItemsMap.delete(productId);
                });
            }
        });

        // Wyświetl komunikat, jeśli lista jest pusta
        if (obserwowaneProdukty.length === 0) {
            // Sprawdź, czy komunikat już istnieje
            if (!observedList.querySelector('.empty-message')) {
                const messageElement = document.createElement('p');
                messageElement.textContent = 'Brak obserwowanych produktów';
                messageElement.classList.add('empty-message');
                observedList.appendChild(messageElement);
            }
            // Wyczyść mapę elementów
            observedItemsMap.clear();
        } else {
            // Usuń komunikat, jeśli istnieje
            const message = observedList.querySelector('.empty-message');
            if (message && message.parentNode === observedList) {
                observedList.removeChild(message);
            }
        }
    }

    function observeNewElements(imageUrl) {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addButtonToElements(imageUrl);
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        addButtonToElements(imageUrl);
    }

    observeNewElements('https://p7.hiclipart.com/preview/564/223/682/computer-icons-observation-others.jpg');

    function saveObservedProducts() {
        localStorage.setItem('observedProducts', JSON.stringify(obserwowaneProdukty));
    }

    function loadObservedProducts() {
        const storedProducts = localStorage.getItem('observedProducts');
        if (storedProducts) {
            obserwowaneProdukty = JSON.parse(storedProducts);
        }
    }

    function odswiezKoszyk() {

        fetch("https://www.zalando-lounge.pl/api/phoenix/stockcart/cart", {
            "credentials": "include",
            "headers": {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "client_type": "web",
                "X-Requested-With": "XMLHttpRequest"
            },
            "method": "PUT",
            "mode": "cors"
        });

        setTimeout(() => {
            location.reload();
        }, 1500);
    }


    // Function to sleep for a given number of milliseconds
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to check all observed products sequentially with a delay
    async function checkAllObservedProductsRegularly() {
        if (obserwowaneProdukty.length === 0) {
            setTimeout(checkAllObservedProductsRegularly, 2137);
            return;
        }

        // Iterate over each observed product
        for (const product of obserwowaneProdukty) {
            await checkAvailability(product);
            // Wait for 2 seconds before checking the next product
            await sleep(667);
        }

        // After checking all products, wait 5 seconds before starting again
        setTimeout(checkAllObservedProductsRegularly, 2137);
    }


    async function checkAvailability(product) {
        const apiUrl = `https://www.zalando-lounge.pl/api/phoenix/catalog/events/${product.event}/articles/${product.article}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const simpleWithSize = data.simples.find(item => item.filterValue === product.size && item.stockStatus === 'AVAILABLE');

            if (simpleWithSize) {
                const simpleSku = simpleWithSize.sku;

                // Remove the product from observed products
                const productIndex = obserwowaneProdukty.findIndex(p => p.id === product.id);
                if (productIndex > -1) {
                    obserwowaneProdukty.splice(productIndex, 1);
                    saveObservedProducts();
                    updateObservedList();

                    // Add the product to the cart
                    const cartResponse = await fetch("https://www.zalando-lounge.pl/api/phoenix/stockcart/cart/items", {
                        "credentials": "include",
                        "headers": {
                            "Accept": "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                            "client_type": "web",
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        "body": JSON.stringify({
                            "quantity": 1,
                            "simpleSku": simpleSku,
                            "campaignIdentifier": product.event,
                            "configSku": product.article,
                            "ignoreExceptionCodes": [506],
                            "additional": {
                                "reco": 0
                            }

                        }),
                        "method": "POST",
                        "mode": "cors"
                    }).then(response => response.json());

                    console.log("Produkt został dodany do koszyka:", cartResponse);
                }
            } else {
                console.log(`${product.nazwa} w rozmiarze ${product.size} nadal niedostępny.`);
            }
        } catch (error) {
            console.error(`Błąd podczas sprawdzania dostępności produktu ${product.nazwa}:`, error);
            // Optionally, handle specific HTTP status codes if needed
            if (error.message.includes('429')) {
                // Too Many Requests - wait longer before next check
                await sleep(3000);
            }
        }
    }

    function monitorTimerWithDocumentObserver() {
        // Funkcja sprawdzająca czas i odświeżająca stronę
        function checkTimeAndRefresh(timerElement, observer) {
            const timeText = timerElement.textContent.trim();
            const [minutes, seconds] = timeText.split(':').map(Number);

            if (minutes < 10 && seconds < 60) {
                console.log("Mniej niż minuta, odświeżam stronę...");
                odswiezKoszyk();
                observer.disconnect();
            }
        }

        // Obserwator na całym dokumencie
        const documentObserver = new MutationObserver((mutations, obs) => {
            const timerElement = document.querySelector('span[role="timer"]');
            if (timerElement) {
                console.log("Element <span role='timer'> został znaleziony.");
                obs.disconnect(); // Odłącz obserwator dokumentu

                // Ustawienie obserwatora na elemencie timer
                const timerObserver = new MutationObserver(() => {
                    checkTimeAndRefresh(timerElement, timerObserver);
                });

                timerObserver.observe(timerElement, { childList: true, characterData: true, subtree: true });

                // Pierwsze sprawdzenie od razu po znalezieniu elementu
                checkTimeAndRefresh(timerElement, timerObserver);
            }
        });

        // Rozpoczęcie obserwacji całego dokumentu
        documentObserver.observe(document.body, { childList: true, subtree: true });

        // Opcjonalne: szybkie sprawdzenie, czy element już istnieje
        const initialTimerElement = document.querySelector('span[role="timer"]');
        if (initialTimerElement) {
            console.log("Element <span role='timer'> został znaleziony.");
            documentObserver.disconnect();

            const timerObserver = new MutationObserver(() => {
                checkTimeAndRefresh(initialTimerElement, timerObserver);
            });

            timerObserver.observe(initialTimerElement, { childList: true, characterData: true, subtree: true });

            checkTimeAndRefresh(initialTimerElement, timerObserver);
        }
    }

    // Wywołanie funkcji monitorującej
    monitorTimerWithDocumentObserver();

})();
