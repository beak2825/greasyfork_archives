// ==UserScript==
// @name         在搜索引擎中搜索思源笔记（SiYuan）
// @namespace    https://fradeet.top/
// @supportURL   https://github.com/Fradeet/SearchEngine-with-SiYuan-serach
// @version      2025-02-16
// @description  在搜索引擎侧栏，必应（Bing）和谷歌（Google），展示相同的关键词在思源笔记中的结果。
// @description:en Display results for the same keywords in the SiYuan Note in the search engine sidebar.
// @author       Fradeet
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFJSURBVDhPxZJPTsJAFMbntbXRA+iKhUESPQGmJaQB45pdwxE4gXHLMWTnlkQCBxDSQAobL6DEpNFNw86NyYh9vvnT2gqJxg2/zXvv63zfTKdlO8fUNeOxWi3x45Pzh5foWUuSu1rtMi6XeRRFb1qSGLpKhBlNcxKDNXDrFy0tsyfXbR0lOFgn1sTzvJKWJaBrZiahcmXt8xUAQwT/9vOdKvZjWnq9d2AzZEvLWDeCIHgVPnmCvFnMCrABsC/MNNhKI4BV8ieRAWgY3aI5BYTx25xCIR+J2RWtCgDYuMxfAfUBCpf4H7YG0OugbvNs0zYDEsTeCqFNLVeKhB8ybNOF9vScUQgQ5tPFojObjYeIzKdNRQhPAPyz+XwYTsednyFZQGpOjx9O70fiP5DmMBzJRfRMhjB2o2fF0nGaJJL3z4BTbzR1v1MY+wIHyIJUp2H/PgAAAABJRU5ErkJggg==
// @match        https://*.bing.com/search*
// @include      https://www.google.*/search?*
// @connect      127.0.0.1
// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/526841/%E5%9C%A8%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%AD%E6%90%9C%E7%B4%A2%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%EF%BC%88SiYuan%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526841/%E5%9C%A8%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%AD%E6%90%9C%E7%B4%A2%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%EF%BC%88SiYuan%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // console.log("GM_info", GM_info);
    // console.log("Window", window.location.href);
    // GM_getTab((tab) => console.log("Get Tab", tab));

    const currentURL = window.location.href;
    const currentDomain = currentURL.split('?')[0];

    // 获取本地存储配置
    // console.log("GM_getValue", GM_getValue("config"));
    let config = JSON.parse(GM_getValue("config", `{
        "Location": "local",
        "SiYuan": {
            "Endpoint": "http://127.0.0.1:6806/",
            "Token": ""
        }
    }`));

    // 插入样式
    const style = document.createElement('style');
    style.innerHTML = `
        #siyuan-search {
            margin-top: 1em;
        }
        #siyuan-search-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #siyuan-search-list li {
            margin-bottom: 0.5em;
        }
        
        #siyuan-search li:hover {
            background-color: #f5f5f5;
        }
            
        #siyuan-search li a {
            text-decoration: none;
            color: #0078d7;
        }
            
        #siyuan-search li a:hover {
            text-decoration: underline;
        }
         
        #siyuan-search ul {
            list-style-type: none;
        }

        #donate-button {
            margin-left: 1em;
        }
            
        #setting-button {
            margin-left: 1em;
        }

        .siyuan-search-info {
            display: flex;
            color: #71777d
        }

        .siyuan-updated {
            margin-left: auto;
        }

        .siyuan-search-item {
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
            padding: 10px;
            position: relative;
        }

        .siyuan-search-title {
            display: -webkit-box;
            -webkit-box-orient: vertical; 
            -webkit-line-clamp: 2; /* 设置你想要的行数 */
            overflow: hidden;
            margin-bottom: 0.5em;
        }
            
        .siyuan-hpath {
            background-color: rgba(55, 53, 47, 0.06);
            border-radius: 1em;
            max-width: 70%;
            white-space: nowrap; /* 防止文本换行 */
            overflow: hidden; /* 隐藏溢出的文本 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的文本 */
            direction: rtl; /* 文本从右到左排列 */
            text-align: left; /* 将文本对齐方式设置为左对齐 */
            font-size: 0.8em;
        }

        #siyuan-search-header img {
            width: 2em;
            height: 2em;
            align-items: center; /* 垂直居中 */

        }         
        
        #siyuan-search-header div {
            align-items: center; /* 垂直居中 */
        }

        #siyuan-related-list li {
            margin-bottom: 0.5em;
        }

        .siyuan-search-sidepanel {
            grid-column: span 7/-2;
        }
        `;
    document.head.appendChild(style);

    const bodyHTML = `
            <div id="siyuan-search-header" style="display: flex;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFJSURBVDhPxZJPTsJAFMbntbXRA+iKhUESPQGmJaQB45pdwxE4gXHLMWTnlkQCBxDSQAobL6DEpNFNw86NyYh9vvnT2gqJxg2/zXvv63zfTKdlO8fUNeOxWi3x45Pzh5foWUuSu1rtMi6XeRRFb1qSGLpKhBlNcxKDNXDrFy0tsyfXbR0lOFgn1sTzvJKWJaBrZiahcmXt8xUAQwT/9vOdKvZjWnq9d2AzZEvLWDeCIHgVPnmCvFnMCrABsC/MNNhKI4BV8ieRAWgY3aI5BYTx25xCIR+J2RWtCgDYuMxfAfUBCpf4H7YG0OugbvNs0zYDEsTeCqFNLVeKhB8ybNOF9vScUQgQ5tPFojObjYeIzKdNRQhPAPyz+XwYTsednyFZQGpOjx9O70fiP5DmMBzJRfRMhjB2o2fF0nGaJJL3z4BTbzR1v1MY+wIHyIJUp2H/PgAAAABJRU5ErkJggg==" alt="SiYuan"></img>
                <div style="display: flex;">
                    <div>SiYuan 搜索</div>
                </div>
                <div style="margin-left: auto; display: flex;">
                    <div id="donate-button">
                        <a href="https://afdian.com/a/fradeet" target="_blank">
                            ❤️
                        </a>
                    </div>
                    <button id="setting-button">
                        设置
                    </button>
                </div>
            </div>
            <div style="display: none;" id="siyuan-setting">
                <label>思源笔记位置:</label>
                <select id="location" name="location">
                    <option value="local">本地</option>
                    <option value="remote">远程</option>
                </select>
                <br>
                <label for="url">地址:</label>
                <input type="text" id="url" name="url" required>
                <br>
                <label for="token">Token:</label>
                <input type="password" id="token" name="token" required>
                <br>
                <div id="setting-log" style="margin-top: 1em;"></div>
                <button id="save-button">保存</button>
            </div>
            <div id="siyuan-search">
                <ul id="siyuan-search-list">
                </ul>
                <div id="middle-line">
                    <hr />
                    <div style="margin-bottom: 1em;">可能相关的笔记:</div>
                </div>
                <ul id="siyuan-related-list">
                </ul>
            </div>
            <div id="bottom-panel">
            </div>
            `;

    // 从 URL 获取搜索词
    const searchInput = document.querySelector('[name="q"]').value;

    // 判断是 bing 还是 google
    if (currentDomain.includes('bing')) {
        // 创建一个 li
        let body = document.createElement('li');
        body.style.cssText = 'margin-bottom: 2em;';

        body.innerHTML = bodyHTML;
        
        const sidePanel = document.getElementById("b_context");
        sidePanel.insertBefore(body, sidePanel.firstChild);

    } else if (currentDomain.includes('google')) {
        
        // 检测是否创建了侧栏
        if (document.getElementById("rhs") === null) {
            const sidePanel = document.createElement("div");
            sidePanel.id = "rhs";

            sidePanel.classList.add("siyuan-search-sidepanel");

            document.getElementById("center_col").parentElement.appendChild(sidePanel);
        }
        let body = document.createElement('div');
        body.style.cssText = 'margin-bottom: 2em;';

        body.innerHTML = bodyHTML;
        
        const sidePanel = document.getElementById("rhs");
        sidePanel.insertBefore(body, sidePanel.firstChild);
    }

    

    const title_ul = document.querySelector("#siyuan-search-list")
    const related_ul = document.querySelector("#siyuan-related-list")

    let setting_button = document.getElementById("setting-button");
    let setting = document.querySelector("#siyuan-setting");
    setting_button.onclick = () => {
        setting.style.display = 'inline';
    }

    // 将现有配置填入
    if (config.SiYuan !== undefined) {
        if (config.Location === "local") {
            document.getElementById("location").value = "local";
            document.getElementById("url").disabled = true;
        } else {
            document.getElementById("location").value = "remote";
        }
        document.getElementById("url").value = config.SiYuan.Endpoint;
        document.getElementById("token").value = config.SiYuan.Token;
    }

    // TODO 选择远程的时候弹出提示，提示可能需要 Tampermonkey 允许跨域


    // 监听设置，如果是本地则服务器输入框禁用
    document.getElementById("location").onchange = () => {
        if (document.getElementById("location").value === "local") {
            document.getElementById("url").disabled = true;
        } else {
            document.getElementById("url").disabled = false;
        }
    }

    document.getElementById("save-button").onclick = () => {
        let location = document.getElementById("location").value;
        if (location === "local") {
            config.Location = "local";
            config.SiYuan.Endpoint = "http://127.0.0.1:6806";
        } else {
            config.Location = "remote";
            config.SiYuan.Endpoint = document.getElementById("url").value;
        }
        config.SiYuan.Token = document.getElementById("token").value;
        GM_setValue("config", JSON.stringify(config));
        document.getElementById("setting-log").innerHTML = `
            <div style="color: green;">保存成功，刷新生效。</div>
        `;
        setTimeout(() => {
            document.getElementById("setting-log").innerHTML = '';
        }, 2000);
    }

    const ErrorPage = (code) => {
        document.getElementById("middle-line").style.display = 'none';
        title_ul.appendChild(document.createTextNode(`连接 SiYuan 失败。${code ? `错误码: ${code}` : ''}`));
    }

    if (config.SiYuan.Token !== "") {
        console.log("[SiYuan Search] CheckConnect");
        const checkUrl = new URL('/api/system/version', config.SiYuan.Endpoint);
        GM_xmlhttpRequest({
            method: 'POST',
            url: checkUrl.href,
            responseType: 'json',
            onload: function (res) {
                if (res.status == 200 && res.response.code === 0) {
                    console.log("[SiYuan Search] Connect success, SiYuan version: ", res.response.data);

                    const sqlUrl = new URL('/api/query/sql', config.SiYuan.Endpoint);
                    // SQL 搜索
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: sqlUrl.href,
                        data: JSON.stringify({
                            "stmt": `SELECT id, content, hpath, updated, root_id
                                FROM blocks 
                                WHERE content
                                LIKE '%${searchInput}%' 
                                ORDER BY 
                                sort ASC, 
                                updated DESC;`
                        }),
                        Headers: {
                            "Authorization": "Token " + config.SiYuan.Token
                        },
                        responseType: 'json',
                        onload: function (res) {
                            if (res.status === 200 && res.response.code === 0) {
                                console.log(`[SiYuan Search] Search '${searchInput}' success, result: `, res.response.data);
                                // 以标题成功匹配的列表
                                let note_list = [];
                                // 以块成功匹配的对象，用于存放查询到的笔记标题
                                let block_list = [];
                                // 渲染页面
                                res.response.data.forEach((e) => {
                                    let li = document.createElement('li');
                                    // 判断是否文档块
                                    if (e.root_id === e.id) {
                                        li.classList.add('siyuan-search-item');
                                        note_list.push(e.root_id);
                                        if (config.Location === "local") {
                                            li.innerHTML = `<a href="siyuan://blocks/${e.root_id}" target="_blank">
                                            <div class="siyuan-search-title">${e.content}</div>
                                            </a>
                                            <div class="siyuan-search-info">
                                                <div class="siyuan-updated">时间：${e.updated.substring(0, 8)}</div>
                                            </div>`;
                                        } else if (config.Location === "remote") {
                                            li.innerHTML = `<a href="${config.SiYuan.Endpoint}?id=${e.root_id}&focus=true" target="_blank">
                                            <div class="siyuan-search-title">${e.content}</div>
                                            </a>
                                            <div class="siyuan-search-info">
                                                <div class="siyuan-updated">时间：${e.updated.substring(0, 8)}</div>
                                            </div>`;
                                        }
                                        title_ul.appendChild(li);
                                    } else {
                                        if (note_list.includes(e.root_id) === false && block_list.includes(e.root_id) === false) {
                                            const attrUrl = new URL('/api/attr/getBlockAttrs', config.SiYuan.Endpoint);

                                            // 获取块的笔记名字
                                            GM_xmlhttpRequest({
                                                method: 'POST',
                                                url: attrUrl.href,
                                                data: JSON.stringify({
                                                    "id": e.root_id,
                                                }),
                                                Headers: {
                                                    "Authorization": "Token " + config.SiYuan.Token
                                                },
                                                responseType: 'json',
                                                onload: function (res) {
                                                    if (res.status === 200 && res.response.code === 0) {
                                                        // 渲染到页面
                                                        li.innerHTML = `<a href="${config.SiYuan.Endpoint}?id=${e.root_id}&focus=true" target="_blank">
                                                        <div>${res.response.data.title}</div>
                                                        </a>`;
                                                        related_ul.appendChild(li);

                                                    }
                                                },
                                            });
                                            // 标记这个笔记已经显示了，放里面会有异步
                                            block_list.push(e.root_id);
                                        }
                                    }
                                });
                            } else {
                                console.error("[SiYuan Search] Response issue: ", res);
                                ErrorPage(res.response.code);
                            }
                        },
                        onerror: function () {
                            console.error("[SiYuan Search] Search failed.");
                        }
                    });
                } else {
                    console.error("[SiYuan Search] Response issue: ", res);
                    ErrorPage(res.response.code);
                }
            },
            onerror: function () {
                console.error("[SiYuan Search] Connect failed.");
                ErrorPage();
            }
        });
    } else {
        console.log("[SiYuan Search] Please configure the connection information.");
        // 展开设置页面
        setting.style.display = 'inline';
        document.getElementById("middle-line").style.display = 'none';
        title_ul.appendChild(document.createTextNode(`请先登录。`));
    }
})();
