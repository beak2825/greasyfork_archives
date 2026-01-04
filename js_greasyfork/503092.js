// ==UserScript==
// @name         Gerar XLSX com CNPJ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para gerar XLSX com informações de ações e CNPJ no StatusInvest
// @author       Seu Nome
// @match        https://statusinvest.com.br/carteira/patrimonio
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @connect      statusinvest.com.br
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/503092/Gerar%20XLSX%20com%20CNPJ.user.js
// @updateURL https://update.greasyfork.org/scripts/503092/Gerar%20XLSX%20com%20CNPJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para buscar o CNPJ de um ticker usando GM_xmlhttpRequest
    async function getCNPJ(ticker) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://statusinvest.com.br/acoes/${ticker}`,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const cnpjElement = doc.querySelector('small.d-block.fs-4.fw-100.lh-4');
                        resolve(cnpjElement ? cnpjElement.textContent.trim() : '');
                    } else {
                        reject('Erro ao buscar CNPJ');
                    }
                },
                onerror: function() {
                    reject('Erro ao buscar CNPJ');
                }
            });
        });
    }

    // Função para gerar o arquivo XLSX
    async function gerarXLSX() {
        var tickers = document.querySelectorAll('span.ticker.truncate.waves-effect');
        var precosMedios = document.querySelectorAll('td[data-key="unitValue"]');
        var quantidades = document.querySelectorAll('td[data-key="quantity"]');

        var data = [["TICKER", "PREÇO MÉDIO", "QUANTIDADE", "CNPJ"]];

        for (var i = 0; i < tickers.length; i++) {
            var valorTicker = tickers[i] ? tickers[i].textContent.trim() : '';
            var valorPrecoMedio = precosMedios[i] ? precosMedios[i].textContent.replace('R$ ', '').trim() : '';
            var valorQuantidade = quantidades[i] ? quantidades[i].textContent.trim() : '';

            var cnpj = await getCNPJ(valorTicker);

            data.push([valorTicker, valorPrecoMedio, valorQuantidade, cnpj]);
        }

        var worksheet = XLSX.utils.aoa_to_sheet(data);
        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

        XLSX.writeFile(workbook, "dados.xlsx");
    }

    // Função para criar e adicionar um novo botão
    function addNewButton() {
        const container = document.querySelector('.d-flex.flex-wrap.flex-sm-nowrap.align-items-center.justify-end.w-100.w-lg-70.w-xl-65.w-xxl-55.w-xxxl-50');
        if (container) {
            const newButton = document.createElement('button');
            newButton.title = "Baixar";
            newButton.type = "button";
            newButton.className = "btn btn-main-green ml-2 pl-2 pr-2";
            newButton.innerHTML = '<i class="material-icons">cloud_download</i>';

            // Adiciona o evento de clique ao novo botão
            newButton.addEventListener('click', function(event) {
                event.preventDefault(); // Previne o comportamento padrão do botão
                gerarXLSX();
            });

            container.appendChild(newButton);
        }
    }

    // Adiciona o novo botão ao carregar o script
    addNewButton();
})();