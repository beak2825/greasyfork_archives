// ==UserScript==
// @name         Situação Cadastral Free by Nice
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Receita Federal Free.
// @author       Nice
// @match        https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505952/Situa%C3%A7%C3%A3o%20Cadastral%20Free%20by%20Nice.user.js
// @updateURL https://update.greasyfork.org/scripts/505952/Situa%C3%A7%C3%A3o%20Cadastral%20Free%20by%20Nice.meta.js
// ==/UserScript==

// Created by Nice <3

(function () {
    'use strict';

    function naomexer(encodedStr) {
        return decodeURIComponent(escape(atob(encodedStr)));
    }

    function getRandomFrase() {
        const frases = [
            "Foi de arrasta pra cima"
        ];
        return frases[Math.floor(Math.random() * frases.length)];
    }

    function handlePublicaPage() {
        let resultadosRegulares = [];

        function clearAndApplyChanges(previousResult) {
            setTimeout(() => {
                document.body.innerHTML = '';
                document.body.style.backgroundColor = 'black';
                document.body.style.backgroundImage = 'url("https://cdn.pixabay.com/photo/2014/06/16/23/39/black-370118_1280.png")';
                document.body.style.backgroundSize = 'cover';
                document.body.style.display = 'flex';
                document.body.style.flexDirection = 'column';
                document.body.style.alignItems = 'center';
                document.body.style.justifyContent = 'center';
                document.body.style.height = '100vh';
                document.body.style.margin = '0';
                document.body.style.padding = '20px';
                document.body.style.boxSizing = 'border-box';

                var container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.backgroundColor = '#000000';
                container.style.color = '#ffffff';
                container.style.padding = '20px';
                container.style.borderRadius = '10px';
                container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
                container.style.boxSizing = 'border-box';
                container.style.width = '100%';
                container.style.maxWidth = '800px';

                var title = document.createElement('h2');
                title.textContent = naomexer('TmljZSA8Mw==');
                title.style.marginBottom = '20px';
                title.style.color = '#ffffff';
                title.style.animation = 'rainbow-text 2s infinite linear';
                container.appendChild(title);

                var formResultContainer = document.createElement('div');
                formResultContainer.style.display = 'flex';
                formResultContainer.style.flexDirection = 'row';
                formResultContainer.style.width = '100%';
                formResultContainer.style.justifyContent = 'space-between';
                formResultContainer.style.alignItems = 'flex-start';

                var style = document.createElement('style');
                style.textContent = `
                    @keyframes rainbow-text {
                        0% { color: red; }
                        14% { color: orange; }
                        28% { color: yellow; }
                        42% { color: green; }
                        57% { color: blue; }
                        71% { color: indigo; }
                        85% { color: violet; }
                        100% { color: red; }
                    }

                    .input-container {
                        margin: 10px 0;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .form {
                        --width-of-input: 200px;
                        --border-height: 1px;
                        --border-before-color: rgba(221, 221, 221, 0.39);
                        --border-after-color: #8f34eb;
                        --input-hovered-color: #8f34eb1f;
                        position: relative;
                        width: var(--width-of-input);
                        margin-left: 90px;
                        margin-bottom: 15px;
                    }
                    .input {
                        color: #dda0eb;
                        font-size: 0.9rem;
                        background-color: black;
                        width: 100%;
                        box-sizing: border-box;
                        padding-inline: 0.5em;
                        padding-block: 0.7em;
                        border: none;
                        border-bottom: var(--border-height) solid var(--border-before-color);
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                    .input-border {
                        position: absolute;
                        background: var(--border-after-color);
                        width: 0%;
                        height: 2px;
                        bottom: 0;
                        left: 0;
                        transition: 0.3s;
                    }
                    input:hover {
                        background: var(--input-hovered-color);
                    }
                    input:focus {
                        outline: none;
                        background-color: black !important;
                    }
                    input:focus ~ .input-border {
                        width: 100%;
                    }

                    button {
                      font-family: monospace;
                      font-size: 1.5rem;
                      color: #FAFAFA;
                      text-transform: uppercase;
                      padding: 10px 20px;
                      border-radius: 10px;
                      border: 2px solid #616161;
                      background: black;
                      box-shadow: 3px 3px #616161;
                      cursor: pointer;
                      margin: 10px 0;
                    }

                    button:active {
                      box-shadow: none;
                      transform: translate(3px, 3px);
                    }

                    .h-captcha {
                        position: relative;
                        width: 130px;
                        height: 32px;
                        overflow: hidden;
                        margin: 0 auto;
                        background-color: black;
                        border: 1px solid #8f34eb;
                        padding: 5px;
                        box-sizing: border-box;
                    }

                    .h-captcha iframe {
                        opacity: 0.8;
                        position: absolute;
                        top: -13px;
                        left: 0;
                        transform: scale(0.9);
                        transform-origin: 0 0;
                        width: 300px;
                        height: 100px;
                        border-radius: 5px;
                    }

                    @media (max-width: 767px) {
                        .formResultContainer {
                            flex-direction: column;
                        }

                        #resultContainer {
                            margin-top: 20px;
                            margin-left: 0;
                        }
                    }
                `;
                document.head.appendChild(style);

                var formContainer = document.createElement('div');
                formContainer.style.flex = '1';
                formContainer.style.maxWidth = '400px';
                formContainer.style.marginRight = '20px';

                var form = document.createElement('form');
                form.id = 'theForm';
                form.name = 'frmConsultaPublica';
                form.method = 'POST';

                var cpfContainer = document.createElement('div');
                cpfContainer.className = 'form';
                form.appendChild(cpfContainer);

                var cpfInput = document.createElement('input');
                cpfInput.type = 'text';
                cpfInput.name = 'txtCPF';
                cpfInput.className = 'input';
                cpfInput.placeholder = 'CPF';
                cpfInput.required = true;
                cpfInput.maxLength = '14';
                cpfContainer.appendChild(cpfInput);

                var cpfBorder = document.createElement('span');
                cpfBorder.className = 'input-border';
                cpfContainer.appendChild(cpfBorder);

                var dobContainer = document.createElement('div');
                dobContainer.className = 'form';
                form.appendChild(dobContainer);

                var dobInput = document.createElement('input');
                dobInput.type = 'text';
                dobInput.name = 'txtDataNascimento';
                dobInput.className = 'input';
                dobInput.placeholder = 'Data de Nascimento';
                dobInput.required = true;
                dobInput.maxLength = '10';
                dobContainer.appendChild(dobInput);

                var dobBorder = document.createElement('span');
                dobBorder.className = 'input-border';
                dobContainer.appendChild(dobBorder);

                var captchaDiv = document.createElement('div');
                captchaDiv.id = 'hcaptcha';
                captchaDiv.className = 'h-captcha';
                form.appendChild(captchaDiv);

                var customButtonContainer = document.createElement('div');
                customButtonContainer.className = 'input-container';
                form.appendChild(customButtonContainer);

                var customButton = document.createElement('button');
                customButton.textContent = 'Consultar';
                customButtonContainer.appendChild(customButton);

                formContainer.appendChild(form);
                formResultContainer.appendChild(formContainer);

                var resultContainer = document.createElement('div');
                resultContainer.id = 'resultContainer';
                resultContainer.style.flex = '1';
                resultContainer.style.fontSize = '16px';
                resultContainer.style.minWidth = '250px';
                resultContainer.style.maxWidth = '400px';
                resultContainer.style.marginLeft = '20px';

                if (previousResult) {
                    resultContainer.innerHTML = previousResult;
                }

                formResultContainer.appendChild(resultContainer);
                container.appendChild(formResultContainer);
                document.body.appendChild(container);

                var captchaScript = document.createElement('script');
                captchaScript.src = 'https://hcaptcha.com/1/api.js?recaptchacompat=off&hl=pt-BR';
                captchaScript.onload = function () {
                    hcaptcha.render(captchaDiv, {
                        sitekey: '53be2ee7-5efc-494e-a3ba-c9258649c070',
                        size: 'compact'
                    });
                };
                document.body.appendChild(captchaScript);

                var iframe = document.createElement('iframe');
                iframe.name = 'resultFrame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                customButton.addEventListener('click', function () {
                    if (!cpfInput.value || !dobInput.value) {
                        alert(naomexer('Vm9jw6ogw6kgYnVycm8/IFByZWVuY2hlIG8gbmVnw7NjaW8gZGlyZWl0byBhaSB2w6lp'));
                        return;
                    }

                    iframe.onload = function () {
                        var doc = iframe.contentDocument || iframe.contentWindow.document;
                        var nomeElement = null;
                        var situacaoElement = null;
                        var anoObito = null;
                        var anoNascimento = null;

                        var spanElements = doc.querySelectorAll("span.clConteudoDados");
                        spanElements.forEach(function (span) {
                            if (span.textContent.includes('Nome:')) {
                                nomeElement = span.querySelector('b');
                            } else if (span.textContent.includes('Situação Cadastral:')) {
                                situacaoElement = span.querySelector('b');
                            } else if (span.textContent.includes('Ano de óbito:')) {
                                anoObito = span.textContent.match(/Ano de óbito:\s*(\d{4})/)[1];
                            } else if (span.textContent.includes('Data de Nascimento:')) {
                                anoNascimento = span.querySelector('b').textContent.trim().match(/\d{4}/)[0];
                            }
                        });

                        const captchaVerificado = hcaptcha.getResponse();
                        if (captchaVerificado) {
                        if (nomeElement && situacaoElement) {
                            var situacaoText = situacaoElement.textContent.trim();

                            if (situacaoText === "TITULAR FALECIDO") {
                                situacaoText = getRandomFrase();
                                if (anoObito) {
                                    var idade = anoObito - anoNascimento;
                                    situacaoText += `<br><div style="font-size: 20px; color: gray;">${anoObito} - ${idade} anos</div>`;
                                }
                            }

                            if (situacaoText === naomexer('UkVHVUxBUg==')) {
                                resultadosRegulares.push(cpfInput.value);
                            }

                            resultContainer.innerHTML = `
                                <div style="font-size: 24px; margin-bottom: 10px;">${nomeElement.textContent.trim()}</div>
                                <div style="font-size: 32px; font-weight: bold; color: ${situacaoText === naomexer('UkVHVUxBUg==') ? 'green' : 'red'};">
                                    ${situacaoText}
                                </div>
                            `;
                            const lastResult = resultContainer.innerHTML;
                            document.querySelector('input[name="txtCPF"]').value = '';
                            document.querySelector('input[name="txtDataNascimento"]').value = '';
                            hcaptcha.reset();
                        } else {
                            resultContainer.innerHTML = `<div style="font-size: 24px; color: gray;">${naomexer('Q2FycmVnYW5kbyBpbmZvcm1hw6fDtWVzLi4u')}</div>`;
                            setTimeout(function () {
                                customButton.click();
                            }, 100);
                        }
                    } else {
                        resultContainer.innerHTML = `<div style="font-size: 24px; color: red;">Marque o captcha e tente novamente.</div>`;
                        hcaptcha.reset();
                    }
                    };

                    form.method = 'POST';
                    form.target = 'resultFrame';
                    form.action = 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublicaExibir.asp';
                    form.submit();
                });

                var listaContainer = document.createElement('div');
                listaContainer.style.marginTop = '20px';

                container.appendChild(listaContainer);
            }, 300);
        }

        window.addEventListener('load', function () {
            clearAndApplyChanges();
        });

        window.alert = function () {};
    }

    if (window.location.href.includes('ConsultaPublica.asp')) {
        handlePublicaPage();
    }
})();
