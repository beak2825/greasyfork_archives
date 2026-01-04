// ==UserScript==
// @name         Anonimbiri Anti kick Instant Exit with Random Evil Message
// @description  Entra automaticamente em uma sala específica em gartic.io, envia uma mensagem aleatória (incluindo mensagens "evil") e sai imediatamente após o primeiro voto de kick, votando contra quem votou.
// @namespace    http://tampermonkey.net/
// @version      0.8
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512201/Anonimbiri%20Anti%20kick%20Instant%20Exit%20with%20Random%20Evil%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/512201/Anonimbiri%20Anti%20kick%20Instant%20Exit%20with%20Random%20Evil%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sw = window.WebSocket.prototype.send;
    let setTrue = false;
    let linkSent = false, windowurl, exitingame;
    window.array = {};

    // Lista de mensagens aleatórias
    const messages = [
        "a̶͕͖̦͆̏̿n̷̳̤͉͖͎̞̗̒̏̈́ṱ̴̨̟͔̖͌̚ị̴̍̃̇̚̚ ̸̢̡̯̭͉̱̝̣̊ķ̶̭̯̼̜̺͎̲̦̳̈́͋͆͝͝i̷̛̘̰͂̿̀͆̃̃͘͘͝c̶̰̪̱͐́͗̔̕͘͝k̶̡͙̱̭͍̞̯̟̯̅̍͂̐͝ ̷̧̢͓͖̖̽̀̑̏̃̾͂̕͝a̶͚̤̖̦͎̟͌͂̅͘͝ţ̴͓͍̥͓͈̖͍̠̏̂͌̍͠͠ĭ̵̺͇͕̪̼̯̙̱̤̍͑̏̇͋͆̈́͘ͅv̵̢͑̽̌ͅa̴̟̘̘͍̬̲̎ḓ̷̢̖̰̣̩̏̄̓̋̔̅́̂̀̆ͅó̷̢̡̟̲̰͚̲͈̘̼̌̑̈́",
        "KKKKK não consegue me expulsar!",
        "Tá difícil aí?",
        "Você é muito lerdo!",
        "Melhor sorte da próxima vez!"
    ];

    // Lista de mensagens "evil"
    const evilMessages = [
        "Desistiram? Achei que conseguiriam me expulsar!",
        "Parece que vocês desistiram de me expulsar!",
        "KKKKK, vocês ainda estão tentando? Eu já desisti de brincar com vocês!",
        "Nem com a força de todos vocês conseguem me expulsar!",
        "Desisti? Só estou esperando vocês me expulsarem, se conseguirem!",
        "Me expulsar? Parece que vocês vão precisar de mais esforço!",
        "Vocês realmente acham que podem me tirar? Sonhem mais!",
        "Desisti de vocês... Isso é o melhor que conseguem?",
        "Ué, pensei que vocês já tinham conseguido... mas ainda estou aqui!",
        "Vocês cansaram? Porque eu tô só começando!"
    ];

    // Função para enviar mensagem aleatória e sair do jogo
    function sendMessageAndExit() {
        if (window.array && window.array.id) {
            // Seleciona aleatoriamente entre uma mensagem normal ou uma "evil"
            const isEvil = Math.random() < 0.3; // 30% de chance de enviar uma mensagem "evil"
            const messageList = isEvil ? evilMessages : messages;
            const message = messageList[Math.floor(Math.random() * messageList.length)];

            window.array.send(`42[11,${window.array.id},"${message}"]`);

            // Pequeno atraso para garantir que a mensagem seja enviada antes de sair
            setTimeout(() => {
                exitingame = `42[24,${window.array.id}]`;
                window.array.send(exitingame);
                console.log("Mensagem enviada e saindo do jogo devido a um voto de kick.");
            }, 100);
        }
    }

    // Função para votar na pessoa que votou em você
    function voteAgainstKicker(kickerId) {
        if (window.array && window.array.id) {
            const voteMessage = `42[22,${window.array.id},${kickerId}]`;
            window.array.send(voteMessage);
            console.log(`Votando contra: ${kickerId}`);
        }
    }

    // Sobrescreve o WebSocket para monitorar mensagens
    window.WebSocket.prototype.send = function(aa) {
        sw.apply(this, arguments);
        if (Object.keys(window.array).length === 0) {
            window.array = this;
            window.ar();
        }
    };

    // Função para monitorar kicks
    window.ar = () => {
        if (!setTrue) {
            window.array.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] === 5) { // Guarda o ID do socket ao conectar
                        window.array.id = data[2];
                    } else if (data[0] === 21) { // Detecta voto de kick
                        const kickerId = data[2]; // ID do jogador que votou
                        voteAgainstKicker(kickerId); // Vota na pessoa que votou em você
                        sendMessageAndExit();
                    }
                } catch (err) {}
            });
            setTrue = true;
        }
    };

    // Observa mutações no DOM para detectar mensagens de kick
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const addedNodes = mutation.addedNodes;
                for (let i = 0; i < addedNodes.length; i++) {
                    const node = addedNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('msg') && node.classList.contains('alert')) {
                        const strongElements = node.querySelectorAll('strong');
                        if (strongElements.length === 2) {
                            const strong2 = strongElements[1].textContent.trim();
                            const myuser = document.querySelector("#users > div > div.scrollElements > div.user.you > div.infosPlayer > span.nick");
                            if (myuser && strong2 === myuser.textContent) {
                                sendMessageAndExit();
                                return;
                            }
                        }
                    }
                }
            }
        });
    });

    // Configura o observador para monitorar o DOM
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
