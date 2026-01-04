// ==UserScript==
// @name         Acfun_更多的直播跳转
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  更好地单推
// @author       幽想
// @match        https://www.acfun.cn/
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @match        https://www.acfun.cn/member/*
// @match        https://live.acfun.cn/*
// @match        https://member.acfun.cn/*
// @icon         https://www.google.com/s2/favicons?domain=acfun.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429722/Acfun_%E6%9B%B4%E5%A4%9A%E7%9A%84%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429722/Acfun_%E6%9B%B4%E5%A4%9A%E7%9A%84%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function xhrAsync(method,url) {//发出请求
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                onload: resolve
            });
        });
    }
    async function gm_xhr(method,url) {
        return xhrAsync(method,url).then(response => {//返回xhr请求结果
            if (!response.responseText) {
                return null;
            } else {//正常获得返回数据
                return response;
            }
        });
    }
    function addCSS () {//添加CSS
        let nod = document.createElement("style");
        nod.textContent = `
        .liveMainFrame_0a75{
            visibility: visible;-webkit-font-smoothing: antialiased;list-style: none;text-align: left;display: flex;height: auto;max-height: 300px;vertical-align: baseline;font: inherit;color: #333;font-size: 100%;padding: 0;border: 0;flex-wrap:wrap;
        }
        .avatar_wrapper_0a75{
            border: 2px solid #fd4c5d;
            border-radius: 50%;
            padding: 1px;
            width: 34px;
            height: 34px;
            margin: 0 11px;
            position: relative;
            box-sizing: border-box;
        }
        .avatar_wrapper_more_0a75 {
            border-radius: 50%;
            border: 0;
            background-color: #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1px;
            width: 34px;
            height: 34px;
            margin: 0 11px;
            position: relative;
            box-sizing: border-box;
        }
        .avatar_wrapper_more_0a75:hover {
            background-color: #ccc;
        }
        .avatar_wrapper_0a75 img{
            width: 28px;
            height: 28px;
            border-radius: 50%;
        }
        .livefollowitem_0a75{
            margin-left: 10px;
            margin-top: 10px;
            text-decoration: none;
            outline: none;
            width: 56px;
            height: 50px;
            font-size: 12px;
        }
        .liveupName_0a75{
            word-break: break-all;
            white-space: nowrap;
            margin: 2px auto 0;
            width: 48px;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 12px;
            text-align: center;
            color: #666;
        }
        .live_status_0a75 {
            background: #fd4c5c;
            border-radius: 3px;
            width: 11px;
            height: 9px;
            right: -2px;
            bottom: -2px;
            position: absolute;
        }
        .live_status_0a75 img{
            font: inherit;
            font-size: 100%;
            vertical-align: top;
            border-radius: 50%;
            width: 7px;
            height: 7px;
            position: absolute;
            left: 2px;
            top: 1px;
        }
        .ml5_0a75{
            margin-left:5px;
        }
        .ml0_0a75{
            margin-left:0px;
        }
        .firstRow_live_0a75{
            margin-top:0px;
        }
        @keyframes rolling {
            100% {transform: rotate(360deg)}
        }
        .livefollowitem_0a75.last{
            cursor:pointer
        }
        .livefollowitem_0a75.last div img{
            animation:2s linear 0s infinite normal none paused rolling
        }
        .livefollowitem_0a75.last:hover div img{
            animation:2s linear 0s infinite normal none running rolling
        }
        `
        document.head.appendChild(nod);
    }
    addCSS();
    async function getLiveList () {
        let newj = {};
        let pcursor = 0;
        let totalCount = 0;
        do {
            let res = await gm_xhr('GET', `https://live.acfun.cn/api/channel/list?count=100&pcursor=${pcursor}&filters=[%7B%22filterType%22:3,+%22filterId%22:0%7D]`);
            res = res.responseText;
            try {
                var j = JSON.parse(res);
            }
            catch (e) {
                return { 'error': e };
            };
            j.liveList.forEach(
                function (now, index) {
                    let c = index + (100*pcursor);
                    newj[c] = {};
                    newj[c].uid = now.authorId;
                    newj[c].name = now.user.name;
                    newj[c].imgUrl = now.user.headUrl;
                }
            );
            totalCount = j.totalCount;
            pcursor++;
        }
        while(100*pcursor < totalCount);
        newj.length = totalCount;
        return newj;
    }
    function init() {//初始化面板
        var mDiv;
        if (!!document.querySelector("li.guide-item.guide-feed > div.guide-item-con")) {
            mDiv = document.querySelector("li.guide-item.guide-feed > div.guide-item-con").childNodes[0];
        }
        if (!!document.querySelector("div.favourite-lives")){
            mDiv = document.querySelector("div.favourite-lives");
        }
        mDiv.style.height = 'auto';
        mDiv.style.minHeight = '80px';
        mDiv.style.maxHeight = '320px';
        mDiv.style.cursor = 'initial';
        mDiv.style.overflowY = 'auto';
        mDiv.innerHTML = '<div class="liveMainFrame_0a75">列表获取中…请稍等</div>';
        return;
    };
    async function getReady () {
        let list = await getLiveList();
        if (!!list.error) {
            console.log(`ACFUN_更多的直播跳转：获取出错，错误：${list.error}`);
            return;
        }
        let smaller = false;
        if (list.length > 24) {//超过范围，需要添加竖向滚轴，减少左边距
            smaller = true;
        }
        delete list.length;//删除长度不需要添加进去
        for (let k in list) {
            createNewOnLiveUp(list[k].uid, list[k].name, list[k].imgUrl, smaller);
        }
        createNewOnLiveUp(undefined, undefined, undefined, smaller, true);
    }
    function createNewOnLiveUp(uid, name, imgUrl, smaller, last) {//创建新的
        let frame = document.querySelector("div.liveMainFrame_0a75");
        if (frame.textContent === '列表获取中…请稍等') {
            frame.innerHTML = '';
        }
        let box = document.createElement('a');
        frame.appendChild(box);
        var first = '';
        if (smaller) {
            first += ' ml5_0a75';
        }
        if ((frame.childElementCount - 1) % 5 === 0) {//每行首个
            first += ' ml0_0a75';
        }
        if (frame.childElementCount < 6) {//首行样式
            first += ' firstRow_live_0a75';
        }
        if (last) {
            box.outerHTML = `
        <div class="livefollowitem_0a75 last${first}">
            <div class="avatar_wrapper_0a75" style="border: initial;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktYXJyb3ctcmVwZWF0IiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0xMS41MzQgN2gzLjkzMmEuMjUuMjUgMCAwIDEgLjE5Mi40MWwtMS45NjYgMi4zNmEuMjUuMjUgMCAwIDEtLjM4NCAwbC0xLjk2Ni0yLjM2YS4yNS4yNSAwIDAgMSAuMTkyLS40MXptLTExIDJoMy45MzJhLjI1LjI1IDAgMCAwIC4xOTItLjQxTDIuNjkyIDYuMjNhLjI1LjI1IDAgMCAwLS4zODQgMEwuMzQyIDguNTlBLjI1LjI1IDAgMCAwIC41MzQgOXoiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDNjLTEuNTUyIDAtMi45NC43MDctMy44NTcgMS44MThhLjUuNSAwIDEgMS0uNzcxLS42MzZBNi4wMDIgNi4wMDIgMCAwIDEgMTMuOTE3IDdIMTIuOUE1LjAwMiA1LjAwMiAwIDAgMCA4IDN6TTMuMSA5YTUuMDAyIDUuMDAyIDAgMCAwIDguNzU3IDIuMTgyLjUuNSAwIDEgMSAuNzcxLjYzNkE2LjAwMiA2LjAwMiAwIDAgMSAyLjA4MyA5SDMuMXoiLz48L3N2Zz4=">
            </div>
            <p class="liveupName_0a75">重载列表</p>
        </a>
        `;
            document.querySelector("div.livefollowitem_0a75.last").onclick = async function () {
                console.log('ACFUN_更多的直播跳转：开始初始化');
                init();
                console.log('ACFUN_更多的直播跳转：开始获取直播列表');
                await getReady();
                console.log('ACFUN_更多的直播跳转：全部处理完毕，程序结束');
            };
            return;
        }
        box.outerHTML = `
        <a class="livefollowitem_0a75${first}" href="//live.acfun.cn/live/${uid}" target="_blank">
            <div class="avatar_wrapper_0a75">
                <img src="${imgUrl}" onerror="this.src=https://imgs.aixifan.com/style/image/defaultAvatar.jpg?imageslim" loading="lazy">
                <div class="live_status_0a75"><img src="//ali-imgs.acfun.cn/kos/nlav10360/static/common/widget/header/img/liveing.899b242a0dba5a964575.gif" loading="lazy"></div>
            </div>
            <p class="liveupName_0a75">${name}</p>
        </a>
        `;
    }
    var timer2 = setInterval(//等待框架加载完毕后初始化
        async function(){
            var showliveDiv;
            let url = document.URL;
            if (url.indexOf('acfun.cn/v/list') != -1 || url.indexOf('acfun.cn/member/') != -1 ) {//二级页面|动态|创作中心
                showliveDiv = document.querySelector("div.user-favourite-dropdown");
            } else {
                if (url.indexOf('member.acfun.cn') != -1) {//210725修正
                    showliveDiv = document.querySelector("li.guide-item.guide-icon-item.guide-feed > div > div.ivu-select-dropdown > ul > li.ivu-dropdown-item");
                } else {
                    showliveDiv = document.querySelector("li.guide-item.guide-feed > div.guide-item-con");
                }
            }
            if (!!showliveDiv) {//存在
                clearInterval(timer2);
                if (showliveDiv.children[0].className != 'favourite-lives' && showliveDiv.children[0].className != 'favourite-list' && showliveDiv.children[0].className != 'followed-users') {//无关注的up在直播，不需要添加
                    console.log('ACFUN_更多的直播跳转：无关注的up在直播，程序结束');
                    return;
                }
                let checkLiveDiv = '';
                if (showliveDiv.children[0].className === 'favourite-lives') {//二级页面|动态|创作中心
                    checkLiveDiv = showliveDiv.children[0];
                }
                if (showliveDiv.children[0].className === 'followed-users') {//样式2
                    checkLiveDiv = showliveDiv.children[0].children[0];
                }
                if (checkLiveDiv.childElementCount < 5) {//小于5人则不需要请求
                    console.log('ACFUN_更多的直播跳转：直播UP小于5人，不需要处理，程序结束');
                    return;
                }
                console.log('ACFUN_更多的直播跳转：开始初始化');
                init();
                console.log('ACFUN_更多的直播跳转：开始获取直播列表');
                await getReady();
                console.log('ACFUN_更多的直播跳转：全部处理完毕，程序结束');
            }
        }
    ,1000)
})();