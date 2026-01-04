// ==UserScript==
// @name         Foundry Adds
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds functionality for Foundry VTT
// @author       You
// @match        https://rpg.redpg.com.br/game
// @match        https://sot.redpg.com.br/game
// @match        https://av.redpg.com.br/game
// @match        https://kronos.redpg.com.br/game
// @match        http://localhost:30000/game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redpg.com.br
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474791/Foundry%20Adds.user.js
// @updateURL https://update.greasyfork.org/scripts/474791/Foundry%20Adds.meta.js
// ==/UserScript==
(function () {
    let timeout = function() {
        'use strict';
        let messageBox = document.getElementById("chat-message");
        if (messageBox == null || messageBox == undefined) {
            setTimeout(timeout, 500);
            return;
        }

        // fonts/fonts.css
        var link = document.createElement( "link" );
        link.href = "fonts/fonts.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";
        document.getElementsByTagName( "head" )[0].appendChild( link );

        function addStyle(css) {
            const style = document.getElementById("GM_addStyleBy8626") || (function() {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.id = "GM_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        }

        if (document.body.classList.contains("system-worldofdarkness")) {
            addStyle(`.message-content { padding-left: 4px !important; padding-right: 4px !important; }`);

            addStyle(`.message-content b, .message-content i, .message-content u {   user-select: text !important; }`);

            // font-family: 'Calibri', 'FoundryVTT' !important;
            addStyle(`.message-sender, .message-content {   font-size: 110% !important; }`);
            addStyle(`.message-sender {   font-weight: bold !important; }`);
            addStyle(`.message-content {   font-family: 'alegreya' !important; }`);
            addStyle(`.message-sender {   font-family: 'alegreyasans' !important; }`);
            //addStyle(`.chat-message:not(.ic) { background-color: rgba(120,255,120); }`);
        }

        function addText(text_to_insert, newPos) {
            let curPos = messageBox.selectionStart;
            let curEnd = messageBox.selectionEnd;
            let curText = messageBox.value;
            if (curPos == curEnd) {
                // write here
                messageBox.value = curText.slice(0, curPos) + text_to_insert + curText.slice(curPos);
                messageBox.selectionStart = curPos + newPos;
                messageBox.selectionEnd = messageBox.selectionStart;
            } else {
                // add in middle
                messageBox.value = curText.slice(0, curPos) + text_to_insert.slice(0, newPos) + curText.slice(curPos, curEnd) + text_to_insert.slice(newPos) + curText.slice(curEnd);
                messageBox.selectionStart = curPos;
                messageBox.selectionEnd = curEnd + text_to_insert.length;
            }
        }

        function intercept (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        messageBox.addEventListener("keydown", (e) => {
            if (e.target == messageBox && e.shiftKey && e.code == "Enter") {
                // processar mensagem
                let text = messageBox.value;

                // Ação
                text = text.replaceAll(/\*(.+?)\*/g, function (outer, group1) {
                    return "<b style='color: red'>*" + group1 + "*</b>";
                });

                // Pensamento
                text = text.replaceAll(/\((.+?)\)/g, function (outer, group1) {
                    return "<b style='color: rgb(30,30,160)'>(" + group1 + ")</b>";
                });

                // Destaque
                text = text.replaceAll(/\[(.+?)\]/g, function (outer, group1) {
                    return "<b>" + group1 + "</b>";
                });

                // Off
                if (text.trim().toLowerCase().indexOf("off:") == 0) {
                    text = `<b style='color:rgb(0,130,0)'>${text}</b>`;
                }

                if (text != messageBox.value) {
                    intercept(e);
                }
                messageBox.value = text;
            } else if (e.target == messageBox && e.code == "KeyB" && e.ctrlKey) {
                addText("<b></b>", 3);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyO" && e.ctrlKey) {
                addText("<b style='color:rgb(0,150,0)'>Off: </b>", "<b style='color:rgb(0,150,0)'>Off: ".length);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyI" && e.ctrlKey) {
                addText("<i></i>", 3);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyU" && e.ctrlKey) {
                addText("<u></u>", 3);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyL" && e.ctrlKey) {
                addText(`<img src="" style="width: 100%; height: auto" />`, `<img src="`.length);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyD" && e.ctrlKey) {
                addText("<b style='color: red'>**</b>", "<b style='color: red'>*".length);
                intercept(e);
            } else if (e.target == messageBox && e.code == "KeyH" && e.ctrlKey) {
                addText("<b style='font-size: 150%'></b>", "<b style='font-size: 150%'>".length);
                intercept(e);
            }
        });
    };
    setTimeout(timeout, 500);
})()