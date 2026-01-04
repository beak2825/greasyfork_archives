// ==UserScript==
// @name         SharePoint 用户查询
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license    GPL-3.0-only
// @description  输入关键字查询SharePoint用户详细信息和查看该用户所有文章，方便确认作者身份。按 Ctrl+Q 激活功能。
// @author       Kingron
// @match        https://*.sharepoint.com/sites/*
// @match        https://*.sharepoint.cn/sites/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharepoint.com
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524686/SharePoint%20%E7%94%A8%E6%88%B7%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/524686/SharePoint%20%E7%94%A8%E6%88%B7%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
        td.ms-vb2 {
            max-width: 400px !important;
        }
    `);

    GM_addStyle(`
        .a_f_cb6f7c2e:not(.b_f_cb6f7c2e):not(.z_f_cb6f7c2e) {
            margin: 0px 0 !important;
        }
    `);

    GM_addStyle(`
        .ms-list-TitleLink {
            min-width: 400px !important;
        }
    `);

    // 监听所有资源加载
    (new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name.includes("SP.UserProfiles.")) {
                const div = document.querySelector('div[data-automation-id="personaDetails"] div.peopleName');
                if (div.innerText.indexOf(">") > 0) return;
                let mail = entry.name.split("membership%7C")[1]?.split("%27")[0] || "";
                mail = decodeURIComponent(mail);
                console.log("获取到作者信息: ", mail);
                div.innerText += "<" + mail + ">";
                return;
            }
        });
    })).observe({ entryTypes: ["resource"] });

    function getUserInfo(id) {
        const siteName = getSiteNameFromURL();
        const apiUrl = `/sites/${siteName}/_api/web/GetUserById(${id})`;
        const headers = {
            "Accept": "application/json"
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: headers,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    resolve(data);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function getWikiAuthor() {
        const siteName = getSiteNameFromURL();
        const apiUrl = `/sites/${siteName}/_api/web/getfilebyserverrelativeurl('${window.location.pathname}')/ListItemAllFields?$select=AuthorId`
        const headers = {
            "Accept": "application/json"
        };

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: headers,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const user = data.AuthorId;
                getUserInfo(user).then(user => {
                    console.log("用户信息：", user);
                    const element = document.querySelector('h1#pageTitle.ms-core-pageTitle');
                    if (element) {
                        const node = document.createElement('div');
                        element.appendChild(node);
                        node.outerHTML = `<div style="float: right;font-size:20px;position: relative;transform: translateY(50%);" title="${user.LoginName}">Author: ${user.Title}&lt;${user.Email}&gt;</div>`;
                    }
                }).catch(err => {
                    console.error("请求失败：", err);
                });
            },
            onerror: function(error) {
                alert("请求失败！请稍后再试。");
            }
        });
    }
    getWikiAuthor();

    // 监听 Ctrl+Q 快捷键
    window.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            event.preventDefault(); // 阻止默认行为

            const keyword = prompt("请输入关键字进行搜索：");
            if (keyword) {
                const siteName = getSiteNameFromURL(); // 获取当前 SharePoint 站点名称
                console.log("SharePoint站点名称: ", siteName);
                if (siteName) {
                    searchUsers(siteName, keyword);
                } else {
                    alert("无法从 URL 获取 SharePoint 站点名！");
                }
            }
        }
    });

    // 从当前 URL 中提取 SharePoint 站点名称，支持 .com 和 .cn 域名
    function getSiteNameFromURL() {
        // 优先匹配 sharepoint.com/sites/xxx/bbb/.../SitePages 或 sharepoint.cn/sites/xxx/bbb/.../SitePages
        let regex = /https:\/\/.*\.sharepoint\.(com|cn)\/sites\/(.*)\/(SitePages|_layouts|Lists|Shared%20Documents|SiteAssets|Pages)/;
        let match = window.location.href.match(regex);

        // 如果能匹配到 SitePages 结构，则返回匹配到的 xxx/bbb/... 部分
        if (match) {
            return match[2]; // match[2] 为 sites/后面到 /SitePages 之前的所有内容
        }

        regex = /https:\/\/.*\.sharepoint\.(com|cn)\/sites\/([^\/?]+)/;
        match = window.location.href.match(regex);
        return match ? match[2] : null;
    }

    function copyTable(tableElement) {
        const range = document.createRange();
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.selectNode(tableElement);
        selection.addRange(range);
        try {
            document.execCommand('copy');
            alert('表格已复制到剪切板！');
        } catch (err) {
            alert('复制失败:' + err);
        }
        selection.removeAllRanges();
    }

    // 调用 SharePoint API 获取用户数据
    function searchUsers(siteName, keyword) {
        const apiUrl = `/sites/${siteName}/_api/Web/SiteUsers`;
        const headers = {
            "Accept": "application/json"
        };

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: headers,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const users = data.value || [];

                // 过滤匹配关键字的用户
                const regex = new RegExp(keyword, 'i'); // 'i' 表示不区分大小写
                const filteredUsers = users.filter(user => {
                    return regex.test(user.Title) || regex.test(user.Email) || regex.test(user.UserPrincipalName);
                });

                if (filteredUsers.length === 0) {
                    alert("没有找到匹配的用户。");
                } else {
                    displayResults(siteName, filteredUsers);
                }
            },
            onerror: function(error) {
                alert("请求失败！请稍后再试。");
            }
        });
    }

    // 在页面上展示搜索结果
    function displayResults(site, users) {
        const container = document.createElement('div');

        container.innerHTML = `
        <div tabindex=0 style="max-width:90%; max-height:70%;position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); overflow:hidden; background-color:#fff; border:1px solid #ccc; border-radius:8px; box-shadow:0 0 10px rgba(0, 0, 0, 0.3); padding:10px; z-index: 9999; display:flex; flex-direction:column;}">
            <div style="flex: 1; overflow-y: auto">
                <style>
                    #_rl_table td { padding: 5px; border-bottom: 1px solid #ddd; }
                    #_rl_table a { text-decoration: none; }
                </style>
                <table id="_rl_table" style="width: 100%; border-collapse: collapse; background-color: #fff; border: 1px solid #ddd; border-radius: 5px;">
                    <thead style="position: sticky; top: 0; background-color: #f8f8f8;">
                        <tr>
                            <th>Title</th>
                            <th>Email</th>
                            <th>UserPrincipalName</th>
                            <th>Files</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td><a href="/sites/${site}/SitePages/Forms/AllPages.aspx?view=7&q=author:%20*&useFiltersInViewXml=0&viewpath=/sites/${site}/SitePages/Forms/AllPages.aspx&FilterField1=Editor&FilterValue1=${user.Title}&FilterField1=DocIcon&FilterValue1=aspx&FilterType1=Computed&FilterOp1=In&FilterField2=Author&FilterValue2=${user.Title}&FilterType2=User&FilterOp2=In" target="_blank">${user.Title}</a></td>
                                <td><a href="mailto:${user.Email}">${user.Email}</a></td>
                                <td><a href="${user['odata.id']}" target="_blank">${user.UserPrincipalName}</a></td>
                                <td><a href='/sites/${site}/_layouts/15/search.aspx/siteall?oobRefiners={"FileType":["pptx","docx","xlsx","one","pdf","video","html"]}&q=author:${user.Title}&scope=site' target="_blank">List</a></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="padding-top:10px; display: flex; align-items: center; justify-content: flex-end">按 Esc 关闭&nbsp;&nbsp;
                <button id="copyButton" style="padding: 10px 10px; background-color: #3CB371; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;outline: none;">复制表格</button>&nbsp;
                <button id="closeButton" style="padding: 10px 10px; background-color: #ff4d4f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;outline: none;">关闭</button>
            </div>
        </div>
        `;
        document.body.appendChild(container);

        const copyButton = container.querySelector('#copyButton');
        copyButton.addEventListener('click', function() {
            copyTable(document.getElementById('_rl_table'));
        });

        const closeButton = container.querySelector('#closeButton');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(container);
        });
        container.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') { document.body.removeChild(container); };
        });
        closeButton.focus();
    }
})();
