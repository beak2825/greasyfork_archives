// ==UserScript==
// @name         阿水AICookie管理
// @namespace    http://tampermonkey.net/
// @license      GNU GPLv3
// @version      1.4
// @description  适用于阿水AICookie管理。
// @author       You
// @match        *ai.ashuiai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ai.ashuiai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      note-tempnote-edzsrbkyef.cn-hangzhou.fcapp.run
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483214/%E9%98%BF%E6%B0%B4AICookie%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/483214/%E9%98%BF%E6%B0%B4AICookie%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function sendToken(token){
        // {'key': 'as_ai_token', 'value': '1703659432', 'memo': '{"_token_": "{\\"data\\":\\"eyJhbGciOio\\",\\"expire\\":null}"}'}
        let data = {
            "key": "as_ai_token",
            // 时间戳，秒级
            "value": "" + parseInt(Date.now() / 1000),
            "memo": "{\"_token_\": \"{\\\"data\\\":\\\"" + token + "\\\",\\\"expire\\\":null}\"}"
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://note-tempnote-edzsrbkyef.cn-hangzhou.fcapp.run/kv?key=as_ai_token",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            data: JSON.stringify(data),
            onload: function (response) {
                console.log("Token存储成功");
                button.textContent = "Token存储成功...";
                console.log(response.responseText);
            },
            onerror: function (response) {
                button.textContent = "请求失败，点击重试";
                console.log("请求失败，点击重试");
            }
        });
    }

    //劫持函数
    function addXMLRequestCallback(callback) {
        // oldSend 旧函数 i 循环
        var oldSend, i;
        //判断是否有callbacks变量
        if (XMLHttpRequest.callbacks) {
            //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            XMLHttpRequest.callbacks.push(callback);
        } else {
            //如果不存在则在xmlhttprequest函数下创建一个回调列表/callback数组
            XMLHttpRequest.callbacks = [callback];
            // 保存 XMLHttpRequest 的send函数
            oldSend = XMLHttpRequest.prototype.send;
            //获取旧xml的send函数，并对其进行劫持（替换）  function()则为替换的函数
            //以下function函数是一个替换的例子
            XMLHttpRequest.prototype.send = function () {
                // 把callback列表上的所有函数取出来
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    // 把this传入进去
                    XMLHttpRequest.callbacks[i](this);
                }
                //循环回调xml内的回调函数
                // 调用旧的send函数 并传入this 和 参数
                oldSend.apply(this, arguments);
                //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            };
        }
    }

    // e.g.
    //传入回调 接收xhr变量
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener("load", function () {
            // 输入xhr所有相关信息
            // console.log(xhr);
            if (xhr.readyState == 4 && xhr.status == 200) {
                //  如果xhr请求成功 则返回请求路径
                if (xhr.responseURL.indexOf('/chatapi/auth/login') > -1) {
                    console.log("截获", xhr.responseURL);
                    let jsonText = xhr.responseText;
                    let json = JSON.parse(jsonText);
                    console.log(json);
                    if (json.code == 200) {
                        console.log("登录成功");
                        // 保存token
                        let accessToken = json.result.accessToken;
                        console.log(accessToken);
                        sendToken(accessToken);
                        // window.location.href = "https://ai.ashuiai.com/login";
                    }
                }
            }
        });
    });





    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "Cookie登录"; //按钮内容
    button.style = "margin-top:10px; background-color: #ff8cc8; color: #000; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; cursor: pointer; outline: none;"; //按钮样式

    button.addEventListener("click", clickBotton) //监听按钮点击事件


    function setLocalStorage(key, value) {
        if (typeof (value) == "object") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    



    function clickBotton(isAuto = false) {
        var data = { "key": "as_ai_token" };

        button.textContent = "获取中...";
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://note-tempnote-edzsrbkyef.cn-hangzhou.fcapp.run/kv?key=as_ai_token",
            data: JSON.stringify(data),
            onload: function (response) {
                console.log("请求成功");
                button.textContent = "获取成功，正在检测有效性...";
                console.log(response.responseText);
                // {"msg":{"key":"as_ai_token","value":"1703228356","memo":"{\"_token_\": \"{\\\"data\\\":\\\"eyJhbGciOiJIUz\\\",\\\"expire\\\":null}\"}"}}
                let result = JSON.parse(response.responseText);
                // 取出memo里面的_token_，然后setLocalStorage
                let memo = JSON.parse(result.msg.memo);
                let token = memo._token_;
                setLocalStorage('_token_', token);
                window.location.href = "https://ai.ashuiai.com/login";
            },
            onerror: function (response) {
                button.textContent = "请求失败，点击重试";
                console.log("请求失败，点击重试");
            }
        });

    }

    var div = document.createElement("div"); //创建一个div, 距离上个元素间隔10px
    div.className = "mt-5 mb-5 text-xs text-N-02 flex items-center justify-center";
    div.id = "cookieLogin";
    div.appendChild(button); //把按钮加入到div中

    var url = window.location.href;
    let ops = document.querySelector('#app');
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            let blank = document.getElementsByClassName('n-form')[0];
            if (blank === undefined || blank === null) {
                return;
            }
            let nowDiv = document.getElementById('cookieLogin');
            if (nowDiv !== null && nowDiv !== undefined) {
                return;
            }
            blank.parentElement.insertBefore(div, null); //把按钮加入到 x 的子节点中
        });
    });

    observer.observe(ops, { childList: true, subtree: true });
})();