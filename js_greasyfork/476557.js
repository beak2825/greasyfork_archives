// ==UserScript==
// @name         mmdfans 一键下载
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  在网页上检测视频标签并获取标题和下载链接，点击下载按钮会跳转到视频链接下载并尝试返回页面。
// @author       wzj042
// @match        https://mmdfans.net/mmd/*
// @match        https://cdn.mmdlibrary.eu.org/*
// @match        https://cdn.mmdlibrary2.eu.org/*
// @match        https://cdn.mmdlibrary3.eu.org/*
// @match        https://cdn.bakabakaxi.eu.org/*
// @match        https://cdn.baka6.eu.org/*
// @match        https://cdn.baka7.eu.org/*
// @match        https://cdn.baka8.eu.org/*
// @match        https://cdn.baka9.eu.org/*
// @match        https://cirno.baka9.eu.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476557/mmdfans%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/476557/mmdfans%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /**
     * 手动添加 CDN 链接时别忘了在上方添加匹配链接 `match {你要添加的链接}/*`
     */
    const CDN_LIST = [
        'https://cdn.mmdlibrary.eu.org',
        'https://cdn.mmdlibrary2.eu.org',
        'https://cdn.mmdlibrary3.eu.org',
        'https://cdn.bakabakaxi.eu.org',
        'https://cdn.baka6.eu.org',
        'https://cdn.baka7.eu.org',
        'https://cdn.baka8.eu.org',
        'https://cdn.baka9.eu.org',
        'https://cirno.baka9.eu.org',
        // 添加你要添加的 CDN 链接
    ]

    /**
     * 自定义文件名的 slot
     * name: slot 名称
     * transform: 转换函数
     * source: 数据来源
    */
    const CUSTOM_FILENAME_SLOT = [
        {
            name: 'postDate',
            transform: (postAt) => {
                const datePart = postAt.split(' ')[0];
                return datePart;
            },
            source: (videoInfo) => videoInfo['postAt']
        },
        {
            name: 'curDate',
            transform: () => {
                return new Date().toISOString().split('T')[0];
            },
            source: () => {}
        }
    ]
    
    let downloadFlag = false; 
    const TIME_OUT = 1000;
    /**
     * 默认文件名格式
     * 使用 {param} 的方式表示参数，例如 {author} 表示作者
     * 具体的参数名点击显示视频参数按钮后会显示
     */
    const DEF_FILENAME = '[iwara]{author}-{title}-{postAt}.mp4';

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // 加一个下载防抖事件
    const downloadDebounce = (function () {
        let timer = null;
        return function (pathUrl) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                download(pathUrl);
            }, 500);
        };
    })();

    /**
     * 检查视频标签是否存在，如果存在则添加下载按钮
     */
    const checkVideoTag = async () => {
        while (true) {
            const videoTag = document.getElementsByClassName('mdui-video-fluid');
            const sourceElement = document.querySelector('video source');
            const downloadLink = sourceElement ? sourceElement.getAttribute('src') : '';
            const titleElement = document.querySelector('h2.title');
            const title = titleElement ? titleElement.textContent.trim() : '无标题';

            if (videoTag.length > 0) {
                const videoInfo = gatherVideoInfo(downloadLink, title);

                createTagContainer();
                createDownloadButton(videoInfo);
                createCopyCdnButton(videoInfo.baseurl);
                createJsonButton(videoInfo);

                createFilenameInput();

                break;
            } else if (!downloadFlag) {
                const curUrl = window.location.href
                if (isCdnLink(curUrl)) {
                    downloadDebounce(curUrl);
                }
            }

            await delay(TIME_OUT); // 等待下一次检查
        }
    };

    /**
     * 检查当前页面是否为 mmdfans 视频的 CDN 链接
     * @param   {string}  url - 当前页面链接 
     * @returns {boolean}     - 如果是 mmdfans 视频的 CDN 链接，则返回 true，否则返回 false
     */
    function isCdnLink(url) {
        return CDN_LIST.some(cdn => url.startsWith(cdn));
    }

    function download(pathUrl) {
        const a = document.createElement("a");
        const url = new URL(pathUrl);
        const downloadURL = url.protocol + '//' + url.host + url.pathname;
        const filename = url.searchParams.get('filename');

        a.download = filename;
        a.href = downloadFlag ? downloadURL : pathUrl;
        a.click();
        a.remove();
        setTimeout(function () {
            /**
             * 下载完成后返回上一页
             */
            if (isCdnLink(window.location.href) && downloadFlag) {
                window.history.back();
            }
            downloadFlag = false;
        }, TIME_OUT);
        
        downloadFlag = true;
    }

    /**
     * 匹配文件名中的参数并替换为对应的值，返回完整的下载链接
     * @param {*} filenameInfo - 文件名信息对象
     * @param {*} videoInfo - 视频信息对象
     * @returns {string} - 下载链接
     */
    function filename2Url(filenameInfo, videoInfo) {
        const params = filenameInfo.params;
        let filename = filenameInfo.filename;
        console.log(filenameInfo, videoInfo);
        // 校验参数
        if (!params || params.length === 0 || !filename) {
            return videoInfo.downloadLink;
        }

        // 匹配 params 和 videoInfo 中的属性
        params.forEach(param => {
            let value = videoInfo[param];

            // 如果是自定义的 slot 则调用 transform 方法
            const customSlot = CUSTOM_FILENAME_SLOT.find(slot => slot.name === param);
            if (customSlot && customSlot.transform) {
                value = customSlot.transform(customSlot.source(videoInfo));
            }

            filename = filename.replace(`{${param}}`, value);
        });
        // 为了防止文件名中含有特殊字符，需要对文件名进行编码
        return `${videoInfo.downloadLink}?filename=${encodeURIComponent(filename)}`;
    }

    function createFilenameInput() {
        const filenameButton = document.createElement('button');
        filenameButton.innerHTML = 'FileName';
        filenameButton.classList.add('mdui-btn');
    
        const filenameInput = document.createElement('input');
        filenameInput.id = 'filename-input';
        filenameInput.placeholder = '请输入文件名格式';
        filenameInput.type = 'text';
        // 如果 localStorage 中有 filename 则使用 localStorage 中的值
        filenameInput.value = localStorage.getItem('filename') || DEF_FILENAME;
        
        filenameInput.style.width = '50%';
        filenameInput.style.display = 'inline-block';

        filenameInput.classList.add('mdui-textfield-input');

        // 编辑完成后保存到 localStorage
        filenameInput.onchange = () => {
            localStorage.setItem('filename', filenameInput.value);
        };
    
        const tagDivider = document.querySelector('.mdui-divider.tag-divider');
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');
        
        tagContainer.appendChild(filenameButton);
        tagContainer.appendChild(filenameInput);
        tagDivider.parentNode.insertBefore(tagContainer, tagDivider);

    }

    /**
     * 在标题上方添加一个标签容器，用于存放下载按钮
     */
    function createTagContainer() {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container');
        const titleDiv = document.querySelector('.mdui-typo');
        titleDiv.parentNode.insertBefore(tagContainer, titleDiv);
    }

    function createDownloadButton(videoInfo) {
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '下载视频';
        downloadButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');

        downloadButton.onclick = () => {

            let baseurl = videoInfo.baseurl;

            if (!isCdnLink(baseurl)) {
                showAlertWithButtons(baseurl);
                return;
            }

            downloadDebounce(filename2Url(gatherFilenameInfo(), videoInfo));
        };

        const tagContainer = document.querySelector('.tag-container');
        tagContainer.appendChild(downloadButton);
        tagContainer.appendChild(createSpace());
    }

    function createCopyCdnButton(downloadLink) {
        const copyCdnButton = document.createElement('button');
        copyCdnButton.innerHTML = '复制 CDN 链接';
        copyCdnButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');

        copyCdnButton.onclick = () => {
            if (!downloadLink) {
                alert('未获取到视频链接');
                return;
            }
            navigator.clipboard.writeText(downloadLink);
            alert('复制成功');
        };

        const tagContainer = document.querySelector('.tag-container');
        tagContainer.appendChild(copyCdnButton);
        tagContainer.appendChild(createSpace());
    }

    /**
     * 创建一个 Html 空格（占位）元素
     * @returns {HTMLElement} - 返回一个空格元素
     */
    function createSpace() {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;&nbsp;';
        return space;
    }

    function createJsonButton(videoInfo) {
        const jsonButton = document.createElement('button');
        jsonButton.innerHTML = '显示视频信息';
        jsonButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');
    
        jsonButton.onclick = () => {
            showPopup(videoInfo);
        };
    
        const tagContainer = document.querySelector('.tag-container');
        tagContainer.appendChild(jsonButton);
        tagContainer.appendChild(createSpace());
    }

    /**
     * 展示视频信息的弹窗
     * @param {*} videoInfo - 视频信息
     */
    function showPopup(videoInfo) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.width = '42%';
        popup.style.backgroundColor = '#fff';
        popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1000';
        popup.style.overflowX = 'auto';
    
    
        const pre = document.createElement('pre');
        pre.innerHTML = JSON.stringify(videoInfo, null, 2);
        popup.appendChild(pre);

        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '关闭';
        closeButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');
        closeButton.style.width = '100%';
        closeButton.onclick = () => popup.remove();
        popup.appendChild(closeButton);

        popup.onclick = (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        };


        document.body.appendChild(popup);
    }
    
    /**
     * 展示提示框，提示用户手动添加 CDN 链接
     * @param {*} cdnLink - 视频下载链接
     */
    function showAlertWithButtons(cdnLink) {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>当前 CDN 链接需要手动添加 CDN 链接（脚本主页有教程），否则无法启动下载任务</p>
            <button id="open-homepage" class="mdui-btn mdui-color-theme-accent mdui-ripple">打开脚本主页</button>
            <button id="copy-baseurl" class="mdui-btn mdui-color-theme-accent mdui-ripple">复制视频 CDN 链接</button>
        `;
        const tagContainer = document.querySelector('.tag-container');
        tagContainer.appendChild(div);

        document.getElementById('open-homepage').onclick = () => {
            window.open('https://greasyfork.org/zh-CN/scripts/476557-mmdfans%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD', '_blank');
        };

        document.getElementById('copy-baseurl').onclick = () => {
            navigator.clipboard.writeText(cdnLink);
            alert('已复制 CDN 链接');
        };
    }

    /**
     * 获取文件名输入框中的参数
     * @returns {*} - 返回文件名参数
     * @example 
     * {
     *   filename: '[iwara]{author}{title}.mp4',
     *   params: ['author', 'title']
     * }
     */
    function gatherFilenameInfo() {
        const filenameInput = document.getElementById('filename-input');
        const filename = filenameInput ? filenameInput.value : '';
        const paramMatches = filename.match(/\{(\w+)\}/g);
        const params = paramMatches ? paramMatches.map(param => param.slice(1, -1)) : [];
    
        return {
            filename: filename,
            params: params
        };
    }

    /**
     * 将视频信息整合到一个对象中
     * @param {string} downloadLink - 视频下载链接
     * @param {string} title - 视频标题
     * @returns {object} 视频信息对象
     */
    function gatherVideoInfo(downloadLink, title) {
        const tagContainers = document.querySelectorAll('.tag-container');
        const info = {
            title: title,
            downloadLink: downloadLink,
            tags: [],
            author: '无作者',
            baseurl: '',
            source: '',
            postAt: '',
            comment: ''
        };

        if (downloadLink) {
            const url = new URL(downloadLink);
            info.baseurl = url.protocol + '//' + url.host;
        }

        tagContainers.forEach(container => {
            const buttons = container.querySelectorAll('button');
            
            buttons.forEach(button => {
                const text = button.textContent.trim();
                switch (text) {
                    case 'Tags':
                    case 'Source':
                    case 'PostAt':
                    case 'Author':
                        break;
                    default:
                        if (container.textContent.includes('Tags')) {
                            info.tags.push(text);
                        } else if (container.textContent.includes('Author')) {
                            info.author = text;
                        } else if (container.textContent.includes('Source')) {
                            info.source = container.querySelector('a').href;
                        } else if (container.textContent.includes('PostAt')) {
                            info.postAt = text;
                        }
                        break;
                }
            });
            if (container.textContent.includes('Comment')) {
                info.comment = document.querySelector('blockquote').textContent.trim();
            }
        });

        return info;
    }

    checkVideoTag();
})();