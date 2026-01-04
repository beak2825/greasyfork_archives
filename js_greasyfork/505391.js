// ==UserScript==
// @name         meego_script
// @namespace    http://tampermonkey.net/
// @version      2024-08-26
// @description  try to take over the meego!
// @author       You
// @match        https://meego.larkoffice.com/aweme/storyView/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505391/meego_script.user.js
// @updateURL https://update.greasyfork.org/scripts/505391/meego_script.meta.js
// ==/UserScript==



(function() {
    'use strict';

    setTimeout(()=>{
        const href = window.location.href;
        if (href.indexOf('meego.larkoffice.com/aweme/storyView') !== -1) {
            addButton();
            getMeegoToken();
        }

    }, 5000)

})();

const IS_DEBUG = false;
const WEB_HOST = IS_DEBUG ? 'http://127.0.0.1:3001/api' : 'https://uni-stack.cn.goofy.app/api'

function addButton() {
    const element = document.createElement('div');
    element.id = "add_lark_button"
    element.innerHTML = "发送至飞书群"
    element.style.color = 'white'
    element.style.fontWeight = 'bold'
    element.style.width = '110px'
    element.style.height = '32px'
    element.style.position = 'fixed'
    element.style.float = 'left'
    element.style.zIndex = '999'
    element.style.left = '50%'
    element.style.top = '6px'
    element.style.cursor = 'pointer'
    element.style.padding = '6px 12px'
    element.style.backgroundColor = '#3452EB'
    element.style.borderRadius = '6px'
    element.onclick = function() {
        sendMsgToChat()
    }
    let root = document.getElementById("root");
    root.appendChild(element);
}

async function sendMsgToChat() {
    const rowData = await getViewList();
    const data = {
        ...rowData.row_column_key,
        view_id: getViewId(),
    }

    const url = `${WEB_HOST}/extension/send/storyview`;
    const param = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        method: 'post',
    }

    let larkButton = document.getElementById("add_lark_button");
    larkButton.innerHTML = "发送至飞书群...loading..."
    larkButton.style.width = '200px'
    fetch(url, param).then(data => {
        larkButton.innerHTML = "发送至飞书群"
        larkButton.style.width = '110px'
        return data.json()
    })
}

function getTokenInfo() {
    const rawcookie = document.cookie;
    const cookieValues = rawcookie.split(";");
    var csrftokenTarget = '';
    var meegoUserKey = '';
    for (const cookie of cookieValues) {
        const cookiemap = cookie.replace(" ","").split("=");
        if (cookiemap[0] === '_csrf_token') {
            csrftokenTarget = cookiemap[1];
        }
        if (cookiemap[0] === 'meego_user_key') {
            meegoUserKey = cookiemap[1];
        }
    }

    return {
        rawcookie,
        csrftokenTarget,
        meegoUserKey,
    }
}

function getViewId() {
    const href = window.location.href;
    const ids = href.split('/');
    const idstring = ids.pop();
    const idlist = idstring.split('?');
    return idlist[0];
}

async function getViewList() {
    const tokenInfo = getTokenInfo();
    const id = getViewId();

    const data = await fetch("https://meego.larkoffice.com/goapi/v5/search/general/get_hsr", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "locale": "zh",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-content-language": "zh",
            "x-lark-gw": "1",
            "x-meego-csrf-token": "XlagTPMO-NgUy-Ixpx-ObQv-Zw0xKsv9z1Ih",
            "x-meego-from": "web",
            "x-meego-gw-path": "/goapi/v5/search/general/get_hsr",
            "x-meego-request-id": "cc4620cd-85a5-4047-ae17-0f81a3734ff2",
            "x-meego-scope": "storyView",
            "x-meego-source": "web/release_train_hotfix_409099-3.2.5.7689",
            "x-meego-timezone": "28800/28800",
            "x-meego-use-quic": "1",
            "cookie": tokenInfo.rawcookie,
            "Referer": "https://meego.larkoffice.com/aweme/storyView/ya1bmqf4g",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-CSRFToken": tokenInfo.csrftokenTarget,
        },
        "body": `{\"scene\":0,\"private_key\":\"/aweme/storyView/${id}\",\"public_key\":\"/aweme/story\",\"public_auth\":{\"project_simple_name\":\"aweme\",\"work_item_type_name\":\"story\"}}`,
        "method": "POST"
    }).then(data=>{
        return data.json()
    }).then(data => {
        return data;
    });
    return JSON.parse(data.data.data);
}

async function getMeegoToken() {
    const tokenInfo = getTokenInfo();
    const url = `${WEB_HOST}/extension/meego/token`;
    const data = {
        cookie: tokenInfo.rawcookie,
        user: tokenInfo.meegoUserKey,
        csrftoken: tokenInfo.csrftokenTarget,
    }
    const param = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        method: 'post',
    }
    fetch(url, param).then(data => {
        return data.json()
    })
}





