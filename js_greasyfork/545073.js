// ==UserScript==
// @name       YouTube Lite (melhor experiência)
// @name:pt       YouTube Lite (melhor experiência)
// @name:pt-PT       YouTube Lite (melhor experiência)
// @name:pt-BR       YouTube Lite (melhor experiência)
// @name:es       YouTube Lite (la mejor experiencia)
// @name:en       YouTube Lite (best experience)
// @name:fr       YouTube Lite (meilleure expérience)
// @name:ru       YouTube Lite (лучший опыт)
// @name:ja       YouTube Lite (最高のエクスペリエンス)
// @name:ko       YouTube Lite (최고의 경험)
// @name:zh-TW       YouTube Lite (更佳體驗)
// @name:zh-CN       YouTube Lite (更好的体验)
// @name:id       YouTube Lite (pengalaman terbaik)
// @name:ug       YouTube Lite (ئەڭ ياخشى تەجرىبە)
// @name:ar       YouTube Lite (أفضل تجربة)
// @name:he       YouTube Lite (חוויית השימוש הטובה ביותר)
// @name:hi       YouTube Lite (सर्वश्रेष्ठ अनुभव)
// @name:th       YouTube Lite (ประสบการณ์ที่ดีที่สุด)
// @name:bg       YouTube Lite (най-добър опит)
// @name:ro       YouTube Lite (cea mai bună experiență)
// @name:fi       YouTube Lite (paras kokemus)
// @name:it       YouTube Lite (migliore esperienza)
// @name:el       YouTube Lite (καλύτερη εμπειρία)
// @name:eo       YouTube Lite (plej bona sperto)
// @name:hu       YouTube Lite (legjobb élmény)
// @name:nb       YouTube Lite (beste opplevelse)
// @name:sk       YouTube Lite (najlepšia skúsenosť)
// @name:sv       YouTube Lite (bästa upplevelsen)
// @name:sr       YouTube Lite (најбоље искуство)
// @name:pl       YouTube Lite (najlepsze doświadczenie)
// @name:nl       YouTube Lite (beste ervaring)
// @name:de       YouTube Lite (beste Erfahrung)
// @name:da       YouTube Lite (bedste oplevelse)
// @name:cs       YouTube Lite (nejlepší zkušenost)
// @name:uk       YouTube Lite (найкращий досвід)
// @name:tr       YouTube Lite (en iyi deneyim)
// @name:vi       YouTube Lite (trải nghiệm tốt nhất)
// @name:fr-CA      YouTube Lite (meilleure expérience)

// @namespace    http://linkme.bio/jhonpergon/?userscript=youtube_lite
// @version      3.5 // Updated version to reflect changes
// @author       Jhon Pérgon
// @license      MIT

// @description       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt-PT       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt-BR       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:es      Hace que la interfaz de YouTube sea más dinámica, oculta videos con palabras clave, agrega un botón de descarga y abre el video en una página sin publicidad (embed youtube-nocookie).
// @description:en      Makes the YouTube interface lighter, hides videos with keywords, adds a download button and opens the video on an ad-free page (embed youtube-nocookie).
// @description:fr      Il rend l'interface YouTube plus dynamique, masque les vidéos avec des mots-clés, ajoute un bouton de téléchargement et ouvre la vidéo sur une page sans publicité (embed youtube-nocookie).
// @description:ru      Он делает интерфейс YouTube более динамичным, скрывает видео с ключевыми словами, добавляет кнопку загрузки и открывает видео на странице без рекламы (встроить youtube-nocookie).
// @description:ja      YouTube インターフェースをより動的にし、キーワードを含むビデオを非表示にし、ダウンロード ボタンを追加して、広告なしのページ (youtube-nocookie embed) でビデオを開きます。
// @description:ko      YouTube 인터페이스를 더욱 동적으로 만들고, 키워드로 동영상을 숨기고, 다운로드 버튼을 추가하고, 광고 없는 페이지에서 동영상을 엽니다(youtube-nocookie embed).
// @description:zh-TW      使YouTube介面更加動態，隱藏包含關鍵字的影片，新增下載按鈕，並在無廣告頁面（嵌入youtube-nocookie）中開啟影片。
// @description:zh-CN      使YouTube界面更加动态，隐藏包含关键词的视频，添加下载按钮并在无广告页面（嵌入youtube-nocookie）中打开视频。
// @description:id      Membuat antarmuka YouTube lebih ringan, menyembunyikan video dengan kata kunci, menambahkan tombol unduh, dan membuka video di halaman tanpa iklan (sematkan youtube-nocookie).
// @description:ug       يوتۇب يېڭىلاندۇرغۇچى كىرىشتىمىنى ياقسى قىلىدۇ، ئاڭلىق سۆزلىك ۋىدېئولارنى يوپۇش قىلىدۇ، چۈشۈرمە تومبۇلى قوشىدۇ ۋە چىراق ئېكراندا (youtube-nocookie sematka qilish) ۋىدېئونى ئېچىدۇ.
// @description:ar      يجعل واجهة يوتيوب أخف وزنًا، يخفي مقاطع الفيديو بكلمات مفتاحية، يضيف زر تنزيل ويفتح الفيديو على صفحة خالية من الإعلانات (تضمين youtube-nocookie).
// @description:he      הופך את ממשק YouTube לקל יותר, מסתיר סרטונים עם מילות מפתח, מוסיף לחצן הורדה ופותח את הסרטון על דף נטול פרסומות (הטמעת youtube-nocookie).
// @description:hi      यूट्यूब इंटरफ़ेस को हल्का बनाता है, कीवर्ड के साथ वीडियो को छुपाता है, डाउनलोड बटन जोड़ता है और एड-मुक्त पृष्ठ पर वीडियो खोलता है (youtube-nocookie embed)।
// @description:th      ทำให้อินเตอร์เฟซ YouTube เบาขึ้น, ซ่อนวิดีโอด้วยคำสำคัญ, เพิ่มปุ่มดาวน์โหลด และเปิดวิดีโอบนหน้าไม่มีโฆษณา (ฝัง youtube-nocookie) ให้ดู
// @description:bg      Прави интерфейса на YouTube по-лек, скрива видеоклипове с ключови думи, добавя бутон за изтегляне и отваря видеоклипа на страница без реклами (вграждане на youtube-nocookie).
// @description:ro      Face interfața YouTube mai ușoară, ascunde videoclipurile cu cuvinte cheie, adaugă un buton de descărcare și deschide videoclipul pe o pagină fără reclame (încorporare youtube-nocookie).
// @description:fi      Tekee YouTube-liittymästä kevyemmän, piilottaa avainsanalla varustetut videot, lisää latauspainikkeen ja avaa videon mainoksettomalle sivulle (upottaa youtube-nocookie).
// @description:it      Rende l'interfaccia di YouTube più leggera, nasconde i video con parole chiave, aggiunge un pulsante di download e apre il video su una pagina senza pubblicità (embed youtube-nocookie).
// @description:el      Καθιστά τη διεπαφή του YouTube πιο ελαφριά, αποκρύπτει τα βίντεο με λέξεις-κλειδιά, προσθέτει ένα κουμπί λήψης και ανοίγει το βίντεο σε μια σελίδα χωρίς διαφημίσεις (ενσωμάτωση youtube-nocookie).
// @description:eo      Faras la interfaco de YouTube pli malpeza, kaŝas videojn kun ŝlosilvortoj, aldonas elŝut-butonon kaj malfermas la videon en senanonca paĝo (enteni youtube-nocookie).
// @description:hu      Könnyebbé teszi a YouTube felületét, kulcsszavakkal elrejti a videókat, hozzáad egy letöltés gombot, és az videót hirdetések nélküli oldalon nyitja meg (beágyazott youtube-nocookie).
// @description:nb      Gjør YouTube-grensesnittet lettere, skjuler videoer med søkeord, legger til en nedlastingsknapp og åpner videoen på en annonsefri side (innbygg youtube-nocookie).
// @description:sk      Robí rozhranie YouTube ľahším, skrýva videá s kľúčovými slovami, pridáva tlačidlo na stiahnutie a otvára video na stránke bez reklám (vložiť youtube-nocookie).
// @description:sv      Gör YouTube-gränssnittet lättare, gömmer videor med nyckelord, lägger till en nedladdningsknapp och öppnar videon på en annonsfri sida (bädda in youtube).
// @description:sr      Прави интерфејс YouTube-а лакшим, сакрива видее са кључним речима, додаје дугме за преузимање и отвара видео на страници без реклама (уградња youtube-nocookie).
// @description:pl      Uczy interfejs YouTube'a lżejszym, ukrywa filmy z słowami kluczowymi, dodaje przycisk do pobierania i otwiera film na stronie bez reklam (osadzanie youtube-nocookie).
// @description:nl      Maakt de YouTube-interface lichter, verbergt video's met trefwoorden, voegt een downloadknop toe en opent de video op een advertentievrije pagina (insluiten youtube-nocookie).
// @description:de      Macht die YouTube-Benutzeroberfläche leichter, versteckt Videos mit Schlüsselwörtern, fügt einen Download-Button hinzu und öffnet das Video auf einer werbefreien Seite (einbetten youtube-nocookie).
// @description:da      Gør YouTube-grænsefladen lettere, skjuler videoer med søgeord, tilføjer en downloadknap og åbner videoen på en reklamefri side (indlejre youtube-nocookie).
// @description:cs      Dělá YouTube rozhraní lehčí, skrývá videa s klíčovými slovy, přidává tlačítko ke stažení a otevírá video na stránce bez reklam (vložit youtube-nocookie).
// @description:uk      Робить інтерфейс YouTube легшим, приховує відео з ключовими словами, додає кнопку завантаження та відкриває відео на сторінці без реклами (вбудовувати youtube-nocookie).
// @description:tr      YouTube arayüzünü daha hafif hale getirir, anahtar kelimelerle videoları gizler, indirme düğmesi ekler ve videoyu reklamsız bir sayfada açar (yerleştirme youtube-nocookie).
// @description:vi      Làm cho giao diện YouTube nhẹ hơn, ẩn đi các video có từ khóa, thêm nút tải xuống và mở video trên trang không có quảng cáo (nhúng youtube-nocookie).
// @description:fr-CA      Rend l'interface YouTube plus légère, masque les vidéos avec des mots-clés, ajoute un bouton de téléchargement et ouvre la vidéo sur une page sans publicité (intégrer youtube-nocookie).

// @match           https://www.youtube.com/*
// @match           https://m.youtube.com/*
// @match           https://youtu.be/*
// @match           https://www.youtube-nocookie.com/*
// @exclude         https://music.youtube.com/*
// @exclude         https://www.youtube.com/embed/*
// @exclude         https://youtube.com/embed/*
// @icon         https://icons.iconarchive.com/icons/designbolts/cute-social-media/256/Youtube-icon.png

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @run-at      document-start
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/545073/YouTube%20Lite%20%28melhor%20experi%C3%AAncia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545073/YouTube%20Lite%20%28melhor%20experi%C3%AAncia%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION AND INITIAL SETUP ---
    // User-configurable settings
    const config = {
        // Automatically redirect to the ad-free youtube-nocookie domain
        // Set to `true` to enable, `false` to disable.
        redirectToNoCookie: true,
        // The version of the script. Used for first-run logic.
        scriptVersion: '3.5'
    };

    const currentUrl = window.location.href;
    const isVideoPage = currentUrl.includes('v=');
    let videoId = null;
    let keywords = [];

    // Language-specific text for user messages.
    // Simplified into a single object for easier management.
    const i18n = {
        'firstRun': {
            'en': 'Note: You are accessing version {version} of Youtube Lite for the first time. To ensure its proper functioning, we will clear the cookies and restart the page.',
            'pt-BR': 'Nota: Você está acessando a versão {version} do Youtube Lite pela primeira vez. Para garantir o seu correto funcionamento, iremos limpar os cookies e reiniciar a página.',
            'ru': 'Примечание: Вы впервые открываете версию {version} Youtube Lite. Для обеспечения её правильной работы мы очистим куки и перезапустим страницу.',
            // Add other languages here.
        },
        'reloading': {
            'en': 'Done. The page will be reloaded with your language.',
            'pt-BR': 'Feito. A página será recarregada com seu idioma.',
            'ru': 'Готово. Страница будет перезагружена с вашим языком.',
            // Add other languages here.
        },
        'keywordsSaved': {
            'en': 'Saved! The page will be reloaded to activate the hiding of new keywords.',
            'pt-BR': 'Salvo! A página será recarregada para ativar a ocultação das novas palavras-chave.',
            'ru': 'Сохранено! Страница будет перезагружена для активации скрытия новых ключевых слов.',
            // Add other languages here.
        },
        'projectLink': {
            'en': 'Open Youtube Lite project page',
            'pt-BR': 'Abrir página do projeto Youtube Lite',
            'ru': 'Открыть страницу проекта Youtube Lite',
            // Add other languages here.
        }
    };

    function getLocalizedText(key, replacements = {}) {
        const userLang = (navigator.language || navigator.userLanguage).toLowerCase().substring(0, 5);
        let langCode = Object.keys(i18n[key]).find(lang => userLang.startsWith(lang)) || 'en';
        let text = i18n[key][langCode];
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        return text;
    }


    // --- UTILITY FUNCTIONS ---

    // Function to extract video ID from URL
    function getVideoIdFromUrl(url = currentUrl) {
        let match = url.match(/(?:v=|youtu\.be\/)([^&?]+)/);
        return match ? match[1] : null;
    }

    // Function to set up the keyword hiding logic
    function setupKeywords() {
        const savedKeywordsString = GM_getValue('keyWords', '');
        if (savedKeywordsString) {
            keywords = savedKeywordsString.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw.length > 0);
        }
    }

    // Check if an element's text content contains any of the keywords
    function containsKeywords(element) {
        if (!element || keywords.length === 0) return false;
        const text = (element.textContent || '').toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
    }


    // --- CORE LOGIC ---

    // Initial setup and cleanup on document start
    function init() {
        checkFirstRun();
        applyGlobalStyles();
        setupKeywords();
        handlePageRedirection();
    }

    function checkFirstRun() {
        const savedVersion = GM_getValue('version', '0.0');
        if (savedVersion !== config.scriptVersion) {
            alert(getLocalizedText('firstRun', { version: config.scriptVersion }));
            clearAllCookies();
            GM_setValue('version', config.scriptVersion);
            window.location.reload();
        }
    }

    function clearAllCookies() {
        document.cookie.split(';').forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        });
    }

    // Apply necessary styles
    function applyGlobalStyles() {
        // Add font-awesome for icons and other custom styles
        GM_addStyle(`
            @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");
            .yt-lite-download-button {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            .yt-lite-hidden {
                display: none !important;
            }
        `);
    }

    // This function will handle redirects and other early-stage logic
    function handlePageRedirection() {
        if (config.redirectToNoCookie && isVideoPage) {
            const videoId = getVideoIdFromUrl();
            if (videoId && !currentUrl.includes('youtube-nocookie.com')) {
                // Redirect to the ad-free version
                window.location.replace(`https://www.youtube-nocookie.com/watch?v=${videoId}`);
            }
        }
    }

    // --- DOM MANIPULATION AND OBSERVER LOGIC ---

    // The main function to observe and modify the page
    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // It's an element
                            if (isVideoPage) {
                                // Add download button on video pages
                                addDownloadButton(node);
                                // Skip ads if they appear
                                skipAd(node);
                            }
                            // Hide videos based on keywords
                            hideVideosWithKeywords(node);
                            // Clean up unnecessary elements
                            cleanupLiteInterface(node);
                        }
                    });
                }
            });
        });

        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function hideVideosWithKeywords(container) {
        const videoItems = container.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
        videoItems.forEach(item => {
            if (containsKeywords(item)) {
                item.classList.add('yt-lite-hidden');
            }
        });
    }

    function cleanupLiteInterface(container) {
        // Use a more generic approach to remove elements that are not part of the main content
        const elementsToRemove = container.querySelectorAll(
            'ytd-playlist-thumbnail, ytd-moving-thumbnail-renderer, ' +
            'ytd-thumbnail-overlay-toggle-button-renderer, ytd-thumbnail-overlay-inline-unplayable-renderer, ' +
            'ytd-thumbnail-overlay-resume-playback-renderer, iron-iconset-svg, ytd-watch-next-secondary-results-renderer'
        );
        elementsToRemove.forEach(el => el.classList.add('yt-lite-hidden'));
    }

    function skipAd(container) {
        const skipButton = container.querySelector('.ytp-ad-skip-button');
        if (skipButton) {
            skipButton.click();
        }
    }

    function addDownloadButton(container) {
        if (!isVideoPage) return;

        const infoBar = container.querySelector('#info-contents');
        if (infoBar && !infoBar.querySelector('.yt-lite-download-button')) {
            const downloadUrl = `https://ssyoutube.com/watch?v=${videoId}`; // Example download service URL
            const downloadButton = document.createElement('a');
            downloadButton.href = downloadUrl;
            downloadButton.target = '_blank';
            downloadButton.className = 'yt-lite-download-button';
            downloadButton.innerHTML = `
                <span class="bi bi-download"></span>
                <span>Download</span>
            `;
            infoBar.appendChild(downloadButton);
        }
    }


    // --- EXECUTION START ---

    // Run the initial setup
    init();

    // Start the DOM observer after the page is fully loaded to ensure all scripts have run
    window.addEventListener('load', observeDOM);

})();