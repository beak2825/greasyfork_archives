// ==UserScript==
// @name         Cambridge One Helper Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Melhorar a experiência de uso na plataforma Cambridge One
// @author       Você
// @match        https://www.cambridgeone.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507476/Cambridge%20One%20Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/507476/Cambridge%20One%20Helper%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Interceptar requisições para capturar dados (por exemplo, quizzes ou lições)
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            if (response.url.includes('/api')) {
                // Verifica se a requisição é relevante para o que você quer capturar
                response.clone().json().then(data => {
                    console.log('Dados capturados:', data);
                    // Manipular dados ou exibir na interface, se necessário
                });
            }
            return response;
        });
    };

    // 2. Adicionar um botão para acessar dicas ou respostas
    const helperButton = document.createElement('button');
    helperButton.innerText = 'Mostrar Respostas';
    helperButton.style.position = 'fixed';
    helperButton.style.left = '10px';
    helperButton.style.top = '10px';
    helperButton.style.zIndex = '1000';
    helperButton.onclick = () => {
        alert('As respostas dos quizzes vão aparecer aqui.');
        // Lógica para mostrar respostas extraídas de quizzes
    };
    document.body.appendChild(helperButton);

    // 3. Adicionar automaticamente respostas em quizzes ou tarefas
    const addAnswers = () => {
        const quizContainer = document.querySelector('.quiz-container'); // Exemplo de classe, ajuste conforme necessário
        if (quizContainer) {
            const answersDiv = document.createElement('div');
            answersDiv.innerHTML = '<h3>Respostas:</h3><p>Resposta 1, Resposta 2, etc.</p>';
            quizContainer.appendChild(answersDiv);
        }
    };

    // Executa o script após carregar a página
    window.onload = function() {
        addAnswers();
    };

})();
