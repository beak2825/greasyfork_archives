// ==UserScript==
// @name         Simple ChatGPT
// @namespace    http://tampermonkey.net/
// @version      2024-02-15
// @description     Press the shortcut "Ctrl+Q" to ask ChatGPT a question, and an alert box will return in your browser
// @description:ja  ショートカット「Ctrl+Q」を押してChatGPTに質問すると、ブラウザに警告ボックスが表示されます。
// @description:zh  按快捷键“Ctrl+Q”向 ChatGPT 提问，浏览器中将返回一个警告框
// @description:fr  Appuyez sur le raccourci "Ctrl+Q" pour poser une question à ChatGPT et une boîte d'alerte reviendra dans votre navigateur
// @description:cs  Stisknutím zkratky „Ctrl+Q“ položíte ChatGPT otázku a ve vašem prohlížeči se vrátí varovné pole
// @description:es  Presione el acceso directo "Ctrl+Q" para hacerle una pregunta a ChatGPT y aparecerá un cuadro de alerta en su navegador.
// @description:pt  Aperte o atalho "Ctrl+Q" para fazer uma pergunta ao ChatGPT, e retornara uma caixa de alerta no neu navegador
// @description:pt-Br  Aperte o atalho "Ctrl+Q" para fazer uma pergunta ao ChatGPT, e retornara uma caixa de alerta no neu navegador
// @description:pt-PT  Aperte o atalho "Ctrl+Q" para fazer uma pergunta ao ChatGPT, e retornara uma caixa de alerta no neu navegador
// @author       Pedro Henrique
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant       GM_xmlhttpRequest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/487401/Simple%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/487401/Simple%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeyup = (event) => {
        if (event.ctrlKey == true && event.key.toLowerCase() == "q")
        {
            let prompt = window.prompt("Write the question:");
            if (prompt == null || prompt == "") // Caso o prompt for null ou cancelado
                return;
            let _data = { // Informações
                "type": "chat",
                "messagesHistory": [
                    {
                        "id": "",
                        "from": "you",
                        "content": prompt
                    }
                ]
            }
            // Faz a solicitação
            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://talkai.info/pt/chat/send/',
                data: JSON.stringify(_data),
                headers: {"Content-type": "text/plain; charset=UTF-16"},
                onload: (ev) => {
                    // Decifra o Texto Retornado
                    let _texto = decifrarTexto(ev.responseText);
                    // Mostra a resposta na caixa de alerta
                    alert(_texto.replace(/(\\r)|(\\n)/g,"\n"));
                },
                onerror: (er) => {
                    alert("-- Error: There was no response from the API, please try again later");
                    throw "Error returning ChatGPT response";
                }
            });
            function decifrarTexto(data) {
                // Divide o texto
                const linhas = data.split("data: ").map((i) => {return i.slice(0,-2)})
                // Remove as ultimas linhas inuteis
                linhas.pop();linhas.pop(); 
                // Retorna o texto
                return linhas.join("");
            }
        }
    };
})();