// ==UserScript==
// @name         语雀知识库列表
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  快速切换语雀知识库，请将脚本内所有的 itviewer 替换为你的用户名，token 替换为你的 Access Token
// @author       itviewer
// @match        https://www.yuque.com/itviewer/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/455661/%E8%AF%AD%E9%9B%80%E7%9F%A5%E8%AF%86%E5%BA%93%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455661/%E8%AF%AD%E9%9B%80%E7%9F%A5%E8%AF%86%E5%BA%93%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // let url = window.location.href;
    // console.log(url)
    GM_addStyle(".selection-helper-toolbar,#present-btn,.lake-title-marks-add-control,.book-title-marks-input > span { display: none !important; }");
    GM_addStyle('#ai-assistant-btn,div[class^="ViewerHeader-module_offlineButton"],#siteTipGuide > div:last-child { display: none;}');

    function getRepos() {
        let url = 'https://www.yuque.com/api/v2/users/itviewer/repos'
        let token = 'RSqVJxC0TLBhL6NDGBHELXRjGOsYcLkb76Sy2cNB' // 语雀开发者 token，建议最小权限

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "X-Auth-Token": token
            },
            responseType: 'json',
            onerror: function(response) { console.log("获取知识库失败") },
            ontimeout: function(response) { console.log("获取知识库超时") },
            onload: function(response) {
                if (response.response.status == 304 || response.response.data !== undefined) {
                    renderSidebar(response.response.data);
                    renderButton();
                } else {
                    console.log(response.responseText);
                }
            }
        });
    }

    function renderSidebar(repos) {
        const ul = document.createElement("ul");
        ul.setAttribute(
            "class",
            "ant-menu aside-container menu-site ant-menu-light ant-menu-root ant-menu-inline"
        );
        ul.setAttribute(
            "style",
            "height: 90%; overflow-y: auto"
        );

        const fragment = document.createDocumentFragment();

        if (Array.isArray(repos) && repos.length) {
            repos.forEach((item)=> {
                // console.log(item.name + ' ' + item.namespace);
                const li = document.createElement("li");
                li.setAttribute("class", `ant-menu-item ant-menu-item-only-child`);
                li.setAttribute("style", "width: 100%; height: 25px; line-height: 25px;");
                li.innerHTML = `<a href="https://www.yuque.com/${item.namespace}" target="_blank" title="${item.name}" style="overflow: hidden;text-overflow: ellipsis;">${item.name}</a>`;
                fragment.appendChild(li);
            })
        }
        ul.appendChild(fragment);

        const container = document.createElement("div");
        container.setAttribute("id", "reposidebar");
        container.setAttribute(
            "style",
            "display: none; overflow: hidden; position: fixed; top: 50px; left: 0; width: 280px; height: 100%; max-height: 100vh; z-index: 999;"
        );
        container.appendChild(ul);
        document.body.appendChild(container);
    }

    function renderButton() {
        const reposidebar = document.querySelector("#reposidebar");

        const header = document.querySelector("#asideHead>div:first-child");
        // console.log(header);
        const button = document.createElement("button");
        button.setAttribute("class", `ant-btn ant-btn-primary`);
        button.innerHTML = '<span>显示知识库列表</span>';

        button.onclick = function() {
            if (reposidebar.style.display == 'none') {
                reposidebar.style.display="inline";
                button.innerHTML = '<span>隐藏知识库列表</span>';
            } else {
                reposidebar.style.display="none";
                button.innerHTML = '<span>显示知识库列表</span>';
            }
        };
        header.appendChild(button);
    }

    // 虽然默认在文档加载完后执行，但我们需要的网页内容 header 是加载完动态创建的
    setTimeout(function(){
        getRepos();
    }, 500);

})();