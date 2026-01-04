// ==UserScript==
// @name         EYanIDE 自定义主题
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fetch JSON from a remote URL and convert it to an object
// @author       Your Name
// @match        http://121.36.38.167/
// @grant        GM_xmlhttpRequest
// @connect      github.moeyy.xyz
// @grant        GM_setValue
// @grant        GM_getValue 
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504645/EYanIDE%20%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/504645/EYanIDE%20%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==        

(function () {
    'use strict';
    // 移除命令行参数输入框
    document.getElementById("command-line-arguments").style.display = "none";

    if (GM_getValue("themeName") == undefined) {
        // 可以调用 GM_setValue 来设置一个值  
        GM_setValue("themeName", "GitHub Dark");
    }  

    const themeName = GM_getValue("themeName");
    loadTheme(themeName);

    // 添加设置按钮
    const menuPlace = document.querySelector("div.right.menu");
    const settingsBtn = document.createElement("div");
    settingsBtn.id = "settings";
    settingsBtn.classList = "ui inverted basic icon button";
    settingsBtn.innerHTML = `<i class="cog icon"></i>`;
    settingsBtn.style.marginLeft = "3px";
    menuPlace.children[1].appendChild(settingsBtn);

    // 添加设置 Modal
    const settingMenu = document.createElement("div");
    settingMenu.id = "settings-pannel";
    settingMenu.innerHTML = `  
<div class="header">加载主题</div>
<div class="scrolling content">
    <div class="ui action input" style="width:100%; margin-bottom:10px;">
        <input type="text" id="theme-name" value="GitHub Dark">
        <br/>
        <button id="theme-search" class="ui teal right labeled icon button">
            <i class="download icon"></i>
            获取
        </button>
    </div>
    <div id="settings-content" style="display: none;">
        <p><center>加载中...</center></p>
    </div>
    <div id="settings-content-loader" class="ui segment" style="height:400px;">
        <div class="ui active dimmer">
            <div class="ui indeterminate text loader">加载数据中...</div>
        </div>
        <p></p>
    </div>
</div>
`;
    settingMenu.className = "ui modal";
    document.querySelector("#site-content").appendChild(settingMenu);

    const ModalSettings = document.getElementById("settings-pannel");
    // 设置窗口的宽度和位置
    ModalSettings.style.width = "550px";
    ModalSettings.style.height = "auto"; // 固定高度
    ModalSettings.style.marginTop = "1%";
    ModalSettings.style.position = 'relative'; // 让它包含子元素的绝对定位

    document.querySelector("#theme-search").addEventListener("click", (event) => {
        loadTheme(document.querySelector("#theme-name").value);
    })

    document.querySelector("#settings").addEventListener("click", (event) => {
        $('#settings-pannel').modal('show');
    })

    // 设置内容区域可滚动
    const contentArea = ModalSettings.querySelector('.content-area');

    if (contentArea) {
        contentArea.style.overflowY = 'auto';  // 垂直滚动
        contentArea.style.height = '500px';    // 内容区域高度，减去按钮区高度
    }

    // 渲染 theme 列表
    function renderThemeList(data) {

        const fileListDiv = document.getElementById('settings-content');
        fileListDiv.innerHTML = '';

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const fileItemDiv = document.createElement('div');
                fileItemDiv.className = 'item';
                fileItemDiv.style.display = 'flex';
                fileItemDiv.style.alignItems = 'center';
                fileItemDiv.style.justifyContent = 'space-between';
                fileItemDiv.style.marginBottom = '10px';

                const fileName = document.createElement('div');
                fileName.classList.add('content');
                fileName.style.flexGrow = '1';

                const filename = data[key];

                // 创建包含文件名的容器
                const fileInfoDiv = document.createElement('div');
                fileInfoDiv.style.display = 'flex';
                fileInfoDiv.style.alignItems = 'center';

                // 添加文件名
                const fileTitle = document.createElement('span');
                fileTitle.textContent = filename;
                fileTitle.style.color = '#007bff';

                fileInfoDiv.appendChild(fileTitle);

                fileName.innerHTML = `
                                    ${fileInfoDiv.outerHTML}
                                `;

                const icon = document.createElement('i');
                icon.className = "large paint brush middle aligned icon";

                const fileManage = document.createElement('div');
                fileManage.className = "right floated content";
                fileManage.style.display = 'flex';
                fileManage.style.gap = '10px';

                const fileButton = document.createElement('div');
                fileButton.className = 'ui button theme-load-btn';
                fileButton.textContent = "加载";
                fileButton.style.writingMode = 'horizontal-tb';
                fileButton.style.whiteSpace = 'nowrap';
                fileButton.onclick = () => loadTheme(data[key]);

                fileManage.appendChild(fileButton);

                fileItemDiv.appendChild(icon);
                fileItemDiv.appendChild(fileName);
                fileItemDiv.appendChild(fileManage);
                fileListDiv.appendChild(fileItemDiv);

            }
        }
        const fileListLoader = document.getElementById('settings-content-loader');
        if (fileListLoader) {
            fileListLoader.style.display = "none";
            document.getElementById('settings-content').style.display = "";
        }
    }


    // 获取 theme 列表
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://github.moeyy.xyz/https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/themelist.json`,
        onload: function (response) {
            if (response.status === 200) {
                try {
                    const jsonData = JSON.parse(response.responseText);
                    renderThemeList(jsonData);
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                }
            } else {
                console.error('Failed to fetch data:', response.status, response.statusText);
            }
        },
        onerror: function (err) {
            console.error('Error fetching data:', err);
        }
    });

    // 根据名称加载 theme 文件内容
    function loadTheme(file) {
        const fileListLoader = document.getElementById('settings-content-loader');
        if (fileListLoader) {
            fileListLoader.style.display = "";
            document.getElementById('settings-content').style.display = "none";
        }
        GM_setValue("themeName", file);
        GM_xmlhttpRequest({
            method: "GET",
            url: encodeURI(`https://github.moeyy.xyz/https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/${file}.json`),
            onload: function (response) {
                const fileListLoader = document.getElementById('settings-content-loader');
                if (fileListLoader) {
                    fileListLoader.style.display = "none";
                    document.getElementById('settings-content').style.display = "";
                }
                if (response.status === 200) {
                    try {
                        const jsonData = JSON.parse(response.responseText);
                        console.log('Fetched JSON data:', jsonData);
                        monaco.editor.defineTheme("CustomTheme", jsonData);
                        monaco.editor.setTheme("CustomTheme");
                        document.querySelector("#theme-name").value = GM_getValue("themeName");
                        $('#settings-pannel').modal('hide');
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                    }
                } else {
                    console.error('Failed to fetch data:', response.status, response.statusText);
                }
                //document.querySelector("buttom.theme-load-btn").classList.remove("loading");
            },
            onerror: function (err) {
                console.error('Error fetching data:', err);
            }
        });
    }

})();