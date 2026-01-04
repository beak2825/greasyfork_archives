// ==UserScript==
// @name         wplace.live Guia Visual Avançado
// @namespace    ViolentMonkey
// @version      3.0
// @description  Ferramenta completa para sobrepor imagens no wplace.live com controles avançados
// @author       Você
// @match        https://wplace.live/*
// @license      MIT  //
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/544558/wplacelive%20Guia%20Visual%20Avan%C3%A7ado.user.js
// @updateURL https://update.greasyfork.org/scripts/544558/wplacelive%20Guia%20Visual%20Avan%C3%A7ado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // CONFIGURAÇÕES E CONSTANTES
    // =============================================
    const DIMENSOES = {
        PAINEL: {
            NORMAL: { width: 320, height: 'auto' },
            MINIMIZADO: { width: 150, height: 40 }
        },
        MARGENS: {
            PADRAO: 20,
            MINIMA: 10
        },
        OPACIDADE: {
            MIN: 0.1,
            MAX: 1,
            STEP: 0.1
        },
        TAMANHO: {
            MIN: 20,
            MAX: 200,
            STEP: 10
        }
    };

    const config = {
        urlImagem: '',
        opacidade: 0.6,
        deslocamento: { x: 0, y: 0 },
        tamanho: 100,
        janelaMinimizada: false,
        posicaoJanela: { x: null, y: null }
    };

    // =============================================
    // ELEMENTOS DA INTERFACE
    // =============================================
    const elementos = {
        guia: null,
        controles: null,
        urlInput: null,
        carregarBtn: null,
        status: null,
        opacidade: null,
        tamanhoValor: null,
        diminuirBtn: null,
        aumentarBtn: null,
        tamanhoSlider: null,
        minimizarBtn: null,
        dragHandle: null
    };

    // =============================================
    // ESTILOS CSS
    // =============================================
    GM_addStyle(`
        #wplace-guia {
            position: absolute;
            pointer-events: none;
            z-index: 9998;
            opacity: ${config.opacidade};
            image-rendering: pixelated;
            border: 2px dashed rgba(255,255,255,0.3);
            display: ${config.urlImagem ? 'block' : 'none'};
            transform-origin: top left;
            will-change: transform;
        }

        #wplace-controles {
            position: fixed;
            z-index: 9999;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            padding-top: 35px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 15px rgba(0,0,0,0.7);
            user-select: none;
            will-change: transform;
            transition: all 0.2s ease;
            width: ${DIMENSOES.PAINEL.NORMAL.width}px;
        }

        #wplace-controles.minimizado {
            height: ${DIMENSOES.PAINEL.MINIMIZADO.height}px;
            width: ${DIMENSOES.PAINEL.MINIMIZADO.width}px;
            padding-top: 15px;
            overflow: hidden;
        }

        #wplace-controles.minimizado .conteudo-controles {
            display: none;
        }

        #wplace-drag-handle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 30px;
            cursor: move;
            touch-action: none;
        }

        #wplace-minimizar-btn {
            position: absolute;
            top: 35px;
            right: 5px;
            background: transparent;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
            z-index: 10000;
        }

        #wplace-controles.minimizado #wplace-minimizar-btn {
            top: 5px;
            position: static;
            margin: 0 auto;
            display: block;
        }

        .grupo-controle {
            margin-bottom: 12px;
        }

        #wplace-url-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            background: rgba(255,255,255,0.1);
            border: 1px solid #444;
            color: white;
            border-radius: 4px;
        }

        #wplace-carregar-btn {
            width: 100%;
            padding: 8px;
            background: #4CAF50;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            transition: background 0.2s;
        }

        #wplace-carregar-btn:hover {
            background: #45a049;
        }

        #wplace-carregar-btn.carregando {
            background: #367c39;
        }

        #wplace-status {
            margin-top: 10px;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            font-size: 13px;
        }

        .controle-tamanho {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .botao-tamanho {
            width: 30px;
            height: 30px;
            background: #555;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .botao-tamanho:hover {
            background: #666;
        }

        #wplace-tamanho-valor {
            min-width: 40px;
            text-align: center;
        }

        #wplace-controles.dragging {
            cursor: grabbing;
            transition: none;
        }

        .loader {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 5px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `);

    // =============================================
    // FUNÇÕES PRINCIPAIS
    // =============================================

    /**
     * Cria todos os elementos da interface
     */
    function criarInterface() {
        elementos.controles = $(`
            <div id="wplace-controles" class="${config.janelaMinimizada ? 'minimizado' : ''}">
                <div id="wplace-drag-handle"></div>
                <button id="wplace-minimizar-btn">${config.janelaMinimizada ? '⬛' : '➖'}</button>
                <div class="conteudo-controles">
                    <div class="grupo-controle">
                        <label>URL da Imagem:</label>
                        <input type="text" id="wplace-url-input" placeholder="https://exemplo.com/imagem.png" value="${config.urlImagem}">
                        <button id="wplace-carregar-btn">Carregar Imagem</button>
                        <div id="wplace-status">${config.urlImagem ? 'Imagem pronta' : 'Nenhuma imagem carregada'}</div>
                    </div>

                    <div class="grupo-controle">
                        <label>Opacidade: ${config.opacidade.toFixed(1)}</label>
                        <input type="range" id="wplace-opacidade" min="${DIMENSOES.OPACIDADE.MIN}" max="${DIMENSOES.OPACIDADE.MAX}" step="${DIMENSOES.OPACIDADE.STEP}" value="${config.opacidade}">
                    </div>

                    <div class="grupo-controle">
                        <label>Tamanho da Imagem:</label>
                        <div class="controle-tamanho">
                            <button class="botao-tamanho" id="wplace-diminuir">-</button>
                            <span id="wplace-tamanho-valor">${config.tamanho}%</span>
                            <button class="botao-tamanho" id="wplace-aumentar">+</button>
                            <input type="range" id="wplace-tamanho-slider" min="${DIMENSOES.TAMANHO.MIN}" max="${DIMENSOES.TAMANHO.MAX}" value="${config.tamanho}" style="flex-grow:1;">
                        </div>
                    </div>

                    <div class="grupo-controle">
                        <label>Posição Atual:</label>
                        <div>X: ${config.deslocamento.x}px, Y: ${config.deslocamento.y}px</div>
                    </div>
                </div>
            </div>
        `);

        elementos.guia = $(`<img id="wplace-guia" src="${config.urlImagem}" alt="Guia visual">`);

        $('body').append(elementos.guia, elementos.controles);

        // Cache de elementos
        elementos.urlInput = $('#wplace-url-input');
        elementos.carregarBtn = $('#wplace-carregar-btn');
        elementos.status = $('#wplace-status');
        elementos.opacidade = $('#wplace-opacidade');
        elementos.tamanhoValor = $('#wplace-tamanho-valor');
        elementos.diminuirBtn = $('#wplace-diminuir');
        elementos.aumentarBtn = $('#wplace-aumentar');
        elementos.tamanhoSlider = $('#wplace-tamanho-slider');
        elementos.minimizarBtn = $('#wplace-minimizar-btn');
        elementos.dragHandle = $('#wplace-drag-handle');
    }

    /**
     * Ajusta a posição da janela para ficar visível
     * @param {HTMLElement} element - Elemento do painel de controles
     */
    function ajustarPosicaoJanela(element) {
        if (config.janelaMinimizada) {
            // Posiciona no canto inferior direito quando minimizado
            element.style.left = 'auto';
            element.style.right = DIMENSOES.MARGENS.PADRAO + 'px';
            element.style.top = 'auto';
            element.style.bottom = DIMENSOES.MARGENS.PADRAO + 'px';
            return;
        }

        const width = DIMENSOES.PAINEL.NORMAL.width;
        const height = element.offsetHeight;

        // Verifica se a posição está fora da tela
        if (config.posicaoJanela.x === null ||
            config.posicaoJanela.x > window.innerWidth - DIMENSOES.MARGENS.MINIMA ||
            config.posicaoJanela.x < -width + DIMENSOES.MARGENS.MINIMA) {
            config.posicaoJanela.x = window.innerWidth - width - DIMENSOES.MARGENS.PADRAO;
        }

        if (config.posicaoJanela.y === null ||
            config.posicaoJanela.y > window.innerHeight - DIMENSOES.MARGENS.MINIMA ||
            config.posicaoJanela.y < -height + DIMENSOES.MARGENS.MINIMA) {
            config.posicaoJanela.y = window.innerHeight - height - DIMENSOES.MARGENS.PADRAO;
        }

        // Aplica a posição ajustada
        element.style.left = `${Math.max(DIMENSOES.MARGENS.MINIMA, Math.min(config.posicaoJanela.x, window.innerWidth - width - DIMENSOES.MARGENS.MINIMA))}px`;
        element.style.top = `${Math.max(DIMENSOES.MARGENS.MINIMA, Math.min(config.posicaoJanela.y, window.innerHeight - height - DIMENSOES.MARGENS.MINIMA))}px`;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }

    /**
     * Torna a janela arrastável
     * @param {HTMLElement} element - Elemento do painel de controles
     */
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const dragMouseDown = (e) => {
            if (e.target !== elementos.dragHandle[0] || config.janelaMinimizada) return;

            e.preventDefault();
            isDragging = true;

            startX = e.clientX;
            startY = e.clientY;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;

            element.classList.add('dragging');
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        };

        const elementDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const newLeft = startLeft + (e.clientX - startX);
            const newTop = startTop + (e.clientY - startY);

            const maxTop = window.innerHeight - (config.janelaMinimizada ? DIMENSOES.PAINEL.MINIMIZADO.height : element.offsetHeight);
            const maxLeft = window.innerWidth - (config.janelaMinimizada ? DIMENSOES.PAINEL.MINIMIZADO.width : element.offsetWidth);

            element.style.left = `${Math.min(Math.max(newLeft, DIMENSOES.MARGENS.MINIMA), maxLeft - DIMENSOES.MARGENS.MINIMA)}px`;
            element.style.top = `${Math.min(Math.max(newTop, DIMENSOES.MARGENS.MINIMA), maxTop - DIMENSOES.MARGENS.MINIMA)}px`;

            element.style.right = 'auto';
            element.style.bottom = 'auto';

            config.posicaoJanela = {
                x: parseInt(element.style.left),
                y: parseInt(element.style.top)
            };
        };

        const closeDragElement = () => {
            isDragging = false;
            element.classList.remove('dragging');
            salvarConfiguracao();
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        };

        elementos.dragHandle.on('mousedown', dragMouseDown);
    }

    /**
     * Carrega a imagem da URL
     * @param {string} url - URL da imagem a ser carregada
     * @returns {boolean} Retorna true se o carregamento foi iniciado com sucesso
     */
    function carregarImagem(url) {
        if (!validarURL(url)) {
            elementos.status.html('<span style="color:#ff6b6b">URL inválida. Use links que terminem com .png, .jpg, .jpeg, .gif ou .webp</span>');
            return false;
        }

        mostrarCarregamento(true);
        elementos.status.text('Carregando imagem...');

        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = function() {
            config.urlImagem = url;
            elementos.guia.attr('src', url).show();
            elementos.status.text('Imagem carregada com sucesso!');
            mostrarCarregamento(false);
            atualizarTamanho();
            atualizarPosicao();
            salvarConfiguracao();
        };

        img.onerror = function() {
            elementos.status.html(`
                <span style="color:#ff6b6b">Falha ao carregar imagem</span>
                <div style="font-size:12px;color:#aaa;margin-top:5px;">
                    Dica: Use links diretos de serviços como Imgur (ex: https://i.imgur.com/abc123.png)
                </div>
            `);
            mostrarCarregamento(false);
        };

        img.src = url;
        return true;
    }

    /**
     * Valida a URL da imagem
     * @param {string} url - URL a ser validada
     * @returns {boolean} Retorna true se a URL é válida
     */
    function validarURL(url) {
        return /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(url);
    }

    /**
     * Mostra/oculta o indicador de carregamento
     * @param {boolean} mostrar - Se true, mostra o indicador
     */
    function mostrarCarregamento(mostrar) {
        elementos.carregarBtn.toggleClass('carregando', mostrar)
            .html(mostrar ? '<span class="loader"></span> Carregando...' : 'Carregar Imagem');
    }

    /**
     * Atualiza o tamanho da imagem guia
     */
    function atualizarTamanho() {
        elementos.guia.css({
            'width': `${config.tamanho}%`,
            'height': 'auto'
        });
        elementos.tamanhoValor.text(`${config.tamanho}%`);
        elementos.tamanhoSlider.val(config.tamanho);
        salvarConfiguracao();
    }

    /**
     * Atualiza a posição da imagem guia
     */
    function atualizarPosicao() {
        const canvas = document.querySelector('canvas');
        if (!canvas || !config.urlImagem) return;

        const rect = canvas.getBoundingClientRect();
        elementos.guia.css({
            left: `${rect.left + config.deslocamento.x}px`,
            top: `${rect.top + config.deslocamento.y}px`
        });
    }

    /**
     * Alterna entre minimizar e maximizar a janela
     */
    function toggleMinimizar() {
        config.janelaMinimizada = !config.janelaMinimizada;
        elementos.minimizarBtn.text(config.janelaMinimizada ? '⬛' : '➖');
        elementos.controles.toggleClass('minimizado', config.janelaMinimizada);

        ajustarPosicaoJanela(elementos.controles[0]);
        salvarConfiguracao();
    }

    /**
     * Salva a configuração atual
     */
    function salvarConfiguracao() {
        GM_setValue('wplaceConfig', config);
    }

    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        // Carregar imagem
        elementos.carregarBtn.on('click', () => {
            const url = elementos.urlInput.val().trim();
            if (url) carregarImagem(url);
        });

        // Controle de opacidade
        elementos.opacidade.on('input', () => {
            config.opacidade = parseFloat(elementos.opacidade.val());
            elementos.guia.css('opacity', config.opacidade);
            elementos.opacidade.prev('label').text(`Opacidade: ${config.opacidade.toFixed(1)}`);
            salvarConfiguracao();
        });

        // Controles de tamanho
        elementos.diminuirBtn.on('click', () => {
            config.tamanho = Math.max(config.tamanho - DIMENSOES.TAMANHO.STEP, DIMENSOES.TAMANHO.MIN);
            atualizarTamanho();
        });

        elementos.aumentarBtn.on('click', () => {
            config.tamanho = Math.min(config.tamanho + DIMENSOES.TAMANHO.STEP, DIMENSOES.TAMANHO.MAX);
            atualizarTamanho();
        });

        elementos.tamanhoSlider.on('input', () => {
            config.tamanho = parseInt(elementos.tamanhoSlider.val());
            atualizarTamanho();
        });

        // Botão de minimizar/maximizar
        elementos.minimizarBtn.on('click', toggleMinimizar);

        // Atalhos de teclado
        $(document).on('keydown', (e) => {
            const passo = e.shiftKey ? DIMENSOES.TAMANHO.STEP * 2 : DIMENSOES.TAMANHO.STEP;
            let atualizar = false;

            // Movimento (Ctrl + setas)
            if (e.ctrlKey && !e.altKey && !e.metaKey) {
                if (e.key === 'ArrowUp') {
                    config.deslocamento.y -= passo;
                    atualizar = true;
                } else if (e.key === 'ArrowDown') {
                    config.deslocamento.y += passo;
                    atualizar = true;
                } else if (e.key === 'ArrowLeft') {
                    config.deslocamento.x -= passo;
                    atualizar = true;
                } else if (e.key === 'ArrowRight') {
                    config.deslocamento.x += passo;
                    atualizar = true;
                }
            }
            // Tamanho (Alt + setas)
            else if (e.altKey && !e.ctrlKey && !e.metaKey) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                    config.tamanho = Math.min(config.tamanho + passo, DIMENSOES.TAMANHO.MAX);
                    atualizar = true;
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                    config.tamanho = Math.max(config.tamanho - passo, DIMENSOES.TAMANHO.MIN);
                    atualizar = true;
                }
            }
            // Opacidade (Ctrl + Alt + setas para cima/baixo)
            else if ((e.ctrlKey && e.altKey) || (e.metaKey && e.altKey)) {
                if (e.key === 'ArrowUp') {
                    config.opacidade = Math.min(config.opacidade + DIMENSOES.OPACIDADE.STEP, DIMENSOES.OPACIDADE.MAX);
                    atualizar = true;
                } else if (e.key === 'ArrowDown') {
                    config.opacidade = Math.max(config.opacidade - DIMENSOES.OPACIDADE.STEP, DIMENSOES.OPACIDADE.MIN);
                    atualizar = true;
                }
            }

            if (atualizar) {
                if (e.altKey && !e.ctrlKey) {
                    atualizarTamanho();
                } else if ((e.ctrlKey && e.altKey) || (e.metaKey && e.altKey)) {
                    elementos.guia.css('opacity', config.opacidade);
                    elementos.opacidade.val(config.opacidade);
                    elementos.opacidade.prev('label').text(`Opacidade: ${config.opacidade.toFixed(1)}`);
                } else {
                    atualizarPosicao();
                }
                salvarConfiguracao();
                e.preventDefault();
            }
        });

        // Redimensionamento da janela
        const debouncedResize = debounce(() => {
            ajustarPosicaoJanela(elementos.controles[0]);
            atualizarPosicao();
        }, 100);

        $(window).on('resize', debouncedResize);
    }

    /**
     * Debounce para eventos frequentes
     * @param {Function} fn - Função a ser executada
     * @param {number} delay - Tempo de espera em ms
     * @returns {Function} Função debounced
     */
    function debounce(fn, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    // =============================================
    // INICIALIZAÇÃO
    // =============================================
    function init() {
        // Carrega configurações salvas
        const savedConfig = GM_getValue('wplaceConfig');
        if (savedConfig) Object.assign(config, savedConfig);

        // Cria a interface
        criarInterface();

        // Configura a posição inicial
        ajustarPosicaoJanela(elementos.controles[0]);

        // Torna a janela arrastável
        makeDraggable(elementos.controles[0]);

        // Configura os event listeners
        setupEventListeners();

        // Carrega a imagem se já existir uma URL configurada
        if (config.urlImagem) carregarImagem(config.urlImagem);
    }

    // Inicia o script quando o DOM estiver pronto
    $(document).ready(init);
})();