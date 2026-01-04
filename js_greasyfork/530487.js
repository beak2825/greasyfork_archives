// ==UserScript==
// @name         Popmundo - Renomeador de Itens
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Renomeia itens no Popmundo com pesquisa por nome
// @author       Popper
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/ItemDetails/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530487/Popmundo%20-%20Renomeador%20de%20Itens.user.js
// @updateURL https://update.greasyfork.org/scripts/530487/Popmundo%20-%20Renomeador%20de%20Itens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURAÇÕES
    const INTERVALO_HORAS = 1; // Horas entre cada renomeação

    // URL da página de itens para voltar quando necessário
    const PAGINA_ITENS = "/World/Popmundo.aspx/Character/Items/";

    // Seletores para diferentes páginas
    const SELETORES = {
        // Página de itens
        listaItens: "a[id*='lnkItem']",

        // Página de detalhes do item
        botaoGravar: "#ctl00_cphLeftColumn_ctl00_btnItemEngrave",
        campoNome: "#ctl00_cphLeftColumn_ctl00_txtItemName",
        botaoConfirmar: "#ctl00_cphLeftColumn_ctl00_btnItemNameConfirm"
    };

    // Variáveis globais
    let painelControl;
    let statusText;
    let infoTempo;
    let botaoRenomear;
    let nomePersonalizado;
    let campoPesquisa;
    let resultadosPesquisa;

    // Função para criar o painel principal
    function criarPainel() {
        // Remover painel existente, se houver
        const painelExistente = document.getElementById('renomeador-painel');
        if (painelExistente) painelExistente.remove();

        // Criar o painel principal
        painelControl = document.createElement('div');
        painelControl.id = 'renomeador-painel';
        painelControl.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: #34495e;
            border: 2px solid #2c3e50;
            border-radius: 10px;
            color: white;
            font-family: Arial, sans-serif;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;

        // Título do painel
        const titulo = document.createElement('div');
        titulo.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
            border-bottom: 1px solid #3498db;
            padding-bottom: 10px;
            position: relative;
        `;
        titulo.textContent = 'Renomeador de Itens';

        // Botão minimizar
        const botaoMinimizar = document.createElement('button');
        botaoMinimizar.textContent = '−';
        botaoMinimizar.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            color: #bdc3c7;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
        `;

        // Status e informações
        statusText = document.createElement('div');
        statusText.style.cssText = `
            margin-bottom: 5px;
            font-size: 13px;
        `;

        infoTempo = document.createElement('div');
        infoTempo.style.cssText = `
            margin-bottom: 15px;
            font-size: 13px;
        `;

        // Área de pesquisa de itens (apenas na página de itens)
        const areaPesquisa = document.createElement('div');
        areaPesquisa.id = 'area-pesquisa';
        areaPesquisa.style.cssText = `
            margin-bottom: 15px;
        `;

        // Campo de pesquisa
        const pesquisaLabel = document.createElement('div');
        pesquisaLabel.textContent = 'Pesquisar item por nome:';
        pesquisaLabel.style.cssText = `
            font-size: 13px;
            margin-bottom: 5px;
        `;

        campoPesquisa = document.createElement('input');
        campoPesquisa.type = 'text';
        campoPesquisa.placeholder = 'Digite parte do nome do item...';
        campoPesquisa.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 1px solid #2c3e50;
            background-color: #2c3e50;
            color: white;
            font-size: 13px;
        `;

        // Botão de pesquisa
        const botaoPesquisa = document.createElement('button');
        botaoPesquisa.textContent = 'Pesquisar Item';
        botaoPesquisa.style.cssText = `
            width: 100%;
            padding: 8px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            margin-bottom: 10px;
        `;

        botaoPesquisa.onclick = pesquisarItens;

        // Resultados da pesquisa
        resultadosPesquisa = document.createElement('div');
        resultadosPesquisa.style.cssText = `
            font-size: 13px;
            margin-bottom: 10px;
            display: none;
        `;

        // Campo para nome personalizado
        const nomePersonalizadoLabel = document.createElement('div');
        nomePersonalizadoLabel.style.cssText = `
            font-size: 13px;
            margin-bottom: 5px;
        `;
        nomePersonalizadoLabel.textContent = 'Nome para o item:';

        nomePersonalizado = document.createElement('input');
        nomePersonalizado.type = 'text';
        nomePersonalizado.value = GM_getValue('nome_personalizado', '');
        nomePersonalizado.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border-radius: 5px;
            border: 1px solid #2c3e50;
            background-color: #2c3e50;
            color: white;
            font-size: 13px;
        `;

        // Botão de renomeação
        botaoRenomear = document.createElement('button');
        botaoRenomear.style.cssText = `
            width: 100%;
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        botaoRenomear.textContent = 'Renomear Item Selecionado';
        botaoRenomear.onmouseover = () => { botaoRenomear.style.backgroundColor = '#2980b9'; };
        botaoRenomear.onmouseout = () => { botaoRenomear.style.backgroundColor = '#3498db'; };
        botaoRenomear.onclick = iniciarProcessoRenomeacao;

        // Adicionar evento ao botão minimizar
        let areaPesquisaVisivel = true;
        botaoMinimizar.onclick = function() {
            areaPesquisaVisivel = !areaPesquisaVisivel;
            if (!areaPesquisaVisivel) {
                areaPesquisa.style.display = 'none';
                nomePersonalizado.style.display = 'none';
                nomePersonalizadoLabel.style.display = 'none';
                botaoMinimizar.textContent = '+';
            } else {
                areaPesquisa.style.display = 'block';
                nomePersonalizado.style.display = 'block';
                nomePersonalizadoLabel.style.display = 'block';
                botaoMinimizar.textContent = '−';
            }
        };

        // Montar área de pesquisa
        areaPesquisa.appendChild(pesquisaLabel);
        areaPesquisa.appendChild(campoPesquisa);
        areaPesquisa.appendChild(botaoPesquisa);
        areaPesquisa.appendChild(resultadosPesquisa);

        // Montar o painel
        titulo.appendChild(botaoMinimizar);
        painelControl.appendChild(titulo);
        painelControl.appendChild(statusText);
        painelControl.appendChild(infoTempo);

        // Adicionar área de pesquisa apenas na página de itens
        if (window.location.href.includes('/Character/Items/')) {
            painelControl.appendChild(areaPesquisa);
        }

        painelControl.appendChild(nomePersonalizadoLabel);
        painelControl.appendChild(nomePersonalizado);
        painelControl.appendChild(botaoRenomear);

        // Adicionar à página
        document.body.appendChild(painelControl);

        // Atualizar informações
        atualizarPainel();
    }

    // Atualizar informações do painel
    function atualizarPainel() {
        if (!painelControl) return;

        const ultimaRenomeacao = GM_getValue('ultima_renomeacao', 0);
        const agora = Date.now();
        const tempoPassado = agora - ultimaRenomeacao;
        const intervaloMs = INTERVALO_HORAS * 60 * 60 * 1000;

        // Verificar se está na hora de renomear
        const prontoParaRenomear = tempoPassado >= intervaloMs;

        // Calcular tempo restante
        const tempoRestante = Math.max(0, intervaloMs - tempoPassado);
        const minutos = Math.floor(tempoRestante / 60000);
        const segundos = Math.floor((tempoRestante % 60000) / 1000);
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        // Atualizar textos
        statusText.textContent = `Status: ${prontoParaRenomear ? '✅ Pronto' : '⏳ Aguardando'}`;

        if (horas > 0) {
            infoTempo.textContent = `Próxima: ${prontoParaRenomear ? 'Agora' : `${horas}h ${minutosRestantes}m`}`;
        } else {
            infoTempo.textContent = `Próxima: ${prontoParaRenomear ? 'Agora' : `${minutos}m ${segundos}s`}`;
        }

        // Verificar página atual
        const estaNaPaginaItems = window.location.href.includes('/Character/Items/');
        const estaNaPaginaDetalhes = window.location.href.includes('/Character/ItemDetails/');

        if (estaNaPaginaItems) {
            statusText.textContent = `Status: 📋 Lista de Itens`;
            botaoRenomear.textContent = 'Renomear Item Selecionado';
        } else if (estaNaPaginaDetalhes) {
            // Verificar se já está nomeada corretamente
            if (verificarNomeAtual()) {
                statusText.textContent = `Status: ✅ Já Nomeado`;
                infoTempo.textContent = `Nome atual: ${nomePersonalizado.value}`;
            } else if (document.querySelector(SELETORES.campoNome)) {
                statusText.textContent = `Status: ✏️ Editando Nome`;
                botaoRenomear.textContent = 'Confirmar Nome';
            } else {
                statusText.textContent = `Status: 🔍 Detalhes do Item`;
                botaoRenomear.textContent = 'Iniciar Renomeação';
            }
        }
    }

    // Função para pesquisar itens pelo nome
    function pesquisarItens() {
        if (!window.location.href.includes('/Character/Items/')) return;

        const termoPesquisa = campoPesquisa.value.toLowerCase().trim();
        if (!termoPesquisa) {
            resultadosPesquisa.innerHTML = '<div style="color: #e74c3c;">Digite um termo para pesquisar</div>';
            resultadosPesquisa.style.display = 'block';
            return;
        }

        // Obter todos os itens da página
        const links = document.querySelectorAll(SELETORES.listaItens);
        const itensFiltrados = [];

        for (const link of links) {
            const nomeItem = link.textContent.trim();
            const href = link.getAttribute('href');
            if (nomeItem.toLowerCase().includes(termoPesquisa)) {
                itensFiltrados.push({ nome: nomeItem, url: href });
            }
        }

        // Exibir resultados
        resultadosPesquisa.innerHTML = '';
        resultadosPesquisa.style.display = 'block';

        if (itensFiltrados.length === 0) {
            resultadosPesquisa.innerHTML = '<div style="color: #e74c3c;">Nenhum item encontrado com esse nome</div>';
            return;
        }

        // Mostrar os resultados da pesquisa
        const titulo = document.createElement('div');
        titulo.textContent = `Encontrados ${itensFiltrados.length} item(s):`;
        titulo.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
        `;
        resultadosPesquisa.appendChild(titulo);

        // Limitar a 5 resultados para não sobrecarregar
        const resultadosExibidos = itensFiltrados.slice(0, 5);

        for (const item of resultadosExibidos) {
            const itemElement = document.createElement('div');
            itemElement.style.cssText = `
                padding: 8px;
                margin-bottom: 5px;
                background-color: #2c3e50;
                border-radius: 4px;
                cursor: pointer;
            `;
            itemElement.textContent = item.nome;

            itemElement.onclick = () => {
                // Salvar o item selecionado
                GM_setValue('item_selecionado', JSON.stringify(item));

                // Sugerir o nome do item para renomeação
                if (!nomePersonalizado.value) {
                    nomePersonalizado.value = item.nome;
                    GM_setValue('nome_personalizado', item.nome);
                }

                // Destacar o item selecionado
                const itensDestacados = resultadosPesquisa.querySelectorAll('.item-selecionado');
                itensDestacados.forEach(el => {
                    el.classList.remove('item-selecionado');
                    el.style.borderLeft = 'none';
                });

                itemElement.classList.add('item-selecionado');
                itemElement.style.borderLeft = '3px solid #2ecc71';

                // Atualizar status
                statusText.textContent = `Status: ✅ Item Selecionado`;
                infoTempo.textContent = `Selecionado: ${item.nome}`;
            };

            // Verificar se este é o item selecionado anteriormente
            try {
                const itemSelecionado = JSON.parse(GM_getValue('item_selecionado', '{}'));
                if (itemSelecionado.url === item.url) {
                    itemElement.classList.add('item-selecionado');
                    itemElement.style.borderLeft = '3px solid #2ecc71';
                }
            } catch (e) { }

            resultadosPesquisa.appendChild(itemElement);
        }

        // Indicar se há mais resultados
        if (itensFiltrados.length > 5) {
            const maisItens = document.createElement('div');
            maisItens.textContent = `...e mais ${itensFiltrados.length - 5} item(s) não exibidos. Refine sua pesquisa.`;
            maisItens.style.cssText = `
                font-style: italic;
                font-size: 12px;
                margin-top: 5px;
                color: #bdc3c7;
            `;
            resultadosPesquisa.appendChild(maisItens);
        }
    }

    // Verificar se o item já está com o nome correto
    function verificarNomeAtual() {
        // Obter o nome personalizado atual
        const nomeDesejado = nomePersonalizado.value;
        if (!nomeDesejado) return false;

        // Procurar por "Nome: X" em qualquer lugar da página
        const conteudoPagina = document.body.innerText || '';
        const padraoNome = new RegExp(`Nome:\\s*${nomeDesejado.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

        if (padraoNome.test(conteudoPagina)) {
            console.log("Item já está com o nome correto!");
            return true;
        }

        return false;
    }

    // Voltar para a página de itens
    function voltarParaItens() {
        console.log("Voltando para a página de itens...");

        // Tentar encontrar link "Voltar" ou similar na página
        const linksVoltar = Array.from(document.querySelectorAll('a')).filter(
            link => link.textContent.includes('Voltar') ||
                   link.textContent.includes('Back') ||
                   link.textContent.includes('Return')
        );

        if (linksVoltar.length > 0) {
            console.log("Link de voltar encontrado. Clicando...");
            linksVoltar[0].click();
        } else {
            // Se não encontrar link de voltar, redirecionar para a página de itens
            const urlAtual = window.location.href;
            const urlBase = urlAtual.substring(0, urlAtual.indexOf("/World/")) + PAGINA_ITENS;

            // Extrair ID do personagem da URL atual (se possível)
            const match = urlAtual.match(/\/Items\/(\d+)/) || urlAtual.match(/\/ItemDetails\/\d+\/(\d+)/);
            const characterId = match ? match[1] : '';

            window.location.href = urlBase + characterId;
        }
    }

    // Iniciar o processo de renomeação
    function iniciarProcessoRenomeacao() {
        console.log("Iniciando processo de renomeação...");

        // Verificar se o nome foi definido
        if (!nomePersonalizado.value) {
            alert("Por favor, digite um nome para o item antes de renomear.");
            nomePersonalizado.focus();
            return;
        }

        // Desabilitar botão durante o processo
        if (botaoRenomear) {
            botaoRenomear.disabled = true;
            botaoRenomear.style.backgroundColor = '#95a5a6';
        }

        // Obter o nome personalizado
        const nomeItemPersonalizado = nomePersonalizado.value;
        GM_setValue('nome_personalizado', nomeItemPersonalizado);

        // Verificar em qual página estamos
        const estaNaPaginaItems = window.location.href.includes('/Character/Items/');
        const estaNaPaginaDetalhes = window.location.href.includes('/Character/ItemDetails/');

        if (estaNaPaginaItems) {
            // Na página de itens, clicar no item selecionado
            try {
                const itemSelecionado = JSON.parse(GM_getValue('item_selecionado', '{}'));
                if (itemSelecionado.url) {
                    console.log("Item selecionado para renomeação:", itemSelecionado.nome);
                    statusText.textContent = `Status: 🔍 Item Selecionado`;
                    infoTempo.textContent = `Abrindo: ${itemSelecionado.nome}`;

                    // Clicar no item (navegar para a página de detalhes)
                    setTimeout(() => {
                        window.location.href = itemSelecionado.url;
                    }, 500);
                    return;
                }
            } catch (e) { }

            // Nenhum item selecionado
            statusText.textContent = `Status: ❌ Nenhum Item Selecionado`;
            infoTempo.textContent = `Pesquise e selecione um item`;

            // Reabilitar botão
            if (botaoRenomear) {
                setTimeout(() => {
                    botaoRenomear.disabled = false;
                    botaoRenomear.style.backgroundColor = '#3498db';
                }, 1000);
            }
        } else if (estaNaPaginaDetalhes) {
            // Verificar se já está nomeado corretamente
            if (verificarNomeAtual()) {
                console.log("Item já está com o nome correto, voltando para itens...");
                voltarParaItens();
                return;
            }

            // Na página de detalhes do item
            const campoNome = document.querySelector(SELETORES.campoNome);

            if (campoNome) {
                // Já está na tela de edição de nome
                preencherEConfirmarNome(nomeItemPersonalizado);
            } else {
                // Precisa clicar no botão de gravar
                const botaoGravar = document.querySelector(SELETORES.botaoGravar);
                if (botaoGravar) {
                    console.log("Clicando no botão gravar...");
                    statusText.textContent = `Status: ⚒️ Gravando...`;
                    botaoGravar.click();
                } else {
                    console.log("Botão gravar não encontrado");
                    statusText.textContent = `Status: ❌ Botão Não Encontrado`;

                    // Reabilitar botão
                    if (botaoRenomear) {
                        setTimeout(() => {
                            botaoRenomear.disabled = false;
                            botaoRenomear.style.backgroundColor = '#3498db';
                        }, 1000);
                    }
                }
            }
        }
    }

    // Preencher o campo de nome e confirmar
    function preencherEConfirmarNome(nomeItem) {
        console.log("Preenchendo nome do item...");

        const campoNome = document.querySelector(SELETORES.campoNome);
        if (!campoNome) {
            console.log("Campo de nome não encontrado");
            return;
        }

        // Verificar se o nome atual já é o desejado
        if (campoNome.value === nomeItem) {
            console.log("Item já está com o nome desejado no campo.");
            statusText.textContent = `Status: ✅ Nome Já Aplicado`;
            infoTempo.textContent = `"${nomeItem}"`;

            // Clicar no botão confirmar para garantir
            const botaoConfirmar = document.querySelector(SELETORES.botaoConfirmar);
            if (botaoConfirmar) {
                setTimeout(() => {
                    botaoConfirmar.click();
                    GM_setValue('ultima_renomeacao', Date.now());
                }, 500);
            }

            // Voltar para itens após confirmar
            setTimeout(voltarParaItens, 2500);
            return;
        }

        // Preencher o nome
        campoNome.value = nomeItem;
        statusText.textContent = `Status: ✏️ Preenchendo...`;

        // Clicar no botão de confirmar
        setTimeout(() => {
            const botaoConfirmar = document.querySelector(SELETORES.botaoConfirmar);
            if (botaoConfirmar) {
                console.log("Clicando no botão confirmar...");
                statusText.textContent = `Status: ✅ Confirmando...`;
                botaoConfirmar.click();

                // Salvar o timestamp
                GM_setValue('ultima_renomeacao', Date.now());

                // Voltar para itens após confirmar
                setTimeout(voltarParaItens, 2000);
            } else {
                console.log("Botão confirmar não encontrado");
                statusText.textContent = `Status: ❌ Botão Não Encontrado`;

                // Reabilitar botão
                if (botaoRenomear) {
                    setTimeout(() => {
                        botaoRenomear.disabled = false;
                        botaoRenomear.style.backgroundColor = '#3498db';
                    }, 1000);
                }
            }
        }, 500);
    }

    // Verificar automaticamente se é hora de renomear
    function verificarAutomatico() {
        const ultimaRenomeacao = GM_getValue('ultima_renomeacao', 0);
        const agora = Date.now();
        const intervaloMs = INTERVALO_HORAS * 60 * 60 * 1000;

        if (agora - ultimaRenomeacao >= intervaloMs) {
            console.log("Hora de renomear automaticamente...");
            iniciarProcessoRenomeacao();
        }
    }

    // Inicialização do script
    function iniciar() {
        console.log("Iniciando script de renomeação com pesquisa de itens...");
        criarPainel();

        // Se já estiver na página de detalhes, verificar se já está nomeado
        if (window.location.href.includes('/Character/ItemDetails/')) {
            if (verificarNomeAtual()) {
                statusText.textContent = `Status: ✅ Já Nomeado`;
                infoTempo.textContent = `Nome atual: ${nomePersonalizado.value}`;
            }
        }

        // Atualizar painel a cada segundo para o contador
        setInterval(atualizarPainel, 1000);

        // Verificar automaticamente a cada minuto
        setInterval(verificarAutomatico, 60000);

        // Verificar se deve executar renomeação imediatamente
        setTimeout(verificarAutomatico, 2000);
    }

    // Iniciar script quando a página estiver carregada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();

