// ==UserScript==
// @name         Situação Cadastral Private by Nice
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Receita Federal Automática.
// @author       Nice
// @match        https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505951/Situa%C3%A7%C3%A3o%20Cadastral%20Private%20by%20Nice.user.js
// @updateURL https://update.greasyfork.org/scripts/505951/Situa%C3%A7%C3%A3o%20Cadastral%20Private%20by%20Nice.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showLoginForm() {
        let loginForm = `
        <div class="form-container">
            <form class="form">
                <span class="heading">Login</span>

                <div class="form-group">
                    <input class="form-input" id="username" required="" type="text" />
                    <label>Usuário</label>
                </div>

                <div class="form-group">
                    <input class="form-input" id="password" required="" type="password" />
                    <label>Senha</label>
                </div>

                <button type="button" id="loginButton">Login</button>
            </form>
            <p id="loginError" style="color: red; display: none; text-align: center; font-size: 14px;">Login ou senha incorretos</p>
        </div>
        `;

        document.body.innerHTML = loginForm;

        document.getElementById('loginButton').addEventListener('click', function () {
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            authenticateAndLoadScript(username, password);
        });

        // Adicionar o estilo CSS
        let style = document.createElement('style');
        style.innerHTML = `
    .form-container {
        background: linear-gradient(#212121, #212121) padding-box,
                    linear-gradient(120deg, transparent 25%, #8f34eb, #711fc4) border-box;
        border: 2px solid transparent;
        padding: 32px 24px;
        font-size: 14px;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
        border-radius: 16px;
    }

    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .heading {
        font-size: 20px;
        font-weight: 600;
    }

    .form-input {
        color: white;
        background: transparent !important; /* Garante que o fundo seja transparente */
        border: 1px solid #414141;
        border-radius: 5px;
        padding: 8px;
        outline: none;
        appearance: none; /* Remove estilos padrões do navegador */
        -webkit-appearance: none; /* Remove estilos padrões do navegador no Webkit (Safari, Chrome) */
    }

    .form-input:focus {
        background: transparent !important; /* Mantém o fundo transparente ao focar */
    }

    button {
        border-radius: 5px;
        padding: 6px;
        background: #ffffff14;
        color: #c7c5c5;
        border: 1px solid #414141;
    }

    button:hover {
        background: #212121;
        cursor: pointer;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
        color: #414141;
        position: relative;
    }

    .form-group label {
        position: absolute;
        top: 0;
        left: 0;
        padding: 5px;
        pointer-events: none;
        transition: 0.5s;
    }

    .form-group input:focus ~ label,
    .form-group input:valid ~ label {
        top: -16px;
        left: 0;
        background: #212121 padding-box;
        padding: 10px 0 0 0;
        color: #bdb8b8;
        font-size: 12px;
    }
`;

        document.head.appendChild(style);
    }

    function authenticateAndLoadScript(username, password) {
        let authUrl = `https://nicezin.com.br/nice.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', authUrl, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    eval(xhr.responseText);
                } else if (xhr.status === 403 && xhr.responseText.includes('Acesso expirado')) {
                    document.getElementById('loginError').innerHTML =
                        'Sua assinatura expirou.<br>' +
                        '<a href="https://nicezin.com.br/comprar" target="_blank" style="color: #8f34eb; text-decoration: none;"><strong>Clique aqui para assinar</strong></a>';
                    document.getElementById('loginError').style.display = 'block';
                } else if (xhr.status === 403 && xhr.responseText.includes('IP diferente')) {
                    document.getElementById('loginError').innerHTML =
                        'Seu login está bloqueado, seu IP foi alterado.<br>Desative a VPN ou faça um reset.<br>' +
                        '<a href="https://nicezin.com.br/resetarip" target="_blank" style="color: #8f34eb; text-decoration: none;"><strong>Clique aqui para resetar</strong></a>';
                    document.getElementById('loginError').style.display = 'block';
                } else {
                    document.getElementById('loginError').textContent = 'Login ou senha incorretos';
                    document.getElementById('loginError').style.display = 'block';
                }
            }
        };
        xhr.send();
    }

    function initiateLoginProcess() {
        setTimeout(function () {
            document.title = 'Nicezin';
            var link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = 'https://nicezin.com.br/favicon.png';
            document.body.innerHTML = '';
            document.body.style.backgroundColor = 'black';
            document.body.style.display = 'flex';
            document.body.style.flexDirection = 'column';
            document.body.style.alignItems = 'center';
            document.body.style.justifyContent = 'center';
            document.body.style.height = '100vh';
            document.body.style.margin = '0';
            document.body.style.padding = '20px';
            document.body.style.boxSizing = 'border-box';
            showLoginForm();
        }, 500);
    }

    initiateLoginProcess();
})();
