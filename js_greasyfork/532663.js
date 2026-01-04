// ==UserScript==
// @name         Utilidades SERE
// @namespace    https://www.sere.pr.gov.br/sere/
// @version      1.1.1
// @description  Algumas melhorias para o SERE. Esse script não é oficial, e os órgãos da educação não prestarão suporte para o mesmo. O uso deste script é por conta e risco do usuário.
// @author       João Barbosa
// @match        https://www.sere.pr.gov.br/sere/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532663/Utilidades%20SERE.user.js
// @updateURL https://update.greasyfork.org/scripts/532663/Utilidades%20SERE.meta.js
// ==/UserScript==

// Aviso sobre Uso de Dados:
// Este script destina-se apenas a usuários autorizados do sistema SERE.
// Os usuários devem cumprir todas as regulamentações de proteção de dados
// e políticas escolares aplicáveis ao acessar e exportar dados através deste script.
// O autor não assume nenhuma responsabilidade pelo uso não autorizado ou inadequado dos dados.

// SheetJS (xlsx.full.min.js) é utilizado sob a Licença Apache 2.0
// Ver: https://github.com/SheetJS/sheetjs
// Licença: http://www.apache.org/licenses/LICENSE-2.0

(function() {
    'use strict';

    // Estilos compartilhados
    GM_addStyle(`
        a[onclick*="AoClicarTurma("],
        a[href^="javascript:AoClicarTurma("],
        a[onclick*="AoClicarAluno("],
        a[href^="javascript:AoClicarAluno("] {
            cursor: pointer !important;
        }

        .linha-iframe {
            background-color: #f9f9f9 !important;
        }

        .linha-iframe td {
            padding: 10px !important;
        }

        .container-iframe {
            position: relative;
            border: 1px solid #ccc;
            width: 100%;
            height: 600px;
            overflow: hidden;
        }

        .alca-redimensionar {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            background: #ddd;
            cursor: nwse-resize;
        }

        .botao-expansor {
            font-family: monospace;
            cursor: pointer;
            color: #666;
            font-size: 0.9em;
            user-select: none;
            border-radius: 2px;
            margin-left: 0px;
        }

        .botao-exportar-docs {
            margin-left: 10px !important;
        }
    `);

    // ==============================================
    // Funções de Melhoria de Navegação
    // ==============================================

    function construirUrlAluno(cgm, numMatricula) {
        const formulario = document.createElement('form');
        formulario.method = 'post';
        formulario.action = 'https://www.sere.pr.gov.br/sere/escola/consultas/frm_pesq_consulta_padrao_aluno.jsp';

        const inputCgm = document.createElement('input');
        inputCgm.type = 'hidden';
        inputCgm.name = 'cgm';
        inputCgm.value = cgm;
        formulario.appendChild(inputCgm);

        const inputNumMatricula = document.createElement('input');
        inputNumMatricula.type = 'hidden';
        inputNumMatricula.name = 'numMatricula';
        inputNumMatricula.value = numMatricula;
        formulario.appendChild(inputNumMatricula);

        const inputCodTurma = document.createElement('input');
        inputCodTurma.type = 'hidden';
        inputCodTurma.name = 'codTurma';
        inputCodTurma.value = document.querySelector('input[name="codTurma"]')?.value || '';
        formulario.appendChild(inputCodTurma);

        const inputFuncao = document.createElement('input');
        inputFuncao.type = 'hidden';
        inputFuncao.name = 'funcao';
        inputFuncao.value = document.querySelector('input[name="funcao"]')?.value || 'ativa';
        formulario.appendChild(inputFuncao);

        const parametros = new URLSearchParams();
        for (const elemento of formulario.elements) {
            if (elemento.name) {
                parametros.append(elemento.name, elemento.value);
            }
        }
        return formulario.action + '?' + parametros.toString();
    }

    function tornarIframeRedimensionavel(containerIframe) {
        const alca = document.createElement('div');
        alca.className = 'alca-redimensionar';
        containerIframe.appendChild(alca);

        let redimensionando = false;

        alca.addEventListener('mousedown', (e) => {
            redimensionando = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!redimensionando) return;

            const retanguloContainer = containerIframe.getBoundingClientRect();
            const novaAltura = e.clientY - retanguloContainer.top;

            if (novaAltura > 200) {
                containerIframe.style.height = `${novaAltura}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            redimensionando = false;
        });
    }

    function adicionarExpansorInline(cgm, numMatricula, elementoLink) {
        const container = document.createElement('span');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.gap = '4px';

        elementoLink.parentNode.insertBefore(container, elementoLink);
        container.appendChild(elementoLink);

        const botaoToggle = document.createElement('span');
        botaoToggle.className = 'botao-expansor';
        botaoToggle.textContent = '[+]';
        container.appendChild(botaoToggle);

        botaoToggle.addEventListener('click', (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            const linha = elementoLink.closest('tr');
            if (!linha) return;

            const proximaLinha = linha.nextElementSibling;
            if (proximaLinha?.classList.contains('linha-iframe')) {
                proximaLinha.remove();
                botaoToggle.textContent = '[+]';
                return;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.className = 'linha-iframe';

            const celula = document.createElement('td');
            celula.colSpan = linha.querySelectorAll('td').length || 100;
            celula.style.padding = '10px';
            celula.style.position = 'relative';

            const containerIframe = document.createElement('div');
            containerIframe.className = 'container-iframe';

            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = construirUrlAluno(cgm, numMatricula);

            containerIframe.appendChild(iframe);
            celula.appendChild(containerIframe);
            novaLinha.appendChild(celula);
            linha.parentNode.insertBefore(novaLinha, linha.nextSibling);
            botaoToggle.textContent = '[-]';

            tornarIframeRedimensionavel(containerIframe);
        });
    }

    function modificarLinksTurma() {
        const links = document.querySelectorAll('a[onclick*="AoClicarTurma("], a[href^="javascript:AoClicarTurma("]');

        links.forEach(link => {
            link.style.cursor = 'pointer';

            const acaoOriginal = link.getAttribute('onclick') || link.getAttribute('href').replace('javascript:', '');

            link.removeAttribute('onclick');
            link.removeAttribute('href');

            link.addEventListener('click', function(e) {
                e.preventDefault();
                abrirNovaAbaTurma(acaoOriginal);
            });
        });
    }

function modificarLinksAluno() {
    const links = document.querySelectorAll('a[onclick*="AoClicarAluno("], a[href^="javascript:AoClicarAluno("]');

    links.forEach(link => {
        // Verifique se o link já foi modificado
        if (link.dataset.modificado === 'true') return;

        link.dataset.modificado = 'true';
        link.style.cursor = 'pointer';

        const acaoOriginal = link.getAttribute('onclick') || link.getAttribute('href').replace('javascript:', '');

        const parametros = acaoOriginal.match(/AoClicarAluno\((.*)\)/)[1].split(',');
        const cgm = parametros[0].trim().replace(/['"]/g, '');
        const numMatricula = parametros[1].trim().replace(/['"]/g, '');

        link.removeAttribute('onclick');
        link.removeAttribute('href');

        link.addEventListener('click', function(e) {
            e.preventDefault();
            abrirNovaAbaAluno(acaoOriginal);
        });

        adicionarExpansorInline(cgm, numMatricula, link);
    });
}
    function abrirNovaAbaTurma(acaoOriginal) {
        const formulario = document.createElement('form');
        formulario.method = 'post';
        formulario.action = 'https://www.sere.pr.gov.br/sere/escola/consultas/frm_pesq_consulta_padrao_turma2.jsp';
        formulario.target = '_blank';

        const parametros = acaoOriginal.match(/AoClicarTurma\((.*)\)/)[1].split(',');
        const nomesParametros = ['nmCurso', 'jsTurma', 'jsTurno', 'jsCurso', 'jsSeria', 'nmTurma', 'nmSeria', 'nmTurno', 'jsFormaOrganizCurso'];

        nomesParametros.forEach((nome, indice) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = nome === 'jsTurma' ? 'codTurma' :
                        nome === 'jsCurso' ? 'curso' :
                        nome === 'jsSeria' ? 'seriacao' :
                        nome === 'jsTurno' ? 'turno' :
                        nome === 'jsFormaOrganizCurso' ? 'codFormaOrganizacaoCurso' :
                        nome;
            input.value = parametros[indice].trim().replace(/['"]/g, '');
            formulario.appendChild(input);
        });

        const outrosInputs = [
            {name: 'nextForm', value: '../consultas/frm_pesq_consulta_padrao_turma2.jsp'},
            {name: 'tipoBusca', value: '0'},
            {name: 'nomeEscola', value: document.querySelector('input[name="nomeEscola"]')?.value || ''},
            {name: 'anoLetivo', value: document.querySelector('input[name="anoLetivo"]')?.value || ''},
            {name: 'ensino', value: document.querySelector('input[name="ensino"]')?.value || ''}
        ];

        outrosInputs.forEach(input => {
            const elemento = document.createElement('input');
            elemento.type = 'hidden';
            elemento.name = input.name;
            elemento.value = input.value;
            formulario.appendChild(elemento);
        });

        document.body.appendChild(formulario);
        formulario.submit();
        document.body.removeChild(formulario);
    }

    function abrirNovaAbaAluno(acaoOriginal) {
        const formulario = document.createElement('form');
        formulario.method = 'post';
        formulario.action = 'https://www.sere.pr.gov.br/sere/escola/consultas/frm_pesq_consulta_padrao_aluno.jsp';
        formulario.target = '_blank';

        const parametros = acaoOriginal.match(/AoClicarAluno\((.*)\)/)[1].split(',');

        const inputCgm = document.createElement('input');
        inputCgm.type = 'hidden';
        inputCgm.name = 'cgm';
        inputCgm.value = parametros[0].trim().replace(/['"]/g, '');
        formulario.appendChild(inputCgm);

        const inputNumMatricula = document.createElement('input');
        inputNumMatricula.type = 'hidden';
        inputNumMatricula.name = 'numMatricula';
        inputNumMatricula.value = parametros[1].trim().replace(/['"]/g, '');
        formulario.appendChild(inputNumMatricula);

        const inputCodTurma = document.createElement('input');
        inputCodTurma.type = 'hidden';
        inputCodTurma.name = 'codTurma';
        inputCodTurma.value = document.querySelector('input[name="codTurma"]')?.value || '';
        formulario.appendChild(inputCodTurma);

        const inputFuncao = document.createElement('input');
        inputFuncao.type = 'hidden';
        inputFuncao.name = 'funcao';
        inputFuncao.value = document.querySelector('input[name="funcao"]')?.value || 'ativa';
        formulario.appendChild(inputFuncao);

        document.body.appendChild(formulario);
        formulario.submit();
        document.body.removeChild(formulario);
    }
// ==============================================
// Função para adicionar contador de situações
// ==============================================
function adicionarContadorSituacoes() {
    // Verifique se o contador já existe
    if (document.getElementById('contador-situacoes')) return;

    const tabelaAlunos = document.getElementById('tb_alunos');
    if (!tabelaAlunos) return;

    // Contar situações
    const situacoes = {
        'Matriculado': 0,
        'Remanejado': 0,
        'Transferido': 0,
        'Desistente': 0,
        'Excluído por erro': 0
    };

    const linhas = tabelaAlunos.querySelectorAll('tbody tr');
    linhas.forEach(linha => {
        const celulaSituacao = linha.querySelector('td:nth-child(7)');
        if (celulaSituacao) {
            const situacao = celulaSituacao.textContent.trim();
            if (situacoes.hasOwnProperty(situacao)) {
                situacoes[situacao]++;
            }
        }
    });

    // Criar elemento para mostrar o contador
    const containerContador = document.createElement('div');
    containerContador.id = 'contador-situacoes'; // Adicione um ID para verificação
    containerContador.style.margin = '10px 0';
    containerContador.style.fontSize = '10px';
    containerContador.style.borderRadius = '5px';
    containerContador.style.textAlign = 'right';

    let textoContador = 'Situações: ';
    const situacoesExistentes = [];

    for (const [situacao, quantidade] of Object.entries(situacoes)) {
        if (quantidade > 0) {
            situacoesExistentes.push(`${situacao}: ${quantidade}`);
        }
    }

    textoContador += situacoesExistentes.join(' | ');

    // Só adiciona se houver pelo menos uma situação com alunos
    if (situacoesExistentes.length > 0) {
        containerContador.textContent = textoContador;

        // Inserir após o filtro e antes da tabela
        const inputFilterContainer = document.querySelector('.input-filter-container');
        if (inputFilterContainer) {
            inputFilterContainer.parentNode.insertBefore(containerContador, tabelaAlunos);
        } else {
            tabelaAlunos.parentNode.insertBefore(containerContador, tabelaAlunos);
        }
    }
}
    // ==============================================
    // Funções da Ferramenta de Relatório de Alunos
    // ==============================================

    const CURSOS_EXCLUIDOS = [
        "PROG.AT.COMPL.CUR.CONTRATURNO",
        "PROG AT COMPL CURRIC ETI",
        "EJA FASE I-5 MULTIETAPAS",
        "ATEND EDUC ESP-INTEGRAL AI EF",
        "SALA REC MULTIF-EDUC INF",
        "SALA DE REC-MULTIFUNC.SERIES I",
        "SALA REC-MULTIFUNC.SER.INC.-DV",
        "SALA REC MUL A.I ALT HAB SUPER",
        "SALA REC MULT-SURDEZ-ANOS INIC",
        "SALA REC MULTIF-EDUC INF",
        "ATEND EDUC ESP-AREA PEDAGOGICA"
    ];

    // Mapeamento de códigos de curso
    const CODIGOS_CURSO = {
        "EDUC INFANTIL": "2001",
        "EDUC INFANTIL MULTIANOS": "2002",
        "EDUC INFANTIL INTEGRAL": "2003",
        "EDUC INFANTIL 0-1 ANO": "2005",
        "EDUCACAO INFANTIL 2-3 ANOS": "2007",
        "PROG.AT.COMPL.CUR.CONTRATURNO": "3005",
        "PROG AT COMPL CURRIC ETI": "3037",
        "ENSINO FUND 1 5 ANO-CICLO_2-3": "4028",
        "ENSINO FUND.1/5 ANO-SERIE": "4035",
        "ENS FUND 1 5 ANO-C T INT 3 2": "4038",
        "ENS FUND 1/5 A/S - TEMPO INTEG": "4042",
        "ENS FUND 1/5-ANO-C T. INT 2E3": "4043",
        "EJA FASE I-5 MULTIETAPAS": "5062",
        "ATEND EDUC ESP-INTEGRAL AI EF": "6051",
        "SALA REC MULTIF-EDUC INF": "6037",
        "ATENDIMENTO ESPECIALIZADO": "6045",
        "SALA DE REC-MULTIFUNC.SERIES I": "6415",
        "SALA REC-MULTIFUNC.SER.INC.-DV": "6416",
        "SALA REC MUL A.I ALT HAB SUPER": "6419",
        "SALA REC MULT-SURDEZ-ANOS INIC": "6424",
        "SALA REC MULTIF-EDUC INF": "6428",
        "ATEND EDUC ESP-AREA PEDAGOGICA": "6430"
        };

    // Função para sanitizar nomes
    function sanitizarNome(nome) {
        if (!nome) return '';

        // Remove acentos
        let sanitizado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Remove caracteres especiais (mantém apenas letras, números e espaços)
        sanitizado = sanitizado.replace(/[^a-zA-Z0-9 ]/g, '');

        // Remove espaços extras (leading, trailing e múltiplos)
        sanitizado = sanitizado.trim().replace(/\s+/g, ' ');

        return sanitizado;
    }

    // Função para obter código do curso
    function obterCodigoCurso(nomeCurso) {
        if (!nomeCurso) return '';
        const cursoUpper = nomeCurso.toUpperCase();
        for (const [padrao, codigo] of Object.entries(CODIGOS_CURSO)) {
            if (cursoUpper.includes(padrao)) {
                return codigo;
            }
        }
        return '';
    }

    async function baixarXLS(turno, tentativa = 1) {
        try {
            const cacheBuster = `cache=${Date.now()}_${turno}_${tentativa}`;
            const formData = new URLSearchParams();
            formData.append('codTipoRelatorio', '4');
            formData.append('tipo', 'XLS');
            formData.append('codTurno', turno);
            formData.append('page', '0');
            formData.append('random', Math.random().toString(36).substring(2));

            const resposta = await fetch(`https://www.sere.pr.gov.br/sere/relAlunosporTurma.do?action=escolheTipoRelatorio&${cacheBuster}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
            return await resposta.blob();
        } catch (erro) {
            if (tentativa < 3) return baixarXLS(turno, tentativa + 1);
            throw erro;
        }
    }

    function parsearXLS(blob, turnoEsperado, todasTurmas = false) {
        return new Promise((resolve) => {
            const leitor = new FileReader();
            leitor.onload = (e) => {
                try {
                    const dados = new Uint8Array(e.target.result);
                    const pastaTrabalho = XLSX.read(dados, { type: 'array', defval: '' });
                    const planilha = pastaTrabalho.Sheets[pastaTrabalho.SheetNames[0]];
                    const todasLinhas = XLSX.utils.sheet_to_json(planilha, { header: 1, defval: '' });

                    let nomeEscola = '';
                    if (todasLinhas.length > 4 && todasLinhas[4].length > 2) {
                        nomeEscola = String(todasLinhas[4][2]).trim();
                    }

                    let secaoAtual = {
                        seriacao: '',
                        turno: turnoEsperado === '1' ? 'Manhã' : (turnoEsperado === '3' ? 'Tarde' : 'Integral'),
                        turma: '',
                        curso: '',
                        nomeEscola: nomeEscola,
                        deveExcluir: false,
                        linhaCabecalho: null,
                        indiceColunaCgm: -1,
                        linhas: []
                    };

                    const secoes = [];

                    for (const linha of todasLinhas) {
                        if (!linha || linha.length === 0) continue;

                        const celulaSeriacao = linha.find(celula => celula && String(celula).includes('Seriação:'));
                        const celulaTurma = linha.find(celula => celula && String(celula).includes('Turma:'));
                        const celulaCurso = linha.find(celula => celula && String(celula).includes('Curso:'));

                        if (celulaCurso) {
                            if (secaoAtual.linhas.length > 0 || secaoAtual.linhaCabecalho) {
                                secoes.push({...secaoAtual});
                            }

                            const cursoAtual = String(celulaCurso).split(':')[1]?.trim() || '';
                            secaoAtual = {
                                seriacao: celulaSeriacao ? String(celulaSeriacao).split(':')[1]?.trim() : secaoAtual.seriacao,
                                turno: turnoEsperado === '1' ? 'Manhã' : (turnoEsperado === '3' ? 'Tarde' : 'Integral'),
                                turma: celulaTurma ? String(celulaTurma).split(':')[1]?.trim() : secaoAtual.turma,
                                curso: cursoAtual,
                                nomeEscola: nomeEscola,
                                deveExcluir: false, // No modo todasTurmas, nunca exclui por curso
                                linhaCabecalho: null,
                                indiceColunaCgm: -1,
                                linhas: []
                            };
                            continue;
                        }

                        // Sempre excluir TRANSFERIDO, DESISTENTE e REMANEJADO, mesmo no modo todasTurmas
                        if (linha.some(celula => celula &&
                            (String(celula).toUpperCase().includes('TRANSFERIDO') ||
                             String(celula).toUpperCase().includes('DESISTENTE') ||
                             String(celula).toUpperCase().includes('REMANEJADO')))) continue;

                        const eLinhaCabecalho = linha.some(celula => celula && String(celula).trim().toUpperCase() === 'CGM');
                        if (eLinhaCabecalho) {
                            secaoAtual.linhaCabecalho = linha.map(h => String(h).trim());
                            secaoAtual.indiceColunaCgm = secaoAtual.linhaCabecalho.findIndex(h =>
                                h.toUpperCase() === 'CGM'
                            );
                            continue;
                        }

                        if (secaoAtual.linhaCabecalho && secaoAtual.indiceColunaCgm >= 0) {
                            const cgm = linha[secaoAtual.indiceColunaCgm] ? String(linha[secaoAtual.indiceColunaCgm]).trim() : '';
                            if (cgm && /^\d{6,}$/.test(cgm)) {
                                secaoAtual.linhas.push({
                                    dados: linha,
                                    infoSecao: {
                                        seriacao: secaoAtual.seriacao,
                                        turno: secaoAtual.turno,
                                        turma: secaoAtual.turma,
                                        curso: secaoAtual.curso,
                                        nomeEscola: secaoAtual.nomeEscola
                                    }
                                });
                            }
                        }
                    }

                    if (secaoAtual.linhas.length > 0 || secaoAtual.linhaCabecalho) {
                        secoes.push({...secaoAtual});
                    }

                    console.log(`${secoes.reduce((acc, sec) => acc + sec.linhas.length, 0)} estudantes processados do turno ${turnoEsperado}`);
                    resolve(secoes);
                } catch (erro) {
                    console.error('Erro lendo planilha:', erro);
                    resolve([]);
                }
            };
            leitor.onerror = () => {
                console.error('Erro ao ler arquivo');
                resolve([]);
            };
            leitor.readAsArrayBuffer(blob);
        });
    }

    function mesclarDados(secoesManha, secoesTarde, secoesIntegral, aplicarExclusoes = true) {
        const todasSecoes = [...secoesManha, ...secoesTarde, ...secoesIntegral];
        const cgmsVistos = new Set();
        const linhasMescladas = [];

        const cabecalhos = [
            'CGM', 'Nome do Estudante', 'Data de Nasc.', 'Cód. Curso',
            'Série', 'Turno', 'Turma', 'Situação', 'Data de matrícula',
            'Escola'
        ];
        linhasMescladas.push(cabecalhos);

        for (const secao of todasSecoes) {
            if (aplicarExclusoes && CURSOS_EXCLUIDOS.some(curso => secao.curso.toUpperCase().includes(curso.toUpperCase()))) {
                continue;
            }

            for (const aluno of secao.linhas) {
                const cgm = aluno.dados[secao.indiceColunaCgm] ? String(aluno.dados[secao.indiceColunaCgm]).trim() : '';
                if (!cgm || cgmsVistos.has(cgm)) continue;

                cgmsVistos.add(cgm);

                const linhaLimpa = [
                    cgm,
                    sanitizarNome(aluno.dados[4] || ''), // nome sanitizado
                    aluno.dados[5] || '', // data de nasc.
                    obterCodigoCurso(aluno.infoSecao.curso), // código curso
                    aluno.infoSecao.seriacao || '', // série
                    aluno.infoSecao.turno || '', // turno
                    aluno.infoSecao.turma || '', // turma
                    aluno.dados[12] || '', // situação
                    aluno.dados[13] || '', // data matrícula
                    aluno.infoSecao.nomeEscola || '' // escola
                ];

                linhasMescladas.push(linhaLimpa);
            }
        }

        console.log(`Mesclados ${linhasMescladas.length - 1} estudantes únicos`);
        return linhasMescladas;
    }

    function mesclarDadosCompletos(secoesManha, secoesTarde, secoesIntegral) {
        const todasSecoes = [...secoesManha, ...secoesTarde, ...secoesIntegral];
        const linhasCompletas = [];

        const cabecalhos = [
            'CGM', 'Nome do Estudante', 'Data de Nasc.', 'Cód. Curso',
            'Série', 'Turno', 'Turma', 'Situação', 'Data de matrícula',
            'Escola'
        ];
        linhasCompletas.push(cabecalhos);

        for (const secao of todasSecoes) {
            for (const aluno of secao.linhas) {
                const linha = [
                    aluno.dados[secao.indiceColunaCgm] || '',
                    sanitizarNome(aluno.dados[4] || ''),
                    aluno.dados[5] || '',
                    obterCodigoCurso(aluno.infoSecao.curso),
                    aluno.infoSecao.seriacao || '',
                    aluno.infoSecao.turno || '',
                    aluno.infoSecao.turma || '',
                    aluno.dados[12] || '',
                    aluno.dados[13] || '',
                    aluno.infoSecao.nomeEscola || ''
                ];
                linhasCompletas.push(linha);
            }
        }

        console.log(`Total de ${linhasCompletas.length - 1} registros de alunos (incluindo duplicados)`);
        return linhasCompletas;
    }

    function baixarXLSX(linhas) {
        if (linhas.length <= 1) {
            alert('Nenhum dado válido encontrado para exportar!');
            return;
        }

        const pastaTrabalho = XLSX.utils.book_new();
        const planilha = XLSX.utils.aoa_to_sheet(linhas);
        const colWidths = linhas[0].map((_, colIndex) => {
            const maxWidth = linhas.reduce((max, row) => {
                const cell = row[colIndex] || '';
                return Math.max(max, cell.toString().length);
            }, 0);
            return { wch: maxWidth};
        });
        planilha['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(pastaTrabalho, planilha, 'Alunos');
        const saida = XLSX.write(pastaTrabalho, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([saida], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `lista-alunos_${new Date().toISOString().slice(0,10)}.xlsx`;
        link.click();
    }

    async function manipularDownload() {
        const botao = document.getElementById('botaoBaixarCompleto');
        if (!botao) return;

        botao.disabled = true;
        botao.value = 'Processando...';

        try {
            alert('Processando lista de alunos');

            console.log('Baixando relatório da manhã...');
            const blobManha = await baixarXLS('1');
            const secoesManha = await parsearXLS(blobManha, '1');

            console.log('Baixando relatório da tarde...');
            const blobTarde = await baixarXLS('3');
            const secoesTarde = await parsearXLS(blobTarde, '3');

            console.log('Baixando relatório integral...');
            const blobIntegral = await baixarXLS('6');
            const secoesIntegral = await parsearXLS(blobIntegral, '6');

            const linhasMescladas = mesclarDados(secoesManha, secoesTarde, secoesIntegral);

            if (linhasMescladas.length > 1) {
                baixarXLSX(linhasMescladas);
                alert(`Arquivo gerado com sucesso! ${linhasMescladas.length - 1} alunos exportados.`);
            } else {
                alert('Nenhum dado válido encontrado para exportar!');
            }
        } catch (erro) {
            alert('Erro durante o processamento:\n' + erro.message);
            console.error('Erro no download:', erro);
        } finally {
            botao.disabled = false;
            botao.value = 'Turmas regulares';
        }
    }

    async function processarTodasTurmas() {
        const botao = document.getElementById('botaoTodasTurmas');
        if (!botao) return;

        botao.disabled = true;
        botao.value = 'Processando...';

        try {
            alert('Processando lista de todas as turmas (sem filtros)');

            console.log('Baixando relatório da manhã...');
            const blobManha = await baixarXLS('1');
            const secoesManha = await parsearXLS(blobManha, '1', true);

            console.log('Baixando relatório da tarde...');
            const blobTarde = await baixarXLS('3');
            const secoesTarde = await parsearXLS(blobTarde, '3', true);

            console.log('Baixando relatório integral...');
            const blobIntegral = await baixarXLS('6');
            const secoesIntegral = await parsearXLS(blobIntegral, '6', true);

            const linhasCompletas = mesclarDadosCompletos(secoesManha, secoesTarde, secoesIntegral);

            if (linhasCompletas.length > 1) {
                baixarXLSX(linhasCompletas);
                alert(`Arquivo gerado com sucesso! ${linhasCompletas.length - 1} registros de alunos exportados.`);
            } else {
                alert('Nenhum dado válido encontrado para exportar!');
            }
        } catch (erro) {
            alert('Erro durante o processamento:\n' + erro.message);
            console.error('Erro no download:', erro);
        } finally {
            botao.disabled = false;
            botao.value = 'Todas as Turmas';
        }
    }

    function adicionarBotaoDownload() {
        const containerBotao = document.querySelector('div[align="center"]');
        if (!containerBotao) {
            setTimeout(adicionarBotaoDownload, 500);
            return;
        }

        if (!document.getElementById('botaoBaixarCompleto')) {
            const botaoDownload = document.createElement('input');
            botaoDownload.type = 'button';
            botaoDownload.id = 'botaoBaixarCompleto';
            botaoDownload.value = 'Turmas regulares';
            botaoDownload.className = 'botao';
            botaoDownload.onclick = manipularDownload;
            containerBotao.appendChild(document.createTextNode(' '));
            containerBotao.appendChild(botaoDownload);
        }

        if (!document.getElementById('botaoTodasTurmas')) {
            const botaoTodasTurmas = document.createElement('input');
            botaoTodasTurmas.type = 'button';
            botaoTodasTurmas.id = 'botaoTodasTurmas';
            botaoTodasTurmas.value = 'Todas as Turmas';
            botaoTodasTurmas.className = 'botao';
            botaoTodasTurmas.onclick = processarTodasTurmas;
            containerBotao.appendChild(document.createTextNode(' '));
            containerBotao.appendChild(botaoTodasTurmas);
        }
    }




    // ==============================================
    // Funções de Exportação de Documentos
    // ==============================================


    // Função para adicionar o botão de exportar documentos
    function adicionarBotaoExportarDocumentos() {
        const btnVoltar = document.querySelector('input[value="voltar"]');
        if (!btnVoltar) {
            setTimeout(adicionarBotaoExportarDocumentos, 500);
            return;
        }

        if (!document.getElementById('btnExportarDocumentos')) {
            const btnExportar = document.createElement('input');
            btnExportar.type = 'button';
            btnExportar.id = 'btnExportarDocumentos';
            btnExportar.value = 'Exportar Documentos';
            btnExportar.className = 'botao botao-exportar-docs';
            btnExportar.onclick = exportarDocumentos;

            btnVoltar.parentNode.insertBefore(btnExportar, btnVoltar.nextSibling);
        }
    }

    // Função para coletar dados dos alunos
    function coletarDadosAlunos() {
        const tableBody = document.querySelector('#tb_alunos tbody');
        if (!tableBody) return [];

        const alunos = [];
        const rows = tableBody.children;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cgmLink = row.querySelector('td:nth-child(2) a');
            if (cgmLink) {
                alunos.push({
                    cgm: cgmLink.textContent.trim(),
                    nome: row.querySelector('td:nth-child(3)').textContent.trim()
                });
            }
        }

        return alunos;
    }

    // Função para buscar documentos de um aluno
    function buscarDocumentosAluno(cgm) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.sere.pr.gov.br/sere/gerenciarPastaVirtual.do?action=listarArquivos&cgmAluno=${cgm}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Função para extrair apenas a data (remover horário)
    function extrairSomenteData(dataString) {
        if (!dataString) return '';
        // Remove tudo após o primeiro espaço (horário)
        return dataString.split(' ')[0];
    }

    // Função principal para exportar documentos
    async function exportarDocumentos() {
        const button = event.target;
        button.disabled = true;
        button.value = 'Coletando dados...';

        try {
            const alunos = coletarDadosAlunos();
            if (!alunos.length) {
                alert('Nenhum aluno encontrado na tabela.');
                return;
            }

            const BATCH_SIZE = 5;
            const alunosComDocumentos = [];

            for (let i = 0; i < alunos.length; i += BATCH_SIZE) {
                const batch = alunos.slice(i, i + BATCH_SIZE);
                const batchPromises = batch.map(aluno =>
                    buscarDocumentosAluno(aluno.cgm)
                        .then(documentos => ({ ...aluno, documentos }))
                        .catch(error => ({ ...aluno, documentos: [], error: true }))
                );

                const batchResults = await Promise.all(batchPromises);
                alunosComDocumentos.push(...batchResults);

                button.value = `Processando ${alunosComDocumentos.length}/${alunos.length}...`;
            }

            criarPlanilhaDocumentos(alunosComDocumentos);
        } catch (error) {
            console.error('Erro ao exportar documentos:', error);
            alert('Ocorreu um erro ao exportar os documentos.');
        } finally {
            button.value = 'Exportar Documentos';
            button.disabled = false;
        }
    }

// Função para criar a planilha XLSX com as novas formatações
function criarPlanilhaDocumentos(alunosComDocumentos) {
    // Definir os tipos de documentos que queremos incluir
    const documentosFiltrados = [
        "Certidão de nascimento do aluno",
        "CPF Responsável",
        "Comprovante de residência",
        "CPF do Aluno",
        "Declaração de vacina",
        "Carteira de vacinação",
        "Transferência escolar",
        "Guia de Transferência",
        "Histórico Escolar do Ensino Fundamental"
    ];

    const headers = ['CGM', 'Nome do Aluno', ...documentosFiltrados];
    const data = [headers];

    alunosComDocumentos.forEach(aluno => {
        const row = [aluno.cgm, aluno.nome];

        const docsMap = {};
        if (aluno.documentos) {
            aluno.documentos.forEach(doc => {
                // Verifica se o tipo de documento está na lista filtrada
                if (documentosFiltrados.includes(doc.tipodocumento)) {
                    // Extrai apenas a data, sem o horário
                    docsMap[doc.tipodocumento] = extrairSomenteData(doc.datainclusao);
                }
            });
        }

        documentosFiltrados.forEach(tipo => {
            row.push(docsMap[tipo] || '');
        });

        data.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Configuração das larguras das colunas
    const wscols = [
        {wch: 12},  // CGM
        {wch: 40},  // Nome
        ...documentosFiltrados.map(() => ({wch: 9})) // Documentos (9 unidades = ~80px cada)
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Documentos");

    // Gerar nome do arquivo
    const curso = document.querySelector('.texto_normal').textContent.trim();
    const turma = document.querySelectorAll('.texto_normal')[3].textContent.trim();
    const fileName = `Documentos_${curso}_${turma}.xlsx`;

    XLSX.writeFile(wb, fileName);
}
    // ==============================================
    // Inicialização baseada na página atual
    // ==============================================
    function inicializarPaginaTurma() {
    adicionarBotaoExportarDocumentos();
    modificarLinksAluno();
    adicionarContadorSituacoes();

    let temporizador;
    const observadorAluno = new MutationObserver(function(mutacoes) {
        if (temporizador) clearTimeout(temporizador);
            temporizador = setTimeout(() => {
            adicionarBotaoExportarDocumentos();
            modificarLinksAluno();
            adicionarContadorSituacoes();
        }, 200);
    });

    observadorAluno.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

    if (window.location.href.includes('frm_pesq_turmas.jsp')) {
        modificarLinksTurma();

        const observadorTurma = new MutationObserver(function(mutacoes) {
            modificarLinksTurma();
        });
        observadorTurma.observe(document.body, { childList: true, subtree: true });
    }
    else if (window.location.href.includes('frm_pesq_consulta_padrao_turma2.jsp')) {
       inicializarPaginaTurma();
    }
    else if (window.location.href.includes('relAlunosporTurma.do')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', adicionarBotaoDownload);
        } else {
            adicionarBotaoDownload();
        }
    }
})();