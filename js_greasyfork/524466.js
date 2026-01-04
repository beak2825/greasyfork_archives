// ==UserScript==
// @name        Locale Money Manager
// @namespace   Violentmonkey Scripts
// @match       https://*.popmundo.com/World/Popmundo.aspx/Company/LocaleMoneyTransfer*
// @grant       none
// @version     1.0
// @author      drinkwater
// @description A tool to manage money transfers between a company and its locales in Popmundo.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524466/Locale%20Money%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/524466/Locale%20Money%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aguarda o carregamento completo da página
    jQuery(document).ready(function() {
        // Variável global para armazenar os fundos disponíveis
        let availableFunds = 0;

        // Extrai os fundos disponíveis da div principal
        const fundsText = jQuery("#ppm-content p:nth-of-type(2) strong").text();
        if (fundsText) {
            availableFunds = parseFloat(fundsText.replace(/[^\d,]/g, '').replace(',', '.'));
            console.log("Fundos disponíveis:", availableFunds);
        }

        // Seleciona o elemento `tablelocales`
        const tableLocales = jQuery("#tablelocales");

        // Verifica se o elemento existe
        if (tableLocales.length) {
            // Cria a nova div com a classe `box`
            const newDiv = jQuery("<div>").addClass("box");

            // Adiciona a imagem no topo da nova div


            // Adiciona o h2 dentro da nova div
            const newH2 = jQuery("<h2>").text("Locale Money Manager");
            newDiv.append(newH2);
           const imageElement = jQuery("<p>").css("text-align", "center").html('<img src="https://i.imgur.com/bY04Hxo.png" width="100px" alt="Logo">');
            newDiv.append(imageElement);
            // Adiciona o parágrafo explicativo com melhorias
            const hintParagraph = jQuery("<p>")
                .html("<strong>Instruções:</strong> Utilize este campo para transferir dinheiro entre sua companhia e os locais controlados por ela. <br>"
                    + "Digite um valor <strong>positivo</strong> para transferir dinheiro <strong>da companhia para os locais</strong>. <br>"
                    + "Digite um valor <strong>negativo</strong> para transferir dinheiro <strong>dos locais para a companhia</strong>. <br>"
                    + "Clique no botão <strong>Preencher</strong> para aplicar o valor a todos os locais listados abaixo. <br>"
                    + "Caso o checkbox esteja marcado, o script ajustará automaticamente o valor máximo possível para os locais sem saldo suficiente.");
            newDiv.append(hintParagraph);

            // Adiciona o input number dentro da nova div com um atributo customizado
            const inputNumber = jQuery("<input>")
                .attr("type", "number")
                .attr("min", "0")
                .attr("placeholder", "Digite um valor inteiro")
                .attr("class", "round width100px")
                .attr("data-custom-input", "true"); // Atributo para diferenciá-lo
            newDiv.append(inputNumber);

            // Adiciona o botão de submit dentro da nova div
            const inputSubmit = jQuery("<input>")
                .attr("type", "button") // Altera para "button" para evitar envio de formulário
                .attr("value", "Preencher")
                .on("click", function(event) {
                    event.preventDefault();

                    const inputValue = parseFloat(inputNumber.val()) || 0;

                    // Validação de fundos totais
                    if (inputValue > 0 && availableFunds < inputValue * localeData.length) {
                        alert("Saldo insuficiente na companhia para esta operação.");
                        return;
                    }

                    // Validação de fundos individuais
                    if (inputValue < 0 && !jQuery("#removePartial").is(":checked")) {
                        const insufficientLocales = localeData.filter(locale => locale.moneyAvailable + inputValue < 0);
                        if (insufficientLocales.length > 0) {
                            alert("Os seguintes locais não possuem caixa suficiente para essa operação:\n" + insufficientLocales.map(locale => locale.localeName).join("\n"));
                            return;
                        }
                    }

                    // Preenche os valores nos inputs correspondentes
                    localeData.forEach(locale => {
                        if (jQuery("#removePartial").is(":checked") && inputValue < 0) {
                            const valueToFill = Math.min(Math.abs(inputValue), locale.moneyAvailable);
                            jQuery(`#${locale.inputId}`).val(-valueToFill);
                        } else {
                            jQuery(`#${locale.inputId}`).val(inputValue);
                        }
                    });
                    inputNumber.val(0);
                });
            newDiv.append(inputSubmit);

            // Adiciona o checkbox com texto explicativo
            const checkboxDiv = jQuery("<div>");
            const inputCheckbox = jQuery("<input>")
                .attr("type", "checkbox")
                .attr("id", "removePartial");
            const checkboxLabel = jQuery("<label>")
                .attr("for", "removePartial")
                .text(" Se não houver dinheiro suficiente no local, remover o disponível.");
            checkboxDiv.append(inputCheckbox).append(checkboxLabel);
            newDiv.append(checkboxDiv);

            // Adiciona o parágrafo para exibir os fundos disponíveis e o saldo atualizado
            const fundsParagraph = jQuery("<p>").html(`Projeção do caixa da CIA: <strong id="updatedFunds">${availableFunds.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} M$</strong>`);
            const warningMessage = jQuery("<span>")
                .attr("id", "warningMessage")
                .css({ color: "red", display: "none" })
                .text(" - Você não terá dinheiro suficiente.");
            fundsParagraph.append(warningMessage);
            newDiv.append(fundsParagraph);

            // Adiciona a lista para locais com caixa insuficiente
            const insufficientFundsList = jQuery("<ul>").attr("id", "insufficientFundsList").css("color", "red");
            newDiv.append(insufficientFundsList);

            // Insere a nova div imediatamente acima do elemento `tablelocales`
            tableLocales.before(newDiv);

            // Extrai os dados da tabela
            const localeData = [];
            tableLocales.find("tbody tr").each(function() {
                const row = jQuery(this);
                const localeId = row.find("input[type='hidden']").val();
                const localeName = row.find("td:first-child a").text();
                const moneyAvailable = parseFloat(row.find("td:nth-child(2)").text().replace(/[^\d,]/g, '').replace(',', '.'));
                const inputId = row.find("input[type='text']").attr("id");

                localeData.push({
                    localeId: localeId,
                    localeName: localeName,
                    moneyAvailable: moneyAvailable,
                    inputId: inputId
                });
            });

            console.log("Dados extraídos:", localeData);

            // Atualiza os fundos disponíveis com base no valor digitado
            inputNumber.on("input", function() {
                const inputValue = parseFloat(inputNumber.val()) || 0;
                const totalCost = inputValue * localeData.length;
                const updatedFunds = availableFunds - totalCost;

                const updatedFundsElement = jQuery("#updatedFunds");
                const warningMessageElement = jQuery("#warningMessage");
                const insufficientFundsListElement = jQuery("#insufficientFundsList");

                updatedFundsElement.text(updatedFunds.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + " M$");

                if (updatedFunds < 0) {
                    updatedFundsElement.css("color", "red");
                    warningMessageElement.show();
                } else {
                    updatedFundsElement.css("color", "");
                    warningMessageElement.hide();
                }

                // Verifica os locais com caixa insuficiente
                insufficientFundsListElement.empty();
                if (inputValue < 0) {
                    localeData.forEach(locale => {
                        const projectedFunds = locale.moneyAvailable + inputValue;
                        if (projectedFunds < 0) {
                            insufficientFundsListElement.append(jQuery("<li>").text(`${locale.localeName} não terá caixa suficiente.`));
                        }
                    });
                }
            });
        }
    });
})();
