// ==UserScript==
// @name         Face Live Cam Enhanced
// @namespace    http://agressivemonkey.UserScript/
// @version      3.0
// @description  Substitui a câmera real por um vídeo ou imagem simulada com opções para upload do rosto, capa e página de identificação do passaporte, centralizando o conteúdo em 600x600
// @author       CTS (Enhanced)
// @match        https://idnvui.vfsglobal.com/*
// @match        https://visa.vfsglobal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530810/Face%20Live%20Cam%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/530810/Face%20Live%20Cam%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let faceRecognitionActive = false;
    let modoAtual = '';
    let canvasPrincipal;
    let ctxPrincipal;
    let activeStream = null;
    let frameRate = 30;
    let animationFrameId = null;
    let lastRandomTime = 0;
    let randomOffsetX = 0;
    let randomOffsetY = 0;
    function gerarMovimentoAleatorio() {
        const now = Date.now();
        if (now - lastRandomTime > 100) {
            randomOffsetX = Math.random() * 3 - 1.5;
            randomOffsetY = Math.random() * 3 - 1.5;
            lastRandomTime = now;
        }
        return { x: randomOffsetX, y: randomOffsetY };
    }
    function desenharOverlayFace(ctx, canvas) {
        const movimento = gerarMovimentoAleatorio();
        let boxWidth = 200;
        let boxHeight = 200;
        let x = (canvas.width - boxWidth) / 2 + movimento.x;
        let y = (canvas.height - boxHeight) / 2 + movimento.y;
        const opacidade = 0.7 + (Math.sin(Date.now() / 500) * 0.3);
        ctx.strokeStyle = `rgba(0, 255, 0, ${opacidade})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        ctx.fillStyle = `rgba(0, 255, 0, ${opacidade})`;
        ctx.font = '20px Arial';
        ctx.fillText('Face Detected', x, y - 10);
        const centerX = x + boxWidth / 2;
        const centerY = y + boxHeight / 2;
        ctx.beginPath();
        ctx.arc(centerX - 30, centerY - 20, 5, 0, Math.PI * 2);
        ctx.arc(centerX + 30, centerY - 20, 5, 0, Math.PI * 2);
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX, centerY + 10);
        ctx.moveTo(centerX - 25, centerY + 30);
        ctx.bezierCurveTo(
            centerX - 10, centerY + 40,
            centerX + 10, centerY + 40,
            centerX + 25, centerY + 30
        );
        ctx.stroke();
    }
    function drawCentered(ctx, source, sourceWidth, sourceHeight, canvasWidth, canvasHeight) {
        const scaleWidth = canvasWidth / sourceWidth;
        const scaleHeight = canvasHeight / sourceHeight;
        const scale = Math.max(scaleWidth, scaleHeight);
        const newWidth = sourceWidth * scale;
        const newHeight = sourceHeight * scale;
        const x = (canvasWidth - newWidth) / 2;
        const y = (canvasHeight - newHeight) / 2;
        const movimento = gerarMovimentoAleatorio();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(source, 0, 0, sourceWidth, sourceHeight,
                      x + movimento.x, y + movimento.y, newWidth, newHeight);
        if (Math.random() > 0.7) {
            adicionarRuido(ctx, canvasWidth, canvasHeight, 0.03);
        }
    }
    function adicionarRuido(ctx, width, height, intensidade) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const ruido = Math.floor(Math.random() * intensidade * 255);
            data[i] = Math.min(255, Math.max(0, data[i] + ruido));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + ruido));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + ruido));
        }
        ctx.putImageData(imageData, 0, 0);
    }
    function substituirCamera(url, tipo) {
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
        modoAtual = tipo;
        if (!canvasPrincipal) {
            canvasPrincipal = document.createElement('canvas');
            ctxPrincipal = canvasPrincipal.getContext('2d');
            canvasPrincipal.width = 600;
            canvasPrincipal.height = 600;
        }
        function desenharFrame(drawFunc) {
            ctxPrincipal.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
            drawFunc();
            if (faceRecognitionActive) {
                desenharOverlayFace(ctxPrincipal, canvasPrincipal);
            }
            animationFrameId = requestAnimationFrame(() => desenharFrame(drawFunc));
        }
        if (tipo === 'video') {
            let video = document.createElement('video');
            video.src = url;
            video.loop = true;
            video.muted = true;
            video.autoplay = true;
            video.onloadedmetadata = () => {
                video.play()
                    .then(() => {
                        desenharFrame(() => {
                            if (video.videoWidth && video.videoHeight) {
                                drawCentered(ctxPrincipal, video, video.videoWidth, video.videoHeight,
                                             canvasPrincipal.width, canvasPrincipal.height);
                            } else {
                                ctxPrincipal.drawImage(video, 0, 0, canvasPrincipal.width, canvasPrincipal.height);
                            }
                        });
                    })
                    .catch(err => {
                        console.error("Erro ao iniciar vídeo:", err);
                        substituirCamera(url, 'image');
                    });
            };
        } else {
            let img = new Image();
            img.src = url;
            img.onload = () => {
                desenharFrame(() => {
                    drawCentered(ctxPrincipal, img, img.width, img.height,
                                 canvasPrincipal.width, canvasPrincipal.height);
                });
            };
        }
        activeStream = canvasPrincipal.captureStream(frameRate);
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = async (constraints) => {
            console.log('Interceptando getUserMedia com constraints:', constraints);
            if (constraints && constraints.video) {
                console.log('Retornando stream falso');
                return activeStream;
            }
            return originalGetUserMedia.call(navigator.mediaDevices, constraints);
        };
        if (navigator.getUserMedia) {
            const originalNavigatorGetUserMedia = navigator.getUserMedia;
            navigator.getUserMedia = (constraints, success, error) => {
                if (constraints && constraints.video) {
                    success(activeStream);
                } else {
                    originalNavigatorGetUserMedia.call(navigator, constraints, success, error);
                }
            };
        }
        const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices;
        navigator.mediaDevices.enumerateDevices = async () => {
            const devices = await originalEnumerateDevices.call(navigator.mediaDevices);
            const temCamera = devices.some(device => device.kind === 'videoinput');
            if (!temCamera) {
                devices.push({
                    deviceId: "fake-camera-id",
                    groupId: "fake-camera-group",
                    kind: "videoinput",
                    label: "Camera Simulada"
                });
            }
            return devices;
        };
        console.log('Câmera falsa ativada para', tipo);
    }
    function toggleSidebar(sidebar, hamburgerButton) {
        const sidebarIsVisible = sidebar.style.display === 'block';
        if (sidebarIsVisible) {
            sidebar.style.display = 'none';
            hamburgerButton.style.display = 'flex';
        } else {
            sidebar.style.display = 'block';
            hamburgerButton.style.display = 'none';
        }
    }
    function init() {
        const sidebarAnterior = document.getElementById('fakelive-sidebar');
        const hamburgerAnterior = document.getElementById('fakelive-hamburger');
        if (sidebarAnterior) sidebarAnterior.remove();
        if (hamburgerAnterior) hamburgerAnterior.remove();
        let sidebar = document.createElement('div');
        sidebar.id = 'fakelive-sidebar';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.width = '250px';
        sidebar.style.height = '100%';
        sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        sidebar.style.color = '#00FF00';
        sidebar.style.borderRight = '2px solid #00FF00';
        sidebar.style.padding = '10px';
        sidebar.style.zIndex = '9999';
        sidebar.style.fontFamily = 'Arial, sans-serif';
        sidebar.style.overflowY = 'auto';
        sidebar.style.display = 'none';
        sidebar.style.transition = 'all 0.3s ease';
        let closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.width = '30px';
        closeButton.style.height = '30px';
        closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        closeButton.style.color = '#FF0000';
        closeButton.style.border = '2px solid #FF0000';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.fontSize = '16px';
        closeButton.style.transition = 'all 0.2s ease';
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        });
        sidebar.appendChild(closeButton);
        let titulo = document.createElement('h2');
        titulo.textContent = 'Face Live Cam';
        titulo.style.color = '#00FF00';
        titulo.style.textAlign = 'center';
        titulo.style.borderBottom = '1px solid #00FF00';
        titulo.style.paddingBottom = '10px';
        titulo.style.marginTop = '30px';
        sidebar.appendChild(titulo);
        let statusElement = document.createElement('div');
        statusElement.id = 'fakelive-status';
        statusElement.style.padding = '10px';
        statusElement.style.marginBottom = '15px';
        statusElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
        statusElement.style.border = '1px solid #00FF00';
        statusElement.style.borderRadius = '5px';
        statusElement.style.fontSize = '14px';
        statusElement.textContent = 'Status: Aguardando configuração';
        sidebar.appendChild(statusElement);
        let configTitle = document.createElement('h3');
        configTitle.textContent = 'Configurações';
        configTitle.style.color = '#00FF00';
        sidebar.appendChild(configTitle);
        let framerateLabel = document.createElement('label');
        framerateLabel.textContent = 'Frame Rate: ' + frameRate + ' fps';
        framerateLabel.style.display = 'block';
        framerateLabel.style.marginBottom = '5px';
        sidebar.appendChild(framerateLabel);
        let framerateSlider = document.createElement('input');
        framerateSlider.type = 'range';
        framerateSlider.min = '15';
        framerateSlider.max = '60';
        framerateSlider.value = frameRate;
        framerateSlider.style.width = '100%';
        framerateSlider.style.marginBottom = '15px';
        framerateSlider.addEventListener('input', () => {
            frameRate = parseInt(framerateSlider.value);
            framerateLabel.textContent = 'Frame Rate: ' + frameRate + ' fps';
            if (activeStream) {
                const currentUrl = activeStream.currentUrl;
                const currentTipo = activeStream.currentTipo;
                if (currentUrl && currentTipo) {
                    substituirCamera(currentUrl, currentTipo);
                }
            }
        });
        sidebar.appendChild(framerateSlider);
        let faceButton = document.createElement('button');
        faceButton.textContent = 'Reconhecimento Facial: OFF';
        faceButton.style.width = '100%';
        faceButton.style.padding = '10px';
        faceButton.style.marginBottom = '15px';
        faceButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        faceButton.style.color = '#00FF00';
        faceButton.style.border = '2px solid #00FF00';
        faceButton.style.borderRadius = '5px';
        faceButton.style.cursor = 'pointer';
        faceButton.style.transition = 'all 0.2s ease';
        faceButton.style.fontWeight = 'bold';
        faceButton.addEventListener('mouseover', () => {
            faceButton.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        });
        faceButton.addEventListener('mouseout', () => {
            faceButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        });
        faceButton.addEventListener('click', () => {
            faceRecognitionActive = !faceRecognitionActive;
            faceButton.textContent = faceRecognitionActive ? 'Reconhecimento Facial: ON' : 'Reconhecimento Facial: OFF';
            statusElement.textContent = `Status: ${modoAtual ? modoAtual.charAt(0).toUpperCase() + modoAtual.slice(1) : 'Aguardando'} | Facial: ${faceRecognitionActive ? 'ON' : 'OFF'}`;
        });
        sidebar.appendChild(faceButton);
        let separator = document.createElement('hr');
        separator.style.borderColor = '#00FF00';
        separator.style.margin = '15px 0';
        sidebar.appendChild(separator);
        let uploadTitle = document.createElement('h3');
        uploadTitle.textContent = 'Selecionar Conteúdo';
        uploadTitle.style.color = '#00FF00';
        sidebar.appendChild(uploadTitle);
        function criarBotaoEInput(textoBotao, accept, callback) {
            const containerId = 'container-' + textoBotao.toLowerCase().replace(/\s+/g, '-');
            let container = document.createElement('div');
            container.id = containerId;
            container.style.marginBottom = '15px';
            container.style.position = 'relative';
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.style.display = 'none';
            input.addEventListener('change', event => {
                const file = event.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    activeStream.currentUrl = url;
                    activeStream.currentTipo = file.type.startsWith('video') ? 'video' : 'image';
                    callback(url, activeStream.currentTipo);
                    statusElement.textContent = `Status: ${activeStream.currentTipo.charAt(0).toUpperCase() + activeStream.currentTipo.slice(1)} | Facial: ${faceRecognitionActive ? 'ON' : 'OFF'}`;
                    let filenameSpan = container.querySelector('.filename-display');
                    if (filenameSpan) {
                        filenameSpan.textContent = file.name;
                        filenameSpan.style.display = 'block';
                    }
                }
            });
            container.appendChild(input);
            let botao = document.createElement('button');
            botao.textContent = textoBotao;
            botao.style.width = '100%';
            botao.style.padding = '10px';
            botao.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            botao.style.color = '#00FF00';
            botao.style.border = '2px solid #00FF00';
            botao.style.borderRadius = '5px';
            botao.style.cursor = 'pointer';
            botao.style.transition = 'all 0.2s ease';
            botao.addEventListener('mouseover', () => {
                botao.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            });
            botao.addEventListener('mouseout', () => {
                botao.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            });
            botao.addEventListener('click', () => input.click());
            container.appendChild(botao);
            let filenameSpan = document.createElement('span');
            filenameSpan.className = 'filename-display';
            filenameSpan.style.display = 'none';
            filenameSpan.style.marginTop = '5px';
            filenameSpan.style.fontSize = '12px';
            filenameSpan.style.fontStyle = 'italic';
            filenameSpan.style.wordBreak = 'break-all';
            container.appendChild(filenameSpan);
            sidebar.appendChild(container);
        }
        criarBotaoEInput('Upload Rosto (Vídeo)', 'video/*', substituirCamera);
        criarBotaoEInput('Capa do Passaporte (Foto)', 'image/*', substituirCamera);
        criarBotaoEInput('Página de Identificação (Foto)', 'image/*', substituirCamera);
        let separator2 = document.createElement('hr');
        separator2.style.borderColor = '#00FF00';
        separator2.style.margin = '15px 0';
        sidebar.appendChild(separator2);
        let instructions = document.createElement('div');
        instructions.style.fontSize = '12px';
        instructions.style.color = '#CCC';
        instructions.style.padding = '10px';
        instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        instructions.style.borderRadius = '5px';
        instructions.innerHTML = `
            <p><strong>Instruções:</strong></p>
            <p>1. Selecione um arquivo para simular a câmera</p>
            <p>2. Ative o reconhecimento facial se necessário</p>
            <p>3. Ajuste o frame rate para maior realismo</p>
            <p>4. Clique no X para fechar o menu</p>
        `;
        sidebar.appendChild(instructions);
        document.body.appendChild(sidebar);
        let hamburgerButton = document.createElement('button');
        hamburgerButton.id = 'fakelive-hamburger';
        hamburgerButton.innerHTML = '&#9776;';
        hamburgerButton.style.position = 'fixed';
        hamburgerButton.style.top = '10px';
        hamburgerButton.style.left = '10px';
        hamburgerButton.style.width = '40px';
        hamburgerButton.style.height = '40px';
        hamburgerButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        hamburgerButton.style.color = '#00FF00';
        hamburgerButton.style.border = '2px solid #00FF00';
        hamburgerButton.style.borderRadius = '50%';
        hamburgerButton.style.cursor = 'pointer';
        hamburgerButton.style.zIndex = '10000';
        hamburgerButton.style.fontSize = '22px';
        hamburgerButton.style.display = 'flex';
        hamburgerButton.style.alignItems = 'center';
        hamburgerButton.style.justifyContent = 'center';
        hamburgerButton.style.transition = 'all 0.3s ease';
        hamburgerButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        hamburgerButton.addEventListener('mouseover', () => {
            hamburgerButton.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        });
        hamburgerButton.addEventListener('mouseout', () => {
            hamburgerButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        });
        document.body.appendChild(hamburgerButton);
        hamburgerButton.addEventListener('click', () => {
            toggleSidebar(sidebar, hamburgerButton);
        });
        closeButton.addEventListener('click', () => {
            toggleSidebar(sidebar, hamburgerButton);
        });
        canvasPrincipal = document.createElement('canvas');
        ctxPrincipal = canvasPrincipal.getContext('2d');
        canvasPrincipal.width = 600;
        canvasPrincipal.height = 600;
        ctxPrincipal.fillStyle = '#000000';
        ctxPrincipal.fillRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
        ctxPrincipal.fillStyle = '#00FF00';
        ctxPrincipal.font = '20px Arial';
        ctxPrincipal.textAlign = 'center';
        ctxPrincipal.fillText('Face Live Cam', canvasPrincipal.width/2, canvasPrincipal.height/2 - 20);
        ctxPrincipal.font = '16px Arial';
        ctxPrincipal.fillText('Selecione um arquivo para iniciar', canvasPrincipal.width/2, canvasPrincipal.height/2 + 20);
        activeStream = canvasPrincipal.captureStream(frameRate);
    }
    function injectMediaOverrides() {
        const originalGetUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
            ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
            : null;
        if (originalGetUserMedia) {
            window._originalGetUserMedia = originalGetUserMedia;
        }
        if (!canvasPrincipal) {
            canvasPrincipal = document.createElement('canvas');
            ctxPrincipal = canvasPrincipal.getContext('2d');
            canvasPrincipal.width = 600;
            canvasPrincipal.height = 600;
            ctxPrincipal.fillStyle = '#000';
            ctxPrincipal.fillRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
            ctxPrincipal.fillStyle = '#0F0';
            ctxPrincipal.font = '20px Arial';
            ctxPrincipal.textAlign = 'center';
            ctxPrincipal.fillText('Câmera em standby', canvasPrincipal.width/2, canvasPrincipal.height/2);
            activeStream = canvasPrincipal.captureStream(frameRate);
        }
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia = async (constraints) => {
                console.log('MediaDevices.getUserMedia interceptado', constraints);
                if (constraints && constraints.video && activeStream) {
                    console.log('Retornando stream falso');
                    return activeStream;
                }
                if (originalGetUserMedia) {
                    return originalGetUserMedia(constraints);
                }
                throw new Error('getUserMedia não suportado e nenhuma câmera falsa ativa');
            };
        }
        console.log('APIs de mídia interceptadas com sucesso');
    }
    if (document.body) {
        init();
        injectMediaOverrides();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            injectMediaOverrides();
        });
    }
    window.addEventListener('popstate', () => {
        setTimeout(() => {
            injectMediaOverrides();
        }, 1000);
         });
})();