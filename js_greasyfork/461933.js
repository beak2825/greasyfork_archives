// ==UserScript==
// @name         ChatPDF-Save-To-Markdown
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  save chatpdf dialogs to markdown
// @author       Lavapapa
// @match        https://www.chatpdf.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatpdf.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461933/ChatPDF-Save-To-Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/461933/ChatPDF-Save-To-Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // what markdown prefix to use for every line of the message.
    // for example, > for quotes, or - for lists, or # for headers
    const ai_prefix_every_line = " > "
    const user_prefix_every_line = ""

    function truncateString(str) {
        if (str.length <= 40) {
            return str;
        } else {
            const mid = Math.floor(str.length / 2);
            const before = str.substr(0, mid);
            const after = str.substr(mid + 1);
            return `${before}...${after}`;
        }
    }

    function createSaveButton(){
        var button = document.createElement('button');
        button.setAttribute('class', 'ant-btn css-1n7nwfa ant-btn-link');
        button.setAttribute('style', 'padding-right: 0px;');
        button.innerHTML = 'Save';
        return button;
    }
    function onClick(){
        const title = document.querySelector('.ant-card-head-title').textContent.trim();
        var chatMessageRows = document.querySelectorAll('.chat-message-row');
        var messages = [];
        for (var i = 0; i < chatMessageRows.length; i++) {
            var message = chatMessageRows[i].textContent.trim();
            if(chatMessageRows[i].classList.contains('ai')){
                messages.push(message.replace(/^/gm, ai_prefix_every_line))
            } else {
                messages.push(message.replace(/^/gm, user_prefix_every_line));
            }
        }
        const mergedText = messages.join('\n\n');

        const text = `# ${title}\n\n\`Saved at ${new Date().toLocaleString()}\`\n\n\n${mergedText}`;
        var filename = "[ChatPDF Save]" + truncateString(title) + '.md';
        var blob = new Blob([text], { type: 'text/plain' });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var a = document.createElement('a');
            var url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    const button = createSaveButton()
    button.addEventListener('click', onClick)
    var antCardExtra = document.querySelector('.ant-card-extra');
    antCardExtra.insertBefore(button, antCardExtra.firstChild);

})();