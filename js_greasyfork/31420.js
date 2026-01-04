// ==UserScript==
// @name        PRF Sistema SISCOM - Lançamento de Ação Administrativa
// @namespace   br.gov.prf.siscom.scripts.LancaAcaoDeterminacao
// @description Automatiza o processo de lançamento de Ação Administrativa
// @match       *://www.prf.gov.br/multa/manterAcaoAdministrativa.do?reqCode=cadastrarInicio
// @match       *://www.prf.gov.br/multa2/manterAcaoAdministrativa.do?reqCode=cadastrarInicio
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://greasyfork.org/scripts/31419-prf-lib-valida-cpf-cnpj/code/PRF%20-%20Lib%20-%20Valida%20CPF%20CNPJ.js?version=205924
// @run-at      document-idle
// @grant       unsafeWindow
// @author      Marcelo Barros
// @version     1.1.1
// @downloadURL https://update.greasyfork.org/scripts/31420/PRF%20Sistema%20SISCOM%20-%20Lan%C3%A7amento%20de%20A%C3%A7%C3%A3o%20Administrativa.user.js
// @updateURL https://update.greasyfork.org/scripts/31420/PRF%20Sistema%20SISCOM%20-%20Lan%C3%A7amento%20de%20A%C3%A7%C3%A3o%20Administrativa.meta.js
// ==/UserScript==

(function() {

    'use strict';

    window.$ = window.jQuery = jQuery.noConflict(true);

    let processos;
    let multaTotal = 0;
    let multaErro = 0;
    let multaSucesso = 0;
    let msgErro = [];

    function getTd(id, texto) {
        let td = document.createElement('td');
        td.id = id;
        td.innerHTML = texto || id;
        return td;
    }

    function limparCorMulta() {
        forEachMulta(function(processo, placa, auto, multa) {
            document.querySelector('td[data-valor="' + multa + '"]').style.color = null;
        });
    }

    function avaliarTodosTdValido() {
        if (multaTotal == multaSucesso + multaErro)
            setTimeout(function() { msgErro.forEach(function(mensagem) { alert(mensagem); }); }, 400);
        if (multaTotal == multaSucesso)
            document.getElementById(idBtnCadastrar).disabled = false;
    }

    function forEachProcesso(callback) {
        Object.keys(processos).forEach(function(processo) {
            callback(processo);
        });
    }

    function forEachPlaca(callback, processo) {

        let fnEachProcesso = function(processo) {
            Object.keys(processos[processo][txtVeiculos]).forEach(function(placa) {
                callback(processo, placa);
            });
        };

        if (processo)
            fnEachProcesso(processo);
        else
            forEachProcesso(fnEachProcesso);
    }

    function forEachAuto(callback, processo, placa) {
        let fnEachPlaca = function(processo, placa) {
            Object.keys(processos[processo][txtVeiculos][placa][txtAutos]).forEach(function(auto) {
                callback(processo, placa, auto);
            });
        };

        if (placa)
            fnEachPlaca(processo, placa);
        else
            forEachPlaca(fnEachPlaca, processo);
    }

    function forEachMulta(callback, processo, placa) {
        forEachAuto(function(processo, placa, auto) {
            Object.keys(processos[processo][txtVeiculos][placa][txtAutos][auto]).forEach(function(multa) {
                callback(processo, placa, auto, multa);
            });
        }, processo, placa);
    }

    function insertTh(tr, titulo) {
        let th = document.createElement('th');
        th.innerHTML = titulo;
        tr.insertBefore(th, null);
    }

    unsafeWindow.mostrarImagem  = exportFunction (function() {}, unsafeWindow);
    unsafeWindow.esconderImagem  = exportFunction (function() {}, unsafeWindow);

    let tdBase = document.querySelector('input[src="/multa/images/ajuda.jpg"]').parentNode;
    let trBase = tdBase.parentNode;
    let tdPai = trBase.parentNode.parentNode.parentNode;
    let idInputFileArquivo = 'inputFileArquivo';
    let txtDataAbertura = 'dataAbertura';
    let txtDespacho = 'despacho';
    let txtDataDespacho = 'dataDespacho';
    let txtJustificativa = 'justificativa';
    let txtDocumento = 'documento';
    let txtCheckCadastrarTotal = 'checkCadastrarTotal';
    let txtCheckCadastrarInvalido = 'checkCadastrarInvalido';
    let txtCheckCadastrarValido = 'checkCadastrarValido';
    let txtCheckCadastrarMensagem = 'checkCadastrarMensagem';
    let txtRegistrarTotal = 'registrarTotal';
    let txtRegistrarInvalido = 'registrarInvalido';
    let txtRegistrarValido = 'registrarValido';
    let txtRegistrarMensagem = 'registrarMensagem';
    let txtVeiculos = 'veiculos';
    let txtAutos = 'autos';
    let idBtnLimpar = 'btnLimpar';

    let colAuto = 0;
    let colPlaca = 1;
    let colMulta = 2;
    let colProcesso = 3;
    let colDataProcesso = 4;
    let colDespacho = 5;
    let colDataDespacho = 6;
    let colJustificativa = 7;
    let colDocumento = 8;

    trBase.insertBefore(document.createElement('td'), tdBase).innerHTML = '<fieldset><legend>Ler por Arquivo</legend><input id="' + idInputFileArquivo + '" type="file"></fieldset>';
    document.getElementById(idInputFileArquivo).addEventListener("change", function() {
        tdPai.firstElementChild.style.display = 'none';
        let fieldsetFinal = tdPai.querySelector('form[name="manterAcaoAdministrativaForm"]>table>tbody>tr>td>fieldset');
        fieldsetFinal.querySelectorAll('table:not(:last-child)').forEach(function(element) { element.style.display = 'none'; });
        if (this.files.length == 1) {
            let reader = new FileReader();
            reader.onload = function(event) {
                var linhas = event.target.result.replace(/\r/g, '').split('\n');
                if (linhas.length > 0) {
                    let processosNovos = {};
                    let qtdLinhaValida = 0;
                    let qtdLinhaVazia = 0;
                    let table = document.createElement('table');
                    table.border = 1;
                    table.style.width = '100%';
                    let tbody = table.insertBefore(document.createElement('tbody'), null);
                    {
                        let tr = tbody.insertBefore(document.createElement('tr'), null);
                        insertTh(tr, 'Processo');
                        insertTh(tr, 'Placa');
                        insertTh(tr, 'Auto');
                        insertTh(tr, 'Multa');
                    }
                    linhas.forEach(function(linha) {
                        if (linha) {
                            var itens = linha.split(',');
                            if (itens.length == 9) {
                                processosNovos[itens[colProcesso]] =
                                    (processosNovos[itens[colProcesso]] || {
                                    [txtDataAbertura]: itens[colDataProcesso],
                                    [txtDespacho]: itens[colDespacho],
                                    [txtDataDespacho]: itens[colDataDespacho],
                                    [txtJustificativa]: itens[colJustificativa],
                                    [txtVeiculos]: {}});
                                processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]] =
                                    (processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]] || {[txtDocumento]: itens[colDocumento], [txtAutos]: {}});
                                processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]][txtAutos][itens[colAuto]] =
                                    (processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]][txtAutos][itens[colAuto]] || {});
                                processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]][txtAutos][itens[colAuto]][itens[colMulta]] =
                                    (processosNovos[itens[colProcesso]][txtVeiculos][itens[colPlaca]][txtAutos][itens[colAuto]][itens[colMulta]] || {});
                                tbody.insertBefore(document.createElement('tr'), null);
                                qtdLinhaValida++;
                            }
                        } else qtdLinhaVazia++;
                    });
                    if (qtdLinhaValida + qtdLinhaVazia == linhas.length) {
                        processos = processosNovos;
                        let tr = tbody.firstElementChild.nextElementSibling;
                        let td;
                        let tdProcessoAnterior;
                        let tdPlacaAnterior;
                        let tdAutoAnterior;
                        let rowSpanProcesso;
                        let rowSpanPlaca;
                        let rowSpanAuto;
                        forEachMulta(function(processo, placa, auto, multa) {
                            td = tr.insertBefore(document.createElement('td'), null);
                            if (!tdProcessoAnterior || processo !== tdProcessoAnterior.dataset.valor) {
                                td.innerHTML = '<strong class="processo">' + processo + '</strong><br>' + processos[processo][txtDataAbertura];
                                {
                                    let inputChecarCadastrar = document.createElement('input');
                                    inputChecarCadastrar.type = 'button';
                                    inputChecarCadastrar.dataset.valor = processo;
                                    inputChecarCadastrar.className = 'checarCadastrar';
                                    inputChecarCadastrar.value = "Checar Cadastrar";
                                    td.insertBefore(document.createElement('p'), null).insertBefore(inputChecarCadastrar, null);
                                    let inputCadastrar = document.createElement('input');
                                    inputCadastrar.type = 'button';
                                    inputCadastrar.disabled = true;
                                    inputCadastrar.dataset.valor = processo;
                                    inputCadastrar.className = 'cadastrar';
                                    inputCadastrar.value = "Cadastrar";
                                    td.insertBefore(document.createElement('p'), null).insertBefore(inputCadastrar, null);
                                    let inputChecarRegistrar = document.createElement('input');
                                    inputChecarRegistrar.type = 'button';
                                    inputChecarRegistrar.dataset.valor = processo;
                                    inputChecarRegistrar.className = 'checarRegistrar';
                                    inputChecarRegistrar.value = "Checar Registrar";
                                    td.insertBefore(document.createElement('p'), null).insertBefore(inputChecarRegistrar, null);
                                    let inputRegistrar = document.createElement('input');
                                    inputRegistrar.type = 'button';
                                    inputRegistrar.disabled = true;
                                    inputRegistrar.dataset.valor = processo;
                                    inputRegistrar.className = 'registrar';
                                    inputRegistrar.value = "Registrar";
                                    td.insertBefore(document.createElement('p'), null).insertBefore(inputRegistrar, null);

                                    inputChecarCadastrar.onclick = function() {
                                        inputRegistrar.disabled = true;
                                        inputCadastrar.disabled = true;
                                        inputChecarCadastrar.disabled = true;
                                        inputChecarRegistrar.disabled = true;
                                        processos[processo][txtCheckCadastrarTotal] = 0;
                                        processos[processo][txtCheckCadastrarValido] = 0;
                                        processos[processo][txtCheckCadastrarInvalido] = 0;
                                        processos[processo][txtCheckCadastrarMensagem] = [];
                                        limparCorMulta();
                                        forEachMulta(function(processo, placa, auto, multa) {
                                            let tdMulta = document.querySelector('td[data-valor="' + multa + '"]');
                                            processos[processo][txtCheckCadastrarTotal]++;
                                            $.get('manterAcaoAdministrativa.do?reqCode=vincularAuto&multasSelecionadas=' + multa + '-' + auto + '@' + placa + ',', null, function(rawHtml) {
                                                let respostaConsultaAuto = document.implementation.createHTMLDocument("consultaAuto" + multa);
                                                respostaConsultaAuto.documentElement.innerHTML = rawHtml;
                                                let mensagem = respostaConsultaAuto.getElementById('mensagem').innerHTML.trim();
                                                if (mensagem) {
                                                    tdMulta.style.color = 'red';
                                                    processos[processo][txtCheckCadastrarMensagem].push(mensagem);
                                                    processos[processo][txtCheckCadastrarInvalido]++;
                                                } else {
                                                    tdMulta.style.color = 'green';
                                                    processos[processo][txtCheckCadastrarValido]++;
                                                    if (processos[processo][txtCheckCadastrarValido] == processos[processo][txtCheckCadastrarTotal])
                                                        inputCadastrar.disabled = false;
                                                }
                                            }, 'html').fail(function() {
                                                tdMulta.style.color = 'red';
                                                processos[processo][txtCheckCadastrarMensagem].push('Erro ao acessar o servidor');
                                                processos[processo][txtCheckCadastrarInvalido]++;
                                            }).always(function() {
                                                if (processos[processo][txtCheckCadastrarTotal] == processos[processo][txtCheckCadastrarValido] + processos[processo][txtCheckCadastrarInvalido]) {
                                                    setTimeout(function() { processos[processo][txtCheckCadastrarMensagem].forEach(function(mensagem) { alert(mensagem); }); }, 400);
                                                    inputChecarCadastrar.disabled = false;
                                                    inputChecarRegistrar.disabled = false;
                                                }
                                            });
                                        }, processo);
                                    };

                                    inputChecarRegistrar.onclick = function() {
                                        inputRegistrar.disabled = true;
                                        inputCadastrar.disabled = true;
                                        inputChecarCadastrar.disabled = true;
                                        inputChecarRegistrar.disabled = true;
                                        limparCorMulta();
                                        $.get('manterAcaoAdministrativa.do?reqCode=registrarDeterminacao&codigoProtocolo=' + processo, null, function(rawHtml) {
                                            let respostaConsultaProcesso = document.implementation.createHTMLDocument("consultaProcesso" + processo);
                                            respostaConsultaProcesso.documentElement.innerHTML = rawHtml;
                                            let arrayMultaProcesso = [];
                                            respostaConsultaProcesso.getElementsByName('multasSelecionadas').forEach(function(element) { arrayMultaProcesso.push(element.value); });
                                            let existeMultaNaoVinculado = false;
                                            forEachMulta(function(processo, placa, auto, multa) {
                                                let tdMulta = document.querySelector('td[data-valor="' + multa + '"]');
                                                if (!arrayMultaProcesso.includes(multa + '-' + auto + '@' + placa)) {
                                                    alert('A multa ' + multa + ' do auto ' + auto + ' (' + placa +') não se encontra vinculada ao processo ' + processo + '.');
                                                    tdMulta.style.color = 'red';
                                                    existeMultaNaoVinculado = true;
                                                } else {
                                                    tdMulta.style.color = 'green';
                                                }
                                            }, processo);
                                            if (!existeMultaNaoVinculado)
                                                inputRegistrar.disabled = false;
                                        }).always(function() {
                                            inputChecarCadastrar.disabled = false;
                                            inputChecarRegistrar.disabled = false;
                                        });

                                    };

                                    inputCadastrar.onclick = function() {
                                        inputRegistrar.disabled = true;
                                        inputCadastrar.disabled = true;
                                        inputChecarCadastrar.disabled = true;
                                        inputChecarRegistrar.disabled = true;

                                        let spanProcesso = document.querySelector('td[data-valor="' + processo + '"]>strong.processo');

                                        let url = 'manterAcaoAdministrativa.do?reqCode=cadastrarAcaoAdministrativa&codigoProtocolo=' + encodeURI(processo) + '&dataAcaoAdministrativa=' + encodeURI(processos[processo][txtDataAbertura]);

                                        let multasVinculadasValor = '';
                                        forEachMulta(function(processo, placa, auto, multa) {
                                            multasVinculadasValor += encodeURI(multa + '-' + auto + '@' + placa + ',');
                                        }, processo);

                                        const msgInicialErroCadastrarAcao = 'Processo: ' + processo + ' - ';
                                        $.post(url, {multasVinculadas: multasVinculadasValor}, function(texto) {
                                            texto = texto.trim();
                                            if (texto.startsWith('m:')) {
                                                spanProcesso.style.color = 'green';
                                            } else {
                                                let msgErroCadastrarAcao = msgInicialErroCadastrarAcao;
                                                if (texto.startsWith('e:')) {
                                                    msgErroCadastrarAcao += texto.substr(2);
                                                } else {
                                                    msgErroCadastrarAcao += 'Servidor retornou um erro desconhecido ao cadastrar o processo';
                                                }
                                                spanProcesso.style.color = 'red';
                                                alert(msgErroCadastrarAcao);
                                            }
                                        }, 'text').fail(function() {
                                            spanProcesso.style.color = 'red';
                                            alert(msgInicialErroCadastrarAcao + 'Erro ao acessar o servidor');
                                        }).always(function() {
                                            inputChecarCadastrar.disabled = false;
                                            inputChecarRegistrar.disabled = false;
                                        });
                                    };

                                    inputRegistrar.onclick = function() {
                                        inputRegistrar.disabled = true;
                                        inputCadastrar.disabled = true;
                                        inputChecarCadastrar.disabled = true;
                                        inputChecarRegistrar.disabled = true;
                                        processos[processo][txtRegistrarTotal] = 0;
                                        processos[processo][txtRegistrarValido] = 0;
                                        processos[processo][txtRegistrarInvalido] = 0;
                                        processos[processo][txtRegistrarMensagem] = [];
                                        let funcoesChamar = [];
                                        forEachPlaca(function(processo, placa) {

                                            let tdPlaca = document.querySelector('td[data-valor="' + placa + '"]');

                                            let url = 'multasporplaca.do';
                                            url += '?reqCode=desvincularMultasAcao';
                                            url += '&reqOrigem=REGISTRAR';
                                            url += '&vinculo=1';
                                            url += '&tipoVinculo=1';
                                            url += '&registroDeterminacaoJudicial=false';
                                            url += '&extendidoPorDeterminacaoAdministrativa=true';
                                            url += '&placa=' + encodeURI(placa);
                                            url += '&codigoProtocolo=' + encodeURI(processo);
                                            url += '&numeroProcesso=' + encodeURI(processo);
                                            url += '&acaoDeterminacaoAdministrativa.justificativa=' + encodeURI(processos[processo][txtJustificativa]);
                                            url += '&documentoDeterminacaoAdministrativa.numero=' + encodeURI(processos[processo][txtDespacho]);
                                            url += '&documentoDeterminacaoAdministrativa.dataString=' + encodeURI(processos[processo][txtDataDespacho]);
                                            url += '&acaoDeterminacaoAdministrativa.valorDeterminacao=5';

                                            let multasVinculadas = '';
                                            forEachMulta(function(processo, placa, auto, multa) {
                                                url += '&cpfCnpjVinculado' + encodeURI('(' + multa + ')') + '=' + encodeURI(processos[processo][txtVeiculos][placa][txtDocumento]);
                                                url += '&codigosMultasDesvincular=' + encodeURI(multa);
                                                multasVinculadas += encodeURI(multa + '-' + auto + '@' + placa + ',');
                                            }, processo, placa);

                                            url += '&multasVinculadas=' + multasVinculadas;
                                            processos[processo][txtRegistrarTotal]++;

                                            let i = funcoesChamar.length;
                                            funcoesChamar.push(function() {
                                                $.get(url, null, function(texto) {
                                                    tdPlaca.style.color = 'green';
                                                    processos[processo][txtRegistrarValido]++;
                                                }).fail(function() {
                                                    tdPlaca.style.color = 'red';
                                                    processos[processo][txtRegistrarInvalido]++;
                                                    processos[processo][txtRegistrarMensagem].push('Erro ao registrar determinacao para a placa ' + placa + '.');
                                                }).always(function() {
                                                    if (i + 1 <= funcoesChamar.length - 1)
                                                        funcoesChamar[i + 1]();
                                                    if (processos[processo][txtRegistrarTotal] == processos[processo][txtRegistrarValido] + processos[processo][txtRegistrarInvalido]) {
                                                        if (processos[processo][txtRegistrarMensagem])
                                                            setTimeout(function() { processos[processo][txtRegistrarMensagem].forEach(function(mensagem) { alert(mensagem); }); }, 400);
                                                        inputChecarCadastrar.disabled = false;
                                                        inputChecarRegistrar.disabled = false;
                                                    }
                                                });
                                            });
                                        }, processo);
                                        funcoesChamar[0]();
                                    };
                                }
                                td.className = 'processo';
                                td.dataset.valor = processo;
                                td.style['text-align'] = 'center';
                                if (rowSpanProcesso) tdProcessoAnterior.rowSpan = rowSpanProcesso;
                                tdProcessoAnterior = td;
                                rowSpanProcesso = 1;
                                td = tr.insertBefore(document.createElement('td'), null);
                            } else rowSpanProcesso++;
                            if (!tdPlacaAnterior || placa !== tdPlacaAnterior.dataset.valor) {
                                td.innerHTML = placa;
                                td.className = 'placa';
                                td.dataset.valor = placa;
                                if (rowSpanPlaca) tdPlacaAnterior.rowSpan = rowSpanPlaca;
                                tdPlacaAnterior = td;
                                rowSpanPlaca = 1;
                                td = tr.insertBefore(document.createElement('td'), null);
                            } else rowSpanPlaca++;
                            if (!tdAutoAnterior || auto != tdAutoAnterior.dataset.valor) {
                                td.innerHTML = auto;
                                td.className = 'auto';
                                td.dataset.valor = auto;
                                if (rowSpanAuto) tdAutoAnterior.rowSpan = rowSpanAuto;
                                tdAutoAnterior = td;
                                rowSpanAuto = 1;
                                td = tr.insertBefore(document.createElement('td'), null);
                            } else rowSpanAuto++;
                            td.innerHTML = multa;
                            td.className = 'multa';
                            td.dataset.valor = multa;
                            tr = tr.nextElementSibling;
                            multaTotal++;
                        });
                        if (rowSpanProcesso) tdProcessoAnterior.rowSpan = rowSpanProcesso;
                        if (rowSpanPlaca) tdPlacaAnterior.rowSpan = rowSpanPlaca;
                        if (rowSpanAuto) tdAutoAnterior.rowSpan = rowSpanAuto;
                        tdPai.insertBefore(table, tdPai.firstChild);
                        forEachPlaca(function(processo, placa) {
                            let documento = processos[processo][txtVeiculos][placa][txtDocumento];
                            if (!isValidDocument(documento))
                                alert('O documento ' + documento + ' listado na placa ' + placa + ' e processo ' + processo + ' não é válido.');
                        });
                        let trBotoes = fieldsetFinal.querySelector('table:last-child>tbody>tr');
                        trBotoes.firstElementChild.style.display = 'none';
                        trBotoes.firstElementChild.nextElementSibling.style.display = 'none';
                        {
                            let btnLimpar = document.createElement('input');
                            btnLimpar.type = 'button';
                            btnLimpar.id = idBtnLimpar;
                            btnLimpar.value = "Limpar";
                            btnLimpar.onclick = function() { location.href = 'manterAcaoAdministrativa.do?reqCode=cadastrarInicio'; };
                            trBotoes.insertBefore(btnLimpar, null);
                        }
                    } else alert('O arquivo não possui a formatação correta');
                } else alert('O arquivo está vazio');
            };
            reader.readAsText(this.files[0]);
        }
    }, false);
})();