// ==UserScript==
// @name         DealerBalancete
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ajusta a exibição do balancete
// @author       Igor Lima
// @license      MIT
// @match        http*://*.dealernetworkflow.com.br/ContabilidadeWF/aprc_reportingservices.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545998/DealerBalancete.user.js
// @updateURL https://update.greasyfork.org/scripts/545998/DealerBalancete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona estilos CSS para efeitos de hover e agrupamento
    const estilos = `
        <style id="estilos-agrupador-contas">
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&display=swap');
            .grupo-conta {
                transition: background-color 0.2s ease;
                cursor: pointer;
            }

            .conta-nivel-1 { /*border-left: 1px solid #e74c3c;*/ }
            .conta-nivel-2 { /*border-left: 1px solid #f39c12;*/ }
            .conta-nivel-3 { /*border-left: 1px solid #27ae60;*/ }
            .conta-nivel-4 { /*border-left: 1px solid #3498db;*/ }
            .conta-nivel-5 { /*border-left: 1px solid #9b59b6;*/ }
            .conta-nivel-6 { /*border-left: 1px solid #e67e22;*/ }

            .grupo-conta:hover {
                background-color: rgba(52, 152, 219, 0.1) !important;
            }

            .grupo-conta.destacado {
                background-color: rgba(52, 152, 219, 0.2) !important;
            }

            .grupo-conta.pai-destacado {
                background-color: rgba(46, 204, 113, 0.1) !important;
            }

            .grupo-conta.filho-destacado {
                background-color: rgba(241, 196, 15, 0.1) !important;
            }

            .info-conta {
                font-size: 0.8em;
                color: #666;
                margin-left: 10px;
            }

            #oReportCell {
                width: 90vw !important;
            }

            .r9,
            table {
                width: 90vw !important;
            }

            .r9 table td, #oReportCell table td div {
                font-size: 13pt;
                font-family: Atkinson Hyperlegible;
                text-align: left;
            }

            .r9 table tr td a,
            .r9 table tr td span {
                font-size: 12pt !important;
                font-weight: normal !important;
                /*text-decoration: underline;*/
                font-family: Atkinson Hyperlegible;
            }
        </style>
    `;

    // Injeta os estilos na página
    document.head.insertAdjacentHTML('beforeend', estilos);

    // Padrão regex para corresponder códigos de conta hierárquicos
    const padraoCodigoConta = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?$/;

    // Função para analisar código da conta e retornar informações da hierarquia
    function analisarCodigoConta(codigo) {
        const correspondencia = codigo.trim().match(padraoCodigoConta);
        if (!correspondencia) return null;

        const partes = [];
        for (let i = 1; i < correspondencia.length; i++) {
            if (correspondencia[i]) partes.push(correspondencia[i]);
        }

        return {
            completo: codigo.trim(),
            partes: partes,
            nivel: partes.length,
            pai: partes.length > 1 ? partes.slice(0, -1).join('.') : null
        };
    }

    // Função para verificar se uma conta é pai de outra
    function ehPaiDe(pai, filho) {
        return filho.completo.startsWith(pai.completo + '.');
    }

    // Função para obter todas as contas relacionadas (pais e filhos)
    function obterContasRelacionadas(contaAlvo, todasContas) {
        const relacionadas = {
            pais: [],
            filhos: [],
            irmaos: []
        };

        todasContas.forEach(conta => {
            if (conta.completo === contaAlvo.completo) return;

            // Verifica se é um pai
            if (contaAlvo.completo.startsWith(conta.completo + '.')) {
                relacionadas.pais.push(conta);
            }

            // Verifica se é um filho
            if (ehPaiDe(contaAlvo, conta)) {
                relacionadas.filhos.push(conta);
            }

            // Verifica se é irmão (mesmo pai)
            if (contaAlvo.pai && conta.pai === contaAlvo.pai) {
                relacionadas.irmaos.push(conta);
            }
        });

        return relacionadas;
    }

    // Função para processar a tabela do relatório
    function processarTabelaRelatorio() {
        const celulaRelatorio = document.getElementById('oReportCell');
        if (!celulaRelatorio) {
            console.log('Célula do relatório não encontrada, tentando novamente...');
            return false;
        }

        const tabelas = celulaRelatorio.querySelectorAll('table');
        if (tabelas.length === 0) {
            console.log('Nenhuma tabela encontrada na célula do relatório, tentando novamente...');
            return false;
        }

        const contas = [];
        const elementosContas = new Map();

        // Processa cada tabela para encontrar códigos de conta
        tabelas.forEach(tabela => {
            const linhas = tabela.querySelectorAll('tr');
            linhas.forEach(linha => {
                const celulas = linha.querySelectorAll('td');
                if (celulas.length > 0) {
                    const primeiraCelula = celulas[0];
                    const texto = primeiraCelula.textContent.trim();
                    const conta = analisarCodigoConta(texto);

                    if (conta) {
                        contas.push(conta);
                        elementosContas.set(conta.completo, {
                            elemento: linha,
                            celula: primeiraCelula,
                            conta: conta
                        });

                        // Adiciona classes CSS
                        linha.classList.add('grupo-conta');
                        linha.classList.add(`conta-${conta.completo.replace(/\./g, '-')}`);
                        linha.classList.add(`conta-nivel-${conta.nivel}`);

                        // Adiciona informações da conta à célula
                        //const info = document.createElement('span');
                        //info.className = 'info-conta';
                        //info.textContent = `(Nível ${conta.nivel})`;
                        //primeiraCelula.appendChild(info);
                    }
                }
            });
        });

        // Adiciona efeitos de hover e interações
        elementosContas.forEach((dados, codigoConta) => {
            const { elemento, conta } = dados;

            elemento.addEventListener('mouseenter', function() {
                // Limpa destaques anteriores
                document.querySelectorAll('.grupo-conta').forEach(el => {
                    el.classList.remove('destacado', 'pai-destacado', 'filho-destacado');
                });

                // Destaca elemento atual
                this.classList.add('destacado');

                // Obtém contas relacionadas
                const relacionadas = obterContasRelacionadas(conta, contas);

                // Destaca pais
                relacionadas.pais.forEach(contaPai => {
                    const elementoPai = elementosContas.get(contaPai.completo);
                    if (elementoPai) {
                        elementoPai.elemento.classList.add('pai-destacado');
                    }
                });

                // Destaca filhos
                relacionadas.filhos.forEach(contaFilho => {
                    const elementoFilho = elementosContas.get(contaFilho.completo);
                    if (elementoFilho) {
                        elementoFilho.elemento.classList.add('filho-destacado');
                    }
                });
            });

            elemento.addEventListener('mouseleave', function() {
                // Remove destaques após um pequeno atraso
                setTimeout(() => {
                    if (!document.querySelector('.grupo-conta:hover')) {
                        document.querySelectorAll('.grupo-conta').forEach(el => {
                            el.classList.remove('destacado', 'pai-destacado', 'filho-destacado');
                        });
                    }
                }, 100);
            });

            // Adiciona funcionalidade de clique para recolher/expandir
            elemento.addEventListener('click', function() {
                const relacionadas = obterContasRelacionadas(conta, contas);
                const estaRecolhido = this.dataset.recolhido === 'true';

                if (relacionadas.filhos.length > 0) {
                    relacionadas.filhos.forEach(contaFilho => {
                        const elementoFilho = elementosContas.get(contaFilho.completo);
                        if (elementoFilho) {
                            if (estaRecolhido) {
                                elementoFilho.elemento.style.display = '';
                            } else {
                                elementoFilho.elemento.style.display = 'none';
                            }
                        }
                    });

                    this.dataset.recolhido = !estaRecolhido;
                    this.style.fontWeight = estaRecolhido ? 'normal' : 'bold';
                }
            });
        });

        console.log(`Processadas ${contas.length} códigos de conta`);
        return true;
    }

    // Função para aguardar o relatório carregar e então processá-lo
    function inicializarQuandoPronto() {
        let tentativas = 0;
        const maxTentativas = 20;

        function tentarProcessar() {
            tentativas++;
            if (processarTabelaRelatorio()) {
                console.log('Agrupador de contas inicializado com sucesso');
            } else if (tentativas < maxTentativas) {
                setTimeout(tentarProcessar, 1000);
            } else {
                console.log('Falha ao inicializar agrupador de contas após tentativas máximas');
            }
        }

        tentarProcessar();
    }

    // Inicializa quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarQuandoPronto);
    } else {
        inicializarQuandoPronto();
    }

    // Também observa mudanças de conteúdo dinâmico
    const observador = new MutationObserver(function(mutacoes) {
        mutacoes.forEach(function(mutacao) {
            if (mutacao.type === 'childList' && mutacao.addedNodes.length > 0) {
                // Verifica se o conteúdo do relatório foi atualizado
                const celulaRelatorio = document.getElementById('oReportCell');
                if (celulaRelatorio && mutacao.target.contains && mutacao.target.contains(celulaRelatorio)) {
                    setTimeout(processarTabelaRelatorio, 500);
                }
            }
        });
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

})();