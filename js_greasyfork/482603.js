// ==UserScript==
// @name         谁是股批
// @name:en      who-is-browser-gamer
// @namespace    阿洛
// @version      0.3
// @description  在石之家用户名字右侧显示 Logs 查询图标
// @description:en Only for FFXIV CN Official Forum
// @author       阿洛
// @match        *://ff14risingstones.web.sdo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482603/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/482603/%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9.meta.js
// ==/UserScript==

// 参考：Lanyangzhi  https://greasyfork.org/zh-CN/scripts/482576-%E8%B0%81%E6%98%AF%E8%82%A1%E6%89%B9

const delay = 500;

(function() {

    function ProcessLocationIcon(startingIcon)
    {
        let parentElement = startingIcon.parentElement.parentElement.parentElement;

        let usernameElement = FindUsernameElement(parentElement);
        //console.log(`获取的用户名: ${usernameElement ? usernameElement.innerText : '未找到'}`);
        let server = FindServer(startingIcon);
        //console.log(`获取的服务器: ${server}`);

        if (usernameElement && server) {
            InsertLogsIcon(usernameElement, server)
        }
    }

    function FindUsernameElement(parentElement)
    {
        // 非个人页：第一个能被鼠标点击、仅包含文本的 span 元素
        let elements = parentElement.querySelectorAll('span.cursor');
        //console.log("找到的元素数量（非个人页）: ", elements.length);
        for (let element of elements)
        {
            if (element.childNodes.length == 1 && element.innerText.length >= 1 && element.innerText.length <= 6)
            {
                return element;
            }
        }

        // 个人页
        elements = parentElement.querySelectorAll('span.ft24.ftw');
        for (let element of elements)
        {
            if (element.childNodes.length == 1 && element.innerText.length >= 1 && element.innerText.length <= 6)
            {
                return element;
            }
        }

        return null;
    }

    /*
     * 结构 1：
     *     <i>
     *     <span>
     *         <span>区</span>
     *         <span>服</span>
     *     </span>
     * 结构 2：
     *     <i>
     *     <span>区 服</span>
     * 结构 3：
     *    <i>
     *    <span>区</span>
     *    <span>服</span>
     */
    function FindServer(startingIcon)
    {
        let element = startingIcon.nextElementSibling;
        if (element && element.querySelector('span'))
        {
            element = element.querySelector('span:first-child');
        }
        let text = element.textContent.trim();
        if (text.includes(' '))
        {
            return text.split(' ')[1];
        }
        else
        {
            return element.nextElementSibling ? element.nextElementSibling.textContent : '';
        }
    }

    function InsertLogsIcon(usernameElement, server)
    {
        var newNode = document.createElement('a');
        var username = usernameElement.innerText;
        newNode.id = 'ff-icon';
        newNode.href = `https://cn.fflogs.com/character/CN/${server}/${username}`;
        newNode.innerHTML = '<img src="https://assets.rpglogs.cn/img/ff/favicon.png" height="22px">';

        usernameElement.insertAdjacentElement('afterend', newNode);
        console.log(`FFLogs 图标已添加到：${username}@${server}`);
    }

    setInterval(function() {
        var elements = document.querySelectorAll('.icon-location.dwcolor'); // 搜索服务器前的图标作为定位特征

        elements.forEach(function(iconElement) {
            if (!iconElement.hasAttribute('data-logs-processed'))
            {
                ProcessLocationIcon(iconElement);
                iconElement.setAttribute('data-logs-processed', 'true'); // 标记已处理
            }
        });
    }, delay);
})();

