// ==UserScript==
// @name       BaiduPanFileList
// @namespace  https://greasyfork.org/zh-CN/scripts/5128-baidupanfilelist
// @version    2.0.016
// @description  统计百度盘文件(夹)数量大小
// @match	https://pan.baidu.com*
// @include	https://pan.baidu.com*
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @run-at document-end
// @copyright  2014+, icgeass@hotmail.com
// @downloadURL https://update.greasyfork.org/scripts/5128/BaiduPanFileList.user.js
// @updateURL https://update.greasyfork.org/scripts/5128/BaiduPanFileList.meta.js
// ==/UserScript==

// %Path% = 文件路径
// %FileName% = 文件名
// %Tab% = Tab键
// %FileSize% = 可读文件大小（带单位保留两位小数，如：6.18 MiB）
// %FileSizeInBytes% = 文件大小字节数（为一个非负整数）
(function () {
    'use strict';

    // 配置指定前缀和后缀数量统计
    const PREFIX_TO_COUNT = ['', ''];
    const SUFFIX_TO_COUNT = ['', ''];

    const RANDOM_BUTTON_COLOR = true;

    const FILE_LIST_PATTERN = "%Path%%Tab%%FileSize%(%FileSizeInBytes% Bytes)";

    const BUTTON_BACKGROUND_COLOR = [
        '#007BFF', '#0ABAB5', '#50C878',
        '#FF7F50', '#D4A017', '#7B1FA2',
        '#FF69B4', '#228B22', '#948DD6',
        '#FF8C00', '#C71585', '#EF4444'
    ];

    const BTN_WAITING_TEXT = "统计文件夹";
    const BTN_RUNNING_TEXT = "处理中";

    // 预过滤有效的前缀和后缀，避免重复计算，并转为小写
    const VALID_PREFIXES = PREFIX_TO_COUNT.filter(prefix => prefix && prefix.trim().length > 0).map(prefix => prefix.toLowerCase());
    const VALID_SUFFIXES = SUFFIX_TO_COUNT.filter(suffix => suffix && suffix.trim().length > 0).map(suffix => suffix.toLowerCase());

    // 按钮颜色 - 从预设颜色中随机选择
    const buttonColorHex = RANDOM_BUTTON_COLOR ? BUTTON_BACKGROUND_COLOR[Math.floor(Math.random() * BUTTON_BACKGROUND_COLOR.length)] : BUTTON_BACKGROUND_COLOR[0];

    // 将十六进制颜色转换为RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    const buttonColorRgb = hexToRgb(buttonColorHex);
    const buttonColorRgba = `rgba(${buttonColorRgb.r}, ${buttonColorRgb.g}, ${buttonColorRgb.b}, 0.4)`;
    const buttonColorRgbaHover = `rgba(${buttonColorRgb.r}, ${buttonColorRgb.g}, ${buttonColorRgb.b}, 0.6)`;

    // 检查是否已存在按钮，避免重复创建
    if (document.getElementById('baidupanfilelist-5128-floating-action-button')) {
        return;
    }

    // 检查是否在顶级窗口中，如果不是则退出（避免在iframe中重复创建）
    if (window !== window.top) {
        return;
    }

    // 创建按钮元素
    const button = document.createElement('div');
    button.id = 'baidupanfilelist-5128-floating-action-button';
    button.innerHTML = BTN_WAITING_TEXT;

    // 创建提示框
    const tooltip = document.createElement('div');
    tooltip.id = 'floating-button-tooltip';
    tooltip.innerHTML = '📁 点击统计当前文件夹<br/>🔍 Ctrl+点击 统计包含子文件夹<br/>⌨️ 快捷键：Q / Ctrl+Q';

    // 按钮样式
    const buttonStyles = {
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'auto',
        minWidth: '80px',
        height: '36px',
        borderRadius: '18px',
        backgroundColor: buttonColorHex,
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: `0 4px 12px ${buttonColorRgba}`,
        zIndex: '10000',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
    };

    // 提示框样式
    const tooltipStyles = {
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        zIndex: '10001',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
        transform: 'translateY(-50%)'
    };

    // 应用样式
    Object.assign(button.style, buttonStyles);
    Object.assign(tooltip.style, tooltipStyles);

    // 按钮状态
    let isProcessing = false;
    // 拖拽相关变量
    let isDragging = false;
    let hasMoved = false;
    let dragStartX, dragStartY;
    let buttonStartX, buttonStartY;
    let dragThreshold = 3; // 降低拖拽阈值，提高响应速度

    // 鼠标按下事件
    button.addEventListener('mousedown', function (e) {
        if (isProcessing) return; // 处理中不允许拖拽

        isDragging = true;
        hasMoved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        const rect = button.getBoundingClientRect();
        buttonStartX = rect.left;
        buttonStartY = rect.top;

        button.style.cursor = 'grabbing';

        // 拖拽开始时隐藏提示框
        hideTooltip();

        e.preventDefault();
    });

    // 鼠标移动事件 - 优化为更流畅的拖拽
    document.addEventListener('mousemove', function (e) {
        if (!isDragging || isProcessing) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // 降低拖拽阈值，提高响应速度
        if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
            hasMoved = true;
        }

        const newX = buttonStartX + deltaX;
        const newY = buttonStartY + deltaY;

        // 限制按钮在视窗内
        const maxX = window.innerWidth - button.offsetWidth;
        const maxY = window.innerHeight - button.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        // 使用 translate3d 进行硬件加速，提高性能
        button.style.left = constrainedX + 'px';
        button.style.top = constrainedY + 'px';
        button.style.right = 'auto';
        button.style.transform = 'translate3d(0, 0, 0)';

        e.preventDefault();
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', function (e) {
        if (!isDragging) return;

        isDragging = false;
        button.style.cursor = isProcessing ? 'not-allowed' : 'pointer';

        // 如果没有移动，则触发点击事件
        if (!hasMoved && !isProcessing) {
            handleClick(e);
        }

        // 重置transform
        if (hasMoved) {
            button.style.transform = 'translate3d(0, 0, 0)';
        } else {
            button.style.transform = button.style.left ? 'translate3d(0, 0, 0)' : 'translateY(-50%)';
        }
    });

    // 点击处理函数 - 调用原有的文件统计功能
    async function handleClick(e) {
        if (isProcessing) return; // 防止重复点击

        // 检查是否按住了 Ctrl 键
        const includeSubDir = e && e.ctrlKey;

        try {
            // 调用原有的文件统计功能
            showInfo(includeSubDir);
        } catch (error) {
            alert("❌ 处理失败\n\n💡 提示：直接点击按钮重试即可，无需刷新页面");
            unlockButton();
        }
    }

    // 悬停效果
    button.addEventListener('mouseenter', function () {
        if (!isDragging && !isProcessing) {
            button.style.transform = button.style.transform.includes('translateY') ?
                'translateY(-50%) scale(1.05)' : 'scale(1.05)';

            if (!isProcessing) {
                button.style.boxShadow = `0 6px 16px ${buttonColorRgbaHover}`;
            }

            // 显示提示框
            showTooltip();
        }
    });

    button.addEventListener('mouseleave', function () {
        if (!isDragging) {
            button.style.transform = button.style.transform.includes('translateY') ?
                'translateY(-50%)' : (button.style.left ? 'translate3d(0, 0, 0)' : 'none');

            if (!isProcessing) {
                button.style.boxShadow = `0 4px 12px ${buttonColorRgba}`;
            }

            // 隐藏提示框
            hideTooltip();
        }
    });

    // 显示提示框
    function showTooltip() {
        const buttonRect = button.getBoundingClientRect();

        // 动态获取提示框实际尺寸
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '1';
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width || 160; // 提供默认值
        const tooltipHeight = tooltipRect.height || 50;
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';

        // 计算按钮中心点
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        // 计算屏幕中心点
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        // 默认位置：按钮左侧
        let tooltipX = buttonRect.left - tooltipWidth - 10;
        let tooltipY = buttonCenterY - tooltipHeight / 2;

        // 判断按钮相对于屏幕中心的位置，调整提示框位置
        if (buttonCenterX > screenCenterX) {
            // 按钮在屏幕右侧，提示框显示在左侧
            tooltipX = buttonRect.left - tooltipWidth - 5;
        } else {
            // 按钮在屏幕左侧，提示框显示在右侧
            tooltipX = buttonRect.right + 5;
        }

        if (buttonCenterY > screenCenterY) {
            // 按钮在屏幕下方，提示框显示在上方
            tooltipY = buttonRect.top - tooltipHeight - 5;
        } else {
            // 按钮在屏幕上方，提示框显示在下方
            tooltipY = buttonRect.bottom + 5;
        }

        // 防止提示框超出屏幕边界
        if (tooltipX < 10) {
            tooltipX = 10;
        }
        if (tooltipX + tooltipWidth > window.innerWidth - 10) {
            tooltipX = window.innerWidth - tooltipWidth - 10;
        }
        if (tooltipY < 10) {
            tooltipY = 10;
        }
        if (tooltipY + tooltipHeight > window.innerHeight - 10) {
            tooltipY = window.innerHeight - tooltipHeight - 10;
        }

        // 应用位置
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'none';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    }

    // 隐藏提示框
    function hideTooltip() {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }

    // 禁用右键菜单，防止 Ctrl+点击时弹出菜单
    button.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 添加到页面
    document.body.appendChild(button);
    document.body.appendChild(tooltip);

    // 防止页面滚动时按钮位置错乱
    window.addEventListener('scroll', function () {
        if (!button.style.left) {
            // 如果按钮还在初始位置（右侧中间），保持fixed定位
            return;
        }
    });

    // 窗口大小改变时调整按钮位置
    window.addEventListener('resize', function () {
        const rect = button.getBoundingClientRect();
        const maxX = window.innerWidth - button.offsetWidth - 20; // 保持20px边距
        const maxY = window.innerHeight - button.offsetHeight;

        // 如果按钮被挤出右边界，调整到安全位置
        if (rect.right > window.innerWidth - 20) {
            if (button.style.left) {
                // 拖拽后的按钮
                button.style.left = Math.max(20, maxX) + 'px';
            } else {
                // 初始位置的按钮，切换到left定位
                button.style.right = 'auto';
                button.style.left = Math.max(20, maxX) + 'px';
            }
        }

        // 垂直位置保护
        if (rect.bottom > window.innerHeight) {
            button.style.top = Math.max(20, maxY) + 'px';
        }
    });

    // 键盘快捷键, 确保在按钮添加失败时依旧可用
    document.addEventListener("keydown", function (e) {
        // 检查焦点元素，避免在输入框等元素中触发
        const activeElement = document.activeElement;
        const isInputElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );

        // 如果焦点在输入元素上，不处理快捷键
        if (isInputElement) {
            return;
        }

        // 使用标准的事件对象，无需兼容性处理
        let key = e.key || e.code;

        // 检测 Q 键 (Q 或 q)
        if (key === 'q' || key === 'Q' || key === 'KeyQ') {
            if (e.ctrlKey) {
                showInfo(true);
            } else {
                showInfo(false);
            }
            // 阻止默认行为
            e.preventDefault();
        }
    }, false);

    // 处理按钮和快捷键
    function showInfo(includeSubDir) {
        // 是否处理错误
        let isGetListHasError = false;
        if (isProcessing) {
            return;
        }
        lockButton();

        // 记录开始时间
        const startTime = Date.now();

        let strAlert = "";
        let numOfAllFiles = 0;
        let numOfAllFolder = 0;
        let prefixCounts = {};
        let suffixCounts = {};
        // 根据预过滤的配置初始化计数器
        VALID_PREFIXES.forEach(prefix => {
            prefixCounts[prefix] = 0;
        });
        VALID_SUFFIXES.forEach(suffix => {
            suffixCounts[suffix] = 0;
        });
        let allFilePath = [];
        let allFileSizeInBytes = 0;


        let currNumOfAccessFolder = 1;
        // 创建文件列表获取器
        const fileListGetter = FileListGetterFactory.createGetter(document.URL, {});
        fileListGetter.init();
        // 获取当前目录
        const currentDir = fileListGetter.getCurrentDirectory();
        processFileList(currentDir);

        // 处理文件列表
        function processFileList(filePath) {
            if (isGetListHasError) {
                return;
            }

            const callback = {
                parseResponse: function(jsonObj, url, data, callback) {
                    return fileListGetter.parseResponse(jsonObj, url, data, callback);
                },
                onSuccess: function(fileList) {
                    for (let fileInfo of fileList) {
                        if (fileInfo.isDir()) {
                            numOfAllFolder++;
                            allFilePath.push(fileInfo.getPath());
                            if (includeSubDir) {
                                currNumOfAccessFolder++;
                                processFileList(fileInfo.getPath());
                            }
                        } else {
                            numOfAllFiles++;
                            setButtonText(BTN_RUNNING_TEXT + "(" + numOfAllFiles + ")");
                            
                            // 根据SUFFIX_TO_COUNT和PREFIX_TO_COUNT配置动态计数
                            let currItemServerFilename = fileInfo.getName();
                            // 前缀统计
                            for (let prefix of VALID_PREFIXES) {
                                if (currItemServerFilename.toLowerCase().startsWith(prefix)) {
                                    prefixCounts[prefix]++;
                                    break; // 匹配到第一个前缀就停止，避免重复计数
                                }
                            }
                            // 后缀统计
                            for (let suffix of VALID_SUFFIXES) {
                                if (currItemServerFilename.toLowerCase().endsWith(suffix)) {
                                    suffixCounts[suffix]++;
                                    break; // 匹配到第一个后缀就停止，避免重复计数
                                }
                            }
                            allFileSizeInBytes += fileInfo.getSize();
                            if (typeof FILE_LIST_PATTERN === "string") {
                                allFilePath.push(FILE_LIST_PATTERN.replace("%FileName%", currItemServerFilename).replace("%Path%", fileInfo.getPath()).replace("%FileSizeInBytes%", fileInfo.getSize()).replace("%Tab%", "\t").replace("%FileSize%", getReadableFileSizeString(fileInfo.getSize())));
                            } else {
                                allFilePath.push(fileInfo.getPath() + "\t" + getReadableFileSizeString(fileInfo.getSize()) + "(" + fileInfo.getSize() + " Bytes)");
                            }
                        }
                    }
                    currNumOfAccessFolder--;
                    if (currNumOfAccessFolder === 0) {
                        const CTL = "\r\n";
                        let prefixCountsStr = "";
                        let suffixCountsStr = "";
                        // 按预过滤的顺序显示各前缀计数
                        VALID_PREFIXES.forEach(prefix => {
                            prefixCountsStr += prefix + ": " + prefixCounts[prefix] + CTL;
                        });

                        // 按预过滤的顺序显示各后缀计数
                        VALID_SUFFIXES.forEach(suffix => {
                            suffixCountsStr += suffix + ": " + suffixCounts[suffix] + CTL;
                        });
                        strAlert = currentDir + CTL + CTL + "文件夹数量: " + numOfAllFolder + ", 文件数量: " + numOfAllFiles + CTL + "大小: " + getReadableFileSizeString(allFileSizeInBytes) + "  (" + allFileSizeInBytes.toLocaleString() + " Bytes)" + CTL + prefixCountsStr + suffixCountsStr;
                        GM_setClipboard(strAlert + CTL + CTL + allFilePath.sort().join("\r\n") + "\r\n");
                        // 计算耗时
                        let durationSecondsStr = ((Date.now() - startTime) / 1000).toFixed(2);
                        window.setTimeout(() => {
                            alert("📊 统计完成" + (includeSubDir ? "（含子文件夹）" : "（仅当前文件夹）") + "！耗时 " + durationSecondsStr + " 秒\n\n" + strAlert.replace(/\r\n/g, "\n") + "\n\n✅ 详细文件列表已复制到剪贴板");
                            // 解锁悬浮按钮
                            unlockButton();
                        }, 0);
                    }
                },
                onError: function(errorMessage) {
                    showError(errorMessage);
                }
            };

            try {
                fileListGetter.getList(filePath, callback);
            } catch (error) {
                showError("🔧 文件列表获取失败\n\n💡 提示：可能是API权限问题或者返回数据格式变更，请重试\n错误详情: " + error.message);
            }
        }

        // 错误提示
        function showError(info) {
            isGetListHasError = true;
            alert(info);
            unlockButton();
        }

    }

    // 锁定按钮的方法
    function lockButton() {
        // 设置处理状态
        isProcessing = true;
        setButtonText(BTN_RUNNING_TEXT + "...");
        button.style.backgroundColor = '#6c757d';
        button.style.cursor = 'not-allowed';
        button.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.4)';
    }

    // 解锁按钮的方法
    function unlockButton() {
        isProcessing = false;
        setButtonText(BTN_WAITING_TEXT);
        button.style.backgroundColor = buttonColorHex;
        button.style.cursor = 'pointer';
        button.style.boxShadow = `0 4px 12px ${buttonColorRgba}`;
    }

    // 解锁按钮的方法
    function setButtonText(text) {
        button.innerHTML = text;
        button.style.width = 'auto';
        void button.offsetWidth;
    }

    // 转换可读文件大小
    function getReadableFileSizeString(fileSizeInBytes) {
        let size = fileSizeInBytes; // 使用局部变量，避免修改参数
        let i = 0;
        const byteUnits = [' Bytes', ' KiB', ' MiB', ' GiB', ' TiB', ' PiB', ' EiB', ' ZiB', ' YiB'];
        while (size >= 1024) {
            size = size / 1024;
            i++;
        }
        return size.toFixed(2) + byteUnits[i];
    }


    // 文件列表获取器工厂
    class FileListGetterFactory {
        static createGetter(url, config) {
            if (url.includes("baidu.com")) {
                return new BaiduPanFileListGetter(config);
            }
            // 可以在这里添加其他云盘服务的判断
            // else if (url.includes("example.com")) {
            //     return new ExampleFileListGetter();
            // }
            throw new Error("不支持的URL: " + url);
        }
    }

    // 文件信息类
    class FileInfo {
        constructor(name, dir, path, size) {
            this.name = name;
            this.dir = dir;
            this.path = path;
            this.size = size;
        }

        getName() {
            return this.name;
        }

        isDir() {
            return this.dir;
        }

        getPath() {
            return this.path;
        }

        getSize() {
            return this.size;
        }
    }

    // 抽象文件列表获取器
    class AbstractFileListGetter {

        static METHOD_GET = 'GET';
        static METHOD_POST = 'POST';

        constructor(config = {}) {
            this.config = config;
        }

        // 获取当前目录
        getCurrentDirectory() {
            return "/";
        }

        init(){

        }

        // 发送HTTP请求的通用方法
        async sendRootRequest(url, method, data, callback) {
            GM_xmlhttpRequest({
                method: method,
                synchronous: false,
                url: url,
                data: data,
                timeout: 9999,
                onabort: function () {
                    callback.onError("⚠️ 网络请求被中断\n\n💡 提示：直接点击按钮重试即可");
                },
                onerror: function () {
                    callback.onError("❌ 网络请求失败\n\n💡 提示：请检查网络连接后重试");
                },
                ontimeout: function () {
                    callback.onError("⏰ 请求超时\n\n💡 提示：网络较慢，请稍后重试");
                },
                onload: async function (reText) {
                    let JSONObj = {};
                    try {
                        JSONObj = JSON.parse(reText.responseText);
                        // 调用子类的数据解析方法
                        const fileList = await callback.parseResponse(JSONObj, url, data, callback);
                        callback.onSuccess(fileList);
                    } catch (parseError) {
                        callback.onError("📄 数据解析失败\n\n错误详情: " + parseError.message);
                    }
                }
            });
        }

        // 同步发送请求的方法
        sendPageRequest(url, method, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    synchronous: false,
                    url: url,
                    data: data,
                    timeout: 9999,
                    onabort: function () {
                        reject(new Error("⚠️ 分页网络请求被中断"));
                    },
                    onerror: function () {
                        reject(new Error("❌ 分页网络请求失败"));
                    },
                    ontimeout: function () {
                        reject(new Error("⏰ 分页请求超时"));
                    },
                    onload: function (reText) {
                        try {
                            const JSONObj = JSON.parse(reText.responseText);
                            resolve(JSONObj);
                        } catch (parseError) {
                            reject(new Error("📄 分页数据解析失败: " + parseError.message));
                        }
                    }
                });
            });
        }


        // 抽象方法，子类必须实现
        getList(filePath, callback) {
            throw new Error("getList方法必须在子类中实现");
        }

        // 抽象方法，子类必须实现数据解析逻辑
        async parseResponse(jsonObj, url, data, callback) {
            throw new Error("parseResponse方法必须在子类中实现");
        }
    }

    // 百度网盘文件列表获取器实现
    class BaiduPanFileListGetter extends AbstractFileListGetter {

        static PAGE_SIZE = 1000;

        static BASE_URL_API = `https://pan.baidu.com/api/list?channel=chunlei&clienttype=0&web=1&num=${BaiduPanFileListGetter.PAGE_SIZE}&page=1&dir=`;

        constructor(config) {
            super(config);
        }

        getCurrentDirectory() {
            let url = document.URL;
            while (url.includes("%25")) {
                url = url.replace("%25", "%");
            }

            if (!url.includes("path=")) {
                return "/";
            } else if (url.includes("path=")) {
                let path = url.substring(url.indexOf("path=") + 5);
                if (path.includes("&")) {
                    path = path.substring(0, path.indexOf("&"));
                }
                return decodeURIComponent(path);
            }
        }

        getList(filePath, callback) {
            const url = BaiduPanFileListGetter.BASE_URL_API + encodeURIComponent(filePath);
            this.sendRootRequest(url, AbstractFileListGetter.METHOD_GET, null, callback);
        }

        // 实现数据解析逻辑
        async parseResponse(jsonObj, url, data, callback) {
            const allFileList = [];
            let currentUrl = url;
            
            // 使用while循环处理分页
            while (true) {
                if (jsonObj.errno !== 0) {
                    throw new Error("API响应错误，错误码: " + jsonObj.errno + "。可能是权限问题");
                }
                const fileList = [];
                const size_list = jsonObj.list.length;
                let curr_item = null;

                // 解析当前页数据
                for (let i = 0; i < size_list; i++) {
                    curr_item = jsonObj.list[i];
                    const fileInfo = new FileInfo(
                        curr_item.server_filename,
                        curr_item.isdir === 1,
                        curr_item.path,
                        curr_item.size
                    );
                    fileList.push(fileInfo);
                }
                
                // 将当前页数据添加到总列表中
                allFileList.push(...fileList);
                
                // 如果当前页文件数量小于页面大小，说明没有更多页了
                if (fileList.length < BaiduPanFileListGetter.PAGE_SIZE) {
                    break;
                }
                
                // 获取下一页URL
                let currentPage = 1;
                const numMatch = currentUrl.match(/&page=\d+/);
                if (numMatch) {
                    currentPage = parseInt(numMatch[0].replace('&page=', ''));
                }
                let nextPage = currentPage + 1;
                currentUrl = currentUrl.replace(/&page=\d+/, '&page=' + nextPage);
                
                // 请求下一页数据
                jsonObj = await this.sendPageRequest(currentUrl, AbstractFileListGetter.METHOD_GET, data);
            }
            
            return allFileList;
        }
    }

})();
