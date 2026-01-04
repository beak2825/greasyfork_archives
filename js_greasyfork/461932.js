// ==UserScript==
// @name         Komica AI Generator
// @namespace    https://chat.openai.com/
// @version      1.3
// @description  允許在 Komica 綜合討論區中使用 OpenAI 的 API 來生成文本，並將其作為快速回復框的回復。
// @author       ChatGPT
// @match        https://gaia.komica1.org/00b/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=komica.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461932/Komica%20AI%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/461932/Komica%20AI%20Generator.meta.js
// ==/UserScript==

window.onload = function () {
    'use strict';
    var API_KEY = 'Replace with your OpenAI API key'; //把你的OpenAI API Key填在這裡
    var qlinks = document.querySelectorAll(".qlink");
    let postContent;
    var quickReplyForm = document.getElementById('quickreply-form');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'ai-generate';
    checkbox.id = 'ai-generate';
    var label = document.createElement('label');
    label.textContent = 'AI生成';
    label.htmlFor = 'ai-generate';
    var brackets = document.createElement('span');
    brackets.textContent = '[';
    var closingBrackets = document.createElement('span');
    closingBrackets.textContent = ']';
    var submitDiv = quickReplyForm.getElementsByTagName('div')[quickReplyForm.getElementsByTagName('div').length - 1];
    submitDiv.appendChild(brackets);
    submitDiv.appendChild(checkbox);
    submitDiv.appendChild(label);
    submitDiv.appendChild(closingBrackets);

    qlinks.forEach((qlink) => {
        qlink.addEventListener('click', (event) => {
            var postId = qlink.dataset.no;
            postContent = document.querySelector(`.post[data-no="${postId}"] .quote`).textContent.trim();

            checkbox.addEventListener('change', function handleCheckboxChange() {
                if (checkbox.checked) {
                    quickReplyForm.querySelector('textarea[name="pOBvrtyJK"]').value = 'AI生成中...';
                    var API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
                    var prompt = [{
                            "role": "system",
                            "content": "Please reply to this post using zh-tw."
                        }, {
                            "role": "user",
                            "content": postContent
                        }
                    ];
                    var data = {
                        'model': 'gpt-3.5-turbo',
                        'messages': prompt,
                        'max_tokens': 1048, //最大token數, 生成文章長度限制
                        'temperature': 1, //控制生成的採樣溫度，取值範圍為0到2。較高的溫度值會使輸出更隨機，而較低的溫度值則會使輸出更加集中和確定性。
                    }

                    var headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + API_KEY + ''
                    };

                    fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(data)
                    })
                    .then((response) => {
                        response.json().then((json) => {
                            var replyText = json.choices[0].message.content;
                            quickReplyForm.querySelector('textarea[name="pOBvrtyJK"]').value = ">>" + postId + "\n" + replyText;
                            checkbox.checked = false;
                            checkbox.removeEventListener('change', handleCheckboxChange);
                        })
                        .catch((error) => {
                            if (API_KEY === 'Replace with your OpenAI API key') {
                                quickReplyForm.querySelector('textarea[name="pOBvrtyJK"]').value = '我是精障...就是不填API key..(去填啦很簡單= =';
                            } else {
                                console.error(error);
                                quickReplyForm.querySelector('textarea[name="pOBvrtyJK"]').value = '-Error- 出錯了 可能你API key怪怪的';
                            }
                            checkbox.removeEventListener('change', handleCheckboxChange);
                        });
                    })
                }
            });
        });
    });
}
