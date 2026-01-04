// ==UserScript==
// @name         YouTube Supercharged: Grid Search & Channel Preloader
// @namespace    https://greasyfork.org/users/1435316
// @version      4.4
// @description  Combines "YouTube Grid Auto-Scroll & Search" for finding videos in grids/feeds with "YouTube Channel Full Video Preloader" for loading all videos on a channel page and opening them.
// @author       Your Name & AI Assistant
// @match        https://www.youtube.com/@*/videos*
// @match        https://www.youtube.com/c/*/videos*
// @match        https://www.youtube.com/user/*/videos*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528504/YouTube%20Supercharged%3A%20Grid%20Search%20%20Channel%20Preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/528504/YouTube%20Supercharged%3A%20Grid%20Search%20%20Channel%20Preloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Variables for YouTube Grid Auto-Scroll & Search ---
    let targetText = "";
    let searchBox;
    let isSearching = false;
    let searchInput;
    let searchButton;
    let stopButton;
    let prevButton;
    let nextButton;
    let scrollContinuationTimeout;
    let overallSearchTimeout;
    const SEARCH_TIMEOUT_MS = 20000;
    const SCROLL_DELAY_MS = 750;
    const MAX_SEARCH_LENGTH = 255;
    let highlightedElements = [];
    let currentHighlightIndex = -1;
    let lastScrollHeight = 0;
    let hasScrolledToResultThisSession = false;

    // --- Variables for YouTube Channel Full Video Preloader ---
    let preloadButtonPreloader; // Renamed to avoid any potential abstract conflict
    let isLoadingStatePreloader = false; // Renamed for clarity

    // --- Combined Styles ---
    GM_addStyle(`
        /* Styles for YouTube Grid Auto-Scroll & Search */
        #floating-search-box {
            background-color: #222;
            padding: 5px;
            border: 1px solid #444;
            border-radius: 5px;
            display: flex;
            align-items: center;
            margin-left: 10px;
        }
        @media (max-width: 768px) {
            #floating-search-box input[type="text"] {
                width: 150px;
            }
        }
        #floating-search-box input[type="text"] {
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            padding: 3px 5px;
            border-radius: 3px;
            margin-right: 5px;
            width: 200px;
            height: 30px;
        }
        #floating-search-box input[type="text"]:focus {
            outline: none;
            border-color: #065fd4;
        }
        #floating-search-box button {
            background-color: #065fd4;
            color: white;
            border: none;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            height: 30px;
        }
        #floating-search-box button:hover {
            background-color: #0549a8;
        }
        #floating-search-box button:focus {
            outline: none;
        }
        #stop-search-button {
            background-color: #aa0000;
        }
        #stop-search-button:hover {
             background-color: #800000;
        }
        #prev-result-button, #next-result-button {
            background-color: #444;
            color: white;
            margin: 0 3px;
        }
        #prev-result-button:hover, #next-result-button:hover {
            background-color: #555;
        }
        .highlighted-text {
            position: relative;
            z-index: 1;
        }
        .highlighted-text::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid transparent;
          border-radius: 8px;
          background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
          background-size: 400% 400%;
          animation: gradientAnimation 5s ease infinite;
          z-index: -1;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        #search-error-message {
            color: red;
            font-weight: bold;
            padding: 5px;
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            z-index: 10000;
            display: none;
         }
        #search-no-results-message {
            color: #aaa;
            padding: 5px;
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 5px;
            z-index: 10000;
            display: none;
         }

        /* Styles for YouTube Channel Full Video Preloader */
        #yt-channel-full-preload-button {
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 9999; /* Slightly lower than search messages */
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.3);
            transition: background-color 0.3s ease, opacity 0.3s ease;
        }
        #yt-channel-full-preload-button:hover {
            background-color: #0056b3;
        }
        #yt-channel-full-preload-button:disabled {
            background-color: #AAAAAA;
            cursor: not-allowed;
            opacity: 0.7;
        }
    `);

    // --- Functions for YouTube Grid Auto-Scroll & Search ---
    function ensureSearchBoxAttached() {
        if (searchBox && !document.body.contains(searchBox)) {
            console.log("YouTube Grid Auto-Scroll: Search box detached, attempting to re-attach.");
            const mastheadEnd = document.querySelector('#end.ytd-masthead');
            const buttonsContainer = document.querySelector('#end #buttons');
            if (mastheadEnd) {
                if (buttonsContainer) {
                    mastheadEnd.insertBefore(searchBox, buttonsContainer);
                } else {
                    mastheadEnd.appendChild(searchBox);
                }
            } else {
                console.error("YouTube Grid Auto-Scroll: Could not find masthead to re-attach search box.");
                if (!document.body.contains(searchBox)) {
                    document.body.insertBefore(searchBox, document.body.firstChild);
                }
            }
        }
    }

    function createSearchBox() {
        if (document.getElementById('floating-search-box')) return; // Already exists

        searchBox = document.createElement('div');
        searchBox.id = 'floating-search-box';
        searchBox.setAttribute('role', 'search');

        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Поиск для прокрутки...';
        searchInput.value = '';
        searchInput.setAttribute('aria-label', 'Search within YouTube grid');
        searchInput.maxLength = MAX_SEARCH_LENGTH;

        searchButton = document.createElement('button');
        searchButton.textContent = 'Поиск';
        searchButton.addEventListener('click', () => {
            stopSearch();
            isSearching = true;
            hasScrolledToResultThisSession = false;
            currentHighlightIndex = -1;
            searchAndScroll();
        });
        searchButton.setAttribute('aria-label', 'Start search');

        prevButton = document.createElement('button');
        prevButton.textContent = 'Пред.';
        prevButton.id = 'prev-result-button';
        prevButton.addEventListener('click', () => navigateResults(-1));
        prevButton.setAttribute('aria-label', 'Previous result');
        prevButton.disabled = true;

        nextButton = document.createElement('button');
        nextButton.textContent = 'След.';
        nextButton.id = 'next-result-button';
        nextButton.addEventListener('click', () => navigateResults(1));
        nextButton.disabled = true;

        stopButton = document.createElement('button');
        stopButton.textContent = 'Стоп';
        stopButton.id = 'stop-search-button';
        stopButton.addEventListener('click', stopSearch);
        stopButton.setAttribute('aria-label', 'Stop search');

        searchBox.appendChild(searchInput);
        searchBox.appendChild(searchButton);
        searchBox.appendChild(prevButton);
        searchBox.appendChild(nextButton);
        searchBox.appendChild(stopButton);

        const mastheadEnd = document.querySelector('#end.ytd-masthead');
        const buttonsContainer = document.querySelector('#end #buttons');

        if (mastheadEnd) {
            if(buttonsContainer){
                mastheadEnd.insertBefore(searchBox, buttonsContainer);
            } else{
                mastheadEnd.appendChild(searchBox);
            }
        } else {
            console.error("Could not find the YouTube masthead's end element for search box.");
            showErrorMessageGridSearch("Не удалось найти шапку YouTube. Блок поиска размещен вверху страницы.");
            document.body.insertBefore(searchBox, document.body.firstChild);
        }
    }

    function showErrorMessageGridSearch(message) { // Renamed to avoid conflict if another part used same name
        let errorDiv = document.getElementById('search-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'search-error-message';
            document.body.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => { if(errorDiv) errorDiv.style.display = 'none'; }, 5000);
    }

    function showNoResultsMessageGridSearch() { // Renamed
        let noResultsDiv = document.getElementById('search-no-results-message');
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'search-no-results-message';
            noResultsDiv.textContent = "Совпадений не найдено.";
            document.body.appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
        setTimeout(() => { if(noResultsDiv) noResultsDiv.style.display = 'none'; }, 5000);
    }

    function stopSearch() {
        isSearching = false;
        clearTimeout(scrollContinuationTimeout);
        clearTimeout(overallSearchTimeout);
        currentHighlightIndex = -1;
        highlightedElements = [];
        document.querySelectorAll('.highlighted-text').forEach(el => {
            el.classList.remove('highlighted-text');
        });
        updateNavButtons();
    }

    function navigateResults(direction) {
        if (highlightedElements.length === 0) return;
        currentHighlightIndex += direction;
        if (currentHighlightIndex < 0) currentHighlightIndex = highlightedElements.length - 1;
        else if (currentHighlightIndex >= highlightedElements.length) currentHighlightIndex = 0;

        if (highlightedElements[currentHighlightIndex]) {
            highlightedElements[currentHighlightIndex].scrollIntoView({ behavior: 'auto', block: 'center' });
            hasScrolledToResultThisSession = true;
        }
        updateNavButtons();
    }

    function updateNavButtons() {
        if (prevButton && nextButton) { // Ensure buttons are created
            prevButton.disabled = highlightedElements.length <= 1;
            nextButton.disabled = highlightedElements.length <= 1;
        }
    }

    function searchAndScroll() {
        if (searchBox && !document.body.contains(searchBox)) {
            console.warn("YouTube Grid Auto-Scroll: Search box is not in the document. Stopping script operations.");
            showErrorMessageGridSearch("UI поиска потерян. Пожалуйста, перезагрузите страницу или попробуйте переустановить скрипт.");
            stopSearch();
            return;
        }
        if (!isSearching) {
            clearTimeout(scrollContinuationTimeout);
            clearTimeout(overallSearchTimeout);
            return;
        }
        clearTimeout(scrollContinuationTimeout);
        targetText = searchInput.value.trim().toLowerCase();
        if (!targetText) {
            stopSearch();
            return;
        }
        clearTimeout(overallSearchTimeout);
        overallSearchTimeout = setTimeout(() => {
            if (isSearching) {
                showErrorMessageGridSearch("Поиск прерван по таймауту.");
                stopSearch();
            }
        }, SEARCH_TIMEOUT_MS);

        document.querySelectorAll('.highlighted-text').forEach(el => {
            el.classList.remove('highlighted-text');
        });

        const mediaElements = Array.from(document.querySelectorAll('ytd-rich-grid-media:not([style*="display: none"])'));
        let newlyFoundHighlightedElements = [];

        for (let i = 0; i < mediaElements.length; i++) {
            const titleElement = mediaElements[i].querySelector('#video-title');
            if (titleElement && titleElement.textContent.toLowerCase().includes(targetText)) {
                mediaElements[i].classList.add('highlighted-text');
                newlyFoundHighlightedElements.push(mediaElements[i]);
            }
        }
        highlightedElements = newlyFoundHighlightedElements;
        updateNavButtons();

        let elementToScrollTo = null;
        let newActiveHighlightIndex = -1;

        if (highlightedElements.length > 0) {
            if (currentHighlightIndex === -1 || currentHighlightIndex >= highlightedElements.length) {
                newActiveHighlightIndex = 0;
            } else {
                newActiveHighlightIndex = (currentHighlightIndex + 1) % highlightedElements.length;
            }
            elementToScrollTo = highlightedElements[newActiveHighlightIndex];
        }

        if (elementToScrollTo) {
            elementToScrollTo.scrollIntoView({ behavior: 'auto', block: 'center' });
            currentHighlightIndex = newActiveHighlightIndex;
            hasScrolledToResultThisSession = true;
            isSearching = false;
            clearTimeout(overallSearchTimeout);
        } else {
            if (!isSearching) {
                clearTimeout(overallSearchTimeout);
                return;
            }
            lastScrollHeight = document.documentElement.scrollHeight;
            window.scrollTo({ top: lastScrollHeight, behavior: 'auto' });

            scrollContinuationTimeout = setTimeout(() => {
                if (!isSearching) return;
                if (document.documentElement.scrollHeight === lastScrollHeight) {
                    const searchWasActiveBeforeStop = isSearching;
                    stopSearch();
                    if (searchWasActiveBeforeStop && !hasScrolledToResultThisSession && targetText) {
                        showNoResultsMessageGridSearch();
                    }
                } else {
                    searchAndScroll();
                }
            }, SCROLL_DELAY_MS);
        }
    }

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            ensureSearchBoxAttached();
            if (isSearching || (searchInput && searchInput.value.trim() && currentHighlightIndex !== -1) ) {
                const wasSearchingBeforeVisibilityChange = isSearching;
                const currentSearchTermInBox = searchInput ? searchInput.value : "";
                if (wasSearchingBeforeVisibilityChange) {
                    console.log("YouTube Grid Auto-Scroll: Tab became visible during an active search. Restarting search process.");
                    stopSearch();
                    if (searchInput) searchInput.value = currentSearchTermInBox;
                    if (currentSearchTermInBox.trim()) {
                        isSearching = true;
                        hasScrolledToResultThisSession = false;
                        currentHighlightIndex = -1;
                        searchAndScroll();
                    }
                }
            }
        }
    });


    // --- Functions for YouTube Channel Full Video Preloader ---
    function createPreloadButtonPreloader() {
        if (document.getElementById('yt-channel-full-preload-button')) {
            return; // Button already exists
        }

        preloadButtonPreloader = document.createElement('button');
        preloadButtonPreloader.textContent = 'Загрузить ВСЕ видео (со скроллом)';
        preloadButtonPreloader.id = 'yt-channel-full-preload-button';

        preloadButtonPreloader.addEventListener('click', startFullPreloadPreloader);
        document.body.appendChild(preloadButtonPreloader);
    }

    async function scrollToBottomPreloader() {
        return new Promise(resolve => {
            preloadButtonPreloader.disabled = true;
            isLoadingStatePreloader = true;
            preloadButtonPreloader.textContent = 'Прокрутка... (0 видео)';

            let lastHeight = 0;
            let currentHeight = document.documentElement.scrollHeight;
            let consecutiveNoChange = 0;
            const maxConsecutiveNoChange = 5;
            let videosFound = 0;

            const scrollInterval = setInterval(() => {
                videosFound = document.querySelectorAll('ytd-rich-item-renderer a#video-title-link').length;
                preloadButtonPreloader.textContent = `Прокрутка... (${videosFound} видео)`;

                window.scrollTo(0, document.documentElement.scrollHeight);
                lastHeight = currentHeight;
                currentHeight = document.documentElement.scrollHeight;

                if (lastHeight === currentHeight) {
                    consecutiveNoChange++;
                    if (consecutiveNoChange >= maxConsecutiveNoChange) {
                        clearInterval(scrollInterval);
                        preloadButtonPreloader.textContent = `Прокрутка завершена (${videosFound} видео)`;
                        isLoadingStatePreloader = false;
                        setTimeout(resolve, 1000);
                    }
                } else {
                    consecutiveNoChange = 0;
                }
            }, 1000);
        });
    }

    async function startFullPreloadPreloader() {
        if (isLoadingStatePreloader) {
            alert("Процесс уже запущен.");
            return;
        }

        const startScroll = confirm("Скрипт начнет прокручивать страницу вниз до конца, чтобы загрузить все видео. Это может занять некоторое время. Продолжить?");
        if (!startScroll) {
            return;
        }

        await scrollToBottomPreloader();

        preloadButtonPreloader.disabled = false;
        const videoItems = document.querySelectorAll('ytd-rich-item-renderer');
        let videoLinks = [];

        videoItems.forEach(item => {
            const linkElement = item.querySelector('a#video-title-link');
            if (linkElement && linkElement.href) {
                videoLinks.push(linkElement.href);
            }
        });

        if (videoLinks.length === 0) {
            alert('Видео для предзагрузки не найдены на этой странице.');
            preloadButtonPreloader.textContent = 'Загрузить ВСЕ видео (со скроллом)';
            return;
        }

        const confirmation = confirm(`Найдено ${videoLinks.length} видео. Хотите открыть их все в фоновых вкладках? Это может занять некоторое время и потребовать много ресурсов.`);

        if (confirmation) {
            preloadButtonPreloader.disabled = true;
            preloadButtonPreloader.textContent = `Открытие... (0/${videoLinks.length})`;
            let openedCount = 0;

            videoLinks.forEach((url, index) => {
                setTimeout(() => {
                    GM_openInTab(url, { active: false, insert: true });
                    openedCount++;
                    preloadButtonPreloader.textContent = `Открытие... (${openedCount}/${videoLinks.length})`;
                    if (openedCount === videoLinks.length) {
                        alert('Все ссылки на видео отправлены на открытие в фоновых вкладках.');
                        preloadButtonPreloader.disabled = false;
                        preloadButtonPreloader.textContent = 'Загрузить ВСЕ видео (со скроллом)';
                    }
                }, index * 300);
            });
        } else {
             preloadButtonPreloader.textContent = 'Загрузить ВСЕ видео (со скроллом)';
        }
    }

    function initOrReinitPreloaderButton() {
        const oldButton = document.getElementById('yt-channel-full-preload-button');
        if (oldButton) {
            oldButton.remove();
        }
        // Check if on a /videos page
        if (window.location.pathname.endsWith('/videos') || /\/@.+\/videos/.test(window.location.pathname)) {
            // Delay to ensure page elements are settled, especially on SPA navigation
            setTimeout(createPreloadButtonPreloader, 1500); // Adjusted delay
        }
    }

    // --- Initialization ---

    // Initialize Grid Search UI
    createSearchBox();

    // Initialize Preloader Button (conditionally)
    initOrReinitPreloaderButton();

    // MutationObserver for SPA navigation to handle Preloader Button visibility
    let lastUrlPreloader = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrlPreloader) {
        lastUrlPreloader = url;
        isLoadingStatePreloader = false; // Reset preloader's specific loading state
        initOrReinitPreloaderButton(); // Check and add/remove preloader button
      }
    }).observe(document, {subtree: true, childList: true});

})();