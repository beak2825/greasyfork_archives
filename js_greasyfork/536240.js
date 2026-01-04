// ==UserScript==
// @name WhatsApp Web Sohbet Arşivle Butonu
// @namespace http://tampermonkey.net/ or https://violentmonkey.github.io
// @version 0.8
// @description WhatsApp Web sohbet listesine hızlı arşivleme simgesi ekler.
// @author CustME
// @match https://web.whatsapp.com/
// @grant none
// @icon data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zIDhoMThtMC00SDMuMTdhMiAyIDAgMDAtMS45MiAyLjU4TDMuMDcgMjlhMiAyIDAgMDAxLjkzIDEuNDJINi40NWEyIDIgMCAwMDItMlY0eiIvPjxwYXRoIGQ9Ik0xMiAxNlY2Ii8+PHBhdGggZD0iTTcgMTEuMkwxMiAxNmw1LTMuMiIvPjwvc3ZnPg==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536240/WhatsApp%20Web%20Sohbet%20Ar%C5%9Fivle%20Butonu.user.js
// @updateURL https://update.greasyfork.org/scripts/536240/WhatsApp%20Web%20Sohbet%20Ar%C5%9Fivle%20Butonu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svgNS = 'http://www.w3.org/2000/svg';

    function addArchiveButton(chatElement) {
        if (chatElement.classList.contains('archive-button-added')) {
            return;
        }
        chatElement.classList.add('archive-button-added');

        const timeStatusContainer = chatElement.querySelector('._ak8j');
        if (!timeStatusContainer) {
            console.warn('WhatsApp: Zaman/durum konteyneri (._ak8j) bulunamadı:', chatElement);
            return;
        }

        if (timeStatusContainer.querySelector('.whatsapp-archive-button')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'whatsapp-archive-button';
        button.title = 'Sohbeti Arşivle';
        button.style.cssText = `
            width: 18px;
            height: 18px;
            min-width: 18px;
            background-color: #e9e9eb;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            color: #555;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin-left: 5px;
            opacity: 0.8;
            transition: opacity 0.1s ease-in-out;
            flex-shrink: 0;
        `;

        // Yeni, daha modern arşiv ikonu SVG'si
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', 'M3 8h18m0-4H3.17a2 2 0 00-1.92 2.58L3.07 29a2 2 0 001.93 1.42H6.45a2 2 0 002-2V4z'); // Kasa veya kutu kısmı
        const path2 = document.createElementNS(svgNS, 'path');
        path2.setAttribute('d', 'M12 16V6'); // Okun dikey çizgisi
        const path3 = document.createElementNS(svgNS, 'path');
        path3.setAttribute('d', 'M7 11.2L12 16l5-3.2'); // Okun başı
        
        svg.appendChild(path);
        svg.appendChild(path2);
        svg.appendChild(path3);
        button.appendChild(svg);

        button.addEventListener('mouseover', () => { button.style.opacity = '1'; });
        button.addEventListener('mouseout', () => { button.style.opacity = '0.8'; });

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();

            const targetChat = event.target.closest('._ak8l');
            if (!targetChat) return;

            const chatRect = targetChat.getBoundingClientRect();
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX: chatRect.left + chatRect.width - 20,
                clientY: chatRect.top + chatRect.height / 2
            });
            targetChat.dispatchEvent(contextMenuEvent);

            setTimeout(() => {
                const contextMenu = document.querySelector('._ak4w');

                if (contextMenu) {
                    let archiveMenuItem = null;

                    // 1. Yol: data-icon ile arama (en güvenilir yol)
                    archiveMenuItem = contextMenu.querySelector('li[role="button"] > div > span[data-icon="archive-refreshed"]');

                    if (!archiveMenuItem) {
                        // 2. Yol: Eğer data-icon bulunamazsa, innerText ile arama (yedek)
                        archiveMenuItem = Array.from(contextMenu.querySelectorAll('li[role="button"]'))
                                             .find(item => item.querySelector('span.x1o2sk6j')?.innerText === 'Sohbeti arşivle');
                    }
                    
                    if (archiveMenuItem) {
                        // Bulunan menü öğesinin en yakın li elementine tıklayın
                        archiveMenuItem.closest('li[role="button"]').click();
                        console.log('WhatsApp: Arşiv butonu tıklandı, menü öğesi bulundu ve tıklandı.');
                    } else {
                        console.error('WhatsApp: "Sohbeti arşivle" menü öğesi bulunamadı. Mevcut menü öğeleri:');
                        contextMenu.querySelectorAll('li[role="button"]').forEach(item => {
                            const spanText = item.querySelector('span.x1o2sk6j')?.innerText;
                            const dataIcon = item.querySelector('span[data-icon]')?.getAttribute('data-icon');
                            console.log(`- Metin: "${spanText || 'Yok'}", İkon: "${dataIcon || 'Yok'}"`);
                        });
                    }
                } else {
                    console.error('WhatsApp: Bağlam menüsü konteyneri (._ak4w) bulunamadı.');
                }
            }, 150); // Gecikmeyi 150ms'ye çıkarıldı.

        });

        timeStatusContainer.appendChild(button);
    }

    const chatListContainerSelector = 'div[aria-label="Sohbet listesi"][role="grid"]';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('_ak8l')) {
                            addArchiveButton(node);
                        }
                        if (node.querySelectorAll) {
                            node.querySelectorAll('._ak8l').forEach(addArchiveButton);
                        }
                    }
                });
            }
        });
    });

    function findContainerAndObserve() {
        const chatListContainer = document.querySelector(chatListContainerSelector);
        if (chatListContainer) {
            console.log('WhatsApp: Sohbet listesi konteyneri bulundu. Mevcut sohbetlere butonlar ekleniyor ve yenileri gözlemleniyor.');
            chatListContainer.querySelectorAll('._ak8l').forEach(addArchiveButton);
            observer.observe(chatListContainer, { childList: true, subtree: false });
        } else {
            console.log('WhatsApp: Sohbet listesi konteyneri (', chatListContainerSelector, ') bulunamadı. Tekrar deneniyor...');
            setTimeout(findContainerAndObserve, 1000);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(findContainerAndObserve, 500);
    });

})();
