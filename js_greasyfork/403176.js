// ==UserScript==
// @name         Real Trends
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Expande o chat de pós-venda
// @author       Victor Hugo Borges de Souza
// @match        https://br.real-trends.com/
// @match        https://br.real-trends.com/questions/
// @match        https://br.real-trends.com/*
// @run-at       document-start|document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403176/Real%20Trends.user.js
// @updateURL https://update.greasyfork.org/scripts/403176/Real%20Trends.meta.js
// ==/UserScript==

//inicio
//especifica a troca de cor e a posição do botão das mensagens de pós venda somente quando a classe é "active". OBS: é necessário declarar @grant        GM_addStyle para funcionar
GM_addStyle ( `
    .active {
        background-color: #dc2626 !important;
        right: 450px !important;
    }
.quick-responses-messaging-wrapper .messaging-responses {
        height: 600px !important;
}
` );
//fim

//inicio
//call CSS e regras de CSS para modificar a página
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//fim
//inicio
//pontua o que deve ser modificado de acordo com o nome do elemento (<div>, <p>, <spam>, <img>, etc), o nome do elemento vai depois da hashtag.
addGlobalStyle('#chat-available { height: 200px !important; }');
addGlobalStyle('#text_send_message { font-size: 16px; !important; }');
addGlobalStyle('#text_send_message { color: #4CAF50; !important; }');
addGlobalStyle('#order_conversation_review { height: 380px !important; }');
addGlobalStyle('#sales { background-color: #ffffff !important; }');
addGlobalStyle('#closed-sales { background-color: #ffffff !important; }');
addGlobalStyle('#listerSection { background-color: #81818100 !important; }');
addGlobalStyle('#sales-detail { background-color: #81818100 !important; }');
addGlobalStyle('#payments { background-color: #81818100 !important; }');
addGlobalStyle('#listItems { background-color: #81818100 !important; }');
addGlobalStyle('#detail { background-color: #81818100 !important; }');
addGlobalStyle('#detail { right: 0px !important; }');
addGlobalStyle('#closed { background-color: #81818100 !important; }');
addGlobalStyle('#closed { right: 0px !important; }');
addGlobalStyle('#opened { background-color: #81818100 !important; }');
addGlobalStyle('#opened { right: 0px !important; }');
addGlobalStyle('#active-sales { background-color: #f5f5f5 !important; }');
addGlobalStyle('#quick-responses { fill: #000000 !important; }');
addGlobalStyle('#clip { fill: #000000 !important; }');
addGlobalStyle('#quick-responses-box { right: 405px !important; }');



//addGlobalStyle('#messenger-launcher { right: 450px !important; }');
//addGlobalStyle('#messenger-launcher { background-color: #dc2626 !important; }');
//os códigos acima precisaram ser especificados na GM_addStyle  para a classe "active" para modificar o botão somente quando o chat estivesse aberto, então os desativei aqui.
//fim


