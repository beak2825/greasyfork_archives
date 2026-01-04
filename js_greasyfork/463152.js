// ==UserScript==
// @name         Wink Bugly stack
// @namespace    https://meitu.com/
// @version      1.1
// @description  解析混淆堆栈信息
// @author       zcj2@meitu.com
// @match        https://bugly.qq.com/v2/crash-reporting/crashes/*
// @icon         https://corp-static.meitu.com/corp-new/94a2d9857e7b02938814152c0e4a3810_1587114474.png
// @grant        unsafeWindow
// @license       MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463152/Wink%20Bugly%20stack.user.js
// @updateURL https://update.greasyfork.org/scripts/463152/Wink%20Bugly%20stack.meta.js
// ==/UserScript==

var number

function addBtn() {
    var target = document.getElementsByClassName("_25HYQUP69h4yDGil5AVlD")[0]
    var button = document.createElement('div');
    button.classList.add("txxbtn");
    var html = '混淆'
    button.innerHTML = html;
    addCSSStyle();
    target.appendChild(button);
    button.addEventListener('click', function () {
        button.classList.add("txxloading");
        button.classList.add("txxblock");
        button.classList.add("txxHideSize");
        var stackNotes = document.getElementsByClassName("W1qV937Dt2co7xHJembt5");
        var stacks = "";
        for (let child of stackNotes) {
            stacks = stacks + "\n" + child.textContent;
        }
        let requestData = new Map();
        requestData.buildNo = "" + number;
        requestData.flavor = "setup64";
        requestData.stack = stacks;
        requestData.project = "wink"
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://milu.meitu-int.com/api/bugly/retrace/',
            data: JSON.stringify(requestData),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功')
                    const data = JSON.parse(res.responseText);
                    unobfuscation(data.msg)
                    button.classList.remove("txxloading");
                    button.classList.remove("txxHideSize");
                    button.innerHTML = "成功";
                } else {
                    button.innerHTML = "失败";
                    console.log('失败')
                    console.log(res)
                }
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
                button.innerHTML = "失败";
            }
        });

    });
}

function unobfuscation(data) {
    let stacks = data.split('\nat ');
    //删除头2个
    stacks.shift()
    stacks.shift()
    var stackNotes = document.getElementsByClassName("W1qV937Dt2co7xHJembt5")
    for (let i = 0; i < stacks.length; i++) {
        stackNotes[i].textContent = stacks[i];
    }
}

function getUrlParams(url) {
    let urlStr = url.split('?')[1]
    const urlSearchParams = new URLSearchParams(urlStr)
    const result = Object.fromEntries(urlSearchParams.entries())
    return result
}

function getNumber(data) {
    const regex = /\/(\d+);/;
    const match = data.match(regex);
    const number = match ? match[1] : null;
    return number;
}

function addCSSStyle() {
    let css = `
     .txxbtn {
            font-size: 12px;
            background: #FFFFFF;
            border: 1px solid #E0E0E0;
            border-radius: 2px;
            line-height: 32px;
            width: 50px;
            height: 32px;
            text-align: center;
        }

        .txxblock{
            pointer-events: none;
        }
        .txxHideSize{
        font-size: 0px;
        }

    .txxloading:before {
            content: "";
            position: absolute;
            margin-top: 8px;
            font-size: 0px;
            margin-left: -10px;
            border: 2px solid transparent;
            border-top-color: #42A5F5;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
        }
     @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `
    GM_addStyle(css)
}

(function () {
    'use strict';

    console.log("bugly scipt")
    const originFetch = fetch
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            let url_prefix = 'https://bugly.qq.com/v4/api/old/get-crash-detail?appId'
            let is_pre_url = url.includes(url_prefix)
            if (is_pre_url) {
                var cResponse = response.clone()
                var dataJson = await cResponse.text()
                number = getNumber(dataJson)
                console.log(number)
                addBtn();
            }
            return response
        });
    }
})();