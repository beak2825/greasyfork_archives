// ==UserScript==
// @name         ATIVIDADES CMSP UNIVERSAL
// @namespace    http://tampermonkey.net/
// @version      4.46
// @description  Para que fazer atividades na casa quando vc tem 9 aulas de estudos na escola?
// @author       você
// @match        *://*.ip.tv/*
// @match        *://saladofuturo.educacao.sp.gov.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508931/ATIVIDADES%20CMSP%20UNIVERSAL.user.js
// @updateURL https://update.greasyfork.org/scripts/508931/ATIVIDADES%20CMSP%20UNIVERSAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let div, openButton, closeButton, videoModeButton, warningDiv;
    let commentList = [];
    let typingInterval;

    function createDiv() {
        div = document.createElement('div');
        div.id = 'custom-comment-div';
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.right = '20px';
        div.style.width = '450px';
        div.style.height = '350px';
        div.style.backgroundColor = '#1e1e1e';
        div.style.color = '#f1f1f1';
        div.style.border = '2px solid #444';
        div.style.zIndex = '10000';
        div.style.overflow = 'auto';
        div.style.padding = '15px';
        div.style.borderRadius = '12px';
        div.style.boxShadow = '0 5px 20px rgba(0,0,0,0.7)';
        div.style.opacity = '0.95';
        div.style.display = 'none';
        div.style.transition = 'all 0.3s ease-in-out';
        document.body.appendChild(div);
    }

    function styleButton(button, bgColor, textColor, left, bottom) {
        button.style.position = 'fixed';
        button.style.left = left;
        button.style.bottom = bottom;
        button.style.backgroundColor = bgColor;
        button.style.color = textColor;
        button.style.border = 'none';
        button.style.borderRadius = '12px';
        button.style.padding = '15px 25px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10001';
        button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        button.style.transition = 'all 0.3s ease-in-out';
    }

    function createCloseButton() {
        closeButton = document.createElement('button');
        closeButton.textContent = 'Ocultar Resposta';
        styleButton(closeButton, '#f44336', '#fff', '20px', '70px');
        closeButton.addEventListener('click', () => {
            div.style.transform = 'translateY(50px)';
            div.style.opacity = '0';
            setTimeout(() => {
                div.style.display = 'none';
            }, 300);
            closeButton.style.display = 'none';
            openButton.style.display = 'block';
        });
        document.body.appendChild(closeButton);
    }

    function createOpenButton() {
        openButton = document.createElement('button');
        openButton.textContent = 'Abrir Resposta';
        styleButton(openButton, '#4CAF50', '#fff', '20px', '20px');
        openButton.addEventListener('click', () => {
            div.style.display = 'block';
            setTimeout(() => {
                div.style.transform = 'translateY(0)';
                div.style.opacity = '0.95';
            }, 50);
            openButton.style.display = 'none';
            closeButton.style.display = 'block';
        });
        document.body.appendChild(openButton);
    }

    function displayHtml(html) {
        if (!div) {
            createDiv();
            createOpenButton();
            createCloseButton();
        }

        if (!commentList.includes(html)) {
            commentList.push(html);
            div.innerHTML += `<hr><p>${html}</p>`;
            div.style.display = 'block';
            div.style.transform = 'translateY(50px)';
            setTimeout(() => {
                div.style.transform = 'translateY(0)';
                div.style.opacity = '0.95';
            }, 50);
            openButton.style.display = 'none';
            closeButton.style.display = 'block';
        }
    }

    function typeWriterEffect(element, text, delay = 15) {
        let index = 0;
        element.innerHTML = '';
        typingInterval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, delay);
    }

    function createClearButton() {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Limpar Respostas';
        styleButton(clearButton, '#2196F3', '#fff', '20px', '120px');
        clearButton.addEventListener('click', () => {
            div.innerHTML = '';
            commentList = [];
        });
        document.body.appendChild(clearButton);
    }

    function createWarning() {
        if (!warningDiv) {
            warningDiv = document.createElement('div');
            warningDiv.style.position = 'fixed';
            warningDiv.style.top = '50px';
            warningDiv.style.left = '50%';
            warningDiv.style.transform = 'translateX(-50%)';
            warningDiv.style.width = '450px';
            warningDiv.style.backgroundColor = '#1e1e1e';
            warningDiv.style.color = '#f1f1f1';
            warningDiv.style.border = '2px solid #444';
            warningDiv.style.padding = '15px';
            warningDiv.style.borderRadius = '12px';
            warningDiv.style.boxShadow = '0 5px 20px rgba(0,0,0,0.7)';
            warningDiv.style.zIndex = '10002';
            warningDiv.style.opacity = '0';
            warningDiv.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            warningDiv.innerHTML = `
                <strong>AVISO!</strong> <span id="warning-text"></span>
                <br><br>
                <button id="close-warning" style="background-color: #f44336; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer;">Fechar Aviso</button>
            `;
            document.body.appendChild(warningDiv);

            const warningText = `
                Os professores podem ver seus erros (essa informação pode ser falsa), portanto, o criador desse hack criou uma ferramenta que previne isso.
                Refaça a lição com as respostas: copie-as, abra um bloco de notas e cole. Após isso, refaça a lição com as mesmas respostas, só que certas, e espere 1 ou 2 minutos.
            `;

            typeWriterEffect(document.getElementById('warning-text'), warningText);

            document.getElementById('close-warning').addEventListener('click', () => {
                warningDiv.style.transform = 'translateY(-20px)';
                warningDiv.style.opacity = '0';
                setTimeout(() => {
                    warningDiv.style.display = 'none';
                }, 300);
            });

            setTimeout(() => {
                warningDiv.style.transform = 'translateY(0)';
                warningDiv.style.opacity = '1';
            }, 50);
        } else {
            warningDiv.style.display = 'block';
            setTimeout(() => {
                warningDiv.style.transform = 'translateY(0)';
                warningDiv.style.opacity = '1';
            }, 50);
        }
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('/question/') && url.includes('/correct')) {
            this.addEventListener('load', function() {
                try {
                    const responseJson = JSON.parse(this.responseText);
                    if (responseJson.comment && !commentList.includes(responseJson.comment)) {
                        displayHtml(responseJson.comment);
                        createClearButton();
                    }
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                }
            });
        }
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (url.includes('/question/') && url.includes('/correct')) {
            return originalFetch.apply(this, args).then(response => {
                return response.json().then(json => {
                    if (json.comment && !commentList.includes(json.comment)) {
                        displayHtml(json.comment);
                    }
                    return json;
                });
            });
        }
        return originalFetch.apply(this, args);
    };

    document.addEventListener('click', function(e) {
        if (
            e.target.textContent.includes('Finalizar') &&
            e.target.classList.contains('MuiButtonBase-root') &&
            e.target.classList.contains('MuiButton-root') &&
            e.target.classList.contains('MuiLoadingButton-root') &&
            e.target.classList.contains('MuiButton-contained') &&
            e.target.classList.contains('MuiButton-containedPrimary') &&
            e.target.classList.contains('MuiButton-sizeMedium') &&
            e.target.classList.contains('MuiButton-containedSizeMedium') &&
            e.target.classList.contains('MuiButton-colorPrimary') &&
            e.target.classList.contains('css-wfsvjm')
        ) {
            createWarning();
        }
    });

})();
