// ==UserScript==
// @name         我只要知道回文成功就好了。
// @namespace    -
// @version      0.1.0
// @description  對，我不需要預覽，你告訴我新增或編輯回文有沒有成功就好。
// @author       LianSheng

// @include      https://kater.me/*
// @exclude      https://kater.me/api/*
// @exclude      https://kater.me/assets/*

// @grant        GM_info

// @run-at       document-start

// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js
// @downloadURL https://update.greasyfork.org/scripts/407126/%E6%88%91%E5%8F%AA%E8%A6%81%E7%9F%A5%E9%81%93%E5%9B%9E%E6%96%87%E6%88%90%E5%8A%9F%E5%B0%B1%E5%A5%BD%E4%BA%86%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/407126/%E6%88%91%E5%8F%AA%E8%A6%81%E7%9F%A5%E9%81%93%E5%9B%9E%E6%96%87%E6%88%90%E5%8A%9F%E5%B0%B1%E5%A5%BD%E4%BA%86%E3%80%82.meta.js
// ==/UserScript==

let identification = `if(! window._KT) { window._KT = {}; } window._KT["reply.only"] = "${GM_info.script.version}";`;
addScript(identification, "head");

// 訊息框，採用原生樣式 (Alert)，只是放到右上角
// 0 綠色、1 黃色、2 紅色
let expireMsg = {};
function message(msg, type = 0, time = 10) {
    let typeField = ["success", "warning", "error"];
    let randomID = Math.random().toString(36).substr(2, 6);

    let block = `<div id="us_messageBlock" data-id="${randomID}" class="AlertManager"><div class="AlertManager-alert"><div class="Alert Alert--${typeField[type]}" style="position: fixed; bottom: 2rem; right: 3rem; width: fit-content;"><span class="Alert-body">${msg}</span><span>　</span><span data-id="${randomID}" style="cursor: pointer;">X</span></div></div></div>`;

    addHTML(block, "div#us_messageArea", "beforeend");

    let element = document.querySelector(`div[data-id="${randomID}"]`);
    let close = element.querySelector(`span[data-id="${randomID}"]`);
    close.onclick = () => {
        element.remove();
        delete expireMsg[randomID];
    };

    // 不能使用 setTimeout 或 setInterval （會卡死其他部件）
    // 而此類腳本也不便於利用 worker
    // 只好在下方 main function 輪詢物件 expireMsg
    expireMsg[randomID] = Date.now() + (time * 1000);

    return randomID;
}

function complete(mid, success = true) {
    let element = document.querySelector(`div[data-id="${mid}"]`);
    element.remove();
    delete expireMsg[mid];

    // 成功就關閉編輯器
    if(success) {
        let composer = document.querySelector("div#composer");
        let min = composer.querySelector("li.item-minimize.App-backControl > button");
        let close = composer.querySelector("li.item-close > button");
        let textarea = composer.querySelector("textarea");

        textarea.value = "";
        textarea.dispatchEvent(new Event("input"));
        close.click();
    }
}

// 新增回文
async function newReply(content){
    let did = app.current.discussion.data.id;
    let posting = message(`正在發送新增貼文`, 1, 99999);

    let data = {
        "data": {
            "type":"posts",
            "attributes": {
                "content":content
            },
            "relationships": {
                "discussion": {
                    "data": {
                        "type": "discussions",
                        "id": did
                    }
                }
            }
        }
    };

    return await fetch("https://kater.me/api/posts", {
        "headers": {
            "content-type": "application/json; charset=UTF-8",
            "x-csrf-token": app.session.csrfToken
        },
        "referrer": `https://kater.me/d/${did}`,
        "body": JSON.stringify(data),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(
        r => r.json()
    ).then(j=>{
        console.log(j);
        if(j.errors){
            let code = j.errors[0].status;
            let msg = j.errors[0].detail;
            message(`(${code}) ${msg}`, 2);
        } else if(j.data) {
            let id = j.data.relationships.discussion.data.id
            let msg = `回覆成功，<a href="/d/${id}">查看</a>`;
            message(msg);
        }
    }).catch(
        e => message(e, 2, 20000)
    ).finally(
        () => complete(posting)
    );
}

// 編輯回文
async function editReply(composer, content){
    let did = app.current.discussion.data.id;
    let floor = composer.querySelector("li.item-title h3 a").innerText.match(/#(\d\d)/)[1];
    let pid = app.current.discussion.data.relationships.posts.data[floor-1].id;
    let posting = message(`正在發送編輯貼文`, 1, 99999);

    let data = {
        "data": {
            "type": "posts",
            "id": pid,
            "attributes": {
                "content": content
            }
        }
    };

    return await fetch(`https://kater.me/api/posts/${pid}`, {
        "headers": {
            "content-type": "application/json; charset=UTF-8",
            "x-csrf-token": app.session.csrfToken,
            "x-http-method-override": "PATCH"
        },
        "referrer": `https://kater.me/d/${did}`,
        "body": JSON.stringify(data),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(
        r => r.json()
    ).then(j=>{
        if(j.errors){
            let code = j.errors[0].status;
            let msg = j.errors[0].detail;
            message(`(${code}) ${msg}`, 2);
        } else if(j.data) {
            let id = j.data.relationships.discussion.data.id
            let msg = `編輯成功，<a href="/d/${id}">查看</a>`;
            message(msg);
        }
    }).catch(
        e => e
    ).finally(
        () => complete(posting)
    );
}



(function() {
    'use strict';

    setInterval(function () {
        // 編輯器主體
        let body = document.querySelectorAll("div.Composer-content div.ComposerBody");
        if (body.length > 0) {
            let composer = body[0];
            let composerAll = composer.parentNode.parentNode;
            let itemSubmit = composer.querySelector("li.item-submit.App-primaryControl");

            if(composer.querySelector("i.icon.fas.fa-reply")){
                // 新增回文
                if(itemSubmit.getAttribute("us_overwrite") === null){
                    let b = itemSubmit.querySelector("button:not([us_overwrite])")
                    b.outerHTML = b.outerHTML;

                    let button = itemSubmit.querySelector("button:not([us_overwrite])")
                    itemSubmit.setAttribute("us_overwrite", "");
                    button.classList.remove("Button--primary");

                    button.onclick = e => {
                        e.preventDefault();
                        e.stopPropagation();
                        let min = composerAll.querySelector("li.item-minimize.App-backControl > button");
                        min.click();

                        let content = composer.querySelector("textarea").value;
                        newReply(content);
                    };
                }

            } else if (composer.querySelector("i.icon.fas.fa-pencil-alt")){
                // 編輯回文
                if(itemSubmit.getAttribute("us_overwrite") === null) {
                    let b = itemSubmit.querySelector("button:not([us_overwrite])")
                    b.outerHTML = b.outerHTML;

                    let button = itemSubmit.querySelector("button:not([us_overwrite])")
                    itemSubmit.setAttribute("us_overwrite", "");
                    button.classList.remove("Button--primary");

                    button.addEventListener("click", e => {
                        e.preventDefault();
                        e.stopPropagation();
                        let min = composerAll.querySelector("li.item-minimize.App-backControl > button");
                        min.click();

                        let content = composer.querySelector("textarea").value;
                        editReply(composer, content);
                    });
                }
            }
        }

        // 訊息框區域
        if (document.querySelectorAll("div#us_messageArea").length == 0) {
            let area = `<div id="us_messageArea"></div>`;
            if (document.querySelectorAll("div#app").length != 0) {
                addHTML(area, "div#app", "beforeend");
            }
        }

        // 訊息框自動刪除（詳見 message()）
        for (let [key, value] of Object.entries(expireMsg)) {
            if (Date.now() > value) {
                document.querySelector(`div#us_messageBlock[data-id="${key}"]`).remove();
                delete expireMsg[key];
            }
        }
    }, 100);
})();