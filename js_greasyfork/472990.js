// ==UserScript==
// @name         磁力资源预览器（自用）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解决平时在磁力搜索网站寻找资源只能下载后查看而无法先预览内容的问题，把磁链拖入悬浮窗即可预览内容图片，支持20多个磁搜网站适配，未适配的网站自己在代码后加入【// @match  *】即可全局支持。
// @author       纸鸢花的花语
// @icon         https://p1.xywm.ltd/2023/04/21/a6b79200ba6260e62e9cf4a9f100d2a4.png
// @grant        GM_xmlhttpRequest
// @include        *://*xcc*.xyz/hash/*
// @match        *://*.btmulu.work/hash/*
// @include        *://*xiongmao*.top/detail/*
// @include        *://*clm*.buzz/hash/*
// @include        *://*skrbt*.top/detail/*
// @match        *://*wk.sefan.cc/hash/*
// @include        *://*bt1207*.top/detail/*
// @include        *://*sbt*.pw/detail*
// @match        *://*0magnet.co/*
// @include        *://*.sokk*.buzz/hash/*
// @include        *://*wuqian*.top/detail/*
// @include        *://*chilisou*.xyz/info.php?hash*
// @include        *://*laowang*.top/detail/*
// @include        *://*lemon*.top/detail/*
// @include        *://*btfox*.vip/info/*
// @match        *://*p20.btapp.cc/view.php?id*
// @include        *://*cld*.buzz/hash/*




// @downloadURL https://update.greasyfork.org/scripts/472990/%E7%A3%81%E5%8A%9B%E8%B5%84%E6%BA%90%E9%A2%84%E8%A7%88%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472990/%E7%A3%81%E5%8A%9B%E8%B5%84%E6%BA%90%E9%A2%84%E8%A7%88%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    // 导入菜单栏样式
    function insertStyle() {
        const qStyle = document.createElement("style");
        qStyle.setAttribute("type", "text/css");
        qStyle.innerHTML = `
    ul {
        list-style: none;
    }

    #qBox {
        max-width: 350px;
        min-width: 250px;
        z-index: 9999;
        position: fixed;
        right: 20px;
        top: 20px;
        border-radius: 5px;
        border: 2.5px solid black;
        background-color: white;
    }

    #qBox>div {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 10px;
        font-weight: bold;
    }
    #jxinput {
        border-radius: 2px;
        flex: 1;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        height: 20px;
    }
    #qBox span {
        font-weight: bold;
        margin: 5px;
    }

    #qBox span button {
        border: 0;
        display: inline-block;
        height: 30px;
        border-radius: 2px;
        min-width: 30px;
    }

    #qList {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        min-height: 110px;
        max-width: 500px;
        max-height: 300px;
        overflow: hidden;
        overflow-y: scroll;
    }

    #logo {
        width: 35px;
        height: 35px;
        border-radius: 2.5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        background-image: url('https://p1.xywm.ltd/2023/04/21/a6b79200ba6260e62e9cf4a9f100d2a4.png');
        background-size: cover;
    }

`;
        let headNode = document.querySelector('head');
        headNode.appendChild(qStyle);
    }

    // 解析磁力后显示在菜单栏
    function displayQS(qObject) {
        console.log(qObject);
        let tagStr = "";
        if (qObject['screenshots']) {
            tagStr = `<a href="`+qObject['screenshots'][0]['screenshot']+`"><img src="` + qObject['screenshots'][0]['screenshot'] + `" alt="" style="width: 100%;</a>">`
    } else {
        tagStr = `<p style="text-align: center;">None</p>`
    }
        let qULs = `<div style="margin-bottom: 5px;width:100%">
    <p>`+ qObject['name'] + `</p>
</div>
<div style="width:100%">`+ tagStr + `</div>`;


        const qList = document.getElementById("qList");
        qList.innerHTML = qULs;

    }


    // 油猴解析跨域访问
    function getData(url) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                onload(xhr) {
                    // 响应成功时执行的回调函数
                    const responseData = xhr.responseText;
                    // console.log(responseData); // 在控制台输出响应数据
                    const res_arr = JSON.parse(responseData.replace(/[()]/g, ''));
                    resolve(responseData);
                    displayQS(JSON.parse(responseData));
                },
            });
        });
    }

    function getApi(flux) {
        const Http = new XMLHttpRequest();
        const url = 'https://whatslink.info/api/v1/link?url=' + flux;
        getData(url);
    }
    insertStyle();
    // 创建小菜单盒子
    let qBox = document.createElement("div");
    qBox.id = "qBox";
    qBox.innerHTML = `
<div style="background-color: #B2C6DF;" id="qTop">
            <span>
                磁力资源预览器：
            </span>
            <span id="logoBox">
                <a href="http://zyhflower.xyz/" title="By 纸鸢花的花语">
                    <div id="logo"></div>
                </a>
            </span>
        </div>
        <div>
            <input type="text" name="" id="jxinput" placeholder="magnet:?xt=urn:btih:-XXXX">
            <span>
                <button id="jxBtn">解析</button>
            </span>
        </div>
        <hr style="margin: 0;">
        <div style="display: block;">
            <div id="qList">->将磁链拖到此处<-</div>
            <div style="text-align: right;font-size: 12px;color: green;">By纸鸢花的花语</div>
        </div>

`;
    document.body.insertBefore(qBox, document.body.firstElementChild);


    function readFlex() {
        let flux = document.getElementById("jxinput").value;
        getApi(flux);

    }

    // 解析按钮点击
    let jxBtn = document.getElementById("jxBtn");
    jxBtn.onclick = function () {
        readFlex();
    }
    // 获取拖拽区域元素
    const dropArea = document.getElementById("qList");

    // 阻止浏览器默认的拖拽行为
    dropArea.addEventListener("dragover", event => {
        event.preventDefault();
    });

    // 在拖拽结束时，监听 drop 事件并读取链接
    dropArea.addEventListener("drop", event => {
        event.preventDefault();
        const draggedLink = event.dataTransfer.getData("text/plain");
        if (draggedLink) {
            const linkElement = document.createElement("a");
            linkElement.href = draggedLink;
            const linkText = linkElement.textContent || linkElement.innerText;
            getApi(draggedLink);
        }
    });

    // 将所有 <a> 标签设置为可拖拽
    const linkElements = document.querySelectorAll("a");
    linkElements.forEach(link => {
        link.draggable = true;

        link.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", link.href);
        });
    });

    // 获取要拖拽的标签元素
    const tag = document.querySelector('#qBox');
    const qTop = document.querySelector('#qTop');

    let isDragging = false; // 是否正在拖拽
    let startX, startY; // 开始拖拽时的鼠标位置
    let offsetX, offsetY; // 鼠标点与标签左上角的偏移量

    qTop.addEventListener('mousedown', e => {
        startX = e.clientX;
        startY = e.clientY;
        offsetX = startX - tag.offsetLeft;
        offsetY = startY - tag.offsetTop;
        isDragging = true;
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            tag.style.left = `${x}px`;
            tag.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });




})();