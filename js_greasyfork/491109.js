// ==UserScript==
// @name         Auto Search Bing ✅
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatiza a pesquisa no Bing
// @author       Kenite-Kelve
// @match        https://www.bing.com/*
// @icon         https://az15297.vo.msecnd.net/images/rewards.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491109/Auto%20Search%20Bing%20%E2%9C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/491109/Auto%20Search%20Bing%20%E2%9C%85.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Função principal que executa a ação de pesquisa automática
    function autoSearch() {
        // Espera 5 segundos antes de focar no campo de busca
        setTimeout(function() {
            // Elemento de entrada de texto da barra de pesquisa do Bing
            let searchInput = document.getElementById('sb_form_q');
            if (searchInput) {
                // Limpa o campo de busca
                searchInput.value = '';
                // Consulta aleatória a ser pesquisada
                let query = generateRandomQuery(); // Gera uma consulta aleatória
                // Digita a consulta letra por letra
                typeText(searchInput, query, function() {
                    // Após digitar a consulta, seleciona o botão de busca
                    let searchButton = document.getElementById('sb_form_go');
                    if (searchButton) {
                        // Dispara um evento de clique no botão de busca após um curto atraso
                        setTimeout(function() {
                            searchButton.click();
                        }, 800); // Ajuste o atraso conforme necessário
                    } else {
                        console.error('Botão de busca não encontrado.');
                    }
                });
            } else {
                console.error('Campo de busca não encontrado.');
            }
        }, 2000); // Atraso de 5 segundos antes de focar no campo de busca

        // Adiciona a div da mensagem ao corpo da página
        let messageDiv = createMessageDiv();
        document.body.appendChild(messageDiv);

        // Estilo para animação do botão de busca
        let style = document.createElement('style');
        style.textContent = `
            #sb_form_go {
                position: relative;
            }
            .border-animation {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 2px solid transparent;
                border-radius: 5px;
                animation: borderAnimation 2s infinite linear;
            }
            @keyframes borderAnimation {
                0% { border-color: transparent; }
                25% { border-color: red; }
                50% { border-color: blue; }
                75% { border-color: green; }
                100% { border-color: yellow; }
            }
        `;
        document.head.appendChild(style);
    }

  // Função para criar a div da mensagem
function createMessageDiv() {
    let messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.bottom = '20px'; // Ajuste a posição vertical conforme necessário
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.background = '#f1c40f'; // Cor de fundo amarela
    messageDiv.style.color = '#333'; // Cor do texto
    messageDiv.style.border = '3px solid transparent'; // Borda sólida inicialmente transparente
    messageDiv.style.borderRadius = '10px'; // Borda arredondada
    messageDiv.style.cursor = 'pointer';
    messageDiv.textContent = 'Me siga no Roblox';

    // Adiciona a animação de arco-íris à borda
    messageDiv.style.animation = 'rainbowBorder 5s linear infinite'; // Chama a animação 'rainbowBorder' com duração de 2 segundos, linear e repetição infinita

    // Adiciona o evento de clique para redirecionar ao link desejado
    messageDiv.addEventListener('click', function() {
        window.open('https://www.roblox.com/users/2828278946/profile', '_blank'); // Substitua com o link do seu perfil no Roblox

    });

    return messageDiv;
}

// Cria a animação de arco-íris na borda
const rainbowBorderAnimation = `
    @keyframes rainbowBorder {
        0% { border-color: red; }
        16.67% { border-color: orange; }
        33.33% { border-color: yellow; }
        50% { border-color: green; }
        66.67% { border-color: blue; }
        83.33% { border-color: indigo; }
        100% { border-color: violet; }
    }
`;

// Adiciona a animação de arco-íris ao estilo global
const style = document.createElement('style');
style.innerHTML = rainbowBorderAnimation;
document.head.appendChild(style);


    // Função para simular a digitação de texto em um elemento
    function typeText(element, text, callback) {
        // Inicia o índice de caractere em 0
        let charIndex = 0;
        // Define um intervalo para simular a digitação letra por letra
        let typeInterval = setInterval(function() {
            // Adiciona o próximo caractere ao campo de busca
            element.value += text[charIndex++];
            // Se todos os caracteres foram digitados, limpa o intervalo
            if (charIndex >= text.length) {
                clearInterval(typeInterval);
                // Chama o callback após digitar toda a consulta
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        }, 50); // Ajuste o intervalo conforme necessário
    }

    // Função para gerar uma consulta aleatória com números
    function generateRandomQuery() {
        let phrases = [
            "lorem ipsum dolor sit amet",
            "consectetur adipiscing elit",
            "sed do eiusmod tempor incididunt",
            "ut labore et dolore magna aliqua",
            "quis nostrud exercitation ullamco",
            "laboris nisi ut aliquip ex ea commodo consequat",
            "duis aute irure dolor in reprehenderit",
            "voluptate velit esse cillum dolore",
            "eu fugiat nulla pariatur",
            "excepteur sint occaecat cupidatat non proident",
            "sunt in culpa qui officia deserunt mollit anim id est laborum"
        ];
        // Seleciona uma frase aleatória da lista
        let randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        // Divide a frase em palavras
        let words = randomPhrase.split(' ');
        // Insere números aleatórios no meio das palavras
        for (let i = 0; i < words.length; i++) {
            // Gera um número aleatório entre 0 e 999
            let randomNumber = Math.floor(Math.random() * 1000);
            // Insere o número aleatório no meio da palavra
            let randomIndex = Math.floor(Math.random() * (words[i].length + 1));
            words[i] = words[i].slice(0, randomIndex) + randomNumber + words[i].slice(randomIndex);
        }
        // Junta as palavras para formar a consulta completa
        return words.join(' ');
    }

    // Executa a função de pesquisa automática após um curto atraso (para garantir que a página tenha carregado completamente)
    setTimeout(autoSearch, 1000); // Ajuste o atraso conforme necessário
})();
