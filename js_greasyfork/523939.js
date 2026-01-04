// ==UserScript==
// @name         Extrator de Coordenadas
// @namespace    adriel45dev.github.io
// @version      1.1
// @description  Extrai coordenadas automaticamente / ceneged
// @author       Adriel Alves
// @match        https://cenegedpa.gpm.srv.br/gpm/geral/checklists_relatorio.php
// @grant        GM_xmlhttpRequest
// @connect      s3-cenegedpa.s3.amazonaws.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523939/Extrator%20de%20Coordenadas.user.js
// @updateURL https://update.greasyfork.org/scripts/523939/Extrator%20de%20Coordenadas.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Cria e adiciona o CSS
  const style = document.createElement("style");
  style.textContent = `
        .coordinate-extractor {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 400px;
        }
        .coordinate-extractor button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            border-radius: 3px;
        }
        .coordinate-extractor button:hover {
            background: #45a049;
        }
        .coordinate-preview {
            margin-top: 10px;
            max-width: 300px;
        }
        .coordinate-preview canvas {
            max-width: 100%;
        }
        .coordinate-result {
            margin-top: 10px;
            font-weight: bold;
            word-wrap: break-word;
        }
        .debug-info {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .radio-button-container {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .radio-button-container img {
            max-width: 100px;
            margin-right: 10px;
        }
    `;
  document.head.appendChild(style);

  // Cria e adiciona a interface
  const panel = document.createElement("div");
  panel.className = "coordinate-extractor";
  panel.innerHTML = `
        <button id="processSelectedImage">Processar Imagem Selecionada</button>
        <div id="previewArea" class="coordinate-preview"></div>
        <div id="resultArea" class="coordinate-result"></div>
        <div id="debugInfo" class="debug-info"></div>
    `;
  document.body.appendChild(panel);

  async function fetchImageAsBlob(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        onload: function (response) {
          resolve(response.response);
        },
        onerror: function (error) {
          reject(new Error("Erro ao buscar imagem: " + error.statusText));
        },
      });
    });
  }

  async function loadFullSizeImage(imgElement) {
    try {
      const debugInfo = document.getElementById("debugInfo");

      const fullUrl = imgElement.src;

      debugInfo.textContent = `Tentando carregar: ${fullUrl}`;

      const blob = await fetchImageAsBlob(fullUrl);
      const imgUrl = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          debugInfo.textContent = `Imagem carregada: ${img.naturalWidth}x${img.naturalHeight}`;
          resolve(img);
        };
        img.onerror = () => reject(new Error("Erro ao carregar imagem"));
        img.src = imgUrl;
      });
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      throw error;
    }
  }

  async function processImage(imageElement) {
    const resultArea = document.getElementById("resultArea");
    const previewArea = document.getElementById("previewArea");
    const debugInfo = document.getElementById("debugInfo");

    try {
      resultArea.textContent = "Processando...";
      debugInfo.textContent = "Iniciando processamento...";

      const fullImg = await loadFullSizeImage(imageElement);

      debugInfo.textContent = `Imagem carregada com sucesso. Dimensões: ${fullImg.naturalWidth}x${fullImg.naturalHeight}`;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = fullImg.naturalWidth;
      canvas.height = fullImg.naturalHeight;
      ctx.drawImage(fullImg, 0, 0);

      const width = canvas.width;
      const height = canvas.height;
      let top = Math.round(height * (855 / 900));
      const roiWidth = Math.round(width * 0.4);
      const roiHeight = Math.round(height * 0.05);
      const left = 0;

      debugInfo.textContent = `ROI calculado: ${left},${top} ${roiWidth}x${roiHeight}`;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, roiWidth, roiHeight);

      const roiData = ctx.getImageData(left, top, roiWidth, roiHeight);
      const processedData = new ImageData(
        new Uint8ClampedArray(roiData.data),
        roiWidth,
        roiHeight
      );

      const data = processedData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = avg > 200 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
      }

      const roiCanvas = document.createElement("canvas");
      roiCanvas.width = roiWidth;
      roiCanvas.height = roiHeight;
      roiCanvas.getContext("2d").putImageData(processedData, 0, 0);

      previewArea.innerHTML = "";
      previewArea.appendChild(roiCanvas);

      debugInfo.textContent = "Iniciando OCR...";

      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      await worker.setParameters({
        tessedit_char_whitelist: "0123456789,.-NSEWL°'\"()[]{}",
        tessedit_pageseg_mode: "7",
        tessedit_ocr_engine_mode: "1",
      });

      const result = await worker.recognize(roiCanvas);
      await worker.terminate();

      if (result.data.text.trim()) {
        resultArea.textContent = `Coordenadas: ${result.data.text.trim()}`;
        debugInfo.textContent = "Processamento concluído com sucesso";
      } else {
        resultArea.textContent = "Nenhuma coordenada encontrada na imagem";
        debugInfo.textContent = "OCR não encontrou texto";
      }
    } catch (error) {
      resultArea.textContent = `Erro: ${error.message}`;
      debugInfo.textContent = `Erro detalhado: ${error.stack || error.message}`;
      console.error("Erro completo:", error);
    }
  }

  function addRadioButtonsToImages() {
    const images = document.querySelectorAll('img[src^="https://s3-cenegedpa.s3.amazonaws.com/imagens/"]');
    images.forEach((imgElement, index) => {

      const imgElementPosition = imgElement.closest("div").parentElement;
      // Cria o contêiner do botão de rádio
      const radioButtonContainer = document.createElement("div");
      radioButtonContainer.className = "radio-button-container";

      // Cria o botão de rádio
      const radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "imageSelection";
      radioButton.value = imgElement.src;
      radioButton.id = `image-${index}`;

      // Cria o rótulo e anexa a imagem sem cloná-la
      const label = document.createElement("label");
      label.setAttribute("for", `image-${index}`);
      label.textContent = "";

      // Anexa o botão de rádio ao lado da imagem
      radioButtonContainer.appendChild(radioButton);
      radioButtonContainer.appendChild(label);

      // Insere o contêiner ao lado da imagem original
      imgElementPosition.insertBefore(radioButtonContainer, imgElement.nextSibling);
    });
  }

  document.getElementById("processSelectedImage").addEventListener("click", async () => {
    const selectedImageUrl = document.querySelector('input[name="imageSelection"]:checked')?.value;

    if (selectedImageUrl) {
      const imgElement = document.createElement("img");
      imgElement.src = selectedImageUrl;
      await processImage(imgElement);
    } else {
      document.getElementById("resultArea").textContent = "Nenhuma imagem selecionada";
      document.getElementById("debugInfo").textContent = "Por favor, selecione uma imagem antes de processar.";
    }
  });

  // Adiciona os botões de rádio assim que o script for executado
  addRadioButtonsToImages();
})();
