// ==UserScript==
// @name         VFS Global AO-PT Automation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automação de campos chatos no VFS Global
// @author       Vivaldo Roque
// @license MIT
// @match        https://visa.vfsglobal.com/ago/*/prt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526122/VFS%20Global%20AO-PT%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/526122/VFS%20Global%20AO-PT%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loginEn = 'https://visa.vfsglobal.com/ago/en/prt/login';
    const loginPt ='https://visa.vfsglobal.com/ago/pt/prt/login';
    const applicationDetail = 'https://visa.vfsglobal.com/ago/en/prt/application-detail';

    // Configurações do usuário
    let email = localStorage.getItem('userEmail') || ''; // Carrega o email do localStorage
    let senha = localStorage.getItem('userPassword') || ''; // Carrega a senha do localStorage

    // Função para simular digitação
    function simulateTyping(element, text, callback) {
        let index = 0;

        function typeNextCharacter() {
            if (index < text.length) {
                element.value += text.charAt(index); // Adiciona um caractere
                index++;
                element.dispatchEvent(new Event('input', { bubbles: true })); // Dispara um evento de input
                setTimeout(typeNextCharacter, 100); // Intervalo de digitação, ajuste conforme necessário
            } else {
                element.dispatchEvent(new Event('blur'));
                if (callback) callback(); // Executa o callback após terminar
            }
        }

        typeNextCharacter();
    }

    function createRefreshAndSettings(){
        // Criando o botão de refresh
        const refreshButton = document.createElement('button');
        refreshButton.setAttribute("id", "refreshButton");
        refreshButton.innerText = 'Refresh';
        refreshButton.style.position = 'fixed';
        refreshButton.style.top = '10px';
        refreshButton.style.left = '10px'; // Posição ao lado do botão de login automático
        refreshButton.style.zIndex = 10000; // Para garantir que apareça sobre outros elementos
        refreshButton.style.padding = '10px';
        refreshButton.style.backgroundColor = '#ffc107'; // Cor de fundo do botão de refresh
        refreshButton.style.color = '#000'; // Cor do texto
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '5px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.classList.add('opacity-75'); // Classe de opacidade

        // Adicionando a classe de opacidade do Bootstrap
        refreshButton.classList.add('opacity-75'); // Ajuste aqui conforme necessário

        document.body.appendChild(refreshButton);

        // Criando o botão de configurações
        const settingsButton = document.createElement('button');
        settingsButton.setAttribute("id", "settingButton");
        settingsButton.innerHTML = '⚙️'; // Ícone de configurações, você pode usar uma biblioteca de ícones
        settingsButton.style.position = 'fixed';
        settingsButton.style.top = '10px';
        settingsButton.style.left = '100px'; // Ajuste para a posição desejada
        settingsButton.style.zIndex = 10000;
        settingsButton.style.padding = '10px';
        settingsButton.style.backgroundColor = '#007bff';
        settingsButton.style.color = '#fff';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.cursor = 'pointer';

        // Adicionando a classe de opacidade do Bootstrap
        settingsButton.classList.add('opacity-75'); // Ajuste aqui conforme necessário

        document.body.appendChild(settingsButton);

        // Ação ao clicar no botão de refresh
        refreshButton.addEventListener('click', function() {
            console.log('Refresh acionado, reiniciando funções...');

            // Remove os botões adicionados
            const existingLoginButton = document.querySelector('#myLogin');
            const otpContainer = document.querySelector('#otpContainer');

            if (existingLoginButton) {
                existingLoginButton.remove();
            }

            if (otpContainer) {
                otpContainer.remove();
            }

            // Apresenta os botões se na página de login
            if (window.location.href == loginEn || window.location.href == loginPt) {
                addLoginButton();
                addOtpFieldAndButton();
            }

            // Apresenta os botões se na página de agendamento
            if (window.location.href == applicationDetail) {
                addButtonNationalSchengen();
            }


        });

        // Ação ao clicar no botão de configurações
        settingsButton.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'modal fade show'; // Classes do Bootstrap para modal
            modal.style.display = 'block'; // Mostrando a modal
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.zIndex = '10001';

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.padding = '20px';

            const emailLabel = document.createElement('label');
            emailLabel.innerText = 'Email:';
            const emailInput = document.createElement('input');
            emailInput.placeholder = 'Digite seu email';
            emailInput.className = 'form-control'; // Classe do Bootstrap para inputs
            emailInput.value = email;

            const passwordLabel = document.createElement('label');
            passwordLabel.innerText = 'Senha:';
            const passwordInput = document.createElement('input');
            passwordInput.placeholder = 'Digite sua senha';
            passwordInput.className = 'form-control'; // Classe do Bootstrap para inputs
            passwordInput.value = senha;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'text-center'; // Classe para centralizar os botões

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Salvar';
            saveButton.className = 'btn btn-primary'; // Classe do Bootstrap para botão

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancelar';
            cancelButton.className = 'btn btn-secondary'; // Classe do Bootstrap para botão
            cancelButton.style.marginLeft = '5px'; // Espaçamento entre os botões

            // Adicionando eventos aos botões
            saveButton.addEventListener('click', function() {
                localStorage.setItem('userEmail', emailInput.value);
                localStorage.setItem('userPassword', passwordInput.value);
                alert('Dados salvos com sucesso!');
                document.body.removeChild(modal);
            });

            cancelButton.addEventListener('click', function() {
                document.body.removeChild(modal);
            });

            // Adicionando elementos à modal
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            modalContent.appendChild(emailLabel);
            modalContent.appendChild(emailInput);
            modalContent.appendChild(document.createElement('br')); // Espaçamento
            modalContent.appendChild(passwordLabel);
            modalContent.appendChild(passwordInput);
            modalContent.appendChild(document.createElement('br')); // Espaçamento
            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        });
    }

    // Função para adicionar o botão e o evento de login
    function addLoginButton() {

        if (document.querySelector('#email') || document.querySelector('[formcontrolname="password"]')) {
            const button = document.createElement('button');
            button.setAttribute("id", "myLogin");
            button.innerText = 'Inserir email e senha';
            button.style.position = 'fixed';
            button.style.top = '60px';
            button.style.left = '10px';
            button.style.zIndex = 10000; // Para garantir que apareça sobre outros elementos
            button.style.padding = '10px';
            button.style.backgroundColor = '#007bff'; // Cor de fundo
            button.style.color = '#fff'; // Cor do texto
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            // Adicionando a classe de opacidade do Bootstrap
            button.classList.add('opacity-75'); // Ajuste aqui conforme necessário

            document.body.appendChild(button);

            // Ação ao clicar no botão
            button.addEventListener('click', function() {

                const emailField = document.querySelector('#email');
                const passwordField = document.querySelector('[formcontrolname="password"]');

                // Usar a função de simular digitação para o email
                simulateTyping(emailField, email, function() {
                    // Disparar eventos após digitar a senha
                    emailField.dispatchEvent(new Event('blur'));
                    // Chama a função de simular digitação para a senha após completar o email
                    simulateTyping(passwordField, senha);
                });
            });
        } else {
            console.log('Campo de Email ou Password não localizados!');
        }
    }

    function addOtpFieldAndButton() {

        if(document.querySelector('[formcontrolname="otp"]')){
            // Criando o campo de entrada para OTP
            const otpContainer = document.createElement('div');
            otpContainer.setAttribute("id", "otpContainer");
            otpContainer.style.position = 'fixed';
            otpContainer.style.top = '120px'; // Ajustar a posição abaixo do botão de login automático
            otpContainer.style.left = '10px';
            otpContainer.style.zIndex = 10000;

            const otpField = document.createElement('input');
            otpField.setAttribute('type', 'text');
            otpField.setAttribute('placeholder', 'Digite seu OTP');
            otpField.setAttribute('formcontrolname', 'myOtp');
            otpField.style.padding = '10px';
            otpField.style.marginRight = '5px'; // Espaçamento entre o campo e o botão
            otpField.style.borderRadius = '5px';
            otpField.style.border = '1px solid #ccc';
            // Adicionando a classe de opacidade do Bootstrap
            otpField.classList.add('opacity-75'); // Ajuste aqui conforme necessário

            const submitOtpButton = document.createElement('button');
            submitOtpButton.innerText = 'Injectar OTP';
            submitOtpButton.style.padding = '10px';
            submitOtpButton.style.backgroundColor = '#28a745'; // Cor de fundo do botão
            submitOtpButton.style.color = '#fff'; // Cor do texto
            submitOtpButton.style.border = 'none';
            submitOtpButton.style.borderRadius = '5px';
            submitOtpButton.style.cursor = 'pointer';
            submitOtpButton.classList.add('opacity-75'); // Classe de opacidade

            otpContainer.appendChild(otpField);
            otpContainer.appendChild(submitOtpButton);
            document.body.appendChild(otpContainer);

            // Ação ao clicar no botão de enviar OTP
            submitOtpButton.addEventListener('click', function() {

                const myOtpField = document.querySelector('[formcontrolname="myOtp"]');
                const otpField = document.querySelector('[formcontrolname="otp"]');

                // Usar a função de simular digitação para o OTP
                simulateTyping(otpField, myOtpField.value);

            });
        } else {
            console.error('Campo de OTP não localizado!');
        }

    }

    function addButtonNationalSchengen() {



    }

    // Executa a função quando a página estiver totalmente carregada
    window.addEventListener('load', function() {

        console.log('Script ativado na página: ' + window.location.href);

        // Se for na tela de login executa o código abaixo:
        // Verificar se a URL é a correta antes de executar o script
        if (window.location.href == loginEn || window.location.href == loginPt) {
            createRefreshAndSettings();
        }

        // Verificar se a URL é a correta antes de executar o script
        if (window.location.href == 'https://visa.vfsglobal.com/ago/pt/prt/dashboard') {
            console.log('Logado com sucesso agora estás na dashboard!');
        }


    });

})();

/*

primeiro select [formcontrolname="centerCode"]
segundo select [formcontrolname="selectedSubvisaCategory"]
terceiro select [formcontrolname="visaCategoryCode"]

function selectOption(selector, optionIndex) {
    const selectElement = document.querySelector(selector);
    if (selectElement) {
        selectElement.click(); // Simula o clique para abrir o select

        setTimeout(() => {
            const optionList = document.querySelector('[role="listbox"]').querySelectorAll('mat-option'); // Obtém a lista de opções
            if (optionList[optionIndex]) {
                optionList[optionIndex].click(); // Clica na opção desejada
                const event = new Event('selectionChange', { bubbles: true, cancelable: true });
                selectElement.dispatchEvent(event); // Dispara o evento de mudança
            } else {
                console.error('Opção não encontrada no índice especificado!');
            }
        }, 100); // Espera o select abrir antes de acessar as opções
    } else {
        console.error('Elemento select não encontrado!');
    }
}

selectOption('[formcontrolname="selectedSubvisaCategory"]', 1);

function selectOptionsWithInterval() {
    // Selecionar a primeira opção do primeiro select
    selectOption('[formcontrolname="centerCode"]', 0); // 0 é o índice da primeira opção

    setTimeout(() => {
        // Selecionar a segunda opção do segundo select
        selectOption('[formcontrolname="selectedSubvisaCategory"]', 1); // 1 é o índice da segunda opção

        setTimeout(() => {
            // Selecionar a primeira opção do terceiro select
            selectOption('[formcontrolname="visaCategoryCode"]', 0); // 0 é o índice da primeira opção
        }, 5000); // Espera 5 segundos antes de selecionar o terceiro select
    }, 5000); // Espera 5 segundos antes de selecionar o segundo select
} */