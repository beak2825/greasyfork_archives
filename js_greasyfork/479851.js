// ==UserScript==
// @name         自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  take over the world!
// @author       You
// @match        https://agent.itmnic.com/*
// @match        https://xn--26qv08d.xn--ses554g/registrant/*
// @exclude      https://xn--26qv08d.xn--ses554g/index
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/479851/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/479851/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 页面加载时从API获取配置数组，并设置相应元素的值
const API_URL = "https://ued.iwanshang.cloud/index.php?m=Fsupport&a=api";
//.网址查询
// fetch('https://api.knet.cn/whois?domain=数字人民币').then(response => response.json()).then(data => console.log(data)).catch((error) => {
//     console.error('Error:', error);
// });
// 创建浮动层并设定样式
let floatDiv = document.createElement('div');
floatDiv.style.height = '500px';
floatDiv.style.overflow = 'auto'; // 如果内容超过可视区域，将出现滚动条
floatDiv.style.width = "200px";
floatDiv.style.background = "white";
floatDiv.style.position = "fixed";
floatDiv.style.top = "100px";
floatDiv.style.right = "50px"; // 修改为距离右边50px
floatDiv.style.zIndex = "9999";
floatDiv.style.padding = "10px";
floatDiv.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
document.body.appendChild(floatDiv);

// 在浮动层内添加一个按钮
let button = document.createElement('button');
button.textContent = "填充表单";
floatDiv.appendChild(button);

// 添加一个新的按钮用于增加浮动层高度
let resizeButton = document.createElement('button');
resizeButton.textContent = "增加高度";
floatDiv.appendChild(resizeButton);

resizeButton.onclick = function() {
    floatDiv.style.height = (parseInt(floatDiv.style.height, 10) + 100) + 'px';
};

function getTitleFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('title');
}

let config = {}; // Initialize the config variable outside of the request

function createViewForData(data, parentElement) {
    if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let subElement = document.createElement('div');
                subElement.textContent = `${key}: `;
                createViewForData(data[key], subElement);
                parentElement.appendChild(subElement);
            }
        }
    } else {
        // 检查数据是否可能是一个 URL（并因此可能是一张图片）
        // ...

        if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://')) && (data.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
            // 创建一个链接元素来包裹图片
            let a = document.createElement('a');
            a.href = data;
            a.target = '_blank';

            // 创建缩略图
            let imgThumbnail = document.createElement('img');
            imgThumbnail.src = data;
            imgThumbnail.width = 100; // 或者使用样式 imgThumbnail.style.width = '100px';
            imgThumbnail.height = 100; // 或者使用样式 imgThumbnail.style.height = '100px';

            // 创建大图容器
            let imgLargeContainer = document.createElement('div');
            imgLargeContainer.style.display = 'none';
            imgLargeContainer.style.position = 'fixed';
            imgLargeContainer.style.zIndex = '10000';
            imgLargeContainer.style.top = '50%';
            imgLargeContainer.style.left = '50%';
            imgLargeContainer.style.transform = 'translate(-50%, -50%)';

            // 创建大图
            let imgLarge = document.createElement('img');
            imgLarge.src = data;
            imgLarge.style.maxWidth = '800px'; // 设置最大宽度为800px
            imgLarge.style.height = 'auto'; // 高度自适应

            // 添加关闭按钮
            let closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'fixed'; // 改为固定定位
            closeButton.style.top = '10px'; // 距离窗口顶部10px
            closeButton.style.right = '10px'; // 距离窗口右侧10px
            closeButton.style.zIndex = '10001';

            // 点击关闭按钮隐藏大图和关闭按钮本身
            closeButton.onclick = function() {
                imgLargeContainer.style.display = 'none';
                closeButton.style.display = 'none'; // 隐藏关闭按钮
            };

            // 鼠标悬停显示大图
            imgThumbnail.onmouseenter = function() {
                imgLargeContainer.style.display = 'block';
                closeButton.style.display = 'block'; // 显示关闭按钮
            };

            // 组装大图到大图容器
            imgLargeContainer.appendChild(imgLarge);
            // 大图容器添加到body
            document.body.appendChild(imgLargeContainer);
            // 关闭按钮作为独立元素直接添加到body以保证其位置在最上方
            document.body.appendChild(closeButton);

            // 将缩略图添加到链接元素中，并将链接元素添加到父元素中
            a.appendChild(imgThumbnail);
            parentElement.appendChild(a);
        } else {
            // 如果数据不是图片，则正常显示文本
            parentElement.textContent += data;
        }

        // ...

    }
}


// 处理 response 的函数
function processResponse(response) {

    let responseData = JSON.parse(response.responseText);
    let allData = responseData.data;

    // 使用第1组数据作为配置
    config = allData[0];

    // 显示所有数据
    for (let i = 0; i < allData.length; i++) {
        let groupDiv = document.createElement('div');
        groupDiv.style.marginTop = '10px';
        groupDiv.style.paddingTop = '10px';
        groupDiv.style.borderTop = '1px solid black';

        let groupTitle = document.createElement('h4');
        groupTitle.textContent = `Group ${i + 1}`;

        // 默认将 Group 1 设置为红色
        if (i === 0) {
            groupTitle.style.color = 'red';
        }

        groupDiv.appendChild(groupTitle);

        // 点击组标题时更换配置并改变标题颜色
        groupTitle.onclick = function() {
            config = allData[i];
            console.log(`Config changed to group ${i + 1}`);

            // 将其他标题重置为黑色
            floatDiv.querySelectorAll('h4').forEach(function(h4) {
                h4.style.color = 'black';
            });

            // 将点击的标题设为红色
            this.style.color = 'red';
        };
        // 调用新的递归函数来处理每个元素，其中 allData[i] 可能是多级数组
        createViewForData(allData[i], groupDiv);


        floatDiv.appendChild(groupDiv);
    }


    // 当点击按钮时，使用配置数组设置相应元素的值
    button.onclick = function() {
        for (let key in config) {
            let elements = document.querySelectorAll(`[name="${key}"]`);
            if (elements.length > 0) {
                if (Array.isArray(config[key])) {
                    for (let i = 0; i < elements.length; i++) {
                        if (config[key][i] !== undefined) {
                            elements[i].value = config[key][i];
                        }
                    }
                } else {
                    for (let element of elements) {
                        element.value = config[key];
                    }
                }
            } else {
                console.log(`没有找到name为"${key}"的表单控件`);
            }
        }
    };

}

let title = getTitleFromUrl();
GM_xmlhttpRequest({
    method: "POST",
    url: API_URL,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    data: `type=4&currentUrl=${encodeURIComponent(window.location.href)}${title ? `&title=${encodeURIComponent(title)}` : ''}`,
    onload: processResponse
});

// 添加拖动功能
floatDiv.onmousedown = function(event) {
    let shiftX = floatDiv.getBoundingClientRect().right - event.clientX;
    let shiftY = event.clientY - floatDiv.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        floatDiv.style.right = (window.innerWidth - pageX - shiftX) + 'px';
        floatDiv.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    floatDiv.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        floatDiv.onmouseup = null;
    };
};

// 防止默认的拖拉选择
floatDiv.ondragstart = function() {
    return false;
};

// 在浮动层中创建一个输入框和一个按钮
let inputField = document.createElement('input');
let queryButton = document.createElement('button');

// 设置按钮的文本
queryButton.textContent = '查询';

floatDiv.appendChild(inputField);
floatDiv.appendChild(queryButton);

// 为按钮添加点击事件监听器
queryButton.onclick = function() {
    // 获取输入框的值
    let inputValue = inputField.value;

    // 向API发送请求
    GM_xmlhttpRequest({
        method: "POST",
        url: API_URL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: `type=2&currentUrl=${encodeURIComponent(window.location.href)}&input=` + inputValue,
        onload: processResponse
    });
};
})();