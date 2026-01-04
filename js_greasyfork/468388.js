// ==UserScript==
// @name         青年大学习工具
// @namespace    http://tampermonkey.net/
// @version      1.002
// @description  自动开始播放视频，将进度拉到最后，下载结果图片，自动获取青年大学习所有课程。谷歌浏览器需要开启网站的声音权限后才能正常使用
// @author       WeiZexin  email:weizexin1220@qq.com
// @match        https://h5.cyol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theb.ai
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468388/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/468388/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var iframe = document.getElementsByTagName("iframe")[0];
    iframe.contentWindow.onload = function(){
        console.log("iframe加载");
        setTimeout(()=>{
            const start_btn = iframe.contentWindow.document.getElementsByClassName('start_btn')[0];
            const click = start_btn.click;
            //开始播放
            start_btn.click();
            console.log("开始播放");
            setTimeout(()=>{
                screenshot();
            },4000);
        },6000);
    }
    //拉进度、截图
    function screenshot(){
        console.log("拉进度、下载图片");
        // 创建一个canvas元素和2D上下文对象
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        var videos = iframe.contentWindow.document.getElementsByTagName("video");
        videos[0].setAttribute("controls","true");
        videos[0].currentTime = videos[0].duration;
        // 设置canvas的大小与视频尺寸相同
        canvas.width = videos[0].videoWidth;
        canvas.height = videos[0].videoHeight;
        // 获取需要截图的 div 元素
        let url = window.location.href.replace("index.html","images/end.jpg");
        const img = new Image();
        img.src = url;
        img.onload = ()=>{
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 将canvas转换为图像并保存为PNG文件
            const dataURL = canvas.toDataURL('image/png');
            //拷贝图片到剪切板
            canvas.toBlob(function(blob) {
                const file = new File([blob], "image.png", {type: "image/png"});
                navigator.clipboard.write([new window.ClipboardItem({'image/png': file})])
                    .then(() => console.log('Image copied to clipboard.'))
                    .catch(err => console.error('Error copying image:', err));
            }, 'image/png');

            //下载图片
            //const link = document.createElement('a');
            //link.download = 'screenshot.png';
            //link.href = dataURL;
            //link.click();
        }
    }
    const host = 'https://youthstudy.12355.net';
    function ajaxRequest(url, method, data, successCallback, errorCallback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, host+url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    successCallback(xhr.response);
                } else {
                    errorCallback(xhr.statusText);
                }
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Litemall-IdentiFication', 'young');
        xhr.send(JSON.stringify(data));
    }
    //获取季列表
    //const body = document.getElementsByTagName("body")[0];
    const parent = document.getElementsByClassName('rightTop')[0];
    const content = document.createElement("div");
    content.setAttribute('style',`
        display:flex;
        max-height:433px;
        overflow:scroll;
        justify-content: space-around;
        color:#000;
        margin:5px 0px;
        padding:5px 0px;
    `)
    parent.appendChild(content);
    function getSeasonList(){
        ajaxRequest('/saomah5/api/young/course/list','get',null,res=>{
            res = JSON.parse(res);
            //渲染到页面
            const seasonlist = document.createElement("div");
            let last;
            for(let i of res.data.list){
                let item = document.createElement("div");
                item.setAttribute('pid',i.id);
                item.setAttribute('style',`padding:5px;border-bottom:1px solid #000;`);
                item.innerHTML = `
                    <div>第${i.code}季</div>
                    <div>${i.title}</div>
                `;
                item.addEventListener('click', function(event) {
                    getIssueList(event.currentTarget.getAttribute('pid'),event.currentTarget);
                });
                seasonlist.appendChild(item);
                last = item;
            }
            last.setAttribute('style',`padding:5px;border-bottom:0px solid #000;`);
            content.appendChild(seasonlist);
        },err=>{
            console.log(JSON.parse(err));
        });

    }

    getSeasonList();

    //获取期列表
    function getIssueList(pid,target){
        ajaxRequest(`/saomah5/api/young/course/chapter/list?pid=${pid}`,'get',null,res=>{
            res = JSON.parse(res);
            const issuelist = document.createElement("div");
            let last;
            for(let i of res.data.list){
                let item = document.createElement("div");
                item.setAttribute('url',i.url);
                item.setAttribute('style',`padding:5px;border-bottom:1px solid #000;`);
                item.innerHTML = `
                    <div>第${i.code}期</div>
                    <div>${i.name}</div>
                `;
                item.addEventListener('click', function(event) {
                    getVideo(event.currentTarget.getAttribute('url'));
                });
                issuelist.appendChild(item);
                last = item;
            }
            last.setAttribute('style',`padding:5px;border-bottom:0px solid #000;`);
            content.appendChild(issuelist);
        },err=>{
            console.log(JSON.parse(err));
        });
    }
    //跳转页面
    function getVideo(url){
        window.open(url, '_blank');
    }
})();