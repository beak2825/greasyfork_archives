// ==UserScript==
// @name         Assinador Helper
// @version      0.4
// @author       Maycon Moura
// @description  Maycon Moura
// @match        https://assinador.iti.br/assinatura/index.xhtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iti.br
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @namespace    https://greasyfork.org/users/152613
// @downloadURL https://update.greasyfork.org/scripts/518868/Assinador%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/518868/Assinador%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL do PDF
    const pdfUrl = "https://www.sincond.com.br/hn/wp-content/uploads/2021/11/LEI-3511-2020-Niter%C3%B3i-RJ..pdf";

    // Seletor do input de arquivo
    const inputSelector = '.uploadArquivoClick input[type=file]'; // Atualize o seletor, se necessário
    const fileInput = document.querySelector(inputSelector);

    if (!fileInput) {
        console.error("Input de arquivo não encontrado na página.");
        return;
    }

    // Função para baixar o arquivo e processá-lo
    GM_xmlhttpRequest({
        method: "GET",
        url: pdfUrl,
        responseType: "arraybuffer", // Necessário para trabalhar com dados binários
        onload: function(response) {
            console.log("PDF baixado com sucesso!");

            // Cria um Blob a partir do ArrayBuffer
            const pdfBlob = new Blob([response.response], { type: "application/pdf" });

            // Cria um arquivo a partir do Blob
            const pdfFile = new File([pdfBlob], "LEI-3511-2020-Niteroi-RJ.pdf", { type: "application/pdf" });

            // Cria um DataTransfer para simular a seleção do arquivo
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(pdfFile);

            // Insere o arquivo no input
            fileInput.files = dataTransfer.files;

            console.log("Arquivo inserido com sucesso:", fileInput.files[0]);
            $('.uploadArquivoClick input[type=file]').change()
        },
        onerror: function(error) {
            console.error("Erro ao baixar o PDF:", error);
        }
    });


    $('[id="resultForm:infoBeforeDocView"] .custom_chk_div_cls').hide();
    $('[onclick="onClickAssinarHandle()"]').attr('onclick', 'assinarDocumento()');
})();
