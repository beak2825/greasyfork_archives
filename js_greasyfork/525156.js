// ==UserScript==
// @name         DealerBarraDeTarefas
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Inclui uma barra de tarefas no DealerNet com as janelas que estão abertas, te permitindo alternar entre elas simplesmente clicando no botão correspondente, sem ter que minimizar nada.
// @author       Igor Lima
// @match        http*://*.dealernetworkflow.com.br/Portal/default.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.6/Sortable.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525156/DealerBarraDeTarefas.user.js
// @updateURL https://update.greasyfork.org/scripts/525156/DealerBarraDeTarefas.meta.js
// ==/UserScript==

/*
    Este código foi gerado por um modelo de IA. Embora tenha sido projetado para ser funcional,
    pode ser necessário realizar uma revisão, testes ou modificações para atender às suas necessidades específicas.
    Verifique o código quanto à correção e adequação antes de utilizá-lo em ambientes de produção.
*/

/* eslint-disable no-multi-spaces */

(function() {
    'use strict';

    // Configurações principais
    const ALTURA_BARRA = 32;  // Altura da barra de tarefas em pixels

    // Gerenciamento de estado
    const registroJanelas = new Map();      // Armazena informações de todas as janelas ativas
    const janelasMinimizadas = new Map();   // Armazena posições das janelas minimizadas

    const TEMAS = {
        /*Variações de cores de acordo com o tema que a concessionária usa*/
        /*Tema azul*/
        'xtheme-blue.css': {
            nome: 'azul',
            corPadrao: '#E1E9F2',
            corTexto: '#15428B',
            corAtivo: '#7DA2CE',
            corTextoAtivo: '#FFFFFF'
        },
        /*Tema cinza*/
        'xtheme-gray.css': {
            nome: 'cinza',
            corPadrao: '#F0F0F0',
            corTexto: '#333333',
            corAtivo: '#707070',
            corTextoAtivo: '#FFFFFF'
        },
        /*Tema verde*/
        'xtheme-green.css': {
            nome: 'verde',
            corPadrao: '#E4F3E1',
            corTexto: '#275C1E',
            corAtivo: '#7AB269',
            corTextoAtivo: '#FFFFFF'
        },
        /*Tema laranja*/
        'xtheme-orange.css': {
            nome: 'laranja',
            corPadrao: '#FFF1E8',
            corTexto: '#873202',
            corAtivo: '#F1A161',
            corTextoAtivo: '#FFFFFF'
        },
        /*Tema Roxo*/
        'xtheme-purple.css': {
            nome: 'roxo',
            corPadrao: '#F0E8F4',
            corTexto: '#4A1B6B',
            corAtivo: '#9B6DB6',
            corTextoAtivo: '#FFFFFF'
        },
        /*Tema Volks*/
        'xtheme-volks.css': {
            nome: 'volks',
            corPadrao: '#E8EEF7',
            corTexto: '#00195C',
            corAtivo: '#001E85',
            corTextoAtivo: '#FFFFFF'
        }
    };

    // Função para detectar o tema atual
    function detectarTemaAtual() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const link of links) {
            const href = link.href;
            for (const tema in TEMAS) {
                if (href.includes(tema)) {
                    return TEMAS[tema];
                }
            }
        }
        return TEMAS['xtheme-blue.css']; // Tema padrão caso nenhum seja detectado
    }

    // Função para gerar os estilos baseados no tema
    function gerarEstilosTema(tema) {
        return `
            /* Barra de tarefas */
            #barraDeTarefas {
                display: flex;
                flex-wrap: nowrap;
                gap: 5px;
                width: calc(100vw - 4px);
                overflow-x: auto;
                white-space: nowrap;
                padding: 5px 0px 0px 0px;
                margin: 0;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                font: normal 11px arial,tahoma,verdana,helvetica;
            }

            /* Personalização da barra de rolagem */
            #barraDeTarefas::-webkit-scrollbar {
                height: 1px;
            }
            #barraDeTarefas::-webkit-scrollbar-track {
                border-radius: 4px;
            }
            #barraDeTarefas::-webkit-scrollbar-thumb {
                background-color: ${tema.corAtivo};
                border-radius: 4px;
            }

            /* Botões da barra de tarefas */
            #barraDeTarefas button {
                height: ${ALTURA_BARRA - 5}px;
                flex-shrink: 0;
                padding: 5px 5px;
                margin: 0;
                border: 1px solid ${tema.corAtivo};
                border-radius: 0px;
                background: ${tema.corPadrao};
                color: ${tema.corTexto};
                cursor: pointer;
                font-size: 12px;
                white-space: nowrap;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: background-color 0.2s, color 0.2s, opacity 0.2s;
            }

            #barraDeTarefas button.ativo {
                background-color: ${tema.corAtivo};
                color: ${tema.corTextoAtivo};
            }

            /* Estado minimizado */
            .botaoMinimizado {
                opacity: 0.5;
            }

            /* Menu de contexto */
            #janelaContexto {
                position: fixed;
                background: rgba(255,255,255,0.5);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                border: 1px solid ${tema.corAtivo};
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 999999;
                padding: 5px 0;
                display: none;
                font: normal 11px arial,tahoma,verdana,helvetica;
            }

            #janelaContexto .janelaContextoTitulo {
                color: ${tema.corTexto};
                font-size: 10px;
                padding: 5px 15px;
                border-bottom: 1px solid ${tema.corPadrao};
            }

            #janelaContexto div:not(.janelaContextoTitulo) {
                padding: 5px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
                color: ${tema.corTexto};
            }

            #janelaContexto div:not(.janelaContextoTitulo):hover {
                background-color: ${tema.corPadrao};
            }

            /* Estilos do SortableJS */
            .sortable-drag {
                opacity: 1.0;
            }
            .sortable-ghost {
                opacity: 0.5;
            }
            .sortable-chosen {
                opacity: 0.5;
            }

            #barraDeTarefas.has-scrollbar {
                padding-top: 1px;
            }
        `;
    }

    // Criação do menu de contexto
    function criarMenuContexto() {
        const menu = document.createElement('div');
        menu.id = 'janelaContexto';
        menu.innerHTML = `
        <div class="janelaContextoTitulo"></div>
        <div data-action="minimize">Minimizar</div>
        <div data-action="duplicate">Duplicar</div>
        <div data-action="close">Fechar</div>
    `;
        document.body.appendChild(menu);
        return menu;
    }

    function criarOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'contextMenuOverlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
        display: none;
    `;

        overlay.addEventListener('click', () => {
            const menu = document.getElementById('janelaContexto');
            if (menu) {
                menu.style.display = 'none';
            }
            overlay.style.display = 'none';
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    // Exibe o menu de contexto na posição correta
    function exibirMenuContexto(evento, idJanela) {
        evento.preventDefault();
        evento.stopPropagation();  // Prevent event from bubbling

        const menu = document.getElementById('janelaContexto');
        const overlay = document.getElementById('contextMenuOverlay') || criarOverlay();
        const tituloElemento = menu.querySelector('.janelaContextoTitulo');

        // Define o título da janela no menu
        const infoJanela = registroJanelas.get(idJanela);
        tituloElemento.textContent = infoJanela ? infoJanela.title : 'Janela Desconhecida';

        // Torna o menu visível temporariamente para obter suas dimensões
        menu.style.visibility = 'hidden';
        menu.style.display = 'block';
        overlay.style.display = 'block';  // Show overlay

        // Rest of the existing positioning logic remains the same...
        const larguraMenu = menu.offsetWidth;
        const alturaMenu = menu.offsetHeight;
        const larguraTela = window.innerWidth;
        const alturaTela = window.innerHeight;

        // Posição horizontal - centraliza o menu em relação ao clique
        let esquerda = evento.pageX - (larguraMenu / 2);

        // Ajusta se estiver fora dos limites horizontais
        if (esquerda < 0) {
            esquerda = 0;
        } else if (esquerda + larguraMenu > larguraTela) {
            esquerda = larguraTela - larguraMenu;
        }

        // Posição vertical - posiciona o menu acima do cursor
        let topo = evento.pageY - alturaMenu;

        // Se não houver espaço suficiente acima, posiciona abaixo do cursor
        if (topo < 0) {
            topo = evento.pageY;
        }

        menu.style.left = `${esquerda}px`;
        menu.style.top = `${topo}px`;
        menu.dataset.windowId = idJanela;

        // Torna o menu visível
        menu.style.visibility = 'visible';
    }

    // Gerencia as ações do menu de contexto
    function configurarAcoesMenuContexto(menu) {
        menu.addEventListener('click', (e) => {
            const acao = e.target.dataset.action;
            const idJanela = menu.dataset.windowId;
            const overlay = document.getElementById('contextMenuOverlay');

            if (!idJanela) return;

            const infoJanela = registroJanelas.get(idJanela);
            if (!infoJanela) return;

            menu.style.display = 'none';
            if (overlay) overlay.style.display = 'none';

            switch(acao) {
                case 'minimize':
                    minimizarJanela(idJanela);
                    break;
                case 'duplicate':
                    duplicarJanela(idJanela);
                    break;
                case 'close':
                    fecharJanela(idJanela);
                    break;
            }
        });
    }

    // Função para duplicar janela
    function duplicarJanela(idJanela) {
        const infoJanela = registroJanelas.get(idJanela);
        if (!infoJanela) return;

        const janelaOriginal = infoJanela.element;
        const novaJanela = janelaOriginal.cloneNode(true);

        // Gera novo ID para a janela duplicada
        const novoId = `${idJanela}D`;
        novaJanela.id = novoId;

        // Mantém a mesma posição da janela original
        novaJanela.style.top = janelaOriginal.style.top;
        novaJanela.style.left = janelaOriginal.style.left;

        // Adiciona "(Cópia)" ao título
        const tituloElemento = novaJanela.querySelector('.x-window-header-text');
        if (tituloElemento) {
            tituloElemento.textContent = `${tituloElemento.textContent} (Cópia)`;
        }

        // Remove todos os event listeners existentes dos botões
        novaJanela.querySelectorAll('.x-tool').forEach(tool => {
            const clone = tool.cloneNode(true);
            tool.parentNode.replaceChild(clone, tool);

            //Recria o botão de fechar
            if (clone.classList.contains('x-tool-close')) {
                clone.addEventListener('click', () => {
                    novaJanela.remove();
                    registroJanelas.delete(novoId);
                    const botao = document.querySelector(`[data-window-id="${novoId}"]`);
                    if (botao) botao.remove();
                });
            }

            // Remove o botão de minimizar original para substituir pelo nosso
            if (clone.classList.contains('x-tool-minimize')) {
                const novoMinimizar = clone.cloneNode(true);
                clone.parentNode.replaceChild(novoMinimizar, clone);

                // Adiciona eventos de hover
                novoMinimizar.addEventListener('mouseenter', () => {
                    novoMinimizar.classList.add('x-tool-minimize-over');
                });

                novoMinimizar.addEventListener('mouseleave', () => {
                    novoMinimizar.classList.remove('x-tool-minimize-over');
                });

                // Adiciona comportamento de minimizar
                novoMinimizar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    minimizarJanela(novoId);
                });
            }
        });

        // Encontra o container pai correto (onde as janelas são normalmente criadas)
        const containerPai = janelaOriginal.parentElement;
        if (!containerPai) {
            console.error('Container pai não encontrado para a janela:', idJanela);
            return;
        }

        // Adiciona a nova janela ao container pai correto
        containerPai.appendChild(novaJanela);

        // Define o z-index como o maior + 10 para a janela aparecer no topo
        const maiorZ = obterMaiorZIndex();
        novaJanela.style.zIndex = maiorZ + 10;

        // Atualiza o registro de janelas
        registroJanelas.set(novoId, {
            element: novaJanela,
            zIndex: maiorZ + 1,
            title: tituloElemento ? tituloElemento.textContent : 'Sem título'
        });

        // Força o processamento da nova janela para criar o botão na barra de tarefas
        const containerBotoes = document.getElementById('barraDeTarefas');
        if (containerBotoes) {
            processarJanela(novaJanela, containerBotoes);
        }

        // Torna a janela arrastável
        novaJanela.querySelector('.x-window-header').addEventListener('mousedown', function(e) {
            if (e.target.closest('.x-tool')) return;
            if (novaJanela.classList.contains('x-window-maximized')) return;

            const pos = {
                left: parseInt(novaJanela.style.left),
                top: parseInt(novaJanela.style.top),
                x: e.clientX,
                y: e.clientY
            };

            function onMouseMove(e) {
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                novaJanela.style.left = `${pos.left + dx}px`;
                novaJanela.style.top = `${pos.top + dy}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        substituirBotoesMaximizarRestaurar(novaJanela);
        adicionarRedimensionamento(novaJanela);
        adicionarLimitesArrasto(novaJanela);

        // Adiciona a função de 2 cliques na barra de título pra restaurar/maximizar
        const header = novaJanela.querySelector('.x-window-header');
        if (header) {
            header.addEventListener('dblclick', function(e) {
                // Caso o clique duplo for num botão de fechar/minimizar/etc
                if (e.target.closest('.x-tool')) return;

                const estaMaximizada = novaJanela.classList.contains('x-window-maximized');
                const botaoMax = novaJanela.querySelector('.x-tool-maximize');
                const botaoRestore = novaJanela.querySelector('.x-tool-restore');

                // Trigger the appropriate button click
                if (estaMaximizada && botaoRestore) {
                    botaoRestore.click();
                } else if (!estaMaximizada && botaoMax) {
                    botaoMax.click();
                }
            });
        }

        // Atualiza o estado dos botões para refletir a nova janela ativa
        atualizarEstadoBotoes(containerBotoes);

        return novaJanela;
    }

    // Inicializa o menu de contexto
    const menuContexto = criarMenuContexto();
    configurarAcoesMenuContexto(menuContexto);

    // Funções auxiliares do menu de contexto
    function fecharJanela(idJanela) {
        const infoJanela = registroJanelas.get(idJanela);
        if (infoJanela) {
            const botaoFechar = infoJanela.element.querySelector('.x-tool-close');
            if (botaoFechar) {
                botaoFechar.click();
            }
        } else {
            console.error(`Window not found: ${idJanela}`);
        }
    }


    // Funções de gerenciamento de janelas
    function minimizarJanela(idJanela) {
        const infoJanela = registroJanelas.get(idJanela);
        if (!infoJanela) return;

        const elemento = infoJanela.element;
        salvarPosicaoJanela(idJanela);

        // Guarda posição original se não estiver maximizada
        if (!elemento.classList.contains('x-window-maximized')) {
            janelasMinimizadas.set(idJanela, {
                top: elemento.style.top,
                left: elemento.style.left
            });
        }

        // Esconde a janela
        elemento.style.visibility = 'hidden';
        elemento.style.top = '-10000px';
        elemento.style.left = '-10000px';
        elemento.style.zIndex = '0';

        // Atualiza aparência do botão
        const botao = document.querySelector(`[data-window-id="${idJanela}"]`);
        if (botao) {
            botao.classList.add('botaoMinimizado');
        }
    }

    function restaurarJanela(idJanela) {
        const infoJanela = registroJanelas.get(idJanela);
        if (!infoJanela) return;

        const elemento = infoJanela.element;
        const posicaoSalva = janelasMinimizadas.get(idJanela);

        elemento.style.visibility = 'visible';

        // Define o z-index como o maior + 10 ao restaurar
        const maiorZ = obterMaiorZIndex();
        elemento.style.zIndex = maiorZ + 10;
        infoJanela.zIndex = maiorZ + 10;

        if (!elemento.classList.contains('x-window-maximized') && posicaoSalva) {
            elemento.style.top = posicaoSalva.top;
            elemento.style.left = posicaoSalva.left;
            janelasMinimizadas.delete(idJanela);
        } else {
            elemento.style.top = '0';
            elemento.style.left = '0';
        }

        const botao = document.querySelector(`[data-window-id="${idJanela}"]`);
        if (botao) {
            botao.classList.remove('botaoMinimizado');
        }

        // Atualiza o estado dos botões para refletir a nova janela ativa
        atualizarEstadoBotoes(document.getElementById('barraDeTarefas'));
    }

    function minimizarTodas() {
        registroJanelas.forEach((info, idJanela) => {
            minimizarJanela(idJanela);
        });
    }

    function salvarPosicaoJanela(idJanela) {
        const infoJanela = registroJanelas.get(idJanela);
        if (infoJanela && !infoJanela.element.classList.contains('x-window-maximized')) {
            janelasMinimizadas.set(idJanela, {
                top: infoJanela.element.style.top,
                left: infoJanela.element.style.left
            });
        }
    }

    function obterJanelaAtiva() {
        let janelaAtiva = null;
        let maiorZ = -1;

        registroJanelas.forEach((info, id) => {
            const zIndex = parseInt(info.zIndex) || 0;
            if (zIndex > maiorZ) {
                maiorZ = zIndex;
                janelaAtiva = id;
            }
        });

        return janelaAtiva;
    }

    function obterMaiorZIndex() {
        let maior = 0;
        registroJanelas.forEach((info) => {
            const zIndex = parseInt(info.zIndex) || 0;
            if (zIndex > maior) maior = zIndex;
        });
        return maior;
    }

    // Ajustes de altura dos elementos
    function ajustarAlturaCorpoJanelas(reduzir = true) {
        const ajuste = reduzir ? -ALTURA_BARRA + 4 : ALTURA_BARRA - 4;
        document.querySelectorAll('[id^="W5Window_"]:not([id$="-rzproxy"]) .x-window-body').forEach(corpo => {
            const alturaAtual = parseInt(window.getComputedStyle(corpo).height);
            corpo.style.height = `${alturaAtual + ajuste}px`;
        });
    }

    function ajustarAlturaPai(reduzir = true) {
        const elementoPai = document.querySelector('.x-panel-bwrap');
        if (!elementoPai) return;

        const elemento = elementoPai.querySelector('.x-panel-body.x-panel-body-noheader');
        if (!elemento) return;

        const alturaAtual = parseInt(elemento.style.height, 10);
        if (reduzir) {
            elemento.style.height = `${alturaAtual - ALTURA_BARRA + 4}px`;
            ajustarAlturaCorpoJanelas(true);
        } else {
            elemento.style.height = `${alturaAtual + ALTURA_BARRA - 4}px`;
            ajustarAlturaCorpoJanelas(false);
        }
    }

    // Funções de registro e controle de janelas
    function processarJanela(elemento, containerBotoes) {
        const idJanela = elemento.id;

        // Ignora janelas que não devem ser processadas
        if (idJanela.includes('-rzproxy')) return;
        // Modificado para aceitar IDs com sufixo D
        if (!idJanela.match(/^W5Window_\d+D*$/)) return;

        const zIndex = window.getComputedStyle(elemento).zIndex;
        const elementoTitulo = elemento.querySelector('.x-window-header-text');
        const titulo = elementoTitulo ? elementoTitulo.textContent : 'Sem título';

        registroJanelas.set(idJanela, {
            element: elemento,
            zIndex: zIndex,
            title: titulo
        });

        // Substitui o botão de minimizar original
        substituirBotaoMinimizar(elemento, idJanela);
        criarOuAtualizarBotao(idJanela, titulo, elemento, containerBotoes);
    }

    function criarOuAtualizarBotao(idJanela, titulo, elemento, containerBotoes) {
        let botao = containerBotoes.querySelector(`[data-window-id="${idJanela}"]`);

        if (!botao) {
            botao = document.createElement('button');
            botao.setAttribute('data-window-id', idJanela);
            containerBotoes.appendChild(botao);

            // Evento de clique principal
            botao.addEventListener('click', () => {
                if (botao.classList.contains('botaoMinimizado')) {
                    restaurarJanela(idJanela);
                } else {
                    const maiorZ = obterMaiorZIndex();
                    elemento.style.zIndex = maiorZ + 10;
                    registroJanelas.get(idJanela).zIndex = maiorZ + 10;
                    atualizarEstadoBotoes(containerBotoes);
                }
            });

            // Evento de clique do botão do meio (fechar)
            botao.addEventListener('mouseup', (e) => {
                if (e.button === 1) {
                    e.preventDefault();
                    fecharJanela(idJanela);
                }
            });

            // Menu de contexto no clique direito
            botao.addEventListener('contextmenu', (e) => {
                exibirMenuContexto(e, idJanela);
            });
        }

        botao.textContent = titulo;
        atualizarEstadoBotoes(containerBotoes);
    }

    function atualizarEstadoBotoes(containerBotoes) {
        const janelaAtiva = obterJanelaAtiva();
        containerBotoes.querySelectorAll('button').forEach(botao => {
            const estaAtiva = botao.getAttribute('data-window-id') === janelaAtiva;
            botao.classList.toggle('ativo', estaAtiva);
        });
    }

    // Para janelas clonadas, já que os botões delas não funcionam
    function substituirBotoesMaximizarRestaurar(janela) {
        const botaoMaximizar = janela.querySelector('.x-tool-maximize');
        const botaoRestaurar = janela.querySelector('.x-tool-restore');
        const botaoFechar = janela.querySelector('.x-tool-close');
        const botaoRefresh = janela.querySelector('.x-tool-W5Portal_Icon_RefreshWindow');
        const botaoImprimir = janela.querySelector('.x-tool-W5Portal_Icon_Print');
        const botaoAutoAjuste = janela.querySelector('.x-tool-W5Portal_Icon_AutoAdjust');
        const botaoBookmark = janela.querySelector('.x-tool-W5Portal_SetAsBookmark');

        // Oculta botões não utilizados
        if (botaoAutoAjuste) botaoAutoAjuste.style.display = 'none';
        if (botaoBookmark) botaoBookmark.style.display = 'none';

        if (botaoFechar) {
            botaoFechar.addEventListener('mouseenter', () => {
                botaoFechar.classList.add('x-tool-close-over');
            });

            botaoFechar.addEventListener('mouseleave', () => {
                botaoFechar.classList.remove('x-tool-close-over');
            });
        }

        // Substitui o botão de refresh
        if (botaoRefresh) {
            const cloneRefresh = botaoRefresh.cloneNode(true);
            botaoRefresh.parentNode.replaceChild(cloneRefresh, botaoRefresh);

            cloneRefresh.addEventListener('mouseenter', () => {
                cloneRefresh.classList.add('x-tool-W5Portal_Icon_RefreshWindow-over');
            });

            cloneRefresh.addEventListener('mouseleave', () => {
                cloneRefresh.classList.remove('x-tool-W5Portal_Icon_RefreshWindow-over');
            });

            cloneRefresh.addEventListener('click', () => {
                const iframe = janela.querySelector('.W5Portal_Window_Frame');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            });
        }

        // Substitui o botão de impressão
        if (botaoImprimir) {
            const cloneImprimir = botaoImprimir.cloneNode(true);
            botaoImprimir.parentNode.replaceChild(cloneImprimir, botaoImprimir);

            cloneImprimir.addEventListener('mouseenter', () => {
                cloneImprimir.classList.add('x-tool-W5Portal_Icon_Print-over');
            });

            cloneImprimir.addEventListener('mouseleave', () => {
                cloneImprimir.classList.remove('x-tool-W5Portal_Icon_Print-over');
            });

            cloneImprimir.addEventListener('click', () => {
                const iframe = janela.querySelector('.W5Portal_Window_Frame');
                if (iframe) {
                    iframe.contentWindow.print();
                }
            });
        }

        if (botaoMaximizar) {
            const cloneMax = botaoMaximizar.cloneNode(true);
            botaoMaximizar.parentNode.replaceChild(cloneMax, botaoMaximizar);

            cloneMax.addEventListener('click', () => {
                // Salva dimensões atuais antes de maximizar
                const corpoJanela = janela.querySelector('.x-window-body');
                janela.dataset.savedWidth = janela.style.width;
                janela.dataset.savedHeight = corpoJanela.style.height;
                janela.dataset.savedTop = janela.style.top;
                janela.dataset.savedLeft = janela.style.left;

                // Maximiza
                janela.classList.add('x-window-maximized');
                janela.style.width = `${window.innerWidth}px`;
                janela.style.top = '0px';
                janela.style.left = '0px';
                corpoJanela.style.width = `${window.innerWidth}px`;
                // Ajusta altura considerando a barra de tarefas e o cabeçalho
                corpoJanela.style.height = `${window.innerHeight - 100 - 21}px`;

                cloneMax.style.display = 'none';
                const currentRestore = janela.querySelector('.x-tool-restore');
                if (currentRestore) currentRestore.style.display = '';
            });

            cloneMax.addEventListener('mouseenter', () => {
                cloneMax.classList.add('x-tool-maximize-over');
            });

            cloneMax.addEventListener('mouseleave', () => {
                cloneMax.classList.remove('x-tool-maximize-over');
            });
        }

        if (botaoRestaurar) {
            const cloneRestore = botaoRestaurar.cloneNode(true);
            botaoRestaurar.parentNode.replaceChild(cloneRestore, botaoRestaurar);

            cloneRestore.addEventListener('click', () => {
                janela.classList.remove('x-window-maximized');
                const corpoJanela = janela.querySelector('.x-window-body');

                // Restaura dimensões salvas ou usa padrões
                janela.style.width = janela.dataset.savedWidth || '900px';
                janela.style.top = janela.dataset.savedTop || '0px';
                janela.style.left = janela.dataset.savedLeft || '0px';

                corpoJanela.style.width = `${parseInt(janela.style.width) - 2}px`;
                corpoJanela.style.height = janela.dataset.savedHeight || '374px';

                // Alterna botões
                cloneRestore.style.display = 'none';
                const currentMax = janela.querySelector('.x-tool-maximize');
                if (currentMax) currentMax.style.display = '';
            });

            cloneRestore.addEventListener('mouseenter', () => {
                cloneRestore.classList.add('x-tool-restore-over');
            });

            cloneRestore.addEventListener('mouseleave', () => {
                cloneRestore.classList.remove('x-tool-restore-over');
            });
        }
    }

    function adicionarRedimensionamento(janela) {
        const alças = janela.querySelectorAll('.x-resizable-handle');
        let posInicial = {};
        let dimensoesIniciais = {};
        const TAMANHO_ALCA = 8; // Aumenta a área de clique para 8px

        GM_addStyle(`
            .x-resizable-handle {
                position: absolute;
                background: transparent;
                z-index: 10000;
            }
            .x-resizable-handle-east { width: ${TAMANHO_ALCA}px !important; right: -${TAMANHO_ALCA/2}px !important; }
            .x-resizable-handle-west { width: ${TAMANHO_ALCA}px !important; left: -${TAMANHO_ALCA/2}px !important; }
            .x-resizable-handle-north { height: ${TAMANHO_ALCA}px !important; top: -${TAMANHO_ALCA/2}px !important; }
            .x-resizable-handle-south { height: ${TAMANHO_ALCA}px !important; bottom: -${TAMANHO_ALCA/2}px !important; }
            .x-resizable-handle-southeast,
            .x-resizable-handle-southwest,
            .x-resizable-handle-northeast,
            .x-resizable-handle-northwest {
                width: ${TAMANHO_ALCA}px !important;
                height: ${TAMANHO_ALCA}px !important;
            }
        `);

        alças.forEach(alça => {
            alça.addEventListener('mousedown', function(e) {
                e.preventDefault();
                if (janela.classList.contains('x-window-maximized')) return;

                const direção = alça.className.match(/x-resizable-handle-(\w+)/)[1];

                posInicial = {
                    x: e.clientX,
                    y: e.clientY
                };

                dimensoesIniciais = {
                    width: parseInt(janela.style.width),
                    height: parseInt(janela.querySelector('.x-window-body').style.height),
                    left: parseInt(janela.style.left),
                    top: parseInt(janela.style.top)
                };

                function onMouseMove(e) {
                    const dx = e.clientX - posInicial.x;
                    const dy = e.clientY - posInicial.y;

                    const corpoJanela = janela.querySelector('.x-window-body');

                    switch(direção) {
                        case 'east':
                            janela.style.width = `${dimensoesIniciais.width + dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width + dx - 2}px`;
                            break;
                        case 'west':
                            janela.style.left = `${dimensoesIniciais.left + dx}px`;
                            janela.style.width = `${dimensoesIniciais.width - dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width - dx - 2}px`;
                            break;
                        case 'north':
                            janela.style.top = `${dimensoesIniciais.top + dy}px`;
                            corpoJanela.style.height = `${dimensoesIniciais.height - dy}px`;
                            break;
                        case 'south':
                            corpoJanela.style.height = `${dimensoesIniciais.height + dy}px`;
                            break;
                        case 'northeast':
                            janela.style.width = `${dimensoesIniciais.width + dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width + dx - 2}px`;
                            janela.style.top = `${dimensoesIniciais.top + dy}px`;
                            corpoJanela.style.height = `${dimensoesIniciais.height - dy}px`;
                            break;
                        case 'northwest':
                            janela.style.left = `${dimensoesIniciais.left + dx}px`;
                            janela.style.width = `${dimensoesIniciais.width - dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width - dx - 2}px`;
                            janela.style.top = `${dimensoesIniciais.top + dy}px`;
                            corpoJanela.style.height = `${dimensoesIniciais.height - dy}px`;
                            break;
                        case 'southeast':
                            janela.style.width = `${dimensoesIniciais.width + dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width + dx - 2}px`;
                            corpoJanela.style.height = `${dimensoesIniciais.height + dy}px`;
                            break;
                        case 'southwest':
                            janela.style.left = `${dimensoesIniciais.left + dx}px`;
                            janela.style.width = `${dimensoesIniciais.width - dx}px`;
                            corpoJanela.style.width = `${dimensoesIniciais.width - dx - 2}px`;
                            corpoJanela.style.height = `${dimensoesIniciais.height + dy}px`;
                            break;
                    }
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
    }

    function adicionarLimitesArrasto(janela) {
        const header = janela.querySelector('.x-window-header');
        const containerPai = janela.parentElement;

        header.addEventListener('mousedown', function(e) {
            if (e.target.closest('.x-tool')) return;
            if (janela.classList.contains('x-window-maximized')) return;

            const limitePai = containerPai.getBoundingClientRect();
            const limiteJanela = janela.getBoundingClientRect();

            const pos = {
                left: parseInt(janela.style.left),
                top: parseInt(janela.style.top),
                x: e.clientX,
                y: e.clientY
            };

            function onMouseMove(e) {
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                // Calcula nova posição
                let novoLeft = pos.left + dx;
                let novoTop = pos.top + dy;

                // Limita horizontalmente
                if (novoLeft < 0) novoLeft = 0;
                if (novoLeft + limiteJanela.width > limitePai.width) {
                    novoLeft = limitePai.width - limiteJanela.width;
                }

                // Limita verticalmente
                if (novoTop < 0) novoTop = 0;
                if (novoTop + limiteJanela.height > limitePai.height) {
                    novoTop = limitePai.height - limiteJanela.height;
                }

                janela.style.left = `${novoLeft}px`;
                janela.style.top = `${novoTop}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function substituirBotaoMinimizar(elementoJanela, idJanela) {
        const botaoMinimizar = elementoJanela.querySelector('.x-tool-minimize');
        if (botaoMinimizar) {
            // Remove eventos do botão original
            const clone = botaoMinimizar.cloneNode(true);
            botaoMinimizar.parentNode.replaceChild(clone, botaoMinimizar);

            // Adiciona novo comportamento e eventos de hover
            clone.addEventListener('click', (e) => {
                e.stopPropagation();
                minimizarJanela(idJanela);
            });

            // Adiciona classe de hover
            clone.addEventListener('mouseenter', () => {
                clone.classList.add('x-tool-minimize-over');
            });

            clone.addEventListener('mouseleave', () => {
                clone.classList.remove('x-tool-minimize-over');
            });
        }
    }

    // Trocando o botão deles pelo nosso, devido a lógica complicada deles de minimizar
    function substituirBotaoMinimizarTodas() {
        // Procura por botões existentes
        const botoesExistentes = document.querySelectorAll('.minimizeAll');
        if (botoesExistentes.length === 0) return;

        // Pega o primeiro botão para usar como referência do posicionamento e estrutura
        const botaoOriginal = botoesExistentes[0];
        const containerPai = botaoOriginal.parentNode;

        // Remove botões extras se existirem
        botoesExistentes.forEach((btn, index) => {
            if (index > 0) btn.remove();
        });

        // Clona o botão original para manter a estrutura HTML e estilos
        const novoBotao = botaoOriginal.cloneNode(true);
        novoBotao.classList.add('custom-minimize-all');
        novoBotao.title = "Minimiza todas as janelas";

        // Adiciona eventos de hover e click
        novoBotao.addEventListener('mouseenter', () => {
            novoBotao.classList.add('x-btn-over');
        });

        novoBotao.addEventListener('mouseleave', () => {
            novoBotao.classList.remove('x-btn-over');
        });

        novoBotao.addEventListener('mousedown', () => {
            novoBotao.classList.add('x-btn-click');
        });

        novoBotao.addEventListener('mouseup', () => {
            novoBotao.classList.remove('x-btn-click');
        });

        novoBotao.addEventListener('click', (e) => {
            e.stopPropagation();
            minimizarTodas();
        });

        // Substitui o botão original pelo novo
        containerPai.replaceChild(novoBotao, botaoOriginal);

        // Magia negra pro DealerNet não substituir o botão de minimizar do script ao redimensionar o navegador
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.classList.contains('minimizeAll') &&
                            !node.classList.contains('custom-minimize-all')) {
                            // Se um novo botão for adicionado, substitui ele pelo nosso
                            const novoClone = novoBotao.cloneNode(true);
                            // Recria os event listeners no clone
                            novoClone.addEventListener('mouseenter', () => novoClone.classList.add('x-btn-over'));
                            novoClone.addEventListener('mouseleave', () => novoClone.classList.remove('x-btn-over'));
                            novoClone.addEventListener('mousedown', () => novoClone.classList.add('x-btn-click'));
                            novoClone.addEventListener('mouseup', () => novoClone.classList.remove('x-btn-click'));
                            novoClone.addEventListener('click', (e) => {
                                e.stopPropagation();
                                minimizarTodas();
                            });
                            node.parentNode.replaceChild(novoClone, node);
                        }
                    });
                }
            });
        });

        // Inicia a observação no container pai
        if (containerPai) {
            observer.observe(containerPai, {
                childList: true,
                subtree: true
            });
        }
    }

    function fecharJanelasClonadas() {
        // Procura por todas as janelas que têm ID terminando com 'D' (clones)
        const janelasClonadas = document.querySelectorAll('[id^="W5Window_"][id$="D"]');
        janelasClonadas.forEach(janela => {
            // Remove a janela
            janela.remove();
            // Remove do registro de janelas
            registroJanelas.delete(janela.id);
            // Remove o botão correspondente
            const botao = document.querySelector(`[data-window-id="${janela.id}"]`);
            if (botao) botao.remove();
        });
    }

    function configurarBotaoCloseAll() {
        // Observer específico para detectar o botão closeAll
        const observerCloseAll = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const botaoCloseAll = node.classList?.contains('closeAll') ?
                                  node :
                            node.querySelector('.closeAll');

                            if (botaoCloseAll && !botaoCloseAll.dataset.listenerAdded) {
                                botaoCloseAll.dataset.listenerAdded = 'true';

                                // Adiciona o listener de clique
                                botaoCloseAll.addEventListener('click', () => {
                                    fecharJanelasClonadas();
                                });
                            }
                        }
                    });
                }
            });
        });

        // Inicia a observação no body
        observerCloseAll.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Verifica se o botão já existe na página
        const botaoExistente = document.querySelector('.closeAll');
        if (botaoExistente && !botaoExistente.dataset.listenerAdded) {
            botaoExistente.dataset.listenerAdded = 'true';
            botaoExistente.addEventListener('click', () => {
                setTimeout(fecharJanelasClonadas, 100);
            });
        }
    }

    function verificarJanelasEAtualizarBarra(linhaBotoes, barraInferior) {
        // Considerar apenas janelas comuns, excluindo janelas de proxy
        const janelasAtivas = document.querySelectorAll('[id^="W5Window_"]:not([id$="-rzproxy"])');
        const temJanelas = janelasAtivas.length > 0;

        const barraEstaVisivel = linhaBotoes.style.display !== 'none';

        // Ajustar altura da barra quando necessário
        if (!temJanelas && barraEstaVisivel) {
            linhaBotoes.style.display = 'none';
            const alturaAtual = parseInt(barraInferior.style.height);
            const topoAtual = parseInt(barraInferior.style.top);

            barraInferior.style.height = `${alturaAtual - ALTURA_BARRA}px`;
            barraInferior.style.top = `${topoAtual + ALTURA_BARRA}px`;
            ajustarAlturaPai(false);
        } else if (temJanelas && !barraEstaVisivel) {
            linhaBotoes.style.display = '';
            const alturaAtual = parseInt(barraInferior.style.height);
            const topoAtual = parseInt(barraInferior.style.top);

            barraInferior.style.height = `${alturaAtual + ALTURA_BARRA}px`;
            barraInferior.style.top = `${topoAtual - ALTURA_BARRA}px`;
            ajustarAlturaPai(true);
        }
    }

    // Funções de inicialização e setup
    function encontrarBarraInferior() {
        const barras = document.querySelectorAll('div.x-toolbar.x-border-panel');
        return Array.from(barras).find(barra => {
            const topo = parseInt(barra.style.top);
            const outrasBarras = Array.from(barras).filter(b => b !== barra);
            return outrasBarras.every(outra => parseInt(outra.style.top) < topo);
        });
    }

    function criarLinhaBarraTarefas() {
        const tr = document.createElement('tr');
        tr.className = 'window-switcher-row';

        const td = document.createElement('td');
        td.colSpan = 2;
        td.style.cssText = 'padding: 0px;';

        const containerBotoes = document.createElement('div');
        containerBotoes.id = 'barraDeTarefas';

        td.appendChild(containerBotoes);
        tr.appendChild(td);
        return tr;
    }

    function configurarScrollBarraTarefas(containerBotoes) {
        function verificarBarraRolagem() {
            if (containerBotoes.scrollWidth > containerBotoes.clientWidth) {
                containerBotoes.classList.add('has-scrollbar');
            } else {
                containerBotoes.classList.remove('has-scrollbar');
            }
        }

        // Rolagem horizontal com roda do mouse
        containerBotoes.addEventListener('wheel', function(evento) {
            if (evento.deltaY !== 0) {
                containerBotoes.scrollLeft += evento.deltaY;
                evento.preventDefault();
            }
        });

        // Previne autoscroll do botão do meio
        containerBotoes.addEventListener('mousedown', function(evento) {
            if (evento.button === 1) {
                evento.preventDefault();
            }
        });

        return verificarBarraRolagem;
    }

    function configurarSortable(containerBotoes) {
        new Sortable(containerBotoes, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            chosenClass: "sortable-chosen",
            forceFallback: false,
            fallbackClass: "sortable-fallback",
            removeCloneOnHide: false,
            direction: 'horizontal',
            dragoverBubble: true,
        });
    }

    function configurarObservadores(containerBotoes, linhaBotoes, barraInferior, verificarBarraRolagem) {
        // Observer para adições/remoções de janelas
        const observadorEstrutura = new MutationObserver((mutacoes) => {
            let precisaAtualizar = false;

            for (const mutacao of mutacoes) {
                for (const node of mutacao.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Modificado para aceitar IDs com sufixo D
                        if (node.id && node.id.match(/^W5Window_\d+D*$/)) {
                            processarJanela(node, containerBotoes);
                            verificarJanelasEAtualizarBarra(linhaBotoes, barraInferior);
                            precisaAtualizar = true;
                        }

                        const janelas = node.querySelectorAll('[id^="W5Window_"]');
                        if (janelas.length > 0) {
                            janelas.forEach(janela => {
                                // Verifica se o ID corresponde ao padrão (incluindo clones)
                                if (janela.id.match(/^W5Window_\d+D*$/)) {
                                    processarJanela(janela, containerBotoes);
                                }
                            });
                            verificarJanelasEAtualizarBarra(linhaBotoes, barraInferior);
                            precisaAtualizar = true;
                        }

                        if (node.querySelector('.minimizeAll')) {
                            substituirBotaoMinimizarTodas();
                        }
                    }
                }

                for (const node of mutacao.removedNodes) {
                    // Modificado para aceitar IDs com sufixo D
                    if (node.nodeType === Node.ELEMENT_NODE && node.id && node.id.match(/^W5Window_\d+D*$/)) {
                        const botao = containerBotoes.querySelector(`[data-window-id="${node.id}"]`);
                        if (botao) botao.remove();
                        registroJanelas.delete(node.id);
                        verificarJanelasEAtualizarBarra(linhaBotoes, barraInferior);
                        precisaAtualizar = true;
                    }
                }
            }

            if (precisaAtualizar) {
                atualizarEstadoBotoes(containerBotoes);
                verificarBarraRolagem();
            }
        });

        // Observer para mudanças de z-index (mantido igual, mas atualizado o regex)
        const observadorEstilo = new MutationObserver((mutacoes) => {
            mutacoes.forEach((mutacao) => {
                if (mutacao.type === 'attributes' && mutacao.attributeName === 'style') {
                    const elemento = mutacao.target;
                    if (elemento.id && elemento.id.match(/^W5Window_\d+D*$/)) {
                        const zIndex = window.getComputedStyle(elemento).zIndex;
                        const infoJanela = registroJanelas.get(elemento.id);
                        if (infoJanela && infoJanela.zIndex !== zIndex) {
                            infoJanela.zIndex = zIndex;
                            atualizarEstadoBotoes(containerBotoes);
                        }
                    }
                }
            });
        });

        return { observadorEstrutura, observadorEstilo };
    }

    function inicializarEstilos() {
        const temaAtual = detectarTemaAtual();
        GM_addStyle(gerarEstilosTema(temaAtual));
    }

    function inicializarGerenciador() {
        inicializarEstilos();
        const barraInferior = encontrarBarraInferior();
        if (!barraInferior) {
            console.log('Barra inferior não encontrada, tentando novamente...');
            setTimeout(inicializarGerenciador, 500);
            return;
        }

        // Ajusta altura da barra inferior
        const alturaAtual = parseInt(barraInferior.style.height);
        const topoAtual = parseInt(barraInferior.style.top);
        barraInferior.style.height = `${alturaAtual + ALTURA_BARRA}px`;
        barraInferior.style.top = `${topoAtual - ALTURA_BARRA}px`;

        // Cria e insere a barra de tarefas
        const tabela = barraInferior.querySelector('table.x-toolbar-ct tbody');
        const linhaBotoes = criarLinhaBarraTarefas();
        tabela.insertBefore(linhaBotoes, tabela.firstChild);

        ajustarAlturaPai(true);

        const containerBotoes = linhaBotoes.querySelector('#barraDeTarefas');
        const verificarBarraRolagem = configurarScrollBarraTarefas(containerBotoes);
        configurarSortable(containerBotoes);

        const { observadorEstrutura, observadorEstilo } = configurarObservadores(
            containerBotoes,
            linhaBotoes,
            barraInferior,
            verificarBarraRolagem
        );

        // Inicia observação
        observadorEstrutura.observe(document.body, {
            childList: true,
            subtree: true
        });

        observadorEstilo.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });

        // Verificação inicial
        document.querySelectorAll('[id^="W5Window_"]').forEach(janela => {
            if (janela.id.match(/^W5Window_\d+D*$/)) {
                processarJanela(janela, containerBotoes);
            }
        });
        substituirBotaoMinimizarTodas();
        verificarJanelasEAtualizarBarra(linhaBotoes, barraInferior);

        // Adiciona listener para resize
        window.addEventListener('resize', verificarBarraRolagem);

        configurarBotaoCloseAll();
    }

    // Inicializa o sistema
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarGerenciador);
    } else {
        inicializarGerenciador();
    }
})();