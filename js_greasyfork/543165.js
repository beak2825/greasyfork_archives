// ==UserScript==
// @name         Botão Busca avançada de Filmes e Séries ASC
// @namespace    https://cliente.amigos-share.club/
// @version      1.1
// @description  Adiciona Botão Busca avançada de Filmes e Séries no menu do site ao lado do menu Minha Conta
// @author       Magaki
// @icon         https://amigos-share.club/favicon.ico
// @match        https://cliente.amigos-share.club/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543165/Bot%C3%A3o%20Busca%20avan%C3%A7ada%20de%20Filmes%20e%20S%C3%A9ries%20ASC.user.js
// @updateURL https://update.greasyfork.org/scripts/543165/Bot%C3%A3o%20Busca%20avan%C3%A7ada%20de%20Filmes%20e%20S%C3%A9ries%20ASC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const menu = document.querySelector('#nav_slate .navbar-nav.mr-auto');
        if (!menu) return;

        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = 'https://cliente.amigos-share.club/busca-series.php';
        a.innerHTML = '<i class="fas fa-film"></i> Séries';

        li.appendChild(a);

        const filmesBtn = Array.from(menu.querySelectorAll('a[href$="enviar-filme.php"]')).find(e => e.closest('li.nav-item'));
        if (filmesBtn) {
            filmesBtn.closest('li.nav-item').after(li);
        } else {
            menu.appendChild(li);
        }
    });
})();


(function() {
    'use strict';

    window.addEventListener('load', () => {
        const menu = document.querySelector('#nav_slate .navbar-nav.mr-auto');
        if (!menu) {
            console.error;
            return;
        }

        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = 'https://cliente.amigos-share.club/busca-filmes.php';
        a.innerHTML = '<i class="fas fa-film"></i> Filmes';

        li.appendChild(a);

        menu.appendChild(li);

        console.log;
    });
})();