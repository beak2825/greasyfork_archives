// ==UserScript==
// @name         Bypass reCAPTCHA to download PDFs
// @version      1.0
// @description  Bypasses the reCAPTCHA challenge on the website to download PDFs.
// @author       Bard
// @match        https://doceru.com/doc
// @grant        none
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477025/Bypass%20reCAPTCHA%20to%20download%20PDFs.user.js
// @updateURL https://update.greasyfork.org/scripts/477025/Bypass%20reCAPTCHA%20to%20download%20PDFs.meta.js
// ==/UserScript==

(function() {
  // Seleciona o botão de download do PDF.
  const downloadButton = document.querySelector("#dwn_btn");

  // Adiciona um listener de eventos ao botão de download para ignorar o reCAPTCHA e baixar o PDF.
  downloadButton.addEventListener("click", function() {
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
    };
  });
})();