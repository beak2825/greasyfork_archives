// ==UserScript==
// @name         小田扒图助手
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  私宅 help 私宅
// @author       Haze
// @match        https://item.jd.com/*
// @match        https://www.fotile.com/*
// @match        https://fotileshop.efotile.com/*
// @match        https://product.suning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492632/%E5%B0%8F%E7%94%B0%E6%89%92%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492632/%E5%B0%8F%E7%94%B0%E6%89%92%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    const taskTemp = [];
    let messageBox = null;
    let itemId = 0;
    function createElement() {
        let div = document.createElement('div');
        //div.innerHTML = '<div style="width: 500px;height: 100px;background: rgba(0, 0, 0, 0.7);position: fixed;left: 35%;top: 35%;">我在这里啊啊啊啊</div>';
        div.style.position = 'fixed';
        div.style.left = '35%';
        div.style.width = '650px';
        div.style.minHeight = '100px';
        div.style.background = 'rgba(0, 0, 0, 0.5)';
        div.style.textAlign = 'center';
        div.style.lineHeight = '100px';
        div.style.color = 'white';
        div.style.fontSize = '24px'
        div.style.top = '35%';
        div.style.zIndex = '999'
        document.body.append(div);
        messageBox = div;
        showMessage('小田助手正在初始化...😊');
    }
    function createSearchBox() {
        messageBox.innerHTML = '';
        let tipDiv = document.createElement("div");
        let btnInput = document.createElement("button");
        let textInput = document.createElement("input");
        tipDiv.innerText = '⚠️请滚动页面到底部让全部图片加载出来(滚动速度使网络情况决定)';
        tipDiv.style.height = '30px';
        tipDiv.style.fontSize = '16px';
        btnInput.innerText = '运行';
        textInput.setAttribute("type", "input");
        btnInput.style.marginLeft = '15px';
        textInput.placeholder = '输入名称查询盛君数据库';
        messageBox.append(tipDiv);
        messageBox.append(textInput);
        messageBox.append(btnInput);
        btnInput.addEventListener('click', function () {
            const elements = document.querySelectorAll('.sj-item-div');  // 替换 className 为要删除元素的 class 名称
            elements.forEach(element => element.remove());
            doSearch(textInput.value);
        });
    }
    async function doSearch(text) {
        await fetch(`https://sjonline.gxyunyun.com/apis/app/open/sku?page=1&sort=desc&size=100&keyword=${text}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.rs) {
                    let list = data.pagedata.data;
                    createSearchItems(list);
                }
            })
            .catch(error => console.error(error));
    }
    function createSearchItems(list) {
        let sjItemDiv = document.createElement("div");
        sjItemDiv.className = 'sj-item-div';
        sjItemDiv.innerHTML = '<p style="font-size: 12px;height: 30px;">选择一个匹配的商品开始偷图</p>';
        sjItemDiv.style.lineHeight = '0px';
        if (list.length == 0) {
            sjItemDiv.innerHTML = '<p style="height: 60px;">没有找到相关商品，换个关键词再试试吧~</p>';
        }
        list.forEach(item => {
            let btnItem = document.createElement("button");
            btnItem.innerText = item.name + ' (' + item.typename + ')';
            btnItem.style.height = '30px';
            btnItem.style.display = 'inline-block';
            btnItem.style.margin = '10px 10px';
            btnItem.addEventListener('click', function () {
                itemId = item.id;
                runParse();
            });
            sjItemDiv.append(btnItem);
        })
        messageBox.append(sjItemDiv);
    }
    function showMessage(text) {
        messageBox.innerHTML = '<span>' + text + '</span>';
    }
    const pushToTemp = (url, type) => {
        if (url == null || url == undefined || url.length <= 11) {
            return;
        }
        taskTemp.push({
            origin: url,
            state: 0,
            blobData: null,
            result: null,
            type,
        })
    }
    //这里执行解析网站
    const runParse = () => {
        taskTemp.splice(0);
        const host = window.location.host;
        if (host.indexOf('fotile.com') > -1) {
            parseFTImageList();
        }
        if (host.indexOf('jd.com') > -1) {
            parseJDImageList();
        }
        if (host.indexOf('product.suning.com') > -1) {
            parseSNImageList();
        }
    }
    //扒方太的
    const parseFTImageList = () => {
        //这里扒预览图
        var detailContent = document.getElementsByClassName("swiper-wrapper")[0];
        var imgTags = detailContent.getElementsByTagName("img");
        for (var i = 0; i < imgTags.length; i++) {
            const src = imgTags[i].getAttribute("src");
            pushToTemp(src, 1);
        }
        //这里扒详情图
        detailContent = document.getElementsByClassName("longImg")[0];
        imgTags = detailContent.getElementsByTagName("img");
        for (var i = 0; i < imgTags.length; i++) {
            const src = imgTags[i].getAttribute("src");
            pushToTemp(src, 2);
        }
        runDownloadTaskUseServer();
    }
    const parseJDImageList = () => {
        //这里扒预览图
        var detailContent = document.getElementById("spec-list");
        var imgTags = detailContent.getElementsByTagName("img");
        for (let i = 0; i < imgTags.length; i++) {
            let src = imgTags[i].getAttribute("src");
            src = 'https:' + src.replace('n5', 'n1')
                .replace('50x66', '350x467')
                .replace('54x54', '450x450');
            pushToTemp(src, 1);
        }
        //这里扒详情图
        detailContent = document.getElementById("J-detail-content");
        imgTags = detailContent.getElementsByTagName("img");
        if (imgTags.length == 0) {
            const childDiv = detailContent.getElementsByClassName("ssd-module-wrap")[0];
            const allElements = childDiv.getElementsByTagName("div");
            for (const element of allElements) {
                const backgroundImage = getComputedStyle(element).backgroundImage;
                if (backgroundImage && backgroundImage !== "none") {
                    const bgImgUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, "$1");
                    pushToTemp(bgImgUrl, 2);
                }
            }
        } else {
            for (let i = 0; i < imgTags.length; i++) {
                const src = imgTags[i].getAttribute("src");
                pushToTemp(src, 2);
            }
        }
        runDownloadTask();
    }
    //扒苏宁的
    const parseSNImageList = () => {
        //这里扒预览图
        var detailContent = document.getElementById("imgZoom");
        var imgTags = detailContent.getElementsByTagName("img");
        for (var i = 0; i < imgTags.length; i++) {
            const src = "https:" + imgTags[i].getAttribute("src-large");
            pushToTemp(src, 1);
        }
        //这里扒详情图
        detailContent = document.getElementById("productDetail");
        imgTags = detailContent.getElementsByTagName("img");
        for (var i = 0; i < imgTags.length; i++) {
            const src = imgTags[i].getAttribute("src");
            pushToTemp(src, 2);
        }
        runDownloadTaskUseServer();
    }
    // 下载图片
    async function runDownloadTaskUseServer() {
        let text = "小助手努力干活中😋[搬运图片" + taskTemp.length + "张]";
        let count = 0;
        const cor = setInterval(() => {
            if (count >= 8) {
                text = "小助手努力干活中😋[搬运图片" + taskTemp.length + "张]";
                count = 0;
            }
            text += "."
            showMessage(text)
            count++;
        }, 100);
        await fetch('https://sjonline.gxyunyun.com/apis/app/open/common/save-sku-props-v2',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    list: taskTemp.map(x => {
                        return {
                            value: x.origin,
                            type: x.type,
                            goodsid: itemId,
                        }
                    })
                })
            })
            .then(response => response.json())
            .then(data => {
                clearInterval(cor);
                console.log(data);
                if (data.rs) {
                    showMessage('图片搬完啦🤗');
                } else {
                    showMessage('😖失败惹，原因如下：' + data.message);
                }
            })
            .catch(error => console.error(error));
    }
    // 下载图片
    async function runDownloadTask() {
        const index = taskTemp.findIndex(x => x.blobData == null);
        const taskItem = index < taskTemp.length ? taskTemp[index] : null;
        showMessage('正在偷图片：' + (index + 1) + ' / ' + taskTemp.length + '😠');
        if (taskItem == null) {
            console.log("runUploadTask...");
            runUploadTask();
            return;
        }
        try {
            const imgBlob = await fetch(taskItem.origin).then(response => response.blob());
            taskItem.state = 1;
            taskItem.blobData = imgBlob;
            console.log("download img: " + taskItem.origin + ' success!');
        } catch (e) {
            showMessage('👉第' + (index + 1) + '张没偷到，正准备再偷，偷多次失败后就刷新页面，滑到页面底部后再偷');
            console.log("download img error: " + e);
        }
        setTimeout(() => {
            runDownloadTask();
        }, 500);
    }
    async function runUploadTask() {
        const index = taskTemp.findIndex(x => x.result == null);
        const item = index < taskTemp.length ? taskTemp[index] : null;
        showMessage('已藏好图片：' + (index + 1) + ' / ' + taskTemp.length + '😋');
        if (item == null) {
            console.log("runSaveTask...");
            runSaveTask();
            return;
        }
        let fileName = `goods-${itemId}-${item.type}-${index}`;
        const formData = new FormData(); // 创建FormData对象
        formData.append('file', item.blobData); // 将文件添加到FormData对象中
        await fetch(`https://sjonline.gxyunyun.com/apis/app/medias/upload/${fileName}`, {
            method: 'POST',
            body: formData,
            mode: 'cors', // 显式指定跨源模式
            credentials: 'same-origin' // 如果需要，可以指定认证信息的使用方式
        })
            .then(response => response.json())
            .then(data => {
                if (data.rs) {
                    item.result = data.info;
                }
            })
            .catch(error => console.error(error));
        setTimeout(runUploadTask, 100);
    }
    async function runSaveTask() {
        const list = [];
        showMessage('开始提交任务....🤓');
        taskTemp.forEach(x => {
            list.push({
                goodsid: itemId,
                type: x.type,
                value: x.result,
            })
        })
        await fetch('https://sjonline.gxyunyun.com/apis/app/open/common/save-sku-props', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ list }),
            Origin: window.location.protocol + "//" + window.location.host,
        })
            .then(response => response.json())
            .then(data => {
                if (data.rs) {
                    showMessage('图片搬完啦🤗');
                } else {
                    showMessage('😖失败惹，原因如下：' + data.message);
                }
            })
            .catch(error => console.error(error));
    }
    window.onload = () => {
        createElement();
        setTimeout(createSearchBox, 100);
    }
})();