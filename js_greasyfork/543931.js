// ==UserScript==
// @name         PiP no YouTube Mobile (Arrastável + Ocultável)
// @namespace    https://tampermonkey.net/
// @version      4.0
// @description  Picture-in-Picture forçado com botão flutuante arrastável e opção de ocultar/exibir no YouTube Mobile (Kiwi Browser)
// @author       Você
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543931/PiP%20no%20YouTube%20Mobile%20%28Arrast%C3%A1vel%20%2B%20Ocult%C3%A1vel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543931/PiP%20no%20YouTube%20Mobile%20%28Arrast%C3%A1vel%20%2B%20Ocult%C3%A1vel%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔧 Remove ?uniplayer_block_pip da URL
    function cleanUrl() {
        const url = new URL(location.href);
        if (url.searchParams.has('uniplayer_block_pip')) {
            url.searchParams.delete('uniplayer_block_pip');
            history.replaceState({}, '', url.toString());
            console.log('✅ Parâmetro uniplayer_block_pip removido!');
        }
    }

    cleanUrl();

    // 🧼 Remove atributo que bloqueia PiP
    function removeDisableAttribute() {
        const videos = document.querySelectorAll('video[disablePictureInPicture], video[disablepictureinpicture]');
        videos.forEach(v => {
            v.removeAttribute('disablePictureInPicture');
            v.removeAttribute('disablepictureinpicture');
            console.log('🧹 Atributo disablePictureInPicture removido');
        });
    }

    setInterval(removeDisableAttribute, 1000);

    // 🧭 Botão de menu ⋮
    function addMenuButton() {
        if (document.getElementById('pip-menu-button')) return;

        const btn = document.createElement('button');
        btn.id = 'pip-menu-button';
        btn.innerText = '⋮';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '15px',
            zIndex: '99999',
            backgroundColor: '#444',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            opacity: '0.8'
        });

        btn.onclick = () => {
            const action = prompt('🛠️ Opções do PiP:\n1 - Ativar PiP\n2 - Ocultar botão PiP\n3 - Exibir botão PiP');
            if (action === '1') activatePiP();
            else if (action === '2') hidePiPButton();
            else if (action === '3') showPiPButton();
        };

        document.body.appendChild(btn);
    }

    // ⧉ Botão PiP arrastável
    function addPiPButton() {
        if (document.getElementById('pip-button')) return;

        const btn = document.createElement('button');
        btn.id = 'pip-button';
        btn.innerText = '⧉ PiP';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '70px',
            right: '15px',
            zIndex: '99999',
            backgroundColor: '#ff0000',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            opacity: '0.9'
        });

        // Tornar arrastável (touch e mouse)
        let isDragging = false, startX, startY, origX, origY;

        const move = (e) => {
            if (!isDragging) return;
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
            btn.style.right = `auto`;
            btn.style.left = `${origX + x}px`;
            btn.style.bottom = `auto`;
            btn.style.top = `${origY + y}px`;
        };

        const stop = () => { isDragging = false; };

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = btn.offsetLeft;
            origY = btn.offsetTop;
        });

        btn.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            origX = btn.offsetLeft;
            origY = btn.offsetTop;
        });

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
        document.addEventListener('touchmove', move);
        document.addEventListener('touchend', stop);

        btn.onclick = activatePiP;

        document.body.appendChild(btn);
    }

    function activatePiP() {
        const video = document.querySelector('video');
        if (video) {
            video.removeAttribute('disablePictureInPicture');
            video.removeAttribute('disablepictureinpicture');
            video.requestPictureInPicture().catch(err =>
                alert('Erro ao ativar PiP: ' + err.message)
            );
        } else {
            alert('Nenhum vídeo encontrado!');
        }
    }

    function hidePiPButton() {
        const pip = document.getElementById('pip-button');
        if (pip) pip.style.display = 'none';
    }

    function showPiPButton() {
        const pip = document.getElementById('pip-button');
        if (pip) pip.style.display = 'block';
    }

    // ⏱️ Inicialização
    setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            addPiPButton();
            addMenuButton();
        }
    }, 1000);

    // Detecta mudanças de página (SPA)
    const observerUrl = new MutationObserver(cleanUrl);
    observerUrl.observe(document.body, { childList: true, subtree: true });
})();