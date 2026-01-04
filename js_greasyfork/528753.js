// ==UserScript==
// @name         Local Movie Search
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  在网页上添加输入框和按钮，搜索本地电影是否存在（需要配合Everything的HTTP服务器使用）。注：拖选要搜索的电影名再使用ALT+C快捷键可直接搜索。
// @author       huangmmd
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/528753/Local%20Movie%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/528753/Local%20Movie%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建输入框和按钮
    const input = document.createElement('input');
    input.placeholder = '输入电影名字';
    input.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    input.style.border = '2.2px solid #ccc'; // 2px * 1.1 = 2.2px
    input.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    input.style.marginRight = '4.84px'; // 4.4px * 1.1 = 4.84px
    input.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px

    const button = document.createElement('button');
    button.textContent = '搜索'; // 修改按钮文本为“搜索”
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px'; // 调整圆角大小
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px'; // 调整字体大小为12px
    button.style.padding = '6px 12px'; // 调整内边距
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#0056b3';
    });
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#007BFF';
    });

    // 创建用于显示结果的元素
    const resultDiv = document.createElement('div');
    resultDiv.style.color = '#333';
    resultDiv.style.marginBottom = '5px';
    resultDiv.style.fontSize = '13.552px'; // 修改字体大小为与输入框一致
    resultDiv.style.maxHeight = '200px'; // 设置最大高度
    resultDiv.style.overflowY = 'auto'; // 添加垂直滚动条

    // 创建用于触发搜索界面显示和隐藏的小方框按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '搜';
    toggleButton.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    toggleButton.style.backgroundColor = '#007BFF'; // 与搜索按钮颜色一致
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '19.36px'; // 17.6px * 1.1 = 19.36px
    toggleButton.style.left = '19.36px'; // 移动到左下角
    toggleButton.style.zIndex = 9999;
    toggleButton.addEventListener('click', function() {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        toggleButton.style.display = container.style.display === 'none' ? 'block' : 'none'; // 隐藏或显示“搜”字按钮
    });
    document.body.appendChild(toggleButton);

    // 将输入框、按钮和结果显示元素添加到页面左下角，并默认隐藏
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '19.36px'; // 17.6px * 1.1 = 19.36px
    container.style.left = '19.36px'; // 17.6px * 1.1 = 19.36px
    container.style.zIndex = 9999;
    container.style.backgroundColor = 'white';
    container.style.padding = '14.52px'; // 13.2px * 1.1 = 14.52px
    container.style.borderRadius = '7.744px'; // 7.04px * 1.1 = 7.744px
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    container.style.display = 'none'; // 默认隐藏搜索界面
    container.appendChild(resultDiv);
    container.appendChild(input);
    container.appendChild(button);
    document.body.appendChild(container);

    // 创建设置面板
    const settingsContainer = document.createElement('div');
    settingsContainer.style.position = 'fixed';
    settingsContainer.style.top = '50%';
    settingsContainer.style.left = '50%';
    settingsContainer.style.transform = 'translate(-50%, -50%)'; // 居中显示
    settingsContainer.style.zIndex = 9999;
    settingsContainer.style.backgroundColor = 'white';
    settingsContainer.style.padding = '15px';
    settingsContainer.style.borderRadius = '8px';
    settingsContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    settingsContainer.style.display = 'none'; // 默认隐藏设置面板

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '9.68px'; // 8.8px * 1.1 = 9.68px
    closeButton.style.right = '9.68px'; // 8.8px * 1.1 = 9.68px
    closeButton.style.padding = '4.84px 9.68px'; // 4.4px * 1.1 = 4.84px, 8.8px * 1.1 = 9.68px
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '11.616px'; // 10.56px * 1.1 = 11.616px
    closeButton.addEventListener('click', function() {
        settingsContainer.style.display = 'none';
    });
    settingsContainer.appendChild(closeButton);

    const settingsLabel = document.createElement('label');
    settingsLabel.textContent = '检索服务器地址: ';
    settingsLabel.style.display = 'block';
    settingsLabel.style.marginBottom = '4.84px'; // 4.4px * 1.1 = 4.84px

    const settingsInput = document.createElement('input');
    settingsInput.type = 'text';
    settingsInput.value = 'http://localhost:8080'; // 默认值
    settingsInput.style.width = '193.6px'; // 176px * 1.1 = 193.6px
    settingsInput.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    settingsInput.style.border = '2px solid #ccc';
    settingsInput.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    settingsInput.style.marginRight = '4.84px'; // 4.4px * 1.1 = 4.84px
    settingsInput.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px

    const settingsSaveButton = document.createElement('button');
    settingsSaveButton.textContent = '保存';
    settingsSaveButton.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    settingsSaveButton.style.backgroundColor = '#007BFF';
    settingsSaveButton.style.color = 'white';
    settingsSaveButton.style.border = 'none';
    settingsSaveButton.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    settingsSaveButton.style.cursor = 'pointer';
    settingsSaveButton.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px

    settingsContainer.appendChild(settingsLabel);
    settingsContainer.appendChild(settingsInput);
    settingsContainer.appendChild(settingsSaveButton);
    document.body.appendChild(settingsContainer);

    // 加载保存的服务器地址
    const savedUrl = localStorage.getItem('searchServerUrl');
    if (savedUrl) {
        settingsInput.value = savedUrl; // 恢复用户设置的地址
    }

    // 使用 GM_registerMenuCommand 创建设置菜单
    GM_registerMenuCommand('设置检索服务器地址', function() {
        settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 修改保存按钮逻辑，确保地址持久化并全局生效
    settingsSaveButton.addEventListener('click', function() {
        const newUrl = settingsInput.value.trim();
        if (newUrl) {
            localStorage.setItem('searchServerUrl', newUrl); // 持久化到 localStorage
            settingsContainer.style.display = 'none';
        } else {
            alert('请输入有效的检索服务器地址');
        }
    });

    // 在页面加载时同步检索服务器地址到输入框
    window.addEventListener('load', function() {
        const globalSavedUrl = localStorage.getItem('searchServerUrl');
        if (globalSavedUrl) {
            settingsInput.value = globalSavedUrl; // 确保所有页面加载时使用相同的地址
        }
    });

    // 创建新的设置面板
    const websiteSettingsContainer = document.createElement('div');
    websiteSettingsContainer.style.position = 'fixed';
    websiteSettingsContainer.style.top = '50%';
    websiteSettingsContainer.style.left = '50%';
    websiteSettingsContainer.style.transform = 'translate(-50%, -50%)'; // 居中显示
    websiteSettingsContainer.style.zIndex = 9999;
    websiteSettingsContainer.style.backgroundColor = 'white';
    websiteSettingsContainer.style.padding = '15px';
    websiteSettingsContainer.style.borderRadius = '8px';
    websiteSettingsContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    websiteSettingsContainer.style.display = 'none'; // 默认隐藏设置面板

    // 添加关闭按钮
    const websiteCloseButton = document.createElement('button');
    websiteCloseButton.textContent = '关闭';
    websiteCloseButton.style.position = 'absolute';
    websiteCloseButton.style.top = '9.68px'; // 8.8px * 1.1 = 9.68px
    websiteCloseButton.style.right = '9.68px'; // 8.8px * 1.1 = 9.68px
    websiteCloseButton.style.padding = '4.84px 9.68px'; // 4.4px * 1.1 = 4.84px, 8.8px * 1.1 = 9.616px
    websiteCloseButton.style.backgroundColor = '#dc3545';
    websiteCloseButton.style.color = 'white';
    websiteCloseButton.style.border = 'none';
    websiteCloseButton.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    websiteCloseButton.style.cursor = 'pointer';
    websiteCloseButton.style.fontSize = '11.616px'; // 10.56px * 1.1 = 11.616px
    websiteCloseButton.addEventListener('click', function() {
        websiteSettingsContainer.style.display = 'none';
    });
    websiteSettingsContainer.appendChild(websiteCloseButton);

    const websiteSettingsLabel = document.createElement('label');
    websiteSettingsLabel.textContent = '自动搜索网站列表 (每行一个URL): ';
    websiteSettingsLabel.style.display = 'block';
    websiteSettingsLabel.style.marginBottom = '4.84px'; // 4.4px * 1.1 = 4.84px

    const websiteSettingsTextarea = document.createElement('textarea');
    websiteSettingsTextarea.style.width = '300px'; // 设置宽度
    websiteSettingsTextarea.style.height = '100px'; // 设置高度
    websiteSettingsTextarea.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    websiteSettingsTextarea.style.border = '2px solid #ccc';
    websiteSettingsTextarea.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    websiteSettingsTextarea.style.marginRight = '4.84px'; // 4.4px * 1.1 = 4.84px
    websiteSettingsTextarea.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px

    // 加载保存的网站列表
    const savedWebsites = GM_getValue('autoSearchWebsites', '');
    websiteSettingsTextarea.value = savedWebsites;

    const websiteSettingsSaveButton = document.createElement('button');
    websiteSettingsSaveButton.textContent = '保存';
    websiteSettingsSaveButton.style.padding = '7.744px 11.616px'; // 7.04px * 1.1 = 7.744px, 10.56px * 1.1 = 11.616px
    websiteSettingsSaveButton.style.backgroundColor = '#007BFF';
    websiteSettingsSaveButton.style.color = 'white';
    websiteSettingsSaveButton.style.border = 'none';
    websiteSettingsSaveButton.style.borderRadius = '3.872px'; // 3.52px * 1.1 = 3.872px
    websiteSettingsSaveButton.style.cursor = 'pointer';
    websiteSettingsSaveButton.style.fontSize = '13.552px'; // 12.32px * 1.1 = 13.552px
    websiteSettingsSaveButton.addEventListener('click', function() {
        GM_setValue('autoSearchWebsites', websiteSettingsTextarea.value);
        websiteSettingsContainer.style.display = 'none';
    });

    websiteSettingsContainer.appendChild(websiteSettingsLabel);
    websiteSettingsContainer.appendChild(websiteSettingsTextarea);
    websiteSettingsContainer.appendChild(websiteSettingsSaveButton);
    document.body.appendChild(websiteSettingsContainer);

    // 使用 GM_registerMenuCommand 创建设置菜单
    GM_registerMenuCommand('设置自动搜索网站列表', function() {
        websiteSettingsContainer.style.display = websiteSettingsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 按钮点击事件处理函数
    function performSearch() {
        const movieName = input.value.trim();
        if (movieName) {
            // 检查电影名字是否包含“[]”或“《》”或“<>”符号
            const shouldSplit = !/[\[\]《》<>]/.test(movieName);

            // 根据检查结果决定是否将电影名字按空格拆分成多个部分
            const movieParts = shouldSplit ? movieName.split(' ') : [movieName];

            // 存储所有找到的电影和未找到的电影
            let allFoundMovies = [];
            let notFoundMovies = [];

            // 遍历每个部分进行搜索
            movieParts.forEach(part => {
                if (part) {
                    const searchUrl = `${settingsInput.value}/?s=${encodeURIComponent(part)}`;

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: searchUrl,
                        onload: function(response) {
                            // 修改 commonFormats 数组，增加对 .zip 和 .epub 格式的支持
                            const commonFormats = ['.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv', '.zip', '.epub'];
                            let foundMovies = [];
                            commonFormats.forEach(format => {
                                const regex = new RegExp(`[^\\s"']+${format}`, 'g');
                                let matches = response.responseText.match(regex);
                                if (matches) {
                                    foundMovies = foundMovies.concat(matches);
                                }
                            });

                            // 过滤掉包含 /favi 的结果
                            foundMovies = foundMovies.filter(movie => !movie.includes('/favi'));

                            // 将找到的电影添加到所有找到的电影数组中
                            if (foundMovies.length > 0) {
                                allFoundMovies = allFoundMovies.concat(foundMovies);
                            } else {
                                notFoundMovies.push(part);
                            }

                            // 显示所有找到的电影和未找到的电影
                            let resultText = '';
                            if (allFoundMovies.length > 0) {
                                resultText += '本地存在以下电影、漫画：<br>';
                                allFoundMovies.forEach(movie => {
                                    let decodedMovie = decodeURIComponent(movie);
                                    // 提取文件路径和文件名
                                    let filePath = decodedMovie.substring(0, decodedMovie.lastIndexOf('/'));
                                    let fileName = decodedMovie.substring(decodedMovie.lastIndexOf('/') + 1);
                                    // 设置 title 属性为文件名
                                    resultText += `<span title="${fileName}">${filePath}</span><br>`;
                                });
                            }
                            if (notFoundMovies.length > 0) {
                                if (allFoundMovies.length > 0) {
                                    resultText += '<br>';
                                }
                                resultText += '<span style="color: red;">本地不存在以下电影、漫画：</span><br>'; // 修改：标红显示
                                notFoundMovies.forEach(movie => {
                                    resultText += `<span style="color: red;">${movie}</span><br>`; // 修改：标红显示
                                });
                            }
                            resultDiv.innerHTML = resultText;

                            // 添加点击事件监听器，点击结果显示页的其他位置时清除结果显示
                            document.addEventListener('click', function clearResult(event) {
                                if (!resultDiv.contains(event.target)) {
                                    resultDiv.textContent = '';
                                    document.removeEventListener('click', clearResult);
                                }
                            });

                            // 根据结果显示情况设置自动消失
                        },
                        onerror: function() {
                            resultDiv.textContent = '请求失败，请检查 Everything 服务器是否正常运行';
                        }
                    });
                }
            });
        } else {
            resultDiv.textContent = '请输入电影名字';
        }
    }

    button.addEventListener('click', performSearch);

    // 绑定快捷键 ALT + C
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'c') {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                input.value = selectedText;
                // 显示搜索界面
                container.style.display = 'block';
                toggleButton.style.display = 'none'; // 隐藏“搜”字按钮
                // 模拟按钮点击事件进行搜索
                performSearch();
            }
        }
    });

    // 监听输入框内容变化
    input.addEventListener('input', function() {
        if (input.value.trim() === '') {
            container.style.display = 'none'; // 隐藏搜索页面
            toggleButton.style.display = 'block'; // 显示“搜”字按钮
        }
    });

    // 检查是否是豆瓣电影页面并提取电影名称
    function extractMovieNameFromDouban() {
        const movieNameElement = document.querySelector('span[property="v:itemreviewed"]');
        if (movieNameElement) {
            return movieNameElement.textContent.trim();
        }
        return null;
    }

    // 检查是否是漫画页面并提取漫画名称
    function extractMangaNameFromPage() {
        const mangaNameElement = document.querySelector('font.text_bglight_big');
        if (mangaNameElement) {
            return mangaNameElement.textContent.trim();
        }
        return null;
    }

    // 新增：检查页面是否存在 <h2>*****</h2> 元素并提取文件名
    function extractFileNameFromH2() {
        const h2Element = document.querySelector('h2');
        if (h2Element) {
            return h2Element.textContent.trim();
        }
        return null;
    }

    // 新增：检查页面是否存在 <span style="color:#CC0000;">*******</span> 元素并提取文件名
    function extractFileNameFromSpan() {
        const spanElement = document.querySelector('span[style="color:#CC0000;"]');
        if (spanElement) {
            return spanElement.textContent.trim();
        }
        return null;
    }

    // 自动填充并搜索电影或漫画名称
    function autoSearchDoubanMovie() {
        const currentUrl = window.location.href;
        const savedWebsites = GM_getValue('autoSearchWebsites', '');
        const websites = savedWebsites ? savedWebsites.split('\n').map(url => url.trim()) : [];

        // 新增：增加额外检查，确保 websites 列表有效且非空
        if (!websites || websites.length === 0 || websites.every(url => !url)) {
            console.log('自动搜索网站列表为空或无效，跳过自动搜索');
            return;
        }

        // 检查当前页面是否属于自动搜索网站列表
        if (websites.some(website => currentUrl.includes(website))) {
            if (currentUrl.includes('https://movie.douban.com/')) {
                const name = extractMovieNameFromDouban();
                if (name) {
                    input.value = name;
                    // 显示搜索界面
                    container.style.display = 'block';
                    toggleButton.style.display = 'none'; // 隐藏“搜”字按钮
                    performSearch();
                }
            } else {
                let name = extractFileNameFromSpan(); // 优先尝试提取 <span style="color:#CC0000;">*******</span> 元素中的文件名
                if (!name) {
                    name = extractMovieNameFromDouban();
                }
                if (!name) {
                    name = extractMangaNameFromPage();
                }
                if (!name) {
                    name = extractFileNameFromH2(); // 最后尝试提取 <h2> 元素中的文件名
                }
                if (name) {
                    input.value = name;
                    // 显示搜索界面
                    container.style.display = 'block';
                    toggleButton.style.display = 'none'; // 隐藏“搜”字按钮
                    performSearch();
                }
            }
        }
    }

    // 在页面加载完成后尝试自动搜索豆瓣电影或漫画
    window.addEventListener('load', function() {
        autoSearchDoubanMovie();
    });

    // 添加全局点击事件监听器
    document.addEventListener('click', function(event) {
        if (input.value.trim() === '' && !container.contains(event.target) && !toggleButton.contains(event.target)) {
            container.style.display = 'none'; // 隐藏插件页面
            toggleButton.style.display = 'block'; // 显示切换按钮
        }
    });

})();