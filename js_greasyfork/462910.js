// ==UserScript==
// @name         OCR Image Content Display
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Displays the text content of the image in the clipboard using OCR and displays it in an alert when the script is run.
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462910/OCR%20Image%20Content%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/462910/OCR%20Image%20Content%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

       async function displayImageContent() {

        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    const formData = new FormData();
                    formData.append('apikey', '你自己的 api');
                    formData.append('language', 'eng');
                    formData.append('isOverlayRequired', 'false');
                    formData.append('file', blob, 'image.png');
                    const response = await fetch('https://api.ocr.space/parse/image', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (data && data.ParsedResults && data.ParsedResults.length > 0) {
                        const text = data.ParsedResults[0].ParsedText;
                        // 将识别结果显示在一个提示框中
                        // 调用 OpenAI 的翻译服务将识别结果翻译成中文
 const audio = new Audio(`https://tsn.baidu.com/text2audio?tex=${text}&lan=zh&cuid=abcdefg1234567&ctp=1&per=5003&tok=你自己的 tok`);
                        const apiKey = "你自己的 api";
                        const openaiResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                prompt: `Translate the following English text into Chinese:\n\n${text}.`,
                                max_tokens: 1000,
                                n: 1,
                                temperature: 0.9
                            })
                        });
                        const openaiData = await openaiResponse.json();
                        const translation = openaiData.choices[0].text;
                        // 将识别结果和翻译结果显示在一个提示框中
                        alert(`${text}${translation}`);
audio.play();
                    }
                }
            }
        }


       }

    const cursor = document.createElement('button');
    cursor.style.position = 'fixed';
    cursor.style.top = '10%';
    cursor.style.right = '10%';
    cursor.style.width = '50px';
    cursor.style.height = '50px';
    cursor.style.backgroundColor = '#b1c5b4';
    cursor.style.borderRadius = '50%';
    //cursor.style.cursor = 'pointer';
    cursor.style.boxShadow = '0 8 24px rgba(0, 0, 0, 0.15)';
    cursor.innerText = '👻';
    cursor.style.fontSize = '20px';
    cursor.style.border = "2px solid #888888";
    cursor.style.zIndex = '9999';

    document.body.appendChild(cursor);


    cursor.addEventListener('click', displayImageContent);
})()