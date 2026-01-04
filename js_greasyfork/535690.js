// ==UserScript==
// @name         Tinder Deblur
// @namespace    https://github.com/seu-usuario/tinder-deblur-simplificado
// @version      1.0
// @description  Script simples para desembaçar fotos de quem curtiu você no Tinder
// @author       CoelhoBugado
// @match        https://tinder.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535690/Tinder%20Deblur.user.js
// @updateURL https://update.greasyfork.org/scripts/535690/Tinder%20Deblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuração básica
    const CONFIG = {
        // Seletores importantes
        seletores: {
            containerPreviewCurtidas: '.Expand.enterAnimationContainer > div:nth-child(1)' // Seletor das imagens embaçadas
        },
        // Atrasos para garantir que elementos estejam prontos
        atrasos: {
            carregamentoPagina: 2000, // 2 segundos após carregamento da página
            tentativaDesembacar: 1500, // 1,5 segundos entre tentativas
            verificacaoDOM: 1000 // 1 segundo para verificar mudanças na URL
        }
    };

    // Funções de utilidade
    const util = {
        log: (mensagem) => {
            console.log(`[Tinder Deblur] ${mensagem}`);
        },
        erro: (mensagem) => {
            console.error(`[Tinder Deblur] ${mensagem}`);
        },
        adicionarEstilo: (css) => {
            const estilo = document.createElement('style');
            estilo.textContent = css;
            document.head.appendChild(estilo);
        }
    };

    // Função principal para desembaçar imagens
    const desembacarImagens = async () => {
        try {
            util.log('Iniciando processo de desembaçamento...');

            // Obter token de autenticação
            const token = localStorage.getItem('TinderWeb/APIToken');
            if (!token) {
                util.erro('Token de autenticação não encontrado. Por favor, faça login no Tinder.');
                return false;
            }

            // Fazer requisição para obter os dados dos teasers
            const resposta = await fetch('https://api.gotinder.com/v2/fast-match/teasers', {
                headers: {
                    'X-Auth-Token': token,
                    'platform': 'android', // Importante para obter dados não filtrados
                    'Content-Type': 'application/json'
                }
            });

            if (!resposta.ok) {
                util.erro(`Erro na requisição: ${resposta.status} ${resposta.statusText}`);
                return false;
            }

            const dados = await resposta.json();

            if (!dados || !dados.data || !dados.data.results || !Array.isArray(dados.data.results)) {
                util.erro('Formato de dados inválido na resposta da API');
                return false;
            }

            const teasers = dados.data.results;
            util.log(`Obtidos ${teasers.length} teasers da API`);

            // Esperar um momento para garantir que elementos DOM estejam prontos
            await new Promise(resolve => setTimeout(resolve, 500));

            // Buscar elementos do DOM
            const teaserEls = document.querySelectorAll(CONFIG.seletores.containerPreviewCurtidas);

            if (!teaserEls || teaserEls.length === 0) {
                util.erro('Nenhum elemento encontrado para desembaçar. Talvez os seletores estejam desatualizados?');
                return false;
            }

            util.log(`Encontrados ${teaserEls.length} elementos para desembaçar`);

            // Substituir imagens embaçadas pelas originais
            let contagemSucesso = 0;

            // Desembaçar apenas até o mínimo entre a quantidade de elementos DOM e de dados da API
            const qtdProcessar = Math.min(teaserEls.length, teasers.length);

            for (let i = 0; i < qtdProcessar; i++) {
                const teaser = teasers[i];
                const elemento = teaserEls[i];

                if (teaser && teaser.user && teaser.user._id && teaser.user.photos && teaser.user.photos.length > 0) {
                    const userId = teaser.user._id;
                    const photoId = teaser.user.photos[0].id;

                    // Construir URL da imagem original
                    const urlImagemOriginal = `https://preview.gotinder.com/${userId}/original_${photoId}.jpeg`;

                    // Aplicar imagem original e remover filtro
                    elemento.style.backgroundImage = `url("${urlImagemOriginal}")`;
                    elemento.style.filter = 'none';
                    contagemSucesso++;

                    // Adicionar atributos com dados do usuário (opcional)
                    if (teaser.user.name) {
                        elemento.setAttribute('data-nome', teaser.user.name);
                    }
                }
            }

            util.log(`Desembaçadas ${contagemSucesso} imagens com sucesso!`);
            return contagemSucesso > 0;
        } catch (erro) {
            util.erro(`Erro ao desembaçar imagens: ${erro.message || erro}`);
            return false;
        }
    };

    // Verificar se estamos na página de curtidas
    const estaNaPaginaCurtidas = () => {
        const caminho = window.location.pathname;
        return caminho.includes('/app/likes-you') || caminho.includes('/app/gold-home');
    };

    // Criar botão flutuante
    const criarBotaoDesembacar = () => {
        const botao = document.createElement('button');
        botao.textContent = 'Desembaçar Fotos';
        botao.id = 'botao-desembacar-tinder';
        document.body.appendChild(botao);

        // Adicionar estilo ao botão
        util.adicionarEstilo(`
            #botao-desembacar-tinder {
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 9999;
                background-color: #FE3C72;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s;
            }
            #botao-desembacar-tinder:hover {
                background-color: #FF6B81;
            }
            #botao-desembacar-tinder:active {
                transform: scale(0.98);
            }
        `);

        // Adicionar evento de clique
        botao.addEventListener('click', async () => {
            botao.textContent = 'Desembaçando...';
            botao.disabled = true;

            const sucesso = await desembacarImagens();

            if (sucesso) {
                botao.textContent = 'Sucesso!';
                setTimeout(() => {
                    botao.textContent = 'Desembaçar Fotos';
                    botao.disabled = false;
                }, 2000);
            } else {
                botao.textContent = 'Falhou!';
                setTimeout(() => {
                    botao.textContent = 'Tentar Novamente';
                    botao.disabled = false;
                }, 2000);
            }
        });

        return botao;
    };

    // Observar mudanças na URL para ativar o desembaçamento quando necessário
    const observarMudancasURL = () => {
        let ultimoPathname = window.location.pathname;

        // Verificar mudanças na URL periodicamente
        setInterval(() => {
            const caminhoAtual = window.location.pathname;
            if (caminhoAtual !== ultimoPathname) {
                ultimoPathname = caminhoAtual;

                if (estaNaPaginaCurtidas()) {
                    util.log('Detectada página de curtidas, desembaçando automaticamente...');
                    // Atraso para garantir que o DOM esteja carregado após mudança de página
                    setTimeout(() => {
                        desembacarImagens();
                    }, CONFIG.atrasos.tentativaDesembacar);
                }
            }
        }, CONFIG.atrasos.verificacaoDOM);
    };

    // Configurar observador de mutações para detectar quando novos elementos são adicionados
    const configurarObservadorDOM = () => {
        // Verificar se MutationObserver está disponível
        if (!window.MutationObserver) {
            util.erro('MutationObserver não suportado neste navegador');
            return;
        }

        const observer = new MutationObserver((mutacoes) => {
            // Verificar se estamos na página de curtidas
            if (!estaNaPaginaCurtidas()) return;

            // Verificar se novas curtidas foram carregadas
            for (const mutacao of mutacoes) {
                if (mutacao.type === 'childList' && mutacao.addedNodes.length > 0) {
                    const elementosPreview = document.querySelectorAll(CONFIG.seletores.containerPreviewCurtidas);

                    // Se encontramos elementos que podem ser desembaçados, tente desembaçar
                    if (elementosPreview && elementosPreview.length > 0) {
                        // Adicionar atraso para garantir que o conteúdo esteja completamente carregado
                        setTimeout(() => {
                            desembacarImagens();
                        }, CONFIG.atrasos.tentativaDesembacar);
                        break; // Sair do loop após iniciar uma tentativa
                    }
                }
            }
        });

        // Observar o corpo da página para quaisquer alterações
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    };

    // Inicializar o script
    const inicializar = () => {
        util.log('Inicializando script Tinder Deblur Simplificado...');

        // Criar botão de desembaçamento
        const botao = criarBotaoDesembacar();

        // Configurar observadores
        observarMudancasURL();
        configurarObservadorDOM();

        // Se já estiver na página de curtidas, tente desembaçar após carregamento completo
        if (estaNaPaginaCurtidas()) {
            util.log('Página de curtidas detectada, desembaçando automaticamente...');
            setTimeout(() => {
                desembacarImagens();
            }, CONFIG.atrasos.carregamentoPagina);
        }

        util.log('Script inicializado com sucesso!');
    };

    // Iniciar script quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();
