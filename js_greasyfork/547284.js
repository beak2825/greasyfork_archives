// ==UserScript==
// @name         ViewAnswers
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  View all alatin answers
// @author       alistair
// @match        https://app.alatin.it/unita/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alatin.it
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547284/ViewAnswers.user.js
// @updateURL https://update.greasyfork.org/scripts/547284/ViewAnswers.meta.js
// ==/UserScript==

// TODO: fix "G"
(function() {
    const consoleContainer = document.createElement('div');
    consoleContainer.id = 'second-console';
    consoleContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background: black;
        color: #fff;
        font-family: monospace;
        font-size: var(--mantine-font-size-md);
        padding: 5px;
        text-align: center;
        z-index: 999999;
    `;
    document.body.appendChild(consoleContainer);

    // Logging function
    window.htmlLog = function(msg) {
        const line = document.createElement('div');
        line.textContent = msg;
        consoleContainer.appendChild(line);
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
    };

    window.htmlLogClear = function() {
        consoleContainer.innerHTML = "";
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
    };

    // Example
    htmlLog("Puoi copiare e incollare");

    const allowCopyAndPaste = function(e){
        e.stopImmediatePropagation();
        return true;
    };
    document.addEventListener('copy', allowCopyAndPaste, true);
    document.addEventListener('paste', allowCopyAndPaste, true);
    document.addEventListener('onpaste', allowCopyAndPaste, true);


    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return open.apply(this, arguments);
    };

    function findRandomAnswer(str){
        const sep = str.split(" | ");
        if (str.includes(" | "))
            return sep[Math.floor(Math.random() * sep.length)];
        else return str;
    }

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
        let data = this.responseText;
        try {
            data = JSON.parse(data);
        } catch (_) {}
            //console.log(data);
            if (!data.step || !data.step.elementi) return;
            console.log(data);

            let tipo = "";
            for (const i of data.step.elementi){
                if (i.tipo)
                    tipo = i.tipo;
            }
            let realAnswer = "";
            switch (tipo) {
                case "M":
                    realAnswer = data.step.elementi[data.step.elementi.length - 1].testo_principale;
                    break;
                case "O":{
                    realAnswer = findRandomAnswer(data.step.elementi[data.step.elementi.length - 1].risposta_1);
                    break;
                }
                case "U":
                    for (let i = 1; i < data.step.elementi.length; i++){
                        if (data.step.elementi[i].risposta_1.length)
                            realAnswer += findRandomAnswer(data.step.elementi[i].risposta_1);
                        else
                            realAnswer += findRandomAnswer(data.step.elementi[i].testo_principale);
                        realAnswer += "; ";
                    }
                    break;
                case "P":
                    for (let i = 1; i < data.step.elementi.length; i++){
                        realAnswer += findRandomAnswer(data.step.elementi[i].testo_principale);
                        realAnswer += "; ";
                    }
                default:
                    break;
            }
            if (!realAnswer.length){
                if (data.step.elementi.length == 3) {
                    if (data.step.elementi[data.step.elementi.length - 1].risposta_1 != "")
                        realAnswer = data.step.elementi[data.step.elementi.length - 1].risposta_1;
                    else
                        realAnswer = data.step.elementi[data.step.elementi.length - 1].testo_principale;
                } else {
                    const answer = data.step.elementi[data.step.elementi.length - 1].testo_principale;
                    const answers = answer.split(" | ");
                    realAnswer = answers[Math.floor(Math.random() * answers.length)];
                }
            }

            htmlLogClear();
            console.log(realAnswer, realAnswer.length);
            htmlLog(realAnswer);
        });
        return send.apply(this, arguments);
    };

})();