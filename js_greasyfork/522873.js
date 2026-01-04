// ==UserScript==
// @name         B站防沉迷
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @description  根据根据关键词和正则表达式，自动关闭在标题或标签中包含这些关键词的B站视频
// @author       Vz
// @match        *://*.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522873/B%E7%AB%99%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522873/B%E7%AB%99%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //默认参数
    const defaultBlockedWords = [
        '这是关键词',
        '/这是正则表达式/'
    ];
    const defaultStartTime = "16:00";
    const defaultEndTime = "22:00";
    const defaultEnableTimeRange = true;
    const defaultShowTips = true;

    // 获取当前时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 从存储中加载关键词列表和时间设置
    let blockedWords = GM_getValue('blockedWords',defaultBlockedWords );
    let startTime = GM_getValue('startTime', defaultStartTime);
    let endTime = GM_getValue('endTime', defaultEndTime);
    let showTips = GM_getValue('showTips', defaultShowTips);
    let enableTimeRange = GM_getValue('enableTimeRange', defaultEnableTimeRange);
    //运行时更新参数
    function getCustomValue () {
        blockedWords = GM_getValue('blockedWords',defaultBlockedWords );
        startTime = GM_getValue('startTime', defaultStartTime);
        endTime = GM_getValue('endTime', defaultEndTime);
        showTips = GM_getValue('showTips', defaultShowTips);
        enableTimeRange = GM_getValue('enableTimeRange', defaultEnableTimeRange);
    }


    if(!enableTimeRange){
        //不勾选停用时段直接执行主逻辑
        mainLogic();
    }else{
        // 将时间字符串转换为分钟数
        function timeToMinutes(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        }

        // 检查当前时间是否在停用区间内
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const startTimeInMinutes = timeToMinutes(startTime);
        const endTimeInMinutes = timeToMinutes(endTime);

        if (!(currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes)) {
            // 不在停用时间内，才执行主逻辑
            mainLogic();
        }

    }




    // 获取当前页面的标题
    function getTitle() {
        const url = new URL(window.location.href);
        const path = url.pathname;

        // 根据路径选择不同的标题元素类名
        let titleElement;
        if (path.startsWith('/video/')) {
            titleElement = document.querySelector('.video-title');
        } else if (path.startsWith('/list/')) {
            titleElement = document.querySelector('.video-title-href');
        }

        //alert(titleElement ? titleElement.innerHTML : 'No title found');
        return titleElement ? titleElement.innerHTML : '';
    }

    // 获取视频的 BV 号
    function getBvNumber() {
        const url = new URL(window.location.href);
        const path = url.pathname;
        const searchParams = url.searchParams;

        // 从路径中获取 BV 号
        if (path.startsWith('/video/')) {
            const bvMatch = path.match(/\/video\/(BV\w+)/);
            return bvMatch ? bvMatch[1] : null;
        } else if (path.startsWith('/list/')) {
            return searchParams.get('bvid');
        }
        return null;
    }

    // 获取视频标签
    function getVideoApiTags(videoBv) {
        fetch(`https://api.bilibili.com/x/web-interface/view/detail/tag?bvid=${videoBv}`)
            .then((response) => response.json())
            .then((data) => {
            const tags = data.data ? data.data.map(tag => tag.tag_name) : [];
            checkBlockedWords(getTitle(), tags);
        })
            .catch((error) => console.error('Error fetching video tags:', error));
    }

    // 检查标题和标签是否包含屏蔽关键词
    function checkBlockedWords(title, tags) {
        //调试用
        //alert('title: ' + title + '\n' + 'tags: ' + tags + '\n' + 'bvNumber: ' + bvNumber);

        // 将标题和标签转换为小写
        const allText = [title.toLowerCase(), ...tags.map(tag => tag.toLowerCase())].join(' ');

        for (const word of blockedWords) {
            if (typeof word === 'string' && word.trim() === '') {
                // 跳过空串的检查
                continue;
            }
            if (typeof word === 'string'&& !word.startsWith('/')) {
                if (allText.includes(word.toLowerCase())) {
                    if(showTips){
                        alert('Blocked by keyword: ' + word);
                    }
                    window.close();
                    window.stop();
                    window.location.href = 'about:blank';
                    return;
                }
            } else if (word.startsWith('/')) {
                // 修改正则表达式以不区分大小写
                const insensitiveWord = new RegExp(word.slice(1, -1), 'ius');
                if (insensitiveWord.test(allText)) {
                    if(showTips){
                        alert('Blocked by regex: ' + word);
                    }
                    window.close();
                    window.stop();
                    window.location.href = 'about:blank';
                    return;
                }
            }
        }
    }

    // 主逻辑
    function mainLogic() {
        // 获取当前页面的完整 URL
        const currentUrl = window.location.href;
        if (currentUrl.includes('/video/') || currentUrl.includes('/list/')) {
            const bvNumber = getBvNumber();
            if (bvNumber) {
                getVideoApiTags(bvNumber);
            } else {
                checkBlockedWords(getTitle(), []);
            }
        }}


    // 创建模态对话框
    function createModal() {

        // 从存储中加载关键词列表和时间设置
        getCustomValue();

        const modal = document.createElement('div');
        modal.id = 'keywordModal';
        modal.innerHTML = `
            <div id="modalContent">
                <h2>关键词列表</h2>
                <ul>
                    <li>每行一个关键词或正则，不区分大小写</li>
                    <li>请勿使用过于激进的关键词或正则</li>
                    <li>正则默认 ius 模式，无需 flag，语法：/abc小d+/</li>
                </ul>
                <textarea id="keywordList"></textarea>
                <div id="timeSelector">
                    <label><input type="checkbox" id="enableTimeRange" ${enableTimeRange ? 'checked' : ''}>&nbsp停用时段：&nbsp</label>
                    <div style="display: inline-block;margin-top: 5px;">
                        <input type="time" id="startTime" name="startTime" value="${startTime}">
                        <span>&nbsp-&nbsp</span>
                        <input type="time" id="endTime" name="endTime" value="${endTime}">
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                     <label><input type="checkbox" id="showTips" ${showTips ? 'checked' : ''}>&nbsp网页关闭提示&nbsp(仅提示,不会阻止网页关闭)</label>
                </div>
                <button id="saveButton">保存</button>
                <button id="closeButton">关闭</button>
                <div id="saveStatus">保存成功!</div>
            </div>
        `;

        // 填充文本域
        const keywordListTextArea = modal.querySelector('#keywordList');
        keywordListTextArea.value = blockedWords.join('\n');


        // 保存按钮事件
        modal.querySelector('#saveButton').addEventListener('click', () => {
            const newKeywords = keywordListTextArea.value.split('\n').map(line => {
                if (line.startsWith('/')) {
                    try {
                        new RegExp(line.slice(1, -1), 'ius');
                        return line
                    } catch (e) {
                        alert(`Invalid regex: ${line}`);
                        return null;
                    }
                }
                return line;
            }).filter(Boolean);

            const newStartTime = modal.querySelector('#startTime').value;
            const newEndTime = modal.querySelector('#endTime').value;
            const newEnableTimeRange = modal.querySelector('#enableTimeRange').checked;
            const newShowTips = modal.querySelector('#showTips').checked;

            GM_setValue('blockedWords', newKeywords);
            GM_setValue('startTime', newStartTime);
            GM_setValue('endTime', newEndTime);
            GM_setValue('enableTimeRange', newEnableTimeRange);
            GM_setValue('showTips', newShowTips);

            //alert("enableTimeRange:  " + newEnableTimeRange);

            const saveStatus = modal.querySelector('#saveStatus')
            saveStatus.style.color = "#00AEEC";


            // 定义一个变量来存储 setTimeout 的 ID
            let timeoutId = null;

            // 函数来设置定时器
            function setMyTimeout() {
                // 清除之前的定时器（如果存在）
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // 设置新的定时器
                timeoutId = setTimeout(() => {
                    setTimeout(() =>{saveStatus.style.color = "rgba(0,0,0,0)";
                                     mainLogic();
                                    },1200);
                }, 1200);
            }

            // 调用函数来设置定时器
            setMyTimeout();

        });

        // 关闭按钮事件
        modal.querySelector('#closeButton').addEventListener('click', () => {
            closeModal();
        });

        // 添加模态对话框到页面
        document.body.appendChild(modal);
    }

    // 关闭模态对话框
    function closeModal() {
        const modal = document.getElementById('keywordModal');
        if (modal) {
            modal.remove();
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('🔑 关键词设置', createModal);


    const style = document.createElement('style');
    style.innerHTML = `
    #keywordModal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    #modalContent {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 30%;
        max-width: 300px;
        min-width:240px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        font-size: 14px;
    }
    #modalContent h2 {
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 16px;
    }
    #modalContent ul {
        margin-bottom: 10px;
        font-size: 12px;
        color: #555555;
    }
    #modalContent #keywordList {
        max-width: 100%;
        width: 100%;
        height: 200px;
        box-sizing: border-box;
        padding: 6px;
        border-radius: 4px;
        border: 2px solid #D1D5DB;
        font-family: inherit;
    }
    #modalContent #timeSelector {
        padding: 10px 0;
    }
    #modalContent input {
        vertical-align: -1.5px;
    }
    /* 设置选中状态下的checkbox样式 */
    #modalContent input:checked {
        background-color: #00AEEC; /* 你可以更改这个颜色为你想要的颜色 */
    }

    #modalContent #startTime, #modalContent #endTime  {
            padding:0 4px;
            border-radius: 4px;
            border: 2px solid #D1D5DB;
            font-family: inherit;
        }
    #modalContent button {
        margin-top: 10px;
        padding: 5px 16px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
        outline: 2px solid #D1D5DB;
        font-size: 14px;
    }
    #modalContent #saveButton {
        margin-right: 10px;
        color: white;
        background-color: #00AEEC;
        outline: 2px solid #00AEEC;
    }
    #modalContent #saveStatus {
        float: right;
        margin-top: 10px;
        color: rgba(0,0,0,0);
        transition: all 0.2s ease-out;
        font-size: 16px;
    }
`;
    document.head.appendChild(style);

})();