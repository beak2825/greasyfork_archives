// ==UserScript==
// @name         UserScript com WebSocket
// @namespace    https://moomoo.io/
// @version      1.0
// @description  Exemplo de UserScript com WebSocket que envia dados do formulário para o servidor WebSocket.
// @match        https://moomoo.io/?server=39:7:0*  
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/464617/UserScript%20com%20WebSocket.user.js
// @updateURL https://update.greasyfork.org/scripts/464617/UserScript%20com%20WebSocket.meta.js
// ==/UserScript==

// Função para criar uma nova conexão WebSocket
function criarWebSocket() {
    var socket = new WebSocket("ws://127.0.0.1:9000");  // Coloque a URL do servidor WebSocket aqui
    socket.onmessage = function(event) {
        // Manipule as mensagens recebidas do servidor WebSocket aqui
        console.log("Mensagem recebida do servidor WebSocket: ", event.data);
    };
    return socket;
}

// Função para enviar dados do formulário para o servidor WebSocket
function enviarDadosParaWebSocket(socket, dados) {
    // Formate os dados como uma string JSON e envie para o servidor WebSocket
    var mensagem = JSON.stringify(dados);
    socket.send(mensagem);
}

// Função de event listener para ação de clique em um botão
function onClickBotao(event) {
    event.preventDefault();
    // Obtenha os dados do formulário
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var idade = document.getElementById('idade').value;
    
    // Crie uma nova conexão WebSocket
    var socket = criarWebSocket();
    
    // Envie os dados do formulário para o servidor WebSocket
    enviarDadosParaWebSocket(socket, { nome: nome, email: email, idade: idade });
    
    // Feche a conexão WebSocket após o envio dos dados
    socket.close();
}

// Adicione um event listener ao botão de envio do formulário
document.getElementById('botao-enviar').addEventListener('click', onClickBotao);

// Aqui você pode adicionar mais event listeners para outros elementos HTML, se necessário
