// ==UserScript==
// @name         Twitter Scroller & Like Clicker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Scroll e like automation para Twitter (PageDown e inicia no primeiro post sem like)
// @author       luascfl
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @home         https://github.com/luascfl/x-auto-scroll-and-like
// @supportURL   https://github.com/luascfl/x-auto-scroll-and-like/issues
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531378/Twitter%20Scroller%20%20Like%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/531378/Twitter%20Scroller%20%20Like%20Clicker.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Configurações
    const SETTINGS = {
        scrollSpeed: 1000,           // intervalo de rolagem (ms)
        likeDelay: 500,
        maxReloads: 200,
        initialScrollDelay: 2000     // delay para rolar até o primeiro tweet sem like (ms)
    };
    let isActive = {
        scroll: false,
        like: false
    };

    // Função para criar botões na barra de navegação
    function createNavButton(text, svgPath, clickHandler) {
        const button = document.createElement('a');
        button.href = '#';
        button.className = 'css-175oi2r r-6koalj r-eqz5dr r-16y2uox r-1habvwh r-13qz1uu r-1mkv55d r-1ny4l3l r-1loqt21';
        button.innerHTML = `
            <div class="css-175oi2r r-sdzlij r-dnmrzs r-1awozwy r-18u37iz r-1777fci r-xyw6el r-o7ynqc r-6416eg">
                <div class="css-175oi2r">
                    <svg viewBox="0 0 24 24" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e">
                        <path d="${svgPath}"></path>
                    </svg>
                    <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="color: inherit;">${text}</span>
                </div>
            </div>
        `;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            clickHandler();
        });
        return button;
    }

    // Adiciona os controles (botões) à barra de navegação do Twitter
    function addControlsToNav() {
        const moreButton = document.querySelector('[data-testid="AppTabBar_More_Menu"]');
        if (!moreButton) return;
        const parent = moreButton.parentNode;
        if (!parent) return;

        // Botão de Auto Scroll
        const scrollButton = createNavButton(
            'Auto Scroll',
            'M12 4.656l8.72 8.72c.293.293.768.293 1.06 0s.294-.768 0-1.06l-9.25-9.25c-.292-.294-.767-.294-1.06 0l-9.25 9.25c-.146.145-.22.337-.22.53s.073.383.22.53c.293.292.768.292 1.06 0L12 4.656z',
            () => {
                isActive.scroll = !isActive.scroll;
                scrollButton.style.color = isActive.scroll ? 'rgb(29, 155, 240)' : '';
            }
        );

        // Botão de Auto Like – ao ativá-lo, rola para o primeiro tweet sem like
        const likeButton = createNavButton(
            'Auto Like',
            'M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z',
            () => {
                isActive.like = !isActive.like;
                likeButton.style.color = isActive.like ? 'rgb(249, 24, 128)' : '';
                if (isActive.like) {
                    scrollToFirstUnlikedTweet();
                }
            }
        );

        // Insere os botões antes do botão "Mais"
        parent.insertBefore(likeButton, moreButton);
        parent.insertBefore(scrollButton, moreButton);
    }

    // Função que rola para o primeiro tweet que não foi curtido
    function scrollToFirstUnlikedTweet(attempt = 0) {
        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        for (const tweet of tweets) {
            const likeButton = tweet.querySelector('[data-testid="like"]');
            if (likeButton && !likeButton.querySelector('svg[aria-label="Curtido"]')) {
                tweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('Rolando para o primeiro tweet sem like');
                return;
            }
        }
        // Se não encontrar, tenta novamente (até 5 vezes)
        if (attempt < 5) {
            console.log('Tweet sem like não encontrado, tentando novamente...');
            setTimeout(() => scrollToFirstUnlikedTweet(attempt + 1), 2000);
        } else {
            console.log('Nenhum tweet sem like encontrado após várias tentativas.');
        }
    }

    // Lógica de scroll (simula a tecla PageDown)
    function autoScroll() {
        window.scrollBy({
            top: window.innerHeight,
            left: 0,
            behavior: 'smooth'
        });
        console.log('PageDown executado');
    }

    // Lógica de likes – clica nos botões de like que ainda não foram ativados
    function autoLike() {
        const likeButtons = document.querySelectorAll('[data-testid="like"]');
        likeButtons.forEach(btn => {
            if (!btn.querySelector('svg[aria-label="Curtido"]')) {
                setTimeout(() => btn.click(), Math.random() * SETTINGS.likeDelay);
                console.log('Tweet curtido');
            }
        });
        if (likeButtons.length === 0) {
            console.log('Nenhum botão de like encontrado');
        }
    }

    // Loop principal que alterna as funções de scroll e like
    let reloadCount = 0;
    setInterval(() => {
        if (isActive.scroll) {
            autoScroll();
            reloadCount++;
            if (reloadCount > SETTINGS.maxReloads) {
                window.location.reload();
                reloadCount = 0;
            }
        }
        if (isActive.like) {
            autoLike();
        }
    }, SETTINGS.scrollSpeed);

    // Inicialização
    const init = () => {
        addControlsToNav();
        // Observador para garantir que os botões sejam adicionados caso a navegação seja carregada dinamicamente
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector('[data-testid="AppTabBar_More_Menu"]')) {
                        addControlsToNav();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Após um pequeno delay, rola até o primeiro tweet sem like
        setTimeout(() => {
            scrollToFirstUnlikedTweet();
        }, SETTINGS.initialScrollDelay);
    };

    // Aguarda o carregamento completo da página
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
