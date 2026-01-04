// ==UserScript==
// @name         Report Control with WebSocket
// @version      1.0
// @description  Instant report!
// @author       Qwyua
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1220697
// @downloadURL https://update.greasyfork.org/scripts/480368/Report%20Control%20with%20WebSocket.user.js
// @updateURL https://update.greasyfork.org/scripts/480368/Report%20Control%20with%20WebSocket.meta.js
// ==/UserScript==

// Substitua esta URL pela URL do seu servidor WebSocket
const websocketURL = 'ws://localhost:3000';

let reportButton = document.createElement('button');
reportButton.innerHTML = '<button id="reportButton" class="btYellowBig" style="margin-top:15px; background-color: red;"><strong>Reportar</strong></button>';
reportButton.onmousedown = () => {
    let msq = document.querySelector(".content.profile").innerText.split("\n")[1];
    let asd = ":report " + msq;

    // Lógica para clicar no botão de relatório e confirmar o relatório
    document.querySelector(".denounce").click();
    document.querySelector(".btYellowBig.smallButton.ic-yes").click();

    // Lógica de WebSocket para enviar a mensagem de relatório
    var socket = new WebSocket(websocketURL);
    socket.onopen = () => socket.send(asd);

    // Envia uma mensagem para todos os outros usuários do script
    GM_sendMessage("report", msq);
};

let leaveButton = document.createElement('button');
leaveButton.innerHTML = '<button id="leaveButton" class="btYellowBig" style="margin-top:15px; background-color: blue;"><strong>LEAVE</strong></button>';
leaveButton.onmousedown = () => {
    // Lógica para clicar no botão de sair da sala
    document.querySelector('#exit').click();
    setTimeout(() => {
        document.querySelector('#popUp > div:nth-child(1) > div > div:nth-child(3) > button:nth-child(2)').click();
    }, 0);

    // Lógica de WebSocket para enviar a mensagem de saída
    var socket = new WebSocket(websocketURL);
    socket.onopen = () => socket.send(":leave");

    // Envia uma mensagem para todos os outros usuários do script
    GM_sendMessage("leave");
};

setInterval(() => {
    if (document.querySelector(".content.profile")) {
        if (document.querySelector('#reportButton') == null) {
            document.querySelector('div[class="buttons"]').appendChild(reportButton);
        }
        if (document.querySelector('#leaveButton') == null) {
            document.querySelector('div[class="buttons"]').appendChild(leaveButton);
        }
    }
}, 250);

GM_onMessage('report', function (message) {
    let asd = ":report " + message;

    // Lógica para clicar no botão de relatório e confirmar o relatório
    document.querySelector(".denounce").click();
    document.querySelector(".btYellowBig.smallButton.ic-yes").click();

    // Lógica de WebSocket para enviar a mensagem de relatório
    var socket = new WebSocket(websocketURL);
    socket.onopen = () => socket.send(asd);
});

GM_onMessage('leave', function () {
    // Lógica para clicar no botão de sair da sala
    document.querySelector('#exit').click();
    setTimeout(() => {
        document.querySelector('#popUp > div:nth-child(1) > div > div:nth-child(3) > button:nth-child(2)').click();
    }, 0);
});
