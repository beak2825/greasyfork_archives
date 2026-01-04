// ==UserScript==
// @name         图片处理工具
// @version      1.1
// @description  处理图片URL，支持预览、尺寸检测、幻灯片展示等功能
// @author       marx
// @license      MIT
// @match        https://*/seaslog.php*
// @match        http://*/seaslog.php*
// @match        https://*/*.jpg
// @match        https://*/*.png
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      *
// @namespace https://greasyfork.org/users/1507173
// @downloadURL https://update.greasyfork.org/scripts/546605/%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546605/%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义常量
    const TOP = 100;
    const PANEL_LEFT = -450;

    // 创建面板
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.left = "-450px";
    panel.style.top = `${TOP}px`;
    panel.style.width = "350px";
    panel.style.padding = "10px";
    panel.style.backgroundColor = "#f8f8f8";
    panel.style.border = "1px solid #ddd";
    panel.style.borderRadius = "0 10px 10px 0";
    panel.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
    panel.style.transition = "left 0.3s ease";
    panel.style.zIndex = "9999";
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";
    document.body.appendChild(panel);

    // 创建基础UI元素
    function createBasicElements() {
        // JSON输入框
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "请输入 JSON 字符串";
        input.style.width = "100%";
        input.style.paddingTop = "5px";
        input.style.paddingBottom = "5px";
        input.style.marginBottom = "10px";
        panel.appendChild(input);

        // 处理按钮
        const processButton = document.createElement("button");
        processButton.textContent = "处理字符串";
        processButton.style.width = "100%";
        processButton.style.padding = "10px";
        processButton.style.backgroundColor = "#4CAF50";
        processButton.style.color = "#fff";
        processButton.style.border = "none";
        processButton.style.borderRadius = "5px";
        processButton.style.cursor = "pointer";
        processButton.style.marginBottom = "10px";
        panel.appendChild(processButton);

        // 单图片URL输入框
        const imageUrlInput = document.createElement("input");
        imageUrlInput.type = "text";
        imageUrlInput.placeholder = "请输入图片的远程 URL";
        imageUrlInput.style.width = "100%";
        imageUrlInput.style.paddingTop = "5px";
        imageUrlInput.style.paddingBottom = "5px";
        imageUrlInput.style.marginBottom = "10px";
        panel.appendChild(imageUrlInput);

        // 获取尺寸按钮
        const imgButton = document.createElement("button");
        imgButton.textContent = "获取尺寸";
        imgButton.style.width = "100%";
        imgButton.style.padding = "10px";
        imgButton.style.backgroundColor = "#4CAF50";
        imgButton.style.color = "#fff";
        imgButton.style.border = "none";
        imgButton.style.borderRadius = "5px";
        imgButton.style.cursor = "pointer";
        imgButton.style.marginBottom = "10px";
        panel.appendChild(imgButton);

        // 幻灯片展示区域
        const slideshow = document.createElement("div");
        slideshow.style.width = "100%";
        slideshow.style.marginTop = "10px";
        slideshow.style.position = "relative";
        panel.appendChild(slideshow);

        // 展示图片按钮
        const slideshowButton = document.createElement("button");
        slideshowButton.textContent = "展示图片";
        slideshowButton.style.width = "100%";
        slideshowButton.style.padding = "10px";
        slideshowButton.style.backgroundColor = "#2196F3";
        slideshowButton.style.color = "#fff";
        slideshowButton.style.border = "none";
        slideshowButton.style.borderRadius = "5px";
        slideshowButton.style.cursor = "pointer";
        slideshowButton.style.marginTop = "10px";
        panel.appendChild(slideshowButton);

        // 只保留折叠/展开按钮
        const collapseButton = document.createElement("button");
        collapseButton.textContent = "折叠图片";
        collapseButton.style.width = "100%";
        collapseButton.style.padding = "10px";
        collapseButton.style.backgroundColor = "#f44336";
        collapseButton.style.color = "#fff";
        collapseButton.style.border = "none";
        collapseButton.style.borderRadius = "5px";
        collapseButton.style.cursor = "pointer";
        collapseButton.style.marginTop = "10px";
        collapseButton.style.display = "none";
        panel.appendChild(collapseButton);

         // 添加重置按钮
        const resetButton = document.createElement("button");
        resetButton.textContent = "重置";
        resetButton.style.width = "100%";
        resetButton.style.padding = "10px";
        resetButton.style.backgroundColor = "#808080"; // 灰色
        resetButton.style.color = "#fff";
        resetButton.style.border = "none";
        resetButton.style.borderRadius = "5px";
        resetButton.style.cursor = "pointer";
        resetButton.style.marginTop = "10px";
        panel.appendChild(resetButton);

         // 添加多行URL输入框
    const multilineInput = document.createElement("textarea");
    multilineInput.placeholder = "请输入图片URL，每行一个";
    multilineInput.style.width = "100%";
    multilineInput.style.height = "100px";
    multilineInput.style.padding = "5px";
    multilineInput.style.marginBottom = "10px";
    multilineInput.style.resize = "vertical";
    panel.appendChild(multilineInput);

    // 添加URL处理按钮
    const urlProcessButton = document.createElement("button");
    urlProcessButton.textContent = "处理URL";
    urlProcessButton.style.width = "100%";
    urlProcessButton.style.padding = "10px";
    urlProcessButton.style.backgroundColor = "#9C27B0"; // 紫色按钮
    urlProcessButton.style.color = "#fff";
    urlProcessButton.style.border = "none";
    urlProcessButton.style.borderRadius = "5px";
    urlProcessButton.style.cursor = "pointer";
    urlProcessButton.style.marginBottom = "10px";
    panel.appendChild(urlProcessButton);

    // 添加URL处理事件
    urlProcessButton.onclick = function() {
        const urls = multilineInput.value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url); // 过滤空行

        if (urls.length === 0) {
            showAlert("请输入有效的URL!", false);
            return;
        }

        // 格式化为JSON数组字符串
        const jsonArray = JSON.stringify(urls)
            .replace(/","/g, '",\n    "')  // 在每个URL之间添加换行和缩进
            .replace(/^\[/, '[\n    ')     // 在开始位置添加换行和缩进
            .replace(/\]$/, '\n]');        // 在结束位置添加换行

        // 将结果放入主输入框
        input.value = jsonArray;

        // 复制到剪贴板
        copyToClipboard(jsonArray);

        showAlert("URL已转换为数组格式并复制到剪贴板!", true);
    };
        return {
            input,
            processButton,
            imageUrlInput,
            imgButton,
            slideshow,
            slideshowButton,
            collapseButton,
            resetButton,  // 添加到返回对象中
            multilineInput,   // 添加到返回对象
            urlProcessButton   // 添加到返回对象
        };
    }

    // 创建提示框
    const alertBox = document.createElement("div");
    alertBox.style.position = "fixed";
    alertBox.style.top = `${TOP}px`;
    alertBox.style.left = "10px";
    alertBox.style.padding = "10px";
    alertBox.style.zIndex = "9999";
    alertBox.style.backgroundColor = "green";
    alertBox.style.color = "#fff";
    alertBox.style.borderRadius = "5px";
    alertBox.style.display = "none";
    document.body.appendChild(alertBox);

    // 创建图片展示容器
    const imageContainer = document.createElement("div");
    imageContainer.style.position = "fixed";
    imageContainer.style.top = "0";
    imageContainer.style.left = "0";
    imageContainer.style.width = "100%";
    imageContainer.style.height = "100%";
    imageContainer.style.backgroundColor = "rgba(0,0,0,0.9)";
    imageContainer.style.zIndex = "10000";
    imageContainer.style.display = "none";
    imageContainer.style.justifyContent = "center";
    imageContainer.style.alignItems = "center";
    document.body.appendChild(imageContainer);
        // 工具函数
    function showAlert(message, isSuccess = true) {
        alertBox.textContent = message;
        alertBox.style.backgroundColor = isSuccess ? "green" : "red";
        alertBox.style.display = "block";
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 2000);
    }

    function showAlertLong(message, isSuccess = true) {
        alertBox.textContent = message;
        alertBox.style.backgroundColor = isSuccess ? "green" : "red";
        alertBox.style.display = "block";
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 6000);
    }

    // 处理图片URL格式
    function processImageUrls(input) {
        try {
            let jsonString = input;
            jsonString = jsonString.replace(/\\/g, '');

            if (!jsonString.startsWith('[')) {
                jsonString = `[${jsonString}]`;
            }

            let urls = JSON.parse(jsonString);

            if (!Array.isArray(urls)) {
                urls = [urls];
            }

            urls = urls.map(url => {
                url = url.replace(/^["']|["']$/g, '');
                return url.startsWith('http') ? url : `https://${url}`;
            }).filter(url => {
                return url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg') || url.endsWith('.gif'));
            });

            return urls;
        } catch (error) {
            console.error('URL处理错误:', error);
            showAlert("URL格式处理失败!", false);
            return [];
        }
    }

    // 显示大图
    function showFullImage(currentIndex, urls) {
        imageContainer.innerHTML = '';
        imageContainer.style.display = "flex";

        const imageWrapper = document.createElement("div");
        imageWrapper.style.position = "relative";
        imageWrapper.style.width = "90%";
        imageWrapper.style.height = "90%";
        imageWrapper.style.display = "flex";
        imageWrapper.style.justifyContent = "center";
        imageWrapper.style.alignItems = "center";

        const fullImage = document.createElement("img");
        fullImage.src = urls[currentIndex];
        fullImage.style.maxWidth = "100%";
        fullImage.style.maxHeight = "100%";
        fullImage.style.objectFit = "contain";

        // 图片计数器
        const counter = document.createElement("div");
        counter.style.position = "absolute";
        counter.style.top = "20px";
        counter.style.left = "50%";
        counter.style.transform = "translateX(-50%)";
        counter.style.color = "white";
        counter.style.background = "rgba(0,0,0,0.5)";
        counter.style.padding = "5px 10px";
        counter.style.borderRadius = "15px";
        counter.style.fontSize = "14px";
        counter.textContent = `${currentIndex + 1} / ${urls.length}`;

        // 关闭按钮
        const closeButton = document.createElement("div");
        closeButton.innerHTML = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "20px";
        closeButton.style.right = "20px";
        closeButton.style.color = "white";
        closeButton.style.fontSize = "30px";
        closeButton.style.cursor = "pointer";
        closeButton.style.zIndex = "10001";
        closeButton.style.background = "rgba(0,0,0,0.5)";
        closeButton.style.width = "40px";
        closeButton.style.height = "40px";
        closeButton.style.borderRadius = "50%";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.onclick = () => imageContainer.style.display = "none";

        // 创建导航按钮
        const createNavButton = (text, direction) => {
            const button = document.createElement("div");
            button.textContent = text;
            button.style.position = "absolute";
            button.style.top = "50%";
            button.style[direction] = "20px";
            button.style.transform = "translateY(-50%)";
            button.style.color = "white";
            button.style.fontSize = "40px";
            button.style.cursor = "pointer";
            button.style.padding = "20px";
            button.style.background = "rgba(0,0,0,0.5)";
            button.style.borderRadius = "50%";
            button.style.width = "40px";
            button.style.height = "40px";
            button.style.display = "flex";
            button.style.justifyContent = "center";
            button.style.alignItems = "center";
            button.style.userSelect = "none";
            button.style.transition = "transform 0.2s";
            button.style.zIndex = "10001";

            button.onmouseover = () => button.style.transform = "translateY(-50%) scale(1.1)";
            button.onmouseout = () => button.style.transform = "translateY(-50%) scale(1)";

            return button;
        };
        // 切换图片函数
        const switchImage = (delta) => {
            let newIndex = currentIndex + delta;
            if (newIndex >= urls.length) newIndex = 0;
            if (newIndex < 0) newIndex = urls.length - 1;
            showFullImage(newIndex, urls);
        };

        const prevButton = createNavButton('←', 'left');
        const nextButton = createNavButton('→', 'right');
        prevButton.onclick = () => switchImage(-1);
        nextButton.onclick = () => switchImage(1);

        // 键盘事件处理
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') switchImage(-1);
            if (e.key === 'ArrowRight') switchImage(1);
            if (e.key === 'Escape') imageContainer.style.display = "none";
        };
        document.addEventListener('keydown', handleKeyPress);

        // 点击图片切换
        fullImage.onclick = (e) => {
            const clickX = e.clientX;
            const containerWidth = imageContainer.clientWidth;
            if (clickX < containerWidth / 2) {
                switchImage(-1);
            } else {
                switchImage(1);
            }
        };

        // 清理事件监听
        const cleanup = () => {
            document.removeEventListener('keydown', handleKeyPress);
        };

        imageContainer.onclose = cleanup;

        // 组装界面
        imageWrapper.appendChild(fullImage);
        imageContainer.appendChild(imageWrapper);
        imageContainer.appendChild(counter);
        imageContainer.appendChild(closeButton);
        imageContainer.appendChild(prevButton);
        imageContainer.appendChild(nextButton);
    }

    // 初始化UI元素
    const elements = createBasicElements();
    const { input, processButton, imageUrlInput, imgButton, slideshow, slideshowButton, collapseButton,resetButton } = elements;

    // 处理字符串按钮事件
    processButton.addEventListener("click", () => {
        let jsonString = input.value;
        const processedString = jsonString.replace(/\\/g, '');
        console.log("处理后的字符串: ", processedString);

        // 使用异步函数复制到剪贴板
        copyToClipboard(processedString);
    });

    // 添加复制到剪贴板的函数
    async function copyToClipboard(text) {
        try {
            // 尝试使用现代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                showAlert("处理后的字符串已复制到剪贴板!", true);
                return;
            }

            // 回退方案：使用传统方法
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // 设置样式使文本域不可见
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);

            // 选择文本并复制
            textArea.select();
            try {
                document.execCommand('copy');
                showAlert("处理后的字符串已复制到剪贴板!", true);
            } catch (err) {
                console.error('复制失败:', err);
                showAlert("复制到剪贴板失败!", false);
            }

            // 清理
            document.body.removeChild(textArea);

        } catch (err) {
            console.error('复制到剪贴板失败:', err);
            showAlert("复制到剪贴板失败!", false);
        }
    }

    // 修改 getFileSizeFromUrl 函数
    async function getFileSizeFromUrl(imageUrl) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'blob',
                headers: {
                    "Accept": "image/jpeg, image/png, image/gif",
                },
                onload: function(response) {
                    try {
                        const size = response.response.size;
                        if (size >= 1024 * 1024) {
                            resolve((size / (1024 * 1024)).toFixed(2) + ' MB');
                        } else {
                            resolve((size / 1024).toFixed(2) + ' KB');
                        }
                    } catch (error) {
                        console.error('处理响应时出错:', error);
                        resolve('未知大小');
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    resolve('未知大小');
                }
            });
        });
    }

    // 修改图片尺寸按钮的事件处理
    imgButton.onclick = function() {
        const imageUrl = imageUrlInput.value;
        if (!imageUrl) {
            showAlert('请输入图片URL', false);
            return;
        }

        // 创建新的图片对象
        const img = new Image();

        // 先获取图片尺寸
        img.onload = async function() {
            try {
                const imgsize = await getFileSizeFromUrl(imageUrl);
                showAlertLong(`宽度: ${this.width}px, 高度: ${this.height}px, 大小: ${imgsize}`, true);
            } catch (error) {
                showAlertLong(`宽度: ${this.width}px, 高度: ${this.height}px`, true);
                console.error('获取文件大小失败:', error);
            }
        };

        img.onerror = function() {
            showAlert('加载图片失败，请检查URL', false);
        };

        // 设置图片源
        img.src = imageUrl;
    };

    // 展示图片按钮事件
    slideshowButton.onclick = function() {
        try {
            const jsonInput = input.value;
            const urls = processImageUrls(jsonInput);

            if (urls.length === 0) {
                showAlert("没有有效的图片URL!", false);
                return;
            }

            slideshow.innerHTML = '';

            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.style.display = "flex";
            thumbnailContainer.style.flexWrap = "wrap";
            thumbnailContainer.style.gap = "5px";
            thumbnailContainer.style.justifyContent = "center";
            thumbnailContainer.style.width = "100%"; // 添加宽度
            slideshow.appendChild(thumbnailContainer);

            const countDisplay = document.createElement("div");
            countDisplay.style.width = "100%";
            countDisplay.style.textAlign = "center";
            countDisplay.style.margin = "10px 0";
            countDisplay.textContent = `共 ${urls.length} 张图片`;
            slideshow.appendChild(countDisplay);

            urls.forEach((url, index) => {
                const thumbnailWrapper = document.createElement("div");
                thumbnailWrapper.style.position = "relative";
                thumbnailWrapper.style.margin = "5px";

                const thumbnail = document.createElement("img");
                thumbnail.src = url;
                thumbnail.style.width = "100px";
                thumbnail.style.height = "100px";
                thumbnail.style.objectFit = "cover";
                thumbnail.style.cursor = "pointer";
                thumbnail.style.border = "2px solid #ddd";
                thumbnail.style.borderRadius = "5px";
                thumbnail.style.transition = "transform 0.2s";

                thumbnail.onmouseover = function() {
                    this.style.transform = "scale(1.1)";
                };
                thumbnail.onmouseout = function() {
                    this.style.transform = "scale(1)";
                };

                const indexLabel = document.createElement("div");
                indexLabel.textContent = index + 1;
                indexLabel.style.position = "absolute";
                indexLabel.style.top = "5px";
                indexLabel.style.left = "5px";
                indexLabel.style.background = "rgba(0,0,0,0.5)";
                indexLabel.style.color = "white";
                indexLabel.style.padding = "2px 6px";
                indexLabel.style.borderRadius = "3px";
                indexLabel.style.fontSize = "12px";

                thumbnail.onclick = function() {
                    showFullImage(index, urls);
                };

                thumbnailWrapper.appendChild(thumbnail);
                thumbnailWrapper.appendChild(indexLabel);
                thumbnailContainer.appendChild(thumbnailWrapper);
            });

            showAlert(`成功加载 ${urls.length} 张图片!`, true);
            collapseButton.style.display = "block";
            slideshowButton.style.display = "none";
        } catch (error) {
            showAlert("图片加载失败!", false);
            console.error(error);
        }
    };

    // 折叠按钮事件
    collapseButton.onclick = function() {
        const thumbnailContainer = slideshow.querySelector('div');
        if (thumbnailContainer) {
            if (thumbnailContainer.style.display === 'none') {
                thumbnailContainer.style.display = 'flex';
                collapseButton.textContent = '折叠图片';
                collapseButton.style.backgroundColor = '#f44336';
            } else {
                thumbnailContainer.style.display = 'none';
                collapseButton.textContent = '展开图片';
                collapseButton.style.backgroundColor = '#2196F3';
                slideshowButton.style.display = "none";
            }
        }
    };

    // 添加重置按钮事件处理
    resetButton.onclick = function() {
        // 清空输入框
        input.value = '';
        imageUrlInput.value = '';

        // 清空幻灯片区域
        slideshow.innerHTML = '';

        // 重置按钮状态
        slideshowButton.style.display = "block";
        collapseButton.style.display = "none";

        // 重置按钮文本和颜色
        collapseButton.textContent = "折叠图片";
        collapseButton.style.backgroundColor = "#f44336";
        multilineInput.value = ''; // 清空多行输入框
        showAlert("已重置所有内容", true);
    };
    // 创建切换按钮
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "→";
    toggleButton.style.position = "fixed";
    toggleButton.style.left = "0";
    toggleButton.style.top = "50px";
    toggleButton.style.width = "30px";
    toggleButton.style.height = "30px";
    toggleButton.style.padding = "0";
    toggleButton.style.border = "none";
    toggleButton.style.borderRadius = "0 5px 5px 0";
    toggleButton.style.backgroundColor = "#4CAF50";
    toggleButton.style.color = "#fff";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.zIndex = "1001";
    document.body.appendChild(toggleButton);

    // 面板显示状态
    let panelVisible = false;

    // 切换面板显示/隐藏
    toggleButton.addEventListener("click", () => {
        if (panelVisible) {
            panel.style.left = "-320px";
            toggleButton.textContent = "→";
        } else {
            panel.style.left = "0";
            toggleButton.textContent = "←";
        }
        panelVisible = !panelVisible;
    });

    // 点击图片容器背景关闭
    imageContainer.onclick = function(e) {
        if (e.target === imageContainer) {
            imageContainer.style.display = "none";
        }
    };
})();