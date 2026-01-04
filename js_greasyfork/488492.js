// ==UserScript==
// @name         查单词机绑定信息
// @namespace    https://vbd.baicizhan.com
// @version      2.1
// @description  在页面嵌入按钮，快速查询单词机绑定信息
// @author       hr
// @match        https://vbd.baicizhan.com/user_account_info/result?page=result*
// @connect      booklist.baicizhan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      hr
// @downloadURL https://update.greasyfork.org/scripts/488492/%E6%9F%A5%E5%8D%95%E8%AF%8D%E6%9C%BA%E7%BB%91%E5%AE%9A%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/488492/%E6%9F%A5%E5%8D%95%E8%AF%8D%E6%9C%BA%E7%BB%91%E5%AE%9A%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');

    // 添加样式内容
    style.textContent = `
p {
    margin: 10px 20px;
}
.device-info-panel {
    position: fixed;
    top: 52px;
    right: 20px;
    z-index: 9999;
    background-color: #ffffff;
    border: none; /* 移除边框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    opacity: 0; /* 初始设置为透明 */
    transition: opacity 0.3s ease; /* 添加过渡效果 */
}

.device-info-panel.show {
    opacity: 1; /* 显示时完全不透明 */
}

  /* 设置表格样式 */
  .custom-table {
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }

  /* 设置表格边框和单元格样式 */
  .custom-table th,
  .custom-table td {
    border: none; /* 移除默认边框 */
    padding: 12px;
    text-align: center;
  }

  /* 设置表头样式 */
  .custom-table th {
    background-color: #4CAF50; /* 使用明亮的颜色 */
    color: white; /* 文字颜色 */
    font-weight: bold;
  }

  /* 鼠标悬停时变更行颜色 */
  .custom-table tr{
    background-color: #f8f8f9; /* 更浅的背景色 */
    transition: background-color 0.3s; /* 添加过渡效果 */
  }

  /* 鼠标悬停时变更行颜色 */
  .custom-table tr:hover {
    background-color: initial; /* 更浅的背景色 */
  }

.button {
    font-size: 16px;
    position: fixed;
    top: 20px; /* 距离顶部20px */
    right: 20px; /* 距离右侧20px */
    border: none;
    border-radius: 5px; /* 圆角 */
    background-color: #fff; /* 背景颜色 */
    color: white; /* 文字颜色 */
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s;
    z-index: 9999; /* 确保按钮在顶层 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}

.button:hover {
    background-color: #EAEDED; /* 鼠标悬停时的背景颜色 */
}
  .book-details {
    display: flex;
    align-items: center; /* 将元素垂直居中 */
    font-family: Arial, sans-serif;
    padding: 8px;
    border-radius: 8px;
    width:fit-content;
    margin: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .book-pic {
    width: 48px;
    height: auto;
    margin-right: 8px; /* 调整图片与文本之间的间距 */
  }

  .book-details-text {
    display: flex;
    flex-direction: column;
  }

  .progress-bar {
    width: 100%;
    background-color: #B2BABB;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .progress-bar-inner {
    height: 20px;
    background-color: #4caf50;
    color: #ffffff;
    font-weight: bold;
    line-height: 20px;
  }
`;


    // 将样式标签添加到文档的 head 中
    document.head.appendChild(style);

    // 创建面板并显示数据
    function createPanel(deviceInfoList,access_token) {
        var panel = document.createElement("div");
        panel.id = "deviceInfoPanel";
        panel.className = "device-info-panel";

        // 如果没有机器信息，则显示提示信息
        if (!deviceInfoList || deviceInfoList.length === 0) {
            panel.innerHTML = "<p>该用户没有单词机~</p>";
        } else {
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var headers = ['设备id','设备名称','上次同步时间','连接状态','官方词书及进度','自定义单词本及进度']
            table.classList.add("custom-table");
            // 遍历 headers 数组
            headers.forEach(function(header) {
                // 创建 th 元素
                var th = document.createElement("th");

                // 设置 th 元素的文本内容
                th.textContent = header;

                // 将 th 元素添加到 thead 中
                thead.appendChild(th);
            });
            table.appendChild(thead);
            for (let deviceInfo of deviceInfoList){
                console.log(deviceInfo)
                // 发起跨域请求
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://booklist.baicizhan.com/api/device/get_plan_info?deviceId="+deviceInfo.deviceId,
                    headers: {
                        "Host": "booklist.baicizhan.com",
                        "Cookie": "access_token=" + access_token
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                var responseData = JSON.parse(response.responseText);
                                var bookPlan = responseData.data && responseData.data.bookPlan;
                                var wordBookPlan = responseData.data && responseData.data.wordBookPlan;
                                var rowInfo = [deviceInfo.deviceId,deviceInfo.deviceName,new Date(deviceInfo.lastSyncTime).toLocaleString(),deviceInfo.connectStatus,createBookDetailsElement(bookPlan),createBookDetailsElement(wordBookPlan)]
                                // 创建表格行
                                let row = table.insertRow();
                                // 遍历数据项的属性，并将每个属性值作为单元格内容添加到行中
                                for (let data of rowInfo) {
                                    let cell = row.insertCell();
                                    if (data instanceof HTMLElement) {
                                        cell.appendChild(data)
                                        cell.style.padding = '0px';
                                        cell.style.textAlign = 'initial';
                                    } else {
                                        cell.innerHTML = data;
                                    }
                                }
                            } catch (error) {
                                alert("无法解析响应数据: " + error);
                            }
                        } else {
                            alert("网络请求失败: " + response.code+ response.message);
                        }
                    },
                    onerror: function(error) {
                        alert("请求出错: " + error.message);
                    }
                });
            }
            panel.appendChild(table);
        }
        document.body.appendChild(panel);
        setTimeout(()=>{
            panel.classList.toggle("show");
        },100);

    }

    // 获取用户信息并发送请求
    function getUserInfoAndSendRequest() {
        var deviceInfoPanel = document.getElementById('deviceInfoPanel');
        if (deviceInfoPanel) {
            deviceInfoPanel.classList.toggle("show");
            setTimeout(()=>{
                deviceInfoPanel.parentNode.removeChild(deviceInfoPanel);
            },350);
            return;
        }
        // 使用正则表达式提取 user_info 的值
        const regex = /var user_info = '([^']+)';/;
        const html = document.documentElement.outerHTML;
        var access_token;
        const match = html.match(regex);

        if (match && match.length > 1) {
            const userInfoString = match[1];

            // 替换转义字符 &quot; 为双引号 "
            const unescapedUserInfo = userInfoString.replace(/&quot;/g, '"');

            // 将 user_info 转换为 JSON 对象
            let userInfo;
            try {
                userInfo = JSON.parse(unescapedUserInfo);
                access_token = userInfo[0].temporary_token;
                // 在这里可以使用 userInfo 对象进行操作
            } catch (error) {
                console.error('无法解析 user_info:', error);
            }

            // 发起跨域请求
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://booklist.baicizhan.com/api/device/get_device_list?type=0",
                headers: {
                    "Host": "booklist.baicizhan.com",
                    "Cookie": "access_token=" + access_token
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            var responseData = JSON.parse(response.responseText);
                            var deviceInfoList = responseData.data && responseData.data.deviceBasicInfoList;
                            createPanel(deviceInfoList,access_token);
                        } catch (error) {
                            alert("无法解析响应数据: " + error);
                        }
                    } else {
                        alert("网络请求失败: " + response.code+ response.message);
                    }
                },
                onerror: function(error) {
                    alert("请求出错: " + error.message);
                }
            });
        }
    }

    // 创建按钮
    function createButton() {
        var button = document.createElement("button");
        button.textContent = "🔎";
        button.classList.add("button");
        button.addEventListener("click", getUserInfoAndSendRequest);
        document.body.appendChild(button);
    }

    function createBookDetailsElement(bookData) {
        if(bookData.bookId === -1){
            return "未设置"
        }
        const container = document.createElement('div');
        container.className = 'book-details';

        const bookPic = document.createElement('img');
        bookPic.className = 'book-pic';
        bookPic.alt = '书籍封面';
        bookPic.src = bookData.bookPic;

        const bookDetails = document.createElement('div');
        bookDetails.className = 'book-details-text';

        const bookName = document.createElement('div');
        bookName.id = 'book-name';
        bookName.textContent = bookData.bookName + '（' + bookData.bookId + '）';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const progressBarInner = document.createElement('div');
        progressBarInner.className = 'progress-bar-inner';

        bookDetails.appendChild(bookName);
        progressBar.appendChild(progressBarInner);
        bookDetails.appendChild(progressBar);
        container.appendChild(bookPic);
        container.appendChild(bookDetails);


        const dailyPlanCount = document.createElement('div');
        dailyPlanCount.id = 'daily-plan-count';
        dailyPlanCount.textContent = '计划数:    ' + bookData.dailyPlanCount;
        bookDetails.appendChild(dailyPlanCount);

        const progress = (bookData.learnedWordCount / bookData.totalWordCount) * 100;
        progressBarInner.style.width = progress.toFixed(1) + '%';
        progressBarInner.textContent = bookData.learnedWordCount + '/' + bookData.totalWordCount;

        return container;
    }

    // 初始化
    createButton();
})();
