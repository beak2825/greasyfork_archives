// ==UserScript==
// @name         還我小餅
// @namespace    -
// @version      0.1.2
// @description  還我小餅還我小餅還我小餅還我小餅還我小餅還我小餅還我小餅還我小餅還我小餅還我小餅
// @author       牛頭丸神獸
// @include      https://kater.me/*
// @downloadURL https://update.greasyfork.org/scripts/417731/%E9%82%84%E6%88%91%E5%B0%8F%E9%A4%85.user.js
// @updateURL https://update.greasyfork.org/scripts/417731/%E9%82%84%E6%88%91%E5%B0%8F%E9%A4%85.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let token;
    const host = "https://kater.me/";
    const uid = 266;

    // Your code here...
    async function edit(source) {
        let did = source.parentNode.parentNode.parentNode.getAttribute("data-id");
        let flag;

        source.innerText = `正在取得文章串 ${did} 資訊`;
        let pid = await fetch(`${host}/api/discussions/${did}`, {
            "headers": {
                "x-csrf-token": token
            }
        }).then(
            r => r.json()
        ).then(
            r => r.included[0].id
        ).catch(
            e => 0
        );

        if(pid == 0) {
            source.innerText = `取得首篇貼文失敗！`;
            return;
        }

        source.innerText = `正在編輯文章串 ${did} 的標題`;
        flag = await fetch(`${host}/api/discussions/${did}`, {
            "headers": {
                "content-type": "application/json; charset=UTF-8",
                "x-csrf-token": token,
                "x-http-method-override": "PATCH"
            },
            "body": "{\"data\":{\"type\":\"discussions\",\"id\":\"" + did + "\",\"attributes\":{\"title\":\"還我小餅\"}}}",
            "method": "POST"
        }).then(
            r => r.json()
        ).then(
            r => r.included[0].id
        ).catch(
            e => 0
        );

        if(flag == 0) {
            source.innerText = `編輯標題失敗`;
            return;
        }

        source.innerText = `正在編輯文章 ${pid} 的內容`;
        flag = await fetch(`${host}/api/posts/${pid}`, {
            "headers": {
                "content-type": "application/json; charset=UTF-8",
                "x-csrf-token": token,
                "x-http-method-override": "PATCH"
            },
            "body": "{\"data\":{\"type\":\"posts\",\"id\":\"" + pid + "\",\"attributes\":{\"content\":\"還我小餅\"}}}",
            "method": "POST"
        }).then(
            r => r.json()
        ).then(
            r => r.included[0].id
        ).catch(
            e => 0
        );

        if(flag == 0) {
            source.innerText = `編輯文章失敗！`;
            return;
        }

        source.innerText = `完成`;
    }

    setInterval(()=>{
        if(app && app.data && app.data.session) {
            token = app.data.session.csrfToken;
            let target = [...document.querySelectorAll("ul.DiscussionList-discussions > li[data-id]:not([added])")].filter(each => each.querySelector(`a.DiscussionListItem-author[href='/u/${uid}']`));

            if(target.length > 0) {
                const html = `
<div class="EDIT_HERE" style="color: #f00; background-color: #fff; padding: 4px; border: 1px solid #0f0; width: fit-content; user-select: none; cursor: pointer; font-weight: bold;">還我小餅</div>
`;

                target.forEach(each => {
                    each.setAttribute("added", "true");
                    each.querySelector("div.DiscussionListItem-content").insertAdjacentHTML("afterbegin", html);
                    each.querySelector("div.EDIT_HERE").onclick = e => {
                        let source = e.target;
                        edit(source);
                    }
                });
                console.log(target.length);
            }
        }
    },100);

})();