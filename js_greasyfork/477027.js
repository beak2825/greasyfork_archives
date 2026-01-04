// ==UserScript==
// @name         Bypass reCAPTCHA to download PDFs and save to iPad
// @version      1.1
// @description  Bypasses the reCAPTCHA challenge on the website to download PDFs and save to iPad.
// @author       Bard
// @match        https://doceru.com/doc/*
// @grant        none
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477027/Bypass%20reCAPTCHA%20to%20download%20PDFs%20and%20save%20to%20iPad.user.js
// @updateURL https://update.greasyfork.org/scripts/477027/Bypass%20reCAPTCHA%20to%20download%20PDFs%20and%20save%20to%20iPad.meta.js
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

      // Cria o menu suspenso para salvar o PDF.
      const saveMenu = document.createElement("select");
      saveMenu.id = "save-menu";

      // Adiciona opções para salvar o PDF no local ou no iCloud.
      const localOption = document.createElement("option");
      localOption.value = "local";
      localOption.text = "Salvar no local";
      saveMenu.appendChild(localOption);

      const icloudOption = document.createElement("option");
      icloudOption.value = "icloud";
      icloudOption.text = "Salvar no iCloud";
      saveMenu.appendChild(icloudOption);

      // Adiciona o menu suspenso ao botão de download.
      downloadButton.appendChild(saveMenu);

      // Atribui um evento de mudança ao menu suspenso para salvar o PDF no local ou no iCloud.
      saveMenu.addEventListener("change", function() {
        const selectedValue = saveMenu.options[saveMenu.selectedIndex].value;

        if (selectedValue === "local") {
          // Salva o PDF no local.
          savePDFLocally(iframe.contentDocument.querySelector(".pdf-pro-plugin").outerHTML);
        } else if (selectedValue === "icloud") {
          // Salva o PDF no iCloud.
          savePDFToiCloud(iframe.contentDocument.querySelector(".pdf-pro-plugin").outerHTML);
        }
      });
    };
  });

  // Função para salvar o PDF no local.
  function savePDFLocally(pdfData) {
    // Cria um novo arquivo PDF no local.
    const pdfFile = new File([pdfData], "document.pdf", { type: "application/pdf" });

    // Salva o arquivo PDF no local.
    pdfFile.save();
  }

  // Função para salvar o PDF no iCloud.
  function savePDFToiCloud(pdfData) {
    // Cria um novo documento PDF no iCloud.
    const document = new PDFDocument();
    document.data = pdfData;

    // Salva o documento PDF no iCloud.
    document.saveToiCloud();
  }
})();