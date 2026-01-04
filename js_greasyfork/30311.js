// ==UserScript==
// @name         LP Help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Alex
// @include      http://*.liveperson.net/*
// @include      https://*.liveperson.net/*
// @include      http://*.tbetadmin.com/*
// @include      https://*.tbetadmin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30311/LP%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/30311/LP%20Help.meta.js
// ==/UserScript==

/*聊天右侧*/
(function() {
    setInterval(() => {
        document.querySelectorAll('.sending_time').forEach(a => {
            const title = a.attributes.title.value;
            const newTitle = " " + title;
            a.innerText = newTitle;
        });
    }, 500);
})();

/*主窗口*/
(function() {
    setInterval(() => {
        const container = document.querySelectorAll('.lpview_engagement_widget').forEach(c => {
            const a= c.querySelector('div.lpview_chat_lines_area.chat_messages > div:nth-child(3) > div > div.lpview_status_bubble_time.bubble_status_time');
            const b= c.querySelector('.lpview_engagement_time.duration');
            const titlea = a.attributes.title.value;
            b.innerText = titlea;
        });
    }, 500);
})();

/*开始时间*/
(function() {
    setInterval(() => {
        const container = document.querySelectorAll('.lpview_engagements_area.engagement_container').forEach(c => {
            const a= c.querySelector(' div.lpview_chat_lines_area.chat_messages > div:nth-child(2) > div > div.lpview_status_bubble_time.bubble_status_time');
            const b= c.querySelector('div.lpview_engagement_header.engagement_header.myChat > div.visitors_info > div.lpview_engagement_time.duration');
            const titlea = a.attributes.title.value;
            b.innerText = titlea;
        });
    }, 500);
})();

/* 搜索银行卡1 */
(function() {
    let inited = false;
    const init = () => {
        /* 下拉框类 */
        const cards = document.querySelector('#fbankid');
        const cardValues = Array.from(cards.querySelectorAll('option')).map((o) => {
            return {value: o.value, text: o.innerText};
        });

        const input = document.createElement('input');
        input.style.width = '100px';
        /* 输入框容器 */
        const container = document.querySelector('.selectBank');
        container.append(input);
        input.addEventListener('keyup', (e) => {
            const { value } = e.target;
            const card = cardValues.find(y => y.text.includes(value));
            if (card === null) {
                return;
            }
            cards.value = card.value;
        });
    };

    /* 生成控件 */
    document.querySelector('#showALLBank').addEventListener('click', () => {
        if (!inited) {
            inited = true;
            init();
        }
    });
})();

/* 搜索银行卡2 */
(function() {
    const input = document.createElement('input');
    input.style.width = '100px';
    /* 输入框容器 */
    const container = document.querySelector('.selectBank');
    container.append(input);
    input.addEventListener('keyup', (e) => {
        const { value } = e.target;
        /* 下拉框类 */
        const cards = document.querySelector('#fbankid');
        const bankList = Array.from(cards.querySelectorAll('option')).map((o) => {
            return {value: o.value, text: o.innerText};
        });
        const card = bankList.find(y => y.text.includes(value));
        if (card === null) {
            return;
        }
        cards.value = card.value;
    });
})();
