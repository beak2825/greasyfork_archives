// ==UserScript==
// @name         Vendas Corporativas Editável
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adiciona menu flutuante para reordenar e ocultar seções
// @author       Igor Lima
// @license      MIT
// @match        https://dealers.vendascorporativas.com.br/configurador.print/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.6/Sortable.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545415/Vendas%20Corporativas%20Edit%C3%A1vel.user.js
// @updateURL https://update.greasyfork.org/scripts/545415/Vendas%20Corporativas%20Edit%C3%A1vel.meta.js
// ==/UserScript==

/*
    Este código foi gerado com ajuda de um modelo de IA. Embora tenha sido projetado para ser funcional,
    pode ser necessário realizar uma revisão, testes ou modificações para atender às suas necessidades específicas.
    Verifique o código quanto à correção e adequação antes de utilizá-lo em ambientes de produção.
*/

(function() {
    'use strict';

    // ========== CONFIGURAÇÃO ==========
    const CONFIG = {
        // Cores principais
        cores: {
            principal: '#ff8c00', // Cor principal (laranja)
            principalEscura: '#e67e00', // Cor principal mais escura
            textoClaro: '#ffffff', // Texto claro
            textoEscuro: '#000000', // Texto escuro
            cinzaClaro: '#f5f5f5', // Fundo claro
            cinzaMedio: '#ddd', // Bordas
            realce: '#ff8c00' // Cor de realce (pode ser diferente da principal)
        },

        // Estados padrão dos controles
        estadosPadrao: {
            realcar: false,
            invertorTexto: false,
            promocao: false,
            editavel: false,
            customizado: false,
            tamanhoFontePromocao: 32,
            tamanhoFonteCustomizado: 16,
            tamanhoFonteH2: 11,
            tamanhoFonteDiv: 9
        }
    };
    // ===================================

    // Variável global para armazenar o estado
    window.estadoScript = null;

    // Aguarda o carregamento da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    function inicializar() {
        console.log('Inicializando script...');

        adicionarEstilos();
        removerZIndexCorpo();
        interceptarPrintDiv();
        criarMenuFlutuante();
        escanearEAgruparSecoes();
        ocultarH2VaziosComQuebraPagina();
        configurarObservadorMutacao();
        tornarGruposSecoesArrastaveis();

        // Restaurar estado se disponível
        if (window.estadoScript) {
            console.log('Restaurando estado salvo...');
            setTimeout(() => restaurarEstado(), 300);
        }
    }

    function interceptarPrintDiv() {
        // Salvar a função original se ainda não foi salva
        if (!window.printDivOriginal && typeof window.printDiv === 'function') {
            window.printDivOriginal = window.printDiv;
            console.log('Função printDiv original salva');
        }

        // Substituir a função printDiv
        window.printDiv = function(divName) {
            console.log('Print interceptado, salvando estado...');

            // Salvar estado atual
            salvarEstado();

            // Executar função original
            if (window.printDivOriginal) {
                window.printDivOriginal.call(this, divName);
            } else {
                // Fallback se a função original não estiver disponível
                var originalContents = document.body.innerHTML;
                var printContents = document.getElementById(divName).innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
            }

            // Reinicializar o script após print ao invés de recarregar a página
            setTimeout(() => {
                console.log('Reinicializando script após print...');
                inicializar();
            }, 100);
        };
    }

    function salvarEstado() {
        try {
            // Coletar seções ocultas
            const secoesOcultas = [];
            const gruposOcultos = document.querySelectorAll('.grupo-secao.oculto');
            gruposOcultos.forEach(grupo => {
                if (grupo.dataset.idSecao) {
                    secoesOcultas.push(grupo.dataset.idSecao);
                }
            });

            // Coletar ordem das seções
            const ordemSecoes = [];
            const gruposOrdenados = document.querySelectorAll('.grupo-secao');
            gruposOrdenados.forEach(grupo => {
                if (grupo.dataset.idSecao) {
                    ordemSecoes.push(grupo.dataset.idSecao);
                }
            });

            // Coletar tamanhos de fonte individuais (excluir header e veiculo)
            const tamanhosFonteIndividuais = {};
            document.querySelectorAll('.item-secao').forEach(item => {
                const idSecao = item.dataset.idSecao;
                const campoH2 = item.querySelector('.campo-fonte-h2');
                const campoDiv = item.querySelector('.campo-fonte-div');
                if (idSecao && campoH2 && campoDiv &&
                    !idSecao.includes('header') &&
                    !idSecao.includes('veiculo') &&
                    !idSecao.includes('assinatura-loja')) {
                    tamanhosFonteIndividuais[idSecao] = {
                        h2: campoH2.value,
                        div: campoDiv.value
                    };
                }
            });

            window.estadoScript = {
                realcar: document.querySelector('.checkbox-realcar')?.checked || CONFIG.estadosPadrao.realcar,
                invertorTexto: document.querySelector('.checkbox-inversor-texto')?.checked || CONFIG.estadosPadrao.invertorTexto,
                promocao: document.querySelector('.checkbox-promocao')?.checked || CONFIG.estadosPadrao.promocao,
                editavel: document.querySelector('.checkbox-editavel')?.checked || CONFIG.estadosPadrao.editavel,
                customizado: document.querySelector('.checkbox-customizado')?.checked || CONFIG.estadosPadrao.customizado,
                tamanhoFontePromocao: document.querySelector('.campo-tamanho-fonte')?.value || CONFIG.estadosPadrao.tamanhoFontePromocao,
                tamanhoFonteCustomizado: document.querySelector('.campo-tamanho-fonte-customizado')?.value || CONFIG.estadosPadrao.tamanhoFonteCustomizado,
                textoCustomizado: document.getElementById('div-customizada')?.innerHTML || '',
                posicaoMenu: getMenuPosition(),
                secoesOcultas: secoesOcultas,
                ordemSecoes: ordemSecoes,
                tamanhosFonteIndividuais: tamanhosFonteIndividuais
            };

            // Salvar no localStorage também para persistir entre reloads
            localStorage.setItem('vendas-corporativas-estado', JSON.stringify(window.estadoScript));
            console.log('Estado salvo:', window.estadoScript);
        } catch (e) {
            console.error('Erro ao salvar estado:', e);
        }
    }

    function carregarEstadoSalvo() {
        try {
            const estadoSalvo = localStorage.getItem('vendas-corporativas-estado');
            if (estadoSalvo) {
                window.estadoScript = JSON.parse(estadoSalvo);
                console.log('Estado carregado do localStorage:', window.estadoScript);
                return true;
            }
        } catch (e) {
            console.error('Erro ao carregar estado:', e);
        }
        return false;
    }

    function getMenuPosition() {
        const menu = document.getElementById('gerenciador-grupos');
        if (menu) {
            return {
                top: menu.style.top,
                left: menu.style.left,
                right: menu.style.right
            };
        }
        return null;
    }

    function restaurarEstado() {
        // Tentar carregar estado do localStorage primeiro
        if (!window.estadoScript) {
            carregarEstadoSalvo();
        }

        if (!window.estadoScript) return;

        try {
            console.log('Restaurando estado:', window.estadoScript);

            const estado = window.estadoScript;

            // Restaurar posição do menu
            if (estado.posicaoMenu) {
                const menu = document.getElementById('gerenciador-grupos');
                if (menu) {
                    if (estado.posicaoMenu.top) menu.style.top = estado.posicaoMenu.top;
                    if (estado.posicaoMenu.left) menu.style.left = estado.posicaoMenu.left;
                    if (estado.posicaoMenu.right) menu.style.right = estado.posicaoMenu.right;
                }
            }

            // Restaurar checkboxes e campos
            const checkboxRealcar = document.querySelector('.checkbox-realcar');
            const checkboxInversor = document.querySelector('.checkbox-inversor-texto');
            const checkboxPromocao = document.querySelector('.checkbox-promocao');
            const checkboxEditavel = document.querySelector('.checkbox-editavel');
            const checkboxCustomizado = document.querySelector('.checkbox-customizado');
            const campoFontePromocao = document.querySelector('.campo-tamanho-fonte');
            const campoFonteCustomizado = document.querySelector('.campo-tamanho-fonte-customizado');

            if (campoFontePromocao) campoFontePromocao.value = estado.tamanhoFontePromocao;
            if (campoFonteCustomizado) campoFonteCustomizado.value = estado.tamanhoFonteCustomizado;

            // Restaurar tamanhos de fonte individuais (excluir header e veiculo)
            if (estado.tamanhosFonteIndividuais) {
                Object.keys(estado.tamanhosFonteIndividuais).forEach(idSecao => {
                    if (!idSecao.includes('header') &&
                        !idSecao.includes('veiculo') &&
                        !idSecao.includes('assinatura-loja')) {
                        const item = document.querySelector(`.item-secao[data-id-secao="${idSecao}"]`);
                        if (item) {
                            const campoH2 = item.querySelector('.campo-fonte-h2');
                            const campoDiv = item.querySelector('.campo-fonte-div');
                            if (campoH2) campoH2.value = estado.tamanhosFonteIndividuais[idSecao].h2;
                            if (campoDiv) campoDiv.value = estado.tamanhosFonteIndividuais[idSecao].div;
                            aplicarTamanhoFonteSecao(idSecao, estado.tamanhosFonteIndividuais[idSecao].h2, estado.tamanhosFonteIndividuais[idSecao].div);
                        }
                    }
                });
            }

            if (checkboxRealcar && estado.realcar) {
                checkboxRealcar.checked = true;
                aplicarRealce();
            }

            if (checkboxInversor && estado.invertorTexto) {
                checkboxInversor.checked = true;
                aplicarInversaoTexto();
            }

            if (checkboxPromocao && estado.promocao) {
                checkboxPromocao.checked = true;
                aplicarPromocao();
            }

            if (checkboxEditavel && estado.editavel) {
                checkboxEditavel.checked = true;
                tornarValoresEditaveis();
            }

            if (checkboxCustomizado && estado.customizado) {
                checkboxCustomizado.checked = true;
                aplicarTextoCustomizado();

                // Restaurar conteúdo customizado
                if (estado.textoCustomizado) {
                    setTimeout(() => {
                        const divCustomizada = document.getElementById('div-customizada');
                        if (divCustomizada) {
                            divCustomizada.innerHTML = estado.textoCustomizado;
                        }
                    }, 200);
                }
            }

            // Restaurar visibilidade das seções
            if (estado.secoesOcultas) {
                estado.secoesOcultas.forEach(idSecao => {
                    const grupoSecao = document.querySelector(`[data-id-secao="${idSecao}"]`);
                    const itemMenu = document.querySelector(`.item-secao[data-id-secao="${idSecao}"] .checkbox-visibilidade`);

                    if (grupoSecao) {
                        grupoSecao.classList.add('oculto');
                    }
                    if (itemMenu) {
                        itemMenu.checked = false;
                        itemMenu.closest('.item-secao').classList.add('secao-oculta');
                    }
                });
            }

            // Restaurar ordem das seções
            if (estado.ordemSecoes) {
                setTimeout(() => restaurarOrdemSecoes(estado.ordemSecoes), 400);
            }

        } catch (e) {
            console.error('Erro ao restaurar estado:', e);
        }
    }

    function restaurarOrdemSecoes(ordemSecoes) {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) return;

        const divVeiculo = containerPagina.querySelector('.veiculo, .grupo-secao[data-id-secao="secao-veiculo"]');
        let inserirApos = divVeiculo;

        ordemSecoes.forEach(idSecao => {
            const grupoSecao = document.querySelector(`[data-id-secao="${idSecao}"]`);
            if (grupoSecao && inserirApos && grupoSecao !== inserirApos) {
                inserirApos.parentNode.insertBefore(grupoSecao, inserirApos.nextSibling);
                inserirApos = grupoSecao;
            }
        });

        // Atualizar ordem do menu também
        atualizarOrdemMenu();
    }

    function removerZIndexCorpo() {
        const divCorpo = document.querySelector('div.corpo');
        if (divCorpo) {
            divCorpo.style.zIndex = 'auto';
        }
    }

    function adicionarEstilos() {
        // Remover estilos anteriores se existirem
        const estiloAnterior = document.getElementById('userscript-styles');
        if (estiloAnterior) {
            estiloAnterior.remove();
        }

        const estilo = document.createElement('style');
        estilo.id = 'userscript-styles';
        estilo.textContent = `
            .gerenciador-grupos {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 320px;
                max-height: 90vh;
                background: white;
                border: 2px solid ${CONFIG.cores.principal};
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 12px;
            }

            .cabecalho-gerenciador {
                background: ${CONFIG.cores.principal};
                color: ${CONFIG.cores.textoClaro};
                padding: 10px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 24px;
            }

            .conteudo-gerenciador {
                padding: 10px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .container-opcoes {
                padding: 10px;
                border-top: 1px solid ${CONFIG.cores.cinzaMedio};
                background: #f9f9f9;
            }

            .container-opcoes label {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 8px;
            }

            .container-opcoes input[type="checkbox"] {
                margin-right: 8px;
            }

            .opcao-com-campo {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }

            .opcao-com-campo label {
                margin-bottom: 0;
                margin-right: 8px;
            }

            .linha-opcoes {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }

            .linha-opcoes label {
                margin-right: 15px;
                margin-bottom: 0;
            }

            .campo-tamanho-fonte, .campo-tamanho-fonte-customizado {
                width: 50px;
                padding: 2px 4px;
                border: 1px solid ${CONFIG.cores.cinzaMedio};
                border-radius: 2px;
                font-size: 11px;
            }

            .cabecalho-promocao {
                font-family: Arial !important;
                font-weight: bold !important;
                background: ${CONFIG.cores.principal} !important;
                padding: 10px !important;
                text-align: center !important;
                margin-bottom: 10px !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                cursor: text !important;
                outline: 2px dashed transparent !important;
                transition: border-color 0.2s ease !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                white-space: normal !important;
                overflow-wrap: break-word !important;
                hyphens: auto !important;
            }

            .cabecalho-promocao:hover {
                outline-color: #007cba !important;
            }

            .cabecalho-promocao:focus {
                outline: none !important;
                border-color: ${CONFIG.cores.principal} !important;
                background: ${CONFIG.cores.principalEscura} !important;
            }

            .valor-editavel, .texto-editavel {
                cursor: text !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                white-space: normal !important;
                overflow-wrap: break-word !important;
                hyphens: auto !important;
            }

            .item-secao {
                background: ${CONFIG.cores.cinzaClaro};
                border: 1px solid ${CONFIG.cores.cinzaMedio};
                border-radius: 4px;
                margin: 5px 0;
                padding: 8px;
                cursor: move;
                display: flex;
                flex-direction: column;
            }

            .item-secao:hover {
                background: #e8e8e8;
            }

            .item-secao.arrastando {
                opacity: 0.5;
            }

            .linha-superior {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .titulo-secao {
                flex-grow: 1;
                font-weight: bold;
                margin-right: 10px;
            }

            .checkbox-visibilidade {
                margin-right: 8px;
            }

            .linha-controles {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .campo-fonte-h2, .campo-fonte-div {
                width: 40px;
                padding: 1px 3px;
                border: 1px solid ${CONFIG.cores.cinzaMedio};
                border-radius: 2px;
                font-size: 10px;
            }

            .item-secao.secao-oculta {
                opacity: 0.5;
                background: #f0f0f0;
            }

            .botao-minimizar {
                background: none;
                border: none;
                color: ${CONFIG.cores.textoClaro};
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                width: 20px;
                height: 20px;
            }

            .gerenciador-grupos.minimizado .conteudo-gerenciador {
                display: none;
            }

            .gerenciador-grupos.minimizado {
                height: auto;
            }

            .grupo-secao {
                outline: 2px dashed transparent;
                padding-left: 0.1px; /*layout quebra sem isso.*/
                margin: 0;
                cursor: grab;
                transition: all 0.2s ease;
                display: flow-root;
            }

            .grupo-secao:active {
                cursor: grabbing;
            }

            .grupo-secao:hover {
                outline-color: #007cba !important;
                background: rgba(0, 124, 186, 0.05) !important;
            }

            .grupo-secao.destacado {
                outline-color: #007cba;
                background: rgba(0, 124, 186, 0.1);
            }

            .grupo-secao.oculto {
                display: none !important;
            }

            .grupo-secao.arrastando {
                opacity: 0.7;
                transform: rotate(2deg);
                z-index: 1000;
            }

            .realcar-valor-total {
                background: ${CONFIG.cores.realce} !important;
                padding: 0;
            }

            .realcar-valor-total .titulo {
                display: none !important;
            }

            .realcar-valor-total .valor {
                float: none !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                font: bold 32px Arial !important;
            }

            .realcar-h3 {
                padding: 2px 0px !important;
                border-radius: 2px !important;
            }

            .span-destacado {
                background: ${CONFIG.cores.realce} !important;
                padding: 1px 4px !important;
                border-radius: 2px !important;
            }

            .texto-invertido {
                color: ${CONFIG.cores.textoClaro} !important;
            }

            .div-customizada {
                width: 350px;
                border: 1px solid ${CONFIG.cores.textoEscuro};
                background-color: ${CONFIG.cores.principal} !important;
                padding: 10px;
                float: right;
                min-height: 100px;
                cursor: text;
                color: ${CONFIG.cores.textoEscuro};
                font-family: Arial, sans-serif !important;
                line-height: 1.4;
                word-wrap: break-word !important;
                word-break: break-word !important;
                white-space: normal !important;
                overflow-wrap: break-word !important;
                hyphens: auto !important;
                /* Prevent horizontal overflow */
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }

            .div-customizada * {
                font-family: inherit !important;
            }

            .div-customizada:empty::before {
                content: "Clique aqui para adicionar seu texto personalizado...";
                color: #666;
                font-style: italic;
            }

            .div-customizada:focus {
                outline: 2px solid ${CONFIG.cores.principalEscura};
                outline-offset: 2px;
            }

            .div-original-oculta {
                display: none !important;
            }

            .botao-novo-grupo {
                background: ${CONFIG.cores.principal};
                color: ${CONFIG.cores.textoClaro};
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                width: 100%;
                margin-top: 10px;
            }

            .botao-novo-grupo:hover {
                background: ${CONFIG.cores.principalEscura};
            }

            .grupo-novo h2 {
                font: bold ${CONFIG.estadosPadrao.tamanhoFonteH2}px Arial !important;
                background: #eeeeee !important;
                padding: 5px !important;
                display: block !important;
                clear: both !important;
                cursor: text !important;
            }

            .grupo-novo .conteudo-versao {
                border: 1px solid #EEE !important;
                font: normal ${CONFIG.estadosPadrao.tamanhoFonteDiv}px Arial !important;
                padding: 5px !important;
                text-align: justify !important;
                cursor: text !important;
                min-height: 50px !important;
            }

            .grupo-novo h2:empty::before {
                content: "Clique aqui para editar o título...";
                color: #888;
                font-style: italic;
            }

            .grupo-novo .conteudo-versao:empty::before {
                content: "Clique aqui para editar o conteúdo...";
                color: #888;
                font-style: italic;
            }
        `;
        document.head.appendChild(estilo);
    }

    function criarMenuFlutuante() {
        // Remover menu anterior se existir
        const menuAnterior = document.getElementById('gerenciador-grupos');
        if (menuAnterior) {
            menuAnterior.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'gerenciador-grupos';
        menu.id = 'gerenciador-grupos';
        menu.innerHTML = `
            <div class="cabecalho-gerenciador">
                <span>Grupos</span>
                <button class="botao-minimizar">−</button>
            </div>
            <div class="conteudo-gerenciador">
                <div class="lista-grupos"></div>
                <button class="botao-novo-grupo">+ Novo Grupo</button>
                <div class="container-opcoes">
                    <div class="linha-opcoes">
                        <label>
                            <input type="checkbox" class="checkbox-realcar" ${CONFIG.estadosPadrao.realcar ? 'checked' : ''}> Realçar
                        </label>
                        <label>
                            <input type="checkbox" class="checkbox-inversor-texto" ${CONFIG.estadosPadrao.invertorTexto ? 'checked' : ''}> Inverter cor do texto
                        </label>
                    </div>
                    <div class="opcao-com-campo">
                        <label>
                            <input type="checkbox" class="checkbox-promocao" ${CONFIG.estadosPadrao.promocao ? 'checked' : ''}> Promoção
                        </label>
                        <input type="number" class="campo-tamanho-fonte" value="${CONFIG.estadosPadrao.tamanhoFontePromocao}" min="8" max="72" title="Tamanho da fonte">
                    </div>
                    <label>
                        <input type="checkbox" class="checkbox-editavel" ${CONFIG.estadosPadrao.editavel ? 'checked' : ''}> Valores Editáveis
                    </label>
                    <div class="opcao-com-campo">
                        <label>
                            <input type="checkbox" class="checkbox-customizado" ${CONFIG.estadosPadrao.customizado ? 'checked' : ''}> Texto Customizado
                        </label>
                        <input type="number" class="campo-tamanho-fonte-customizado" value="${CONFIG.estadosPadrao.tamanhoFonteCustomizado}" min="8" max="48" title="Tamanho da fonte">
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        // Torna o menu arrastável
        tornarArrastavel(menu, menu.querySelector('.cabecalho-gerenciador'));

        // Adicionar event listeners
        adicionarEventListeners(menu);
    }

    function adicionarEventListeners(menu) {
        // Funcionalidade minimizar/maximizar
        menu.querySelector('.botao-minimizar').addEventListener('click', function() {
            menu.classList.toggle('minimizado');
            this.textContent = menu.classList.contains('minimizado') ? '+' : '−';
        });

        // Botão novo grupo
        menu.querySelector('.botao-novo-grupo').addEventListener('click', criarNovoGrupo);

        // Funcionalidades dos checkboxes
        menu.querySelector('.checkbox-realcar').addEventListener('change', function() {
            if (this.checked) {
                aplicarRealce();
            } else {
                removerRealce();
            }
        });

        menu.querySelector('.checkbox-inversor-texto').addEventListener('change', function() {
            if (this.checked) {
                aplicarInversaoTexto();
            } else {
                removerInversaoTexto();
            }
        });

        menu.querySelector('.checkbox-promocao').addEventListener('change', function() {
            if (this.checked) {
                aplicarPromocao();
            } else {
                removerPromocao();
            }
        });

        menu.querySelector('.campo-tamanho-fonte').addEventListener('input', function() {
            const checkboxPromocao = menu.querySelector('.checkbox-promocao');
            if (checkboxPromocao.checked) {
                atualizarTamanhoFontePromocao(this.value);
            }
        });

        menu.querySelector('.checkbox-editavel').addEventListener('change', function() {
            if (this.checked) {
                tornarValoresEditaveis();
            } else {
                removerValoresEditaveis();
            }
        });

        menu.querySelector('.checkbox-customizado').addEventListener('change', function() {
            if (this.checked) {
                aplicarTextoCustomizado();
            } else {
                removerTextoCustomizado();
            }
        });

        menu.querySelector('.campo-tamanho-fonte-customizado').addEventListener('input', function() {
            const checkboxCustomizado = menu.querySelector('.checkbox-customizado');
            if (checkboxCustomizado.checked) {
                atualizarTamanhoFonteCustomizado(this.value);
            }
        });
    }

    function criarNovoGrupo() {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) return;

        const novoId = 'secao-novo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Criar o wrapper do grupo
        const wrapper = document.createElement('div');
        wrapper.className = 'grupo-secao grupo-novo';
        wrapper.dataset.idSecao = novoId;

        // Criar o H2 editável
        const h2 = document.createElement('h2');
        h2.contentEditable = true;
        h2.style.font = `bold ${CONFIG.estadosPadrao.tamanhoFonteH2}px Arial`;
        h2.style.background = '#eeeeee';
        h2.style.padding = '5px';
        h2.style.display = 'block';
        h2.style.clear = 'both';
        h2.style.cursor = 'text';
        h2.classList.add('texto-editavel', 'novo-grupo-h2');

        // Criar a div de conteúdo editável
        const divConteudo = document.createElement('div');
        divConteudo.className = 'conteudo-versao';
        divConteudo.contentEditable = true;
        divConteudo.style.border = '1px solid #EEE';
        divConteudo.style.font = `normal ${CONFIG.estadosPadrao.tamanhoFonteDiv}px Arial`;
        divConteudo.style.padding = '5px';
        divConteudo.style.textAlign = 'justify';
        divConteudo.style.cursor = 'text';
        divConteudo.style.minHeight = '50px';
        divConteudo.classList.add('texto-editavel', 'novo-grupo-div');

        // Parágrafo em branco, replicando o espaçamento usado na página
        const pWhitespace = document.createElement('p');
        pWhitespace.innerHTML = '&nbsp;';
        pWhitespace.style.margin = '0';
        pWhitespace.style.padding = '0';

        // Adicionar elementos ao wrapper
        wrapper.appendChild(h2);
        wrapper.appendChild(divConteudo);
        wrapper.appendChild(pWhitespace);

        // Inserir no final da página
        containerPagina.appendChild(wrapper);

        // Verificar se realçar está ativo e aplicar ao novo grupo
        const checkboxRealcar = document.querySelector('.checkbox-realcar');
        if (checkboxRealcar && checkboxRealcar.checked) {
            // Aplicar realce ao H2 do novo grupo
            if (!h2.dataset.textoOriginal) {
                const textoOriginal = h2.textContent || '';
                h2.innerHTML = `<span class="span-destacado">${textoOriginal}</span>`;
                h2.dataset.textoOriginal = textoOriginal;
            }
        }

        // Criar item no menu
        const secao = {
            id: novoId,
            titulo: 'Novo Grupo',
            elementos: [h2, divConteudo],
            indiceOriginal: containerPagina.children.length - 1
        };

        adicionarItemMenu(secao);

        // Focar no título para edição
        setTimeout(() => {
            h2.focus();
        }, 100);

        // Salvar estado
        salvarEstado();
    }

    //Quebra de página abaixo da assinatura da loja
    function ocultarH2VaziosComQuebraPagina() {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) return;

        const todosH2s = containerPagina.querySelectorAll('h2');
        todosH2s.forEach(h2 => {
            const temQuebraPagina = h2.style.cssText.includes('page-break') ||
                                    h2.style.pageBreakBefore === 'always' ||
                                    h2.getAttribute('style')?.includes('page-break');
            const estaVazio = !h2.textContent.trim();
            const naoEstaEmGrupoSecao = !h2.closest('.grupo-secao');

            if (temQuebraPagina && estaVazio && naoEstaEmGrupoSecao) {
                h2.style.display = 'none';
                h2.style.visibility = 'hidden';
                h2.hidden = true;
            }
        });
    }

    function configurarObservadorMutacao() {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) return;

        // Desconectar observador anterior se existir
        if (window.observadorMutacao) {
            window.observadorMutacao.disconnect();
        }

        window.observadorMutacao = new MutationObserver(function(mutacoes) {
            mutacoes.forEach(function(mutacao) {
                if (mutacao.type === 'childList') {
                    mutacao.addedNodes.forEach(function(no) {
                        if (no.nodeType === Node.ELEMENT_NODE) {
                            const h2s = no.tagName === 'H2' ? [no] : no.querySelectorAll?.('h2') || [];

                            h2s.forEach(h2 => {
                                const temQuebraPagina = h2.style.cssText.includes('page-break') ||
                                                        h2.style.pageBreakBefore === 'always' ||
                                                        h2.getAttribute('style')?.includes('page-break');
                                const estaVazio = !h2.textContent.trim();

                                if (temQuebraPagina && estaVazio) {
                                    h2.style.display = 'none';
                                    h2.style.visibility = 'hidden';
                                    h2.hidden = true;
                                }
                            });
                        }
                    });
                }
            });
        });

        window.observadorMutacao.observe(containerPagina, { childList: true, subtree: true });
        window.observadorMutacao.observe(document.body, { childList: true, subtree: true });
    }

    function tornarGruposSecoesArrastaveis() {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) return;

        // Destruir instância anterior se existir
        if (window.sortableInstance) {
            window.sortableInstance.destroy();
        }

        window.sortableInstance = new Sortable(containerPagina, {
            group: 'grupos',
            animation: 150,
            handle: '.grupo-secao',
            filter: '.header:not(.grupo-secao), .veiculo:not(.grupo-secao)',
            ghostClass: 'arrastando',
            onStart: function(evt) {
                evt.item.classList.add('arrastando');
            },
            onEnd: function(evt) {
                evt.item.classList.remove('arrastando');
                atualizarOrdemMenu();
                salvarEstado();
            },
            onMove: function(evt) {
                return evt.dragged.classList.contains('grupo-secao');
            }
        });
    }

    function atualizarOrdemMenu() {
        const containerPagina = document.getElementById('Pagina');
        const gruposSecao = Array.from(containerPagina.querySelectorAll('.grupo-secao'));
        const listaSecoes = document.querySelector('.lista-grupos');
        if (!listaSecoes) return;

        const itensMenu = Array.from(listaSecoes.children);

        const ordemDOM = {};
        gruposSecao.forEach((grupo, indice) => {
            const idSecao = grupo.dataset.idSecao;
            if (idSecao) {
                ordemDOM[idSecao] = indice;
            }
        });

        itensMenu.sort((a, b) => {
            const indiceA = ordemDOM[a.dataset.idSecao] ?? 999;
            const indiceB = ordemDOM[b.dataset.idSecao] ?? 999;
            return indiceA - indiceB;
        });

        listaSecoes.innerHTML = '';
        itensMenu.forEach(item => {
            listaSecoes.appendChild(item);
        });
    }

    function tornarArrastavel(elemento, alca) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        alca.onmousedown = iniciarArraste;

        function iniciarArraste(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = pararArraste;
            document.onmousemove = arrastarElemento;
        }

        function arrastarElemento(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elemento.style.top = (elemento.offsetTop - pos2) + "px";
            elemento.style.left = (elemento.offsetLeft - pos1) + "px";
            elemento.style.right = 'auto';
        }

        function pararArraste() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function escanearEAgruparSecoes() {
        const containerPagina = document.getElementById('Pagina');
        if (!containerPagina) {
            console.error('Container da página não encontrado');
            return;
        }

        console.log('Escaneando e agrupando seções...');
        const grupos = [];

        // Primeiro, processar .header e .veiculo como grupos especiais
        const headerElement = containerPagina.querySelector('.header');
        const veiculoElement = containerPagina.querySelector('.veiculo');

        if (headerElement && !headerElement.classList.contains('grupo-secao')) {
            headerElement.classList.add('grupo-secao');
            headerElement.dataset.idSecao = 'secao-header';
            grupos.push({
                id: 'secao-header',
                titulo: 'Cabeçalho',
                elementos: [headerElement],
                indiceOriginal: Array.from(containerPagina.children).indexOf(headerElement)
            });
        }

        if (veiculoElement && !veiculoElement.classList.contains('grupo-secao')) {
            veiculoElement.classList.add('grupo-secao');
            veiculoElement.dataset.idSecao = 'secao-veiculo';
            grupos.push({
                id: 'secao-veiculo',
                titulo: 'Veículo',
                elementos: [veiculoElement],
                indiceOriginal: Array.from(containerPagina.children).indexOf(veiculoElement)
            });
        }

        // Verificar grupos existentes que podem estar bem formados
        const gruposExistentes = containerPagina.querySelectorAll('.grupo-secao');
        gruposExistentes.forEach(grupo => {
            if (grupo.dataset.idSecao && grupo.children.length > 0 &&
                !grupo.dataset.idSecao.includes('header') && !grupo.dataset.idSecao.includes('veiculo')) {

                const titulo = grupo.querySelector('h2')?.textContent.trim() ||
                             (grupo.classList.contains('assinatura-loja') ? 'Assinatura Loja' :
                              grupo.classList.contains('grupo-novo') ? 'Novo Grupo' : 'Seção');

                grupos.push({
                    id: grupo.dataset.idSecao,
                    titulo: titulo,
                    elementos: Array.from(grupo.children),
                    indiceOriginal: Array.from(containerPagina.children).indexOf(grupo)
                });
            }
        });

        // Processar elementos restantes que não estão em grupos
        const elementos = Array.from(containerPagina.children);
        for (let i = 0; i < elementos.length; i++) {
            const elemento = elementos[i];

            // Pular elementos que já estão em grupos ou são grupos especiais
            if (elemento.classList.contains('grupo-secao') ||
                elemento.classList.contains('header') ||
                elemento.classList.contains('veiculo')) {
                continue;
            }

            if (elemento.classList && elemento.classList.contains('assinatura-loja')) {
                processarAssinaturaLoja(elemento, i, grupos);
                continue;
            }

            if (elemento.tagName === 'H2') {
                const textoTitulo = elemento.textContent.trim();

                if (!textoTitulo) {
                    continue;
                }

                const secao = {
                    id: 'secao-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substr(2, 9),
                    titulo: textoTitulo,
                    elementos: [elemento],
                    indiceOriginal: i
                };

                const wrapper = document.createElement('div');
                wrapper.className = 'grupo-secao';
                wrapper.dataset.idSecao = secao.id;

                elemento.parentNode.insertBefore(wrapper, elemento);
                wrapper.appendChild(elemento);

                let proximoIndice = i + 1;
                while (proximoIndice < elementos.length) {
                    const proximoElemento = elementos[proximoIndice];

                    if (proximoElemento.tagName === 'H2' ||
                        (proximoElemento.classList && (proximoElemento.classList.contains('assinatura-loja') ||
                         proximoElemento.classList.contains('grupo-secao') ||
                         proximoElemento.classList.contains('header') ||
                         proximoElemento.classList.contains('veiculo')))) {
                        break;
                    }

                    if ((proximoElemento.tagName === 'DIV' || proximoElemento.tagName === 'P') &&
                        !proximoElemento.classList.contains('grupo-secao')) {
                        secao.elementos.push(proximoElemento);
                        wrapper.appendChild(proximoElemento);
                    }
                    proximoIndice++;
                }

                grupos.push(secao);
            }
        }

        grupos.sort((a, b) => a.indiceOriginal - b.indiceOriginal);
        criarItensMenuSecao(grupos);
    }

    function processarAssinaturaLoja(elemento, indice, grupos) {
        if (elemento.parentElement.classList.contains('grupo-secao')) {
            return;
        }

        const secao = {
            id: 'secao-assinatura-loja',
            titulo: 'Assinatura Loja',
            elementos: [elemento],
            indiceOriginal: indice
        };

        const wrapper = document.createElement('div');
        wrapper.className = 'grupo-secao';
        wrapper.dataset.idSecao = secao.id;

        elemento.parentNode.insertBefore(wrapper, elemento);
        wrapper.appendChild(elemento);

        grupos.push(secao);
    }

    function criarItensMenuSecao(grupos) {
        const listaSecoes = document.querySelector('.lista-grupos');
        if (!listaSecoes) return;

        listaSecoes.innerHTML = '';
        grupos.sort((a, b) => a.indiceOriginal - b.indiceOriginal);

        grupos.forEach((secao) => {
            adicionarItemMenu(secao);
        });

        // Destruir instância anterior se existir
        if (window.sortableMenuInstance) {
            window.sortableMenuInstance.destroy();
        }

        window.sortableMenuInstance = new Sortable(listaSecoes, {
            animation: 150,
            ghostClass: 'arrastando',
            onEnd: reordenarSecoes
        });
    }

    function adicionarItemMenu(secao) {
        const listaSecoes = document.querySelector('.lista-grupos');
        if (!listaSecoes) return;

        const item = document.createElement('div');
        item.className = 'item-secao';
        item.dataset.idSecao = secao.id;

        // Não mostrar controles de fonte para header e veiculo
        const grupoSemAjusteFonte = secao.id.includes('header') || secao.id.includes('veiculo') || secao.id.includes('assinatura');

        item.innerHTML = `
            <div class="linha-superior">
                <input type="checkbox" class="checkbox-visibilidade" checked>
                <span class="titulo-secao">${secao.titulo}</span>
            </div>
            ${!grupoSemAjusteFonte ? `
            <div class="linha-controles">
                <span style="font-size: 10px;">Título:</span>
                <input type="number" class="campo-fonte-h2" value="${CONFIG.estadosPadrao.tamanhoFonteH2}" min="6" max="48" title="Tamanho fonte H2">
                <span style="font-size: 10px;">Texto:</span>
                <input type="number" class="campo-fonte-div" value="${CONFIG.estadosPadrao.tamanhoFonteDiv}" min="6" max="32" title="Tamanho fonte Div">
            </div>` : ''}
        `;

        const checkbox = item.querySelector('.checkbox-visibilidade');
        checkbox.addEventListener('change', () => alternarVisibilidadeSecao(secao.id, checkbox));

        if (!grupoSemAjusteFonte) {
            const campoH2 = item.querySelector('.campo-fonte-h2');
            const campoDiv = item.querySelector('.campo-fonte-div');

            campoH2.addEventListener('input', () => {
                aplicarTamanhoFonteSecao(secao.id, campoH2.value, campoDiv.value);
                salvarEstado();
            });

            campoDiv.addEventListener('input', () => {
                aplicarTamanhoFonteSecao(secao.id, campoH2.value, campoDiv.value);
                salvarEstado();
            });
        }

        item.addEventListener('mouseenter', () => {
            const grupoSecao = document.querySelector(`[data-id-secao="${secao.id}"]`);
            if (grupoSecao) grupoSecao.classList.add('destacado');
        });

        item.addEventListener('mouseleave', () => {
            const grupoSecao = document.querySelector(`[data-id-secao="${secao.id}"]`);
            if (grupoSecao) grupoSecao.classList.remove('destacado');
        });

        listaSecoes.appendChild(item);
    }

    function aplicarTamanhoFonteSecao(idSecao, tamanhoH2, tamanhoDiv) {
        const grupoSecao = document.querySelector(`[data-id-secao="${idSecao}"]`);
        if (!grupoSecao) return;

        // Aplicar tamanho ao H2 com !important
        const h2 = grupoSecao.querySelector('h2');
        if (h2) {
            h2.style.setProperty('font-size', tamanhoH2 + 'px', 'important');
        }

        // Aplicar tamanho às divs de conteúdo com !important
        const divs = grupoSecao.querySelectorAll('div:not(.grupo-secao)');
        divs.forEach(div => {
            if (!div.classList.contains('grupo-secao')) {
                div.style.setProperty('font-size', tamanhoDiv + 'px', 'important');
            }
        });
    }

    function reordenarSecoes() {
        const listaSecoes = document.querySelector('.lista-grupos');
        if (!listaSecoes) return;

        const itens = Array.from(listaSecoes.children);
        const containerPagina = document.getElementById('Pagina');

        const novaOrdem = itens.map(item => item.dataset.idSecao);

        // Encontrar ponto de inserção (após veiculo ou header)
        const divVeiculo = containerPagina.querySelector('.grupo-secao[data-id-secao="secao-veiculo"], .veiculo');
        const divHeader = containerPagina.querySelector('.grupo-secao[data-id-secao="secao-header"], .header');
        let inserirApos = divVeiculo || divHeader;

        novaOrdem.forEach(idSecao => {
            const grupoSecao = document.querySelector(`[data-id-secao="${idSecao}"]`);
            if (grupoSecao && inserirApos && grupoSecao !== inserirApos &&
                !idSecao.includes('header') && !idSecao.includes('veiculo')) {
                inserirApos.parentNode.insertBefore(grupoSecao, inserirApos.nextSibling);
                inserirApos = grupoSecao;
            }
        });

        salvarEstado();
    }

    function aplicarRealce() {
        // Realçar VALOR TOTAL
        const todosLis = document.querySelectorAll('.valores li');
        for (let li of todosLis) {
            const titulo = li.querySelector('.titulo');
            if (titulo && titulo.textContent.includes('VALOR TOTAL')) {
                li.classList.add('realcar-valor-total');
                break;
            }
        }

        // Realçar h3 em .veiculo
        const veiculoH3 = document.querySelector('.veiculo h3, .grupo-secao[data-id-secao="secao-veiculo"] h3');
        if (veiculoH3 && !veiculoH3.dataset.textoOriginal) {
            const textoOriginal = veiculoH3.textContent;
            veiculoH3.innerHTML = `<span class="span-destacado">${textoOriginal}</span>`;
            veiculoH3.dataset.textoOriginal = textoOriginal;
            veiculoH3.classList.add('realcar-h3');
        }

        // Realçar todos os h2s em .grupo-secao
        const h2sSecoes = document.querySelectorAll('.grupo-secao h2');
        h2sSecoes.forEach(h2 => {
            if (!h2.dataset.textoOriginal) {
                const textoOriginal = h2.textContent;
                h2.innerHTML = `<span class="span-destacado">${textoOriginal}</span>`;
                h2.dataset.textoOriginal = textoOriginal;
            }
        });
    }

    function removerRealce() {
        document.querySelectorAll('.realcar-valor-total').forEach(el => {
            el.classList.remove('realcar-valor-total');
        });

        document.querySelectorAll('.realcar-h3').forEach(el => {
            el.classList.remove('realcar-h3');
            if (el.dataset.textoOriginal) {
                el.textContent = el.dataset.textoOriginal;
                delete el.dataset.textoOriginal;
            }
        });

        document.querySelectorAll('.grupo-secao h2').forEach(h2 => {
            if (h2.dataset.textoOriginal) {
                h2.textContent = h2.dataset.textoOriginal;
                delete h2.dataset.textoOriginal;
            }
        });
    }

    function aplicarInversaoTexto() {
        // Aplicar inversão em elementos com realce
        const elementosRealcados = document.querySelectorAll('.span-destacado, .realcar-valor-total .valor, .cabecalho-promocao');
        elementosRealcados.forEach(el => {
            el.classList.add('texto-invertido');
        });
    }

    function removerInversaoTexto() {
        document.querySelectorAll('.texto-invertido').forEach(el => {
            el.classList.remove('texto-invertido');
        });
    }

    function aplicarPromocao() {
        const tituloVeiculo = document.querySelector('.veiculo h1, .grupo-secao[data-id-secao="secao-veiculo"] h1');
        const dataVeiculo = document.querySelector('.veiculo p, .grupo-secao[data-id-secao="secao-veiculo"] p');
        const tamanhoFonte = document.querySelector('.campo-tamanho-fonte').value;

        if (tituloVeiculo && !tituloVeiculo.dataset.textoOriginal) {
            tituloVeiculo.dataset.textoOriginal = tituloVeiculo.innerHTML;
            const spanPromocao = document.createElement('span');
            spanPromocao.className = 'cabecalho-promocao';
            spanPromocao.contentEditable = true;
            spanPromocao.textContent = 'PROMOÇÃO';
            // Use setProperty with !important instead of style.fontSize
            spanPromocao.style.setProperty('font-size', tamanhoFonte + 'px', 'important');

            tituloVeiculo.innerHTML = '';
            tituloVeiculo.appendChild(spanPromocao);
        }

        if (dataVeiculo) {
            dataVeiculo.dataset.displayOriginal = dataVeiculo.style.display;
            dataVeiculo.style.display = 'none';
        }
    }

    function atualizarTamanhoFontePromocao(tamanho) {
        const spanPromocao = document.querySelector('.cabecalho-promocao');
        if (spanPromocao) {
            spanPromocao.style.fontSize = tamanho + 'px';
        }
    }

    function removerPromocao() {
        const tituloVeiculo = document.querySelector('.veiculo h1, .grupo-secao[data-id-secao="secao-veiculo"] h1');
        const dataVeiculo = document.querySelector('.veiculo p, .grupo-secao[data-id-secao="secao-veiculo"] p');

        if (tituloVeiculo && tituloVeiculo.dataset.textoOriginal) {
            tituloVeiculo.innerHTML = tituloVeiculo.dataset.textoOriginal;
            delete tituloVeiculo.dataset.textoOriginal;
        }

        if (dataVeiculo) {
            dataVeiculo.style.display = dataVeiculo.dataset.displayOriginal || '';
            delete dataVeiculo.dataset.displayOriginal;
        }
    }

    function aplicarTextoCustomizado() {
        // Verificar se já existe uma div customizada
        if (document.getElementById('div-customizada')) {
            console.log('Div customizada já existe');
            return;
        }

        const divOriginal = document.querySelector('div[style*="width: 350px"][style*="border: 1px solid #000000"]');
        if (!divOriginal) {
            console.log('Div original não encontrada');
            return;
        }

        // Ocultar div original
        divOriginal.classList.add('div-original-oculta');
        divOriginal.dataset.estaOculta = 'true';

        // Criar div customizada vazia e editável
        const divCustomizada = document.createElement('div');
        divCustomizada.className = 'div-customizada';
        divCustomizada.id = 'div-customizada';
        divCustomizada.contentEditable = true;

        const tamanhoFonte = document.querySelector('.campo-tamanho-fonte-customizado').value;
        divCustomizada.style.fontSize = tamanhoFonte + 'px';

        // Adicionar eventos para melhor experiência de edição
        divCustomizada.addEventListener('keydown', function(e) {
            // Permitir Enter para quebras de linha
            if (e.key === 'Enter') {
                // Não previne o comportamento padrão, permite quebras de linha
            }
        });

        divCustomizada.addEventListener('paste', function(e) {
            // Permitir colar texto com formatação HTML
            e.preventDefault();
            const clipboardData = (e.originalEvent || e).clipboardData;
            let pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');

            // Se for texto simples, permitir HTML básico
            if (!clipboardData.getData('text/html')) {
                // Converter quebras de linha simples em <br>
                pastedData = pastedData.replace(/\n/g, '<br>');
            }

            document.execCommand('insertHTML', false, pastedData);
        });

        // Inserir após a div original
        divOriginal.parentNode.insertBefore(divCustomizada, divOriginal.nextSibling);

        // Focar na div para indicar que está editável
        setTimeout(() => {
            divCustomizada.focus();
        }, 100);
    }

    function atualizarTamanhoFonteCustomizado(tamanho) {
        const divCustomizada = document.getElementById('div-customizada');
        if (divCustomizada) {
            divCustomizada.style.fontSize = tamanho + 'px';

            // Forçar aplicação do tamanho da fonte em todos os elementos filhos
            const elementosFilhos = divCustomizada.querySelectorAll('*');
            elementosFilhos.forEach(el => {
                el.style.fontSize = tamanho + 'px';
            });

            // Aplicar ao próprio elemento também
            divCustomizada.style.setProperty('font-size', tamanho + 'px', 'important');
        }
    }

    function removerTextoCustomizado() {
        // Remover TODAS as divs customizadas
        const divsCustomizadas = document.querySelectorAll('.div-customizada');
        divsCustomizadas.forEach(div => div.remove());

        // Restaurar TODAS as divs originais ocultas
        const divsOriginais = document.querySelectorAll('div[style*="width: 350px"][style*="border: 1px solid #000000"]');
        divsOriginais.forEach(divOriginal => {
            if (divOriginal.dataset.estaOculta) {
                divOriginal.classList.remove('div-original-oculta');
                delete divOriginal.dataset.estaOculta;
            }
        });
    }

    function tornarValoresEditaveis() {
        // Tornar valores editáveis
        const elementosValor = document.querySelectorAll('.valores .valor');
        elementosValor.forEach(valor => {
            valor.contentEditable = true;
            valor.classList.add('valor-editavel');
        });

        // Tornar outros elementos editáveis (h1, h2, h3, divs, p, etc.)
        const elementosTexto = document.querySelectorAll('h1, h2, h3, h4, h5, h6, div, p, span, div');
        elementosTexto.forEach(elemento => {
            // Excluir elementos do script e elementos já processados
            if (!elemento.closest('.gerenciador-grupos') &&
                !elemento.classList.contains('grupo-secao'))/* &&
                !elemento.contentEditable === 'true')*/ {

                elemento.contentEditable = true;
                elemento.classList.add('texto-editavel');
            }
        });
    }

    function removerValoresEditaveis() {
        const elementosEditaveis = document.querySelectorAll('.valor-editavel, .texto-editavel');
        elementosEditaveis.forEach(elemento => {
            elemento.contentEditable = false;
            elemento.classList.remove('valor-editavel', 'texto-editavel');
        });
    }

    function alternarVisibilidadeSecao(idSecao, checkbox) {
        const grupoSecao = document.querySelector(`[data-id-secao="${idSecao}"]`);
        const itemMenu = checkbox.closest('.item-secao');

        if (grupoSecao) {
            if (checkbox.checked) {
                grupoSecao.classList.remove('oculto');
                itemMenu.classList.remove('secao-oculta');
            } else {
                grupoSecao.classList.add('oculto');
                itemMenu.classList.add('secao-oculta');
            }
        }

        salvarEstado();
    }

})();