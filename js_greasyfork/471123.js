// ==UserScript==
// @name         report button
// @namespace    https://lolz.guru/
// @version      0.1
// @description  666
// @author       You
// @include      /^https:\/\/(lolz\.guru|zelenka\.guru)/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471123/report%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/471123/report%20button.meta.js
// ==/UserScript==
 
(function() {
    const buttons = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": {
            name: 'Оффтоп',
        },
        "Создание темы не в соответствующем разделе": {
            name: 'раздел',
        },
    }
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;
 
    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData });
    }
 
 
    const blocks = document.querySelectorAll('#messageList > li');
    for(let block of blocks) {
        for(let key in buttons) {
            let name = buttons[key].name;
            let message = buttons[key].message;
            let span = document.createElement('span');
            span.innerText = name;
            span.setAttribute('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer;')
            span.onclick = function() {
                let formData = new FormData();
                formData.append("message", key)
                formData.append("is_common_reason", 1)
                formData.append("_xfToken", _xfToken);
                formData.append("_xfNoRedirect", 1)
                formData.append("_xfToken", _xfToken);
                formData.append("redirect", window.location.href);
                postData('posts/' + block.id.split('-')[1] +'/report', formData)
                XenForo.alert('Жалоба отправлена', '', 5000);
            }
            if(block.querySelector('.publicControls')) block.querySelector('.publicControls').prepend(span)
 
        }
    }
})();
 
(function() {
    var regex = /&user_id=(\d+)&username/g;
 
    const threadList = document.querySelector(".userContentLinks");
    if(!threadList) {
        console.log('its not a member');
        return;
    }
    const currentUserId = regex.exec(threadList.firstElementChild.href)[1];
    console.log(currentUserId);
 
    function createButton(parent, callback) {
        let btnname = document.createElement("a");
        btnname.className = "OverlayTrigger button smallButton";
        btnname.style.margin = "10px 0 5px";
        btnname.style.backgroundColor = "rgb(136,68,68)";
        btnname.innerHTML = "Report";
        btnname.onclick = callback;
        parent.appendChild(btnname);
    }
 
 
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;
    const title = document.querySelector('.userContentLinks a:first-child').getAttribute('href').split('=')[3];
    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData })
            .then(function(response) {
            // Стоит проверить код ответа.
            if (!response.ok) {
                // Сервер вернул код ответа за границами диапазона [200, 299]
                return Promise.reject(new Error(
                    'Response failed: ' + response.status + ' (' + response.statusText + ')'
                ));
            }
 
            // Далее будем использовать только JSON из тела ответа.
            return response.json();
        }).then(function(data) {
            console.log(data['_redirectTarget'])
            var threadlink = data['_redirectTarget']
            if (threadlink) {
                window.location.replace(threadlink)
            }
        });
    };
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
 
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
 
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
 
    waitForElm('.ipMatches').then((elm) => {
        console.log('IP Opened');
 
        let elements = document.getElementsByClassName('userInfo');
        for(let el of elements) {
            if(el.getElementsByClassName("banReason").length > 0) {
                createButton(el, function() {
                    let formData = new FormData();
                    formData.append("prefix_id[]", 92);
                    formData.append("title", 'Жалоба на ' + decodeURIComponent(title));
                    formData.append("message_html", '<p>1. Никнейм нарушителя и ссылка на профиль: https://lolz.guru/members/'+ currentUserId +'/ @'+ decodeURIComponent(title) + '</p><p>2. Краткое описание жалобы: Был ранее заблокирован</p> <p>3. Доказательства: https://lolz.guru/members/'+ currentUserId +'/shared-ips</p>')
                    formData.append("_xfRelativeResolver:", "https://lolz.guru/forums/test-forum/create-thread")
                    formData.append("tags", "кидок,мульт,мошенник")
                    formData.append("watch_thread", 1)
                    formData.append("watch_thread_state", 1)
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfRequestUri", "/forums/801/create-thread");
                    formData.append("_xfNoRedirect", 0)
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfResponseType", "json");
                    postData(`https://lolz.guru/forums/801/add-thread`, formData)
                    XenForo.alert('Жалоба размещена', '', 5000);
 
                });
            }
        }
    });
})();