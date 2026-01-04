// ==UserScript==
// @name         Auto Voter with Page Reload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate voting on a poll and reload the page after each vote
// @author       You
// @match        https://sjcc.ne10.uol.com.br/quiz-sjcc/1222.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498543/Auto%20Voter%20with%20Page%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/498543/Auto%20Voter%20with%20Page%20Reload.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Número de vezes que deseja votar
    const numeroDeVotos = 10000; // Ajuste conforme necessário

    // Função para votar
    function votar() {
        try {
            // Encontra e clica na opção desejada (exemplo: por ID)
            const opcao = document.querySelector('#opt-6733');
            if (opcao) {
                opcao.click();
            } else {
                console.log('Opção de voto não encontrada.');
                return;
            }

            // Espera um pouco para garantir que o clique seja registrado
            setTimeout(() => {
                // Submete a enquete (exemplo: por classe)
                const botaoVotar = document.querySelector('.btn-votar');
                if (botaoVotar) {
                    botaoVotar.click();
                    console.log('Voto registrado com sucesso.');

                    // Atualiza o contador de votos
                    let votosRegistrados = parseInt(sessionStorage.getItem('votosRegistrados') || '0', 10);
                    votosRegistrados++;
                    sessionStorage.setItem('votosRegistrados', votosRegistrados);

                    // Recarrega a página após um curto intervalo para permitir o registro do voto
                    setTimeout(() => {
                        if (votosRegistrados < numeroDeVotos) {
                            location.reload();
                        } else {
                            console.log('Todos os votos foram registrados.');
                            sessionStorage.removeItem('votosRegistrados'); // Resetar o contador após a votação
                        }
                    }, 2000); // Ajuste o tempo conforme necessário
                } else {
                    console.log('Botão de votar não encontrado.');
                }
            }, 1000); // Ajuste o tempo conforme necessário
        } catch (e) {
            console.log(`Erro ao registrar o voto: ${e}`);
        }
    }

    // Verificar o estado do contador de votos e iniciar a votação
    let votosRegistrados = parseInt(sessionStorage.getItem('votosRegistrados') || '0', 10);
    if (votosRegistrados < numeroDeVotos) {
        setTimeout(votar, 1000); // Ajuste o tempo conforme necessário para iniciar a votação
    } else {
        console.log('Todos os votos foram registrados.');
        sessionStorage.removeItem('votosRegistrados'); // Resetar o contador após a votação
    }
})();