// ==UserScript==
// @name         Hide Liked Posts on Instagram (Auto Scroll)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hides posts you've liked on instagram.com and auto-scrolls to load all content
// @author       luascfl (improved)
// @match        https://www.instagram.com/*
// @home         https://github.com/luascfl/hide-liked-posts-instagram
// @supportURL   https://github.com/luascfl/hide-liked-posts-instagram/issues
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531377/Hide%20Liked%20Posts%20on%20Instagram%20%28Auto%20Scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531377/Hide%20Liked%20Posts%20on%20Instagram%20%28Auto%20Scroll%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAutoScrolling = false;
    let loadingSpinnerLastSeen = null;
    let scrollInterval = null;
    let checkInterval = null;

    // Function to hide liked posts
    function hideLikedPosts() {
        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const likeIcon = post.querySelector('svg[aria-label="Descurtir"]');
            if (likeIcon && post.style.display !== 'none') {
                post.style.display = 'none';
            }
        });
    }

    // Function to check if loading spinner exists
    function isLoadingSpinnerPresent() {
        const spinner = document.querySelector('svg[aria-label="Carregando..."]');
        return spinner !== null;
    }

    // Function to scroll to bottom
    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Function to start auto-scrolling
    function startAutoScroll() {
        if (isAutoScrolling) return;
        
        console.log('Iniciando auto-scroll...');
        isAutoScrolling = true;
        loadingSpinnerLastSeen = Date.now();

        // Scroll interval - desce a página a cada 1 segundo
        scrollInterval = setInterval(() => {
            scrollToBottom();
            hideLikedPosts();
        }, 1000);

        // Check interval - verifica o spinner a cada 500ms
        checkInterval = setInterval(() => {
            if (isLoadingSpinnerPresent()) {
                loadingSpinnerLastSeen = Date.now();
                console.log('Spinner de carregamento detectado');
            } else {
                const timeSinceLastSpinner = Date.now() - loadingSpinnerLastSeen;
                
                if (timeSinceLastSpinner >= 5000) {
                    console.log('Spinner não detectado por 5 segundos. Parando auto-scroll.');
                    stopAutoScroll();
                }
            }
        }, 500);
    }

    // Function to stop auto-scrolling
    function stopAutoScroll() {
        if (!isAutoScrolling) return;

        console.log('Auto-scroll finalizado');
        isAutoScrolling = false;
        
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }

        // Faz uma última verificação para esconder posts curtidos
        hideLikedPosts();
        
        // Atualiza o botão
        const button = document.querySelector('#auto-scroll-button');
        if (button) {
            button.textContent = '▼ Auto Scroll';
            button.style.background = '#262626';
        }
    }

    // Function to observe content dynamically
    function observeContent() {
        const feed = document.querySelector('main');
        if (feed) {
            const observer = new MutationObserver(() => {
                hideLikedPosts();
            });

            observer.observe(feed, { childList: true, subtree: true });
            hideLikedPosts();
        }
    }

    // Adiciona botão para iniciar/parar auto-scroll manualmente
    function addControlButton() {
        const button = document.createElement('button');
        button.id = 'auto-scroll-button';
        button.textContent = '▼ Auto Scroll';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #262626;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
                button.textContent = '■ Parar Scroll';
                button.style.background = '#e60023';
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        document.body.appendChild(button);
    }

    // Aguarda a página carregar e inicia
    setTimeout(() => {
        observeContent();
        addControlButton();
        
        // NÃO inicia auto-scroll automaticamente
        // Se quiser que inicie automaticamente, descomente a linha abaixo:
        // startAutoScroll();
    }, 2000);

})();
