// ==UserScript==
// @name         Ekşi Sözlük Mesaj Sayfalama
// @namespace    https://greasyfork.org/tr/users/1469602-custme
// @version      2.1.0
// @description  Adds robust pagination to large message threads with click effects, MutationObserver for dynamic content, improved styling, and better performance.
// @author       CustME (Geliştiren: Violentmonkey kod desteği)
// @match        https://eksisozluk.com/mesaj
// @match        https://eksisozluk.com/mesaj/
// @match        https://eksisozluk.com/mesaj/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535881/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Mesaj%20Sayfalama.user.js
// @updateURL https://update.greasyfork.org/scripts/535881/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Mesaj%20Sayfalama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- AYARLAR ---
    const MESSAGES_PER_PAGE = 100;
    const MESSAGE_THREAD_ID = 'message-thread';
    const FIXED_HEADER_ID = 'top-bar';
    const SCROLL_OFFSET_ADJUSTMENT = 20;

    // --- STİL TANIMLAMALARI ---
    const styles = `
        #message-pagination-controls {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(40, 40, 40, 0.95);
            padding: 10px 15px;
            border: 1px solid #666;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            white-space: nowrap;
            color: #eee;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
        #message-pagination-controls button {
            padding: 6px 12px;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: #3a3a3a;
            color: #eee;
            cursor: pointer;
            font-size: 14px;
            margin: 0 5px;
            /* DEĞİŞİKLİK: 'transform' özelliğini de geçişe ekledik. */
            transition: background-color 0.2s ease, opacity 0.2s ease, transform 0.1s ease;
        }
        #message-pagination-controls button:hover:not(:disabled) {
            background-color: #505050;
        }
        /* YENİ: Tıklama efekti (buton basılıyken). */
        #message-pagination-controls button:active:not(:disabled) {
            background-color: #2c2c2c; /* Hover'dan bir ton daha koyu */
            transform: translateY(1px); /* Butonu 1px aşağı indirerek basılma hissi verir */
        }
        #message-pagination-controls button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #3a3a3a;
            color: #bbb;
        }
        #message-pagination-controls .page-info {
            font-weight: bold;
            margin: 0 10px;
        }
    `;
    GM_addStyle(styles);


    let currentPage = 1;
    let messages = [];
    let totalPages = 0;

    function showPage(pageNumber) {
        const startIndex = (pageNumber - 1) * MESSAGES_PER_PAGE;
        const endIndex = startIndex + MESSAGES_PER_PAGE;

        messages.forEach((msg, index) => {
            msg.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });

        const messageThreadDiv = document.getElementById(MESSAGE_THREAD_ID);
        const fixedHeader = document.getElementById(FIXED_HEADER_ID);

        const messageThreadTop = messageThreadDiv.getBoundingClientRect().top + window.scrollY;
        const scrollOffset = fixedHeader ? fixedHeader.offsetHeight : 0;

        window.scrollTo({
            top: messageThreadTop - scrollOffset - SCROLL_OFFSET_ADJUSTMENT,
            behavior: 'smooth'
        });
    }

    function updatePaginationControls() {
        const paginationDiv = document.getElementById('message-pagination-controls');
        if (!paginationDiv) return;

        const firstBtn = paginationDiv.querySelector('.btn-first');
        const prevBtn = paginationDiv.querySelector('.btn-prev');
        const nextBtn = paginationDiv.querySelector('.btn-next');
        const lastBtn = paginationDiv.querySelector('.btn-last');
        const pageInfo = paginationDiv.querySelector('.page-info');

        if (!firstBtn || !prevBtn || !nextBtn || !lastBtn || !pageInfo) return;

        firstBtn.disabled = (currentPage === 1);
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (currentPage === totalPages);
        lastBtn.disabled = (currentPage === totalPages);

        pageInfo.textContent = `Sayfa ${currentPage} / ${totalPages}`;
    }

    function createPaginationControls() {
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'message-pagination-controls';

        paginationDiv.innerHTML = `
            <button class="btn-first" title="İlk Sayfa">« İlk</button>
            <button class="btn-prev" title="Önceki Sayfa">« Önceki</button>
            <span class="page-info"></span>
            <button class="btn-next" title="Sonraki Sayfa">Sonraki »</button>
            <button class="btn-last" title="Son Sayfa">Son »</button>
        `;

        paginationDiv.querySelector('.btn-first').addEventListener('click', () => {
            if (currentPage !== 1) {
                currentPage = 1;
                showPage(currentPage);
                updatePaginationControls();
            }
        });
        paginationDiv.querySelector('.btn-prev').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updatePaginationControls();
            }
        });
        paginationDiv.querySelector('.btn-next').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                updatePaginationControls();
            }
        });
        paginationDiv.querySelector('.btn-last').addEventListener('click', () => {
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                showPage(currentPage);
                updatePaginationControls();
            }
        });

        return paginationDiv;
    }

    function initializePagination() {
        console.log('Sayfalama başlatılıyor veya güncelleniyor...');

        const messageThreadDiv = document.getElementById(MESSAGE_THREAD_ID);
        if (!messageThreadDiv) {
            console.log('Mesaj konteyneri bulunamadı.');
            return;
        }

        messages = Array.from(messageThreadDiv.querySelectorAll('article'));
        totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);

        const existingControls = document.getElementById('message-pagination-controls');
        if (existingControls) {
            existingControls.remove();
        }

        if (messages.length <= MESSAGES_PER_PAGE) {
            console.log('Sayfalama için yeterli mesaj yok. Tüm mesajlar gösteriliyor.');
            messages.forEach(msg => msg.style.display = '');
            return;
        }

        console.log(`${messages.length} mesaj bulundu. Sayfalama uygulanıyor.`);
        currentPage = 1;

        const paginationControls = createPaginationControls();
        document.body.appendChild(paginationControls);

        showPage(currentPage);
        updatePaginationControls();
    }

    // --- ANA ÇALIŞTIRMA MANTIĞI ---
    const targetNode = document.getElementById(MESSAGE_THREAD_ID);

    if (targetNode) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('Mesaj listesinde değişiklik saptandı. Yeniden başlatılıyor...');
                    initializePagination();
                    break;
                }
            }
        });

        const config = { childList: true };
        observer.observe(targetNode, config);
        initializePagination();
    } else {
        console.error('Mesaj Thread Pagination: Hedef konteyner (#message-thread) bulunamadı.');
    }

})();