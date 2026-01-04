// ==UserScript==
// @name        博客园新闻板块设置屏蔽词
// @name:en      Hide Specified Keywords at news.cnblogs.com
// @name:es      Ocultar palabras clave específicas en news.cnblogs.com
// @name:fr      Masquer les mots-clés spécifiés sur news.cnblogs.com
// @name:de      Ausblenden bestimmter Schlüsselwörter auf news.cnblogs.com
// @name:zh-TW   設定隱藏特定關鍵字於 news.cnblogs.com
// @name:ja      news.cnblogs.comで指定したキーワードを非表示
// @name:ko      news.cnblogs.com에서 특정 키워드 숨기기
// @name:pt      Ocultar palavras-chave especificadas no news.cnblogs.com
// @name:ru      Скрыть указанные ключевые слова на news.cnblogs.com
// @name:hi      news.cnblogs.com पर निर्दिष्ट कीवर्ड छुपाएं
// @name:ar      إخفاء الكلمات المفتاحية المحددة في news.cnblogs.com
// @name:it      Nascondi le parole chiave specificate su news.cnblogs.com
// @name:vi      Ẩn từ khóa được chỉ định trên news.cnblogs.com
// @name:tr      news.cnblogs.com'da belirtilen anahtar kelimeleri gizle
// @name:pl      Ukryj określone słowa kluczowe na news.cnblogs.com
// @name:sv      Dölj angivna nyckelord på news.cnblogs.com
// @name:he      הסתר מילות מפתח ספציפיות ב-news.cnblogs.com
// @name:nl      Verberg opgegeven trefwoorden op news.cnblogs.com
// @name:el      Απόκρυψη καθορισμένων λέξεων-κλειδιών στο news.cnblogs.com
// @name:uk      Сховати вказані ключові слова на news.cnblogs.com
// @name:th      ซ่อนคำสำคัญที่กำหนดไว้ที่ news.cnblogs.com
// @description  Hide Specified news at news.cnblogs.com
// @description:en  Hide Specified news at news.cnblogs.com
// @description:es  Ocultar noticias específicas en news.cnblogs.com
// @description:fr  Masquer des nouvelles spécifiques sur news.cnblogs.com
// @description:de  Bestimmte Nachrichten auf news.cnblogs.com ausblenden
// @description:zh-TW  隱藏於 news.cnblogs.com 上的特定新聞
// @description:ja  news.cnblogs.comの指定されたニュースを非表示にします
// @description:ko  news.cnblogs.com에서 지정된 뉴스를 숨깁니다
// @description:pt  Ocultar notícias especificadas em news.cnblogs.com
// @description:ru  Скрыть указанные новости на news.cnblogs.com
// @description:hi  news.cnblogs.com पर निर्दिष्ट समाचार छुपाएं
// @description:ar  إخفاء الأخبار المحددة في news.cnblogs.com
// @description:it  Nascondi notizie specifiche su news.cnblogs.com
// @description:vi  Ẩn tin tức được chỉ định trên news.cnblogs.com
// @description:tr  news.cnblogs.com'da belirtilen haberleri gizle
// @description:pl  Ukryj określone wiadomości na news.cnblogs.com
// @description:sv  Dölj specifika nyheter på news.cnblogs.com
// @description:he  הסתר חדשות ספציפיות ב-news.cnblogs.com
// @description:nl  Verberg specifieke nieuwsberichten op news.cnblogs.com
// @description:el  Απόκρυψη συγκεκριμένων ειδήσεων στο news.cnblogs.com
// @description:uk  Сховати вказані новини на news.cnblogs.com
// @description:th  ซ่อนข่าวที่กำหนดไว้ที่ news.cnblogs.com
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @icon         https://assets.cnblogs.com/favicon.ico
// @author       aspen138
// @match        *://news.cnblogs.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511540/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%B0%E9%97%BB%E6%9D%BF%E5%9D%97%E8%AE%BE%E7%BD%AE%E5%B1%8F%E8%94%BD%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/511540/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%B0%E9%97%BB%E6%9D%BF%E5%9D%97%E8%AE%BE%E7%BD%AE%E5%B1%8F%E8%94%BD%E8%AF%8D.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Add CSS to hide the banner elements
    GM_addStyle(`
        /* Hide the main banner container */
        .banner {
            display: none !important;
        }

        /* Hide the news panel within banner */
        #clubHeader_panelNews {
            display: none !important;
        }

        /* Hide the e1 advertisement div */
        #e1 {
            display: none !important;
        }

        /* Hide sidebar banner blocks */
        .side_block .sidebar-banner {
            display: none !important;
        }

        /* Hide specific news_e2 advertisement */
        #news_e2 {
            display: none !important;
        }

        /* Hide a4content sidebar banners */
        .a4content.sidebar-banner {
            display: none !important;
        }
    `);

})();






(function() {
    'use strict';

    let addKeywordCommandId;
    let removeKeywordCommandId;
    let viewKeywordsCommandId;

    // Function to hide elements containing specific text
    function hideElementsByText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.textContent.includes(text)) {
                element.style.display = 'none';
            }
        });
    }

    // Function to hide elements based on stored keywords
    function hideElementsByKeywords() {
        const keywords = GM_getValue('hideKeywords', []);
        keywords.forEach(keyword => {
            hideElementsByText('.news_block', keyword);
            hideElementsByText('.entry_summary', keyword);
            hideElementsByText('.tag', keyword);
        });
    }

    // Function to add a new keyword
    function addKeyword() {
        const keyword = prompt('Enter a keyword to hide:');
        if (keyword) {
            let keywords = GM_getValue('hideKeywords', []);
            if (!keywords.includes(keyword)) {
                keywords.push(keyword);
                GM_setValue('hideKeywords', keywords);
                alert(`Keyword "${keyword}" added.`);
                location.reload();
            } else {
                alert('Keyword already exists.');
            }
        }
    }

    // Function to remove a keyword
    function removeKeyword() {
        const keywords = GM_getValue('hideKeywords', []);
        const keyword = prompt('Enter a keyword to remove:', keywords.join(', '));
        if (keyword && keywords.includes(keyword)) {
            const updatedKeywords = keywords.filter(k => k !== keyword);
            GM_setValue('hideKeywords', updatedKeywords);
            alert(`Keyword "${keyword}" removed.`);
            location.reload();
        } else {
            alert('Keyword not found.');
        }
    }

    // Function to view all keywords
    function viewKeywords() {
        const keywords = GM_getValue('hideKeywords', []);
        if (keywords.length > 0) {
            alert(`Current keywords: ${keywords.join(', ')}`);
        } else {
            alert('No keywords set.');
        }
    }

    // Unregister existing menu commands (if any)
    if (addKeywordCommandId) {
        GM_unregisterMenuCommand(addKeywordCommandId);
    }
    if (removeKeywordCommandId) {
        GM_unregisterMenuCommand(removeKeywordCommandId);
    }
    if (viewKeywordsCommandId) {
        GM_unregisterMenuCommand(viewKeywordsCommandId);
    }

    // Register menu commands
    addKeywordCommandId = GM_registerMenuCommand('Add Keyword to Hide', addKeyword);
    removeKeywordCommandId = GM_registerMenuCommand('Remove Keyword to Hide', removeKeyword);
    viewKeywordsCommandId = GM_registerMenuCommand('View All Keywords', viewKeywords);

    // Hide elements based on stored keywords
    hideElementsByKeywords();

})();