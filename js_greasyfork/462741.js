// ==UserScript==
// @name         Distribuidor ou removedor de dinheiro dos locais
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Insere uma div com id "caixa-do-script" imediatamente abaixo de um h2 com texto "Distribuir dinheiro"
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/dinheiro/empresa/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462741/Distribuidor%20ou%20removedor%20de%20dinheiro%20dos%20locais.user.js
// @updateURL https://update.greasyfork.org/scripts/462741/Distribuidor%20ou%20removedor%20de%20dinheiro%20dos%20locais.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let valMaximoDistr;

    $('div.box#conteudo span').each(function() {
        if ($(this).text().includes('A empresa possui atualmente')) {
            const strongText = $(this).find('strong').text();
            valMaximoDistr = parseFloat(strongText.replace(/\$|,/g, ''));
        }
    });

    console.log('Valor máximo encontrado:', valMaximoDistr);

    // Procurar o elemento h2 com o texto "Distribuir dinheiro"
    const h2DistribuirDinheiro = $('h2:contains("Distribuir dinheiro")');

 // Criar a div com class "bloc"
    const blocDiv = $('<div>', { class: 'bloc' });
    const boxDiv = $('<div>', { class: 'box', id: 'conteudo' , name:'script-dindin'});

    // Criar um header com um h3 com class "titulo" e texto "Distribuidor e removedor automático"
    const header = $('<header>');
    const tituloH3 = $('<h3>', { class: 'titulo', text: 'Distribuidor e removedor automático' });
    const span1 = $('<span>', {text:'Informe nos campos abaixo se você deseja distribuir ou remover o dinheiro dos locais.'});
    // Adicionar o h3 ao header
    header.append(tituloH3);

    // Adicionar o header à div com class "bloc"
    blocDiv.append(header);
    blocDiv.append(boxDiv)
    boxDiv.append(span1)
    // Adicionar duas quebras de linha após o span
    const breakLine1 = $('<br>');
    const breakLine2 = $('<br>');
    boxDiv.append(breakLine1);
    boxDiv.append(breakLine2);
    $('span').css({
    'text-shadow': 'none'
});

    // Procurar a div com class "center" que possui uma tabela com name "padrao"
    const centerDivWithTable = $('div.center').filter(function () {
      return $(this).find('table[class="padrao"]').length > 0;
    }).first();

    // Encontrar a tabela "padrao" dentro da div "center"
    const padraoTable = centerDivWithTable.find('table[class="padrao"]');

    // Inserir a div "bloc" imediatamente antes da tabela "padrao"
    padraoTable.before(blocDiv);
    // Criar um elemento hr (régua horizontal)
    const horizontalRule = $('<hr>');

    // Inserir a régua horizontal após o blocDiv
    blocDiv.after(horizontalRule);
    blocDiv.after('<br>')
    blocDiv.after('<br>')



    // Criar uma div para conter os inputs radio
    const radioDiv = $('<div>');


    // Criar o primeiro span com o input radio e o texto "Distribuir"
    const spanDistribuir = $('<span>', { style: 'margin-right: 20px;' });
    const radioDistribuir = $('<input>', {
        type: 'radio',
        name: 'acao',
        id: 'checkDistribuir',
        value: 'distribuir'
    });
    spanDistribuir.append(radioDistribuir);
    spanDistribuir.append(' Distribuir');


    // Criar o segundo span com o input radio e o texto "Retirar"
    const spanRetirar = $('<span>', { style: 'margin-right: 20px;' });
    const radioRetirar = $('<input>', {
        type: 'radio',
        name: 'acao',
        id: 'checkRetirar',
        value: 'retirar'
    });
    spanRetirar.append(radioRetirar);
    spanRetirar.append(' Retirar');

    // Adicionar os spans com os inputs radio à div
    radioDiv.append(spanDistribuir);
    radioDiv.append(spanRetirar);

    // Adicionar a div com os inputs radio abaixo do primeiro span
    boxDiv.append(radioDiv);
    boxDiv.append('<br>');
    boxDiv.append('<br>');
    boxDiv.append('<hr>');
    boxDiv.append('<br>');



    function showAdditionalElements() {
        const selectedValue = $('input[name="acao"]:checked').val();
        const additionalDiv = $('#additionalDiv');

        // Limpar a div adicional
        additionalDiv.empty();

        if (selectedValue === 'distribuir') {
            const inputNumberDistribuir = $('<input>', { type: 'number', id: 'numberDistribuir' });
            const buttonDistribuir = $('<button>', { class: 'btn_padrao', id: 'btnDistribuir', text: 'Aplicar' });
            const labelTextDistribuir = $('<span>', { text: 'Insira a quantia a aplicar para cada local: ' });

            additionalDiv.append(labelTextDistribuir);
            additionalDiv.append(inputNumberDistribuir);
            additionalDiv.append(buttonDistribuir);
            buttonDistribuir.click(distributeMoney);
        } else if (selectedValue === 'retirar') {
            const inputNumberRetirar = $('<input>', { type: 'number', id: 'numberRetirar' });
            const buttonRetirar = $('<button>', { class: 'btn_padrao', id: 'btnRetirar', text: 'Retirar' });
            const labelTextRetirar = $('<span>', { text: 'Insira a quantia a retirar de cada local: ' });

            additionalDiv.append(labelTextRetirar);
            additionalDiv.append(inputNumberRetirar);
            additionalDiv.append(buttonRetirar);
            buttonRetirar.click(withdrawMoney);
        }
    }
    // Criar uma div para conter os elementos adicionais
    const additionalDiv = $('<div>', { id: 'additionalDiv' });

    // Adicionar a div com os elementos adicionais abaixo da div com os inputs radio
    boxDiv.append(additionalDiv);

    // Adicionar um manipulador de eventos 'change' aos inputs radio para detectar quando eles são selecionados
    $('input[name="acao"]').change(showAdditionalElements);


    // Adicionar um manipulador de eventos 'click' ao botão de distribuir
    $('#btnDistribuir').on('click', distributeMoney);

    async function distributeMoney() {
        const quantiaDistribuir = $('#numberDistribuir').val();
        console.log(`Valor da quantia a ser distribuída: ${quantiaDistribuir}`);

        const trCount = $('table.padrao tr:not(:first)').length; // Conta a quantidade de TRs, ignorando o cabeçalho

        if (quantiaDistribuir * trCount > valMaximoDistr) {
            alert(`A quantia a ser distribuída (${quantiaDistribuir * trCount}) é maior que o valor máximo disponível (${valMaximoDistr}). Diminua o valor da quantia a ser distribuída.`);
            return;
        }
        const iframeDistribuir = $('<iframe>', { id: 'iframeDistribuir', src: window.location.href, style: 'display:none;' });
        $('body').append(iframeDistribuir);
        console.log('Iframe de distribuição adicionado à página');

        let trIndex = 0;
        let completed = 0;
        let stopDistributing = false;

        async function processNextTr() {
            if (stopDistributing) {
                return;
            }

            const iframeContent = iframeDistribuir.contents();

            const table = iframeContent.find('table.padrao');
            console.log(`Tabela encontrada: ${table}`);

            const trs = table.find('tr:not(:first)'); // Ignorar o cabeçalho da tabela (primeira TR)
            console.log(`Número de TRs na tabela: ${trs.length}`);

            if (completed === trs.length) {
                // Todas as TRs foram processadas e a distribuição foi finalizada
                iframeDistribuir.remove();
                console.log('Iframe de distribuição removido da página');
                alert('Distribuição finalizada!');
                stopDistributing = true;
                window.location.reload();
                return;
            }

            const tr = trs[trIndex];
            const inputNumber = $(tr).find('input[type="number"][name="valor"]');
            const button = $(tr).find('input[type="submit"][name="distribuir_dinheiro"]');

            inputNumber.val(quantiaDistribuir);
            console.log(`Valor do inputNumber definido como ${quantiaDistribuir}`);

            button.click();
            console.log('Botão de distribuição clicado');

            trIndex++;
            completed++;

            // Remover o evento de load anterior para evitar chamadas múltiplas
            iframeDistribuir.off('load');
            // Adicionar um evento de load ao iframe para aguardar o carregamento antes de processar a próxima TR
            iframeDistribuir.on('load', processNextTr);
        }
        iframeDistribuir.on('load', processNextTr);
    }


  //-------------------------zona de retirar --------------------------zona


  // Adicionar um evento click ao botão de retirar
  btnRetirar.on('click', withdrawMoney);
    async function withdrawMoney() {
        const quantiaRetirar = $('#numberRetirar').val();
        console.log(`Valor da quantia a ser retirada: ${quantiaRetirar}`);

        const trCount = $('table.padrao tr:not(:first)').length; // Conta a quantidade de TRs, ignorando o cabeçalho

        const iframeRetirar = $('<iframe>', { id: 'iframeRetirar', src: window.location.href, style: 'display:none;' });
        $('body').append(iframeRetirar);
        console.log('Iframe de retirada adicionado à página');

        let trIndex = 0;
        let completed = 0;
        let stopWithdrawing = false;

        async function processNextTr() {
            if (stopWithdrawing) {
                return;
            }

            const iframeContent = iframeRetirar.contents();

            const table = iframeContent.find('table.padrao');
            console.log(`Tabela encontrada: ${table}`);

            const trs = table.find('tr:not(:first)'); // Ignorar o cabeçalho da tabela (primeira TR)
            console.log(`Número de TRs na tabela: ${trs.length}`);

            if (completed === trs.length) {
                // Todas as TRs foram processadas e a retirada foi finalizada
                iframeRetirar.remove();
                console.log('Iframe de retirada removido da página');
                alert('Retirada finalizada!');
                stopWithdrawing = true;
                window.location.reload();
                return;
            }

            const tr = trs[trIndex];
            const inputNumber = $(tr).find('input[type="number"][name="valor"]');
            const button = $(tr).find('input[type="submit"][name="distribuir_dinheiro"]');

            const minValue = parseFloat(inputNumber.attr('min'));
            const quantiaRetirarNegativa = quantiaRetirar * -1;
            let valueToWithdraw = quantiaRetirarNegativa;

            if (quantiaRetirarNegativa < minValue) {
                valueToWithdraw = minValue;
            }

            inputNumber.val(valueToWithdraw);
            console.log(`Valor do inputNumber definido como ${valueToWithdraw}`);

            button.click();
            console.log('Botão de retirada clicado');
            trIndex++;
            completed++;

            // Remover o evento de load anterior para evitar chamadas múltiplas
            iframeRetirar.off('load');
            // Adicionar um evento de load ao iframe para aguardar o carregamento antes de processar a próxima TR
            iframeRetirar.on('load', processNextTr);
        }

        iframeRetirar.on('load', processNextTr);
    }




})();