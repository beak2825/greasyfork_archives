// ==UserScript==
// @name         Gerador de Informações Fictícias Personalizadas para Gartic.io
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Gera informações fictícias realistas e comandos engraçados no chat do Gartic.io, com anti-spam
// @author       akira (modificado por Claude)
// @match        *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511944/Gerador%20de%20Informa%C3%A7%C3%B5es%20Fict%C3%ADcias%20Personalizadas%20para%20Garticio.user.js
// @updateURL https://update.greasyfork.org/scripts/511944/Gerador%20de%20Informa%C3%A7%C3%B5es%20Fict%C3%ADcias%20Personalizadas%20para%20Garticio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wsObj = null;
    let originalSend = WebSocket.prototype.send;

    // Lista de respostas para o comando !gosto
    const likeMessages = [
        'Você não gosta dessa pessoa. 😒',
        'Você gosta um pouco dessa pessoa. 🤔',
        'Você gosta bastante dessa pessoa! 😊',
        'Você adora essa pessoa! ❤️',
        'Você ama essa pessoa! 😍',
        'Essa pessoa é tudo pra você! 💖',
        'Você tem um amor platônico por essa pessoa! 🌹',
        'Você está apaixonado! É um caso sério! 💘',
        'Essa pessoa é sua crush! Prepare-se para os fogos! 🎇',
        'Você daria a vida por essa pessoa! 🌈✨'
    ];

    // Lista de respostas para o comando !apaixonado
    const loveMessages = [
        'Não dá para essa pessoa. 😕',
        'Você não sente muita coisa. 😶',
        'Você tem um pouco de sentimento, mas nada sério. 🤷‍♂️',
        'Você gosta dela, mas não é nada profundo. 😐',
        'Você está começando a sentir algo! 😊',
        'Você está bem apaixonado! ❤️',
        'O amor está no ar! 💖',
        'Você é louco por essa pessoa! 😍',
        'Vocês são um casal perfeito! 🥰✨'
    ];

    // Lista de profissões
    const professions = [
        'Engenheiro',
        'Professor',
        'Médico',
        'Designer Gráfico',
        'Programador',
        'Artista',
        'Músico',
        'Chef de Cozinha',
        'Cientista',
        'Escritor',
        'Jogador Profissional',
        'Empreendedor'
    ];

    // Variável de cooldown
    const cooldowns = {
        '!gosto': 5000,   // 5 segundos
        '!apaixonado': 5000,  // 5 segundos
        '!penis': 5000,  // 5 segundos
        '!vida': 5000    // 5 segundos
    };

    // Última vez que o comando foi usado
    const lastUsed = {
        '!gosto': 0,
        '!apaixonado': 0,
        '!penis': 0,
        '!vida': 0
    };

    // Função para simular o comando !gosto
    const sendLikeMessage = (name) => {
        const percentage = Math.floor(Math.random() * 101);
        let likeIndex;

        // Define o índice da mensagem com base na porcentagem
        if (percentage < 20) {
            likeIndex = 0;
        } else if (percentage < 40) {
            likeIndex = 1;
        } else if (percentage < 60) {
            likeIndex = 2;
        } else if (percentage < 80) {
            likeIndex = 3;
        } else if (percentage < 90) {
            likeIndex = 4;
        } else if (percentage < 100) {
            likeIndex = 5;
        } else {
            likeIndex = Math.floor(Math.random() * 5) + 6;
        }

        const message = `${likeMessages[likeIndex]} Você está ${percentage}% gostando.`;
        wsObj.send(`42[11,${wsObj.id},"${name}, ${message}"]`);
    };

    // Função para simular o comando !apaixonado
    const sendLoveMessage = (name) => {
        const percentage = Math.floor(Math.random() * 101);
        let loveIndex;

        // Define o índice da mensagem com base na porcentagem
        if (percentage < 20) {
            loveIndex = 0;
        } else if (percentage < 40) {
            loveIndex = 1;
        } else if (percentage < 60) {
            loveIndex = 2;
        } else if (percentage < 80) {
            loveIndex = 3;
        } else if (percentage < 90) {
            loveIndex = 4;
        } else if (percentage < 100) {
            loveIndex = 5;
        } else {
            loveIndex = 8;
        }

        const message = `${loveMessages[loveIndex]} Você está ${percentage}% apaixonado.`;
        wsObj.send(`42[11,${wsObj.id},"${name}, ${message}"]`);
    };

    // Função para simular o comando !penis
    const sendPenisMessage = () => {
        const length = Math.floor(Math.random() * 20) + 1; // Comprimento aleatório entre 1 e 20 caracteres
        const cm = Math.floor(Math.random() * 30) + 1; // Comprimento em cm entre 1 e 30
        const message = `c${'='.repeat(length)}8 (${cm} cm)`; // Exibe o comprimento corretamente
        wsObj.send(`42[11,${wsObj.id},"${message}"]`);
    };

    // Função para simular o comando !vida
    const sendLifeMessage = (name) => {
        const profession = professions[Math.floor(Math.random() * professions.length)];
        const age = Math.floor(Math.random() * 30) + 15; // Idade entre 15 e 45
        const message = `${name}, você tem ${age} anos e é um(a) ${profession}.`;
        wsObj.send(`42[11,${wsObj.id},"${message}"]`);
    };

    // Intercepta o WebSocket e captura a ID do jogador e o código da sala
    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!wsObj) {
            wsObj = this;
            wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        wsObj.lengthID = data[1];
                        wsObj.id = data[2];
                        wsObj.roomCode = data[3];
                        console.log('Jogador conectado. ID:', wsObj.id, 'Sala:', wsObj.roomCode);
                    } else if (data[0] == 11) {
                        const message = data[2].trim().toLowerCase();
                        const parts = message.split(' ');
                        const command = parts[0];
                        const name = parts.length > 1 ? parts.slice(1).join(' ') : '';

                        const now = Date.now();
                        if (now - lastUsed[command] >= cooldowns[command]) {
                            lastUsed[command] = now; // Atualiza o timestamp da última execução
                            if (command === '!gosto') {
                                sendLikeMessage(name);
                            } else if (command === '!apaixonado') {
                                sendLoveMessage(name);
                            } else if (command === '!penis') {
                                sendPenisMessage();
                            } else if (command === '!vida') {
                                sendLifeMessage(name);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Erro ao processar mensagem WebSocket:', err);
                }
            });
        }
    };

})();
