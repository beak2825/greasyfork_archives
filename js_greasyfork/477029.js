// ==UserScript==
// @name         Bypass1@1 reCAPTCHA and download PDF automatically
// @version      1.2
// @description  Bypasses the reCAPTCHA challenge on the website and downloads the PDF automatically.
// @author       Bard
// @match        https://doceru.com/doc/
// @grant        none
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477029/Bypass1%401%20reCAPTCHA%20and%20download%20PDF%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/477029/Bypass1%401%20reCAPTCHA%20and%20download%20PDF%20automatically.meta.js
// ==/UserScript==

(function() {
// Remove o bloqueador de anúncios da página.
document.querySelector("header#nex1sccv > div:nth-child(5) > div:nth-child(1) > div > section:nth-child(3) > div:nth-child(4)").remove();

// Seleciona o botão de download do PDF.
const downloadButton = document.querySelector("#dwn_btn");

// Cria um novo elemento iframe para carregar o PDF.
const iframe = document.createElement("iframe");
iframe.classList.add("google-doc");
iframe.id = "iframe1";
iframe.src = downloadButton.dataset.id;

// Adiciona o iframe ao documento.
document.querySelector("#pdf-holder").appendChild(iframe);

// Inicia o download do PDF.
iframe.onload = function() {
iframe.srcdoc = iframe.contentDocument.querySelector(".pdf-pro-plugin").outerHTML;

// Salva o PDF no local.
savePDFLocally(iframe.contentDocument.querySelector(".pdf-pro-plugin").outerHTML);
};
})();

// Função para salvar o PDF no local.
function savePDFLocally(pdfData) {
// Cria um novo arquivo PDF no local.
const pdfFile = new File([pdfData], "document.pdf", { type: "application/pdf" });

// Salva o arquivo PDF no local.
pdfFile.save();
}
