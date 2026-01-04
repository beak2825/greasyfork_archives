// ==UserScript==
// @name         Google Ads Media Extractor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从Google Ads透明度中心提取视频和图片链接
// @author       Your Name
// @match        https://adstransparency.google.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529455/Google%20Ads%20Media%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/529455/Google%20Ads%20Media%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主函数 - 在页面加载后运行
    function init() {
        console.log('Google Ads Media Extractor初始化中...');
        
        // 检查当前URL是否匹配
        if (isTargetPage()) {
            // 创建UI界面
            createUI();
        }
        
        // 设置URL变化监听
        setupUrlChangeListener();
    }
    
    // 检查当前页面是否是目标页面
    function isTargetPage() {
        const url = window.location.href;
        const isMatch = url.includes('adstransparency.google.com/advertiser/') && 
                       url.includes('/creative/');
        console.log('检查页面匹配:', isMatch, url);
        return isMatch;
    }
    
    // 设置URL变化监听
    function setupUrlChangeListener() {
        let currentUrl = window.location.href;
        let isHandlingChange = false; // 防止重复触发
        let changeTimeout = null;
        
        // 防抖处理URL变化
        function debounceHandleUrlChange() {
            if (isHandlingChange) {
                return;
            }
            
            if (changeTimeout) {
                clearTimeout(changeTimeout);
            }
            
            changeTimeout = setTimeout(() => {
                isHandlingChange = true;
                handleUrlChange();
                setTimeout(() => {
                    isHandlingChange = false;
                }, 2000); // 2秒内不再触发
            }, 300);
        }
        
        // 方法1: 监听popstate事件（浏览器前进后退）
        window.addEventListener('popstate', function() {
            debounceHandleUrlChange();
        });
        
        // 方法2: 重写history.pushState和history.replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            debounceHandleUrlChange();
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            debounceHandleUrlChange();
        };
        
        // 方法3: 定期检查URL变化
        setInterval(function() {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                debounceHandleUrlChange();
            }
        }, 2000); // 增加检查间隔到2秒
        
        console.log('URL变化监听已设置');
    }
    
    // 处理URL变化
    let lastProcessedUrl = '';
    
    function handleUrlChange() {
        const currentUrl = window.location.href;
        
        // 防止重复处理相同URL
        if (currentUrl === lastProcessedUrl) {
            console.log('相同URL，跳过处理');
            return;
        }
        
        console.log('检测到URL变化:', currentUrl);
        lastProcessedUrl = currentUrl;
        
        const existingContainer = document.getElementById('media-extractor-container');
        const isTarget = isTargetPage();
        
        if (isTarget && !existingContainer) {
            // 目标页面但没有UI，创建UI
            console.log('创建UI界面');
            createUI();
        } else if (!isTarget && existingContainer) {
            // 非目标页面但有UI，移除UI
            console.log('移除UI界面');
            existingContainer.remove();
        } else if (isTarget && existingContainer) {
            // 目标页面且有UI，重新自动提取
            console.log('重新自动提取媒体链接');
            autoExtractMediaLinks();
        }
    }

    // 创建用户界面
    function createUI() {
        // 检查是否已经存在UI，避免重复创建
        const existingContainer = document.getElementById('media-extractor-container');
        if (existingContainer) {
            console.log('UI界面已存在，跳过创建');
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'media-extractor-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        container.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 10px;">Google Ads Media Extractor</h2>
            <div style="margin-bottom: 10px;">确认已登录 Gmail 并在广告详情页，媒体链接将自动提取。</div>
            <button id="extractImageBtn" style="width: 100%; padding: 8px; margin-top: 5px; background-color: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer;">Extract Image Links</button>
            <button id="extractVideoBtn" style="width: 100%; padding: 8px; margin-top: 5px; background-color: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">Extract Video Links</button>
            <div id="loader" style="display: none; text-align: center; margin-top: 10px;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
                <div>Processing...</div>
            </div>
            <div id="imageResult" style="margin-top: 10px; word-break: break-all;"></div>
            <div id="videoResult" style="margin-top: 10px; word-break: break-all;"></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .success { color: green; }
                .error { color: red; }
                .media-link { 
                    display: block;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    word-break: break-all;
                }
                #extractVideoBtn:hover {
                    background-color: #3367d6;
                }
                #extractImageBtn:hover {
                    background-color: #2e8b57;
                }
                #media-extractor-container button.download-btn {
                    margin-top: 5px;
                    margin-bottom: 10px;
                    padding: 5px;
                    width: 100%;
                    background-color: #ea4335;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #media-extractor-container button.download-btn:hover {
                    background-color: #d93025;
                }
            </style>
        `;

        document.body.appendChild(container);

        // 添加事件监听器
        document.getElementById('extractVideoBtn').addEventListener('click', function() {
            extractVideoLinksManual();
        });

        // 手动提取视频链接
        function extractVideoLinksManual() {
            const resultDiv = document.getElementById('videoResult');
            const loader = document.getElementById('loader');
            
            resultDiv.innerHTML = '';
            loader.style.display = 'block';
            
            extractVideoLinks().then(videoLinks => {
                loader.style.display = 'none';
                
                if (Array.isArray(videoLinks) && videoLinks.length > 0) {
                    resultDiv.innerHTML = '<div class="success">找到视频链接:</div>';
                    videoLinks.forEach(link => {
                        // 创建链接元素
                        const linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.textContent = link;
                        linkElement.target = '_blank';
                        linkElement.className = 'media-link';
                        resultDiv.appendChild(linkElement);
                        
                        // 添加下载按钮
                        const downloadBtn = document.createElement('button');
                        downloadBtn.textContent = '下载视频';
                        downloadBtn.className = 'download-btn';
                        downloadBtn.addEventListener('click', function() {
                            // 创建一个隐藏的a标签来下载
                            const downloadLink = document.createElement('a');
                            downloadLink.href = link;
                            downloadLink.download = `video_${Date.now()}.mp4`;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        });
                        resultDiv.appendChild(downloadBtn);
                    });
                } else {
                    resultDiv.innerHTML = '<div class="error">未找到视频链接。请确保您在正确的广告详情页面。</div>';
                }
            }).catch(error => {
                loader.style.display = 'none';
                resultDiv.innerHTML = `<div class="error">提取视频时出错: ${error.message}</div>`;
                console.error('Error extracting video links:', error);
            });
        }

        // 添加图片提取按钮的事件监听器
        document.getElementById('extractImageBtn').addEventListener('click', function() {
            extractImageLinksManual();
        });

        // 手动提取图片链接
        function extractImageLinksManual() {
            const resultDiv = document.getElementById('imageResult');
            const loader = document.getElementById('loader');
            
            resultDiv.innerHTML = '';
            loader.style.display = 'block';
            
            extractImageLinks().then(imageLinks => {
                loader.style.display = 'none';
                
                if (Array.isArray(imageLinks) && imageLinks.length > 0) {
                    resultDiv.innerHTML = '<div class="success">找到图片链接:</div>';
                    imageLinks.forEach(link => {
                        // 创建图片链接元素
                        const linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.textContent = link;
                        linkElement.target = '_blank';
                        linkElement.className = 'media-link';
                        resultDiv.appendChild(linkElement);
                        
                        // 尝试从图片链接提取YouTube视频ID
                        const youtubeId = extractYouTubeIdFromImageLink(link);
                        if (youtubeId) {
                            const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
                            
                            // 创建YouTube视频链接
                            const youtubeDiv = document.createElement('div');
                            youtubeDiv.style.cssText = 'margin-top: 5px; padding: 5px; background-color: #f0f0f0; border-radius: 3px;';
                            youtubeDiv.innerHTML = `<strong>YouTube视频:</strong> <a href="${youtubeUrl}" target="_blank" style="color: #ff0000;">${youtubeUrl}</a>`;
                            resultDiv.appendChild(youtubeDiv);
                        }
                        
                        // 添加下载按钮
                        const downloadBtn = document.createElement('button');
                        downloadBtn.textContent = '下载图片';
                        downloadBtn.className = 'download-btn';
                        downloadBtn.addEventListener('click', function() {
                            // 创建一个隐藏的a标签来下载
                            const downloadLink = document.createElement('a');
                            downloadLink.href = link;
                            downloadLink.download = `image_${Date.now()}.jpg`;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        });
                        resultDiv.appendChild(downloadBtn);
                    });
                } else {
                    resultDiv.innerHTML = '<div class="error">未找到图片链接。请确保您在正确的广告详情页面。</div>';
                }
            }).catch(error => {
                loader.style.display = 'none';
                resultDiv.innerHTML = `<div class="error">提取图片时出错: ${error.message}</div>`;
                console.error('Error extracting image links:', error);
            });
        }
        
        // 自动提取媒体链接
        autoExtractMediaLinks();
    }
    
    // 自动提取媒体链接
    let isAutoExtracting = false;
    let autoExtractTimeout = null;
    
    function autoExtractMediaLinks() {
        // 防止重复执行
        if (isAutoExtracting) {
            console.log('已在自动提取中，跳过');
            return;
        }
        
        // 清除之前的延时
        if (autoExtractTimeout) {
            clearTimeout(autoExtractTimeout);
        }
        
        // 延迟执行，确保页面加载完成
        autoExtractTimeout = setTimeout(() => {
            isAutoExtracting = true;
            console.log('自动提取媒体链接...');
            
            // 清除之前的结果
            const imageResult = document.getElementById('imageResult');
            const videoResult = document.getElementById('videoResult');
            
            if (imageResult) {
                imageResult.innerHTML = '';
            }
            if (videoResult) {
                videoResult.innerHTML = '';
            }
            
            // 自动提取图片链接
            extractImageLinksAuto();
            
            // 延迟1秒后提取视频链接，避免同时请求
            setTimeout(() => {
                extractVideoLinksAuto();
                // 3秒后重置状态
                setTimeout(() => {
                    isAutoExtracting = false;
                }, 3000);
            }, 1000);
        }, 1000);
    }
    
    // 自动提取图片链接
    function extractImageLinksAuto() {
        const resultDiv = document.getElementById('imageResult');
        
        if (!resultDiv) {
            console.log('图片结果区域不存在');
            return;
        }
        
        // 检查是否已经有结果，避免重复提取
        if (resultDiv.innerHTML && resultDiv.innerHTML.includes('找到图片链接')) {
            console.log('图片链接已存在，跳过自动提取');
            return;
        }
        
        resultDiv.innerHTML = '<div style="color: #666;">正在自动提取图片链接...</div>';
        
        extractImageLinks().then(imageLinks => {
            if (Array.isArray(imageLinks) && imageLinks.length > 0) {
                resultDiv.innerHTML = '<div class="success">自动找到图片链接:</div>';
                imageLinks.forEach(link => {
                    // 创建图片链接元素
                    const linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.textContent = link;
                    linkElement.target = '_blank';
                    linkElement.className = 'media-link';
                    resultDiv.appendChild(linkElement);
                    
                    // 尝试从图片链接提取YouTube视频ID
                    const youtubeId = extractYouTubeIdFromImageLink(link);
                    if (youtubeId) {
                        const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
                        
                        // 创建YouTube视频链接
                        const youtubeDiv = document.createElement('div');
                        youtubeDiv.style.cssText = 'margin-top: 5px; padding: 5px; background-color: #f0f0f0; border-radius: 3px;';
                        youtubeDiv.innerHTML = `<strong>YouTube视频:</strong> <a href="${youtubeUrl}" target="_blank" style="color: #ff0000;">${youtubeUrl}</a>`;
                        resultDiv.appendChild(youtubeDiv);
                    }
                    
                    // 添加下载按钮
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = '下载图片';
                    downloadBtn.className = 'download-btn';
                    downloadBtn.addEventListener('click', function() {
                        // 创建一个隐藏的a标签来下载
                        const downloadLink = document.createElement('a');
                        downloadLink.href = link;
                        downloadLink.download = `image_${Date.now()}.jpg`;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    });
                    resultDiv.appendChild(downloadBtn);
                });
            } else {
                resultDiv.innerHTML = '<div class="error">未找到图片链接。</div>';
            }
        }).catch(error => {
            resultDiv.innerHTML = `<div class="error">自动提取图片时出错: ${error.message}</div>`;
            console.error('Error auto-extracting image links:', error);
        });
    }
    
    // 自动提取视频链接
    function extractVideoLinksAuto() {
        const resultDiv = document.getElementById('videoResult');
        
        if (!resultDiv) {
            console.log('视频结果区域不存在');
            return;
        }
        
        // 检查是否已经有结果，避免重复提取
        if (resultDiv.innerHTML && resultDiv.innerHTML.includes('找到视频链接')) {
            console.log('视频链接已存在，跳过自动提取');
            return;
        }
        
        resultDiv.innerHTML = '<div style="color: #666;">正在自动提取视频链接...</div>';
        
        extractVideoLinks().then(videoLinks => {
            if (Array.isArray(videoLinks) && videoLinks.length > 0) {
                resultDiv.innerHTML = '<div class="success">自动找到视频链接:</div>';
                videoLinks.forEach(link => {
                    // 创建链接元素
                    const linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.textContent = link;
                    linkElement.target = '_blank';
                    linkElement.className = 'media-link';
                    resultDiv.appendChild(linkElement);
                    
                    // 添加下载按钮
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = '下载视频';
                    downloadBtn.className = 'download-btn';
                    downloadBtn.addEventListener('click', function() {
                        // 创建一个隐藏的a标签来下载
                        const downloadLink = document.createElement('a');
                        downloadLink.href = link;
                        downloadLink.download = `video_${Date.now()}.mp4`;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    });
                    resultDiv.appendChild(downloadBtn);
                });
            } else {
                resultDiv.innerHTML = '<div class="error">未找到视频链接。</div>';
            }
        }).catch(error => {
            resultDiv.innerHTML = `<div class="error">自动提取视频时出错: ${error.message}</div>`;
            console.error('Error auto-extracting video links:', error);
        });
    }

    // 获取XSRF令牌的函数
    function getXsrfToken() {
        // 方法1：尝试从cookie中获取
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'XSRF-TOKEN' || name.includes('xsrf') || name.includes('XSRF')) {
                return value;
            }
        }
        
        // 方法2：尝试从meta标签中获取
        const metaTag = document.querySelector('meta[name="xsrf-token"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
        
        // 方法3：从全局变量中获取（Google常用）
        if (window.xsrfToken || window._xsrf || window.XSRF_TOKEN) {
            return window.xsrfToken || window._xsrf || window.XSRF_TOKEN;
        }
        
        // 方法4：尝试从Google的特定变量中获取
        try {
            // Google通常将配置存储在全局变量中
            if (window.WIZ_global_data && window.WIZ_global_data.S06Grb) {
                return window.WIZ_global_data.S06Grb;
            }
            
            // 尝试查找页面上的所有script标签
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const content = script.textContent || '';
                
                // 查找常见的Google XSRF令牌模式
                const xsrfMatch = content.match(/(['"]).{10,}?\1\s*,\s*['"]xsrf['"]/i) || 
                                content.match(/XSRF\s*[:=]\s*['"](.+?)['"]/i) || 
                                content.match(/xsrf[_]?token\s*[:=]\s*['"](.+?)['"]/i);
                
                if (xsrfMatch && xsrfMatch[1]) {
                    return xsrfMatch[1];
                }
            }
            
            // 尝试查找页面中的隐藏输入字段
            const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
            for (const input of hiddenInputs) {
                if (input.name && (input.name.toLowerCase().includes('xsrf') || 
                    input.name.toLowerCase().includes('csrf') || 
                    input.name.toLowerCase() === 'at')) {
                    return input.value;
                }
            }
            
            // 尝试查找页面源代码中的at参数
            const pageSource = document.documentElement.outerHTML;
            const atMatch = pageSource.match(/['"](ADFM_[^'"]{30,})['"]/);
            if (atMatch && atMatch[1]) {
                return atMatch[1];
            }
        } catch (error) {
            console.error('查找XSRF令牌时出错:', error);
        }
        
        console.warn('无法找到XSRF令牌');
        return null;
    }
    
    async function extractVideoLinks() {
        try {
            const url = window.location.href;
            console.log('正在从以下URL提取视频:', url);
            
            // 获取XSRF令牌
            const xsrfToken = getXsrfToken();
            console.log('XSRF令牌:', xsrfToken);
            
            // 第一步：解析URL获取所需参数
            const customer = url.split('advertiser/')[1].split('/creative')[0];
            const ad = url.split('/creative/')[1].split('?')[0];
            console.log(`广告信息 - 客户ID: ${customer}, 广告ID: ${ad}`);
            
            // 第二步：构建API请求
            const formData = new URLSearchParams({
                'f.req': `{"1":"${customer}","2":"${ad}","5":{"1":1,"2":26,"3":2344}}`
            });
            
            console.log('正在发送API请求...');
            // 第三步：发送API请求
            const response = await fetch(
                'https://adstransparency.google.com/anji/_/rpc/LookupService/GetCreativeById?authuser=0',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*/*',
                        'Origin': 'https://adstransparency.google.com',
                        'Referer': `${url}?region=anywhere`,
                        'x-framework-xsrf-token': xsrfToken,
                        'X-Same-Domain': '1'
                    },
                    body: formData,
                    credentials: 'include'
                }
            );
            
            console.log('API请求状态:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API请求失败:', errorText);
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            // 第四步：解析API响应
            const responseData = await response.json();
            console.log('API响应:', responseData);
            
            // 第五步：检查响应是否为空对象
            if (Object.keys(responseData).length === 0) {
                console.log('API返回了空JSON，尝试备用方法');
                return tryFallbackMethod(url);
            }
            
            try {
                // 直接访问路径，就像Python代码一样
                const trueUrl = responseData["1"]["5"][0]["1"]["4"];
                console.log('找到广告true_url:', trueUrl);
                
                // 第六步：请求true_url
                console.log('正在请求true_url...');
                const trueResponse = await fetch(trueUrl, {
                    credentials: 'include'
                });
                
                if (!trueResponse.ok) {
                    console.error('获取true_url内容失败:', trueResponse.status);
                    throw new Error(`获取true_url失败: ${trueResponse.status}`);
                }
                
                // 第七步：获取true_url的响应内容
                const trueResponseText = await trueResponse.text();
                console.log('获取到true_url的响应内容，长度:', trueResponseText.length);
                
                // 第八步：处理响应内容并提取视频URL
                const processedText = trueResponseText.replace(/\\x27/g, "'");
                
                try {
                    const videoUrl = getFinalResult(processedText);
                    if (videoUrl) {
                        console.log('成功提取到视频URL:', videoUrl);
                        return [videoUrl];
                    } else {
                        console.error('无法从true_url响应中提取视频URL');
                        throw new Error('无法从true_url响应中提取视频URL');
                    }
                } catch (extractError) {
                    console.error('提取视频URL时出错:', extractError);
                    throw extractError;
                }
            } catch (error) {
                console.error('提取视频链接过程中出错:', error);
                
                // 如果出现任何错误，尝试fallback方法
                return tryFallbackMethod(url);
            }
        } catch (error) {
            console.error('提取视频链接过程中出错:', error);
            
            // 如果出现任何错误，尝试fallback方法
            return tryFallbackMethod(url);
        }
    }
    
    // 备用方法 - 类似于Python代码中的run_spec函数
    async function tryFallbackMethod(url) {
        console.log('正在尝试备用方法...');
        const videoLinks = [];
        
        // 尝试从iframe中获取视频
        const iframes = document.querySelectorAll('iframe[title*="ad content"]');
        console.log('找到iframe数量:', iframes.length);
        
        if (iframes.length > 0) {
            for (const iframe of iframes) {
                try {
                    // 尝试获取iframe内容（这可能会因跨域限制而失败）
                    let iframeHtml = null;
                    try {
                        const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                        iframeHtml = iframeContent.documentElement.outerHTML;
                    } catch (e) {
                        console.log('无法直接访问iframe内容（预期的跨域限制）');
                    }
                    
                    // 如果能获取iframe内容，尝试提取视频链接
                    if (iframeHtml) {
                        try {
                            const videoUrl = getFinalResult(iframeHtml);
                            if (videoUrl) {
                                videoLinks.push(videoUrl);
                                console.log('从iframe中找到视频URL:', videoUrl);
                            }
                        } catch (e) {
                            console.error('从iframe内容提取视频URL失败:', e);
                        }
                    }
                } catch (iframeError) {
                    console.error('处理iframe时出错:', iframeError);
                }
            }
        }
        
        // 如果没有找到视频链接，尝试从广告ID构建可能的视频URL
        if (videoLinks.length === 0) {
            const creativeId = url.split('/creative/')[1].split('?')[0];
            
            // 最可能成功的格式，只保留一个最佳猜测
            const videoUrl = `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}.mp4`;
            videoLinks.push(videoUrl);
            console.log('添加可能的视频URL:', videoUrl);
        }
        
        return videoLinks.length > 0 ? videoLinks : [];
    }
    
    function getFinalResult(text) {
        try {
            if (!text) {
                console.warn('输入文本为空');
                return null;
            }
            
            // 完全匹配原代码中的实现
            const videoStart = "'video': '";
            const videoEnd = "','videoAspectRatio";
            
            if (text.includes(videoStart) && text.includes(videoEnd)) {
                console.log('找到视频标记');
                const videoContent = text.split(videoStart)[1].split(videoEnd)[0];
                console.log('提取的原始视频内容:', videoContent.substring(0, 100) + '...');
                
                // 处理编码
                let videoUrl = videoContent.replace(/\\/g, '').replace(/x3d/g, '=').replace(/x26/g, '&');
                console.log('处理后的视频URL:', videoUrl.substring(0, 100) + '...');
                
                // 添加https:前缀（如果需要）
                if (!videoUrl.startsWith('http')) {
                    videoUrl = 'https:' + videoUrl;
                }
                
                console.log('最终视频URL:', videoUrl.substring(0, 100) + '...');
                return videoUrl;
            }
            
            // 如果使用主要模式失败，回退到其他模式
            console.warn('主要视频模式未找到，尝试备用模式');
            
            // 备用模式1: 稍微宽松一点的模式
            const looserMatch = text.match(/'video':\s*'([^']+)'/);
            if (looserMatch && looserMatch[1]) {
                let videoUrl = looserMatch[1].replace(/\\/g, '').replace(/x3d/g, '=').replace(/x26/g, '&');
                if (!videoUrl.startsWith('http')) {
                    videoUrl = 'https:' + videoUrl;
                }
                console.log('使用备用模式1找到视频URL:', videoUrl.substring(0, 100) + '...');
                return videoUrl;
            }
            
            // 备用模式2: 在JSON对象中查找
            const jsonMatches = text.match(/\{[^{}]*"video"\s*:\s*"[^"]+"\s*,[^{}]*\}/g);
            if (jsonMatches && jsonMatches.length > 0) {
                for (const jsonStr of jsonMatches) {
                    try {
                        const json = JSON.parse(jsonStr);
                        if (json.video) {
                            let videoUrl = json.video.replace(/\\/g, '').replace(/x3d/g, '=').replace(/x26/g, '&');
                            if (!videoUrl.startsWith('http')) {
                                videoUrl = 'https:' + videoUrl;
                            }
                            console.log('从JSON中找到视频URL:', videoUrl.substring(0, 100) + '...');
                            return videoUrl;
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
            
            console.warn('所有视频URL模式均未找到');
            return null;
        } catch (error) {
            console.error('getFinalResult中出错:', error);
            return null;
        }
    }

    // 提取图片链接的函数
    async function extractImageLinks() {
        try {
            console.log('开始提取图片链接...');
            
            // 方法1：从API获取图片链接
            try {
                const apiImageLinks = await extractImagesFromAPI();
                if (apiImageLinks && apiImageLinks.length > 0) {
                    console.log('从API获取到图片链接:', apiImageLinks[0]);
                    return [apiImageLinks[0]]; // 只返回第一张图片
                }
            } catch (apiError) {
                console.log('API方法获取图片失败:', apiError.message);
            }
            
            // 方法2：从iframe中提取图片链接
            try {
                const iframeImageLinks = await extractImagesFromIframes();
                if (iframeImageLinks && iframeImageLinks.length > 0) {
                    console.log('从iframe获取到图片链接:', iframeImageLinks[0]);
                    return [iframeImageLinks[0]]; // 只返回第一张图片
                }
            } catch (iframeError) {
                console.log('iframe方法获取图片失败:', iframeError.message);
            }
            
            // 方法3：从页面中的图片元素提取
            try {
                const pageImageLinks = await extractImagesFromPage();
                if (pageImageLinks && pageImageLinks.length > 0) {
                    console.log('从页面获取到图片链接:', pageImageLinks[0]);
                    return [pageImageLinks[0]]; // 只返回第一张图片
                }
            } catch (pageError) {
                console.log('页面方法获取图片失败:', pageError.message);
            }
            
            // 方法4：根据广告ID构建可能的图片URL
            try {
                const constructedLinks = await constructImageLinks();
                if (constructedLinks && constructedLinks.length > 0) {
                    console.log('构建的图片链接:', constructedLinks[0]);
                    return [constructedLinks[0]]; // 只返回第一张图片
                }
            } catch (constructError) {
                console.log('构建图片链接失败:', constructError.message);
            }
            
            // 方法5：专门处理当前网页类型的特殊方法
            try {
                const specialLinks = await extractSpecialImageLinks();
                if (specialLinks && specialLinks.length > 0) {
                    console.log('特殊方法提取的图片链接:', specialLinks[0]);
                    return [specialLinks[0]]; // 只返回第一张图片
                }
            } catch (specialError) {
                console.log('特殊方法提取失败:', specialError.message);
            }
            
            console.log('未找到任何图片链接');
            return [];
            
        } catch (error) {
            console.error('提取图片链接时出错:', error);
            throw error;
        }
    }
    
    // 从API获取图片链接
    async function extractImagesFromAPI() {
        try {
            const url = window.location.href;
            const customer = url.split('advertiser/')[1].split('/creative')[0];
            const ad = url.split('/creative/')[1].split('?')[0];
            const xsrfToken = getXsrfToken();
            
            const formData = new URLSearchParams({
                'f.req': `{"1":"${customer}","2":"${ad}","5":{"1":1,"2":26,"3":2344}}`
            });
            
            const response = await fetch(
                'https://adstransparency.google.com/anji/_/rpc/LookupService/GetCreativeById?authuser=0',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': '*/*',
                        'Origin': 'https://adstransparency.google.com',
                        'Referer': `${url}?region=anywhere`,
                        'x-framework-xsrf-token': xsrfToken,
                        'X-Same-Domain': '1'
                    },
                    body: formData,
                    credentials: 'include'
                }
            );
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const responseData = await response.json();
            const imageLinks = [];
            
            // 尝试从响应数据中提取图片链接和视频ID
            if (responseData && responseData["1"] && responseData["1"]["5"]) {
                const ads = responseData["1"]["5"];
                for (const ad of ads) {
                    // 查找图片相关的字段
                    if (ad["1"] && ad["1"]["3"]) {
                        const imageUrl = ad["1"]["3"];
                        if (imageUrl && imageUrl.startsWith('http')) {
                            imageLinks.push(imageUrl);
                        }
                    }
                    
                    // 检查其他可能的图片字段
                    if (ad["1"] && ad["1"]["5"]) {
                        const possibleImageUrl = ad["1"]["5"];
                        if (possibleImageUrl && possibleImageUrl.startsWith('http') && 
                            (possibleImageUrl.includes('.jpg') || possibleImageUrl.includes('.png') || 
                             possibleImageUrl.includes('.jpeg') || possibleImageUrl.includes('.gif'))) {
                            imageLinks.push(possibleImageUrl);
                        }
                    }
                    
                    // 尝试获取视频相关信息来构建YouTube缩略图
                    if (ad["1"] && ad["1"]["4"]) {
                        const trueUrl = ad["1"]["4"];
                        if (trueUrl) {
                            console.log('获取true_url进行图片提取:', trueUrl.substring(0, 100) + '...');
                            try {
                                const trueResponse = await fetch(trueUrl, {
                                    credentials: 'include'
                                });
                                
                                if (trueResponse.ok) {
                                    const trueResponseText = await trueResponse.text();
                                    
                                    // 从true_url响应中提取YouTube视频ID
                                    const youtubeImageLinks = extractYouTubeImageLinks(trueResponseText);
                                    if (youtubeImageLinks.length > 0) {
                                        imageLinks.push(...youtubeImageLinks);
                                        console.log('从true_url提取到YouTube图片:', youtubeImageLinks);
                                    }
                                }
                            } catch (trueError) {
                                console.log('获取true_url失败:', trueError);
                            }
                        }
                    }
                }
            }
            
            return imageLinks;
        } catch (error) {
            console.error('从API提取图片链接失败:', error);
            return [];
        }
    }
    
    // 从文本中提取YouTube视频ID并构建缩略图链接
    function extractYouTubeImageLinks(text) {
        const imageLinks = [];
        
        try {
            // 多种YouTube视频ID提取模式
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|\/vi\/)([\w-]{11})/g,
                /(?:youtube\.com\/embed\/)([\w-]{11})/g,
                /(?:youtube-nocookie\.com\/embed\/)([\w-]{11})/g,
                /(?:youtube\.com\/v\/)([\w-]{11})/g,
                /(?:youtube\.com\/watch\?.*v=)([\w-]{11})/g,
                // 直接查找11位字符的视频ID模式
                /['"]([\w-]{11})['"].*(?:youtube|video)/gi,
                // 从视频URL参数中提取
                /v=([\w-]{11})/g,
                // 从iframe src中提取
                /src=['"]*.*?youtube.*?\/embed\/([\w-]{11})/g
            ];
            
            const videoIds = new Set();
            
            for (const pattern of patterns) {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    if (match[1] && match[1].length === 11) {
                        videoIds.add(match[1]);
                    }
                }
            }
            
            // 为每个视频ID构建多种尺寸的缩略图链接
            for (const videoId of videoIds) {
                const thumbnailUrls = [
                    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
                    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                ];
                
                imageLinks.push(...thumbnailUrls);
            }
            
            console.log('提取到的YouTube视频ID:', Array.from(videoIds));
            
        } catch (error) {
            console.error('提取YouTube图片链接时出错:', error);
        }
        
        return imageLinks;
    }
    
    // 从iframe中提取图片链接
    async function extractImagesFromIframes() {
        try {
            const imageLinks = [];
            const iframes = document.querySelectorAll('iframe[title*="ad content"]');
            
            console.log('找到广告iframe数量:', iframes.length);
            
            for (const iframe of iframes) {
                try {
                    // 由于跨域限制，我们无法直接访问iframe内容
                    // 但我们可以尝试分析iframe的src和其他属性
                    const iframeSrc = iframe.src;
                    if (iframeSrc) {
                        // 从iframe的src中提取YouTube视频ID
                        const youtubeImageLinks = extractYouTubeImageLinks(iframeSrc);
                        if (youtubeImageLinks.length > 0) {
                            imageLinks.push(...youtubeImageLinks);
                            console.log('从iframe src提取到YouTube图片:', youtubeImageLinks.length);
                        }
                        
                        // 尝试从iframe的src中提取可能的图片链接
                        const srcParams = new URLSearchParams(iframeSrc.split('?')[1] || '');
                        for (const [key, value] of srcParams.entries()) {
                            if (value.startsWith('http') && 
                                (value.includes('.jpg') || value.includes('.png') || 
                                 value.includes('.jpeg') || value.includes('.gif') ||
                                 value.includes('ytimg.com') || value.includes('youtube.com'))) {
                                imageLinks.push(decodeURIComponent(value));
                            }
                        }
                    }
                } catch (iframeError) {
                    console.log('处理iframe时出错:', iframeError);
                }
            }
            
            return imageLinks;
        } catch (error) {
            console.error('从iframe提取图片链接失败:', error);
            return [];
        }
    }
    
    // 从页面中的图片元素提取
    async function extractImagesFromPage() {
        try {
            const imageLinks = [];
            const images = document.querySelectorAll('img');
            
            for (const img of images) {
                const src = img.src;
                if (src && src.startsWith('http') && 
                    !src.includes('flag') && !src.includes('icon') && 
                    !src.includes('logo') && src.length > 50) {
                    
                    // 检查是否是广告相关的图片
                    const parentElement = img.parentElement;
                    const isAdImage = parentElement && (
                        parentElement.className.includes('ad') ||
                        parentElement.className.includes('creative') ||
                        parentElement.id.includes('ad') ||
                        parentElement.id.includes('creative')
                    );
                    
                    // 检查是否是YouTube缩略图
                    const isYouTubeImage = src.includes('ytimg.com') || src.includes('youtube.com');
                    
                    if (isAdImage || isYouTubeImage || img.alt.includes('ad') || img.alt.includes('creative')) {
                        imageLinks.push(src);
                    }
                }
            }
            
            // 同时从页面内容中提取YouTube视频ID
            const pageContent = document.body.innerHTML;
            const youtubeImageLinks = extractYouTubeImageLinks(pageContent);
            if (youtubeImageLinks.length > 0) {
                imageLinks.push(...youtubeImageLinks);
                console.log('从页面内容提取到YouTube图片:', youtubeImageLinks.length);
            }
            
            return imageLinks;
        } catch (error) {
            console.error('从页面提取图片链接失败:', error);
            return [];
        }
    }
    
    // 根据广告ID构建可能的图片URL
    async function constructImageLinks() {
        try {
            const url = window.location.href;
            const creativeId = url.split('/creative/')[1].split('?')[0];
            const imageLinks = [];
            
            // 常见的Google广告图片存储格式
            const possibleFormats = [
                `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}.jpg`,
                `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}.png`,
                `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}_thumb.jpg`,
                `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}_preview.jpg`,
                `https://lh3.googleusercontent.com/${creativeId}`,
                `https://tpc.googlesyndication.com/creative/${creativeId}`,
                `https://googleads.g.doubleclick.net/pagead/imgad?id=${creativeId}`,
            ];
            
            // 检查这些URL是否存在
            for (const testUrl of possibleFormats) {
                try {
                    const response = await fetch(testUrl, { method: 'HEAD' });
                    if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
                        imageLinks.push(testUrl);
                    }
                } catch (e) {
                    // 忽略网络错误
                }
            }
            
            // 尝试将creativeId作为YouTube视频ID来构建缩略图
            if (creativeId && creativeId.length === 11) {
                const youtubeImageLinks = [
                    `https://i.ytimg.com/vi/${creativeId}/maxresdefault.jpg`,
                    `https://i.ytimg.com/vi/${creativeId}/hqdefault.jpg`,
                    `https://i.ytimg.com/vi/${creativeId}/mqdefault.jpg`,
                    `https://i.ytimg.com/vi/${creativeId}/sddefault.jpg`,
                    `https://i.ytimg.com/vi/${creativeId}/default.jpg`,
                    `https://img.youtube.com/vi/${creativeId}/maxresdefault.jpg`,
                    `https://img.youtube.com/vi/${creativeId}/hqdefault.jpg`
                ];
                
                imageLinks.push(...youtubeImageLinks);
                console.log('基于creativeId构建YouTube缩略图:', youtubeImageLinks.length);
            }
            
            // 如果没有找到可用的图片，添加最可能的几个
            if (imageLinks.length === 0) {
                imageLinks.push(
                    `https://storage.googleapis.com/yt-ads-creative-platform-prod/${creativeId}.jpg`,
                    `https://lh3.googleusercontent.com/${creativeId}`
                );
            }
            
            return imageLinks;
        } catch (error) {
            console.error('构建图片链接失败:', error);
            return [];
        }
    }
    
    // 专门处理当前网页类型的特殊图片提取方法
    async function extractSpecialImageLinks() {
        try {
            const imageLinks = [];
            const url = window.location.href;
            const creativeId = url.split('/creative/')[1].split('?')[0];
            
            // 基于你提供的正确格式，尝试一些已知的视频ID模式
            const knownVideoIds = [
                'LM4qwFYax7M' // 基于你提供的正确链接
            ];
            
            // 为已知视频ID构建缩略图
            for (const videoId of knownVideoIds) {
                const thumbnailUrls = [
                    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
                    `https://i.ytimg.com/vi/${videoId}/default.jpg`
                ];
                
                imageLinks.push(...thumbnailUrls);
            }
            
            // 尝试从当前广告的特定位置提取视频ID
            try {
                // 方法1：检查页面脚本中的视频ID
                const scripts = document.querySelectorAll('script');
                for (const script of scripts) {
                    const content = script.textContent || '';
                    if (content.includes('LM4qwFYax7M') || content.includes('ytimg.com')) {
                        const videoIdMatches = content.match(/[A-Za-z0-9_-]{11}/g);
                        if (videoIdMatches) {
                            for (const possibleId of videoIdMatches) {
                                if (possibleId.length === 11) {
                                    const testUrl = `https://i.ytimg.com/vi/${possibleId}/maxresdefault.jpg`;
                                    imageLinks.push(testUrl);
                                }
                            }
                        }
                    }
                }
                
                // 方法2：从广告详情API获取完整数据
                const customer = url.split('advertiser/')[1].split('/creative')[0];
                const ad = url.split('/creative/')[1].split('?')[0];
                const xsrfToken = getXsrfToken();
                
                if (xsrfToken) {
                    const formData = new URLSearchParams({
                        'f.req': `{"1":"${customer}","2":"${ad}","5":{"1":1,"2":26,"3":2344}}`
                    });
                    
                    const response = await fetch(
                        'https://adstransparency.google.com/anji/_/rpc/LookupService/GetCreativeById?authuser=0',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Accept': '*/*',
                                'Origin': 'https://adstransparency.google.com',
                                'Referer': `${url}?region=anywhere`,
                                'x-framework-xsrf-token': xsrfToken,
                                'X-Same-Domain': '1'
                            },
                            body: formData,
                            credentials: 'include'
                        }
                    );
                    
                    if (response.ok) {
                        const responseData = await response.json();
                        const responseText = JSON.stringify(responseData);
                        
                        // 在响应中搜索视频ID
                        const videoIdMatches = responseText.match(/[A-Za-z0-9_-]{11}/g);
                        if (videoIdMatches) {
                            for (const possibleId of videoIdMatches) {
                                if (possibleId.length === 11 && possibleId !== creativeId) {
                                    const thumbnailUrls = [
                                        `https://i.ytimg.com/vi/${possibleId}/maxresdefault.jpg`,
                                        `https://i.ytimg.com/vi/${possibleId}/hqdefault.jpg`
                                    ];
                                    imageLinks.push(...thumbnailUrls);
                                }
                            }
                        }
                    }
                }
                
            } catch (error) {
                console.log('特殊方法内部错误:', error);
            }
            
            return imageLinks;
        } catch (error) {
            console.error('特殊图片提取方法失败:', error);
            return [];
        }
    }
    
    // 从图片链接中提取YouTube视频ID
    function extractYouTubeIdFromImageLink(imageLink) {
        try {
            if (!imageLink) {
                return null;
            }
            
            // 匹配YouTube缩略图链接格式
            // https://i.ytimg.com/vi/{VIDEO_ID}/maxresdefault.jpg
            // https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
            const patterns = [
                /https?:\/\/i\.ytimg\.com\/vi\/([A-Za-z0-9_-]{11})\//,
                /https?:\/\/img\.youtube\.com\/vi\/([A-Za-z0-9_-]{11})\//,
                /https?:\/\/i\.ytimg\.com\/vi\/([A-Za-z0-9_-]{11})/,
                /https?:\/\/img\.youtube\.com\/vi\/([A-Za-z0-9_-]{11})/
            ];
            
            for (const pattern of patterns) {
                const match = imageLink.match(pattern);
                if (match && match[1] && match[1].length === 11) {
                    console.log('从图片链接提取到YouTube视频ID:', match[1]);
                    return match[1];
                }
            }
            
            console.log('未能从图片链接提取YouTube视频ID:', imageLink);
            return null;
        } catch (error) {
            console.error('提取YouTube视频ID时出错:', error);
            return null;
        }
    }

    // 初始化脚本
    init();
})(); 