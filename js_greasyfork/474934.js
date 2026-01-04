// ==UserScript==
// @name         ✅Verificado 💰Roblux 🚀Fallows
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adiciona o nome encontrado com um ícone de verificação, espaço e margem superior no final em todas as páginas e define um valor fake de Robux como "153k" no site roblox.com
// @author       Kenite-Kelve
// @match         https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474934/%E2%9C%85Verificado%20%F0%9F%92%B0Roblux%20%F0%9F%9A%80Fallows.user.js
// @updateURL https://update.greasyfork.org/scripts/474934/%E2%9C%85Verificado%20%F0%9F%92%B0Roblux%20%F0%9F%9A%80Fallows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para encontrar o nome na página
    function findProfileName() {
        // Modifique esta lógica para encontrar o nome na página
        // Atualmente, está procurando por uma classe específica
        var nameElements = document.querySelectorAll('.profile-name, .age-bracket-label-username');

        nameElements.forEach(function(nameElement) {
            // Cria o elemento de espaço
            var spaceElement = document.createElement('span');
            spaceElement.textContent = ' '; // Adiciona um espaço

            // Cria o ícone de verificação
            var verificationIcon = document.createElement('img');
            verificationIcon.className = 'profile-verified-badge-icon';
            verificationIcon.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'23\' height=\'23\' viewBox=\'0 0 28 28\' fill=\'none\'%3E%3Cg clip-path=\'url(%23clip0_8_46)\'%3E%3Crect x=\'5.88818\' width=\'22.89\' height=\'22.89\' transform=\'rotate(15 5.88818 0)\' fill=\'%230066FF\'/%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z\' fill=\'white\'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id=\'clip0_8_46\'%3E%3Crect width=\'28\' height=\'28\' fill=\'white\'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E';
            verificationIcon.title = '151848836';
            verificationIcon.alt = '151848836';

            // Define a largura e altura do ícone
            verificationIcon.style.width = '23px';
            verificationIcon.style.height = '23px';

            // Adiciona uma margem inferior ao nome
            nameElement.style.marginBottom = '2px'; // Ajuste conforme necessário

            // Adiciona o nome, espaço e ícone de verificação à página
            nameElement.appendChild(spaceElement);
            nameElement.appendChild(verificationIcon);
        });

        // Manipula o elemento <span> com a classe 'font-header-2' e título '9'
        var numberElement = document.querySelector('.font-header-2[title="9"]');

        if (numberElement) {
            // Define o valor diretamente como '153k'
            numberElement.textContent = '185k';
            numberElement.title = "185k";
        }
    }

    // Chama a função para encontrar o nome na página após 2 segundos
    setTimeout(findProfileName, 2300);

    // Função para manipular Robux Fake no site roblox.com
    function Robux() {
        var robux = document.getElementById("nav-robux-amount");
        var balance = document.getElementById("nav-robux-balance");
        robux.innerHTML = "241k";
        balance.innerHTML = "241k Robux";
        balance.title = "241k";
    }

    // Chama a função para manipular Robux Fake no site roblox.com
    window.addEventListener('DOMContentLoaded', (event) => {
        // Defina o valor de Robux como "153k" diretamente ao carregar a página
        setInitialValue();
    });

    var RobuxAmount = "241k"; // Valor inicial como "153k"

    function setInitialValue() {
        document.getElementById("nav-robux-amount").textContent = RobuxAmount;
        document.getElementById("nav-robux-balance").textContent = RobuxAmount + " Robux";
        document.getElementById("nav-robux-balance").title = RobuxAmount;
    }

    setInterval(Robux, 1);

    // Cria um container no centro inferior
    var containerDiv = document.createElement('div');
    containerDiv.style.position = 'fixed';
    containerDiv.style.bottom = '10px';
    containerDiv.style.left = '50%';
    containerDiv.style.transform = 'translateX(-50%)';
    containerDiv.style.padding = '10px';
    containerDiv.style.backgroundColor = '#f1f1f1';
    containerDiv.style.border = '1px solid #4CAF50'; // Borda verde
    containerDiv.style.borderRadius = '5px';
    containerDiv.style.display = 'none'; // Inicialmente oculto
    containerDiv.style.cursor = 'pointer'; // Torna o cursor clicável
    containerDiv.style.color = '#007BFF'; // Texto azul
    containerDiv.style.whiteSpace = 'nowrap'; // Evita quebras de linha

    // Adiciona uma mensagem e um link clicável dentro do container
    containerDiv.innerHTML = '<p id="messageText"> </p><a id="perfilLink" href="https://www.roblox.com/users/2828278946/profile" target="_blank"></a>';

    // Adiciona o container à página
    document.body.appendChild(containerDiv);

    // Adiciona uma animação de digitação para a mensagem
    var messageText = document.getElementById('messageText');
    var mensagem = "👣 Me siga no Roblox, clicando aqui! 👉";
    var index = 0;

    function typeWriter() {
        if (index < mensagem.length) {
            messageText.innerHTML += mensagem.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter(); // Inicia a animação de digitação

    // Exibe o container
    containerDiv.style.display = 'block';

    // Configura um temporizador para esconder o container suavemente após 5 segundos
    setTimeout(function() {
        containerDiv.style.transition = 'opacity 1s ease-out'; // Adiciona efeito de transição
        containerDiv.style.opacity = '0';
        setTimeout(function() {
            containerDiv.style.display = 'none';
            // Reinicia a animação de digitação
            messageText.innerHTML = "";
            index = 0;
            typeWriter();
        }, 1000); // Após 1 segundo, oculta completamente o container e reinicia a animação
    }, 10000);
      // Adiciona um listener de clique para o container
    containerDiv.addEventListener('click', function() {
        window.open('https://www.roblox.com/users/2828278946/profile', '_blank');
        });
})();
