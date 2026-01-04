// ==UserScript==
// @name 【高糖质控】
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 在指定页面上添加慢病质控按钮，生成双iframe，分别是体检和随访，并上传质控时间
// @author 大成路旁
// @match http://10.85.36.41/jkda/*
// @run-at document-end
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/515725/%E3%80%90%E9%AB%98%E7%B3%96%E8%B4%A8%E6%8E%A7%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/515725/%E3%80%90%E9%AB%98%E7%B3%96%E8%B4%A8%E6%8E%A7%E3%80%91.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let hypertensionArchives = [];
    const qualityController = '宋维伟'; // 添加质控人员
    // 加载高血压档案数据
    function loadHypertensionArchives() {
        const url = 'http://192.168.8.188:8000/体检cid.json';
        console.log('开始加载高血压档案数据:', url);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const cleanedResponseText = cleanJsonResponse(response.responseText);
                        const data = JSON.parse(cleanedResponseText);
                        console.log('解析到服务器的json数据');
                        hypertensionArchives = data;
                        addEventListeners();
                    } catch (e) {
                        console.error('解析到服务器的json数据失败:', e, { responseText: response.responseText });
                    }
                } else {
                    console.error('获取到服务器的json数据失败:', response.statusText, { status: response.status, responseHeaders: response.responseHeaders, finalUrl: response.finalUrl, statusText: response.statusText });
                }
            },
            onerror: function(error) {
                console.error('请求服务器数据时发生错误:', error, { readyState: this.readyState, responseHeaders: this.responseHeaders, finalUrl: this.finalUrl, status: this.status, statusText: this.statusText });
            }
        });
    }
    // 清洗JSON响应文本
    function cleanJsonResponse(responseText) {
        let cleanedResponseText = responseText.replace(/[\x00-\x1f\x7f-\x9f]/g, '');
        if (!cleanedResponseText.startsWith('[')) cleanedResponseText = '[' + cleanedResponseText;
        if (!cleanedResponseText.endsWith(']')) cleanedResponseText = cleanedResponseText + ']';
        cleanedResponseText = cleanedResponseText.replace(/(\{[^{}]*)(?=\s*,\s*\}|\s*\]|$)/g, '$1}').replace(/(\{[^{}]*)(?=\s*,\s*])/g, '$1},');
        return cleanedResponseText;
    }
    // 构建【随访】URL
    function buildUrlWithParams(baseUrl, params) {
        const query = Object.keys(params).map(key => `dto%5B'${encodeURIComponent(key)}'%5D=${encodeURIComponent(params[key])}`).join('&');
        const randomParam = `_r=${Math.random()}`;
        return `${baseUrl}?${query}&${randomParam}`;
    }
    // 获取【体检】URL
    function getArchiveUrl(archiveId) {
        const archive = hypertensionArchives.find(item => item.档案号 === archiveId);
        if (archive) {
            const baseUrl = 'http://10.85.36.41/jkda/ehr/tPersonBaseInfoAction!viewHealthCheck.do?dto%5B%27c_id%27%5D=';
            const archiveUrl = `${baseUrl}${encodeURIComponent(archive.体检cid)}`;
            return archiveUrl;
        } else {
            alert(`未找到档案号 ${archiveId} 对应的网址，请检查档案数据。`);
            return null;
        }
    }
    // 生成质控页面模板
    function qualityControlTemplate(examUrl, followUpUrl, name, startTime, archiveNumber) {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${decodeURIComponent(name)} - 档案质控</title>
<style>
body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
.container { display: flex; height: 100vh; }
iframe { width: 50%; height: 100%; border: none; }
#closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background-color: #ff0000;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
}
</style>
</head>
<body>
<div class="container">
<iframe id="examFrame" src="${examUrl}"></iframe>
<iframe id="followUpFrame" src="${followUpUrl}"></iframe>
</div>
<button id="closeButton">关闭</button>
<script>
const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', function() {
    const endTime = new Date().getTime();
    const duration = (endTime - ${startTime}) / 1000;
    console.log('开始时间:', new Date(${startTime}).toISOString());
    console.log('结束时间:', new Date(endTime).toISOString());
    console.log('停留时间(秒):', duration);
    // 向父页面发送消息
    window.parent.postMessage({
        type: 'recordTime',
        archiveNumber: '${archiveNumber}',
        startTime: ${startTime},
        endTime: endTime,
        duration: duration,
        name: '${decodeURIComponent(name)}'
    }, '*');
});
window.addEventListener('message', function(event) {
    if (event.data.type === 'closeWindow') {
        window.parent.document.body.removeChild(window.parent.document.getElementById('qualityControlIframeContainer'));
    }
});
</script>
</body>
</html>
`;
    }
    // 创建质控按钮
    function createQualityControlButton() {
        const qualityControlButton = document.createElement('a');
        qualityControlButton.className = 'publichealthbutton publichealth-blue publichealth-small quality-control-button';
        qualityControlButton.href = 'javascript:void(0)';
        qualityControlButton.textContent = '慢病质控';
        qualityControlButton.style.cssText = `
margin-left: 5px;
background: #228B22;
color: white;
padding: 5px;
border-radius: 2px;
text-decoration: none;
display: inline-block;
line-height: 10px;
vertical-align: middle;
font-size: 12px;
`;
        return qualityControlButton;
    }
    // 处理质控按钮点击事件
    function handleQualityControlButtonClick(e) {
        e.preventDefault();
        const archiveNumber = this.closest('.slick-row').querySelector('.slick-cell.l4.r4').textContent.trim();
        const examUrl = getArchiveUrl(archiveNumber);
        const viewButton = this.closest('.slick-row').querySelector('a[href^="javascript:fn_fileView"]');
        if (viewButton && examUrl) {
            const match = viewButton.href.match(/fn_fileView\('([^']+)','([^']+)','([^']+)','([^']+)','([^']+)','([^']+)','([^']+)','([^']+)'\)/);
            if (match) {
                const [c_id, encodedName, cancel_flag, org_code, recd_type, day, follow_no, no_id] = match.slice(1);
                const decodedName = decodeURIComponent(encodedName); // 解码姓名
                const baseUrl = "http://10.85.36.41/jkda/chronic/chronicDiseaseVisitAction!toHypertensionView.do";
                const followUpParams = { c_id, name: decodedName, cancel_flag, org_code, recd_type, day, follow_no, no_id };
                const followUpUrl = buildUrlWithParams(baseUrl, followUpParams);
                const startTime = new Date().getTime(); // 记录开始时间
                const iframeContainer = document.createElement('div');
                iframeContainer.id = 'qualityControlIframeContainer';
                iframeContainer.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 9999;
background-color: white;
`;
                const iframe = document.createElement('iframe');
                iframe.srcdoc = qualityControlTemplate(examUrl, followUpUrl, encodedName, startTime, archiveNumber);
                iframe.style.cssText = `
width: 100%;
height: 100%;
border: none;
`;
                iframeContainer.appendChild(iframe);
                document.body.appendChild(iframeContainer);
                // 监听来自子页面的消息
                window.addEventListener('message', function(event) {
                    if (event.data.type === 'recordTime') {
                        const { archiveNumber, startTime, endTime, duration, name } = event.data;
                        const formattedStartTime = new Date(startTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '/');
                        const formattedEndTime = new Date(endTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '/');
                        sendRecordTime({ archiveNumber, name, formattedStartTime, formattedEndTime, duration, qualityController });
                        // 发送消息给子页面，告知可以关闭窗口
                        event.source.postMessage({ type: 'closeWindow' }, '*');
                    }
                }, { once: true }); // 只注册一次
            }
        }
    }
    // 发送记录时间请求
    function sendRecordTime({ archiveNumber, name, formattedStartTime, formattedEndTime, duration, qualityController }) {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://192.168.8.188:8000/time',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                质控人员: qualityController,
                档案号: archiveNumber,
                姓名: name,
                开始时间: formattedStartTime,
                结束时间: formattedEndTime,
                停留时间: duration
            }),
            onload: function(response) {
                console.log("Server responded:", response.responseText);
            }
        });
    }
    // 添加质控按钮
    function addQualityControlButtons() {
        const deleteButtons = document.querySelectorAll('a.publichealthbutton.publichealth-blue.publichealth-small[href^="javascript:fn_delete"]');
        deleteButtons.forEach(deleteButton => {
            if (!deleteButton.nextElementSibling || !deleteButton.nextElementSibling.classList.contains('quality-control-button')) {
                const qualityControlButton = createQualityControlButton();
                qualityControlButton.addEventListener('click', handleQualityControlButtonClick);
                deleteButton.parentNode.insertBefore(qualityControlButton, deleteButton.nextSibling);
            }
        });
    }
    // 添加事件监听器
    function addEventListeners() {
        const queryButton = document.querySelector('button[id^="tabasicfield_"][id$="_query"]');
        if (queryButton) {
            queryButton.addEventListener('click', () => {
                setTimeout(addQualityControlButtons, 500);
            });
        }
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                const targetNode = document.querySelector('table.slick-grid');
                if (targetNode) {
                    addQualityControlButtons();
                    observer.disconnect();
                }
            });
        });
        const targetNode = document.querySelector('table.slick-grid');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            setTimeout(() => {
                const targetNode = document.querySelector('table.slick-grid');
                if (targetNode) {
                    observer.observe(targetNode, { childList: true, subtree: true });
                }
            }, 1000);
        }
    }
    // 初始化加载高血压档案数据
    loadHypertensionArchives();
})();
