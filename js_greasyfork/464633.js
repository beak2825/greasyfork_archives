// ==UserScript==
// @name         AI绘画标签中文搜索悬浮窗菜单（自用）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用户可以依靠悬浮窗快速便捷搜索，输入中文关键字即可获取对应的英文标签提示词（英文Tag为机翻），搜索时应避免搜索字太长导致不匹配。该脚本作用于所有网站，不需要时可将脚本关闭，有些网站进行搜索请求时可能不成功（已解决跨域问题）。
// @author       纸鸢花的花语
// @icon         https://p1.xywm.ltd/2023/04/21/a6b79200ba6260e62e9cf4a9f100d2a4.png
// @grant        GM_xmlhttpRequest
// @include      *

// @downloadURL https://update.greasyfork.org/scripts/464633/AI%E7%BB%98%E7%94%BB%E6%A0%87%E7%AD%BE%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E6%82%AC%E6%B5%AE%E7%AA%97%E8%8F%9C%E5%8D%95%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464633/AI%E7%BB%98%E7%94%BB%E6%A0%87%E7%AD%BE%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E6%82%AC%E6%B5%AE%E7%AA%97%E8%8F%9C%E5%8D%95%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 导入菜单栏样式
    function insertStyle() {
        const qStyle = document.createElement("style");
        qStyle.setAttribute("type", "text/css");
        qStyle.innerHTML = `
    ul {
        list-style: none;
    }

    #qBox {
        min-width: 250px;
        z-index: 9999;
        position: fixed;
        left: 20px;
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

    #qBox span {
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
        max-width: 500px;
        max-height: 150px;
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

    #qTitle input {
        border: 1.5px solid gray;
        height: 30px;
        outline: none;
        border-radius: 2px;
        padding: 0 5px;
    }
    #qListUL {
        padding: 0;
    }
    #qListUL li {
        border: 1.5px solid gray;
        border-radius: 2px;
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
    }

    `;
        let headNode = document.querySelector('head');
        headNode.appendChild(qStyle);
    }
    insertStyle();



    // 创建小菜单盒子
    let qBox = document.createElement("div");
    qBox.id = "qBox";
    qBox.innerHTML = `
<div style="background-color: #B2C6DF;" id="qTop">
            <span>
                AI绘画中文标签搜索：
            </span>
            <span id="logoBox">
                <a href="https://paperkiteblog.xyz/" title="By 纸鸢花的花语">
                    <div id="logo"></div>
                </a>
            </span>
        </div>
        <div>
            <span id="qTitle" style="color:blue">
                <input type="text" name="" id="search_str" placeholder="搜索中文Tag...">
            </span>
            <span>
                <button id="schBtn">搜索</button>
                <button id="delBtn">清空</button>
            </span>
        </div>
        <hr style="margin: 0;">
        <div style="display: block;">
            <div style="margin: 5px 0;">
                匹配信息：
                <b style="color: red;" id="match_sum"></b>
            </div>
            <div id="qList">
                <ul id="qListUL">

                </ul>
            </div>
        </div>


`;
    document.body.insertBefore(qBox, document.body.firstElementChild);
    document.getElementById("schBtn").addEventListener("click", API_search);
    document.getElementById("delBtn").addEventListener("click", del_match);


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

    // 文本复制至剪切板
    function copyToClipboard(text) {
        const input = document.createElement('textarea');
        input.value = text + ",";
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }


    // 插入匹配信息至匹配列表
    let match_arr = [];
    function processResponse(data) {
        document.getElementById("match_sum").innerHTML = data.length + "个";
        let qListUL = document.getElementById("qListUL");
        let ULStr = "";
        for (let i = 0; i < data.length; i++) {
            let LIStr = `
        <li>
            <span>
                ` + data[i][1] + `
            </span>
            <span>
                ` + data[i][0] + `
                <button class="copyBtn" enStr="` + data[i][0] + `">复制</button>
            </span>
        </li>
        `;
            ULStr += LIStr;
        }
        qListUL.innerHTML = ULStr;

        // 复制按钮绑定复制事件
        let myElements = document.querySelectorAll('.copyBtn');
        console.log(myElements);
        // 获取class为copyBtn的元素
        myElements.forEach((element) => {
            element.addEventListener('click', (event) => {
                const enStr = event.target.getAttribute('enStr');
                console.log(enStr);
                copyToClipboard(enStr);
            });
        });

    };

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
                    processResponse(res_arr);
                },
            });
        });
    }

    // 访问搜索接口
    function API_search() {
        let search_str = document.getElementById("search_str").value;
        if (search_str.length > 0) {
            let myUrl = "https://paperkiteidleplus.top/api/drawingsearch/index.php?search=" + search_str;
            // jsonp(myUrl, 'processResponse');
            getData(myUrl);
        } else {
            alert("搜索参数为空！");
        }
    }

    // 清空（隐藏）匹配信息
    function del_match() {
        document.getElementById("qListUL").innerHTML = "";
        document.getElementById("match_sum").innerHTML = "";
    }










})();