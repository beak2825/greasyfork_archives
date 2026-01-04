// ==UserScript==
// @name         ChatGPT Ikonka: Przeciąganie, Pamięć pozycji, Ukrywanie klawiszem "H" i podczas filmu
// @version      3.0
// @description  Ikona ChatGPT - lepsze zarządzanie widocznością, nasłuchiwanie filmów, obsługa resize, przeciąganie lewym kliknięciem
// @author       vkamix11
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1462431
// @downloadURL https://update.greasyfork.org/scripts/534061/ChatGPT%20Ikonka%3A%20Przeci%C4%85ganie%2C%20Pami%C4%99%C4%87%20pozycji%2C%20Ukrywanie%20klawiszem%20%22H%22%20i%20podczas%20filmu.user.js
// @updateURL https://update.greasyfork.org/scripts/534061/ChatGPT%20Ikonka%3A%20Przeci%C4%85ganie%2C%20Pami%C4%99%C4%87%20pozycji%2C%20Ukrywanie%20klawiszem%20%22H%22%20i%20podczas%20filmu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedPosition = { top: '50%', left: '10px' };
    try {
        savedPosition = JSON.parse(localStorage.getItem('chatgpt_icon_position')) || savedPosition;
    } catch (e) {}

    const img = document.createElement('img');
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg';
    img.style.position = 'fixed';
    img.style.left = savedPosition.left;
    img.style.top = savedPosition.top;
    img.style.zIndex = '9999';
    img.style.width = '40px';
    img.style.height = '40px';
    img.style.cursor = 'move';
    img.style.userSelect = 'none';
    img.title = 'Lewy klik: Otwórz ChatGPT\nPrzeciągnij: Przesuń ikonę';
    document.body.appendChild(img);

    let isDragging = false;
    let wasDragged = false;
    let isHovered = false;
    let offsetX, offsetY;

    let userHidden = localStorage.getItem('chatgpt_icon_hidden') === 'true';
    let videoHidden = false;

    function updateVisibility() {
        img.style.display = (userHidden || videoHidden) ? 'none' : 'block';
    }

    updateVisibility();

    // Kliknięcie w ikonę
    img.addEventListener('click', (e) => {
        if (!wasDragged && e.button === 0) {
            window.open('https://chat.openai.com/', '_blank');
        }
    });

    // Przeciąganie (lewym przyciskiem)
    img.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Tylko lewy klik
        isDragging = true;
        wasDragged = false;
        offsetX = e.clientX - img.getBoundingClientRect().left;
        offsetY = e.clientY - img.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            wasDragged = true;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            const maxLeft = window.innerWidth - img.offsetWidth;
            const maxTop = window.innerHeight - img.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            img.style.left = newLeft + 'px';
            img.style.top = newTop + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            if (wasDragged) {
                localStorage.setItem('chatgpt_icon_position', JSON.stringify({ top: img.style.top, left: img.style.left }));
            }
        }
    });

    // Najazd na ikonę
    img.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    img.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Klawiatura - ukrycie/pokazanie
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'h' || e.key === 'H') && isHovered) {
            userHidden = true;
            localStorage.setItem('chatgpt_icon_hidden', 'true');
            updateVisibility();
        } else if (e.key === '\\') {
            userHidden = false;
            localStorage.removeItem('chatgpt_icon_hidden');
            updateVisibility();
        }
    });

    // Ukrywanie przy filmie
    function observeVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.dataset.chatgptObserved) { // Sprawdzanie, czy już obserwowany
                video.addEventListener('play', () => {
                    videoHidden = true;
                    updateVisibility();
                });
                video.addEventListener('pause', () => {
                    videoHidden = false;
                    updateVisibility();
                });
                video.addEventListener('ended', () => {
                    videoHidden = false;
                    updateVisibility();
                });
                video.dataset.chatgptObserved = 'true';
            }
        });
    }

    observeVideos();

    // Na wypadek dynamicznego ładowania video elementów (np. YouTube)
    const observer = new MutationObserver(() => {
        observeVideos();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Blokowanie menu PPM nad ikoną
    document.addEventListener('contextmenu', (e) => {
        if (isHovered) {
            e.preventDefault();
        }
    });

    // Automatyczna korekta pozycji po resize
    window.addEventListener('resize', () => {
        const rect = img.getBoundingClientRect();
        const maxLeft = window.innerWidth - img.offsetWidth;
        const maxTop = window.innerHeight - img.offsetHeight;

        let needSave = false;

        if (rect.left > maxLeft) {
            img.style.left = maxLeft + 'px';
            needSave = true;
        }
        if (rect.top > maxTop) {
            img.style.top = maxTop + 'px';
            needSave = true;
        }

        if (needSave) {
            localStorage.setItem('chatgpt_icon_position', JSON.stringify({ top: img.style.top, left: img.style.left }));
        }
    });

})();
