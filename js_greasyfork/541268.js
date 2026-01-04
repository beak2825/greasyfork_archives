// ==UserScript==
// @name         Technopat Alıntı Yardımcısı
// @namespace    http://tampermonkey.net/
// @version      2025-06-30
// @description  Technopat forumunda mesaj alıntılamanın davranışını otomatik kullanıcı bahsetme ekleme ile değiştirir
// @author       Juhrien
// @match        https://www.technopat.net/sosyal
// @include      /^https:\/\/www\.technopat\.net\/sosyal\/konu\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=technopat.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541268/Technopat%20Al%C4%B1nt%C4%B1%20Yard%C4%B1mc%C4%B1s%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/541268/Technopat%20Al%C4%B1nt%C4%B1%20Yard%C4%B1mc%C4%B1s%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sabitler
    const SELECTORS = {
        quoteButtons: '[data-xf-click="quote"]',
        textarea: 'textarea[aria-label="Zengin metin kutusu"]',
        usernameAndId: '.message-userDetails .username'
    };

    // Regex pattern for quote URLs
    const QUOTE_URL_PATTERN = /\/sosyal\/mesaj\/\d+\/quote/;

    const DEBUG = true;

    // Durum yönetimi
    const quoteState = {
        element: null,
        newContent: null,

        set(element, content) {
            this.element = element;
            this.newContent = content;
        },

        clear() {
            this.element = null;
            this.newContent = null;
        },

        isReady() {
            return this.element && this.newContent;
        }
    };

    // Yardımcı fonksiyonlar
    const log = (...args) => {
        if (DEBUG) console.log('[Technopat Alıntı Yardımcısı]', ...args);
    };

    const extractPostId = (href) => {
        if (!href) return null;
        const parts = href.split('=');
        return parts.length > 1 ? parts[1] : null;
    };

    const getUserInfo = (postId) => {
        console.log('pos', postId)
        const postArticle = document.querySelector(`article[id="js-post-${postId}"]`);
        if (!postArticle) {
            log('Post ID için makale bulunamadı:', postId);
            return null;
        }

        console.log('t', postArticle)

        const usernameAndIdElement = postArticle.querySelector(SELECTORS.usernameAndId);
        const username = usernameAndIdElement.textContent;
        const userId = usernameAndIdElement.dataset.userId;

        if (!userId || !username) {
            log('Postta kullanıcı bilgi elementleri bulunamadı:', postId);
            return null;
        }

        return {
            userId,
            username
        };
    };

    const getTextarea = () => {
        const textarea = document.querySelector(SELECTORS.textarea);
        if (!textarea) {
            log('Metin alanı bulunamadı!');
        }
        return textarea;
    };

    const createUserMention = (userId, username) => {
        return `[USER=${userId}]@${username}[/USER] `;
    };

    const updateTextarea = (textarea, content) => {
        textarea.value = content;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        log('Metin alanı içeriği başarıyla güncellendi');
    };

    // XHR yakalama
    const interceptXHR = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._interceptedUrl = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('load', handleXHRLoad);
            return originalSend.apply(this, args);
        };
    };

    const handleXHRLoad = function() {
        if (!this._interceptedUrl || !QUOTE_URL_PATTERN.test(this._interceptedUrl)) {
            return;
        }

        log('Alıntı XHR tamamlandı:', this._interceptedUrl);

        if (!quoteState.isReady()) {
            log('Alıntı durumu hazır değil, içerik değişikliği atlanıyor');
            return;
        }

        try {
            updateTextarea(quoteState.element, quoteState.newContent);
            quoteState.clear();
        } catch (error) {
            log('Metin alanı güncellenirken hata:', error);
            quoteState.clear();
        }
    };

    // Olay işleyicileri
    const handleQuoteClick = (event) => {
        const { href } = event.target;
        const postId = extractPostId(href);

        if (!postId) {
            log('Href\'den post ID çıkarılamadı:', href);
            return;
        }

        const userInfo = getUserInfo(postId);
        if (!userInfo) {
            return; // Hata zaten getUserInfo içinde loglandı
        }

        const textarea = getTextarea();
        if (!textarea) {
            return; // Hata zaten getTextarea içinde loglandı
        }

        const mentionContent = createUserMention(userInfo.userId, userInfo.username);
        quoteState.set(textarea, mentionContent);

        log('Alıntı tıklaması işlendi:', {
            postId,
            userId: userInfo.userId,
            username: userInfo.username
        });
    };

    // Başlatma
    const init = () => {
        log('Script başlatılıyor...');

        interceptXHR();

        const quoteButtons = document.querySelectorAll(SELECTORS.quoteButtons);
        log('Bulunan alıntı butonu sayısı:', quoteButtons.length);

        quoteButtons.forEach(button => {
            button.addEventListener('click', handleQuoteClick);
        });

        log('Script başarıyla başlatıldı');
    };

    // Script\'i başlat
    init();

})();