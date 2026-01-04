// ==UserScript==
// @name         report buttons
// @namespace    https://zelenka.guru/
// @version      0.1
// @description  Остальные полезные скрипты - https://zelenka.guru/threads/5310268/
// @author       Jack
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512806/report%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/512806/report%20buttons.meta.js
// ==/UserScript==

(function() {
    const buttons = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": {
            name: '1.1',
        },
        "Создание темы не в соответствующем разделе": {
            name: '2.12',
        },
        "Неправильное оформление темы": {
            name: '3.2',
        },
    }
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;

    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData });
    }

    function addButtonToPosts() {
        const blocks = document.querySelectorAll('#messageList > li');
        for(let block of blocks) {
            if (block.querySelector(".custom-button")) {
                continue;
            }

            for(let key in buttons) {
                let name = buttons[key].name;
                let message = buttons[key].message;
                let span = document.createElement('span');
                span.innerText = name;
                span.className = "custom-button";
                span.setAttribute('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer;')
                span.onclick = function() {
                    if(!confirm('Отправляем?')) return false;
                    let formData = new FormData();
                    formData.append("message", key);
                    formData.append("is_common_reason", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfNoRedirect", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("redirect", window.location.href);
                    postData('posts/' + block.id.split('-')[1] +'/report', formData);
                    XenForo.alert('Жалоба отправлена', '', 5000);
                }
                if(block.querySelector('.publicControls')) block.querySelector('.publicControls').prepend(span);
            }
        }
    }

    addButtonToPosts();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addButtonToPosts();
            }
        });
    });

    observer.observe(document.getElementById('messageList'), { childList: true });

})();