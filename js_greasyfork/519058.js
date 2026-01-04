// ==UserScript==
// @name         DealerNotificaFluxo
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Notifica o usuário sobre novos fluxos no DealerNet.
// @author       Igor Lima
// @match        http*://*.dealernetworkflow.com.br/Portal/default.html
// @match        http*://*.dealernetworkflow.com.br/WP_Fluxo.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519058/DealerNotificaFluxo.user.js
// @updateURL https://update.greasyfork.org/scripts/519058/DealerNotificaFluxo.meta.js
// ==/UserScript==

/*
    Este código foi gerado por um modelo de IA. Embora tenha sido projetado para ser funcional,
    pode ser necessário realizar uma revisão, testes ou modificações para atender às suas necessidades específicas.
    Verifique o código quanto à correção e adequação antes de utilizá-lo em ambientes de produção.
*/

(function() {
    'use strict';

    // Configuração do script
    const configuracao = {
        //Fluxos a serem procurados e notificados, em formato regex, sempre seguindo o padrão: /^nomedofluxo\(\d+\)$/
        procurarFluxos: [
            /^.*\(\d+\)$/, //Regex para ser notificado sobre todos os fluxos
            //    /^Duplicar E-mail \(\d+\)$/,
            //    /^Recebimento de Garantia da Oficina \(\d+\)$/,
            //    /^Requisição da Oficina \(\d+\)$/,
        ],

        notificacaoHabilitada: true, //Ativa/desativa a notificação, mantendo o realçamento do botão de Administração
        margemTopo: 60, //Margem em pixels do topo da página, usado para notificações,
        notificacaoTempo: 5000, //Tempo (em ms) que a notificação permanece na tela
        pausarNotificacaoAoPassarMouse: true, // Pausar timeout da notificação ao passar o mouse
        intervaloAtualizacaoFluxos: 60000, // Intervalo (em ms) para atualizar os fluxos
        intervaloVerificacaoNotificacao: 10000, // Intervalo que o script procura novos fluxos para notificar
        idBotao: 'ext-gen26', //Botão da barra superior que será realçado ao encontrar fluxos
        textoBotao: 'Administração', //Texto do botão
        classeIframe: 'W5Portal_Window_Frame', //Classe do iframe contendo a página inicial
        idTabelaFluxo: 'W0038GridfluxoContainerTbl', //Tabela contendo os fluxos
        intervaloVerificacaoIframe: 1000 // Intervalo para verificar se o iframe foi carregado
    };

    let botaoModificado = false;
    let fluxosNotificados = new Set();
    let contagemFluxos = new Map();

    // Função auxiliar para dividir texto em fluxos individuais
    const separarFluxosIndividuais = (texto) => {
        // Regex para encontrar todos os matches de "Nome do Fluxo (N)"
        const regexFluxoIndividual = /[^()]+\(\d+\)/g;
        return texto.match(regexFluxoIndividual) || [];
    };

    // Função auxiliar para modificar o botão de administração e atualizar o tooltip
    const modificarBotao = (fluxos) => {
        const botao = document.getElementById(configuracao.idBotao);
        if (botao && botao.textContent.includes(configuracao.textoBotao)) {
            // Adicionar ícone de sino, se não estiver presente
            if (!botao.querySelector('.icone-sino')) {
                const iconeSino = document.createElement('span');
                iconeSino.innerHTML = '📢';
                iconeSino.style.marginRight = '5px';
                iconeSino.classList.add('icone-sino');
                botao.prepend(iconeSino);
                botao.style.fontWeight = 'bold';
                botao.style.color = 'red';
                botaoModificado = true;
            }

            // Atualizar tooltip com fluxos encontrados e suas contagens
            const tooltipFluxos = Array.from(contagemFluxos.entries())
            .map(([fluxo, count]) => `${fluxo}`)
            .join('\n');
            botao.title = tooltipFluxos;
        }
    };

    // Reverter o botão de administração para o estado original
    const reverterBotao = () => {
        const botao = document.getElementById(configuracao.idBotao);
        if (botao && botao.querySelector('.icone-sino')) {
            botao.querySelector('.icone-sino').remove();
            botao.style.fontWeight = 'normal';
            botao.style.color = '';
            botao.title = '';
            botaoModificado = false;
        }
    };

    // Notificar o usuário sobre os fluxos encontrados
    const mostrarNotificacao = (fluxos) => {
        const notificacao = document.createElement('div');
        notificacao.style = `
            position: fixed; right: 0; top: ${configuracao.margemTopo}px;
            background: #FFF;
            color: black; padding: 15px 20px;
            border-radius: 8px 0px 0px 8px;
            max-width: 350px; z-index: 9999; font-family: 'Arial', sans-serif;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(100%); transition: transform 0.5s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
            border: 1px solid #999;
            cursor: pointer;
        `;

        // Variáveis para controlar o tempo de exibição e o timeout
        let tempoRestante = configuracao.notificacaoTempo;
        let timeoutSaida;
        let inicioTempo;

        // Função para iniciar o timeout de saída
        const iniciarTimeoutSaida = () => {
            inicioTempo = Date.now();
            timeoutSaida = setTimeout(() => {
                notificacao.style.transform = 'translateX(100%)';
                notificacao.style.opacity = '0';
                setTimeout(() => notificacao.remove(), 500); // Remover notificação após animação de saída
            }, tempoRestante);
        };

        // Fechar a notificação ao clicar
        notificacao.onclick = () => {
            notificacao.style.transform = 'translateX(100%)';
            notificacao.style.opacity = '0';
            setTimeout(() => notificacao.remove(), 500); // Remover notificação após animação de saída
        };

        // Adicionar tratamento de pausa com mouse, se habilitado
        if (configuracao.pausarNotificacaoAoPassarMouse) {
            notificacao.addEventListener('mouseenter', () => {
                if (timeoutSaida) {
                    clearTimeout(timeoutSaida);
                    tempoRestante -= (Date.now() - inicioTempo);
                }
            });

            notificacao.addEventListener('mouseleave', () => {
                if (tempoRestante > 0) {
                    iniciarTimeoutSaida();
                }
            });
        }

        // Título
        const titulo = document.createElement('strong');
        titulo.style = 'font-size: 18px; display: block; font-weight: bold; margin-bottom: 5px;';
        titulo.textContent = '🔔 Novos fluxos encontrados';
        notificacao.appendChild(titulo);

        // Corpo
        const corpo = document.createElement('div');
        corpo.style = 'font-size: 14px; white-space: pre-wrap; line-height: 1.4;';
        corpo.textContent = Array.from(fluxos).join('\n');
        notificacao.appendChild(corpo);

        document.body.appendChild(notificacao);

        // Animação de entrada
        setTimeout(() => {
            notificacao.style.transform = 'translateX(0)';
            notificacao.style.opacity = '1';
        }, 100);

        // Iniciar timeout de saída
        iniciarTimeoutSaida();
    };

    // Verificar a tabela de fluxos e aplicar lógica
    const verificarFluxos = (iframe) => {
        const docIframe = iframe.contentDocument || iframe.contentWindow.document;
        if (!docIframe) return;

        const tabela = docIframe.getElementById(configuracao.idTabelaFluxo);
        const fluxosAtualizados = new Set(); // Novo conjunto para rastrear apenas fluxos que mudaram

        if (tabela) {
            const celulas = tabela.getElementsByTagName('td');
            const contagemAtualFluxos = new Map();

            // Iterar sobre as células da tabela
            for (let celula of celulas) {
                const textoCelula = celula.textContent.trim();

                configuracao.procurarFluxos.forEach(padrao => {
                    // Para regex genéricas como /^.*\(\d+\)$/, separar em fluxos individuais
                    if (padrao.toString() === '/^.*\\(\\d+\\)$/') {
                        const fluxosIndividuais = separarFluxosIndividuais(textoCelula);
                        fluxosIndividuais.forEach(fluxo => {
                            const correspondenciaContagem = fluxo.match(/\((\d+)\)/);
                            const contagem = correspondenciaContagem ? parseInt(correspondenciaContagem[1]) : 1;
                            const contagemAnterior = contagemFluxos.get(fluxo) || 0;

                            // Adicionar ao conjunto de fluxos atualizados apenas se a contagem aumentou
                            if (contagem > contagemAnterior) {
                                fluxosAtualizados.add(fluxo);
                            }

                            contagemAtualFluxos.set(fluxo, contagem);
                        });
                    } else {
                        // Para regex específicas, manter o comportamento original
                        const correspondencia = textoCelula.match(padrao);
                        if (correspondencia) {
                            const nomeFluxo = correspondencia[0];
                            const correspondenciaContagem = textoCelula.match(/\((\d+)\)/);
                            const contagem = correspondenciaContagem ? parseInt(correspondenciaContagem[1]) : 1;
                            const contagemAnterior = contagemFluxos.get(nomeFluxo) || 0;

                            if (contagem > contagemAnterior) {
                                fluxosAtualizados.add(nomeFluxo);
                            }

                            contagemAtualFluxos.set(nomeFluxo, contagem);
                        }
                    }
                });
            }

            // Atualizar o botão se houver qualquer fluxo (para manter o visual de alerta)
            if (contagemAtualFluxos.size > 0) {
                modificarBotao(contagemAtualFluxos);
            } else {
                reverterBotao();
                contagemFluxos.clear();
                fluxosNotificados.clear();
            }

            // Notificar apenas se houver fluxos realmente atualizados
            if (fluxosAtualizados.size > 0 && configuracao.notificacaoHabilitada) {
                mostrarNotificacao(fluxosAtualizados);
            }

            // Atualizar as contagens depois de processar tudo
            contagemFluxos = new Map(contagemAtualFluxos);
        }
    };

    // Detectar quando o iframe foi totalmente carregado
    const esperarCarregamentoIframe = () => {
        const iframe = document.querySelector(`.${configuracao.classeIframe}`);
        if (iframe) {
            iframe.onload = () => verificarFluxos(iframe);
            verificarFluxos(iframe);
        }
    };

    // Verificar continuamente a presença do iframe e monitorar fluxos
    const verificarContinuamenteIframe = () => {
        const intervaloId = setInterval(() => {
            const iframe = document.querySelector(`.${configuracao.classeIframe}`);
            if (iframe) {
                clearInterval(intervaloId);
                esperarCarregamentoIframe();
            }
        }, configuracao.intervaloVerificacaoIframe);
    };

    // Lógica principal do script baseada na página atual
    const site = window.location.pathname;
    if (site === '/Portal/default.html') {
        verificarContinuamenteIframe();
        setInterval(verificarContinuamenteIframe, configuracao.intervaloVerificacaoNotificacao);
    } else if (site === '/WP_Fluxo.aspx') {
        setInterval(() => gx.evt.execEvt('W0038E\'DOATUALIZAR\'.', this), configuracao.intervaloAtualizacaoFluxos);
    }
})();