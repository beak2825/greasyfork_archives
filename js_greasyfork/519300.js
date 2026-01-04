// ==UserScript==
// @name        Não sou ciumento, popmundo !
// @namespace   Violentmonkey Scripts
// @description Muda a opção de relacionamento para não sentir ciumes em todas as relações.
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Relations*
// @grant       none
// @license     M.I.T
// @version     1.8
// @downloadURL https://update.greasyfork.org/scripts/519300/N%C3%A3o%20sou%20ciumento%2C%20popmundo%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/519300/N%C3%A3o%20sou%20ciumento%2C%20popmundo%20%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let romanceCharacters = [];
    let iframe; // Iframe reutilizável
    let messageDiv; // Div para exibir mensagens

    function awaitIframeLoad(iframe) {
        return new Promise((resolve, reject) => {
            iframe.off("load error"); // Remove eventuais listeners antigos
            iframe.on("load", function() {
                resolve(iframe[0].contentDocument || iframe[0].contentWindow.document);
            });
            iframe.on("error", function() {
                reject(new Error("Erro ao carregar o iframe."));
            });
        });
    }

    async function openCharacterView(index) {
        if (index >= romanceCharacters.length) {
            messageDiv.html("Você não sente mais ciúmes de ninguém!");
            iframe.remove(); // Remove o iframe após o processamento
            return;
        }

        let character = romanceCharacters[index];
        messageDiv.html(`Você está conversando com <b>${character.name}</b>, dizendo que não sente ciúmes dele(a).`);

        iframe.attr("src", character.link);

        try {
            let iframeDoc = await awaitIframeLoad(iframe);

            let jealousySelect = jQuery(iframeDoc).find("#ctl00_cphTopColumn_ctl00_ddlSexCausesJealousy");
            let updateButton = jQuery(iframeDoc).find("#ctl00_cphTopColumn_ctl00_btnSexCausesJealousy");

            if (jealousySelect.length > 0) {
                jealousySelect.val("0").trigger("change");

                if (updateButton.length > 0) {
                    updateButton.trigger("click");
                }
            }
        } catch (error) {
            console.error(`Erro ao acessar o iframe para ${character.name}:`, error);
        } finally {
            setTimeout(() => openCharacterView(index + 1), 2000);
        }
    }

// Função principal para processar os personagens
function processCharacters(event) {
    event.preventDefault();

    romanceCharacters = [];

    jQuery("table.data tbody tr").each(function () {
        // Captura o progresso do romance
        let romanceBar = jQuery(this).find("td:nth-child(3) .progressBar");
        if (romanceBar.length > 0) {
            let romancePercentage = parseInt(romanceBar.attr("title")?.replace('%', '') || 0);

            // Verifica se o romance é maior que 20%
            if (romancePercentage > 20) {
                let characterName = jQuery(this).find("td:first-child a").text().trim(); // Atualizado para capturar diretamente do <a>
                let characterId = jQuery(this).find("td:first-child a").attr("href").split('/').pop();
                let viewLink = jQuery(this).find("td:nth-child(5) a").attr("href");

                // Adiciona o personagem à lista
                romanceCharacters.push({
                    name: characterName,
                    id: characterId,
                    link: viewLink
                });
            }
        }
    });

    // Atualiza a mensagem e inicia o processamento
    if (romanceCharacters.length > 0) {
        openCharacterView(0);
    } else {
        messageDiv.html("Nenhum personagem com romance maior que 20% foi encontrado.");
    }
}


    // Adiciona o botão acima da tabela
    jQuery("<button>", {
        text: "Não sou ciumento, popmundo!",
        class: "cnf",
        css: {
            display: "block",
            margin: "10px auto",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center"
        },
        click: processCharacters
    }).insertBefore("table.data");

    // Adiciona a div para mensagens abaixo do botão
    messageDiv = jQuery("<div>", {
        id: "ciumesMessage",
        css: {
            marginTop: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#555"
        }
    }).insertAfter("button.cnf");

    // Cria o iframe no início e o mantém oculto
    iframe = jQuery("<iframe>", {
        id: "characterViewIframe",
        css: {
            width: "800px",
            height: "600px",
            display: "none"
        }
    }).appendTo("body");

})();
