// ==UserScript==
// @name         Cool rate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds the ability to give ratings with any decimal place
// @author       SuperG
// @match        https://scpfoundation.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scpfoundation.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491282/Cool%20rate.user.js
// @updateURL https://update.greasyfork.org/scripts/491282/Cool%20rate.meta.js
// ==/UserScript==

(function() {
    let interceptedRequest = null;

    const originalFetch = window.fetch;

    window.fetch = function(input, init) {
        if (init && init.method && init.method.toUpperCase() === 'POST') {
            const requestData = JSON.parse(init.body);

            if (requestData.method === "rate" && Object.values(requestData.params)[0] != null) {
                interceptedRequest = { input, requestData };

                showTextField();

                return new Promise(() => {});
            }
        }

        return originalFetch.apply(this, arguments);
    };

    function updateResult(result, newresult) {
        if (newresult=='') {
            result.innerText = 'Введите число';
        } else if (Number(newresult) !== newresult) {
            result.innerText = 'Введено неверное значение\nВводите только числа';
        } else if (newresult < 0) {
            result.innerText = 'Итоговая оценка слишком мала\nНаименьшая возможная: 0.0';
        } else if (newresult > 5) {
            result.innerText = 'Итоговая оценка слишком большая\nНаибольшая возможная: 5.0';
        } else {
            result.innerText = 'Ваша оценка: ' + newresult;
            return true
        }
        return false
    }


    function showTextField() {
        const info = document.createElement('div');
        info.style.cssText = `color:white;position:fixed;top:33%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;font-size:1.5em;`
        info.innerText = `Вы выбрали оценку ${interceptedRequest.requestData.params.value}\n\nВведите снизу число после запятой для вашей оценки и нажмите Enter.\n\nЧтобы оставить выбранную оценку просто нажмите Enter.`;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Сколько десятых добавить?';
        inputField.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);height:30px;width:200px;padding-top:5px;text-align:center;z-index:9999;`;

        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.7);z-index: 999;`;

        var result = document.createElement('div')
        result.style.cssText = `color:white;position:fixed;top:60%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;font-size:2em;`
        result.innerText='Ваша оценка:'

        document.body.appendChild(info);
        document.body.appendChild(inputField);
        inputField.focus();
        document.body.appendChild(overlay);
        document.body.appendChild(result);

        inputField.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                var newValue = parseFloat(inputField.value);
                var updatedValue = interceptedRequest.requestData.params.value + newValue/10;
                if (updateResult(result, updatedValue) == true || inputField.value=='')
                    {
                        if (!(inputField.value =='')){
                            interceptedRequest.requestData.params.value += newValue/10;
                        }
                        sendModifiedRequest(interceptedRequest);
                        info.parentNode.removeChild(info);
                        inputField.parentNode.removeChild(inputField);
                        overlay.parentNode.removeChild(overlay);
                        result.parentNode.removeChild(result);
                    }
            } else {
                    updateResult(result, interceptedRequest.requestData.params.value + event.target.value/10);
                }
        });
    }

    function sendModifiedRequest(interceptedRequest) {
        originalFetch(interceptedRequest.input, {
            method: 'POST',
            body: JSON.stringify(interceptedRequest.requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Cool rate | Response:', response);
        })
        .catch(error => {
            console.error('Cool rate | Error:', error);
        });
    }
})();