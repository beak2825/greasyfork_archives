// ==UserScript==
// @name         PEGAR ID's NA TELA REFATURAMENTO
// @namespace    https://sistemas.caesb/gcom/
// @version      1.0
// @description  Pega os IDs dinâmicos na tela de faturamento de conta
// @match        http://sistemas.caesb/gcom/app/faturamento/conta*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482298/PEGAR%20ID%27s%20NA%20TELA%20REFATURAMENTO.user.js
// @updateURL https://update.greasyfork.org/scripts/482298/PEGAR%20ID%27s%20NA%20TELA%20REFATURAMENTO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para obter ID dinâmico com base no texto
    function getDynamicIdByText(startingPattern, targetText, modif) {
        const elements = document.querySelectorAll('[id^="' + startingPattern + '"]');
        for (const element of elements) {
            const id = element.id;
            const elementText = element.textContent.trim();

            if (id && elementText.includes(targetText)) {
                if (modif > 0) {
                    // Extrai o número do ID atual (assumindo que o formato é "j_idtNNN")
                    const currentNumber = parseInt(id.match(/\d+/)[0]);
                    // Incrementa o número para obter o próximo número
                    const nextNumber = currentNumber + modif;
                    const idnew = id.replace(/\d+/, nextNumber);
                    return idnew;
                }
                return id;
            }
        }

        return null;
    }

    // Função para criar e executar o botão
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Obter IDs Dinâmicos';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', function() {
            const contaTitleElementID = getDynamicIdByText('j_idt', 'Conta', 0);
            const AttVencElementID = getDynamicIdByText('j_idt', 'Alterar Data Vencimento', 0);
            const textarea2idtID = getDynamicIdByText('formVencimento\\:j_idt', 'Justificativa: *', 1);
            const textareaidtID = getDynamicIdByText('formAlteracaoConta\\:j_idt', 'Justificativa: *', 1);
            const leitidtID = getDynamicIdByText('formAlteracaoConta\\:j_idt', 'Leitura: *', 2);
            const esgotomediaID = getDynamicIdByText('formAlteracaoConta:j_idt', 'Esgoto pela média?', 1);
            const leituracriadanaoID = getDynamicIdByText('formAlteracaoConta:j_idt', 'Leitura Criada:', 1);
            /*
            console.log("const contaTitleElement = document.querySelector('#"+contaTitleElementID+"_title');");
            console.log("const AttVencElement = document.querySelector('#"+AttVencElementID+"_title');");
            console.log("const textarea2idt = '#"+textarea2idtID+"';");
            console.log("const textareaidt = '#"+textareaidtID+"';");
            console.log("const leitidt = '#"+leitidtID+"';");
            console.log("const mediaesgoto = '#" + esgotomediaID + " > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)';");
            console.log("const leituracriadanao = '#" + leituracriadanaoID + " > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)';");
            */
            console.log(contaTitleElementID);
            console.log(AttVencElementID);
            console.log(textarea2idtID);
            console.log(textareaidtID);
            console.log(leitidtID);
            console.log(esgotomediaID);
            console.log(leituracriadanaoID);
        });

        document.body.appendChild(button);
    }

    // Cria o botão quando a página estiver carregada
    createButton();
})();
