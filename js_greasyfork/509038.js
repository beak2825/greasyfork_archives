// ==UserScript==
// @name         Delete Kimi Messages
// @namespace    http://github.com/dbk6028
// @version      0.2
// @description  一键删除 Kimi 聊天记录
// @author       CBK
// @license     GPLv3
// @match        https://kimi.moonshot.cn/*
// @icon         https://statics.moonshot.cn/kimi-chat/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509038/Delete%20Kimi%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/509038/Delete%20Kimi%20Messages.meta.js
// ==/UserScript==



let timer = setInterval(() => {
    if (document.querySelector('[class="historyModal___qTQKs"]') !== null) {

        listen_history_page();
        clearInterval(timer);
    }
}, 1000);


function listen_history_page() {
    const observer = new MutationObserver((mutations) => {

        add_delete_button();
    });

    let history_page = document.querySelector('[class="historyModal___qTQKs"]');
    is_exist(history_page);

    observer.observe(history_page, { attributes: true });
}

function add_delete_button() {
    const title = document.querySelector('[class="historyTitle___F_iam"]');
    is_exist(title);
    const button = document.createElement('button');
    button.innerHTML = '删除所有历史会话';
    title.appendChild(button);

    button.addEventListener('click', function () {



        const __tea_cache_tokens_20001731 = localStorage.getItem('__tea_cache_tokens_20001731');
        const __tea_cache_tokens_20001731_o = JSON.parse(__tea_cache_tokens_20001731);

        let headers = {
            'Content-Type': 'application/json',
            'X-MSH-Device-ID': __tea_cache_tokens_20001731_o.web_id,
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'X-MSH-Platform': 'web',
            'R-Timezone': 'Asia/Shanghai',
            'X-Traffic-Id': __tea_cache_tokens_20001731_o.user_unique_id,
            'Priority': 'u=4',
        };
        logger(JSON.stringify(headers));
        fetch('https://kimi.moonshot.cn/api/chat/list', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ offset: 0, size: 30 })
        })
            .then(response => response.json())
            .then(data => {




                let chats = data.items;
                chats.forEach(chat => {


                    headers.Priority = 'u=0';
                    fetch(`https://kimi.moonshot.cn/api/chat/${chat.id}`, {
                        method: 'DELETE',
                        headers: headers
                    }).then(response => {
                        if (response.ok) {
                            logger(`${chat.id} 删除成功`);
                        } else {
                            logger(`${chat.id} 删除失败`);
                        }
                    });
                });

            });
    });

    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
}


function logger(message) {
    console.log(`[${new Date().toLocaleString()}] ${message}`);
}

function is_exist(elem) {
    if (elem) {
        logger(`${elem} 存在`);
    } else {
        logger(`元素不存在`);
    }
}