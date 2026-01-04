// ==UserScript==
// @name         豆瓣影视信息助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取豆瓣影视信息并填入TinyMCE编辑器
// @author       Your name
// @match        http://38.207.133.22/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      douban.com
// @connect      ap.aizd.xyz
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528113/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528113/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素出现的通用函数
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        
        function checkElement() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }
            
            if (Date.now() - startTime >= timeout) {
                console.log('等待元素超时:', selector);
                return;
            }
            
            setTimeout(checkElement, 100);
        }
        
        checkElement();
    }

    // 等待TinyMCE编辑器加载完成
    function waitForTinyMCE(callback) {
        console.log('等待TinyMCE加载...');
        
        // 首先等待textarea元素出现
        waitForElement('textarea#message', function(textarea) {
            console.log('找到textarea元素');
            
            // 然后等待tinymce对象加载
            function checkTinyMCE() {
                if (typeof tinymce !== 'undefined') {
                    console.log('TinyMCE对象已加载');
                    
                    // 等待编辑器实例初始化
                    function checkEditor() {
                        const editor = tinymce.get('message');
                        if (editor && editor.initialized) {
                            console.log('编辑器实例已初始化');
                            callback(editor);
                        } else {
                            setTimeout(checkEditor, 100);
                        }
                    }
                    
                    checkEditor();
                } else {
                    setTimeout(checkTinyMCE, 100);
                }
            }
            
            checkTinyMCE();
        });
    }

    // 添加豆瓣插件到TinyMCE
    function addDoubanPlugin(editor) {
        console.log('开始添加豆瓣插件...');
        
        try {
            // 等待编辑器完全加载并添加按钮
            function addButton() {
                // 查找工具栏组
                const toolbarGroups = document.querySelectorAll('[role="toolbar"]');
                if (!toolbarGroups || toolbarGroups.length === 0) {
                    console.log('工具栏未找到，1秒后重试...');
                    setTimeout(addButton, 1000);
                    return;
                }

                // 使用最后一个工具栏组
                const toolbar = toolbarGroups[toolbarGroups.length - 1];
                console.log('找到工具栏');

                // 创建按钮组容器
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'tox-toolbar__group';

                // 创建按钮
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'tox-tbtn';
                button.title = '获取豆瓣信息';
                button.setAttribute('aria-label', '获取豆瓣信息');
                button.setAttribute('tabindex', '-1');
                button.setAttribute('aria-disabled', 'false');

                // 创建按钮文本
                const buttonSpan = document.createElement('span');
                buttonSpan.className = 'tox-tbtn__select-label';
                buttonSpan.textContent = '获取豆瓣信息';
                button.appendChild(buttonSpan);

                // 添加点击事件
                button.onclick = function() {
                    console.log('点击豆瓣按钮');
                    editor.windowManager.open({
                        title: '获取豆瓣影视信息',
                        body: {
                            type: 'panel',
                            items: [{
                                type: 'htmlpanel',
                                html: '<p style="font-size: 12px; margin-bottom: 5px;">影视名称获取：直接输入影视名称然后点获取，再点击海报即可</p><p style="font-size: 12px; margin-bottom: 5px;">豆瓣影视ID获取：豆瓣电影链接https://movie.douban.com/subject/<span style="color: red;font-weight: 600;">1292052</span></p>'
                            }, {
                                type: 'input',
                                name: 'movieName',
                                label: '输入电影名称或豆瓣ID'
                            }]
                        },
                        buttons: [{
                            type: 'cancel',
                            text: '取消'
                        }, {
                            type: 'submit',
                            text: '获取',
                            primary: true
                        }],
                        onSubmit: function(api) {
                            handleSubmit(api, editor);
                        }
                    });
                };

                // 将按钮添加到按钮组
                buttonGroup.appendChild(button);

                // 将按钮组添加到工具栏
                toolbar.appendChild(buttonGroup);
                console.log('按钮已添加到工具栏');
            }

            // 开始尝试添加按钮
            addButton();
            
            console.log('豆瓣插件添加完成');
        } catch (error) {
            console.error('添加插件时出错:', error);
        }
    }

    // 修改handleSubmit函数，接收editor参数
    function handleSubmit(api, editor) {
        const data = api.getData();
        const searchText = data.movieName.trim();
        const isDoubanId = /^\d+$/.test(searchText);
        
        const loadingDialog = editor.windowManager.open({
            title: '获取中',
            body: {
                type: 'panel',
                items: [{
                    type: 'htmlpanel',
                    html: '<p>正在获取豆瓣信息，请稍候...</p>'
                }]
            },
            buttons: [],
            onClose: () => api.close()
        });

        // 根据输入类型选择不同的API
        const apiUrl = isDoubanId 
            ? `https://ap.aizd.xyz/douban/?id=${searchText}&key=demo123123` 
            : `https://ap.aizd.xyz/douban/search.php?keyword=${encodeURIComponent(searchText)}&key=demo123123`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Accept': 'application/json'
            },
            onload: function(response) {
                loadingDialog.close();
                const result = JSON.parse(response.responseText);
                
                if (result.code === 200) {
                    if (isDoubanId) {
                        insertMovieInfo(result.data);
                    } else {
                        showSearchResults(result.data);
                    }
                } else {
                    editor.notificationManager.error('获取信息失败');
                }
                api.close();
            },
            onerror: function() {
                loadingDialog.close();
                editor.notificationManager.error('网络请求失败');
                api.close();
            }
        });
    }

    // 插入电影信息到编辑器
    function insertMovieInfo(data) {
        let jisu = '';
        if (data.vod_jisu !== null && data.vod_jisu !== undefined && data.vod_jisu !== '') {
            jisu = `<span class="info-title mr-3">集数：${data.vod_jisu}</span>`;
        }

        let duration = '';
        if (data.vod_duration) {
            duration = `<span class="info-title mr-3">影片时长：${data.vod_duration}</span>`;
        }

        let scoreHTML = '';
        if (data.vod_score !== null && data.vod_score !== '') {
            scoreHTML = `<strong>${data.vod_score}</strong>`;
        } else {
            scoreHTML = '<strong>暂无</strong>';
        }

        const content = `
            <div class="row">
                <div class="col-3">
                    <div class="site-pic mb-3">
                        <img title="${data.vod_name}" src="https://image.baidu.com/search/down?url=${data.vod_pic}" class="rounded img-fluid">
                    </div>
                </div>
                <div class="col-9 mt-4 mt-sm-0">
                    <div class="site-body text-sm">
                        <div class="tl"> 
                            <span class="site-name h3 my-3">${data.vod_name}</span>
                            <span class="text-muted">(${data.vod_year})</span>
                        </div>
                        <ul class="list-unstyled">
                            <li class="my-2">
                                <span class="info-title mr-3">类型：</span>${data.vod_class}
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">导演：</span>${data.vod_director}
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">主演：</span>${data.vod_actor}
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">地区：</span>${data.vod_area}
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">上映日期：</span>${data.vod_pubdate}
                                ${jisu}
                                ${duration}
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">豆瓣ID：</span>
                                <span class="mr-2">
                                    <a href="${data.vod_doubanid_url}" target="_blank" rel="nofollow">${data.vod_douban_id}</a>
                                    <i></i>
                                </span>
                                <span class="info-title mr-3">IMDbID：</span>
                                <span class="mr-2">
                                    <a href="${data.vod_imdb_url}" target="_blank" rel="nofollow">${data.vod_IMDb}</a>
                                    <i></i>
                                </span>
                            </li>
                            <li class="my-2">
                                <span class="info-title mr-3">又名：</span>${data.vod_sub}
                            </li>
                        </ul>
                        <div class="score">
                            ${scoreHTML}
                            <span>豆瓣评分</span>
                        </div>
                    </div>
                </div>
            </div>
            <h3>剧情介绍</h3>
            <p>${data.vod_content}</p>
            <h3>影评</h3>
            <span>${data.vod_yinping}</span>
            <h5>夸克网盘下载</h5>
            <br>
        `;

        tinymce.activeEditor.setContent(content);
        setTimeout(() => {
            tinymce.activeEditor.insertContent('<br>');
        }, 1000);
    }

    // 显示搜索结果
    function showSearchResults(data) {
        if (data.length === 0) {
            editor.notificationManager.error('未找到相关电影');
            return;
        }

        let resultsHtml = '<div class="movie-results">';
        for (let movie of data) {
            resultsHtml += `
                <div class="movie-item" data-id="${movie.id}">
                    <img src="${movie.cover}" alt="${movie.title}" style="width: 100px; cursor: pointer;">
                    <p style="margin-top: 5px;">${movie.title}（${movie.year}）</p>
                </div>
            `;
        }
        resultsHtml += '</div>';

        editor.windowManager.open({
            title: '搜索结果',
            body: {
                type: 'panel',
                items: [{
                    type: 'htmlpanel',
                    html: resultsHtml
                }]
            },
            buttons: [{
                type: 'cancel',
                text: '取消'
            }],
            onAction: function(api, details) {
                if (details.name === 'cancel') {
                    api.close();
                }
            }
        });

        // 为搜索结果添加点击事件
        setTimeout(() => {
            const movieItems = document.getElementsByClassName('movie-item');
            for (let item of movieItems) {
                item.addEventListener('click', function(e) {
                    const movieId = e.currentTarget.getAttribute('data-id');
                    const loadingDialog = editor.windowManager.open({
                        title: '获取中',
                        body: {
                            type: 'panel',
                            items: [{
                                type: 'htmlpanel',
                                html: '<p>正在获取豆瓣信息，请稍候...</p>'
                            }]
                        },
                        buttons: []
                    });

                    // 获取电影详情
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://ap.aizd.xyz/douban/?id=${movieId}&key=demo123123`,
                        headers: {
                            'Accept': 'application/json'
                        },
                        onload: function(response) {
                            loadingDialog.close();
                            const result = JSON.parse(response.responseText);
                            
                            if (result.code === 200) {
                                insertMovieInfo(result.data);
                            } else {
                                editor.notificationManager.error('获取信息失败');
                            }
                            editor.windowManager.close();
                        },
                        onerror: function() {
                            loadingDialog.close();
                            editor.notificationManager.error('网络请求失败');
                            editor.windowManager.close();
                        }
                    });
                });
            }
        }, 500);
    }

    // 更新解析豆瓣信息的函数
    function parseDoubanInfo(data) {
        if (!data || !data.data) {
            console.error('Invalid data:', data);
            return '';
        }

        const template = editor.getParam('douban_template');
        console.log('Using template:', template);

        const scoreClass = data.data.vod_score > 6 ? 'badge-vlo1' : 'badge-vlo2';
        
        const info = {
            vod_pic: data.data.vod_pic || '',
            vod_name: data.data.vod_name || '暂无',
            vod_score: data.data.vod_score || '暂无', 
            vod_sub: data.data.vod_sub || '暂无',
            vod_director: data.data.vod_director || '暂无',
            vod_writer: data.data.vod_writer || '暂无',
            vod_actor: data.data.vod_actor || '暂无',
            vod_class: data.data.vod_class || '暂无',
            vod_area: data.data.vod_area || '暂无',
            vod_pubdate: data.data.vod_pubdate || '暂无',
            vod_lang: data.data.vod_lang || '暂无',
            vod_doubanid: data.data.vod_doubanid || '暂无',
            vod_doubanid_url: data.data.vod_doubanid_url || '#',
            vod_IMDb: data.data.vod_IMDb || '暂无',
            vod_IMDb_url: data.data.vod_IMDb_url || '#',
            vod_duration: data.data.vod_duration || '暂无',
            vod_jisu: data.data.vod_jisu || '暂无',
            vod_content: data.data.vod_content || '暂无',
            vod_yinping: data.data.vod_yinping || '暂无',
            score_class: scoreClass,
            vod_year: data.data.vod_year || '暂无'
        };

        try {
            if (!template) {
                return generateDefaultTemplate(info);
            }

            let result = template;
            for (const [key, value] of Object.entries(info)) {
                if (value !== undefined && value !== null) {
                    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
                } else {
                    result = result.replace(new RegExp(`{${key}}`, 'g'), '暂无');
                }
            }
            return result;
        } catch (error) {
            console.error('Template error:', error);
            return '模板解析错误';
        }
    }

    // 更新下载链接分类函数
    function categorizeDownloadLinks(links) {
        const categories = {
            '百度网盘': [],
            '阿里云盘': [],
            '腾讯微云': [],
            '夸克网盘': [], 
            '115网盘': [],
            '123云盘': [],
            '迅雷云盘': [],
            '360网盘': [],
            '天翼网盘': [],
            '城通网盘': [],
            '蓝奏云网盘': [],
            '蓝奏云·优享版': [],
            'Google Drive': [],
            'OneDrive': [],
            '其他': []
        };

        // ... existing code ...
    }

    // 初始化
    console.log('脚本开始执行');
    waitForTinyMCE((editor) => {
        addDoubanPlugin(editor);
    });

})(); 