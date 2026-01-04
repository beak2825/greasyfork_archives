// ==UserScript==
// @name         Глор ио Автопереводчик с английский на русского
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Простой англо-русский переводчик для игры Глар ио. Кредит Финну Ланкастеру (Finn Lancaster) за оригинал.
// @author       flancast90
// @match        *://glar.io/*
// @match        *://dev.glar.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glar.io
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472404/%D0%93%D0%BB%D0%BE%D1%80%20%D0%B8%D0%BE%20%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA%20%D1%81%20%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BD%D0%B0%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/472404/%D0%93%D0%BB%D0%BE%D1%80%20%D0%B8%D0%BE%20%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA%20%D1%81%20%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BD%D0%B0%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.meta.js
// ==/UserScript==
// это форк автопереводчика Глар ио. Кредит Финну Ланкастеру (Finn Lancaster) за оригинал. Я удалил раздел с русского на английский.

var prior = []

// Я мог или не мог взломать этот сервис перевода для этого 0-0
async function translate(text, from, to) {
    const req = await fetch("https://api.reverso.net/translate/v1/translation", {
        "mode": "cors",
        "headers": {
            "content-type": "application/json"
        },
        "body": "{\"format\":\"text\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"input\":\"" + text + "\",\"options\":{\"sentenceSplitter\":true,\"origin\":\"translation.web\",\"contextResults\":true,\"languageDetection\":false}}",
        "method": "POST",
    });

    const out = await req.json();
    return out.translation;
}

function change() {
    setInterval(async function() {
        var local_chats = document.getElementsByClassName('speechbubble');
        var server_chats = document.getElementsByClassName('chat-normal');
        var team_chats = document.getElementsByClassName('chat-team');

        for (var ii = 0; ii < team_chats.length; ii++) {
            if (team_chats[ii].className.includes("translated")) {
                // ничего не делать
            } else {
                var ttext_to_translate = team_chats[ii].innerText;

                var ttranslated_text = await translate(ttext_to_translate, document.getElementById('from').value, document.getElementById('to').value);

                team_chats[ii].innerText = ttranslated_text;

                team_chats[ii].className += " translated";
            }
        }

        for (var index = 0; index < server_chats.length; index++) {
            if (server_chats[index].className.includes("translated")) {
                // ничего не делать
            } else {
                var stext_to_translate = server_chats[index].innerText;

                var stranslated_text = await translate(stext_to_translate, document.getElementById('from').value, document.getElementById('to').value);

                server_chats[index].innerText = stranslated_text;

                server_chats[index].className += " translated";
            }
        }

        for (var i = 0; i < local_chats.length; i++) {
            if (local_chats[i].getElementsByTagName('input')[0]) {
                // ничего не делать
            } else {
                // не переводи туда-сюда
                if (i+1 > prior.length) {
                    prior.push("");

                } else {
                    if (prior[i] == local_chats[i].innerHTML) {
                        // ничего не делать
                    } else {
                        var text_to_translate = local_chats[i].innerText;

                        var translated_text = await translate(text_to_translate, document.getElementById('from').value, document.getElementById('to').value);

                        // установить чат равным ответу перевода
                        local_chats[i].innerText = translated_text;

                        prior[i] = translated_text;
                    }
                }
            }
        }
    }, 500);
}

change()

var flancast90_hax = document.createElement('script');
flancast90_hax.setAttribute('id', 'translate');
document.body.appendChild(flancast90_hax);

document.getElementById('translate').innerHTML = `
            function help_translate() {
                if (document.getElementById('help').style.display == "none") {
                    document.getElementById('help').style.display = "block"
                } else {
                    document.getElementById('help').style.display = "none"
                }
            }
        `

document.head.innerHTML += `<style>.tbtn { z-index:1000; position:fixed; left:5px; bottom:-1px; }</style>`;

var help_btn = document.createElement('button');
help_btn.setAttribute('id', 'help_tbtn');
help_btn.setAttribute('class', 'tbtn');
help_btn.setAttribute('onclick', 'help_translate()');
document.body.appendChild(help_btn);

document.getElementById('help_tbtn').innerHTML = "Translation Menu";

document.body.innerHTML += `
    <div id="help" style="display:none; position:absolute; top:50%; left:50%; width:25vw; height:50vh; background-color: gray; opacity:0.5; overflow-y:scroll; transform: translate(-50%, -50%);">
        <h1>Autotranslate: flancast90</h1>
        <h3>Config</h3>

        <label for="from">From Language: </label>
        <select name="from" id="from">
            <option value="eng">English</option>
        </select>

        <br>

        <label for="to">To Language: </label>
        <select name="to" id="to">
            <option value="rus">Russian</option>
        </select>

        <br>
    </div>`;