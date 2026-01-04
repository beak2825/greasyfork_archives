// ==UserScript==
// @name           KAntibot
// @name:ja        Kーアンチボット
// @namespace      http://tampermonkey.net/
// @homepage       https://theusaf.org
// @version        4.2.7
// @icon           https://cdn.discordapp.com/icons/641133408205930506/31c023710d468520708d6defb32a89bc.png
// @description    Remove all bots from a kahoot game.
// @description:es eliminar todos los bots de un Kahoot! juego.
// @description:ja Kahootゲームから全てのボットを出して。
// @author         theusaf
// @copyright      2018-2023, Daniel Lau (https://github.com/theusaf/kahoot-antibot)
// @supportURL     https://discord.gg/pPdvXU6
// @match          *://play.kahoot.it/*
// @exclude        *://play.kahoot.it/v2/assets/*
// @grant          none
// @inject-into    page
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/519671/KAntibot.user.js
// @updateURL https://update.greasyfork.org/scripts/519671/KAntibot.meta.js
// ==/UserScript==
// biome-ignore lint/suspicious/noRedundantUseStrict: Removing this causes strict to be placed at the top of the file, which causes issues with the userscript
"use strict";
/*

MIT LICENSE TEXT

Copyright 2018-2023 theusaf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/**
 * Special thanks to
 * - epicmines33
 * - stevehainesfib
 *
 * for helping with contribution and testing of this project
 */
const getAI = async function (data) {
    var url, body;

    function toDataUrl(url) {
        return new Promise(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        })
    }

    // [REQUIRED] Remember to change your API keys.
    if (data.image) {
        const b64 = (await toDataUrl(data.image)).replace("data:", "").split(";base64,");

        url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=<token>';

        body = JSON.stringify({ "contents": [{ "parts": [{ "text": `Answer the following question using the image context provided: ${data.question}. If there are multiple answers and there is no 'All of above/multiple' option, answer a random one. Reply ONLY with the answer that needs to be one of: ${data.options.join("; ")}.` }, { "inline_data": { "mime_type": b64[0], "data": b64[1] } }] }] });
    } else {
        url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=<token>';

        body = JSON.stringify({ "contents": [{ "parts": [{ "text": `${data.question}? Reply only with your option. If there are multiple answers and there is no 'All of above/multiple' option, answer a random one.
Options: [${data.options.join(", ")}]` }] }] });
    }


    var response = (await (await fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: body
      })).json());

    try {
        response = response.candidates[0].content.parts[0].text.trim().toLowerCase().replaceAll(".", "").replaceAll(",", "");
    } catch {
        return alert("An error occured. Make sure you're in a supported country. Response:\n\n" + response)
    }

    document.querySelectorAll("button[class*='choice']").forEach(function (e) {
        var text = e.innerText.trim().toLowerCase().replaceAll(".", "").replaceAll(",", "");
        if (text == response) { e.click() }
    })

    return response;
}

const getAnswer = async function () {
    var question, image = "";
    var options = [];

    if (document.querySelector("img[class*='question-base-image']")) {
        image = document.querySelector("img[class*='question-base-image']").src;
    }

    question = document.querySelector("span[class*='question-title__Title']").innerText.trim();

    document.querySelectorAll("button[class*='choice']").forEach(function (e) {
        var text = e.innerText;
        options.push(text)
    })

    return await getAI({ question, image, options })
}

const main = function () {
    alert("Cheat mode activated");

    setInterval(function () {
        if (document.querySelector("button[class*='choice']") && !(document.querySelector("div[class*='extensive-question-title']").getAttribute("done") == "yes")) {
            getAnswer();
            document.querySelector("div[class*='extensive-question-title']").setAttribute("done", "yes")
        }
    }, 100)
}

main();