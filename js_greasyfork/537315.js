// ==UserScript==
// @name         BF - Gerador de QR Code
// @name:pt-BR   BF - Gerador de QR Code
// @namespace    https://github.com/BrunoFortunatto
// @version      2.0
// @description  Gera um QR code da página atual e permite o download e compartilhamento, com um design centralizado e elegante.
// @description:pt-BR Gera um QR code da página atual e permite o download e compartilhamento (versão mobile)
// @author       Bruno Fortunato
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/537315/BF%20-%20Gerador%20de%20QR%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/537315/BF%20-%20Gerador%20de%20QR%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Garante que o script só execute no frame principal (evita duplicatas em iframes)
    if (window.top !== window.self) {
        console.log("BF QRcode (v1.8): Script detectado em iframe, interrompendo execução.");
        return;
    }

    console.log("BF QRcode (v1.8): Script principal executando.");

    // Adiciona o botão ao menu do Tampermonkey
    GM_registerMenuCommand("🔄 Gerar QR Code", function() {
        gerarQRCode();
    });

    // Função para criar e exibir o QR code
    function gerarQRCode() {
        // Se o QR code já estiver visível, não faz nada para evitar duplicatas
        if (document.getElementById("bf-qrcode-container")) {
            console.log("BF QRcode: Container do QR code já existe. Abortando nova criação.");
            return;
        }

        console.log("BF QRcode: Criando container principal do QR code.");

        // Criando o elemento do contêiner do QR code
        let qrDiv = document.createElement("div");
        qrDiv.id = "bf-qrcode-container";
        qrDiv.style.position = "fixed";
        qrDiv.style.top = "50%";
        qrDiv.style.left = "50%";
        qrDiv.style.transform = "translate(-50%, -50%)";
        qrDiv.style.background = "white";
        qrDiv.style.padding = "25px";
        qrDiv.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
        qrDiv.style.zIndex = "10000";
        qrDiv.style.borderRadius = "12px";
        qrDiv.style.display = "flex";
        qrDiv.style.flexDirection = "column";
        qrDiv.style.alignItems = "center";
        qrDiv.style.textAlign = "center";
        qrDiv.style.minWidth = "250px";
        qrDiv.style.maxWidth = "calc(100% - 40px)";
        qrDiv.style.maxHeight = "calc(100% - 40px)";

        // Criando o elemento para o QR code em si (onde o qrcode.js desenha)
        let qrCodeCanvasContainer = document.createElement("div");
        qrCodeCanvasContainer.id = "bf-qrcode-canvas-container";
        qrDiv.appendChild(qrCodeCanvasContainer);

        // Criando o QR code com tamanho otimizado para mobile
        let qrCode = new QRCode(qrCodeCanvasContainer, {
            text: window.location.href,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Contêiner para os botões para melhor controle de layout
        let buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "20px";
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.width = "100%";

        // Botão de compartilhamento
        console.log("BF QRcode: Criando botão de compartilhamento.");
        let shareBtn = document.createElement("button");
        shareBtn.innerText = "Compartilhar QR Code";
        shareBtn.style.cssText = `
            font-size: 16px;
            padding: 10px 15px;
            background-color: #007bff; /* Azul para compartilhar */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
        `;
        shareBtn.onmouseover = () => shareBtn.style.backgroundColor = "#0056b3";
        shareBtn.onmouseout = () => shareBtn.style.backgroundColor = "#007bff";

        // --- CORREÇÃO AQUI: Tornando a função onclick 'async' ---
        shareBtn.onclick = async function() {
            let canvas = qrCodeCanvasContainer.querySelector("canvas");
            if (!canvas) {
                alert("Não foi possível encontrar o QR Code para compartilhar.");
                return;
            }

            console.log("BF QRcode: Verificando suporte ao Web Share API...");
            const supportsShare = !!navigator.share;
            const supportsCanShare = !!navigator.canShare;
            const supportsFileShare = supportsCanShare && navigator.canShare({ files: [] });

            console.log(`BF QRcode: navigator.share disponível: ${supportsShare}`);
            console.log(`BF QRcode: navigator.canShare disponível: ${supportsCanShare}`);
            console.log(`BF QRcode: navigator.canShare({ files: [] }) retornou: ${supportsFileShare}`);


            if (supportsShare && supportsCanShare && supportsFileShare) {
                console.log("BF QRcode: Tentando compartilhar arquivo (imagem) via Web Share API...");
                canvas.toBlob(async function(blob) {
                    try {
                        const file = new File([blob], "QR_Code.png", { type: "image/png" });
                        await navigator.share({
                            files: [file],
                            title: 'QR Code da página atual',
                            text: 'Confira o QR Code para a página: ' + window.location.href,
                        });
                        console.log('BF QRcode: QR Code compartilhado com sucesso!');
                    } catch (error) {
                        console.error('BF QRcode: Erro ao compartilhar QR Code (via files):', error);
                        if (error.name === 'AbortError') {
                            console.log('BF QRcode: Compartilhamento cancelado pelo usuário.');
                        } else {
                            alert('Não foi possível compartilhar o QR Code (erro de arquivo). Erro: ' + error.message + '\nVocê ainda pode baixar a imagem e compartilhar manualmente.');
                        }
                    }
                }, 'image/png');
            } else if (supportsShare) {
                console.log("BF QRcode: Compartilhamento de arquivo não suportado. Tentando compartilhar URL da página...");
                try {
                    await navigator.share({ // Este 'await' agora é válido
                        title: 'QR Code da página atual',
                        text: 'Acesse este QR Code: ' + window.location.href,
                        url: window.location.href
                    });
                    console.log('BF QRcode: URL da página compartilhada com sucesso.');
                } catch (error) {
                    console.error('BF QRcode: Erro ao compartilhar URL da página:', error);
                    if (error.name === 'AbortError') {
                        console.log('BF QRcode: Compartilhamento de URL cancelado pelo usuário.');
                    } else {
                        alert('Não foi possível compartilhar a URL da página. Erro: ' + error.message);
                    }
                }
            } else {
                console.log("BF QRcode: Web Share API não suportada neste navegador/contexto.");
                alert("Seu navegador não suporta a função de compartilhamento. Por favor, baixe a imagem ou copie a URL da página e compartilhe manualmente.");
            }
        };

        // Botão de download
        let downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Baixar QR Code";
        downloadBtn.style.cssText = `
            font-size: 16px;
            padding: 10px 15px;
            background-color: #4CAF50; /* Verde vibrante */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
        `;
        downloadBtn.onmouseover = () => downloadBtn.style.backgroundColor = "#45a049";
        downloadBtn.onmouseout = () => downloadBtn.style.backgroundColor = "#4CAF50";

        downloadBtn.onclick = function() {
            let canvas = qrCodeCanvasContainer.querySelector("canvas");
            if (canvas) {
                let link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `QR_Code_${new URL(window.location.href).hostname.replace(/\./g, '_')}.png`;
                link.click();
            }
        };

        // Botão de fechar
        let closeBtn = document.createElement("button");
        closeBtn.innerText = "Fechar";
        closeBtn.style.cssText = `
            font-size: 16px;
            padding: 10px 15px;
            background-color: #f44336; /* Vermelho vibrante */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
        `;
        closeBtn.onmouseover = () => closeBtn.style.backgroundColor = "#da190b";
        closeBtn.onmouseout = () => closeBtn.style.backgroundColor = "#f44336";

        closeBtn.onclick = function() {
            document.body.removeChild(qrDiv);
        };

        // Adiciona os botões ao contêiner de botões (compartilhar primeiro)
        buttonContainer.appendChild(shareBtn);
        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(closeBtn);
        console.log("BF QRcode: Botões adicionados ao container de botões.");

        // Adiciona o contêiner de botões ao contêiner principal do QR
        qrDiv.appendChild(buttonContainer);

        // Adiciona o contêiner principal do QR ao corpo do documento
        document.body.appendChild(qrDiv);
        console.log("BF QRcode: Container principal do QR code adicionado ao body.");
    }
})();