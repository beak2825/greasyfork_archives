// ==UserScript==
// @name         mt_文章解析
// @version      1.1.5
// @license      MIT
// @description  文章解析为添加到剪切板
// @author       leeshuailing
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1194653
// @downloadURL https://update.greasyfork.org/scripts/477295/mt_%E6%96%87%E7%AB%A0%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/477295/mt_%E6%96%87%E7%AB%A0%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

function createSlidingNotification(message, button) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    if (message.includes("解析失败")) {
        notification.style.right = '0';
        notification.style.top = '5';

    } else {
        notification.style.left = (button.offsetLeft - 80) + 'px';
        notification.style.top = 10 + (button.offsetTop + button.offsetHeight / 2) + 'px';
    }
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    // 字体颜色 绿色粗体
    notification.style.fontWeight = 'bold';
    notification.style.fontSize = '16px';
    if (message === "复制成功") {
        notification.style.color = '#00FF00';
    } else {
        notification.style.color = '#FF0000';
    }

    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.remove();
    }, 2000);
}

function getLatestVersionFromGreasyFork() {
    const scriptId = '477295-mt-文章解析';
    const apiUrl = `https://greasyfork.org/en/scripts/${scriptId}/versions.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const latestVersion = data[0].version;
            checkForUpdate(latestVersion);
        })
        .catch(error => console.error('Error fetching latest version:', error));
}

function checkForUpdate(latestVersion) {
    const currentVersion = GM_info.script.version;

    if (latestVersion > currentVersion) {
        const userResponse = confirm(`发现新版本 ${latestVersion}，是否立即更新？`);
        if (userResponse) {
            window.open('https://greasyfork.org/zh-CN/scripts/477295-mt-%E6%96%87%E7%AB%A0%E8%A7%A3%E6%9E%90');
        }
    }
}


getLatestVersionFromGreasyFork();


(function () {
    if (unsafeWindow.self === unsafeWindow.top) {
        // 在这里写你的脚本代码

        'use strict';

        const result = {
            title: "",
            publistTime: "",
            link: "",
            authorName: "",
            authorId: "",
            content: "",
            source: ""
        };

        const chinaseKeyMap = {
            result: "复制全部",
            title: "标题",
            publistTime: "发布时间",
            link: "链接",
            authorName: "作者",
            authorId: "作者ID",
            content: "内容",
            source: "来源"
        };

        function timestampToTime(timestamp) {
            timestamp = timestamp.toString();
            timestamp = timestamp.match(/\d{10}/)[0];
            if (!timestamp) {
                return timestamp;
            }
            const date = new Date(timestamp * 1000); // 将秒数转换为毫秒数
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        function parseWechatArticle() {
            result.title = unsafeWindow.globalThis.msg_title;
            result.publistTime = unsafeWindow.globalThis.create_time;
            result.link = unsafeWindow.globalThis.msg_link;
            result.authorName = unsafeWindow.globalThis.nickname;
            result.authorId = unsafeWindow.globalThis.user_name;
            result.content = document.querySelector('#js_content').innerHTML;
        }

        function parseBaiduArticle() {

            result.title = unsafeWindow.jsonData.bsData.title;
            result.publistTime = unsafeWindow.jsonData.bsData.timestamp;
            result.link = unsafeWindow.jsonData.bsData.profitLog.contentUrl;
            result.authorName = document.querySelector('span[data-testid="author-name"]').innerText;
            result.authorId = unsafeWindow.jsonData.bsData.profitLog.contentAccId;
            result.content = document.querySelector('div[data-testid="article"]').innerHTML;
        }

        function igetApi() {
            let url = unsafeWindow.location.href;
            let htmlSource = document.documentElement.outerHTML;

            GM_xmlhttpRequest({
                method: "POST",
                headers: {
                    'referer': url
                },
                url: 'http://180.76.101.110:8081/iget-web/v2/parse/html',

                data: 'url:' + url + "\n" + 'html:' + htmlSource,

                onload: function (response) {

                    try {
                        const result_iget = JSON.parse(response.responseText);
                        console.log(result_iget)
                        let code = result_iget.code;
                        if (code === 1) {
                            let data = result_iget.data;

                            result.title = data.title || "";
                            result.publistTime = data.pubTime || "";
                            result.authorName = data.author || "";
                            result.content = data.content || "";
                            result.source = data.source || "";
                            result.link = url;
                            setButtonValue(result);
                        } else {
                            createSlidingNotification('解析失败-' + code, this);
                            // 开始解析的ID更换为重新解析
                            createCopyButton('解析失败-' + code, '', 'rgba(9,9,12,0.56)', 'red');
                        }

                    } catch (error) {
                        console.error('Error processing response:', error);
                    }
                },
                onerror: function (error) {
                    console.error('Error with the request:', error);
                }
            });

        }

        function getRandomColor() {
            const color1 = Math.floor(Math.random() * 256); // 0-255
            const color2 = Math.floor(Math.random() * 256); // 0-255
            const color3 = Math.floor(Math.random() * 256); // 0-255
            return 'rgb(' + color1 + ', ' + color2 + ', ' + color3 + ',0.5 )';
        }


        function createCopyButton(butten_name, content, backColor, typefaceColor) {
            const copyButton = document.createElement('button');
            copyButton.id = butten_name;
            copyButton.innerText = butten_name;
            copyButton.style.position = 'fixed';
            copyButton.style.top = (50 + 60 * (document.querySelectorAll('button.copy-button').length)) + 'px';
            copyButton.style.right = '0';
            copyButton.style.transform = 'translateY(-50%)';
            copyButton.style.zIndex = '9999';
            copyButton.style.fontSize = '16px';
            copyButton.style.padding = '10px';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '10px'; // 添加圆角样式
            copyButton.style.cursor = 'pointer';
            copyButton.style.width = '100px';
            copyButton.style.textAlign = 'center';
            copyButton.classList.add('copy-button');
            copyButton.style.backgroundColor = '#FF0000';
            copyButton.style.color = 'white';

            if (typefaceColor) {
                copyButton.style.color = typefaceColor;
            }

            if (butten_name === "开始解析") {
                setInterval(function changeColor() {
                    let colors = ['#FF0000', '#FFFF00', '#0000FF'];
                    document.querySelector('#开始解析').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                }, 2000);

            } else {
                if (backColor) {
                    copyButton.style.backgroundColor = backColor;
                } else {
                    copyButton.style.backgroundColor = getRandomColor();
                }
            }

            copyButton.addEventListener('click', function () {
                if (butten_name === "开始解析") {
                    let url = unsafeWindow.location.href;

                    if (url.indexOf('mp.weixin.qq.com') > -1) {
                        parseWechatArticle();
                        setButtonValue(result);

                    } else if (url.indexOf('mbd.baidu.com') > -1) {
                        while (!unsafeWindow.jsonData) {
                            setTimeout(function () {
                            }, 1000);
                        }
                        parseBaiduArticle();
                        setButtonValue(result);
                    } else {
                        igetApi();
                    }

                    // 隐藏 innerText=开始解析 的按钮
                    document.querySelector('#开始解析').style.display = 'none';
                } else {
                    GM_setClipboard(content);
                    let tip;
                    if (content) {
                        tip = "复制成功";
                    } else {
                        tip = "未解析到内容";
                    }
                    createSlidingNotification(tip, this);
                }
            });

            document.body.appendChild(copyButton);

        }

        function setButtonValue(result) {
            if (result.publistTime) {
                result.publistTime = timestampToTime(result.publistTime);
            }
            result.result = JSON.stringify(result, null, 4);
            console.log(result)

            for (let key in chinaseKeyMap) {
                createCopyButton(chinaseKeyMap[key], result[key]);
            }
        }

        createCopyButton("开始解析");
    }
})();