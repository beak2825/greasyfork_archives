// ==UserScript==
// @name         拓元
// @namespace    http://tampermonkey.net/
// @version      20241023.1
// @description  hello
// @author       You
// @match        https://tixcraft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tixcraft.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513522/%E6%8B%93%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/513522/%E6%8B%93%E5%85%83.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    document.addEventListener("DOMContentLoaded", async function () {
        if (path.startsWith("/ticket/ticket/")) {
            var base64 = await getBase64FromImageUrl('https://tixcraft.com/ticket/captcha');
            console.log(base64);
            var capt = await recognizeCaptchaWithGoogleAPI(base64);

            var selectElement = document.querySelector('form select');

            var maxValue = -Infinity;
            selectElement.querySelectorAll('option').forEach(function (option) {
                var value = parseFloat(option.value);
                if (!isNaN(value) && value > maxValue) {
                    maxValue = value;
                }
            });

            //document.querySelector('form select').value = maxValue;
            document.querySelector('form select').value = 2;
            document.querySelector('#TicketForm_agree').checked = true;
            document.querySelector('#TicketForm_verifyCode').value = capt;
            document.querySelector('form').submit();
        }
    });

    var path = window.location.pathname;
    var path_arr = path.split('/');
    if (path.startsWith("/activity/detail/")) {

        var interval = 500;

        while (true) {
            try {
                console.log("檢查");
                var game_res = await fetch("https://tixcraft.com/activity/game/" + path_arr[3]);
                var game_text = await game_res.text();

                var game_doc = new DOMParser().parseFromString(game_text, 'text/html');
                var btn = game_doc.querySelector('td button[data-href]');
                if (btn != null) {
                   var area_url = btn.getAttribute('data-href');
                    var area_res = await fetch(area_url);
                    var area_text = await area_res.text();
                    var area_doc = new DOMParser().parseFromString(area_text, 'text/html');
                    var scripts = area_doc.querySelectorAll('body script');
                    var json;
                    scripts.forEach(script => {
                        const scriptContent = script.textContent;
                        if (scriptContent.includes('var areaUrlList')) {
                            const lines = scriptContent.split('\n');
                            lines.forEach((line) => {
                                if (line.includes('var areaUrlList')) {
                                    json = JSON.parse(line.trim().replace("var areaUrlList = ", '').replace(/;$/, ''));

                                }
                            });
                        }
                    });
                    window.location.href = Object.values(json)[0];
                    break;
                }
            } catch (error) {
                console.error("發生錯誤:", error);
            }

            // 等待 100 秒後再次檢查
            await new Promise(resolve => setTimeout(resolve, interval));
        }




    }



})();

function getBase64FromImageUrl(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.crossOrigin = 'Anonymous';  // 避免跨域問題
        img.src = url;
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");  // 轉為 base64
            resolve(dataURL);
        };
        img.onerror = function () {
            reject(new Error("無法加載圖片：" + url));
        };
    });
}

async function recognizeCaptchaWithGoogleAPI(base64Image) {
    const apiKey = 'AIzaSyBiDc8GgXwwCNCzc5zglzEdnJzgTnVLLC4';
    const requestBody = {
        "requests": [
            {
                "image": {
                    "content": base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")  // 去除 base64 的前綴
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    }
                ]
            }
        ]
    };

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    if (result.responses && result.responses[0].textAnnotations) {
        const text = result.responses[0].textAnnotations[0].description;
        console.log('解析結果:', text);
        return text
    } else {
        console.log('無法解析圖片');
        return null
    }
}