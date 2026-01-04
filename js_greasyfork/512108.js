// ==UserScript==
// @name         Yandex CleanSearch
// @namespace    http://tampermonkey.net/
// @version      3.3.1
// @description  Блокировка страниц по домену и заголовкам, рекламы и прочего дерьма в яндекс.
// @author       Zzakhar
// @match        https://yandex.ru/search/*
// @match        ya.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license      CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/512108/Yandex%20CleanSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/512108/Yandex%20CleanSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';




    // auto redirect ya.ru/search to legit page
    function autoredirecttolegit() {
        if (window.location.hostname === "ya.ru" && window.location.pathname === "/search/") {
            const urlParams = new URLSearchParams(window.location.search);
            const text = urlParams.get('text');
            if (text) {
                window.location.href = `https://yandex.ru/search/?text=${text}`;
            }
        }
    }


    // Дб локал
    let blockedSites = JSON.parse(localStorage.getItem('blockedSites')) || [];
     function saveBlockedSites() {
        localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
    }

    let blockedPropagandaCount = 0;
    let blockedAdsCount = 0;
    let blockedPropaganda = [];
    let isHidden = true;
    const currentVersion = GM_info.script.version;


    // Update notification
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: versionCheckUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const newVersionMatch = response.responseText.match(/@version\s+([0-9]+\.[0-9]+\.[0-9]+)/);
                    if (newVersionMatch) {
                        const newVersion = newVersionMatch[1];
                        if (newVersion !== currentVersion) {
                            alert(`Доступно обновление: версия ${newVersion}.`);
                        } else {
                            console.log('У вас самая последняя версия скрипта.');
                        }
                    }
                } else {
                    console.error('Ошибка при проверке обновлений:', response.statusText);
                }
            }
        });
    }

    //перенес все в 1 функцию для блока дерьма и рекламы
    function blockContainers() {
        if (window.location.hostname === 'ya.ru') {
            const marketFeed = document.querySelector("body > main > div:nth-child(3) > div > div > noindex > div.market-feed");
            if (marketFeed) {
                marketFeed.style.display = 'none';
            }
        }
        else if (window.location.hostname.includes('yandex.ru') && window.location.pathname.includes('search')) {
            const containerToHide = document.querySelector("body > main > div > div.main__container > div > div > div.content__left > div.VanillaReact.RelatedBottom");
            if (containerToHide) {
                containerToHide.style.display = 'none';
                console.log("Рекомендации скрыты.");
            }

            const searchResultAside = document.querySelector('#search-result-aside');
            const rsyaGuarantee = searchResultAside ? searchResultAside.querySelector('#rsya-guarantee') : null;

            //rsya-guarantee
            if (rsyaGuarantee) {
                const serpList = searchResultAside.querySelector('div.serp-list');
                if (serpList) {
                    serpList.style.display = 'none';
                    console.log("Контейнер serp-list удален.");
                }
            }
        }
    }


    // remove shit from search bar

    //deb for no lags
    function debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // delete shit
    function removeBlockedSuggestions() {
        const suggestionList = document.querySelector('div.Root.Root_inited > div.HeaderDesktop > header > form > div.mini-suggest__popup.mini-suggest__popup_visible > ul.mini-suggest__popup-content');

        if (suggestionList) {
            const suggestionItems = suggestionList.querySelectorAll('li.mini-suggest__item');

            suggestionItems.forEach((item) => {
                const dataText = item.getAttribute('data-text');
                const anchor = item.querySelector('a.mini-suggest__item-link');
                let containsBlockedWord = false;
                let containsBlockedLink = false;
                if (dataText) {
                    containsBlockedWord = blockedSites.some(site => dataText.includes(site));
                }
                if (anchor) {
                    const href = anchor.href;
                    containsBlockedLink = blockedSites.some(site => href.includes(site));
                }
                const subtitleDiv = anchor?.querySelector('div.mini-suggest__item-content > div.mini-suggest__item-subtitle > span.mini-suggest__item-label'); // чтобы удалялась реклама из поиска
                if (subtitleDiv || containsBlockedWord || containsBlockedLink) {
                    //console.log("Удалено из поиска:", item.getAttribute('data-text'));
                    item.remove();
                }
            });
        }
    }


    // счетчик
    function updateBlockCounter() {
        const resultsContainer = document.querySelector('.main__center');
        let counterCard = resultsContainer.querySelector('.blocked-counter-card');

        if (!counterCard) {
            counterCard = document.createElement('div');
            counterCard.className = 'blocked-counter-card';
            counterCard.style.backgroundColor = '#300';
            counterCard.style.color = '#ffffff';
            counterCard.style.padding = '10px';
            counterCard.style.marginBottom = '10px';
            counterCard.style.border = '1px solid #600';
            counterCard.style.borderRadius = '5px';
            counterCard.style.maxWidth = '34%';
            counterCard.style.overflow = 'auto';
            resultsContainer.prepend(counterCard);
        }

        const counterText = `Заблокировано: ${blockedPropagandaCount} ненужного мусора и ${blockedAdsCount} рекламы`;
        let textElement = counterCard.querySelector('.counter-text');
        if (!textElement) {
            textElement = document.createElement('div');
            textElement.className = 'counter-text';
            counterCard.appendChild(textElement);
        }
        textElement.textContent = counterText;

        updateButtons(counterCard);
    }

    // смена кнопок
    function updateButtons(counterCard) {
        let showButton = counterCard.querySelector('.show-button');
        let removeButton = counterCard.querySelector('.remove-button');

        if (blockedPropagandaCount > 0 || blockedAdsCount > 0) {
            counterCard.style.display = 'flex';
            counterCard.style.justifyContent = 'space-between';
            counterCard.style.alignItems = 'center';

            if (isHidden) {
                if (!showButton) {
                    showButton = document.createElement('button');
                    showButton.className = 'show-button';
                    showButton.textContent = 'Показать';
                    showButton.style.backgroundColor = '#007bff';
                    showButton.style.color = '#ffffff';
                    showButton.style.border = 'none';
                    showButton.style.borderRadius = '5px';
                    showButton.style.padding = '5px 10px';
                    showButton.style.cursor = 'pointer';
                    showButton.style.marginLeft = '10px';
                    showButton.onclick = showBlockedPropaganda;

                    counterCard.appendChild(showButton);
                }

                if (removeButton) {
                    removeButton.remove();
                }
            } else {
                if (!removeButton) {
                    removeButton = document.createElement('button');
                    removeButton.className = 'remove-button';
                    removeButton.textContent = 'Убрать';
                    removeButton.style.backgroundColor = '#dc3545';
                    removeButton.style.color = '#ffffff';
                    removeButton.style.border = 'none';
                    removeButton.style.borderRadius = '5px';
                    removeButton.style.padding = '5px 10px';
                    removeButton.style.cursor = 'pointer';
                    removeButton.style.marginLeft = '10px';
                    removeButton.onclick = hideBlockedPropaganda;

                    counterCard.appendChild(removeButton);
                }

                if (showButton) {
                    showButton.remove();
                }
            }
        } else {
            if (showButton) {
                showButton.remove();
            }
            if (removeButton) {
                removeButton.remove();
            }
        }
    }

    // Мейн функция поиска
    function blockLinksAndAds() {
        const results = document.querySelectorAll('.serp-item');

        blockedPropagandaCount = 0;
        blockedAdsCount = 0;
        blockedPropaganda = [];

        results.forEach(result => {
            const isAd = checkIfAd(result);
            const link = result.querySelector('a.Link');
            const title = result.querySelector('.OrganicTitle-LinkText');

            if (link && title) {
                const href = link.href.toLowerCase();
                const titleText = title.textContent.toLowerCase();

                const isBlocked = blockedSites.some(site => href.includes(site) || titleText.includes(site));

                if (isAd) {
                    result.style.display = 'none';
                    blockedAdsCount++;
                } else if (isBlocked) {
                    result.style.display = 'none';
                    blockedPropagandaCount++;
                    blockedPropaganda.push(result);
                    console.log("Заблокирована дичь: ", result);
                }
            }
        });

        updateBlockCounter();
    }

    //проверка на рекламу, пофикшено 3.3
    function checkIfAd(result) {
        const adTextIndicators = ['реклама', 'баннер', 'advertise'];

        // Проверяем первый селектор для текущей версии
        const currentVersionTarget = result.querySelector(':scope > div > span');
        if (currentVersionTarget) {
            if (adTextIndicators.some(text => currentVersionTarget.textContent.toLowerCase().includes(text))) {
                return true; // Реклама найдена в текущей версии
            }
        }

        // Проверяем второй селектор для старой версии
        const oldVersionTarget = result.querySelector('div > div.Organic-ContentWrapper.organiccontent-wrapper > div.TextContainer.OrganicText.organictext.text-container.Typo.Typo_text_m.Typo_line_m > span > span');
        if (oldVersionTarget) {
            if (adTextIndicators.some(text => oldVersionTarget.textContent.toLowerCase().includes(text))) {
                return true; // Реклама найдена в старой версии
            }
        }

        return false; // Реклама не найдена
    }

    // Показать бтн
    function showBlockedPropaganda() {
        console.log("Показать");
        if (isHidden) {
            blockedPropaganda.forEach(prop => {
                prop.style.display = 'block';
            });
            isHidden = false;
            updateButtons(document.querySelector('.blocked-counter-card'));
        }
    }

    // Скрыть бтн
    function hideBlockedPropaganda() {
        console.log("Убрать");
        if (!isHidden) {
            blockedPropaganda.forEach(prop => {
                prop.style.display = 'none';
            });
            isHidden = true;
            updateButtons(document.querySelector('.blocked-counter-card'));
        }
    }





    // настройки


    function updateBlockedSitesList() {
        const list = document.getElementById('blockedSitesList');
        if (list){
            list.innerHTML = '';
            blockedSites.forEach(site => {
                const li = document.createElement('li');
                li.textContent = site;
                list.appendChild(li);
            });
        }
    }

    function resetBlockedSites() {
        blockedSites.length = 0;
        saveBlockedSites();
        updateBlockedSitesList();
        setTimeout(() => {
            location.reload(); // релоад
        }, 2000);
        showNotification('Все заблокированные сайты были очищены.');
    }

    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'custom-popup';

        // тёмная тема или нет
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isDarkMode = darkModeMediaQuery.matches;

        // Применяем стили для темной или светлой темы
        popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        padding: 20px;
        z-index: 9999;
        display: none;
        width: 300px;
        max-width: 90%;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        ${isDarkMode ? `
            background-color: #0e1011;
            border: 2px solid #970e05; /* Красная рамка */
            box-shadow: 0 0 15px #4c0803, 0 0 30px #8b0903; /* Красное свечение */
            color: white;
        ` : `
            background-color: #f9f9f9;
            border: 2px solid #007BFF; /* Синяя рамка */
            box-shadow: 0 0 15px #007BFF, 0 0 30px #00A3FF; /* Синее свечение */
            color: black;
        `}
    `;

        // Определяем содержимое попапа в зависимости от текущего URL
        const currentUrl = window.location.href;
        if (currentUrl.includes('yandex.ru/search')) {
            popup.innerHTML = `
            <h3>Yandex CleanSearch</h3>
            <input type="text" id="siteInput" placeholder="Домен или заголовок (Например: rutube.ru)"
                   style="
                       width: 90%;
                       padding: 10px;
                       margin-bottom: 10px;
                       border: 2px solid ${isDarkMode ? '#970e05' : '#007BFF'};
                       background-color: ${isDarkMode ? '#0e1011' : 'white'};
                       color: ${isDarkMode ? 'white' : 'black'};
                       border-radius: 10px;
                       outline: none;
                       transition: border-color 0.3s ease, box-shadow 0.3s ease;
                   ">
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;">
                <button id="blockSiteBtn" style="
                    background-color: red;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s ease;">Заблокировать</button>
                <button id="unblockSiteBtn" style="
                    background-color: green;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s ease;">Разблокировать</button>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h4 style="margin: 0;">Заблокированные сайты:</h4>
                <button id="resetBtn" style="
                    background-color: orange;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background-color 0.3s ease;">Сбросить</button>
            </div>
            <ul id="blockedSitesList" style="max-height: 80px; overflow-y: auto;"></ul>
            <span id="closePopupBtn" style="
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;">&times;</span>
        `;
        } else if (currentUrl.includes('ya.ru')) {
            popup.innerHTML = `
            <div class="popup-container">
    <h3>Yandex CleanSearch</h3>
    <p>
        Скрипт был создан для TamperMonkey и написан для Javascript пользователем zzakhar. <br>
        Для использования скрипта начните поиск и введите запрос.
    </p>
    <p>
        Через несколько мгновений на странице поиска в левом верхнем углу появится иконка расширения. Нажмите на неё
        и начните конфигурацию. Вы можете блокировать как домены, так и ключевые слова.
    </p>
    <p>Спасибо за использование!</p>
    <span id="closePopupBtn" style="
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;">
        &times;
    </span>
</div>
        `;
        }
        document.body.appendChild(popup);
        if (currentUrl.includes('yandex.ru/search')) {
            document.getElementById('blockSiteBtn').addEventListener('click', blockSite);
            document.getElementById('unblockSiteBtn').addEventListener('click', unblockSite);
            document.getElementById('resetBtn').addEventListener('click', resetBlockedSites);
        }
        document.getElementById('closePopupBtn').addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }


    function showPopup() {
        const popup = document.querySelector('.custom-popup');
        popup.style.display = 'block';
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1.05)'; // анимация
        updateBlockedSitesList();
    }

   function showNotification(message) {
       const notification = document.createElement('div');
       notification.className = 'notification';
       notification.innerText = message;
       notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50; /* Зеленый цвет для успешного уведомления */
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.5s, transform 0.5s;
    `;

       document.body.appendChild(notification);
       setTimeout(() => {
           notification.style.opacity = '1';
           notification.style.transform = 'translateY(0)';
       }, 100);
       setTimeout(() => {
           notification.style.opacity = '0';
           notification.style.transform = 'translateY(-20px)';
           setTimeout(() => {
               document.body.removeChild(notification);
           }, 500);
       }, 3000);
   }

    function blockSite() {
        const site = document.getElementById('siteInput').value.toLowerCase();
        if (site && !blockedSites.includes(site)) {
            blockedSites.push(site);
            saveBlockedSites();
            updateBlockedSitesList();
            showNotification(`${site} has been blocked.`);
        } else {
            showNotification('Site is already blocked or input is empty.');
        }
    }

    function unblockSite() {
        const site = document.getElementById('siteInput').value.toLowerCase();
        const index = blockedSites.indexOf(site);
        if (index !== -1) {
            blockedSites.splice(index, 1);
            saveBlockedSites();
            showNotification(`${site} has been unblocked.`);
            updateBlockedSitesList()
            setTimeout(() => {
            location.reload();
            }, 2000);
        } else {
            showNotification('Site not found in blocked list.');
        }
    }

    function getHeaderLogo() {
        let headerLogo = document.querySelector('header.HeaderDesktop-Main .HeaderLogo');
        if (!headerLogo) {
            headerLogo = document.querySelector('main.body__wrapper .headline');//for ya.ru
        }
        return headerLogo;
    }

    // иконка для настроек
    function createIcon() {
        const headerLogo = getHeaderLogo();

        if (!headerLogo) {
            console.error('Логотип не найден');
            return;
        }

        headerLogo.removeAttribute('href'); // rem href
        headerLogo.style.cursor = 'default';

        const icon = document.createElement('img');
        icon.className = 'custom-icon';
        icon.src = 'https://avatars.mds.yandex.net/i?id=6a46c4318776cd395ef17ab922147471976ebe7d-3569718-images-thumbs&n=13';
        icon.id = 'YandexCleanSearch'; // ID
        icon.alt = 'FREEINTERNET';

        if (window.location.hostname === 'ya.ru') { // для ya.ru т.к. там надо чуть больше короче и чуть правее
            icon.style.cssText = `
            width: 2.2rem;
            height: 2.2rem;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            left: 30px; /* Смещение для ya.ru */
            vertical-align: middle;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        } else {
            icon.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            left: 25px;
            vertical-align: middle;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        }
        headerLogo.insertBefore(icon,headerLogo.children[1])
        //headerLogo.appendChild(icon); - prev vers
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, 50);

        icon.addEventListener('click', showPopup);
    }
    function removeDuplicateIcon() {
        const elements = document.querySelectorAll('#YandexCleanSearch');
        if (elements.length > 1) {
            for (let i = 1; i < elements.length; i++) {
                elements[i].remove();
            }
            console.log("Лишние элементы #YandexCleanSearch были удалены.");
        }
    }


    window.addEventListener('load', function() {
        createPopup();
        createIcon();
        autoredirecttolegit()
        console.log("Создана иконка и заблокирована реклама(в контейнерах)");
    });


        //основной цикл
    const observer = new MutationObserver(() => {
        if (window.location.hostname !== 'ya.ru') { // NO YA.RU SHIT
            if (isHidden) {
                blockLinksAndAds();
            }
            // icon 2-ule check
            const suggestionPopup = document.querySelector('div.Root.Root_inited > div.HeaderDesktop > header > form > div.mini-suggest__popup');
            if (suggestionPopup && suggestionPopup.classList.contains('mini-suggest__popup_visible')) {
                removeBlockedSuggestions();
            }
            setTimeout(() => {
                const secondCheckIcon = document.querySelector('#YandexCleanSearch');
                if (!secondCheckIcon) {
                    createIcon();
                }
            }, 500);
            removeDuplicateIcon()
        } else {
                const marketFeed = document.querySelector("body > main > div:nth-child(3) > div > div > noindex > div");
                if (marketFeed) {
                    blockContainers()
                    console.log("market-feed удален.");
                }
            }

        });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('Yandex ClearSearch v',currentVersion,' launched');
})();
