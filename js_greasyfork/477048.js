// ==UserScript==
// @name        Asdocs Auto PDF Download with Bypass
// @version       0.2
// @description  Baixa automaticamente qualquer PDF do Asdocs.net, mesmo que não haja tempo estimado de download e bypassa o tempo de espera.
// @author        Bard
// @match        https://elivros.love/livro/baixar-livro-oppenheimer-martin-sherwin-em-epub-pdf-mobi-ou-ler-online
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477048/Asdocs%20Auto%20PDF%20Download%20with%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/477048/Asdocs%20Auto%20PDF%20Download%20with%20Bypass.meta.js
// ==/UserScript==

(function() {
// Verifica se há um tempo estimado de download.
const estimatedDownloadTimeElement = document.querySelector(".estimated-download-time");
if (estimatedDownloadTimeElement) {
// Se houver, basta clicar no botão de download.
estimatedDownloadTimeElement.querySelector("a").click();
return;
}

// Se não houver tempo estimado de download, é necessário encontrar o link de download direto.
const downloadLink = document.querySelector(".download-link a");

// Faz o download do PDF.
window.open(downloadLink.href, "_blank");

// Bypass do tempo de espera
const delayElement = document.querySelector(".download-timer");
if (delayElement) {
delayElement.remove();
// Adiciona um delay de 1 segundo para garantir que o script tenha tempo de remover o elemento de tempo estimado de download antes de tentar baixar o PDF.
setTimeout(() => {
window.open(downloadLink.href, "_blank");
}, 1000);
} else {
// Se o elemento de tempo estimado de download não existir, simplesmente baixa o PDF imediatamente.
window.open(downloadLink.href, "_blank");
}
})();