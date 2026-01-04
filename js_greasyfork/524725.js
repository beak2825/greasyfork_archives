// ==UserScript==
// @name         Twitter XFilter panel 2.4.67 (c) tapeavion 
// @version      2.4.67
// @description  Hide posts by keywords with the dashboard and posts from verified accounts
// @author       gullampis810
// @match        https://x.com/*
// @match        https://x.com/i/grok*
// @match        https://blank.org/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT 
// @icon         https://www.pinclipart.com/picdir/big/450-4507608_twitter-circle-clipart.png
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/524725/Twitter%20XFilter%20panel%202467%20%28c%29%20tapeavion.user.js
// @updateURL https://update.greasyfork.org/scripts/524725/Twitter%20XFilter%20panel%202467%20%28c%29%20tapeavion.meta.js
// ==/UserScript==
 
(function () {
    "use strict";

    // ========== Настройки и инициализация ========== //
    const STORAGE_KEY = "hiddenKeywords";
    const FAVORITE_USERS_KEY = "favoriteUsers";
    const BLOCKED_USERS_KEY = "blockedUsers";
    // NEW: Новый ключ для черного списка GIF
    const GIF_BLACKLIST_KEY = "gifBlacklist";
    let hiddenKeywords = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let favoriteUsers = JSON.parse(localStorage.getItem(FAVORITE_USERS_KEY)) || [];
    let blockedUsers = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY)) || [];
    let unblockedKeywords = JSON.parse(localStorage.getItem("unblockedKeywords")) || [];
    // NEW: Инициализация черного списка для GIF
    // Глобальные переменные (добавьте в начало скрипта, если их нет)
// Глобальные переменные (добавьте это вне функции, в начале скрипта)
let filteredData = []; // Полный отфильтрованный массив данных
let itemHeight = 40; // Высота одного элемента (в пикселях, соответствует CSS)
let viewportHeight = 400; // Высота viewport (#keywordList)
let maxItems = 10; // Максимальное количество элементов для рендера
    let gifBlacklist = JSON.parse(localStorage.getItem(GIF_BLACKLIST_KEY)) || [];
    let hideVerifiedAccounts = false;
    let hideNonVerifiedAccounts = JSON.parse(localStorage.getItem("hideNonVerifiedAccounts")) || false;
    let displayMode = "keywords"; // keywords, favorites, blocked
    const languageFilters = {
        english: /[a-zA-Z]/,
        russian: /[А-Яа-яЁё]/,
        japanese: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
        ukrainian: /[А-Яа-яІіЄєЇїҐґ]/,
        belarusian: /[А-Яа-яЎўЁёІі]/,
        tatar: /[А-Яа-яӘәӨөҮүҖҗ]/,
        mongolian: /[\p{Script=Mongolian}]/u,
        chinese: /[\p{Script=Han}]/u,
        german: /[a-zA-ZßÄäÖöÜü]/,
        polish: /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/,
        french: /[a-zA-Zàâçéèêëîïôûùüÿ]/,
        swedish: /[a-zA-ZåäöÅÄÖ]/,
        estonian: /[a-zA-ZäõöüÄÕÖÜ]/,
        danish: /[a-zA-ZåøæÅØÆ]/,
        turkish: /[a-zA-ZıİçÇğĞöÖşŞüÜ]/,
        portuguese: /[a-zA-Zàáâãçéêíóôõúü]/,
    };
    let activeLanguageFilters = {};

    // =============== showNotification ================ //
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10001';
        notification.style.color = 'white';
        notification.style.fontFamily = 'Arial, sans-serif';

        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(90deg,rgb(31, 90, 33), #81C784)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(90deg,rgb(94, 41, 38),rgb(212, 134, 121))';
                break;
            default:
                notification.style.background = 'linear-gradient(90deg,rgb(33, 70, 100), #64B5F6)';
        }
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }

    // Получение имени пользователя из профиля
    function getUsernameFromProfile() {
        const profileUrl = window.location.href;
        const match = profileUrl.match(/x\.com\/([^\?\/]+)/);
        if (match && match[1]) {
            return match[1].toLowerCase();
        }
        const usernameElement = document.querySelector('a[href*="/"][role="link"] div[dir="ltr"] span');
        return usernameElement ? usernameElement.textContent.replace('@', '').toLowerCase() : '';
    }

    // ========== Сохранение в localStorage ========== //
    function saveKeywords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenKeywords));
    }

    function saveFavoriteUsers() {
        localStorage.setItem(FAVORITE_USERS_KEY, JSON.stringify(favoriteUsers));
    }

    function saveBlockedUsers() {
        localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blockedUsers));
    }

    function saveUnblockedKeywords() {
        localStorage.setItem("unblockedKeywords", JSON.stringify(unblockedKeywords));
    }

    // NEW: Сохранение черного списка GIF
    function saveGifBlacklist() {
        localStorage.setItem(GIF_BLACKLIST_KEY, JSON.stringify(gifBlacklist));
    }

    // ========== Функция для обновления фильтров по языкам ========== //
    function updateLanguageFilter(language) {
        if (activeLanguageFilters[language]) {
            delete activeLanguageFilters[language];
        } else {
            activeLanguageFilters[language] = languageFilters[language];
        }
        hidePosts();
    }

    // ========== Проверка языка текста ========== //
    function isTextInLanguage(text) {
        for (const [language, regex] of Object.entries(activeLanguageFilters)) {
            if (regex.test(text)) {
                return true;
            }
        }
        return false;
    }

    // ========== Функция скрытия постов ========== //
    function hidePosts() {
    document.querySelectorAll("article").forEach((article) => {
        const textContent = article.innerText.toLowerCase();
        const isVerifiedAccount = article.querySelector('[data-testid="icon-verified"]');
        const usernameElement = article.querySelector('a[href*="/"]');
        const usernameFromSpan = article.querySelector('a[href*="/"] div[dir="ltr"] span')?.textContent.replace('@', '').toLowerCase() || '';
        const username = usernameElement ? usernameElement.getAttribute("href").slice(1).toLowerCase() : usernameFromSpan;

        // Проверяем, является ли пользователь избранным
        const isFavoriteUser = favoriteUsers.includes(username);
        // Проверяем, является ли пользователь заблокированным
        const isBlockedUser = blockedUsers.includes(username);

        // Если пользователь в избранных, показываем пост
        if (isFavoriteUser) {
            article.style.display = "";
            // NEW: Добавляем элементы управления для GIF
            addGifControls(article);
            return;
        }

        // Если пользователь заблокирован, скрываем пост
        if (isBlockedUser) {
            article.style.display = "none";
            return;
        }

        // Проверка на ключевые слова
        const matchesKeyword = hiddenKeywords.some((keyword) => {
            try {
                return new RegExp(keyword, "i").test(textContent);
            } catch (e) {
                return textContent.includes(keyword.toLowerCase());
            }
        });

        // Проверка на запрещенные GIF
        let matchesGif = false;
        const gifElements = article.querySelectorAll('video[aria-label], img[alt="GIF"]');
        gifElements.forEach((gif) => {
            const gifLabel = gif.getAttribute('aria-label')?.toLowerCase() || '';
            const gifSrc = gif.getAttribute('src')?.toLowerCase() || '';
            const gifPoster = gif.getAttribute('poster')?.toLowerCase() || '';
            const gifContent = gifLabel + gifSrc + gifPoster;
            matchesGif = gifBlacklist.some((gifKeyword) => gifContent.includes(gifKeyword.toLowerCase()));
            if (matchesGif) return;
        });

        // Проверка на посты без текста (только GIF)
        const hasOnlyGif = gifElements.length > 0 &&
                           !article.querySelector('[data-testid="tweetText"]') &&
                           textContent.trim().replace(/[@\w]+|\d+\s?[чмдн]/gi, '').trim().length < 10;

        // Логика скрытия постов
        const shouldHideVerified = hideVerifiedAccounts && isVerifiedAccount;
        const shouldHideNonVerified = hideNonVerifiedAccounts && !isVerifiedAccount;
        const shouldHideByLanguage = isTextInLanguage(textContent);
        const shouldHideByKeyword = matchesKeyword;
        const shouldHideByGif = matchesGif || hasOnlyGif;

        if (shouldHideVerified || shouldHideNonVerified || shouldHideByLanguage || shouldHideByKeyword || shouldHideByGif) {
            article.style.display = "none";
        } else {
            article.style.display = "";
            // NEW: Добавляем элементы управления для GIF, если пост не скрыт
            addGifControls(article);
        }
    });
}

// NEW: Функция для добавления элементов управления GIF
function addGifControls(article) {
    const gifElements = article.querySelectorAll('video[aria-label]');
    gifElements.forEach((gif) => {
        // Проверяем, существует ли уже контейнер управления
        if (gif.parentElement.querySelector('.gif-control-container')) {
            return; // Пропускаем, если контейнер уже есть
        }

        const gifLabel = gif.getAttribute('aria-label') || 'GIF';
        if (!gifLabel) return; // Пропускаем, если нет aria-label

        // Создаем контейнер для элементов управления
        const container = document.createElement('div');
        container.className = 'gif-control-container';

        // Добавляем текст с названием GIF
        const label = document.createElement('span');
        label.className = 'gif-label';
        label.textContent = gifLabel;
        container.appendChild(label);

        // Добавляем кнопку "Копировать"
        const copyButton = document.createElement('button');
        copyButton.textContent = 'copy gif name'; // копировать
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(gifLabel).then(() => {
                showNotification(`Скопировано: ${gifLabel}`, 'success');
            }).catch(() => {
                showNotification('Ошибка копирования', 'error');
            });
        });
        container.appendChild(copyButton);

        // Вставляем контейнер в родительский элемент видео
        gif.parentElement.style.position = 'relative';
        gif.parentElement.appendChild(container);
    });
}

    // ========== Debounce для оптимизации ========== //
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedHidePosts = debounce(hidePosts, 200);

    // ========== Создание панели управления ========== //
    const panel = document.createElement("div");
    panel.id = "xpanelxfilter-xai-he5h5eh-controlPanel";  // Здесь задаем ID для панели (можно использовать для CSS или querySelector)
     
    panel.style.position = "fixed";
    panel.style.left = "1015px"; // Заменяем right на left
    panel.style.top = "89px"; // Заменяем bottom на top
    panel.style.width = "335px";
    panel.style.height = "710px";
    panel.style.padding = "8px";
    panel.style.fontFamily = "Arial, sans-serif";
    panel.style.backgroundColor = "#34506c";
    panel.style.color = "#fff";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    panel.style.zIndex = "9999";
    panel.style.overflow = "auto";
    panel.style.transition = "height 0.3s ease"; 

    // Принудительное применение стилей скроллбара для панели
    panel.style.scrollbarWidth = 'auto';
    panel.style.scrollbarColor = '#c1a5ef #205151';

    // NEW: Добавляем счетчик для GIF в панель
    panel.innerHTML = `
 <h3 style="
     margin: 0; 
    font-size: 16px;
 " id="panelHeader"> XFilter </h3>
  <div style="
    display: flex;
    align-items: center;
    gap: 20px;
    top: 20px;
    position: relative;
    width: 250px;
    left: 10px;
">
  <span id="counter-keywords" class="counter-span">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
   <title>File-earmark-text-fill SVG Icon</title>
   <path fill="currentColor" d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
   </svg>
    <span class="counter-number">0</span>
    <span class="counter-tooltip">Keywords</span>
  </span>

  <span id="counter-favorites" class="counter-span">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
  <title>User-favorite SVG Icon</title>
    <path fill="currentColor" d="M27.303 12a2.662 2.662 0 0 0-1.908.806l-.393.405l-.397-.405a2.662 2.662 0 0 0-3.816 0a2.8 2.8 0 0 0 0 3.896L25.002 21l4.209-4.298a2.8 2.8 0 0 0 0-3.896A2.662 2.662 0 0 0 27.303 12M2 30h2v-5a5.006 5.006 0 0 1 5-5h6a5.006 5.006 0 0 1 5 5v5h2v-5a7.008 7.008 0 0 0-7-7H9a7.008 7.008 0 0 0-7 7zM12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"/>
  </svg>
    <span class="counter-number">0</span>
    <span class="counter-tooltip">Favorite Users</span>
  </span>

  <span id="counter-blocked" class="counter-span">
    <svg class="counter-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="18" y1="8" x2="22" y2="12"/>
      <line x1="22" y1="8" x2="18" y2="12"/>
    </svg>
    <span class="counter-number">0</span>
    <span class="counter-tooltip">Blocked Users</span>
  </span>

  <span id="counter-gif" class="counter-span">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
    <title>Filetype-gif SVG Icon</title>
    <path fill="currentColor" fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2H9v-1h3a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.278 13.124a1.4 1.4 0 0 0-.14-.492a1.3 1.3 0 0 0-.314-.407a1.5 1.5 0 0 0-.48-.275a1.9 1.9 0 0 0-.636-.1q-.542 0-.926.229a1.5 1.5 0 0 0-.583.632a2.1 2.1 0 0 0-.199.95v.506q0 .408.105.745q.105.336.32.58q.213.243.533.377q.323.132.753.132q.402 0 .697-.111a1.29 1.29 0 0 0 .788-.77q.097-.261.097-.551v-.797H1.717v.589h.823v.255q0 .199-.09.363a.67.67 0 0 1-.273.264a1 1 0 0 1-.457.096a.87.87 0 0 1-.519-.146a.9.9 0 0 1-.305-.413a1.8 1.8 0 0 1-.096-.615v-.499q0-.547.234-.85q.237-.3.665-.301a1 1 0 0 1 .3.044q.136.044.236.126a.7.7 0 0 1 .17.19a.8.8 0 0 1 .097.25zm1.353 2.801v-3.999H3.84v4h.79Zm1.493-1.59v1.59h-.791v-3.999H7.88v.653H6.124v1.117h1.605v.638z"/>
    </svg>
    <span class="counter-number">0</span>
    <span class="counter-tooltip">GIF Blacklist</span>
  </span>
</div>

 <h4 class="version-text">v2.4.67</h4>
 <div style="display: flex;
       align-items: center;
       gap: 5px;
       margin: 10px 0;
      ">
 <input id="keywordInput" type="text" placeholder="Enter the word, @username or gif:keyword" style="
    width: calc(100% - 95px);
    height: 35px;
    padding: 0px;
    border-radius: 5px;
    border: none;
    background: #15202b;
    color: #fff;
      ">
 <button id="addKeyword" style="
    min-width: 75px;
    max-width: 80px;
    background: #203142;
    color: #a9b6c4;
    border: none;
    border-radius: 5px;
    height: 35px;
    font-size: 20px;
      ">Add it</button>
 </div>
 <div style="display: flex;
       flex-wrap: wrap;
       gap: 5px;
       position: relative;
      ">
 <div style="display: flex;
       align-items: center;
       gap: 5px;
      ">
 <div id="searchWrapper" style="position: relative;
      ">
 <input id="searchInput" type="text" placeholder="Search keywords or users" style="width: 240px;
    width: 235px;
    height: 35px;
    border-radius: 5px;
    border: none;
    background-color: #15202b;
    color: #fff;
      ">
 <span id="clearSearch" style="display: none;
       position: absolute;
       right: 10px;
       top: 50%;
       transform: translateY(-50%);
       color: #fff;
       cursor: pointer;
      "><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
  </div>
 <button id="openLanguagePopup" style="
       width: 75px; 
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 35px;
       font-size: 14px;
       font-weight: bold;
      ">Language Filtering</button>
 </div>
 <button id="exportKeywords" style="flex: 1;
       min-width: 75px;
       max-width: 70px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
      ">Export</button>
 <button id="importKeywords" style="flex: 1;
       min-width: 75px;
       max-width: 70px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
      ">Import</button>
 <button id="toggleBlockKeywords" style="flex: 1;
       min-width: 80px;
       max-width: 90px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
       font-size: 13px;
       font-weight: bold;
      ">Unblock All</button>
 <button id="clearKeywords" style="flex: 1;
       min-width: 75px;
       max-width: 80px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
      ">Clear all</button>
 <button id="toggleFavoriteUsers" style="width: 80px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
       font-size: 13px;
       font-weight: bold;
      ">Favorite Users</button>
 <button id="toggleBlockedUsers" style="width: 80px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
       font-size: 13px;
       font-weight: bold;
      ">Blocked Users</button>
 <button id="toggleVerifiedPosts" style="width: 242px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
       font-size: 13px;
       font-weight: bold;
      ">Hide verified accounts: Click to Enable</button>
 <button id="toggleNonVerifiedPosts" style="width: 242px;
      
       background: #203142;
       color: #a9b6c4;
       border: none;
       border-radius: 5px;
       height: 40px;
       font-size: 13px;
       font-weight: bold;
      ">Hide non-verified accounts: Turn ON</button>
 </div>
 <div id="listLabel" style="
     width: 222px;
     color: #15202b !important;
     font-size: 18px !important;
     top: 30px;
     position: relative;
     font-weight: 700;
 ">List of Keywords</div>
 <ul id="keywordList" style="
     list-style: none;
     padding: 0px;
     font-size: 14px;
     color: rgb(255, 255, 255);
     max-height: 275px;
     overflow-y: auto;
     background-color: rgb(21, 32, 43);
     box-shadow: inset rgb(0 0 0 / 31%) 0px 11px 24px 0px;
     user-select: text; 
     top: 19px;
 "></ul>
`;

    document.body.appendChild(panel);

    // ========== Функция обновления счетчиков ========== //
   function updateCounters() {
    document.querySelector("#counter-keywords .counter-number").textContent = hiddenKeywords.length;
    document.querySelector("#counter-favorites .counter-number").textContent = favoriteUsers.length;
    document.querySelector("#counter-blocked .counter-number").textContent = blockedUsers.length;
    document.querySelector("#counter-gif .counter-number").textContent = gifBlacklist.length;
}

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    searchInput.addEventListener("input", () => {
        clearSearch.style.display = searchInput.value.trim() ? "block" : "none";
        updateKeywordList();
        updateCounters();
    });

    clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        clearSearch.style.display = "none";
        updateKeywordList();
        updateCounters();
    });

    const lengthFilterInput = document.createElement("input");
    lengthFilterInput.type = "number";
    lengthFilterInput.placeholder = "Min length";
    lengthFilterInput.style.width = "80px";
    lengthFilterInput.style.marginTop = "10px";
    panel.appendChild(lengthFilterInput);

    lengthFilterInput.addEventListener("change", () => {
        debouncedHidePosts();
    });

    // ========== Перетаскивание панели ========== //
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    panel.addEventListener("mousedown", (event) => {
        // Проверяем, выделен ли текст
        if (window.getSelection().toString()) {
            return; // Если текст выделен, не начинаем перетаскивание
        }

        // Проверяем, что клик не по элементу управления
        const target = event.target;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "BUTTON" ||
            target.tagName === "UL" ||
            target.closest("#keywordList") ||
            target.closest("#clearSearch")
        ) {
            return; // Не начинаем перетаскивание
        }

        isDragging = true;
        offsetX = event.clientX - panel.offsetLeft;
        offsetY = event.clientY - panel.offsetTop;
        panel.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            panel.style.left = event.clientX - offsetX + "px";
            panel.style.top = event.clientY - offsetY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        panel.style.cursor = "move";
    });

    // ========== Создание попапа для языков ========== //
    const languagePopup = document.createElement("div");
    languagePopup.style.display = "none";
    languagePopup.style.position = "fixed";
    languagePopup.style.top = "100px";
    languagePopup.style.right = "65px";
    languagePopup.style.transform = "translate(-145%, 45%)";
    languagePopup.style.backgroundColor = " #34506c";
    languagePopup.style.padding = "20px";
    languagePopup.style.borderRadius = "8px";
    languagePopup.style.zIndex = "10000";
    languagePopup.style.width = "288px";
    languagePopup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    languagePopup.style.fontFamily = "Arial, sans-serif";

    for (const language in languageFilters) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `lang-${language}`;
        checkbox.name = language;

        const label = document.createElement("label");
        label.htmlFor = `lang-${language}`;
        label.textContent = language.charAt(0).toUpperCase() + language.slice(1);

        const wrapper = document.createElement("div");
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        languagePopup.appendChild(wrapper);
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.fontSize = "22px";
    closeButton.style.position = "relative";
    closeButton.style.width = "40px";
    closeButton.style.height = "40px";
    closeButton.style.borderRadius = "50%";
    closeButton.style.backgroundColor = "#203142";
    closeButton.style.color = " rgb(237 131 123) ";
    closeButton.style.border = "none";
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
    closeButton.style.cursor = "pointer"; 
    closeButton.style.left = "1%";
    closeButton.style.top = "20px";
    closeButton.addEventListener("click", () => {
        languagePopup.style.display = "none";
    });
    languagePopup.appendChild(closeButton);

    document.body.appendChild(languagePopup);

    document.getElementById("openLanguagePopup").addEventListener("click", () => {
        languagePopup.style.display = "block";
    });

    const warningText = document.createElement("div");
    warningText.textContent = "⚠️ Careful, it might stop working if it lags";
    warningText.style.color = " #ffcc00";
    warningText.style.fontSize = "14px";
    warningText.style.marginBottom = "10px";
    warningText.style.textAlign = "end";
    warningText.style.right = "0px";
    warningText.style.position = "relative";
    warningText.style.top = "25px";
     warningText.style.width = "260px";
    languagePopup.appendChild(warningText);

    for (const language in languageFilters) {
        document.getElementById(`lang-${language}`).addEventListener("change", () => {
            updateLanguageFilter(language);
        });
    }

   // ========== Стили для подсветки, скроллбара и выравнивания кнопок ========== //
const style = document.createElement("style");
style.textContent = `
button {
        transition: box-shadow 0.3s, transform 0.3s, background-color 0.3s;
    }
    button:hover {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
    }
    button:active {
        transform: scale(0.95);
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
    }
    button.active,
    #toggleVerifiedPosts.active,
    #toggleNonVerifiedPosts.active,
    #toggleFavoriteUsers.active,
    #toggleBlockedUsers.active {
          background: linear-gradient(5deg, rgb(74 169 117), rgb(7 100 54)) !important;
          box-shadow: 0 0 8px rgb(216 240 253 / 51%) !important;
          color: rgb(21 32 43) !important;
    }
    .version-text {
        left: 275px;
        position: relative;
        bottom: 18px;
        color: #15202b;
        margin: 0;
        font-size: 14px;
        width: 47px;
    }
    #keywordInput {
        cursor: pointer;
        background: #15202b;
    }
    #favoriteUserButton:hover img {
        filter: brightness(1.2);
    }
    #favoriteUserButton:active img {
        transform: scale(0.9);
    }
  #keywordList button {
    background-color: transparent; /* Убираем красный фон */
    color: #f44336; /* Цвет иконки (красный, как раньше) */
    border: none;
    border-radius: 3px;
    cursor: pointer;
    width: 24px; /* Фиксированная ширина для SVG */
    height: 24px; /* Фиксированная высота для SVG */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; /* Убираем отступы для центрирования */
}
  ul#keywordList {
     width: 325px !important;
}
#keywordList li {
    width: 290px !important;
} 
 
 
#keywordList li { 
    border-top: 2px solid #1c6596;
    color: rgb(159 173 182);
}
 

 #keywordList {  
    border: 1px solid #1c6596;
    border-radius: 10px;
    background-color: rgb(21, 32, 43); 
}


h3#panelHeader {
    width: 140px;
    color: #15202b;
}


 

 #keywordList {
  width: 300px !important !important;
  overflow-x: hidden !important;
}
#keywordList li {  
    border-top: 2px solid #1c6596;
    color: rgb(136 151 161);
}
    #keywordList li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
    }
    #keywordList li button {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
 #keywordList {
    height: 400px; /* Фиксированная высота viewport, подберите под дизайн */
    overflow-y: auto; /* Скроллбар только по вертикали */
    position: relative; /* Для абсолютного позиционирования элементов */
}
#keywordList li {
    height: 40px; /* Фиксированная высота каждого элемента, для точного расчёта */
    line-height: 40px; /* Выравнивание текста */
    display: flex;
    justify-content: space-between;
    align-items: center;
}
   /*------ NEW: Стили для контейнера GIF и кнопок---------- */
.gif-control-container {
    position: absolute;
    bottom: 65px;
    left: 35px;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgb(0 0 0 / 49%);
    padding: 0px 4px;
    border-radius: 8px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    color: #87fff5;
    font-size: 11px;
    opacity: 0; /* Скрыт по умолчанию */
    visibility: hidden; /* Скрыт по умолчанию */
    transition: opacity 0.3s ease, visibility 0.3s ease; /* Плавное появление */
}

/* Показываем контейнер при наведении на элемент с data-testid="tweetPhoto" */
div[data-testid="tweetPhoto"]:hover .gif-control-container {
    opacity: 1;
    visibility: visible;
}

.gif-control-container .gif-label {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.gif-control-container button {
       padding: 3px 5px;
    background: #34506c;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 11px;
}
.gif-control-container button:hover {
    background: #3b5a7b;
}
.gif-control-container button:active {
    transform: scale(0.95);
}
    /* Стили для кастомных тултипов */
.counter-span {
    position: relative;
    cursor: help; /* Курсор-подсказка при наведении */
}
#counter-keywords:hover,
#counter-gif:hover,
#counter-blocked:hover,
#counter-favorites:hover {
    color: #00ffad  !important;
    scale: 1.5  !important;
}  



#counter-favorites {
    color: #ffc400;
}

 
#counter-blocked {
    color: #ea7878;
}

#counter-gif {
    color: rgb(45 154 118);
}

#counter-keywords {
    color: #00a5ff;
}

.counter-tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 93%; /* Позиция над элементом */
    left: 50%;
    transform: translateX(-50%);
    background-color: #15202b; /* Цвет фона   */
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100000;
    transition: opacity 0.3s, visibility 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    border: 1px solid #203142;
}

.counter-span:hover .counter-tooltip {
    visibility: visible;
    opacity: 1;
} 


.counter-tooltip::after {
    content: "";
    position: absolute;
    top: 100%; /* Стрелка вниз */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #15202b transparent transparent transparent;
}
    .counter-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 2px;
}
#clearSearch svg {
    width: 18px;
    height: 18px;
}
 input[id^="lang-"] {
    appearance: none !important;
    background: #2c4561 !important;
    border: 2px solid rgb(21, 32, 43);
    border-radius: 5px !important;
    width: 20px;
    height: 20px;
}
input[id^="lang-"]:checked {
    background: #243a51 !important; /* Цвет при выборе */
    border-color: #d7b415 !important; /* Зелёная рамка при выборе */
}
input[id^="lang-"]:checked::after {
    content: "✓"; /* Галочка при выборе */
    position: absolute; 
    left: 9%; 
    color: rgb(215 180 21);
    font-size: 14px;
    font-weight: bold;
}
label[for^="lang-"] {
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
}
div:has(input[id^="lang-"]) {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

    /* Стили для скроллбара (замена GM_addStyle) */
    #keywordList:hover::-webkit-scrollbar {
        width: 25px !important;
    }
    #keywordList::-webkit-scrollbar {
        width: 18px !important;
    }
    
    #keywordList {
        scrollbar-width: auto;
        scrollbar-color: auto ;
    }
`;
document.head.appendChild(style);

// Принудительное применение стилей скроллбара (опционально, для немедленного эффекта)
const keywordList = document.getElementById("keywordList");
if (keywordList) {
    keywordList.style.scrollbarColor = 'auto';
    keywordList.style.scrollbarWidth = 'auto';
}

    // ========== Кнопка переключения панели FilterX ========== //
    let isSwitchOn = localStorage.getItem("isSwitchOn") === "true";
    const toggleButton = document.createElement("div");
    toggleButton.style.display = "flex";
    toggleButton.style.alignItems = "center";
    toggleButton.style.gap = "10px";
    toggleButton.style.background = " #15202b";
    toggleButton.style.border = "4px solid #6c7e8e";
    toggleButton.style.borderRadius = "45px";
    toggleButton.style.padding = "8px 12px";
    toggleButton.style.marginTop = "10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.width = "auto";
    toggleButton.className = "css-175oi2r r-16y2uox";

    function isGrokPage() {
        return window.location.href.startsWith("https://x.com/i/grok");
    }

    const toggleLabel = document.createElement("label");
    toggleLabel.style.display = "inline-block";
    toggleLabel.style.width = "50px";
    toggleLabel.style.height = "25px";
    toggleLabel.style.borderRadius = "25px";
    toggleLabel.style.backgroundColor = isSwitchOn ? " #425364" : " #0d1319";
    toggleLabel.style.position = "relative";
    toggleLabel.style.cursor = "pointer";
    toggleLabel.style.transition = "background-color 0.3s";
    toggleLabel.style.top = "0px";
    toggleLabel.style.left = "75px";

    const toggleSwitch = document.createElement("div");
    toggleSwitch.style.position = "absolute";
    toggleSwitch.style.width = "21px";
    toggleSwitch.style.height = "21px";
    toggleSwitch.style.borderRadius = "50%";
    toggleSwitch.style.backgroundColor = " #6c7e8e";
    toggleSwitch.style.top = "2px";
    toggleSwitch.style.left = isSwitchOn ? "calc(100% - 23px)" : "2px";
    toggleSwitch.style.transition = "left 0.3s ease";
    toggleSwitch.style.boxShadow = "rgb(21, 32, 43) -1px 1px 4px 1px";

    function toggleSwitchState(event) {
        event.stopPropagation();
        isSwitchOn = !isSwitchOn;
        localStorage.setItem("isSwitchOn", isSwitchOn.toString());
        toggleSwitch.style.left = isSwitchOn ? "calc(100% - 23px)" : "2px";
        toggleLabel.style.backgroundColor = isSwitchOn ? " #425364" : " #0d1319";

        if (isSwitchOn) {
            panel.style.display = "block";
            setTimeout(() => {
                panel.style.height = "710px";
            }, 10);
        } else {
            panel.style.height = "0px";
            setTimeout(() => {
                panel.style.display = "none";
            }, 300);
        }
        isPanelVisible = isSwitchOn;
        localStorage.setItem("panelVisible", isPanelVisible.toString());
    }

    const debouncedToggleSwitchState = debounce(toggleSwitchState, 300);

    toggleButton.addEventListener("click", debouncedToggleSwitchState);
    toggleLabel.appendChild(toggleSwitch);
    toggleButton.appendChild(toggleLabel);

    const toggleText = document.createElement("span");
    toggleText.textContent = "FilterX";
    toggleText.style.color = " #6c7e8e";
    toggleText.style.fontFamily = "Arial, sans-serif";
    toggleText.style.fontSize = "16px";
    toggleText.style.fontWeight = "bold";
    toggleText.style.position = "absolute";
    toggleText.style.top = "12px";
    toggleText.style.left = "25px";
    toggleButton.appendChild(toggleText);

    function waitForPostButton(callback) {
        const interval = setInterval(() => {
            const postButton = document.querySelector("[data-testid='SideNav_NewTweet_Button']");
            const postButtonContainer = postButton?.parentElement;
            if (postButtonContainer) {
                clearInterval(interval);
                callback(postButtonContainer);
            } else {
                console.warn("Контейнер кнопки 'Опубликовать пост' не найден");
            }
        }, 500);
    }

    waitForPostButton((postButtonContainer) => {
        toggleButton.style.display = isGrokPage() ? "none" : "flex";
        postButtonContainer.appendChild(toggleButton);
    });

    // ========== Управление высотой панели ========== //
    let isPanelVisible = localStorage.getItem("panelVisible") === "true";

    function togglePanel() {
        if (isPanelVisible) {
            panel.style.height = "0px";
            setTimeout(() => {
                panel.style.display = "none";
            }, 300);
        } else {
            panel.style.display = "block";
            setTimeout(() => {
                panel.style.height = "710px";
            }, 10);
        }
        isPanelVisible = !isPanelVisible;
        localStorage.setItem("panelVisible", isPanelVisible.toString());
    }

    toggleButton.addEventListener("click", togglePanel);

    if (isPanelVisible) {
        panel.style.height = "710px";
        panel.style.display = "block";
    } else {
        panel.style.height = "0px";
        panel.style.display = "none";
    }

    // ========== Элементы управления ========== //
    const addKeywordBtn = document.getElementById("addKeyword");
    const clearKeywordsBtn = document.getElementById("clearKeywords");
    const exportKeywordsBtn = document.getElementById("exportKeywords");
    const importKeywordsBtn = document.getElementById("importKeywords");
    const toggleVerifiedBtn = document.getElementById("toggleVerifiedPosts");
    const toggleNonVerifiedBtn = document.getElementById("toggleNonVerifiedPosts");
    const toggleBlockBtn = document.getElementById("toggleBlockKeywords");
    const openLanguagePopupBtn = document.getElementById("openLanguagePopup");
    const toggleFavoriteUsersBtn = document.getElementById("toggleFavoriteUsers");
    const toggleBlockedUsersBtn = document.getElementById("toggleBlockedUsers");

    // ========== Обработчики событий ========== //
    // NEW: Модифицированный обработчик добавления с поддержкой gif:
    addKeywordBtn.addEventListener("click", () => {
        const inputValue = keywordInput.value.trim().toLowerCase();
        if (inputValue) {
            if (inputValue.startsWith("gif:")) {
                const gifKeyword = inputValue.slice(4).trim();
                if (gifKeyword && !gifBlacklist.includes(gifKeyword)) {
                    gifBlacklist.push(gifKeyword);
                    saveGifBlacklist();
                    showNotification(`Добавлено в черный список GIF: ${gifKeyword}`, 'success');
                } else {
                    showNotification(`Ключевое слово GIF уже существует: ${gifKeyword}`, 'error');
                }
            } else if (displayMode === "favorites" && inputValue.startsWith("@")) {
                const username = inputValue.slice(1);
                if (!favoriteUsers.includes(username)) {
                    favoriteUsers.push(username);
                    saveFavoriteUsers();
                    showNotification(`Добавлен в избранное: @${username}`, 'success');
                } else {
                    showNotification(`@${username} уже в избранном`, 'error');
                }
            } else if (displayMode === "blocked" && inputValue.startsWith("@")) {
                const username = inputValue.slice(1);
                if (!blockedUsers.includes(username)) {
                    blockedUsers.push(username);
                    saveBlockedUsers();
                    showNotification(`Заблокирован: @${username}`, 'success');
                } else {
                    showNotification(`@${username} уже заблокирован`, 'error');
                }
            } else if (displayMode === "keywords" && !hiddenKeywords.includes(inputValue)) {
                hiddenKeywords.push(inputValue);
                saveKeywords();
                showNotification(`Добавлено ключевое слово: ${inputValue}`, 'success');
            } else {
                showNotification(`Ключевое слово уже существует: ${inputValue}`, 'error');
            }
            keywordInput.value = "";
            updateKeywordList();
            updateCounters();
            debouncedHidePosts();
        }
    });

    toggleNonVerifiedBtn.textContent = `Hide non-verified accounts: ${hideNonVerifiedAccounts ? "Turn OFF" : "Turn ON"}`;
    toggleNonVerifiedBtn.addEventListener("click", () => {
        hideNonVerifiedAccounts = !hideNonVerifiedAccounts;
        localStorage.setItem("hideNonVerifiedAccounts", JSON.stringify(hideNonVerifiedAccounts));
        toggleNonVerifiedBtn.textContent = `Hide non-verified accounts: ${hideNonVerifiedAccounts ? "Turn OFF" : "Turn ON"}`;
        toggleNonVerifiedBtn.classList.toggle('active', hideNonVerifiedAccounts);
        hidePosts();
    });

    clearKeywordsBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the list?")) {
            if (displayMode === "favorites") {
                favoriteUsers = [];
                saveFavoriteUsers();
            } else if (displayMode === "blocked") {
                blockedUsers = [];
                saveBlockedUsers();
            // NEW: Очистка GIF-списка, если режим keywords
            } else if (displayMode === "keywords") {
                hiddenKeywords = [];
                gifBlacklist = [];
                unblockedKeywords = [];
                saveKeywords();
                saveGifBlacklist();
                saveUnblockedKeywords();
            }
            updateKeywordList();
            updateCounters();
            hidePosts();
        }
    });

    // NEW: Модифицированный экспорт с поддержкой GIF
    exportKeywordsBtn.addEventListener("click", () => {
        let data, baseName, nameWord;
        if (displayMode === "favorites") {
            data = favoriteUsers;
            baseName = "favorite_users";
            nameWord = "users";
        } else if (displayMode === "blocked") {
            data = blockedUsers;
            baseName = "blocked_users";
            nameWord = "users";
        } else {
            data = { keywords: hiddenKeywords, gif: gifBlacklist }; // NEW: Экспорт как объект с GIF
            baseName = "hidden_keywords_and_gif";
            nameWord = "items";
        }
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const count = displayMode === "keywords" ? hiddenKeywords.length + gifBlacklist.length : data.length;
        const fileName = `${baseName}_${count}_${nameWord}.json`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    });

    // NEW: Модифицированный импорт с поддержкой GIF
    importKeywordsBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const importedData = JSON.parse(reader.result);
                    if (displayMode === "favorites" || displayMode === "blocked") {
                        const list = Array.isArray(importedData) ? importedData : [];
                        if (displayMode === "favorites") {
                            favoriteUsers = [...new Set([...favoriteUsers, ...list.map(u => u.startsWith("@") ? u.slice(1) : u)])];
                            saveFavoriteUsers();
                        } else {
                            blockedUsers = [...new Set([...blockedUsers, ...list.map(u => u.startsWith("@") ? u.slice(1) : u)])];
                            saveBlockedUsers();
                        }
                    } else if (displayMode === "keywords") {
                        if (Array.isArray(importedData)) {
                            hiddenKeywords = [...new Set([...hiddenKeywords, ...importedData])];
                        } else if (typeof importedData === 'object') {
                            hiddenKeywords = [...new Set([...hiddenKeywords, ...(importedData.keywords || [])])];
                            gifBlacklist = [...new Set([...gifBlacklist, ...(importedData.gif || [])])];
                            saveGifBlacklist();
                        }
                        saveKeywords();
                    }
                    updateKeywordList();
                    updateCounters();
                    hidePosts();
                } catch (e) {
                    alert("Error reading the file.");
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });

    toggleBlockBtn.addEventListener("click", () => {
        if (displayMode === "keywords") {
            if (hiddenKeywords.length > 0 || gifBlacklist.length > 0) {
                unblockedKeywords = [...hiddenKeywords, ...gifBlacklist.map(k => `gif:${k}`)]; // NEW: Сохраняем GIF с префиксом
                hiddenKeywords = [];
                gifBlacklist = [];
                toggleBlockBtn.textContent = "Block All";
            } else {
                hiddenKeywords = unblockedKeywords.filter(k => !k.startsWith("gif:"));
                gifBlacklist = unblockedKeywords.filter(k => k.startsWith("gif:")).map(k => k.slice(4));
                unblockedKeywords = [];
                toggleBlockBtn.textContent = "Unblock All";
            }
            saveKeywords();
            saveGifBlacklist();
            saveUnblockedKeywords();
            updateKeywordList();
            updateCounters();
            hidePosts();
        }
    });

    toggleBlockBtn.textContent = hiddenKeywords.length > 0 || gifBlacklist.length > 0 ? "Unblock All" : "Block All";

    toggleVerifiedBtn.addEventListener("click", () => {
        hideVerifiedAccounts = !hideVerifiedAccounts;
        toggleVerifiedBtn.textContent = `Hide verified accounts: ${hideVerifiedAccounts ? "Turn OFF" : "Turn ON"}`;
        toggleVerifiedBtn.classList.toggle('active', hideVerifiedAccounts);
        hidePosts();
    });

    toggleFavoriteUsersBtn.addEventListener("click", () => {
        displayMode = displayMode === "favorites" ? "keywords" : "favorites";
        toggleFavoriteUsersBtn.textContent = displayMode === "favorites" ? "Keywords" : "Favorite Users";
        toggleBlockedUsersBtn.textContent = "Blocked Users";
        keywordInput.placeholder = displayMode === "favorites" || displayMode === "blocked" ? "Enter @username" : "Enter the word or gif:keyword"; // NEW: Уточнение плейсхолдера

        toggleFavoriteUsersBtn.classList.toggle('active', displayMode === "favorites");
        toggleBlockedUsersBtn.classList.remove('active');
        updateKeywordList();
        updateCounters();
    });

    toggleBlockedUsersBtn.addEventListener("click", () => {
        displayMode = displayMode === "blocked" ? "keywords" : "blocked";
        toggleBlockedUsersBtn.textContent = displayMode === "blocked" ? "Keywords" : "Blocked Users";
        toggleFavoriteUsersBtn.textContent = "Favorite Users";
        keywordInput.placeholder = displayMode === "favorites" || displayMode === "blocked" ? "Enter @username" : "Enter the word or gif:keyword"; // NEW: Уточнение плейсхолдера

        toggleBlockedUsersBtn.classList.toggle('active', displayMode === "blocked");
        toggleFavoriteUsersBtn.classList.remove('active');
        updateKeywordList();
        updateCounters();
    });

    openLanguagePopupBtn.addEventListener("click", () => {
        const panelRect = panel.getBoundingClientRect();
        languagePopup.style.top = `${panelRect.top - 320}px`;
        languagePopup.style.left = `${panelRect.right - 10}px`;
        languagePopup.style.display = "block";
    });

   // ========== Обновление списка ключевых слов, избранных или заблокированных пользователей ========== //
function updateKeywordList() {
    const list = document.getElementById("keywordList");
    const label = document.getElementById("listLabel");
    const searchQuery = searchInput.value.trim().toLowerCase();
    list.innerHTML = ""; // Оставляем, чтобы очистить при обновлении

    if (displayMode === "favorites") {
        label.textContent = "Favorite Users";
        const tempData = favoriteUsers.filter(user => user.toLowerCase().includes(searchQuery)).map(user => ({ type: 'user', value: user }));
       filteredData = tempData; // Используем полный массив без обрезки
if (filteredData.length === 0) {
    list.innerHTML = searchQuery ? "<li>No matches found</li>" : "<li>Нет</li>";
} else {
    renderVisibleItems(list);
}
    } else if (displayMode === "blocked") {
        label.textContent = "Blocked Users";
        const tempData = blockedUsers.filter(user => user.toLowerCase().includes(searchQuery)).map(user => ({ type: 'user', value: user }));
      filteredData = tempData; // Используем полный массив без обрезки
if (filteredData.length === 0) {
    list.innerHTML = searchQuery ? "<li>No matches found</li>" : "<li>Нет</li>";
} else {
    renderVisibleItems(list);
}
    } else {
        label.textContent = "List of Keywords and GIF";
        const allItems = [
            ...hiddenKeywords.map(k => ({ type: 'keyword', value: k })),
            ...gifBlacklist.map(k => ({ type: 'gif', value: `gif:${k}` }))
        ];
        const tempData = allItems.filter(item => item.value.toLowerCase().includes(searchQuery));
       filteredData = tempData; // Используем полный массив без обрезки
if (filteredData.length === 0) {
    list.innerHTML = searchQuery ? "<li>No matches found</li>" : "<li>Нет</li>";
} else {
    renderVisibleItems(list);
}
    }

    if (filteredData.length > 0) {
        list.removeEventListener('scroll', handleScroll);
        list.addEventListener('scroll', handleScroll);
    }
}

function renderVisibleItems(container) {
    const scrollTop = container.scrollTop;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2; // Видимые + буфер (2 сверху/снизу)
    const endIndex = Math.min(startIndex + visibleCount, filteredData.length);

    container.innerHTML = "";

    for (let i = startIndex; i < endIndex; i++) {
        const item = filteredData[i];
        const listItem = document.createElement("li");
        listItem.style.position = 'absolute';
        listItem.style.top = `${i * itemHeight}px`;
        listItem.style.width = '100%';
        listItem.textContent = item.value;

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24"
          shape-rendering="geometricPrecision" 
          text-rendering="geometricPrecision" 
          image-rendering="optimizeQuality" 
          fill-rule="evenodd" 
          clip-rule="evenodd" 
          viewBox="0 0 456 511.82">
          <path fill=" #FD3B3B" 
          d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
 <style xmlns="http://www.w3.org/1999/xhtml" 
          id="mh1i307m.ol">
::selection {
      background: #d0fefe4f !important;
      color: #bee4e0 !important;
}
::-moz-selection {
    background: #d0fefe4f !important;
    color: #bee4e0 !important;
}        
</style></svg>
        `;
        deleteButton.style.border = "none";
        deleteButton.style.borderRadius = "3px";
        deleteButton.style.cursor = "pointer";

        deleteButton.addEventListener("click", () => {
            if (item.type === 'gif') {
                const gifKeyword = item.value.slice(4);
                gifBlacklist.splice(gifBlacklist.indexOf(gifKeyword), 1);
                saveGifBlacklist();
                showNotification(`Удалено из GIF: ${gifKeyword}`, 'success');
            } else if (item.type === 'user' && displayMode === 'favorites') {
                favoriteUsers.splice(favoriteUsers.indexOf(item.value), 1);
                saveFavoriteUsers();
                showNotification(`Removed @${item.value} from favorites`, 'success');
            } else if (item.type === 'user' && displayMode === 'blocked') {
                blockedUsers.splice(blockedUsers.indexOf(item.value), 1);
                saveBlockedUsers();
                showNotification(`Unblocked @${item.value}`, 'success');
            } else {
                hiddenKeywords.splice(hiddenKeywords.indexOf(item.value), 1);
                saveKeywords();
                showNotification(`Удалено ключевое слово: ${item.value}`, 'success');
            }
            updateKeywordList();
            updateCounters();
            hidePosts();
        });

        listItem.appendChild(deleteButton);
        container.appendChild(listItem);
    }

    // Ограничиваем высоту до 10 элементов
    container.style.height = `${filteredData.length * itemHeight}px`; // Полная виртуальная высота
}

//  обработчик скролла
function handleScroll() {
    renderVisibleItems(this);
}

    // ========== Создание кнопки избранного в профиле ========== //
    function addFavoriteButtonToProfile() {
        const checkProfileLoaded = setInterval(() => {
            const buttonContainer = document.querySelector('.css-175oi2r.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs') ||
                                   document.querySelector('[data-testid="userActions"]');
            const username = getUsernameFromProfile();

            if (buttonContainer && username && !buttonContainer.querySelector('#favoriteUserButton')) {
                clearInterval(checkProfileLoaded);

                const isFavorite = favoriteUsers.includes(username);

                const favoriteButton = document.createElement('button');
                favoriteButton.id = 'favoriteUserButton';
                favoriteButton.setAttribute('aria-label', isFavorite ? 'Удалить из избранного' : 'Добавить в избранное');
                favoriteButton.setAttribute('role', 'button');
                favoriteButton.type = 'button';
                favoriteButton.className = 'css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-6gpygo r-1wron08 r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l css-175oi2r r-18u37iz r-1wtj0ep';
                favoriteButton.style.borderColor = 'rgb(83, 100, 113)';
                favoriteButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';

                const buttonContent = document.createElement('div');
                buttonContent.dir = 'ltr';
                buttonContent.className = 'css-146c3p1 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci';
                buttonContent.style.color = 'rgb(239, 243, 244)';

                const icon = document.createElement('img');
                icon.src = 'data:image/png;base64,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';
                icon.style.width = '25px';
                icon.style.height = '25px';
                icon.style.filter = isFavorite ? 'hue-rotate(300deg) saturate(2)' : 'none';
                icon.setAttribute('aria-hidden', 'true');
                icon.className = 'r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03';

                buttonContent.appendChild(icon);
                favoriteButton.appendChild(buttonContent);

                favoriteButton.addEventListener('click', () => {
                    const currentlyFavorite = favoriteUsers.includes(username);
                    if (currentlyFavorite) {
                        favoriteUsers = favoriteUsers.filter(user => user !== username);
                        favoriteButton.setAttribute('aria-label', 'Добавить в избранное');
                        icon.style.filter = 'none';
                    } else {
                        favoriteUsers.push(username);
                        favoriteButton.setAttribute('aria-label', 'Удалить из избранного');
                        icon.style.filter = 'hue-rotate(300deg) saturate(2)';
                    }
                    saveFavoriteUsers();
                    updateKeywordList();
                    updateCounters();
                    debouncedHidePosts();
                });

                buttonContainer.insertBefore(favoriteButton, buttonContainer.firstChild);
                console.log('Favorite button added for:', username);
            }
        }, 500);

        setTimeout(() => clearInterval(checkProfileLoaded), 5000);
    }

    // ========== Автоматическое скрытие панели при открытии фото ========== //
    function isPhotoViewerOpen() {
        const currentUrl = window.location.href;
        const isPhotoOpen = /\/photo\/\d+$/.test(currentUrl);
        const photoModal = document.querySelector('div[aria-label="Image"]') || document.querySelector('div[data-testid="imageViewer"]');
        return isPhotoOpen || !!photoModal;
    }

    function updateToggleButtonVisibility() {
        toggleButton.style.display = isGrokPage() ? "none" : "flex";
    }

    function toggleElementsVisibility() {
        const isPhotoOpen = isPhotoViewerOpen();
        if (isPhotoOpen || isGrokPage()) {
            panel.style.display = "none";
            toggleButton.style.display = "none";
        } else {
            if (isPanelVisible) {
                panel.style.display = "block";
                panel.style.height = "710px";
            }
            toggleButton.style.display = "flex";
        }
    }

    // ========== Наблюдение за изменениями DOM ========== //
   const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        // Игнорируем изменения, связанные с .gif-control-container
        if (mutation.target.classList?.contains('gif-control-container')) {
            continue;
        }
        debouncedHidePosts();
        break; // Обрабатываем только первое релевантное изменение
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false // Игнорируем изменения атрибутов, если не нужны
});

    const profileObserver = new MutationObserver(() => {
        if (window.location.href.includes('x.com/') && !window.location.href.includes('/status/')) {
            addFavoriteButtonToProfile();
        }
    });
    profileObserver.observe(document.body, { childList: true, subtree: true });

    toggleElementsVisibility();
    window.addEventListener("popstate", () => {
        updateToggleButtonVisibility();
        toggleElementsVisibility();
    });

    const urlObserver = new MutationObserver(() => {
        updateToggleButtonVisibility();
        toggleElementsVisibility();
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", (event) => {
        if (event.target.closest('div[aria-label="Close"]') || event.target.closest('div[data-testid="imageViewer-close"]')) {
            setTimeout(toggleElementsVisibility, 100);
        }
    });

    // ========== Инициализация ========== //
    updateKeywordList();
    updateCounters();
    hidePosts();

    // Добавим инициализацию активного состояния при загрузке
    document.addEventListener('DOMContentLoaded', () => {
        toggleVerifiedBtn.classList.toggle('active', hideVerifiedAccounts);
        toggleNonVerifiedBtn.classList.toggle('active', hideNonVerifiedAccounts);
        toggleFavoriteUsersBtn.classList.toggle('active', displayMode === "favorites");
        toggleBlockedUsersBtn.classList.toggle('active', displayMode === "blocked");
    });

})();








