// ==UserScript==
// @name      Baixar PDF automaticamente
// @version    0.1
// @description  Baixa automaticamente qualquer PDF de acordo com o código fornecido.
// @author      Bard
// @match       https://elivros.love/
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477046/Baixar%20PDF%20automaticamente.user.js
// @updateURL https://update.greasyfork.org/scripts/477046/Baixar%20PDF%20automaticamente.meta.js
// ==/UserScript==

(function() {
// Seleciona o elemento que contém o tempo estimado para download.
var estimatedDownloadTimeElement = document.querySelector("div.div-table-row.middle > div.div-table-col.first > a");

// Seleciona o elemento que contém o link para download do PDF.
var downloadLinkElement = document.querySelector("div.div-table-row.middle > div.div-table-col > a.link.premiumBtn");

// Se o tempo estimado para download for igual a 0 segundos, baixa o PDF automaticamente.
if (estimatedDownloadTimeElement.textContent === "0 segundos") {
downloadLinkElement.click();
}
})();