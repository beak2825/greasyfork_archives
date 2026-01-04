// ==UserScript==
// @name         Game Search Hub - Multi-Site Game Finder
// @name:ru      Game Search Hub - Поиск игр на множестве сайтов
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Advanced game search tool with beautiful dark UI. Search across 40+ gaming sites, torrent trackers, and repack sources from Steam and SteamDB pages.
// @description:ru Продвинутый инструмент поиска игр с красивым темным интерфейсом. Поиск по 40+ игровым сайтам, торрент-трекерам и источникам репаков со страниц Steam и SteamDB.
// @author       Wkeynhk
// @match        https://store.steampowered.com/app/*
// @match        https://steamdb.info/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzAwMDAwMCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjZjMGY0IiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTE0IDE0TDIwIDIwTTIwIDE0TDE0IDIwIiBzdHJva2U9IiM2NmMwZjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMCAxMGw0IDQgNCA0IiBzdHJva2U9IiM2NmMwZjQiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTE4IDE4bDQgNCA0IDQiIHN0cm9rZT0iIzY2YzBmNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K
// @downloadURL https://update.greasyfork.org/scripts/547348/Game%20Search%20Hub%20-%20Multi-Site%20Game%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/547348/Game%20Search%20Hub%20-%20Multi-Site%20Game%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 Game Search Hub v1.01 started!");
    console.log("📍 Current page:", window.location.href);
    console.log("🔍 Looking for game elements...");

    // Показываем доступные элементы для отладки
    setTimeout(() => {
        console.log("📊 Available elements for button insertion:");
        const selectors = [
            '.apphub_OtherSiteInfo',
            '.game_area_purchase_game',
            '#game_area_purchase',
            '.game_area_description',
            '.game_purchase_action_bg',
            '.apphub_AppName',
            '#appHubAppName'
        ];

        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ ${selector}:`, element.tagName, element.className || element.id);
            } else {
                console.log(`❌ ${selector}: not found`);
            }
        });
    }, 1000);

    // Получаем имя игры с поддержкой английских названий
    function getGameName() {
        const url = window.location.href;
        let gameName = '';

        if (url.includes('store.steampowered.com')) {
            const appNameElement = document.getElementById('appHubAppName');
            if (appNameElement) {
                gameName = appNameElement.textContent.trim();
            }
        } else if (url.includes('steamdb.info')) {
            const h1Element = document.querySelector('h1');
            if (h1Element) {
                gameName = h1Element.textContent.trim();
            }
        }

        console.log("🎮 Game name found:", gameName || "Not found");
        return gameName;
    }

    // Получаем английское название игры через Steam API
    function getEnglishGameName(appId, callback) {
        if (!appId) {
            callback(getGameName());
            return;
        }

        // Пробуем Steam API
        const steamApiUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
        
        GM_xmlhttpRequest({
            method: "GET",
            url: steamApiUrl,
            onerror: function(error) {
                console.log("❌ Error fetching Steam API data:", error);
                // Пробуем простой перевод известных игр
                trySimpleTranslation(callback);
            },
            onload: function(response) {
                try {
                    if (response.status !== 200) {
                        console.log("❌ Steam API returned status:", response.status);
                        trySimpleTranslation(callback);
                        return;
                    }

                    const data = JSON.parse(response.responseText);
                    if (data && data[appId] && data[appId].success && data[appId].data) {
                        const englishName = data[appId].data.name;
                        if (englishName) {
                            console.log("🌍 English game name from Steam API:", englishName);
                            callback(englishName);
                            return;
                        }
                    }
                    
                    // Если Steam API не дал результат, пробуем простой перевод
                    trySimpleTranslation(callback);
                    
                } catch (error) {
                    console.log("❌ Error parsing Steam API response:", error);
                    trySimpleTranslation(callback);
                }
            }
        });
    }



    // Простой перевод известных русских названий игр
    function trySimpleTranslation(callback) {
        const gameName = getGameName();
        
        // Словарь известных переводов
        const translations = {
            'Одни из нас': 'The Last of Us',
            'Одни из нас™: Часть I': 'The Last of Us Part I',
            'Одни из нас™: Часть II': 'The Last of Us Part II',
            'Красный Мертвец': 'Red Dead Redemption',
            'Красный Мертвец 2': 'Red Dead Redemption 2',
            'Гранд Тефт Авто': 'Grand Theft Auto',
            'ГТА': 'GTA',
            'Скайрим': 'Skyrim',
            'Ведьмак': 'The Witcher',
            'Ведьмак 3': 'The Witcher 3',
            'Киберпанк': 'Cyberpunk',
            'Киберпанк 2077': 'Cyberpunk 2077',
            'Фоллаут': 'Fallout',
            'Фоллаут 4': 'Fallout 4',
            'Фоллаут 76': 'Fallout 76',
            'Масс Эффект': 'Mass Effect',
            'Драгон Эйдж': 'Dragon Age',
            'Биошок': 'BioShock',
            'Бордерлендс': 'Borderlands',
            'Ассасинс Крид': 'Assassin\'s Creed',
            'Фар Край': 'Far Cry',
            'Хитман': 'Hitman',
            'Томб Райдер': 'Tomb Raider',
            'Резедент Ивил': 'Resident Evil',
            'Дэд Спейс': 'Dead Space',
            'Метро': 'Metro',
            'Сталкер': 'STALKER',
            'Кал оф Дьюти': 'Call of Duty',
            'Батлфилд': 'Battlefield',
            'ФИФА': 'FIFA',
            'ПЕС': 'PES',
            'Дота': 'Dota',
            'Дота 2': 'Dota 2',
            'Лига Легенд': 'League of Legends',
            'Контр-Страйк': 'Counter-Strike',
            'Контр-Страйк 2': 'Counter-Strike 2',
            'Хартстоун': 'Hearthstone',
            'Ворлд оф Варкрафт': 'World of Warcraft',
            'ВОВ': 'WoW',
            'Овервотч': 'Overwatch',
            'Херос оф зе Сторм': 'Heroes of the Storm',
            'ХоТС': 'HotS',
            'Хартстоун': 'Hearthstone',
            'Херос оф зе Сторм': 'Heroes of the Storm'
        };

        // Ищем точное совпадение
        if (translations[gameName]) {
            const translatedName = translations[gameName];
            console.log("🌍 Translated game name:", translatedName);
            callback(translatedName);
            return;
        }

        // Ищем частичное совпадение
        for (const [russian, english] of Object.entries(translations)) {
            if (gameName.includes(russian)) {
                const translatedName = gameName.replace(russian, english);
                console.log("🌍 Partially translated game name:", translatedName);
                callback(translatedName);
                return;
            }
        }

        // Если перевод не найден, используем оригинальное название
        console.log("🔄 No translation found, using original name:", gameName);
        callback(gameName);
    }

    // Очищаем название игры от символов ™ и других
    function cleanGameName(gameName) {
        if (!gameName) return gameName;
        
        // Проверяем настройку удаления ™
        const removeTrademark = localStorage.getItem('gameSearch_removeTrademark') !== 'false'; // По умолчанию включено
        
        let cleanedName = gameName;
        
        if (removeTrademark) {
            // Удаляем ™, ®, © и другие торговые марки
            cleanedName = cleanedName.replace(/[™®©]/g, '').trim();
        }
        
        // Удаляем лишние пробелы
        cleanedName = cleanedName.replace(/\s+/g, ' ').trim();
        
        if (cleanedName !== gameName) {
            console.log(`🧹 Cleaned game name: "${gameName}" → "${cleanedName}"`);
        }
        
        return cleanedName;
    }

    // Создаем кнопку точно как в CS.RIN.RU Enhanced
    function createMenuButton() {
        const menuButton = document.createElement('a');
        const spanElement = document.createElement('span');
        const imgElement = document.createElement('img');

        imgElement.className = 'ico16';
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI2LjUiIGN5PSI2LjUiIHI9IjMiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJtMTAgMTAgMy41IDMuNSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
        spanElement.appendChild(imgElement);

        // Стиль кнопки точно как в CS.RIN.RU Enhanced для Steam
        menuButton.className = 'btnv6_blue_hoverfade btn_medium';
        menuButton.style.marginRight = '0.28em';
        spanElement.dataset.tooltipText = 'Поиск игр на различных сайтах';

        menuButton.appendChild(spanElement);
        menuButton.style.cursor = 'pointer';

        // Создаем модальное меню по центру экрана
        const modal = document.createElement('div');
        modal.id = 'game-search-modal';
        modal.style.display = 'none';

        // Оверлей для закрытия
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        const dropdownMenu = document.createElement('div');
        dropdownMenu.id = 'game-search-menu';

        // Заголовок с кнопками
        const header = document.createElement('div');
        header.className = 'menu-header';
        header.innerHTML = `
            <div class="header-left">
                <button class="settings-button" type="button" title="Настройки">⚙️ Настройки</button>
            </div>
        `;
        
        // Контент меню
        const menuContentDiv = document.createElement('div');
        menuContentDiv.className = 'menu-content';
        
        // Основной вид
        const mainView = document.createElement('div');
        mainView.className = 'main-view';
        
        // Вид настроек
        const settingsView = document.createElement('div');
        settingsView.className = 'settings-view';
        
        menuContentDiv.appendChild(mainView);
        menuContentDiv.appendChild(settingsView);
        dropdownMenu.appendChild(header);
        dropdownMenu.appendChild(menuContentDiv);
        modal.appendChild(dropdownMenu);

        // Добавляем глобальные стили для меню в темной теме
        const globalStyles = `
            <style id="game-search-styles">
                #game-search-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                                 #game-search-menu {
                     background: linear-gradient(145deg, #000000 0%, #111111 100%);
                     border: 2px solid #333333;
                     border-radius: 12px;
                     box-shadow: 
                         0 20px 40px rgba(0, 0, 0, 0.8),
                         0 0 0 1px rgba(255, 255, 255, 0.1);
                     width: 60vw;
                     max-width: 700px;
                     max-height: 75vh;
                     overflow: hidden;
                     position: relative;
                 }
                                 .menu-header {
                     background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                     border-bottom: 2px solid #444444;
                     padding: 15px 20px;
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     position: relative;
                 }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                    color: #dc3545;
                    font-size: 18px;
                    font-weight: bold;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .close-button:hover {
                    background: rgba(220, 53, 69, 0.2);
                    border-color: #dc3545;
                    transform: scale(1.1);
                }
                .header-left {
                    display: flex;
                    align-items: center;
                }
                                 .settings-button {
                     background: rgba(255, 255, 255, 0.1);
                     border: 1px solid rgba(255, 255, 255, 0.3);
                     color: #ffffff;
                     padding: 8px 15px;
                     border-radius: 6px;
                     cursor: pointer;
                     font-size: 14px;
                     transition: all 0.3s ease;
                 }
                .settings-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: #ffffff;
                    transform: translateY(-1px);
                }
                                 .menu-content {
                     padding: 20px 25px;
                     max-height: calc(85vh - 80px);
                     overflow-y: auto;
                 }
                .menu-content::-webkit-scrollbar {
                    width: 8px;
                }
                .menu-content::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-radius: 4px;
                }
                .menu-content::-webkit-scrollbar-thumb {
                    background: #333333;
                    border-radius: 4px;
                }
                .menu-content::-webkit-scrollbar-thumb:hover {
                    background: #555555;
                }
                                 .buttons-grid {
                     display: grid;
                     grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                     gap: 8px;
                     margin-bottom: 15px;
                 }
                                 .site-button {
                     background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                     border: 1px solid #333333;
                     color: #ffffff;
                     text-decoration: none;
                     padding: 8px 10px;
                     border-radius: 6px;
                     text-align: center;
                     font-weight: 500;
                     font-size: 11px;
                     min-height: 35px;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     transition: all 0.3s ease;
                     position: relative;
                     overflow: hidden;
                 }
                .site-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.6s ease;
                }
                .site-button:hover::before {
                    left: 100%;
                }
                .site-button:hover {
                    background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
                    color: #ffffff;
                    border-color: #555555;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                }
                #game-search-menu .site-button img {
                    width: 48px;
                    height: 24px;
                    object-fit: contain;
                    margin-bottom: 8px;
                    border-radius: 4px;
                    background: rgba(0,0,0,0.3);
                    padding: 2px;
                }
                                 #game-search-menu .site-button span {
                     display: block;
                     font-size: 11px;
                     line-height: 1.2;
                     text-align: center;
                     word-wrap: break-word;
                 }
                                 .section-title {
                     color: #ffffff;
                     font-weight: 600;
                     font-size: 14px;
                     text-transform: uppercase;
                     margin: 20px 0 15px 0;
                     padding: 8px 15px;
                     background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
                     border: 1px solid #444444;
                     border-radius: 8px;
                     letter-spacing: 0.5px;
                     text-align: center;
                     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                 }
                .section-title:first-child {
                    margin-top: 0;
                }
                .settings-view {
                    display: none;
                }
                .settings-view.active {
                    display: block;
                }
                .main-view.hidden {
                    display: none;
                }
                .setting-group {
                    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                    border: 2px solid #333333;
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 20px;
                    box-shadow: 
                        0 6px 20px rgba(0, 0, 0, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                .setting-group h4 {
                    color: #ffffff;
                    font-size: 18px;
                    margin: 0 0 20px 0;
                    font-weight: 700;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                .setting-item {
                    margin-bottom: 16px;
                }
                .setting-label {
                    display: flex;
                    align-items: center;
                    color: #cccccc;
                    font-size: 15px;
                    cursor: pointer;
                    padding: 10px 0;
                    transition: color 0.2s ease;
                    font-weight: 500;
                }
                .setting-label:hover {
                    color: #ffffff;
                }
                .setting-label input[type="checkbox"] {
                    margin-right: 15px;
                    width: 18px;
                    height: 18px;
                    accent-color: #ffffff;
                }
                .setting-description {
                    color: #999999;
                    font-size: 13px;
                    margin-top: 6px;
                    padding-left: 33px;
                    line-height: 1.5;
                }
                .sources-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 15px;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    border-radius: 10px;
                    border: 2px solid #333333;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
                }
                .source-checkbox {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid #333333;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }
                .source-checkbox:hover {
                    background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
                    border-color: #555555;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                }
                .source-checkbox input {
                    margin-right: 12px;
                    width: 16px;
                    height: 16px;
                    accent-color: #ffffff;
                }
                .source-name {
                    font-size: 14px;
                    color: #ffffff;
                    font-weight: 600;
                }
                .back-button {
                    background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
                    border: 2px solid #444444;
                    color: #ffffff;
                    padding: 12px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                }
                .back-button:hover {
                    background: linear-gradient(135deg, #333333 0%, #555555 100%);
                    border-color: #666666;
                    transform: translateX(-3px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
                }
                #game-search-menu .loading {
                    color: #8f98a0;
                    font-style: italic;
                    padding: 40px;
                    text-align: center;
                    font-size: 16px;
                }
                #game-search-menu .game-title {
                    color: #ffffff;
                    font-size: 18px;
                    margin-bottom: 10px;
                    text-align: center;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                }
                #game-search-menu .game-tags {
                    text-align: center;
                    margin-bottom: 20px;
                }
                #game-search-menu .tag {
                    display: inline-block;
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    margin: 0 3px;
                    font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                #game-search-menu .settings-section {
                    margin: 25px;
                    padding-top: 15px;
                    border-top: 1px solid #4d4d4d;
                }
                #game-search-menu .settings-title {
                    color: #66c0f4;
                    font-weight: bold;
                    font-size: 14px;
                    text-transform: uppercase;
                    margin-bottom: 15px;
                    text-align: center;
                }
                #game-search-menu .setting-item {
                    margin-bottom: 15px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                #game-search-menu .setting-label {
                    display: flex;
                    align-items: center;
                    color: #c7d5e0;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 5px;
                }
                #game-search-menu .setting-label input[type="checkbox"] {
                    margin-right: 8px;
                    transform: scale(1.2);
                    cursor: pointer;
                }
                #game-search-menu .setting-description {
                    color: #8f98a0;
                    font-size: 11px;
                    line-height: 1.4;
                    margin-left: 20px;
                }
                #game-search-menu .site-button.loading {
                    animation: loadingPulse 1.5s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes loadingPulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }

                #game-search-menu .game-info {
                    text-align: center;
                    padding: 0 25px 20px;
                    border-bottom: 1px solid #4d4d4d;
                    margin-bottom: 20px;
                }
            </style>
        `;

        if (!document.getElementById('game-search-styles')) {
            document.head.insertAdjacentHTML('beforeend', globalStyles);
        }



        // Контейнер для содержимого меню
        const menuContentContainer = document.createElement('div');
        menuContentContainer.id = 'menu-content';
        dropdownMenu.appendChild(menuContentContainer);

        // Добавляем обработчик клика для кнопки
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔍 Game Search Hub: Menu button clicked!');

            const modalElement = document.getElementById('game-search-modal');
            if (modalElement) {
                modalElement.style.display = 'flex';
                console.log('✅ Game Search Hub: Modal opened instantly');

                // Создаем содержимое меню при каждом клике
                console.log('📄 Game Search Hub: Creating menu content...');
                createMenuContent();
                setupMenuHandlers();
            } else {
                console.error('❌ Game Search Hub: Modal element not found!');
            }
        });

        return { button: menuButton, modal: modal };
    }

            // Настройка обработчиков меню
        function setupMenuHandlers() {
            setTimeout(() => {
                const settingsButton = document.querySelector('.settings-button');
                
                if (settingsButton) {
                    settingsButton.addEventListener('click', function() {
                        console.log('⚙️ Settings button clicked');
                        showSettings();
                    });
                }
            }, 100);
        }

    // Показать настройки
    function showSettings() {
        const mainView = document.querySelector('.main-view');
        const settingsView = document.querySelector('.settings-view');
        
        if (mainView && settingsView) {
            mainView.classList.add('hidden');
            settingsView.classList.add('active');
            
            // Создаем содержимое настроек
            createSettingsContent();
        }
    }

    // Показать основное меню
    function showMainMenu() {
        const mainView = document.querySelector('.main-view');
        const settingsView = document.querySelector('.settings-view');
        
        if (mainView && settingsView) {
            mainView.classList.remove('hidden');
            settingsView.classList.remove('active');
        }
    }

    // Создать содержимое настроек
    function createSettingsContent() {
        const settingsView = document.querySelector('.settings-view');
        if (!settingsView) return;

        const removeEditions = localStorage.getItem('gameSearch_removeEditions') === 'true';
        const disabledSites = JSON.parse(localStorage.getItem('gameSearch_disabledSites') || '[]');
        const removeTrademark = localStorage.getItem('gameSearch_removeTrademark') !== 'false';
        const directToGame = localStorage.getItem('gameSearch_directToGame') === 'true';
        const searchById = localStorage.getItem('gameSearch_searchById') === 'true';
        
        // Получаем все сайты для настроек
        const allSites = getAllSites();
        
        settingsView.innerHTML = `
            <button class="back-button">← Назад к поиску</button>
            
            <div class="setting-group">
                <h4>🎮 Обработка названий игр</h4>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" id="removeEditions" ${removeEditions ? 'checked' : ''}> 
                        Упростить названия игр (убрать издания)
                    </label>
                    <div class="setting-description">
                        Автоматически убирает "Special Edition", "Deluxe Edition" и т.д. из названий игр при поиске
                    </div>
                </div>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" id="removeTrademark" ${removeTrademark ? 'checked' : ''}> 
                        Удалить символ ™ из названий игр
                    </label>
                    <div class="setting-description">
                        Удаляет символ торговой марки (™) из названий игр при поиске.
                    </div>
                </div>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" id="directToGame" ${directToGame ? 'checked' : ''}> 
                        Прямой переход на страницу игры (SteamGG)
                    </label>
                    <div class="setting-description">
                        Автоматически переходит на первый результат поиска вместо страницы поиска.
                    </div>
                </div>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" id="searchById" ${searchById ? 'checked' : ''}> 
                        Поиск по ID игры (SteamGG)
                    </label>
                    <div class="setting-description">
                        Использует ID игры вместо названия для поиска на SteamGG.
                    </div>
                </div>
            </div>
            
            <div class="setting-group">
                <h4>🔧 Управление источниками</h4>
                <div class="setting-description" style="margin-bottom: 12px; padding-left: 0;">
                    Выберите источники, которые будут отображаться в меню поиска:
                </div>
                <div class="sources-grid">
                    ${allSites.map(site => `
                        <label class="source-checkbox">
                            <input type="checkbox" class="site-toggle" data-site-id="${site.id}" ${!disabledSites.includes(site.id) ? 'checked' : ''}> 
                            <span class="source-name">${site.name}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Настройка обработчиков настроек
        setupSettingsHandlers();
    }

    // Настройка обработчиков настроек
    function setupSettingsHandlers() {
        setTimeout(() => {
            // Кнопка "Назад"
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', showMainMenu);
            }

            // Чекбокс упрощения названий
            const removeEditionsCheckbox = document.getElementById('removeEditions');
            if (removeEditionsCheckbox) {
                removeEditionsCheckbox.addEventListener('change', function() {
                    localStorage.setItem('gameSearch_removeEditions', this.checked);
                    console.log('📝 Setting saved: Remove editions =', this.checked);
                });
            }

            // Чекбокс удаления ™
            const removeTrademarkCheckbox = document.getElementById('removeTrademark');
            if (removeTrademarkCheckbox) {
                removeTrademarkCheckbox.addEventListener('change', function() {
                    localStorage.setItem('gameSearch_removeTrademark', this.checked);
                    console.log('📝 Setting saved: Remove trademark =', this.checked);
                });
            }

            // Чекбокс прямого перехода на игру
            const directToGameCheckbox = document.getElementById('directToGame');
            if (directToGameCheckbox) {
                directToGameCheckbox.addEventListener('change', function() {
                    localStorage.setItem('gameSearch_directToGame', this.checked);
                    console.log('📝 Setting saved: Direct to game =', this.checked);
                });
            }

            // Чекбокс поиска по ID
            const searchByIdCheckbox = document.getElementById('searchById');
            if (searchByIdCheckbox) {
                searchByIdCheckbox.addEventListener('change', function() {
                    localStorage.setItem('gameSearch_searchById', this.checked);
                    console.log('📝 Setting saved: Search by ID =', this.checked);
                });
            }

            // Переключатели источников
            const siteToggles = document.querySelectorAll('.site-toggle');
            siteToggles.forEach(toggle => {
                toggle.addEventListener('change', function() {
                    const siteId = this.getAttribute('data-site-id');
                    let disabledSites = JSON.parse(localStorage.getItem('gameSearch_disabledSites') || '[]');
                    
                    if (this.checked) {
                        disabledSites = disabledSites.filter(id => id !== siteId);
                    } else {
                        if (!disabledSites.includes(siteId)) {
                            disabledSites.push(siteId);
                        }
                    }
                    
                    localStorage.setItem('gameSearch_disabledSites', JSON.stringify(disabledSites));
                    console.log('🔧 Site toggles updated:', disabledSites);
                });
            });
        }, 100);
    }

    // Получить все сайты для настроек
    function getAllSites() {
        const gameName = getGameName() || 'Test Game';
        const originalGameName = gameName;
        const lowerGameName = originalGameName.toLowerCase();
        const appId = getAppIdFromUrl(window.location.href);

        return [
            // Торрент-трекеры
            { name: 'Rutracker', id: 'rutracker' },
            { name: 'Rutor', id: 'rutor' },
            { name: 'Rustorka', id: 'rustorka' },
            { name: 'Tapochek', id: 'tapochek' },
            { name: '1337x', id: '1337x' },
            { name: 'PiratBit', id: 'piratbit' },
            { name: 'Pirate Bay', id: 'piratebay' },

            // Релиз-группы
            { name: 'Skidrow', id: 'skidrow' },
            { name: 'FitGirl', id: 'fitgirl' },
            { name: 'SteamRIP', id: 'steamrip' },
            { name: 'Dodi', id: 'dodi' },
            { name: 'Gload', id: 'gload' },
            { name: 'OVA Games', id: 'ovagames' },
            { name: 'Torrminatorr', id: 'torrminatorr' },
            { name: 'FreeTP', id: 'freetp' },
            { name: 'AnkerGames', id: 'ankergames' },
            { name: 'GameBounty', id: 'gamebounty' },
            { name: 'UnionCrax', id: 'unioncrax' },
            { name: 'G4U', id: 'g4u' },
            { name: 'Gamesdrive', id: 'gamesdrive' },
            { name: 'SteamGG', id: 'steamgg' },
            { name: 'Appnetica', id: 'appnetica' },
            { name: 'AtopGames', id: 'atopgames' },
            { name: 'ElEnemigos', id: 'elenemigos' },
            { name: 'Reloaded Steam', id: 'reloadedsteam' },
            { name: 'RexaGames', id: 'rexagames' },
            { name: 'TriahGames', id: 'triahgames' },
            { name: 'GetFreeGames', id: 'getfreegames' },
            { name: 'Games4U', id: 'games4u' },
                         { name: 'Stevv Game', id: 'stevvgame' },
             { name: 'Xatab Repacks', id: 'xatab' },
             { name: 'Elamigos', id: 'elamigos' },
             { name: 'FluxyRepacks', id: 'fluxyrepacks' },
             { name: 'RepackGames', id: 'repackgames' },

            // Статус игр и крэки
            { name: 'GameStatus', id: 'gamestatus' },
            { name: 'CrackWatcher', id: 'crackwatcher' },
            { name: 'OmyCrack', id: 'omycrack' },

            // Моды
            { name: 'NexusMods', id: 'nexusmods' },

            // Другие
            { name: 'SteamDB (ID)', id: 'steamdb_id' },
            { name: 'SteamDB (Name)', id: 'steamdb_name' },
            { name: 'Online Fix', id: 'onlinefix' },
            { name: 'GOG-Games.to', id: 'goggames' },
            { name: 'CS.RIN.RU', id: 'csrinru' }
        ];
    }

    // Получаем AppID из URL
    function getAppIdFromUrl(url) {
        const regex = /\/app\/(\d+)\//;
        const matches = url.match(regex);
        if (matches == null || matches[1] == null) {
            console.log(`Error getting AppId from URL ${url}`);
            return null;
        }
        return matches[1];
    }

    // Получаем разработчика игры
    function getDeveloper() {
        const url = window.location.href;
        let developer = '';

        if (url.includes('store.steampowered.com')) {
            const developerElement = document.querySelector("#developers_list");
            if (developerElement) {
                developer = developerElement.firstElementChild.textContent.trim();
            }
        } else if (url.includes('steamdb.info')) {
            const element = document.querySelector('.span3');
            if (element) {
                const nextElement = element.nextElementSibling;
                if (nextElement) {
                    const parent = nextElement.parentElement;
                    if (parent) {
                        const nextSibling = parent.nextElementSibling;
                        if (nextSibling) {
                            const firstChild = nextSibling.firstElementChild;
                            if (firstChild) {
                                const nextSibling2 = firstChild.nextElementSibling;
                                if (nextSibling2) {
                                    developer = nextSibling2.textContent.replace(/\n/g, '').trim();
                                }
                            }
                        }
                    }
                }
            }
        }

        return encodeURIComponent(developer);
    }

    // Поиск на CS.RIN.RU (из v2.js)
    function findOnCsRin(appId, appName, developer, callback) {
        console.log('🔍 CS.RIN.RU findOnCsRin: Starting search');
        console.log('🔍 CS.RIN.RU findOnCsRin: AppID =', appId);
        console.log('🔍 CS.RIN.RU findOnCsRin: AppName =', appName);
        console.log('🔍 CS.RIN.RU findOnCsRin: Developer =', developer);
        
        if (!appId) {
            console.log('🔍 CS.RIN.RU findOnCsRin: No AppID, using fallback search');
            // Если нет AppID, используем обычный поиск
            const searchUrl = `https://cs.rin.ru/forum/search.php?keywords=${appName}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA`;
            console.log('🔍 CS.RIN.RU findOnCsRin: Fallback URL =', searchUrl);
            callback(searchUrl, []);
            return;
        }

        const rinSearchUrl = `https://cs.rin.ru/forum/search.php?keywords=${appId}&fid%5B%5D=10&sr=topics&sf=firstpost`;
        console.log('🔍 CS.RIN.RU findOnCsRin: Search URL =', rinSearchUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: rinSearchUrl,
            onerror: function (error) {
                console.log('🔍 CS.RIN.RU findOnCsRin: Request error =', error);
                const fallbackUrl = `https://cs.rin.ru/forum/search.php?keywords=${appName}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA`;
                console.log('🔍 CS.RIN.RU findOnCsRin: Error fallback URL =', fallbackUrl);
                callback(fallbackUrl, []);
            },
            onload: function (response) {
                console.log('🔍 CS.RIN.RU findOnCsRin: Response received, status =', response.status);
                console.log('🔍 CS.RIN.RU findOnCsRin: Response length =', response.responseText.length);
                
                const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                const topicSelectors = doc.querySelectorAll(".titles:not(:first-child), .topictitle");
                console.log('🔍 CS.RIN.RU findOnCsRin: Found topics =', topicSelectors.length);

                if (topicSelectors.length > 1) {
                    console.log('🔍 CS.RIN.RU findOnCsRin: Multiple topics found, trying advanced search');
                    // Расширенный поиск с разработчиком
                    const advancedUrl = `https://cs.rin.ru/forum/search.php?keywords=${appId}+${developer}&fid%5B%5D=10&sr=topics&sf=firstpost`;
                    console.log('🔍 CS.RIN.RU findOnCsRin: Advanced search URL =', advancedUrl);
                    
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: advancedUrl,
                        onload: function (response2) {
                            console.log('🔍 CS.RIN.RU findOnCsRin: Advanced search response received');
                            processCsRinResponse(response2, appName, callback);
                        }
                    });
                } else {
                    console.log('🔍 CS.RIN.RU findOnCsRin: Processing initial response');
                    processCsRinResponse(response, appName, callback);
                }
            }
        });
    }

    // Поиск на SteamGG
    function findOnSteamGG(appId, appName, callback) {
        console.log('🔍 SteamGG: Starting search');
        console.log('🔍 SteamGG: AppID =', appId);
        console.log('🔍 SteamGG: AppName =', appName);
        
        // Проверяем настройки
        const directToGame = localStorage.getItem('gameSearch_directToGame') === 'true';
        const searchById = localStorage.getItem('gameSearch_searchById') === 'true';
        
        console.log('🔍 SteamGG: Direct to game setting =', directToGame);
        console.log('🔍 SteamGG: Search by ID setting =', searchById);
        
        if (!directToGame) {
            // Если настройка выключена, делаем обычный поиск
            if (searchById && appId) {
                const searchUrl = `https://steamgg.net/?s=${appId}`;
                console.log('🔍 SteamGG: Direct search disabled, using search by ID URL =', searchUrl);
                callback(searchUrl);
            } else {
                // Получаем английское название для поиска
                getEnglishGameName(appId, function(englishName) {
                    const cleanedEnglishName = cleanGameName(englishName);
                    const searchUrl = `https://steamgg.net/?s=${encodeURIComponent(cleanedEnglishName)}`;
                    console.log('🔍 SteamGG: Direct search disabled, using English name search URL =', searchUrl);
                    callback(searchUrl);
                });
            }
            return;
        }
        
        // Если настройка включена, ищем и переходим на первый результат
        if (searchById && appId) {
            const searchUrl = `https://steamgg.net/?s=${appId}`;
            console.log('🔍 SteamGG: Search by ID URL =', searchUrl);
            
            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                onerror: function (error) {
                    console.log('🔍 SteamGG: Request error =', error);
                    callback(searchUrl);
                },
                onload: function (response) {
                    processSteamGGResponse(response, searchUrl, callback, 'id', null, appId);
                }
            });
        } else {
            // Получаем английское название для поиска
            getEnglishGameName(appId, function(englishName) {
                const cleanedEnglishName = cleanGameName(englishName);
                const searchUrl = `https://steamgg.net/?s=${encodeURIComponent(cleanedEnglishName)}`;
                console.log('🔍 SteamGG: Search by English name URL =', searchUrl);
                
                GM_xmlhttpRequest({
                    method: "GET",
                    url: searchUrl,
                    onerror: function (error) {
                        console.log('🔍 SteamGG: Request error =', error);
                        callback(searchUrl);
                    },
                                    onload: function (response) {
                    processSteamGGResponse(response, searchUrl, callback, 'name', cleanedEnglishName, appId);
                }
                });
            });
        }
    }

    // Обработка ответа SteamGG
    function processSteamGGResponse(response, searchUrl, callback, searchType, originalName, appId) {
        console.log('🔍 SteamGG: Response received, status =', response.status);
        console.log('🔍 SteamGG: Response length =', response.responseText.length);
        
        try {
            const doc = new DOMParser().parseFromString(response.responseText, "text/html");
            
            // Проверяем, есть ли сообщение "No Games Found"
            const noResultsElement = doc.querySelector('.search-no-results');
            if (noResultsElement) {
                console.log('🔍 SteamGG: No results message found, trying fallback');
                
                if (searchType === 'name') {
                    // Если поиск был по названию, пробуем без апострофов
                    const nameWithoutApostrophe = originalName.replace(/'/g, '');
                    if (nameWithoutApostrophe !== originalName) {
                        console.log('🔍 SteamGG: Trying search without apostrophes:', nameWithoutApostrophe);
                        const fallbackUrl = `https://steamgg.net/?s=${encodeURIComponent(nameWithoutApostrophe)}`;
                        
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: fallbackUrl,
                            onerror: function (error) {
                                console.log('🔍 SteamGG: Fallback request error =', error);
                                // Если и это не помогло, пробуем поиск по ID
                                if (appId) {
                                    console.log('🔍 SteamGG: Trying search by ID as final fallback');
                                    const idSearchUrl = `https://steamgg.net/?s=${appId}`;
                                    callback(idSearchUrl);
                                } else {
                                    callback(searchUrl);
                                }
                            },
                            onload: function (fallbackResponse) {
                                processSteamGGResponse(fallbackResponse, fallbackUrl, callback, 'name_fallback', nameWithoutApostrophe, appId);
                            }
                        });
                        return;
                    } else {
                        // Если апострофов не было, пробуем поиск по ID
                        if (appId) {
                            console.log('🔍 SteamGG: Trying search by ID as fallback');
                            const idSearchUrl = `https://steamgg.net/?s=${appId}`;
                            callback(idSearchUrl);
                        } else {
                            callback(searchUrl);
                        }
                        return;
                    }
                } else if (searchType === 'id') {
                    // Если поиск был по ID, пробуем по названию
                    console.log('🔍 SteamGG: ID search failed, trying search by name');
                    getEnglishGameName(appId, function(englishName) {
                        const cleanedEnglishName = cleanGameName(englishName);
                        const nameSearchUrl = `https://steamgg.net/?s=${encodeURIComponent(cleanedEnglishName)}`;
                        
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: nameSearchUrl,
                            onerror: function (error) {
                                console.log('🔍 SteamGG: Name search fallback error =', error);
                                callback(searchUrl);
                            },
                            onload: function (nameResponse) {
                                processSteamGGResponse(nameResponse, nameSearchUrl, callback, 'name_fallback', cleanedEnglishName, appId);
                            }
                        });
                    });
                    return;
                }
            }
            
            // Ищем ссылки на игры в результатах поиска (ищем ссылки в .newsbh-item)
            const gameLinks = doc.querySelectorAll('.newsbh-item a[href*="/"]');
            console.log('🔍 SteamGG: Found game links =', gameLinks.length);
            
            if (gameLinks.length > 0) {
                // Берем первый результат
                const gameUrl = gameLinks[0].getAttribute('href');
                console.log('🔍 SteamGG: First result found, redirecting to =', gameUrl);
                callback(gameUrl);
            } else {
                // Если ничего не найдено, остаемся на странице поиска
                console.log('🔍 SteamGG: No results found, staying on search page');
                callback(searchUrl);
            }
            
        } catch (error) {
            console.log('🔍 SteamGG: Error parsing response =', error);
            callback(searchUrl);
        }
    }

    // Поиск на Games4U
    function findOnGames4U(appId, appName, callback) {
        console.log('🔍 Games4U: Starting search');
        console.log('🔍 Games4U: AppID =', appId);
        console.log('🔍 Games4U: AppName =', appName);
        
        if (!appId) {
            console.log('🔍 Games4U: No AppID, using fallback search');
            const searchUrl = `https://games4u.org/?s=${encodeURIComponent(appName)}`;
            console.log('🔍 Games4U: Fallback URL =', searchUrl);
            callback(searchUrl);
            return;
        }

        const searchUrl = `https://games4u.org/?s=${appId}`;
        console.log('🔍 Games4U: Search URL =', searchUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onerror: function (error) {
                console.log('🔍 Games4U: Request error =', error);
                const fallbackUrl = `https://games4u.org/?s=${encodeURIComponent(appName)}`;
                console.log('🔍 Games4U: Error fallback URL =', fallbackUrl);
                callback(fallbackUrl);
            },
            onload: function (response) {
                console.log('🔍 Games4U: Response received, status =', response.status);
                console.log('🔍 Games4U: Response length =', response.responseText.length);
                
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    
                    // Ищем ссылки на игры в результатах поиска (ищем ссылки с классом p-url)
                    const gameLinks = doc.querySelectorAll('a.p-url[href*="/"]');
                    console.log('🔍 Games4U: Found game links =', gameLinks.length);
                    
                    if (gameLinks.length === 1) {
                        // Если найден только один результат, переходим на него
                        const gameUrl = gameLinks[0].getAttribute('href');
                        console.log('🔍 Games4U: Single result found, redirecting to =', gameUrl);
                        callback(gameUrl);
                    } else if (gameLinks.length > 1) {
                        // Если найдено несколько результатов, остаемся на странице поиска
                        console.log('🔍 Games4U: Multiple results found, staying on search page');
                        callback(searchUrl);
                    } else {
                        // Если ничего не найдено, остаемся на странице поиска
                        console.log('🔍 Games4U: No results found, staying on search page');
                        callback(searchUrl);
                    }
                    
                } catch (error) {
                    console.log('🔍 Games4U: Error parsing response =', error);
                    callback(searchUrl);
                }
            }
        });
    }

    // Поиск на AnkerGames
    function findOnAnkerGames(appId, appName, callback) {
        console.log('🔍 AnkerGames: Starting search');
        console.log('🔍 AnkerGames: AppID =', appId);
        console.log('🔍 AnkerGames: AppName =', appName);
        
        if (!appId) {
            console.log('🔍 AnkerGames: No AppID, using fallback search');
            const searchUrl = `https://ankergames.net/search/${encodeURIComponent(appName)}`;
            console.log('🔍 AnkerGames: Fallback URL =', searchUrl);
            callback(searchUrl);
            return;
        }

        const searchUrl = `https://ankergames.net/search/${appId}`;
        console.log('🔍 AnkerGames: Search URL =', searchUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onerror: function (error) {
                console.log('🔍 AnkerGames: Request error =', error);
                const fallbackUrl = `https://ankergames.net/search/${encodeURIComponent(appName)}`;
                console.log('🔍 AnkerGames: Error fallback URL =', fallbackUrl);
                callback(fallbackUrl);
            },
            onload: function (response) {
                console.log('🔍 AnkerGames: Response received, status =', response.status);
                console.log('🔍 AnkerGames: Response length =', response.responseText.length);
                
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    
                    // Ищем ссылки на игры в результатах поиска
                    const gameLinks = doc.querySelectorAll('a[href*="/game/"]');
                    console.log('🔍 AnkerGames: Found game links =', gameLinks.length);
                    
                    if (gameLinks.length === 1) {
                        // Если найден только один результат, переходим на него
                        const gameUrl = gameLinks[0].getAttribute('href');
                        const fullGameUrl = gameUrl.startsWith('http') ? gameUrl : `https://ankergames.net${gameUrl}`;
                        console.log('🔍 AnkerGames: Single result found, redirecting to =', fullGameUrl);
                        callback(fullGameUrl);
                    } else if (gameLinks.length > 1) {
                        // Если найдено несколько результатов, остаемся на странице поиска
                        console.log('🔍 AnkerGames: Multiple results found, staying on search page');
                        callback(searchUrl);
                    } else {
                        // Если ничего не найдено, остаемся на странице поиска
                        console.log('🔍 AnkerGames: No results found, staying on search page');
                        callback(searchUrl);
                    }
                    
                } catch (error) {
                    console.log('🔍 AnkerGames: Error parsing response =', error);
                    callback(searchUrl);
                }
            }
        });
    }

    // Обрабатываем ответ от CS.RIN.RU
    function processCsRinResponse(response, appName, callback) {
        console.log('🔍 CS.RIN.RU processCsRinResponse: Processing response');
        console.log('🔍 CS.RIN.RU processCsRinResponse: AppName =', appName);
        
        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
        const topics = doc.querySelectorAll(".titles:not(:first-child), .topictitle");
        console.log('🔍 CS.RIN.RU processCsRinResponse: Found topics =', topics.length);

        let topicSelector = null;
        for (let potentialTopic of topics) {
            console.log('🔍 CS.RIN.RU processCsRinResponse: Checking topic =', potentialTopic.textContent.substring(0, 100));
            if (potentialTopic.textContent.includes(appName)) {
                topicSelector = potentialTopic;
                console.log('🔍 CS.RIN.RU processCsRinResponse: Found matching topic!');
                break;
            }
        }

        if (!topicSelector) {
            console.log('🔍 CS.RIN.RU processCsRinResponse: No matching topic found, using first topic');
            topicSelector = doc.querySelector(".titles:not(:first-child), .topictitle");
        }

        let rinURL = "posting.php?mode=post&f=10";
        let tags = ["[Not on RIN]"];

        if (topicSelector) {
            rinURL = topicSelector.getAttribute("href");
            console.log('🔍 CS.RIN.RU processCsRinResponse: Topic URL =', rinURL);
            console.log('🔍 CS.RIN.RU processCsRinResponse: Topic text =', topicSelector.textContent.substring(0, 200));
            
            tags = topicSelector.text.match(/(?<!^)\[([^\]]+)]/g)?.slice(0) ?? [];
            console.log('🔍 CS.RIN.RU processCsRinResponse: Extracted tags =', tags);
            
            if (tags.length === 0) {
                tags.push("[Not on RIN]");
                console.log('🔍 CS.RIN.RU processCsRinResponse: No tags found, using default');
            }
        } else {
            console.log('🔍 CS.RIN.RU processCsRinResponse: No topic selector found, using default URL');
        }

        const redirectUrl = "https://cs.rin.ru/forum/" + rinURL.split("&hilit")[0];
        console.log('🔍 CS.RIN.RU processCsRinResponse: Final redirect URL =', redirectUrl);

        if (callback && typeof callback === "function") {
            console.log('🔍 CS.RIN.RU processCsRinResponse: Calling callback with URL and tags');
            callback(redirectUrl, tags);
        } else {
            console.log('🔍 CS.RIN.RU processCsRinResponse: No callback function provided!');
        }
    }

    // Функция для удаления изданий из названия игры
    function removeEditionFromName(gameName) {
        // Паттерн для поиска слова Edition и предшествующего ему слова
        const editionPattern = /\s+\w+\s+Edition$/i;
        
        if (editionPattern.test(gameName)) {
            const cleanName = gameName.replace(editionPattern, '').trim();
            console.log(`🎮 Edition removed: "${gameName}" → "${cleanName}"`);
            return cleanName;
        }
        
        return gameName;
    }

        // Создаем содержимое меню
    function createMenuContent() {
        const gameName = getGameName();
        const appId = getAppIdFromUrl(window.location.href);
        
        // Получаем английское название из SteamDB
        getEnglishGameName(appId, function(englishGameName) {
            // Сохраняем оригинальный регистр для некоторых сайтов, которые чувствительны к нему
            let originalGameName = englishGameName.replace(/'/g, '').replace(/_/g, ' ').trim();
            
            // Проверяем настройку удаления изданий
            const removeEditions = localStorage.getItem('gameSearch_removeEditions') === 'true';
            if (removeEditions) {
                originalGameName = removeEditionFromName(originalGameName);
            }
            
            // Очищаем название игры от символов ™ и других
            const cleanedGameName = cleanGameName(originalGameName);
            
            // Низкий регистр для сайтов, которые требуют его
            const lowerGameName = cleanedGameName.toLowerCase();
            const developer = getDeveloper();

            // Получаем настройки отключенных источников
            const disabledSites = JSON.parse(localStorage.getItem('gameSearch_disabledSites') || '[]');
            
            // Все доступные сайты
            const allSites = [
            // Торрент-трекеры
            { name: 'Rutracker', url: `https://rutracker.org/forum/tracker.php?f=1008,127,128,1310,2118,2203,2204,2205,2206,2225,2226,2228,2410,278,5,50,51,52,53,54,635,646,647,900&nm=${lowerGameName}`, section: 'Торрент-трекеры', id: 'rutracker' },
            { name: 'Rutor', url: `https://rutor.info/search/0/8/100/0/${lowerGameName}`, section: 'Торрент-трекеры', id: 'rutor' },
            { name: 'Rustorka', url: `https://rustorka.com/forum/tracker.php?nm=${lowerGameName}`, section: 'Торрент-трекеры', id: 'rustorka' },
            { name: 'Tapochek', url: `https://tapochek.net/forum/tracker.php?nm=${lowerGameName}`, section: 'Торрент-трекеры', id: 'tapochek' },
            { name: '1337x', url: `https://1337x.to/sort-category-search/${cleanedGameName}/Games/seeders/desc/1/`, section: 'Торрент-трекеры', id: '1337x' },
            { name: 'PiratBit', url: `https://pb.wtf/tracker/?ss=${cleanedGameName}`, section: 'Торрент-трекеры', id: 'piratbit' },
            { name: 'Pirate Bay', url: `https://thepiratebay.org/search.php?cat=401&q=${cleanedGameName}`, section: 'Торрент-трекеры', id: 'piratebay' },

            // Сайты загрузки
            { name: 'Skidrow', url: `https://www.skidrowreloaded.com/?s=${cleanedGameName}&x=0&y=0`, section: 'Сайты загрузки', id: 'skidrow' },
            { name: 'FitGirl', url: `https://fitgirl-repacks.site/?s=${cleanedGameName}`, section: 'Сайты загрузки', id: 'fitgirl' },
            { name: 'SteamRIP', url: `https://steamrip.com/?s=${cleanedGameName}`, section: 'Сайты загрузки', id: 'steamrip' },
            { name: 'Dodi', url: `https://dodi-repacks.site/?s=${cleanedGameName}`, section: 'Сайты загрузки', id: 'dodi' },
            { name: 'Gload', url: `https://gload.to/?s=${cleanedGameName}`, section: 'Сайты загрузки', id: 'gload' },
            { name: 'OVA Games', url: `https://www.ovagames.com/?s=${cleanedGameName}`, section: 'Сайты загрузки', id: 'ovagames' },
            { name: 'Torrminatorr', url: `https://forum.torrminatorr.com/search.php?keywords=${cleanedGameName}`, section: 'Сайты загрузки', id: 'torrminatorr' },
            { name: 'FreeTP', url: `https://freetp.org/index.php?do=search&subaction=search&story=${cleanedGameName}`, section: 'Сайты загрузки', id: 'freetp' },
            { name: 'CS.RIN.RU', url: `javascript:void(0)`, section: 'Сайты загрузки', id: 'csrinru', special: 'csrin' },
            { name: 'Online Fix', url: `https://online-fix.me/index.php?do=search&subaction=search&story=${lowerGameName}`, section: 'Сайты загрузки', id: 'onlinefix' },
            { name: 'GOG-Games.to', url: `https://gog-games.to/?search=${cleanedGameName}`, section: 'Сайты загрузки', id: 'goggames' },

            { name: 'AnkerGames', url: `javascript:void(0)`, section: 'Сайты загрузки', id: 'ankergames', special: 'ankergames' },
                         { name: 'GameBounty', url: `https://gamebounty.world/`, section: 'Сайты загрузки', id: 'gamebounty' },
            { name: 'UnionCrax', url: `https://union-crax.xyz/?q=${cleanedGameName}`, section: 'Сайты загрузки', id: 'unioncrax' },
            { name: 'G4U', url: `https://g4u.to/en/search/?str=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'g4u' },
            { name: 'Gamesdrive', url: `https://gamesdrive.net/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'gamesdrive' },
            { name: 'SteamGG', url: `javascript:void(0)`, section: 'Сайты загрузки', id: 'steamgg', special: 'steamgg' },
            { name: 'Appnetica', url: `https://appnetica.com/search?term=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'appnetica' },
            { name: 'AtopGames', url: `https://atopgames.com/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'atopgames' },
            { name: 'ElEnemigos', url: `https://elenemigos.com/?g_name=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'elenemigos' },
            { name: 'Reloaded Steam', url: `https://reloadedsteam.com/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'reloadedsteam' },
            { name: 'RexaGames', url: `https://rexagames.com/search/?&q=${cleanedGameName}`, section: 'Сайты загрузки', id: 'rexagames' },
            { name: 'TriahGames', url: `https://triahgames.com/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'triahgames' },
            { name: 'GetFreeGames', url: `https://getfreegames.net/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'getfreegames' },
            { name: 'Games4U', url: `javascript:void(0)`, section: 'Сайты загрузки', id: 'games4u', special: 'games4u' },
            { name: 'Stevv Game', url: `https://www.stevvgame.com/search?q=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'stevvgame' },
            { name: 'Xatab Repacks', url: `https://byxatab.com/search/${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'xatab' },
                         { name: 'Elamigos', url: `https://www.elamigosweb.com/?q=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'elamigos' },
             { name: 'FluxyRepacks', url: `https://fluxyrepacks.xyz/games`, section: 'Сайты загрузки', id: 'fluxyrepacks' },
             { name: 'RepackGames', url: `https://repack-games.com/?s=${cleanedGameName.replace(/ /g, '+')}`, section: 'Сайты загрузки', id: 'repackgames' },


            // Статус игр и крэки
            { name: 'GameStatus', url: `https://gamestatus.info/search?title=${cleanedGameName}`, section: 'Статус игр', id: 'gamestatus' },
            { name: 'CrackWatcher', url: `https://crackwatcher.com/search/${cleanedGameName}`, section: 'Статус игр', id: 'crackwatcher' },
            { name: 'OmyCrack', url: `https://omycrack.com/search/${cleanedGameName.replace(/ /g, '+')}`, section: 'Статус игр', id: 'omycrack' },

            // Другие
            { name: 'SteamDB (ID)', url: `https://steamdb.info/app/${appId}`, section: 'Другие', id: 'steamdb_id' },
            { name: 'SteamDB (Name)', url: `https://steamdb.info/search/?a=all&q=${cleanedGameName}`, section: 'Другие', id: 'steamdb_name' },
            { name: 'NexusMods', url: `https://www.nexusmods.com/search?keyword=${cleanedGameName}`, section: 'Другие', id: 'nexusmods' }
        ];

            // Фильтруем отключенные сайты
            const sites = allSites.filter(site => !disabledSites.includes(site.id));

            // Показываем меню мгновенно без поиска
            console.log('⚡ Showing menu instantly with', sites.length, 'sites');
            createMenuWithSites(sites, englishGameName, []);
        });
    }



            // Создаем меню с сайтами (новый красивый дизайн)
        function createMenuWithSites(sites, gameName, gameTags) {
            const mainView = document.querySelector('.main-view');
            if (!mainView) return;

            // Группируем сайты по секциям
            const sections = {};
            sites.forEach(site => {
                if (!sections[site.section]) {
                    sections[site.section] = [];
                }
                sections[site.section].push(site);
            });

            let content = '';

            // Убираем информацию об игре из основного меню

            // Добавляем секции с сайтами в виде красивой сетки
            Object.keys(sections).forEach(sectionName => {
                content += `<div class="section-title">${sectionName}</div>`;
                content += '<div class="buttons-grid">';

                // Сортируем сайты в алфавитном порядке
                const sortedSites = sections[sectionName].sort((a, b) => a.name.localeCompare(b.name));

                sortedSites.forEach(site => {
                    if (site.special === 'csrin') {
                        // Специальная обработка для CS.RIN.RU
                        content += `
                            <a href="#" class="site-button csrin-button" title="${site.name}" data-site-id="${site.id}">
                                <span>${site.name}</span>
                            </a>
                        `;
                    } else if (site.special === 'ankergames') {
                        // Специальная обработка для AnkerGames
                        content += `
                            <a href="#" class="site-button ankergames-button" title="${site.name}" data-site-id="${site.id}">
                                <span>${site.name}</span>
                            </a>
                        `;
                    } else if (site.special === 'games4u') {
                        // Специальная обработка для Games4U
                        content += `
                            <a href="#" class="site-button games4u-button" title="${site.name}" data-site-id="${site.id}">
                                <span>${site.name}</span>
                            </a>
                        `;
                    } else if (site.special === 'steamgg') {
                        // Специальная обработка для SteamGG
                        content += `
                            <a href="#" class="site-button steamgg-button" title="${site.name}" data-site-id="${site.id}">
                                <span>${site.name}</span>
                            </a>
                        `;
                    } else {
                        content += `
                            <a href="${site.url}" target="_blank" class="site-button" title="${site.name}">
                                <span>${site.name}</span>
                            </a>
                        `;
                    }
                });

                content += '</div>';
            });

            mainView.innerHTML = content;

            // Добавляем обработчики для специальных кнопок после создания контента
            setTimeout(() => {
                // Обработчик для кнопки CS.RIN.RU
                const csrinButton = document.querySelector('.csrin-button');
                if (csrinButton) {
                    console.log('🔍 CS.RIN.RU: Button found and adding event listener');
                    csrinButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('🔍 CS.RIN.RU: Button clicked!');
                        
                        const appId = getAppIdFromUrl(window.location.href);
                        const gameName = getGameName();
                        const developer = getDeveloper();
                        
                        console.log('🔍 CS.RIN.RU: AppID =', appId);
                        console.log('🔍 CS.RIN.RU: GameName =', gameName);
                        console.log('🔍 CS.RIN.RU: Developer =', developer);
                        
                        if (appId && gameName) {
                            console.log('🔍 CS.RIN.RU: Starting search with AppID and GameName');
                            // Показываем индикатор загрузки
                            const originalText = this.querySelector('span').textContent;
                            this.querySelector('span').textContent = 'Поиск...';
                            
                            // Запускаем поиск CS.RIN.RU с оригинальной системой
                            findOnCsRin(appId, gameName, developer, function(url, tags) {
                                console.log('🔍 CS.RIN.RU: Search completed!');
                                console.log('🔍 CS.RIN.RU: URL =', url);
                                console.log('🔍 CS.RIN.RU: Tags =', tags);
                                
                                // Открываем найденную страницу
                                window.open(url, '_blank');
                                // Возвращаем оригинальный текст
                                csrinButton.querySelector('span').textContent = originalText;
                            });
                        } else {
                            console.log('🔍 CS.RIN.RU: Fallback to name search');
                            // Fallback на поиск по названию
                            if (gameName) {
                                const fallbackUrl = `https://cs.rin.ru/forum/search.php?keywords=${encodeURIComponent(gameName)}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA`;
                                console.log('🔍 CS.RIN.RU: Fallback URL =', fallbackUrl);
                                window.open(fallbackUrl, '_blank');
                            } else {
                                console.log('🔍 CS.RIN.RU: No game name found!');
                            }
                        }
                    });
                } else {
                    console.log('🔍 CS.RIN.RU: Button not found after content creation!');
                }

                // Обработчик для кнопки AnkerGames
                const ankergamesButton = document.querySelector('.ankergames-button');
                if (ankergamesButton) {
                    console.log('🔍 AnkerGames: Button found and adding event listener');
                    ankergamesButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('🔍 AnkerGames: Button clicked!');
                        
                        const appId = getAppIdFromUrl(window.location.href);
                        const gameName = getGameName();
                        
                        console.log('🔍 AnkerGames: AppID =', appId);
                        console.log('🔍 AnkerGames: GameName =', gameName);
                        
                        if (appId || gameName) {
                            console.log('🔍 AnkerGames: Starting search');
                            // Показываем индикатор загрузки
                            const originalText = this.querySelector('span').textContent;
                            this.querySelector('span').textContent = 'Поиск...';
                            
                            // Запускаем поиск AnkerGames
                            findOnAnkerGames(appId, gameName, function(url) {
                                console.log('🔍 AnkerGames: Search completed!');
                                console.log('🔍 AnkerGames: URL =', url);
                                
                                // Открываем найденную страницу
                                window.open(url, '_blank');
                                // Возвращаем оригинальный текст
                                ankergamesButton.querySelector('span').textContent = originalText;
                            });
                        } else {
                            console.log('🔍 AnkerGames: No game info found!');
                        }
                    });
                } else {
                    console.log('🔍 AnkerGames: Button not found after content creation!');
                }

                // Обработчик для кнопки Games4U
                const games4uButton = document.querySelector('.games4u-button');
                if (games4uButton) {
                    console.log('🔍 Games4U: Button found and adding event listener');
                    games4uButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('🔍 Games4U: Button clicked!');
                        
                        const appId = getAppIdFromUrl(window.location.href);
                        const gameName = getGameName();
                        
                        console.log('🔍 Games4U: AppID =', appId);
                        console.log('🔍 Games4U: GameName =', gameName);
                        
                        if (appId || gameName) {
                            console.log('🔍 Games4U: Starting search');
                            // Показываем индикатор загрузки
                            const originalText = this.querySelector('span').textContent;
                            this.querySelector('span').textContent = 'Поиск...';
                            
                            // Запускаем поиск Games4U
                            findOnGames4U(appId, gameName, function(url) {
                                console.log('🔍 Games4U: Search completed!');
                                console.log('🔍 Games4U: URL =', url);
                                
                                // Открываем найденную страницу
                                window.open(url, '_blank');
                                // Возвращаем оригинальный текст
                                games4uButton.querySelector('span').textContent = originalText;
                            });
                        } else {
                            console.log('🔍 Games4U: No game info found!');
                        }
                    });
                } else {
                    console.log('🔍 Games4U: Button not found after content creation!');
                }

                // Обработчик для кнопки SteamGG
                const steamggButton = document.querySelector('.steamgg-button');
                if (steamggButton) {
                    console.log('🔍 SteamGG: Button found and adding event listener');
                    steamggButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('🔍 SteamGG: Button clicked!');
                        
                        const appId = getAppIdFromUrl(window.location.href);
                        const gameName = getGameName();
                        
                        console.log('🔍 SteamGG: AppID =', appId);
                        console.log('🔍 SteamGG: GameName =', gameName);
                        
                        if (appId || gameName) {
                            console.log('🔍 SteamGG: Starting search');
                            // Показываем индикатор загрузки
                            const originalText = this.querySelector('span').textContent;
                            this.querySelector('span').textContent = 'Поиск...';
                            
                            // Запускаем поиск SteamGG
                            findOnSteamGG(appId, gameName, function(url) {
                                console.log('🔍 SteamGG: Search completed!');
                                console.log('🔍 SteamGG: URL =', url);
                                
                                // Открываем найденную страницу
                                window.open(url, '_blank');
                                // Возвращаем оригинальный текст
                                steamggButton.querySelector('span').textContent = originalText;
                            });
                        } else {
                            console.log('🔍 SteamGG: No game info found!');
                        }
                    });
                } else {
                    console.log('🔍 SteamGG: Button not found after content creation!');
                }
            }, 100);
        }

    // Добавляем кнопку на страницу (с гарантированным отображением)
    function addMenuToPage() {
        // Проверяем, не добавлена ли уже кнопка
        if (document.querySelector('a[title="Поиск игр на различных сайтах"]') || 
            document.querySelector('.game-search-script-button')) {
            console.log('🔄 Game Search Hub: Button already exists, skipping...');
            return;
        }

        const { button, modal } = createMenuButton();
        
        // Добавляем класс для идентификации
        button.classList.add('game-search-script-button');

        // Размещение кнопки точно как в CS.RIN.RU Enhanced
        let inserted = false;

        if (window.location.href.includes('store.steampowered.com')) {
            console.log('🎯 Game Search Hub: Steam page detected');

            // Используем точно тот же метод что и в CS.RIN.RU Enhanced
            const otherSiteInfo = document.querySelector('.apphub_OtherSiteInfo');
            if (otherSiteInfo && otherSiteInfo.firstElementChild) {
                // Вставляем кнопку точно так же как в CS.RIN.RU Enhanced: insertAdjacentElement("beforebegin")
                otherSiteInfo.firstElementChild.insertAdjacentElement("beforebegin", button);
                inserted = true;
                console.log('✅ Game Search Hub: Button inserted using CS.RIN.RU Enhanced method');
            }
        } else if (window.location.href.includes('steamdb.info')) {
            console.log('🎯 Game Search Hub: SteamDB page detected');
            
            // Стиль кнопки для SteamDB как в CS.RIN.RU Enhanced
            button.className = "btn tooltipped tooltipped-n";
            button.ariaLabel = 'Поиск игр на различных сайтах';
            
                         // Настройка кнопки для SteamDB (без текста)
             const imgElement = button.querySelector('img');
             if (imgElement) {
                 imgElement.style.height = "16px";
                 imgElement.style.width = "16px";
             }
            
            // Находим место для вставки кнопки на SteamDB
            const appLinks = document.querySelectorAll('.app-links')[1];
            if (appLinks && appLinks.firstElementChild) {
                appLinks.firstElementChild.insertAdjacentElement("beforebegin", button);
                inserted = true;
                console.log('✅ Game Search Hub: Button inserted on SteamDB');
            }

            // Fallback: ищем место для вставки как в оригинальном скрипте
            if (!inserted) {
                const targetSelectors = [
                    '.apphub_OtherSiteInfo',
                    '.game_area_purchase_game',
                    '#game_area_purchase',
                    '.game_area_description',
                    '.game_purchase_action_bg'
                ];

                for (const selector of targetSelectors) {
                    const targetElement = document.querySelector(selector);
                    if (targetElement) {
                        console.log(`📍 Found target element: ${selector}`);
                        targetElement.insertAdjacentElement('beforebegin', button);
                        inserted = true;
                        console.log('✅ Game Search Hub: Button inserted using fallback selector');
                        break;
                    }
                }
            }
        }



        // Ultimate fallback - фиксированная позиция
        if (!inserted) {
            console.log('🔧 Game Search Hub: Using fixed positioning as fallback');

            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.zIndex = '9999';

            document.body.appendChild(button);
            console.log('✅ Game Search Hub: Button added as fixed element');
        }

        // Добавляем модальное меню к body
        document.body.appendChild(modal);

        console.log('🚀 Game Search Hub: Initialization complete');
    }

    // Инициализация
    function init() {
        console.log('🔄 Game Search Hub: Initializing...');

        // Ждем загрузки страницы
        if (document.readyState === 'loading') {
            console.log('⏳ Game Search Hub: Waiting for DOM to load...');
            document.addEventListener('DOMContentLoaded', function() {
                console.log('📄 Game Search Hub: DOM loaded, adding button...');
                addMenuToPage();
            });
        } else {
            console.log('📄 Game Search Hub: DOM already loaded, adding button...');
            addMenuToPage();
        }
    }



    // Запуск скрипта
    init();

})();
