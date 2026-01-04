// ==UserScript==
// @name         1688详情页获取电话号
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  孙胖专用哦   1688详情页获取电话号
// @author       wangyang
// @license      MIT
// @match        https://detail.1688.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503725/1688%E8%AF%A6%E6%83%85%E9%A1%B5%E8%8E%B7%E5%8F%96%E7%94%B5%E8%AF%9D%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/503725/1688%E8%AF%A6%E6%83%85%E9%A1%B5%E8%8E%B7%E5%8F%96%E7%94%B5%E8%AF%9D%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let num = 0
    let button = document.createElement('button');
    let Message = document.createElement('div')
    button.textContent = '获取电话号';
    Message.innerText = ''

    // 设置按钮样式
    button.style.backgroundColor = '#0958d9';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 20px';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.cursor = 'pointer'
    button.style.zIndex = '1000'; // 确保按钮在其他内容之上
    button.addEventListener('click', () => {
        num+=1
        searchFn()
    })

    //设置提示信息样式
    Message.style.zIndex = '9999999999999999999999';
    Message.style.position = 'fixed';
    Message.style.bottom = '100px';
    Message.style.right = '10px';
    Message.style.fontSize = '18px';
    Message.style.fontWeight = '600';
    // 将按钮添加到页面中
    document.body.appendChild(button);
    document.body.appendChild(Message)




    let timer = setInterval(()=>{
        searchFn()
        num+=1
        if(num>10){
            clearInterval(timer)
            timer = null
        }
    }, 1000)
    function getQueryString() {
        const url = window.location.href;
        const queryStart = url.indexOf('?');
        const queryString = queryStart !== -1 ? url.substring(queryStart + 1) : '';
        const params = {};
        if (queryString) {
            const pairs = queryString.split('&');
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
        }
        return params;
    }
    function tongzhi(content) {
        Message.innerText = content
        Message.style.display = 'block';
    }

    function searchFn() {
        let hrefObj = getQueryString()
        const url = `https://dj.1688.com/clue/queryCustPhone?clickid=${hrefObj.clickid}&pageUrl=https:%2F%2Fdetail.1688.com&a=${hrefObj.a}&e=${hrefObj.e}&style=${hrefObj.style}`
        fetch(url, {
            method: 'GET'
        }).then(response => {
            if (!response.ok) {
            }
            return response.json();
        })
        .then(data => {
            copyToClipboard(data.data.secretNumber || data.data.mobileNumber || data.data.phoneArea + '-' + data.data.phoneNumber, `加密电话：${data.data.secretNumber || '无'}，移动电话：${data.data.mobileNumber || '无'}，固定电话：${data.data.phoneNumber? data.data.phoneArea + '-' + data.data.phoneNumber :  '无'}`)
        })
        .catch(error => {
        });
    }
    function copyToClipboard(text, info) {
        if(text){
            navigator.clipboard.writeText(text).then(() => {
                tongzhi(`第一个可用电话已复制， 全部电话======>${info}`)
            }).catch(err => {
                tongzhi('复制失败')
            });
            clearInterval(timer)
            timer = null
        }else {
            tongzhi(`他可能没有电话号我获取了${num}次了`)
        }
    }
})();