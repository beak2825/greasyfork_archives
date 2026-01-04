// ==UserScript==
// @name         一键同步用户
// @namespace    onekeysync
// @match        *://hms.test.rj-info.com/*
// @match        *://hms.rjmart.cn/*
// @version      1.0
// @description  用于 HMS 一键同步用户信息
// @author       maxwell kwok
// @icon         https://www.rjmart.cn/static/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452729/%E4%B8%80%E9%94%AE%E5%90%8C%E6%AD%A5%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452729/%E4%B8%80%E9%94%AE%E5%90%8C%E6%AD%A5%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const href = window.location.href;
    debugger;
    if (!href.toString().endsWith("deptList")) {
        return;
    }
    async function postData(url = '', data = {}, token = '') {
        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-org': 155
            },
            body: JSON.stringify(data)
        });
        return response.json();
    };
    const sync = () => {
        alert("开始一键同步用户");
        const token = JSON.parse(localStorage.getItem('hms_btk')).token;
        postData('https://gateway.rjmart.cn/store/user/hms/dept/list', { "page": 1, "size": 2000 }, token)
            .then(({ data }) => {
                const users = data.filter(d => d.type == 0 && !d.name.startsWith('测试'));
                for (let user of users) {
                    postData('https://gateway.rjmart.cn/store/user/hms/dept/user/syncInternalUser', { "id": user.id }, token)
                        .then((resp) => {
                        if (resp.code == 500) {
                            alert(resp.msg);
                        }
                    });
                }
                alert('同步完毕，请刷新后查看');
        });
    }

    setTimeout(() => {

        let bar = document.querySelectorAll("div.zen_m-t-20.zen_clf")[0];
        let btn = document.createElement('button');
        btn.append("一键用户同步")
        btn.classList.add("ZenForm-button");
        btn.style.cssText += 'color:white;background-color:#53dfe6';
        btn.onclick = sync;
        bar.append(btn);
    }, 1000);

})();