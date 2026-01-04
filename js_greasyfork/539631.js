// ==UserScript==
// @name         Prime Video - Botão Play com Modal
// @namespace    ViolaoScripts
// @version      1.0
// @description  Adiciona botão de play nos episódios do Chespirito para abrir um player com vídeo via UUID
// @match        https://www.primevideo.com/detail/Chespirito/*
// @match        https://www.primevideo.com/detail/Chapolin/*
// @match        https://www.primevideo.com/detail/Chaves/*
// @match        https://www.primevideo.com/detail/Chespirito/0LTUA736Z5D6V5NJ9W30JG3T32/*
// @match        https://www.primevideo.com/detail/Chapolin/0K6607AIVVY4WUB0ML6ARUY5PV/*
// @match        https://www.primevideo.com/detail/Chaves/0JGKTUD4UOLES3FIEFMC2RRKJY/*
// @match        https://www.primevideo.com/detail/Chaves/0LCS0JBM5Y71SWU8CRH0Y6Q7AW/*
// @match        https://www.primevideo.com/detail/Chaves/0PQHRHWO1S4JYZ6MZ956GWTKB9/*
// @match        https://www.primevideo.com/detail/Chaves/0J3SEWP3O4IOZDQHKPR2QILQSJ/*
// @match        https://www.primevideo.com/detail/Chaves/0QG2H9W9BGCWG34UMW9V4B5PP4/*
// @match        https://www.primevideo.com/detail/Chaves/0LPKDFBDSL14SSDICQHEULIKGS/*
// @match        https://www.primevideo.com/detail/Chaves/0GM9WOMNADLZ5NS1HDM5B1E3JZ/*
// @match        https://www.primevideo.com/detail/0LTUA736Z5D6V5NJ9W30JG3T32/*
// @match        https://www.primevideo.com/detail/0K6607AIVVY4WUB0ML6ARUY5PV/*
// @match        https://www.primevideo.com/detail/0JGKTUD4UOLES3FIEFMC2RRKJY/*
// @match        https://www.primevideo.com/detail/0LCS0JBM5Y71SWU8CRH0Y6Q7AW/*
// @match        https://www.primevideo.com/detail/0PQHRHWO1S4JYZ6MZ956GWTKB9/*
// @match        https://www.primevideo.com/detail/0J3SEWP3O4IOZDQHKPR2QILQSJ/*
// @match        https://www.primevideo.com/detail/0QG2H9W9BGCWG34UMW9V4B5PP4/*
// @match        https://www.primevideo.com/detail/0LPKDFBDSL14SSDICQHEULIKGS/*
// @match        https://www.primevideo.com/detail/0GM9WOMNADLZ5NS1HDM5B1E3JZ/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539631/Prime%20Video%20-%20Bot%C3%A3o%20Play%20com%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/539631/Prime%20Video%20-%20Bot%C3%A3o%20Play%20com%20Modal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CRIA O MODAL UMA VEZ ===
    const modal = document.createElement('div');
    modal.id = 'meu-player-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background-color: rgba(0,0,0,0.8); display: none;
        justify-content: center; align-items: center; z-index: 9999;
    `;
    modal.innerHTML = `
    <div style="position: relative; width: 80%; max-width: 800px;">
            <button id="fechar-modal" style="
                position: absolute; top: 10px; right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                z-index: 10000;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 0, 0, 0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.7)'">
                ✕ Fechar
            </button>
            <video id="modal-video" controls autoplay style="width: 100%; height: auto; background: black;"></video>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#fechar-modal').onclick = () => {
        const video = document.getElementById('modal-video');
        video.pause();
        video.src = '';
        modal.style.display = 'none';
    };

    function criarBotaoPlay(uuid, nome) {
        const href = `https://amzch.sbtcdn.workers.dev/12:/${uuid}.mp4`;
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="Sb08Os" bis_skin_checked="1">
                <label class="jDcAoh _62Ap1y" data-testid="play-button-IDLE" for="fake-play-id" aria-describedby="fake-play-id">
                    <a aria-label="Assistir ${nome}" href="#" class="_39zede _2lS2e0 fbl-icon-btn _2fIZJa">
                        <div class="_3G1q6i">
                            <svg class="fbl-icon _30dE3d _1a_Ljt" viewBox="0 0 24 24" height="24" width="24" role="img" aria-hidden="true">
                                <title>Play</title>
                                <path d="M8 5v14l11-7z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </a>
                </label>
            </div>
        `.trim();
        const botao = container.querySelector('a');
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const video = document.getElementById('modal-video');
            video.src = href;
            modal.style.display = 'flex';
        });
        return container.firstElementChild;
    }

    function processarEpisodios() {
        const episodios = document.querySelectorAll('li[id^="av-ep-episode-"]');
        episodios.forEach(ep => {
            if (ep.dataset.botaoAdicionado === "true") return;

            const checkbox = ep.querySelector('input[type="checkbox"]');
            if (!checkbox) return;
            const uuidCompleto = checkbox.id.split('selector-')[1];
            const uuid = uuidCompleto?.split('.gti.')[1];
            const nome = ep.innerText.trim().split('\n')[0] || 'Episódio';

            const referencia = ep.querySelector('div.Sb08Os');
            if (uuid && referencia) {
                const botao = criarBotaoPlay(uuid, nome);
                referencia.parentNode.insertBefore(botao, referencia.nextSibling);
                ep.dataset.botaoAdicionado = "true";
            }
        });
    }

    function removerMensagensIndesejadas() {
        // Mensagem de direitos expirados
        const msg1 = document.querySelector('[data-testid="buy-box-msg"]');
        if (msg1 && msg1.innerText.includes('direitos expirados')) {
            msg1.remove();
        }

        // Container vazio indesejado (geralmente depois da mensagem)
        document.querySelectorAll('div.abwJ5F._2LF_6p').forEach(el => {
            if (el.offsetHeight < 5 || !el.textContent.trim()) {
                el.remove();
            }
        });
    }

    // Observador para mudanças dinâmicas
    const observer = new MutationObserver(() => {
        processarEpisodios();
        removerMensagensIndesejadas();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Inicialização após o carregamento
    window.addEventListener('load', () => {
        setTimeout(() => {
            processarEpisodios();
            removerMensagensIndesejadas();
        }, 2000);
    });
})();