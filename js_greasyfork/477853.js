// ==UserScript==
// @name        Webnovel Tag Search Mode Switcher
// @namespace   https://greasyfork.org/en/users/1200276-awesome4
// @version     2.0
// @description This script simplifies tag searches on Webnovel.com, allowing you to switch between novel and fanfic search modes, eliminating the need for manual URL adjustments. Enhance your tag exploration experience with this user-friendly feature.
// @author      Awesome
// @match       https://www.webnovel.com/*
// @grant       none
// @license     GNU GPLv3
// @name:en     Webnovel Tag Search Mode Switcher
// @name:es     Interruptor de Modo de Búsqueda de Etiquetas en Webnovel
// @name:ar     مبدل وضع البحث في العلامات على ويب نوفل
// @name:fr     Commutateur de Mode de Recherche d'Étiquettes Webnovel
// @name:de     Webnovel Tag-Suchmodus-Umschalter
// @name:it     Interruttore di Modalità di Ricerca di Etichette Webnovel
// @name:ru     Переключатель режима поиска по меткам на Webnovel
// @name:zh-CN  Webnovel标签搜索模式切换器
// @name:zh-TW  Webnovel標籤搜索模式切換器
// @name:ja     Webnovelタグ検索モード切替機能
// @name:pt     Alternador de Modo de Pesquisa de Tags no Webnovel
// @name:tr     Webnovel Etiket Arama Modu Değiştirici
// @name:hi     वेबनोवेल टैग खोज मोड स्विचर
// @description:en This script simplifies tag searches on Webnovel.com, allowing you to switch between novel and fanfic search modes, eliminating the need for manual URL adjustments. Enhance your tag exploration experience with this user-friendly feature.
// @description:es Este script simplifies tag searches on Webnovel.com, allowing you to switch between novel and fanfic search modes, eliminating the need for manual URL adjustments. Enhance your tag exploration experience with this user-friendly feature.
// @description:ar هذا البرنامج النصي يبسط عمليات البحث في العلامات على موقع ويب نوفل، مما يتيح لك التبديل بين أوضاع البحث في الروايات وقصص المشجعين، والتخلص من الحاجة إلى تعديل الروابط يدويًا. قم بتعزيز تجربتك في استكشاف العلامات مع هذه الميزة سهلة الاستخدام.
// @description:fr Ce script simplifies tag searches on Webnovel.com, allowing you to switch between novel and fanfic search modes, eliminating the need for manual URL adjustments. Enhance your tag exploration experience with this user-friendly feature.
// @description:de Dieses Skript vereinfacht die Tag-Suchfunktion auf Webnovel.com, es ermöglicht Ihnen, zwischen den Suchmodi für Romane und Fanfictions zu wechseln und eliminiert die Notwendigkeit für manuelle URL-Anpassungen. Verbessern Sie Ihre Tag-Erforschungserfahrung mit dieser benutzerfreundlichen Funktion.
// @description:it Questo script semplifica le ricerche delle etichette su Webnovel.com, permettendoti di passare tra le modalità di ricerca di romanzi e fanfiction, eliminando la necessità di aggiustamenti manuali dell'URL. Potenzia la tua esperienza di esplorazione delle etichette con questa funzionalità user-friendly.
// @description:ru Этот скрипт упрощает поиск по меткам на Webnovel.com, позволяя вам переключаться между режимами поиска романов и фанфиков, исключая необходимость вручную изменять URL. Улучшите вашу эксплорацию тегов с помощью этой простой в использовании функции.
// @description:zh-CN 这个脚本简化了Webnovel.com上的标签搜索，使您可以轻松切换小说和同人文的搜索模式，无需手动调整URL。使用这个用户友好的功能来增强您的标签探索体验。
// @description:zh-TW 這個腳本簡化了Webnovel.com上的標籤搜索，使您可以輕鬆切換小說和同人文的搜索模式，無需手動調整URL。增強您的標籤探索體驗與這個用戶友好的功能。
// @description:ja このスクリプトはWebnovel.comでのタグ検索を簡素化し、小説とファンフィクションの検索モードを切り替え、URLの手動調整の必要性をなくします。ユーザーフレンドリーなこの機能でタグの探索体験を向上させてください。
// @description:pt Este script simplifica as pesquisas por tags no Webnovel.com, permitindo que você alterne entre os modos de pesquisa de romances e fanfics, eliminando a necessidade de ajustes manuais de URL. Melhore sua experiência de exploração de tags com este recurso amigável ao usuário.
// @description:tr Bu betik, Webnovel.com'daki etiket aramalarını basitleştirir ve roman ve fanfiksiyon arama modları arasında kolayca geçiş yapmanıza olanak tanır, böylece URL ayarlarını manuel olarak yapma ihtiyacını ortadan kaldırır. Bu kullanıcı dostu özellikle etiket keşif deneyiminizi geliştirin.
// @description:hi यह स्क्रिप्ट वेबनोवेल.कॉम पर टैग खोजों को सरल बनाता है, जिससे आप उपन्यास और फैनफिक खोज मोड्स के बीच आसानी से स्विच कर सकते हैं, URL समीक्षा की आवश्यकता को हटा देता है। इस उपयोगकर्ता-मित्र लिए अपने खोज अन्वेषण अनुभव को बेहतर बनाएं।
// @downloadURL https://update.greasyfork.org/scripts/477853/Webnovel%20Tag%20Search%20Mode%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/477853/Webnovel%20Tag%20Search%20Mode%20Switcher.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // Get the genre name from the page
    const genreName = document.querySelector('h2.lh1\\.5').textContent.toLowerCase();
    // Check if the current URL matches the expected pattern
    const url = window.location.href;
    const isNovelPage = url.includes(`/tags/${genreName}-novel`);
    const isFanficPage = url.includes(`/tags/${genreName}-fanfic`);

    // Function to create the "novel" or "fanfic" button
    const createButton = (href, text) => {
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('data-order', '3');
        link.textContent = text;
        const nav = document.querySelector('.lst-nav');
        nav.appendChild(link);
    };

    // Check if the page is a genre-specific page and if the corresponding button doesn't exist yet
    if (isNovelPage && !document.querySelector(`.lst-nav a[href*="${genreName}-fanfic"]`)) {
        // Create the "Fanfic" button if on the Novel page
        createButton(`https://www.webnovel.com/tags/${genreName}-fanfic`, `${genreName} Fanfics`);
    } else if (isFanficPage && !document.querySelector(`.lst-nav a[href*="${genreName}-novel"]`)) {
        // Create the "Novel" button if on the Fanfic page
        createButton(`https://www.webnovel.com/tags/${genreName}-novel`, `${genreName} Novels`);
    }

    // Ensure links in `.lst-nav` are properly created and clickable
    const navLinks = document.querySelectorAll('.lst-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Check if the link is valid, then proceed to navigate
            if (link.href) {
                window.location.href = link.href; // This forces the navigation to the desired page
            }
        });
    });
})();




